/* global camera, scene, boardData,
          renderer, currentBoard, THREE,
          currentYear, textureArray, riverPoints,
          mouse, raycaster,
          isShiftDown, modalUp, precip,
          painter, Totals, river,
          Results, initData, hoveredOver, currentPlayer*/

var globalLegend = false;
var addingYearFromFile = false; //Boolean used to keep a track of whether or not you're adding a year from file
var click;
var clickAndDrag = false;
var currentHighlightType = 0;
var currentHighlightTypeString = null;
var currentRow = -1;
var curTime;
var curTracking = false;
var endTime;
var hoverOverride = false;
var immutablePrecip = false;
var overlayTemp = false;
var lastPainter = null;
var lastSelectedPainter = 1;
var leftToolConsoleWasOpen;
var mesh = null; // mesh store the whole view on the scene
var mesh2= null;
var meshGeometry = new THREE.Geometry();
var meshGeometry2 = new THREE.Geometry();
var optionsString = ""; //string that stores toggeled off options
var overlayedToggled = false;
var paintSwitch = false;
var paused = false;
var pauseDuration = 0;
var previous = false;
var previousOverlay = null;
var previousTab = null;
var previousTileId = [];
var previousPainter = [];
var randomzing = false;
var rightPopupWasOpen;
var backgroundInfoBoxWasOpen;
var runningSim = false;
var simulationData;
var startTime;
var tileHeight = 12;
var tileWidth = 18;
var undo = false;
var g_isDeleted = false; //true if year delete button is used; false otherwise
var g_year1delete = false; //true if year 1 is deleted when there are other years present; false otherwise
var yearSelected = 1; //keeps track of which year is selected for deletion
var year2to3 = false; //true if year 2 is deleted when year 3 is present; false otherwise
var maxYear = 0; //maximum number of years present currently on the board - only used for deletetion of years
// flag to know if user selected OK/cancel at the 'Are you sure you want to delete?'-popup. Only used for running recorded simulations
//var deleteConfirm = false;
var yearCopyPaste = 0; //used for copying and pasting the selected year
var selectedLandType = 0; //keeps track of which land is selected
var resultsMappedHover=false;
// arrays

//var arrLines;
var birds = [],
  bird;
var boids = [],
  boid;
var columnCutOffs = [];
var highlightedTiles = [];
var meshMaterials = [];
var meshOverlay = [];
var rowCutOffs = []; //y coor of top left corner of each tile
var undoArr = [
  [],
  [],
  [],
  []
];
var undoGridArr = [];
var undoGridPainters = [];

// XXX explain
var clearToChangeLandType = true;
var fullBoardBeforeZoom, zIsDown, oneIsDown;
var inDispLevels = false;
var inResults = false;

// objects
var painterTool = {
  status: 0,
  startTile: 0,
  endTile: 0,
  hover: false
};

// simulation variables
var cur;
var exitTimer;
var elapsedTime;
var myTimer = null;
var mainTimer = [];
var paused = false;
var pauseDuration = 0;
var randomizing = false;
var simBoard;
var sliderTimer;
var timeStopped;
var timeResumed;

// for multiplayer mode
var merging = false;
var playerCombo = [];
var resetting = false;
var totalPlayers = 0;
// customize hotkeys
var hotkeyArr = [
  [69, null],
  [82, null],
  [84, null],
  [85, null],
  [66, null],
  [86, null],
  [68, null],
  [65, null],
  [87, null],
  [83, null],
  [79, null],
  [81, null],
  [67, null],
  [80, null],
  [38, null],
  [40, null],
  [37, null],
  [39, null]
];

// for print function
var data = []; // stores precip data for results page
var activeLandUses = [];
var radarLegendColors = [],
  radarLegendItems = [];
var tempLegendItems = [],
  maxLegendSize = 1,
  finalLegendItems = []; // stores strings of the names in legend for print function
var tempLegendColors = [],
  finalLegendColors = []; // stores colors of legent items for print function

// object to store user actions ( print function )
var session = {
  changeSelectedPaintTo: 1, // deafault choose conventional corn/player 1
  switchConsoleTab: 1, //default land use map
  switchYearTab: 1 // default year 1
};

//Used for preventing users from exiting (click-tracking mode)
window.onbeforeunload = confirmExit;

// Toggled popup text when hover over the Tabs in the left console
function toggleTabTitle(value, dir) {

  // To include hover effects of Tab titles in cur tracking mode
  if (curTracking)
  {
    if (value === 'toolsTabTitle') {
      pushClick(0, getStamp(), 124, 0, value);
    }
    else {
      pushClick(0, getStamp(), 124, 0, dir+value);
    }
  }


  if (document.getElementById(value).style.display === 'none') {
    // Set the corresponding titles when hover over one
    switch (value) {
      case 'toolsTabTitle':
        // The left console is hidden, it should popup 'Hide toolbar' when hover over the tool tab.
        if (document.getElementById('leftConsole').className === 'leftConsole') {
          document.getElementById(value).innerHTML = 'Hide&nbsp;toolbar';
        } else {
          document.getElementById(value).innerHTML = 'Show&nbsp;toolbar';
        }
        break;

      case 'terrainTabTitle':
        document.getElementById(value).innerHTML = 'Land&nbsp;use&nbsp;types';
        break;
      case 'precipTabTitle':
        document.getElementById(value).innerHTML = 'precipitation';
        break;
      case 'yearTabTitle':
        document.getElementById(value).innerHTML = 'years&nbsp;selection';
        break;
      case 'levelsTabTitle':
        document.getElementById(value).innerHTML = 'result&nbsp;maps';
        break;
      case 'featuresTabTitle':
        document.getElementById(value).innerHTML = 'physical&nbsp;features';
        break;
      case 'yieldTabTitle':
        document.getElementById(value).innerHTML = 'yield&nbsp;base&nbsp;rates';
        break;
    }
    document.getElementById(value).style.display = 'inline-block';
  } else {
    document.getElementById(value).style.display = 'none';
  }


//If hovering over, hide legend
if(dir == 0){
  if(typeof document.getElementsByClassName('DetailsList')[0] !== 'undefined'){
    document.getElementsByClassName('DetailsList')[0].style.visibility = 'hidden';
  }
}

//If leaving hover, show legend
if(dir == 1){
  if(typeof document.getElementsByClassName('DetailsList')[0] !== 'undefined'){
    document.getElementsByClassName('DetailsList')[0].style.visibility = 'visible';
  }
}
}

/* Show tab titles when hovered over, hide when not hovering
   Here 'factor' is the span id of the tooltip (or hover text and its container) that needs to be made visible.
*/
function toggleTabTitleHovers(factor) {

  if (curTracking)
  {
      pushClick(0, getStamp(), 125, 0, factor);
  }

  if(document.getElementById(factor).style.visibility == 'visible' && document.getElementById(factor).style.opacity == 1) {
     document.getElementById(factor).style.visibility = 'hidden';
     document.getElementById(factor).style.opacity = 0;
    }
  else {
    document.getElementById(factor).style.visibility = 'visible';
    document.getElementById(factor).style.opacity = 1;
  }
}

// Show score details when hover over progress bar
function toggleScoreDetails(factor) {
  // To include hover effects on progressbars in cur tracking mode
  if (curTracking)
  {
      pushClick(0, getStamp(), 122, 0, factor);
  }
  switch (factor){

    case 'gameWildlife':
      if(document.getElementsByClassName('gameWildlifeScoreDetails')[0].style.display == 'block') {
         document.getElementsByClassName('gameWildlifeScoreDetails')[0].style.display = 'none';
        }
      else {
        var childNodes = document.getElementsByClassName('gameWildlifeScoreDetails')[0].childNodes;
        // console.log(childNodes);
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.gameWildlifePointsScore[currentYear] * 10) / 10).toFixed(1) + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Totals.gameWildlifePoints[currentYear]).toFixed(1) + ' pts / yr';
        document.getElementsByClassName('gameWildlifeScoreDetails')[0].style.display = 'block';

      }
    break;
    case 'carbon':
      if(document.getElementsByClassName('carbonScoreDetails')[0].style.display == 'block') {
         document.getElementsByClassName('carbonScoreDetails')[0].style.display = 'none';

      }

      else {
        var childNodes = document.getElementsByClassName('carbonScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.carbonSequestrationScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.carbonSequestration[currentYear] * 10) / 10).toFixed(1) + ' tons / yr' + '<br>' +
        (Math.round(Totals.carbonSequestration[currentYear] * 0.90718474 * 10) / 10).toFixed(1) + ' Mg / yr';
        document.getElementsByClassName('carbonScoreDetails')[0].style.display = 'block';

      }
    break;
    case 'biodiversity':
      if(document.getElementsByClassName('biodiversityScoreDetails')[0].style.display == 'block') {
         document.getElementsByClassName('biodiversityScoreDetails')[0].style.display = 'none';

       }
      else{
        var childNodes = document.getElementsByClassName('biodiversityScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.biodiversityPointsScore[currentYear] * 10) / 10).toFixed(1)  + '/100';;
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.biodiversityPoints[currentYear] * 10) / 10).toFixed(1) + ' pts / yr';
        document.getElementsByClassName('biodiversityScoreDetails')[0].style.display = 'block';

      }
    break;
    case 'erosion':
      if(document.getElementsByClassName('erosionScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('erosionScoreDetails')[0].style.display = 'none';

      }
      else {
        var childNodes = document.getElementsByClassName('erosionScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.grossErosionScore[currentYear] * 10) / 10).toFixed(1)  + '/100';;
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.grossErosion[currentYear] * 10) / 10).toFixed(1) + ' tons / yr' + '<br>' +
          (Math.round(Totals.grossErosion[currentYear] * 0.90718474 * 10) / 10).toFixed(1) + ' Mg / yr';
        document.getElementsByClassName('erosionScoreDetails')[0].style.display = 'block';

      }
    break;
    case 'nitrate':
      if(document.getElementsByClassName('nitrateScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('nitrateScoreDetails')[0].style.display = 'none';

      }
      else{
        var childNodes = document.getElementsByClassName('nitrateScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.nitrateConcentrationScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.nitrateConcentration[currentYear] * 10) / 10).toFixed(1) + ' ppm / yr' + '<br>' +
          (Math.round(Totals.nitrateConcentration[currentYear] * 10) / 10).toFixed(1) + ' mg/L / yr';
        document.getElementsByClassName('nitrateScoreDetails')[0].style.display = 'block';

      }
    break;
    case 'phoshorus':
      if(document.getElementsByClassName('phoshorusScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('phoshorusScoreDetails')[0].style.display = 'none';

      }
      else{
        var childNodes = document.getElementsByClassName('phoshorusScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.phosphorusLoadScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.phosphorusLoad[currentYear] * 10) / 10).toFixed(1) + ' tons / yr' + '<br>' +
          Math.round(Totals.phosphorusLoad[currentYear] * 0.90718474 * 10) / 10 + ' Mg / yr';
        document.getElementsByClassName('phoshorusScoreDetails')[0].style.display = 'block';

      }
    break;
    case 'sediment':
      if(document.getElementsByClassName('sedimentScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('sedimentScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('sedimentScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.sedimentDeliveryScore[currentYear] * 10) / 10).toFixed(1)  + '/100';;
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.sedimentDelivery[currentYear] * 10) / 10).toFixed(1) + ' tons / yr' + '<br>' +
          (Math.round(Totals.sedimentDelivery[currentYear] * 0.90718474 * 10) / 10).toFixed(1) + ' Mg / yr';
        document.getElementsByClassName('sedimentScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'total':
      if(document.getElementsByClassName('totalScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('totalScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('totalScoreDetails')[0].childNodes;
        // 0 - 100 value
        var totalScore = Math.min(Totals.cornGrainYieldScore[currentYear] +
          Totals.soybeanYieldScore[currentYear] + Totals.mixedFruitsAndVegetablesYieldScore[currentYear] + Totals.alfalfaHayYieldScore[currentYear] +
          Totals.grassHayYieldScore[currentYear] + Totals.switchgrassYieldScore[currentYear] + Totals.cattleYieldScore[currentYear] + Totals.woodYieldScore[currentYear] + Totals.shortRotationWoodyBiomassYieldScore[currentYear], 100);


        childNodes[5].innerHTML = 'Current: ' + (Math.round(totalScore * 10) / 10).toFixed(1)  + '/100';

        document.getElementsByClassName('totalScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'cornGrain':
      if(document.getElementsByClassName('cornGrainScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('cornGrainScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('cornGrainScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.cornGrainYieldScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.yieldResults[currentYear].cornGrainYield * 10) / 10).toFixed(1) + ' bu / yr' + '<br>' +
          (Math.round(Totals.yieldResults[currentYear].cornGrainYield * 0.0254 * 10) / 10).toFixed(1) + ' Mg / yr';

        document.getElementsByClassName('cornGrainScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'soybeans':
      if(document.getElementsByClassName('soybeansScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('soybeansScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('soybeansScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.soybeanYieldScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.yieldResults[currentYear].soybeanYield * 10) / 10).toFixed(1) + ' bu / yr' + '<br>' +
          (Math.round(Totals.yieldResults[currentYear].soybeanYield * 0.0272 * 10) / 10).toFixed(1) + ' Mg / yr';

        document.getElementsByClassName('soybeansScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'fruitsAndVegetables':
      if(document.getElementsByClassName('fruitsAndVegetablesScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('fruitsAndVegetablesScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('fruitsAndVegetablesScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.mixedFruitsAndVegetablesYieldScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.yieldResults[currentYear].mixedFruitsAndVegetablesYield * 10) / 10).toFixed(1) + ' tons / yr' + '<br>' +
          (Math.round(Totals.yieldResults[currentYear].mixedFruitsAndVegetablesYield * 0.90718474 * 10) / 10).toFixed(1) + ' Mg / yr';

        document.getElementsByClassName('fruitsAndVegetablesScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'cattle':
      if(document.getElementsByClassName('cattleScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('cattleScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('cattleScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.cattleYieldScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.yieldResults[currentYear].cattleYield * 10) / 10).toFixed(1) + ' animals / yr';

        document.getElementsByClassName('cattleScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'alfalfaHay':
      if(document.getElementsByClassName('alfalfaHayScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('alfalfaHayScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('alfalfaHayScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.alfalfaHayYieldScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.yieldResults[currentYear].alfalfaHayYield * 10) / 10).toFixed(1) + ' tons / yr' + '<br>' +
          (Math.round(Totals.yieldResults[currentYear].alfalfaHayYield * 0.90718474 * 10) / 10).toFixed(1) + ' Mg / yr';

        document.getElementsByClassName('alfalfaHayScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'grassHay':
      if(document.getElementsByClassName('grassHayScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('grassHayScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('grassHayScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.grassHayYieldScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.yieldResults[currentYear].grassHayYield * 10) / 10).toFixed(1) + ' tons / yr' + '<br>' +
          (Math.round(Totals.yieldResults[currentYear].grassHayYield * 0.90718474 * 10) / 10).toFixed(1) + ' Mg / yr';

        document.getElementsByClassName('grassHayScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'switchgrassBiomass':
      if(document.getElementsByClassName('switchgrassBiomassScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('switchgrassBiomassScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('switchgrassBiomassScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.switchgrassYieldScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.yieldResults[currentYear].switchgrassYield * 10) / 10).toFixed(1) + ' tons / yr' + '<br>' +
          (Math.round(Totals.yieldResults[currentYear].switchgrassYield * 0.90718474 * 10) / 10).toFixed(1) + ' Mg / yr';

        document.getElementsByClassName('switchgrassBiomassScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'wood':
      if(document.getElementsByClassName('woodScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('woodScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('woodScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.woodYieldScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.yieldResults[currentYear].woodYield * 10) / 10).toFixed(1) + ' board-ft / yr' + '<br>' +
          (Math.round(Totals.yieldResults[currentYear].woodYield * 0.002359737 * 10) / 10).toFixed(1) + ' M^3 / yr';

        document.getElementsByClassName('woodScoreDetails')[0].style.display = 'block';
      }
    break;
    case 'woodyBiomass':
      if(document.getElementsByClassName('woodyBiomassScoreDetails')[0].style.display == 'block') {
        document.getElementsByClassName('woodyBiomassScoreDetails')[0].style.display = 'none';
      }
      else{
        var childNodes = document.getElementsByClassName('woodyBiomassScoreDetails')[0].childNodes;
        // 0 - 100 value
        childNodes[5].innerHTML = 'Current: ' + (Math.round(Totals.shortRotationWoodyBiomassYieldScore[currentYear] * 10) / 10).toFixed(1)  + '/100';
        // convert English unit to Metric unit
        childNodes[7].innerHTML = (Math.round(Totals.yieldResults[currentYear].shortRotationWoodyBiomassYield * 10) / 10).toFixed(1) + ' tons / yr' + '<br>' +
          (Math.round(Totals.yieldResults[currentYear].shortRotationWoodyBiomassYield * 0.90718474 * 10) / 10).toFixed(1) + ' Mg / yr';

        document.getElementsByClassName('woodyBiomassScoreDetails')[0].style.display = 'block';
      }
    break;
  }
}

function toggleMinMax(option, idNum){
  var progressbarIds = ["gameWildlifeProgressBar","biodiversityProgressBar","carbonProgressBar","erosionProgressBar","nitrateProgressBar","phoshorusProgressBar",
                        "sedimentProgressBar","cornGrainProgressBar","soybeansProgressBar","fruitsAndVegetablesProgressBar","cattleProgressBar","alfalfaHayProgressBar",
                        "grassHayProgressBar","switchgrassBiomassProgressBar","woodProgressBar","woodyBiomassProgressBar","totalYieldsProgressBar"];
  var tempElement = document.getElementById(progressbarIds[idNum]);
  // console.log(tempElement.childNodes[7].style.display);
  if(tempElement.childNodes[7].style.display == 'none' || tempElement.childNodes[7].style.display == '' ){
    var minOrMaxValue;
    if(option == 'Min')
      minOrMaxValue = parseFloat(tempElement.childNodes[3].childNodes[3].style.left);
    else
      minOrMaxValue = parseFloat(tempElement.childNodes[3].childNodes[5].style.left);
    tempElement.childNodes[7].innerHTML ="Goal " + option + ": <br>" + minOrMaxValue + "/100";
    if(idNum == 0 || idNum == 1) tempElement.childNodes[7].innerHTML += "<br>" + minOrMaxValue / 10 + " pts";

    // Set Carbon raw value
    if(idNum == 2){
      var rawValue = getRawValue(minOrMaxValue, idNum);
      tempElement.childNodes[7].innerHTML += "<br>" + Math.round(rawValue / 0.90718474 * 10) / 10 + " tons" + "<br>" + rawValue + " Mg";
    }
    // Set Gross Erosion, Phoshorus, Sediment, FruitsAndVegetables, Alfalfa Hay, Grass Hay, Switchgrass Biomass and Short Rotation Woody Biomass raw value
    if(idNum == 3 || idNum == 5 || idNum == 6 || idNum == 9 || idNum == 11 || idNum == 12 || idNum == 13 || idNum == 15){
      var rawValue = getRawValue(minOrMaxValue, idNum);
      tempElement.childNodes[7].innerHTML += "<br>" + rawValue + " tons" + "<br>" + Math.round(rawValue * 0.90718474 * 10) / 10 + " Mg";
    }
    // Set Nitrate concentration raw value
    if(idNum == 4){
      var rawValue = getRawValue(minOrMaxValue, idNum);
      tempElement.childNodes[7].innerHTML += "<br>" + rawValue + " ppm" + "<br>" + rawValue + " mg/L";
    }

    // calculate Corn Grain and Soybeans raw value
    if(idNum == 7 || idNum == 8){
      var rawValue = getRawValue(minOrMaxValue, idNum);
      tempElement.childNodes[7].innerHTML += "<br>" + rawValue + " bu" + "<br>" + Math.round(rawValue * 0.0272 * 10) / 10 + " Mg";
    }

    // Set Cattle raw value
    if(idNum == 10){
      var rawValue = getRawValue(minOrMaxValue, idNum);
      tempElement.childNodes[7].innerHTML += "<br>" + rawValue + " animals";
    }

    // Set Wood raw value
    if(idNum == 14){
      var rawValue = getRawValue(minOrMaxValue, idNum);
      tempElement.childNodes[7].innerHTML += "<br>" + rawValue + " board-ft" + "<br>" + Math.round(rawValue * 0.002359737 * 10) / 10 + " M^3";
    }

    tempElement.childNodes[7].style.display = 'block';
  }
  else {
    tempElement.childNodes[7].style.display = 'none';
    tempElement.childNodes[7].innerHTML = '';
  }

}

// convert english unit to metric unit
function englishToMetric(idNum, englishUnit){
  if(idNum == 0 || idNum == 1)
    return englishUnit;
  else if(idNum == 2){
    return Math.round(englishUnit / 0.90718474 * 10) / 10;
  }
  else if(idNum == 3 || idNum == 5 || idNum == 6 || idNum == 9 || idNum == 11 || idNum == 12 || idNum == 13 || idNum == 15){
    return Math.round(englishUnit * 0.90718474 * 10) / 10;
  }
  else if(idNum == 4){
    return englishUnit;
  }

  else if(idNum == 7 || idNum == 8){
    return Math.round(englishUnit * 0.0272 * 10) / 10;
  }

  else if(idNum == 10){
    return englishUnit;
  }

  else if(idNum == 14){
    return Math.round(englishUnit * 0.002359737 * 10) / 10;
  }
}

// convert metric unit to english unit
function metricToEnglish(idNum, metricUnit){
  if(idNum == 0 || idNum == 1)
    return metricUnit;
  else if(idNum == 2){
    return Math.round(metricUnit * 0.90718474 * 10) / 10;
  }
  else if(idNum == 3 || idNum == 5 || idNum == 6 || idNum == 9 || idNum == 11 || idNum == 12 || idNum == 13 || idNum == 15){
    return Math.round(metricUnit / 0.90718474 * 10) / 10;
  }
  else if(idNum == 4){
    return metricUnit;
  }

  else if(idNum == 7 || idNum == 8){
    return Math.round(metricUnit / 0.0272 * 10) / 10;
  }

  else if(idNum == 10){
    return metricUnit;
  }

  else if(idNum == 14){
    return Math.round(metricUnit / 0.002359737 * 10) / 10;
  }
}

// calculate English raw scores given eco scores
function getRawValue(minOrMaxValue,idNum) {
  // calculate Game Wildlife and Biodiversity raw value
  if(idNum == 0 || idNum == 1) return minOrMaxValue / 10;

  // calculate Carbon raw value given carbonSequestrationScore(equals to minOrMaxValue) by the following equation
  // this.carbonSequestrationScore[y] = 100 * ((this.carbonSequestration[y] - board.minimums.carbonMin) / (board.maximums.carbonMax - board.minimums.carbonMin));
  if(idNum == 2){
    // Calculate in Metric unit by default.
    var rawValue = Math.round((minOrMaxValue / 100 * (boardData[currentBoard].maximums.carbonMax - boardData[currentBoard].minimums.carbonMin) + boardData[currentBoard].minimums.carbonMin) * 10) / 10;
    return rawValue;
    // console.log("boardData[currentBoard].minimums.carbonMin = ", boardData[currentBoard].minimums.carbonMin);
    // console.log("boardData[currentBoard].maximums.carbonMax = ", boardData[currentBoard].maximums.carbonMax);
    // console.log("boardData[currentBoard].maximums.carbonMax - boardData[currentBoard].minimums.carbonMin = ", boardData[currentBoard].maximums.carbonMax - boardData[currentBoard].minimums.carbonMin);
    // console.log("minOrMaxValue / 100 = ", minOrMaxValue / 100);
    // console.log("minOrMaxValue / 100 * (boardData[currentBoard].maximums.carbonMax - boardData[currentBoard].minimums.carbonMin)", minOrMaxValue / 100 * (boardData[currentBoard].maximums.carbonMax - boardData[currentBoard].minimums.carbonMin));
    // console.log("rawValue = ", minOrMaxValue / 100 * (boardData[currentBoard].maximums.carbonMax - boardData[currentBoard].minimums.carbonMin) + boardData[currentBoard].minimums.carbonMin);
  }
  // calculate Gross Erosion raw value
  // this.grossErosionScore[y] = 100 * ((board.maximums.erosionMax - this.grossErosion[y]) / (board.maximums.erosionMax - board.minimums.erosionMin));
  if(idNum == 3){
    var rawValue = Math.round((boardData[currentBoard].maximums.erosionMax - minOrMaxValue / 100 * (boardData[currentBoard].maximums.erosionMax - boardData[currentBoard].minimums.erosionMin)) * 10) / 10;
    return rawValue;
  }
  // calculate Nitrate concentration raw value
  // this.nitrateConcentrationScore[y] = 100 * ((board.maximums.nitrateMax - this.nitrateConcentration[y]) / (board.maximums.nitrateMax - board.minimums.nitrateMin));
  if(idNum == 4){
    var rawValue = Math.round((boardData[currentBoard].maximums.nitrateMax - minOrMaxValue / 100 * (boardData[currentBoard].maximums.nitrateMax - boardData[currentBoard].minimums.nitrateMin)) * 10) / 10;
    return rawValue;
  }

  // calculate Phoshorus raw value
  // this.phosphorusLoadScore[y] = 100 * ((board.maximums.phosphorusMax - this.phosphorusLoad[y]) / (board.maximums.phosphorusMax - board.minimums.phosphorusMin));
  if(idNum == 5){
    var rawValue = Math.round((boardData[currentBoard].maximums.phosphorusMax - minOrMaxValue / 100 * (boardData[currentBoard].maximums.phosphorusMax - boardData[currentBoard].minimums.phosphorusMin)) * 10) / 10;
    return rawValue;
  }

  // calculate Sediment raw value
  // this.sedimentDeliveryScore[y] = 100 * ((board.maximums.sedimentMax - this.sedimentDelivery[y]) / (board.maximums.sedimentMax - board.minimums.sedimentMin));
  if(idNum == 6){
    var rawValue = Math.round((boardData[currentBoard].maximums.sedimentMax - minOrMaxValue / 100 * (boardData[currentBoard].maximums.sedimentMax - boardData[currentBoard].minimums.sedimentMin)) * 10) / 10;
    return rawValue;
  }

  // calculate Corn Grain raw value
  // this.cornGrainYieldScore[y] = 100 * this.yieldResults[y].cornGrainYield / board.maximums.cornMax;
  if(idNum == 7){
    var rawValue = Math.round(minOrMaxValue / 100 * boardData[currentBoard].maximums.cornMax * 10) / 10;
    return rawValue;
  }
  // calculate Soybeans raw value
  // this.soybeanYieldScore[y] = 100 * this.yieldResults[y].soybeanYield / board.maximums.soybeanMax;
  if(idNum == 8){
    var rawValue = Math.round(minOrMaxValue / 100 * boardData[currentBoard].maximums.soybeanMax * 10) / 10;
    return rawValue;
  }
  // calculate Mixed Fruits and Vegetables raw value
  // this.mixedFruitsAndVegetablesYieldScore[y] = 100 * this.yieldResults[y].mixedFruitsAndVegetablesYield / board.maximums.mixedFruitsAndVegetablesMax;
  if(idNum == 9){
    var rawValue = Math.round(minOrMaxValue / 100 * boardData[currentBoard].maximums.mixedFruitsAndVegetablesMax * 10) / 10;
    return rawValue;
  }
  // calculate Cattle raw value
  // this.cattleYieldScore[y] = 100 * this.yieldResults[y].cattleYield / board.maximums.cattleMax;
  if(idNum == 10){
    var rawValue = Math.round(minOrMaxValue / 100 * boardData[currentBoard].maximums.cattleMax * 10) / 10;
    return rawValue;
  }

  // calculate Alfalfa Hay raw value
  // this.alfalfaHayYieldScore[y] = 100 * this.yieldResults[y].alfalfaHayYield / board.maximums.alfalfaMax;
  if(idNum == 11){
    var rawValue = Math.round(minOrMaxValue / 100 * boardData[currentBoard].maximums.alfalfaMax * 10) / 10;
    return rawValue;
  }
  // calculate Grass Hay raw value
  // this.grassHayYieldScore[y] = 100 * this.yieldResults[y].grassHayYield / board.maximums.grassHayMax;
  if(idNum == 12){
    var rawValue = Math.round(minOrMaxValue / 100 * boardData[currentBoard].maximums.grassHayMax * 10) / 10;
    return rawValue;
  }
  // calculate Switchgrass Biomass raw value
  // this.switchgrassYieldScore[y] = 100 * this.yieldResults[y].switchgrassYield / board.maximums.switchgrassMax;
  if(idNum == 13){
    var rawValue = Math.round(minOrMaxValue / 100 * boardData[currentBoard].maximums.switchgrassMax * 10) / 10;
    return rawValue;
  }
  // calculate Wood raw value
  // this.woodYieldScore[y] = 100 * this.yieldResults[y].woodYield / board.maximums.woodMax;
  if(idNum == 14){
    var rawValue = Math.round(minOrMaxValue / 100 * boardData[currentBoard].maximums.woodMax * 10) / 10;
    return rawValue;
  }
  // calculate Short Rotation Woody Biomass raw value
  // this.shortRotationWoodyBiomassYieldScore[y] = 100 * this.yieldResults[y].shortRotationWoodyBiomassYield / board.maximums.shortRotationWoodyBiomassMax;
  if(idNum == 15){
    var rawValue = Math.round(minOrMaxValue / 100 * boardData[currentBoard].maximums.shortRotationWoodyBiomassMax * 10) / 10;
    return rawValue;
  }
}

// Set min or max position indicators in progress bar according to its id.
// i.e. make a white vertical bar appears in the progress bar which indicates the customized min/max value.
function setProgressbarMinMaxValues(id, option, value) {
  //if value is not numerical, disgard this change.
  if(isNaN(value) || value < 0 || value > 100)
    return;
  // if value < 0, we set it to be -10, if value > 100, then set it to be 110. Error protection.
  // if(value < 0) value = -10;
  // if(value > 100) value = 110;

  var children = document.getElementById(id).childNodes[3].childNodes;
  // console.log(children);
  if(option == 'min'){
    if(value < parseFloat(children[5].style.left)){
      children[3].style.left = value + "%";
    }
    // else{ //If min > max, then we remove max value
    //   children[5].style.left = "110%";
    // }

  }
  else if(option == 'max'){
    if(value > parseFloat(children[3].style.left)){
      children[5].style.left = value + "%";
    }
    // else{ //If min > max, then we remove min value
    //   children[3].style.left = "-10%";
    // }

  }



}

//Adds the given tileId and painter to the undoArr
function addChange(tileId) {
  if (uniqueTileChange(tileId)) {
    //Paint selector is a grid
    if (painterTool.status == 2 || randomizing || isShiftDown) {
      undoGridArr.push(tileId);
      //Paint selector is regular
    } else {
      undoArr[currentYear].push([tileId, boardData[currentBoard].map[tileId].landType[currentYear]]);
    }
  }
} //end addChange(gridBoolean,tileId)

function addPlayer(givenPlayer) {
  if (totalPlayers < 6) {
    totalPlayers++;
    //Toggled when you press the "Add player" button
    if (givenPlayer == null) {
      var tempPlayer = document.createElement("paintPlayer" + totalPlayers);
      tempPlayer.id = "paintPlayer" + totalPlayers;
      var playerString = "<div id='paintPlayer" + totalPlayers + "' class='players' onclick='changeSelectedPaintTo(" + totalPlayers + ");'" +
        "onmouseover='toggleChangeLandType();'' onmouseout='toggleChangeLandType();'>";
      playerString += "<img id='player" + totalPlayers + "Image' style='display:inline-block;' class='playerIcon iconSelected'" +
        " src='./imgs/player" + totalPlayers + "a.png'></div>";
      //Toggled when you are sorting boards
    } else {
      var tempPlayer = document.createElement("paintPlayer" + givenPlayer);
      tempPlayer.id = "paintPlayer" + givenPlayer;
      var playerString = "<div id='paintPlayer" + givenPlayer + "' class='players' onclick='changeSelectedPaintTo(" + givenPlayer + ");'" +
        "onmouseover='toggleChangeLandType();'' onmouseout='toggleChangeLandType();'>";
      playerString += "<img id='player" + givenPlayer + "Image' style='display:inline-block;' class='playerIcon iconSelected'" +
        " src='./imgs/player" + givenPlayer + "a.png'></div>";
    }
    tempPlayer.innerHTML = playerString;
    var whichSide = parseInt(tempPlayer.id.substr(11, 1));
    //On the left side
    if (whichSide % 2 != 0 || whichSide == 1) {
      document.getElementById("leftPlayerCon").appendChild(tempPlayer);
      //On the right side
    } else {
      document.getElementById("rightPlayerCon").appendChild(tempPlayer);
    }
    if (givenPlayer != undefined) {
      changeSelectedPaintTo(givenPlayer);
    } else {
      changeSelectedPaintTo(totalPlayers);
    }
  }
}

//flips the boolean overlayedToggled so that the transluscent map is set if the switch is clicked with no ocurrent overlay
function switchOverlayTemp(){
  var checkbox = document.getElementById("toggleOverlay");

  if(checkbox.checked == true && overlayedToggled == true){
    overlayTemp = true;
  }
  else{
    overlayTemp = false;
  }
}
//addTile constructs the geometry of a tile and adds it to the scene
function addTile(tile) {

  var tilesWide = boardData[currentBoard].width;
  var tilesHigh = boardData[currentBoard].height;

  var tileGeometry = new THREE.Geometry();
  var tileMaterial;
  var tileMaterial2;

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

    tile.h1 = (topN24 + topN23 + topN1 + tile.topography) / 4 * 5;
    tile.h2 = (topN23 + topN22 + top1 + tile.topography) / 4 * 5;
    tile.h3 = (top24 + top23 + top1 + tile.topography) / 4 * 5;
    tile.h4 = (top22 + top23 + topN1 + tile.topography) / 4 * 5;
if (tToggle) {
    v1 = new THREE.Vector3(0, tile.h1, 0);
    v2 = new THREE.Vector3(tileWidth, tile.h2, 0);
    v3 = new THREE.Vector3(tileWidth, tile.h3, tileHeight);
    v4 = new THREE.Vector3(0, tile.h4, tileHeight);

    riverHeight = (tile.h1 + tile.h2 + tile.h3 + tile.h4) / 4;
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



  //add texture to mesh for the overlay

  if (tile.landType[0] == 0) {

    tileMaterial2 = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.0
    });

    meshOverlay.push(tileMaterial2);
  } else if (tile.landType[0] == -1) {

    tileMaterial2 = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.7
    });

    meshOverlay.push(tileMaterial2);

  } else {

    if (!multiplayerAssigningModeOn) {
      tileMaterial2 = new THREE.MeshLambertMaterial({
        map: textureArray[tile.landType[currentYear]],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });

      var checkbox = document.getElementById("toggleOverlay");

      //if the overlay toggle is off, set opacity to 1, else make it transluscent
      if(checkbox.checked && overlayTemp == true){
        tileMaterial2.opacity = 0.4;
        tileMaterial2.map = grayTextureArray[tile.landType[currentYear]];
      }
      else{
        tileMaterial2.opacity = 1.0;
        tileMaterial2.map = textureArray[tile.landType[currentYear]];
      }

    } else {
      tileMaterial2 = new THREE.MeshLambertMaterial({
        map: ((tile.landType[currentYear] < multiplayerTextureArray.length) ? multiplayerTextureArray[tile.landType[currentYear]] : null),
        side: THREE.DoubleSide
      });
    }
    meshOverlay.push(tileMaterial2);
  }

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
        map: grayTextureArray[tile.landType[currentYear]],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0
      });

      /*var checkbox = document.getElementById("toggleOverlay");

      if(!checkbox.checked){
        tileMaterial.map = textureArray[tile.landType[currentYear]];
      }
      else {
        tileMaterial.map = grayTextureArray[tile.landType[currentYear]];
      }*/
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
  var newTile2 = new THREE.Mesh(tileGeometry, tileMaterial2);

  //change the x and z position of the tile dependent on the row and column that it is in
  newTile.position.x = tile.column * tileWidth - (tileWidth * tilesWide) / 2;
  newTile.position.y = 0;
  newTile.position.z = tile.row * tileHeight - (tileHeight * tilesHigh) / 2;

  tile.position = newTile.position;

  //add the mapID to the
  newTile.mapID = mapID;

  //add the tile to the meshGeometry which contains all vertices/faces of the merged tiles
  newTile.updateMatrix();
  meshGeometry.merge(newTile.geometry, newTile.matrix);

  newTile2.position.x = tile.column * tileWidth - (tileWidth * tilesWide) / 2;
  newTile2.position.y = 0;
  newTile2.position.z = tile.row * tileHeight - (tileHeight * tilesHigh) / 2;

  //add the mapID to the
  newTile2.mapID = mapID;

  //add the tile to the meshGeometry which contains all vertices/faces of the merged tiles
  newTile2.updateMatrix();
  meshGeometry2.merge(newTile2.geometry, newTile2.matrix);

} //end addTile


//addYearAndTransition updates the years to switch between in the left console and transitions to the new year
function addYearAndTransition() {
  var snackBar = document.getElementById("snackbarNotification");
  var totalYearsAllowed = 3;
  var nextYear = boardData[currentBoard].calculatedToYear+1;
  document.getElementById("yearToCopy").options[1].style.display = 'block';
  document.getElementById("yearToPaste").options[1].style.display = 'block';
  if(g_year1delete)
  {
    nextYear = 2;
  }
  if (curTracking) {
    pushClick(0, getStamp(), 41, 0, null);
  }

  //make next button appear (has some prebuilt functionality for expanded number of years)

  if (nextYear < totalYearsAllowed)
  {
    document.getElementById("year" + nextYear + "Button").className = "yearButton";
    document.getElementById("year" + nextYear + "Image").className = "icon yearNotSelected";
    document.getElementById("year" + nextYear + "Button").style.display = "block";
    //special case for adding year 3 when year 2 has been previously deleted in the presence of year 3
    if (year2to3)
    {
      switchYearTab(3);
      transitionToYear(4);

      document.getElementById("yearToCopy").options[3].style.display = 'block';
      document.getElementById("yearToPaste").options[3].style.display = 'block';
      year2to3 = false;
    }

    else
    {
    switchYearTab(nextYear);
    transitionToYear(nextYear);

    document.getElementById("yearToCopy").options[nextYear].style.display = 'block';
    document.getElementById("yearToPaste").options[nextYear].style.display = 'block';

    }
  }

  if (nextYear == totalYearsAllowed) {
    if (g_year1delete) {
      document.getElementById("year2Button").className = "yearButton";
      document.getElementById("year2Image").className = "icon yearNotSelected";
      document.getElementById("year2Button").style.display = "block";
//      document.getElementById("year2precipContainer").style.display = "block";
      nextYear = 2;
      g_year1delete = false;
    }
    else
    {
      document.getElementById("year3Button").className = "yearButton";
      document.getElementById("year3Image").className = "icon yearNotSelected";
      document.getElementById("year3Button").style.display = "block";
//      document.getElementById("year3precipContainer").style.display = "block";
    }
    switchYearTab(nextYear);
    transitionToYear(nextYear);
    document.getElementById("yearToCopy").options[nextYear].style.display = 'block';
    document.getElementById("yearToPaste").options[nextYear].style.display = 'block';
  }

  if (nextYear > totalYearsAllowed) {
    snackBar.innerHTML = "Cannot add more than 3 years!";
    snackBar.className = "show";
    setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
    nextYear -= 1;
    switchYearTab(nextYear);
    transitionToYear(nextYear);
    document.getElementById("yearToCopy").options[nextYear].style.display = 'block';
    document.getElementById("yearToPaste").options[nextYear].style.display = 'block';
  }
  //switch to next year
  // refresh the progress bar
  calculateResults();
  refreshProgressBar(currentYear);
} //end addYearAndTransition


/* deleteYearAndTransition deletes the selected year
   Gets the year selected from transitionToYear, when the user selects which year to delete
   uses the helper year2and3Delete() in the special cases
*/
function deleteYearAndTransition()
{
  var snackBar = document.getElementById("snackbarNotification");
  var currMaxYear = boardData[currentBoard].calculatedToYear;
  maxYear = currMaxYear;
  // cursor tracking
  if(curTracking)
  {
    pushClick(0, getStamp(), 103, 0 , yearSelected);
  }

//if somehow the selected year is year 0, don't have an option for deleting the year
  if(!yearSelected)
  {
    yearSelected = 1;
  }
    var response;
      if(yearSelected == 1)
      {
        //if selected year is 1 and there are no other years
        if(currMaxYear == 1)
         {
           snackBar.innerHTML = "Cannot delete year 1!";
           snackBar.className = "show";
           setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
           yearSelected = 1;
           currMaxYear = 1;
           g_isDeleted = false;
           g_year1delete = false;
         }
         else
         {
           g_year1delete = true;
           snackBar.innerHTML = "Deleted year " + yearSelected + "!";
           snackBar.className = "show";
           setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
           // Remove Yes/no confirmation buttons after user has selected an option
           document.getElementById('yesDelete').style.display = "none";
           document.getElementById('noDelete').style.display = "none";
           document.getElementById('confirmYearDelete').style.display = "none";
           }

           //make copy field blank if deleted year was selected
           if(yearSelected == yearCopyPaste){
             document.getElementById("yearToCopy").value = 0;
             document.getElementById("yearPasteButton").style.display = "none";
           }

           document.getElementById("year" + currMaxYear + "Button").style.display = "none";
           document.getElementById("yearToCopy").options[currMaxYear].style.display = 'none';
           document.getElementById("yearToPaste").options[currMaxYear].style.display = 'none';
           snackBar.innerHTML = "Year 2 is now Year 1!";
           snackBar.className = "show";
           setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
           //copy year 2 to year 1 - including the precipitation
           boardData[currentBoard].precipitation[yearSelected] = boardData[currentBoard].precipitation[2];
           document.getElementById("year" + yearSelected+ "Precip").value = reversePrecipValue(boardData[currentBoard].precipitation[yearSelected]);
           transitionToYear(2);
           switchYearTab(1);
           boardData[currentBoard].calculatedToYear = 1;
           currMaxYear -=1;
           yearSelected = 1;
           //and if there is a year 3- copy it to year 2 and set year 3 as default.
           if(maxYear == 3)
           {
             boardData[currentBoard].calculatedToYear = 3;
             //when year 2 is deleted, we transition to 3 so that year 3 = year 2 and highlight the year 2; then year 3 is default
            //this includes the precipitation too
             year2and3Delete();
          }
         }


      //special case - deletes year 2 when year 3 is present and then makes year 2 = year 3 and the next year, i.e year 3 as default
      else if(yearSelected == 2 && currMaxYear == 3)
      {
        snackBar.innerHTML = "Deleted year " + yearSelected + "!";
        snackBar.className = "show";
        setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
        // Remove Yes/no confirmation buttons after user has selected an option
        document.getElementById('yesDelete').style.display = "none";
        document.getElementById('noDelete').style.display = "none";
        document.getElementById('confirmYearDelete').style.display = "none";

        //make copy field blank if deleted year was selected
        if(yearSelected == yearCopyPaste){
          document.getElementById("yearToCopy").value = 0;
          document.getElementById("yearPasteButton").style.display = "none";
        }

        //delete the button of the year - actual deletion is done in transitionToYear
        document.getElementById("year3Button").style.display = "none";
        document.getElementById("yearToCopy").options[3].style.display = 'none';
        document.getElementById("yearToPaste").options[3].style.display = 'none';
        //make it year 2
        year2and3Delete();
      }
      else
      {
        snackBar.innerHTML = "Deleted year " + yearSelected + "!";
        snackBar.className = "show";
        setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
        //delete the button of the year - actual deletion is done in transitionToYear
        document.getElementById("year" + yearSelected + "Button").style.display = "none";
        document.getElementById("yearToCopy").options[yearSelected].style.display = 'none';
        document.getElementById("yearToPaste").options[yearSelected].style.display = 'none';

        //make copy field blank if deleted year was selected
        if(yearSelected == yearCopyPaste){
          document.getElementById("yearToCopy").value = 0;
          document.getElementById("yearPasteButton").style.display = "none";
        }

        currMaxYear -=1;
        yearSelected -= 1;
        g_isDeleted = true;

        //switch to the previous year
        transitionToYear(yearSelected);
        switchYearTab(yearSelected);
        // Remove Yes/no confirmation buttons after user has selected an option
        document.getElementById('yesDelete').style.display = "none";
        document.getElementById('noDelete').style.display = "none";
        document.getElementById('confirmYearDelete').style.display = "none";

      }

    //if the maximum year is 1 now, don't show the option in  the copy and paste boxes
    if(boardData[currentBoard].calculatedToYear == 1)
    {
      document.getElementById("yearToCopy").options[1].style.display = 'none';
      document.getElementById("yearToPaste").options[1].style.display = 'none';
    }
    // refresh the progress bar
    // calculateResults();
    refreshProgressBar(currentYear);
}// end deleteYearAndTransition

// function to be called if user decides to not delete a year.

function yearNotDeleted() {


  g_isDeleted = false;
  // Remove Yes/no confirmation buttons after user has selected an option
  document.getElementById('yesDelete').style.display = "none";
  document.getElementById('noDelete').style.display = "none";
  document.getElementById('confirmYearDelete').style.display = "none";
  if (curTracking)
  {
    pushClick(0, getStamp(), 111, 0, null);
  }
}



// animateResults() frame
function animateResults() {
  //if it is ever the case that we want to do some fancy zooming or screen
  //  arrangement for the results page, we'll do that here
  document.getElementById("resultsFrame").className = "resultsFrame";
} //end animateResults

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

/**
 * calculateResults triggers the results calculations by updating Totals
 * @param  {[type]} tileId [description]
 * @param  {[type]} y     year
 *
 */
function calculateResults(tileId, y) {
  var year;
  if(typeof y!='undefined'){
    year=y;
  }else{
    year=yearSelected;

  }
  Totals.update(tileId, year);
  //contaminatedRiver(Totals);
} //end calculateResults

//changeLandTypeTile changes the landType of a selected tile
function changeLandTypeTile(tileId, inYear) {
  let year = inYear || currentYear
  //console.log(boardData[currentBoard].map[tileId]);
  if (document.getElementById("overlayContainer").style.visibility != "visible" && document.getElementById("combineButton").innerHTML != "Merge") {
    //Add tile to the undoArr
    if (!undo) {
      addChange(tileId);
    }
    //if land type of tile is nonzero
    if (boardData[currentBoard].map[tileId].landType[year] != 0) {
      //change the materials of the faces in the meshMaterials array and update the boardData
      if (!multiplayerAssigningModeOn) {
        // textureArray is a global array that links to each landType image, it was load in loader.js
        // by changing the reference on meshMaterials array, three.js will draw it on canvas automatically

        //wetlands are restricted within flat lands, i.e 0-2% only
        if(painter == 14 && (Number(boardData[currentBoard].map[tileId].topography) >= 2) && !randomizing)
        {
          //dont highlight
        }
        else
        {
          var checkbox = document.getElementById("toggleOverlay");
          // If the land type remains the same, then do nothing, otherwise,change the land type, and update progress bars
          if(meshMaterials[tileId].map != grayTextureArray[painter]){
            // console.log('Change the land type in tile which id is ', tileId);
            if(overlayTemp == true && checkbox.checked){
              meshOverlay[tileId].map = grayTextureArray[painter];
              meshMaterials[tileId].map = grayTextureArray[painter];

            }
            else{
              meshMaterials[tileId].map = textureArray[painter];
              meshOverlay[tileId].map = textureArray[painter];

            }
            // record the data changes in boardData
            boardData[currentBoard].map[tileId].landType[year] = painter;
            // update boardData figures
            boardData[currentBoard].map[tileId].update(year);
            // Whenever land type of the tile is changed, recalculate the results in order to update the progress bars
            calculateResults(tileId, year);
            //console.log(boardData[currentBoard].map[tileId]);
          }
        }
      } else if (multiplayerAssigningModeOn) {
        meshMaterials[tileId].map = multiplayerTextureArray[painter];
        meshOverlay[tileId].map = multiplayerTextureArray[painter];
        boardData[currentBoard].map[tileId].landType[currentYear] = painter;
      } // end if/else
    } // end if
    if (curTracking && painterTool.status != 2 && !undo && !randomizing && !isShiftDown) {
      pushClick(0, getStamp(), 55, 0, tileId);
    }
  } // end outter if

} //end changeLandTypeTile

//Updates Nitrate score for entire map since each individual Tile's score hinges on landtypes across the entire map
//This function is called after each instance of a changeLandTypeTile() call
function changeLandTypeTileNitrate(tileId){
  if (document.getElementById("overlayContainer").style.visibility != "visible" && document.getElementById("combineButton").innerHTML != "Merge") {
    //If this function is called, it means changeLandTypeTile() was just called, meaning every tile in the map needs to be recalculated
    //Hence the for loop
      if(typeof tileId=='undefined'){

        boardData[currentBoard].updateAllTileNitrate(currentYear);
      }else{
        //if land type of tile is nonzero
        if (boardData[currentBoard].map[tileId].landType[currentYear] != 0) {
          //change the materials of the faces in the meshMaterials array and update the boardData
          if (!multiplayerAssigningModeOn) {

            boardData[currentBoard].map[tileId].updateNitrate(currentYear);
          }
        }
    }

    refreshProgressBar(currentYear);
  } // end outter if
} //end changeLandTypeTile

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
    selectedLandType = painter;
    //Glossary chat box entries for each landuse type
    switch (painterElementId) {
      case 'paint1':
        updateGlossaryPopup('To learn more about <span style="color:orange">Conventional Corn</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint2':
        updateGlossaryPopup('To learn more about <span style="color:orange">Conservation Corn</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint3':
        updateGlossaryPopup('To learn more about <span style="color:orange">Conventional Soybean</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint4':
        updateGlossaryPopup('To learn more about <span style="color:orange">Conservation Soybean</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint5':
        updateGlossaryPopup('To learn more about <span style="color:orange">Alfalfa Hay</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint6':
        updateGlossaryPopup('To learn more about <span style="color:orange">Permanent Pasture</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint7':
        updateGlossaryPopup('To learm more about <span style="color:orange">Rotational Grazing</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint8':
        updateGlossaryPopup('To learn more about <span style="color:orange">Grass Hay</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint9':
        updateGlossaryPopup('To learn more about <span style="color:orange">Prarie</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint10':
        updateGlossaryPopup('To learn more about <span style="color:orange">Conservation Forest</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint11':
        updateGlossaryPopup('To learn more about <span style="color:orange">Conventional Forest</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint12':
        updateGlossaryPopup('To learn more about <span style="color:orange">Switchgrass</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint13':
        updateGlossaryPopup('To learn more about <span style="color:orange">Short Rotation Woody Bioenergy</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint14':
        updateGlossaryPopup('To learn more about <span style="color:orange">Wetland</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      case 'paint15':
        updateGlossaryPopup('To learn more about <span style="color:orange">Mixed Fruits and Vegetables</span>, go to the <span style="color:yellow">Glossary</span> and select <span style="color:yellow">"Land Use"</span>.');
        break;
      default:
        updateGlossaryPopup('');
        break;
    } // END switch

    // if it's grid painting mode and the user click to switch painter, erase the first seleted tile
    if (painterTool.status == 2) {
      painterTool.status = 1; // ready to do grid paint
    }

    //have land type update immediately, well, pretend the mouse moved...
    highlightTile(-1);

    // store last users action ( print function )
    if (!modalUp) {
      storeCurrentCameraSession(0, newPaintValue);
    } // END if
  } else {

    //If we are merging players together
    if (document.getElementById("combineButton").innerHTML == "Merge" && merging == false) {
      //If we already selected that player, deselect and remove it from the list to combine
      var playerIndex = playerCombo.indexOf(newPaintValue);
      if (playerIndex != -1) {
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

/**
 * check file type, returns true if is CSV or JSON file
 *
 * @param filename
 * @returns boolean value
 */
function checkFileType(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'csv':
    case 'json':
      return true;
  }
  return false;
} // checkFileType()

// clean current boardData
function cleanCurrentBoardData() {
  // set boardData as undefined
  boardData[currentBoard] = void 0;
}

//clearInfo removes text from the bottom HUD
function clearInfo() {
  document.getElementById("currentInfo").innerHTML = " ";
} //end clearInfo

//clearPopup removes all text from the popup dialogue and hides it
function clearPopup() {
  document.getElementById("popupText").innerHTML = " ";
  document.getElementById("popup").className = "popupHidden";
  document.getElementById("bookMarkButton").className = "bookMarkButtonRolled";
} //end clearPopup

//Clears all relative timers
function clearTimers() {
  for (var j = 0; j < mainTimer.length; j++) {
    clearTimeout(mainTimer[j]);
  }
  clearTimeout(exitTimer);
  clearInterval(sliderTimer);
} //end clearTimers()

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
  // removeEvent(document, 'keyup', aboutsEsc);
} //end closeCreditFrame

//closeEmailFrame closes the contact us iframe
function closeEmailFrame() {
  if (curTracking) {
    pushClick(0, getStamp(), 33, 0, null); // The parameters may need to change, have no idea what this method does.
  }
  document.getElementById('emailFrame').style.display = "none";
  document.getElementById('closeEmail').style.display = "none";
  document.getElementById('modalEmailFrame').style.display = "none";
  modalUp = false;
  //Event listner that closes escape key
  document.removeEventListener('keyup', emailEsc);
  // removeEvent(document, 'keyup', aboutsEsc);
} //end closeCreditFrame

// close printOptions frame
function closePrintOptions() {

  if (curTracking) {
    pushClick(0, getStamp(), 115, null);
  }

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  //scroll page to top, so that next time options is loaded it starts there
  window.frames[7].scrollTo(0, 0);

  //close frame
  document.getElementById('printOptions').style.visibility = "hidden";
  // restore previous user state
  restoreCurrentCameraSession();
  modalUp = false;
  //make sure the frame is no longer accepting input such as keyboard or mouse events
  document.activeElement.blur();
  // remove Esc key event listener
  document.removeEventListener('keyup', printOptionsEsc);
  window.frames[7].document.removeEventListener('keyup', printOptionsEsc);
} // end closePrintOptions

function resizeForPrinting() {
  camera.aspect = 1.5;
  camera.updateProjectionMatrix();
}

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
  // removeEvent(document, 'keyup', downuploadEsc);
} //end closeUploadDownloadFrame

//Function that allows for multiple players to be combined into one player
function combinePlayers() {
  if (document.getElementById("combineButton").innerHTML == "Combine Players" && totalPlayers > 1) {
    // console.log("Combining players...");
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
    // console.log("Merging players...");
    //Reset selections
    for (var i = 0; i < playerCombo.length; i++) {
      var painterElementId = "player" + playerCombo[i] + "Image";
      document.getElementById(painterElementId).className = "playerIcon icon";
    }
    document.getElementById("combineButton").innerHTML = "Combine Players";
    if (playerCombo.length > 1) {
      combineMulti(playerCombo);
    }
    playerCombo = [];
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


  for (var i = 0; i < boardData[currentBoard].map.length; i++) {
    var curValue = boardData[currentBoard].map[i].landType[currentYear];
    if (givenPlayers.indexOf(curValue) != -1) {
      changeLandTypeTile(i);
    }
  }

changeLandTypeTileNitrate();

  //Delete the other (now unused) players
  givenPlayers.shift();
  for (var i = 0; i < givenPlayers.length; i++) {
    deletePlayer(givenPlayers[i]);
  }
  merging = false;
} //end combineMulti(givenPlayers)

function confirmExit() {
  if (curTracking) {
    pushClick(0, getStamp(), 2, 0, null);
    return "You are currently in click-tracking mode, please stay on the page. To refresh, please leave click-tracking mode";
  }
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

//depends on the variable yearSelected from transitionToYear
function copyYear()
{
  document.getElementById("yearCopyButton").classList.toggle("show");
  yearCopyPaste = document.getElementById("yearToCopy").value;
  document.getElementById("yearPasteButton").style.display = "block";
  document.getElementById("yearToCopy").style.display = "block";
  //Hide the option of pasting the same year to itself
  document.getElementById("yearToPaste").options[yearCopyPaste].style.display = 'none';
  if (curTracking)
  {
    // sending the yearCopyPaste value at tileID position to store it and reproduce it during run simulation
    pushClick(0, getStamp(), 101, 0, yearCopyPaste);
  }

} //end copyYear

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

//For creating a manual scrolling event (Used in click tracking for PEWI map zooming [vertical position only])
function customCameraView(position) {
  var customScroll = new CustomEvent("MozMousePixelScroll1", {
    detail: -1 * parseInt(position)
  });
  window.dispatchEvent(customScroll);
} //end customCameraView(position)

//For creating a manual directional event (Used in click tracking for PEWI map navigation)
function customDirectionalInput(input, keycode) {
  var customInput = new KeyboardEvent("keydown", {
    code: input,
    keyCode: keycode
  });
  window.dispatchEvent(customInput);
} //end customDirectionalInput(input, keycode)

//For creating a manual mouse click-and-drage events (Used in click tracking for PEWI map navigation)
function customMouseInput(buttonInput, drag) {
  var inputX = parseFloat(buttonInput[0]);
  var inputY = parseFloat(buttonInput[1]);
  var sX = parseFloat(buttonInput[2]);
  var sY = parseFloat(buttonInput[3]);
  var mX = parseFloat(buttonInput[4]);
  var mY = parseFloat(buttonInput[5]);
  if (!drag) {
    var customMouse = new MouseEvent("mousedown", {
      button: 2,
      buttons: 2,
      clientX: inputX,
      clientY: inputY,
      layerX: 9,
      layerY: inputY,
      screenX: sX,
      screenY: sY,
      movementX: mX,
      movementY: mY
    });
    document.getElementById('genOverlay').dispatchEvent(customMouse);
  } else {
    var customMouse = new MouseEvent("mousemove", {
      button: 0,
      buttons: 2,
      clientX: inputX,
      clientY: inputY,
      layerX: inputX,
      layerY: inputY,
      screenX: sX,
      screenY: sY,
      movementX: mX,
      movementY: mY
    });
    window.dispatchEvent(customMouse);
  }
} //end customMouseInput(buttonInput, drag)

//Handles the delete button feature
function deleteAndSort() {
  //Saves the previous current player
  var tempCurrentPlayer = getCurrentPlayer();
  combineMulti([1, getCurrentPlayer()]);
  sortPlayers();
  if (tempCurrentPlayer < totalPlayers) {
    changeSelectedPaintTo(tempCurrentPlayer);
  } else {
    changeSelectedPaintTo(totalPlayers);
  }
}

//Allows the user to delete a player
function deletePlayer(givenPlayer) {
  if (totalPlayers > 1) {
    document.getElementById("paintPlayer" + givenPlayer).remove();
    totalPlayers--;
  }
} //end deletePlayer()

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

  for (var i = 0; i < meshGeometry2.faces.length; i += 2) {
    meshGeometry2.faces[i].materialIndex = i / 2;
    meshGeometry2.faces[i + 1].materialIndex = i / 2;
  }
  //create one mesh from the meshGeometry and meshMaterials objects
  mesh = new THREE.Mesh(meshGeometry, new THREE.MeshFaceMaterial(meshMaterials));
  mesh2 = new THREE.Mesh(meshGeometry2, new THREE.MeshFaceMaterial(meshOverlay));

  scene.add(mesh2);
  scene.add(mesh);

  //calculate locations of tiles on grid for highlighting and landType changes
  calculateCutoffs();
} //end displayBoard

//displayFirework adds a single great ball of fire
function displayFirework() {
  createFirework(11, 61, 6, 2, null, null, null, null, false, true);
  return 1;
} //end displayFirework

//displayLevels highlight each tile using getHighlightColor method
function displayLevels(overlayHighlightType) {
  var selectionHighlightNumber = 0;

  var checkbox = document.getElementById("toggleOverlay");
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
      updateGlossaryPopup('To learn more about <span style="color:orange;">Nitrate</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 42, 0, null);
      }
      break;
    case 'erosion':
      selectionHighlightNumber = 2;
      updateGlossaryPopup('To learn more about <span style="color:orange;">Erosion</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Soil Quality"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 43, 0, null);
      }
      break;
    case 'phosphorus':
      selectionHighlightNumber = 3;
      updateGlossaryPopup('To learn more about <span style="color:orange;">Phosphorus</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 44, 0, null);
      }
      break;
    case 'flood':
      selectionHighlightNumber = 4;
      updateGlossaryPopup('This map shows the <span style="color:orange;">frequency of flooding</span> for each grid cell. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 45, 0, null);
      }
      break;
    case 'drainage':
      selectionHighlightNumber = 5;
      updateGlossaryPopup('This map shows the <span style="color:orange;">drainage</span> for each pixel. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 48, 0, null);
      }
      break;
    case 'wetlands':
      selectionHighlightNumber = 6;
      updateGlossaryPopup('This map shows the locations for each <span style="color:orange;">strategic wetland</span>. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 46, 0, null);
      }
      break;
    case 'boundary':
      selectionHighlightNumber = 7;
      updateGlossaryPopup('This map shows the <span style="color:orange;">boundaries of each subwatershed</span>. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 47, 0, null);
      }
      break;
    case 'soil':
      selectionHighlightNumber = 8;
      updateGlossaryPopup('There are <span style="color:orange;">thirteen</span> different soil classes that each have different properties. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 49, 0, null);
      }
      break;
    case 'topo':
      selectionHighlightNumber = 9;
      updateGlossaryPopup('This map shows the <span style="color:orange;">topography</span> for each grid cell. To learn more, go to the <span style="color:yellow;">Index</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 50, 0, null);
      }
      break;
      // yield
    case 'corn':
      selectionHighlightNumber = 10;
      if (curTracking) {
        pushClick(0, getStamp(), 69, 0, null);
      }
      break;
    case 'soybean':
      selectionHighlightNumber = 11;
      if (curTracking) {
        pushClick(0, getStamp(), 70, 0, null);
      }
      break;
    case 'fruit':
      selectionHighlightNumber = 12;
      if (curTracking) {
        pushClick(0, getStamp(), 71, 0, null);
      }
      break;
    case 'cattle':
      selectionHighlightNumber = 13;
      if (curTracking) {
        pushClick(0, getStamp(), 72, 0, null);
      }
      break;
    case 'alfalfa':
      selectionHighlightNumber = 14;
      if (curTracking) {
        pushClick(0, getStamp(), 73, 0, null);
      }
      break;
    case 'grasshay':
      selectionHighlightNumber = 15;
      if (curTracking) {
        pushClick(0, getStamp(), 74, 0, null);
      }
      break;
    case 'switchgrass':
      selectionHighlightNumber = 16;
      if (curTracking) {
        pushClick(0, getStamp(), 75, 0, null);
      }
      break;
    case 'wood':
      selectionHighlightNumber = 17;
      if (curTracking) {
        pushClick(0, getStamp(), 76, 0, null);
      }
      break;
    case 'short':
      selectionHighlightNumber = 18;
      if (curTracking) {
        pushClick(0, getStamp(), 77, 0, null);
      }
      break;
    case 'sediment':
     selectionHighlightNumber = 19;
     updateGlossaryPopup('To learn more about <span style="color:orange;">Sediment Control</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
     if (curTracking) {
       pushClick(0, getStamp(), 121, 0, null);
     }
     break;

    case 'carbon':
    selectionHighlightNumber = 20;
    updateGlossaryPopup('To learn more about <span style="color:orange;">Carbon Sequestration</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
    if (curTracking) {
      pushClick(0, getStamp(), 119, 0, null);
    }
    break;

    case 'gamewildlife':
    selectionHighlightNumber = 21;
    updateGlossaryPopup('To learn more about <span style="color:orange;">Game Wildlife</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
    if (curTracking) {
      pushClick(0, getStamp(), 118, 0, null);
    }
    break;

    case 'biodiversity':
    selectionHighlightNumber = 22;
    updateGlossaryPopup('To learn more about <span style="color:orange;">Biodiversity</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
    if (curTracking) {
      pushClick(0, getStamp(), 117, 0, null);
    }
    break;

    case 'nitratetile':
    selectionHighlightNumber = 23;
    updateGlossaryPopup('To learn more about <span style="color:orange;">Nitrate</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
    if (curTracking) {
      pushClick(0, getStamp(), 120, 0, null);
    }
    break;
  } //end switch

  //save selectionHighlightNumber for quick access via hotkey
  if (selectionHighlightNumber != 0) {
    previousOverlay = overlayHighlightType;
  }
    if (!mapIsHighlighted) {
      if(checkbox.checked == true){
        overlayTemp = true;
      }
      else{
        overlayTemp = false;
      }
      refreshBoard();

      drawOverlayOntoBoard(selectionHighlightNumber, overlayHighlightType);
    }
    //if the map is previously highlighted
    else {
      //if the highlight is the same... turn it off
      if (currentHighlightType == selectionHighlightNumber || selectionHighlightNumber == 0) {

        if(overlayTemp == true){
          overlayTemp = false;
        }
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
        drawOverlayOntoBoard(selectionHighlightNumber, overlayHighlightType);
      } //end else/if group
    }

  //}

  // store last users action ( print function )
  if (!modalUp) {
    storeCurrentCameraSession(1, overlayHighlightType);
  } // END if
} //end displayLevels()

//here we draw the correct tile colors onto the board material mesh
/*function drawLevelsOntoBoard(selectionHighlightNumber, highlightType) {

  //change global highlighting setting to set
  mapIsHighlighted = true;

  //update results
  //I think there's no need to redefine Totals and update it. Since there's nothing changed in boardData
  // Totals = new Results(boardData[currentBoard]);
  // Totals.update();

  //add highlighted textures to the map
  //for each tile in the board
  for (var i = 0; i < boardData[currentBoard].map.length; i++) {
    //if there is an actual tile there
    if (boardData[currentBoard].map[i].landType[currentYear] != 0) {
      //then change mesh material
      //meshOverlay[i].map = highlightArray[getHighlightColor(highlightType, i)];
        meshMaterials[i].map = highlightArray[getHighlightColor(highlightType, i)];

    } //end if
  } //end for


  showLevelDetails(selectionHighlightNumber);
  currentHighlightType = selectionHighlightNumber;
  currentHighlightTypeString = highlightType;
} //end drawLevelsOntoBoard
*/
//Called when toggle overlay button is clicked, redraws overlay with new transparency
function redrawOverlay(highlightType){
  var selectionHighlightNumber = 0;

  highlightType = previousOverlay;

  switch (highlightType) {
    case 'nitrate':
      selectionHighlightNumber = 1;
      updateGlossaryPopup('To learn more about <span style="color:orange;">Nitrate</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 42, 0, null);
      }
      break;
    case 'erosion':
      selectionHighlightNumber = 2;
      updateGlossaryPopup('To learn more about <span style="color:orange;">Erosion</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Soil Quality"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 43, 0, null);
      }
      break;
    case 'phosphorus':
      selectionHighlightNumber = 3;
      updateGlossaryPopup('To learn more about <span style="color:orange;">Phosphorus</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 44, 0, null);
      }
      break;
    case 'flood':
      selectionHighlightNumber = 4;
      updateGlossaryPopup('This map shows the <span style="color:orange;">frequency of flooding</span> for each grid cell. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 45, 0, null);
      }
      break;
    case 'drainage':
      selectionHighlightNumber = 5;
      updateGlossaryPopup('This map shows the <span style="color:orange;">drainage</span> for each pixel. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 48, 0, null);
      }
      break;
    case 'wetlands':
      selectionHighlightNumber = 6;
      updateGlossaryPopup('This map shows the locations for each <span style="color:orange;">strategic wetland</span>. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 46, 0, null);
      }
      break;
    case 'boundary':
      selectionHighlightNumber = 7;
      updateGlossaryPopup('This map shows the <span style="color:orange;">boundaries of each subwatershed</span>. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 47, 0, null);
      }
      break;
    case 'soil':
      selectionHighlightNumber = 8;
      updateGlossaryPopup('There are <span style="color:orange;">thirteen</span> different soil classes that each have different properties. To learn more, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 49, 0, null);
      }
      break;
    case 'topo':
      selectionHighlightNumber = 9;
      updateGlossaryPopup('This map shows the <span style="color:orange;">topography</span> for each grid cell. To learn more, go to the <span style="color:yellow;">Index</span> and select <span style="color:yellow;">"Physical Features"</span>.');
      if (curTracking) {
        pushClick(0, getStamp(), 50, 0, null);
      }
      break;
      // yield
    case 'corn':
      selectionHighlightNumber = 10;
      if (curTracking) {
        pushClick(0, getStamp(), 69, 0, null);
      }
      break;
    case 'soybean':
      selectionHighlightNumber = 11;
      if (curTracking) {
        pushClick(0, getStamp(), 70, 0, null);
      }
      break;
    case 'fruit':
      selectionHighlightNumber = 12;
      if (curTracking) {
        pushClick(0, getStamp(), 71, 0, null);
      }
      break;
    case 'cattle':
      selectionHighlightNumber = 13;
      if (curTracking) {
        pushClick(0, getStamp(), 72, 0, null);
      }
      break;
    case 'alfalfa':
      selectionHighlightNumber = 14;
      if (curTracking) {
        pushClick(0, getStamp(), 73, 0, null);
      }
      break;
    case 'grasshay':
      selectionHighlightNumber = 15;
      if (curTracking) {
        pushClick(0, getStamp(), 74, 0, null);
      }
      break;
    case 'switchgrass':
      selectionHighlightNumber = 16;
      if (curTracking) {
        pushClick(0, getStamp(), 75, 0, null);
      }
      break;
    case 'wood':
      selectionHighlightNumber = 17;
      if (curTracking) {
        pushClick(0, getStamp(), 76, 0, null);
      }
      break;
    case 'short':
      selectionHighlightNumber = 18;
      if (curTracking) {
        pushClick(0, getStamp(), 77, 0, null);
      }
      break;
    case 'sediment':
     selectionHighlightNumber = 19;
     updateGlossaryPopup('To learn more about <span style="color:orange;">Sediment Control</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
     if (curTracking) {
       pushClick(0, getStamp(), 78, 0, null);
     }
     break;

    case 'carbon':
    selectionHighlightNumber = 20;
    updateGlossaryPopup('To learn more about <span style="color:orange;">Carbon Sequestration</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
    if (curTracking) {
      pushClick(0, getStamp(), 79, 0, null);
    }
    break;

    case 'gamewildlife':
    selectionHighlightNumber = 21;
    updateGlossaryPopup('To learn more about <span style="color:orange;">Game Wildlife</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
    if (curTracking) {
      pushClick(0, getStamp(), 80, 0, null);
    }
    break;

    case 'biodiversity':
    selectionHighlightNumber = 22;
    updateGlossaryPopup('To learn more about <span style="color:orange;">Biodiversity</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
    if (curTracking) {
      pushClick(0, getStamp(), 81, 0, null);
    }
    break;

    case 'nitratetile':
    selectionHighlightNumber = 23;
    updateGlossaryPopup('To learn more about <span style="color:orange;">Nitrate</span>, go to the <span style="color:yellow;">Glossary</span>, select "Modules" and then <span style="color:yellow;">"Water Quality"</span>.');
    if (curTracking) {
      pushClick(0, getStamp(), 82, 0, null);
    }
    break;
  }


  if(highlightType != null){
    drawOverlayOntoBoard(selectionHighlightNumber, highlightType);
    showLevelDetails(selectionHighlightNumber);

  }

}
// For drawing overlay map
function drawOverlayOntoBoard(selectionHighlightNumber, highlightType) {

  //change global highlighting setting to set
  mapIsHighlighted = true;

  //update results
  //I think there's no need to redefine Totals and update it. Since there's nothing changed in boardData
  // Totals = new Results(boardData[currentBoard]);
  // Totals.update();

  //add highlighted textures to the map
  //for each tile in the board
  for (var i = 0; i < boardData[currentBoard].map.length; i++) {
    //if there is an actual tile there
    if (boardData[currentBoard].map[i].landType[currentYear] != 0) {
      //then change mesh material
        meshOverlay[i].map = highlightArray[getHighlightColor(highlightType, i)];
    } //end if
  } //end for


  showLevelDetails(selectionHighlightNumber);
  currentHighlightType = selectionHighlightNumber;
  currentHighlightTypeString = highlightType;
}

//endMultiAssignMode displays the multiPlayer element
function endMultiplayerAssignMode() {
  //create an iframe, select up to 6 players
  //then downloads
  var currentPlayers = document.getElementsByClassName("players");
  for (var i = 1; i < currentPlayers.length + 1; i++) {
    var foundPlayerTile = false;
    for (var j = 0; j < boardData[currentBoard].map.length; j++) {
      if (boardData[currentBoard].map[j].landType[1] == i) {
        foundPlayerTile = true;
      }
    }
    if (foundPlayerTile == false) {
      break;
    }
  }
  if (foundPlayerTile) {
    document.getElementById('multiplayer').style.visibility = "visible";
  } else {
    alert("Not all players have allocated land plots; please delete or add land plots for these players.");
  }

} //end endMultiAssignMode

//Handles the end of a simulation (or when a user pauses the sim)
function endSimPrompt() {
  paused = true;
  pauseSim();
  document.getElementById("genOverlay").style.visibility = "hidden";
  document.getElementById("simContainer").style.visibility = "visible";
} //end endSimPrompt()

// triggers PDF generating process according to chosen print options
// And either render it in the preview or prompt download dialogue
function executePrintOptions(isDownload) {
  // initialize jspdfprinter as a global object
  jspdfprinter = new Printer();

  var checkbox = window.top.document.getElementById("toggleOverlay");
  bool = checkbox.checked;
  checkbox.checked = false;
  switchOverlayTemp();refreshBoard();redrawOverlay();

  // process chosen print options
  var strRawContents = document.getElementById('print-option-parameters').innerHTML;
  //split based on escape chars
  while (strRawContents.indexOf("\r") >= 0) {
    strRawContents = strRawContents.replace("\r", "");
  }
  var arrLines = strRawContents.split("\n");
  // global array that record the print options
  toPrint = {
    // land use map
    yearUserViewpoint: false,
    year1: false,
    year2: false,
    year3: false,
    // feature maps
    featureUserViewpoint: false,
    flood: false,
    wetlands: false,
    boundary: false,
    drainage: false,
    soil: false,
    topo: false,
    // yield maps
    yieldUserViewpoint: false,
    corn: false,
    soybean: false,
    fruit: false,
    cattle: false,
    alfalfa: false,
    grasshay: false,
    switchgrass: false,
    wood: false,
    short: false,
    // result maps
    levelUserViewpoint: false,
    nitrate: false,
    erosion: false,
    phosphorus: false,
    sediment: false,
    carbon: false,
    gamewildlife: false,
    biodiversity: false,
    nitratetile: false,
    // results
    resultsTable1: false,
    resultsTable2: false,
    resultsTable3: false,
    resultsLanduse: false,
    resultsEcosystem: false,
    resultsPrecip: false,
  };

  // set chosen ones to true
  for (var i = 0; i < arrLines.length - 1; i++) {
    toPrint[arrLines[i].substr(0, arrLines[i].indexOf("-"))] = true;
  }

  // trigger preprocessing
  takeScreenshot = true; // triggers the if statement in animationFrames() in mainFE.js
  alert("Creating PDF... \n(click to continue)");
  setTimeout(function() {
    // wait for preprocessing
    jspdfprinter.processing(isDownload);
    jspdfprinter = {}; // clean object
  }, 100);
  checkbox.checked = bool;

} //end executePrintOptions

//Handles exporting the clicks given by the user
function exportTracking() {

  //Initial action is equal to time elapsed at that point
  if (clickTrackings.length > 0) {
    clickTrackings[0].timeGap = clickTrackings[0].timeStamp;
    finishProperties();
    var A = [
      ['ClickID', 'Time Stamp (Milliseconds)', 'Click Type', 'Time Gap (Milliseconds)', 'Description of click', 'Extra Data', startTime, endTime, startTime.getTime(), endTime.getTime()]
    ];
    for (var j = 0; j < clickTrackings.length; j++) {
      A.push([clickTrackings[j].clickID, clickTrackings[j].timeStamp, clickTrackings[j].functionType, clickTrackings[j].timeGap, clickTrackings[j].getAction(), clickTrackings[j].tileID]);

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
  }
} //end exportTracking

//Completes needed object property insertion
function finishProperties() {
  var tempClicks = [];
  tempClicks.push(clickTrackings[0]);
  for (var i = 1; i < clickTrackings.length; i++) {
    /* To make sure onmouseover(), onmouseout() hover functions of progress bars is written to the .csv file, check if function type is 122
       -- Need to find a better way to do it, though!
       -- could add a dedicated column that is separate from the tileID column, to the .csv file that caters to extra info like,
       -- (precip, add/del year, user info in confirmation pages etc. solely to be used for cursor tracking purposes)
       --
    */
    var clickFunctionType = parseInt(clickTrackings[i].functionType);

    if (clickFunctionType == 80 || clickFunctionType == 81 || clickFunctionType == 82 ||
        clickFunctionType == 122 || clickFunctionType == 124 || clickFunctionType == 125 || clickFunctionType == 126 ||
        clickTrackings[i].tileID != clickTrackings[i - 1].tileID ||
        clickTrackings[i].tileID == null || clickTrackings[i - 1].tileID == null) {

      clickTrackings[i].clickID = i;
      clickTrackings[i].timeGap = (clickTrackings[i].timeStamp - clickTrackings[i - 1].timeStamp);
      tempClicks.push(clickTrackings[i]);
    }
  }
  clickTrackings = tempClicks;
} //end finishProperties

//flyLark triggers the meadowlark animation
function flyLark() {
  document.getElementById("meadowlark").className = "meadowlarkhidden";
  setTimeout(function() {
    document.getElementById("meadowlark").className = "meadowlarkfly";
  }, 1);
} //end flyLark

//Returns the currentPlayer value
function getCurrentPlayer() {
  return currentPlayer;
} //end getCurrentPlayer()

/**
 * get file Extension name and return it
 *
 * @param filename
 * @returns string of file extention
 */
function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
} // getExtension()

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
    if (nitrateConcentration >= 0 && nitrateConcentration <= 0.05) return getBoldedCells(tileId, 125);
    else if (nitrateConcentration > 0.05 && nitrateConcentration <= 0.1) return getBoldedCells(tileId, 126);//return 8;
    else if (nitrateConcentration > 0.1 && nitrateConcentration <= 0.2) return getBoldedCells(tileId, 127);//return 9;
    else if (nitrateConcentration > 0.2 && nitrateConcentration <= 0.25) return getBoldedCells(tileId, 128);//return 31;
    else if (nitrateConcentration > 0.25) return getBoldedCells(tileId, 129);//return 26;

  }
  //phosphorus highlight color indicies
  else if (highlightType == "phosphorus") {
    //-1 for 0 indexing of arrays, sigh
    return (Totals.phosphorusRiskAssessment[currentYear][tileId] - 1);
  }

  else if (highlightType == "sediment") {
    var sedimentDelivery = boardData[currentBoard].map[tileId].results[yearSelected].calculatedSedimentDeliveryToStreamTile * boardData[currentBoard].map[tileId].area;

    if(sedimentDelivery>=0.0043 && sedimentDelivery<=9.9447) return 140;
    else if(sedimentDelivery>9.9447 && sedimentDelivery<=19.8851) return 141;
    else if(sedimentDelivery>19.8851 && sedimentDelivery<=29.8255) return 142;
    else if(sedimentDelivery>29.8255 && sedimentDelivery<=39.7659) return 143;
    else if(sedimentDelivery>39.7659) return 144;
  }

  else if (highlightType == "carbon") {
    var carbonseq = ((Number(boardData[currentBoard].map[tileId].results[yearSelected].calculatedCarbonSequestration/1000)*1.10231));
    if(carbonseq>=0 && carbonseq<=4.04) return 130;
    else if(carbonseq>4.04 && carbonseq<8.09) return 131;
    else if(carbonseq>8.09 && carbonseq<=12.13) return 132;
    else if(carbonseq>12.13 && carbonseq<=16.17) return 133;
    else if(carbonseq>16.17) return 134;
  }


  else if (highlightType == "gamewildlife") {
  var gamewildlifescore = getTileGameWildlifeScore(tileId);
  if(gamewildlifescore == 0) return 0;
  if(gamewildlifescore > 0 && gamewildlifescore <= 2.1) return 1;
  else if (gamewildlifescore>2.1 && gamewildlifescore<=4.1) return 2;
  else if (gamewildlifescore>4 && gamewildlifescore<=6.1) return 3;
  else if (gamewildlifescore>6.1) return 4;
  }

  else if (highlightType == "biodiversity") {
  var biodiversityscore = getTileBiodiversityScore(tileId);
  if(biodiversityscore == 0) return 5;
  else if (biodiversityscore> 0 && biodiversityscore<=2.5) return 6;
  else if (biodiversityscore>2.5 && biodiversityscore<=5) return 7;
  else if (biodiversityscore> 5 && biodiversityscore<=7.5) return 8;
  else if (biodiversityscore>7.5) return 9;
  }

  else if (highlightType == "nitratetile") {

    var nitratescore = Number(boardData[currentBoard].map[tileId].results[currentYear].calculatedTileNitrate);
    if(nitratescore>=0 && nitratescore<510) return getBoldedCells(tileId, 210);
    else if(nitratescore>=510 && nitratescore<1020) return getBoldedCells(tileId, 211);
    else if(nitratescore>=1020 && nitratescore<1530) return getBoldedCells(tileId, 212);
    else if(nitratescore>=1530 && nitratescore<2040) return getBoldedCells(tileId, 213);
    else if(nitratescore>2040) return getBoldedCells(tileId, 214);
  }



  //flood frequency highlight color indicies
  else if (highlightType == "flood") {

    var flood = Number(boardData[currentBoard].map[tileId].floodFrequency);

    switch (flood) {
      case 0:
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
  } else if (highlightType == "topo") {

    var topo = Number(boardData[currentBoard].map[tileId].topography);

    switch (topo) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      case 5:
        return 59;
    } //end switch
  }


  //wetland highlight color indicies
  else if (highlightType == "wetlands") {

    if (boardData[currentBoard].map[tileId].strategicWetland == 1) {
      return 26;
    }
    else
    {
      if((Number(boardData[currentBoard].map[tileId].topography) <= 1))
      {
          return 32;
      }
      else
      {
      return 41;
    }
    }
  }
  // loader
  //subwatershed highlight color indicies
  else if (highlightType == "boundary") {

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
      case 45:
        return 33;
      case 40:
      case 30:
        return 34;
      case 10:
      case 0:
        return 35;
    } //end switch
  }
  //soil class highlight color indicies
  else if (highlightType == "soil") {

    var soil = boardData[currentBoard].map[tileId].soilType;

    switch (soil) {
      //color 097c2f
      case "A":
        return 19;
        //color a84597
      case "B":
        return 14;
        //color 919246
      case "C":
        return 30;
        //color c97b08
      case "D":
        return 1;
        //color 9a3010
      case "G":
        return 3;
        //color c7eab4
      case "K":
        return 6;
        //color cc6578
      case "L":
        return 13;
        //color e6bb00
      case "M":
        return 0;
        //color 5e6e71
      case "N":
        return 33;
        //color 837856
      case "O":
        return 34;
        //color 41b7c5
      case "Q":
        return 8;
        //color 0053b3
      case "T":
        return 31;
        //color 87ceee
      case "Y":
        return 18;
    }
  } else if (highlightType == "corn") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
      case "M":
      case "N":
      case "Q":
      case "T":
        return 35;
      case "B":
      case "G":
        return 5;
      case "C":
      case "L":
        return 0;
      case "D":
      case "K":
      case "O":
      case "Y":
        return 22;
    }
  } else if (highlightType == "soybean") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
      case "M":
      case "N":
      case "Q":
      case "T":
        return 46;
      case "B":
      case "G":
        return 43;
      case "C":
      case "D":
      case "K":
      case "L":
      case "Y":
        return 45;
      case "O":
        return 44;
    }

  } else if (highlightType == "alfalfa") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
      case "D":
      case "N":
      case "Y":
        return 42;
      case "B":
      case "G":
      case "K":
      case "O":
        return 13;
      case "C":
      case "L":
        return 25;
      case "M":
      case "Q":
      case "T":
        return 17;
    }
  } else if (highlightType == "grasshay") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
      case "D":
      case "N":
      case "Y":
        return 46;
      case "B":
      case "G":
      case "K":
      case "O":
        return 47;
      case "C":
      case "L":
        return 45;
      case "M":
      case "Q":
      case "T":
        return 29;
    }
  } else if (highlightType == "switchgrass") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
      case "C":
      case "L":
      case "M":
        return 49;
      case "B":
      case "D":
      case "G":
      case "K":
      case "O":
        return 45;
      case "N":
      case "Q":
      case "T":
        return 51;
      case "Y":
        return 50;
    }
  } else if (highlightType == "wood") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
      case "D":
      case "G":
      case "M":
      case "Q":
      case "Y":
        return 55;
      case "B":
      case "K":
        return 53;
      case "C":
      case "L":
      case "O":
        return 52;
      case "N":
      case "T":
        return 54;
    }
  } else if (highlightType == "fruit") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
      case "G":
      case "N":
        return 0;
      case "B":
        return 25;
      case "C":
      case "L":
      case "M":
      case "O":
      case "Q":
      case "T":
        return 56;
      case "D":
      case "K":
      case "Y":
        return 45;
    }
  } else if (highlightType == "cattle") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "D":
        return 33;
      case "A":
      case "M":
      case "N":
      case "Q":
      case "T":
      case "Y":
        return 57;
      case "B":
      case "G":
      case "O":
        return 43;
      case "C":
      case "K":
      case "L":
        return 58;
    }
  } else if (highlightType == "short") {
    var soil = boardData[currentBoard].map[tileId].soilType;
    switch (soil) {
      case "A":
      case "B":
      case "C":
      case "D":
      case "G":
      case "K":
      case "L":
      case "M":
      case "N":
      case "O":
      case "Q":
      case "T":
      case "Y":
        return 55;
    }
  }

} //end getHighlightColor

//translate raw score to catalog score for result tab in hover information
function CarbonSequestrationClassification(score){
  if(score>=0&&score<4.04){
    return "Very Low";
  }else if(score>4.04&&score<8.09){
    return "Low";
  }else if(score>8.09&&score<12.13){
    return "Meduim";
  }else if(score>12.13&&score<16.17){
    return "High";
  }else if(score>16.17){
    return "Very High";
  }
}
//translate raw gross Erosion score to catalog score in results tab when hover a tile
function GrossErosionClassification(score){
  if(score<0.5){
    return "Very Low";
  }else if(score>0.5&&score<2){
    return "Low";
  }else if(score>2&&score<3.5){
    return "Meduim";
  }else if(score>3.5&&score<5){
    return "High";
  }else if(score>5){
    return "Very High";
  }
}
//translate raw gross Erosion score to catalog score in results tab when hover a tile
function SedimentControlClassification(score){
  if(score>0&&score<9.94){
    return "Very Low";
  }else if(score>9.94&&score<19.88){
    return "Low";
  }else if(score>19.88&&score<29.82){
    return "Meduim";
  }else if(score>29.82&&score<39.76){
    return "High";
  }else if(score>39.76){
    return "Very High";
  }
}
//get flood frequency classification in text
function floodFrequencyClassification(scoreFloodFrequency){
  switch (scoreFloodFrequency) {
     case 0:
      return "None";
     case 10:
       return "None";
     case 20:
       return "Rare";
     case 30:
       return "Occasionally";
     case 40:
       return "Frequently";
     case 50:
       return "Ponded";
   }
}
//get drainage classification in text
function drainageClassClassification(drainage) {
  switch (drainage) {
    case 70:
      return "Very Poor" + "<br>";
    case 60:
      return "Poor" + "<br>";
    case 50:
      return "Somewhat Poor" + "<br>";
    case 45:
      return "Somewhat Poor" + "<br>";
    case 40:
      return"Moderate / Well" + "<br>";
    case 30:
      return "Moderate / Well" + "<br>";
    case 10:
      return "Excessive" + "<br>";
    case 0:
      return "Excessive" + "<br>";
  } //end switch
}
function phoshorusIndexRiskAssessmentClassification(pindex) {
  if (pindex >= 0 && pindex <= 1) return "Very Low"+"<br>";
  else if (pindex > 1 && pindex <= 2) return "Low"+"<br>";
  else if (pindex > 2 && pindex <= 5) return "Medium"+"<br>";
  else if (pindex > 5 && pindex <= 15) return "High"+"<br>";
  else if (pindex > 15) return "Very High"+"<br>";
}
/**
 * generate the total nitrate point based on the subWatershed cell.
 * @param  {int} tileId id in array of map
 * @return {int}        total point
 */
function calculateSubwatershedTotalNitrateScore(tileId){
  var result=boardData[currentBoard].map.filter(
    function(item){
      return item.subwatershed==boardData[currentBoard].map[tileId].subwatershed;
    }
  );
  var total=0;
    for (var i = 0; i < result.length; i++) {
      total+=result[i].results[currentYear].calculatedTileNitrate;
    }
    return total;
}
//getHighlightedInfo returns the value of the corresponding highlighted setting in a tile
//More hover information
function getHighlightedInfo(tileId) {

  //return information about the tile that is highlighted
  if (currentHighlightType <= 0) {
    return "";
  } else {
    var highlightString = "";
    switch (currentHighlightType) {
      //create string for nitrate levels
      case 1:
        var subwatershed=boardData[currentBoard].map[tileId].subwatershed;
        highlightString = (Totals.nitrateContribution[currentYear][tileId] * 100).toFixed(2) + "% Nitrate by subwatershed" + "<br>"+boardData[currentBoard].subWatershedNitrateNoMin[subwatershed].toFixed(4)+" ppm"+"<br>";
        break;
        //create string for gross erosion levels
      case 2:
        highlightString = GrossErosionClassification(Number(boardData[currentBoard].map[tileId].results[currentYear].calculatedGrossErosionRate).toFixed(2))+"<br>"+
        Number(boardData[currentBoard].map[tileId].results[currentYear].calculatedGrossErosionRate).toFixed(2) + " t/ac/yr" + "<br>";
        break;
        //create string for phosphorus load levels
      case 3:
        highlightString = phoshorusIndexRiskAssessmentClassification((boardData[currentBoard].map[tileId].results[currentYear].phosphorusDelivered / boardData[currentBoard].map[tileId].area).toFixed(2))
        +(boardData[currentBoard].map[tileId].results[currentYear].phosphorusDelivered / boardData[currentBoard].map[tileId].area).toFixed(2) + " lb/ac/yr" + "<br>";
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
        highlightString = drainageClassClassification(Number(boardData[currentBoard].map[tileId].drainageClass));
        break;
        //create string for strategic wetlands
      case 6:
        if (boardData[currentBoard].map[tileId].strategicWetland == 1)
          highlightString = "Strategic" + "<br>";
        else
          if((Number(boardData[currentBoard].map[tileId].topography) <= 1))
          {
            highlightString = "Suitable" + "<br>";
          }
          else
          {
            highlightString = "Not Suitable" + "<br>";
          }
        break;
        //create string for subwatershed number
      case 7:
        highlightString = "Subwatershed " + boardData[currentBoard].map[tileId].subwatershed + "<br>";
        break;
      case 8:
          var soil = boardData[currentBoard].map[tileId].soilType;
          switch(soil)
          {
            case "A":
            highlightString = printSoilType(tileId);
            break;
            case "B":
            highlightString =  printSoilType(tileId);
            break;
            case "C":
            highlightString = printSoilType(tileId);
            break;
            case "D":
            highlightString =  printSoilType(tileId);
            break;
            case "G":
            highlightString =  printSoilType(tileId);
            break;
            case "K":
            highlightString =  printSoilType(tileId);
            break;
            case "L":
            highlightString =  printSoilType(tileId);
            break;
            case "M":
            highlightString =  printSoilType(tileId);
            break;
            case "N":
            highlightString =  printSoilType(tileId);
            break;
            case "O":
            highlightString =  printSoilType(tileId);
            break;
            case "Q":
            highlightString =  printSoilType(tileId);
            break;
            case "T":
            highlightString =  printSoilType(tileId);
            break;
            case "Y":
            highlightString =  printSoilType(tileId);
            break;
          }
        break;
        //Raw numbers are for conversion of the units (conversion doesn't exist in the back end)
        //create string for corn grain yield
        //
        // values multipilied by 14.8697 are being converted to bushels per acre, wood multiplied by 423.766 to convert to board-ft per acre
      case 10:
        highlightString = Number(boardData[currentBoard].map[tileId].getCornGrainYield() / 15.92857142857 * 14.8697).toFixed(1) + " bu/ac/yr" + "<br>";
        break;
        //create string for soybean yield
      case 11:
        highlightString = Number(boardData[currentBoard].map[tileId].getSoybeanYield() / 14.87414187643 * 14.8697).toFixed(2) + " bu/ac/yr" + "<br>";
        break;
        //create string for  mixed fruit and vegetable yield
      case 12:
        highlightString = Number(boardData[currentBoard].map[tileId].getMixedFruitsVegetablesYield() / 0.060801144492 * 0.44609).toFixed(2)  + " tons/ac/yr" + "<br>";
        break;
        //create string for cattle yield
      case 13:
        highlightString = Number(boardData[currentBoard].map[tileId].getCattleSupported(-1)).toFixed(1) + " animals/acre/yr" + "<br>";
        break;
        //create string for alfalfa yield
      case 14:
        highlightString = Number(boardData[currentBoard].map[tileId].getHayYield() / 0.446808510638 * 0.44609).toFixed(2) + " tons/ac/yr" + "<br>";
        break;
        //create string for grass hay yield (same as alfalfa)
      case 15:
        highlightString = Number(boardData[currentBoard].map[tileId].getHayYield() / 0.446808510638 * 0.44609).toFixed(2) + " tons/ac/yr" + "<br>";
        break;
        //create string for switchgrass yield
      case 16:
        highlightString = Number(boardData[currentBoard].map[tileId].getSwitchgrassYield() / 0.445407279029 * 0.44609).toFixed(2) + " tons/ac/yr" + "<br>";
        break;
        //create string for wood yield
      case 17:
        highlightString = Number(boardData[currentBoard].map[tileId].getWoodYield() / 171.875 * 423.766).toFixed(2) + " board-ft/ac/yr" + "<br>";
        break;
        //create string for short-rotation woody biomass yield
      case 18:
        highlightString = "9.99 tons/acre/yr" + "<br>";
        break;
        //create string for sediment control
      case 19:
        highlightString = SedimentControlClassification((Number(boardData[currentBoard].map[tileId].results[yearSelected].calculatedSedimentDeliveryToStreamTile) * Number(boardData[currentBoard].map[tileId].area)).toFixed(2))+"<br>"+
        (Number(boardData[currentBoard].map[tileId].results[yearSelected].calculatedSedimentDeliveryToStreamTile) * Number(boardData[currentBoard].map[tileId].area)).toFixed(2) + " tons" + "<br>";
        break;
        //create string for carbon sequestration
      case 20:
        highlightString = CarbonSequestrationClassification((Number(boardData[currentBoard].map[tileId].results[yearSelected].calculatedCarbonSequestration/1000)*1.10231).toFixed(1))+"<br>"+
        (Number(boardData[currentBoard].map[tileId].results[yearSelected].calculatedCarbonSequestration/1000)*1.10231).toFixed(1) + " tons" + "<br>";
        break;
        //create string for Game Wildlife score
      case 21:
        highlightString = "Game Wildlife: " + getTileGameWildlifeInfoText(getTileGameWildlifeScore(tileId)) + "<br>";
        break;
        //create string for Biodiversity score
      case 22:
        highlightString = "Biodiversity: " + getTileBiodiversityInfoText(getTileBiodiversityScore(tileId)) + "<br>";
        break;
      case 23:
        var subwatershed=boardData[currentBoard].map[tileId].subwatershed;
        //calculate the nitrate cell equation- single cell point / total point in subWatershed * subWatershed nitrate
        highlightString = "Nitrate Tile: " + getTileNitrateInfoText((Number(boardData[currentBoard].map[tileId].results[currentYear].calculatedTileNitrate)).toFixed(2)) + "<br>"+
        ((boardData[currentBoard].map[tileId].results[currentYear].calculatedTileNitrate/calculateSubwatershedTotalNitrateScore(tileId))*boardData[currentBoard].subWatershedNitrateNoMin[subwatershed]).toFixed(4)+" ppm <br>";
        break;
    }
    return highlightString;
  } // END if/else

} //end getHighlightedInfo

function getNumberOfPlayers() {
  return totalPlayers;
}

/**
 * get Precip Options Value
 *
 * @param precipValue
 * @returns Options value
 */
function getPrecipOptionsValue(precipValue) {

  // We don't use switch statement because switch cases use STRICT comparison(===)
  if (precipValue == 24.58)
    return 0;
  else if (precipValue == 28.18)
    return 1;
  else if (precipValue == 30.39)
    return 2;
  else if (precipValue == 32.16)
    return 3;
  else if (precipValue == 34.34)
    return 4;
  else if (precipValue == 36.47)
    return 5;
  else if (precipValue == 45.10) {
    return 6;
  } else {
    alert('Corrupted data! Unable to process the file.');
    return -1;
  }

} // end getPrecipOptionsValue()

function getPrecipType(a){
  var spanID = "precipspan";
  spanID+=a;
  var str = "yearPrecip";
  var sel = [str.slice(0, 4), a, str.slice(4)].join('');
  var e = document.getElementById(sel);
  var val = e.options[e.selectedIndex].value;
  if(val==="0" || val==="1"){
    document.getElementById(spanID).textContent="Dry";
  }
  if(val==="2" || val==="3" || val==="4"){
    document.getElementById(spanID).textContent="Normal";
  }
  if(val==="5" || val==="6"){
    document.getElementById(spanID).textContent="Wet";
  }
}

//gets the topography (percentage of slope) of a tile
  /*Topography numbers in data sheet are not indicative of exact percent slope. Rather, 0 -> 0-1%, 1 -> 1-2%, 2-> 2-5%  ...and so on*/
function getSlope(tileId)
{
  switch (Number(boardData[currentBoard].map[tileId].topography)) {
    case 0:
      return "Slope: 0-1%" + "<br>";
      break;
    case 1:
      return "Slope: 1-2%" + "<br>";
      break;
    case 2:
      return "Slope: 2-5%" + "<br>";
      break;
    case 3:
      return "Slope: 5-9%" + "<br>";
      break;
    case 4:
      return "Slope: 9-14%" + "<br>";
      break;
    case 5:
      return "Slope: 14-18%" + "<br>";
      break;
  }// end switch
}// end getSlope
/**
 * get Wetland Suitability in text
 *
 * @param tileId
 * @returns type of wetland Suitability in text
 */
function getSuitable(tileId){
  if (boardData[currentBoard].map[tileId].strategicWetland == 1)
    return "Wetland Suitability: Strategic" + "<br>";
  else
    if((Number(boardData[currentBoard].map[tileId].topography) <= 1))
    {
      return "Wetland Suitability: Suitable" + "<br>";
    }
    else
    {
      return "Wetland Suitability: Not Suitable" + "<br>";
    }
}

//Gets the current timestamp for the click (event)
function getStamp() {
  curTime = new Date();
  return (curTime - startTime);
} //end getStamp

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

//getTileIDFromRC calculates ids given a row and column
function getTileIDFromRC(row, col) {
  var tilesWide = boardData[currentBoard].width;
  return Number(((row - 1) * tilesWide) + col);
} //end getTileIDFromRC

//Returns the value of curTracking
function getTracking() {
  return curTracking;
} //end getTracking()

//Returns the hotkey array
function giveHotkeys() {
  return hotkeyArr;
} //end giveHotkeys()

//hideMultiDownload hides the multiPlayer element
function hideMultiDownload() {
  document.getElementById('multiplayer').style.visibility = "hidden";
  document.activeElement.blur();
} //end hideMultiDownload
function getFloodFrequencyName(floodFrequencyNum){
  switch (floodFrequencyNum) {
    case 0:
      return "None"
    }
}
//highlightTile updates the tile that should be highlighted.
function highlightTile(tileId) {
  if (curTracking) {
    pushClick(0, getStamp(), 123, 0, tileId);
  }
  //clear the information in the delayed information hover div
  document.getElementById("hover-info").innerHTML = "";
  if (myTimer != null) {
    clearTimeout(myTimer);
  }

  //if a previous tile was selected for highlighting, unhighlight that tile
  if (previousHover != null) {
    meshMaterials[previousHover].emissive.setHex(0x000000);
    meshOverlay[previousHover].emissive.setHex(0x000000);
  }
  //highlight the new tile
  //if not a tile
  if (tileId != -1 && !modalUp) {

    //remove currently highlighted land type from HUD if over a clear tile
    if (boardData[currentBoard].map[tileId].landType[currentYear] == 0 ||
      boardData[currentBoard].map[tileId].landType[0] == -1) {

      showInfo("Year: " + currentYear + "&#160;&#160;&#160;Precipitation: " + printPrecipYearType() + "&#160;&#160;&#160;Current Selection: " + printLandUseType(painter) + "&#160;&#160;&#160;Current Cell: " + "&#160;&#160;&#160;");

      document.getElementById('hover-info').innerHTML = "";

    } else {

      //Highlight a nonzero land type tile
      meshMaterials[tileId].emissive.setHex(0x7f7f7f);
      meshOverlay[tileId].emissive.setHex(0x7f7f7f);

      previousHover = tileId;
      //update HUD with current information
      //Bottom part of screen
      showInfo("Year: " + currentYear + "&#160;&#160;&#160;Precipitation: " + printPrecipYearType() + "&#160;&#160;&#160;Current Selection: " + printLandUseType(painter) + "&#160;&#160;&#160;" + "Current Cell: " + printLandUseType(boardData[currentBoard].map[tileId].landType[currentYear]));

      //update the information displayed in the delayed hover div by cursor
      var info1 = "Land Cover: " + printLandUseType(boardData[currentBoard].map[tileId].landType[currentYear])+ "<br>";
      var info2 = "Precipitation: " + printPrecipYearType()+ ", "+boardData[currentBoard].precipitation[currentYear]+" in"+"<br>";
      var info3 = "Soil Type: " + printSoilType(tileId);
      var info4=getHighlightedInfo(tileId);
      var info5="Subwatershed: "+ boardData[currentBoard].map[tileId].subwatershed+"<br>";
      var info6="FloodFrequency: "+floodFrequencyClassification(Number(boardData[currentBoard].map[tileId].floodFrequency))+ "<br>" ;
      var info7="Drainage Level :"+drainageClassClassification(Number(boardData[currentBoard].map[tileId].drainageClass));
      var info8=getSuitable(tileId);
      var info9=getSlope(tileId);
      var streamNetworkHover;
      if(boardData[currentBoard].map[tileId].streamNetwork==1){
        streamNetworkHover="Yes";
      }else{
        streamNetworkHover="No";
      }
      var info10="Stream Border: "+streamNetworkHover;
      switch (currentHighlightType) {
        case 4:
          info6="";
          break;
        case 5:
          info7="";
          break;
        case 6:
          info8="";
          break;
        case 7:
          info5="";
          break;
        case 8:
          info3="";
          break;
      }
      document.getElementById("hover-info").innerHTML = "(" + boardData[currentBoard].map[tileId].row + "," + boardData[currentBoard].map[tileId].column + ")" + "<br>" +
      info4 +  info9 +info1 +info2 + info3 + info5+info6+ info7+info8+info10;
        //May use strings and iterate through them for removing hover information
        if (document.getElementById('parameters').innerHTML.includes('hover1')&&currentHighlightType!=0) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info1, '');
        }
        if (document.getElementById('parameters').innerHTML.includes('hover2')) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info2, '');
        }
        if (document.getElementById('parameters').innerHTML.includes('hover3')&&currentHighlightType!=8) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info3, '');
        }
        if (document.getElementById('parameters').innerHTML.includes('hover4')&&resultsMappedHover) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info4, '');
        }
        if (document.getElementById('parameters').innerHTML.includes('hover5')&&currentHighlightType!=7) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info5, '');
        }
        if (document.getElementById('parameters').innerHTML.includes('hover6')&&currentHighlightType!=4) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info6, '');
        }
        if (document.getElementById('parameters').innerHTML.includes('hover7')&&currentHighlightType!=5) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info7, '');
        }
        if (document.getElementById('parameters').innerHTML.includes('hover8')&&currentHighlightType!=6) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace(info8, '');
        }
        if (document.getElementById('parameters').innerHTML.includes('hover9')&&currentHighlightType!=9) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace( info9, '');
        }
        if (document.getElementById('parameters').innerHTML.includes('hover10')) {
          document.getElementById("hover-info").innerHTML = document.getElementById("hover-info").innerHTML.replace( info10, '');
        }
      //this is where you should include the code about the topography for the hover over button

    }

  } else {

    //If not over any land tile, update HUD accordingly
    showInfo("Year: " + currentYear + "&#160;&#160;&#160;Precipitation: " + printPrecipYearType()  + "&#160;&#160;&#160;Current Selection: " + printLandUseType(painter) + "&#160;&#160;&#160;Current Cell: " + "&#160;&#160;&#160;");

    document.getElementById("hover-info").innerHTML = "";

  }

} //end highlightTile

//Inserts the land type changes from a grid into the undoArr
function insertChange() {
  undoArr[currentYear].push([undoGridArr, undoGridPainters]);
  undoGridArr = [];
  undoGridPainters = [];
} //end insertChange()

//Returns the value of runningSim
function isSimRunning() {
  return runningSim;
} //end isSimRunning

//launchFireworks adds great balls of fire
function launchFireworks() {
  var r = 10 + parseInt(Math.random() * 10);
  for (var i = r; i--;) {
    setTimeout(function() {
      displayFirework();
    }, (i + 1) * (1 + parseInt(Math.random() * 100)));
  }
} //end launchFireworks

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
    };
  }
} //end loadSimulation

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
    nextFileIndex++;
    mergedFiles.push(file.name);
    console.log(file.name, "is merged!");
    if(nextFileIndex < filesUploaded.length){
      console.log("Processing ", filesUploaded[nextFileIndex].name);
      // So far we are done with the first file, we continue to deal with the second one.
      multiplayerAggregateOverlayMapping(filesUploaded[nextFileIndex]);
    }
  };

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
      //clear initData
      initData = [];

      if(!isAggregateConflictDetected){
        nextFileIndex++;
        mergedFiles.push(file.name);
        console.log(file.name, "is merged!");
        if(nextFileIndex < filesUploaded.length){
          console.log("Processing ", filesUploaded[nextFileIndex].name);
          // So far we are done with the previous file, we continue to deal with the next one.
          // Call multiplayerAggregateOverlayMapping recursively to realize load files asynchrnously. Clever, right?
          multiplayerAggregateOverlayMapping(filesUploaded[nextFileIndex]);
        }

        else if(nextFileIndex == filesUploaded.length && hasPrecipConclict) {
          var utilityWindow = document.getElementById("startUpFrame").contentWindow.document.getElementById("startupDialogueOverlay").contentWindow;
          utilityWindow.document.getElementById("modalPrecipConflictFrame").style.display = "block";
        }
      }
    }

  };
} //end multiplayerAggregateOverlayMapping

function multiplayerExit() {
  document.getElementById("combineButton").style.visibility = "hidden";
  document.getElementById("playerOptions").style.visibility = "hidden";
  document.getElementById("levelsButton").style.display = "block";
  document.getElementById("yearButton").style.display = "block";
  document.getElementById("playerResetButton").style.display = "none";
  // Change the Download method to the normal one
  document.getElementById("DownloadButton").onclick = triggerDownloadSequence;
  // We need to show the buttons in case of the buttons was hidden in multi-player mode.
  document.getElementById('printButton').style.display = 'block';
  document.getElementById('uploadFile').style.display = 'block';
  // move all the left icons to the right, so that there's no empty space between Download icon and Contact Us icon.
  document.getElementById('DownloadButton').style.right = '8.5vw';
  document.getElementById('logoBase').style.right = '11vw';
  document.getElementById('pewiLogo').style.right = '21vw';
  // document.getElementById("playerResetImage").style.display = "none";
  resetPlayers();
  //Elimnate player 1 (since we are actually leaving multiplayer) and reduce totalPlayers count to 0
  if (multiplayerAssigningModeOn) {
    document.getElementById("paintPlayer1").remove();
    totalPlayers--;
  }
  multiplayerAssigningModeOn = false;
}

//multiUpload directs functions for multiplayer file upload
// In this function, we only process the first file, load the data into board.
// Due to the nature of javascript asynchronousity, we should NOT use for loop to deal with all the files
// Instead, I used recursive function to deal with all other files
function multiplayerFileUpload() {
  console.log("Processing ", filesUploaded[0].name);
  multiplayerAggregateBaseMapping(filesUploaded[0]);
  // for(var file of filesUploaded){
  //   if(file == filesUploaded[0]) {
  //     console.log("Processing ", file.name);
  //     multiplayerAggregateBaseMapping(file);
  //     console.log(file.name, " merged!");
  //   }
  //   else {
  //     if(!isAggregateConflictDetected) {
  //       console.log("Processing ", file.name);
  //       setTimeout(function(file){multiplayerAggregateOverlayMapping(file)},50);
  //       console.log(file.name, " merged!");
  //     }
  //     else{
  //       break;
  //     }
  //   }
  // }

} //end multiUpload


//multiplayerMode hides all unnecessary options from screen
function multiplayerMode() {
  if (multiplayerAssigningModeOn) {
    document.getElementById("message").style.display = "block";
    //Don't add an aditional player if the level was only reset
    if (!resetting) {
      resetPlayers();
      if (totalPlayers == 0) {
        addPlayer();
      }
    } else {
      resetting = false;
    }
    document.getElementById("combineButton").style.visibility = "visible";
    document.getElementById("playerOptions").style.visibility = "visible";
    document.getElementById("playerAddButton").style.display = "inline-block";
    document.getElementById("playerResetButton").style.display = "block";
    document.getElementById("levelsButton").style.display = "none";

    // document.getElementById("yearButton").style.display = "none";
    document.getElementById("yearButton").style.display = "block";

    // When hit download button, it should download the multi-map.
    document.getElementById("DownloadButton").onclick = endMultiplayerAssignMode;
    // Multi-player mode should not have a print function, hide it.
    document.getElementById('printButton').style.display = 'none';
    // Multi-player mode should not have a upload functionality, hide it.
    document.getElementById('uploadFile').style.display = 'none';
    // move all the left icons to the right, so that there's no empty space between Download icon and Contact Us icon.
    document.getElementById('DownloadButton').style.right = '6.5vw';
    document.getElementById('logoBase').style.right = '9vw';
    document.getElementById('pewiLogo').style.right = '18.5vw';
    // Hide the progress bar
    document.getElementById('progressBarContainer').style.display = 'none';
    for(let i = 1; i <= 15; i++){
      document.getElementById('paint' + i).style.display = 'none';
    }
  }
}

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

//onDocumentMouseMove follows the cursor and highlights corresponding tiles
function onDocumentMouseMove(event) {
  if (!isSimRunning() || isSimRunning && !event.isTrusted) {
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
    //FIXME intersects indicates when mouse is hover on tiles, however when the land's angle change, it appears not correct. I think this affects the correctness of coordinates
    var intersects = raycaster.intersectObjects(scene.children);

    //Remove highlighting if clicking and dragging (painter tool/brush 1)
    if (clickAndDrag) {

      highlightTile(-1);
    }

    //if there's no intersection, then turn off the gridHighlighting
    if (intersects.length < 1) {
      //if we're on grid paint, and we go off board, unhighlight everything
      if (painterTool.status == 2) {
        for (var i = 0; i < highlightedTiles.length; i++) {
          meshMaterials[highlightedTiles[i] - 1].emissive.setHex(0x000000);
          meshOverlay[highlightedTiles[i] - 1].emissive.setHex(0x000000);
        }
      }

      //else, unhighlight previous
      highlightTile(-1);
    }

    // mouse hovered on tiles and no iframe pops
    if (intersects.length > 0 && !modalUp) {

      //if painter tool type is the rectangle painter
      if (painterTool.status == 2) { //CHANGE
        //highlight a grid
        var currentTile = getTileID(intersects[0].point.x, -intersects[0].point.z);
        var tilesToHighlight = getGridOutline(painterTool.startTile, currentTile);

        //clear Previous highlighting
        for (var i = 0; i < highlightedTiles.length; i++) {
         meshMaterials[highlightedTiles[i] - 1].emissive.setHex(0x000000);
         meshOverlay[highlightedTiles[i] - 1].emissive.setHex(0x000000);

        }

        //if the tile we are on is an actual tile, then highlight accordingly
        //  this is important as it appears to the users that they are off the board
        //  so it should consistently not highlight
        // in reality, there is a distinction between space outside the board and a
        //  tile on the board with no land type

        // if the tile the mouse hover on has landUseType, that means it is a paintable land

        if (boardData[currentBoard].map[currentTile].landType[0] !== 0) {
          // grid painter mode highlighting tiles here

          for (var i = 0; i < tilesToHighlight.length; i++) {
            highlightTile(tilesToHighlight[i] - 1);
            //prevent highlighting from overwritting...
            previousHover = null;
          }
          highlightedTiles = tilesToHighlight;
        } // end if highlighting tiles
       } // end if grid painter brush


      //if painter tool type is the clickAndDrag painter
      else if (clickAndDrag) {
        var currentTile = getTileID(intersects[0].point.x, -intersects[0].point.z);
        if (boardData[currentBoard].map[currentTile].landType[0] != 0){
           changeLandTypeTile(currentTile);

           changeLandTypeTileNitrate(currentTile);

         }
      } else {
        //just a normal highlighting
        highlightTile(getTileID(intersects[0].point.x, -intersects[0].point.z));
      }
    }
  }
} //end onDocumentMouseMove

//onDocumentDoubleClick changes landType to the painted (selected) landType on double-click
//and will change map to a monoculture if shift is held down
function onDocumentMouseDown(event) {
  if (!isSimRunning() || isSimRunning && !event.isTrusted) {
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
          if (painterTool.status > 0) { //CHANGE
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

                var tempGridArr = [];

                for (var i = 0; i < changedTiles.length; i++) {
                  if (curTracking) {
                    tempGridArr.push(changedTiles[i]);
                  }
                  undoGridPainters.push(boardData[currentBoard].map[changedTiles[i] - 1].landType[currentYear]);
                  changeLandTypeTile(changedTiles[i] - 1);

                }
                changeLandTypeTileNitrate();
                if (curTracking) {
                  pushClick(0, getStamp(), 56, 0, tempGridArr);
                }
                //Inserts the block of land use types into the undoArr
                insertChange();
                //reset highlighting, computationally intensive
                //  but a working solution
                if(!mapIsHighlighted)
                {
                  refreshBoard();
                }
                else
                {
                  //if map is highlighted, make sure that the highlighted tiles (especially the four corners)
                  //turn back to their intended color
                  for(var i=0; i<changedTiles.length; i++)
                  {
                    meshMaterials[changedTiles[i]-1].emissive.setHex(0x000000);
                    meshOverlay[changedTiles[i]-1].emissive.setHex(0x000000);

                  } //end for
                } //end if-else
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
              changeLandTypeTileNitrate(getTileID(intersects[0].point.x, -intersects[0].point.z));

              //Change variable for painting click and drag status
              clickAndDrag = true;
            } // end if/else

          } // end if/else

        }

      } // end if shift is not down
      //else, if shift is down, then we want to just change the whole board
      else {

        //if shift is down and map isn't highlighted, change all nonzero landtypes
        if (!mapIsHighlighted) {
          if (curTracking) {
            pushClick(0, getStamp(), 83, 0, null);
          }


          for (var i = 0; i < boardData[currentBoard].map.length; i++) {

            if (boardData[currentBoard].map[i].landType[currentYear] != 0) {
              undoGridPainters.push(boardData[currentBoard].map[i].landType[currentYear]);
              changeLandTypeTile(i);

            }
          }

          changeLandTypeTileNitrate();


        }
        //Inserts the block of land use types into the undoArr
        insertChange();
      }
    } //end else/if group
  }
} //end onDocumentMouseDown(event)

//onDocumentMouseUp listens for the release of the click event
function onDocumentMouseUp(event) {
  if (!isSimRunning() || isSimRunning && !event.isTrusted) {
    //Turn off click and drag functionality
    clickAndDrag = false;
  }
} //end onDocumentMouseUp

//onDocumentKeyDown, listener with keyboard bindings
function onDocumentKeyDown(event) {
  if (!isSimRunning() || isSimRunning && !event.isTrusted || event.keyCode == 27) {
    //switch structure on key code (https://keycode.info)

    // if (!event){
    //   event = window.event;
    // }
    // var keycode = event.keyCode || event.charCode;
    switch (event.keyCode) {
      //case shift - update isShiftDown
      case 16:
        isShiftDown = true;
        break;

        //case e - reset camera position
      case hotkeyArr[0][0]:
      case hotkeyArr[0][1]:
        if (curTracking) {
          pushClick(0, getStamp(), 90, 0, null);
        }
        //update scope across 10 turns,
        // it seeems that controls.js scope doesn't bring us all the way back
        // with just a controls value of 1
        //Reseting camera postion to specific views depending on which camera is on use now.
        controls.value = 10;
        controls.reset();
        setTimeout(function() {
          controls.value = 1;
        }, 100);
        if (ToggleCam == 2) {
          controls1.value = 10;
          controls1.reset();
          setTimeout(function() {
            controls1.value = 1;
          }, 100);
        } else {
          camera2.position.x = 70;
          camera2.position.y = 25;
          camera2.position.z = 244;
          camera2.rotation.y = 0;
        }
        break;

        //case r - randomize land types
      case hotkeyArr[1][0]:
      case hotkeyArr[1][1]:
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

        //case t - toggle topography
      case hotkeyArr[2][0]:
      case hotkeyArr[2][1]:


        // changes the map images between 2d and 3d if needed
        generatedContourMap.change2D3D();



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

        // case u - undo key
      case hotkeyArr[3][0]:
      case hotkeyArr[3][1]:
        revertChanges();
        break;

        // key b - clickTrackings
      case hotkeyArr[4][0]:
      case hotkeyArr[4][1]:
        if (!curTracking) {
          curTracking = true;
          //Starting date is recorded
          startTime = new Date();
          clickTrackings = [];
          document.getElementById("recordIcon").style.visibility = "visible";
        } else {
          continueTracking();
        }
        break;
        //no default handler

        //case v - key to record multiplayer fields
      case hotkeyArr[5][0]:
      case hotkeyArr[5][1]:
        if (multiplayerAssigningModeOn) {
          endMultiplayerAssignMode();
        }
        break;


        //case esc - view escape menu
      case 27:
        if (!curTracking && !runningSim && document.getElementById("combineButton").innerHTML != "Merge" && document.getElementById("overlayContainer").style.visibility != "visible" && document.getElementById("simContainer").style.visibility != "visible") {
          highlightTile(-1);
          toggleEscapeFrame();
          break;
        }
        if (document.getElementById("overlayContainer").style.visibility == "visible" && !runningSim) {
          document.getElementById("overlayContainer").style.visibility = "hidden";
          document.getElementById("simContainer").style.visibility = "visible";
          break;
        }
        if (document.getElementById("overlayContainer").style.visibility != "visible" && !runningSim && !multiplayerAssigningModeOn) {
          document.getElementById("simContainer").style.visibility = "hidden";
          document.getElementById("overlayContainer").style.visibility = "visible";
          break;
        }
        if (runningSim && !paused) {
          endSimPrompt();
          document.getElementById('pausePlay').src = "imgs/playButton.png";
          document.getElementById('pausePlay').style.width = '40px';
          break;
        }
        if (runningSim && paused) {
          document.getElementById("simContainer").style.visibility = "hidden";
          document.getElementById("genOverlay").style.visibility = "visible";
          resumeSim();
          document.getElementById('pausePlay').src = "imgs/pauseButton.png";
          document.getElementById('pausePlay').style.width = '20px';
          break;
        }
        break;

        // case o - toggleOverlay
      case hotkeyArr[10][0]:
      case hotkeyArr[10][1]:
        if (previousOverlay != null) {
          if (curTracking) {
            pushClick(0, getStamp(), 31, 0, null);
          }
          toggleOverlay();
        }
        break;


// contour map
      case hotkeyArr[12][0]:
      case hotkeyArr[12][1]:
          generatedContourMap.toggleTopoMap();
          break;

// print
      case hotkeyArr[13][0]:
      case hotkeyArr[13][1]:
        // If not in the multi-player mode, we should not disable the 'P' key
        if (!multiplayerAssigningModeOn) {
          startPrintOptions();
        }

        break;

    } //end switch
  }
} //end onDocumentKeyDown

// Asks the user if they want to continue tracking...
function continueTracking() {
  if (confirm('Are you sure you want to stop your recording?')) {
    curTracking = false;
    //Ending date is recorded
    endTime = new Date();
    document.getElementById("recordIcon").style.visibility = "hidden";
    exportTracking(clickTrackings);
  } else {
    // Do nothing! Continue with recording
  }
}

//onDocumentKeyUp, binding to keyboard keyUp event
//  but you already knew that...
function onDocumentKeyUp(event) {
  //switch structure for key code (https://keycode.info)

  // var keycode = event.keyCode || event.charCode;

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

//onResize dynamically adjusts to window size changes
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
} //end onResize

//painterSelect changes the currenly selected 'brush' of the painter tool
//  the options are normal click change, hover change, and grid change.
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

//pastes the landuse and precipitation of a certain year to another - related to the copyYear function

function pasteYear()
{



  var snackBar = document.getElementById("snackbarNotification");
  document.getElementById("yearPasteButton").classList.toggle("show");
  var yearToPasteIn = document.getElementById("yearToPaste").value;


  // trying to push the current map so that it can be undone after undoing the paste
   var currentMap = getMap(yearToPasteIn);
   undoArr[yearToPasteIn].push(currentMap);


    for (var i = 0; i < boardData[currentBoard].map.length; i++)
    {
      boardData[currentBoard].map[i].landType[yearToPasteIn] = boardData[currentBoard].map[i].landType[yearCopyPaste];
    } //end for loop
    //copy the precipitation if the settings allow for a change in precip
    if(!document.getElementById('parameters').innerHTML.includes('precipOff')){
      boardData[currentBoard].precipitation[yearToPasteIn] = boardData[currentBoard].precipitation[yearCopyPaste];
    }
    boardData[currentBoard].updateBoard();
    refreshBoard();
    calculateResults(undefined,yearToPasteIn);

    refreshProgressBar(currentYear);
    //if (!isSimRunning()) {
      snackBar.innerHTML = ("Year " + yearCopyPaste + " is now pasted in year " +yearToPasteIn +"!");
      snackBar.className = "show";
      setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
    //}

    document.getElementById("yearToCopy").value = 0;
    document.getElementById("yearToPaste").value = 0;
    document.getElementById("year" + yearToPasteIn+ "Precip").value = reversePrecipValue(boardData[currentBoard].precipitation[yearToPasteIn]);
    document.getElementById("yearToPaste").options[yearCopyPaste].style.display = 'block';
    document.getElementById("yearPasteButton").style.display = "none";

    if (curTracking)
    {
      // sending the yearToPasteIn value at tileID position to store it and reproduce it during run simulation
      pushClick(0, getStamp(), 102, 0, yearToPasteIn);
    }

    // makes a deep copy of all the arrays inside of undoArr for the given year so that the undo for the copy is fully functional
    var newStuff = JSON.parse(JSON.stringify(undoArr[yearCopyPaste]));
    undoArr[yearToPasteIn] = undoArr[yearToPasteIn].concat(newStuff);


} //end pasteYear

//Pauses the sim (and related times)
function pauseSim() {
  timeStopped = new Date();
  document.getElementById("simSlider").style.zIndex = "1";
  clearTimers();
} //end pauseSim()

//Performs the actions for simulation
function performAction(clickValue) {
  clickTrackings[clickValue].getAction();
} //end performAction

//printLandUseType returns a display-worthy string of land type from numeric key
function printLandUseType(type) {
  //completely redundant, but preserved for ease of use
  //see backEnd
  return LandUseType.getPrintFriendlyType(type);
} //end printLandUseType

//printPrecipYearType returns the precipitation category of the year's precipitation
function printPrecipYearType(year) {
   //This checks to see if a year was specified. This function riginally assumed the current year.
    var precipLevel = boardData[currentBoard].precipitation[year] || boardData[currentBoard].precipitation[currentYear];

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

function printSoilType(tileId) {
  var soil = boardData[currentBoard].map[tileId].soilType;
  switch (soil) {
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
  return highlightString;
}

//Prompts user to begin the simulation
function promptUserSim() {
  resetPresets();
  document.getElementById('sliderCon').style.visibility = "visible";
  document.getElementById("overlayContainer").style.visibility = "visible";
} //end promptUserSim()

//Creates a click object and pushes it into the click array (Useful for remote functions)
function pushClick(id, stamp, type, gap, tile) {
  click = new Click(id, stamp, type, gap, tile);
  clickTrackings.push(click);
} //end pushClick()

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
  var isWetlandOn = true;
  //Range of values for each land-use type
  var randomPainterTile = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  randomizing = true;
  //for whole board (as long as randomization is allowed)
  if (localStorage.getItem("randAllow") == "true" || runningSim) {
    //getRandomInt is in back-end helperMethods
    for (var j = 1; j <= 15; j++) { //Check to see if the landuse type is toggled off or not
      if (document.getElementById('parameters').innerHTML.indexOf('paint' + j + "\n") != -1) {
        //If it's toggled off, remove the landuse type for randomization
        var removedIndex = randomPainterTile.indexOf(j);
        if(j == 14){
          isWetlandOn = false;
        }
        randomPainterTile.splice(removedIndex, 1);

        // What the heck, What's this for loop for??? Why didn't call randomPainterTile.splice(removedIndex, 1) directly???
        // for (var x = 0; x < 15; x++) {
        //   if (removedIndex == x) {
        //     randomPainterTile.splice(removedIndex, 1);
        //   }
        // } // end for


      }
    } // end for

    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      //if tile exists
      //Random tiles will keep getting added to the map as long as the tile exists
      if (boardData[currentBoard].map[i].landType[currentYear] != LandUseType.none) {
        //wetlands are restricted within flat lands, i.e 0-2% only
        if((Number(boardData[currentBoard].map[i].topography) >= 2))
        {
          // If wetland is toggle on, we should remove the wetland option since wetlands are restricted within flat lands.
          if(isWetlandOn && randomPainterTile.indexOf(14) != -1){
            randomPainterTile.splice(randomPainterTile.indexOf(14), 1);
          }
        }
        else
        {
          // If wetland is toggle on, we should add the wetland option back.
          if(isWetlandOn && randomPainterTile.indexOf(14) == -1)
            randomPainterTile.push(14);
        }
        undoGridPainters.push(boardData[currentBoard].map[i].landType[currentYear]);
        painter = randomPainterTile[Math.floor(Math.random() * randomPainterTile.length)];
        changeLandTypeTile(i);

      }
    } //end for all tiles
    changeLandTypeTileNitrate();
  }
  randomizing = false;
  painter = prevPainter;
  //Inserts the block of land use types into the undoArr
  insertChange();
} //end randomizeBoard

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



  if(mesh2 != null) {
    scene.remove(mesh2);
  }


  meshGeometry = new THREE.Geometry();
  meshGeometry2 = new THREE.Geometry();
  meshMaterials = [];
  meshOverlay = [];

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

// var lines = new ContourMap();
// lines.drawContours();

} //end refreshBoard

//Resets the hotkey array to its default state
function resetHotkeys() {
  hotkeyArr = [
    [69, null],
    [82, null],
    [84, null],
    [85, null],
    [66, null],
    [86, null],
    [68, null],
    [65, null],
    [87, null],
    [83, null],
    [79, null],
    [81, null],
    [67, null],
    [80, null],
    [38, null],
    [40, null],
    [37, null],
    [39, null]
  ];
  updateKeys();
} //end resetHotkeys()

//resetMultiplayer() undos the display-changes made while assigning multiplayers
function resetMultiPlayer() {
  //Eliminates all players except for player 1
  resetPlayers();
  painter = 1;
  changeSelectedPaintTo(painter);
  resetting = true;
  //Reloads the default multiplayer map
  parent.loadLevel(-1);
}

//ns is called when options menu is closed
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
  window.frames[6].document.removeEventListener('keyup', optionsEsc);
  // removeEvent(document, 'keyup', optionsEsc);
  // removeEvent(window.frames[4].document, 'keyup', optionsEsc);
} //end resetOptions

//This function resetoptionspage by untoggling all the elements in the page
function resetOptionsPage() {
  //This sets the parameter div string to an empty string
  document.getElementById('parameters').innerHTML = "cornGrainProgressBar" + "\n" + "soybeansProgressBar"+"\n"+"fruitsAndVegetablesProgressBar"+"\n"+"cattleProgressBar"+"\n"+"alfalfaHayProgressBar"+"\n"+
                                                    "grassHayProgressBar"+"\n"+"switchgrassBiomassProgressBar"+"\n"+"woodProgressBar"+"\n"+"woodyBiomassProgressBar";
  optionsString = "";
  //Save ad randomize to make sure that the mao behind the options page is being refreshed when the options are reset
  saveAndRandomize();
  //Iterates through all the paints (Land uses) and untoggles them
  if (window.frames[6].document.getElementById("paint1")) {
    for (var i = 1; i < 16; i++) {
      window.frames[6].document.getElementById("paint" + i).checked = false;
    }
  }
  //iterates through the toggled hover elements and untoggles them
  if (window.frames[6].document.getElementById("hover1")) {
    for (var i = 1; i < 9; i++) {
      window.frames[6].document.getElementById("hover" + i).checked = false;
    }
  }
  // untoggle progress bars
  var progressbarIds = ["gameWildlifeProgressBar","biodiversityProgressBar","carbonProgressBar","erosionProgressBar","nitrateProgressBar","phoshorusProgressBar",
                        "sedimentProgressBar","cornGrainProgressBar","soybeansProgressBar","fruitsAndVegetablesProgressBar","cattleProgressBar","alfalfaHayProgressBar",
                        "grassHayProgressBar","switchgrassBiomassProgressBar","woodProgressBar","woodyBiomassProgressBar","totalYieldsProgressBar"];
  if (window.frames[6].document.getElementById("gameWildlifeProgressBar")) {
    for (var i = 0; i < progressbarIds.length; i++) {
      if(i < 7 || i == 16)
        window.frames[6].document.getElementById(progressbarIds[i]).checked = false;
      else{
        window.frames[6].document.getElementById(progressbarIds[i]).checked = true;
      }
    }
  }
  //Untoggles all the other elements
  if (window.frames[6].document.getElementById("year0") &&
    window.frames[6].document.getElementById("progressbars") &&
    window.frames[6].document.getElementById("precip") &&
    window.frames[6].document.getElementById("statFrame")) {

    window.frames[6].document.getElementById("year0").checked = false;
    window.frames[6].document.getElementById("precip").checked = false;
    window.frames[6].document.getElementById("statFrame").checked = false;
    window.frames[6].document.getElementById("allProgressbars").checked = false;
  }
}

//Resets the player count
function resetPlayers() {
  var currentPlayers = document.getElementsByClassName("players");
  for (var i = currentPlayers.length; i > 0; i--) {
    deletePlayer(i);
  }
} //end resetPlayers()

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
  document.getElementById("year1Image").className = "icon yearSelected";
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
  //Closes the contact us tab (if it was open)
  closeEmailFrame();
  //Rolls out the left console
  if (document.getElementById('tabButtons').className != "tabButtons") {
    roll(1);
  }

  //Resets glossary function
  if (document.getElementById('glossary').style.display == "block") {
    document.getElementById('glossary').style.display = "none";
  }
  //Resets the undoArr
  resetUndo();
  //Resets camera type
  if (document.getElementById('flyover').style.display == 'block') {
    toggleCameraView();
  }
  //Resets the camera angle
  if (ToggleCam == 1) {
    changeCam2();
    document.getElementById("flyover").innerHTML = "";
    document.getElementById("flyASDW").style.display = "none";
    document.getElementById("flyNavigKeys").style.display = "none";
    //Reseting camera 2 position when sandbox is reloaded
    camera2.position.x = 70;
    camera2.position.y = 25;
    camera2.position.z = 244;
    camera2.rotation.y = 0;
  }
  controls.reset();
  //Resets topography
  if (tToggle) {
    tToggle = false;
    refreshBoard();
    setupRiver();
  }
  //Reset play/pause button toggle
  document.getElementById('pausePlay').src = "imgs/pauseButton.png";
  document.getElementById('pausePlay').style.width = "20px";
} //end resetPresets()

//Sets the slider for simulations
function resetSlider() {
  document.getElementById('simSlider').value = 0;
  document.getElementById('timer').innerHTML = "00:00:00";
}

//Resets the undo function arrays
function resetUndo() {
  undoArr = [
    [],
    [],
    [],
    []
  ];
  undoGridArr = [];
  undoGridPainters = [];
} //end resetUndo()

//resetYearDisplay removes the years which have been displayed throughout the current session of the game
function resetYearDisplay() {

  //remove all years except the first and reshow the + button (has some prebuilt functionality for expanded number of years)

  for (var i = 2; i < 4; i++) {
    document.getElementById("year" + i + "Button").className = "yearButtonHidden";
    document.getElementById("year" + i + "Image").className = "yearImageHidden";
  }

  document.getElementById("yearAddButton").style.display = "inline-block";

} //end resetYearDisplay

// switch to the setting last stored in session object. Was called when exiting print function
function restoreCurrentCameraSession() {
  // restore the last camera degree, view
  controls.restoreLastState();

  // switch to the last year, tab or level
  switchConsoleTab(6); // switch to year tab
  switchYearTab(session.switchYearTab); // swithch to the exact year
  // swithch last consle tab
  switchConsoleTab(session.switchConsoleTab);
  // choose the LandUseType or player
  if (typeof session.changeSelectedPaintTo !== 'undefined')
    changeSelectedPaintTo(session.changeSelectedPaintTo);
  // displays specific level, feature or yield
  if (typeof session.displayLevels !== 'undefined')
    displayLevels(session.displayLevels);

} // end restoreCurrentCameraSession

//resultsEnd hides the results and returns the menus to the screens
function resultsEnd() {
  //Fucntion for removing event listener when resluts is closed
  document.removeEventListener('keyup', resultsEsc);
  // removeEvent(document, 'keyup', resultsEsc);
  inResults = false;
  //modal is no longer up
  modalUp = false;
  if (curTracking) {
    pushClick(0, getStamp(), 13, 0, null);
  }
  //reset functionality
  document.getElementById("resultsButton").className = "resultsButtonRolled";
  document.getElementById('closeResults').style.opacity = "0";
  document.getElementById("closeResults").style.visibility = "hidden";

  document.getElementById('modalResultsFrame').style.display = "none";

  //reopen elements that were previously open
  if (leftToolConsoleWasOpen) roll(1);
  if (rightPopupWasOpen) togglePopupDisplay();
  if (backgroundInfoBoxWasOpen) toggleBackgroundInfoDisplay();
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
    backgroundInfoBoxWasOpen = false;
    if(document.getElementById("backgroundInfoBox").className == "backgroundInfoBox"){
      toggleBackgroundInfoDisplay();
      backgroundInfoBoxWasOpen = true;
    }

    //prevent background land changes and so forth
    modalUp = true;

    //functions that update results and display them appropriately
    /*
    Since we recalculate the results whenever tile of land use type is changed,
    and we could always get the up-to-date result, so it's unnecessary to calculate result again here.
    calculateResults();
    */
    displayResults();
    animateResults();
    //Event Listener for closing reslts tab
    document.addEventListener('keyup', resultsEsc);
    // addEvent(document, 'keyup', resultsEsc);
  } //end if
} //end resultsStart


//Resumes the sim (and related times)
function resumeSim() {
  paused = false;
  timeResumed = new Date();
  //Amount of time the user was paused (total for session)
  pauseDuration = pauseDuration + (timeResumed - timeStopped);
  //Amount of simulation time that has passed
  sliderTimer = setInterval(updateTime, 1);
  elapsedTime = timeResumed - startTime - pauseDuration;
  for (var j = 0; j < mainTimer.length; j++) {
    //Don't repeat previous steps if you didn't go back in time
    if (parseInt(clickTrackings[j].timeStamp) - elapsedTime > 0) {
      mainTimer[j] = setTimeout(performAction, parseInt(clickTrackings[j].timeStamp) - elapsedTime, j);
    }
  }
  exitTimer = setTimeout(endSimPrompt, endTime - elapsedTime);
  document.getElementById("simSlider").style.zIndex = "1002";
} //end resumeSim()

//this function contains switch statements which take in the real value (Number) of precipitation and gives out their values;

function reversePrecipValue(val)
{
  if(val == 24.58)
  {
    return 0;
  }
  if(val == 28.18)
  {
    return 1;
  }
  if(val == 30.39)
  {
    return 2;
  }
  if(val == 32.16)
  {
    return 3;
  }
  if(val == 34.34)
  {
    return 4;
  }
  if(val == 36.47)
  {
    return 5;
  }
  if(val == 45.10)
  {
    return 6;
  }
} //end reversePrecipValue

//revertChanges undos the users previous tile changes, and goes back to the previous board instance
function revertChanges() {


  // this function will remove all undo steps after the first occurence of one that involves a tile that is toggled off
  removeAfterFirstNotAllowed(undoArr, currentYear);

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
    if (Array.isArray(tempTileAndPainter[0])) {
      undoGrid(tempTileAndPainter);
      //If the undo function is undoing a normal selection
    } else {
      painter = tempTileAndPainter[1];
      changeLandTypeTile(tempTileAndPainter[0]);
      changeLandTypeTileNitrate();
    }
    undo = false;
    painter = tempPainter;


  }
}

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
      document.getElementById('pick').src = "./imgs/pickIn.png";
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
      document.getElementById('pick').src = "./imgs/pickOut.png";
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

//Handles the click tracking simulation replay
function runSimulation() {
  //Begin simulation: Initial step is to clear preset variables before using them.
  resetUndo();
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
    // Splits the .csv file by ','
    var tempArr = simulationData[i].split(',');

    /* Comment: Populates the following variables from the columns of .csv file.
       The columns are:-- clickID, time stamp, click type, time gap, Description of click, Extra data
       All units of time is milli Milliseconds.
       The sixth column or Extra data is often referred to as the tileID. It stores the id of the tile whose land use is changed,
       When a tile is not clicked, it stores other values (as in cases of precip and copy/paste/delete). This is done to save code length.
       (tileID (or Extra data) column is used to store Precip values, copy paste year values)
    */
    var tempID = tempArr[0]; // clickID
    var tempStamp = tempArr[1]; // time stamp
    var tempType = tempArr[2]; // click type
    var tempGap = tempArr[3]; // time gap

    /* Comment: Each value of tempType, in the if-statement below, indicates a case number in the Click() function of file helperObjects.js.
  case 55 - "A tile was painted (single selection)"
       34 - "Year 0 Precip Modified", 35 - "Year 1 Precip Modified", 36 - "Year 2 Precip Modified", 37 - "Year 3 Precip Modified"
       80 - "Click an entry in index page" (Note: here index denotes Glossary in pewi 4.0 and later versions)
       81 - "Click Advanced tab", 82 - "Click General tab"
       91 - "User zoomed in/out of PEWI map"
       92 - "User scrolled in the about page"
       93 - "User scrolled in the index page"
       94 - "User scrolled in the results page"
       101 - " Copied year __"
       102 - "Pasted in year __"
       124 - "User hovered over tab titles"
       125 - "User hovered over tab icons"
    */
    if (tempType == 55 || tempType == 34 || tempType == 35 || tempType == 36 || tempType == 37 || tempType == 80 || tempType == 81 ||
        tempType == 82 || tempType == 91 || tempType == 92 || tempType == 93 || tempType == 94 || tempType == 101 || tempType == 102 ||
        tempType == 103 || tempType == 110 || tempType == 114 || tempType == 122 || tempType == 123 || tempType == 124 || tempType == 125 ||
        tempType == 126 || tempType == 127) {
      var tempTile = tempArr[5]; // Extra data
    }
    if (tempType == 56 || tempType == 99 || tempType == 100) {
      var tempTile = [];
      for (var j = 5; j < tempArr.length; j++) {
        tempTile.push(tempArr[j]);
      }
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

function saveAndRandomize() {
  var prevPainter = painter;
  //Range of values for each land-use type
  var randomPainterTile = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  //randomizing = true
  //for whole board (as long as randomization is allowed)
  if (localStorage.getItem("randAllow") == "true" && !multiplayerAssigningModeOn) {
    //getRandomInt is in back-end helperMethods
    for (var j = 0; j <= randomPainterTile.length; j++) { //Check to see if the landuse type is toggled off or not
      if (document.getElementById('parameters').innerHTML.indexOf('paint' + randomPainterTile[j] + "\n") !== -1) {
        randomPainterTile.splice(j--, 1);
      }
    }
    console.log(randomPainterTile);
    if(randomPainterTile.length === 0){
      throw new Error('Please select at least one land use.');
    }
     //If the only land use selected is wetlands throw an Error
     //This is because wetlands cannot be placed on tiles that are not suitable for wetlands
    if(randomPainterTile == 14){
      throw new Error('Wetlands cannot be the only selected land use. \nPlease select an additional land use.');
    }
    randomPainterTile[0] === 14 ? newDefaultLandUse = randomPainterTile[1]: newDefaultLandUse = randomPainterTile[0];

    var forNitrateCalc = Array(4);
    forNitrateCalc[0] = Array(828);
    forNitrateCalc[1] = Array(828);
    forNitrateCalc[2] = Array(828);
    forNitrateCalc[3] = Array(828);

    outer: for (var i = 1; i < boardData[currentBoard].calculatedToYear + 1; i++) {
      for (var j = 0; j < boardData[currentBoard].map.length; j++) {
        if ((boardData[currentBoard].map[j].landType[i] != LandUseType.none) && !randomPainterTile.includes(boardData[currentBoard].map[j].landType[i])) {
          meshMaterials[j].map = grayTextureArray[painter];
          meshOverlay[j].map = grayTextureArray[painter];
          activeLandUses = randomPainterTile;
          var checkbox = window.top.document.getElementById("toggleOverlay");
          bool = checkbox.checked;
          checkbox.checked = false;
          switchOverlayTemp();refreshBoard();redrawOverlay();

          toggleReplacementFrame(randomPainterTile);
          checkbox.checked = bool;
          break outer;
        }
      }
    }
    for (var n = 1; n < forNitrateCalc.length; n++) {
      for (var t = 0; t < forNitrateCalc[n].length; t++) {
        if(forNitrateCalc[n][t] == 1){
          boardData[currentBoard].map[t].updateNitrate(n);
        }
      }
    }
    painter = newDefaultLandUse; //end for all tiles
    //'unselect' the previously selected icon
    var painterElementId = "paint" + prevPainter;
    document.getElementById(painterElementId).className = "landSelectorIcon icon";
    //change the selected painter to the new default land use
    changeSelectedPaintTo(newDefaultLandUse);
  }
} //end saveandRandomize


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

//Checks other hotkey bindings
//
//givenKey: Key they want to bind
//givenFunc: The command for binding
//givenSlot: Primary or Secondary hotkey binding
function setHotkey(givenKey, givenFunc, givenSlot) {
  //For each hotkey possible
  givenKey = (givenKey.toUpperCase()).charCodeAt(0);
  //Make sure it's an appropriate keycode character
  if (!isNaN(givenKey) || givenKey < 10) {
    for (var i = 0; i < hotkeyArr.length; i++) {
      //For each assigned hotkey for that type (2 is maximum)
      for (var j = 0; j < 2; j++) {
        //If the given hotkey matches one of the existing ones, replace the old with null
        if (hotkeyArr[i][j] == givenKey) {
          hotkeyArr[i][j] = null;
        }
      }
    }
    //Set the new hotkey
    if (hotkeyArr[givenFunc][0] != givenKey && givenSlot == 1 || givenSlot == 2 && hotkeyArr[givenFunc][0] == null) {
      hotkeyArr[givenFunc][0] = givenKey;
    } else {
      hotkeyArr[givenFunc][1] = givenKey;
    }
    updateKeys();
  }
} //end setHotkey(givenKey, givenFunc, givenSlot)

//Sets the paused boolean
function setPause(setValue) {
  paused = setValue;
}

//Sets a new value for runningSim
function setSimBoolean(newValue) {
  runningSim = newValue;
} //end setSimBoolean

//Sets the simUpload boolean value
function setUpload(hotkeyValue) {
  uploadedBoard = givenValue;
} //end setUpload()

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
  // addEvent(document, 'keyup', aboutsEsc);
} //end showCredits

function showEmail() {
  if (!modalUp) {
    if (curTracking) {
      pushClick(0, getStamp(), 11, 0, null); // The parameters may need to change, have no idea what this method does.
    }
    document.getElementById('emailFrame').style.display = "block";
    document.getElementById('closeEmail').style.display = "block";
    document.getElementById('modalEmailFrame').style.display = "block";
    modalUp = true;
  }
  //Event Listner to close the contact us page
  document.addEventListener('keyup', aboutsEsc);
  // addEvent(document, 'keyup', aboutsEsc);
} //end showEmail

//showInfo updates the bottom HUD
function showInfo(stringToShow) {
  if (!multiplayerAssigningModeOn) document.getElementById("currentInfo").innerHTML = stringToShow;
} //end showInfo

//showLevelDetails shows the legend for each of the highlight map functions
function showLevelDetails(value) {
  globalLegend = true;

  //If there is a legend to show, make sure it's visible as the hover tab may have hidden it
  if(typeof document.getElementsByClassName('DetailsList')[0] !== 'undefined'){
    document.getElementsByClassName('DetailsList')[0].style.visibility = 'visible';
  }

  switch (value) {
    case 1:
      //show nitrate legend
      document.getElementById('nitrateIcon').className = "levelsSelectorIcon iconSelected";
      document.getElementById("nitrateDetailsList").className = "DetailsList levelDetailsList";
      break;
    case 2:
      //show erosion legend
      document.getElementById('erosionIcon').className = "levelsSelectorIcon iconSelected";
      document.getElementById("erosionDetailsList").className = "DetailsList levelDetailsList";
      break;
    case 3:
      //show phosphorus legend
      document.getElementById('phoshorusIcon').className = "levelsSelectorIcon iconSelected";
      document.getElementById("phosphorusDetailsList").className = "DetailsList levelDetailsList";
      break;
    case 4:
      //show flood frequency legend
      document.getElementById('floodFrequency').className = "featureSelectorIcon iconSelected";
      document.getElementById("floodDetailsList").className = "DetailsList physicalDetailsList";
      break;
    case 5:
      //show drainage class legend
      document.getElementById('drainageClass').className = "featureSelectorIcon iconSelected";
      document.getElementById("drainageDetailsList").className = "DetailsList physicalDetailsList";
      break;
    case 6:
      //show strategic wetlands legend
      document.getElementById('strategicWetlands').className = "featureSelectorIcon iconSelected";
      document.getElementById("wetlandsDetailsList").className = "DetailsList physicalDetailsList";
      break;
    case 7:
      //show subwatershed legend
      document.getElementById('subwatershedBoundaries').className = "featureSelectorIcon iconSelected";
      document.getElementById("boundaryDetailsList").className = "DetailsList physicalDetailsList";
      break;
    case 8:
      document.getElementById('soilClass').className = "featureSelectorIcon iconSelected";
      document.getElementById('soilDetailsList').className = "DetailsList physicalDetailsList";
      break;
      //Topo layout
    case 9:
      document.getElementById('topoClass').className = "featureSelectorIcon iconSelected";
      document.getElementById('topoDetailsList').className = "DetailsList physicalDetailsList";
      break;
    case 10:
      //show Corn class legend
      document.getElementById('cornClass').className = "yieldSelectorIcon iconSelected";
      document.getElementById('cornDetailsList').className = "DetailsList yieldDetailsList";
      updateGlossaryPopup('<span style="color:orange;">Conventional Corn and Conservation Corn</span> produce the same output based on soil type. To learn more, go to the <span style="color:yellow">Glossary</span>, select <span style="color:yellow">"Modules"</span>, and then <span style="color:yellow">"Yield"</span>.');
      break;
    case 11:
      //show soy class legend
      document.getElementById('soyClass').className = "yieldSelectorIcon iconSelected";
      document.getElementById('soybeanDetailsList').className = "DetailsList yieldDetailsList";
      updateGlossaryPopup('<span style="color:orange;">Conventional Soy and Conservation Soy</span> produce the same output based on soil type. To learn more, go to the <span style="color:yellow">Glossary</span>, select <span style="color:yellow">"Modules"</span>, and then <span style="color:yellow">"Yield"</span>.');
      break;
    case 12:
      //show fruit class legend
      document.getElementById('fruitClass').className = "yieldSelectorIcon iconSelected";
      document.getElementById('fruitDetailsList').className = "DetailsList yieldDetailsList";
      updateGlossaryPopup('To learn more about <span style="color:orange;">Mixed Fruits and Vegetable Yield</span>, go to the <span style="color:yellow">Glossary</span>, select <span style="color:yellow">"Modules"</span>, and then <span style="color:yellow">"Yield"</span>.');
      break;
    case 13:
      //show cattle class legend
      document.getElementById('cattleClass').className = "yieldSelectorIcon iconSelected";
      document.getElementById('cattleDetailsList').className = "DetailsList yieldDetailsList";
      updateGlossaryPopup('<span style="color:orange;">Permanent Pasture and Rotational Grazing</span> produce the same output based on soil type. To learn more, go to the <span style="color:yellow">Glossary</span>, select <span style="color:yellow">"Modules"</span>, and then <span style="color:yellow">"Yield"</span>.');
      break;
    case 14:
      //show alfalfa class legend
      document.getElementById('alfalfaClass').className = "yieldSelectorIcon iconSelected";
      document.getElementById('alfalfaDetailsList').className = "DetailsList yieldDetailsList";
      updateGlossaryPopup('To learn more about Alfalfa Hay Yield, go to the Glossary, select "Modules", and then "Yield".');
      updateGlossaryPopup('To learn more about <span style="color:orange;">Alfalfa Hay Yield</span>, go to the <span style="color:yellow">Glossary</span>, select <span style="color:yellow">"Modules"</span>, and then <span style="color:yellow">"Yield"</span>.');
      break;
    case 15:
      //show grasshay class legend
      document.getElementById('grassHayClass').className = "yieldSelectorIcon iconSelected";
      document.getElementById('grasshayDetailsList').className = "DetailsList yieldDetailsList";
      updateGlossaryPopup('To learn more about <span style="color:orange;">Grass Hay Yield</span>, go to the <span style="color:yellow">Glossary</span>, select <span style="color:yellow">"Modules"</span>, and then <span style="color:yellow">"Yield"</span>.');
      break;
    case 16:
      //show switchgrass class legend
      document.getElementById('switchGrassClass').className = "yieldSelectorIcon iconSelected";
      document.getElementById('switchgrassDetailsList').className = "DetailsList yieldDetailsList";
      updateGlossaryPopup('To learn more about <span style="color:orange;">Switchgrass Yield</span>, go to the <span style="color:yellow">Glossary</span>, select <span style="color:yellow">"Modules"</span>, and then <span style="color:yellow">"Yield"</span>.');

      break;
    case 17:
      //show wood class legend
      document.getElementById('woodClass').className = "yieldSelectorIcon iconSelected";
      document.getElementById('woodDetailsList').className = "DetailsList yieldDetailsList";
      updateGlossaryPopup('<span style="color:orange;">Conventional Forest and Conservation Forest</span> produce the same output based on soil type. To learn more, go to the <span style="color:yellow">Glossary</span>, select <span style="color:yellow">"Modules"</span>, and then <span style="color:yellow">"Yield"</span>.');
      break;
    case 18:
      //show short class legend
      document.getElementById('shortClass').className = "yieldSelectorIcon iconSelected";
      document.getElementById('shortDetailsList').className = "DetailsList yieldDetailsList";
      updateGlossaryPopup('<span style="color:orange;">Short-Rotation Woody Biomass</span> produces the same output, no matter the soil type. To learn more, go to the <span style="color:yellow">Glossary</span>, select <span style="color:yellow">"Modules"</span>, and then <span style="color:yellow">"Yield"</span>.');
      break;
    case 19:
      //show sediment legend
      document.getElementById('sedimentIcon').className = "levelsSelectorIcon iconSelected";
      document.getElementById("sedimentDetailsList").className = "DetailsList levelDetailsList";
      break;
    case 20:
      //show carbon legend
      document.getElementById('carbonIcon').className = "levelsSelectorIcon iconSelected";
      document.getElementById("carbonDetailsList").className = "DetailsList levelDetailsList";
      break;

    case 21:
      //show game wildlife legend
      document.getElementById('gamewildlifeIcon').className = "levelsSelectorIcon iconSelected";
      document.getElementById("gamewildlifeDetailsList").className = "DetailsList levelDetailsList";
      break;

    case 22:
      //show biodiversity legend
      document.getElementById('biodiversityIcon').className = "levelsSelectorIcon iconSelected";
      document.getElementById("biodiversityDetailsList").className = "DetailsList levelDetailsList";
      break;

    case 23:
      //show biodiversity legend
      document.getElementById('nitratetileIcon').className = "levelsSelectorIcon iconSelected";
      document.getElementById("nitratetileDetailsList").className = "DetailsList levelDetailsList";
      break;
  } // END switch


  //hide ecosystem indicator legends
  if ((value > -4 && value < 0) || (value<=-19 && value>=-23)) {
    globalLegend = false;
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
  else if (value < -3 && value > -10) {
    globalLegend = false;
    var element = document.getElementsByClassName('DetailsList physicalDetailsList');
    if (element.length > 0) {
      element[0].className = 'DetailsListRolled physicalDetailsList';
    }
    element = document.getElementsByClassName('featureSelectorIcon iconSelected');
    if (element.length > 0) {
      element[0].className = 'featureSelectorIcon icon';
    }
  } //end else/if group
  else if (value < -9) {
    globalLegend = false;
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
  // addEvent(document, 'keyup', downuploadEsc);
  if (mapIsHighlighted) {
    displayLevels();
  }
} //end showUploadDownload

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
  curPlayersArr.sort(function(a, b) {
    return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
  });
  for (var i = 0; i < curPlayersArr.length; i++) {
    tempPlayer = curPlayersArr[i];
    //If the player doesn't exist, but later players do, cascade them down
    if (tempPlayer.id != "paintPlayer" + (i + 1)) {
      addPlayer(i + 1);
      //Find the next actual player
      for (var j = i; j < curPlayersArr.length; j++) {
        tempPlayer = curPlayersArr[j];
        //For the example above, this will first find 5, then make all the player 5 tiles as player 4's. This will also make all of player 6's
        //  tiles as player 5's. At the end of this method, player 6 will be deleted, leaving you with players 1,2,3,4, and 5
        if (tempPlayer != null) {
          var changedPlayer = parseInt(tempPlayer.id.substr(11, 1));
          combineMulti([i + 1, changedPlayer]);
          break;
        }
      }
    }
  }
} //end sortPlayers()

// startOptions displays the options page
function startOptions() {

  if (curTracking) {
    pushClick(0, getStamp(), 107, 0, null);
  }
  selectedOptionsTrue = []; //The aray to hold all elements to be set to true is cleared.
  selectedOptionsFalse = []; //The aray to hold all elements to be set to false is cleared.
  document.getElementById('options').contentWindow.recordCurrentOptions();

  //if nothing else has precedence
  if (!modalUp) { //commented for debugging
    modalUp = true;
    document.getElementById('options').style.visibility = "visible";
    //setup options page with the current parameter selection
    document.getElementById('options').contentWindow.getCurrentOptionsState();
    // add Esc key event listener
    document.addEventListener('keyup', optionsEsc);
    window.frames[6].document.addEventListener('keyup', optionsEsc);
    // addEvent(document, 'keyup', optionsEsc);
    // addEvent(window.frames[4].document, 'keyup', optionsEsc);

    // hide the hotkey table when we click on 'Options' button
    var tableInOption = window.frames[6].document.getElementById('hotkeyAggregateTool');
    if(tableInOption != null && tableInOption.style.display != 'none'){
      tableInOption.style.display = 'none';
      window.frames[6].document.getElementById('hotkeySets').innerHTML = '';
    }

    // hide the progressbar min/max setup table when we click on 'Options' button
    tableInOption = window.frames[6].document.getElementById('progressBarAggregateTool');
    if(tableInOption != null && tableInOption.style.display != 'none'){
      tableInOption.style.display = 'none';
      window.frames[6].document.getElementById('progressBarSets').innerHTML = '';
    }
  }
} // end startOptions

// startPrintOptions displays the printOptions page
function startPrintOptions() {

    if(curTracking) {
      pushClick(0,getStamp(),113,0,null);
    }

    camera.aspect = 1.5;
    camera.updateProjectionMatrix();

  //if nothing else has precedence
  if (!modalUp) {
    // save the last state that user have
    storeCurrentCameraSession();
    modalUp = true;
    document.getElementById('printOptions').style.visibility = "visible";
    // add Esc key event listener
    document.addEventListener('keyup', printOptionsEsc);
    window.frames[7].document.addEventListener('keyup', printOptionsEsc);
    // pass the current uplimit year
    var uptoYear = boardData[currentBoard].calculatedToYear;
    window.frames[7].initPrintOptions(uptoYear);
  }
} // end startPrintOptions

// store Current Camera Session, for print function. Was called when entering print function
function storeCurrentCameraSession(actionCode, value) {

  // store the last map the user viewed
  switch (actionCode) {
    case 0:
      // save the LandUseType or player
      session.changeSelectedPaintTo = value;
      break;
    case 1:
      // save the specific level, feature or yield
      session.displayLevels = value;
      break;
    case 2:
      // save last consle tab
      session.switchConsoleTab = value;
      break;
    case 3:
      // save the exact year
      session.switchYearTab = value;
      break;
    default:
      // store the last camera degree, view, zoom
      controls.storeCurrentState();
      break;
  }
} // end storeCurrentCameraSession

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
  switch (value) {
    // Painters Tab or land use icon selected
    case 1:
      inDispLevels = false;
      resultsMappedHover=false;
      if (curTracking) {
        pushClick(0, getStamp(), 4, 0, null);
      }
      document.getElementById('terrainImg').className = "imgSelected";
      document.getElementById('painterTab').style.display = "block";
      //hide overlay toggle switch
      var overlay = document.getElementsByClassName('checkOverlay');
      for(var i = 0; i < overlay.length; i++){
        overlay[i].style.display = "none";
      }
      document.getElementById('checkheader').style.display = "none";
      updateGlossaryPopup('These are the <span style="color:orange;">15</span> different <span style="color:orange;">land use types</span>. To learn more about them, go to the <span style="color:yellow;">Glossary</span> and select <span style="color:yellow;">"Land Use"</span>.');
      break;
      // Precipitation tab selected
    case 2:
      inDispLevels = false;
      resultsMappedHover=false;
      if (curTracking) {
        pushClick(0, getStamp(), 5, 0, null);
      }
      document.getElementById('precipImg').className = "imgSelected";
      document.getElementById('precipTab').style.display = "block";
      //hide overlay toggle switch
      var overlay = document.getElementsByClassName('checkOverlay');
      for(var i = 0; i < overlay.length; i++){
        overlay[i].style.display = "none";
      }
      document.getElementById('checkheader').style.display = "none";
      yearPrecipManager();
      updateGlossaryPopup('This is the <span style="color:orange;">Precipitation Tab.</span> To learn more, go to the <span style="color:yellow;">Glossary</span> and select<span style="color:yellow;"> "Precipitation"</span>.');
      break;
    // 'Result maps' icon selected
    case 3:
      resultsMappedHover=true;
      inDispLevels = true;
      if (curTracking) {
        pushClick(0, getStamp(), 7, 0, null);
      }
      document.getElementById('levelsImg').className = "imgSelected";
      document.getElementById('levelsTab').style.display = "block";
      //show overlay toggle switch
      var overlay = document.getElementsByClassName('checkOverlay');
      for(var i = 0; i < overlay.length; i++){
        overlay[i].style.display = "block";
      }
      document.getElementById('checkheader').style.display = "block";
      updateGlossaryPopup('This is the <span style="color:orange;">Levels Tab,</span> where you can learn about <span style="color:yellow;">Soil Quality and Water Quality</span>.');
      break;
      // Physical features tab selected
    case 4:
      inDispLevels = true;
      resultsMappedHover=false;
      if (curTracking) {
        pushClick(0, getStamp(), 8, 0, null);
      }
      document.getElementById('featuresImg').className = "imgSelected";
      document.getElementById('featuresTab').style.display = "block";


      //show overlay toggle switch
      var overlay = document.getElementsByClassName('checkOverlay');
      for(var i = 0; i < overlay.length; i++){
        overlay[i].style.display = "block";
      }
      document.getElementById('checkheader').style.display = "block";
      updateGlossaryPopup('This is the <span style="color:orange;">Physical Features Tab</span>, where you will find information on topography, soil properties, subwatershed boundaries, and strategic wetland areas.');
      break;
    // ** No description given of what this case does **
    case 5:
      inDispLevels = false;
      resultsMappedHover=false;
      if (curTracking) {
        pushClick(0, getStamp(), 9, 0, null);
      }
      document.getElementById('settingsImg').className = "imgSelected";
      document.getElementById('settingsTab').style.display = "block";
      //hide overlay toggle switch
      var overlay = document.getElementsByClassName('checkOverlay');
      for(var i = 0; i < overlay.length; i++){
        overlay[i].style.display = "none";
      }
      document.getElementById('checkheader').style.display = "none";
      break;
    // Year selection tab selected
    case 6:
      inDispLevels = false;
      resultsMappedHover=false;
      if (curTracking) {
        pushClick(0, getStamp(), 6, 0, null);
      }
      document.getElementById('calendarImg').className = "imgSelected";
      document.getElementById('yearsTab').style.display = "block";
      //hide overlay toggle switch
      var overlay = document.getElementsByClassName('checkOverlay');
      for(var i = 0; i < overlay.length; i++){
        overlay[i].style.display = "none";
      }
      document.getElementById('checkheader').style.display = "none";
      yearCopyPasteInit();
      updateGlossaryPopup('The <span style="color:orange;">Years Tab</span> allows you to play across multiple years. Different years can affect impact of land use choices. Check them out!');
      break;
    // Yield base rate tab selected
    case 7:
      inDispLevels = true;
      resultsMappedHover=false;
      if (curTracking) {
        pushClick(0, getStamp(), 68, 0, null);
      }
      document.getElementById('yieldImg').className = "imgSelected";
      document.getElementById('yieldTab').style.display = "block";

      var overlay = document.getElementsByClassName('checkOverlay');
      //show overlay toggle switch

      for(var i = 0; i < overlay.length; i++){
        overlay[i].style.display = "block";
      }
      document.getElementById('checkheader').style.display = "block";
      updateGlossaryPopup('The <span style="color:orange;">Yield Tab</span> allows you to see different yield base rates based on soil type for different landuse types.');
      break;
  } // END switch

  //check if the map needs the levels legend displayed
  if (mapIsHighlighted && value == 1) {
    displayLevels();
  }

  showLevelDetails();
  // store last users action ( print function )
  if (!modalUp) {
    storeCurrentCameraSession(2, value);
  } // END if
} //end switchConsoleTab

function switchCurrentPlayer(playerNumber) {
  currentPlayer = playerNumber;
  //boardData[currentBoard].updateBoard();
} //end transitionToYear

//switchYearTab changes the highlighted year
function switchYearTab(yearNumberToChangeTo) {

  try {
    //get the currently selected year and make it not selected
    var elements = document.getElementsByClassName("icon yearSelected");
    elements[0].className = "icon yearNotSelected";
  } catch (except) {
    console.log("No year was selected, selecting the given year now");
  }

  //then toggle on the selected year
  var yearIdString = "year" + yearNumberToChangeTo + "Image";
  document.getElementById(yearIdString).className = "icon yearSelected";
  refreshProgressBar(currentYear);
  setupStaticBackground();
  // store last users action ( print function )
  if (!modalUp) {
    storeCurrentCameraSession(3, yearNumberToChangeTo);
  } // END if
} //end switchYearTab

//Allows user to
function toggleBackgroundInfoDisplay() {
  if (curTracking) {
    pushClick(0, getStamp(), 84, 0, null);
  }
  if (!modalUp) {
    if (document.getElementById("backgroundInfoBox").className == "backgroundInfoBox") {
      document.getElementById("backgroundInfoBox").className = "backgroundInfoBoxRolled";
      document.getElementById("backgroundInfoButton").className = "backgroundInfoButtonRolled";
    } else {
      document.getElementById("backgroundInfoBox").className = "backgroundInfoBox";
      document.getElementById("backgroundInfoButton").className = "backgroundInfoButton";
    }
  } // end if
} // end toggleBackgroundInfoDisplay

//toggleChangeLandType toggles a boolean that tracks the state which is required to change land type
function toggleChangeLandType() {
  //ternary toggle on clearToChangeLandType being true
  clearToChangeLandType =
    (clearToChangeLandType) ? false : true;
} //end toggleChangeLandType

//toggleEscapeFrame displays and hides the div that allows the user to go to the main menu, options, or directory
function toggleEscapeFrame() {

  /* This condition is selected when 'Yes' option under 'Menu Menu'-button is clicked in the Modal escape frame
      Check file index.html <div class="mainEscapeButton" id="yesConfirmEscape" ...>
  */
  if (document.getElementById('confirmEscape').style.height == "20vw") {
    confirmEscape();
  }
  console.log(modalUp);

  /* This condition is selected when home button is clicked or Esc-key is pressed
      Check file index.html <img id="homebutton" ..>
  */
  if (document.getElementById('modalEscapeFrame').style.display != "block" && !modalUp) {
    document.getElementById('modalEscapeFrame').style.display = "block";
    document.getElementById('exitToMenuButton').style.visibility = "visible";
    document.getElementById('optionsButton').style.visibility = "visible";
    document.getElementById('escapeButton').style.visibility = "visible";
    if (curTracking) {
      pushClick(0, getStamp(), 106, 0, null);
    }
    /* Commented out Glossary button, which is line below. Reference Issue 363 on explanation for removal.
    document.getElementById('directoryButton').style.visibility = "visible";
    */
    modalUp = true;
  }

  /* This condition is selected when [X]-button OR Customize-button is clicked in the Modal escape frame
      Check file index.html <div id="modalEscapeFrame">
  */
  else if (document.getElementById('modalEscapeFrame').style.display == "block" && modalUp)
  {
    document.getElementById('modalEscapeFrame').style.display = "none";
    document.getElementById('exitToMenuButton').style.visibility = "hidden";
    document.getElementById('optionsButton').style.visibility = "hidden";
    document.getElementById('escapeButton').style.visibility = "hidden";
    if (curTracking) {
      pushClick(0, getStamp(), 106, 0, null);
    }
    /* Commented out Glossary button, which is line below. Reference Issue 363 on explanation for removal.
    document.getElementById('directoryButton').style.visibility = "hidden";
    */
    modalUp = false;
  }
  //Here I have unlocked the options button on the multiplayer screen. Bear in mind that any changes made to the
  //land uses IE toggling them on will show up on the multiplayer screen. The options in multiplayer screen are all
  //locked.
  // XXX WHAT'S THE DIFFERENCE FOR THIS IF/ELSE?
  if (multiplayerAssigningModeOn) {
    document.getElementById('optionsButton').className = "mainEscapeButton";
  } else {
    document.getElementById('optionsButton').className = "mainEscapeButton";
  }

} //end toggleEscapeFrame





function toggleReplacementFrame(options) {
  var modal = document.getElementById('modalReplacement');
  innermodal = modal.contentDocument || modal.contentWindow.document;
  if(modal.style.display === 'block'){
    modal.style.display = 'none';
    modalUp = false;
  }
  else {
    modal.style.display = 'block';
    modal.style.visibility = 'visible';
    select = innermodal.getElementById('replacementSelect');
    while(select.firstChild){
      select.removeChild(select.firstChild);
    }
    options.forEach(function(option){
      if(option === 14) return;
      var opt = document.createElement('option');
      opt.innerHTML = LandUseType.getPrintFriendlyType(option);
      opt.value = option;
      select.appendChild(opt)
    });
    modalUp = true;
  }
}

function fillDeactivatedLands(){
  let modal = document.getElementById('modalReplacement');
  let innermodal = modal.contentDocument || modal.contentWindow.document;
  let select = innermodal.getElementById('replacementSelect');
  temp = painter; //Since changeLandTypeTile requires the global variable painter to paint we want to save it's state and change it back.
  painter = parseInt(select.value);
  for (var i = 1; i < boardData[currentBoard].calculatedToYear + 1; i++) {
    for (var j = 0; j < boardData[currentBoard].map.length; j++) {
      if ((boardData[currentBoard].map[j].landType[i] != LandUseType.none) && !activeLandUses.includes(boardData[currentBoard].map[j].landType[i])) {
        changeLandTypeTile(j, i);
      }
    }
  }
  toggleReplacementFrame();
  refreshBoard();
  painter = temp;
  refreshProgressBar(currentYear);
}

//toggleGlossary displays and hides the codex
function toggleGlossary() {
  if (document.getElementById('glossary').style.display != "block" && !modalUp) {

    closeCreditFrame();
    closeEmailFrame();
    closeUploadDownloadFrame();
    if (document.getElementById('modalResultsFrame').style.display == "block") resultsEnd();

    if (curTracking) {
      pushClick(0, getStamp(), 78, 0, null);
    }
    modalUp = true;
    document.getElementById('modalCodexFrame').style.display = "block";
    //document.getElementById('index').style.display = "block";
    document.getElementById('glossary').style.display = "block";
    document.addEventListener('keyup', glossaryEsc);
    // addEvent(document, 'keyup', glossaryEsc);
  }
  //else if (document.getElementById('index').style.display == "block" && modalUp) {
  else if (document.getElementById('glossary').style.display == "block" && modalUp) {
    if (curTracking) {
      pushClick(0, getStamp(), 79, 0, null);
    }
    modalUp = false;

    document.getElementById('modalCodexFrame').style.display = "none";
    document.getElementById('glossary').style.display = "none";
    //document.getElementById('index').style.display = "none";
    document.activeElement.blur();

    /*document.getElementById('index').contentWindow.document.getElementById('square1').innerHTML = "<img src='./imgs/indexMain.png'>";
    document.getElementById('index').contentWindow.document.getElementById('square2frame').src = "";
    document.getElementById('index').contentWindow.document.getElementById('switchGeneral').style.display = "none";
    document.getElementById('index').contentWindow.document.getElementById('switchAdvanced').style.display = "none";
    document.getElementById('index').contentWindow.document.getElementById('title').innerHTML = "";
    */
    document.getElementById('glossary').contentWindow.document.getElementById('square1').innerHTML = "<img src='./imgs/indexMain.png'>";
    document.getElementById('glossary').contentWindow.document.getElementById('square2frame').src = "";
    document.getElementById('glossary').contentWindow.document.getElementById('switchGeneral').style.display = "none";
    document.getElementById('glossary').contentWindow.document.getElementById('switchAdvanced').style.display = "none";
    document.getElementById('glossary').contentWindow.document.getElementById('title').innerHTML = "";

    //document.getElementById('index').contentWindow.resetHighlighting();
    document.getElementById('glossary').contentWindow.resetHighlighting();
    document.removeEventListener('keyup', glossaryEsc);
    // removeEvent(document, 'keyup', glossaryEsc);
  }
} //end toggleGlossary

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

//togglePopupDisplay allows for displaying and hiding the popup dialogue
function togglePopupDisplay() {
  if (!modalUp) {
    if (document.getElementById("popup").className == "popup") {
      if (curTracking) {
        pushClick(0, getStamp(), 14, 0, null);
      }
        document.getElementById("popup").className = "popupHidden";
        document.getElementById("bookMarkButton").className = "bookMarkButtonRolled";
    }
    else {
      if (curTracking) {
        pushClick(0, getStamp(), 54, 0, null);
      }
      // Bookmark popup locked in simulation replay mode
      if(!isSimRunning()) {
        document.getElementById("popup").className = "popup";
        document.getElementById("bookMarkButton").className = "bookMarkButton";
      }

    }
  } //end if
} // togglePopupDisplay()

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

  var progressbarIds = ["gameWildlifeProgressBar","biodiversityProgressBar","carbonProgressBar","erosionProgressBar","nitrateProgressBar","phoshorusProgressBar",
                        "sedimentProgressBar","cornGrainProgressBar","soybeansProgressBar","fruitsAndVegetablesProgressBar","cattleProgressBar","alfalfaHayProgressBar",
                        "grassHayProgressBar","switchgrassBiomassProgressBar","woodProgressBar","woodyBiomassProgressBar","totalYieldsProgressBar"];

  //reset default on items
  if (!multiplayerAssigningModeOn) {
    for (var i = 1; i <= 15; i++) {
      var string = "paint" + i;
      document.getElementById(string).parentNode.style.display = "inline-block";
    }

    document.getElementById('progressBarContainer').style.display = "block";

    for(var i = 0; i < progressbarIds.length; i++){
      // if(i < 7 || i == 16)
        document.getElementById(progressbarIds[i]).style.display = "block";
      // else{
      //   window.frames[6].document.getElementById(progressbarIds[i]).checked = true;
      // }

    }

  }

  document.getElementById('year1Button').style.display = "block";
  document.getElementById('year2Button').style.display = "block";
  document.getElementById('year3Button').style.display = "block";
  document.getElementById('year1PrecipContainer').style.display = "none";
  document.getElementById('year2PrecipContainer').style.display = 'none';
  document.getElementById('year3PrecipContainer').style.display = 'none';
  document.getElementById('resultsButton').style.display = 'block';

  //reset precip
  immutablePrecip = false;

  //alright, now let's see what the parameters look like
  // abscond them from the index.html page parameters div
  //    if(!multiplayerAssigningModeOn){
  var strRawContents = document.getElementById('parameters').innerHTML;
  //split based on escape chars
  while (strRawContents.indexOf("\r") >= 0) {
    strRawContents = strRawContents.replace("\r", "")
  }
  var arrLines = strRawContents.split("\n");


  //for each line of the parameters div, as each keyword has its own line
  for (var i = 0; i < arrLines.length; i++) {
    if (arrLines[i]) {

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
          document.getElementById('playerAddButton').style.display = "inline-block";
          break;
        case "allProgressbars":
          document.getElementById('progressBarContainer').style.display = "none";
          break;

        default:
          if (arrLines[i].slice(0, 5) == 'paint') {
            document.getElementById(arrLines[i]).parentNode.style.display = "none"; //If you do the child instead of the parent the parent becomes empty and still takes up space
          }
          break;
      } // end switch
    if(progressbarIds.indexOf(arrLines[i]) != -1){
      document.getElementById(arrLines[i]).style.display = "none";
    }
   } // end if
  } //end for


  //toggle Precip visibility
  for (var y = 0; y <= 3; y++) {
    document.getElementById("year" + y + "PrecipContainer").style.display = "block";

    var elementIdString = "year" + y + "Precip";

    document.getElementById(elementIdString).style.display = "inline-block";

    var currentInnerHtml = (document.getElementById(elementIdString + "Container").innerHTML).trim();
    //if it's not, not a number, that is, if the last digit is a number
    //  then we know the precip was immutable before and we need to cut
    //  this text off
    if (!isNaN(currentInnerHtml[currentInnerHtml.length - 1])) {
      while (currentInnerHtml[currentInnerHtml.length - 1] != '>') {
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
  // Suppose you are on year 3, the map shows the tiles of year 3. If you delete year 3 now, the map transforms to year 2.
  // Similarly, if you are on year 2 and delete year 2, the map transforms to year 1
  // When a year is deleted, its style.display changes to "none". Using this, the yearMax value is reduced by 1
  var yearMax = 3;
  // Changing the yearMax value when year 3 or 2 is deleted
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

//transitionToYear updates the graphics for a board to "year" input
function transitionToYear(year) {
  currentYear = year;
  yearSelected = year;
  var specialCase = 0;
  var tempNum = year + 37;
  if (curTracking) {
    pushClick(0, getStamp(), tempNum, 0, null);
  }
  //only for addition
  if (year > boardData[currentBoard].calculatedToYear && addingYearFromFile == false) {
    boardData[currentBoard].calculatedToYear = year;
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      boardData[currentBoard].map[i].landType[year] = boardData[currentBoard].map[i].landType[year - 1];
    } // end for
  } // end if

  //only after year 2 is deleted - special case; comes from deleteYearAndTransition
  //the board is not refreshed or updated here, instead, for this case it is done in deleteYearAndTransition
  if (year == boardData[currentBoard].calculatedToYear && !addingYearFromFile && year2to3) {
    boardData[currentBoard].calculatedToYear = year;
    specialCase = 1;
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      boardData[currentBoard].map[i].landType[year - 1] = boardData[currentBoard].map[i].landType[year];
    } // end for
    if(overlayTemp == true){
      overlayTemp = false;
    }
    mapIsHighlighted = false;
    boardData[currentBoard].updateBoard();
    refreshBoard();
    //now make the landtype of the one deleted to 1 - in this case, landtype[3] = 1
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      if (boardData[currentBoard].map[i].landType[year] != 0) {
        boardData[currentBoard].map[i].landType[year] = 1;
      } else {
        boardData[currentBoard].map[i].landType[year] = 0;
      }
      boardData[currentBoard].calculatedYear = 2;
    } // end for
  } // end if

  //only for year subtraction - comes from deleteYearAndTransition
  if (year < boardData[currentBoard].calculatedToYear && !addingYearFromFile && g_isDeleted) {
    boardData[currentBoard].calculatedToYear = year;
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      boardData[currentBoard].map[i].landType[year] = boardData[currentBoard].map[i].landType[year + 0];
    } //end for
    //now make the landtype of the one deleted to 1
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      if (boardData[currentBoard].map[i].landType[year + 1] != 0) {
        boardData[currentBoard].map[i].landType[year + 1] = 1;
      } else {
        boardData[currentBoard].map[i].landType[year + 1] = 0;
      }
    } // end for
  } //end if
  //this is another special case, where year 1 can be deleted if at least any other year is present.
  if (year <= boardData[currentBoard].calculatedToYear && !addingYearFromFile && g_year1delete) {
    boardData[currentBoard].calculatedToYear = year;
    specialCase = 1;
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      boardData[currentBoard].map[i].landType[year - 1] = boardData[currentBoard].map[i].landType[year];
    } //end for
    if(overlayTemp == true){
      overlayTemp = false;
    }
    mapIsHighlighted = false;
    boardData[currentBoard].updateBoard();
    refreshBoard();
    //if year 2 was the only other year, then make year 2 as default
    //otherwise, run the other special case from here on
    if (maxYear == 2) {
      for (var i = 0; i < boardData[currentBoard].map.length; i++) {
        if (boardData[currentBoard].map[i].landType[year] != 0) {
          boardData[currentBoard].map[i].landType[year] = 1;
        } else {
          boardData[currentBoard].map[i].landType[year] = 0;
        }
      } // end for
    } // end if
  } //end if

  if (addingYearFromFile == true) {
    boardData[currentBoard].calculatedToYear = year;
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      boardData[currentBoard].map[i].landType[year] = boardData[currentBoard].map[i].landType[year];
    } // end for
  } // end if
  g_year1delete = false;
  year2to3 = false;
  g_isDeleted = false;
  //update here for regular cases;
  if (!specialCase) {
    if(overlayTemp == true){
      overlayTemp = false;
    }
    mapIsHighlighted = false;
    boardData[currentBoard].updateBoard();
    refreshBoard();
  }
  specialCase = 0;
} //end transitionToYear

//Clumps and undo's multiple tiles
function undoGrid(givenTilesAndPainter) {
  //Go through each tile and replace the paint with the paint previously there

  while (givenTilesAndPainter[1].length > 0) {
    painter = givenTilesAndPainter[1].pop();
    var tile = givenTilesAndPainter[0].pop();
    changeLandTypeTile(tile);
  }
  changeLandTypeTileNitrate();

} //end givenTilesAndPainter

//Determines if the tile to be added is unique (non-repeated in paint and tileId)
function uniqueTileChange(tileId) {
  //If there are no tiles yet, it is unique
  if (undoArr[currentYear].length == 0) {
    return true;
  }
  //Retrieves the last item in the array without deleting it
  var tempTileAndPainter = undoArr[currentYear].slice(-1).pop();
  //If the previously added tileId/Paint combo was the same tile and the same paint, it's not a unique change.
  if (tileId == tempTileAndPainter[0] && boardData[currentBoard].map[tileId].landType[currentYear] == painter && painterTool.status != 2) {
    return false;
  } else {
    return true;
  }
} //end uniqueTileChange(tileId)

function updateGlossaryPopup(string) {
  window.parent.document.getElementById("glossaryPopupText").innerHTML = string;
  // window.parent.document.getElementById("backgroundInfoButton").style.background = '#' + Math.random().toString(16).slice(-6); // Assign random background color.
}

//Updates the visuals for the user
function updateKeys() {
  for (var i = 0; i < hotkeyArr.length; i++) {
    for (var j = 0; j < 2; j++) {
      var temp = j + 1;
      if(window.frames[6].document.getElementById('hotkeyAggregateTool').style.display == 'block'){
        if (hotkeyArr[i][j] == null) {
          window.frames[6].document.getElementById("hki" + i + "e" + temp).value = "";
          window.frames[6].document.getElementById("hki" + i + "e" + temp).placeholder = "N/A";
        } else {
          window.frames[6].document.getElementById("hki" + i + "e" + temp).value = "";
          window.frames[6].document.getElementById("hki" + i + "e" + temp).placeholder = String.fromCharCode(hotkeyArr[i][j]);
        }
      }
    }
  }
} //end updateKeys()

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

  // update the results and progress bars whenever precipitation is changed.
  // for (var i = 0; i < boardData[currentBoard].map.length; i++) {
  //   calculateResults(i,year);
  // }
  calculateResults(undefined,year);
  refreshProgressBar(currentYear);
} //updatePrecip

//updatePopup appends text to the popup dialogue
function updatePopup(string) {
  document.getElementById("popupText").innerHTML = string + "<br>___________________________<br>" + document.getElementById("popupText").innerHTML;
  document.getElementById("popup").className = "popup";
  document.getElementById("bookMarkButton").className = "bookMarkButton";
  // document.getElementById("bookMarkButton").style.background = '#' + Math.random().toString(16).slice(-6); // Assign random background color.
  //document.getElementById("popup").style.background= "green";
  //Will activate an animation on the lower right side of the screen to show that the message box has updated
} //end updatePopup

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
  //Variable is true if they went back in time, false if they didn't
  var backToTheFuture = false;
  var previousTime = elapsedTime;
  clearTimers();
  //If the user is going back in time, refresh the board so that future changes don't yet happen
  if (elapsedTime > newTime) {
    resetPresets();
    backToTheFuture = true;
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
    //Don't repeat previous steps if you didn't go back in time
    if (backToTheFuture || !backToTheFuture && previousTime < parseInt(clickTrackings[j].timeStamp)) {
      mainTimer[j] = setTimeout(performAction, parseInt(clickTrackings[j].timeStamp) - elapsedTime, j);
    }
  }
  exitTimer = setTimeout(endSimPrompt, endTime - elapsedTime);
} //end updateSim()

//Provides elapsedTime for any given moment during simulation (in milliseconds) and updates the slider count and display
function updateTime() {
  cur = new Date();
  elapsedTime = cur.getTime() - startTime.getTime() - pauseDuration;
  updateSlider(elapsedTime);
} //end updateTime()

//Toggles the pause/play button during user simulations
function togglePausePlay() {
  if (runningSim) {
    if (document.getElementById('pausePlay').getAttribute('src') == "imgs/pauseButton.png") {
      endSimPrompt();
      document.getElementById('pausePlay').src = "imgs/playButton.png";
      document.getElementById('pausePlay').style.width = '40px';
    } else {
      document.getElementById("simContainer").style.visibility = "hidden";
      document.getElementById("genOverlay").style.visibility = "visible";
      resumeSim();
      document.getElementById('pausePlay').src = "imgs/pauseButton.png";
      document.getElementById('pausePlay').style.width = '20px';
    }
  }
}
/**
 * This function first check the file type, and put them to process according to their file type
 * this function is called by uploadFile() in child frame uploadDownload.html
 *
 * @param files: the files handler
 */
function uploadClicked(files) {
  var reader;

  // check file type here
  if (!checkFileType(files[0].name))
    alert("Incorrect File Type!");
  else {
    reader = new FileReader();
    reader.readAsText(files[0]);
  }

  //. json is file format from pewi2.1
  if (getExtension(files[0].name) == 'json')
    uploadJSON(reader);
  //it's csv
  else if (getExtension(files[0].name) == 'csv')
    uploadCSV(reader);

  // document.getElementById("year0Precip").value = getPrecipOptionsValue(boardData[currentBoard].precipitation[0]);
  // document.getElementById("year1Precip").value = getPrecipOptionsValue(boardData[currentBoard].precipitation[1]);
  // document.getElementById("year2Precip").value = getPrecipOptionsValue(boardData[currentBoard].precipitation[2]);
  // document.getElementById("year3Precip").value = getPrecipOptionsValue(boardData[currentBoard].precipitation[3]);

  for(let i = 0; i < undoArr.length; i++){
    undoArr[i] = [];
  }

  closeUploadDownloadFrame();
  //reset keylistening frame (ie give up focus on iframe)
  //no more conch for us
  document.activeElement.blur();
} //end uploadClicked()

/**
 * Basically create convert to a string of what CSV file saves and let setupBoardFromFile() in mainFE.js to process it
 *
 * @param reader is a FileReader object, here it already read in uploaded file content. onload function can process the content.
 */
function uploadJSON(reader) {
  //This piece of code converts files from pewi2.1 to fileformat of pewi 3.0

  var string = "";

  reader.onload = function(event) {

    // append 31 column names first
    string = string + "ID,Row,Column,Area,BaseLandUseType,CarbonMax,CarbonMin,Cattle,CornYield,DrainageClass,Erosion,FloodFrequency,Group,NitratesPPM,PIndex,Sediment,SoilType,SoybeanYield,StreamNetwork,Subwatershed,Timber,Topography,WatershedNitrogenContribution,StrategicWetland,riverStreams,LandTypeYear1,LandTypeYear2,LandTypeYear3,PrecipYear0,PrecipYear1,PrecipYear2,PrecipYear3," + "\n";
    var obj = JSON.parse(event.target.result);
    var year2Available = false;
    var year3Available = false;

    //there are 828 tiles on the board (hidden+visible)
    for (var i = 0; i < 828; i++) {
      try {
        //This variable 'string' stores the extracted data from the .json file. Won't comment this too much since it's self explainatory
        string = string + obj["1"].id.data[i] + "," + obj["1"].row.data[i] + "," + obj["1"].column.data[i] + "," +
          ((obj["1"].area.data[i] == null) ? 0 : obj["1"].area.data[i]) + "," +
          ((obj["1"].baseLandUseType.data[i] == null) ? 0 : obj["1"].baseLandUseType.data[i]) + "," +
          ((obj["1"].carbonmax.data[i] == null) ? "NA" : obj["1"].carbonmax.data[i]) + "," +
          ((obj["1"].carbonmin.data[i] == null) ? "NA" : obj["1"].carbonmin.data[i]) + "," +
          ((obj["1"].cattle.data[i] == null) ? "NA" : obj["1"].cattle.data[i]) + "," +
          ((obj["1"].cornyield.data[i] == null) ? "NA" : obj["1"].cornyield.data[i]) + "," +
          ((obj["1"].drainageclass.data[i] == null) ? "NA" : obj["1"].drainageclass.data[i]) + "," +
          ((obj["1"].erosion.data[i] == null) ? "NA" : obj["1"].erosion.data[i]) + "," +
          ((obj["1"].floodfrequency.data[i] == null) ? "NA" : obj["1"].floodfrequency.data[i]) + "," +
          ((obj["1"].group.data[i] == null && obj["1"].group.data[i] != 0) ? "NA" : " ") + "," +
          ((obj["1"].nitratespmm.data[i] == null) ? "NA" : obj["1"].nitratespmm.data[i]) + "," +
          ((obj["1"].pindex.data[i] == null) ? "NA" : obj["1"].pindex.data[i]) + "," +
          ((obj["1"].sediment.data[i] == null) ? "NA" : obj["1"].sediment.data[i]) + "," +
          ((obj["1"].soiltype.data[i] == null) ? 0 : obj["1"].soiltype.data[i]) + "," +
          ((obj["1"].soybeanyield.data[i] == null) ? "NA" : obj["1"].soybeanyield.data[i]) + "," +
          ((obj["1"].streamnetwork.data[i] == null) ? "NA" : obj["1"].streamnetwork.data[i]) + "," +
          ((obj["1"].subwatershed.data[i] == null) ? 0 : obj["1"].subwatershed.data[i]) + "," +
          ((obj["1"].timber.data[i] == null) ? "NA" : obj["1"].timber.data[i]) + "," +
          ((obj["1"].topography.data[i] == null) ? 0 : obj["1"].topography.data[i]) + "," +
          ((obj["1"].watershednitrogencontribution.data[i] == null) ? "NA" : obj["1"].watershednitrogencontribution.data[i]) + "," +
          ((obj["1"].wetland.data[i] == null) ? "NA" : obj["1"].wetland.data[i]) + "," +
          ((boardData[currentBoard].map[i].riverStreams == null) ? 0 : boardData[currentBoard].map[i].riverStreams) + "," /*riverStreams is taken from the rever stream of currrent board*/ ;
      } catch (except) {
        //catches for a wrong json file type error
        alert("This file format is not compatible...");
        return;
      } // end try/catch
      // year 1 is default available, append landuse of second year
      string = string + ((obj["1"].baseLandUseType.data[i] == null) ? 1 : obj["1"].baseLandUseType.data[i]) + ",";

      // year 2 is available
      if (obj[2].area) {
        // append landuse of second year
        string = string + ((obj["2"].baseLandUseType.data[i] == null) ? 0 : obj["2"].baseLandUseType.data[i]) + ",";
        // If data for year 2 is included in the file
        // if ((obj["2"].area.data[i] != null)) {
        addingYearFromFile = true;
        year2Available = true;
        // }
      } else {
        string = string + "0,";
      }

      // year 3 is available
      if (obj["3"].area) {
        // append landuse of third year
        string = string + ((obj["3"].baseLandUseType.data[i] == null) ? 0 : obj["3"].baseLandUseType.data[i]) + "," /** landType + landType + landType*/ ;
        // if ((obj["3"].area.data[i] != null)) {
        addingYearFromFile = true;
        year3Available = true;
        // }
      } else {
        string = string + "0,";
      }

      string = string + obj.precipitation[0] + "," + obj.precipitation[1] + "," + obj.precipitation[2] + "," + obj.precipitation[3] + ",";
      if (i < 827)
        string = string + '\n';

    } // end for 828 tiles
    // ===convert finished===

    // set up board
    //initWorkspace("./data.csv"); //to fix the unusual loading of the river
    // setupBoardFromFile(string);
    setupBoardFromUpload(string);
    // loadBoard(boardData[currentBoard], string);

    //If data for years is included, add the year
    if (year2Available) {
      addYearAndTransition();
      boardData[currentBoard].calculatedToYear = 2;
    }
    if (year3Available) {
      addYearAndTransition();
      boardData[currentBoard].calculatedToYear = 3;
    }

    //Clears data so the river isnt redrawn when new files are uploaded
    initData = [];

    //XXX looks like here is dealing with options stuff. Copied from uploadCSV() not sure if this is needed
    // //converting the csv into an array
    // var allTextLines = reader.result.split(/\r\n|\n/);
    // var headers = allTextLines[0].split(',');
    //
    // //load options from the csv
    // //This checks if the file being uploaded has options saved into and if it doesnt, then it just refreshes
    // //the options page and shows the page is refreshed on the screen
    // if (headers.length == 32) {
    //   resetOptionsPage();
    //   toggleVisibility();
    // }
    // //else if the file has options, then it takes the options and places it in the parameter div of the html and reloads it.
    // else {
    //   var xys = headers[32].replace(/~/g, "\n"); // since \n was replaced by '~' replace it back
    //   window.top.document.getElementById('parameters').innerHTML = xys; // load the options string in the inner html of parameters
    //   //make sure the locked land uses aren't seen on the side tool tab or on the map
    //   toggleVisibility();
    // }
    // XXX until here

    //updating the precip levels from the values in the uploaded file
    boardData[currentBoard].precipitation[0] = obj.precipitation[0];
    boardData[currentBoard].precipitation[1] = obj.precipitation[1];
    boardData[currentBoard].precipitation[2] = obj.precipitation[2];
    boardData[currentBoard].precipitation[3] = obj.precipitation[3];

    transitionToYear(1); //transition to year one
    switchYearTab(1);

    // boardData[currentBoard].updateBoard();
    // refreshBoard();
    //clear initData
    initData = [];
  };
} // uploadJSON()

/**
 * Reads a user selected .csv file and loads pewi map from the file.
 * This is called when the 'Upload' button on pewi screen is pressed and a file is selected.
 *
 * This function has been modified to be compatible with pewi-v3 and current development in 2019.
 * There are certain differences in the files of the above two versions -
 * - Current development of 2019 has 3 new columns added at indices 25, 26, 30 of the pewi-v3 csv file.
 * - The pewi-v3 csv has 2 empty columns at the end of its 'header' row, and 1 empty column at the end of all other rows.
 *   The empty cols are removed here to make as little modification as possible to the existing code.
 *
 * @param reader is a FileReader object, here it already read in uploaded file content. onload function can process the content.
 */
function uploadCSV(reader) {
  //initData = [];
  reader.onload = function(e) {
    resetYearDisplay();
    //Code to check if data multiple years are present in the file
    var allText = reader.result;
    //converting the csv into an array
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];
    var data;
    var yearsOwned = 1;
    // Flag that is raised when columns 'contour area', 'buffer area' are not present in the csv file
    var noContBuffArrCol = 0;
    // Flag that is raised when column 'YearsOwned' is not present in the csv file.
    var noYearsOwnedCol = 0;

    /* If columns are missing, insert their headers here. Skip this step if csv file already contains them.
      This is for compatibility with older pewi versions.
    */
    if (headers.indexOf("ContourArea") == -1) {
      headers.splice(25, 0, "ContourArea", "BufferArea");
      noContBuffArrCol = 1;

      // If column header YearsOwned is missing, add here. This happens with files downloaded from pewi-v3
      if (headers.indexOf("YearsOwned") == -1) {
        headers.splice(30, 0, "YearsOwned");
        noYearsOwnedCol = 1;

        // pewi-v3 files have two empty cols at the end of header, removing them here.
        headers.splice(35,2);
      }
    }

    for (var i = 1; i < allTextLines.length; i++) {
      // If download the file by openWith option, and then upload the file into PEWI, you can noticed that there is one additional line, and errors occur
      // because of this addition line. Since we know that there should be 829 lines in total, thus we deal with only the first 829 lines.
      if(i > 828) continue;

      // Array of all elements contained in row i  of the csv
      data = allTextLines[i].split(',');

      // Value of contour area for this row
      var topo = data[21];
      var contArr;
      if (topo == 2) {
        contArr = 0.0546;
      }
      else if (topo == 3) {
        contArr = 0.0658;
      }
      else if (topo == 4) {
        contArr = 0.082;
      }
      else if (topo == 5) {
        contArr = 0.0938;
      }
      else {
        contArr = 0;
      }

      // Value of buffer area for this row
      var streamNetwork = data[18];
      var buffArr;
      if (streamNetwork == 0) {
        buffArr = 0;
      }
      else if (streamNetwork == 1) {
        buffArr = 0.525;
      }
      else {
        buffArr = "NA";
      }

      /** If values of columns 'contour area', 'buffer area' are not present in this row, then add them.
        * If 'Years owned' column is absent, add it here.
         Skip this step if csv file already contains the columns.
      **/
      if (noContBuffArrCol == 1) {
        data.splice(25, 0, contArr, buffArr);

        if (noYearsOwnedCol == 1) {
          data.splice(30, 0, 3);

          // pewi-v3 files have one empty col at the end of each row (excluding header row), removing it here.
          data.splice(35,1);
        }
      }

      var headlength = headers.length;
      if (data.length == headlength) {
        var tarr = [];
        for (var j = 0; j < headers.length; j++) {
          tarr.push(data[j]);

          if (j == 30) {
            yearsOwned = data[j];
          }
        }
        lines.push(tarr);
      } // end if
    } // end for

    if (yearsOwned == 2) {
      addingYearFromFile = true;
      addYearAndTransition();
      boardData[currentBoard].calculatedToYear = 2;
      addingYearFromFile = false;
    }

    if (yearsOwned == 3) {
      addingYearFromFile = true;
      addYearAndTransition();
      addYearAndTransition();
      boardData[currentBoard].calculatedToYear = 3;
      addingYearFromFile = false;
    }

    initData = lines;
    setupBoardFromUpload(lines);

    //Clears data so the river isnt redrawn when new files are uploaded
    initData = [];

    //updating the precip levels from the values in the uploaded file
    boardData[currentBoard].precipitation[0] = data[31];
    boardData[currentBoard].precipitation[1] = data[32];
    boardData[currentBoard].precipitation[2] = data[33];
    boardData[currentBoard].precipitation[3] = data[34];

    boardData[currentBoard].precipitationIndex[0] = getPrecipOptionsValue(data[31]);
    boardData[currentBoard].precipitationIndex[1] = getPrecipOptionsValue(data[32]);
    boardData[currentBoard].precipitationIndex[2] = getPrecipOptionsValue(data[33]);
    boardData[currentBoard].precipitationIndex[3] = getPrecipOptionsValue(data[34]);

    //load options from the csv
    //This checks if the file being uploaded has options saved into and if it doesnt, then it just refreshes
    //the options page and shows the page is refreshed on the screen
    // CHANGE COLUMN HEADER LENGTH HERE - If adding new columns
    if (headers.length == 35) {
      resetOptionsPage();
      toggleVisibility();
    }
    //else if the file has options, then it takes the options and places it in the parameter div of the html and reloads it.
    else {
      var xys = data[35].replace(/~/g, "\n"); // since \n was replaced by '~' replace it back
      window.top.document.getElementById('parameters').innerHTML = xys; // load the options string in the inner html of parameters
      //make sure the locked land uses aren't seen on the side tool tab or on the map
      saveAndRandomize(); //This makes sure that the land use selected is one that isn't disabled.
      toggleVisibility();
    }

    transitionToYear(1); //transition to year one
    switchYearTab(1);
    //  boardData[currentBoard].updateBoard();
    //calculateResults();
    //generateResultsTable();
    // fresh progress bars
    calculateResults();
    refreshProgressBar(currentYear);
    //clear initData
    initData = [];
  }; //end onload
} // uploadCSV()

//writeFileToDownloadString creates a string in csv format that describes the current board
function writeFileToDownloadString(mapPlayerNumber) {
  //IF mapPlayerNumber is 0, then the map is written out as is.
  //  this is the desired use in all cases apart from the multiplayer mode
  //Otherwise, if a player number is specified, the map of that player is distinguished
  //  when the year 1 land use is equal to that player's number

  var string = "";
  if (typeof boardData[currentBoard] !== 'undefined') {
    //To save options in the file, changing the options string so that it doesn't have \n because csv file will read it differntly
    var tempOptions = document.getElementById('parameters').innerHTML.replace(/\n/g, "~"); //replaceing the \n in options string to be '~'
    optionsString = tempOptions;
    string = "ID,Row,Column,Area,BaseLandUseType,CarbonMax,CarbonMin,Cattle,CornYield,DrainageClass,Erosion,FloodFrequency,Group,NitratesPPM,PIndex,Sediment,SoilType,SoybeanYield,StreamNetwork,Subwatershed,Timber,Topography,WatershedNitrogenContribution,StrategicWetland,riverStreams,ContourArea,BufferArea,LandTypeYear1,LandTypeYear2,LandTypeYear3,YearsOwned,PrecipYear0,PrecipYear1,PrecipYear2,PrecipYear3"; //+window.top.document.getElementById('parameters').innerHTML/*This one is to store options*/;
    if (optionsString !== "") {
      string += ",OptionsSelected";
    }
    string += "\r\n";

    for (var i = 0; i < boardData[currentBoard].map.length; i++) {
      if (boardData[currentBoard].map[i].landType[1] != mapPlayerNumber && multiplayerAssigningModeOn) {
        string = string + boardData[currentBoard].map[i].id + "," +
          boardData[currentBoard].map[i].row + "," +
          boardData[currentBoard].map[i].column + "," +
          "0" + ",";
      } else {
        string = string + boardData[currentBoard].map[i].id + "," +
          boardData[currentBoard].map[i].row + "," +
          boardData[currentBoard].map[i].column + "," +
          boardData[currentBoard].map[i].area + ",";
      }

      if (mapPlayerNumber > 0) {
        if (boardData[currentBoard].map[i].landType[0] == 0) string += "0,";
        else string += ((boardData[currentBoard].map[i].landType[1] == mapPlayerNumber) ? boardData[currentBoard].map[i].baseLandUseType + "," : "-1,");
      } else {
        string += boardData[currentBoard].map[i].baseLandUseType + ",";
      }

      //If the tile really shouldn't be there (-1 for BaseLandUseType)...
      // If the user made a multipler map, and a tile still has values when it's not that player's tile
      if (boardData[currentBoard].map[i].landType[1] != mapPlayerNumber && multiplayerAssigningModeOn) {
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
          boardData[currentBoard].map[i].riverStreams + ",";
      }

      // Filling the Contour Area column
      var topo = boardData[currentBoard].map[i].topography;
      if (topo == 2) {
        string += 0.0546 + ",";
      }
      else if (topo == 3) {
        string += 0.0658 + ",";
      }
      else if (topo == 4) {
        string += 0.082 + ",";
      }
      else if (topo == 5) {
        string += 0.0938 + ",";
      }
      else {
        string += 0 + ",";
      }

      // Filling the Buffer Area column
      if (boardData[currentBoard].map[i].streamNetwork == 0) {
        string += 0 + ",";
      }
      else if (boardData[currentBoard].map[i].streamNetwork == 1) {
        string += 0.525 + ",";
      }
      else {
        string += "NA" + ",";
      }


      if (mapPlayerNumber > 0) {
        string += ((boardData[currentBoard].map[i].landType[1] == mapPlayerNumber) ? "1," : "0,") + //year1
          ((boardData[currentBoard].map[i].landType[1] == mapPlayerNumber) ? "1," : "0,") + //year2
          ((boardData[currentBoard].map[i].landType[1] == mapPlayerNumber) ? "1," : "0,"); //year3
      } else {
        string += boardData[currentBoard].map[i].landType[1] + "," +
          boardData[currentBoard].map[i].landType[2] + "," +
          boardData[currentBoard].map[i].landType[3] + ",";
      }
      string += boardData[currentBoard].calculatedToYear + ",";
      string += boardData[currentBoard].precipitation[0] + "," +
        boardData[currentBoard].precipitation[1] + "," +
        boardData[currentBoard].precipitation[2] + "," +
        boardData[currentBoard].precipitation[3];
      if (optionsString !== "") {
        string = string + "," + optionsString; //optionsString added here if not empty
      }
      if (i < boardData[currentBoard].map.length - 1) {
        string = string + '\r\n';
      }

    } //end for
    // finish processing, set boardData as undefined ****** commented for now to avoid error after the file is downloaded
    // cleanCurrentBoardData();
  } // end if

  return string;
} //end writeFileToDownloadString

//helper for deleteYearAndTransition.
//This method deletes year 2 and makes year 3 as year 2 and then sets year 3 as default.
function year2and3Delete() {
  g_isDeleted = true;
  year2to3 = true;
  //when year 2 is deleted, we transition to 3 so that year 3 = year 2 and highlight the year 2.
  boardData[currentBoard].precipitation[2] = boardData[currentBoard].precipitation[3];
  document.getElementById("year2Precip").value = reversePrecipValue(boardData[currentBoard].precipitation[3]);
  transitionToYear(3);
  switchYearTab(2);
  boardData[currentBoard].calculatedToYear = 2;
  yearSelected = 2;
  currMaxYear = 2;
  var snackBar = document.getElementById("snackbarNotification");
  snackBar.innerHTML = "Year 3 is now Year 2!";
  snackBar.className = "show";
  setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 3000);
}


function yearCopyPasteInit()
{
  document.getElementById("yearToCopy").value = 0;
  document.getElementById("yearToPaste").value = 0;

  for(var i=1; i <=3; i++)
  {
    document.getElementById("yearToCopy").options[i].style.display = 'none';
    document.getElementById("yearPasteButton").style.display = 'none';
    document.getElementById("yearToPaste").options[i].style.display = 'none';
  }
  for(var i=1; i <=boardData[currentBoard].calculatedToYear; i++)
  {
    if(boardData[currentBoard].calculatedToYear == 1)
    {
      break;
    }
    else
    {
    document.getElementById("yearToCopy").options[i].style.display = 'block';
    document.getElementById("yearToPaste").options[i].style.display = 'block';
    }
  }//end for

}//end yearCopyPasteInit

//update sthe precipitation boxes in the precip tab - called from switchConsoleTab
function yearPrecipManager()
{
  //making sure that only year 0 and 1 are always shown and year 2 and 3 are not unless the user enables them
  document.getElementById('year2PrecipContainer').style.display = "none";
  document.getElementById('year3PrecipContainer').style.display = "none";
  for(var i=2; i<=boardData[currentBoard].calculatedToYear; i++)
  {
    document.getElementById('year' + i + 'PrecipContainer').style.display = "block";
  }
}



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

//Function that closes the contact_us dialog when escape key is pressed
function emailEsc(e) {
  if (e.keyCode == 27) {
    closeEmailFrame();
  }
}

//Function that closes the Download dialog when the escape key is pressed
function downuploadEsc(e) {
  if (e.keyCode == 27) {
    closeUploadDownloadFrame();
  }
}

//Function that closes the download index dialog when escape key is pressed
function glossaryEsc(e) {
  if (e.keyCode == 27) {
    toggleGlossary();
  }
}



// Execute when Esc key is pressed while on the options page
function optionsEsc(e) {
  if (e.keyCode == 27) {
    // turn off options page without options change
    resetOptions();
  }
} // end optionsEsc

// Execute when Esc key is pressed while on the printOptions page
function printOptionsEsc(e) {
  if (e.keyCode == 27) {
    // turn off printOptions page
    closePrintOptions();
  }
} // end printOptionsEsc

//Calculate Game Wildlife score for an individual tile
function getTileGameWildlifeScore(tileId){
  var score = 0;
  var currLandType = boardData[currentBoard].map[tileId].landType[yearSelected];
  var stratWet = boardData[currentBoard].map[tileId].strategicWetland;
  var streamBuff = boardData[currentBoard].map[tileId].streamNetwork;
  var multiplier = boardData[currentBoard].map[tileId].area / 10;

  //If land use is Conservational Forest, Conventional Forest, Mixed Fruits and Vegetables, Prarie, Rotational Grazing or Wetland, add 4 points
  if(currLandType == 10 || currLandType == 11 || currLandType == 15 || currLandType == 9 || currLandType == 7 || currLandType == 14){
    score+=4;
  }
  //If land use is Conservational Forest, Conventional Forest, Mixed Fruits and Vegetables, Prarie, Rotational Grazing, Wetland, Conservational Soybean,
  //Conservational Corn, Grass Hay, Short Rotation Woody Bio Engergy, or Switchgrass, add 1.5 points
  if(currLandType == 10 || currLandType == 11 || currLandType == 15 || currLandType == 9 || currLandType == 7 || currLandType == 14 || currLandType == 4 || currLandType == 2 || currLandType == 8 || currLandType == 13 || currLandType == 12){
    score+=1.5;
  }
  //If land use is Conservational Forest add 1 point
  if(currLandType == 10){
    score+=1;
  }
  //If land use is Prarie, Rotational Grazing, or Switchgrass, add 1 point
  if(currLandType == 9 || currLandType == 7 || currLandType == 12){
    score+=1;
  }
  //If land use is Wetlands add 1 point
  if(currLandType == 14){
    score+=1;
  }
  //If land is stream buffer and land use is Conservational Forest, Conventional Forest, Mixed Fruits and Vegetables, Prarie, Rotational Grazing, Wetland, Conservational Soybean,
  //Conservational Corn, Grass Hay, Short Rotation Woody Bio Engergy, or Switchgrass, add 1.5 points
  if(streamBuff==1){
    if(currLandType == 10 || currLandType == 11 || currLandType == 15 || currLandType == 9 || currLandType == 7 || currLandType == 14 || currLandType == 4 || currLandType == 2 || currLandType == 8 || currLandType == 13 || currLandType == 12){
      score+=1.5;
    }
  }

  //Multiply score by area divided by 10
  score*=multiplier;

  return score;
}




//Calculate Biodiversity score for an individual tile
function getTileBiodiversityScore(tileId){
  var score = 0;
  var currLandType = boardData[currentBoard].map[tileId].landType[yearSelected];
  var stratWet = boardData[currentBoard].map[tileId].strategicWetland;
  var streamBuff = boardData[currentBoard].map[tileId].streamNetwork;
  var multiplier = boardData[currentBoard].map[tileId].area / 10;

  //If land use is Conservational Forest, Prarie, or Wetland, add 4 points
  if(currLandType == 10  || currLandType == 9 || currLandType == 14){
    score+=4;
  }
  //If land use is Conservational Forest, Conventional Forest, Mixed Fruits and Vegetables, Prarie, Rotational Grazing, or Wetland
  if(currLandType == 10 || currLandType == 11 || currLandType == 15 || currLandType == 9 || currLandType == 7 || currLandType == 14){
    score+=1.5;
  }
  //If land use is Conservational Forest, Conventional Forest, Mixed Fruits and Vegetables, Prarie, Rotational Grazing, Wetland, Conservational Soybean,
  //Conservational Corn, Grass Hay, Short Rotation Woody Bio Engergy, or Switchgrass, add 1.5 points
  if(currLandType == 10 || currLandType == 11 || currLandType == 15 || currLandType == 9 || currLandType == 7 || currLandType == 14 || currLandType == 4 || currLandType == 2 || currLandType == 8 || currLandType == 13 || currLandType == 12){
    score+=1.5;
  }
  //If land use is Wetland add 1.5 points
  if(currLandType == 14){
    score+=0.5;
    if(stratWet == 1){
      score+=1;
    }
  }
  //If land is stream buffer and land use is Conservational Forest, Conventional Forest, Mixed Fruits and Vegetables, Prarie, Rotational Grazing, Wetland, Conservational Soybean,
  //Conservational Corn, Grass Hay, Short Rotation Woody Bio Engergy, or Switchgrass, add 1.5 points
  if(streamBuff==1){
    if(currLandType == 10 || currLandType == 11 || currLandType == 15 || currLandType == 9 || currLandType == 7 || currLandType == 14 || currLandType == 4 || currLandType == 2 || currLandType == 8 || currLandType == 13 || currLandType == 12){
      score+=1.5;
    }
  }

  //Multiply score by area divided by 10
  score*=multiplier;

  return score;
}

//This function is used to display hover information for the Game Wildlife overlay
function getTileGameWildlifeInfoText(score){
  if(score == 0) return "Very Low Impact";
  if(score > 0 && score <= 2.1) return "Low Impact";
  else if (score>2.1 && score<=4.1) return "Moderate Impact";
  else if (score>4 && score<=6.1) return "High Impact";
  else if (score>6.1) return "Very High Impact";
}

//This function is used to display hover information for the Biodiversity overlay
function getTileBiodiversityInfoText(score){
  if(score == 0) return "Very Low Impact";
  else if (score> 0 && score<=2.5) return "Low Impact";
  else if (score>2.5 && score<=5) return "Moderate Impact";
  else if (score> 5 && score<=7.5) return "High Impact";
  else if (score>7.5) return "Very High Impact"
}

function getTileNitrateInfoText(score){
if(score>=0 && score<510) return "Very Low Impact";
else if(score>=510 && score<1020) return "Low Impact";
else if(score>=1020 && score<1530) return "Moderate Impact";
else if(score>=1530 && score<2040) return "High Impact";
else if(score>2040) return "Very High Impact";
}

function getTilePrecipitationMultiplier(year){

  if (boardData[currentBoard].precipitation[year] == 24.58 || boardData[currentBoard].precipitation[year] == 28.18) // If it's a dry year
  {
    return 0.86;
  } else if (boardData[currentBoard].precipitation[year] == 30.39 || boardData[currentBoard].precipitation[year] == 32.16 || boardData[currentBoard].precipitation[year] == 34.34) { // If it's a normal year
    if (boardData[currentBoard].precipitation[year - 1] == 24.58 || boardData[currentBoard].precipitation[year - 1] == 28.18) {
      return 1.69;
    } else {
      return 1;
    }
  } else { // If it's a flood year
    if (boardData[currentBoard].precipitation[year - 1] == 24.58 || boardData[currentBoard].precipitation[year - 1] == 28.18) {
      return 2.11;
    } else {
      return 1;
    }
  }
}




















//This function is called in the getHighlightColor function for the subwatershed Nitrate layout
//The function takes in the tileId and color necessary for the current cell
//and determines which side of the cell should be bolded to show distinctions between
//the subwatershed boundaries
function getBoldedCells(tileId, color){
  var row = boardData[currentBoard].map[tileId].row;
  var col = boardData[currentBoard].map[tileId].column;

  var subwatershedcurr = boardData[currentBoard].map[tileId].subwatershed;  //The current subwatershed reference number
  var subwatershedleft;
  var subwatershedright;
  var subwatershedtop;
  var subwatershedbottom;
  var didtop = false;
  var didbottom = false;
  var didleft = false;
  var didright = false;

//The next 4 if statements check if the cell is on an edge of the map,
//if so, set its empty neighbor subwatershed type to 0
  if(row==1){
    subwatershedtop = 0;
    didtop = true;
  }
  if(row==36){
    subwatershedbottom = 0;
    didbottom = true;
  }
  if(col==1){
    subwatershedleft = 0;
    didleft = true;
  }
  if(col==23){
    subwatershedright = 0;
    didright = true;
  }


  //The next 4 if statements are used if a tile is not on the edge of the map
  if(!didtop){
    subwatershedtop = boardData[currentBoard].map[tileId-23].subwatershed;
  }
  if(!didbottom){
    subwatershedbottom = boardData[currentBoard].map[tileId+23].subwatershed;
  }
  if(!didleft){
    subwatershedleft = boardData[currentBoard].map[tileId-1].subwatershed;
  }
  if(!didright){
  subwatershedright = boardData[currentBoard].map[tileId+1].subwatershed;
  }



  //The following if statements contain the bulk of the functionality. They check if another subwatershed is found in any
  //direction from the current tile and determine where to bold the current tile
  //The function returns a call to the getColorForBoldedCells function, which determines which image file to be used

  //Needs bolded on right
  if(subwatershedcurr!=subwatershedright && subwatershedcurr==subwatershedleft && subwatershedcurr==subwatershedtop && subwatershedcurr==subwatershedbottom){
      return getColorForBoldedCells('right', color);
  }
  //Needs bolded on left
  else if(subwatershedcurr!=subwatershedleft && subwatershedcurr==subwatershedright && subwatershedcurr==subwatershedtop && subwatershedcurr==subwatershedbottom){
      return getColorForBoldedCells('left', color);
  }
  //Needs bolded on bottom
  else if(subwatershedcurr!=subwatershedbottom && subwatershedcurr==subwatershedright && subwatershedcurr==subwatershedtop && subwatershedcurr==subwatershedleft){
      return getColorForBoldedCells('bottom', color);
  }
  //Needs bolded on top
  else if(subwatershedcurr!=subwatershedtop && subwatershedcurr==subwatershedright && subwatershedcurr==subwatershedbottom && subwatershedcurr==subwatershedleft){
      return getColorForBoldedCells('top', color);
  }
  //Needs bolded on top and right
  else if(subwatershedcurr==subwatershedleft && subwatershedcurr==subwatershedbottom && subwatershedcurr!=subwatershedtop && subwatershedcurr!=subwatershedright){
    return getColorForBoldedCells('topright', color);
  }
  //Needs bolded on top and left
  else if(subwatershedcurr==subwatershedright && subwatershedcurr==subwatershedbottom && subwatershedcurr!=subwatershedtop && subwatershedcurr!=subwatershedleft){
    return getColorForBoldedCells('topleft', color);
  }
  //Needs bolded on bottom and right
  else if(subwatershedcurr==subwatershedleft && subwatershedcurr==subwatershedtop && subwatershedcurr !=subwatershedbottom && subwatershedcurr!=subwatershedright){
    return getColorForBoldedCells('bottomright', color);
  }
  //Needs bolded on bottom and left
  else if(subwatershedcurr==subwatershedright && subwatershedcurr==subwatershedtop && subwatershedcurr!=subwatershedbottom && subwatershedcurr!=subwatershedleft){
    return getColorForBoldedCells('bottomleft', color);
  }
  //Needs bolded on top and left and right
  else if(subwatershedcurr==subwatershedbottom && subwatershedcurr!=subwatershedleft && subwatershedcurr!=subwatershedright && subwatershedcurr!=subwatershedtop){
    return getColorForBoldedCells('topleftright', color);
  }
  //Needs bolded on bottom and left and right
  else if(subwatershedcurr==subwatershedtop && subwatershedcurr!=subwatershedleft && subwatershedcurr!=subwatershedright && subwatershedcurr!=subwatershedbottom){
    return getColorForBoldedCells('bottomleftright', color);
  }
  //Needs bolded on top and right and bottom
  else if(subwatershedcurr==subwatershedleft && subwatershedcurr!=subwatershedright && subwatershedcurr!=subwatershedtop && subwatershedcurr!=subwatershedbottom){
    return getColorForBoldedCells('toprightbottom', color);
  }
  //Needs bolded on top and left and bottom
  else if(subwatershedcurr==subwatershedright && subwatershedcurr!=subwatershedleft && subwatershedcurr!=subwatershedtop && subwatershedcurr!=subwatershedbottom){
    return getColorForBoldedCells('topleftbottom', color);
  }
  //Needs bolded on left and right
  else if(subwatershedcurr==subwatershedtop && subwatershedcurr==subwatershedbottom && subwatershedcurr!=subwatershedright && subwatershedcurr!=subwatershedleft){
    return getColorForBoldedCells('leftright', color);
  }
  //Does not need to be bolded
  else return color;
}

//This function is used in the getBoldedCells function to return the correct color and correct bolded cell
//for displaying on the map
function getColorForBoldedCells(direction, color){

  //Any cell can be bolded in 1 of 13 ways depending on its location relative to the other subwatersheds
  switch(color){
    case 125:
      if(direction=='right') return 63;
      else if(direction=='top') return 60;
      else if(direction=='left') return 61;
      else if(direction=='bottom') return 62;
      else if(direction=='topright') return 64;
      else if(direction=='topleft') return 65;
      else if(direction=='bottomleft') return 67;
      else if(direction=='bottomright') return 66;
      else if(direction=='bottomleftright') return 68;
      else if(direction=='topleftright') return 69;
      else if(direction=='topleftbottom') return 71;
      else if(direction=='toprightbottom') return 70;
      else if(direction=='leftright') return 72;
      break;

    case 126:
      if(direction=='right') return 76;
      else if(direction=='top') return 73;
      else if(direction=='left') return 74;
      else if(direction=='bottom') return 75;
      else if(direction=='topright') return 77;
      else if(direction=='topleft') return 78;
      else if(direction=='bottomleft') return 80;
      else if(direction=='bottomright') return 79;
      else if(direction=='bottomleftright') return 81;
      else if(direction=='topleftright') return 82;
      else if(direction=='topleftbottom') return 84;
      else if(direction=='toprightbottom') return 83;
      else if(direction=='leftright') return 85;
      break;


    case 127:
      if(direction=='right') return 89;
      else if(direction=='top') return 86;
      else if(direction=='left') return 87;
      else if(direction=='bottom') return 88;
      else if(direction=='topright') return 90;
      else if(direction=='topleft') return 91;
      else if(direction=='bottomleft') return 93;
      else if(direction=='bottomright') return 92;
      else if(direction=='bottomleftright') return 94;
      else if(direction=='topleftright') return 95;
      else if(direction=='topleftbottom') return 97;
      else if(direction=='toprightbottom') return 96;
      else if(direction=='leftright') return 98;
      break;

    case 128:
      if(direction=='right') return 102;
      else if(direction=='top') return 99;
      else if(direction=='left') return 100;
      else if(direction=='bottom') return 101;
      else if(direction=='topright') return 103;
      else if(direction=='topleft') return 104;
      else if(direction=='bottomleft') return 106;
      else if(direction=='bottomright') return 105;
      else if(direction=='bottomleftright') return 107;
      else if(direction=='topleftright') return 108;
      else if(direction=='topleftbottom') return 110;
      else if(direction=='toprightbottom') return 109;
      else if(direction=='leftright') return 111;
      break;

    case 129:
      if(direction=='right') return 115;
      else if(direction=='top') return 112;
      else if(direction=='left') return 113;
      else if(direction=='bottom') return 114;
      else if(direction=='topright') return 116;
      else if(direction=='topleft') return 117;
      else if(direction=='bottomleft') return 119;
      else if(direction=='bottomright') return 118;
      else if(direction=='bottomleftright') return 120;
      else if(direction=='topleftright') return 121;
      else if(direction=='topleftbottom') return 123;
      else if(direction=='toprightbottom') return 122;
      else if(direction=='leftright') return 124;
      break;



    case 210:
      if(direction=='right') return 148;
      else if(direction=='top') return 145;
      else if(direction=='left') return 146;
      else if(direction=='bottom') return 147;
      else if(direction=='topright') return 149;
      else if(direction=='topleft') return 150;
      else if(direction=='bottomleft') return 152;
      else if(direction=='bottomright') return 151;
      else if(direction=='bottomleftright') return 153;
      else if(direction=='topleftright') return 154;
      else if(direction=='topleftbottom') return 156;
      else if(direction=='toprightbottom') return 155;
      else if(direction=='leftright') return 157;
      break;



    case 211:
      if(direction=='right') return 161;
      else if(direction=='top') return 158;
      else if(direction=='left') return 159;
      else if(direction=='bottom') return 160;
      else if(direction=='topright') return 162;
      else if(direction=='topleft') return 163;
      else if(direction=='bottomleft') return 165;
      else if(direction=='bottomright') return 164;
      else if(direction=='bottomleftright') return 166;
      else if(direction=='topleftright') return 167;
      else if(direction=='topleftbottom') return 169;
      else if(direction=='toprightbottom') return 168;
      else if(direction=='leftright') return 170;
      break;



    case 212:
      if(direction=='right') return 174;
      else if(direction=='top') return 171;
      else if(direction=='left') return 172;
      else if(direction=='bottom') return 173;
      else if(direction=='topright') return 175;
      else if(direction=='topleft') return 176;
      else if(direction=='bottomleft') return 178;
      else if(direction=='bottomright') return 177;
      else if(direction=='bottomleftright') return 179;
      else if(direction=='topleftright') return 180;
      else if(direction=='topleftbottom') return 182;
      else if(direction=='toprightbottom') return 181;
      else if(direction=='leftright') return 183;
      break;



    case 213:
      if(direction=='right') return 187;
      else if(direction=='top') return 184;
      else if(direction=='left') return 185;
      else if(direction=='bottom') return 186;
      else if(direction=='topright') return 188;
      else if(direction=='topleft') return 189;
      else if(direction=='bottomleft') return 191;
      else if(direction=='bottomright') return 190;
      else if(direction=='bottomleftright') return 192;
      else if(direction=='topleftright') return 193;
      else if(direction=='topleftbottom') return 195;
      else if(direction=='toprightbottom') return 194;
      else if(direction=='leftright') return 196;
      break;



    case 214:
      if(direction=='right') return 200;
      else if(direction=='top') return 197;
      else if(direction=='left') return 198;
      else if(direction=='bottom') return 199;
      else if(direction=='topright') return 201;
      else if(direction=='topleft') return 202;
      else if(direction=='bottomleft') return 204;
      else if(direction=='bottomright') return 203;
      else if(direction=='bottomleftright') return 205;
      else if(direction=='topleftright') return 206;
      else if(direction=='topleftbottom') return 208;
      else if(direction=='toprightbottom') return 207;
      else if(direction=='leftright') return 209;
      break;

    }



  }






















/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
//Added code directly in this js file as importing a js file to another js file isn't easily doable//
var saveAs = saveAs || function(e) {
  "use strict";
  if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return
  }
  var t = e.document,
    n = function() {
      return e.URL || e.webkitURL || e
    },
    r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
    o = "download" in r,
    i = function(e) {
      var t = new MouseEvent("click");
      e.dispatchEvent(t)
    },
    a = /constructor/i.test(e.HTMLElement),
    f = /CriOS\/[\d]+/.test(navigator.userAgent),
    u = function(t) {
      (e.setImmediate || e.setTimeout)(function() {
        throw t
      }, 0)
    },
    d = "application/octet-stream",
    s = 1e3 * 40,
    c = function(e) {
      var t = function() {
        if (typeof e === "string") {
          n().revokeObjectURL(e)
        } else {
          e.remove()
        }
      };
      setTimeout(t, s)
    },
    l = function(e, t, n) {
      t = [].concat(t);
      var r = t.length;
      while (r--) {
        var o = e["on" + t[r]];
        if (typeof o === "function") {
          try {
            o.call(e, n || e)
          } catch (i) {
            u(i)
          }
        }
      }
    },
    p = function(e) {
      if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) {
        return new Blob([String.fromCharCode(65279), e], {
          type: e.type
        })
      }
      return e
    },
    v = function(t, u, s) {
      if (!s) {
        t = p(t)
      }
      var v = this,
        w = t.type,
        m = w === d,
        y, h = function() {
          l(v, "writestart progress write writeend".split(" "))
        },
        S = function() {
          if ((f || m && a) && e.FileReader) {
            var r = new FileReader;
            r.onloadend = function() {
              var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;");
              var n = e.open(t, "_blank");
              if (!n) e.location.href = t;
              t = undefined;
              v.readyState = v.DONE;
              h()
            };
            r.readAsDataURL(t);
            v.readyState = v.INIT;
            return
          }
          if (!y) {
            y = n().createObjectURL(t)
          }
          if (m) {
            e.location.href = y
          } else {
            var o = e.open(y, "_blank");
            if (!o) {
              e.location.href = y
            }
          }
          v.readyState = v.DONE;
          h();
          c(y)
        };
      v.readyState = v.INIT;
      if (o) {
        y = n().createObjectURL(t);
        setTimeout(function() {
          r.href = y;
          r.download = u;
          i(r);
          h();
          c(y);
          v.readyState = v.DONE
        });
        return
      }
      S()
    },
    w = v.prototype,
    m = function(e, t, n) {
      return new v(e, t || e.name || "download", n)
    };
  if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
    return function(e, t, n) {
      t = t || e.name || "download";
      if (!n) {
        e = p(e)
      }
      return navigator.msSaveOrOpenBlob(e, t)
    }
  }
  w.abort = function() {};
  w.readyState = w.INIT = 0;
  w.WRITING = 1;
  w.DONE = 2;
  w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null;
  return m
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content);
if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs
} else if (typeof define !== "undefined" && define !== null && define.amd !== null) {
  define([], function() {
    return saveAs
  })
}


/**
 * Use two methods to add event listener, help with browser compatibility
 *
 * @param element html DOM which listens to the event
 * @param evName built-in event name, the event that is listening to
 * @param fn callback function, will be triggered if the event is fired
 */
// function addEvent(element, evName, fn) {
//   if (evName == 'resize') {
//     console.log(element+" has added "+ evName+ " listener");
//   }
//   if (element.addEventListener) {
//     element.addEventListener(evName, fn, false);
//   } else if (element.attachEvent) {
//     // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/attachEvent
//     element.attachEvent('on'+evName, function(e) {
//         fn(e || window.event);
//     });
//     console.log("attachEvent");
//   }
// }

/**
 * Use two methods to remove event listener, help with browser compatibility
 *
 * @param element html DOM which listens to the event
 * @param evName built-in event name, the event that is listening to
 * @param fn callback function, will be triggered if the event is fired
 */
// function removeEvent(element, evName, fn) {
//   // console.log(element+" has removed "+ evName+ " listener");
//   if (element.removeEventListener) {
//     element.removeEventListener(evName, fn, false);
//   } else if (element.detachEvent) {
//   // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/detachEvent
//     element.detachEvent('on'+evName, function(e) {
//         fn(e || window.event);
//     });
//     console.log("detachEvent");
//   }
// }

//
//

// function getBoardAndMapData(){
//   return boardData[currentYear].map;
// }



  /**
  This function looks through the undoArr for the given year, and deletes everything after the first land type not allowed is found.
  @param undoArray the undoArr
  @param theYear the year that is being modified
  **/

  function removeAfterFirstNotAllowed(undoArray, theYear)
  {
    notAllowedArray = getLandUseNotAllowed();

    if(notAllowedArray.length == 0) // if all tiles are allowed then end here
      return;

    for(var i = undoArray[theYear].length - 1; i >= 0; i--)
    {

      if (Array.isArray(undoArray[theYear][i][1])) //check to see if we are undoing a grid paint, so we need to search the whole thing in case there are types not allowed underneath
      {
        for(var j = 0; j < undoArray[theYear][i][1].length; j++)
        {
          if (notAllowedArray.includes(undoArray[theYear][i][1][j]))
          {
            undoArray[theYear] = undoArray[theYear].slice(i + 1);
            return; //used return so it will break out of both loops
          }
        }
      }


      else if (notAllowedArray.includes(undoArray[theYear][i][1])) // takes care of being covered by a cell paint tile
      {
        undoArray[theYear] = undoArray[theYear].slice(i + 1);
        break;
      }
    }
  }

  /**
  This function returns an array of land use types that are currently toggled of. This is used in the removeAfterFirstNotAllowed function right above.
  **/
  function getLandUseNotAllowed()
  {
    var toReturn = [];

    for(var i = 1; i <= 15; i++)
    {
      if(document.getElementById('parameters').innerHTML.indexOf('paint' + i + "\n") != -1)
      {
        toReturn.push(i);
      }
    }

    return toReturn;
  }

/**
This method gets the land use type that is currently selected by the user, this is used to fill
the map with the current selection if tiles on the map are toggled off.
**/
  function getCurrentLandType()
  {
    var currentType = LandUseType.getNumericalType(printLandUseType(painter)); // set equal to the current land type that is selected, numerical value
    return currentType;
  }


/**
This function is used to set the new default land use type. It sets to the current selected, but if it cant do that it starts at 1 and moveds up until it
finds a usable type
**/
  function getNewLandType()
  {
    var toReturn = getCurrentLandType();
    var notAllowed = getLandUseNotAllowed();
    var randomPainterTile = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];

    // if the current selection is toggled off, or wetland because it would set the whole map to wetland
    if(notAllowed.includes(toReturn)|| toReturn == 14)
    {
      // loop through to find the first one that is toggled on
      for (var r = 1; r <= 15; r++)
      {
        if (!(notAllowed.includes(r)))
        {
          toReturn = r;
          break;
        }
      }

    }
    return toReturn;
  }


/**
 *This function returns a copy of the tile IDs and their land types for use in the undo funcion. It is used to make a copy of the year before it gets pasted over.
 *That copy is then pushed to that years undo array so that it can be undone after the pasted has been undone.
 * @param  {[type]} year [The year to copy]
 * @return {[type]}      [An array with an array of IDs and an array of land types to push into the undoArr]
 */
  function getMap(year)
  {
    var tileIDs = [];
    var landTypes = [];

    // loop through the map and get each tiles ID and landtype
    for (var i = 0; i < boardData[currentBoard].map.length; i++) {

      //check if the tile is actually a game tile
      if(boardData[currentBoard].map[i].landType[year] != 0)
      {
        tileIDs.push(i);
        landTypes.push(boardData[currentBoard].map[i].landType[year]);
      }

    } // end for

    var toReturn = [tileIDs, landTypes];

    return toReturn;
  }
