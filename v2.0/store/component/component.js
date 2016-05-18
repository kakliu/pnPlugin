(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
		define([
			'jquery', 
			'template', 
			'krpanoPluginJs',
			'proxy',
			'css!/p/component/component.css',
			'/p/component/component.tpl.js',
			'/depend/switch/lc_switch.js'
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
				$('body').delegate('.lcs_check', 'lcs-on', function() {
					var d = $(this).parents("li").data();
					
					var data = {
						panoId: panoId	
					}
					
					data[d.key] = 1;
					proxy.componentSwitch(data)
				});

				$('body').delegate('.lcs_check', 'lcs-off', function() {
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
		content: null
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