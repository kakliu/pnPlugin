(function (factory) {
	if (typeof define === "function" && define.amd) {
        // AMD模式
        define('proxy', ["jquery"], factory);
    } else {
        // 全局模式
        window.proxy = factory(jQuery);
    }
}(function($, undefined){
	var baseHost = "//pano.panocooker.com";
	var url = {
		getPluginByPanoId: baseHost +  "/plugin/getPluginByPanoId",
		getPluginNotOrder: baseHost +  "/plugin/getPluginNotOrder",
		getPanoList: baseHost +  "/pano/query",
		release: baseHost +  "/pano/release",
		unrelease: baseHost +  "/pano/unrelease",
		deletePano: baseHost +  "/pano/delete",
		setSceneViewById: baseHost +  "/setSceneViewById",
		setLimitView: baseHost +  "/setLimitView",
		panoDetail: baseHost +  "/pano/detail",
		groupCreate: baseHost +  "/group/create",
		groupUpdate: baseHost +  "/group/update",
		groupDelete: baseHost +  "/group/delete",
		groupSceneSortIndex: baseHost +  "/groupScene/sortIndex",
		groupSortIndex: baseHost +  "/groupScene/sortIndex",
		panoDelete: baseHost +  "/pano/delete",
		panoUpdate: baseHost +  "/pano/update",
		panoUploadScene: baseHost +  "/pano/upload",
		panoUploadByPanoId: baseHost +  "/pano/uploadByPanoId",
		panoUploadSceneByCloudFileId: baseHost +  "/pano/uploadByCloudFileId",
		panoUploadInEdit:baseHost + "/pano/uploadByEdit",
		sceneDelete: baseHost +  '/pano/scene/delete',
		nadirlogoGet: baseHost +  '/nadirlogo/getByPanoId',
		nadirlogoEdit: baseHost +  '/setNadirLogo',
		hotspotAdd: baseHost +  '/api/hotspot/add',
		hotspotUpdate: baseHost +  '/api/hotspot/update',
		hotspotDelete: baseHost +  '/api/hotspot/delete',
		hotspotAddLink: baseHost +  '/api/hotspot/addlink',
		addHotspot: baseHost + '/api/hotspot/resource/edit',
		componentSwitch: baseHost +  '/switchcomponents/setSwitchByPanoId',
		componentGet: baseHost +  '/switchcomponents/getByPanoId',
		mapsGet: baseHost +  '/panomap/selectByPanoId',
		mapAdd: baseHost +  '/panomap/addsingle',
		mapDelete: baseHost +  '/panomap/deleteSubmap',
		mapUpdate: baseHost +  '/panomap/updateSubmap',
		mapRadarAdd: baseHost +  '/panomap/addMapradar',
		mapRadarUpdate: baseHost +  '/panomap/updateMapradar',
		mapRadarDelete: baseHost +  '/panomap/deleteMapradar',
		fileuoload: baseHost +  "/file/upload",
		sort: baseHost + "/pano/sortIndex",
		progress: baseHost +  "/queryProgressbar",
		progressNew: "http://image.panocooker.com/pano/progress",
		pluginIsShow: baseHost +  '/plugin/isShow',
		pluginQuery: baseHost +  '/plugin/query',
		pluginrelAdd: baseHost +  '/pluginrel/add',
		commentAdd: baseHost +  '/comment/add',
		commentGet: baseHost +  '/comment/getCommentList',
		commentUpdate: baseHost + '/comment/move',
		getLoginInfo: baseHost +  '/user/getJsonUserById',
		updateSpot: baseHost + '/api/hotspot/update',
		snowSwitch: baseHost + '/effect/switch',
		snowShare: baseHost + '/effect/share',
		snowAdd: baseHost + '/effect/add',
		brand:'http://shop2.panocooker.com/app/getBrandStory',
		contact: baseHost + '/contact/detail',
		activity:'http://shop2.panocooker.com/store/getActivityList',
		commodity:'http://shop2.panocooker.com/store/getGoodsList',
		Zambia: baseHost + '/count/getInfo',
		postZan: baseHost + '/count/addSupport',
		shopZan:'http://shop2.panocooker.com/app/goods/addPraise'
		
	};
	
	function X(){
		this.url = url;
	}
	
X.prototype = {
		updateDate: function(options){
			//设置token信息
			var userId = getQueryString("UI");
			var timestamp = getQueryString("TS");
			var accessToken = getQueryString("access_token");
			if(!options){
				options = {};
			}

			if (userId && timestamp && accessToken) {
				if (!options.data) {
					options.data = {};
				}

				options.data.UI = userId;
				options.data.TS = timestamp;
				options.data.access_token = accessToken;
			}

			return options;
		},
		ajax: function(op){
			var default_options = {
				type: "post",
				url: undefined,
				dataType: "json",
				data: undefined,
				async: true,
				success: undefined,
				traditional: true,
				error: function (XMLHttpRequest, textStatus, errorThrown){
		        	
		        }
			}
			
			var options = this.updateDate($.extend(true, {}, default_options, op));

			$.ajax(options);
		},
		get: function(op, success, error, async){
			op.type = "get";
			
			if(typeof success === "function"){
				op.success = success;
			}
			
			if(typeof error === "function"){
				op.error = error;
			}
			
			if(async == false){
				op.async = false;
			} else if(op.data.async == false){
				op.data.async = null;
				op.async = false; 
			}
			
			this.ajax(op);
		},
		post: function(op, success, error, async){
			op.type = "post";
			
			if(typeof success === "function"){
				op.success = success;
			}
			
			if(typeof error === "function"){
				op.error = error;
			}
			
			if(async == false){
				op.async = false;
			} else if(op.data.async == false){
				op.data.async = null;
				op.async = false; 
			}
			
			this.ajax(op);
		},

		domain: '//pano.panocooker.com',
		
		getPluginByPanoId: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.getPluginByPanoId;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		getPluginNotOrder: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.getPluginNotOrder;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		getPanoList: function(op, fn, errorFn, async){
			var options = {};
			var default_options = {
				type: 1
			}

			var data = $.extend(true, {}, default_options, op);

			options.data = data;
			options.url = url.getPanoList;
			this.get(options, fn, errorFn, async);
		},
		release: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.release;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		unrelease: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.unrelease;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		deletePano: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.deletePano;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		setSceneViewById:function(op, fn, errorFn, async){
			var options = {};
			options.url = url.setSceneViewById;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		setLimitView:function(op, fn, errorFn, async){
			var options = {};
			options.url = url.setLimitView;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		panoDetail: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.panoDetail;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		groupCreate: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.groupCreate;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		groupUpdate: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.groupUpdate;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		groupDelete: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.groupDelete;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		groupSceneSortIndex: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.groupSceneSortIndex;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		groupSortIndex: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.groupSortIndex;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		panoDelete:function(op, fn, errorFn, async){
			var options = {};
			options.url = url.panoDelete;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		panoUpdate: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.panoUpdate;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		panoUploadScene: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.panoUploadScene;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		panoUploadSceneByCloudFileId: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.panoUploadSceneByCloudFileId;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		panoUploadInEdit: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.panoUploadInEdit;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		sceneDelete: function(op, fn, errorFn, async){
			var options = {};
			options.url = url.sceneDelete;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		nadirlogoGet: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.nadirlogoGet;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		nadirlogoEdit: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.nadirlogoEdit;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		hotspotAdd: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.hotspotAdd;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		hotspotUpdate: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.hotspotUpdate;
			options.data = op;
			
			this.post(options, fn, errorFn, async);
		},
		hotspotDelete: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.hotspotDelete;
			options.data = op;
			this.post(options, fn, errorFn, async);
		}, 
		hotspotAddLink: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.hotspotAddLink;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		addHotspot: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.addHotspot;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		componentSwitch: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.componentSwitch;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		componentGet: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.componentGet;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		mapsGet:  function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.mapsGet;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		mapAdd: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.mapAdd;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		mapUpdate: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.mapUpdate;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		mapDelete: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.mapDelete;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		mapRadarAdd: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.mapRadarAdd;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		mapRadarUpdate: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.mapRadarUpdate;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		mapRadarDelete: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.mapRadarDelete;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		progress: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.progress;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		progressNew: function(op, fn, errorFn, async) {
			var options = {};
			var data = {};
			options.data = data;

			options.xhrFields = {
				withCredentials: true//支持cookie跨域
			};
			options.crossDomain = true;
			//options.withCredentials = true;
			options.url = url.progressNew +'/'+ op.toString();
			this.get(options, fn, errorFn, async);
		},
		pluginIsShow: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.pluginIsShow;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		pluginQuery: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.pluginQuery;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		pluginrelAdd: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.pluginrelAdd;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		commentAdd: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.commentAdd;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		commentUpdate: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.commentUpdate;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		commentGet: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.commentGet;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		getLoginInfo: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.getLoginInfo;
			options.data = op;
			this.get(options, fn, errorFn, async);
		},
		updateSpot: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.updateSpot;
			options.data = op;
			this.get(options, fn, errorFn, async);
		},

		snowSwitch: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.snowSwitch;
			options.data = op;
			this.get(options, fn, errorFn, async);
		},
		snowShare: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.snowShare;
			options.data = op;
			this.get(options, fn, errorFn, async);
		},
		snowAdd: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.snowAdd;
			options.data = op;
			this.get(options, fn, errorFn, async);
		},
		brand: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.brand;
			options.data = op;
			options.dataType = "jsonp";
			this.get(options, fn, errorFn, async);
		},	
		contact: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.contact;
			options.data = op;
			this.get(options, fn, errorFn, async);
		},
		getActivity: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.activity;
			options.data = op;
			options.dataType = "jsonp";
			this.get(options, fn, errorFn, async);
		},
		commodity: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.commodity;
			options.data = op;
			options.dataType = "jsonp";
			this.get(options, fn, errorFn, async);
		},
		Zambia: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.Zambia;
			options.data = op;
			this.get(options, fn, errorFn, async);
		},
		postZan: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.postZan;
			options.data = op;
			this.post(options, fn, errorFn, async);
		},
		shopZan: function(op, fn, errorFn, async) {
			var options = {};
			options.url = url.shopZan;
			options.data = op;
			options.dataType = "jsonp";
			this.get(options, fn, errorFn, async);
		},
		panoUploadByPanoId: function (op, fn, errorFn, async) {
			var options = {};
			options.url = url.panoUploadByPanoId;
			options.data = op;
			this.get(options, fn, errorFn, async);
		}
	}
	
	return new X();
}))