var objectiveNumber = 0;
        
var scoreTypes = ["cornGrainYieldScore", "soybeanYieldScore", "mixedFruitsAndVegetablesYieldScore", 
"cattleYieldScore", "alfalfaHayYieldScore", "grassHayYieldScore",
"switchGrassYieldScore", "woodYieldScore", "shortRotationWoodyBiomassYieldScore",
"conventionalCornLandUseScore", "conservationCornLandUseScore", "conventionalSoybeanLandUseScore",
"conservationSoybeanLandUseScore", "mixedFruitsAndVegetablesLandUseScore", "permanentPastureLandUseScore",
"rotationalGrazingLandUseScore", "grassHayLandUseScore", "switchgrassLandUseScore", 
"prairieLandUseScore", "wetlandLandUseScore", "alfalfaLandUseScore",
"conventionalForestLandUseScore", "conservationForestLandUseScore", "shortRotationWoodyBioenergyLandUseScore",
"gameWildlifePointsScore", "biodiversityPointsScore", "carbonSequestrationScore", 
"grossErosionScore", "nitrateConcentrationScore", "phosphorusLoadScore",
"sedimentDeliveryScore"];

var scoreLabels = ["Yield score: Corn grain", "Yield score: Soybean", "Yield score: Mixed Fruits and Veggies",
"Yield score: Cattle", "Yield score: Alfalfa", "Yield score: Grass hay", 
"Yield score: Switchgrass", "Yield score: Woody", "Yield score: Short rotation woody bioenergy",
"Land use score: Conventional corn", "Land use score: Conservation corn", "Land use score: Conventional soybean",
"Land use score: Conservation soybean", "Land use score: Mixed fruits and veggies", "Land use score: Permanent pasture",
"Land use score: Rotational grazing", "Land use score: Grass hay", "Land use score: Switchgrass",
"Land use score: Prairie", "Land use score: Wetland", "Land use score: Alfalfa",
"Land use score: Conventional forest", "Land use score: Conservation forest", "Land use score: Short rotation woody bioenergy",
"Ecosystem score: Game wildlife", "Ecosystem score: Biodiversity", "Ecosystem score: Carbon sequestration",
"Ecosystem score: Gross erosion", "Ecosystem score: Nitrate concentration", "Ecosystem score: Phosphorus load",
"Ecosystem score: Sediment delivery"];

var optionTypes = ["paint1", "paint2", "paint3", "paint4",
"paint5", "paint6", "paint7", "paint8",
"paint9", "paint10", "paint11", "paint12",
"paint13", "paint14", "paint15"];

var optionLabels = ["Hide conventional corn", "Hide conservation corn", "Hide conventional soybean",
"Hide conservation soybean", "Hide alfalfa", "Hide permanent pasture",
"Hide rotational grazing", "Hide grass hay", "Hide prairie", 
"Hide conservation forest", "Hide conventional forest", "Hide switchgrass",
"Hide short rotation woody bioenergy", "Hide wetland", "Hide mixed fruits and veggies"];

function addObjective(addToDiv){
    var divToAdd = document.createElement('div');
    
    objectiveNumber++;
    
    divToAdd.innerHTML = "Objective " + objectiveNumber + "<br><br><div><label>Select the score type to monitor for this objective:</label><div>"
        + addRadioButtons() + addMinValue() + addMaxValue() + addYearButtons() + addScript() + addAnimation() + addRequired()
        + "</div></div></div><br>";
        
    document.getElementById(addToDiv).appendChild(divToAdd);
}

function addRadioButtons() {
    var string = "";
    for(var i = 0; i < scoreTypes.length; i++){
        string += "<div><label><input type='radio' name='scores" + objectiveNumber + "' id='score-" + objectiveNumber + "-" + i + "' value=" + scoreTypes[i] + ">" + scoreLabels[i] + "</label></div>";
    }
    return string + "<br>";
}

function addMinValue() {

    return "<label>Objective " + objectiveNumber + " minimum score value:</label> <div><input id='min-" + objectiveNumber +"' type='text' placeholder='0 to 100'></div><br>";
    
}

function addMaxValue() {

            return "<label>Objective " + objectiveNumber + " maximum score value:</label> <div><input id='max-" + objectiveNumber +"' type='text' placeholder='0 to 100'></div><br>";

}

function addYearButtons() {
    var string = "";
    string += "<div><label>Select which year to monitor objective " + objectiveNumber +":</label><div>";
    string += "<div><label><input type='radio' name='years" + objectiveNumber + "' id='year-" + objectiveNumber + "-" + "1" + "' value=" + "1" + ">" + "Year 1" + "</label></div>";
    string += "<div><label><input type='radio' name='years" + objectiveNumber + "' id='year-" + objectiveNumber + "-" + "2" + "' value=" + "2" + ">" + "Year 2" + "</label></div>";
    string += "<div><label><input type='radio' name='years" + objectiveNumber + "' id='year-" + objectiveNumber + "-" + "3" + "' value=" + "3" + ">" + "Year 3" + "</label></div>";

    return string + "<br>";
}

function addScript() {
                        
    return "<label>If the user accomplishes objective " + objectiveNumber + ", PEWI should say:</label> <div><textarea id='objectiveScript-" + objectiveNumber +"' type='text'></textarea></div><br>";

}

function addAnimation() {
    var string = "";
    string += "<div><label>Select the animation to play if objective " + objectiveNumber + " is accomplished:</label><div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "0" + "' value=" + "'none'" + ">" + "Nothing" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "1" + "' value=" + "'flock'" + ">" + "Flock of birds appears" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "2" + "' value=" + "'bird'" + ">" + "Mockingbird flys across screen" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "3" + "' value=" + "'blueRiver'" + ">" + "River turns blue" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "4" + "' value=" + "'brownRiver'" + ">" + "River turns brown" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "5" + "' value=" + "'fireworks'" + ">" + "Fireworks" + "</label></div>";

    return string + "<br>";
}

function addRequired() {
    var string = "";
    string += "<div><label>Is objective " + objectiveNumber + " required for the user to complete the exercise?</label><div>";
    string += "<div><label><input type='radio' name='req" + objectiveNumber + "' id='req-" + objectiveNumber + "-1" + "' value=" + "1" + ">" + "Yes" + "</label></div>";
    string += "<div><label><input type='radio' name='req" + objectiveNumber + "' id='req-" + objectiveNumber + "-0" + "' value=" + "0" + ">" + "No" + "</label></div>";

    return string + "<br>";
}

function addOptions() {
    var divToAdd = document.createElement('div');
    var string = "";
    string += "<br><label>Select which land use types should be hidden from the user:</label>"
    for(var i = 0; i < optionTypes.length; i++){
        string += "<div><label><input type='checkbox' id='options" + "-" + i + "' value='" + optionTypes[i] + "'>" + optionLabels[i] + "</label></div>";
    }
    divToAdd.innerHTML = string;
    document.getElementById("settings").appendChild(divToAdd);
}

function processForm() {
    
    var string = "";
    
    for(var i = 0; i < optionTypes.length; i++){
        
        var idValue = "options-" + i;
        
        if(document.getElementById(idValue).checked){
            
            string += document.getElementById("options-" + i).value + "*";
            
        }
        
    }
    
    string = string.substring(0, string.length - 1) + "\r\n";
    
    string += document.getElementById("beginningScript").value.replace(/\n/g, " ") + "\r\n";
    
    string += document.getElementById("numRequired").value + "\r\n";
    
    if(objectiveNumber > 0){
    
        for(var i = 1; i < objectiveNumber+1; i++){
        
            for(var j = 0; j < scoreTypes.length; j++){
            
                var idValue = "score-" + i + "-" + j;
            
                if(document.getElementById(idValue).checked){
                
                    string += document.getElementById(idValue).value + "*";
                
                }            
            
            }
            
            for(var j = 1; j < 4; j++){
                
                var idValue = "year-" + i + "-" + j;
                
                if(document.getElementById(idValue).checked){
                    
                    string += document.getElementById(idValue).value + "*";
                    
                }
                
            }
            
            if(document.getElementById("req-" + i + "-0").checked){
                
                string += "0*";
                 
            }
            
            if(document.getElementById("req-" + i + "-1").checked){
                
                string += "1*";
                
            }
            
            string += document.getElementById("min-" + i).value + "*";
            
            string += document.getElementById("max-" + i).value + "*";
            
            if(document.getElementById("objectiveScript-" + i).value != ""){
                
                string += document.getElementById("objectiveScript-" + i).value.replace(/\n/g, " ") + "*";
                
            } else {
                
                string += "none*";
            }
            
            for(var j = 0; j < 6; j++){
                
                var idValue = "animation-" + i + "-" + j;
                
                if(document.getElementById(idValue).checked){
                    
                    string += document.getElementById(idValue).value + "\r\n";
                    
                }
                
            }
        
        }
        
    }
    
    string += document.getElementById("endingScript").value.replace(/\n/g, " ") ;
    
    return string;

}

//downloadLevel
function downloadLevel() {

    var data = processForm();
    var fileName = "exercise" + document.getElementById("exerciseNumber").value;
    var uri = 'data:text/csv;charset=UTF-8,' + escape(data);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

} // end downloadClicked