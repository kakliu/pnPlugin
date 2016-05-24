(function(window, undefined) {
    var funs = {
		//补地图片
		setNadirlogo:function(pic,url,type){
			this.krpano.call("skin_set_nadir("+pic+","+url+","+type+")");
		},
		getNadirlogo:function(){
			var v = {};
			var flag = this.krpano.get('skinSetting.nadirlogo');
			var defaultNadirlogo = this.krpano.get('skinSetting.nadirlogo_default_url');
			var defaultOpenUrl = this.krpano.get('skinSetting.nadirlogo_default_open_url');
			var nadirlogo = this.krpano.get('skinSetting.nadirlogo_url)');
			var openUrl = this.krpano.get('skinSetting.nadirlogo_open_url');
			var type = this.krpano.get('skinSetting.nadirlogo_type');
			
			if(flag){
				v.type = type;
				v.url = nadirlogo;
				v.link = openUrl;
			}else{
				v.type = 2;
				v.url = defaultNadirlogo;
				v.link = defaultOpenUrl;
			}
			
			return v;
		},
		nadirlogSwithVisible: function(flag){//显示隐藏补地图片
			this.krpano.call("skin_nadirlogo_swith_visible("+flag+")");
		},
		skin_nadirlogo_resize: function(){//重置补地图片
			this.krpano.call("skin_nadirlogo_resize()");
		},
		getdefaultnadir: function(){//获取补地默认logo和link
			var x = {};
			x.url = this.krpano.get("skinSetting.nadirlogo_default_url");
			x.link = this.krpano.get("skinSetting.nadirlogo_default_open_url");
			return x;
		}

    };



    YP.extend.nadir = YP.callback(funs);

})(window)
