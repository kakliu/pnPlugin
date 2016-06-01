(function (window, undefined) {
    var list = {},
        funs = {},
        initXml = false,
        currRadar = 0;

    var DEFAULT_OPTIONS = {
        move: false,
        element: undefined,
        style: {
            width: 500,
            height: 500,
            bgAlpha: 0.8,
            bgColor: 0x000000
        },
        radar: {
            move: false,
            editHeading: true
        },
        data: [
            {
                name: undefined,
                url: undefined,
                radars: [{
                    name: undefined,
                    x: undefined,
                    y: undefined,
                    r: undefined
                }]
            }
        ]
    };

    function Maps(options) {
        this.init(options);
    }

    var fn = Maps.prototype;

    fn.init = function (options) {
        if (!options.element) {
            throw new Error("参数错误");
        }

        this.options = $.extend(true, {}, DEFAULT_OPTIONS, options);
        this.krpano = this.options.krpano;
        this.element = this.options.element;
        this.mapsType = this.options.mapsType;
        this.radars = {};
        this.createdMap(this.options);
    };

    fn.getPlugin = function (name) {
        return this.krpano.get("plugin[" + name + "]");
    };

    fn.createdMap = function () {
        //容错
        if (this.krpano.get(this.mapsType)) {
            this.mapsType += "-panocooker";
        }

        //背景
        this.mapsBg = this.mapsType + "bg"
        this.krpano.addplugin(this.mapsBg);
        this.pluginBg = this.getPlugin(this.mapsBg);
        this.pluginBg.keep = true;
        this.pluginBg.maskchildren = true;
        this.pluginBg.type = "container";
        this.pluginBg.bgcapture = true;
        this.pluginBg.width = this.options.style.width;
        this.pluginBg.height = this.options.style.height;
        this.pluginBg.align = "center";
        this.pluginBg.edge = "center";
        this.pluginBg.bgalpha = this.options.style.bgAlpha;
        this.pluginBg.bgColor = this.options.style.bgColor;

        //图片
        this.krpano.addplugin(this.mapsType);
        var plugin = this.plugin = this.getPlugin(this.mapsType);
        this.plugin.keep = true;
        this.plugin.visible = true;
        this.plugin.parent = this.mapsBg;
        this.plugin.is_move = this.options.move;
        this.plugin.url = "/static/images/1.jpg"
        this.plugin.ondown = "skin_maps_draglayer()";
    };

    fn.resize = function(width, height){
        this.pluginBg.width = this.options.style.width = width;
        this.pluginBg.height = this.options.style.width = height;
    };

    fn.addRadar = function(){
        return new radar(this);
    };

    function radar(map){
        this.map = map;
        this.options = map.options.radar;
        this.krpano = map.krpano;
        this.name = map.mapsType + (++currRadar);
        this.krpano.addplugin(this.name);
        this.plugin = map.getPlugin(this.name);
        this.plugin.keep = true;
        map.radars[this.name] = this;
        this.heading = 0;

        if(map.pluginBg.width > map.plugin.width){
            this.plugin.x = map.pluginBg.width/2 - (this.plugin.x?this.plugin.x:0);
        } else {
            this.plugin.x = map.pluginBg.width/2 + (this.plugin.x?this.plugin.x:0);
        }

        if(map.pluginBg.height > map.plugin.height){
            this.plugin.y = map.pluginBg.height/2 - (this.plugin.y?this.plugin.y:0);
        } else {
            this.plugin.y = map.pluginBg.height/2 + (this.plugin.y?this.plugin.y:0);
        }

        this.plugin.loadstyle("mapspot");
        this.plugin.parent = map.plugin.name;
        this.activespot = this.krpano.get("layer[activespot]");
        this.radar = this.krpano.get("layer[editradar]");
        this.scene = "";
        this.plugin.ondown = "skin_maps_draglayer()";

        this.active();
    }

    var fnR = radar.prototype;

    fnR.active = function(){
        this.activespot.parent = this.plugin.name;
        this.activespot.ondown = "set(plugin["+this.plugin.name+"].pressed, true); callwith(plugin["+this.plugin.name+"], ondown);";
        this.activespot.onup = "delete(plugin["+this.plugin.name+"].pressed)";
        this.radar.editmode = true;
        this.radar.parent = this.plugin.name;
        this.radar.visible = true;

        if(this.options.editHeading) {
        }
    };

    funs.get = function (mapsType) {
        return list[mapsType];
    };

    funs.register = function (mapsType, options) {
        if (!list[mapsType]) {
            options.krpano = this.krpano;
            options.mapsType = mapsType;
            list[mapsType] = new Maps(options);
        }

        return this.get(mapsType);
    };

    funs.init = function () {
        if (!initXml) {
            this.yp.util("include", "/plugins/maps.xml");
        }
    };

    YP.extend.maps = YP.callback(funs);
})(window);