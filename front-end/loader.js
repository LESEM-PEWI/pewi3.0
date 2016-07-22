var textureArray ;
var multiplayerTextureArray ;
var materialArray = [];
var highlightArray = [];
var oldPewiBackgrounds = [];
var butterflyMaterials = [];

function loadResources() {

    //load resources here
    var textureLoader = new THREE.TextureLoader();

    var textureClear = textureLoader.load('./cell_images_bitmaps/LandUse_None.png');
    var textureConventionalCorn = textureLoader.load('./cell_images_bitmaps/LandUse_Conventional_Corn.png');
    var textureConservationCorn = textureLoader.load('./cell_images_bitmaps/LandUse_Conservation_Corn.png');
    var textureConventionalSoybean = textureLoader.load('./cell_images_bitmaps/LandUse_Conventional_Soybean.png');
    var textureConservationSoybean = textureLoader.load('./cell_images_bitmaps/LandUse_Conservation_Soybean.png');
    var textureAlfalfa = textureLoader.load('./cell_images_bitmaps/LandUse_Alfalfa.png');
    var texturePermanentPasture = textureLoader.load('./cell_images_bitmaps/LandUse_Permanent_Pasture.png');
    var textureRotationalGrazing = textureLoader.load('./cell_images_bitmaps/LandUse_Rotational_Grazing.png');
    var textureGrassHay = textureLoader.load('./cell_images_bitmaps/LandUse_Hay.png');
    var texturePrairie = textureLoader.load('./cell_images_bitmaps/LandUse_Prairie.png');
    var textureConservationForest = textureLoader.load('./cell_images_bitmaps/LandUse_Conservation_Forest.png');
    var textureConventionalForest = textureLoader.load('./cell_images_bitmaps/LandUse_Conventional_Forest.png');
    var textureShortWoody = textureLoader.load('./cell_images_bitmaps/LandUse_Woody_Bioenergy.png');
    var textureHerbs = textureLoader.load('./cell_images_bitmaps/LandUse_Herbaceous_Perennial_Bioene.png');
    var textureWetland = textureLoader.load('./cell_images_bitmaps/LandUse_Wetland.png');
    var textureMixedFruitsVegetables = textureLoader.load('./cell_images_bitmaps/LandUse_Mixed_Fruits_and_Vegetables.png');
    
    textureArray = [textureClear, textureConventionalCorn, textureConservationCorn, textureConventionalSoybean, textureConservationSoybean,
                    textureAlfalfa, texturePermanentPasture, textureRotationalGrazing, textureGrassHay,
                    texturePrairie, textureConservationForest, textureConventionalForest, textureHerbs, textureShortWoody,
                    textureWetland, textureMixedFruitsVegetables];
                    
  materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load('./background_images/right.jpg'), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load('./background_images/left.jpg'), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load('./background_images/top.jpg'), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load('./background_images/bottom.jpg'), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load('./background_images/front.jpg'), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load('./background_images/back.jpg'), side: THREE.BackSide }));
  
    oldPewiBackgrounds = [textureLoader.load("./background_images/Background_Drought.png"), textureLoader.load("./background_images/Background_Normal.png"), textureLoader.load("./background_images/Background_Flood.png")];
    
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/e6bb00.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/c97b08.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/ad490d.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/9a3010.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/871c12.png'));
    
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/ffffc9.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/c7eab4.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/7fcebb.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/41b7c5.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/2f7eb7.png'));
    
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/45aa98.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/127731.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/989836.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/cc6578.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/a84597.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/dbcb74.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/342286.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/862254.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/87ceee.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/097c2f.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/979936.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/47aa98.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/e3c972.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/cb657a.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/882252.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/aa4497.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/302486.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/76d1c4.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/3f9f91.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/187336.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/919246.png'));
    
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/0053b3.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/255d98.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/38638b.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/4b687e.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/5e6e71.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/837856.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/a9833c.png'));
    highlightArray.push(textureLoader.load('./cell_images_bitmaps/bc892f.png'));
    
    var textureP1 = highlightArray[9];
    var textureP2 = highlightArray[1] ;
    var textureP3 = highlightArray[17] ;
    var textureP4 = highlightArray[19] ;
    var textureP5 = highlightArray[5] ;
    var textureP6 = highlightArray[4] ;
    
     multiplayerTextureArray = [textureClear, textureP1, textureP2, textureP3, textureP4, textureP5, textureP6];
    
  return 1 ;

}