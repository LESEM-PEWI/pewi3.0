// This module provide support tools to the economic module, adjusting the cost to the inflation rate
function costAdjuster(data, column, factor = 1.23) {
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


