(function(factory){
	if ( typeof define === "function" && define.amd ) {
		define( "krpanoPluginJs", ['jquery'], function ($) { 
			window.krpanoPluginJs = factory($);
			return window.krpanoPluginJs;
		});
	} else {
		window.krpanoPluginJs = factory($);
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
}(function($){
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

			_krpano.set("skin_settings.hotspot_onmouseup","js(updateHotspot(get(ath),get(atv),get(id)))");
			this.skinSetting = _krpano.get("skin_settings");

			if(this.get("layer[editactivespot]")){

			} else {
				console.log("未加载雷达编辑插件");
			}
		},
		isPlugin:function(){
			return plugin?true:false;
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
		sceneChange: function(scenename){
			_krpano.call("loadscene( \'"+scenename+"\', null, KEEPBASE , BLEND(1) );");
		},
		getCurrScene: function(){
			return _krpano.get("scene[get(xml.scene)]");
		},
		getScene: function(){
			var scene = _krpano.get("scene").getArray();
			
			for(var i=0;i<scene.length;i++){
				scene[i].thumburl = this.replaceUrl(scene[i].thumburl);
			}
			
			this.scene = scene;
			
			return this.scene;
		},
		replaceUrl:function(url){
			//return url.replace("pano/%SWFPATH%" ,"http://ypano.duc.cn/krpano");
			var reg=new RegExp("^.*%SWFPATH%");

			if(url && url.indexOf("%SWFPATH%") > -1){
				var basePath = "http://localhost:8080/flexweb/krpanoPluginTest/bin/";				
				return basePath + url.replace(reg ,"");			
			} else {				return url;
			}

		},
		addChilde: function(element, flag){
			if(this.isPlugin && !flag){
				this.sprite.append(element);
			} else {
				$("body").append(element);
			}
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
		addHotspot:function(tip,pic,style,type,tipstyle,id){//新增热点tip:标签内容，pic：热点图片(或评论头像)，style：热点的样式，type:热点类型,tipstyle标签样式，热点的id
			_krpano.call("skin_hotspot_add_handler('"+tip+"', '"+pic+"', '"+style+"', '"+type+"', '"+tipstyle+"', '"+id+"');");
		},
		removeHotspot:function(name){//删除热点name:热点的name
			_krpano.call("skin_hotspot_remove('"+name+"');");
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
		hotspotIconList:function(){//获取热点的图片返回arrary。
			function getHotspoturl(spot, style){
				spot.name = style.name;
				spot.url = this.replaceUrl(style.url);

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
		setNadirlogo:function(pic,url){
			_krpano.set("hotspot[skin_nadirlogo_nadirlogo].logo",pic);
			_krpano.set("hotspot[skin_nadirlogo_nadirlogo].logo",url);
			_krpano.call("skin_nadir_onload_pic(skin_nadirlogo_nadirlogo)");
		},
		getNadirlogo:function(){
			var v = {};
			var flag = this.skinSetting.nadirlogo;
			var defalutNadirlogo = this.replaceUrl(this.skinSetting.nadirlogo_default_url);
			var nadirlogo = this.replaceUrl(this.skinSetting.nadirlogo_url);
			var openUrl = this.skinSetting.nadirlogo_open_url;

			if(flag){
				if(defalutNadirlogo == nadirlogo){
					v.type = 0;
				} else {
					v.type = 1;
				}
			} else {
				v.type = 2;
			}

			v.url = openUrl;
			v.nadirlogo = nadirlogo;

			return v;
		},
		nadirlogSwithVisible: function(flag){//显示隐藏补地图片
			_krpano.call("skin_nadirlogo_swith_visible("+flag+")");
		},
		skin_nadirlogo_resize: function(){//重置补地图片
			_krpano.call("skin_nadirlogo_resize()");
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
			if(flag) return getDefualtView();

			var view = {};
			view.fov = this.get("view.fov");
			view.min = this.get("view.fovmin");
			view.max = this.get("view.fovmax");

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
			e.initMouseEvent(type, true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, 0, false, false, false, false, 0, null);
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
		}
		//--------------------------------漫游地图结束----------------------------------------
	}

	return new KrpanoJs();
}))
