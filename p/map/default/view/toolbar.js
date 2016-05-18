window.basePath = "http://ypano.duc.cn";
require.config({
	baseUrl:basePath,    
	paths: {
    	'jquery':'../../../depend/jquery/jquery.min',
    	'template': '../../../depend/template.js/template',
    	'css': '../../../depend/requirejs/css',
    	'text': '../../../depend/requirejs/text', 
    	/*'krpanoPluginJs': '../../../depend/util/krpano',*/
    	// 弹窗
		'layer':'../../../v2.0/modul/layer',
		// 设置焦距范围
		'focaldistance':'../../../v2.0/focaldistance/focaldistance',
		'focaldistancetpl':'../../../v2.0/focaldistance/focaldistance.tpl',
		'rangeSlider':'../../../v2.0/rangeSlider/rangeSlider',
		'menu':'../../../v2.0/addlink/menu',
		'common1':'../../../depend/common/duc.common'
    },
    shim:{
    	'layer':['jquery'],
    	'focaldistance':['jquery','layer'/*,'krpanoPluginJs'*/],
    	'rangeSlider':['jquery'],
    	'menu':['jquery']
    }
});

require.config({
	baseUrl:basePath+"/v2.0",  
});

var krpano;
var plugin;

define([
		'jquery',
		'template',
		/*'krpanoPluginJs',*/
		'focaldistance',
		'focaldistancetpl',
		'toolbar/toolbar.tpl',
		// 弹窗
		'layer',
		// 焦距范围
		'rangeSlider',
		// 添加连接器
		'menu',
		'addlink/menu.tpl',
		'css!common/common.css',
		'css!common/basicCommon.css',
		'css!toolbar/toolbar.css',
		// 弹窗
		'css!skin/layer.css',
		'css!focaldistance.css',
		// 设置焦距范围
		'css!ion.rangeSlider.css',
		'css!ion.rangeSlider.skinHTML5.css',
		'css!rang.css',
		// 添加连接器
		'css!addlink/menu.css',
		'common1'
	], function($,template/*,krpanoPluginJs*/,focaldistance){

		function X(krpano, plugin){
			this.init(krpano, plugin);
		}

		X.prototype = {
			init: function(krpano, plugin){
				
							
			},
			_initKrpanoCanvas: function(xmlURL, vars) {
				var self = this;
				!vars?vars={}:vars;
				vars.events[main].onxmlcomplete = "jscall(flashCall())";
				embedpano({swf:"tour.swf", xml:xmlURL, target:"pano", html5:"only", passQueryParameters:false, vars:vars, id:"krpanoSWFObject" });

				window.flashCallJs = function(){
					self.krpano = document["krpanoSWFObject"];
				}
			}
		}

		return X;
	});