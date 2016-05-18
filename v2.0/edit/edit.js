(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
	        'jquery',
	        'template',
	        'proxy',
	        'krpanoPluginJs',
	        'dist/dropzone',
    		//上传文件时 添加场景
    		'edit/addScene.tpl',
	        'depend/scrollBar/jquery.mCustomScrollbar.concat.min',
	        "css!depend/scrollBar/jquery.mCustomScrollbar.min",
	        'modul/jquery.sortableMenu',
	        'sortable'
		], factory);
    } else {
        // 全局模式
        factory(jQuery, template, proxy);
    }
}(function($, template, proxy, krpanoPluginJs){
	var self = null;
	var init = false;
	
	function X(data){
		self = this;

		$("body").delegate("input[readonly]", "select", function(){
			return false;
		});

		var element = this.element = $(template(edit, data));
		$(".content").append(element);
		
		elements = $(template(upFilePop, data));
		$("body").append(elements);
		
		this.groupList = $('#upFilePop .choose-zuNa');
		
	    //创建全景
		var xml = proxy.domain + "/editXml?id=" + panoId + "&" + Date.parse(new Date());
		
		this.initPano = function (){
			if(!init){
				init = true;
				embedpano({swf:"/krpano/krpano.swf", xml:xml, target:"panoView",  html5:"prefer", passQueryParameters:true, id:"krpanoSWFObject"});
			}
		}
	
		if($(".menu .menu_body li[data-isfinsh=1]").length > 0){
			this.initPano();
		}
		
		//左侧导航自适应
		function selfWH(){
			var wheight = $(window).height();
			var wwidth = $(window).width();
			var leftwidth = $(".content-left-left").width();

			height = wheight-70;
			$(".content-left-left").height(height);
			$(".content-left-right,.group-left-right").width(wwidth-leftwidth);
			$(".content-left-right,.group-left-right").height(wheight-70);
			$("#multi").height(wheight - 300);
			$(".content-content").height(height);
		}
		
		selfWH();
		//左侧导航自适应
		$(window).resize(function() {
			selfWH();
		})

		//this.initSortable();
		
		this._initEvent();
		
		/**
		 * 上传文件
		 */
		function uploadFile(){
	    // 弹出框
		    element.on("click",".first-upload",function(){
		    	self.addUploadIndex = layer.open({
				    type: 1,
				    title: "添加全景图",
				    closeBtn: 1,
				    shadeClose: false,
				    skin: 'addFileClas',
				    btn: false,
				    move: false,
				    // shift: 3,
				    area: ['600px', '553px'],
				    content: $('#upFilePop'),
				    success: function(){
				    	$(".fa-select .choosed-name").removeData("id").html("");
				    	$(".fa-select .chosed-zK .choose-zuNa").empty();


				    	var flag = false;
				    	$("#multi .menu_head").each(function(i){
				    		var li = $("<li data-id='" + $(this).data("id") + "'/>").appendTo($(".fa-select .chosed-zK .choose-zuNa"));
				    		li.html($(this).find(".editCommon").val());

				    		if($(this).parents(".menu").hasClass("curr")){
				    			li.click();
				    			flag = true;
				    		}
				    	});

				    	if(!flag){
				    		$(".fa-select .chosed-zK .choose-zuNa li:eq(0)").click();
				    	}
				    }
				});
			})
		}
		
		//上传文件
		uploadFile();
		
		//选择分组 组展开
		$("body").on("click",".fa-select .choosed-name",function(){
			var cur = this;
			var ul = $(cur).siblings(".chosed-zK");
			if(ul.css("display")=="none"){
				ul.slideDown("fast");
			} else {
				ul.slideUp("fast");
			}
		});
		
		//选择或者添加组
		$("body").on("click",".choose-zuNa li",function(){
			var currChoose = $(this).html();
			var id = $(this).data("id");
			$(this).parents(".chosed-zK").siblings(".choosed-name").html(currChoose).data("id",id);
			$(this).parents(".chosed-zK").slideUp("fast");
		});
		
		//滚动条
		$(".chosed-noAll").mCustomScrollbar();
		
		//添加组
		$("body").on("click",".new-zuAll .addZu-img",function(){
			var curr = this;
			var newZName = $(curr).siblings(".new-zuName").val();
			if(newZName == ""){
				$(curr).siblings(".new-zuName").focus();
			} else {
				self._addGroup(newZName);
				$(".fa-select .choosed-name").click();
			}
		})
		//单击预览
		$(".view").click(function(){
			$(this).attr("href","/pano/worksView?id="+panoId+"")
		})
		$("#multi").mCustomScrollbar({
			advanced: {
				autoScrollOnFocus: false
			}
		});
		
		setTimeout(function(){
			if(!$(".menu.curr")[0]){
				$(".menu_head:eq(0)").click();
			}
		}, 1000);
		
		this.uploadFile();
	}
	
	var fn = X.prototype;
	
	fn._initEvent = function(){
		this._initGroupEvent(this.element.find(".menu"));
		
		// 添加组
		this.element.find(".add .add-zu").click(this._addGroup);
		
		this.progress(this.element.find(".sucaijiayuan-list li"));

		this.element.find(".editPanoName .editName").click(function(){
			$(this).hide();
			$(this).siblings(".save-com").show();
			$(this).siblings(".span-input").hide();
			$(this).siblings(".editCommon").show().focus().select();
			return false;
		});
		this.element.find(".item-name").keyup(function(){
	        if(event.keyCode == 13){
				$(".editPanoName .save-com").click();
	        }
	    });
		this.element.find(".editPanoName .save-com").click(function(){
			var item = $(this).parents('.item');

			self._updatePano.call(this, panoId, item.find(".item-name").val());
		});
	}
	
	fn._initGroupSceneEvent = function(li){
		//修改名称时变对号
		li.find(".editName").on("click", function(event){
			event.stopPropagation();
			$(this).hide();
			$(this).siblings(".save-com").show();
			$(this).siblings(".span-input").hide();
			$(this).siblings(".editCommon").show().focus().select();
			
			return false;
		})
		
		// 单击左侧分组
		li.on('click', function(event){
			event.stopPropagation();
			
			if($(event.target).is('input')){
				return;
			}
			
			$(this).parents(".mCustomScrollBox").find("li").removeClass("choose");
			$(this).parent().siblings().children("li").removeClass("choose");
			$(this).parent().siblings().removeClass("menu_head-choose");
			$(this).addClass("choose");
			
			if(parseInt($(this).data('isfinsh')) == 1){
				if(init){
					krpanoPluginJs.sceneChange($(this).data("id"), panoId, $(this).data("pid"));
					$("#krpanoSWFObject").trigger("onnewpano");
				}
			} else {
				msg("未加载完成, 刷新重试");
			}
		})

		//修改项目名称 场景名称	

		li.find(".editCommon").keyup(function(){
	        if(event.keyCode == 13){
				li.find(".two-com").click();
	        }
	    });		
		li.find(".two-com").on("click",function(event){
			event.stopPropagation();
			
			var id = $(this).parent().data("id");
			var name = $(this).siblings(".editCommon").val();
			self._updatePano.call(this, id, name);
		});
		
		//场景删除
		li.find(".delet-btn").on("click",function(event){
			var _this = this;
			
			event.stopPropagation();
			
			layer.open({
				title: '你确定要删除该场景吗',
				closeBtn: 0,
				skin:'deletDefin',
				btn: ['确认', '取消'],
				yes: function(index, layero){
					proxy.sceneDelete({
						sceneId: $(_this).parent().data("id")
			        },function(result){
			        	if(result.success){
			        		msg("删除成功");	
			        		self.progressClear($(_this).parent());		        		
			        		$(_this).parent().remove();
			        		$(_this).parent().next().remove();
			        		//如果当前场景被删除,加载下个场景.
			        	} else{
			        		msg(result.errMsg);
			        	}
			        })
				}
			});						
		})
	}
	
	fn._initGroupEvent = function(menu){
		
		//修改名称时变对号
		menu.find(".menu_head .editName").on("click", function(event){
			event.stopPropagation();
			$(this).hide();
			$(this).siblings(".save-com").show();

            $(this).siblings(".span-input").hide();
            $(this).siblings(".editCommon").show().focus().select();
			return false;
		})
		
		//修改组名
		$(".menu_head .zu-name").keyup(function(){
	        if(event.keyCode == 13){
				menu.find(".menu_head .zu-save").click();
	        }
	    });
		menu.find(".menu_head .zu-save").on("click", function(event){
			event.stopPropagation();
			self._updateGroup.call(this, $(this).parent().data("id"), $(this).siblings(".zu-name").val());
		})
		
		//组删除
		menu.find(".menu_head .delet-btn").on("click", function(event){
			event.stopPropagation();
			var _this = this;
			
			var id = $(this).parent().data("id");
			
			layer.open({
				title: '你确定要删除该组及该组的所有场景吗',
				skin: 'deletDefin',
				closeBtn: 0,
				content: false,
				btn: ['确认', '取消']
				,yes: function(index, layero){
					var id = $(_this).parent().data("id");
					self._deleteGroup.call(_this, id);
				}
			});
		})
		
		
		menu.find("h3.menu_head").on('click', function(event){
			event.stopPropagation();
			var menu = $(this).parents(".menu");
			// $(this).addClass("on").siblings().removeClass("on");
			// var menuBody = $(this).parents(".menu").toggleClass("curr").find(".menu_body");
			// menuBody.slideToggle(600);


			var oldMenu = $(".menu.curr");
			var oldHead = oldMenu.find(".menu_head");
			var oldBody = oldMenu.find(".menu_body");

			if(menu.hasClass("curr")){
				oldMenu.removeClass("curr");
				oldBody.slideUp(600, function(){
					$(this).hide();
				});
				return;
			}
			oldMenu.removeClass("curr");
			oldBody.slideUp(600, function(){
				$(this).hide();
			});
			var menuBody = $(this).parents(".menu").addClass("curr").find(".menu_body");
			menuBody.slideDown(600);
		});
		
		//滚动条
		menu.find(".menu_body").mCustomScrollbar({
			autoDraggerLength: true,
		    theme: "minimal",
		    mouseWheel:{
		    	scrollAmount: 106
		    },
		    // scrollButtons:{
		    // 	scrollAmount: 106
		    // },
			callbacks:{
				onInit: function(){
					$(this).data("data",this.mcs);
				},
				whileScrolling: function(){
					$(this).data("data",this.mcs);
				}
			}
		});
		
		self.initSortable();
		self._initGroupSceneEvent(menu.find(".menu_body .sucaijiayuan-list li"));
	}
	
	fn.initSortable = function(){
		//拖拽排序
		$('.menu .menu_body .sucaijiayuan-list').sortableMenu("destroy").sortableMenu({
			connectWith: '.sucaijiayuan-list'
		}).bind('sortupdate', function(e, item) {
			var menu = $(this).parents(".menu"),
				menu_head = menu.find(".menu_head"),
				list = $(this).find("li");
			
			var data = {};
			
			var group = data[menu_head.data("id")] = [];
			
			
			list.each(function(i){
				var obj = {};
				
				obj.sceneId = $(this).data("id");
				obj.sortIndex = i + 1;
				group.push(obj)
			});
			proxy.groupSortIndex({
				panoId: panoId,
				json: jsonToStr(data)
			}, function(data){
				console.log(jsonToStr(data));
			});
			
			var listId=[];
			var json={};
			$("#multi .menu").each(function(){
				var zuId = $(this).children("h3").data("id");
				json.sceneId = zuId;
				$(this).find("li").each(function(i){
					var sceneId = $(this).data("id"); 
					json[i] = sceneId; 
				})
				listId.push(json);

			})

			console.log(this);
		});
	}
	
	//添加分组
	fn._addGroup = function(name){
		if(!name || typeof name !=="string"){
			name = "默认组";
		}
		
		proxy.groupCreate({
        	name: name,
        	panoId: panoId
        },function(data) {
        	if(data.success){
        		var addNew = "<div class='menu'><h3 class='menu_head' data-id='"+data.id+"'><i class='zk'></i><span class='span-input'>"+name+"</span><input type='text' value='"+name+"' class='zu-name new-zu editCommon' maxlength='18'><i class='delet-btn alone'></i><i class='bj-common editName clibg'></i><i class='bj-common zu-save save-com'></i></h3><div class='menu_body'><ul class='sucaijiayuan-list'></ul></div></div>";
        		var goroupList = $("<li/>").prependTo(self.groupList).data("id", data.id).html(name);
        		goroupList.click();
        		
        		
        		var element = $(template(addNew,data));
        		$(".layer").append(element);
        		
        		msg("添加组成功");
        		self._initGroupEvent(element);
        	} else {
        		msg(data.errmsg);
        	}
        });
	}
	
	//更新分组
	fn._updateGroup = function(id, name){
		var _this = this;
		if(!id){
			msg("参数错误");
			return;
		}
		
		proxy.groupUpdate({
        	id: id,
        	name: name,
        	panoId: panoId
        },function(result){
        	if(result.success){
        		msg("组名修改成功");
        	} else{
        		msg(result.errMsg);
        	}
        	
            var inputVal = $(_this).siblings(".editCommon").val();
            $(_this).siblings(".span-input").html(inputVal).show();
            $(_this).siblings(".editCommon").hide();
    		$(_this).hide();
			//$(_this).siblings(".editCommon").attr("readonly",true);
    		$(_this).siblings(".clibg").show();
        });
	}
	
	fn._deleteGroup = function(id){
		var _this = this;
		
		proxy.groupDelete({
        	id: id,
        	panoId:panoId
        },function(result){
        	if(result.success){
        		msg("删除成功");			        		
        		$(_this).parents(".menu").remove();
        	} else {
        		msg(result.errMsg);
        	}
        })
	}
	
	//更新全景名称
	fn._updatePano = function(id, name){
		var _this = this;
		
		
		proxy.panoUpdate({
			id: id,
			name: name
        },function (data){  //服务器成功响应处理函数		                    
            if(data && data.success){
                msg("保存成功");
                var inputVal = $(_this).siblings(".editCommon").val();
                $(_this).siblings(".span-input").html(inputVal).show();
                $(_this).siblings(".editCommon").hide();
        		$(_this).hide();	        		
        		$(_this).siblings(".clibg").show();
        		$(".content-content .project-name-ipt").val(name);
				updateUrl(location.href, name);
            } else {
            	msg(data.errMsg);
            }
        })
	}
	
	fn.progressGet = function(li){
		var name = li.find(".editCommon").val();
		var id = li.data("id");
		
		proxy.progress({
			panoId: id
		}, function(data){
			if(typeof data.percent === "number"){
				li.find(".progress-bar").width(data.percent * 100 + "%");
				
				if(data.percent == 1){
					self.progressClear(li);
					self.initPano();
				}
			} else {
				msg(name + "获取进度失败,停止获取");
				self.clearInterval(li);
			}
		});
	}
	
	fn.progressClear = function(li){
		clearInterval(li.data("interval"));
		
		setTimeout(function(){
			li.find(".progress").removeClass("in");
			li.data("isfinsh",1);
		}, 500);
	}
	
	fn.progress = function(li){
		li.each(function(){
			var _this = $(this)
			var isfinsh = $(this).data("isfinsh");
			if($(this).data("isfinsh") == "0"){
				var temp = setInterval(function(){self.progressGet(_this)}, 3000);
				$(this).data("interval", temp);
			}
		});
	}
	
	fn.uploadFile = function(){
		var options = proxy.updateDate();

		if(options && options.data){
			$("<input/>").attr("type", "hidden").attr("name", "UI").val(options.UI).appendTo(".dropzone");
			$("<input/>").attr("type", "hidden").attr("name", "TS").val(options.TS).appendTo(".dropzone");
			$("<input/>").attr("type", "hidden").attr("name", "access_token").val(options.access_token).appendTo(".dropzone");
		}
		Dropzone.autoDiscover = false;
		$(".dropzone").dropzone({
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
		    //记得修改web.config 限制上传文件大小的节
    		parallelUploads: 100,
		    init: function () {
		        var submitButton = $(".up-file")
		        cancelButton = $(".cancel-file")
		        myDropzone = this; // closure
		        var current = this;
		        
		        //为上传按钮添加点击事件
		        submitButton.on("click", function (){
		        	var sum = 0;
		            $("#myDropzone .dz-preview").each(function(){
		                var curr = this;
		                var currSum = $(curr).children(".dz-details").children(".dz-size").children("span").children("strong").html();
		                sum = sum + Number(currSum);
		            })
		        	var pName = $(".input-write").val();
					if(pName == ""){
						msg("请填写项目名称");
					} else if(sum >= 500){
		                msg("文件总大小不能超过500M");

		            } else {
		            	$(".addFileClas .cancel-file").show();
		                $(".addFileClas .up-file").hide();
		                cancelButton.on("click",function(){
		                    myDropzone.removeAllFiles(true);
		                    $(".addFileClas .cancel-file").hide();
		                    $(".addFileClas .up-file").show();
		                    $(".addFileClas .aginAddpic").hide();
		                })
						//上传之前需校验(文件大小，文件类型，关高比)
						//单击上传之后不能再单击上传按按钮
						//手动上传所有图片
						myDropzone.processQueue();
					
					}
		        });
		        
		        //当上传完成后的事件，接受的数据为JSON格式
	            current.on("success", function (file, xhr) {
	            	
                    $(".addFileClas .cancel-file").hide();
                    $(".addFileClas .up-file").show();
                    $(".addFileClas .aginAddpic").hide();
	            	if (current.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
						var urls = [];
						var ids = [];
						$.each(xhr.files, function(i, v) {
							urls.push(v.url);
							ids.push(v.cloudFileId);
						});
						
						var groupId = $(".chosed-zK").siblings(".choosed-name").data("id");
						var menu_head = $("#multi .menu_head[data-id="+groupId+"]");
						var menu = menu_head.parents(".menu");
						var ul = menu.find(".sucaijiayuan-list");
						var menu_body = menu.find(".menu_body");
						
						// menu_head.click();
						
						proxy.panoUploadSceneByCloudFileId({
							groupId: groupId,
							panoId: panoId,
							ids: ids
						}, function(data){
							layer.close(self.addUploadIndex);
							
							if(!data.success){
								msg(data.errMsg);
								return;
							}
							
							for(var i in data.data){
								var pano = data.data[i];
								var li = $('<li class="">\
										<i class="drap"></i>\
										<span class="left-bor"></span>\
										<span class="span-input"></span>\
										<input type="text" class="name editCommon" value="" maxlength="8">\
										<i class="delet-btn"></i><i class="clibg bj-common editName"></i>\
										<i class="bj-common save-com scene-save two-com"></i>\
										<div class="progress progress-striped active fade in"><div class="progress-bar"/></div>\
								</li>');
													
								ul.append(li);
								li.data("id", pano.id);
								li.data("pid", pano.pid);
								li.data("isfinsh", pano.isFinsh);
								li.find(".editCommon").val(pano.name);
								li.find(".span-input").html(pano.name);

								self.progress(li);
								
								self._initGroupSceneEvent(li);
								self.initSortable();
								myDropzone.removeAllFiles();
							}
							
							menu_body.mCustomScrollbar("scrollTo", "bottom");
						});
	            	}

	            });

				//当添加图片后的事件，上传按钮恢复可用
				this.on("addedfile", function () {
					elements.find(".up-file").css("background-color","#5EAEE3");
					elements.find(".up-file").removeAttr("disabled");
            		$(".addFileClas .dz-started .aginAddpic").show();
				});
				
				//删除图片的事件，当上传的图片为空时，使上传按钮不可用状态
				this.on("removedfile", function () {
					if (this.getAcceptedFiles().length === 0) {
						elements.find(".up-file").css("background-color","#ddd");
						elements.find(".up-file").attr("disabled", true);
						$(".addFileClas .dz-started .aginAddpic").hide();
					}
				});
		    }
		});
	}
	
	return X;
})
)