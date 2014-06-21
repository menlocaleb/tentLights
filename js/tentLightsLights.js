/* Light classes for the Tent Lights app. */

// Namespace for TentLights app code
var TentLights = TentLights || {};

TentLights.reduceToWithinTwoPi = function(number) {
	var excess = (2*Math.PI)*Math.floor(Math.abs(number)/(2*Math.PI));
	excess = (number < 0) ? -excess : excess;
	return number - excess;
}

/* Specialized subclass of the THREE.SpotLight class */
TentLights.Mover = function(hex, intensity) {
	// Private properties

	// subclass THREE.SportLight
	THREE.SpotLight.call(this, hex, intensity);

	// Lock spot light target to -z axis of spotlight
	// Now spot light can be turned using rotation of spotlight
	this.target.position.z = -1; // new THREE.Vector3(0,0,-1);
	this.add(this.target);

	// For pan and tilt to work, Z rotation must come first
	this.rotation.order = "ZXY";

	// Make it a narrow beam
	this.angle = Math.PI/15;
	
	Object.defineProperties(this, {
		/*
		This accessor rotates the light around the z (vertical) axis. Units are Radians.
		NOTE - if no tilt, then won't see any change in light behavior.
		// This method restrics values to between -2pi and 2pi
		*/
		pan: {
			get: function() {
				return this.rotation.z;
			},
			set: function(value) {
				// For now allow over Math.PI radians, in future reduce
				if (typeof(value) === "number") {
					
					this.rotation.z = TentLights.reduceToWithinTwoPi(value);
				} else {
					throw new TypeError("TentLights.Mover.pan expects a number.");
				}
			}
		},
		/*
		This accessor rotates the light around the x (horizontal/east/west) axis. Units are Radians.
		Is clamped to +/- Math.PI/2
		*/
		tilt: {
			get: function() {
				return this.rotation.x;
			},
			set: function(value) {
				if (typeof(value) === "number") {
					// clamp value to +/- 90 degrees (can't go more than horizontal assuming default position is down)
					this.rotation.x = THREE.Math.clamp(value, -Math.PI/2, Math.PI/2);
					//console.log("Set tilt value" + THREE.Math.clamp(value, -Math.PI/2, Math.PI/2));
				} else {
					throw new TypeError("TentLights.Mover.tilt expects a number");
				}
			}
		}
	});

	// TODO
	// // ensure that no one can alter Euler angle order
	// Object.defineProperty(this.rotation, order, {
	// 	writeable: false
	// });



};

TentLights.Mover.prototype = Object.create(THREE.SpotLight.prototype);


