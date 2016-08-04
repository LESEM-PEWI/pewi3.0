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
     
     ./index.html
     draws the pewi workspace div but renders the loadingContainer and 
     startUpFrame over the workspace for navigation
     
    ./htmlFrames/startup.html
     onLoad this page plays a loading animation video and simultaneously calls on
     loader.js and mainFE.js to begin loading resources. navigation buttons to
     sandbox mode, play mode page, or utilities page will load further resources
     and the workspace when selected
     
     ./front-end/loader.js
     contains links to all necessary images/textures to load using a THREE.js 
     TextureLoader
     
     ./front-end/mainFE.js
     includes all generic functions to render the THREE.js scene in the workspace
  
     ./front-end/helpersFE.js
     contains all necessary functions to create/interact with a PEWI workspace 
     for the sandbox, levels, and multiplayer design modes
     
     ./back-end/helperObjects.js
     object-oriented backend script written for PEWI 2.0 which instantiates the 
     data structures for the Tile/Board/Total objects, and performs calculations
     
     ./back-end/mainBE.js and ./back-end/helperMethods.js
     two backend scripts which assist in loading/parsing data from watershed map
     .csv files
     
     ./htmlFrames/results.html and ./front-end/resultsDisplay.js
     generate an iFrame in the workspace to display tabular and graphical 
     results calculated via the backend scripts for the Totals object
     
     ./codex/*
     contains all necessary resources and scripts to create an iframe in the 
     workspace which provides a directory of information for the user to explore.
     new directory entries and links to resources are added via the main.dat file
     which are parsed and inserted with codexHelper.js
     
     ./front-end/gameLogic.js and ./front-end/Bird.js
     level objectives are monitored via frameRate in mainFE.js and gameLogic.js.
     Bird.js can add an animated flock of birds to the scene. Other animation 
     scripts are contained in helpersFE.js
       
     ./htmlFrames/uploadDownload.html
     rendered as an iframe in the workspace with options for upload and download 
     of PEWI maps with current land-use
  
     ./htmlFrames/credits.html
     rendered as an iframe in the workspace to display credits for the project

     ./htmlFrames/play.html
     rendered in an iframe over the static background image, contains
     cloud images that link to PEWI levels
     
     ./levels/*
     contains resources to support levels in PEWI. the level.dat file specifies
     the hierarchy of levels for the play.html page and points to level design
     files in the specs folder which are used with the main map (data.csv) or 
     accessory maps in the maps folder
     
     ./front-end/levelLoader.js
     scripts for parsing/loading data in the levels directory. links to the
     levels are generated when the play.html page loads and the level details are
     loaded when a level is selected
     
     ./htmlFrames/utilities.html
     rendered in an iframe over the static background image, contains
     three buttons which link to the level designer and mutliplayer design mode
          
     ./htmlFrames/levelDesigner.html
     opens a new window allowing a user to create a new level for pewi by 
     specifying objectives via score monitoring, animations for user feedback, 
     and guiding scripts.
     
     ./htmlFrames/multiDownload.html
     completes the creation of mutliplayer maps when the user presses the v key
     in the workspace after assigning areas to players in the mutliplayer mode