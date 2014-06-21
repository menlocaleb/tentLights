/* Javascript file to handle runtime execution of our Tent Lights app.
   Uses the modules developed to expose functionality to user. */

var scene;
var camera;
var renderer;
var spot;
var ambientLight;
var l1
var panAngle = 0;
var tiltAngle = 0;
var stepAngle = Math.PI/50;
var stepTiltAngle = Math.PI/100;
var animationType = "twirly";

var renderWindow;
var aspectRatio = 16/9;

var lightingController = {};
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
	ambientLight = new THREE.AmbientLight( 0x171717 ); // soft white light
	scene.add( ambientLight );
}

function initUI() {

	$(".tl-color-swath").click(function() {
		var selected = $(this).hasClass('selected');
		if (!selected) {
			var color = $(this).css('background-color');
			var lightIds = lightingBoard.GetSelectedLights();
			var count = 0;
			var predominantColor;
			if (lightIds["1"]) {
				spot.color.setStyle(color);
				predominantColor = spot.color;
				count = count + 1;
			}
			if (lightIds["2"]) {
				spot2.color.setStyle(color);
				predominantColor = spot2.color;
				count = count + 1;
			}
			if (lightIds["3"]) {
				spot3.color.setStyle(color);
				predominantColor = spot3.color;
				count = count + 1;
			}
			if (count >= 2) {
				var scaleFactor = 0.2;
				var ambientColor = new THREE.Color(predominantColor.r * scaleFactor, predominantColor.g * scaleFactor, predominantColor.b * scaleFactor);
				ambientLight.color = ambientColor;
			}
			$("#tl-color-picker .selected").removeClass('selected');
			$(this).addClass('selected');

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
		
	});
}

function screenSizeChange() {
	renderer.setSize(renderWindow.innerWidth(), renderWindow.innerWidth()/aspectRatio);
}

function setupCamera() {
	camera.position.x = 4;
	camera.position.y = 4;
	camera.position.z = 6;
	camera.up = new THREE.Vector3(0,0,1);
	camera.lookAt(new THREE.Vector3(0,-4,3));
}

var render = function() {
	requestAnimationFrame(render);

	if (animationType === 'circle') {
		animateLightCircle(spot);
		animateLightCircleAndTilt(spot2);
		animateLightCircle(spot3, true);

	} else {
		animateLightCircleAndTilt(spot);
		animateLightCircle(spot2);
		animateLightCircleAndTilt(spot3, true);
	}
	renderer.render(scene, camera);
};



function animateLightCircle(light, switchDir) {
	if (switchDir) {
		light.pan = light.pan - stepAngle;
	} else {
		light.pan = light.pan + stepAngle;
	}
}

function animateLightCircleAndTilt(light, switchDir) {
	if (switchDir) {
		light.pan = light.pan - stepAngle;
	} else {
		light.pan = light.pan + stepAngle;
	}

	if (Math.abs(light.tilt + stepTiltAngle) > Math.PI/3) {
		stepTiltAngle = -1 * stepTiltAngle;
	}

	light.tilt = light.tilt + stepTiltAngle;
}


// Until have model of DM tent, use this to test lights inside of
// North is + y, East is + x
function createRoom(scene) {
	var tentLength = 10,
		tentWidth = 10,
		tentHeight = 10;


	var wallTexture = THREE.ImageUtils.loadTexture( "assets/whitePattern1.jpg" );
	wallTexture.wrapS = THREE.RepeatWrapping;
	wallTexture.wrapT = THREE.RepeatWrapping;
	wallTexture.repeat.set( 4, 4 );
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
		'#26FFF4'
	];

	// make first color selected
	if (listOfColors.length > 0) {
		$("#tl-color-picker").append('<div class="tl-color-swath selected" style="width:' + 95/listOfColors.length + '%; background-color:' + listOfColors[0] + ';"></div>');
	}																						// use 99 to ensure border doesn't make swatches overlap line
	for (var i = 1; i < listOfColors.length; i++) {
		console.log("list of colors");
		$("#tl-color-picker").append('<div class="tl-color-swath" style="width:' + 95/listOfColors.length + '%; background-color:' + listOfColors[i] + ';"></div>');
	}
	
}


function main() {
	
	init();
	createRoom(scene);
	setupCamera();

	spot = new TentLights.Mover( "#ffffff" );
	spot.position.set( 0, 3, 8 );
	scene.add(spot);
	spot2 = new TentLights.Mover( "#ffffff" );
	spot2.position.set( 0, 0, 7 );
	scene.add(spot2);
	spot3 = new TentLights.Mover( "#ffffff" );
	spot3.position.set( 0, -3, 8 );
	scene.add(spot3);


	createColorPicker();
	initUI();
	lightingBoard = new TentLights.LightingBoard(lightingController);
	lightingBoard.CreateSelectionHandlers(".lt-toggle-light");
	


	render();

}


// Register Handlers
$(document).ready(main);

$(window).resize(screenSizeChange);








