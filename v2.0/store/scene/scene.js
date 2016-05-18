
define([
	'jquery',
	'template',
	'krpanoPluginJs',
	'proxy',
	//组名上下滚动
	'store/scene/scene.tpl',
	//滚动条
	'depend/scrollBar/jquery.mCustomScrollbar.concat.min',
	'css!depend/css/jquery.mCustomScrollbar',
	'css!store/scene/scene'
	],function($,template,krpanoPluginJs,proxy){
		var self;
		var element;
		function X(node){
			self = this;
			this.node = node;
			this.init();
		}

		X.prototype = {
			init: function(){
				var _this = this;
				$.ajax({
					type: "POST",
			        url: "/pano/getSceneList",
			        dataType: "json",
			        data:{
			        	id:panoId
			        },
	        		success: function(data){
	        			if(data!=""){
		        			element = $(template(scene,data));
				         	krpanoPluginJs.addChilde(element, true);

				         	// var btnPush = element.find('.btnPush');
				         	// element.append(btnPush);

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
							var length = element.find(".tabshow li").length;
							if(height > 520){
								element.find(".pre").show();
								element.find(".next").show();
							} else{
								element.find(".pre").hide();
								element.find(".next").hide();
							}
							$(".store-toolbar .set").data("hide",function(){
								var curr = this;
								if(self.layerIndex){
									layer.close(self.layerIndex);
									self.layerIndex = null;
									$(curr).removeClass("curr");

								}
							}).data("curr", false);


							element.on('click','.btnPush',function(){
								$('.layerScene').addClass("myanim-a0");
								var timer = setTimeout(function(){
									layer.close(_this.layerIndex);
									_this.layerIndex = null;
									$(".btnMore").trigger("click");
									clearTimeout(timer);
								},300);

							})

							// 选择场景
							$(document).on("click",".set",function(){
								//var curr = this;	

								if(isMb && !isPad) {
									if(!_this.layerIndex){
										self.node.hideAll();
										currLayer = $(".set");
										$(".set").data("curr", true);
										$(this).addClass("curr");
										self.layerIndex = layerMsg({
										    type: 1,
										    title: false,
										    closeBtn: 0,
										    skin: ['layui-layer-nobg layerScene myanim-a'], //没有背景色
										    content: element,
										    shift: null,
										    offset:['auto','auto'],
										    end: function(){
										    	return false;
										    }	
										});
									}
									if(length <= 1) $(".layerScene").addClass("notab");

								} else {
									if(!_this.layerIndex){
										self.node.hideAll();
										currLayer = $(".set");
										$(".set").data("curr", true);
										$(this).addClass("curr");
										self.layerIndex = layerMsg({
										    type: 1,
										    title: false,
										    closeBtn: 0,
										    skin: ['layui-layer-nobg layerScene myanim-a'], //没有背景色
										    shadeClose:true,
										    content: element,
										    offset:['auto','auto']			
										});
									}
								}

							})
							//单击不同的场景切换
							element.on("click",".scene-list li",function(){
								var name = $(this).data("name");
								$(this).addClass('active').siblings().removeClass("active");
								krpanoPluginJs.sceneViewChange(name);
							})	
							$(".scene-all").mCustomScrollbar();
							
							$(".layerScene").addClass("notab");
							if(length <= 1){
								element.find(".tabshow").remove();
							}
						} else{
						}
	        		}
	        	})			
			},
			show:function(){

	    		this.layerIndex = layerMsg({
				    title: "",
				    area: ['700px', '452px'],
				    skin: ['setdistance plugin_layer map-alone'],
				    content: element
				});
			},
			hide:function(){
				if(this.layerIndex){
					layer.close(this.layerIndex);
				}	
			}
		}
	return X;
})


