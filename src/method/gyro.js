(function(window, undefined) {
	var funs = {};
	funs.open = function() {
		this.krpano.call("switch_gyro(1);");
	};
	funs.close = function() {
		this.krpano.call("switch_gyro(0);");
	};

	YP.extend.gyro = YP.callback(funs);
})(window)