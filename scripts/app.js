var My = {};

My.app = function (options) {
    this.initialize(options);
};

My.app.prototype = {
    initialize: function(options) {
        //Extend options
        var defaults = {};
        this.options = jQuery.extend(defaults, options);


    }

    setup: function() {
    	this.initialize(this.options.friets);
    }
};

var appInstance = new My.app(options);