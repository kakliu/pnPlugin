var mslist = '<ul>\
					<%for(var i = 0; i <data.length; i++) {%>\
						<li>\
							<img src="<%=data[i].thumb%>" dataid="<%=data[i].id%>" name="<%=data[i].name%>" alt="" title=""/>\
							<div class="ipt_ck"></div>\
							<p><%=data[i].name%></p>\
							<input type="text" value="" class="singlename" />\
							<div class="xg_btn" title="修改名称"></div>\
							<div class="save_btn" title="保存"></div>\
						</li>\
					<%}%>\
				</ul>\
				<div class="pageDiv"></div>';
				
var personInfo = '<a href="/personinfo"><img src="<%=avatar%>" /></a>';

var searchipt = '<input type="text" placeholder="搜索" class="ipt_search" />\
				<div class="i_search" id="cj_search"></div>';
