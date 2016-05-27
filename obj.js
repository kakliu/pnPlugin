!function (window, undefined)  {
    function A() {
        this.init();
    }

    A.prototype.init = function(){
        console.log("this is init")
    }


    A.prototype.creat = function(){
        console.log(this);
    }

    window.A = A;
}(window)

    A.prototype.Fn = {
        say : function(){
            console.log("this is say");
        },
        end : function() {
            console.log("is end");
        }
    }