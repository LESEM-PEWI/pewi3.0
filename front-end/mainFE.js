//global vars
var camera, scene, raycaster, mouse, hoveredOver, bgCam;
var bgScene = null;
var renderer = new THREE.WebGLRenderer();
var controls;
var river = null;
var riverPoints = [];
var painter = 1;
var onYear = "year1";
var boardData = [];
var currentBoard = -1;
var currentYear = 1;
var modalUp = false;
var isShiftDown = false;
var Totals; //global current calculated results, NOTE, should be reassigned every time currentBoard is changed
var counter = 0;
var stats = new Stats();
var SCREEN_WIDTH, ASPECT, NEAR, FAR;

//setup instantiates the camera, lights, controls, shadowmap, and renderer. Called once at the beginning of game
function setup() {

    //set up renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //setup stats display
    if(document.getElementById('statsSetting').innerHTML == "1")    document.body.appendChild(stats.domElement);

    //scene
    scene = new THREE.Scene();

    //camera
    SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 10000;
    camera = new THREE.PerspectiveCamera(75, ASPECT, NEAR, FAR);
    scene.add(camera);

    //lighting
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.position.set(0, 30, 100);
    scene.add(hemiLight);

    var spotLight = new THREE.SpotLight(0xffffff, 0.1);
    spotLight.position.set(0, 0, 0);
    spotLight.position = camera.position;
    spotLight.castShadow = true;
    spotLight.angle = -70 * Math.PI / 180;
    spotLight.penumbra = 0.01;
    spotLight.decay = 0;
    spotLight.distance = 800;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 500;

    //set up camera
    //T…E.Vector3 {x: 0.12870653357008163, y: 320.50583842108955, z: 11.644679046519663}
    camera.position.y = 320;
    camera.position.z = 0;
    camera.rotation.x = -1.570795331865673;

    
    //console.log(camera.position);
    //console.log(camera.rotation) ;

    //set up renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //set up controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //add resize listener
    window.addEventListener('resize', onResize, false);

    var r = document.getElementById('backgroundStyle').innerHTML ;
    if(r == '1'){
        setupSkyBox();
    } else {
        setupStaticBackground();        
    }
    
    //setupAssistant();
    setupHighlight();

    return 1 ;
} //end setup

//setupSkyBox instantiates the skybox background (HI-DEF Version)
function setupSkyBox() {

    for (var i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;
    var skyboxMaterial = new THREE.MeshFaceMaterial(materialArray);
    skyboxGeom = new THREE.CubeGeometry(5000, 5000, 5000, 1, 1, 1);
    var skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial);
    scene.add(skybox);

} //end setupSkyBox

//setupStaticBackground uses the old pewi graphics as a background image
function setupStaticBackground() {
    
    var r = Math.floor(Math.random() * oldPewiBackgrounds.length);
    
    var bg = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({map: oldPewiBackgrounds[r]})
    );

    // The bg plane shouldn't care about the z-buffer.
    bg.material.depthTest = false;
    bg.material.depthWrite = false;
    
    bgScene = new THREE.Scene();
    bgCam = new THREE.Camera();
    bgScene.add(bgCam);
    bgScene.add(bg);
    
} //end setupStaticBackground

function setupAssistant() {

var mtlLoader = new THREE.MTLLoader();
var mtlLoader = new THREE.MTLLoader();
mtlLoader.load( './Butterfly/Butterfly.mtl', function( butterflyMaterials ) {

    //butterflyMaterials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( butterflyMaterials );
    objLoader.load( './Butterfly/Butterfly.obj', function ( object ) {

        object.position.y = 95;
        scene.add( object );

    });

});



}

//setupBoardFromFile creates a new gameboard from a stored file and creates a river for the board
function setupBoardFromFile(file) {

    //remove points of previous board's river if present
    if (riverPoints.length > 0) {
        riverPoints = [];
    }

    //addBoard
    var boardFromFile = new GameBoard();
    loadBoard(boardFromFile, file);

    boardData.push(boardFromFile);
    currentBoard++;
    boardData[currentBoard].updateBoard();

    refreshBoard();
    setupRiver();

    //update Results to point to correct board since currentBoard is updated
    Totals = new Results(boardData[currentBoard]);

    return 1 ;
} //end setupBoardFromFile

//setupRiver creates a new CatmullRomCurve3 object for the river from the points stored in the riverPoints array
function setupRiver() {

    if (river != null) {
        scene.remove(river);
    }

    var closedSpline = new THREE.CatmullRomCurve3(riverPoints);
    closedSpline.type = 'chordal';
    closedSpline.closed = false;
    var extrudeSettings = {
        steps: 500,
        bevelEnabled: false,
        extrudePath: closedSpline
    };
    var pts = [];
    pts.push(new THREE.Vector2(-5, 7.5));
    pts.push(new THREE.Vector2(-4, 7.5));
    pts.push(new THREE.Vector2(-5, 0));
    pts.push(new THREE.Vector2(-4, 0));

    var shape = new THREE.Shape(pts);
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    var material = new THREE.MeshBasicMaterial({
        wireframe: false,
        color: 0x40a4df,
        opacity: 0.75,
        transparent: true
    });
    river = new THREE.Mesh(geometry, material);
    scene.add(river);

}

function setupBoardFromUpload(data) {

    //remove points of previous board's river if present
    if (riverPoints.length > 0) {
        riverPoints = [];
    }

    //addBoard
    var boardFromUpload = new GameBoard();
    parseInitial(data);
    propogateBoard(boardFromUpload);

    //push into current board
    boardData[currentBoard] = boardFromUpload;
    boardData[currentBoard].updateBoard();

    refreshBoard();
    setupRiver();

    //update Results to point to correct board since currentBoard is updated
    Totals = new Results(boardData[currentBoard]);
    

    

}

function setupHighlight() {

    //set up mouse functions and raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(), hoveredOver;

    //add mouse listener
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('dblclick', onDocumentDoubleClick, false);
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);

}; //end setupHighlight


function initWorkspace() {

    document.getElementById('startupSequence').style.display = "none" ;
    document.getElementById('loading').style.visibility = "visible" ;
   
   THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
    
       console.log("loaded " + loaded + " of " + total);
    
    };
   
   THREE.DefaultLoadingManager.onLoad = function (){
       console.log("loaded") ;
     
       toggleVisibility() ;
       
       document.getElementById('loading').style.display = "none" ;
       document.getElementById('page').style.visibility = "visible" ;
       
      //work around for firefox..... see bug 554039
      document.getElementById('firefoxWorkaround').focus() ;
      //
     
      }
    
    
    var hold = loadResources() ;
    hold = setup() ;
    hold = setupBoardFromFile("./data.txt") ;
    

    
    //loadResources();
   //setup();
    //setupBoardFromFile("./data.txt");
    
requestAnimationFrame(function animate() {

   renderer.autoClear = false;
   renderer.clear();
   if(bgScene != null){
    renderer.render(bgScene, bgCam);
   }
   renderer.render(scene, camera);

    //wait # update frames to check
    if (counter > 20) {
        gameDirector();
        counter = 0;
    }
    counter += 1;

    requestAnimationFrame(animate);
    stats.update();

    
    
  }); //end request


}


