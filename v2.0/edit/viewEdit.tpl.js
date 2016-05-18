var edit='<div class="content-left" id="qjEdit" data="<%=data%>">\
		<div class="content-left-left">\
			<div class="item editPanoName" data-id="<%=data.id%>">\
				<i class="item-img"></i>\
				<span class="span-input"><%=data.name%></span>\
				<input type="text" class="item-name editCommon" value="<%=data.name%>" maxlength="18">\
				<i class="clibg bj-common editName"></i>\
				<i class="bj-common save-com xm-save two-com"></i>\
			</div>\
			<div class="title">\
				<i class="view-img"></i>全景列表\
			</div>\
			<div class="add">\
				<div class="add-file first-upload"><i></i><p class="add-fileimg">添加全景文件</p></div>\
				<div class="add-zu" data-id="<%=data.id%>"><i></i><p class="add-zuimg">添加组</p></div>\
			</div>\
			<div id="multi" class="menu_list">\
				<div class="layer tile" data-force="30">\
					<%for(var i = 0; i <data.groupList.length; i++) {%>\
						<div class="menu">\
							<h3 class="menu_head" data-id="<%=data.groupList[i].id%>">\
								<i class="zk"></i>\
								<span class="span-input"><%=data.groupList[i].name%></span>\
								<input type="text" value="<%=data.groupList[i].name%>" class="zu-name editCommon" maxlength="18">\
								<i class="delet-btn alone"></i>\
								<i class="bj-common editName clibg"></i>\
								<i class="bj-common zu-save save-com"></i>\
							</h3>\
							<div class="menu_body">\
								<ul class="sucaijiayuan-list">\
									<%for(var j = 0; j <data.groupList[i].sceneList.length; j++) {%>\
										<li data-id="<%=data.groupList[i].sceneList[j].id%>" data-pid="<%=data.groupList[i].sceneList[j].pid%>" data-cutpid="<%=data.groupList[i].sceneList[j].cutPid%>" data-isFinsh="<%=data.groupList[i].sceneList[j].isFinsh%>">\
											<i class="drap"></i>\
											<span class="left-bor"></span>\
											<span class="span-input"><%=data.groupList[i].sceneList[j].name%></span>\
											<input type="text" class="name editCommon" value="<%=data.groupList[i].sceneList[j].name%>" maxlength="18">\
											<i class="delet-btn"></i>\
											<i class="clibg bj-common editName"></i>\
											<i class="bj-common save-com scene-save two-com"></i>\
											<div class="progress progress-striped active fade \
											<%if(data.groupList[i].sceneList[j].isFinsh == 0) {%>\
												in\
											<%}%>\
											"><div class="progress-bar"/></div>\
										</li>\
									<%}%>\
								</ul>\
							</div>\
						</div>\
					<%}%>\
				</div>\
			</div>\
		</div>\
		<div id="clr" class="content-left-right">\
			<div class="pano" id="panoView" style="width:100%;height:100%;position: relative;">\
			</div>\
		</div>\
	</div>';

//<span class="zu-name editCommon"><%=data.groupList[i].name%></span>\
