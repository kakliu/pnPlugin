require([
    'jquery',
    'template',
    'proxy',
    'edit/edit',
    'subgroup/subgroup',
    'modul/upLoad',
    'ajaxfileupload',
    'sortable',
    'jpages',
    'pages',
    'qrcode',
    'zclip',
    'depend/select/select',
    'jquery.fileupload',
    'jquery.fileupload-validate',
    'jquery.fileupload-image',
    'load-image',
    'switch',
    'layer',
    "css!common/common",
    "css!common/basicCommon",
    "css!basic/basic",
    "css!edit/edit",
    "css!subgroup/subgroup",
    "css!modul/skin/layer",
    "css!dist/dropzone",
    "css!dist/basic",
    "css!dist/commondrap",
    "basic/basic.tpl",
    "edit/upPopFile.tpl",
    "edit/viewEdit.tpl",
    "subgroup/subgroup.tpl"
], function($, template, proxy, edit, subgroup){
	window.panoId = panoId = getQueryString("id");
	var filesuccess = true,filemsg = "";
	

	var msg = window.msg = function(msg, fn){
		layer.msg(msg, {
		    time: 1000 //1秒关闭（如果不配置，默认是3秒）
		}, fn); 
	}

	$(".top-right ul li").click(function(){
		$(this).addClass("curr");
		$(this).siblings().removeClass("curr");
		var tab = $(this).attr("title");
		$("#" + tab).show().siblings().hide();
		
//		if(tab == "qjEdit" || tab == "group"){
//			$(".content-left-right").appendTo($("#" + tab));
//		}
	});
	
	proxy.panoDetail({id:panoId},function(data){
		if(!data.success){
			msg(data.errMsg);
			return;
		}
    	
		var element = $(template(basic, data));
		var type=data.data.type;
	    $(".content").append(element);
	    
		if(data.data.status=="1"){
			$(".fb").attr("checked",true);
		} else {
			$(".no-fb").attr("checked",true);
		}

	    //返回顶部
		function backtop(){
			$(".top-right li").eq(0).click(function(){
				$(".backtops").hide();
			})
			$(".top-right li").eq(2).click(function(){
				$(".backtops").show();
			})
			$(".top-right li").eq(1).click(function(){
				$(".backtops").hide();
			})
			var speed = 300; 
			$(".backtops").click(function () {
				var scrolltop = $('.group-rights').offset().top;
				$(".content-content").stop().animate({ "scrollTop": 0 }, speed);
			});
		}
		backtop();
		
	    // 复制到剪切板
	    $(".content").on("click","#copy_input",function(){
				layer.msg('已成功复制到剪切板');
			$('#copy_input').zclip({
				path: 'v2.0/modul/ZeroClipboard.swf',
				copy: function(){
					return $('#copy-ipt').val();
				},
				afterCopy: function(){
					layer.msg('已成功复制到剪切板');
				}
			});
		})
		
		$("#copy-ipt").val("http://pano.panocooker.com/pano/worksView?id="+ panoId);
		
		//生成二维码
		$("#qrcodeTable").empty().qrcode({
			render: "table",
			text: $("#copy-ipt").val(),
			size: 100
		});

        $("#fileElem").fileupload({
        	url: proxy.url.panoUpdate,
        	dataType:"json",
			maxFileSize: 1000000, // 5 MB
        	autoUpload: false,
        	type:"post",
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/,
	        previewMaxWidth: 100,
	        previewMaxHeight: 100,
	        previewCrop: true,
			messages: {
	            maxNumberOfFiles: '已超过上传最大数',
	            acceptFileTypes: '文件类型不允许',
	            maxFileSize: '文件太大',
	            minFileSize: '文件太小了'
	        },
			formData: proxy.updateDate().data
        }).on('fileuploadadd', function (e, data) {
        	$("#fileElem").data("file", data);
        }).on('fileuploadprocessalways', function (e, data) {
        	$.each(data.files, function(i,file){
                if(file.preview) {
                	$("#fileList").empty().append(file.preview);
                }
                
                if(file.error) {
                	msg(file.error);
                	filemsg = file.error;
                	filesuccess = false;
                	$("#fileElem").removeData("file");
                } else {
                	filesuccess = true;
                }
        	})
        }).on('fileuploaddone', function (e, result) {
        	var data = result.result;
        	
        	if(data && data.success){
                msg("保存成功");
            } else {
            	msg(data.errMsg);
            }
        });
        
        /*状态下拉*/
		$(".select_list li").each(function(){
			if($(this).attr("ischeck") == "true"){
				$(this).addClass("cur");
				var w = $(this).html();
				var d = $(this).attr("datanum")
				$("#belonid").html(w).attr("datanum", d);
			};
			var num = $(".select_list li[ischeck=true]").length;
			if( num == 0){
				$("#belonid").html("-请选择-");
			}
		})
		
		$(".selecton").click(function() {
			$(this).next(".select_list").slideToggle("300");
		})
		$(".select_list li").click(function() {
			$(".select_list li").removeClass("cur")
			$(this).addClass("cur");
			var text = $(this).html();
			var num = $(this).attr("datanum");
			$(this).parents(".select_box").find("#belonid").html(text).attr("datanum", num);
			$(this).parents(".select_box").find(".select_list").slideToggle("300");
		})
        
		// 保存信息
		$(".save,.end").click(function(){
			var name = $(".project-name-ipt").val();
			var content = $(".project-name-textarea").val();
			var status = $(".publish-sf").children("input:checked").attr("status");
			var link = $("#copy-ipt").val();
			var up = $("#fileList img").attr("isUpload");
            var belongId = $("#belonid").attr("datanum");
			$("#fileElem").fileupload("option", "formData", {
        		id:panoId,
				name:name,
				content:content,
				status:status,
				belongId:belongId
			})
			
			if(filesuccess){
				if($("#fileElem").data("file")){
		            $("#fileElem").data("file").submit();
				} else {
					proxy.panoUpdate({
						id:panoId,
						name:name,
						content:content,
						status:status,
						belongId:belongId
		            },function (data){  //服务器成功响应处理函数		                    
		                if(data && data.success){
		                    msg("保存成功");
		                } else{
		                	msg(data.errMsg);
		                }
		            })
				}
			} else {
				msg(filemsg);
			}

			$("#qjEdit .editPanoName .editCommon").val(name);
			updateUrl(location.href, name);
            return false;
		})

		//删除
		$(".delete").click(function(){
			layer.open({
				title: '你确定要删除该项目吗？',
				skin: 'deletDefin',
				closeBtn: 0,
				content: false,
				btn: ['确认', '取消']
				,yes: function(index, layero){
					proxy.panoDelete({
						id:panoId
				    },function (data){  //服务器成功响应处理函数
						if(data && data.success){
				            msg("删除成功");
				            window.location.href="http://ypano.duc.cn";
				        } else{
				            msg(data.errMsg);
				        }
				    });
				}
			});
		});
		
		$("#pano_top").show();
		updateUrl(location.href, data.data.name);
		new edit(data);
		new subgroup();
		//new patchPicture($(".group-left-right-patch"));
	});
})