(function(factory) {
	if (typeof define === "function" && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	var view = {
		init: function(dom) {
			console.log("ok is bbbb");
		},
		show: function() {
			console.log(activityHtml);
		},
		hide: function() {}
	}

	function X() { console.log("is bbb.js ------------");}
	X.prototype = {
		view: view,
		show: null,
		hide: null
	}
	return X;
}))