(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
			'jquery', 
			'template', 
			'krpanoPluginJs',
			'proxy',
			'comment/comment.tpl',
			'css!comment/comment.css'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy, commentTpl){
	var self;

	function Comment(){
		self = this;
	}

	var commentFn = Comment.prototype;

	commentFn.init = function(krpano, plugin){
		plugin.width = 200;
		data.content = plugin.content;
		data.pic = plugin.pic;

		this.comment = $(template(commentTpl, data));
		this.bg = this.comment.find(".comment_bg");
		this.pic = this.comment.find(".comment_pic img");
		this.content = this.comment.find(".comment_content");

		krpanoPluginJs.addPluginChilde(plugin, this.comment);
		this.onresize();

		plugin.registerattribute("pic", "", function(pic) {
			data.pic = pic;
			self.pic.attr("src", pic);
        }, function(){
        	return data.pic;
        });

		plugin.registerattribute("content", "", function(content) {
			data.content = content;
			self.content.html(html_encode(content));
        }, function(){
        	return data.content;
        });

        return this.comment;
	}

	commentFn.onresize = function(){
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
        	this.bg.width(width + 20);
			this.bg.removeClass("comment_max");
			this.bg.height(25);
		// }

	}

	return Comment;
}))