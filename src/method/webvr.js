(function(window, undefined) {

    var funs = {};

    funs.enterVr = function () {
        return this.krpano.call("plugin[WebVR].enterVR()");
    };

    funs.exitVr = function (name) {
        return this.krpano.call("plugin[WebVR].exitVR()");
    };

    YP.extend.webvr = YP.callback(funs);

})(window)
