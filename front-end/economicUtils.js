/* This module provide support tools to the economic module, adjusting the cost to the inflation rate

Constructed in June 2016 as an object focused approach to calculation methods based on
  code from pewi v2.0.

C. Labuzzetta
N. Hagen
const d3 = require('d3');

 */
const costAdjuster = function(data, column, factor = 1.23) {
    // Ensure data is an array
    if (!Array.isArray(data)) {
        throw new Error("Data must be an array.");
    }

    // Validate column name
    if (typeof column !== "string") {
        throw new Error("Column name must be a string.");
    }

    // Validate factor
    if (typeof factor !== "number") {
        throw new Error("Factor must be a number.");
    }

    for (let i = 0; i < data.length; i++) {
        const row = data[i];

        // Check if 'Value' exists and is numeric
        if (row.hasOwnProperty(column) && !isNaN(parseFloat(row[column]))) {
            // Convert the value to a number, multiply by the factor, and then assign it back
            row[column] = parseFloat(row[column]) * factor;
        }
    }
    return data;
}

function flattenNestedObject(arr){
    for(var key in arr){
        if(arr[key] instanceof Object){
            recursive_for(arr[key]);
        }else{
            console.log(arr[key]);
            console.log(key)
        }
    }
}

filterByValue = (data, soilType, columnName = 'soilType') => {
    // Check if data is loaded
    if (!data || data.length === 0) {
        console.error("Data not loaded yet or is empty.");
        return [];
    }

    // Use the filter method to return rows with the specified soil type
    let filterData = data.filter(row => row[columnName] === soilType);

    // Check if filterData is empty
    if (filterData.length === 0) {
        console.warn(`No data found for soil type: ${soilType}`);
        return [];
    }

    return filterData;
};


calculateGHGbySoilTypes = () => {
    // Yes, I rewrite this code the switch is unnecessary, and complicates readability
    for (let i = 1; i <= boardData[currentBoard].calculatedToYear; i++) {
        // Initialize getSoilArea for year 'i'
        this.cellArea[i] = [
            {"A": 0, "B": 0, "C": 0, "D": 0, "G": 0, "K": 0, "L": 0, "M": 0, "N": 0, "O": 0, "Q": 0, "T": 0, "Y": 0},
            {"A": 0, "B": 0, "C": 0, "D": 0, "G": 0, "K": 0, "L": 0, "M": 0, "N": 0, "O": 0, "Q": 0, "T": 0, "Y": 0},
            {"A": 0, "B": 0, "C": 0, "D": 0, "G": 0, "K": 0, "L": 0, "M": 0, "N": 0, "O": 0, "Q": 0, "T": 0, "Y": 0},
        ];

        for (let j = 0; j < boardData[currentBoard].map.length; j++) {

            let numberLandUse  = boardData[currentBoard].map[j].landType[i]

            // Get the soil type and area directly
            let soilType = boardData[currentBoard].map[j]['soilType'];
            let area = boardData[currentBoard].map[j].area;
            let prepitiationData = boardData[currentBoard].precipitation[i] * 25.4

            // Increment the area for the appropriate soil type and land use without using a switch
            // perfect we have just reduced this code by about 15 lines
            if (this.cellArea[i][numLandUse].hasOwnProperty(soilType)) {
                // get the soils by soil types
                let gHGSoilType = filterByValue(this.ghg, soilType, columnName= 'soilType')
                this.cellArea[i][numLandUse][soilType] += area;
            }
        }
    }
};

filterByLandUseAndSoilType = (data, landUseTypes, soilTypes) => {
    // Check if data is loaded
    if (!data || data.length === 0) {
        console.error("Data not loaded yet or is empty.");
        return [];
    }

    // Ensure landUseTypes and soilTypes are arrays
    if (!Array.isArray(landUseTypes)) {
        landUseTypes = [landUseTypes];
    }
    if (!Array.isArray(soilTypes)) {
        soilTypes = [soilTypes];
    }

    // Filter data based on both landUseType and soilType
    let filteredData = data.filter(row => {
        return landUseTypes.includes(row['code']) && soilTypes.includes(row['soilType']);
    });

    // Check if filteredData is empty
    if (filteredData.length === 0) {
        console.warn(`No data found for the specified land use types: ${landUseTypes.join(', ')} and soil types: ${soilTypes.join(', ')}`);
        return [];
    }
    console.log(filteredData)
    return filteredData;
};

// Example data structure
let myData = [
    { landUseType: '10', soilType: 'C', area: 100 },
    { landUseType: '11', soilType: 'L', area: 200 },
    { landUseType: '10', soilType: 'O', area: 300 },
    { landUseType: '12', soilType: 'C', area: 150 }
];


var calsGHGs = function() {
    this.extractSoils = [];
    this.extractLandUses = [];
    this.GHGData = [];
    d3.csv('./ghg.csv', (_data) => {

        this.GHGData = _data;
        console.log(this.GHGData)
    })
    // Yes, I rewrite this code the switch is unnecessary, and complicates readability
    const mineer = () => {
        for (let i = 1; i <= boardData[currentBoard].calculatedToYear; i++) {
            // Initialize extractSoils for year 'i'
            this.extractSoils[i] = Array(3).fill().map(() => ({
                "A": 0, "B": 0, "C": 0, "D": 0, "G": 0, "K": 0, "L": 0, "M": 0, "N": 0, "O": 0,  "Q": 0, "T": 0, "Y": 0
            }));

            // Initialize extractLandUses
            this.extractLandUses[i] = Array(3).fill().map(() => ({
                0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
            }));

            for (let j = 0; j < boardData[currentBoard].map.length; j++) {
                let _PrecipitationData = boardData[currentBoard].precipitation[i] * 25.4;
                console.log(_PrecipitationData);

                // Determine numericalLandUse based on the landType
                let numericalLandUse = 0;
                numericalLandUse = boardData[currentBoard].map[j].landType[i]
                // Extract soil type and area for calculations
                const extractSoilType = boardData[currentBoard].map[j]['soilType'];
                const extractArea = boardData[currentBoard].map[j].area;

                // Update extractSoils and extractLandUses arrays
                if (this.extractSoils[i][numericalLandUse].hasOwnProperty(extractSoilType)) {
                    this.extractSoils[i][numericalLandUse][extractSoilType] += extractArea;
                    this.extractLandUses[i][numericalLandUse] += extractArea;

                    console.log(this.extractLandUses[i][numericalLandUse]);
                }
            }
        }
    };


}

// This will fill the three objects for the three years
const soilTypeHolderArray = Array(3).fill().map(() => ({
    "A": 0, "B": 0, "C": 0, "D": 0, "G": 0, "K": 0, "L": 0, "M": 0, "N": 0, "O": 0, "Q": 0, "T": 0, "Y": 0
}));
// This will fill three objects for the three years
const landUseHolderArray = Array(3).fill().map(() =>(
{0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0}
));
// log them and see the length
console.log(soilTypeHolderArray.length)
console.log(landUseHolderArray.length)


class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // Instance method
    describe() {
        return `${this.name} is ${this.age} years old.`;
    }

    // Static method
    static species() {
        return 'Homo sapiens';
    }
}

// Access static method using the class name
console.log(Person.species());  // Output: Homo sapiens

//const { Economics } = require('./economics.js');
