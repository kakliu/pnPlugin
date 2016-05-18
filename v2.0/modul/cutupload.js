define([
	'jquery',
	'modul/cropbox'
	],function($){
	var options =
	{
		thumbBox: '.thumbBox',
		spinner: '.spinner',
		imgSrc: ''
	}
	var cropper = $('.imageBox').cropbox(options);
	$("body").on('change','#upload-file', function(){
		var reader = new FileReader();
		reader.onload = function(e) {
			options.imgSrc = e.target.result;
			cropper = $('.imageBox').cropbox(options);
		}
		reader.readAsDataURL(this.files[0]);
		this.files[0] = [];
	})
	$("body").on("click","#btnCrop",function(){
		var curr = this;
		var img = cropper.getDataURL();
		$(curr).addClass("sureCutO");
		//$('.cropped').html('');
		$('.cropped img').attr("src",img);
	})
	$("body").on('click','#btnZoomIn', function(){
		cropper.zoomIn();
	})
	$("body").on('click','#btnZoomOut', function(){
		cropper.zoomOut();
	})
})
//images/avatar.png