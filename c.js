(function(factory) {
if (typeof define === "function" && define.amd) {
	// AMD模式
	define(['jquery'], factory);
} else {
	// 全局模式
	factory(jQuery);
}
}(function($) {

	var view = {

		init: function(dom) {

		},

		show: function() {
			console.log(activityHtml);

		},
		hide: function() {

		}
}

function X(krpano, plugin) {}

X.prototype = {
	//edit: edit,
	view: view,
	show: null,
	hide: null
}

return X;
}))