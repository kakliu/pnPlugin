var khlist = '<div class="mg_title">\
					订单管理<span class="total">(共<label><%=data.length%></label>个)</span>\
				</div>\
				<div class="mg_box">\
					<div class="noadd">\
						<img src="../../images/addnull_bg.png" class="anull" />\
						<p class="anullp">您还没有添加任何客户</p>\
					</div>\
					<div class="customerlist">\
						<dl class="cl_top">\
							<dd class="cl_20">商户名称</dd>\
							<dd class="cl_35">地址</dd>\
							<dd class="cl_15">手机号</dd>\
							<dd class="cl_15">状态</dd>\
							<dd class="cl_15">操作</dd>\
						</dl>\
						<%for(var i = 0; i <data.length; i++) {%>\
						<div class="cl_li">\
							<div class="cl_zh">\
								<div class="data"><%=data[i].createdDate%></div>\
								<div class="zh">\
									<label>账号：</label>\
									<label class="zh_num"><%=data[i].mobile%></label>\
								</div>\
							</div>\
							<ul>\
								<li class="cl_20 shopname"><%=data[i].shopName%></li>\
								<li class="cl_35 spaddress"><%=data[i].shopAddress%></li>\
								<li class="cl_15 spmobile"><%=data[i].mobile%></li>\
								<li class="cl_15 shopstatusdesc"><%=data[i].shopStatusDesc%></li>\
								<div class="hidden shopid"><%=data[i].shopId%></div>\
								<div class="hidden shopuserid"><%=data[i].shopUserId%></div>\
								<li class="cl_15 brn <%if(data[i].shopStatus >= 8){%> btn_xc <%} if(data[i].shopStatus == 12){%> btn_xv <%}%>">\
									<a href="javascript:;" class="btn_xg">修改</a>\
									<a href="javascript:;" class="btn_ck">查看</a>\
								</li>\
							</ul>\
						</div>\
						<%}%>\
					</div>\
				</div>';
