var levelContainer = [];

//init parses the level.dat file which stores level data in the levelContainer array
function init() {

  $.ajax({
       async: false,
       type: "GET",
       url: '../levels/levelResources/level.dat',
       dataType: "text",
       contentType: "application/x-www-form-urlencoded;charset=UTF-8",
       success: function (data) {
           parseLevelMenuData(data);
       }
    });

} //end init

//parseLevelMenuData reads the string from the level.dat file into a level hierarchy
function parseLevelMenuData(data) {
    
     var strRawContents = data;
    //split based on escape chars
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");
    
    var levelIndex = -1;
    var stageIndex = -1;    
    
    for( var i = 0; i < arrLines.length; i++){
        var lineType = arrLines[i].substring(0, 1);
        var lineContent = arrLines[i].substring(2, arrLines[i].length);
        
        switch(lineType){
            //if the line is a new stage
            case "#":
                stageIndex = -1;
                levelIndex++;
                var levelData = {
                    data: [],
                    name: lineContent
                };
                levelContainer.push(levelData);
                break;
            //if the line is a new level
            case "@":
                var lineArray = lineContent.split(",");
                var exerciseData = {
                    exercise: lineArray[1],
                    name: lineArray[0]
                };
                levelContainer[levelIndex].data.push(exerciseData);
                break;
        }
    
    }
    
} //end parseLevelMenuData

//populateLevels uses the levelContainer hierarchy of stages, levels, and exercises to organize the level container
function populateLevels(){
    
    var tempString = " ";
    
    for(var i = 0; i < levelContainer.length; i++){
        
        var placementPercent = [20, 50, 30];

        //create a new stage element
        tempString += "<div class='groupContainer' style='left:" + placementPercent[i] + "%; margin: 0 auto; top: " + ((i+1) * 250 - 75) + "px;'>";
        tempString += "<div class='mainButton' id='mainButtonNoHover' style='position: relative; margin: 0 auto; margin-bottom:20px'>" + levelContainer[i].name + "</div>";
        
            //for each exercise stored as an element in a level stored in the levelContainer
            for(var k = 0; k < levelContainer[i].data.length; k++){
                
                //Create a new exercise element
                tempString += "<div class='cloud' onclick='window.top.loadLevel(" + levelContainer[i].data[k].exercise + ")'><img src='../imgs/Cloud.png'/><p>" + (k+1) + "</p></div>";
                if(k < levelContainer[i].data.length - 1){tempString += "<div class='cloudSpacer'></div>"};
                
            }
            
        tempString += "</div>";
        
        
    }
    
    return tempString;
    
} //end populateLevels