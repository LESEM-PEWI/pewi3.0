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
        
        var tileGeometry = new THREE.BoxGeometry(tileWidth, 0, tileHeight);
        
        if(tile.landType[currentYear] == 0){
            tileMaterial = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0});
        } else {
            tileMaterial = new THREE.MeshLambertMaterial({ map: textureArray[tile.landType[currentYear]] });
        }
        
        var newTile = new THREE.Mesh(tileGeometry, tileMaterial);
        newTile.position.x = tile.column * tileWidth - (tileWidth * tilesWide)/2;
        newTile.position.y = 0;
        newTile.position.z = tile.row * tileHeight - (tileHeight * tilesHigh)/2;
        
        newTile.mapID = tile.id - 1;
        
        tile.graphics = newTile;
        
        tiles.push(tile.graphics);
        
        scene.add(tile.graphics);
    
};


//DEPRECATED--------------------------------------------------------------
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
			hoveredOver.material.emissive.setHex( 0xff0000 );

		}

	}
	
	renderer.render(scene, camera);
	
}; //onDocumentMouseMove

function onDocumentMouseDown( event ) {
    
	event.preventDefault();
	
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = raycaster.intersectObjects( tiles );
	
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
			
		renderer.render(scene, camera);
	}
}//end onDocumentMouseDown(event)

function paintChange(value) {
    
    //change current painter to regular
    var string = "paint" + painter ;
    document.getElementById(string).className = "landSelectorIcon" ;
    
    //change new paiter to current
    string = "paint" + value ;
    document.getElementById(string).className = "landSelectedIcon" ;
    painter = value ;  
  
}

var toolbarRolled = true ;

function resultsStart() {
   

    
    //setup Screen Appropriately
    modalUp=true;
    document.getElementById("resultsButton").onmouseout = "";
    document.getElementById("resultsButton").onmouseover = "";
    document.getElementById("resultsButton").onclick = function() {resultsEnd() ;}; 
    document.getElementById("toolsButton").onclick = "";
    
    document.getElementById("resultsButton").className = "resultsButtonFar" ;
    if(document.getElementById("landUseConsole").className != "landUseConsoleRolled"){
       roll(1) ;
       toolbarRolled = false;
    }
    

    //functions that update results and display them appropriately
    calculateResults();
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
     toolbarRolled = true;
    }
    else{
        document.getElementById("landUseConsole").className = "landUseConsole";
        document.getElementById("toolsButton").className = "toolsButton" ;
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
        
        
    }//right resaults button
}

function animateResults() {
    
 //todo, increased functionality
  document.getElementById("resultsFrame").className = "resultsFrame" ;
   
}

function calculateResults() {
    
    toMetricFactorArea = 2.471 ;
    
    Totals = new Results(boardData[currentBoard]);
    Totals.update() ;
    
    //document.getElementById('resultsFrame').contentWindow.document.getElementById('contents').innerHTML = "WORKS";
    
    var testArray = ["conventionalCorn","conservationCorn"];
    
    var string2 = "<table class='resultsTable'>";
    
    for(var l = 0 ; l< testArray.length ; l++ ){
        
        string2 += "<tr>"
        
        string2 += "<td>" + testArray[l] + "</td>"
        
        for(var y=1; y<=3;y++){
            string2+= "<td>"
            
            var tempString = testArray[l] + "LandUse";
            string2 += ( Totals.landUseResults[y][tempString] / Totals.totalArea * 100  ) + "<br>" ;
            
            string2+= "</td>"
        }//for each year
        
        string2 += "<td>percent</td>" ;
        
        for(var y=1; y<=3;y++){
            string2+= "<td>"
            
            var tempString = testArray[l] + "LandUse";
            string2 += ( Totals.landUseResults[y][tempString] ) + "<br>" ;
            
            string2+= "</td>"
        }//for each year
        
        string2 += "<td>acres</td>" ;
        
        for(var y=1; y<=3;y++){
            string2+= "<td>"
            
            var tempString = testArray[l] + "LandUse";
            string2 += ( Totals.landUseResults[y][tempString]  / toMetricFactorArea ) + "<br>" ;
            
            string2+= "</td>"
            
        }//for each year
        string2 += "<td>hectares</td></tr>" ;
        
        
    }
    
    var string = "Precipitation:" + "<BR>" +
    "Year 0: " + boardData[currentBoard].precipitation[0] + "<BR>" +
    "Year 1: " + boardData[currentBoard].precipitation[1] + "<BR>" +
    "Year 2: " + boardData[currentBoard].precipitation[2] + "<BR>" +
    "Year 3: " + boardData[currentBoard].precipitation[3] + "<BR>" +
    "<BR>" + "<BR>" +
    "Total Area: " + Totals.totalArea + "<BR>" +
    "<BR>" + "<BR>" +
    "Carbon Sequestration: " + "<BR>" +
    "Year 1: " + Totals.carbonSequestration[1] + "<BR>" +
    "Year 2: " + Totals.carbonSequestration[2] + "<BR>" +
    "Year 2: " + Totals.carbonSequestration[3] + "<BR>" +
    "<BR>" + "<BR>" +
    "Erosion: " + "<BR>" +
    "Year 1: " + Totals.grossErosion[1] + "<BR>" +
    "Year 2: " + Totals.grossErosion[2] + "<BR>" +
    "Year 3: " + Totals.grossErosion[3] + "<BR>" +
    "<BR>" + "<BR>" +
    "Game Wildlife Points: " + "<BR>" +
    "Year 1: " + Totals.gameWildlifePoints[1] + "<BR>" +
    "Year 2: " + Totals.gameWildlifePoints[2] + "<BR>" +
    "Year 3: " + Totals.gameWildlifePoints[3] + "<BR>" +
    "<BR>" + "<BR>" +
    "Biodiversity: " + "<BR>" +
    "Year 1: " + Totals.biodiversityPoints[1] + "<BR>" +
    "Year 2: " + Totals.biodiversityPoints[2] + "<BR>" +
    "Year 3: " + Totals.biodiversityPoints[3] + "<BR>" +
    "<BR>" + "<BR>" +
    "Phosphorus Load: " + "<BR>" +
    "Year 1: " + Totals.phosphorusLoad[1] + "<BR>" +
    "Year 2: " + Totals.phosphorusLoad[2] + "<BR>" +
    "Year 3: " + Totals.phosphorusLoad[3] + "<BR>" +
    "<BR>" + "<BR>" +
    "Nitrate Load: " + "<BR>" +
    "Year 1: " + Totals.nitrateConcentration[1] + "<BR>" +
    "Year 2: " + Totals.nitrateConcentration[2] + "<BR>" +
    "Year 3: " + Totals.nitrateConcentration[3] + "<BR>" +
    "<BR>" + "<BR>" +
    "Sediment Delivery: " + "<BR>" +
    "Year 1: " + Totals.sedimentDelivery[1] + "<BR>" +
    "Year 2: " + Totals.sedimentDelivery[2] + "<BR>" +
    "Year 3: " + Totals.sedimentDelivery[3] + "<BR>" +
    "<BR>" + "<BR>" +
    "Yield Totals: " + "<BR>" +
    "Corn: " + Totals.yieldResults[1].cornGrainYield + "<BR>" +
    "Soy: " + Totals.yieldResults[1].soybeanYield + "<BR>" +
    "Alfalfa: " + Totals.yieldResults[1].alfalfaHayYield + "<BR>" +
    "Grass Hay: " + Totals.yieldResults[1].grassHayYield + "<BR>" +
    "Wood: " + Totals.yieldResults[1].woodYield + "<BR>" +
    "Cattle: " + Totals.yieldResults[1].cattleYield + "<BR>" +
    "Herbs: " + Totals.yieldResults[1].herbaceousPerennialBiomassYield + "<BR>" +
    "Short Woody: " + Totals.yieldResults[1].shortRotationWoodyBiomassYield + "<BR>" +
    "Fruits + Veggies: " + Totals.yieldResults[1].mixedFruitsAndVegetablesYield + "<BR>" +
    "<BR>" + "<BR>" +
    "Land Use Totals: " + "<BR>" +
    "Conventional Corn: " + Totals.landUseResults[1].conventionalCornLandUse + "<BR>" +
    "Conservation Corn: " + Totals.landUseResults[1].conservationCornLandUse + "<BR>" +
    "Conventional Soybean: " + Totals.landUseResults[1].conventionalSoybeanLandUse + "<BR>" +
    "Conservation Soybean: " + Totals.landUseResults[1].conservationSoybeanLandUse + "<BR>" +
    "Alfalfa: " + Totals.landUseResults[1].alfalfaLandUse + "<BR>" +
    "Permanent Pasture: " + Totals.landUseResults[1].permanentPastureLandUse + "<BR>" +
    "Rotational Grazing: " + Totals.landUseResults[1].rotationalGrazingLandUse + "<BR>" +
    "Grass Hay: " + Totals.landUseResults[1].grassHayLandUse + "<BR>" +
    "Prairie: " + Totals.landUseResults[1].prairieLandUse + "<BR>" +
    "Conservation Forest: " + Totals.landUseResults[1].conservationForestLandUse + "<BR>" +
    "Conventional Forest: " + Totals.landUseResults[1].conventionalForestLandUse + "<BR>" +
    "Herbaceous Perennial Bioenergy: " + Totals.landUseResults[1].herbaceousPerennialBioenergyLandUse + "<BR>" +
    "Short Rotation Woody Bioenergy: " + Totals.landUseResults[1].shortRotationWoodyBioenergyLandUse + "<BR>" +
    "Wetland: " + Totals.landUseResults[1].wetlandLandUse + "<BR>" +
    "Mixed Fruits and Veggies: " + Totals.landUseResults[1].mixedFruitsVegetablesLandUse + "<BR>" +
    "<BR>" + "<BR>" +
    "<STRONG>" + "Scores (100): " + "</STRONG>" + "<BR>" + "<BR>" +
    "Yield Score: " + "<BR>" +
    "Corn: " + 100 * Totals.yieldResults[3].cornGrainYield / boardData[currentBoard].maximums.cornMax + "<BR>" +
    "Soy: " + 100 * Totals.yieldResults[3].soybeanYield / boardData[currentBoard].maximums.soybeanMax + "<BR>" +
    "Alfalfa: " + 100 * Totals.yieldResults[3].alfalfaHayYield / boardData[currentBoard].maximums.alfalfaMax + "<BR>" +
    "Hay: " + 100 * Totals.yieldResults[3].grassHayYield / boardData[currentBoard].maximums.grassHayMax + "<BR>" +
    "Wood: " + 100 * Totals.yieldResults[3].woodYield / boardData[currentBoard].maximums.woodMax + "<BR>" +
    "Cattle: " + 100 * Totals.yieldResults[3].cattleYield / boardData[currentBoard].maximums.cattleMax + "<BR>" +
    "Herbs: " + 100 * Totals.yieldResults[3].herbaceousPerennialBiomassYield / boardData[currentBoard].maximums.herbaceousPerennialBiomassMax + "<BR>" +
    "Short Woody: " + 100 * Totals.yieldResults[3].shortRotationWoodyBiomassYield / boardData[currentBoard].maximums.shortRotationWoodyBiomassMax + "<BR>" +
    "Fruits + Veggies: " + 100 * Totals.yieldResults[3].mixedFruitsAndVegetablesYield / boardData[currentBoard].maximums.mixedFruitsAndVegetablesMax + "<BR>" +
    "<BR>" + "<BR>" +
    "Game Wildlife Score: " + "<BR>" +
    "Year 1: " + Totals.gameWildlifePoints[1] * 10 + "<BR>" +
    "Year 2: " + Totals.gameWildlifePoints[2] * 10 + "<BR>" +
    "Year 3: " + Totals.gameWildlifePoints[3] * 10 + "<BR>" +
    "<BR>" + "<BR>" +
    "Biodiversity Score: " + "<BR>" +
    "Year 1: " + Totals.biodiversityPoints[1] * 10 + "<BR>" +
    "Year 2: " + Totals.biodiversityPoints[2] * 10 + "<BR>" +
    "Year 3: " + Totals.biodiversityPoints[3] * 10 + "<BR>" +
    "<BR>" + "<BR>" +
    "Carbon Score: " + "<BR>" +
    "Year 1: " + 100 * ((Totals.carbonSequestration[1] - boardData[currentBoard].minimums.carbonMin) / (boardData[currentBoard].maximums.carbonMax - boardData[currentBoard].minimums.carbonMin)) + "<BR>" +
    "Year 2: " + 100 * ((Totals.carbonSequestration[2] - boardData[currentBoard].minimums.carbonMin) / (boardData[currentBoard].maximums.carbonMax - boardData[currentBoard].minimums.carbonMin)) + "<BR>" +
    "Year 3: " + 100 * ((Totals.carbonSequestration[3] - boardData[currentBoard].minimums.carbonMin) / (boardData[currentBoard].maximums.carbonMax - boardData[currentBoard].minimums.carbonMin)) + "<BR>" +
    "<BR>" + "<BR>" +
    "Erosion Score: " + "<BR>" +
    "Year 1: " + 100 * ((boardData[currentBoard].maximums.erosionMax - Totals.grossErosion[1]) / (boardData[currentBoard].maximums.erosionMax - boardData[currentBoard].minimums.erosionMin)) + "<BR>" +
    "Year 2: " + 100 * ((boardData[currentBoard].maximums.erosionMax - Totals.grossErosion[2]) / (boardData[currentBoard].maximums.erosionMax - boardData[currentBoard].minimums.erosionMin)) + "<BR>" +
    "Year 3: " + 100 * ((boardData[currentBoard].maximums.erosionMax - Totals.grossErosion[3]) / (boardData[currentBoard].maximums.erosionMax - boardData[currentBoard].minimums.erosionMin)) + "<BR>" +
    "Erosion Min " + boardData[currentBoard].minimums.erosionMin + "<BR>" +
    "Erosion Max: " + boardData[currentBoard].maximums.erosionMax + "<BR>" +
    "<BR>" + "<BR>" +
    "Phosphorus Score: " + "<BR>" +
    "Year 1: " + 100 * ((boardData[currentBoard].maximums.phosphorusMax - Totals.phosphorusLoad[1]) / (boardData[currentBoard].maximums.phosphorusMax - boardData[currentBoard].minimums.phosphorusMin)) + "<BR>" +
    "Year 2: " + 100 * ((boardData[currentBoard].maximums.phosphorusMax - Totals.phosphorusLoad[2]) / (boardData[currentBoard].maximums.phosphorusMax - boardData[currentBoard].minimums.phosphorusMin)) + "<BR>" +
    "Year 3: " + 100 * ((boardData[currentBoard].maximums.phosphorusMax - Totals.phosphorusLoad[3]) / (boardData[currentBoard].maximums.phosphorusMax - boardData[currentBoard].minimums.phosphorusMin)) + "<BR>" +
    "Phosphorus Min " + boardData[currentBoard].minimums.phosphorusMin + "<BR>" +
    "Phosphorus Max: " + boardData[currentBoard].maximums.phosphorusMax + "<BR>" +
    "<BR>" + "<BR>" +
    "Nitrate Score: " + "<BR>" +
    "Year 1: " + 100 * ((boardData[currentBoard].maximums.nitrateMax - Totals.nitrateConcentration[1]) / (boardData[currentBoard].maximums.nitrateMax - boardData[currentBoard].minimums.nitrateMin)) + "<BR>" +
    "Year 2: " + 100 * ((boardData[currentBoard].maximums.nitrateMax - Totals.nitrateConcentration[2]) / (boardData[currentBoard].maximums.nitrateMax - boardData[currentBoard].minimums.nitrateMin)) + "<BR>" +
    "Year 3: " + 100 * ((boardData[currentBoard].maximums.nitrateMax - Totals.nitrateConcentration[3]) / (boardData[currentBoard].maximums.nitrateMax - boardData[currentBoard].minimums.nitrateMin)) + "<BR>" +
    "<BR>" + "<BR>" +
    "Sediment Delivery Score: " + "<BR>" +
    "Year 1: " + 100 * ((boardData[currentBoard].maximums.sedimentMax - Totals.sedimentDelivery[1]) / (boardData[currentBoard].maximums.sedimentMax - boardData[currentBoard].minimums.sedimentMin)) + "<BR>" +
    "Year 2: " + 100 * ((boardData[currentBoard].maximums.sedimentMax - Totals.sedimentDelivery[2]) / (boardData[currentBoard].maximums.sedimentMax - boardData[currentBoard].minimums.sedimentMin)) + "<BR>" +
    "Year 3: " + 100 * ((boardData[currentBoard].maximums.sedimentMax - Totals.sedimentDelivery[3]) / (boardData[currentBoard].maximums.sedimentMax - boardData[currentBoard].minimums.sedimentMin)) + "<BR>" +
    "Sediment Min: " + boardData[currentBoard].minimums.sedimentMin + "<BR>" +
    "Sediment Max: " + boardData[currentBoard].maximums.sedimentMax + "<BR>"
    
    document.getElementById('resultsFrame').contentWindow.document.getElementById('contents').innerHTML = string2;
    

}