;(function (win) {
    console.log("start is win");
    var c = "this is abouc "
    window.tool = new function(){
        this.b = function () {
            console.log("this is b.");
        }

        this.c = function () {
            console.log(c)
        }
    }

    var Fn = function() {
        this.a();

    }
    Fn.abc = function(){
        console.log(this)
    }
    // var V;

    function X() {
        self = this
        _this = V;
        self.a();
        console.log(_this.abc());
    }

    X.prototype.abc = "abc";

    X.prototype.a = function() {
        console.log(self.abc);
        _this.abc()
    }
    var V = {
        abc: function() {
            return "v-abc"
        }
    }

    var a = new X();


    V.a = a;

    var a = "2323"
    var b = "this b"

    Fn.prototype = {
        a: function(){
            return Fn.abc();
        },
        b: function () {
            return b
        }
    }

    win.fn = new Fn();

    $(function(){
        var e = $("<div>wer<div/>")
        e = $("<div />").appendTo("body").attr("id","pano")
    })


function baz() {
    // 当前调用栈是：baz
    // 因此，当前调用位置是全局作用域

    console.log( "baz" );
    bar(); // <-- bar的调用位置
}

function bar() {
    // 当前调用栈是baz -> bar
    // 因此，当前调用位置在baz中

    console.log( "bar" );

   foo(); // <-- foo的调用位置
}

function foo() {
    // 当前调用栈是baz -> bar -> foo
    // 因此，当前调用位置在bar中

    console.log( "foo" );
}

baz(); // <-- baz的调用位置”





})(window)