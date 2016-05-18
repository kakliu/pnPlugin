var scene='<div style="display:none">\
	<div class="scene-all">\
		<%for(var i = 0; i < data.length; i++) {%>\
			<ul class="scene-list">\
				<%for(var j = 0; j< data[i].list.length; j++) {%>\
			    	<li class="scen-list" data-name="<%=data[i].list[j].name%>">\
						<img src="<%=data[i].list[j].thumburl%>" class="scenhot">\
						<p class="secname"><%=data[i].list[j].title%></p>\
					</li>\
				<%}%>\
			</ul>\
		<%}%>\
	</div>\
	<div class="tabshow">\
		<a href="javascript:void(0)" class="udbtn uPrev"><img src="../v2.0/store/images/up.png" class="pre"></a>\
		<div class="tabTagBox">\
			<ul class="group tabTagList">\
				<%for(var i = 0; i < data.length; i++) {%>\
			    	<li class="group-list"><%=data[i].name%></li>\
			    <%}%>\
			</ul>\
		</div>\
		<a href="javascript:void(0);" class="udbtn dNext"><img src="../v2.0/store/images/down.png" class="next"></a>\
	</div>\
	<i class="btnPush"></i>\
	<script type="text/javascript" src="../v2.0/store/depend/lazyload.js"></script>\
	<script type="text/javascript" src="../v2.0/store/depend/juheweb.js"></script>\
</div>';