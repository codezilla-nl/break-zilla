var MY = {};

MY.App = function () {};

MY.App.prototype = {
	init: function (canvas) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		var game = new MY.Game();
		var gesture = new MY.Gesture();
		game.init(canvas);
	}
};