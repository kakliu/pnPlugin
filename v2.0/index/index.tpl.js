var index='<div class="first-upload">\
	<img src="//code.panocooker.com/v2.0/images/creat.png">\
</div>\
<ul class="list" id="itemContainer">\
	<%for(var i = 0; i <data.length; i++) {%>\
		<%if(data[i].status=="0"){%>\
			<li data="<%=data%>" data-id="<%=data[i].id%>">\
				<div class="list-img-bottom">\
					<img src="<%=data[i].thumb%>" class="list-img">\
					<div class="botom-bg"></div>\
					<div class="bottom-icon">\
						<a href="/basic?id=<%=data[i].id%>" target="_black" class="botm-common write"><i class="bj composi"></i>编辑</a>\
						<a href="/pano/worksView?id=<%=data[i].id%>" target="_black" class="botm-common view"><i class="yl composi"></i>预览</a>\
						<p class="botm-common undercarriage" data-id="<%=data[i].id%>" status="<%=data[i].status%>">发布</p>\
					</div>\
				</div>\
				<p class="list-name"><%=data[i].name%></p>\
				<input type="checkbox" class="choose-this">\
				<p class="fbcommon no-fb">未发布</p>\
			</li>\
		<%}else{%>\
			<li data="<%=data%>" data-id="<%=data[i].id%>">\
				<div class="list-img-bottom">\
					<img src="<%=data[i].thumb%>" class="list-img">\
					<div class="botom-bg"></div>\
					<div class="bottom-icon">\
						<a href="/basic?id=<%=data[i].id%>" target="_black" class="botm-common write"><i class="bj composi"></i>编辑</a>\
						<a href="/pano/worksView?id=<%=data[i].id%>" target="_black" class="botm-common view"><i class="yl composi"></i>预览</a>\
						<p class="botm-common undercarriage" data-id="<%=data[i].id%>" status="<%=data[i].status%>">取消发布</p>\
					</div>\
				</div>\
				<p class="list-name"><%=data[i].name%></p>\
				<input type="checkbox" class="choose-this">\
				<p class="fbcommon fb">已发布</p>\
			</li>\
		<%}%>\
	<%}%>\
</ul>\
<div style="clear:both;"></div>\
<div class="pageDiv"></div>';
