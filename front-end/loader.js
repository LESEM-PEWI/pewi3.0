var textureArray ;
var multiplayerTextureArray = [];
var materialArray = [];
var highlightArray = [];
var oldPewiBackgrounds = [];
var rainTexture;

//this function loads into the texture arrays the necessary images for creation of webGl
//  materials. All are loaded via the three.js textureLoader
//  lastly, the multiplayer array is created for multiplayer use if needed
function loadResources() {

    //Add a textureLoader to load textures for THREE.js
    var textureLoader = new THREE.TextureLoader();

    //Load the land type textures. Each land type has a number from 1 to 15.
    var textureClear = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_None.png');
    var textureConventionalCorn = textureLoader.load('./imgs/cell_images_bitmaps/LandUse_Conventional_Corn.png'); //1
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

    //yield textures
    //var textureCornGrain = textureLoader.load('./imgs/cell_images_bitmaps/cornGrainIcon.png'); //16

    //Add the land type textures to textureArray
    textureArray = [textureClear, textureConventionalCorn, textureConservationCorn, textureConventionalSoybean, textureConservationSoybean,
        textureAlfalfa, texturePermanentPasture, textureRotationalGrazing, textureGrassHay,
        texturePrairie, textureConservationForest, textureConventionalForest, textureHerbs, textureShortWoody,
        textureWetland, textureMixedFruitsVegetables,// textureCornGrain
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

