"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery','iscroll'], factory);
    } else {
        factory(jQuery);
    }
}(function ($,IScroll) {

	// plugin definition    
	$.fn.mbPhotos = function(options) {    
		var defaults = {
			className: 'div',
	    	title: 'title',    
	   		disc: 'disc',
	   		photos:[]
	  	};    

		var op = $.extend(defaults, options);   

		$('.'+className).remove();
		var myScroll;
		var imgLen = op.photos.length;
		var title = op.title;
		var disc = op.disc;
		var pics = op.photos;
		var className = op.className;
		var liWidth = $(window).width();

		var photos = function(){
			var  photosHtml = '<div id="photowrapper"><ul id="scroller">';
			var tabHtml = '<dl id="indicator"><div id="dotty"></div>';
			for(var i=0;i<imgLen;i++){
				photosHtml += '<li><img src="'+pics[i]+'"></li>';
			}		
			return photosHtml + "</ul></div>" + tabHtml + "</dl>";
		}()




		var html = '<div id="'+className+'" class="'+className+'"><i class="close"></i><header>'+title+'<p class="dot">3/6</p></header><footer>'+disc+'</footer>'+photos+'</div>';
		$('body').append(html);
		$('.'+className).find("ul").width(liWidth * imgLen);
		$('.'+className).find("li").width(liWidth);
		$(".dot").text( "1/" + imgLen);

		$('.'+className).on('click','.close',function(){
			$('.'+className).remove();
			myScroll.destroy();
			myScroll = null;
		})

		myScroll = new IScroll('#photowrapper', {
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			snapSpeed: 400,
			keyBindings: true,
			indicators: {
				el: document.getElementById('indicator'),
				resize: false
			}
		}); 

		myScroll.on('scrollEnd', function () {
			var page = myScroll.currentPage.pageX + 1;
		    $(".dot").text(page + "/" + imgLen);
		});


	}; 





}));
