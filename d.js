{
  var yp = new YP({xml:"c.xml"})

  var krpano = yp.krpano;

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
    var newa = this.krpano.addplugin("abc");
    plugin["abc"].url="/v2.0/images/addfile.png";

    console.log(newa)
  }

  var a = new Layer();

}