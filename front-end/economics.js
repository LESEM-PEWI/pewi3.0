function Economics() { //Singleton for getting economics data from the budgets csv
  this.rawData = [];
  this.data = [];
  this.init = function(){
    console.log(this);
    let divideByCategory = (listofCats) =>{
      console.log(this);
      listofCats.forEach(cat => {
        this.rawData.forEach(dataPoint => {
          if (!this.data[dataPoint['LU_ID']]) {
            this.data[dataPoint['LU_ID']] = {'landUse': dataPoint['Land-Use']}
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
    d3.csv('./budgets.csv', (data) => {
      this.rawData = data;
      divideByCategory(['Action - Cost Type', 'Time - Cost Type', 'Fixed/Variable'])
    })
  }
};
var economics = new Economics();
economics.init();//kind of a precalc? Not really but its calculated before its needed.
