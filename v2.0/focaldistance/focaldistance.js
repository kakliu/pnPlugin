define([
	'jquery',
	'template',
	'krpanoPluginJs',
	'proxy',
	'rangeSlider/rangeSlider',
	'focaldistance/focaldistance.tpl',
	// 设置焦距范围
	'css!rangeSlider/ion.rangeSlider.skinHTML5.css',
	'css!rangeSlider/rang.css',
	'css!rangeSlider/ion.rangeSlider.css'
	],function($,template,krpanoPluginJs,proxy){
		var self;
		var view = {};
		var views = {};

		function X(node){
			self = this;
			this.node = node;
			this.init();
		}

		X.prototype = {
			init: function(){
				//加载初始view值
				var focaldistance=$(template(distance,{}));
				krpanoPluginJs.addChilde(focaldistance, true);

				view = krpanoPluginJs.getView(true);

				//焦距范围
				self.range = $(document).find("#range_44"),
				$result = $(document).find("#result_44");
				self.range.ionRangeSlider({
					type: "three",
					min: 20,
					max: 120,
					from: view.min,
					centent:view.fov,
					to: view.max,
					step: 1,
					grid: true,
					onStart: self.setView,
					onChange: self.setView,
					onFinish:self.track
				});	

				this.layerIndex;

				$(".ji-ju").data("hide",function(){
					if(self.layerIndex){
						layer.close(self.layerIndex);
						self.layerIndex = null;
					}
				}).data("curr", false);

				// 设置焦距范围
				$(document).on("click",".ji-ju",function(){
					var curr=this;
					
					view = self.update();
					
					if(!this.layerIndex){
						self.node.hideAll();
						currLayer = $(".ji-ju");
						$(".ji-ju").data("curr", true);
						self.layerIndex = layerMsg({
						    title: "焦距范围",
						    area: ['220px', '166px'],
						    moveType:true,
						    content: $('#distance')				
						});
					}
				})	
				
				$(document).on("sceneChange",function(){
					self.update();
				});
			},
			//页面加载视角范围获取
			setView: function(data){
				view.fov=data.centent;
				view.min=data.from;
				view.max=data.to;
				$(document).find(".initvisual-val").val(view.fov);
				$(document).find(".recent-num").val(view.min);
				$(document).find(".farthest-num").val(view.max);
				krpanoPluginJs.viewreset(view.fov, view.min, view.max);
				
				views[krpanoPluginJs.getCurrScene().name] = view;
			},
			//视角范围保存
			track: function (data) {
				proxy.setLimitView({
					sceneId: krpanoPluginJs.getSceneId(),
	            	fov: data.centent,
	            	fovMin: data.from,
	            	fovMax: data.to
	            },function(data){
	            	if(data.success){
	            		msg("保存成功");
	            	} else{
	            		msg(data.errMsg);
	            	}
	            })
			},
			update: function(){
				if(views[krpanoPluginJs.getCurrScene().name]){
					view = views[krpanoPluginJs.getCurrScene().name];
					krpanoPluginJs.viewreset(view.fov, view.from, view.to);
				} else {
					view = krpanoPluginJs.getView();
				}
				
				self.range.data("ionRangeSlider").update({
					from: view.min,
					centent:view.fov,
					to: view.max
				});
				
				$(document).find(".initvisual-val").val(view.fov);
				$(document).find(".recent-num").val(view.min);
				$(document).find(".farthest-num").val(view.max);
				
				return view;
			}
		}
	return X;
})
