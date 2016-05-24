(function(window, undefined) {
	var funs = {};
	funs.playMusic = function(url) {
		this.krpano.call("skin_music_url(" + url + ")");
	};
	funs.pauseMusicToggle = function() {
		this.krpano.call("pausesoundtoggle(bgsnd)");
	};
	funs.stopMusic = function() {
		this.krpano.call("stopsound(bgsnd)");
	};
	funs.stopAllMusic = function() {
		this.krpano.call("stopallsounds(true)");
	};
	YP.extend.music = YP.callback(funs);
})(window)