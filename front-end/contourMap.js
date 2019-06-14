

function drawGrid(c, canvas, map) {
   var rectXPos = 50;
  var rectYPos = 50;
  var rectWidth = 40;
  var rectHeight = 25;

  for (var j = 0; j < 36; j++)
  {
    rectYPos = 50 + j * 25;
    for (var i = 0; i < 23; i++)
    {
      rectXPos = 40 * i + 50;
       if(map[i +(j*23)].baseLandUseType != 0)
       {
        drawBorder(rectXPos, rectYPos, rectWidth, rectHeight, c);
        c.fillStyle='#FFF';
        c.fillRect(rectXPos, rectYPos, rectWidth, rectHeight);
      }
    }
    rectXPos = 50;
  }
}




function drawBorder(xPos, yPos, width, height, c)
{
  thickness = 1;
  c.fillStyle='#000';
  c.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

/**
 * This function bring all the pieces together and puts the contour map over the current map.
 * @param   map: This is the map on screen. Done this way to be modular in case it changes in the future.
 */
function createContourMap(c, canvas)
{
  var map = boardData[currentBoard].map;

  var lines = getLines(map);

  drawGrid(c, canvas, map);
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
    // var myWindow = window.open("file:///C:/Users/jweiland/Desktop/PEWI/CODE/pewi3.0/htmlFrames/contourMap.html");
    var myWindow = window.open();





    var html = "<!doctype html><html><head><title> Contour Map </title><style type=text/css>canvas{border: 1px solid black;}body{margin: 0;}</style></head><body><canvas id=mapCanvas></canvas></body></html>"
    myWindow.document.open();
    myWindow.document.write(html);
    myWindow.document.close();


    var canvas = myWindow.document.getElementById("mapCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var c = canvas.getContext('2d');
    createContourMap(c, canvas);
  }
}
