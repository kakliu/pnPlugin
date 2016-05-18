var link_icon = '<div><div class="listIcon"/>\
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
</div>';