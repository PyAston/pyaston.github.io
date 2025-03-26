/**
 * 抽奖领取平台前端js配置文件
 * @author tiantian
 */
LotteryConfig_1780 = {};
//活动号
LotteryConfig_1780.activityId = 1780;

$namespace('LotteryConfig_1780.CheckLoginOption');
//登录成功以后，然后执行此方法。
LotteryConfig_1780.CheckLoginOption.LoginedCallback = function(){
	//登录成功以后，然后执行此方法。

};

$namespace('LotteryConfig_1780.GetGiftMainOption');
//获取礼包失败后的方法
LotteryConfig_1780.GetGiftMainOption.onGetGiftFailureEvent = function(callbackObj){
	var errorInfo = {
    	'16' : '领取失败，您还没有换上QQ秀哦！',
		'17' : '您已经领取了礼包啦！不能再领取了哦！'
	};
	
	if(callbackObj.retCode == 16 || callbackObj.retCode == 17)
	{
		//LotteryManager.alert(errorInfo[""+callbackObj.retCode]);
		$$('#errorHint').html(errorInfo[""+callbackObj.retCode]);
		showDialog.show({id:'dia6'});
	}
	
	if(errorInfo[''+callbackObj.retCode]){
		//LotteryManager.alert(errorInfo[''+callbackObj.retCode]);
	}else{
		LotteryManager.alert(callbackObj.retInfo);
	}

};
//获取礼包成功后的方法
LotteryConfig_1780.GetGiftMainOption.onGetGiftSuccessEvent = function(callbackObj){
	if(!callbackObj.sPackageName){
		LotteryManager.alert(callbackObj.retInfo);
		return;
	}
/*
	var str = "恭喜小洛克礼包领取成功！";

	LotteryManager.alert(str, function(){});
*/
	showDialog.show({id:'dia5'});
};
//获取礼包前是否需要查询角色
LotteryConfig_1780.GetGiftMainOption.isQueryRole = true;
//获取礼包前查询角色所在的业务
LotteryConfig_1780.GetGiftMainOption.gameId = '';
//获取礼包前是否需要设置外部变量
LotteryConfig_1780.GetGiftMainOption.outData = {};
//验证码输入框ID
LotteryConfig_1780.GetGiftMainOption.codeContentId = '';
//验证码图片容器ID
LotteryConfig_1780.GetGiftMainOption.imageContentId = '';


$namespace('LotteryConfig_1780.BroadcastOption');
//完成轮播填充页面以后的方法
LotteryConfig_1780.BroadcastOption.onLoadCompleteEvent = function(){
	//填充完轮播以后，然后执行方法。

};
//轮播填充页面以后是否自动滚动
LotteryConfig_1780.BroadcastOption.isAutoRun = true;
//轮播容器ID
LotteryConfig_1780.BroadcastOption.contentId = 'broadcastContent';
//一个页面上是否只有一个轮播，用来做轮播数据合并用的。
LotteryConfig_1780.BroadcastOption.onlyOneBroadcast = true;


$namespace('LotteryConfig_1780.PersonInfoOption');
//填写个人信息的容器
LotteryConfig_1780.PersonInfoOption.contentId = 'personInfoContent';
//填写个人信息的提交按钮ID
LotteryConfig_1780.PersonInfoOption.buttonId = 'personSubmitBtn';


$namespace('LotteryConfig_1780.MyGiftListOption');
//个人获奖列表容器ID
LotteryConfig_1780.MyGiftListOption.contentId = 'getGiftContent';
//个人获奖列表分页ID
LotteryConfig_1780.MyGiftListOption.contentPageId = 'getGiftPageContent';
    

$namespace('LotteryConfig_1780.hasDebug');
//是否需要显示提交debug图标
LotteryConfig_1780.hasDebug = true;


//初始化该对象
LotteryManager.init(LotteryConfig_1780);

/*  |xGv00|94e1d7c9bb2dfb0ea955e44c7a902f53 */