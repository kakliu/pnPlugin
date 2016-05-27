/*
    krpanoJS javascript plugin example / template
 */

var config = {
    snow: '/my.js'
}



var krpanoplugin = function() {
    var local = this,
        krpano = null, 
        plugin = null,
        pluginpath,
        pluginTypes,
        skinSettings,
        isDebug,
        isEdit;

    local.registerplugin = function(krpanointerface, path, pluginobject) {
        krpano = krpanointerface;
        plugin = pluginobject;
        pluginpath = path;
        skinSettings = krpano.skin_settings;
        isEdit = skinSettings.isedit;

        plugin.bgcapture = true;
        plugin.type = "container";
    // register the size of the content
        plugin.registercontentsize(200,200);

        // use 100% width/height for automatic scaling with the plugin size
        var text = document.createElement("div");
        text.style.cssText = "width:100%;height:100%;"+
            "display:flex;color:white;background:rgba(10,50,100,0.5);"+
            "align-items:center;justify-content:center;text-align:center;";
        text.innerHTML = "HTML5<br>TEST PLUGIN<br>click me";

        // the plugin 'sprite' variable is the internal html element of the plugin
        plugin.sprite.appendChild(text);



        console.debug("ac正在加载","is ypView");
        startUp()
    }

    function startUp() {
        var plugins = krpano.get('plugin').getArray();
        var pluginsUrl = [];
        var newPlugins = [];
        var pluginTypes = skinSettings.plugin_types.replace(/\s/g, "");
        pluginTypes = !pluginTypes ? ['plugin_base'] : pluginTypes.split(",");

        console.debug(pluginTypes);

        for (var i in plugins) {
            for(var j in pluginTypes){
                if (plugins[i].plugintype == pluginTypes[j] && plugins[i].js) {
                    pluginsUrl.push(config[ plugins[i].name ] )
                    newPlugins.push(plugins[i]);
                    
                    // console.debug(plugins[i].js);
                    break;
                }
            }
        }

        // console.debug(pluginTypes);
        console.debug("pluginsUrl",pluginsUrl);
        console.debug("newPlugins",newPlugins);

        //组合所有插件
        define('applicationContext', pluginsUrl, function(p){
            var plugins = {};

            console.log("arguments",arguments);

            
            for(var i = 0; i < newPlugins.length; i++){
                var obj = {};

                if(!arguments[i]){
                    continue;
                }
                
                obj.icon = newPlugins[i].icon;
                obj.name = newPlugins[i].nickname;
                obj.plugin = newPlugins[i];
                console.trace();
                console.log("arguments---",arguments[i]);
                obj.fn = new arguments[i](krpano,obj.plugin);
                
                if(typeof obj.viewFn === "function"){
                    obj.viewFn = new obj.viewFn();
                }

                // console.log(obj.fn, obj.fn.edit);
                obj.plugintype = newPlugins[i].plugintype
                
                plugins[newPlugins[i].name] = obj;
            }

            console.log("哈哈");
            
            return {
                count: newPlugins.length,
                getPlugin: function(name){
                    return plugins[name];
                },
                getArray: function(){
                    return plugins;
                },
                getPluginByType: function(type){
                    var tempList = [];

                    var get = function(type){
                        var temp = [];
                        for(var i in plugins){
                            if(plugins[i].plugintype == type){
                                tempList.push(plugins[i]);
                            }
                        }
                    }

                    if(type instanceof Array){
                        for(var i in type){
                            get(type[i]);
                        }
                    } else if (typeof type === "string") {
                        get(type);
                    };

                    return tempList;
                }
            }
        })
    }



    local.hittest = function(x, y) {
        return false;
    }

    local.onresize = function(width, height) {
        // not used in this example

        return false;
    }
};
