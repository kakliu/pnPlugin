/*
    krpanoJS javascript plugin example / template
 */

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

        require(['jquery'], function($){
            //修复input,textarea被点击事件被删除
            $(plugin.sprite).delegate("input, textarea", "click", function() {
                $(this).focus();
            });
        })

        console.debug("ac正在加载");
        initrequire(startUp);
    }

    function startUp() {
        console.log("applicationContext");
        var plugins = krpano.get('plugin').getArray();
        var pluginsUrl = [];
        var newPlugins = [];
        var pluginTypes = skinSettings.plugin_types.replace(/\s/g, "");
        pluginTypes = !pluginTypes ? ['plugin_base'] : pluginTypes.split(",");

        console.debug(pluginTypes);

        for (var i in plugins) {
            for(var j in pluginTypes){
                if (plugins[i].plugintype == pluginTypes[j] && plugins[i].js) {
                    pluginsUrl.push(plugins[i].js);
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

    function initrequire(fn){
        if (!window.requirejs) {
            var head = document.getElementsByTagName('HEAD').item(0);
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "require.js";
            script.async = false;

            script.onload = function() {
                fn();
            }

            head.appendChild(script);
            return;
        } else {
            fn();
        }
    }

    local.hittest = function(x, y) {
        return false;
    }

    local.onresize = function(width, height) {
        // not used in this example

        return false;
    }
};
