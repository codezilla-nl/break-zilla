MY.Paddle = function (x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = '#0095DD';
};

MY.Paddle.prototype = {
	update: function () {

	},

	render: function (context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};