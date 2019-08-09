
/**
 * Open a pop up window to confirm if the user wants to load the topo map.
 */
function confirmTopoMapGenerate() {
  if (window.confirm("Do you want to generate a new contour map?")) {
    generatedContourMap.drawContours();
  }
}

/**
 * Used to save the image to the zipfile
 * @param  {[THREE.WebGLRenderer]} renderer [The renderer being used to screenshot the images]
 * @param  {[Integer]} tileNum  [The index of the tile in the map. Used to name the file.]
 * @param  {[JSZip.folder]} zipFile  [The zipfile to put the images in.]
 */
function saveAsImage(renderer, tileNum, zipFile) {
  var imgData, imgNode;
  var strDownloadMime = "image/octet-stream";

  try {
    var strMime = "image/png";
    imgData = renderer.domElement.toDataURL(strMime);
    imgData = imgData.substr(22);

    zipFile.file("TileNum" + tileNum + ".png", imgData, {
      base64: true
    });
  } catch (e) {
    console.log(e);
    return;
  }
}

/**
 * This function takes the array of meshes and uses a new renderer and camera to screen shot them and save them to a zip file for the user to save and then load.
 * @param  {[Array]} lines [A mesh for each tile that has all the lines that are on that tile.]
 */
function drawToCanvas(lines) {
  var printScene = new THREE.Scene();
  var printRenderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
    alpha: true
  });

  printRenderer.setClearColor(0x000000, 0);

  printRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(printRenderer.domElement);
  var texture = new THREE.Texture(printRenderer.canvas);
  texture.needsUpdate = true;

  var printCamera = camera.clone();

  // positions the camera so it will capture the picture correctly
  printCamera.position.x = tileWidth / 2.0;
  printCamera.position.y = 8;
  printCamera.position.z = tileHeight / 2.0;
  printCamera.aspect = tileWidth / tileHeight;
  printCamera.updateProjectionMatrix();

  // matches the size of files previously used because they work
  printRenderer.setSize(256, 128);

  var zip = new JSZip();
  var zipFile = zip.folder("images");

  for (var i = 0; i < lines.length; i++) {
    if (lines[i]) {

      // add the lines to the scene
      for (var j = 0; j < lines[i].length; j++) {
        printScene.add(lines[i][j]);
      }

      // render the scene and save it
      printRenderer.render(printScene, printCamera);
      saveAsImage(printRenderer, i, zipFile);

      // remove the lines from the scene
      for (var j = 0; j < lines[i].length; j++) {
        printScene.remove(lines[i][j]);
      }
    }
  }

  // save the zipfile after everything has been done
  zip.generateAsync({
      type: "blob"
    })
    .then(function(blob) {
      saveAs(blob, "topography.zip");
    });

}


/**
 * This object controls the majority of the generating and displaying of the contour map.
 * @constructor
 */
function ContourMap() {

  this.map = boardData[currentBoard].map;
  this.pointsOfIntersection = new THREE.Geometry();
  this.meshLine = new MeshLine();
  this.meshLineMaterial = new MeshLineMaterial({
    color: 'black',
    lineWidth: 0.5
  });
  this.mapIsOn = false;
  this.mapIs2D = false;
  this.mapis3D = false;
  this.tileImages = createTopoMeshes(this.map);

/**
 * [This functions controls all of the generating of the contour map. It then calls drawToCanvas() to have the lines drawn out and saved to a zip file.]
 */
  this.drawContours = function() {

    //These 4 lines find the highest and lowest point to help set the interval.
    var min = this.findMin();
    var max = this.findMax();
    var numContours = 10;
    var interval = (max - min) / numContours;

    // array that was used to hold all the lines
    //var lines = [];
    var meshLines = [];

    var material = new THREE.LineBasicMaterial({
      color: 'black'
    });

    // this loop goes through the entire map at each height where there is a plane
    for (var i = min + 1; i < max; i += interval) {
      var plane = this.drawPlane(i);

      // this loop goes through all the mesh faces (2 per tile) to check for intersections with the mesh line
      for (var j = 0; j < meshGeometry.faces.length; j++) {

        // these are the points of the mesh
        let a = meshGeometry.vertices[meshGeometry.faces[j].a]
        let b = meshGeometry.vertices[meshGeometry.faces[j].b]
        let c = meshGeometry.vertices[meshGeometry.faces[j].c]

        // make lines between the points of the mesh so that we can see if the plane intersects them
        let lineAB = new THREE.Line3(a, b);
        let lineBC = new THREE.Line3(b, c);
        let lineCA = new THREE.Line3(c, a);

        // this geometry has vertices that match the vertices of the tiles on the map, they are not altered using the subtractPoints methods
        // this geometry was used when we were simply drawing the lines on to the map instead of doing the images thing
        /*
        let points = new THREE.Geometry();
        if (this.setPointOfIntersection(lineAB, plane)) points.vertices.push(this.setPointOfIntersection(lineAB, plane));
        if (this.setPointOfIntersection(lineBC, plane)) points.vertices.push(this.setPointOfIntersection(lineBC, plane));
        if (this.setPointOfIntersection(lineCA, plane)) points.vertices.push(this.setPointOfIntersection(lineCA, plane));
        */


        // this geometry has vertices that are changed using the subtractPoints methods
        // we first used this geometry to make line2 with THREE.LineBasicMaterial, but this was not very visible when layed over the map, now we use MeshLine and the liens are much more visible
        let points2 = new THREE.Geometry();
        if (this.setPointOfIntersection(lineAB, plane)) points2.vertices.push(this.subtractPoints(this.setPointOfIntersection(lineAB, plane), this.map[Math.floor(j / 2)].position));
        if (this.setPointOfIntersection(lineBC, plane)) points2.vertices.push(this.subtractPoints(this.setPointOfIntersection(lineBC, plane), this.map[Math.floor(j / 2)].position));
        if (this.setPointOfIntersection(lineCA, plane)) points2.vertices.push(this.subtractPoints(this.setPointOfIntersection(lineCA, plane), this.map[Math.floor(j / 2)].position));

        //the lines created with points and points2
        /*
        var line = new THREE.LineSegments(points, material);
        var line2 = new THREE.LineSegments(points2, material);
        */

        // only creates a meshline if there are contour lines on that tile
        if (points2.vertices[0] && this.map[Math.floor(j / 2)].baseLandUseType != 0) {

          this.meshLine = new MeshLine();
          this.meshLine.setGeometry(points2);

          var mesh = new THREE.Mesh(this.meshLine.geometry, this.meshLineMaterial);

          meshLines[Math.floor(j / 2)] = meshLines[Math.floor(j / 2)] || [];
          meshLines[Math.floor(j / 2)].push(mesh);

          // this is where we added the line2 to an arry just like we do with the meshLines right above here
          /*
          lines[Math.floor(j / 2)] = lines[Math.floor(j / 2)] || [];
          lines[Math.floor(j / 2)].push(line2);
          */
        }
      }
    }

    drawToCanvas(meshLines);
  }

  /**
   * [Adjust the vertices so that the vertices are (0,0)-----(tileWidth,0)
   *                                                 :            :
   *                                                 :            :
   *                                                 :            :
   *                                       (0,tileHeight)----(tileWidth, tileHeight)
   *  Instead of the coordinates on the screen. This is used to screenshot the image because it allows us to place
   *  all the images in the same position so we do not have to move the camera.]
   * @param  {[Vector3]} p1 [The point of intersection between the line and the plane]
   * @param  {[Vector3]} p2 [The position of the corresponding tile on the map.]
   * @return {[Vector3]}    [Position scaled to above dimensions]
   */
  this.subtractPoints = function(p1, p2) {
    return new THREE.Vector3(p1.x - p2.x, 0, p1.z - p2.z);
  }

/**
 * [Finds where the plane intersects the lines on the mesh objects. Returns the point of intersection if it crosses.]
 * @param  {[Line]} line  [Line between corners of the mesh.]
 * @param  {[Plane]} plane [Plane at a certain height]
 * @return {[Vector3]}       [The point where the plane intersects the line of the mesh]
 */
  this.setPointOfIntersection = function(line, plane) {
    let pointOfIntersection = plane.intersectLine(line);
    if (pointOfIntersection) {
      pointOfIntersection.y += 1;
      return pointOfIntersection;
    };
  }

  /**
   * [Finds the lowest point on the entire map by calling getMaxCorner() on every tile]
   * @return {[Float]} [lowest point on the map.]
   */
  this.findMin = function() {
    var min = this.getMinCorner(this.map[0]);

    for (var i = 1; i < this.map.length; i++) {
      if (this.getMinCorner(this.map[i]) < min) {
        min = this.getMinCorner(this.map[i]);
      }
    }
    return min;
  }

/**
 * [Finds the highest point on the entire map by calling getMaxCorner() on every tile]
 * @return {[Float]} [Highest point on the map.]
 */
  this.findMax = function() {
    var max = this.getMaxCorner(this.map[0]);
    for (var i = 1; i < this.map.length; i++) {
      if (this.getMaxCorner(this.map[i]) > max) {
        max = this.getMaxCorner(this.map[i]);
      }
    }
    return max;
  }

/**
 * [Finds lowest point of given tile. Used to set the interval for the contour lines.]
 * @param  {[Tile]} tile [Tile to be examined.]
 * @return {[Float]}      [Lowest point for the given tile.]
 */
  this.getMinCorner = function(tile) {
    var shortest = tile.h1;
    if (tile.h2 < shortest) {
      shortest = tile.h2;
    }
    if (tile.h3 < shortest) {
      shortest = tile.h3;
    }
    if (tile.h4 < shortest) {
      shortest = tile.h4;
    }

    return shortest;
  }

/**
 * [Finds the highest corner of the tile when it is in 3D mode. Used to determine the highest point on the map so that a reasonable interval for the contour lines can be set.]
 * @param  {[Tile]} tile [Tile to be examined.]
 * @return {[Float]}      [The highest altitude value for the given tile.]
 */
  this.getMaxCorner = function(tile) {
    var highest = tile.h1;
    if (tile.h2 > highest) {
      highest = tile.h2;
    }
    if (tile.h3 > highest) {
      highest = tile.h3;
    }
    if (tile.h4 > highest) {
      highest = tile.h4;
    }

    return highest;
  }


/**
 * [Draws a plane that is used to intersect the map in 3D mode. This is used when generating the contour map from scratch.]
 * @param  {[Float]} height [The height the plane will be at. Depends on the number of intervals (contour lines) desired for the map.]
 * @return {[Plane]}        [A plane object that is used to intersect the map.]
 */
  this.drawPlane = function(height) {
    var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -height);
    return plane;
  }

  /**
   * [This function toggles the topographic map off or on for both 2D and 3D mode.]
   */
  this.toggleTopoMap = function() {

    if (tToggle) {
      if (this.mapIsOn) {
        for (var i = 0; i < this.tileImages3D.length; i++) {
          scene.remove(this.tileImages3D[i])
          this.mapIsOn = false;
          this.mapIs3D = false;
        }
      } else {
        for (var i = 0; i < this.tileImages3D.length; i++) {
          scene.add(this.tileImages3D[i])
          this.mapIsOn = true;
          this.mapIs3D = true;
        }
      }
    } else {

      if (this.mapIsOn) {
        for (var i = 0; i < this.tileImages.length; i++) {
          scene.remove(this.tileImages[i])
          this.mapIsOn = false;
          this.mapIs2D = false;
        }
      } else {
        for (var i = 0; i < this.tileImages.length; i++) {
          scene.add(this.tileImages[i])
          this.mapIsOn = true;
          this.mapIs2D = true;
        }
      }
    }
  }

/**
 * [This function handles changing the contour map images from 2D to 3D or 3D to 2D if topographic mode is toggled while the map is being displayed.]
 */
  this.change2D3D = function() {

    if (this.mapIs2D) {
      for (var i = 0; i < this.tileImages3D.length; i++) {
        scene.remove(this.tileImages[i]);
        scene.add(this.tileImages3D[i]);
        this.mapIs2D = false;
        this.mapIs3D = true;
      }
    } else if (this.mapIs3D) {
      for (var i = 0; i < this.tileImages.length; i++) {
        scene.remove(this.tileImages3D[i]);
        scene.add(this.tileImages[i]);
        this.mapIs3D = false;
        this.mapIs2D = true;
      }
    }
  }

  /**
   * [Works just like createTopoMeshes, but for the 3D map]
   * @param  {[type]} map [description]
   * @return {[type]}     [description]
   */
  this.create3DTopoMeshes = function(map) {

    var meshArray = [];

    for (var i = 0; i < map.length; i++) {

      var material = new THREE.MeshBasicMaterial({
        map: loadTopoImage(i),
        transparent: true,
        opacity: 1,
        color: 'black',
        side: THREE.DoubleSide
      });

      // setting these false makes the transparency render correctly
      material.depthWrite = false;
      material.depthTest = false;

      var geometry = new THREE.Geometry();
      let tile = map[i];

      //these are switched around from the add tile method because their images are backwards, I also added a geometry.applyMatrix call below that flips the image over its x axis
      geometry.vertices.push(new THREE.Vector3(0, tile.h2, 0));
      geometry.vertices.push(new THREE.Vector3(tileWidth, tile.h1, 0));
      geometry.vertices.push(new THREE.Vector3(tileWidth, tile.h4, tileHeight));
      geometry.vertices.push(new THREE.Vector3(0, tile.h3, tileHeight));

      // faces and faceVertexUvs are copied over from addTile()
      var face = new THREE.Face3(2, 1, 0);
      face.normal.set(0, 1, 0); // normal
      geometry.faces.push(face);
      geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]); // uvs

      face = new THREE.Face3(3, 2, 0);
      face.normal.set(0, 1, 0); // normal
      geometry.faces.push(face);
      geometry.faceVertexUvs[0].push([new THREE.Vector2(1, 0), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)]); // uvs


      // scale x by -1, it orients the image correctly
      geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

      var mesh = new THREE.Mesh(geometry, material);

      var position = boardData[currentBoard].map[i].position;

      //adjust position befause one is based on the center on the other is based on the top right corner
      mesh.position.set(position.x + 18, position.y + 1, position.z);

      mesh.updateMatrix();

      meshArray.push(mesh);

    }
    return meshArray;
  }

  // called odwn here because it has to be after the function declaration
  this.tileImages3D = this.create3DTopoMeshes(this.map);
}


/**
 * [This function loads the png files so they can be displayed. Apparently the THREE.TextureLoader automatically ignores files that do not exist, so we do not need to worry about that.]
 * @param  {[Integer]} tileNumber [The tile number to load, corresponds to the spot of the tile in the map array]
 * @return {[Not Sure]}            [A texture or something that is loaded to a materials map attribute]
 */
function loadTopoImage(tileNumber) {
  var textureLoader = new THREE.TextureLoader();

  //this changes depending on the file location
  var string = './imgs/topography/images/TileNum';
  try{
    return textureLoader.load(string + tileNumber + '.png');
  }
  catch(err){}
}

/**
 * [This function creates an array that holds the contour map images for the 2D version of the contour map, it could probably be placed in the object, but everything is working fine.]
 * @param  {[Array]} map [The current map, gets passed from the contour map object that calls this function]
 * @return {[Array]}     [Array of meshes that have the images for the contour map as their texture.]
 */
function createTopoMeshes(map) {

  var meshArray = [];

  for (var i = 0; i < map.length; i++) {

    var material = new THREE.MeshBasicMaterial({
      map: loadTopoImage(i),
      transparent: true,
      opacity: 1,
      color: 'black'
    });

    // setting these false makes the transparency render correctly
    material.depthWrite = false;
    material.depthTest = false;

    var geometry = new THREE.PlaneGeometry(tileWidth, tileHeight);

    var mesh = new THREE.Mesh(geometry, material);

    // get the position of the corresponding tile in the map
    var position = boardData[currentBoard].map[i].position;

    //adjust position befause x,y = 0 for the mesh is the middle and it is the top left corner for the tile from the map
    mesh.position.set(position.x + 9, position.y + 1, position.z + 6);

    //makes the tiles parallel to the map
    mesh.quaternion.copy(camera.quaternion);

    mesh.updateMatrix();

    meshArray.push(mesh);

  }

  return meshArray;
}
