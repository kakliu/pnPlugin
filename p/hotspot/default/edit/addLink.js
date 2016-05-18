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
        	'p/hotspot/default/edit/index.tpl',
			'p/hotspot/default/edit/addfont.tpl',
		    //连接器底部的表情包左右切换
		    'depend/tabLeftRight/simplefoucs',
        	"css!p/hotspot/default/edit/index"
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

	fn.edit = function() {
		self = this;

		this.init = function(dom){
			this.dom = dom;
			hotspotFn = registehotspot.getInstance("link_scene", {
				element: this.spot,
				isSaveMove: true,
				saveFlag: true
			});
		}



		this.show = function(){

			hotspot = hotspotFn.addHotspot({
				iconName: 'spoticon2',
				data: {}
			});

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
				this.hotspotElement = $("<div class='hotspot'/>").delegate(".model .contents","mousedown",function(){
					return false;
				});

				this.initLink(data);
				this.initLabel();
				this.initDelete();
				
				return this.hotspotElement;
			}

			this.onresize = function(){
			}

			this.onremove = function(){
				//alert(1);
			}

			this.onsave = function(data, hotspot) {
				var scene = data.scene;
				var _this = $(this);
				var data = krpanoPluginJs.updateHotspot(hotspot.name);
				
				if(!data.success){
					msg(data.errMsg);
					return;
				}
				
				proxy.hotspotAddLink({
					hotspotId: hotspot.id,
					linkedId: scene.id,
					linkedScene: scene.name
				},function(data){
					if(!data.success){
						msg(data.errMsg);
						return;
					}else{
						msg("添加成功");
					}
					
					var hotspot = $(_this).parents(".hotspot-i").data("hotspot");
					hotspot.model.close();
				})
			}

			this.onupdate = function(data){
			}

			this.onclick = function(){

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
				var scenes = krpanoPluginJs.getScene();
				var self = this;

				var html = $("<ul/>");

				for(var i = 0 in scenes) {
					$("<li/>").appendTo(html).html(scenes[i].title).data("scene", scenes[i]).click(function(){
						var scene = $(this).data("scene");
						_this.hotspotFn.saveHotspot({
							data: {
								sceneId: scene.id,
								sceneName: scene.name
							}
						});
					});
				}

				this.addView("link", "选择连接场景", html);
				
				$(".hotspot-link-model .content").mCustomScrollbar();
			},
			this.initLabel = function(){
				var self = this;
				//var iconPacks = krpanoPluginJs.hotspotIconList();
				var iconTab = {list:krpanoPluginJs.getIconPackage()};
				var html = $(template(addfont, iconTab));
				var listIcons = html.find(".listIcon");
				var liticonUl= html.find(".apply_w");
				var liticonLi= html.find(".apply_array");

				for(var i = 0; i < iconTab.list.length; i++) {
					var ul = $("<ul class='getSpot'/>").appendTo(listIcons);
					for(var x = 0; x < iconTab.list[i].styleList.length; x++) {
						var icon = iconTab.list[i].styleList[x];
						var li = $("<li/>").appendTo(ul);
						li.click(function(){
							var _this = $(this);
							var icon = $(this).data();
							
							_this.hotspotFn.loadStyle(icon.name);

							hotspot.model.close();
							return false;
						}).data(icon);
						
						$("<img>").appendTo(li).attr("src", icon.thumb);
					}
				}

				//单击切换表情包
	 			html.on("click",".apply_array",function(){
	 				liticonLi.removeClass("curr");
	 				$(this).addClass("curr");
	 				var index = $(this).index();
	 				html.find(".getSpot").hide();
	 				html.find(".getSpot").eq(index).show();
	 			})

				this.addView("label", "选择图标样式", html);
				$(".hotspot-label-model .content .listIcon").mCustomScrollbar();
				//底部表情包切换
				botscroll();
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