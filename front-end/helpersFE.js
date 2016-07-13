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
    if (previousHover != null && !mapIsHighlighted) {
        meshMaterials[previousHover].emissive.setHex(0x000000);
    }

    //highlight the new tile 
    //if not a tile
    if (id != -1 && meshMaterials[id].emissive && !mapIsHighlighted) {

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
        v1 = new THREE.Vector3(0, (topN24 + topN23 + topN1 + tile.topography) / 4 * 10, 0);
        v2 = new THREE.Vector3(tileWidth, (topN23 + topN22 + top1 + tile.topography) / 4 * 10, 0);
        v3 = new THREE.Vector3(tileWidth, (top24 + top23 + top1 + tile.topography) / 4 * 10, tileHeight);
        v4 = new THREE.Vector3(0, (top22 + top23 + topN1 + tile.topography) / 4 * 10, tileHeight);
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
    if (tile.streamNetwork == 1 && currentRow != tile.row) {
    //if (tile.streamNetwork == 1){
        riverPoints.push(new THREE.Vector3(tile.column * tileWidth - (tileWidth * tilesWide) / 2, 1, tile.row * tileHeight - (tileHeight * tilesHigh) / 2));
        currentRow = tile.row;
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

    if (intersects.length > 0 && !modalUp && !mapIsHighlighted) {

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

    if (!isShiftDown) {

        if (intersects.length > 0 && !modalUp && !mapIsHighlighted && !painterTool.hover ) {
 
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
    
                    meshMaterials[i].map = textureArray[0];
                    meshMaterials[i].emissive.setHex(getHighlightColor(type, i));
    
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
    
                        meshMaterials[i].map = textureArray[0];
                        meshMaterials[i].emissive.setHex(getHighlightColor(type, i));
    
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
                return "0xe6bb00";
            case 2:
                return "0xc97b08";
            case 3:
                return "0xad490d";
            case 4:
                return "0x9a3010";
            case 5:
                return "0x871c12";
        }

    }

    if (type == "nitrate") {

        var nitrateConcentration = Totals.nitrateContribution[currentYear][ID];

        if (nitrateConcentration >= 0 && nitrateConcentration <= 0.05) return "0xe6bb00";
        else if (nitrateConcentration > 0.05 && nitrateConcentration <= 0.1) return "0xc97b08";
        else if (nitrateConcentration > 0.1 && nitrateConcentration <= 0.2) return "0xad490d";
        else if (nitrateConcentration > 0.2 && nitrateConcentration <= 0.25) return "0x9a3010";
        else if (nitrateConcentration > 0.25) return "0x871c12";

    }

    if (type == "phosphorus") {

        var phosphorusRisk = Totals.phosphorusRiskAssessment[currentYear][ID];

        switch (phosphorusRisk) {
            case 1:
                return "0xe6bb00";
            case 2:
                return "0xc97b08";
            case 3:
                return "0xad490d";
            case 4:
                return "0x9a3010";
            case 5:
                return "0x871c12";
        }

    }

    if (type == "flood") {

        var flood = Number(boardData[currentBoard].map[ID].floodFrequency);

        switch (flood) {
            case 0:
                return "0xffffc9";
            case 10:
                return "0xffffc9";
            case 20:
                return "0xc7eab4";
            case 30:
                return "0x7fcebb";
            case 40:
                return "0x41b7c5";
            case 50:
                return "0x2f7eb7";
        }
    }

    if (type == "wetland") {

        if (boardData[currentBoard].map[ID].strategicWetland == 1) {
            return "0x2f7eb7";
        }
        else {
            return "0xffffc9";
        }
    }

    if (type == "subwatershed") {

        var watershed = Number(boardData[currentBoard].map[ID].subwatershed);

        switch (watershed) {
            case 1:
                return "0x45aa98";
            case 2:
                return "0x127731";
            case 3:
                return "0x989836";
            case 4:
                return "0xcc6578";
            case 5:
                return "0xa84597";
            case 6:
                return "0xdbcb74";
            case 7:
                return "0x342286";
            case 8:
                return "0x862254";
            case 9:
                return "0x87ceee";
            case 10:
                return "0x097c2f";
            case 11:
                return "0x979936";
            case 12:
                return "0x47aa98";
            case 13:
                return "0xe3c972";
            case 14:
                return "0xcb657a";
            case 15:
                return "0x882252";
            case 16:
                return "0xaa4497";
            case 17:
                return "0x302486";
            case 18:
                return "0x76d1c4";
            case 19:
                return "0x3f9f91";
            case 20:
                return "0x187336";
            case 21:
                return "0x919246";
        }
    }

    if (type == "drainage") {

        var drainage = Number(boardData[currentBoard].map[ID].drainageClass);

        switch (drainage) {
            case 70:
                return "0x0053b3";
            case 60:
                return "0x255d98";
            case 50:
                return "0x38638b";
            case 45:
                return "0x4b687e";
            case 40:
                return "0x5e6e71";
            case 30:
                return "0x837856";
            case 10:
                return "0xa9833c";
            case 0:
                return "0xbc892f";
        }
    }

} //end getHighlightColor

//contaminatedRiver changes the color of the river dependent on current phosphorus level
function contaminatedRiver() {

    //this is buggy -- still a work-in progress. Maybe the status of the river should be stored in the board for each year...

    if (Totals.phosphorusLoad[currentYear] > 1.7) {
        river.material.color.setHex("0x663300");
    }
    else {
        river.material.color.setHex("0x40a4df");
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