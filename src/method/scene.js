(function (window, undefined) {
    var funs = {};
    var krpano;

    funs.getScene = function (name) {
        if (name) {
            return this.krpano.get("scene[" + name + "]");
        }
        return this.krpano.get("scene").getArray();
    };
    funs.getCurrScene = function(){
        return this.krpano.get("scene[get(xml.scene)]");
    };

    funs.loadScene = function (name) {
        this.krpano.call("skin_load_scene(" + name + ");");
    };

    var scene = YP.extend.scene = YP.callback(funs);
})(window);