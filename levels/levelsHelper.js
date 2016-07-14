var levelContainer = [];

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

}

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
            case "#":
                stageIndex = -1;
                levelIndex++;
                var levelData = {
                    data: [],
                    name: lineContent
                };
                levelContainer.push(levelData);
                break;
            case "@":
                stageIndex++;
                var stageData = {
                    data: [],
                    name: lineContent
                };
                levelContainer[levelIndex].data.push(stageData);
                break;
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
    
}

function generateDisplay() {
    
    for(var i = 0; i < levelContainer.length; i++){
        
        //console.log(levelContainer[i].name);
        
        for(var j = 0; j < levelContainer[i].data.length; j++){
            
            //console.log(levelContainer[i].data[j].name);
            
            for(var k = 0; k < levelContainer[i].data[j].data.length; k++){
                
                    //console.log(levelContainer[i].data[j].data[k].name);
                    
            }
            
        }
        
    }
    
    
}

function populateLevels(){
    
    var tempString = " ";
    
    for(var i = 0; i < levelContainer.length; i++){
        
        console.log(levelContainer[i].name);
        
        tempString += "<div id='" + levelContainer[i].name.replace(/\s/g, "") + "' class='groupElement' style='padding-left: 20px;'>";
        tempString += levelContainer[i].name;
        tempString += "</div>";
        
        for(var j = 0; j < levelContainer[i].data.length; j++){
        
            tempString += "<div id='" + levelContainer[i].data[j].name.replace(/\s/g, "") + "' class='groupElement' style='padding-left: 40px;'>";
            tempString += levelContainer[i].data[j].name;
            tempString += "</div>";
         
            for(var k = 0; k < levelContainer[i].data[j].data.length; k++){
                
                tempString += "<div id='" + levelContainer[i].data[j].data[k].name.replace(/\s/g, "") + "' class='exerciseElement' style='padding-left: 60px;' onclick='window.top.loadLevel(" + levelContainer[i].data[j].data[k].exercise + ")';>";
                tempString += levelContainer[i].data[j].data[k].name;
                tempString += "</div>";
                
            }
            
        }
        
        
    }
    
    return tempString;
    
}