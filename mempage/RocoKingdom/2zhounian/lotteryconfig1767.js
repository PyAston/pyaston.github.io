/**
 * �齱��ȡƽ̨ǰ��js�����ļ�
 * @author tiantian
 */
LotteryConfig_1767 = {};
//���
LotteryConfig_1767.activityId = 1767;

$namespace('LotteryConfig_1767.CheckLoginOption');
//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����
LotteryConfig_1767.CheckLoginOption.LoginedCallback = function(){
	//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����

};

$namespace('LotteryConfig_1767.GetGiftMainOption');
//��ȡ���ʧ�ܺ�ķ���
LotteryConfig_1767.GetGiftMainOption.onGetGiftFailureEvent = function(callbackObj){
	var errorInfo = {
		'11' : '���Ѿ���ȡ�����������������ȡ��Ŷ��',
        '12' : '���Ѿ���ȡ�����������������ȡ��Ŷ��',
		'16' : '��ȡʧ�ܣ�����û�л���QQƤ��Ŷ��',
		'17' : '���Ѿ���ȡ�����������������ȡ��Ŷ��'
	};
	
    if(callbackObj.retCode == 12 || callbackObj.retCode == 11 || callbackObj.retCode == 16 ||  callbackObj.retCode == 17)
	{
		//LotteryManager.alert(errorInfo[""+callbackObj.retCode]);
		$$('#errorHint').html(errorInfo[""+callbackObj.retCode]);
		showDialog.show({id:'dia6'});
	}
	
	if(errorInfo[''+callbackObj.retCode]){
    	//LotteryManager.alert(errorInfo[''+callbackObj.retCode]);
	}
	else
	{	
    	LotteryManager.alert(callbackObj.retInfo);
	}

};

//��ȡ����ɹ���ķ���
LotteryConfig_1767.GetGiftMainOption.onGetGiftSuccessEvent = function(callbackObj){
	if(!callbackObj.sPackageName){
    	LotteryManager.alert(callbackObj.retInfo);
    	return;
	}
	/*
	var str = "��ϲС��������ȡ�ɹ���";
	
	LotteryManager.alert(str, function(){});
	*/
	showDialog.show({id:'dia8'});
};
//��ȡ���ǰ�Ƿ���Ҫ��ѯ��ɫ
LotteryConfig_1767.GetGiftMainOption.isQueryRole = true;
//��ȡ���ǰ��ѯ��ɫ���ڵ�ҵ��
LotteryConfig_1767.GetGiftMainOption.gameId = '';
//��ȡ���ǰ�Ƿ���Ҫ�����ⲿ����
LotteryConfig_1767.GetGiftMainOption.outData = {};
//��֤�������ID
LotteryConfig_1767.GetGiftMainOption.codeContentId = '';
//��֤��ͼƬ����ID
LotteryConfig_1767.GetGiftMainOption.imageContentId = '';


$namespace('LotteryConfig_1767.BroadcastOption');
//����ֲ����ҳ���Ժ�ķ���
LotteryConfig_1767.BroadcastOption.onLoadCompleteEvent = function(){
	//������ֲ��Ժ�Ȼ��ִ�з�����

};
//�ֲ����ҳ���Ժ��Ƿ��Զ�����
LotteryConfig_1767.BroadcastOption.isAutoRun = true;
//�ֲ�����ID
LotteryConfig_1767.BroadcastOption.contentId = 'broadcastContent';
//һ��ҳ�����Ƿ�ֻ��һ���ֲ����������ֲ����ݺϲ��õġ�
LotteryConfig_1767.BroadcastOption.onlyOneBroadcast = true;


$namespace('LotteryConfig_1767.PersonInfoOption');
//��д������Ϣ������
LotteryConfig_1767.PersonInfoOption.contentId = 'personInfoContent';
//��д������Ϣ���ύ��ťID
LotteryConfig_1767.PersonInfoOption.buttonId = 'personSubmitBtn';


$namespace('LotteryConfig_1767.MyGiftListOption');
//���˻��б�����ID
LotteryConfig_1767.MyGiftListOption.contentId = 'getGiftContent';
//���˻��б��ҳID
LotteryConfig_1767.MyGiftListOption.contentPageId = 'getGiftPageContent';
    

$namespace('LotteryConfig_1767.hasDebug');
//�Ƿ���Ҫ��ʾ�ύdebugͼ��
LotteryConfig_1767.hasDebug = true;


//��ʼ���ö���
LotteryManager.init(LotteryConfig_1767);

/*  |xGv00|663ff0cef474874b731ee7ba9b9064a3 */