/**
 * Created by Administrator on 2016/5/6.
 */
//var vars = {};
//var xml = "/getXml?id=20700&style=&"+Date.parse(new Date());
//
//embedpano({swf:"/krpano/krpano.swf", xml:xml, target:"panoView",  html5:"prefer", passQueryParameters:true, vars:vars, id:"krpanoSWFObject"});
//
//if(document.domain.indexOf("duc.cn")>-1){
//    document.domain = "duc.cn";
//} else if(document.domain.indexOf("panocooker.com")>-1){
//    document.domain = "panocooker.com";
//}

(function (window, undefined) {
    var yp = function (option) {
        //this.init();
        this.createPano(option);
    }

    yp.extend = yp.prototype;

    yp.extend.init = function () {
        function addScript(path) {
            var oHead = document.getElementsByTagName('HEAD').item(0);
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = path;
            oHead.appendChild(oScript);
        }

        addScript("/common/logger.js");
        addScript("/krpano/embedpano.js");
    }

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
        kOption.onready = function (krpano) {
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
        $("body, html").css({width: this.option.width, height: this.option.height});

        logger.info(kOption);
        embedpano(kOption);
    }

    yp.DEFAULT_OPTION = {
        panoId: undefined,
        passQueryParameters: false,
        id: "krpanoSWFObject",
        target: "pano" + new Date().getTime(),
        vars: {},
        swf: "/krpano/krpano.swf",
        xml: undefined,
        initvars: {},
        onready: undefined,
        onerror: undefined,
        path: "http://pano.panocooker.com",
        width: "100%",
        height: "100%"
    }

    window.YP = yp;
    window.YP.extend = yp.extend;
})(window)