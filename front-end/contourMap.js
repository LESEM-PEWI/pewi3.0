/*
This file contains the code that creates the contour map.
 */

/**
 * This function bring all the pieces together and puts the contour map over the current map.
 * @param   map: This is the map on screen. Done this way to be modular in case it changes in the future.
 */
function createContourMap()
{
  var map = boardData[currentBoard].map;

  //this will store the groups of tiles that are that are adjacent and have the same elevation
  var elevationGroups = groupByElevation(map);

  // //creates the groups of contour lines that will be displayed on the map
  // var contourLineGroups = createContours(elevationGroups);
  //
  // //display the contour lines
  // displayContours(contourLineGroups);
}

function groupByElevation(map)
{

  var tilesChecked = 0;

  // this array has an array for each elevation level
  var toReturn = [[],[],[],[],[],[]];


  for (var i = 0; i < map.length; i++)
  {

    if(tilesChecked == map.length)
    {
      break;
    }

    // checks that tile is a game tile
    if(map[i].landtype != 0)
    {
      // get the slope so it can be added to the correct array in toReturn
      var slope = map[i].topography;

      //this array will hold the row and column number for the tiles in this group
      var groupsRowCol = [[]];

      var currentTile = [map[i].row, map[i].column];
      groupsRowCol.push(currentTile);



      checkAdjacentTiles(currentTile, groupsRowCol, slope, tilesToCheck);

      toReturn[slope].push(groupsRowCol);
    }

    // account for the tile checked, or the non game tiles
    tilesChecked++;

  }

/**
 * This function checks the given tiles neighbors to see if they have the same elevation value. If they do they are pushed into an array that stores a group of tiles.
 * @param  {[type]} tile       [Tile whos neighbors are being looked at]
 * @param  {[type]} groupArray [The array holding the position of the tiles with the same elevation]
 * @param  {[type]} slope      [Elevation value]
 */
function checkAdjacentTiles(tile, groupArray, slope, tilesToCheck)
{
  var row = tile[0];
  var col = tile[1];

  if(map[getID(row, col + 1)].topography == slope)
  {
    checkAdjacentTiles([row, col + 1], groupArray, slope, tilesToCheck);
    groupArray.push([row, col + 1]);
    tilesChecked++;
  }

  if(map[getID(row, col - 1)].topography == slope)
  {
    checkAdjacentTiles([row, col - 1], groupArray, slope, tilesToCheck);
    groupArray.push([row, col - 1]);
    tilesChecked++;
  }

  if(map[getID(row + 1, col)].topography == slope)
  {
    checkAdjacentTiles([row + 1, col], groupArray, slope, tilesToCheck);
    groupArray.push([row + 1, col]);
    tilesChecked++;
  }

  if(map[getID(row - 1, col)].topography == slope)
  {
    checkAdjacentTiles([row - 1, col], groupArray, slope, tilesToCheck);
    groupArray.push([row - 1, col]);
    tilesChecked++;
  }

  if(map[getID(row + 1, col + 1)].topography == slope)
  {
    checkAdjacentTiles([row + 1, col + 1], groupArray, slope, tilesToCheck);
    groupArray.push([row + 1, col + 1]);
    tilesChecked++;
  }

  if(map[getID(row - 1, col + 1)].topography == slope)
  {
    checkAdjacentTiles([row - 1, col + 1], groupArray, slope, tilesToCheck);
    groupArray.push([row - 1, col + 1]);
    tilesChecked++;
  }

  if(map[getID(row - 1, col - 1)].topography == slope)
  {
    checkAdjacentTiles([row - 1, col - 1], groupArray, slope, tilesToCheck);
    groupArray.push([row - 1, col - 1]);
    tilesChecked++;
  }

  if(map[getID(row + 1, col - 1)].topography == slope)
  {
    checkAdjacentTiles([row + 1, col - 1], groupArray, slope, tilesToCheck);
    groupArray.push([row + 1, col - 1]);
    tilesChecked++;
  }

}

function getID(row, col)
{
  return 23 * (row - 1) + col;
}

function createContours()
{

}

function displayContours()
{

}
