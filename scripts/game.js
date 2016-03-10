MY.Game = function () {};

MY.Game.prototype = {
	init: function (canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		this.moveX = 0;

		this.deltaX = 2;
		this.deltaY = -2;

		this.lives = 3;
		this.colorsLives = [0, 12750, 25500];

		this.hue = new MY.Hue();
		this.hue.setOn(true, 3);
		this.hue.setHue(this.colorsLives, this.lives - 1);

		this.initBall();
		this.initBricks();
		this.initPaddle();

		MY.PubSub.subscribe('updatePosition', this.onUpdatePosition, this);

		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));

		window.requestAnimationFrame(this.tick.bind(this));
	},

	initBall: function () {
		var radius = 10;

		this.ball = new MY.Ball(this.canvas.width / 2 - radius, this.canvas.height - (radius * 2) - 20, radius);
	},

	initBricks: function () {
		var padding = 10;
		
		this.brickRowCount = 5;
		this.brickColumnCount = 10;
		this.brickWidth = (this.canvas.width - ((this.brickColumnCount * padding) + padding)) / this.brickColumnCount;
		this.brickHeight = 20 / 75 * this.brickWidth;

		this.bricks = [];
		for (var i = 0; i < this.brickRowCount; i += 1) {
			this.bricks[i] = [];
			for (var j = 0; j < this.brickColumnCount; j += 1) {
				var x = (j * this.brickWidth) + ((j + 1) * padding);
				var y = (i * this.brickHeight) + ((i + 1) * padding);
				this.bricks[i][j] = new MY.Brick(x, y, this.brickWidth, this.brickHeight);
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

		window.requestAnimationFrame(this.tick.bind(this));
	},

	update: function () {
		this.collisionDetection();

		if (this.ball.x + this.deltaX > this.canvas.width - this.ball.radius || this.ball.x + this.deltaX < this.ball.radius) {
			this.deltaX = -this.deltaX;
		}
		if (this.ball.y + this.deltaY < this.ball.radius) {
			this.deltaY = -this.deltaY;
		}
		else if (this.ball.y + this.deltaY > this.canvas.height - this.ball.radius) {
			if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
				this.deltaY = -this.deltaY;
			} else {
				this.decreaseLives();
				this.ball.x = this.canvas.width / 2;
				this.ball.y = this.canvas.height - 30;
				this.deltaX = 3;
				this.deltaY = -3;
				this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
			}
		}

		this.ball.x += this.deltaX;
		this.ball.y += this.deltaY;

		if (this.moveX < 0 && this.paddle.x - 10 >= 0) {
			this.paddle.x -= 10;
		}
		if (this.moveX > 0 && this.paddle.x + 10 <= this.canvas.width - this.paddle.width) {
			this.paddle.x += 10;
		}
	},

	collisionDetection: function () {
		for (var i = 0; i < this.brickRowCount; i += 1) {
			for (var j = 0; j < this.brickColumnCount; j += 1) {
				var brick = this.bricks[i][j];
				if (brick.state === 1) {
					if (this.ball.x > brick.x && this.ball.x < brick.x + brick.width && this.ball.y > brick.y && this.ball.y < brick.y + this.brickHeight) {
						this.deltaY = -this.deltaY;
						brick.state = 0;
					}
				}
			}
		}
	},

	decreaseLives: function () {
		this.lives -= 1;
		this.hue.setHue(this.colorsLives[this.lives - 1], 3)
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
		for (var i = 0; i < this.brickRowCount; i += 1) {
			for (var j = 0; j < this.brickColumnCount; j += 1) {
				var brick = this.bricks[i][j];
				if (brick.state === 1) {
					brick.render(this.context);
				}
			}
		}
	},

	renderPaddle: function () {
		this.paddle.render(this.context);
	},

	onUpdatePosition: function (x) {
		this.moveX = x || 0;
	},

	onKeyDown: function (event) {
		if (event.which === MY.Key.LEFT) {
			this.moveX = -1;
		} else if (event.which === MY.Key.RIGHT) {
			this.moveX = 1;
		}
	},

	onKeyUp: function (event) {
		if (event.which === MY.Key.LEFT || event.which === MY.Key.RIGHT) {
			this.moveX = 0;
		}
	}
};