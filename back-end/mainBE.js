/*global initData*/
/*global precip*/
var aggregateChoice; // When aggregate conflict is detected, map priority will be stored in this variable.
var isAggregateConflictDetected = false; // Indicates whether there's a aggregate conflict
var nextFileIndex = 0; // next uploaded file should be process
var mergedFiles = []; // stores all merged files
var filesUploaded; // stores uploaded files
var hasPrecipConclict = false; // indicates whether there's a precipitation level conflict or not

// I think we can delete this function, It's not been used.
// BTW, board1 is not a global variable, not a parameter either, so what're the purpose of this function and the next one?
//calculate() function brings the results up to date
//  this is currently set to calculate up to year 3 for testing purposes
// function calculate() {
//   board1.calculatedToYear = 3;
//   // update all tile level calculations
//   board1.updateBoard();
//
//   // create results object associated with this board
//   Totals = new Results(board1);
//   // update all board level calculations
//   Totals.update();
// } //end calculate()
//
// // I think we can also delete this function, It's not been used anywhere.
// //update Display object for simple text read out
// function display() {
//   // var x = document.createElement("P");
//   // var P = document.createTextNode("Precipitation:\n")
//   // var Py1 = document.createTextNode("Year 1: " + board1.precipitation[0]);
//   // x.appendChild(P);
//   // x.appendChild(Py1);
//   // document.body.appendChild(x);
//
//   document.write("Precipitation:" + "<BR>" +
//     "Year 0: " + board1.precipitation[0] + "<BR>" +
//     "Year 1: " + board1.precipitation[1] + "<BR>" +
//     "Year 2: " + board1.precipitation[2] + "<BR>" +
//     "Year 3: " + board1.precipitation[3] + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Total Area: " + Totals.totalArea + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Carbon Sequestration: " + "<BR>" +
//     "Year 1: " + Totals.carbonSequestration[1] + "<BR>" +
//     "Year 2: " + Totals.carbonSequestration[2] + "<BR>" +
//     "Year 2: " + Totals.carbonSequestration[3] + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Erosion: " + "<BR>" +
//     "Year 1: " + Totals.grossErosion[1] + "<BR>" +
//     "Year 2: " + Totals.grossErosion[2] + "<BR>" +
//     "Year 3: " + Totals.grossErosion[3] + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Game Wildlife Points: " + "<BR>" +
//     "Year 1: " + Totals.gameWildlifePoints[1] + "<BR>" +
//     "Year 2: " + Totals.gameWildlifePoints[2] + "<BR>" +
//     "Year 3: " + Totals.gameWildlifePoints[3] + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Biodiversity: " + "<BR>" +
//     "Year 1: " + Totals.biodiversityPoints[1] + "<BR>" +
//     "Year 2: " + Totals.biodiversityPoints[2] + "<BR>" +
//     "Year 3: " + Totals.biodiversityPoints[3] + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Phosphorus Load: " + "<BR>" +
//     "Year 1: " + Totals.phosphorusLoad[1] + "<BR>" +
//     "Year 2: " + Totals.phosphorusLoad[2] + "<BR>" +
//     "Year 3: " + Totals.phosphorusLoad[3] + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Nitrate Load: " + "<BR>" +
//     "Year 1: " + Totals.nitrateConcentration[1] + "<BR>" +
//     "Year 2: " + Totals.nitrateConcentration[2] + "<BR>" +
//     "Year 3: " + Totals.nitrateConcentration[3] + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Sediment Delivery: " + "<BR>" +
//     "Year 1: " + Totals.sedimentDelivery[1] + "<BR>" +
//     "Year 2: " + Totals.sedimentDelivery[2] + "<BR>" +
//     "Year 3: " + Totals.sedimentDelivery[3] + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Yield Totals: " + "<BR>" +
//     "Corn: " + Totals.yieldResults[1].cornGrainYield + "<BR>" +
//     "Soy: " + Totals.yieldResults[1].soybeanYield + "<BR>" +
//     "Alfalfa: " + Totals.yieldResults[1].alfalfaHayYield + "<BR>" +
//     "Grass Hay: " + Totals.yieldResults[1].grassHayYield + "<BR>" +
//     "Wood: " + Totals.yieldResults[1].woodYield + "<BR>" +
//     "Cattle: " + Totals.yieldResults[1].cattleYield + "<BR>" +
//     "Switchgrass: " + Totals.yieldResults[1].switchgrassYield + "<BR>" +
//     "Short Woody: " + Totals.yieldResults[1].shortRotationWoodyBiomassYield + "<BR>" +
//     "Fruits + Veggies: " + Totals.yieldResults[1].mixedFruitsAndVegetablesYield + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Land Use Totals: " + "<BR>" +
//     "Conventional Corn: " + Totals.landUseResults[1].conventionalCornLandUse + "<BR>" +
//     "Conservation Corn: " + Totals.landUseResults[1].conservationCornLandUse + "<BR>" +
//     "Conventional Soybean: " + Totals.landUseResults[1].conventionalSoybeanLandUse + "<BR>" +
//     "Conservation Soybean: " + Totals.landUseResults[1].conservationSoybeanLandUse + "<BR>" +
//     "Alfalfa: " + Totals.landUseResults[1].alfalfaLandUse + "<BR>" +
//     "Permanent Pasture: " + Totals.landUseResults[1].permanentPastureLandUse + "<BR>" +
//     "Rotational Grazing: " + Totals.landUseResults[1].rotationalGrazingLandUse + "<BR>" +
//     "Grass Hay: " + Totals.landUseResults[1].grassHayLandUse + "<BR>" +
//     "Prairie: " + Totals.landUseResults[1].prairieLandUse + "<BR>" +
//     "Conservation Forest: " + Totals.landUseResults[1].conservationForestLandUse + "<BR>" +
//     "Conventional Forest: " + Totals.landUseResults[1].conventionalForestLandUse + "<BR>" +
//     "Switchgrass (deprecated: Herbaceous Perennial Bioenergy): " + Totals.landUseResults[1].switchgrassLandUse + "<BR>" +
//     "Short Rotation Woody Bioenergy: " + Totals.landUseResults[1].shortRotationWoodyBioenergyLandUse + "<BR>" +
//     "Wetland: " + Totals.landUseResults[1].wetlandLandUse + "<BR>" +
//     "Mixed Fruits and Veggies: " + Totals.landUseResults[1].mixedFruitsVegetablesLandUse + "<BR>" +
//     "<BR>" + "<BR>" +
//     "<STRONG>" + "Scores (100): " + "</STRONG>" + "<BR>" + "<BR>" +
//     "Yield Score: " + "<BR>" +
//     "Corn: " + 100 * Totals.yieldResults[3].cornGrainYield / board1.maximums.cornMax + "<BR>" +
//     "Soy: " + 100 * Totals.yieldResults[3].soybeanYield / board1.maximums.soybeanMax + "<BR>" +
//     "Alfalfa: " + 100 * Totals.yieldResults[3].alfalfaHayYield / board1.maximums.alfalfaMax + "<BR>" +
//     "Hay: " + 100 * Totals.yieldResults[3].grassHayYield / board1.maximums.grassHayMax + "<BR>" +
//     "Wood: " + 100 * Totals.yieldResults[3].woodYield / board1.maximums.woodMax + "<BR>" +
//     "Cattle: " + 100 * Totals.yieldResults[3].cattleYield / board1.maximums.cattleMax + "<BR>" +
//     "Switchgrass: " + 100 * Totals.yieldResults[3].switchgrassYield / board1.maximums.switchgrassMax + "<BR>" +
//     "Short Woody: " + 100 * Totals.yieldResults[3].shortRotationWoodyBiomassYield / board1.maximums.shortRotationWoodyBiomassMax + "<BR>" +
//     "Fruits + Veggies: " + 100 * Totals.yieldResults[3].mixedFruitsAndVegetablesYield / board1.maximums.mixedFruitsAndVegetablesMax + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Game Wildlife Score: " + "<BR>" +
//     "Year 1: " + Totals.gameWildlifePoints[1] * 10 + "<BR>" +
//     "Year 2: " + Totals.gameWildlifePoints[2] * 10 + "<BR>" +
//     "Year 3: " + Totals.gameWildlifePoints[3] * 10 + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Biodiversity Score: " + "<BR>" +
//     "Year 1: " + Totals.biodiversityPoints[1] * 10 + "<BR>" +
//     "Year 2: " + Totals.biodiversityPoints[2] * 10 + "<BR>" +
//     "Year 3: " + Totals.biodiversityPoints[3] * 10 + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Carbon Score: " + "<BR>" +
//     "Year 1: " + 100 * ((Totals.carbonSequestration[1] - board1.minimums.carbonMin) / (board1.maximums.carbonMax - board1.minimums.carbonMin)) + "<BR>" +
//     "Year 2: " + 100 * ((Totals.carbonSequestration[2] - board1.minimums.carbonMin) / (board1.maximums.carbonMax - board1.minimums.carbonMin)) + "<BR>" +
//     "Year 3: " + 100 * ((Totals.carbonSequestration[3] - board1.minimums.carbonMin) / (board1.maximums.carbonMax - board1.minimums.carbonMin)) + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Erosion Score: " + "<BR>" +
//     "Year 1: " + 100 * ((board1.maximums.erosionMax - Totals.grossErosion[1]) / (board1.maximums.erosionMax - board1.minimums.erosionMin)) + "<BR>" +
//     "Year 2: " + 100 * ((board1.maximums.erosionMax - Totals.grossErosion[2]) / (board1.maximums.erosionMax - board1.minimums.erosionMin)) + "<BR>" +
//     "Year 3: " + 100 * ((board1.maximums.erosionMax - Totals.grossErosion[3]) / (board1.maximums.erosionMax - board1.minimums.erosionMin)) + "<BR>" +
//     "Erosion Min " + board1.minimums.erosionMin + "<BR>" +
//     "Erosion Max: " + board1.maximums.erosionMax + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Phosphorus Score: " + "<BR>" +
//     "Year 1: " + 100 * ((board1.maximums.phosphorusMax - Totals.phosphorusLoad[1]) / (board1.maximums.phosphorusMax - board1.minimums.phosphorusMin)) + "<BR>" +
//     "Year 2: " + 100 * ((board1.maximums.phosphorusMax - Totals.phosphorusLoad[2]) / (board1.maximums.phosphorusMax - board1.minimums.phosphorusMin)) + "<BR>" +
//     "Year 3: " + 100 * ((board1.maximums.phosphorusMax - Totals.phosphorusLoad[3]) / (board1.maximums.phosphorusMax - board1.minimums.phosphorusMin)) + "<BR>" +
//     "Phosphorus Min " + board1.minimums.phosphorusMin + "<BR>" +
//     "Phosphorus Max: " + board1.maximums.phosphorusMax + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Nitrate Score: " + "<BR>" +
//     "Year 1: " + 100 * ((board1.maximums.nitrateMax - Totals.nitrateConcentration[1]) / (board1.maximums.nitrateMax - board1.minimums.nitrateMin)) + "<BR>" +
//     "Year 2: " + 100 * ((board1.maximums.nitrateMax - Totals.nitrateConcentration[2]) / (board1.maximums.nitrateMax - board1.minimums.nitrateMin)) + "<BR>" +
//     "Year 3: " + 100 * ((board1.maximums.nitrateMax - Totals.nitrateConcentration[3]) / (board1.maximums.nitrateMax - board1.minimums.nitrateMin)) + "<BR>" +
//     "<BR>" + "<BR>" +
//     "Sediment Delivery Score: " + "<BR>" +
//     "Year 1: " + 100 * ((board1.maximums.sedimentMax - Totals.sedimentDelivery[1]) / (board1.maximums.sedimentMax - board1.minimums.sedimentMin)) + "<BR>" +
//     "Year 2: " + 100 * ((board1.maximums.sedimentMax - Totals.sedimentDelivery[2]) / (board1.maximums.sedimentMax - board1.minimums.sedimentMin)) + "<BR>" +
//     "Year 3: " + 100 * ((board1.maximums.sedimentMax - Totals.sedimentDelivery[3]) / (board1.maximums.sedimentMax - board1.minimums.sedimentMin)) + "<BR>" +
//     "Sediment Min: " + board1.minimums.sedimentMin + "<BR>" +
//     "Sediment Max: " + board1.maximums.sedimentMax + "<BR>");
//
// } // end display()


//overlayBoard takes two GameBoard objects, and merges tiles that exist in overlay
// into board. The first argument is passed by reference, so nothing need be returned
function overlayBoard(board) {

  var utilityWindow = document.getElementById("startUpFrame").contentWindow.document.getElementById("startupDialogueOverlay").contentWindow;
  if(!hasPrecipConclict) {
    for(var y = 0; y < board.calculatedToYear; y++) {

      /* ** CHANGE COLUMN VALUES HERE - If Adding new columns to data.csv file (the core file from which PEWI loads in default case) **
            (Since the column values are hard coded in the current system, you'll need to do this if you add new columns anywhere before the last column in data.csv )
            NOTE: MUST DO THE SAME IN TWO OTHER PLACES -
            1. function propogateBoard() in mainBE.js
            2. function Tile() in helperObjects.js
      */
      var precipIndex = convertPrecipToIndex(parseFloat(initData[1][31+y]));
      if(precipIndex !== board.precipitationIndex[y]) {
        hasPrecipConclict = true;
      }
    }
  }

  for (var i = 0; i < initData.length; i++) {
    //get the tile set up
    var tile = new Tile(initData[i], board);

    if(tile.baseLandUseType == 1 && board.map[tile.id - 1].baseLandUseType == 1){
      // An new aggregate conflict is detected
      if(typeof aggregateChoice === 'undefined'){

        utilityWindow.document.getElementById("modalConflictFrame").style.display = "block";
        utilityWindow.document.getElementById("conflictText").innerHTML += "Merged Map - Currently includes the following files: ";
        for(var i = 0; i < mergedFiles.length; i++){
          // console.log(mergedFiles[i]);
          utilityWindow.document.getElementById("conflictText").innerHTML += "&lt;" + mergedFiles[i] + "&gt;";
          if(i != mergedFiles.length - 1)
            utilityWindow.document.getElementById("conflictText").innerHTML += ", ";
        }
        utilityWindow.document.getElementById("conflictText").innerHTML += ". These files were successfully merged.<br><br>";
        utilityWindow.document.getElementById("conflictText").innerHTML += "Current Map to Merge - &lt;" + filesUploaded[nextFileIndex].name + "&gt; has a conflict with the above merged maps.";

        isAggregateConflictDetected = true;

        break;
      }
      // aggregate conflict is detected, and map priority is made to be merged map.
      else if(aggregateChoice === 'merged') {
        // do nothing
      }
      // aggregate conflict is detected, and map priority is made to be current map.
      else if(aggregateChoice === 'current') {
        board.map[tile.id - 1] = tile;
      }
    }

    //if tile has meaningful data...
    else if (tile.baseLandUseType == 1 && board.map[tile.id - 1].baseLandUseType == -1) {
      //then overwrite the tile in old board with new board stuffaroo
      board.map[tile.id - 1] = tile;

    }
  } //end for : each entry in initData
  if(typeof aggregateChoice !== 'undefined') {
    aggregateChoice = void 0;

  }

} //end overlayBoard()


//propogateBoard() performs the essential initialization operations on the board
// it also pushes tiles from initData into the game board map
function propogateBoard(board) {

  //Loop through the years and assign precipitation levels
  for (var y = 0; y < 4; y++) {
    //var precipIndex = setPrecipitation();
    /* ** CHANGE COLUMN VALUES HERE - If Adding new columns to data.csv file (the core file from which PEWI loads in default case) **
          (Since the column values are hard coded in the current system, you'll need to do this if you add new columns anywhere before the last column in data.csv )
          NOTE: MUST DO THE SAME IN TWO OTHER PLACES -
          1. function Tile() in helperObjects.js
          2. function overlayBoard() in mainBE.js
    */
  	var precipIndex = convertPrecipToIndex(parseFloat(initData[1][31+y]));
    board.precipitation[y] = precip[precipIndex];
    board.precipitationIndex[y] = precipIndex; //store precip indices
  }

  //overwrite the precipitation values, used for testing
  //board.precipitation = [24.58, 30.39, 34.34, 28.18, 24.58, 45.1];
  //board.precipitationIndex = [0,2,4,1] ;

  //loop through initData array and assign values to Tiles
  // console.log("initData.length " + initData.length);
  for (var i = 0; i < initData.length; i++) {
    var tile = new Tile(initData[i], board);
    board.map.push(tile);
  } //end for : each entry in initData

  //set up board1.watershedArea parameter for some tile level calculations
  board.init();
} //end propogateBoard()
