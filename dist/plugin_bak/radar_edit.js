/* krpano 1.18.2 radar plugin (build 2014-12-18) */
var krpanoplugin = function() {
    this.mousedown = function(b) {
        q = !0;
        m(b);
        c.mouse && (window.addEventListener("mousemove", m, !0), window.addEventListener("mouseup", j, !0));
        c.touch && (window.addEventListener(c.touchmove, m, !0), window.addEventListener(c.touchcancel, j, !0), window.addEventListener(c.touchend, j, !0));
        down = true;
    }
    function j() {
        c.mouse && (window.removeEventListener("mousemove", m, !0), window.removeEventListener("mouseup", j, !0));
        c.touch && (window.removeEventListener(c.touchmove, m, !0), window.removeEventListener(c.touchcancel, j, !0), window.removeEventListener(c.touchend, j, !0));
        down = false;

        if(typeof window.radar.mouseup === "function" && !down){
            window.radar.mouseup(a);
        }
    }
    function m(b) {
        if (null == f) j(b);
        else if (null != g) {
            b && (b.preventDefault(), b.stopImmediatePropagation(), b.stopPropagation());
            var a, d = a = 0,
            e = g.svg.parentNode.getBoundingClientRect();
            c.touch ? (b = b.changedTouches ? b.changedTouches: [b], 0 < b.length && (d = b[0], a = Math.round(d.clientX - e.left), d = Math.round(d.clientY - e.top))) : (a = Math.round(b.clientX - e.left), d = Math.round(b.clientY - e.top));
            a = 180 * Math.atan2(d - 0.5 * z * f.stagescale, a - 0.5 * A * f.stagescale) / Math.PI;
            a -= n;
            if (!0 == q) B = a - Number(f.view.hlookat),
            q = !1;
            else {
                currheading = a;

                for (a -= B; 180 < a;) a -= 360;
                for (; - 180 > a;) a += 360;

                //当编辑时,不更改
                if(!editmode) {
                    f.view.hlookat = a
                } else {
                    var s = a + n - Number(f.view.hlookat);

                    for (; 180 < s;) s -= 360;
                    for (; - 180 > s;) s += 360;
                    plugin.heading = s;
                }
            }

            h = !0


        }
    }
    function C() {
        var b = l / 2 * f.stagescale;
        2E3 < b && (b = 2E3);
        var a = Math.ceil(2 * b),
        c = 2 + 2 * p + a;
        if (c != D) {
            D = c;
            var e = g.svg;
            e.setAttribute("width", c);
            e.setAttribute("height", c);
            e.style.left = (a - c >> 1) + "px";
            e.style.top = (a - c >> 1) + "px";
            h = !0
        }
        a = n + r - 0 + f.view.hlookat; 
        currheading = a - r;

        e = f.view.hfov;
        s && (e = -e);
        d && d.sprite && (d.sprite.style.pointerEvents = "none");
        var k = g.path.style;
        k.pointerEvents = d.enabled ? "visiblePainted": "none";
        k.cursor = d.handcursor ? "pointer": "default";
        if (0.01 < Math.abs(a - E) || 0.02 < Math.abs(e - F)) E = a,
        F = e,
        h = !0;
        h && (h = !1, g.setstyle(t, p, u, v, w), g.drawpie(c / 2 - 0.5, c / 2 - 0.5, b, a - 0.5 * e, a + 0.5 * e))


        if(typeof window.radar.mousemove === "function"){
            window.radar.mousemove(a);
            //console.log("a", a, "currheading", currheading, "x", a - 0.5 * e);
        }

        if(typeof window.radar.mousedown === "function" && down){
            window.radar.mousedown(a);
        } 
    }
    window.radar = {};
    var plugin = null;
    var down = false;
    var editmode=null;
    var currheading=0;
    var onmousemove;
    var f = null,
    d = null,
    x = null,
    c = null,
    g = null,
    l = 256,
    A = 256,
    z = 256,
    n = 0,
    r = 90,
    s = !1,
    v = 16777215,
    t = 16777215,
    w = 0.5,
    u = 0.3,
    p = 0,
    q = !1,
    B = null,
    h = !0,
    G = null,
    D = -1,
    E = 0,
    F = 0;
    this.registerplugin = function(b, a, j) {
        f = b;
        plugin = d = j;
        if ("1.18" > f.version) f.trace(3, "Radar Plugin - too old krpano version (min. 1.18)"),
        d = f = null;
        else {
            x = f.device;
            c = x.browser.events;
            d.registerattribute("heading", 0,
            function(a) {
                n = Number(a);
                h = !0
            },
            function() {
                return n
            });
            d.registerattribute("headingoffset", 90,
            function(a) {
                r = Number(a);
                h = !0
            },
            function() {
                return r
            });
            d.registerattribute("invert", !1,
            function(a) {
                s = "true" == String(a).toLowerCase();
                h = !0
            },
            function() {
                return s
            });
            d.registerattribute("fillcolor", 16777215,
            function(a) {
                v = parseInt(a);
                h = !0
            },
            function() {
                return v
            });
            d.registerattribute("linecolor", 16777215,
            function(a) {
                t = parseInt(a);
                h = !0
            },
            function() {
                return t
            });
            d.registerattribute("fillalpha", 0.5,
            function(a) {
                w = Number(a);
                h = !0
            },
            function() {
                return w
            });
            d.registerattribute("linealpha", 0.3,
            function(a) {
                u = Number(a);
                h = !0
            },
            function() {
                return u
            });
            d.registerattribute("linewidth", 0,
            function(a) {
                p = Number(a);
                h = !0
            },
            function() {
                return p
            });
            d.registerattribute("editmode", false,
            function(a) {
                q = !0;
                editmode = Boolean(a);
                h = !0
            },
            function() {
                return editmode
            });
            d.registerattribute("currheading", 0,
            function(a) {
                currheading = Number(a);
                h = !0
            },
            function() {
                return currheading
            });

            d.registerattribute("onmousemove", 0,
            function(a) {
                onmousemove = a;
                h = !0
            },
            function() {
                return onmousemove
            });

            d.registercontentsize(l, l);
            j = a = l;
            var e = function(a) {
                return "rgb(" + (a >> 16 & 255) + "," + (a >> 8 & 255) + "," + (a & 255) + ")"
            };
            b = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            b.setAttribute("width", a);
            b.setAttribute("height", j);
            b.style.position = "absolute";
            b.style.left = "0px";
            b.style.top = "0px";
            var k = document.createElementNS("http://www.w3.org/2000/svg", "path");
            b.appendChild(k);
            a = {};
            a.svg = b;
            a.path = k;
            a.setstyle = function(a, b, d, c, f) {
                k.setAttribute("stroke", e(a));
                k.setAttribute("stroke-width", b);
                k.setAttribute("stroke-opacity", d);
                k.setAttribute("fill", e(c));
                k.setAttribute("fill-opacity", f)
            };
            a.drawpie = function(a, b, d, c, e) {
                var f, g;
                c > e && (f = e, e = c, c = f);
                c = c * Math.PI / 180;
                e = e * Math.PI / 180;
                g = e - c;
                f = (c + e) / 2;
                var h = g > Math.PI ? 1 : 0;
                g >= 2 * Math.PI && (g = 2 * Math.PI - 0.01);
                c = f - g / 2;
                e = f + g / 2;
                f = a + d * Math.sin(c);
                c = b - d * Math.cos(c);
                g = a + d * Math.sin(e);
                e = b - d * Math.cos(e);
                k.setAttribute("d", "M " + a + "," + b + " L " + f + "," + c + " A " + d + "," + d + " 0 " + h + " 1 " + g + "," + e + " Z")
            };
            g = a;
            plugin.registerattribute("child" ,g);
            d._assignEvents(g.path);
            g.path.kobject = d;
            d.sprite.style.pointerEvents = "none";
            d.sprite.appendChild(g.svg);
            c.mouse && g.path.addEventListener("mousedown", this.mousedown, !0);
            c.touch && g.path.addEventListener(c.touchstart, this.mousedown, !0);
            G = setInterval(C, 1E3 / 30);

            console.log(111);
        }
    };
    this.unloadplugin = function() {
        if (f && d) {
            clearInterval(G);
            try {
                g.path.kobject = null,
                d.sprite.removeChild(g.svg)
            } catch(b) {}
            f = d = null
        }
    };
    this.onresize = function(b, a) {
        A = b;
        z = a;
        l = Math.max(b, a);
        h = !0;
        C();
        g.path.style[x.browser.css.transform] = "scale(" + (b / l).toFixed(6) + "," + (a / l).toFixed(6) + ")";
        return ! 1
    }
};