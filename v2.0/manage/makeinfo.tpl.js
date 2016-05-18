var makeinfo = '<div class="mi_title">修改详情<a href="javascript:;" class="back" id="mi_back">返回</a></div>\
				<div class="info_makeinfo">\
					<div class="box_center">\
						<div class="hidden userid"><%=data.userId%></div>\
						<div class="bar">\
							<span>商户名称：</span>\
							<div class="ipt" id="mk_name"><%=data.name%></div>\
						</div>\
						<div class="bar">\
							<span>地址：</span>\
							<div class="ipt" id="mk_address"><%=data.address%></div>\
						</div>\
						<div class="bar bar_map">\
							<div class="map" id="allmap">\
							</div>\
						</div>\
						<div class="bar">\
							<span>商户手机号：</span>\
							<div class="ipt" id="mk_mobile"><%=data.mobile%></div>\
						</div>\
						<div class="bar">\
							<span>状态：</span>\
							<div class="ipt <%if(data.status2.id >= 8 || data.status2.id == 6){%> hidden <%}%>" id="select_box">\
								<div class="select_box">\
									<div class="selecton" id="selecting" datanum="" ischeck=""></div>\
									<ul class="select_list">\
										<%for(var i = 0; i <data.status1.length; i++) {%>\
											<li datanum="<%if(data.status2.id != 6){%> <%=data.status1[i].id%> <%}%>" ischeck="<%=data.status1[i].isCheck%>"><%=data.status1[i].value%></li>\
										<%}%>\
										<li datanum="" id="completed">制作完成，去绑定</li>\
									</ul>\
									<div class="select_b" id="dytip"></div>\
								</div>\
							</div>\
							<div class="showinfo <%if(data.status2.id >= 8 || data.status2.id == 6){%> show <%}%>" id="dtip"><%=data.status2.value%></div>\
							<div class="state_info">\
								<a href="javascript:;" class="cancelcheck <%if( data.status2.id == 8){%> show <%}%>" id="cancelcheck">取消验收</a>\
								<a href="javascript:;" class="againband <%if( data.status2.id == 6){%> show <%}%>" id="againBand">重新绑定</a>\
							</div>\
						</div>\
						<div class="bar bcountdown <%if( data.status2.id == 10){%> show <%}%>">\
							<p class="bcountdowntip">若交易不可达成，您可以在七天之内下线作品<p>\
							<div class="hidden" id="endtime"><%=data.endTime%></div>\
							<div class="bcountdowntime countdown">还有<label class="days"></label>天<label class="hours"></label>小时<label class="minutes"></label>分<label class="seconds"></label>秒</div>\
							<a href="javascript:;" class="removeband" id="removeband">下线作品</a>\
						</div>\
						<div class="bar causebar <%if( data.status2.id == 6 && data.verifyFail != "" ){%> show <%}%>">\
							<span>原因：</span>\
							<div class="ipt">\
								<p class="cause" id="causep"><%=data.verifyFail%></p>\
							</div>\
						</div>\
						<div class="bar">\
							<button class="btn_addinfo" id="btn_trueinfo"><%if( data.status2.id >= 8 || data.status2.id == 6){%> 关闭 <%}else{%> 确认修改 <%}%></button>\
						</div>\
					</div>\
				</div>';
				
var dialoglist = '<ul>\
					<%for(var i = 0; i <data.length; i++) {%>\
						<li>\
							<img src="<%=data[i].thumb%>" />\
							<div class="bvname">\
								<div class="ipt_check" dataid="<%=data[i].id%>"></div>\
								<label><%=data[i].name%></label>\
							</div>\
						</li>\
					<%}%>\
				</ul>\
				<div class="pageDiv"></div>';
