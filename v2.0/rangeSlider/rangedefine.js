define([
	'jquery',
	'template',
	// 'krpanoPluginJs',
	// 'shijiao/shijiao.tpl',
	'rangeSlider/rangeSlider',
	'css',
	'text',
	'css!rang.css',
	'css!ion.rangeSlider/css/ion.rangeSlider.css'
	],function($,template/*,krpanoPluginJs*/){
		var self;
		var view = {};

		function X(node){
			self = this;
			this.node = node;
			this.init();
		}

		X.prototype = {
			init: function(){
				//加载初始view值
				view = krpanoPluginJs.getView();
				//加载模板
				var element = $(template(shijiao, {thumb: krpanoPluginJs.replaceUrl(krpanoPluginJs.get("scene[get(xml.scene)].thumburl"))}));
				var title = element.find(".title").html();
				var content = element.find(".content").html();
				$("body").append("<div class='initial-view'><div><button type='button' class='view-submit'>设为初始视角</button><button type='button' class='view-reset'>重置</button></div><div class='view-img'><img src='../images/shijiao.png'><div></div>");
				var model = $("<div/>").appendTo(this.node).data("toolbar",this).addClass(element.attr("class")).model({title:title,content:content,hasButton:false});
				this.element = model.element;
				model.element.find(".title li").click(this.onClick);
				model.element.find(".title li:eq(0)").click();

				//焦距范围
				var range = model.element.find("#range_44"),
				$result = model.element.find("#result_44");
				range.ionRangeSlider({
					type: "three",
					min: 50,
					max: 150,
					from: view.from,
					centent:view.fov,
					to: view.to,
					step: 1,
					grid: true,
					onStart: this.setView,
					onChange: this.setView,
					onFinish: this.track
				});			
			},
			onClick:function(e) {
				if(!$(this).hasClass("curr")){
					var model = $(this).parents(".model");
					model.find(".title li").removeClass("curr");

					$(this).addClass("curr");
					model.find(".content li").removeClass("curr");
					model.find(".content li:eq("+$(this).index()+")").addClass("curr");
					if($(this).index()==0&&$(this).parents(".model-shijiao").show()){
						$("body").find(".initial-view").show();
					}
					else{
						$("body").find(".initial-view").hide();
					}

				}
			},
			show:function(){
				this.element.show();
				//var tab = $("#edit .toolbar li.curr").attr("title");
				if($(".moshijiao .title ul li").eq(0).hasClass("curr")){
					$("body").find(".initial-view").show();
				}
				else{					
					$("body").find(".initial-view").hide();
				}
			},
			hide:function(){
				this.element.hide();
				$("body").find(".initial-view").hide();
			},
			//页面加载视角范围获取
			setView: function(data){
				view.fov=data.centent;
				view.from=data.from;
				view.to=data.to;


				self.element.find(".initvisual-val").val(view.fov);
				self.element.find(".recent-num").val(view.from);
				self.element.find(".farthest-num").val(view.to);


				krpanoPluginJs.viewreset(view.fov, view.from, view.to);
			},
			//视角范围保存
			track: function (data) {
				var fov=self.element.find(".initvisual-val").val();
				var fovmin=self.element.find(".recent-num").val();
				var fovmax=self.element.find(".farthest-num").val();
				$.ajax({
		            type: "GET",
		            url: "/setSceneViewById",
		            dataType: "jsonp",
		            data:{
		            	relevanceId:"8353",
		            	hlookat: view.ath,
		            	vlookat: view.atv,
		            	fov: fov,
		            	fovmin: fovmin,
		            	fovmax: fovmax,
		            },
		            success: function(data){
		            	$("body").append("<div class='warm'>修改成功</div>");
		            	$(".warm").show().delay(5000).fadeOut();
		            	$(".warm").remove();
						//krpanoPluginJs.viewreset(initial,recent,last);
						///delete data.input;
						//delete data.slider;
						//if (JSON) {
							//$result.html(JSON.stringify(data, null, 2));
						//} else {
							//$result.html(data.toString());
						//}

		            }
		        })
			},
		}
		//设置初始视角
		$(document).on('click','.view-submit',function(){
			view = krpanoPluginJs.getView();
			$.ajax({
	            type: "GET",
	            url: "/setSceneViewById",
	            dataType: "jsonp",
	            data:{
	            	relevanceId:"8353",
	            	hlookat: Math.round(view.ath),
	            	vlookat: Math.round(view.atv),
	            },
	            success: function(data){
	            	$("body").append("<div class='warm'>保存成功</div>");
	            	$(".warm").show().delay(5000).fadeOut();
	            	$(".warm").remove();
	            }
	        })
		}),
		//重置
		$(document).on('click','.view-reset',function(){
			krpanoPluginJs.viewlookat(0,0);
		})
	return X;
})
