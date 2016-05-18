window.URL = window.URL || window.webkitURL;
function handleFiles(obj) {
	var files = obj.files, img = new Image();

	var fileElem = document.getElementById("fileElem"), 
		upimg = document.getElementById("upimg");

	if(!files[0]){
		return;
	}
	
	if (files[0] && files[0].size / 1024 / 1024 > 1) {
		msg("图片超过1M请重新上传");
		return;
	}
	
	if (window.URL) {
		img.src = window.URL.createObjectURL(files[0]); // 创建一个object
														// URL，并不是你的本地路径
		img.width = 200;

		img.onload = function(e) {
			onload();
			window.URL.revokeObjectURL(this.src); // 图片加载后，释放object URL
		}
	} else if (window.FileReader) {
		// opera不支持createObjectURL/revokeObjectURL方法。我们用FileReader对象来处理
		var reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = function(e) {
			onload();
		}
	} else {
		// ie
		obj.select();
		obj.blur();
		var nfile = document.selection.createRange().text;
		document.selection.empty();
		img.src = nfile;
		img.width = 200;
		img.onload = function() {
			onload();
		}
	}
	
	function onload(){
		upimg.setAttribute("src", img.src);
	}
}