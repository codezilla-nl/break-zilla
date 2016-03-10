MY.Game = function () {};

MY.Game.prototype = {
	init: function (canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		this.initBall();
		this.initBricks();
		this.initPaddle();

		window.requestAnimationFrame(this.tick.bind(this));
	},

	initBall: function () {
		var radius = 10;

		this.ball = new MY.Ball(this.canvas.width / 2 - radius, this.canvas.height - (radius * 2) - 20, radius);
	},

	initBricks: function () {
		this.numberOfBrickRows = 5;
		this.numberOfBrickCols = 10;

		var padding = 10;
		var width = (this.canvas.width - ((this.numberOfBrickCols * padding) + padding)) / this.numberOfBrickCols;
		var height = 20 / 75 * width;

		this.bricks = [];
		for (var i = 0; i < this.numberOfBrickRows; i += 1) {
			this.bricks[i] = [];
			for (var j = 0; j < this.numberOfBrickCols; j += 1) {
				var x = (j * width) + ((j + 1) * padding);
				var y = (i * height) + ((i + 1) * padding);
				this.bricks[i][j] = new MY.Brick(x, y, width, height);
			}
		}
	},

	initPaddle: function () {
		var width = 75;
		var height = 10;

		this.paddle = new MY.Paddle((this.canvas.width - width) / 2, this.canvas.height - height - 10, width, height);
	},

	tick: function () {
		this.update();
		this.render();
	},

	update: function () {

	},

	render: function () {
		this.context.fillStyle = '#000000';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.renderBall();
		this.renderBricks();
		this.renderPaddle();
	},

	renderBall: function () {
		this.ball.render(this.context);
	},

	renderBricks: function () {
		for (var i = 0; i < this.numberOfBrickRows; i += 1) {
			for (var j = 0; j < this.numberOfBrickCols; j += 1) {
				this.bricks[i][j].render(this.context);
			}
		}
	},

	renderPaddle: function () {
		this.paddle.render(this.context);
	}
};