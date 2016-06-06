
/**
 * 图片移动
 * 
 * @param obj
 *            移动图片的对象
 * @returns
 */
function moveObj(obj, options) {
	if($(obj).data("move")){
		return $(this.obj).data("move");
	}

	this.options = $.extend(true, {}, moveObj.options,options)

	var _this = this;
	this.setting = {};
	this.obj = obj;
	$(this.obj).data("move", this);

	if($(obj).find("img") && !$(obj).find("img").innerWidth()){
		$(obj).find("img").on("load",function(){
			$(this).off("load");
			_this.init();
		});

		$(obj).find("img")[0].src = $(obj).find("img")[0].src;
	} else {
		_this.init();
	}
	if (this.options.isExtend) {
		this.setting.isExtend = isExtend;
	} else {
		this.setting.isExtend = false;
	}

	return this;
}

moveObj.options = {
	onload : null,
	left : 0,
	top : 0,
	onchange:null,
	onFinal: function(){
	}
}

moveObj.prototype.change = function(url){
	var self = this;
	var image = new Image();
	image.src = url;
	
	image.onload = function(){
		self.img.attr("src", url);
		self.initSetting();
	}
	
	if(!image.width) {
		self.img.attr("src", url);
		self.initSetting();
	}
}

moveObj.prototype.initSetting = function(){
	this.left = parseInt(this.options.left);
	this.top = parseInt(this.options.top);
	this.parent = $(this.obj).parent();
	this.imgWidth = this.img[0].width;
	this.imgHeight = this.img[0].height;

	$(this.obj).css({width: this.imgWidth,height: this.imgHeight,left:this.left,top:this.top,position:"absolute"});
	$(this.obj).parent().css({position:"relative"});
	this.setting.width = parseInt($(this.obj).parent().innerWidth()) - parseInt($(this.obj).innerWidth());
	this.setting.height = parseInt($(this.obj).parent().innerHeight()) - parseInt($(this.obj).innerHeight());
	this.setting.objWidth = parseInt($(this.obj).parent().innerWidth())
	this.setting.objHeight = parseInt($(this.obj).parent().innerHeight())
}

/**
 * 初始化移动参数
 */
moveObj.prototype.init = function() {
	var setting = this;
	
	this.setting.clickleft = 0;
	this.setting.clicktop = 0;
	this.img = $(this.obj).find("img");
	
	this.initSetting();
	
	this.setting.drag = 1
	this.setting.move = 0;
	$(this.obj).data("move",setting);
	
	this.callWith(this.options.onload);

	this.obj.onmousemove = function(event) {
		$(this).data("move").setWidth();
		$(this).data("move").setHeight();
		var move = $(this).data("move");
		var setting = move.setting;
		event.stopPropagation();
		event.preventDefault();
		if (setting.move) {
			var left = (event.x?event.x:event.pageX) - setting.clickleft;

			if ((setting.width > 0 && left >= 0 && left <= setting.width) || left <= 0 && left >= setting.width) {
				move.left = left;
				this.style.left = left + "px";
			}

			var top = (event.y?event.y:event.pageY) - setting.clicktop;

			if ((setting.height > 0 && top >= 0 && top <= setting.height) || top <= 0 && top >= setting.height) {
				this.style.top = top + "px";
				move.top = top;
			}

			move.callWith(move.options.onchange);
		}
		return false;
	}

	this.obj.onmousedown = function(event) {
		var self = $(this).data("move");
		var setting = $(this).data("move").setting;
		event.stopPropagation();
		event.preventDefault();
		if (setting.drag) {
			setting.clickleft = (event.x?event.x:event.pageX) - parseInt(this.style.left)
			setting.clicktop = (event.y?event.y:event.pageY) - parseInt(this.style.top)
			setting.move = 1;
			zindex();
		}

		self.callWith(self.options.onmousedown);
	}

	this.obj.onmouseup = function(event) {
		var self = $(this).data("move");
		event.stopPropagation();
		event.preventDefault();
		$(this).data("move").setting.move = 0

		self.callWith(self.options.onmouseup);
	}

	this.obj.ondragstart = function(event) {
		event.stopPropagation();
		event.preventDefault();
		event.returnValue = false
	}

	this.obj.onmouseout = function(event) {
		event.stopPropagation();
		event.preventDefault();
		$(this).data("move").setting.move = 0;
		zindex();
	}

	function zindex() {
		$(setting.obj).css("z-index", setting.move);
	}

	this.callWith(this.options.onFinal);
}

moveObj.prototype.callWith = function(f){
	if(typeof f === "function") f.call(this);
}

moveObj.prototype.setWidth = function(value){
	var _this = $(this.obj).data("move").setting;
	if(value){
		_this.width = parseInt($(this.obj).parent().innerWidth())- value;
	}else {
		_this.width = parseInt($(this.obj).parent().innerWidth())- parseInt($(this.obj).innerWidth());
	}
	
	var left = parseInt($(this.obj).css("left"))
	
	if(_this.width<0&&left<_this.width){
		$(this.obj).css("left",_this.width+"px")
	}
	_this.objWidth = parseInt($(this.obj).parent().innerWidth())
}

moveObj.prototype.setHeight = function(value){
	var _this = $(this.obj).data("move").setting;
	if(value){
		_this.height = parseInt($(this.obj).parent().innerHeight())- value;
	}else {
		_this.height = parseInt($(this.obj).parent().innerHeight())- parseInt($(this.obj).innerHeight());
	}
	
	
	var top = parseInt($(this.obj).css("top"))
	
	if(_this.height<0&&top<_this.height){
		$(this.obj).css("top",_this.height+"px")
	}
	
	_this.objHeight = parseInt($(this.obj).parent().innerHeight())
}