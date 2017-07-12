/* global camera, scene, boardData,
          renderer, currentBoard, THREE,
          currentYear, textureArray, riverPoints,
          mouse, raycaster,
          isShiftDown, modalUp, precip,
          painter, Totals, river,
          Results, initData, hoveredOver, currentPlayer*/

var currentRow = -1;
var leftToolConsoleWasOpen;
var rightPopupWasOpen;
var meshGeometry = new THREE.Geometry();
var click;
var meshMaterials = [];
var tileHeight = 12;
var tileWidth = 18;
var rowCutOffs = []; //y coor of top left corner of each tile
var columnCutOffs = [];
var mesh = null;
var highlightedTiles = [];
var hoverOverride = false;
var currentHighlightType = 0;
var currentHighlightTypeString = null;
var immutablePrecip = false;
var clickAndDrag = false;
var undoArr = [[],[],[],[]];
var undoGridArr = [];
var undoGridPainters = [];
var undo = false;
var previousTab = null;
var overlayedToggled = false;
var inResults = false;
var inDispLevels = false;
var curTracking = false;
var startTime;
var endTime;
var curTime;
var simulationData;
var runningSim = false;
var randomzing = false;
var previousOverlay = null;
var previousTab = null;
var overlayedToggled = false;
var addingYearFromFile=false;//Boolean used to keep a track of whether or not you're adding a year from file


var inResults = false;
var inDispLevels = false;
var birds = [],
  bird;
var boids = [],
  boid;
var clearToChangeLandType = true;
var fullBoardBeforeZoom, zIsDown, oneIsDown;

var painterTool = {
  status: 0,
  startTile: 0,
  endTile: 0,
  hover: false
};
var myTimer = null;
var mainTimer = [];
var exitTimer;
var sliderTimer;
var timeStopped;
var timeResumed;
var pauseDuration = 0;
var elapsedTime;
var cur;
var paused = false;
var randomizing = false;
var simBoard;
var playerCombo = [];
var totalPlayers = 0;
var merging = false;
var resetting = false;
var hotkeyArr = [[69,null],[82,null],[84,null],[85,null],[66,null],[86,null],[68,null],[65,null],[87,null],[83,null],[79,null],[81,null]];

//Used for preventing users from exiting (click-tracking mode)
window.onbeforeunload = confirmExit;

function confirmExit() {
  if (curTracking) {
    pushClick(0, getStamp(), 2, 0, null);
    return "You are currently in click-tracking mode, please stay on the page. To refresh, please leave click-tracking mode";
  }
}

//Returns the value of curTracking
function getTracking() {
  return curTracking;
} //end getTracking()

//Creates a click object and pushes it into the click array (Useful for remote functions)
function pushClick(id, stamp, type, gap, tile) {
  click = new Click(id, stamp, type, gap, tile);
  clickTrackings.push(click);
} //end pushClick()

//onResize dynamically adjusts to window size changes
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
} //end onResize

//displayBoard initializes a board with graphics using addTile()
//only needs to be called when an entirely new board is loaded, since each
//tile is created from scratch
function displayBoard() {

  riverPoints = [];

  //loop through all tiles and addTile to the meshGeometry and meshMaterials objects
  for (var i = 0; i < boardData[currentBoard].map.length; i++) {
    addTile(boardData[currentBoard].map[i]);
  }

  //Add material indicies in order to facilitate texture changes
  for (var i = 0; i < meshGeometry.faces.length; i += 2) {
    meshGeometry.faces[i].materialIndex = i / 2;
    meshGeometry.faces[i + 1].materialIndex = i / 2;
  }

  //create one mesh from the meshGeometry and meshMaterials objects
  mesh = new THREE.Mesh(meshGeometry, new THREE.MeshFaceMaterial(meshMaterials));
  scene.add(mesh);

  //calculate locations of tiles on grid for highlighting and landType changes
  calculateCutoffs();
} //end displayBoard

//highlightTile updates the tile that should be highlighted.
function highlightTile(tileId) {

  //clear the information in the delayed information hover div
  document.getElementById("hover-info").innerHTML = "";
  if (myTimer != null) {
    clearTimeout(myTimer);
  }

  //if a previous tile was selected for highlighting, unhighlight that tile
  if (previousHover != null) {
    meshMaterials[previousHover].emissive.setHex(0x000000);
  }

  //highlight the new tile
  //if not a tile
  if (tileId != -1 && !modalUp) {

    //remove currently highlighted land type from HUD if over a clear tile
    if (boardData[currentBoard].map[tileId].landType[currentYear] == 0 ||
      boardData[currentBoard].map[tileId].landType[0] == -1) {

      showInfo("Year: " + currentYear + "&#160;&#160;&#160;Precipitation: " + printPrecipYearType() + "&#160;&#160;&#160;Current Selection: " + printLandUseType(painter) + "&#160;&#160;&#160;");

      document.getElementById('hover-info').innerHTML = "";

    } else {

      //Highlight a nonzero land type tile
      meshMaterials[tileId].emissive.setHex(0x7f7f7f);
      previousHover = tileId;

      //update HUD with current information
      //Bottom part of screen
      showInfo("Year: " + currentYear + "&#160;&#160;&#160;Precipitation: " + printPrecipYearType() + "&#160;&#160;&#160;Current Selection: " + printLandUseType(painter) + "&#160;&#160;&#160;" + printLandUseType(boardData[currentBoard].map[tileId].landType[currentYear]));

      //update the information displayed in the delayed hover div by cursor
      myTimer = setTimeout(function()
      {
        document.getElementById("hover-info").innerHTML = "(" + boardData[currentBoard].map[tileId].row + "," + boardData[currentBoard].map[tileId].column + ")" + "<br>" + getHighlightedInfo(tileId) + "\n" + "Land Cover: " + printLandUseType(boardData[currentBoard].map[tileId].landType[currentYear]) + "<br>" + "Precipitation: " + printPrecipYearType() + "<br>" + "Soil Type: " + printSoilType(tileId);
      //May use strings and iterate through them for removing hover information
      var info1 = "Land Cover: " + printLandUseType(boardData[currentBoard].map[tileId].landType[currentYear]) ;
      var info2 = "Precipitation: " + printPrecipYearType();
      var info3 = "Soil Type: " + printSoilType(tileId);
          if(document.getElementById('parameters').innerHTML.includes('hover1'))
          {
            document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info1 + "<br>", '');
            //document.getElementById("hover-info").innerHTML = "(" + boardData[currentBoard].map[tileId].row + "," + boardData[currentBoard].map[tileId].column + ")" + "<br>" + getHighlightedInfo(tileId)  + "Precipitation: " + printPrecipYearType() + "<br>" + "Soil Type: " + printSoilType(tileId);
          }
          if(document.getElementById('parameters').innerHTML.includes('hover2'))
          {
            document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info2 + "<br>", '');
            //document.getElementById("hover-info").innerHTML = "(" + boardData[currentBoard].map[tileId].row + "," + boardData[currentBoard].map[tileId].column + ")" + "<br>" + getHighlightedInfo(tileId)  + "Precipitation: " + printPrecipYearType() + "<br>" + "Soil Type: " + printSoilType(tileId);
          }
          if(document.getElementById('parameters').innerHTML.includes('hover3'))
          {
            document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info3, '');
            //document.getElementById("hover-info").innerHTML = "(" + boardData[currentBoard].map[tileId].row + "," + boardData[currentBoard].map[tileId].column + ")" + "<br>" + getHighlightedInfo(tileId)  + "Precipitation: " + printPrecipYearType() + "<br>" + "Soil Type: " + printSoilType(tileId);
          }
      }, 500);
    }

  } else {

    //If not over any land tile, update HUD accordingly
    showInfo("Year: " + currentYear + "&#160;&#160;&#160;Precipitation: " + printPrecipYearType() + "&#160;&#160;&#160;Current Selection: " + printLandUseType(painter) + "&#160;&#160;&#160;");

    document.getElementById("hover-info").innerHTML = "";

  }

} //end highlightTile

//changeLandTypeTile changes the landType of a selected tile
function changeLandTypeTile(tileId) {
  //Add tile to the undoArr
  if(!undo) {
    addChange(tileId);
  }
  //if land type of tile is nonzero
  if (boardData[currentBoard].map[tileId].landType[currentYear] != 0) {
    //change the materials of the faces in the meshMaterials array and update the boardData
    if (!multiplayerAssigningModeOn) {
      meshMaterials[tileId].map = textureArray[painter];
      boardData[currentBoard].map[tileId].landType[currentYear] = painter;
      boardData[currentBoard].map[tileId].update(currentYear);
    } else if (multiplayerAssigningModeOn) {
      meshMaterials[tileId].map = multiplayerTextureArray[painter];
      boardData[currentBoard].map[tileId].landType[currentYear] = painter;
    }
  }
  if (curTracking && painterTool.status != 2 && !undo && !randomizing) {
    pushClick(0, getStamp(), 55, 0, tileId);
  }

} //end changeLandTypeTile

//Clumps and undo's multiple tiles
function undoGrid(givenTilesAndPainter) {
  //Go through each tile and replace the paint with the paint previously there
  while(givenTilesAndPainter[1].length > 0) {
    painter = givenTilesAndPainter[1].pop();
    changeLandTypeTile(givenTilesAndPainter[0].pop());
  }
} //end givenTilesAndPainter

//Adds the given tileId and painter to the undoArr
function addChange(tileId) {
  if(uniqueTileChange(tileId)) {
    //Paint selector is a grid
    if(painterTool.status == 2) {
      undoGridArr.push(tileId);
    //Paint selector is regular
    } else {
      undoArr[currentYear].push([tileId,boardData[currentBoard].map[tileId].landType[currentYear]]);
    }
  }
} //end addChange(gridBoolean,tileId)

//Inserts the land type changes from a grid into the undoArr
function insertChange() {
  undoArr[currentYear].push([undoGridArr,undoGridPainters]);
  undoGridArr = [];
  undoGridPainters = [];
} //end insertChange()

//Determines if the tile to be added is unique (non-repeated in paint and tileId)
function uniqueTileChange(tileId) {
    //If there are no tiles yet, it is unique
    if(undoArr[currentYear].length == 0) {
      return true;
    }
    //Retrieves the last item in the array without deleting it
    var tempTileAndPainter = undoArr[currentYear].slice(-1).pop();
    //If the previously added tileId/Paint combo was the same tile and the same paint, it's not a unique change.
    if(tileId == tempTileAndPainter[0] && boardData[currentBoard].map[tileId].landType[currentYear] == painter) {
      return false;
    } else {
      return true;
    }
} //end uniqueTileChange(tileId)

//Resets the undo function arrays
function resetUndo() {
  undoArr = [[],[],[],[]];
  undoGridArr = [];
  undoGridPainters = [];
} //end resetUndo()

//getTileID calculates the id of the tile give the raycaster intersection coordinates
function getTileID(x, y) {

  //x and y in terms of three.js 3d coordinates, not screen coordinates

  var tilesWide = boardData[currentBoard].width;
  var tilesHigh = boardData[currentBoard].height;

  //calculate which column the tile is in
  var col = 0;

  if (x < columnCutOffs[0] || x > columnCutOffs[columnCutOffs.length - 1]) {
    col = 0;
  } else {
    while (x > columnCutOffs[col]) {
      col += 1;
    }
  }

  //calculate which row the tile is in
  var row = 0;

  if (y > rowCutOffs[0] || y < rowCutOffs[rowCutOffs.length - 1]) {
    row = 0;
  } else {
    while (y < rowCutOffs[row]) {
      row += 1;
    }
  }

  if (col == 0 || row == 0) {
    return -1;
  }

  return (getTileIDFromRC(row, col) - 1);

} //end getTileID

//calculateCutoffs determines the bordering coordinates of tiles
function calculateCutoffs() {

  var tilesWide = boardData[currentBoard].width;
  var tilesHigh = boardData[currentBoard].height;

  var tempColumnCut = [];
  var x;

  x = -(tilesWide / 2 - 1) * tileWidth;
  xmax = ((tilesWide / 2 + 1) * tileWidth);
  while (x <= xmax) {
    tempColumnCut.push(x);
    x += tileWidth;
  }

  columnCutOffs = tempColumnCut;

  var tempRowCut = [];
  var y;

  y = (tilesHigh / 2 - 1) * tileHeight;
  ymax = (-(tilesHigh / 2 + 1) * tileHeight);
  while (y >= ymax) {
    tempRowCut.push(y);
    y -= tileHeight;
  }

  rowCutOffs = tempRowCut;

} //end calculateCutoffs

//getTileIDFromRC calculates ids given a row and column
function getTileIDFromRC(row, col) {
  var tilesWide = boardData[currentBoard].width;
  return Number(((row - 1) * tilesWide) + col);
} //end getTileIDFromRC

//returns an array of tiles in the rectangle bounded by startTile and endTile
function getGrid(startTile, endTile) {

  var tileArray = [];

  var startCol = Number(boardData[currentBoard].map[startTile].column);
  var endCol = Number(boardData[currentBoard].map[endTile].column);
  var startRow = Number(boardData[currentBoard].map[startTile].row);
  var endRow = Number(boardData[currentBoard].map[endTile].row);

  if (endCol < startCol) {
    var temp = endCol;
    endCol = startCol;
    startCol = temp;
  }


  if (endRow < startRow) {
    var temp = endRow;
    endRow = startRow;
    startRow = temp;
  }

  //for each row
  for (var row = startRow; row <= endRow; row++) {
    //for applicable columns in the row
    for (var col = startCol; col <= endCol; col++) {
      var id = getTileIDFromRC(row, col);
      if (boardData[currentBoard].map[id - 1].landType[0] != 0) {
        tileArray.push(id);
      }
    }
  }
  //console.log(tileArray) ;
  return tileArray;
}

//getGridOutline is used to calculate higlighted regions using the rectangle painter
function getGridOutline(startTile, endTile) {

  var tileArray = [];

  var startCol = Number(boardData[currentBoard].map[startTile].column);
  var endCol = Number(boardData[currentBoard].map[endTile].column);
  var startRow = Number(boardData[currentBoard].map[startTile].row);
  var endRow = Number(boardData[currentBoard].map[endTile].row);

  tileArray.push(getTileIDFromRC(startRow, startCol));
  tileArray.push(getTileIDFromRC(endRow, endCol));

  var temp = getTileIDFromRC(startRow, endCol);
  if (temp != -1) tileArray.push(temp);
  temp = getTileIDFromRC(endRow, startCol);
  if (temp != -1) tileArray.push(temp);

  //check for bad tiles
  var goodTiles = [];
  for (var i = 0; i < tileArray.length; i++) {
    if (boardData[currentBoard].map[tileArray[i] - 1].landType[0] != 0) goodTiles.push(tileArray[i]);
  }
  tileArray = goodTiles;

  return tileArray;
}

//addTile constructs the geometry of a tile and adds it to the scene
function addTile(tile) {

  var tilesWide = boardData[currentBoard].width;
  var tilesHigh = boardData[currentBoard].height;

  var tileGeometry = new THREE.Geometry();
  var tileMaterial;

  var v1, v2, v3, v4;

  var mapID = tile.id - 1;

  //Retrieve the topography of adjacent tiles
  var topN24 = boardData[currentBoard].map[mapID - (tilesWide + 1)] ? boardData[currentBoard].map[mapID - (tilesWide + 1)].topography : 0;
  var topN23 = boardData[currentBoard].map[mapID - (tilesWide)] ? boardData[currentBoard].map[mapID - (tilesWide)].topography : 0;
  var topN22 = boardData[currentBoard].map[mapID - (tilesWide - 1)] ? boardData[currentBoard].map[mapID - (tilesWide - 1)].topography : 0;
  var topN1 = boardData[currentBoard].map[mapID - 1] ? boardData[currentBoard].map[mapID - 1].topography : 0;
  var top1 = boardData[currentBoard].map[mapID + 1] ? boardData[currentBoard].map[mapID + 1].topography : 0;
  var top22 = boardData[currentBoard].map[mapID + (tilesWide - 1)] ? boardData[currentBoard].map[mapID + (tilesWide - 1)].topography : 0;
  var top23 = boardData[currentBoard].map[mapID + (tilesWide)] ? boardData[currentBoard].map[mapID + (tilesWide)].topography : 0;
  var top24 = boardData[currentBoard].map[mapID + (tilesWide + 1)] ? boardData[currentBoard].map[mapID + (tilesWide + 1)].topography : 0;

  var riverHeight = 1;

  //Calculate the heights of vertices by averaging topographies of adjacent tiles and create a vector for each corner
  if (tToggle) {
    var h1 = (topN24 + topN23 + topN1 + tile.topography) / 4 * 5;
    var h2 = (topN23 + topN22 + top1 + tile.topography) / 4 * 5;
    var h3 = (top24 + top23 + top1 + tile.topography) / 4 * 5;
    var h4 = (top22 + top23 + topN1 + tile.topography) / 4 * 5;

    v1 = new THREE.Vector3(0, h1, 0);
    v2 = new THREE.Vector3(tileWidth, h2, 0);
    v3 = new THREE.Vector3(tileWidth, h3, tileHeight);
    v4 = new THREE.Vector3(0, h4, tileHeight);

    riverHeight = (h1 + h2 + h3 + h4) / 4;
  } else {
    v1 = new THREE.Vector3(0, 0, 0);
    v2 = new THREE.Vector3(tileWidth, 0, 0);
    v3 = new THREE.Vector3(tileWidth, 0, tileHeight);
    v4 = new THREE.Vector3(0, 0, tileHeight);
  }

  tileGeometry.vertices.push(v1);
  tileGeometry.vertices.push(v2);
  tileGeometry.vertices.push(v3);
  tileGeometry.vertices.push(v4);

  //Create two new faces (triangles) for the tile
  var face = new THREE.Face3(2, 1, 0);
  face.normal.set(0, 1, 0); // normal
  tileGeometry.faces.push(face);
  tileGeometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 1)]); // uvs

  face = new THREE.Face3(3, 2, 0);
  face.normal.set(0, 1, 0); // normal
  tileGeometry.faces.push(face);
  tileGeometry.faceVertexUvs[0].push([new THREE.Vector2(1, 0), new THREE.Vector2(0, 0), new THREE.Vector2(1, 1)]); // uvs



  //choose the relevant texture to add to the tile faces
  if (tile.landType[0] == 0) {

    tileMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.0
    });

    meshMaterials.push(tileMaterial);
  } else if (tile.landType[0] == -1) {

    tileMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.7
    });

    meshMaterials.push(tileMaterial);

  } else {

    if (!multiplayerAssigningModeOn) {
      tileMaterial = new THREE.MeshLambertMaterial({
        map: textureArray[tile.landType[currentYear]],
        side: THREE.DoubleSide
      });
    } else {
      tileMaterial = new THREE.MeshLambertMaterial({
        map: ((tile.landType[currentYear] < multiplayerTextureArray.length) ? multiplayerTextureArray[tile.landType[currentYear]] : null),
        side: THREE.DoubleSide
      });
    }
    meshMaterials.push(tileMaterial);
  }

  //if this tile is the first in its row that is a streamNetwork tile add it to the riverPoints array
  if (tile.riverStreams != 0) {
    var streams = tile.riverStreams.split("*");
    for (var i = 0; i < streams.length; i++) {
      if (!riverPoints[Number(streams[i]) - 1]) {
        riverPoints[Number(streams[i]) - 1] = [];
      }
      riverPoints[Number(streams[i]) - 1].push(new THREE.Vector3(tile.column * tileWidth - (tileWidth * tilesWide) / 2 + tileWidth / 2, riverHeight, tile.row * tileHeight - (tileHeight * tilesHigh) / 2 + tileHeight));
    }
  }

  //create a new mesh from the two faces for the tile
  var newTile = new THREE.Mesh(tileGeometry, tileMaterial);

  //change the x and z position of the tile dependent on the row and column that it is in
  newTile.position.x = tile.column * tileWidth - (tileWidth * tilesWide) / 2;
  newTile.position.y = 0;
  newTile.position.z = tile.row * tileHeight - (tileHeight * tilesHigh) / 2;

  //add the mapID to the
  newTile.mapID = mapID;

  //add the tile to the meshGeometry which contains all vertices/faces of the merged tiles
  newTile.updateMatrix();
  meshGeometry.merge(newTile.geometry, newTile.matrix);

} //end addTile


//refreshBoard removes the current mesh and clears the objects that store its data, then calls displayBoard
//  this function is *very* computationally intensive, and as such, it should only be
//  called sparringly, when the whole board needs to be redrawn. Multiple calls to
//  refreshBoard() show up instantly as a marked decline in fps.
//Ususally, (except for changes with the whole board) a better method is
//  to change the mesh material map which is automatically redrawn
//The argument bypassFromKeyEvent helps the t key and r key switch up the board when pressed
//  to change topography and random tiles, but keep the board highlighted
function refreshBoard(bypassFromKeyEvent) {

  if (mesh != null) {
    scene.remove(mesh);
  }

  meshGeometry = new THREE.Geometry();
  meshMaterials = [];

  //if the map is just being changed normally, not when it is highlighted and t or r were pressed
  if (!bypassFromKeyEvent) {
    mapIsHighlighted = false;
    showLevelDetails(-1 * currentHighlightType);
    currentHighlightType = 0;
    displayBoard();
    //if the map is highlighted and t or r keys were pressed
  } else {
    currentHighlightType = 0;
    displayBoard();
    displayLevels(currentHighlightTypeString);
  }

} //end refreshBoard

//revertChanges undos the users previous tile changes, and goes back to the previous board instance
function revertChanges() {
  //For storing clicks
  if (curTracking) {
    pushClick(0, getStamp(), 30, 0, null);
  }
  //Only undo if there is a tile to undo (or you are free to do so)
  if (undoArr[currentYear].length > 0 && !inResults && !inDispLevels) {
    var tempPainter = painter;
    undo = true;
    var tempTileAndPainter = undoArr[currentYear].pop();
    //If the undo function is undoing a grid
    if(Array.isArray(tempTileAndPainter[0])) {
      undoGrid(tempTileAndPainter);
    //If the undo function is undoing a normal selection
    } else {
      painter = tempTileAndPainter[1];
      changeLandTypeTile(tempTileAndPainter[0]);
    }
    undo = false;
    painter = tempPainter;
  }
}

//transitionToYear updates the graphics for a board to "year" input
function transitionToYear(year) {

  currentYear = year;
    var tempNum = year + 37;
    if (curTracking) {
      pushClick(0,getStamp(),tempNum,0,null);
    }
    if (year > boardData[currentBoard].calculatedToYear && addingYearFromFile==false) {
      boardData[currentBoard].calculatedToYear = year;

      for (var i = 0; i < boardData[currentBoard].map.length; i++) {
        boardData[currentBoard].map[i].landType[year] = boardData[currentBoard].map[i].landType[year - 1];
      }
     if(addingYearFromFile==true)
      {
        for (var i = 0; i < boardData[currentBoard].map.length; i++) {
        boardData[currentBoard].map[i].landType[year] = boardData[currentBoard].map[i].landType[year];
      }
      }

      boardData[currentBoard].updateBoard();
    }

    refreshBoard();
} //end transitionToYear

//addYearAndTransition updates the years to switch between in the left console and transitions to the new year
function addYearAndTransition() {

  var totalYearsAllowed = 3;
  var nextYear = currentYear + 1;
  if (curTracking) {
    pushClick(0, getStamp(), 41, 0, null);
  }
  //make next button appear (has some prebuilt functionality for expanded number of years)
  if (currentYear < totalYearsAllowed - 1) {

    document.getElementById("year" + nextYear + "Button").className = "yearButton";
    document.getElementById("year" + nextYear + "Image").className = "icon yearNotSelected";

  }

  //make last button appear and remove the "+" Button (has some prebuilt functionality for expanded number of years)
  if (currentYear == totalYearsAllowed - 1) {

    document.getElementById("year3Button").className = "yearButton";
    document.getElementById("year3Image").className = "icon yearNotSelected";
    document.getElementById("yearAddButton").style.display = "none";

  }

  switchYearTab(nextYear);
  transitionToYear(nextYear);

} //end addYearAndTransition

//resetYearDisplay removes the years which have been displayed throughout the current session of the game
function resetYearDisplay() {

  //remove all years except the first and reshow the + button (has some prebuilt functionality for expanded number of years)

  for (var i = 2; i < 4; i++) {
    document.getElementById("year" + i + "Button").className = "yearButtonHidden";
    document.getElementById("year" + i + "Image").className = "yearImageHidden";
  }

  document.getElementById("yearAddButton").style.display = "inline-block";

} //end resetYearDisplay

//onDocumentMouseMove follows the cursor and highlights corresponding tiles
function onDocumentMouseMove(event) {

  event.preventDefault();

  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

  //set location of div that follows cursor for hover-info and displays with 1s delay
  var x = event.clientX;
  var y = event.clientY;
  if (x != 'undefined' && y != 'undefined') {
    // XXX 20 must be the footer id="bottomHUD" height. Might encounter problems sometimes
    document.getElementById('hover-div').style.left = (x + 20) + "px";
    document.getElementById('hover-div').style.top = (y + 20) + "px";
  }

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);

  //Remove highlighting if clicking and dragging
  if (clickAndDrag) {
    highlightTile(-1);
  }

  //if there's no intersection, then turn off the gridHighlighting
  if (intersects.length < 1) {

    //if we're on grid paint, and we go off board, unhighlight everything
    if (painterTool.status == 2) {
      for (var i = 0; i < highlightedTiles.length; i++) {
        meshMaterials[highlightedTiles[i] - 1].emissive.setHex(0x000000);
      }
    }

    //else, unhighlight previous
    highlightTile(-1);
  }

  if (intersects.length > 0 && !modalUp) {

    //if painter tool type is the rectangle painter
    if (painterTool.status == 2 && !mapIsHighlighted) {
      //highlight a grid
      var currentTile = getTileID(intersects[0].point.x, -intersects[0].point.z);
      var tilesToHighlight = getGridOutline(painterTool.startTile, currentTile);

      //clear Previous highlighting
      for (var i = 0; i < highlightedTiles.length; i++) {
        meshMaterials[highlightedTiles[i] - 1].emissive.setHex(0x000000);
      }

      //if the tile we are on is an actual tile, then highlight accordingly
      //  this is important as it appears to the users that they are off the board
      //  so it should consistently not highlight
      // in reality, there is a distinction between space outside the board and a
      //  tile on the board with no land type
      if (currentTile && boardData[currentBoard].map[currentTile].landType[0] != 0) {

        for (var i = 0; i < tilesToHighlight.length; i++) {
          highlightTile(tilesToHighlight[i] - 1);
          //prevent highlighting from overwritting...
          previousHover = null;
        }

        highlightedTiles = tilesToHighlight;
      }
    }
    //if painter tool type is the clickAndDrag painter
    else if (clickAndDrag) {
      var currentTile = getTileID(intersects[0].point.x, -intersects[0].point.z);
      if (boardData[currentBoard].map[currentTile].landType[0] != 0) changeLandTypeTile(currentTile);
    } else {
      //just a normal highlighting
      highlightTile(getTileID(intersects[0].point.x, -intersects[0].point.z));
    }

  }
} //end onDocumentMouseMove

//onDocumentDoubleClick changes landType to the painted (selected) landType on double-click
//and will change map to a monoculture if shift is held down
function onDocumentMouseDown(event) {
  if (!runningSim) {
    //if the user's mouse is over one of the frames
    // such as the left console or results button
    if (clearToChangeLandType) {
      event.preventDefault();
    }

    mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children);

    if (event.which == 1 && intersects.length > 0 && clearToChangeLandType) {

      if (!isShiftDown) {

        if (!modalUp && (!painterTool.hover || mapIsHighlighted)) {

          if (painterTool.status > 0 && !mapIsHighlighted) {

            //take care of grid painting
            //if the painter is not active, set to active
            if (painterTool.status == 1) {
              //start grid painting option
              //set active
              painterTool.status = 2;
              //set start tile
              painterTool.startTile = getTileID(intersects[0].point.x, -intersects[0].point.z);
            }
            //else if the painter is active, then complete grid paint
            else if (painterTool.status == 2) {
              //end painterTool.status function if
              var currentTile = getTileID(intersects[0].point.x, -intersects[0].point.z);

              if (boardData[currentBoard].map[currentTile].landType[0] != 0) {
                //then paint since it's an actual tile
                painterTool.endTile = currentTile;
                var changedTiles = getGrid(painterTool.startTile, painterTool.endTile);

                for (var i = 0; i < changedTiles.length; i++) {
                  if (curTracking) {
                    pushClick(0, getStamp(), 56, 0, changedTiles[i]);
                  }
                  undoGridPainters.push(boardData[currentBoard].map[changedTiles[i] - 1].landType[currentYear]);
                  changeLandTypeTile(changedTiles[i] - 1);
                }
                //Inserts the block of land use types into the undoArr
                insertChange();
                //reset highlighting, computationally intensive
                //  but a working solution
                refreshBoard();

                //reset painterTooling status as not active
                painterTool.status = 1;
              } //end if
            } //end if active painter status
          } else {

            //Zoom in when z and 1 keys are pressed and a tile is clicked -- also not multiAssign mode
            if (zIsDown && oneIsDown && !zoomedIn && !multiplayerAssigningModeOn) {
              switchToZoomView(getTileID(intersects[0].point.x, -intersects[0].point.z));
            } else {
              //just a normal tile change
              changeLandTypeTile(getTileID(intersects[0].point.x, -intersects[0].point.z));
              //Change variable for painting click and drag status
              clickAndDrag = true;
            }

          }

        }

      } // end if shift is not down
      //else, if shift is down, then we want to just change the whole board
      else {

        //if shift is down and map isn't highlighted, change all nonzero landtypes
        if (!mapIsHighlighted) {

          for (var i = 0; i < boardData[currentBoard].map.length; i++) {

            if (boardData[currentBoard].map[i].landType[currentYear] != 0) {

              changeLandTypeTile(i);

            }
          }
        }
      }
    } //end else/if group
  }
} //end onDocumentMouseDown(event)

//onDocumentMouseUp listens for the release of the click event
function onDocumentMouseUp(event) {

  //Turn off click and drag functionality
  clickAndDrag = false;

  //check to see if one of the physical features maps is highlighted
  //if so, we'll change the tiles over to their appropriate color levels
  if (mapIsHighlighted && currentHighlightType > 0 && currentHighlightType < 4) {

    Totals = new Results(boardData[currentBoard]);
    Totals.update();

    // update each tile on the board with its corresponding color
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {

      if (boardData[currentBoard].map[i].landType[currentYear] != 0) {
        meshMaterials[i].map = highlightArray[getHighlightColor(currentHighlightTypeString, i)];
      }
    } //end for
  }
} //end onDocumentMouseUp

//onDocumentKeyDown, listener with keyboard bindings
function onDocumentKeyDown(event) {
  //switch structure on key code (http://keycode.info)
  switch (event.keyCode) {
    //case shift - update isShiftDown
    case 16:
      isShiftDown = true;
      break;

      //case t - toggle topography
    case hotkeyArr[2][0]: case hotkeyArr[2][1]:
    //setting the camera y position to a specific hight when toggle is pressed.
    if (camera2.position.y < 27)
        camera2.position.y = 27;
      if (modalUp !== true) {
        if (curTracking) {
          pushClick(0, getStamp(), 32, 0, null);
        }
        tToggle ? tToggle = false : tToggle = true;

        //in the case when the map is highlighted:
        if (mapIsHighlighted) {
          refreshBoard(true);
        }
        //if the map is not highlighted:
        else {
          refreshBoard();
        }
        setupRiver();
      }
      break;
      //case e - reset camera position
    case hotkeyArr[0][0]: case hotkeyArr[0][1]:
      //update scope across 10 turns,
      // it seeems that controls.js scope doesn't bring us all the way back
      // with just a controls value of 1
    //Reseting camera postion to specific views depending on which camera is on use now.
    controls.value = 10;
    controls.reset();
    setTimeout(function() {
    controls.value = 1;
      }, 100);
    if(ToggleCam == 2){
      controls1.value = 10;
      controls1.reset();
      setTimeout(function() {
        controls1.value = 1;
      }, 100);
    }else{
        camera2.position.x = 70;
        camera2.position.y = 25;
        camera2.position.z = 244;
        camera2.rotation.y = 0;
    }
      break;

      //case r - randomize land types
    case hotkeyArr[1][0]: case hotkeyArr[1][1]:
      if (modalUp !== true && currentHighlightType < 4) {
        if (curTracking) {
          pushClick(0, getStamp(), 52, 0, null);
        }
        randomizeBoard();
        //in the case that the map is currently highlighted for a ecosystem indicator,
        //keep highlighting on and randomize the land types
        if (currentHighlightType > 0) {
          refreshBoard(true);
          setupRiver();
        }
      }
      break;

      //case z -- for zoom functions
    case 90:
      //track the z down key
      zIsDown = true;
      break;

      //case 1 -- press z,1 and click tile to zoom in
    case 49:
      oneIsDown = true;
      break;

      //case 2 -- press z,2 to zoom out
    case 50:
      if (zIsDown && zoomedIn) {
        //1 is dummy value for now
        switchToUnzoomedView(1, true);
      }
      break;

      //case v - key to record multiplayer fields
    case hotkeyArr[5][0]: case hotkeyArr[5][1]:
      if (multiplayerAssigningModeOn) {
        endMultiplayerAssignMode();
      }
      break;

      //case esc - view escape menu
    case 27:
      if (!curTracking && !runningSim) {
        highlightTile(-1);
        toggleEscapeFrame();
        break;
      }
      if (runningSim && !paused) {
        endSimPrompt();
        break;
      }
      if (runningSim && paused) {
        document.getElementById("simContainer").style.visibility = "hidden";
        paused = false;
        resumeSim();
        break;
      }
      break;
      // case u - undo key
    case hotkeyArr[3][0]: case hotkeyArr[3][1]:
        revertChanges();
      break;

      // case o - toggleOverlay
    case hotkeyArr[10][0]: case hotkeyArr[10][1]:
      if (previousOverlay != null) {
        if (curTracking) {
          pushClick(0, getStamp(), 31, 0, null);
        }
        toggleOverlay();
      }
      break;

      // key b - clickTrackings
    case hotkeyArr[4][0]: case hotkeyArr[4][1]:
      if (!curTracking) {
        curTracking = true;
        //Starting date is recorded
        startTime = new Date();
        clickTrackings = [];
        document.getElementById("recordIcon").style.visibility = "visible";
      } else {
        curTracking = false;
        //Ending date is recorded
        endTime = new Date();
        document.getElementById("recordIcon").style.visibility = "hidden";
        exportTracking(clickTrackings);
      }
      //no default handler
  } //end switch
} //end onDocumentKeyDown

//onDocumentKeyUp, binding to keyboard keyUp event
//  but you already knew that...
function onDocumentKeyUp(event) {
  //switch structure for key code (http://keycode.info)
  switch (event.keyCode) {
    case 0:
      isShiftDown = false;
      break;
      //case release shift
    case 16:
      isShiftDown = false;
      break;
      //case release z -- for zoom functions
    case 90:
      zIsDown = false;
      break;
      //case release 1 -- press z,1 and click tile to zoom in
    case 49:
      oneIsDown = false;
      break;
  } //end switch
} //end onDocumentKeyUp

//toggleEscapeFrame displays and hides the div that allows the user to go to the main menu, options, or directory
function toggleEscapeFrame() {

  if (document.getElementById('confirmEscape').style.height == "20vw") {
    confirmEscape();
  }

  if (document.getElementById('modalEscapeFrame').style.display != "block" && !modalUp) {

    document.getElementById('modalEscapeFrame').style.display = "block";
    document.getElementById('exitToMenuButton').style.visibility = "visible";
    document.getElementById('optionsButton').style.visibility = "visible";
    document.getElementById('directoryButton').style.visibility = "visible";
    modalUp = true;
  } else if (document.getElementById('modalEscapeFrame').style.display == "block" && modalUp) {
    document.getElementById('modalEscapeFrame').style.display = "none";
    document.getElementById('exitToMenuButton').style.visibility = "hidden";
    document.getElementById('optionsButton').style.visibility = "hidden";
    document.getElementById('directoryButton').style.visibility = "hidden";
    modalUp = false;
  }

  if (multiplayerAssigningModeOn) {
    document.getElementById('optionsButton').className = "unclickableMainEscapeButton";
  } else {
    document.getElementById('optionsButton').className = "mainEscapeButton";
  }

} //end toggleEscapeFrame

//paintChange changes the highlighted color of the selected painter and updates painter
function changeSelectedPaintTo(newPaintValue) {
  //check to see if multiplayer Assignment Mode is On
  if (!multiplayerAssigningModeOn) {
    //Store paint change if click-tracking is on
    if (curTracking) {
      var tempNum = newPaintValue + 14;
      pushClick(0, getStamp(), tempNum, 0, null);
    }
    //change current painter to regular
    var painterElementId = "paint" + painter;
    document.getElementById(painterElementId).className = "landSelectorIcon icon";

    //change new paiter to current
    painterElementId = "paint" + newPaintValue;
    document.getElementById(painterElementId).className = "landSelectorIcon iconSelected";
    painter = newPaintValue;
    //Index chat box entries for each landuse type
    if(painterElementId == 'paint1'){
      updateIndexPopup('To learn more about Conventional Corn, go to the Index and select "Land Use".');
    }
     else if(painterElementId == 'paint2'){
      updateIndexPopup('To learn more about Conservation Corn, go to the Index and select "Land Use".');
    }
     else if(painterElementId == 'paint3'){
      updateIndexPopup('To learn more about Conventional Soybean, go to the Index and select "Land Use".');
    }
     else if(painterElementId == 'paint4'){
      updateIndexPopup('To learn more about Conservation Soybean, go to the Index and select "Land Use".');
    }
     else if(painterElementId == 'paint15'){
      updateIndexPopup('To learn more about Mixed Fruits and Vegetables, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint5'){
      updateIndexPopup('To learn more about Alfalfa Hay, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint8'){
      updateIndexPopup('To learn more about Grass Hay, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint12'){
      updateIndexPopup('To learn more about Switch Grass, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint6'){
      updateIndexPopup('To learn more about Permanent Pasture, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint7'){
      updateIndexPopup('To learm more about Rotational Grazing, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint14'){
      updateIndexPopup('To learn more about Wetland, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint9'){
      updateIndexPopup('To learn more about Prarie, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint11'){
      updateIndexPopup('To learn more about Conventional Forest, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint10'){
      updateIndexPopup('To learn more about Conservation Forest, go to the Index and select "Land Use".');
    }
    else if(painterElementId == 'paint13'){
      updateIndexPopup('To learn more about Short Rotation Woody Bioenergy, go to the Index and select "Land Use".');
    }
    else{
      updateIndexPopup('');
    }

    // if it's grid painting mode and the user click to switch painter, erase the first seleted tile
    if (painterTool.status == 2)
    {
      painterTool.status = 1;// ready to do grid paint
    }

    //have land type update immediately, well, pretend the mouse moved...
    highlightTile(-1);
  }
  else {

    //If we are merging players together
    if(document.getElementById("combineButton").innerHTML == "Merge" && merging == false) {
      //If we already selected that player, deselect and remove it from the list to combine
      var playerIndex = playerCombo.indexOf(newPaintValue);
      if(playerIndex != -1) {
        var painterElementId = "player" + newPaintValue + "Image";
        document.getElementById(painterElementId).className = "playerIcon icon";
        playerCombo.splice(playerIndex, 1);
        //Otherwise, select and add it to the list to combine
      } else {
        var painterElementId = "player" + newPaintValue + "Image";
        document.getElementById(painterElementId).className = "playerIcon iconSelected";
        playerCombo.push(newPaintValue);
      }
      //If we aren't merging players
    } else {
      //reset the playerSelected back to a normal playerNotSelected
      var painterElementId = "player" + painter + "Image";
      document.getElementById(painterElementId).className = "playerIcon icon";

      //change new painter to the current corresponding paintPlayer
      painterElementId = "player" + newPaintValue + "Image";
      document.getElementById(painterElementId).className = "playerIcon iconSelected";
      switchCurrentPlayer(newPaintValue);

    }
    //update the current painter to the value
    painter = newPaintValue;
  } //end if/else group
} //end paintChange


//resultsStart begins results calculations and calls functions that display the results
function resultsStart() {
  inResults = true;
  //if something else does not have precedence
  if (!modalUp) {
    if (curTracking) {
      pushClick(0, getStamp(), 12, 0, null);
    }
    //setup Screen Appropriately
    document.getElementById("resultsButton").onmouseout = "";
    document.getElementById("resultsButton").onmouseover = "";
    document.getElementById("closeResults").style.opacity = "1";
    document.getElementById('closeResults').style.visibility = "visible";

    document.getElementById('modalResultsFrame').style.display = "block";

    document.getElementById("resultsButton").onclick = function() {
      resultsEnd();
    };

    //prevent certain elements from being Clickable
    document.getElementById("toolsButton").onclick = "";
    document.getElementById("resultsButton").className = "resultsButton";

    //check if we need to close some panes, if so, remember so that
    //  we can open them back up
    //left pane
    leftToolConsoleWasOpen = false;
    if (document.getElementById("leftConsole").className == "leftConsole") {
      leftToolConsoleWasOpen = true;
      roll(1);

      //hide the highlighted map legend if necessary
      if (currentHighlightType > 0) {
        showLevelDetails(-1 * currentHighlightType);
      }

    }
    //right popup
    rightPopupWasOpen = false;
    if (document.getElementById("popup").className == "popup") {
      togglePopupDisplay();
      rightPopupWasOpen = true;
    }

    //prevent background land changes and so forth
    modalUp = true;

    //functions that update results and display them appropriately
    calculateResults();
    displayResults();
    animateResults();
    //Event Listener for closing reslts tab
    document.addEventListener('keyup', resultsEsc);
  } //end if
} //end resultsStart

//resultsEnd hides the results and returns the menus to the screens
function resultsEnd() {
  //Fucntion for removing event listener when resluts is closed
  document.removeEventListener('keyup', resultsEsc);
  inResults = false;
  //modal is no longer up
  modalUp = false;
  if (curTracking) {
    pushClick(0, getStamp(), 13, 0, null);
  }
  //reset functionality
  document.getElementById("resultsFrame").className = "resultsFrameRolled";
  document.getElementById("resultsButton").className = "resultsButtonRolled";
  document.getElementById('closeResults').style.opacity = "0";
  document.getElementById("closeResults").style.visibility = "hidden";

  document.getElementById('modalResultsFrame').style.display = "none";

  //reopen elements that were previously open
  if (leftToolConsoleWasOpen) roll(1);
  if (rightPopupWasOpen) togglePopupDisplay();

  //if highlighted map legend was previously open, redisplay
  if (currentHighlightType > 0) {
    showLevelDetails(currentHighlightType);
  }

  //reset functionality to buttons that were made unclickable
  document.getElementById("toolsButton").onclick = function() {
    roll(1);
  };
  document.getElementById("resultsButton").onclick = function() {
    resultsStart();
  };

  clearToChangeLandType = true;

  //after page is no longer visible, reset active element
  setTimeout(function() {
    //I have the conch...
    document.activeElement.blur();
  }, 1000);

} //end resultsEnd

//roll controls the display of the toolbars on the left
function roll(value) {

  //toggle rolled status of the left console
  if (value == 1) {
    //if the console is open, then roll it with corresponding style changes
    if (document.getElementById('tabButtons').className == "tabButtons") {
      if (curTracking) {
        pushClick(0, getStamp(), 57, 0, null);
      }
      document.getElementById('toolsButton').style.left = "0px";
      // document.getElementById('toolsButton').style.backgroundImage = "url('./imgs/consoleTexture.png')";
      document.getElementById('pick').src = "./imgs/pickIn.png"
      document.getElementById('tabButtons').className = "tabButtonsRolled";
      document.getElementById('leftConsole').className = "leftConsoleRolled";

    } else {
      if (curTracking) {
        pushClick(0, getStamp(), 3, 0, null);
      }
      // document.getElementById('toolsButton').style.left = "135px";
      // document.getElementById('toolsButton').style.left = "9.6vw";
      document.getElementById('toolsButton').style.left = document.getElementById('leftConsole').style.width;
      // document.getElementById('toolsButton').style.backgroundImage = "none";
      document.getElementById('pick').src = "./imgs/pickOut.png"
      document.getElementById('tabButtons').className = "tabButtons";
      document.getElementById('leftConsole').className = "leftConsole";

    }
  } //end value == 1

  //toggle rolled status of the results button
  if (value == 2) {

    if (document.getElementById("resultsButton").className == "resultsButton") {
      document.getElementById("resultsButton").className = "resultsButtonRolled";
    } else if (document.getElementById("resultsButton").className == "resultsButtonRolled") {
      document.getElementById("resultsButton").className = "resultsButton";
    }
  } //end value == 2
} //end roll

//showLevelDetails shows the legend for each of the highlight map functions
function showLevelDetails(value) {

  //show nitrate legend
  if (value == 1) {
    document.getElementById("nitrateDetailsList").className = "DetailsList levelDetailsList";
    document.getElementById('nitrateIcon').className = "levelsSelectorIcon iconSelected";
  }

  //show erosion legend
  else if (value == 2) {
    document.getElementById("erosionDetailsList").className = "DetailsList levelDetailsList";
    document.getElementById('erosionIcon').className = "levelsSelectorIcon iconSelected";
  }

  //show phosphorus legend
  else if (value == 3) {
    document.getElementById("phosphorusDetailsList").className = "DetailsList levelDetailsList";
    document.getElementById('phoshorusIcon').className = "levelsSelectorIcon iconSelected";
  }

  //show flood frequency legend
  else if (value == 4) {
    document.getElementById('floodFrequency').className = "featureSelectorIcon iconSelected";
    document.getElementById("floodFrequencyDetailsList").className = "DetailsList physicalDetailsList";
  }

  //show drainage class legend
  else if (value == 5) {
    document.getElementById('drainageClass').className = "featureSelectorIcon iconSelected";
    document.getElementById("drainageClassDetailsList").className = "DetailsList physicalDetailsList";
  }

  //show strategic wetlands legend
  else if (value == 6) {
    document.getElementById('strategicWetlands').className = "featureSelectorIcon iconSelected";
    document.getElementById("wetlandClassDetailsList").className = "DetailsList physicalDetailsList";
  }

  //show subwatershed legend
  else if (value == 7) {
    document.getElementById('subwatershedBoundaries').className = "featureSelectorIcon iconSelected";
    document.getElementById("subwatershedClassDetailsList").className = "DetailsList physicalDetailsList";
  } //end else/if group

    else if (value == 8) {
    document.getElementById('soilClass').className = "featureSelectorIcon iconSelected";
    document.getElementById('soilClassDetailsList').className = "DetailsList physicalDetailsList";
  }

  //show Corn class legend
  else if (value == 9) {
    document.getElementById('cornClass').className = "yieldSelectorIcon iconSelected";
    document.getElementById('cornGrainDetailsList').className = "DetailsList yieldDetailsList";
    updateIndexPopup('Conventional Corn and Conservation Corn produce the same output based on soil type. To learn more, go to the Index, select "Modules", and then "Yield".');
  }

  //show soy class legend
  else if (value == 10) {
    document.getElementById('soyClass').className = "yieldSelectorIcon iconSelected";
    document.getElementById('soyBeanDetailsList').className = "DetailsList yieldDetailsList";
    updateIndexPopup('Conventional Soy and Conservation Soy produce the same output based on soil type. To learn more, go to the Index, select "Modules", and then "Yield".');
  }

  //show fruit class legend
  else if (value == 11) {
    document.getElementById('fruitClass').className = "yieldSelectorIcon iconSelected";
    document.getElementById('fruitDetailsList').className = "DetailsList yieldDetailsList";
    updateIndexPopup('To learn more about Mixed Fruits and Vegetable Yield, go to the Index, select "Modules", and then "Yield".');
  }

  //show cattle class legend
  else if (value == 12) {
    document.getElementById('cattleClass').className = "yieldSelectorIcon iconSelected";
    document.getElementById('cattleDetailsList').className = "DetailsList yieldDetailsList";
    updateIndexPopup('Permanent Pasture and Rotational Grazing produce the same output based on soil type. To learn more, go to the Index, select "Modules", and then "Yield".')
  }

  //show alfalfa class legend
  else if (value == 13) {
    document.getElementById('alfalfaClass').className = "yieldSelectorIcon iconSelected";
    document.getElementById('alfalfaDetailsList').className = "DetailsList yieldDetailsList";
    updateIndexPopup('To learn more about Alfalfa Hay Yield, go to the Index, select "Modules", and then "Yield".');
  }

  //show grasshay class legend
  else if (value == 14) {
    document.getElementById('grassHayClass').className = "yieldSelectorIcon iconSelected";
    document.getElementById('grassHayDetailsList').className = "DetailsList yieldDetailsList";
    updateIndexPopup('To learn more about Grass Hay Yield, go to the Index, select "Modules", and then "Yield".');
  }

  //show switch grass class legend
  else if (value == 15) {
    document.getElementById('switchGrassClass').className = "yieldSelectorIcon iconSelected";
    document.getElementById('switchGrassDetailsList').className = "DetailsList yieldDetailsList";
    updateIndexPopup('To learn more about Switch Grass Yield, go to the Index, select "Modules", and then "Yield".');
  }

  //show wood class legend
  else if (value == 16) {
    document.getElementById('woodClass').className = "yieldSelectorIcon iconSelected";
    document.getElementById('woodDetailsList').className = "DetailsList yieldDetailsList";
    updateIndexPopup('Conventional Forest and Conservation Forest produce the same output based on soil type. To learn more, go to the Index, select "Modules", and then "Yield".');
  }

  //show short class legend
  else if (value == 17) {
    document.getElementById('shortClass').className = "yieldSelectorIcon iconSelected";
    document.getElementById('shortDetailsList').className = "DetailsList yieldDetailsList";
    updateIndexPopup('Short-Rotation Woody Biomass produces the same output, no matter the soil type. To learn more, go to the Index, select "Modules", and then "Yield".');
  }

  //hide ecosystem indicator legends
  if (value > -4 && value < 0) {
    var element = document.getElementsByClassName('DetailsList');
    if (element.length > 0) {
      element[0].className = 'DetailsListRolled';
    }
    element = document.getElementsByClassName('levelsSelectorIcon iconSelected');
    if (element.length > 0) {
      element[0].className = 'levelsSelectorIcon icon';
    }
  }

  //hide watershed feature legends
  else if (value < -3 && value > -9) {
    var element = document.getElementsByClassName('DetailsList physicalDetailsList');
    if (element.length > 0) {
      element[0].className = 'DetailsListRolled physicalDetailsList';
    }
    element = document.getElementsByClassName('featureSelectorIcon iconSelected');
    if (element.length > 0) {
      element[0].className = 'featureSelectorIcon icon';
    }
  } //end else/if group
  else if (value < -8) {
    var element = document.getElementsByClassName('DetailsList yieldDetailsList');
    if (element.length > 0) {
      element[0].className = 'DetailsListRolled yieldDetailsList';
    }
    element = document.getElementsByClassName('yieldSelectorIcon iconSelected');
    if (element.length > 0) {
      element[0].className = 'yieldSelectorIcon icon';
    }
  }

} //end showLevelDetails
//updatePrecip updates the currentBoard with the precipitation values selected in the drop down boxes
function updatePrecip(year) {

  if (year == 0) {
    if (curTracking) {
      pushClick(0, getStamp(), 34, 0, document.getElementById("year0Precip").value);
    }
    boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year0Precip").value)];
  }
  if (year == 1) {
    if (curTracking) {
      pushClick(0, getStamp(), 35, 0, document.getElementById("year1Precip").value);
    }
    boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year1Precip").value)];
  }
  if (year == 2) {
    if (curTracking) {
      pushClick(0, getStamp(), 36, 0, document.getElementById("year2Precip").value);
    }
    boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year2Precip").value)];
  }
  if (year == 3) {
    if (curTracking) {
      pushClick(0, getStamp(), 37, 0, document.getElementById("year3Precip").value);
    }
    boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year3Precip").value)];
  }

  boardData[currentBoard].updateBoard();

} //updatePrecip

//switchConsoleTab updates the currently selected toolbar on the left
function switchConsoleTab(value) {

  //Store last tab
  if (value != 1) {
    previousTab = value;
  }

  //turn off selected image in tabs
  var element = document.getElementsByClassName("imgSelected");
  element[0].className = "imgNotSelected";

  //turn off all the consoleTabs
  var elements = document.getElementsByClassName("consoleTab");

  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
  }

  //then we'll turn back on the tab that was switched to, clever eh?


  //update the left console tab according to the value selected

  if (value == 1) {
    inDispLevels = false;
    if (curTracking) {
      pushClick(0, getStamp(), 4, 0, null);
    }
    document.getElementById('terrainImg').className = "imgSelected";
    document.getElementById('painterTab').style.display = "block";
    updateIndexPopup('These are the 15 different land use types. To learn more about them, go to the Index and select "Land Use".');
  } else if (value == 2) {
    inDispLevels = false;
    if (curTracking) {
      pushClick(0, getStamp(), 5, 0, null);
    }
    document.getElementById('precipImg').className = "imgSelected";
    document.getElementById('precipTab').style.display = "block";
    updateIndexPopup('This is the Precipitation Tab. To learn more, go to the Index and select "Precipitation".');
  } else if (value == 3) {
    inDispLevels = true;
    if (curTracking) {
      pushClick(0, getStamp(), 7, 0, null);
    }
    document.getElementById('levelsImg').className = "imgSelected";
    document.getElementById('levelsTab').style.display = "block";
    updateIndexPopup('This is the Levels Tab, where you can learn about Soil Quality and Water Quality.');
  } else if (value == 4) {
    inDispLevels = true;
    if (curTracking) {
      pushClick(0, getStamp(), 8, 0, null);
    }
    document.getElementById('featuresImg').className = "imgSelected";
    document.getElementById('featuresTab').style.display = "block";
    updateIndexPopup('This is the Physical Features Tab, where you will find information on topography, soil properties, subwatershed boundaries, and strategic wetland areas.');
  } else if (value == 5) {
    inDispLevels = false;
    if (curTracking) {
      pushClick(0, getStamp(), 9, 0, null);
    }
    document.getElementById('settingsImg').className = "imgSelected";
    document.getElementById('settingsTab').style.display = "block";
  } else if (value == 6) {
    inDispLevels = false;
    if (curTracking) {
      pushClick(0, getStamp(), 6, 0, null);
    }
    document.getElementById('calendarImg').className = "imgSelected";
    document.getElementById('yearsTab').style.display = "block";
    updateIndexPopup('The Years Tab allows you to play across multiple years. Different years can affect impact of land use choices. Check them out!');
  } else if (value == 7) {

    inDispLevels = true;
    if (curTracking) {
      pushClick(0, getStamp(), 68, 0, null);
    }
    document.getElementById('yieldImg').className = "imgSelected";
    document.getElementById('yieldTab').style.display = "block"
    updateIndexPopup('The Yield Tab allows you to see different yield base rates based on soil type for different landuse types.');
  }


  //check if the map needs the levels legend displayed
  if (mapIsHighlighted) {
    displayLevels();
  }
} //end switchConsoleTab

//switchYearTab changes the highlighted year
function switchYearTab(yearNumberToChangeTo) {

  //get the currently selected year and make it not selected
  var elements = document.getElementsByClassName("icon yearSelected");
  elements[0].className = "icon yearNotSelected";

  //then toggle on the selected year
  var yearIdString = "year" + yearNumberToChangeTo + "Image";
  document.getElementById(yearIdString).className = "icon yearSelected";
} //end switchYearTab

//here we draw the correct tile colors onto the board material mesh
function drawLevelsOntoBoard(selectionHighlightNumber, highlightType) {

  //change global highlighting setting to set
  mapIsHighlighted = true;

  //update results
  Totals = new Results(boardData[currentBoard]);
  Totals.update();

  //add highlighted textures to the map
  //for each tile in the board
  for (var i = 0; i < boardData[currentBoard].map.length; i++) {
    //if there is an actual tile there
    if (boardData[currentBoard].map[i].landType[currentYear] != 0) {
      //then change mesh material
      meshMaterials[i].map = highlightArray[getHighlightColor(highlightType, i)];
    } //end if
  } //end for

  showLevelDetails(selectionHighlightNumber);
  currentHighlightType = selectionHighlightNumber;
  currentHighlightTypeString = highlightType;
} //end drawLevelsOntoBoard

//displayLevels highlight each tile using getHighlightColor method
function displayLevels(overlayHighlightType) {
  var selectionHighlightNumber = 0;

  //update console tabs
  var element = document.getElementsByClassName('featureSelectorIcon iconSelected');
  if (element[0]) element[0].className = 'featureSelectorIcon icon';
  element = document.getElementsByClassName('levelsSelectorIcon iconSelected');
  if (element[0]) element[0].className = 'levelsSelectorIcon icon';
  //When an overlay is toggled, set toggledOverlay to true
  overlayedToggled = true;
  //record new highlighting selection
  switch (overlayHighlightType) {
    case 'nitrate':
      selectionHighlightNumber = 1;
      updateIndexPopup('To learn more about Nitrate, go to the Index, select "Modules" and then "Water Quality".');
      if (curTracking)
      {
        pushClick(0,getStamp(),42,0,null);
      }
      break;
    case 'erosion':
      selectionHighlightNumber = 2;
      updateIndexPopup('To learn more about Erosion, go to the Index, select "Modules" and then "Soil Quality".');
      if (curTracking)
      {
        pushClick(0,getStamp(),43,0,null);
      }
      break;
    case 'phosphorus':
      selectionHighlightNumber = 3;
      updateIndexPopup('To learn more about Phosphorus, go to the Index, select "Modules" and then "Water Quality".');
      if (curTracking)
      {
        pushClick(0,getStamp(),44,0,null);
      }
      break;
    case 'flood':
      selectionHighlightNumber = 4;
      updateIndexPopup('This map shows the frequency of flooding for each grid cell. To learn more, go to the Index and select "Physical Features".');
      if (curTracking)
      {
        pushClick(0,getStamp(),45,0,null);
      }
      break;
    case 'drainage':
      selectionHighlightNumber = 5;
      updateIndexPopup('This map shows the drainage for each pixel. To learn more, go to the Index and select "Physical Features".');
      if (curTracking)
      {
        pushClick(0,getStamp(),48,0,null);
      }
      break;
    case 'wetland':
      selectionHighlightNumber = 6;
      updateIndexPopup('This map shows the locations for each strategic wetland. To learn more, go to the Index and select "Physical Features".');
      if (curTracking)
      {
        pushClick(0,getStamp(),46,0,null);
      }
      break;
    case 'subwatershed':
      selectionHighlightNumber = 7;
      updateIndexPopup('This map shows the boundaries of each subwatershed. To learn more, go to the Index and select "Physical Features".');
      if (curTracking)
      {
        pushClick(0,getStamp(),47,0,null);
      }
      break;
    case 'soil':
      selectionHighlightNumber = 8;
      updateIndexPopup('There are thirteen different soil classes that each have different properties. To learn more, go to the Index and select "Physical Features".');
      if (curTracking)
      {
        pushClick(0,getStamp(),49,0,null);
      }
      break;
    case 'cornGrain':
      selectionHighlightNumber = 9;
      if (curTracking) {
        pushClick(0, getStamp(), 69, 0, null);
      }
      break;
    case 'soy':
      selectionHighlightNumber = 10;
      if (curTracking) {
        pushClick(0, getStamp(), 70, 0, null);
      }
      break;
    case 'fruit':
      selectionHighlightNumber = 11;
      if (curTracking) {
        pushClick(0, getStamp(), 71, 0, null);
      }
      break;
    case 'cattle':
      selectionHighlightNumber = 12;
      if (curTracking) {
        pushClick(0, getStamp(), 72, 0, null);
      }
      break;
    case 'alfalfa':
      selectionHighlightNumber = 13;
      if (curTracking) {
        pushClick(0, getStamp(), 73, 0, null);
      }
      break;
    case 'grassHay':
      selectionHighlightNumber = 14;
      if (curTracking) {
        pushClick(0, getStamp(), 74, 0, null);
      }
      break;
    case 'switchGrass':
      selectionHighlightNumber = 15;
      if (curTracking) {
        pushClick(0, getStamp(), 75, 0, null);
      }
      break;
    case 'wood':
      selectionHighlightNumber = 16;
      if (curTracking) {
        pushClick(0, getStamp(), 76, 0, null);
      }
      break;
    case 'short':
      selectionHighlightNumber = 17;
      if (curTracking) {
        pushClick(0, getStamp(), 77, 0, null);
      }
      break;

    case 'cornGrain':
      selectionHighlightNumber = 9;
      if (curTracking) {
        pushClick(0, getStamp(), 69, 0, null);
      }
      break;
    case 'soy':
      selectionHighlightNumber = 10;
      if (curTracking) {
        pushClick(0, getStamp(), 70, 0, null);
      }
      break;
    case 'fruit':
      selectionHighlightNumber = 11;
      if (curTracking) {
        pushClick(0, getStamp(), 71, 0, null);
      }
      break;
    case 'cattle':
      selectionHighlightNumber = 12;
      if (curTracking) {
        pushClick(0, getStamp(), 72, 0, null);
      }
      break;
    case 'alfalfa':
      selectionHighlightNumber = 13;
      if (curTracking) {
        pushClick(0, getStamp(), 73, 0, null);
      }
      break;
    case 'grassHay':
      selectionHighlightNumber = 14;
      if (curTracking) {
        pushClick(0, getStamp(), 74, 0, null);
      }
      break;
    case 'switchGrass':
      selectionHighlightNumber = 15;
      if (curTracking) {
        pushClick(0, getStamp(), 75, 0, null);
      }
      break;
    case 'wood':
      selectionHighlightNumber = 16;
      if (curTracking) {
        pushClick(0, getStamp(), 76, 0, null);
      }
      break;
    case 'short':
      selectionHighlightNumber = 17;
      if (curTracking) {
        pushClick(0, getStamp(), 77, 0, null);
      }
      break;
  } //end switch

  //save selectionHighlightNumber for quick access via hotkey
  if (selectionHighlightNumber != 0) {
    previousOverlay = overlayHighlightType;
  }

  //map is not previously highlighted
  if (!mapIsHighlighted) {
    drawLevelsOntoBoard(selectionHighlightNumber, overlayHighlightType);
  }
  //if the map is previously highlighted
  else {
    //if the highlight is the same... turn it off
    if (currentHighlightType == selectionHighlightNumber || selectionHighlightNumber == 0) {

      mapIsHighlighted = false;
      refreshBoard();
      showLevelDetails(-1 * currentHighlightType);
      currentHighlightType = 0;
      currentHighlightTypeString = null;

    }
    //else if the highlighting is different, let's change to the new highlighting
    else {
      //close previous legend
      showLevelDetails(-1 * currentHighlightType);
      //highlight board
      drawLevelsOntoBoard(selectionHighlightNumber, overlayHighlightType);
    } //end else/if group
  } //end else/if mapIsHighlighted
} //end displayLevels()

//toggleOverlay allows the user to quickly switch between an overlay map and the land type mode
function toggleOverlay() {
  if (overlayedToggled == false) {
    switchConsoleTab(previousTab);
    displayLevels(previousOverlay);
    overlayedToggled = true;
  } else {
    switchConsoleTab(1);
    overlayedToggled = false;
  }
} //end toggleOverlay()

//getHighlightColor determines the gradient of highlighting color for each tile dependent on type of map selected
function getHighlightColor(highlightType, tileId) {

  //erosion highlight color indicies
  if (highlightType == "erosion") {
    //subtract 1, as arrays index from 0
    return (Totals.grossErosionSeverity[currentYear][tileId] + 35);
  }
  //nitrite highlight color indicies
  else if (highlightType == "nitrate") {

    var nitrateConcentration = Totals.nitrateContribution[currentYear][tileId];

    if (nitrateConcentration >= 0 && nitrateConcentration <= 0.05) return 18;
    else if (nitrateConcentration > 0.05 && nitrateConcentration <= 0.1) return 8;
    else if (nitrateConcentration > 0.1 && nitrateConcentration <= 0.2) return 9;
    else if (nitrateConcentration > 0.2 && nitrateConcentration <= 0.25) return 31;
    else if (nitrateConcentration > 0.25) return 26;

  }
  //phosphorus highlight color indicies
  else if (highlightType == "phosphorus") {
    //-1 for 0 indexing of arrays, sigh
    return (Totals.phosphorusRiskAssessment[currentYear][tileId] - 1);
  }
  //flood frequency highlight color indicies
  else if (highlightType == "flood") {

    var flood = Number(boardData[currentBoard].map[tileId].floodFrequency);

    switch (flood) {
      case 0:
        return 5;
      case 10:
        return 5;
      case 20:
        return 6;
      case 30:
        return 7;
      case 40:
        return 8;
      case 50:
        return 9;
    } //end switch
  }
  //wetland highlight color indicies
  else if (highlightType == "wetland") {

    if (boardData[currentBoard].map[tileId].strategicWetland == 1) {
      return 26;
    } else {
      return 41;
    }
  }
  // loader
  //subwatershed highlight color indicies
  else if (highlightType == "subwatershed") {

    var watershed = Number(boardData[currentBoard].map[tileId].subwatershed);
    return watershed + 9;
  }
  //drainage highlight color indicies
  else if (highlightType == "drainage") {

    var drainage = Number(boardData[currentBoard].map[tileId].drainageClass);

    switch (drainage) {
      case 70:
        return 31;
      case 60:
        return 32;
      case 50:
        return 33;
      case 45:
        return 33;
      case 40:
        return 34;
      case 30:
        return 34;
      case 10:
        return 35;
      case 0:
        return 35;
    } //end switch
  }
  //soil class highlight color indicies
  else if (highlightType == "soil") {

    var soil = boardData[currentBoard].map[tileId].soilType;

    switch (soil) {
      case "A":
        //color 097c2f
        return 19;
      case "B":
        //color a84597
        return 14;
      case "C":
        //color 919246
        return 30;
      case "D":
        //color c97b08
        return 1;
      case "G":
        //color 9a3010
        return 3;
      case "K":
        //color c7eab4
        return 6;
      case "L":
        //color cc6578
        return 13;
      case "M":
        //color e6bb00
        return 0;
      case "N":
        //color 5e6e71
        return 33;
      case "O":
        //color 837856
        return 34;
      case "Q":
        //color 41b7c5
        return 8;
      case "T":
        //color 0053b3
        return 31;
      case "Y":
        //color 87ceee
        return 18;
    }
  } else if (highlightType == "cornGrain") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
        return 35;
      case "B":
        return 5;
      case "C":
        return 0;
      case "D":
        return 22;
      case "G":
        return 5;
      case "K":
        return 22;
      case "L":
        return 0;
      case "M":
        return 35;
      case "N":
        return 35;
      case "O":
        return 22;
      case "Q":
        return 35;
      case "T":
        return 35;
      case "Y":
        return 22;
    }
  } else if (highlightType == "soy") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
        return 46;
      case "B":
        return 43;
      case "C":
        return 45;
      case "D":
        return 45;
      case "G":
        return 43;
      case "K":
        return 45;
      case "L":
        return 45;
      case "M":
        return 46;
      case "N":
        return 46;
      case "O":
        return 44;
      case "Q":
        return 46;
      case "T":
        return 46;
      case "Y":
        return 45;
    }

  } else if (highlightType == "alfalfa") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
        return 42;
      case "B":
        return 13;
      case "C":
        return 25;
      case "D":
        return 42;
      case "G":
        return 13;
      case "K":
        return 13;
      case "L":
        return 25;
      case "M":
        return 17;
      case "N":
        return 42;
      case "O":
        return 13;
      case "Q":
        return 17;
      case "T":
        return 17;
      case "Y":
        return 42;
    }
  } else if (highlightType == "grassHay") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
        return 46;
      case "B":
        return 47;
      case "C":
        return 45;
      case "D":
        return 46;
      case "G":
        return 47;
      case "K":
        return 47;
      case "L":
        return 45;
      case "M":
        return 29;
      case "N":
        return 46;
      case "O":
        return 47;
      case "Q":
        return 29;
      case "T":
        return 29;
      case "Y":
        return 46;
    }
  } else if (highlightType == "switchGrass") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
        return 49;
      case "B":
        return 45;
      case "C":
        return 49;
      case "D":
        return 45;
      case "G":
        return 45;
      case "K":
        return 45;
      case "L":
        return 49;
      case "M":
        return 49;
      case "N":
        return 51;
      case "O":
        return 45;
      case "Q":
        return 51;
      case "T":
        return 51;
      case "Y":
        return 50;
    }
  } else if (highlightType == "wood") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
        return 55;
      case "B":
        return 53;
      case "C":
        return 52;
      case "D":
        return 55;
      case "G":
        return 55;
      case "K":
        return 53;
      case "L":
        return 52;
      case "M":
        return 55;
      case "N":
        return 54;
      case "O":
        return 52;
      case "Q":
        return 55;
      case "T":
        return 54;
      case "Y":
        return 55;
    }
  } else if (highlightType == "fruit") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
        return 0;
      case "B":
        return 25;
      case "C":
        return 56;
      case "D":
        return 45;
      case "G":
        return 0;
      case "K":
        return 45;
      case "L":
        return 56;
      case "M":
        return 56;
      case "N":
        return 0;
      case "O":
        return 56;
      case "Q":
        return 56;
      case "T":
        return 56;
      case "Y":
        return 45;
    }
  } else if (highlightType == "cattle") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
        return 57;
      case "B":
        return 43;
      case "C":
        return 58;
      case "D":
        return 33;
      case "G":
        return 43;
      case "K":
        return 58;
      case "L":
        return 58;
      case "M":
        return 57;
      case "N":
        return 57;
      case "O":
        return 43;
      case "Q":
        return 57;
      case "T":
        return 57;
      case "Y":
        return 57;
    }
  } else if (highlightType == "short") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
        return 55;
      case "B":
        return 55;
      case "C":
        return 55;
      case "D":
        return 55;
      case "G":
        return 55;
      case "K":
        return 55;
      case "L":
        return 55;
      case "M":
        return 55;
      case "N":
        return 55;
      case "O":
        return 55;
      case "Q":
        return 55;
      case "T":
        return 55;
      case "Y":
        return 55;
    }
  }

} //end getHighlightColor

//getHighlightedInfo returns the value of the corresponding highlighted setting in a tile
//More hover information
function getHighlightedInfo(tileId) {

  //return information about the tile that is highlighted
  if (currentHighlightType <= 0) {
    return "";
  }
  else {

    var highlightString = "";
    switch (currentHighlightType) {
      //create string for nitrate levels
      case 1:
        highlightString = (Totals.nitrateContribution[currentYear][tileId] * 100).toFixed(2) + "%" + "<br>";
        break;
        //create string for gross erosion levels
      case 2:
        highlightString = Number(boardData[currentBoard].map[tileId].results[currentYear].calculatedGrossErosionRate).toFixed(2) + " t/ac/yr" + "<br>";
        break;
        //create string for phosphorus load levels
      case 3:
        highlightString = (boardData[currentBoard].map[tileId].results[currentYear].phosphorusDelivered / boardData[currentBoard].map[tileId].area).toFixed(2) + " lb/ac/yr" + "<br>";
        break;
        //create string for flood frequency levels
      case 4:
        switch (Number(boardData[currentBoard].map[tileId].floodFrequency)) {
          case 0:
            highlightString = "None" + "<br>";
            break;
          case 10:
            highlightString = "None" + "<br>";
            break;
          case 20:
            highlightString = "Rare" + "<br>";
            break;
          case 30:
            highlightString = "Occasionally" + "<br>";
            break;
          case 40:
            highlightString = "Frequently" + "<br>";
            break;
          case 50:
            highlightString = "Ponded" + "<br>";
            break;
        }
        break;
        //create string for drainage classification
      case 5:
        var drainage = Number(boardData[currentBoard].map[tileId].drainageClass);
        switch (drainage) {
          case 70:
            highlightString = "Very Poor" + "<br>";
            break;
          case 60:
            highlightString = "Poor" + "<br>";
            break;
          case 50:
            highlightString = "Somewhat Poor" + "<br>";
            break;
          case 45:
            highlightString = "Somewhat Poor" + "<br>";
            break;
          case 40:
            highlightString = "Moderate / Well" + "<br>";
            break;
          case 30:
            highlightString = "Moderate / Well" + "<br>";
            break;
          case 10:
            highlightString = "Excessive" + "<br>";
            break;
          case 0:
            highlightString = "Excessive" + "<br>";
            break;
        } //end switch
        break;
        //create string for strategic wetlands
      case 6:
        if (boardData[currentBoard].map[tileId].strategicWetland == 1) {
          highlightString = "Strategic Wetland" + "<br>";
        }
        else{
          highlightString = "Non-Strategic Wetland" + "<br>";
        }
        break;
        //create string for subwatershed number
      case 7:
        highlightString = "Subwatershed " + boardData[currentBoard].map[tileId].subwatershed + "<br>";
        break;
      /*case 8:
        var soil = boardData[currentBoard].map[tileId].soilType;
        switch(soil)
          {
            case "A":
              highlightString = "13.2-13.9 Mg/hr/yr" + "<br>";
              break;
            case "B":
              highlightString = "0 Mg/hr/yr" + "<br>";
              break;
            case "C":
                highlightString = "13.9-15.1 Mg/hr/yr" + "<br>";
                break;
            case "D":
              highlightString = "11.2-13.2 Mg/hr/yr" + "<br>";
              break;
            case "G":
              highlightString = "0 Mg/hr/yr" + "<br>";
              break;
            case "K":
              highlightString = "11.2-13.2 Mg/hr/yr" + "<br>";
              break;
            case "L":
              highlightString = "13.9-15.1 Mg/hr/yr" + "<br>";
              break;
            case "M":
            highlightString = "13.2-13.9 Mg/hr/yr" + "<br>";
            break;
            case "N":
            highlightString = "13.2-13.9 Mg/hr/yr" + "<br>";
            break;
            case "O":
            highlightString = "11.2-13.2 Mg/hr/yr" + "<br>";
            break;
            case "Q":
              highlightString = "13.2-13.9 Mg/hr/yr" + "<br>";
              break;
            case "T":
              highlightString = "13.2-13.9 Mg/hr/yr" + "<br>";
              break;
            case "Y":
              highlightString = "11.2-13.2 Mg/hr/yr" + "<br>";
             break;
          }*/
    //Raw numbers are for conversion of the units (conversion doesn't exist in the back end)
    //create string for corn grain yield
    case 9:
      highlightString = Number(boardData[currentBoard].map[tileId].getCornGrainYield()/15.92857142857).toFixed(1) + " Mg/ha/yr" + "<br>";
      break;
    //create string for soybean yield
    case 10:
      highlightString = Number(boardData[currentBoard].map[tileId].getSoybeanYield()/14.87414187643).toFixed(2) + " Mg/ha/yr" + "<br>";
      break;
    //create string for  mixed fruit and vegetable yield
    case 11:
      highlightString = Number(boardData[currentBoard].map[tileId].getMixedFruitsVegetablesYield()/0.060801144492).toFixed(2) + " Mg/ha/yr" + "<br>";
      break;
    //create string for cattle yield
    case 12:
      highlightString = Number(boardData[currentBoard].map[tileId].getCattleSupported(-1)).toFixed(1) + " animals/acre/yr" + "<br>";
      break;
    //create string for alfalfa yield
    case 13:
      highlightString = Number(boardData[currentBoard].map[tileId].getHayYield()/0.446808510638).toFixed(1) + " Mg/ha/yr" + "<br>";
      break;
     //create string for grass hay yield (same as alfalfa)
    case 14:
      highlightString = Number(boardData[currentBoard].map[tileId].getHayYield()/0.446808510638).toFixed(1) + " Mg/ha/yr" + "<br>";
      break;
    //create string for switchgrass yield
    case 15:
      highlightString = Number(boardData[currentBoard].map[tileId].getSwitchgrassYield()/0.445407279029).toFixed(2) + " Mg/ha/yr" + "<br>";
      break;
    //create string for wood yield
    case 16:
      highlightString = Number(boardData[currentBoard].map[tileId].getWoodYield()/171.875).toFixed(2) + " m3/ha/yr" + "<br>";
      break;
    //create string for short-rotation woody biomass yield
    case 17:
      highlightString = "608.6 tons/acre/yr" + "<br>";
      break;
    }
    return highlightString;
  }


} //end getHighlightedInfo

function printSoilType(tileId){
var soil = boardData[currentBoard].map[tileId].soilType;
switch (soil)
{
  case "A":
    highlightString = "Clarion 138B" + "<br>";
    break;
  case "B":
    highlightString = "Buckney 1636" + "<br>";
    break;
  case "C":
    highlightString = "Canisteo 507" + "<br>";
    break;
  case "D":
    highlightString = "Downs 162D2" + "<br>";
    break;
  case "G":
    highlightString = "Gara-Armstrong 993E2" + "<br>";
    break;
  case "K":
    highlightString = "Ackmore-Colo 5B" + "<br>";
    break;
  case "L":
    highlightString = "Coland 135" + "<br>";
    break;
  case "M":
    highlightString = "Tama 120C2" + "<br>";
    break;
  case "N":
    highlightString = "Nicollet 55" + "<br>";
    break;
  case "O":
    highlightString = "Okoboji 90" + "<br>";
    break;
  case "Q":
    highlightString = "Tama 120B" + "<br>";
    break;
  case "T":
    highlightString = "Muscatine 119" + "<br>";
    break;
  case "Y":
    highlightString = "Noadaway 220" + "<br>";
    break;
  }
  if(document.getElementById('parameters').innerHTML.includes('hover4') && currentHighlightType!=0)
  {
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace((Totals.nitrateContribution[currentYear][tileId] * 100).toFixed(2) + "%" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(Number(boardData[currentBoard].map[tileId].results[currentYear].calculatedGrossErosionRate).toFixed(2) + " t/ac/yr" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace((boardData[currentBoard].map[tileId].results[currentYear].phosphorusDelivered / boardData[currentBoard].map[tileId].area).toFixed(2) + " lb/ac/yr" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(Number(boardData[currentBoard].map[tileId].getCornGrainYield()/15.92857142857).toFixed(1) + " Mg/ha/yr" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(Number(boardData[currentBoard].map[tileId].getSoybeanYield()/14.87414187643).toFixed(2) + " Mg/ha/yr" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(Number(boardData[currentBoard].map[tileId].getMixedFruitsVegetablesYield()/0.060801144492).toFixed(2) + " Mg/ha/yr" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(Number(boardData[currentBoard].map[tileId].getCattleSupported(-1)).toFixed(1) + " animals/acre/yr" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(Number(boardData[currentBoard].map[tileId].getHayYield()/0.446808510638).toFixed(1) + " Mg/ha/yr" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(Number(boardData[currentBoard].map[tileId].getSwitchgrassYield()/0.445407279029).toFixed(2) + " Mg/ha/yr" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(Number(boardData[currentBoard].map[tileId].getWoodYield()/171.875).toFixed(2) + " m3/ha/yr" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("608.6 tons/acre/yr" + "<br>", '');
  }
  if(document.getElementById('parameters').innerHTML.includes('hover5'))
  {
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Subwatershed " + boardData[currentBoard].map[tileId].subwatershed + "<br>", '');
  }
  if(document.getElementById('parameters').innerHTML.includes('hover6'))
  {
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("None" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Rare" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Occasionally" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Frequently" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Ponded" + "<br>", '');
  }
  if(document.getElementById('parameters').innerHTML.includes('hover7'))
  {
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Very Poor" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Poor" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Somewhat Poor" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Moderate / Well" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Excessive" + "<br>", '');
  }
  if(document.getElementById('parameters').innerHTML.includes('hover8'))
  {
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Strategic Wetland" + "<br>", '');
    document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace("Non-Strategic Wetland", '');
  }
  return highlightString;
}
//contaminatedRiver changes the color of the river dependent on current phosphorus level
function contaminatedRiver(riverColor) {

  if (riverColor == "brown") {
    for (var i = 0; i < river.children.length; i++) {
      river.children[i].material.color.setHex("0x664d00");
    }
  }

  if (riverColor == "blue") {
    for (var i = 0; i < river.children.length; i++) {
      river.children[i].material.color.setHex("0x40a4df");
    }
  }

  if (riverColor == "green") {
    for (var i = 0; i < river.children.length; i++) {
      river.children[i].material.color.setHex("0x599300");
    }
  }

} //end contaminatedRiver

//objectiveCheck keeps track of level based PEWI accomplishments
function objectiveCheck() {

  //if level is not yet started
  if (levelSpecs.started == 0) {

    updatePopup(levelSpecs.begin);
    levelSpecs.started = 1;

  }

  //if level is started but not finished
  if (levelSpecs.started == 1 && levelSpecs.finished == 0) {

    var numAccomplished = 0;

    //for each objective
    for (var i = 0; i < objectives.length; i++) {

      //if the score monitored by this objective is in the target range
      if (Totals[objectives[i].score][objectives[i].year] > objectives[i].low && Totals[objectives[i].score][objectives[i].year] <= objectives[i].high) {

        //if this is an objective that must be accomplished
        if (objectives[i].final == 1) {

          numAccomplished++;

        }

        //if this objective is not currently accomplished
        if (objectives[i].accomplished == 0 && objectives[i].previouslyDisplayed == 0) {

          objectives[i].previouslyDisplayed = 1;

          if (objectives[i].script != "" && objectives[i].script != "none") {

            updatePopup(objectives[i].script);

          }

          if (objectives[i].animation != "" && objectives[i].animation != "none") {

            selectAnimation(objectives[i].animation);

          }

          objectives[i].accomplished = 1;

        }

        //if the score is not in the target range
      } else {

        //if the objective was previously accomplished but now is not
        if (objectives[i].accomplished == 1) {

          objectives[i].accomplished = 0;
          numAccomplished--;
        }
      }
    }

    //if enough objectives are accomplished
    if (numAccomplished >= levelSpecs.numRequired) {

      levelSpecs.finished = 1;

      updatePopup(levelSpecs.end);
      launchFireworks();

      //Switch to next level or return to menu
      document.getElementById("nextLevelButton").className = "moveButtonShow";
      document.getElementById("mainMenuButton").className = "moveButtonShow";

    }

  }

} //end objectiveCheck

//selectAnimation is a switch to trigger animations
function selectAnimation(animation) {

  switch (animation) {
    case "bird":
      flyLark();
      break;
    case "fireworks":
      launchFireworks();
      break;
    case "flock":
      createFlock();
      break;
    case "brownRiver":
      contaminatedRiver("brown");
      break;
    case "blueRiver":
      contaminatedRiver("blue");
      break;
    case "greenRiver":
      contaminatedRiver("green");
      break;
    case "rain":
      rainOnPewi();
      break;
  } //end switch
} //end selectAnimation

//launchFireworks adds great balls of fire
function launchFireworks() {
  var r = 10 + parseInt(Math.random() * 10);
  for (var i = r; i--;) {
    setTimeout(function() {
      displayFirework();
    }, (i + 1) * (1 + parseInt(Math.random() * 100)));
  }
} //end launchFireworks

//displayFirework adds a single great ball of fire
function displayFirework() {
  createFirework(11, 61, 6, 2, null, null, null, null, false, true);
  return 1;
} //end displayFirework

//flyLark triggers the meadowlark animation
function flyLark() {
  document.getElementById("meadowlark").className = "meadowlarkhidden";
  setTimeout(function() {
    document.getElementById("meadowlark").className = "meadowlarkfly"
  }, 1);
} //end flyLark

//createFlock displays an animated flock of birds for 10 seconds
function createFlock() {
  addBirds();
  setTimeout(function() {
    for (var i = 0; i < birds.length; i++) {
      scene.remove(birds[i]);
    }
    birds = [];
    boids = [];
  }, 10000);
} //end createFlock

//rain makes a storm blow over pewi
function rainOnPewi() {
  //specify the number of raindrops -- could be related to precipitation values
  if (rain == null) {
    makeItRain(Math.pow(Number(boardData[currentBoard].precipitation[currentYear]), 2) * (Number(boardData[currentBoard].precipitation[currentYear]) / 24));
    setTimeout(function() {
      scene.remove(rain);
      rain = null;
    }, 10000);
  }
} //end rain

//writeFileToDownloadString creates a string in csv format that describes the current board
function writeFileToDownloadString(mapPlayerNumber) {
  //IF mapPlayerNumber is 0, then the map is written out as is.
  //  this is the desired use in all cases apart from the multiplayer mode
  //Otherwise, if a player number is specified, the map of that player is distinguished
  //  when the year 1 land use is equal to that player's number

  var string = "";
  if (typeof boardData[currentBoard] !== 'undefined') {

    string = "ID,Row,Column,Area,BaseLandUseType,CarbonMax,CarbonMin,Cattle,CornYield,DrainageClass,Erosion,FloodFrequency,Group,NitratesPPM,PIndex,Sediment,SoilType,SoybeanYield,StreamNetwork,Subwatershed,Timber,Topography,WatershedNitrogenContribution,StrategicWetland,riverStreams,LandTypeYear1,LandTypeYear2,LandTypeYear3,PrecipYear0,PrecipYear1,PrecipYear2,PrecipYear3" + "\n";

    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      if(boardData[currentBoard].map[i].landType[1] != mapPlayerNumber && multiplayerAssigningModeOn) {
        string = string + boardData[currentBoard].map[i].id + "," +
        boardData[currentBoard].map[i].row + "," +
        boardData[currentBoard].map[i].column + "," +
        "0" + ",";
      } else {
      string = string + boardData[currentBoard].map[i].id + "," +
        boardData[currentBoard].map[i].row + "," +
        boardData[currentBoard].map[i].column + "," +
        boardData[currentBoard].map[i].area + ","; }

      if (mapPlayerNumber > 0) {
        if (boardData[currentBoard].map[i].landType[0] == 0) string += "0,";
        else string += ((boardData[currentBoard].map[i].landType[1] == mapPlayerNumber) ? boardData[currentBoard].map[i].baseLandUseType + "," : "-1,")
      } else {
        string += boardData[currentBoard].map[i].baseLandUseType + ",";
      }

      //If the tile really shouldn't be there (-1 for BaseLandUseType)...
      // If the user made a multipler map, and a tile still has values when it's not that player's tile
      if(boardData[currentBoard].map[i].landType[1] != mapPlayerNumber && multiplayerAssigningModeOn) {
      string += "NA" + "," +
        "NA" + "," +
        "NA" + "," +
        "NA" + "," +
        "NA" + "," +
        "NA" + "," +
        "NA" + "," +
        "NA" + "," +
        "NA" + "," +
        "NA" + "," +
        "NA" + "," +
        "0" + "," +
        "NA" + "," +
        "NA" + "," +
        "0" + "," +
        "NA" + "," +
        boardData[currentBoard].map[i].topography + "," +
        "NA" + "," +
        "NA" + "," +
        boardData[currentBoard].map[i].riverStreams + ",";
      } else {
      string += boardData[currentBoard].map[i].carbonMax + "," +
        boardData[currentBoard].map[i].carbonMin + "," +
        boardData[currentBoard].map[i].cattle + "," +
        boardData[currentBoard].map[i].cornYield + "," +
        boardData[currentBoard].map[i].drainageClass + "," +
        boardData[currentBoard].map[i].erosion + "," +
        boardData[currentBoard].map[i].floodFrequency + "," +
        boardData[currentBoard].map[i].group + "," +
        boardData[currentBoard].map[i].nitratesPPM + "," +
        boardData[currentBoard].map[i].pIndex + "," +
        boardData[currentBoard].map[i].sediment + "," +
        boardData[currentBoard].map[i].soilType + "," +
        boardData[currentBoard].map[i].soybeanYield + "," +
        boardData[currentBoard].map[i].streamNetwork + "," +
        boardData[currentBoard].map[i].subwatershed + "," +
        boardData[currentBoard].map[i].timber + "," +
        boardData[currentBoard].map[i].topography + "," +
        boardData[currentBoard].map[i].watershedNitrogenContribution + "," +
        boardData[currentBoard].map[i].strategicWetland + "," +
        boardData[currentBoard].map[i].riverStreams + ","; }

      if (mapPlayerNumber > 0) {
        string += ((boardData[currentBoard].map[i].landType[1] == mapPlayerNumber) ? "1," : "0,") + //year1
          ((boardData[currentBoard].map[i].landType[1] == mapPlayerNumber) ? "1," : "0,") + //year2
          ((boardData[currentBoard].map[i].landType[1] == mapPlayerNumber) ? "1," : "0,"); //year3
      } else {

        string += boardData[currentBoard].map[i].landType[1] + "," +
          boardData[currentBoard].map[i].landType[2] + "," +
          boardData[currentBoard].map[i].landType[3] + ",";
      }

      string += boardData[currentBoard].precipitation[0] + "," +
        boardData[currentBoard].precipitation[1] + "," +
        boardData[currentBoard].precipitation[2] + "," +
        boardData[currentBoard].precipitation[3];

      if (i < boardData[currentBoard].map.length - 1) {
        string = string + '\r\n';
      }

    } //end for


    // finish processing, set boardData as undefined ****** commented for now to avoid error after the file is downloaded
   // cleanCurrentBoardData();


  } // end if

  return string;
} //end writeFileToDownloadString

// clean current boardData
function cleanCurrentBoardData() {
  // set boardData as undefined
  boardData[currentBoard] = void 0;
}

//uploadClicked enables the user to upload a .csv of board data
// this function is called from child frame uploadDownload
function uploadClicked(e) {

files = e.target.files;

    if (files[0].name && !files[0].name.match(/\.csv/)) //if there is a file name and it's not a csv
    {
      if(files[0].name.match(/\.json/))//. json is file format from pewi2.1
      {
        //This piece of code converts files from pewi2.1 to fileformat of pewi 3.0

        var reader = new FileReader();
        reader.readAsText(files[0]);

        var string = "";


        reader.onload = function(event) {


        string = string + "ID,Row,Column,Area,BaseLandUseType,CarbonMax,CarbonMin,Cattle,CornYield,DrainageClass,Erosion,FloodFrequency,Group,NitratesPPM,PIndex,Sediment,SoilType,SoybeanYield,StreamNetwork,Subwatershed,Timber,Topography,WatershedNitrogenContribution,StrategicWetland,riverStreams,LandTypeYear1,LandTypeYear2,LandTypeYear3,PrecipYear0,PrecipYear1,PrecipYear2,PrecipYear3" + "\n";
        console.log("reader created");


        var obj = JSON.parse(event.target.result);
        var year2Available=false;
        var year3Available=false;





        for(var i=0; i<828; i++){//there are 828 tiles on the board (hidden+visible)
            try{
            //This variable 'string' stores the extracted data from the .json file

            string = string + obj["1"].id.data[i] + "," + obj["1"].row.data[i] + "," + obj["1"].column.data[i] + "," +
              ((obj["1"].area.data[i] == null) ? 0 : obj["1"].area.data[i]) + "," + ((obj["1"].area.data[i] == null) ? 0 : obj["1"].baseLandUseType.data[i]) + "," + ((obj["1"].carbonmax.data[i] == null) ? "NA" : obj["1"].carbonmax.data[i]) + "," + ((obj["1"].carbonmin.data[i] == null) ? "NA" : obj["1"].carbonmin.data[i]) +
              "," + ((obj["1"].cattle.data[i] == null) ? "NA" : obj["1"].cattle.data[i]) + "," + ((obj["1"].cornyield.data[i] == null) ? "NA" : obj["1"].cornyield.data[i]) + "," + ((obj["1"].drainageclass.data[i] == null) ? "NA" : obj["1"].drainageclass.data[i]) + "," + ((obj["1"].erosion.data[i] == null) ? "NA" : obj["1"].erosion.data[i]) + "," + ((obj["1"].floodfrequency.data[i] == null) ? "NA" : obj["1"].floodfrequency.data[i]) + "," +
              ((obj["1"].group.data[i] == null && obj["1"].floodfrequency.data[i] != 0) ? "NA" : " ") + "," + ((obj["1"].nitratespmm.data[i] == null) ? "NA" : obj["1"].nitratespmm.data[i]) + "," + ((obj["1"].pindex.data[i] == null) ? "NA" : obj["1"].pindex.data[i]) + "," + ((obj["1"].sediment.data[i] == null) ? "NA" : obj["1"].sediment.data[i]) + "," + ((obj["1"].soiltype.data[i] == null) ? 0 : obj["1"].soiltype.data[i]) + "," + ((obj["1"].soybeanyield.data[i] == null) ? "NA" : obj["1"].soybeanyield.data[i]) + "," +
              ((obj["1"].streamnetwork.data[i] == null) ? "NA" : obj["1"].streamnetwork.data[i]) + "," + ((obj["1"].subwatershed.data[i] == null) ? 0 : obj["1"].subwatershed.data[i]) + "," + ((obj["1"].timber.data[i] == null) ? "NA" : obj["1"].timber.data[i]) + "," + ((obj["1"].topography.data[i] == null) ? 0 : obj["1"].topography.data[i]) + "," + ((obj["1"].watershednitrogencontribution.data[i] == null) ? "NA" : obj["1"].watershednitrogencontribution.data[i]) + "," +
              ((obj["1"].wetland.data[i] == null) ? "NA" : obj["1"].wetland.data[i]) + "," + boardData[currentBoard].map[i].riverStreams + "," /** riverStreams is taken from the rever stream of currrent board*/ ;
          } catch (except) //catches for a wrong json file type error
          {
            alert("This file format is not compatible");
            return;
          }

          try {
            string = string + ((obj["1"].area.data[i] == null) ? 0 : obj["1"].baseLandUseType.data[i]) + ",";
            string = string + ((obj["2"].area.data[i] == null) ? 0 : 1) + ",";
            string = string + ((obj["3"].area.data[i] == null) ? 0 : 1) + "," /** landType + landType + landType*/ ;
          } catch (except) {

            if (except.message == "obj[2].area is undefined") {
              string = string + "0,";
              string = string + "0,";
            } else if (except.message == "obj[3].area is undefined") {
              string = string + "0,";

            }

            try
            {
                string=string +((obj["1"].area.data[i]== null)? 1:obj["1"].baseLandUseType.data[i])+",";
                string=string + ((obj["2"].area.data[i]== null)? 0:obj["2"].baseLandUseType.data[i])+",";
                string=string + ((obj["3"].area.data[i]== null)? 0:obj["3"].baseLandUseType.data[i])+"," /** landType + landType + landType*/;
                if((obj["2"].area.data[i]!= null))//If data for year 2 is included in the file
                {
                addingYearFromFile=true;
                year2Available=true;

                }
                if((obj["3"].area.data[i]!= null))
                {
                addingYearFromFile=true;
                year3Available=true;
                }
            }
            catch(except)
            {

                if(except.message=="obj[2].area is undefined")
                {
                  string=string + "0,";
                  string=string + "0,";
                }
                else if(except.message=="obj[3].area is undefined")
                {
                  string=string + "0,";
                }
            }
            string = string + obj.precipitation[0] + "," +obj.precipitation[1] +"," +obj.precipitation[2] +"," +obj.precipitation[3];
            if(i<827)
             {
                string = string + '\n';
             }

            }
          console.log("got the json obj %s",string);
          initWorkspace("./data.csv");//to fix the unusual loading of the river
          setupBoardFromUpload(string);
          if(year2Available)//If data for years is included, add the year
          {
          addYearAndTransition();
          }
          if(year3Available)
          {
          addYearAndTransition();
          }
            //updating the precip levels from the values in the uploaded file
            boardData[currentBoard].precipitation[0]=obj.precipitation[0];
            boardData[currentBoard].precipitation[1]=obj.precipitation[1];
            boardData[currentBoard].precipitation[2]=obj.precipitation[2];
            boardData[currentBoard].precipitation[3]=obj.precipitation[3];
            document.getElementById("year0Precip").value=(boardData[currentBoard].precipitation[0]==24.58)?0:((boardData[currentBoard].precipitation[0]==28.18)?1:((boardData[currentBoard].precipitation[0]==30.39)?2:((boardData[currentBoard].precipitation[0]==32.16)?3:(boardData[currentBoard].precipitation[0]==34.34)?4:((boardData[currentBoard].precipitation[0]==36.47)?5:6))));
            document.getElementById("year1Precip").value=(boardData[currentBoard].precipitation[1]==24.58)?0:((boardData[currentBoard].precipitation[1]==28.18)?1:((boardData[currentBoard].precipitation[1]==30.39)?2:((boardData[currentBoard].precipitation[1]==32.16)?3:(boardData[currentBoard].precipitation[1]==34.34)?4:((boardData[currentBoard].precipitation[1]==36.47)?5:6))));
            document.getElementById("year2Precip").value=(boardData[currentBoard].precipitation[2]==24.58)?0:((boardData[currentBoard].precipitation[2]==28.18)?1:((boardData[currentBoard].precipitation[2]==30.39)?2:((boardData[currentBoard].precipitation[2]==32.16)?3:(boardData[currentBoard].precipitation[2]==34.34)?4:((boardData[currentBoard].precipitation[2]==36.47)?5:6))));
            document.getElementById("year3Precip").value=(boardData[currentBoard].precipitation[3]==24.58)?0:((boardData[currentBoard].precipitation[3]==28.18)?1:((boardData[currentBoard].precipitation[3]==30.39)?2:((boardData[currentBoard].precipitation[3]==32.16)?3:(boardData[currentBoard].precipitation[3]==34.34)?4:((boardData[currentBoard].precipitation[3]==36.47)?5:6))));
            transitionToYear(1);
            switchYearTab(1);
          //clear initData
          initData = [];


      }


          }

        }
   else//if the file isn't csv or json
   {
      alert("Incorrect File Type!");
    }
  }
  else {//it's csv
  //console.log("Else entered");
    var reader = new FileReader();
    reader.readAsText(files[0]);
      reader.onload = function(e) {


        setupBoardFromUpload(reader.result);

        //Code to check if data multiple years are present in the file
          var allText=reader.result;


          //converting the csv into an array
            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');
            var lines = [];

            for (var i=1; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
             if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
                    }
            lines.push(tarr);
                  }
            }
            var multipleYearFlag=1;


          for(var i=0;i<lines.length;i++)//This for loop iterates through the uploaded csv data file and cheks if year 2 and 3 are present in the file
            {


              if((lines[i][26] != lines[i][27]))
              {
                if(lines[i][26]!=1 && lines[i][26]!=0)
                  multipleYearFlag=2;
                if(lines[i][27]!=1 && lines[i][27]!=0)
                  multipleYearFlag=3;


                break;
              }



            }

            if(multipleYearFlag==2)
            {

              addingYearFromFile=true;
              addYearAndTransition();

            }
            if(multipleYearFlag==3)
            {
              addingYearFromFile=true;
              addYearAndTransition();
              addYearAndTransition();

            }
            //updating the precip levels from the values in the uploaded file
            boardData[currentBoard].precipitation[0]=lines[1][28];
            boardData[currentBoard].precipitation[1]=lines[1][29];
            boardData[currentBoard].precipitation[2]=lines[1][30];
            boardData[currentBoard].precipitation[3]=lines[1][31];
            document.getElementById("year0Precip").value=(boardData[currentBoard].precipitation[0]==24.58)?0:((boardData[currentBoard].precipitation[0]==28.18)?1:((boardData[currentBoard].precipitation[0]==30.39)?2:((boardData[currentBoard].precipitation[0]==32.16)?3:(boardData[currentBoard].precipitation[0]==34.34)?4:((boardData[currentBoard].precipitation[0]==36.47)?5:6))));
            document.getElementById("year1Precip").value=(boardData[currentBoard].precipitation[1]==24.58)?0:((boardData[currentBoard].precipitation[1]==28.18)?1:((boardData[currentBoard].precipitation[1]==30.39)?2:((boardData[currentBoard].precipitation[1]==32.16)?3:(boardData[currentBoard].precipitation[1]==34.34)?4:((boardData[currentBoard].precipitation[1]==36.47)?5:6))));
            document.getElementById("year2Precip").value=(boardData[currentBoard].precipitation[2]==24.58)?0:((boardData[currentBoard].precipitation[2]==28.18)?1:((boardData[currentBoard].precipitation[2]==30.39)?2:((boardData[currentBoard].precipitation[2]==32.16)?3:(boardData[currentBoard].precipitation[2]==34.34)?4:((boardData[currentBoard].precipitation[2]==36.47)?5:6))));
            document.getElementById("year3Precip").value=(boardData[currentBoard].precipitation[3]==24.58)?0:((boardData[currentBoard].precipitation[3]==28.18)?1:((boardData[currentBoard].precipitation[3]==30.39)?2:((boardData[currentBoard].precipitation[3]==32.16)?3:(boardData[currentBoard].precipitation[3]==34.34)?4:((boardData[currentBoard].precipitation[3]==36.47)?5:6))));
            transitionToYear(1);//transition to year one
            switchYearTab(1);










        //clear initData
        initData = [];
    }//end onload
  } //end else

  closeUploadDownloadFrame();

  //reset keylistening frame (ie give up focus on iframe)
  //no more conch for us
  document.activeElement.blur();


} //end downloadClicked()

//animateResults() frame
function animateResults() {
  //if it is ever the case that we want to do some fancy zooming or screen
  //  arrangement for the results page, we'll do that here
  document.getElementById("resultsFrame").className = "resultsFrame";

} //end animateResults

//calculateResults triggers the results calculations by updating Totals
// deprecated?
function calculateResults() {
  //Totals = new Results(boardData[currentBoard]);
  Totals.update();
  //contaminatedRiver(Totals);
} //end calculateResults

//showCredits opens the credits iframe
function showCredits() {
  if (!modalUp) {
    if (curTracking) {
      pushClick(0, getStamp(), 11, 0, null);
    }
    document.getElementById('creditsFrame').style.display = "block";
    document.getElementById('closeCredits').style.display = "block";
    document.getElementById('modalCreditsFrame').style.display = "block";
    modalUp = true;
  }
  //Event Listner to close the credits page
  document.addEventListener('keyup', aboutsEsc);
} //end showCredits

//closeCreditFrame closes the credits iframe
function closeCreditFrame() {
  if (curTracking) {
    pushClick(0, getStamp(), 33, 0, null);
  }
  document.getElementById('creditsFrame').style.display = "none";
  document.getElementById('closeCredits').style.display = "none";
  document.getElementById('modalCreditsFrame').style.display = "none";
  modalUp = false;
  //Event listner that closes escape key
  document.removeEventListener('keyup', aboutsEsc);
} //end closeCreditFrame

//showUploadDownload opens the credits iframe
function showUploadDownload() {
  if (!modalUp) {
    if (curTracking) {
      pushClick(0, getStamp(), 10, 0, null);
    }
    document.getElementById('closeUploadDownload').style.display = "block";
    document.getElementById('uploadDownloadFrame').style.display = "block";
    document.getElementById('modalUploadFrame').style.display = "block";
    modalUp = true;
  }
  document.addEventListener('keyup', downuploadEsc);
  if (mapIsHighlighted) {
    displayLevels();
  }
} //end showUploadDownload

//closeUploadDownloadFrame closes the credits iframe
function closeUploadDownloadFrame() {
  if (curTracking) {
    pushClick(0, getStamp(), 53, 0, null);
  }
  document.getElementById('closeUploadDownload').style.display = "none";
  document.getElementById('uploadDownloadFrame').style.display = "none";
  document.getElementById('modalUploadFrame').style.display = "none";
  modalUp = false;
  document.removeEventListener('keyup', downuploadEsc);
} //end closeUploadDownloadFrame

//toggleIndex displays and hides the codex
function toggleIndex() {

  if (document.getElementById('index').style.display != "block" && !modalUp) {
    closeCreditFrame();
    closeUploadDownloadFrame();
    if (document.getElementById('resultsFrame').className != "resultsFrameRolled") resultsEnd();

    if (curTracking) {
      pushClick(0, getStamp(), 78, 0, null)
    }
    modalUp = true;
    document.getElementById('modalCodexFrame').style.display = "block";
    document.getElementById('index').style.display = "block";
    document.addEventListener('keyup', indexEsc);
  } else if (document.getElementById('index').style.display == "block" && modalUp) {

    if (curTracking) {
      pushClick(0, getStamp(), 79, 0, null)
    }
    modalUp = false;

    document.getElementById('modalCodexFrame').style.display = "none";
    document.getElementById('index').style.display = "none";
    document.activeElement.blur();

    document.getElementById('index').contentWindow.document.getElementById('square1').innerHTML = "<img src='./imgs/indexMain.png'>";
    document.getElementById('index').contentWindow.document.getElementById('square2frame').src = "";
    document.getElementById('index').contentWindow.document.getElementById('switchGeneral').style.display = "none";
    document.getElementById('index').contentWindow.document.getElementById('switchAdvanced').style.display = "none";
    document.getElementById('index').contentWindow.document.getElementById('title').innerHTML = "";

    document.getElementById('index').contentWindow.resetHighlighting();
    document.removeEventListener('keyup', indexEsc);

  }
} //end toggleIndex

// execute when Esc is pressed while on the result page
function resultsEsc(e) {
  if (e.keyCode == 27) {
    resultsEnd();
  }
}

//Function that closes the about dialog when escape key is pressed
function aboutsEsc(e) {
  if (e.keyCode == 27) {
    closeCreditFrame();
  }
}

//Function that closes the Download dialog when the escape key is pressed
function downuploadEsc(e) {
  if (e.keyCode == 27) {
    closeUploadDownloadFrame();
  }
}
//Function that closes the download index dialog when escape key is pressed
function indexEsc(e) {
  if (e.keyCode == 27) {
    toggleIndex();
  }
}


//printLandUseType returns a display-worthy string of land type from numeric key
function printLandUseType(type) {
  //completely redundant, but preserved for ease of use
  //see backEnd
  return LandUseType.getPrintFriendlyType(type);
} //end printLandUseType

//printPrecipYearType returns the precipitation category of the year's precipitation
function printPrecipYearType() {

  var precipLevel = boardData[currentBoard].precipitation[currentYear];

  if (precipLevel == 24.58 || precipLevel == 28.18) {
    return "Dry";
  } else if (precipLevel == 30.39 || precipLevel == 32.16 || precipLevel == 34.34) {
    return "Normal";
  } else {
    if (currentYear > 0 &&
      (boardData[currentBoard].precipitation[currentYear - 1] == 24.58 ||
        boardData[currentBoard].precipitation[currentYear - 1] == 28.18)
    ) {
      return "Flood";
    }
    return "Wet";
  }

} //end printPrecipYearType

//showInfo updates the bottom HUD
function showInfo(stringToShow) {
  if (!multiplayerAssigningModeOn) document.getElementById("currentInfo").innerHTML = stringToShow;
} //end showInfo

//clearInfo removes text from the bottom HUD
function clearInfo() {
  document.getElementById("currentInfo").innerHTML = " ";
} //end clearInfo

//updatePopup appends text to the popup dialogue
function updatePopup(string) {
  document.getElementById("popupText").innerHTML = string + "<br>___________________________<br>" + document.getElementById("popupText").innerHTML;
  document.getElementById("popup").className = "popup";
  document.getElementById("dialogueButton").className = "dialogueButton";
   document.getElementById("dialogueButton").style.background= '#'+Math.random().toString(16).slice(-6)
//document.getElementById("popup").style.background= "green";
  //Will activate an animation on the lower right side of the screen to show that the message box has updated
} //end updatePopup
function updateIndexPopup(string){
  window.parent.document.getElementById("indexPopupText").innerHTML = string;
  window.parent.document.getElementById("backgroundInfoButton").style.background= '#'+Math.random().toString(16).slice(-6)
}

//clearPopup removes all text from the popup dialogue and hides it
function clearPopup() {
  document.getElementById("popupText").innerHTML = " ";
  document.getElementById("popup").className = "popupHidden";
  document.getElementById("dialogueButton").className = "dialogueButtonRolled";
} //end clearPopup

//togglePopupDisplay allows for displaying and hiding the popup dialogue
function togglePopupDisplay() {
  if (!modalUp) {
    if (document.getElementById("popup").className == "popup")
    {
      if (curTracking)
      {
        pushClick(0,getStamp(),14,0,null);
      }
      document.getElementById("popup").className = "popupHidden";
      document.getElementById("dialogueButton").className = "dialogueButtonRolled";
    }
    else
    {
      if (curTracking)
      {
        pushClick(0,getStamp(),54,0,null);
      }
      document.getElementById("popup").className = "popup";
      document.getElementById("dialogueButton").className = "dialogueButton";
    }
  } //end if
} // togglePopupDisplay()

//Allows user to
function toggleBackgroundInfoDisplay()
{
  if(!modalUp){
    if(document.getElementById("backgroundInfoBox").className == "backgroundInfoBox")
    {
      document.getElementById("backgroundInfoBox").className = "backgroundInfoBoxRolled";
      document.getElementById("backgroundInfoButton").className = "backgroundInfoButtonRolled";
      document.getElementById("indexPopupText").className = "indexPopupTextHidden";
    }
    else
    {
      document.getElementById("backgroundInfoBox").className = "backgroundInfoBox";
      document.getElementById("backgroundInfoButton").className = "backgroundInfoButton";
      document.getElementById("indexPopupText").className = "indexPopupText";
    }
  }
}

//randomAllowed determines whether or not the current mode permits tile randomization
function randomAllowed(modeName) {
  //Randomization is not allowed in play (P) or utilities (U)
  if (modeName == "P" || modeName == "U") {
    randAllow = "false";
    localStorage.setItem("randAllow", randAllow);
  }
  //Randomization is allowed in sandbox mode
  else {
    randAllow = "true";
    localStorage.setItem("randAllow", randAllow);
  }
} //end randomAllowed

//randomizeBoard randomly selects a landtype for each tile
function randomizeBoard() {

  var prevPainter = painter;
  //Range of values for each land-use type
  var randomPainterTile = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  randomizing = true
  //for whole board (as long as randomization is allowed)
  if (localStorage.getItem("randAllow") == "true" && !multiplayerAssigningModeOn) {
    //getRandomInt is in back-end helperMethods
    for(var j = 1; j <= 15; j++)
    { //Check to see if the landuse type is toggled off or not
      if(document.getElementById('parameters').innerHTML.indexOf('paint' + j + "\n") != -1)
      {
        //If it's toggled off, remove the landuse type for randomization
        var removedIndex = randomPainterTile.indexOf(j);
         for(var x = 0; x < 15; x++)
        {
          if(removedIndex == x)
          {
            randomPainterTile.splice(removedIndex, 1);
          }
        }
    }
    }

    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      //if tile exists
      //Random tiles will keep getting added to the map as long as the tile exists
      if (boardData[currentBoard].map[i].landType[currentYear] != LandUseType.none)
      {

         painter = randomPainterTile[Math.floor(Math.random() * randomPainterTile.length)];
        //  console.log(painter);
        changeLandTypeTile(i);
      }
    } //end for all tiles
  }
  //randomizing = false;
  painter = prevPainter;

} //end randomizeBoard

function saveAndRandomize(){
  var prevPainter = painter;
  //Range of values for each land-use type
  var randomPainterTile = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  //randomizing = true
  //for whole board (as long as randomization is allowed)
  if (localStorage.getItem("randAllow") == "true" && !multiplayerAssigningModeOn) {
    //getRandomInt is in back-end helperMethods
    for(var j = 1; j <= 15; j++)
    { //Check to see if the landuse type is toggled off or not
      if(document.getElementById('parameters').innerHTML.indexOf('paint' + j+"\n") != -1)
      {
        //If it's toggled off, remove the landuse type for randomization
        var removedIndex = randomPainterTile.indexOf(j)//2
        for(var x = 0; x < 15; x++)
        //for(var x = randomPainterTile.length; x >= 1; x--)
        {
          if(removedIndex == x)
          {
            delete randomPainterTile[removedIndex];
            for(var k = 1; k <= 15; k++)
            {
              if(document.getElementById('parameters').innerHTML.indexOf('paint' + k+"\n") === -1)
              {
                delete randomPainterTile[removedIndex];
                randomPainterTile[removedIndex] = k;
                break;

              }
            }

          }
        }
      }
    }//end for
    var newDefaultLandUse=1;
    //finding a new default
    for(var r=1; r<=15; r++)
    {
      if(randomPainterTile.indexOf(r)!=-1)
      {
        newDefaultLandUse=r;
        break;
      }
    }
    console.log(newDefaultLandUse);
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      //if tile exists
      //Random tiles will keep getting added to the map as long as the tile exists
      if ((boardData[currentBoard].map[i].landType[currentYear] != LandUseType.none )&&(randomizing==false))
      {
         painter = newDefaultLandUse
        changeLandTypeTile(i);
      }
      else if(randomizing)
      {
        painter = randomPainterTile[Math.floor(Math.random() * randomPainterTile.length)];
        changeLandTypeTile(i);
      }

    }
    painter=newDefaultLandUse; //end for all tiles
  }
} //end saveandRandomize

//toggleVisibility parses the options stored in the parameters div and toggles their visibility
//elements that are on by default can be turned off with their id
//some elements that are off by default can be toggled on with specific keywords
//  see the switch statement and code in options Frame for more detail
function toggleVisibility() {

  //reset default off items
  document.getElementById('statFrame').style.display = "none";
  //document.getElementById('year0Button').style.display = "none";
  //document.getElementById('paintPlayer1').style.display = "none";
  //document.getElementById('paintPlayer2').style.display = "none";
  //document.getElementById('paintPlayer3').style.display = "none";
  //document.getElementById('paintPlayer4').style.display = "none";
  //document.getElementById('paintPlayer5').style.display = "none";
  //document.getElementById('paintPlayer6').style.display = "none";
  //document.getElementById('playerAddButton').style.display = "none";
  //currentPlayer=1;


  //reset default on items
  for (var i = 1; i <= 15; i++) {
    var string = "paint" + i;
    document.getElementById(string).style.display = "inline-block";
  }

  document.getElementById('year1Button').style.display = "block";
  document.getElementById('year2Button').style.display = "block";
  document.getElementById('year3Button').style.display = "block";
  document.getElementById('year1PrecipContainer').style.display = "block";
  document.getElementById('year2PrecipContainer').style.display = 'block';
  document.getElementById('year3PrecipContainer').style.display = 'block';
  document.getElementById('resultsButton').style.display = 'block';

  //reset precip
  immutablePrecip = false;

  //alright, now let's see what the parameters look like
  // abscond them from the index.html page parameters div
  var strRawContents = document.getElementById('parameters').innerHTML;

  //split based on escape chars
  while (strRawContents.indexOf("\r") >= 0) {
    strRawContents = strRawContents.replace("\r", "");
  }
  var arrLines = strRawContents.split("\n");

  //for each line of the parameters div, as each keyword has its own line
  for (var i = 0; i < arrLines.length; i++) {
    if (arrLines[i]) {

      //giant switch
      switch (arrLines[i]) {
        case "statsOn":
          document.getElementById('statFrame').style.display = "block";
          break;
        case "year0On":
          document.getElementById('year0Button').style.display = "block";
          break;
        case "precipOff":
          immutablePrecip = true;
          break;
        case "multiAssign":

          for (var j = 1; j <= 6; j++) {
            //document.getElementById('paintPlayer' + j).style.display = "inline-block";
          }
          document.getElementById('playerAddButton').style.display = "inline-block";
          break;
        default:
          document.getElementById(arrLines[i]).style.display = "none";

      }
    }
  } //end for


  //toggle Precip visibility
  for (var y = 0; y <= 3; y++) {

    var elementIdString = "year" + y + "Precip";

    document.getElementById(elementIdString).style.display = "inline-block";

    var currentInnerHtml = (document.getElementById(elementIdString + "Container").innerHTML).trim();
    //if it's not, not a number, that is, if the last digit is a number
    //  then we know the precip was immutable before and we need to cut
    //  this text off
    if (!isNaN(currentInnerHtml[currentInnerHtml.length - 1])) {
      while (!(currentInnerHtml[currentInnerHtml.length - 1] == '>')) {
        //keep cutting off characters until we come back to the end tag of the
        // selector element
        currentInnerHtml = currentInnerHtml.slice(0, -1);
      } //end while

      //write the new string
      document.getElementById(elementIdString + "Container").innerHTML = currentInnerHtml;
    }
    //check if the precip shouldn't be changeable
    // if this is the case, then show the precip values, but not in a drop-down selector
    if (multiplayerAssigningModeOn)
      immutablePrecip = false; //***************************************************trial
    if (immutablePrecip) {
      document.getElementById(elementIdString).style.display = "none";

      var precipValue = boardData[currentBoard].precipitation[y];
      elementIdString += "Container";
      var string = document.getElementById(elementIdString).innerHTML;
      string = string + "  " + precipValue;
      document.getElementById(elementIdString).innerHTML = string;
    } else {
      document.getElementById(elementIdString).options[boardData[currentBoard].precipitationIndex[y]].selected = true;
    }
  }

  //alright, now we just have to check to make sure that nothing that was toggled off
  // is selected

  //check to see if the year we are on is no longer a year... if so, well, switch to y1
  var yearMax = 3;
  if (document.getElementById("year3Button").style.display == "none") yearMax = 2;
  if (document.getElementById("year2Button").style.display == "none") yearMax = 1;

  if (currentYear > yearMax) {
    transitionToYear(1);
    switchYearTab(1);
  }

  if (boardData[currentBoard].calculatedToYear > yearMax) boardData[currentBoard].calculatedToYear = yearMax;

  //check to see if the painter selected is no longer a painter...
  if (document.getElementById('paint' + painter).style.display == "none" && !multiplayerAssigningModeOn) {
    changeSelectedPaintTo(1);
  }

} //end toggleVisibility()

//painterSelect changes the currenly selected 'brush' of the painter tool
//  the options are normla click change, hover change, and grid change.
function painterSelect(brushNumberValue) {

  //reset the functionality to default, then change as needed
  var selectedElement = document.getElementsByClassName('painterIcon iconSelected');
  selectedElement[0].className = "painterIcon icon";
  painterTool.hover = false;

  //if the brush is a normal cell paint
  if (brushNumberValue == 1) {
    if (curTracking) {
      pushClick(0, getStamp(), 50, 0, null);
    }
    document.getElementById('cellPaint').className = 'painterIcon iconSelected';
    if (painterTool.status == 2) refreshBoard();
    painterTool.status = 0;
  }
  //set the grid paint up with a status of 1
  else if (brushNumberValue == 2) {
    if (curTracking) {
      pushClick(0, getStamp(), 51, 0, null);
    }
    //painterTool.status 0 indicates not ready
    //painterTool.status 1 indicates waiting for DoubleClick
    //painterTool.status 2 indicates grid drag activity
    painterTool.status = 1;
    //ready for double click
    document.getElementById('gridPaint').className = "painterIcon iconSelected";
  } //end else/if group
} //end painterSelect()

//resetOptions is called when options menu is closed
// this function closes the iframe, blurs the frame, and
// takes the parameters set by it to order the page elements
function resetOptions() {

  //close frame
  modalUp = false;
  document.getElementById('options').style.visibility = "hidden";
  //make sure the frame is no longer accepting input such as keyboard or mouse events
  document.activeElement.blur();

  //setup page according to the parameters
  toggleVisibility();
  // remove Esc key event listener
  document.removeEventListener('keyup', optionsEsc);
  window.frames[4].document.removeEventListener('keyup', optionsEsc);
} //end resetOptions

//startOptions displays the options page
function startOptions() {
  //if nothing else has precedence
  if (!modalUp) {
    modalUp = true;
    document.getElementById('options').style.visibility = "visible";
    //setup options page with the current parameter selection
    document.getElementById('options').contentWindow.getCurrentOptionsState();
    // add Esc key event listener
    document.addEventListener('keyup', optionsEsc);
    window.frames[4].document.addEventListener('keyup', optionsEsc);
  }
} // end startOptions

// Execute when Esc key is pressed while on the options page
function optionsEsc(e) {
  if (e.keyCode == 27) {
    // turn off options page without options change
    resetOptions();
  }
}

//Returns the hotkey array
function giveHotkeys() {
  return hotkeyArr;
} //end giveHotkeys()

//Resets the hotkey array to its default state
function resetHotkeys() {
  hotkeyArr = [[69,null],[82,null],[84,null],[85,null],[66,null],[86,null],[68,null],[65,null],[87,null],[83,null],[79,null],[81,null]];
  updateKeys();
} //end resetHotkeys()

//Checks other hotkey bindings
//
//givenKey: Key they want to bind
//givenFunc: The command for binding
//givenSlot: Primary or Secondary hotkey binding

function setHotkey(givenKey,givenFunc,givenSlot) {
  //For each hotkey possible
  givenKey = (givenKey.toUpperCase()).charCodeAt(0);
  //Make sure it's an appropriate keycode character
  if(!isNaN(givenKey) || givenKey < 10) {
    for(var i = 0; i < hotkeyArr.length; i++) {
      //For each assigned hotkey for that type (2 is maximum)
      for(var j = 0; j < 2; j++) {
        //If the given hotkey matches one of the existing ones, replace the old with null
        if(hotkeyArr[i][j] == givenKey) {
          hotkeyArr[i][j] = null;
        }
      }
    }
    //Set the new hotkey
    if(hotkeyArr[givenFunc][0] != givenKey && givenSlot == 1 || givenSlot == 2 && hotkeyArr[givenFunc][0] == null) {
      hotkeyArr[givenFunc][0] = givenKey;
    } else {
      hotkeyArr[givenFunc][1] = givenKey;
    }
    updateKeys();
  }
} //end setHotkey(givenKey, givenFunc, givenSlot)

//Updates the visuals for the user
function updateKeys() {
  for(var i = 0; i < hotkeyArr.length; i++) {
    for(var j = 0; j < 2; j++) {
      var temp = j+1;
      if(hotkeyArr[i][j]==null){
        window.frames[4].document.getElementById("hki"+i+"e"+temp).value = "";
        window.frames[4].document.getElementById("hki"+i+"e"+temp).placeholder = "N/A";
      } else {
        window.frames[4].document.getElementById("hki"+i+"e"+temp).value = "";
        window.frames[4].document.getElementById("hki"+i+"e"+temp).placeholder = String.fromCharCode(hotkeyArr[i][j]);
      }
    }
  }
} //end updateKeys()


//endMultiAssignMode displays the multiPlayer element
function endMultiplayerAssignMode() {
  //create an iframe, select up to 6 players
  //then downloads
  var currentPlayers = document.getElementsByClassName("players");
  for(var i = 1; i < currentPlayers.length+1; i++) {
    var foundPlayerTile = false;
    for(var j = 0; j < boardData[currentBoard].map.length; j++) {
      if(boardData[currentBoard].map[j].landType[1] == i) {
        foundPlayerTile = true;
      }
    }
    if(foundPlayerTile == false) {
      break;
    }
  }
  if(foundPlayerTile) {
    document.getElementById('multiplayer').style.visibility = "visible";
  } else {
    alert("Not all players have allocated land plots; please delete or add land plots for these players.");
  }

} //end endMultiAssignMode

//hideMultiDownload hides the multiPlayer element
function hideMultiDownload() {
  document.getElementById('multiplayer').style.visibility = "hidden";
  document.activeElement.blur();
} //end hideMultiDownload

//multiUpload directs functions for multiplayer file upload
function multiplayerFileUpload(fileUploadEvent) {
  //if this is the first time, call base prep, otherwise, add map on top

  // return (numberOfTimesThisFunctionHasBeenCalledInProcess >= 1) ?
  //   multiplayerAggregateOverlayMapping(fileUploadEvent) :
  //   multiplayerAggregateBaseMapping(fileUploadEvent);

  multiplayerAggregateBaseMapping(fileUploadEvent.files[0]);
  for (var i = 1; i < fileUploadEvent.files.length; i++) {
    multiplayerAggregateOverlayMapping(fileUploadEvent.files[i]);
  }

} //end multiUpload

//this function initializes the aggregation of multiplayer boards
//  basically, it setups up the first board as is
function multiplayerAggregateBaseMapping(file) {
  //set up first file completely normally

  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(e) {
    setupBoardFromUpload(reader.result);
    //clear initData
    initData = [];
  }
} //end multiplayerAggregateBaseMapping

//here we facilitate the aggregation of multiplayer boards
function multiplayerAggregateOverlayMapping(file) {

  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(e) {

    //setup data from reader (file) into intiData global
    if (parseInitial(reader.result)) {
      //call *backend* function for overlaying boards, will put boardFromUpload onto
      //  the current board
      overlayBoard(boardData[currentBoard]);
      //now switch to the current board so that all data is up to date
      switchBoards(boardData[currentBoard]);
    }
    //clear initData
    initData = [];
  }
} //end multiplayerAggregateOverlayMapping

//toggleChangeLandType toggles a boolean that tracks the state which is required to change land type
function toggleChangeLandType() {
  //ternary toggle on clearToChangeLandType being true
  clearToChangeLandType =
    (clearToChangeLandType) ? false : true;
} //end toggleChangeLandType

function addPlayer(givenPlayer) {
  if(totalPlayers<6) {
    totalPlayers++;
    //Toggled when you press the "Add player" button
    if(givenPlayer==null) {
      var tempPlayer = document.createElement("paintPlayer" + totalPlayers);
      tempPlayer.id = "paintPlayer"+totalPlayers;
      var playerString =  "<div id='paintPlayer"+totalPlayers+"' class='players' onclick='changeSelectedPaintTo("+totalPlayers+");'" +
    "onmouseover='toggleChangeLandType();'' onmouseout='toggleChangeLandType();'>";
    playerString += "<img id='player"+totalPlayers+"Image' style='display:inline-block;' class='playerIcon iconSelected'" +
    " src='./imgs/player"+totalPlayers+"a.png'></div>";
    //Toggled when you are sorting boards
    } else {
      var tempPlayer = document.createElement("paintPlayer" + givenPlayer);
      tempPlayer.id = "paintPlayer"+givenPlayer;
      var playerString =  "<div id='paintPlayer"+givenPlayer+"' class='players' onclick='changeSelectedPaintTo("+givenPlayer+");'" +
    "onmouseover='toggleChangeLandType();'' onmouseout='toggleChangeLandType();'>";
    playerString += "<img id='player"+givenPlayer+"Image' style='display:inline-block;' class='playerIcon iconSelected'" +
    " src='./imgs/player"+givenPlayer+"a.png'></div>";
    }
    tempPlayer.innerHTML = playerString;
    var whichSide = parseInt(tempPlayer.id.substr(11,1));
    //On the left side
    if(whichSide%2!=0 || whichSide==1) {
      document.getElementById("leftPlayerCon").appendChild(tempPlayer);
    //On the right side
    } else {
      document.getElementById("rightPlayerCon").appendChild(tempPlayer);
    }
    changeSelectedPaintTo(totalPlayers);
  }
}

//Handles the delete button feature
function deleteAndSort() {
  //Saves the previous current player
  var tempCurrentPlayer = getCurrentPlayer();
  combineMulti([1,getCurrentPlayer()]);
  sortPlayers();
  if(tempCurrentPlayer < totalPlayers) {
    changeSelectedPaintTo(tempCurrentPlayer);
  } else {
    changeSelectedPaintTo(totalPlayers);
  }
}

//Allows the user to delete a player
function deletePlayer(givenPlayer) {
  if(totalPlayers>1) {
    document.getElementById("paintPlayer"+givenPlayer).remove();
    totalPlayers--;
  }
} //end deletePlayer()

//Reorders the players and reallocates the board
//When a merge happens (Say, you merge 2 and 4 together [and you have all players open], the player list is now 1,2,3,4,5)
// 1-> Tiles still "1"
// 2-> Tiles still "2" (and "4"'s are now "2"'s)
// 3-> Tiles still "3"
// 4-> Tiles are now "4", but were "5"
// 5-> Tile are now "5", but were "6"
// 6-> Now deleted
//Also, since 2 and 4 were merged, the 4th player was deleted. But since the players were shifted, the 4th player must now reappear
function sortPlayers() {
  //Get the current players on the board (using the above example, we should have 1,2,3,5,6)
  var curPlayers = document.getElementsByClassName("players");
  var curPlayersArr = Array.prototype.slice.call(curPlayers);
  //Sorts the players in order (For the above example, it will output 1,2,3,5,6)
  curPlayersArr.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
  for(var i = 0; i < curPlayersArr.length; i++) {
    tempPlayer = curPlayersArr[i]
    //If the player doesn't exist, but later players do, cascade them down
    if(tempPlayer.id != "paintPlayer"+(i+1)) {
      addPlayer(i+1);
      //Find the next actual player
      for(var j = i; j < curPlayersArr.length; j++) {
        tempPlayer = curPlayersArr[j];
        //For the example above, this will first find 5, then make all the player 5 tiles as player 4's. This will also make all of player 6's
        //  tiles as player 5's. At the end of this method, player 6 will be deleted, leaving you with players 1,2,3,4, and 5
        if(tempPlayer!=null) {
          var changedPlayer = parseInt(tempPlayer.id.substr(11,1));
          combineMulti([i+1,changedPlayer]);
          break;
        }
      }
    }
  }
} //end sortPlayers()

function switchCurrentPlayer(playerNumber) {
  currentPlayer = playerNumber;
  //boardData[currentBoard].updateBoard();
} //end transitionToYear

//Returns the currentPlayer value
function getCurrentPlayer() {
  return currentPlayer;
} //end getCurrentPlayer()

//Resets the player count
function resetPlayers() {
  var currentPlayers = document.getElementsByClassName("players");
  for(var i = currentPlayers.length; i > 0; i--) {
    deletePlayer(i);
  }
} //end resetPlayers()

//resetMultiplayer() undos the display-changes made while assigning multiplayers
function resetMultiPlayer() {
  //Eliminates all players except for player 1
  resetPlayers();
  resetting = true;
  //Reloads the default multiplayer map
  parent.loadLevel(-1);
}
//multiplayerMode hides all unnecessary options from screen
function multiplayerMode() {
  if (multiplayerAssigningModeOn) {

    document.getElementById("message").style.display = "block";
    //Don't add an aditional player if the level was only reset
    if(!resetting) {
      addPlayer();
    } else {
      resetting = false;
    }
    document.getElementById("combineButton").style.visibility = "visible";
    document.getElementById("playerOptions").style.visibility = "visible";
    document.getElementById("playerAddButton").style.display = "inline-block";
    document.getElementById("playerResetButton").style.display = "block";
    document.getElementById("levelsButton").style.display = "none";
    document.getElementById("yearButton").style.display = "none";

  }


}

function multiplayerExit() {
  document.getElementById("combineButton").style.visibility = "hidden";
  document.getElementById("playerOptions").style.visibility = "hidden";
  document.getElementById("levelsButton").style.display = "block";
  document.getElementById("yearButton").style.display = "block";
  document.getElementById("playerResetButton").style.display = "none";
  // document.getElementById("playerResetImage").style.display = "none";
  resetPlayers();
  //Elimnate player 1 (since we are actually leaving multiplayer) and reduce totalPlayers count to 0
  if(multiplayerAssigningModeOn) {
    document.getElementById("paintPlayer1").remove();
    totalPlayers--;
  }
  multiplayerAssigningModeOn = false;

}

function getNumberOfPlayers() {
  return totalPlayers;
}

//Function that allows for multiple players to be combined into one player
function combinePlayers() {
  if(document.getElementById("combineButton").innerHTML == "Combine Players") {
    console.log("Combining players...");
    document.getElementById("combineButton").innerHTML = "Merge";
    document.getElementById("genOverlay").style.visibility = "visible";
    //Makes it so the user can only click the player paint when merging players
    document.getElementById("painterTab-leftcol").style.zIndex = "1002";
    document.getElementById("painterTab-rightcol").style.zIndex = "1002";
    document.getElementById("playerResetButton").style.zIndex = "0";
    document.getElementById("playerAddButton").style.zIndex = "0";
    document.getElementById("combineButton").style.zIndex = "1002";
    var painterElementId = "player" + painter + "Image";
    document.getElementById(painterElementId).className = "playerIcon icon";
  } else {
    console.log("Merging players...");
    //Reset selections
    for(var i = 0; i < playerCombo.length; i++) {
      var painterElementId = "player" + playerCombo[i] + "Image";
      document.getElementById(painterElementId).className = "playerIcon icon";
    }
    if(playerCombo.length>1) {
      combineMulti(playerCombo);
    }
    playerCombo = [];
    document.getElementById("combineButton").innerHTML = "Combine Players";
    document.getElementById("genOverlay").style.visibility = "hidden";
    document.getElementById("painterTab-leftcol").style.zIndex = "auto";
    document.getElementById("painterTab-rightcol").style.zIndex = "auto";
    document.getElementById("combineButton").style.zIndex = "auto";
    sortPlayers();
  }
} //end combinePlayers()

//Combines players
function combineMulti(givenPlayers) {
  merging = true;
  givenPlayers.sort();
  changeSelectedPaintTo(givenPlayers[0]);
  for(var i = 0; i < boardData[currentBoard].map.length; i++) {
    var curValue = boardData[currentBoard].map[i].landType[currentYear];
    if(givenPlayers.indexOf(curValue) != -1) {
      changeLandTypeTile(i);
    }
  }
  //Delete the other (now unused) players
  givenPlayers.shift();
  for(var i = 0; i < givenPlayers.length; i++) {
    deletePlayer(givenPlayers[i]);
  }
  merging = false;
} //end combineMulti(givenPlayers)

//Gets the current timestamp for the click (event)
function getStamp() {
  curTime = new Date()
  return (curTime - startTime);
} //end getStamp

//Completes needed object property insertion
function finishProperties() {
  var tempClicks = [];
  tempClicks.push(clickTrackings[0]);
  for (var i = 1; i < clickTrackings.length; i++) {
    if (clickTrackings[i].tileID != clickTrackings[i - 1].tileID || clickTrackings[i].tileID == null || clickTrackings[i - 1].tileID == null) {
      clickTrackings[i].clickID = i;
      clickTrackings[i].timeGap = (clickTrackings[i].timeStamp - clickTrackings[i - 1].timeStamp);
      tempClicks.push(clickTrackings[i]);
    }
  }
  clickTrackings = tempClicks;
} //end finishProperties

//Handles exporting the clicks given by the user
function exportTracking() {
  //Initial action is equal to time elapsed at that point
  if (clickTrackings.length > 0) {
    clickTrackings[0].timeGap = clickTrackings[0].timeStamp;
  }
  finishProperties();
  var A = [
    ['ClickID', 'Time Stamp (Milliseconds)', 'Click Type', 'Time Gap (Milliseconds)', 'Description of click', 'TileID/Precip', startTime, endTime, startTime.getTime(), endTime.getTime()]
  ];
  for (var j = 0; j < clickTrackings.length; j++) {
    A.push([clickTrackings[j].clickID, clickTrackings[j].timeStamp, clickTrackings[j].functionType, clickTrackings[j].timeGap, clickTrackings[j].getAction(), clickTrackings[j].tileID])
  }
  var csvRows = [];
  for (var i = 0; i < A.length; i++) {
    csvRows.push(A[i].join(','));
  }
  var csvString = csvRows.join("\n");
  //Get ready to prompt for file
  var a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8;base64,' + window.btoa(csvString);
  a.target = '_blank';
  var fileID = Math.round(Math.random() * 100000000000000000000);
  a.download = 'PEWI_UserExperienceFile_' + fileID + '.csv';
  document.body.appendChild(a);
  a.click();
  clickTrackings = [];
} //end exportTracking

//Handles the simulation file
function loadSimulation(e) {
  var files;
  files = e.target.files;

  if (files[0].name && !files[0].name.match(/\.csv/)) {
    alert("Incorrect File Type!");
  } else {
    var reader = new FileReader();
    reader.readAsText(files[0]);
    //Perform the simulation
    reader.onload = function(e) {
      var sim = reader.result.split("\n");
      simulationData = sim;
      promptUserSim();
    }
  }
} //end loadSimulation

//Prompts user to begin the simulation
function promptUserSim() {
  resetPresets();
  document.getElementById('sliderCon').style.visibility = "visible";
  document.getElementById("overlayContainer").style.visibility = "visible";
  document.getElementById("overlay").style.visibility = "visible";
  document.getElementById("overlay-message").style.visibility = "visible";
  document.getElementById("overlayMessage").style.visibility = "visible";
  document.getElementById("overlay-message-2").style.visibility = "visible";
  document.getElementById("overlayMessage2").style.visibility = "visible";
} //end promptUserSim()

//Returns the value of runningSim
function isSimRunning() {
  return runningSim;
} //end isSimRunning

//Sets a new value for runningSim
function setSimBoolean(newValue) {
  runningSim = newValue;
} //end setSimBoolean

//Handles the click tracking simulation replay
function runSimulation() {
  //Begin simulation: Initial step is to clear preset variables before using them.
  runningSim = true;
  clickTrackings = [];
  elapsedTime = 0;
  pauseDuration = 0;
  document.getElementById("simSlider").style.zIndex = "1002";
  //Obtain end time for the simulation
  tempArr = simulationData[0].split(',');
  endTime = parseInt(tempArr[9]) - parseInt(tempArr[8]);
  document.getElementById("simSlider").max = endTime;
  //First, populate the clicks
  for (var i = 1; i < simulationData.length; i++) {
    tempArr = simulationData[i].split(',');
    tempID = tempArr[0];
    tempStamp = tempArr[1];
    tempType = tempArr[2];
    tempGap = tempArr[3];
    if (tempType == 55 || tempType == 56 || tempType == 34 || tempType == 35 || tempType == 36 || tempType == 37) {
      tempTile = tempArr[5];
    } else {
      tempTile = null;
    }
    pushClick(tempID, tempStamp, tempType, tempGap, tempTile);
  }
  //Beginning time of simulation
  startTime = new Date();
  //Next, perform the commands on-screen in accordance to their order and time frame
  sliderTimer = setInterval(updateTime, 1);
  for (var j = 0; j < clickTrackings.length; j++) {
    mainTimer[j] = (setTimeout(performAction, parseInt(clickTrackings[j].timeStamp), j));
  }
  //Simulation is now complete. Ask user if they would like to replay or exit to the Main Menu
  exitTimer = setTimeout(endSimPrompt, endTime);
} //end runSimulation

//Performs the actions for simulation
function performAction(clickValue) {
  clickTrackings[clickValue].getAction();
} //end performAction

//Handles the end of a simulation (or when a user pauses the sim)
function endSimPrompt() {
  paused = true;
  pauseSim();
  document.getElementById("simContainer").style.visibility = "visible";
} //end endSimPrompt()

//Pauses the sim (and related times)
function pauseSim() {
  timeStopped = new Date();
  document.getElementById("simSlider").style.zIndex = "1";
  clearTimers();
} //end pauseSim()

//Resumes the sim (and related times)
function resumeSim() {
  timeResumed = new Date()
  //Amount of time the user was paused (total for session)
  pauseDuration = pauseDuration + (timeResumed - timeStopped);
  //Amount of simulation time that has passed
  sliderTimer = setInterval(updateTime, 1);
  elapsedTime = timeResumed - startTime - pauseDuration;
  for (var j = 0; j < mainTimer.length; j++) {
    mainTimer[j] = setTimeout(performAction, parseInt(clickTrackings[j].timeStamp) - elapsedTime, j);
  }
  exitTimer = setTimeout(endSimPrompt, endTime - elapsedTime);
  document.getElementById("simSlider").style.zIndex = "1002";
} //end resumeSim()

//Sets the paused boolean
function setPause(setValue) {
  paused = setValue;
}

//Clears all relative timers
function clearTimers() {
  for (var j = 0; j < mainTimer.length; j++) {
    clearTimeout(mainTimer[j]);
  }
  clearTimeout(exitTimer);
  clearInterval(sliderTimer);
} //end clearTimers()

//Sets the slider for simulations
function resetSlider() {
  document.getElementById('simSlider').value = 0;
  document.getElementById('timer').innerHTML = "00:00:00";
}
//Provides elapsedTime for any given moment during simulation (in milliseconds) and updates the slider count and display
function updateTime() {
  cur = new Date();
  elapsedTime = cur.getTime() - startTime.getTime() - pauseDuration;
  updateSlider(elapsedTime);
} //end updateTime()

//Updates the slider's input value (duration is in milliseconds) [Note: Format is 00:00:00.0]
function updateSlider(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  document.getElementById('timer').innerHTML = hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  document.getElementById('simSlider').value = duration;
} //end updateSlider()

//Updates the current simulation after the slider has been moved
function updateSim(newTime) {
  clearTimers();
  console.log(document.getElementById('simSlider').value);
  //If the user is going back in time, refresh the board so that future changes don't yet happen
  if (elapsedTime > newTime) {
    resetPresets();
  }
  //New elapsed time (since slider has been moved by user)
  elapsedTime = newTime;
  //New start time (since slider has been moved by user)
  cur = new Date();
  var tempTime = cur.getTime() - elapsedTime;
  startTime = new Date(tempTime);
  //Since it's a new time, pausedDuration is reset
  pauseDuration = 0;
  //Update all timers
  sliderTimer = setInterval(updateTime, 1);
  for (var j = 0; j < mainTimer.length; j++) {
    mainTimer[j] = setTimeout(performAction, parseInt(clickTrackings[j].timeStamp) - elapsedTime, j);
  }
  exitTimer = setTimeout(endSimPrompt, endTime - elapsedTime);
} //end updateSim()

//Resets presets that are present in the level when you exit/refresh the simulation
function resetPresets() {
  //Clears the board and sets all tiles back to convetional corn (or the custom map if used)
  if (uploadedBoard) {
    setupBoardFromUpload(simUpload);
    //clear initData
    initData = [];
  } else {
    loadLevel(0);
  }
  //Goes back to the land-type selection
  switchConsoleTab(1);
  //Goes back to the default land-use selection
  changeSelectedPaintTo(1);
  //Goes back to single-selection painter
  painterSelect(1);
  //Resets the year selections
  resetYearDisplay();
  document.getElementById("year1Image").className = "icon yearSelected"
  currentYear = 1;
  //Resets the scroll in the results tab
  window.frames[3].scrollTo(0, 0);
  //Resets the scroll in the credits tab
  window.frames[0].scrollTo(0, 0);
  //Closes the results tab (if it was open)
  resultsEnd();
  //Closes the credits tab (if it was open)
  closeCreditFrame();
  //Closes the upload/download tab (if it was open)
  closeUploadDownloadFrame();
  //Rolls out the left console
  if (document.getElementById('tabButtons').className != "tabButtons") {
    roll(1);
  }
} //end resetPresets()

//Sets the simUpload boolean value
function setUpload(givenValue) {
  uploadedBoard = givenValue;
} //end setUpload()
