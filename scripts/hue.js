MY.Hue = function () {
    this.url = function (lightID) {
        return 'http://10.1.2.152/api/c29b99563dd14f752873ce711f9fe7c/lights/' + lightID + '/state';
    };
};

MY.Hue.prototype = {
    setOn: function (on, lightID) {
        fetch(this.url(lightID), {
            method: 'put',
            body: {'on': on}
        })
    },

    setHue: function (color, lightID) {
        fetch(this.url(lightID), {
            method: 'put',
            body: {'hue': color}
        })
    }
};
