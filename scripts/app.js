var MY = {};

MY.App = function () {};

MY.App.prototype = {
	init: function (canvas) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		var gesture = new MY.Gesture();

		var game = new MY.Game();
		game.init(canvas);
	}
};