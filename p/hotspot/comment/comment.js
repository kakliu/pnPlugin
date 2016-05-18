(function (factory) {
	if (typeof define === "function" && define.amd) {

        // AMD模式
		define([
			'jquery', 
			'template', 
			'krpanoPluginJs',
			'proxy',
			'login/login',
			'hotspot/registehotspot',
			'p/hotspot/comment/commentform.tpl',
			'p/hotspot/comment/comment.tpl',
			'css!p/hotspot/comment/comment'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy, login, registehotspot, commentformTpl, commentTpl){
	var self;
	var krpano;
	var plugin;
	function X(k, p){
		krpano = k;
		plugin = p;
	}

	var fn = X.prototype;

	fn.view = function() {
		var pic;
		self = this;
		var hotspotFn;
		var hotspot;

		this.options = {
			className: "btnComment",
			autoHide: true,
			autoClick: true
		}

		this.init = function(dom){
			self = this;
			this.dom = dom;
			this.comment = $(template(commentformTpl, {}));
			this.comment.hide();
			krpanoPluginJs.addChilde(this.comment, true);

			this.form = this.comment.find("form");
			this.content = this.comment.find(".comment_form_content");
			this.cancel = this.comment.find(".comment_form_cancel");
			this.initEvent();
			
			this.content.focus(function(){
				$(document).scrollTop($(document).height());
			})

			hotspotFn = registehotspot.getInstance("hotspot_comment", {
				element: self.commentspot,
				loadSceneRemoveHotspot: true,
				isSaveMove: true,
				saveFlag: true,
				x: function(){
					var position = $(".comment_form").position();
					
					if(isMb){
						return ($(window).width() - 200)/2;
					} else {
						return position.left - 70;
					}
				},
				y: function(){
					var position = $(".comment_form").position();

					return position.top / 2 + 40;
				},
				callback: {
					onnewscene: function(sceneId){
						var result;
						proxy.commentGet({
							mainPanoId: panoId,
							sceneId: sceneId,
							async: false
						}, function(data){
							if(!data.success){
								alert(data.errMsg);
							}

							result = data;
						})

						return result.data;
					}
				}
			});
		}

		this.show = function(){
			var _this = this;
			
			login.login(function(data){
				pic = data.avatar;
				_this.comment.show();

				hotspot = hotspotFn.addHotspot({
					style: 'skin_comment_add_label_default',
					data: {
						pic: pic,
						content: "拖动到想要打标签的地方"
					}
				});
			}, true);
		}

		this.hide = function() {
			if(hotspot){
				hotspot.removeHotspot();
			}

			this.comment.hide();
		}

		this.initEvent = function(){
			this.form.submit(function(){
				var val = $(this).val();
				var str = $(this).val().replace(/[^\x00-\xff]/g, 'xx');
				if(str.length > 28){
					alert("不能超过14中文字或28个字符");
					return false;
				} else if(self.content.val().length == 0){
					alert("请输入评论");
					return false;
				}

				hotspot.saveHotspot({
					data: {
						content: self.content.val()
					}
				});

				self.content.val("");
				hotspot = null;
				self.dom.data("hide")();
				return false;
			});

			this.content.keyup(function(e){
				var str = $(this).val().replace(/[^\x00-\xff]/g, 'xx');

				if(str.length > 28 && e.keyCode != 8 && e.keyCode != 46) {
					$(this).val($(this).val().substring(0, $(this).val().length - 1));
				}
			})

			//测试
			// $("<button>说一说</button>").appendTo("body").css({position: 'absolute',left: 0,bottom: 0}).click(function(){
			// 	self.show();
			// });

			this.cancel.click(function(){
				hotspot.removeHotspot();
				self.dom.data("hide")();
			});
		}


		this.commentspot = function(hotspot){
			var _this = this,
				data={};
			if(isMb && !isPad) hotspot.scale = 0.8;
			this.init = function(data, isSave){
				this.comment = $(template(commentTpl, data));
				this.bg = this.comment.find(".comment_bg");
				this.pic = this.comment.find(".comment_pic img");
				this.content = this.comment.find(".comment_content");

				if(isSave){
					this.comment.addClass("comment_finsh");
				}

		        return this.comment;
			}

			this.onresize = function(){
				function getByteLen(val) {
				    var len = 0;
				    for (var i = 0; i < val.length; i++) {
				        var a = val.charAt(i);
				        if (a.match(/[^\x00-\xff]/ig) != null) {
				            len += 2;
				        } else {
				            len += 1;
				        }
				    }
				    return len;
				}
				setTimeout(function(){
					_this.content.css({'white-space': 'nowrap'});
					var width;
					var conWidth = _this.content.width();
					var txtWidth = getByteLen(_this.content.text()) * 14 / 2 + 36;
					width = !!conWidth ? (_this.content.width() + _this.pic.width()) : txtWidth;
		        	_this.bg.width(width + 25);
					_this.bg.removeClass("comment_max");
				}, 100);
			}

			this.onremove = function(){
				//alert(1);
			}

			this.onmoveupdate = function(data,hotspot){
				console.log(hotspot.id);
				if(hotspot.id){
					proxy.commentUpdate({
						atv:hotspot.atv,
						ath:hotspot.ath,
						id:hotspot.id
					},function(data){
						if(!data.success){
							console.log(data.errMsg);
							return;
						} else{
							//msg("修改成功");
						}
					})
				}
			}

			this.onsave = function(data, hotspot) {
				var id;
				proxy.commentAdd({
					sceneId: krpanoPluginJs.getSceneId(),
					comment: data.content,
					avatar: data.pic,
					ath: hotspot.ath,
					atv: hotspot.atv,
					mainPanoId: panoId,
					async: false
				}, function(data){
					if(!data.success) {
						alert(data.errMsg);
						_this.hotspotFn.removeHotspot();
						return;
					}

					id = data.id;
				});
				
				_this.bg.width(_this.pic.width());

				setTimeout(function(){
					_this.pic.attr("src", data.pic);
					_this.content.html(html_encode(data.content));
					_this.onresize();
					_this.comment.addClass("comment_finsh");
				}, 1200);

				_this.id = id;

				return id;
			}
		}
	}

	return X;
})
)