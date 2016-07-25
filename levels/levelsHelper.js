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
                stageIndex++;
                var stageData = {
                    data: [],
                    name: lineContent
                };
                levelContainer[levelIndex].data.push(stageData);
                break;
            //inf the line is a new exercise
            case "%":
                var lineArray = lineContent.split(",");
                var exerciseData = {
                    exercise: lineArray[1],
                    name: lineArray[0]
                };
                levelContainer[levelIndex].data[stageIndex].data.push(exerciseData);
                break;
        }
    }
    
} //end parseLevelMenuData

//populateLevels uses the levelContainer hierarchy of stages, levels, and exercises to organize the level container
function populateLevels(){
    
    var tempString = " ";
    
    //for each stage stored as an element in the levelContainer
    for(var i = 0; i < levelContainer.length; i++){
        
        //create a new stage element
        tempString += "<div id='" + levelContainer[i].name.replace(/\s/g, "") + "' class='groupElement' style='padding-left: 20px;'>";
        tempString += levelContainer[i].name;
        tempString += "</div>";
        
        //for each level stored as an element in a stage stored in the levelContainer
        for(var j = 0; j < levelContainer[i].data.length; j++){
        
            //create a new level element
            tempString += "<div id='" + levelContainer[i].data[j].name.replace(/\s/g, "") + "' class='groupElement' style='padding-left: 40px;'>";
            tempString += levelContainer[i].data[j].name;
            tempString += "</div>";
         
            //for each exercise stored as an element in a level stored in the levelContainer
            for(var k = 0; k < levelContainer[i].data[j].data.length; k++){
                
                //create a new exercise element
                tempString += "<div id='" + levelContainer[i].data[j].data[k].name.replace(/\s/g, "") + "' class='exerciseElement' style='padding-left: 60px;' onclick='window.top.loadLevel(" + levelContainer[i].data[j].data[k].exercise + ")';>";
                tempString += levelContainer[i].data[j].data[k].name;
                tempString += "</div>";
                
            }
            
        }
        
        
    }
    
    return tempString;
    
} //end populateLevels