var personInfo = '<div class="if_title">账号信息</div>\
				<div class="if_box">\
					<div class="bar">\
						<span>作者编号：</span>\
						<label><%=id%></label>\
					</div>\
					<div class="bar">\
						<span>用户名：</span>\
						<label><%=name%></label>\
					</div>\
					<div class="bar">\
						<span>已绑定手机号：</span>\
						<label><%=mobile%></label>\
						<a href="javascript:;" class="ghmobile <%if( mobile != ""){%> show <%}%>" id="changemobile">更换手机号</a>\
						<a href="javascript:;" class="bnewmobile <%if( mobile == ""){%> show <%}%>" id="bnewmobile">绑定新的手机号</a>\
					</div>\
					<div class="bar">\
						<span>密码：</span>\
						<label>********</label>\
						<a href="javascript:;" class="revise" id="revisepsw">修改密码</a>\
					</div>\
				</div>';
