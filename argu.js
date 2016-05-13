requirejs.config({
	paths: {
		c: 'c'
	}
});

var obj = {};
var krpano = "a"
var plugin = "b"

requirejs(['c', 'd', 'e'], function() {
	for (var i = 0, len = arguments.length; i < len; i++) {
		if (typeof arguments[i] === 'function') {
			obj[i] = new arguments[i](krpano, plugin);
		}

	}
	for(var i in obj) {
		// var a = new obj[i]
		console.log(obj[i].view.init());
	}

	console.log(obj);
});