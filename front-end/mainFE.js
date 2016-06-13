//global vars
var camera, scene, renderer, raycaster, mouse, hoveredOver ;
var controls ;
var tiles = [];
var riverPoints = [];
var painter = 1;
var onYear = "year1";
var boardData = [] ;
var currentBoard = -1 ;
var currentYear = 1 ;
var modalUp = false ;
var isShiftDown = false;


function setup() {
    
    //renderer
    renderer = new THREE.WebGLRenderer();
    scene = new THREE.Scene();
    
    //camera
     var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
     var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 10000;
     camera = new THREE.PerspectiveCamera(75, ASPECT, NEAR, FAR);
     scene.add(camera);
    
    //lighting
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1 );
    hemiLight.position.set( 0, 30, 100);
    scene.add( hemiLight );

	 //set up camera
    camera.position.y = 320;
    camera.position.z = 18;
    camera.rotation.x = -45 * Math.PI / 180;

    //set up renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //set up controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    
    //add resize listener
    window.addEventListener('resize', onResize, false);

}

function setupSpace() {

    //skybox

    for (var i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;
    var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
    skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
    var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
    scene.add( skybox );
    
    //add world elements here
    
    //addBoard
    var board1 = new GameBoard() ;
    loadBoard(board1, "./data.txt");

    boardData.push(board1);
    currentBoard++ ; //currentBoard now = 0
    displayBoard() ;
    boardData[currentBoard].updateBoard() ;
    


	var closedSpline = new THREE.CatmullRomCurve3( riverPoints );
	closedSpline.type = 'chordal';
	closedSpline.closed = false;
	var extrudeSettings = {
		steps			: 500,
		bevelEnabled	: false,
		extrudePath		: closedSpline
	};
    var pts = [];
	pts.push( new THREE.Vector2 (1,7.5 ));
	pts.push (new THREE.Vector2 (0,7.5));
	pts.push (new THREE.Vector2 (1,0));
	pts.push (new THREE.Vector2 (0,0));

    var shape = new THREE.Shape( pts );
	var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
				
	var texture = new THREE.TextureLoader().load( "./imgs/waternormals.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
	var material = new THREE.MeshLambertMaterial( {blending: THREE.NormalBlending, wireframe: false, color: 0x40a4df, opacity: 0.75, transparent: true } );
	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );


}//end setupSpace

function setupHighlight() {
	
	//set up mouse functions
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2(), hoveredOver;
	
	//add mouse listener
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'dblclick', onDocumentDoubleClick, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );
    
}; //end setupHighlight


function initWorkspace() {

    setup();
    loadResources() ;
    setupSpace();
    setupHighlight();
    
    
}

//update area, what to update when something changes
requestAnimationFrame(function animate() {

    renderer.render(scene, camera);

    requestAnimationFrame(animate);


}); //end request

