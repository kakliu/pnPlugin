/*
    krpanoJS javascript plugin example / template
 */

var krpanoplugin = function() {
	var local = this; // save the 'this' pointer from the current plugin
						// object

	var krpano = null; // the krpano and plugin interface objects
	var plugin = null;

	var plugincanvas = null; // optionally - a canvas object for graphic
								// content
	var plugincanvascontext = null;

	var basePath = window.location.origin;
	var isDebug;
	var skinSettings;

	// registerplugin - startup point for the plugin (required)
	// - krpanointerface = krpano interface object
	// - pluginpath = string with the krpano path of the plugin (e.g.
	// "plugin[pluginname]")
	// - pluginobject = the plugin object itself (the same as: pluginobject =
	// krpano.get(pluginpath) )
	local.registerplugin = function(krpanointerface, pluginpath, pluginobject) {
		krpano = krpanointerface;
		plugin = pluginobject;

		var requireL;

		plugin.bgcapture = true;
		plugin.type = "container";
		skinSettings = krpano.skin_settings;

		if (!window.requirejs) {
			var head = document.getElementsByTagName('HEAD').item(0);
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "/require.js";
			script.async = false;

			script.onload = function() {
				startUp(krpanointerface, pluginpath, pluginobject);
			}

			head.appendChild(script);
			return;
		} else {
			startUp(krpanointerface, pluginpath, pluginobject);
		}
	}

	function startUp(krpanointerface, pluginpath, pluginobject) {
		setTimeout(function(){
			window.require([ 'jquery', pluginobject.js, 'applicationContext'], function($, index, ac) {

				var fn = new index(krpanointerface, pluginobject);

				var pluginTypes = skinSettings.plugin_types.replace(/\s/g, "");
				pluginTypes = !pluginTypes ? ['plugin_base'] : pluginTypes.split(",");

				var plugins = ac.getPluginByType(pluginTypes);
				console.log(plugins);
				
				for(var i =0; i < plugins.length; i++) {
					var flag = krpano.get("skin_settings.isedit") == 'true'?true:false;
					
					var plugin = plugins[i].fn;
					var pluginFn = plugins[i].viewFn;
					
					console.log(plugins[i].name, pluginFn && pluginFn.isAddPlugin);
					if(!pluginFn) {
						continue;
					} else if(pluginFn && pluginFn.isAddPlugin == false){
						pluginFn.init(dom);
						continue;
					}
					
					var op = pluginFn.options?$.extend(true, {}, pluginFn.options):{};
					
					op.icon = plugins[i].icon;
					
					op.oldIcon = plugins[i].icon;
					op.name = plugins[i].name;
					op.isedit = flag;
					op.plugin = pluginFn;
					
					if(pluginFn.options){
						if(pluginFn.options.icon){
							op.icon = pluginFn.options.icon;
						}

						if(pluginFn.options.content){
							if(typeof pluginFn.content === "function"){
								op.content = pluginFn.options.content();
							} else {
								op.content = pluginFn.options.content;
							}
						}

						if(pluginFn.options.realTimeClick){
							op.realTimeClick = true;
						}
					}
					
					var dom = fn.addPlugin(op);

					var eventConfig = krpano.get("events[skin_events]");


					eventConfig.onmousedown = function(){
						var u = navigator.userAgent;
						var isMb = !!u.match(/AppleWebKit.*Mobile.*/);
						var isPad = u.indexOf('iPad') > -1;
						if(!isMb || isPad) {
							fn.hideAll();
						}
					}						

					//初始化
					pluginFn.init(dom);
					
					if(!op.content && !fn.initFn){
						dom.data("plugin", pluginFn);
						
						dom.click(function(){
							$(this).data("plugin").show();
						})
					}
				}
			});
		});
	}

	// hittest - test for clicks on the plugin (optionally)
	// - when the plugin has a graphical irregular shape then it's possible to
	// check here for mouse clicks on it
	// - the typical usage is to check for a hit on the canvas element
	local.hittest = function(x, y) {
		if (plugincanvascontext) {
			return plugincanvascontext.isPointInPath(x, y);
		}

		return false;
	}

	// onresize - the plugin was resized from xml krpano (optionally)
	// - width,height = the new size for the plugin
	// - when not defined then only the parent html element will be scaled
	local.onresize = function(width, height) {
		// not used in this example

		return false;
	}

	var winWidth = window.innerWidth;
	var winHeight = window.innerHeight;
	var bgWidth = Math.min(winWidth, 600);
	var bgHeight = Math.min(winHeight, 470);
	var bgX = winWidth - bgWidth >> 1;
	var bgY = winHeight - bgHeight >> 1;
	var imgList = new Array;
	var bigHotarea;
	var index = 0;
	var THUMB_W = 60;
	var THUMB_H = 60;
	var BIGTHUMB_W = 380;
	var BIGTHUMB_H = 380;
	var productInfo;

	function hotspotclickhandler(prId) {
		// var url = "http://goods.duc.cn/getGoodsById?id="+prId;
		// krpano.loadFile("/getGoodsById?id="+prId);
		window.jQuery.ajax({

			url : "http://goods.duc.cn/getGoodsById?id=" + prId,
			success : function(data) {
				window.jQuery("body").append(data);
			}
		})
	}

	// 后台数据加载完成
	function donecallback(obj) {
		alert("data:" + obj.data);
		if (obj.success) {

			productInfo = obj.data;
			imgList = productInfo.imageContent;

			index = -1;
			drawThumbList();
			if (imgList.length > 0)
				drawBigItem(imgList[0].image);
			drawText();
		}
	}

	// 画缩略图
	function drawThumbList() {
		if (index < imgList.length - 1) {
			index++;
			drawThumbItem();
		}
	}

	// 循环画单个缩略图
	function drawThumbItem() {
		var img = new Image();
		img.src = imgList[index].thumb;
		if (img.complete) {
			plugincanvascontext.drawImage(img, bgX + 10 + index
					* (THUMB_W + 10), bgY + bgHeight - THUMB_H - 10, THUMB_W,
					THUMB_H);
			drawThumbList();
		} else {
			img.onload = function() {
				plugincanvascontext.drawImage(img, bgX + 10 + index
						* (THUMB_W + 10), bgY + bgHeight - THUMB_H - 10,
						THUMB_W, THUMB_H);
				drawThumbList();
			};
			img.onerror = function() {
				alert("缩略图加载失败");
			};
		}
		;
	}

	function drawBigItem(url) {
		var img = new Image();
		img.src = url;// imglist[index].thumb;
		if (img.complete) {
			plugincanvascontext.fillStyle = "rgba(255,255,255,1)";
			plugincanvascontext.fillRect(bgX + 10, bgY + 10, BIGTHUMB_W,
					BIGTHUMB_H);
			plugincanvascontext.drawImage(img, bgX + 10, bgY + 10, BIGTHUMB_W,
					BIGTHUMB_H);
		} else {
			img.onload = function() {
				plugincanvascontext.fillStyle = "rgba(255,255,255,1)";
				plugincanvascontext.fillRect(bgX + 10, bgY + 10, BIGTHUMB_W,
						BIGTHUMB_H);
				plugincanvascontext.drawImage(img, bgX + 10, bgY + 10,
						BIGTHUMB_W, BIGTHUMB_H);
			};
			img.onerror = function() {
				alert("大图加载失败");
			};
		}
		;
		bigHotarea = {
			x : bgX + 10,
			y : bgY + 10,
			w : BIGTHUMB_W,
			h : BIGTHUMB_H
		};
	}

	var beginWidth;
	var beginHeight;
	// 画文本
	function drawText() {
		plugincanvascontext.font = "22px Arial";
		plugincanvascontext.fillStyle = 'black';
		draw_long_text(productInfo.name, plugincanvascontext, bgX + BIGTHUMB_W
				+ 20, bgY + 30);
		// plugincanvascontext.fillText("Big smile!Big smile!Big smile!Big
		// smile!Big smile!", bgX+BIGTHUMB_W+20, bgY+40);

		begin_height = begin_height + 25;

		plugincanvascontext.font = "16px Arial";
		plugincanvascontext.fillStyle = 'red';
		plugincanvascontext.fillText("价格：" + productInfo.maxPrice, bgX
				+ BIGTHUMB_W + 20, begin_height);
	}

	function draw_long_text(longtext, cxt, beginWidth, beginHeight) {
		var linelenght = 9;
		var text = "";
		var count = 0;
		begin_width = beginWidth;
		begin_height = beginHeight;
		var stringLenght = longtext.length;
		var newtext = longtext.split("");
		var context = cxt;
		// context.clearRect(0,0, 600,300);
		context.textAlign = 'left';

		for (i = 0; i <= stringLenght; i++) {
			if (count == linelenght) {
				context.fillText(text, begin_width, begin_height);
				begin_height = begin_height + 25;
				text = "";
				count = 0;
			}
			if (i == stringLenght) {
				context.fillText(text, begin_width, begin_height);
			}
			var text = text + newtext[0];
			count++;
			newtext.shift();
		}
	}

	function errorcallback(obj) {
		alert("error load:" + obj.errmsg);
	}

	// 鼠标事件
	function doMouseDown(event) {
		var x = event.pageX;
		var y = event.pageY;
		// var canvas = event.target;
		// var loc = getPointOnCanvas(canvas, x, y);
		// alert("doMouseDown:"+x+" "+y);
		for ( var i = 0; i < imgList.length; i++) {
			if (y > bgY + bgHeight - THUMB_H - 10
					&& y < bgY + bgHeight - THUMB_H - 10 + THUMB_H
					&& x > bgX + 10 + i * (THUMB_W + 10)
					&& x < bgX + 10 + i * (THUMB_W + 10) + THUMB_W) {
				// alert("hit:"+i);
				drawBigItem(imgList[i].image);
			}
		}
	}

	function doMouseMove(event) {
		// alert("doMouseMove");
		var x = event.pageX;
		var y = event.pageY;
		var canvas = event.target;
		// var loc = getPointOnCanvas(canvas, x, y);

	}

	function doMouseUp(event) {
		// alert("doMouseUp");
		// console.log("mouse up now");

	}

	// show gallery
	function image_hotspot_click_handler(galleryData) {
		// console.log(galleryData);
		var $ = window.$;
		// var galleryData = "2015/07/24/15798927.jpg, 2015/07/24/61309627.jpg,
		// 2015/07/24/39345989.jpg, 2015/07/24/83239669.jpg";

		// console.log("image_hotspot_click_handler from js");

		$(document.body)
				.append(
						"<div class='content' style='position:absolute;top:0;left:0;width:100%;height:100%;z-index:10001'><div>");
		$("div.content").attr("data-pic", galleryData);
		$(".content").load("./photo/photoalbum.html");

	}

	function initJquery() {
		if (!window.$) {
			var ga = document.createElement('script');
			ga.type = 'text/javascript';
			ga.async = false;
			ga.src = "/jquery.js";
			document.body.appendChild(ga);

			return window.$;
		}
	}

	initJquery();
};
