// global var for each page

// ===These are the number of each frames===
// CREDIT_HTML = window.frames[0],
// UPDOWNLOAD_HTML = window.frames[1],
// CODEX_HTML = window.frames[2],
// RESULTS_HTML = window.frames[3],
// MULTIDOWNLOAD_HTML = window.frames[4],
// OPTIONS_HTML = window.frames[5],
// PRINTOPTIONS_HTML = window.frames[6],
// STARTUP_HTML = window.frames[7];

//global variable for initial board state, cleared after use
var initData = [];

//set of possible precipitation levels
var precip = [24.58, 28.18, 30.39, 32.16, 34.34, 36.47, 45.10];

//checkFileCorrectness takes the file and check if it has correct lines and cells
function checkFileCorrectness(file, callback) {

  var reader = new FileReader();
  reader.readAsText(file);

  // onload function is asynchronous function, can't return value; therefore use callback function
  reader.onload = function(e) {
    var result = true;
    var strRawContents = "";
    strRawContents = reader.result;
    //split based on escape chars
    while (strRawContents.indexOf("\r") >= 0)
      strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");

    // check the content length here
    if (arrLines.length != 829) {
      console.log("Lines number not correct. " + arrLines.length);
      result = false;
    }

    // can further check other things

    callback(result);
  }; // end onload()

}

//convertPrecipToIndex returns precipitationIndex array indicies from precip levels
function convertPrecipToIndex(precip) {

  switch (precip) {
    case 24.58: return 0;
    case 28.18: return 1;
    case 30.39: return 2;
    case 32.16: return 3;
    case 34.34: return 4;
    case 36.47: return 5;
    case 45.10: return 6;
  }
} //end convertPrecipToIndex

//this function returns a random int between min and max, inclusive!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} //end getRandomInt

// Check if the array initData value and format is correct so that it's able to feed Tile object
// returns true/false
function initDataIsCorrupt() {
  // check length
  if (initData.length != 828) {
    console.log("I thought this will never be triggered");
    console.log("initData.length: " + initData.length);
    console.log("initData ");
    console.log(initData);
    return 1;
  }
  // Each cell is an array, check the length of each cell
  for (var i = 0; i < initData.length; i++) {
    /**
    if (initData[i].length !=32 && initData[i].length !=33 ) {
    console.log("something wrong inside at row " + i + "in initData");
    return 1;
  } // end if*/

  // check if there is value in each small cell
  // for (var j = 0; j < initData[i].length; /*32*/ j++) {
  //   if (initData[i][j].length == 0) {
  //     console.log("empty value at [" + i + "][" + j + "]");
  //     return 1;
  //   }
  //   //XXX can further check each value one by one
  //
  // } // end for
} // end for
// console.log("initData passed checking!");
// not corrupt
return 0;
} // end initDataIsCorrupt()

//load the data from given fileString into the given board object
function loadBoard(board, fileString) {

  $.ajax({
    async: false,
    type: "GET",
    url: fileString,
    dataType: "text",
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    success: function(data) {
      parseInitial(data);
    }
  });

  propogateBoard(board);

  //clear initData
  initData = [];

} //end loadBoard()

//parseInitial takes the data from on server text file and fills global array
// return true/false
function parseInitial(data) {

  //get data from invisible div on page
  var strRawContents = data;
  // console.log('strRawContents', strRawContents);
  //split based on escape chars
  while (strRawContents.indexOf("\r") >= 0)
    strRawContents = strRawContents.replace("\r", "");
  var arrLines = strRawContents.split("\n");
  // console.log('strRawContents', strRawContents);
  //for each line in the file, split line by comma and push to the initData array
  for (var i = 1; i < arrLines.length; i++) {
    var curLine = arrLines[i];
    if (curLine.length > 0) initData.push(curLine.split(","));
    else console.log("Empty line in file: ignored");
  } //end for : each line in the file

  // check initData type correctness
  // if (initDataIsCorrupt()) {
  //   alert("Cannnot convert the file content!");
  //   console.log("Inner content is not correct.");
  //   return 0;
  // }

  // // success
  return 1;

} //end parseInitial()

/**
* Prompt a dialogue to ask for filename
* If the user did not enter file name then it take date and time stamp as default file name.
*
* @returns filename (string) final file name
*/
function promptFileName() {
  var today = new Date();
  var str = today.toString();  // deprecated! use toUTCString()

  //split based on escape chars
  while (str.indexOf(" ") >= 0) {
    str = str.replace(" ", "_");
  }
  str = str.slice(0,-33);

  var filename = prompt("Enter the file name:", "PEWI-"+str);
  if (filename === null || filename === "") {
    filename = "PEWI-"+str;
  }

  return filename;

} // END promptFileName

//setPrecipitation sets the precipitation for year 0 through year 3 in the watershed
function setPrecipitation() {

  //randomly select precipitation value
  var r = Math.floor(Math.random() * precip.length);
  return r;
} //end setPrecipitation()

//helper method for calculations of log base 10
Math.log10 = function(n) {
  return (Math.log(n)) / (Math.log(10));
}; //end log10
