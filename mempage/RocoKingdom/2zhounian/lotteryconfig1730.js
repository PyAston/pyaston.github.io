/**
 * �齱��ȡƽ̨ǰ��js�����ļ�
 * @author tiantian
 */
LotteryConfig_1730 = {};
//���
LotteryConfig_1730.activityId = 1730;

$namespace('LotteryConfig_1730.CheckLoginOption');
//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����
LotteryConfig_1730.CheckLoginOption.LoginedCallback = function(){
	//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����

};

$namespace('LotteryConfig_1730.GetGiftMainOption');
//��ȡ���ʧ�ܺ�ķ���
LotteryConfig_1730.GetGiftMainOption.onGetGiftFailureEvent = function(callbackObj){
	var errorInfo = {
		'10' : "���Ѿ���ȡ��ǩ�����������������ȡ��Ŷ��",
        '12' : "���Ѿ���ȡ��ǩ�����������������ȡ��Ŷ��",
		'16' : "��ȡʧ�ܣ�����û�л���QQǩ��Ŷ��"
    };
	
	if(callbackObj.retCode == 12 || callbackObj.retCode == 10 || callbackObj.retCode == 16)
	{
		//LotteryManager.alert(errorInfo[""+callbackObj.retCode]);
		$$('#errorHint').html(errorInfo[""+callbackObj.retCode]);
		showDialog.show({id:'dia6'});
	}
	
    if(errorInfo[''+callbackObj.retCode])
	{
        //LotteryManager.alert(errorInfo[''+callbackObj.retCode]);
    }
	else
	{
        LotteryManager.alert(callbackObj.retInfo);
    }

};
//��ȡ����ɹ���ķ���
LotteryConfig_1730.GetGiftMainOption.onGetGiftSuccessEvent = function(callbackObj){
    if(!callbackObj.sPackageName){
        LotteryManager.alert(callbackObj.retInfo);
        return;
    }
    /*
	var str = "��ϲС��������ȡ�ɹ���";
    LotteryManager.alert(str, function(){});
	*/
	showDialog.show({id:'dia7'});
};
//��ȡ���ǰ�Ƿ���Ҫ��ѯ��ɫ
LotteryConfig_1730.GetGiftMainOption.isQueryRole = true;
//�����cdkey���ȷ�ϸû��ȡcdkeyֻ����ȡһ�Ρ�
LotteryConfig_1730.GetGiftMainOption.isOnlyOneCdkey = false;
//��ȡ���ǰ��ѯ��ɫ���ڵ�ҵ��
LotteryConfig_1730.GetGiftMainOption.gameId = 'roco';
//��ȡ���ǰ�Ƿ���Ҫ�����ⲿ����
LotteryConfig_1730.GetGiftMainOption.outData = {};
//��֤�������ID
LotteryConfig_1730.GetGiftMainOption.codeContentId = '';
//��֤��ͼƬ����ID
LotteryConfig_1730.GetGiftMainOption.imageContentId = '';


$namespace('LotteryConfig_1730.BroadcastOption');
//����ֲ����ҳ���Ժ�ķ���
LotteryConfig_1730.BroadcastOption.onLoadCompleteEvent = function(){
	//������ֲ��Ժ�Ȼ��ִ�з�����

};
//�ֲ����ҳ���Ժ��Ƿ��Զ�����
LotteryConfig_1730.BroadcastOption.isAutoRun = true;
//�ֲ�����ID
LotteryConfig_1730.BroadcastOption.contentId = 'broadcastContent';
//һ��ҳ�����Ƿ�ֻ��һ���ֲ����������ֲ����ݺϲ��õġ�
LotteryConfig_1730.BroadcastOption.onlyOneBroadcast = true;


$namespace('LotteryConfig_1730.PersonInfoOption');
//��д������Ϣ������
LotteryConfig_1730.PersonInfoOption.contentId = 'personInfoContent';
//��д������Ϣ���ύ��ťID
LotteryConfig_1730.PersonInfoOption.buttonId = 'personSubmitBtn';


$namespace('LotteryConfig_1730.MyGiftListOption');
//���˻��б�����ID
LotteryConfig_1730.MyGiftListOption.contentId = 'getGiftContent';
//���˻��б��ҳID
LotteryConfig_1730.MyGiftListOption.contentPageId = 'getGiftPageContent';
 
$namespace('LotteryConfig_1730.GetGiftCenterOption');
//�Ƿ��Զ����أ�ҳ��һ�򿪾Ͳ�ѯ�б�
LotteryConfig_1730.GetGiftCenterOption.isAutoLoad = true;
//��ȡ��������ID
LotteryConfig_1730.GetGiftCenterOption.contentId = 'getGiftCenterContent';
LotteryConfig_1730.GetGiftCenterOption.templateId = 'getGiftCenterTemplate';
LotteryConfig_1730.GetGiftCenterOption.contentPageId = 'getGiftCenterPageContent';


$namespace('LotteryConfig_1730.hasDebug');
//�Ƿ���Ҫ��ʾ�ύdebugͼ��
LotteryConfig_1730.hasDebug = true;


//��ʼ���ö���
LotteryManager.init(LotteryConfig_1730);

/*  |xGv00|75a11b5c9c2b14bab5224c22c2477f82 */