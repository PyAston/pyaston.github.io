
function refreshVerify(verifyLink){
	myDate = new Date();
	var verifyUrl = verifyLink;
	$("#verifyImg").attr( "src", verifyUrl+"?"+myDate.getTime() );
}

function insertFace(txt){
	var content = document.postMsgForm.content;
	content.value += '['+txt+']';
}

function subMsg(frontChechk,obj,verifyLink,indexListNum){
	if(!frontChechk)
		return false;
	checkMsgForm();
	data = obj.serialize();
	$.ajax({
		type: "POST",
		dataType: "html",
		url: './?plugin=gbook',
		data: data,       
		success: function (data) {
			var verifyUrl = verifyLink;
			$("#verifyImg").attr("src",verifyUrl+"?"+(new Date().getTime()));

			if(data.match('class="item"')){
				$("#guestBookList ul.list").prepend(data);
				if($("#guestBookList ul li").length >= indexListNum){
					$("#guestBookList ul.list li.item:last").fadeOut();
				}
			}
			if(data.match('验证码错误！')){
				alert('验证码错误！');
			}
			if(data.match('请勿重复提交！')){
				alert('请勿重复提交！');
			}
			if(data.match('您发言速度太快啦！')){
				alert('您发言速度太快啦！');
			}
		}
	});
}