function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

function updateHUD() {
    var text ;
    text = "x: " + Math.floor(camera.position.x) ;
    text += "  y: " + Math.floor(camera.position.y) ;
    text += "  z: " + Math.floor(camera.position.z)  ;
    text += "<br>";
    text += "  rx: " + Math.floor(camera.rotation.x) ;
    text += "  ry: " + Math.floor(camera.rotation.y) ;
    text += "  rz: " + Math.floor(camera.rotation.z) ;
    
    document.getElementById("pos").innerHTML = text ;
}


function addBoard() {
    
    var tiles = [];
    
    var tilesHigh = 36;
    var tilesWide = 23;
    
    var tileHeight = 12;
    var tileWidth = 18;

    for (var j = 0; j < tilesHigh; j++) {

        for (var i = 0; i < tilesWide; i++) {

            var r = Math.floor((Math.random() * 14));

            var tileGeometry = new THREE.BoxGeometry(tileWidth, 0, tileHeight);
         
            var tileMaterial;
         
        if(r == 0){
            tileMaterial = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0});
        } else {    
            tileMaterial = new THREE.MeshLambertMaterial({
                map: textureArray[r]
            });
        }

            var newTile = new THREE.Mesh(tileGeometry, tileMaterial);
            newTile.position.x = i * tileWidth - (tileWidth * tilesWide)/2;
            newTile.position.y = 0;
            newTile.position.z = j * tileHeight - (tileHeight * tilesHigh)/2;

            tiles.push(newTile);

            scene.add(newTile);

        }

    }
    
}//end addBoard()