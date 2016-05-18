$(function(){
	$(".menu").click(function(){
		var span = $(this).find("span");
		if(span.hasClass("open")){
			span.removeClass("open").addClass("close");
			$(".btn").removeClass("open").addClass("close");
		}else{
			span.removeClass("close").addClass("open");
			$(".btn").removeClass("close").addClass("open");
		}
	});
});