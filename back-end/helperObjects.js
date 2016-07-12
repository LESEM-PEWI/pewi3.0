/*
Constructed in June 2016 as an object focused approach to calculation methods based on 
  code from pewi v2.0. 
  
C. Labuzzetta
N. Hagen

*/


//######################################################################################
//######################################################################################

//Creation of LandUseType Object
//This object serves to translate the values stored as land types into readable code
//Use this for comparisons and assignments
var LandUseType = {

	none: 0,
	conventionalCorn: 1,
	conservationCorn: 2,
	conventionalSoybean: 3,
	conservationSoybean: 4,
	alfalfa: 5,
	permanentPasture: 6,
	rotationalGrazing: 7,
	grassHay: 8,
	prairie: 9,
	conservationForest: 10,
	conventionalForest: 11,
	switchgrass: 12,
	shortRotationWoodyBioenergy: 13,
	wetland: 14,
	mixedFruitsVegetables: 15,

	getType: function(type) {

			switch (type) {
				case 0:
					return "none";
				case 1:
					return "conventionalCorn";
				case 2:
					return "conservationCorn";
				case 3:
					return "conventionalSoybean";
				case 4:
					return "conservationSoybean";
				case 5:
					return "alfalfa";
				case 6:
					return "permanentPasture";
				case 7:
					return "rotationalGrazing";
				case 8:
					return "grassHay";
				case 9:
					return "prairie";
				case 10:
					return "conservationForest";
				case 11:
					return "conventionalForest";
				case 12:
					return "switchgrass";
				case 13:
					return "shortRotationWoodyBioenergy";
				case 14:
					return "wetland";
				case 15:
					return "mixedFruitsVegetables";
				default:
					return "NOT FOUND";
			} //end switch
		} //end getType
};
//end definition of landUseType

//######################################################################################
//######################################################################################

//Constructor method for a Tile object
//The tile object is the basic unit of calculation which makes up a board
//When tile values are changed, be sure to call the update method in order to recalculate the tile-level values
function Tile(tileArray, board) {

	//Variable Assignment and definitions
	//The value tileArray is initially pased from initDat
	this.id = tileArray[0];
	this.row = tileArray[1];
	this.column = tileArray[2];
	this.area = Number(tileArray[3]);
	this.baseLandUseType = Number(tileArray[4]);
	this.carbonMax = tileArray[5];
	this.carbonMin = tileArray[6];
	this.cattle = tileArray[7];
	this.cornYield = tileArray[8];
	this.drainageClass = tileArray[9];
	this.erosion = tileArray[10];
	this.floodFrequency = tileArray[11];
	this.group = tileArray[12];
	this.nitratesPPM = tileArray[13];
	this.pIndex = tileArray[14];
	this.sediment = tileArray[15];
	this.soilType = tileArray[16];
	this.soybeanYield = tileArray[17];
	this.streamNetwork = tileArray[18];
	this.subwatershed = Number(tileArray[19]);
	this.timber = tileArray[20];
	this.topography = Number(tileArray[21]);
	this.watershedNitrogenContribution = tileArray[22];
	this.strategicWetland = tileArray[23];
	this.riverStreams = tileArray[31];

	//default settings for land use setup
	//years 4 and 5 are land use types used for calculations of minumum and maximum values
	this.landType = [this.baseLandUseType, Number(tileArray[24]), Number(tileArray[24]), Number(tileArray[24]), LandUseType.prairie, LandUseType.conventionalSoybean];

	//results holding variables
	//these variables hold results from functions that other methods may need, this saves executing a base function multiple times
	this.soilTestP = 0;
	this.hydrogroup = '';
	this.sedimentDeliveryRatio = 0;
	this.runoffCurveNumber = Array(6);
	this.PApplicationRate = Array(6);
	this.rusleValues = Array(6);
	this.ephemeralGullyErosionValue = Array(6);

	//create a blank results holder sized to hold 3 years of results (year 0 = results[0])
	this.results = Array(4);
	this.results[0] = {};
	this.results[1] = {};
	this.results[2] = {};
	this.results[3] = {};

	//Basic functionality methods
	//---------------------------
	this.getID = function() {
		return this.id;

	};


	//===================================================================================
	//======Main Function, add all other calculation sections to be called in tile update
	this.update = function(upToYear) {

		//will calculate and propage results array up to the year specified
		//be careful when modifying order of the updating functions since some functions use stored results from prior calculations
		for (var y = 1; y <= upToYear; y++) {
			this.flagValues(y);
			this.carbonSequestration(y);
			this.ephemeralGullyErosion(y);
			this.rusle(y);
			this.grossErosionRate(y);
			this.phosphorusDelivery(y); //requires prefactors calculated by rusle and ephemeral
			this.sedimentDeliveryToStreamTile(y); //also requires prefactors calculated by rusle and ephemeral and sedimentDeliveryRatio and bufferFactor
			this.nitrateSubcalculation(y);
			this.yieldTile(y);
		} //end for each year
	}; //end this.update()

	//===================================================================================



	//Modules for subcalculations at the tile level
	//---------------------------------------------

	/*----------------------------
	BIODIVERSITY AND GAME WILDLIFE
	------------------------------*/

	//the basic tile-level methods for biodiversity and game wildlife calculations
	this.flagValues = function(year) {

		//flag native vegetation (for biodiversity calculations only)
		if (this.landType[year] == LandUseType.conservationForest || this.landType[year] == LandUseType.prairie ||
			this.landType[year] == LandUseType.wetland) {
				
			this.results[year].nativeVegetationFlag = 1;
		}
		else {
			this.results[year].nativeVegetationFlag = 0;
		} //end elseif for native vegetation

		//flag native vegetation and other high diversity land uses
		if (this.landType[year] == LandUseType.conservationForest || this.landType[year] == LandUseType.conventionalForest ||
			this.landType[year] == LandUseType.mixedFruitsVegetables || this.landType[year] == LandUseType.prairie ||
			this.landType[year] == LandUseType.rotationalGrazing || this.landType[year] == LandUseType.wetland) {
				
			this.results[year].nativeVegetationHDFlag = 1;
		}
		else {
			this.results[year].nativeVegetationHDFlag = 0;
		} //end elseif for native vegatation and other high diversity land uses

		//flag native vegatation and comparatively high diversity or low input land uses
		if (this.landType[year] == LandUseType.conservationForest || this.landType[year] == LandUseType.conventionalForest ||
			this.landType[year] == LandUseType.mixedFruitsVegetables || this.landType[year] == LandUseType.prairie ||
			this.landType[year] == LandUseType.rotationalGrazing || this.landType[year] == LandUseType.wetland ||
			this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean ||
			this.landType[year] == LandUseType.grassHay || this.landType[year] == LandUseType.switchgrass ||
			this.landType[year] == LandUseType.shortRotationWoodyBioenergy) {
				
			this.results[year].nativeVegatationHDorLIFlag = 1;
		}
		else {
			this.results[year].nativeVegatationHDorLIFlag = 0;
		} //end elseif for native and comparitively high diversity or low input

		//flag conservation forest (not entirely necessary, but we'll work with it for consistency at higher up level)
		if (this.landType[year] == LandUseType.conservationForest) {
			
			this.results[year].conservationForestFlag = 1;
		}
		else {
			this.results[year].conservationForestFlag = 0;
		} //end elseif for conservation forest

		//flag grassland category
		if (this.landType[year] == LandUseType.switchgrass || this.landType[year] == LandUseType.prairie ||
			this.landType[year] == LandUseType.rotationalGrazing) {
				
			this.results[year].grasslandFlag = 1;
		}
		else {
			this.results[year].grasslandFlag = 0;
		} //end elseif for grassland category

		//stream buffer flag
		if (this.streamNetwork == 1) {
			//if tile is a part of the stream network
			if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationForest ||
				this.landType[year] == LandUseType.conservationSoybean || this.landType[year] == LandUseType.conventionalForest ||
				this.landType[year] == LandUseType.grassHay || this.landType[year] == LandUseType.switchgrass ||
				this.landType[year] == LandUseType.mixedFruitsVegetables || this.landType[year] == LandUseType.prairie ||
				this.landType[year] == LandUseType.rotationalGrazing || this.landType[year] == LandUseType.shortRotationWoodyBioenergy ||
				this.landType[year] == LandUseType.wetland) {
					
				this.results[year].streamBufferFlag = 1;
			}
			else {
				this.results[year].streamBufferFlag = 0;
			}
		}
		else {
			this.results[year].streamBufferFlag = 0;
		} //end elseif for stream buffer flag

	}; //end this.flagValues


	/*----------------------------
	     CARBON SEQUESTRATION
	------------------------------*/

	//the tile-level method for carbon sequestration calculations
	this.carbonSequestration = function(year) {
		//Array of possible values of carbon sequestration per unit area sorted by landUseType
		var carbonMultiplier = [0, 0, 161.87, 0, 161.87, 202.34, 117.36, 117.36, 117.36, 433.01, 1485.20, 1485.20, 485.62, 1897.98, 1234.29, 0];

		//Retrieve value of carbon sequestion and multiply by tile area
		this.results[year].calculatedCarbonSequestration = carbonMultiplier[this.landType[year]] * this.area;
	}; //end this.carbonSequestration
	

	/*----------------------------
	       GROSS EROSION
	------------------------------*/

	//the tile-level method for gross erosion rate calculations
	this.grossErosionRate = function(year) {

		this.results[year].calculatedGrossErosionRate = this.rusleValues[year] + this.ephemeralGullyErosionValue[year];

	}; //end this.grossErosionRate

	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//Begin Methods that assist grossErosionRate

	//Calculate rusle and save to variable inside Tile rusleValues
	this.rusle = function(year) {
		this.rusleValues[year] = this.rainfallRunoffErosivityFactor(year) * this.soilErodibilityFactor() * this.slopeLengthSteepnessFactor(year) * this.coverManagementFactor(year) * this.supportPracticeFactor(year);
	}; //end this.rusle

	//Calculate rainfallRunoffErosivityFactor for rusle
	this.rainfallRunoffErosivityFactor = function(year) {
		if (board.precipitation[year] <= 33.46) {
			return (0.0483 * (Math.pow((board.precipitation[year] * 25.4), 1.61))) / 17.02;
		}
		else return (587.8 - (1.219 * board.precipitation[year] * 25.4) + (0.004105 * (Math.pow((board.precipitation[year] * 25.4), 2)))) / 17.02;
	}; //end this.rainfallRunoffErosivityFactor

	//Calculate soilErodibilityFactor for rusle
	//based on soil type, which is assigned permanently to each cell
	this.soilErodibilityFactor = function() {
		switch (this.soilType) {
			case "A":
				return 0.24;
			case "B":
				return 0.2;
			case "C":
				return 0.28;
			case "D":
				return 0.32;
			case "G":
				return 0.32;
			case "K":
				return 0.37;
			case "L":
				return 0.24;
			case "M":
				return 0.28;
			case "N":
				return 0.24;
			case "O":
				return 0.32;
			case "Q":
				return 0.28;
			case "T":
				return 0.28;
			case "Y":
				return 0.37;
			case "0":
				return 0;
		}//end switch
	}; //end this.soilErodibilityFactor

	//Calculate slopeLengthSteepnessFactor for rusle
	//compare values with LandUseType
	this.slopeLengthSteepnessFactor = function(year) {
		if (this.landType[year] > LandUseType.none) {
			if ((this.landType[year] > LandUseType.none && this.landType[year] < LandUseType.permanentPasture) || this.landType[year] == LandUseType.mixedFruitsVegetables) {
				if (this.topography == 0) return 0.05;
				else if (this.topography == 1) return 0.31;
				else if (this.topography == 2) return 0.67;
				else if (this.topography == 3) return 1.26;
				else if (this.topography == 4) return 1.79;
				else if (this.topography == 5) return 2.2;
			}
			else if (this.landType[year] == LandUseType.permanentPasture || this.landType[year] == LandUseType.rotationalGrazing) {
				if (this.topography == 0) return 0.05;
				else if (this.topography == 1) return 0.28;
				else if (this.topography == 2) return 0.58;
				else if (this.topography == 3) return 1.12;
				else if (this.topography == 4) return 1.69;
				else if (this.topography == 5) return 2.18;
			}
			else {
				return 1;
			}
		}
		else {
			return 0;
		}
	}; //end this.slopeLengthSteepnessFactor

	//Calculate coverManagementFactor for rusle
	this.coverManagementFactor = function(year) {

		//If year == 5, then we are calculating the maximum for Conventional Soybean
		//value 0.3 must be returned because previous year land type is not relevant for maximum
		if (year == 5 && this.landType[year] == LandUseType.conventionalSoybean) {
			return 0.3;
		}

		//Depends on landType uses for current and previous year
		if (this.landType[year] == LandUseType.none) {
			return 0;
		}
		else if (this.landType[year] >= LandUseType.alfalfa && this.landType[year] <= LandUseType.wetland) {
			switch (LandUseType.getType(this.landType[year])) {
				case "alfalfa":
					return 0.005;
				case "permanentPasture":
					return 0.03;
				case "rotationalGrazing":
					return 0.02;
				case "grassHay":
					return 0.005;
				case "prairie":
					return 0.001;
				case "conservationForest":
					return 0.004;
				case "conventionalForest":
					return 0.004;
				case "switchgrass":
					return 0.001;
				case "shortRotationWoodyBioenergy":
					return 0.004;
				case "wetland":
					return 0.005;
			}//end switch
		}//end else
		
		else if (this.landType[year - 1] == LandUseType.conventionalCorn) {
			switch (LandUseType.getType(this.landType[year])) {
				case "conservationCorn":
					return 0.085;
				case "conservationSoybean":
					return 0.116;
				case "conventionalCorn":
					return 0.150;
				case "conventionalSoybean":
					return 0.200;
				case "mixedFruitsVegetables":
					return 0.200;
			}//end swich
		}//end else
		
		else if (this.landType[year - 1] == LandUseType.conservationCorn) {
			switch (LandUseType.getType(this.landType[year])) {
				case "conservationCorn":
					return 0.020;
				case "conservationSoybean":
					return 0.031;
				case "conventionalCorn":
					return 0.085;
				case "conventionalSoybean":
					return 0.116;
				case "mixedFruitsVegetables":
					return 0.116;
			}//end switch
		}//end else
		
		else if ((this.landType[year - 1] == LandUseType.conventionalSoybean) || (this.landType[year - 1] == LandUseType.mixedFruitsVegetables)) {
			switch (LandUseType.getType(this.landType[year])) {
				case "conservationCorn":
					return 0.156;
				case "conservationSoybean":
					return 0.178;
				case "conventionalCorn":
					return 0.260;
				case "conventionalSoybean":
					return 0.300;
				case "mixedFruitsVegetables":
					return 0.300;
			}//end switch
		}//end else
		
		else if (this.landType[year - 1] == LandUseType.conservationSoybean) {
			switch (LandUseType.getType(this.landType[year])) {
				case "conservationCorn":
					return 0.052;
				case "conservationSoybean":
					return 0.055;
				case "conventionalCorn":
					return 0.156;
				case "conventionalSoybean":
					return 0.178;
				case "mixedFruitsVegetables":
					return 0.178;
			}//end switch
		}//end else
		
		else {
			switch (LandUseType.getType(this.landType[year])) {
				case "conservationCorn":
					return 0.020;
				case "conservationSoybean":
					return 0.031;
				case "conventionalCorn":
					return 0.085;
				case "conventionalSoybean":
					return 0.116;
				case "mixedFruitsVegetables":
					return 0.116;
			}//end switch
		}//end elseif
	}; //end this.coverManagementFactor

	//Calculate supportPracticeFactor for rusle
	this.supportPracticeFactor = function(year) {
		if (this.landType[year] == LandUseType.none) {
			return 0;
		}
		else {
			if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean) {
				if (this.topography > 1) {
					return this.contourSubfactor(year) * this.terraceSubfactor();
				}
			}
			return 1;
		}//end elseif
	}; //end this.supportPracticeFactor

	//Calculate terraceSubfactor for supportPracticeFactor
	this.terraceSubfactor = function() {
		var temp = this.terraceInterval();
		if (temp < 100) return 0.5;
		else if (temp >= 100 && temp < 140) return 0.6;
		else if (temp >= 140 && temp < 180) return 0.7;
		else if (temp >= 180 && temp < 225) return 0.8;
		else if (temp >= 225 && temp < 300) return 0.9;
		else if (temp >= 300) return 1;
	}; //end this.terraceSubfactor

	//Calculate terraceInterval for terraceSubfactor
	this.terraceInterval = function() {
		var temp = this.slopeSteepnessFactor();
		if (temp == 0.002) return 300;
		else if (temp == 0.02) return 240;
		else if (temp == 0.04) return 180;
		else if (temp == 0.08) return 150;
		else if (temp == 0.12) return 120;
		else if (temp == 0.16) return 105;
	}; //end this.terraceInterval

	//Calculate contourSubfactor for supportPracticeFactor
	this.contourSubfactor = function(year) {
		var temp = this.slopeSteepnessFactor();
		if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean) {
			if (temp == 0.04) return (0.9 + 0.95) / 2;
			else if (temp == 0.08) return (0.85 + 0.9) / 2;
			else if (temp == 0.12) return 0.9;
			else if (temp == 0.16) return 1;
		}
		return 1;
	}; //end this.contourSubfactor

	//Calculate slopeSteepnessFactor for contourSubfactor
	this.slopeSteepnessFactor = function() {
		if (this.topography == 0) return 0.002;
		else if (this.topography == 1) return 0.02;
		else if (this.topography == 2) return 0.04;
		else if (this.topography == 3) return 0.08;
		else if (this.topography == 4) return 0.12;
		else if (this.topography == 5) return 0.16;
	}; //end this.slopeSteepnessFactor

	//Calculate ephemeralGullyErosion for GrossErosionRate
	this.ephemeralGullyErosion = function(year) {
		var cover = this.landType[year];
		if (cover == LandUseType.conventionalCorn || cover == LandUseType.conventionalSoybean || cover == LandUseType.mixedFruitsVegetables) this.ephemeralGullyErosionValue[year] = 4.5;
		else if (cover == LandUseType.conservationCorn || cover == LandUseType.conservationSoybean || cover == LandUseType.alfalfa) this.ephemeralGullyErosionValue[year] = 1.5;
		else this.ephemeralGullyErosionValue[year] = 0;
	}; //end this.ephemeralGullyErosion

	//End Methods that assist grossErosionRate
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	
	
	/*----------------------------
	     PHOSPHORUS DELIVERY       
	------------------------------*/

	//the tile-level calculations for phosphorous delivery to stream
	this.phosphorusDelivery = function(year) {
		//update various parameters needed by phosphorus subcalculations
		this.updatePhosphorusParameters(year);
		//calculate phoshorus Delivered across tile
		this.results[year].phosphorusDelivered = this.area * (this.erosionComponent(year) + this.drainageComponent(year) + this.runoffComponent(year)) ;
	}; //end this.phosphorusDelivery

	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//Begin Methods that assist phosphorusDelivery

	//helper method for calculation of PApplicationRate
	this.getSeasonalUtilizationRate = function(year) {
		if (this.landType[year] == LandUseType.permanentPasture) return 0.35;
		//Note: Year 5 condition below allows 0.55 to be selected when calculating max value for cattle yield
		else if (this.landType[year] == LandUseType.rotationalGrazing || year == 5) return 0.55;
		else return 0;
	};//end this.getSeasonalUtilizationRate

	//function returns Cattle Average Daily Intake
	this.getCattleAverageDailyIntake = function() {
		var cattleBodyWeight = 1200;
		return 0.03 * cattleBodyWeight;
	};//end this.getCattleAverageDailyIntake

	//function updates prequisite values for phosphorus subcalculations
	this.updatePhosphorusParameters = function(year) {
		//updateSubsoilType and permeabilityCode
		switch (this.soilType) {
			case "A":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
			case "B":
				this.subsoilGroup = 1;
				this.permeabilityCode = 10;
				break;
			case "C":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
			case "D":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
			case "G":
				this.subsoilGroup = 3;
				this.permeabilityCode = 80;
				break;
			case "K":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
			case "L":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
			case "M":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
			case "N":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
			case "O":
				this.subsoilGroup = 1;
				this.permeabilityCode = 55;
				break;
			case "Q":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
			case "T":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
			case "Y":
				this.subsoilGroup = 1;
				this.permeabilityCode = 50;
				break;
		}//end switch


		//updateTopographyFactors
		switch (this.topography) {
			case 0:
				this.topoSlopeRangeHigh = 0;
				break;
			case 1:
				this.topoSlopeRangeHigh = 2;
				break;
			case 2:
				this.topoSlopeRangeHigh = 5;
				break;
			case 3:
				this.topoSlopeRangeHigh = 9;
				break;
			case 4:
				this.topoSlopeRangeHigh = 14;
				break;
			case 5:
				this.topoSlopeRangeHigh = 18;
				break;
		}//end switch

		//soilTestP assignment
		if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' ||
			this.soilType == 'N' || this.soilType == 'O') {
			this.soilTestP = 30;
		}
		else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' ||
			this.soilType == 'M' || this.soilType == 'Q' || this.soilType == 'T' ||
			this.soilType == 'Y') {
			this.soilTestP = 27;
		}//end elseif

		//hydroglogicGroup
		switch (this.soilType) {
			case 'A':
				this.hydrogroup = 'B';
				break;
			case 'B':
				this.hydrogroup = 'B';
				break;
			case 'C':
				this.hydrogroup = 'B/D';
				break;
			case 'D':
				this.hydrogroup = 'B';
				break;
			case 'G':
				this.hydrogroup = 'C';
				break;
			case 'K':
				this.hydrogroup = 'B/D';
				break;
			case 'L':
				this.hydrogroup = 'B/D';
				break;
			case 'M':
				this.hydrogroup = 'B';
				break;
			case 'N':
				this.hydrogroup = 'B';
				break;
			case 'O':
				this.hydrogroup = 'B/D';
				break;
			case 'Q':
				this.hydrogroup = 'B';
				break;
			case 'T':
				this.hydrogroup = 'B';
				break;
			case 'Y':
				this.hydrogroup = 'B';
				break;
			default:
				this.hydrogroup = '';
				break;
		}//end switch

		//runoffCurveNumber[year]
		//this is very messy, from the original code and matches thesis
		//this should probably be rewritten as a fall-through switch statement at some point
		var flowfactor = this.getFlowFactor(year);

		if (this.landType[year] == LandUseType.conventionalCorn || this.landType[year] == LandUseType.conventionalSoybean || this.landType[year] == LandUseType.mixedFruitsVegetables) {
			if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 72;
			else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
					'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 81;
			else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 88;
			else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
				this.runoffCurveNumber[year] = 91;
		}
		else if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean) {
			if (this.topography == 0 || this.topography == 1 || this.topography == 2 || this.topography == 3) {
				if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 64;
				else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
						'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 74;
				else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 81;
				else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor ==
					0) this.runoffCurveNumber[year] = 85;
			}
			else if (this.topography == 4 || this.topography == 5) {
				if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 61;
				else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
						'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 70;
				else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 77;
				else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor ==
					0) this.runoffCurveNumber[year] = 80;
			}
		}
		else if (this.landType[year] == LandUseType.alfalfa) {
			if (this.topography == 0 || this.topography == 1 || this.topography == 2 || this.topography == 3) {
				if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 58;
				else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
						'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 72;
				else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 81;
				else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor ==
					0) this.runoffCurveNumber[year] = 85;
			}
			else if (this.topography == 4 || this.topography == 5) {
				if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 55;
				else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
						'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 69;
				else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 78;
				else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor ==
					0) this.runoffCurveNumber[year] = 83;
			}
		}
		else if (this.landType[year] == LandUseType.permanentPasture) {
			if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 68;
			else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
					'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 79;
			else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 86;
			else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
				this.runoffCurveNumber[year] = 89;
		}
		else if (this.landType[year] == LandUseType.rotationalGrazing) {
			if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 49;
			else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
					'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 69;
			else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 79;
			else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
				this.runoffCurveNumber[year] = 84;
		}
		else if (this.landType[year] == LandUseType.grassHay || this.landType[year] == LandUseType.switchgrass) {
			if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 30;
			else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
					'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 58;
			else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 71;
			else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
				this.runoffCurveNumber[year] = 78;
		}
		else if (this.landType[year] == LandUseType.prairie || this.landType[year] == LandUseType.wetland) {
			if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 30;
			else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
					'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 48;
			else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 65;
			else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
				this.runoffCurveNumber[year] = 73;
		}
		else if (this.landType[year] == LandUseType.conservationForest || this.landType[year] == LandUseType.conventionalForest || this.landType[year] == LandUseType.shortRotationWoodyBioenergy) {
			if (this.hydrogroup == 'A') this.runoffCurveNumber[year] = 30;
			else if (this.hydrogroup == 'B' || ((this.hydrogroup == 'C' || this.hydrogroup ==
					'D' || this.hydrogroup == 'B/D') && flowfactor > 0)) this.runoffCurveNumber[year] = 55;
			else if (this.hydrogroup == 'C' && flowfactor == 0) this.runoffCurveNumber[year] = 70;
			else if ((this.hydrogroup == 'D' || this.hydrogroup == 'B/D') && flowfactor == 0)
				this.runoffCurveNumber[year] = 77;
		}
		else {
			this.runoffCurveNumber[year] = 1;
		} //end elseif

		//set this.PApplicationRate
		if (this.landType[year] == LandUseType.conventionalCorn || this.landType[year] == LandUseType.conservationCorn) {
			if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' || this.soilType ==
				'N' || this.soilType == 'O') this.PApplicationRate[year] = 59;
			else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' || this.soilType == 'M' ||
				this.soilType == 'Q' || this.soilType == 'T' || this.soilType == 'Y') this.PApplicationRate[year] = 58;
		}
		else if (this.landType[year] == LandUseType.conventionalSoybean || this.landType[year] == LandUseType.conservationSoybean) {
			if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' || this.soilType ==
				'N' || this.soilType == 'O') this.PApplicationRate[year] = 35;
			else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' || this.soilType == 'M' ||
				this.soilType == 'Q' || this.soilType == 'T' || this.soilType == 'Y') this.PApplicationRate[year] = 38;
		}
		else if (this.landType[year] == LandUseType.alfalfa) {
			var retvar;
			switch (this.soilType) {
				case 'A':
					retvar = 6.3;
					break;
				case 'B':
					retvar = 3.6;
					break;
				case 'C':
					retvar = 4.3;
					break;
				case 'D':
					retvar = 5.6;
					break;
				case 'G':
					retvar = 3.6;
					break;
				case 'K':
					retvar = 4.1;
					break;
				case 'L':
					retvar = 4.2;
					break;
				case 'M':
					retvar = 6.5;
					break;
				case 'N':
					retvar = 6.4;
					break;
				case 'O':
					retvar = 3.6;
					break;
				case 'Q':
					retvar = 6.9;
					break;
				case 'T':
					retvar = 6.7;
					break;
				case 'Y':
					retvar = 6.3;
					break;
				default:
					break;
			}
			this.PApplicationRate[year] = retvar * 13;
		}
		else if (this.landType[year] == LandUseType.permanentPasture || this.landType[year] == LandUseType.rotationalGrazing) {
			var retvar;
			switch (this.soilType) {
				case 'A':
					retvar = 6.3;
					break;
				case 'B':
					retvar = 3.6;
					break;
				case 'C':
					retvar = 4.3;
					break;
				case 'D':
					retvar = 5.6;
					break;
				case 'G':
					retvar = 3.6;
					break;
				case 'K':
					retvar = 4.1;
					break;
				case 'L':
					retvar = 4.2;
					break;
				case 'M':
					retvar = 6.5;
					break;
				case 'N':
					retvar = 6.4;
					break;
				case 'O':
					retvar = 3.6;
					break;
				case 'Q':
					retvar = 6.9;
					break;
				case 'T':
					retvar = 6.7;
					break;
				case 'Y':
					retvar = 6.3;
					break;
				default:
					break;
			}
			this.PApplicationRate[year] = (retvar * 0.053 * 2.2 * 2.29 * (this.getSeasonalUtilizationRate(year)) / (
				this.getCattleAverageDailyIntake() / 2000));
		}
		else if (this.landType[year] == LandUseType.grassHay) {
			if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' || this.soilType ==
				'N' || this.soilType == 'O') this.PApplicationRate[year] = 34;
			else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' || this.soilType == 'M' || this.soilType ==
				'Q' || this.soilType == 'T' || this.soilType == 'Y') this.PApplicationRate[year] = 39;
		}
		else
		if (this.landType[year] == LandUseType.mixedFruitsVegetables) {
			this.PApplicationRate[year] = (3 * 5 * 0.25) + (15 * 2.8 * 0.25);
		}
		else {
			this.PApplicationRate[year] = 0;
		} //end PApplicationRate
		

	//set sedimentDeliveryRatio
	if (this.soilType == 'A' || this.soilType == 'B' || this.soilType == 'C' || this.soilType == 'L' || this.soilType == 'N' || this.soilType == 'O') {
		this.sedimentDeliveryRatio = (Math.pow(10, (Math.log10(4 / 6) * Math.log10(board.watershedArea) + (Math.log10(4) - (4 * Math.log10(4 / 6)))))) / 100;
	}
	else if (this.soilType == 'D' || this.soilType == 'G' || this.soilType == 'K' || this.soilType == 'M' || this.soilType == 'Q' || this.soilType == 'T' ||
		this.soilType == 'Y') {
		this.sedimentDeliveryRatio = (Math.pow(10, (Math.log10(26 / 35) * Math.log10(board.watershedArea) + (Math.log10(26) - (4 * Math.log10(26 / 35)))))) / 100;
	}
}; //end updatePhosphorusParameters

//the drainageComponent of Phosphorus Calculations
this.drainageComponent = function(year) {
	return this.precipitationFactor(year) * this.getFlowFactor() * this.getSoilTestPDrainageFactor();
};

//the runoffComponent of Phosphous Calculations
this.runoffComponent = function(year) {
	var temp = this.runoffFactor(year) * this.precipitationFactor(year) * (this.getSoilTestPRunoffFactor() + this.getPApplicationFactor(year)) ;
	if(temp > 0 ){
		return temp;
	}
	return 0; //else not a valid square and set phosphorus to 0
};

//ambiguity between thesis and pewi program
//the erosionComponent of Phosphorus Calculatiosn
this.erosionComponent = function(year) {
	return ((this.rusleValues[year] + this.ephemeralGullyErosionValue[year]) * 
	this.sedimentDeliveryRatio * this.bufferFactor(year) * this.enrichmentFactor(year) * this.soilTestPErosionFactor() );

};

//--------drainageComponent Subcalculations
this.precipitationFactor = function(year) {
	return board.precipitation[year] / 4.415;
};

this.getFlowFactor = function(year) {
	if (this.topoSlopeRangeHigh <= 5 && this.drainageClass >= 60 && (this.subsoilGroup == 1 || this.subsoilGroup ==	2)) {
		return 0.1;
	}
	else if (this.permeabilityCode <= 35 || this.permeabilityCode == 58 || this.permeabilityCode == 72 || this.permeabilityCode == 75) {
		return 0.1;
	}
	else {
		return 0;
	}
};

this.getSoilTestPDrainageFactor = function() {

	if (this.soilTestP <= 100) {
		return 0.1;
	}
	else if (this.soilTestP > 100) {
		return 0.2;
	}
};
//-------end drainage subCalcs


//------runoffComponent Subcalculations
this.runoffFactor = function(year) {
	return (0.000000799 * Math.pow(this.runoffCurveNumber[year], 3)) - (0.0000484 * Math.pow(this.runoffCurveNumber[
		year], 2)) + (0.00265 * this.runoffCurveNumber[year] - 0.085);
};

this.getSoilTestPRunoffFactor = function() {
	return 0.05 + (0.005 * this.soilTestP);
};

this.getPApplicationFactor = function(year) {

		if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean || this.landType[year] == LandUseType.permanentPasture 
		|| this.landType[year] == LandUseType.rotationalGrazing || this.landType[year] == LandUseType.grassHay ) {
			return (this.PApplicationRate[year] / 4.58) * 0.5 * 1 * 0.005;
		}
		else if (this.landType[year] == LandUseType.alfalfa) {
			return (this.PApplicationRate[year] / 4.58) * 0.5 * 0.9 * 0.005;
		}
		else if (this.landType[year] == LandUseType.conventionalCorn || this.landType[year] == LandUseType.conventionalSoybean 
			|| this.landType[year] == LandUseType.mixedFruitsVegetables) {
			return (this.PApplicationRate[year] / 4.58) * 0.5 * ((0.6 + 1.0) / 2) * 0.005;
		}
		return 0;
};
//-------end runoffComponent subCalcs

//-------erosionComponent Subcalculations
this.soilTestPErosionFactor = function() {
	return  (0.7 * (500 + 3 * this.soilTestP)) * (2000  / 1000000 ) ;
};

this.enrichmentFactor = function(year) {
	if (this.landType[year] == LandUseType.conventionalCorn || this.landType[year] == LandUseType.conventionalSoybean
		|| this.landType[year] == LandUseType.mixedFruitsVegetables) {
		return 1.1;
	}
	else {
		return 1.3;
	}
};

this.bufferFactor = function(year) {
	if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean || (this.landType[year] > LandUseType.rotationalGrazing && this.landType[year] < LandUseType.mixedFruitsVegetables)) {
		return 0.5;
	}
	else {
		return 1;
	}
};
//-------end erosionComponent subCalcs
//End Methods that assist phosphorus Delivery


	/*----------------------------
    	NITRATE DELIVERY       
	------------------------------*/

//the tile-level method for nitrate delivery
//since nitrate levels are calculated at subWatershed level, tile level calculations output
// row crop multiplier times conservation row crop multiplier
this.nitrateSubcalculation = function(year) {
	
	 if ((this.landType[year] > LandUseType.none && this.landType[year] < LandUseType.alfalfa) || this.landType[year] == LandUseType.mixedFruitsVegetables) {
          if (this.landType[year] == LandUseType.conservationCorn || this.landType[year] == LandUseType.conservationSoybean) {
              if (this.soilType == "A" || this.soilType == "B" || this.soilType == "C" || this.soilType == "L" || this.soilType == "N" || this.soilType == "O") {
                  this.results[year].cropMultiplier = 0.14 * this.area * 0.69;
              } else {
                  this.results[year].cropMultiplier = 0.14 * this.area * 0.62;
              }
          } else {
              this.results[year].cropMultiplier = 0.14 * this.area;
          }
        } else {
            this.results[year].cropMultiplier = 0;
        }
	
}; //end this.nitrateSubcalculation


	/*----------------------------
	     SEDIMENT DELIVERY       
	------------------------------*/

//the tile-level method for sediment delivery to stream calculations
this.sedimentDeliveryToStreamTile = function(year) {
  this.results[year].calculatedSedimentDeliveryToStreamTile = this.results[year].calculatedGrossErosionRate
			* this.bufferFactor(year) * this.sedimentDeliveryRatio;
}; //end this.sedimentDeliveryToStreamTile


	/*----------------------------
	      YIELD CALCULATIONS       
	------------------------------*/

//the tile-level method for tile yield calculations
this.yieldTile = function(year) {
	
	this.results[year].calculatedYieldTile = this.directYieldCalculation(year) * this.getYieldPrecipitationMultiplier(year);
}; //end this.yieldTile

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Begin Methods that assist yieldTile

//Calculates getYieldPrecipitationMultiplier for yieldTile
this.getYieldPrecipitationMultiplier = function(year) {
    if (this.landType[year] > LandUseType.none && this.landType[year] < LandUseType.alfalfa) {
        if (board.precipitation[year] == 24.58 || board.precipitation[year] == 45.10) return 0.75;
        else if (board.precipitation[year] == 28.18 || board.precipitation[year] == 36.47) return 0.9;
        else if (board.precipitation[year] == 30.39 || board.precipitation[year] == 32.16 || board.precipitation[year] == 34.34) return 1;
    } else if ((this.landType[year] > LandUseType.conservationSoybean && this.landType[year] < LandUseType.prairie) || this.landType[year] == LandUseType.switchgrass) {
        if (board.precipitation[year] > 24.58 && board.precipitation[year] < 45.10) return 1;
        else return 0.95;
    } else if (this.landType[year] == LandUseType.mixedFruitsVegetables) {
        if (board.precipitation[year] < 36.47) return 1;
        else if (board.precipitation[year] == 36.47) return 0.9
        else return 0.75;
    }
    return 1;
}; //end this.getYieldPrecipitationMultiplier(year)


	//Directs the yield calculations to the correct method depending on land use type
	this.directYieldCalculation = function(year){
      switch (LandUseType.getType(this.landType[year])){
        case "none":
          return 0;
        case "conventionalCorn":
		  return this.getCornGrainYield();
        case "conservationCorn":
		  return this.getCornGrainYield();
        case "conventionalSoybean":
		  return this.getSoybeanYield();
        case "conservationSoybean":
		  return this.getSoybeanYield();
        case "alfalfa":
		  return this.getHayYield();
        case "permanentPasture":
		  return this.getCattleSupported(year);
        case "rotationalGrazing":
		  return this.getCattleSupported(year);
        case "grassHay":
		  return this.getHayYield();
        case "prairie":
          return 0;
        case "conservationForest":
          //conservation Forest has a yield base rate 0.7 times that of the normal getWoodYield Value
		  return 0.7 * this.getWoodYield();
        case "conventionalForest":
		  return this.getWoodYield();
        case "switchgrass":
		  return this.getSwitchgrassYield();
        case "shortRotationWoodyBioenergy":
          //shortRotationWoodyBioenergy is not dependent on soil type
		  return 60.8608;
        case "wetland":
          return 0;
        case "mixedFruitsVegetables":
		  return 7.34 * this.getMixedFruitsVegetablesYield();
      }//end switch
      
	}; //end this.directYieldCalculation
	
	//return yield base rate for corn grain dependent on soil type
	this.getCornGrainYield = function(){
		var yieldBaseRates = [223, 0, 214, 206, 0, 200, 210, 221, 228, 179, 235, 240, 209, 0];
		return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
	}; //end this.getCornGrainYield
	
	//return yield base rate for soybean dependent on soil type
	this.getSoybeanYield = function(){
		var yieldBaseRates = [65, 0, 62, 60, 0, 58, 61, 64, 66, 52, 68, 70, 61, 0];
		return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
	}; //end this.getSoybeanYield
	
	//return yield base rate for alfalfa and grass hay dependent on soil type
	this.getHayYield = function() {
		var yieldBaseRates = [6.3, 3.6, 4.3, 5.6, 3.6, 4.1, 4.2, 6.5, 6.4, 3.6, 6.9, 6.7, 6.3, 0];
		return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
	}; //end this.getHayYield
	
	//return yield base rate for wood dependent on soil type
	this.getWoodYield = function() {
		var yieldBaseRates = [275, 125, 85, 275, 245, 130, 85, 275, 175, 85, 275, 175, 275, 0];
		return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
	}; //end this.getWoodYield
	
	//return yield base rate for switchgrass (herbaceous perennial bioenergy)
	this.getSwitchgrassYield = function() {
		var yieldBaseRates = [(1+(2*(84-25)/(100-25))), (1+(2*(61-25)/(100-25))), (1+(2*(82-25)/(100-25))), (1+(2*(61-25)/(100-25))),
              (1+(2*(61-25)/(100-25))), (1+(2*(68-25)/(100-25))), (1+(2*(82-25)/(100-25))), (1+(2*(76-25)/(100-25))),
              (1+(2*(92-25)/(100-25))), (1+(2*(61-25)/(100-25))), (1+(2*(93-25)/(100-25))), (1+(2*(98-25)/(100-25))),
              (1+(2*(85-25)/(100-25))), 0];
        return yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
	}; //end this.getSwitchgrassYield
	
	//return yield base rate for mixed fruits and vegetables dependent on soil type which determines soil texture
	this.getMixedFruitsVegetablesYield = function() {
		var soilTexture = ["L", "FSL", "SICL", "SIL", "L", "SIL", "CL", "SICL", "L", "MK-SIL", "SICL", "SICL", "SIL", "NA"];
		var soilTextureTemp = soilTexture[this.getSoilTypeYieldIndex(this.soilType)];
		if (soilTextureTemp == "FSL") return 1;
        else if (soilTextureTemp == "SIL") return 0.9;
        else if (soilTextureTemp == "L") return 0.85;
        else if (soilTextureTemp == "SICL" || soilTextureTemp == "CL" || soilTextureTemp == "MK-SIL") return 0.4;
        else if (soilTextureTemp == "NA") return 0;
        else return 1;
	}; //end this.getMixedFruitsVegetables
	
	//return yield base rate for cattle dependent on soil type and land use type
	this.getCattleSupported = function(year) {
		var CATTLE_BODY_WEIGHT = 1200;
		var GRAZING_SEASON_LENGTH = 200;
		var cattleAverageDailyIntake = 0.03 * CATTLE_BODY_WEIGHT;
		var yieldBaseRates = [6.3, 3.6, 4.3, 5.6, 3.6, 4.1, 4.2, 6.5, 6.4, 3.6, 6.9, 6.7, 6.3, 0];
		return (this.getSeasonalUtilizationRate(year) / ((cattleAverageDailyIntake / 2000) * GRAZING_SEASON_LENGTH)) * yieldBaseRates[this.getSoilTypeYieldIndex(this.soilType)];
	}; //end this.getCattleSupported
	
	//return soil type index for yield base rate arrays
	this.getSoilTypeYieldIndex = function(soil){
			switch (soil) {
				case 'A':
					return 0;

				case 'B':
					return 1;

				case 'C':
					return 2;

				case 'D':
					return 3;

				case 'G':
					return 4;

				case 'K':
					return 5;

				case 'L':
					return 6;

				case 'M':
					return 7;

				case 'N':
					return 8;

				case 'O':
					return 9;

				case 'Q':
					return 10;

				case 'T':
					return 11;

				case 'Y':
					return 12;

				case 'NA':
					return 13;

				case '0':
					return 13;
			}//end switch
	}; //end this.getSoilTypeYieldIndex

//End Methods that assist yieldTile
//--------------------------------------------------------------

};
//end construction of Tile

//######################################################################################
//######################################################################################

//Constructor method for a Results Object
//The results object must be associated with a board
//Tiles should be updated as values are changed, but a results object only needs updated when results are to be displayed
function Results(board) {
	this.phosphorusLoad = [0, 0, 0, 0];
	this.sedimentDelivery = [0, 0, 0, 0];
	this.grossErosion = [0, 0, 0, 0];
	this.nitrateConcentration = [0, 0, 0, 0];
	this.carbonSequestration = [0, 0, 0, 0];
	this.acre = null;
	this.gameWildlifePoints = [0, 0, 0, 0];
	this.biodiversityPoints = [0, 0, 0, 0];
	this.yieldResults = [0, 0, 0, 0];
	this.landUseResults = [0, 0, 0, 0];

	//other secondary variables
	this.nativeVegetationPercent = Array(4);
	this.nativeVegetationHDPercent = Array(4);
	this.nativeVegetationHDorLIPercent = Array(4);
	this.conservationForestPercent = Array(4);
	this.grasslandPercent = Array(4);
	this.wetlandPercent = Array(4);
	this.streamBufferPercent = Array(4);
	this.strategicWetlandPercent = Array(4); //percent of stategic cells actually occupied by wetland
	this.subwatershedArea = Array(22);
	this.wetlandMultiplier = Array(4);
	this.subWatershedNitrate = Array(4);
	this.watershedPercent = Array(4); //nitrate percent levels per watershed for maps
	this.strategicWetlandCells = Array(4);
	this.grossErosionSeverity = Array(4);
	this.phosphorusRiskAssessment = Array(4);
	this.nitrateContribution = Array(4);
	
	//score variables
	this.gameWildlifePointsScore = [0,0,0,0];
	this.biodiversityPointsScore = [0,0,0,0];
	this.carbonSequestrationScore = [0,0,0,0];
	this.grossErosionScore = [0,0,0,0];
	this.nitrateConcentrationScore = [0,0,0,0];
	this.phosphorusLoadScore = [0,0,0,0] ;
	this.sedimentDeliveryScore = [0,0,0,0] ;


	//Function to sum the values of calculatedCarbonSequestration for each tile
	this.sumCarbon = function() {

		var tempCarbonSum = [0, 0, 0, 0];

		for (var y = 1; y <= board.calculatedToYear; y++) {

			//For each tile, add the carbon sequestration value to the results array in corresponding year y
			for (var i = 0; i < board.map.length; i++) {
				tempCarbonSum[y] += board.map[i].results[y].calculatedCarbonSequestration;
			}

			//PEWI calculations are reported in megagrams, the previous calculation in kilograms therefore divide by 1000
			this.carbonSequestration[y] = tempCarbonSum[y] / 1000;
		} //end for

	}; //end this.sumCarbon

	//Function to sum the values of calculatedGrossErosion for each tile
	this.sumGrossErosion = function() {

		var tempErosionSum = [0, 0, 0, 0];

		for (var y = 1; y <= board.calculatedToYear; y++) {

			//For each tile, add the gross erosion rate value * tile area to the results array in corresponding year y
			for (var i = 0; i < board.map.length; i++) {
				tempErosionSum[y] += (board.map[i].results[y].calculatedGrossErosionRate * board.map[i].area);
			} //end for each tile

			this.grossErosion[y] = tempErosionSum[y];
		} //end for all year
	}; //end this.sumGrossErosion

	//Function to sum the values of phosphorusDelivered for each tile
	this.sumPhosphorus = function() {

		var tempPhosphorusSum = [0, 0, 0, 0];

		for (var y = 1; y <= board.calculatedToYear; y++) {

			//For each tile, add the phosphorus delivered value to the results array in corresponding year y
			for (var i = 0; i < board.map.length; i++) {
				tempPhosphorusSum[y] += (board.map[i].results[y].phosphorusDelivered);
			} //end for all tiles
			this.phosphorusLoad[y] = (tempPhosphorusSum[y] / 2000);
		} //end for all years
	}; //end this.sumPhosphorus

	//Function to sum the values of sedimentDeliveryToStream
	this.sumSedimentDeliveryToStream = function() {

		var tempSedimentDelivery = [0, 0, 0, 0];

		for (var y = 1; y <= board.calculatedToYear; y++) {

			//For each tile, add the sediment delivery tile value * tile area to the results array in corresponding year y
			for (var i = 0; i < board.map.length; i++) {
				tempSedimentDelivery[y] += (board.map[i].results[y].calculatedSedimentDeliveryToStreamTile * board.map[i].area);
			} //end for each tile
			this.sedimentDelivery[y] = tempSedimentDelivery[y];
		} //end for all years
	}; //end this.sumSedimentDeliveryToStream

	//function to calculate the nitrates for each subWatershed
	//the total value is then the sum of each subWatershed calculation
	this.calculateNitrateConcentration = function() {

		//note, the calculations are done incrementally with the subWatershedNitrate array for clarity

		var tempNitrateConcentration = [0, 0, 0, 0];

		for (var y = 1; y <= board.calculatedToYear; y++) {
			var wetlandMultiplier = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
			var subWatershedNitrate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			for (var i = 0; i < board.map.length; i++) {

				subWatershedNitrate[board.map[i].subwatershed] += board.map[i].results[y].cropMultiplier;

				
				if ((board.map[i].landType[y] == LandUseType.wetland) && board.map[i].strategicWetland == 1) {

					wetlandMultiplier[board.map[i].subwatershed] = 0.48;
				} //end if

			} //end for all cells, adding Crop Multipliers


			for (var s = 1; s < this.subwatershedArea.length; s++) {

				//divide to accomodate for row crop multiplier	
				subWatershedNitrate[s] = subWatershedNitrate[s] / this.subwatershedArea[s];

				subWatershedNitrate[s] = 100 * this.precipitationMultiplier(y) * wetlandMultiplier[s] * subWatershedNitrate[s];

				//Take the maximum between the calculated value and 2
				//see thesis for this imposition of a floor value at 2
				subWatershedNitrate[s] = (subWatershedNitrate[s] < 2) ? 2 : subWatershedNitrate[s];

				//max between calculated and 2, now multiply times subwatershed area divided by total area
				subWatershedNitrate[s] = (subWatershedNitrate[s] * this.subwatershedArea[s]) / this.totalArea;

				//keep a running total of the amount each year by adding together subWatershed values
				tempNitrateConcentration[y] += subWatershedNitrate[s];

			} //end for all watersheds

			this.subWatershedNitrate[y] = subWatershedNitrate;
		} //end for all years

		this.nitrateConcentration = tempNitrateConcentration;
	}; //end this.calculateNitrateConcentration()

	//helper methods for assisting in calculateNitrateConcentration
	this.precipitationMultiplier = function(year) {

		if (board.precipitation[year] == 24.58 || board.precipitation[year] == 28.18) // If it's a dry year
		{
			return 0.86;
		}
		else if (board.precipitation[year] == 30.39 || board.precipitation[year] == 32.16 || board.precipitation[year] == 34.34) { // If it's a normal year
			if (board.precipitation[year - 1] == 24.58 || board.precipitation[year - 1] == 28.18) {
				return 1.69;
			}
			else {
				return 1;
			}
		}
		else { // If it's a flood year
			if (board.precipitation[year - 1] == 24.58 || board.precipitation[year - 1] == 28.18) {
				return 2.11;
			}
			else {
				return 1;
			}
		}
	}; //end this.precipitationMultiplier
	//---end helper methods for assisting in calculateNitrateConcentration

	//preliminary function that sums area and stream network cells (allows flexibility with map layout)
	this.sumArea = function() {
		var tempArea = 0;
		var tempStreamCells = 0; //stream buffer is on a Cell Basis, not area (see table S5)
		var tempStrategicWetlandCells = 0;
		var tempSubwatershedArea = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (var i = 0; i < board.map.length; i++) {

			tempArea += board.map[i].area;
			//if tile is in stream network
			if (board.map[i].streamNetwork == 1) {
				tempStreamCells += 1;
			}

			//if tile is a strategic wetland
			if (board.map[i].strategicWetland == 1) {
				tempStrategicWetlandCells += 1;
			}

			tempSubwatershedArea[board.map[i].subwatershed] += board.map[i].area;
		} //end for all Cells

		//sum all of the areas of the tiles
		this.totalArea = tempArea;
		this.totalStreamCells = tempStreamCells;
		this.totalStrategicWetlandCells = tempStrategicWetlandCells;
		this.subwatershedArea = tempSubwatershedArea;
	}; //end this.sumArea()

	//subcalculations based on flags for biodiversity and game wildlife
	//---These calculations must be done at the board level as they involve tile percentages
	this.sumFlagPercentages = function() {

		//for all years that have been calculated
		for (var y = 1; y <= board.calculatedToYear; y++) {

			var tempAreaNativeVegetation = 0;
			var tempAreaNativeVegetationHD = 0;
			var tempAreaNativeDiverseOrLowInput = 0;
			var tempAreaConservationForest = 0;
			var tempAreaGrassland = 0;
			var tempAreaWetland = 0;
			var tempCellsStreamBuffer = 0;
			var tempCellsWetlandOnStrategic = 0;

			//for all tiles
			for (var i = 0; i < board.map.length; i++) {

				if (board.map[i].results[y].nativeVegetationFlag) {
					tempAreaNativeVegetation += board.map[i].area;
				}

				if (board.map[i].results[y].nativeVegetationHDFlag) {
					tempAreaNativeVegetationHD += board.map[i].area;
				}

				if (board.map[i].results[y].nativeVegatationHDorLIFlag) {
					tempAreaNativeDiverseOrLowInput += board.map[i].area;
				}

				if (board.map[i].results[y].conservationForestFlag) {
					tempAreaConservationForest += board.map[i].area;
				}

				if (board.map[i].results[y].grasslandFlag) {
					tempAreaGrassland += board.map[i].area;
				}

				if (board.map[i].landType[y] == LandUseType.wetland) {
					tempAreaWetland += board.map[i].area;
				}

				if (board.map[i].results[y].streamBufferFlag) {
					tempCellsStreamBuffer += 1;
				}
				
				if ((board.map[i].landType[y] == LandUseType.wetland) && board.map[i].strategicWetland == 1) {
					tempCellsWetlandOnStrategic += 1;
				}

			} //end for all tiles

			//calculations for percentages and storage of values
			this.nativeVegetationPercent[y] = (tempAreaNativeVegetation / this.totalArea) * 100;
			this.nativeVegetationHDPercent[y] = (tempAreaNativeVegetationHD / this.totalArea) * 100;
			this.nativeVegetationHDorLIPercent[y] = (tempAreaNativeDiverseOrLowInput / this.totalArea) * 100;
			this.conservationForestPercent[y] = (tempAreaConservationForest / this.totalArea) * 100;
			this.grasslandPercent[y] = (tempAreaGrassland / this.totalArea) * 100;
			this.wetlandPercent[y] = (tempAreaWetland / this.totalArea) * 100;
			this.streamBufferPercent[y] = (tempCellsStreamBuffer / this.totalStreamCells) * 100;
			this.strategicWetlandPercent[y] = (tempCellsWetlandOnStrategic / this.totalStrategicWetlandCells) * 100;

			//for results hud
			this.strategicWetlandCells[y] = tempCellsWetlandOnStrategic;

		} //end for loop of all years calculated
	}; //end Sum percentages

	this.calculateGameWildLifePoints = function() {

		this.sumFlagPercentages();

		for (var y = 1; y <= board.calculatedToYear; y++) {
			var tempScore = 0

			//native vegetation and other high diversity land uses points
			if (this.nativeVegetationHDPercent[y] == 100) {
				tempScore += 4;
			}
			else if (this.nativeVegetationHDPercent[y] > 50) {
				tempScore += 3;
			}
			else if (this.nativeVegetationHDPercent[y] > 25) {
				tempScore += 2;
			}
			else if (this.nativeVegetationHDPercent[y] > 10) {
				tempScore += 1;
			}
			else {
				tempScore += 0;
			}

			//native vegetation and comparatively high-diversity or low input points
			if (this.nativeVegetationHDorLIPercent[y] == 100) {
				tempScore += 1.5;
			}
			else if (this.nativeVegetationHDorLIPercent[y] > 50) {
				tempScore += 1;
			}
			else if (this.nativeVegetationHDorLIPercent[y] > 10) {
				tempScore += .5;
			}
			else {
				tempScore += 0;
			}

			//conservation forest points
			if (this.conservationForestPercent[y] > 5) {
				tempScore += 1;
			}
			else {
				tempScore += 0;
			}

			//grassland points
			if (this.grasslandPercent[y] > 5) {
				tempScore += 1;
			}
			else {
				tempScore += 0;
			}

			//wetland points
			if (this.wetlandPercent[y] > 5) {
				tempScore += 1;
			}
			else {
				tempScore += 0;
			}

			//stream buffer points
			if (this.streamBufferPercent[y] == 100) {
				tempScore += 1.5;
			}
			else if (this.streamBufferPercent[y] > 50) {
				tempScore += 1;
			}
			else if (this.streamBufferPercent[y] > 10) {
				tempScore += 0.5;
			}
			else {
				tempScore += 0;
			}

			this.gameWildlifePoints[y] = tempScore;

		} //end for loop year

	}; //end calculations of game and wildlife points


	//calculations for the scoreing of biodiversity (done at board level)
	this.calculateBiodiversityPoints = function() {

		for (var y = 1; y <= board.calculatedToYear; y++) {
			var tempScore = 0

			//native vegetation points
			if (this.nativeVegetationPercent[y] == 100) {
				tempScore += 4;
			}
			else if (this.nativeVegetationPercent[y] > 50) {
				tempScore += 3;
			}
			else if (this.nativeVegetationPercent[y] > 25) {
				tempScore += 2;
			}
			else if (this.nativeVegetationPercent[y] > 10) {
				tempScore += 1;
			}
			else {
				tempScore += 0;
			}

			//native vegetation and other high diversity land uses points
			if (this.nativeVegetationHDPercent[y] == 100) {
				tempScore += 1.5;
			}
			else if (this.nativeVegetationHDPercent[y] > 50) {
				tempScore += 1;
			}
			else if (this.nativeVegetationHDPercent[y] > 10) {
				tempScore += 0.5;
			}
			else {
				tempScore += 0;
			}

			//native vegetation and comparatively high-diversity or low input points
			if (this.nativeVegetationHDorLIPercent[y] == 100) {
				tempScore += 1.5;
			}
			else if (this.nativeVegetationHDorLIPercent[y] > 50) {
				tempScore += 1;
			}
			else if (this.nativeVegetationHDorLIPercent[y] > 10) {
				tempScore += .5;
			}
			else {
				tempScore += 0;
			}

			//wetland points (wholly distinct from Game Wildlife Calcs)
			if (this.wetlandPercent[y] > 5 && this.strategicWetlandPercent == 100) {
				tempScore += 1.5;
			}
			else if (this.wetlandPercent[y] > 5 && this.strategicWetlandPercent > 75) {
				tempScore += 1;
			}
			else if (this.wetlandPercent[y] > 5 && this.strategicWetlandPercent > 50) {
				tempScore += 0.5;
			}
			else {
				tempScore += 0;
			}

			//stream buffer points
			if (this.streamBufferPercent[y] == 100) {
				tempScore += 1.5;
			}
			else if (this.streamBufferPercent[y] > 50) {
				tempScore += 1;
			}
			else if (this.streamBufferPercent[y] > 10) {
				tempScore += 0.5;
			}
			else {
				tempScore += 0;
			}

			this.biodiversityPoints[y] = tempScore;

		} //end for loop year

	}; //end calculations of biodiversity points

	//Function to sum the values of YieldTile to YieldValueArray
	this.sumYields = function() {

		var tempYieldResults = Array(4);
		tempYieldResults[0] = {
			cornGrainYield: 0,
			soybeanYield: 0,
			alfalfaHayYield: 0,
			grassHayYield: 0,
			woodYield: 0,
			cattleYield: 0,
			switchgrassYield: 0,
			shortRotationWoodyBiomassYield: 0,
			mixedFruitsAndVegetablesYield: 0,
		};
		tempYieldResults[1] = {
			cornGrainYield: 0,
			soybeanYield: 0,
			alfalfaHayYield: 0,
			grassHayYield: 0,
			woodYield: 0,
			cattleYield: 0,
			switchgrassYield: 0,
			shortRotationWoodyBiomassYield: 0,
			mixedFruitsAndVegetablesYield: 0,
			cornGrainYieldScore: 0
		};
		tempYieldResults[2] = {
			cornGrainYield: 0,
			soybeanYield: 0,
			alfalfaHayYield: 0,
			grassHayYield: 0,
			woodYield: 0,
			cattleYield: 0,
			switchgrassYield: 0,
			shortRotationWoodyBiomassYield: 0,
			mixedFruitsAndVegetablesYield: 0
		};
		tempYieldResults[3] = {
			cornGrainYield: 0,
			soybeanYield: 0,
			alfalfaHayYield: 0,
			grassHayYield: 0,
			woodYield: 0,
			cattleYield: 0,
			switchgrassYield: 0,
			shortRotationWoodyBiomassYield: 0,
			mixedFruitsAndVegetablesYield: 0
		};

		for (var y = 1; y <= board.calculatedToYear; y++) {

			//For each tile, add the tile yield Values * tile area to variables corresponding to each yield type
			for (var i = 0; i < board.map.length; i++) {

				var yieldValueToStore = board.map[i].results[y].calculatedYieldTile * board.map[i].area;

				switch (LandUseType.getType(board.map[i].landType[y])) {
					case "none":
						//Do Nothing
						break;
					case "conventionalCorn":
						tempYieldResults[y].cornGrainYield += yieldValueToStore;
						break;
					case "conservationCorn":
						tempYieldResults[y].cornGrainYield += yieldValueToStore;
						break;
					case "conventionalSoybean":
						tempYieldResults[y].soybeanYield += yieldValueToStore;
						break;
					case "conservationSoybean":
						tempYieldResults[y].soybeanYield += yieldValueToStore;
						break;
					case "alfalfa":
						tempYieldResults[y].alfalfaHayYield += yieldValueToStore;
						break;
					case "permanentPasture":
						tempYieldResults[y].cattleYield += yieldValueToStore;
						break;
					case "rotationalGrazing":
						tempYieldResults[y].cattleYield += yieldValueToStore;
						break;
					case "grassHay":
						tempYieldResults[y].grassHayYield += yieldValueToStore;
						break;
					case "prairie":
						//Do nothing - does not report yield
						break;
					case "conservationForest":
						tempYieldResults[y].woodYield += yieldValueToStore;
						break;
					case "conventionalForest":
						tempYieldResults[y].woodYield += yieldValueToStore;
						break;
					case "switchgrass":
						tempYieldResults[y].switchgrassYield += yieldValueToStore;
						break;
					case "shortRotationWoodyBioenergy":
						tempYieldResults[y].shortRotationWoodyBiomassYield += yieldValueToStore;
						break;
					case "wetland":
						//Do nothing - does not report yield
						break;
					case "mixedFruitsVegetables":
						tempYieldResults[y].mixedFruitsAndVegetablesYield += yieldValueToStore;
						break;
				}

			}
			
		}

		this.yieldResults = tempYieldResults;

	}; //end sumYields

	//Function to sum the areas of land use to landUseResults
	this.sumLandUse = function() {

		var tempLandUseResults = Array(4);
		tempLandUseResults[0] = {
			conventionalCornLandUse: 0,
			conservationCornLandUse: 0,
			conventionalSoybeanLandUse: 0,
			conservationSoybeanLandUse: 0,
			mixedFruitsVegetablesLandUse: 0,
			permanentPastureLandUse: 0,
			rotationalGrazingLandUse: 0,
			grassHayLandUse: 0,
			switchgrassLandUse: 0,
			prairieLandUse: 0,
			wetlandLandUse: 0,
			alfalfaLandUse: 0,
			conservationForestLandUse: 0,
			conventionalForestLandUse: 0,
			shortRotationWoodyBioenergyLandUse: 0
		};
		tempLandUseResults[1] = {
			conventionalCornLandUse: 0,
			conservationCornLandUse: 0,
			conventionalSoybeanLandUse: 0,
			conservationSoybeanLandUse: 0,
			mixedFruitsVegetablesLandUse: 0,
			permanentPastureLandUse: 0,
			rotationalGrazingLandUse: 0,
			grassHayLandUse: 0,
			switchgrassLandUse: 0,
			prairieLandUse: 0,
			wetlandLandUse: 0,
			alfalfaLandUse: 0,
			conservationForestLandUse: 0,
			conventionalForestLandUse: 0,
			shortRotationWoodyBioenergyLandUse: 0
		};
		tempLandUseResults[2] = {
			conventionalCornLandUse: 0,
			conservationCornLandUse: 0,
			conventionalSoybeanLandUse: 0,
			conservationSoybeanLandUse: 0,
			mixedFruitsVegetablesLandUse: 0,
			permanentPastureLandUse: 0,
			rotationalGrazingLandUse: 0,
			grassHayLandUse: 0,
			switchgrassLandUse: 0,
			prairieLandUse: 0,
			wetlandLandUse: 0,
			alfalfaLandUse: 0,
			conservationForestLandUse: 0,
			conventionalForestLandUse: 0,
			shortRotationWoodyBioenergyLandUse: 0
		};
		tempLandUseResults[3] = {
			conventionalCornLandUse: 0,
			conservationCornLandUse: 0,
			conventionalSoybeanLandUse: 0,
			conservationSoybeanLandUse: 0,
			mixedFruitsVegetablesLandUse: 0,
			permanentPastureLandUse: 0,
			rotationalGrazingLandUse: 0,
			grassHayLandUse: 0,
			switchgrassLandUse: 0,
			prairieLandUse: 0,
			wetlandLandUse: 0,
			alfalfaLandUse: 0,
			conservationForestLandUse: 0,
			conventionalForestLandUse: 0,
			shortRotationWoodyBioenergyLandUse: 0
		};

		for (var y = 1; y <= board.calculatedToYear; y++) {

			//For each tile, add tile area to variables corresponding to each land use type
			for (var i = 0; i < board.map.length; i++) {

				switch (LandUseType.getType(board.map[i].landType[y])) {
					case "none":
						//Do Nothing
						break;
					case "conventionalCorn":
						tempLandUseResults[y].conventionalCornLandUse += board.map[i].area;
						break;
					case "conservationCorn":
						tempLandUseResults[y].conservationCornLandUse += board.map[i].area;
						break;
					case "conventionalSoybean":
						tempLandUseResults[y].conventionalSoybeanLandUse += board.map[i].area;
						break;
					case "conservationSoybean":
						tempLandUseResults[y].conservationSoybeanLandUse += board.map[i].area;
						break;
					case "alfalfa":
						tempLandUseResults[y].alfalfaLandUse += board.map[i].area;
						break;
					case "permanentPasture":
						tempLandUseResults[y].permanentPastureLandUse += board.map[i].area;
						break;
					case "rotationalGrazing":
						tempLandUseResults[y].rotationalGrazingLandUse += board.map[i].area;
						break;
					case "grassHay":
						tempLandUseResults[y].grassHayLandUse += board.map[i].area;
						break;
					case "prairie":
						tempLandUseResults[y].prairieLandUse += board.map[i].area;
						break;
					case "conservationForest":
						tempLandUseResults[y].conservationForestLandUse += board.map[i].area;
						break;
					case "conventionalForest":
						tempLandUseResults[y].conventionalForestLandUse += board.map[i].area;
						break;
					case "switchgrass":
						tempLandUseResults[y].switchgrassLandUse += board.map[i].area;
						break;
					case "shortRotationWoodyBioenergy":
						tempLandUseResults[y].shortRotationWoodyBioenergyLandUse += board.map[i].area;
						break;
					case "wetland":
						tempLandUseResults[y].wetlandLandUse += board.map[i].area;
						break;
					case "mixedFruitsVegetables":
						tempLandUseResults[y].mixedFruitsVegetablesLandUse += board.map[i].area;
						break;
				}

			}

		}

		this.landUseResults = tempLandUseResults;

	}; //end sumLandUse

	//Function to store values of nitrateConcentration, grossErosionRate, and phosphorusRiskAssessment per tile for maps
	//check this function!
	this.mapIt = function() {

		var watershedPercent = Array(4);
		watershedPercent = [
			[],
			[],
			[],
			[]
		];
		
		var nitrateContribution = Array(4);
		nitrateContribution = [
			[],
			[],
			[],
			[]
		];

		var grossErosionSeverity = Array(4);
		grossErosionSeverity = [
			[],
			[],
			[],
			[]
		];
		
		var phosphorusRisk = Array(4);
		phosphorusRisk = [
			[],
			[],
			[],
			[]
		];

		for (var y = 1; y <= board.calculatedToYear; y++) {

			//For each watershed store nitrate percent contribution
			for (var i = 0; i < this.subwatershedArea.length; i++) {

				watershedPercent[y].push(this.subWatershedNitrate[y][i]  / (this.subwatershedArea[i] / this.totalArea) * (this.subwatershedArea[i] / board.watershedArea) / this.nitrateConcentration[y]);

			}

			//For each tile, store grossErosionRate and phosphorusRiskAssessment indices calculated by submethods
			//TODO: Phosphorus Risk Assessment
			for (var i = 0; i < board.map.length; i++) {
				grossErosionSeverity[y].push(this.getGrossErosionSeverity(board.map[i].results[y].calculatedGrossErosionRate));
				phosphorusRisk[y].push(this.getPhosphorusRiskAssessment(board.map[i].results[y].phosphorusDelivered / board.map[i].area));
				nitrateContribution[y].push(watershedPercent[y][board.map[i].subwatershed]);
				
			}
		}

		this.watershedPercent = watershedPercent;
		this.nitrateContribution = nitrateContribution;
		this.grossErosionSeverity = grossErosionSeverity;
		this.phosphorusRiskAssessment = phosphorusRisk;

	}; //end this.mapIt

	//Helper method for mapIt function to calculate grossErosionRate tile indicies
	this.getGrossErosionSeverity = function(erosion) {
		if (erosion > 5) return 5;
		else if (erosion <= 5 && erosion >= 3.5) return 4;
		else if (erosion <= 3.5 && erosion > 2) return 3;
		else if (erosion <= 2 && erosion > 0.5) return 2;
		else if (erosion <= 0.5) return 1;
	}; //end this.getGrossErosionSeverity
	
	//Helper method for mapIt function to calculate phosphorusRiskAssessment tile indicies
	this.getPhosphorusRiskAssessment = function(pindex) {
		if (pindex >= 0 && pindex <= 1) return 1;
        else if (pindex > 1 && pindex <= 2) return 2;
        else if (pindex > 2 && pindex <= 5) return 3;
        else if (pindex > 5 && pindex <= 15) return 4;
        else if (pindex > 15) return 5;
        return "";
	}


	this.updateScores = function() {
		
		for(var y = 1; y<= board.calculatedToYear; y++){
			
			this.gameWildlifePointsScore[y] = this.gameWildlifePoints[y] * 10 ;
			this.biodiversityPointsScore[y] = this.biodiversityPoints[y] * 10 ;
			this.carbonSequestrationScore[y] = 100 * ((this.carbonSequestration[y] - board.minimums.carbonMin) / (board.maximums.carbonMax - board.minimums.carbonMin)) ;
			this.grossErosionScore[y] =  100 * ((board.maximums.erosionMax - this.grossErosion[y]) / (board.maximums.erosionMax - board.minimums.erosionMin));
		
			this.nitrateConcentrationScore[y] = 100 * ((board.maximums.nitrateMax - this.nitrateConcentration[y]) / (board.maximums.nitrateMax - board.minimums.nitrateMin)) ;
			this.phosphorusLoadScore[y] = 100 * ((board.maximums.phosphorusMax - this.phosphorusLoad[y]) / (board.maximums.phosphorusMax - board.minimums.phosphorusMin)) ;
			this.sedimentDeliveryScore[y] = 100 * ((board.maximums.sedimentMax - this.sedimentDelivery[y]) / (board.maximums.sedimentMax - board.minimums.sedimentMin))	;
	
			this.yieldResults[y].cornGrainYieldScore = 100 * this.yieldResults[y].cornGrainYield / board.maximums.cornMax ;
    		this.yieldResults[y].soybeanYieldScore = 100 * this.yieldResults[y].soybeanYield / board.maximums.soybeanMax ;
    		this.yieldResults[y].alfalfaHayYieldScore = 100 * this.yieldResults[y].alfalfaHayYield / board.maximums.alfalfaMax ;
			this.yieldResults[y].grassHayYieldScore = 100 * this.yieldResults[y].grassHayYield / board.maximums.grassHayMax ;
    		this.yieldResults[y].woodYieldScore = 100 * this.yieldResults[y].woodYield / board.maximums.woodMax ;
    		this.yieldResults[y].cattleYieldScore = 100 * this.yieldResults[y].cattleYield / board.maximums.cattleMax ;
    		this.yieldResults[y].switchgrassYieldScore = 100 * this.yieldResults[y].switchgrassYield / board.maximums.switchgrassMax ;
    		this.yieldResults[y].shortRotationWoodyBiomassYieldScore = 100 * this.yieldResults[y].shortRotationWoodyBiomassYield / board.maximums.shortRotationWoodyBiomassMax ;
    		this.yieldResults[y].mixedFruitsAndVegetablesYieldScore = 100 * this.yieldResults[y].mixedFruitsAndVegetablesYield / board.maximums.mixedFruitsAndVegetablesMax 
	
	
	
		}
		
		
	}



	//================================================
	//updates all the necessary values by going through updated tiles
	//note that some calculations depend on results of other calculations so be careful about reorganizing

	this.update = function() {

		this.sumArea();

		//update this as functions are added
		this.sumCarbon();
		this.sumGrossErosion();
		this.sumPhosphorus();
		this.sumSedimentDeliveryToStream();
		this.sumYields();
		this.sumLandUse();
		this.calculateNitrateConcentration();
		this.mapIt();

		this.calculateGameWildLifePoints();
		this.calculateBiodiversityPoints(); //Game Wildlife must come first as it alone calls sumFlagPercentages()
		
		this.updateScores();
		
	}; //end this.update()

}; //end construction of results


//######################################################################################
//######################################################################################


//Function to construct a game board object
//game boards can be associated with multiple results objects

function GameBoard() {
	this.precipitation = [0, 0, 0, 0, 24.58, 45.1];
	this.precipitationIndex = [0,0,0,0] ;
	this.map = Array();
	this.calculatedToYear = 1;
	this.watershedArea = 0;
	this.maximums = {};
	this.minimums = {};
	this.width = 0;
	this.height = 0;

	//This function updates all of the tiles in the board to the calculatedYear
	//Use this only when you need to update all of the tiles, such as initially or when precip is changed
	//  otherwise, avoid using this function and update tiles individually since this is computationally intensive
	this.updateBoard = function() {
			for (var y = 1; y <= this.calculatedToYear; y++) {
				for (var i = 0; i < this.map.length; i++) {
					this.map[i].update(y);
				}

			}
		} //end updateBoard

	//this function establishes the board area for calculations that depend on it
	//and determines the dimensions of the board
	this.establishBoardArea = function() {

		var tempArea = 0;
		var maxHeight = 0;
		var maxWidth = 0;

		for (var i = 0; i < this.map.length; i++) {
			tempArea += this.map[i].area;
			if(this.map[i].row > maxHeight){ 
				maxHeight++;
			}
			if(this.map[i].column > maxWidth){ 
				maxWidth++;
			}
		} //end for all Cells

		//update Board watershed Area for some tile level calculations!
		this.watershedArea = tempArea;
		
		//update Board dimensions
		this.width = maxWidth;
		this.height = maxHeight;
		
	}; //end establishBoardArea
	
	
	//This function calculates the maximums and minimums for calculations of percentages
	this.calculateMaxMin = function() {
		
		var cornMax = 0; var soybeanMax = 0; var hayMax = 0; var woodMax = 0;
		var cattleMax = 0; var switchgrassMax = 0; var shortWoodyMax = 0; var mixedMax = 0;
		var erosionMax = 0; var erosionMin = 0; var phosphorusMax = 0; var phosphorusMin = 0;
		var sedimentMax = 0; var sedimentMin = 0;
		
		//Loop through "years" indexed at 4 and 5 to calculate min and max values
		
		for (var i = 0; i < this.map.length; i++) {
			
			//Sum Maximum Yield Values
			cornMax += this.map[i].getCornGrainYield() * this.map[i].area;
			soybeanMax += this.map[i].getSoybeanYield() * this.map[i].area;
			hayMax += this.map[i].getHayYield() * this.map[i].area; 
			woodMax += this.map[i].getWoodYield() * this.map[i].area;
			cattleMax += this.map[i].getCattleSupported(5) * this.map[i].area;
			switchgrassMax += this.map[i].getSwitchgrassYield() * this.map[i].area;
			shortWoodyMax += 60.8608 * this.map[i].area;
			mixedMax += 7.34 * this.map[i].area * this.map[i].getMixedFruitsVegetablesYield();
			
			
			//Calculate Quality Indicator Values
			this.map[i].rusle(4);
			this.map[i].ephemeralGullyErosion(4); 
			erosionMin += (this.map[i].rusleValues[4] + this.map[i].ephemeralGullyErosionValue[4]) * this.map[i].area;
			
			this.map[i].rusle(5);
			this.map[i].ephemeralGullyErosion(5);
			erosionMax += (this.map[i].rusleValues[5] + this.map[i].ephemeralGullyErosionValue[5]) * this.map[i].area;
			
			if(this.map[i].soilType != "NA" && this.map[i].soilType != "0" && this.map[i].soilType != 0){
			
				this.map[i].updatePhosphorusParameters(4);
				phosphorusMin += this.map[i].area * (this.map[i].erosionComponent(4) + this.map[i].drainageComponent(4) + this.map[i].runoffComponent(4)) / 2000;
				sedimentMin += (this.map[i].rusleValues[4] + this.map[i].ephemeralGullyErosionValue[4]) * this.map[i].sedimentDeliveryRatio * this.map[i].bufferFactor(4) * this.map[i].area;
				
				this.map[i].updatePhosphorusParameters(5);
				phosphorusMax += this.map[i].area * (this.map[i].erosionComponent(5) + this.map[i].drainageComponent(5) + this.map[i].runoffComponent(5)) / 2000;
				sedimentMax += (this.map[i].rusleValues[5] + this.map[i].ephemeralGullyErosionValue[5]) * this.map[i].sedimentDeliveryRatio * this.map[i].bufferFactor(5) * this.map[i].area;
			
			}

		}
		
		this.maximums.cornMax = cornMax;
		this.maximums.soybeanMax = soybeanMax;
		this.maximums.alfalfaMax = hayMax;
		this.maximums.grassHayMax = hayMax;
		this.maximums.woodMax = woodMax;
		this.maximums.cattleMax = cattleMax;
		this.maximums.switchgrassMax = switchgrassMax;
		this.maximums.shortRotationWoodyBiomassMax = shortWoodyMax;
		this.maximums.mixedFruitsAndVegetablesMax = mixedMax;
		
		this.maximums.carbonMax = 1897.98 * this.watershedArea / 1000;
		this.minimums.carbonMin = 0;
		this.minimums.erosionMin = erosionMin;
		this.maximums.erosionMax = erosionMax;
		this.minimums.phosphorusMin = phosphorusMin;
		this.maximums.phosphorusMax = phosphorusMax;
		this.minimums.nitrateMin = 2;
		this.maximums.nitrateMax = 100 * 0.14 * 2.11;
		this.minimums.sedimentMin = sedimentMin;
		this.maximums.sedimentMax = sedimentMax;
		
	}; //end calculateMaxMin
	
	//this function performs the necessary functions that we need to set up a Results object
	//preform the init function immediately after the creation of a Results object and its linkage to an associated board
	this.init = function() {
		
		//Initialize the gameboard with Max and Min Values
		this.establishBoardArea();
		this.calculateMaxMin();
		
	}; //end init

}; //end GameBoard construction


//######################################################################################
//######################################################################################
