(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define([
			'jquery',
			'template',
			'krpanoPluginJs',
			'proxy',
			'layer',
			'css!p/contact/contact',
		], factory);
	} else {
		// 全局模式
		factory(jQuery, template, krpanoPluginJs, proxy, layer);
	}
}(function($, template, krpanoPluginJs, proxy, layer) {
	var element;
	var view = {
		options: {
			icon: "/v2.0/images/lianxi.png",
			className: "btnContact"
		},
		init: function(dem) {
			proxy.contact({
				panoId: panoId
			}, function(data) {

				var data = data.data;
				console.log(data);

				if (!!data.tel || !!data.address) {
					data.tel = data.tel ? data.tel : '对方尚未填写';
					data.address = data.address ? data.address : '对方尚未填写';
					element = '<div class="lianxi-jiemian">\
										<div class="gushineirong">\
											<img class="closea" src="../images/close1.png" />\
											<div class="tou">\
												<div class="kaitou"></div>\
												<p>联系商铺</p>\
											</div>\
											<div class="xinxijiemian">\
												<div class="gundongtiao">\
													<ul>\
														<li><img src="../images/phone.png">\
															<p onclick=\"location.href=\'tel:<%=data.tel%>\'\" class="firstP"><%=data.tel%></p>\
														</li>\
														<li style="border: 0;"><img src="../images/dizhi.png">\
															<p class="dizhi" title="<%=data.address%>"><%=data.address%></p>\
														</li>\
													</ul>\
												</div>\
											</div>\
										</div>\
									</div>';

					element = $(template(element, {
						data: data
					}));
				} else {
					dem.hide();
				}
				krpanoPluginJs.addChilde(element, true);

				element && element.find(".closea").off("click").on("click",function() {
									if (isMb && !isPad) {
										$(".btnMore").trigger("click");
										$(".contactDiv").addClass("myanim-b0");
									};
									var timer = setTimeout(function() {
										view.hide();
										clearTimeout(timer);
									}, 300);
				})
			})

		},

		show: function() {
			console.log(element);

			if (isMb && !isPad) {
				if (!this.layerIndex) {
					this.layerIndex = layerMsg({
						title: "",
						area: ['17.15rem', '16rem'],
						closeBtn: 0,
						zIndex: 10000,
						shade:0.000001,
					    shadeClose: false,
					    shift: null,
						skin: ['setdistance plugin_layer plugin-switch contactDiv myanim-b'],
						content: element
					});
				}
			} else {
				if (!this.layerIndex) {
					this.layerIndex = layerMsg({
						title: "",
						area: ['25rem', '136px'],
						closeBtn: 0,
						shade: .3,
						zIndex: 10000,
						skin: ['setdistance plugin_layer plugin-switch contactDiv'],
						content: element
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
		//		edit: edit,
		view: view,
		show: null,
		hide: null
	}

	return X;
}))