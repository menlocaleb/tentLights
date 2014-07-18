/* Javascript file to handle runtime execution of our Tent Lights app.
   Uses the modules developed to expose functionality to user. */

var scene;
var camera;
var renderer;
var ambientLight;
var animationType = "circle";

var renderWindow;
var aspectRatio = 16/9;

var lightingController = {};
var lights = [];
var lightingBoard;


function init() {
	renderWindow = $("#tl-viewport");
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75,16/9, 0.1, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMapEnabled = true;
	renderer.setSize(renderWindow.innerWidth(), renderWindow.innerWidth()/aspectRatio);
	renderWindow.append(renderer.domElement);

	// so we can see a bit besides spotlight
	ambientLight = new THREE.AmbientLight( 0x252525 ); // soft white light
	scene.add( ambientLight );
}

function SetLightColors(lightIds, color) {
	var count = 0;
	for (var id in lightIds) {
		if (lights[id]) {
			lights[id].color.setStyle(color);
			count = count + 1;
		}
	}

	return count;
}

function ToggleLightAnimations() {

}

function initUI() {

	$(".tl-color-swath").click(function() {
		var color = $(this).css('background-color');
		var lightIds = lightingBoard.GetSelectedLights();
		var count = SetLightColors(lightIds, color);
		
		if (count >= lights.length/2.0) {
			var scaleFactor = 0.2;
			var predominantColor = new THREE.Color().setStyle(color);
			var ambientColor = new THREE.Color(predominantColor.r * scaleFactor, predominantColor.g * scaleFactor, predominantColor.b * scaleFactor);
			ambientLight.color = ambientColor;
		}
		
	});

	$("#tl-animation-toggle").click(function() {
		if (animationType === 'circle') {
			animationType = 'twirly';
			$(this).css("background-color", "#F27013");
		} else {
			animationType = 'circle';
			$(this).css("background-color", "#00CC30");
		}

		for (var id in lights) {
			if (lights[id].GetAnimationType() === "circle") {
				lights[id].SetAnimation({animationType:"twirly"});
			} else {
				lights[id].SetAnimation({animationType:"circle"});
			}
		}
		
	});

}

function screenSizeChange() {
	renderer.setSize(renderWindow.innerWidth(), renderWindow.innerWidth()/aspectRatio);
}

function setupCamera() {
	camera.position.x = 4.5;
	camera.position.y = 4.5;
	camera.position.z = 8;
	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(new THREE.Vector3(0,-4,3));
}

function AnimateLights() {
	for (var id in lights) {
		lights[id].Animate();
	}
}

var render = function() {
	requestAnimationFrame(render);
	AnimateLights();
	renderer.render(scene, camera);
};



// Until have model of DM tent, use this to test lights inside of
// North is + y, East is + x
function createRoom(scene) {
	var tentLength = 10,
		tentWidth = 10,
		tentHeight = 10;


	var wallTexture = THREE.ImageUtils.loadTexture( "assets/paperTexture.jpg" );
	wallTexture.wrapS = THREE.RepeatWrapping;
	wallTexture.wrapT = THREE.RepeatWrapping;
	wallTexture.repeat.set( 1, 1 );
	// var flootTexture = THREE.ImageUtils.loadTexture( "assets/blackBoards.jpeg" );
	// flootTexture.wrapS = THREE.RepeatWrapping;
	// flootTexture.wrapT = THREE.RepeatWrapping;
	// flootTexture.repeat.set( 4, 4 );

	// need phong b/c I think lambert is evaluated per vertex which for plane doesn't work
	var floorMaterial = new THREE.MeshPhongMaterial( { ambient: 0x666666, color: 0x222222, specular: 0xcccccc, shininess: 30, shading: THREE.FlatShading } );
	//floorMaterial.side = THREE.DoubleSide;
	var wallMaterial = new THREE.MeshPhongMaterial( { ambient: 0xeeeeee, color: 0xfefefe, specular: 0xffffff, shininess: 30, shading: THREE.FlatShading, map: wallTexture } );
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


function createColorPicker() {
	var listOfColors = [
		'#FFFFFF',
		'#E8152E',
		'#B726FF',
		'#26FFF4',
		'#00CC30'
	];
	
	for (var i = 0; i < listOfColors.length; i++) {
		$("#tl-color-picker").append('<div class="tl-color-swath" style="width:' + 97/listOfColors.length + '%; background-color:' + listOfColors[i] + ';"></div>');
	}
	
}


function main() {
	
	init();
	createRoom(scene);
	setupCamera();

	lights["1"] = new TentLights.Mover( "#ffffff" );
	lights["1"].position.set( 0, 4, 9 );
	lights["1"].SetAnimation({animationType: "twirly"});
	scene.add(lights["1"]);
	lights["2"] = new TentLights.Mover( "#ffffff" );
	lights["2"].position.set( 0, 0, 9 );
	lights["2"].tilt = Math.PI/4;
	lights["2"].SetAnimation({clockwise: false});
	scene.add(lights["2"]);
	lights["3"] = new TentLights.Mover( "#ffffff" );
	lights["3"].position.set( 0, -4, 9 );
	lights["3"].SetAnimation({animationType: "twirly"});
	scene.add(lights["3"]);


	createColorPicker();
	initUI();
	lightingBoard = new TentLights.LightingBoard(lightingController);
	lightingBoard.CreateSelectionHandlers(".tl-toggle-light");
	


	render();

}


// Register Handlers
$(document).ready(main);

$(window).resize(screenSizeChange);










