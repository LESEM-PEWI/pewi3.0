


/**
 * This function bring all the pieces together and puts the contour map over the current map.
 * @param   map: This is the map on screen. Done this way to be modular in case it changes in the future.
 */
function createContourMap()
{
  var map = boardData[currentBoard].map;

  var lines = getLines(map);

  displayLines(lines);

  //this will store the groups of tiles that are that are adjacent and have the same elevation
  //var elevationGroups = groupByElevation(map);

  // //creates the groups of contour lines that will be displayed on the map
  // var contourLineGroups = createContours(elevationGroups);
  //
  // //display the contour lines
  // displayContours(contourLineGroups);
}

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
        map[i].showContourLines("top");
      }

      //check the tile below
      if(row == 36 || map[getID(row + 1, col) - 1].topography != topo || map[getID(row + 1, col) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("bottom");
        map[i].contourLines.push("bottom");
        map[i].showContourLines("bottom");
      }

      //check the tile to the right
      if(col == 23 || map[getID(row, col + 1) - 1].topography != topo || map[getID(row, col + 1) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("right");
        map[i].contourLines.push("right");
        map[i].showContourLines("right");
      }

      //check the tile to the left
      if(col == 1 || map[getID(row, col - 1) - 1].topography != topo || map[getID(row, col - 1) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("left");
        map[i].contourLines.push("left");
        map[i].showContourLines("left");
      }


    }
    toReturn.push(thisCellsLines);
  }
  return toReturn;
}

function displayLines(lines)
{

}


function getID(row, col)
{
  return 23 * (row - 1) + col;
}
