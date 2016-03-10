MY.Gesture = function () {
	this.initialize();
};

MY.Gesture.prototype = {
	initialize: function() {
		//Extend options
		this.options = {
			paused: false
		};
		this.constants = {
			previousFrame: null,
			paused: false,
			pauseOnGesture: false,
			hand: {}
		}

		this.setup();
	},

	setup: function() {
		var controllerOptions = { 
			enableGestures: true 
		};

		var that = this;
		Leap.loop(controllerOptions, function(frame) {
			if (that.options.paused) {
				return;
			}

			that.processHand(frame);
			
			var position = (that.constants.hand.direction) ? that.constants.hand.direction[0] : false;
			MY.PubSub.publish('updatePosition', position);

			previousFrame = frame;
		});
	},

	processHand: function(frame) {
		var hand = {};
		if (frame.hands.length > 0) {
			for (var i = 0; i < frame.hands.length; i++) {
				var hand = frame.hands[i];

				hand["ID"] = hand.id;
				hand["Type"] = hand.type;
				hand["direction"] = hand.direction;
			}
		}
		else {
			hand = {};
		}

		this.constants.hand = hand;
	},

	// broadcastPosition: function() {
	// 	if (this.constants.hand.direction) {
	// 		MY.PubSub.publish('handPosition', this.constants.hand.direction[0]);
	// 	}
	// },

	// updateSlider: function() {
	// 	if (this.constants.hand.direction) {
	// 		var handle = document.querySelector('.slider--handle');
	// 		handle.style.left = (this.constants.hand.direction[0] * 75) + 30 + "%"; //offset 30%, multiply by 75% (would expect best results)
	// 	}
	// },

	vectorToString: function(vector, digits) {
		if (typeof digits === "undefined") {
			digits = 1;
		}
		return "(" + vector[0].toFixed(digits) + ", "
				 + vector[1].toFixed(digits) + ", "
				 + vector[2].toFixed(digits) + ")";
	},

	togglePause: function() {
		paused = !paused;

		if (paused) {
			document.getElementById("pause").innerText = "Resume";
		} else {
			document.getElementById("pause").innerText = "Pause";
		}
	},

	pauseForGestures: function() {
		if (document.getElementById("pauseOnGesture").checked) {
			pauseOnGesture = true;
		} else {
			pauseOnGesture = false;
		}
	}
};


