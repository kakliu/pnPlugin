(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define([
			'jquery',
			'template',
			'krpanoPluginJs',
			'proxy',
			'login/login',
			'layer',
			'css!p/commodity/commodity',
		], factory);
	} else {
		// 全局模式
		factory(jQuery, template, krpanoPluginJs, proxy, login, layer);
	}
}(function($, template, krpanoPluginJs, proxy, login, layer) {
	var commodityHtml;
	var userId;
	var goodsId;
	var isPraised;
	var view = {
		options: {
			icon: "/v2.0/images/liwu.png",
			className: "btnCommodity"
		},
		init: function(dem) {
			if(!pano.userId){
					dem.hide();
					return;
				}
			var isLogin = login.isLogin();

			if (isLogin) {
				login.login(function(user) {
					proxy.commodity({
						userId: pano.userId,
						loginUserId: user.id
					}, callback)
				});
			} else {

				proxy.commodity({
					userId: pano.userId
				}, callback)
			}

			function callback(data) {

				var data = data.data;
				console.log(data);
				if (data.length > 0) {
					commodityHtml = '<div class="liwu-gushineirong">\
											<div class="tou">\
												<div class="kaitou"></div>\
												<p>商品服务</p>\
											</div>\
											<div class="xinxijiemian">\
												<div class="gundongtiao">\
												<%for(var i = 0; i < data.length; i++) {%>\
													<div class="shangpxinxi">\
														<%if (data[i].image) {%><img src="<%=data[i].image%>" class="pp-picture" /><% } %>\
														<div>\
															<p class="xinxineirong"><%=data[i].name%></p>\
														</div>\
														<div>\
															<p class="jiage">￥<%=data[i].minPrice %></p>\
															<p class="guanzhushu"><%=data[i].praiseNum%></p>\
															<div class="<%if (data[i].isPraised){%>img2<% } else {%>img1<%}%>" data-pid="<%=data[i].id %>"></div>\
														</div>\
													</div>\
													<%}%>\
												</div>\
											</div>\
											<img class="closea" src="../images/close1.png" />\
									</div>';

					commodityHtml = $(template(commodityHtml, {
						data: data
					}));

					krpanoPluginJs.addChilde(commodityHtml, true);

					commodityHtml.find(".closea").on("click").on("click",function() {
						$(".commodityDiv").addClass("myanim-b0");
						if (isMb && !isPad) {
							$(".btnMore").trigger("click");
						};
						var timer = setTimeout(function() {
							view.hide();
							clearTimeout(timer);
						}, 300);
					});

					$(".img2").click(function() {
						alert("您已经点过赞了！");
					});
				} else {
					dem.hide();
				}

				$(".img1").click(function(e) {
					var _this = $(this)
					login.login(function(data) {
						console.log(data);
						var userId = data.id;
						var goodsId = $(e.target).data("pid");
						_this.addClass("img2");
						console.log(userId, goodsId);
						dianzan(userId, goodsId);

					}, true)
				});

				function dianzan(userId, goodsId) {
					proxy.shopZan({
						userId: userId,
						goodsId: goodsId
					}, function(data) {
						console.log(data);
					})
				};
			}

		},

		show: function() {
			console.log(commodityHtml);

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
						skin: ['setdistance plugin_layer commodityDiv myanim-b'],
						content: commodityHtml
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
						skin: ['setdistance plugin_layer commodityDiv myanim-b'],
						content: commodityHtml
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