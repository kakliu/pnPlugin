(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
			'jquery', 
			'template', 
			'krpanoPluginJs',
			'proxy',
			'iscroll',			
		    'p/map/default/edit/index.tpl',
			'p/map/default/edit/viewMap.tpl',
			"css!p/map/default/edit/index",
			'move',
		    'jquery.fileupload',
		    'jquery.fileupload-validate',
		    'jquery.fileupload-image',
		    'load-image',
		    'depend/scrollBar/jquery.mCustomScrollbar.concat.min',
    		'css!depend/scrollBar/jquery.mCustomScrollbar.min',
	        'sortable'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy, IScroll);
    }
}(function($, template, krpanoPluginJs, proxy,IScroll){
	var hotspot = proxy.domain + "/images/point.png";
	var selectHotspot = proxy.domain +  "/images/point_click.png";
	var icon = "<div class='icon'><i/><div class='radar/></div>"
	var element;
	var self;
	var currselect;
	var spotList = [];
	var scenes = {};
	var currMap;
	var oldMap;
	var isLoad = false;
	var sceneHtml='<span class="link-font">连接场景</span><select class="choose-sence"><%for(var i = 0;i<scene.length;i++){%><option value="<%=scene[i].name%>"><%=scene[i].title%></option><%}%></select>';
	
	var maps = [{
		id:1,
		name:'客厅',
        url: "http://localhost:9090/flash/krpanoPluginTest/bin-debug/testResources/map.png",
        radar: [{
        	id: 123,
        	name: 'ork36mqx',
        	x: 214,
        	y: 342,
        	r: 12.24
        }],
	},
    {
		id:2,
		name:'厨房',
        url: "/images/123.png",
        radar: [{
        	id: 123,
        	name: 'ork36mqx',
        	x: 314,
        	y: 442,
        	r: 12.24
        }]
	}];
	
	var currMap;
	
	var edit = function() {
		self = this;
	}
	
	edit.prototype = {
		options:{
			icon: "/v2.0/images/mapImg.png",
			content: function(){
				proxy.mapsGet({
					panoId: panoId,
					async: false
				}, function(data){
					if(!data.success){
						msg(data.errMsg);
					}
					
					if(data.data) {
						maps = data.data;
					} else {
						maps = [];
					}
				});
				
				var content = $("<div class='plugin-map'/>").append("<div class='plugin-map-upload'><input type='file' name='file' class='plugin-map-uploadfile' multiple/><i></i>添加平面图</div>");
				var list = self.mapList = $("<div class='plugin-map-list'/>").appendTo(content)
				var ul = self.mapListUl = $("<ul/>").appendTo(list);
				
				self.upload = content.find(".plugin-map-upload");
				self.uploadFile = content.find(".plugin-map-uploadfile");
				
				var index = 0;
				
				for(var i =0;i < maps.length; i++){
					var li = $("<li><i class='drap'></i><span class='left-bor'></span><input type='text' readonly maxlength='18' class='plugin-map-name' value='"+maps[i].name+"'/><i class='delet-btn'></i><i class='bj-common editName'></i><i class='bj-common save-com'></i></li></li>").appendTo(ul).data(maps[i]);
					index++;
					
					self.initMapListInit(li);
				}
				
				list.css("height", index * 43);
				
				return content;
			}
		},
		initMapListInit: function(li){
			li.click(function(e){
				if(($(e.target).is("input") && !$(e.target).attr("readonly"))){
					return;
				}
				
				var map = $(li).data();
				
				if(map && map.id){
					self.show($(this).data());
				}
			});
			li.find(".plugin-map-name").keyup(function(){
		        if(event.keyCode == 13){
					li.find(".save-com").click();
		        }
		    });	
			li.find(".editName").click(function(e){
				e.stopPropagation();
				var edit = li.find(".editName");
				var map = li.data();
				
				edit.hide();
				li.find(".save-com").show();
				li.find(".plugin-map-name").attr("readonly", false).focus().select();
				
				return false;
			});
			
			li.find(".save-com").on("click", function(e){
				e.stopPropagation();
				
				self.editMap($(this).parents("li:eq(0)"));
				
				return false;
			});

			li.find(".delet-btn").click(function(e){
				e.stopPropagation();
				var curr = this;
				var map = $(li).data();
				
				if(map && map.id){
					layer.open({
						title: '你确定要删除该地图吗',
						skin:'map-delet',
						closeBtn: 0,
						btn: ['确认', '取消'],
						yes: function(index, layero){
							self.deleteMap($(curr).parents("li:eq(0)"));
							layer.close(index);
						}
					})
				} else {
					self.deleteMap($(curr).parents("li:eq(0)"));
				}
				
				return false;
			});
		},
		editMap: function(li){
			var map = $(li).data();
			var edit = li.find(".editName");
			map.name = li.find(".plugin-map-name").val();
			
			if(map.id) {
				proxy.mapUpdate({
					id: map.id,
					name: map.name
				}, function(data){
					if(!data.success){
						msg(data.errMsg);
						return;
					}

					li.find(".save-com").hide();
					edit.show();
					li.find(".plugin-map-name").attr("readonly", true);
				})
			}
			
		},
		deleteMap: function(li){
			var map = li.data();
			
			var deleteLi = function(){
				setTimeout(function(){
					li.animate({ left: li.outerWidth()}, "slow", function(){
						li.remove();
					});
				}, 1000);
			}
			
			if(map.id) {
				proxy.mapDelete({
					submapId: map.id
				}, function(data){
					if(!data.success){
						msg(data.errMsg);
						return;
					}
					
					deleteLi();
				})
			} else {
				deleteLi();
			}
		},
		getNewMap: function(name, url){
			var map = {};
			map.name = name;
			map.url = url;
			map.radar = [];
			
			return map;
		},
		getScene: function(name){
			var temp = [];
			var tempScene = {};

			$("#multi .sucaijiayuan-list li").each(function(i){
				var obj = {};

				obj.id = $(this).data("id");
				obj.name = $(this).data("pid");
				obj.title = $(this).find(".editCommon").val();

				if(obj.name == name){
					tempScene = obj;
				}

				temp.push(obj);
			});

			if(name){
				return tempScene
			} else {
				return temp;
			}
		},
		init: function(dom){
			var data = {};

        	var scenes = this.getScene();
        	var sceneElement = $(template(sceneHtml, {scene: scenes}));

			element = self.element = $(template(roamingmap, {}));
			element.find(".link-sence").append(sceneElement);
			krpanoPluginJs.addChilde(element, true);

			self.logger = element.find(".logger");
			self.aRot = element.find(".aad-rot");
			self.dMap = element.find(".delet-map");
			self.dRot = element.find(".delete-rot");
			self.cRot = element.find(".change-rot");
			self.img = element.find(".content-left .fileList img");
			self.fileList = element.find(".content-left .fileList");
			self.selectScene = element.find(".chosed-scence");
			
			
			self.select = self.element.find(".choose-sence");
			self.inputX = self.element.find(".x-coordinatex");
			self.inputy = self.element.find(".y-coordinatex");
			self.inputRadar = self.element.find(".radar-num");
			
			
			krpanoPluginJs.setEventRadar("mousemove", self.setAngle);
			krpanoPluginJs.setEventRadar("mouseup", self.setRadarMouseup);
			krpanoPluginJs.setEventRadar("mousedown", self.setRadarMousedown);
			
			//滚动条
			$(".plugin-map-list").mCustomScrollbar({
				setHeight: 140,
			    theme: "minimal"
			});

			//场景切换下拉展开
			self.element.on("click",".change-rot",function(){
				var spotObj = self.getSpotIndex(currselect);
				
				if(!spotObj) {
					msg("请选择热点后切换");
					return;
				}
				
				var cur = this;
				var ul = $(cur).siblings(".chosed-scence");
				if(ul.css("display")=="none"){
					ul.slideDown("fast");
				}else{
					ul.slideUp("fast");
				}
			});
			
			self.initSortIndex();
			self.initSelectScene();
			self.uploadFile.fileupload({
	        	url: proxy.url.fileuoload,
	        	dataType:"json",
				maxFileSize: 1000000, // 5 MB
	        	type:"post",
	            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/,
				messages: {
		            maxNumberOfFiles: '已超过上传最大数',
		            acceptFileTypes: '文件类型不允许',
		            maxFileSize: '文件太大',
		            minFileSize: '文件太小了'
		        },
				formData: proxy.updateDate().data
	        }).on('fileuploadadd', function (e, data) {
	        	data.context = [];
	        	$.each(data.files, function(i, file){
	        		data.context[i] = $("<li><i class='drap'></i><span class='left-bor'></span><input type='text' readonly maxlength='9' class='plugin-map-name' value='" + file.name +"'/><i class='delet-btn'></i><i class='bj-common editName'></i><i class='bj-common save-com'></i><div class='progress progress-striped active fade in'><div class='progress-bar'/></div></li>").appendTo(self.mapListUl);
	        		$(".plugin-map-list").mCustomScrollbar("scrollTo", "bottom");
	        		data.context[i].data(self.getNewMap(file.name));
	        		
	        		data.context[i].find(".edidtName").click(function(){
	        			self.editMap($(this).parents("li:eq(0)"));
	        		});
	        		
					self.initSortIndex();
	        		//停止上传
	        		data.context[i].find(".delet-btn").click(function(){
	        			data.abort();

						self.deleteMap($(this).parents("li:eq(0)"));
	        		});
	        	});
	        }).on('fileuploadprocessalways', function (e, data) {
	        	$.each(data.files, function(i, file){
	                if(file.error) {
	                	msg(file.error);
		            	self.deleteMap(data.context[i]);
	                }
	        	})
	        }).on('fileuploadprogress', function (e, data) {
	        	$.each(data.files, function(i, file){
		            var progress = parseInt(data.loaded / data.total * 100, 10);
		            data.context[i].find('.progress .progress-bar').css(
		                'width',
		                progress + '%'
		            );
	        	});
	        }).on('fileuploaddone', function (e, data) {
	        	var result = data.result.files;
	        	$.each(data.context, function(i, context){
	        		context.find(".edidtName").off("click");
	        		context.find(".delet-btn").off("click");
	        		
	        		//判断是否成功
		        	if(result && result[i].error) {
		            	msg(result[i].error);
		            	self.deleteMap(context);
		            }
		        	
	        		var map = context.data();
		        	
		        	proxy.mapAdd({
		        		panoId: panoId,
		        		url: result[i].url,
		        		name: map.name
		        	}, function(data){
		        		if(!data.success){
			            	msg(data.errMsg);
			            	self.deleteMap(context);
		        		}
		        		
		        		map.id = data.id;
		        		map.url = result[i].url;
						self.initMapListInit(context);
						
						setTimeout(function(){
							context.find('.progress').removeClass("in");
						}, 600);
		        	});
	        	});
	        });
		},
		initSortIndex: function(){
			//拖拽排序
			$('.plugin-map-list ul').sortable("draggable").sortable().bind('sortupdate', function() {
				// $(this).find("li").each(function(){
				// 	$(this).data();
				// })
			});
		},
		initSelectScene: function(){
			scenes = {};
        	var scenesTemp = this.getScene();
        	
        	for(var i in scenesTemp){
        		var s = scenesTemp[i];
        		
        		scenes[s.name] = obj = {};
        		
        		obj.scene = s;
        		obj.hasCurrMap = false;
        	}

			$(self.selectScene).empty();

			for(var i = 0; i < this.getScene().length; i++){
				var scene = this.getScene()[i];
				
				var li = $("<li/>").attr("data-name", scene.name).html(scene.title).appendTo(self.selectScene).data(scene);
			}
		},
		getCurrSceneName: function(){
			return krpanoPluginJs.getCurrScene().name;
		},
		selectSpot: function(name){
			var spot = this.getSpot(name);
			
			if(spot){
				spot.i.onmousedown();
			}
		},
		loadSpot: function(){
    		//还原spotList
			currselect = null;
			$(".chosed-scence li").removeClass("curr");
			$(".chosed-scence li").removeClass("disabled");
			
    		for(var i = 0; i < spotList.length; i++){
    			if(oldMap){
    				if(i == 0){oldMap.radar = [];};
    				
    				var op = {
    					id: spotList[i].id,
    					name: spotList[i].name,
    					x: spotList[i].left,
    					y: spotList[i].top,
    					r: spotList[i].heading
    				}
    				
    				oldMap.radar[i] = op;
    			}
    			
    			spotList[i].spot.remove();
    		}
    		
    		spotList = [];
    		
			$.each(scenes, function(k,v){
				v.hasCurrMap = false;
			});
			
			this.logger.hide();
			
			for(i = 0;i < currMap.radar.length;i++){
				var currMapRadar = currMap.radar[i];
				
				var op = {
					id: currMapRadar.id,
					valScene: currMapRadar.name,
					left: currMapRadar.x,
					top: currMapRadar.y,
					heading: currMapRadar.r
				}
				
				self.addRot(op);
			}

			isLoad = false;
			self.update(self.getCurrSceneName());
		},
		show: function(map){
			self.initSelectScene();

			self = this;
			isLoad = true;
	    	if(self.moveObj){
	    		if(currMap != map){
	    			oldMap = currMap;
	    			currMap = map;
		    		self.moveObj.change(currMap.url);
		    		self.loadSpot();
	    		} else {
					isLoad = false;
	    		}
	    	} else {
	    		currMap = map;
	    		self.img.attr("src", map.url);
	    		self.bindMove();
	    	}
	    	
	    	if(!this.layerIndex){
	    		this.layerIndex = layerMsg({
				    title: "平面地图",
				    area: ['700px', '452px'],
				    skin: ['setdistance plugin_layer map-alone'],
				    content: element
				});
	    	}
		},
		hide: function() {
			if(this.layerIndex){
				layer.close(this.layerIndex);
			}
			
			this.layerIndex = null;
		},
		bindMove:function(){
			self.select.change(function(){
				var currSpot = self.getSpot(currselect);
				var val = $(this).val();

				if(self.getSpot(val)){
					//提示已选择
					return false;
				}
				
				//重新设置点的时间
				currSpot.name = $(this).val();
				self.update(currSpot.name);
			});
			
			$(document).on("sceneChange", function(e, name){
				self.update(name);
			});
			
			self.element.on("click",".chosed-scence li",function(){
				var current = this;
				
				if($(this).hasClass('disabled')){
					return;
				}
				
				if( $(this).hasClass('curr')){
					$(current).parent().hide();
					return;
				}
				
				$(".chosed-scence li").removeClass("curr");
				$(current).addClass("curr");
				$(current).parent().hide();
				
				var index = self.getSpotIndex(currselect).index;
				var scene = $(this).data();

				if(self.getSpot(scene.name)){
					//提示已选择
					return false;
				}
				
				//重新设置点的时间
				spotList[index].name = scene.name;
				spotList[index].scene = scene;
				self.update(scene.name);
				
				proxy.mapRadarUpdate({
					id: currSpot.id,
					heading: currSpot.heading,
					x: currSpot.left,
					y: currSpot.top,
					mapId: currSpot.mapId,
					sceneId: scene.id,
					name: scene.name,
					async: false
				}, function(data){
					if(!data.success){
						msg(data.errMsg);
						flag = false;
					}
				})
			})

			self.dRot.click(function(e){
				self.deleteRot();
			});
			//删除地图
			self.dMap.click(function(e){
				self.deleteMap();
			});
			
			self.moveObj = new moveObj(self.fileList[0], {
				onload:function(){
					self.mapBg = this.parent;
					self.map = this.obj;
					self.mapImg = this.img;

					self.aRot.click(self.addRot.bind(self, null));
					self.loadSpot();
				}
			});
		},
		/**
		 * 获取未使用的场景
		 */
		getNotUseName: function(){
			var scene;
			
			//获取当前全景
			var name = this.getCurrSceneName();
			var spot = this.getSpot(name);
			
			if(!spot){
				return scenes[name];
			}
			
			//随机选择
			$.each(scenes, function(k,v){
				if(!v.hasCurrMap){
					scene = v;
					return;
				}
			});
			
			return scene;
		},
		addRot:function(op,e){
			if(this.mapImg.attr("src")){
				var sceneType = this.getNotUseName();
				
				if(!sceneType) {
					msg("每个场景只能在一个地图中存在一个,无法继续添加");
					return;
				}
				
				var scene = sceneType.scene;
				
				var opts= {
					valScene: scene.name,
					left: this.getPosValue(this.moveObj.left, this.mapBg.innerWidth() > this.mapImg.width()?this.mapImg.width():this.mapBg.innerWidth()),
					top: this.getPosValue(this.moveObj.top, this.mapBg.innerHeight() > this.mapImg.height()?this.mapImg.height():this.mapBg.innerHeight()),
					heading: 0
				}

				var optVal = $.extend(true, {}, opts, op);
				self.update();
				scenes[optVal.valScene].hasCurrMap = true;

				if(optVal.valScene != scene.name){
					scene = self.getScene(optVal.valScene);
				}
				
				if(!optVal.id){
					var flag = true;
					proxy.mapRadarAdd({
						heading: optVal.heading,
						x: optVal.left,
						y: optVal.top,
						mapId: currMap.id,
						sceneId: scene.id,
						name: scene.name,
						async: false
					}, function(data){
						if(!data.success){
							msg(data.errMsg);
							flag = false;
							return;
						}
						
						optVal.id = data.id;
					})
					
					if(!flag) {
						return;
					}
				}

				var j = {};
				j.img = $("<img/>").attr("src",hotspot);
				var spot = j.spot = $("<div/>").append($(icon)).appendTo(this.map).append(j.img);
				j.name = optVal.valScene;
				j.heading = optVal.heading;
				j.i = spot.find("i");
				j.icon = spot.find(".icon");
				j.scene = scene;
				j.id = optVal.id;
				j.mapId = currMap.id;
				spot.data(j);

				j.i.mouseover(function(){
					$(this).addClass("curr");
				}).mouseout(function(){
					$(this).removeClass("curr");
				}).mousedown(function(event){
					krpanoPluginJs.triggerRadar("mousedown", event);
					krpanoPluginJs.editRadar(true);
					return false;
				}).mouseup(function(event){
					krpanoPluginJs.triggerRadar("mouseup", event);
					krpanoPluginJs.editRadar(false);
					return false;
				}).mousemove(function(event){
					krpanoPluginJs.triggerRadar("mousemove", event);
					return false;
				})

				var spotMoveObj = new moveObj(spot[0],{
					left:optVal.left,
					top:optVal.top,
					onchange: function() {
						j.left = this.left;
						j.top = this.top;
						self.update(j.name);
					},
					onmousedown: function(){
						self.update(j.name);
					},
					onmouseup: function(){
						proxy.mapRadarUpdate({
							id: j.id,
							heading: j.heading,
							x: j.left,
							y: j.top,
							mapId: j.mapId,
							sceneId: scene.id,
							name: scene.name,
							async: false
						}, function(data){
							if(!data.success){
								msg(data.errMsg);
								flag = false;
							}
						})
					},
					onFinal: function(){
						j.left = this.left;
						j.top = this.top;
					}
				});

				spotList.push(j);
				self.update(optVal.valScene);
				self.select.val(optVal.valScene);
			}
		},
		setAngle:function(r){
			if(self.getSpot(currselect)) {
				self.getSpot(currselect).icon.css("transform", "rotate("+ r +"deg)");
				self.getSpot(currselect).heading = Math.round(krpanoPluginJs.getRadarAngle() * 100) /100
				self.update(self.getSpot(currselect).name);
			}
		},

		setRadarMouseup: function(){
			if(self.getSpot(currselect)){
				event.stopPropagation();

				self.getSpot(currselect).i.removeClass("curr");
				self.getSpot(currselect).i.mouseout(function(){
					$(this).removeClass("curr");
				});

				self.getSpot(currselect).heading = krpanoPluginJs.getRadarAngle();
				var j = self.getSpot(currselect);

				proxy.mapRadarUpdate({
					id: j.id,
					heading: j.heading,
					async: false
				}, function(data){
					if(!data.success){
						msg(data.errMsg);
						flag = false;
					}
				})
			}
		},

		setRadarMousedown: function(){
			if(self.getSpot(currselect)){
				self.getSpot(currselect).i.addClass("curr");
				self.getSpot(currselect).i.off("mouseout")
			}
		},
		deleteRot: function(name){
			if(!name) name = currselect;
			var flag = false;
			
			var spotObj = this.getSpotIndex(name);
			
			if(!spotObj) {
				msg("请选择热点后删除");
				return;
			}
			
			var i = spotObj.index;
			var spot = spotObj.spot;
			
			layer.open({
				title: '你确定要删除该热点吗',
				closeBtn: 0,
				skin:['deletHotspot'],
				btn: ['确认', '取消'],
				yes: function(index, layero){
					proxy.mapRadarDelete({
						mapradarId: spot.id
					}, function(data){
						if(!data.success){
							msg(data.errMsg);
							return;
						}
						
						spot.spot.remove();
						removeArray(spotList, i);
						
						scenes[name].hasCurrMap = false;
						msg("删除热点成功");
						layer.close(index);
					});
				}
			})
		},
		/**
		  * 计算当前热点在框的中间
		  * value {int} 当前大图的偏移量
		  * inner {int} 当前纬度高宽值
		  *
		  */
		getPosValue:function(value,inner){
			inner = (inner / 2);
			if(value > 0){
				value = inner - 12;
			} else {
				value = inner - value - 12;
			}

			return value;
		},
		/**
		  * 获取热点
		  * name {String} 缓存的name值

		  */
		getSpot: function(name){
			for(var i = 0; i < spotList.length; i++){
				if(spotList[i].name == name){
					return spotList[i];
				}
			}
		},
		getSpotIndex: function(name){
			for(var i = 0; i < spotList.length; i++){
				if(spotList[i].name == name){
					return {
						index: i,
						spot: spotList[i]
					};
				}
			}
		},
		/**
		  * 更新输入框显示值
		  * name {String} 缓存的name值
		  *
		  */
		update: function(name){
			if(name == currselect){
				var spot = this.getSpot(currselect);

				if(spot){
					var x = spot.left ? spot.left : 0;
					var y = spot.top ? spot.top : 0;
					var radar = spot.heading != null ? spot.heading :krpanoPluginJs.get("scene[get(xml.scene)].heading") ? krpanoPluginJs.get("scene[get(xml.scene)].heading") : 0;
					var title = spot.scene.title;
					
					this.select.val(currselect);
					this.inputX.val(x);
					this.inputy.val(y);
					this.inputRadar.val(radar);
					

					var log = "t："+ title +"\nx：" + x + "\ny：" + y + "\nr：" + radar;
					
					
					this.logger.show().val(log);
				}

				return;
			}

			//初始化
			this.inputX.val(0);
			this.inputy.val(0);
			this.inputy.val(0);

			currselect = "";
			this.selectScene.find("li").removeClass("disabled");
			krpanoPluginJs.setRadar("visible", false);

			//当有缓存值时,使用当前缓存的值
			for(var i = 0; i < spotList.length; i++){
				spotList[i].img.attr("src", hotspot);
				spotList[i].spot.removeClass("last");
				spotList[i].icon.hide();

				if(name && spotList[i].name == name){
					if(isLoad){
						return;
					}
					if(name != krpanoPluginJs.get('scene[get(xml.scene)].name')){
						krpanoPluginJs.sceneChange(spotList[i].scene.id, panoId, spotList[i].scene.name);
					}

					this.select.val(name);
					this.inputX.val(spotList[i].left ? spotList[i].left : 0);
					this.inputy.val(spotList[i].top ? spotList[i].top : 0);
					this.inputRadar.val(spotList[i].heading != null ? spotList[i].heading : krpanoPluginJs.get("scene[get(xml.scene)].heading") ? krpanoPluginJs.get("scene[get(xml.scene)].heading") : 0);
					krpanoPluginJs.setRadar("heading", this.inputRadar.val());
					
					
					currselect = name;
					spotList[i].img.attr("src", selectHotspot);
					spotList[i].spot.addClass("last");
					
					var li = this.selectScene.find("li[data-name="+currselect+"]");
					
					if(!li.hasClass("curr")){
						this.selectScene.find("li[data-name="+currselect+"]").click();
					}
					
					//添加雷达
					krpanoPluginJs.addRadar(spotList[i].spot);
					this.setAngle();

					setTimeout(function(){
						self.getSpot(currselect).icon.show();
						krpanoPluginJs.setRadar("visible", true);
					},100)
				} else {
					this.selectScene.find("li[data-name="+spotList[i].name+"]").addClass("disabled");
				}
			}
		}
	}
	
	var getMapListAll;
	var view = {
		options: {
			icon:'',
			className:"btnMap"
		},
		init: function(dom){
			self = this;
			mapView = $("<div class='plugin-map'><h5 class='pTitle'>平面地图</h5><i class='closea closemap'></i><i class='goLeft'></i><i class='goRight'></i><div class='scrollScene'></div><div class='getMapList'></div></div>");
			getMapListAll  = mapView.find(".getMapList");
			scrollSceneAll = mapView.find(".scrollScene");
			//var divTab = $("<div class='scene-common total-tab'>平面图切换</div>").appendTo(mapView);
			var ul = $("<ul class='scene-common scene-tab' />").appendTo(scrollSceneAll);
			var mapListShow = $(template(mapSceneList,{"list":krpanoPluginJs.getMapPackage()}));
			krpanoPluginJs.addChilde(mapView, true);
			if(mapListShow.length < 1){
				dom.hide();
				return;
			}
			//滚动条
			$(".scrollScene").mCustomScrollbar({
				setHeight: 200,
			    theme: "minimal"
			});
			ul.append(mapListShow);	
			mapView.find(".scene-tab li:first-child").addClass("curr");
			mapView.on("click",".scene-tab li",function(){
				var curr = this;
				var chooseName = $(curr).data("name");
				ul.find("li").removeClass("curr");
				$(curr).addClass("curr");
				krpanoPluginJs.setMap(chooseName);
				self.onmapresize();
			})

			self.dom = dom;

		},
		show: function(map){
			
			var domTop = self.dom.offset().top + 40 - 200/2;

			if(isMb && !isPad) {
				if(mapView.find(".scene-tab li").length == 1){
					mapView.find(".scene-tab li").parents(".scrollScene").hide();
					if(!this.layerIndex){
						this.layerIndex = layerMsg({
						    title: "",
						    area: ['262px', '200px'],
						    closeBtn: 0,
						    skin:['setdistance plugin_layer plugin-switch view-map myanim-b'],
						    content: mapView,
							shade:0.000001,
						    shadeClose: false,
						    shift: null,
						    offset:['auto','auto']
						});
						$(".layui-layer-content").css("paddingLeft","0")
			    	}
			    } else{
			    	if(!this.layerIndex){
						this.layerIndex = layerMsg({
						    title: "",
						    area: ['320px', '200px'],
						    closeBtn: 0,
						    skin:['setdistance plugin_layer plugin-switch view-map myanim-b'],
						    content: mapView,
							shade:0,
						    shadeClose: false,
						    shift: null,
						    offset:['auto','auto']
						});
						$(".layui-layer-content").css("paddingLeft","0");
			    	}
			    }


				var liWidth = $('.scene-tab li').eq(0).innerWidth();
				var allWidth = $(".scrollScene").width();
				var liLen =  $('.scene-tab li').length;
				var showLen = parseInt(allWidth/liWidth);
				var HideLen = liLen - showLen;
				var curIndex = 0;
				var target =  $('.scene-tab li');
				var mySenceTabScroll;

			    $(".closea",mapView).off("click").on("click",function(){
			    	$(".view-map").addClass("myanim-b0");
			    	var timer = setTimeout(function(){
						view.hide();
						$(".btnMore").trigger("click");
			    		clearTimeout(timer);
			    	},300);
			    });

				if(!isPad) $('.scene-tab').width(liWidth * liLen)
				// if(HideLen > 0) {
				// 	$('.goLeft').show();
				// 	$('.goRight').show();
				// }
				// console.log(showLen,allWidth,liWidth,liLen);
				// mapView.on("click",".goLeft",function(){
				// 	if(curIndex < 1) return;
				// 	curIndex--;
				// 	$('.scene-tab').animate({'margin-left':-liWidth*curIndex});
				// })
				// mapView.on("click",".goRight",function(){
				// 	if(curIndex >= HideLen) return;
				// 	curIndex++;
				// 	$('.scene-tab').animate({'margin-left':-liWidth*curIndex});
				// })

				mySenceTabScroll = new IScroll('.mCSB_container', { scrollX: true, scrollY: false, mouseWheel: true,click: true });

				// console.log(touch);
				// touch.on(target, 'swiperight', function(ev){
				// 	$(".goLeft").trigger('click');
				// });

				// touch.on(target, 'swipeleft', function(ev){
				// 	$(".goRight").trigger('click');
				// });
			} else {

				if(mapView.find(".scene-tab li").length == 1){
					mapView.find(".scene-tab li").parents(".scrollScene").hide();
					if(!this.layerIndex){
						this.layerIndex = layerMsg({
						    title: "",
						    area: ['262px', '200px'],
						    closeBtn: 0,
						    skin:['setdistance plugin_layer plugin-switch view-map'],
						    content: mapView,
						    offset:[domTop,'auto']
						});
						$(".layui-layer-content").css("paddingLeft","0")
			    	}
			    } else{
			    	if(!this.layerIndex){
						this.layerIndex = layerMsg({
						    title: "",
						    area: ['320px', '200px'],
						    closeBtn: 0,
						    skin:['setdistance plugin_layer plugin-switch view-map'],
						    content: mapView,
						    offset:[domTop,'auto']
						});
						$(".layui-layer-content").css("paddingLeft","0");
			    	}
			    }

			}
			this.onmapresize();
		},
		onmapresize: function(){
			var width;
			var height = getMapListAll.height();

			if(isMb){
				width = $(".plugin-map").width() - 60;
			} else {
				width = $(".plugin-map").width();
			}

			krpanoPluginJs.set('layer[get(skin_settings.maps_parent)].width', width);

			krpanoPluginJs.call("skin_maps_onresize(" + width + ", " + height + ")");

			getMapListAll.empty();
			var mapPicture = krpanoPluginJs.getMap();
			getMapListAll.append(mapPicture);
		},
		hide: function() {
			if(this.layerIndex){
				layer.close(this.layerIndex);
			}
			
			this.layerIndex = null;
		}
	}
	
	function X(krpano, plugin){
	}
	
	X.prototype = {
		edit: edit,
		view: view,
		show: null,
		hide: null
	}
	
	return X;
})
)