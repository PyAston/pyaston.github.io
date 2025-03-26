/**
 * 抽奖领取平台前端js文件
 * @author tiantian
 */
if(location.href.indexOf('qq.com') >= 0){
	document.domain = 'qq.com';
}

(function(){
	var JS_FILE_LIST = {
		'LoginManager' : 'http://ossweb-img.qq.com/images/js/login/loginmanagerv3.js', //需要加载登录js
		'RoleSelector' : 'http://ossweb-img.qq.com/images/js/roleselector/roleselectorv3.js', //角色选择
		'$onload' : 'http://ossweb-img.qq.com/images/script/com/qq/basic/basic.js', //只有新版本才有这个对象
		'oss_base' : 'http://gameact.qq.com/comm-htdocs/js/oss_base.js', //oss_base		
		'ProvinceCitySelect' : 'http://gameact.qq.com/comm-htdocs/js/province_city_select.js'  //选择身份和城市			
	};
	
	for(var i in JS_FILE_LIST){
		if(!window[i]){
			window[i] = {};
			document.write(unescape('%3Cscript src="'+JS_FILE_LIST[i]+'" type="text/javascript"%3E%3C/script%3E'));
		}
	}
})();

if(typeof(LotteryManager) == 'undefined'){
	LotteryManager = {};
}

LotteryManager.alert = function(str, fun){
	var oneFloater = FloaterManager.init({
		'isShowClose': true,
		'style' : 1
	}, false);
	oneFloater.alert({
		'title': '提示信息',
		'content' : str+''
	}, fun);
};

//所有的数据缓存。
LotteryManager._DataService = {
	'ALL_JOIN_GIFT_OBJECT' : [], //所有参与的总人数和礼包人数。
	'ALL_LOTTERY_OBJECT' : {} //取得所有活动的基本信息
};
/**========================================================== 提供的公共方法JS ==========================================================**/
//加载该页面的所有活动基本信息。
LotteryManager._loadAllLotteryObject = function(activityIdList, callback){
	if(typeof(callback) != 'function'){
		callback = function(obj){
			alert('LotteryManager.loadAllLotteryObject：' + JsonObject.toString(obj));
		};
	}
	var _this = this;
	
	//设置一个递归函数来处理结果
	var activityId = activityIdList + '';
	var arrActivityId = activityId.split('|');
	
	if(arrActivityId.length == 0){
		callback([]);
		return;
	}
	
	if(arrActivityId.length == 1 && LotteryManager._DataService.ALL_LOTTERY_OBJECT[arrActivityId]){
		callback(LotteryManager._DataService.ALL_LOTTERY_OBJECT[arrActivityId]);
		return;
	}
	
	if(!JsonObject.isArray(LotteryManager._ALLLOTTERYLISTCALLBACK)){
		LotteryManager._ALLLOTTERYLISTCALLBACK = [];
	}
	LotteryManager._ALLLOTTERYLISTCALLBACK.push(callback);
	
	var _run = function(param){
		for(var p = 0; p < LotteryManager._ALLLOTTERYLISTCALLBACK.length; p++){
			if(typeof(LotteryManager._ALLLOTTERYLISTCALLBACK[p]) == 'function'){
				LotteryManager._ALLLOTTERYLISTCALLBACK[p](param);
				LotteryManager._ALLLOTTERYLISTCALLBACK[p] = null;
			}
		}
	};

	var activityId = activityIdList + '';
	var arrActivityId = activityId.split('|');
	if(arrActivityId.length == 0){
		_run([]);
		return;
	}

	var getAllLotteryObject = function(){
		var _all = [];
		for(var i = 0; i < arrActivityId.length; i++){
			var oneData = LotteryManager._DataService.ALL_LOTTERY_OBJECT[''+arrActivityId[i]];
			_all.push(oneData);
		}
		if(_all.length == 1){
			_run(_all[0]);
			return;
		}
		_run(_all);
	};

	//设置一个递归函数来处理结果
	var _allLen = arrActivityId.length;
	var currentIndex = 0;

	var _getAllFunction = function(){
		//如果成功就直接返回
		if(currentIndex >= _allLen){
			getAllLotteryObject();
			return;
		}
		
		var _activityId = arrActivityId[currentIndex] + '';
		currentIndex++;

		var oneData = LotteryManager._DataService.ALL_LOTTERY_OBJECT[_activityId];
		if(oneData){
			_getAllFunction();
			return;
		}
		
		//表示正在加载中，就没必要重复加载了。
		if(LotteryManager._DataService.ALL_LOTTERY_OBJECT[_activityId] === null){
			return;
		}
		//表示没有找到的对象。
		LotteryManager._DataService.ALL_LOTTERY_OBJECT[_activityId] = null;
		
		var _url = 'http://gameact.qq.com/act/lottery_ms/act_info/'+_activityId+'.js';
		FileLoadManager.ajaxRequest({
			'url' : _url,
			'dataType' : 'object',
			'dataTypeName' : 'LotteryActivityObject_' + _activityId,
			'showLoadingStr' : '',
			'onLoadSuccessEvent' : function(){
				if(typeof(window['LotteryActivityObject_' + _activityId]) == 'undefined'){
					return;
				}
				var tempLottery = window['LotteryActivityObject_' + _activityId];
				tempLottery = JsonObject.decode(tempLottery);
				if(tempLottery && tempLottery.iActivityId){
					LotteryManager._DataService.ALL_LOTTERY_OBJECT[_activityId] = tempLottery;
				}
				_getAllFunction();
			}
		});
	};
	
	_getAllFunction();
};

//根据不同积分ID查询多个积分总和和剩余数; arrChannelId多个用|分隔
LotteryManager.getUserPointById = function(serviceType, arrChannelId, callback){
	if(!LoginManager.isLogin()){
		LoginManager.login();
		return;
	}
	
	var serviceType = serviceType+'' || '';
	var arrChannelId = arrChannelId+'' || '';
	if(!serviceType){
		alert('业务类型未传入');
		return;
	}
	//过滤掉不是数字的错误Id;
	arrChannelId = (arrChannelId+'').split('|');
	var newChannelId = [];
	for(var i = 0; i < arrChannelId.length; i++){
		var temp = arrChannelId[i];
		if(temp && !isNaN(temp)){
			newChannelId.push(temp);
		}
	}
	arrChannelId = newChannelId.join('|');
	if(!arrChannelId){
		alert('积分ID未传入');
		return;
	}
	if(typeof(callback) != 'function'){
		callback = function(resultObj){
			alert(JsonObject.toString(resultObj));
		};
	}


	//http://gameshop.qq.com/cgi-bin/jf/ShowLoginInfo.cgi?flag=qqgame&type=json&ichannel=223

	var submitData = {
		'sServiceType' : serviceType,
		'sChannelId' : arrChannelId
	};
	
	FileLoadManager.ajaxRequest({
		'url' : 'http://apps.game.qq.com/cgi-bin/lottery/queryUserJiFen.cgi?' + JsonObject.serialize(submitData),
		'dataType' : 'object', //返回的数据类型：object, function
		'dataTypeName' : 'queryUserJiFen_result', //如果dataTypeName设定成功以后的方法
		'showLoadingStr' : '',
		'onLoadCompleteEvent' : function(){
			if(queryUserJiFen_result.retCode != 0){
				alert(queryUserJiFen_result.retInfo);
				return;
			}
			var resultObj = {};
			arrChannelId = arrChannelId.split('|');
			for(var i = 0; i < arrChannelId.length; i++){
				var temp = arrChannelId[i];
				resultObj['' + temp] = {'iTotalNum' : 0, 'iAvailableNum' : 0};
			}

			var totalNum = queryUserJiFen_result.TotalNum;
			var availNum = queryUserJiFen_result.AvailableNum;
			if(arrChannelId.length == 1){
				resultObj[arrChannelId[0]].iTotalNum = totalNum;
				resultObj[arrChannelId[0]].iAvailableNum = availNum;
				callback(resultObj);
				return;
			}
			
			if(totalNum ){
				var arrTotal = totalNum.split('#');
				for(var i = 0; i < arrTotal.length; i++){
					var _id = arrTotal[i].split('-');
					if(_id.length == 2){
						if(typeof(resultObj['' + _id[0]].iTotalNum) == 'number'){
							resultObj['' + _id[0]].iTotalNum = _id[1]*1;
						}
					}
				}
			}

			if(availNum ){
				var arrTotal = availNum.split('#');
				for(var i = 0; i < arrTotal.length; i++){
					var _id = arrTotal[i].split('-');
					if(_id.length == 2){
						if(typeof(resultObj['' + _id[0]].iAvailableNum) == 'number'){
							resultObj['' + _id[0]].iAvailableNum = _id[1]*1;
						}
					}
				}
			}
			callback(resultObj);
		}
	});
};

//取得参加的总人数和取得礼包的人数
LotteryManager.getAllJoinAndGiftNumber = function(activityId, callback){
	if(typeof(callback) != 'function'){
		callback = function(obj){
			alert('该活动参加人数的对象为:' + JsonObject.toString(obj));
		};
	}
	var submitData = {
		'activityId' : activityId,
		'joinActNum' : 0,//参加活动人数
		'joinActTimes' : 0,//参与活动人次
		'getGiftNum' : 0 //取得礼包人数
	};

	var joinList = LotteryManager._DataService.ALL_JOIN_GIFT_OBJECT;
	if(joinList.length > 0){
		for(var i = 0; i < joinList.length; i++){
			var oneActivity = joinList[i];
			if(oneActivity.activityId == activityId){
				submitData = oneActivity;
				break;
			}
		}
		callback(submitData);
		return;
	}
	//如果没有则查询
	FileLoadManager.ajaxRequest({
		'url' : 'http://gameact.qq.com/act/lottery_ms/activityConditionSoFar.js',
		'dataType' : 'object', //返回的数据类型：object, function
		'dataTypeName' : '_MS_Statistic', //如果dataTypeName设定成功以后的方法
		'showLoadingStr' : '',
		'onLoadCompleteEvent' : function(){
			if(typeof(_MS_Statistic) == 'object' && _MS_Statistic instanceof Array){
				for(var i = 0; i < _MS_Statistic.length; i++){
					var _o = _MS_Statistic[i];
					var oneActivity = {
						'activityId' : _o.iActivityId,
						'joinActNum' : _o.iPeopleInvolved,
						'joinActTimes' : _o.iPeopleTotal,
						'getGiftNum' : _o.iPackageInvolved
					};
					LotteryManager._DataService.ALL_JOIN_GIFT_OBJECT.push(oneActivity);
					if(oneActivity.activityId == activityId){
						submitData = oneActivity;
					}
				}
			}
			callback(submitData);
		}
	});
	
};

/**========================================================== //公共方法 ==========================================================**/
LotteryManager.loadAllLotteryObject = LotteryManager._loadAllLotteryObject;


/**========================================================== //各模块方法JS ==========================================================**/

/**========================================================== 提供的主函数抽奖方法JS ==========================================================**/
LotteryManager.GetGiftMain = function(opt){
	this.option = {
		'activityId' : -1, //活动ID
		'onGetGiftSuccessEvent' : null, //取得礼包成功的方法
		'onGetGiftFailureEvent' : null, //取得礼包失败的方法
		'isQueryRole' : true, //是否需要查询角色信息(如果已获取角色信息，则将其设置为false)
		'outData' : {} //查询时，需要提交的外部的对象信息
	};
	
	this.config = {
		'gameId' : '',
		'isOnlyOneCdkey' : false,
		'isQueryRoleCache' : false, //查询角色是否cookie缓存上一个值
		'onBeginGetRoleEvent' : null, //开始查询角色方法
		'onBeginGetGiftEvent' : null, //开始抽奖按钮方法，默认ajaxLoading('请稍后，数据正在加载中。')
		'submitData' : '', //保存上传信息数据
		
		'_frequencyLimitTime' : 2000, //频率限制时间，单位为毫秒数
		'_clickStartTime' : +new Date, //记录开始点击的时间
		'_canClickBtn' : true, //是否可以点击按钮
		'codeContentId' : '', //验证码输入框的容器。
		'imageContentId' : '' //验证码图片的容器。
	};
	var _this = this;
	_this.option = $extend(_this.option, opt);
	_this.config = $extend(_this.config, opt);
	
	{//对参数进行检查
		if(!_this.option.activityId || isNaN(_this.option.activityId) || _this.option.activityId*1 <= 0){
			alert('活动ID设置错误，activityId ：' + _this.option.activityId);
			return;
		}
		if(typeof(_this.option.onGetGiftSuccessEvent) != 'function'){
			_this.setGetGiftSuccessEvent();
		}
		if(typeof(_this.option.onGetGiftFailureEvent) != 'function'){
			_this.setGetGiftFailureEvent();
		}
	}
	
	_this._loadJsFile(); //加载默认js文件
};


{//设置成功和失败的方法
	LotteryManager.GetGiftMain.prototype.setGetGiftSuccessEvent = function(onGetGiftSuccessEvent){
		var _this = this;
		if(typeof(onGetGiftSuccessEvent) == 'function'){
			_this.option.onGetGiftSuccessEvent = onGetGiftSuccessEvent;
			return;
		}

		_this.option.onGetGiftSuccessEvent = function(callbackObj){
			if(!callbackObj.sPackageName){
				LotteryManager.alert(retInf.retStr);
				return;
			}
			//如果是cdkey的话
			if(callbackObj.iPackageType == 2){
				LotteryManager.alert('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); alert(\'复制成功。\');">');
				return;
			}
			
			//实物
			var isRealGoods = false;
			if(callbackObj.iPackageType == 1){
				/*
				 * 0：虚拟游戏物品
				 * 1：实际物品，需要填写个人收货信息
				 * 2：cdkey
				 */
				isRealGoods = true;
			}
			
			var str = "恭喜您获得了 " + callbackObj.sPackageName + "!";
			if(callbackObj.iPackageType == 2){
				str = "恭喜您获得了 " + callbackObj.sPackageName + " : " + callbackObj.sPackageOtherInfo + "!";
			}
			if(isRealGoods){
				str += "请您准确填写个人信息，官方将有工作人员联系您。";
			}else{
				str += "请您注意查收！";
			}
			LotteryManager.alert(str, function(){
				if(isRealGoods){
					var activityId = callbackObj.iActivityId;
					//如果为实物，则弹出实物填写框。
					if(typeof(window["personInfo_" + activityId]) != 'undefined' && window["personInfo_" + activityId] instanceof LotteryManager.PersonInfo){
						setTimeout(function(){
							window["personInfo_" + activityId].show();
						}, 1000);
					}
				}
			});
		};
	};
	
	LotteryManager.GetGiftMain.prototype.setGetGiftFailureEvent = function(onGetGiftFailureEvent){
		var _this = this;
		if(typeof(onGetGiftFailureEvent) == 'function'){
			_this.option.onGetGiftFailureEvent = onGetGiftFailureEvent;
			return;
		}
		_this.option.onGetGiftFailureEvent = function(callbackObj){
			var errorInfo = {
				
			};
			if(errorInfo[''+callbackObj.retCode]){
				LotteryManager.alert(errorInfo[''+callbackObj.retCode]);
			}else{
				LotteryManager.alert(callbackObj.retInfo);
			}
		};
	};
}


{//外部方法
	//设置外部传入的数据，此数据将成为标准确定值。
	LotteryManager.GetGiftMain.prototype.setOutData = function(data){
		var _this = this;
		_this.option.outData = $extend(_this.option.outData, data);
	};
	//取得前一次提交的参数值
	LotteryManager.GetGiftMain.prototype.getSubmitData = function(){
		var _this = this;
		return _this.config.submitData;
	};
	// 取得Cookie中的大区、角色信息
	LotteryManager.GetGiftMain.getRoleFromCookie = function(iActivityId){
		if(!LoginManager.isLogin()){
			return null;
		}
		
		var queryStr = CookieManager.getCookie('GET_GIFT_ROLE_DATA');
		if(!queryStr){
			return null;
		}
		
		var roleObj = JsonObject.unserialize(queryStr);
		roleObj = JsonObject.decode(roleObj);

		var iUin = LoginManager.getUserUin();
		if(roleObj.iUin &&
			roleObj.iUin == iUin &&
			roleObj.iActivityId == iActivityId){
			var newRoleObj = {};
			newRoleObj.iUin = iUin;
			newRoleObj.sArea = roleObj.areaid;
			newRoleObj.sRoleId = roleObj.roleid;
			newRoleObj.sRoleName = roleObj.rolename;
			newRoleObj.iSex = roleObj.rolesex || '';
			newRoleObj.checkparam = roleObj.checkparam || '';
			newRoleObj.md5str = roleObj.md5str || '';
			return newRoleObj;
		}
		return null;
	};
	
	// 设置Cookie大区、角色信息
	LotteryManager.GetGiftMain.setRoleToCookie = function(opt, callback){
		if(!LoginManager.isLogin()){
			return false;
		}

		var option = {
			'iActivityId' : '',
			'gameId' : '',
			'outData' : null
		};
		option = $extend(option, opt);
		
		var iActivityId = option.iActivityId;
		var iUin = LoginManager.getUserUin();
	
		if(!iActivityId || !iUin){
			return false;
		}
	
		var setIntoCookie = function(roleData){
			var newData = {
				'areaid' : '',
				'areaname' : '',
				'roleid' : '',
				'rolename' : '',
				'rolesex' : '',
				'checkparam' : '',
				'md5str' : ''
			};
			newData = $extend(newData, roleData);
			
			{//默认设置
				newData['iActivityId'] = iActivityId;
				newData['iUin'] = iUin;
			}
			var queryStr = JsonObject.serialize(newData);
			CookieManager.setCookie('GET_GIFT_ROLE_DATA', queryStr, 60*12);//半天时间
		};
		
		var newRoleObj = option.outData;
		if(newRoleObj){
			var newData = {
				'areaid' : newRoleObj.sArea,
				'roleid' : newRoleObj.sRoleId,
				'rolename' : newRoleObj.sRoleName,
				'rolesex' : newRoleObj.iSex || '',
				'areaname' : newRoleObj.areaname || '',
				'checkparam' : newRoleObj.checkparam || '',
				'md5str' : newRoleObj.md5str || ''
			};
			setIntoCookie(newData);
			if(typeof(callback) == 'function'){
				callback(newRoleObj);
			}
			return true;
		}
		
		if(!option.gameId){
			return false;
		}
		
		LotteryManager.GetGiftMain._getRoleSelector(option.gameId, function(newRoleObj){
			LotteryManager.GetGiftMain.setRoleToCookie({
				'iActivityId' : iActivityId,
				'gameId' : option.gameId,
				'outData' : newRoleObj
			}, callback);
		});
		return true;
	};
	
	//提交数据
	LotteryManager.GetGiftMain.prototype.submit = function(ruleId){
		var _this = this;
		//查询时，检查是否登录
		LoginManager.reloadLogin(function(){
			{//相隔2秒之内是不能重复提交的。
				var time_ = _this.config._frequencyLimitTime;
				var timeDifference = +new Date - _this.config._clickStartTime*1;
				if(timeDifference < time_){
					return;
				}
				_this.config._clickStartTime = +new Date;
			}
			_this._loadJsFile(function(LotteryData){
				if(LotteryData.iNeedVerify != 0){
					//需要验证码
					var flag = _this._checkVerifyCode();
					if(!flag){
						return;
					}
				}
				
				//看是否是cdkey活动。
				if(_this.config.isOnlyOneCdkey){
					if(_this.__submit_cdkey_check(ruleId, LotteryData)){
						return;
					}
				}
				
				
				if(LotteryData.sActivityExpliciteClassification == 'paymentactivity'){
					if(!ruleId){
						/*
						if(LotteryData.tbRules.length != 1){
							alert('支付类型必须传入规则ID');
							return;
						}
						ruleId = LotteryData.tbRules[0].iRuleId;
						*/
					}
					
					var type = 1;
					{//取得Q币个数
						for(var i = 0; i < LotteryData.tbRules.length; i++){
							if(ruleId == LotteryData.tbRules[i].iRuleId){
								var len = LotteryData.tbRules[i].tbOneRules.length - 1;
								var tempReturn = LotteryData.tbRules[i].tbOneRules[len].tbConditions[0].sReturnValues;
								type = tempReturn.split('|')[1];
								break;
							}
						}
					}
					_this.__submit_safety_check(ruleId, type);//支付类活动。
				}else{
					_this._getGiftSubmit(ruleId);//普通活动
				}
			});
	
		});
	};
}

{//内部默认方法
	//初始化验证码
	LotteryManager.GetGiftMain.__initVerifyCode = function(activityId, codeContentId, imageContentId){
		if(!activityId || !codeContentId || !imageContentId){
			alert('参数输入错误：LotteryManager.GetGiftMain.__initVerifyCode(activityId, codeContentId, imageContentId)，三个参数都必须传入。');
			return;
		}
		$onload(function(){
			var obj = window['getGiftMain_' + activityId];
			if(!obj){
				return;
			}
			obj.config.codeContentId = codeContentId;
			obj.config.imageContentId = imageContentId;
			LotteryManager.GetGiftMain._changeImage(imageContentId);
		});
	};
	
	LotteryManager.GetGiftMain._changeImage = function(verifycodeImageContentId){
		if(!verifycodeImageContentId){
			alert('在参数中直接多传入两个参数即可 codeContentId, imageContentId。');
			return;
		}
		var submitData = {
			'aid' : '21000104',
			'_' : randomInt(1000)
		};
		var _url = 'http://ptlogin2.qq.com/getimage?' + JsonObject.serialize(submitData);
		$$('#' + verifycodeImageContentId).html('<a href="#t" title="看不清楚？换一张" onclick="LotteryManager.GetGiftMain._changeImage(\''+verifycodeImageContentId+'\');"><img style="border:0px;" src="'+_url+'"></a>');
	};
	
	//设置验证码
	LotteryManager.GetGiftMain.prototype._checkVerifyCode = function(){
		var codeContentId = this.config.codeContentId;
		if(!codeContentId){
			alert('在参数中直接多传入两个参数即可 codeContentId, imageContentId。');
			return false;
		}
		var verifyCode = $$('#' + codeContentId).val();
		
		if(!verifyCode){
			alert('您的验证码信息未输入。');
			return false;
		}
		if(verifyCode.length != 4){
			alert('您的验证码信息填写出错。');
			return false;
		}
		this.setOutData({
			'sVerifyCode' : verifyCode,
			'iVerifyId' : '21000104'
		});
		return true;
	};
	//页面初始化函数
	LotteryManager.GetGiftMain.prototype._loadJsFile = function(initcallback){
		var _this = this;
		if(typeof(initcallback) != 'function'){
			initcallback = function(){};
		}

		if(_this.LotteryData_DATA){
			if(_this.LotteryData_DATA.iActivityId == _this.option.activityId){
				initcallback(_this.LotteryData_DATA);
				return;
			}
		}
		LotteryManager.loadAllLotteryObject(_this.option.activityId, function(LotteryData){
			if(!_this.config.gameId){
				_this.config.gameId = LotteryData.sServiceType;
			}
			
			if(LotteryData.iActivityId == _this.option.activityId){
				_this.LotteryData_DATA = LotteryData;
				initcallback(_this.LotteryData_DATA);
			}
		});
	};
	
	//直接领取或者抽奖物品的方法
	LotteryManager.GetGiftMain._getGiftFunction = function(opt, callbackFunction){
		var option = {
			'gameId' : '',
			'iActivityId' : '',
			'sArea' : '',
			'iSex' : '',
			'sRoleId' : '',
			'iGender' : ''
		};
		option = $extend(option, opt);

		{//数据检查
			if(!option.iActivityId){
				alert('抽奖方法未传入活动id');
				return;
			}
		}
		
		if(option.gameId){
			if(typeof(LotteryManager.GetGiftMain['_' + option.gameId.toUpperCase() + 'CheckParamResult']) == 'function'){
				var temp_option = LotteryManager.GetGiftMain['_' + option.gameId.toUpperCase() + 'CheckParamResult'](option);
				if(!temp_option){
					return;
				}
				temp_option.iActivityId = option.iActivityId;
				option = temp_option;
			}
		}
		option.gameId = undefined;

		var _url = 'http://apps.game.qq.com/cgi-bin/lottery_MS/'+option.iActivityId+'/mileStoneMain.cgi?' + JsonObject.serialize(option);

		{//提交参数
			LotteryManager.GetGiftMain['callback_' + option.iActivityId] = callbackFunction;
			window['LotteryActivityCallback_' + option.iActivityId] = function(retObj){
				if(JsonObject.isFunction(LotteryManager.GetGiftMain['callback_' + retObj.iActivityId])){
					retObj = JsonObject.decode(retObj);
					LotteryManager.GetGiftMain['callback_' + retObj.iActivityId](retObj);
				}
			};

			FileLoadManager.ajaxRequest({
				'url' : _url,
				'dataType' : 'function', //返回的数据类型：object, function
				'dataTypeName' : 'LotteryActivityCallback_' + option.iActivityId, //如果dataTypeName设定成功以后的方法
				'showLoadingStr' : '',
				'onLoadSuccessEvent' : function(){}
			});
		}
	};
	
	LotteryManager.GetGiftMain.prototype._getGiftFunction = function(opt){
		var _this = this;
		opt = opt || {};
		opt = $extend(opt, _this.option.outData);
		
		
		{//初始化
			opt.sServiceType = _this.config.gameId || '';
		}
		
		{//需要对参数进行过滤掉。
			opt.areaname = undefined;
			opt.roleid = undefined;
			opt.rolelevel = undefined;
			opt.rolename = undefined;
			opt.gameId = undefined;
			opt.areaid = undefined;
		}

		LotteryManager.GetGiftMain.getGiftLoading = null;
		if(typeof(_this.option.onBeginGetGiftEvent) != 'function'){
			_this.option.onBeginGetGiftEvent = function(){
				LotteryManager.GetGiftMain.getGiftLoading = FloaterManager.init();
				LotteryManager.GetGiftMain.getGiftLoading.ajaxLoading('请稍后，数据正在提交中，请勿刷新页面...');
				return false;
			};
		}
		if(_this.option.onBeginGetGiftEvent(opt)){
			return;
		}
		
		//不能同一时间两个请求出去
		if(!_this.config._canClickBtn){
			return;
		}

		_this.config._canClickBtn = false;
		_this.config.submitData = opt; //保存提交的参数，方便以后使用

		LotteryManager.GetGiftMain._getGiftFunction(_this.config.submitData, function(callbackObj){
			_this.config._canClickBtn = true;
			if(LotteryManager.GetGiftMain.getGiftLoading){
				LotteryManager.GetGiftMain.getGiftLoading.close();
			}

			if(callbackObj.retCode != 0){
				_this.option.onGetGiftFailureEvent(callbackObj);
				return;
			}

			_this.option.onGetGiftSuccessEvent(callbackObj);
		});
	};
	
	LotteryManager.GetGiftMain._getRoleSelector = function(gameId, callback){
		var roleArr = RoleSelector.getAllServiceType();
		var isFind = false;
		for(var i = 0; i < roleArr.length; i++){
			if(roleArr[i] == gameId){
				isFind = true;
				break;
			}
		}
		
		if(!isFind){
			callback({});
			return;
		}

		var roleSelector = RoleSelector.init({
			'gameId' : gameId,
			'isShutdownSubmit' : false,
			'submitEvent' : function(roleObj){
				var newRoleObj = {};
				if(roleObj && roleObj.submitData){
					newRoleObj.sArea = roleObj.submitData.areaid || '';
					newRoleObj.sRoleId = roleObj.submitData.roleid || '';
					newRoleObj.sRoleName = roleObj.submitData.rolename || '';
					newRoleObj.iSex = roleObj.submitData.rolesex || '';
					for(var i in roleObj.submitData){
						newRoleObj[i] = roleObj.submitData[i];
					}
				}
				
				if(typeof(callback) == 'function'){
					callback(newRoleObj);
				}
			}//点击确定以后的函数
		});
		roleSelector.show();
	};
	
	LotteryManager.GetGiftMain.prototype._getGiftSubmit = function(ruleId, submitData){
		var _this = this;
		
		ruleId = ruleId || '';
		submitData = submitData || {}; //提交参数
		
		{//参数设置
			{//填加提交对象
				submitData.iActivityId = _this.option.activityId;
			}

			if(ruleId){//如果有ruleId,首先验证ruleId的正确性
				this._loadJsFile(function(lotteryOption){
					var isRuleId = false;
					var arrAllRuleId = [];
					for(var k = 0; k < lotteryOption.tbRules.length; k++){
						var ruleObj = lotteryOption.tbRules[k];
						if(ruleId == ruleObj.iRuleId){
							isRuleId = true;
						}
						arrAllRuleId.push(ruleObj.iRuleId);
					}
					if(!isRuleId){
						if(arrAllRuleId.length > 0){
							alert('设置的规则为：'+ruleId+'。规则ruleId出错了，正确的ruleId列表为：' + arrAllRuleId.join(',') + '。请认真检查确认满足的规则ID。');
						}else{
							alert('该活动没有设置相应的规则，不能传入ruleId。');
						}
						return;
					}
					submitData.iRuleId = ruleId;
					_this._getGiftSubmit('', submitData);
				});
				return;
			}
		}
	
	
		if(typeof(_this.option.onBeginGetRoleEvent) == 'function'){
			if(_this.option.onBeginGetRoleEvent()){
				return;
			}
		}
		
		//不查角色
		if(!_this.option.isQueryRole){
			_this._getGiftFunction(submitData);
			return;
		}

		//如果有缓存机制，而不需要查询角色的情况
		if(_this.option.isQueryRoleCache){
			var roleObj = LotteryManager.GetGiftMain.getRoleFromCookie(_this.option.activityId);
			if(roleObj){
				//又同角色信息合并
				for(var i in roleObj){
					submitData[i] = roleObj[i];
				}
				//查询完角色后，取得所有信息，则进行礼品获取方法。
				_this._getGiftFunction(submitData);
				return;
			}
			
			LotteryManager.GetGiftMain.setRoleToCookie({
				'iActivityId' : _this.option.activityId,
				'gameId' : _this.option.gameId,
				'outData' : null
			},function(roleObj){
				for(var i in roleObj){
					submitData[i] = roleObj[i];
				}
				_this._getGiftFunction(submitData);
			});
			return;
		}

		LotteryManager.GetGiftMain._getRoleSelector(_this.config.gameId, function(newRoleObj){
			for(var i in newRoleObj){
				submitData[i] = newRoleObj[i];
			}
			_this._getGiftFunction(submitData);
		});
	};
}

LotteryManager.GetGiftMain.init = function(opt){
	if(!opt.activityId){
		alert('请输入活动号activityId');
		return;
	}
	window['getGiftMain_' + opt.activityId] = new LotteryManager.GetGiftMain(opt);
	
	{//看是否需要初始化验证码输入框
		if(opt.codeContentId && opt.imageContentId){
			LotteryManager.GetGiftMain.__initVerifyCode(opt.activityId, opt.codeContentId, opt.imageContentId);
		}
	}

	return window['getGiftMain_' + opt.activityId];
};

/**========================================================== //提供的主函数抽奖方法JS ==========================================================**/



/**========================================================== 提供的个人信息填写方法JS ==========================================================**/
LotteryManager.PersonInfo = function(opt){
	this.option = {
		'activityId' : '', //活动的ID
		'contentId' : 'personInfoContent_' + opt.activityId, //容器ID
		'buttonId' : 'personSubmitBtn_' + opt.activityId, //提交按钮的ID
		'onSubmitSuccessEvent' : null,
		'onSubmitFailureEvent' : null,
		'onSubmitCompleteEvent' : null //成功或结束后都需要执行的函数
	};
	var _this = this;
	_this.option = $extend(_this.option, opt);
	
	{//对数据进行检查
		if(!_this.option.activityId){
			//alert('个人信息活动ID:activityId未设置');
			return;
		}
		if(!_this.option.contentId){
			//alert('个人信息容器ID:contentId未设置');
			return;
		}
		if($$("[id='"+_this.option.contentId+"']").length != 1){
			//alert('个人信息容器ID：contentId设置错误，页面必须存在有且仅有一个元素：' + _this.option.contentId);
			return;
		}
	}
};

//提交方法
LotteryManager.PersonInfo.prototype.submit = function(){
	var _this = this;
	LotteryManager.loadAllLotteryObject(_this.option.activityId, function(lotteryobj){
		_this.option.serviceType = lotteryobj.sServiceType;
		var __onSubmitCompleteEvent = null;
		if(JsonObject.isFunction(_this.option.onSubmitCompleteEvent)){
			__onSubmitCompleteEvent = _this.option.onSubmitCompleteEvent;
		}
		
		var _onSubmitCompleteEvent = function(retInfo){
			FloaterManager.close();
			if(__onSubmitCompleteEvent){
				__onSubmitCompleteEvent(retInfo);
			}
		};
		_this.option.onSubmitCompleteEvent = _onSubmitCompleteEvent;
		LotteryManager.PersonInfo.submit(_this.option);
	});
};

//展示页面
LotteryManager.PersonInfo.prototype.show = function(){
	var _this = this;
	if(!_this.option.buttonId){
		alert('个人信息容器ID:buttonId设置错误');
		return;
	}
	LoginManager.submitLogin(function(){
		if(ProvinceCitySelect){
			ProvinceCitySelect.create([document.getElementById("province"),document.getElementById("city")], 
				[
					{t:"请选择省份",v:"",opt_data_array:
						[
							{t:"请选择城市",v:""}
						]
					}
				]
			); 
		}
		LotteryManager.PersonInfo.show(_this.option.contentId);
		
		$$('#' + _this.option.buttonId).unbind('click').click(function(){
			window['personInfo_' + _this.option.activityId].submit();
		});
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

LotteryManager.PersonInfo.show = function(contentId){
	{//对数据进行检查
		if(!contentId){
			alert('个人信息容器ID:contentId设置错误');
			return;
		}
		if($$("[id='"+contentId+"']").length != 1){
			alert('个人信息容器ID：contentId设置错误,只能为一个' + contentId);
			return;
		}
	}
	var personInfoFloater = FloaterManager.init({
		'type' : 'dom',
		'content' : contentId //所要显示的内容
	});
	personInfoFloater.show();
};



LotteryManager.PersonInfo.submit = function(opt){
	var option = {
		'activityId' : '',
		'contentId' : '',
		'serviceType' : '',
		'onSubmitSuccessEvent' : null,
		'onSubmitFailureEvent' : null,
		'onSubmitCompleteEvent' : null
	};
	option = $extend(option, opt);
	
	{//对数据进行检查
		if(!option.activityId){
			alert('个人信息活动ID:activityId未设置');
			return;
		}
		if(!option.serviceType){
			alert('个人信息活动ID:serviceType未设置');
			return;
		}
		if(!option.contentId){
			alert('个人信息容器ID:contentId设置错误');
			return;
		}
		if($$("[id='"+option.contentId+"']").length != 1){
			alert('个人信息容器ID：contentId设置错误' + option.contentId);
			return;
		}
	}

	var _data = FormManager.getAllInputValue(option.contentId) || {};
	var _arrStr = [];
	for(var i in _data){
		var _val = _data[i];
		switch(i){
			//LotteryManager.alert => alert 2012-04-23
			case 'sName':{
				if(!_val){alert("姓名不能为空。"); return;}
				if(_val.cLen() > 30){alert("姓名长度不能超过30个字节。"); return;}
				_arrStr.push('姓名：'+_val);
				break;
			}
			case 'sIdentity':{
				if(!_val){alert("身份证号码不能为空。"); return;}
				if(_val.cLen() > 20){alert("身份证号码不能超过20个字节。"); return;}
				_arrStr.push('身份证号码：'+_val);
				break;
			}
			case 'sMobile':{
				if(!_val){alert("手机号码不能为空。"); return;}
				if(isNaN(_val) || _val.indexOf('.') >= 0){alert("手机号码必须为数字。"); return;}
				_arrStr.push('手机号码：'+_val);
				break;
			}
			case 'sProvince':{
				if(!_val){alert("请选择省份。"); return;}
				_arrStr.push('省份：'+ProvinceCitySelect.GetProvinceDesc(_val));
				break;
			}
			case 'sCity':{
				if(!_val){alert("请选择城市。"); return;}
				_arrStr.push('城市：'+ProvinceCitySelect.GetCityDesc(_val));
				break;
			}
			case 'sAddress':{
				if(!_val){alert("详细地址不能为空。"); return;}
				if(_val.cLen() > 100){alert("详细地址不能超过100个字节。"); return;}
				_arrStr.push('详细地址：'+_val);
				break;
			}
			case 'sPostCode':{
				if(!_val){alert("邮政编码不能为空。"); return;}
				if(_val.cLen() > 8){alert("邮政编码不能超过8个字节。"); return;}
				if(isNaN(_val) || _val.indexOf('.') >= 0){alert("邮政编码必须为数字。"); return;}
				_arrStr.push('邮政编码：'+_val);
				break;
			}
			default : {
				_arrStr.push(i + '：'+_val);
			}
		}
	}
	
	{//确认提交
		if(!confirm("请确认如下信息，如果填写有误而导致官方无法联系上获奖人，官方将不承担此责任。\r\n" + _arrStr.join('\r\n'))){
			return;
		}
		
		_data.iActivityId = option.activityId;
		_data.sServiceType = option.serviceType;
		_data.sProvince = ProvinceCitySelect.GetProvinceDesc(_data.sProvince);
		_data.sCity = ProvinceCitySelect.GetCityDesc(_data.sCity);
		
		var _url = 'http://apps.game.qq.com/cgi-bin/lottery_MS/getPersonalInfo.cgi?' + JsonObject.serialize(_data);
		FileLoadManager.ajaxRequest({
			'url' : _url,
			'dataType' : 'object', //返回的数据类型：object, function
			'dataTypeName' : 'PersonalInfo_' + option.activityId, //如果dataTypeName设定成功以后的方法
			'showLoadingStr' : '正在上传个人信息，请稍候...',
			'onLoadCompleteEvent' : function(){
				if(typeof(option.onSubmitSuccessEvent) != 'function'){
					option.onSubmitSuccessEvent = function(PersonalInfo){
						alert('信息上传成功！');
					};
				}
				if(typeof(option.onSubmitFailureEvent) != 'function'){
					option.onSubmitFailureEvent = function(PersonalInfo){
						alert(PersonalInfo.retInfo);
					};
				}
				if(typeof(option.onSubmitCompleteEvent) != 'function'){
					option.onSubmitCompleteEvent = function(PersonalInfo){};
				}
				
				if(JsonObject.isUndefined(window['PersonalInfo_' + option.activityId])){
					var tempObj = {
						'retCode' : -55,
						'retInfo' : '个人信息上传失败，请刷新页面重试'
					};
					option.onSubmitFailureEvent(tempObj);
					option.onSubmitCompleteEvent(tempObj);
					return;
				}
				
				var tempObj = window['PersonalInfo_' + option.activityId];

				if(tempObj.retCode == 0){
					option.onSubmitSuccessEvent(tempObj);
				}else{
					option.onSubmitFailureEvent(tempObj);
				}
				option.onSubmitCompleteEvent(tempObj);
			}
		});
	}

};

LotteryManager.PersonInfo.init = function(opt){
	if(!opt.activityId){
		alert('LotteryManager.PersonInfo.init请输入活动号activityId');
		return;
	}
	window['personInfo_' + opt.activityId] = new LotteryManager.PersonInfo(opt);
	return window['personInfo_' + opt.activityId];
};

/**========================================================== //提供的个人信息填写方法JS ==========================================================**/



/**========================================================== 提供的轮播方法JS ==========================================================**/
LotteryManager.Broadcast = function(opt){
	//基本属性
	this.option = {
		'onlyOneBroadcast' : true, //设置是否拉取所有轮播信息为一个，如果有多个，则这个值设置为false
		'activityId' : '', //活动的ID，多个活动用|隔开
		'contentId' : 'broadcastContent', //容器ID
		'templateId' : 'broadcastTemplate', //模板ID
		'isAutoRun' : true, //是否自动滚动
		'onLoadCompleteEvent' : null, //显示完成以后的方法。
		
		'scrollstep' : 1, //每次移动的像素
		'scrollstoptime' : 20 //间断时间(毫秒)
	};
	var _this = this;
	_this.option = $extend(_this.option, opt);

	{//对数据进行检查
		if(!_this.option.contentId || $$("[id='"+_this.option.contentId+"']").length != 1){
			//alert('轮播容器ID：contentId设置错误，请确认页面上有且仅有一个contentId:' + _this.option.contentId);
			return;
		}
		if(!_this.option.activityId){
			//alert('轮播活动ID:activityId未设置');
			return;
		}
		if(!_this.option.templateId){
			//alert('轮播活动模板ID:templateId未设置');
			return;
		}
	}
	
	if(!_this.option.onlyOneBroadcast){//如果有一个设置为false,则全局的为false。
		LotteryManager.Broadcast.onlyOneBroadcast = false;
	}

	if(LotteryManager.Broadcast.onlyOneBroadcast){
		LotteryManager.Broadcast._getAllBroadcastActivityId(function(activityIdList){
			LotteryManager.Broadcast._getAllBroadcastList(activityIdList, function(AllBroadcastList){
				_this._fillAllBroadcastListResult(AllBroadcastList);
			});
		});
		return;
	}

	//只使用当前的轮播
	LotteryManager.Broadcast._getAllBroadcastList(_this.option.activityId+'', function(AllBroadcastList){
		_this._fillAllBroadcastListResult(AllBroadcastList);
	});
	
};
//全局变量，默认页面是否只有一个轮播
LotteryManager.Broadcast.onlyOneBroadcast = true;
LotteryManager.Broadcast.ALL_LOTTERY_OBJECT = {};


//获取页面上所有活动信息，然后分析哪些活动需要用到轮播，
LotteryManager.Broadcast._getAllBroadcastActivityId = function(callback){
	if(!JsonObject.isFunction(callback)){
		callback = function(activityIdList){
			alert(activityIdList);
		};
	}
	
	//取得所有有效的活动ID
	var allUsedActivityId = function(){
		{//首先看是否产生活动ID
			var activityArr = [];
			for(var i in window){
				if(i.indexOf('broadcast_') >= 0){
					var temp = i.split('_');
					if(temp.length == 2){
						var iActivityId = temp[1];
						if(iActivityId && !isNaN(iActivityId)){
							activityArr.push(iActivityId);
						}
					}
				}
			}
			
			//根据所有活动ID去看是否有礼包设置了显示轮播
			LotteryManager.loadAllLotteryObject(activityArr.join('|'), function(allLotteryActivityObject){
				if(!JsonObject.isArray(allLotteryActivityObject)){
					allLotteryActivityObject = [allLotteryActivityObject];
				}
				var newActivityArr = [];

				for(var i = 0; i < allLotteryActivityObject.length; i++){
					var oneData = allLotteryActivityObject[i];
					if(!oneData){
						continue;
					}
					
					var tbRuleList = oneData.tbRules;
					for(var j = 0; j < tbRuleList.length; j++){
						var flag = false;
						for(var k = 0; k < tbRuleList[j].tbPackages.length; k++){
							var package = tbRuleList[j].tbPackages[k];
							if(package.iDisplayFlag != 0){
								newActivityArr.push(oneData.iActivityId);
								flag = true;
								break;
							}							
						}
						if(flag){
							break;
						}							
					}
				}

				if(newActivityArr.length == 0){
					return;
				}
				
				callback(newActivityArr.join('|'));
			});
		}
	};
	
	
	$onload(function(){
		setTimeout(allUsedActivityId, 1000);
	});
};

//通过活动号取得轮播列表信息。
LotteryManager.Broadcast._getAllBroadcastList = function(activityIdList, callback){
	if(typeof(callback) != 'function'){
		callback = function(obj){
			alert('LotteryManager.Broadcast._getBroadcastList：' + JsonObject.toString(obj));
		};
	}
	
	if(!activityIdList){
		alert('LotteryManager.Broadcast._getBroadcastList:activityIdList未设置');
		return false;
	}
	
	var activityId = activityIdList + '';
	var arrActivityId = activityId.split('|');
	
	var getAllBroadcastObject = function(){
		var _all = [];
		for(var i = 0; i < arrActivityId.length; i++){
			var oneData = LotteryManager.Broadcast.ALL_LOTTERY_OBJECT[''+arrActivityId[i]];
			if(JsonObject.isArray(oneData)){
				_all = _all.concat(oneData);
			}
		}
		callback(_all);
	};

	//设置一个递归函数来处理结果
	var _allLen = arrActivityId.length;
	var currentIndex = 0;
	var _getAllFunction = function(){
		//如果成功就直接返回
		if(currentIndex >= _allLen){
			getAllBroadcastObject();
			return;
		}
		
		var _activityId = arrActivityId[currentIndex] + '';
		currentIndex++;
		
		var oneData = LotteryManager.Broadcast.ALL_LOTTERY_OBJECT[_activityId];
		if(oneData){
			_getAllFunction();
			return;
		}
		
		LotteryManager.Broadcast.ALL_LOTTERY_OBJECT[_activityId] = [];
		
		var _url = 'http://gameact.qq.com/act/broadcastgift_ms/'+_activityId+'.js';
		FileLoadManager.ajaxRequest({
			'url' : _url,
			'dataType' : 'object',
			'dataTypeName' : 'Broadcast_' + _activityId,
			'showLoadingStr' : '',
			'onLoadCompleteEvent' : function(){
				if(typeof(window['Broadcast_' + _activityId]) == 'undefined'){
					_getAllFunction();
					return;
				}
				var tempLottery = window['Broadcast_' + _activityId];
				tempLottery = JsonObject.decode(tempLottery);
				for(var i = 0; i < tempLottery.length; i++){
					tempLottery[i].getTime = tempLottery[i].dtGetPackageTime;
					tempLottery[i].uin = tempLottery[i].iUin;
					tempLottery[i].packageName = tempLottery[i].sPackageName;
				}
				
				LotteryManager.Broadcast.ALL_LOTTERY_OBJECT[_activityId] = tempLottery;
				_getAllFunction();
			}
		});
	};
	
	_getAllFunction();
};


//获取成功以后的方法
LotteryManager.Broadcast.prototype._fillAllBroadcastListResult = function(BroadcastList){
	var _this = this;
	var templateHTML = $$('#' + _this.option.templateId).html();
	var myTemplateObj = TemplateManager.parseTemplate(templateHTML);
	var result = myTemplateObj.process(BroadcastList, 'BroadcastList');
	$$("#" + _this.option.contentId).html(result);
	
	if(typeof(_this.option.onLoadCompleteEvent) == 'function'){
		_this.option.onLoadCompleteEvent(BroadcastList);
	}

	if(_this.option.isAutoRun && BroadcastList.length > 0){
		LotteryManager.Broadcast.setAutoRunAction({
			'contentId' : _this.option.contentId, //容器ID
			'scrollstep' : _this.option.scrollstep, //每次移动的像素
			'scrollstoptime' : _this.option.scrollstoptime //间断时间(毫秒)
		});
	}
};


//根据多个活动号获取所有轮播列表
LotteryManager.Broadcast.fillAllBroadcast = function(){
	LotteryManager.Broadcast._getAllBroadcastActivityId(function(activityIdList){
		LotteryManager.Broadcast._getAllBroadcastList(activityIdList, function(AllBroadcastList){
			if(!activityIdList){
				return;
			}
			var activityId = activityIdList.split('|')[0];
			var _this = window['broadcast_' + activityId];
			_this._fillAllBroadcastListResult(AllBroadcastList);
		});
	});
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//设置轮播滚动效果
LotteryManager.Broadcast.setAutoRunAction = function(opt){
	var option = {
		'contentId' : '', //容器ID
		'scrollstep' : 1, //每次移动的像素
		'scrollstoptime' : 20 //间断时间(毫秒)
	};
	option = $extend(option, opt);

	if(typeof(ScrollMarqueeUP) == 'function'){
		ScrollMarqueeUP.init(option);
		return;
	}
	
	FileLoadManager.ajaxRequest({
		'url' : 'http://ossweb-img.qq.com/images/js/basic/utilmanager.js',
		'charset':'gb2312',
		'showLoadingStr' : '',
		'isUseDefaultLoadType' : true,
		'onLoadSuccessEvent' : function(){
			LotteryManager.Broadcast.setAutoRunAction(option);
		}
	});
};


LotteryManager.Broadcast.init = function(opt){
	if(!opt.activityId){
		alert('请输入活动号activityId');
		return;
	}
	window['broadcast_' + opt.activityId] = new LotteryManager.Broadcast(opt);
	return window['broadcast_' + opt.activityId];
};
/**========================================================== //提供的轮播方法JS ==========================================================**/



/**========================================================== 查看个人奖品信息JS ==========================================================**/
LotteryManager.MyGiftList = function(opt){
	this.option = {
		'activityId' : '', //活动的ID
		'gameId' : '',
		'contentId' : 'getGiftContent', //容器ID
		'templateId' : 'getGiftTemplate', //模板ID
		'contentPageId' : 'getGiftPageContent'	//分页容器
	};

	this.config = {
		pageSize : 10, //容器需要显示的行数
		GET_TEMP_HTML : '', //缓存模板文件
		GET_GIFT_DATA : null //变量对象
	};
	
	var _this = this;
	_this.option = $extend(_this.option, opt);
	_this.config = $extend(_this.config, opt);
		
	{//对数据进行检查
		if(!_this.option.contentId || $$("[id='"+_this.option.contentId+"']").length != 1){
			//alert('查看个人奖品信息ID：contentId设置错误');
			return;
		}
		if(!_this.option.activityId){
			//alert('查看个人奖品信息ID:activityId未设置');
			return;
		}
		if(!_this.option.templateId){
			//alert('查看个人奖品信息模板ID:templateId未设置');
			return;
		}
	}
	{//对数据进行初始化
		if(!_this.config.GET_TEMP_HTML){
			_this.config.GET_TEMP_HTML = $$("#" + _this.option.templateId).html();
		}
	}
	
};


//常量信息
LotteryManager.MyGiftList.DATA = {
	GET_GIFT_DATA : {} //缓存该数据
};

//获取个人奖品记录列表，可支持多个活动列表
LotteryManager.MyGiftList.getMyGiftListByActivityId = function(opt, callback){
	var option = {
		'activityId' : '',
		'pageSize' : 10,
		'pageNow' : 1,
		
		'gameId' : '',
		'isForce' : false
	};
	option = $extend(option, opt);
	if(!option.activityId){
		alert('LotteryManager.MyGiftList.getMyGiftList:activityId未设置');
		return false;
	}
	
	if(typeof(callback) != 'function'){
		callback = function(obj){
			alert('LotteryManager.MyGiftList.getMyGiftListByActivityId：' + JsonObject.toString(obj));
		};
	}
	
	var dataName = ((option.activityId + '').replaceAll('|', '$'));
	
	//首先查找一下当前activityId和当前页的记录是否已经存在。
	var hasAllMyGiftList = LotteryManager.MyGiftList.DATA.GET_GIFT_DATA[dataName + '_' + option.pageNow];
	if(hasAllMyGiftList){
		if(!option.isForce){
			callback(hasAllMyGiftList);
			return;
		}
	}
	var submitData = {
		'iActivityId' : option.activityId,
		'iPageSize' : option.pageSize,
		'iPageNow' : option.pageNow
	};

	var _getAreaInfoCallback = function(areaNameCallback){
		var _url = 'http://apps.game.qq.com/cgi-bin/lottery_MS/displayPersonalPackage.cgi?' + JsonObject.serialize(submitData);
		FileLoadManager.ajaxRequest({
			'url' : _url,
			'dataType' : 'object', //返回的数据类型：object, function
			'dataTypeName' : 'MyGiftListObject_' + dataName, //如果dataTypeName设定成功以后的方法
			'showLoadingStr' : '',
			'onLoadCompleteEvent' : function(){
				var MyGiftListObject = window['MyGiftListObject_' + dataName] || {retCode : '-1',retInfo : '网络繁忙，请您稍后重试。', pageTotal : "1",pageNow : "1",myGiftList : []};
				if(MyGiftListObject.retCode == 0){
					MyGiftListObject = JsonObject.decode(MyGiftListObject);
					for(var i = 0; i < MyGiftListObject.myGiftList.length; i++){
						MyGiftListObject.myGiftList[i].getTime = MyGiftListObject.myGiftList[i].dtGetPackageTime;
						MyGiftListObject.myGiftList[i].uin = LoginManager.getUserUin();
						MyGiftListObject.myGiftList[i].areaName = areaNameCallback(MyGiftListObject.myGiftList[i].sRoleArea);
						MyGiftListObject.myGiftList[i].packageName = MyGiftListObject.myGiftList[i].sPackageName;
					}
					LotteryManager.MyGiftList.DATA.GET_GIFT_DATA[dataName + '_' + option.pageNow] = MyGiftListObject;
				}
				callback(MyGiftListObject);
			}
		});
	};
	
	//通过业务信息，查询大区名字。
	var findAreaName = function(gameId){
		if(!gameId){
			_getAreaInfoCallback(function(areaId){
				return areaId;
			});
			return;
		}
		
		var _callback = function(){
			if(typeof(RoleSelector) == 'undefined'){
				_getAreaInfoCallback(function(areaId){
					return areaId;
				});
				return;
			}
			
			//验证是否有该大区信息。
			var isFind = false;
			var serviceTypeList = RoleSelector.getAllServiceType();
			for(var i = 0; i < serviceTypeList.length; i++){
				if(serviceTypeList[i] == gameId){
					isFind = true;
					break;
				}
			}
			
			if(!isFind){
				_getAreaInfoCallback(function(areaId){
					return areaId;
				});
				return;
			}
			
			
			RoleSelector.loadAreaInfoList({
				'gameId' : gameId
			}, function(data){
				var _getAreaNameInfo = function(areaId){
					areaId = parseInt(areaId, 10) + '';
					for(var i = 0; i < data.length; i++){
						if(areaId == data[i].v){
							return data[i].t;
						}
						
						if(data[i].opt_data_array){
							var sub_data = data[i].opt_data_array;
							for (var j = 0; j < sub_data.length; j++){
								if(sub_data[j].v == areaId){
									return sub_data[j].t;
								}
							}
						}
					}
					return areaId || '';
				};
		
				_getAreaInfoCallback(function(areaId){
					return _getAreaNameInfo(areaId);
				});
			});
		};

		if(typeof(RoleSelector) != 'undefined'){
			_callback();
			return;
		}
		
		var _url = 'http://ossweb-img.qq.com/images/js/roleselector/roleselectorv3.js';
		FileLoadManager.ajaxRequest({
			'url' : _url,
			'dataType' : 'object', //返回的数据类型：object, function
			'dataTypeName' : 'RoleSelector', //如果dataTypeName设定成功以后的方法
			'showLoadingStr' : '',
			'onLoadCompleteEvent' : function(){
				_callback();
			}
		});
	};
	
	
	if(option.gameId){
		findAreaName(option.gameId);
		return;
	}

	if(!option.activityId){
		findAreaName('');
		return;
	}
	var activityId = parseInt(option.activityId);
	LotteryManager.loadAllLotteryObject(activityId, function(LotteryData){
		option.gameId = LotteryData.sServiceType;
		findAreaName(option.gameId);
	});

};












//将信息获取过来然后填充页面
LotteryManager.MyGiftList.fill = function(opt, callback){
	var option = {
		'activityId' : '',
		'pageSize' : 10,
		'pageNow' : 1,
		'isForce' : false,
		
		'gameId' : '',
		'contentId' : '',
		'contentPageId' : '',
		'GET_TEMP_HTML' : ''
	};
	option = $extend(option, opt);
	
	if(typeof(callback) != 'function'){
		callback = function(){
			alert('LotteryManager.MyGiftList.fill');
		};
	}
	
	LotteryManager.MyGiftList.getMyGiftListByActivityId(option, function(allMyGiftObject){
		if(!option.GET_TEMP_HTML){
			alert('LotteryManager.MyGiftList.fill 中 GET_TEMP_HTML为空，请确认你已经复制页面模板了么？');
			return;
		}
		if(!allMyGiftObject.myGiftList){allMyGiftObject.myGiftList = [];}
		if(allMyGiftObject.pageTotal*1 < allMyGiftObject.pageNow*1){allMyGiftObject.pageTotal = allMyGiftObject.pageNow;}
		
		var myTemplateObj = TemplateManager.parseTemplate(option.GET_TEMP_HTML);
		var result = myTemplateObj.process(allMyGiftObject, 'MyGiftListObject');
		$$("#" + option.contentId).html(result);
		
		if(!option.contentPageId){//是否有分页
			callback();
			return;
		}
		if(allMyGiftObject.retCode != 0){ //有错误，则直接返回
			return;
		}

		//显示分页信息
		var setGiftPageHTML = function(){
			var dataName = ((option.activityId + '').replaceAll('|', '$'));
			var page_option = {
				'oPage' : 'myGiftListPage_' + dataName,
				'pageId' : option.contentPageId,
				'pageNow' : allMyGiftObject.pageNow || 1,
				'pageTotal' : allMyGiftObject.pageTotal || 1,
				'onChange' : function(i){
					option.pageNow = i;
					LotteryManager.MyGiftList.fill(option, callback);
					return false;
				},
				'style' : 135
			};
			window['myGiftListPage_' + dataName] = new AjaxPage(page_option);
			callback();
		};
		
		//加载分页程序
		if(typeof(AjaxPage) != 'undefined'){
			setGiftPageHTML();
			return;
		}

		FileLoadManager.ajaxRequest({
			'url' : 'http://ossweb-img.qq.com/images/js/basic/utilmanager.js',
			'showLoadingStr' : '',
			'onLoadSuccessEvent' : function(){
				setGiftPageHTML();
			}
		});
	});
	
};



//填充页面
LotteryManager.MyGiftList.prototype.fill = function(opt, callback){
	var _this = this;
	var option = {
		'activityId' : '', //this.option
		'pageSize' : 10, //this.config
		'pageNow' : 1, 
		'isForce' : false,
		
		'gameId' : '', //this.option
		'contentId' : '', //this.option
		'contentPageId' : '', //this.option
		'GET_TEMP_HTML' : '' //this.config
	};
	
	option = $extend(option, _this.option);
	option = $extend(option, _this.config);
	option = $extend(option, opt);
	
	LotteryManager.MyGiftList.fill(option, function(){
		if(typeof(callback) == 'function'){
			callback();
		}
	});
};

//弹出层显示
LotteryManager.MyGiftList.prototype.show = function(opt){
	var _this = this;
	var option = {
		'showContentId' : 'showMyGiftContent',
		'pageSize' : 10
	};
	option = $extend(option, opt);
	
	var config = {
		'type' : 'dom',
		'width' : 410,
		'height' : 470,
		'border' : 1, //显示框的边框
		'isShowHeader' : true, //是否显示标题
		'isShowClose' : true, //是否显示标题后的关闭按钮
		'title' : '我的礼包列表',
		'content' : option.showContentId, //所要显示的内容
		'onOpenEvent' : function(){return false;}, //打开此div显示层的方法
		'onCloseEvent' : function(){return false;}, //关闭此div显示层的方法
		'onAllCloseEvent' : function(){return false;}, //关闭所有div显示层的方法
		'isShowCover' : true, //是否显示背景层
		'coverColor' : '#E6F5FF', //背景层的颜色
		'styleStr' : '', //设置当前需要显示的样式表信息
		'style' : '1' //如果上面没有设置，则使用此默认样式，目前有两种样式可供选择:1为QQ登录样式;2为loading样式;其它为默认样式
	};
	
	LoginManager.submitLogin(function(){
		_this.fill(option, function(){});
		var myGiftListFloater = FloaterManager.init();
		myGiftListFloater.show(config);
	});
};

LotteryManager.MyGiftList.init = function(opt){
	if(!opt.activityId){
		alert('请输入活动号activityId');
		return;
	}
	window['myGiftList_' + opt.activityId] = new LotteryManager.MyGiftList(opt);
	return window['myGiftList_' + opt.activityId];
};

/*********************************** //查看个人奖品信息JS *************************************/



/*********************************** 物品领取中心JS  *************************************/
/**
 * 显示物品列表：http://apps.game.qq.com/cgi-bin/lottery_MS/activityShowItems.cgi?iActivityId=1,2&iListPerPage=10&pageNow=1
 * 领取物品：http://apps.game.qq.com/cgi-bin/lottery_MS/activityGetItems.cgi?iId=1&sArea=1&sRoleId=xxx&sRoleName=xxx&iGender=xxx
 * {iId:xx,iActivityId:xx,sItemName:xx,iStatus:xx,dtGetTime:xx,dtRecTimexx}
 */
LotteryManager.GetGiftCenter = function(opt){
	this.option = {
		'isAutoLoad' : true, //是否自动加载。
		'activityId' : '', //活动的ID
		'gameId' : '',
		'contentId' : 'getGiftCenterContent', //容器ID
		'templateId' : 'getGiftCenterTemplate', //模板ID
		'contentPageId' : 'getGiftCenterPageContent',	//分页容器
		'onGetGiftCompleteEvent' : null
	};

	this.config = {
		'pageSize' : 10, //容器需要显示的行数
		'pageTotal' : 1, //总页数
		'GET_TEMP_HTML' : '' //缓存模板文件
	};
	
	var _this = this;
	_this.option = $extend(_this.option, opt);
	_this.config = $extend(_this.config, opt);
		
	{//对数据进行检查
		if(!_this.option.contentId || $$("[id='"+_this.option.contentId+"']").length != 1){
			return;
		}
		if(!_this.option.activityId){
			return;
		}
		if(!_this.option.templateId){
			return;
		}
	}
	{//对数据进行初始化
		if(!_this.config.GET_TEMP_HTML){
			_this.config.GET_TEMP_HTML = $$("#" + _this.option.templateId).html();
		}
	}
	
	if(_this.option.isAutoLoad){
		_this.fill({});
	}
};

//填充页面显示
LotteryManager.GetGiftCenter.prototype.fill = function(opt){
	var _this = this;
	var option = {
		'activityId' : '', //可传多个活动号
		'pageSize' : 10,
		'pageNow' : 1
	};
	option = $extend(option, _this.option);
	option = $extend(option, opt);
	
	LotteryManager.GetGiftCenter.getGiftCenterList(option, function(ShowGiftCenterObject){
		_this._fillMyGiftHTML(option, ShowGiftCenterObject);
		if(typeof(_this.option.onGetGiftCompleteEvent) == 'function'){
			_this.option.onGetGiftCompleteEvent(ShowGiftCenterObject);
		}
	});
};


LotteryManager.GetGiftCenter.prototype._fillMyGiftHTML = function(option, ShowGiftCenterObject){
	var _this = this;
	$$('#' + _this.option.contentPageId).hide();

	var _fillHTML = function(){
		var itemTemplate = TemplateManager.parseTemplate(_this.config.GET_TEMP_HTML);
		var str  = itemTemplate.process(ShowGiftCenterObject, 'ShowGiftCenterObject');
		$$('#' + _this.option.contentId).html(str);
		if(ShowGiftCenterObject.giftCenterList.length > 0){
			window['getGiftCenterPageInstance_' + _this.option.activityId] = new AjaxPage({
				oPage : 'getGiftCenterPageInstance_' + _this.option.activityId,
				pageId : _this.option.contentPageId,
				pageNow : ShowGiftCenterObject.pageNow*1,
				pageShowNum : 3,//前后最多显示的页数
				pageTotal : ShowGiftCenterObject.pageTotal*1,
				style : 1345,
				onChange : function(i){
					option.pageNow = i;
					_this.fill(option);
					return false;
				}
			});
			$$('#' + _this.option.contentPageId).show();
		}
		
	};
	
	_fillHTML();
};


//取得领取中心表信息，可以传入多个activityId
//显示物品列表：http://apps.game.qq.com/cgi-bin/lottery_MS/activityShowItems.cgi?iActivityId=1,2&iListPerPage=10&pageNow=1
LotteryManager.GetGiftCenter.getGiftCenterList = function(opt, callback){
	var option = {
		'activityId' : '',
		'pageSize' : 10,
		'pageNow' : 1
	};
	option = $extend(option, opt);
	
	option.activityId += '';
	
	{//参数检查
		if(!option.activityId){
			alert('请设置LotteryManager.GetGiftCenter.getGiftCenterList：activityId');
			return;
		}
		if(typeof(callback) != 'function'){
			callback = function(ShowGiftCenterObject){
				alert(JsonObject.toString(ShowGiftCenterObject));
			};
		}
	}
	
	var newActivity = option.activityId.split('|').join(',');
	var submitData = {
		'iActivityId' : newActivity,
		'iListPerPage' : option.pageSize,
		'pageNow' : option.pageNow
	};

	var objName = option.activityId.replaceAll('|', '$');
	
	FileLoadManager.ajaxRequest({
		'url' : 'http://apps.game.qq.com/cgi-bin/lottery_MS/activityShowItems.cgi?' + JsonObject.serialize(submitData),
		'dataType' : 'object', //返回的数据类型：object, function
		'dataTypeName' : 'ShowGiftCenterObject_' + objName, //如果dataTypeName设定成功以后的方法
		'showLoadingStr' : '正在获取物品列表信息，请稍侯...',
		'onLoadCompleteEvent' : function(){
			var ShowGiftCenterObject = window['ShowGiftCenterObject_' + objName];
			if(typeof(ShowGiftCenterObject) == 'undefined'){
				ShowGiftCenterObject = {
					'retCode' : '-8000',
					'retInfo' : '网络连接异常，请刷新重试。',
					'pageTotal' : '1',
					'pageNow' : '1',
					'giftCenterList' : []
				};
			}
			if(!ShowGiftCenterObject.pageTotal || isNaN(ShowGiftCenterObject.pageTotal) || parseInt(ShowGiftCenterObject.pageTotal, 10) <= 0){
				ShowGiftCenterObject.pageTotal = 1;
			}
			if(!ShowGiftCenterObject.giftCenterList){
				ShowGiftCenterObject.giftCenterList = [];
			}

			ShowGiftCenterObject = JsonObject.decode(ShowGiftCenterObject);
			
			if(JsonObject.isArray(ShowGiftCenterObject.giftCenterList)){
				for(var i = 0; i < ShowGiftCenterObject.giftCenterList.length; i++){
					var tempGift = ShowGiftCenterObject.giftCenterList[i];
					if(typeof(LotteryManager.GetGiftCenter.DATA.GET_GIFT_DATA[tempGift.iActivityId]) == 'undefined'){
						LotteryManager.GetGiftCenter.DATA.GET_GIFT_DATA[tempGift.iActivityId] = [];
					}
					LotteryManager.GetGiftCenter.DATA.GET_GIFT_DATA[tempGift.iActivityId].push(tempGift);
				}
			}
			//{"retCode":"0","retInfo":"ok","pageNow":"1","pageTotal":"0","giftCenterList":[]}
			
			callback(ShowGiftCenterObject);
		}
	});
};

LotteryManager.GetGiftCenter.DATA = {
	'GET_GIFT_DATA' : {}
};

//点击领取按钮
//{"dtGetTime":"2011%2D12%2D22%2010%3A35%3A29","dtItemEndTime":"2012%2D01%2D31%2023%3A59%3A59","dtRecTime":"0000%2D00%2D00%2000%3A00%3A00","iActivityGetItemCenterType":"0","iActivityId":"409","iId":"19","iNum":"1","iRuleId":"1062","iSrcUin":"2248388401","iStatus":"0","sArea":"","sItemCode":"6112","sItemName":"%E6%9A%97%E5%A4%9C%E8%B4%B5%E6%97%8F%E5%96%87%E5%8F%AD","sServiceType":"r2"}
LotteryManager.GetGiftCenter.prototype.submit = function(opt){
	var _this = this;
	var option = {
		'iId' : ''
	};
	if(typeof(opt) == 'object' && opt){
		option = $extend(option, opt);
	}else{
		option.iId = opt;
	}

	var arrItemObject = LotteryManager.GetGiftCenter.DATA.GET_GIFT_DATA;
	var currentObj = null;

	for(var k in arrItemObject){
		var arrList = arrItemObject[k];
		for(var i = 0; i < arrList.length; i++){
			if(option.iId == arrList[i].iId){
				currentObj = arrList[i];
				break;
			}
		}
		if(currentObj){
			break;
		}
	}
	
	if(!currentObj){
		alert('没有找到该物品。');
		return;
	}
	
	var submitData = {
		'itemAutoId' : option.iId,
		'activityId' : _this.option.activityId,
		'gameId' : '',
		'isQueryRole' : ''
	};
	submitData.gameId = currentObj.sServiceType;
	
	{
		var noQueryRole = currentObj.iActivityGetItemCenterType;//是否要查大区角色信息
		
		submitData.isQueryRole = true;//默认是必须查角色的，所以默认是true
		if(noQueryRole && noQueryRole == '1'){
			submitData.isQueryRole = false;
		}
	}
	LotteryManager.GetGiftCenter.submit(submitData);
};


//直接领取物品
//http://apps.game.qq.com/cgi-bin/lottery_MS/活动号/activityGetItems.cgi?iId=1&sArea=1&sRoleId=xxx&sRoleName=xxx&iGender=xxx
LotteryManager.GetGiftCenter.submit = function(opt, callback){
	var option = {
		'activityId' : '',
		'itemAutoId' : '',
		'gameId' : '',
		'isQueryRole' : true
	};
	option = $extend(option, opt);
	
	{//参数检查
		if(!option.activityId || isNaN(option.activityId)){
			alert('请设置LotteryManager.GetGiftCenter.submit：活动activityId错误。');
			return;
		}
		
		if(!option.itemAutoId || isNaN(option.itemAutoId)){
			alert('请设置LotteryManager.GetGiftCenter.submit：物品iId错误。');
			return;
		}

		if(option.isQueryRole){
			if(!option.gameId){
				alert('请设置LotteryManager.GetGiftCenter.submit：gameId错误，因为要查角色信息。');
				return;
			}
		}
		
		if(typeof(callback) != 'function'){
			callback = function(GetGiftCenterObject){
				if(typeof(GetGiftCenterObject) == 'undefined'){
					GetGiftCenterObject = {
						'retCode' : '-8000',
						'retInfo' : '网络连接异常，请刷新重试。'
					};
				}
				
				if(GetGiftCenterObject.retCode != 0){
					alert(GetGiftCenterObject.retInfo);
					return;
				}
				alert('领取物品成功');
				location.reload();
			};
		}
	}

	var _submitGetGift = function(_submitOption){
		var submitOption = {
			'iId' : option.itemAutoId,
			'sArea' : '',
			'sRoleId' : '',
			'sRoleName' : '',
			'iGender' : ''
		};
		submitOption = JsonObject.extend(submitOption, _submitOption);
		submitOption.iId = option.itemAutoId;		

		FileLoadManager.ajaxRequest({
			'url' : 'http://apps.game.qq.com/cgi-bin/lottery_MS/' + option.activityId + '/activityGetItems.cgi?' + JsonObject.serialize(submitOption),
			'dataType' : 'object', //返回的数据类型：object, function
			'dataTypeName' : 'GetGiftCenter_' + submitOption.iId, //如果dataTypeName设定成功以后的方法
			'showLoadingStr' : '领取物品中，请稍候...',
			'onLoadCompleteEvent' : function(){
				var GetGiftCenterObject = window['GetGiftCenter_' + submitOption.iId];
				if(typeof(GetGiftCenterObject) == 'undefined'){
					GetGiftCenterObject = {
						'retCode' : '-8000',
						'retInfo' : '网络连接异常，请刷新重试。'
					};
				}
				callback(GetGiftCenterObject);
			}
		});
	};

	if(!option.isQueryRole){
		_submitGetGift({});
		return;
	}
	
	var roleSelector = RoleSelector.init({
		'gameId' : option.gameId,
		'isShutdownSubmit' : false
	});

	roleSelector.show({
		'submitEvent' : function(roleObj){
			var newRoleObj = {};
			if(roleObj && roleObj.submitData){
				newRoleObj.sArea = roleObj.submitData.areaid || '';
				newRoleObj.sRoleId = roleObj.submitData.roleid || '';
				newRoleObj.sRoleName = roleObj.submitData.rolename || '';
				newRoleObj.iGender = roleObj.submitData.rolesex || '';
				for(var i in roleObj.submitData){
					newRoleObj[i] = roleObj.submitData[i];
				}
			}
			var submitOption = {};
			for(var i in newRoleObj){
				submitOption[i] = newRoleObj[i];
			}
			_submitGetGift(submitOption);
		}//点击确定以后的函数
	});

};


LotteryManager.GetGiftCenter.init = function(opt){
	if(!opt.activityId){
		alert('请输入活动号activityId');
		return;
	}
	
	window['getGiftCenter_' + opt.activityId] = new LotteryManager.GetGiftCenter(opt);
	return window['getGiftCenter_' + opt.activityId];
};




/*********************************** //物品领取中心JS  *************************************/



/*********************************** 初始化 *************************************/
LotteryManager.init = function(opt){
	opt = opt || {};
	var option = {
		'activityId' : '',
		'gameId' : '',
		'hasCheckLogin' : true,
		'hasGetGiftMain' : true,
		'hasPersonInfo' : true,
		'hasBroadcast' : true,
		'hasMyGiftList' : true,
		'hasGetGiftCenter' : true,
		'hasDebug' : true,
		'CheckLoginOption' : {
			'LoginedCallback' : null//登录成功以后方法
		},
		'GetGiftMainOption' : {
		},
		'PersonInfoOption' : {
			'contentId' : 'personInfoContent', //容器ID
			'buttonId' : 'personSubmitBtn' //提交按钮的ID
		},
		'BroadcastOption' : {
			'scrollstep' : 1,
			'scrollstoptime' : 20
		},
		'MyGiftListOption' : {},
		'GetGiftCenterOption' : {
			'isAutoLoad' : true, //是否自动加载。
			'activityId' : '', //活动的ID
			'gameId' : '',
			'contentId' : 'getGiftCenterContent', //容器ID
			'templateId' : 'getGiftCenterTemplate', //模板ID
			'contentPageId' : 'getGiftCenterPageContent',	//分页容器
			'onGetGiftCompleteEvent' : null
		}
	};
	option = $extend(option, opt);

	if(!option.activityId){
		alert('活动号必须传入哟。');
		return;
	}	
	
	//这个初始化也需要等加载完毕以后才能进行
	(function(){
		/**** 抽奖按钮JS ****/
		if(option.hasGetGiftMain){
			option.GetGiftMainOption.activityId = option.activityId;
			window["getGiftMain_" + option.activityId] = LotteryManager.GetGiftMain.init(option.GetGiftMainOption);
		}
		/*** //抽奖按钮JS ***/
		
		/**** 个人信息填写JS ****/
		if(option.hasPersonInfo){
			option.PersonInfoOption.activityId = option.activityId;
			window["personInfo_" + option.activityId] = LotteryManager.PersonInfo.init(option.PersonInfoOption);
		}
		/*** //个人信息填写JS ***/
		
		/**** 获奖轮播JS ****/
		if(option.hasBroadcast){
			option.BroadcastOption.activityId = option.activityId;
			window["broadcast_" + option.activityId] = LotteryManager.Broadcast.init(option.BroadcastOption);
		}
		/*** //获奖轮播JS ***/
		
		/**** 个人领取记录JS ****/
		if(option.hasMyGiftList){
			option.MyGiftListOption.activityId = option.activityId;
			window["myGiftList_" + option.activityId] = LotteryManager.MyGiftList.init(option.MyGiftListOption);
		}
		/*** //个人领取记录JS ***/
		
		/**** 领取中心JS ****/
		if(option.hasGetGiftCenter){
			option.GetGiftCenterOption.activityId = option.activityId;
			window["getGiftCenter_" + option.activityId] = LotteryManager.GetGiftCenter.init(option.GetGiftCenterOption);
		}
		/*** //领取中心JS ***/
		
		/**** 问题反馈JS ****/
		if(option.hasDebug && typeof(DebugManager) == 'undefined'){
			FileLoadManager.ajaxRequest({
				'url' : 'http://ossweb-img.qq.com/images/js/activitymanager/debugmanager.js',
				'cache' : true,
				'dataType' : 'object', //返回的数据类型：object, function
				'dataTypeName' : 'DebugManager', //如果dataTypeName设定成功以后的方法
				'isUseDefaultLoadType' : true,
				'showLoadingStr' : ''
			});
		}
		/*** //问题反馈JS ***/
		
		/**** 用户登录JS ****/
		if(option.hasCheckLogin){
			if(typeof(LoginManager.isSetCheckLoginForPage) == 'undefined' || (typeof(option.CheckLoginOption) == 'object' && typeof(option.CheckLoginOption.LoginedCallback) == 'function')){
				//运行统一的登录只有两种可能：1、页面中还未运行 2、该对象中有登录后需要运行的方法。
				//优点是减少运行查询的次数：
				LoginManager.checkLogin(function(){
					if(typeof(LoginManager.isSetCheckLoginForPage) == 'undefined'){
						if($$("#login_qq_span").length == 1){
							var qqNum = LoginManager.getUserUin();
							$$("#login_qq_span").html(qqNum);
						}
						if($$("#login_nickName_span").length == 1){
							LoginManager.getNickName(function(opt){
								if(opt.isLogin){
									$$("#login_nickName_span").html(opt.nickName);
								}
							});
						}
						
						if($$('#qqgame_diamond_content').length == 1){
							LoginManager.getUserDiamond('qqgame');
						}
					}
		
					if(typeof(option.CheckLoginOption) == 'object' && typeof(option.CheckLoginOption.LoginedCallback) == 'function'){
						option.CheckLoginOption.LoginedCallback();
					}
				});
				
				LoginManager.isSetCheckLoginForPage = true;
			}
		}
		/**** //用户登录JS ****/
	})();
};

/*********************************** //初始化 *************************************/





/*********************************** 支付类活动 *************************************/
if(typeof(LotteryManager.PaymentManager) == 'undefined'){
	LotteryManager.PaymentManager = {};
}

LotteryManager.GetGiftMain.prototype.__submit_safety_check = function(ruleId, iType){
	var _this = this;
	
	var gameId = _this.config.gameId;
	if(!gameId){
		alert('支付需要传入业务ID');
		return;
	}
	var satetyID = gameId + '_webplat';
	
	var _url = 'http://apps.game.qq.com/comm-cgi-bin/iframe_encry_tool/safety_check.cgi';
	var submitData = {
		'SatetyID' : satetyID.toUpperCase(),
		'itype' : iType || 1
	};
	
	
	var safetyFloater = FloaterManager.init();
	
	LotteryManager.GetGiftMain.noCheckUin = false;
	LotteryManager.PaymentManager.callback = function(str){
		LotteryManager.GetGiftMain.noCheckUin = true;
		safetyFloater.close();
		var obj = JsonObject.unserialize(str);
		if(!obj.dna_result_key){
			alert('安全验证信息失败，请您稍后访问...');
			$$('#SAFE__CHECK__IFRAME').attr('src', '').hide();
			location.reload();
			return;
		}
		
		_this.setOutData(obj);
		_this._getGiftSubmit(ruleId);
	};
	
	safetyFloater.ajaxLoading('正在提交安全验证信息，请勿刷新页面...');
	
	var __url = _url + '?' + JsonObject.serialize(submitData);
	
	var iframe = null;
	{//建立填充对象
		if(document.getElementById('SAFE__CHECK__IFRAME')){
			iframe = document.getElementById('SAFE__CHECK__IFRAME');
		}else{
			var isIE = navigator.userAgent.toLowerCase().indexOf("msie") != -1 ? true : false;
			if (isIE){
				try{
					iframe = document.createElement('<iframe id="SAFE__CHECK__IFRAME" name="SAFE__CHECK__IFRAME" width="370" height="300" src="about:blank" frameborder="0" allowtransparency="yes" scrolling="no" style="display:none;"></iframe>');
				}catch(e){}
			}
			if(!iframe){
				iframe = document.createElement('iframe');
				iframe.setAttribute("id", 'SAFE__CHECK__IFRAME');
				iframe.setAttribute("name", 'SAFE__CHECK__IFRAME');
				iframe.setAttribute("src", 'about:blank');
				iframe.setAttribute("frameborder", '0');
				iframe.setAttribute("allowtransparency", 'yes');
				iframe.setAttribute("scrolling", 'no');
				iframe.style.display = 'none';
			}
			document.body.appendChild(iframe);
		}
		iframe.style.display = 'none';
	}

	$$(iframe).attr('src', __url).load(function(){
		if (LotteryManager.GetGiftMain.noCheckUin){
			$$(this).hide();
		}else{
			$$(this).css('width', '370px').css('height', '300px');
			var safetyFloater2 = FloaterManager.init({
				'type' : 'dom',
				'content' : 'SAFE__CHECK__IFRAME'
			});
			safetyFloater2.show();
		}
	});

};

/*********************************** //支付类活动 *************************************/



/*********************************** cdkey类活动 *************************************/
if(typeof(LotteryManager.cdkeyManager) == 'undefined'){
	LotteryManager.cdkeyManager = {};
}

//是否是cdkey检查。。
LotteryManager.GetGiftMain.prototype.__submit_cdkey_check = function(ruleId, LotteryData){
	var _this = this;
	var activityId = _this.option.activityId;
	
	if(!ruleId){
		ruleId = '';
		for(var i = 0; i < LotteryData.tbRules.length; i++){
			if(LotteryData.tbRules[i].tbPackages.length != 1){
				continue;
			}
			
			for(var j = 0; j < LotteryData.tbRules[i].tbPackages.length; j++){
				var onePackage = LotteryData.tbRules[i].tbPackages[j];
				if(onePackage.tbItems.length == 1 && onePackage.tbItems[0].sItemType == -103){
					ruleId = LotteryData.tbRules[i].iRuleId;
					break;
				}
			}
			if(ruleId){
				break;
			}
		}
		if(!ruleId){
			return false;
		}
	}
	
	var packageList = [];
	for(var i = 0; i < LotteryData.tbRules.length; i++){
		var tempRuleId = LotteryData.tbRules[i].iRuleId;
		if(tempRuleId == ruleId){
			packageList = LotteryData.tbRules[i].tbPackages;
			break;
		}
	}
	if(packageList.length != 1 || packageList[0].tbItems.length != 1){
		return false;
	}
	
	if(packageList[0].tbItems[0].sItemType != -103){
		return false;
	}
	//以下就表示存在cdkey礼包的情况了。
	LotteryManager.cdkeyManager.submit(activityId, ruleId);
	return true;
};

//礼包与规则的对应关系，与活动号相关，如活动号为25，礼包名为‘好礼包’，规则id为334，则为
//{'25' : [{'sPackageName' ： '好礼包', 'iRuleId' : '334'}]} 的对应关系
LotteryManager.cdkeyManager.__packageMap = {};

LotteryManager.cdkeyManager.submit = function(activityId, ruleId){
	var getGiftMainObject = window['getGiftMain_' + activityId];
	
	//1、首先判断是否登录
	if(!LoginManager.isLogin()){
		LoginManager.login();
		return;
	}

	var __init = null;
	{//初始化礼包对应关系
		__init = function(callback){
			if(LotteryManager.cdkeyManager.__packageMap['' + activityId]){
				callback();
				return;
			}
			
			LotteryManager.cdkeyManager.__packageMap['' + activityId] = [];
			getGiftMainObject._loadJsFile(function(LotteryData){
				for(var i = 0; i < LotteryData.tbRules.length; i++){
					for(var j = 0; j < LotteryData.tbRules[i].tbPackages.length; j++){
						var onepackage = LotteryData.tbRules[i].tbPackages[j];
						LotteryManager.cdkeyManager.__packageMap['' + activityId].push({
							'iPackageId' : onepackage.iPackageId,
							'sPackageName' : onepackage.sPackageName,
							'iRuleId' : LotteryData.tbRules[i].iRuleId,
							'iUin' : LoginManager.getUserUin(),
							'sPackageOtherInfo' : ''
						});
					}
				}
				callback();
			});
		};
	}
	
	var onGetGiftSuccessEvent = getGiftMainObject.option.onGetGiftSuccessEvent;
	
	//2、如果已经登录，则需要判断是否已经领取过了
	__init(function(){
		
		var _getLotteryData = function(ruleId){
			var userUin = LoginManager.getUserUin();
			var packageList = LotteryManager.cdkeyManager.__packageMap['' + activityId];
			for(var j = 0; j < packageList.length; j++){
				var onepackage = packageList[j];
				if(userUin == onepackage.iUin &&
				   ruleId == onepackage.iRuleId &&
				   onepackage.sPackageOtherInfo){
					//3、成功领取过了。
					onGetGiftSuccessEvent({
						'retCode' : '0',
						'retInfo' : '',
						'iActivityId' : activityId,
						
						'iRuleId' : onepackage.iRuleId,
						'iRuleSetId' : '',
						'iPackageId' : onepackage.iPackageId,
						'sPackageName' : onepackage.sPackageName,
						'iPackageType' : '2',
						'sPackageOtherInfo' : onepackage.sPackageOtherInfo
					});
					return;
				}
			}
			
			LoginManager.reloadLogin(function(){
				//4、没有获得，则拉取个人列表看看。
				LotteryManager.MyGiftList.getMyGiftListByActivityId({
					'activityId' : activityId,
					'isForce' : true,
					'pageSize' : 500
				}, function(myGiftObject){
					//获取以后加入到新的列表中去
					var userUin = LoginManager.getUserUin();
					var packageList = LotteryManager.cdkeyManager.__packageMap['' + activityId];
					
					if(myGiftObject.myGiftList.length > 0){
						for(var i = 0; i < myGiftObject.myGiftList.length; i++){
							var oneMyGift = myGiftObject.myGiftList[i];
							
							for(var j = 0; j < packageList.length; j++){
								var onepackage = packageList[j];
								if(oneMyGift.iActivityId == activityId &&
								   oneMyGift.sPackageName == onepackage.sPackageName &&
								   oneMyGift.sCdkey){
									onepackage.sPackageOtherInfo = oneMyGift.sCdkey;
								}
							}
						}
					}
	
					for(var j = 0; j < packageList.length; j++){
						var onepackage = packageList[j];
						if(userUin == onepackage.iUin &&
						   ruleId == onepackage.iRuleId &&
						   onepackage.sPackageOtherInfo){
							//5、列表中表示成功领取过了。
							onGetGiftSuccessEvent({
								'retCode' : '0',
								'retInfo' : '',
								'iActivityId' : activityId,
								
								'iRuleId' : onepackage.iRuleId,
								'iRuleSetId' : '',
								'iPackageId' : onepackage.iPackageId,
								'sPackageName' : onepackage.sPackageName,
								'iPackageType' : '2',
								'sPackageOtherInfo' : onepackage.sPackageOtherInfo
							});
							return;
						}
					}
					
					//6、如果仍然没有领取，则直接去领取即可。
					getGiftMainObject._getGiftSubmit(ruleId);
				});
			});
		};
		
		
		
		
		if(!ruleId){
			//如果没有规则ID，则直接使用默认第一个。
			getGiftMainObject._loadJsFile(function(LotteryData){
				ruleId = LotteryData.tbRules[0].iRuleId;
				_getLotteryData(ruleId);
			});
			return;
		}
		
		_getLotteryData(ruleId);
		
	});

	
};

/*********************************** //cdkey类活动 *************************************/


