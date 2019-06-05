

/**
 * This function bring all the pieces together and puts the contour map over the current map.
 * @param   map: This is the map on screen. Done this way to be modular in case it changes in the future.
 */
function createContourMap()
{
  var map = boardData[currentBoard].map;

  var lines = getLines(map);

  var breakpoint = "stop";

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
      }

      //check the tile below
      if(row == 36 || map[getID(row + 1, col) - 1].topography != topo || map[getID(row + 1, col) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("bottom");
      }

      //check the tile to the right
      if(col == 23 || map[getID(row, col + 1) - 1].topography != topo || map[getID(row, col + 1) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("right");
      }

      //check the tile to the left
      if(col == 1 || map[getID(row, col - 1) - 1].topography != topo || map[getID(row, col - 1) - 1].baseLandUseType == 0)
      {
        thisCellsLines.push("left");
      }


    }
    toReturn.push(thisCellsLines);
  }
  return toReturn;
}


// Not working, going to try something else
// function groupByElevation(map)
// {
//
//   var tilesChecked = [];
//
//   // this array has an array for each elevation level
//   var toReturn = [[],[],[],[],[],[]];
//
//
//   for (var i = 0; i < map.length; i++)
//   {
//
//     if(tilesChecked.length == map.length)
//     {
//       break;
//     }
//
//     // checks that tile is a game tile
//     if(map[i].landtype != 0 && !(tilesChecked.includes(i)))
//     {
//       // get the slope so it can be added to the correct array in toReturn
//       var slope = map[i].topography;
//
//       //this array will hold the row and column number for the tiles in this group
//       var groupsRowCol = [];
//
//       // this array holds the tiles left to check for this group
//       var toCheck = [];
//
//       var currentTile = [parseInt(map[i].row,10), parseInt(map[i].column, 10)];
//       groupsRowCol.push(currentTile);
//
//       checkAdjacentTiles(currentTile, slope, map, toCheck, tilesChecked);
//       tilesChecked.push(getID(parseInt(map[i].row, 10), parseInt(map[i].column, 10)));
//
//       while(toCheck.length > 0)
//       {
//         //pop the last tile in toCheck and add it to the groupsRowCol array, then check its adjacent tiles
//         currentTile = toCheck.pop();
//         groupsRowCol.push(currentTile);
//
//
//         checkAdjacentTiles(currentTile, slope, map, toCheck, tilesChecked);
//         tilesChecked.push(getID(currentTile[0], currentTile[1]))
//       }
//
//       toReturn[slope].push(groupsRowCol);
//     }
//
//     // account for the tile checked, or the non game tiles
//     if(!(tilesChecked.includes(i)))
//      {
//       tilesChecked.push(i);
//     }
//   }
//
//   return toReturn;
// }
//
// /**
//  * This function checks the given tiles neighbors to see if they have the same elevation value. If they do they are pushed into an array that stores a group of tiles.
//  * @param  {[type]} tile       [Tile whos neighbors are being looked at]
//  * @param  {[type]} slope      [Elevation value]
//  */
// function checkAdjacentTiles(tile, slope, map, toCheck, tilesChecked)
// {
//   var row = parseInt(tile[0], 10);
//   var col = parseInt(tile[1], 10);
//
//
//     // check to the right
//     if(col != 23 && (!(tilesChecked.includes(getID(row, col + 1)))) && (!(toCheck.includes([row, col + 1]))) && map[getID(row, col + 1)].topography == slope && map[getID(row, col + 1)].baseLandUseType != 0 )
//     {
//       toCheck.push([row, col + 1]);
//     }
//
//     // check to the left
//     if(col != 1 && (!(tilesChecked.includes(getID(row, col - 1)))) && (!(toCheck.includes([row, col - 1]))) && map[getID(row, col - 1)].topography == slope && map[getID(row, col - 1)].baseLandUseType != 0)
//     {
//       toCheck.push([row, col - 1]);
//     }
//
//     //check below
//     if(row != 36 && (!(tilesChecked.includes(getID(row + 1, col)))) && (!(toCheck.includes([row + 1, col]))) && map[getID(row + 1, col)].topography == slope && map[getID(row + 1, col)].baseLandUseType != 0)
//     {
//       toCheck.push([row + 1, col]);
//     }
//
//     // check up
//     if(row != 1 && (!(tilesChecked.includes(getID(row - 1, col)))) && (!(toCheck.includes([row - 1, col]))) && map[getID(row - 1, col)].topography == slope && map[getID(row - 1, col)].baseLandUseType != 0)
//     {
//       toCheck.push([row - 1, col]);
//     }
//
//     // check down and right
//     if(row != 36 && col != 23 && (!(tilesChecked.includes(getID(row + 1, col + 1)))) && (!(toCheck.includes([row + 1, col + 1]))) && map[getID(row + 1, col + 1)].topography == slope && map[getID(row + 1, col + 1)].baseLandUseType != 0)
//     {
//       toCheck.push([row + 1, col + 1]);
//     }
//
//     // check up and right
//     if(row != 1 && col != 23 && (!(tilesChecked.includes(getID(row - 1, col + 1)))) && (!(toCheck.includes([row - 1, col + 1]))) && map[getID(row - 1, col + 1)].topography == slope && map[getID(row - 1, col + 1)].baseLandUseType != 0)
//     {
//       toCheck.push([row - 1, col + 1]);
//     }
//
//     // check up and left
//     if(row != 1 && col != 1 && (!(tilesChecked.includes(getID(row - 1, col - 1))) )&& (!(toCheck.includes([row - 1, col - 1]))) && map[getID(row - 1, col - 1)].topography == slope && map[getID(row - 1, col - 1)].baseLandUseType != 0)
//     {
//       toCheck.push([row - 1, col - 1]);
//     }
//
//     //check down and left
//     if(col != 1 && row != 36 && (!(tilesChecked.includes(getID(row + 1, col + 1)))) && (!(toCheck.includes([row + 1, col - 1]))) && map[getID(row + 1, col - 1)].topography == slope && map[getID(row + 1, col - 1)].baseLandUseType != 0)
//     {
//       toCheck.push([row + 1, col - 1]);
//     }
//
// }
//
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
