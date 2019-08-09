//global variables in the codex frame
var dataHolder; //keeps track of individual properties for each element
var elementNum;
var elementHeight; //array with the current height of each section

//this function adds the content to the right pane, namely
//  the image/video in square1, the text frame in square2, and the title
function arrangeContent(idOfElement) {
  // record for click tracking system
  if( parent.getTracking() ) {
    console.log("tracking arrangeContent("+idOfElement+")");
    parent.pushClick(0, parent.getStamp(), 80, 0, idOfElement);
  }

  document.getElementById('square1').innerHTML = dataHolder[idOfElement].square1;
  document.getElementById('square2frame').src = dataHolder[idOfElement].square2;
  document.getElementById('title').innerHTML = dataHolder[idOfElement].title.toUpperCase();


  //if element hasMore attribute == 1, then we show the deaper button and assign it functionality
  if (dataHolder[idOfElement].hasMore && dataHolder[idOfElement].hasMore == "1") {
    document.getElementById('switchAdvanced').style.display = "block";
    document.getElementById('switchAdvanced').className = "switchContentDepth";

    document.getElementById('switchGeneral').style.display = "block";
    document.getElementById('switchGeneral').className = "switchContentDepthSelected";

    // make Advanced tab clickable
    document.getElementById('switchAdvanced').onclick = function() {
      showAdvancedDetail(idOfElement);
      // if click tracking mode, then record the action
      if( parent.getTracking() ) {
        console.log("tracking Advanced clicked ");
        // record for click tracking system
        parent.pushClick(0, parent.getStamp(), 81, 0, idOfElement);
      }
    };
  } else {
    document.getElementById('switchAdvanced').style.display = "none";
    document.getElementById('switchGeneral').style.display = "none";
  }

  //also change the class of the item clicked if it's a subElement
  //note that headers have separate functionality, despite updating rightward squares
  var currentSelectedGroupElements = document.getElementsByClassName('selectedGroupElement');
  //unhighlight the current selected element
  if (currentSelectedGroupElements.length > 0) {
    currentSelectedGroupElements[0].className = 'groupElement';
  }
  //select the current element if not already
  if (document.getElementById(idOfElement).className == 'groupElement') {
    document.getElementById(idOfElement).className = 'selectedGroupElement';
  }
} //end function arrangeContent()

//this function creates the html string needed for all header elements
// it also stores the relevant data in dataHolder
function establishHeader(i, line1, line2, line3, line4, padding) {

  //html part----

  //generic string to which we can add
  var tempString = "";
  tempString += "<div id='" + i + "' class='groupHeader' onmouseover='this.focus()' onclick='arrangeContent(" + i + "); toggleChildElements(" + i + ");' style='padding-left:" + padding + "%;  overflow: auto;' >";
  //add the whole text, minus the indicator symbol and following space
  tempString += line1.slice(2);
  tempString += "</div>";

  //data linkage part---

  dataHolder[i] = {};
  dataHolder[i].square1 = line2;
  dataHolder[i].square2 = line3;
  dataHolder[i].hasMore = line4;

  if (dataHolder[i].hasMore) {
    var temp = line2.split(" + ");
    //really the creator of the .dat file should sanitize input,
    //  but just in case, we'll be extra careful and build in a check
    if (temp.length > 1) {
      dataHolder[i].square1 = temp[0];
      dataHolder[i].square1Advanced = temp[1];
    } else {
      dataHolder[i].hasMore = 0;
    }
  }

  dataHolder[i].title = line1.slice(3);

  return tempString;
} //end establishHeader()

//this function creates the html string needed for all child elements
// it also stores the relevant data in dataHolder
function establishElement(i, line1, line2, line3, line4, padding) {

  //html----
  var tempString = "";
  tempString += "<div id='" + i + "' class='groupElement' onclick='arrangeContent(" + i + ");' style='padding-left:" + padding + "%;  overflow: auto;' >";
  tempString += line1.slice(2);
  tempString += "</div>";

  //data linkage----
  dataHolder[i] = {};
  dataHolder[i].square1 = line2;
  dataHolder[i].square2 = line3;
  dataHolder[i].hasMore = line4;

  if (dataHolder[i].hasMore) {
    var temp = line2.split(" + ");
    //really the creator of the .dat file should sanitize input,
    //  but just in case, we'll be extra careful and build in a check
    if (temp.length > 1) {
      dataHolder[i].square1 = temp[0];
      dataHolder[i].square1Advanced = temp[1];
    } else {
      dataHolder[i].hasMore = 0;
    }
  }

  dataHolder[i].title = line1.slice(3);

  return tempString;
}

//rather self-explanator, this function creates an array of heights for all of the headers
// based on the number of child elements they have
function estalishHeights() {

  //35 px for each element
  // heightConstant = 35 ;
  heightConstant = 2.7;

  for (var i = 0; i < elementNum.length; i++) {
    if (elementNum[i]) {
      elementHeight[i] = heightConstant * elementNum[i];
    } //end if
  } //end for
} //end establishHeights()

//initialize the codex by calling main setup file
function init() {

  //make an asynchronous call to data from url
  $.ajax({
    async: false,
    type: "GET",
    url: './codexResources/main.dat',
    dataType: "text",
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    success: function(data) {
      setUpCodexData(data);
    }
  });
}

//listen for the 'i' key and trigger exit in parent (helpersFE.js)
function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 73:
    parent.toggleGlossary();
    break;
  } //end switch
} //end onDocumentKeyDown

//for use by helpersFE.js toggle index
function resetHighlighting() {
  var currentSelectedGroupElements = document.getElementsByClassName('selectedGroupElement');
  //unhighlight the current selected element
  if (currentSelectedGroupElements.length > 0) {
    currentSelectedGroupElements[0].className = 'groupElement';
  }
}

//this function adjusts the sizes of parent containers that have a child container opened or closed
function resizeAffectedElements(idOfClickedElement, operationToPerform) {
  //let's judge where elements are by their padding
  var currentPadding = document.getElementById(idOfClickedElement).style.paddingLeft;
  //slice off "%"
  currentPadding = currentPadding.slice(0, -1);
  // currentPadding = currentPadding.slice(0, -1);
  currentPadding = Number(currentPadding);

  var i = idOfClickedElement - 1;
  var onwards = 1;
  //find open group headers above us by going through all of the elements
  //resize them accordingly
  while (i >= 0 && onwards) {

    //if the element is an open group header
    if (document.getElementById(i) && document.getElementById(i).className == "selectedGroupHeader") {
      //painstakingly get the element padding...
      var elementPadding = document.getElementById(i).style.paddingLeft;
      // slice off "%"
      elementPadding = elementPadding.slice(0, -1);
      elementPadding = Number(elementPadding);

      //if the element is some parent container, it will have lower padding
      if (elementPadding < currentPadding) {

        //find the container referred to by the open header
        var string = document.getElementById((i + "sub")).style.height;
        // slice off "vw"
        string = string.slice(0, -1);
        string = string.slice(0, -1);

        //here's where the magic happens, add or subtract the height of current element from parent holder
        if (operationToPerform == 'expand') string = Number(string) + elementHeight[idOfClickedElement];
        if (operationToPerform == 'shrink') string = Number(string) - elementHeight[idOfClickedElement];

        //update new height
        // document.getElementById((i + "sub")).style.height = string + "px" ;
        document.getElementById((i + "sub")).style.height = string + "vw";
        elementHeight[i] = string;
      }
      //let's stop looking if we're at the topmost padding
      //  if(elementPadding == 20) onwards = 0 ;
      if (elementPadding == 5) onwards = 0;
    } //end if
    //cycle through all elements above us
    i -= 1;
  } //end while
} //end function resizeAffectedElements() ;

//parse through the data lines and create the corresponding elements
//  also keep track of element numbers so that height can be correctly established
function setUpCodexData(data) {

  var strRawContents = data;
  //split based on escape chars
  while (strRawContents.indexOf("\r") >= 0)
    strRawContents = strRawContents.replace("\r", "");
  var arrLines = strRawContents.split("\n");

  //the oh so generically named html amalgamation variable for our left content index
  var tableString = "";

  //set up these variables to be arrays of the correct size
  dataHolder = Array(arrLines.length);
  elementNum = Array(arrLines.length);
  elementHeight = Array(arrLines.length);

  // var padding = 20 ; //increase by 20 each sub category
  var padding = 5; //increase by 20 each sub category
  var i = 0;
  var tempElementHolder = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var tempIndexHolder = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var current = -1;

  //for each line in the file, we sort and create corresponding elements
  while (i < arrLines.length) {

    //see what's up with the first character of the line
    //this allows dataset creator a (very) wide discretion over elements and subElements
    var char = arrLines[i][0];

    switch (char) {
      //if '#' then element is a header (with subHolder and subElements)
      //treat it as such
      case '#':
        //add a header element to the left index
        tableString += establishHeader(i, arrLines[i], arrLines[i + 1], arrLines[i + 2], arrLines[i + 3], padding);
        //since this is a header, we expect child elements, add an expandible div
        tableString += "<div id='" + i + "sub' class='subHolder'>";
        //all of the sub elements should now be tabbed, thus increase padding variable (for left pad)
        // padding += 20 ;
        padding += 5;

        //----This code here a tiny bit convoluted, but pragmatic...
        //----basically the goal is to keep track of if we're inside a header
        //------so that both child elements and nested headers get accounted for

        //change the current index of the current header to which we are adding
        current += 1;
        tempIndexHolder[current] = i;
        //account for added element in the parent header, if there is one
        if (current > 0) {
          tempElementHolder[current - 1] += 1;
        }

        //-----

        //since we dealt with both 2 lines following, increment accordingly and move on
        i += 4;
        break;

        //if '@' then element is a subElement
        //sub elements are basically headers, but have 2 important distinctions
        // 1) they cannot have child elements themselves
        // 2) they may have 'advanced' text indicated by a "1" on the third following line
      case '@':
        //add element as child of header (subElement) to left index
        tableString += establishElement(i, arrLines[i], arrLines[i + 1], arrLines[i + 2], arrLines[i + 3], padding);
        //the current header gets another element
        tempElementHolder[current] += 1;

        //since we've accounted for 3 lines, let's not deal with them again
        i += 4;
        break;

        //if '$' then a nested subdivision is ended
        //this is important so that the program can distinguish (and not guess)
        //  if headers are nested, and to which headers they belong
      case '$':

        //keep track of how many child elements were added to the current header
        //  this is a bit recursive as it saves upward once we hit the deepest element
        elementNum[tempIndexHolder[current]] = tempElementHolder[current];
        tempElementHolder[current] = 0;
        current -= 1;
        //end subholder
        tableString += '</div>';
        // padding -= 20 ;
        padding -= 5;
        i += 1;
        break;

        //if a blank line or something wrong was left accidentally, we'll get over it
      default:
        i += 1;
    } //end switch
  } //end while

  document.getElementById('glossaryHolder').innerHTML = tableString;
  estalishHeights();
} //end function setUpCodexData()

//gets the advanced detail page by appending "More" to the file name
//sets up corresponding changes in the 'Advanced' Button
function showAdvancedDetail(idOfCurrentElement) {
  //change frame content square 2
  var string = dataHolder[idOfCurrentElement].square2;
  string = string.slice(0, -5) + "More.html";
  document.getElementById('square2frame').src = string;

  //change frame content square 1
  document.getElementById('square1').innerHTML = dataHolder[idOfCurrentElement].square1Advanced;

  //change button attributes
  document.getElementById('switchAdvanced').className = "switchContentDepthSelected";
  document.getElementById('switchGeneral').className = "switchContentDepth";

  // make general tab clickable
  document.getElementById('switchGeneral').onclick = function() {
    showLessDetail(idOfCurrentElement);
    // if click tracking mode, then record the action
    if( parent.getTracking() ) {
      console.log("tracking General clicked ");
      // record for click tracking system
      parent.pushClick(0, parent.getStamp(), 82, 0, idOfCurrentElement);
    }
  };
} //end showAdvancedDetail

//resets element with more general content and button as well
function showLessDetail(idOfCurrentElement) {

  //reset square 2
  document.getElementById('square2frame').src = dataHolder[idOfCurrentElement].square2;
  document.getElementById('switchAdvanced').className = "switchContentDepth";
  document.getElementById('switchGeneral').className = "switchContentDepthSelected";

  //reset square 1
  document.getElementById('square1').innerHTML = dataHolder[idOfCurrentElement].square1;

  // make Advanced tab clickable
  document.getElementById('switchAdvanced').onclick = function() {
    showAdvancedDetail(idOfCurrentElement);
    // if click tracking mode, then record the action
    if( parent.getTracking() ) {
      console.log("tracking Advanced clicked ");
      // record for click tracking system
      parent.pushClick(0, parent.getStamp(), 81, 0, idOfCurrentElement);
    }
  };
} //end showLessDetail

//this function is in theory simple, all we need to do is display the child element associated with
//  a header element.
// Unfortunately, a second part is resizing all open divs appropriately, since opening a nested div
//  requires its parent to expand as well
function toggleChildElements(idOfHeader) {

  //the sub div is named with the parent id and 'sub' appended
  var childString = idOfHeader + "sub";

  //heightString = elementHeight[idOfHeader] + "vw";
  heightString = "auto";
  //if it is an unopened group Header, open it
  if (document.getElementById(idOfHeader).className == "groupHeader") {

    //change styling accordingly
    document.getElementById(childString).style.visibility = "visible";
    document.getElementById(childString).style.height = heightString;
    document.getElementById(idOfHeader).className = "selectedGroupHeader";
    //change text + to - in button
    var text = document.getElementById(idOfHeader).innerHTML;
    text = text.slice(1);
    text = "&ndash;" + text;
    document.getElementById(idOfHeader).innerHTML = text;
    //resize all other frames involved in this expansion
    resizeAffectedElements(idOfHeader, 'expand');
  }
  //else if it is an opened group Header, close it
  else if (document.getElementById(idOfHeader).className == "selectedGroupHeader") {
    //change styling
    document.getElementById(childString).style.height = "0px";
    document.getElementById(childString).style.visibility = "hidden";
    document.getElementById(idOfHeader).className = "groupHeader";
    //change - text to +
    var text = document.getElementById(idOfHeader).innerHTML;
    text = text.slice(1);
    text = "+" + text;
    document.getElementById(idOfHeader).innerHTML = text;
    //resize all other frames involved in the collapse
    resizeAffectedElements(idOfHeader, 'shrink');
  } //end if
} //end toggleChildElements()
