var subgroup='<div class="group-left" id="group">\
	<div class="group-left-rights">\
		<div class="group-left-right-map">\
			<div class="already-buy">\
				<div class="title">\
					<span></span>\
					<label>已购买组件</label>\
					<span></span>\
				</div>\
				<div class="item itemay">\
					<%for(var i = 0; i <data.length; i++) {%>\
						<div class="item-li">\
							<div class="icon">\
								<img src="<%=data[i].thumb%>" alt="" title="" />\
								<label><%=data[i].name%></label>\
							</div>\
							<div class="describe">\
								<%=data[i].description%>\
							</div>\
							<div class="switch">\
								<input name="" value="" class="lcs_check" autocomplete="off" type="checkbox" <%if(data[i].isShow == 0){%> checked <%}%> />\
							</div>\
						</div>\
					<%}%>\
				</div>\
			</div>\
			<div class="group-bottom-list"></div>\
		</div>\
	</div>\
</div>';

var subgroupall='<div class="all-sub">\
				<div class="title">\
					<span></span>\
					<label>所有组件</label>\
					<span></span>\
				</div>\
				<div class="item" id="itemContainer">\
					<%for(var i = 0; i <data.length; i++) {%>\
						<div class="item-all">\
							<div class="icon">\
								<img src="<%=data[i].thumb%>" alt="" title="" />\
								<label><%=data[i].name%></label>\
							</div>\
							<div class="describe">\
								<%=data[i].description%>\
							</div>\
							<div class="switch">\
								<div class="order">订购</div>\
							</div>\
						</div>\
					<%}%>\
				</div>\
			</div>\
			<div class="pageDiv"></div>\
			<div class="backtop"></div>';