/*
 krpano HTML5 Javascript Plugin Example
 */

function krpanoplugin() {
    var local = this;
    var krpano = null;
    var yp;


    local.registerplugin = function (krpanointerface, pluginpath, pluginobject) {
        yp = krpanointerface.yt_pano;

        yp.krpano = krpanointerface;
        yp.plugin = pluginobject;
    }

    local.unloadplugin = function () {
        if ($.isFunction(yp.option.callback.unLoadPlugin)) {
            yp.option.callback.unLoadPlugin();
        }
        yp.krpano = null;
        yp.plugin = null;
    }

    local.onresize = function (width, height) {
        return callback(yp.option.callback.onResize, [width, height]);
    };

    function callback(fn, params) {
        if ($.isFunction(fn)) {
            return fn.apply(yp, params);
        }
    }
}


