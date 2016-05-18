define([
	'jquery',
	'template',
	'proxy',
	'login',
	'layer',
	'personinfo/personinfo.tpl',
	'personinfo/unbind.tpl',
	'personinfo/newmobile.tpl',
	'personinfo/changepw.tpl',
	"css!common/head/common.css",
	"css!modul/skin/layer.css",
	"css!personinfo/personinfo.css"
], function($, template, proxy, login) {
	/*初始化加载*/
	$(".body_left ul li").eq(0).addClass("cur");
	login.login(function(loginInfo){
		var element = $(template(personInfo, login.info));
		$(".infor").append(element);
		/*更换手机号*/
		$("#changemobile").click(function() {
			$(".infor").hide();
			$(".unbind").show();
		})
		/*绑定新的手机号*/
		$("#bnewmobile").click(function() {
			$(".infor").hide();
			$(".newmobile").show();
		})
		/*修改密码*/
		$("#revisepsw").click(function() {
			$(".infor").hide();
			$(".changepw").show();
		})
	})

	var element = $(template(unbind, {}));
	$(".unbind").append(element);
	var element = $(template(newmobile, {}));
	$(".newmobile").append(element);
	var element = $(template(changepw, {}));
	$(".changepw").append(element);
	

	/*已绑定手机号验证*/
	$("#ub_mobile").keyup(function(){
		var bindnumber = $("#ub_mobile").val();
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
		if(!myreg.test(bindnumber)){ 
			$("#ub_sendbtn").removeClass("send");
		}
		else{
			$("#ub_sendbtn").addClass("send");
			$(this).parent(".ipt").find(".tip").hide();
		}
	})
	$("#ub_sendbtn").click(function(){
		var bindnumber = $("#ub_mobile").val();
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 

		if(!myreg.test(bindnumber)){ 
			$(this).prev(".ipt").find(".tip").show();
		}
		else{
			$(this).prev(".ipt").find(".tip").hide();
			$(this).addClass("send");
			$.ajax({
				url: "/user/sendCode",
				method: "post",
				dataType: "json",
				data: {
					account: bindnumber
				},
				success: function(data) {
					if (data.success) {
						ubsendMobile();
					} else {
						layer.msg(data.errMsg);
					}
				}
			})
		}
	})
	
	/*下一步*/
	$("#ub_next").click(function() {
		var bindnumber = $("#ub_mobile").val();
		var ubcode = $("#ub_code").val();
		$.ajax({
			url: "/user/unBindMobile",
			method: "post",
			dataType: "json",
			data: {
				account: bindnumber,
				code: ubcode
			},
			success: function(data) {
				if (data.success) {
					$("#ub_code").parent(".ipt").find(".tip").hide();
					$(".unbind").hide();
					$(".newmobile").show();
				} else {
					layer.msg(data.errMsg);
				}
			}
		})
	})
	
	/*重新发送倒计时*/
	function ubsendMobile(){
		var wait = 60;
		var timer;
		var o = $("#ub_sendbtn");
		o.attr("disabled", true);
		o.text("重新发送" + '(' + wait + ')');
		timer = setInterval(function() {
			if (wait) {
				o.attr("disabled", true);
				wait--;
				o.text("重新发送" + '(' + wait + ')');
			} else {
				o.attr('disabled', false);
				o.text("获取验证码");
				wait = 60;
				clearInterval(timer);
			}
		}, 1000);
	}
	
	/*核定绑定取消*/
	$("#ub_cancel").click(function(){
		window.location.reload();
	})
	
	/*输入重置*/
	$(".ipt input").focus(function(){
		$(".empty").hide();
		$(this).next(".empty").show();
	}).blur(function(){
			setTimeout(function () {
                $(this).next(".empty").hide();
            }, 0);
		})
	$(".empty").click(function(){
		$(this).prev(".ipt_text").val("").focus();
	})
	
	/*确认新的手机号*/
	$("#nm_mobile").keyup(function() {
		var bindnumber = $("#nm_mobile").val();
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if (!myreg.test(bindnumber)) {
			$("#nm_sendbtn").removeClass("send");
		} else {
			$("#nm_sendbtn").addClass("send");
			$(this).parent(".ipt").find(".tip").hide();
		}
	})
	$("#nm_sendbtn").click(function() {
		var bindnumber = $("#nm_mobile").val();
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if (!myreg.test(bindnumber)) {
			$(this).prev(".ipt").find(".tip").show();
		} else {
			
			$(this).prev(".ipt").find(".tip").hide();
			$(this).addClass("send");
			$.ajax({
				url: "/user/sendCode",
				method: "post",
				dataType: "json",
				data: {
					account: bindnumber
				},
				success: function(data) {
					if (data.success) {
						nmsendMobile();
					} else {
						layer.msg(data.errMsg);
					}
				}
			})
			
		}
	})
	/*确认新的手机号提交*/
	$("#nm_next").click(function() {
		var bindnumber = $("#nm_mobile").val();
		var ubcode = $("#nm_code").val();
		$.ajax({
			url: "/user/bindMobile",
			method: "post",
			dataType: "json",
			data: {
				account: bindnumber,
				code: ubcode
			},
			success: function(data) {
				if (data.success) {
					$("#nm_code").parent(".ipt").find(".tip").hide();
					layer.msg("绑定成功");
					setTimeout(function() {
						window.location.reload();
					}, 1000)

				} else {
					layer.msg(data.errMsg);
				}
			}
		})
	})
	
	/*重新发送倒计时*/
	function nmsendMobile(){
		var wait = 60;
		var timer;
		var o = $("#nm_sendbtn");
		o.attr("disabled", true);
		o.text("重新发送" + '(' + wait + ')');
		timer = setInterval(function() {
			if (wait) {
				o.attr("disabled", true);
				wait--;
				o.text("重新发送" + '(' + wait + ')');
			} else {
				o.attr('disabled', false);
				o.text("获取验证码");
				wait = 60;
				clearInterval(timer);
			}
		}, 1000);
	}
	
	/*确认新的手机号页面取消*/
	$("#nm_cancel").click(function(){
		window.location.reload();
	})
	
	$("#cp_true").click(function(){
		var oldpwd = $("#cp_iptpsw").val();
		var pswone = $("#cp_iptpsws").val();
		var pswtwo = $("#cp_ipttpsw").val();
		if( oldpwd == ""){
			$("#cp_iptpsw").parent(".ipt").find(".tip").show();
		}
		else{
			$("#cp_iptpsw").parent(".ipt").find(".tip").hide();
		}
		
		if( pswone == pswtwo && pswone !="" && pswtwo !=""){
			$("#cp_ipttpsw").parent(".ipt").find(".tip").hide();
			$.ajax({
				url: "/user/updatePwd",
				method: "post",
				dataType: "json",
				data: {
					oldPwd: oldpwd,
					newPwd1: pswone,
					newPwd2: pswtwo
				},
				success: function(data) {
					if (data.success) {
						layer.msg("修改成功");
						setTimeout(function(){
							$(".changepw").hide();
							$(".infor").show();
						},1000)
					} else {
						layer.msg(data.errMsg);
					}
				}
			})
		}else{
			$("#cp_ipttpsw").parent(".ipt").find(".tip").show();
		}
	})
	
	/*确认新的手机号页面取消*/
	$("#cp_cancel").click(function(){
		window.location.reload();
	})
	
	
	
	
	
	
	
	
	
	
	
});