(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
        define(["jquery",'template','/depend/util/model.tpl.js'], factory);
    } else {
        // 全局模式
        factory(jQuery,template);
    }
}(function($,template){
	$.fn.model = function(options){
		var model = $(this).data('model');

		if(!model){
			model = new $.model(options,this);
			$(this).data('model', model);
		}

		return model;
	}
	
	$.model = function(options, element){
		var opts = $.extend(true, {}, $.model.defaults, options);
		this.options = opts;
		this.element = $(element).hide();
        this._hide();
        
		this._create();

        //隐藏弹出框
        if(this.options.isShow) {
        	this._show();
        }
    }

    $.model.defaults = {
    	isShow: false,
    	closeOnConfirm: true,
    	closeOnBackdrop: false,
    	content: null,
    	title:null,
    	hasButton:true,
    	confirm:"确认",
    	cancel:"取消"
    }

    $.model.prototype = {
    	_show: function(){
    		var model = this;

    		this.element.fadeIn("fast",function(){
    			model.element.trigger("opened",[this]);
    		});
    	},
    	_hide: function(){
    		var model = this;
    		this.element.fadeOut("fast",function(){
    			model.element.trigger("closeed",[this]);
    		});
    	},
    	open: function(){
    		this.element.trigger("open",[this]);
    		this._show();
    	},
    	close: function(){
    		this.element.trigger("close",[this]);
    		this._hide();
    	},
    	cancel: function(){
    		this.element.trigger("cancel",[this]);
    		this.close();
    		this.element.trigger("canceled",[this]);
    	},
    	confirm: function(){
    		this.element.trigger("confirm",[this]);
    		if (this.options.closeOnConfirm) {
    			this.close();
    		}
    		this.element.trigger("confirmed",[this]);
    	},
    	_create:function(){
    		var self = this;
    		var html = $(template(model.tpl,this.options));
    		if(this.options.title)
    			html.find(".title").html(this.options.title);

    		if(this.options.content)
    			html.find(".content").html(this.options.content);

    		this.element.append(html);

    		this.element.find(".confirm").click(function(){
    			self.confirm();
    		});

            this.element.find(".close").click(function(){
                self.close();
            });

    		this.element.find(".cancel").click(function(){
    			self.cancel();
    		});	


	        //隐藏弹出框
	        if(this.options.isShow) {
	        	this._show();
	        }
	    }
	}
}))