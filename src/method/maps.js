(function(window, undefined) {

	var hotspot = "/images/point.png";
	var selectHotspot = "/images/point_click.png";
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
	var roamingmap='<div class="model-roamingmap moqita">\ <div class="title"></div>\ <div class="content">\ <div class="content-left">\ <textarea class="logger" style="color: #fff;"/>\ <div class="buttons">\ <div class="scen-qhbtn">\ <button type="button" class="change-rot">场景切换</button>\ <ul class="chosed-scence">\ </ul>\ </div>\ <button type="button" class="delete-rot">删除热点</button>\ <button type="button" class="aad-rot">添加热点</button>\ </div>\ <div class="fileList"><img src=""/></div>\ </div>\ <div class="content-right">\ <div class="up-title">\ <button type="button" class="upmap">上传地图</button>\ <input type="file" class="upmap addfile"  id="fileRoam" multiple accept="image/*" name="fileRoam" onchange="handleFileroam(this)">\ <button type="button" class="aad-rot">添加热点</button>\ </div>\ <div class="set-map">\ <div class="link-sence">\ </div>\ <div class="coordinatex">\ <span class="coordinatex-desc">X</span>\ <input type="text" class="x-coordinatex" value="0" readonly>\ </div>\ <div class="coordinatey">\ <span class="coordinatex-desc">Y</span>\ <input type="text" class="y-coordinatex" value="0" readonly>\ </div>\ <div class="radar">\ <span class="radar-view">雷达角度</span>\ <input type="text" class="radar-num" value="0" readonly>\ </div>\ <div class="hotspot">\ <button type="button" class="save-hotspot">保存热点</button>\ <button type="button" class="delet-hotspot">删除热点</button>\ </div>\ </div>\ <div class="delet"><button type="button" class="delet-map">删除地图</button></div>\ </div>\ </div>\ </div>';	
	var maps = [{
			"id": 42,
			"name": "map_1.jpg",
			"url": "http://pano.panocooker.com/krpano/pano/2016/03/09/20557677.jpg",
			"radar": [{
				"id": 109,
				"name": "ituh6tt7",
				"x": "352",
				"y": "200",
				"r": "-11.0"
			}, {
				"id": 110,
				"name": "hua85zun",
				"x": "349",
				"y": "436",
				"r": "-155.0"
			}, {
				"id": 125,
				"name": "xqcyn69n",
				"x": "155",
				"y": "181",
				"r": "0.0"
			}, {
				"id": 126,
				"name": "nu0557bf",
				"x": "216",
				"y": "289",
				"r": "0.0"
			}]
		}, {
			"id": 279,
			"name": "map_3.jpg",
			"url": "http://pano.panocooker.com/krpano/pano/2016/05/20/93618140.jpg",
			"radar": [{
				"id": 558,
				"name": "nu0557bf",
				"x": "452",
				"y": "158",
				"r": "0.0"
			}, {
				"id": 559,
				"name": "xqcyn69n",
				"x": "307",
				"y": "336",
				"r": "-142.0"
			}, {
				"id": 560,
				"name": "hua85zun",
				"x": "575",
				"y": "231",
				"r": "0.0"
			}, {
				"id": 561,
				"name": "ituh6tt7",
				"x": "302",
				"y": "219",
				"r": "0.0"
			}]
		}];
	
	var currMap;
	
	var edit = function() {
		self = this;
	}
	
	
	edit.prototype = {
		content: function(panoId){
			proxy.mapsGet({
				panoId: panoId,
				async: false
			}, function(data){
				if(!data.success){
					alert(data.errMsg);
				}
				
				if(data.data) {
					maps = data.data;
				} else {
					maps = [];
				}
			}, function(e){
				console.log(e);
			});
			
			var content = $("<div class='plugin-map'/>").append("<div class='plugin-map-upload'><input type='file' name='file' class='plugin-map-uploadfile' multiple/><i></i>添加平面图</div>");
			var list = self.mapList = $("<div class='plugin-map-list'/>").appendTo(content)
			var ul = self.mapListUl = $("<ul/>").appendTo(list);

			var index = 0;
			
			for(var i =0;i < maps.length; i++){
				var li = $("<li><i class='drap'></i><span class='left-bor'></span><input type='text' readonly maxlength='18' class='plugin-map-name' value='"+maps[i].name+"'/><i class='delet-btn'></i><i class='bj-common editName'></i><i class='bj-common save-com'></i></li></li>").appendTo(ul).data(maps[i]);
				index++;
				
				self.initMapListInit(li);
			}
			
			list.css("height", index * 43);

			$("body").append(content);
			this.init();
			return content;
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
						alert(data.errMsg);
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
						alert(data.errMsg);
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
			$("body").append(element);

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
			
			
			funs.setEventRadar("mousemove", self.setAngle);
			funs.setEventRadar("mouseup", self.setRadarMouseup);
			funs.setEventRadar("mousedown", self.setRadarMousedown);
			
			//滚动条
			// $(".plugin-map-list").mCustomScrollbar({
			// 	setHeight: 140,
			//     theme: "minimal"
			// });

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

		},
		initSortIndex: function(){
			//拖拽排序
			// $('.plugin-map-list ul').sortable("draggable").sortable().bind('sortupdate', function() {
				// $(this).find("li").each(function(){
				// 	$(this).data();
				// })
			// });
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
	    		console.log(map);
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
		//初始化事件
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
						alert(data.errMsg);
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
							alert(data.errMsg);
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
								alert(data.errMsg);
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
						alert(data.errMsg);
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
							alert(data.errMsg);
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


	var funs = {
		//--------------------------------漫游地图开始----------------------------------------
		edit:new edit,
		getMapUrl: function(){
			return this.krpano.get("skin_settings.maps_url");
		},
		getMap: function(){
			this.krpano.set("layer[map].visible", true);
			return this.krpano.get("layer[map]").sprite;
		},
		getMapPackage: function(){
			var mapPackage = [];
			var mapList = this.krpano.get("mapurl");

			if(mapList){
				mapList = this.krpano.get("mapurl").getArray();
				for(var i = 0; i < mapList.length; i ++){
					var map = {};
					map.title = mapList[i].title;
					map.name =  mapList[i].name;
					mapPackage.push(map);
				}
			}
			return mapPackage;
		},
		setMap: function(name){
			this.krpano.call("skin_maps_change_map("+name+");");
		},

		onmapresize: function(width,height){
			this.krpano.set('layer[get(skin_settings.maps_parent)].width', width);
			this.krpano.call("skin_maps_onresize(" + width + ", " + height + ")");
			// getMapListAll.empty();
			var mapPicture = this.getMap();
			// getMapListAll.append(mapPicture);
		},
		showMap: function() {
			var mapHtml = this.getMap();
			$('body').append(mapHtml);
			this.onmapresize(500,300);
		},

		//--------------------------------雷达开始----------------------------------------
		/**
		 * 添加雷达
		 * 
		 * element 		{jQuery|dom}	添加对象
		 * scenename 	{String}		添加的雷达对象,默认当前全景,当值不为当前全景时,跳转至该全景
		 *
		 */
		addRadar: function(element,scenename){
			if(!scenename) 
				scenename = "scene[get(xml.scene)]";
			else if(scenename != this.get("xml.scene")){
			}

			var heading = this.get(scenename).heading;
			if(heading) heading = 0;

			//this.set("layer[editradar].heading", this.get(scenename).heading);
			this.set("layer[editactivespot].visible", true);

			$(element).prepend(this.get("layer[editactivespot]").sprite);
		},

		/**
		 * 触发雷达事件
		 * 共有   mousedown mouseup mousemove
		 * 
		 * type 	{String}	类型
		 * event 	{Event}		当前触发的事件对象,获取当前鼠标位置等
		 *
		 */
		triggerRadar: function(type, event){
			//触发js事件
			var e = document.createEvent("MouseEvents");
			e.initMouseEvent(type, true, true, window, document.defaultView, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
			krpanoPluginJs.get("layer[editradar]").child.path.dispatchEvent(e);
			
		},
		
		/**
		 * 设置事件方法
		 * 
		 * type 	{String}	类型      onmousemove
		 * fn 		{Function}	触发方法
		 *
		 */
		setRadar: function(type, fn){
			this.set("layer[editradar]." + type, fn);
		},
		
		/**
		 * 设置Event
		 * 
		 * type 	{String}	类型      onmousemove
		 * fn 		{Function}	触发方法
		 *
		 */
		setEventRadar: function(type, fn){
			if(typeof fn === "function"){
				window.radar[type] = fn;
			}
		},

		/**
		 * 添加事件
		 * type 	{String}	类型
		 * fn 		{Function}	当前时间方法
		 *
		 */
		getRadar: function(){
			return krpanoPluginJs.get("layer[editradar]");
		},

		/**
		 * 设置编辑雷达
		 *  
		 *  flag 	{Boolean}	是否编辑,当不传时默认切换
		 *
		 */
		editRadar: function(flag){
			if(flag)
				this.set("layer[editradar].editmode", flag);
			else
				this.set("layer[editradar].editmode", !this.get("layer[editradar].editmode"));
		},

		/**
		 * 获取当前雷达的角度
		 * 
		 *
		 * return	{Number}	当前角度
		 */
		getRadarAngle: function(){
			return this.get("layer[editradar]").currheading - this.get("view.hlookat");
		}
		//--------------------------------雷达结束----------------------------------------
	};



	YP.extend.maps = YP.callback(funs);
})(window)



