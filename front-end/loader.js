var textureArray ;
var materialArray = [];

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
    var textureMixedFruitsVegetables = textureLoader.load('./cell_images_bitmaps/LandUse_Mixed_Fruits_and_Vegetables.png');
    
    textureArray = [textureClear, textureConventionalCorn, textureConservationCorn, textureConventionalSoybean, textureConservationSoybean,
                    textureAlfalfa, texturePermanentPasture, textureRotationalGrazing, textureGrassHay,
                    texturePrairie, textureConservationForest, textureConventionalForest, textureShortWoody,
                    textureHerbs, textureMixedFruitsVegetables];
                    
    // materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load('./background_images/dawnmountain-xpos.png') }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load( './background_images/dawnmountain-xneg.png' ) }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load( './background_images/dawnmountain-ypos.png' ) }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load( './background_images/dawnmountain-yneg.png' ) }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load( './background_images/dawnmountain-zpos.png' ) }));
    // materialArray.push(new THREE.MeshBasicMaterial( { map: textureLoader.load( './background_images/dawnmountain-zneg.png' ) }));

  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './background_images/dawnmountain-xpos.png' ), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './background_images/dawnmountain-xneg.png' ), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './background_images/dawnmountain-ypos.png' ), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './background_images/dawnmountain-yneg.png' ), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './background_images/dawnmountain-zpos.png' ), side: THREE.BackSide }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './background_images/dawnmountain-zneg.png' ), side: THREE.BackSide }));

}