
//================
//global vars

//webGL stuff
var bgScene = null;
var camera, scene, raycaster, mouse, hoveredOver, bgCam, camera2, camera1, ToggleCam, cam2x, cam2y, cam2z;
var cam2Roy, cam2Rox, cam2Roz;
var controls, controls1;
var keyboard ={};
var player = { speed:3, turnSpeed:Math.PI*0.02 };
var renderer = new THREE.WebGLRenderer();
// renderer.sortObjects = false;
var stats = new Stats();
var SCREEN_WIDTH, ASPECT, NEAR, FAR;

//application data
var boardData = [];
var clickTrackings = []; //array for storing all clicks in when click-tracking is enabled
var river = null;
var riverPoints = [];
var simUpload;
var Totals; //global current calculated results, NOTE, should be reassigned every time currentBoard is changed

//status trackers
var allLoaded = false;
var counter = 0;

var currentBoard = -1;


var currentYear = 1;
var currentPlayer = 0;

var isShiftDown = false;
var mapIsHighlighted = false;
var modalUp = false;
var onYear = "year1";
var painter = 1;
var previousHover = null;
var tToggle = false; //topology off by default
var uploadedBoard = false;



var generatedContourMap;


//Variables for Zoom Function
var fov = null,
zoomFactor = 1.0,
zoomInInc = 0.1,
zoomOutInc = 0.2;
var zoomedIn = false;
var zoomingInNow = false;
var zoomingOutNow = false;

var rain = null;

// global variable for print function
var jspdfprinter; // object that functions all print function stuff
var printMode = false;
var takeScreenshot = false; // used in animationFrames

//===================

//Camera movements Controls for Camera2 ie second view
function animate() {
  var hotkeys = giveHotkeys();
  requestAnimationFrame(animate);

  //Keyboard movement inputs
  if (keyboard[hotkeys[8][0]] || keyboard[hotkeys[8][1]]) { // Handle W key - Forward Movements
    if (curTracking) {
      pushClick(0, getStamp(), 86, 0, null);
    }
    //Movements Restrictions and setting bounds
    //The four if statements check if the four side of the pewi shed bounds for the camera pass a specific point set
    //and if it does it resets it to that specific position set.
    //If it doesnt the camera moves normally.
    if (camera2.position.x - Math.sin(camera2.rotation.y) * player.speed >= 265)
    camera2.position.x = 264;
    if (camera2.position.x - Math.sin(camera2.rotation.y) * player.speed <= -265)
    camera2.position.x = -264;
    if (camera2.position.z - Math.cos(camera2.rotation.y) * player.speed >= 300)
    camera2.position.z = 299;
    if (camera2.position.z - Math.cos(camera2.rotation.y) * player.speed <= -300)
    camera2.position.z = -299;
    else
    camera2.position.z -= Math.cos(camera2.rotation.y) * player.speed;
    camera2.position.x -= Math.sin(camera2.rotation.y) * player.speed;
    console.log(camera2.position);
  }

  if (keyboard[hotkeys[9][0]] || keyboard[hotkeys[9][1]]) { // Handle S key - Back Words movements
    if (curTracking) {
      pushClick(0, getStamp(), 87, 0, null);
    }
    //Movements Restrictions and setting bounds
    //The four if statements check if the four side of the pewi shed bounds for the camera pass a specific point set
    //and if it does it resets it to that specific position set.
    //If it doesnt the camera moves normally.
    if (camera2.position.x + Math.sin(camera2.rotation.y) * player.speed >= 265)
    camera2.position.x = 264;
    if (camera2.position.x + Math.sin(camera2.rotation.y) * player.speed <= -265)
    camera2.position.x = -264;
    if (camera2.position.z + Math.cos(camera2.rotation.y) * player.speed >= 300)
    camera2.position.z = 299;
    if (camera2.position.z + Math.cos(camera2.rotation.y) * player.speed <= -300)
    camera2.position.z = -299;
    else
    camera2.position.z += Math.cos(camera2.rotation.y) * player.speed;
    camera2.position.x += Math.sin(camera2.rotation.y) * player.speed;
    console.log(camera2.position);
  }

  if (keyboard[hotkeys[7][0]] || keyboard[hotkeys[7][1]]) { // Handle A key - Left Side Movement
    if (curTracking) {
      pushClick(0, getStamp(), 89, 0, null);
    }
    //Movements Restrictions and setting bounds
    //The four if statements check if the four side of the pewi shed bounds for the camera pass a specific point set
    //and if it does it resets it to that specific position set.
    //If it doesnt the camera moves normally.
    if (camera2.position.x - Math.sin(camera2.rotation.y + Math.PI / 2) * player.speed >= 265)
    camera2.position.x = 264;
    if (camera2.position.x - Math.sin(camera2.rotation.y + Math.PI / 2) * player.speed <= -265)
    camera2.position.x = -264;
    if (camera2.position.z - Math.cos(camera2.rotation.y + Math.PI / 2) * player.speed >= 300)
    camera2.position.z = 299;
    if (camera2.position.z - Math.cos(camera2.rotation.y + Math.PI / 2) * player.speed <= -300)
    camera2.position.z = -299;
    else
    camera2.position.z -= Math.cos(camera2.rotation.y + Math.PI / 2) * player.speed;
    camera2.position.x -= Math.sin(camera2.rotation.y + Math.PI / 2) * player.speed;
    console.log(camera2.position);
  }

  if (keyboard[hotkeys[6][0]] || keyboard[hotkeys[6][1]]) { // Handle D key - Right side Movements
    if (curTracking) {
      pushClick(0, getStamp(), 88, 0, null);
    }
    //Movements Restrictions and setting bounds
    //The four if statements check if the four side of the pewi shed bounds for the camera pass a specific point set
    //and if it does it resets it to that specific position set.
    //If it doesnt the camera moves normally.
    if (camera2.position.x - Math.sin(camera2.rotation.y - Math.PI / 2) * player.speed >= 265)
    camera2.position.x = 264;
    if (camera2.position.x - Math.sin(camera2.rotation.y - Math.PI / 2) * player.speed <= -265)
    camera2.position.x = -264;
    if (camera2.position.z - Math.cos(camera2.rotation.y - Math.PI / 2) * player.speed >= 300)
    camera2.position.z = 299;
    if (camera2.position.z - Math.cos(camera2.rotation.y - Math.PI / 2) * player.speed <= -300)
    camera2.position.z = -299;
    else
    camera2.position.z -= Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    camera2.position.x -= Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    console.log(camera2.position);
  }

  // Keyboard turn inputs
  if (keyboard[39]) { // left arrow key Rotate right
    if (curTracking) {
      pushClick(0, getStamp(), 97, 0, null);
    }
    //This rotates the camera left
    camera2.rotation.y -= player.turnSpeed;
  }
  if (keyboard[37]) { // right arrow key Rotate left
    if (curTracking) {
      pushClick(0, getStamp(), 98, 0, null);
    }
    //This rotates the camera right
    camera2.rotation.y += player.turnSpeed;
  }

  //Specific Zooming
  if (keyboard[38]) { // Up arrow key
    if (curTracking) {
      pushClick(0, getStamp(), 95, 0, null);
    }
    //Checking if toggle is on and checking if it passes a specific bounds and if it does
    // It sets it to specific height and restrict it to that heights else if moves normally
    if (tToggle) {
      if (camera2.position.y <= 27)
      camera2.position.y = 27;
      else {
        camera2.position.y -= 1;
        camera2.position.z -= Math.cos(camera2.rotation.y) * player.speed;
        camera2.position.x -= Math.sin(camera2.rotation.y) * player.speed;
        // console.log(camera2.position.y + " " + camera.position.z);
      }
    } else {
      if (camera2.position.y <= 9)
      camera2.position.y = 9;
      else {
        camera2.position.y -= 1;
        camera2.position.z -= Math.cos(camera2.rotation.y) * player.speed;
        camera2.position.x -= Math.sin(camera2.rotation.y) * player.speed;
        // console.log(camera2.position.y + " " + camera.position.z);
      }
    }
  }

  if (keyboard[40]) { // Down arrow key
    if (curTracking) {
      pushClick(0, getStamp(), 96, 0, null);
    }
    //setting bounds for zooming out and checking the camera y and z position.
    //If it passes the position, it restricts the camera movement
    if (camera2.position.z - Math.cos(camera2.rotation.y) * player.speed >= 300)
    camera2.position.z = 299;
    if (camera2.position.y >= 60) {
      camera2.position.y = 60;
      // console.log(camera2.position.y + " " + camera.position.z);
    } else {
      camera2.position.y += 1;
      camera2.position.z += Math.cos(camera2.rotation.y) * player.speed;
      camera2.position.x += Math.sin(camera2.rotation.y) * player.speed;
      // console.log(camera2.position.y + " " + camera.position.z);
    }
  }
  renderer.render(scene, camera);
}

//animationFrames is the key function involved in webGl
// here we set up a loop that calls itsef throughout the duration of the activity
function animationFrames() {

  //render animations
  requestAnimationFrame(function animate() {
    birdAnimation();
    zoomAnimation();

    //rain animations (change y position of each raindrop)
    if (rain != null) {
      for (var i = 0; i < rain.geometry.vertices.length; i++) {
        //update position
        rain.geometry.vertices[i].y = rain.geometry.vertices[i].y - (rain.geometry.vertices[i].speed);
        //if the raindrop reaches the ground, regenerate above the board
        if (rain.geometry.vertices[i].y <= 0) rain.geometry.vertices[i].y = Math.random() * 500;
      }
      //necessary to make the raindrops move
      rain.geometry.verticesNeedUpdate = true;
    }

    renderer.autoClear = false;
    if (bgScene != null) {
      renderer.render(bgScene, bgCam);
    }
    //wait # update frames to check
    if (counter > 20) {
      gameDirector();
      counter = 0;
    }
    counter += 1;

    requestAnimationFrame(animate);
    // render the according webgl
    renderer.render(scene, camera);

    // takeScreenshot is global variable. Is set to true when pressing print key 'p' ( helpersFE.js )
    if (takeScreenshot) {
      // reset takeScreenshot to false
      takeScreenshot = false;
      // preprocess needed src
      jspdfprinter.preprocessing();

    } // end if
    stats.update();

  }); //end request

} //end animationFrames

//birdAnimation updates bird and boid positions
function birdAnimation() {

  if (birds != null) {

    for (var i = 0, il = birds.length; i < il; i++) {

      boid = boids[i];
      boid.run(boids);

      bird = birds[i];
      bird.position.copy(boids[i].position);

      color = bird.material.color;
      color.r = color.g = color.b = (500 - bird.position.z) / 1000;

      bird.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
      bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());

      bird.phase = (bird.phase + (Math.max(0, bird.rotation.z) + 0.1)) % 62.83;
      bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;

    }

  }

} //end birdAnimation

//Event function that is called when screen is changed
// Adding navigation keys, asdw
function CamView(e) {
  tempKeys = giveHotkeys();
  var Uma = String.fromCharCode(tempKeys[11][0]);
  document.getElementById("flyover").innerHTML = "FlyOver Mode, Hit " + Uma +  " to Exit";

  if (e.keyCode == tempKeys[11][0] || e.keyCode == tempKeys[11][1]) {
    if(curTracking) {
      pushClick(0,getStamp(),85,0,null);
    }
    toggleCameraView();
  }
}

//Changes camera from birds-eye view to first person view
function ChangeCam() {
  //Switching to second camera view
  camera = camera2;
  //Changing flag variable
  ToggleCam = 1;
  //Reseting camera twos position
  //    if(cam2x)
  //    RestorePosition();
} // end ChangeCam()

//Changs camera from first person  view to birds-eye view
function changeCam2() {
  //saving camera2 old position
  //    cam2x = camera2.position.x;
  //    cam2y = camera2.position.y;
  //    cam2z = camera2.position.z;
  //    cam2Roy = camera2.rotation.y;
  //    cam2Rox = camera2.rotation.x;
  //    cam2Roz = camera2.rotation.z;
  //Changes Camera to second camera view
  camera = camera1;
  //Flag variable for changing camera views
  ToggleCam = 2;
  //Reseting camera to original position after switching
  controls1.value = 10;
  controls1.reset();
  setTimeout(function() {
    controls1.value = 1;
  }, 100);
} // end changeCam2()

//expand or collapse the div holding tools for confirming escape to main menu
function confirmEscape() {
  //if the div is not expanded, then expand
  //else if expanded, then collapse it
  if (document.getElementById('confirmEscape').style.height != "20vw") {
    document.getElementById('exitToMenuButton').style.backgroundColor = "#003d4d";
    document.getElementById('optionsButton').style.opacity = 0;
    document.getElementById('escapeButton').style.opacity = 0;
    /* Commented out Glossary button, which is line below. Reference Issue 363 on explanation for removal.
    document.getElementById('directoryButton').style.opacity = 0;
    */
    document.getElementById('optionsButton').onclick = function() {};
    /* Commented out Glossary button, which is line below. Reference Issue 363 on explanation for removal.
    document.getElementById('directoryButton').onclick = function() {};
    */
    document.getElementById('confirmEscape').style.height = "20vw";
    // document.getElementById('confirmEscape').style.width = "13.2vw";
  } else {
    document.getElementById('exitToMenuButton').style.backgroundColor = "#40a4df";
    document.getElementById('optionsButton').onclick = function() {
      //if (!multiplayerAssigningModeOn) {
      toggleEscapeFrame();
      startOptions();
      //}
    };
    /* Commented out Glossary button, which is the following lines below. Reference Issue 363 on explanation for removal.
    document.getElementById('directoryButton').onclick = function() {
      toggleEscapeFrame();
      toggleGlossary();
    };
    */
    document.getElementById('escapeButton').onclick = function() {
      //if (!multiplayerAssigningModeOn) {
      toggleEscapeFrame();
      //}
    };
    document.getElementById('optionsButton').style.opacity = 1;
    document.getElementById('escapeButton').style.opacity = 1;
    /* Commented out Glossary button, which is line below. Reference Issue 363 on explanation for removal.
    document.getElementById('directoryButton').style.opacity = 1;
    */
    document.getElementById('confirmEscape').style.height = "0px";
    // document.getElementById('confirmEscape').style.width = "0px";
  }
} //end toggleEscape

// buttons to be shown when user clicks on the 'delete' button
function confirmYearDelete() {

    document.getElementById('confirmYearDelete').style.display = "block";
    document.getElementById('yesDelete').style.display = "block";
    document.getElementById('noDelete').style.display = "block";

    if(curTracking)
    {
      pushClick(0, getStamp(), 112, 0 , null);
    }
  }


/** createThreeFramework instantiates the renderer and scene to render 3D environment
 *   renderer = new THREE.WebGLRenderer(); above
 *
 */
function createThreeFramework() {
  //set up renderer
  renderer.setSize(window.innerWidth, window.innerHeight);

  //add renderer (canvas element) to html page
  document.body.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //create the main THREE.js scene
  scene = new THREE.Scene();

 //Creating mesh box around Map.
 var meshfloor = new THREE.Mesh(
 new THREE.BoxGeometry(500,100,500),
 new THREE.MeshBasicMaterial({color:0x0ffffff, wireframe:false}));

    meshfloor.rotation.y += Math.PI/2;
    //scene.add(meshfloor);
} //end createThreeFramework()

//initializeCamera adds the camera object with specifications to the scene
function initializeCamera() {

  //Setting Up camera (Main camera)
  SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 10000;
  camera = new THREE.PerspectiveCamera(75, ASPECT, NEAR, FAR);
  scene.add(camera);

  //point camera in the correct direction
  // we'd hate to have the user looking at nothing
    camera.position.x = 0;
    camera.position.y = 320;
    camera.position.z = 0;
    camera.rotation.x = -1.570795331865673;

    //Setting up First Camera
    SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 10000;
    camera1 = new THREE.PerspectiveCamera(75, ASPECT, NEAR, FAR);
    scene.add(camera1);
     //Camera1 view
    camera1.position.x = 0;
    camera1.position.y = 320;
    camera1.position.z = 0;
    camera1.rotation.x = -1.570795331865673;

    //Setting up Second Camera
    SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 10000;
    camera2 = new THREE.PerspectiveCamera(75, ASPECT, NEAR, FAR);
    scene.add(camera2);
    //Second camera view
    camera2.position.x = 70;
    camera2.position.y = 25;
    camera2.position.z = 244;
    camera2.rotation.y = 0;

    //set camera field of view for zoom functions
    fov = camera.fov;

    //set up controls for camera one and camera1
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls1 = new THREE.OrbitControls(camera1, renderer.domElement);

    //Zoom in and zoom out restrictions for camera one
    controls.minDistance = 120;
    controls.maxDistance = 500;
    controls1.minDistance = 120;
    controls1.maxDistance = 500;

    //add resize listener, so we can keep the aspect ratio correct.
    window.addEventListener('resize', onResize, false);
    // addEvent(document, 'resize', onResize);

    //Event Listners for camera movements
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    // addEvent(document, 'keydown', keyDown);
    // addEvent(document, 'keyup', keyUp);

    //Event listners for changing camera views
    document.addEventListener('keyup', CamView);
    // addEvent(document, 'keyup', CamView);
    animate();

    //Event listners for scrolling using the wheel or scroll bar ( Used exclusively by click tracking...for now)
    window.frames[0].onscroll = onWheelViewCredits;
    window.frames[4].addEventListener('scroll', onWheelViewResults);
    window.frames[6].addEventListener('scroll', onWheelViewCustomize);
    window.frames[7].addEventListener('scroll', onWheelViewPrint);
    window.frames[3].addEventListener('scroll', onWheelViewGlossary);
} //end initializeCamera

//initializeLighting adds the lighting with specifications to the scene
function initializeLighting() {

  //lighting
  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  hemiLight.position.set(0, 30, 100);
  scene.add(hemiLight);

  //Deprecated if no shadows will be created
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
} //end initializeCamera

//initWorkspace initializes a sandbox game in the threeFramework
function initWorkspace(file) {
  //hide the startup page and show the loading animation
  document.getElementById('startupSequence').style.display = "none";
  // document.getElementById('loading').style.visibility = "visible";
  document.getElementById('loading').style.display = "block";

  //reset key functions on page
  document.activeElement.blur();

  //setup stats display
  stats.domElement.id = 'statFrame';
  document.body.appendChild(stats.domElement);

  //Setup scene, toggle options, and add the background
  var hold = setupBoardFromFile(file);
  toggleVisibility();
  renderBackground();

  //wait until all elements of the THREE.js scene are displayed
  function checkIfSceneLoaded() {
    if (!bgScene.children || !allLoaded) {
      setTimeout(checkIfSceneLoaded(), 500); //wait 500 milliseconds then recheck
      return;
    }
    //hide loading animation and make the PEWI main page visible
    document.getElementById('loading').style.display = "none";
    document.getElementById('page').style.visibility = "visible";
    // document.getElementById('page').style.display = "block";
  }
  checkIfSceneLoaded();
} //end initWorkspace

function keyDown(event) {
  keyboard[event.keyCode] = true;
  // if(event.keyCode === 80 && document.getElementById('printButton').style.display == 'none'){
  //   // keyboard[event.keyCode] = false;
  //   closePrintOptions();
  // }
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

//loadingManager records when all textures and resources are loaded
function loadingManager() {

  //DefaultLoadingManager.onProgress is a THREE.js function that tracks when items are loaded
  THREE.DefaultLoadingManager.onProgress = function(item, loaded, total) {
    // console.log(" loaded " + loaded + " of " + total);
  };

  //DefaultLoadingManager.onload updates boolean allLoaded when all resources are loaded
  THREE.DefaultLoadingManager.onLoad = function() {

    //update allLoaded status
    console.log("Everything is loaded and good to go!");
    allLoaded = true;

    //show main PEWI page elements
    // document.getElementById('page').style.visibility = "visible";
    document.getElementById('firefoxWorkaround').focus();
  };
} //end loadingManager

//makeItRain -- add some precipitation to PEWI
function makeItRain(numberOfRaindrops) {

  //create geometry and material for raindrops
  var rainGeometry = new THREE.Geometry();
  var rainMaterial = new THREE.PointsMaterial({
    blending: THREE.AdditiveBlending,
    color: 0x40a4df,
    map: rainTexture,
    opacity: 0.5,
    size: 2,
    sizeAttenuation: true,
    transparent: true
  });

  //for each raindrop to create randomly assign a position within the map boundaries
  for (var i = 0; i < numberOfRaindrops; i++) {

    //determine maximum dimensions of the current board
    var maxWidth = boardData[currentBoard].width;
    var maxHeight = boardData[currentBoard].height;

    //x range of board
    var xRange = Math.abs(1 * tileWidth - (tileWidth * maxWidth) / 2) + Math.abs(maxWidth * tileWidth - (tileWidth * maxWidth) / 2);
    //z range of board
    var zRange = Math.abs(1 * tileHeight - (tileHeight * maxHeight) / 2) + Math.abs(maxHeight * tileHeight - (tileHeight * maxHeight) / 2);

    //add a raindrop as a vertex in the rain object
    var raindrop = new THREE.Vector3(
      Math.random() * xRange - xRange / 2,
      Math.random() * 500,
      Math.random() * zRange - zRange / 2
    );
    raindrop.speed = Math.random() + 2;
    rainGeometry.vertices.push(raindrop);
  }

  //create the rain object and add to the scene
  rain = new THREE.Points(rainGeometry, rainMaterial);
  rain.sortParticles = true;
  scene.add(rain);

} //end makeItRain

//Event function that is called when a user is scrolling in the credits page
function onWheelViewCredits(e) {
  if(curTracking && scrollGap) {
    pushClick(0,getStamp(),92,0,window.frames[0].pageYOffset);
  }
}

//Event function that is called when a user is scrolling in the Glossary [Unused for now...need to find a way to record scroll bar position in nested iframe within index]
//function onWheelViewIndex(e) {
//if(curTracking && scrollGap) {
//pushClick(0,getStamp(),93,0,window.frames[2].frames[0].pageYOffset);
//}
//}

//Event function that is called when a user is scrolling in results
function onWheelViewResults(e) {
  if(curTracking && scrollGap) {
    pushClick(0,getStamp(),94,0,window.frames[4].scrollY);
  }
}

//Event function that is called when a user is scrolling in customize window
function onWheelViewCustomize(e) {
  if(curTracking && scrollGap) {
    pushClick(0,getStamp(),110,0,window.frames[6].scrollY);
  }
}

//Event function that is called when a user is scrolling in customize window
function onWheelViewPrint(e) {
  if(curTracking && scrollGap) {
    pushClick(0,getStamp(),114,0,window.frames[7].scrollY);
  }
}

//Event function that is called when a user is scrolling in glossary window
function onWheelViewGlossary(e) {
  if(curTracking && scrollGap) {
    pushClick(0,getStamp(),93,0,window.frames[3].scrollY);
  }
}


//renderBackground creates the static background always behind viewpoint
//  this function used to select for the creation of a skybox
//   but that functionality is deprecated as project requirements changed
function renderBackground() {
  setupStaticBackground();
} //end renderBackground

// Function to restore camera2 last position after changing views.
function RestorePosition(){
  //Storing the camera2 values to global variables
  camera2.position.x = cam2x;
  camera2.position.y = cam2y;
  camera2.position.z = cam2z;
  camera2.rotation.x = cam2Rox;
  camera2.rotation.y = cam2Roy;
  camera2.rotation.z = cam2Roz;
}

//Handles the time difference in scrolling events while click-tracking
function scrollGap() {
  //Change this value if needed
  var goodGap = 500; //Half a second
  var timeGap = (clickTrackings[clickTrackings.length-1].timeStamp) - (clickTrackings[clickTrackings.length-2].timeStamp);
  if(goodGap>timeGap) {
    return true;
  } else {
    return false;
  }
}

//setupBoardFromFile creates a new gameboard from a stored file and creates a river for the board
function setupBoardFromFile(file) {

  //addBoard
  var boardFromFile = new GameBoard();
  // console.log('boardFromFile.map', boardFromFile.map);
  loadBoard(boardFromFile, file);

  switchBoards(boardFromFile);

  return 1;

} //end setupBoardFromFile

//setupBoardFromUpload
function setupBoardFromUpload(data) {

  //addBoard
  //Length of the csv object when empty is 3
  var isEmpty = Object.getOwnPropertyNames(data).length == 3;
  if (!isEmpty) {
    uploadedBoard = true;
    simUpload = data;
    var boardFromUpload = new GameBoard();
    if (parseInitial(data)) {
      propogateBoard(boardFromUpload);
      switchBoards(boardFromUpload);
      previousHover = null;
    }
  }
  //If file is empty, load the default level
  else if (!multiplayerAssigningModeOn) {
    parent.loadLevel(levelGlobal);
  }
  //If file is empty and multiplayer is active, load the level multiplayer level creator
  else {
    parent.loadLevel(-1);
  }
} //end setupBoardFromUpload

//setupHighlight adds listeners to the mouse in the THREE.js scene
function setupHighlight() {

  //set up mouse functions and raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2(), hoveredOver;

  //add mouse listener
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  document.addEventListener('keydown', onDocumentKeyDown, false);
  document.addEventListener('keyup', onDocumentKeyUp, false);
  // addEvent(document, 'mousemove', onDocumentMouseMove);
  // addEvent(document, 'mousedown', onDocumentMouseDown);
  // addEvent(document, 'mouseup', onDocumentMouseUp);
  // addEvent(document, 'keydown', onDocumentKeyDown);
  // addEvent(document, 'keyup', onDocumentKeyUp);

} //end setupHighlight

//Create a river object with tributaries
function setupRiver() {

  //remove any previously rendered river
  if (river != null) {
    scene.remove(river);
  }

  //stores the main river and all tributaries
  river = new THREE.Object3D();

  //riverPoints stores the main river and tributary points
  for (var j = 0; j < riverPoints.length; j++) {

    //create two lines to bound the river
    var riverCurve1 = [];
    var riverCurve2 = [];
    for (var i = 0; i < riverPoints[j].length; i++) {
      riverCurve1.push(new THREE.Vector3(Math.min(riverPoints[j][i].x + 5, riverPoints[j][i].x + 2 * ((3 * i) + 1) / 3), tToggle ? (i == riverPoints[j].length - 1 ? 1.5 : riverPoints[j][i].y + 2) : riverPoints[j][i].y, riverPoints[j][i].z));
      riverCurve2.push(new THREE.Vector3(Math.max(riverPoints[j][i].x - 5, riverPoints[j][i].x - 2 * ((3 * i) + 1) / 3), tToggle ? (i == riverPoints[j].length - 1 ? 1.5 : riverPoints[j][i].y + 2) : riverPoints[j][i].y, riverPoints[j][i].z));
    }

    //create two catmullRomCurves from the lines
    var curve1 = new THREE.CatmullRomCurve3(riverCurve1);
    curve1.type = 'chordal';
    curve1.closed = false;
    var curve1geo = new THREE.Geometry();
    curve1geo.vertices = curve1.getPoints(500);

    var curve2 = new THREE.CatmullRomCurve3(riverCurve2);
    curve2.type = 'chordal';
    curve2.closed = false;
    var curve2geo = new THREE.Geometry();
    curve2geo.vertices = curve2.getPoints(500);

    var riverCurve = new THREE.Geometry();
    var riverMeshVertices = curve1geo.vertices;
    riverMeshVertices = riverMeshVertices.concat(curve2geo.vertices);


    var holes = [];
    riverCurve.vertices = riverMeshVertices;

    //Create faces between the vertices on the catmullRomCurves
    for (var i = 0; i < riverCurve.vertices.length - curve1geo.vertices.length - 1; i++) {
      riverCurve.faces.push(new THREE.Face3(i, i + 1, i + curve1geo.vertices.length));
      riverCurve.faces.push(new THREE.Face3(i + curve1geo.vertices.length, i + curve1geo.vertices.length + 1, i + 1));
    }

    //Add the river texture to the mesh
    var material = new THREE.MeshBasicMaterial({
      wireframe: false,
      side: THREE.DoubleSide,
      color: 0x40a4df,
      opacity: 1,
      transparent: true
    });

    //Add one stream of the river to the river object
    riverStream = new THREE.Mesh(riverCurve, material);
    river.add(riverStream);

  } // end for

  scene.add(river);
} //end setupRiver

//setupStaticBackground uses the old pewi graphics as a background image
function setupStaticBackground() {

  var r = 2;
  switch(printPrecipYearType()){
    case 'Dry': r = 0; break;
      case 'Normal': r = 1; break;
  }

  var bg = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
      map: oldPewiBackgrounds[r]
    })
  );

  bg.material.depthTest = false;
  bg.material.depthWrite = false;

  bgScene = new THREE.Scene();
  bgCam = new THREE.Camera();
  bgScene.add(bgCam);
  bgScene.add(bg);

  var ambiLight = new THREE.AmbientLight(0x404040, 6.0);
  bgScene.add(ambiLight);

} //end setupStaticBackground

//showMainMenu uses the esc key to return to the startup screen
// Adding navigation keys, asdw
function showMainMenu() {
  //Checking the flag variable to know which camera is functional.
  if (ToggleCam == 1){
    changeCam2();
    document.getElementById("flyover").innerHTML = "";
    document.getElementById("flyASDW").style.display = "none";
    document.getElementById("flyNavigKeys").style.display = "none";
    //Reseting camera 2 position when sandbox is reloaded
    camera2.position.x = 70;
    camera2.position.y = 25;
    camera2.position.z = 244;
    camera2.rotation.y = 0;
  }

  //show loading animation and startup page
  document.getElementById('loading').style.display = "block";
  document.getElementById('startUpFrame').contentWindow.recallMain();

  setTimeout(function() {

    document.getElementById('startupSequence').style.display = "block";

    //reset sandbox/level to original settings
    if (zoomedIn) switchToUnzoomedView(1, false);
    previousHover = null;
    currentYear = 1;
    //Goes back to the default land-use selection
    changeSelectedPaintTo(1);
    //Goes back to the land-type selection
    switchConsoleTab(1);
    //Goes back to the default year selection
    switchYearTab(1);
    //Resets the year selections
    resetYearDisplay();
    controls.reset();

    //reset paramters
    window.top.document.getElementById('parameters').innerHTML = "";
    toggleVisibility();

    //clean up from level
    if (levelGlobal > 0 || levelGlobal < 0) {
      //clean up from a level
      // console.log("---cleaning up from exit---");
      resetLevel();
      // clearPopup();
      levelGlobal = 0;
    }
    resetUndo();
    document.getElementById('page').style.visibility = "hidden";
    // document.getElementById('page').style.display = "none";

    // set boardData[currentBoard] as undefined
    boardData[currentBoard] = void 0; //XXX getTileID() & printPrecipYearType() are fired
  }, 1000);


} //end showMainMenu

//switchBoards removes and displays a new board in the THREE.js scene
function switchBoards(newBoard) {

  //remove points of previous board's river if present
  if (riverPoints.length > 0) {
    riverPoints = [];
  }
  //push into current board
  boardData.push(newBoard);
  // console.log('here');
  currentBoard++;
  boardData[currentBoard].updateBoard();
  refreshBoard();
  setupRiver();
  //in case new board is smaller than old board, make sure to reset hover
  previousHover = 0;

  //update Results to point to correct board since currentBoard is updated
  Totals = new Results(boardData[currentBoard]);
  generatedContourMap = new ContourMap();

} //end switchBoards


//switchToZoomView updates a zoom template map with information from the current full map
function switchToZoomView(tile) {

  //record the board index before zooming in
  fullBoardBeforeZoom = currentBoard;
  zoomedIn = true;

  //setup board from zoom template map
  setupBoardFromFile("./levels/maps/zoomTemplate.csv");

  //for each of the tiles in the zoomed in map, update their information from the main board
  for (var i = 0; i < boardData[currentBoard].map.length; i++) {

    //update the mesh textures
    if(overlayedToggled != true){
      meshMaterials[i].map = grayTextureArray[boardData[fullBoardBeforeZoom].map[tile].landType[currentYear]];
      meshOverlay[i].map = grayTextureArray[boardData[fullBoardBeforeZoom].map[tile].landType[currentYear]];
    }
    else{
      meshMaterials[i].map = textureArray[boardData[fullBoardBeforeZoom].map[tile].landType[currentYear]];
      meshOverlay[i].map = textureArray[boardData[fullBoardBeforeZoom].map[tile].landType[currentYear]];
    }

    //update the land use types for each year
    boardData[currentBoard].map[i].landType[1] = boardData[fullBoardBeforeZoom].map[tile].landType[1];
    boardData[currentBoard].map[i].landType[2] = boardData[fullBoardBeforeZoom].map[tile].landType[2];
    boardData[currentBoard].map[i].landType[3] = boardData[fullBoardBeforeZoom].map[tile].landType[3];

    //update the calculations for the current year
    boardData[currentBoard].map[i].update(currentYear);

  }

  //reset the camera location
  controls.value = 100;
  controls.reset();
  setTimeout(function() {
    controls.value = 1;
  }, 100);

  //start animating the zoom in movement
  zoomingInNow = true;

}

//switchToUnzoomedView returns to the full map from a zoomed in tile and updates the tile's results.
function switchToUnzoomedView(tile, shouldResetBoard) {

  zoomedIn = false;

  //Record the results of this tile and save to the main map results for this tile.
  //TODO

  //Switch back to the full map
  if (shouldResetBoard) switchBoards(boardData[fullBoardBeforeZoom]);

  //reset the camera location
  controls.value = 10;
  controls.reset();
  setTimeout(function() {
    controls.value = 1;
  }, 100);

  //start animation the zoom out movement
  zoomingOutNow = true;
}

//Function to change camera views.This function is called when the button Q is pressed.
function toggleCameraView(){
    //Checking the flag variable to know which camera is functional.
    if (ToggleCam == 1){changeCam2();}
    else{ChangeCam();}
    if (ToggleCam == 1) {
      document.getElementById('flyover').style.display = "block";
      document.getElementById("flyASDW").style.display = "block";
      document.getElementById("flyNavigKeys").style.display = "block";
    }
    else{document.getElementById('flyover').style.display = "none";
    document.getElementById("flyASDW").style.display = "none";
    document.getElementById("flyNavigKeys").style.display = "none";
  }
}

//zoomAnimation updates field of view positions for zoom animation
function zoomAnimation() {

  if (zoomingInNow) {

    camera.fov = fov * zoomFactor;
    camera.updateProjectionMatrix();

    zoomFactor = zoomFactor - zoomInInc;

    if (zoomFactor < 0.35) zoomingInNow = false;

  }

  if (zoomingOutNow) {

    camera.fov = fov * zoomFactor;
    camera.updateProjectionMatrix();

    zoomFactor = zoomFactor + zoomOutInc;


    console.log(zoomFactor);

    if (zoomFactor > 0.8) {

      if (zoomFactor >= 1.2) {
        zoomingOutNow = false;
      }

      zoomFactor = 1.0;
    }
  }

} //end zoomAnimation

//export { boardData[currentYear].map as theMap};
