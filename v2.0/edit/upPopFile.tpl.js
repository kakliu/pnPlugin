var upFilePop='<div class="layer-contianer" id="upFilePop">\
    <div class="layer-content">\
	    <span>选择分组</span>\
	    <div class="fa-select">\
	    	<%if(data.groupList && data.groupList[0]){%>\
	    		<p class="choosed-name" data-id="<%=data.groupList[0].id%>"><%=data.groupList[0].name%></p>\
	    	<%} else {%>\
	    		<p class="choosed-name" data-id=""></p>\
	    	<%}%>\
		    <div class="chosed-zK">\
			    <div class="chosed-noAll">\
				    <ul class="choose-zuNa">\
					   <%for(var i in data.groupList) {%>\
							<li data-id="<%=data.groupList[i].id%>"><%=data.groupList[i].name%></li>\
						<%}%>\
				    </ul>\
			    </div>\
			    <div class="new-zuAll">\
					<input type="text" placeholder="新建分组" class="new-zuName"/>\
					<img src="v2.0/images/addzuimg.png" class="addZu-img"/>\
			    </div>\
		    </div>\
	    </div>\
    </div>\
    <form action="/" class="dropzone" enctype="multipart/form-data" id="myDropzone" method="post"><div class="aginAddpic"></div></form>\
	<div>\
		<button type="submit" id="submit-all" disabled="disabled" class="up-file">上传全景图</button>\
		<button type="submit" id="cancel-all" class="cancel-file">取消上传</button>\
	</div>\
</div>\
<script type="text/javascript" src="//code.panocooker.com/v2.0/index/upimg.js"></script>';