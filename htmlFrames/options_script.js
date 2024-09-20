
  var tempString;
  var multiString;
  var maxYear = 3; //for settings, defines the number of year buttons specified
  var progressbarDescrip = ["Game Wildlife","Biodiversity", "Stream Biodiversity" ,"Carbon Sequestration","Gross Erosion","Nitrate Concentration","Phoshorus Load","Sediment Delivery", "Aquatic Health",
                            "Corn Grain","Soybeans","Mixed Fruits and Vegetables","Cattle","Alfalfa Hay","Grass Hay","Switchgrass Biomass","Wood",
                            "Short Rotation Woody Bioenergy","Total Sum Yields"];
  var progressbarIds = ["gameWildlifeProgressBar","biodiversityProgressBar", "streamBiodiversityProgressBar" ,"carbonProgressBar","erosionProgressBar","nitrateProgressBar","phoshorusProgressBar",
                        "sedimentProgressBar", "aquaticProgressBar", "cornGrainProgressBar","soybeansProgressBar","fruitsAndVegetablesProgressBar","cattleProgressBar","alfalfaHayProgressBar",
                        "grassHayProgressBar","switchgrassBiomassProgressBar","woodProgressBar","woodyBiomassProgressBar","totalYieldsProgressBar"];

  // unitType is used to identify what kind of unit should be shown in the Min/Max table
  // var unitType = document.getElementById("englishButton").className == "buttonSelected" ? "English" : "Metric";
  var unitType;
  /*
  * savedOptions is a variable to indicate that whether or not changes in Instructor Options were saved.
  */
  var savedOptions = false;
  /*
  * The variable selectedOptionsTrue is to store all elements selected when "Save and Exit" button is pressed.
  * This is used to know what elements to set to false, when exit without saving is done.
  */
  var selectedOptionsTrue = [];
  /*
  * The variable selectedOptionsFalse is to store all elements that are not selected when "Save and Exit" button is pressed.
  * This is used to know what elements to set to false, when exit without saving is done.
  */
  var selectedOptionsFalse = [];
  var hotkeyDescrip = ["Resets Camera","Randomize PEWI map","Toggle Topography","Undo Previous Land Change","Toggle Recording Feature","Create Multiplayer Maps",
  "Move Right","Move Left","Move Forward","Move Backward","Toggle Overlay","Toggle Flying Mode","Toggle Contour Map", "Print",
  "Pivot Flat","Pivot Upright","Rotate Counterclockwise","Rotate Clockwise"];



  //the saveCurrentOptionsState function is called when the save/exit button is pressed
  //each of the options is evaluated and the text for the parameters div is generated
  //as needed
  //the parent page is then called to hide the options iframe
  function saveCurrentOptionsState() {

    if (parent.getTracking()) {
    parent.pushClick(0, parent.getStamp(), 108, 0, null);
  }

    //find the elements that are able to be checked
    var toggledElements = document.getElementsByClassName('toggle');
    var tempString = "";

    //if there are toggle elements
    if (toggledElements) {
      for (var i = 0; i < toggledElements.length; i++) {
        switch (toggledElements[i].id) {
          case "year0":
            if (toggledElements[i].checked) {
              tempString += "year0On" + "\n";
            }
            break;
          case "statFrame":
            if (!toggledElements[i].checked) {
              tempString += "statsOn" + "\n";
            }
            break;
          case "skybox":
            if (toggledElements[i].checked) {
              tempString += "skyboxOn" + "\n";
            }
            break;
          case "precip":
            if (toggledElements[i].checked) {
              tempString += "precipOff" + "\n";
            }
            break;
            // duplicate code, we can delete them
            // case "hover1":
            //   if (toggledElements[i].checked) {
            //     tempString += "hover1" + "\n";
            //   }
            //   break;
            // case "hover2":
            //     if (toggledElements[i].checked) {
            //       tempString += "hover2" + "\n";
            //     }
            //  break;
            // case "hover3":
            //    if (toggledElements[i].checked) {
            //      tempString += "hover3" + "\n";
            //    }
            // break;
            // case "hover4":
            //   if (toggledElements[i].checked) {
            //     tempString += "hover4" + "\n";
            //   }
            // break;
            // case "hover5":
            //   if (toggledElements[i].checked) {
            //     tempString += "hover5" + "\n";
            //   }
            // break;
            // case "hover6":
            //   if (toggledElements[i].checked) {
            //     tempString += "hover6" + "\n";
            //   }
            // break;
            // case "hover7":
            //   if (toggledElements[i].checked) {
            //     tempString += "hover7" + "\n";
            //   }
            // break;
            // case "hover8":
            //   if (toggledElements[i].checked) {
            //     tempString += "hover8" + "\n";
            //   }
            // break;
            case "allProgressbars":
              if (toggledElements[i].checked){
                tempString += "allProgressbars" + "\n";
              }
              break;
            //default case, just add a new line with parameter
          default:
            if (toggledElements[i].checked) {
              tempString += toggledElements[i].id + "\n";
            }
        } //end switch
      } //end for elements of class toggle

      var yearNum = Number(document.getElementById('yearNumber').innerHTML);

      //if year number is less than max year then get rid of that year
      //  by adding it to the parameters list
      while (yearNum < maxYear) {
        yearNum += 1;
        //toggle off year button
        var idName = "year" + yearNum + "Button";
        tempString += idName + "\n";
        //toggle off precip selection
        idName = "year" + yearNum + "PrecipContainer";
        tempString += idName + "\n";
      }

      //put all the elements in the parameters div of index.html
      window.top.document.getElementById('parameters').innerHTML = tempString;
      parent.optionsString=tempString;
      if(tempString.includes('paint'))
      {
        try {
          parent.saveAndRandomize();
        }
        catch(error){
          alert(error.message);
          return;
        }
      }
    } //end if
    //hide the options frame from the top frame (index.html)
    parent.resetOptions();
    parent.loadLevel(0);
    //scroll page to top, so that next time options is loaded it starts there
    window.scrollTo(0, 0);


    savedOptions = true; //Sets the savedOption to true, this indicates that the changes were saved

  } //end function saveCurrentOptionsState


  //this function gets the current option parameters which are stored as text in
  // the parameter div
  // it then updates the options page accordingly, since the iframe has no memory of
  // it's state
  // This function is called by the parent page in helpers.js
  function getCurrentOptionsState() {
    //raw text content in parameters div
    var strRawContents = window.top.document.getElementById('parameters').innerHTML;
      // console.log("in the get current options state method"+strRawContents);
    //split based on escape chars
    while (strRawContents.indexOf("\r") >= 0) {
      strRawContents = strRawContents.replace("\r", "");
    }
    var arrLines = strRawContents.split("\n");

    var yearCounter = 0;
    //for each line attribute in the parameters div, see what needs to be done
    for (var i = 0; i < arrLines.length; i++) {
      var string = arrLines[i];

      switch (string) {
        case "year0On":
          document.getElementById('year0').checked = 1;
          break;
        case "statsOn":
          document.getElementById('statFrame').checked = 0;
          break;
        case "skyboxOn":
          document.getElementById('skybox').checked = 1;
          break;
        case "allProgressbars":
          document.getElementById('allProgressbars').checked = 1;
          break;
        case "precipOff":
          //document.getElementById('precip').checked = 1;
          break;
          //case nothing, do nothing (error protection)
        case "":
          break;
        default:
          //workaroundy, but let's see if it's a year, if not, just toggle the element
          if (string.slice(0, 4) == "year") {
            //filter out the precip containers that have been generated off
            if (string.length < 12) {
              yearCounter += 1;
            }
          } else {
            if (document.getElementById(string)) document.getElementById(string).checked = 1;
          }
      } //end switch
    } //end for each line in the parameters div

    //set year values
    document.getElementById('yearNumber').innerHTML = (3 - yearCounter);
    //make sure that correct +/- arrows are displayed
    changeYearValueBy(0);
  }

  //assists in toggling year value up and down on the options page
  //  checks limits and toggles the up/down options off if needed
  function changeYearValueBy(amountToChange) {

    var currentNumber = Number(document.getElementById('yearNumber').innerHTML);
    currentNumber += amountToChange;

    //reset visibility, then turn off as needed
    document.getElementById('addYear').style.visibility = "visible";
    document.getElementById('subtractYear').style.visibility = "visible";
    //turning off to prevent users from exceeding
    if (currentNumber == maxYear) {
      document.getElementById('addYear').style.visibility = "hidden";
    } else if (currentNumber == 1) {
      document.getElementById('subtractYear').style.visibility = "hidden";
    }

    //alright now, let's put the year number back in the document
    document.getElementById('yearNumber').innerHTML = currentNumber;
  }

  //Toggles and allows the user to set the hotkeys
  //To add the hotkey to this list, do the following:
  //
  // 1.) Add the hotkey to hotkeyArr in helpersFE.js
  // 2.) Add the description of the hotkey in this html file
  // 3.) Format the if-statement for the hotkey appropriately so that each case can be used (where the hotkey is used)
  // 4.) Increase the last hkDiv element number by one in style_options.css so that the bottom is properly stylized

  function retrieveHotkeys() {
    if(document.getElementById("hotkeyAggregateTool").style.display == "none") {
      document.getElementById("hotkeyAggregateTool").style.display = "block";
      var curHotkeys = parent.giveHotkeys();
      for(var i = 1; i < curHotkeys.length+1; i++) {
        var tempIndex = i-1;
        var tempHotkey = document.createElement("div");
          tempHotkey.style.overflow = "auto";
          tempHotkey.id = "hk"+i;
          tempHotkey.className = "hkDivs";
          tempHotkey.innerHTML = hotkeyDescrip[i-1];
        var tempSpan = document.createElement("span");
          tempHotkey.appendChild(tempSpan);

        //****** This is dumb, but this needs to increase if more hotkeys are added, leave the arrow keys at the end of the array, need to change conditional below as well, ctrl f for "other spot to fix"
        var tempInput1;
      if(tempIndex>13){
        //arrows key in div
        tempInput1=document.createElement("div");
      }else{
        //hot key in input
        tempInput1 = document.createElement("INPUT");
      }
          tempInput1.id = "hki"+tempIndex+"e1";
          tempInput1.className = "hkInputs1";
          if(curHotkeys[i-1][0]==null){
            var tempChar = "N/A";
          } else {
            var tempChar = String.fromCharCode(curHotkeys[i-1][0]);
          }
          //arrow up keyboard key
          if(curHotkeys[i-1][0]==38){
            tempChar="↑";
          }
          //arrow down Keyboard key
          if(curHotkeys[i-1][0]==40){
            tempChar="↓";
          }
          //arrow left keyboard key
          if(curHotkeys[i-1][0]==37){
            tempChar="←";
          }

          //arrow right keyboard key
          if(curHotkeys[i-1][0]==39){
            tempChar="→";
          }

          // *** this is the other spot to fix if adding more hotkeys
          //hot keys without arrows key & available to change
          if(tempIndex<14){
          tempInput1.placeholder = tempChar;
          tempInput1.setAttribute("onkeyup","parent.setHotkey(this.value,"+tempIndex+",1)");
          tempInput1.setAttribute("onkeydown","this.value = this.value");

        }else{
        //arrow keys
        tempInput1.innerHTML=tempChar;
        }

      tempInput1.setAttribute("size","5");
      tempInput1.setAttribute("height","5");
      tempSpan.appendChild(tempInput1);


        // //Secondary col for hot key only
          if(curHotkeys[i-1][0]!=38&&curHotkeys[i-1][0]!=40&&curHotkeys[i-1][0]!=37&&curHotkeys[i-1][0]!=39){
            var tempInput2 = document.createElement("input");
              tempInput2.id = "hki"+tempIndex+"e2";
              tempInput2.className = "hkInputs2";
              if(curHotkeys[i-1][1]==null){
                tempChar = "N/A";
              } else {
                tempChar = String.fromCharCode(curHotkeys[i-1][1]);
              }
              tempInput2.placeholder = tempChar;
              tempInput2.setAttribute("type","text");
              tempInput2.setAttribute("onkeyup","parent.setHotkey(this.value,"+tempIndex+",2)");
              tempInput2.setAttribute("onkeydown","this.value = this.value");
              tempInput2.setAttribute("size","5");
              tempInput2.setAttribute("height","5");
              tempSpan.appendChild(tempInput2);
            }
            if(i%2==0) {
              tempHotkey.style.background = "#2d5986";
              tempInput1.style.background = "#2d5986";
              tempInput2.style.background = "#2d5986";
            } else {
              tempHotkey.style.background = "#0f4d70";
              tempInput1.style.background = "#0f4d70";
              tempInput2.style.background = "#0f4d70";
            }
        document.getElementById('hotkeySets').appendChild(tempHotkey);
      }
    } else {
      document.getElementById("hotkeyAggregateTool").style.display = "none";
      document.getElementById("hotkeySets").innerHTML = '';
    }
  }

  /*
  * In resetOptionsSelected is used to set all the options to false (original state).
  * The resetOptionSelected function was created for Issue 368. Reference Issue 368 for more information.
  */
  function resetOptionsSelected(){

    /*
    * Resets all options to false
    * First 23 are paint and hover ids,
    * The last two options are precipitation and application statistics option.
    * Revised on June 14, there are 26 checkboxes in total, we only need to set the 'checked' property to false
    */
    var allCheckboxes = $(':checkbox');
    for(var i = 0; i < allCheckboxes.length; ++i){
      // All the YIELD progress bars should be checked.
      if(i >= 31 && i <= 39 || i == 45){
        $(':checkbox')[i].checked = true;
      }
      else {
        $(':checkbox')[i].checked = false;
      }
      // if(i < 26){
      //   $(':checkbox')[i].checked = false;
      // }
      // if(i === 26){
      //   $('#precip.toggle').prop('checked', false);
      //   console.log($('#precip.toggle'));
      // }
      // if(i === 27){
      //   $('#statFrame.toggle').prop('checked', false);
      //   console.log($('#statFrame.toggle'));
      // }
    }

    //saves the current state of options
    saveCurrentOptionsState();

    //scroll page to top, so that next time options is loaded it starts there
    window.scrollTo(0, 0);

    savedOptions = true; //Sets the savedOption to false, this is to restart the new state, as clicking on instructor options for first time.
  }


  /*
  * In recordCurrentOptions the current status of the checkbox is recorded.
  * The purpose for this is that if someone had previous settings already saved then thought about changing those
  * settings, but changed their mind in the process then those changes would be undone.
  * For more information refer to Issue 362.
  */
  function recordCurrentOptions(){
    console.log("yess")
    // var currentSelection = document.getElementsByClassName('toggle');
    // We should get all the 'checkbox' elements instead of 'toogle' elements.
    var currentSelection = $(':checkbox');
    for(var i = 0; i < currentSelection.length; ++i){
      if(currentSelection[i].checked){
        selectedOptionsTrue.push(i);
      }
      else if(!currentSelection[i].checked){
        selectedOptionsFalse.push(i);
      }
    }
  }

  /*
  * In undoSelectedOptions it sets the entire checkbox, which is the Instructor Options menu,
  * to what was recorded in recordCurrentOptions.
  * The purpose for this is that if someone had previous settings already saved then thought about changing those
  * settings, but changed their mind in the process then those changes would be undone.
  * For more information refer to Issue 362.
  */
  function undoSelectedOptions() {

    if (parent.getTracking()) {
      parent.pushClick(0, parent.getStamp(), 109, 0, null);
    }

    /*
    * Iterate through all elements in selectedOptionsTrue and manually sets them to true, for being checked.
    */
    for(var i = 0; i < selectedOptionsTrue.length; ++i){
      var index = selectedOptionsTrue[i];
      $(':checkbox')[index].checked = true;

      // if(index < 27){
      //   $(':checkbox')[index].checked = true;
      // }
      // if(index === 26){
      //   $('#precip.toggle').prop('checked', true);
      // }
      // if(index === 27){
      //   $('#statFrame.toggle').prop('checked', true);
      // }
    }

    /*
    * Iterate through all elements in selectedOptionsFalse and manually sets them to false, for being checked.
    */
    for(var i = 0; i < selectedOptionsFalse.length; ++i){
      var index = selectedOptionsFalse[i];
      $(':checkbox')[index].checked = false;
      // if(index < 26){
      //   $(':checkbox')[index].checked = false;
      // }
      // if(index === 26){
      //   $('#precip.toggle').prop('checked', false);
      // }
      // if(index === 27){
      //   $('#statFrame.toggle').prop('checked', false);
      // }
    }
  }

  function checkIfSaved() {

    if(!savedOptions){

      /*
      * Resets all options to false
      * First 25 are paint and hover ids,
      * The last two options are precipitation and application statistics option.
      */
      var allCheckboxes = $(':checkbox');
      for(var i = 0; i < allCheckboxes.length; ++i){
        // All the YIELD progress bars should be checked.
        if(i >= 31 && i <= 39){
          $(':checkbox')[i].checked = true;
        }
        else {
          $(':checkbox')[i].checked = false;
        }
        // console.log('i =' + i +' : ' + $(':checkbox')[i].id);
        // if(i < 26){
        //   $(':checkbox')[i].checked = false;
        // }
        // if(i === 26){
        //   $('#precip.toggle').prop('checked', false);
        // }
        // if(i === 27){
        //   $('#statFrame.toggle').prop('checked', false);
        // }
      }

      //saves the current state of options
      saveCurrentOptionsState();

      //scroll page to top, so that next time options is loaded it starts there
      window.scrollTo(0, 0);
    }
  }

  function toggleHoverInfo(idNum) {

    var element = document.getElementById(progressbarIds[idNum] + "HoverInfo");
    if(element.style.display == "none"){
      var actualMinValue = parent.getRawValue(0, idNum);
      var actualMaxValue = parent.getRawValue(100, idNum);
      element.innerHTML = progressbarDescrip[idNum] + "<br>Min - Max: <strong>0 - 100%</strong>";
      if(idNum != 16){
        element.innerHTML += "<br>Actual Min - Actual Max: <br><strong>" + actualMinValue + " - " + actualMaxValue +"</strong>";
      }
      if(idNum == 0 || idNum == 1){
        element.innerHTML += "<strong> pts</strong>";
      }
      else if(idNum == 2){
        element.innerHTML += "<strong> Mg</strong><br><strong>" + parent.englishToMetric(idNum,actualMinValue) + " - " + parent.englishToMetric(idNum,actualMaxValue) + " tons</strong>";
      }
      else if(idNum == 3 || idNum == 5 || idNum == 6 || idNum == 9 || idNum == 11 || idNum == 12 || idNum == 13 || idNum == 15){
        element.innerHTML += "<strong> tons</strong><br><strong>" + parent.englishToMetric(idNum,actualMinValue) + " - " + parent.englishToMetric(idNum,actualMaxValue) + " Mg</strong>" ;
      }
      else if(idNum == 4){
        element.innerHTML += "<strong> PPM</strong><br><strong>" + parent.englishToMetric(idNum,actualMinValue) + " - " + parent.englishToMetric(idNum,actualMaxValue) + " Mg/L</strong>";
      }
      else if(idNum == 7 || idNum == 8){
        element.innerHTML += "<strong> bu</strong><br><strong>" + parent.englishToMetric(idNum,actualMinValue) + " - " + parent.englishToMetric(idNum,actualMaxValue) + " Mg</strong>";
      }

      else if(idNum == 10){
        element.innerHTML += "<strong> animals</strong>";
      }

      else if(idNum == 14){
        element.innerHTML += "<strong> board-ft</strong><br><strong>" + parent.englishToMetric(idNum,actualMinValue) + " - " + parent.englishToMetric(idNum,actualMaxValue) + " M^3</strong>";
      }

      element.style.display = "block";
    }
    else {
      element.innerHTML = "";
      element.style.display = "none";
    }
  }

  /*
    Dynamically generate a table for customizing min and max values for all progress bars
    If additional progress bars are added, don't need to do anything with this function, just add
    the additional progress bar id into progressbarDescrip array.
  */
  function retrieveMinMaxValues() {
    unitType = document.getElementById("englishButton").className == "buttonSelected" ? "English" : "Metric";

    if(document.getElementById("progressBarAggregateTool").style.display == "none") {
      document.getElementById("progressBarAggregateTool").style.display = "block";
      // add table header
      var titleEle = document.createElement("div");
      titleEle.style.overflow = "auto";
      titleEle.id = "itemTitles";
      titleEle.className = "progressbarItems";
      titleEle.innerHTML = " Category:";
      var titleSpan = document.createElement("span");
      titleEle.appendChild(titleSpan);
      var classNames = ["minInput", "maxInput","actualMinInput","actualMaxInput"];
      var ids = ["minTitle", "maxTitle","actualMinTitle","actualMaxTitle"];
      var titles = ["Min", "Max","Actual&nbsp;Min","Actual&nbsp;Max"];
      for(var i = 0; i < titles.length; i++){
        var inputEle = document.createElement("span");
        inputEle.className = classNames[i];
        inputEle.id = ids[i];
        inputEle.innerHTML = titles[i];
        inputEle.setAttribute("size","5");
        inputEle.setAttribute("height","5");
        inputEle.style.background = "#2d5986";
        titleSpan.appendChild(inputEle);

      }

      titleEle.style.background = "#2d5986";
      document.getElementById('progressBarSets').appendChild(titleEle);
      // finished table header

      // iterate all the progress bar elements, generate one row which contains the title, text inputs for each progress bar
      for(var i = 0; i < progressbarDescrip.length; i++) {
        var progressbarElement = document.createElement("div");
          progressbarElement.style.overflow = "auto";
          progressbarElement.id = "pb"+i;
          progressbarElement.className = "progressbarItems";
          progressbarElement.innerHTML = progressbarDescrip[i];
          progressbarElement.setAttribute("onmouseover", "toggleHoverInfo(" + i + ")");
          progressbarElement.setAttribute("onmouseout", "toggleHoverInfo(" + i + ")");
        var tempSpan = document.createElement("span");
          progressbarElement.appendChild(tempSpan);

        var minValue = parseFloat(parent.document.getElementById(progressbarIds[i]).childNodes[3].childNodes[3].style.left);
        var maxValue = parseFloat(parent.document.getElementById(progressbarIds[i]).childNodes[3].childNodes[5].style.left);
        var actualMinValue = parent.getRawValue(minValue, i);
        var actualMaxValue = parent.getRawValue(maxValue, i);
        // Carbon correction
        if(i == 2) {
          actualMinValue = Math.round(actualMinValue / 0.90718474 * 100) / 100;
          actualMaxValue = Math.round(actualMaxValue / 0.90718474 * 100) / 100;
        }
        if(minValue < 0){
          minValue = "NaN";
          actualMinValue = "NaN";
        }

        if(maxValue > 100) {
          maxValue = "NaN";
          actualMaxValue = "NaN";
        }
        // add min value text input element
        var minInput = document.createElement("input");
          minInput.id = "min" + i;
          minInput.className = "minInput";
          // console.log(parent.document.getElementById(progressbarIds[i]));
          minInput.placeholder = minValue;
          // console.log(progressbarIds[i]);
          if(i != 16){
            //use onblur to have autofill occur after the cell is clicked off
            minInput.setAttribute("onblur","parent.setProgressbarMinMaxValues('" + progressbarIds[i] + "', 'min', convertAndUpdate('"+progressbarIds[i]+"','min', this.value))");
          }
          else{
            minInput.setAttribute("onkeyup","parent.setProgressbarMinMaxValues('" + progressbarIds[i] + "', 'min', this.value)");
          }
          minInput.setAttribute("onkeydown","this.value = this.value");
          minInput.setAttribute("onfocusout","setPlaceholderValue('min" + i + "',this.value)");
          minInput.setAttribute("size","5");
          minInput.setAttribute("height","5");
          //TODO - adding Tab Index values to fix Min value bug.
          minInput.setAttribute("tabIndex", "1");

        var unitElement = document.createElement("span");
          unitElement.className = "minUnit";
          unitElement.innerHTML = "%";

        tempSpan.appendChild(minInput);
        tempSpan.appendChild(unitElement);
        // add max value text input element
        var maxInput = document.createElement("input");
          maxInput.id = "max" + i;
          maxInput.className = "maxInput";
          maxInput.placeholder = maxValue;
          maxInput.setAttribute("type","text");
          if(i != 16){
            //use onblur to have autofill occur after the cell is clicked off
            maxInput.setAttribute("onblur","parent.setProgressbarMinMaxValues('" + progressbarIds[i] + "', 'max', convertAndUpdate('"+progressbarIds[i]+"','max', this.value))");
          }
          else{
            maxInput.setAttribute("onkeyup","parent.setProgressbarMinMaxValues('" + progressbarIds[i] + "', 'max', this.value)");
          }
          maxInput.setAttribute("onkeydown","this.value = this.value");
          maxInput.setAttribute("onfocusout","setPlaceholderValue('max" + i + "',this.value)");
          maxInput.setAttribute("size","5");
          maxInput.setAttribute("height","5");
        //TODO
        maxInput.setAttribute("tabIndex", "2");

        unitElement = document.createElement("span");
          unitElement.className = "maxUnit";
          unitElement.innerHTML = "%";

        tempSpan.appendChild(maxInput);
        tempSpan.appendChild(unitElement);
        // add actualMin value text input element

        var actualMinInput = document.createElement("input");
          actualMinInput.id = "actualMin" + i;
          actualMinInput.className = "actualMinInput";
          actualMinInput.placeholder = actualMinValue;
          //use onblur to have autofill occur after the cell is clicked off
          actualMinInput.setAttribute("onblur","parent.setProgressbarMinMaxValues('" + progressbarIds[i] + "', 'min', convertAndUpdate('"+progressbarIds[i]+"','actualMin', this.value))");
          actualMinInput.setAttribute("onkeydown","this.value = this.value");
          actualMinInput.setAttribute("onfocusout","setPlaceholderValue('actualMin" + i + "',this.value)");
          actualMinInput.setAttribute("size","5");
          actualMinInput.setAttribute("height","5");
        //TODO
        actualMinInput.setAttribute("tabIndex", "3");

        unitElement = document.createElement("span");
          unitElement.id = "actualMin" + i + "Unit";
          unitElement.className = "actualMinUnit";

          // don't need an Actual Min text input box for Total Sum Yields.
          if(i != 16){
            tempSpan.appendChild(actualMinInput);
            tempSpan.appendChild(unitElement);
          }

        // add actualMin value text input element
        var actualMaxInput = document.createElement("input");
          actualMaxInput.id = "actualMax" + i;
          actualMaxInput.className = "actualMaxInput";
          actualMaxInput.placeholder = actualMaxValue;
          //use onblur to have autofill occur after the cell is clicked off
          actualMaxInput.setAttribute("onblur","parent.setProgressbarMinMaxValues('" + progressbarIds[i] + "', 'max', convertAndUpdate('"+progressbarIds[i]+"','actualMax', this.value))");
          actualMaxInput.setAttribute("onkeydown","this.value = this.value");
          actualMaxInput.setAttribute("onfocusout","setPlaceholderValue('actualMax" + i + "',this.value)");
          actualMaxInput.setAttribute("size","5");
          actualMaxInput.setAttribute("height","5");
        //TODO
        actualMaxInput.setAttribute("tabIndex", "4");
          actualMaxInput.innerHTML = "tons";
        var unitElement1 = document.createElement("span");
          unitElement1.id = "actualMax" + i + "Unit";
          unitElement1.className = "actualMaxUnit";
          // unitElement1.innerHTML = "tons";
        // don't need an Actual Max text input box for Total Sum Yields.
        if(i != 16){
          tempSpan.appendChild(actualMaxInput);
          tempSpan.appendChild(unitElement1);
        }

        if(i == 0 || i == 1){
          unitElement.innerHTML = "pts";
          unitElement1.innerHTML = "pts";
        }
        else if(i == 2 || i == 3 || i == 5 || i == 6 || i == 9 || i == 11 || i == 12 || i == 13 || i == 15){
          unitElement.innerHTML = "tons";
          unitElement1.innerHTML = "tons";
        }
        else if(i == 4){
          unitElement.innerHTML = "PPM";
          unitElement1.innerHTML = "PPM";
        }
        else if(i == 7 || i == 8){
          unitElement.innerHTML = "bu";
          unitElement1.innerHTML = "bu";
        }
        else if(i == 10){
          unitElement.innerHTML = "animals";
          unitElement1.innerHTML = "animals";
        }
        else if (i == 14){
          unitElement.innerHTML = "board-ft";
          unitElement1.innerHTML = "board-ft";
        }

        if(i % 2 != 0) {
          progressbarElement.style.background = "#2d5986";
          minInput.style.background = "#2d5986";
          maxInput.style.background = "#2d5986";
          actualMinInput.style.background = "#2d5986";
          actualMaxInput.style.background = "#2d5986";
        } else {
          progressbarElement.style.background = "#0f4d70";
          minInput.style.background = "#0f4d70";
          maxInput.style.background = "#0f4d70";
          actualMinInput.style.background = "#0f4d70";
          actualMaxInput.style.background = "#0f4d70";
        }

        var hoverElements = document.createElement("div");
        hoverElements.className = "hoverInfo";
        hoverElements.id = progressbarIds[i] + "HoverInfo";
        hoverElements.style.display = "none";
        document.getElementById('progressBarSets').appendChild(hoverElements);
        document.getElementById('progressBarSets').appendChild(progressbarElement);
      }

      if(unitType == "Metric"){
        // This is a trick, we set the english button to be seleted while the metric button to be not, so that we can use switchUnits function.
        document.getElementById("englishButton").className = "buttonSelected";
        document.getElementById("metricButton").className = "buttonUnselected";
        switchUnits("Metric");
      }
    } else {
      document.getElementById("progressBarAggregateTool").style.display = "none";
      document.getElementById("progressBarSets").innerHTML = '';
    }
  }

  // Set placeholder value, when user enter a numerical value in the input box, we set placehoder to be the input value and then set the input value to be "".
  // So that in the min-max value setting table, we're able to see real-time update effect.
  function setPlaceholderValue(id,value) {
    var siblingId;
    var siblingValue;
    var isValid = false;
    //grab the id number from the id
    var idNum = "";
    for(var i = 0; i < id.length; i++){
      if(!isNaN(id.charAt(i))){
        idNum += id.charAt(i);
      }
    }

    //since 3-6 are reversed min/max we need to adjust the conditons
    if(idNum != 3 && idNum != 4 && idNum != 5 && idNum != 6){
      if(id.indexOf("min") != -1){
        siblingId = "max" + id.charAt(id.length - 1);
        siblingValue = parseFloat(document.getElementById(siblingId).placeholder);
        if((!isNaN(siblingValue) && siblingValue >= value) || isNaN(siblingValue))
          isValid = true;
      }
      if(id.indexOf("max") != -1){
        siblingId = "min" + id.charAt(id.length - 1);
        siblingValue = parseFloat(document.getElementById(siblingId).placeholder);
        if((!isNaN(siblingValue) && siblingValue <= value) || isNaN(siblingValue))
          isValid = true;
      }
      if(id.indexOf("actualMin") != -1){
        siblingId = "actualMax" + id.charAt(id.length - 1);
        siblingValue = parseFloat(document.getElementById(siblingId).placeholder);
        if((!isNaN(siblingValue) && siblingValue >= value) || isNaN(siblingValue))
          isValid = true;
      }
      if(id.indexOf("actualMax") != -1){
        siblingId = "actualMin" + id.charAt(id.length - 1);
        siblingValue = parseFloat(document.getElementById(siblingId).placeholder);
        if((!isNaN(siblingValue) && siblingValue <= value) || isNaN(siblingValue))
          isValid = true;
      }
      if(isNaN(value) || value == "" ){
        isValid = false;
      }
    }
    else{
      if(id.indexOf("min") != -1){
        siblingId = "max" + id.charAt(id.length - 1);
        siblingValue = parseFloat(document.getElementById(siblingId).placeholder);
        if((!isNaN(siblingValue) && siblingValue >= value) || isNaN(siblingValue))
          isValid = true;
      }
      if(id.indexOf("max") != -1){
        siblingId = "min" + id.charAt(id.length - 1);
        siblingValue = parseFloat(document.getElementById(siblingId).placeholder);
        if((!isNaN(siblingValue) && siblingValue <= value) || isNaN(siblingValue))
          isValid = true;
      }
      if(id.indexOf("actualMin") != -1){
        siblingId = "actualMax" + id.charAt(id.length - 1);
        siblingValue = parseFloat(document.getElementById(siblingId).placeholder);
        if((!isNaN(siblingValue) && siblingValue <= value) || isNaN(siblingValue))
          isValid = true;
      }
      if(id.indexOf("actualMax") != -1){
        siblingId = "actualMin" + id.charAt(id.length - 1);
        siblingValue = parseFloat(document.getElementById(siblingId).placeholder);
        if((!isNaN(siblingValue) && siblingValue >= value) || isNaN(siblingValue))
          isValid = true;
      }
      if(isNaN(value) || value == "" ){
        isValid = false;
      }
    }

    //find min and max val for raw values
    var minVal = parent.getRawValue(0, idNum);
    var maxVal = parent.getRawValue(100, idNum);

    if(isValid){
      if(id.indexOf("min") != -1 || id.indexOf("max") != -1){
        if(value < 0){
          value = 0;
          document.getElementById("actualMin" + idNum).placeholder = minVal;
        }
        else if(value > 100){
          value = 100;
          document.getElementById("actualMax" + idNum).placeholder = maxVal;
        }
      document.getElementById(id).placeholder = value;
      document.getElementById(id).value = "";
      }
      else if(id.indexOf("actualMin") != -1 || id.indexOf("actualMax") != -1){
        /*if(idNum == 3 || idNum == 4 || idNum == 5 || idNum == 6){
          var temp = maxVal;
          maxVal = minVal;
          minVal = temp;
        }*/
        if(value < minVal){
          value = minVal;
          document.getElementById("min" + idNum).placeholder = 0;
        }
        else if(value > maxVal){
          value = maxVal;
          document.getElementById("max" + idNum).placeholder = 100;
        }
        document.getElementById(id).placeholder = value;
        document.getElementById(id).value = "";
      }
    }
    else {
      document.getElementById(id).value = "";
    }
  }

  // Convert 0 - 100 eco score into raw value Or convert raw value into 0 - 100 value
  // When user enter Min/Max values in progress bar, Actual Min/Actual Max values can be real-time updated, vice versa.

  function convertAndUpdate(id, option, value) {
    var idNum = progressbarIds.indexOf(id);
    var minVal = parent.getRawValue(0, idNum);
    var maxVal = parent.getRawValue(100, idNum);

    if(idNum == 16) return;
    if(idNum == 3 || idNum == 4 || idNum == 5 || idNum == 6){
      var temp = maxVal;
      maxVal = minVal;
      minVal = temp;
    }
    if(option == "min" || option == "max"){
      // get english raw value
      var rawValue = parent.getRawValue(value, idNum);
      // Carbon correction
      if(idNum == 2) {
        rawValue = Math.round(rawValue / 0.90718474 * 10) / 10;
      }
      if(unitType == "Metric"){
        rawValue = parent.englishToMetric(idNum, rawValue);
      }

      if(option == "min"){
        // Set actualMin raw value
        var val = parseFloat(document.getElementById("max" + idNum).placeholder);
        if(value <= val || isNaN(val)){
          if(rawValue <= maxVal && rawValue >= minVal && value != ""){
              document.getElementById("actualMin" + idNum).placeholder = rawValue;
          }
        }
      }
      else {
        // Set actualMax raw value
        var val = parseFloat(document.getElementById("min" + idNum).placeholder);
        if(value >= val || isNaN(val)){
          if(rawValue <= maxVal && rawValue >= minVal && value != ""){
            document.getElementById("actualMax" + idNum).placeholder = rawValue;
          }
        }
      }
      // return the min/max value since we will need it as a parameter in setProgressbarMinMaxValues function.
      return value;
    }
    else if(option == "actualMin" || option == "actualMax"){
      if(unitType == "Metric"){
        value = parent.metricToEnglish(idNum, value);
      }
      var minOrMaxValue = Math.round(getScores(idNum, value) * 100) / 100;
      if(option == "actualMin"){
        // Set 0 - 100 Min value based on the raw value
        var val = parseFloat(document.getElementById("actualMax" + idNum).placeholder);
        if(idNum != 3 && idNum != 4 && idNum != 5 && idNum != 6){
          if(value <= val || isNaN(val)){
            if(value <= maxVal && value >= minVal && value != ""){
              document.getElementById("min" + idNum).placeholder = minOrMaxValue;
            }
          }
        }
        else{
          if(value >= val || isNaN(val)){
            if(value <= maxVal && value >= minVal && value != ""){
              document.getElementById("min" +idNum).placeholder = minOrMaxValue;
            }
          }
        }
      }
      else {
        // Set 0 - 100 Max value based on the raw value
        var val = parseFloat(document.getElementById("actualMin" + idNum).placeholder);
        if(idNum != 3 && idNum != 4 && idNum != 5 && idNum != 6){
          if(value >= val || isNaN(val)){
            if(value <= maxVal && value >= minVal && value != ""){
              document.getElementById("max" + idNum).placeholder = minOrMaxValue;
            }
          }
        }
        else {
          if(value <= val || isNaN(val)){
            if(value <= maxVal && value >= minVal && value != ""){
              document.getElementById("max" + idNum).placeholder = minOrMaxValue;
            }
          }
        }
      }
      // return the min/max value since we will need it as a parameter in setProgressbarMinMaxValues function.
      return minOrMaxValue;
    }

  }

  /*
    Calculate ecosystem scores given raw values.

  */
  function getScores(idNum, rawValue) {
    if(idNum == 0 || idNum == 1) return rawValue * 10;
    // calculate Carbon score
    else if(idNum == 2) {
      return 100 * ((rawValue - parent.boardData[parent.currentBoard].minimums.carbonMin) / (parent.boardData[parent.currentBoard].maximums.carbonMax - parent.boardData[parent.currentBoard].minimums.carbonMin));
    }
    // calculate Gross Erosion score
    else if(idNum == 3) {
      return 100 * ((parent.boardData[parent.currentBoard].maximums.erosionMax - rawValue) / (parent.boardData[parent.currentBoard].maximums.erosionMax - parent.boardData[parent.currentBoard].minimums.erosionMin));
    }
    // calculate Nitrate score
    else if(idNum == 4) {
      return 100 * ((parent.boardData[parent.currentBoard].maximums.nitrateMax - rawValue) / (parent.boardData[parent.currentBoard].maximums.nitrateMax - parent.boardData[parent.currentBoard].minimums.nitrateMin));
    }
    // calculate Phosphorus score
    else if(idNum == 5) {
      return 100 * ((parent.boardData[parent.currentBoard].maximums.phosphorusMax - rawValue) / (parent.boardData[parent.currentBoard].maximums.phosphorusMax - parent.boardData[parent.currentBoard].minimums.phosphorusMin));
    }
    // calculate Sediment score
    else if(idNum == 6) {
      return 100 * ((parent.boardData[parent.currentBoard].maximums.sedimentMax - rawValue) / (parent.boardData[parent.currentBoard].maximums.sedimentMax - parent.boardData[parent.currentBoard].minimums.sedimentMin));
    }
    // calculate Corn Grain score
    else if(idNum == 7) {
      return 100 * rawValue / parent.boardData[parent.currentBoard].maximums.cornMax;
    }
    // calculate Soybeans score
    else if(idNum == 8) {
      return 100 * rawValue / parent.boardData[parent.currentBoard].maximums.soybeanMax;
    }
    // calculate Mixed Fruits and Vegetables score
    else if(idNum == 9) {
      return 100 * rawValue / parent.boardData[parent.currentBoard].maximums.mixedFruitsAndVegetablesMax;
    }
    // calculate Cattle score
    else if(idNum == 10) {
      return 100 * rawValue / parent.boardData[parent.currentBoard].maximums.cattleMax;
    }

    // calculate Alfalfa Hay score
    else if(idNum == 11) {
      return 100 * rawValue / parent.boardData[parent.currentBoard].maximums.alfalfaMax;
    }
    // calculate Grass Hay score
    else if(idNum == 12) {
      return 100 * rawValue / parent.boardData[parent.currentBoard].maximums.grassHayMax;
    }
    // calculate Switchgrass Biomass score
    else if(idNum == 13) {
      return 100 * rawValue / parent.boardData[parent.currentBoard].maximums.switchgrassMax;
    }
    // calculate Wood score
    else if(idNum == 14) {
      return 100 * rawValue / parent.boardData[parent.currentBoard].maximums.woodMax;
    }

    // calculate Short Rotation Woody Biomass score
    else if(idNum == 15) {
      return 100 * rawValue / parent.boardData[parent.currentBoard].maximums.shortRotationWoodyBiomassMax;
    }


  }

  // In switchUnits function, the 'type' parameter has two potential values which are "English" and "Metric"
  // The purpose of this function is showing desired units (English or Metric) in the Min/Max table.
  // We also convert the values from one unit to the other if there are any in the table.
  function switchUnits(type) {
    var englishButton = document.getElementById("englishButton");
    var metricButton = document.getElementById("metricButton");
    if(type == 'English'){
      // Only switch units when english isn't currently selected.
      if(englishButton.className != "buttonSelected"){
        englishButton.className = "buttonSelected";
        metricButton.className = "buttonUnselected";
        unitType = "English";
        var tempArr = ["actualMin", "actualMax"];
        for(var i = 2; i < progressbarIds.length - 1; i++){
          for(var j = 0; j < tempArr.length; j++){
            var unitElement = document.getElementById(tempArr[j] + i + "Unit");
            var actualElement = document.getElementById(tempArr[j] + i);
            var metricUnit = parseFloat(actualElement.placeholder);
            actualElement.placeholder = parent.metricToEnglish(i, metricUnit);
            switch (i){
              case 2: case 3: case 5: case 6: case 9:
              case 11: case 12: case 13: case 15:
                unitElement.innerHTML = "tons";
                break;
              case 4:
                unitElement.innerHTML = "PPM";
                break;
              case 7: case 8:
                unitElement.innerHTML = "bu";
                break;
              case 14:
                unitElement.innerHTML = "board-ft";
                break;
              default:
                break;
            }

          }
        }
      }
    }
    else {
      // Only switch units when metric unit isn't currently selected
      if(metricButton.className != "buttonSelected"){
        metricButton.className = "buttonSelected";
        englishButton.className = "buttonUnselected";
        unitType = "Metric";
        var tempArr = ["actualMin", "actualMax"];
        for(var i = 2; i < progressbarIds.length - 1; i++){
          for(var j = 0; j < tempArr.length; j++){
            var unitElement = document.getElementById(tempArr[j] + i + "Unit");
            var actualElement = document.getElementById(tempArr[j] + i);
            var englishUnit = parseFloat(actualElement.placeholder);
            actualElement.placeholder = parent.englishToMetric(i, englishUnit);
            switch (i){
              case 2: case 3: case 5: case 6: case 9:
              case 11: case 12: case 13: case 15:
                unitElement.innerHTML = "Mg";
                break;
              case 4:
                unitElement.innerHTML = "Mg/L";
                break;
              case 7: case 8:
                unitElement.innerHTML = "Mg";
                break;
              case 14:
                unitElement.innerHTML = "M^3";
                break;
              default:
                break;
            }

          }
        }
      }
    }
  }
