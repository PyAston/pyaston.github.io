/**
 * �齱��ȡƽ̨ǰ��js�����ļ�
 * @author tiantian
 */
LotteryConfig_1768 = {};
//���
LotteryConfig_1768.activityId = 1768;

$namespace('LotteryConfig_1768.CheckLoginOption');
//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����
LotteryConfig_1768.CheckLoginOption.LoginedCallback = function(){
	//��¼�ɹ��Ժ�Ȼ��ִ�д˷�����

};

$namespace('LotteryConfig_1768.GetGiftMainOption');
//��ȡ���ʧ�ܺ�ķ���
LotteryConfig_1768.GetGiftMainOption.onGetGiftFailureEvent = function(callbackObj){
	var errorInfo = {
		'10' : '���Ѿ����������Ƥ����Ŷ��',
        '12' : '���Ѿ����������Ƥ����Ŷ��',
		'-201': '�˻Ŀǰ���������϶࣬������Ϣ10���Ӻ��������Ŷ'
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

//��ȡ����ɹ���ķ���
LotteryConfig_1768.GetGiftMainOption.onGetGiftSuccessEvent = function(callbackObj){
	if(!callbackObj.sPackageName){
        LotteryManager.alert(callbackObj.retInfo);
    	return;
	}
	/*
	var str = "��ϲ�㣬�ɹ���ȡ�����������QQƤ����";
	
	LotteryManager.alert(str, function(){
		
	});*/
	showDialog.show({id:'dia2'});
};
//��ȡ���ǰ�Ƿ���Ҫ��ѯ��ɫ
LotteryConfig_1768.GetGiftMainOption.isQueryRole = false;
//��ȡ���ǰ��ѯ��ɫ���ڵ�ҵ��
LotteryConfig_1768.GetGiftMainOption.gameId = '';
//��ȡ���ǰ�Ƿ���Ҫ�����ⲿ����
LotteryConfig_1768.GetGiftMainOption.outData = {};
//��֤�������ID
LotteryConfig_1768.GetGiftMainOption.codeContentId = '';
//��֤��ͼƬ����ID
LotteryConfig_1768.GetGiftMainOption.imageContentId = '';


$namespace('LotteryConfig_1768.BroadcastOption');
//����ֲ����ҳ���Ժ�ķ���
LotteryConfig_1768.BroadcastOption.onLoadCompleteEvent = function(){
	//������ֲ��Ժ�Ȼ��ִ�з�����

};
//�ֲ����ҳ���Ժ��Ƿ��Զ�����
LotteryConfig_1768.BroadcastOption.isAutoRun = true;
//�ֲ�����ID
LotteryConfig_1768.BroadcastOption.contentId = 'broadcastContent';
//һ��ҳ�����Ƿ�ֻ��һ���ֲ����������ֲ����ݺϲ��õġ�
LotteryConfig_1768.BroadcastOption.onlyOneBroadcast = true;


$namespace('LotteryConfig_1768.PersonInfoOption');
//��д������Ϣ������
LotteryConfig_1768.PersonInfoOption.contentId = 'personInfoContent';
//��д������Ϣ���ύ��ťID
LotteryConfig_1768.PersonInfoOption.buttonId = 'personSubmitBtn';


$namespace('LotteryConfig_1768.MyGiftListOption');
//���˻��б�����ID
LotteryConfig_1768.MyGiftListOption.contentId = 'getGiftContent';
//���˻��б��ҳID
LotteryConfig_1768.MyGiftListOption.contentPageId = 'getGiftPageContent';
    

$namespace('LotteryConfig_1768.hasDebug');
//�Ƿ���Ҫ��ʾ�ύdebugͼ��
LotteryConfig_1768.hasDebug = true;


//��ʼ���ö���
LotteryManager.init(LotteryConfig_1768);

/*  |xGv00|e7ad32a99c798802a76d9dc7dcc73521 */