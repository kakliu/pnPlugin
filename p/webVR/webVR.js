(function (factory) {
	if (typeof define === "function" && define.amd) {
		require.config({
			paths: {
				'comment': ['/p/hotspot/comment/']
			}
		});

        // AMD模式
		define([
			'jquery', 
			'template', 
			'krpanoPluginJs',
			'proxy',
			'login/login',
			'hotspot/registehotspot',
			'comment/commentform.tpl',
			'comment/comment.tpl',
			'css!comment/comment.css'
		], factory);
    } else {
        // 全局模式
        factory(jQuery,template, krpanoPluginJs, proxy);
    }
}(function($, template, krpanoPluginJs, proxy, login, registehotspot, commentformTpl, commentTpl){
	var self;
	var krpano;
	var plugin;
	function X(k){
		krpano = k;
	}

	var fn = X.prototype;

	fn.view = function() {
		this.options = {
			className:"btnVR"
		};
		self = this;


		this.init = function(dom){
			this.dom = dom;

			var webVR = krpano.get("plugin[WebVR]");

			webVR.onentervr = function(){
				krpano.call("webvr_onentervr(); vr_menu_setvisibility(true);");

				var hotspots = krpano.get("hotspot");

				if(!hotspots){
					return;
				}

				for(var i in hotspots.getArray()) {
					var hotspot = hotspots.getItem(i);

					if(hotspot.hotspot_type == "link_scene" || hotspot.name == "skin_nadirlogo_nadirlogo"){
						hotspot.distorted = true;
						hotspot.depth = 5000;
						hotspot.vr_timeout = 1000;
						hotspot.oy = 0;
						hotspot.scale = 2;
					}
				}
				$(".touxiang").hide();
				$('.toolbar-all').hide();
				$('.vote').hide();
			}


			webVR.onexitvr = function(){
				krpano.call("webvr_onexitvr(); end_vr(vr_menu_setvisibility(false););");
				
				var hotspots = krpano.get("hotspot");

				if(!hotspots){
					return;
				}

				for(var i in hotspots.getArray()) {
					var hotspot = hotspots.getItem(i);

					if(hotspot.hotspot_type == "link_scene" || hotspot.name == "skin_nadirlogo_nadirlogo"){
						hotspot.distorted = false;
						hotspot.depth = 0;
						hotspot.vr_timeout = 1000;
						hotspot.oy = 0;
						hotspot.scale = 1;
					}
				}
				$(".touxiang").show();
				$('.toolbar-all').show();
				$('.vote').show();
			}



		}

		this.show = function(){
			// if(isMb && !isPad) {
			// 	console.log('23');
			// } else {
			// 	krpano.call("plugin[WebVR].enterVR()");
			// 	this.dom.data("curr", false);				
			// }
			krpano.call("plugin[WebVR].enterVR()");
			this.dom.data("curr", false);				

		}

		this.hide = function() {
			
		}
	}

	return X;
})
)