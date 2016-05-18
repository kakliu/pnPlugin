(function (factory) {
	if (typeof define === "function" && define.amd) {
		require.config({
			paths: {
				'comment': ['/p/hotspot/comment/']
			}
		});

        // AMD模式
		define([
			'jquery', 
			'template', 
			'krpanoPluginJs',
			'proxy',
			'comment/commentform.tpl',
			'comment/comment.tpl',
			'css!comment/comment.css'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy, commentformTpl, commentTpl){
	var self;
	var krpano;
	var plugin;
	function X(k, p){
		krpano = k;
		plugin = p;
	}

	var fn = X.prototype;

	fn.options = {
		time: 1200,
		x: function(){
			var position = $(".comment_form").position();

			return position.left - 80;
		},
		y: function(){
			var position = $(".comment_form").position();

			return position.top / 2 + 80;
		},
		onupdate: function(hotspot, data){
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
					plugin.removeComment(hotspot.name);
					return;
				}

				id = data.id;
			});

			this.bg.width(this.pic.width());
			return id;
		},
		ondoned: function(data){
			this.onresize();
			this.comment.addClass("comment_finsh");
			self.content.val("");
		}
	};

	fn.view = function(){
		var pic = '/images/1234.png';

		this.options = {
			icon: "/v2.0/store/images/sub.png",
			realTimeClick: true
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
		}

		this.show = function(){
			this.comment.show();
			plugin.addComment(pic);
		}

		this.hide = function() {
			this.comment.hide();
		}

		this.initEvent = function(){
			this.form.submit(function(){
				if(self.content.val().length > 28){
					alert("不能超过28个字");
					return false;
				} else if(self.content.val().length == 0){
					alert("请输入评论");
					return false;
				}

				plugin.saveComment(self.content.val());
				self.dom.data("hide")();
				return false;
			});

			$("<button>说一说</button>").appendTo("body").css({position: 'absolute',left: 0,bottom: 0}).click(function(){
				self.show();
			});

			this.cancel.click(function(){
				plugin.removeComment();
				self.dom.data("hide")();
			});
		}

		this.onloadcomment = function(sceneId){
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


	fn.commentspot = function(){
		var _this = this,
			data={};

		this.init = function(krpano, plugin){
			data.content = plugin.content;
			data.pic = plugin.pic;

			this.comment = $(template(commentTpl, data));
			this.bg = this.comment.find(".comment_bg");
			this.pic = this.comment.find(".comment_pic img");
			this.content = this.comment.find(".comment_content");

			krpanoPluginJs.addPluginChilde(plugin, this.comment);
			this.onresize();

	        plugin.onclick = function(){
	        	if(plugin.is_save != true){
	        		return;
	        	}

	        	//删除方法
	        }

	        return this.comment;
		}

		this.onresize = function(){
			this.content.css({'white-space': 'nowrap'});
			var width = this.content.width() + this.pic.width();
			this.content.css({'white-space': 'inherit'});

			// if(width >= 200) {
			// 	this.bg.width(200);
				// this.content.css("position", "absolute");
			// 	this.bg.addClass("comment_max");

				// setTimeout(function(){
					// self.content.css("position", "none");
					// self.bg.height(self.content.innerHeight());
				// }, 1600);
			// } else {
	        	this.bg.width(width + 25);
				this.bg.removeClass("comment_max");
			// }
		}

		this.onremove = function(){

		}

		this.onupdate = function(data){
			_this.pic.attr("src", data.pic);
			_this.content.html(html_encode(data.content));
		}
	}
	

	return X;
})
)