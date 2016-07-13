var currentRow = -1;
var openBack;
/* global camera, scene, boardData,
          renderer, currentBoard, THREE, 
          currentYear, textureArray, riverPoints,
          mouse, raycaster,
          isShiftDown, modalUp, precip, 
          painter, Totals, river,
          Results, initData, hoveredOver*/
var meshGeometry = new THREE.Geometry();
var meshMaterials = [];
var previousHover = null;
var tileHeight = 12;
var tileWidth = 18;
var rowCutOffs = []; //y coor of top left corner of each tile
var columnCutOffs = [];
var mesh = null;
var isShiftDown = false;
var tToggle = true;
var mapIsHighlighted = false;
var hoverOverride = false;
var currentHighlightType = 0;
var immutablePrecip = false; 

var painterTool = {
    status: 0,
    startTile: 0,
    endTile: 0,
    hover: false
} ;

//onResize dynamically adjusts to window size changes
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
} //end onResize

//displayBoard initializes a board with graphics using addTile()
function displayBoard() {

    riverPoints = [];

    //loop through all tiles and addTile to the meshGeometry and meshMaterials objects
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
        addTile(boardData[currentBoard].map[i]);
    }

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
function highlightTile(id) {


    //if a previous tile was selected for highlighting, unhighlight that tile
    if (previousHover != null) {
        meshMaterials[previousHover].emissive.setHex(0x000000);
    }

    //highlight the new tile 
    //if not a tile
    if (id != -1 && meshMaterials[id].emissive) {

        meshMaterials[id].emissive.setHex(0x7f7f7f);
        previousHover = id;

        //document.getElementById("currentInfo").innerHTML = "Year: " + currentYear + "   Selected Land Type: " + LandUseType.getType(painter) + "   Higlighted Tile: " + LandUseType.getType(boardData[currentBoard].map[id].landType[currentYear]) + " " + boardData[currentBoard].map[id].row + ", " + boardData[currentBoard].map[id].column;
        showInfo(boardData[currentBoard].map[id].row + ", " + boardData[currentBoard].map[id].column) ;
    } else if(id != -1 && meshMaterials[id].emissive){
        showInfo(boardData[currentBoard].map[id].row + ", " + boardData[currentBoard].map[id].column) ;
    }
    else {
        //don't delete info in an html element, else clear
        var line = document.getElementById('currentInfo').innerHTML ;
        if(!isNaN(line[0])) clearInfo() ;
    }



}

//changeLandTypeTile changes the landType of a selected tile
function changeLandTypeTile(id) {

    //change the materials of the faces in the meshMaterials array and update the boardData
    meshMaterials[id].map = textureArray[painter];
    boardData[currentBoard].map[id].landType[currentYear] = painter;
    boardData[currentBoard].map[id].update(currentYear);

}

function getTileID(x, y) {

    //x and y in terms of three.js 3d coordinates, not screen coordinates

    var tilesWide = boardData[currentBoard].width;
    var tilesHigh = boardData[currentBoard].height;

    //calculate which column the tile is in
    var col = 0;

    if (x < columnCutOffs[0] || x > columnCutOffs[columnCutOffs.length - 1]) {
        col = 0;
    }
    else {
        while (x > columnCutOffs[col]) {
            col += 1;
        }
    }

    //calculate which row the tile is in
    var row = 0;

    if (y > rowCutOffs[0] || y < rowCutOffs[rowCutOffs.length - 1]) {
        row = 0;
    }
    else {
        while (y < rowCutOffs[row]) {
            row += 1;
        }
    }

    if (col == 0 || row == 0) {
        return -1;
    }

   return (getTileIDFromRC(row, col) - 1);

}

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

}

function getTileIDFromRC(row, col){
     var tilesWide = boardData[currentBoard].width;
     return Number( ((row - 1) * tilesWide) + col ) ;
}

//returns an array of tiles in the rectangle bounded by startTile and endTile
function getGrid(startTile, endTile) {
    
    var tileArray = [] ;
    
    var startCol = Number(boardData[currentBoard].map[startTile].column) ;
    var endCol = Number(boardData[currentBoard].map[endTile].column) ;
    var startRow = Number(boardData[currentBoard].map[startTile].row) ;
    var endRow = Number(boardData[currentBoard].map[endTile].row) ;
    
    if(endCol < startCol) {
        var temp = endCol ;
        endCol = startCol ;
        startCol = temp ;
    }
    
    
    if(endRow < startRow) {
        var temp = endRow ;
        endRow = startRow ;
        startRow = temp ;
    }
    
    //for each row
    for(var row=startRow ; row <= endRow ; row++){
        //for applicable columns in the row
        for(var col=startCol; col <= endCol ; col++){
            var id = getTileIDFromRC(row,col) ;
            if (boardData[currentBoard].map[id - 1].landType[0] != 0 ){
                tileArray.push(id) ;
            }
        }
    }
    //console.log(tileArray) ;
    return tileArray ;
}

function getGridOutline(startTile, endTile) {
    
    var tileArray = [] ;
    
    var startCol = Number(boardData[currentBoard].map[startTile].column) ;
    var endCol = Number(boardData[currentBoard].map[endTile].column) ;
    var startRow = Number(boardData[currentBoard].map[startTile].row) ;
    var endRow = Number(boardData[currentBoard].map[endTile].row) ;
    
    tileArray.push(getTileIDFromRC(startRow,startCol)) ;
    tileArray.push(getTileIDFromRC(endRow,endCol)) ;
    
    var temp = getTileIDFromRC(startRow,endCol);
    if(temp != -1 ) tileArray.push(temp) ;
    temp = getTileIDFromRC(endRow, startCol) ;
    if(temp != -1 ) tileArray.push(temp) ;
    
    //check for bad tiles
    var goodTiles = [] ;
    for(var i=0; i < tileArray.length; i++){
        if(boardData[currentBoard].map[tileArray[i] - 1].landType[0] != 0 ) goodTiles.push(tileArray[i]);
    }
    tileArray = goodTiles ;
    
    return tileArray ;
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

    //Calculate the heights of vertices by averaging topographies of adjacent tiles and create a vector for each corner
    if (tToggle) {
        v1 = new THREE.Vector3(0, (topN24 + topN23 + topN1 + tile.topography) / 4 * 5, 0);
        v2 = new THREE.Vector3(tileWidth, (topN23 + topN22 + top1 + tile.topography) / 4 * 5, 0);
        v3 = new THREE.Vector3(tileWidth, (top24 + top23 + top1 + tile.topography) / 4 * 5, tileHeight);
        v4 = new THREE.Vector3(0, (top22 + top23 + topN1 + tile.topography) / 4 * 5, tileHeight);
    }
    else {
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


    if (tile.landType[currentYear] == 0) {
        tileMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.0
        });
        meshMaterials.push(tileMaterial);
    }
    else {
        tileMaterial = new THREE.MeshLambertMaterial({
            map: textureArray[tile.landType[currentYear]],
            side: THREE.DoubleSide
        });
        meshMaterials.push(tileMaterial);
    }

    //if this tile is the first in its row that is a streamNetwork tile add it to the riverPoints array
    if (tile.riverStreams != 0) {
        var streams = tile.riverStreams.split("*");
        for(var i = 0; i < streams.length; i++){
            if(!riverPoints[Number(streams[i]) - 1]){
                riverPoints[Number(streams[i]) - 1] = [];
            }
            riverPoints[Number(streams[i]) - 1].push(new THREE.Vector3(tile.column * tileWidth - (tileWidth * tilesWide) / 2 + tileWidth/2, 1, tile.row * tileHeight - (tileHeight * tilesHigh) / 2 + tileHeight));
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
function refreshBoard() {

    if (mesh != null) {
        scene.remove(mesh);
    }

    meshGeometry = new THREE.Geometry();
    meshMaterials = [];
    
    mapIsHighlighted = false;
    showLevelDetails(-1 * currentHighlightType);
    currentHighlightType = 0;

    displayBoard();

} //end refreshBoard

//transitionToYear updates the graphics for a board to "year" input
function transitionToYear(year) {

    currentYear = year;

    if (year > boardData[currentBoard].calculatedToYear) {
        boardData[currentBoard].calculatedToYear = year;
        boardData[currentBoard].updateBoard();
    }
    
    refreshBoard();

} //end transitionToYear

var highlightedTiles = [] ;

//onDocumentMouseMove follows the cursor and highlights corresponding tiles
function onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length < 1) {

        //if there's no intersection, then turn off the gridHighlighting
        if (painterTool.status == 2) {
            for (var i = 0; i < highlightedTiles.length; i++) {
                meshMaterials[highlightedTiles[i] - 1].emissive.setHex(0x000000);
            }
        }
            
        //else, unhighlight previous
        highlightTile(-1);
    }

    if (intersects.length > 0 && !modalUp) {

        if (painterTool.status == 2) {
            //highlight a grid
            var currentTile = getTileID(intersects[0].point.x, -intersects[0].point.z);
            var tilesToHighlight = getGridOutline(painterTool.startTile, currentTile);

            //clear Previous highlighting
            for (var i = 0; i < highlightedTiles.length; i++) {
                meshMaterials[highlightedTiles[i] - 1].emissive.setHex(0x000000);
            }

            if (currentTile && boardData[currentBoard].map[currentTile].landType[0] != 0) {

                for (var i = 0; i < tilesToHighlight.length; i++) {
                    highlightTile(tilesToHighlight[i] - 1);
                    //prevent highlighting from overwritting...
                    previousHover = null;
                }

                highlightedTiles = tilesToHighlight;
            }

        }
        else if(painterTool.status == 3){
            var currentTile = getTileID(intersects[0].point.x, -intersects[0].point.z) ;
            if(boardData[currentBoard].map[currentTile].landType[0] != 0)  changeLandTypeTile(currentTile) ;
        }
        else {
            //just a normal highlighting
            highlightTile(getTileID(intersects[0].point.x, -intersects[0].point.z));
        }

    }
} //end onDocumentMouseMove

//onDocumentDoubleClick changes landType to the painted (selected) landType on double-click
//and will change map to a monoculture if shift is held down
function onDocumentMouseDown(event) {

    event.preventDefault();

    mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children);

    if(event.which == 1 && intersects.length > 0){

        if (!isShiftDown) {
    
            if (!mapIsHighlighted && !modalUp && !painterTool.hover ) {
     
                if (painterTool.status > 0) {
    
                    //take care of grid painting
                    if (painterTool.status == 1) {
                        //start grid painting option
    
                        painterTool.status = 2;
                        painterTool.startTile = getTileID(intersects[0].point.x, -intersects[0].point.z);
                    }
                    else if (painterTool.status == 2) {
                        //end painterTool.status function if
                        var currentTile = getTileID(intersects[0].point.x, -intersects[0].point.z);
    
                        if (boardData[currentBoard].map[currentTile].landType[0] != 0) {
                            //then paint since it's an actual tile
                            painterTool.endTile = currentTile;
                            var changedTiles = getGrid(painterTool.startTile, painterTool.endTile);
    
                            for (var i = 0; i < changedTiles.length; i++) {
                                changeLandTypeTile(changedTiles[i] - 1);
                            }
                            
                            //reset highlighting
                            refreshBoard();
    
                            //reset painterTooling status
                            painterTool.status = 1;
    
                        }
                    }
                }
                else {
                    //just a normal tile change
                    changeLandTypeTile(getTileID(intersects[0].point.x, -intersects[0].point.z));
    
                }
    
            }
    
        }
        else {
    
            for (var i = 0; i < boardData[currentBoard].map.length; i++) {
    
                if (boardData[currentBoard].map[i].landType[currentYear] != 0) {
    
                    changeLandTypeTile(i);
    
                }
    
            }
    
        }
        
    }

} //end onDocumentMouseDown(event)

//onDocumentKeyDown listens for the shift key held down
function onDocumentKeyDown(event) {

    switch (event.keyCode) {
        case 16:
            isShiftDown = true;
            break;
        //case t
        case 84:
            if(modalUp != true && mapIsHighlighted != true){
                tToggle ? tToggle = false : tToggle = true;
                refreshBoard();
            }
            break;
        //case i
        case 73:
            toggleIndex();
            break ;
        //case e
        case 69:
            controls.reset();
            break;
        //case r
        case 82:
            if(modalUp != true && mapIsHighlighted != true){
                randomizeBoard() ;
            }
            break;
        case 67:
            console.log(camera.position) ;
            console.log(camera.rotation) ;
            console.log("-------------") ;
            break;
        //case b
        case 66:
            if(document.getElementById("popup").className == "popupHidden"){
                document.getElementById("popup").className = "popup";
            } else {
                document.getElementById("popup").className = "popupHidden";
            }
            break;
        //case p
        case 80:
            if(painterTool.hover && painterTool.status != 3) {
                painterTool.status = 3 ;
                highlightTile(-1);
            }
            break;
        //case f
        case 70:
            launchFireworks();
            break;

    }

} //end onDocumentKeyDown

//onDocumentKeyUp listens for the shift key released
function onDocumentKeyUp(event) {

    switch (event.keyCode) {
        case 0:
            isShiftDown = false;
            break;
        case 16:
            isShiftDown = false;
            break;
        //case p
        case 80:
          if(painterTool.status == 3 ) painterTool.status = 0
          break;
        case 27:
            if(document.getElementById('startupSequence').style.display == "none"){
                showMainMenu() ;
            }
    }

} //end onDocumentKeyUp

//paintChange changes the highlighted color of the selected painter and updates painter
function paintChange(value) {

    //change current painter to regular
    var string = "paint" + painter;
    document.getElementById(string).className = "landSelectorIcon";

    //change new paiter to current
    string = "paint" + value;
    document.getElementById(string).className = "landSelectedIcon";
    painter = value;

} //end paintChange

//paintYear changes the year that is selected and highlighted
function paintYear(value) {

    var string = onYear + "Image";
    document.getElementById(string).className = "yearImage";

    string = value + "Image";
    document.getElementById(string).className = "yearSelectedImage";
    onYear = value;

} //end paintYear

//resultsStart begins results calculations and calls functions that display the results
function resultsStart() {

    //if something else has precedence
    if(!modalUp){
    
    //setup Screen Appropriately
    modalUp = true;
    document.getElementById("resultsButton").onmouseout = "";
    document.getElementById("resultsButton").onmouseover = "";
    document.getElementById("resultsButton").onclick = function() {
        resultsEnd();
    };

    document.getElementById("toolsButton").onclick = "";

    document.getElementById("resultsButton").className = "resultsButtonFar";

    openBack = false ;
    if (document.getElementById("leftConsole").className == "leftConsole") {
        openBack = true ;
        roll(1) ;
    }

    document.getElementById("closeResults").style.right = "16%";

    //functions that update results and display them appropriately
    calculateResults();
    displayResults();
    animateResults();
    }
    
} //end resultsStart

//resultsEnd hides the results and returns the menus to the screens
function resultsEnd() {
    //reset functionality
    document.getElementById("resultsFrame").className = "resultsFrameRolled";
    document.getElementById("resultsButton").className = "resultsButtonRolled";
    document.getElementById("closeResults").style.right = "-75%";

    if (openBack) {
        roll(1) ;
    }
    
    document.getElementById("resultsButton").onmouseout = function() {
        document.getElementById("resultsButton").className = "resultsButtonRolled";
    };
    document.getElementById("resultsButton").onmouseover = function() {
        roll(2);
    };
    document.getElementById("toolsButton").onclick = function() {
        roll(1);
    };
    document.getElementById("resultsButton").onclick = function() {
        resultsStart();
    };
    modalUp = false;

} //end resultsEnd

//roll controls the display of the toolbars on the left
function roll(value) {
    if (value == 1) {

        if (document.getElementById('tabButtons').className == "tabButtons") {

            document.getElementById('toolsButton').style.left = "0px";
            document.getElementById('toolsButton').style.backgroundImage = "url('./imgs/consoleTexture.png')";
            document.getElementById('pick').src = "./imgs/pickIn.png"

            document.getElementById('tabButtons').className = "tabButtonsRolled";
            document.getElementById('leftConsole').className = "leftConsoleRolled";

       
        }
        else {

            document.getElementById('toolsButton').style.left = "135px";
            document.getElementById('toolsButton').style.backgroundImage = "none";
            document.getElementById('pick').src = "./imgs/pickOut.png"

            document.getElementById('tabButtons').className = "tabButtons";
            document.getElementById('leftConsole').className = "leftConsole";

        }

    } //left tollbox

    if (value == 2) {

        if (document.getElementById("resultsButton").className == "resultsButton") {
            document.getElementById("resultsButton").className = "resultsButtonRolled";
        }
        else if (document.getElementById("resultsButton").className == "resultsButtonRolled") {
            document.getElementById("resultsButton").className = "resultsButton";
        }


    } //right results button


} //roll

//showLevelDetails shows the legend for each of the highlight map functions
function showLevelDetails(value) {

    if (value == 1) {
        document.getElementById("nitrateDetailsList").className = "levelDetailsList";
        document.getElementById('nitrateIcon').className = "levelSelectorIconSelected" ;
    }

    if (value == 2) {
        document.getElementById("erosionDetailsList").className = "levelDetailsList";
        document.getElementById('erosionIcon').className = "levelSelectorIconSelected" ;
    }

    if (value == 3) {
        document.getElementById("phosphorusDetailsList").className = "levelDetailsList";
        document.getElementById('phoshorusIcon').className = "levelSelectorIconSelected" ;
    }

    if (value == 4) {
        document.getElementById('floodFrequency').className = "featureSelectorIconSelected" ;
        document.getElementById("floodFrequencyDetailsList").className = "physicalDetailsList";
    }

    if (value == 5) {
        document.getElementById('drainageClass').className = "featureSelectorIconSelected" ;
        document.getElementById("drainageClassDetailsList").className = "physicalDetailsList";
    }
    
    if (value == 6) {
        document.getElementById('strategicWetlands').className = "featureSelectorIconSelected" ;
        document.getElementById("wetlandClassDetailsList").className = "physicalDetailsList";
    }

    if (value == 7) {
        document.getElementById('subwatershedBoundaries').className = "featureSelectorIconSelected" ;
        document.getElementById("subwatershedClassDetailsList").className = "physicalDetailsList";
    }
    
    if (value > -4 && value < 0) {
        var element = document.getElementsByClassName('levelDetailsList');
        element[0].className = 'levelDetailsListRolled';
    }

    if (value < -3) {
        var element = document.getElementsByClassName('physicalDetailsList');
        element[0].className = 'physicalDetailsListRolled';
    }

} //showLevelDetails

//updatePrecip updates the currentBoard with the precipitation values selected in the drop down boxes
function updatePrecip(year) {

    if (year == 0) {
        boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year0Precip").value)];
    }
    if (year == 1) {
        boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year1Precip").value)];
    }
    if (year == 2) {
        boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year2Precip").value)];
    }
    if (year == 3) {
        boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year3Precip").value)];
    }

    boardData[currentBoard].updateBoard();

} //updatePrecip

//switchConsoleTab updates the currently selected toolbar on the left
function switchConsoleTab(value) {

    var element = document.getElementsByClassName("imgSelected");
    element[0].className = "imgNotSelected";

    var elements = document.getElementsByClassName("consoleTab");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }

    if (value == 1) {

        document.getElementById('terrainImg').className = "imgSelected";
        document.getElementById('painterTab').style.display = "block";
    }
    else if (value == 2) {

        document.getElementById('precipImg').className = "imgSelected";
        document.getElementById('precipTab').style.display = "block";
    }
    else if (value == 3) {
        
        document.getElementById('levelsImg').className = "imgSelected";
        document.getElementById('levelsTab').style.display = "block";
        
    }
    else if (value == 4) {

        document.getElementById('featuresImg').className = "imgSelected";
        document.getElementById('featuresTab').style.display = "block";
        
    }
    else if (value == 5) {
        
        document.getElementById('settingsImg').className = "imgSelected";
        document.getElementById('settingsTab').style.display = "block";
    }
    
    if(mapIsHighlighted){
        displayLevels();
    }

} //end switchConsoleTab

//switchYearTab changes the highlighted year
function switchYearTab(value) {

    var elements = document.getElementsByClassName("yearSelected");

    for (var i = 0; i < elements.length; i++) {
        elements[i].className = "yearNotSelected";
    }

    switch (value) {
        case 1:
            document.getElementById('year1Image').className = "yearSelected";
            break;
        case 2:
            document.getElementById('year2Image').className = "yearSelected";
            break;
        case 3:
            document.getElementById('year3Image').className = "yearSelected";
            break;
    };


} //end switchYearTab

//displayLevels highlight each tile using getHighlightColor method
function displayLevels(type) {
    
        if(!mapIsHighlighted){
            
            mapIsHighlighted = true;
            
            Totals = new Results(boardData[currentBoard]);
            Totals.update();
    
            for (var i = 0; i < boardData[currentBoard].map.length; i++) {
    
                if (boardData[currentBoard].map[i].landType[currentYear] != 0) {
    
                    meshMaterials[i].map = highlightArray[getHighlightColor(type, i)];
    
                }
    
            }
            
            var element = document.getElementsByClassName('featureSelectorIconSelected') ;
            if(element[0]) element[0].className = 'featureSelectorIcon' ;
            element = document.getElementsByClassName('levelSelectorIconSelected') ;
            if(element[0]) element[0].className = 'levelsSelectorIcon' ;
            
            switch(type){
                case 'nitrate':
                    showLevelDetails(1);
                    currentHighlightType = 1;
                    break;
                case 'erosion':
                    showLevelDetails(2);
                    currentHighlightType = 2;
                    break;
                case 'phosphorus':
                    showLevelDetails(3);
                    currentHighlightType = 3;
                    break;
                case 'flood':
                    showLevelDetails(4);
                    currentHighlightType = 4;
                    break;
                case 'drainage':
                    showLevelDetails(5);
                    currentHighlightType = 5;
                    break;
                case 'wetland':
                    showLevelDetails(6);
                    currentHighlightType = 6;
                    break;
                case 'subwatershed':
                    showLevelDetails(7);
                    currentHighlightType = 7;
                    break;
            }
            
        } else {
            
            var newSelection = 0;
            
            var element = document.getElementsByClassName('featureSelectorIconSelected') ;
            if(element[0]) element[0].className = 'featureSelectorIcon' ;
            element = document.getElementsByClassName('levelSelectorIconSelected') ;
            if(element[0]) element[0].className = 'levelsSelectorIcon' ;
            
            switch(type){
                case 'nitrate':
                    newSelection = 1;
                    break;
                case 'erosion':
                    newSelection = 2;
                    break;
                case 'phosphorus':
                    newSelection = 3;
                    break;
                case 'flood':
                    newSelection = 4;
                    break;
                case 'drainage':
                    newSelection = 5;
                    break;
                case 'wetland':
                    newSelection = 6;
                    break;
                case 'subwatershed':
                    newSelection = 7;
                    break;
            }
            
            if(currentHighlightType == newSelection || newSelection == 0){
                
                mapIsHighlighted = false; 
                refreshBoard();
                showLevelDetails(-1 * currentHighlightType);
                currentHighlightType = 0;
                
            } else {
                
                mapIsHighlighted = true;
                
                showLevelDetails(-1 * currentHighlightType);
                
                Totals = new Results(boardData[currentBoard]);
                Totals.update();
    
                for (var i = 0; i < boardData[currentBoard].map.length; i++) {
    
                    if (boardData[currentBoard].map[i].landType[currentYear] != 0) {
    
                        meshMaterials[i].map = highlightArray[getHighlightColor(type, i)];
    
                    }
    
                }
                
                showLevelDetails(newSelection);
                currentHighlightType = newSelection;
                
            }
            
            
        }

} //end displayLevels

//getHighlightColor determines the gradient of highlighting color for each tile dependent on type of map selected
function getHighlightColor(type, ID) {

    if (type == "erosion") {

        var erosionSeverity = Totals.grossErosionSeverity[currentYear][ID];

        //console.log(erosionSeverity);

        switch (erosionSeverity) {
            case 1:
                return 0;
            case 2:
                return 1;
            case 3:
                return 2;
            case 4:
                return 3;
            case 5:
                return 4;
        }

    }

    if (type == "nitrate") {

        var nitrateConcentration = Totals.nitrateContribution[currentYear][ID];

        if (nitrateConcentration >= 0 && nitrateConcentration <= 0.05) return 0;
        else if (nitrateConcentration > 0.05 && nitrateConcentration <= 0.1) return 1;
        else if (nitrateConcentration > 0.1 && nitrateConcentration <= 0.2) return 2;
        else if (nitrateConcentration > 0.2 && nitrateConcentration <= 0.25) return 3;
        else if (nitrateConcentration > 0.25) return 4;

    }

    if (type == "phosphorus") {

        var phosphorusRisk = Totals.phosphorusRiskAssessment[currentYear][ID];

        switch (phosphorusRisk) {
            case 1:
                return 0;
            case 2:
                return 1;
            case 3:
                return 2;
            case 4:
                return 3;
            case 5:
                return 4;
        }

    }

    if (type == "flood") {

        var flood = Number(boardData[currentBoard].map[ID].floodFrequency);

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
        }
    }

    if (type == "wetland") {

        if (boardData[currentBoard].map[ID].strategicWetland == 1) {
            return 9;
        }
        else {
            return 5;
        }
    }

    if (type == "subwatershed") {

        var watershed = Number(boardData[currentBoard].map[ID].subwatershed);

        switch (watershed) {
            case 1:
                return 10;
            case 2:
                return 11;
            case 3:
                return 12;
            case 4:
                return 13;
            case 5:
                return 14;
            case 6:
                return 15;
            case 7:
                return 16;
            case 8:
                return 17;
            case 9:
                return 18;
            case 10:
                return 19;
            case 11:
                return 20;
            case 12:
                return 21;
            case 13:
                return 22;
            case 14:
                return 23;
            case 15:
                return 24;
            case 16:
                return 25;
            case 17:
                return 26;
            case 18:
                return 27;
            case 19:
                return 28;
            case 20:
                return 29;
            case 21:
                return 30;
        }
    }

    if (type == "drainage") {

        var drainage = Number(boardData[currentBoard].map[ID].drainageClass);

        switch (drainage) {
            case 70:
                return 31;
            case 60:
                return 32;
            case 50:
                return 33;
            case 45:
                return 34;
            case 40:
                return 35;
            case 30:
                return 36;
            case 10:
                return 37;
            case 0:
                return 38;
        }
    }

} //end getHighlightColor

//contaminatedRiver changes the color of the river dependent on current phosphorus level
function contaminatedRiver() {

    //this is buggy -- still a work-in progress. Maybe the status of the river should be stored in the board for each year...

    if (Totals.phosphorusLoad[currentYear] > 1.7) {
        for(var i = 0; i < river.children.length; i++){
           river.children[i].material.color.setHex("0x663300");
       }
    }
    else {
        for(var i = 0; i < river.children.length; i++){
            river.children[i].material.color.setHex("0x40a4df");
        }
    }
    

} //end contaminatedRiver

//achievementCheck
function achievementCheck(){
 
 var allDone = "none";
 //check the current scores of each achievement
 for(var i = 0; i < achievementValues.length; i++){
     
    //determine the script to print
     
    //print the initial script when the totals are less than any achievement
    if(Totals[achievementValues[i][0]][yearToCheck] <= Number(achievementValues[i][1])){
             if(achievementDisplayed < 0){
                updatePopup(achievementScripts[i][0]);
                achievementDisplayed = 1;
             }
             allDone = false;
    //determine if a final value has been surpassed for each achievement
    } else if(Totals[achievementValues[i][0]][yearToCheck] > Number(achievementValues[i][achievementValues[i].length-1])){
             if(allDone == "none" || allDone == true){
                allDone = true;
             }
    //print scripts for subobjective achievements
    } else {
        if(achievementValues[i].length > 2){
            
            for(var j = 1; j < achievementValues[i].length; j++){
         
                if(Totals[achievementValues[i][0]][yearToCheck] > Number(achievementValues[i][j]) && Totals[achievementValues[i][0]][yearToCheck] <= Number(achievementValues[i][j+1])) {
                    if( achievementDisplayed < j+1){
                        updatePopup(achievementScripts[i][j]);
                        achievementDisplayed = j+1;
                        flyLark();
                    }
                    allDone = false;
                }
         
            }
     
        }
    
    }

 }
 
 //if all achievements have been completed, the level is complete
 if(allDone == true){
    if(achievementDisplayed < achievementValues[0].length){
        updatePopup(achievementScripts[0][achievementScripts[0].length-1]);
        achievementDisplayed = achievementValues[0].length;
        launchFireworks();
    }
 }

}

function launchFireworks(){
    var r=10+parseInt(Math.random()*10);
    for(var i=r; i--;){
        setTimeout( function(){ 
            displayFirework(); 
        }, (i+1)*(1+parseInt(Math.random()*100)));
    }
}

function displayFirework(){
    createFirework(11,61,6,2,null,null,null,null,false,true); 
    return 1;
}

function flyLark(){
    if(document.getElementById("meadowlark").className == "meadowlarkfly"){
        document.getElementById("meadowlark").className = "meadowlarkhidden";
    }
    document.getElementById("meadowlark").className = "meadowlarkfly";
}

//writeFileToDownloadString creates a string in csv format that describes the current board
function writeFileToDownloadString() {

    var string = "";

    string = string + "ID,Row,Column,Area,BaseLandUseType,CarbonMax,CarbonMin,Cattle,CornYield,DrainageClass,Erosion,FloodFrequency,Group,NitratesPPM,PIndex,Sediment,SoilType,SoybeanYield,StreamNetwork,Subwatershed,Timber,Topography,WatershedNitrogenContribution,StrategicWetland,LandTypeYear1,LandTypeYear2,LandTypeYear3,PrecipYear0,PrecipYear1,PrecipYear2,PrecipYear3" + "\n";

    for (var i = 0; i < boardData[currentBoard].map.length; i++) {

        string = string + boardData[currentBoard].map[i].id + "," +
            boardData[currentBoard].map[i].row + "," +
            boardData[currentBoard].map[i].column + "," +
            boardData[currentBoard].map[i].area + "," +
            boardData[currentBoard].map[i].baseLandUseType + "," +
            boardData[currentBoard].map[i].carbonMax + "," +
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
            boardData[currentBoard].map[i].landType[1] + "," +
            boardData[currentBoard].map[i].landType[2] + "," +
            boardData[currentBoard].map[i].landType[3] + "," +
            boardData[currentBoard].precipitation[0] + "," +
            boardData[currentBoard].precipitation[1] + "," +
            boardData[currentBoard].precipitation[2] + "," +
            boardData[currentBoard].precipitation[3];

        if (i < boardData[currentBoard].map.length - 1) {
            string = string + '\r\n';
        }
        else {
            //Do Nothing
        }

    }

    return string;
} //end writeFileToDownloadString

//downloadClicked enables the user to download the currentBoard as a csv file
function downloadClicked() {

    var data = writeFileToDownloadString();
    var fileName = "pewiMap";
    var uri = 'data:text/csv;charset=UTF-8,' + escape(data);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeUploadDownloadFrame();

} // end downloadClicked

//uploadClicked enables the user to upload a .csv of board data
function uploadClicked(e) {

    var files;
    files = e.target.files;

    if (files[0].name && !files[0].name.match(/\.csv/)) {
        alert("Incorrect File Type!");
    }
    else {
        var reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = function(e) {
            setupBoardFromUpload(reader.result);
            //clear initData
            initData = [];
        }
    } //end else

    closeUploadDownloadFrame();

    //reset keylistening frame (ie give up focus on iframe)
    document.activeElement.blur();
    

} //end uploadClicked


//animateResults
function animateResults() {

    //todo, increased functionality
    document.getElementById("resultsFrame").className = "resultsFrame";

} //end animateResults

//calculateResults triggers the results calculations by updating Totals
function calculateResults() {

    //Totals = new Results(boardData[currentBoard]);
    Totals.update();

    //contaminatedRiver(Totals);

} //end calculateResults

//displayResults writes the html for the results iframe with updates results from Totals
function displayResults() {

    toMetricFactorArea = 2.471;
    var upToYear = boardData[currentBoard].calculatedToYear;

    //document.getElementById('resultsFrame').contentWindow.document.getElementById('contents').innerHTML = "WORKS";
    var nameArray = ["Conventional Corn Area", "Conservation Corn Area", "Conventional Soybean Area", "Conservation Soybean Area",
        "Mixed Fruits and Vegetables Area", "Permanent Pasture Area", "Rotational Grazing Area", "Grass Hay Area",
        "Switchgrass Area", "Prairie Area", "Wetland Area", "Alfalfa Area", "Conventional Forest Area",
        "Conservation Forest Area", "Short Rotation Woody Bioenergy Area"
    ];
    var testArray = ["conventionalCorn", "conservationCorn", "conventionalSoybean",
        "conservationSoybean", "mixedFruitsVegetables", "permanentPasture", "rotationalGrazing", "grassHay",
        "switchgrass", "prairie", "wetland", "alfalfa", "conventionalForest",
        "conservationForest", "shortRotationWoodyBioenergy"
    ];

    var string2 = "";

    string2 += "<table class='resultsTable'>";

    //add header row

    string2 += "<tr class='tableHeading'> <th> Land Use Category </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Percentage</th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Units (Metric) </th>";

    string2 += "</tr>";

    for (var l = 0; l < testArray.length; l++) {


        switch (l) {
            case 0:
                string2 += "<tr class='tableHeading'><td><b>Annual Grain</b></td></tr>";
                break;
            case 2:
                string2 += "<tr class='tableHeading'><td><b>Annual Legume</b></td></tr>";
                break;
            case 4:
                string2 += "<tr class='tableHeading'><td><b>Mixed Fruits and Vegetables</b></td></tr>";
                break;
            case 5:
                string2 += "<tr class='tableHeading'><td><b>Pasture</b></td></tr>";
                break;
            case 7:
                string2 += "<tr class='tableHeading'><td><b>Perrenial Herbaceous (non-pasture)</b></td></tr>";
                break;
            case 11:
                string2 += "<tr class='tableHeading'><td><b>Perrenial Legume</b></td></tr>";
                break;
            case 12:
                string2 += "<tr class='tableHeading'><td><b>Perrenial Wooded</b></td></tr>";
                break;

        } //end switch

        string2 += "<tr>";

        string2 += "<td>" + nameArray[l] + "</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "LandUse";
            string2 += (Math.round(Totals.landUseResults[y][tempString] / Totals.totalArea * 100 * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        string2 += "<td>percent</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "LandUse";
            string2 += (Math.round(Totals.landUseResults[y][tempString] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        string2 += "<td>acres</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "LandUse";
            string2 += (Math.round(Totals.landUseResults[y][tempString] / toMetricFactorArea * 10) / 10) + "<br>";

            string2 += "</td>";

        } //for each year
        string2 += "<td>hectares</td></tr>";


    }

    string2 += "</table><br><br><br><br>";


    //===================================================
    //update second table


    nameArray = ["Game Wildlife", "Biodiversity", "Carbon Sequestration", "Erosion Control / Gross Erosion",
        "Nitrate Pollution Control <br> / In-Stream Concentration", "Phosphorus Pollution Control <br> / In-Stream Loading",
        "Sediment Control <br> / In-Stream Delivery"
    ];
    testArray = ["gameWildlifePoints", "biodiversityPoints", "carbonSequestration", "grossErosion", "nitrateConcentration",
        "phosphorusLoad", "sedimentDelivery"
    ];
    conversionArray = [1, 1, 0.90718474, 0.90718474, 1, 1, 0.90718474, 0.90718474];

    string2 += "<table class='resultsTable'>";

    //add header row

    string2 += "<tr class='tableHeading'> <th> Ecosystem Service Indicator <br> / Measurement </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Score</th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Units (Metric) </th>";

    string2 += "</tr>";


    for (var l = 0; l < testArray.length; l++) {


        switch (l) {
            case 0:
                string2 += "<tr class='tableHeading'><td><b>Habitat</b></td></tr>";
                break;
            case 2:
                string2 += "<tr class='tableHeading'><td><b>Soil Quality</b></td></tr>";
                break;
            case 4:
                string2 += "<tr class='tableHeading'><td><b>Water Quality</b></td></tr>";
                break;
        } //end switch

        string2 += "<tr>";

        string2 += "<td>" + nameArray[l] + "</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "Score";
            string2 += (Math.round(Totals[tempString][y] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        string2 += "<td>(out of 100)</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l];
            string2 += (Math.round(Totals[tempString][y] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        if (l < 2) string2 += "<td>pts</td>";
        if (2 <= l && l < 4) string2 += "<td>tons</td>";
        if (4 <= l && l < 5) string2 += "<td>ppm</td>";
        if (5 <= l && l < 8) string2 += "<td>tons</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l];
            string2 += (Math.round(Totals[tempString][y] * conversionArray[l] * 10) / 10) + "<br>";

            string2 += "</td>";

        } //for each year

        if (l < 2) string2 += "<td>pts</td>";
        if (2 <= l && l < 4) string2 += "<td>Mg</td>";
        if (4 <= l && l < 5) string2 += "<td>mg/L</td>";
        if (5 <= l && l < 8) string2 += "<td>Mg</td>";
    }


    //Finally, add the yeild results to the table...

    nameArray = ["Corn Grain", "Soybeans", "Mixed Fruits and Vegetables", "Cattle", "Alfalfa Hay", "Grass Hay",
        "Switchgrass Biomass", "Wood", "Short Rotation Woody Biomass"
    ];

    testArray = ["cornGrainYield", "soybeanYield", "mixedFruitsAndVegetablesYield", "cattleYield",
        "alfalfaHayYield", "grassHayYield", "switchgrassYield", "woodYield", "shortRotationWoodyBiomassYield"
    ];
    conversionArray = [0.0254, 0.0254, 0.90718474, 1, 0.90718474, 0.90718474, 0.90718474, 0.002359737, 0.90718474];

    for (var l = 0; l < testArray.length; l++) {


        switch (l) {
            case 0:
                string2 += "<tr class='tableHeading'><td><b>Yield</b></td></tr>";
                break;
        } //end switch

        string2 += "<tr>";

        string2 += "<td>" + nameArray[l] + "</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "Score";
            string2 += (Math.round(Totals.yieldResults[y][tempString] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        string2 += "<td>(out of 100)</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l];
            string2 += (Math.round(Totals.yieldResults[y][tempString] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        if (l < 2) string2 += "<td>bu</td>";
        if (l == 2) string2 += "<td>tons</td>";
        if (l == 3) string2 += "<td>animals</td>";
        if (4 <= l && l < 7) string2 += "<td>tons</td>";
        if (l == 7) string2 += "<td>board-ft</td>";
        if (l == 8) string2 += "<td>tons</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l];
            string2 += (Math.round(Totals.yieldResults[y][tempString] * conversionArray[l] * 10) / 10) + "<br>";

            string2 += "</td>";

        } //for each year

        if (l < 2) string2 += "<td>Mg</td>";
        if (l == 2) string2 += "<td>Mg</td>";
        if (l == 3) string2 += "<td>animals</td>";
        if (4 <= l && l < 7) string2 += "<td>Mg</td>";
        if (l == 7) string2 += "<td>m^3</td>";
        if (l == 8) string2 += "<td>Mg</td>";
    }

    string2 += "</table><br><br>";

    string2 += "<table class='resultsTable'>";

    //add header row

    string2 += "<tr class='tableHeading'> <th style='width:220px;'> Other Parameters </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th> </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th> </th>";

    string2 += "</tr>";

    string2 += "<tr><td>Precipitation</td>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<td>";
        string2 += boardData[currentBoard].precipitation[y];
        string2 += "</td>";
    }

    string2 += "<td>inches</td>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<td>";
        string2 += Math.round(boardData[currentBoard].precipitation[y] * 2.54 * 10) / 10;
        string2 += "</td>";
    }

    string2 += "<td>cm</td>";

    string2 += "</tr>";

    string2 += "<tr><td>Strategic Wetland Use</td>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<td>";
        string2 += Totals.strategicWetlandPercent[y];
        string2 += "</td>";
    }

    string2 += "<td>percent</td>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<td>";
        string2 += Totals.strategicWetlandCells[y];
        string2 += "</td>";
    }

    string2 += "<td>cells</td>";

    string2 += "</tr>";

    string2 += "</table>";


    document.getElementById('resultsFrame').contentWindow.document.getElementById('contents').innerHTML = string2;


} //end displayResults

//showCredits opens the credits iframe
function showCredits() {

    if(!modalUp){
    document.getElementById('creditsFrame').style.display = "block";
    document.getElementById('closeCredits').style.display = "block";
    }
} //end showCredits

//closeCreditFrame closes the credits iframe
function closeCreditFrame() {

    document.getElementById('creditsFrame').style.display = "none";
    document.getElementById('closeCredits').style.display = "none";

} //end closeCreditFrame

//showUploadDownload opens the credits iframe
function showUploadDownload() {
    
    if(!modalUp){
    document.getElementById('closeUploadDownload').style.display = "block";
    document.getElementById('uploadDownloadFrame').style.display = "block";
    }
    
    if(mapIsHighlighted){
        displayLevels();
    }

} //end showUploadDownload

//closeUploadDownloadFrame closes the credits iframe
function closeUploadDownloadFrame() {
    document.getElementById('closeUploadDownload').style.display = "none";
    document.getElementById('uploadDownloadFrame').style.display = "none";

} //end closeUploadDownloadFrame


function toggleIndex() {
    
    if(document.getElementById('index').style.display != "block"){
        closeCreditFrame();
        closeUploadDownloadFrame() ;
        if(document.getElementById('resultsFrame').className != "resultsFrameRolled") resultsEnd() ;
        
        modalUp = true ;
        document.getElementById('index').style.display = "block";
    }
    else{
        
        modalUp = false ;
        document.getElementById('index').style.display = "none" ;
        document.activeElement.blur();
    }
}

function showInfo(string){
    document.getElementById("currentInfo").innerHTML = string ;
}

function clearInfo(){
    document.getElementById("currentInfo").innerHTML = " ";
}

function updatePopup(string){
    document.getElementById("popupText").innerHTML = string + "<br><br>" + document.getElementById("popupText").innerHTML;
    document.getElementById("popup").className = "popup";
}

function clearPopup(){
    document.getElementById("popupText").innerHTML = " ";
    document.getElementById("popup").className = "popupHidden";
}


function randomizeBoard() {
    
    
    var prevPainter = painter ;
    
    //for whole board
    for(var i=0; i < boardData[currentBoard].map.length; i++){
    
    //if tile exists
        if(boardData[currentBoard].map[i].landType[currentYear] != LandUseType.none ){
            
            painter = getRandomInt(1,15) ;
            changeLandTypeTile(i) ;
        }
    }
    
    painter = prevPainter ;
// boardData[currentBoard].map[id].landType[currentYear] = painter;    
    
}

function toggleVisibility() {
    
    //default off items
    document.getElementById('statFrame').style.display = "none" ; 
    document.getElementById('year0Button').style.display = "none" ;
    
    //reset items
    for(var i=1; i <= 15; i++){
        var string = "paint" + i ;
        document.getElementById(string).style.display = "inline-block" ;
    }
    
    var strRawContents = document.getElementById('parameters').innerHTML ;
    
    //split based on escape chars
    while (strRawContents.indexOf("\r") >= 0) {
        strRawContents = strRawContents.replace("\r", "");
    }
    var arrLines = strRawContents.split("\n");

    for(var i=0; i<arrLines.length; i++){
        if(arrLines[i]){
            console.log(arrLines[i]) ;
            
            //giant switch
            switch(arrLines[i]){
                case "skyboxOn":
                    skybox = true ;
                    break;
                case "statsOn":
                    document.getElementById('statFrame').style.display = "block" ;
                    break;
                case "year0On":
                    document.getElementById('year0Button').style.display = "block" ;
                    break;
                case "precipOff":
                    immutablePrecip = true;
                     break;
                default:
                    document.getElementById(arrLines[i]).style.display = "none" ;    
             
                
            }
            
            
       
       
       
       
        }
    }
    
    
    
}


function painterSelect(value){
   
    var element = document.getElementsByClassName('painterIconSelected') ;
    element[0].className = "painterIcon" ;
    painterTool.hover = false;
    
    if(value == 1){
        document.getElementById('cellPaint').className = 'painterIconSelected' ;
        if(painterTool.status == 2) refreshBoard() ;
        painterTool.status = 0 ;
        
        
    }else if(value == 2 ){
        
            //painterTooler is not selected, so select it
            //painterTool.status 0 indicates not ready
            //painterTool.status 1 indicates waiting for DoubleClick
            //painterTool.status 2 indicates grid drag activity
            painterTool.status = 1 ;
            console.log("ready to DC, status=" + painterTool.status) ;
            document.getElementById('gridPaint').className = "painterIconSelected" ;
   
    }else if(value == 3){
        painterTool.status = 0 ;
        if(painterTool.status == 2) refreshBoard() ;
        
        document.getElementById('hoverPaint').className = 'painterIconSelected' ;
        painterTool.hover = true ;
    }
    
}