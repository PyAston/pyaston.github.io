/**
 * �齱��ȡƽ̨ǰ��js�ļ�
 * @author tiantian
 */
if(location.href.indexOf('qq.com') >= 0){
	document.domain = 'qq.com';
}

(function(){
	var JS_FILE_LIST = {
		'LoginManager' : 'http://ossweb-img.qq.com/images/js/login/loginmanagerv3.js', //��Ҫ���ص�¼js
		'RoleSelector' : 'http://ossweb-img.qq.com/images/js/roleselector/roleselectorv3.js', //��ɫѡ��
		'$onload' : 'http://ossweb-img.qq.com/images/script/com/qq/basic/basic.js', //ֻ���°汾�����������
		'oss_base' : 'http://gameact.qq.com/comm-htdocs/js/oss_base.js', //oss_base		
		'ProvinceCitySelect' : 'http://gameact.qq.com/comm-htdocs/js/province_city_select.js'  //ѡ����ݺͳ���			
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
		'title': '��ʾ��Ϣ',
		'content' : str+''
	}, fun);
};

//���е����ݻ��档
LotteryManager._DataService = {
	'ALL_JOIN_GIFT_OBJECT' : [], //���в���������������������
	'ALL_LOTTERY_OBJECT' : {} //ȡ�����л�Ļ�����Ϣ
};
/**========================================================== �ṩ�Ĺ�������JS ==========================================================**/
//���ظ�ҳ������л������Ϣ��
LotteryManager._loadAllLotteryObject = function(activityIdList, callback){
	if(typeof(callback) != 'function'){
		callback = function(obj){
			alert('LotteryManager.loadAllLotteryObject��' + JsonObject.toString(obj));
		};
	}
	var _this = this;
	
	//����һ���ݹ麯����������
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

	//����һ���ݹ麯����������
	var _allLen = arrActivityId.length;
	var currentIndex = 0;

	var _getAllFunction = function(){
		//����ɹ���ֱ�ӷ���
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
		
		//��ʾ���ڼ����У���û��Ҫ�ظ������ˡ�
		if(LotteryManager._DataService.ALL_LOTTERY_OBJECT[_activityId] === null){
			return;
		}
		//��ʾû���ҵ��Ķ���
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

//���ݲ�ͬ����ID��ѯ��������ܺͺ�ʣ����; arrChannelId�����|�ָ�
LotteryManager.getUserPointById = function(serviceType, arrChannelId, callback){
	if(!LoginManager.isLogin()){
		LoginManager.login();
		return;
	}
	
	var serviceType = serviceType+'' || '';
	var arrChannelId = arrChannelId+'' || '';
	if(!serviceType){
		alert('ҵ������δ����');
		return;
	}
	//���˵��������ֵĴ���Id;
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
		alert('����IDδ����');
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
		'dataType' : 'object', //���ص��������ͣ�object, function
		'dataTypeName' : 'queryUserJiFen_result', //���dataTypeName�趨�ɹ��Ժ�ķ���
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

//ȡ�òμӵ���������ȡ�����������
LotteryManager.getAllJoinAndGiftNumber = function(activityId, callback){
	if(typeof(callback) != 'function'){
		callback = function(obj){
			alert('�û�μ������Ķ���Ϊ:' + JsonObject.toString(obj));
		};
	}
	var submitData = {
		'activityId' : activityId,
		'joinActNum' : 0,//�μӻ����
		'joinActTimes' : 0,//�����˴�
		'getGiftNum' : 0 //ȡ���������
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
	//���û�����ѯ
	FileLoadManager.ajaxRequest({
		'url' : 'http://gameact.qq.com/act/lottery_ms/activityConditionSoFar.js',
		'dataType' : 'object', //���ص��������ͣ�object, function
		'dataTypeName' : '_MS_Statistic', //���dataTypeName�趨�ɹ��Ժ�ķ���
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

/**========================================================== //�������� ==========================================================**/
LotteryManager.loadAllLotteryObject = LotteryManager._loadAllLotteryObject;


/**========================================================== //��ģ�鷽��JS ==========================================================**/

/**========================================================== �ṩ���������齱����JS ==========================================================**/
LotteryManager.GetGiftMain = function(opt){
	this.option = {
		'activityId' : -1, //�ID
		'onGetGiftSuccessEvent' : null, //ȡ������ɹ��ķ���
		'onGetGiftFailureEvent' : null, //ȡ�����ʧ�ܵķ���
		'isQueryRole' : true, //�Ƿ���Ҫ��ѯ��ɫ��Ϣ(����ѻ�ȡ��ɫ��Ϣ����������Ϊfalse)
		'outData' : {} //��ѯʱ����Ҫ�ύ���ⲿ�Ķ�����Ϣ
	};
	
	this.config = {
		'gameId' : '',
		'isOnlyOneCdkey' : false,
		'isQueryRoleCache' : false, //��ѯ��ɫ�Ƿ�cookie������һ��ֵ
		'onBeginGetRoleEvent' : null, //��ʼ��ѯ��ɫ����
		'onBeginGetGiftEvent' : null, //��ʼ�齱��ť������Ĭ��ajaxLoading('���Ժ��������ڼ����С�')
		'submitData' : '', //�����ϴ���Ϣ����
		
		'_frequencyLimitTime' : 2000, //Ƶ������ʱ�䣬��λΪ������
		'_clickStartTime' : +new Date, //��¼��ʼ�����ʱ��
		'_canClickBtn' : true, //�Ƿ���Ե����ť
		'codeContentId' : '', //��֤��������������
		'imageContentId' : '' //��֤��ͼƬ��������
	};
	var _this = this;
	_this.option = $extend(_this.option, opt);
	_this.config = $extend(_this.config, opt);
	
	{//�Բ������м��
		if(!_this.option.activityId || isNaN(_this.option.activityId) || _this.option.activityId*1 <= 0){
			alert('�ID���ô���activityId ��' + _this.option.activityId);
			return;
		}
		if(typeof(_this.option.onGetGiftSuccessEvent) != 'function'){
			_this.setGetGiftSuccessEvent();
		}
		if(typeof(_this.option.onGetGiftFailureEvent) != 'function'){
			_this.setGetGiftFailureEvent();
		}
	}
	
	_this._loadJsFile(); //����Ĭ��js�ļ�
};


{//���óɹ���ʧ�ܵķ���
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
			//�����cdkey�Ļ�
			if(callbackObj.iPackageType == 2){
				LotteryManager.alert('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); alert(\'���Ƴɹ���\');">');
				return;
			}
			
			//ʵ��
			var isRealGoods = false;
			if(callbackObj.iPackageType == 1){
				/*
				 * 0��������Ϸ��Ʒ
				 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
				 * 2��cdkey
				 */
				isRealGoods = true;
			}
			
			var str = "��ϲ������� " + callbackObj.sPackageName + "!";
			if(callbackObj.iPackageType == 2){
				str = "��ϲ������� " + callbackObj.sPackageName + " : " + callbackObj.sPackageOtherInfo + "!";
			}
			if(isRealGoods){
				str += "����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����";
			}else{
				str += "����ע����գ�";
			}
			LotteryManager.alert(str, function(){
				if(isRealGoods){
					var activityId = callbackObj.iActivityId;
					//���Ϊʵ��򵯳�ʵ����д��
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


{//�ⲿ����
	//�����ⲿ��������ݣ������ݽ���Ϊ��׼ȷ��ֵ��
	LotteryManager.GetGiftMain.prototype.setOutData = function(data){
		var _this = this;
		_this.option.outData = $extend(_this.option.outData, data);
	};
	//ȡ��ǰһ���ύ�Ĳ���ֵ
	LotteryManager.GetGiftMain.prototype.getSubmitData = function(){
		var _this = this;
		return _this.config.submitData;
	};
	// ȡ��Cookie�еĴ�������ɫ��Ϣ
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
	
	// ����Cookie��������ɫ��Ϣ
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
			
			{//Ĭ������
				newData['iActivityId'] = iActivityId;
				newData['iUin'] = iUin;
			}
			var queryStr = JsonObject.serialize(newData);
			CookieManager.setCookie('GET_GIFT_ROLE_DATA', queryStr, 60*12);//����ʱ��
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
	
	//�ύ����
	LotteryManager.GetGiftMain.prototype.submit = function(ruleId){
		var _this = this;
		//��ѯʱ������Ƿ��¼
		LoginManager.reloadLogin(function(){
			{//���2��֮���ǲ����ظ��ύ�ġ�
				var time_ = _this.config._frequencyLimitTime;
				var timeDifference = +new Date - _this.config._clickStartTime*1;
				if(timeDifference < time_){
					return;
				}
				_this.config._clickStartTime = +new Date;
			}
			_this._loadJsFile(function(LotteryData){
				if(LotteryData.iNeedVerify != 0){
					//��Ҫ��֤��
					var flag = _this._checkVerifyCode();
					if(!flag){
						return;
					}
				}
				
				//���Ƿ���cdkey���
				if(_this.config.isOnlyOneCdkey){
					if(_this.__submit_cdkey_check(ruleId, LotteryData)){
						return;
					}
				}
				
				
				if(LotteryData.sActivityExpliciteClassification == 'paymentactivity'){
					if(!ruleId){
						/*
						if(LotteryData.tbRules.length != 1){
							alert('֧�����ͱ��봫�����ID');
							return;
						}
						ruleId = LotteryData.tbRules[0].iRuleId;
						*/
					}
					
					var type = 1;
					{//ȡ��Q�Ҹ���
						for(var i = 0; i < LotteryData.tbRules.length; i++){
							if(ruleId == LotteryData.tbRules[i].iRuleId){
								var len = LotteryData.tbRules[i].tbOneRules.length - 1;
								var tempReturn = LotteryData.tbRules[i].tbOneRules[len].tbConditions[0].sReturnValues;
								type = tempReturn.split('|')[1];
								break;
							}
						}
					}
					_this.__submit_safety_check(ruleId, type);//֧������
				}else{
					_this._getGiftSubmit(ruleId);//��ͨ�
				}
			});
	
		});
	};
}

{//�ڲ�Ĭ�Ϸ���
	//��ʼ����֤��
	LotteryManager.GetGiftMain.__initVerifyCode = function(activityId, codeContentId, imageContentId){
		if(!activityId || !codeContentId || !imageContentId){
			alert('�����������LotteryManager.GetGiftMain.__initVerifyCode(activityId, codeContentId, imageContentId)���������������봫�롣');
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
			alert('�ڲ�����ֱ�Ӷഫ�������������� codeContentId, imageContentId��');
			return;
		}
		var submitData = {
			'aid' : '21000104',
			'_' : randomInt(1000)
		};
		var _url = 'http://ptlogin2.qq.com/getimage?' + JsonObject.serialize(submitData);
		$$('#' + verifycodeImageContentId).html('<a href="#t" title="�����������һ��" onclick="LotteryManager.GetGiftMain._changeImage(\''+verifycodeImageContentId+'\');"><img style="border:0px;" src="'+_url+'"></a>');
	};
	
	//������֤��
	LotteryManager.GetGiftMain.prototype._checkVerifyCode = function(){
		var codeContentId = this.config.codeContentId;
		if(!codeContentId){
			alert('�ڲ�����ֱ�Ӷഫ�������������� codeContentId, imageContentId��');
			return false;
		}
		var verifyCode = $$('#' + codeContentId).val();
		
		if(!verifyCode){
			alert('������֤����Ϣδ���롣');
			return false;
		}
		if(verifyCode.length != 4){
			alert('������֤����Ϣ��д����');
			return false;
		}
		this.setOutData({
			'sVerifyCode' : verifyCode,
			'iVerifyId' : '21000104'
		});
		return true;
	};
	//ҳ���ʼ������
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
	
	//ֱ����ȡ���߳齱��Ʒ�ķ���
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

		{//���ݼ��
			if(!option.iActivityId){
				alert('�齱����δ����id');
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

		{//�ύ����
			LotteryManager.GetGiftMain['callback_' + option.iActivityId] = callbackFunction;
			window['LotteryActivityCallback_' + option.iActivityId] = function(retObj){
				if(JsonObject.isFunction(LotteryManager.GetGiftMain['callback_' + retObj.iActivityId])){
					retObj = JsonObject.decode(retObj);
					LotteryManager.GetGiftMain['callback_' + retObj.iActivityId](retObj);
				}
			};

			FileLoadManager.ajaxRequest({
				'url' : _url,
				'dataType' : 'function', //���ص��������ͣ�object, function
				'dataTypeName' : 'LotteryActivityCallback_' + option.iActivityId, //���dataTypeName�趨�ɹ��Ժ�ķ���
				'showLoadingStr' : '',
				'onLoadSuccessEvent' : function(){}
			});
		}
	};
	
	LotteryManager.GetGiftMain.prototype._getGiftFunction = function(opt){
		var _this = this;
		opt = opt || {};
		opt = $extend(opt, _this.option.outData);
		
		
		{//��ʼ��
			opt.sServiceType = _this.config.gameId || '';
		}
		
		{//��Ҫ�Բ������й��˵���
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
				LotteryManager.GetGiftMain.getGiftLoading.ajaxLoading('���Ժ����������ύ�У�����ˢ��ҳ��...');
				return false;
			};
		}
		if(_this.option.onBeginGetGiftEvent(opt)){
			return;
		}
		
		//����ͬһʱ�����������ȥ
		if(!_this.config._canClickBtn){
			return;
		}

		_this.config._canClickBtn = false;
		_this.config.submitData = opt; //�����ύ�Ĳ����������Ժ�ʹ��

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
			}//���ȷ���Ժ�ĺ���
		});
		roleSelector.show();
	};
	
	LotteryManager.GetGiftMain.prototype._getGiftSubmit = function(ruleId, submitData){
		var _this = this;
		
		ruleId = ruleId || '';
		submitData = submitData || {}; //�ύ����
		
		{//��������
			{//����ύ����
				submitData.iActivityId = _this.option.activityId;
			}

			if(ruleId){//�����ruleId,������֤ruleId����ȷ��
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
							alert('���õĹ���Ϊ��'+ruleId+'������ruleId�����ˣ���ȷ��ruleId�б�Ϊ��' + arrAllRuleId.join(',') + '����������ȷ������Ĺ���ID��');
						}else{
							alert('�ûû��������Ӧ�Ĺ��򣬲��ܴ���ruleId��');
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
		
		//�����ɫ
		if(!_this.option.isQueryRole){
			_this._getGiftFunction(submitData);
			return;
		}

		//����л�����ƣ�������Ҫ��ѯ��ɫ�����
		if(_this.option.isQueryRoleCache){
			var roleObj = LotteryManager.GetGiftMain.getRoleFromCookie(_this.option.activityId);
			if(roleObj){
				//��ͬ��ɫ��Ϣ�ϲ�
				for(var i in roleObj){
					submitData[i] = roleObj[i];
				}
				//��ѯ���ɫ��ȡ��������Ϣ���������Ʒ��ȡ������
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
		alert('��������activityId');
		return;
	}
	window['getGiftMain_' + opt.activityId] = new LotteryManager.GetGiftMain(opt);
	
	{//���Ƿ���Ҫ��ʼ����֤�������
		if(opt.codeContentId && opt.imageContentId){
			LotteryManager.GetGiftMain.__initVerifyCode(opt.activityId, opt.codeContentId, opt.imageContentId);
		}
	}

	return window['getGiftMain_' + opt.activityId];
};

/**========================================================== //�ṩ���������齱����JS ==========================================================**/



/**========================================================== �ṩ�ĸ�����Ϣ��д����JS ==========================================================**/
LotteryManager.PersonInfo = function(opt){
	this.option = {
		'activityId' : '', //���ID
		'contentId' : 'personInfoContent_' + opt.activityId, //����ID
		'buttonId' : 'personSubmitBtn_' + opt.activityId, //�ύ��ť��ID
		'onSubmitSuccessEvent' : null,
		'onSubmitFailureEvent' : null,
		'onSubmitCompleteEvent' : null //�ɹ����������Ҫִ�еĺ���
	};
	var _this = this;
	_this.option = $extend(_this.option, opt);
	
	{//�����ݽ��м��
		if(!_this.option.activityId){
			//alert('������Ϣ�ID:activityIdδ����');
			return;
		}
		if(!_this.option.contentId){
			//alert('������Ϣ����ID:contentIdδ����');
			return;
		}
		if($$("[id='"+_this.option.contentId+"']").length != 1){
			//alert('������Ϣ����ID��contentId���ô���ҳ�����������ҽ���һ��Ԫ�أ�' + _this.option.contentId);
			return;
		}
	}
};

//�ύ����
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

//չʾҳ��
LotteryManager.PersonInfo.prototype.show = function(){
	var _this = this;
	if(!_this.option.buttonId){
		alert('������Ϣ����ID:buttonId���ô���');
		return;
	}
	LoginManager.submitLogin(function(){
		if(ProvinceCitySelect){
			ProvinceCitySelect.create([document.getElementById("province"),document.getElementById("city")], 
				[
					{t:"��ѡ��ʡ��",v:"",opt_data_array:
						[
							{t:"��ѡ�����",v:""}
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
	{//�����ݽ��м��
		if(!contentId){
			alert('������Ϣ����ID:contentId���ô���');
			return;
		}
		if($$("[id='"+contentId+"']").length != 1){
			alert('������Ϣ����ID��contentId���ô���,ֻ��Ϊһ��' + contentId);
			return;
		}
	}
	var personInfoFloater = FloaterManager.init({
		'type' : 'dom',
		'content' : contentId //��Ҫ��ʾ������
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
	
	{//�����ݽ��м��
		if(!option.activityId){
			alert('������Ϣ�ID:activityIdδ����');
			return;
		}
		if(!option.serviceType){
			alert('������Ϣ�ID:serviceTypeδ����');
			return;
		}
		if(!option.contentId){
			alert('������Ϣ����ID:contentId���ô���');
			return;
		}
		if($$("[id='"+option.contentId+"']").length != 1){
			alert('������Ϣ����ID��contentId���ô���' + option.contentId);
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
				if(!_val){alert("��������Ϊ�ա�"); return;}
				if(_val.cLen() > 30){alert("�������Ȳ��ܳ���30���ֽڡ�"); return;}
				_arrStr.push('������'+_val);
				break;
			}
			case 'sIdentity':{
				if(!_val){alert("���֤���벻��Ϊ�ա�"); return;}
				if(_val.cLen() > 20){alert("���֤���벻�ܳ���20���ֽڡ�"); return;}
				_arrStr.push('���֤���룺'+_val);
				break;
			}
			case 'sMobile':{
				if(!_val){alert("�ֻ����벻��Ϊ�ա�"); return;}
				if(isNaN(_val) || _val.indexOf('.') >= 0){alert("�ֻ��������Ϊ���֡�"); return;}
				_arrStr.push('�ֻ����룺'+_val);
				break;
			}
			case 'sProvince':{
				if(!_val){alert("��ѡ��ʡ�ݡ�"); return;}
				_arrStr.push('ʡ�ݣ�'+ProvinceCitySelect.GetProvinceDesc(_val));
				break;
			}
			case 'sCity':{
				if(!_val){alert("��ѡ����С�"); return;}
				_arrStr.push('���У�'+ProvinceCitySelect.GetCityDesc(_val));
				break;
			}
			case 'sAddress':{
				if(!_val){alert("��ϸ��ַ����Ϊ�ա�"); return;}
				if(_val.cLen() > 100){alert("��ϸ��ַ���ܳ���100���ֽڡ�"); return;}
				_arrStr.push('��ϸ��ַ��'+_val);
				break;
			}
			case 'sPostCode':{
				if(!_val){alert("�������벻��Ϊ�ա�"); return;}
				if(_val.cLen() > 8){alert("�������벻�ܳ���8���ֽڡ�"); return;}
				if(isNaN(_val) || _val.indexOf('.') >= 0){alert("�����������Ϊ���֡�"); return;}
				_arrStr.push('�������룺'+_val);
				break;
			}
			default : {
				_arrStr.push(i + '��'+_val);
			}
		}
	}
	
	{//ȷ���ύ
		if(!confirm("��ȷ��������Ϣ�������д��������¹ٷ��޷���ϵ�ϻ��ˣ��ٷ������е������Ρ�\r\n" + _arrStr.join('\r\n'))){
			return;
		}
		
		_data.iActivityId = option.activityId;
		_data.sServiceType = option.serviceType;
		_data.sProvince = ProvinceCitySelect.GetProvinceDesc(_data.sProvince);
		_data.sCity = ProvinceCitySelect.GetCityDesc(_data.sCity);
		
		var _url = 'http://apps.game.qq.com/cgi-bin/lottery_MS/getPersonalInfo.cgi?' + JsonObject.serialize(_data);
		FileLoadManager.ajaxRequest({
			'url' : _url,
			'dataType' : 'object', //���ص��������ͣ�object, function
			'dataTypeName' : 'PersonalInfo_' + option.activityId, //���dataTypeName�趨�ɹ��Ժ�ķ���
			'showLoadingStr' : '�����ϴ�������Ϣ�����Ժ�...',
			'onLoadCompleteEvent' : function(){
				if(typeof(option.onSubmitSuccessEvent) != 'function'){
					option.onSubmitSuccessEvent = function(PersonalInfo){
						alert('��Ϣ�ϴ��ɹ���');
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
						'retInfo' : '������Ϣ�ϴ�ʧ�ܣ���ˢ��ҳ������'
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
		alert('LotteryManager.PersonInfo.init��������activityId');
		return;
	}
	window['personInfo_' + opt.activityId] = new LotteryManager.PersonInfo(opt);
	return window['personInfo_' + opt.activityId];
};

/**========================================================== //�ṩ�ĸ�����Ϣ��д����JS ==========================================================**/



/**========================================================== �ṩ���ֲ�����JS ==========================================================**/
LotteryManager.Broadcast = function(opt){
	//��������
	this.option = {
		'onlyOneBroadcast' : true, //�����Ƿ���ȡ�����ֲ���ϢΪһ��������ж���������ֵ����Ϊfalse
		'activityId' : '', //���ID��������|����
		'contentId' : 'broadcastContent', //����ID
		'templateId' : 'broadcastTemplate', //ģ��ID
		'isAutoRun' : true, //�Ƿ��Զ�����
		'onLoadCompleteEvent' : null, //��ʾ����Ժ�ķ�����
		
		'scrollstep' : 1, //ÿ���ƶ�������
		'scrollstoptime' : 20 //���ʱ��(����)
	};
	var _this = this;
	_this.option = $extend(_this.option, opt);

	{//�����ݽ��м��
		if(!_this.option.contentId || $$("[id='"+_this.option.contentId+"']").length != 1){
			//alert('�ֲ�����ID��contentId���ô�����ȷ��ҳ�������ҽ���һ��contentId:' + _this.option.contentId);
			return;
		}
		if(!_this.option.activityId){
			//alert('�ֲ��ID:activityIdδ����');
			return;
		}
		if(!_this.option.templateId){
			//alert('�ֲ��ģ��ID:templateIdδ����');
			return;
		}
	}
	
	if(!_this.option.onlyOneBroadcast){//�����һ������Ϊfalse,��ȫ�ֵ�Ϊfalse��
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

	//ֻʹ�õ�ǰ���ֲ�
	LotteryManager.Broadcast._getAllBroadcastList(_this.option.activityId+'', function(AllBroadcastList){
		_this._fillAllBroadcastListResult(AllBroadcastList);
	});
	
};
//ȫ�ֱ�����Ĭ��ҳ���Ƿ�ֻ��һ���ֲ�
LotteryManager.Broadcast.onlyOneBroadcast = true;
LotteryManager.Broadcast.ALL_LOTTERY_OBJECT = {};


//��ȡҳ�������л��Ϣ��Ȼ�������Щ���Ҫ�õ��ֲ���
LotteryManager.Broadcast._getAllBroadcastActivityId = function(callback){
	if(!JsonObject.isFunction(callback)){
		callback = function(activityIdList){
			alert(activityIdList);
		};
	}
	
	//ȡ��������Ч�ĻID
	var allUsedActivityId = function(){
		{//���ȿ��Ƿ�����ID
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
			
			//�������лIDȥ���Ƿ��������������ʾ�ֲ�
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

//ͨ�����ȡ���ֲ��б���Ϣ��
LotteryManager.Broadcast._getAllBroadcastList = function(activityIdList, callback){
	if(typeof(callback) != 'function'){
		callback = function(obj){
			alert('LotteryManager.Broadcast._getBroadcastList��' + JsonObject.toString(obj));
		};
	}
	
	if(!activityIdList){
		alert('LotteryManager.Broadcast._getBroadcastList:activityIdListδ����');
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

	//����һ���ݹ麯����������
	var _allLen = arrActivityId.length;
	var currentIndex = 0;
	var _getAllFunction = function(){
		//����ɹ���ֱ�ӷ���
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


//��ȡ�ɹ��Ժ�ķ���
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
			'contentId' : _this.option.contentId, //����ID
			'scrollstep' : _this.option.scrollstep, //ÿ���ƶ�������
			'scrollstoptime' : _this.option.scrollstoptime //���ʱ��(����)
		});
	}
};


//���ݶ����Ż�ȡ�����ֲ��б�
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

//�����ֲ�����Ч��
LotteryManager.Broadcast.setAutoRunAction = function(opt){
	var option = {
		'contentId' : '', //����ID
		'scrollstep' : 1, //ÿ���ƶ�������
		'scrollstoptime' : 20 //���ʱ��(����)
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
		alert('��������activityId');
		return;
	}
	window['broadcast_' + opt.activityId] = new LotteryManager.Broadcast(opt);
	return window['broadcast_' + opt.activityId];
};
/**========================================================== //�ṩ���ֲ�����JS ==========================================================**/



/**========================================================== �鿴���˽�Ʒ��ϢJS ==========================================================**/
LotteryManager.MyGiftList = function(opt){
	this.option = {
		'activityId' : '', //���ID
		'gameId' : '',
		'contentId' : 'getGiftContent', //����ID
		'templateId' : 'getGiftTemplate', //ģ��ID
		'contentPageId' : 'getGiftPageContent'	//��ҳ����
	};

	this.config = {
		pageSize : 10, //������Ҫ��ʾ������
		GET_TEMP_HTML : '', //����ģ���ļ�
		GET_GIFT_DATA : null //��������
	};
	
	var _this = this;
	_this.option = $extend(_this.option, opt);
	_this.config = $extend(_this.config, opt);
		
	{//�����ݽ��м��
		if(!_this.option.contentId || $$("[id='"+_this.option.contentId+"']").length != 1){
			//alert('�鿴���˽�Ʒ��ϢID��contentId���ô���');
			return;
		}
		if(!_this.option.activityId){
			//alert('�鿴���˽�Ʒ��ϢID:activityIdδ����');
			return;
		}
		if(!_this.option.templateId){
			//alert('�鿴���˽�Ʒ��Ϣģ��ID:templateIdδ����');
			return;
		}
	}
	{//�����ݽ��г�ʼ��
		if(!_this.config.GET_TEMP_HTML){
			_this.config.GET_TEMP_HTML = $$("#" + _this.option.templateId).html();
		}
	}
	
};


//������Ϣ
LotteryManager.MyGiftList.DATA = {
	GET_GIFT_DATA : {} //���������
};

//��ȡ���˽�Ʒ��¼�б���֧�ֶ����б�
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
		alert('LotteryManager.MyGiftList.getMyGiftList:activityIdδ����');
		return false;
	}
	
	if(typeof(callback) != 'function'){
		callback = function(obj){
			alert('LotteryManager.MyGiftList.getMyGiftListByActivityId��' + JsonObject.toString(obj));
		};
	}
	
	var dataName = ((option.activityId + '').replaceAll('|', '$'));
	
	//���Ȳ���һ�µ�ǰactivityId�͵�ǰҳ�ļ�¼�Ƿ��Ѿ����ڡ�
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
			'dataType' : 'object', //���ص��������ͣ�object, function
			'dataTypeName' : 'MyGiftListObject_' + dataName, //���dataTypeName�趨�ɹ��Ժ�ķ���
			'showLoadingStr' : '',
			'onLoadCompleteEvent' : function(){
				var MyGiftListObject = window['MyGiftListObject_' + dataName] || {retCode : '-1',retInfo : '���緱æ�������Ժ����ԡ�', pageTotal : "1",pageNow : "1",myGiftList : []};
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
	
	//ͨ��ҵ����Ϣ����ѯ�������֡�
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
			
			//��֤�Ƿ��иô�����Ϣ��
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
			'dataType' : 'object', //���ص��������ͣ�object, function
			'dataTypeName' : 'RoleSelector', //���dataTypeName�趨�ɹ��Ժ�ķ���
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












//����Ϣ��ȡ����Ȼ�����ҳ��
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
			alert('LotteryManager.MyGiftList.fill �� GET_TEMP_HTMLΪ�գ���ȷ�����Ѿ�����ҳ��ģ����ô��');
			return;
		}
		if(!allMyGiftObject.myGiftList){allMyGiftObject.myGiftList = [];}
		if(allMyGiftObject.pageTotal*1 < allMyGiftObject.pageNow*1){allMyGiftObject.pageTotal = allMyGiftObject.pageNow;}
		
		var myTemplateObj = TemplateManager.parseTemplate(option.GET_TEMP_HTML);
		var result = myTemplateObj.process(allMyGiftObject, 'MyGiftListObject');
		$$("#" + option.contentId).html(result);
		
		if(!option.contentPageId){//�Ƿ��з�ҳ
			callback();
			return;
		}
		if(allMyGiftObject.retCode != 0){ //�д�����ֱ�ӷ���
			return;
		}

		//��ʾ��ҳ��Ϣ
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
		
		//���ط�ҳ����
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



//���ҳ��
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

//��������ʾ
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
		'border' : 1, //��ʾ��ı߿�
		'isShowHeader' : true, //�Ƿ���ʾ����
		'isShowClose' : true, //�Ƿ���ʾ�����Ĺرհ�ť
		'title' : '�ҵ�����б�',
		'content' : option.showContentId, //��Ҫ��ʾ������
		'onOpenEvent' : function(){return false;}, //�򿪴�div��ʾ��ķ���
		'onCloseEvent' : function(){return false;}, //�رմ�div��ʾ��ķ���
		'onAllCloseEvent' : function(){return false;}, //�ر�����div��ʾ��ķ���
		'isShowCover' : true, //�Ƿ���ʾ������
		'coverColor' : '#E6F5FF', //���������ɫ
		'styleStr' : '', //���õ�ǰ��Ҫ��ʾ����ʽ����Ϣ
		'style' : '1' //�������û�����ã���ʹ�ô�Ĭ����ʽ��Ŀǰ��������ʽ�ɹ�ѡ��:1ΪQQ��¼��ʽ;2Ϊloading��ʽ;����ΪĬ����ʽ
	};
	
	LoginManager.submitLogin(function(){
		_this.fill(option, function(){});
		var myGiftListFloater = FloaterManager.init();
		myGiftListFloater.show(config);
	});
};

LotteryManager.MyGiftList.init = function(opt){
	if(!opt.activityId){
		alert('��������activityId');
		return;
	}
	window['myGiftList_' + opt.activityId] = new LotteryManager.MyGiftList(opt);
	return window['myGiftList_' + opt.activityId];
};

/*********************************** //�鿴���˽�Ʒ��ϢJS *************************************/



/*********************************** ��Ʒ��ȡ����JS  *************************************/
/**
 * ��ʾ��Ʒ�б�http://apps.game.qq.com/cgi-bin/lottery_MS/activityShowItems.cgi?iActivityId=1,2&iListPerPage=10&pageNow=1
 * ��ȡ��Ʒ��http://apps.game.qq.com/cgi-bin/lottery_MS/activityGetItems.cgi?iId=1&sArea=1&sRoleId=xxx&sRoleName=xxx&iGender=xxx
 * {iId:xx,iActivityId:xx,sItemName:xx,iStatus:xx,dtGetTime:xx,dtRecTimexx}
 */
LotteryManager.GetGiftCenter = function(opt){
	this.option = {
		'isAutoLoad' : true, //�Ƿ��Զ����ء�
		'activityId' : '', //���ID
		'gameId' : '',
		'contentId' : 'getGiftCenterContent', //����ID
		'templateId' : 'getGiftCenterTemplate', //ģ��ID
		'contentPageId' : 'getGiftCenterPageContent',	//��ҳ����
		'onGetGiftCompleteEvent' : null
	};

	this.config = {
		'pageSize' : 10, //������Ҫ��ʾ������
		'pageTotal' : 1, //��ҳ��
		'GET_TEMP_HTML' : '' //����ģ���ļ�
	};
	
	var _this = this;
	_this.option = $extend(_this.option, opt);
	_this.config = $extend(_this.config, opt);
		
	{//�����ݽ��м��
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
	{//�����ݽ��г�ʼ��
		if(!_this.config.GET_TEMP_HTML){
			_this.config.GET_TEMP_HTML = $$("#" + _this.option.templateId).html();
		}
	}
	
	if(_this.option.isAutoLoad){
		_this.fill({});
	}
};

//���ҳ����ʾ
LotteryManager.GetGiftCenter.prototype.fill = function(opt){
	var _this = this;
	var option = {
		'activityId' : '', //�ɴ�������
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
				pageShowNum : 3,//ǰ�������ʾ��ҳ��
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


//ȡ����ȡ���ı���Ϣ�����Դ�����activityId
//��ʾ��Ʒ�б�http://apps.game.qq.com/cgi-bin/lottery_MS/activityShowItems.cgi?iActivityId=1,2&iListPerPage=10&pageNow=1
LotteryManager.GetGiftCenter.getGiftCenterList = function(opt, callback){
	var option = {
		'activityId' : '',
		'pageSize' : 10,
		'pageNow' : 1
	};
	option = $extend(option, opt);
	
	option.activityId += '';
	
	{//�������
		if(!option.activityId){
			alert('������LotteryManager.GetGiftCenter.getGiftCenterList��activityId');
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
		'dataType' : 'object', //���ص��������ͣ�object, function
		'dataTypeName' : 'ShowGiftCenterObject_' + objName, //���dataTypeName�趨�ɹ��Ժ�ķ���
		'showLoadingStr' : '���ڻ�ȡ��Ʒ�б���Ϣ�����Ժ�...',
		'onLoadCompleteEvent' : function(){
			var ShowGiftCenterObject = window['ShowGiftCenterObject_' + objName];
			if(typeof(ShowGiftCenterObject) == 'undefined'){
				ShowGiftCenterObject = {
					'retCode' : '-8000',
					'retInfo' : '���������쳣����ˢ�����ԡ�',
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

//�����ȡ��ť
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
		alert('û���ҵ�����Ʒ��');
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
		var noQueryRole = currentObj.iActivityGetItemCenterType;//�Ƿ�Ҫ�������ɫ��Ϣ
		
		submitData.isQueryRole = true;//Ĭ���Ǳ�����ɫ�ģ�����Ĭ����true
		if(noQueryRole && noQueryRole == '1'){
			submitData.isQueryRole = false;
		}
	}
	LotteryManager.GetGiftCenter.submit(submitData);
};


//ֱ����ȡ��Ʒ
//http://apps.game.qq.com/cgi-bin/lottery_MS/���/activityGetItems.cgi?iId=1&sArea=1&sRoleId=xxx&sRoleName=xxx&iGender=xxx
LotteryManager.GetGiftCenter.submit = function(opt, callback){
	var option = {
		'activityId' : '',
		'itemAutoId' : '',
		'gameId' : '',
		'isQueryRole' : true
	};
	option = $extend(option, opt);
	
	{//�������
		if(!option.activityId || isNaN(option.activityId)){
			alert('������LotteryManager.GetGiftCenter.submit���activityId����');
			return;
		}
		
		if(!option.itemAutoId || isNaN(option.itemAutoId)){
			alert('������LotteryManager.GetGiftCenter.submit����ƷiId����');
			return;
		}

		if(option.isQueryRole){
			if(!option.gameId){
				alert('������LotteryManager.GetGiftCenter.submit��gameId������ΪҪ���ɫ��Ϣ��');
				return;
			}
		}
		
		if(typeof(callback) != 'function'){
			callback = function(GetGiftCenterObject){
				if(typeof(GetGiftCenterObject) == 'undefined'){
					GetGiftCenterObject = {
						'retCode' : '-8000',
						'retInfo' : '���������쳣����ˢ�����ԡ�'
					};
				}
				
				if(GetGiftCenterObject.retCode != 0){
					alert(GetGiftCenterObject.retInfo);
					return;
				}
				alert('��ȡ��Ʒ�ɹ�');
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
			'dataType' : 'object', //���ص��������ͣ�object, function
			'dataTypeName' : 'GetGiftCenter_' + submitOption.iId, //���dataTypeName�趨�ɹ��Ժ�ķ���
			'showLoadingStr' : '��ȡ��Ʒ�У����Ժ�...',
			'onLoadCompleteEvent' : function(){
				var GetGiftCenterObject = window['GetGiftCenter_' + submitOption.iId];
				if(typeof(GetGiftCenterObject) == 'undefined'){
					GetGiftCenterObject = {
						'retCode' : '-8000',
						'retInfo' : '���������쳣����ˢ�����ԡ�'
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
		}//���ȷ���Ժ�ĺ���
	});

};


LotteryManager.GetGiftCenter.init = function(opt){
	if(!opt.activityId){
		alert('��������activityId');
		return;
	}
	
	window['getGiftCenter_' + opt.activityId] = new LotteryManager.GetGiftCenter(opt);
	return window['getGiftCenter_' + opt.activityId];
};




/*********************************** //��Ʒ��ȡ����JS  *************************************/



/*********************************** ��ʼ�� *************************************/
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
			'LoginedCallback' : null//��¼�ɹ��Ժ󷽷�
		},
		'GetGiftMainOption' : {
		},
		'PersonInfoOption' : {
			'contentId' : 'personInfoContent', //����ID
			'buttonId' : 'personSubmitBtn' //�ύ��ť��ID
		},
		'BroadcastOption' : {
			'scrollstep' : 1,
			'scrollstoptime' : 20
		},
		'MyGiftListOption' : {},
		'GetGiftCenterOption' : {
			'isAutoLoad' : true, //�Ƿ��Զ����ء�
			'activityId' : '', //���ID
			'gameId' : '',
			'contentId' : 'getGiftCenterContent', //����ID
			'templateId' : 'getGiftCenterTemplate', //ģ��ID
			'contentPageId' : 'getGiftCenterPageContent',	//��ҳ����
			'onGetGiftCompleteEvent' : null
		}
	};
	option = $extend(option, opt);

	if(!option.activityId){
		alert('��ű��봫��Ӵ��');
		return;
	}	
	
	//�����ʼ��Ҳ��Ҫ�ȼ�������Ժ���ܽ���
	(function(){
		/**** �齱��ťJS ****/
		if(option.hasGetGiftMain){
			option.GetGiftMainOption.activityId = option.activityId;
			window["getGiftMain_" + option.activityId] = LotteryManager.GetGiftMain.init(option.GetGiftMainOption);
		}
		/*** //�齱��ťJS ***/
		
		/**** ������Ϣ��дJS ****/
		if(option.hasPersonInfo){
			option.PersonInfoOption.activityId = option.activityId;
			window["personInfo_" + option.activityId] = LotteryManager.PersonInfo.init(option.PersonInfoOption);
		}
		/*** //������Ϣ��дJS ***/
		
		/**** ���ֲ�JS ****/
		if(option.hasBroadcast){
			option.BroadcastOption.activityId = option.activityId;
			window["broadcast_" + option.activityId] = LotteryManager.Broadcast.init(option.BroadcastOption);
		}
		/*** //���ֲ�JS ***/
		
		/**** ������ȡ��¼JS ****/
		if(option.hasMyGiftList){
			option.MyGiftListOption.activityId = option.activityId;
			window["myGiftList_" + option.activityId] = LotteryManager.MyGiftList.init(option.MyGiftListOption);
		}
		/*** //������ȡ��¼JS ***/
		
		/**** ��ȡ����JS ****/
		if(option.hasGetGiftCenter){
			option.GetGiftCenterOption.activityId = option.activityId;
			window["getGiftCenter_" + option.activityId] = LotteryManager.GetGiftCenter.init(option.GetGiftCenterOption);
		}
		/*** //��ȡ����JS ***/
		
		/**** ���ⷴ��JS ****/
		if(option.hasDebug && typeof(DebugManager) == 'undefined'){
			FileLoadManager.ajaxRequest({
				'url' : 'http://ossweb-img.qq.com/images/js/activitymanager/debugmanager.js',
				'cache' : true,
				'dataType' : 'object', //���ص��������ͣ�object, function
				'dataTypeName' : 'DebugManager', //���dataTypeName�趨�ɹ��Ժ�ķ���
				'isUseDefaultLoadType' : true,
				'showLoadingStr' : ''
			});
		}
		/*** //���ⷴ��JS ***/
		
		/**** �û���¼JS ****/
		if(option.hasCheckLogin){
			if(typeof(LoginManager.isSetCheckLoginForPage) == 'undefined' || (typeof(option.CheckLoginOption) == 'object' && typeof(option.CheckLoginOption.LoginedCallback) == 'function')){
				//����ͳһ�ĵ�¼ֻ�����ֿ��ܣ�1��ҳ���л�δ���� 2���ö������е�¼����Ҫ���еķ�����
				//�ŵ��Ǽ������в�ѯ�Ĵ�����
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
		/**** //�û���¼JS ****/
	})();
};

/*********************************** //��ʼ�� *************************************/





/*********************************** ֧���� *************************************/
if(typeof(LotteryManager.PaymentManager) == 'undefined'){
	LotteryManager.PaymentManager = {};
}

LotteryManager.GetGiftMain.prototype.__submit_safety_check = function(ruleId, iType){
	var _this = this;
	
	var gameId = _this.config.gameId;
	if(!gameId){
		alert('֧����Ҫ����ҵ��ID');
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
			alert('��ȫ��֤��Ϣʧ�ܣ������Ժ����...');
			$$('#SAFE__CHECK__IFRAME').attr('src', '').hide();
			location.reload();
			return;
		}
		
		_this.setOutData(obj);
		_this._getGiftSubmit(ruleId);
	};
	
	safetyFloater.ajaxLoading('�����ύ��ȫ��֤��Ϣ������ˢ��ҳ��...');
	
	var __url = _url + '?' + JsonObject.serialize(submitData);
	
	var iframe = null;
	{//����������
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

/*********************************** //֧���� *************************************/



/*********************************** cdkey�� *************************************/
if(typeof(LotteryManager.cdkeyManager) == 'undefined'){
	LotteryManager.cdkeyManager = {};
}

//�Ƿ���cdkey��顣��
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
	//���¾ͱ�ʾ����cdkey���������ˡ�
	LotteryManager.cdkeyManager.submit(activityId, ruleId);
	return true;
};

//��������Ķ�Ӧ��ϵ��������أ�����Ϊ25�������Ϊ���������������idΪ334����Ϊ
//{'25' : [{'sPackageName' �� '�����', 'iRuleId' : '334'}]} �Ķ�Ӧ��ϵ
LotteryManager.cdkeyManager.__packageMap = {};

LotteryManager.cdkeyManager.submit = function(activityId, ruleId){
	var getGiftMainObject = window['getGiftMain_' + activityId];
	
	//1�������ж��Ƿ��¼
	if(!LoginManager.isLogin()){
		LoginManager.login();
		return;
	}

	var __init = null;
	{//��ʼ�������Ӧ��ϵ
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
	
	//2������Ѿ���¼������Ҫ�ж��Ƿ��Ѿ���ȡ����
	__init(function(){
		
		var _getLotteryData = function(ruleId){
			var userUin = LoginManager.getUserUin();
			var packageList = LotteryManager.cdkeyManager.__packageMap['' + activityId];
			for(var j = 0; j < packageList.length; j++){
				var onepackage = packageList[j];
				if(userUin == onepackage.iUin &&
				   ruleId == onepackage.iRuleId &&
				   onepackage.sPackageOtherInfo){
					//3���ɹ���ȡ���ˡ�
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
				//4��û�л�ã�����ȡ�����б�����
				LotteryManager.MyGiftList.getMyGiftListByActivityId({
					'activityId' : activityId,
					'isForce' : true,
					'pageSize' : 500
				}, function(myGiftObject){
					//��ȡ�Ժ���뵽�µ��б���ȥ
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
							//5���б��б�ʾ�ɹ���ȡ���ˡ�
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
					
					//6�������Ȼû����ȡ����ֱ��ȥ��ȡ���ɡ�
					getGiftMainObject._getGiftSubmit(ruleId);
				});
			});
		};
		
		
		
		
		if(!ruleId){
			//���û�й���ID����ֱ��ʹ��Ĭ�ϵ�һ����
			getGiftMainObject._loadJsFile(function(LotteryData){
				ruleId = LotteryData.tbRules[0].iRuleId;
				_getLotteryData(ruleId);
			});
			return;
		}
		
		_getLotteryData(ruleId);
		
	});

	
};

/*********************************** //cdkey�� *************************************/


