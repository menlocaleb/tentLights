/* LightingBoard, the UI controller for Tent Lights */

// Namespace for TentLights app code
var TentLights = TentLights || {};

TentLights.LightingBoard = function(lightingController) {
	// Private Members
	// List of light ids that actions will apply to
	// example: { "1": 1, "3":3}
	var selections = {};



	//public properties
	// this stores and controls the actual lights in the scene
	this.controller = lightingController;

	// public methods
	this.GetSelectedLights = function() {
		return selections;
	}

	this.AddLightToSelection = function(id) {
		if (typeof(id) !== "string") {
			throw new TypeError("AddLightToSelection expects a string parameter");
		} else if (Number(id) !== parseInt(id)) {
			throw new TypeError("AddLightToSelection expects a string which can parse to an integer.");
		} else if (typeof(selections[id]) === "undefined") {
			// id not in selections yet
			selections[id] = parseInt(id);
		} // else, if duplicate do nothing
	}

	this.RemoveLightFromSelection = function(id) {
		if (typeof(id) !== "string") {
			throw new TypeError("RemoveLightFromSelection expects a string parameter");
		} else if (Number(id) !== parseInt(id)) {
			throw new TypeError("RemoveLightFromSelection expects a string which can parse to an integer.");
		} else if (typeof(selections[id]) !== "undefined") {
			delete selections[id];
		} 
		// else, if doesn't exist in object do nothing
	}
}

// This method is called right after creating lightingBoard in order for it to keep updated list of selected lights
// will attach click handlers to children of domParentId
TentLights.LightingBoard.prototype.CreateSelectionHandlers = function(className) {
	// store this variable before reset for jQuery block below
	var self = this;
	$(className).click(function() {
		var button = $(this);
		var lightId = button.attr("data-id");

		if (button.hasClass("selected")) {
			self.RemoveLightFromSelection(lightId);
		} else {
			self.AddLightToSelection(lightId);
		}

		button.toggleClass("selected");
				
	});
}

// This method is called from UI handling code, it bundles up an action request with the
// currently selected light ids and sends it to the lighting controller.
// actionParameters should have two fields
// action: one of 'pan', 'tilt', 'beamWidth', 'intensity', 'color'
// value: numeric (can be hex) value to pass to controller
TentLights.LightingBoard.prototype.SubmitLightingAction = function(actionParameters) {
	// TODO	
}


















