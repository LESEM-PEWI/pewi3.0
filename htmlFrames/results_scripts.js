/**
 * @Date:   2017-05-23T15:09:56-05:00
 * @Last modified time: 2017-05-31T16:52:59-05:00
 */



  //global boolean for first pie chart, default to list
  var isLandPlotOnCategories = false;

  //toggleToTab changes via javascript the part of the the page which is displayed to
  // users, giving the appearance of two separate pages
  function toggleToTab(tabNumber) {

    //reset all elements to original styling
    document.getElementById('graphics').style.display = "none";
    document.getElementById('numbers').style.display = "none";
    document.getElementById('tab1').className = "tab";
    document.getElementById('tab2').className = "tab";
    //then update the selected tab appropriately
    if (tabNumber == 1) {
      document.getElementById('graphics').style.display = "block";
      document.getElementById('tab1').className = "tabSelected";
      if(parent.getTracking()) {
        parent.pushClick(0,parent.getStamp(),58,0,null);
      }
    } else if (tabNumber == 2) {
      document.getElementById('numbers').style.display = "block";
      document.getElementById('tab2').className = "tabSelected";
      if(parent.getTracking()) {
        parent.pushClick(0,parent.getStamp(),59,0,null);
      }
    } //end else if block
  } //end toggleToTab

  //toggleYearForLandPlotBy(), examines the current year and the limits
  // up and down arrow are turned off if one or both present the opportunity
  // for surpassing an upper or lower limit.
  function toggleYearForLandPlotBy(yearsToChange) {
    //grab info from div, since passing data between frames is difficult
    var upTo = Number(document.getElementById('upTo').innerHTML);
    var year = Number(document.getElementById('landYear').innerHTML);

    year = year + yearsToChange;

    //reset functionality
    document.getElementById('yearUpLand').className = "upArrow";
    document.getElementById('yearUpLand').onclick = function() {
      changeLandPieBy(1);
    };
    document.getElementById('yearDownLand').className = "downArrow";
    document.getElementById('yearDownLand').onclick = function() {
      changeLandPieBy(-1);
    };
    //then if one of the limits have been reached, turn off that toggle
    if (year == upTo) {
      document.getElementById('yearUpLand').className = "upArrowDisabled";
      document.getElementById('yearUpLand').onclick = function() {};

    }
    //cannot be an else if, in the case where upTo == 1
    if (year == 1) {
      document.getElementById('yearDownLand').className = "downArrowDisabled";
      document.getElementById('yearDownLand').onclick = function() {};
    }

    return year;
  } //end toggleYearForLandPlotBy()

  //changeLandPieBy toggles the year and then calls the pie graph function
  function changeLandPieBy(numberOfYears) {
    //parent is index.html
    //resultsDisplay.js
    parent.drawD3LandPieChart(toggleYearForLandPlotBy(numberOfYears), isLandPlotOnCategories);
  } //end changeLandPieBy()

  //change main pie chart from landList to Categories List
  function toggleCategoriesPie(toggleSelectionValue) {
    //toggle necessary main page items
    if (toggleSelectionValue == 1) {
      document.getElementById('toggleYearPie').innerHTML = "To List";
      document.getElementById('toggleYearPie').onclick = function() {
        toggleCategoriesPie(0)
      };
      isLandPlotOnCategories = true;
    } else {
      document.getElementById('toggleYearPie').innerHTML = "To Categories";
      document.getElementById('toggleYearPie').onclick = function() {
        toggleCategoriesPie(1)
      };
      isLandPlotOnCategories = false;
    }
    //then regenerate pie chart
    changeLandPieBy(0);
  } //end toggleCategoriesPie()

  //this changes the pie back to default listing of land usage
  //  making it not possible for users to become reliant on categories
  function refreshPie() {
    document.getElementById('toggleYearPie').innerHTML = "To Categories";
    document.getElementById('toggleYearPie').onclick = function() {
      toggleCategoriesPie(1)
    };
    isLandPlotOnCategories = false;
  } //end refreshPie()


  //===============
  //  DEPRECATED
  //===============

  //hey ESI stands for ecosystem indicators
  //this function is the logical equivalent of the toggle Years for Land Plot
  // They were separated because these values should not be interdependent
  // inner workings are about the same though
  function toggleYearForESIAsterBy(yearsToChange) {
    //get limits from page store. sneakily mind you...
    var upTo = Number(document.getElementById('upTo').innerHTML);
    var currentYearOfPlot = Number(document.getElementById('ecoYear').innerHTML);

    currentYearOfPlot += yearsToChange;
    //reset functionality and styling
    document.getElementById('yearUpESI').className = "upArrow";
    document.getElementById('yearUpESI').onclick = function() {
      changeESIAsterBy(1);
    };
    document.getElementById('yearDownESI').className = "downArrow";
    document.getElementById('yearDownESI').onclick = function() {
      changeESIAsterBy(-1);
    };
    //now if there's a limit that were pushing up against, let's take
    // that toggle out so users don't slide right past it
    if (currentYearOfPlot == upTo) {
      document.getElementById('yearUpESI').className = "upArrowDisabled";
      document.getElementById('yearUpESI').onclick = function() {};
    }
    // although [else if] would be nice, it is not feasible here, since there is the case
    //   were upTo = 1
    if (currentYearOfPlot == 1) {
      document.getElementById('yearDownESI').className = "downArrowDisabled";
      document.getElementById('yearDownESI').onclick = function() {};
    }
    return currentYearOfPlot;
  } //end toggleYearOfESIAsterBy

  //change ESIAsterBy toggles the values for the aster plot and then
  //  requests that it be redrawn by parent
  function changeESIAsterBy(numberOfYearsToChange) {
    //index.html
    parent.drawEcosystemIndicatorsDisplay(toggleYearForESIAsterBy(numberOfYearsToChange));
  } //end changeESIAsterBy


  //===============
  // END DEPRECATED
  //===============

  //here, we toggle the plot of a particular year on or off based on the state
  //  of the checkbox
  function radarPlotYearToggle(yearToToggle) {
    //if the checkbox is now not checked
    if (!(document.getElementById('checkboxYear' + yearToToggle).checked)) {
      //remove that graph
      window.top.removeYearFromRadar(yearToToggle);
    }
    //else the checkbox is now checked
    else {
      //so make sure to add the graph back
      window.top.addBackYearToRadar(yearToToggle);
    } //end else/if group
  } //end radarPlotYearToggle()

  //this function is nearly identical to the similarly named one above,
  //  except the appropriate checkbox id has been updated for the yield plot
  function yieldRadarPlotYearToggle(yearToToggle) {
    if (!(document.getElementById('yieldCheckboxYear' + yearToToggle).checked)) {
      window.top.removeYearFromYieldRadar(yearToToggle);
    } else {
      window.top.addBackYearToYieldRadar(yearToToggle);
    }
  } //end yieldRadarPlotYearToggle()

  //toggleYearCheckboxes() grabs the information on how many years have been calculated
  //  from the frame in the page. This info is updated by the parent frame, which has access to
  //  that information.
  // Then, if we've only calculated 1 year, make sure the checkboxes for years 2 and 3 are
  //  not displayed.
  //This function is used for both radar plots
  // function toggleYearCheckboxes() {
  //   var upTo = Number(document.getElementById('upTo').innerHTML);
  //   var yearMax = 3 //for generality, in case more years are added later;
  //
  //   //fist toggle all of the checkboxes on and checked
  //   for (var y = 1; y <= yearMax; y++) {
  //     document.getElementById('checkboxYear' + y).style.visibility = "visible";
  //     document.getElementById('checkboxYear' + y).checked = true;
  //     document.getElementById('yieldCheckboxYear' + y).style.visibility = "visible";
  //     document.getElementById('yieldCheckboxYear' + y).checked = true;
  //   } //end for
  //
  //   //then, remove the ones for years that don't exist yet
  //   while (yearMax - upTo > 0) {
  //     document.getElementById('checkboxYear' + yearMax).style.visibility = "hidden";
  //     document.getElementById('yieldCheckboxYear' + yearMax).style.visibility = "hidden";
  //     yearMax -= 1;
  //   } //end while
  // } //end toggleYearCheckboxes()
