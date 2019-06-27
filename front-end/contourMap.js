
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
  }
}

function saveAsImage(renderer, tileNum) {
        var imgData, imgNode;
         var strDownloadMime = "image/octet-stream";

        try {
            var strMime = "image/png";
            imgData = renderer.domElement.toDataURL(strMime);

            saveFile(imgData.replace(strMime, strDownloadMime), "testTileNum" + tileNum + ".png");

        } catch (e) {
            console.log(e);
            return;
        }

    }

    var saveFile = function (strData, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            document.body.appendChild(link); //Firefox requires the link to be in the body
            link.download = filename;
            link.href = strData;
            link.click();
            document.body.removeChild(link); //remove the link when done
        } else {
            location.replace(uri);
        }
    }

function drawToCanvas(lines)
{
  var printScene = new THREE.Scene();
  printScene.background = new THREE.Color( 0xffffff );
  var printRenderer = new THREE.WebGLRenderer({preserveDrawingBuffer : true});
  // printRenderer.setSize(tileWidth, tileHeight);
  printRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( printRenderer.domElement);
  var texture = new THREE.Texture(printRenderer.canvas);
  texture.needsUpdate = true;
  // var printCamera = new THREE.PerspectiveCamera(90, 180/120, 0.1, 1000);
  var printCamera = camera.clone();
  printCamera.position.x = tileWidth/2;
  printCamera.position.y = 5;
  printCamera.position.z = tileHeight/2;

  // for (var i = 0; i < lines.length; i++)
  // {
  //   printScene.add(lines[i]);
  // }
  // lines.forEach(line => {
  //    printScene.add(line);
  // });
  for(var i = 0; i < lines.length; i++)
  {
    if(lines[i]){
      for(var j = 0; j < lines[i].length; j++)
      {
        printScene.add(lines[i][j]);
      }
      printRenderer.render(printScene, printCamera);
      //window.open(printRenderer.domElement.toDataURL('image/png'), 'screenshot' + i);
      saveAsImage(printRenderer, i);
      for(var j = 0; j < lines[i].length; j++)
      {
        printScene.remove(lines[i][j]);
      }

    }
  }

  // printRenderer.render(printScene, camera);
  // window.open(printRenderer.domElement.toDataURL('image/png'), 'screenshot');
   // scene.add(lines);
  // renderer.render(scene, camera);
  //saveAsImage(printRenderer);
}



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

    var lines = [];

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

        let points2 = new THREE.Geometry();
        if(this.setPointOfIntersection(lineAB, plane)) points2.vertices.push(this.subtractPoints(this.setPointOfIntersection(lineAB, plane), this.map[Math.floor(j/2)].position));
        if(this.setPointOfIntersection(lineBC, plane)) points2.vertices.push(this.subtractPoints(this.setPointOfIntersection(lineBC, plane), this.map[Math.floor(j/2)].position));
        if(this.setPointOfIntersection(lineCA, plane)) points2.vertices.push(this.subtractPoints(this.setPointOfIntersection(lineCA, plane), this.map[Math.floor(j/2)].position));
        var line = new THREE.LineSegments( points, material );
        var line2 = new THREE.LineSegments( points2, material );


        if(points.vertices[0] && this.map[Math.floor(j/2)].baseLandUseType != 0){
          lines[Math.floor(j/2)] = lines[Math.floor(j/2)] || [];
          scene.add(line);

           var index = Math.floor(j/2);
            lines[Math.floor(j/2)].push(line2);
        }


      }
    }
    drawToCanvas(lines);
    renderer.render(scene, camera);



  }

  this.subtractPoints = function(p1, p2){
    return new THREE.Vector3(p1.x - p2.x, 0, p1.z - p2.z);
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
