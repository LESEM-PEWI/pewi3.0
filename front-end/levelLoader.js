var hideOptions = "";
var achievementScripts = [];
var achievementValues = [];
var achievementDisplayed = -1;
var achievementAccomplished = [];
var achievementAnimations = [];
var yearToCheck = 0;
var levelGlobal ;
var lastLevel = 3;

//loadLevel is triggered by clicking a level button on the html page
function loadLevel(level){
    
    resetLevel();
    
    var achievedAllLevels = false;
    if(level > lastLevel){
        level = 0;
        achievedAllLevels = true;
    }
    
    switch(level){
        case 1:
            levelGlobal = 1 ;
            //parse level options file
            loadLevelDetails("./levels/specs/level1Specifications.txt");
            initWorkspace('./levels/maps/pewiNewMapUpload.csv');
            document.getElementById('popup').className = "popup";
            break;
        case 2:
            levelGlobal = 2;
            loadLevelDetails("./levels/specs/level2Specifications.txt");
            initWorkspace('./data.txt');
            document.getElementById('popup').className = "popup";
            break;
        case 3:
            levelGlobal = 3;
            loadLevelDetails("./levels/specs/level3Specifications.txt");
            initWorkspace('./data.txt');
            document.getElementById('popup').className = "popup";
            break;
        case 0:
            levelGlobal = 0 ;
            initWorkspace('./data.txt');            
            if(achievedAllLevels){updatePopup("Congratulations! You made it through all the levels. Try out your newfound knowledge in Sandbox mode!");}
            break;

    }
    
    
    
} //end loadLevel

function resetLevel(){
    
    achievementScripts = [];
    achievementValues = [];
    achievementDisplayed = -1;
    achievementAccomplished = [];
    achievementAnimations = [];
    yearToCheck = 0;
    
    clearPopup();
    
    document.getElementById("mainMenuButton").className = "moveButtonHidden";
    document.getElementById("nextLevelButton").className = "moveButtonHidden";
    
}

function parseLevelDetails(data) {
 
    //get data from invisible div on page
    var strRawContents = data;
    //split based on escape chars
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");

    var curLine = arrLines[0];
    //parse id's of items to hide using the parameters div in index.html
    hideOptions = curLine.split("*").join("\n");
    document.getElementById("parameters").innerHTML = hideOptions;
    
    for(var i = 2; i < arrLines.length - 2; i++){
        
        var tempScripts = [];
        var tempValues = [];
        var tempAnimations = [];
        
        achievementAccomplished[i-2] = -1;
        
        //Add the start up script to tempScripts
        tempScripts.push(arrLines[1]);
        
        //Parse the items in each line
        var tempParsed = arrLines[i].split("*");
        
        //Add the name of the score being checked to the values array
        tempValues.push(tempParsed[0]);
        for(var j = 1; j < tempParsed.length; j++){
            if(j != tempParsed.length - 1){
                if(j%2 != 0){
                    tempValues.push(tempParsed[j]);
                } else {
                    tempScripts.push(tempParsed[j]);
                }
            } else {
                achievementAnimations[i-2] = tempParsed[tempParsed.length - 1];
            }
        }
        
        //Add the final script to tempScripts
        tempScripts.push(arrLines[arrLines.length - 2]);
        
        //Determine which year is being checked
        yearToCheck = arrLines[arrLines.length - 1];
        
        //Add tempScripts and tempValues to the achievements Arrays
        achievementValues.push(tempValues);
        achievementScripts.push(tempScripts);
    
    }
        
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

function returnCurrentLevel(){
    return levelGlobal;
}