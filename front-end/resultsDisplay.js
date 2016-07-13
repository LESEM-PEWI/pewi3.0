//displayResults writes the html for the results iframe with updates results from Totals
function displayResults() {

    toMetricFactorArea = 2.471;
    var upToYear = boardData[currentBoard].calculatedToYear;

    //document.getElementById('resultsFrame').contentWindow.document.getElementById('contents').innerHTML = "WORKS";
    var nameArray = ["Conventional Corn Area", "Conservation Corn Area", "Conventional Soybean Area", "Conservation Soybean Area",
        "Mixed Fruits and Vegetables Area", "Permanent Pasture Area", "Rotational Grazing Area", "Grass Hay Area",
        "Switchgrass Area", "Prairie Area", "Wetland Area", "Alfalfa Area", "Conventional Forest Area",
        "Conservation Forest Area", "Short Rotation Woody Bioenergy Area"
    ];
    var testArray = ["conventionalCorn", "conservationCorn", "conventionalSoybean",
        "conservationSoybean", "mixedFruitsVegetables", "permanentPasture", "rotationalGrazing", "grassHay",
        "switchgrass", "prairie", "wetland", "alfalfa", "conventionalForest",
        "conservationForest", "shortRotationWoodyBioenergy"
    ];

    var string2 = "";

    string2 += "<table class='resultsTable'>";

    //add header row

    string2 += "<tr class='tableHeading'> <th> Land Use Category </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Percentage</th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Units (Metric) </th>";

    string2 += "</tr>";

    for (var l = 0; l < testArray.length; l++) {


        switch (l) {
            case 0:
                string2 += "<tr class='tableHeading'><td><b>Annual Grain</b></td></tr>";
                break;
            case 2:
                string2 += "<tr class='tableHeading'><td><b>Annual Legume</b></td></tr>";
                break;
            case 4:
                string2 += "<tr class='tableHeading'><td><b>Mixed Fruits and Vegetables</b></td></tr>";
                break;
            case 5:
                string2 += "<tr class='tableHeading'><td><b>Pasture</b></td></tr>";
                break;
            case 7:
                string2 += "<tr class='tableHeading'><td><b>Perrenial Herbaceous (non-pasture)</b></td></tr>";
                break;
            case 11:
                string2 += "<tr class='tableHeading'><td><b>Perrenial Legume</b></td></tr>";
                break;
            case 12:
                string2 += "<tr class='tableHeading'><td><b>Perrenial Wooded</b></td></tr>";
                break;

        } //end switch

        string2 += "<tr>";

        string2 += "<td>" + nameArray[l] + "</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "LandUse";
            string2 += (Math.round(Totals.landUseResults[y][tempString] / Totals.totalArea * 100 * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        string2 += "<td>percent</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "LandUse";
            string2 += (Math.round(Totals.landUseResults[y][tempString] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        string2 += "<td>acres</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "LandUse";
            string2 += (Math.round(Totals.landUseResults[y][tempString] / toMetricFactorArea * 10) / 10) + "<br>";

            string2 += "</td>";

        } //for each year
        string2 += "<td>hectares</td></tr>";


    }

    string2 += "</table><br>";


    //===================================================
    //update second table


    nameArray = ["Game Wildlife", "Biodiversity", "Carbon Sequestration", "Erosion Control / Gross Erosion",
        "Nitrate Pollution Control <br> / In-Stream Concentration", "Phosphorus Pollution Control <br> / In-Stream Loading",
        "Sediment Control <br> / In-Stream Delivery"
    ];
    testArray = ["gameWildlifePoints", "biodiversityPoints", "carbonSequestration", "grossErosion", "nitrateConcentration",
        "phosphorusLoad", "sedimentDelivery"
    ];
    conversionArray = [1, 1, 0.90718474, 0.90718474, 1, 1, 0.90718474, 0.90718474];

    string2 += "<table class='resultsTable'>";

    //add header row

    string2 += "<tr class='tableHeading'> <th> Ecosystem Service Indicator <br> / Measurement </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Score</th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Units (English) </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th>Units (Metric) </th>";

    string2 += "</tr>";


    for (var l = 0; l < testArray.length; l++) {


        switch (l) {
            case 0:
                string2 += "<tr class='tableHeading'><td><b>Habitat</b></td></tr>";
                break;
            case 2:
                string2 += "<tr class='tableHeading'><td><b>Soil Quality</b></td></tr>";
                break;
            case 4:
                string2 += "<tr class='tableHeading'><td><b>Water Quality</b></td></tr>";
                break;
        } //end switch

        string2 += "<tr>";

        string2 += "<td>" + nameArray[l] + "</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "Score";
            string2 += (Math.round(Totals[tempString][y] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        string2 += "<td>(out of 100)</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l];
            string2 += (Math.round(Totals[tempString][y] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        if (l < 2) string2 += "<td>pts</td>";
        if (2 <= l && l < 4) string2 += "<td>tons</td>";
        if (4 <= l && l < 5) string2 += "<td>ppm</td>";
        if (5 <= l && l < 8) string2 += "<td>tons</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l];
            string2 += (Math.round(Totals[tempString][y] * conversionArray[l] * 10) / 10) + "<br>";

            string2 += "</td>";

        } //for each year

        if (l < 2) string2 += "<td>pts</td>";
        if (2 <= l && l < 4) string2 += "<td>Mg</td>";
        if (4 <= l && l < 5) string2 += "<td>mg/L</td>";
        if (5 <= l && l < 8) string2 += "<td>Mg</td>";
    }


    //Finally, add the yeild results to the table...

    nameArray = ["Corn Grain", "Soybeans", "Mixed Fruits and Vegetables", "Cattle", "Alfalfa Hay", "Grass Hay",
        "Switchgrass Biomass", "Wood", "Short Rotation Woody Biomass"
    ];

    testArray = ["cornGrainYield", "soybeanYield", "mixedFruitsAndVegetablesYield", "cattleYield",
        "alfalfaHayYield", "grassHayYield", "switchgrassYield", "woodYield", "shortRotationWoodyBiomassYield"
    ];
    conversionArray = [0.0254, 0.0254, 0.90718474, 1, 0.90718474, 0.90718474, 0.90718474, 0.002359737, 0.90718474];

    for (var l = 0; l < testArray.length; l++) {


        switch (l) {
            case 0:
                string2 += "<tr class='tableHeading'><td><b>Yield</b></td></tr>";
                break;
        } //end switch

        string2 += "<tr>";

        string2 += "<td>" + nameArray[l] + "</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l] + "Score";
            string2 += (Math.round(Totals[tempString][y] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        string2 += "<td>(out of 100)</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l];
            string2 += (Math.round(Totals.yieldResults[y][tempString] * 10) / 10) + "<br>";

            string2 += "</td>";
        } //for each year

        if (l < 2) string2 += "<td>bu</td>";
        if (l == 2) string2 += "<td>tons</td>";
        if (l == 3) string2 += "<td>animals</td>";
        if (4 <= l && l < 7) string2 += "<td>tons</td>";
        if (l == 7) string2 += "<td>board-ft</td>";
        if (l == 8) string2 += "<td>tons</td>";

        for (var y = 1; y <= upToYear; y++) {
            string2 += "<td>";

            var tempString = testArray[l];
            string2 += (Math.round(Totals.yieldResults[y][tempString] * conversionArray[l] * 10) / 10) + "<br>";

            string2 += "</td>";

        } //for each year

        if (l < 2) string2 += "<td>Mg</td>";
        if (l == 2) string2 += "<td>Mg</td>";
        if (l == 3) string2 += "<td>animals</td>";
        if (4 <= l && l < 7) string2 += "<td>Mg</td>";
        if (l == 7) string2 += "<td>m^3</td>";
        if (l == 8) string2 += "<td>Mg</td>";
    }

    string2 += "</table><br>";

    string2 += "<table class='resultsTable'>";

    //add header row

    string2 += "<tr class='tableHeading'> <th style='width:220px;'> Other Parameters </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th> </th>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<th>";
        string2 += "Y" + y;
        string2 += "</th>";
    }

    string2 += "<th> </th>";

    string2 += "</tr>";

    string2 += "<tr><td>Precipitation</td>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<td>";
        string2 += boardData[currentBoard].precipitation[y];
        string2 += "</td>";
    }

    string2 += "<td>inches</td>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<td>";
        string2 += Math.round(boardData[currentBoard].precipitation[y] * 2.54 * 10) / 10;
        string2 += "</td>";
    }

    string2 += "<td>cm</td>";

    string2 += "</tr>";

    string2 += "<tr><td>Strategic Wetland Use</td>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<td>";
        string2 += Totals.strategicWetlandPercent[y];
        string2 += "</td>";
    }

    string2 += "<td>percent</td>";

    for (var y = 1; y <= upToYear; y++) {
        string2 += "<td>";
        string2 += Totals.strategicWetlandCells[y];
        string2 += "</td>";
    }

    string2 += "<td>cells</td>";

    string2 += "</tr>";

    string2 += "</table><br>";


    document.getElementById('resultsFrame').contentWindow.document.getElementById('contentsN').innerHTML = string2;

    pie(currentYear) ;
    
} //end displayResults


function pie(year) {
    
document.getElementById('resultsFrame').contentWindow.document.getElementById('chart').innerHTML = " " ;   
document.getElementById('resultsFrame').contentWindow.document.getElementById('year2').style.display="block";
document.getElementById('resultsFrame').contentWindow.document.getElementById('year3').style.display="block";

var upTo = boardData[currentBoard].calculatedToYear ;

if(upTo < 3){ 
document.getElementById('resultsFrame').contentWindow.document.getElementById('year3').style.display="none";
}
if(upTo < 2){
document.getElementById('resultsFrame').contentWindow.document.getElementById('year2').style.display="none";    
}
 
 // = ["conventionalCorn", "conservationCorn", "conventionalSoybean",
 //       "conservationSoybean", "mixedFruitsVegetables", "permanentPasture", "rotationalGrazing", "grassHay",
 //       "switchgrass", "prairie", "wetland", "alfalfa", "conventionalForest",
 //       "conservationForest", "shortRotationWoodyBioenergy"
        
var dataset = [
  { label: 'Conventional Corn', count:  (Math.round(Totals.landUseResults[year]['conventionalCornLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['conventionalCornLandUse'] * 10) / 10) }, 
  { label: 'Conservation Corn', count: (Math.round(Totals.landUseResults[year]['conservationCornLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['conservationCornLandUse'] * 10) / 10)},
  { label: 'Conventional Soybean', count: (Math.round(Totals.landUseResults[year]['conventionalSoybeanLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['conventionalSoybeanLandUse'] * 10) / 10) },
  { label: 'Conservation Soybean', count: (Math.round(Totals.landUseResults[year]['conservationSoybeanLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['conservationSoybeanLandUse'] * 10) / 10) },
  { label: 'Mixed Fruits/Vegetables', count:  (Math.round(Totals.landUseResults[year]['mixedFruitsVegetablesLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['mixedFruitsVegetablesLandUse'] * 10) / 10)}, 
  { label: 'Permanent Pasture', count: (Math.round(Totals.landUseResults[year]['permanentPastureLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['permanentPastureLandUse'] * 10) / 10) },
  { label: 'Rotational Grazing', count: (Math.round(Totals.landUseResults[year]['rotationalGrazingLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['rotationalGrazingLandUse'] * 10) / 10) },
  { label: 'Grass Hay', count: (Math.round(Totals.landUseResults[year]['grassHayLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['grassHayLandUse'] * 10) / 10) },
  { label: 'Switchgrass', count:  (Math.round(Totals.landUseResults[year]['switchgrassLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['switchgrassLandUse'] * 10) / 10)}, 
  { label: 'Prairie', count: (Math.round(Totals.landUseResults[year]['prairieLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['prairieLandUse'] * 10) / 10) },
  { label: 'Wetland', count: (Math.round(Totals.landUseResults[year]['wetlandLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['wetlandLandUse'] * 10) / 10) },
  { label: 'Alfalfa', count: (Math.round(Totals.landUseResults[year]['alfalfaLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['alfalfaLandUse'] * 10) / 10) },
  { label: 'Conventional Forest', count:  (Math.round(Totals.landUseResults[year]['conventionalForestLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['conventionalForestLandUse'] * 10) / 10)}, 
  { label: 'Conservation Forest', count: (Math.round(Totals.landUseResults[year]['conservationForestLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['conservationForestLandUse'] * 10) / 10) },
  { label: 'Short Rotation Woody Bioenergy', count: (Math.round(Totals.landUseResults[year]['shortRotationWoodyBioenergyLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['shortRotationWoodyBioenergyLandUse'] * 10) / 10) }
];    
 
var width = 360;
var height = 360;
var radius = Math.min(width, height) / 2;     

var color = d3.scaleOrdinal(d3.schemeCategory20);

var skipped = 0;
//document.getElementById('resultsFrame').contentWindow.document.getElementById('chart').innerHTML = "" ;    
var chart = document.getElementById('resultsFrame').contentWindow.document.getElementById('chart') ;
    
var svg = d3.select(chart)
  .append('svg')
  .attr("class", "graph-svg-component")
  .attr('width', width + 300)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');    

    
var arc = d3.arc()
  .outerRadius(radius)
   .innerRadius(100) 
   .padAngle(0.01);
   
  
  
 var pie = d3.pie()
  .value(function(d) { return d.count; })
  .sort(null);
  
function tweenPie(b) {
  b.innerRadius = 0;
  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc(i(t)); };
}    
    
    
var mouseoverInfo = d3.select(chart)            
  .append('g')                          
  .attr('class', 'mouseoverInfo');              

mouseoverInfo.append('div')                     
  .attr('class', 'label');                   

mouseoverInfo.append('div')                       
  .attr('class', 'count');              

mouseoverInfo.append('div')                        
  .attr('class', 'percent');        
  
var path = svg.selectAll('path')
  .data(pie(dataset))
  .enter()
  .append('path')
  .attr('class','testArc')
  .attr('d', arc)
  .attr('fill', function(d, i) { 
    if(d.data.count == 0){
       return color(d.data.label + "#"); 
    }  
    return color(d.data.label);

     })
  .on('mouseover',function(d) { 
            var percent = d.data.count ;
            mouseoverInfo.select('.label').html(d.data.label);
            mouseoverInfo.select('.count').html(d.data.number + " acres"); 
            mouseoverInfo.select('.percent').html(percent + '%'); 
            mouseoverInfo.style('border-color', color(d.data.label) );
            mouseoverInfo.style('opacity', 1);
            mouseoverInfo.style('display', 'block');
            
            d3.select(this).classed("arc", false);
            d3.select(this).classed("arcHighlight", true);
            //noah
  })
  .on('mouseout', function() {
            mouseoverInfo.style('display', 'none');
            d3.select(this).classed("arcHighlight", false);
            d3.select(this).classed("arc", true);

          })
          
  .transition()
    .duration(900)
    .attrTween("d", tweenPie);
   

  var legendRectSize = 18;
  var legendSpacing = 4;
  
  var legend = svg.selectAll('.legend')                     
    .data(color.domain())                                   
    .enter()                                                
    .append('g')                                            
    .attr('class', 'legend')  
    .style('visibility', function(d) {
        if(d[d.length-1 ] == "#") return "hidden";
        return 'visible';
    })
    .attr('transform', function(d, i) {                     
        var height = legendRectSize + legendSpacing;        
        var offset =  height * color.domain().length / 2;   
        var horz = width/2 + 20;   
        var vert = i * height - offset;  
        return 'translate(' + horz + ',' + vert + ')';
    });
                                                    // NEW

        legend.append('rect')                                     // NEW
          .attr('width', legendRectSize)                          // NEW
          .attr('height', legendRectSize) 
          .style('fill', color)                                   // NEW
          .style('stroke', color);                                // NEW
          
        legend.append('text')                                     // NEW
          .attr('x', legendRectSize + legendSpacing)              // NEW
          .attr('y', legendRectSize - legendSpacing)              // NEW
          .text(function(d) { return d; });         
  
    svg.append("text")
        .attr("x", 0)             
        .attr("y", 0)
        .attr("text-anchor", "middle")  
        .style("font-size", "25px") 
        .style("font-weight", "bold")
        .text("Land Use")
    svg.append("text")
        .attr("x", 0)             
        .attr("y", 25)
        .attr("text-anchor", "middle")  
        .style("font-size", "25px") 
        .style("font-weight", "bold")
        .text("Year " + year)
        


    
}
    
