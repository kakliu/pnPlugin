define(['jquery','test/test.tpl', 'template', "test/test2"], function($, tpl, template){
	alert(template);
	$("body").append(tpl);
});