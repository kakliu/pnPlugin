require.config({
	baseUrl : location.origin,
	paths : {
		'jquery' : '/depend/jquery/jquery',
		'qrcode' : '/depend/jquery.qrcode/dist/jquery.qrcode',
		'masonry' : '/depend/jquery.masonry/jquery.masonry.min',
		'template' : '/depend/template.js/template',
		'css' : '/depend/requirejs/css',
		'text' : '/depend/requirejs/text',
		'model' : '/depend/util/model',
		'krpanoPluginJs' : '/depend/util/krpano'
	}
});

define([ 'jquery', 'template', 'krpanoPluginJs','model','/map/default/edit/index.tpl.js',"css!/map/default/edit/index.css"], function($, template, krpanoPluginJs,model) {
	var listButton = {};

	function X(krpano, plugin) {
		this.init(krpano, plugin);
	}

	X.prototype = {
		init : function(krpano, plugin) {
			krpanoPluginJs.init(krpano, plugin);
			this.map = $("<div class='map'/>");
			krpanoPluginJs.addChilde(this.map);

			this.initLink();
			//this.initEdit();
			this.initLabel();
			this.initDelete();
		},
		addView: function(className, title, content){
			var obj = {};

			var button = $("<div class='map-i map-"+className + "'><i class='icon-"+className+"'/></div>").appendTo(this.map);

			if(title && content){
				var model = $("<div class='map-"+className + "-model'/>").appendTo(button).model({title:title,content: content,hasButton:false});

				button.find(".icon-"+className).click(function(){
					var _this = $(this).parents(".map-i");
					var map = _this.data("map");
					var name = _this.data("name");

					$.each(listButton, function(k, v){
						if(v.isShow && name != k){
							v.model.close();
							v.isShow = false;
						}
					})

					if(!map.isShow){
						map.model.open();
						map.isShow = true;
					}
				});

				obj.button = button;
				obj.model = model;
				obj.modelElement = model.element;
				obj.isShow = false;

				button.data("map", obj);
				button.data("name", className);
				listButton[className] = obj;

				button.on("close", function(){
					obj.isShow = false;
				})
			}


			return button;
		},
		bindEvent: function(className, eventName, fn){
			listButton[className].modelElement.on(eventName, fn);
		},
		initLink: function(){
			var scenes = krpanoPluginJs.getScene();

			var html = $("<ul/>");

			for(var i = 0 in scenes){
				$("<li/>").appendTo(html).html(scenes[i].title).data("scene",scenes[i]);
			}

			this.addView("link", "选择连接场景", html);
		},
		initLabel: function(){
			var scenes = krpanoPluginJs.getScene();

			var html = $("<ul/>");

			for(var i = 0 in scenes){
				$("<li/>").appendTo(html).html(scenes[i].title).data("scene",scenes[i]);
			}

			this.addView("label", "选择连接场景", html);
		},
		initEdit: function(){
			var scenes = krpanoPluginJs.getScene();

			var html = $("<ul/>");

			for(var i = 0 in scenes){
				$("<li/>").appendTo(html).html(scenes[i].title).data("scene",scenes[i]);
			}

			this.addView("edit", "选择连接场景", html);
		},
		initDelete: function(){
			this.addView("delete");
		},
		uploadMap: function(){
			$.ajaxFileUpload({
				type: "post",
		        url: "/file/upload",
		        secureuri: false, //是否需要安全协议，一般设置为false
		        fileElementId: 'upload-file', //文件上传域的ID
		        dataType: "json",
		        data:{
		        	
		        },
		        success: function(result){
		        	if(result.success){
			        	var urls = [];
	                    $.each(result.files, function(i,v) {
	                        urls.push(v.url);
	                    });
					    $.ajax({
							type: "post",
					        url: "/panomap/add",
					        dataType: "json",
					        data:{
					        	urls:urls,
					        	panoId: panoId
					        },
					        success: function(result2){
					        	if(result2.success){
					        		
					        	}
					        	else{
					        		layer.msg(result2.errmsg);
					        	}
					        }
					    })
		        	}
		        	else{
		        		layer.msg(result.errmsg);
		        	}
		        }
		    })
		},
		deleteMap: function(){
			$.ajax({
				type: "post",
		        url: "/panomap/deleteSubmap",
		        dataType: "json",
		        data:{
		        	submapId: 1
		        },
		        success: function(result){
		        	if(result.success){
		        		
		        	}
		        	else{
		        		layer.msg(result.errmsg);
		        	}
		        }
			})
		},
		updateMap: function(){
			$.ajax({
				type: "post",
		        url: "/panomap/updateSubmap",
		        dataType: "json",
		        data:{
		        	id: 1,
		        	name: 1,
		        	sortIndex:1
		        },
		        success: function(result){
		        	if(result.success){
		        		
		        	}
		        	else{
		        		layer.msg(result.errmsg);
		        	}
		        }
			})
		},
		addRadar: function(){
			$.ajax({
				type: "post",
		        url: "/panomap/addMapradar",
		        dataType: "json",
		        data:{
		        	heading: 1,
		        	name: 1,
		        	x: 1,
		        	y: 1,
		        	sceneId: 1,
		        	mapId: 1
		        },
		        success: function(result){
		        	if(result.success){
		        		krpanoPluginJs.addRadar(element,scenename);
		        	}
		        	else{
		        		layer.msg(result.errmsg);
		        	}
		        }
			})
		},
		updateRadar: function(){
			$.ajax({
				type: "post",
		        url: "/panomap/updateMapradar",
		        dataType: "json",
		        data:{
		        	id: 1,
		        	name: 1,
		        	x: 1,
		        	y: 1,
		        	sceneId: 1
		        },
		        success: function(result){
		        	if(result.success){
		        		
		        	}
		        	else{
		        		layer.msg(result.errmsg);
		        	}
		        }
			})
		},
		deleteRadar: function(){
			$.ajax({
				type: "post",
		        url: "/panomap/deleteMapradar",
		        dataType: "json",
		        data:{
		        	mapradarId: 1,
		        },
		        success: function(result){
		        	if(result.success){
		        		
		        	}
		        	else{
		        		layer.msg(result.errmsg);
		        	}
		        }
			})
		}
	}

	return X;
});