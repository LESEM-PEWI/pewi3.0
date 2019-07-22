var economics = (function () { //Singleton for getting economics data from the budgets csv
  var instance;
  var rawData;
  var rawData2;
  var data;
  var data4=Array();
  var data5=Array();

  function init() {
    console.log(this);
    function divideByCategory (listofCats){
      console.log(this.rawData);
      listofCats.forEach(cat => {
        this.rawData.forEach(dataPoint => {
          if (!this.data[dataPoint['LU_ID']]) {
            this.data[dataPoint['LU_ID']] = {'landUse': dataPoint['Land-Use']};
          } // We need to create a path to the data that we want to pull out
          if (!this.data[dataPoint['LU_ID']][cat]){ //if this is the first time that we see a particular category for a particular land use
            this.data[dataPoint['LU_ID']][cat] = {total: 0}; //Further path making
          }
          if(!this.data[dataPoint['LU_ID']][cat][dataPoint[cat]]){ //if this is the first value we need to read
            this.data[dataPoint['LU_ID']][cat][dataPoint[cat]] = Math.round(1000*Number.parseFloat(dataPoint['Value']))/1000;
          }
          else {//The value already exists so just add to it.
            this.data[dataPoint['LU_ID']][cat][dataPoint[cat]] = //trying to prevent floating point calculation errors so rounding to tenth of a cent
            //ideally this.data[dataPoint['LU_ID']][cat][dataPoint[cat]] + Number.parseFloat(dataPoint['Value'])
            Math.round(1000*(this.data[dataPoint['LU_ID']][cat][dataPoint[cat]] + Number.parseFloat(dataPoint['Value'])))/1000
            this.data[dataPoint['LU_ID']][cat][dataPoint[cat]]
          }
          this.data[dataPoint['LU_ID']][cat].total = //either way add it to the total
          Math.round(1000*this.data[dataPoint['LU_ID']][cat].total + 1000*Number.parseFloat(dataPoint['Value']))/1000
        });
      });
      console.log(this.data)
    }
    //graphic 4 extract data from raw data
    function chart4Information(lists) {
        this.rawData.forEach(dataPoint => {
          var landuseNum=dataPoint['LU_ID'];
          if (!data4[landuseNum]) {
            data4[landuseNum] = {'landUse': dataPoint['Land-Use'],'array':[]}
          } // We need to create a path to the data that we want to pull out
          data4[landuseNum]['array'].push(dataPoint);
          lists.forEach(cat => {
            if(!data4[landuseNum][cat]){
              data4[landuseNum][cat]=[];
            }
            if(!data4[landuseNum][cat].includes(dataPoint[cat])){
              data4[landuseNum][cat].push(dataPoint[cat]);
            }
          });
        });
    }
    function graphic5information(list){
      rawData2.forEach(dataPoint=>{
        var landuseNum=dataPoint['LU_ID'];
        if (!data5[landuseNum]) {
          data5[landuseNum] = {'landUse': dataPoint['Land-Use'],'array':[],'subcrop':[]};
        } // We need to create a path to the data that we want to pull out
        var subcrop=dataPoint['Sub Crop'];
        if(dataPoint['Time of Year']!=""){
        if(subcrop!=""){
          if(!data5[landuseNum]['subcrop'].some(e=>e['subcrop']===subcrop)){
             data5[landuseNum]['subcrop'].push({'array':[],'subcrop':subcrop});
          }
          var indexOfStevie = data5[landuseNum]['subcrop'].findIndex(i => i['subcrop'] === subcrop);
          data5[landuseNum]['subcrop'][indexOfStevie]['array'].push(dataPoint);
        }

          data5[landuseNum]['array'].push(dataPoint);

        }
      })
      console.log(data5);
    }
    d3.csv('./budgets.csv', function(data){
      this.rawData = data;
      divideByCategory(['Action - Cost Type', 'Time - Cost Type', 'Fixed/Variable']);
      chart4Information(['Action - Cost Type', 'Time - Cost Type']);
    })
    d3.csv('./budgets_2.csv', function(data){
      rawData2=data;
      graphic5information(['total labor hours','total labor costs','total custom hire costs']);
    })
    return {//public fields
      data: this.data,
      rawData: this.rawData,
      data4: data4,
      data5:data5,
    };
  };
  return {
    getInstance: function () { //To ensure singularity
      if ( !instance ) {
        console.log(this.data);
        instance = init();
      }
      return instance;
    }
  };
})();

economics.getInstance();//kind of a precalc? Not really but its calculated before its needed.