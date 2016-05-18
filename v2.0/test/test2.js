define(['jquery','test/test.tpl', 'template'], function($, tpl, template){
	alert(template);
	$("<div/>").appendTo("body").append(tpl);
});