var Economics = function () {
  this.rawData;
  this.mapData = [];
  this.data = [];
  this.data4 = [];

  this.dataSubcrop = {};
  this.data3 = [];
  this.data3ByLU = [];
  this.data5=[];
  this.rawRev=[];
  this.scaledRev=[];
  this.cornAfters=[]

//the number of years in the cycle so that we can divide to get the yearly cost; The -1 accounts for the 'none' land use.
  yearCosts = [-1,1,1,1,1,4,1,1,4,40,40,40,11,7,50,{'Grapes (Conventional)': 22 * 4,'Green Beans': 1 * 4,'Winter Squash': 1 * 4,'Strawberries': 3 *4}]
  d3.csv('./revenue.csv', (data) => {
    this.rawRev = data;
  })

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
            this.data[i][dataPoint['LU_ID']][cat][dataPoint[cat]] = Math.round(1000*Number.parseFloat(dataPoint['Value']))/1000;
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
            Math.round(1000*(this.data[i][dataPoint['LU_ID']][cat][dataPoint[cat]] + Number.parseFloat(dataPoint['Value'])))/1000
            this.data[i][dataPoint['LU_ID']][cat][dataPoint[cat]]
          }
          this.data[i][dataPoint['LU_ID']][cat].total = //either way add it to the total
          Math.round(1000*this.data[i][dataPoint['LU_ID']][cat].total + 1000*Number.parseFloat(dataPoint['Value']))/1000
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
    d3.csv('./budgets.csv', (data) => {
      this.rawData=data;
      this.rawData.forEach(dataPoint => {
        let id = Number.parseInt(dataPoint['LU_ID'])
        divisionForLU = (typeof yearCosts[id] === 'number') ? yearCosts[id]:  yearCosts[id][dataPoint['Sub Crop']];
        dataPoint["Value"] /= divisionForLU;
        dataPoint["# Labor Hours"] /= divisionForLU;
      })
    })
  //graph
  //graphic 4 extract data from raw data
  this.chart4Information = function(lists) {
    for(var i=1;i<=boardData[currentBoard].calculatedToYear;i++){
      this.data4[i]=[];
      this.mapData[i].forEach(dataPoint => {
        if(dataPoint['Value']!=0){
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
          this.data3[i].time[dataPoint['Time - Cost Type']] += Number.parseFloat(dataPoint['Value']);
        }
        else {
          this.data3[i].time[dataPoint['Time - Cost Type']] = Number.parseFloat(dataPoint['Value']);
        }
        if(this.data3[i].action[dataPoint['Action - Cost Type']]){
          this.data3[i].action[dataPoint['Action - Cost Type']] += Number.parseFloat(dataPoint['Value']);
        }
        else {
          this.data3[i].action[dataPoint['Action - Cost Type']] = Number.parseFloat(dataPoint['Value']);
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

        this.data3ByLU[i][dataPoint['Land-Use']].time[dataPoint['Time - Cost Type']] += dataPoint.Value;
        this.data3ByLU[i][dataPoint['Land-Use']].action[dataPoint['Action - Cost Type']] += dataPoint.Value;

        this.data3ByLU[i][dataPoint['Land-Use']].toggleVal = -1;
      })
    }
  }

  this.mapChange = function (){ //called when the map changes in order to edit the intermediate step.
    calculateCornAfters();
    let landUses = [];
    this.mapData = [];
    //Less than ideal coding, but given how Totals is structured the easiest way
    //I found to map Land Use IDS to total LandUse without recalculation
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      landUses[i] = [];
      this.mapData[i] = [];
      this.scaledRev[i] = [];
      let keys = Object.keys(Totals.landUseResults[0]);
      for(let j = 0; j < keys.length; j++){
        let key = keys[j];
        //this substring is to link different keys from different objects together... again less than ideal
        landUses[i][LandUseType[key.substring(0, key.length - 7)]] = Totals.landUseResults[i][key]
      }
      this.rawRev.forEach(dataPoint => {
        if(dataPoint['Units'] === '$/acre'){
          if(dataPoint['LU_ID'] == 15){
            let fruitsPrecipMultiplier = 1; //since the csv now accounts for acres instead of the actual yield for revenue purposes we have to use the yield precip multiplier
            if(boardData[currentBoard].precipitation[i] === 45.1) fruitsPrecipMultiplier = .75;
            if(boardData[currentBoard].precipitation[i] === 36.5) fruitsPrecipMultiplier = .9;
            value = parseFloat(dataPoint['Revenue/acre/year']) * landUses[i][dataPoint['LU_ID']] * fruitsPrecipMultiplier / 4;
          }
          else {
            value = parseFloat(dataPoint['Revenue/acre/year']) * landUses[i][dataPoint['LU_ID']];
          }
        }
        //woodlands can't be treated the same since they are the only land use where the soil type changes the value of the wood not just the amount of wood.
        //Where the rest of the revenue above can multiply the output by a certain price: we need to actually find the soil that all the woodlands are on.
        else if(dataPoint['LU_ID'] == 10 || dataPoint['LU_ID'] == 11){
          value = parseFloat(dataPoint['Revenue/acre/year']) * Totals.yieldByLandUse[i][parseInt(dataPoint['LU_ID'])][dataPoint['SoilType']] || 0;
        }
        else{
          value = parseFloat(dataPoint['Revenue/acre/year']) * Totals.yieldByLandUse[i][dataPoint['LU_ID']];
        }
        this.scaledRev[i][dataPoint['LU_ID']] = this.scaledRev[i][dataPoint['LU_ID']] || 0;
        this.scaledRev[i][dataPoint['LU_ID']] += value;
      });

      this.rawData.forEach(dataPoint => {
        let copy = JSON.parse(JSON.stringify(dataPoint));
        let luID = parseInt(copy['LU_ID']);
        if(copy['LU_ID'] == 1 || copy['LU_ID'] == 2){//corn needs to be treated specially
          console.log(luID)
          copy["Value"] *= this.cornAfters[i][luID][copy['Sub Crop']];
          copy["# Labor Hours"] *= this.cornAfters[i][luID][copy['Sub Crop']];
        }
        else {
          copy["Value"] *= landUses[i][copy['LU_ID']];
          copy["# Labor Hours"] *= landUses[i][copy['LU_ID']];
        }
        this.mapData[i].push(copy)
      })
    }
    this.chart3Data();
    this.chart3DataByLU();
    this.graphic5information();
    this.divideByCategory(['Action - Cost Type', 'Time - Cost Type', 'Fixed/Variable']);
    this.chart4Information(['Action - Cost Type', 'Time - Cost Type']);
    this.calcSubcrops();
  }

  //this is unoptimized for finding the amount of corn after corn and corn after soybeans
  //If any sort of progress bar requires the economics module it is recomended to alter the method in which data is updated
  calculateCornAfters = () =>{
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      this.cornAfters[i] = [,{'Corn after Soybean':0, 'Corn after Corn':0},{'Corn after Soybean':0, 'Corn after Corn':0}]
      for (var j = 0; j < boardData[currentBoard].map.length; j++) {
        if(boardData[currentBoard].map[j].landType[i] == 1 || boardData[currentBoard].map[j].landType[i] == 2){ //if there it is corn
          if(boardData[currentBoard].map[j].landType[i-1] == 3 || boardData[currentBoard].map[j].landType[i-1] == 4){ //if the corn is after soybean
            console.log(i);
            this.cornAfters[i][boardData[currentBoard].map[j].landType[i]]['Corn after Soybean'] += boardData[currentBoard].map[j].area;
          }
          else {
            this.cornAfters[i][boardData[currentBoard].map[j].landType[i]]['Corn after Corn'] += boardData[currentBoard].map[j].area
          }
        }
      }
    }
    console.log(this.cornAfters);
  }

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
          Math.round(1000*this.dataSubcrop[i][dataPoint['Land-Use']][dataPoint['Sub Crop']] + 1000*Number.parseFloat(dataPoint['Value']))/1000
        }
      })
    }


  }
}
var economics = new Economics();
//kind of a precalc? Not really but its calculated before its needed.
