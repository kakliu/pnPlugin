{
  var funs = {};

  var krpano = funs.krpano;

  function Layer() {
    this.init();
  }

  var fn = Layer.prototype;

  fn.init = function(op){
    console.log("init");
    addLayer();
  }

  fn.add = function(){
    addLayer();
  }

  function addLayer() {
    console.log(krpano);
    var newa = krpano.addplugin("abc");
    plugin["abc"].url="/v2.0/images/addfile.png";

    console.log(newa)
  }

  var a = new Layer();
  YP.extend.maps = YP.callback(funs);
}