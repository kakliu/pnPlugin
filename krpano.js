(function(factory){
	if ( typeof define === "function" && define.amd ) {
		define( "krpanoPluginJs", ['jquery','proxy'], function ($,proxy) { 
			window.krpanoPluginJs = factory($,proxy);
			return window.krpanoPluginJs;
		});
	} else {
		window.krpanoPluginJs = factory($,proxy);
	}

	if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;
            var slice = [].slice;

            if (typeof target != "function") {
                throw new TypeError();
            }

            var args = slice.call(arguments, 1),
            bound = function () {

                if (this instanceof bound) {

                    var F = function(){};
                    F.prototype = target.prototype;
                    var self = new F();

                    var result = target.apply(
                        self,
                        args.concat(slice.call(arguments))
                        );
                    if (Object(result) === result) {
                        return result;
                    }
                    return self;

                } else {

                    return target.apply(
                        that,
                        args.concat(slice.call(arguments))
                        );

                }

            };

            return bound;
        };
    }
}(function($,proxy){
	var 
	_krpano,
	_plugin,
	isPlugin=false,
	view = {};

	KrpanoJs = function (){
	}

	KrpanoJs.prototype = {
		init: function (k, p){
			this.krpano = _krpano = k;
			this.plugin = _plugin = p;
			this.sprite = $(_plugin.sprite);
			isPlugin = this.isPlugin();
			this.setDefaultView();
			
			if(this.get("skin_settings.isedit") == "true"){
				_krpano.set("skin_settings.hotspot_onmouseup", "js(krpanoPluginJs.updateHotspot(get(name),true));");
			}
			
			this.skinSetting = _krpano.get("skin_settings");

			if(this.get("layer[editactivespot]")){

			} else {
				console.log("未加载雷达编辑插件");
			}
		},
		isPlugin:function(){
			return this.plugin?true:false;
		},
		accelerometer: function(enabledv){
			_krpano.set("plugin[skin_gyro].enabled", enabledv);
		},
		getSceneName: function(){
			return _krpano.get("scene[get(xml.scene)].title");
		},
		getSceneId: function(){
			return _krpano.get("scene[get(xml.scene)].id");
		},
		sceneChange: function(id,mainId,scenename){
			_krpano.call("skin_load_pano( '/editXml?id="+id+"&mainId="+mainId+"','"+scenename+"');");
		},
		sceneViewChange: function(scenename){
			_krpano.call("skin_load_scene( \'"+scenename+"\');");
		},
		getCurrScene: function(){
			return _krpano.get("scene[get(xml.scene)]");
		},
		getScene: function(name){
			if(name){
				return _krpano.get("scene["+name+"]");
			}
			
			var scene = _krpano.get("scene").getArray();
			
			for(var i=0;i<scene.length;i++){
				scene[i].thumburl = this.replaceUrl(scene[i].thumburl);
			}
			
			this.scene = scene;
			
			return this.scene;
		},
		getCurrScenes: function(){
			var temp = [];

			$("#multi .sucaijiayuan-list li").each(function(){
				var obj = {};
				var scene = $(this).data();

				obj.id = scene.id;
				obj.name = scene.pid;
				obj.title = $(this).find("input.editCommon").val();

				temp.push(obj);
			})
			
			return temp;
		},
		replaceUrl:function(url){
			//return url.replace("pano/%SWFPATH%" ,"http://ypano.duc.cn/krpano");
			if(url && url.indexOf("%SWFPATH%") > -1){
				var reg=new RegExp("^.*%SWFPATH%");
				var basePath = "/krpano";				
				return basePath + url.replace(reg ,"");			
			} else if(url && url.indexOf("%BASEDIR%") > -1){	
				var reg=new RegExp("^.*%BASEDIR%");
				var basePath = "/";
				return basePath + url.replace(reg ,"");		
			} else {
				return url;
			}
		},
		addChilde: function(element, flag){
			if(this.isPlugin && !flag){
				this.sprite.append(element);
			} else {
				$("#panoView").append(element);
			}
		},
		addPluginChilde: function(plugin, element){
			$(plugin.sprite).append(element);
		},
		chackStart:function(){
			return _krpano?true:false;
		},
		get: function(str){
			return _krpano.get(str);
		},
		set: function(str,value){
			_krpano.set(str,value);
		},
		call: function(action){
			_krpano.call(action);
		},
		getHotspot:function(name){
			return _krpano.get("hotspot['" + name + "']");
		},
		loadIcon: function(name,style){//切换热点图标，name:热点名称，style:图标样式
			_krpano.call("loadIcon('"+name+"','"+style+"')");
		},
		addEditHotspot: function(hotspotType,style,plugin){//type:linkRoam || linkScene || spot
			_krpano.call("addEditHotspot('"+hotspotType+"', '"+style+"', '"+plugin+"', 'pluginshow');");

            //this.getHotspot(_krpano.get('hotspot_name')).pluginshow();
		},
		getHotspotType: function(name){
			var hotspotType;
			switch (name) {
			case 'link_roam':
				hotspotType = 3;
				break;
			case 'link_scene':
				hotspotType = 2;
				break;
			case 'spot':
				hotspotType = 1;
				break;

			default:
				logger.error("未找到改类型, "+ name);
			}

			return hotspotType;
		},
		saveHotspot: function(name){
			var result = {};
			_krpano.call("saveHotspot();");
			var hotspot = this.getHotspot(name);
			var hotspotType = 0;
			
			switch (hotspot.hotspot_type) {
			case 'link_roam':
				hotspotType = 3;
				break;
			case 'link_scene':
				hotspotType = 2;
				break;
			case 'spot':
				hotspotType = 1;
				break;

			default :
				result.success = false;
				result.msg = "未知热点类型";
				return result;
			}

			proxy.hotspotAdd({
				ath: hotspot.ath,
				atv: hotspot.atv,
				panoId: this.getSceneId(),
				iconId: hotspot.iconid,
				mainPanoId: panoId,
				type: 1,
				hotspotType: hotspotType
			}, function(data){
				result = data;
				hotspot.id = data.id;
				
			},null , false);
			
			return result;
		},
		updateHotspot: function(name, flag) {
			var result = {};
			var hotspot = this.getHotspot(name);
			var op = {};
			op.id = hotspot.id;
			if(op.id){
				op.ath = hotspot.ath;
				op.atv = hotspot.atv;
				op.iconId = hotspot.iconid;
				op.belongPanoId = panoId;
					
				proxy.hotspotUpdate(op, function(data){
					result = data;
				}, null, false);
			} else if(flag != "true"){
				result = this.saveHotspot(name);
			}
			
			return result;
		},
		addHotspot:function(tip,pic,style,type,tipstyle,id) {//新增热点tip:标签内容，pic：热点图片(或评论头像)，style：热点的样式，type:热点类型,tipstyle标签样式，热点的id
			_krpano.call("skin_hotspot_add_handler('"+tip+"', '"+pic+"', '"+style+"', '"+type+"', '"+tipstyle+"', '"+id+"');");
		},
		removeHotspot:function(name){//删除热点name:热点的name
			var hotspot = this.getHotspot(name);
			
			if(hotspot.id){
				proxy.hotspotDelete({
					id:hotspot.id,
					belongPanoId: panoId
				}, function(data){
					if(!data.success){
						msg(data.errMsg);
						return;
					}
	
					msg("删除成功");
					deleteHotspot();
				});
			} else {
				deleteHotspot();
			}
			
			function deleteHotspot(){
				_krpano.call("skin_hotspot_remove('"+name+"');");
			}
		},
		saveComment:function(name,tipstyle){//发表评论name:热点的name,tipstyle标签样式
			_krpano.call("skin_comment_save('"+name+"','"+tipstyle+"');");
		},
		commentMoveOff:function(name){//单个评论移动开关
			_krpano.call("skin_comment_move_off('"+name+"')");
		},
		commentAllMoveOff:function(){//所有评论移动开关
			_krpano.call("skin_comment_all_move_off()");
		},
		getIconPackage:function(){
			function getHotspoturl(spot, style){
				spot.name = style.name;
				spot.url = this.replaceUrl(style.url);
				spot.iconid = style.iconid;
				spot.hotspotstyle = style.hotspotstyle;
				spot.packagename = style.packagename;
				spot.status = style.status;

				if(style.thumb){
					spot.thumb = this.replaceUrl(style.thumb);
				} else {
					spot.thumb = spot.url;
				}

				return spot;
			}

			var style = this.get("style").getArray();
			var iconpackageList = this.get("package").getArray();
			var newiconpackageList = [];
			var spotIconList = [];
			var spotGifList = [];
			
			for(var i = 0;i<this.get("style").count;i++){
				var spot = {};
				if(style[i].name.indexOf("spoticon") > -1){
					spot = getHotspoturl.call(this, spot, style[i]);
					if(spot && spot.status==1){
						spotIconList.push(spot);
					}
				}

				if(style[i].name.indexOf("spotgif") > -1){
					spot = getHotspoturl.call(this, spot, style[i]);
					if(spot && spot.status==1){
						spotGifList.push(spot);
					}
				}
			}
			
			for(var n = 0;n<this.get("package").count;n++){
				var newiconpackage = {};
				newiconpackage.name = iconpackageList[n].name;
				newiconpackage.title = iconpackageList[n].title;
				newiconpackage.id = iconpackageList[n].id;
				newiconpackage.thumb = iconpackageList[n].thumb;
				
				var styleList = [];
				for(var j = 0;j<spotIconList.length;j++){
					if(iconpackageList[n].name == spotIconList[j].packagename){
						styleList.push(spotIconList[j]);
					}
				}
				for(var x = 0;x<spotGifList.length;x++){
					if(iconpackageList[n].name == spotGifList[x].packagename){
						styleList.push(spotGifList[x]);
					}
				}
				
				newiconpackage.styleList = styleList;
				
				newiconpackageList.push(newiconpackage);
			}

			return newiconpackageList;
		},
		hotspotIconList:function(){//获取热点的图片返回arrary。该方法过期请使用getIconPackage方法
			function getHotspoturl(spot, style){
				spot.name = style.name;
				spot.url = this.replaceUrl(style.url);
				spot.iconid = style.iconid;
				spot.hotspotstyle = style.hotspotstyle;

				if(style.thumb){
					spot.thumb = this.replaceUrl(style.thumb);
				} else {
					spot.thumb = spot.url;
				}

				return spot;
			}

			var spotList = [];
			var newspotList = [];
			var style = this.get("style").getArray();
			for(var i = 0;i<this.get("style").count;i++){
				var spot = {};
				if(style[i].name.indexOf("spoticon") > -1){
					spot = getHotspoturl.call(this, spot, style[i]);

					if(spot){
						spotList.push(spot);
					}
				}

				if(style[i].name.indexOf("spotgif") > -1){
					spot = getHotspoturl.call(this, spot, style[i]);
					
					if(spot){
						newspotList.push(spot);
					}
				}
			}

			var result = [];

			result.push(spotList);
			result.push(newspotList);

			return result;
		},

		//补地图片
		setNadirlogo:function(pic,url,type){
			_krpano.call("skin_set_nadir("+pic+","+url+","+type+")");
		},
		getNadirlogo:function(){
			var v = {};
			var flag = this.skinSetting.nadirlogo;
			var defaultNadirlogo = this.replaceUrl(this.skinSetting.nadirlogo_default_url);
			var defaultOpenUrl = this.replaceUrl(this.skinSetting.nadirlogo_default_open_url);
			var nadirlogo = this.replaceUrl(this.skinSetting.nadirlogo_url);
			var openUrl = this.skinSetting.nadirlogo_open_url;
			var type = this.skinSetting.nadirlogo_type;
			
			if(flag){
				v.type = type;
				v.url = nadirlogo;
				v.link = openUrl;
			}else{
				v.type = 2;
				v.url = defaultNadirlogo;
				v.link = defaultOpenUrl;
			}
			
			return v;
		},
		nadirlogSwithVisible: function(flag){//显示隐藏补地图片
			_krpano.call("skin_nadirlogo_swith_visible("+flag+")");
		},
		skin_nadirlogo_resize: function(){//重置补地图片
			_krpano.call("skin_nadirlogo_resize()");
		},
		getdefaultnadir: function(){//获取补地默认logo和link
			var x = {};
			x.url = this.replaceUrl(this.skinSetting.nadirlogo_default_url);
			x.link = this.skinSetting.nadirlogo_default_open_url;
			return x;
		},
		viewreset: function(fov, fovmin, fovmax){//视角调整，name:view的name，fov：视角，fovmin视角最小值，fovmax：视角最大值
			_krpano.call("viewreset('" + this.get('xml.scene') + "','" + fov + "','" + fovmin + "','" + fovmax + "')");
		},
		viewlookat: function(x, y){//热点定位方法
			_krpano.call("moveto('" + x + "','" + y + "')");
		},
		/**
		  * 全景默认值
		  *
		  */
		setDefaultView: function(){
			var scene = this.getScene();

			for(var i=0;i<scene.length;i++){
				var sceneView = {};

				sceneView.fov = this.get("view["+scene[i].name+"].fov");
				sceneView.min = this.get("view["+scene[i].name+"].fovmin");
				sceneView.max = this.get("view["+scene[i].name+"].fovmax");
				sceneView.ath = this.get("view["+scene[i].name+"].hlookat");
				sceneView.atv = this.get("view["+scene[i].name+"].vlookat");

				view[scene[i].name] = sceneView;
			}
		},
		/**
		  * 全景默认值
		  *
		  */
		getDefaultView: function(name){
			if(!name) name = this.getCurrScene().name;
			return view[name];
		},
		/**
		  * 获取当前view
		  * 
		  * flag	{Boolean}	是否为默认值
		  *
		  *	result
		  *			result.centent	当前角度
		  *			result.min	当前最小角度
		  *			result.max	当前最大角度
		  *			result.ath	当前横向角度
		  *			result.atv	当前纵向角度
		  */
		getView: function(flag){
			if(flag) return this.getDefaultView();

			var view = {};
			view.fov = this.get("view.fov");
			view.min = this.get("view.fovmin");
			view.max = this.get("view.fovmax");

			this.call("adjusthlookat(view.hlookat)");
			view.ath = this.get("view.hlookat");
			view.atv = this.get("view.vlookat");

			return view;
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
		},
		//--------------------------------雷达结束----------------------------------------



		//--------------------------------漫游地图开始----------------------------------------
		getMapUrl: function(){
			return this.replaceUrl(this.get("skin_settings.maps_url"));
		},
		getMap: function(){
			this.set("layer[map].visible", true);
			return this.get("layer[map]").sprite;
		},
		getMapPackage: function(){
			var mapPackage = [];
			var mapList = this.get("mapurl");

			if(mapList){
				mapList = this.get("mapurl").getArray();
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
			_krpano.call("skin_maps_change_map("+name+");");
		},
		//--------------------------------漫游地图结束----------------------------------------
		//--------------------------------组件开关开始----------------------------------------
		switchOff: function(name,type){//name:开关的名字,type:1表示开，0表示关
			switch (name) {
			case 'hotspot':
				_krpano.call("switch_hotspot("+type+");");
				break;
			case 'gyro':
				_krpano.call("switch_gyro("+type+");");
				break;
			case 'music':
				_krpano.call("switch_music("+type+");");
				break;
			case 'starview':
				_krpano.call("switch_starview("+type+");");
				break;
			case 'spin':
				_krpano.call("switch_spin("+type+");");
				break;
			case 'comment':
				_krpano.call("switch_comment("+type+");");
				break;
			default:
				return "未知组件类型";
			}
		},
		getSwitch: function(){
			var result = {};
			var gyro = this.skinSetting.switch_gyro;
			var music = this.skinSetting.switch_music;
			var comment = this.skinSetting.switch_comment;
			var hotspot = this.skinSetting.switch_hotspot;
			var starview = this.skinSetting.switch_starview;
			var spin = this.skinSetting.switch_spin;
			var scenelist = this.skinSetting.switch_scenelist;

			result.gyro = gyro;
			result.music = music;
			result.comment = comment;
			result.hotspot = hotspot;
			result.starview = starview;
			result.spin = spin;
			result.scenelist = scenelist;
			
			return result;
		},
		//---------获取特效弹出框所需数据---------
		getSnow: function(){
			var result = {};
			var zdycheck = true;
			result.effectswich = false;
			result.list = [];
			result.zdy = [];
			
			for(i = 0;i < this.get("layer.count"); i++){
				var obj = {};
				if(this.get("layer["+i+"].is_default") == 'true'){
					obj.rename = this.get("layer["+i+"].rename");
					obj.name = this.get("layer["+i+"].name");
					obj.mode = this.get("layer["+i+"].mode");
					obj.effectId = this.get("layer["+i+"].effect_id");
					obj.imageurl = this.get("layer["+i+"].imageurl");
					obj.type = this.get("layer["+i+"].type");
					obj.isUse = this.get("layer["+i+"].is_use");
					if(this.get("skin_settings.effect_share") == 'false' &&
							this.get("layer[get(xml.scene)]") && 
							this.get("layer[get(xml.scene)].effect_id") == this.get("layer["+i+"].effect_id")){
						if(this.get("layer[get(xml.scene)].is_use") == 0){
							result.effectswich = true;
						}
						obj.isUse = this.get("layer[get(xml.scene)].is_use");
						obj.check = true;
						zdycheck = false;
					}else if(this.get("skin_settings.effect_share") == 'false' && 
							!this.get("layer[get(xml.scene)]") &&
							this.get("layer[default]") && 
							this.get("layer[default].effect_id") == this.get("layer["+i+"].effect_id")){
						if(this.get("layer[default].is_use") == 0){
							result.effectswich = true;
						}
						obj.isUse = this.get("layer[default].is_use");
						obj.check = true;
						zdycheck = false;
					}else if(this.get("skin_settings.effect_share") == 'true' && 
							this.get("layer[default].effect_id") == this.get("layer["+i+"].effect_id")){
						obj.check = true;
						if(this.get("layer[default].is_use") == 0){
							result.effectswich = true;
						}
						obj.isUse = this.get("layer[default].is_use");
						zdycheck = false;
					}else{
						obj.check = false;
					}
					result.list.push(obj);
				}
			}
			if(zdycheck == true){
				var zdy = {};
				if(this.get("layer[get(xml.scene)]") && this.get("skin_settings.effect_share") == 'false'){
					zdy.rename = this.get("layer[get(xml.scene)].rename");
					zdy.name = this.get("layer[get(xml.scene)].name");
					zdy.mode = this.get("layer[get(xml.scene)].mode");
					zdy.effectId = this.get("layer[get(xml.scene)].effect_id");
					zdy.imageurl = this.get("layer[get(xml.scene)].imageurl");
					zdy.type = this.get("layer[get(xml.scene)].type");
					zdy.isUse = this.get("layer[get(xml.scene)].is_use");
					zdy.check = true;
					if(this.get("layer[get(xml.scene)].is_use") == 0){
						result.effectswich = true;
					}
					result.zdy.push(zdy);
				}else if(!this.get("layer[get(xml.scene)]") && this.get("skin_settings.effect_share") == 'false' && 
						this.get("layer[default]")){
					zdy.rename = this.get("layer[default].rename");
					zdy.name = this.get("layer[default].name");
					zdy.mode = this.get("layer[default].mode");
					zdy.effectId = this.get("layer[default].effect_id");
					zdy.imageurl = this.get("layer[default].imageurl");
					zdy.type = this.get("layer[default].type");
					zdy.isUse = this.get("layer[default].is_use");
					zdy.check = true;
					if(this.get("layer[default].is_use") == 0){
						result.effectswich = true;
					}
					result.zdy.push(zdy);
				}else if(this.get("skin_settings.effect_share") == 'true'){
					zdy.rename = this.get("layer[default].rename");
					zdy.name = this.get("layer[default].name");
					zdy.mode = this.get("layer[default].mode");
					zdy.effectId = this.get("layer[default].effect_id");
					zdy.imageurl = this.get("layer[default].imageurl");
					zdy.type = this.get("layer[default].type");
					zdy.isUse = this.get("layer[default].is_use");
					zdy.check = true;
					if(this.get("layer[default].is_use") == 0){
						result.effectswich = true;
					}
					result.zdy.push(zdy);
				}else{
					result.zdycheck = false;
				}
			}
			
			return result;
		},
		//-----自定义特效展示调用js------
		setSnow: function(imageurl){
			this.call("skin_effect_diy_image("+imageurl+")");
		},
		//-----选择系统默认特效时切换特效展示效果-----
		setDefaultSnow: function(name){
			this.call("skin_effect_diy_default("+name+")");
		},
		//-----开关特效展示效果-----
		setUpOrDownSnow: function(){
			if(this.get("skin_settings.effect_share") == 'false' && !this.get("layer[get(xml.scene)]")
					&& !this.get("layer[default]")){
				
			}else{
				this.call("skin_effect_diy_open()");
			}
		},
		//-----当前特效应用到所有场景-----
		addEffectToAll: function(){
			if(this.get("skin_settings.effect_share") == 'false' && !this.get("layer[get(xml.scene)]")){
				
			}else{
				this.call("skin_effect_diy_all()");
			}
		},
		getStory: function(){
			return this.get("story[story].content");
		},
		getContact: function(){
			var result = {};
		    result.tel = this.get("contact[contact].tel");
			result.address = this.get("contact[contact].address");
			return result;
		},
		//-----播放音乐------
		playMusic: function(url){
			this.set("skin_settings.switch_music", "on");
			this.call("skin_music_url("+url+")");
		}
	}
	
	window.updateHotspot = function(ath,atv,id){
		proxy.hotspotUpdate({
			ath: hotspot.ath,
			atv: hotspot.atv,
			id: id
		});
	}

	return new KrpanoJs();
}))
