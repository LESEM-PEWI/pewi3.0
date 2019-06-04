//RadarChart Object,
// Code modified, animation tweens, mouseover interaction, and some logic
//     interfacing are original to us

//  Our Code based on Bremer's Code based on Graves's code
//          Bremer:  see post at https://bl.ocks.org/nbremer/6506614
//          Graves:  see alangrafu on gitHub

//Radar prototype with construction function
var RadarChart = {
  draw: function(id, d, options, mouseoverClass, radarClassElementsString) {
    var cfg = {
      radius: 5,
      w: 600,
      h: 600,
      factor: 1,
      factorLegend: 0.85,
      levels: 3,
      maxValue: 0,
      radians: 2 * Math.PI,
      opacityArea: 0.2,
      ToRight: 5,
      TranslateX: 70, //95
      TranslateY: 30, //25
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color: d3.scaleOrdinal(d3.schemeCategory10)
    };
    if ('undefined' !== typeof options) {
      for (var i in options) {
        if ('undefined' !== typeof options[i]) {
          cfg[i] = options[i];
        }
      }
    }
    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i) {
      return d3.max(i.map(function(o) {
        return o.value;
      }));
    }));
    var allAxis = (d[0].map(function(i, j) {
      return i.axis;
    }));
    var total = allAxis.length;
    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
    var Format = d3.format('%');
    d3.select(id).select("svg").remove();

    var g = d3.select(id)
      .append("svg")
      .attr("width", cfg.w * 1.97) //384
      .attr("height", cfg.h * 1.23) //239
      .append("g")
      .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

    var mouseoverInfo = d3.select(id)
      .append('g')
      .attr('class', mouseoverClass);

    mouseoverInfo.append('div')
      .attr('class', 'label');

    mouseoverInfo.append('div')
      .attr('class', 'count');

    mouseoverInfo.append('div')
      .attr('class', 'score');

    //Circular segments
    for (var j = 0; j < cfg.levels - 1; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data(allAxis)
        .enter()
        .append("svg:line")
        .attr("x1", function(d, i) {
          return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
        })
        .attr("y1", function(d, i) {
          return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
        })
        .attr("x2", function(d, i) {
          return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
        })
        .attr("y2", function(d, i) {
          return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
        })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-opacity", "0.75")
        .style("stroke-width", "0.3px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for (var j = 0; j < cfg.levels; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data([1]) //dummy data
        .enter()
        .append("svg:text")
        .attr("x", function(d) {
          return levelFactor * (1 - cfg.factor * Math.sin(0));
        })
        .attr("y", function(d) {
          return levelFactor * (1 - cfg.factor * Math.cos(0));
        })
        .attr("class", "legend")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
        .attr("fill", "#737373")
        .text(((j + 1) * cfg.maxValue / cfg.levels).toFixed(2) * 100);
    }

    series = 0;

    var axis = g.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w / 2)
      .attr("y1", cfg.h / 2)
      .attr("x2", function(d, i) {
        return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
      })
      .attr("y2", function(d, i) {
        return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d) {
        return d;
      })
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "3.3em")
      .attr("transform", function(d, i) {
        return "translate(0, -40.7)";
      })
      .attr("x", function(d, i) {
        return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
      })
      .attr("y", function(d, i) {
        return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
      });


    d.forEach(function(y, x) {
      dataValues = [];
      g.selectAll(".nodes")
        .data(y, function(j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
          ]);
        });
      dataValues.push(dataValues[0]);
      g.selectAll(".area")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("id", function(d, i) {
          return radarClassElementsString + "polygon-serie" + series + "num" + i;
        })
        .attr("class", radarClassElementsString + series)
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series))
        .attr("points", function(d) {
          var str = "";
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + "," + d[pti][1] + " ";
          }
          return str;
        })
        .style("fill", function(j, i) {
          return cfg.color(series);
        })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function(d) {

        })
        .on('mouseout', function() {})
        .transition()
        .duration(900)
        .styleTween("fill-opacity", function() {
          //animate the change of the color gradient from black to bright blue
          return d3.interpolate(0, cfg.opacityArea);
        });
      series++;
    });
    series = 0;


    d.forEach(function(y, x) {
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("id", function(d, i) {
          return radarClassElementsString + "circle-serie" + series + "num" + i;
        })
        .attr("class", radarClassElementsString + series)
        .attr('r', cfg.radius)
        .attr("alt", function(j) {
          return Math.max(j.value, 0);
        })
        .attr("cx", function(j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
          ]);
          return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
        })
        .attr("cy", function(j, i) {
          return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
        })
        .attr("data-id", function(j) {
          return j.axis;
        })
        .style("fill", function(d, i) {
          return cfg.color(series);
        })
        .style("fill-opacity", 0.9)
        .on('mouseover', function(d) {
          newX = parseFloat(d3.select(this).attr('cx')) - 10;
          newY = parseFloat(d3.select(this).attr('cy')) - 5;

          z = "polygon." + d3.select(this).attr("class");
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", 0.1);
          g.selectAll(z)
            .transition(200)
            .style("fill-opacity", 0.7);

          d3.select(this).attr("r", 15);

          mouseoverInfo.select('.label').html(d.label);
          mouseoverInfo.select('.count').html(d.raw);
          mouseoverInfo.select('.score').html(Math.round(d.value * 1000) / 10 + "/100");
          mouseoverInfo.style('border-color', d3.select(this).style("fill"));
          mouseoverInfo.style('display', 'block');

        })
        .on('mouseout', function() {
          d3.select(this).attr("r", cfg.radius);
          mouseoverInfo.style('display', 'none');

          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", cfg.opacityArea);

        })
        .text(function(j) {
          return Math.max(j.value, 0);
        })
        .transition()
        .duration(900)
        .attrTween("cy", function() {
          //animate the change of the color gradient from black to bright blue
          return d3.interpolate(150, this.getAttribute("cy"));
        })
        .attrTween("cx", function() {
          //animate the change of the color gradient from black to bright blue
          return d3.interpolate(150, this.getAttribute("cx"));
        });

      series++;
    });

  }
}; //End Radar Object

//displayResults writes the html for the results iframe with updates results from Totals
function displayResults() {

  //Create results table and append it to the proper tab of the results frame
  var numericalTableString = generateResultsTable();
  document.getElementById('resultsFrame').contentWindow.document.getElementById('contentsN').innerHTML = numericalTableString;

  //refresh frame properties
  document.getElementById('resultsFrame').contentWindow.refreshPie();

  //create land Pie Chart
  drawD3LandPieChart(currentYear, false);
  //clearing scoreChart div tag, or else it will duplicate the scoreChart graph every time results is clicked on
  document.getElementById('resultsFrame').contentWindow.document.getElementById('scoreChart').innerHTML = ' ';
  //creating the scoreChart graph by calling the number of years that are currently
  render(boardData[currentBoard].calculatedToYear);
  //create precipitation Bar Graph
  drawPrecipitationInformationChart();

  //DEPRECATED, (create ecosystem indicators aster plot
  //drawEcosystemIndicatorsDisplay(currentYear);
  //============= END DEPRECATED

  //create the radar plots
  var tempObj = []; //get an array of years to display
  for (var y = 1; y <= boardData[currentBoard].calculatedToYear; y++) {
    tempObj.push(y);
  } //end for

  //create our top Radar plot, of the ecosystem indicators
  drawEcosystemRadar(tempObj);
  //create our bottom Radar plot, of the yield scores
  // drawYieldRadar(tempObj);

  // toggle the legend checkboxes for both of the radar plots on the page
  // document.getElementById('resultsFrame').contentWindow.toggleYearCheckboxes(); //XXX

  //toggle the arrows on the results page
  document.getElementById('resultsFrame').contentWindow.toggleYearForLandPlotBy(0);

  //=======DEPRECATED
  //document.getElementById('resultsFrame').contentWindow.toggleYearForESIAsterBy(0);
  //=======END DEPRECATED

} //end displayResults

// this function creates the pie chart at the top of the graphics in the results page
//it uses d3 and has the option to be displayed by categories or by a complete listing
function drawD3LandPieChart(year, isTheChartInCategoryMode) {
  // RESETTING THE TEMPORARY COLOR AND LEGEND ELEMENT nameArray
  tempLegendItems = [];
  tempLegendColors = [];
  //remove the html that's already there, ie clear the chart
  document.getElementById('resultsFrame').contentWindow.document.getElementById('landusePieChart').innerHTML = " ";
  //pass data to the page that it needs, we do this by putting it in hidden divs
  document.getElementById('resultsFrame').contentWindow.document.getElementById('landYear').innerHTML = year;
  document.getElementById('resultsFrame').contentWindow.document.getElementById('upTo').innerHTML = boardData[currentBoard].calculatedToYear;

  var inMultiplayer = localStorage.getItem('LSinMultiplayer');
  /*
  * The variable multiplayerColorPack is used to hold the colors that represent each player in the the multiplayer set up mode.
  * For more information refer to Issue 386.
  */
  var multiplayerColorPack = ["#87ceee","#e6bb00","#cc6578","#127731","#c97b08","#302485"];
  var dataset;
  // console.log("Before, inMultiplayer is: "+inMultiplayer);
  //if in multiplayer mode, looking at different players and size of land each owns
  if(inMultiplayer === "true"){
    // console.log("inMultiplayer is: "+inMultiplayer);
    var dataset = [{
      label: 'Player 1',
      count: (Math.round(Totals.landUseResults[year].conventionalCornLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conventionalCornLandUse * 10) / 10)
    }, {
      label: 'Player 2',
      count: (Math.round(Totals.landUseResults[year].conservationCornLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conservationCornLandUse * 10) / 10)
    }, {
      label: 'Player 3',
      count: (Math.round(Totals.landUseResults[year].conventionalSoybeanLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conventionalSoybeanLandUse * 10) / 10)
    }, {
      label: 'Player 4',
      count: (Math.round(Totals.landUseResults[year].conservationSoybeanLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conservationSoybeanLandUse * 10) / 10)
    }, {
      label: 'Player 5',
      count: (Math.round(Totals.landUseResults[year].alfalfaLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].alfalfaLandUse * 10) / 10)
    }, {
      label: 'Player 6',
      count: (Math.round(Totals.landUseResults[year].permanentPastureLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].permanentPastureLandUse * 10) / 10)
    }];
  }
  //assign dataset based on whether or not categories are toggeled on, if so, then combine the dataset into one large heap
  else if (isTheChartInCategoryMode) {
    // console.log("inMultiplayer is: "+inMultiplayer);
    //data groupings, dummy labels are there to increase color contrast
    dataset = [{
      label: "Annual Grain",
      count: (Math.round(Totals.landUseResults[year].conventionalCornLandUse / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year].conservationCornLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conventionalCornLandUse * 10) / 10) + (Math.round(Totals.landUseResults[year].conservationCornLandUse * 10) / 10)
    }, {
      label: "dummy1",
      count: 0,
      number: 0
    }, {
      label: "Annual Legume",
      count: (Math.round(Totals.landUseResults[year].conventionalSoybeanLandUse / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year].conservationSoybeanLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conventionalSoybeanLandUse * 10) / 10) + (Math.round(Totals.landUseResults[year].conservationSoybeanLandUse * 10) / 10)
    }, {
      label: "dummy2",
      count: 0,
      number: 0
    }, {
      label: 'Mixed Fruits/Vegetables',
      count: (Math.round(Totals.landUseResults[year].mixedFruitsVegetablesLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].mixedFruitsVegetablesLandUse * 10) / 10)
    }, {
      label: "dummy3",
      count: 0,
      number: 0
    }, {
      label: "Pasture",
      count: (Math.round(Totals.landUseResults[year].permanentPastureLandUse / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year].rotationalGrazingLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].permanentPastureLandUse * 10) / 10) + (Math.round(Totals.landUseResults[year].rotationalGrazingLandUse * 10) / 10)
    }, {
      label: "dummy4",
      count: 0,
      number: 0
    }, {
      label: "Non-pasture Perennial Herbs",
      count: (Math.round(Totals.landUseResults[year].grassHayLandUse / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year].switchgrassLandUse / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year].prairieLandUse / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year].wetlandLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].grassHayLandUse * 10) / 10) + (Math.round(Totals.landUseResults[year].switchgrassLandUse * 10) / 10) + (Math.round(Totals.landUseResults[year].prairieLandUse * 10) / 10) + (Math.round(Totals.landUseResults[year].wetlandLandUse * 10) / 10)
    }, {
      label: "dummy5",
      count: 0,
      number: 0
    }, {
      label: 'Perennial Legume',
      count: (Math.round(Totals.landUseResults[year].alfalfaLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].alfalfaLandUse * 10) / 10)
    }, {
      label: "dummy6",
      count: 0,
      number: 0
    }, {
      label: "Perennial Woodland",
      count: (Math.round(Totals.landUseResults[year].conventionalForestLandUse / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year].conservationForestLandUse / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year].shortRotationWoodyBioenergyLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conventionalForestLandUse * 10) / 10) + (Math.round(Totals.landUseResults[year].conservationForestLandUse * 10) / 10) + (Math.round(Totals.landUseResults[year].shortRotationWoodyBioenergyLandUse * 10) / 10)
    }];
  }
  //else we'll set it up for listing all of the land types
  else {

    var dataset = [{
      label: 'Conventional Corn',
      count: (Math.round(Totals.landUseResults[year].conventionalCornLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conventionalCornLandUse * 10) / 10)
    }, {
      label: 'Conservation Corn',
      count: (Math.round(Totals.landUseResults[year].conservationCornLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conservationCornLandUse * 10) / 10)
    }, {
      label: 'Conventional Soybean',
      count: (Math.round(Totals.landUseResults[year].conventionalSoybeanLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conventionalSoybeanLandUse * 10) / 10)
    }, {
      label: 'Conservation Soybean',
      count: (Math.round(Totals.landUseResults[year].conservationSoybeanLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conservationSoybeanLandUse * 10) / 10)
    }, {
      label: 'Mixed Fruits/Vegetables',
      count: (Math.round(Totals.landUseResults[year].mixedFruitsVegetablesLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].mixedFruitsVegetablesLandUse * 10) / 10)
    }, {
      label: 'Permanent Pasture',
      count: (Math.round(Totals.landUseResults[year].permanentPastureLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].permanentPastureLandUse * 10) / 10)
    }, {
      label: 'Rotational Grazing',
      count: (Math.round(Totals.landUseResults[year].rotationalGrazingLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].rotationalGrazingLandUse * 10) / 10)
    }, {
      label: 'Grass Hay',
      count: (Math.round(Totals.landUseResults[year].grassHayLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].grassHayLandUse * 10) / 10)
    }, {
      label: 'Switchgrass',
      count: (Math.round(Totals.landUseResults[year].switchgrassLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].switchgrassLandUse * 10) / 10)
    }, {
      label: 'Prairie',
      count: (Math.round(Totals.landUseResults[year].prairieLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].prairieLandUse * 10) / 10)
    }, {
      label: 'Wetland',
      count: (Math.round(Totals.landUseResults[year].wetlandLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].wetlandLandUse * 10) / 10)
    }, {
      label: 'Alfalfa',
      count: (Math.round(Totals.landUseResults[year].alfalfaLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].alfalfaLandUse * 10) / 10)
    }, {
      label: 'Conventional Forest',
      count: (Math.round(Totals.landUseResults[year].conventionalForestLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conventionalForestLandUse * 10) / 10)
    }, {
      label: 'Conservation Forest',
      count: (Math.round(Totals.landUseResults[year].conservationForestLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].conservationForestLandUse * 10) / 10)
    }, {
      label: 'Short Rotation Woody Bioenergy',
      count: (Math.round(Totals.landUseResults[year].shortRotationWoodyBioenergyLandUse / Totals.totalArea * 100 * 10) / 10),
      number: (Math.round(Totals.landUseResults[year].shortRotationWoodyBioenergyLandUse * 10) / 10)
    }];
  } //dataset is assigned now

  //variables for the display of the chart on the page
  // be careful about changing these values since they are tied closely to
  // css styling on results page
  // var width = 360;
  // var height = 360;
  // var radius = Math.min(width, height) / 2;
  var w = Math.round(window.innerWidth * 0.38);
  var h = Math.round(window.innerHeight * 0.382);

  // if the pie chart is being drawn to be printed on a pdf then set the fixed size
  if (printMode) {
    w = h = 200;
  }

  var pieChart_length = Math.min(w, h);
  var legendW = Math.round(pieChart_length * 1.06);

  var radius = pieChart_length / 2;

  //colors are assigned from one of the default scaling options
  //if in multiplayer mode the color options will change else it will use default d3 schemeCategory20 colors
  if(localStorage.getItem('LSinMultiplayer')==="true"){
    var color = d3.scaleOrdinal(multiplayerColorPack);
  }
  else{
    var color = d3.scaleOrdinal(d3.schemeCategory20);
  }

  //set up an object and array for referring back and forth to elements
  var nameArray = [];
  var colorLinker = {};

  //document.getElementById('resultsFrame').contentWindow.document.getElementById('chart').innerHTML = "" ;
  var chart = document.getElementById('resultsFrame').contentWindow.document.getElementById('landusePieChart');

  //d3 stuff here, I won't comment this section too heavily as it is mostly typical graphics
  var svg = d3.select(chart)
    .append('svg')
    .attr("class", "graph-svg-component")
    .attr("id", "pieSVG")
    // .attr('width', width + legendW) //leave room for legend so add 280
    // .attr('height', height)
    .attr('width', pieChart_length + legendW) //leave room for legend so add 280
    .attr('height', pieChart_length)
    .append('g')
    .attr('transform', 'translate(' + (pieChart_length / 2) + ',' + (pieChart_length / 2) + ')');

  var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius * 0.55)
    .padAngle(0.01);

  var pie = d3.pie()
    .value(function(d) {
      return d.count;
    })
    .sort(null);

  //animation for the pie graph
  function tweenPie(b) {
    b.innerRadius = 0;
    var i = d3.interpolate({
      startAngle: 0,
      endAngle: 0
    }, b);
    return function(t) {
      return arc(i(t));
    };
  }

  //create the elements for hover over information
  var mouseoverInfo = d3.select(chart)
    .append('g')
    .attr('class', 'mouseoverInfo');

  mouseoverInfo.append('div')
    .attr('class', 'label');

  mouseoverInfo.append('div')
    .attr('class', 'count');

  mouseoverInfo.append('div')
    .attr('class', 'percent');

  //let's add the arcs to the pie graph now
  var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('class', 'dataArc')
    .attr('d', arc)
    .attr('count', function(d) {
      return d.data.number;
    })
    .attr('percent', function(d) {
      return d.data.count;
    })
    .attr('fill', function(d, i) {
      var hue = color(d.data.label);
      //use these structures to keep track of what actually has a count
      // for the legend
      if (d.data.count != 0) {
        nameArray.push(d.data.label);
        colorLinker[d.data.label] = hue;
      }
      return hue;
    })
    .attr("id", function(d) {
      return d.data.label;
    })
    .on('mouseover', function(d) {
      //update the mouseover box
      var percent = d.data.count;
      mouseoverInfo.select('.label').html(d.data.label);
      mouseoverInfo.select('.count').html(d.data.number + " acres");
      mouseoverInfo.select('.percent').html((Math.round(percent * 100) / 100) + '%');
      mouseoverInfo.style('border-color', color(d.data.label));
      mouseoverInfo.style('opacity', 1);
      mouseoverInfo.style('display', 'block');

      //highlight the pie slice
      d3.select(this).classed("arc", false);
      d3.select(this).classed("arcHighlight", true);
    })
    .on('mouseout', function() {
      //hide mouseover box
      mouseoverInfo.style('display', 'none');

      //unhighlight the pie slice
      d3.select(this).classed("arcHighlight", false);
      d3.select(this).classed("arc", true);
    })
    .transition()
    .duration(900)
    .attrTween("d", tweenPie);

  //that's it for the pie chart, now we just need to add its legend information

  //sizing for the colored squares and spaces
  // var legendRectSize = 18;
  // var legendSpacing = 4;
  var legendRectSize = Math.round(0.05 * pieChart_length);
  var legendSpacing = Math.round(0.22 * legendRectSize);

  //add all the elements that have a nonzero count
  var legend = svg.selectAll('.legend')
    .data(nameArray)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .on('mouseover', function(d) {
      //highlight text
      d3.select(this).style("fill", "steelblue");

      //highlight arc
      var slice = document.getElementById('resultsFrame').contentWindow.document.getElementById(d);
      d3.select(slice).classed("arc", false)
        .classed("arcHighlight", true);

      //show appropriate mouseover info
      mouseoverInfo.select('.label').html(d);
      mouseoverInfo.select('.count').html(d3.select(slice).attr("count") + " acres");
      mouseoverInfo.select('.percent').html((Math.round(d3.select(slice).attr("percent") * 100) / 100) + '%');
      mouseoverInfo.style('border-color', color(d));
      mouseoverInfo.style('opacity', 1);
      mouseoverInfo.style('display', 'block');

    })
    .on('mouseout', function(d) {

      //set text back to black
      d3.select(this).style("fill", "black");

      //unhighlight the arc
      var slice = document.getElementById('resultsFrame').contentWindow.document.getElementById(d);
      d3.select(slice).classed("arcHighlight", false);
      d3.select(slice).classed("arc", true);

      //undisplay the mouseover information box
      mouseoverInfo.style('display', 'none');
    })
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset = height * nameArray.length / 2;
      var horz = pieChart_length / 2 + 20;
      var vert = i * height - offset;
      // var horz = width / 2 + 20;
      return 'translate(' + horz + ',' + vert + ')';
    });

  //add legend color squares
  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function(d) {
      tempLegendColors.push(colorLinker[d]); // adds the legend color to array (for print function)
      return colorLinker[d];
    })
    .style('stroke', function(d) {
      return colorLinker[d];
    });

  //add legend text info
  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
      tempLegendItems.push(d); // adds the legend element to the array (for print function)
      return d;
    });

  //lastly, now add the chart title in the center
  // main chart title
  svg.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "1.8vw")
    .style("font-weight", "bold")
    .text("Land Use");
  //also add the year below that
  svg.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "1.8vw")
    .style("font-weight", "bold")
    .text("Year " + year);

  multiplayerResults();
} //end drawD3LandPieChart()

//this funtion creates and animates the Ecoscores aster plot
// it also creates the quality indicator gradients to the plot's right
//======= it's use is currently deprecated
function drawEcosystemIndicatorsDisplay(year) {
  // clear info
  document.getElementById('resultsFrame').contentWindow.document.getElementById('asterChart').innerHTML = " ";
  document.getElementById('resultsFrame').contentWindow.document.getElementById('asterContainer').innerHTML = " ";
  //pass parameters along to page via a hidden div
  document.getElementById('resultsFrame').contentWindow.document.getElementById('ecoYear').innerHTML = year;
  document.getElementById('resultsFrame').contentWindow.document.getElementById('upTo').innerHTML = boardData[currentBoard].calculatedToYear;

  //set up d3 dataset
  var dataset = [{
    name: "Nitrate Concentration",
    score: (Math.round(Totals.nitrateConcentrationScore[year] * 10) / 10),
    color: "#1f77b4",
    backColor: "navy",
    raw: (Math.round(Totals.nitrateConcentration[year] * 10) / 10) + " ppm"
  }, {
    name: "Phosphorus Load",
    score: (Math.round(Totals.phosphorusLoadScore[year] * 10) / 10),
    color: "#ff7f0e",
    backColor: "navy",
    raw: (Math.round(Totals.phosphorusLoad[year] * 10) / 10) + " tons"
  }, {
    name: "Sediment Delivery",
    score: (Math.round(Totals.sedimentDeliveryScore[year] * 10) / 10),
    color: "	#2ca02c",
    backColor: "navy",
    raw: (Math.round(Totals.sedimentDelivery[year] * 10) / 10) + " tons"
  }, {
    name: "Carbon Sequestration",
    score: (Math.round(Totals.carbonSequestrationScore[year] * 10) / 10),
    color: "#d62728",
    backColor: "maroon",
    raw: (Math.round(Totals.carbonSequestration[year] * 10) / 10) + " tons"
  }, {
    name: "Gross Erosion",
    score: (Math.round(Totals.grossErosionScore[year] * 10) / 10),
    color: "#9467bd",
    backColor: "maroon",
    raw: (Math.round(Totals.grossErosion[year] * 10) / 10) + " tons"
  }, {
    name: "Game Wildlife",
    score: (Math.round(Totals.gameWildlifePointsScore[year] * 10) / 10),
    color: "#8c564b",
    backColor: "tomato",
    raw: (Math.round(Totals.gameWildlifePoints[year] * 10) / 10) + " pts"
  }, {
    name: "Biodiversity",
    score: (Math.round(Totals.biodiversityPointsScore[year] * 10) / 10),
    color: "#e377c2",
    backColor: "tomato",
    raw: (Math.round(Totals.biodiversityPoints[year] * 10) / 10) + " pts"
  }, ];

  //chart parameters
  var width = 360;
  var height = 360;
  var radius = Math.min(width, height) / 2;
  var innerRadius = 75;

  //d3 stuff, once again, mostly standard, although a little less so
  //  not heavily commented for that reason

  var asterChart = document.getElementById('resultsFrame').contentWindow.document.getElementById('asterChart');

  var svg = d3.select(asterChart)
    .append('svg')
    .attr("class", "graph-svg-component")
    .attr('width', width + 280)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

  var innerArc = d3.arc()
    .innerRadius(innerRadius)
    .padAngle(0)
    //determine outter radius based on score out of 100
    .outerRadius(function(d) {
      return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius;
    });

  var outlineArc = d3.arc()
    .innerRadius(radius - 1)
    .outerRadius(radius);

  var coverArc = d3.arc()
    .innerRadius(0)
    .outerRadius(innerRadius);

  //a convoluted function for animating the aster plot
  // svg programming is obscure, but basically, we want to use this to graw our graphics
  function generateSVGArc(x, y, r, startAngle, endAngle) {

    var largeArc = 0;
    var sweepFlag = 1; // is arc to be drawn in +ve direction?

    return ['M', x, y, 'L', x + Math.sin(startAngle) * r, y - (Math.cos(startAngle) * r),
      'A', r, r, 0, largeArc, sweepFlag, x + Math.sin(endAngle) * r, y - (Math.cos(endAngle) * r), 'Z'
    ].join(' ');
  } //end nested function

  //function to create the tween animation moving the values from inner radius to their
  // correct positions
  function interpolateSVGArc(x, y, r, startAngle, endAngle) {
    return function(t) {
      return generateSVGArc(x, y, (r - innerRadius) * t + innerRadius, startAngle, endAngle);
    };
  } //end nested function

  //d3 programming for creating the aster plot
  // this is a very sneaky plot, as it is essentially a pie chart with variable outter radii
  //  among the pie slice sections

  var pie = d3.pie()
    .value(function(d) {
      return 1; //everything has equal value, split up the pie chart accordingly
    })
    .sort(null);

  //create mouseover information elements

  var mouseoverInfo = d3.select(asterChart)
    .append('g')
    .attr('class', 'mouseoverInfo');

  mouseoverInfo.append('div')
    .attr('class', 'label');

  mouseoverInfo.append('div')
    .attr('class', 'count');

  mouseoverInfo.append('div')
    .attr('class', 'score');

  //append data to plot

  var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', innerArc)
    .attr('fill', function(d) {
      return d.data.color;
    })
    .attr('class', 'arc')
    .on('mouseover', function(d) {
      //setup mouseover text and style
      mouseoverInfo.select('.label').html(d.data.name);
      mouseoverInfo.select('.count').html(d.data.raw);
      mouseoverInfo.select('.score').html(d.data.score + "/100");
      mouseoverInfo.style('border-color', d.data.color);
      mouseoverInfo.style('display', 'block');

      //highlight hovered arc
      d3.select(this).classed("arc", false);
      d3.select(this).classed("arcHighlight", true);
    })
    .on('mouseout', function() {
      //hide mouseoverInfo
      mouseoverInfo.style('display', 'none');

      //unhighlight slice
      d3.select(this).classed("arcHighlight", false);
      d3.select(this).classed("arc", true);
    })
    .transition()
    .duration(700)
    .attrTween('d', function(d, i) {
      //check to see if the score is very low, if so, still give it a visible slab
      var endRadius = (d.data.score < 2) ? innerRadius + 6 : (radius - innerRadius) * (d.data.score / 100.0) + innerRadius;
      return interpolateSVGArc(0, 0, endRadius, d.startAngle, d.endAngle);
    });

  //setup the central cover
  var dummy = [{
    count: 1
  }];

  //since the svg draws from the center, cover this with a white circle to disguise what's happening
  var cover = svg.selectAll(".cover")
    .data(pie(dummy))
    .enter().append("path")
    .attr("fill", "white")
    .attr("d", coverArc);

  //add the outline for each of the containers
  //  i'm still not sure how I feel about these, but consider removing the outline
  var outerPath = svg.selectAll(".outlineArc")
    .data(pie(dataset))
    .enter().append("path")
    .attr("fill", "none")
    .attr("stroke", function(d) {
      return d.data.backColor;
    })
    .attr("class", "outlineArc")
    .attr("d", outlineArc);

  //add title and year in the center of the plot
  svg.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "1.8vw")
    .style("font-weight", "bold")
    .text("Eco-Scores");

  svg.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "1.8vw")
    .style("font-weight", "bold")
    .text("Year " + year);


  //end of the aster plot creation, now do the indicator gradients

  //this function keeps track of the gradients based on the score
  function getColor(number) {
    var tempColor;

    if (number > 90) return "#0d46f2";
    if (number > 70) return "#3359cc";
    if (number > 50) return "#4d66b3";
    if (number > 30) return "#60709f";
    if (number > 0) return "#808080";
    //else
    return "#333333";
  } //end nested function


  var nameArray = [];
  var colorLinker = {};
  var dataLinker = {};

  //setup the initial data for these indicators

  //water quality indicator

  nameArray.push("Water Quality");

  var sum = 0;
  //take into account the categories that affect water quality
  for (var i = 0; i <= 2; i++) {
    sum += dataset[i].score;
  }

  dataLinker[nameArray[0]] = sum / 3; //average them
  colorLinker[nameArray[0]] = getColor(sum / 3);

  //soil quality indicator

  nameArray.push("Soil Quality");

  var sum = 0;
  for (var i = 3; i <= 4; i++) {
    sum += dataset[i].score;
  }

  dataLinker[nameArray[1]] = sum / 2; //average them
  colorLinker[nameArray[1]] = getColor(sum / 2);

  //habitat quality indicator

  nameArray.push("Habitat Quality");

  var sum = 0;
  for (var i = 5; i <= 6; i++) {
    sum += dataset[i].score;
  }

  dataLinker[nameArray[2]] = sum / 2; //average them
  colorLinker[nameArray[2]] = getColor(sum / 2);

  //now that all of this is set up, now create the graphic, d3

  var container = document.getElementById('resultsFrame').contentWindow.document.getElementById('asterContainer');

  var svg2 = d3.select(container)
    .append('svg')
    .attr('height', 200)
    .attr("class", "graph-svg-component")
    .append('g');


  var legendRectSize = 18;
  var legendSpacing = 4;

  //set up the spacing of the elements
  var legend = svg2.selectAll('.legend')
    .data(nameArray)
    .enter()
    .append('g')
    .attr('class', 'ecoLegend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset = 10;
      var horz = 10;
      var vert = i * height + offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

  //add the text headings for the indicators
  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
      return d + " : " + Math.round(dataLinker[d]) + "/100";
    })
    .attr('transform', function(d, i) {
      var horz = 0;
      var vert = (i) * (legendRectSize + 7 + legendSpacing);
      return 'translate(' + horz + ',' + vert + ')';
    });

  //now add the bar of color
  legend.append('rect')
    .attr('width', legendRectSize * 15.2)
    .attr('height', legendRectSize)
    .attr('fill', function(d) {
      return colorLinker[d];
    })
    .style('stroke', function(d) {
      return colorLinker[d];
    })
    .attr('transform', function(d, i) {
      var horz = 0;
      var vert = (i + 1) * (legendRectSize + 5 + legendSpacing);
      return 'translate(' + horz + ',' + vert + ')';
    })
    .transition()
    .duration(1000)
    .attrTween("fill", function() {
      //animate the change of the color gradient from black to bright blue
      return d3.interpolateRgb("#000000", this.getAttribute("fill"));
    });

} //end drawEcosystemIndicatorsDisplay()

//drawEcosystemRadar() takes an array of years and draws a radar chart
// for each of the years
// the code here is original, but the Radar object prototype is credited following
function drawEcosystemRadar(yearArray) {
  // RESETTING THE TEMPORARY COLOR AND LEGEND ELEMENT nameArray
  radarLegendItems = [];
  radarLegendColors = [];
  //clear info already on page
  document.getElementById('resultsFrame').contentWindow.document.getElementById('radarChart').innerHTML = "";
  document.getElementById('resultsFrame').contentWindow.document.getElementById('radarLegend').innerHTML = "";

  var w = Math.round(window.innerWidth * 0.317);
  var h = Math.round(window.innerHeight * 0.319);
  // set a fixed size for radar for print mode
  if (printMode) {
    w = h = 250;
  }
  var graphLength = Math.min(w, h);

  var dataset = [];
  var legendOptions = [];
  var radarClassElementsString = "radar-chart-serie";
  var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

  //assign the dataset for each year
  for (var i = 0; i < yearArray.length; i++) {

    var y = yearArray[i];
    var obj = [{
      label: "Nitrate Concentration",
      axis: "Nitrate",
      value: Totals.nitrateConcentrationScore[y] / 100,
      raw: (Math.round(Totals.nitrateConcentration[y] * 10) / 10) + " ppm"
    }, {
      label: "Total Sum Yields",
      axis: "Total Yields",

      value: Math.min((Totals.cornGrainYieldScore[y]  + Totals.soybeanYieldScore[y]  + Totals.mixedFruitsAndVegetablesYieldScore[y] + Totals.alfalfaHayYieldScore[y]  + Totals.grassHayYieldScore[y]  +
      Totals.switchgrassYieldScore[y] + Totals.cattleYieldScore[y] + Totals.woodYieldScore[y] + Totals.shortRotationWoodyBiomassYieldScore[y]) / 100, 100),
    }, {
      label: "Phosphorus Load",
      axis: "Phosphorus",
      value: Totals.phosphorusLoadScore[y] / 100,
      raw: (Math.round(Totals.phosphorusLoad[y] * 10) / 10) + " tons"
    }, {
      label: "Sediment Delivery",
      axis: "Sediment",
      value: Totals.sedimentDeliveryScore[y] / 100,
      raw: (Math.round(Totals.sedimentDelivery[y] * 10) / 10) + " tons"
    }, {
      label: "Carbon Sequestration",
      axis: "Carbon",
      value: Totals.carbonSequestrationScore[y] / 100,
      raw: (Math.round(Totals.carbonSequestration[y] * 10) / 10) + " tons"
    }, {
      label: "Gross Erosion",
      axis: "Erosion",
      value: Totals.grossErosionScore[y] / 100,
      raw: (Math.round(Totals.grossErosion[y] * 10) / 10) + " tons"
    }, {
      label: "Game Wildlife",
      axis: "Wildlife",
      value: Totals.gameWildlifePointsScore[y] / 100,
      raw: (Math.round(Totals.gameWildlifePoints[y] * 10) / 10) + " pts"
    }, {
      label: "Biodiversity",
      axis: "Biodiversity",
      value: Totals.biodiversityPointsScore[y] / 100,
      raw: (Math.round(Totals.biodiversityPoints[y] * 10) / 10) + " pts"
    }];

    dataset.push(obj);
    legendOptions.push("Year " + y);
  } //end for loop

  //Separate configuration options for the radar
  var overrideConfig = {
    // w: graphWidth,
    // h: graphHeight,
    // ExtraWidthX: 300
    w: graphLength,
    h: graphLength,
    maxValue: 1,
    levels: 5,
    ExtraWidthX: graphLength,
    TranslateX: graphLength * 0.487, //95
    TranslateY: graphLength * 0.154 //30
  };

  var radarId = document.getElementById('resultsFrame').contentWindow.document.getElementById('radarChart');
  var radarLegendId = document.getElementById('resultsFrame').contentWindow.document.getElementById('radarLegend');

  //Create the Radar chart on page
  RadarChart.draw(radarId, dataset, overrideConfig, 'mouseoverInfoRadarRight', radarClassElementsString);

  //Now let's create the legend, standard d3 stuff
  var legendWidth = Math.round(window.innerWidth * 0.376);
  var legendHeight = Math.round(window.innerHeight * 0.394);
  var legendLength = Math.round(Math.min(legendWidth, legendHeight));

  var svg = d3.select(radarLegendId)
    .append('svg')
    // .attr('width', legendWidth)
    // .attr('height', legendHeight)
    .attr('width', legendLength)
    .attr('height', legendLength)
    .append('g')
    .attr('transform', 'translate(' + (legendLength / 2) + ',' + (legendLength / 2) + ')');

  //add legend/chart title
  svg.append("text")
    .attr("x", 0)
    // .attr("y", -120)
    .attr("y", Math.round(-0.324 * legendHeight))
    .attr("text-anchor", "middle")
    .style("font-size", "1.8vw")
    .style("font-weight", "bold")
    .text("Ecosystem Services");

  //sizing for the colored squares and spaces
  // var legendRectSize = 18;
  // var legendSpacing = 4;
  var legendRectSize = Math.round(graphLength * 0.06);
  var legendSpacing = Math.round(legendRectSize * 0.22);

  //add all of the year series to the legend
  var legend = svg.selectAll('.legend')
    .data(legendOptions)
    .enter()
    .append('g')
    .on('mouseover', function(d) {

      //change text color
      d3.select(this).style("fill", "steelblue");

      //select the polygon area and highlight it
      var g = d3.select(radarId);
      z = d3.select(this).attr("childElement");
      z = "polygon." + z;

      g.selectAll("polygon")
        .transition(200)
        .style("fill-opacity", 0.1);
      g.selectAll(z)
        .transition(200)
        .style("fill-opacity", 0.7);
    })
    .on('mouseout', function(d) {

      //set legend text back to black
      d3.select(this).style("fill", "black");

      //reset all of the polygons in the chart
      var g = d3.select(radarId);
      g.selectAll("polygon")
        .transition(200)
        .style("fill-opacity", 0.2);
    })
    .attr("childElement", function(d, i) {
      return radarClassElementsString + i;
    })
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      // var offset = 80;
      // var horz = -117;
      var offset = Math.round(legendRectSize * 4.44);
      var horz = Math.round(legendRectSize * -6.5);
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

  //add legend color squares
  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function(d, i) {
      return colorscale(i);
    })
    .style('stroke', function(d, i) {
      radarLegendColors.push(colorscale(i)); // pushes the item names in the radar plot chart's legend to items array
      return colorscale(i);
    });

  //add legend text info
  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
      radarLegendItems.push(d); // pushes the item names in the radar plot chart's legend to items array
      return d;
    });
  // add checkbox
  legend.append('foreignObject')
    .attr('style', 'visibility: visible;')
    .attr('width', 20)
    .attr('height', 20)
    .attr('x', 70)
    .attr('y', 0)

    .append('xhtml:input')
    .attr('id', function(d) {
      return "checkboxYear" + d.slice(-1);
    })
    .attr('class', 'yearCheckbox')
    .attr('onclick', function(d) {
      return "radarPlotYearToggle(" + d.slice(-1) + ");";
    })
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .attr('checked', "")
    .attr('type', 'checkbox');

} //end  drawEcosystemRadar()

//this function mainly is responsible for setting up the precipitation bar graph
// as well as the left utility  which gives info on the year's precip and a nice image
function drawPrecipitationInformationChart() {

  //this nested function updates the text and images in the left container, mouseover info
  function setupPrecipInfo(year) {
    container.select('.yearLabel').html(parent.data[year].label);
    container.select('.precipValue').html(parent.data[year].value + " inches");
    container.select('.precipType').html(parent.data[year].adj);

    var img = " ";
    switch (parent.data[year].adj) {
      case "Dry":
        // "Clouds" by https://icons8.com with free commercial use / Inserted oval under cload
        img = "./imgs/dry.png";
        break;
      case "Normal":
        // "Partly Cloudy Rain" by https://icons8.com with free commercial use
        img = "./imgs/normal.png";
        break;
      case "Wet":
        // "Heavy Rain" by https://icons8.com with free commercial use
        img = "./imgs/wet.png";
        break;
      case "Flood":
        // "Torrential Rain" by https://icons8.com with free commercial use / Inserted curved black lines under rain/cloud
        img = "imgs/flood.png";
        break;
    } //end switch

    mouseoverInfo.select('.precipImg').attr('src', img);
  } //end nested function


  //reset precip chart on page
  var element = document.getElementById('resultsFrame').contentWindow.document.getElementById('precipChart');
  //pass information to the page by inserting it into a hidden div
  document.getElementById('resultsFrame').contentWindow.document.getElementById('precipChart').innerHTML = " ";
  document.getElementById('resultsFrame').contentWindow.document.getElementById('precipInfo').innerHTML = " ";

  //assign data
  for (var i = 0; i < boardData[currentBoard].precipitation.length - 2; i++) {
    boardData[currentBoard].precipitation[i] = Number(boardData[currentBoard].precipitation[i]);
  }

  // parent.data = [{
  //   label: "Year 0",
  //   value: boardData[currentBoard].precipitation[0],
  //   percent: 0,
  //   adj: "",
  //   year: 0
  // }, {
  //   label: "Year 1",
  //   value: boardData[currentBoard].precipitation[1],
  //   percent: 0,
  //   adj: "",
  //   year: 1
  // }, {
  //   label: "Year 2",
  //   value: boardData[currentBoard].precipitation[2],
  //   percent: 0,
  //   adj: "",
  //   year: 2
  // }, {
  //   label: "Year 3",
  //   value: boardData[currentBoard].precipitation[3],
  //   percent: 0,
  //   adj: "",
  //   year: 3
  // }];
  // console.log(parent.data);

  /*
     Assign precipitation value to "data" variable.
     Previous version: assigned 4-year precipitation data anyways no matter how many years there are.
     Current version: assigned precipitation data according to how many years we have
     In this way, in the "Result" page, we're able to show precipitation bars according to the number of years
  */
  parent.data = [];
  for(var j = 0; j <= boardData[currentBoard].calculatedToYear; j++) {
    var precipData = {
      label: "Year " + j,
      value: boardData[currentBoard].precipitation[j],
      adj: "",
      year: j
    };
    parent.data.push(precipData);
  }
  // console.log(parent.data);

  //set up data percentage and adjectives
  for (var y = 0; y < data.length; y++) {
  // for (var y = 0; y <= boardData[currentBoard].calculatedToYear; y++) {
    var tempPercent;
    var tempAdj;

    switch (parent.data[y].value) {
      case 24.58:
        tempPercent = 25;
        tempAdj = "Dry";
        break;
      case 28.18:
        tempPercent = 36;
        tempAdj = "Dry";
        break;
      case 30.39:
        tempPercent = 42;
        tempAdj = "Normal";
        break;
      case 32.16:
        tempPercent = 49;
        tempAdj = "Normal";
        break;
      case 34.34:
        tempPercent = 57;
        tempAdj = "Normal";
        break;
      case 36.47:
        tempPercent = 64;
        tempAdj = "Wet";

        if (y > 0 && parent.data[y - 1].adj == "Dry") {
          tempAdj = "Flood";
        }

        break;
      case 45.1:
        tempPercent = 89;
        tempAdj = "Wet";

        if (y > 0 && parent.data[y - 1].adj == "Dry") {
          tempAdj = "Flood";
        }

        break;
      default:
        tempPercent = 0;
        tempAdj = "";
        break;
    } //end switch

    //assign data values
    parent.data[y].percent = tempPercent;
    parent.data[y].adj = tempAdj;
  }

  //d3 stuff, again, I won't comment too heavily since much of this is standard practice

  //bar chart width and height
  // note that these are closely interrelated to css styling on results page
  // var width = 420;
  // var barHeight = 30;
  var width = Math.round(window.innerWidth * 0.3);
  var barHeight = Math.round(window.innerHeight * 0.045);

  //if the pie chart is being drawn to be prionted on a pdf then set a fixed size for graph
  if (printMode) {
    width = 500;
    barHeight = 45;
  }

  //create bar scale for percentages
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

  var chart = d3.select(element)
    .attr("width", width)
    .attr("height", barHeight * data.length);

  //set up hover over information in left container

  var element = document.getElementById('resultsFrame').contentWindow.document.getElementById('precipInfo');

  var mouseoverInfo = d3.select(element)
    .append('g');

  mouseoverInfo.append('div')
    .attr('class', 'leftPrecipContainer');
  // .attr('style', 'display: inline-block; float: left; position: relative; top: 18%; width: 60%');

  var container = mouseoverInfo.select('.leftPrecipContainer');

  container.append('div')
    .attr('class', 'yearLabel');

  container.append('div')
    .attr('class', 'precipValue');

  container.append('div')
    .attr('class', 'precipType');

  mouseoverInfo.append('img')
    .attr('class', 'precipImg');

  //setup precipitation bar chart
// console.log(chart.selectAll("g").data());
// console.log(chart.selectAll("g").data(data));
// console.log(chart.selectAll("g").data(data).enter());
// console.log(data);
// console.log(parent.data);
// console.log(data == parent.data);

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr('class', 'barData')
    .attr("transform", function(d, i) {
      return "translate(0," + (i * barHeight + 2) + ")";
    });

  bar.append("rect")
    .attr("width", function(d) {
      return x(d.percent);
    })
    .attr("height", barHeight - boardData[currentBoard].calculatedToYear)
    .attr("class", "legendBars")
    .attr('fill', '#1f77b4')
    .on('mouseover', function(d) {

      setupPrecipInfo(d.year);

      mouseoverInfo.style('display', 'block');

      d3.select(this).attr('fill', 'lightskyblue');
    })
    .on('mouseout', function() {
      d3.select(this).attr('fill', '#1f77b4');

      setupPrecipInfo(currentYear);

    })
    .transition()
    .duration(1400)
    //animation of bars
    .attrTween("width", function() {
      return d3.interpolate(0, this.getAttribute("width"));
    });

  bar.append("text")
    .attr("x", function(d) {
      return x(d.percent) + 7;
    })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) {
      // console.log(d);
      return d.label;
    })
    .attr('fill', 'black');

  //lastly, after all of the chart setup, just setup the default information in the
  //  precipitation graphic to the left
  setupPrecipInfo(currentYear);

} //end drawPrecipitationInformationChart()

// // This function is in some ways similar to the ecosystem radar function
// //  here we updata the dataset and legend accordingly
// function drawYieldRadar(yearArray) {
//
//   //clear info already on page
//   document.getElementById('resultsFrame').contentWindow.document.getElementById('yieldRadarChart').innerHTML = " ";
//   document.getElementById('resultsFrame').contentWindow.document.getElementById('yieldRadarLegend').innerHTML = " ";
//
//   var w = Math.round(window.innerWidth * 0.317);
//   var h = Math.round(window.innerHeight * 0.319);
//   var graphLength = Math.min(w, h);
//   // var graphWidth = 300,
//   //   graphHeight = 300;
//
//   var dataset = [];
//   var legendOptions = [];
//   var colorscale = d3.scaleOrdinal(d3.schemeCategory10);
//   var radarClassElementsString = "yield-radar-chart-serie"; //ironically missing an s
//
//   //for each year given, setup the data in that series
//   for (var i = 0; i < yearArray.length; i++) {
//
//     var y = yearArray[i];
//     //Totals.yieldResults[y][tempString]
//     var obj = [{
//         label: "Corn Grain",
//         axis: "Corn Grain",
//         value: Totals.cornGrainYieldScore[y] / 100,
//         raw: (Math.round(Totals.yieldResults[y].cornGrainYield * 10) / 10) + " bu"
//       },
//       {
//         label: "Soybean",
//         axis: "Soybean",
//         value: Totals.soybeanYieldScore[y] / 100,
//         raw: (Math.round(Totals.yieldResults[y].soybeanYield * 10) / 10) + " bu"
//       },
//       {
//         label: "Mixed Fruits and Vegetables",
//         axis: "Fruit/Veg",
//         value: Totals.mixedFruitsAndVegetablesYieldScore[y] / 100,
//         raw: (Math.round(Totals.yieldResults[y].mixedFruitsAndVegetablesYield * 10) / 10) + " tons"
//       },
//       {
//         label: "Cattle",
//         axis: "Cattle",
//         value: Totals.cattleYieldScore[y] / 100,
//         raw: (Math.round(Totals.yieldResults[y].cattleYield * 10) / 10) + " animals"
//       },
//       {
//         label: "Alfalfa Hay",
//         axis: "Alfalfa",
//         value: Totals.alfalfaHayYieldScore[y] / 100,
//         raw: (Math.round(Totals.yieldResults[y].alfalfaHayYield * 10) / 10) + " tons"
//       },
//       {
//         label: "Grass Hay",
//         axis: "Grass Hay",
//         value: Totals.grassHayYieldScore[y] / 100,
//         raw: (Math.round(Totals.yieldResults[y].grassHayYield * 10) / 10) + " tons"
//       },
//       {
//         label: "Switchgrass Biomass",
//         axis: "Switchgrass",
//         value: Totals.switchgrassYieldScore[y] / 100,
//         raw: (Math.round(Totals.yieldResults[y].switchgrassYield * 10) / 10) + " tons"
//       },
//       {
//         label: "Wood",
//         axis: "Wood",
//         value: Totals.woodYieldScore[y] / 100,
//         raw: (Math.round(Totals.yieldResults[y].woodYield * 10) / 10) + " board-ft"
//       },
//       {
//         label: "Short Rotation Woody Biomass",
//         axis: "Woody Biomass",
//         value: Totals.shortRotationWoodyBiomassYieldScore[y] / 100,
//         raw: (Math.round(Totals.yieldResults[y].shortRotationWoodyBiomassYield * 10) / 10) + " tons"
//       }
//     ];
//
//     dataset.push(obj);
//     legendOptions.push("Year " + y);
//   }
//
//   //not used, but is useful for scaling the radar plot
//   //  I decided against using the maximumOfData in config, as it is somewhat misleading
//   //  when the graphic changes scales between uses
//   var maximumOfData = 0;
//   for (var i = 0; i < dataset.length; i++) {
//     for (var j = 0; j < dataset[i].length; j++) {
//       if (dataset[i][j].value > maximumOfData) maximumOfData = dataset[i][j].value;
//     }
//   }
//
//   //option overrides for chart
//   var chartConfigOverride = {
//     // w: graphWidth,
//     // h: graphHeight,
//     w: graphLength,
//     h: graphLength,
//     maxValue: 1,
//     levels: 5,
//     ExtraWidthX: 300,
//     TranslateX: graphLength * 0.487, //95
//     TranslateY: graphLength * 0.154 //30
//   };
//
//   //get elements in the child frame
//   var radarId = document.getElementById('resultsFrame').contentWindow.document.getElementById('yieldRadarChart');
//   var radarLegendId = document.getElementById('resultsFrame').contentWindow.document.getElementById('yieldRadarLegend');
//   // var checkboxes = document.getElementById('resultsFrame').contentWindow.document.getElementById('yieldChecks');
//
//   //use Radar object to create a plot
//   RadarChart.draw(radarId, dataset, chartConfigOverride, 'mouseoverInfoRadarLeft', radarClassElementsString);
//
//   //now, time for the legend
//   // var legendWidth = 355;
//   // var legendHeight = 370;
//   var legendWidth = Math.round(window.innerWidth * 0.376);
//   var legendHeight = Math.round(window.innerHeight * 0.394);
//   var legendLength = Math.round(Math.min(legendWidth, legendHeight));
//
//   var svg = d3.select(radarLegendId)
//     .append('svg')
//     // .attr('width', legendWidth)
//     // .attr('height', legendHeight)
//     .attr('width', legendLength)
//     .attr('height', legendLength)
//     .append('g')
//     .attr('transform', 'translate(' + (legendLength / 2) + ',' + (legendLength / 2) + ')');
//
//   //add title for legend/chart
//   svg.append("text")
//     .attr("x", 0)
//     // .attr("y", -120)
//     .attr("y", Math.round(-0.324 * legendHeight))
//     .attr("text-anchor", "middle")
//     .style("font-size", "1.8vw")
//     .style("font-weight", "bold")
//     .text("Annual Yield Results");
//
//   //sizing for the colored squares and spaces
//   // var legendRectSize = 18;
//   // var legendSpacing = 4;
//   var legendRectSize = Math.round(graphLength * 0.06);
//   var legendSpacing = Math.round(legendRectSize * 0.22);
//
//   //add all the elements that have a nonzero count
//   var legend = svg.selectAll('.legend')
//     .data(legendOptions)
//     .enter()
//     .append('g')
//     .on('mouseover', function(d) {
//
//       //change text to blue on mouse over
//       d3.select(this).style("fill", "steelblue");
//
//       //highlight area for the series in plot
//       var g = d3.select(radarId);
//       z = d3.select(this).attr("childElement");
//       z = "polygon." + z;
//
//       g.selectAll("polygon")
//         .transition(200)
//         .style("fill-opacity", 0.1);
//       g.selectAll(z)
//         .transition(200)
//         .style("fill-opacity", 0.7);
//     })
//     .on('mouseout', function(d) {
//
//       //set text back to black
//       d3.select(this).style("fill", "black");
//
//       //reset polygon area highlight
//       var g = d3.select(radarId);
//       g.selectAll("polygon")
//         .transition(200)
//         .style("fill-opacity", 0.2);
//     })
//     .attr("childElement", function(d, i) {
//       return radarClassElementsString + i;
//     })
//     .attr('transform', function(d, i) {
//       var height = legendRectSize + legendSpacing;
//       // var offset = 80;
//       // var horz = -124;
//       var offset = Math.round(legendRectSize * 4.44);
//       var horz = Math.round(legendRectSize * -1.55);
//       var vert = i * height - offset;
//       return 'translate(' + horz + ',' + vert + ')';
//     });
//
//   //add legend color squares
//   legend.append('rect')
//     .attr('width', legendRectSize)
//     .attr('height', legendRectSize)
//     .style('fill', function(d, i) {
//       return colorscale(i);
//     })
//     .style('stroke', function(d, i) {
//       return colorscale(i);
//     });
//
//   //add legend text info
//   legend.append('text')
//     .attr('x', legendRectSize + legendSpacing)
//     .attr('y', legendRectSize - legendSpacing)
//     .text(function(d) {
//       return d;
//     });
//
//   // add checkbox
//   legend.append('foreignObject')
//     .attr('width', 20)
//     .attr('height', 20)
//     .attr('x', 70)
//     .attr('y', 0)
//
//     .append('xhtml:input')
//     .attr('id', function(d) {
//       return "yieldCheckboxYear" + d.slice(-1);
//     })
//     .attr('class', 'yearCheckbox')
//     .attr('onclick', function(d) {
//       return "yieldRadarPlotYearToggle(" + d.slice(-1) + ");";
//     })
//     .attr('width', legendRectSize)
//     .attr('height', legendRectSize)
//     .attr('checked', "")
//     .attr('type', 'checkbox');
// } //end drawYieldRadar()

//generateResultsTable creates the string of html with all the numerical results
// the code here is a little dense, but entirely straightforward
// where possible, loops are created for years
function generateResultsTable() {

  var toMetricFactorArea = 2.471;
  var upToYear = boardData[currentBoard].calculatedToYear;

  /*
  * The variable 'dataset' is a variable that holds all the information of map land distribution for multiplayer mode.
  * The variable is used in this function as a reference to get size of parcel of each player.
  * For more information refer to Issue 386.
  */
  var dataset = [{
    label: 'Player 1',
    count: (Math.round(Totals.landUseResults[1].conventionalCornLandUse / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[1].conventionalCornLandUse * 10) / 10)
  }, {
    label: 'Player 2',
    count: (Math.round(Totals.landUseResults[1].conservationCornLandUse / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[1].conservationCornLandUse * 10) / 10)
  }, {
    label: 'Player 3',
    count: (Math.round(Totals.landUseResults[1].conventionalSoybeanLandUse / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[1].conventionalSoybeanLandUse * 10) / 10)
  }, {
    label: 'Player 4',
    count: (Math.round(Totals.landUseResults[1].conservationSoybeanLandUse / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[1].conservationSoybeanLandUse * 10) / 10)
  }, {
    label: 'Player 5',
    count: (Math.round(Totals.landUseResults[1].alfalfaLandUse / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[1].alfalfaLandUse * 10) / 10)
  }, {
    label: 'Player 6',
    count: (Math.round(Totals.landUseResults[1].permanentPastureLandUse / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[1].permanentPastureLandUse * 10) / 10)
  }];

  var listOfPlayerAv = [];

  var frontendNames = ["Conventional Corn Area", "Conservation Corn Area", "Conventional Soybean Area", "Conservation Soybean Area",
    "Mixed Fruits and Vegetables Area", "Permanent Pasture Area", "Rotational Grazing Area", "Grass Hay Area",
    "Switchgrass Area", "Prairie Area", "Wetland Area", "Alfalfa Area", "Conventional Forest Area",
    "Conservation Forest Area", "Short Rotation Woody Bioenergy Area"
  ];
  var backendDataIdentifiers = ["conventionalCorn", "conservationCorn", "conventionalSoybean",
    "conservationSoybean", "mixedFruitsVegetables", "permanentPasture", "rotationalGrazing", "grassHay",
    "switchgrass", "prairie", "wetland", "alfalfa", "conventionalForest",
    "conservationForest", "shortRotationWoodyBioenergy"
  ];

  /*
  * The htmlTableString variable is used to keep track of which players have a parcel size greater than 0.
  */
  var htmlTableString = "";

  //The code below is creating the first table
  htmlTableString += "<table id='table1' class='resultsTable'>";

  //The following coditional statement is to modify the results table depending on the mode.
  //If the condition is true then it means that the results will be modified to the multiplayer mode, else it will be the same results table per every other mode.
  if(localStorage.getItem('LSinMultiplayer')==="true"){
    console.log(boardData[currentBoard]);

    //add header
    //Players section of table START
    //The code below is to add the column titles for Players section of results table
    htmlTableString += "<tr class='tableHeading'> <th> Players </th>";
    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th>Percentage</th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th>Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th>Units (Metric) </th>";

    htmlTableString += "</tr>";
    //The code above is to add the column titles for Players section of results table

    //The code below is to add players data to results table
    for(var i = 1; i < 7; ++i){
      var j = i;
      //the condition below is to make sure the parcel size is greater than 0, if not that player will not be included in the results table
      if(dataset[i-1].number <=  0){
        j = 0;
      }
      else{
        listOfPlayerAv.push(i);
      }
      //the switch case is to toggle between different "players" since players is assigned by different land types
      switch (j) {
        case 0:
          //default case does nothing, this is to only display players who own land
          break;
        case 1:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + (Math.round(Totals.landUseResults[1]["conventionalCornLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 2:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + (Math.round(Totals.landUseResults[1]["conservationCornLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 3:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + (Math.round(Totals.landUseResults[1]["conventionalSoybeanLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 4:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + (Math.round(Totals.landUseResults[1]["conservationSoybeanLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 5:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + (Math.round(Totals.landUseResults[1]["alfalfaLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 6:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + (Math.round(Totals.landUseResults[1]["permanentPastureLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
      }
      htmlTableString += "</tr>";
    }

    htmlTableString += "</table><br>";
    //END of Table 1 (Players)==================================================

    //Start of Precipitation table
    htmlTableString += "<table id='table4' class='resultsTable'>";

    //add header
    htmlTableString += "<tr class='tableHeading'> <th style='width:220px;'> Precipitation </th>";
    //filling the column titles (code below)
    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th> Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th> Units(Metric) </th>";

    htmlTableString += "</tr>";

    //adding the data for precipitation table
    htmlTableString += "<tr><td>Precipitation</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += boardData[currentBoard].precipitation[y];
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>inches</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += Math.round(boardData[currentBoard].precipitation[y] * 2.54 * 10) / 10;
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>cm</td></tr>";

    htmlTableString += "</table><br>";
    //END of Table 2 (Precipitation)==================================================

    //Start of Strategic Wetland Use table
    htmlTableString += "<table id='table4' class='resultsTable'>";

    //The code below is to add the column titles for Players section of results table
    //add header
    htmlTableString += "<tr class='tableHeading'> <th style='width:220px;'> Strategic Wetland Use </th>";
    //filling the column titles (code below)
    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th> </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th> </th>";

    htmlTableString += "</tr>";
    //The code above is to add the column titles for Players section of results table

    for(var j = 0; j < listOfPlayerAv.length; ++j){
      //The code below is to fill player data into the html page
      var i = listOfPlayerAv[j];
      htmlTableString += "<tr><td> Player "+i+" </td>";
      htmlTableString += "<td> "+((strategicWetlandFinder(i)/20)*100)+" </td><td> Percent </td><td> "+strategicWetlandFinder(i)+" </td><td> Cells </td>"
    }

    htmlTableString += "</table><br>";
    //END of Table 3 (Strategic Wetlands)==================================================


    //===========================END OF RESTULTS TABLE (if version)
  }//end of if
  else {
    htmlTableString += "<tr class='tableHeading'> <th> Land Use Category </th>";
    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th>Percentage</th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th>Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th>Units (Metric) </th>";

    htmlTableString += "</tr>";

    //Add Data Rows

    for (var l = 0; l < backendDataIdentifiers.length; l++) {

      //check for the cases where a header needs to be added
      switch (l) {
        case 0:
          htmlTableString += "<tr class='tableHeading'><td><b>Annual Grain</b></td></tr>";
          break;
        case 2:
          htmlTableString += "<tr class='tableHeading'><td><b>Annual Legume</b></td></tr>";
          break;
        case 4:
          htmlTableString += "<tr class='tableHeading'><td><b>Mixed Fruits and Vegetables</b></td></tr>";
          break;
        case 5:
          htmlTableString += "<tr class='tableHeading'><td><b>Pasture</b></td></tr>";
          break;
        case 7:
          htmlTableString += "<tr class='tableHeading'><td><b>Perennial Herbaceous (non-pasture)</b></td></tr>";
          break;
        case 11:
          htmlTableString += "<tr class='tableHeading'><td><b>Perennial Legume</b></td></tr>";
          break;
        case 12:
          htmlTableString += "<tr class='tableHeading'><td><b>Perennial Wooded</b></td></tr>";
          break;

      } //end switch

      htmlTableString += "<tr>";

      htmlTableString += "<td>" + frontendNames[l] + "</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td>";

        var tempString = backendDataIdentifiers[l] + "LandUse";
        htmlTableString += (Math.round(Totals.landUseResults[y][tempString] / Totals.totalArea * 100 * 10) / 10) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell
      htmlTableString += "<td>percent</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td>";

        var tempString = backendDataIdentifiers[l] + "LandUse";
        htmlTableString += (Math.round(Totals.landUseResults[y][tempString] * 10) / 10) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell
      htmlTableString += "<td>acres</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td>";

        var tempString = backendDataIdentifiers[l] + "LandUse";
        htmlTableString += (Math.round(Totals.landUseResults[y][tempString] / toMetricFactorArea * 10) / 10) + "<br>";

        htmlTableString += "</td>";

      } //for each year

      //units cell
      htmlTableString += "<td>hectares</td></tr>";
    }

    htmlTableString += "</table><br>";


    //===================================================
    //SECOND TABLE, ECOSYSTEM INDICATORS


    frontendNames = ["Game Wildlife", "Biodiversity", "Carbon Sequestration", "Erosion Control / Gross Erosion",
      "Nitrate Pollution Control <br> / In-Stream Concentration", "Phosphorus Pollution Control <br> / In-Stream Loading",
      "Sediment Control <br> / In-Stream Delivery"
    ];
    backendDataIdentifiers = ["gameWildlifePoints", "biodiversityPoints", "carbonSequestration", "grossErosion", "nitrateConcentration",
      "phosphorusLoad", "sedimentDelivery"
    ];

    //variables for english to metric
    // results are generally in english units as the original thesis
    // had all calculations done this way
    conversionArray = [1, 1, 0.90718474, 0.90718474, 1, 0.90718474, 0.90718474, 0.90718474];

    htmlTableString += "<table id='table2' class='resultsTable'>";

    //add header row

    htmlTableString += "<tr class='tableHeading'> <th> Ecosystem Service Indicator <br> / Measurement </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th>Score</th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th>Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th>Units (Metric) </th>";

    htmlTableString += "</tr>";

    //table data

    for (var l = 0; l < backendDataIdentifiers.length; l++) {

      //keep track if we need to add the appropriate subheading lines
      switch (l) {
        case 0:
          htmlTableString += "<tr class='tableHeading'><td><b>Habitat</b></td></tr>";
          break;
        case 2:
          htmlTableString += "<tr class='tableHeading'><td><b>Soil Quality</b></td></tr>";
          break;
        case 4:
          htmlTableString += "<tr class='tableHeading'><td><b>Water Quality</b></td></tr>";
          break;
      } //end switch

      htmlTableString += "<tr>";

      htmlTableString += "<td>" + frontendNames[l] + "</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td>";

        var tempString = backendDataIdentifiers[l] + "Score";
        htmlTableString += (Math.round(Totals[tempString][y] * 10) / 10) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell
      htmlTableString += "<td>(out of 100)</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td>";

        var tempString = backendDataIdentifiers[l];
        //Correction for Carbon Sequestrations

        // if (l == 2) {
        //   Totals[tempString][y] = Totals[tempString][y] * (1 / conversionArray[l]);
        // }

        htmlTableString += (Math.round(Totals[tempString][y] * 10) / 10) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell, keep track which type of units we'll need
      if (l < 2) htmlTableString += "<td>pts</td>";
      if (2 <= l && l < 4) htmlTableString += "<td>tons</td>";
      if (4 <= l && l < 5) htmlTableString += "<td>ppm</td>";
      if (5 <= l && l < 8) htmlTableString += "<td>tons</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td>";

        var tempString = backendDataIdentifiers[l];
        htmlTableString += (Math.round(Totals[tempString][y] * conversionArray[l] * 10) / 10) + "<br>";

        htmlTableString += "</td>";

      } //for each year

      //units cell
      if (l < 2) htmlTableString += "<td>pts</td>";
      if (2 <= l && l < 4) htmlTableString += "<td>Mg</td>";
      if (4 <= l && l < 5) htmlTableString += "<td>mg/L</td>";
      if (5 <= l && l < 8) htmlTableString += "<td>Mg</td>";
    }

    //========================================
    //THIRD TABLE, YIELD RESULTS

    frontendNames = ["Corn Grain", "Soybeans", "Mixed Fruits and Vegetables", "Cattle", "Alfalfa Hay", "Grass Hay",
      "Switchgrass Biomass", "Wood", "Short Rotation Woody Biomass"
    ];

    backendDataIdentifiers = ["cornGrainYield", "soybeanYield", "mixedFruitsAndVegetablesYield", "cattleYield",
      "alfalfaHayYield", "grassHayYield", "switchgrassYield", "woodYield", "shortRotationWoodyBiomassYield"
    ];

    //conversion factors for the yeilds
    conversionArray = [0.0254, 0.0272, 0.90718474, 1, 0.90718474, 0.90718474, 0.90718474, 0.002359737, 0.90718474];

    //fill in table rows with data


    for (var l = 0; l < backendDataIdentifiers.length; l++) {

      //keep track of subheadings, just 1 this time
      switch (l) {
        case 0:  
          //htmlTableString += "<tr class='tableHeading'><td><b>Yield</b></td></tr>";
            //put Yield header, in bold
            htmlTableString += "<tr>";
            htmlTableString += "<td><b>" + "Yield" + "<b></td>";
            
            //calculate total score for each year and place next to Yield header
            for(var y = 1; y <= upToYear; y++){
              htmlTableString += "<td><b>";

              var totalScore = Math.min(Totals.cornGrainYieldScore[y] +
              Totals.soybeanYieldScore[y] + Totals.mixedFruitsAndVegetablesYieldScore[y] + Totals.alfalfaHayYieldScore[y] +
              Totals.grassHayYieldScore[y] + Totals.switchgrassYieldScore[y] + Totals.cattleYieldScore[y] + Totals.woodYieldScore[y] + Totals.shortRotationWoodyBiomassYieldScore[y], 100);

              htmlTableString += (Math.round(totalScore * 10) / 10) + "<br>";

              htmlTableString += "<b></td>";
            }
            htmlTableString += "<td><b>(out of 100)<b></td>";
            //add extra spaces to fill out bar across screen
            for(var y = 1; y <= (2*upToYear)+2; y++){
              htmlTableString += "<td></td>";
            }
            break;
      } //end switch

      htmlTableString += "<tr>";

      htmlTableString += "<td>" + frontendNames[l] + "</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td>";

        var tempString = backendDataIdentifiers[l] + "Score";
        htmlTableString += (Math.round(Totals[tempString][y] * 10) / 10) + "<br>";

        htmlTableString += "</td>";
      } //for each year
      //units cell
      htmlTableString += "<td>(out of 100)</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td>";

        var tempString = backendDataIdentifiers[l];
        htmlTableString += (Math.round(Totals.yieldResults[y][tempString] * 10) / 10) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell, lots of different ones to keep track of here
      if (l < 2) htmlTableString += "<td>bu</td>";
      if (l == 2) htmlTableString += "<td>tons</td>";
      if (l == 3) htmlTableString += "<td>animals</td>"; //what an odd unit
      if (4 <= l && l < 7) htmlTableString += "<td>tons</td>";
      if (l == 7) htmlTableString += "<td>board-ft</td>";
      if (l == 8) htmlTableString += "<td>tons</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td>";

        var tempString = backendDataIdentifiers[l];
        htmlTableString += (Math.round(Totals.yieldResults[y][tempString] * conversionArray[l] * 10) / 10) + "<br>";

        htmlTableString += "</td>";


      } //for each year

      //units cell
      if (l < 2) htmlTableString += "<td>Mg</td>";
      if (l == 2) htmlTableString += "<td>Mg</td>";
      if (l == 3) htmlTableString += "<td>animals</td>";
      if (4 <= l && l < 7) htmlTableString += "<td>Mg</td>";
      if (l == 7) htmlTableString += "<td>m^3</td>";
      if (l == 8) htmlTableString += "<td>Mg</td>";
    }

    htmlTableString += "</table><br>";

    //============================
    //TABLE FOUR, SPECIAL INDICATORS

    htmlTableString += "<table id='table4' class='resultsTable'>";

    //add header row


    htmlTableString += "<tr class='tableHeading'> <th style='width:220px;'> Other Parameters </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th> </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th> </th>";

    htmlTableString += "</tr>";

    htmlTableString += "<tr><td>Precipitation</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += boardData[currentBoard].precipitation[y];
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>inches</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += Math.round(boardData[currentBoard].precipitation[y] * 2.54 * 10) / 10;
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>cm</td>";

    htmlTableString += "</tr>";

    htmlTableString += "<tr><td>Strategic Wetland Use</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += Totals.strategicWetlandPercent[y];
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>percent</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += Totals.strategicWetlandCells[y];
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>cells</td>";

    htmlTableString += "</tr>";

    htmlTableString += "</table><br>";


    //===========================END TABLE
  }//end of else

  //well, we did all this work, we should probably do something with it.
  //let's give pass it off to some other function...

  return htmlTableString;
} //end generateResultsTable()

// ---

function multiplayerResults() {
  var inMultiplayer = localStorage.getItem('LSinMultiplayer');
  // console.log("In function of results.html");
  if(localStorage.getItem('LSinMultiplayer') === "true"){
    // console.log("changing visibility of div tags");
    // console.log("multiplayer results is: " +inMultiplayer+", should be true");
    document.getElementById('resultsFrame').contentWindow.document.getElementById("yearHolder").style.display = "none";
    document.getElementById('resultsFrame').contentWindow.document.getElementById("radarContainer").style.display = "none";
    document.getElementById('resultsFrame').contentWindow.document.getElementById("landUseTitle").style.display = "none";
    document.getElementById('resultsFrame').contentWindow.document.getElementById("landUseTitleMulti").style.display = "block";
    document.getElementById('resultsFrame').contentWindow.document.getElementById("scoreChart").style.display = "none";
  }
  else{
    // console.log("multiplayer results is: " +inMultiplayer+", should be false");
    // console.log("making visibility of div tags to true");
    document.getElementById('resultsFrame').contentWindow.document.getElementById("yearHolder").style.display = "block";
    document.getElementById('resultsFrame').contentWindow.document.getElementById("radarContainer").style.display = "block";
    document.getElementById('resultsFrame').contentWindow.document.getElementById("landUseTitle").style.display = "block";
    document.getElementById('resultsFrame').contentWindow.document.getElementById("landUseTitleMulti").style.display = "none";
    document.getElementById('resultsFrame').contentWindow.document.getElementById("scoreChart").style.display = "block";
  }
}

//removeYearFromRadar hides all of the graph elements of that year on the ecosystem
//  indicators plot
function removeYearFromRadar(yearToRemove) {

  var elementsToTrash = document.getElementById('resultsFrame').contentWindow.document.getElementsByClassName('radar-chart-serie' + (yearToRemove - 1));

  for (var e = 0; e < elementsToTrash.length; e++) {
    document.getElementById('resultsFrame').contentWindow.document.getElementById(elementsToTrash[e].id).style.visibility = "hidden";
  }
} //end removeYearFromRadar()

//addBackYearToRadar unhides all of the associated elements of that year on the graph
function addBackYearToRadar(yearToAdd) {

  var elementsToRevive = document.getElementById('resultsFrame').contentWindow.document.getElementsByClassName('radar-chart-serie' + (yearToAdd - 1));

  for (var e = 0; e < elementsToRevive.length; e++) {
    document.getElementById('resultsFrame').contentWindow.document.getElementById(elementsToRevive[e].id).style.visibility = "visible";
  }
} //end addBackYearToRadar()

// ---

//here we remove all of the graph elements in the yield plot for the appropriate year
function removeYearFromYieldRadar(yearToRemove) {

  var elementsToTrash = document.getElementById('resultsFrame').contentWindow.document.getElementsByClassName('yield-radar-chart-serie' + (yearToRemove - 1));

  for (var e = 0; e < elementsToTrash.length; e++) {
    document.getElementById('resultsFrame').contentWindow.document.getElementById(elementsToTrash[e].id).style.visibility = "hidden";
  }
} //end removeYearFromYieldRadar

//or, do the opposite of the above function and unhide all of the elements on the
// yield graph that belong to the year passed to the function
function addBackYearToYieldRadar(yearToAdd) {

  var elementsToRevive = document.getElementById('resultsFrame').contentWindow.document.getElementsByClassName('yield-radar-chart-serie' + (yearToAdd - 1));

  for (var e = 0; e < elementsToRevive.length; e++) {
    document.getElementById('resultsFrame').contentWindow.document.getElementById(elementsToRevive[e].id).style.visibility = "visible";
  }
} //end addBackYearToYieldRadar

/*
* The function strategicWetlandFinder finds how many strategic wetland locations a player has for their share of land.
* The way this task is done is by using boardData's map and comparing each cell's land type (the 2nd index of this value indicates which player it belongs to),
* and checking if the wetland of that cell is a strategic wetland.
* For more information refer Issue 386.
*/
function strategicWetlandFinder(playerNumber) {
  var strategicWetlandCount = 0;
  for(var i = 0; i < boardData[currentBoard].map.length; ++i){
    if(boardData[currentBoard].map[i].landType[1] === playerNumber && boardData[currentBoard].map[i].strategicWetland === "1"){
      strategicWetlandCount++;
    }
  }
  return strategicWetlandCount;
}

/*
* In the function render is to create the graph displaying years and data points score out of 100.
* For more information refer to Issue 357.
*/
function render(years){
  //the variabale dataser is used to hold all the data that is to be plotted
  var dataset = fillData(years);

  //the variable width is used to assign the width of the svg container
  var width = 850;

  //the variable width is used to assign the height of the svg container
  var height = 550;

  //the variable width is used to assign the starting location value "x" of the svg container
  var svgx = 200;

  //the variable width is used to assign the starting location value "y" of the svg container
  var svgy = 100;

  //the variable listOfBackGroundBoxes is used to hold all the IDs of the background boxes
  var listOfBackGroundBoxes = [];

  //the variable listOfClickedPoints is used to hold all the IDs of the data points that were already selected
  var listOfClickedPoints = [];

  //the variable listOfClickedText is used to hold all the IDs of the legend texts that were already selected
  var listOfClickedText = [];

  //the variable listOfProgressBars is used to hold all the IDs of the progress bars who have been selected through data point or text
  var listOfProgressBars = [];

  //the variable listOfHiddenRects is used to hold all of the IDs of the rectangles that have been selected
  var listOfHiddenRects = [];

  //The variable textXPosChange is used to change the x position of the texts that are on the side depending how many yers will be displayed
  var textXPosChange = (3-years)*100;

  //The progressBar variable is to calculate the progress bar, these progress bars will be swapped out for Wei's version on progress bars
  var progressBarX = 650 - textXPosChange;

  //the variable chart selects the resultsFrame to add all components to
  var chart = document.getElementById('resultsFrame').contentWindow.document.getElementById('scoreChart');

  //the variable svg is creating the svg container and connecting it with the div tag scoreChart
  var svg = d3.select(chart).append("svg")
    .attr("x",svgx)
    .attr("y", svgy)
    .attr("width",  width)
    .attr("height", height);

  //The variable color is used to assign colors for year rectangles
  var color = d3.scaleOrdinal()
    .domain([0, 1, 2])
    .range(["#ffe099", "#f9ccc2" , "#fcff7f"]);

  /*
  * The function calculateAvgScores takes in dataPoints as a parameter and an int that represents the number of years.
  * This function calculates the average of each data type and returns an array with those averages
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function calculateAvgScores(dataPoints, numYears){
    var tempdata = [];
    if(numYears === 3){
      var tempSum = 0;
      for(var i = 0; i < 16; ++i){
        tempSum = dataPoints[i].count+dataPoints[i+16].count+dataPoints[i+32].count;
        tempSum = tempSum / numYears;
        tempdata.push(tempSum);
      }
    }
    else if(numYears === 2){
      var tempSum = 0;
      for(var i = 0; i < 16; ++i){
        tempSum = dataPoints[i].count+dataPoints[i+16].count;
        tempSum = tempSum / numYears;
        tempdata.push(tempSum);
      }
    }
    else{
      for(var i = 0; i < 16; ++i){
        tempdata.push(dataPoints[i].count);
      }
    }
    return tempdata;
  }

  /*
  * The function deteleText is used to delete the text legend on the right hand side and the gray layer of the progress bar.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function deteleText() {
    for(var i = 0; i < 16; ++i){
      var tempID = "#t"+(i+1);
      var tempSmallID = "#smallrect"+(i+1);
      var tempBigID = "#bigrect"+(i+1);
      svg.select(tempID).remove();
      svg.select(tempSmallID).remove();
      svg.select(tempBigID).remove();
    }
  }

  /*
  * The function fillData fills an array of objects with data that will be plotted with data points.
  * Each object consists of count (the score out of 100), label (the title of the category it belongs to), and id (the id that will be used for that specifc data point).
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function fillData(yearsToFill) {
    var tempData = [];
    var totalNumberDataPoints = yearsToFill*16; //16 because there are 16 different data points we fill per year
    var tempID = 0;
    for(var i = 1; i <= totalNumberDataPoints; ++i){
      tempID++;
      var tempDataCount = getScore(i);
      var tempDataLabel = getLabel(i);
      var tempObjData = {'count': (Math.round(tempDataCount*100)/100), 'label': tempDataLabel, 'id': "c"+tempID};
      tempData.push(tempObjData);
    }
    return tempData;
  }

  /*
  * The function getCX returns the CX of data point that is passed in as a parameter.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function  getCX(thisElement) {
    return parseInt(thisElement.attributes.cx.nodeValue)+12;
  }

  /*
  * The function getCY returns the CY of data point that is passed in as a parameter.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function  getCY(thisElement) {
    return parseInt(thisElement.attributes.cy.nodeValue)-8;
  }

  /*
  * parameters: givenID (string), y (int), and type (string)
  * return: int, string, or array of strings depending of type (parameter)
  * The function getInfo takes in the three parameters, the "y" parameter only matters when type is data.
  * The purpose of this function is to give all the IDs and and desired information depending on type. This fucntion was a combination of getter functions from previous commit.
  * The reason for combining all functions was to make more simple to understand and make code less cluttered with fucntions.
  * For more information refer to Issue 357.
  */
  function getInfo(givenID, y, type) {
    var selectID = [];
    switch (givenID) {
    case "c1": case "c17": case "c33": case "t1": case "bigrect1": case "checkbox1":
      if(type === "color"){
        return "#f0ad4e";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c1", "c17", "c33"];
        }else if(y > 1){
          selectID = ["c1", "c17"];
        }else{
          selectID = ["c1"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "1";
      }
      else if(type === "textRep"){
        return "t1";
      }
      else if(type === "landName"){
        return "Carbon Sequestration";
      }
      else if(type === "boxY"){
        return 45;
      }
      else if(type === "boxID"){
        return "b1";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect1", "#bigrect1"];
        return selectID;
      }
      break;
    case "c2": case "c18": case "c34": case "t2": case "bigrect2": case "checkbox2":
      if(type === "color"){
        return "#5bc0de";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c2", "c18", "c34"];
        }else if(y > 1){
          selectID = ["c2", "c18"];
        }else{
          selectID = ["c2"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "2";
      }
      else if(type === "textRep"){
        return "t2";
      }
      else if(type === "landName"){
        return "Biodiversity";
      }
      else if(type === "boxY"){
        return 75;
      }
      else if(type === "boxID"){
        return "b2";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect2", "#bigrect2"];
        return selectID;
      }
      break;
    case "c3": case "c19": case "c35": case "t3": case "bigrect3": case "checkbox3":
      if(type === "color"){
        return "#5cb85c";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c3", "c19", "c35"];
        }else if(y > 1){
          selectID = ["c3", "c19"];
        }else{
          selectID = ["c3"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "3";
      }
      else if(type === "textRep"){
        return "t3";
      }
      else if(type === "landName"){
        return "Game Wildlife";
      }
      else if(type === "boxY"){
        return 105;
      }
      else if(type === "boxID"){
        return "b3";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect3", "#bigrect3"];
        return selectID;
      }
      break;
    case "c4": case "c20": case "c36": case "t4": case "bigrect4": case "checkbox4":
      if(type === "color"){
        return "#d9534f";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c4", "c20", "c36"];
        }else if(y > 1){
          selectID = ["c4", "c20"];
        }else{
          selectID = ["c4"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "4";
      }
      else if(type === "textRep"){
        return "t4";
      }
      else if(type === "landName"){
        return "Erosion Control";
      }
      else if(type === "boxY"){
        return 135;
      }
      else if(type === "boxID"){
        return "b4";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect4", "#bigrect4"];
        return selectID;
      }
      break;
    case "c5": case "c21": case "c37": case "t5": case "bigrect5": case "checkbox5":
      if(type === "color"){
        return "#9ACD32";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c5", "c21", "c37"];
        }else if(y > 1){
          selectID = ["c5", "c21"];
        }else{
          selectID = ["c5"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "5";
      }
      else if(type === "textRep"){
        return "t5";
      }
      else if(type === "landName"){
        return "Nitrate Pollution Control";
      }
      else if(type === "boxY"){
        return 165;
      }
      else if(type === "boxID"){
        return "b5";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect5", "#bigrect5"];
        return selectID;
      }
      break;
    case "c6": case "c22": case "c38": case "t6": case "bigrect6": case "checkbox6":
      if(type === "color"){
        return "#0099DC";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c6", "c22", "c38"];
        }else if(y > 1){
          selectID = ["c6", "c22"];
        }else{
          selectID = ["c6"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "6";
      }
      else if(type === "textRep"){
        return "t6";
      }
      else if(type === "landName"){
        return "Phosphorus Pollution Control";
      }
      else if(type === "boxY"){
        return 195;
      }
      else if(type === "boxID"){
        return "b6";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect6", "#bigrect6"];
        return selectID;
      }
      break;
    case "c7": case "c23": case "c39": case "t7": case "bigrect7": case "checkbox7":
      if(type === "color"){
        return "#A53300";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c7", "c23", "c39"];
        }else if(y > 1){
          selectID = ["c7", "c23"];
        }else{
          selectID = ["c7"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "7";
      }
      else if(type === "textRep"){
        return "t7";
      }
      else if(type === "landName"){
        return "Sediment Control";
      }
      else if(type === "boxY"){
        return 225;
      }
      else if(type === "boxID"){
        return "b7";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect7", "#bigrect7"];
        return selectID;
      }
      break;
    case "c8": case "c24": case "c40": case "t8": case "bigrect8": case "checkbox8":
      if(type === "color"){
        return "#1aafb8";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c8", "c24", "c40"];
        }else if(y > 1){
          selectID = ["c8", "c24"];
        }else{
          selectID = ["c8"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "8";
      }
      else if(type === "textRep"){
        return "t8";
      }
      else if(type === "landName"){
        return "Alfalfa Hay";
      }
      else if(type === "boxY"){
        return 255;
      }
      else if(type === "boxID"){
        return "b8";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect8", "#bigrect8"];
        return selectID;
      }
      break;
    case "c9": case "c25": case "c41": case "t9": case "bigrect9": case "checkbox9":
      if(type === "color"){
        return "#beef00";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c9", "c25", "c41"];
        }else if(y > 1){
          selectID = ["c9", "c25"];
        }else{
          selectID = ["c9"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "9";
      }
      else if(type === "textRep"){
        return "t9";
      }
      else if(type === "landName"){
        return "Cattle";
      }
      else if(type === "boxY"){
        return 285;
      }
      else if(type === "boxID"){
        return "b9";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect9", "#bigrect9"];
        return selectID;
      }
      break;
    case "c10": case "c26": case "c42": case "t10": case "bigrect10": case "checkbox10":
      if(type === "color"){
        return "#A0522D";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c10", "c26", "c42"];
        }else if(y > 1){
          selectID = ["c10", "c26"];
        }else{
          selectID = ["c10"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "10";
      }
      else if(type === "textRep"){
        return "t10";
      }
      else if(type === "landName"){
        return "Corn Grain";
      }
      else if(type === "boxY"){
        return 315;
      }
      else if(type === "boxID"){
        return "b10";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect10", "#bigrect10"];
        return selectID;
      }
      break;
    case "c11": case "c27": case "c43": case "t11": case "bigrect11": case "checkbox11":
      if(type === "color"){
        return "#D2691E";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c11", "c27", "c43"];
        }else if(y > 1){
          selectID = ["c11", "c27"];
        }else{
          selectID = ["c11"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "11";
      }
      else if(type === "textRep"){
        return "t11";
      }
      else if(type === "landName"){
        return "Grass Hay";
      }
      else if(type === "boxY"){
        return 345;
      }
      else if(type === "boxID"){
        return "b11";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect11", "#bigrect11"];
        return selectID;
      }
      break;
    case "c12": case "c28": case "c44": case "t12": case "bigrect12": case "checkbox12":
      if(type === "color"){
        return "#ffde2a";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c12", "c28", "c44"];
        }else if(y > 1){
          selectID = ["c12", "c28"];
        }else{
          selectID = ["c12"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "12";
      }
      else if(type === "textRep"){
        return "t12";
      }
      else if(type === "landName"){
        return "Switchgrass Biomass";
      }
      else if(type === "boxY"){
        return 375;
      }
      else if(type === "boxID"){
        return "b12";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect12", "#bigrect12"];
        return selectID;
      }
      break;
    case "c13": case "c29": case "c45": case "t13": case "bigrect13": case "checkbox13":
      if(type === "color"){
        return "#16a085";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c13", "c29", "c45"];
        }else if(y > 1){
          selectID = ["c13", "c29"];
        }else{
          selectID = ["c13"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "13";
      }
      else if(type === "textRep"){
        return "t13";
      }
      else if(type === "landName"){
        return "Mixed Fruits and Vegetables";
      }
      else if(type === "boxY"){
        return 405;
      }
      else if(type === "boxID"){
        return "b13";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect13", "#bigrect13"];
        return selectID;
      }
      break;
    case "c14": case "c30": case "c46": case "t14": case "bigrect14": case "checkbox14":
      if(type === "color"){
        return "#FF8C00";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c14", "c30", "c46"];
        }else if(y > 1){
          selectID = ["c14", "c30"];
        }else{
          selectID = ["c14"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "14";
      }
      else if(type === "textRep"){
        return "t14";
      }
      else if(type === "landName"){
        return "Short-Rotation Woody Biomass";
      }
      else if(type === "boxY"){
        return 435;
      }
      else if(type === "boxID"){
        return "b14";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect14", "#bigrect14"];
        return selectID;
      }
      break;
    case "c15": case "c31": case "c47": case "t15": case "bigrect15": case "checkbox15":
      if(type === "color"){
        return "#4169E1";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c15", "c31", "c47"];
        }else if(y > 1){
          selectID = ["c15", "c31"];
        }else{
          selectID = ["c15"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "15";
      }
      else if(type === "textRep"){
        return "t15";
      }
      else if(type === "landName"){
        return "Soybeans";
      }
      else if(type === "boxY"){
        return 465;
      }
      else if(type === "boxID"){
        return "b15";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect15", "#bigrect15"];
        return selectID;
      }
      break;
    case "c16": case "c32": case "c48": case "t16": case "bigrect16": case "checkbox16":
      if(type === "color"){
        return "#228B22";
      }
      else if(type === "data"){
        if(y > 2){
          selectID = ["c16", "c32", "c48"];
        }else if(y > 1){
          selectID = ["c16", "c32"];
        }else{
          selectID = ["c16"];
        }
        return selectID;
      }
      else if(type === "barRep"){
        return "16";
      }
      else if(type === "textRep"){
        return "t16";
      }
      else if(type === "landName"){
        return "Wood";
      }
      else if(type === "boxY"){
        return 495;
      }
      else if(type === "boxID"){
        return "b16";
      }
      else if(type === "progressBars"){
        selectID = ["#smallrect16", "#bigrect16"];
        return selectID;
      }
      break;
    }
  }

  /*
  * The function getLabel will take in id (an int) as a parameter that will return the appropriate label for each valid int passed.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function getLabel(id) {
    switch (id) {
      case 1: case 17: case 33:
        return "Carbon Sequestration";
      break;
      case 2: case 18: case 34:
        return "Biodiversity";
      break;
      case 3: case 19: case 35:
        return "Game Wildlife";
      break;
      case 4: case 20: case 36:
        return "Erosion Control";
      break;
      case 5: case 21: case 37:
        return "Nitrate Pollution Control";
      break;
      case 6: case 22: case 38:
        return "Phosphorus Pollution Control";
      break;
      case 7: case 23: case 39:
        return "Sediment Control";
      break;
      case 8: case 24: case 40:
        return "Alfalfa Hay";
      break;
      case 9: case 25: case 41:
        return "Cattle";
      break;
      case 10: case 26: case 42:
        return "Corn Grain";
      break;
      case 11: case 27: case 43:
        return "Grass Hay";
      break;
      case 12: case 28: case 44:
        return "Switchgrass Biomass";
      break;
      case 13: case 29: case 45:
        return "Mixed Fruits and Vegetables";
      break;
      case 14: case 30: case 46:
        return "Short-rotation Woody Biomass";
      break;
      case 15: case 31: case 47:
        return "Soybeans";
      break;
      case 16: case 32: case 48:
        return "Wood";
      break;
    }
  }

  /*
  * The function getScore will take in id (an int) as a parameter that will determine what type of score the program needs i.e Corn Grain score.
  * This fucntion also call the getYearForScore to get what year of that specific category you are looking for.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function getScore(id) {
    switch (id) {
      case 1: case 17: case 33:
        return Totals.carbonSequestrationScore[getYearForScore(id)];
      break;
      case 2: case 18: case 34:
        return Totals.biodiversityPointsScore[getYearForScore(id)];
      break;
      case 3: case 19: case 35:
        return Totals.gameWildlifePointsScore[getYearForScore(id)];
      break;
      case 4: case 20: case 36:
        return Totals.grossErosionScore[getYearForScore(id)];
      break;
      case 5: case 21: case 37:
        return Totals.nitrateConcentrationScore[getYearForScore(id)];
      break;
      case 6: case 22: case 38:
        return Totals.phosphorusLoadScore[getYearForScore(id)];
      break;
      case 7: case 23: case 39:
        return Totals.sedimentDeliveryScore[getYearForScore(id)];
      break;
      case 8: case 24: case 40:
        return Totals.alfalfaHayYieldScore[getYearForScore(id)];
      break;
      case 9: case 25: case 41:
        return Totals.cattleYieldScore[getYearForScore(id)];
      break;
      case 10: case 26: case 42:
        return Totals.cornGrainYieldScore[getYearForScore(id)];
      break;
      case 11: case 27: case 43:
        return Totals.grassHayYieldScore[getYearForScore(id)];
      break;
      case 12: case 28: case 44:
        return Totals.switchgrassYieldScore[getYearForScore(id)];
      break;
      case 13: case 29: case 45:
        return Totals.mixedFruitsAndVegetablesYieldScore[getYearForScore(id)];
      break;
      case 14: case 30: case 46:
        return Totals.shortRotationWoodyBiomassYieldScore[getYearForScore(id)];
      break;
      case 15: case 31: case 47:
        return Totals.soybeanYieldScore[getYearForScore(id)];
      break;
      case 16: case 32: case 48:
        return Totals.woodYieldScore[getYearForScore(id)];
      break;
    }
  }

  /*
  * The function getScoreOfLandType returns the score of the type of land put in as a parameter.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function getScoreOfLandType(id) {
    for(var properties in dataset){
      if(dataset[properties].id === id){
        return dataset[properties].count;
      }
    }
    return 123456789;
  }

  /*
  * The function getText returns a string that will be used over hover options.
  * The string will be as follows: "landName: landScore".
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function getText(thisElement){
    var tempText = getInfo(thisElement.id, 0, "landName")+": "+getScoreOfLandType(thisElement.id);
    return tempText;
  }

  /*
  * The function getYearForScore will take in id (an int) as a parameter that will determine what year that falls under.
  * This fucntion is used in getScore to get the right year of each land type, i.e 1-16 is the first cycle of each of the land types, 17-32 is the second cycle and so on.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function getYearForScore(tempID){
    if (tempID > 0 && tempID < 17){
      return 1;
    }else if(tempID > 16 && tempID < 33){
      return 2;
    }else{
      return 3;
    }
  }

  /*
  * The function newRCalculator takes in an HTML element and checks the R of that element and based on that returns the new R.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */

  function getPrecipColor(year){
    switch(printPrecipYearType(year)){
      case 'Dry': return '#67dee5'; break;
      case 'Normal': return '#4b98d9'; break;
      default: return '#2847dd';
    }
  }

  function newRCalculator(thisElement) {
    //element that is being clicked has not been clicked
    var thisElementR = parseInt(thisElement.attributes.r.nodeValue);
    if(thisElementR === 10){
      return 15;
    }
    else if(thisElementR !== 10){
      return 10;
    }
  }

  /*
  * The function placeStandards is used to place elements into the div that will NOT be modified, this includes but is not limeted to each year rectangle, and arrow diagram.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function placeStandards(years) {
    //the variable gradient is used to created the gradient settings for gradient colors of arrowpath, id is "arrow-indicator-grad"
    var gradient = svg.append("defs").append("linearGradient")
        .attr("id", "arrow-indicator-grad")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    //adding the first gradient color, blue
    gradient.append("stop")
        .attr("offset", "0%")
        .style("stop-color", "#2171b5")
        .style("stop-opacity", "90");

    //adding the second gradient color, red
    gradient.append("stop")
        .attr("offset", "100%")
        .style("stop-color", "#cc4c02")
        .style("stop-opacity", "90");

    //the variable lineData is the points that are used to create the svg-path arrow
    var lineData = [{'x':25, 'y':50}, {'x':40, 'y': 75},
                   {'x':30, 'y':75}, {'x':30, 'y': 500},
                   {'x':20, 'y':500}, {'x':20, 'y': 75},
                   {'x':10, 'y':75}, {'x':25, 'y': 50}];

    //The lineFunction is a variable that uses functions to return x and y of each lineData, this is used to create the arrow path
    var lineFunction = d3.line()
                      .x(function(d){return d.x;})
                      .y(function(d){return d.y;})
                      .curve(d3.curveLinear);

    //The lineGraph variable adds the arrow path to the svg element.
    var lineGraph = svg.append('path')
                   .attr('d', lineFunction(lineData))
                   .attr('stroke', 'none')
                   .attr('fill', 'url(#arrow-indicator-grad)');


    //In this for loop the rectangles are being drawn
    //There will be x number of rectangles for x number of years
    for(var i = 0; i < years; ++i){
      //Draw the Rectangle, rect is the term used for rectangles
      var rectangle = svg.append("rect")
                          .attr("x", (i*100)+50)
                          .attr("y", 50)
                          .attr("width", 100)
                          .attr("height", 450)
                          .attr("rx", 15)
                          .style("fill", "none")
                          .style("stroke", "black")
                          .style("stroke-width", "3px")
                          .style('opacity', .5)
                          .style("fill", getPrecipColor(i+1));

      //This is going to add all the names of categories that are in the dataset.
      svg.append("text")
          .attr("x", (100+(i*100)))
          .attr("y", 525)
          .text(("Year "+(i+1)))
          .style("fill", "#000000")
          .attr("text-anchor", "middle")
          .style("font-size", "1.0em")
          .style("font-weight", "bold");
    }
    //This is for the title above the graph
    svg.append("text")
        .attr("x", (503-textXPosChange))
        .attr("y", 20)
        .text("Ecosystem Service Scores")
        .style("fill", "#000")
        .attr("text-anchor", "middle")
        .style("font-size", "1.36em")
        .style("font-weight", "bold");

    //This is going to add all the names of categories that are in the dataset.
    svg.append("text")
        .attr("x", (700-textXPosChange))
        .attr("y", 45)
        .text("Average Score")
        .style("fill", "#888")
        .attr("text-anchor", "middle")
        .style("font-size", "1.0em");

    //This is going to add all the names of categories that are in the dataset.
    svg.append("text")
        .attr("x", (807-textXPosChange))
        .attr("y", 35)
        .text("Hide")
        .style("fill", "#888")
        .attr("text-anchor", "middle")
        .style("font-size", "1.0em");


    //the variableTextXPos is used to place the text "Score (out of 100)"" on top of the data boxes in the correct x-position as it changes depending on number of years of data.
    var scoreTextXPos = 50;
    if(years === 3){
      scoreTextXPos = 200;
    }else if (years === 2) {
      scoreTextXPos = 150;
    }else{
      scoreTextXPos = 100;
    }

    //This is going to add all the names of categories that are in the dataset.
    svg.append("text")
        .attr("x", scoreTextXPos)
        .attr("y", 35)
        .text("Score (out of 100)")
        .style("fill", "#888")
        .attr("text-anchor", "middle")
        .style("font-size", "1.0em");

    //adding the checkboxes
    for(var i = 1; i < 17; ++i){
      svg.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("x", (500 + years*100))
        .attr("y", (25 + i*30))
        .attr("rx", 2)
        .attr("class", "checkbox")
        .attr("id", ("checkbox"+i))
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 2);
    }
  }

  /*
  * The function placeText is used to place the text legend on the right hand side and the gray layer of the progress bar.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function placeText(dataSet, years) {
    //the variable scoreData is used to hold all the average scores
    var scoreData = calculateAvgScores(dataSet, years);

    //Pattern injection
    var defs = svg.append("defs");

    //the variable patter is used to create the patter to be used to fill in smallrect elements
    var pattern = defs.append("pattern")
    		.attr("id","hash4_4")
        .attr("width","126")
        .attr("height","125")
        .attr("patternUnits","userSpaceOnUse")
        .append("image")
          .attr("xlink:href", "../imgs/consoleTexture.png")
          .attr('width', 126)
          .attr('height', 125);


    //this for loop adds the texts of data types
    for(var i = 0; i < 16; ++i){
      svg.append("text")
          .attr("x", (525 - textXPosChange))
          .attr("y", (65+i*30))
          .attr("id", ("t"+(i+1)))
          .attr("class", "info")
          .text(dataSet[i].label)
          .style("fill", "gray")
          .attr("text-anchor", "middle")
          .style("font-size", "1.0em")

      //adding small rect progress bars
      if(listOfHiddenRects.includes("#smallrect"+(i+1))){
        svg.append("rect")
            .attr("fill", "url(#hash4_4)")
            .attr("x", (650 - textXPosChange))
            .attr("y", 55+i*30)
            .attr("rx", 5)
            .attr("width", 100)
            .attr("height", 10)
            .attr("id", ("smallrect"+(i+1)))
            .attr("visibility", "hidden")
            .style("stroke", "black")
            .style("stroke-width", 2);
      }
      else{
        svg.append("rect")
            .attr("fill", 'url(#hash4_4)')
            .attr("x", (650 - textXPosChange))
            .attr("y", 55+i*30)
            .attr("rx", 5)
            .attr("width", 100)
            .attr("height", 10)
            .attr("id", ("smallrect"+(i+1)))
            .attr("visibility", "visible")
            .style("stroke", "black")
            .style("stroke-width", 2);
      }
    }

    for(var l = 0; l < scoreData.length; ++l){
      function calculateWidth() {
        if(scoreData[l] == 100){
          return 0;
        }
        else if(scoreData[l] <= 10){
          return (scoreData[l]*.35);
        }
        else{
          return (scoreData[l]*.25);
        }
      }

      //the variable tempX is so that the second rectangle (end) is at the appropriate X location.
      var tempX = progressBarX + calculateWidth() - 0.15;
      //progress bar
      if(listOfHiddenRects.includes("#bigrect"+(l+1))){
        svg.append("rect")
            .attr("x", (progressBarX))
            .attr("y", (55+l*30))
            .attr("rx", 5)
            .attr("width", scoreData[l])
            .attr("height", 10)
            .attr("id", ("bigrect"+(l+1)))
            .attr("fill", getInfo("bigrect"+(l+1), 0, "color"))
            .attr("visibility", "hidden")
            .style("stroke", "black")
            .style("stroke-width", 1.5);
      }
      else{
        svg.append("rect")
            .attr("x", (progressBarX))
            .attr("y", (55+l*30))
            .attr("rx", 5)
            .attr("width", scoreData[l])
            .attr("height", 10)
            .attr("id", ("bigrect"+(l+1)))
            .attr("fill", getInfo("bigrect"+(l+1), 0, "color"))
            .attr("visibility", "visible")
            .style("stroke", "black")
            .style("stroke-width", 1.5);
      }
    }
    renderData(dataSet);
  }


  /*
  * The function plotDataPoints is used to place the data points inside the appropriate year container.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */
  function plotDataPoints(data){
    //the variable circles binds data and connects it with circle HTML elements.
    var circles = svg.selectAll("circle").data(data);

    //the variable i is used to put the circles in the appropriate location.
    var i = 1;

    // the circles enter puts the datapoints on the graph
    circles.enter().append("circle")
      .attr("r", 10)
      .style("fill", "gray")
      .style("opacity", 0.3)
      .attr("cx", function (){
        var tempCX = Math.ceil(i/16);
        i++;
        return tempCX*100;
      })
      .attr("cy", function (d){
        var tempCY = 450 * (d.count/100);
        return (500-tempCY);
      })
      .attr("id",  function (d){ var id = d.id; i++; return id; })
      .attr("class", "info")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

      //This checks to see if all values are 0 and if so we can hide them by default.
      outerloop: for(var i = 0; i < data.length / years; i++){ //loops through every tracked datapoint
        for(var j = 0; j < years; j++){
          if(data[i + j * (data.length / years)].count !== 0){
            continue outerloop;
          }
        }
        svg.select('#checkbox' + (i + 1)).style('fill', 'gray');
        svg.selectAll(getInfo('checkbox' + (i + 1), 0, "progressBars")).attr('visibility', 'hidden');
        listOfHiddenRects = listOfHiddenRects.concat(getInfo('checkbox' + (i + 1), 0, "progressBars"));
        for(var j = 0; j < years; j++){
          svg.select('#' + data[i + j * (data.length / years)].id).attr('visibility', 'hidden');
        }
      }
    // On circles exit it removes all the circles that are placed in, this is for good D3.js practice and so that circles from previous data do not appear.
    circles.exit().remove();
  }

  /*
  * The function renderData takes in an array of objects as data and number of years.
  * This function was created for Issue 357. For more information refer to Issue 357.
  */

  d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
      this.parentNode.appendChild(this);
    });
  };

d3.selection.prototype.moveToBack = function() {
   return this.each(function() {
      var firstChild = this.parentNode.firstChild;
      if (firstChild) {
        this.parentNode.insertBefore(this, firstChild);
      }
    });
  }
  function renderData(data){
    //the variable dataSet holds the data that is passed in as parameter
    var dataSet = data;

    //the variable color holds the d3 color scheme.
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    //the variable clickables is used to select all the datapoints and the legend on the right hand side
    var clickables = svg.selectAll(".info");

    //the variable clickables is used to select all the datapoints and the legend on the right hand side
    var checkboxes = svg.selectAll(".checkbox");

    //the variable textRep is used to assign the ID of the legend of the land type.
    var textRep = "";

    //the variable bigBarRep is used to assign the ID of the bar graph that holds color and displays average score.
    var bigBarRep = "";

    //the following code is used to do all the event listeners for the clickables elements.
    clickables
      .on('mouseover', function (d) {
         d3.select(this).style("cursor", "pointer");
         var id = this.id;
         textRep = "#"+getInfo(id, 0, "textRep");
         var cantChangeTxtColor = listOfClickedText.includes(textRep);
         //this is to do hover effect on hovering a CIRCLE
         if(id.charAt(0) === "c"){
           var text = getText(this);
           if(!cantChangeTxtColor){
             svg.select(textRep).style("fill", "black");
           }
           svg.append("rect")
               .attr("x", (getCX(this)-15))
               .attr("y", (getCY(this)-25))
               .attr("rx", 5)
               .attr("ry", 5)
               .attr("width", 300)
               .attr("height", 30)
               .attr("id", "textbox")
               .attr("class", "info")
               .style("fill", "#9cc1fc")
               .style("opacity", 0.8)
           svg.append("text")
                 .attr("x", (getCX(this)+115))
                 .attr("y", (getCY(this)-5))
                 .attr("id", "tempText")
                 .style("text-anchor","middle")
                 .text(text);
         }
         else{//this is to do hover effect on hovering a TEXT
           if(!cantChangeTxtColor){
             d3.select(this).style("fill", "black");

             circlesToChange = getInfo(id, years, "data");

             //the for loop below resets the color of each circle to changed state: color--varies, opacity--0.8 and ADDS each circle to the clicked data point array
             for(var i = 0; i < circlesToChange.length; i++){
               svg.select("#"+circlesToChange[i]).style("opacity", 5.0).style("fill", getInfo(id, 0, "color"))
               .attr('r', 15).moveToFront();
               svg.select("#textbox").remove();
               svg.select("#tempText").remove();
               listOfClickedPoints.push(circlesToChange[i]);
             }

             //the for loop below changes all the text that have been click to color black text
             for(var i = 0; i < listOfClickedText.length; ++i){
               svg.select("#"+listOfClickedText[i]).style("fill", "black");
             }
           }
         }
      })
      .on('mouseout', function (d) {
        d3.select(this).style("cursor", "default");
        var id = this.id;
          svg.select("#textbox").remove();
          svg.select("#tempText").remove();
        //assigning the Rep variable to use to make changes to those elements
        textRep = getInfo(id, 0, "textRep");
        //this is to do hover effect on hovering a CIRCLE
        //removes the text box and the text on top of the text box
        if(id.charAt(0) === "c"){
          if(!listOfClickedText.includes(textRep)){
            svg.select("#"+textRep).style("fill", "gray");
          }
        }
        else{//this is to do hover effect on hovering a TEXT
          if(!listOfClickedText.includes(textRep)){
            svg.select("#"+textRep).style("fill", "gray");
            circlesToChange = getInfo(id, years, "data");
            for(var i = 0; i < circlesToChange.length; ++i){
              svg.select("#"+circlesToChange[i]).style("opacity", 0.3).style("fill", "gray").attr('r', 10).moveToBack();
            }
          }
        }
      })
      .on('click', function (d) {
        var id = this.id;


        //the variable circlesToChange is used to hold list of all circles that need to change
        var circlesToChange = getInfo(id, years, "data");

        //if you clicked on a circle all circles & text that are tied within must change color
        if(id.charAt(0) === "c"){
          //the variable newR is used to have the new value Radius for circles to be changed
          var newR = newRCalculator(this);

          //assigning the Rep variables to use to make changes to those elements
          textRep = getInfo(id, 0, "textRep");
          bigBarRep = "bigrect"+getInfo(id, 0, "barRep");

          //if it was already clicked, RESET everything back to previous version
          if(newR === 10){
            //the for loop below resets the color of each circle to normal state: color--GRAY, opacity--0.3 and REMOVES each circle from the clicked data point array
            for(var i = 0; i < circlesToChange.length; ++i){
              svg.select("#"+circlesToChange[i]).style("opacity", 0.3).style("fill", "gray");
              listOfClickedPoints.splice(circlesToChange[i], 1);
            }

            //the variable tempBBoxID is used to temporarily store the ID of the background box that is related to the circle who's attributes are being changed
            //variable is used to remove the background box of circle
            var tempBBoxID = "#"+getInfo(id, 0, "boxID");
            svg.select(tempBBoxID).remove();

            //changing the text of legend that belongs to data point to gray and resetting color of progress bar to assined color of data point
            svg.select("#"+textRep).style("fill", "gray");
            svg.select("#"+bigBarRep).style("fill", getInfo(id, 0, "color"));

            //removes the text associated with data point from clicked text array
            var index = listOfClickedText.indexOf(textRep);
            if (index > -1) {
              listOfClickedText.splice(index, 1);
            }

            //removes the progress bar associated with data point from progress bar array
            var index2 = listOfProgressBars.indexOf(bigBarRep);
            if (index2 > -1) {
              listOfProgressBars.splice(index2, 1);
            }

            //removes the background box associated with data point from background box array
            var index3 = listOfBackGroundBoxes.indexOf(getInfo(id, 0, "boxID"));
            if (index3 > -1) {
              listOfBackGroundBoxes.splice(index3, 1);
            }
          }//else if data point was not clicked
          else{//the data point is not selected, make new changes, NOT RESET

            //adds the new text that is connected to clicked data point to array of clicked text
            listOfClickedText.push(textRep);

            //adds the new progress bar that is connected to clicked data point to array of selected progress bars
            listOfProgressBars.push(bigBarRep);

            listOfBackGroundBoxes.push(getInfo(id, 0, "boxID"));

            //remove texts so background box could be at the bottom
            deteleText();

            //add background box
            svg.append("rect")
                .attr("x", (100+(100*years)))
                .attr("y", getInfo(id, 0, "boxY"))
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 375)
                .attr("height", 30)
                .attr("id", getInfo(id, 0, "boxID"))
                .style("fill", getInfo(id, 0, "color"))
                .style("opacity", 0.3)
                .attr("visibility", "none");

            //places text back on top layer above background boxes
            placeText(dataset, years);

            circlesToChange = getInfo(id, years, "data");

            //the for loop below resets the color of each circle to changed state: color--varies, opacity--0.8 and ADDS each circle to the clicked data point array
            for(var i = 0; i < circlesToChange.length; ++i){
              svg.select("#"+circlesToChange[i]).style("opacity", 5.0).style("fill", getInfo(id, 0, "color"));
              svg.select("#"+circlesToChange[i]).moveToFront();
              svg.select("#textbox").remove();
              svg.select("#tempText").remove();
              listOfClickedPoints.push(circlesToChange[i]);
            }

            //the for loop below changes all the text that have been click to color black text
            for(var i = 0; i < listOfClickedText.length; ++i){
              svg.select("#"+listOfClickedText[i]).style("fill", "black");
            }
          }
        }
        else{//if you select a text

          //assigning the Rep variables to use to make changes to those elements
          textRep = getInfo(id, 0, "textRep");
          bigBarRep = "bigrect"+getInfo(id, 0, "barRep");

          //undo changes
          if(listOfClickedText.includes(textRep)) {
            newR = 10;
            //the for loop below resets the color of each circle to normal state: color--GRAY, opacity--0.3 and REMOVES each circle from the clicked data point array
            for(var i = 0; i < circlesToChange.length; ++i){
              svg.select("#"+circlesToChange[i]).style("opacity", 0.3).style("fill", "gray");
              listOfClickedPoints.splice(circlesToChange[i], 1);
            }

            //the variable tempBBoxID is used to temporarily store the ID of the background box that is related to the circle who's attributes are being changed
            //variable is used to remove the background box of circle
            var tempBBoxID = "#"+getInfo(id, 0, "boxID");
            svg.select(tempBBoxID).remove();

            //changing the text of legend that belongs to data point to gray and resetting color of progress bar to assined color of data point
            svg.select("#"+textRep).style("fill", "gray");
            svg.select("#"+bigBarRep).style("fill", getInfo(id, 0, "color"));

            //removes the text associated with data point from clicked text array
            var index = listOfClickedText.indexOf(textRep);
            if (index > -1) {
              listOfClickedText.splice(index, 1);
            }

            //removes the progress bar associated with data point from progress bar array
            var index2 = listOfProgressBars.indexOf(bigBarRep);
            if (index2 > -1) {
              listOfProgressBars.splice(index2, 1);
            }

            //removes the background box associated with data point from background box array
            var index3 = listOfBackGroundBoxes.indexOf(getInfo(id, 0, "boxID"));
            if (index3 > -1) {
              listOfBackGroundBoxes.splice(index3, 1);
            }
          }
          else {//make changes
            newR = 15;

            //adds the new text that is connected to clicked data point to array of clicked text
            listOfClickedText.push(textRep);

            //adds the new progress bar that is connected to clicked data point to array of selected progress bars
            listOfProgressBars.push(bigBarRep);

            listOfBackGroundBoxes.push(getInfo(id, 0, "boxID"));

            //remove texts so background box could be at the bottom
            deteleText();

            //add background box
            svg.append("rect")
                .attr("x", (100+(100*years)))
                .attr("y", getInfo(id, 0, "boxY"))
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("width", 375)
                .attr("height", 30)
                .attr("id", getInfo(id, 0, "boxID"))
                .style("fill", getInfo(id, 0, "color"))
                .style("opacity", 0.3)
                .attr("visibility", "none");

            //places text back on top layer above background boxes
            placeText(dataset, years);

            //the for loop below resets the color of each circle to changed state: color--varies, opacity--0.8 and ADDS each circle to the clicked data point array
            for(var i = 0; i < circlesToChange.length; ++i){
              svg.select("#"+circlesToChange[i]).style("opacity", 5.0).style("fill", getInfo(id, 0, "color"));
              svg.select("#"+circlesToChange[i]).moveToFront();
              svg.select("#textbox").remove();
              svg.select("#tempText").remove();
              listOfClickedPoints.push(circlesToChange[i]);
            }

            //the for loop below changes all the text that have been click to color black text
            for(var i = 0; i < listOfClickedText.length; ++i){
              svg.select("#"+listOfClickedText[i]).style("fill", "black");
            }
          }
        }

        //-----------------------------------------------------------------------------------------
        //changing all circles to new radius
        for(var i = 0; i < circlesToChange.length; ++i){
          svg.select("#"+circlesToChange[i]).attr('r', newR);
        }
      });

    //the following code is used to do all the event listeners for the checkboxes elements.
    checkboxes
      .on('mouseover', function(){
        d3.select(this).style("cursor", "pointer");
      })
      .on('mouseout', function(){
        d3.select(this).style("cursor", "default");
      })
      .on('click', function(){
        //checks if checkbox is unclicked to be changed to click
        if(this.style.fill === "white"){
          //the line below changes the checkbox to "gray" meaning hide option was selected
          d3.select(this).style("fill", "gray");

          //the below two variables is used to hold all the elements that will change (progress bars and data points)
          var progressBars= getInfo(this.id, 0, "progressBars");
          var selectedDataPoints = getInfo(this.id ,years, "data");

          //the for loop below sets necessary progress bars to hidden
          for(var i = 0; i < progressBars.length; ++i){
            svg.select(progressBars[i]).attr("visibility", "hidden");
            listOfHiddenRects.push(progressBars[i]);
          }

          //the for loop below sets necessary data points to hidden
          for(var i = 0; i < selectedDataPoints.length; ++i){
            svg.select("#"+selectedDataPoints[i]).attr("visibility", "hidden");
          }
        }
        else{
          //the line below changes the checkbox to "white" meaning hide option was not selected
          d3.select(this).style("fill", "white");

          //the below two variables is used to hold all the elements that will change (progress bars and data points)
          var progressBars= getInfo(this.id, 0, "progressBars");
          var selectedDataPoints = getInfo(this.id ,years, "data");

          //the for loop below sets necessary progress bars to visible
          for(var i = 0; i < progressBars.length; ++i){
            svg.select(progressBars[i]).attr("visibility", "visible");
            var index = listOfHiddenRects.indexOf(progressBars[i]);
            if (index > -1) {
              listOfHiddenRects.splice(index, 1);
            }
          }

          //the for loop below sets necessary data points to visible
          for(var i = 0; i < selectedDataPoints.length; ++i){
            svg.select("#"+selectedDataPoints[i]).attr("visibility", "visible");
          }
        }
      });
  }


  placeText(dataset, years);
  placeStandards(years);
  plotDataPoints(dataset)
  renderData(dataset);

//--------------------End of Render function
}
