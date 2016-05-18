define([ 
         'jquery', 
         'template', 
         'krpanoPluginJs',
         'proxy',
         '/depend/util/model.js',
          //图片上传 
         'jquery.fileupload',
         'jquery.fileupload-validate',
         'jquery.fileupload-image',
         'load-image',
         //layer弹窗
         'layerExt',
         'css!/depend/css/layer.ext',
        'p/hotspot/default/edit/index.tpl',
         //添加图片热点
	    'p/hotspot/default/edit/addpicture.tpl',    
		//添加连接器
		'p/hotspot/default/edit/addfont.tpl',
	    //连接器底部的表情包左右切换
	    'depend/tabLeftRight/simplefoucs',
	    //前台图文展示
	    'p/hotspot/default/edit/hotView.tpl',
	    "css!p/hotspot/default/edit/hotView.css",
	    //图片上传
	    'depend/upLoadImg/upLoadImg',
         "css!p/hotspot/default/edit/index.css",
         'depend/scrollBar/jquery.mCustomScrollbar.concat.min',
         "css!depend/scrollBar/jquery.mCustomScrollbar.min"
], function($, template, krpanoPluginJs, proxy, model) {
	

	function X(krpano, plugin) {
		var self = this;
		this.listButton = {}
		this.plugin = plugin;
		krpanoPluginJs.init(krpano, plugin);
		this.hotspot = krpanoPluginJs.get(plugin.parent);
		this.init(krpano, plugin);
	}

	X.prototype = {
		init : function(krpano, plugin) {
			this.hotspotElement = $("<div class='hotspot'/>").delegate(".model .contents","mousedown",function(){
				return false;
			});
			
			krpanoPluginJs.addChilde(this.hotspotElement);

			if(this.hotspot.hotspot_type.indexOf("link") >= 0){
				this.initLink();
			} else if(this.hotspot.hotspot_type == "spot"){
				this.initEdit();
				this.initeditView();
			} else {
				return;
			}
			this.initLabel();
			this.initDelete();
		},
		addView: function(className, title, content){
			var obj = {};
			var self = this;

			var button = $("<div class='hotspot-i hotspot-"+className + "'><i class='icon-"+className+"'/></div>").appendTo(this.hotspotElement);

			if(title && content){
				var model = $("<div class='hotspot-"+className + "-model'/>").appendTo(button).model({title:title,content: content,hasButton:false});

				button.find(".icon-"+className).click(function(){
					var _this = $(this).parents(" .hotspot-i");
					var hotspot = _this.data("hotspot");
					var name = _this.data("name");

					$.each(self.listButton, function(k, v){
						if(v.isShow && name != k){
							v.model.close();
							v.isShow = false;
						}
					})

					if(!hotspot.isShow){
						hotspot.model.open();
						hotspot.isShow = true;
					}
				});

				obj.button = button;
				obj.model = model;
				obj.modelElement = model.element;
				obj.isShow = false;

				button.data("hotspot", obj);
				button.data("name", className);
				self.listButton[className] = obj;

				button.on("close", function(){
					obj.isShow = false;
				})
			}


			return obj;
		},
		addViewHot: function(className, content){
			var obj = {};
			var self = this;

			var button = $("<div class='hotspot-i hotspot-"+className + "'><i class='icon-"+className+"'/></div>").appendTo(this.hotspotElement);

			if(content){
				var model = $("<div class='hotspot-"+className + "-model'/>").appendTo(button).model({content: content,hasButton:false});

				button.find(".icon-"+className).click(function(){
					var _this = $(this).parents(".hotspot-i");
					var hotspot = _this.data("hotspot");
					var name = _this.data("name");

					$.each(self.listButton, function(k, v){
						if(v.isShow && name != k){
							v.model.close();
							v.isShow = false;
						}
					})

					if(!hotspot.isShow){
						hotspot.model.open();
						hotspot.isShow = true;
					}
				});

				obj.button = button;
				obj.model = model;
				obj.modelElement = model.element;
				obj.isShow = false;

				button.data("hotspot", obj);
				button.data("name", className);
				self.listButton[className] = obj;

				button.on("close", function(){
					obj.isShow = false;
				})
			}


			return obj;
		},
		bindEvent: function(className, eventName, fn){
			this.listButton[className].modelElement.on(eventName, fn);
		},
		initLink: function(){
			var scenes = krpanoPluginJs.getScene();
			var self = this;

			var html = $("<ul/>");

			for(var i = 0 in scenes){
				$("<li/>").appendTo(html).html(scenes[i].title).data("scene",scenes[i]).click(function(){
					var scene = $(this).data("scene");
					var _this = $(this);
					var data = krpanoPluginJs.updateHotspot(self.hotspot.name);
					
					if(!data.success){
						msg(data.errMsg);
						return;
					}
					
					proxy.hotspotAddLink({
						hotspotId: self.hotspot.id,
						linkedId: scene.id,
						linkedScene: scene.name
					},function(data){
						if(!data.success){
							msg(data.errMsg);
							return;
						}else{
							msg("添加成功");
						}
						
						var hotspot = $(_this).parents(".hotspot-i").data("hotspot");
						
						hotspot.model.close();
					})
				});
			}

			this.addView("link", "选择连接场景", html);
			
			$(".hotspot-link-model .content").mCustomScrollbar();
		},
		initLabel: function(){
			var self = this;
			//var iconPacks = krpanoPluginJs.hotspotIconList();
			var iconTab = {list:krpanoPluginJs.getIconPackage()};
			var html = $(template(addfont, iconTab));
			var listIcons = html.find(".listIcon");
			var liticonUl= html.find(".apply_w");
			var liticonLi= html.find(".apply_array");
			for(var i = 0; i < iconTab.list.length; i++) {
				var ul = $("<ul class='getSpot'/>").appendTo(listIcons);
				for(var x = 0; x < iconTab.list[i].styleList.length; x++) {
					var icon = iconTab.list[i].styleList[x];
					var li = $("<li/>").appendTo(ul);
					li.click(function(){
						var _this = $(this);
						var icon = $(this).data();
						krpanoPluginJs.loadIcon(self.hotspot.name, icon.name);
						
						var data = krpanoPluginJs.updateHotspot(self.hotspot.name);
						
						var hotspot = $(_this).parents(".hotspot-i").data("hotspot");
						hotspot.model.close();
						return false;
					}).data(icon);
					
					$("<img>").appendTo(li).attr("src", icon.thumb);
				}
			}
			//单击切换表情包
 			html.on("click",".apply_array",function(){
 				liticonLi.removeClass("curr");
 				$(this).addClass("curr");
 				var index = $(this).index();
 				html.find(".getSpot").hide();
 				html.find(".getSpot").eq(index).show();
 			})
			this.addView("label", "选择图标样式", html);
			$(".hotspot-label-model .content .listIcon").mCustomScrollbar();
			//底部表情包切换
			botscroll();
		},
		initEdit: function(){
			var self = this;
			var data = eval("(" + this.hotspot.data + ")");
			var html = $(template(addpicture,{}));
			var scenes = krpanoPluginJs.getScene();
			var title = html.find(".addHot-title-title");
			var content = html.find(".textarea-content");
			var picture = html.find(".hotfileList");
			var address = html.find(".addHot-title-address");
			if(data){
				title.val(data.title);
				content.html(data.content);
				address.val(data.url);
				if(data.pic){
					var ceshi='<%for(var i = 0; i < data.pic.length; i++){%><div class="showImg"><img src="../p/hotspot/default/images/delet.png" class="deleteHimg"><img src="<%=data.pic[i]%>" class="setImgwh"></div><%}%>';		
					var elements =$(template(ceshi,data));
					picture.append(elements);
					
				}
			}
			var view = this.addView("edit", "添加热点", html);
			$(".up-hotpicture .upallpic").mCustomScrollbar();
			html.on("click",".bottom-btn li.com",function(){
				var index = $(this).index();
				if(index==1) {
					$(".up-hotpicture").show();	
					$(this).addClass("curr");
					$(this).siblings().removeClass("curr");				
				} else {
					$(".up-hotpicture").hide();
					$(this).addClass("curr");
					$(this).siblings().removeClass("curr");	
				}
			})
			//添加热点图文热点里上传图片
			upLoadImg(html.find(".aloneupfile"));			
			//删除这个图片
			html.on("click",".deleteHimg",function(){
				$(this).parent().remove();
			})
			//添加图文热点
			var data = krpanoPluginJs.updateHotspot(self.hotspot.name);				
			if(!data.success){
				msg(data.errMsg);
				return;
			}
			html.find(".addSave").click(function(){
				var types = html.find(".bottom-btn ul li.curr").attr("type");
				var content = html.find(".textarea-content").val();
				var title = html.find(".addHot-title-title").val();
				var address = html.find(".addHot-title-address").val();
				var thumbL = html.find(".hotfileList .showImg").length;
				var list = [];
				html.find(".showImg").each(function(){
					var datas=$(this).attr("data");
					list.push(datas);

				})
				if(types==4){
					if(content==""||title==""){
						msg("请填写完整信息",function(){
							html.find(".textarea-content").focus();
						});
					} else if(address!=""){
						proxy.addHotspot({							
							title: title,
							hotspotId: self.hotspot.id,
							content: content,
							type: types,
							linkUrl: address,
							isLinkUse: 0
						}, function(data){
							if(!data.success) {
								msg(data.errMsg);
								return;
							} else {
								msg("添加成功");
							}
							
							var hotspot = $(_this).parents(".hotspot-i").data("hotspot");
							
							hotspot.model.close();
						})
					} else{
						proxy.addHotspot({							
							title: title,
							hotspotId: self.hotspot.id,
							content: content,
							type: types,
							isLinkUse: 1
						}, function(data){
							if(!data.success) {
								msg(data.errMsg);
								return;
							} else {
								msg("添加成功");
							}
							
							var hotspot = $(_this).parents(".hotspot-i").data("hotspot");
							
							hotspot.model.close();
						})
					}
				} else if(types == 1) {
					if(thumbL == 0||title==""){
						msg("请填写完整信息");
					} else if(address!="") {
						proxy.addHotspot({
							title: title,
							hotspotId: self.hotspot.id,
							content: content,
							type: types,
							pics: list,
							linkUrl: address,
							isLinkUse: 0
						},function(data){
							if(!data.success){
								msg(data.errMsg);
								return;
							} else{
								msg("添加成功");
							}
							var hotspot = $(_this).parents(".hotspot-i").data("hotspot");
							
							hotspot.model.close();
						})
					} else {
						proxy.addHotspot({
							title: title,
							hotspotId: self.hotspot.id,
							content: content,
							type: types,
							pics: list,
							isLinkUse: 1
						},function(data){
							if(!data.success){
								msg(data.errMsg);
								return;
							} else{
								msg("添加成功");
							}
							var hotspot = $(_this).parents(".hotspot-i").data("hotspot");
							
							hotspot.model.close();
						})
					}
				} else {

				}
				
			});
			
		},
		initeditView: function(){
			var self = this;
			var data = eval("(" + this.hotspot.data + ")");
			var html = $(template(hotView,{}));
			var scenes = krpanoPluginJs.getScene();
			var title = html.find(".hotTitle");
			var content = html.find(".hotContent");
			var picture = html.find(".hotPictureShow");
			var detail = html.find(".hotspot-view-detail");
			if(data){
				title.html(data.title);
				content.html(data.content);
				if(data.url){
					detail.attr("href",data.url);
					html.find(".hotspot-view-detailAll").show();
				} else {
					html.find(".hotspot-view-detailAll").hide();
				}
				if(data.pic){
					var ceshi ='<%for(var i = 0; i < data.pic.length; i++){%><img src="<%=data.pic[i]%>" class="setImgwh"><%}%><span class="picSum"><%=data.pic.length%>张</span>';	

					var element = $(template(ceshi,data));

					picture.append(element);
					var pictureShow = html.find(".hotPictureShow");
					
				}
				html.on("click",".hotspot-view-icon-show",function(){
					if($(this).parents(".hotspot-view").hasClass("hotspot-view-Width")){
						$(this).parents(".hotspot-view").removeClass("hotspot-view-Width").addClass("hotspot-view-yWidth");
						$(this).parents(".model").css("width","262px");
					} else {
						$(this).parents(".hotspot-view").removeClass("hotspot-view-yWidth").addClass("hotspot-view-Width");
						$(this).parents(".model").css("width","155px");
					}
				})
			}
			var view = this.addViewHot("viewEdit", html);
			layer.photos({
				skin: 'layerShow',
				closeBtn: 2,
				move: false,
				moveOut: false,
				area:['860px','560px'],
		        photos: pictureShow
		    });
		},
		initDelete: function(){
			var self = this;
			var html = $("<p>确定删除此连接器?</p><div><button type='button' class='cancel'>取消</button><button type='button' class='sure confirm'>确定</button></div>");
			var deleteView = this.addView("delete", "提示信息", html);
			
			deleteView.modelElement.on("confirm", function(){
				krpanoPluginJs.removeHotspot(self.hotspot.name);
			});
		}
	}

	return X;
});