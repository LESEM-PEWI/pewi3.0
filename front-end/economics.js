var economics = (function () { //Singleton for getting economics data from the budgets csv
  var instance;
  var rawData;
  var data;
  var data2=[];

  function init() {
    console.log(this);
    function divideByCategory (listofCats){
      console.log(this.rawData);
      console.log(this.data);
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
    function chart4Information(lists) {
      console.log(data2);
      //lists.forEach(cat => {
        this.rawData.forEach(dataPoint => {
          var landuseNum=dataPoint['LU_ID'];
          if (!data2[landuseNum]) {
            data2[landuseNum] = {'landUse': dataPoint['Land-Use'],'array':[]}
          } // We need to create a path to the data that we want to pull out
          //console.log(dataPoint);
          data2[landuseNum]['array'].push(dataPoint);
          if(!data2[landuseNum][lists[0]]){
            data2[landuseNum][lists[0]]=[];
          }
          if(!data2[landuseNum][lists[1]]){
            data2[landuseNum][lists[1]]=[];
          }
          //console.log(data2[landuseNum][lists[0]]['array']);
          // console.log(data2[landuseNum][lists[0]]);
          // console.log(dataPoint[lists[0]]);
          // console.log();
          if(!data2[landuseNum][lists[0]].includes(dataPoint[lists[0]])){
            data2[landuseNum][lists[0]].push(dataPoint[lists[0]]);
          }
          if(!data2[landuseNum][lists[1]].includes(dataPoint[lists[1]])){
            data2[landuseNum][lists[1]].push(dataPoint[lists[1]]);
          }
          //data2[dataPoint['LU_ID']][cat]['array'].push(dataPoint);
        });
      //});
      console.log(data2);
    }

    d3.csv('./budgets.csv', function(data){
      this.rawData = data;
      divideByCategory(['Action - Cost Type', 'Time - Cost Type', 'Fixed/Variable']);
      chart4Information(['Action - Cost Type', 'Time - Cost Type']);
    })
    return {//public fields
      data: this.data,
      rawData: this.rawData,
      data2: this.data2
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
