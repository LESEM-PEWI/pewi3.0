// this file interfaces with the optimization designer page
// It is used to narrow parameters for optimizing a PEWI map

var optGameBoard; //Game board used for optimization
var optName; //Name of an uploaded optimization file (if one is uploaded, otherwise null)
var usableTiles = []; // Array of usable tiles for the optimization
var tilePos = []; //Array of possible tiles for the optimization (After individual tile restrictions are set)
var totalPoss; // # of possible PEWI maps the user can generate for the optimization
var totExp; //Exponential component of total
var variableNum = 0; //Number of variables in the custom equation
var seedNum = 1; //The seed number used for creating map tiles
var previousSeedNum; //The seed number used during the previous optimization (used when uploading optimizations only)
var randomNumber; //Used for seeding
var currentRandom = 1; //# of random numbers (x10^3) the usr has generated (used when uploading optimizations only) 
var usableLandTypes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] // Array of usable land type for the optimization
var fitCounter = 0; //Keeps track of the amount of maps that fit the criteria
var usableChoices = ["Conventional Corn Area","Conservational Corn Area","Conventional Soybean Area","Conservational Soybean Area",
"Mixed Fruits and Vegetables Area","Permanent Pasture Area","Rotational Grazing Area","Grass Hay Area","Switchgrass Area",
"Prairie Area","Wetland Area","Alfalfa Area","Conventional Forest Area","Conservational Forest Area",
"Short Rotation Woody Bioenergy Area"]; //List of possible land type areas (in string format)
var usableLandChoices = ["Conventional Corn","Conservational Corn","Conventional Soybean","Conservational Soybean",
"Mixed Fruits and Vegetables","Permanent Pasture","Rotational Grazing","Grass Hay","Switchgrass",
"Prairie","Wetland","Alfalfa","Conventional Forest","Conservational Forest",
"Short Rotation Woody Bioenergy"]; //List of possible land types (in string format)
var usableYieldChoices = ["cornGrainYieldScore","soybeanYieldScore","mixedFruitsVegetablesYieldScore","cattleYieldScore",
"alfalfaHayYieldScore","grassHayYieldScore","grassHayYieldScore","woodYieldScore","shortRotationWoodyBiomassYieldScore"]; //List of possible 
// yield scores (in string format)
var secondaryChoices = ["All strategic wetlands selected","Require stream buffers","No wetlands on slope",
"No corn or soy in Buckney 1636 and Gara-Armstrong 993E2","Wetlands only in strategic wetland locations",
"Remove currently non-profitable land uses","Soils over 14 Mg corn yield are not prairie"];
var ecosystemChoices = ["Game Wildlife","Biodiversity","Carbon Sequestration","Erosion Control",
"Nitrate Pollution Control","Phosphorus Pollution Control","Sediment Control"]; // Array of Ecosystem score types
var weightNum = 0; //Number of weights added to the optimization
var primaryCon = []; //Array of constraints (in order of their listing in optimizationDesigner.html). If user does not provide constraints for a 
// yield, value will be set to null
var resultsCon = []; //Array of results for constraints
var resultsConArr = []; //Array of result figures
var boardArr = []; //Array of boards that fit the constraints set by the user as well as the desired score in front of each GameBoard
var resultsArr = []; //Array of results that fit the constraints set by the user
var results; //Results object. Used for comparing constraints
var yieldScore; //The yield parameter to sort GameBoards by
var currentTile = 0; //Variable used for indexing the current tile's position
var prng; //Creates a new Random Number Generator (RNG) [Default seed is 1]
var optimizationData; //Stores raw uploaded optimization data
var importedOpt = false; //Determines if the current page was loaded using a previous optimization
var wetStrat = false;//Boolean to determine if wetlands are the only land use allowed in strategic land plots
var noWetSlope = false; //Boolean to determine if wetlands are allowed on sloped land plots
var buckGaraRestrict = false; //Boolean to determine if corn and soy are restrict from Buckney 1636 and Gara-Armstrong 993E2
var wetlandStrat = false; //Boolean to determine if wetlands can only be placed in strategic wetland locations
var cornNoPrairie = false; //Boolean to determine if prairie should be rescricted with soils over 14 Mg corn yield

//Clears the form [Prompted by the "reset" button]
function clearFields() {
	var inputs = document.getElementsByTagName("input");
    for(var i = 0; i < inputs.length; i++)
    {
    	if(inputs[i].type == "checkbox")
    	{
    		document.getElementById(inputs[i].id).checked = false;
    	}
    	if(inputs[i].type == "text" || inputs[i].type == "file")
    	{
    		document.getElementById(inputs[i].id).value = '';
    	}
    	if(inputs[i].type == "number")
    	{
        	document.getElementById(inputs[i].id).value = (inputs[i].id).value;
        }
    }
    var inputs = [];
    inputs = document.getElementsByTagName("select");
    for(var i = 0; i < inputs.length; i++)
    {
    	document.getElementById(inputs[i].id).selectedIndex = 0;
    }
    document.getElementById('totalPos').innerHTML = '';
    document.getElementById('middle').style.visibility = "hidden";
    document.getElementById('totalExp').innerHTML = '';
    document.getElementById('equation').style.visibility = "hidden";
    document.getElementById('weight').style.visibility = "hidden";
    document.getElementById('iterCalc').style.visibility = "hidden";
    document.getElementById('seedNum').style.visibility = "hidden";
} //end clearFields()

//Adds/Removes/Changes a particular yield condition due to secondary constraints
function changeYield(givenYield) {
	switch(givenYield) {
		//Indexing used from LandUseType object in HelperObjects.js
		//For checkbox #0: Wetland land use only for Strategic wetlands
		case 0:
			if(stratWet.checked) {
				wetStrat = true;
			}
			else {
				wetStrat = false;
			}
			break;
		//For checkbox #1: Deletes Conv Corn, Conv Soy, Alfalfa, and Perm Pasture from usable land types
		case 1:
			if(streamBuff.checked) {
				usableLandTypes.splice(usableLandTypes.indexOf(1),1);
				usableLandTypes.splice(usableLandTypes.indexOf(3),1);
				usableLandTypes.splice(usableLandTypes.indexOf(5),1);
				usableLandTypes.splice(usableLandTypes.indexOf(6),1);
			}
			else {
				usableLandTypes.push(1);
				usableLandTypes.push(3);
				usableLandTypes.push(5);
				usableLandTypes.push(6);
				usableLandTypes.sort(sortNumber);
			}
			break;
		//For checkbox #2: Restricts wetlands from being on sloped land plots
		case 2: 
			if(wetlandSlope.checked) {
				noWetSlope = true;
			}
			else {
				noWetSlope = false;
			}
			break;
		//For checkbox #3: Restricts corn and soy landuse types in Buckney 1636 and Gara-Armstrong 993E2
		case 3:
			if(noCornSoy.checked) {
				buckGaraRestrict = true;
			}
			else {
				buckGaraRestrict = false;
			}
			break;
		//For checkbox #4: Wetlands only placed in strategic wetland plots
		case 4:
			if(wetlandOnlyStrat.checked) {
				wetlandStrat = true;
			}
			else {
				wetlandStrat = false;
			}
			break;
		//For checkbox #5: Remove non-profitable land type uses
		case 5:
			if(removeNonProfit.checked) {
				usableLandTypes.splice(usableLandTypes.indexOf(12),1);
				usableLandTypes.splice(usableLandTypes.indexOf(13),1);
			}
			else {
				usableLandTypes.push(12);
				usableLandTypes.push(13);
				usableLandTypes.sort(sortNumber);
			}
			break;
		//For checkbox #6: Restrict prairie with soils where corn yield over 14 Mg
		case 6:
			if(soilNoPrairie.checked) {
				cornNoPrairie = true;
			}
			else {
				cornNoPrairie = false;
			}
			break;
	}
} //end changeYield()

//Helps organize the list of land types
function sortNumber(a,b) {
	return a-b;
} //end sortNumber()

//Toggles the custom equation feature on/off
function toggleEquation() {
	if(document.getElementById("equation").style.visibility == "hidden") {
		document.getElementById("equation").style.visibility = "visible";
		addVariable();
		addVariable();
	} else {
		document.getElementById("equation").style.visibility = "hidden";
		document.getElementById("addVar").innerHTML = "";
		variableNum = 0;
	}
} //end toggleEquation()

//Toggles the custom weight feature on/off
function toggleWeight() {
	if(document.getElementById("weight").style.visibility == "hidden") {
		document.getElementById("weight").style.visibility = "visible";
		addWeight();
	} else {
		document.getElementById("weight").style.visibility = "hidden";
		document.getElementById("addW").innerHTML = "";
		weightNum = 0;
	}
} //end toggleWeight()

//Toggles the custom seed feature on/off
function toggleSeed() {
	if(document.getElementById("seed").style.visibility == "hidden") {
		document.getElementById("seed").style.visibility = "visible";
		document.getElementById("seedNum").style.visibility = "visible";
	} else {
		document.getElementById("seed").style.visibility = "hidden";
		document.getElementById("seedNum").style.visibility = "hidden";
	}
}

//Removes a variable from the custom equation
function removeVariable() {
	if(variableNum>2) {
		document.getElementById(variableNum).remove();
		variableNum--;
	}
} //end removeVariable()

//Adds a variable to the custom equation
function addVariable() {
	variableNum++;
	var tempDiv = document.createElement("div");
	tempDiv.id = variableNum;
	if(variableNum>1) {
		tempDiv.innerHTML = " + "
	}
	tempDiv.innerHTML += addCoefficient() + addParameter();
	document.getElementById("addVar").appendChild(tempDiv);
} //end addVariable()

//Adds the coefficient to the given variable
function addCoefficient() {
	return "<input id='c"+variableNum+"' class='coefficient' type='number' min='0'></input>"
} //end addCoefficient()

//Adds the parameter to the given variable
function addParameter(givenCustom) {
	var parString;
	if(givenCustom=="w") {
		parString = "<select id='ws"+weightNum+"' class='weights'>"
	} else {
		parString = "<select id='s"+variableNum+"' class='variable'>"
	}
	for(var i = 0; i < usableChoices.length; i++) {
		parString += "<option value='"+usableChoices[i]+"''>"+usableChoices[i]+"</option>";
	}
	parString += "</select><br>";
	return parString;
} //end addParameter()

//Removes a weighted constraint
function removeWeight() {
	if(weightNum>1) {
		document.getElementById(weightNum).remove();
		weightNum--;
	}
} //end removeWeight()

//Adds a weighted constraint
function addWeight() {
	weightNum++;
	var tempDiv = document.createElement("div")
	tempDiv.id = weightNum;
	tempDiv.innerHTML += addParameter("w") + addRank();
	document.getElementById("addW").appendChild(tempDiv);
} //end addWeight()

//Adds a rank selector for the parameter
function addRank() {
	var parString = "<select id='w"+weightNum+"' class='ranks'>";
	for(var i = 1; i < 16; i++) {
		parString += "<option value='"+i+"'>"+i+"</option>";
	}
	return parString;
} //end addRank()

//Creates a CSV file for your selected constraints [Runs the optimization trials]
//
//
// Note: This method is extremely memory intensive, as it runs thousands of possible map calculations at once. 
// [ Use caution when tampering with this method ]
//
function createOptimization() {
	//First, populate the necessary arrays and display the total possible options to the user
	totalIterations();
	//Create a MersenneTwister object (Basically a random number generator seed, since JavaScript doesn't inheritly let you do so)
	// This allows the user to replicate their previous results, as well as leave off where they stopped if they decide to come back later
	if(document.getElementById('seed').style.visibility == "visible" && document.getElementById('seedNum').value!="") {
		seedNum = document.getElementById('seedNum').value;
	}
	prng = new MersenneTwister(seedNum);
	//Clear previous arrays
	primaryCon = [];
	resultsCon = [];
	//Don't clear the arrays if you imported a previous optimization
	if(!importedOpt) {
		boardArr = [];
		resultsArr = [];
	} else {
		//If the seed wasn't switch from the previous optimization, fast-forward through the seed generation
		if(previousSeedNum == seedNum) {
			for(var i = 0; i < currentRandom*1000; i++) {
				randomNumber = prng.genrand_real1();
			}
			currentRandom++;
		}
	}
	//Kept at 1000 iterations for now (we don't want to crash the browser)
	document.getElementById('iterCalc').style.visibility = "visible";
	for(var i = 0; i<1000; i++) {
		//Generates a board based of the primary constraints using the MersenneTwister object
		generateBoard();
		//Create a results object for seeing if the board is possible using the given constraints
		results = new Results(optGameBoard);
		//True: The board works and can be added to the GameBoard array
		//False: The board doesn't fit the constraints, and cannot be added to the GameBoard array
		var expBoolean = checkParameters();
		if(expBoolean) {
			console.log("The GameBoard works!");
			fitCounter++;
			//...Should we add it, though? (Check and see if the score is high enough)
			checkScore(optGameBoard, results);
		}
	}
	//If the user wanted to weigh certain parameters (A custom parameter)
	if(document.getElementById("weight").style.visibility == "visible") {
		//sortBoards() is a secondary sorter, which sorts GameBoards when they have identical yield scores
		//This method only triggers when you are doing optimization on extremely large scales
		sortBoards();
	}
	//Once the amount of iterations desired has been reached, the optimization stops and exports the data it found for the user to download
	console.log("Optimization done");
	document.getElementById('numIter').innerHTML = fitCounter;
	alert("Found "+document.getElementById('numIter').innerHTML+" possible PEWI maps!");
	exportOptimization();
} //end createOptimization()

//This method decides if the given GameBoard (which meets all of the criteria set by the user) has a higher enough score to be in the top 3
function checkScore(givenBoard, givenResults) {
	//Obtains the yield score to compare GameBoards
	yieldScore = retrieveYieldScore(document.getElementById("sorter").value, results);
	//Add it to the boardArr if there aren't enough
	if(boardArr.length<3) {
		//Makes a unique copy (not a reference) of the current GameBoard
		var copy = JSON.parse(JSON.stringify( optGameBoard )); 
		//Insert the objects into their respective arrays
		boardArr.push([yieldScore, copy]);
		resultsArr.push([yieldScore, results]);
		console.log("GameBoard added to array [Initial add]");
	//Otherwise...
	} else {
		var lowBoard = boardArr[boardArr.length-1]
		if(yieldScore > lowBoard[0]) {
			//Get rid of the lowest scoring board
			boardArr.splice(boardArr.length-1,1);
			resultsArr.splice(resultsArr.length-1,1);
			//Makes a unique copy (not a reference) of the current GameBoard
			var copy = JSON.parse(JSON.stringify( optGameBoard )); 
			//Insert the objects into their respective arrays
			boardArr.push([yieldScore, copy]);
			resultsArr.push([yieldScore, results]);
			console.log("GameBoard added to array [Score supersecedes lowest score]");
		}
	}
	//Reorganizes the order of GamerBoards and Result objects in their arrays based on their score ranking
	resultsArr.sort(function(a, b) { return a[0]-b[0]})
	boardArr.sort(function(a, b) { return a[0]-b[0]})
	boardArr.reverse();
	resultsArr.reverse();
} //end checkScore(givenBoard)

//Generates a board based on a randomized seed of numbers
function generateBoard() {
	//Reset the currentTile value (no longer parsing through the tiles)
	currentTile = 0; 
	//Go through each GameBoard map tile
	for(var i = 0; i<optGameBoard.map.length; i++) {
		if(optGameBoard.map[i].baseLandUseType!=0) {
			assignTile(optGameBoard.map[i]);
			currentTile++;
		}
		optGameBoard.map[i].update(1);
	}
} //end generateBoard()

//Assigns a GameBoard tile a random land use (that is allowed for that tile) based on a randomized seed
function assignTile(givenTile) {
	//Retrieves the total # of possible land types the tile can be
	var max = tilePos[currentTile]*10;
	//This obtains a random usable land type for that particular tile [Currently, the default seed is 1]
	randomNumber = (prng.genrand_real1());
	//Converts the randomNumber to an index
	var chosenIndex = getRandomTile(randomNumber*100, max);
	//Converts index to land type
	var chosenLandType = (usableTiles[currentTile])[chosenIndex];
	//Assigns that land type to the given tile (for year 1)
	optGameBoard.map[givenTile.id-1].landType[1] = chosenLandType;
} //end assignTile()

//Retrieves the land use for the tile (using a random number)
// This splits the range of possible land types for this tile into equal spacings. If the random number falls between a particular
// range, that is the tile it is assigned
function getRandomTile(givenNumber, givenMax) {
	var numGap = 100/givenMax;
	var currentMax = numGap;
	var iter = 0;
	while(givenNumber>currentMax) {
		iter++;
		currentMax += numGap;
	}
	return iter;
} //end getRandomTile()

//Checks the generated board to see if it meets the primary parameters
function checkParameters() {
	//Fetch primary parameters from user
	populateParameters();
	//Set the precip for the results
	optGameBoard.precipitation[1] = parseFloat(document.getElementById("precipYear1").value);
	//Update the results
	results.update();
	//Fetch the primary parameters from the results
	populateResults(results);
	//This will check each parameter and see if it works with the given board
	var workingBoard = true;
	for(var i = 0; i < primaryCon.length; i++) {
		var tempCon = primaryCon[i];
		var tempCon2 = resultsCon[i];
		//Checks parameter. If the parameter is blank, then skip and move on to the next one
		if(tempCon[1] != "" || tempCon[0] != "") {
			//If a max wasn't set
			if(tempCon[1] == "") {
				//Set an arbirarily high max (since the user has no set maximum)
				tempCon[1] = 1000000;
			}
			//Determines if the parameter is given as a percentage or in acres
			//If it's in acres
			if(tempCon[1] > 100) {
				//If the minimum is greater or the maximum is less than the given value
				if(tempCon[0] > tempCon2[1] || tempCon[1] < tempCon2[1]) {
					workingBoard = false
					break;
				}
			//If it's a percentage
			} else {
				//If the minimum is greater or the maximum is less than the given value
				if(tempCon[0] > tempCon2[0] || tempCon[1] < tempCon2[0]) {
					workingBoard = false;
					break;
				}
			}
		}
	}
	//Ends the primary constraint checks. The next if-statement handles a custom parameter
	//
	//If the user wanted to use a custom equation
	if(document.getElementById("equation").style.visibility == "visible") {
		workingBoard = calculateEquation();
	}
	return workingBoard;
} //end checkParameters

//Calculates the total using the user-provided equation, and returns if the equation parameters are met
function calculateEquation() {
	//Temporary array for storing data pertinent to a given variable
	var tempTotalArr = [];
	//Running total of the custom equation
	var runningTotal = 0;
	//Cycle through each variable
	for(var i = 1; i < variableNum+1; i++) {
		tempTotalArr = retrieveScore(i);
		runningTotal += tempTotalArr[0]*tempTotalArr[1];
	}
	//Retrieves the operator for the numerical comparison
	var oper = document.getElementById("operator").value;
	//Returns true if the equation is satisfied, false otherwise
	if(runningTotal!=0) {
		return eval(runningTotal + oper + document.getElementById("sum").value);
	}
	else {
		return false;
	}
} //end calculateEquation()

//Retrieves the needed scores for the selector
function retrieveScore(givenIndex) {
	if(document.getElementById('c'+givenIndex).value==""){
		alert("Please complete the custom equation before submitting!")
		return [0,0];
	}
	else {
		tempValue = document.getElementById('c'+givenIndex).value;
		tempLandType = retrieveLandUse(document.getElementById('s'+givenIndex).value, results);
		return [tempValue,tempLandType];
	}
} //end retrieveScore()

//Retrieves the yield score (using a given string and results object)
function retrieveYieldScore(givenType, givenResults) {
	switch(givenType) {
		case "cornGrainYieldScore":
			return givenResults.cornGrainYieldScore[1];
		case "soybeanYieldScore":
			return givenResults.soybeanYieldScore[1];
		case "mixedFruitsVegetablesYieldScore":
			return givenResults.mixedFruitsAndVegetablesYieldScore[1];
		case "cattleYieldScore":
			return givenResults.cattleYieldScore[1];
		case "alfalfaHayYieldScore":
			return givenResults.alfalfaHayYieldScore[1];
		case "grassHayYieldScore":
			return givenResults.grassHayYieldScore[1];
		case "switchgrassYieldScore":
			return givenResults.switchgrassYieldScore[1];
		case "woodYieldScore":
			return givenResults.woodYieldScore[1];
		case "shortRotationWoodyBiomassYieldScore":
			return givenResults.shortRotationWoodyBiomassYieldScore[1];
		case "total":
			var runningYieldTot = 0;
			for(var i = 0; i < usableYieldChoices.length; i++) {
				runningYieldTot += retrieveYieldScore(usableYieldChoices[i], givenResults);
			}
			return runningYieldTot;
	}
} //end retrieveYieldScore()

//Retrieves the needed land type for the selector (and its land usage)
function retrieveLandUse(givenDiv, givenResults) {
	resultsC = givenResults.landUseResults[1];
	switch(givenDiv) {
		case "Conventional Corn Area":
			return resultsC.conventionalCornLandUse;
		case "Conservational Corn Area":
			return resultsC.conservationCornLandUse;
		case "Conventional Soybean Area":
			return resultsC.conventionalSoybeanLandUse;
		case "Conservational Soybean Area":
			return resultsC.conservationSoybeanLandUse;
		case "Mixed Fruits and Vegetables Area":
			return resultsC.mixedFruitsVegetablesLandUse;
		case "Permanent Pasture Area":
			return resultsC.permanentPastureLandUse;
		case "Rotational Grazing Area":
			return resultsC.rotationalGrazingLandUse;
		case "Grass Hay Area":
			return resultsC.grassHayLandUse;
		case "Switchgrass Area":
			return resultsC.switchgrassLandUse;
		case "Prairie Area":
			return resultsC.prairieLandUse;
		case "Wetland Area":
			return resultsC.wetlandLandUse;
		case "Alfalfa Area":
			return resultsC.alfalfaLandUse;
		case "Conventional Forest Area":
			return resultsC.conventionalForestLandUse;
		case "Conservational Forest Area":
			return resultsC.conservationForestLandUse;
		case "Short Rotation Woody Bioenergy Area":
			return resultsC.shortRotationWoodyBioenergyLandUse;
	}
} //end retrieveLandUse()

//Retrieves the needed ecosystem scores
function retrieveEcosystemScore(givenScore, givenResults) {
	switch(givenScore) {
		case "Game Wildlife":
			return givenResults.gameWildlifePointsScore[1];
		case "Biodiversity":
			return givenResults.biodiversityPointsScore[1];
		case "Carbon Sequestration":
			return givenResults.carbonSequestrationScore[1];
		case "Erosion Control":
			return givenResults.grossErosionScore[1];
		case "Nitrate Pollution Control":
			return givenResults.nitrateConcentrationScore[1];
		case "Phosphorus Pollution Control":
			return givenResults.phosphorusLoadScore[1];
		case "Sediment Control":
			return givenResults.sedimentDeliveryScore[1];
	}
} //end retrieveEcosystemScore()

//Sorts the boards based off the rankings given by the user (this is a secondary sorter)
function sortBoards() {
	//Get an array of land use types and their weight
	var tempWeights = retrieveWeights();
	//Iterate through the boards until the correct placement has been found (current selection)
	for(var i = 0; i < boardArr.length; i++) {
		//Curent yield score
		var curScore = boardArr[i][0]
		//Current rank score
		var curRank = retrieveLandUse(tempWeights[0][1], resultsArr[i][1]);
		//Selections moving to the right
		for(var j = i+1; j < boardArr.length; j++) {
			//If the board to the right has the same yield score and a higher initial ranking (this shouldn't happen to often)
			if(curScore == boardArr[j][0] && curRank < retrieveLandUse(tempWeights[0][1], resultsArr[j][1])) {
				//Switch the elements (for both the GameBoard array and result object array)
				var tempGameBoard = boardArr[j];
				boardArr[j] = boardArr[i];
				boardArr[i] = tempGameBoard;

				var tempResult = resultsArr[j];
				resultsArr[j] = resultsArr[i];
				resultsArr[i] = tempResult;
			}
			//If the yield AND intial rank score match (extremely unlikely)
			if(curScore == boardArr[j][0] && curRank == retrieveLandUse(tempWeights[0][1], resultsArr[j][1])) {
				for(var k = 1; k < tempWeights.length; k++) {
					//Reset the rank score for the current result object
					curRank = retrieveLandUse(tempWeights[k][1], resultsArr[i][1]);
					//If another rank shows a difference
					if(curRank < retrieveLandUse(tempWeights[k][1], resultsArr[j][1])) {
						var tempGameBoard = boardArr[j];
						boardArr[j] = boardArr[i];
						boardArr[i] = tempGameBoard;

						var tempResult = resultsArr[j];
						resultsArr[j] = resultsArr[i];
						resultsArr[i] = tempResult;
					}
				}
			//If the stars align and I win the lottery, the two compared GameBoards will have the same yield score, as well as 
			// the same rank parameters. This will probably never happen, thus no case is made for it (the two GameBoards can be
			// left at their positions)
			}
			//If the yield score is lower, break and move on
			if(curScore > boardArr[j][0]) {
				break;
			}
		}
	}
} //end sortBoards()

//Retrieves the weights (and their land use types) provided by the user
function retrieveWeights() {
	var tempW = [];
	//For each weight
	for(var i = 1; i < weightNum+1; i++) {
		tempW[i-1] = [document.getElementById('w'+i).value, document.getElementById('ws'+i).value]
	}
	//Use sort() so that the highest rank is first in the array, and cascades from there
	return tempW.sort();
} //end retrieveWeights()

//Populates an array with all of the primary parameters
function populateParameters() {
	primaryCon = [];
	var inputs = document.getElementsByTagName("input");
	var inputArr = Array.prototype.slice.call( inputs );
	//Get rid of the first few inputs
	inputArr.shift();
	inputArr.shift();
	//Keep the primary parameters within the first fields
	for(var i = 0; i < usableChoices.length; i++) {
		if(inputArr[i].type == "number"){
			var tempArr = [inputArr[i*2].value,inputArr[i*2+1].value];
			primaryCon.push(tempArr);
		}
	}
}

//Populates an array with the result parameters (For clarity purposes, these are pushed individually) [Percentage,Acre]
// If more primary parameters are added, they will need to be added to this list
function populateResults(givenResults) {
	resultsCon = [];
	var curRes = givenResults.landUseResults[1];
	resultsCon.push([givenResults.conventionalCornLandUseScore[1], curRes.conventionalCornLandUse]);
	resultsCon.push([givenResults.conservationCornLandUseScore[1], curRes.conservationCornLandUse]);
	resultsCon.push([givenResults.conventionalSoybeanLandUseScore[1], curRes.conventionalSoybeanLandUse]);
	resultsCon.push([givenResults.conservationSoybeanLandUseScore[1], curRes.conservationSoybeanLandUse]);
	resultsCon.push([givenResults.mixedFruitsAndVegetablesLandUseScore[1], curRes.mixedFruitsVegetablesLandUse]);
	resultsCon.push([givenResults.permanentPastureLandUseScore[1], curRes.permanentPastureLandUse]);
	resultsCon.push([givenResults.rotationalGrazingLandUseScore[1], curRes.rotationalGrazingLandUse]);
	resultsCon.push([givenResults.grassHayLandUseScore[1], curRes.grassHayLandUse]);
	resultsCon.push([givenResults.switchgrassLandUseScore[1], curRes.switchgrassLandUse]);
	resultsCon.push([givenResults.prairieLandUseScore[1], curRes.prairieLandUse]);
	resultsCon.push([givenResults.wetlandLandUseScore[1], curRes.wetlandLandUse]);
	resultsCon.push([(curRes.alfalfaLandUse/givenResults.totalArea)*100, curRes.alfalfaLandUse]);
	resultsCon.push([givenResults.conventionalForestLandUseScore[1], curRes.conventionalForestLandUse]);
	resultsCon.push([givenResults.conservationForestLandUseScore[1], curRes.conservationForestLandUse]);
	resultsCon.push([givenResults.shortRotationWoodyBioenergyLandUseScore[1], curRes.shortRotationWoodyBioenergyLandUse]);
}
//Exports the data required to load and see your optimizations
function exportOptimization() {
	console.log("Now exporting...");
	//Now, the CSV file is separated into two (2) parts:
	//
	//1#) Asssumptions and Restrictions:
	//		This includes Primary Parameters (and their Mins/Maxs), Precip, Secondary Parameters, Custom Equation (If the user chooses to use one),
	//	and weighted parameters (If the user chooses to use them). These will be included on the first few lines of the file
	//
	//2#) Scores and Data:
	//		This includes the 15 Land Uses (their percentages and acreages), the 7 Ecosystem Scores, the 9 Yield Scores, and the optimized Score.
	//	The map (tiles and their land uses) will also be appended at the end of each GameBoard. 
	//
	var tempCSVArr = [];
	//Start Part #1
	//
	//Populate the primary parameters into the array
	tempCSVArr = [["Primary Parameters: [Land Use Type/Minimum/Maximum]"]];
	for(var i = 0; i < primaryCon.length; i++) {
		tempCSVArr.push([usableChoices[i], primaryCon[i][0], primaryCon[i][1]]);
	}
	//Populate the Precip
	tempCSVArr.push(["Precip Value: ",document.getElementById("precipYear1").value]);
	//Tell the measured score
	tempCSVArr.push(["Measured Score: ",document.getElementById("sorter").value])
	//Populate the Secondary Parameters
	tempCSVArr.push(["Secondary Parameters:"]);
	var secondaries = document.getElementsByClassName("second");
	for(var i = 0; i < secondaries.length; i++) {
		tempCSVArr.push([secondaryChoices[i],secondaries[i].checked])
	}
	//Populate the Custom Equation (if there is one)
	tempCSVArr.push(["Custom Equation: "])
	var coeff = document.getElementsByClassName("coefficient");
	var vari = document.getElementsByClassName("variable");
	var equation = [];
	for(var i = 0; i < coeff.length; i++) {
		equation.push([coeff[i].value,vari[i].value]);
		if(i < coeff.length-1) {
			equation.push(" + ");
		}
	}
	if(equation.length>0) {
		equation.push([document.getElementById("operator").value,document.getElementById("sum").value]);
		tempCSVArr.push([equation]);
	}
	//Populate the Weighted Parameters
	tempCSVArr.push(["Weighted Parameters:"])
	var weighArr = document.getElementsByClassName("weights");
	var rankArr = document.getElementsByClassName("ranks");
	for(var i = 0; i < weighArr.length; i++) {
		tempCSVArr.push([weighArr[i].value, rankArr[i].value]);
	}
	tempCSVArr.push(["Seed number: ", seedNum]);
	tempCSVArr.push(["# of times seeded: ",currentRandom]);
	//Start Part #2
	//
	tempCSVArr.push(["Optimized Score","Land Uses: [%/Acre]","Ecosystem Scores","Yield Scores","Map Tiles"]);
	var mapLine = [];
	var tempLine = [];
	for(var i = 0; i < boardArr.length; i++) {
		//Insert the optimized score
		mapLine.push(document.getElementById("sorter").value+":"+retrieveYieldScore(document.getElementById("sorter").value, resultsArr[i][1]));
		//Insert the land uses
		populateResults(resultsArr[i][1]);
		//Populate the 15 Land Uses (with their pecentage/acreage)
		for(var j = 0; j < usableLandChoices.length; j++) {
			tempLine += usableLandChoices[j]+": ["+resultsCon[j][0]+"/"+resultsCon[j][1]+"] ";
		}
		mapLine.push(tempLine);
		tempLine = [];
		//Insert the ecosystem scores
		for(var j = 0; j < ecosystemChoices.length; j++) {
			tempLine += ecosystemChoices[j]+":"+retrieveEcosystemScore(ecosystemChoices[j],resultsArr[i][1])+" ";
		}
		mapLine.push(tempLine);
		tempLine = [];
		//Insert the yield scores
		for(var j = 0; j < usableYieldChoices.length; j++) {
			tempLine += usableYieldChoices[j]+":"+retrieveYieldScore(usableYieldChoices[j], resultsArr[i][1])+" ";
		}
		mapLine.push(tempLine);
		tempLine = [];
		//Insert the map tiles
		for(var j = 0; j < boardArr[i][1].map.length; j++) {
			tempLine += boardArr[i][1].map[j].landType[1]+",";
		}
		mapLine.push(tempLine);
		tempCSVArr.push(mapLine);
		mapLine = [];
		tempLine = [];
	}
	//Finished with the array compilation, start CSV compilation
	var csvRows = [];
	for(var i=0; i<tempCSVArr.length; i++)
    {
        csvRows.push(tempCSVArr[i].join(','));
    }
    var csvString = csvRows.join("\n");
    //Get ready to prompt for file
    var a = document.createElement('a');
    a.href     = 'data:text/csv;charset=utf-8;base64,' + window.btoa(csvString);
    a.target   = '_blank';
    if(document.getElementById("optimizationName").value=="") {
    	a.download = document.getElementById("optimizationName").placeholder;
    } else {
    	a.download = document.getElementById("optimizationName").value;
    }
    document.body.appendChild(a);
    a.click();
} //end exportOptimization()

//Handles the file upload
function uploadOptimization(e) {
	console.log("Optimization file uploaded; parsing through data...");
	var files;
    files = e.target.files;
    optName = files[0].name;

    if (files[0].name && !files[0].name.match(/\.csv/)) {
        alert("Incorrect File Type!");
    }
    else {
        var reader = new FileReader();
        reader.readAsText(files[0]);
        //Perform the optimization fill
        reader.onload = function(e) {
            var opt = reader.result.split("\n");
            optimizationData = opt;
            importOptimization();
        }
    }
} //end uploadOptimization()

//Imports the data required to continue an optimization
function importOptimization() {
	//First, reset the form and related arrays
	clearFields();
	boardArr = [];
	resultsArr = [];
	// Part 0: Fill in the file name
	document.getElementById("optimizationName").value = optName;
	// Part 1: Fill out primary parameter forms
	//First, get rid of the reading data
	optimizationData.shift();
	var inputs = document.getElementsByTagName("input");
	var inputArr = Array.prototype.slice.call( inputs );
	inputArr.shift();
	inputArr.shift();
	//Cycle through the types
	for(var i = 0; i < usableChoices.length; i++) {
		tempData = optimizationData[i].split(',');
		document.getElementById(inputArr[0].id).value = parseInt(tempData[1]);
		inputArr.shift();
		document.getElementById(inputArr[0].id).value = parseInt(tempData[2]);
		inputArr.shift();
	}
	//Clear the lines for the next data entries
	for(var i = 0; i < usableChoices.length; i++) {
		optimizationData.shift();
	}
	console.log("Primary Parameters allocated...");
	//Add the precip
	document.getElementById('precipYear1').value = (optimizationData[0].split(','))[1];
	optimizationData.shift();
	console.log("Precip Parameter allocated...");
	//Add the score parameter
	document.getElementById('sorter').value = (optimizationData[0].split(','))[1];
	optimizationData.shift();
	console.log("Selected Score allocated...");
	// Part 2: Fill out secondary parameter forms
	optimizationData.shift();
	for(var i = 0; i < secondaryChoices.length; i++) {
		//Converts the "TRUE"/"FALSE" string to it's boolean equivalent
		var tempBo = ((optimizationData[0].split(','))[1] == "true");
		//If it's checked, simulate the click
		if(tempBo) {
			document.getElementById(inputArr[0].id).click();
		}
		optimizationData.shift();
		inputArr.shift();
	}
	console.log("Secondary Parameters allocated...");
	// Part 3: Fill out custom parameter forms
	optimizationData.shift();
	var tempEq = (optimizationData[0].split(','));
	//See if there are any variables
	if(tempEq[0] != "Weighted Parameters:") {
		toggleEquation();
		var moreVariables = true;
		var counter = 1;
		while(moreVariables) {
			//If this is the first set, modify the already added weight
			if(counter>2) {
				addVariable();
			}
			document.getElementById('c'+counter).value = parseInt(tempEq[0]);
			document.getElementById('s'+counter).value = tempEq[1];
			//Get rid of that variable
			tempEq.shift();
			tempEq.shift();
			counter++;
			//We want to get rid of the "+" operator, but also don't want to delete the operator
			if(tempEq[0] == ' + ') {
				tempEq.shift();
			} else {
				moreVariables = false;
			}
		}
		//Now, insert the operator and sum
		document.getElementById('operator').value = tempEq[0];
		document.getElementById('sum').value = tempEq[1];
		optimizationData.shift();
	}
	optimizationData.shift();
	var tempWeigh = (optimizationData[0].split(','));
	//See if there are any weights
	if(tempWeigh[0] != "Seed number: ") {
		toggleWeight();
		var counter = 1;
		var moreWeights = true;
		while(moreWeights) {
			if(counter!=1) {
				addWeight();
			}
			document.getElementById('ws'+counter).value = tempWeigh[0];
			document.getElementById('w'+counter).value = tempWeigh[1];
			optimizationData.shift();
			tempWeigh = (optimizationData[0].split(','));
			if(tempWeigh[0] == "Seed number: ") {
				moreWeights = false;
			}
			counter++;
		}
	}
	//See if there is a custom seed
	var tempSeed = (optimizationData[0].split(','));
	if(tempSeed[1]!="1") {
		toggleSeed();
		document.getElementById("seedNum").value = tempSeed[1];
	}
	previousSeedNum = tempSeed[1];
	optimizationData.shift();
	//Get the amount of times this seed was previously used
	currentRandom = (optimizationData[0].split(','))[1];
	optimizationData.shift();
	// Part 4: Fill current data (GameBoards, Results, Seed, etc)
	optimizationData.shift();
	//Make a GameBoard and Result object for each line
	optGameBoard = new GameBoard();
	file = "../data.csv";
	loadBoard(optGameBoard, file);
	//Set the precip for the results
	optGameBoard.precipitation[1] = parseFloat(document.getElementById("precipYear1").value);
	//Since we only take the top 3
	tempLength = optimizationData.length;
	for(var i = 0; i < tempLength; i++) {
		var tempBoard = (optimizationData[0].split(','));
		//Get rid of unnecessary data
		for(var j = 0; j < 4; j++) {
			tempBoard.shift();
		}
		//Fill the GameBoard map
		for(var j = 0; j < optGameBoard.map.length; j++) {
			optGameBoard.map[j].landType[1] = parseInt(tempBoard[j]);
			optGameBoard.map[j].update(1);
		}
		//Create the Result object for the GameBoard
		results = new Results(optGameBoard);
		results.update();
		var copy = JSON.parse(JSON.stringify(optGameBoard));
		//Get the yieldScore
		yieldScore = retrieveYieldScore(document.getElementById("sorter").value, results);
		//Push them into the GameBoard and Result arrays
		boardArr.push([yieldScore, copy]);
		resultsArr.push([yieldScore, results]);
		optimizationData.shift();
	}
	importedOpt = true;
	console.log("Optimization import finished");
} //end importOptimization()

//Returns the total number of possible variations your optimization can produce (given the restricted land options, this
// doesn't take into account the min/max parameters)
//
// This uses the default PEWI map. This method can be changed later to allow for custom PEWI configured maps.
function totalIterations() {
	optGameBoard = new GameBoard();
	file = "../data.csv";
	loadBoard(optGameBoard, file);
	parseTiles();
} //end totalIterations()

//Goes through the tiles in the board and counts how many possible combinations there can be
function parseTiles() {
	totalPoss = 0;
	usableTiles = [];
	//# of possible land types (for a given tile)
	tilePos = [];
	//Temporary array of usable land types. This is modified in case a tile cannot use particular land types. It resets after a tile is parsed.
	var tempUsable = usableLandTypes.slice(0);
	for(var i = 0; i<optGameBoard.map.length; i++) {
		//First, check to see if a user could actually select this tile (there are 818 tiles on a game board, but only 593 are selectable)
		if(optGameBoard.map[i].baseLandUseType!=0) {
			//If tile is a strategic wetland and you want only wetlands on those plots, remove all other land type options
			// Since indexOf returns -1 when an element isn't found (and splice() considers -1 to be the element at the end of the array), we
			//  must establish cases for each combination [This method can be changed later if a better alternative is found]
			if(optGameBoard.map[i].strategicWetland==1 && wetStrat) {
				if(!streamBuff && !removeNonProfit) {
					tempUsable.splice(tempUsable.indexOf(1),1);
					tempUsable.splice(tempUsable.indexOf(2),1);
					tempUsable.splice(tempUsable.indexOf(3),1);
					tempUsable.splice(tempUsable.indexOf(4),1);
					tempUsable.splice(tempUsable.indexOf(5),1);
					tempUsable.splice(tempUsable.indexOf(6),1);
					tempUsable.splice(tempUsable.indexOf(7),1);
					tempUsable.splice(tempUsable.indexOf(8),1);
					tempUsable.splice(tempUsable.indexOf(9),1);
					tempUsable.splice(tempUsable.indexOf(10),1);
					tempUsable.splice(tempUsable.indexOf(11),1);
					tempUsable.splice(tempUsable.indexOf(12),1);
					tempUsable.splice(tempUsable.indexOf(13),1);
					tempUsable.splice(tempUsable.indexOf(15),1);
				}
				else if (streamBuff && !removeNonProfit) {
					tempUsable.splice(tempUsable.indexOf(2),1);
					tempUsable.splice(tempUsable.indexOf(4),1);
					tempUsable.splice(tempUsable.indexOf(7),1);
					tempUsable.splice(tempUsable.indexOf(8),1);
					tempUsable.splice(tempUsable.indexOf(9),1);
					tempUsable.splice(tempUsable.indexOf(10),1);
					tempUsable.splice(tempUsable.indexOf(11),1);
					tempUsable.splice(tempUsable.indexOf(12),1);
					tempUsable.splice(tempUsable.indexOf(13),1);
					tempUsable.splice(tempUsable.indexOf(15),1);
				}
				else if (!streamBuff && removeNonProfit) {
					tempUsable.splice(tempUsable.indexOf(1),1);
					tempUsable.splice(tempUsable.indexOf(2),1);
					tempUsable.splice(tempUsable.indexOf(3),1);
					tempUsable.splice(tempUsable.indexOf(4),1);
					tempUsable.splice(tempUsable.indexOf(5),1);
					tempUsable.splice(tempUsable.indexOf(6),1);
					tempUsable.splice(tempUsable.indexOf(7),1);
					tempUsable.splice(tempUsable.indexOf(8),1);
					tempUsable.splice(tempUsable.indexOf(9),1);
					tempUsable.splice(tempUsable.indexOf(10),1);
					tempUsable.splice(tempUsable.indexOf(11),1);
					tempUsable.splice(tempUsable.indexOf(15),1);
				}
				else if (streamBuff && removeNonProfit) {
					tempUsable.splice(tempUsable.indexOf(2),1);
					tempUsable.splice(tempUsable.indexOf(4),1);
					tempUsable.splice(tempUsable.indexOf(7),1);
					tempUsable.splice(tempUsable.indexOf(8),1);
					tempUsable.splice(tempUsable.indexOf(9),1);
					tempUsable.splice(tempUsable.indexOf(10),1);
					tempUsable.splice(tempUsable.indexOf(11),1);
					tempUsable.splice(tempUsable.indexOf(15),1);
				}
			}
			//If tile is inclined and we don't want wetlands on inclined plots, remove wetland land type
			if(optGameBoard.map[i].topography>3 && noWetSlope && optGameBoard.map[i].strategicWetland!=1) {
				tempUsable.splice(tempUsable.indexOf(14),1);
			}
			//If tile's soil is Buckney 1636 or Gara-Armstrong 993E2 and we don't want corn or soy on these plots, remove these crops
			if(optGameBoard.map[i].soilType == "G" && buckGaraRestrict || optGameBoard.map[i].soilType == "B" && buckGaraRestrict) {
				tempUsable.splice(tempUsable.indexOf(1),1);
				tempUsable.splice(tempUsable.indexOf(2),1);
				tempUsable.splice(tempUsable.indexOf(3),1);
				tempUsable.splice(tempUsable.indexOf(4),1);
			}
			//If tile's not a strategic wetland and we only want wetlands on strategic wetland plots, remove wetland land type
			if(optGameBoard.map[i].strategicWetland != 1 && wetlandStrat) {
				tempUsable.splice(tempUsable.indexOf(14),1);
			}
			//If tile's corn grain yield is higher than 14 Mg and we don't want prairie on soils with high corn yield, remove prairie land type
			var tempSoil = optGameBoard.map[i].soilType;
			if(tempSoil=="A" || tempSoil=="M" || tempSoil=="N" || tempSoil=="Q" || tempSoil=="T") {
				if(cornNoPrairie) {
					tempUsable.splice(tempUsable.indexOf(9),1);
				}
			}
			tilePos.push(tempUsable.length/10);
			usableTiles.push(tempUsable);
			//Reset the usable land types
			tempUsable = usableLandTypes.slice(0);
		}
	}
	//Multiplies all the possibilities together and add the probability to the running total
	totalPoss = (tilePos.reduce(function(a,b){return a*b;}));
	totalExp = tilePos.length;
	document.getElementById('totalPos').innerHTML = totalPoss;
	document.getElementById('middle').style.visibility = "visible";
	document.getElementById('totalExp').innerHTML = totalExp;
}