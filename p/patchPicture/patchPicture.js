(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
			'jquery',
			'template',
			'krpanoPluginJs',
			'proxy',
			//'p/hotspot/patchPicture/patchPicture.tpl',
			'cutupload',
			'css!common/common.css',
			'css!p/patchPicture/cut.css',
			'css!common/basicCommon.css',
			'css!p/patchPicture/patchPicture',
			// 弹窗
			'css!skin/layer.css'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy){
	var element;
	var tabpatch='<li class="link" data-id="<%=data.id%>" style="display: list-item">\
		<div class="img-name">\
			<span class="view-name">Logo预览:</span>\
			<div class="cropped">\
				<img src="<%=data.url%>" align="absmiddle" style="width:180px;border-radius:50%;height:180px;" class="comlei">\
			</div>\
			<div style="clear:both;"></div>\
			<div class="img-tip">\
				<a href="javascript:void(0)" class="upload-img">\
					<label for="upload-file">选择文件</label>\
				</a>\
				<input type="file" class="" name="upload-file" id="upload-file" />\
				<p class="advice">建议使用圆形透明底，图片尺寸400x400px</p>\
			</div>\
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
		</div>\
	</li>';
	var edit = {
		options: {
			icon: "/v2.0/images/skylogo.png"
		},
		content: null,
		init: function(){
			// var data = krpanoPluginJs.getNadirlogo();
			// var tabpatch='<li class="default" data-id="<%=data.id%>"><div class="img-name"><span class="view-name">图片预览:</span><div class="img-all"><img src="" class="view-img"></div></div><div class="link-all"><span class="link-name">链接地址:</span><input type="text" value="<%=data.link%>" class="link-address" disabled="disabled"></div></li><li class="link" data-id="<%=data.id%>"><div class="img-name"><span class="view-name">图片预览:</span><div class="img-all"><img src="<%=data.logo%>" class="view-img"></div><a href="javascript:void(0)" class="upload-img"><label for="upload-file">上传图像</label></a><input type="file" class="" name="upload-file" id="upload-file" /><p class="advice">建议使用圆形透明底，图片尺寸400x400px</p><div class="upall"><div class="imageBox"><div class="thumbBox"></div></div><div class="action"><div class="new-contentarea tc"></div><input type="button" id="btnZoomIn" class="Btnsty_peyton" value="+" ><input type="button" id="btnZoomOut" class="Btnsty_peyton" value="-" ><input type="button" id="btnCrop"  class="Btnsty_peyton" value="裁切"></div></div><div class="cropped"><img src="" align="absmiddle" style="width:200px;margin-top:4px;border-radius:50%;"></div></div><div class="link-all"><span class="link-name">链接地址:</span><input type="text" value="<%=data.link%>" class="link-address"></div></li><li class="define" data-id="<%=data.id%>"><div class="img-name"><span class="view-name">图片预览:</span><div class="img-all"><img src="" class="view-img"></div></div><div class="link-all"><span class="link-name">链接地址:</span><input type="text" value="<%=data.link%>" class="link-address"  disabled="disabled"></div></li>';
			// element = $("<ul/>").append(template(tabpatch,{data: data}));
			// krpanoPluginJs.addChilde(element,true);
			var data = krpanoPluginJs.getNadirlogo();
			var patch='<div class="patch"><div class="patchcon"><div class="choose-style"><span class="choose">选择分类:</span><select class="chooseval"><option nadirType="1" value="1">自定义补地图片</option><option nadirType="2" value="2">不使用补地图片</option></select></div><ul class="path-tab"></ul></div><div class="caoz-btn"><button type="button" class="submit btn-com">保存</button><button type="button" class="reset btn-com">重置</button></div></div>';
			element = $(template(patch, {}));
			patchAll = element.find(".path-tab").append(template(tabpatch,{data: data}));	
			krpanoPluginJs.addChilde(element,true);
			if(data.type==2){
				$('.chooseval option:eq(1)').attr('selected','selected');
					$(".path-tab").hide();		
			}
			//切换补地图片时重置移除类
			$(".choose-style select.chooseval").change(function(){ 
				$(".caoz-btn .reset").removeClass("currClick");
			})
			$(".choose-style").on("change",".chooseval",function(){
				if($(this).val() ==2) {
					$(".path-tab").hide();
				} else {
					$(".path-tab").show();					
				};
			})


			$(".img-name").on("click","#upload-file",function(){
				$(".upall").show();
			})
			$(".upall").on("click","#btnCrop",function(){
				$(".upall").hide();
			})
			$(".caoz-btn .reset").click(function(){
				$("#btnCrop").addClass("sureCutO");
				$(this).addClass("currClick");
				var data=krpanoPluginJs.getdefaultnadir();
				element.find(".cropped img").attr("src",data.url);
			})
			element.find(".submit").click(function(){
				if(!$("#btnCrop").hasClass("sureCutO")) $("#btnCrop").trigger("click");
				var url=element.find(".link-address").val();
				var img=element.find(".cropped img").attr("src");
				if($(".caoz-btn .reset").hasClass("currClick")){
					var selectpic=0;
				} else {
					var selectpic=$(".chooseval option:selected").attr("nadirType");
				}	
				if(!$("#btnCrop").hasClass("sureCutO")){
					
					img="";
				} 	
				proxy.nadirlogoEdit({
		        	link:url,
		        	panoId:panoId,
		        	type:selectpic,
		        	nadirImg:img
		        },function(data){
		        	if(data.success){
		        		msg("保存成功");
		        		$("#btnCrop").removeClass("sureCutO");
		        		$(".caoz-btn .reset").removeClass("currClick");
		        		krpanoPluginJs.setNadirlogo(data.data,url,selectpic);
		        	} else {
		        		msg(data.errMsg);
		        	}
		        });
			})
		},
		show:function(){
	    	if(!this.layerIndex){
				this.layerIndex = layerMsg({
				    title: "选择天地logo",
				    skin: 'setdistance plugin_layer aloneLayer',
				    area: ['360px', ''],
				    content: element
				});
	    	}
		},
		hide: function() {
			if(this.layerIndex){
				layer.close(this.layerIndex);
			}
			
			this.layerIndex = null;
		}
	}
	
	// var view = {
	// 	content: null,
	// 	init: function(){
			
	// 	}
	// }
	
	function X(krpano, plugin){}
	
	X.prototype = {
		edit: edit,
		//view: view,
		show: null,
		hide: null
	}
	
	return X;
})
)

// <div class="link-all">\
// 	<span class="link-name">链接地址:</span>\
// 	<input type="text" value="<%=data.link%>" class="link-address">\
// </div>\
