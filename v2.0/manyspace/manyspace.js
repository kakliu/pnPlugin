define([
	'jquery',
	'template',
	'proxy',
	'login',
	'pages',
	'layer',
	'qrcode',
	'/v2.0/manyspace/manyspace.tpl.js',
	"css!manyspace/manyspace.css",
	"css!modul/skin/layer.css",
], function($, template, proxy, login) {
	//单空间数组
	var idarray = [];
	//初始化加载
	loadkhlist(1);
	function loadkhlist(current) {
		login.login(function(loginInfo) {
			var element = $(template(personInfo, login.info));
			$(".usercenter").append(element);
			dlist(current,"");
		})
	}
	
	/*单空间列表ajax*/
	function dlist(current,search) {
		var element = $(template(searchipt,{}));
		$(".mright").empty();
		$(".mright").append(element);
		if(search != ""){
			var searchname = search;
		}

		proxy.getPanoList({
			type: 1,
			pageSize: 12,
			pageIndex: current,
			searchName: searchname
		}, function(data){
			if (data.success) {
				var element = $(template(mslist, data));
				$(".mslist").empty();
				$(".mslist").append(element);
				mouseState();
				singleSpace();
				reviseName();
				keyhc();
				page(data);
				cjSearch();
				spselect();
			} else {
				layer.msg(data.errMsg);
			}
		});
	}
	//单空间选中
	function spselect(){
		var l = idarray.length;
		if (l >= 2) {
			$(".createbtn").addClass("curbtn").attr("disabled", false);
			createbtn();
		} else {
			$(".createbtn").removeClass("curbtn").attr("disabled", true);
		}
		for (var i = 0; i < idarray.length; i++) {
			var s  = idarray[i];
			$(".mslist li img").each(function(){
				var f = $(this).attr("dataid");
				if( f == s){
					$(this).next(".ipt_ck").addClass("ipt_cked");
				}
			})
		}
	}
	
	//鼠标移入移出
	function mouseState(){
		$(".mslist li").mouseover(function(){
			$(this).find(".xg_btn").show();
		})
		$(".mslist li").mouseout(function(){
			$(this).find(".xg_btn").hide();
		})
	}

	//选中单空间,显示生成按钮
	function singleSpace(){
		$(".mslist li img").click(function(){
			$(this).next(".ipt_ck").toggleClass("ipt_cked");
			var ida = $(this).attr("dataid");
			function mm(a){
			   return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+a.join("\x0f\x0f") +"\x0f");
			}
			idarray.push(ida);	
			var tf = mm(idarray);
			if( tf == true){
				idarray.splice(jQuery.inArray(ida,idarray),1); 
				idarray.splice(jQuery.inArray(ida,idarray),1); 
			}
			var lt = idarray.length;
			if (lt >= 2) {
				$(".createbtn").addClass("curbtn").attr("disabled", false);
				createbtn();
			} else {
				$(".createbtn").removeClass("curbtn").attr("disabled", true);
			}
		});
		$(".ipt_ck").click(function(){
			$(this).toggleClass("ipt_cked");
			var ida = $(this).prev("img").attr("dataid");
			function mm(a){
			   return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+a.join("\x0f\x0f") +"\x0f");
			}
			idarray.push(ida);	
			var tf = mm(idarray);
			if( tf == true){
				idarray.splice(jQuery.inArray(ida,idarray),1); 
				idarray.splice(jQuery.inArray(ida,idarray),1); 
			}
			var lt = idarray.length;
			if (lt >= 2) {
				$(".createbtn").addClass("curbtn").attr("disabled", false);
				createbtn();
			} else {
				$(".createbtn").removeClass("curbtn").attr("disabled", true);
			}
		});
	}
	
	//修改单空间名称
	function reviseName(){
		$(".mslist li .xg_btn").click(function(){
			var name = $(this).parents("li").find("p").html();
			$(this).parents("li").find("p").hide();
			$(this).parents("li").find(".singlename").val(name).css("display","block").focus();
			$(this).hide();
			$(this).parents("li").find(".save_btn").show();
		})
		$(".mslist li .save_btn").click(function(){
			var savename = $(this).parents("li").find(".singlename").val();
			var id = $(this).parents("li").find("img").attr("dataid");
			$(this).parents("li").find(".singlename").hide();
			$(this).parents("li").find("p").show().html(savename);
			$(this).hide();
			$(this).parents("li").find(".xg_btn").show();
			xgName(id,savename);
		})
	}
	
	//回车键保存单空间名称
	function keyhc(){
		$(".mslist li .singlename").keypress(function(e) { 
	       if(e.which == 13) { 
	   			var savename = $(this).parents("li").find(".singlename").val();
	   			var id = $(this).parents("li").find("img").attr("dataid");
				$(this).hide();
				$(this).parents("li").find("p").show().html(savename);
				$(this).parents("li").find(".save_btn").hide();
				$(this).parents("li").find(".xg_btn").show();
				xgName(id,savename);
	       } 
	   	});		
	}
	
	//修改名称ajax
	function xgName(id,savename){
		proxy.panoUpdate({
			id: id,
			name: savename
		}, function(data){
			if (data.success) {
				layer.msg("修改成功");
			} else {
				layer.msg(data.errMsg);
			}
		});
	}
	
	//分页
	function page(data){
		$(".pageDiv").createPage({
			pageCount: data.totalPage, //总页数
			current: data.currentPage, //当前页
			turndown: 'false', //是否显示跳转框，显示为true，不现实为false
			backFn: function(current) {
				loadkhlist(current);
			}
		});
    }

	//搜索按钮
	function cjSearch(){
		$("#cj_search").click(function() {
			ajSearch();
		})
		$(".ipt_search").keypress(function(e) { 
	    	// 回车键事件 
	       if(e.which == 13) { 
	   			ajSearch();
	       } 
	   }); 
	}

	//场景搜索
	function ajSearch(){
		var search = $(".ipt_search").val();
		dlist(1,search);
	}

	//生成
	function createbtn(){
		$(".createbtn").unbind('click').click(function(){
			var lt = idarray.length;
			if (lt >= 2) {
				$(".bgbox").show();
				$(".createbox").show();
				$(".bgbox").animate({
					opacity: 1
				}, 200);
				$(".createbox").animate({
					opacity: 1
				}, 200, function() {
					proxy.panoUploadByPanoId({
						ids: idarray,
						name: "场景大师多空间全景图生成器",
						status: "1"
					}, function(data){
						if (data.success) {
							$(".createbox").animate({
								opacity: 0
							}, 200, function() {
								$("#ercode").empty();
								jQuery('#ercode').qrcode({
									width: 200,
									height: 200,
									text: window.location.origin + "/pano/worksView?id=" + data.id
								});
								$(".createbox").hide();
								$(".sweepbox").show();
								$(".sweepbox").animate({
									opacity: 1
								}, 200);
								$(".editpano").click(function() {
									var ts = getQueryString("TS");
									var ui = getQueryString("UI");
									var at = getQueryString("access_token");
									window.open("/basicNew?id=" + data.id + "&TS=" + ts + "&UI=" + ui + "&access_token=" + at);
								})
								$(".seepano").click(function() {
									window.open("/pano/worksView?id=" + data.id);
								})
							});
						} else {
							layer.msg(data.errMsg);
						}
					});
				});
			}
		})
		$(".btnback").click(function(){
			$(".bgbox").animate({ opacity: 0 }, 200 ,function(){$(".bgbox").hide();});
			$(".createbox").animate({ opacity: 0 }, 200 ,function(){$(".createbox").hide();});
		})
		
		$(".sbclocse").click(function(){
			$(".bgbox").animate({ opacity: 0 }, 200 ,function(){$(".bgbox").hide();});
			$(".sweepbox").animate({ opacity: 0 }, 200 ,function(){$(".sweepbox").hide();});
		})
	}

});