(function(window, undefined) {
    var funs = {};
    var link;
    var options = {};

    funs.name = "link";

    options.icon = "/eg/examples/images/html5logo80.png";

    funs.init = function() {
        link = new this.yp.hotspot("register","link",options);
    }

    funs.show = function() {
        link.addHotspot({x:100,y:100});
    }

    funs.addHotspot = function() {
        var hotspotName = "hotspot[flying]";
        this.krpano.addhotspot('flying');
        hotspot = this.krpano.get(hotspotName);
        hotspot.ath = 0;
        hotspot.atv = 0;
        hotspot.keep = true;
        hotspot.url = "/v2.0/images/backt_1.png";
        hotspot.onloaded = onloaded;
        hotspot.visible = true;

        function onloaded() {
            console.log(hotspot.sprite);

            // console.log(hotspot.createSprite);
            var element = "<div>thisisflying</div>";
            $(hotspot.sprite).append(element);
        }


    }


    // console.log(link);

    YP.extend.links = YP.callback(funs);

})(window)