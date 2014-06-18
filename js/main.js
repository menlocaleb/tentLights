/* Javascript file to handle runtime execution of our Tent Lights app.
   Uses the modules developed to expose functionality to user. */



function main() {
	//alert("main");
}



function addLight(scene) {
	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 0, 4, 9 );
	var target = new THREE.Vector3(0,1,1);
	target.negate().add(spotLight.position);
	spotLight.target.position = target;
	console.log(target);

	spotLight.castShadow = true;

	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;

	spotLight.shadowCameraNear = 500;
	spotLight.shadowCameraFar = 4000;
	spotLight.shadowCameraFov = 30;

	scene.add( spotLight );
}


// Until have model of DM tent, use this to test lights inside of
// North is + y, East is + x
function createRoom(scene) {
	var tentLength = 10,
		tentWidth = 10,
		tentHeight = 10;

	// need phong b/c I think lambert is evaluated per vertex which for plane doesn't work
	var floorMaterial = new THREE.MeshPhongMaterial( { ambient: 0x222222, color: 0x222222, specular: 0xcccccc, shininess: 50, shading: THREE.FlatShading } );
	//floorMaterial.side = THREE.DoubleSide;
	var wallMaterial = new THREE.MeshPhongMaterial( { ambient: 0xeeeeee, color: 0xeeeeee, specular: 0xcccccc, shininess: 50, shading: THREE.FlatShading } );
	//wallMaterial.side = THREE.DoubleSide;

	// create floor of room
	var tentFloor = new THREE.PlaneGeometry( tentWidth, tentLength );

	var floorMesh = new THREE.Mesh( tentFloor, floorMaterial ) ;
	floorMesh.receiveShadow = true;

	scene.add( floorMesh );



	// create south wall of room
	var tentSouthWall = new THREE.PlaneGeometry( tentWidth, tentHeight );

	var southWallMesh = new THREE.Mesh( tentSouthWall, wallMaterial ) ;
	southWallMesh.position.y = -tentLength/2;
	southWallMesh.position.z = tentHeight/2;
	southWallMesh.rotation.x = -Math.PI/2;

	scene.add( southWallMesh );


	// create north wall of room
	var tentNorthWall = new THREE.PlaneGeometry( tentWidth, tentHeight );

	var northWallMesh = new THREE.Mesh( tentNorthWall, wallMaterial ) ;
	northWallMesh.position.y = tentLength/2;
	northWallMesh.position.z = tentHeight/2;
	northWallMesh.rotation.x = Math.PI/2;

	scene.add( northWallMesh );


	// create west wall of room
	var tentWestWall = new THREE.PlaneGeometry( tentHeight, tentWidth );

	var westWallMesh = new THREE.Mesh( tentWestWall, wallMaterial ) ;
	westWallMesh.position.x = -tentWidth/2;
	westWallMesh.position.z = tentHeight/2;
	westWallMesh.rotation.y = Math.PI/2;

	scene.add( westWallMesh );


	// create east wall of room
	var tentEastWall = new THREE.PlaneGeometry( tentHeight, tentWidth );

	var eastWallMesh = new THREE.Mesh( tentEastWall, wallMaterial ) ;
	eastWallMesh.position.x = tentWidth/2;
	eastWallMesh.position.z = tentHeight/2;
	eastWallMesh.rotation.y = -Math.PI/2;

	scene.add( eastWallMesh );



	// create roof of room
	var tentCeiling = new THREE.PlaneGeometry( tentWidth, tentHeight );

	var ceilingMesh = new THREE.Mesh( tentCeiling, wallMaterial ) ;
	ceilingMesh.position.z = tentHeight;
	ceilingMesh.rotation.x = Math.PI;

	scene.add( ceilingMesh );


	
	
}


window.onload = main;