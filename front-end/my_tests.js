// Create an object using object literal syntax
d3.csv("data/data.csv");
const dictionary = {
    key1: 'value1',
    key2: 'value2',
    key3: 42
};

console.log(dictionary)




const landUseData = [
    {
        LU_ID: 5,
        LandUse: 'Alfalfa',
        SubCrop: '',
        YearsApplicable: 1,
        Frequency: 'all',
        SoilType: '',
        RevenuePerAcrePerYear: 144.8823222,
        Units: '$/ton',
        Calculations: '',
        Notes: ''
    },
    {
        LU_ID: 15,
        LandUse: 'Mixed Fruits & Vegetables',
        SubCrop: 'Green Beans',
        YearsApplicable: 1,
        Frequency: 'all',
        SoilType: '',
        RevenuePerAcrePerYear: 830.97,
        Units: '$/ton',
        Calculations: `Green beans - 120 lbs/bed * 70 beds/acre = 8400 lbs/acre @ $3/lb
      Strawberries - yields y1 = 4000, y2 = 3000, y3 = 2000 qts/acre
      avg yield = 3000 qts/acre * $2.50/qt
      1 qt = 2.0 lbs strawberries; $1.25/lb, avg 6000 lbs/acre
      Winter Squash - 450 boxes/acre @ $12/box; 1 box = 50 lbs
      22,500 lbs/acre @ $0.24/lb
      Grapes - NEEDED!!!`,
        Notes: ''
    },
    {
        LU_ID: 15,
        LandUse: 'Mixed Fruits & Vegetables',
        SubCrop: 'Strawberry',
        YearsApplicable: '',
        Frequency: 'Average Annual',
        SoilType: '',
        RevenuePerAcrePerYear: 157.2,
        Units: '$/ton',
        Calculations: '4000 qts/acre * $2.25/qt',
        Notes: 'Why does $/qt change year to year?'
    },
    // Add other rows similarly
    {
        LU_ID: 7,
        LandUse: 'Rotational Grazing',
        SubCrop: 'Cattle',
        YearsApplicable: '',
        Frequency: 'Annual',
        SoilType: '',
        RevenuePerAcrePerYear: 787.89,
        Units: '$/animal',
        Calculations: '',
        Notes: 'https://www.extension.iastate.edu/AGDM/livestock/pdf/b1-21.pdf'
    },
    {
        LU_ID: 12,
        LandUse: 'Switchgrass',
        SubCrop: '',
        YearsApplicable: '',
        Frequency: '',
        SoilType: '',
        RevenuePerAcrePerYear: 60.57774931,
        Units: '$/ton',
        Calculations: '',
        Notes: ''
    }
    // Continue adding other rows in the same format
];

const landUse12 = landUseData.find(item => item.LU_ID === 12);

console.log(landUse12);


// Initialize a 3x3 Tic-Tac-Toe board
let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

// Function to print the current state of the board
function printBoard(board) {
    board.forEach(row => console.log(row.join(" | ")));
}

// Example move: Player X places an "X" in the top-left corner
board[0][0] = "X";

// Example move: Player O places an "O" in the middle
board[1][1] = "O";

// Print the board
printBoard(board);

/* Output:
X |   |
  | O |
  |   |
*/

console.log(typeof board)