require.config({
	paths: {
		'ajaxfileupload':'modul/ajaxfileupload',
		'cutupload':'modul/cutupload'
    },
    shim:{
    	'cutupload':['jquery']
    }
});

(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
			'jquery',
			'template',
			'krpanoPluginJs',
			'proxy',
			'patchPicture/patchPicture.tpl',
			'modul/cropbox',
			'cutupload',
			'css!common/common.css',
			'css!patchPicture/cut.css',
			'css!common/basicCommon.css',
			'css!patchPicture/patchPicture.css',
			// 弹窗
			'css!skin/layer.css'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy){
	var element;
	var edit = {
		options: {
			icon: "/v2.0/images/skylogo.png"
		},
		content: null,
		init: function(){
			// var html = $(template(addpicture, {}));
			// var data = krpanoPluginJs.getNadirlogo();
			// var tabpatch='<li class="default" data-id="<%=data.id%>"><div class="img-name"><span class="view-name">图片预览:</span><div class="img-all"><img src="" class="view-img"></div></div><div class="link-all"><span class="link-name">链接地址:</span><input type="text" value="<%=data.link%>" class="link-address" disabled="disabled"></div></li><li class="link" data-id="<%=data.id%>"><div class="img-name"><span class="view-name">图片预览:</span><div class="img-all"><img src="<%=data.logo%>" class="view-img"></div><a href="javascript:void(0)" class="upload-img"><label for="upload-file">上传图像</label></a><input type="file" class="" name="upload-file" id="upload-file" /><p class="advice">建议使用圆形透明底，图片尺寸400x400px</p><div class="upall"><div class="imageBox"><div class="thumbBox"></div></div><div class="action"><div class="new-contentarea tc"></div><input type="button" id="btnZoomIn" class="Btnsty_peyton" value="+" ><input type="button" id="btnZoomOut" class="Btnsty_peyton" value="-" ><input type="button" id="btnCrop"  class="Btnsty_peyton" value="裁切"></div></div><div class="cropped"><img src="" align="absmiddle" style="width:200px;margin-top:4px;border-radius:50%;"></div></div><div class="link-all"><span class="link-name">链接地址:</span><input type="text" value="<%=data.link%>" class="link-address"></div></li><li class="define" data-id="<%=data.id%>"><div class="img-name"><span class="view-name">图片预览:</span><div class="img-all"><img src="" class="view-img"></div></div><div class="link-all"><span class="link-name">链接地址:</span><input type="text" value="<%=data.link%>" class="link-address"  disabled="disabled"></div></li>';
			// element = $("<ul/>").append(template(tabpatch,{data: data}));
			// krpanoPluginJs.addChilde(element,true);
			var data = krpanoPluginJs.getNadirlogo();
			var patch='<div class="patch"><div class="choose-style"><span class="choose">选择分类:</span><select class="chooseval"><option nadirType="0">默认补地图片</option><option nadirType="1">自定义补地图片</option><option nadirType="2">不使用补地图片</option></select></div><ul class="path-tab"></ul><button type="button" class="submit">保存</button></div>';
			var tabpatch='<li class="default" data-id="<%=data.id%>">\
				<div class="img-name">\
					<span class="view-name">图片预览:</span>\
					<div class="img-all">\
						<img src="../v2.0/images/patchpic.png" class="view-img">\
					</div>\
				</div>\
				<div class="link-all">\
					<span class="link-name">链接地址:</span>\
					<input type="text" value="<%=data.link%>" class="link-address" disabled="disabled">\
				</div>\
			</li>\
			<li class="link" data-id="<%=data.id%>">\
				<div class="img-name">\
					<span class="view-name">图片预览:</span>\
					<div class="img-all">\
						<img src="<%=data.logo%>" class="view-img">\
					</div>\
					<a href="javascript:void(0)" class="upload-img">\
						<label for="upload-file">上传图像</label>\
					</a>\
					<input type="file" class="" name="upload-file" id="upload-file" />\
					<p class="advice">建议使用圆形透明底，图片尺寸400x400px</p>\
					<div class="upall">\
						<div class="imageBox">\
							<div class="thumbBox"></div>\
						</div>\
						<div class="action">\
							<div class="new-contentarea tc"></div>\
							<input type="button" id="btnZoomIn" class="Btnsty_peyton" value="+" >\
							<input type="button" id="btnZoomOut" class="Btnsty_peyton" value="-" >\
							<input type="button" id="btnCrop"  class="Btnsty_peyton" value="裁切">\
						</div>\
					</div>\
					<div class="cropped">\
						<img src="" align="absmiddle" style="width:200px;margin-top:4px;border-radius:50%;">\
					</div>\
				</div>\
				<div class="link-all">\
					<span class="link-name">链接地址:</span>\
					<input type="text" value="<%=data.link%>" class="link-address">\
				</div>\
			</li>\
			<li class="define" data-id="<%=data.id%>">\
				<div class="img-name">\
					<span class="view-name">图片预览:</span>\
					<div class="img-all">\
						<img src="" class="view-img">\
					</div>\
				</div>\
				<div class="link-all">\
					<span class="link-name">链接地址:</span>\
					<input type="text" value="<%=data.link%>" class="link-address"  disabled="disabled">\
				</div>\
				</li>';
			
			element = $(template(patch, {}));
			patchAll = element.find(".path-tab").append(template(tabpatch,{data: data}));
			krpanoPluginJs.addChilde(element,true);
			//切换补地图片
			$(".choose-style select.chooseval").change(function(){ 
				var index = this.selectedIndex;
				$("ul.path-tab").find("li").eq(index).show().siblings().hide();	
			})					 
		},
		show:function(){
			layer.open({
			    type: 1,
			    title: "天地logo",
			    closeBtn: 1,
			    shade: 0,
			    skin: 'setdistance plugin_layer patch_alone',
			    btn:false,
			    move: false,//是否允许拖动
			    shift:4,
			    area: ['500px', '300px'],
			    moveType:true,
			    // icon :0,图标
			    content: element,
			    cancel: function(){
					
			    }
			});
		}
	}
	
	var view = {
		content: null
	}
	
	function X(krpano, plugin){}
	
	X.prototype = {
		edit: edit,
		view: view,
		show: null,
		hide: null
	}
	
	return X;
})
)

