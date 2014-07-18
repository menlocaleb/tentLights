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
	// subclass THREE.SportLight
	THREE.SpotLight.call(this, hex, intensity);

	// store this so that private methods can use it 
	var me = this;

	// Private properties
	var lightGeometry = new THREE.CylinderGeometry( 0.5, 0.5, 1, 20);
	var lightMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );
	var lightBody = new THREE.Mesh( lightGeometry, lightMaterial );
	lightBody.position.z = -0.4;
	lightBody.rotation.x = Math.PI/2;
	this.add( lightBody );

	var animation = {
		animationType: "circle",
		clockwise: true 
	};

	var stepAngle = Math.PI/50;
	var stepTiltAngle = Math.PI/100;

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

	this.SetAnimation = function(animationObj) {
		if (typeof(animationObj) !== "object") {
			throw new TypeError("TentLights.Mover.SetAnimation expects an object");
		}
		if (animationObj.animationType !== undefined) {
			if (animationObj.animationType === "circle" || animationObj.animationType === "twirly") {
				animation.animationType = animationObj.animationType;
			} else {
				throw new RangeError("Unrecognized animation type");
			}
		}
		if (animationObj.clockwise !== undefined) {
			if (typeof(animationObj.clockwise) === "boolean") {
				animation.clockwise = animationObj.clockwise;
			} else {
				throw new TypeError("Animation.clockwise expects a boolean");
			}
		}
		
	}

	this.GetAnimationType = function() {
		return animation.animationType;
	}

	this.GetAnimationIsClockwise = function() {
		return animation.clockwise;
	}


	var animateLightCircle = function() {
		if (animation.clockwise) {
			me.pan = me.pan - stepAngle;
		} else {
			me.pan = me.pan + stepAngle;
		}
	}



	var animateLightCircleAndTilt = function() {
		if (animation.clockwise) {
			me.pan = me.pan - stepAngle;
		} else {
			me.pan = me.pan + stepAngle;
		}

		if (Math.abs(me.tilt + stepTiltAngle) > Math.PI/3) {
			stepTiltAngle = -1 * stepTiltAngle;
		}

		me.tilt = me.tilt + stepTiltAngle;	
		
	}


	this.Animate = function() {
		if (animation.animationType === "circle") {
			animateLightCircle();
		} else {
			animateLightCircleAndTilt();
		}
	}



};

TentLights.Mover.prototype = Object.create(THREE.SpotLight.prototype);


