(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
			'jquery', 
			'template', 
			'krpanoPluginJs',
			'proxy',
			'hotspot/registehotspot',
         	'depend/util/model',
        	'p/hotspot/link/index.tpl',
			'p/hotspot/link/addfont.tpl',
		    //连接器底部的表情包左右切换
		    'depend/tabLeftRight/simplefoucs',
        	"css!p/hotspot/link/index",
	        'depend/scrollBar/jquery.mCustomScrollbar.concat.min',
	        "css!depend/scrollBar/jquery.mCustomScrollbar.min"
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy, registehotspot, model){
	var self;
	var krpano;
	var plugin;
	function X(k){
		krpano = k;
	}

	var fn = X.prototype;

	fn.view = function(){
		self = this;
		this.isAddPlugin = false;

		this.init = function(){
			hotspotFn = registehotspot.getInstance("link_scene", {
				element: this.spot,
				isSaveMove: false,
				isInitIconEvent: true,
				loadSceneRemoveHotspot: true
			});
		}

		this.spot = function(hotspot){
			if(isMb && !isPad) hotspot.scale = 0.6;
			this.init = function(data, isSave){
				this.hotspotElement = $("<div class='hotspot-link-view'/>").html(krpanoPluginJs.getScene(data.sceneName).title);

				return this.hotspotElement;
			}

			this.onclick = function(data){
				if(data.sceneName){
					krpanoPluginJs.sceneViewChange(data.sceneName);
				} else {
					logger.error("跳转失败");
				}
			}

			this.onupdatestyle = function(data, hotspot) {
				this.hotspotElement.css({"top": data.y - 7, "left": data.x * 2 + 12});
			}
		}
	}

	fn.edit = function() {
		this.options = {
			icon: "/v2.0/images/linkImg.png"
		};
		self = this;

		this.init = function(dom){
			
			this.dom = dom;
			hotspotFn = registehotspot.getInstance("link_scene", {
				loadSceneRemoveHotspot: true,
				element: this.spot,
				isSaveMove: true,
				saveFlag: true,
				isInitIconEvent: true
			});
		}

		this.show = function(){
			hotspot = hotspotFn.addHotspot({
				iconName: 'spoticon101',
				data: {}
			});

			hotspot.callwith("onclick");

			this.dom.data("curr", false);
		}

		this.hide = function() {
			this.comment.hide();
		}

		this.spot = function(hotspot){
			var _this = this,
				data={};
			
			this.listButton = {};

			this.init = function(data, isSave){
				var self = this;
				this.hotspotElement = $("<div class='hotspot'/>").delegate(".model .contents","mousedown",function(){
					return false;
				}).hide().data("curr", false);

				this.initLink(data, isSave);
				this.initLabel(data, isSave);
				this.initDelete();
				var hotspoti = this.hotspotElement.find(".hotspot-i i");
				hotspoti.click(function(){
					//表情包出现滚动条
					self.hotspotElement.find(".hotspot-link-model .content").mCustomScrollbar();
					//上传图片太多出现滚动条
					
					self.hotspotElement.find(".listIcon").mCustomScrollbar();

				})
				return this.hotspotElement;
			}

			this.onclick = function(){
				if(this.hotspotElement.data("curr") == false){
					var list = this.hotspotFn.getHotspot();

					for(var i in list){
						var fn = list[i].element;

						if(!fn){
							console.log(list[i]);
							continue;
						}

						fn.hotspotElement.hide().data("curr", false);
						fn.hotspotFn.zorder(false);
					}

					this.hotspotElement.find(".hotspot-link-model .content").mCustomScrollbar("destroy");
					
					this.hotspotElement.find(".listIcon").mCustomScrollbar("destroy");
					this.hotspotElement.show().data("curr", true);
					this.hotspotFn.zorder(true);
				}
			}

			this.onresize = function(){
				//this.hotspotFn.onupdatestyle();
			}

			this.onremove = function(id){
				proxy.hotspotDelete({
					id: id,
					belongPanoId: panoId
				}, function(data){
					if(!data.success){
						msg(data.errMsg);
						return;
					}
				})
			}

			this.onsave = this.onupdate = this.onmoveupdate = function(data, hotspot) {
				var isSave = hotspot.is_save;
				var id;

				if(!data || !data.sceneId || !data.sceneName){return;}

				var obj = {
						ath: hotspot.ath,
						atv: hotspot.atv,
						hotspotType: krpanoPluginJs.getHotspotType(hotspot.hotspot_type),
						type: 2,
						mainPanoId: panoId,
						panoId: krpanoPluginJs.getSceneId(),
						linkedId: data.sceneId,
						linkedScene: data.sceneName,
						iconId: hotspot.icon_id,
						async: false
					};

				if(isSave){
					obj.id = hotspot.id;
				}

				proxy.hotspotAddLink(obj, function(data){
					if(!data.success){
						msg(data.errMsg);
						return;
					}
					
					_this.lable.model.close();
					_this.link.model.close();
					id = data.id;
				})

				return id;
			}

			this.onupdatestyle = function(data, hotspot) {
				_this.hotspotElement.css("top", data.y - 5);
			}

			this.addView = function(className, title, content){
				var obj = {};
				var self = this;

				var button = $("<div class='hotspot-i hotspot-" + className + "'><i class='icon-" + className + "'/></div>").appendTo(this.hotspotElement);

				if(title && content){
					var model = $("<div class='hotspot-"+className + "-model'/>").appendTo(button).model({title:title,content: content,hasButton:false});

					button.find(".icon-"+className).click(function(){
						var _this = $(this).parents(" .hotspot-i");
						var hotspot = _this.data("hotspot");
						var name = _this.data("name");

						$.each(self.listButton, function(k, v){
							if(v.isShow && name != k){
								v.model.close();
								v.isShow = false;
							}
						})

						if(!hotspot.isShow){
							hotspot.model.open();
							hotspot.isShow = true;
						}
					});

					obj.button = button;
					obj.model = model;
					obj.modelElement = model.element;
					obj.isShow = false;

					button.data("hotspot", obj);
					button.data("name", className);
					_this.listButton[className] = obj;

					button.on("close", function(){
						obj.isShow = false;
					})
				}


				return obj;
			}
			this.initLink = function(data){
				var scenes = krpanoPluginJs.getCurrScenes();
				var self = this;

				var html = $("<ul/>");

				for(var i = 0 in scenes) {
					var li = $("<li/>").appendTo(html).html(scenes[i].title).data("scene", scenes[i]).click(function(){
						var scene = $(this).data("scene");

						html.find("li").removeClass("curr");
						$(this).addClass("curr");

						_this.hotspotFn.saveHotspot({
							data: {
								sceneId: scene.id,
								sceneName: scene.name
							}
						});
					});

					if(data && data.sceneId == scenes[i].id){
						li.addClass("curr");
					}
				}

				this.link = this.addView("link", "选择连接场景", html);
			},
			this.initLabel = function(data, isSave){
				var self = this;
				//var iconPacks = krpanoPluginJs.hotspotIconList();
				var iconTab = {list:krpanoPluginJs.getIconPackage()};
				var html = $(template(link_icon, iconTab));
				var listIcons = html.find(".listIcon");
				var liticonUl= html.find(".apply_w");
				var liticonLi= html.find(".apply_array");
				//底部表情包切换
				var btn = html.find(".apply");
				botscroll(btn);

				//单击切换表情包
	 			html.on("click",".apply_array",function(){
	 				liticonLi.removeClass("curr");
	 				$(this).addClass("curr");
	 				var index = $(this).index();
	 				html.find(".getSpot").hide();
	 				html.find(".getSpot").eq(index).show();
	 			})

				for(var i = 0; i < iconTab.list.length; i++) {
					var ul = $("<ul class='getSpot'/>").appendTo(listIcons);

					for(var x = 0; x < iconTab.list[i].styleList.length; x++) {
						var icon = iconTab.list[i].styleList[x];
						var li = $("<li/>").appendTo(ul);

						li.click(function(){
							var icon = $(this).data();
							listIcons.find(".curr").removeClass("curr");
							$(this).addClass("curr");
							
							_this.hotspotFn.loadStyle(icon.name);

							_this.lable.model.close();
							return false;
						}).data(icon);
						
						$("<img>").appendTo(li).attr("src", icon.thumb);

						if(parseInt(hotspot.icon_id) == icon.iconid){
							li.addClass("curr");
							liticonUl.find("li:eq(" + i + ")").click();
						}
					}
				}

				this.lable = this.addView("label", "选择图标样式", html);
				listIcons.mCustomScrollbar("destroy");
			},
			this.initDelete = function(){
				var self = this;
				var html = $("<p>确定删除此连接器?</p><div><button type='button' class='cancel'>取消</button><button type='button' class='sure confirm'>确定</button></div>");
				var deleteView = this.addView("delete", "提示信息", html);
				
				deleteView.modelElement.on("confirm", function(){
					_this.hotspotFn.removeHotspot();
				});
			}
		}
	}

	return X;
})
)