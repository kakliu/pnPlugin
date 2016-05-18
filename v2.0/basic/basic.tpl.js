var basic='<div class="content-content" id="perInfor" data-id="<%=data.id%>">\
	<div class="group-rights">\
	<h3 class="basic">基本信息</h3>\
	<div class="basci-info">\
		<div class="project-cover wc-top">\
			<span class=" project-cover-name">方案封面：</span>\
			<div id="fileList"><img src="<%=data.thumb%>" id="upimg"></div>\
			<input type="file" id="fileElem" name="file" accept="image/*"  />\
			<p class="upload-warm">图片尺寸为500*500像素，大小不超过1M</p>\
		</div>\
		<div class="project-name wc-top"><span class="project-name-name">方案名称：</span><input type="text" class="common-iput project-name-ipt" value="<%=data.name%>" maxlength="12"></div>\
		<div class="project-style wc-top">\
			<span class=" project-cover-name">类别：</span>\
			<div class="select_box">\
				<div class="selecton" id="belonid" datanum="" ischeck=""></div>\
				<ul class="select_list">\
					<%for(var i = 0; i <data.belongList.length; i++) {%>\
						<li datanum="<%=data.belongList[i].id%>" ischeck="<%=data.belongList[i].isCheck%>"><%=data.belongList[i].name%></li>\
					<%}%>\
				</ul>\
				<div class="select_b" id="dytip"></div>\
			</div>\
		</div>\
		<div class="project-remark wc-top"><span class="project-remark-name">备注：</span><textarea class="common-iput project-name-textarea"><%=data.content%></textarea></div>\
	</div>\
	<h3 class="share">分享设置</h3>\
	<div class="share-set">\
		<div class="share-static wc-top">\
			<span class="share-static-name">案例状态：</span><label class="publish-sf"><input type="radio" name="publish" class="fb" checked status="1">发布</label><label class="publish-sf"><input type="radio" name="publish" class="no-fb" status="0">不发布</label>\
		</div>\
		<div class="share-link wc-top">\
			<span class="share-link-name">项目链接：</span><input type="text" class="common-iput" id="copy-ipt" value="" readonly><a href="javascript:void(0)" class="copycommon copy" id="copy_input">复制</a>\
		</div>\
		<div class="share-ewei wc-top">\
			<span class="share-descri">分享二维码:</span>\
			<div id="qrcodeTable" class="erwei"><img src="<%=data.ewe%>"></div>\
		</div>\
		<div style="clear:both;"></div>\
	</div>\
	<button type="button" class="save">保存</button>\
	</div>\
	<div class="backtops"></div>\
</div>';
//<p class="copycommon creat">生成二维码</p>
// <button class="copycommon copy" id="copy_input">复制</button>