(function (window, undefined) {
    var list = {},
        funs = {},
        initXml = false,
        currRadar = 0;

    var DEFAULT_OPTIONS = {
        move: false,
        element: undefined,
        style: {
            width: 1000,
            height: 500,
            bgAlpha: 0.8,
            bgColor: 0x000000
        },
        radar: {
            move: false,
            editHeading: false
        },
        data: [
            {
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
        this.krpano = funs.krpano;
        this.element = this.options.element;
        this.mapsType = this.options.mapsType;
        this.createdMap(this.options);
        this.element.width(this.options.style.width);
        this.element.height(this.options.style.height);
        this.element.append(this.pluginBg.sprite);

        if (this.options.data) {
            for (var i in this.options.data) {
                var map = this.options.data;
                this.plugin.url = this.options.data.url;
            }
        }
    };

    fn.getPlugin = function (name) {
        return this.krpano.get("plugin[" + name + "]");
    };

    /**
     * 创建地图
     */
    fn.createdMap = function () {
        //背景
        this.pluginBg = this.krpano.addplugin(random(10));
        this.pluginBg.width = this.options.style.width;
        this.pluginBg.height = this.options.style.height;
        //this.pluginBg.align = "center";
        //this.pluginBg.edge = "center";
        this.pluginBg.bgalpha = this.options.style.bgAlpha;
        this.pluginBg.bgColor = this.options.style.bgColor;
        this.pluginBg.loadstyle("default_maps_bg");

        //图片
        var name = random(10);
        var plugin = this.plugin = this.krpano.addplugin(name);
        this.plugin.parent = this.pluginBg.name;
        this.plugin.is_move = this.options.move;
        this.plugin.loadstyle("default_maps");
        this.radars = this.plugin.radars = {};
    };

    /**
     * 重新设置地图的高宽
     * @param width 高
     * @param height 宽
     */
    fn.resize = function (width, height) {
        this.pluginBg.width = this.options.style.width = width;
        this.pluginBg.height = this.options.style.width = height;
        this.krpano.call("callwith(plugin[" + this.plugin.name + "], onloaded)");
    };

    /**
     * 添加热点
     * @returns {Radar} 热点对象
     */
    fn.addRadar = function () {
        return new Radar(this);
    };

    function random(length) {
        return funs.yp.util("random", length);
    }

    /**
     * 热点
     * @param map 当前地图
     * @constructor
     */
    function Radar(map) {
        var self = this;
        this.map = map;
        this.options = map.options.radar;
        this.krpano = map.krpano;
        this.plugin = this.krpano.addplugin(random(10));
        this.plugin.keep = true;
        this.plugin.scalechildren = true;
        map.radars[this.plugin.name] = this;
        this.heading = 0;
        this.plugin.scale = map.plugin.radar_scale;

        if (this.plugin.scale && this.plugin.scale != 1) {
            this.plugin.x = map.plugin.width / 2;
            this.plugin.y = map.plugin.height / 2;
        } else {
            //设置热点在当前框的中间
            this.plugin.x = map.pluginBg.width / 2 - (map.plugin.x ? map.plugin.x : 0);
            this.plugin.y = map.pluginBg.width / 2 - (map.plugin.y ? map.plugin.y : 0);

            //防止超出
            if (this.plugin.x > map.plugin.width) {
                this.plugin.x = map.plugin.width;
            } else if (this.plugin.x < 0) {
                this.plugin.x = 0;
            }

            if (this.plugin.y > map.plugin.height) {
                this.plugin.y = map.plugin.height;
            } else if (this.plugin.y < 0) {
                this.plugin.y = 0;
            }
        }

        this.plugin.loadstyle("mapspot");
        this.plugin.parent = map.plugin.name;
        this.activespot = this.krpano.get("layer[activespot]");
        this.radar = this.options.editHeading ? this.krpano.get("layer[editradar]") : this.krpano.get("layer[radar]");
        this.round = this.krpano.get("layer[maps_round]");
        this.point = this.krpano.get("layer[maps_point]");
        this.mapsBg = this.krpano.get("layer[maps_bg]");
        this.scene = "";
        this.plugin.ondown = "skin_maps_draglayer()";

        this.plugin.onclick = function () {
            self.active();
        };

        this.active();
    }

    var fnR = Radar.prototype;

    /**
     * 选择热点
     */
    fnR.active = function () {
        var self = this;
        this.activespot.parent = this.plugin.name;
        this.setEvent(this.activespot);
        this.activespot.visible = true;

        this.radar.parent = this.plugin.name;
        this.radar.visible = true;
        this.setEvent(this.round);

        if (this.options.editHeading) {
            this.round.visible = true;
            this.point.visible = true;
            this.mapsBg.visible = true;

            this.round.parent = this.radar.name;
            this.mapsBg.parent = this.plugin.name;

            //传递事件
            $(this.point.sprite).mousedown(function (event) {
                self.triggerRadar("mousedown", event);
                self.editRadar(true);
            }).mouseup(function (event) {
                self.triggerRadar("mouseup", event);
                self.editRadar(false);
            }).mousemove(function (event) {
                self.triggerRadar("mousemove", event);
            });

            window.radar["mousemove"] = function (heading) {
                self._setRoundHeading.call(self, heading);
            }
        } else {
            this.round.visible = false;
            this.point.visible = false;
            this.mapsBg.visible = false;
        }
    };

    fnR.unActive = function () {
        this.activespot.visible = false;
        this.radar.visible = false;
        this.round.visible = false;
        this.point.visible = false;
        this.mapsBg.visible = false;
    }

    /**
     * 设置角度
     * @param heading
     * @private
     */
    fnR._setRoundHeading = function (heading) {
        this.round.rotate = heading;
    }

    /**
     * 设置是否编辑
     * @param flag true:是  false:否
     */
    fnR.editRadar = function (flag) {
        this.radar.editmode = flag && this.options.editHeading ? true : false;
    }

    /**
     * 触发事件
     * @param type 事件类型
     * @param event 事件对象
     */
    fnR.triggerRadar = function (type, event) {
        //触发js事件
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent(type, true, true, window, document.defaultView, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
        this.krpano.get("layer[editradar]").child.path.dispatchEvent(e);
    };

    /**
     * 传递时间给点, 可以移动
     * @param dom 传递的对象
     * @param name 传递给谁 默认:this.plugin.name
     */
    fnR.setEvent = function (dom, name) {
        name = name ? name : this.plugin.name;
        dom.ondown = "set(plugin[" + name + "].pressed, true); callwith(plugin[" + name + "], ondown);"
        dom.onup = "delete(plugin[" + name + "].pressed)";
    };

    /**
     * 获取当前热点的数据
     */
    fnR.getData = function () {
        var data = {};

        data.scene = this.scene;
        data.x = this.plugin.x;
        data.y = this.plugin.y;
        data.heading = this.radar.currheading;

        return data;
    }


    //------------------------------------------------
    funs.get = function (mapsType) {
        return list[mapsType];
    };


    funs.register = function (mapsType, options) {
        if (!list[mapsType]) {
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