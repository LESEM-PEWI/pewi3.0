


/**
 * This function bring all the pieces together and puts the contour map over the current map.
 * @param   map: This is the map on screen. Done this way to be modular in case it changes in the future.
 */
function createContourMap()
{
  var map = boardData[currentBoard].map;

  var lines = getLines(map);

  displayLines(lines, map);
}

/**
 * This function goes through the map and checks to the side of every tile. If the adjacent tiles have a different elevation / topography value, that side is pushed to an array for that tile so we know there needs to tbe a contour line there.
 * @param  {[Array]} map [The current board]
 * @return {[Array]}     [An array with each tile, and where they need to have contour lines around them]
 */
function getLines(map)
{

  var toReturn = [];
  for(var i = 0; i < map.length; i++)
  {
    var row = parseInt(map[i].row);
    var col = parseInt(map[i].column);
    var topo = map[i].topography;

    var thisCellsLines = [];
    if(map[i].baseLandUseType != 0)
    {
      //check the tile above
      if(row == 1 || map[getID(row - 1, col) - 1].topography != topo || map[getID(row - 1, col) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("top");
        map[i].contourLines.push("top");
      }

      //check the tile below
      if(row == 36 || map[getID(row + 1, col) - 1].topography != topo || map[getID(row + 1, col) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("bottom");
        map[i].contourLines.push("bottom");
      }

      //check the tile to the right
      if(col == 23 || map[getID(row, col + 1) - 1].topography != topo || map[getID(row, col + 1) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("right");
        map[i].contourLines.push("right");
      }

      //check the tile to the left
      if(col == 1 || map[getID(row, col - 1) - 1].topography != topo || map[getID(row, col - 1) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("left");
        map[i].contourLines.push("left");
      }


    }
    toReturn.push(thisCellsLines);
  }
  return toReturn;
}

function displayLines(lines, map)
{


  for(var i = 0; i < map.length; i++)
  {
    var tile = document.createElement("div");

    tile.id="tile" + i;
    tile.innerHTML = tile.id;

    var tileHolderDiv = document.getElementsByClassName("tiles");
  }
}


function getID(row, col)
{
  return 23 * (row - 1) + col;
}

/**
 * Open a pop up window to confirm if the user wants to load the topo map.
 */
function confirmTopoMap()
{
  if(window.confirm("Do you want to load the contour map?"))
  {
    window.open("file:///C:/Users/jweiland/Desktop/PEWI/CODE/pewi3.0/htmlFrames/contourMap.html");
    createContourMap();
  }
}
