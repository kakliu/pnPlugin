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
				
			},
			addPlugin: function(op) {
				var self = this;
				var plugin = $("<li class='li'><div class='toolbar-button'><i style='background: url("+op.icon+") no-repeat; background-size: 22px 22px;'/>"+op.name+"</div></li>").appendTo(this.toolbarHtml);

				plugin.data("plugin", op.plugin).data("curr", false);
				
				if(op.content){
					var content = $("<div/>").addClass("toolbar-content").append(op.content).appendTo(plugin);
					console.log(plugin);
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
			}
		}

		return X;
	});