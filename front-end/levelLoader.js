var hideOptions = "";
var achievementScripts = [];
var achievementValues = [];
var achievementDisplayed = -1;

//loadLevel is triggered by clicking a level button on the html page
function loadLevel(level){
    
    switch(level){
        case 1:
            //parse level options file
            loadLevelDetails("./front-end/level1Specifications.txt");
            initWorkspace('./front-end/pewiNewMapUpload.csv');
            break;
        case 2:
            
            break;
        case 3:
            
            break;
    }
    
    
    
} //end loadLevel

function parseLevelDetails(data) {
 
    //get data from invisible div on page
    var strRawContents = data;
    //split based on escape chars
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");

    var curLine = arrLines[0];
    //hideOptions = curLine.replace("*", "\n");
    hideOptions = curLine.split("*").join("\n");
    document.getElementById("parameters").innerHTML = hideOptions;
    
    achievementScripts.push(arrLines[1]);
    
    for(var i = 2; i < arrLines.length - 1; i++){
        var tempArr = arrLines[i].split("*");
        achievementValues.push(tempArr[0]);
        for(var j = 1; j < tempArr.length; j++){
            if(j%2 != 0){
                achievementValues.push(tempArr[j]);
            } else {
                achievementScripts.push(tempArr[j]);
            }
        }
    }
    
    achievementScripts.push(arrLines[arrLines.length - 1]);
    
    console.log(achievementValues);
    console.log(achievementScripts);
    
        
} //end parseInitial()

//load the data from given fileString into the given board object
function loadLevelDetails(fileString) {
    
    $.ajax({
        async: false,
       type: "GET",
       url: fileString,
       dataType: "text",
       contentType: "application/x-www-form-urlencoded;charset=UTF-8",
       success: function (data) {
           parseLevelDetails(data);
       }
    });
    
}