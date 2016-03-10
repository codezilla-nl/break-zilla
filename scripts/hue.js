MY.Hue = function () {};

MY.Hue.prototype = {
	setOn: function (on, lightId) {
		fetch(this.getUrl(lightId), {
			method: 'put',
			body: {'on': on}
		});
	},

	setHue: function (hue, lightId) {
		fetch(this.getUrl(lightId), {
			method: 'put',
			body: {
				'hue': hue,
				'bri': 10,
				'sat': 250
			}
		});
	},

    getUrl: function (lightId) {
        return 'http://10.1.2.152/api/c29b99563dd14f752873ce711f9fe7c/lights/' + lightId + '/state';
    }
};