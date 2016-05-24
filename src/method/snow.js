(function(window, undefined) {
    var funs = {};
    //defaultsnow/rain/heavyrain
    funs.setSnow = function (name) {
        return this.krpano.call(name + "()");
    };

    funs.custom = function (imageurl) {
        return this.krpano.call("custom("+imageurl+")");
    };

    YP.extend.snow = YP.callback(funs);

})(window)
