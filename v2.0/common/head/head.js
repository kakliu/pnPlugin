define([
	'jquery',
	'template',
	'proxy',
	'/v2.0/common/head/head.tpl.js',
	"css!common/head/common.css"
], function($, template, proxy) {

	var element = $(template(head, {}));
	$(".head").append(element);
	
	$("#head_searchpic").click(function(){
		var search = $(this).prev("input").val();
		window.location.href = "/?search=" + search;
	})
	
	$(".logout a").click(function(){
		var url = window.location.host;
		var ducxurl  = url.indexOf("duc.cn");
		var pcxurl  = url.indexOf("panocooker.com");
		if( ducxurl > -1){
			window.location.href = "http://login.duc.cn/logout?redirectURL=http://ypano.duc.cn";
		}
		else if( pcxurl > -1){
			window.location.href = "http://login.panocooker.com/logout?redirectURL=http://pano.panocooker.com";
		}
		
	})
	
});