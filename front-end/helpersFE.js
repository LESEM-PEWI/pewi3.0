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
        
        var tileGeometry = new THREE.BoxGeometry(tileWidth, 0, tileHeight);
        
        if(tile.landType[currentYear] == 0){
            tileMaterial = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0});
        } else {
            tileMaterial = new THREE.MeshLambertMaterial({ map: textureArray[tile.landType[currentYear]] });
        }
        
        if(tile.streamNetwork == 1 && currentRow != tile.row){
            riverPoints.push(new THREE.Vector3(tile.column * tileWidth - (tileWidth * tilesWide)/2, 1, tile.row * tileHeight - (tileHeight * tilesHigh)/2));
            currentRow = tile.row;
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
		    hoveredOver.material.emissive.setHex( 0x00ff00 );

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
    
    console.log(boardData[currentBoard].precipitation);
    
    boardData[currentBoard].updateBoard();
    
}

function switchConsoleTab(value){

    if(value==1){
        document.getElementById('terrainImg').className = "imgSelected" ;
        document.getElementById('precipImg').className = "imgNotSelected" ;
        document.getElementById('levelsImg').className = "imgNotSelected";
        document.getElementById('painterTab').style.display = "block";
        document.getElementById('precipTab').style.display = "none" ;
        document.getElementById('levelsTab').style.display = "none";
    }
    
    if(value==2){
        document.getElementById('terrainImg').className = "imgNotSelected" ;
        document.getElementById('precipImg').className = "imgSelected" ;
        document.getElementById('levelsImg').className = "imgNotSelected";
        document.getElementById('painterTab').style.display = "none";
        document.getElementById('precipTab').style.display = "block" ;
        document.getElementById('levelsTab').style.display = "none";
    }
    
    if(value==3){
        document.getElementById('terrainImg').className = "imgNotSelected" ;
        document.getElementById('precipImg').className = "imgNotSelected" ;
        document.getElementById('levelsImg').className = "imgSelected";
        document.getElementById('painterTab').style.display = "none";
        document.getElementById('precipTab').style.display = "none" ;
        document.getElementById('levelsTab').style.display = "block";
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
    
    Totals = new Results(boardData[currentBoard]);
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
        
        console.log(erosionSeverity);
        
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
    
    
};


function animateResults() {
    
 //todo, increased functionality
  document.getElementById("resultsFrame").className = "resultsFrame" ;
   
}

function calculateResults() {
    
    toMetricFactorArea = 2.471 ;
    
    Totals = new Results(boardData[currentBoard]);
    Totals.update() ;
    
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