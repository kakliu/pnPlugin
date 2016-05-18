var krpano;
var plugin;
window.panoId = panoId = pano.id;
var u = navigator.userAgent;
window.isMb = !!u.match(/AppleWebKit.*Mobile.*/);
window.isPad = u.indexOf('iPad') > -1;

define([
		'jquery',
		'template',
		'krpanoPluginJs',
		'scene',
		'proxy',
		'layer',
		'store/toolbar.tpl',
		'css!common/basicCommon.css',
		'css!store/toolbar.css',
		// 弹窗
		'css!skin/layer.css'
	], function($,template,krpanoPluginJs,scene,proxy){

		function X(krpano, plugin){
			var self = this;
			this.init(krpano, plugin);
		}
		var j = 0;
		window.currLayer;
		window.layerMsg = function(options){
			return layer.open(
				$.extend({
					type:1,
					closeBtn:1,
					shade:0,
					btn:false,
					shadeClose:false,
					move:false,
					shife:4,
					moveType:true,
					end: function(){
						if(currLayer){
							currLayer.data("hide")();
						}
					}
				},options)
			);
		}
		X.prototype = {
			initFn: true,
			init: function(krpano, plugin){
				krpanoPluginJs.init(krpano, plugin);				
				var toolbarHtml = this.toolbarHtml =$(template(toolbar,{}));
				// var isMb = krpano.device.mobile;
				var u = navigator.userAgent
				var isMb = !!u.match(/AppleWebKit.*Mobile.*/)
				toolbarList = toolbarHtml.find(".store-toolbar");
				toolbarMore = toolbarHtml.find(".more");
				krpanoPluginJs.addChilde(toolbarHtml, true);
				new scene(this);
				//判断场景是否显示
				proxy.componentGet({
					panoId: panoId	
				}, function(result){
					if(result.success){
						for(i= 0;i<result.data.length;i++){
							var name = result.data[i].name;
							var value = result.data[i].value;
							if(name == "场景列表" && value == 1){
								toolbarHtml.find(".set").addClass("currShow");
							}
						}
					}
				})
				
				var cover = pano.thumb;
				var mingcheng = pano.name;
				var userId = pano.userId;
				if(!userId){
					var touxiangHtml ='<div class="touxiang"><img src="'+ cover +'" /><p>' + mingcheng + '</p></div>';
					krpanoPluginJs.addChilde(touxiangHtml, true);
				}
				
					
				var ZambiaHtml = '<div class="vote">\
								<img class="dianzan" src="../images/dianzan.png" />\
								<img class="gif" src="../images/dianzan.gif" />\
								<div class="guanzhu">\
									<div class="liulan">\
										<img src="../images/liulan.png" />\
										<p class="uvNum">0</p>\
									</div>\
									<div class="shouyexiaozan">\
										<img src="../images/shouyexiaozan.png" />\
										<p class="zanNum">0</p>\
									</div>\
								</div>\
							</div>';				
				krpanoPluginJs.addChilde(ZambiaHtml, true);	
				
				
				$(".dianzan").click(function() {
					dianzan();
					$(".gif").show();
					$(".dianzan").hide();
					window.setTimeout(hiddenMsg, 1250);
				})
				
				function hiddenMsg() {
					$(".gif").hide();
					$(".dianzan").show();
				}
					
				function dianzan(panoid) {
					proxy.postZan({
						panoId: panoId
					}, function(data) {
						if(data.success) getZan();		
					})
				}
					
					
				function getZan() {
					proxy.Zambia({
						panoId: panoId
					}, function(data) {
						var data=data.data;
						$('.uvNum').text(data.uv)
						$('.zanNum').text(data.support)
					})				
				}
				
				getZan();
				
				//单击更多展开显示
				toolbarMore.click(function(){
					var curr = this;

					setTimeout(function(){
						var btnCommentLen = $('.toolbar-all').find('.btnComment').length;
						var toolbarLi = toolbarList.find('li:not([style])').length - btnCommentLen;
						var toolbarLiHeight = toolbarList.find('li').height() + 22;
						var toolbarHeight = toolbarLiHeight * toolbarLi -6;
						if(toolbarList.hasClass("store-toolbar")){
							toolbarList.removeClass("store-toolbar");
							toolbarList.css({"height":"0px"}).animate({"height":toolbarHeight},'swing');
							$(curr).addClass("curr");
						} else{
							toolbarList.addClass("store-toolbar");
							toolbarList.css({"height":toolbarHeight}).animate({"height":"0px"},'swing');
							$(curr).removeClass("curr");
						}						
					},50);

				});
 

				//点击导航
				if(isMb&&!isPad) {
					$('.toolbar-all').on('click','li',function(){
						if($(this).hasClass("btnComment") || !$(".showClass").height()>0) return false;
						$(".btnMore").trigger("click");
					});					
				}
				krpanoPluginJs.addChilde("", true);

				//手机横屏进入VR模式

				function enterVr() {
				    var curWidth = $(window).width();
				    var curheight = $(window).height();
				    var mql = window.matchMedia("(orientation: portrait)");
				    function changPortrait(m) {
				        if (m.matches) {
				            krpano.call("plugin[WebVR].exitVR()");
				        } else {
				            var isFocus = $("textarea:focus").length > 0;
				            if (!isFocus) {
				                layer.closeAll();
				                krpano.call("plugin[WebVR].enterVR()");
				            };
				        }
				    }

				    if (isMb && !isPad) {
				        changPortrait(mql);
				        mql.addListener(changPortrait);
				    }
				}
				setTimeout(enterVr,6000);

				// 监听全景高度

				/**
				 * 函数节流方法
				 * @param Function fn 延时调用函数
				 * @param Number delay 延迟多长时间
				 * @param Number atleast 至少多长时间触发一次
				 * @return Function 延迟执行的方法
				 */
				function throttle(fn, delay, atleast) {
				    var timer = null;
				    var previous = null;
				    return function() {
				        var now = +new Date();
				        if (!previous) previous = now;
				        if (now - previous > atleast) {
				            fn();
				            previous = now;
				        } else {
				            clearTimeout(timer);
				            timer = setTimeout(function() {
				                fn();
				            }, delay);
				        }
				    }
				}

				var resizeTimer=null;
				$(window).on('resize', function() {
				    if (resizeTimer) {
				        clearTimeout(resizeTimer)
				    }
				    resizeTimer = setTimeout(function() {
				        var isFocus = $("textarea:focus").length > 0;
				        if (isFocus) {
				            var panoHeight = $("#krpanoSWFObject canvas").height();
				            $("#panoView").height(panoHeight);
				            $("body").height(panoHeight);
				            return false;
				        }
				        var winHeight = $(window).height();
				        $("#krpanoSWFObject canvas").height(winHeight);
				        $("#panoView").height(winHeight);
				    }, 300);
				});

			},
			addPlugin: function(op) {
				var self = this;
				var icon = {};
				var className;
				if(typeof op.icon === "object"){
					className = op["icon"]["className"];
				} else {
					className = op.className ? op.className : "";
				}
				
				var plugin = $("<li class='view-set " + className +"'><img src='' class='checked-scene'></li>");
				
				j++;
				if(j >= 1){
					toolbarMore.show();
				} else {
					toolbarMore.hide();
				}
				if(typeof op.icon === "object"){
					icon = op.icon.icon;
					plugin.find("img").attr("src",icon);
					self.setIcon(plugin,icon);
				}else if(typeof op.icon === "string"){
					icon = op.icon;
					plugin.find("img").attr("src",icon);
					self.setIcon(plugin,icon);
				}else{
					icon = op.icon.oldIcon;
					plugin.find("img").attr("src",icon);
					self.setIcon(plugin,icon);
				}
//				plugin.mouseover(function(){
//					if($(this).data("curr") == false){
//						icon = op.icon.hover;
//						$(this).find("img").attr("src",icon);
//					}
//				}).mouseout(function(){
//					if($(this).data("curr") == false){
//						icon = op.icon.icon;
//						$(this).find("img").attr("src",icon);
//					}
//				})
				plugin.data("plugin", op.plugin).data("curr", false).data("options", op);
				
				if(op.content){
					var content = $("<div/>").addClass("toolbar-content").append(op.content).appendTo(plugin);
					
					plugin.data("show", function(){
						var height = content.outerHeight() + 40;
						plugin.animate({height: height}, "normal");
						content.show();
						icon = op.icon.active;
						plugin.find("img").attr("src",icon);

						if(op.autoClick != true){
							plugin.data("curr", true);
						}
					}).data("hide", function(){
						plugin.animate({height: 40}, "normal").data("curr", false);
						plugin.data("curr", false);
						plugin.data("plugin").hide();
						icon = op.icon.icon;
						plugin.find("img").attr("src",icon);
					});
				} else {
					plugin.data("show", function(){
						plugin.data("plugin").show();
						icon = op.icon.active;
						plugin.find("img").attr("src",icon);
						
						if(op.autoClick != true){
							plugin.data("curr", true);
						}
					}).data("hide", function(){
						plugin.data("plugin").hide();
						plugin.data("curr", false);
						icon = op.icon.icon;
						plugin.find("img").attr("src",icon);
					});
				}
				
				plugin.click(function(){
					if($(this).data("curr") == false || op.realTimeClick){
						self.hideAll(op);
						window.currLayer = $(this);
						$(this).data("show")();
						icon = op.icon.active;
						plugin.find("img").attr("src",icon);
					}
				})
				
				return plugin;
			},
			hideAll: function(){
				// var self = this;
				// var icon = {};
				// var plugin = $("<li class='view-set'><img src='' class='checked-scene'></li>");
				$.each($(toolbarList).children("li"), function(i, v){
					var options = $(this).data("options");

					if(!(options && options.autoHide == true)){
						if($(this).data("curr") == true) {
							$(this).data("hide")();
							$(this).data("curr", false);
							$(toolbarList).children("li").removeClass("curr");
							// icon = op.icon.icon;
							// plugin.find("img").attr("src",icon);
						}
					}
				});
			},
			setIcon: function(plugin,icon){
				plugin.appendTo(toolbarList);
			}
		}

		return X;
	});