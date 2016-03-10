MY.Ball = function (x, y, radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = '#59a62c';
};

MY.Ball.prototype = {
	update: function () {

	},

	render: function (context) {
		context.beginPath();
		context.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
		context.closePath();
	}
};