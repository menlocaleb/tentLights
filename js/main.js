/* Javascript file to handle runtime execution of our Tent Lights app.
   Uses the modules developed to expose functionality to user. */



function main() {
	//alert("main");
}


// Until have model of DM tent, use this to test lights inside of
// North is + y, East is + x
function createRoom(scene) {
	var tentLength = 10,
		tentWidth = 10,
		tentHeight = 10;

	// need phong b/c I think lambert is evaluated per vertex which for plane doesn't work
	var floorMaterial = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0x222222, specular: 0xcccccc, shininess: 30, shading: THREE.FlatShading } );
	//floorMaterial.side = THREE.DoubleSide;
	var wallMaterial = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xeeeeee, specular: 0xffffff, shininess: 30, shading: THREE.FlatShading } );
	//wallMaterial.side = THREE.DoubleSide;

	// create floor of room
	var tentFloor = new THREE.Geometry();
	tentFloor.vertices.push( new THREE.Vector3(tentWidth/2, tentLength/2, 0));
	tentFloor.vertices.push( new THREE.Vector3(-tentWidth/2, tentLength/2, 0));
	tentFloor.vertices.push( new THREE.Vector3(-tentWidth/2, -tentLength/2, 0));
	tentFloor.vertices.push( new THREE.Vector3(tentWidth/2, -tentLength/2, 0));

	tentFloor.faces.push( new THREE.Face3( 0, 1, 2, new THREE.Vector3(0,0,1)) );
	tentFloor.faces.push( new THREE.Face3( 2, 3, 0, new THREE.Vector3(0,0,1) ) );

	var floorMesh = new THREE.Mesh( tentFloor, floorMaterial ) ;
	floorMesh.receiveShadow = true;

	// create  of room
	/*var tentSouthWall = new THREE.Geometry();
	tentSouthWall.vertices.push( new THREE.Vector3(-tentWidth/2, -tentLength/2, 0));
	tentSouthWall.vertices.push( new THREE.Vector3(-tentWidth/2, -tentLength/2, tentHeight));
	tentSouthWall.vertices.push( new THREE.Vector3(tentWidth/2, -tentLength/2, tentHeight));
	tentSouthWall.vertices.push( new THREE.Vector3(tentWidth/2, -tentLength/2, 0));

	tentSouthWall.faces.push( new THREE.Face3( 0, 1, 2 ) );
	tentSouthWall.faces.push( new THREE.Face3( 2, 3, 0 ) );

	var southWallMesh = new THREE.Mesh( tentSouthWall, wallMaterial ) ;	*/	

	scene.add( floorMesh );
	//scene.add( southWallMesh );
}


window.onload = main;