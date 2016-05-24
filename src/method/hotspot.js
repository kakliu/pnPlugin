(function (window, undefined) {
    var funs = {},
        krpano,
        hotspotTypes = {},
        defaultOptions = {
            align: "centent",
            //添加前是否移动
            isMove: true,
            //添加后是否移动
            isSaveMove: false,
            x: undefined,
            y: undefined,
            //true:未保存，需要调用saveHotspot方法保存该热点；false：已经保存。
            saveFlag: true,
            isLoadPano: false,
            isInitIconEvent: false,
            callback: {
                onHotspotAdd: undefined,
                onHotspotUpdate: undefined,
                onHotspotSave: undefined
            }
        };

    function registerHotspot(hotspotType, options) {
        //热点类型
        this.hotspotType = hotspotType;
        this.options = $.extend(true, {}, defaultOptions, options);
        this.init();
    }

    var fn = registerHotspot.prototype;

    fn.init = function () {
        var self = this;
        hotspotTypes[this.hotspotType] = {
            count: 0,
            currHotspotName: undefined,
            options: this.options,
            list: [],
            hotspotFn: self
        };
    };

    /**
     * 添加热点
     * @param options
     * @returns {Hotspot}
     */
    fn.addHotspot = function (options) {
        options.hotspotType = this.hotspotType;
        var hotspotFn = new Hotspot(options);

        hotspotTypes[this.hotspotType].list.push({
            hotspotFn: hotspotFn,
            element: options.element
        });

        return hotspotFn;
    };

    /**
     * 获取热点
     * @param name 当name为null时,返回所有热点。当name有值时,返回当前hotspot
     * @returns {Array|hotspot}
     */
    fn.getHotspot = function (name) {
        var temp = [];

        var hotspots = krpano.get("hotspot");

        if (!hotspots) {
            return;
        }

        for (var i in hotspots.getArray()) {
            var hotspot = hotspots.getItem(i);

            logger.log(hotspot.hotspot_type, this.hotspotType);

            if (hotspot.hotspot_type == this.hotspotType) {
                if (name && hotspot.name == name) {
                    return hotspot;
                }

                temp.push(hotspot);
            }
        }

        logger.log(temp);
        return temp;
    };

    /**
     *
     * @param option
     * @param type
     * @param _this
     * @param data
     * @returns {*}
     */
    function onHotspotEvent(option, type, _this, data) {
        if (option && typeof option[type] === "function") {
            return option[type].apply(_this, data);
        }
    }

    /**
     * 事件传递
     *        type：事件名称
     *        data：事件所需要的数据（可选）
     *
     */
    function onPluginEvent(option, type, _this, data) {
        if (option && option.callback && typeof option.callback[type] === "function") {
            return option.callback[type].apply(_this, data);
        }
    }

    /**
     * 更新数据
     * @param hotspot
     * @param options
     */
    function updateHotspot(hotspot, options) {
        if (options.style) {
            loadstyle(hotspot, options.style);
        }

        if (options.data) {
            hotspot.data = options.data;
        }
    }

    /**
     *    获取参数集合中的最终数据
     *
     *  当数据为function时执行function，根据返回值判断
     *
     *    当数据最终类型不为type类型是返回默认值defaultvalue
     *
     *        value：数据
     *        type：数据格式
     *        defaultValue：默认值（可选）
     *
     */
    function getFunctiValue(value, type, defaultValue) {
        if (!value) {
            return;
        }

        if (typeof value === "function") {
            value = value();
        }

        if (type && typeof value === type) {
            return value;
        } else if (!type) {
            return value;
        }

        return defaultValue;
    }

    function random(length) {
        var result = [];
        for (var i = 0; i < length; i++) {
            var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
            //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
            result.push(String.fromCharCode(97 + ranNum));
        }

        return result.join("");
    }

    function Hotspot(options) {
        var _this = this, hotspot, spotFn, bakEvent = {}, moveType = 1;

        this.saveHotspot = function (options) {
            if (hotspot.is_save == true) {
                this.updateHotspot(options);
                return;
            }

            hotspot.is_save = true;
            hotspot.is_move = this.registerOptions.options.isSaveMove;
            hotspotTypes[this.options.hotspotType].currHotspotName = undefined;

            updateHotspot(hotspot, options);
            var id = onHotspotEvent(spotFn, "onsave", spotFn, [hotspot.data, hotspot]);

            hotspot.id = id;
        };

        this.updateHotspot = function (options) {
            updateHotspot(hotspot, options);
            this.onUpdate();
        };

        this.removeHotspot = function (flag) {
            hotspotTypes[this.options.hotspotType].currHotspotName = undefined;

            if (flag != false) {
                onHotspotEvent(spotFn, "onremove", spotFn, [hotspot.id, hotspot]);
            }

            removeHotspot(hotspot.name);
        };

        this.zorder = function (type) {
            if (type) {
                hotspot.zorder = 101 + 100;
            } else {
                hotspot.zorder = 101;
            }
        };

        this.callwith = function (type) {
            onHotspotEvent(spotFn, type, spotFn, [data, hotspot]);
        };

        this.callwith = function (type, data) {
            onHotspotEvent(spotFn, type, spotFn, data);
        };

        this.loadStyle = function (name) {
            loadStyle(hotspot, name);

            if (hotspot.is_save) {
                this.onUpdate();
            }

            this.onupdatestyle();
        };

        this.moveCancel = function () {
            if (moveType != 1) {
                return;
            }

            bakEvent.onup = hotspot.onup;
            bakEvent.ondown = hotspot.ondown;
            bakEvent.onclick = hotspot.onclick;

            hotspot.onup = "";
            hotspot.ondown = "";
            hotspot.onclick = "";
            moveType = 0;
        };

        this.moveStart = function () {
            if (moveType != 0) {
                return;
            }

            hotspot.onup = bakEvent.onup;
            hotspot.ondown = bakEvent.ondown;
            hotspot.onclick = bakEvent.onclick;

            moveType = 1;
        };

        this.onupdatestyle = function () {
            var obj = {
                x: parseInt(hotspot.width) / 2,
                y: parseInt(hotspot.height) / 2
            };

            onHotspotEvent(spotFn, "onupdatestyle", spotFn, [obj, hotspot]);
        };

        this.onUpdate = function () {
            onHotspotEvent(spotFn, "onupdate", spotFn, [hotspot.data, hotspot]);
        };

        this.getHotspot = function () {
            return this.registerOptions.list;
        };

        options.hotspotFn = this;
        this.options = options;
        this.registerOptions = hotspotTypes[options.hotspotType];

        if (options.hotspot) {
            addHotspotInitElement(options.hotspot, options);
            hotspot = options.hotspot;
        } else {
            hotspot = addHotspot(options);
        }
        hotspot.is_init = true;
        spotFn = options.element;

        if (this.registerOptions.options.isInitIconEvent) {
            this.onupdatestyle();
        }
    }

    function loadStyle(hotspot, styleName) {
        var styleIcon = krpano.get("style[" + styleName + "]");
        var hotspotName = "hotspot[" + hotspot.name + "]"

        krpano.call("callwith(" + hotspotName + ", stopdelayedcall(get(name)))");

        if (styleIcon && hotspot.icon_id != styleIcon.iconid) {
            hotspot.icon_id = styleIcon.iconid;
            hotspot.loadstyle(styleName);
        } else {
            logger.warn("获取iconName失败, iconName=" + styleName);
        }
    }

    function addHotspotInitElement(hotspot, options) {
        var hotspotOptions = hotspotTypes[options.hotspotType];
        var spotFn, dragx, dragy;

        var data = hotspot.data = options.data ? options.data : {};

        hotspot.align = hotspotOptions.align;
        hotspot.is_move = hotspotOptions.options.isMove;
        hotspot.id = options.id;
        hotspot.keep = true;

        //当不需要icon时,默认给一个空白图片.
        //当hotspot为空时,该hotspot会被隐藏
        if (options.iconName) {
            loadStyle(hotspot, options.iconName);
        } else if (options.style) {
            hotspot.loadstyle(options.style);
        } else if (options.icon) {
            hotspot.url = options.icon;
        } else {
            hotspot.url = "/krpano/skin/img/background.png";
        }

        if (hotspotOptions.options.saveFlag ? options.saveFlag == false ? false : true : false) {
            var isSave = false;
            hotspot.is_save = false;

            //注册is_save参数
            hotspot.registerattribute("is_save", isSave, function (flag) {
                isSave = flag;

                if (flag) {
                    onHotspotEvent(spotFn, "onusave", spotFn, [data, hotspot]);
                    saveId(id);
                }
            }, function () {
                return isSave;
            })
        } else {
            hotspot.is_save = true;
            hotspot.is_move = hotspotOptions.options.isSaveMove;
            hotspotOptions.currHotspotName = undefined;
        }

        hotspot.registerattribute("data", options.data, function (d) {
            if (d == data) {
                return;
            }

            $.each(d ? d : {}, function (k, v) {
                data[k] = v;
            });
        }, function () {
            return data;
        });

        hotspot.ondown = function () {
            logger.log("ondown");
            hotspot.zorder++;
            dragx = krpano.mouse.stagex;
            dragy = krpano.mouse.stagey;
            hotspot.pressed = true;

            if (dragx != krpano.mouse.stagex || dragy != krpano.mouse.stagey) {
                onHotspotEvent(spotFn, "ondown", spotFn, [data, hotspot]);
            }

            if (hotspot.is_move) {
                krpano.call("callwith(hotspot[" + hotspot.name + "], skin_hotspot_drag());");
            }
        };

        hotspot.onclick = function () {
            logger.log("onclick");
            onHotspotEvent(spotFn, "onclick", spotFn, [data, hotspot]);
        };

        hotspot.onover = function () {
            logger.log("onover");
            onHotspotEvent(spotFn, "onover", spotFn, [data, hotspot]);
        };

        hotspot.onout = function () {
            logger.log("onout");
            onHotspotEvent(spotFn, "onout", spotFn, [data, hotspot]);
        };

        hotspot.onhover = function () {
            // logger.log("onhover");
            onHotspotEvent(spotFn, "onhover", spotFn, [data, hotspot]);
        };

        hotspot.onup = function () {
            logger.log("onup");
            hotspot.pressed = false;
            hotspot.zorder--;

            if (hotspot.onup2) {
                callwith(hotspot[get(name)], onup2);
            }

            if (dragx != krpano.mouse.stagex || dragy != krpano.mouse.stagey) {
                onHotspotEvent(spotFn, "onup", spotFn, [data, hotspot]);
            }

            if (hotspot.is_move == true && (dragx != krpano.mouse.stagex || dragy != krpano.mouse.stagey)) {
                logger.log("onmoveupdate");
                onHotspotEvent(spotFn, "onmoveupdate", spotFn, [data, hotspot]);
            }
        };

        if (hotspotOptions.options.element && typeof hotspotOptions.options.element === "function") {
            options.element = spotFn = new hotspotOptions.options.element(hotspot);
            spotFn.hotspotFn = options.hotspotFn;
            var element = spotFn.init(options.data, hotspot.is_save);

            var onloaded = function () {
                $(hotspot.sprite).append(element);

                $(hotspot.sprite).find("input, textarea").off("click mousedown mousedown focus").on("click mousedown mousedown focus", function (e) {
                    e.stopPropagation();
                });

                onHotspotEvent(spotFn, "onresize", spotFn, [data, hotspot]);
                onPluginEvent(hotspotOptions, "onHotspotAdd", hotspot);
                krpano.call("callwith(hotspot[" + hotspot.name + "], skin_hotspot_animate());");
            };


            if (options.flag) {
                onloaded();
            } else {
                hotspot.onloaded = onloaded;
            }
        }

        logger.log(hotspot.name);
    }

    function addHotspot(options) {
        if (!hotspotTypes[options.hotspotType]) {
            logger.error("未注册当前类型，hotspotTypes=" + hotspotType);
            return;
        }

        var hotspotOptions = hotspotTypes[options.hotspotType];
        var view = options.view;
        var hotspot;

        //根据偏移量计算最终位置
        if (!view) {
            krpano.call("adjusthlookat(view.hlookat)");

            view = {
                ath: krpano.view.hlookat,
                atv: krpano.view.vlookat
            };
            var view_now = krpano.spheretoscreen(krpano.view.hlookat, krpano.view.vlookat),
                common_x = getFunctiValue(hotspotOptions.options.x, "number"),
                common_y = getFunctiValue(hotspotOptions.options.y, "number");

            if (common_x && common_y) {
                var view_new = krpano.screentosphere(common_x, common_y);

                view.ath = view_new.x;
                view.atv = view_new.y;
            }
        }

        if (hotspotOptions.currHotspotName) {
            var hotspotName = "hotspot[" + hotspotOptions.currHotspotName + "]";
            hotspot = krpano.get(hotspotName);

            hotspot.ath = view.ath;
            hotspot.atv = view.atv;
            hotspot.scene_name = "scene[" + krpano.get('xml.scene') + "]";
        } else {
            hotspotOptions.currHotspotName = random(10);
            var hotspotName = "hotspot[" + hotspotOptions.currHotspotName + "]";
            krpano.addhotspot(hotspotOptions.currHotspotName);
            hotspot = krpano.get(hotspotName);

            hotspot.ath = view.ath;
            hotspot.atv = view.atv;
            hotspot.scene_name = "scene[" + krpano.get('xml.scene') + "]";
            hotspot.hotspot_type = options.hotspotType;
            hotspot.zorder = 101;
            hotspot.keep = true;

            addHotspotInitElement(hotspot, options);
        }

        return hotspot;
    }

    funs.register = function (hotspotType, options) {
        krpano = this.krpano;
        return new registerHotspot(hotspotType, options);
    };

    YP.extend.hotspot = YP.callback(funs);
})(window);