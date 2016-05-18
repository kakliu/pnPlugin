window.basePath = "http://ypano.duc.cn/v2.0";
require.config({
	baseUrl:basePath,    
	paths: {
    	'jquery':'depend/jquery.min',
    	'template': 'depend/template',
    	'css': 'requirejs/css',
    	'text': 'requirejs/text', 
    	'krpanoPluginJs': 'util/krpano',
    	// 弹窗
		'layer':'modul/layer',
		// 设置焦距范围
		'focaldistance':'focaldistance/focaldistance',
		'rangeSlider':'rangeSlider/rangeSlider',
		'menu':'addlink/menu'
    },
    shim:{
    	'layer':['jquery'],
    	'focaldistance':['jquery','layer'],
    	'rangeSlider':['jquery'],
    	'menu':['jquery']
    }
});
var krpano;
var plugin;

define([
		'jquery',
		'template',
		//'krpanoPluginJs',
		'toolbar/toolbar.tpl',
		// 弹窗
		'layer',
		'focaldistance',
		// 焦距范围
		'rangeSlider',
		// 添加连接器
		'menu',
		'addlink/menu.tpl',
		'css!common/common.css',
		'css!common/basicCommon.css',
		'css!toolbar/toolbar.css',
		// 弹窗
		'css!skin/layer.css',
		'css!focaldistance.css',
		// 设置焦距范围
		'css!ion.rangeSlider.css',
		'css!ion.rangeSlider.skinHTML5.css',
		'css!rang.css',
		// 添加连接器
		'css!addlink/menu.css'
	], function($,template/*,krpanoPluginJs,toolbar*/){

		function X(krpano, plugin){
			this.init(krpano, plugin);
		}

		X.prototype = {
			init: function(krpano, plugin){
				// krpanoPluginJs.init(krpano, plugin);
				var toolbarHtml=$(template(toolbar,{}));
				$("body").append(toolbarHtml);
				var menu=$(template(menu,{}));
				$("body").append(menu);
				// 设置初始视角
				$(".set").click(function(){
					var clickthis=this;
					$(this).addClass("curr");
					layer.msg('保存成功', {
					    icon: 1,
					    time: 2000,//2秒关闭（如果不配置，默认是3秒）
					    area: ['60px', '30px'],
					}, function(){
					    $(clickthis).removeClass("curr");
					}); 
				})
				// 设置焦距范围
				$(".ji-ju").click(function(){
					var curr=this;
					$(this).addClass("curr");
					layer.open({
					    type: 0,
					    title: "焦距范围",
					    closeBtn: 1,
					    shadeClose: false,
					    skin: 'setdistance',
					    btn:false,
					    // move: true,是否允许拖动
					    // offset: ['10px', '70%'],弹出框位置
					    shift:4,
					    area: ['220px', '166px'],
					    moveType:true,
					    // icon :0,图标
					    content: '<div class="distance">\
						    <div class="index">\
						    	<input id="range_44" />\
						    </div>\
						    <div class="recent">\
						    	<div class="recent-descr">限制最近</div>\
						    	<input type="text" class="recent-num" readonly="readonly" >\
						    </div>\
						    <div class="farthest">\
						    	<div class="farthest-descr">限制最远</div>\
						    	<input type="text" class="farthest-num" readonly="readonly" >\
						    </div>\
						</div>\
						<script type="text/javascript">\
							$(document).ready(function () {\
								var $range = $("#range_44"),\
								$result = $("#result_44");\
								var track = function (data) {\
									delete data.input;\
									delete data.slider;\
									if (JSON) {\
										$result.html(JSON.stringify(data, null, 2));\
									} else {\
										$result.html(data.toString());}\
									};\
									$range.ionRangeSlider({\
										type: "three",\
										min: 20,max: 120,\
										from: 100,\
										centent:80,\
										to: 300,\
										step: 1,\
										onStart: changeval,\
										onChange: changeval,\
										onFinish: track\
									});\
									function changeval(data){\
										var min=$(".irs-from").html();\
										$(".recent-num").val(min);\
										var max=$(".irs-to").html();\
										$(".farthest-num").val(max);\
									}\
								});\
							</script>',
					});
					// layer.close($(this).removeClass("curr"));
					// 单击设置关闭之后该li去掉curr
					$(".layui-layer-close1").click(function(){
						$(curr).removeClass("curr");
					})
				})
				// $(".toolbar").on("click","li",function(){
				// 	var title=$(this).attr("title");
				// 	$("." + tab).show().siblings().hide();
				// 	if($(this).prop("className")==="add-spot"){

				// 		$(this).addClass("curr");
				// 		$(this).children("choose-add-style").show();
				// 		$(this).siblings().removeClass("curr");
				// 	}
				// 	else{
				// 		$(this).addClass("curr");
				// 		$(this).siblings().removeClass("curr");
				// 	}
				// })
			},

			_initKrpanoCanvas: function(xmlURL, vars) {
				var self = this;
				!vars?vars={}:vars;
				vars.events[main].onxmlcomplete = "jscall(flashCall())";
				embedpano({swf:"tour.swf", xml:xmlURL, target:"pano", html5:"only", passQueryParameters:false, vars:vars, id:"krpanoSWFObject" });

				window.flashCallJs = function(){
					self.krpano = document["krpanoSWFObject"];
				}
			}
		}

		return X;
	});