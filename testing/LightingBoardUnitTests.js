/* Unit tests for TentLights.LightingBoard class */

(function() {
/* ********************************************** */
// Module variables
var lightingBoard;

module("TentLights.LightingBoard Tests", {
	setup: function() {
		var tempLightingController = {};
		lightingBoard = new TentLights.LightingBoard(tempLightingController);
	},
	teardown: function() {
	}
});

test("Initialization", function() {
	ok(false, "Not yet implemented.");
});


test("GetSelectedLights Test", function() {
	// Should be empty object when just created board
	deepEqual(lightingBoard.GetSelectedLights(), {}, "No selected lights by default.");

	// after select a few lights they should be returned.
	lightingBoard.AddLightToSelection("1");
	lightingBoard.AddLightToSelection("3");
	deepEqual(lightingBoard.GetSelectedLights(), {"1":1, "3":3}, "Added lights now returned.");

	// after delete list should be updated
	lightingBoard.RemoveLightFromSelection("1");
	deepEqual(lightingBoard.GetSelectedLights(), {"3":3}, "Removed light no longer returned.");

});

test("AddLightToSelection Valid Use Test", function() {
	// add new key
	lightingBoard.AddLightToSelection("1");
	deepEqual(lightingBoard.GetSelectedLights(), {"1":1}, "Added light now in list.");

	// add duplicate key is allowed
	lightingBoard.AddLightToSelection("1");
	deepEqual(lightingBoard.GetSelectedLights(), {"1":1}, "Duplicate isn't added twice to list.");


});

test("AddLightToSelection Invalid Use Test", function() {
	throws(
		function() {
			lightingBoard.AddLightToSelection("1.4");
		},
		TypeError,
		"AddLightToSelection expects a string that can parse to an integer"
	);

	throws(
		function() {
			lightingBoard.AddLightToSelection(1);
		},
		TypeError,
		"AddLightToSelection expecting a string, not a number"
	);

	throws(
		function() {
			lightingBoard.AddLightToSelection(true);
		},
		TypeError,
		"AddLightToSelection expecting a string, not a boolean"
	);

	throws(
		function() {
			var obj = {};
			lightingBoard.AddLightToSelection(obj);
		},
		TypeError,
		"AddLightToSelection expecting a string, not an object"
	);

	throws(
		function() {
			var func = function() {};
			lightingBoard.AddLightToSelection(func);
		},
		TypeError,
		"AddLightToSelection expecting a string, not an function"
	);

});

test("RemoveLightFromSelection Valid Use Test", function() {
	// okay to remove a light that isn't there
	deepEqual(lightingBoard.GetSelectedLights(), {}, "No lights in list to start.");
	lightingBoard.RemoveLightFromSelection("4");
	deepEqual(lightingBoard.GetSelectedLights(), {}, "Still no lights in list to start.");
	
	// add new key and verify it is there
	lightingBoard.AddLightToSelection("4");
	deepEqual(lightingBoard.GetSelectedLights(), {"4":4}, "Added light now in list.");

	// now verify that remove really works
	// first test using wrong key to make sure doesn't delete wrong data
	lightingBoard.RemoveLightFromSelection("2");
	deepEqual(lightingBoard.GetSelectedLights(), {"4":4}, "Light hasn't been removed from list because wrong key");
	lightingBoard.RemoveLightFromSelection("4");
	deepEqual(lightingBoard.GetSelectedLights(), {}, "Light has been removed from list now");

});

test("RemoveLightFromSelection Invalid Use Test", function() {
	throws(
		function() {
			lightingBoard.RemoveLightFromSelection("1.4");
		},
		TypeError,
		"RemoveLightFromSelection expects a string that can parse to and integer"
	);

	throws(
		function() {
			lightingBoard.RemoveLightFromSelection(1);
		},
		TypeError,
		"RemoveLightFromSelection expecting a string, not a number"
	);

	throws(
		function() {
			lightingBoard.RemoveLightFromSelection(true);
		},
		TypeError,
		"RemoveLightFromSelection expecting a string, not a boolean"
	);

	throws(
		function() {
			var obj = {};
			lightingBoard.RemoveLightFromSelection(obj);
		},
		TypeError,
		"RemoveLightFromSelection expecting a string, not an object"
	);

	throws(
		function() {
			var func = function() {};
			lightingBoard.RemoveLightFromSelection(func);
		},
		TypeError,
		"RemoveLightFromSelection expecting a string, not an function"
	);

});

test("CreateSelectionHandlers test", function() {
	ok(false, "Not yet implemented");
});


})();







