MY.Game = function () {};

MY.Game.prototype = {
	init: function (canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		window.requestAnimationFrame(this.tick.bind(this));
	},

	tick: function (deltaTime) {
		this.update();
		this.render();
	},

	update: function () {

	},

	render: function () {
		this.context.fillStyle = '#000000';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
};