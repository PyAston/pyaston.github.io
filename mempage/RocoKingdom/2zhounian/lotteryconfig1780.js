/**
 * �齱��ȡƽ̨ǰ��js�����ļ�
 * @author tiantian
 */
LotteryConfig_1780 = {};
//���
LotteryConfig_1780.activityId = 1780;

$namespace('LotteryConfig_1780.CheckLoginOption');
//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����
LotteryConfig_1780.CheckLoginOption.LoginedCallback = function(){
	//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����

};

$namespace('LotteryConfig_1780.GetGiftMainOption');
//��ȡ���ʧ�ܺ�ķ���
LotteryConfig_1780.GetGiftMainOption.onGetGiftFailureEvent = function(callbackObj){
	var errorInfo = {
    	'16' : '��ȡʧ�ܣ�����û�л���QQ��Ŷ��',
		'17' : '���Ѿ���ȡ�����������������ȡ��Ŷ��'
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
//��ȡ����ɹ���ķ���
LotteryConfig_1780.GetGiftMainOption.onGetGiftSuccessEvent = function(callbackObj){
	if(!callbackObj.sPackageName){
		LotteryManager.alert(callbackObj.retInfo);
		return;
	}
/*
	var str = "��ϲС��������ȡ�ɹ���";

	LotteryManager.alert(str, function(){});
*/
	showDialog.show({id:'dia5'});
};
//��ȡ���ǰ�Ƿ���Ҫ��ѯ��ɫ
LotteryConfig_1780.GetGiftMainOption.isQueryRole = true;
//��ȡ���ǰ��ѯ��ɫ���ڵ�ҵ��
LotteryConfig_1780.GetGiftMainOption.gameId = '';
//��ȡ���ǰ�Ƿ���Ҫ�����ⲿ����
LotteryConfig_1780.GetGiftMainOption.outData = {};
//��֤�������ID
LotteryConfig_1780.GetGiftMainOption.codeContentId = '';
//��֤��ͼƬ����ID
LotteryConfig_1780.GetGiftMainOption.imageContentId = '';


$namespace('LotteryConfig_1780.BroadcastOption');
//����ֲ����ҳ���Ժ�ķ���
LotteryConfig_1780.BroadcastOption.onLoadCompleteEvent = function(){
	//������ֲ��Ժ�Ȼ��ִ�з�����

};
//�ֲ����ҳ���Ժ��Ƿ��Զ�����
LotteryConfig_1780.BroadcastOption.isAutoRun = true;
//�ֲ�����ID
LotteryConfig_1780.BroadcastOption.contentId = 'broadcastContent';
//һ��ҳ�����Ƿ�ֻ��һ���ֲ����������ֲ����ݺϲ��õġ�
LotteryConfig_1780.BroadcastOption.onlyOneBroadcast = true;


$namespace('LotteryConfig_1780.PersonInfoOption');
//��д������Ϣ������
LotteryConfig_1780.PersonInfoOption.contentId = 'personInfoContent';
//��д������Ϣ���ύ��ťID
LotteryConfig_1780.PersonInfoOption.buttonId = 'personSubmitBtn';


$namespace('LotteryConfig_1780.MyGiftListOption');
//���˻��б�����ID
LotteryConfig_1780.MyGiftListOption.contentId = 'getGiftContent';
//���˻��б��ҳID
LotteryConfig_1780.MyGiftListOption.contentPageId = 'getGiftPageContent';
    

$namespace('LotteryConfig_1780.hasDebug');
//�Ƿ���Ҫ��ʾ�ύdebugͼ��
LotteryConfig_1780.hasDebug = true;


//��ʼ���ö���
LotteryManager.init(LotteryConfig_1780);

/*  |xGv00|94e1d7c9bb2dfb0ea955e44c7a902f53 */