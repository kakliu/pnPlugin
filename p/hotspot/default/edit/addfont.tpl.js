var addfont='<div class="hotspot-edit-common hotspot-edit-link">\
	<div class="model">\
		<div class="title">选择图标样式</div>\
		<div class="close"></div>\
		<div class="contents">\
			<div class="content">\
				<div class="listIcon"></div>\
				<div class="apply">\
					<div class="img_l"><img src="/p/hotspot/default/images/left.png" /></div>\
					<div class="apply_nav">\
						<ul class="apply_w">\
							<%for(var i = 0; i <list.length; i++) {%>\
								<li class="apply_array">\
									<img src="<%=list[i].thumb%>" />\
								</li>\
							<%}%>\
						</ul>\
					</div>\
					<div class="img_r"><img src="/p/hotspot/default/images/right.png" /></div>\
				</div>\
			<div>\
		</div>\
	</div>\
</div>';
	