define([
	'jquery',
	'template',
	'proxy',
	'/v2.0/common/left/left.tpl.js',
	"css!common/head/common.css"
], function($, template, proxy) {

	var element = $(template(bodyLeft, {}));
	$(".body_left").append(element);
	
	/*右边自适应*/
	function selfWH(){
		var wwidth = $(window).width();
		var wheight = $(window).height();
		var rheight = wheight - 70;
		var rwidth = wwidth - 250;
		var rb = wheight - 150;
		$(".body_right").width(rwidth);
		$(".body_right").css("minHeight",rheight);
		$(".brbox").css("minHeight",rb);
	}	
	selfWH();
	$(window).resize(function() {
		selfWH();
	})
});