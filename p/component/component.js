(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
			'jquery', 
			'template', 
			'krpanoPluginJs',
			'proxy',
			'css!p/component/component',
			'switch'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy){
	var component;
	
	var data = [{
		name: '场景列表',
		key: 'x',
		value: 1
	}, {
		name: '小行星',
		key: 'y',
		value: 1
	}]
	
	var edit = {
		options: {
			icon: "/v2.0/images/commentImg.png"
		},
		init: function(dom){
			component = $("<div class='plugin-compoent'></div>");
			var ul = $("<ul />").appendTo(component);
			
			proxy.componentGet({
				panoId: panoId	
			}, function(result){
				if(!result.success){
					msg(result.errMsg);
				}
				
				data = result.data;

				for(var i = 0; i < data.length; i++){
					
					var li = $("<li/>").appendTo(ul).data(data[i]).append("<img src='"+data[i].icon+"' class='plugin-img'/><div class='plugin-leftRight'><div class='plugin-compoent-li-left'>"+data[i].name+"</div><input type='checkbox' name='check-3' value='"+ data[i].value +"' class='lcs_check lcs_tt1 plugin-compoent-li-right' /></div>");
					
					li.find("input").each(function(){
						if($(this).val() == 1){
							$(this).attr("checked", true);
						}
					});
				}
				krpanoPluginJs.addChilde(component, true);
				$('.plugin-leftRight input').lc_switch();
				ul.delegate('.lcs_check', 'lcs-on', function() {
					var d = $(this).parents("li").data();
					
					var data = {
						panoId: panoId	
					}
					
					data[d.key] = 1;
					proxy.componentSwitch(data)
				});

				ul.delegate('.lcs_check', 'lcs-off', function() {
					var d = $(this).parents("li").data();
					
					var data = {
						panoId: panoId	
					}
					
					data[d.key] = 0;
					proxy.componentSwitch(data)
				});
			})
		},
		show: function(map){
	    	if(!this.layerIndex){
				this.layerIndex = layerMsg({
				    title: "组件开关",
				    area: ['350px', '498px'],
				    skin:['setdistance plugin_layer plugin-switch'],
				    content: component
				});
	    	}
		},
		hide: function() {
			if(this.layerIndex){
				layer.close(this.layerIndex);
			}
			
			this.layerIndex = null;
		}
	}
	
	var view = {
		options: {
			icon: "/v2.0/store/images/sub.png",
			className: "btnComponent"
		},
		init: function(dom){
			this.dom = dom;
			component = $("<div class='plugin-compoent'><h5 class='pTitle'>开关设置</h5><i class='closea closeCompoent'></i></div>");
			var ul = $("<ul />").appendTo(component);
			
			proxy.componentGet({
				panoId: panoId	
			}, function(result){
				if(!result.success){
					msg(result.errMsg);
				}
				
				data = result.data;
				console.log(data);

				for(var i = 0; i < data.length; i++){
					if(data[i].name==="小行星"||data[i].name==="场景列表"){

					} else{
						var li = $("<li />").appendTo(ul).data(data[i]).append("<img src='"+data[i].front+"' class='plugin-img'/><div class='plugin-leftRight'><div class='plugin-compoent-li-left'>"+data[i].name+"</div><input type='checkbox' name='check-3' value='"+ data[i].value +"' class='lcs_check lcs_tt1 plugin-compoent-li-right' /></div>");
						
						li.find("input").each(function(){
							if($(this).val() == 1 && data[i].name!="重力感应"){
								$(this).attr("checked", true);
							} else {
								$(this).attr("checked", false);
							}
						});

						// if(data[i].name==="重力感应" && data[i].value == 1) {
						// 	krpanoPluginJs.switchOff('gyro',1);
						// }

					}




				}
				krpanoPluginJs.addChilde(component, true);
				$('.plugin-leftRight input').lc_switch();
				ul.delegate('.lcs_check', 'lcs-on', function() {
					var d = $(this).parents("li").data();
					var clickName = d.key;
					var data = {
						panoId: panoId
					}
					data[d.key] = 1;
					krpanoPluginJs.switchOff(clickName,1);
					
				});

				ul.delegate('.lcs_check', 'lcs-off', function() {
					var d = $(this).parents("li").data();
					
					var clickName = d.key;
					var data = {
						panoId: panoId	
					}
					
					data[d.key] = 0;
					krpanoPluginJs.switchOff(clickName,0);				
				});
			})
		},
		show: function(map){

			var domTop = this.dom.offset().top + 40 - 305/2;
			if(isMb && !isPad) {
		    	if(!this.layerIndex){
					this.layerIndex = layerMsg({
					    title: "",
					    area: ['', ''],
					    closeBtn: 0,
					    skin:['setdistance plugin_layer plugin-switch view-switch layerComponent myanim-b'],
					    content: component,
						shade:0,
					    shadeClose: false,
					    shift: null,
					    offset:['auto','auto']
					});
		    	}
		    	$(".closea").off("click").on("click",function(){
			    	$(".layerComponent").addClass("myanim-b0");
			    	var timer = setTimeout(function(){
			    		view.hide();
			    		$(".btnMore").trigger("click");
			    		clearTimeout(timer);
			    	},300);
		    	});

			} else {
		    	if(!this.layerIndex){
					this.layerIndex = layerMsg({
					    title: "",
					    area: ['350px', '305px'],
					    closeBtn: 0,
					    skin:['setdistance plugin_layer plugin-switch view-switch layerComponent'],
					    content: component,
					    offset:[domTop,'auto']
					});
		    	}

			}

		},
		hide: function() {
			if(this.layerIndex){
				layer.close(this.layerIndex);

			}
			
			this.layerIndex = null;
		}
	}
	
	function X(krpano, plugin){}
	
	X.prototype = {
		edit: edit,
		view: view,
		show: null,
		hide: null
	}
	
	return X;
})
)