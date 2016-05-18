define([
	'proxy',
	'http://code.duc.cn/src/c/login/index.js'
], function(proxy, Dialog){

	function X(){
		_this = this;
		var loginInfo;
		var callbacks = [];
		var dialog = false;
		var init = false;
		this.info = loginInfo;
		
		function ex(loginInfo){
			$.each(callbacks, function(k, v){
				var callback = callbacks[k];
				callback&&callback(loginInfo);
			});
		}

		proxy.getLoginInfo({
			async: false
		}, function(data){
			init = true;
			if(data.success){
				_this.info = loginInfo = data.data;
				ex(_this.info);
			} else if(dialog){
				this.loginDialog();
			}
		});

		this.isLogin = function(){
			return loginInfo? true:false;
		};

		this.login = function(callback, flag){
			if(this.isLogin() && init){
				callback&&callback(loginInfo);
			} else if(init){
				if(flag == true){
					this.loginDialog();
				} else if(typeof flag === "function"){
					flag();
				}
			} else {
				callbacks.push(callback);
				if(flag == true){
					dialog = true;
				} else if(typeof flag === "function"){
					flag();
				}
			}
		};

		this.loginDialog = function(){
			if(document.domain.indexOf("duc.cn")>-1){
				new Dialog({
		          	type: 'dialog',
		          	title: "login"
		        }, function(data){
		        	if(data.success){
		          		_this.info = loginInfo = data.data;
						ex(_this.info);
		        	} else {
		        		alert(data.errMsg);
		        	}
		        });
			} else if(document.domain.indexOf("panocooker.com")>-1){
				window.location.href = "http://login.panocooker.com/?redirectURL=" + window.location.href
	        }
		};
	}

	return new X();
});