# pewi3.0
People in Ecosystems Watershed Integration v3

three.js WebGL implementation of pewi v2.0

improvements: 
  object oriented implementation, 
  improved calculation efficiency, 
  3D graphics, 
  level-based educational tools, 
  codex (scientific information) library, 

page design outline:

  -- index.html
     structure: contains the pewi workspace and iframes used for navigation to 
     and from the workspace
     action sequence: draws the workspace as "page" div, but renders the 
     loadingContainer and startUpFrame over the workspace for navigation

  -- startup.html
     structure: contains a video used as a loading animation and 3 navigation 
     buttons displayed after the video
     action sequence: on load this page plays a video and simultaneously
     calls on loader.js and mainFE.js to begin loading resources
     user input: the user can navigate to the sandbox mode, play mode page, or 
     utilities page using the buttons
     
  -- loader.js
     structure: contains links to all necessary images/textures to load
     action sequence: uses a THREE.js TextureLoader to load all resources
     
  -- main.js
     structure: includes all generic functions to render the THREE.js scene in 
     our workspace.
     action sequence: some functions are called on load of the startup.html page
     to create the THREE.js framework elements which will not be reinstantiated.
     other functions are repeatedly called when rendering a new board in PEWI
  
  -- helpersFE.js
     structure: this script contains all necessary functions to create/interact
     with a PEWI workspace for the sandbox, levels, and multiplayer design modes
     action sequence: these helper methods are called mainly from mainFE.js and
     index.html
     
  -- play.html
     structure: rendered in an iframe over the static background image, contains
     cloud images that link to PEWI levels
     action sequence: dynamically creates cloud links via levelLoader.js
     user input: user selects a cloud which renders a level in the workspace
     
  -- utilities.html
     structure: rendered in an iframe over the static background image, contains
     three buttons which link to the level designer and mutliplayer design mode
     user input: user can select the level designer or mutliplayer design mode,
     and the third button allows the user to aggregate mutliplayer files
     
  
     
  
