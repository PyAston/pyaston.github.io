/**
 * 抽奖领取平台前端js配置文件
 * @author tiantian
 */
LotteryConfig_1768 = {};
//活动号
LotteryConfig_1768.activityId = 1768;

$namespace('LotteryConfig_1768.CheckLoginOption');
//登录成功以后，然后执行此方法。
LotteryConfig_1768.CheckLoginOption.LoginedCallback = function(){
	//登录成功以后，然后执行此方法。

};

$namespace('LotteryConfig_1768.GetGiftMainOption');
//获取礼包失败后的方法
LotteryConfig_1768.GetGiftMainOption.onGetGiftFailureEvent = function(callbackObj){
	var errorInfo = {
		'10' : '您已经更换过洛克皮肤了哦！',
        '12' : '您已经更换过洛克皮肤了哦！',
		'-201': '此活动目前访问人数较多，请您休息10秒钟后，再来点击哦'
	};
	
	if(callbackObj.retCode == 12 || callbackObj.retCode == 10 || callbackObj.retCode == -201)
	{
		//LotteryManager.alert(errorInfo[""+callbackObj.retCode]);
		$$('#errorHint').html(errorInfo[""+callbackObj.retCode]);
		showDialog.show({id:'dia6'});
	}
	else
	{
		showDialog.show({id:'dia4'});
	}

};

//获取礼包成功后的方法
LotteryConfig_1768.GetGiftMainOption.onGetGiftSuccessEvent = function(callbackObj){
	if(!callbackObj.sPackageName){
        LotteryManager.alert(callbackObj.retInfo);
    	return;
	}
	/*
	var str = "恭喜你，成功领取超萌洛克王国QQ皮肤！";
	
	LotteryManager.alert(str, function(){
		
	});*/
	showDialog.show({id:'dia2'});
};
//获取礼包前是否需要查询角色
LotteryConfig_1768.GetGiftMainOption.isQueryRole = false;
//获取礼包前查询角色所在的业务
LotteryConfig_1768.GetGiftMainOption.gameId = '';
//获取礼包前是否需要设置外部变量
LotteryConfig_1768.GetGiftMainOption.outData = {};
//验证码输入框ID
LotteryConfig_1768.GetGiftMainOption.codeContentId = '';
//验证码图片容器ID
LotteryConfig_1768.GetGiftMainOption.imageContentId = '';


$namespace('LotteryConfig_1768.BroadcastOption');
//完成轮播填充页面以后的方法
LotteryConfig_1768.BroadcastOption.onLoadCompleteEvent = function(){
	//填充完轮播以后，然后执行方法。

};
//轮播填充页面以后是否自动滚动
LotteryConfig_1768.BroadcastOption.isAutoRun = true;
//轮播容器ID
LotteryConfig_1768.BroadcastOption.contentId = 'broadcastContent';
//一个页面上是否只有一个轮播，用来做轮播数据合并用的。
LotteryConfig_1768.BroadcastOption.onlyOneBroadcast = true;


$namespace('LotteryConfig_1768.PersonInfoOption');
//填写个人信息的容器
LotteryConfig_1768.PersonInfoOption.contentId = 'personInfoContent';
//填写个人信息的提交按钮ID
LotteryConfig_1768.PersonInfoOption.buttonId = 'personSubmitBtn';


$namespace('LotteryConfig_1768.MyGiftListOption');
//个人获奖列表容器ID
LotteryConfig_1768.MyGiftListOption.contentId = 'getGiftContent';
//个人获奖列表分页ID
LotteryConfig_1768.MyGiftListOption.contentPageId = 'getGiftPageContent';
    

$namespace('LotteryConfig_1768.hasDebug');
//是否需要显示提交debug图标
LotteryConfig_1768.hasDebug = true;


//初始化该对象
LotteryManager.init(LotteryConfig_1768);

/*  |xGv00|e7ad32a99c798802a76d9dc7dcc73521 */