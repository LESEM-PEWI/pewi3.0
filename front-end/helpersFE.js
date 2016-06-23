var currentRow = -1;
var toolbarRolled = true ;
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
var rowCutOffs = [] ; //y coor of top left corner of each tile
var columnCutOffs = [] ;
var meshArray = [];
var mesh = null;

//onResize dynamically adjusts to window size changes
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
} //end onResize

//displayBoard initializes a board with graphics using addTile()
function displayBoard() {
    
<<<<<<< HEAD
    materials = [];
    riverPoints = [];
    singleGeometry = new THREE.Geometry();
     
=======
    //loop through all tiles and addTile to the meshGeometry and meshMaterials objects
>>>>>>> origin/experimental
    for(var i = 0; i < boardData[currentBoard].map.length; i++){
        addTile(boardData[currentBoard].map[i]);
    }
    
    for(var i = 0; i < meshGeometry.faces.length; i+=2){
        meshGeometry.faces[i].materialIndex = i/2;
        meshGeometry.faces[i+1].materialIndex = i/2;
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
    if(previousHover != null){
        meshMaterials[previousHover].emissive.setHex(0x000000);
    }
    
    //highlight the new tile 
    meshMaterials[id].emissive.setHex(0x7f7f7f);
    previousHover = id;
    
    document.getElementById("position").innerHTML = boardData[currentBoard].map[id].row + ", " + boardData[currentBoard].map[id].column;
    
    reDisplayCurrentBoard();
}

//changeLandTypeTile changes the landType of a selected tile
function changeLandTypeTile(id) {
    
    //change the materials of the faces in the meshMaterials array and update the boardData
    meshMaterials[id].map = textureArray[painter];
    boardData[currentBoard].map[id].landType[currentYear] = painter;
    boardData[currentBoard].map[id].update(currentYear);
    
}

function getTileID(x,y){
    
    //x and y in terms of three.js 3d coordinates, not screen coordinates
    
    var tilesWide = boardData[currentBoard].width;
    var tilesHigh = boardData[currentBoard].height;
    
    //calculate which column the tile is in
    var col = 0 ;
    
    if(x < columnCutOffs[0] || x > columnCutOffs[columnCutOffs.length - 1]){
        col = 0 ;
    }
    else{
        while(x > columnCutOffs[col]){
            col += 1 ;
        }
    }
    
     //calculate which row the tile is in
    var row = 0 ;
    
    if(y > rowCutOffs[0] || y < rowCutOffs[rowCutOffs.length - 1]){
        row = 0 ;
    }
    else{
        while(y < rowCutOffs[row]){
            row += 1 ;
        }
    }
    
    if(col==0 || row == 0){
        return -1 ;
    }
    
   return ((row-1) * tilesWide) + col - 1 ;

}

function calculateCutoffs() {
    
    var tilesWide = boardData[currentBoard].width;
    var tilesHigh = boardData[currentBoard].height;
    
    var tempColumnCut = [] ;
    var x ;
    
    x = - (tilesWide/2 - 1) * tileWidth ;
    xmax = ((tilesWide/2 + 1) * tileWidth );
    while(x <=  xmax ){
        tempColumnCut.push(x);
        x += tileWidth ;
    }
    
    columnCutOffs = tempColumnCut ;

    var tempRowCut = [] ;
    var y ;
    
    y =  (tilesHigh/2 - 1) * tileHeight ;
    ymax = (-(tilesHigh/2 + 1) * tileHeight);
    while(y >=  ymax ){
        tempRowCut.push(y);
        y -= tileHeight ;
    }
    
    rowCutOffs = tempRowCut ;

}

//addTile constructs the geometry of a tile and adds it to the scene
function addTile(tile){
    
        var tilesWide = boardData[currentBoard].width;
        var tilesHigh = boardData[currentBoard].height;
        
        var tileGeometry = new THREE.Geometry();
        var tileMaterial;
        
        var v1, v2, v3, v4;
        
        var mapID = tile.id - 1;

        //Retrieve the topography of adjacent tiles
        var topN24 = boardData[currentBoard].map[mapID - (tilesWide+1)] ? boardData[currentBoard].map[mapID - (tilesWide+1)].topography : 0;
        var topN23 = boardData[currentBoard].map[mapID - (tilesWide)] ? boardData[currentBoard].map[mapID - (tilesWide)].topography : 0;
        var topN22 = boardData[currentBoard].map[mapID - (tilesWide-1)] ? boardData[currentBoard].map[mapID - (tilesWide-1)].topography : 0;
        var topN1 = boardData[currentBoard].map[mapID - 1] ? boardData[currentBoard].map[mapID - 1].topography : 0;
        var top1 = boardData[currentBoard].map[mapID + 1] ? boardData[currentBoard].map[mapID + 1].topography : 0;
        var top22 = boardData[currentBoard].map[mapID + (tilesWide-1)] ? boardData[currentBoard].map[mapID + (tilesWide-1)].topography : 0;
        var top23 = boardData[currentBoard].map[mapID + (tilesWide)] ? boardData[currentBoard].map[mapID + (tilesWide)].topography : 0;
        var top24 = boardData[currentBoard].map[mapID + (tilesWide+1)] ? boardData[currentBoard].map[mapID + (tilesWide+1)].topography : 0;
        
        //Calculate the heights of vertices by averaging topographies of adjacent tiles and create a vector for each corner
        v1 = new THREE.Vector3(0,(topN24 + topN23 + topN1 + tile.topography)/4*10,0);
        v2 = new THREE.Vector3(tileWidth,(topN23 + topN22 + top1 + tile.topography)/4*10,0);
        v3 = new THREE.Vector3(tileWidth,(top24 + top23 + top1 + tile.topography)/4*10,tileHeight);
        v4 = new THREE.Vector3(0,(top22 + top23 + topN1 + tile.topography)/4*10,tileHeight);

        tileGeometry.vertices.push(v1);
        tileGeometry.vertices.push(v2);
        tileGeometry.vertices.push(v3);
        tileGeometry.vertices.push(v4);
        
        //Create two new faces (triangles) for the tile
        var face = new THREE.Face3(2,1,0);
        face.normal.set(0,1,0); // normal
        tileGeometry.faces.push(face);
        tileGeometry.faceVertexUvs[0].push([new THREE.Vector2(0,0),new THREE.Vector2(0,1),new THREE.Vector2(1,1)]); // uvs

        face = new THREE.Face3(3,2,0);
        face.normal.set(0,1,0); // normal
        tileGeometry.faces.push(face);
        tileGeometry.faceVertexUvs[0].push([new THREE.Vector2(1,0),new THREE.Vector2(0,0),new THREE.Vector2(1,1)]); // uvs
        
        
        if(tile.landType[currentYear] == 0){
            tileMaterial = new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity: 0.0});
            meshMaterials.push(tileMaterial);
        } else {
            tileMaterial = new THREE.MeshLambertMaterial({ map: textureArray[tile.landType[currentYear]], side: THREE.DoubleSide});
            meshMaterials.push(tileMaterial);
        }
        
        //if this tile is the first in its row that is a streamNetwork tile add it to the riverPoints array
        if(tile.streamNetwork == 1 && currentRow != tile.row){
            riverPoints.push(new THREE.Vector3(tile.column * tileWidth - (tileWidth * tilesWide)/2, 1, tile.row * tileHeight - (tileHeight * tilesHigh)/2));
            currentRow = tile.row;
        }
        
        //create a new mesh from the two faces for the tile    
        var newTile = new THREE.Mesh(tileGeometry, tileMaterial);
        
        //change the x and z position of the tile dependent on the row and column that it is in
        newTile.position.x = tile.column * tileWidth - (tileWidth * tilesWide)/2;
        newTile.position.y = 0;
        newTile.position.z = tile.row * tileHeight - (tileHeight * tilesHigh)/2;
        
        //add the mapID to the 
        newTile.mapID = mapID;
        
        //add the tile to the meshGeometry which contains all vertices/faces of the merged tiles 
        newTile.updateMatrix();
        meshGeometry.merge(newTile.geometry, newTile.matrix);
    
} //end addTile


//refreshBoard removes the current mesh and clears the objects that store its data, then calls displayBoard
function refreshBoard(){
    
    if(mesh != null){
        scene.remove(mesh);
    }
    
<<<<<<< HEAD
    scene.remove(mesh) ;
    singleGeometry = new THREE.Geometry();
    materials = [];
=======
    meshGeometry = new THREE.Geometry();
    meshMaterials = [];
>>>>>>> origin/experimental
    
    displayBoard();
    
} //end refreshBoard

//transitionToYear updates the graphics for a board to "year" input
function transitionToYear(year) {
    
      currentYear = year;
    
      if(year > boardData[currentBoard].calculatedToYear){
          boardData[currentBoard].calculatedToYear = year;
          boardData[currentBoard].updateBoard();
      }
    
    refreshBoard();

} //end transitionToYear

//onDocumentMouseMove follows the cursor and highlights corresponding tiles
function onDocumentMouseMove( event ) {
    
 	event.preventDefault();

 	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
	
 	raycaster.setFromCamera( mouse, camera );
	
 	var intersects = raycaster.intersectObjects(scene.children);
 	
    highlightTile(getTileID(intersects[0].point.x, -intersects[0].point.z));
	
} //end onDocumentMouseMove

//onDocumentDoubleClick changes landType to the painted (selected) landType on double-click
//and will change map to a monoculture if shift is held down
function onDocumentDoubleClick( event ) {
    
    event.preventDefault();

 	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
	
 	raycaster.setFromCamera( mouse, camera );
	
 	var intersects = raycaster.intersectObjects(scene.children);
    
    if( !isShiftDown ){
	
        if ( intersects.length > 0 && !modalUp) {
            
            changeLandTypeTile(getTileID(intersects[0].point.x, -intersects[0].point.z));
        	
        }
	
	} else {
	    
	        for(var i = 0; i < boardData[currentBoard].map.length; i++){
        
                if(boardData[currentBoard].map[i].landType[currentYear] != 0){
                    
                    changeLandTypeTile(i);

                }

            }
	    
	}

}//end onDocumentMouseDown(event)

//onDocumentKeyDown listens for the shift key held down
function onDocumentKeyDown( event ){
    
    switch( event.keyCode ){
        case 16: isShiftDown = true; break;
    }

} //end onDocumentKeyDown

//onDocumentKeyUp listens for the shift key released
function onDocumentKeyUp( event ){
    
    switch( event.keyCode ){
        case 16: isShiftDown = false; break;
    }

} //end onDocumentKeyUp

//paintChange changes the highlighted color of the selected painter and updates painter
function paintChange(value) {
    
    //change current painter to regular
    var string = "paint" + painter ;
    document.getElementById(string).className = "landSelectorIcon" ;
    
    //change new paiter to current
    string = "paint" + value ;
    document.getElementById(string).className = "landSelectedIcon" ;
    painter = value ;  
  
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
    
    //setup Screen Appropriately
    modalUp=true;
    document.getElementById("resultsButton").onmouseout = "";
    document.getElementById("resultsButton").onmouseover = "";
    document.getElementById("resultsButton").onclick = function() {resultsEnd() ;}; 

    if(document.getElementById("precipConsole").className != "precipConsoleRolled")  roll(3) ;
    document.getElementById("toolsButton").onclick = "";
    
    document.getElementById("resultsButton").className = "resultsButtonFar" ;
    if(document.getElementById("landUseConsole").className != "landUseConsoleRolled"){
       roll(1) ;
       toolbarRolled = false;
    }
    

    //functions that update results and display them appropriately
    calculateResults();
    displayResults();
    animateResults();

} //end resultsStart

//resultsEnd hides the results and returns the menus to the screens
function resultsEnd() {
    //reset functionality
    document.getElementById("resultsFrame").className = "resultsFrameRolled" ;
    document.getElementById("resultsButton").className = "resultsButtonRolled" ;
    
    if(!toolbarRolled) roll(1);
    document.getElementById("resultsButton").onmouseout = function() {document.getElementById("resultsButton").className = "resultsButtonRolled"; } ;
    document.getElementById("resultsButton").onmouseover = function() {roll(2); } ;
    document.getElementById("toolsButton").onclick = function() {roll(1); } ;
    document.getElementById("resultsButton").onclick = function() { resultsStart();} ;
    modalUp = false;
    
} //end resultsEnd

//roll controls the display of the toolbars on the left
function roll(value) {
    
    if(value==1){
        
    if( document.getElementById("landUseConsole").className == "landUseConsole"){
     document.getElementById("landUseConsole").className = "landUseConsoleRolled" ;
     document.getElementById("toolsButton").className = "toolsButtonRolled" ;
     document.getElementById("precipConsole").className = "precipConsoleRolled";
     document.getElementById("precipButton").className = "precipButtonRolled";
     document.getElementById("terrainButton").className = "terrainButtonRolled";
     document.getElementById("levelsConsole").className = "levelsConsoleRolled";
     document.getElementById("levelsButton").className = "levelsButtonRolled";
     document.getElementById("featuresConsole").className = "featuresConsoleRolled";
     document.getElementById("featuresButton").className = "featuresButtonRolled";
      toolbarRolled = true;
    }
    else{
        document.getElementById("landUseConsole").className = "landUseConsole";
        document.getElementById("toolsButton").className = "toolsButton" ;
        document.getElementById("precipConsole").className = "precipConsole";
        document.getElementById("precipButton").className = "precipButton";
        document.getElementById("terrainButton").className = "terrainButton";
        document.getElementById("levelsConsole").className = "levelsConsole";
        document.getElementById("levelsButton").className = "levelsButton";
        document.getElementById("featuresConsole").className = "featuresConsole";
        document.getElementById("featuresButton").className = "featuresButton";
        toolbarRolled = false;
    }
    
    }//left tollbox
    
    if(value==2){
        
        if( document.getElementById("resultsButton").className == "resultsButton"){
            document.getElementById("resultsButton").className = "resultsButtonRolled";
        }
        else if (document.getElementById("resultsButton").className == "resultsButtonRolled") {
            document.getElementById("resultsButton").className = "resultsButton";
        }
        
        
    }//right results button

    
} //roll

//showLevelDetails shows the legend for each of the highlight map functions
function showLevelDetails(value) {
    
    if(value==1){
        document.getElementById("nitrateDetailsList").className = "nitrateDetailsList";
    }
    
    if(value==-1){
        document.getElementById("nitrateDetailsList").className = "nitrateDetailsListRolled";
    }
    
    if(value==2){
        document.getElementById("erosionDetailsList").className = "erosionDetailsList";
    }
    
    if(value==-2){
        document.getElementById("erosionDetailsList").className = "erosionDetailsListRolled";
    }
    
    if(value==3){
        document.getElementById("phosphorusDetailsList").className = "phosphorusDetailsList";
    }
    
    if(value==-3){
        document.getElementById("phosphorusDetailsList").className = "phosphorusDetailsListRolled";
    }
    
    if(value==4){
        document.getElementById("floodFrequencyDetailsList").className = "floodFrequencyDetailsList";
    }
    
    if(value==-4){
        document.getElementById("floodFrequencyDetailsList").className = "floodFrequencyDetailsListRolled";
    }
    
    if(value==5){
        document.getElementById("drainageClassDetailsList").className = "drainageClassDetailsList";
    }
    
    if(value==-5){
        document.getElementById("drainageClassDetailsList").className = "drainageClassDetailsListRolled";
    }
    
} //showLevelDetails

//updatePrecip updates the currentBoard with the precipitation values selected in the drop down boxes
function updatePrecip(year) {
    
    if(year == 0){
        boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year0Precip").value)];
    }
    if(year == 1){
        boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year1Precip").value)];
    }
    if(year == 2){
        boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year2Precip").value)];
    }
    if(year == 3){
        boardData[currentBoard].precipitation[year] = precip[Number(document.getElementById("year3Precip").value)];
    }
    
    boardData[currentBoard].updateBoard();
    
} //updatePrecip

//switchConsoleTab updates the currently selected toolbar on the left
function switchConsoleTab(value){

    if(value==1){
        document.getElementById('terrainImg').className = "imgSelected" ;
        document.getElementById('precipImg').className = "imgNotSelected" ;
        document.getElementById('levelsImg').className = "imgNotSelected";
        document.getElementById('featuresImg').className = "imgNotSelected";
        document.getElementById('painterTab').style.display = "block";
        document.getElementById('precipTab').style.display = "none" ;
        document.getElementById('levelsTab').style.display = "none";
        document.getElementById('featuresTab').style.display = "none";        
    }
    
    if(value==2){
        document.getElementById('terrainImg').className = "imgNotSelected" ;
        document.getElementById('precipImg').className = "imgSelected" ;
        document.getElementById('levelsImg').className = "imgNotSelected";
        document.getElementById('featuresImg').className = "imgNotSelected";
        document.getElementById('painterTab').style.display = "none";
        document.getElementById('precipTab').style.display = "block" ;
        document.getElementById('levelsTab').style.display = "none";
        document.getElementById('featuresTab').style.display = "none";
    }
    
    if(value==3){
        document.getElementById('terrainImg').className = "imgNotSelected" ;
        document.getElementById('precipImg').className = "imgNotSelected" ;
        document.getElementById('levelsImg').className = "imgSelected";
        document.getElementById('featuresImg').className = "imgNotSelected";
        document.getElementById('painterTab').style.display = "none";
        document.getElementById('precipTab').style.display = "none" ;
        document.getElementById('levelsTab').style.display = "block";
        document.getElementById('featuresTab').style.display = "none";
    }
    
    if(value==4){
        document.getElementById('terrainImg').className = "imgNotSelected";
        document.getElementById('precipImg').className = "imgNotSelected" ;
        document.getElementById('levelsImg').className = "imgNotSelected";
        document.getElementById('featuresImg').className = "imgSelected";
        document.getElementById('painterTab').style.display = "none";
        document.getElementById('precipTab').style.display = "none" ;
        document.getElementById('levelsTab').style.display = "none";
        document.getElementById('featuresTab').style.display = "block";
    }
    
} //end switchConsoleTab

//switchYearTab changes the highlighted year
function switchYearTab(value){
    
    if(value==0){
        document.getElementById('year1Image').className = "yearNotSelected" ;
        document.getElementById('year2Image').className = "yearNotSelected" ;
        document.getElementById('year3Image').className = "yearNotSelected" ;
    }

    if(value==1){
        document.getElementById('year1Image').className = "yearSelected" ;
        document.getElementById('year2Image').className = "yearNotSelected" ;
        document.getElementById('year3Image').className = "yearNotSelected" ;
    }
    
    if(value==2){
        document.getElementById('year1Image').className = "yearNotSelected" ;
        document.getElementById('year2Image').className = "yearSelected" ;
        document.getElementById('year3Image').className = "yearNotSelected" ;
    }
    
    if(value==3){
        document.getElementById('year1Image').className = "yearNotSelected" ;
        document.getElementById('year2Image').className = "yearNotSelected" ;
        document.getElementById('year3Image').className = "yearSelected" ;
    }
    
} //end switchYearTab

//displayLevels highlight each tile using getHighlightColor method
function displayLevels(type){
    
    Totals = new Results(boardData[currentBoard]);
    Totals.update() ;
    
    for(var i = 0; i < boardData[currentBoard].map.length; i++){
        
        if(boardData[currentBoard].map[i].landType[currentYear] != 0){

            meshMaterials[i].map = textureArray[0];
            meshMaterials[i].emissive.setHex(getHighlightColor(type, i));

        }

    }
    
} //end displayLevels

//getHighlightColor determines the gradient of highlighting color for each tile dependent on type of map selected
function getHighlightColor(type, ID){
    
    if(type == "erosion"){
        
        var erosionSeverity = Totals.grossErosionSeverity[currentYear][ID];
        
        //console.log(erosionSeverity);
        
        switch(erosionSeverity){
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
    
    if(type == "nitrate"){
        
        var nitrateConcentration = Totals.nitrateContribution[currentYear][ID];
        
        if (nitrateConcentration >= 0 && nitrateConcentration <= 0.05) return "0xe6bb00";
        else if (nitrateConcentration > 0.05 && nitrateConcentration <= 0.1) return "0xc97b08";
        else if (nitrateConcentration > 0.1 && nitrateConcentration <= 0.2) return "0xad490d";
        else if (nitrateConcentration > 0.2 && nitrateConcentration <= 0.25) return "0x9a3010";
        else if (nitrateConcentration > 0.25) return "0x871c12";
        
    }
    
    if(type == "phosphorus"){
        
        var phosphorusRisk = Totals.phosphorusRiskAssessment[currentYear][ID];
        
        switch(phosphorusRisk){
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
    
    if(type == "flood"){
        
        var flood = Number(boardData[currentBoard].map[ID].floodFrequency);
        
        switch(flood){
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
    
    if(type == "wetland"){
        
        if(boardData[currentBoard].map[ID].strategicWetland == 1){
            return "0x2f7eb7";
        } else {
            return "0xffffc9";
        }
    }
    
    if(type == "subwatershed"){
        
        var watershed = Number(boardData[currentBoard].map[ID].subwatershed);
        
        switch(watershed){
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
    
    if(type == "drainage"){
        
        var drainage = Number(boardData[currentBoard].map[ID].drainageClass);
        
        switch(drainage){
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
    
    if(Totals.phosphorusLoad[currentYear] > 1.7){
        river.material.color.setHex("0x663300");
    } else {
        river.material.color.setHex("0x40a4df")
    }
    
} //end contaminatedRiver

//writeFileToDownloadString creates a string in csv format that describes the current board
function writeFileToDownloadString(){
    
  var string = "";

  string = string + "ID,Row,Column,Area,BaseLandUseType,CarbonMax,CarbonMin,Cattle,CornYield,DrainageClass,Erosion,FloodFrequency,Group,NitratesPPM,PIndex,Sediment,SoilType,SoybeanYield,StreamNetwork,Subwatershed,Timber,Topography,WatershedNitrogenContribution,StrategicWetland,LandTypeYear1,LandTypeYear2,LandTypeYear3,PrecipYear0,PrecipYear1,PrecipYear2,PrecipYear3" + "\n";

  for(var i = 0; i < boardData[currentBoard].map.length; i++){

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

    if(i < boardData[currentBoard].map.length - 1){
      string = string + '\r\n';
    } else {
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
        
        closeUploadDownloadFrame() ;
        
}// end downloadClicked

//uploadClicked enables the user to upload a .csv of board data
function uploadClicked(e) {

    var files;
    files = e.target.files;

    if (files[0].name && !files[0].name.match(/\.csv/)) {
        alert("Incorrect File Type!");
    } else {
        var reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = function(e) {
            setupBoardFromUpload(reader.result);
            //clear initData
            initData = [];
        }
    }//end else

    closeUploadDownloadFrame();

} //end uploadClicked


//animateResults
function animateResults() {
    
 //todo, increased functionality
  document.getElementById("resultsFrame").className = "resultsFrame" ;
   
} //end animateResults

//calculateResults triggers the results calculations by updating Totals
function calculateResults() {
    
    //Totals = new Results(boardData[currentBoard]);
    Totals.update() ;
    
    //contaminatedRiver(Totals);
    
} //end calculateResults

//displayResults writes the html for the results iframe with updates results from Totals
function displayResults() {
    
    toMetricFactorArea = 2.471 ;
    var upToYear = boardData[currentBoard].calculatedToYear ;
    
    //document.getElementById('resultsFrame').contentWindow.document.getElementById('contents').innerHTML = "WORKS";
    var nameArray = ["Conventional Corn Area", "Conservation Corn Area","Conventional Soybean Area", "Conservation Soybean Area", 
    "Mixed Fruits and Vegetables Area", "Permanent Pasture Area", "Rotational Grazing Area", "Grass Hay Area",
    "Herbaceous Perennial Bioenergy Area", "Prairie Area", "Wetland Area","Alfalfa Area","Conventional Forest Area", 
    "Conservation Forest Area", "Short Rotation Woody Bioenergy Area"] ;
    var testArray = ["conventionalCorn","conservationCorn","conventionalSoybean",
    "conservationSoybean","mixedFruitsVegetables","permanentPasture","rotationalGrazing","grassHay",
    "herbaceousPerennialBioenergy", "prairie", "wetland","alfalfa","conventionalForest",
    "conservationForest","shortRotationWoodyBioenergy"];
    
    var string2 = "";
    
    string2 += "<table class='resultsTable'>";
    
    //add header row
    
    string2 += "<tr class='tableHeading'> <th> Land Use Category </th>" ;
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<th>" ;
        string2 += "Y" + y ;
        string2 += "</th>" ;
    }
    
    string2 += "<th>Percentage</th>";
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<th>" ;
        string2 += "Y" + y ;
        string2 += "</th>" ;
    }
    
     string2 += "<th>Units (English) </th>";
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<th>" ;
        string2 += "Y" + y ;
        string2 += "</th>" ;
    }
    
    string2 += "<th>Units (Metric) </th>";
    
    string2 += "</tr>";
    
    for(var l = 0 ; l< testArray.length ; l++ ){
        
        
        switch(l){
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
                        
        }//end switch
        
        string2 += "<tr>";
        
        string2 += "<td>" + nameArray[l] + "</td>";
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>";
            
            var tempString = testArray[l] + "LandUse";
            string2 += ( Math.round(Totals.landUseResults[y][tempString] / Totals.totalArea * 100 * 10  )  / 10 ) + "<br>" ;
            
            string2+= "</td>";
        }//for each year
        
        string2 += "<td>percent</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>";
            
            var tempString = testArray[l] + "LandUse";
            string2 += ( Math.round(Totals.landUseResults[y][tempString] * 10) / 10 ) + "<br>" ;
            
            string2+= "</td>";
        }//for each year
        
        string2 += "<td>acres</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>";
            
            var tempString = testArray[l] + "LandUse";
            string2 += ( Math.round(Totals.landUseResults[y][tempString]  / toMetricFactorArea *10 ) / 10 ) + "<br>" ;
            
            string2+= "</td>";
            
        }//for each year
        string2 += "<td>hectares</td></tr>" ;
        
        
    }
    
    string2 += "</table><br><br><br><br>" ;
    
    
    //===================================================
    //update second table
    
          
    nameArray =["Game Wildlife","Biodiversity","Carbon Sequestration", "Erosion Control / Gross Erosion",
    "Nitrate Pollution Control <br> / In-Stream Concentration","Phosphorus Pollution Control <br> / In-Stream Loading",
    "Sediment Control <br> / In-Stream Delivery"];
    testArray=["gameWildlifePoints","biodiversityPoints","carbonSequestration","grossErosion","nitrateConcentration",
    "phosphorusLoad", "sedimentDelivery"];
    conversionArray=[1,1,0.90718474,0.90718474,1,1,0.90718474, 0.90718474];
    
    string2 += "<table class='resultsTable'>";
    
    //add header row
    
    string2 += "<tr class='tableHeading'> <th> Ecosystem Service Indicator <br> / Measurement </th>" ;
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<th>" ;
        string2 += "Y" + y ;
        string2 += "</th>" ;
    }
    
    string2 += "<th>Score</th>";
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<th>" ;
        string2 += "Y" + y ;
        string2 += "</th>" ;
    }
    
     string2 += "<th>Units (English) </th>";
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<th>" ;
        string2 += "Y" + y ;
        string2 += "</th>" ;
    }
    
    string2 += "<th>Units (Metric) </th>";
    
    string2 += "</tr>";
    
    
    for(var l = 0 ; l< testArray.length ; l++ ){
        
        
        switch(l){
            case 0:
                string2 += "<tr class='tableHeading'><td><b>Habitat</b></td></tr>";
                break;
            case 2:
                string2 += "<tr class='tableHeading'><td><b>Soil Quality</b></td></tr>";
                break;
            case 4:
                string2 += "<tr class='tableHeading'><td><b>Water Quality</b></td></tr>";
                break;
        }//end switch
        
        string2 += "<tr>";
        
        string2 += "<td>" + nameArray[l] + "</td>";
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>";
            
            var tempString = testArray[l] + "Score";
            string2 += ( Math.round(Totals[tempString][y] * 10  )  / 10 ) + "<br>" ;
            
            string2+= "</td>";
        }//for each year
        
        string2 += "<td>(out of 100)</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>";
            
            var tempString = testArray[l];
            string2 += ( Math.round(Totals[tempString][y] * 10) / 10 ) + "<br>" ;
            
            string2+= "</td>";
        }//for each year
        
        if(l<2) string2 += "<td>pts</td>" ;
        if(2<= l && l < 4) string2 +="<td>tons</td>" ;
        if(4<= l && l < 5) string2 +="<td>ppm</td>" ;
        if(5<= l && l < 8) string2 +="<td>tons</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>";
            
            var tempString = testArray[l];
            string2 += ( Math.round(Totals[tempString][y] * conversionArray[l] * 10 ) / 10 ) + "<br>" ;
            
            string2+= "</td>";
            
        }//for each year
        
        if(l< 2) string2 += "<td>pts</td>" ;
        if(2 <= l && l <4) string2 +="<td>Mg</td>" ;
        if(4<= l && l < 5) string2 +="<td>mg/L</td>" ;
        if(5<= l && l < 8) string2 +="<td>Mg</td>" ;
    }
    
    
    //Finally, add the yeild results to the table...
    
    nameArray =["Corn Grain", "Soybeans", "Mixed Fruits and Vegetables", "Cattle", "Alfalfa Hay","Grass Hay",
    "Herbaceous Perennial Biomass", "Wood", "Short Rotation Woody Biomass"];
            
    testArray=["cornGrainYield","soybeanYield", "mixedFruitsAndVegetablesYield", "cattleYield",
    "alfalfaHayYield","grassHayYield","herbaceousPerennialBiomassYield", "woodYield", "shortRotationWoodyBiomassYield"];
    conversionArray=[0.0254, 0.0254, 0.90718474, 1, 0.90718474, 0.90718474,0.90718474,0.002359737, 0.90718474 ];
    
     for(var l = 0 ; l< testArray.length ; l++ ){
        
        
        switch(l){
            case 0:
                string2 += "<tr class='tableHeading'><td><b>Yield</b></td></tr>";
                break;
        }//end switch
        
        string2 += "<tr>";
        
        string2 += "<td>" + nameArray[l] + "</td>";
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>";
            
            var tempString = testArray[l] + "Score";
            string2 += ( Math.round(Totals.yieldResults[y][tempString] * 10  )  / 10 ) + "<br>" ;
            
            string2+= "</td>";
        }//for each year
        
        string2 += "<td>(out of 100)</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>";
            
            var tempString = testArray[l];
            string2 += ( Math.round(Totals.yieldResults[y][tempString] * 10) / 10 ) + "<br>" ;
            
            string2+= "</td>";
        }//for each year
       
        if(l < 2 ) string2 += "<td>bu</td>" ;  
        if(l == 2 ) string2 += "<td>tons</td>" ; 
        if(l == 3) string2 += "<td>animals</td>" ;
        if(4<= l && l < 7) string2 += "<td>tons</td>" ;
        if(l == 7 ) string2 += "<td>board-ft</td>" ;
        if(l == 8 ) string2 += "<td>tons</td>" ; 
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>";
            
            var tempString = testArray[l];
            string2 += ( Math.round(Totals.yieldResults[y][tempString] * conversionArray[l] * 10 ) / 10 ) + "<br>" ;
            
            string2+= "</td>";
            
        }//for each year
        
        if(l < 2 ) string2 += "<td>Mg</td>" ;  
        if(l == 2) string2 += "<td>Mg</td>" ;  
        if(l == 3) string2 += "<td>animals</td>" ;
        if(4<= l && l < 7) string2 += "<td>Mg</td>" ;
        if(l == 7 ) string2 += "<td>m^3</td>" ;
        if(l == 8 ) string2 += "<td>Mg</td>" ; 
    }
    
    string2 += "</table><br><br>";
    
    string2 += "<table class='resultsTable'>";
    
    //add header row
    
    string2 += "<tr class='tableHeading'> <th style='width:220px;'> Other Parameters </th>" ;
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<th>" ;
        string2 += "Y" + y ;
        string2 += "</th>" ;
    }
    
    string2 += "<th> </th>";
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<th>" ;
        string2 += "Y" + y ;
        string2 += "</th>" ;
    }
    
    string2 += "<th> </th>";
    
    string2 += "</tr>" ;
    
    string2 += "<tr><td>Precipitation</td>";
    
     for(var y = 1; y<= upToYear; y++){
        string2 += "<td>" ;
        string2 += boardData[currentBoard].precipitation[y] ;
        string2 += "</td>" ;
    }
    
    string2 += "<td>inches</td>";
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<td>" ;
        string2 += Math.round(boardData[currentBoard].precipitation[y] *2.54 * 10) / 10;
        string2 += "</td>" ;
    }
    
    string2 += "<td>cm</td>";
    
    string2 += "</tr>" ;
    
    string2 += "<tr><td>Strategic Wetland Use</td>";
    
     for(var y = 1; y<= upToYear; y++){
        string2 += "<td>" ;
        string2 += Totals.strategicWetlandPercent[y] ;
        string2 += "</td>" ;
    }
    
    string2 += "<td>percent</td>";
    
    for(var y = 1; y<= upToYear; y++){
        string2 += "<td>" ;
        string2 += Totals.strategicWetlandCells[y] ;
        string2 += "</td>" ;
    }
    
    string2 += "<td>cells (out of 20)</td>";
    
    string2 += "</tr>" ;
    
    string2 += "</table>" ;
    
    
    document.getElementById('resultsFrame').contentWindow.document.getElementById('contents').innerHTML = string2;
    
    
} //end displayResults

//showCredits opens the credits iframe
function showCredits() {
    
    document.getElementById('creditsFrame').style.display = "block" ;
    document.getElementById('closeCredits').style.display = "block" ;
    
} //end showCredits

//closeCreditFrame closes the credits iframe
function closeCreditFrame() {

    document.getElementById('creditsFrame').style.display = "none" ;
    document.getElementById('closeCredits').style.display = "none" ;
    
} //end closeCreditFrame

//showUploadDownload opens the credits iframe
function showUploadDownload() {
    document.getElementById('closeUploadDownload').style.display = "block" ; 
    document.getElementById('uploadDownloadFrame').style.display = "block" ;    


} //end showUploadDownload

//closeUploadDownloadFrame closes the credits iframe
function closeUploadDownloadFrame() {
    document.getElementById('closeUploadDownload').style.display = "none" ; 
    document.getElementById('uploadDownloadFrame').style.display = "none" ;    

} //end closeUploadDownloadFrame

