/* Unit Tests for TentLights.Lights */

function floatsEqual(actual, expected, tolerance, message) {
	ok(Math.abs(actual-expected) < tolerance, (message) ? message : "");
}


(function() {
/* ********************************************** */
// Module variables
module("TentLights.Mover Tests", {
	setup: function() {
	},
	teardown: function() {
	}
});

function lightPropertiesEqual(actualLight, expectedLight, message) {
	// optional message to preface equality tests
	if (message) {
		ok(true, message);
	}
	// Position
	propEqual(actualLight.position, expectedLight.position, "Actual position same as exected.");

	// Rotation
	strictEqual(actualLight.rotation.x, expectedLight.rotation.x, "Actual rotation.x same as expected.");
	strictEqual(actualLight.rotation.y, expectedLight.rotation.y, "Actual rotation.y same as expected.");
	strictEqual(actualLight.rotation.z, expectedLight.rotation.z, "Actual rotation.z same as expected.");
	//notStrictEqual(actualLight.rotation.order, expectedLight.rotation.order, "Actual rotation.order should be different than expected.");

	// Color
	strictEqual(actualLight.color.getHex(), expectedLight.color.getHex(), "Colors should match.");

	// Intensity should match
	strictEqual(actualLight.intensity, expectedLight.intensity, "Intensities should match.");
}

test("Default Constructor", function() {
	var mover = new TentLights.Mover();
	var defaultSpotLight = new THREE.SpotLight();
	
	// ensure same functionality as THREE.SpotLight for appropriate fields.
	lightPropertiesEqual(mover, defaultSpotLight, "Default TentLights.Mover constructor test.");

	// Euler angle needs to be changed
	strictEqual(mover.rotation.order, "ZXY", "Euler angle order should be changed with Z first.");

});

test("Constructor with parameters", function() {
	var mover = new TentLights.Mover(0xff0000, 0.5);
	var spotLight = new THREE.SpotLight(0xff0000, 0.5);

	// ensure same functionality as THREE.SpotLight for appropriate fields.
	lightPropertiesEqual(mover, spotLight, "TentLights.Mover parameter constructor test.");
});

test("Verify subclass of THREE.SpotLight", function() {
	var mover = new TentLights.Mover();
	var spotLight = new THREE.SpotLight();

	ok((mover instanceof THREE.SpotLight), "Tentlights.Mover is instance of THREE.SpotLight");

	propEqual(mover.prototype, spotLight.prototype, "Prototypes should be equal");
});

test("Verify that target follows motion/rotation of Mover.", function() {
	var mover = new TentLights.Mover();

	propEqual(mover.target.position, new THREE.Vector3(0,0,-1), "Target should be vector 0,0,-1 before moving light");

	strictEqual(mover.target.parent, mover, "Target should be child element of the mover.");

	// move and rotate light, afterward target's global maxtrix should be the mover's global matrix shifted down 1 on the z axis
	//mover.rotation = new THREE.Euler(Math.PI/4, Math.PI/8, Math.PI/3);
	//mover.position = new THREE.Vector3(10, -20, 4);
	// TODO figure out how to do this test and if it is necessary
	//strictEqual(mover.target.matrixWorld, moverWorldMatrix, "Target moves through 3d space with contant offset from mover.");

});

test("Verify Pan accessor valid use", function() {
	var mover = new TentLights.Mover();
	var tolerance = 0.000000001;

	// Test positive pan value < 2*Math.PI
	mover.pan = 0.0;
	floatsEqual(mover.pan, mover.rotation.z, tolerance, "Mover.pan should map to z rotation.");

	// Test positive pan value < 2*Math.PI
	mover.pan = Math.PI/2;
	floatsEqual(mover.pan, mover.rotation.z, tolerance, "Mover.pan should map to z rotation.");

	// > -2*Math.PI
	mover.pan = -Math.PI/3;
	floatsEqual(mover.pan, mover.rotation.z, tolerance, "Mover.pan should map to z rotation.");

	// Test values greater than and less than 2Math.PI
	mover.pan = Math.PI*7/3;
	floatsEqual(mover.pan, Math.PI/3, tolerance, "Pan should reduce input to equivalent value if it is more than 2 pi");
	floatsEqual(mover.pan, mover.rotation.z, tolerance, "Mover.pan should map to z rotation.");

	// Test values greater than and less than 2Math.PI
	mover.pan = -Math.PI*7/3;
	floatsEqual(mover.pan, -Math.PI/3, tolerance, "Pan should reduce input to equivalent value if it is more than 0");
	floatsEqual(mover.pan, mover.rotation.z, tolerance, "Mover.pan should map to z rotation.");


});

test("Verify Pan accessor invalid use", function() {
	var mover = new TentLights.Mover();

	// non-numerical input should throw TypeError
	throws(
		function() {
			mover.pan = null;
		},
		TypeError,
		"Null is invalid input"
	);

	throws(
		function() {
			mover.pan = "string";
		},
		TypeError,
		"String is invalid input"
	);

	throws(
		function() {
			var obj = {};
			mover.pan = obj;
		},
		TypeError,
		"Object is invalid input"
	);

});

test("Verify Tilt accessor valid use", function() {
	var mover = new TentLights.Mover();
	var tolerance = 0.000000001;

	// Test positive tilt values
	mover.tilt = 0.0;
	floatsEqual(mover.tilt, mover.rotation.x, tolerance, "Mover.tilt should map to z rotation.");

	// Test positive tilt values
	mover.tilt = Math.PI/3;
	floatsEqual(mover.tilt, mover.rotation.x, tolerance, "Mover.tilt should map to z rotation.");

	mover.tilt = Math.PI/2;
	floatsEqual(mover.tilt, mover.rotation.x, tolerance, "Mover.tilt should map to z rotation.");

	mover.tilt = Math.PI;
	floatsEqual(mover.tilt, Math.PI/2, tolerance, "tilt value is clamped at Math.PI/2");
	floatsEqual(mover.tilt, mover.rotation.x, tolerance, "Mover.tilt should map to z rotation.");

	// Test negative tilt values
	mover.tilt = -Math.PI/3;
	floatsEqual(mover.tilt, mover.rotation.x, tolerance, "Mover.tilt should map to z rotation.");

	mover.tilt = -Math.PI/2;
	floatsEqual(mover.tilt, mover.rotation.x, tolerance, "Mover.tilt should map to z rotation.");

	mover.tilt = -Math.PI;
	floatsEqual(mover.tilt, -Math.PI/2, tolerance, "tilt value is clamped at Math.PI/2");
	floatsEqual(mover.tilt, mover.rotation.x, tolerance, "Mover.tilt should map to z rotation.");
});

test("Verify Tilt accessor invalid use", function() {
	var mover = new TentLights.Mover();

	// non-numerical input should throw TypeError
	throws(
		function() {
			mover.tilt = null;
		},
		TypeError,
		"Null is invalid input"
	);

	throws(
		function() {
			mover.tilt = "string";
		},
		TypeError,
		"String is invalid input"
	);

	throws(
		function() {
			var obj = {};
			mover.tilt = obj;
		},
		TypeError,
		"Object is invalid input"
	);
});




})();










