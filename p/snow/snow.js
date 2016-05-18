
(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
			'jquery',
			'template',
			'krpanoPluginJs',
			'proxy',
		    'jquery.fileupload',
		    'jquery.fileupload-validate',
		    'jquery.fileupload-image',
		    'load-image',
			'css!common/common',
			'css!common/basicCommon',
			'css!p/snow/snow',
			// 弹窗
			'css!skin/layer',
			'switch'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy){
	var element;
	var edit = {
		options: {
			icon: "/v2.0/images/snowlogo.png",
			calss: "btnSnow"
		},
		content: null,
		init: function(){
			var self = this;	
			var data = krpanoPluginJs.getSnow();
			var swtichStatus;
			var mainId = getQueryString("id",location.href);
			var my_photo = "/images/t.png" ;
			data.isZdy = data.zdy.length;
			if(data.isZdy) {
				my_photo = 	data.zdy[0]['imageurl'];
				setTimeout(function(){$(".plugin-snow-upload").hide();$(".snow_btn").show();},0);
				
			}
			data.my_photo = my_photo;
			// logger.log(data);
			var snowHtml='<div class="snow">\
					    <h5 class="snowtitle">系统自带</h5>\
					    <ul class="snow_list">\
					        <%for (var i = 0; i < data["list"].length; i++) {%>\
					        <li>\
					            <label class="default_type">\
					                <input name="snow_type" data-id="<%=data["list"][i]["effectId"]%>" value="<%=data["list"][i]["name"]%>" type="radio" <%if (data["list"][i]["check"]) {%> checked <%}%> ><%=data["list"][i]["rename"]%></label>\
					        </li>\
					        <%}%>\
					    </ul>\
					    <hr>\
					    <ul class="snow_auto">\
					        <li class="addmyeffect">\
					            <label >\
					                <input name="snow_type" data-id="<%if (data.isZdy) {%> <%=data["zdy"][0]["effectId"] %> <%}%>" data-my="true" class="my_type" <%if (data.isZdy) {%> checked <%}%>  type="radio">自定义特效</label>\
					        </li>\
					        <li>\
					            <div class="for_img">\
					            	<dl class="list_photo" id="list_photo">\
									</dl>\
					            	<img class="snow_photo" src="<%=data["my_photo"]%>" alt="">\
									<div class="plugin-snow-upload">\
						    			<input type="file" name="file" id="fileUpload" class="plugin-snow-uploadfile">\
						    			<i class="addplus"></i>\
						    		</div>\
					            </div>\
					            <button class="snow_btn hide" id="reset_upload">重新上传</button>\
					        </li>\
					        <li>\
					            <p class="snow_comment">上传的图片需为小于1M的PNG格式</p>\
					        </li>\
					    </ul>\
					    <div class="snow_footer">\
					        <input type="checkbox" name="toggle_snow" value="0" <%if (data["effectswich"]) {%> checked <%}%> class="lcs_check lcs_tt1 toggle_snow"  autocomplete="off" /> 开启特效\
					        <button class="applyall">应用到所有场景</button>\
					    </div>\
					</div>';
			element = $(template(snowHtml, {data: data}));
			krpanoPluginJs.addChilde(element,true);

			$("#krpanoSWFObject").on("onnewpano",function(){
				if($(".snow").length){				
					setTimeout(function(){
						var resetData = krpanoPluginJs.getSnow();
						var resetPhoto = "/images/t.png" ;
						// console.log(resetData);
						resetData.isZdy = resetData.zdy.length;
						if(resetData.isZdy) {
							resetPhoto = resetData.zdy[0]['imageurl'] ? resetData.zdy[0]['imageurl'] : '/images/t.png';
							$(".my_type").prop("checked",true);
							// console.log(resetData.zdy[0]['effectId']);
							$(".my_type").data("id",resetData.zdy[0]['effectId']);
						} else {
							for(var i=0, listLen = resetData.list.length; i < listLen; i++) {
								if(resetData.list[i].check) {
									$('input[name="snow_type"]').eq(i).prop("checked",true);
								}
							};
						}
						$(".snow_photo").attr("src",resetPhoto);
						if(resetData.effectswich) {
							$(".snow_footer .lcs_switch").removeClass("lcs_on lcs_off").addClass("lcs_on");
						} else {
							$(".snow_footer .lcs_switch").removeClass("lcs_on lcs_off").addClass("lcs_off");					
						}


					},500);
				}
			});

			//上传空间初始化


			$("#fileUpload").fileupload({
	        	url: proxy.url.fileuoload,
	        	dataType:"json",
				maxFileSize: 1000000, //1 MB
	        	type:"post",
	            acceptFileTypes: /(\.|\/)(png)$/,
				messages: {
		            maxNumberOfFiles: '已超过上传最大数',
		            acceptFileTypes: '文件类型不允许',
		            maxFileSize: '文件太大',
		            minFileSize: '文件太小了'
		        }
			}).on('fileuploadadd', function (e, data) {
	        	data.context = [];
	        	$.each(data.files, function(i, file){
	        		data.context[i] = $("<dd><input type='text' readonly maxlength='9' class='plugin-map-name' value='" + file.name +"'/><div class='progress progress-striped active fade in'><div class='progress-bar'/></div></div></dd>").appendTo("#list_photo");
	        	});
	        }).on('fileuploadprocessalways', function (e, data) {
	        	$.each(data.files, function(i, file){
	                if(file.error) {
	                	msg(file.error);
	                	$("#list_photo").html('');
	                }
	        	})
	        }).on('fileuploadprogress', function (e, data) {
	        	$.each(data.files, function(i, file){
		            var progress = parseInt(data.loaded / data.total * 100, 10);
		            data.context[i].find('.progress .progress-bar').css(
		                'width',
		                progress + '%'
		            );
		            $(".addplus",".snow_auto").remove();
	        	});
	        }).on('fileuploaddone', function (e, data) {
	        	var result = data.result.files;
	        	$.each(data.context, function(i, context){
	        		//判断是否成功
		        	if(result && result[i].error) {
		            	msg(result[i].error);
		            }
		        	$(".snow_photo").attr('src',result[i].url);
		        	$(".plugin-snow-upload").hide();
		        	$(".my_type").prop("checked",true);
		        	$(".my_type").data("id","");
					$(".snow_footer .lcs_switch").removeClass("lcs_on lcs_off").addClass("lcs_on");
		        	// console.log(result[i].url);
		        	krpanoPluginJs.setSnow(result[i].url);
	        		addEffect();
					setTimeout(function(){
						context.find('.progress').remove();
					}, 600);
	        	});
	        });




			$('.toggle_snow').lc_switch();
			// triggered each time a field changes status
			$('body').on('lcs-statuschange', '.toggle_snow', function() {
				swtichStatus = ($(this).is(':checked')) ? true : false;
				var effectId = $('input[name="snow_type"]:checked').data("id");
				krpanoPluginJs.setUpOrDownSnow();
				proxy.snowSwitch({
		        	mainId  : mainId,
		        	effectId: effectId,
		        	panoId  : krpanoPluginJs.get("scene[get(xml.scene)]").id
		        },function(data){
		        	if(data.success){
		        		msg("保存成功");
		        	} else {
		        		msg(data.errMsg);
		        	}
		        });
			});

			$('input[name="snow_type"]').change(function(){
				addEffect();
			});

			function addEffect(){
				var self = $('input[name="snow_type"]:checked');
				var name = self.val();
				var isMy = self.data("my");
				var panoId = krpanoPluginJs.get("scene[get(xml.scene)]").id;
				var effectId = $('input[name="snow_type"]:checked').data("id");
					effectId = effectId ? effectId : "";
		        if(!isMy) {
					krpanoPluginJs.setDefaultSnow(name);				
				} else {
					my_photo = $(".snow_photo").attr("src") ;
					krpanoPluginJs.setSnow(my_photo);
					if(my_photo.indexOf("s/t.png")>-1) {
						$("#fileUpload").trigger("click");
					} else {
						$(".snow_btn").show();
					}
				}
				$(".snow_footer .lcs_switch").removeClass("lcs_on lcs_off").addClass("lcs_on");
				// console.log(effectId,panoId,mainId);
				proxy.snowAdd({
					mainId:mainId,
					panoId:panoId,
					effectId:effectId,
					imageurl:my_photo
		        },function(data){
		        	if(data.success){
		        		msg("设置成功");
		        		$(".my_type").data("id",data.effectId);
		        	} else {
		        		msg(data.errMsg);
		        	}
		        });
				// $('.toggle_snow').lcs_on();
				$(".applyall").removeAttr("disabled").text("应用到所有场景");				
			}
		
			$("#reset_upload").click(function(){
				$("#fileUpload").trigger("click");
			});

			$(".applyall").click(function(){
				if($(".snow_footer .lcs_switch").hasClass("lcs_off")) return;
				var effectId = $('input[name="snow_type"]:checked').data("id");
				krpanoPluginJs. addEffectToAll();
				$(".applyall").attr("disabled","disabled").text("已应用到所有场景");
				proxy.snowShare({
		        	mainId:mainId,
		        	effectId:effectId
		        },function(data){
		        	// console.log(data);
		        	if(data.success){
		        		msg("设置成功");
		        	} else {
		        		msg(data.errMsg);
		        	}
		        });
			});
		},
		show:function(){
	    	if(!this.layerIndex){
				this.layerIndex = layerMsg({
				    title: "添加特效",
				    skin: 'setdistance plugin_layer aloneLayer',
				    area: ['270px', ''],
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

