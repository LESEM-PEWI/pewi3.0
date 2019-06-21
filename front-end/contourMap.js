

function drawGrid(c, canvas, map, lines) {
   var rectXPos = 50;
  var rectYPos = 50;
  var rectWidth = 40;
  var rectHeight = 25;

// if the map size ever changes, the array variables need to be changed
  for (var j = 0; j < 36; j++)
  {
    rectYPos = 50 + j * 25;
    for (var i = 0; i < 23; i++)
    {
      rectXPos = 40 * i + 50;
       if(map[i +(j*23)].baseLandUseType != 0)
       {
        //drawBorder(rectXPos, rectYPos, rectWidth, rectHeight, c);
        // c.fillStyle=getColor(map[i+(j*23)].topography);
        // c.fillRect(rectXPos, rectYPos, rectWidth, rectHeight);

        drawMapLines(lines[i + (j *23)], rectXPos, rectYPos, c);
      }
    }
    rectXPos = 50;
  }
}




function drawBorder(xPos, yPos, width, height, c)
{
  thickness = 1;
  c.fillStyle='#000';
  c.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

/**
 * This function bring all the pieces together and puts the contour map over the current map.
 * @param   map: This is the map on screen. Done this way to be modular in case it changes in the future.
 */
function createContourMap(c, canvas)
{
  var map = boardData[currentBoard].map;

  var lines = getLines(map);

  drawGrid(c, canvas, map, lines);
}

/**
 * This function goes through the map and checks to the side of every tile. If the adjacent tiles have a different elevation / topography value, that side is pushed to an array for that tile so we know there needs to tbe a contour line there.
 * @param  {[Array]} map [The current board]
 * @return {[Array]}     [An array with each tile, and where they need to have contour lines around them]
 */
function getLines(map)
{

  var toReturn = [];
  for(var i = 0; i < map.length; i++)
  {
    var row = parseInt(map[i].row);
    var col = parseInt(map[i].column);
    var topo = map[i].topography;

    var thisCellsLines = [];
    if(map[i].baseLandUseType != 0)
    {
      //check the tile above
      if(row == 1 || map[getID(row - 1, col) - 1].topography != topo || map[getID(row - 1, col) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("top");
        map[i].contourLines.push("top");
      }

      //check the tile below
      if(row == 36 || map[getID(row + 1, col) - 1].topography != topo || map[getID(row + 1, col) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("bottom");
        map[i].contourLines.push("bottom");
      }

      //check the tile to the right
      if(col == 23 || map[getID(row, col + 1) - 1].topography != topo || map[getID(row, col + 1) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("right");
        map[i].contourLines.push("right");
      }

      //check the tile to the left
      if(col == 1 || map[getID(row, col - 1) - 1].topography != topo || map[getID(row, col - 1) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("left");
        map[i].contourLines.push("left");
      }

      //checking to see if the diagonals shared the topo value for smooth line purposes
      if(row != 1)
      {
        if (col != 1 && map[getID(row -1, col -1)].topography == topo && map[getID(row - 1, col - 1)].baseLandUseType != 0 && !(thisCellsLines.includes("top")) && !(thisCellsLines.includes("left")))
        {
          thisCellsLines.push("top left");
        }
        if (col != 23 && map[getID(row - 1, col + 1)].topography == topo && map[getID(row - 1, col + 1)].baseLandUseType != 0 && !(thisCellsLines.includes("top")) && !(thisCellsLines.includes("right")))
        {
          thisCellsLines.push("top right");
        }
      }

      if(row != 36)
      {
        if(col != 1 && map[getID(row + 1, col - 1)].topography == topo && map[getID(row + 1, col - 1)].baseLandUseType != 0 && !(thisCellsLines.includes("bottom")) && !(thisCellsLines.includes("left")))
        {
          thisCellsLines.push("bottom left");
        }

        if (col != 23 && map[getID(row + 1, col + 1)].topography == topo && map[getID(row + 1, col + 1)].baseLandUseType != 0 && !(thisCellsLines.includes("bottom")) && !(thisCellsLines.includes("right")))
        {
          thisCellsLines.push("bottom right");
        }
      }


    }
    toReturn.push(thisCellsLines);
  }
  return toReturn;
}

function getID(row, col)
{
  return 23 * (row - 1) + col;
}

/**
 * Open a pop up window to confirm if the user wants to load the topo map.
 */
function confirmTopoMap()
{
  if(window.confirm("Do you want to load the contour map?"))
  {
    // // var myWindow = window.open("file:///C:/Users/jweiland/Desktop/PEWI/CODE/pewi3.0/htmlFrames/contourMap.html");
    // var myWindow = window.open();
    // paper.install(window);
    //
    //
    //
    //
    //
    // var html = "<!doctype html><html><head><title> Contour Map </title><style type=text/css>canvas{border: 1px solid black;}body{margin: 0;}</style></head><body><canvas id=mapCanvas></canvas></body></html>"
    // myWindow.document.open();
    // myWindow.document.write(html);
    // myWindow.document.close();
    //
    //
    // var canvas = myWindow.document.getElementById("mapCanvas");
    //
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    //
    // console.log("before");
    // paper.setup(canvas);
    // console.log("after");
    //
    // var c = canvas.getContext('2d');
    // createContourMap(c, canvas);
    //
  }
}

function drawMapLines(tile, x, y, c){

  c.lineWidth = 3;
  var path = new Path({
	segments: [[30, 75], [30, 25], [80, 25], [80, 75]],
	strokeColor: 'black',
	closed: true
});

  if(tile.includes("top")){
    c.beginPath();
    c.lineTo(x,y);
    c.lineTo(x+40,y);
    c.stroke();
  }

  if(tile.includes("right")){
    c.beginPath();
    c.lineTo(x+40, y);
    c.lineTo(x+40, y+25);
    c.stroke();
  }

  if(tile.includes("bottom")){
    c.beginPath();
    c.lineTo(x, y+25);
    c.lineTo(x+40, y+25);
    c.stroke();
  }

  if(tile.includes("left")){
    c.beginPath();
    c.lineTo(x, y+25);
    c.lineTo(x, y);
    c.stroke();
  }
}

function getColor(value)
{
  if(value == 0)
  {
    return "#EBEDEF";
  }

  if(value == 1)
  {
    return "#AEB6BF";
  }

  if(value == 2)
  {
    return "#5D6D7E";
  }

  if(value == 3)
  {
    return "#2E4053";
  }

  if(value == 4)
  {
    return "#212F3C";
  }

  if(value == 5)
  {
    return "#17202A";
  }

  return 'white';
}

/*
New stuff using three.js
 */

function ContourMap(){

  this.map = boardData[currentBoard].map;
  this.pointsOfIntersection = new THREE.Geometry();


  this.drawLine = function(){
    var material = new THREE.LineBasicMaterial( { color: 'black'} );
    var geometry = new THREE.Geometry();

    // geometry.vertices.push(new THREE.Vector3( -189, 30, -204) );
    // geometry.vertices.push(new THREE.Vector3( 200, 30, 216) );

    geometry.vertices.push(new THREE.Vector3(this.map[0].position.x, this.map[0].position.y + 1, this.map[0].position.z));
    geometry.vertices.push(new THREE.Vector3(this.map[0].position.x + tileWidth, this.map[0].position.y + 1, this.map[0].position.z + tileHeight));

    var line = new THREE.Line( geometry, material );

    scene.add( line );
    renderer.render(scene, camera);



  }

  this.drawContours = function()
  {
    var min = this.findMin();
    var max = this.findMax();
    var numContours = 10;
    var interval = (max - min) / numContours;

    var material = new THREE.LineBasicMaterial( { color: 'black'} );

    for (var i = min + 1; i < max; i+=interval)
    {
      var plane = this.drawPlane(i);
      for(var j = 0; j < meshGeometry.faces.length; j++){
        let a = meshGeometry.vertices[meshGeometry.faces[j].a]
        let b = meshGeometry.vertices[meshGeometry.faces[j].b]
        let c = meshGeometry.vertices[meshGeometry.faces[j].c]
        let lineAB = new THREE.Line3(a, b);
        let lineBC = new THREE.Line3(b, c);
        let lineCA = new THREE.Line3(c, a);
        let points = new THREE.Geometry();
        if(this.setPointOfIntersection(lineAB, plane)) points.vertices.push(this.setPointOfIntersection(lineAB, plane));
        if(this.setPointOfIntersection(lineBC, plane)) points.vertices.push(this.setPointOfIntersection(lineBC, plane));
        if(this.setPointOfIntersection(lineCA, plane)) points.vertices.push(this.setPointOfIntersection(lineCA, plane));
        var line = new THREE.LineSegments( points, material );
        //var notCorn = this.map[Math.floor(j/2)].baseLandUseType != 0;
        if(points.vertices[0] && this.map[Math.floor(j/2)].baseLandUseType != 0){
          scene.add(line);
        }
      }
    }

    var line = new THREE.LineSegments( this.pointsOfIntersection, material );
    scene.add(line);
    renderer.render(scene, camera)
  }

  this.setPointOfIntersection = function(line, plane) {
    let pointOfIntersection = plane.intersectLine(line);
    if (pointOfIntersection) {
      pointOfIntersection.y +=1;
      // this.pointsOfIntersection.vertices.push(pointOfIntersection.clone());
      return pointOfIntersection;
    };
  }

  this.findMin = function()
  {
    var min = this.getMinCorner(this.map[0]);

    for(var i = 1; i < this.map.length; i++)
    {
      if(this.getMinCorner(this.map[i]) < min)
      {
        min = this.getMinCorner(this.map[i]);
      }
    }
    return min;
  }

  this.findMax = function()
  {
    var max = this.getMaxCorner(this.map[0]);
    for(var i = 1; i < this.map.length; i++)
    {
      if(this.getMaxCorner(this.map[i]) > max)
      {
        max = this.getMaxCorner(this.map[i]);
      }
    }
    return max;
  }

  this.getMinCorner = function(tile)
  {
    var shortest = tile.h1;
    if(tile.h2 < shortest)
    {
      shortest = tile.h2;
    }
    if(tile.h3 < shortest)
    {
      shortest = tile.h3;
    }
    if(tile.h4 < shortest)
    {
      shortest = tile.h4;
    }

    return shortest;
  }

  this.getMaxCorner = function(tile)
  {
    var highest = tile.h1;
    if(tile.h2 > highest)
    {
      highest = tile.h2;
    }
    if(tile.h3 > highest)
    {
      highest = tile.h3;
    }
    if(tile.h4 > highest)
    {
      highest = tile.h4;
    }

    return highest;
  }

  this.getPointLocation = function(corner1, corner2, height)
  {

  }

  this.drawPlane = function(height)
  {
    var plane = new THREE.Plane(new THREE.Vector3(0,1,0), -height);


    return plane;
  }


}
