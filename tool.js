var krpano;
var plugin;

define([
		'jquery',
		'krpano',
	], function($,krpanoPluginJs){

		function X(krpano, plugin){
			this.init(krpano, plugin);
		}
		

		X.prototype = {
			initFn: true,
			init: function(krpano, plugin){
				krpanoPluginJs.init(krpano, plugin);
				
				var toolbarHtml = this.toolbarHtml =$(template(toolbar,{}));
				var menu=$(template(menu,{}));

				krpanoPluginJs.addChilde(toolbarHtml, true);
				krpanoPluginJs.addChilde(menu, true);

				new focaldistance(this);
				this.setSceneView();
				this.linker();
				this.hotspot();
			},
			setSceneView:function(){
				// 设置初始视角
				$(document).on('click','.set',function(){
					//加载初始视角值
					view = krpanoPluginJs.getView();

					proxy.setSceneViewById({
		            	sceneId: krpanoPluginJs.getSceneId(),
		            	hlookat: Math.round(view.ath),
		            	vlookat: Math.round(view.atv)
		            },function(data){
		            	if(data.success){
							$(this).addClass("curr");
							msg("保存成功");
						} else {
							msg(data.errMsg);
						}
		            })
				})		
			},
			linker:function(){
				$(".add-link").click(function(){
					krpanoPluginJs.addEditHotspot("link_scene","spoticon2");
				})
			},
			hotspot:function(){
				$(".add-spot").click(function(){
					krpanoPluginJs.addEditHotspot("spot","spoticon2");
				})
			},
			addPlugin: function(op) {
				var self = this;
				var plugin = $("<li class='li'><div class='toolbar-button'><i style='background: url("+op.icon+") no-repeat; background-size: 22px 22px;'/>"+op.name+"</div></li>").appendTo(this.toolbarHtml);

				plugin.data("plugin", op.plugin).data("curr", false);
				
				if(op.content){
					var content = $("<div/>").addClass("toolbar-content").append(op.content).appendTo(plugin);
					
					plugin.data("show", function(){
						var height = content.outerHeight() + 40;
						plugin.animate({height: height}, "normal");
						content.show();
						plugin.data("curr", true);
					}).data("hide", function(){
						plugin.animate({height: 40}, "normal").data("curr", false);
						plugin.data("curr", false);
						plugin.data("plugin").hide();
					});
				} else {
					plugin.data("show", function(){
						plugin.data("curr", true);
						plugin.data("plugin").show();
					}).data("hide", function(){
						plugin.data("plugin").hide();
						plugin.data("curr", false);
					});
				}
				
				plugin.click(function(){
					if($(this).data("curr") == false){
						self.hideAll();
						window.currLayer = $(this);
						$(this).data("show")();
					}
				})
				
				return plugin;
			}, 
			hideAll: function(){
				$.each($(this.toolbarHtml).children("li"), function(i, v){
					if($(this).data("curr") == true) {
						$(this).data("hide")();
						$(this).data("curr", false);
					}
				});
			}
		}

		return X;
	});