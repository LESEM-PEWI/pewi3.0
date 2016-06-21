var currentRow = -1;

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

function updateHUD() {
    var text ;
    text = "x: " + Math.floor(camera.position.x) ;
    text += "  y: " + Math.floor(camera.position.y) ;
    text += "  z: " + Math.floor(camera.position.z)  ;
    text += "<br>";
    text += "  rx: " + Math.floor(camera.rotation.x) ;
    text += "  ry: " + Math.floor(camera.rotation.y) ;
    text += "  rz: " + Math.floor(camera.rotation.z) ;
    
    document.getElementById("pos").innerHTML = text ;
}

function displayBoard() {
    
    for(var i = 0; i < boardData[currentBoard].map.length; i++){
        
        addTile(boardData[currentBoard].map[i]);
    
    }
    
};

function addTile(tile){
    
        var tilesWide = boardData[currentBoard].width;
        var tilesHigh = boardData[currentBoard].height;
    
        var tileHeight = 12;
        var tileWidth = 18;
        
        //var tileGeometry = new THREE.BoxGeometry(tileWidth, 0, tileHeight);
        
        var tileGeometry = new THREE.Geometry(); 
        
        var v1; var v2; var v3; var v4;
        
        var mapID = tile.id - 1;

        var topN24 = boardData[currentBoard].map[mapID - 24] ? boardData[currentBoard].map[mapID - 24].topography : 0;
        var topN23 = boardData[currentBoard].map[mapID - 23] ? boardData[currentBoard].map[mapID - 23].topography : 0;
        var topN22 = boardData[currentBoard].map[mapID - 22] ? boardData[currentBoard].map[mapID - 22].topography : 0;
        var topN1 = boardData[currentBoard].map[mapID - 1] ? boardData[currentBoard].map[mapID - 1].topography : 0;
        var top1 = boardData[currentBoard].map[mapID + 1] ? boardData[currentBoard].map[mapID + 1].topography : 0;
        var top22 = boardData[currentBoard].map[mapID + 22] ? boardData[currentBoard].map[mapID + 22].topography : 0;
        var top23 = boardData[currentBoard].map[mapID + 23] ? boardData[currentBoard].map[mapID + 23].topography : 0;
        var top24 = boardData[currentBoard].map[mapID + 24] ? boardData[currentBoard].map[mapID + 24].topography : 0;
        
        v1 = new THREE.Vector3(0,(topN24 + topN23 + topN1 + tile.topography)/4*10,0);
        v2 = new THREE.Vector3(tileWidth,(topN23 + topN22 + top1 + tile.topography)/4*10,0);
        v3 = new THREE.Vector3(tileWidth,(top24 + top23 + top1 + tile.topography)/4*10,tileHeight);
        v4 = new THREE.Vector3(0,(top22 + top23 + topN1 + tile.topography)/4*10,tileHeight);

        tileGeometry.vertices.push(v1);
        tileGeometry.vertices.push(v2);
        tileGeometry.vertices.push(v3);
        tileGeometry.vertices.push(v4);
        

        //tileGeometry.faces.push( new THREE.Face3( 2, 1, 0 ) );
        //tileGeometry.faces.push( new THREE.Face3( 3, 2, 0 ) );
        
        
        var face = new THREE.Face3(2,1,0);
        face.normal.set(0,1,0); // normal
        tileGeometry.faces.push(face);
        tileGeometry.faceVertexUvs[0].push([new THREE.Vector2(0,0),new THREE.Vector2(0,1),new THREE.Vector2(1,1)]); // uvs

        face = new THREE.Face3(3,2,0);
        face.normal.set(0,1,0); // normal
        tileGeometry.faces.push(face);
        tileGeometry.faceVertexUvs[0].push([new THREE.Vector2(1,0),new THREE.Vector2(0,0),new THREE.Vector2(1,1)]); // uvs
        
        if(tile.landType[currentYear] == 0){
            tileMaterial = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0});
        } else {
            tileMaterial = new THREE.MeshLambertMaterial({ map: textureArray[tile.landType[currentYear]]});
        }
        
        if(tile.streamNetwork == 1 && currentRow != tile.row){
            riverPoints.push(new THREE.Vector3(tile.column * tileWidth - (tileWidth * tilesWide)/2, 1, tile.row * tileHeight - (tileHeight * tilesHigh)/2));
            currentRow = tile.row;
        }
    
        var newTile = new THREE.Mesh(tileGeometry, tileMaterial);
        
        newTile.receiveShadow = true;
        newTile.castShadow = true;
        
        newTile.position.x = tile.column * tileWidth - (tileWidth * tilesWide)/2;
        newTile.position.y = 0;
        newTile.position.z = tile.row * tileHeight - (tileHeight * tilesHigh)/2;
        
        newTile.mapID = tile.id - 1;
        
        tile.graphics = newTile;
        
        tiles[mapID] = tile.graphics;
        
        scene.add(tile.graphics);
    
};

function transitionToYear(year) {
    
    currentYear = year;
    
    if(year > boardData[currentBoard].calculatedToYear){
        boardData[currentBoard].calculatedToYear = year;
        boardData[currentBoard].updateBoard();
    }
    
    for(var i = 0; i < boardData[currentBoard].map.length; i++){
        
        scene.remove(tiles[i]);
        addTile(boardData[currentBoard].map[i]);
        
    }
    
}


//DEPRECATED--------------------------------------------------------------
//remove in future iteration
function addBoard(board) {
    
    var tilesHigh = board.height;
    var tilesWide = board.width;
    
   // console.log(board.height + " " + board.width);
    
    var tileHeight = 12;
    var tileWidth = 18;

    var tileIndex = 0 ;

    var landUseArray = [] ;
    for(var i = 0; i < board.map.length ; i++){
        landUseArray.push(board.map[i].landType[1]) ;
    }

    for (var j = 0; j < tilesHigh; j++) {

        for (var i = 0; i < tilesWide; i++) {

            //var r = Math.floor((Math.random() * 14));

            var tileGeometry = new THREE.BoxGeometry(tileWidth, 0, tileHeight);
         
            var tileMaterial;
         
        if(landUseArray[tileIndex] == 0){
            tileMaterial = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0});
        } else {    
            tileMaterial = new THREE.MeshLambertMaterial({
                map: textureArray[landUseArray[tileIndex]]
            });
        }

            var newTile = new THREE.Mesh(tileGeometry, tileMaterial);
            newTile.position.x = i * tileWidth - (tileWidth * tilesWide)/2;
            newTile.position.y = 0;
            newTile.position.z = j * tileHeight - (tileHeight * tilesHigh)/2;
            
            //Charlie
            newTile.data = board.map[i];

            tiles.push(newTile);

            scene.add(newTile);
            
            tileIndex ++ ;

        }

    }
    
}//end addBoard()
//END DEPRECATED----------------------------------------

function onDocumentMouseMove( event ) {
    
	event.preventDefault();
	
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
	
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = raycaster.intersectObjects(tiles);
	
	if ( intersects.length > 0 && !modalUp) {

		if ( hoveredOver != intersects[ 0 ].object ) {

			if ( hoveredOver ) hoveredOver.material.emissive.setHex( hoveredOver.currentHex );

			hoveredOver = intersects[ 0 ].object;
			hoveredOver.currentHex = hoveredOver.material.emissive.getHex();
		    hoveredOver.material.emissive.setHex( 0x7f7f7f );

		}

	}
	
	renderer.render(scene, camera);
	
}; //onDocumentMouseMove

function onDocumentDoubleClick( event ) {
    
	event.preventDefault();
	
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = raycaster.intersectObjects( tiles );
	
	if( !isShiftDown ){
	
        if ( intersects.length > 0 && !modalUp) {
            
        	var intersect = intersects[ 0 ];
        	
        	//console.log(boardData[currentBoard].map[hoveredOver.mapID].landType[currentYear]);
        	
        	if(boardData[currentBoard].map[hoveredOver.mapID].landType[currentYear] != 0){
        	    
        	    boardData[currentBoard].map[hoveredOver.mapID].landType[currentYear] = painter ;
        	
        	    boardData[currentBoard].map[hoveredOver.mapID].update();
        	    
        		scene.remove(hoveredOver);
        		
                addTile(boardData[currentBoard].map[hoveredOver.mapID]);
                
        	}
        	
        	//console.log(boardData[currentBoard].map[hoveredOver.mapID].landType[currentYear]);
        	
        }
	
	} else {
	    
	        for(var i = 0; i < boardData[currentBoard].map.length; i++){
        
                if(boardData[currentBoard].map[i].landType[currentYear] != 0){
                    scene.remove(tiles[i]);
                    boardData[currentBoard].map[i].landType[currentYear] = painter;
                    boardData[currentBoard].map[i].update();
                    addTile(boardData[currentBoard].map[i]);
                }

            }
	    
	}
	
	renderer.render(scene, camera);
}//end onDocumentMouseDown(event)

function onDocumentKeyDown( event ){
    
    switch( event.keyCode ){
        case 16: isShiftDown = true; break;
    }

}

function onDocumentKeyUp( event ){
    
    switch( event.keyCode ){
        case 16: isShiftDown = false; break;
    }

}

function paintChange(value) {
    
    //change current painter to regular
    var string = "paint" + painter ;
    document.getElementById(string).className = "landSelectorIcon" ;
    
    //change new paiter to current
    string = "paint" + value ;
    document.getElementById(string).className = "landSelectedIcon" ;
    painter = value ;  
  
}

function paintYear(value) {
    
    var string = onYear + "Image";
    document.getElementById(string).className = "yearImage";
    
    string = value + "Image";
    document.getElementById(string).className = "yearSelectedImage";
    onYear = value;
    
}


var toolbarRolled = true ;

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

}

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
    
}


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

    
}

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
    
}

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
    
    //console.log(boardData[currentBoard].precipitation);
    
    boardData[currentBoard].updateBoard();
    
}

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
    
}

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
    
}

function displayLevels(type){
    
    //Totals = new Results(boardData[currentBoard]);
    Totals.update() ;
    
    tilesCopy = [];
    
    for(var i = 0; i < tiles.length; i++){
        
                tiles[i].material.map = textureArray[0];
	            tiles[i].material.emissive.setHex( getHighlightColor(type, tiles[i].mapID) );

    }
    
    renderer.render(scene, camera);
    
};

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
    
    if(type = "drainage"){
        
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
    
    
};

function contaminatedRiver() {
    
    //this is buggy -- still a work-in progress. Maybe the status of the river should be stored in the board for each year...
    
    if(Totals.phosphorusLoad[currentYear] > 1.7){
        river.material.color.setHex("0x663300");
    } else {
        river.material.color.setHex("0x40a4df")
    }
    
}

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

    if(i < tiles.length - 1){
      string = string + '\r\n';
    } else {
      //Do Nothing
    }

  }

  return string;
}

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
        
}

function uploadClicked() {
 
    var files;
 
    $('#file-upload').bind('propertychange change', function (e) {
        files = e.target.files;
        //console.log(files);
    
        if(files[0].name && !files[0].name.match(/\.csv/)){
            alert("Incorrect File Type!");
        }

        var reader = new FileReader();
        
        reader.readAsText(files[0]);
        
        reader.onload = function(e){
            
            var boardFromFile = new GameBoard() ;  
            parseInitial(reader.result);
            propogateBoard(boardFromFile);
            boardData.push(boardFromFile);

            currentBoard++ ;
            transitionToYear(1);
            boardData[currentBoard].updateBoard() ;
    
            //update Results to point to correct board since currentBoard is updated
            Totals = new Results(boardData[currentBoard]);
            
            //clear initData
            initData = [] ;
            
        }
    });
    
}


function animateResults() {
    
 //todo, increased functionality
  document.getElementById("resultsFrame").className = "resultsFrame" ;
   
}

function calculateResults() {
    
    //Totals = new Results(boardData[currentBoard]);
    Totals.update() ;
    
    //contaminatedRiver(Totals);
    
}

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
                string2 += "<tr class='tableHeading'><td><b>Annual Grain</b></td></tr>"
                break;
            case 2:
                string2 += "<tr class='tableHeading'><td><b>Annual Legume</b></td></tr>"
                break;x
            case 4:
                string2 += "<tr class='tableHeading'><td><b>Mixed Fruits and Vegetables</b></td></tr>"
                break;
            case 5:
                string2 += "<tr class='tableHeading'><td><b>Pasture</b></td></tr>"
                break;
           case 7:
                string2 += "<tr class='tableHeading'><td><b>Perrenial Herbaceous (non-pasture)</b></td></tr>"
                break;
            case 11:
                string2 += "<tr class='tableHeading'><td><b>Perrenial Legume</b></td></tr>"
                break;
            case 12:
                string2 += "<tr class='tableHeading'><td><b>Perrenial Wooded</b></td></tr>"
                break;
                        
        }//end switch
        
        string2 += "<tr>"
        
        string2 += "<td>" + nameArray[l] + "</td>"
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>"
            
            var tempString = testArray[l] + "LandUse";
            string2 += ( Math.round(Totals.landUseResults[y][tempString] / Totals.totalArea * 100 * 10  )  / 10 ) + "<br>" ;
            
            string2+= "</td>"
        }//for each year
        
        string2 += "<td>percent</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>"
            
            var tempString = testArray[l] + "LandUse";
            string2 += ( Math.round(Totals.landUseResults[y][tempString] * 10) / 10 ) + "<br>" ;
            
            string2+= "</td>"
        }//for each year
        
        string2 += "<td>acres</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>"
            
            var tempString = testArray[l] + "LandUse";
            string2 += ( Math.round(Totals.landUseResults[y][tempString]  / toMetricFactorArea *10 ) / 10 ) + "<br>" ;
            
            string2+= "</td>"
            
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
                string2 += "<tr class='tableHeading'><td><b>Habitat</b></td></tr>"
                break;
            case 2:
                string2 += "<tr class='tableHeading'><td><b>Soil Quality</b></td></tr>"
                break;x
            case 4:
                string2 += "<tr class='tableHeading'><td><b>Water Quality</b></td></tr>"
                break;
        }//end switch
        
        string2 += "<tr>"
        
        string2 += "<td>" + nameArray[l] + "</td>"
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>"
            
            var tempString = testArray[l] + "Score";
            string2 += ( Math.round(Totals[tempString][y] * 10  )  / 10 ) + "<br>" ;
            
            string2+= "</td>"
        }//for each year
        
        string2 += "<td>(out of 100)</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>"
            
            var tempString = testArray[l];
            string2 += ( Math.round(Totals[tempString][y] * 10) / 10 ) + "<br>" ;
            
            string2+= "</td>"
        }//for each year
        
        if(l<2) string2 += "<td>pts</td>" ;
        if(2<= l && l < 4) string2 +="<td>tons</td>" ;
        if(4<= l && l < 5) string2 +="<td>ppm</td>" ;
        if(5<= l && l < 8) string2 +="<td>tons</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>"
            
            var tempString = testArray[l];
            string2 += ( Math.round(Totals[tempString][y] * conversionArray[l] * 10 ) / 10 ) + "<br>" ;
            
            string2+= "</td>"
            
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
                string2 += "<tr class='tableHeading'><td><b>Yield</b></td></tr>"
                break;
        }//end switch
        
        string2 += "<tr>"
        
        string2 += "<td>" + nameArray[l] + "</td>"
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>"
            
            var tempString = testArray[l] + "Score";
            string2 += ( Math.round(Totals.yieldResults[y][tempString] * 10  )  / 10 ) + "<br>" ;
            
            string2+= "</td>"
        }//for each year
        
        string2 += "<td>(out of 100)</td>" ;
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>"
            
            var tempString = testArray[l];
            string2 += ( Math.round(Totals.yieldResults[y][tempString] * 10) / 10 ) + "<br>" ;
            
            string2+= "</td>"
        }//for each year
       
        if(l < 2 ) string2 += "<td>bu</td>" ;  
        if(l == 2 ) string2 += "<td>tons</td>" ; 
        if(l == 3) string2 += "<td>animals</td>" ;
        if(4<= l && l < 7) string2 += "<td>tons</td>" ;
        if(l == 7 ) string2 += "<td>board-ft</td>" ;
        if(l == 8 ) string2 += "<td>tons</td>" ; 
        
        for(var y=1; y<=upToYear;y++){
            string2+= "<td>"
            
            var tempString = testArray[l];
            string2 += ( Math.round(Totals.yieldResults[y][tempString] * conversionArray[l] * 10 ) / 10 ) + "<br>" ;
            
            string2+= "</td>"
            
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
    
    string2 += "<tr><td>Precipitation</td>"
    
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
    
    //THIS SECTION DOES NOT APPEAR TO BE WORKING, CHECK
    
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
    
    
}

function showCredits() {
    
    document.getElementById('creditsFrame').style.display = "block" ;
    document.getElementById('closeCredits').style.display = "block" ;
    
}

function closeCreditFrame() {

    document.getElementById('creditsFrame').style.display = "none" ;
    document.getElementById('closeCredits').style.display = "none" ;
    
}