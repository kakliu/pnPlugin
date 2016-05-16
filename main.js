(function (window, undefined) {
    var yp = function (option) {
        this.init();
        this.createPano(option);
    };
    yp.extend = yp.prototype;
    yp.callback = function (funs) {
        return function (name, params) {
            funs.krpano = this.krpano;

            if (name && funs[name]) {
                funs[name].krpano = this.krpano;
                return funs[name].apply(funs[name], params);
            } else if (name) {
                logger.error("未找到方法:" + name);
            }

            return funs;
        }
    };

    yp.extend.init = function () {
        function loadJS(id, url) {
            var xmlHttp = null;
            if (window.ActiveXObject) {
                try {
                    xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
            } else if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            }
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);
            if (xmlHttp.readyState == 4) {
                if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 0 || xmlHttp.status == 304) {
                    var myHead = document.getElementsByTagName("HEAD").item(0);
                    var myScript = document.createElement("script");
                    myScript.type = "text/javascript";
                    myScript.id = id;
                    try {
                        myScript.appendChild(document.createTextNode(xmlHttp.responseText));
                    } catch (ex) {
                        myScript.text = xmlHttp.responseText;
                    }
                    myHead.appendChild(myScript);
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        loadJS("logger", "/common/logger.js");
        loadJS("embedpano", "/krpano/embedpano.js");
    };

    //创建全景
    yp.extend.createPano = function (option) {
        this.option = $.extend(true, {}, yp.DEFAULT_OPTION, option);
        var kOption = {}, self = this;

        if (this.option.xml) {

        } else if (this.option.panoId) {
            this.option.xml = this.option.path + "/getXml?id=" + this.option.panoId + "&" + Date.parse(new Date());
        } else {
            logger.error("创建失败,无可用xml");
            return;
        }

        kOption.passQueryParameters = this.option.passQueryParameters;
        kOption.id = this.option.id;
        kOption.target = this.option.target;
        kOption.vars = this.option.vars;
        kOption.swf = this.option.swf;
        kOption.xml = this.option.xml;
        kOption.initvars = this.option.initvars;
        kOption.onerror = this.option.onerror;
        kOption.html5 = "prefer";
        // kOption.basepath = "http://pano.panocooker.com/krpano/"

        kOption.onready = function (krpano) {
            krpano.set("yt_pano", self);

            self.krpano = krpano;
            if (typeof self.option.onready === "function") {
                self.option.onready();
            }
        };

        this.element = $("#" + kOption.target);

        //防止无改div
        if (!this.element[0]) {
            this.element = $("<div/>").appendTo("body").attr("id", kOption.target);
        }

        this.element.css({width: this.option.width, height: this.option.height});
        $("body, html").css({width: this.option.width, height: this.option.height, margin: 0, padding: 0});

        logger.info(kOption);
        embedpano(kOption);
    };

    yp.DEFAULT_OPTION = {
        panoId: undefined,
        passQueryParameters: false,
        id: "krpanoSWFObject",
        target: "pano" + new Date().getTime(),
        vars: {
            "plugin[yt_pano].url": "/plugin.js",
            "plugin[yt_pano].keep": "true"
        },
        swf: "/krpano/krpano.swf",
        xml: undefined,
        initvars: {},
        onready: undefined,
        onerror: undefined,
        path: "http://pano.panocooker.com",
        width: "100%",
        height: "100%",
        callback: {
            onResize: function (width, height) {
                return false;
            },
            unloadplugin: function () {
                return;
            }
        }
    };

    window.YP = yp;
})(window);