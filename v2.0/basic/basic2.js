require(["jquery","template","proxy","edit/edit2","subgroup/subgroup","modul/upLoad","ajaxfileupload","sortable","jpages","pages","qrcode","zclip","/depend/select/select.js","jquery.fileupload","jquery.fileupload-validate","jquery.fileupload-image","load-image","switch","layer","css!common/common.css","css!common/basicCommon.css","css!basic/basic.css","css!edit/edit.css","css!subgroup/subgroup.css","css!skin/layer.css","css!dist/dropzone.css","css!dist/basic.css","css!dist/commondrap.css","basic/basic.tpl","edit/upPopFile.tpl","edit/viewEdit.tpl","subgroup/subgroup.tpl"],function(e,t,i,s,a){window.panoId=panoId=getQueryString("id");var o=!0,l="",c=window.msg=function(e,t){layer.msg(e,{time:1e3},t)};e(".top-right ul li").click(function(){e(this).addClass("curr"),e(this).siblings().removeClass("curr");var t=e(this).attr("title");e("#"+t).show().siblings().hide()}),i.panoDetail({id:panoId},function(n){function r(){e(".top-right li").eq(0).click(function(){e(".backtops").hide()}),e(".top-right li").eq(2).click(function(){e(".backtops").show()}),e(".top-right li").eq(1).click(function(){e(".backtops").hide()});var t=300;e(".backtops").click(function(){e(".group-rights").offset().top;e(".content-content").stop().animate({scrollTop:0},t)})}if(!n.success)return void c(n.errMsg);var p=e(t(basic,n));n.data.type;e(".content").append(p),"1"==n.data.status?e(".fb").attr("checked",!0):e(".no-fb").attr("checked",!0),r(),e(".content").on("click","#copy_input",function(){layer.msg("已成功复制到剪切板"),e("#copy_input").zclip({path:"v2.0/modul/ZeroClipboard.swf",copy:function(){return e("#copy-ipt").val()},afterCopy:function(){layer.msg("已成功复制到剪切板")}})}),e("#copy-ipt").val("http://pano.panocooker.com/pano/worksView?id="+panoId),e("#qrcodeTable").empty().qrcode({render:"table",text:e("#copy-ipt").val(),size:100}),e("#fileElem").fileupload({url:i.url.panoUpdate,dataType:"json",maxFileSize:1e6,autoUpload:!1,type:"post",acceptFileTypes:/(\.|\/)(gif|jpe?g|png)$/,previewMaxWidth:100,previewMaxHeight:100,previewCrop:!0,messages:{maxNumberOfFiles:"已超过上传最大数",acceptFileTypes:"文件类型不允许",maxFileSize:"文件太大",minFileSize:"文件太小了"}}).on("fileuploadadd",function(t,i){e("#fileElem").data("file",i)}).on("fileuploadprocessalways",function(t,i){e.each(i.files,function(t,i){i.preview&&e("#fileList").empty().append(i.preview),i.error?(c(i.error),l=i.error,o=!1,e("#fileElem").removeData("file")):o=!0})}).on("fileuploaddone",function(e,t){var i=t.result;c(i&&i.success?"保存成功":i.errMsg)}),e(".select_list li").each(function(){if("true"==e(this).attr("ischeck")){e(this).addClass("cur");var t=e(this).html(),i=e(this).attr("datanum");e("#belonid").html(t).attr("datanum",i)}var s=e(".select_list li[ischeck=true]").length;0==s&&e("#belonid").html("-请选择-")}),e(".selecton").click(function(){e(this).next(".select_list").slideToggle("300")}),e(".select_list li").click(function(){e(".select_list li").removeClass("cur"),e(this).addClass("cur");var t=e(this).html(),i=e(this).attr("datanum");e(this).parents(".select_box").find("#belonid").html(t).attr("datanum",i),e(this).parents(".select_box").find(".select_list").slideToggle("300")}),e(".save,.end").click(function(){var t=e(".project-name-ipt").val(),s=e(".project-name-textarea").val(),a=e(".publish-sf").children("input:checked").attr("status"),n=(e("#copy-ipt").val(),e("#fileList img").attr("isUpload"),e("#belonid").attr("datanum"));return e("#fileElem").fileupload("option","formData",{id:panoId,name:t,content:s,status:a,belongId:n}),o?e("#fileElem").data("file")?e("#fileElem").data("file").submit():i.panoUpdate({id:panoId,name:t,content:s,status:a,belongId:n},function(e){c(e&&e.success?"保存成功":e.errMsg)}):c(l),e("#qjEdit .editPanoName .editCommon").val(t),updateUrl(location.href,t),!1}),e(".delete").click(function(){layer.open({title:"你确定要删除该项目吗？",skin:"deletDefin",closeBtn:0,content:!1,btn:["确认","取消"],yes:function(e,t){i.panoDelete({id:panoId},function(e){e&&e.success?(c("删除成功"),window.location.href="http://ypano.duc.cn"):c(e.errMsg)})}})}),e("#pano_top").show(),updateUrl(location.href,n.data.name),new s(n),new a})});