var roamingmap='<div class="model-roamingmap moqita">\
	<div class="title"></div>\
	<div class="content">\
		<div class="content-left">\
			<textarea class="logger" style="color: #fff;"/>\
			<div class="buttons">\
				<div class="scen-qhbtn">\
					<button type="button" class="change-rot">场景切换</button>\
					<ul class="chosed-scence">\
					</ul>\
				</div>\
				<button type="button" class="delete-rot">删除热点</button>\
				<button type="button" class="aad-rot">添加热点</button>\
			</div>\
			<div class="fileList"><img src=""/></div>\
		</div>\
		<div class="content-right">\
			<div class="up-title">\
				<button type="button" class="upmap">上传地图</button>\
				<input type="file" class="upmap addfile"  id="fileRoam" multiple accept="image/*" name="fileRoam" onchange="handleFileroam(this)">\
				<button type="button" class="aad-rot">添加热点</button>\
			</div>\
			<div class="set-map">\
				<div class="link-sence">\
				</div>\
				<div class="coordinatex">\
					<span class="coordinatex-desc">X</span>\
					<input type="text" class="x-coordinatex" value="0" readonly>\
				</div>\
				<div class="coordinatey">\
					<span class="coordinatex-desc">Y</span>\
					<input type="text" class="y-coordinatex" value="0" readonly>\
				</div>\
				<div class="radar">\
					<span class="radar-view">雷达角度</span>\
					<input type="text" class="radar-num" value="0" readonly>\
				</div>\
				<div class="hotspot">\
					<button type="button" class="save-hotspot">保存热点</button>\
	            	<button type="button" class="delet-hotspot">删除热点</button>\
				</div>\
			</div>\
			<div class="delet"><button type="button" class="delet-map">删除地图</button></div>\
		</div>\
	</div>\
</div>';