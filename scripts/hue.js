MY.Hue = function () {
    this.url = 'http://10.1.2.152/api/c29b99563dd14f752873ce711f9fe7c/lights/3/state';
};

MY.Hue.prototype = {
    setOn: function (on) {
        fetch(this.url, {
            method: 'put',
            body: {'on': on}
        })
    },
    setHue: function (color) {
        fetch(this.url, {
            method: 'put',
            body: {'hue': color}
        })
    }
};
