/**
 * �齱��ȡƽ̨ǰ��js�����ļ�
 * @author tiantian
 */
LotteryConfig_1781 = {};
//���
LotteryConfig_1781.activityId = 1781;

$namespace('LotteryConfig_1781.CheckLoginOption');
//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����
LotteryConfig_1781.CheckLoginOption.LoginedCallback = function(){
	//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����

};

$namespace('LotteryConfig_1781.GetGiftMainOption');
//��ȡ���ʧ�ܺ�ķ���
LotteryConfig_1781.GetGiftMainOption.onGetGiftFailureEvent = function(callbackObj){
	var errorInfo = {
        '17':'���Ѿ���ȡ��QQ��Ŷ����������ȡ����',
		'-143':'���Ѿ���ȡ��QQ��Ŷ����������ȡ����'
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
//��ȡ����ɹ���ķ���
LotteryConfig_1781.GetGiftMainOption.onGetGiftSuccessEvent = function(callbackObj){
    if(!callbackObj.sPackageName){
        LotteryManager.alert(callbackObj.retInfo);
        return;
    }
    /*
    var str = "��ϲ�㣬�ɹ���ȡ�����������QQ�㣡";
	
    LotteryManager.alert(str, function(){});
*/
	showDialog.show({id:'dia1'});
};
//��ȡ���ǰ�Ƿ���Ҫ��ѯ��ɫ
LotteryConfig_1781.GetGiftMainOption.isQueryRole = false;
//�����cdkey���ȷ�ϸû��ȡcdkeyֻ����ȡһ�Ρ�
LotteryConfig_1781.GetGiftMainOption.isOnlyOneCdkey = false;
//��ȡ���ǰ��ѯ��ɫ���ڵ�ҵ��
LotteryConfig_1781.GetGiftMainOption.gameId = 'roco';
//��ȡ���ǰ�Ƿ���Ҫ�����ⲿ����
LotteryConfig_1781.GetGiftMainOption.outData = {};
//��֤�������ID
LotteryConfig_1781.GetGiftMainOption.codeContentId = '';
//��֤��ͼƬ����ID
LotteryConfig_1781.GetGiftMainOption.imageContentId = '';


$namespace('LotteryConfig_1781.BroadcastOption');
//����ֲ����ҳ���Ժ�ķ���
LotteryConfig_1781.BroadcastOption.onLoadCompleteEvent = function(){
	//������ֲ��Ժ�Ȼ��ִ�з�����

};
//�ֲ����ҳ���Ժ��Ƿ��Զ�����
LotteryConfig_1781.BroadcastOption.isAutoRun = true;
//�ֲ�����ID
LotteryConfig_1781.BroadcastOption.contentId = 'broadcastContent';
//һ��ҳ�����Ƿ�ֻ��һ���ֲ����������ֲ����ݺϲ��õġ�
LotteryConfig_1781.BroadcastOption.onlyOneBroadcast = true;


$namespace('LotteryConfig_1781.PersonInfoOption');
//��д������Ϣ������
LotteryConfig_1781.PersonInfoOption.contentId = 'personInfoContent';
//��д������Ϣ���ύ��ťID
LotteryConfig_1781.PersonInfoOption.buttonId = 'personSubmitBtn';


$namespace('LotteryConfig_1781.MyGiftListOption');
//���˻��б�����ID
LotteryConfig_1781.MyGiftListOption.contentId = 'getGiftContent';
//���˻��б��ҳID
LotteryConfig_1781.MyGiftListOption.contentPageId = 'getGiftPageContent';
 
$namespace('LotteryConfig_1781.GetGiftCenterOption');
//�Ƿ��Զ����أ�ҳ��һ�򿪾Ͳ�ѯ�б�
LotteryConfig_1781.GetGiftCenterOption.isAutoLoad = true;
//��ȡ��������ID
LotteryConfig_1781.GetGiftCenterOption.contentId = 'getGiftCenterContent';
LotteryConfig_1781.GetGiftCenterOption.templateId = 'getGiftCenterTemplate';
LotteryConfig_1781.GetGiftCenterOption.contentPageId = 'getGiftCenterPageContent';


$namespace('LotteryConfig_1781.hasDebug');
//�Ƿ���Ҫ��ʾ�ύdebugͼ��
LotteryConfig_1781.hasDebug = true;


//��ʼ���ö���
LotteryManager.init(LotteryConfig_1781);
/*  |xGv00|0fbcf3f76aebf2913bf922051b5e16e1 */