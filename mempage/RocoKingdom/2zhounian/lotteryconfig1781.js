/**
 * 抽奖领取平台前端js配置文件
 * @author tiantian
 */
LotteryConfig_1781 = {};
//活动号
LotteryConfig_1781.activityId = 1781;

$namespace('LotteryConfig_1781.CheckLoginOption');
//登录成功以后，然后执行此方法。
LotteryConfig_1781.CheckLoginOption.LoginedCallback = function(){
	//登录成功以后，然后执行此方法。

};

$namespace('LotteryConfig_1781.GetGiftMainOption');
//获取礼包失败后的方法
LotteryConfig_1781.GetGiftMainOption.onGetGiftFailureEvent = function(callbackObj){
	var errorInfo = {
        '17':'您已经领取了QQ秀哦，不能再领取啦！',
		'-143':'您已经领取了QQ秀哦，不能再领取啦！'
    };
	
	if(callbackObj.retCode == 17 || callbackObj.retCode == -143)
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
LotteryConfig_1781.GetGiftMainOption.onGetGiftSuccessEvent = function(callbackObj){
    if(!callbackObj.sPackageName){
        LotteryManager.alert(callbackObj.retInfo);
        return;
    }
    /*
    var str = "恭喜你，成功领取超萌洛克王国QQ秀！";
	
    LotteryManager.alert(str, function(){});
*/
	showDialog.show({id:'dia1'});
};
//获取礼包前是否需要查询角色
LotteryConfig_1781.GetGiftMainOption.isQueryRole = false;
//如果是cdkey活动，确认该活动领取cdkey只可领取一次。
LotteryConfig_1781.GetGiftMainOption.isOnlyOneCdkey = false;
//获取礼包前查询角色所在的业务
LotteryConfig_1781.GetGiftMainOption.gameId = 'roco';
//获取礼包前是否需要设置外部变量
LotteryConfig_1781.GetGiftMainOption.outData = {};
//验证码输入框ID
LotteryConfig_1781.GetGiftMainOption.codeContentId = '';
//验证码图片容器ID
LotteryConfig_1781.GetGiftMainOption.imageContentId = '';


$namespace('LotteryConfig_1781.BroadcastOption');
//完成轮播填充页面以后的方法
LotteryConfig_1781.BroadcastOption.onLoadCompleteEvent = function(){
	//填充完轮播以后，然后执行方法。

};
//轮播填充页面以后是否自动滚动
LotteryConfig_1781.BroadcastOption.isAutoRun = true;
//轮播容器ID
LotteryConfig_1781.BroadcastOption.contentId = 'broadcastContent';
//一个页面上是否只有一个轮播，用来做轮播数据合并用的。
LotteryConfig_1781.BroadcastOption.onlyOneBroadcast = true;


$namespace('LotteryConfig_1781.PersonInfoOption');
//填写个人信息的容器
LotteryConfig_1781.PersonInfoOption.contentId = 'personInfoContent';
//填写个人信息的提交按钮ID
LotteryConfig_1781.PersonInfoOption.buttonId = 'personSubmitBtn';


$namespace('LotteryConfig_1781.MyGiftListOption');
//个人获奖列表容器ID
LotteryConfig_1781.MyGiftListOption.contentId = 'getGiftContent';
//个人获奖列表分页ID
LotteryConfig_1781.MyGiftListOption.contentPageId = 'getGiftPageContent';
 
$namespace('LotteryConfig_1781.GetGiftCenterOption');
//是否自动加载，页面一打开就查询列表
LotteryConfig_1781.GetGiftCenterOption.isAutoLoad = true;
//领取中心容器ID
LotteryConfig_1781.GetGiftCenterOption.contentId = 'getGiftCenterContent';
LotteryConfig_1781.GetGiftCenterOption.templateId = 'getGiftCenterTemplate';
LotteryConfig_1781.GetGiftCenterOption.contentPageId = 'getGiftCenterPageContent';


$namespace('LotteryConfig_1781.hasDebug');
//是否需要显示提交debug图标
LotteryConfig_1781.hasDebug = true;


//初始化该对象
LotteryManager.init(LotteryConfig_1781);
/*  |xGv00|0fbcf3f76aebf2913bf922051b5e16e1 */