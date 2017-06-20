//this file interfaces with the level designer page
// it is used to easily design any sort of level which may be needed

var objectiveNumber = 0;

//Contains names of monitorable scores
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
    "sedimentDeliveryScore"
];

//Contains strings to display for monitorable scores
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
    "Ecosystem score: Sediment delivery"
];

//Contains toggleable option names
var optionTypes = ["paint1", "paint2", "paint3", "paint4",
"paint5", "paint6", "paint7", "paint8",
"paint9", "paint10", "paint11", "paint12",
"paint13", "paint14", "paint15",
"precipOff", "year2Button*year2PrecipContainer", "year3Button*year3PrecipContainer"];

//Contains strings to display for toggleable options
var optionLabels = ["Hide conventional corn", "Hide conservation corn", "Hide conventional soybean",
"Hide conservation soybean", "Hide alfalfa", "Hide permanent pasture",
"Hide rotational grazing", "Hide grass hay", "Hide prairie",
"Hide conservation forest", "Hide conventional forest", "Hide switchgrass",
"Hide short rotation woody bioenergy", "Hide wetland", "Hide mixed fruits and veggies",
"Prevent precipitation changes", "Hide year 2", "Hide year 3"];

//addObjective allows for objectives to be added to the form dynamically
function addObjective(addToDiv) {
    objectiveNumber++;
    var divToAdd = document.createElement("div");
    divToAdd.innerHTML = "Objective " + objectiveNumber + "<br><br>" +
        addObjectiveType() + addMinValue() + addMaxValue() + addYearButtons() + addScript() + addAnimation() + addRequired() +
        "</div></div></div><br>";

    document.getElementById(addToDiv).appendChild(divToAdd);
} //end addObjective

//deleteObjective allows for objectives to be deleted from the form dynamically
function deleteObjective() {
    if(objectiveNumber>0)
    {
        var objectiveToDelete = prompt("Please enter an objective number:", objectiveNumber);
        if(objectiveToDelete === "" || objectiveToDelete<0 || objectiveToDelete>objectiveNumber)
        {
            objectiveToDelete = prompt("Please enter a valid objective number:", objectiveNumber);
        }
        if(objectiveToDelete !== null)
        {
            var list = document.getElementById("objectiveDiv");
            list.removeChild(list.childNodes[objectiveToDelete-1]);
            objectiveNumber--;
            for(var i = 0; i < objectiveNumber; i++)
            {
                var tempInt = i+1;
                list.childNodes[i].childNodes[0].data = "Objective " + tempInt;
                list.childNodes[i].childNodes[5].innerHTML = "Objective " + tempInt + " minimum score value:";
                list.childNodes[i].childNodes[9].innerHTML = "Objective " + tempInt + " maximum score value:";
                list.childNodes[i].childNodes[13].childNodes[0].innerHTML = "Select which year to monitor objective " + tempInt;
                list.childNodes[i].childNodes[13].childNodes[1].childNodes[4].innerHTML = "If the user accomplishes objective " +
                tempInt + ", PEWI should say:";
                list.childNodes[i].childNodes[13].childNodes[1].childNodes[8].childNodes[0].innerHTML = "Select the animation to play if objective " +
                tempInt + " is accomplished:";
                list.childNodes[i].childNodes[13].childNodes[1].childNodes[8].childNodes[1].childNodes[9].childNodes[0].innerHTML = "Is objective " +
                tempInt + " required for the user to complete the exercise?";
            }
        }
    }
} //end deleteObjective
//addObjectiveType adds multiple choices for score type to monitor
function addObjectiveType() {
    var string = "<div><label>Choose the score type to monitor for this objective: </label><select id='scoretype-" + objectiveNumber + "'>";
    for(var i = 0; i < scoreTypes.length; i++){
        string += "<option value='" + scoreTypes[i] + "'>" + scoreLabels[i] + "</option>";
    }
    string += "</select></div>";
    return string + "<br>";
} //end addObjectiveType

//addMinValue inserts input for minimum score range
function addMinValue() {
    return "<label>Objective " + objectiveNumber + " minimum score value:</label> <div><input id='min-" + objectiveNumber + "' type='text' placeholder='0 to 100'></div><br>";
} //end addMinValue

//addMaxValue inserts input for maximum score range
function addMaxValue() {
    return "<label>Objective " + objectiveNumber + " maximum score value:</label> <div><input id='max-" + objectiveNumber + "' type='text' placeholder='0 to 100'></div><br>";
} //end addMaxValue

//addYearButtons inserts input for year to monitor
function addYearButtons() {
    var string = "";
    string += "<div><label>Select which year to monitor objective " + objectiveNumber + ":</label><div>";
    string += "<div><label><input type='radio' name='years" + objectiveNumber + "' id='year-" + objectiveNumber + "-" + "1" + "' value=" + "1" + ">" + "Year 1" + "</label></div>";
    string += "<div><label><input type='radio' name='years" + objectiveNumber + "' id='year-" + objectiveNumber + "-" + "2" + "' value=" + "2" + ">" + "Year 2" + "</label></div>";
    string += "<div><label><input type='radio' name='years" + objectiveNumber + "' id='year-" + objectiveNumber + "-" + "3" + "' value=" + "3" + ">" + "Year 3" + "</label></div>";
    return string + "<br>";
} //end addYearButtons

//addScript inserts input for objective script
function addScript() {
    return "<label>If the user accomplishes objective " + objectiveNumber + ", PEWI should say:</label> <div><textarea id='objectiveScript-" + objectiveNumber + "' type='text'></textarea></div><br>";
} //end addScript

//addAnimation inserts selection for animation to trigger
function addAnimation() {
    var string = "";
    string += "<div><label>Select the animation to play if objective " + objectiveNumber + " is accomplished:</label><div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "0" + "' value=" + "'none'" + ">" + "Nothing" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "1" + "' value=" + "'flock'" + ">" + "Flock of birds appears" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "2" + "' value=" + "'bird'" + ">" + "Meadowlark flys across screen" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "3" + "' value=" + "'blueRiver'" + ">" + "River turns blue" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "4" + "' value=" + "'brownRiver'" + ">" + "River turns brown" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "5" + "' value=" + "'greenRiver'" + ">" + "River turns green" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "6" + "' value=" + "'rain'" + ">" + "Rain shower" + "</label></div>";
    string += "<div><label><input type='radio' name='animate" + objectiveNumber + "' id='animation-" + objectiveNumber + "-" + "7" + "' value=" + "'fireworks'" + ">" + "Fireworks" + "</label></div>";
    return string + "<br>";
} //end addAnimation

//addRequired allows users to mark as a required objective
function addRequired() {
    var string = "";
    string += "<div><label>Is objective " + objectiveNumber + " required for the user to complete the exercise?</label><div>";
    string += "<div><label><input type='radio' name='req" + objectiveNumber + "' id='req-" + objectiveNumber + "-1" + "' value=" + "1" + ">" + "Yes" + "</label></div>";
    string += "<div><label><input type='radio' name='req" + objectiveNumber + "' id='req-" + objectiveNumber + "-0" + "' value=" + "0" + ">" + "No" + "</label></div>";
    return string + "<br>";
} //end addRequired

//addOptions allows the user to select toggleable options
function addOptions() {
    var divToAdd = document.createElement('div');
    var string = "";
    string += "<br><label>Select which land use types should be hidden from the user:</label>";
    for (var i = 0; i < optionTypes.length; i++) {
        string += "<div><label><input type='checkbox' id='options" + "-" + i + "' value='" + optionTypes[i] + "'>" + optionLabels[i] + "</label></div>";
    }
    divToAdd.innerHTML = string;
    document.getElementById("settings").appendChild(divToAdd);
} //end addOptions

//processForm parses the form options and produces a level specifications file
function processForm() {

    var string = "";

    //add toggleable options to the first line of file
    for (var i = 0; i < optionTypes.length; i++) {

        var idValue = "options-" + i;

        if (document.getElementById(idValue).checked) {
            string += document.getElementById("options-" + i).value + "*";
        }//end if
    }//end for each line in file

    string = string.substring(0, string.length - 1) + "\r\n";

    //add selected precipitation levels to the second line of the file
    var y0 = document.getElementById("precipYear0");
    var y1 = document.getElementById("precipYear1");
    var y2 = document.getElementById("precipYear2");
    var y3 = document.getElementById("precipYear3");

    string += y0.options[y0.selectedIndex].text + "*" + y1.options[y1.selectedIndex].text + "*" + y2.options[y2.selectedIndex].text + "*" + y3.options[y3.selectedIndex].text + "\r\n";

    //add selected monocultures to the third line of the file
    y1 = document.getElementById("year1Monoculture");
    y2 = document.getElementById("year2Monoculture");
    y3 = document.getElementById("year3Monoculture");

    string += y1.options[y1.selectedIndex].value + "*" + y2.options[y2.selectedIndex].value + "*" + y3.options[y3.selectedIndex].value + "\r\n";

    string += document.getElementById("beginningScript").value.replace(/\n/g, " ") + "\r\n";

    string += document.getElementById("numRequired").value + "\r\n";

    //for the following lines add the objective specifications
    if (objectiveNumber > 0) {

        for (var i = 1; i < objectiveNumber + 1; i++) {

            //add the score being monitored
            var objectiveScoreType = document.getElementById("scoretype-" + i);

            string += objectiveScoreType.options[objectiveScoreType.selectedIndex].value + "*";

            //insert the year to check this score in
            for (var j = 1; j < 4; j++) {

                var idValue = "year-" + i + "-" + j;

                if (document.getElementById(idValue).checked) {

                    string += document.getElementById(idValue).value + "*";
                }//end if
            }//end for each year

            //add 0 if this objective is not required
            if (document.getElementById("req-" + i + "-0").checked) {
                string += "0*";
            }//end if

            //add 1 if this objective is required
            if (document.getElementById("req-" + i + "-1").checked) {
                string += "1*";
            }//end if

            //add the minimum range value
            string += document.getElementById("min-" + i).value + "*";

            //add the maximum range value
            string += document.getElementById("max-" + i).value + "*";

            //add the objective script
            if (document.getElementById("objectiveScript-" + i).value !== "") {
                string += document.getElementById("objectiveScript-" + i).value.replace(/\n/g, " ") + "*";
            }
            else {
                string += "none*";
            }//end if/else group

            //add the selected animation
            for (var j = 0; j < 6; j++) {
                var idValue = "animation-" + i + "-" + j;

                if (document.getElementById(idValue).checked) {
                    string += document.getElementById(idValue).value + "\r\n";
                }//end if
            }//end for
        }//end for each objective
    }//end if objective number > 0

    //add the final script as the last line of the file.
    string += document.getElementById("endingScript").value.replace(/\n/g, " ");

    return string;
} //end processForm

//downloadLevel processes the form and saves it to the users computer
function downloadLevel() {

    //this function doesn't use filesaver.js but should still be compatible
    //across most browsers. Consider changing this in the future

    var data = processForm();
    var fileName = document.getElementById("exerciseNumber").value;
    var uri = 'data:text/csv;charset=UTF-8,' + escape(data);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
} //end downloadClicked
