(function(win){

    YP.extend.snow = function() {
        var _this = this;
        return {
            a: function(name) {
                
                _this.krpano.call(name + "()")
            },
            b: function() {
                console.log("is b");
            }
        }
    }
    $(function(){
        setTimeout(function(){
            console.log($("#ypView"));
            $("#ypView").append("<h1>this is title</h1>");

            $("h1").on("click",function(){
                console.log("--++--")
            })

        },1000)

    })


})(window)

