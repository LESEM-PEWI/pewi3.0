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

    document.getElementById('resultsFrame').contentWindow.refreshPie() ;
    pie(currentYear, false) ;
    drawPrecipBar() ;
    aster(currentYear);
    
    document.getElementById('resultsFrame').contentWindow.toggleYear(0) ;
    document.getElementById('resultsFrame').contentWindow.toggleESI(0) ;
    
} //end displayResults


function pie(year, category) {
    
document.getElementById('resultsFrame').contentWindow.document.getElementById('chart').innerHTML = " " ;   
document.getElementById('resultsFrame').contentWindow.document.getElementById('landYear').innerHTML = year;
document.getElementById('resultsFrame').contentWindow.document.getElementById('upTo').innerHTML = boardData[currentBoard].calculatedToYear;


 // = ["conventionalCorn", "conservationCorn", "conventionalSoybean",
 //       "conservationSoybean", "mixedFruitsVegetables", "permanentPasture", "rotationalGrazing", "grassHay",
 //       "switchgrass", "prairie", "wetland", "alfalfa", "conventionalForest",
 //       "conservationForest", "shortRotationWoodyBioenergy"
 
 
//assign dataset based on whether or not categories are toggeled on, if so, then combine the dataset into one large heap
if(category){
 
 var dataset = [
    { label: "Annual Grain", 
    count: (Math.round(Totals.landUseResults[year]['conventionalCornLandUse'] / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year]['conservationCornLandUse'] / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[year]['conventionalCornLandUse'] * 10) / 10) + (Math.round(Totals.landUseResults[year]['conservationCornLandUse'] * 10) / 10) },
    
    { label: "dummy1", count: 0, number: 0},
    
    {label: "Annual Legume",
    count: (Math.round(Totals.landUseResults[year]['conventionalSoybeanLandUse'] / Totals.totalArea * 100 * 10) / 10) +  (Math.round(Totals.landUseResults[year]['conservationSoybeanLandUse'] / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[year]['conventionalSoybeanLandUse'] * 10) / 10) + (Math.round(Totals.landUseResults[year]['conservationSoybeanLandUse'] * 10) / 10) },
    
    { label: "dummy2", count: 0, number: 0},
    
    {label: 'Mixed Fruits/Vegetables', count:  (Math.round(Totals.landUseResults[year]['mixedFruitsVegetablesLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['mixedFruitsVegetablesLandUse'] * 10) / 10)}, 
    
    { label: "dummy3", count: 0, number: 0},
    
    {label: "Pasture",
    count: (Math.round(Totals.landUseResults[year]['permanentPastureLandUse'] / Totals.totalArea * 100 * 10) / 10) +  (Math.round(Totals.landUseResults[year]['rotationalGrazingLandUse'] / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[year]['permanentPastureLandUse'] * 10) / 10) + (Math.round(Totals.landUseResults[year]['rotationalGrazingLandUse'] * 10) / 10) },
    
    { label: "dummy4", count: 0, number: 0},
    
    {label: "Non-pasture Perrenial Herbs",
    count: (Math.round(Totals.landUseResults[year]['grassHayLandUse'] / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year]['switchgrassLandUse'] / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year]['prairieLandUse'] / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year]['wetlandLandUse'] / Totals.totalArea * 100 * 10) / 10) ,
    number: (Math.round(Totals.landUseResults[year]['grassHayLandUse'] * 10) / 10) + (Math.round(Totals.landUseResults[year]['switchgrassLandUse'] * 10) / 10) + (Math.round(Totals.landUseResults[year]['prairieLandUse'] * 10) / 10)  + (Math.round(Totals.landUseResults[year]['wetlandLandUse'] * 10) / 10) },
    
    { label: "dummy5", count: 0, number: 0},
    
    {label: 'Perrenial Legume', count: (Math.round(Totals.landUseResults[year]['alfalfaLandUse'] / Totals.totalArea * 100 * 10) / 10), number: (Math.round(Totals.landUseResults[year]['alfalfaLandUse'] * 10) / 10) },
    
    { label: "dummy6", count: 0, number: 0}, 
     
    {label: "Perrenial Woodland",
    count: (Math.round(Totals.landUseResults[year]['conventionalForestLandUse'] / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year]['conservationForestLandUse'] / Totals.totalArea * 100 * 10) / 10) + (Math.round(Totals.landUseResults[year]['shortRotationWoodyBioenergyLandUse'] / Totals.totalArea * 100 * 10) / 10),
    number: (Math.round(Totals.landUseResults[year]['conventionalForestLandUse'] * 10) / 10) + (Math.round(Totals.landUseResults[year]['conservationForestLandUse'] * 10) / 10) + (Math.round(Totals.landUseResults[year]['shortRotationWoodyBioenergyLandUse'] * 10) / 10) }
     
     
     ]  ;
    
}
else{
           
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
 
} 
 
var width = 360;
var height = 360;
var radius = Math.min(width, height) / 2;     

var color = d3.scaleOrdinal(d3.schemeCategory20);

var nameArray = [] ;
var colorLinker = {} ;


//document.getElementById('resultsFrame').contentWindow.document.getElementById('chart').innerHTML = "" ;    
var chart = document.getElementById('resultsFrame').contentWindow.document.getElementById('chart') ;
    
var svg = d3.select(chart)
  .append('svg')
  .attr("class", "graph-svg-component")
  .attr('width', width + 280)
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
    var hue = color(d.data.label) ;
    if(d.data.count != 0){
        nameArray.push(d.data.label) ;
        colorLinker[d.data.label] = hue 
    }  
    return hue ;

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
    .data(nameArray)                                   
    .enter()                                                
    .append('g')                                            
    .attr('class', 'legend')  
    .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;        
        var offset =  height * nameArray.length / 2;   
        var horz = width/2 + 20;   
        var vert = i * height - offset;  
        return 'translate(' + horz + ',' + vert + ')';
    });

        legend.append('rect')                                     
          .attr('width', legendRectSize)                          
          .attr('height', legendRectSize) 
          .style('fill', function(d){
              return colorLinker[d] ;
          })                                   
          .style('stroke',function(d){
              return colorLinker[d] ;
          });                                                     
          
        legend.append('text')                                     
          .attr('x', legendRectSize + legendSpacing)              
          .attr('y', legendRectSize - legendSpacing)              
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
    

function drawPrecipBar() {
    
    var element = document.getElementById('resultsFrame').contentWindow.document.getElementById('precipChart');
    document.getElementById('resultsFrame').contentWindow.document.getElementById('precipChart').innerHTML = " " ;
    document.getElementById('resultsFrame').contentWindow.document.getElementById('precipInfo').innerHTML = " " ;


    var data = [
  {label: "Year 0",    value:  boardData[currentBoard].precipitation[0], percent: 0, adj: "", year: 0 },
  {label: "Year 1",    value:  boardData[currentBoard].precipitation[1], percent: 0, adj: "", year: 1},
  {label: "Year 2",     value: boardData[currentBoard].precipitation[2], percent: 0, adj: "", year: 2},
  {label: "Year 3",   value: boardData[currentBoard].precipitation[3], percent: 0, adj: "", year: 3}
];
    
        
    for(var y=0; y<data.length; y++){
        
        var tempPercent ;
        var tempAdj ;
        
        switch(data[y].value){
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
                tempAdj = "Normal" ;
                break;
            case 36.47:
                tempPercent = 64;
                tempAdj = "Wet" ;
                
                if(y > 0 && data[y-1].adj == "Dry"){
                    tempAdj = "Flood";
                }
                
                break;
            case 45.1:
                tempPercent = 89;
                tempAdj = "Wet";
                
                if(y > 0 && data[y-1].adj == "Dry"){
                    tempAdj = "Flood";
                }
                
                break;
            default:
                tempPercent = 0;
                tempAdj = "";
                break;
        }
        
        data[y].percent = tempPercent ;
        data[y].adj = tempAdj ;
        
    }    
        
 
    var width = 420;
    var barHeight = 30;

    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    var chart = d3.select(element)
        .attr("width", width);

    chart.attr("height", barHeight * data.length);
    
    
    
    var element = document.getElementById('resultsFrame').contentWindow.document.getElementById('precipInfo');

    var mouseoverInfo = d3.select(element)
        .append('g');
    
    mouseoverInfo.append('div')
        .attr('class', 'leftPrecipContainer');    
    
    var container = mouseoverInfo.select('.leftPrecipContainer');
    
    container.append('div')
        .attr('class', 'yearLabel');

    container.append('div')
        .attr('class', 'precipValue');

    container.append('div')
        .attr('class', 'precipType');

    mouseoverInfo.append('img')
        .attr('class', 'precipImg')
        
  function setupPrecipInfo(year){
       
       container.select('.yearLabel').html(data[year].label);
       container.select('.precipValue').html(data[year].value + " inches"); 
       container.select('.precipType').html(data[year].adj); 
       
       
       
      var img = " ";
      switch(data[year].adj){
          case "Dry":
              img = "./imgs/dry.png";
              break;
          case "Normal":
              img = "./imgs/normal.png";
              break;
          case "Wet":
              img = "./imgs/wet.png";
              break;
          case "Flood":
              img = "imgs/flood.png";
              break;
      }
      
      //console.log(img);
      mouseoverInfo.select('.precipImg').attr('src', img) ;
              
  }        

  var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr('class', 'barData')  
      .attr("transform", function(d, i) { return "translate(0," + (i * barHeight + 2) + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.percent); })
      .attr("height", barHeight - 4)
      .attr("class", "legendBars")
      .attr('fill', '#1f77b4')
      .on('mouseover',function(d) { 
          
            setupPrecipInfo(d.year) ;
            
            mouseoverInfo.style('display', 'block');
            
            d3.select(this).attr('fill','lightskyblue');
  })
  .on('mouseout', function() {
            d3.select(this).attr('fill', '#1f77b4');
            
            setupPrecipInfo(currentYear) ;
            
          })
    .transition()
    .duration(1400)
    .attrTween("width", function() {
        return d3.interpolate(0, this.getAttribute("width"));
    });

  bar.append("text")
      .attr("x", function(d) { return x(d.percent) + 7; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.label; })
      .attr('fill','black');
      
    setupPrecipInfo(currentYear) ;


}



function aster(year){
   
document.getElementById('resultsFrame').contentWindow.document.getElementById('asterChart').innerHTML = " " ; 
document.getElementById('resultsFrame').contentWindow.document.getElementById('asterContainer').innerHTML = " ";
document.getElementById('resultsFrame').contentWindow.document.getElementById('ecoYear').innerHTML = year;
document.getElementById('resultsFrame').contentWindow.document.getElementById('upTo').innerHTML = boardData[currentBoard].calculatedToYear;   
   
   
var dataset = [
    {name: "Nitrate Concentration", score: (Math.round(Totals.nitrateConcentrationScore[year] * 10) / 10 ), color: "#0066cc", backColor: "navy", raw: (Math.round(Totals.nitrateConcentration[year] * 10) / 10 ) + " ppm", count: 1},
    {name: "Phosphorus Load", score: (Math.round(Totals.phosphorusLoadScore[year] * 10 ) / 10) , color: "#00cc99", backColor: "navy", raw: (Math.round(Totals.phosphorusLoad[year] * 10) / 10 ) + " tons",  count: 1},
    {name: "Sediment Delivery", score: (Math.round(Totals.sedimentDeliveryScore[year] * 10) / 10)  , color: "	#cc0033", backColor: "navy", raw: (Math.round(Totals.sedimentDelivery[year] * 10) / 10 ) + " tons", count: 1},
    {name: "Carbon Sequestration", score: (Math.round(Totals.carbonSequestrationScore[year] * 10) / 10), color: "#6b6961", backColor: "maroon", raw: (Math.round(Totals.carbonSequestration[year] * 10) / 10 ) + " tons", count:1},
    {name: "Gross Erosion", score: (Math.round(Totals.grossErosionScore[year] * 10) / 10), color: "#cccc00", backColor: "maroon", raw: (Math.round(Totals.grossErosion[year] * 10) / 10 ) + " tons", count: 1},
    {name: "Game Wildlife", score: (Math.round(Totals.gameWildlifePointsScore[year] * 10) / 10), color: "#9900cc", backColor: "tomato", raw: (Math.round(Totals.gameWildlifePoints[year] * 10) / 10 ) + " pts", count: 1},
    {name: "Biodiversity", score: (Math.round(Totals.biodiversityPointsScore[year] * 10) / 10), color: "#33cc00", backColor: "tomato", raw: (Math.round(Totals.biodiversityPoints[year] * 10) / 10 ) + " pts", count: 1}
    
    ];    
    
var width = 360;
var height = 360;
var radius = Math.min(width, height) / 2;  
var innerRadius = 75 ;

var asterChart = document.getElementById('resultsFrame').contentWindow.document.getElementById('asterChart') ;
    
var svg = d3.select(asterChart)
  .append('svg')
  .attr("class", "graph-svg-component")
  .attr('width', width + 280)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');    
    
var innerArc = d3.arc()
   .innerRadius(innerRadius) 
   .padAngle(0)
   .outerRadius(function (d) { 
     return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius ;  
     });
    
    
var outlineArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);
    
var coverArc = d3.arc()
        .innerRadius(0)
        .outerRadius(innerRadius);
        
function generateSVGArc(x, y, r, startAngle, endAngle) {
 
 var largeArc = 0;
 var sweepFlag = 1; // is arc to be drawn in +ve direction?
 
 return ['M', x, y, 'L', x + Math.sin(startAngle) * r, y - (Math.cos(startAngle) * r),
         'A', r, r, 0, largeArc, sweepFlag, x + Math.sin(endAngle) * r, y - (Math.cos(endAngle) * r), 'Z'
        ].join(' ');
}


function interpolateSVGArc(x, y, r, startAngle, endAngle) {
 return function(t) {
   return generateSVGArc(x, y, (r-innerRadius) * t + innerRadius , startAngle, endAngle);
 };
}

 var pie = d3.pie()
  .value(function(d) { return d.count; })
  .sort(null);

    
    
     var mouseoverInfo = d3.select(asterChart)            
  .append('g')                          
  .attr('class', 'mouseoverInfo');              

mouseoverInfo.append('div')                     
  .attr('class', 'label');                   

mouseoverInfo.append('div')                       
  .attr('class', 'count');              

mouseoverInfo.append('div')                        
  .attr('class', 'score');        
  
  
var path = svg.selectAll('path')
  .data(pie(dataset))
  .enter()
  .append('path')
  .attr('d', innerArc)
  .attr('fill', function(d) { 
    return d.data.color ;
    })
  .attr('class', 'arc')
  .on('mouseover',function(d) { 
            mouseoverInfo.select('.label').html(d.data.name);
            mouseoverInfo.select('.count').html(d.data.raw); 
            mouseoverInfo.select('.score').html(d.data.score + "/100"); 
            mouseoverInfo.style('border-color', d.data.color );
           
            mouseoverInfo.style('display', 'block');
            
            d3.select(this).classed("arc", false);
            d3.select(this).classed("arcHighlight", true);
  })
   .on('mouseout', function() {
       
            mouseoverInfo.style('display', 'none');
           
            d3.select(this).classed("arcHighlight", false);
            d3.select(this).classed("arc", true);

  })
  .transition()
  .duration(700)
  .attrTween('d', function(d, i) {
     //console.log(d) ;
    var endRadius =  (d.data.score < 2) ? innerRadius + 6 : (radius - innerRadius) * (d.data.score / 100.0) + innerRadius ;
    return interpolateSVGArc(0, 0, endRadius, d.startAngle, d.endAngle);
   });

var dummy = [{count:1}] ;

var cover = svg.selectAll(".cover")
      .data(pie(dummy))
      .enter().append("path")
      .attr("fill", "white")  
      .attr("d", coverArc);

 var outerPath = svg.selectAll(".outlineArc")
      .data(pie(dataset))
      .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", function(d) { return d.data.backColor ; })
      .attr("class", "outlineArc")
      .attr("d", outlineArc);
     
      
 svg.append("text")
        .attr("x", 0)             
        .attr("y", 0)
        .attr("text-anchor", "middle")  
        .style("font-size", "25px") 
        .style("font-weight", "bold")
        .text("Eco-Scores");
        
  svg.append("text")
      .attr("x", 0)             
      .attr("y", 25)
      .attr("text-anchor", "middle")  
      .style("font-size", "25px") 
      .style("font-weight", "bold")
      .text("Year " + year)      

 


  function getColor(number){
      var tempColor ;
      
      if(number > 90) return "#0d46f2" ;
      if(number > 70) return "#3359cc" ;
      if(number > 50 ) return "#4d66b3" ;
      if(number > 30) return "#60709f" ;
      if(number > 0 ) return "#808080" ;
      
      return "##333333" ;
  }

  var nameArray = [];
  var colorLinker = {} ;
  var dataLinker = {} ;
  
  
  //waterquality
  
  nameArray.push("Water Quality");

  var sum = 0 ;
  for(var i = 0 ; i <= 2 ; i++){
     sum += dataset[i].score ;
   }
  
  dataLinker[nameArray[0]] = sum / 3 ;
  colorLinker[nameArray[0]] = getColor(sum/3) ;
  
  nameArray.push("Soil Quality");

  var sum = 0 ;
  for(var i = 3 ; i <= 4 ; i++){
     sum += dataset[i].score ;
   }
  
  dataLinker[nameArray[1]] = sum / 2 ;
  colorLinker[nameArray[1]] = getColor(sum/2) ;
  
  nameArray.push("Habitat Quality");
  
  var sum = 0 ;
  for(var i = 5 ; i <= 6 ; i++){
     sum += dataset[i].score ;
   }
  
  dataLinker[nameArray[2]] = sum / 2 ;
  colorLinker[nameArray[2]] = getColor(sum/2) ;
  

  var container = document.getElementById('resultsFrame').contentWindow.document.getElementById('asterContainer') ;

  var svg2 = d3.select(container)
  .append('svg')
  .attr('height',200)
  .attr("class", "graph-svg-component")
  .append('g');
  
  
  var legendRectSize = 18;
  var legendSpacing = 4;
  
  var legend = svg2.selectAll('.legend')                    
    .data(nameArray)                                   
    .enter()                                                
    .append('g')
    .attr('class','ecoLegend')
    .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;        
        var offset =  10;   
        var horz = 10;   
        var vert = i * height + offset;  
        return 'translate(' + horz + ',' + vert + ')';
    });

    legend.append('text')                                     
      .attr('x', legendRectSize + legendSpacing)              
      .attr('y', legendRectSize - legendSpacing)              
       .text(function(d) { 
           return d + " : " + Math.round(dataLinker[d]) + "/100"; })
       .attr('transform', function(d, i) {
        var horz = 0;
        var vert = (i) * (legendRectSize+ 7 + legendSpacing);
        return 'translate(' + horz + ',' + vert + ')';
        });
    
    legend.append('rect')                                     
     .attr('width', legendRectSize * 15.2)                          
     .attr('height', legendRectSize) 
     .attr('fill', function(d){
      return colorLinker[d] ;
     })                                   
     .style('stroke',function(d){
      return colorLinker[d] ;
     })
     .attr('transform', function(d, i) {
        var horz = 0;
        var vert = (i + 1) * (legendRectSize + 5 + legendSpacing);
        return 'translate(' + horz + ',' + vert + ')';
    })
    .transition()
    .duration(1000)
    .attrTween("fill", function() {
        //console.log(this.getAttribute('fill'));
        return d3.interpolateRgb("#000000", this.getAttribute("fill"));
    });

   
    


    
    
}
