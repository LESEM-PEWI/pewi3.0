/* This module provide support tools to the economic module, adjusting the cost to the inflation rate

Constructed in June 2016 as an object focused approach to calculation methods based on
  code from pewi v2.0.

C. Labuzzetta
N. Hagen
const d3 = require('d3');

 */

//import * as d3 from 'd3';


const printText = function(printdata){
    console.log(printdata);
}
//const fs = require('fs');
//const fastcsv = require('fast-csv');
function removeDuplicates(array, isEqual) {
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

const loadCSVData = function(localDataPath) {
    /**
     * reads a /csv file as an array.
     * @param {localDataPath} string - string path reference to the pre-simulated ghg
     * this function is for backend only
     */
    try {
        const fileContent = fs.readFileSync(localDataPath, 'utf8'); // Read the file content
        const results = []; // Initialize an array to hold the parsed data

        // Split the CSV content by new lines
        const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== ''); // Filter out empty lines

        // Extract headers from the first line
        const headers = lines[0].split(',').map(header => header.trim());

        // Parse each subsequent line into an object
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',').map(value => value.trim());
            const rowObject = {};

            // Map each header to its corresponding value
            headers.forEach((header, index) => {
                rowObject[header] = row[index] || null; // Use null for missing values
            });

            results.push(rowObject); // Add the row object to results
        }

        this.loadedData = results; // Store loaded data in the instance
        //console.log('Data loaded:', this.loadedData); // Log loaded data
        return results; // Return the parsed data
    } catch (error) {
        console.error('Error loading data:', error);
        return []; // Return an empty array on error
    }
}
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



const filterByLandUseAndSoilType = (data, landUseTypes, soilTypes, precipitationLevel) => {
    // Check if data is loaded
    if (!data || data.length === 0) {
        console.error("Data not loaded yet or is empty.");
        return [];
    }

    // Ensure landUseTypes, soilTypes, and precipitationLevel are arrays
    landUseTypes = Array.isArray(landUseTypes) ? landUseTypes : [landUseTypes];
    soilTypes = Array.isArray(soilTypes) ? soilTypes : [soilTypes];
    precipitationLevel = Array.isArray(precipitationLevel) ? precipitationLevel : [precipitationLevel];

    // Convert arrays to sets for faster lookups
    const landUseSet = new Set(landUseTypes);
    const soilSet = new Set(soilTypes);
    const precipitationSet = new Set(precipitationLevel);

    // Filter data based on land use types, soil types, and precipitation levels
    const filteredData = data.filter(row =>
        landUseSet.has(row['code']) &&
        soilSet.has(row['SoilType']) &&
        precipitationSet.has(row['precipitation_level'])
    );
    console.log(filteredData.length)
    // Check if filteredData is empty
    if (filteredData.length === 0) {
        console.warn(`No data found for the specified land use types: ${landUseTypes.join(', ')}, 
        precipitation levels: ${precipitationLevel.join(', ')}, 
        and soil types: ${soilTypes.join(', ')}`);
        return [];
    }

    // we don't want any duplicates as this is for each soil tileID
    console.log('perfect++++++++++++============================\n============')
    return removeDuplicates(filteredData);
};


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



const filterArray  = function(arrayData, landUseType, soilType, precipLevel) {
    return arrayData.filter(v => v.SoilType === soilType && v.code ===landUseType && v.precipitation_level === precipLevel)
}



