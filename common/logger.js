(function(){
	window.logger = new function(){
		var levels = this.levels = {
				debug: 1,
				log: 2,
				info: 3,
				warn: 4,
				error: 5
			},
			thresholdInt = levels.error;

		this._log = function(level, fn, error){
			if(this._isDisabled(level) || typeof fn !== "function"){
				return;
			}

			fn();

			if(error) {
				throw error;
			}
		}

		this._isDisabled = function(level){
			return thresholdInt > level;
		}

		this.setThresholdInt = function(level){
			if(typeof level === "number" && levels.error >= level){
				thresholdInt = level;
			}

			if(typeof level === "string"){
				switch(level){
					case "debug":
						thresholdInt = levels.debug;
						break;
					case "log":
						thresholdInt = levels.log;
						break;
					case "info":
						thresholdInt = levels.info;
						break;
					case "warn":
						thresholdInt = levels.warn;
						break;
					case "error":
						thresholdInt = levels.error;
						break;
				}
			}
		}

		this.debug = function(value, error){
			this._log(levels.debug, function(){
				console.trace();
				console.debug(value);
			}, error);
		};

		this.log = function(value, error){
			this._log(levels.log, function(){
				console.trace();
				console.log(value);
			}, error);
		};

		this.info = function(value, error){
			this._log(levels.info, function(){
				console.trace();
				console.info(value);
			}, error);
		};

		this.warn = function(value, error){
			this._log(levels.warn, function(){
				console.trace();
				console.warn(value);
			}, error);
		};

		this.error = function(value, error){
			this._log(levels.error, function(){
				console.trace();
				console.error(new Error(value));
			}, error);
		};
	}
})(window)