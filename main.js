(function (window, undefined) {
    window.codePath = "";

    var yp = function (option) {
        this.init();
        this.createPano(option);
    };

    yp.extend = yp.prototype;

    yp.callback = function (funs) {

        return function () {
            funs.krpano = this.krpano;
<<<<<<< HEAD
            funs.yp = this;
=======
            funs.option = this.option;
            funs.yp = this;
            var name = arguments[0];
            var slice = [].slice;
            var args = slice.call(arguments, 1);
>>>>>>> 39a4dc85c4fa4a28a4626c17d0b354737596eb6a

            if (name && funs[name]) {
                return funs[name].apply(funs, args);
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
        loadJS("embedpano", codePath + "/krpano/embedpano.js");
        loadJS("template", codePath + "/common/template.js");
        loadJS("logger", codePath + "/common/logger.js");
        loadJS("moveObj", codePath + "/common/move.js");
    };

    //创建全景
    yp.extend.createPano = function (option) {
        this.option = $.extend(true, {}, yp.DEFAULT_OPTION, option);
        var kOption = {}, self = this;

        if (this.option.xml) {

        } else if (this.option.panoId) {
            this.option.xml = this.option.path + "/getXml2?id=" + this.option.panoId + "&" + Date.parse(new Date());
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

            // self.maps("init");
        };

        $(function(){
            self.element = $("#" + kOption.target);
            //防止无改div
            if (!self.element[0]) {
                self.element = $("<div/>").appendTo("body").attr("id", kOption.target);
            }
            self.element.css({width: self.option.width, height: self.option.height});
            $("body, html").css({width: self.option.width, height: self.option.height});
            $("body").append("<div id='elementView'></div><i class='closeElementView'></i>");
            logger.info(kOption);
            embedpano(kOption);
        })
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
        swf: codePath + "/krpano/krpano.swf",
        xml: undefined,
        initvars: {STATIC:"/static/"},
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

    yp.error = function(msg){
        alert(msg);
    };
    window.YP = yp;
})(window);