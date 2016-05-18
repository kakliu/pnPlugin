$(function(){
    var proxy = window.proxy;

    //加载列表
    function reload(currentPage){
        var op = {
            type: $(".content-top-left li.curr").attr("type")
        }

        if($(".content-content-top .curr").index() == 1){
            op.status = 1;
        } else if($(".content-content-top .curr").index() == 2){
            op.status = 0;
        }

        if($(".search-all .search").val()){
            op.searchName = $(".search-all .search").val();
        }

        op.pageSize = 19;

        if(currentPage) {
            op.pageIndex = currentPage;
        }

        proxy.getPanoList(op, function(data){
            var listContent=$(template(index, data));
            $(".container .content-content-content").empty();
            $(".container .content-content-content").append(listContent);

            //初始化分页
            page(data);
            uploadFile();
            initevent();
        });
    }

    function initevent(){
        /*【全选-1】表单中的复选框，勾选掉之后，全选也不被选中*/
        $(".container").on("click", ".choose-this", function(){
            var input = $(".choose-this");
            var i=0;

            if ($(this).prop("checked")){
                $(this).parents("li").addClass("curr");
            } else{
                $(this).parents("li").removeClass("curr");
            }

            input.each(function(a){
                if(!($(this).prop("checked"))){
                    i=1;
                }
            })

            if(i > 0){
                $(".choosebtn").prop("checked",false);
            }

            if(i == 0){
                $(".choosebtn").prop("checked",true);
            }
        })

        $(".container .list li .list-img-bottom").mouseover(function(event){
            $(this).children(".bottom-icon").show();
            $(this).children(".botom-bg").show();
        }).mouseout(function(){
            $(this).children(".bottom-icon").hide();
            $(this).children(".botom-bg").hide();
        })

        $(".container").on("click", ".undercarriage",function(){
            var li = $(this).parents("li");
            var status = $(this).attr("status");

            if(status == "0"){
                release(li);
            } else {
                unrelease(li);
            }
        })
    }

    //取消发布
    function unrelease(lis){
        var liList = [];
        var ids = [];

        lis.each(function(){
            var li = $(this);
            var id = $(this).attr("data-id");
            var status = $(this).find(".undercarriage").attr("status");

            if(status == "1"){
                ids.push(id);
                liList.push(li);
            }
        })

        if(!ids || ids.length == 0){
            return;
        }

        var data = {id: ids};

        proxy.unrelease(data, function(data){
            if(data.success == true){
                msg("取消发布成功");

                $.each(liList,function(i, n){
                    var current = $(n).find(".undercarriage");

                    $(current).text("发布");
                    $(current).attr("status","0");
                    $(current).parents(".list-img-bottom").siblings(".fbcommon").html("未发布").css({"background-color":"#D7D7D7","color":"#666"});
                })
            } else {
                msg(data.errMsg);
            }
        });
    }

    //发布
    function release(lis){
        var liList = [];
        var ids = [];

        lis.each(function(){
            var li = $(this);
            var id = $(this).attr("data-id");
            var status = $(this).find(".undercarriage").attr("status");

            if(status == "0"){
                ids.push(id);
                liList.push(li);
            }
        })

        if(!ids || ids.length == 0){
            return;
        }

        var data = {id: ids};

        proxy.release(data, function(data){
            if(data.success == true){
                msg("发布成功");

                $.each(liList,function(i, n){
                    var current = $(n).find(".undercarriage");

                    $(current).text("取消发布");
                    $(current).attr("status","1");
                    $(current).parents(".list-img-bottom").siblings(".fbcommon").html("已发布").css({"background-color":"#5eaee3","color":"#fff"});
                })
            } else {
                msg(data.errMsg);
            }
        });
    }

    //删除
    function deletePano(lis){
        var liList = [];
        var ids = [];

        lis.each(function(){
            var li = $(this);
            var id = $(this).attr("data-id");

            ids.push(id);
        })


        if(!ids || ids.length == 0){
            return;
        }

        var data = {id: ids};

        proxy.deletePano(data, function(data){
            if(data.success == true){
                msg("删除成功", function(){
                    reload();
                });
            } else {
                msg(data.errMsg);
            }
        });
    }

    /**
     * 上传文件
     */
    function uploadFile(){
        // 弹出框
        $(".container").on("click",".first-upload",function(){
            layer.open({
                type: 0,
                title: "添加全景图",
                closeBtn: 1,
                shadeClose: false,
                skin: ['yourclass listClass indexAlone'],
                btn: false,
                move: false,
                area: ['600px', '553px'],
                // icon :0,图标
                content: '<div class="layer-contianer">\
				    <div class="layer-content">\
					    <span>项目名称/NAME</span>\
					    <input type="text" id="pName" class="input-write">\
				    </div>\
				    <form action="/" class="dropzone" enctype="multipart/form-data" id="myDropzone" method="post"><div class="aginAddpic"></div></form>\
					<div>\
					  <button type="submit" id="submit-all" disabled="disabled" class="up-file">上传全景图</button>\
					  <button type="submit" id="cancel-all" class="cancel-file">取消上传</button>\
					</div>\
				    </div>\
					<script type="text/javascript" src="//code.panocooker.com/v2.0/index/upimg3.js"></script>'
            });
        })
    }

    /**
     * 分页
     */
    function page(data){
        $(".pageDiv").createPage({
            pageCount:data.totalPage,//总页数
            current:data.currentPage,//当前页
            turndown:'false',//是否显示跳转框，显示为true，不现实为false
            backFn:function(current){
                reload(current);
                pagemoveTop();
            }
        });
    }

    /**
     * 点击分页上移
     */
    function pagemoveTop(){
        var pageH = ($(".top").height() + 40);
        $("html,body").animate({ "scrollTop": pageH }, 300);
    }

    function msg(msg, fn){
        layer.msg(msg, {
            time: 1000 //1秒关闭（如果不配置，默认是3秒）
        }, fn);
    }


    /*【全选】“全选”按钮事件,按下后选择所有的复选框，再按下取消所有的全选框*/
    $(".container").off("").on("click", ".choosebtn", function(){
        if ($(this).prop("checked")){
            $(".choose-this").prop("checked",true);
            $("#itemContainer li").addClass("curr");
        } else{
            $(".choose-this").prop("checked",false);
            $("#itemContainer li").removeClass("curr");
        }
    })

    $(".container").on("click",".quit",function(){
        unrelease($("#itemContainer li.curr"));
    });

    $(".container").on("click",".publish",function(){
        release($("#itemContainer li.curr"));
    });

    $(".container").on("click",".delet",function(){
        deletePano($("#itemContainer li.curr"));
    });

    //搜索时按下回车键时
    $(".search").keyup(function(){
        if(event.keyCode == 13){
            reload();
        }
    });

    $(".search-all").on("click", ".icon-search",function(){
        reload();
    })

    $(".content-content-top").children("label").children("input").click(function(){
        $(this).parent().siblings().removeClass("curr");
        $(this).parent().addClass("curr");
        reload();
    });

    $(".content-top-left li").click(function(){
        if(!$(this).hasClass("curr")){
            $(".content-top-left li").removeClass("curr");
            $(this).addClass("curr");

            reload();
        }
    })

    $(".search-all .search").val(getQueryString("search"));
    reload();

    //退出登录
    $(".logout a").click(function() {
        var url = window.location.host;
        var ducxurl = url.indexOf("duc.cn");
        var pcxurl = url.indexOf("panocooker.com");
        if (ducxurl > -1) {
            window.location.href = "http://login.duc.cn/logout?redirectURL=http://ypano.duc.cn";
        } else if (pcxurl > -1) {
            window.location.href = "http://login.panocooker.com/logout?redirectURL=http://pano.panocooker.com";
        }

    })
})