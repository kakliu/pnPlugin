//Dropzone的初始化，myDropzone为form的id
Dropzone.autoDiscover = false;
$(".dropzone").dropzone({
    //指定上传图片的路径
    url: "/file/upload",
    //添加上传取消和删除预览图片的链接，默认不添加
    addRemoveLinks: true,
    //关闭自动上传功能，默认会true会自动上传
    //也就是添加一张图片向服务器发送一次请求
    autoProcessQueue: false,
    //允许上传多个照片
    uploadMultiple: true,
    //图片超过多少之后不显示缩率图
    //maxThumbnailFilesize:20,
    dictRemoveFile:"删除文件",
    dictCancelUploadConfirmation:"",
    dictCancelUpload:"",
    //每次上传的最多文件数，经测试默认为2，坑啊
    //记得修改web.config 限制上传文件大小的节
    parallelUploads: 100,
    init: function () {
        var submitButton = document.querySelector(".up-file")
        cancelButton = document.querySelector(".cancel-file")
        myDropzone = this; // closure
        var current=this;
        //为上传按钮添加点击事件
        submitButton.addEventListener("click", function () {
            var sum = 0;
            $("#myDropzone .dz-preview").each(function(){
                var curr = this;
                var currSum = $(curr).children(".dz-details").children(".dz-size").children("span").children("strong").html();
                sum = sum + Number(currSum);
            })

            var pName=$(".input-write").val();
            if(pName==""){
                alert("请填写项目名称");
            } else if(sum >= 500){
                alert("文件总大小不能超过500M");

            } else{
                $(".indexAlone .cancel-file").show();
                $(".indexAlone .up-file").hide();
                cancelButton.addEventListener("click",function(){
                    myDropzone.removeAllFiles(true);
                    $(".indexAlone .cancel-file").hide();
                    $(".indexAlone .up-file").show();
                })
                //上传之前需校验(文件大小，文件类型，宽高比)
                //手动上传所有图片
                // $(".up-file").css("background-color","#ddd");
                // $(".up-file").attr("disabled","disabled");
                myDropzone.processQueue();
                //当上传完成后的事件，接受的数据为JSON格式
                current.on("success", function (file,xhr) {
                    $(".indexAlone .cancel-file").hide();
                    $(".indexAlone .up-file").show();
                    $(".indexAlone .aginAddpic").hide();
                    if (current.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                        var urls = [];
                        var ids = [];
                        $.each(xhr.files, function(i,v) {
                            urls.push(v.url);
                            ids.push(v.cloudFileId);
                        });
                        //文件上传完毕，发送添加全景业务请求
                        $.ajax({
                            url : "/pano/uploadByClouldFileId",
                            type : "post",
                            dataType : "json",
                            traditional: true,
                            data : {
                                name : function() {return $(".input-write").val();},
                                ids : ids
                            },
                            success : function(result) {
                                if (result.success) {
                                    window.location.href = "basic?id=" + result.id;
                                }
                            }
                        });
                    }
                });
            }
        });

        //当添加图片后的事件，上传按钮恢复可用
        this.on("addedfile", function () {
            $(".up-file").css("background-color","#5EAEE3");
            $(".up-file").removeAttr("disabled");
            $(".indexAlone .dz-started .aginAddpic").show();
        });
        //删除图片的事件，当上传的图片为空时，使上传按钮不可用状态
        this.on("removedfile", function () {
            if (this.getAcceptedFiles().length === 0) {
                $(".up-file").css("background-color","#ddd");
                $(".up-file").attr("disabled", true);
                $(".indexAlone .dz-started .aginAddpic").hide();
            }
        });
    }
});