var textureArray ;
var multiplayerTextureArray = [];
var materialArray = [];
var highlightArray = [];
var oldPewiBackgrounds = [];
var rainTexture;
var tile0;
var grayTextureArray;


//this function loads into the texture arrays the necessary images for creation of webGl
//  materials. All are loaded via the three.js textureLoader
//  lastly, the multiplayer array is created for multiplayer use if needed
function loadResources() {

    //Add a textureLoader to load textures for THREE.js
    var textureLoader = new THREE.TextureLoader();


    //stuff for the contourMap

    tile0 = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Mixed_Fruits_and_Vegetables.png');

    //Load the land type textures. Each land type has a number from 1 to 15.
    var textureClear = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_None.png');
    // var textureConventionalCorn = textureLoader.load('./imgs/topography/images/TileNum0.png'); //1 cell_images_bitmaps/LandUse_Conventional_Corn.png
    var textureConventionalCorn = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Conventional_Corn.png')
    var textureConservationCorn = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Conservation_Corn.png'); //2
    var textureConventionalSoybean = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Conventional_Soybean.png');//3
    var textureConservationSoybean = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Conservation_Soybean.png');//4
    var textureAlfalfa = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Alfalfa.png');//5
    var texturePermanentPasture = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Permanent_Pasture.png');//6
    var textureRotationalGrazing = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Rotational_Grazing.png');//7
    var textureGrassHay = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Hay.png');//8
    var texturePrairie = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Prairie.png');//9
    var textureConservationForest = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Conservation_Forest.png');//10
    var textureConventionalForest = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Conventional_Forest.png');//11
    var textureShortWoody = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Woody_Bioenergy.png');//12
    var textureHerbs = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Herbaceous_Perennial_Bioene.png');//13
    var textureWetland = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Wetland.png');//14
    var textureMixedFruitsVegetables = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Mixed_Fruits_and_Vegetables.png');//15

    //load grayscale land type tectures
    var grayConventionalCorn = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Conventional_Corn.png'); //1
    var grayConservationCorn = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Conservation_Corn.png'); //2
    var grayConventionalSoybean = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Conventional_Soybean.png');//3
    var grayConservationSoybean = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Conservation_Soybean.png');//4
    var grayAlfalfa = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Alfalfa.png');//5
    var grayPermanentPasture = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Permanent_Pasture.png');//6
    var grayRotationalGrazing = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Rotational_Grazing.png');//7
    var grayGrassHay = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Hay.png');//8
    var grayPrairie = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Prairie.png');//9
    var grayConservationForest = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Conservation_Forest.png');//10
    var grayConventionalForest = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Conventional_Forest.png');//11
    var grayShortWoody = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Woody_Bioenergy.png');//12
    var grayHerbs = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Herbaceous_Perennial_Bioene.png');//13
    var grayWetland = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Wetland.png');//14
    var grayMixedFruitsVegetables = textureLoader.load('./imgs/Grayscale_Imgs/Gray_Mixed_Fruits_and_Vegetables.png');//15

    //yield textures
    //var textureCornGrain = textureLoader.load('./imgs/cell_images_bitmaps/cornGrainIcon.png'); //16

    //Add the land type textures to textureArray
    textureArray = [textureClear, textureConventionalCorn, textureConservationCorn, textureConventionalSoybean, textureConservationSoybean,
        textureAlfalfa, texturePermanentPasture, textureRotationalGrazing, textureGrassHay,
        texturePrairie, textureConservationForest, textureConventionalForest, textureHerbs, textureShortWoody,
        textureWetland, textureMixedFruitsVegetables,// textureCornGrain
    ];

    //Add the gray land type textures to textureArray
    grayTextureArray = [textureClear, grayConventionalCorn, grayConservationCorn, grayConventionalSoybean, grayConservationSoybean,
        grayAlfalfa, grayPermanentPasture, grayRotationalGrazing, grayGrassHay,
        grayPrairie, grayConservationForest, grayConventionalForest, grayHerbs, grayShortWoody,
        grayWetland, grayMixedFruitsVegetables,// textureCornGrain
    ];

    //Add old pewi backgrounds to array after loaded
    oldPewiBackgrounds = [textureLoader.load("./imgs/background_images/Background_Drought.png"), textureLoader.load("./imgs/background_images/Background_Normal.png"), textureLoader.load("./imgs/background_images/Background_Flood.png")];

    //Load all highlighted color tiles to the highlightArray

    //Subwatershed Nitrate-N Percent Contribution Map
    //Currently used for Nitrate, Erosion, and Phosphorus
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00.png')); // 0        Yellow
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08.png')); // 1        Orange
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490d.png')); // 2        Orange-Brown
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010.png')); // 3        Dark-Red
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12.png')); // 4        Mahogany

    //Currently used for Flood Frequency
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ffffc9.png')); // 5        Cream
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c7eab4.png')); // 6        Pale Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/7fcebb.png')); // 7        Sea Foam Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5.png')); // 8        Sky Blue
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7.png')); // 9        Blue

    //Subwatershed Boundaries and Soil Class
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/45aa98.png')); // 10       Mint
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/127731.png')); // 11       Dark Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/989836.png')); // 12       Dark-Green Yellow
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/cc6578.png')); // 13       Medium Pink
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/a84597.png')); // 14       Fuschia
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/dbcb74.png')); // 15       Light-Green Yellow
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/342286.png')); // 16       Dark Blue
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/862254.png')); // 17       Dark Purple
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceee.png')); // 18       Sky Blue
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/097c2f.png')); // 19       Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/979936.png')); // 20       Light Olive
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/47aa98.png')); // 21       Dark Sea Foam Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e3c972.png')); // 22       Yellow-Tan
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/cb657a.png')); // 23       Reddish-Pink
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/882252.png')); // 24       Cranberry
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/aa4497.png')); // 25       Violet
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486.png')); // 26       Blue-Purple
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/76d1c4.png')); // 27       Dark-Mint
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/3f9f91.png')); // 28       Dark Seafoam Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/187336.png')); // 29       Forest Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/919246.png')); // 30       Olive
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3.png')); // 31       Cobalt
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/38638b.png')); // 32       Navy
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/5e6e71.png')); // 33       Grey
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/837856.png')); // 34       Brownish-Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/bc892f.png')); // 35       Gold

    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ffffc9.png')); // 36       Cream
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e3c972.png')); // 37       Yellow-Tan
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/919246.png')); // 38       Olive
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/8b4513.png')); // 39       Saddle Brown
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/654321.png')); // 40       Dark Brown

    //Added Strategic Wetlands Color to a lighter orange to emphasize the locations of the wetlands
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/FFB347.png')); // 41       Light Orange

    //Added additional Yield Overlay Map Colors
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/8B008B.png')); // 42       Dark Magenta

    //Soybean Yield
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ffffff.png')); // 43       White
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ccffcc.png')); // 44       White Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/66ff66.png')); // 45       Lime Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/00ff00.png')); // 46       Medium Green

    //GrassHay Yield
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/d9ff66.png')); // 47       Light Yellowish Green

    //SwitchGrass Yield
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/C2F0C2.png')); // 48       Really Pale Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/33CC33.png')); // 49       Mediumish Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/1F7A1F.png')); // 50       Normalish Green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/145214.png')); // 51       Darkish Green

    //Wood Yield
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/F2E6D9.png')); // 52       Really Light Brown
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/d9b38c.png')); // 53       Medium Light Brown
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ac7339.png')); // 54       Mediumish Brown
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/734D26.png')); // 55       Darker Medium Brown

    //Fruits Yield
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ff4000.png')); // 56       Red

    //Cattle Yield
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/000000.png')); // 57       Black
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/CECACA.png')); // 58       Light Grey
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/360b07.png')); // 59      Dark Mahogany

    //The Nitrate subwatershed percent contribution overlay is made so that the borders between subwatershed Boundaries
    //are bolded. This requires a specific bolded cell image for any possible instance of bolding direction for the 5
    //different key colors.

    //Bold cells for 87cee
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldTop.png')); // 60 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldRight.png')); // 61 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldBottom.png')); // 62 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldLeft.png')); // 63 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldTopLeft.png')); // 64 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldTopRight.png')); // 65 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldBottomLeft.png')); // 66 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldBottomRight.png')); // 67 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldBottomLeftRight.png')); // 68 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldTopLeftRight.png')); // 69 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldTopLeftBottom.png')); // 70 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldTopRightBottom.png')); // 71 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeBoldLeftRight.png')); // 72 left right

    //Bold cells for 41b7c5
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldTop.png')); // 73 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldRight.png')); // 74 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldBottom.png')); // 75 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldLeft.png')); // 76 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldTopLeft.png')); // 77 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldTopRight.png')); // 78 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldBottomLeft.png')); // 79 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldBottomRight.png')); // 80 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldBottomLeftRight.png')); // 81 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldTopLeftRight.png')); // 82 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldTopLeftBottom.png')); // 83 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldTopRightBottom.png')); // 84 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5BoldLeftRight.png')); // 85 left right

    //Bold cells for 2f7eb7
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldTop.png')); // 86 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldRight.png')); // 87 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldBottom.png')); // 88 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldLeft.png')); // 89 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldTopLeft.png')); // 90 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldTopRight.png')); // 91 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldBottomLeft.png')); // 92 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldBottomRight.png')); // 93 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldBottomLeftRight.png')); // 94 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldTopLeftRight.png')); // 95 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldTopLeftBottom.png')); // 96 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldTopRightBottom.png')); // 97 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7BoldLeftRight.png')); // 98 left right

    //Bold cells for 0053b3
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldTop.png')); // 99 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldRight.png')); // 100 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldBottom.png')); // 101 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldLeft.png')); // 102 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldTopLeft.png')); // 103 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldTopRight.png')); // 104 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldBottomLeft.png')); // 105 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldBottomRight.png')); // 106 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldBottomLeftRight.png')); // 107 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldTopLeftRight.png')); // 108 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldTopLeftBottom.png')); // 109 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldTopRightBottom.png')); // 110 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3BoldLeftRight.png')); // 111 left right

    //Bold cells for 302486
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldTop.png')); // 112 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldRight.png')); // 113 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldBottom.png')); // 114 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldLeft.png')); // 115 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldTopLeft.png')); // 116 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldTopRight.png')); // 117 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldBottomLeft.png')); // 118 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldBottomRight.png')); // 119 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldBottomLeftRight.png')); // 120 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldTopLeftRight.png')); // 121 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldTopLeftBottom.png')); // 122 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldTopRightBottom.png')); // 123 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486BoldLeftRight.png')); // 124 left right

    //Photo editing software used to add thicker borders slightly changed the color of the tiles
    //Created new tiles to adjust
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/87ceeeTest.png')); // 125
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/41b7c5Test.png')); // 126
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/2f7eb7Test.png')); // 127
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/0053b3Test.png')); // 128
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/302486Test.png')); // 129

    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/d5f0d3.png')); // 130 pale green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/64a95e.png')); // 131 a little darker green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/346b2f.png')); // 132 even darker green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/1d4d19.png')); // 133 getting pretty dark green
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/042402.png')); // 134 dark green

    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e7f2ef.png')); // 135 pale blue
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/94c3b6.png')); // 136 a little darker blue
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/4b907d.png')); // 137 cyan maybe?
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/195645.png')); // 138 darkish greenish
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/022b20.png')); // 139 dark green again

    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/daf2f0.png')); // 140 light blue
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/a7dfdb.png')); // 141 less light blue
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/5ab8b1.png')); // 142 teal, I think
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/22877f.png')); // 143 darker teal?
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/02635b.png')); // 144 even darker teal, definitely



    //Made new cells for Tile Nitrate overlay to make it easier to see borders between subwatershedBoundaries

    //Bolded cells for e6bb00
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldTop.png')); // 145 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldRight.png')); // 146 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldBottom.png')); // 147 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldLeft.png')); // 148 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldTopLeft.png')); // 149 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldTopRight.png')); // 150 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldBottomLeft.png')); // 151 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldBottomRight.png')); // 152 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldBottomLeftRight.png')); // 153 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldTopLeftRight.png')); // 154 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldTopLeftBottom.png')); // 155 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldTopRightBottom.png')); // 156 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00BoldLeftRight.png')); // 157 left right

    //Bolded cells for c97088
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldTop.png')); // 158 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldRight.png')); // 159 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldBottom.png')); // 160 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldLeft.png')); // 161 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldTopLeft.png')); // 162 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldTopRight.png')); // 163 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldBottomLeft.png')); // 164 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldBottomRight.png')); // 165 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldBottomLeftRight.png')); // 166 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldTopLeftRight.png')); // 167 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldTopLeftBottom.png')); // 168 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldTopRightBottom.png')); // 169 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08BoldLeftRight.png')); // 170 left right

    //Bolded cells for ad490d
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldTop.png')); // 171 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldRight.png')); // 172 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldBottom.png')); // 173 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldLeft.png')); // 174 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldTopLeft.png')); // 175 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldTopRight.png')); // 176 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldBottomLeft.png')); // 177 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldBottomRight.png')); // 178 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldBottomLeftRight.png')); // 179 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldTopLeftRight.png')); // 180 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldTopLeftBottom.png')); // 181 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldTopRightBottom.png')); // 182 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dBoldLeftRight.png')); // 183 left right

    //Bolded cells for 9a3010
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldTop.png')); // 184 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldRight.png')); // 185 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldBottom.png')); // 186 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldLeft.png')); // 187 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldTopLeft.png')); // 188 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldTopRight.png')); // 189 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldBottomLeft.png')); // 190 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldBottomRight.png')); // 191 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldBottomLeftRight.png')); // 192 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldTopLeftRight.png')); // 193 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldTopLeftBottom.png')); // 194 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldTopRightBottom.png')); // 195 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010BoldLeftRight.png')); // 196 left right

    //Bolded cells for 871c12
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldTop.png')); // 197 top
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldRight.png')); // 198 left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldBottom.png')); // 199 bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldLeft.png')); // 200 right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldTopLeft.png')); // 201 top right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldTopRight.png')); // 202 top left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldBottomLeft.png')); // 203 bottom right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldBottomRight.png')); // 204 bottom left
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldBottomLeftRight.png')); // 205 bottom left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldTopLeftRight.png')); // 206 top left right
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldTopLeftBottom.png')); // 207 top right bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldTopRightBottom.png')); // 208 top left bottom
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12BoldLeftRight.png')); // 209 left right


    //New non-boldeds
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/e6bb00Test.png')); // 210
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/c97b08Test.png')); // 211
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/ad490dTest.png')); // 212
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/9a3010Test.png')); // 213
    highlightArray.push(textureLoader.load('./imgs/cell_images_bitmaps/871c12Test.png')); // 214


    //raindrop texture
    rainTexture = textureLoader.load("./imgs/raindrop.png");

    //Select textures from the highlightArray for the multiplayer utility
    var textureP1 = highlightArray[18];
    var textureP2 = highlightArray[0];
    var textureP3 = highlightArray[13];
    var textureP4 = highlightArray[19];
    var textureP5 = highlightArray[1];
    var textureP6 = highlightArray[26];

    //Add selected textures to the multiplayTextureArray
    multiplayerTextureArray = [textureClear, textureP1, textureP2, textureP3, textureP4, textureP5, textureP6];


    return 1;
}//end loadResources()
