(function(factory) {
if (typeof define === "function" && define.amd) {
	// AMD模式
	define([
		'jquery',
		'template',
		'krpanoPluginJs',
		'proxy',
		'layer',
		'css!/p/activity/activity.css',
	], factory);
} else {
	// 全局模式
	factory(jQuery, template, krpanoPluginJs, proxy, layer);
}
}(function($, template, krpanoPluginJs, proxy, layer) {
	var activityHtml;
	var userId;
	var view = {
			options: {
				icon: "/v2.0/images/sale.png",
				className: "btnActivity"
			},
			init: function(dem) {
				if(!pano.userId){
					dem.hide();
					return;
				} 
				proxy.getActivity({
						userId: pano.userId
					}, function(data) {

						var data = data.data;
						console.log(data);

						if (data.length > 0) {
							activityHtml = '<div class="sale-gushineirong">\
											<div class="tou">\
												<div class="kaitou"></div>\
												<p>活动促销</p>\
											</div>\
												<div class="xinxijiemian">\
													<div class="gundongtiao">\
														<%for(var i = 0; i < data.length; i++) {%>\
														<div class="saleneirongzu">\
															<div class="arrow-left"></div>\
															<img src="../images/huodong.png" />\
															<div class="saleneirong">\
																<p class="biaoti"><%=data[i].name%></p>\
																<div class="huodongneirong">\
																	<%for(var j = 0; j < data[i]["content"].length; j++) {%>\
																		<%if (data[i]["content"][j]["image"]) {%><img src="<%=data[i]["content"][j]["image"]%>" /><%}%>\
																		<%if (data[i]["content"][j]["content"]) {%><p class="neirong"><%=data[i]["content"][j]["content"]%></p><%}%>\
																	<%}%>\
																</div>\
																<p class="shijian"><%=data[i].startTime%>-<%=data[i].endTime%></p>\
															</div>\
														</div>\
														<%}%>\
													</div>\
												</div>\
											<img class="closea" src="../images/close1.png" />\
									</div>';

							activityHtml = $(template(activityHtml, {
								data: data
							}));

							krpanoPluginJs.addChilde(activityHtml, true);

							activityHtml.find(".closea").off("click").on("click",function() {
									$(".activityDiv").addClass("myanim-b0");
									if (isMb && !isPad) {
										$(".btnMore").trigger("click");
									};
									var timer = setTimeout(function() {
										view.hide();
										clearTimeout(timer);
									}, 300);
							});
							
							$(".saleneirongzu:last").css("border","0");
							
					} else {
						dem.hide();
					}

					$(".huodongneirong:first").css("display", "block");

					$(".saleneirongzu").click(function() {
						$(".huodongneirong").hide();
						$(this).children().children(".huodongneirong").show();
					});
				})
		},

		show: function() {
			console.log(activityHtml);

			if (isMb && !isPad) {
				if (!this.layerIndex) {
					this.layerIndex = layerMsg({
						title: "",
						area: ['100%', '100%'],
						closeBtn: 0,
						zIndex: 10000,
						shade: 0.000001,
						shadeClose: false,
						shift: null,
						offset: ['auto', '0'],
						skin: ['setdistance plugin_layer activityDiv myanim-b'],
						content: activityHtml
					});
				}
			} else {
				if (!this.layerIndex) {
					this.layerIndex = layerMsg({
						title: "",
						area: ['38rem', '85%'],
						closeBtn: 0,
						shade: .3,
						zIndex: 10000,
						shadeClose: false,
					    shift: null,
						offset: ['auto', '0'],
						skin: ['setdistance plugin_layer activityDiv myanim-b'],
						content: activityHtml
					});
				}
			}
		},
		hide: function() {
			if (this.layerIndex) {
				layer.close(this.layerIndex);
			}

			this.layerIndex = null;
		}
}

function X(krpano, plugin) {}

X.prototype = {
	//edit: edit,
	view: view,
	show: null,
	hide: null
}

return X;
}))