/**
 * Used to add commas for formatting.
 */
function addCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
          mouseoverInfo.select('.score').html((Math.round(d.value * 1000) / 10).toFixed(1) + "/100");
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

var tempResult;

//displayResults writes the html for the results iframe with updates results from Totals
function displayResults() {
  economics.mapChange();

  //Create results table and append it to the proper tab of the results frame
  var numericalTableString = generateResultsTable();

  generateEconomicsTables();


  document.getElementById('resultsFrame').contentWindow.document.getElementById('contentsN').innerHTML = numericalTableString;

  //refresh frame properties
  document.getElementById('resultsFrame').contentWindow.refreshPie();

  //create land Pie Chart
  drawD3LandPieChart(currentYear, false);

  drawD3EconRevPieChart(currentYear, false);

  //create econ Pie Chart
  drawD3EconPieChart(currentYear, false);

  //clearing scoreChart div tag, or else it will duplicate the scoreChart graph every time results is clicked on
  document.getElementById('resultsFrame').contentWindow.document.getElementById('scoreChart').innerHTML = ' ';
  //creating the scoreChart graph by calling the number of years that are currently
  render(boardData[currentBoard].calculatedToYear);
  //create precipitation Bar Graph
  drawPrecipitationInformationChart();

  economics.mapChange();

  economicsGraphic1 = new EconomicsGraphic1();
  economicsGraphic1.render();
  economicsGraphic3 = new EconomicsGraphic3();
  economicsGraphic3.render();
  econGraphic4 = EconomicsGraphic4().getInstance().render();
  econGraphic5 = EconomicsGraphic5().getInstance().render();
  econGraphic2 = new EconomicsGraphic2();
  econGraphic2.render();

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
  document.getElementById('resultsFrame').contentWindow.toggleYearForEconPlotBy(0);


  for(var i = 1; i <=3; i++){
    if(i > boardData[currentBoard].calculatedToYear){
      document.getElementById('resultsFrame').contentWindow.document.getElementById("yearSelect").options[i - 1].style.display = 'none';
    }
    else{
      document.getElementById('resultsFrame').contentWindow.document.getElementById("yearSelect").options[i - 1].style.display = 'block';
    }
  }

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
      mouseoverInfo.select('.count').html(addCommas((d.data.number).toFixed(1)) + " acres");
      mouseoverInfo.select('.percent').html(percent.toFixed(1) + '%');
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
      mouseoverInfo.select('.count').html(numFormatting(d3.select(slice).attr("count")) + " acres");
      mouseoverInfo.select('.percent').html(parseFloat(d3.select(slice).attr("percent")).toFixed(1) + '%');
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

function drawD3EconPieChart(year, isTheChartInCategoryMode) {

  // RESETTING THE TEMPORARY COLOR AND LEGEND ELEMENT nameArray
  tempLegendItems = [];
  tempLegendColors = [];
  //remove the html that's already there, ie clear the chart
  document.getElementById('resultsFrame').contentWindow.document.getElementById('econPieChart').innerHTML = " ";
  //pass data to the page that it needs, we do this by putting it in hidden divs
  document.getElementById('resultsFrame').contentWindow.document.getElementById('landYear').innerHTML = year;
  document.getElementById('resultsFrame').contentWindow.document.getElementById('upTo').innerHTML = boardData[currentBoard].calculatedToYear;

   var inMultiplayer = localStorage.getItem('LSinMultiplayer');
  /*
  * The variable multiplayerColorPack is used to hold the colors that represent each player in the the multiplayer set up mode.
  * For more information refer to Issue 386.
  */
  var multiplayerColorPack = ["#87ceee","#e6bb00","#cc6578","#127731","#c97b08","#302485"];
  let data = economics.data;
  var totalCost = getTotalCost(economics.mapData, year);
   var dataset = [{
      label: 'Conventional Corn',
      count: data[year][1]["Fixed/Variable"].total,
      number: data[year][1]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Conservation Corn',
      count: data[year][2]["Fixed/Variable"].total,
      number: data[year][2]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Conventional Soybean',
      count: data[year][3]["Fixed/Variable"].total,
      number: data[year][3]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Conservation Soybean',
      count: data[year][4]["Fixed/Variable"].total,
      number: data[year][4]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Mixed Fruits/Vegetables',
      count: data[year][15]["Fixed/Variable"].total,
      number: data[year][15]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Permanent Pasture',
      count: data[year][6]["Fixed/Variable"].total,
      number: data[year][6]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Rotational Grazing',
      count: data[year][7]["Fixed/Variable"].total,
      number: data[year][7]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Grass Hay',
      count: data[year][8]["Fixed/Variable"].total,
      number: data[year][8]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Switchgrass',
      count: data[year][12]["Fixed/Variable"].total,
      number: data[year][12]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Prairie',
      count: data[year][9]["Fixed/Variable"].total,
      number: data[year][9]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Wetland',
      count: data[year][14]["Fixed/Variable"].total,
      number: data[year][14]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Alfalfa',
      count: data[year][5]["Fixed/Variable"].total,
      number: data[year][5]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Conventional Forest',
      count: data[year][11]["Fixed/Variable"].total,
      number: data[year][11]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Conservation Forest',
      count: data[year][10]["Fixed/Variable"].total,
      number: data[year][10]["Fixed/Variable"].total/totalCost
    }, {
      label: 'Short Rotation Woody Bioenergy',
      count: data[year][13]["Fixed/Variable"].total,
      number: data[year][13]["Fixed/Variable"].total/totalCost
    }];
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
  var chart = document.getElementById('resultsFrame').contentWindow.document.getElementById('econPieChart');

   //d3 stuff here, I won't comment this section too heavily as it is mostly typical graphics
  var svg = d3.select(chart)
    .append('svg')
    .attr("class", "graph-svg-component")
    .attr("id", "pieSVGE")
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
      mouseoverInfo.select('.label').html(d.data.label);
      mouseoverInfo.select('.count').html("$"+numFormatting(d.data.count));
      mouseoverInfo.select('.percent').html((d.data.number*100).toFixed(1) + '%');
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
      var current = getData(d);
      //highlight text
      d3.select(this).style("fill", "steelblue");

       //highlight arc
      var slice = document.getElementById('resultsFrame').contentWindow.document.getElementById(d);
      d3.select(slice).classed("arc", false)
        .classed("arcHighlight", true);

       //show appropriate mouseover info
      mouseoverInfo.select('.label').html(d);
      mouseoverInfo.select('.count').html("$"+numFormatting(current.count));
      mouseoverInfo.select('.percent').html((current.number*100).toFixed(1) + '%');
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
    .text("Econ Numbers");
  //also add the year below that
  svg.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "1.8vw")
    .style("font-weight", "bold")
    .text(year);

   function getData(data) {
    for(var i = 0; i < dataset.length; ++i){
      if(data === dataset[i].label){
        return dataset[i];
      }
    }
    return "none";
  }

//  console.log(dataset[0].count);

   multiplayerResults();
} //end drawD3EconPieChart()


function drawD3EconRevPieChart(year, isTheChartInCategoryMode) {
  // RESETTING THE TEMPORARY COLOR AND LEGEND ELEMENT nameArray
  tempLegendItems = [];
  tempLegendColors = [];
  //remove the html that's already there, ie clear the chart
  document.getElementById('resultsFrame').contentWindow.document.getElementById('econRevPieChart').innerHTML = " ";
  //pass data to the page that it needs, we do this by putting it in hidden divs
  document.getElementById('resultsFrame').contentWindow.document.getElementById('landYear').innerHTML = year;
  document.getElementById('resultsFrame').contentWindow.document.getElementById('upTo').innerHTML = boardData[currentBoard].calculatedToYear;

   var inMultiplayer = localStorage.getItem('LSinMultiplayer');
  /*
  * The variable multiplayerColorPack is used to hold the colors that represent each player in the the multiplayer set up mode.
  * For more information refer to Issue 386.
  */
  var multiplayerColorPack = ["#87ceee","#e6bb00","#cc6578","#127731","#c97b08","#302485"];
  let totalRev = 0;
  economics.scaledRev[year].forEach(value => {
    totalRev += value;
  })
  console.log(totalRev)
   var dataset = [{
      label: 'Conventional Corn',
      count: (economics.scaledRev[year][1].toFixed(2)),
      number: ((economics.scaledRev[year][1].toFixed(2))/totalRev)
    }, {
      label: 'Conservation Corn',
      count: (economics.scaledRev[year][2].toFixed(2)),
      number: ((economics.scaledRev[year][2].toFixed(2))/totalRev)
    }, {
      label: 'Conventional Soybean',
      count: (economics.scaledRev[year][3].toFixed(2)),
      number: ((economics.scaledRev[year][3].toFixed(2))/totalRev)
    }, {
      label: 'Conservation Soybean',
      count: (economics.scaledRev[year][4].toFixed(2)),
      number: ((economics.scaledRev[year][4].toFixed(2))/totalRev)
    }, {
      label: 'Mixed Fruits/Vegetables',
      count: (economics.scaledRev[year][15].toFixed(2)),
      number: ((economics.scaledRev[year][15].toFixed(2))/totalRev)
    }, {
      label: 'Permanent Pasture',
      count: (economics.scaledRev[year][6].toFixed(2)),
      number: ((economics.scaledRev[year][6].toFixed(2))/totalRev)
    }, {
      label: 'Rotational Grazing',
      count: (economics.scaledRev[year][7].toFixed(2)),
      number: ((economics.scaledRev[year][7].toFixed(2))/totalRev)
    }, {
      label: 'Grass Hay',
      count: (economics.scaledRev[year][8].toFixed(2)),
      number: ((economics.scaledRev[year][8].toFixed(2))/totalRev)
    }, {
      label: 'Switchgrass',
      count: (economics.scaledRev[year][12].toFixed(2)),
      number: ((economics.scaledRev[year][12].toFixed(2))/totalRev)
    }, {
      label: 'Prairie',
      count: (economics.scaledRev[year][9].toFixed(2)),
      number: ((economics.scaledRev[year][9].toFixed(2))/totalRev)
    }, {
      label: 'Wetland',
      count: (economics.scaledRev[year][14].toFixed(2)),
      number: ((economics.scaledRev[year][14].toFixed(2))/totalRev)
    }, {
      label: 'Alfalfa',
      count: (economics.scaledRev[year][5].toFixed(2)),
      number: ((economics.scaledRev[year][5].toFixed(2))/totalRev)
    }, {
      label: 'Conventional Forest',
      count: (economics.scaledRev[year][11].toFixed(2)),
      number: ((economics.scaledRev[year][11].toFixed(2))/totalRev)
    }, {
      label: 'Conservation Forest',
      count: (economics.scaledRev[year][10].toFixed(2)),
      number: ((economics.scaledRev[year][10].toFixed(2))/totalRev)
    }, {
      label: 'Short Rotation Woody Bioenergy',
      count: (economics.scaledRev[year][13].toFixed(2)),
      number: ((economics.scaledRev[year][13].toFixed(2))/totalRev)
    }];
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
  var chart = document.getElementById('resultsFrame').contentWindow.document.getElementById('econRevPieChart');

   //d3 stuff here, I won't comment this section too heavily as it is mostly typical graphics
  var svg = d3.select(chart)
    .append('svg')
    .attr("class", "graph-svg-component")
    .attr("id", "pieSVGE")
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
      mouseoverInfo.select('.label').html(d.data.label);
      mouseoverInfo.select('.count').html('$' + numFormatting(d.data.count));
      mouseoverInfo.select('.percent').html((d.data.number*100).toFixed(1) + '%');
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
      var current = getData(d);
      //highlight text
      d3.select(this).style("fill", "steelblue");

       //highlight arc
      var slice = document.getElementById('resultsFrame').contentWindow.document.getElementById(d);
      d3.select(slice).classed("arc", false)
        .classed("arcHighlight", true);

       //show appropriate mouseover info
      mouseoverInfo.select('.label').html(d);
      mouseoverInfo.select('.count').html(("$"+(Math.round(current.count*10)/10)));
      mouseoverInfo.select('.percent').html((current.number*100).toFixed(1) + '%');
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
    .text("Econ Numbers");
  //also add the year below that
  svg.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "1.8vw")
    .style("font-weight", "bold")
    .text(year);

   function getData(data) {
    for(var i = 0; i < dataset.length; ++i){
      if(data === dataset[i].label){
        return dataset[i];
      }
    }
    return "none";
  }

//  console.log(dataset[0].count);

   multiplayerResults();
} //end drawD3EconRevPieChart()

function getTotalCost(data, givenYear) {
  var cost = 0;
    console.log(data[givenYear])
  for(let i = 0; i < data[givenYear].length; ++i){
    cost += data[givenYear][i].Value;
  }
  return cost;
}

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
      value: (Totals.nitrateConcentrationScore[y] / 100).toFixed(1),
      raw: (Math.round(Totals.nitrateConcentration[y] * 10) / 10).toFixed(1) + " ppm"
    }, {
      label: "Total Sum Yields",
      axis: "Total Yields",

      value: (Math.min((Totals.cornGrainYieldScore[y]  + Totals.soybeanYieldScore[y]  + Totals.mixedFruitsAndVegetablesYieldScore[y] + Totals.alfalfaHayYieldScore[y]  + Totals.grassHayYieldScore[y]  +
      Totals.switchgrassYieldScore[y] + Totals.cattleYieldScore[y] + Totals.woodYieldScore[y] + Totals.shortRotationWoodyBiomassYieldScore[y]) / 100, 100)).toFixed(1),
    }, {
      label: "Phosphorus Load",
      axis: "Phosphorus",
      value: (Totals.phosphorusLoadScore[y] / 100).toFixed(1),
      raw: (Math.round(Totals.phosphorusLoad[y] * 10) / 10).toFixed(1) + " tons"
    }, {
      label: "Sediment Delivery",
      axis: "Sediment",
      value: (Totals.sedimentDeliveryScore[y] / 100).toFixed(1),
      raw: (Math.round(Totals.sedimentDelivery[y] * 10) / 10).toFixed(1) + " tons"
    }, {
      label: "Carbon Sequestration",
      axis: "Carbon",
      value: (Totals.carbonSequestrationScore[y] / 100).toFixed(1),
      raw: (Math.round(Totals.carbonSequestration[y] * 10) / 10).toFixed(1) + " tons"
    }, {
      label: "Gross Erosion",
      axis: "Erosion",
      value: (Totals.grossErosionScore[y] / 100).toFixed(1),
      raw: (Math.round(Totals.grossErosion[y] * 10) / 10).toFixed(1) + " tons"
    }, {
      label: "Game Wildlife",
      axis: "Wildlife",
      value: (Totals.gameWildlifePointsScore[y] / 100).toFixed(1),
      raw: (Math.round(Totals.gameWildlifePoints[y] * 10) / 10).toFixed(1) + " pts"
    }, {
      label: "Biodiversity",
      axis: "Biodiversity",
      value: (Totals.biodiversityPointsScore[y] / 100).toFixed(1),
      raw: (Math.round(Totals.biodiversityPoints[y] * 10) / 10).toFixed(1) + " pts"
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
function tableSort(column){
  let values = generateEconTableData();
  values.sort(function(a,b){
    if(a[column] < b[column]) return -1;
    else if(a[column] > b[column]) return 1;
    else return 0;
  });
  this.parent.updateTables(values, this.parent);
}

function numSort(column){
  let values = generateEconTableData();
  values.sort(function(a,b){
    return Number.parseFloat(b[column]) - Number.parseFloat(a[column]);
  });
  this.parent.updateTables(values, this.parent);
}
function generateEconTableData(year){
  let results = []
  let econ = economics.mapData[year];
  for(let i = 0; i < econ.length; ++i){
    var tempObj = getObj(econ[i]);
    results.push(tempObj);
  }
  results.splice(0,1);
  return results;
}

function numFormatting(num){
  return Number.parseFloat(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateEconomicsTables() {
  var econtables = {'convCorn': {landuse: "Conventional Corn", subCrop:"Corn after Soybean"},
  'convCorn2': {landuse: "Conventional Corn", subCrop: "Corn after Corn"},
  'consCorn' : {landuse: "Conservation Corn", subCrop: "Corn after Soybean"},
  'consCorn2': {landuse: "Conservation Corn", subCrop: "Corn after Corn"},
  'convSoy': {landuse: "Conventional Soybean", subCrop: "Soybean after Corn"},
  'consSoy': {landuse: "Conservation Soybean", subCrop: "Soybean after Corn"},
  'alf': {landuse: "Alfalfa"},
  'permPas': {landuse: "Permanent Pasture"},
  'rotGraz': {landuse: "Rotational Grazing"},
  'grassHay': {landuse: "Grass Hay"},
  'prairie': {landuse: "Prairie"},
  'consFor': {landuse: "Conservation Forest"},
  'convFor': {landuse: "Conventional Forest"},
  'switchG': {landuse: "Switchgrass"},
  'shortRWB': {landuse: "Short-rotation Woody Bioenergy"},
  'wetland': {landuse: "Wetland"},
  'mixedFruitsVGrapes': {landuse: "Mixed Fruits & Vegetables", subCrop:"Grapes (Conventional)"},
  'mixedFruitsVGreenB': {landuse: "Mixed Fruits & Vegetables", subCrop:"Green Beans"},
  'mixedFruitsVSquash': {landuse: "Mixed Fruits & Vegetables", subCrop:"Winter Squash"},
  'mixedFruitsVStrawberries': {landuse: "Mixed Fruits & Vegetables", subCrop:"Strawberries"}}

  document.getElementById('resultsFrame').contentWindow.document.getElementById('yearSelect').selectedIndex = currentYear - 1;


   //results array that holds data objects
   let results = generateEconTableData(document.getElementById('resultsFrame').contentWindow.document.getElementById("yearSelect").value);

  this.clearTableVars = () => {
    Object.keys(econtables).forEach(key =>{
      econtables[key].table = '<table><tr><th onclick="tableSort(\'costName\')">Cost Name</th><th onclick="tableSort(\'time\')">Time</th><th onclick="tableSort(\'action\')">Action</th><th onclick="numSort(\'value\')">Value</th><th>Frequency</th><th>Description</th></tr>'
    })
  }

  this.updateTables = (values) =>{
    this.clearTableVars();
    console.log(values);

    for(var i = 0; i < values.length; ++i){
      curLandUse = values[i].landUse;
      Object.keys(econtables).forEach(key =>{
        if(curLandUse == econtables[key].landuse){
          if(!values[i].subCrop || values[i].subCrop == econtables[key].subCrop){
            econtables[key].table += "<tr><td>"+values[i].costName+"</td><td>"+values[i].time+"</td><td>"+values[i].action+'</td><td style="text-align:right">'+"$"+numFormatting(values[i].value)+"</td><td>"+values[i].timeOfYear+"</td><td>"+values[i].description+"</td></tr>";
          }
        }
      });
    }

    Object.keys(econtables).forEach(key =>{
      econtables[key].table += "</table>";
    });

    placeTotalsOnBars(document.getElementById('resultsFrame').contentWindow.document.getElementById("yearSelect").value);
    this.setTables();
  }

 getEconomicsData(results);

  //updates the tables by calling updateTables

  this.setTables = (timeOrAction) => {
    Object.keys(econtables).forEach(key =>{
      document.getElementById('resultsFrame').contentWindow.document.getElementById(key).innerHTML = econtables[key].table
    });
  }
  this.updateTables(results);

}//end generateEconomicsTables()

 function getEconomicsData(data) {
  data.splice(-1,1);
  tempResult = data;
  var tempData = [];
  var convCorn = 0;
  var consCorn = 0;
  var convSoy = 0;
  var consSoy = 0;
  var alf = 0;
  var permPas = 0;
  var rotGraz = 0;
  var grassHay = 0;
  var prairie = 0;
  var consFor = 0;
  var convFor = 0;
  var switchG = 0;
  var shortRWB = 0;
  var wetland = 0;
  var mixedFruitsV = 0;
  var total = 0;
  var names = ["Conventional Corn","Conservation Corn", "Conventional Soybean", "Conservation Soybean", "Alfalfa",
              "Permanent Pasture", "Rotational Grazing", "Grass Hay", "Prairie", "Conservation Forest", "Conventional Forest",
              "Switchgrass", "Short-rotation Woody Bioenergy", "Wetland", "Mixed Fruits & Vegetables"];

  for(var i = 0; i < data.length; ++i){
    switch (data[i].landUse) {
      case "Conventional Corn":
      var temp = getValue(data[i].value);
      convCorn += temp;
      total += temp;
      break;
      case "Conservation Corn":
      var temp = getValue(data[i].value);
      consCorn += temp;
      total += temp;
      break;
      case "Conventional Soybean":
      var temp = getValue(data[i].value);
      convSoy += temp;
      total += temp;
      break;
      case "Conservation Soybean":
      var temp = getValue(data[i].value);
      consSoy += temp;
      total += temp;
      break;
      case "Alfalfa":
      var temp = getValue(data[i].value);
      alf += temp;
      total += temp;
      break;
      case "Permanent Pasture":
      var temp = getValue(data[i].value);
      permPas += temp;
      total += temp;
      break;
      case "Rotational Grazing":
      var temp = getValue(data[i].value);
      rotGraz += temp;
      total += temp;
      break;
      case "Grass Hay":
      var temp = getValue(data[i].value);
      grassHay += temp;
      total += temp;
      break;
      case "Prairie":
      var temp = getValue(data[i].value);
      prairie += temp;
      total += temp;
      break;
      case "Conservation Forest":
      var temp = getValue(data[i].value);
      consFor += temp;
      total += temp;
      break;
      case "Conventional Forest":
      var temp = getValue(data[i].value);
      convFor += temp;
      total += temp;
      break;
      case "Switchgrass":
      var temp = getValue(data[i].value);
      switchG += temp;
      total += temp;
      break;
      case "Short-rotation Woody Bioenergy":
      var temp = getValue(data[i].value);
      shortRWB += temp;
      total += temp;
      break;
      case "Wetland":
      var temp = getValue(data[i].value);
      wetland += temp;
      total += temp;
      break;
      case "Mixed Fruits & Vegetables":
      var temp = getValue(data[i].value);
      mixedFruitsV += temp;
      total += temp;
      break;
    }
  }

  var totals = [convCorn, consCorn, convSoy, consSoy, alf, permPas, rotGraz, grassHay, prairie, consFor, convFor, switchG, shortRWB, wetland, mixedFruitsV];

  localStorage.setItem("convCorn", convCorn.toFixed(2));
  localStorage.setItem("consCorn", consCorn.toFixed(2));
  localStorage.setItem("convSoy", convSoy.toFixed(2));
  localStorage.setItem("consSoy", consSoy.toFixed(2));
  localStorage.setItem("alf", alf.toFixed(2));
  localStorage.setItem("permPas", permPas.toFixed(2));
  localStorage.setItem("rotGraz", rotGraz.toFixed(2));
  localStorage.setItem("grassHay", grassHay.toFixed(2));
  localStorage.setItem("prairie", prairie.toFixed(2));
  localStorage.setItem("consFor", consFor.toFixed(2));
  localStorage.setItem("convFor", convFor.toFixed(2));
  localStorage.setItem("switchG", switchG.toFixed(2));
  localStorage.setItem("shortRWB", shortRWB.toFixed(2));
  localStorage.setItem("wetland", wetland.toFixed(2));
  localStorage.setItem("mixedFruitsV", mixedFruitsV.toFixed(2));



  for(var i = 0; i < names.length; ++i){
    var tempObj = {label: names[i], count: totals[i], number: (totals[i]/total)};
    tempData.push(tempObj);
  }
  tempResult = tempData;
}

function getValue(val) {
  return val;
  // if(val.charAt(0) === '$'){
  //   var temp = val.replace(/[^0-9\.-]+/g,"");
  //   return parseFloat(temp);
  // }
  // else if(val.charAt(0) === '('){
  //   var temp = val.substr(1);
  //   temp = temp.substr(1);
  //   temp = temp.substring(0, temp.length - 1);
  //   temp = (-1 * temp);
  //   return parseFloat(temp);
  // }
  // else {
  //   return parseFloat(val);
  // }
}

/*function getObj(data, tOrA){
  if(tOrA === "T"){
    var obj = {landUse: data["Land-Use"], costName: data["Cost Name"], name: "Time", TorA: data["Time - Cost Type"], value: data["Value"], timeOfYear: data["Frequency"], description: data["Description"], subCrop: data["Sub Crop"]};
  }
  else if(tOrA === "A"){
    var obj = {landUse: data["Land-Use"], costName: data["Cost Name"], name: "Action", TorA: data["Action - Cost Type"], value: data["Value"], timeOfYear: data["Frequency"], description: data["Description"], subCrop: data["Sub Crop"]};
  }

   return obj;
}*/

function getObj(data){
  var obj = {landUse: data["Land-Use"], costName: data["Cost Name"], nameT: "Time", time: data["Time - Cost Type"], nameA: "Action", action: data["Action - Cost Type"], value: data["Value"], timeOfYear: data["Frequency"], description: data["Description"], subCrop: data["Sub Crop"]};

  return obj;
}

//generateResultsTable creates the string of html with all the numerical results
// the code here is a little dense, but entirely straightforward
// where possible, loops are created for years
function generateResultsTable() {

  // Tables 1 and 3 include classes verticalLine, centerText, rightText, and leftText. These are used to format the table by putting lines between different sections and aligning the text to look the best.

  var toMetricFactorArea = 2.471;
  var upToYear = boardData[currentBoard].calculatedToYear;
  var yearWidth = 17 / upToYear + "%";

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
          htmlTableString += "<td> " + addCommas(Math.round(Totals.landUseResults[1]["conventionalCornLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 2:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + addCommas(Math.round(Totals.landUseResults[1]["conservationCornLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 3:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + addCommas(Math.round(Totals.landUseResults[1]["conventionalSoybeanLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 4:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + addCommas(Math.round(Totals.landUseResults[1]["conservationSoybeanLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 5:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + addCommas(Math.round(Totals.landUseResults[1]["alfalfaLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
        case 6:
          htmlTableString += "<tr><td> Player "+i+" </td>";
          htmlTableString += "<td> " + dataset[i-1].count +" </td><td> percent </td>"
          htmlTableString += "<td> " + dataset[i-1].number +" </td><td> acres </td>";
          htmlTableString += "<td> " + addCommas(Math.round(Totals.landUseResults[1]["permanentPastureLandUse"] / toMetricFactorArea * 10) / 10) +" </td><td> hectares </td>";
          break;
      }
      htmlTableString += "</tr>";
    }

    htmlTableString += "</table><br>";
    //END of Table 1 (Players)==================================================

    //Start of Precipitation table
    htmlTableString += "<table id='table3' class='resultsTable'>";

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
      htmlTableString += addCommas(Math.round(boardData[currentBoard].precipitation[y] * 2.54 * 10) / 10);
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>cm</td></tr>";

    htmlTableString += "</table><br>";
    //END of Table 2 (Precipitation)==================================================

    //Start of Strategic Wetland Use table
    htmlTableString += "<table id='table3' class='resultsTable'>";

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
    htmlTableString += "<tr class='tableHeading'> <th width='28%' class='leftText'> Land Use Category </th>";
    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th width=" + yearWidth + " class='rightText'>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th width='11%' class='centerText'>Percentage</th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th width=" + yearWidth + " class='rightText'>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th width='11%' class='centerText'>Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th width=" + yearWidth + " class='rightText'>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th width='11%' class='centerText'>Units (Metric) </th>";

    htmlTableString += "</tr>";

    //Add Data Rows

    //this string will add empty tags to help format the lines on the table, these initial three are to cover the coumns percentage, units(english), and units(metric)
    var format = "";
    if(upToYear == 1){
      format = "<td></td><td class='verticalLine'></td><td></td><td class='verticalLine'></td>";
    }
    else if(upToYear == 2){
      format = "<td></td><td></td><td class='verticalLine'></td><td></td><td></td><td class='verticalLine'></td>";
    }
    else if(upToYear == 3){
      format = "<td></td><td></td><td></td><td class='verticalLine'></td><td></td><td></td><td></td><td class='verticalLine'></td>";
    }




    for (var l = 0; l < backendDataIdentifiers.length; l++) {

      //check for the cases where a header needs to be added
      switch (l) {
        case 0:
          htmlTableString += "<tr class='tableHeading'><td class='verticalLine'><b>Annual Grain</b></td>" + format + "</tr>";
          break;
        case 2:
          htmlTableString += "<tr class='tableHeading'><td class='verticalLine'><b>Annual Legume</b></td>" + format + "</tr>";
          break;
        case 4:
          htmlTableString += "<tr class='tableHeading'><td class='verticalLine'><b>Mixed Fruits and Vegetables</b></td>" + format + "</tr>";
          break;
        case 5:
          htmlTableString += "<tr class='tableHeading'><td class='verticalLine'><b>Pasture</b></td>" + format + "</tr>";
          break;
        case 7:
          htmlTableString += "<tr class='tableHeading'><td class='verticalLine'><b>Perennial Herbaceous (non-pasture)</b></td>" + format + "</tr>";
          break;
        case 11:
          htmlTableString += "<tr class='tableHeading'><td class='verticalLine'><b>Perennial Legume</b></td>" + format + "</tr>";
          break;
        case 12:
          htmlTableString += "<tr class='tableHeading'><td class='verticalLine'><b>Perennial Wooded</b></td>" + format + "</tr>";
          break;

      } //end switch

      htmlTableString += "<tr>";

      htmlTableString += "<td class='verticalLine'>" + frontendNames[l] + "</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td class='rightText'>";

        var tempString = backendDataIdentifiers[l] + "LandUse";
        htmlTableString += (Math.round(Totals.landUseResults[y][tempString] / Totals.totalArea * 100 * 10) / 10).toFixed(1) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell
      htmlTableString += "<td class='verticalLine centerText'>percent</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td class='rightText'>";

        var tempString = backendDataIdentifiers[l] + "LandUse";
        htmlTableString += (Math.round(Totals.landUseResults[y][tempString] * 10) / 10).toFixed(1) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell
      htmlTableString += "<td class='verticalLine centerText'>acres</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td class='rightText'>";

        var tempString = backendDataIdentifiers[l] + "LandUse";
        htmlTableString += (Math.round(Totals.landUseResults[y][tempString] / toMetricFactorArea * 10) / 10).toFixed(1) + "<br>";

        htmlTableString += "</td>";

      } //for each year

      //units cell
      htmlTableString += "<td class='centerText'>hectares</td></tr>";
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

    htmlTableString += "<tr class='tableHeading'> <th width='28%' class='leftText'> Ecosystem Service Indicator <br> / Measurement </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th width=" + yearWidth + " class='rightText'>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th width='11%' class='centerText'>Score</th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th width=" + yearWidth + " class='rightText'>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th width='11%' class='centerText'>Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th width=" + yearWidth + " class='rightText'>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th width='11%' class='centerText'>Units (Metric) </th>";

    htmlTableString += "</tr>";

    //table data

    for (var l = 0; l < backendDataIdentifiers.length; l++) {

      //keep track if we need to add the appropriate subheading lines
      switch (l) {
        case 0:
          //htmlTableString += "<tr class='tableHeading'><td><b>Habitat</b></td></tr>";
          //  //put Habitat header, in bold
            htmlTableString += "<tr>";
            htmlTableString += "<td class='verticalLine'><b>" + "Habitat" + "<b></td>";
            //calculate total score for each year and place next to Habitat header
            for(var y = 1; y <= upToYear; y++){
              htmlTableString += "<td class='rightText'><b>";

              var totalScore = (Totals.gameWildlifePointsScore[y]+Totals.biodiversityPointsScore[y])/2;

              htmlTableString += addCommas((Math.round(totalScore * 10) / 10).toFixed(1)) + "<br>";

              htmlTableString += "<b></td>";
            }
            htmlTableString += "<td class='verticalLine centerText'><b>(out of 100)<b></td>";
            //add extra spaces to fill out bar across screen
            for(var y = 1; y <= (2*upToYear)+2; y++){
              if(y == ((2*upToYear) + 2) / 2){
                htmlTableString += "<td  class='verticalLine centerText'></td>";
              }
              else{
                htmlTableString += "<td></td>";
              }
            }
            break;
          break;
        case 2:
          //htmlTableString += "<tr class='tableHeading'><td><b>Soil Quality</b></td></tr>";
          htmlTableString += "<tr>";
          htmlTableString += "<td class='verticalLine'><b>" + "Soil Quality" + "<b></td>";
          //calculate total score for each year and place next to Habitat header
          for(var y = 1; y <= upToYear; y++){
            htmlTableString += "<td class='rightText'><b>";

            var totalScore = (Totals.carbonSequestrationScore[y]+Totals.grossErosionScore[y])/2;

            htmlTableString += addCommas((Math.round(totalScore * 10) / 10).toFixed(1)) + "<br>";

            htmlTableString += "<b></td>";
          }
          htmlTableString += "<td class='verticalLine centerText'><b>(out of 100)<b></td>";
          //add extra spaces to fill out bar across screen
          for(var y = 1; y <= (2*upToYear)+2; y++){
            if(y == ((2*upToYear) + 2) / 2){
              htmlTableString += "<td  class='verticalLine centerText'></td>";
            }
            else{
              htmlTableString += "<td></td>";
            }
          }
          break;
        case 4:
          //htmlTableString += "<tr class='tableHeading'><td><b>Water Quality</b></td></tr>";
          htmlTableString += "<tr>";
          htmlTableString += "<td class='verticalLine'><b>" + "Water Quality" + "<b></td>";
          //calculate total score for each year and place next to Habitat header
          for(var y = 1; y <= upToYear; y++){
            htmlTableString += "<td class='rightText'><b>";

            var totalScore = (Totals.nitrateConcentrationScore[y]+Totals.phosphorusLoadScore[y]+Totals.sedimentDeliveryScore[y])/3;

            htmlTableString += addCommas((Math.round(totalScore * 10) / 10).toFixed(1)) + "<br>";

            htmlTableString += "<b></td>";
          }
          htmlTableString += "<td class='verticalLine centerText'><b>(out of 100)<b></td>";
          //add extra spaces to fill out bar across screen
          for(var y = 1; y <= (2*upToYear)+2; y++){
            if(y == ((2*upToYear) + 2) / 2){
              htmlTableString += "<td  class='verticalLine'></td>";
            }
            else{
              htmlTableString += "<td></td>";
            }
          }
          break;
      } //end switch

      htmlTableString += "<tr>";

      htmlTableString += "<td  class='verticalLine'>" + frontendNames[l] + "</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td class='rightText'>";

        var tempString = backendDataIdentifiers[l] + "Score";
        htmlTableString += addCommas((Math.round(Totals[tempString][y] * 10) / 10).toFixed(1)) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell
      htmlTableString += "<td class='verticalLine centerText'>(out of 100)</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td class='rightText'>";

        var tempString = backendDataIdentifiers[l];
        //Correction for Carbon Sequestrations

        // if (l == 2) {
        //   Totals[tempString][y] = Totals[tempString][y] * (1 / conversionArray[l]);
        // }

        htmlTableString += addCommas((Math.round(Totals[tempString][y] * 10) / 10).toFixed(1)) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell, keep track which type of units we'll need
      if (l < 2) htmlTableString += "<td class='verticalLine centerText'>pts</td>";
      if (2 <= l && l < 4) htmlTableString += "<td class='verticalLine centerText'>tons</td>";
      if (4 <= l && l < 5) htmlTableString += "<td class='verticalLine centerText'>ppm</td>";
      if (5 <= l && l < 8) htmlTableString += "<td class='verticalLine centerText'>tons</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td  class='rightText'>";

        var tempString = backendDataIdentifiers[l];
        htmlTableString += addCommas((Math.round(Totals[tempString][y] * conversionArray[l] * 10) / 10).toFixed(1)) + "<br>";

        htmlTableString += "</td>";

      } //for each year

      //units cell
      if (l < 2) htmlTableString += "<td class='centerText'>pts</td>";
      if (2 <= l && l < 4) htmlTableString += "<td class='centerText'>Mg</td>";
      if (4 <= l && l < 5) htmlTableString += "<td class='centerText'>mg/L</td>";
      if (5 <= l && l < 8) htmlTableString += "<td class='centerText'>Mg</td>";
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
            htmlTableString += "<td class='verticalLine'><b>" + "Yield" + "<b></td>";

            //calculate total score for each year and place next to Yield header
            for(var y = 1; y <= upToYear; y++){
              htmlTableString += "<td class='rightText'><b>";

              var totalScore = Math.min(Totals.cornGrainYieldScore[y] +
              Totals.soybeanYieldScore[y] + Totals.mixedFruitsAndVegetablesYieldScore[y] + Totals.alfalfaHayYieldScore[y] +
              Totals.grassHayYieldScore[y] + Totals.switchgrassYieldScore[y] + Totals.cattleYieldScore[y] + Totals.woodYieldScore[y] + Totals.shortRotationWoodyBiomassYieldScore[y], 100);

              htmlTableString += addCommas((Math.round(totalScore * 10) / 10).toFixed(1)) + "<br>";

              htmlTableString += "<b></td>";
            }
            htmlTableString += "<td  class='verticalLine centerText'><b>(out of 100)<b></td>";
            //add extra spaces to fill out bar across screen
            for(var y = 1; y <= (2*upToYear)+2; y++){
              if(y == ((2*upToYear) + 2) / 2){
                htmlTableString += "<td  class='verticalLine'></td>";
              }
              else{
                htmlTableString += "<td></td>";
              }
            }
            break;
      } //end switch

      htmlTableString += "<tr>";

      htmlTableString += "<td class='verticalLine'>" + frontendNames[l] + "</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td class='rightText'>";

        var tempString = backendDataIdentifiers[l] + "Score";
        htmlTableString += addCommas((Math.round(Totals[tempString][y] * 10) / 10).toFixed(1)) + "<br>";

        htmlTableString += "</td>";
      } //for each year
      //units cell
      htmlTableString += "<td class='verticalLine centerText'>(out of 100)</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td class='rightText'>";

        var tempString = backendDataIdentifiers[l];
        htmlTableString += addCommas((Math.round(Totals.yieldResults[y][tempString] * 10) / 10).toFixed(1)) + "<br>";

        htmlTableString += "</td>";
      } //for each year

      //units cell, lots of different ones to keep track of here
      if (l < 2) htmlTableString += "<td class='verticalLine centerText'>bu</td>";
      if (l == 2) htmlTableString += "<td class='verticalLine centerText'>tons</td>";
      if (l == 3) htmlTableString += "<td class='verticalLine centerText'>animals</td>"; //what an odd unit
      if (4 <= l && l < 7) htmlTableString += "<td class='verticalLine centerText'>tons</td>";
      if (l == 7) htmlTableString += "<td class='verticalLine centerText'>board-ft</td>";
      if (l == 8) htmlTableString += "<td class='verticalLine centerText'>tons</td>";

      for (var y = 1; y <= upToYear; y++) {
        htmlTableString += "<td class='rightText'>";

        var tempString = backendDataIdentifiers[l];
        htmlTableString += addCommas((Math.round(Totals.yieldResults[y][tempString] * conversionArray[l] * 10) / 10).toFixed(1)) + "<br>";

        htmlTableString += "</td>";


      } //for each year

      //units cell
      if (l < 2) htmlTableString += "<td class='centerText'>Mg</td>";
      if (l == 2) htmlTableString += "<td class='centerText'>Mg</td>";
      if (l == 3) htmlTableString += "<td class='centerText'>animals</td>";
      if (4 <= l && l < 7) htmlTableString += "<td class='centerText'>Mg</td>";
      if (l == 7) htmlTableString += "<td class='centerText'>m^3</td>";
      if (l == 8) htmlTableString += "<td class='centerText'>Mg</td>";
    }

    htmlTableString += "</table><br>";

    //============================
    //TABLE FOUR, SPECIAL INDICATORS

    htmlTableString += "<table id='table3' class='resultsTable'>";

    //add header row


    htmlTableString += "<tr class='tableHeading leftText'> <th style='width:220px;'> Other Parameters </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th class='leftText'>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th> </th>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<th class='leftText'>";
      htmlTableString += "Y" + y;
      htmlTableString += "</th>";
    }

    htmlTableString += "<th> </th>";

    htmlTableString += "</tr>";

    htmlTableString += "<tr><td>Precipitation</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += boardData[currentBoard].precipitation[y].toFixed(1);
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>inches</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += (Math.round(boardData[currentBoard].precipitation[y] * 2.54 * 10) / 10).toFixed(1);
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>cm</td>";

    htmlTableString += "</tr>";

    htmlTableString += "<tr><td>Strategic Wetland Use</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += Totals.strategicWetlandPercent[y].toFixed(1);
      htmlTableString += "</td>";
    }

    htmlTableString += "<td>percent</td>";

    for (var y = 1; y <= upToYear; y++) {
      htmlTableString += "<td>";
      htmlTableString += Totals.strategicWetlandCells[y].toFixed(1);
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

function findBar(givenString){
  var aTags =  document.getElementById('resultsFrame').contentWindow.document.getElementsByTagName("a");
  var found;

   for (var i = 0; i < aTags.length; i++) {
    if (aTags[i].textContent.includes(givenString)) {
      found = aTags[i];
      return found;
    }
  }
  return 0;
}

function placeTotalsOnBars(year){
  var accordion =  document.getElementById('resultsFrame').contentWindow.document.getElementById("accordionContainer");
  if(accordion.style.display === "none"){
    return;
  }


  var convCorn = findBar('Conventional Corn');
  var consCorn = findBar('Conservation Corn');
  var convSoy = findBar('Conventional Soybean');
  var consSoy = findBar('Conservation Soybean');
  var alfalfa = findBar('Alfalfa');
  var permPas = findBar('Permanent Pasture');
  var rotGraz = findBar('Rotational Grazing');
  var grassHay = findBar('Grass Hay');
  var prairie = findBar('Prairie');
  var consFor = findBar('Conservation Forest');
  var convFor = findBar('Conventional Forest');
  var switchgrass = findBar('Switchgrass');
  var shortRWB = findBar('Short-Rotation Woody Bioenergy');
  var wetland = findBar('Wetland');
  var mixedFaV = findBar('Mixed Fruits & Vegetables');

  var convCornASoy = findBar('Conventional Corn after Soybean');
  var convCornACorn = findBar('Conventional Corn after Corn');
  var consCornASoy = findBar('Conservation Corn after Soybean');
  var consCornACorn = findBar('Conservation Corn after Corn');

  var grapes = findBar('Grapes');
  var greenBeans = findBar('Green Beans');
  var squash = findBar('Squash');
  var strawberries = findBar('Strawberries');

  convCorn.firstChild.nodeValue = ("Conventional Corn Total: $" + numFormatting(economics.data[year][1]['Action - Cost Type'].total));
  consCorn.firstChild.nodeValue = ("Conservation Corn Total: $" + numFormatting(economics.data[year][2]['Action - Cost Type'].total));
  convSoy.firstChild.nodeValue = ("Conventional Soybean Total: $" + numFormatting(economics.data[year][3]['Action - Cost Type'].total));
  consSoy.firstChild.nodeValue = ("Conservation Soybean Total: $" + numFormatting(economics.data[year][4]['Action - Cost Type'].total));
  alfalfa.firstChild.nodeValue = ("Alfalfa Total: $" + numFormatting(economics.data[year][5]['Action - Cost Type'].total));
  permPas.firstChild.nodeValue = ("Permanent Pasture Total: $" + numFormatting(economics.data[year][6]['Action - Cost Type'].total));
  rotGraz.firstChild.nodeValue = ("Rotational Grazing Total: $" + numFormatting(economics.data[year][7]['Action - Cost Type'].total));
  grassHay.firstChild.nodeValue = ("Grass Hay Total: $" + numFormatting(economics.data[year][8]['Action - Cost Type'].total));
  prairie.firstChild.nodeValue = ("Prairie Total: $" + numFormatting(economics.data[year][9]['Action - Cost Type'].total));
  consFor.firstChild.nodeValue = ("Conservation Forest Total: $" + numFormatting(economics.data[year][10]['Action - Cost Type'].total));
  convFor.firstChild.nodeValue = ("Conventional Forest Total: $" + numFormatting(economics.data[year][11]['Action - Cost Type'].total));
  switchgrass.firstChild.nodeValue = ("Switchgrass Total: $" + numFormatting(economics.data[year][12]['Action - Cost Type'].total));
  shortRWB.firstChild.nodeValue = ("Short-Rotation Woody Bioenergy Total: $" + numFormatting(economics.data[year][13]['Action - Cost Type'].total));
  wetland.firstChild.nodeValue = ("Wetland Total: $" + numFormatting(economics.data[year][14]['Action - Cost Type'].total));
  mixedFaV.firstChild.nodeValue = ("Mixed Fruits & Vegetables Total: $" + numFormatting(economics.data[year][15]['Action - Cost Type'].total));

  convCornASoy.firstChild.nodeValue = ("Conventional Corn after Soybean Total: $" + numFormatting(economics.dataSubcrop[year]['Conventional Corn']['Corn after Soybean']));
  convCornACorn.firstChild.nodeValue = ("Conventional Corn after Corn Total: $" + numFormatting(economics.dataSubcrop[year]['Conventional Corn']['Corn after Corn']));
  consCornASoy.firstChild.nodeValue = ("Conservation Corn after Soybean Total: $" + numFormatting(economics.dataSubcrop[year]['Conservation Corn']['Corn after Soybean']));
  consCornACorn.firstChild.nodeValue = ("Conservation Corn after Corn Total: $" + numFormatting(economics.dataSubcrop[year]['Conservation Corn']['Corn after Corn']));
  grapes.firstChild.nodeValue = ("Grapes Total: $" + numFormatting(economics.dataSubcrop[year]['Mixed Fruits & Vegetables']['Grapes (Conventional)']));
  greenBeans.firstChild.nodeValue = ("Green Beans Total: $" + numFormatting(economics.dataSubcrop[year]['Mixed Fruits & Vegetables']['Green Beans']));
  squash.firstChild.nodeValue = ("Squash Total: $" + numFormatting(economics.dataSubcrop[year]['Mixed Fruits & Vegetables']['Winter Squash']));
  strawberries.firstChild.nodeValue = ("Strawberries Total: $" + numFormatting(economics.dataSubcrop[year]['Mixed Fruits & Vegetables']['Strawberries']));

  /*convCorn.firstChild.nodeValue += (" Total: $" + localStorage.getItem('convCorn'));
  consCorn.firstChild.nodeValue += (" Total: $" + localStorage.getItem('consCorn'));
  convSoy.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('convSoy'));
  consSoy.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('consSoy'));
  alfalfa.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('alf'));
  permPas.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('permPas'));
  rotGraz.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('rotGraz'));
  grassHay.firstChild.nodeValue += (" Total: $" + localStorage.getItem('grassHay'));
  prairie.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('prairie'));
  consFor.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('consFor'));
  convFor.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('convFor'));
  switchgrass.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('switchG'));
  shortRWB.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('shortRWB'));
  wetland.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('wetland'));
  mixedFaV.firstChild.nodeValue += ("  Total: $" + localStorage.getItem('mixedFruitsV'));*/
}



function changeYear(){
  var yearVal =  document.getElementById('resultsFrame').contentWindow.document.getElementById("yearSelect").value;

  placeTotalsOnBars(yearVal);
  this.parent.updateTables(generateEconTableData(yearVal));
}


function enterpriseBudgets(){
  var accordion = document.getElementById("accordionContainer");
  var enterpriseTable = document.getElementById("accordionContainer2");
  var graph = document.getElementById("graphContainer");
  //var enterpriseButton = document.getElementById("enterpriseBudgetsButton");
  if(accordion.style.display === "none"){
    enterpriseTable.style.display = "none";

     accordion.style.display = "inline-block";
    graph.style.display = "block";
    //enterpriseButton.innerHTML = "View Enterprise Budgets";
  }
  else{
    enterpriseTable.style.display = "inline-block";

     accordion.style.display = "none";
    graph.style.display = "none";
    //enterpriseButton.innerHTML = "Return to Econ Module";
  }
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
    var tempText = getInfo(thisElement.id, 0, "landName")+": "+getScoreOfLandType(thisElement.id).toFixed(1);
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

function addCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function createMockDataGraphic1(){
  var econData = economics.data;
  var dataEcon1 = econData.map
  tempData = [];
  dataEcon1 = [];
  for(var i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
  tempData[i] = econData[i].map((d, i) => {
    return {cost: d['Action - Cost Type']['total']*-1, landUse: d.landUse}
  });
    console.log(econData[i])
    tempData[i].forEach((el, j) => {
      d = {}
      d.year = i;
      d.landUse = el.landUse;
      d.Cost = el.cost;
      d.Revenue = economics.scaledRev[i][j];
      d.Profit = Math.max(d.Revenue + d.Cost, 0);
      d.Loss = Math.min(d.Revenue + d.Cost, 0);
      dataEcon1.push(d);
    });
  }
  return dataEcon1;
}
function EconomicsGraphic1() {
  //console.log(this);
  options = [];
  this.render = () => {
    svg.selectAll("*").remove();
    initOptions();
    //just delete all contents for redraw, it is a lot easier for a graph that needs to move things
    // definetely possible to do otherwise, but a little out of scope.
    drawBars();
    drawLegend();
    addOptions();
  };
  var econBody = document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic1svg');
  var econGraphic1 = document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic1');
  var colors = ["#ffde2a", '#0000ff','#33cc33','#ff0000'] //Cost, revenue, profit, loss
  var stackTypes = ['Cost','Revenue','Profit','Loss'];
  var fullData = createMockDataGraphic1();


  var margin = {top: 40, right: 20, bottom: 50, left: 80};
  var screenWidth = window.innerWidth;
  var width = screenWidth*.8 - margin.left - margin.right;
  var height = screenWidth*.40 - margin.top - margin.bottom; //give or take the golden ratio

  var groupKey = 'landUse';
  var svg = d3.select(econBody);
  svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var formatData = () => { //options are deciding what not to draw. Hiding the elements isnt sufficient since it leaves empty gaps of whitespace.
    //console.log(this);
    tempData = JSON.parse(JSON.stringify(fullData)); //deepcopy to make changes to
    data1 = tempData.filter(el => {
      if(options.indexOf(el.landUse.replace(/\s/g,'')) > -1) return false;
      if(options.indexOf(el.year) > -1) return false;
      if(options.indexOf('Cost') > -1) el.Cost = 0;
      if(options.indexOf('Revenue') > -1) el.Revenue = 0;
      if(options.indexOf('Profit') > -1) el.Profit = 0;
      if(options.indexOf('Loss') > -1) el.Loss = 0;
      return el != null;
    });

    return data1;
  }

  initOptions = () => {
    var econData = economics.data
    econData[1].forEach((lu, j) => {
      let bool = true;
      for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
        if(!(econData[i][j]["Action - Cost Type"].total === 0 && !options.includes(lu.landUse.replace(/\s/g,'')) ||
        econData[i][j]["Action - Cost Type"].total !== 0 && options.includes(lu.landUse.replace(/\s/g,'')))){
          bool = false;
        }
      }
      if(bool) alterOptions(lu.landUse.replace(/\s/g,''), true);
    });
  }

  var drawBars = () => {
    let data = formatData();

    let layers = d3.stack().keys(stackTypes) //formats data into groups, in this case we want to stack base off of cost/revenue etc...
    .offset(d3.stackOffsetDiverging)
    (data);

    var layer = svg.selectAll(".layer") //draw 1 layer at a time, we want loss and profit to drawn last so they arent covered.
    .data(layers)
    .enter().append("g")
    .attr("class", "layer")
    .attr("layernum",function(d, i) {return d.key; })
    .style("margin-left", function(d) { return "3px"; })
    .style("fill", function(d, i) { return colors[i]; })//determines color for each layer

    let x0 = d3.scaleBand() //There are 2 x functions because landUse determine 1 part of x factor and year determines the other
    .domain(data.map(function(d) {return d.landUse + ""; }))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(.1); //padding between groups

    let x = d3.scaleBand() //this one does a small adjustment based off of year
    .domain(data.map(function(d) {return d.year}))
    .rangeRound([0, x0.bandwidth()]) //note that the max is the previous x's width so it divides that piece equally
    .padding(.05); //padding between elements in the same group

    let y = d3.scaleLinear()
    .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])//determine the min and max value graph needs to show
    .rangeRound([height - margin.bottom, margin.top]);

    //following code is to add tooltips
    let tooltip = d3.select(document.getElementById('resultsFrame').contentWindow.document.getElementById("graph1tt"));

    //the following code is to add a rectangle around the hovered things
    //We cant just change the border since the border will be covered by higher layered rects
    let outlineRect = svg.append("rect")
    .attr("stroke", "black")
    .attr("stroke-width", "3px")
    .style("visibility", "hidden")
    .style("fill", "none")
    .attr("width", x.bandwidth);

    let formatMoney = (d) => { //This is to put the negative sign in front of the dollar sign
      var isNegative = d < 0 ? '-' : '';
      return isNegative + '$' + addCommas(Math.abs(d).toFixed(2));
    }
    //draws the bars as well as adding listeners for hover
    var rect = layer.selectAll("rect")
    .data(function(d) {return d; })
    .enter().append("rect")
    .attr("transform", function(d) { return "translate(" + x0(d.data.landUse) + ",0)"; })//translate using 1 of the x's
    .attr("x", function(d) {return x(d.data.year); }) //set x to the other so that when combined they get their own unique x value
    .attr("y", function(d) {if (d[1] > 0) return y(0) - (y(d[0])- y(d[1])); else return y(0); }) //if the bar is positive the height has to be considered
    .attr("width", x.bandwidth)
    .attr("height", function(d){return y(d[0])- y(d[1]);}) //this was replaced by manually drawing lines
    // .attr("d", function(d){
    //   console.log(d);
    //   return bar(x(d.data.year),y(0), x.bandwidth(),y(d[0])- y(d[1]), 10, d[1] > 0);
    // })
    .on("mouseover", function(d) {tooltip.style("visibility", "visible") //using arrow operator doesn't give right context
      tooltip.select("#econGraphic1LU").text("Land Use: " + d.data.landUse)
      let econType = this.parentNode.getAttribute("layernum")
      tooltip.select("#econGraphic1Value").text(econType +": " + formatMoney(d.data[econType]));
      outlineRect.attr("transform", "translate(" + x0(d.data.landUse) + ",0)");
      outlineRect.style("visibility", "visible");
      // outlineRect.attr("d",
        // this.attributes.d.nodeValue+'stroke = "black" stroke-width="5" fill="none"');
      outlineRect.attr("x", this.getAttribute("x"))
      outlineRect.attr("y", this.getAttribute("y"))
      outlineRect.attr("height", this.getAttribute("height"))
      outlineRect.attr("ry", this.getAttribute("ry"))
    })
    .on("mouseout", function(d) {tooltip.style("visibility", "hidden")
      outlineRect.style("visibility", "hidden")
    })
    .on("mousemove", d => {
      tooltip
      .style('left', (d3.event.pageX + 10) +"px")
      .style('top', (d3.event.pageY + 10) + "px")
    });


  //following code adds xAxis to graph
    var xAxis = svg.append("g")
    .attr("transform", "translate(0," + y(0) + ")")//y(0) will be the height x axis
    .style("font-weight", "bold")
    .call(d3.axisBottom(x0))
    svg.selectAll("g.tick")
    .selectAll("text")
    .attr("fill", "purple")
    // .attr("y", y(y.domain()[0])-y(0))
    .attr("transform", "translate(0," + (y(y.domain()[0])-y(0) - 12) +") rotate(-35)")
    .style("text-anchor", "end")

    svg.append("text")
    .attr("transform",
    "translate(" + (width/2) + " ," +
    (height + 50) + ")")
    .style("text-anchor", "left")
    .text("Land Uses");

    svg.append("text")
    .attr("transform",
    "translate(" + (width/2) + " ," +
    (25) + ")")
    .style("text-anchor", "left")
    .style("font-weight", "bold")
    .style("font-size", "1.5vmax")
    .text("Economics By Land Use");

    //following code adds yAxis to graph
    var yAxis = d3.axisLeft(y)
    .tickFormat(d => '$' + addCommas(d))
    .tickSize(-width)  //These lines are for horizontal guidelines it makes the ticks the whole width wide
    .tickSizeOuter(0)
    svg.append("g")
    .attr("transform", "translate(" + margin.left + ", 0)")
    .call(yAxis);

    svg.selectAll("g.tick")
    .style("stroke-dasharray", ("3,3"))

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Value");
  }

  var drawLegend = () => {
    legend = svg.append("g")
    .attr("transform", "translate(" + width +",0)")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
    .selectAll("g")
    .data(colors)
    .enter().append("g")
    .attr("transform", function(d, i) {return "translate(0," + (20 * i) + ")";});

    legend.append("rect")
    .attr("x", -19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", (d, i) => colors[i]);

    legend.append("text")
    .attr("x", -24)
    .attr("y", 9.5)
    .attr("dy", "0.35em")
    .text((d,i) => stackTypes[i]);

    svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Economic Data by Land Use");
  }

  var addOptions = () => { //This adds the toggle effects to the screen
    let doc = document.getElementById('resultsFrame').contentWindow.document;
    let box = doc.getElementById('econGraphic1Options');
    doc.querySelectorAll(".optionsRow").forEach(row => {
      row.parentNode.removeChild(row);
    });

    container = doc.getElementById('econGraphic1LandUses')
    economics.data[1].map(d => d.landUse).forEach(d => {
      cell = document.createElement('div');
      cell.innerHTML = d;
      cell.classList.add("optionsRow")
      checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.onclick = event => alterOptions(d.replace(/\s/g,''));
      checkBox.style.float = 'right';
      if(!options.includes(d.replace(/\s/g,''))) checkBox.checked = true;
      cell.appendChild(checkBox);
      container.appendChild(cell);
    })

    container = doc.getElementById('econGraphic1Years')
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      cell = document.createElement('div');
      cell.innerHTML = 'Year ' + i;
      cell.classList.add("optionsRow")
      checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.onclick = event => alterOptions(i);
      checkBox.style.float = 'right';
      checkBox.checked = true;
      cell.appendChild(checkBox);
      container.appendChild(cell);
    }

    container = doc.getElementById('econGraphic1Economics')
    stackTypes.forEach(type => {
      cell = document.createElement('div');
      cell.innerHTML = type;
      cell.classList.add("optionsRow")
      checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.onclick = event => alterOptions(type);
      checkBox.style.float = 'right';
      checkBox.checked = true;
      cell.appendChild(checkBox);
      container.appendChild(cell);
    });
  }

  var alterOptions = (option, skip) => { //This changes the options array to contain up to date options
    if (options.includes(option)){
      options.splice(options.indexOf(option),1);
    }
    else {
      options.push(option);
    }
    if(!skip) rerender();
  }

  var rerender = () => { //We dont want to rebuild the options when we need to render again
    svg.selectAll("*").remove();
    drawBars();
    drawLegend();
  }
}

function stackMin(layers) {
  return d3.min(layers, function(d) {
    if(d[0] < 0) return 1.1* (d[0]- d[1]);
    return 0;
  });
}

function stackMax(layers) {
  return d3.max(layers, function(d) {
    if(d[1] > 0) return 1.1 * (d[1] - d[0]);
    return 0;
  });
}

formatDataGraphic3 = () => {
  econData = economics.data3;
  econ3data = []; //{year, cost type, vallue}
  actions = new Array();
  times = new Array();
  econData.forEach((year, i) => {

    Object.keys(year.action).forEach(key => {
      d = {};
      d.year = i;
      d.costType = key;
      d.value = year.action[key];
      actions.push(d);
    });

    Object.keys(year.time).forEach(key => {
      d = {};
      d.year = i;
      d.costType = key;
      d.value = year.time[key];
      times.push(d);
    });
  });

  econ3data.push(actions);
  econ3data.push(times);
  return econ3data;
}

function EconomicsGraphic3() {

  this.options = [];
  this.render = () => {
    svg.selectAll('*').remove();
    drawBars();
    addOptions();
  };
  //action == 0 , type == 1
  var actionOrTimeCost = 0;

  var econBody = document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic3svg');
  var econGraphic1 = document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic3');
  var colors = ["#ffff4d", '#0000ff', '#33cc33', '#ff0000', '#00BFFF', '#8A2BE2', '#FF69B4', '#9ACD32', '#FF7F50', '#778899', '#A52A2A', '#ADFF2F',
    '#191970', '#FF4500', '#6B8E23', '#CD853F', '#00FA9A', '#A52A2A', '#D2B48C'
  ];
  var stackTypes = ['Cost', 'Revenue', 'Profit', 'Loss'];

  var margin = {
    top: 40,
    right: 20,
    bottom: 50,
    left: 80
  };
  var screenWidth = window.innerWidth;
  var width = screenWidth * .8 - margin.left - margin.right;
  var height = screenWidth * .40 - margin.top - margin.bottom; //give or take the golden ratio

  // this is the data that is put on the screen
  var fullData = formatDataGraphic3();
  var econData = economics.data3;

  // keys to be displayed, action by default, but is changed in toggleCostType function
  var keys = Object.keys(econData[1].action);
  var svg = d3.select(econBody);
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


  var formatData = (type) => { //options are deciding what not to draw. Hiding the elements isnt sufficient since it leaves empty gaps of whitespace.

    tempData = JSON.parse(JSON.stringify(fullData[type])); //deepcopy to make changes to
    newData = tempData.filter(el => {
      if (this.options.indexOf(el.year) > -1) return false;
      return el != null;
    });

    return newData;

  }

  var drawBars = () => {
    var dataToUse = formatData(actionOrTimeCost);
    console.log(dataToUse);

    let x0 = d3.scaleBand()
      .domain(dataToUse.map(function(d) {
        return d.costType
      }))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(.1);

    let x = d3.scaleBand()
      .domain(dataToUse.map(function(d) {
        return d.year
      }))
      .rangeRound([0, x0.bandwidth()])
      .paddingInner(.05);

    let y = d3.scaleLinear()
      .domain([0, 1.1 * Math.max.apply(Math, dataToUse.map(function(d) {
        return d.value;
      }))])
      .rangeRound([height - margin.bottom, margin.top]);

    let tooltip = d3.select(document.getElementById('resultsFrame').contentWindow.document.getElementById("graph3tt"));

    svg.selectAll("*").remove();

    svg.selectAll("g")
      .data(dataToUse)
      .enter()
      .append("rect")
      .attr("transform", d => "translate(" + x0(d.costType) + ",0)")
      .attr("x", d => x(d.year))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(Math.round(d.value)))
      .attr("fill", d => colors[keys.indexOf(d.costType)])
      .on("mouseover", function(d) {
        tooltip.style("visibility", "visible") //using arrow operator doesn't give right context
        let displayNum = addCommas(d.value.toFixed(2));
        tooltip.select("#econGraphic3Value").text("Cost: $" + displayNum);
        tooltip.select("#econGraphic3Category").text(d.costType)
      })
      .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden")
      })
      .on("mousemove", d => {
        tooltip
          .style('left', (d3.event.pageX + 10) + "px")
          .style('top', (d3.event.pageY + 10) + "px")
      });

    var xAxis = svg.append('g')
      .attr("transform", "translate(0," + y(0) + ")")
      .style("font-weight", "bold")
      .call(d3.axisBottom(x0))

    svg.selectAll("g.tick")
      .selectAll("text")
      .attr("fill", "purple")
      .attr("y", y(y.domain()[0] / 1.1) - y(0) + 7)
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end")

    var yAxis = d3.axisLeft(y)
      .tickFormat(d => '$' + addCommas(d))
      .tickSize(-width)
      .tickSizeOuter(0);
    svg.append("g")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis);

    svg.selectAll("g.tick")
      .style("stroke-dasharray", ("3,3"))

    svg.append("text")
      .attr("transform",
        "translate(" + ((width / 2) - 110) + " ," +
        (25) + ")")
      .style("text-anchor", "left")
      .style("font-weight", "bold")
      .style("font-size", "1.5vmax")
      .text("Time/Action Total Cost");

    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom + 20) + ")")
      .style("text-anchor", "left")
      .text("Cost Type")
      .attr("font-size", "1.1vmax")
      .attr("font-weight", "bold");
  }

/**
 * [toggleLandUseFromTotal description]
 * @param  {[type]} landuse [The landuse that is being toggled]
 */
  function toggleLandUseFromTotal(landuse) {
    //the data variable holds the econ data organized according to year and land use
    let data = economics.data3ByLU;
    let yearData = [];

    //year data holds the data for all active years for the current land use being toggled
    for (let i = 1; i <= boardData[currentBoard].calculatedToYear; i++) {
      yearData.push(data[i][landuse]);
    }


    // full data is altered here, full data is what is used to display the information on screen
    for (var j = 0; j < fullData[0].length; j++) {
      //check to see if this cost type exists in yearData, some just dont have certain costs
      if (yearData[fullData[0][j].year - 1]['action'][fullData[0][j].costType]) {
        fullData[0][j].value += yearData[fullData[0][j].year - 1]['toggleVal'] * yearData[fullData[0][j].year - 1]['action'][fullData[0][j].costType];

      }
    }

    for (var j = 0; j < fullData[1].length; j++) {
      if (yearData[fullData[0][j].year - 1]['time'][fullData[1][j].costType]) {
        fullData[1][j].value += yearData[fullData[0][j].year - 1]['toggleVal'] * yearData[fullData[0][j].year - 1]['time'][fullData[1][j].costType];
      }
    }

    // toggle this landuses toggleVal so that it will be toggled correctly next time
    for (let i = 0; i <= boardData[currentBoard].calculatedToYear - 1; i++) {
      yearData[i]['toggleVal'] *= -1;
    }

    // rerender so that the changes are displayed
    rerender();
  }

  var addOptions = () => { //This adds the toggle effects to the screen
    console.log(economics.data);
    let doc = document.getElementById('resultsFrame').contentWindow.document;
    let box = doc.getElementById('econGraphic3Options');
    doc.querySelectorAll(".optionsRowGraphic3").forEach(row => {
      row.parentNode.removeChild(row);
    });

    container = doc.getElementById('econGraphic3LandUses')
    economics.data[1].map(d => d.landUse).forEach(d => {
      cell = document.createElement('div');
      cell.innerHTML = d;
      cell.classList.add("optionsRowGraphic3")
      checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.style.float = 'right';
      checkBox.checked = true;
      checkBox.onclick = event => {
        alterOption(d.replace(/\s/g, ''));
        //toggles this landuse from the total
        toggleLandUseFromTotal(d);
      }
      checkBox.style.float = 'right';
      cell.appendChild(checkBox);
      container.appendChild(cell);
    })

    container = doc.getElementById('econGraphic3Years')
    for (let i = 1; i <= boardData[currentBoard].calculatedToYear; i++) {
      cell = document.createElement('div');
      cell.innerHTML = 'Year ' + i;
      cell.classList.add("optionsRowGraphic3")
      checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.onclick = event => alterOption(i);
      checkBox.style.float = 'right';
      checkBox.checked = true;
      cell.appendChild(checkBox);
      container.appendChild(cell);
    }

    /**
     * [toggleCostType description]
     * @param  {[type]} type [Action or Time cost]
     * This function changes variables around so that the correct information is displayed
     */
    function toggleCostType(type) {
      if (type == "Action") {
        actionOrTimeCost = 0;
        keys = Object.keys(econData[1].action)
      } else {
        actionOrTimeCost = 1;
        keys = Object.keys(econData[1].time)
      }

      rerender();
    }

    container = doc.getElementById('econGraphic3CostType')
    cell = document.createElement('div');
    cell.id = 'actionCheckBox';
    cell.classList.add("optionsRowGraphic3")
    cell.innerHTML = 'Action';
    checkBox = document.createElement('input');
    checkBox.type = 'radio';
    checkBox.name = 'econ3CostType';
    checkBox.onclick = event => toggleCostType('Action');
    checkBox.style.float = 'right';
    checkBox.checked = 'true';
    cell.appendChild(checkBox);
    container.appendChild(cell);

    cell = document.createElement('div');
    cell.id = "timeCheckBox"
    cell.classList.add("optionsRowGraphic3")
    cell.innerHTML = 'Time';
    checkBox = document.createElement('input');
    checkBox.type = 'radio';
    checkBox.name = 'econ3CostType';
    checkBox.onclick = event => toggleCostType('Time');
    checkBox.style.float = 'right';
    cell.appendChild(checkBox);
    container.appendChild(cell);
  }

  var alterOption = (option) => { //This changes the options array to contain up to date options
    if (this.options.includes(option)) {
      this.options.splice(this.options.indexOf(option), 1);
    } else {
      this.options.push(option);
    }
    rerender();
  }

  var rerender = () => { //We dont want to rebuild the options when we need to render again
    svg.selectAll("*").remove();
    drawBars();
  }

}






function exists(arr, search) {
    return arr.some(row => row.includes(search));
}
/**
 * Econ Module Graphic 4
 */
/**
 * Data filter for the Econ Module Graphic 4
 * @param   landUse  [description]
 * @param   costType [Action or Time cost type]
 * @param   cost     [cost type ]
 * @return         [return costname and value]
 */


function econGraphic4DisplayData(landUse,costType,cost,year){
  var econdata=economics.data4[year];

  econdata=econdata.filter(function(item){
    return item.landUse==landUse;
  });
  econdata=econdata[0].array.filter(function(item){
    return item[costType]==cost;
  });
  data4=[];
  for (var i = 0; i < econdata.length; i++) {
    if(data4.some(e=>e.costname===econdata[i]['Cost Name'])){
      objIndex = data4.findIndex((obj => obj.costname ===econdata[i]['Cost Name']));
      data4[objIndex].value+=parseFloat(econdata[i].Value);
    }else{
      data4.push({costname:econdata[i]['Cost Name'], value:parseFloat(econdata[i].Value)});
    }
  }
return data4;
 }
 /**
  * Econ Module Graphic 4 render and information
  *
  */
function EconomicsGraphic4() {
  var instance;
  var options;
  var displaydata;
  var econdata;
  var year;
  function init() {
    year=1;
    econdata=economics.data4;
    firstNotEmptyElement=econdata[year].find(e=>e!=null);
    options = [firstNotEmptyElement.landUse,"Action - Cost Type",firstNotEmptyElement['Action - Cost Type'][0]];
    // econdata=econdata[year];
    var econBody = document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic4svg');
    var econGraphic1 = document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic4');
    window = document.getElementById('resultsFrame');
    let  doc =document.getElementById('resultsFrame').contentWindow.document;
    var colors = ["#ffff4d", '#0000ff','#33cc33','#ff0000','#00BFFF','#8A2BE2','#FF69B4','#9ACD32','#FF7F50','#778899','#A52A2A','#ADFF2F',
    '#191970','#FF4500','#6B8E23','#CD853F','#00FA9A','#A52A2A','#D2B48C'];

    // scales
    var margin = {top: 40, right: 10, bottom: 60, left: 80};
    let windowWidth=window.innerWidth;
    var width = windowWidth *0.8- margin.left - margin.right;
    var height =1800*.45 - margin.top - margin.bottom; //give or take the golden ratio
    var rectWidth = 100;
    // svg element
    var svg = d3.select(econBody);
    svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /**
     * function draws bar on the chart
     */
    var drawBarsfunction=function(){

      displaydata=econGraphic4DisplayData(options[0],options[1],options[2],year);

        //scale
        var xScale = d3.scaleBand()
        	.domain(displaydata.map(function(d){ return d.costname;}))
        	.range([margin.left, width - margin.right]);
          //.padding(.1);
        var yMax = d3.max(displaydata, function(d){return d.value});
        var yScale = d3.scaleLinear()
        	.domain([0, yMax])
        	.range([height - margin.bottom, margin.top]);
        var tooltip = d3.select(document.getElementById('resultsFrame').contentWindow.document.getElementById("graph4tt"));

          // bars
        var rect = svg.selectAll('rect')
        	.data(displaydata)
        	.enter().append('rect')
        	.attr('x', function(d, i){
            return xScale(d.costname)+10})
        	.attr('y', function(d){
            return yScale(d.value)})
        	.attr('width', xScale.bandwidth()-20)
        	.attr('height', function(d){
            return height - margin.bottom - yScale(d.value)})
    			.attr('fill', function(d,i){
            return colors[i]})
          .on("mouseover",function(d){
            tooltip.style("visibility","visible");
            tooltip.select("#econGraphic4CostName").text(d.costname);
            tooltip.select('#econGraphic4Value').text("$"+addCommas(d.value.toFixed(2)));
          })
          .on("mouseout",function(){
            tooltip.style("visibility","hidden");

          })
          .on("mousemove",function(d){
            tooltip
            .style('left', (d3.event.pageX ) +"px")
            .style('top', (d3.event.pageY) + "px")
          });

        // axes
        var xAxis = d3.axisBottom()
        	.scale(xScale);
        var yAxis = d3.axisLeft(yScale)
          .tickFormat(d => '$' + addCommas(d))
        	.tickSize(-width)
          .tickSizeOuter(0);

        //cost name
        svg.append('g')
          	.attr('transform', 'translate(' + [0, height - margin.bottom] + ')')
          	.call(xAxis);
        svg.selectAll('g.tick')
            .selectAll('text')
            .attr('fill','purple')
            .attr('font-weight','bold')
            .attr('font-size','10px')
            .attr("transform", function(d) {
                return "rotate(-35) "
            })
            .attr("text-anchor", "end")
        //scale value on y axis
          svg.append('g')
          	.attr('transform', 'translate(' + margin.left + ',0)')
          	.call(yAxis);
          svg.selectAll("g.tick")
           .style("stroke-dasharray", ("3,3"))

        //grahic chart name on the top
          svg.append("text")
             .attr("transform",
               "translate(" + ((width/2)-110) + " ," +
               (25) + ")")
             .style("text-anchor", "left")
             .style("font-weight", "bold")
             .style("font-size", "1.5vmax")
             .text("Cost($) vs Line Items/Individual Costs");

        //display cost name title on bottom
           svg.append("text")
               .attr("transform",
                 "translate(" + (width/2) + " ," +
                 (height+margin.bottom+20) + ")")
               .style("text-anchor", "left")
               .text("Line Items/Individual Costs")
               .attr("font-size","1.1vmax")
               .attr("font-weight","bold");

        //display value title on y axis
           svg.append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 0)
               .attr("x", 0 - (height / 2))
               .attr("dy", "1em")
               .style("text-anchor", "middle")
               .text("Cost ($)")
               .attr("font-size","1.1vmax")
               .attr("font-weight","bold");
        }

        /**
         * display the land use, action,time cost type
         */
        var addOptions=function(){
          // selection dropdown menu for cost type
          var selectedType=function(costType,option,name){
            optionCLick(costType,option);
            doc.getElementById("econGraphic4ActionType").style.display='none';
            doc.getElementById("econGraphic4TimeType").style.display='none';
            doc.getElementById(name).style.display='block';
          }

          landuseOption();
          //option for action, time type selection
          costSelector=doc.getElementById('costSelector');
          costSelector.innerHTML="";
          typeSelection=document.createElement('select');
          //typeSelection.style.width="100%";
          option1=document.createElement('option');
          option1.value='Action';
          option1.innerHTML='Action - Cost Type';
          option1.onclick=event=>selectedType(option1.innerHTML,1,"econGraphic4ActionType");
          option2=document.createElement('option');
          option2.value='Time';
          option2.innerHTML='Time - Cost Type';
          option2.onclick=event=>selectedType(option2.innerHTML,1,"econGraphic4TimeType");
          typeSelection.appendChild(option1);
          typeSelection.appendChild(option2);
          costSelector.appendChild(typeSelection);

          createCostOption();

    }
    function landuseOption(){
      //land use input radio type
      container=document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic4LandUses');
      container.innerHTML='';
      cell=document.createElement('div');
      cell.innerHTML='Land Use';
      cell.className='graphic4landuse';
      container.append(cell);
      econdata[year].map(d=>d.landUse).forEach((d)=>{
        cell=document.createElement('div');
        cell.innerHTML=d;
        cell.className="graphic4option";
        inputbox=document.createElement('input');
        inputbox.name="landuseoption";
        if(d==options[0]){
          inputbox.checked=true;
        }
        inputbox.type='radio';
        inputbox.style.float='right';
        inputbox.onclick=function(event){optionCLick(d,0);createCostOption()};
        cell.appendChild(inputbox);
        container.append(cell);
      });
    }
    //create Action, time cost type list
    function createCostOption(){
      costContainer=doc.getElementById('econGraphic4CostOption');

      var costTypeList=econdata[year].filter(function(item){
        return item.landUse==options[0];
      });
      costTypeListAction=costTypeList[0]['Action - Cost Type'];
      costTypeContainer=doc.getElementById("econGraphic4ActionType");
      costTypeContainer.innerHTML="";
      costTypeListAction.forEach(d=>{

        input=createInputbox('div',d,'input','econ4ActioncostType',d,2);
        costTypeContainer.appendChild(input);
      });
      costContainer.append(costTypeContainer);

      costTypeListTime=costTypeList[0]['Time - Cost Type'];
      costTypeContainer=doc.getElementById("econGraphic4TimeType");
      costTypeContainer.innerHTML="";
      costTypeListTime.forEach(d=>{
        input=createInputbox('div',d,'input','econ4TimecostType',d,2);
        costTypeContainer.appendChild(input);
      });
      costContainer.append(costTypeContainer);
    }
    function yearOption(){
      container=doc.getElementById('econGraphic4Year');
      container.innerHTML="";
      cell=document.createElement('div');
      cell.innerHTML="Year";
      cell.className="graphic4landuse";
      container.appendChild(cell);
      for(let i=1;i<=boardData[currentBoard].calculatedToYear;i++){
        cell=document.createElement('div');
        cell.innerHTML="Year "+i;
        cell.className="grahpic4YearSelection";
        inputbox=document.createElement('input');
        inputbox.name="graphic4YearInputBox";
        if(i==1){
          inputbox.checked=true;
        }
        inputbox.type='radio';
        inputbox.style.float='right';
        inputbox.onclick=event=>yearClick(i);
        cell.append(inputbox);
        container.appendChild(cell);
      }
    }

    //create input box html
    function createInputbox(tag,innerhtml,inputTag,name,d,i){
      cell=document.createElement(tag);
      cell.innerHTML=innerhtml;
      cell.className="graphic4option"
      inputbox=document.createElement(inputTag);
      inputbox.name=name;
      inputbox.type='radio';
      if(d==options[2]){
        inputbox.checked=true;
      }
      inputbox.style.float='right';
      inputbox.onclick=event=>optionCLick(d,i);
      cell.appendChild(inputbox);
      return cell;
    }
    var yearClick=function(i){
      year=i;
      console.log(i);
      console.log(options);
      landuseOption();
    }
    //option selection
    var optionCLick=function(d,i){
      options[i]=d;
        rerender();
    }
    //rerender the bar on the chart
    var rerender=function(){
      svg.selectAll("*").remove();
      drawBarsfunction();
    }
    //render the first time
    var render = function (){
      svg.selectAll("*").remove();
      drawBarsfunction();
      yearOption();
      doc.getElementById("econGraphic4ActionType").style.display='block';
      doc.getElementById("econGraphic4TimeType").style.display='none';
      addOptions();
    }

    return {
      render: render,
    };
  };
  return {
    getInstance: function () { //To ensure singularity
      if ( !instance ) {
        instance = init();
      }
      return instance;
    }
  };
}


/**
 * Grahpic 5 time of year, total labors cost, total custom hire cost, total labor hours
 * @param  {[type]} econdata [data from economics.js]
 * @return data
 */
function graphic5DisplayInfo(econdata){
  var data=[];
  var twiceAMonth=["Early Jan.","Late Jan.","Early Feb.","Late Feb.",
                  "Early Mar.","Late Mar.","Early Apr.","Late Apr.",
                  "Early May","Late May","Early Jun.","Late Jun.",
                  "Early Jul.","Late Jul.","Early Aug.","Late Aug.",
                  "Early Sept.","Late Sept.","Early Oct.","Late Oct.",
                  "Early Nov.","Late Nov.","Early Dec.","Late Dec."];
  for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
  var month=0;
  data[i]=[];
  econdata[i].forEach(landuse=>{
    landuse['array'].forEach(d=>{
      if(data[i].some(e=>e.time_of_year===d['Time of Year'])){
        objIndex = data[i].findIndex((obj => obj.time_of_year ===d['Time of Year']));
        if(d['# Labor Hours']!=""){
          data[i][objIndex]["Total Labor Hours"]+=parseFloat(d['# Labor Hours']);
        }
        if(d['Action - Cost Type']=='Custom'){
          data[i][objIndex]["Total Custom Hire Cost"]+=parseFloat(d['Value']);
        }
        data[i][objIndex]["Total Labor Cost"]+=parseFloat(d['Value']);
      }else{
        var totalCustomHireCost=0;
        if(d['Action - Cost Type']=='Custom'){
          totalCustomHireCost=parseFloat(d['Value']);
        }
        data[i].push({time_of_year:d['Time of Year'],twiceAMonth:twiceAMonth[month++],
        "Total Labor Hours":parseFloat(d['# Labor Hours']),"Total Labor Cost":parseFloat(d['Value']),"Total Custom Hire Cost":totalCustomHireCost})
      }
    })
  });
  data[i]=data[i].filter(function(d){
    return d.time_of_year>0;
  });
}
  return data;
}

/**
 * economics modules graphic 5
 * y axis- value -total labor cost and total custom labor cost range
 *       - hours - total labor Hours range
 * x axis- twice a month with three cluster
 */
function EconomicsGraphic5(){
  var instance;
  var econdata;
  var displaydata;
  var displaykey=["Total Labor Hours","Total Labor Cost","Total Custom Hire Cost"];
  var keys=["Total Labor Hours","Total Labor Cost","Total Custom Hire Cost"];
  var legendText=["Total Labor Hours","Total Labor Cost","Total Custom Hire Cost"];
  //var lineSelection=[""]
  var lineSelectionCheckbox=[true,true,true];
  var barSelectionCheckbox=[true,true,true];
  var selectOption=1;

  /**
   * initialize the svg and draw bar and line
   */
  function init(){
    econdata=economics.data5;
    var econBody= document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic5svg');
    var colors = d3.scaleOrdinal().range(["#3182bd", '#e6550d','#31a354']);
    var lineColor=["#3182bd", '#e6550d','#31a354'];
    var lineColorScale=d3.scaleOrdinal().range(lineColor);
    var lineStrokeDashArray=[[0],[15],[1,7]];
    var lineStrokeDashArrayScale=d3.scaleOrdinal().range(lineStrokeDashArray);


    //scale
    var margin={top:60,right:10,bottom:60,left:80};
    let windowWidth=window.innerWidth;
    var width = windowWidth *0.84- margin.left - margin.right;
    var height =1800*.45 - margin.top - margin.bottom; //give or take the golden ratio
    var rectWidth = 100;

    //svg
    var svg = d3.select(econBody);
    svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height+30)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    /**
     * function draws bar on the chart
     */
     var drawBarsfunction=function(){
         displaydata=graphic5DisplayInfo(econdata);
         displaydata=displaydata[selectOption];

         //scale
         let x0=d3.scaleBand()
         .domain(displaydata.map(d=>d.twiceAMonth))
         .range([margin.left,width-margin.right])
         .padding(.1);

         let x1=d3.scaleBand()
         .domain(keys)
         .rangeRound([0,x0.bandwidth()])
         .padding(.05);

         let yleft=d3.scaleLinear()
         .domain([0, d3.max(displaydata, d => d3.max(keys, key => d[key]))])
         .rangeRound([height-margin.bottom,margin.top]);

         let yright=d3.scaleLinear()
         .domain([0,d3.max(displaydata,d=>d[keys[0]])])
         .rangeRound([height-margin.bottom,margin.top]);

         //tooltip hover effect
         var tooltip=d3.select(document.getElementById('resultsFrame').contentWindow.document.getElementById("graph5tt"));

         //draw bars (three cluster)
         svg.append('g')
          .selectAll('g')
          .data(displaydata)
          .enter()
          .append('g')
          .attr('transform', d => 'translate(' + x0(d.twiceAMonth) + ',0)')
          .selectAll('rect')
          .data(d=>displaykey.map(key=>{
            return {key:key, value:d[key]}
          }))
          .enter().append('rect')
          .attr('x',d=>x1(d.key))
          .attr('y',d=>{
            if(d.key=="Total Labor Hours"){
              return yright(d.value);
            }
            return yleft(d.value);
          })
          .attr('width', x1.bandwidth())
          .attr('height', d =>{
            if(d.key=="Total Labor Hours"){
              return yright(0)-yright(d.value);
            }
            return yleft(0) - yleft(d.value);
          })
          .attr('fill',d=>colors(d.key))
          .on("mouseover",function(d){
            tooltip.style('visibility','visible');
            tooltip.select("#econGraphic5Name").text(d.key);
            tooltip.select("#econGraphic5Value").text('$' + addCommas(d.value.toFixed(2)));
          })
          .on("mouseout",function () {
              tooltip.style('visibility','hidden');
          })
          .on("mousemove",function(){
            tooltip.style('left',(d3.event.pageX)+"px")
                    .style('top',(d3.event.pageY)+"px")
          });

        //total labor hours line
        for(let i=0;i<keys.length;i++){
          if(lineSelectionCheckbox[i]){
           var lineHours=d3.line()
             .x(d=>x0(d.twiceAMonth)+x1(keys[i])+6)
             .y(d=>{
               return (keys[i]=="Total Labor Hours")?yright(d[keys[i]]):yleft(d[keys[i]]);
             })
             .curve(d3.curveMonotoneX);

           svg.append('path')
             .attr("class","lineHours")
             .attr("d",lineHours(displaydata))
             .attr("stroke", lineColor[i])
             .attr("stroke-width", 3)
             .attr("fill", "none")
             .style("stroke-dasharray", lineStrokeDashArray[i])
             .attr("stroke-linecap","round");
         }
        }

        //x and y axis
       var xAxis = d3.axisBottom()
         .scale(x0);
       var yAxisLeft = d3.axisLeft(yleft)
        .tickFormat(d => '$' + addCommas(d))
       var yAxisRight=d3.axisRight(yright);
         //cost name and scale x axis
          svg.append('g')
            	.attr('transform', 'translate(' + [0, height - margin.bottom] + ')')
            	.call(xAxis);
          svg.selectAll('g.tick')
              .selectAll('text')
              .attr('fill','purple')
              .attr('font-weight','bold')
              .attr('font-size','10px')
              .attr("transform", function(d) {
                return "rotate(-35) "
            })
            .attr("text-anchor", "end");


          //scale value on y axis
          svg.append('g')
            	.attr('transform', 'translate(' + margin.left + ',0)')
            	.call(yAxisLeft);
          svg.append('g')
            .attr('transform','translate(' +width + ',0)')
            .attr('class','yAxisRight')
            .call(yAxisRight);

          //text on top, bottom, x axis, y axis
           svg.append("text")
              .attr("transform",
                "translate(" + (width/2) + " ," +
                  (height) + ")")
              .style("text-anchor", "left")
              .style("font-weight", "bold")
              .attr("font-size","1.1vmax")
              .text("Time");
          svg.append("text")
            .attr("transform",
              "translate(" + (width/2-50) + " ," +
                (25) + ")")
            .style("text-anchor", "left")
            .style("font-weight", "bold")
            .style("font-size", "1.5vmax")
            .text("Labor Demand Over Calendar Year");
          svg.append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 0)
             .attr("x", 0 - (height / 2))
             .attr("dy", "1em")
             .style("text-anchor", "middle")
             .attr("font-size","1.1vmax")
             .attr("font-weight","bold")
             .text("Cost ($)");
           svg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", width+margin.right+35)
              .attr("x", 0 - (height / 2))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .attr("font-size","1.1vmax")
              .attr("font-weight","bold")
              .text("Time (Hours)");
     }
     /**
      * draw legend on svg
      */
     var drawLegend=function(){
         legend = svg.append("g")
              .attr("transform", "translate(" +[width-50,margin.top]+")")
              .attr("text-anchor", "end")
              .attr("font-family", "sans-serif")
              .attr("font-size", 15)
              .selectAll("g")
              .data(legendText)
              .enter().append("g")
              .attr("transform", function(d, i) {return "translate(0," + (20 * i) + ")";});
        legend.append('rect')
          .attr("x",20)
          .attr("width",19)
          .attr("height",19)
          .attr("fill",colors);

        legend.append("text")
          .attr("x",18)
          .attr("y",9.5)
          .attr("dy","0.35em")
          .text(d=>d);

          linelegend=svg.append("g")
              .attr("transform", "translate(" +[width-50,margin.top+60]+")")
              .attr("text-anchor", "end")
              .attr("font-family", "sans-serif")
              .attr("font-size", 15)
              .selectAll("g")
              .data(legendText)
              .enter().append("g")
              .attr("transform", function(d, i) {return "translate(" + [0,20*i] + ")";});

        linelegend.append("line")//making a line for legend
          .attr("x1", 20)
          .attr("x2",45)
          .attr("y1", 5)
          .attr("y2", 15)
          .style("stroke-dasharray",lineStrokeDashArrayScale)//dashed array for line
          .style("stroke",lineColorScale)
          .style("stroke-width",3)
          .attr("stroke-linecap","round");

          linelegend.append("text")
            .attr("x",18)
            .attr("y",9.5)
            .attr("dy","0.35em")
            .text(d=>d+" Line");

     }
     /**
      * option year and line selection
      */
     var addOptions=function(){
       //year
       let doc=document.getElementById('resultsFrame').contentWindow.document;
       container= document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic5Year');
       container.innerHTML="";
       cell=document.createElement('div');
       cell.innerHTML='Year';
       cell.className='graphic5Year';
       container.append(cell);
       for(let i=1;i<=boardData[currentBoard].calculatedToYear;i++){
         cell=document.createElement('div');
         cell.innerHTML="Year "+i;
         cell.className="graphic5YearSelection";
         inputbox=document.createElement('input');
         inputbox.name="yearOption";
         if(i==1){
           inputbox.checked=true;
         }
         inputbox.type='radio';
         inputbox.style.float='right';
         inputbox.onclick=event=>optionYearClick(i);
         cell.append(inputbox);
         container.append(cell);
       }
       //line selection
       container= document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic5Line');
       container.innerHTML="";
       cell=document.createElement('div');
       cell.innerHTML='Line Selection';
       cell.className='graphic5LineSelection';
       container.append(cell);
       keys.map((k,i)=>{
         cell=document.createElement('div');
         cell.innerHTML=k+" Line";
         cell.className="graphic5lineOption";
         checkBox=document.createElement('input');
         checkBox.type='checkbox';
         checkBox.style.float='right';
         checkBox.onclick= event=> lineSelection(i);
         checkBox.checked=true;
         cell.appendChild(checkBox);
         container.appendChild(cell);
       });

       //bar selection
        container= document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic5Bar');
        container.innerHTML="";
        cell=document.createElement('div');
        cell.innerHTML='Bar Selection';
        cell.className='graphic5LineSelection';
        container.append(cell);
        keys.map((k,i)=>{
          cell=document.createElement('div');
          cell.innerHTML=k+" Bar";
          cell.className="graphic5lineOption"
          checkBox=document.createElement('input');
          checkBox.type='checkbox';
          checkBox.style.float='right';
          checkBox.checked=true;
          checkBox.onclick= event=> barSelection(i);
          cell.appendChild(checkBox);
          container.appendChild(cell);
        });
     }
     /**
      * switching year
      * @param  {[type]} i [index]
      */
     var optionYearClick = (i) => {
       selectOption=i;
       rerender();
     }
     var barSelection=(i)=>{
       barSelectionCheckbox[i]=!barSelectionCheckbox[i];
       if( !barSelectionCheckbox[i]){
         displaykey[i]=""
       }else{
         displaykey[i]=keys[i];
       }
       rerender();
     }
     /**
      * line selection
      * @param  {[type]} i [index]
      */
     var lineSelection=(i)=>{
       lineSelectionCheckbox[i]=!lineSelectionCheckbox[i];
       rerender();
     }
    var render=function() {
      svg.selectAll("*").remove();
      drawBarsfunction();
      drawLegend();
      addOptions();
    }
    var rerender=function(){
      svg.selectAll("*").remove();
      drawBarsfunction();
      drawLegend();
    }
    return{
      render:render,
    };
  }
  return{
    getInstance:function(){
      if(!instance){
        instance=init();
      }
      return instance;
    }
  };
}
// objIndex = data.findIndex((obj => obj.costname ===econdata[i]['Cost Name']));
// data[objIndex].value+=parseFloat(econdata[i].Value);

createMockDataGraphic2 = (year, currentSelection) =>{
}

function EconomicsGraphic2(){
  var econBody = document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic2svg');
  var econGraphic2 = document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic2');
  var colors = ["#ffff4d", '#0000ff','#33cc33','#ff0000','#00BFFF','#8A2BE2','#FF69B4','#9ACD32','#FF7F50','#778899','#A52A2A','#ADFF2F',
  '#191970','#FF4500','#6B8E23','#CD853F','#00FA9A','#A52A2A','#D2B48C'];
  var costCategories = ["Action - Cost Type", "Time - Cost Type"];
  var currentSelection = "Action - Cost Type"
  var year = currentYear;
  var tooltip = d3.select(document.getElementById('resultsFrame').contentWindow.document.getElementById("graph2tt"));

  var margin = {top: 40, right: 10, bottom: 60, left: 80};
  var screenWidth = window.innerWidth;
  var width = screenWidth*.8 - margin.left - margin.right;
  var height = screenWidth*.40 - margin.top - margin.bottom; //give or take the golden ratio
  var x0, x, y, fullData, data, keys; //initialize some variables so that they may be truly initialized in one function and accessed in a nother
  var options = [];

  var alterOptions = (option, skip) =>{ //This changes the options array to contain up to date options
    if (options.includes(option)){
      options.splice(options.indexOf(option),1);
    }
    else {
      options.push(option);
    }
    if(!skip) this.rerender();
  }

  svg = d3.select(econBody);
  svg
  .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  scaleSetUp = () => {
    x0 = d3.scaleBand()
      .domain(data.map(function(d) {return d.landUse + ""; }))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(.1);

    x = d3.scaleBand()
      .domain(data.map(function(d) {return d.type;}))
      .rangeRound([0, x0.bandwidth()])
      .padding(.05);

    y = d3.scaleLinear()
      .domain([0, 1.1*Math.max.apply(Math, data.map(function(d) { return d.value;}))])
      .rangeRound([height - margin.bottom, margin.top]);
  }

  initOptions = () => {
    var econData = economics.data[year]
    econData.forEach(lu => {
      if(lu["Action - Cost Type"].total === 0 && !options.includes(lu.landUse.replace(/\s/g,'')) ||
      lu["Action - Cost Type"].total !== 0 && options.includes(lu.landUse.replace(/\s/g,''))){
        alterOptions(lu.landUse.replace(/\s/g,''), true);
      }
    });
  }

  readyData = () => {
    fullData = [];
      var econData = economics.data[year]
      econData.forEach(lu => {
        arr = Object.keys(lu[currentSelection])
        arr.splice(0,1)
        arr.forEach(type => {
          d = {};
          d.landUse = lu.landUse;
          d.type = type;
          d.value = lu[currentSelection][type];
          fullData.push(d)
        })
      })
    keys = economics.data[1][currentSelection];
  }

  applyOptions = () => {
    tempData = JSON.parse(JSON.stringify(fullData)); //deepcopy to make changes to
    data = tempData.filter(el => {
      if(options.indexOf(el.landUse.replace(/\s/g,'')) > -1) return false;
      if(options.indexOf(el.type.replace(/\s/g,'')) > -1) return false;
      return true;
    });
  }

  svg = d3.select(econBody);

  this.render = () => {
    svg.selectAll("*").remove();
    readyData();
    initOptions();
    addOptions();
    applyOptions();
    scaleSetUp();
    addBars();
    addLegend();
    addAxes();
    addTitle();
  }

  this.rerender = () => {
    svg.selectAll("*").remove();
    readyData();
    applyOptions();
    scaleSetUp();
    addBars();
    addLegend();
    addAxes();
    addTitle();
    addOptions();
  }

  var addBars = () => {

    svg.selectAll("g")
      .data(data)
      .enter()
      .append("rect")
        .attr("transform", d => "translate(" +x0(d.landUse) + ",0)")
        .attr("x", d => x(d.type))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .attr("fill", d => colors[keys.indexOf(d.type)])
        .on("mouseover", function(d) {
          tooltip.style("visibility", "visible") //using arrow operator doesn't give right context
          tooltip.select("#econGraphic2LU").text("Land Use: " + d.landUse)
          // let econType = this.parentNode.getAttribute("layernum")
          tooltip.select("#econGraphic2Value").text(d.type + " Cost: $" + addCommas((d.value).toFixed(2)))
          outlineRect.attr("transform", "translate(" + x0(d.landUse) + ",0)")
          outlineRect.style("visibility", "visible")
          outlineRect.attr("x", this.getAttribute("x"))
          outlineRect.attr("y", this.getAttribute("y"))
          outlineRect.attr("height", this.getAttribute("height"))})
          .on("mousemove", d => {
            tooltip
            .style('left', (d3.event.pageX + 10) +"px")
            .style('top', (d3.event.pageY + 10) + "px")
          })
          .on("mouseout", function(d) {
            tooltip.style("visibility", "hidden")
            outlineRect.style("visibility", "hidden")
          });

    var outlineRect = svg.append("rect")
    .attr("stroke", "black")
    .attr("stroke-width", "2px")
    .style("visibility", "hidden")
    .style("fill", "none")
    .attr("width", x.bandwidth);
  }

  var addLegend = () =>{
    legend = svg.append("g")
      .attr("transform", "translate(" + width +",0)")
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 15)
    .selectAll("g")
      .data(keys)
      .enter().append("g")
    .attr("transform", function(d, i) {return "translate(0," + (20 * i) + ")";});

    legend.append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", (d, i) => colors[i]);

    legend.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text((d,i) => keys[i]);
  }

  var addAxes = () =>{
    console.log("here");
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + y(0) + ")")//y(0) will be the height x axis
      .style("font-weight", "bold")
      .call(d3.axisBottom(x0))
    svg.selectAll("g.tick")
      .selectAll("text")
        .attr("fill", "purple")
        .attr("y", y(y.domain()[0]/1.1)-y(0) + 7)
        .attr("transform", "rotate(-35)")
        .style("text-anchor", "end")

    var yAxis = d3.axisLeft(y)
      .tickFormat(d => '$' + addCommas(d))
      .tickSize(-width)  //These lines are for horizontal guidelines it makes the ticks the whole width wide
      .tickSizeOuter(0)
    svg.append("g")
      .attr("transform", "translate(" + margin.left + ", 0)")
      .call(yAxis);

    svg.selectAll("g.tick")
      .style("stroke-dasharray", ("3,3"))
  }

  var addTitle = () => {
    svg.append("text")
      .attr("transform",
        "translate(" + (width/2) + " ," +
        (25) + ")")
      .style("text-anchor", "left")
      .style("font-weight", "bold")
      .style("font-size", "1.5vmax")
      .text("Cost by " + currentSelection);
  }

  var addOptions = () => {
    let doc = document.getElementById('resultsFrame').contentWindow.document;
    container = doc.getElementById('econGraphic2LandUses')
    container.querySelectorAll(".optionsRow").forEach(row =>{
      row.parentNode.removeChild(row);
    })

    economics.data[1].map(d => d.landUse).forEach(d => {
      cell = document.createElement('div');
      cell.innerHTML = d;
      cell.classList.add("optionsRow")
      checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.onclick = event => alterOptions(d.replace(/\s/g,''));
      checkBox.style.float = 'right';
      if(!options.includes(d.replace(/\s/g,''))) checkBox.checked = true;
      cell.appendChild(checkBox);
      container.appendChild(cell);
    })
    container = doc.getElementById('econGraphic2Cats')
    container.querySelectorAll(".optionsRow").forEach(row =>{
      row.parentNode.removeChild(row);
    })
    doc.querySelectorAll("BR").forEach(row => {
      row.parentNode.removeChild(row);
    });
    costCategories.forEach(d => {
      cell = document.createElement('div');
      cell.innerHTML = d;
      cell.classList.add("optionsRow")
      checkBox = document.createElement('input');
      if(d === currentSelection) checkBox.checked = true;
      checkBox.type = 'radio';
      checkBox.name = 'econGraph2CostType';
      checkBox.onclick = event => {
        currentSelection = d;
        this.rerender()};
      checkBox.style.float = 'right';
      cell.appendChild(checkBox);
      container.appendChild(cell);
    })
    if(boardData[currentBoard].calculatedToYear > 1){
      container.appendChild(document.createElement('BR'))
      for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
        cell = document.createElement('div');
        cell.innerHTML = 'Year ' + i;
        cell.classList.add("optionsRow")
        checkBox = document.createElement('input');
        checkBox.type = 'radio';
        checkBox.name = 'econGraph2Year';
        checkBox.onclick = event => {
          year = i;
          initOptions();
          this.rerender();
        }
        checkBox.style.float = 'right';
        if(i === year) checkBox.checked = true;
        cell.appendChild(checkBox);
        container.appendChild(cell);
      }
    }
    container = document.getElementById('resultsFrame').contentWindow.document.getElementById('econGraphic2Types')
    container.querySelectorAll(".optionsRow").forEach(row => {
      row.parentNode.removeChild(row);
    });

    keys.forEach(d => {
      cell = document.createElement('div');
      cell.innerHTML = d;
      cell.classList.add("optionsRow")
      checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.onclick = event => alterOptions(d.replace(/\s/g,''));
      checkBox.style.float = 'right';
      if(!options.includes(d)) checkBox.checked = true;
      cell.appendChild(checkBox);
      container.appendChild(cell);
    })
  }
}

formatMoney = function(d){ //This is to put the negative sign in front of the dollar sign
  var isNegative = d < 0 ? '-' : '';
  return isNegative + '$' + Math.abs(d);
}
