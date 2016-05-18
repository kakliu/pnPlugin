(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
			'jquery', 
			'template', 
			'krpanoPluginJs',
			'proxy',
			'hotspot/registehotspot',
			//layer弹窗
			'layer',
			'layerExt',
			'css!depend/css/layer.ext',
			//添加图片热点
			'p/hotspot/default/edit/addpicture.tpl', 
			//前台图文展示
			'p/hotspot/default/edit/hotView.tpl',
			'css!p/hotspot/default/edit/hotView',
			//添加热点,热点旁边的三个按钮
			'p/hotspot/default/edit/addhotspotIcon.tpl',
			//添加热点,热点旁边的三个按钮
			'p/hotspot/default/edit/addfont.tpl',
			'depend/util/model',

			//图片上传 
			'jquery.fileupload',
			'jquery.fileupload-validate',
			'jquery.fileupload-image',
			'load-image',	
			'modul/mbPhotos',
			'p/hotspot/default/edit/index.tpl',
			//连接器底部的表情包左右切换
	    	'depend/tabLeftRight/simplefoucs',
			//图片上传
			'depend/upLoadImg/upLoadImg',
			'css!p/hotspot/default/edit/addHotspot',
			//删除热点
			'p/hotspot/default/edit/hotspotDelet.tpl',
			//滚动条
			'depend/scrollBar/jquery.mCustomScrollbar.concat.min',
         	'css!depend/scrollBar/jquery.mCustomScrollbar.min'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy, registehotspot, layer, hotViewTpl){
	var self;
	var krpano;
	var plugin;
	function X(k, p){
		krpano = k;
		plugin = p;
	}

	var fn = X.prototype;

	fn.edit = function() {
		this.options = {
			icon: "/v2.0/images/hotspotImg.png"
		};
		self = this;
		var hotspotFn;
		var hotspot;
		this.init = function(dom){
			self = this;
			this.dom = dom;
			this.initEvent();

			hotspotFn = registehotspot.getInstance("spot", {
				loadSceneRemoveHotspot: true,
				element: self.commentspot,
				isSaveMove: true,
				saveFlag: true,
				isInitIconEvent: true
			});
		}

		this.show = function(){
			hotspot = hotspotFn.addHotspot({
				iconName: "spoticon102",
				data: {}
			});
			hotspot.callwith("onclick");
			this.dom.data("curr", false);
		}

		this.hide = function() {
			_this.comment.hide();
		}

		this.initEvent = function(){
			
		}


		this.commentspot = function(){
			var _this = this,
				data={};

			this.init = function(data, isSave){
				_this.comment = $(template(addhotspotIcon, {})).hide().data("curr", false);
				var element = $(template(addpicture, data));
				var iconTab = {list:krpanoPluginJs.getIconPackage()};
				var elements = $(template(addfont, iconTab));
				var deleteSpot = $(template(hotspotDelet, {}));
				_this.comment.find(".hotspot-edit").append(element);
				_this.comment.find(".hotspot-label").append(elements);
				_this.comment.find(".hotspot-delete").append(deleteSpot);
				
				var hotspoti = _this.comment.find(".hotspot-i i");
				this.title = _this.comment.find(".addHot-title-title");
				this.content = _this.comment.find(".textarea-content");
				this.address = _this.comment.find(".addHot-title-address");
				this.upImg = _this.comment.find(".hotfileList");
				hotspoti.click(function(){
					//表情包出现滚动条
					_this.comment.find(".hotspot-edit-link .content .listIcon").mCustomScrollbar();
					//上传图片太多出现滚动条
					_this.comment.find(".up-hotpicture .upallpic").mCustomScrollbar();
					hotspoti.siblings().hide();
					$(this).siblings().show();
				})
				//页面加载时获取信息
				if(data){
					this.title.val(data.title);
					this.content.html(data.content);
					this.address.val(data.url);
					if(data.pic){
						var ceshi='<%for(var i = 0; i < data.pic.length; i++){%><div class="showImg"><img src="//code.panocooker.com/p/hotspot/default/images/delet.png" class="deleteHimg"><img src="<%=data.pic[i]%>" class="setImgwh"></div><%}%>';		
						var elements =$(template(ceshi,data));
						this.upImg.append(elements);
						_this.comment.find(".bottom-btn ul li").removeClass("curr");
						_this.comment.find(".bottom-btn ul li.picture").addClass("curr");
						_this.comment.find(".up-hotpicture").show();
						
					}
				}
				//显示图文热点
				_this.comment.on("click",".bottom-btn li.com",function(){
					var index = $(this).index();
					if(index==1) {
						_this.comment.find(".up-hotpicture").show();	
						$(this).addClass("curr");
						$(this).siblings().removeClass("curr");				
					} else {
						_this.comment.find(".up-hotpicture").hide();
						$(this).addClass("curr");
						$(this).siblings().removeClass("curr");	
					}
				})
				//添加热点图文热点里上传图片
				upLoadImg(_this.comment.find(".aloneupfile"));
		
				//删除这个图片
				_this.comment.on("click",".deleteHimg",function(){
					$(this).parent().remove();
				})
				//单击关闭
				_this.comment.on("click",".close",function(){
					$(this).parents(".hotspot-edit-common").hide();
				})
				//选择图标样式
				var listIcons = _this.comment.find(".listIcon");
				var liticonUl= _this.comment.find(".apply_w");
				var liticonLi= _this.comment.find(".apply_array");
				for(var i = 0; i < iconTab.list.length; i++) {
					var ul = $("<ul class='getSpot'/>").appendTo(listIcons);
					for(var x = 0; x < iconTab.list[i].styleList.length; x++) {
						var icon = iconTab.list[i].styleList[x];
						li = $("<li/>").appendTo(ul);
						li.click(function(){
							var icon = $(this).data();
							var url = icon.url;
							_this.hotspotFn.loadStyle(icon.name);
							$(this).parents(".hotspot-edit-common").hide();
							var hotspot = $(this).parents(".hotspot-i").data("hotspot");
							
							return false;
						}).data(icon);
						
						$("<img>").appendTo(li).attr("src", icon.thumb);
					}
				}
				//单击切换表情包
	 			_this.comment.on("click",".apply_array",function(){
	 				liticonLi.removeClass("curr");
	 				$(this).addClass("curr");
	 				var index = $(this).index();
	 				_this.comment.find(".getSpot").hide();
	 				_this.comment.find(".getSpot").eq(index).show();
	 			})
	 			var btn = _this.comment.find(".apply");
				//底部表情包切换
				botscroll(btn);
				//单击确定保存填写的图文信息

				_this.comment.on("click",".addSave",function(){
					var types = _this.comment.find(".bottom-btn ul li.curr").attr("type");
					var content = _this.comment.find(".textarea-content").val();
					var title = _this.comment.find(".addHot-title-title").val();
					var address = _this.comment.find(".addHot-title-address").val();
					var thumbL = _this.comment.find(".hotfileList .showImg").length;
					var list = [];
					//判断地址是否正确
					//判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
					//下面的代码中应用了转义字符"\"输出一个字符"/"
					// var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
					// var objExp=new RegExp(Expression);
					// if(address !=""){
					// 	if(objExp.test(address)==true){
					// 	}else{
					// 		msg("地址不正确");
					// 		return false;
					// 	}
					// } else {
						
					// }
						 
					_this.comment.find(".showImg").each(function(){
						var datas=$(this).find("img.setImgwh").attr("src");
						list.push(datas);

					})
					_this.hotspotFn.saveHotspot({
						data:{
							type:types,
							content:content,
							title:title,
							linkUrl:address,
							thumbL:thumbL,
							list: list,
							mainPanoId: panoId,
							panoId: krpanoPluginJs.getSceneId(),
							address: address
						}
					});
				})
				//删除热点
				_this.comment.on("click",".confirm",function(){
					_this.hotspotFn.removeHotspot();
				})
				//取消删除热点
				_this.comment.on("click",".cancel",function(){
					_this.comment.find(".hotspot-delete-model").hide();
				})
				if(isSave){
					_this.comment.addClass("comment_finsh");
				}

		        return _this.comment;

			}
			
			this.onresize = function(){}

			this.onremove = function(id, hotspot){
				proxy.hotspotDelete({
					id: id
				},function(data){
					if(!data.success){
						msg(data.errMsg);
						return;
					} else{
						msg("删除成功");
					}
				})
			}
			_this.vlidate = function(data, hotspot){
				var obj = {};

				//判断type类型
				if(data.type == ""){
					msg("系统错误",function(){
						_this.comment.find(".textarea-content").focus();
					});

					return;
				}

				//判断标题类型
				if(data.title == ""){
					msg("请填标题",function(){
						_this.comment.find(".addHot-title-title").focus();
					});

					return;
				}

				if(data.type == 4 && data.content == ""){
					msg("请填写内容",function(){
						_this.comment.find(".textarea-content").focus();
					});

					return;
				}

				if(data.type == 1 && data.thumbL <= 0){
					msg("请上传图片",function(){
					});
					
					return;
				} else {
					obj.pics = data.list;
				}

				if(data.address){
					obj.linkUrl = data.address;
					obj.isLinkUse = 0;
				} else {
					obj.isLinkUse = 1;
				}
				var id;
				obj.resourceType = data.type;	
				obj.title = data.title;
				obj.content = data.content;
				obj.atv = hotspot.atv;
				obj.ath = hotspot.ath;
				obj.async = false;
				obj.mainPanoId = data.mainPanoId;
				//obj.iconId = hotspot.iconid;
				obj.panoId = data.panoId;
				obj.hotspotType =1;
				obj.type = 2;
				return obj;
			}

			this.onsave = function(data, hotspot) {
				var id;

				var obj = _this.vlidate(data, hotspot);

				obj.iconId = hotspot.iconid;
				if(!obj){return}

				proxy.addHotspot(obj, function(data){
					if(!data.success){
						msg(data.errMsg);
						return;
					} else{
						krpanoPluginJs.set("hotspot["+hotspot.name+"].id",data.id);
						msg("添加成功");
					}

					//var hotspot = $(_this).parents(".hotspot-i").data("hotspot");
					id = data.id;
				})


				return id;

			}

			this.onupdate = function(data, hotspot){
				var id;
				var types = _this.comment.find(".bottom-btn ul li.curr").attr("type");

				var obj = _this.vlidate(data, hotspot);
				obj.id = hotspot.id;
				obj.resourceType = types;
				obj.iconId = hotspot.iconid;
				if(!obj){return}

				proxy.addHotspot(obj, function(data){
					if(!data.success){
						msg(data.errMsg);
						return;
					} else{
						msg("修改成功");
					}
				})
			}

			this.onmoveupdate = function(data,hotspot){
				if(hotspot.is_save){
					proxy.addHotspot({
						atv:hotspot.atv,
						ath:hotspot.ath,
						mainpanoid: panoId,
						id:hotspot.id
					},function(data){
						if(!data.success){
							msg(data.errMsg);
							return;
						} else{
							//msg("修改成功");
						}
					})
				}
			}

			this.onupdatestyle = function(data,hotspot){
				_this.comment.css("top", data.y - 40);
			}

			this.onclick = function(data, hotspot){

				if(_this.comment.data("curr") == false){
					var list = _this.hotspotFn.getHotspot();

					for(var i in list){
						var fn = list[i].element;

						if(!fn){
							console.log(list[i]);
							continue;
						}

						fn.comment.hide().data("curr", false);
						fn.hotspotFn.zorder(false);
					}
					//表情包出现滚动条
					_this.comment.find(".hotspot-edit-link .content .listIcon").mCustomScrollbar("destroy");
					_this.comment.show().data("curr", true);
					_this.hotspotFn.zorder(true);

					//上传图片太多出现滚动条
					_this.comment.find(".up-hotpicture .upallpic").mCustomScrollbar("destroy");


				}	
				
			}
		}
	};
	fn.view = function() {
		self = this;
		this.isAddPlugin = false;
		this.init = function(){

			hotspotFn = registehotspot.getInstance("spot", {
				element: self.commentspot,
				saveFlag: true,
				isInitIconEvent: true,
				loadSceneRemoveHotspot: true
			});
		}


		this.commentspot = function(hotspot){
			logger.log(hotspot);
			var _this = this,
				data={};
			this.init = function(data, isSave){
				 this.hotspotElement = $("<div class='hotspot'/>").delegate(".model .contents","mousedown",function(){
					return false;
				});
				if(isMb && !isPad) hotspot.scale = 0.6;
				_this.comment = $(template(hotView,{}));
				var title = _this.comment.find(".hotTitle");
				var content = _this.comment.find(".hotContent");
				var picture = _this.comment.find(".hotPictureShow");
				var detail = _this.comment.find(".hotspot-view-detail");

				if(data){
					title.html(data.title);
					content.html(data.content);
					if(data.url){
						detail.attr("href",data.url);
						_this.comment.find(".hotspot-view-detailAll").show();
					} else {
						_this.comment.find(".hotspot-view-detailAll").hide();
					}
					if(data.pic){
						var ceshi ='<%for(var i = 0; i < data.pic.length; i++){%><div class="bg_img"><img src="<%=data.pic[i]%>" class="setImgwh"></div><%}%><span class="picSum"><%=data.pic.length%>张</span>';	

						var element = $(template(ceshi,data));

						picture.append(element);
						var pictureShow = _this.comment.find(".hotPictureShow");
					}
					var view = this.addViewHot("viewEdit", _this.comment);//加载扩展模块
				}
				
				
				// console.log(layer);
				// console.log(pictureShow);

				//相册查看器
			    layer.photos({
					closeBtn: 2,
					move: false,
					moveOut: false,
					shift:2,
			        photos: pictureShow,
				    tab: function(pic, layero){
				    	var imgW = layero.width();
				    	var imgH = layero.height();
				    	var bgW = layero.width() + 200;
				    	var bgH = layero.height() + 200;
				    	var sw = $(window).width();
				    	var sh = $(window).height();

				    	if(bgW > sw || bgH > sh) {
				    		var salce = 1;

				    		if(bgW - sw > bgH - sh){
				    			salce = sw / bgW;
				    		} else {
				    			salce = sh / bgH;
				    		}

				    		layero.css({width: imgW * salce, height: imgH * salce});
				    		$(window).resize();
				    	}
				    }
			    });

			   
				if(isSave){
					this.hotspotElement.addClass("comment_finsh");
				}

		        return this.hotspotElement;

			}

			this.onover = function(data,hotspot) {
				var currDom = _this.comment.find(".hotspot-viewPsre");
				currDom.children(".hotspot-view-icon-show").css("transform","rotate(180deg)");
				currDom.removeClass("hotspot-view-Width").addClass("hotspot-view-yWidth");
				currDom.parents(".model").css("width","252px");
				_this.hotspotFn.zorder(true);				
			}
			this.onout = function(data,hotspot) {
				var currDom = _this.comment.find(".hotspot-viewPsre");
				currDom.children(".hotspot-view-icon-show").css("transform","rotate(0deg)");
				currDom.removeClass("hotspot-view-yWidth").addClass("hotspot-view-Width");
				currDom.parents(".model").css("width","155px");
				_this.hotspotFn.zorder(false);				
			}

			// 移动端点击添加事件
			this.onclick = function(data,hotspot){
				var currDom = _this.comment;
				if(isMb && !isPad){
					var hasView =  _this.hotspotElement.hasClass('pactive');
					var targetDom = event.target || event.srcElement;
					if(targetDom.tagName == "IMG"){
						$('body').mbPhotos({    
						  	className: 'commentPhotos',
					    	title: data.title,    
					   		disc: data.content,
					   		photos:data.pic     
						});
						return false;				
					} 
					
					_this.hotspotElement.toggleClass('pactive');
				} else if(isPad) {
					!!(currDom.find(".hotspot-view-yWidth").length) ? _this.onout() : _this.onover();
				}
			}

			this.onupdatestyle = function(data,hotspot){
				this.hotspotElement.css({"top": data.y - 11, "left": data.x * 2 + 3});
			}

			this.addViewHot = function(className, content){
				var obj = {};
				var self = this;

				var button = $("<div class='hotspot-view hotspot-"+className + "'></div>").appendTo(this.hotspotElement);

				if(content){
					var model = $("<div class='hotspot-"+className + "-model'/>").appendTo(button).model({content: content,hasButton:false});
					obj.button = button;
					obj.model = model;
					obj.modelElement = model.element;
					obj.isShow = true;

					button.data("hotspot", obj);
					button.data("name", className);

					button.on("close", function(){
						obj.isShow = false;
					})
				}


				return obj;
			}
			
		}
	}

	return X;
})
)