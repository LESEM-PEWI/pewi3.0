
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

function saveAsImage(renderer) {
        var imgData, imgNode;
         var strDownloadMime = "image/octet-stream";

        try {
            var strMime = "image/png";
            imgData = renderer.domElement.toDataURL(strMime);

            saveFile(imgData.replace(strMime, strDownloadMime), "test.png");

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
  var printScene = new THREE.Scene;
  var printRenderer = new THREE.WebGLRenderer;
  printRenderer.setSize(400,400);
  var printCamera = new THREE.PerspectiveCamera(35, 180/120, 0.1, 10000);

  for (var i = 0; i < lines.length; i++)
  {
    printScene.add(lines[i]);
  }

  printRenderer.render(printScene, printCamera);
  saveAsImage(printRenderer);
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
        var line = new THREE.LineSegments( points, material );


        if(points.vertices[0] && this.map[Math.floor(j/2)].baseLandUseType != 0){
          scene.add(line);
          lines.push(line);
        }


      }
    }
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
