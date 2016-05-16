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
	for (var i in obj) {
		// var a = new obj[i]
		console.log(obj[i].view.init());
	}
	var start_time = new Date().getTime();

	// 图片地址 后面加时间戳是为了避免缓存
	var img_url = 'http://img5.pcpop.com/ArticleImages/picshow/0x0/20140717/2014071715184382308.jpg?' + Date.parse(new Date());

	// 创建对象
	var img = new Image();

	// 改变图片的src
	img.src = img_url;

	// 定时执行获取宽高
	var check = function() {
		// 只要任何一方大于0
		// 表示已经服务器已经返回宽高
		if (img.width > 0 || img.height > 0) {
			var diff = new Date().getTime() - start_time;
			document.body.innerHTML += 'from:check : width:' + img.width + ',height:' + img.height + ', time:' + diff + 'ms';
			clearInterval(set);
		}
	};

	var set = setInterval(check, 40);

	// 加载完成获取宽高
	img.onload = function() {
		var diff = new Date().getTime() - start_time;
		document.body.innerHTML += 'from:onload : width:' + img.width + ',height:' + img.height + ', time:' + diff + 'ms';
	};
	console.log(obj);
});