

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
      var groupsRowCol = [];

      // this array holds the tiles left to check for this group
      var toCheck = [];

      var currentTile = [parseInt(map[i].row,10), parseInt(map[i].column, 10)];
      groupsRowCol.push(currentTile);



      checkAdjacentTiles(currentTile, slope, map, toCheck, tilesChecked);

      while(toCheck.length > 0)
      {
        //pop the last tile in toCheck and add it to the groupsRowCol array, then check its adjacent tiles
        currentTile = toCheck.pop();
        groupsRowCol.push(currentTile);

        checkAdjacentTiles(currentTile, slope, map, toCheck, tilesChecked);
      }

      toReturn[slope].push(groupsRowCol);
    }

    // account for the tile checked, or the non game tiles
    tilesChecked++;

  }

  return toReturn;
}

/**
 * This function checks the given tiles neighbors to see if they have the same elevation value. If they do they are pushed into an array that stores a group of tiles.
 * @param  {[type]} tile       [Tile whos neighbors are being looked at]
 * @param  {[type]} slope      [Elevation value]
 */
function checkAdjacentTiles(tile, slope, map, toCheck, tilesChecked)
{
  var row = parseInt(tile[0], 10);
  var col = parseInt(tile[1], 10);


    // check to the right
    if(col != 23 && !(toCheck.includes((row, col + 1))) && map[getID(row, col + 1)].topography == slope && map[getID(row, col + 1)].landtype != 0 )
    {
      toCheck.push([row, col + 1]);
      tilesChecked++;
    }

    // check to the left
    if(col != 1 && !(toCheck.includes((row, col - 1))) && map[getID(row, col - 1)].topography == slope && map[getID(row, col - 1)].landtype != 0)
    {
      toCheck.push([row, col - 1]);
      tilesChecked++;
    }

    //check below
    if(row != 36 && !(toCheck.includes((row + 1, col))) && map[getID(row + 1, col)].topography == slope && map[getID(row + 1, col)].landtype != 0)
    {
      toCheck.push([row + 1, col]);
      tilesChecked++;
    }

    // check up
    if(row != 1 && !(toCheck.includes((row - 1, col))) && map[getID(row - 1, col)].topography == slope && map[getID(row - 1, col)].landtype != 0)
    {
      toCheck.push([row - 1, col]);
      tilesChecked++;
    }

    // check down and right
    if(row != 36 && !(toCheck.includes((row + 1, col + 1))) && map[getID(row + 1, col + 1)].topography == slope && map[getID(row + 1, col + 1)].landtype != 0)
    {
      toCheck.push([row + 1, col + 1]);
      tilesChecked++;
    }

    // check up and right
    if(row != 1 && !(toCheck.includes((row - 1, col + 1))) && col != 23 && map[getID(row - 1, col + 1)].topography == slope && map[getID(row - 1, col + 1)].landtype != 0)
    {
      toCheck.push([row - 1, col + 1]);
      tilesChecked++;
    }

    // check up and left
    if(row != 1 && col != 1 && !(toCheck.includes((row - 1, col - 1))) && map[getID(row - 1, col - 1)].topography == slope && map[getID(row - 1, col - 1)].landtype != 0)
    {
      toCheck.push([row - 1, col - 1]);
      tilesChecked++;
    }

    //check down and left
    if(col != 1 && row != 36 && !(toCheck.includes((row + 1, col - 1))) && map[getID(row + 1, col - 1)].topography == slope && map[getID(row + 1, col - 1)].landtype != 0)
    {
      toCheck.push([row + 1, col - 1]);
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
