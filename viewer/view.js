/*
    krpanoJS javascript plugin example / template
 */

var krpanoplugin = function() {
	var local = this; // save the 'this' pointer from the current plugin
						// object

	var krpano = null; // the krpano and plugin interface objects
	var plugin = null;

	var plugincanvas = null; // optionally - a canvas object for graphic
								// content
	var plugincanvascontext = null;

	var basePath = window.location.origin;
	var isDebug;
	var skinSettings;

	// registerplugin - startup point for the plugin (required)
	// - krpanointerface = krpano interface object
	// - pluginpath = string with the krpano path of the plugin (e.g.
	// "plugin[pluginname]")
	// - pluginobject = the plugin object itself (the same as: pluginobject =
	// krpano.get(pluginpath) )
	local.registerplugin = function(krpanointerface, pluginpath, pluginobject) {
		krpano = krpanointerface;
		plugin = pluginobject;

		var requireL;

		plugin.bgcapture = true;
		plugin.type = "container";
		skinSettings = krpano.skin_settings;

		if (!window.requirejs) {
			var head = document.getElementsByTagName('HEAD').item(0);
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "/require.js";
			script.async = false;

			script.onload = function() {
				startUp(krpanointerface, pluginpath, pluginobject);
			}

			head.appendChild(script);
			return;
		} else {
			startUp(krpanointerface, pluginpath, pluginobject);
		}
	}

	function startUp(krpanointerface, pluginpath, pluginobject) {
		setTimeout(function(){
			window.require([ 'jquery', pluginobject.js, 'applicationContext'], function($, index, ac) {

				var fn = new index(krpanointerface, pluginobject);

				var pluginTypes = skinSettings.plugin_types.replace(/\s/g, "");
				pluginTypes = !pluginTypes ? ['plugin_base'] : pluginTypes.split(",");

				var plugins = ac.getPluginByType(pluginTypes);
				console.log(plugins);
				
				for(var i =0; i < plugins.length; i++) {
					var flag = krpano.get("skin_settings.isedit") == 'true'?true:false;
					
					var plugin = plugins[i].fn;
					var pluginFn = plugins[i].viewFn;
					
					console.log(plugins[i].name, pluginFn && pluginFn.isAddPlugin);
					if(!pluginFn) {
						continue;
					} else if(pluginFn && pluginFn.isAddPlugin == false){
						pluginFn.init(dom);
						continue;
					}
					
					var op = pluginFn.options?$.extend(true, {}, pluginFn.options):{};
					
					op.icon = plugins[i].icon;
					
					op.oldIcon = plugins[i].icon;
					op.name = plugins[i].name;
					op.isedit = flag;
					op.plugin = pluginFn;
					
					if(pluginFn.options){
						if(pluginFn.options.icon){
							op.icon = pluginFn.options.icon;
						}

						if(pluginFn.options.content){
							if(typeof pluginFn.content === "function"){
								op.content = pluginFn.options.content();
							} else {
								op.content = pluginFn.options.content;
							}
						}

						if(pluginFn.options.realTimeClick){
							op.realTimeClick = true;
						}
					}
					
					var dom = fn.addPlugin(op);

					var eventConfig = krpano.get("events[skin_events]");


					eventConfig.onmousedown = function(){
						var u = navigator.userAgent;
						var isMb = !!u.match(/AppleWebKit.*Mobile.*/);
						var isPad = u.indexOf('iPad') > -1;
						if(!isMb || isPad) {
							fn.hideAll();
						}
					}						

					//初始化
					pluginFn.init(dom);
					
					if(!op.content && !fn.initFn){
						dom.data("plugin", pluginFn);
						
						dom.click(function(){
							$(this).data("plugin").show();
						})
					}
				}
			});
		});
	}

	
	function initJquery() {
		if (!window.$) {
			var ga = document.createElement('script');
			ga.type = 'text/javascript';
			ga.async = false;
			ga.src = "/jquery.js";
			document.body.appendChild(ga);

			return window.$;
		}
	}

	initJquery();
};
