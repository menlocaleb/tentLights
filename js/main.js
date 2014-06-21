/* Javascript file to handle runtime execution of our Tent Lights app.
   Uses the modules developed to expose functionality to user. */

var scene;
var camera;
var renderer;
var spot;
var l1
var panAngle = 0;
var tiltAngle = 0;
var stepAngle = Math.PI/20;

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMapEnabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// so we can see a bit besides spotlight
	var light = new THREE.AmbientLight( 0x171717 ); // soft white light
	scene.add( light );
}


function setupCamera() {
	camera.position.y = 5;
	camera.position.z = 5;
	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(new THREE.Vector3(0,0,0));
}

var render = function() {
	requestAnimationFrame(render);

	//panAngle = panAngle + stepAngle;
	//animateLight(spot, panAngle);
	//animateLight2();
	renderer.render(scene, camera);
};




function addLight(scene) {
	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 0, 0, 3 );
	spotLight.target.position = new THREE.Vector3(0,0,-1);
	spotLight.add(spotLight.target); // hope this makes target track with spotlight
	/*var target = new THREE.Vector3(1,1,1);
	target.negate().add(spotLight.position);
	spotLight.target.position = target;
	console.log(target);*/

	spotLight.castShadow = true;

	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;

	spotLight.shadowCameraNear = 500;
	spotLight.shadowCameraFar = 4000;
	spotLight.shadowCameraFov = 30;
	spotLight.angle = Math.PI/15;

	scene.add( spotLight );

	console.log(spotLight);

	return spotLight;
}

function animateLight(light, angle) {
	/*var rotation = new THREE.Euler( 0, Math.PI/4, angle, 'XZY' );
	console.log(rotation);
	var target = new THREE.Vector3(0,0,1);
	target.applyEuler(rotation);
	target.negate().add(light.position);
	light.target.position = target;*/
	light.rotation.order = 'ZXY';
	light.rotation.x = Math.PI/4;
	light.rotation.z = angle;
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
	var wallMaterial = new THREE.MeshPhongMaterial( { ambient: 0xfefefe, color: 0xfefefe, specular: 0xffffff, shininess: 50, shading: THREE.FlatShading } );
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


function main() {
	//alert("main");
	init();
	createRoom(scene);
	setupCamera();

	//l1 = addLight(scene);
	spot = new TentLights.Mover( 0xffffff );
	//spot.target.position = new THREE.Vector3(0,0,-1);
	//spot.add(spot.target); // hope this makes target track with spotlight
	spot.position.set( 0, 0, 3 );
	scene.add(spot);
	console.log(spot);

	render();

}


document.addEventListener('keydown', function(event) {
	switch (event.which) {
		case 38: // up arrow
			tiltAngle = tiltAngle + stepAngle;
			spot.tilt = tiltAngle;
			break;
		case 40: // down arrow
			tiltAngle = tiltAngle - stepAngle;
			spot.tilt = tiltAngle;
			break;
		case 37: // left arrow
			panAngle = panAngle + stepAngle;
			spot.pan = panAngle;
			break;
		case 39: // right arrow
			panAngle = panAngle - stepAngle;
			spot.pan = panAngle;
			break;
		case 82: // 'r'
			spot.color = new THREE.Color(1,0,0)
		default:
		console.log("No action for that key");
	}

});

window.onload = main;









