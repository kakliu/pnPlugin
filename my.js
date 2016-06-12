(function(win){
    var krpano;
    var a = "this a";
    var krpano = YP.krpano;

    function Edit(a,b) {
        this.a = a;
        this.b = b;
        this.init();
    }

    var fn = Edit.prototype;

    fn.init = function(){
        one();
    }

    win.updata = function()  {
        console.log("abc");
    }

    fn.adds = function(x,y) {
        b = this.b;
        krpano.call("adds("+x+","+y+")");
        console.log(a,b);
        this.addlayer();
    }

        
    fn.addlayer = function(c,d) {
        var mapa;
        mapa = krpano.addlayer(mapa);
        mapa.ulr = "/v2.0/images/erweima.png";
        mapa.align = "topleft";
        mapa.x = 100;
        mapa.y = 0;
        mapa.zorder = 1;
        mapa.keep = true;
    }



    function one() {
        console.log(krpano);
        return {a:"a",b:"b"}
    }

    function addLayer() {



    }

    $(function(){
        setTimeout(function(){
            console.log($("#ypView"));
            $("#ypView").append("<h1>this is title</h1>");

    var funs = {}

    funs.edit = function(){
        krpano = this.krpano;
        return new Edit("a","b");
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



})(window)

