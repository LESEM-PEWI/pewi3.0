// Define the function

var Economics = function () {
  this.rawData;
  this.rawBMPData;
  this.mapData = [];
  this.data = [];
  this.data4 = [];
  this.loadedGHGData = [];
  this.calculatedGHG =[];
  this.landUseArea = []
  this.GHGs = [];
  this.GHGsBylandUse = []
  this.dataSubcrop = {};
  this.data3 = [];
  this.data3ByLU = [];
  this.data5=[];
  this.rawRev=[];
  this.scaledRev=[];
  this.cornAfters=[];
  this.getCropYields=[];
  this.getForrestYields=[];
  this.getBMPAreas=[];
  this.getSoilArea=[];
  this.getRent = [];
  this.totalWatershedCost=[];
  this.totalWatershedRevenue=[];


//the number of years in the cycle so that we can divide to get the yearly cost; The -1 accounts for the 'none' land use.
  yearCosts = [-1,1,1,1,1,4,1,1,4,50,1,1,11,7,50,{'Grapes (Conventional)': 4 * 25,'Green Beans': 1 * 4,'Winter Squash': 1 * 4,'Strawberries': 4 * 3}];
  d3.csv('./revenue2020.csv', (data) => {

    this.rawRev = data;
  })
  d3.csv('./kpi.csv', (data) => {
    this.loadedGHGData = data;
  })
  console.log("this is the loaded GHG data, **")
  console.log(this.loadedGHGData.length)
  this.divideByCategory = function (listofCats){
    for(var i =1; i <= boardData[currentBoard].calculatedToYear; i++){
      this.data[i] = [];
      listofCats.forEach(cat => {
        this.mapData[i].forEach(dataPoint => {
          if (!this.data[i][dataPoint['LU_ID']]) {
            this.data[i][dataPoint['LU_ID']] = {'landUse': dataPoint['Land-Use']};
          } // We need to create a path to the data that we want to pull out
          if (!this.data[i][dataPoint['LU_ID']][cat]){ //if this is the first time that we see a particular category for a particular land use
            this.data[i][dataPoint['LU_ID']][cat] = {total: 0}; //Further path making
          }
          if(!this.data[i][dataPoint['LU_ID']][cat][dataPoint[cat]]){ //if this is the first value we need to read
            this.data[i][dataPoint['LU_ID']][cat][dataPoint[cat]] = Math.round(1000*Number.parseFloat(dataPoint['EAA']))/1000;
            if(!this.data[i][cat]){
              this.data[i][cat] = [];
            }
            if(!this.data[i][cat].includes(dataPoint[cat])) {
              this.data[i][cat].push(dataPoint[cat]);
            }
          }
          else {//The value already exists so just add to it.
            this.data[i][dataPoint['LU_ID']][cat][dataPoint[cat]] = //trying to prevent floating point calculation errors so rounding to tenth of a cent
            //ideally this.data[i][dataPoint['LU_ID']][cat][dataPoint[cat]] + Number.parseFloat(dataPoint['Value'])
            Math.round(1000*(this.data[i][dataPoint['LU_ID']][cat][dataPoint[cat]] + Number.parseFloat(dataPoint['EAA'])))/1000
            this.data[i][dataPoint['LU_ID']][cat][dataPoint[cat]]

            // console.log("DATA POINT: ", this.data[i])
          }
          this.data[i][dataPoint['LU_ID']][cat].total = //either way add it to the total
          Math.round(1000*this.data[i][dataPoint['LU_ID']][cat].total + 1000*Number.parseFloat(dataPoint['EAA']))/1000
        });
      });
    }
  }
  /**
   * grahpic 5 parse data
   */
    this.graphic5information = function(){
      for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
        this.data5[i]=[];
        this.mapData[i].forEach(dataPoint=>{
          var landuseNum=dataPoint['LU_ID'];
          if (!this.data5[i][landuseNum]) {
            this.data5[i][landuseNum] = {'landUse': dataPoint['Land-Use'],'array':[],'subcrop':[]};
          } // We need to create a path to the data that we want to pull out
          var subcrop=dataPoint['Sub Crop'];
          if(dataPoint['Time of Year']!=""){
          if(subcrop!=""){
            if(!this.data5[i][landuseNum]['subcrop'].some(e=>e['subcrop']===subcrop)){
               this.data5[i][landuseNum]['subcrop'].push({'array':[],'subcrop':subcrop});
            }
            var indexOfStevie = this.data5[i][landuseNum]['subcrop'].findIndex(i => i['subcrop'] === subcrop);
            this.data5[i][landuseNum]['subcrop'][indexOfStevie]['array'].push(dataPoint);
          }
            this.data5[i][landuseNum]['array'].push(dataPoint);
          }
        })
    }
    }
    d3.csv('./Budget2020.csv', (data) => {
      // ToDO pass 1.23, the default to the functions above
      // keep the default to 1

      this.rawData=costAdjuster(data, "EAA", 1);
      this.rawData.forEach(dataPoint => {
        let id = Number.parseInt(dataPoint['LU_ID'])
        divisionForLU = (typeof yearCosts[id] === 'number') ? yearCosts[id]:  yearCosts[id][dataPoint['Sub Crop']];
        dataPoint['EAA'] = dataPoint['EAA'];
        if(dataPoint['LU_ID'] === "15"){
          dataPoint["EAA"] /= 4; //Only for MFV
        }
        dataPoint["# Labor Hours"] /= divisionForLU;
      })
    });

  //READ IN BMP FILE
  d3.csv('./BMPBudgets2020.csv', (data) => {

    this.rawBMPData=costAdjuster(data, 'EAA',  1);

  });

  //graph
  //graphic 4 extract data from raw data
  this.chart4Information = function(lists) {
    for(var i=1;i<=boardData[currentBoard].calculatedToYear;i++){
      this.data4[i]=[];
      this.mapData[i].forEach(dataPoint => {
        if(dataPoint['EAA']!=0){
          var landuseNum=dataPoint['LU_ID'];
          if (!this.data4[i][landuseNum]) {
            this.data4[i][landuseNum] = {'landUse': dataPoint['Land-Use'],'array':[]}
          } // We need to create a path to the data that we want to pull out
          this.data4[i][landuseNum]['array'].push(dataPoint);
          lists.forEach(cat => {
            if(!this.data4[i][landuseNum][cat]){
              this.data4[i][landuseNum][cat]=[];
            }
            if(!this.data4[i][landuseNum][cat].includes(dataPoint[cat])){
              this.data4[i][landuseNum][cat].push(dataPoint[cat]);
            }
          });
        }
      });
    }

  }

  this.chart3Data = () => {
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      this.data3[i] = {time: {}, action: {}};
      this.mapData[i].forEach( dataPoint => {
        if(this.data3[i].time[dataPoint['Time - Cost Type']]){
          this.data3[i].time[dataPoint['Time - Cost Type']] += Number.parseFloat(dataPoint['EAA']);
        }
        else {
          this.data3[i].time[dataPoint['Time - Cost Type']] = Number.parseFloat(dataPoint['EAA']);
        }
        if(this.data3[i].action[dataPoint['Action - Cost Type']]){
          this.data3[i].action[dataPoint['Action - Cost Type']] += Number.parseFloat(dataPoint['EAA']);
        }
        else {
          this.data3[i].action[dataPoint['Action - Cost Type']] = Number.parseFloat(dataPoint['EAA']);
        }
      })
    }
  }

  this.chart3DataByLU = () => {
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      this.data3ByLU[i] = {};
      this.mapData[i].forEach( dataPoint => {
        if(!this.data3ByLU[i][dataPoint['Land-Use']]){
          this.data3ByLU[i][dataPoint['Land-Use']] = {time: {}, action: {}}
        }

        if(!this.data3ByLU[i][dataPoint['Land-Use']].time[dataPoint['Time - Cost Type']]){
          this.data3ByLU[i][dataPoint['Land-Use']].time[dataPoint['Time - Cost Type']] = 0;
        }

        if(!this.data3ByLU[i][dataPoint['Land-Use']].action[dataPoint['Action - Cost Type']]){
          this.data3ByLU[i][dataPoint['Land-Use']].action[dataPoint['Action - Cost Type']] = 0;
        }

        this.data3ByLU[i][dataPoint['Land-Use']].time[dataPoint['Time - Cost Type']] += dataPoint.EAA;
        this.data3ByLU[i][dataPoint['Land-Use']].action[dataPoint['Action - Cost Type']] += dataPoint.EAA;

        this.data3ByLU[i][dataPoint['Land-Use']].toggleVal = -1;
      })
    }
  }

  this.mapChange = function (){ //called when the map changes in order to edit the intermediate step.

    calculateCornAfters();
    calculatePerYieldCrops();
    calculateForrestYields();
    calulateBMPBudgets();
    calculateForestAreaBySoil();
    collectTotalWatershedGHGData()
    calculateRent();

    let landUses = [];
    this.mapData = [];
    /* this revenueData object was created to allow the user to make changes to the prices of corn and soybean
      Only four big land use categories are adjusted, i.e., cons conv corn and soybeans
      created by richard magala
    */
    const revenueData = {
      '1': parseFloat(document.getElementById('cornPrices').value),
      '2': parseFloat(document.getElementById('cornPrices').value),
     '3': parseFloat(document.getElementById('soybeanPrices').value),
      '4': parseFloat(document.getElementById('soybeanPrices').value),
    };
    //Less than ideal coding, but given how Totals is structured the easiest way
    //I found to map Land Use IDS to total LandUse without recalculation
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      console.log(i);
      landUses[i] = [];
      this.mapData[i] = [];
      this.scaledRev[i] = [];
      this.totalWatershedCost[i] = [{cost: 0}];  //TESTING

      let keys = Object.keys(Totals.landUseResults[0]);
      for(let j = 0; j < keys.length; j++){
        let key = keys[j];
        //this substring is to link different keys from different objects together... again less than ideal
        landUses[i][LandUseType[key.substring(0, key.length - 7)]] = Totals.landUseResults[i][key]
      }
      this.rawRev.forEach(dataPoint => {

        if(dataPoint['LU_ID'] === 15){
            let fruitsPrecipMultiplier = 1; //since the csv now accounts for acres instead of the actual yield for revenue purposes we have to use the yield precip multiplier
            if(boardData[currentBoard].precipitation[i] === 45.1) fruitsPrecipMultiplier = .75;
            if(boardData[currentBoard].precipitation[i] === 36.5) fruitsPrecipMultiplier = .9;
            // value = parseFloat(dataPoint['Revenue/acre/year']) * landUses[i][dataPoint['LU_ID']] * fruitsPrecipMultiplier / 4;
            value = parseFloat(dataPoint['Revenue/acre/year']) * this.getCropYields[i][1].mixedFVYield;
        }

        else if (dataPoint['LU_ID'] === "2"){
          if(dataPoint['Sub Crop'] === 'Corn after Soybean'){
            value = parseFloat(revenueData[dataPoint['LU_ID']]) * this.getBMPAreas[i][2].landUseYield || 0;  //2 = Cons Corn after Soybean
          }
          else {
            value = parseFloat(dataPoint['Revenue/acre/year']) * this.getBMPAreas[i][3].landUseYield || 0; //3 = Cons Corn after Corn
          }
        }
        else if (dataPoint['LU_ID'] === "4"){
         // value = parseFloat(dataPoint['Revenue/acre/year']) *  this.getBMPAreas[i][1].landUseYield; //1 = Cons Soybean
          value = parseFloat(revenueData[dataPoint['LU_ID']]) *  this.getBMPAreas[i][1].landUseYield;
        }
        //woodlands can't be treated the same since they are the only land use where the soil type changes the value of the wood not just the amount of wood.
        //Where the rest of the revenue above can multiply the output by a certain price: we need to actually find the soil that all the woodlands are on.
        else if(dataPoint['LU_ID'] === "10"){
          value = parseFloat(dataPoint['Revenue/acre/year']) * this.getSoilArea[i][1][dataPoint['SoilType']]  || 0; //1=Cons Forest
        }
        else if(dataPoint['LU_ID'] === "11"){
          value = parseFloat(dataPoint['Revenue/acre/year']) * this.getSoilArea[i][2][dataPoint['SoilType']]  || 0; //2=Conv Forrest
        }
        else if(dataPoint['LU_ID'] === "1"){
          value = parseFloat(revenueData[dataPoint['LU_ID']]) * Totals.yieldByLandUse[i][dataPoint['LU_ID']];
        }
        else if(dataPoint['LU_ID'] === "3"){
          value = parseFloat(revenueData[dataPoint['LU_ID']]) * Totals.yieldByLandUse[i][dataPoint['LU_ID']];
        }

        else{
          value = parseFloat(dataPoint['Revenue/acre/year']) * Totals.yieldByLandUse[i][dataPoint['LU_ID']];
        }
        this.scaledRev[i][dataPoint['LU_ID']] = this.scaledRev[i][dataPoint['LU_ID']] || 0;
        this.scaledRev[i][dataPoint['LU_ID']] += value;

        // this.totalWatershedRevenue[i][0].revenue += !isNaN(this.scaledRev[i][dataPoint['LU_ID']]) ? this.scaledRev[i][dataPoint['LU_ID']] : 0
      });

      /**
       * 2020 Budget File separates out each land yield.
       * Conventional and Conservation Corn are broken up by yield and also based on if it is Corn after Soybean or Corn after Corn. Look at @calculateCornAfters function.
       * Conventional and Conservation Forests are broken down based on 25/60/70 year budgets. Look at @calculateForrestYield function.
       * There is also a 'per yield' check on each land use. If the PerAcreOrPerYield variable is 'per yield' then it is calulated based on the yield for each line item.
       * Look at the @calculatePerYieldCrops.
       */
      this.rawData.forEach(dataPoint => {
        let copy = JSON.parse(JSON.stringify(dataPoint));

        //Calculate Rents First
        if(copy['Cost Name'] === 'Rent' && copy['LU_ID'] !== "5" && copy['LU_ID'] !== "6" && copy['LU_ID'] !== "7" && copy['LU_ID'] !== "8"){
          if(copy['LU_ID'] === "1"){
            if(copy['Sub Crop'] === 'Corn after Soybean') {
              copy['EAA'] *= -1 * this.getRent[i][0].convCornSoybeanRent;
            }
            else {
              copy['EAA'] *= -1 * this.getRent[i][0].convCornCornRent;
            }
          }
          if(copy['LU_ID'] === "2"){
            if(copy['Sub Crop'] === 'Corn after Soybean') {
              copy['EAA'] *= -1 * this.getRent[i][0].consCornSoybeanRent;
            }
            else {
              copy['EAA'] *= -1 * this.getRent[i][0].consCornCornRent;
            }
          }
          if(copy['LU_ID'] === "3") {
            copy['EAA'] *= -1 * this.getRent[i][0].convSoybeanRent;
          }
          if(copy['LU_ID'] === "4") {
            copy['EAA'] *= -1 * this.getRent[i][0].consSoybeanRent;
          }
          if(copy['LU_ID'] === "9") {
            copy['EAA'] *= -1 * this.getRent[i][0].prairieRent;
          }
          if(copy['LU_ID'] === "10") {
            copy['EAA'] *= -1 * this.getRent[i][0].consForestRent;
          }
          if(copy['LU_ID'] === "11") {
            copy['EAA'] *= -1 * this.getRent[i][0].convForestRent;
          }
          if(copy['LU_ID'] === "12") {
            copy['EAA'] *= -1 * this.getRent[i][0].swithgrassRent;
          }
          if(copy['LU_ID'] === "13") {
            copy['EAA'] *= -1 * this.getRent[i][0].swrbRent;
          }
          if(copy['LU_ID'] === "14") {
            copy['EAA'] *= -1 * this.getRent[i][0].wetlandRent;
          }
          if(copy['LU_ID'] === "15") {
            copy['EAA'] *= -1 * this.getRent[i][0].mfvRent;
          }
        }

       else {
          /*
            START CORN CHECKS. Corn is separated out into Conv and Cons Corn. Then we check for Per Acre or Per Yield Conditions.
           */

          //TODO Leaving a todo.
          if (copy['LU_ID'] === "1") {//corn needs to be treated specially
            if (copy['PerAcreORPerYield'] === "") {
              if (copy['Sub Crop'] === 'Corn after Soybean') {
                copy["EAA"] *= this.cornAfters[i][1].ConvCornAfterSoybean;
                copy["# Labor Hours"] *= this.cornAfters[i][1].ConvCornAfterSoybean;
              } else {
                copy["EAA"] *= this.cornAfters[i][1].ConvCornAfterCorn;
                copy["# Labor Hours"] *= this.cornAfters[i][1].ConvCornAfterCorn;
              }
            }
            if (copy['PerAcreORPerYield'] === 'per yield') {
              if (copy['Sub Crop'] === 'Corn after Corn') {
                  // console.log("CONV CORN: ",copy['Cost Name'] , copy['EAA'] )

                  copy['EAA'] *= this.cornAfters[i][1].ConvCornAfterCornYield
              } else {
                copy['EAA'] *= this.cornAfters[i][1].ConvCornAfterSoybeanYield
              }
            }
          }

          //Conservation Corn values are calculated separately due to BMP budgets.
          //Specially made verbose to reduce confusion.
          //Check calculateBMPBugets function.
          //Conservation Corn after Soybean is numLandUse 2 and Conservation Corn after Corn is numLandUse 3. DO NOT CONFUSE THIS WITH LU_ID.
          //numLandUse values are only used for calculateBMPBudgets function.
          else if (copy['LU_ID'] === "2") {
            if (copy['PerAcreORPerYield'] === "") {
              if (copy['Sub Crop'] === 'Corn after Soybean' && copy['BMP'] !== 'GrassedWaterways' && copy['BMP'] !== 'Terraces' && copy['BMP'] !== 'Buffers') {
                copy["EAA"] *= this.getBMPAreas[i][2].bmpArea;
                copy["# Labor Hours"] *= this.getBMPAreas[i][2].bmpArea;
              }
              if (copy['Sub Crop'] === 'Corn after Corn' && copy['BMP'] !== 'GrassedWaterways' && copy['BMP'] !== 'Terraces' && copy['BMP'] !== 'Buffers') {
                copy["EAA"] *= this.getBMPAreas[i][3].bmpArea;
                copy["# Labor Hours"] *= this.getBMPAreas[i][3].bmpArea;
              }
            }
            if (copy['PerAcreORPerYield'] === 'per yield') {
              if (copy['Sub Crop'] === 'Corn after Soybean' && copy['BMP'] !== 'GrassedWaterways' && copy['BMP'] !== 'Terraces' && copy['BMP'] !== 'Buffers') {
                copy['EAA'] *= this.getBMPAreas[i][2].landUseYield;
                copy['# Labor Hours'] *= this.getBMPAreas[i][2].landUseYield;
              }
              if (copy['Sub Crop'] === 'Corn after Corn' && copy['BMP'] !== 'GrassedWaterways' && copy['BMP'] !== 'Terraces' && copy['BMP'] !== 'Buffers') {
                  // console.log("CONS CORN BMP AREA: ",copy['Cost Name'] , copy['EAA'], "BMP AREA: ", this.getBMPAreas[i][3].landUseYield )
                copy['EAA'] *= this.getBMPAreas[i][3].landUseYield;
                copy['# Labor Hours'] *= this.getBMPAreas[i][3].landUseYield;
              }
            }
            if (copy['Sub Crop'] === 'Corn after Soybean' && copy['BMP'] === 'GrassedWaterways') {
              copy['EAA'] *= Math.round(1000 * this.getBMPAreas[i][2].grassedWaterwaysAreaTotal) / 1000;
              copy['# Labor Hours'] *= (Math.round(1000 * this.getBMPAreas[i][2].grassedWaterwaysAreaTotal) / 1000) /30
            } else if (copy['Sub Crop'] === 'Corn after Soybean' && copy['BMP'] === 'Terraces') {
              copy['EAA'] *= Math.round(1000 * this.getBMPAreas[i][2].terraceAreaTotal) / 1000;
              copy['# Labor Hours'] *= (Math.round(1000 * this.getBMPAreas[i][2].terraceAreaTotal) / 1000) / 30
            } else if (copy['Sub Crop'] === 'Corn after Soybean' && copy['BMP'] === 'Buffers') {
              copy['EAA'] *= Math.round(1000 * this.getBMPAreas[i][2].bufferAreaTotal) / 1000;
              copy['# Labor Hours'] *= (Math.round(1000 * this.getBMPAreas[i][2].bufferAreaTotal) / 1000) /50
            }

            if (copy['Sub Crop'] === 'Corn after Corn' && copy['BMP'] === 'GrassedWaterways') {
              copy['EAA'] *= Math.round(1000 * this.getBMPAreas[i][3].grassedWaterwaysAreaTotal) / 1000;
              copy['# Labor Hours'] *= (Math.round(1000 * this.getBMPAreas[i][3].grassedWaterwaysAreaTotal) / 1000) / 30
            } else if (copy['Sub Crop'] === 'Corn after Corn' && copy['BMP'] === 'Terraces') {
              copy['EAA'] *= Math.round(1000 * this.getBMPAreas[i][3].terraceAreaTotal) / 1000;
              copy['# Labor Hours'] *= (Math.round(1000 * this.getBMPAreas[i][3].terraceAreaTotal) / 1000)/30;
            } else if (copy['Sub Crop'] === 'Corn after Corn' && copy['BMP'] === 'Buffers') {
              copy['EAA'] *= Math.round(1000 * this.getBMPAreas[i][3].bufferAreaTotal) / 1000;
              copy['# Labor Hours'] *= (Math.round(1000 * this.getBMPAreas[i][3].bufferAreaTotal) / 1000)/50;
            }

          }

          //Conservation Soybean values are calculated separately due to BMP budgets.
          //Specially made verbose to reduce confusion.
          //Check calculateBMPBugets function.
          //Conservation Soybean is numLandUse 1. DO NOT CONFUSE THIS WITH LU_ID.
          //numLandUse values are only used for calculateBMPBudgets function.
          else if (copy['LU_ID'] === "4") {
            if (copy['PerAcreORPerYield'] === "" && copy['BMP'] !== 'GrassedWaterways' && copy['BMP'] !== 'Terraces' && copy['BMP'] !== 'Buffers') {
              copy["EAA"] *= this.getBMPAreas[i][1].bmpArea;
              copy["# Labor Hours"] *= this.getBMPAreas[i][1].bmpArea;
            }
            if (copy['PerAcreORPerYield'] === 'per yield') {
              copy['EAA'] *= this.getBMPAreas[i][1].landUseYield
              copy['# Labor Hours'] *= this.getBMPAreas[i][1].landUseYield
            }
            if (copy['BMP'] === 'GrassedWaterways') {
              copy['EAA'] *= Math.round(1000 * this.getBMPAreas[i][1].grassedWaterwaysAreaTotal) / 1000
              copy['# Labor Hours'] *= (Math.round(1000 * this.getBMPAreas[i][1].grassedWaterwaysAreaTotal) / 1000) / 30
            } else if (copy['BMP'] === 'Terraces') {
              copy['EAA'] *= Math.round(1000 * this.getBMPAreas[i][1].terraceAreaTotal) / 1000
              copy['# Labor Hours'] *= (Math.round(1000 * this.getBMPAreas[i][1].terraceAreaTotal) / 1000)/ 30
            } else if (copy['BMP'] === 'Buffers') {
              copy['EAA'] *= Math.round(1000 * this.getBMPAreas[i][1].bufferAreaTotal) / 1000
              copy['# Labor Hours'] *= (Math.round(1000 * this.getBMPAreas[i][1].bufferAreaTotal) / 1000) / 50
            }
          }


          /*
            START FORREST CHECKS. Broken down by 25/60/70 Year Budgets.
           */
          else if (copy['LU_ID'] === "10") {
            if (copy['Sub Crop'] === "Twentyfive") {
              copy['EAA'] *= this.getForrestYields[i][1].twentyFiveAreaCons;
              copy['# Labor Hours'] *= this.getForrestYields[i][1].twentyFiveAreaCons / 25
            }
            if (copy['Sub Crop'] === "Sixty") {
              copy['EAA'] *= this.getForrestYields[i][1].sixtyAreaCons;
              copy['# Labor Hours'] *= this.getForrestYields[i][1].sixtyAreaCons / 60
            }
            if (copy['Sub Crop'] === "Seventy") {
              copy['EAA'] *= this.getForrestYields[i][1].seventyAreaCons;
              copy['# Labor Hours'] *= this.getForrestYields[i][1].seventyAreaCons / 70
            }
          } else if (copy['LU_ID'] === "11") {
            if (copy['Sub Crop'] === "Twentyfive") {
              copy['EAA'] *= this.getForrestYields[i][1].twentyFiveAreaConv;
              copy['# Labor Hours'] *= this.getForrestYields[i][1].twentyFiveAreaConv / 25
            }
            if (copy['Sub Crop'] === "Sixty") {
              copy['EAA'] *= this.getForrestYields[i][1].sixtyAreaConv;
              copy['# Labor Hours'] *= this.getForrestYields[i][1].sixtyAreaConv / 60
            }
            if (copy['Sub Crop'] === "Seventy") {
              copy['EAA'] *= this.getForrestYields[i][1].seventyAreaConv;
              copy['# Labor Hours'] *= this.getForrestYields[i][1].seventyAreaConv / 70
            }
          }

          /*
           START PER YIELD Check on - Cons and Conv Soybean, Alfalfa, Grasshay, Switchgrass, Mixed Fruits and Vegetables (MF&V broken up into subcrops).
           */

          else if (copy['PerAcreORPerYield'] === 'per yield') {
            if (copy['LU_ID'] === "3") {
              copy['EAA'] *= this.getCropYields[i][1].convSoybeanYield
              copy['# Labor Hours'] *= this.getCropYields[i][1].convSoybeanYield

            } else if (copy['LU_ID'] === "5") {
              copy['EAA'] *= this.getCropYields[i][1].alfalfaYield
              copy['# Labor Hours'] *= this.getCropYields[i][1].alfalfaYield
            } else if (copy['LU_ID'] === "8") {
              copy['EAA'] *= this.getCropYields[i][1].grasshayYield
              copy['# Labor Hours'] *= this.getCropYields[i][1].grasshayYield
            } else if (copy['LU_ID'] === "12") {
              copy['EAA'] *= this.getCropYields[i][1].switchgrassYield
              copy['# Labor Hours'] *= this.getCropYields[i][1].switchgrassYield
            } else if (copy['LU_ID'] === "15") {
              //multiplied by 4 to negate previous division; was needed per acre, not per yield
              if (copy['Sub Crop'] === 'Green Beans') {
                copy['EAA'] *= 4 * this.getCropYields[i][1].mixedFVYield * (4.2 / 30.326)
                copy['# Labor Hours'] *= 4 * this.getCropYields[i][1].mixedFVYield * (4.2 / 30.326)
              } else if (copy['Sub Crop'] === 'Winter Squash') {
                copy['EAA'] *= 4 * this.getCropYields[i][1].mixedFVYield * (11.25 / 30.326)
                copy['# Labor Hours'] *= 4 * this.getCropYields[i][1].mixedFVYield * (11.25 / 30.326)
              } else if (copy['Sub Crop'] === 'Grapes (Conventional)') {
                copy['EAA'] *= 4 * this.getCropYields[i][1].mixedFVYield * (13.376 / 30.326)
                copy['# Labor Hours'] *= 4 * this.getCropYields[i][1].mixedFVYield * (13.376 / 30.326)
              }
            }
          }

          /*
          If land use is not per yield then add here.
           */
          else {

              copy["EAA"] *= landUses[i][copy['LU_ID']];
              copy["# Labor Hours"] *= landUses[i][copy['LU_ID']];

          }

        }

        this.mapData[i].push(copy)
        this.totalWatershedCost[i][0].cost +=  !isNaN(copy['EAA']) ? copy['EAA'] : 0
      })

    }


    this.watershedTotals();
    this.chart3Data();
    this.chart3DataByLU();
    this.graphic5information();
    this.divideByCategory(['Action - Cost Type', 'Time - Cost Type', 'Fixed/Variable']);
    this.chart4Information(['Action - Cost Type', 'Time - Cost Type']);
    this.calcSubcrops();

    //TESTING ONLY
    for(let k = 1; k <= boardData[currentBoard].calculatedToYear; k++) {
      //console.log("TOTAL WATERSHED COST FOR YEAR: ",k, "=",this.totalWatershedCost[k][0].cost);
    }



  };

  // TESTING WATERSHED TOTALS
  this.watershedTotals = () => {

    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      this.totalWatershedRevenue[i]= [{revenue: 0}];
      for(let j = 0; j < 16; j ++){
        this.totalWatershedRevenue[i][0].revenue += !isNaN(this.scaledRev[i][j]) ? this.scaledRev[i][j]: 0

      }
      //console.log("TOTAL WATERSHED REVENUE FOR YEAR: ", i , "=",this.totalWatershedRevenue[i][0].revenue);
    }

  };


  //this is unoptimized for finding the amount of corn after corn and corn after soybeans
  //If any sort of progress bar requires the economics module it is recomended to alter the method in which data is updated
  /**
   * This function breaks down Conv and Cons Corn into Corn after Corn and Corn after Soybean and calculates the yield for each.
   * NOTE: CONSERVATION CORN values are retrieved from BMP budgets function below.
   */
  calculateCornAfters = () =>{
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      this.cornAfters[i] = [,
        { ConvCornAfterSoybean:0, ConvCornAfterCorn:0,
          ConvCornAfterSoybeanYield: 0, ConvCornAfterCornYield: 0,
        }
        ];
      for (var j = 0; j < boardData[currentBoard].map.length; j++) {
        if(boardData[currentBoard].map[j].landType[i] === 1){ //if there it is corn
          if(boardData[currentBoard].map[j].landType[i-1] === 3 || boardData[currentBoard].map[j].landType[i-1] === 4){ //if the corn is after soybean
            this.cornAfters[i][1].ConvCornAfterSoybean += boardData[currentBoard].map[j].area;
            this.cornAfters[i][1].ConvCornAfterSoybeanYield += boardData[currentBoard].map[j].results[i]['calculatedYieldTile'] * boardData[currentBoard].map[j].area
          }
          else {
            this.cornAfters[i][1].ConvCornAfterCorn += boardData[currentBoard].map[j].area
            this.cornAfters[i][1].ConvCornAfterCornYield += boardData[currentBoard].map[j].results[i]['calculatedYieldTile'] * boardData[currentBoard].map[j].area
          }
        }

      }
    }
  }

  /**
   * This functions calculates the yield for: Cons and Conv Soybean, Alfalfa, Grasshay, Switchgrass and Mixed Fruits and Vegetables.
   * The function  iterates over the whole map and check for each land use by LU_ID (for example: 3 for Conv Soybean).
   * It then gets the yield for each cell (828 cells on map) and check adds to the total yield variable for that land use.
   */
  calculatePerYieldCrops = () =>{
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){

      this.getCropYields[i] = [,
        {convSoybeanYield : 0, consSoybeanYield: 0, alfalfaYield: 0, switchgrassYield: 0,  grasshayYield: 0, mixedFVYield: 0},
      ];

      for (let j = 0; j < boardData[currentBoard].map.length; j++){
          if(boardData[currentBoard].map[j].landType[i] === 3){
            this.getCropYields[i][1].convSoybeanYield += boardData[currentBoard].map[j].results[i]['calculatedYieldTile'] * boardData[currentBoard].map[j].area
          }
          if(boardData[currentBoard].map[j].landType[i] === 5){
            this.getCropYields[i][1].alfalfaYield += boardData[currentBoard].map[j].results[i]['calculatedYieldTile'] * boardData[currentBoard].map[j].area
          }
          if(boardData[currentBoard].map[j].landType[i] === 8){
            this.getCropYields[i][1].grasshayYield += boardData[currentBoard].map[j].results[i]['calculatedYieldTile'] * boardData[currentBoard].map[j].area
          }
          if(boardData[currentBoard].map[j].landType[i] === 12){
            this.getCropYields[i][1].switchgrassYield += boardData[currentBoard].map[j].results[i]['calculatedYieldTile'] * boardData[currentBoard].map[j].area
          }
          if(boardData[currentBoard].map[j].landType[i] === 15){
            this.getCropYields[i][1].mixedFVYield += boardData[currentBoard].map[j].results[i]['calculatedYieldTile'] * boardData[currentBoard].map[j].area
          }
      }
    }
  };


  /**
   * This function is used to separate out the area for each soil type to use for Cons and Conv Forests which are now separated by 25/60/75 year budgets.
   * We iterate through the map and check each cell for soilType. Each soilType goes into either 25 or 60 or 70 year area variable.
   * twentyFiveArea, sixtyAre, seventyArea variable store the sum of area based on soil types.
   * For example: If Soil Type for cell is C/L/O it would be added to twentyFiveArea for conv or cons forest.
   * TODO
   */
  calculateForrestYields = () => {
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      this.getForrestYields[i] = [,
        {twentyFiveAreaConv: 0, sixtyAreaConv:0, seventyAreaConv:0, twentyFiveAreaCons:0, sixtyAreaCons: 0, seventyAreaCons:0}
      ];
      for (let j = 0; j < boardData[currentBoard].map.length; j++) {
        if (boardData[currentBoard].map[j].landType[i] === 10){
          if(["C", "L", "O"].indexOf(boardData[currentBoard].map[j]['soilType']) !==- 1){
            this.getForrestYields[i][1].twentyFiveAreaCons += boardData[currentBoard].map[j].area;
          }
          if(["N", "K", "T", "B"].indexOf(boardData[currentBoard].map[j]['soilType']) !==- 1){
            this.getForrestYields[i][1].sixtyAreaCons += boardData[currentBoard].map[j].area;
          }
          if(["A", "D", "G", "M", "Q", "Y"].indexOf(boardData[currentBoard].map[j]['soilType']) !==- 1){
            this.getForrestYields[i][1].seventyAreaCons += boardData[currentBoard].map[j].area;
          }
        }
        if(boardData[currentBoard].map[j].landType[i] === 11){
          if(["C", "L", "O"].indexOf(boardData[currentBoard].map[j]['soilType']) !==- 1){
            this.getForrestYields[i][1].twentyFiveAreaConv += boardData[currentBoard].map[j].area;
          }
          if(["N", "K", "T", "B"].indexOf(boardData[currentBoard].map[j]['soilType']) !==- 1){
            this.getForrestYields[i][1].sixtyAreaConv += boardData[currentBoard].map[j].area;
          }
          if(["A", "D", "G", "M", "Q", "Y"].indexOf(boardData[currentBoard].map[j]['soilType']) !==- 1){
            this.getForrestYields[i][1].seventyAreaConv += boardData[currentBoard].map[j].area;
            //console.log(this.getForrestYields[i][1].seventyAreaConv += boardData[currentBoard].map[j].area);
          }
        }
      }
    }
  };

  //Conservation Corn After Soybean set to Land Use 1
  //Conservation Corn After Corn set to Land Use 2
  //Conservation Soybean set to Land Use 3
  /**
   * This function is used to calculate BMP Budget values for Conservation CORN and Conservation SOYBEAN ONLY.
   * Implemented based on Issue 727. Function laid out in the exact order.
   * First we check for Buffers based on StreamNetwork value. Next check topography value to implement Terraces and lastly implement Grassed Waterways.
   * this.getBMPAreas object array has 4 objects. The first one is a dummy object to avoid undefined errors. (Not the best approach but we needed to store
   * values for cells that are not conservation corn or soybean)
   * numLandUse values are hard coded to 1 = Cons Soybean; 2 = Cons Corn after Soybean; 3 = Cons Corn after Corn. DO NOT CONFUSE THIS WITH LU_ID.
   */
  calulateBMPBudgets = () => {
    // TODO pass an inflation factor here
    let fixedBufferArea = 0.52486;
    let numLandUse = 0;

    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++) {
      this.getBMPAreas[i] = [
        {bmpArea: 0, bufferAreaTotal: 0, grassedWaterwaysAreaTotal: 0, terraceAreaTotal: 0, landUseYield: 0},
        {bmpArea: 0, bufferAreaTotal: 0, grassedWaterwaysAreaTotal: 0, terraceAreaTotal: 0, landUseYield: 0},
        {bmpArea: 0, bufferAreaTotal: 0, grassedWaterwaysAreaTotal: 0, terraceAreaTotal: 0, landUseYield: 0},
        {bmpArea: 0, bufferAreaTotal: 0, grassedWaterwaysAreaTotal: 0, terraceAreaTotal: 0, landUseYield: 0},
      ];


      for (let j = 0; j < boardData[currentBoard].map.length; j++) {
        let cellArea = boardData[currentBoard].map[j].area;

        if(boardData[currentBoard].map[j].landType[i] === 4) {
            numLandUse = 1; //SOYBEAN
        }
        else if(boardData[currentBoard].map[j].landType[i] === 2){
          if(boardData[currentBoard].map[j].landType[i-1] === 3 || boardData[currentBoard].map[j].landType[i-1] === 4) { //if the corn is after soybean
            numLandUse = 2; //CORN AFTER SOYBEAN
          }
          else {
            numLandUse = 3; //CORN AFTER CORN
          }
        }
        else {
          numLandUse = 0;
        }

        if (boardData[currentBoard].map[j].streamNetwork === "1") {
          cellArea = (cellArea - fixedBufferArea) * 0.90;
          this.getBMPAreas[i][numLandUse].bufferAreaTotal += fixedBufferArea;
        }
        else {
          cellArea = 0.90 * cellArea;
        }

        //Implement Terraces
        if(boardData[currentBoard].map[j].topography >= 2){

          if(boardData[currentBoard].map[j].topography === 2){
            this.getBMPAreas[i][numLandUse].terraceAreaTotal += boardData[currentBoard].map[j].area * 0.0546;
          }
          else if(boardData[currentBoard].map[j].topography === 3){
            this.getBMPAreas[i][numLandUse].terraceAreaTotal +=  boardData[currentBoard].map[j].area * 0.0658;
          }
          else if(boardData[currentBoard].map[j].topography === 4){
            this.getBMPAreas[i][numLandUse].terraceAreaTotal +=  boardData[currentBoard].map[j].area * 0.0820;
          }
          else if(boardData[currentBoard].map[j].topography === 5){
            this.getBMPAreas[i][numLandUse].terraceAreaTotal +=  boardData[currentBoard].map[j].area * 0.0938;
          }

        }

        //Implement Grasses Waterways
        if(boardData[currentBoard].map[j].streamNetwork !== "1" && boardData[currentBoard].map[j].topography < 2){
          this.getBMPAreas[i][numLandUse].grassedWaterwaysAreaTotal += 0.10 * boardData[currentBoard].map[j].area;
        }

        else if (boardData[currentBoard].map[j].streamNetwork === "1" && boardData[currentBoard].map[j].topography < 2){
          this.getBMPAreas[i][numLandUse].grassedWaterwaysAreaTotal += 0.10 * (boardData[currentBoard].map[j].area - fixedBufferArea);
        }

        else {
          if(boardData[currentBoard].map[j].topography === 2){
            this.getBMPAreas[i][numLandUse].grassedWaterwaysAreaTotal += boardData[currentBoard].map[j].area * 0.0454;
          }
          else if(boardData[currentBoard].map[j].topography === 3){
            this.getBMPAreas[i][numLandUse].grassedWaterwaysAreaTotal += boardData[currentBoard].map[j].area * 0.0342;
          }
          else if(boardData[currentBoard].map[j].topography === 4){
            this.getBMPAreas[i][numLandUse].grassedWaterwaysAreaTotal += boardData[currentBoard].map[j].area * 0.0180;
          }
          else if(boardData[currentBoard].map[j].topography === 5){
            this.getBMPAreas[i][numLandUse].grassedWaterwaysAreaTotal += boardData[currentBoard].map[j].area * 0.0062;
          }
        }
        this.getBMPAreas[i][numLandUse].bmpArea += cellArea;

        this.getBMPAreas[i][numLandUse].landUseYield += boardData[currentBoard].map[j].results[i]['calculatedYieldTile'] * cellArea;
        }
      }

  };

  /**
   * This function is used to calculate acreage of each soil type if the land use if Cons Forest (LU_ID = 10) or Conv Forest (LU_ID =11)
   * this.getSoilArea object array has 4 objects. The first one is a dummy object to avoid undefined errors. (Not the best approach but we needed to store
   * values for cells that are not conservation forest or conventional forest)
   */
  calculateForestAreaBySoil = () => {
    // Yes, I rewrite this code the switch is unnecessary, and complicates readability
    for (let i = 1; i <= boardData[currentBoard].calculatedToYear; i++) {
      // Initialize getSoilArea for year 'i'
      this.getSoilArea[i] = [
        {"A": 0, "B": 0, "C": 0, "D": 0, "G": 0, "K": 0, "L": 0, "M": 0, "N": 0, "O": 0, "Q": 0, "T": 0, "Y": 0},
        {"A": 0, "B": 0, "C": 0, "D": 0, "G": 0, "K": 0, "L": 0, "M": 0, "N": 0, "O": 0, "Q": 0, "T": 0, "Y": 0},
        {"A": 0, "B": 0, "C": 0, "D": 0, "G": 0, "K": 0, "L": 0, "M": 0, "N": 0, "O": 0, "Q": 0, "T": 0, "Y": 0},
      ];

      for (let j = 0; j < boardData[currentBoard].map.length; j++) {
        let numLandUse = 0;
        if (boardData[currentBoard].map[j].landType[i] === 10) {
          numLandUse = 1;
        }
        if (boardData[currentBoard].map[j].landType[i] === 11) {
          numLandUse = 2;
        }

        // Get the soil type and area directly
        let soilType = boardData[currentBoard].map[j]['soilType'];
        let area = boardData[currentBoard].map[j].area;

        // Increment the area for the appropriate soil type and land use without using a switch
        // perfect we have just reduced this code by about 15 lines
        if (this.getSoilArea[i][numLandUse].hasOwnProperty(soilType)) {
          this.getSoilArea[i][numLandUse][soilType] += area;

        }
      }
    }
  };
  const dropDuplicates = function (array, isEqual) {
    /**
     * Removes duplicates from a multidimensional array.
     * @param {Array} array - The multidimensional array to process.
     * @param {Function} [isEqual] - Optional function to define how to compare rows.
     *                               If not provided, compares the first two elements.
     * @returns {Array} - A new array with duplicates removed.
     */
    return array.reduce((accumulator, currentRow) => {
      const isDuplicate = accumulator.some(row => {
        return isEqual ? isEqual(row, currentRow) : row[0] === currentRow[0] && row[1] === currentRow[1];
      });

      if (!isDuplicate) {
        accumulator.push(currentRow);
      }
      return accumulator;
    }, []);
  }
  const filteredArray = function(arrayData, landUseType, soilType, precipLevel) {
    let filterRows = arrayData.filter(row =>
        row.soil_type === soilType &&
        row.land_use_code === landUseType &&
        row.precipitation_level === precipLevel

    );
    return dropDuplicates(filterRows)
  };

  collectTotalWatershedGHGData = () => {
    /**
     * Collects and aggregates greenhouse gas (GHG) data based on land use and soil type
     * over a specified range of years for the current board configuration.
     *
     * This function iterates through each year up to the 'calculatedToYear' specified in
     * the board data. For each year, it initializes arrays to hold data for greenhouse gases,
     * land use areas, and GHGs by land use type. The function then processes the data for each
     * land use tile, updating the relevant GHG values and land use areas based on soil type
     * and precipitation data.
     *
     * Specifically, the function performs the following actions:
     * - Initializes GHG data structures for each year.
     * - Iterates through each land use tile in the current board.
     * - Retrieves and processes soil type, land use type, and area data.
     * - Aggregates GHG values (SOC, N2O, and CO2 equivalent) based on the filtered data
     *   from the loaded greenhouse gas dataset.
     * - Converts land area from acres to hectares during calculations.
     *
     * The data is stored in the following structures:
     * - `this.landUseArea[i]`: An array holding the total area for each land use type per year.
     * - `this.GHGs[i]`: An array of objects holding total GHG emissions (CH4, CO2-e, N2O, SOC) for each year.
     * - `this.GHGsBylandUse[i]`: An array of objects categorizing GHG emissions by land use type.
     *
     * Logs the resulting GHG data and aggregated results to the console for verification.
     * the data base for this function is loaded by d3 library at the top of this module. the .csv name is kpi.csv in front-end and in the root folder
     * @returns {void} This function does not return any value; it updates instance variables directly.
     */

    for (let i = 1; i <= boardData[currentBoard].calculatedToYear; i++) {
      // Initialize getSoilArea for year 'i'
      let _PrecipitationData = boardData[currentBoard].precipitation[i];
      _PrecipitationData  = _PrecipitationData.toString();
      // This is to display greenhouse gases by land use types
      this.ghgTypes = [];
      this.landUseArea[i] =
          [{
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
            6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
            11: 0, 12: 0, 13: 0, 14: 0, 15: 0
          }]
      // Repeats by four the object inside, for storing kpi, carbon methane and nitrous oxide
      this.GHGsBylandUse[i] = Array(4).fill().map(() =>(
          {0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0}
      ));

      this.GHGs[i] = [{'CH4':0, 'C02-e':0, 'N2O':0, 'SOC':0}]
      this.ghgTypes[i] = [{'ch4': 0, 'n2o': 0, 'co2':0}]

      for (let j = 0; j < boardData[currentBoard].map.length; j++) {
        // Get the soil type and area directly
        let getSoilType = boardData[currentBoard].map[j]['soilType'];
        let landUseTileID= 0;
        landUseTileID = boardData[currentBoard].map[j]['landType'][1];
        let  cellLandArea  = boardData[currentBoard].map[j].area;


        // Increment the area for the appropriate soil type and land use without using a switch
        // perfect we have just reduced this code by about 15 lines
        if (this.landUseArea[i][0].hasOwnProperty(landUseTileID)) {
          this.landUseArea[i][0][landUseTileID] +=  cellLandArea ;

          if (landUseTileID >0) {
            let ludID = landUseTileID.toString();
            /**
             * Apparently, the column for landUseType, soilType, precipitation levels in the kpi.csv data are named as follows:
             * [code, SoilType, precipitation_level]  if these columns are changed in that file, this method won't work if not updated from the source file for filterByLandUseAndSoilType
             According to our data, the  'filterByLandUseAndSoilType' will always return one entity or row because duplicates are removed
             */
           // let gasesData = filterByLandUseAndSoilType(this.loadedGHGData, ludID, getSoilType, _PrecipitationData);
            let gasesData = filteredArray(this.loadedGHGData, ludID, getSoilType, _PrecipitationData);
            console.log('length of filtered data:', gasesData.length);
            // Convert to hectares
            let soilArea = cellLandArea * 0.404685642;
            // This will need to be converted to carbon dioxide equivalents
            let soc= parseFloat(gasesData[0]['to_carb'])/ 35 * soilArea;
            let n20 = parseFloat(gasesData[0]['TopN2O']) * soilArea;
            let kpi = parseFloat(gasesData[0]['kpi']) * soilArea
            numLandUseCode  = Number(ludID);
            this.GHGs[i][0]['SOC'] += soc;
            this.GHGs[i][0]['N2O'] += n20;
            this.GHGs[i][0]['C02-e'] +=kpi;
            // zero because the object is inside 0= kpi, 1 = carbon, 2= methane, 3 = nitrous oxide
            this.GHGsBylandUse[i][0][numLandUseCode] += kpi;
            this.GHGsBylandUse[i][1][numLandUseCode] += soc;
            this.GHGsBylandUse[i][2][numLandUseCode] += soc;
            this.GHGsBylandUse[i][3][numLandUseCode] += n20;

          }

        }
      }
    }

    console.log(this.GHGs);
    console.log(this.GHGsBylandUse);
  };

      calculateCornYieldRate = (soilType) => {
      var yieldBaseRates = [223, 0, 214, 206, 0, 200, 210, 221, 228, 179, 235, 240, 209, 0];

      switch (soilType) {
          case 'A':
              return yieldBaseRates[0];

          case 'B':
              return yieldBaseRates[1];

          case 'C':
              return yieldBaseRates[2];

          case 'D':
              return yieldBaseRates[3];

          case 'G':
              return yieldBaseRates[4];

          case 'K':
              return yieldBaseRates[5];

          case 'L':
              return yieldBaseRates[6];

          case 'M':
              return yieldBaseRates[7];

          case 'N':
              return yieldBaseRates[8];

          case 'O':

              return yieldBaseRates[9];

          case 'Q':
              return yieldBaseRates[10];

          case 'T':
              return yieldBaseRates[11];

          case 'Y':
              return yieldBaseRates[12];

          case 'NA':
              return yieldBaseRates[13];

          case '0':
              return yieldBaseRates[13];
      } //end switch

  };


  calculateRent = () => {
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      this.getRent[i] = [{
        consCornSoybeanRent: 0, consCornCornRent: 0, convCornSoybeanRent: 0, convCornCornRent: 0,
        consSoybeanRent: 0, convSoybeanRent: 0,
        prairieRent: 0,
        consForestRent: 0, convForestRent: 0,
        swithgrassRent: 0,
        swrbRent: 0,
        wetlandRent: 0,
        mfvRent: 0
      }];
      for (let j = 0; j < boardData[currentBoard].map.length; j++) {
          let cornYield = calculateCornYieldRate(boardData[currentBoard].map[j].soilType) * 1.16; //$1.16 base/bu corn yield
          let acreRate = 77; //$77 acre
          let landUse = boardData[currentBoard].map[j].landType[i];
          let tileArea = boardData[currentBoard].map[j].area;
          let rent = 0;
          if(cornYield > acreRate){
            rent = cornYield;
          }
          else {
            rent = acreRate;
          }
          // console.log("CELL: ", j, "YIELD RATE: ", calculateCornYieldRate(boardData[currentBoard].map[j].soilType))
          switch(landUse){

            case 1:
              if(boardData[currentBoard].map[j].landType[i-1] === 3 || boardData[currentBoard].map[j].landType[i-1] === 4){
                this.getRent[i][0].convCornSoybeanRent += rent * tileArea;

              }
              else{
                this.getRent[i][0].convCornCornRent += rent  * tileArea;
              }
              break;
            case 2:
              if(boardData[currentBoard].map[j].landType[i-1] === 3 || boardData[currentBoard].map[j].landType[i-1] === 4){
                this.getRent[i][0].consCornSoybeanRent += rent  * tileArea;
              }
              else{
                this.getRent[i][0].consCornCornRent += rent  * tileArea;
              }
              break;
            case 3:
              this.getRent[i][0].convSoybeanRent += rent  * tileArea;
              break;
            case 4:
              this.getRent[i][0].consSoybeanRent += rent  * tileArea;
              break;
            case 9:
              this.getRent[i][0].prairieRent += rent  * tileArea;
              break;
            case 10:
              this.getRent[i][0].consForestRent += rent  * tileArea;
              break;
            case 11:
              this.getRent[i][0].convForestRent += rent  * tileArea;
              break;
            case 12:
              this.getRent[i][0].swithgrassRent += rent  * tileArea;
              break;
            case 13:
              this.getRent[i][0].swrbRent += rent  * tileArea;
              break;
            case 14:
              this.getRent[i][0].wetlandRent += rent  * tileArea;
              break;
            case 15:
              this.getRent[i][0].mfvRent += rent  * tileArea;
              break;
            default:
              break;
          }
      }
    }
  };


  this.calcSubcrops = function(){
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      this.dataSubcrop[i] = {};
      this.mapData[i].forEach(dataPoint => {
        if(dataPoint['Sub Crop']){
          if(!this.dataSubcrop[i][dataPoint['Land-Use']]){
            this.dataSubcrop[i][dataPoint['Land-Use']] = {};
          }
          if(!this.dataSubcrop[i][dataPoint['Land-Use']][dataPoint['Sub Crop']]){
            this.dataSubcrop[i][dataPoint['Land-Use']][dataPoint['Sub Crop']] = 0;
          }
          this.dataSubcrop[i][dataPoint['Land-Use']][dataPoint['Sub Crop']] =
          Math.round(1000*this.dataSubcrop[i][dataPoint['Land-Use']][dataPoint['Sub Crop']] + 1000*Number.parseFloat(dataPoint['EAA']))/1000
        }
      })
    }
  }


}

var economics = new Economics();

//kind of a precalc? Not really but its calculated before its needed.
// I still think this has cost to incur but time and debugging will tell


