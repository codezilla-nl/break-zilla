var MY = {};

MY.App = function () {};

MY.App.prototype = {
	init: function (canvas) {
		var game = new MY.Game();
        game.init(canvas);
	}
};