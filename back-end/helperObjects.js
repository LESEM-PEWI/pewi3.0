/*
Constructed in June 2016 as an object focused approach to calculation methods based on
  code from pewi v2.0.

C. Labuzzetta
N. Hagen

*/


//######################################################################################
//######################################################################################
// For the windows.frames[] variables, they are in fact iframe elements in index.html page, to learn what index is responsible for what iframe,
// we can type window.frames in the browser console window to find out.

//Creation of LandUseType Object
//This object serves to translate the values stored as land types into readable code
//Use this for comparisons and assignments

var LandUseType = {

  none: 0,
  conventionalCorn: 1,
  conservationCorn: 2,
  conventionalSoybean: 3,
  conservationSoybean: 4,
  alfalfa: 5,
  permanentPasture: 6,
  rotationalGrazing: 7,
  grassHay: 8,
  prairie: 9,
  conservationForest: 10,
  conventionalForest: 11,
  switchgrass: 12,
  shortRotationWoodyBioenergy: 13,
  wetland: 14,
  mixedFruitsVegetables: 15,

  getType: function(type) {

    switch (type) {
      case 0:
        return "none";
      case 1:
        return "conventionalCorn";
      case 2:
        return "conservationCorn";
      case 3:
        return "conventionalSoybean";
      case 4:
        return "conservationSoybean";
      case 5:
        return "alfalfa";
      case 6:
        return "permanentPasture";
      case 7:
        return "rotationalGrazing";
      case 8:
        return "grassHay";
      case 9:
        return "prairie";
      case 10:
        return "conservationForest";
      case 11:
        return "conventionalForest";
      case 12:
        return "switchgrass";
      case 13:
        return "shortRotationWoodyBioenergy";
      case 14:
        return "wetland";
      case 15:
        return "mixedFruitsVegetables";
      default:
        return "NOT FOUND";
    } //end switch
  }, //end getType

  getPrintFriendlyType: function(type) {
    switch (type) {
      case 0:
        return "None";
      case 1:
        return "Conventional Corn";
      case 2:
        return "Conservation Corn";
      case 3:
        return "Conventional Soybean";
      case 4:
        return "Conservation Soybean";
      case 5:
        return "Alfalfa";
      case 6:
        return "Permanent Pasture";
      case 7:
        return "Rotational Grazing";
      case 8:
        return "Grass Hay";
      case 9:
        return "Prairie";
      case 10:
        return "Conservation Forest";
      case 11:
        return "Conventional Forest";
      case 12:
        return "Switchgrass";
      case 13:
        return "Short Rotation Woody Bioenergy";
      case 14:
        return "Wetland";
      case 15:
        return "Mixed Fruits and Vegetables";
      default:
        return "NOT FOUND";
    } //end switch

  },

  getNumericalType: function(type)
  {
      switch (type) {
        case "None":
          return 0;
        case "Conventional Corn":
          return 1;
        case "Conservation Corn":
          return 2;
        case "Conventional Soybean":
          return 3;
        case "Conservation Soybean":
          return 4;
        case "Alfalfa":
          return 5;
        case "Permanent Pasture":
          return 6;
        case "Rotational Grazing":
          return 7;
        case "Grass Hay":
          return 8;
        case "Prairie":
          return 9;
        case "Conservation Forest":
          return 10;
        case "Convential Forest":
          return 11;
        case "Switchgrass":
          return 12;
        case "Short Rotation Woody Bioenergy":
          return 13;
        case "Wetland":
          return 14;
        case "Mixed Fruits and Vegetables":
          return 15;
        default:
          return "NOT FOUND";
    }
  }



};
//end definition of landUseType


//######################################################################################
//######################################################################################


//Function to construct a click object
//This is used for the user simulation in Sandbox mode
//
// Each click object has 4 properties
// #1.) Click ID [Provides a tag for each click, a unique identifier of sorts]
// #2.) Time Stamp [The amount of time that passes after the click-tracking system has been toggled]
// #3.) Function Clicked [Provides what function was toggled when the click was preformed]
// #4.) Time Gap until next click [Providees the time it takes until the next click occurs (or when the click-tracking system has been toggled again)]
//
// A click could also have a tileID, meaning the user clicked a tile for modifying it's land type. If the click is not performed on a tile, the value will
// be null [Note: To save on code length, precip values (when user changes them) are now stored under the TileID property. If so desired,
// this property can be changed in later updates].
// #5.) TileID [Null if click is not a tile (or precip)]

function Click(c1, c2, c3, c4, c5) {
  this.clickID = c1;
  this.timeStamp = c2;
  this.functionType = c3;
  this.timeGap = c4;
  this.tileID = c5;

  var CODEX_HTML = window.frames[2];
  // var CODEX_HTML = document.getElementById("modalCodexFrame").contentWindow;

  //Retrieves the function performed in accordance to the click type [As a string]
  this.getAction = function() {
    var action = isSimRunning();
    var caseInput = parseInt(this.functionType);
    switch (caseInput) {
      //When the user hit the escape key
      case 1:
        if (action) {
          return onDocumentKeyDown(27);
          break;
        } else {
          return "Escape was pressed";
          break;
        }
        //When the user attempts to leave the environment ***COME BACK AND FIX FOR SIMULATIONS***
      case 2:
        if (action) {
          return null;
          break;
        } else {
          return "User tried closing the window";
          break;
        }
        //When the user collapses the pickaxe
      case 3:
        if (action) {
          return roll(1);
          break;
        } else {
          return "Pickaxe was collapsed";
          break;
        }
        //When the user clicks the land-type icon
      case 4:
        if (action) {
          return switchConsoleTab(1);
          break;
        } else {
          return "Land-use icon was clicked";
          break;
        }
        //When the user clicks the precipitation icon
      case 5:
        if (action) {
          return switchConsoleTab(2);
          break;
        } else {
          return "Precipitation tab was clicked";
          break;
        }
        //When the user clicks the calender icon
      case 6:
        if (action) {
          return switchConsoleTab(6);
          break;
        } else {
          return "Year selection tab was clicked";
          break;
        }
        //When the user clicks the assessment icon
      case 7:
        if (action) {
          return switchConsoleTab(3);
          break;
        } else {
          return "Assessment tab was clicked";
          break;
        }
        //When the user clicks landscape feature tab
      case 8:
        if (action) {
          return switchConsoleTab(4);
          break;
        } else {
          return "Landscape feature tab was clicked";
          break;
        }
        break;
        //When the user clicks the download/upload button
      // case 10:
      //   if (action) {
      //     return showUploadDownload();
      //     break;
      //   } else {
      //     return "Download icon was clicked";
      //     break;
      //   }
        //When the user clicks the information icon
      case 11:
        if (action) {
          return showCredits();
          break;
        } else {
          return "Information icon was clicked";
          break;
        }
        //When the user clicks the results tab
      case 12:
        if (action) {
          return resultsStart();
          break;
        } else {
          return "Results tab was clicked";
          break;
        }
        //When the user clicks out of the results tab
      case 13:
        if (action) {
          return resultsEnd();
          break;
        } else {
          return "Results tab was closed";
          break;
        }
        //When the user clicks the speech bubble
      case 14:
        if (action) {
          return togglePopupDisplay();
          break;
        } else {
          return "Speech bubble selected";
          break;
        }
        //When the user selects conventional corn
      case 15:
        if (action) {
          return changeSelectedPaintTo(1);
          break;
        } else {
          return "Conventional corn was selected";
          break;
        }
        //When the user selects conservation corn
      case 16:
        if (action) {
          return changeSelectedPaintTo(2);
          break;
        } else {
          return "Conservation corn was selected";
          break;
        }
        //When the user selects conventional soybean
      case 17:
        if (action) {
          return changeSelectedPaintTo(3);
          break;
        } else {
          return "Conventional soybean was selected";
          break;
        }
        //When the user selects conservation soybean
      case 18:
        if (action) {
          return changeSelectedPaintTo(4);
          break;
        } else {
          return "Conservation soybean was selected";
          break;
        }
        //When the user selects Mixed Fruits and Vegetables
      case 19:
        if (action) {
          return changeSelectedPaintTo(5);
          break;
        } else {
          return "Mixed Fruits and Vegetables was selected";
          break;
        }
        //When the user selects Alfalfa
      case 20:
        if (action) {
          return changeSelectedPaintTo(6);
          break;
        } else {
          return "Alfalfa was selected";
          break;
        }
        //When the user selects Grass Hay
      case 21:
        if (action) {
          return changeSelectedPaintTo(7);
          break;
        } else {
          return "Grass Hay was selected";
          break;
        }
        //When the user selects Switchgrass
      case 22:
        if (action) {
          return changeSelectedPaintTo(8);
          break;
        } else {
          return "Switchgrass was selected";
          break;
        }
        //When the user selects Permanent Pasture
      case 23:
        if (action) {
          return changeSelectedPaintTo(9);
          break;
        } else {
          return "Permanent Pasture was selected";
          break;
        }
        //When the user selects Rotational Grazing
      case 24:
        if (action) {
          return changeSelectedPaintTo(10);
          break;
        } else {
          return "Rotational Grazing was selected";
          break;
        }
        //When the user selects Wetland
      case 25:
        if (action) {
          return changeSelectedPaintTo(11);
          break;
        } else {
          return "Wetland was selected";
          break;
        }
        //When the user selects Prairie
      case 26:
        if (action) {
          return changeSelectedPaintTo(12);
          break;
        } else {
          return "Prairie was selected";
          break;
        }
        //When the user selects Conventional Forest
      case 27:
        if (action) {
          return changeSelectedPaintTo(13);
          break;
        } else {
          return "Conventional Forest was selected";
          break;
        }
        //When the user selects Conservation Forest
      case 28:
        if (action) {
          return changeSelectedPaintTo(14);
          break;
        } else {
          return "Conservation Forest was selected";
          break;
        }
        //When the user selects Short Rotation Woody Bioenergy
      case 29:
        if (action) {
          return changeSelectedPaintTo(15);
          break;
        } else {
          return "Short Rotation Woody Bioenergy";
          break;
        }
        //When the user clicks the undo button
      case 30:
        if (action) {
          return revertChanges();
          break;
        } else {
          return "Undo button was toggled";
          break;
        }
        //When the user uses the overlay hotkey
      case 31:
        if (action) {
          return toggleOverlay();
          break;
        } else {
          return "Overlay hotkey was toggled";
          break;
        }
        //When the user uses the topography hotkey
      case 32:
        if (action) {
          if (modalUp != true) {
            tToggle ? tToggle = false : tToggle = true;
            //in the case when the map is highlighted:
            if (mapIsHighlighted) {
              refreshBoard(true);
            }
            //if the map is not highlighted:
            else {
              refreshBoard();
            }
            setupRiver();
          }
          break;
        } else {
          return "Topography hotkey was toggled";
          break;
        }
        //When the user closes the information window
      case 33:
        if (action) {
          return closeCreditFrame();
          break;
        } else {
          return "Information tab was closed";
          break;
        }
        //When the user modifies the year 0 precip
      case 34:
        if (action) {
          document.getElementById("year0Precip").selectedIndex = this.tileID;
          updatePrecip(0);
          return rainOnPewi();
          break;
        } else {
          return "Year 0 Precip Modified";
          break;
        }
        //When the user modifies the year 1 precip
      case 35:
        if (action) {
          document.getElementById("year1Precip").selectedIndex = this.tileID;
          updatePrecip(1);
          return rainOnPewi();
          break;
        } else {
          return "Year 1 Precip Modified";
          break;
        }
        //When the user modifies the year 2 precip
      case 36:
        if (action) {
          document.getElementById("year2Precip").selectedIndex = this.tileID;
          updatePrecip(2);
          return rainOnPewi();
          break;
        } else {
          return "Year 2 Precip Modified";
          break;
        }
        //When the user modifies the year 3 precip
      case 37:
        if (action) {
          document.getElementById("year3Precip").selectedIndex = this.tileID;
          updatePrecip(3);
          return rainOnPewi();
          break;
        } else {
          return "Year 3 Precip Modified";
          break;
        }
        //When the user selects year 1
      case 38:
        if (action) {
          transitionToYear(1)
          return switchYearTab(1);
          break;
        } else {
          return "Year 1 Selected";
          break;
        }
        //When the user selects year 2
      case 39:
        if (action) {
          transitionToYear(2)
          return switchYearTab(2);
          break;
        } else {
          return "Year 2 Selected";
          break;
        }
        //When the user selects year 3
      case 40:
        if (action) {
          transitionToYear(3)
          return switchYearTab(3);
          break;
        } else {
          return "Year 3 Selected";
          break;
        }
        //When the user adds a new year
      case 41:
        if (action) {
          return addYearAndTransition();
          break;
        } else {
          return "Additional year was added";
          break;
        }
        //When the user selects Subwatershed Nitrate icon
      case 42:
        if (action) {
          return displayLevels('nitrate');
          break;
        } else {
          return "Nitrate Percent was clicked";
          break;
        }
        //When the user selects Gross Erosion icon
      case 43:
        if (action) {
          return displayLevels('erosion');
          break;
        } else {
          return "Gross Erosion was clicked";
          break;
        }
        //When the user selects Phosphorus Index Risk
      case 44:
        if (action) {
          return displayLevels('phosphorus');
          break;
        } else {
          return "Phosphorus Index Risk was clicked";
          break;
        }
        //When the user selects Flood Frequency
      case 45:
        if (action) {
          return displayLevels('flood');
          break;
        } else {
          return "Flood Frequency was clicked";
          break;
        }
        //When the user selects Wetland Suitability
      case 46:
        if (action) {
          return displayLevels('wetland');
          break;
        } else {
          return "Wetland Suitability was clicked";
          break;
        }
        //When the user selects Subwatershed Boundaries
      case 47:
        if (action) {
          return displayLevels('subwatershed');
          break;
        } else {
          return "Subwatershed Boundaries";
          break;
        }
        //When the user selects Drainage Class
      case 48:
        if (action) {
          return displayLevels('drainage');
          break;
        } else {
          return "Drainage Class was clicked";
          break;
        }
        //When the user selects Soil Class
      case 49:
        if (action) {
          return displayLevels('soil');
          break;
        } else {
          return "Soil Class was clicked";
          break;
        }
        //When the user clicks the single land-type icon
      case 50:
        if (action) {
          return painterSelect(1);
          break;
        } else {
          return "Single land-type selector clicked";
          break;
        }
        //When the user clicks the multi land-type icon
      case 51:
        if (action) {
          return painterSelect(2);
          break;
        } else {
          return "Multi land-type selector clicked";
          break;
        }
        //When the user randomizes the board (via hotkey)
      case 52:
        if (action) {
          return randomizeBoard();
          break;
        } else {
          return "Board randomization hotkey pressed";
          break;
        }
        //When the user closes the download window
      case 53:
        if (action) {
          return closeUploadDownloadFrame();
          break;
        } else {
          return "Download window was closed";
          break;
        }
        //When the user collapses the speech bubble
      case 54:
        if (action) {
          return togglePopupDisplay();
          break;
        } else {
          return "Speech bubble was collapsed";
          break;
        }
        //When the user paints a tile (single seleciton)
      case 55:
        if (action) {
          return changeLandTypeTile(this.tileID);
          break;
        } else {
          return "A tile was painted (single selection)";
          break;
        }
        //When the user paints a tile (multi selection)
      case 56:
        if (action) {
          painterTool.status = 2;
          for(var i = 0; i < this.tileID.length; i++) {
            undoGridPainters.push(boardData[currentBoard].map[this.tileID[i]].landType[currentYear]);
            changeLandTypeTile(this.tileID[i]);
          }
          insertChange();
          return painterTool.status = 1;
          break;
        } else {
          return "A tile was painted (multi selection)";
          break;
        }
        //When the user expands the pickaxe
      case 57:
        if (action) {
          return roll(1);
          break;
        } else {
          return "Pickaxe was expanded";
          break;
        }
      case 58:
        if (action) {
          // window.frames[4] is the same as document.getElementById("modalResultsFrame").contentWindow,
          return window.frames[4].toggleToTab(1);
          break;
        } else {
          return "First results tab clicked";
          break;
        }
      case 59:
        if (action) {
          return window.frames[4].toggleToTab(2);
          break;
        } else {
          return "Second results tab clicked";
          break;
        }
      case 60:
        if (action) {
          window.frames[4].scrollTo(0, 0);
          return window.frames[4].changeLandPieBy(1);
          break;
        } else {
          return "Up arrow on results pie toggled";
          break;
        }
      case 61:
        if (action) {
          window.frames[4].scrollTo(0, 0);
          return window.frames[4].changeLandPieBy(-1);
          break;
        } else {
          return "Down arrow on results pie toggled";
          break;
        }
      case 62:
        if (action) {
          window.frames[4].scrollTo(0, 500);
          if (window.frames[4].document.getElementById("checkboxYear1").checked) {
            window.frames[4].document.getElementById("checkboxYear1").checked = false;
          } else {
            window.frames[4].document.getElementById("checkboxYear1").checked = true;
          }
          return window.frames[4].radarPlotYearToggle(1);
          break;
        } else {
          return "Radar plot year 1 toggled";
          break;
        }
      case 63:
        if (action) {
          if (window.frames[4].document.getElementById("checkboxYear2").checked) {
            window.frames[4].document.getElementById("checkboxYear2").checked = false;
          } else {
            window.frames[4].document.getElementById("checkboxYear2").checked = true;
          }
          window.frames[4].scrollTo(0, 500);
          return window.frames[4].radarPlotYearToggle(2);
          break;
        } else {
          return "Radar plot year 2 toggled";
          break;
        }
      case 64:
        if (action) {
          if (window.frames[4].document.getElementById("checkboxYear3").checked) {
            window.frames[4].document.getElementById("checkboxYear3").checked = false;
          } else {
            window.frames[4].document.getElementById("checkboxYear3").checked = true;
          }
          window.frames[4].scrollTo(0, 500);
          return window.frames[4].radarPlotYearToggle(3);
          break;
        } else {
          return "Radar plot year 3 toggled";
          break;
        }
      case 65:
        if (action) {
          if (window.frames[4].document.getElementById("yieldCheckboxYear1").checked) {
            window.frames[4].document.getElementById("yieldCheckboxYear1").checked = false;
          } else {
            window.frames[4].document.getElementById("yieldCheckboxYear1").checked = true;
          }
          window.frames[4].scrollTo(0, 1000);
          return window.frames[4].yieldRadarPlotYearToggle(1);
          break;
        } else {
          return "Annual yield results year 1 toggled";
          break;
        }
      case 66:
        if (action) {
          if (window.frames[4].document.getElementById("yieldCheckboxYear2").checked) {
            window.frames[4].document.getElementById("yieldCheckboxYear2").checked = false;
          } else {
            window.frames[4].document.getElementById("yieldCheckboxYear2").checked = true;
          }
          window.frames[4].scrollTo(0, 1000);
          return window.frames[4].yieldRadarPlotYearToggle(2);
          break;
        } else {
          return "Annual yield results year 2 toggled";
          break;
        }
      case 67:
        if (action) {
          if (window.frames[4].document.getElementById("yieldCheckboxYear3").checked) {
            window.frames[4].document.getElementById("yieldCheckboxYear3").checked = false;
          } else {
            window.frames[4].document.getElementById("yieldCheckboxYear3").checked = true;
          }
          window.frames[4].scrollTo(0, 1000);
          return window.frames[4].yieldRadarPlotYearToggle(3);
          break;
        } else {
          return "Annual yield results year 3 toggled";
          break;
        }
      case 68:
        if (action) {
          return switchConsoleTab(7);
          break;
        } else {
          return "Yield tab selected";
          break;
        }
      case 69:
        if (action) {
          return displayLevels('cornGrain');
        } else {
          return "Corn Grain yield selected";
        }
      case 70:
        if (action) {
          return displayLevels('soy');
        } else {
          return "Soy yield selected";
        }
      case 71:
        if (action) {
          return displayLevels('fruit');
        } else {
          return "Mixed Fruit and Vegetables yield selected";
        }
      case 72:
        if (action) {
          return displayLevels('cattle');
        } else {
          return "Cattle yield selected";
        }
      case 73:
        if (action) {
          return displayLevels('alfalfa');
        } else {
          return "Alfalfa yield selected";
        }
      case 74:
        if (action) {
          return displayLevels('grassHay');
        } else {
          return "Grass hay yield selected";
        }
      case 75:
        if (action) {
          return displayLevels('switchGrass');
        } else {
          return "Switchgrass yield selected";
        }
      case 76:
        if (action) {
          return displayLevels('wood');
        } else {
          return "Wood yield selected";
        }
      case 77:
        if (action) {
          return displayLevels('short');
        } else {
          return "Woody Biomass yield selected";
        }
      case 78:
        if (action) {
          return toggleIndex();
        } else {
          return "Index opened";
        }
      case 79:
        if (action) {
          return toggleIndex();
        } else {
          return "Index closed";
        }

        // Action inside index page, click on entry
      case 80:
        console.log("Entry ID: " + this.tileID);
        // console.log(CODEX_HTML.document.getElementById(this.tileID).className);
        // simulation is running, do what we recorded (what the user did)
        if (action) {
          if (CODEX_HTML.document.getElementById(this.tileID).className == "groupHeader" ||
            CODEX_HTML.document.getElementById(this.tileID).className == "selectedGroupHeader") {
            CODEX_HTML.toggleChildElements(this.tileID);
            CODEX_HTML.arrangeContent(this.tileID);
          } else if (CODEX_HTML.document.getElementById(this.tileID).className == "groupElement" ||
            CODEX_HTML.document.getElementById(this.tileID).className == "selectedGroupElement") {
            CODEX_HTML.arrangeContent(this.tileID);
          }
          return;
        }
        // record the event description in csv file
        else
          return "Click an entry in index page";

        break;

        // Action inside index page, switch to Advanced
      case 81:
        console.log("Case 81 ID: " + this.tileID);

        // simulation is running, do what we recorded (what the user did)
        if (action)
          return CODEX_HTML.showAdvancedDetail(this.tileID);
        // record the event description in csv file
        else
          return "Click Advanced tab";
        break;

        // Action inside index page, switch to General
      case 82:
        console.log("Case 82 ID: " + this.tileID);

        // simulation is running, do what we recorded (what the user did)
        if (action)
          return CODEX_HTML.showLessDetail(this.tileID);
        // record the event description in csv file
        else
          return "Click General tab";
        break;
      //When a user performs a shift-click action
      case 83:
        if(action) {
          isShiftDown = true;
          for (var i = 0; i < boardData[currentBoard].map.length; i++) {
            if (boardData[currentBoard].map[i].landType[currentYear] != 0) {
              undoGridPainters.push(boardData[currentBoard].map[i].landType[currentYear]);
              changeLandTypeTile(i);
            }
          }
          //Inserts the block of land use types into the undoArr
          insertChange();
          isShiftDown = false;
          break;
        } else {
          return "Shift click was performed"; }
      //When the user clicks on the info tab
      case 84:
        if(action)
          toggleBackgroundInfoDisplay();
        else
          return "Info tab clicked";
         break;
        //When the user toggles flyover mode
        case 85:
          if(action)
            toggleCameraView();
          else
            return "Flyover view toggled";
          break;
        //When the user pivots upright/moves forward
        case 86:
          if(action)
            return customDirectionalInput("KeyW", 87);
           else
            return "User Pivoted Upright/Moved Forward";
          break;
        //When the user pivots flat/moves backward
        case 87:
          if(action)
            return customDirectionalInput("KeyS", 83);
          else
            return "User Pivoted Flat/Moved Backward";
          break;
        //When the user pivots clockwise/moves right
        case 88:
          if(action)
            return customDirectionalInput("KeyD", 68);
          else
            return "User Pivoted Clockwise/Moved Right";
          break;
        //When the user pivotrs counterclockwise/moves left
        case 89:
          if(action)
            return customDirectionalInput("KeyA", 65);
          else
            return "User Pivoted Counterclockwise/Moved Left";
          break;
        //When the user resets the camera
        case 90:
          if(action) {
            controls.value = 10;
            controls.reset();
            setTimeout(function() {
              controls.value = 1;
            }, 100);
            if(ToggleCam == 2){
              controls1.value = 10;
              controls1.reset();
              setTimeout(function() {
                controls1.value = 1;
              }, 100);
            } else {
              camera2.position.x = 70;
              camera2.position.y = 25;
              camera2.position.z = 244;
              camera2.rotation.y = 0;
            }
          } else {
            return "Camera reset";
          }
          break;
        //When the user zooms in/out over the main PEWI map
        case 91:
          if(action)
            return customCameraView(this.tileID);
          else
            return "User zoomed in/out of PEWI map";
          break;
        //When the user scrolls in the about page, which is the credits.html
        case 92:
          if(action)
            return window.frames[0].scrollTo(0,parseInt(this.tileID));
          else
            return "User scrolled in the about page";
        //When the user scrolls in the index page, which is the codex.html
        case 93:
          if(action)
            return window.frames[3].frames[0].scrollTo(0,parseInt(this.tileID));
          else
            return "User scrolled in the index page";
        //When the user scrolls in the results page
        case 94:
          if(action)
            return window.frames[4].scrollTo(0,parseInt(this.tileID));
          else
            return "User scrolled in the results page";
        //When the user uses the up arrow
        case 95:
          if(action)
            return customDirectionalInput("ArrowUp", 38);
          else
            return "User pressed the up arrow";
        //When the user uses the down arrow
        case 96:
          if(action)
            return customDirectionalInput("ArrowDown", 40);
          else
            return "User pressed the down arrow";
        //When the user uses the left arrow
       case 97:
          if(action)
            return customDirectionalInput("ArrowLeft", 39);
          else
            return "User pressed the left arrow";
        //When the user uses the right arrow
        case 98:
          if(action)
            return customDirectionalInput("ArrowRight", 37);
          else
            return "User pressed the right arrow";
        //When the user right clicks for moving the PEWI map
        case 99:
          if(action)
            return customMouseInput(this.tileID,false);
          else
            return "User right clicked on the map";
        //When the user moves the mouse while holding the right mouse button for moving the PEWI map
        case 100:
          if(action)
            return customMouseInput(this.tileID,true);
          else
            return "User dragged mouse while holding the right mouse button";
    }
  }
}


//######################################################################################
//######################################################################################


//Function to construct a game board object
//game boards can be associated with multiple results objects

function GameBoard() {
  this.precipitation = [0, 0, 0, 0, 24.58, 45.1];
  this.precipitationIndex = [0, 0, 0, 0];
  this.map = Array();
  this.calculatedToYear = 1;
  this.watershedArea = 0;
  this.maximums = {};
  this.minimums = {};
  this.width = 0;
  this.height = 0;

  // this.yearsOwned = 1;
  //This function updates all of the tiles in the board to the calculatedYear
  //Use this only when you need to update all of the tiles, such as initially or when precip is changed
  //  otherwise, avoid using this function and update tiles individually since this is computationally intensive
  this.updateBoard = function() {
    // this.map[0].sumAreaHelper();
    for (var y = 1; y <= this.calculatedToYear; y++) {
      for (var i = 0; i < this.map.length; i++) {
        this.map[i].update(y);
        this.map[i].updateNitrate(y);
      }
    }
  }; //end updateBoard

  //this function establishes the board area for calculations that depend on it
  //and determines the dimensions of the board
  this.establishBoardArea = function() {

    var tempArea = 0;
    var maxHeight = 0;
    var maxWidth = 0;

    // Calculate the Area and subwatershed area of the whole map, since these areas are constant, we only need to call it once when establishing the board.
    this.map[0].sumAreaHelper();

    for (var i = 0; i < this.map.length; i++) {
      tempArea += this.map[i].area;
      if (this.map[i].row > maxHeight) {
        maxHeight++;
      }
      if (this.map[i].column > maxWidth) {
        maxWidth++;
      }
      this.map[i].finalArea = this.map[0].finalArea;
      this.map[i].subWatershedArea = this.map[0].subWatershedArea;
    } //end for all Cells

    //update Board watershed Area for some tile level calculations!
    this.watershedArea = tempArea;

    //update Board dimensions
    this.width = maxWidth;
    this.height = maxHeight;

    //update THREE.js panning limits to the center of the leftmost and rightmost tiles
    panLimitLeft = 1 * tileWidth - (tileWidth * maxWidth - tileWidth) / 2;
    panLimitRight = maxWidth * tileWidth - (tileWidth * maxWidth - tileWidth) / 2;



  }; //end establishBoardArea


  //This function calculates the maximums and minimums for calculations of percentages
  this.calculateMaxMin = function() {

    var cornMax = 0;
    var soybeanMax = 0;
    var hayMax = 0;
    var woodMax = 0;
    var cattleMax = 0;
    var switchgrassMax = 0;
    var shortWoodyMax = 0;
    var mixedMax = 0;
    var erosionMax = 0;
    var erosionMin = 0;
    var phosphorusMax = 0;
    var phosphorusMin = 0;
    var sedimentMax = 0;
    var sedimentMin = 0;

    //Loop through "years" indexed at 4 and 5 to calculate min and max values

    for (var i = 0; i < this.map.length; i++) {

      //Sum Maximum Yield Values
      cornMax += this.map[i].getCornGrainYield() * this.map[i].area;
      soybeanMax += this.map[i].getSoybeanYield() * this.map[i].area;
      hayMax += this.map[i].getHayYield() * this.map[i].area;
      woodMax += this.map[i].getWoodYield() * this.map[i].area;
      cattleMax += this.map[i].getCattleSupported(5) * this.map[i].area;
      switchgrassMax += this.map[i].getSwitchgrassYield() * this.map[i].area;
      shortWoodyMax += 60.8608 * this.map[i].area;
      mixedMax += 7.34 * this.map[i].area * this.map[i].getMixedFruitsVegetablesYield();


      //Calculate Quality Indicator Values
      this.map[i].rusle(4);
      this.map[i].ephemeralGullyErosion(4);
      erosionMin += (this.map[i].rusleValues[4] + this.map[i].ephemeralGullyErosionValue[4]) * this.map[i].area;

      this.map[i].rusle(5);
      this.map[i].ephemeralGullyErosion(5);
      erosionMax += (this.map[i].rusleValues[5] + this.map[i].ephemeralGullyErosionValue[5]) * this.map[i].area;

      if (this.map[i].soilType != "NA" && this.map[i].soilType != "0" && this.map[i].soilType != 0) {

        this.map[i].updatePhosphorusParameters(4);
        phosphorusMin += this.map[i].area * (this.map[i].erosionComponent(4) + this.map[i].drainageComponent(4) + this.map[i].runoffComponent(4)) / 2000;
        sedimentMin += (this.map[i].rusleValues[4] + this.map[i].ephemeralGullyErosionValue[4]) * this.map[i].sedimentDeliveryRatio * this.map[i].bufferFactor(4) * this.map[i].area;

        this.map[i].updatePhosphorusParameters(5);
        phosphorusMax += this.map[i].area * (this.map[i].erosionComponent(5) + this.map[i].drainageComponent(5) + this.map[i].runoffComponent(5)) / 2000;
        sedimentMax += (this.map[i].rusleValues[5] + this.map[i].ephemeralGullyErosionValue[5]) * this.map[i].sedimentDeliveryRatio * this.map[i].bufferFactor(5) * this.map[i].area;

      }

    }

    this.maximums.cornMax = cornMax;
    this.maximums.soybeanMax = soybeanMax;
    this.maximums.alfalfaMax = hayMax;
    this.maximums.grassHayMax = hayMax;
    this.maximums.woodMax = woodMax;
    this.maximums.cattleMax = cattleMax;
    this.maximums.switchgrassMax = switchgrassMax;
    this.maximums.shortRotationWoodyBiomassMax = shortWoodyMax;
    this.maximums.mixedFruitsAndVegetablesMax = mixedMax;

    this.maximums.carbonMax = 1897.98 * this.watershedArea / 1000;
    this.minimums.carbonMin = 0;
    this.minimums.erosionMin = erosionMin;
    this.maximums.erosionMax = erosionMax;
    this.minimums.phosphorusMin = phosphorusMin;
    this.maximums.phosphorusMax = phosphorusMax;
    this.minimums.nitrateMin = 2;
    this.maximums.nitrateMax = 100 * 0.14 * 2.11;
    this.minimums.sedimentMin = sedimentMin;
    this.maximums.sedimentMax = sedimentMax;

  }; //end calculateMaxMin

  //this function performs the necessary functions that we need to set up a Results object
  //preform the init function immediately after the creation of a Results object and its linkage to an associated board
  this.init = function() {

    //Initialize the gameboard with Max and Min Values
    this.establishBoardArea();
    this.calculateMaxMin();

  }; //end init

}; //end GameBoard construction


//######################################################################################
//######################################################################################


// This Printer object implements jsPDF library
// Called by executePrintOptions() in helpersFE.js
function Printer() {
  /*** attributes ***/

  /* p: portrai, mm: millimeters unit, pt: point unit, a4: A4 */
  var doc = new jsPDF('p', 'pt', 'a4');
  // Optional - set properties of the document
  doc.setProperties({
    title: "PEWI Results",
    subject: "All Rights Reserved@",
    author: 'LESEM LAB',
    creator: 'PEWI app & jsPDF'
  });

  // var RESULTS_HTML = window.frames[4];
  var RESULTS_HTML = document.getElementById("resultsFrame").contentWindow;

  // some parameters // in pt
  var
    // Width & heigth of the entire bar ( precip ) chart section
    barChartHeight = 100,
    barChartWidth = 250,
    // legend
    indicatorLength = 8,
    lineHeight = 12,
    // map
    mapWidth = 500,
    mapHeight = 250,
    // standard A4
    pageHeight = 842,
    pageWidth = 595,
    // margin & padding
    padding = 3.5,
    pageMargin = 50,
    pageLimit = 20,
    // Width & heigth of the entire pie chart section
    pieChartHeight = 300,
    pieChartWidth = 400,
    // Width & heigth of the entire radar chart section
    radarChartHeight = 250,
    radarChartWidth = 400,
    // coordinates
    x = pageMargin, // x keep tracks of current horizontal position
    y = pageMargin, // y keep tracks of current vertical position
    previousY = y,

    // imageSrc object
    imageSrc = {},
    // fontSize object
    font = {
      font: 12,
      header1_font: 20,
      header2_font: 16
    };

  // legend object
  var legendObjs = {};

  // results table object
  var resultsTableObjs = {};

  /*** functions ***/

  // main printing part ( public )

  /**
   * This function basically stores all the required image that is going to be put on the PDF as sources and create legend as well.
   * All the images are stored in object imageSrc
   * All the legends are stored in object legendObjs
   */
  this.preprocessing = function() {
    // set global variable printMode to true
    printMode = true;

    // loop through all intended-to-print type, and place them on the doc
    for (var property in toPrint) {

      if (toPrint[property]) {

        switch (property) {
          case 'yearUserViewpoint':
          case 'levelUserViewpoint':
          case 'featureUserViewpoint':
          case 'yieldUserViewpoint':
          // TODO implement view point for each section
            break;

          case 'resultsTable1':
          case 'resultsTable2':
          case 'resultsTable4':
          case 'resultsLanduse':
          case 'resultsEcosystem':
          case 'resultsPrecip':
          // results page stuff

            // pull up the result page
            modalUp = false; // set to false to open the result page
            resultsStart();

            if (property.slice(7, 12) == 'Table') {
              // tables in results tab

              RESULTS_HTML.toggleToTab(2); // switch to table tab
              // grab the table that we want to print
              var elem = RESULTS_HTML.document.getElementById("table" + property.substr(-1));
              // use autoTable lib and add to resultsTableObjs
              resultsTableObjs['table' + property.substr(-1)] = doc.autoTableHtmlToJson(elem);
            } else {
              // charts in results tab

              RESULTS_HTML.toggleToTab(1); // switch to graphs tab

              // var canvas;
              switch (property) {
                case 'resultsLanduse': imageSrc[property] = drawPieCharts(); break;// putting svg on canvas
                case 'resultsEcosystem':
                  //Toggle the years which are not selected off
                  if(toPrint.year1 == false) removeYearFromRadar(1);
                  if(toPrint.year2 == false) removeYearFromRadar(2);
                  if(toPrint.year3 == false) removeYearFromRadar(3);
                  // putting svg on canvas
                  imageSrc[property] = drawRadarChart();
                  break;
                case 'resultsPrecip': imageSrc[property] = drawPrecipChart(); break;
              } // end switch
              // imageSrc[property] = canvas.toDataURL("image/jpeg");

              if (property == 'resultsEcosystem')
                makeLegendBox('rada');// putting svg on canvas

            }// end if/else

            // close the result page
            resultsEnd();
            modalUp = true; // since printOptions page is still up
            break;

          default:
            // other map stuff
            // take screen shot and save as image source
            // TODO: set standard view before take screen shot
            saveScreenshotMapType(property);

            // make legend if needed
            if (property !== 'boundary' && property !== "yearUserViewpoint"  &&
                property !== "levelUserViewpoint" && property !== "featureUserViewpoint" &&
                property !== "yieldUserViewpoint") {
              makeLegendBox(property); // create legend object
            } // END if

            break;

        } // END switch

      } // END outter if

    } // end for

  }; // end preprocessing

  /**
  * This function generates and formats all the contents on the PDF and create it in the end
  *
  * @param isDownload: 0 not downloading, 1: is downloading
  */
  this.processing = function(isDownload) {
    // var uptoYear = boardData[currentBoard].calculatedToYear;
    addText(1, "PEWI Result", x, y, font.header1_font);
    updateY(lineHeight*2);

    // loop through all intended-to-print type, and place them on the doc
    for (var property in toPrint) {

      if (toPrint[property]) {
        switch (property) {
          case 'yearUserViewpoint':
          case 'levelUserViewpoint':
          case 'featureUserViewpoint':
          case 'yieldUserViewpoint':
          // do nothing
            break;

          case 'resultsTable1':
          case 'resultsTable2':
          case 'resultsTable4':
          // --resultsTables--

            // check if need to add page
            checkPageHeight((padding+lineHeight*2) + font.header2_font); // this is just for add text since autoTable already take care of y

            // add component
            updateY(padding+lineHeight*2);
            addText(1, "Result Table "+ property.substr(-1), x, y, font.header2_font);

            // place the table
            doc.autoTable(resultsTableObjs[ 'table'+[property.substr(-1)] ].columns, resultsTableObjs[ 'table'+[property.substr(-1)] ].data, {
              // styling of autotable
              startY: y,
              // margin: {horizontal: 7},
              styles: {
                cellPadding: 1.5, // a number, array or object (see margin below)
                fontSize: 8,
                // font: "helvetica", // helvetica, times, courier
                // lineColor: 200,
                // lineWidth: 0,
                // fontStyle: 'normal', // normal, bold, italic, bolditalic
                overflow: 'linebreak', // visible, hidden, ellipsize or linebreak
                // fillColor: false, // false for transparent or a color as described below
                // textColor: 20,
                halign: 'center', // left, center, right
                valign: 'middle', // top, middle, bottom
                // columnWidth: 'auto' // 'auto', 'wrap' or a number
              },
              // bodyStyles: { fontSize: 8 },
              // headerStyles: { halign: 'center' },
              columnStyles: { 0: { halign: 'left' } }
             });

            // update y
            y = doc.autoTable.previous.finalY;
            checkPageHeight(lineHeight*2+padding); // check if need to add page
            updateY(lineHeight*2+padding); // bottom space

            break;

          // --charts on results page--
          case 'resultsLanduse':

            // check if need to add page
            checkPageHeight((padding+lineHeight) + font.header2_font + (pieChartHeight+lineHeight) + (lineHeight*2+padding) );

            // put component
            updateY(padding + lineHeight);
            // place text and image
            addText(1, "Landuse Pie-charts", x, y, font.header2_font);
            //add the image of all required pie charts
            previousY = y;
            addImage(imageSrc[property], 'JPEG', x, y, pieChartWidth, pieChartHeight);
            //drawing legend for one type of pie charts
            drawLegendBox(legendObjs['pie1'], x + pieChartWidth - 10, previousY);
            //drawing legends for other tyoe of pie charts
            drawLegendBox(legendObjs['pie2'], x + pieChartWidth - 10, previousY + (pieChartHeight / 2 - 10));
            // update y
            updateY(lineHeight*2+padding);

            break;

          case 'resultsEcosystem':

            // check if need to add page
            checkPageHeight((padding+lineHeight) + font.header2_font + (pieChartHeight+lineHeight) + (lineHeight*2+padding) );

            // put component
            updateY(padding + lineHeight);
            addText(1, "Ecosystem Service Charts", x, y, font.header2_font);
            //drawing the radar chart
            previousY = y;
            addImage(imageSrc[property], 'JPEG', x, y, radarChartWidth, radarChartHeight);
            drawLegendBox(legendObjs['rada'], x + 400, previousY + 100);
            // update y
            updateY(lineHeight*2+padding);

            break;

          case 'resultsPrecip':

            // check if need to add page
            checkPageHeight((padding+lineHeight) + font.header2_font + (pieChartHeight+lineHeight) + (lineHeight*2+padding) );

            // put component
            updateY(padding + lineHeight);
            addText(1, "Precipitation Charts", x, y, font.header2_font);
            previousY = y;
            addImage(imageSrc[property], 'JPEG', x + 155, y, barChartWidth, barChartHeight);
            //adding the text and description
            for (var i = 0; i <= parent.boardData[parent.currentBoard].calculatedToYear; i++)
              addText(1, parent.boardData[parent.currentBoard].precipitation[i] + " inches " + parent.data[i].adj, x + 20, previousY + 20*(i+1), font.font);
            // update y
            updateY(lineHeight*2+padding);

            break;

          default:
            // --other map stuff--
            placeMapType(property);
            break;
        } // END switch

      } // END if
    } // end for

    // output PDF
    if (isDownload == 1) {
      // --user clicked download--
      doc.save(promptFileName() + ".pdf");
    } else {
      // --user clicked preview--
      // window.frames[7].document.getElementById("pdf_preview").setAttribute("src", doc.output('dataurlstring'));
            document.getElementById("printOptions").contentWindow.document.getElementById("pdf_preview").setAttribute("src", doc.output('dataurlstring'));

      // new window
      // doc.output('dataurlnewwindow');
      // Output as Data URI on the current page
      // doc.output('datauri');
    }

    // clean everything XXX clean jsPDF?
    printMode = false;
    doc = {};
    imageSrc = {};
    legendObjs = {};
  }; // end processing

  // helper functions ( private )

  /**
  * Place image on the pdf, the width & height that put here will shrink or enlarge the original image
  * If does update y value for : height + lineHeight
  * @param dataURL, String type: 'JPEG', 'PNG', and so on
  * @param width, Number height, Number x, sNumber y
  */
  function addImage(dataURL, type, x, y, width, height) {
    // 'PNG' wouldn't work for some reason
    doc.addImage(dataURL, type, x, y, width, height);
    updateY(height+lineHeight);
  } // end addImage

  /**
  * Create and store the legend indicator and description in legendObjs per line
  *
  * @param legendName: the name that will be stored as the keyword refer to the legend object
  * @param color: legend indicator color in rgb()
  * @param text: legend description
  */
  function addLegendLine(legendName, color, text) {
    if (typeof legendObjs[legendName] === 'undefined') {
      // Create Object
      legendObjs[legendName] = {
        indicator: [],
        description: []
      };
    }
    legendObjs[legendName].indicator.push(color);
    legendObjs[legendName].description.push(text);
  } // end addLegendLine

  /**
  * Place text on the pdf.
  * If update y valuem it will be : size.
  *
  * @param needUpdateY: 0: don't update y, other: do update y
  * @param String text, Number x, Number y, [Number size, String type, String family]
  TODO center text
  */
  function addText(needUpdateY, text, x, y, size, type, family) {
    if (arguments.length >= 5)
      doc.setFontSize(size);

    if (arguments.length >= 6)
      doc.setFontType(type);

    doc.text(x, y, text);
    if (needUpdateY) {
      // update y
      // updateY(size + lineHeight);
      updateY(size);
    }
    // reset font property
    doc.setFontSize(font.font);
    doc.setFontType("normal");
  } // end addText

  /**
  * Sets the background of a canvas to white
  *
  * @param canvas who's background it to be set to white
  */
  function clearCanvasBackground(canvas) {
    // reference below link on how to change background-color
    // https://stackoverflow.com/questions/36522927/how-to-get-background-color-of-svg-converted-properly-into-canvas
    var ctx = canvas.getContext('2d');
    // all drawings will be made behind the already painted pixels
    ctx.globalCompositeOperation = 'destination-over'
    // set the color
    ctx.fillStyle = 'white';
    // draw the background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } // end clearCanvasBackground

  /**
  * Sets the background of a canvas to white
  *
  * @param canvas who's background it to be set to white
  */
  function clearCanvasBackground2(canvas) {
    var imgData1 = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    var img_data = imgData1.data;
    //
    for (var i = 0; i < img_data.length; i += 4) {
      if (img_data[i + 3] < 255) {
        img_data[i] = 255 - img_data[i];
        img_data[i + 1] = 255 - img_data[i + 1];
        img_data[i + 2] = 255 - img_data[i + 2];
        img_data[i + 3] = 255 - img_data[i + 3];
      }
    }
    // update context
    canvas.getContext("2d").putImageData(imgData1, 0, 0);
  } // end clearCanvasBackground2

  /**
  * This function should be called before every time you want to put new component on PDF
  * to check if there's needed to add page or not.
  * It add page when the component to be put doesn't fit the page, and does nothing if no need to add page.
  *
  * @param HeightOfComponent the componemt that is going to put on the PDF
  */
  function checkPageHeight(HeightOfComponent) {
    if (y + HeightOfComponent > pageHeight - pageLimit) {
      doc.addPage();
      y = pageMargin;
    }
  } // end checkPageHeight

  /**
  * Take legend object as a source to draw the according legend image
  *
  * @param Object legendObj: the property stored in legendObjs
  * @param x, Number y: coordinates
  */
  function drawLegendBox(legendObj, x, y) {
    var rectX, rectY, textX, textY, i;
    rectX = x + padding;
    rectY = y + padding;
    textX = rectX + indicatorLength + padding;
    textY = rectY + padding * 2;

    // first draw the container
    doc.setDrawColor(0);
    doc.setFillColor(172, 172, 172); // light gray
    doc.rect(x, y, legendObj.width, legendObj.height, 'F');

    var matches_array; // size 3, stores values of RGB
    var regexp = /\d+/g; // regexp to extract RGB values from String

    // then draw the content line by line
    for (i = 0; i < legendObj.indicator.length; i++) {
      // trim to have values
      matches_array = legendObj.indicator[i].match(regexp).map(Number);
      doc.setFillColor(matches_array[0], matches_array[1], matches_array[2]);
      doc.rect(rectX, rectY, indicatorLength, indicatorLength, 'F'); // filled square
      // put on the text
      addText(0, legendObj.description[i], textX, textY, 8);
      // update parameters
      rectY += indicatorLength + padding;
      textY = rectY + padding * 2;
    }
  } // end drawLegendBox

  /**
  * Rendering pie charts on a canvas and convert to image
  * then delete the canvas and returns the imageURL
  *
  * @returns imageURL of Land Use Type pie graph
  */
  function drawPieCharts() {
    // Construct the <canvas> element
    var canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;

    var canvas1 = document.createElement("canvas");
    canvas1.width = 500;
    canvas1.height = 400;

    var xCord = 0,
    yCord = 0;
    var mode = true;
    // Setting up a white background for the canvas
    clearCanvasBackground2(canvas1);

    // Adding the pie charts to the canvas
    for (var j = 0; j < 2; j++) {
      for (var i = 1; i <= boardData[currentBoard].calculatedToYear; i++) {

        // draws only the years selected
        if ((i == 1 && toPrint.year1 == true) || (i == 2 && toPrint.year2 == true) || (i == 3 && toPrint.year3 == true)) {
          drawD3LandPieChart(i, mode); //draw the pie chart

          // get the html content of svg
          var svg = RESULTS_HTML.document.getElementById('pieSVG');
          var svgStringData = $(svg).html(); // will convert data of SVGSVGElement Object to string
          svgStringData = "<svg>" + svgStringData + "</svg>";

          // put the svg on canvas
          canvg(canvas, svgStringData);

          clearCanvasBackground(canvas);

          var ctx1 = canvas1.getContext('2d');
          ctx1.drawImage(canvas, xCord, yCord, 150, 150); //draws the pie chart on main canvas
          // writing the required text
          ctx1.font = "15px Arial";
          ctx1.fillText("Categories", xCord + 40, 75);
          ctx1.fillText("Year " + i, xCord + 57, 96);
          ctx1.fillText("Lists", xCord + 60, 255);
          ctx1.fillText("Year " + i, xCord + 55, 274);

          xCord += 160; //transitioning to the next line of pie charts
        } // end if

        //check if this legend has the maximum number of elements
        if (tempLegendItems.length >= maxLegendSize) {
          finalLegendColors = [];
          finalLegendItems = [];
          finalLegendItems = tempLegendItems;
          finalLegendColors = tempLegendColors;
          maxLegendSize = tempLegendItems.length;
        } // end if
      } // end inner for

      if (mode) // to check which legend should be made
      makeLegendBox('pie1');
      else
      makeLegendBox('pie2');

      finalLegendColors = [];
      finalLegendItems = [];
      maxLegendSize = 1;
      xCord = 0;
      yCord += 180;
      mode = false;
    } // end outter for

    var image = canvas1.toDataURL("image/jpeg");
    // Cleanup the DOM
    canvas.outerHTML = "";
    delete canvas;
    canvas1.outerHTML = "";
    delete canvas1;

    return image;
  } // end drawPieCharts

  /**
  * Rendering Precipitation charts on a canvas and convert to image
  * then delete the canvas and returns the imageURL
  *
  * @returns imageURL of Precipitation bar graph
  */
  function drawPrecipChart() {
    // Construct the <canvas> element
    var canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 200;

    // get the html content of svg
    var precipSvg = RESULTS_HTML.document.getElementById('precipChart');
    var precipSvgStringData = $(precipSvg).html();
    precipSvgStringData = "<svg>" + precipSvgStringData + "</svg>";

    // put the svg on canvas
    canvg(canvas, precipSvgStringData);

    clearCanvasBackground(canvas);

    var image = canvas.toDataURL("image/jpeg");
    // Cleanup the DOM
    canvas.outerHTML = "";
    delete canvas;

    return image;
  } // end drawPrecipChart

  /**
  * Rendering radar charts on a canvas and convert to image
  * then delete the canvas and returns the imageURL
  *
  * @returns imageURL of Ecosystem Services radar graph
  */
  function drawRadarChart() {
    // Construct the <canvas> element
    var canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;

    // get the html content of svg
    var container = RESULTS_HTML.document.getElementById("radarChart");
    var content = $(container).html().trim();
    var svgEnd = content.indexOf('</g></svg>');
    content = content.substring(0, svgEnd + 10);

    // put the svg on canvas
    canvg(canvas, content);

    clearCanvasBackground(canvas);

    var image = canvas.toDataURL("image/jpeg");
    // Cleanup the DOM
    canvas.outerHTML = "";
    delete canvas;

    return image;
  } // END drawRadarChart

  /**
  * Loop through a string array and return the longest line's length
  *
  * @param String Array sArray
  * @returns maxlength the longest line's length
  */
  function longestLine(sArray) {
    var maxlength = 0,index;
    for (var i = 0; i < sArray.length; i++) {
      if (maxlength < sArray[i].length) {
        maxlength = sArray[i].length;
        index = i;
      }
    }
    return maxlength;
  } // end longestLine

  /**
   * Create LegendBox Object
   * The way it works is getting the color and description line by line and call addLegendLine()
   *　to push the line into that legend you created.
   *
   * @param String type
   */
  function makeLegendBox(type) {
    var color, text, i;

    switch (type.slice(0, 4)) {
      case 'year':
        // Create precipitation info as legend box for LandUse Map
        // first get text and color
        text = "Precipitation: " + boardData[currentBoard].precipitation[type.substr(-1)] + "  in.";
        color = "rgb(29, 187, 245)";
        addLegendLine(type, color, text); // add line to legend here

        break;
        // --result graph--
      case 'pie1':
      case 'pie2':
      case 'rada':
        var tempItemNames = [];
        var tempColorNames = [];
        var loopLength = 0;
        if (type == 'rada') { //if the legend is being drawn for radar chart
          tempItemNames = radarLegendItems;
          tempColorNames = radarLegendColors;
          loopLength = radarLegendItems.length;
        } else {
          // else if it's being drawn for the pie charts
          tempItemNames = finalLegendItems;
          tempColorNames = finalLegendColors;
          loopLength = finalLegendItems.length;
        }

        // for creating legend for pie chart
        for (i = 0; i < loopLength; i++) {
          text = tempItemNames[i];
          var hex = tempColorNames[i];
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          result = "rbg(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ")";
          color = result;
          //if it's adding radar legend line, it only lets it add the ones with selected number of years
          if ((type == 'rada' && ((i == 0 && toPrint.year1 == true) || (i == 1 && toPrint.year2 == true) || (i == 2 && toPrint.year3 == true)) || type != 'rada'))
            addLegendLine(type, color, text);

        } // end for

        break;

      default:
      // --those who have "xxxDetailsList" in index.html--

        for (i = 0; i < document.getElementById(type + 'DetailsList').childElementCount; i++) {
          color = void 0;
          text = void 0;
          // loop through the data from detail lists and store in color & text line by line
          // color = document.getElementById(type + 'DetailsList').getElementsByClassName('levelColor'+(i+1) )[0].style.backgroundColor;
          var colorDiv = document.getElementById(type + 'DetailsList').getElementsByClassName('legendColor')[i];
          if (colorDiv instanceof HTMLElement) {
            color = getComputedStyle(colorDiv, null).getPropertyValue("background-color");
            text = colorDiv.getElementsByTagName('p')[0].innerText;
          }
          if (typeof color !== 'undefined' && typeof text !== 'undefined') {
            addLegendLine(type, color, text); // add line to legend here
          }
        } // END for

        break;
    } // END switch

    // store width & height according to its line numbers
    legendObjs[type].height = padding + legendObjs[type].indicator.length * (indicatorLength + padding);
    legendObjs[type].width = padding + indicatorLength + padding + (longestLine(legendObjs[type].description) * 4.5);
    legendObjs[type].name = type;
  } // end makeLegendBox

  /**
  * Loop through all available image src for each year and put them on pdf
  *
  * @param String type, Number uptoYear
  */
  function placeMapType(type) {
    var legend;

    // if type is year category
    switch (type) {
      case 'year1':
      case 'year2':
      case 'year3':
        // check if it's needed to add page
        checkPageHeight(padding + font.header2_font + (mapHeight+lineHeight) + (lineHeight*5+padding) );

        // put the componemt
        updateY(padding+lineHeight);
        // place text and image
        addText(1, "Year " + type.substr(type.length - 1) + " LandUse Map", x, y, font.header2_font);
        previousY = y; // save previousY for legend
        addImage(imageSrc[type], 'JPEG', x, y, mapWidth, mapHeight);
        // place legend
        if (legend = legendObjs[type]) {
          drawLegendBox(legend, x + 5, previousY + mapHeight - (legend.height + 20));
        }
        // update y
        updateY(lineHeight*4+padding);

        break;

      // if type is level category
      case 'nitrate':
      case 'erosion':
      case 'phosphorus':
      case 'sediment':
      case 'carbon':
      case 'gamewildlife':
      case 'biodiversity':
      case 'nitratetile':
        // paste Year 1 level map
        if (toPrint.year1 === true) {
          // check if it's needed to add page
          checkPageHeight(padding + font.header2_font + (mapHeight+lineHeight) + (lineHeight*5+padding) );

          // put the componemt
          updateY(padding+lineHeight);
          // place text and image
          addText(1, "Year 1 " + titleText(type), x, y, font.header2_font);
          previousY = y;
          addImage(imageSrc[type + 1], 'JPEG', x, y, mapWidth, mapHeight);
          // place legend
          if (legend = legendObjs[type]) {
            drawLegendBox(legend, x + 5, previousY + mapHeight - (legend.height+20) );
          }
          // update y
          updateY(lineHeight*4+padding);
        }

        // paste Year 2 level map
        if (toPrint.year2 === true) {
          // check if it's needed to add page
          checkPageHeight(padding + font.header2_font + (mapHeight+lineHeight) + (lineHeight*5+padding) );

          // put the componemt
          updateY(padding+lineHeight);
          // place text and image
          addText(1, "Year 2 " + titleText(type), x, y, font.header2_font);
          previousY = y;
          addImage(imageSrc[type + 2], 'JPEG', x, y, mapWidth, mapHeight);
          // place legend
          if (legend = legendObjs[type]) {
            drawLegendBox(legend, x + 5, previousY + mapHeight - (legend.height+20) );
          }
          // update y
          updateY(lineHeight*4+padding);
        }

        // paste Year 3 level map
        if (toPrint.year3 === true) {
          // check if it's needed to add page
          checkPageHeight(padding + font.header2_font + (mapHeight+lineHeight) + (lineHeight*5+padding) );

          // put the componemt
          updateY(padding+lineHeight);
          // place text and image
          addText(1, "Year 3 " + titleText(type), x, y, font.header2_font);
          previousY = y;
          addImage(imageSrc[type + 3], 'JPEG', x, y, mapWidth, mapHeight);
          // place legend
          if (legend = legendObjs[type]) {
            drawLegendBox(legend, x + 5, previousY + mapHeight - (legend.height+20) );
          }
          // update y
          updateY(lineHeight*4+padding);
        }
        break;

      // if type is other category
      default:
        // check if it's needed to add page
        checkPageHeight(padding + font.header2_font + (mapHeight+lineHeight) + (lineHeight*5+padding) );

        // put the componemt
        updateY(padding+lineHeight);
        // place text and image
        addText(1, titleText(type), x, y, font.header2_font);
        previousY = y;
        addImage(imageSrc[type], 'JPEG', x, y, mapWidth, mapHeight);
        // place legend
        if (legend = legendObjs[type]) {
          drawLegendBox(legend, x + 5, previousY + mapHeight - (legend.height + 20));
        }
        // update y
        updateY(lineHeight*4+padding);
        break;
    } // END switch

  } // end placeMapType

  /**
  * Loop through each year and get according image src
  *
  * @param String text, Number uptoYear
  */
  function saveScreenshotMapType(type) {

    // if type is year category
    switch (type) {
      case 'year1':
      case 'year2':
      case 'year3':
        transitionToYear(type.substr(type.length - 1));
        // if (toPrint.yearUserViewpoint === true ) {
        //   console.log("restore last state");
        //
        //   // TODO: camera set to last user session
        //   controls.restoreLastState();
        // //   renderer.render(scene, camera);
        // //   imageSrc[type] = renderer.domElement.toDataURL('image/jpeg');
        // //
        // } else {
        //   console.log("reset camera position");
        //   // reset camera position
        //   controls.value = 100; // reset 10 times
        //   controls.reset();
        //   setTimeout(function() {
        //     controls.value = 1; // reset to 1
        //   }, 100);
        // }
        // render the according webgl
        renderer.render(scene, camera);
        // get the screenshot image in data string form
        imageSrc[type] = renderer.domElement.toDataURL('image/jpeg');
        break;

      // if type is level category
      case 'nitrate':
      case 'erosion':
      case 'phosphorus':
      case 'sediment':
      case 'carbon':
      case 'gamewildlife':
      case 'biodiversity':
      case 'nitratetile':
        if (toPrint.year1 === true) {
          transitionToYear(1);
          displayLevels(type);
          // if (toPrint.levelUserViewpoint === true ) {
          //   // TODO: camera set to last user session
          // } else {
          //   // reset camera position
          //   controls.value = 10;
          //   controls.reset();
          //   setTimeout(function() {
          //     controls.value = 1;
          //   }, 100);
          // }
          renderer.render(scene, camera);
          imageSrc[type + 1] = renderer.domElement.toDataURL('image/jpeg');
        }
        if (toPrint.year2 === true) {
          transitionToYear(2);
          displayLevels(type);
          // if (toPrint.levelUserViewpoint === true ) {
          //   // TODO: camera set to last user session
          // } else {
          //   // reset camera position
          //   controls.value = 10;
          //   controls.reset();
          //   setTimeout(function() {
          //     controls.value = 1;
          //   }, 100);
          // }
          renderer.render(scene, camera);
          imageSrc[type + 2] = renderer.domElement.toDataURL('image/jpeg');
        }
        if (toPrint.year3 === true) {
          transitionToYear(3);
          displayLevels(type);
          // if (toPrint.levelUserViewpoint === true ) {
          //   // TODO: camera set to last user session
          // } else {
          //   // reset camera position
          //   controls.value = 10;
          //   controls.reset();
          //   setTimeout(function() {
          //     controls.value = 1;
          //   }, 100);
          // }
          renderer.render(scene, camera);
          imageSrc[type + 3] = renderer.domElement.toDataURL('image/jpeg');
        }
        break;

      // if type is other category
      default:
        displayLevels(type);
        // // reset camera position
        // controls.value = 10;
        // controls.reset();
        // setTimeout(function() {
        //   controls.value = 1;
        // }, 100);
        renderer.render(scene, camera);
        imageSrc[type] = renderer.domElement.toDataURL('image/jpeg');
        break;
    } // END switch

  } // end saveScreenshotMapType

  /**
  * Just convert the type to the proper title
  *
  * @param String text the type pass into toPrint array
  * @returns the proper title
  */
  function titleText(text) {
    switch (text) {
      // levels
      case 'nitrate': return 'Subwatershed Nitrate-N Percent Contribution';
      case 'erosion': return 'Gross Erosion';
      case 'phosphorus': return 'Phosphorus Index Risk Assessment';
      case 'sediment': return 'Sediment Control';
      case 'carbon': return 'Carbon Sequestration';
      case 'gamewildlife': return 'Game Wildlife';
      case 'biodiversity': return 'Biodiversity';
      case 'nitratetile': return 'Cell Nitrate Score';
      // features
      case 'flood': return 'Flood Frequency';
      case 'wetlands': return 'Wetland Suitability';
      case 'boundary': return 'Subwatershed Boundaries';
      case 'drainage': return 'Drainage Class';
      case 'soil': return 'Soil Class';
      case 'topo': return 'Topography';
      // yields
      case 'corn': return 'Corn Grain Yield';
      case 'soybean': return 'Soybean Yield';
      case 'fruit': return 'Mixed Fruits and Vegetables Yield';
      case 'cattle': return 'Cattle Yield';
      case 'alfalfa': return 'Alfalfa Yield';
      case 'grasshay': return 'Grass Hay Yield';
      case 'switchgrass': return 'Switchgrass Yield';
      case 'wood': return 'Wood Yield';
      case 'short': return 'Short-Rotation Woody Biomass Yield';
      default: return 'error type for title:'+text;
    } // switch
  } // end titleText

  /**
  * Update x coordinates by value, not used so far
  *
  * @param Number value
  */
  this.updateX = function(value) {
    x += value;
  };

  /**
  * Update y coordinates by value.
  *
  * @param Number value
  */
  function updateY(value) {
    y += value;
  } // end updateY

} // end Printer()

//######################################################################################
//######################################################################################


//Constructor method for a Results Object
//The results object must be associated with a board
//Tiles should be updated as values are changed, but a results object only needs updated when results are to be displayed
function Results(board) {
  this.phosphorusLoad = [0, 0, 0, 0];
  this.sedimentDelivery = [0, 0, 0, 0];
  this.grossErosion = [0, 0, 0, 0];
  this.nitrateConcentration = [0, 0, 0, 0];
  this.carbonSequestration = [0, 0, 0, 0];
  this.acre = null;
  this.gameWildlifePoints = [0, 0, 0, 0];
  this.biodiversityPoints = [0, 0, 0, 0];
  this.yieldResults = [0, 0, 0, 0];
  this.landUseResults = [0, 0, 0, 0];

  //other secondary variables
  this.nativeVegetationPercent = Array(4);
  this.nativeVegetationHDPercent = Array(4);
  this.nativeVegetationHDorLIPercent = Array(4);
  this.conservationForestPercent = Array(4);
  this.grasslandPercent = Array(4);
  this.wetlandPercent = Array(4);
  this.streamBufferPercent = Array(4);
  this.strategicWetlandPercent = Array(4); //percent of stategic cells actually occupied by wetland
  this.subwatershedArea = Array(22);
  this.wetlandMultiplier = Array(4);
  this.subWatershedNitrate = Array(4);
  this.watershedPercent = Array(4); //nitrate percent levels per watershed for maps
  this.strategicWetlandCells = Array(4);
  this.grossErosionSeverity = Array(4);
  this.phosphorusRiskAssessment = Array(4);
  this.tileNitrate = Array(4);

  //Achievement Score Variables:
  this.conventionalCornLandUseScore = [0, 0, 0, 0];
  this.conservationCornLandUseScore = [0, 0, 0, 0];
  this.conventionalSoybeanLandUseScore = [0, 0, 0, 0];
  this.conservationSoybeanLandUseScore = [0, 0, 0, 0];
  this.mixedFruitsAndVegetablesLandUseScore = [0, 0, 0, 0];
  this.permanentPastureLandUseScore = [0, 0, 0, 0];
  this.rotationalGrazingLandUseScore = [0, 0, 0, 0];
  this.grassHayLandUseScore = [0, 0, 0, 0];
  this.switchgrassLandUseScore = [0, 0, 0, 0];
  this.prairieLandUseScore = [0, 0, 0, 0];
  this.wetlandLandUseScore = [0, 0, 0, 0];
  this.alfalfaLandUseScore = [0, 0, 0, 0];
  this.conventionalForestLandUseScore = [0, 0, 0, 0];
  this.conservationForestLandUseScore = [0, 0, 0, 0];
  this.shortRotationWoodyBioenergyLandUseScore = [0, 0, 0, 0];

  this.gameWildlifePointsScore = [0, 0, 0, 0];
  this.biodiversityPointsScore = [0, 0, 0, 0];
  this.carbonSequestrationScore = [0, 0, 0, 0];
  this.grossErosionScore = [0, 0, 0, 0];
  this.nitrateConcentrationScore = [0, 0, 0, 0];
  this.phosphorusLoadScore = [0, 0, 0, 0];
  this.sedimentDeliveryScore = [0, 0, 0, 0];

  this.cornGrainYieldScore = [0, 0, 0, 0];
  this.soybeanYieldScore = [0, 0, 0, 0];
  this.mixedFruitsAndVegetablesYieldScore = [0, 0, 0, 0];
  this.cattleYieldScore = [0, 0, 0, 0];
  this.alfalfaHayYieldScore = [0, 0, 0, 0];
  this.grassHayYieldScore = [0, 0, 0, 0];
  this.switchgrassYieldScore = [0, 0, 0, 0];
  this.woodYieldScore = [0, 0, 0, 0];
  this.shortRotationWoodyBiomassYieldScore = [0, 0, 0, 0];

  this.totalArea = 0;
  this.totalStreamCells = 0;
  this.totalStrategicWetlandCells = 0;

  this.tileCarbonSequestration = Array(4);
  this.sumCarbonSequestration = [0, 0, 0, 0];

  this.tileGrossErosion = Array(4);

  this.sumPhosphorusLoad = [0, 0, 0, 0];
  this.tilePhosphorusLoad = Array(4);

  this.tileSedimentDelivery = Array(4);
  this.tileYieldResults = Array(4);
  this.tileLandType = Array(4);

  //Function to sum the values of calculatedCarbonSequestration for each tile
  this.sumCarbon = function(tileId, year) {
    // First time loading the board, we need to calculate the results in map level
    if(typeof tileId == 'undefined' && typeof year == 'undefined') {

      this.tileCarbonSequestration = Array(4);
      for(var i = 1; i < 4; i++){
        this.tileCarbonSequestration[i] = [];
      }
      this.sumCarbonSequestration = [0, 0, 0, 0];
      // var tempCarbonSum = [0, 0, 0, 0];
      for (var y = 1; y <= board.calculatedToYear; y++) {

        //For each tile, add the carbon sequestration value to the results array in corresponding year y
        for (var i = 0; i < board.map.length; i++) {
          // tempCarbonSum[y] += board.map[i].results[y].calculatedCarbonSequestration;
          this.sumCarbonSequestration[y] += board.map[i].results[y].calculatedCarbonSequestration;
          this.tileCarbonSequestration[y][i] = board.map[i].results[y].calculatedCarbonSequestration;
        }

        //PEWI calculations are reported in megagrams, the previous calculation in kilograms therefore divide by 1000
        this.carbonSequestration[y] = this.sumCarbonSequestration[y] / 1000;

        // this.carbonSequestration[y] = this.carbonSequestration[y] * (1 / 0.90718474);
      } //end for
    }
    // only one tile is changed, we need to calculate the results in tile level
    else {
      var subCarbonSum = this.sumCarbonSequestration[year] - this.tileCarbonSequestration[year][tileId];

      this.tileCarbonSequestration[year][tileId] = board.map[tileId].results[year].calculatedCarbonSequestration;
      this.sumCarbonSequestration[year] = subCarbonSum + this.tileCarbonSequestration[year][tileId];
      this.carbonSequestration[year] = this.sumCarbonSequestration[year] / 1000;

      // this.carbonSequestration[year] = this.carbonSequestration[year] * (1 / 0.90718474);
    }


  }; //end this.sumCarbon

  //Function to sum the values of calculatedGrossErosion for each tile
  this.sumGrossErosion = function(tileId, year) {

    if(typeof tileId == 'undefined') {
      this.grossErosion = [0, 0, 0, 0];
      this.tileGrossErosion = Array(4);
      for(var i = 1; i < 4; i++){
        this.tileGrossErosion[i] = [];
      }
      for (var y = 1; y <= board.calculatedToYear; y++) {

        //For each tile, add the gross erosion rate value * tile area to the results array in corresponding year y
        for (var i = 0; i < board.map.length; i++) {
          this.grossErosion[y] += board.map[i].results[y].calculatedGrossErosionRate * board.map[i].area;
          this.tileGrossErosion[y][i] = board.map[i].results[y].calculatedGrossErosionRate * board.map[i].area;
        } //end for each tile
      } //end for all year
    }
    else {
      var subErossionSum = this.grossErosion[year] - this.tileGrossErosion[year][tileId];
      this.tileGrossErosion[year][tileId] = board.map[tileId].results[year].calculatedGrossErosionRate * board.map[tileId].area;
      this.grossErosion[year] = subErossionSum + this.tileGrossErosion[year][tileId];
    }

  }; //end this.sumGrossErosion

  //Function to sum the values of phosphorusDelivered for each tile
  // this.sumPhosphorusLoad = [0, 0, 0, 0];
  // this.tilePhosphorusLoad = Array(4);

  this.sumPhosphorus = function(tileId, year) {

    if(typeof tileId == 'undefined') {
      this.sumPhosphorusLoad = [0, 0, 0, 0];
      this.tilePhosphorusLoad = Array(4);
      for(var i = 1; i < 4; i++){
        this.tilePhosphorusLoad[i] = [];
      }
      // var tempPhosphorusSum = [0, 0, 0, 0];

      for (var y = 1; y <= board.calculatedToYear; y++) {

        //For each tile, add the phosphorus delivered value to the results array in corresponding year y
        for (var i = 0; i < board.map.length; i++) {
          this.sumPhosphorusLoad[y] += (board.map[i].results[y].phosphorusDelivered);
          this.tilePhosphorusLoad[y][i] = board.map[i].results[y].phosphorusDelivered;
        } //end for all tiles
        this.phosphorusLoad[y] = (this.sumPhosphorusLoad[y] / 2000);
      } //end for all years

    }
    else {
      var subPhosphorusSum = this.sumPhosphorusLoad[year] - this.tilePhosphorusLoad[year][tileId];

      this.tilePhosphorusLoad[year][tileId] = board.map[tileId].results[year].phosphorusDelivered;
      this.sumPhosphorusLoad[year] = subPhosphorusSum + this.tilePhosphorusLoad[year][tileId];
      this.phosphorusLoad[year] = (this.sumPhosphorusLoad[year] / 2000);
    }

  }; //end this.sumPhosphorus

  //Function to sum the values of sedimentDeliveryToStream
  this.sumSedimentDeliveryToStream = function(tileId, year) {

    if(typeof tileId == 'undefined'){
      this.sedimentDelivery = [0, 0, 0, 0];
      this.tileSedimentDelivery = Array(4);
      for(var i = 1; i < 4; i++){
        this.tileSedimentDelivery[i] = [];
      }
      // var tempSedimentDelivery = [0, 0, 0, 0];

      for (var y = 1; y <= board.calculatedToYear; y++) {

        //For each tile, add the sediment delivery tile value * tile area to the results array in corresponding year y
        for (var i = 0; i < board.map.length; i++) {
          this.sedimentDelivery[y] += (board.map[i].results[y].calculatedSedimentDeliveryToStreamTile * board.map[i].area);
          this.tileSedimentDelivery[y][i] = board.map[i].results[y].calculatedSedimentDeliveryToStreamTile * board.map[i].area;
        } //end for each tile
        // this.sedimentDelivery[y] = tempSedimentDelivery[y];
      } //end for all years
    }
    else {
      var subSedimentDeliverySum = this.sedimentDelivery[year] - this.tileSedimentDelivery[year][tileId];
      this.tileSedimentDelivery[year][tileId] = board.map[tileId].results[year].calculatedSedimentDeliveryToStreamTile * board.map[tileId].area;
      this.sedimentDelivery[year] = subSedimentDeliverySum + this.tileSedimentDelivery[year][tileId];
    }
  }; //end this.sumSedimentDeliveryToStream

  //function to calculate the nitrates for each subWatershed
  //the total value is then the sum of each subWatershed calculation
  this.calculateNitrateConcentration = function() {

    //note, the calculations are done incrementally with the subWatershedNitrate array for clarity
if(typeof tileId == 'undefined'){
    var tempNitrateConcentration = [0, 0, 0, 0];

    for (var y = 1; y <= board.calculatedToYear; y++) {
      var wetlandMultiplier = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      var subWatershedNitrate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (var i = 0; i < board.map.length; i++) {

        subWatershedNitrate[board.map[i].subwatershed] += board.map[i].results[y].cropMultiplier;

        if ((board.map[i].landType[y] == LandUseType.wetland) && board.map[i].strategicWetland == 1) {

          wetlandMultiplier[board.map[i].subwatershed] = 0.48;
        } //end if

      } //end for all cells, adding Crop Multipliers

      for (var s = 1; s < this.subwatershedArea.length; s++) {
        //divide to accomodate for row crop multiplier
        if (subWatershedNitrate[s] == 0 && this.subwatershedArea[s] == 0) {
          subWatershedNitrate[s] = 0;
        } else {
          subWatershedNitrate[s] = subWatershedNitrate[s] / this.subwatershedArea[s];
          subWatershedNitrate[s] = 100 * this.precipitationMultiplier(y) * wetlandMultiplier[s] * subWatershedNitrate[s];

          //Take the maximum between the calculated value and 2
          //see thesis for this imposition of a floor value at 2
          subWatershedNitrate[s] = (subWatershedNitrate[s] < 2) ? 2 : subWatershedNitrate[s];

          //max between calculated and 2, now multiply times subwatershed area divided by total area
          subWatershedNitrate[s] = (subWatershedNitrate[s] * this.subwatershedArea[s]) / this.totalArea;
        }

        //keep a running total of the amount each year by adding together subWatershed values
        tempNitrateConcentration[y] += subWatershedNitrate[s];
      } //end for all watersheds

      this.subWatershedNitrate[y] = subWatershedNitrate;
    } //end for all years

    this.nitrateConcentration = tempNitrateConcentration;
  }

  else{

    var subw = board.map[tileId].subwatershed;
    var score = 0;
    var mult = 1;
    var foundWet = false;
    for (var i = 0; i < board.map.length; i++) {
      if(board.map[i].subwatershed == subw){
        score += board.map[i].results[year].cropMultiplier;
        if((board.map[i].landType[year] == LandUseType.wetland) && board.map[i].strategicWetland == 1 && !foundWet){
          mult=0.48;
          foundWet = true;
        }
      }
    }
    score /= this.subwatershedArea[subw];
    score *= 100*this.precipitationMultiplier(year)*mult;
    score = (score < 2) ? 2 : score;
    score = score * this.subwatershedArea[subw] / this.totalArea;
    this.nitrateConcentration[year] -= this.subWatershedNitrate[year][subw];
    this.subWatershedNitrate[year][subw] = score;
    this.nitrateConcentration[year] += score;

}


  }; //end this.calculateNitrateConcentration()

  //helper methods for assisting in calculateNitrateConcentration
  this.precipitationMultiplier = function(year) {

    if (board.precipitation[year] == 24.58 || board.precipitation[year] == 28.18) // If it's a dry year
    {
      return 0.86;
    } else if (board.precipitation[year] == 30.39 || board.precipitation[year] == 32.16 || board.precipitation[year] == 34.34) { // If it's a normal year
      if (board.precipitation[year - 1] == 24.58 || board.precipitation[year - 1] == 28.18) {
        return 1.69;
      } else {
        return 1;
      }
    } else { // If it's a flood year
      if (board.precipitation[year - 1] == 24.58 || board.precipitation[year - 1] == 28.18) {
        return 2.11;
      } else {
        return 1;
      }
    }
  }; //end this.precipitationMultiplier
  //---end helper methods for assisting in calculateNitrateConcentration

  //preliminary function that sums area and stream network cells (allows flexibility with map layout)
  // IIFE, this function only need to be called once, since all the variables we wanted are constant, it's unnecessary to calculate them again and again.
  // So we could immediately invoke this function to initialize variables
  this.sumArea = (function(self) {
    var tempArea = 0;
    var tempStreamCells = 0; //stream buffer is on a Cell Basis, not area (see table S5)
    var tempStrategicWetlandCells = 0;
    var tempSubwatershedArea = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < board.map.length; i++) {

      tempArea += board.map[i].area;
      //if tile is in stream network
      if (board.map[i].streamNetwork == 1) {
        tempStreamCells += 1;
      }

      //if tile is a strategic wetland
      if (board.map[i].strategicWetland == 1) {
        tempStrategicWetlandCells += 1;
      }

      tempSubwatershedArea[board.map[i].subwatershed] += board.map[i].area;
    } //end for all Cells

    //sum all of the areas of the tiles
    self.totalArea = tempArea;
    self.totalStreamCells = tempStreamCells;
    self.totalStrategicWetlandCells = tempStrategicWetlandCells;
    self.subwatershedArea = tempSubwatershedArea;
    // console.log("self", self);
    // console.log("this.totalArea",self.totalArea);
    // console.log("this.totalStreamCells",self.totalStreamCells);
    // console.log("this.totalStrategicWetlandCells",self.totalStrategicWetlandCells);
    // console.log("this.subwatershedArea",self.subwatershedArea);
  })(this); //end this.sumArea()

  //subcalculations based on flags for biodiversity and game wildlife
  //---These calculations must be done at the board level as they involve tile percentages
  this.sumFlagPercentages = function() {

    //for all years that have been calculated
    for (var y = 1; y <= board.calculatedToYear; y++) {

      var tempAreaNativeVegetation = 0;
      var tempAreaNativeVegetationHD = 0;
      var tempAreaNativeDiverseOrLowInput = 0;
      var tempAreaConservationForest = 0;
      var tempAreaGrassland = 0;
      var tempAreaWetland = 0;
      var tempCellsStreamBuffer = 0;
      var tempCellsWetlandOnStrategic = 0;

      //for all tiles
      for (var i = 0; i < board.map.length; i++) {

        if (board.map[i].results[y].nativeVegetationFlag) {
          tempAreaNativeVegetation += board.map[i].area;
        }

        if (board.map[i].results[y].nativeVegetationHDFlag) {
          tempAreaNativeVegetationHD += board.map[i].area;
        }

        if (board.map[i].results[y].nativeVegatationHDorLIFlag) {
          tempAreaNativeDiverseOrLowInput += board.map[i].area;
        }

        if (board.map[i].results[y].conservationForestFlag) {
          tempAreaConservationForest += board.map[i].area;
        }

        if (board.map[i].results[y].grasslandFlag) {
          tempAreaGrassland += board.map[i].area;
        }

        if (board.map[i].landType[y] == LandUseType.wetland) {
          tempAreaWetland += board.map[i].area;
        }

        if (board.map[i].results[y].streamBufferFlag) {
          tempCellsStreamBuffer += 1;
        }

        if ((board.map[i].landType[y] == LandUseType.wetland) && board.map[i].strategicWetland == 1) {
          tempCellsWetlandOnStrategic += 1;
        }

      } //end for all tiles

      //calculations for percentages and storage of values
      this.nativeVegetationPercent[y] = (tempAreaNativeVegetation / this.totalArea) * 100;
      this.nativeVegetationHDPercent[y] = (tempAreaNativeVegetationHD / this.totalArea) * 100;
      this.nativeVegetationHDorLIPercent[y] = (tempAreaNativeDiverseOrLowInput / this.totalArea) * 100;
      this.conservationForestPercent[y] = (tempAreaConservationForest / this.totalArea) * 100;
      this.grasslandPercent[y] = (tempAreaGrassland / this.totalArea) * 100;
      this.wetlandPercent[y] = (tempAreaWetland / this.totalArea) * 100;
      this.streamBufferPercent[y] = (tempCellsStreamBuffer / this.totalStreamCells) * 100;
      this.strategicWetlandPercent[y] = (tempCellsWetlandOnStrategic / this.totalStrategicWetlandCells) * 100;

      //for results hud
      this.strategicWetlandCells[y] = tempCellsWetlandOnStrategic;

    } //end for loop of all years calculated
  }; //end Sum percentages

  this.calculateGameWildLifePoints = function() {

    this.sumFlagPercentages();

    for (var y = 1; y <= board.calculatedToYear; y++) {
      var tempScore = 0;

      //native vegetation and other high diversity land uses points
      if (this.nativeVegetationHDPercent[y] == 100) {
        tempScore += 4;
      } else if (this.nativeVegetationHDPercent[y] > 50) {
        tempScore += 3;
      } else if (this.nativeVegetationHDPercent[y] > 25) {
        tempScore += 2;
      } else if (this.nativeVegetationHDPercent[y] > 10) {
        tempScore += 1;
      } else {
        tempScore += 0;
      }

      //native vegetation and comparatively high-diversity or low input points
      if (this.nativeVegetationHDorLIPercent[y] == 100) {
        tempScore += 1.5;
      } else if (this.nativeVegetationHDorLIPercent[y] > 50) {
        tempScore += 1;
      } else if (this.nativeVegetationHDorLIPercent[y] > 10) {
        tempScore += .5;
      } else {
        tempScore += 0;
      }

      //conservation forest points
      if (this.conservationForestPercent[y] > 5) {
        tempScore += 1;
      } else {
        tempScore += 0;
      }

      //grassland points
      if (this.grasslandPercent[y] > 5) {
        tempScore += 1;
      } else {
        tempScore += 0;
      }

      //wetland points
      if (this.wetlandPercent[y] > 5) {
        tempScore += 1;
      } else {
        tempScore += 0;
      }

      //stream buffer points
      if (this.streamBufferPercent[y] == 100) {
        tempScore += 1.5;
      } else if (this.streamBufferPercent[y] > 50) {
        tempScore += 1;
      } else if (this.streamBufferPercent[y] > 10) {
        tempScore += 0.5;
      } else {
        tempScore += 0;
      }

      this.gameWildlifePoints[y] = tempScore;

    } //end for loop year

  }; //end calculations of game and wildlife points


  //calculations for the scoreing of biodiversity (done at board level)
  this.calculateBiodiversityPoints = function() {

    for (var y = 1; y <= board.calculatedToYear; y++) {
      var tempScore = 0

      //native vegetation points
      if (this.nativeVegetationPercent[y] == 100) {
        tempScore += 4;
      } else if (this.nativeVegetationPercent[y] > 50) {
        tempScore += 3;
      } else if (this.nativeVegetationPercent[y] > 25) {
        tempScore += 2;
      } else if (this.nativeVegetationPercent[y] > 10) {
        tempScore += 1;
      } else {
        tempScore += 0;
      }

      //native vegetation and other high diversity land uses points
      if (this.nativeVegetationHDPercent[y] == 100) {
        tempScore += 1.5;
      } else if (this.nativeVegetationHDPercent[y] > 50) {
        tempScore += 1;
      } else if (this.nativeVegetationHDPercent[y] > 10) {
        tempScore += 0.5;
      } else {
        tempScore += 0;
      }

      //native vegetation and comparatively high-diversity or low input points
      if (this.nativeVegetationHDorLIPercent[y] == 100) {
        tempScore += 1.5;
      } else if (this.nativeVegetationHDorLIPercent[y] > 50) {
        tempScore += 1;
      } else if (this.nativeVegetationHDorLIPercent[y] > 10) {
        tempScore += .5;
      } else {
        tempScore += 0;
      }

      //wetland points (wholly distinct from Game Wildlife Calcs)
      if (this.wetlandPercent[y] > 5 && this.strategicWetlandPercent == 100) {
        tempScore += 1.5;
      } else if (this.wetlandPercent[y] > 5 && this.strategicWetlandPercent > 75) {
        tempScore += 1;
      } else if (this.wetlandPercent[y] > 5 && this.strategicWetlandPercent > 50) {
        tempScore += 0.5;
      } else {
        tempScore += 0;
      }

      //stream buffer points
      if (this.streamBufferPercent[y] == 100) {
        tempScore += 1.5;
      } else if (this.streamBufferPercent[y] > 50) {
        tempScore += 1;
      } else if (this.streamBufferPercent[y] > 10) {
        tempScore += 0.5;
      } else {
        tempScore += 0;
      }

      this.biodiversityPoints[y] = tempScore;

    } //end for loop year

  }; //end calculations of biodiversity points

  //Function to sum the values of YieldTile to YieldValueArray
  this.sumYields = function(tileId, year) {

    if(typeof tileId == 'undefined'){

      this.yieldResults = Array(4);
      this.yieldResults[0] = {
        cornGrainYield: 0,
        soybeanYield: 0,
        alfalfaHayYield: 0,
        grassHayYield: 0,
        woodYield: 0,
        cattleYield: 0,
        switchgrassYield: 0,
        shortRotationWoodyBiomassYield: 0,
        mixedFruitsAndVegetablesYield: 0,
      };
      this.yieldResults[1] = {
        cornGrainYield: 0,
        soybeanYield: 0,
        alfalfaHayYield: 0,
        grassHayYield: 0,
        woodYield: 0,
        cattleYield: 0,
        switchgrassYield: 0,
        shortRotationWoodyBiomassYield: 0,
        mixedFruitsAndVegetablesYield: 0,
        cornGrainYieldScore: 0
      };
      this.yieldResults[2] = {
        cornGrainYield: 0,
        soybeanYield: 0,
        alfalfaHayYield: 0,
        grassHayYield: 0,
        woodYield: 0,
        cattleYield: 0,
        switchgrassYield: 0,
        shortRotationWoodyBiomassYield: 0,
        mixedFruitsAndVegetablesYield: 0
      };
      this.yieldResults[3] = {
        cornGrainYield: 0,
        soybeanYield: 0,
        alfalfaHayYield: 0,
        grassHayYield: 0,
        woodYield: 0,
        cattleYield: 0,
        switchgrassYield: 0,
        shortRotationWoodyBiomassYield: 0,
        mixedFruitsAndVegetablesYield: 0
      };
      this.tileYieldResults = Array(4);
      for(var i = 1; i < 4; i++){
        this.tileYieldResults[i] = [];
      }
      this.tileLandType = Array(4);
      for(var i = 1; i < 4; i++){
        this.tileLandType[i] = [];
      }

      for (var y = 1; y <= board.calculatedToYear; y++) {

        //For each tile, add the tile yield Values * tile area to variables corresponding to each yield type
        for (var i = 0; i < board.map.length; i++) {

          var yieldValueToStore = board.map[i].results[y].calculatedYieldTile * board.map[i].area;
          this.tileYieldResults[y][i] = board.map[i].results[y].calculatedYieldTile * board.map[i].area;
          this.tileLandType[y][i] = LandUseType.getType(board.map[i].landType[y]);

          switch (LandUseType.getType(board.map[i].landType[y])) {
            case "none":
              //Do Nothing
              break;
            case "conventionalCorn":
              this.yieldResults[y].cornGrainYield += yieldValueToStore;
              break;
            case "conservationCorn":
              this.yieldResults[y].cornGrainYield += yieldValueToStore;
              break;
            case "conventionalSoybean":
              this.yieldResults[y].soybeanYield += yieldValueToStore;
              break;
            case "conservationSoybean":
              this.yieldResults[y].soybeanYield += yieldValueToStore;
              break;
            case "alfalfa":
              this.yieldResults[y].alfalfaHayYield += yieldValueToStore;
              break;
            case "permanentPasture":
              this.yieldResults[y].cattleYield += yieldValueToStore;
              break;
            case "rotationalGrazing":
              this.yieldResults[y].cattleYield += yieldValueToStore;
              break;
            case "grassHay":
              this.yieldResults[y].grassHayYield += yieldValueToStore;
              break;
            case "prairie":
              //Do nothing - does not report yield
              break;
            case "conservationForest":
              this.yieldResults[y].woodYield += yieldValueToStore;
              break;
            case "conventionalForest":
              this.yieldResults[y].woodYield += yieldValueToStore;
              break;
            case "switchgrass":
              this.yieldResults[y].switchgrassYield += yieldValueToStore;
              break;
            case "shortRotationWoodyBioenergy":
              this.yieldResults[y].shortRotationWoodyBiomassYield += yieldValueToStore;
              break;
            case "wetland":
              //Do nothing - does not report yield
              break;
            case "mixedFruitsVegetables":
              this.yieldResults[y].mixedFruitsAndVegetablesYield += yieldValueToStore;
              break;
          }

        }
      }
    }
    else {
      var prevLandType = this.tileLandType[year][tileId];
      var yieldValueToStore = board.map[tileId].results[year].calculatedYieldTile * board.map[tileId].area;
      switch (LandUseType.getType(board.map[tileId].landType[year])) {
        case "none":
          //Do Nothing
          break;
        case "conventionalCorn":
          this.yieldResults[year].cornGrainYield += yieldValueToStore;
          break;
        case "conservationCorn":
          this.yieldResults[year].cornGrainYield += yieldValueToStore;
          break;
        case "conventionalSoybean":
          this.yieldResults[year].soybeanYield += yieldValueToStore;
          break;
        case "conservationSoybean":
          this.yieldResults[year].soybeanYield += yieldValueToStore;
          break;
        case "alfalfa":
          this.yieldResults[year].alfalfaHayYield += yieldValueToStore;
          break;
        case "permanentPasture":
          this.yieldResults[year].cattleYield += yieldValueToStore;
          break;
        case "rotationalGrazing":
          this.yieldResults[year].cattleYield += yieldValueToStore;
          break;
        case "grassHay":
          this.yieldResults[year].grassHayYield += yieldValueToStore;
          break;
        case "prairie":
          //Do nothing - does not report yield
          break;
        case "conservationForest":
          this.yieldResults[year].woodYield += yieldValueToStore;
          break;
        case "conventionalForest":
          this.yieldResults[year].woodYield += yieldValueToStore;
          break;
        case "switchgrass":
          this.yieldResults[year].switchgrassYield += yieldValueToStore;
          break;
        case "shortRotationWoodyBioenergy":
          this.yieldResults[year].shortRotationWoodyBiomassYield += yieldValueToStore;
          break;
        case "wetland":
          //Do nothing - does not report yield
          break;
        case "mixedFruitsVegetables":
          this.yieldResults[year].mixedFruitsAndVegetablesYield += yieldValueToStore;
          break;
      }

      switch (prevLandType){
        case "none":
          //Do Nothing
          break;
        case "conventionalCorn":
          this.yieldResults[year].cornGrainYield -= this.tileYieldResults[year][tileId];
          break;
        case "conservationCorn":
          this.yieldResults[year].cornGrainYield -= this.tileYieldResults[year][tileId];
          break;
        case "conventionalSoybean":
          this.yieldResults[year].soybeanYield -= this.tileYieldResults[year][tileId];
          break;
        case "conservationSoybean":
          this.yieldResults[year].soybeanYield -= this.tileYieldResults[year][tileId];
          break;
        case "alfalfa":
          this.yieldResults[year].alfalfaHayYield -= this.tileYieldResults[year][tileId];
          break;
        case "permanentPasture":
          this.yieldResults[year].cattleYield -= this.tileYieldResults[year][tileId];
          break;
        case "rotationalGrazing":
          this.yieldResults[year].cattleYield -= this.tileYieldResults[year][tileId];
          break;
        case "grassHay":
          this.yieldResults[year].grassHayYield -= this.tileYieldResults[year][tileId];
          break;
        case "prairie":
          //Do nothing - does not report yield
          break;
        case "conservationForest":
          this.yieldResults[year].woodYield -= this.tileYieldResults[year][tileId];
          break;
        case "conventionalForest":
          this.yieldResults[year].woodYield -= this.tileYieldResults[year][tileId];
          break;
        case "switchgrass":
          this.yieldResults[year].switchgrassYield -= this.tileYieldResults[year][tileId];
          break;
        case "shortRotationWoodyBioenergy":
          this.yieldResults[year].shortRotationWoodyBiomassYield -= this.tileYieldResults[year][tileId];
          break;
        case "wetland":
          //Do nothing - does not report yield
          break;
        case "mixedFruitsVegetables":
          this.yieldResults[year].mixedFruitsAndVegetablesYield -= this.tileYieldResults[year][tileId];
          break;
      }
      this.tileYieldResults[year][tileId] = yieldValueToStore;
      this.tileLandType[year][tileId] = LandUseType.getType(board.map[tileId].landType[year]);
    }

    // this.yieldResults = tempYieldRes1ults;

  }; //end sumYields

  //Function to sum the areas of land use to landUseResults
  this.sumLandUse = function() {

    var tempLandUseResults = Array(4);
    tempLandUseResults[0] = {
      conventionalCornLandUse: 0,
      conservationCornLandUse: 0,
      conventionalSoybeanLandUse: 0,
      conservationSoybeanLandUse: 0,
      mixedFruitsVegetablesLandUse: 0,
      permanentPastureLandUse: 0,
      rotationalGrazingLandUse: 0,
      grassHayLandUse: 0,
      switchgrassLandUse: 0,
      prairieLandUse: 0,
      wetlandLandUse: 0,
      alfalfaLandUse: 0,
      conservationForestLandUse: 0,
      conventionalForestLandUse: 0,
      shortRotationWoodyBioenergyLandUse: 0
    };
    tempLandUseResults[1] = {
      conventionalCornLandUse: 0,
      conservationCornLandUse: 0,
      conventionalSoybeanLandUse: 0,
      conservationSoybeanLandUse: 0,
      mixedFruitsVegetablesLandUse: 0,
      permanentPastureLandUse: 0,
      rotationalGrazingLandUse: 0,
      grassHayLandUse: 0,
      switchgrassLandUse: 0,
      prairieLandUse: 0,
      wetlandLandUse: 0,
      alfalfaLandUse: 0,
      conservationForestLandUse: 0,
      conventionalForestLandUse: 0,
      shortRotationWoodyBioenergyLandUse: 0
    };
    tempLandUseResults[2] = {
      conventionalCornLandUse: 0,
      conservationCornLandUse: 0,
      conventionalSoybeanLandUse: 0,
      conservationSoybeanLandUse: 0,
      mixedFruitsVegetablesLandUse: 0,
      permanentPastureLandUse: 0,
      rotationalGrazingLandUse: 0,
      grassHayLandUse: 0,
      switchgrassLandUse: 0,
      prairieLandUse: 0,
      wetlandLandUse: 0,
      alfalfaLandUse: 0,
      conservationForestLandUse: 0,
      conventionalForestLandUse: 0,
      shortRotationWoodyBioenergyLandUse: 0
    };
    tempLandUseResults[3] = {
      conventionalCornLandUse: 0,
      conservationCornLandUse: 0,
      conventionalSoybeanLandUse: 0,
      conservationSoybeanLandUse: 0,
      mixedFruitsVegetablesLandUse: 0,
      permanentPastureLandUse: 0,
      rotationalGrazingLandUse: 0,
      grassHayLandUse: 0,
      switchgrassLandUse: 0,
      prairieLandUse: 0,
      wetlandLandUse: 0,
      alfalfaLandUse: 0,
      conservationForestLandUse: 0,
      conventionalForestLandUse: 0,
      shortRotationWoodyBioenergyLandUse: 0
    };

    for (var y = 1; y <= board.calculatedToYear; y++) {

      //For each tile, add tile area to variables corresponding to each land use type
      for (var i = 0; i < board.map.length; i++) {

        switch (LandUseType.getType(board.map[i].landType[y])) {
          case "none":
            //Do Nothing
            break;
          case "conventionalCorn":
            tempLandUseResults[y].conventionalCornLandUse += board.map[i].area;
            break;
          case "conservationCorn":
            tempLandUseResults[y].conservationCornLandUse += board.map[i].area;
            break;
          case "conventionalSoybean":
            tempLandUseResults[y].conventionalSoybeanLandUse += board.map[i].area;
            break;
          case "conservationSoybean":
            tempLandUseResults[y].conservationSoybeanLandUse += board.map[i].area;
            break;
          case "alfalfa":
            tempLandUseResults[y].alfalfaLandUse += board.map[i].area;
            break;
          case "permanentPasture":
            tempLandUseResults[y].permanentPastureLandUse += board.map[i].area;
            break;
          case "rotationalGrazing":
            tempLandUseResults[y].rotationalGrazingLandUse += board.map[i].area;
            break;
          case "grassHay":
            tempLandUseResults[y].grassHayLandUse += board.map[i].area;
            break;
          case "prairie":
            tempLandUseResults[y].prairieLandUse += board.map[i].area;
            break;
          case "conservationForest":
            tempLandUseResults[y].conservationForestLandUse += board.map[i].area;
            break;
          case "conventionalForest":
            tempLandUseResults[y].conventionalForestLandUse += board.map[i].area;
            break;
          case "switchgrass":
            tempLandUseResults[y].switchgrassLandUse += board.map[i].area;
            break;
          case "shortRotationWoodyBioenergy":
            tempLandUseResults[y].shortRotationWoodyBioenergyLandUse += board.map[i].area;
            break;
          case "wetland":
            tempLandUseResults[y].wetlandLandUse += board.map[i].area;
            break;
          case "mixedFruitsVegetables":
            tempLandUseResults[y].mixedFruitsVegetablesLandUse += board.map[i].area;
            break;
        }

      }

    }

    this.landUseResults = tempLandUseResults;

  }; //end sumLandUse

  //Function to store values of nitrateConcentration, grossErosionRate, and phosphorusRiskAssessment per tile for maps
  //check this function!
  this.mapIt = function() {

    var watershedPercent = Array(4);
    watershedPercent = [
      [],
      [],
      [],
      []
    ];

    var nitrateContribution = Array(4);
    nitrateContribution = [
      [],
      [],
      [],
      []
    ];

    var grossErosionSeverity = Array(4);
    grossErosionSeverity = [
      [],
      [],
      [],
      []
    ];

    var phosphorusRisk = Array(4);
    phosphorusRisk = [
      [],
      [],
      [],
      []
    ];

    var tileNitrate = Array(4);
   tileNitrate = [
     [],
     [],
     [],
     []
   ];

    for (var y = 1; y <= board.calculatedToYear; y++) {

      //For each watershed store nitrate percent contribution
      for (var i = 0; i < this.subwatershedArea.length; i++) {

        watershedPercent[y].push(this.subWatershedNitrate[y][i] / (this.subwatershedArea[i] / this.totalArea) * (this.subwatershedArea[i] / board.watershedArea) / this.nitrateConcentration[y]);

      }

      //For each tile, store grossErosionRate and phosphorusRiskAssessment indices calculated by submethods
      //TODO: Phosphorus Risk Assessment
      for (var i = 0; i < board.map.length; i++) {
        grossErosionSeverity[y].push(this.getGrossErosionSeverity(board.map[i].results[y].calculatedGrossErosionRate));
        phosphorusRisk[y].push(this.getPhosphorusRiskAssessment(board.map[i].results[y].phosphorusDelivered / board.map[i].area));
        nitrateContribution[y].push(watershedPercent[y][board.map[i].subwatershed]);
        tileNitrate[y].push(board.map[i].results[y].calculatedTileNitrate);
      }
    }

    this.watershedPercent = watershedPercent;
    this.nitrateContribution = nitrateContribution;
    this.grossErosionSeverity = grossErosionSeverity;
    this.phosphorusRiskAssessment = phosphorusRisk;
    this.tileNitrate = tileNitrate;


  }; //end this.mapIt

  //Helper method for mapIt function to calculate grossErosionRate tile indicies
  this.getGrossErosionSeverity = function(erosion) {
    if (erosion > 5) return 5;
    else if (erosion <= 5 && erosion >= 3.5) return 4;
    else if (erosion <= 3.5 && erosion > 2) return 3;
    else if (erosion <= 2 && erosion > 0.5) return 2;
    else if (erosion <= 0.5) return 1;
  }; //end this.getGrossErosionSeverity

  //Helper method for mapIt function to calculate phosphorusRiskAssessment tile indicies
  this.getPhosphorusRiskAssessment = function(pindex) {
    if (pindex >= 0 && pindex <= 1) return 1;
    else if (pindex > 1 && pindex <= 2) return 2;
    else if (pindex > 2 && pindex <= 5) return 3;
    else if (pindex > 5 && pindex <= 15) return 4;
    else if (pindex > 15) return 5;
    return "";
  }


  this.updateScores = function(year) {

    // if(typeof year == 'undefined'){
      // var temp = false;
      for (var y = 1; y <= board.calculatedToYear; y++) {
        this.gameWildlifePointsScore[y] = this.gameWildlifePoints[y] * 10;
        this.biodiversityPointsScore[y] = this.biodiversityPoints[y] * 10;
        if(typeof year == 'undefined') {
          this.carbonSequestrationScore[y] = 100 * ((this.carbonSequestration[y] - board.minimums.carbonMin) / (board.maximums.carbonMax - board.minimums.carbonMin));
        }
        else {
          if(year === y) {
            this.carbonSequestrationScore[y] = 100 * ((this.carbonSequestration[y] - board.minimums.carbonMin) / (board.maximums.carbonMax - board.minimums.carbonMin));
          }
        }



        // console.log("this.carbonSequestration[y]", this.carbonSequestration[y]);
        // console.log("board.minimums.carbonMin = ",board.minimums.carbonMin);
        // console.log("board.maximums.carbonMax = ",board.maximums.carbonMax);
        // console.log("board.maximums.carbonMax - board.minimums.carbonMin = ", board.maximums.carbonMax - board.minimums.carbonMin);
        // console.log("this.carbonSequestrationScore[y] / 100 = ", this.carbonSequestrationScore[y] / 100);
        // console.log("this.carbonSequestrationScore[y] / 100 * (board.maximums.carbonMax - board.minimums.carbonMin) = ", this.carbonSequestrationScore[y] / 100 * (board.maximums.carbonMax - board.minimums.carbonMin));
        // console.log("rawValue = ", this.carbonSequestrationScore[y] / 100 * (board.maximums.carbonMax - board.minimums.carbonMin) + board.minimums.carbonMin);
        this.grossErosionScore[y] = 100 * ((board.maximums.erosionMax - this.grossErosion[y]) / (board.maximums.erosionMax - board.minimums.erosionMin));

        this.nitrateConcentrationScore[y] = 100 * ((board.maximums.nitrateMax - this.nitrateConcentration[y]) / (board.maximums.nitrateMax - board.minimums.nitrateMin));
        this.phosphorusLoadScore[y] = 100 * ((board.maximums.phosphorusMax - this.phosphorusLoad[y]) / (board.maximums.phosphorusMax - board.minimums.phosphorusMin));
        this.sedimentDeliveryScore[y] = 100 * ((board.maximums.sedimentMax - this.sedimentDelivery[y]) / (board.maximums.sedimentMax - board.minimums.sedimentMin));

        this.cornGrainYieldScore[y] = 100 * this.yieldResults[y].cornGrainYield / board.maximums.cornMax;
        this.soybeanYieldScore[y] = 100 * this.yieldResults[y].soybeanYield / board.maximums.soybeanMax;
        this.alfalfaHayYieldScore[y] = 100 * this.yieldResults[y].alfalfaHayYield / board.maximums.alfalfaMax;
        this.grassHayYieldScore[y] = 100 * this.yieldResults[y].grassHayYield / board.maximums.grassHayMax;
        this.woodYieldScore[y] = 100 * this.yieldResults[y].woodYield / board.maximums.woodMax;
        this.cattleYieldScore[y] = 100 * this.yieldResults[y].cattleYield / board.maximums.cattleMax;
        this.switchgrassYieldScore[y] = 100 * this.yieldResults[y].switchgrassYield / board.maximums.switchgrassMax;
        this.shortRotationWoodyBiomassYieldScore[y] = 100 * this.yieldResults[y].shortRotationWoodyBiomassYield / board.maximums.shortRotationWoodyBiomassMax;
        this.mixedFruitsAndVegetablesYieldScore[y] = 100 * this.yieldResults[y].mixedFruitsAndVegetablesYield / board.maximums.mixedFruitsAndVegetablesMax;

        this.conventionalCornLandUseScore[y] = 100 * this.landUseResults[y].conventionalCornLandUse / this.totalArea;
        this.conservationCornLandUseScore[y] = 100 * this.landUseResults[y].conservationCornLandUse / this.totalArea;
        this.conventionalSoybeanLandUseScore[y] = 100 * this.landUseResults[y].conventionalSoybeanLandUse / this.totalArea;
        this.conservationSoybeanLandUseScore[y] = 100 * this.landUseResults[y].conservationSoybeanLandUse / this.totalArea;
        this.mixedFruitsAndVegetablesLandUseScore[y] = 100 * this.landUseResults[y].mixedFruitsVegetablesLandUse / this.totalArea;
        this.permanentPastureLandUseScore[y] = 100 * this.landUseResults[y].permanentPastureLandUse / this.totalArea;
        this.rotationalGrazingLandUseScore[y] = 100 * this.landUseResults[y].rotationalGrazingLandUse / this.totalArea;
        this.grassHayLandUseScore[y] = 100 * this.landUseResults[y].grassHayLandUse / this.totalArea;
        this.switchgrassLandUseScore[y] = 100 * this.landUseResults[y].switchgrassLandUse / this.totalArea;
        this.prairieLandUseScore[y] = 100 * this.landUseResults[y].prairieLandUse / this.totalArea;
        this.wetlandLandUseScore[y] = 100 * this.landUseResults[y].wetlandLandUse / this.totalArea;
        this.alfalfaLandUseScore[y] = 100 * this.landUseResults[y].alfalfaLandUse / this.totalARea;
        this.conventionalForestLandUseScore[y] = 100 * this.landUseResults[y].conventionalForestLandUse / this.totalArea;
        this.conservationForestLandUseScore[y] = 100 * this.landUseResults[y].conservationForestLandUse / this.totalArea;
        this.shortRotationWoodyBioenergyLandUseScore[y] = 100 * this.landUseResults[y].shortRotationWoodyBioenergyLandUse / this.totalArea;


      }
    // }
    // else{

    // }

    //Correction for Carbon Sequestrations
    // this.carbonSequestration[currentYear] = this.carbonSequestration[y] * (1 / 0.90718474);

  }



  //================================================
  //updates all the necessary values by going through updated tiles
  //note that some calculations depend on results of other calculations so be careful about reorganizing

  this.update = function(tileId, year) {

    // this.sumArea(); This function only need to called once, since totalArea, totalStreamCells, totalStrategicWetlandCells, subwatershedArea are constant, we don't have to call it every time when update the board

    //update this as functions are added
    this.sumCarbon(tileId, year);
    this.sumGrossErosion(tileId, year);
    this.sumPhosphorus(tileId, year);
    this.sumSedimentDeliveryToStream(tileId, year);
    this.sumYields(tileId, year);
    this.sumLandUse();
    this.calculateNitrateConcentration(tileId, year);
    this.mapIt();

    this.calculateGameWildLifePoints();
    this.calculateBiodiversityPoints(); //Game Wildlife must come first as it alone calls sumFlagPercentages()

    this.updateScores(year);
    // console.log(this.carbonSequestration[1]);

  }; //end this.update()

}; //end construction of results


//######################################################################################
//######################################################################################


//Constructor method for a Tile object
//The tile object is the basic unit of calculation which makes up a board
//When tile values are changed, be sure to call the update method in order to recalculate the tile-level values
function Tile(tileArray, board) {

  //Variable Assignment and definitions
  //The value tileArray is initially pased from initDat
  this.id = tileArray[0];
  this.row = tileArray[1];
  this.column = tileArray[2];
  this.area = Number(tileArray[3]);
  this.baseLandUseType = Number(tileArray[4]);
  this.carbonMax = tileArray[5];
  this.carbonMin = tileArray[6];
  this.cattle = tileArray[7];
  this.cornYield = tileArray[8];
  this.drainageClass = tileArray[9];
  this.erosion = tileArray[10];
  this.floodFrequency = tileArray[11];
  this.group = tileArray[12];
  this.nitratesPPM = tileArray[13];
  this.pIndex = tileArray[14];
  this.sediment = tileArray[15];
  this.soilType = tileArray[16];
  this.soybeanYield = tileArray[17];
  this.streamNetwork = tileArray[18];
  this.subwatershed = Number(tileArray[19]);
  this.timber = tileArray[20];
  this.topography = Number(tileArray[21]);
  this.watershedNitrogenContribution = tileArray[22];
  this.strategicWetland = tileArray[23];
  this.riverStreams = tileArray[24];



  //default settings for land use setup
  //years 4 and 5 are land use types used for calculations of minumum and maximum values
  this.landType = [this.baseLandUseType, Number(tileArray[25]), Number(tileArray[26]), Number(tileArray[27]), LandUseType.prairie, LandUseType.conventionalSoybean];

  //results holding variables
  //these variables hold results from functions that other methods may need, this saves executing a base function multiple times
  this.soilTestP = 0;
  this.hydrogroup = '';
  this.sedimentDeliveryRatio = 0;
  this.runoffCurveNumber = Array(6);
  this.PApplicationRate = Array(6);
  this.rusleValues = Array(6);
  this.ephemeralGullyErosionValue = Array(6);
  this.finalArea = 0;
  this.subWatershedNitrateNoMin = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.subWatershedArea = 0;
  this.cropMult = Array(828);
  this.precipMult = 0;
  this.sumUnderTwo = 0;

  //create a blank results holder sized to hold 3 years of results (year 0 = results[0])
  this.results = Array(4);
  this.results[0] = {};
  this.results[1] = {};
  this.results[2] = {};
  this.results[3] = {};

  //Basic functionality methods
  //---------------------------
  this.getID = function() {
    return this.id;

  };


  //===================================================================================
  //======Main Function, add all other calculation sections to be called in tile update
  this.update = function(upToYear) {

    //will calculate and propage results array up to the year specified
    //be careful when modifying order of the updating functions since some functions use stored results from prior calculations
    for (var y = 1; y <= upToYear; y++) {
      this.flagValues(y);
      this.carbonSequestration(y);
      this.ephemeralGullyErosion(y);
      this.rusle(y);
      this.grossErosionRate(y);
      this.phosphorusDelivery(y); //requires prefactors calculated by rusle and ephemeral
      this.sedimentDeliveryToStreamTile(y); //also requires prefactors calculated by rusle and ephemeral and sedimentDeliveryRatio and bufferFactor
      this.nitrateSubcalculation(y);
      this.yieldTile(y);
    } //end for each year
  }; //end this.update()


  //Since tile Nitrate score requires readings from entire map, it needs its own update function
  //This function is only called by changeLandTypeTileNitrate() in helpersFE
  this.updateNitrate = function(upToYear) {

    for (var y = 1; y <= upToYear; y++) {
      // this.sumAreaHelper(); // We don't have to call this function every single time when landtype is changed, since the Area is constant. Call it once is enough
      this.precipitationMultiplierHelper(y);
      this.cropMultiplierHelper(y);
      this.calculateNitrateConcentrationHelper(y);
      this.sumAreasUnderTwo(y);
      this.tileNitrateCalculation(y);
    } //end for each year

  }; //end this.update()


  //===================================================================================



  //Modules for subcalculations at the tile level
  //---------------------------------------------

  /*----------------------------
  BIODIVERSITY AND GAME WILDLIFE
  ------------------------------*/

  //the basic tile-level methods for biodiversity and game wildlife calculations
  this.flagValues = function(year) {

    //flag native vegetation (for biodiversity calculations only)
    if (this.landType[year] == LandUseType.conservationForest || this.landType[year] == LandUseType.prairie ||
      this.landType[year] == LandUseType.wetland) {

      this.results[year].nativeVegetationFlag = 1;
    } else {
      this.results[year].nativeVegetationFlag = 0;
    } //end elseif for native vegetation

    //flag native vegetation and other high diversity land uses
    if (this.landType[year] == LandUseType.conservationForest || this.landType[year] == LandUseType.conventionalForest ||
      this.landType[year] == LandUseType.mixedFruitsVegetables || this.landType[year] == LandUseType.prairie ||
      this.landType[year] == LandUseType.rotationalGrazing || this.landType[year] == LandUseType.wetland) {

      this.results[year].nativeVegetationHDFlag = 1;
    } else {
      this.results[year].nativeVegetationHDFlag = 0;
    } //end elseif for native vegatation and other high diversity land uses

    //flag native vegatation and comparatively high diversity or low input land uses
    if (this.landType[year] == LandUseType.conservationForest || this.landType[year] == LandUseType.conventionalForest ||
      this.landType[year] == LandUseType.mixedFruitsVegetables || this.landType[year] == LandUseType.prairie ||
      this.landType[year] == LandUseType.rotationalGrazing || this.landType[year] == LandUseType.wetland ||
      this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean ||
      this.landType[year] == LandUseType.grassHay || this.landType[year] == LandUseType.switchgrass ||
      this.landType[year] == LandUseType.shortRotationWoodyBioenergy) {

      this.results[year].nativeVegatationHDorLIFlag = 1;
    } else {
      this.results[year].nativeVegatationHDorLIFlag = 0;
    } //end elseif for native and comparitively high diversity or low input

    //flag conservation forest (not entirely necessary, but we'll work with it for consistency at higher up level)
    if (this.landType[year] == LandUseType.conservationForest) {

      this.results[year].conservationForestFlag = 1;
    } else {
      this.results[year].conservationForestFlag = 0;
    } //end elseif for conservation forest

    //flag grassland category
    if (this.landType[year] == LandUseType.switchgrass || this.landType[year] == LandUseType.prairie ||
      this.landType[year] == LandUseType.rotationalGrazing) {

      this.results[year].grasslandFlag = 1;
    } else {
      this.results[year].grasslandFlag = 0;
    } //end elseif for grassland category

    //stream buffer flag
    if (this.streamNetwork == 1) {
      //if tile is a part of the stream network
      if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationForest ||
        this.landType[year] == LandUseType.conservationSoybean || this.landType[year] == LandUseType.conventionalForest ||
        this.landType[year] == LandUseType.grassHay || this.landType[year] == LandUseType.switchgrass ||
        this.landType[year] == LandUseType.mixedFruitsVegetables || this.landType[year] == LandUseType.prairie ||
        this.landType[year] == LandUseType.rotationalGrazing || this.landType[year] == LandUseType.shortRotationWoodyBioenergy ||
        this.landType[year] == LandUseType.wetland) {

        this.results[year].streamBufferFlag = 1;
      } else {
        this.results[year].streamBufferFlag = 0;
      }
    } else {
      this.results[year].streamBufferFlag = 0;
    } //end elseif for stream buffer flag

  }; //end this.flagValues



  //This function calculates the Nitrate score for an individual Tile
  //The scoring works as follows:
  /**
  -All the helper functions are called before the main function is, in order to update object-scope variables
  -Checks if subwatershed contains in-use strategic wetland, updates score value accordingly
  -If the tile is in a subwatershed with a score of <2, more processing is required
    -Calculates difference between subwatershed Nitrate score and 2
    -Calculates quotient of the difference and the sum of the areas (with subwatershed score under 2)
    -Adds product of quotient amd area of current Tile to score
  -Updates calculatedTileNitrate value and then we're done, now on to the next Tile
  **/
  this.tileNitrateCalculation = function(year){
    var subwatershed = this.subwatershed;
    var precip = this.precipMult;
    var crop = this.cropMult[this.id-1];
    var area = this.area;
    var sut = this.sumUnderTwo;
    var res = this.subWatershedNitrateNoMin;
    var score = 100*precip*crop*area;
    var wetlandMultiplier = 1;
    //Determine if there is a strategic wetland in use in this Tile's subWatershed
    for(var t = 0, tl=board.map.length; t < tl; t++){
      if ((subwatershed == board.map[t].subwatershed) && (board.map[t].landType[year] == LandUseType.wetland) && board.map[t].strategicWetland == 1) {
        wetlandMultiplier = 0.48;
        break;
      }
    }
    score *= wetlandMultiplier;

    //If Tile is in subwatershed with score below 2, do more stuff
    if(res[subwatershed]<2){
      var diff = 2-res[subwatershed];
      var paa = diff/sut;  //per-acr-adjustment
      score+=paa*this.area;
    }

    this.results[year].calculatedTileNitrate = score;

  };//end this.tileNitrateCalculation


  //Helper method, similiar calculations as in Results but no 2 minimum and removed other functionality
  //that is unecessary for Tile Nitrate calculations
  this.calculateNitrateConcentrationHelper = function(year) {

      var areaArr = this.subWatershedArea;
      var areaTotal = this.finalArea;
      var precip = this.precipMult;
      var tempNitrateConcentration = [0, 0, 0, 0];

      var wetlandMultiplier = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      var subWatershedNitrateNoMin = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var i = 0, il=board.map.length; i < il; i++) {


        subWatershedNitrateNoMin[board.map[i].subwatershed] += this.cropMult[i];
        if ((board.map[i].landType[year] == LandUseType.wetland) && board.map[i].strategicWetland == 1) {
          wetlandMultiplier[board.map[i].subwatershed] = 0.48;
        } //end if
      } //end for all cells, adding Crop Multipliers

      for (var s = 1, sl=areaArr.length; s < sl; s++) {
        //divide to accomodate for row crop multiplier
        if (subWatershedNitrateNoMin[s] == 0 && areaArr[s] == 0) {
          subWatershedNitrateNoMin[s] = 0;
        } else {
          subWatershedNitrateNoMin[s] /= areaArr[s];
          subWatershedNitrateNoMin[s] *= 100 * precip * wetlandMultiplier[s] * (areaArr[s]/areaTotal);
        }
      } //end for all watersheds

      this.subWatershedNitrateNoMin = subWatershedNitrateNoMin;
  }; //end this.calculateNitrateConcentrationHelper()

  //This function sums the area of the entire map
  this.sumAreaHelper = function() {
    var tempArea = 0;
    var tempSubwatershedArea = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0, il=board.map.length; i < il; i++) {
      tempArea += board.map[i].area;
      tempSubwatershedArea[board.map[i].subwatershed] += board.map[i].area;
    } //end for all Cells

    this.finalArea = tempArea;
    this.subWatershedArea =  tempSubwatershedArea;
    // console.log("this.finalArea",this.finalArea);
    // console.log("this.subWatershedArea",this.subWatershedArea);
  }; //end this.sumAreaHelper()


  //Helper method, does same calculations as Results.nitrateSubcalculation but updates values
  //for use in Tile Nitrate calculation
  this.cropMultiplierHelper = function(year) {
    for(var i=0, il=board.map.length; i<il; i++){
    if ((board.map[i].landType[year] > LandUseType.none && board.map[i].landType[year] < LandUseType.alfalfa) || board.map[i].landType[year] == LandUseType.mixedFruitsVegetables) {
      if (board.map[i].landType[year] == LandUseType.conservationCorn || board.map[i].landType[year] == LandUseType.conservationSoybean) {
        if (board.map[i].soilType == "A" || board.map[i].soilType == "B" || board.map[i].soilType == "C" || board.map[i].soilType == "L" || board.map[i].soilType == "N" || board.map[i].soilType == "O") {
          this.cropMult[i] = 0.14 * board.map[i].area * 0.69;
        } else {
          this.cropMult[i] = 0.14 * board.map[i].area * 0.62;
        }
      } else {
        this.cropMult[i] = 0.14 * board.map[i].area;
      }
    } else {
      this.cropMult[i] = 0;
    }
  }

  }; //end this.cropMultiplierHelper

  //Helper method, same calculations as Results.precipitationMultiplier
  this.precipitationMultiplierHelper = function(year){
    if (board.precipitation[year] == 24.58 || board.precipitation[year] == 28.18) // If it's a dry year
    {
      this.precipMult = 0.86;
    } else if (board.precipitation[year] == 30.39 || board.precipitation[year] == 32.16 || board.precipitation[year] == 34.34) { // If it's a normal year
      if (board.precipitation[year - 1] == 24.58 || board.precipitation[year - 1] == 28.18) {
        this.precipMult = 1.69;
      } else {
        this.precipMult = 1;
      }
    } else { // If it's a flood year
      if (board.precipitation[year - 1] == 24.58 || board.precipitation[year - 1] == 28.18) {
        this.precipMult = 2.11;
      } else {
        this.precipMult = 1;
      }
    }
  };//end this.precipitationMultiplierHelper

  //This function sums the area of all the tiles residing within subwatersheds
  //that have a Nitrate score under 2
  this.sumAreasUnderTwo = function(year){
    var sum = 0;
    var arr = this.subWatershedNitrateNoMin;
    for(var i=0, il=board.map.length; i<il; i++){
      if(arr[board.map[i].subwatershed]<2){
        sum+=board.map[i].area;
      }
    }
    this.sumUnderTwo = sum;
  };//end this.sumAreasUnderTwo()



  /*----------------------------
       CARBON SEQUESTRATION
  ------------------------------*/

  //the tile-level method for carbon sequestration calculations
  this.carbonSequestration = function(year) {
    //Array of possible values of carbon sequestration per unit area sorted by landUseType
    if(this.id==827){
      var debug=true;
    }
    var carbonMultiplier = [0, 0, 161.87, 0, 161.87, 202.34, 117.36, 117.36, 117.36, 433.01, 1485.20, 1485.20, 485.62, 1897.98, 1234.29, 0];

    //Retrieve value of carbon sequestion and multiply by tile area
    this.results[year].calculatedCarbonSequestration = carbonMultiplier[this.landType[year]] * this.area;
  }; //end this.carbonSequestration


  /*----------------------------
         GROSS EROSION
  ------------------------------*/

  //the tile-level method for gross erosion rate calculations
  this.grossErosionRate = function(year) {

    this.results[year].calculatedGrossErosionRate = this.rusleValues[year] + this.ephemeralGullyErosionValue[year];

  }; //end this.grossErosionRate

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //Begin Methods that assist grossErosionRate

  //Calculate rusle and save to variable inside Tile rusleValues
  this.rusle = function(year) {
    this.rusleValues[year] = this.rainfallRunoffErosivityFactor(year) * this.soilErodibilityFactor() * this.slopeLengthSteepnessFactor(year) * this.coverManagementFactor(year) * this.supportPracticeFactor(year);
  }; //end this.rusle

  //Calculate rainfallRunoffErosivityFactor for rusle
  this.rainfallRunoffErosivityFactor = function(year) {
    if (board.precipitation[year] <= 33.46) {
      return (0.0483 * (Math.pow((board.precipitation[year] * 25.4), 1.61))) / 17.02;
    } else return (587.8 - (1.219 * board.precipitation[year] * 25.4) + (0.004105 * (Math.pow((board.precipitation[year] * 25.4), 2)))) / 17.02;
  }; //end this.rainfallRunoffErosivityFactor

  //Calculate soilErodibilityFactor for rusle
  //based on soil type, which is assigned permanently to each cell
  this.soilErodibilityFactor = function() {
    switch (this.soilType) {
      case "A":
        return 0.24;
      case "B":
        return 0.2;
      case "C":
        return 0.28;
      case "D":
        return 0.32;
      case "G":
        return 0.32;
      case "K":
        return 0.37;
      case "L":
        return 0.24;
      case "M":
        return 0.28;
      case "N":
        return 0.24;
      case "O":
        return 0.32;
      case "Q":
        return 0.28;
      case "T":
        return 0.28;
      case "Y":
        return 0.37;
      case "0":
        return 0;
    } //end switch
  }; //end this.soilErodibilityFactor

  //Calculate slopeLengthSteepnessFactor for rusle
  //compare values with LandUseType
  this.slopeLengthSteepnessFactor = function(year) {
    if (this.landType[year] > LandUseType.none) {
      if ((this.landType[year] > LandUseType.none && this.landType[year] < LandUseType.permanentPasture) || this.landType[year] == LandUseType.mixedFruitsVegetables) {
        if (this.topography == 0) return 0.05;
        else if (this.topography == 1) return 0.31;
        else if (this.topography == 2) return 0.67;
        else if (this.topography == 3) return 1.26;
        else if (this.topography == 4) return 1.79;
        else if (this.topography == 5) return 2.2;
      } else if (this.landType[year] == LandUseType.permanentPasture || this.landType[year] == LandUseType.rotationalGrazing) {
        if (this.topography == 0) return 0.05;
        else if (this.topography == 1) return 0.28;
        else if (this.topography == 2) return 0.58;
        else if (this.topography == 3) return 1.12;
        else if (this.topography == 4) return 1.69;
        else if (this.topography == 5) return 2.18;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  }; //end this.slopeLengthSteepnessFactor

  //Calculate coverManagementFactor for rusle
  this.coverManagementFactor = function(year) {

    //If year == 5, then we are calculating the maximum for Conventional Soybean
    //value 0.3 must be returned because previous year land type is not relevant for maximum
    if (year == 5 && this.landType[year] == LandUseType.conventionalSoybean) {
      return 0.3;
    }

    //Depends on landType uses for current and previous year
    if (this.landType[year] == LandUseType.none) {
      return 0;
    } else if (this.landType[year] >= LandUseType.alfalfa && this.landType[year] <= LandUseType.wetland) {
      switch (LandUseType.getType(this.landType[year])) {
        case "alfalfa":
          return 0.005;
        case "permanentPasture":
          return 0.03;
        case "rotationalGrazing":
          return 0.02;
        case "grassHay":
          return 0.005;
        case "prairie":
          return 0.001;
        case "conservationForest":
          return 0.004;
        case "conventionalForest":
          return 0.004;
        case "switchgrass":
          return 0.001;
        case "shortRotationWoodyBioenergy":
          return 0.004;
        case "wetland":
          return 0.005;
      } //end switch
    } //end else
    else if (this.landType[year - 1] == LandUseType.conventionalCorn) {
      switch (LandUseType.getType(this.landType[year])) {
        case "conservationCorn":
          return 0.085;
        case "conservationSoybean":
          return 0.116;
        case "conventionalCorn":
          return 0.150;
        case "conventionalSoybean":
          return 0.200;
        case "mixedFruitsVegetables":
          return 0.200;
      } //end swich
    } //end else
    else if (this.landType[year - 1] == LandUseType.conservationCorn) {
      switch (LandUseType.getType(this.landType[year])) {
        case "conservationCorn":
          return 0.020;
        case "conservationSoybean":
          return 0.031;
        case "conventionalCorn":
          return 0.085;
        case "conventionalSoybean":
          return 0.116;
        case "mixedFruitsVegetables":
          return 0.116;
      } //end switch
    } //end else
    else if ((this.landType[year - 1] == LandUseType.conventionalSoybean) || (this.landType[year - 1] == LandUseType.mixedFruitsVegetables)) {
      switch (LandUseType.getType(this.landType[year])) {
        case "conservationCorn":
          return 0.156;
        case "conservationSoybean":
          return 0.178;
        case "conventionalCorn":
          return 0.260;
        case "conventionalSoybean":
          return 0.300;
        case "mixedFruitsVegetables":
          return 0.300;
      } //end switch
    } //end else
    else if (this.landType[year - 1] == LandUseType.conservationSoybean) {
      switch (LandUseType.getType(this.landType[year])) {
        case "conservationCorn":
          return 0.052;
        case "conservationSoybean":
          return 0.055;
        case "conventionalCorn":
          return 0.156;
        case "conventionalSoybean":
          return 0.178;
        case "mixedFruitsVegetables":
          return 0.178;
      } //end switch
    } //end else
    else {
      switch (LandUseType.getType(this.landType[year])) {
        case "conservationCorn":
          return 0.020;
        case "conservationSoybean":
          return 0.031;
        case "conventionalCorn":
          return 0.085;
        case "conventionalSoybean":
          return 0.116;
        case "mixedFruitsVegetables":
          return 0.116;
      } //end switch
    } //end elseif
  }; //end this.coverManagementFactor

  //Calculate supportPracticeFactor for rusle
  this.supportPracticeFactor = function(year) {
    if (this.landType[year] == LandUseType.none) {
      return 0;
    } else {
      if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean) {
        if (this.topography > 1) {
          return this.contourSubfactor(year) * this.terraceSubfactor();
        }
      }
      return 1;
    } //end elseif
  }; //end this.supportPracticeFactor

  //Calculate terraceSubfactor for supportPracticeFactor
  this.terraceSubfactor = function() {
    var temp = this.terraceInterval();
    if (temp < 100) return 0.5;
    else if (temp >= 100 && temp < 140) return 0.6;
    else if (temp >= 140 && temp < 180) return 0.7;
    else if (temp >= 180 && temp < 225) return 0.8;
    else if (temp >= 225 && temp < 300) return 0.9;
    else if (temp >= 300) return 1;
  }; //end this.terraceSubfactor

  //Calculate terraceInterval for terraceSubfactor
  this.terraceInterval = function() {
    var temp = this.slopeSteepnessFactor();
    if (temp == 0.002) return 300;
    else if (temp == 0.02) return 240;
    else if (temp == 0.04) return 180;
    else if (temp == 0.08) return 150;
    else if (temp == 0.12) return 120;
    else if (temp == 0.16) return 105;
  }; //end this.terraceInterval

  //Calculate contourSubfactor for supportPracticeFactor
  this.contourSubfactor = function(year) {
    var temp = this.slopeSteepnessFactor();
    if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean) {
      if (temp == 0.04) return (0.9 + 0.95) / 2;
      else if (temp == 0.08) return (0.85 + 0.9) / 2;
      else if (temp == 0.12) return 0.9;
      else if (temp == 0.16) return 1;
    }
    return 1;
  }; //end this.contourSubfactor

  //Calculate slopeSteepnessFactor for contourSubfactor
  this.slopeSteepnessFactor = function() {
    if (this.topography == 0) return 0.002;
    else if (this.topography == 1) return 0.02;
    else if (this.topography == 2) return 0.04;
    else if (this.topography == 3) return 0.08;
    else if (this.topography == 4) return 0.12;
    else if (this.topography == 5) return 0.16;
  }; //end this.slopeSteepnessFactor

  //Calculate ephemeralGullyErosion for GrossErosionRate
  this.ephemeralGullyErosion = function(year) {
    var cover = this.landType[year];
    if (cover == LandUseType.conventionalCorn || cover == LandUseType.conventionalSoybean || cover == LandUseType.mixedFruitsVegetables) this.ephemeralGullyErosionValue[year] = 4.5;
    else if (cover == LandUseType.conservationCorn || cover == LandUseType.conservationSoybean || cover == LandUseType.alfalfa) this.ephemeralGullyErosionValue[year] = 1.5;
    else this.ephemeralGullyErosionValue[year] = 0;
  }; //end this.ephemeralGullyErosion

  //End Methods that assist grossErosionRate
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  /*----------------------------
       PHOSPHORUS DELIVERY
  ------------------------------*/

  //the tile-level calculations for phosphorous delivery to stream
  this.phosphorusDelivery = function(year) {
    //update various parameters needed by phosphorus subcalculations
    this.updatePhosphorusParameters(year);
    //calculate phoshorus Delivered across tile
    this.results[year].phosphorusDelivered = this.area * (this.erosionComponent(year) + this.drainageComponent(year) + this.runoffComponent(year));
  }; //end this.phosphorusDelivery

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //Begin Methods that assist phosphorusDelivery

  //helper method for calculation of PApplicationRate
  this.getSeasonalUtilizationRate = function(year) {
    if (this.landType[year] == LandUseType.permanentPasture) return 0.35;
    //Note: Year 5 condition below allows 0.55 to be selected when calculating max value for cattle yield
    else if (this.landType[year] == LandUseType.rotationalGrazing || year == 5) return 0.55;
    else return 0;
  }; //end this.getSeasonalUtilizationRate

  //function returns Cattle Average Daily Intake
  this.getCattleAverageDailyIntake = function() {
    var cattleBodyWeight = 1200;
    return 0.03 * cattleBodyWeight;
  }; //end this.getCattleAverageDailyIntake

  //function updates prequisite values for phosphorus subcalculations
  this.updatePhosphorusParameters = function(year) {
    //updateSubsoilType and permeabilityCode
    switch (this.soilType) {
      case "A":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
      case "B":
        this.subsoilGroup = 1;
        this.permeabilityCode = 10;
        break;
      case "C":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
      case "D":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
      case "G":
        this.subsoilGroup = 3;
        this.permeabilityCode = 80;
        break;
      case "K":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
      case "L":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
      case "M":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
      case "N":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
      case "O":
        this.subsoilGroup = 1;
        this.permeabilityCode = 55;
        break;
      case "Q":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
      case "T":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
      case "Y":
        this.subsoilGroup = 1;
        this.permeabilityCode = 50;
        break;
    } //end switch


    //updateTopographyFactors
    switch (this.topography) {
      case 0:
        this.topoSlopeRangeHigh = 0;
        break;
      case 1:
        this.topoSlopeRangeHigh = 2;
        break;
      case 2:
        this.topoSlopeRangeHigh = 5;
        break;
      case 3:
        this.topoSlopeRangeHigh = 9;
        break;
      case 4:
        this.topoSlopeRangeHigh = 14;
        break;
      case 5:
        this.topoSlopeRangeHigh = 18;
        break;
    } //end switch

    //soilTestP assignment
    if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' ||
      this.soilType == 'N' || this.soilType == 'O') {
      this.soilTestP = 30;
    } else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' ||
      this.soilType == 'M' || this.soilType == 'Q' || this.soilType == 'T' ||
      this.soilType == 'Y') {
      this.soilTestP = 27;
    } //end elseif

    //hydroglogicGroup
    switch (this.soilType) {
      case 'A':
        this.hydrogroup = 'B';
        break;
      case 'B':
        this.hydrogroup = 'B';
        break;
      case 'C':
        this.hydrogroup = 'B/D';
        break;
      case 'D':
        this.hydrogroup = 'B';
        break;
      case 'G':
        this.hydrogroup = 'C';
        break;
      case 'K':
        this.hydrogroup = 'B/D';
        break;
      case 'L':
        this.hydrogroup = 'B/D';
        break;
      case 'M':
        this.hydrogroup = 'B';
        break;
      case 'N':
        this.hydrogroup = 'B';
        break;
      case 'O':
        this.hydrogroup = 'B/D';
        break;
      case 'Q':
        this.hydrogroup = 'B';
        break;
      case 'T':
        this.hydrogroup = 'B';
        break;
      case 'Y':
        this.hydrogroup = 'B';
        break;
      default:
        this.hydrogroup = '';
        break;
    } //end switch

    //runoffCurveNumber[year]
    //this is very messy, from the original code and matches thesis
    //this should probably be rewritten as a fall-through switch statement at some point
    var flowfactor = this.getFlowFactor(year);

    if (this.landType[year] == LandUseType.conventionalCorn || this.landType[year] == LandUseType.conventionalSoybean || this.landType[year] == LandUseType.mixedFruitsVegetables) {
      if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 72;
      else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
          'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 81;
      else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 88;
      else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
        this.runoffCurveNumber[year] = 91;
    } else if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean) {
      if (this.topography == 0 || this.topography == 1 || this.topography == 2 || this.topography == 3) {
        if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 64;
        else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
            'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 74;
        else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 81;
        else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor ==
          0) this.runoffCurveNumber[year] = 85;
      } else if (this.topography == 4 || this.topography == 5) {
        if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 61;
        else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
            'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 70;
        else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 77;
        else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor ==
          0) this.runoffCurveNumber[year] = 80;
      }
    } else if (this.landType[year] == LandUseType.alfalfa) {
      if (this.topography == 0 || this.topography == 1 || this.topography == 2 || this.topography == 3) {
        if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 58;
        else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
            'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 72;
        else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 81;
        else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor ==
          0) this.runoffCurveNumber[year] = 85;
      } else if (this.topography == 4 || this.topography == 5) {
        if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 55;
        else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
            'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 69;
        else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 78;
        else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor ==
          0) this.runoffCurveNumber[year] = 83;
      }
    } else if (this.landType[year] == LandUseType.permanentPasture) {
      if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 68;
      else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
          'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 79;
      else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 86;
      else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
        this.runoffCurveNumber[year] = 89;
    } else if (this.landType[year] == LandUseType.rotationalGrazing) {
      if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 49;
      else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
          'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 69;
      else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 79;
      else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
        this.runoffCurveNumber[year] = 84;
    } else if (this.landType[year] == LandUseType.grassHay || this.landType[year] == LandUseType.switchgrass) {
      if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 30;
      else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
          'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 58;
      else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 71;
      else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
        this.runoffCurveNumber[year] = 78;
    } else if (this.landType[year] == LandUseType.prairie || this.landType[year] == LandUseType.wetland) {
      if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 30;
      else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
          'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 48;
      else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 65;
      else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
        this.runoffCurveNumber[year] = 73;
    } else if (this.landType[year] == LandUseType.conservationForest || this.landType[year] == LandUseType.conventionalForest || this.landType[year] == LandUseType.shortRotationWoodyBioenergy) {
      if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 30;
      else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
          'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 55;
      else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 70;
      else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
        this.runoffCurveNumber[year] = 77;
    } else {
      this.runoffCurveNumber[year] = 1;
    } //end elseif

    //set this.PApplicationRate
    if (this.landType[year] == LandUseType.conventionalCorn || this.landType[year] == LandUseType.conservationCorn) {
      if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' || this.soilType ==
        'N' || this.soilType == 'O') this.PApplicationRate[year] = 59;
      else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' || this.soilType == 'M' ||
        this.soilType == 'Q' || this.soilType == 'T' || this.soilType == 'Y') this.PApplicationRate[year] = 58;
    } else if (this.landType[year] == LandUseType.conventionalSoybean || this.landType[year] == LandUseType.conservationSoybean) {
      if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' || this.soilType ==
        'N' || this.soilType == 'O') this.PApplicationRate[year] = 35;
      else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' || this.soilType == 'M' ||
        this.soilType == 'Q' || this.soilType == 'T' || this.soilType == 'Y') this.PApplicationRate[year] = 38;
    } else if (this.landType[year] == LandUseType.alfalfa) {
      var retvar;
      switch (this.soilType) {
        case 'A':
          retvar = 6.3;
          break;
        case 'B':
          retvar = 3.6;
          break;
        case 'C':
          retvar = 4.3;
          break;
        case 'D':
          retvar = 5.6;
          break;
        case 'G':
          retvar = 3.6;
          break;
        case 'K':
          retvar = 4.1;
          break;
        case 'L':
          retvar = 4.2;
          break;
        case 'M':
          retvar = 6.5;
          break;
        case 'N':
          retvar = 6.4;
          break;
        case 'O':
          retvar = 3.6;
          break;
        case 'Q':
          retvar = 6.9;
          break;
        case 'T':
          retvar = 6.7;
          break;
        case 'Y':
          retvar = 6.3;
          break;
        default:
          break;
      }
      this.PApplicationRate[year] = retvar * 13;
    } else if (this.landType[year] == LandUseType.permanentPasture || this.landType[year] == LandUseType.rotationalGrazing) {
      var retvar;
      switch (this.soilType) {
        case 'A':
          retvar = 6.3;
          break;
        case 'B':
          retvar = 3.6;
          break;
        case 'C':
          retvar = 4.3;
          break;
        case 'D':
          retvar = 5.6;
          break;
        case 'G':
          retvar = 3.6;
          break;
        case 'K':
          retvar = 4.1;
          break;
        case 'L':
          retvar = 4.2;
          break;
        case 'M':
          retvar = 6.5;
          break;
        case 'N':
          retvar = 6.4;
          break;
        case 'O':
          retvar = 3.6;
          break;
        case 'Q':
          retvar = 6.9;
          break;
        case 'T':
          retvar = 6.7;
          break;
        case 'Y':
          retvar = 6.3;
          break;
        default:
          break;
      }
      this.PApplicationRate[year] = (retvar * 0.053 * 2.2 * 2.29 * (this.getSeasonalUtilizationRate(year)) / (
        this.getCattleAverageDailyIntake() / 2000));
    } else if (this.landType[year] == LandUseType.grassHay) {
      if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' || this.soilType ==
        'N' || this.soilType == 'O') this.PApplicationRate[year] = 34;
      else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' || this.soilType == 'M' || this.soilType ==
        'Q' || this.soilType == 'T' || this.soilType == 'Y') this.PApplicationRate[year] = 39;
    } else
    if (this.landType[year] == LandUseType.mixedFruitsVegetables) {
      this.PApplicationRate[year] = (3 * 5 * 0.25) + (15 * 2.8 * 0.25);
    } else {
      this.PApplicationRate[year] = 0;
    } //end PApplicationRate


    //set sedimentDeliveryRatio
    if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' || this.soilType == 'N' || this.soilType == 'O') {
      this.sedimentDeliveryRatio = (Math.pow(10, (Math.log10(4 / 6) * Math.log10(board.watershedArea) + (Math.log10(4) - (4 * Math.log10(4 / 6)))))) / 100;
    } else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' || this.soilType == 'M' || this.soilType == 'Q' || this.soilType == 'T' ||
      this.soilType == 'Y') {
      this.sedimentDeliveryRatio = (Math.pow(10, (Math.log10(26 / 35) * Math.log10(board.watershedArea) + (Math.log10(26) - (4 * Math.log10(26 / 35)))))) / 100;
    }
  }; //end updatePhosphorusParameters

  //the drainageComponent of Phosphorus Calculations
  this.drainageComponent = function(year) {
    return this.precipitationFactor(year) * this.getFlowFactor() * this.getSoilTestPDrainageFactor();
  };

  //the runoffComponent of Phosphous Calculations
  this.runoffComponent = function(year) {
    var temp = this.runoffFactor(year) * this.precipitationFactor(year) * (this.getSoilTestPRunoffFactor() + this.getPApplicationFactor(year));
    if (temp > 0) {
      return temp;
    }
    return 0; //else not a valid square and set phosphorus to 0
  };

  //ambiguity between thesis and pewi program (check where to divide by 2000)
  //the erosionComponent of Phosphorus Calculatiosn
  this.erosionComponent = function(year) {
    return ((this.rusleValues[year] + this.ephemeralGullyErosionValue[year]) *
      this.sedimentDeliveryRatio * this.bufferFactor(year) * this.enrichmentFactor(year) * this.soilTestPErosionFactor());

  };

  //--------drainageComponent Subcalculations
  this.precipitationFactor = function(year) {
    return board.precipitation[year] / 4.415;
  };

  this.getFlowFactor = function(year) {
    if (this.topoSlopeRangeHigh <= 5 && this.drainageClass >= 60 && (this.subsoilGroup == 1 || this.subsoilGroup == 2)) {
      return 0.1;
    } else if (this.permeabilityCode <= 35 || this.permeabilityCode == 58 || this.permeabilityCode == 72 || this.permeabilityCode == 75) {
      return 0.1;
    } else {
      return 0;
    }
  };

  this.getSoilTestPDrainageFactor = function() {

    if (this.soilTestP <= 100) {
      return 0.1;
    } else if (this.soilTestP > 100) {
      return 0.2;
    }
  };
  //-------end drainage subCalcs


  //------runoffComponent Subcalculations
  this.runoffFactor = function(year) {
    return (0.000000799 * Math.pow(this.runoffCurveNumber[year], 3)) - (0.0000484 * Math.pow(this.runoffCurveNumber[
      year], 2)) + (0.00265 * this.runoffCurveNumber[year] - 0.085);
  };

  this.getSoilTestPRunoffFactor = function() {
    return 0.05 + (0.005 * this.soilTestP);
  };

  this.getPApplicationFactor = function(year) {

    if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean || this.landType[year] == LandUseType.permanentPasture ||
      this.landType[year] == LandUseType.rotationalGrazing || this.landType[year] == LandUseType.grassHay) {
      return (this.PApplicationRate[year] / 4.58) * 0.5 * 1 * 0.005;
    } else if (this.landType[year] == LandUseType.alfalfa) {
      return (this.PApplicationRate[year] / 4.58) * 0.5 * 0.9 * 0.005;
    } else if (this.landType[year] == LandUseType.conventionalCorn || this.landType[year] == LandUseType.conventionalSoybean ||
      this.landType[year] == LandUseType.mixedFruitsVegetables) {
      return (this.PApplicationRate[year] / 4.58) * 0.5 * ((0.6 + 1.0) / 2) * 0.005;
    }
    return 0;
  };
  //-------end runoffComponent subCalcs

  //-------erosionComponent Subcalculations
  this.soilTestPErosionFactor = function() {
    return (0.7 * (500 + 3 * this.soilTestP)) * (2000 / 1000000);
  };

  this.enrichmentFactor = function(year) {
    if (this.landType[year] == LandUseType.conventionalCorn || this.landType[year] == LandUseType.conventionalSoybean ||
      this.landType[year] == LandUseType.mixedFruitsVegetables) {
      return 1.1;
    } else {
      return 1.3;
    }
  };

  this.bufferFactor = function(year) {
    if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean || (this.landType[year] > LandUseType.rotationalGrazing && this.landType[year] < LandUseType.mixedFruitsVegetables)) {
      return 0.5;
    } else {
      return 1;
    }
  };
  //-------end erosionComponent subCalcs
  //End Methods that assist phosphorus Delivery


  /*----------------------------
    	NITRATE DELIVERY
	------------------------------*/

  //the tile-level method for nitrate delivery
  //since nitrate levels are calculated at subWatershed level, tile level calculations output
  // row crop multiplier times conservation row crop multiplier
  this.nitrateSubcalculation = function(year) {

    if ((this.landType[year] > LandUseType.none && this.landType[year] < LandUseType.alfalfa) || this.landType[year] == LandUseType.mixedFruitsVegetables) {
      if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean) {
        if (this.soilType == "A" || this.soilType == "B" || this.soilType == "C" || this.soilType == "L" || this.soilType == "N" || this.soilType == "O") {
          this.results[year].cropMultiplier = 0.14 * this.area * 0.69;
        } else {
          this.results[year].cropMultiplier = 0.14 * this.area * 0.62;
        }
      } else {
        this.results[year].cropMultiplier = 0.14 * this.area;
      }
    } else {
      this.results[year].cropMultiplier = 0;
    }

  }; //end this.nitrateSubcalculation


  /*----------------------------
       SEDIMENT DELIVERY
  ------------------------------*/

  //the tile-level method for sediment delivery to stream calculations
  this.sedimentDeliveryToStreamTile = function(year) {
    this.results[year].calculatedSedimentDeliveryToStreamTile = this.results[year].calculatedGrossErosionRate *
      this.bufferFactor(year) * this.sedimentDeliveryRatio;
  }; //end this.sedimentDeliveryToStreamTile


  /*----------------------------
        YIELD CALCULATIONS
  ------------------------------*/

  //the tile-level method for tile yield calculations
  this.yieldTile = function(year) {

    this.results[year].calculatedYieldTile = this.directYieldCalculation(year) * this.getYieldPrecipitationMultiplier(year);
  }; //end this.yieldTile

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //Begin Methods that assist yieldTile

  //Calculates getYieldPrecipitationMultiplier for yieldTile
  this.getYieldPrecipitationMultiplier = function(year) {
    if (this.landType[year] > LandUseType.none && this.landType[year] < LandUseType.alfalfa) {
      if (board.precipitation[year] == 24.58 || board.precipitation[year] == 45.10) return 0.75;
      else if (board.precipitation[year] == 28.18 || board.precipitation[year] == 36.47) return 0.9;
      else if (board.precipitation[year] == 30.39 || board.precipitation[year] == 32.16 || board.precipitation[year] == 34.34) return 1;
    } else if ((this.landType[year] > LandUseType.conservationSoybean && this.landType[year] < LandUseType.prairie) || this.landType[year] == LandUseType.switchgrass) {
      if (board.precipitation[year] > 24.58 && board.precipitation[year] < 45.10) return 1;
      else return 0.95;
    } else if (this.landType[year] == LandUseType.mixedFruitsVegetables) {
      if (board.precipitation[year] < 36.47) return 1;
      else if (board.precipitation[year] == 36.47) return 0.9
      else return 0.75;
    }
    return 1;
  }; //end this.getYieldPrecipitationMultiplier(year)


  //Directs the yield calculations to the correct method depending on land use type
  this.directYieldCalculation = function(year) {
    switch (LandUseType.getType(this.landType[year])) {
      case "none":
        return 0;
      case "conventionalCorn":
        return this.getCornGrainYield();
      case "conservationCorn":
        return this.getCornGrainYield();
      case "conventionalSoybean":
        return this.getSoybeanYield();
      case "conservationSoybean":
        return this.getSoybeanYield();
      case "alfalfa":
        return this.getHayYield();
      case "permanentPasture":
        return this.getCattleSupported(year);
      case "rotationalGrazing":
        return this.getCattleSupported(year);
      case "grassHay":
        return this.getHayYield();
      case "prairie":
        return 0;
      case "conservationForest":
        //conservation Forest has a yield base rate 0.7 times that of the normal getWoodYield Value
        return 0.7 * this.getWoodYield();
      case "conventionalForest":
        return this.getWoodYield();
      case "switchgrass":
        return this.getSwitchgrassYield();
      case "shortRotationWoodyBioenergy":
        //shortRotationWoodyBioenergy is not dependent on soil type
        return 9.992447095;
      case "wetland":
        return 0;
      case "mixedFruitsVegetables":
        return 7.34 * this.getMixedFruitsVegetablesYield();
    } //end switch

  }; //end this.directYieldCalculation

  //return yield base rate for corn grain dependent on soil type
  this.getCornGrainYield = function() {
    var yieldBaseRates = [223, 0, 214, 206, 0, 200, 210, 221, 228, 179, 235, 240, 209, 0];
    return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
  }; //end this.getCornGrainYield

  //return yield base rate for soybean dependent on soil type
  this.getSoybeanYield = function() {
    var yieldBaseRates = [65, 0, 62, 60, 0, 58, 61, 64, 66, 52, 68, 70, 61, 0];
    return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
  }; //end this.getSoybeanYield

  //return yield base rate for alfalfa and grass hay dependent on soil type
  this.getHayYield = function() {
    var yieldBaseRates = [6.3, 3.6, 4.3, 5.6, 3.6, 4.1, 4.2, 6.5, 6.4, 3.6, 6.9, 6.7, 6.3, 0];
    return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
  }; //end this.getHayYield

  //return yield base rate for wood dependent on soil type
  this.getWoodYield = function() {
    var yieldBaseRates = [275, 125, 85, 275, 245, 130, 85, 275, 175, 85, 275, 175, 275, 0];
    return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
  }; //end this.getWoodYield

  //return yield base rate for switchgrass (herbaceous perennial bioenergy)
  this.getSwitchgrassYield = function() {
    var yieldBaseRates = [(1 + (2 * (84 - 25) / (100 - 25))), (1 + (2 * (61 - 25) / (100 - 25))), (1 + (2 * (82 - 25) / (100 - 25))), (1 + (2 * (61 - 25) / (100 - 25))),
      (1 + (2 * (61 - 25) / (100 - 25))), (1 + (2 * (68 - 25) / (100 - 25))), (1 + (2 * (82 - 25) / (100 - 25))), (1 + (2 * (76 - 25) / (100 - 25))),
      (1 + (2 * (92 - 25) / (100 - 25))), (1 + (2 * (61 - 25) / (100 - 25))), (1 + (2 * (93 - 25) / (100 - 25))), (1 + (2 * (98 - 25) / (100 - 25))),
      (1 + (2 * (85 - 25) / (100 - 25))), 0
    ];
    return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
  }; //end this.getSwitchgrassYield

  //return yield base rate for mixed fruits and vegetables dependent on soil type which determines soil texture
  this.getMixedFruitsVegetablesYield = function() {
    var soilTexture = ["L", "FSL", "SICL", "SIL", "L", "SIL", "CL", "SICL", "L", "MK-SIL", "SICL", "SICL", "SIL", "NA"];
    var soilTextureTemp = soilTexture[this.getSoilTypeYieldIndex(this.soilType)];
    if (soilTextureTemp == "FSL") return 1;
    else if (soilTextureTemp == "SIL") return 0.9;
    else if (soilTextureTemp == "L") return 0.85;
    else if (soilTextureTemp == "SICL" || soilTextureTemp == "CL" || soilTextureTemp == "MK-SIL") return 0.4;
    else if (soilTextureTemp == "NA") return 0;
    else return 1;
  }; //end this.getMixedFruitsVegetables

  //return yield base rate for cattle dependent on soil type and land use type
  this.getCattleSupported = function(year) {
    var CATTLE_BODY_WEIGHT = 1200;
    var GRAZING_SEASON_LENGTH = 200;
    var cattleAverageDailyIntake = 0.03 * CATTLE_BODY_WEIGHT;
    var yieldBaseRates = [6.3, 3.6, 4.3, 5.6, 3.6, 4.1, 4.2, 6.5, 6.4, 3.6, 6.9, 6.7, 6.3, 0];
    if (year == -1) {
      return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
    }
    return (this.getSeasonalUtilizationRate(year) / ((cattleAverageDailyIntake / 2000) * GRAZING_SEASON_LENGTH)) * yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
  }; //end this.getCattleSupported

  //return soil type index for yield base rate arrays
  this.getSoilTypeYieldIndex = function(soil) {
    switch (soil) {
      case 'A':
        return 0;

      case 'B':
        return 1;

      case 'C':
        return 2;

      case 'D':
        return 3;

      case 'G':
        return 4;

      case 'K':
        return 5;

      case 'L':
        return 6;

      case 'M':
        return 7;

      case 'N':
        return 8;

      case 'O':
        return 9;

      case 'Q':
        return 10;

      case 'T':
        return 11;

      case 'Y':
        return 12;

      case 'NA':
        return 13;

      case '0':
        return 13;
    } //end switch
  }; //end this.getSoilTypeYieldIndex

  //End Methods that assist yieldTile
  //--------------------------------------------------------------

};
//end construction of Tile

//######################################################################################
//######################################################################################
