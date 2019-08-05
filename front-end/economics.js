var Economics = function () {
  this.rawData;
  this.mapData = [];
  this.data = [];
  this.data4 = [];
  this.data3 = [];
  this.data3ByLU = [];
  d3.csv('./budgets_2.csv', data => { //after parsing the CSV file

    this.rawData = data;
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
    //graphic 4 extract data from raw data
  this.chart4Information = function(lists) {
    this.rawData.forEach(dataPoint => {
      var landuseNum=dataPoint['LU_ID'];
      if (!this.data4[landuseNum]) {
        this.data4[landuseNum] = {'landUse': dataPoint['Land-Use'],'array':[]}
      } // We need to create a path to the data that we want to pull out
      this.data4[landuseNum]['array'].push(dataPoint);
      lists.forEach(cat => {
        if(!this.data4[landuseNum][cat]){
          this.data4[landuseNum][cat]=[];
        }
        if(!this.data4[landuseNum][cat].includes(dataPoint[cat])){
          this.data4[landuseNum][cat].push(dataPoint[cat]);
        }
      });
    });
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
    console.log(this.data3);
  }


  this.chart3DataByLU = () => {
    console.log(this.mapData)
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

    console.log(this.data3ByLU)
  }

  this.mapChange = function (){ //called when the map changes in order to edit the intermediate step.
    let landUses = [];
    this.mapData = [];
    //Less than ideal coding, but given how Totals is structured the easiest way
    //I found to map Land Use IDS to total LandUse without recalculation
    for(let i = 1; i <= boardData[currentBoard].calculatedToYear; i++){
      landUses[i] = [];
      this.mapData[i] = [];
      let keys = Object.keys(Totals.landUseResults[0]);
      for(let j = 0; j < keys.length; j++){
        let key = keys[j];
        //this substring is to link different keys from different objects together... again less than ideal
        landUses[i][LandUseType[key.substring(0, key.length - 7)]] = Totals.landUseResults[i][key]
      }
      this.rawData.forEach(dataPoint => {
        let copy = JSON.parse(JSON.stringify(dataPoint));
        copy["Value"] *= landUses[i][copy['LU_ID']];
        this.mapData[i].push(copy)
      })
    }
    this.chart3Data();
    this.chart3DataByLU();
    this.divideByCategory(['Action - Cost Type', 'Time - Cost Type', 'Fixed/Variable']);
    this.chart4Information(['Action - Cost Type', 'Time - Cost Type']);
  }
}
var economics = new Economics();
//kind of a precalc? Not really but its calculated before its needed.
