var hideOptions = "";
var achievementScripts = [];
var achievementValues = [];
var achievementDisplayed = -1;
var achievementAccomplished = [];
var achievementAnimations = [];
var yearToCheck = 0;
var multiAssignMode = false ;

var objectives = [];
var levelSpecs = {
    begin: "",
    end: "",
    numRequired: 0,
    started: 0,
    finished: 0,
    precipitation: [0,0,0,0],
    landTypeMonoculture: [0,0,0,0]
}


var levelGlobal ;
var lastLevel = 4;



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
            initWorkspace('./levels/maps/conservationSoybeanDSM.csv');
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
            initWorkspace('./levels/maps/conservationSoybeanDSM.csv');
            document.getElementById('popup').className = "popup";
            break;
        case 4:
            levelGlobal = 4;
            loadLevelDetails("./levels/specs/exercise1A.4.txt");
            initWorkspace('./levels/maps/conservationSoybeanDSM.csv');
            document.getElementById('popup').className = "popup";
            break;
        case 0:
            levelGlobal = 0 ;
            initWorkspace('./data.txt');            
            if(achievedAllLevels){updatePopup("Congratulations! You made it through all the levels. Try out your newfound knowledge in Sandbox mode!");}
            break;
        case -1:
            multiAssignMode = true ;
            levelGlobal = 1 ;
            loadLevelDetails("./levels/specs/testMP.txt");
            initWorkspace('./data.txt') ;
            break;
    }
    
    if(levelGlobal > 0){
        
        //if precipitation was not set, then randomly generate values
        for(var i = 0; i < 4; i++){
            
            if(levelSpecs.precipitation[i] == 0){
                
                levelSpecs.precipitation[i] = setPrecipitation();
                
            } else {
                
                levelSpecs.precipitation[i] = Number(levelSpecs.precipitation[i]);
                
            }
            
            //set board precipitation values to levelSpecs precipitation values
            boardData[currentBoard].precipitation[i] = Number(levelSpecs.precipitation[i]);
            boardData[currentBoard].precipitationIndex[i] = Number(convertPrecipToIndex(levelSpecs.precipitation[i]));
            
        }
        
        for(var i = 0; i < 4; i++){
            
            if(levelSpecs.landTypeMonoculture[i] != 0){
                
                for(var j = 0; j < boardData[currentBoard].map.length; j++){
                    
                    if(boardData[currentBoard].map[j].landType[i] != 0){
                        
                        boardData[currentBoard].map[j].landType[i] = Number(levelSpecs.landTypeMonoculture[i]);
                        if(i == currentYear){
                            if(!multiAssignMode){
                            meshMaterials[j].map = textureArray[Number(levelSpecs.landTypeMonoculture[i])];
                            }
                            else{
                            meshMaterials[j].map = multiplayerTextureArray[Number(levelSpecs.landTypeMonoculture[i])];    
                            }
                            boardData[currentBoard].map[j].update(currentYear);
                        }
                        
                    }
                    
                }
                
            }
            
        }
        
        //call toggleVisibility to update new precipitation values
        toggleVisibility();
        
    }
    
    
    
} //end loadLevel

function resetLevel(){
    
    objectives = [];
    levelSpecs = {
            begin: "", end: "", numRequired: 0, started: 0, finished: 0, precipitation: [0,0,0,0], landTypeMonoculture: [0,0,0,0]
    }
    
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
    
    //add the specified precipitation levels to the levelSpecs
    var tempParsed = arrLines[1].split("*");
    for(var i = 0; i < 4; i++){
        levelSpecs.precipitation[i] = tempParsed[i];
    }

    //add the specified monocultures to the levelSpecs
    tempParsed = arrLines[2].split("*");
    levelSpecs.landTypeMonoculture[0] = 1;
    for(var i = 0; i < 3; i++){
        levelSpecs.landTypeMonoculture[i+1] = tempParsed[i];
    }
    
    //add the beginning script to the levelScripts object
    levelSpecs.begin = arrLines[3];
    
    //add the number of final objectives that are required to pass the level
    levelSpecs.numRequired = arrLines[4];
    
    for(var i = 5; i < arrLines.length - 1; i++){
    
        tempParsed = arrLines[i].split("*");
    
        var newObjective = {
            score: tempParsed[0],
            year: Number(tempParsed[1]),
            final: Number(tempParsed[2]),
            accomplished: 0,
            low: Number(tempParsed[3]),
            high: Number(tempParsed[4]),
            script: tempParsed[5],
            animation: tempParsed[6]
        }
        
        objectives.push(newObjective);
        
    }
    
    //add the ending script to the levelScripts object
    levelSpecs.end = arrLines[arrLines.length - 1];
}

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