(function(window, undefined) {
	var funs;
	var krpano;
	var hotspot = "/static/images/point.png";
	var selectHotspot = "/static/images/point_click.png";
	var icon = "<div class='icon'><i /><div class='radar'/></div>"
	var sceneHtml='<span class="link-font">连接场景</span><select class="choose-sence"><%for(var i = 0;i<scene.length;i++){%><option value="<%=scene[i].name%>"><%=scene[i].title%></option><%}%></select>';
	var roamingmap='<div class="mapWapper"></div><div class="model-roamingmap moqita"> <div class="content">\ <div class="content-left">\ <textarea class="logger" style="color: #fff;"/>\ <div class="buttons">\ <div class="scen-qhbtn">\ <button type="button" class="change-rot">场景切换</button>\ <ul class="chosed-scence">\ </ul>\ </div>\ <button type="button" class="delete-rot">删除热点</button>\ <button type="button" class="aad-rot">添加热点</button>\ </div>\ <div class="fileList"><img src=""/></div>\ </div>\ <div class="content-right">\ <div class="up-title">\ <button type="button" class="upmap">上传地图</button>\ <input type="file" class="upmap addfile"  id="fileRoam" multiple accept="image/*" name="fileRoam" onchange="handleFileroam(this)">\ <button type="button" class="aad-rot">添加热点</button>\ </div>\ <div class="set-map">\ <div class="link-sence">\ </div>\ <div class="coordinatex">\ <span class="coordinatex-desc">X</span>\ <input type="text" class="x-coordinatex" value="0" readonly>\ </div>\ <div class="coordinatey">\ <span class="coordinatex-desc">Y</span>\ <input type="text" class="y-coordinatex" value="0" readonly>\ </div>\ <div class="radar">\ <span class="radar-view">雷达角度</span>\ <input type="text" class="radar-num" value="0" readonly>\ </div>\ <div class="hotspot">\ <button type="button" class="save-hotspot">保存热点</button>\ <button type="button" class="delet-hotspot">删除热点</button>\ </div>\ </div>\ <div class="delet"><button type="button" class="delet-map">删除地图</button></div>\ </div>\ </div>\ </div>';	
	var mapSceneList = '<ul class="scene-common scene-tab"><%for(var i = 0; i <list.length; i++) {%> <li data-name= <%=list[i].name%> > <%=list[i].title%> </li> <%}%></ul>';
	var element;
	var self;
	var currselect;
	var spotList = [];
	var scenes = {};
	var currMap;
	var oldMap;
	var isLoad = false;
	var getMapListAll;
	var currMap;
	var mapOption = {
		id: null,
		name: null,
		url: null,
		drag: false,
		edit: true,
		radar: []
	}

	var edit = function() {
		self = this;
		this.init();
	}

	edit.prototype = {
		content: function(){
			var maps = funs.option.maps || [];
			if(!maps.length) {
				proxy.mapsGet({
					panoId: funs.option.panoId,
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
			}

			var content = $("<div class='plugin-map'/>");
			var list = self.mapList = $("<div class='plugin-map-list'/>").appendTo(content)
			var ul = self.mapListUl = $("<ul/>").appendTo(list);
			
			for(var i =0;i < maps.length; i++){
				var li = $("<li>"+maps[i].name+"</li>").appendTo(ul).data(maps[i]);
				self.initMapListInit(li);
			}
			

			$("#elementView").show().append(content);
			
			return content;
		},
		initMapListInit: function(li){
			li.click(function(e){
				var map = $(li).data();
				if(map && map.id){
					self.show(map);
				}
			});
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
	    	console.log(map);
	    	krpano.call("js_add_map("+map.url+")")
	    	var mapHtml = krpano.get("layer[mapedit]").sprite;
	    	$(".mapWapper").append(mapHtml);
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
			self.update(funs.getCurrSceneName());
		},

		addRot:function(op,e){
			if(this.mapImg.attr("src")){
				var sceneType = this.getNotUseName();
				
				if(!sceneType) {
					console.log("每个场景只能在一个地图中存在一个,无法继续添加");
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
					scene = funs.getScene(optVal.valScene);
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
				var spot = j.spot = $("<div class=spot />").append($(icon)).appendTo(this.map).append(j.img);

					

				j.name = optVal.valScene;
				j.heading = optVal.heading;
				j.i = spot.find("i");
				j.icon = spot.find(".icon");
				j.scene = scene;
				j.id = optVal.id;
				j.mapId = currMap.id;
				spot.data(j);

				krpano.call("js_add_mapspot("+j.name+","+optVal.left+","+optVal.top+","+optVal.heading+")");
				var spotHtml = krpano.get("layer["+j.name+"]").sprite;

				$(krpano.get("layer[mapedit]").sprite).append(spotHtml);



				j.i.mouseover(function(){
					$(this).addClass("curr");
				}).mouseout(function(){
					$(this).removeClass("curr");
				}).mousedown(function(event){
					funs.triggerRadar("mousedown", event);
					funs.editRadar(true);
					return false;
				}).mouseup(function(event){
					funs.triggerRadar("mouseup", event);
					funs.editRadar(false);
					return false;
				}).mousemove(function(event){
					funs.triggerRadar("mousemove", event);
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

		//初始化事件
		bindMove:function(){
			self.select.change(function(){
				var currSpot = self.getSpot(currselect);
				var val = $(this).val();

				if(self.getSpot(val)){
					//提示已选择
					return false;
				}
				
				//重新设置点的事件
				currSpot.name = $(this).val();
				self.update(currSpot.name);
			});
			
			$(document).on("sceneChange", function(e, name){
				self.update(name);
			});
			
			self.element.on("click",".chosed-scence li",function(){
				var current = this;
				

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
				
				//重新设置点的事件
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

		init: function(dom){
			var data = {};

        	scenes = funs.getScene();
        	var sceneElement = $(template(sceneHtml, {scene: scenes}));

			element = self.element = $(template(roamingmap, {}));
			element.find(".link-sence").append(sceneElement);
			$("#elementView").append(element);

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
			

			//场景切换下拉展开
			self.element.on("click",".change-rot",function(){
				var spotObj = self.getSpotIndex(currselect);
				
				if(!spotObj) {
					console.log("请选择热点后切换");
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
        	var scenesTemp = funs.getScene();
        	for(var i in scenesTemp){
        		var s = scenesTemp[i];
        		
        		scenes[s.name] = obj = {};
        		
        		obj.scene = s;
        		obj.hasCurrMap = false;
        	}

			$(self.selectScene).empty();

			for(var i = 0; i < funs.getScene().length; i++){
				var scene = funs.getScene()[i];
				var li = $("<li/>").attr("data-name", scene.name).html(scene.title).appendTo(self.selectScene).data(scene);
			}
		},

		selectSpot: function(name){
			var spot = this.getSpot(name);
			
			if(spot){
				spot.i.onmousedown();
			}
		},


		/**
		 * 获取未使用的场景
		 */
		getNotUseName: function(){
			var scene;
			
			//获取当前全景
			var name = funs.getCurrSceneName();
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

		setAngle:function(r){
			if(self.getSpot(currselect)) {
				self.getSpot(currselect).icon.css("transform", "rotate("+ r +"deg)");
				self.getSpot(currselect).heading = Math.round(funs.getRadarAngle() * 100) /100
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

				self.getSpot(currselect).heading = funs.getRadarAngle();
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
					var radar = spot.heading != null ? spot.heading :funs.krpano.get("scene[get(xml.scene)].heading") ? funs.krpano.get("scene[get(xml.scene)].heading") : 0;
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
			funs.setRadar("visible", false);

			//当有缓存值时,使用当前缓存的值
			for(var i = 0; i < spotList.length; i++){
				spotList[i].img.attr("src", hotspot);
				spotList[i].spot.removeClass("last");
				spotList[i].icon.hide();

				if(name && spotList[i].name == name){
					if(isLoad){
						return;
					}
					if(name != funs.krpano.get('scene[get(xml.scene)].name')){
						funs.sceneChange(spotList[i].scene.id, funs.option.panoId, spotList[i].scene.name);
					}

					this.select.val(name);
					this.inputX.val(spotList[i].left ? spotList[i].left : 0);
					this.inputy.val(spotList[i].top ? spotList[i].top : 0);
					this.inputRadar.val(spotList[i].heading != null ? spotList[i].heading : funs.krpano.get("scene[get(xml.scene)].heading") ? funs.krpano.get("scene[get(xml.scene)].heading") : 0);
					funs.setRadar("heading", this.inputRadar.val());
					
					
					currselect = name;
					spotList[i].img.attr("src", selectHotspot);
					spotList[i].spot.addClass("last");
					
					var li = this.selectScene.find("li[data-name="+currselect+"]");
					
					if(!li.hasClass("curr")){
						this.selectScene.find("li[data-name="+currselect+"]").click();
					}
					
					//添加雷达
					funs.addRadar(spotList[i].spot);
					this.setAngle();

					setTimeout(function(){
						self.getSpot(currselect).icon.show();
						funs.setRadar("visible", true);
					},100)
				} else {
					this.selectScene.find("li[data-name="+spotList[i].name+"]").addClass("disabled");
				}
			}
		},
		viewinit: function(){
			self = this;
			mapView = $("<div class='plugin-map'><div class='scrollScene'></div><div class='getMapList'></div></div>");
			getMapListAll  = mapView.find(".getMapList");
			scrollSceneAll = mapView.find(".scrollScene");
			var mapListShow = $(template(mapSceneList,{list:funs.getMapPackage()}));
			mapListShow.appendTo(scrollSceneAll);
			mapView.find(".scene-tab li:first-child").addClass("curr");
			mapView.on("click",".scene-tab li",function(){
				var curr = this;
				var chooseName = $(curr).data("name");
				mapListShow.find("li").removeClass("curr");
				$(curr).addClass("curr");
				funs.setMap(chooseName);
				self.onmapresize();
			})
		},
		viewshow: function(){
			this.viewinit();
			console.log(mapView);
			$("#elementView").show().html('').append(mapView);
			this.onmapresize();
		},
		onmapresize: function(){
			var width = getMapListAll.width();
			var height = getMapListAll.height();
			krpano.set('layer[get(skin_settings.maps_parent)].width', width);
			krpano.call("skin_maps_onresize()");
			getMapListAll.empty();
			var mapPicture = funs.getMap();
			getMapListAll.append(mapPicture);
		}
	}
	


	funs = {
		//--------------------------------漫游地图开始----------------------------------------
		getMapUrl: function(){
			console.log(funs);
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

			var heading = this.krpano.get(scenename).heading;
			if(heading) heading = 0;
			//this.set("layer[editradar].heading", this.get(scenename).heading);
			this.krpano.set("layer[editactivespot].visible", true);
			$(element).prepend(this.krpano.get("layer[editactivespot]").sprite);
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
			this.krpano.get("layer[editradar]").child.path.dispatchEvent(e);
			
		},
		
		/**
		 * 设置事件方法
		 * 
		 * type 	{String}	类型      onmousemove
		 * fn 		{Function}	触发方法
		 *
		 */
		setRadar: function(type, fn){
			this.krpano.set("layer[editradar]." + type, fn);
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
		 * fn 		{Function}	当前事件方法
		 *
		 */
		getRadar: function(){
			return this.krpano.get("layer[editradar]");
		},

		/**
		 * 设置编辑雷达
		 *  
		 *  flag 	{Boolean}	是否编辑,当不传时默认切换
		 *
		 */
		editRadar: function(flag){
			if(flag)
				this.krpano.set("layer[editradar].editmode", flag);
			else
				this.kppano.set("layer[editradar].editmode", !this.get("layer[editradar].editmode"));
		},

		/**
		 * 获取当前雷达的角度
		 * 
		 *
		 * return	{Number}	当前角度
		 */
		getRadarAngle: function(){
			return this.krpano.get("layer[editradar]").currheading - this.krpano.get("view.hlookat");
		},

		//--------------------------------雷达结束----------------------------------------

		getCurrSceneName: function(){
			return this.krpano.get("scene[get(xml.scene)]").name;
		},
		getScene: function(name){
	        if (name) {
	            return this.krpano.get("scene[" + name + "]");
	        }
	        return this.krpano.get("scene").getArray();
		},
		sceneChange: function(id,mainId,scenename){
			this.krpano.call("skin_load_pano( '"+this.option.path+"/editXml?id="+id+"&mainId="+mainId+"','"+scenename+"');");
		}
	};


	funs.edit = function(){
		krpano = this.krpano;
		return new edit();
	}


	YP.extend.maps = YP.callback(funs);
})(window)


        


