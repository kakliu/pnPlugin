define([
	'jquery',
	'template',
	'krpanoPluginJs',
	'proxy',
	//组名上下滚动
	'store/scene/scene.tpl',
	//滚动条
	'../depend/scrollBar/jquery.mCustomScrollbar.concat.min.js',
	'css!../depend/css/jquery.mCustomScrollbar.css',
	'css!store/scene/scene.css'
	],function($,template,krpanoPluginJs,proxy){
		var self;

		function X(node){
			self = this;
			this.node = node;
			this.init();
		}

		X.prototype = {
			init: function(){
				var sceneList = [
					{
						"name": "厨房",
						"list":[
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/scenssse.png",
								"title": "81865927"
							},
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/scenssse.png",
								"title": "81865927"
							},
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/scenssse.png",
								"title": "81865927"
							},
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/scenssse.png",
								"title": "81865927"
							},
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/scenssse.png",
								"title": "81865927"
							},
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/scenssse.png",
								"title": "81865927"
							}

						]
					},

					{
						"name": "卧室",
						"list":[
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/1234.png",
								"title": "aaaa"
							}
						]
					},
					{
						"name": "卧室",
						"list":[
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/1234.png",
								"title": "aaaa"
							}
						]
					},
					{
						"name": "卧室",
						"list":[
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/1234.png",
								"title": "aaaa"
							}
						]
					},
					{
						"name": "卧室",
						"list":[
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/1234.png",
								"title": "aaaa"
							}
						]
					},
					{
						"name": "卧室",
						"list":[
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/1234.png",
								"title": "aaaa"
							}
						]
					},
					{
						"name": "卧室",
						"list":[
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/1234.png",
								"title": "aaaa"
							}
						]
					},
					{
						"name": "卧室",
						"list":[
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/1234.png",
								"title": "aaaa"
							}
						]
					},
					{
						"name": "卧室",
						"list":[
							{
								"id": "485",
								"index": 0,
								"name": "vvnm3ovx",
								"thumburl": "../v2.0/store/images/1234.png",
								"title": "aaaa"
							}
						]
					}
				];
				var element = $(template(scene,{"data": sceneList}));
	         	krpanoPluginJs.addChilde(element, true);
				this.layerIndex;
				element.find(".group-list").eq(0).addClass("curr");
				//单击不同组切换不同组的场景
				element.on("click",".group-list",function(){
					var index = $(this).index();
					element.find(".group-list").removeClass("curr")
					$(this).addClass("curr");
					element.find(".scene-list").hide();
					element.find(".scene-list").eq(index).show();
				})
				//组名上下切换
				var height = element.find(".group").height();
				// if(height > 500){
				// 	element.find(".pre").show();
				// 	element.find(".next").show();
				// } else{
				// 	element.find(".pre").hide();
				// 	element.find(".next").hide();
				// }
				// var legthCj = height-500;
				// var top = 0;
				// element.on("click",".pre",function(){
				// 	top = top - 60+'px';
				// 	element.find(".group").css("top",top);
				// })
				$(".store-toolbar .set").data("hide",function(){
					var curr = this;
					if(self.layerIndex){
						layer.close(self.layerIndex);
						self.layerIndex = null;
						$(curr).removeClass("curr");

					}
				}).data("curr", false);

				// 选择场景
				$(document).on("click",".set",function(){
					//var curr = this;
					
					if(!this.layerIndex){
						self.node.hideAll();
						currLayer = $(".set");
						$(".set").data("curr", true);
						$(this).addClass("curr");
						self.layerIndex = layerMsg({
						    type: 1,
						    title: false,
						    closeBtn: 1,
						    skin: ['layui-layer-nobg'], //没有背景色
						    shadeClose: true,
						    content: element				
						});
					}
				})	
				$(".scene-all").mCustomScrollbar();				
			}
		}
	return X;
})
