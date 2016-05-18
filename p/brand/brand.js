(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define([
			'jquery',
			'template',
			'krpanoPluginJs',
			'proxy',
			'layer',
			'css!/p/brand/brand.css',
		], factory);
	} else {
		// 全局模式
		factory(jQuery, template, krpanoPluginJs, proxy, layer);
	}
}(function($, template, krpanoPluginJs, proxy, layer) {
	var brandHtml;
	var ZambiaHtml;
	var view = {
		options: {
			className: "btnBrand"
		},
		init: function(dem) {
			if (!pano.userId) {
				dem.hide();
				return;
			}
			proxy.brand({
				userId: pano.userId
			}, function(data) {
				
				var data = data.data;
				var music = data.musicUrl;
				data.cavor = pano.thumb;
				console.log(data);
				if(music){
					krpanoPluginJs.playMusic(music);
				}
				
				var name = data.shopName;
				var logo = data.shopLogo;
				var touxiangHtml ='<div class="touxiang">\
										<img src="' + logo + '" />\
										<p  title="' + name + '">' + name + '</p>\
									</div>';
				krpanoPluginJs.addChilde(touxiangHtml, true);
				
				if (data["content"].length > 0) {
					
					brandHtml = '<div class="touxiang-gushineirong">\
								<div class="tou">\
									<div class="kaitou"></div>\
									<p>品牌故事</p>\
								</div>\
								<div class="jieshaoneirong">\
									<div class="gundongtiao">\
										<%for (var i = 0; i < data["content"].length; i++){%>\
										<% if (!!data["content"][i]["image"]){%><img src="<%=data["content"][i]["image"]%>" class="pp-picture" /><%}%>\
										<div class="jieshao">\
											<% if (!!data["content"][i]["content"]){%><p><%=data["content"][i]["content"]%></p><%}%>\
										</div>\
										<%}%>\
										<div class="jishuzhichi">\
											<p>技术支持由浙江云瞳数字科技有限公司提供</p>\
											<a href="http://www.yuntongzi.com/" target="_blank">详情了解></a>\
										</div>\
									</div>\
								</div>\
								<img class="guanbi" src="../images/close1.png" />\
						</div>';

					brandHtml = $(template(brandHtml, {
						data: data
					}));
					$(".touxiang img").click(function() {
						dem.click();
					});

					krpanoPluginJs.addChilde(brandHtml, true);

					brandHtml && brandHtml.find(".guanbi").off("click").on("click",function() {
						$(".brandDiv").addClass("myanim-b0");
						var timer = setTimeout(function() {
							view.hide();
							clearTimeout(timer);
						}, 300);
					});
				}
				dem.hide();
			})
		},

		show: function() {
			this.layerIndex = null;
			if (isMb && !isPad) {
				if (!this.layerIndex) {
					this.layerIndex = layerMsg({
						title: "",
						area: ['100%', '100%'],
						closeBtn: 0,
						shade: 0.000001,
						shadeClose: false,
						shift: null,
						zIndex: 10000,
						offset: ['auto', '0'],
						skin: ['setdistance plugin_layer brandDiv myanim-b'],
						content: brandHtml
					});
				}
			} else {
				if (!this.layerIndex) {
					this.layerIndex = layerMsg({
						title: "",
						area: ['38rem', '85%'],
						closeBtn: 0,
						shade: .3,
						shadeClose: false,
						shift: null,
						zIndex: 10000,
						offset: ['auto', '0'],
						skin: ['setdistance plugin_layer brandDiv myanim-b'],
						content: brandHtml
					});
				}
			}
		},
		hide: function() {
			if (this.layerIndex) {
				layer.close(this.layerIndex);
				this.layerIndex = null;
				return false;
			}

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