define([
    'jquery',
    'template',
    'proxy',
    'switch',
    'pages'
],function($,template,proxy){
	var self;
	function X(){
		self = this;
		this.init();
	}

	var fn = X.prototype;

	//订购
	fn._orderGroup = function(){
		var plugin = $(this).parents(".item-all").data();
		$(this).parents(".item-all").remove();

		proxy.pluginrelAdd({
        	panoId: panoId,
  			pluginId: plugin.id,
  			type: 2
        },function(data) {
        	if(data.success){
        		var addOrder = "<div class='item-li'><div class='icon'><img src='<%=thumb%>' alt='' title='' /><label><%=name%></label></div><div class='describe'><%=description%></div><div class='switch'><input name='' value='' class='lcs_check' autocomplete='off' type='checkbox' <%if(isShow == 1){%> checked <%}%> /></div></div>";
        		var element = $(template(addOrder, plugin)).data(plugin);
        		$(".itemay").append(element);
        		msg("订购成功");
        		self._initGroupEvent(element);
        	} else {
        		msg(data.errmsg);
        	}
        });
	}

	fn._initGroupEvent = function(itemay){
		//按钮开关
		itemay.find(".item-li").each(function(i){
			$(this).data(data.data[i]);
		});

		itemay.find(".lcs_check").lc_switch();

		itemay.find(".lcs_check").on("lcs-off", function(){
			var plugin = $(this).parents(".item-li").data();

			self.isShow(plugin.id, 1);
			return false;
		})

		itemay.find(".lcs_check").on("lcs-on", function(){
			var plugin = $(this).parents(".item-li").data();

			self.isShow(plugin.id, 0);
			return false;
		})
	}

	fn.init = function(){
		proxy.getPluginByPanoId({
				panoId:panoId
			},function(data){
	        	if(data!=""){ 
	        		var element=$(template(subgroup,data));
					$(".content").append(element);

					var wheight = $(window).height();
					var height = wheight-70;
					$(".group-left").height(height);
					//按钮开关
					element.find(".already-buy .item .item-li").each(function(i){
						$(this).data(data.data[i]);
					});

					element.find(".item-li .lcs_check").lc_switch();

					element.find(".item-li .lcs_check").on("lcs-off", function(){
						var plugin = $(this).parents(".item-li").data();
						self.isShow(plugin.id, 1);
					})

					element.find(".item-li .lcs_check").on("lcs-on", function(){
						var plugin = $(this).parents(".item-li").data();
						self.isShow(plugin.id, 0);
					})

					self.initPluginNotOrder(1);
	        	}
	        });
	}

	fn.initPluginNotOrder = function(pageIndex) {
	    proxy.getPluginNotOrder({
	        panoId: panoId,
	        pageIndex: pageIndex
	    }, function(data) {
	        if (data != "") {
	            var element = $(template(subgroupall, data));
	            $(".group-bottom-list").empty();
	            $(".group-bottom-list").append(element);

	            //resizeH
	            function resizeH() {
	                var scrollH = $('body').height() - 70;
	                $(".group-left").css("height", scrollH);
	            }
	            resizeH();
	            $(window).resize(function() {
	                resizeH();
	            });

	            element.find(".item .item-all").each(function(i) {
	                $(this).data(data.data[i]);
	            });

	            element.find(".switch .order").click(self._orderGroup);

	            self._page(data);

	            self.backtop();
	        }
	    })
	}


	//分页
	fn._page = function(data){
			$(".pageDiv").createPage({
			        pageCount:data.totalPage,//总页数
			        current:data.currentPage,//当前页
			        turndown:'false',//是否显示跳转框，显示为true，不现实为false
			        backFn:function(current){
			            self.initPluginNotOrder(current);
						//返回列表顶部
			 			var backlistH = ($(".already-buy").height() + 80);
			 			$(".group-left").stop().animate({ "scrollTop": backlistH }, 300);
			        }
   			});
    }

    //返回顶部
	fn.backtop = function(){
		$(".top-right li").eq(0).click(function(){
			$(".backtop").hide();
		})
		$(".top-right li").eq(2).click(function(){
			$(".backtop").hide();
		})
		$(".top-right li").eq(1).click(function(){
			$(".backtop").show();
		})
		var s  =$(".top-right li").eq(1).attr("class");
		if( s == "curr"){
			$(".backtop").show();
		}
		var speed = 300; 
		$(".backtop").click(function () {
			var scrolltop = $('.group-left-right-map').offset().top;
			$(".group-left").stop().animate({ "scrollTop": 0 }, speed);
		});
	}

	fn.isShow = function(pluginId, flag){
		proxy.pluginIsShow({
			panoId: panoId,
			pluginId: pluginId,
			isShow: flag
		}, function(data){
			if(!data.success){
				msg(data.errMsg);
			}
		})
	}

	return X;
})