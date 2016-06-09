//global variable for initial board state, cleared after use
var initData = [];

//set of possible precipitation levels
var precip = [24.58, 28.18, 30.39, 32.16, 34.34, 36.47, 45.10];

//parseInitial takes the data from on server text file and fills global array
function parseInitial(data) {
 
     //get data from invisible div on page
    var strRawContents = data;
    //split based on escape chars
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");

    //for each line in the file, split line by comma and push to the initData array
    for (var i = 0; i < arrLines.length - 1; i++) {
        var curLine = arrLines[i];
        initData.push(curLine.split(","));
        
    } //end for : each line in the file
} //end parseInitial()


//setPrecipitation sets the precipitation for year 0 through year 3 in the watershed
function setPrecipitation() {

    //randomly select precipitation value
    var r = Math.floor(Math.random() * precip.length);
    return r;
} //end setPrecipitation()


//helper method for calculations of log base 10
Math.log10 = function(n) {
        return (Math.log(n)) / (Math.log(10));
} //end log10

//load the data from given fileString into the given board object
function loadBoard(board, fileString) {
    
    $.ajax({
        async: false,
       type: "GET",
       url: fileString,
       dataType: "text",
       contentType: "application/x-www-form-urlencoded;charset=UTF-8",
       success: function (data) {
           parseInitial(data);
       }
    });
    
    propogateBoard(board) ;
    
    //clear initData
    initData = null ;
    
}