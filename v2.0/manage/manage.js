define([
	'jquery',
	'template',
	'proxy',
	'login',
	'layer',
	'countdown',
	'pages',
	'manage/manage.tpl',
	'manage/addaccount.tpl',
	'manage/create.tpl',
	'manage/makeinfo.tpl',
	"css!common/head/common.css",
	"css!modul/skin/layer.css",
	"css!manage/manage.css"
], function($, template, proxy, login) {
	/*初始化加载*/
	$(".body_left ul li").eq(1).addClass("cur");
	loadkhlist();
//	var element = $(template(acadd, {}));
//	$(".ac_add").append(element);
//	
//	var element = $(template(create, {}));
//	$(".ac_create").append(element);
	
	/*加载客户管理列表*/
	function loadkhlist(){
		login.login(function(loginInfo) {
			/*客户管理列表*/
			$.ajax({
				url: "http://bmap.duc.cn/author/getAccountList",
				method: "post",
				dataType: "jsonp",
				data: {
					authorId: loginInfo.id
				},
				success: function(data) {
					if (data.success) {
						$(".manage").empty();
						var element = $(template(khlist, data));
						$(".manage").append(element);
						$(".noadd").hide();
						$(".customerlist").show();
		
						/*修改商家信息*/
						$(".btn_xg").click(function() {
							var shopId = $(this).parents("ul").find(".shopid").html();
							$(".manage").hide();
							$(".makeinfo").show();
							loadMakeinfo(shopId, loginInfo);
						})
						
						/*查看*/
						$(".btn_ck").click(function(){
							var shopUserId = $(this).parents("ul").find(".shopuserid").html();
							seeScene(shopUserId);
						})
						
					} else {
						$(".customerlist").hide();
						$(".noadd").show();
					}
				}
			})
		})
	}
	
	/*加载商家信息*/
	function loadMakeinfo(shopId,loginInfo){
		$.ajax({
			url: "http://bmap.duc.cn/author/shopShow",
			method: "post",
			dataType: "jsonp",
			data: {
				shopId: shopId
			},
			success: function(data) {
				if (data.success) {
					$(".makedetails").empty();
					var element = $(template(makeinfo, data));
					$(".makedetails").append(element);
		
					/*百度地图API功能*/
					baiduMap();
		
					selecton();
					/*重新绑定*/
					$("#againBand").click(function() {
						bandscene(shopId, loginInfo);
					});
					/*去绑定场景*/
					$("#completed").click(function() {
						bandscene(shopId, loginInfo);
					});
					/*取消验收*/
					$("#cancelcheck").click(function() {
							layer.confirm('您确定取消此次验收么？', {
								btn: ['确定', '取消'],
								title: "提示"
							}, function() {
								cancelCheck(shopId,loginInfo);
							});
						})
					/*下线作品*/
					$("#removeband").click(function() {
						removeBand(shopId,loginInfo);
					})
					countdown(shopId,loginInfo);
					
					/*确认修改&关闭*/
					$("#btn_trueinfo").click(function() {
						var shopStatus = $("#selecting").attr("datanum");
						if (shopStatus == "") {
							$(".makedetails").empty();
							$(".manage").show();
							$(".makeinfo").hide();
							loadkhlist();
						} else {
							save(shopStatus, shopId, loginInfo);
						}
					})
		
					/*返回*/
					$("#mi_back").click(function() {
						$(".makedetails").empty();
						$(".manage").show();
						$(".makeinfo").hide();
						loadkhlist();
					})
		
				} else {
					layer.msg(data.errMsg);
				}
			}
		})
	}
	
	/*查看全景*/
	function seeScene(shopUserId){
		window.open("/mobile/?id=" + shopUserId);
	}	
	
	/*地图*/
	function baiduMap(){
		var map = new BMap.Map("allmap");
		var city = $("#mk_address").html();
		map.centerAndZoom(city, 15);
		if (city != "") {
			map.clearOverlays();
			function myFun() {
				//如果搜索的有结果
				if (local.getResults().getPoi(0)) {
					var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
					map.centerAndZoom(pp, 18);
					map.addOverlay(new BMap.Marker(pp)); //添加标注
				}
			}
			var local = new BMap.LocalSearch(map, { //智能搜索
				onSearchComplete: myFun
			});
			local.search(city);
		}
	}

	/*保存商家信息*/
	function save(shopStatus,shopId,loginInfo) {
		layer.confirm('是否保存商家信息的修改？', {
			btn: ['保存', '取消'],
			title: "提示"
		}, function() {
			$.ajax({
				url: "http://bmap.duc.cn/author/updateShop",
				method: "post",
				dataType: "jsonp",
				data: {
					shopId: shopId,
					status: shopStatus,
					authorId: loginInfo.id
				},
				success: function(data) {
					if (data.success) {
						layer.msg('保存成功', {
							icon: 1
						});
						loadMakeinfo(shopId,loginInfo);
					} else {
						layer.msg(data.errMsg);
					}
				}
			})
		});
	}
	
	/*返回*/
	function backsave(shopStatus,shopId,loginInfo) {
		layer.confirm('是否保存商家信息的修改？', {
			btn: ['保存', '取消'],
			title: "提示"
		}, function() {
			$.ajax({
				url: "http://bmap.duc.cn/author/updateShop",
				method: "post",
				dataType: "jsonp",
				data: {
					shopId: shopId,
					status: shopStatus
				},
				success: function(data) {
					if (data.success) {
						layer.msg('保存成功', {
							icon: 1
						});
						setTimeout(function() {
							$(".makedetails").empty();
							$(".manage").show();
							$(".makeinfo").hide();
							loadkhlist();
						}, 1000)
					} else {
						layer.msg(data.errMsg);
					}
				}
			})
		});
	}

	/*切换*/
	$(".ac_top li").click(function(){
		var num = $(this).index();
		$(".ac_top li").removeClass("cur");
		$(this).addClass("cur");
		$(".ac_tab").hide();
		$(".ac_tab").eq(num).show();
	})

	/*添加*/
	$(".info_add").click(function(){
		$(this).parents(".have_li").find(".info_boxadd").slideToggle("300");
	})
	
	/*状态下拉*/
	function selecton(){
		$(".select_list li").each(function(){
			if($(this).attr("ischeck") == "true"){
				var w = $(this).html();
				var d = $(this).attr("datanum")
				$("#selecting").html(w).attr("datanum", d);
			};
		})
		
		$(".selecton").click(function() {
			$(this).next(".select_list").slideToggle("300");
		})
		$(".select_list li").click(function() {
			var text = $(this).html();
			var num = $(this).attr("datanum");
			$(this).parents(".select_box").find("#selecting").html(text).attr("datanum", num);
			$(this).parents(".select_box").find(".select_list").slideToggle("300");
		})
	}
	
	/*倒计时*/
	function countdown(shopId,loginInfo){
		var time = $("#endtime").html();
		if(time != ""){
			$('.countdown').downCount({
				date: time,
				offset: +10
			}, function() {
				loadMakeinfo(shopId,loginInfo);
			});
		}
	}
	
	/*绑定场景*/
	function bandscene(shopId, loginInfo,current) {
		$.ajax({
			url: "/pano/query?type=2&status=1",
			method: "post",
			dataType: "jsonp",
			data: {
				pageSize: 12,
				pageIndex: current
			},
			success: function(data) {
				if (data.success) {
					$(".dialog_bg").show();
					$("#bind_viewlist").empty();
					var element = $(template(dialoglist, data));
					$("#bind_viewlist").append(element);
					cjSearch();
					dbClose();
					applyBtn(shopId, loginInfo);
					check();
					page(data, shopId, loginInfo);
				} else {
	
				}
			}
		})
	}
	
	/*关闭*/
	function dbClose(){
		$("#db_close").click(function(){
			$("#bind_viewlist").empty();
			$(".dialog_bg").hide();
		}) 
	}	
	
	/*场景搜索*/
	function cjSearch(){
		$("#cj_search").click(function() {
			var search = $(this).parents(".search").find(".ipt_search").val();
			if( search == ""){
				$.ajax({
					url: "/pano/query?type=2&status=1",
					method: "post",
					dataType: "json",
					success: function(data) {
						if (data.success) {
							$("#bind_viewlist").empty();
							var element = $(template(dialoglist, data));
							$("#bind_viewlist").append(element);
							check();
						}
					}
				})
			}
			else{
				$.ajax({
					url: "/pano/query?type=2&status=1",
					method: "post",
					dataType: "json",
					data: {
						searchName: search
					},
					success: function(data) {
						if (data.success) {
							$("#bind_viewlist").empty();
							var element = $(template(dialoglist, data));
							$("#bind_viewlist").append(element);
							check();
						} else {
				
						}
					}
				})
			}
		})
	}

	/*申请绑定*/
	function applyBtn(shopId,loginInfo){
		$("#btn_apply").click(function() {
			var panoid = $(".bvname .ipt_checkon").attr("dataid");
			var userid = $(".userid").html();
			$.ajax({
				url: "http://bmap.duc.cn/author/sendMsg",
				method: "post",
				dataType: "jsonp",
				data: {
					shopUserId: userid,
					senderId: loginInfo.id,
					msgType: "1",
					panoId: panoid
				},
				success: function(data) {
					if (data.success) {
						layer.msg('申请已发送，等待商家验收', {
							icon: 1
						});
						setTimeout(function() {
							$(".dialog_bg").hide();
							loadMakeinfo(shopId, loginInfo);
						}, 1000)
					} else {
						layer.msg(data.errMsg);
					}
				}
			})
		})	
	}

	/*选择*/
	function check(){
		$(".bind_viewlist ul li").click(function(){
			$(".bind_viewlist .bvname .ipt_check").removeClass("ipt_checkon");
			$(this).find(".bvname .ipt_check").addClass("ipt_checkon");
		})	
	}
	
	/*分页*/
	function page(data, shopId, loginInfo){
		$(".pageDiv").createPage({
			pageCount: data.totalPage, //总页数
			current: data.currentPage, //当前页
			turndown: 'false', //是否显示跳转框，显示为true，不现实为false
			backFn: function(current) {
				bandscene(shopId, loginInfo, current);
			}
		});
    }
	
	/*取消验收*/
	function cancelCheck(shopId,loginInfo){
		var userid = $(".userid").html();
		$.ajax({
			url: "http://bmap.duc.cn/author/recallMsg",
			method: "post",
			dataType: "jsonp",
			data: {
				shopUserId: userid,
				senderId: loginInfo.id,
			},
			success: function(data) {
				if (data.success) {
					layer.msg('取消成功', {
						icon: 1
					});
					setTimeout(function() {
						loadMakeinfo(shopId,loginInfo);
					}, 1000)
				} else {
					layer.msg(data.errMsg);
				}
			}
		})
	}
	
	/*下线作品*/
	function removeBand(shopId,loginInfo){
		var userid = $(".userid").html();
		layer.confirm('下线作品必须获得商家批准!', {
			btn: ['申请下线', '取消'],
			title: "提示"
		}, function() {
			$.ajax({
				url: "http://bmap.duc.cn/author/sendMsg",
				method: "post",
				dataType: "jsonp",
				data: {
					shopUserId: userid,
					senderId: loginInfo.id,
					msgType: "2"
				},
				success: function(data) {
					if (data.success) {
						layer.msg('已发送给商家申请下线', {
							icon: 1
						});
						setTimeout(function() {
							loadMakeinfo(shopId,loginInfo);
						}, 1000)
			
					} else {
						layer.msg(data.errMsg);
					}
				}
			})
		});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
});