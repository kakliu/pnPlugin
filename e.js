(function(factory) {
	if (typeof define === "function" && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	console.log($);
	var view = {
		init: function(dom) {
			console.log("ok is init");
			return false;
		},
		show: function() {
			console.log(activityHtml);
		},
		hide: function() {}
	}

	function X(krpano, plugin) {
		console.log("is e.js");
	}
	X.prototype = {
		view: view,
		show: null,
		hide: null
	}
	return X;
}))