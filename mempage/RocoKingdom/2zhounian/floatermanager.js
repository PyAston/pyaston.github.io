/**
 * 有关层的显示功能。
 * tiantian
 */
var FloaterManager = function(opt){
	this.option = {
		'type' : 'html', //需要显示的类型，html, url, dom
		'width' : 400, //显示框的宽度
		'height' : 200, //显示框的高度
		'left' : -1, //显示层的位置
		'top' : -1, //显示层的位置，如果不设置，默认居中。
		'border' : 1, //显示框的边框
		'isShowHeader' : true, //是否显示标题
		'isShowClose' : true, //是否显示标题后的关闭按钮
		'isAlignCenter' : true, //滚动条滚动时是否始终局中显示
		'isCanMove' : true, //层是否可移动
		'title' : '标题',
		'content' : '内容', //所要显示的内容
		'isAlignTop' : false, //是否始终置顶显示
		'onOpenEvent' : function(){return false;}, //打开此div显示层的方法
		'onCloseEvent' : function(){return false;}, //关闭此div显示层的方法
		'onAllCloseEvent' : function(){return false;}, //关闭所有div显示层的方法
		'isShowCover' : true, //是否显示背景层
		'coverColor' : '#E6F5FF', //背景层的颜色#E6F5FF
		'styleStr' : '', //设置当前需要显示的样式表信息
		'style' : '0' //如果上面没有设置，则使用此默认样式，目前有两种样式可供选择:1为QQ登录样式;2为loading样式;其它为默认样式
	};
	this.config = {
		'id' : '',
		'domobj' : null //保存dom存进来的对象，方便控制是否显示
	};
	var _this = this;

	//初始化
	this._Floater = function(obj){
		if(obj){
			_this._setOption(obj);
		}

		if(!_this.option.isShowHeader){
			_this.option.title = '';
			_this.option.isShowClose = false;
		}
		
		if(!_this.option.isShowHeader){//没有头部就不能移动了。
			_this.option.isCanMove = false;
		}
		
		_this._getAutoId(); //生成页面ID
	};
	_this._Floater(opt);
};

//设置属性
FloaterManager.prototype._setOption = function(obj){
	var _this = this;
	if(obj){
		FloaterManager._tool.extend(_this.option, obj);
	}
	if(!_this.option.isShowHeader){
		_this.option.title = '';
		_this.option.isShowClose = false;
	}
};

//取得自增的实例对象
FloaterManager.prototype._getAutoId = function(){
	var _this = this;
	if(!_this.config.id){ //生成页面ID
		_this.config.id = FloaterManager._instance._getAutoId();
	}
	return _this.config.id;
};

//取得当前的dom对象。
FloaterManager.prototype._getHTMLElement = function(){
	var _this = this;
	if(_this.config.domobj){
		return _this.config.domobj;
	}
	
	_this.config.domobj = document.getElementById('coverdiv_' + _this._getAutoId());
	if(_this.config.domobj){
		return _this.config.domobj;
	}
	
	var bodyDom = document.getElementsByTagName('body');
	if(!bodyDom || bodyDom.length == 0){
		alert('未找到页面body元素');
		return;
	}
	bodyDom = bodyDom[0];
	var divDom = document.createElement('div');
	divDom.setAttribute('id', 'coverdiv_' + _this._getAutoId());

	if(!bodyDom.hasChildNodes()){
		bodyDom.appendChild(divDom);
	}else{
		bodyDom.insertBefore(divDom, bodyDom.firstChild);
	}
	_this.config.domobj = divDom;
	return _this.config.domobj;
};




//显示
FloaterManager.prototype.show = function(opt){
	var _this = this;
	var _t = _this.option;
	if(typeof(opt) == 'object' && opt){
		_this._setOption(opt);
	}

	{//判断是否是dom方式
		if(_this.option.type == 'dom'){
			_this._showDialog(_this.option.content);
			if(_this.option.isCanMove){
				var domobj = _this.option.title;
				if(domobj){
					domobj = (typeof(domobj) == 'object') ? domobj : document.getElementById(domobj);
				}
				if(!domobj){
					return;
				}
				FloaterManager._setMoveEvent(domobj, _this);
			}
			return;
		}
	}
	
	var showFun = function(){
		//增加一个显示的标记
		FloaterManager._instance.addFloater(_this);
		//显示内容
		_this._addContent();
		//设置样式
		_this._setStyle();

		//是否可移动
		if(_this.option.isCanMove){
			var domDiv = _this._getHTMLElement();
			var classDom = domDiv.getElementsByTagName('*');
			var headDom = null;
			for(var i = 0; i < classDom.length; i++){
				if(!headDom && classDom[i].className == 'floater_head'){
					headDom = classDom[i];
					break;
				}
			}
			FloaterManager._setMoveEvent(headDom, _this);
		}

		//是否始终置顶显示
		if(_this.option.isAlignTop){
			FloaterManager._instance.setFloaterTopById(_this._getAutoId());
		}
		
		var currDom = _this._getHTMLElement();
		{//默认位置
			if(_t.left < 0 || _t.top < 0){
				FloaterManager._tool.setAlignCenter(currDom); //局中显示
			}else{
				FloaterManager._cover._setStyle(currDom, {
					'left' : _t.left,
					'top' : _t.top
				});
			}
		}
		
		if(_t.height <= 0){
			FloaterManager._tool._autoHeight(currDom);//自动改变高度
		}
		
		//是否滚动局中
		if(_this.option.isAlignCenter){
			FloaterManager._tool._bindWindowResize();
		}

		_this.option.onOpenEvent();
	};
	
	if(_this.option.isShowCover){
		FloaterManager._cover.show(function(){
			showFun();
		}, _this.option.coverColor);
	}else{
		showFun();
	}
};

//自动增高
FloaterManager.prototype.autoHeight = function(){
	var _this = this;
	var currDom = _this._getHTMLElement();
	var hasScroll = FloaterManager._tool._hasHeightScroll(currDom);
	if(!hasScroll){
		FloaterManager._tool._autoHeight(currDom);
		return;
	}
	var scrollHeight = parseInt(currDom.scrollHeight, 10);
	FloaterManager._cover._setStyle(currDom, {'height' : scrollHeight});
};



//关闭
FloaterManager.prototype.close = function(callback){
	var _this = this;
	if(typeof(callback) == 'function'){
		if(callback()){
			return;
		}
	}
	
	{//判断是否是dom方式
		if(_this.option.type == 'dom'){
			_this._closeDialog();
			return;
		}
	}
	
	var _r = _this._getHTMLElement();
	var _r1 = document.getElementById('floaterStyleContent_' + _this._getAutoId());
	if(_r && _r.parentNode){
		_r.parentNode.removeChild(_r);
	}
	if(_r1 && _r1.parentNode){
		_r1.parentNode.removeChild(_r1);
	}

	_this.option.onCloseEvent();
	FloaterManager._instance.deleteFloaterById(_this._getAutoId());
	FloaterManager._tool.closeAll(_this);
};

{//默认显示的一些方法
	FloaterManager.prototype.alert = function(obj){
		var _this = this;
		if(typeof(obj) == "undefined" || !obj){
			obj = {};
		}else if(typeof(obj) == "string"){
			obj = {
				'content' : obj,
				'title': '系统提示',
				'width': 320,
				'isShowClose' : true,
				'height':-1
			};
		}
		obj.content = obj.content ? obj.content : '&nbsp;';
		obj.title = obj.title ? obj.title : '系统提示';
		obj.isShowClose = obj.isShowClose ? true : false;
		obj.isAlignTop = true;
		obj.width = obj.width ? obj.width : 320;
		obj.height = obj.height ? obj.height : -1;

		if(arguments.length == 2){
			var closeFun = arguments[1];
			if(typeof(closeFun) == 'function'){
				obj.onCloseEvent = closeFun;
			}
		}
		
		var _id_ = _this._getAutoId();
		
		var content = '<div class="alertcontentstyle">';
			content += '<div style="font-size:12px;">'+obj.content+'</div>';
			content += '<div style="text-align:center; line-height:30px; margin-top:10px;"><input type="button" onclick="FloaterManager._instance.close(\''+_id_+'\');" class="button" value="确  定" /></div></div>';
		obj.content = content;
		_this.show(obj);
	};
	//显示确认框
	FloaterManager.prototype.confirm = function(fun, obj){
		var _this = this;
		if(typeof(obj) == "undefined" || !obj){
			obj = {};
		}
		obj.content = obj.content ? obj.content : '您确认该操作吗？';
		obj.title = obj.title ? obj.title : '确认该操作';
		obj.isShowClose = false;
		obj.isAlignTop = true;
		obj.width = obj.width ? obj.width : 265;
		obj.height = obj.height ? obj.height : -1;
		   
		var time = Math.floor(Math.random() * 1000);
		var _id_ = _this._getAutoId();
		var content = '<div class="alertcontentstyle">';
			content += '<div style="font-size:12px;">'+obj.content+'</div>';
			content += '<div style="text-align:center; line-height:30px; margin-top:10px;"><input type="button" id="confirmButton_'+_id_+'_'+time+'" class="button" value="确定" /><input type="button" onclick="FloaterManager._instance.close(\''+_id_+'\');" class="button" value="取消" /></div></div>';
		obj.content = content;
		_this.show(obj);
		if(typeof(fun) != 'function'){
			fun = function(){
				alert('请设置确定事件。');
				return false;
			};
		}
		
		var dom_ = document.getElementById("confirmButton_"+_id_+"_"+time);
		var fun2 = function(){
			if(!fun()){
				FloaterManager._tool.unbind(dom_, 'click', fun2);
				_this.close();
			}
		};
		FloaterManager._tool.bind(dom_, 'click', fun2);
	};
	//用于请等待等地方。
	FloaterManager.prototype.ajaxLoading = function(content, time){
		var _this = this;
		var str = '<div style="text-align:left; border:#39F 1px solid; background-color:#CFF; padding:10px 20px; white-space:nowrap; display:block; margin:0px;">';
			str += '<img src="http://ossweb-img.qq.com/images/comm/load.gif" style="width:16px; height:16px;" />';
			str += '<span style=" margin-left:5px; font-size:12px; display:inline-table; vertical-align:middle; color:#222222;">'+content+'</span>';
			str += '</div>';
		var obj = {};
		obj.content = str;
		obj.style = 2;
		obj.border = 0;
		obj.isCanMove = false;
		obj.isShowHeader = false;
		obj.isAlignTop = true;
		obj.width = '';
		obj.height = -1;
		_this.show(obj);
		
		if(typeof(time) != "undefined" && !isNaN(time) && (time*1 > 0)){
			window.setTimeout(function(){
				_this.close();
			}, time);
		}
	};
}


{//显示集合
	//显示dom页面元素和隐藏的功能。
	FloaterManager.prototype._showDialog = function(domobj){
		var _this = this;
		if(domobj){
			domobj = (typeof(domobj) == 'object') ? domobj : document.getElementById(domobj);
		}
		
		if(!domobj){
		    alert('未设置要显示的对象或ID');
		    return;
		}
		_this.config.domobj = domobj;
		
		var _domobj = domobj;
		var showFun = function(){
			//增加一个显示的标记
			FloaterManager._instance.addFloater(_this);

			{//IE6下需要先隐藏所有除当前元素内的所有select框，最后再显示出来即可
				FloaterManager._tool._showSelectorInIE6(_domobj);
			}

		    _domobj.style.visibility = "visible";
			_domobj.style.position = "absolute";
			_domobj.style.display = 'block';
			FloaterManager._tool.setAlignCenter(_domobj); //局中显示出来

			//是否滚动局中
			if(_this.option.isAlignCenter){
				FloaterManager._tool._bindWindowResize();
			}
			
			if(!_this.config.id){
				_this.config.id = _this._getAutoId();
			}
			FloaterManager._instance.setFloaterTopById(_this.config.id);
			_this.option.onOpenEvent();
		};

		if(_this.option.isShowCover){
			FloaterManager._cover.show(function(){
				showFun();
			}, _this.option.coverColor);
		}else{
			showFun();
		}
	};
	FloaterManager.prototype._closeDialog = function(){
		var _this = this;
		var _domobj = _this._getHTMLElement();
		_domobj.style.display = 'none';

		_this.option.onCloseEvent();
		FloaterManager._instance.deleteFloaterById(_this._getAutoId());
		FloaterManager._tool.closeAll(_this);
	};
}

{//内部方法
	//生成显示内容的字符串
	FloaterManager.prototype._html = function(){
		var _this = this;
		var _id_ = _this._getAutoId();
		
		var _str = '';
		var _t = _this.option;
		if(_t.type == 'html'){//直接显示内容
			if(_t.isShowHeader){//显示标题
				_str += '<div class="floater_head">';
				_str += '<div class="floater_title">'+_t.title+'</div>';
				if(_t.isShowClose){
					_str += '<div class="close" onclick="FloaterManager._instance.close(\''+_id_+'\');">关闭</div>';
				}
				_str += '</div>';
			}
			_str += '<div class="floater_content" style="overflow:hidden;">'+_t.content+'</div>';
		}else if(_t.type == 'url'){
			if(_t.isShowHeader){//显示标题
				_str += '<div class="floater_head">';
				_str += '<div class="floater_title">'+_t.title+'</div>';
				if(_t.isShowClose){
					_str += '<div class="close" onclick="FloaterManager._instance.close(\''+_id_+'\');">关闭</div>';
				}
				_str += '</div>';
			}
			_str += '<div class="floater_content" style="overflow:hidden;"><iframe frameborder="0" width="100%" height="100%" style="margin:0px;" src="'+_t.content+'" scrolling="no"></iframe></div>';
		}else if(_t.type == 'dom'){
			
		}else{
			alert('option.type设置错误！');
		}
		return _str;
	};
	//添加入文件到页面上
	FloaterManager.prototype._addContent = function(){
		var _this = this;
		var _t = _this.option;
		var _id_ = _this._getAutoId();
		
		var cssobj = {
			'display' : 'block',
			'position' : 'absolute',
			'z-index' : 1000 + _id_,
			'overflow-x' : 'hidden'
		};
		{//调整宽高
			if(!FloaterManager._cover.isIE() && _t.border > 0){
				cssobj['width'] = _t.width - _t.border*2;
				cssobj['height'] = _t.height - _t.border*2;
			}else{
				cssobj['width'] = _t.width;
				cssobj['height'] = _t.height;
			}
			if(cssobj['height'] <= 0){//高度自动调节
				cssobj['height'] = 'auto';
				cssobj['overflow-y'] = 'auto';
			}else{
				cssobj['overflow-y'] = 'hidden';
			}
		}
		{//边框
			if(_t.border > 0){
				cssobj['border-style'] = 'solid';
				cssobj['border-width'] = _t.border+'px';
			}else{
				cssobj['border'] = 'none';
			}
		}
		
		var currDom = _this._getHTMLElement();
		FloaterManager._cover._setStyle(currDom, cssobj);
		currDom.innerHTML = _this._html();
	};
	//取得样式列表
	FloaterManager.prototype._setStyle = function(){
		var _this = this;
		var _styleStr = '';
		var _id_ = _this._getAutoId();
		
		if(_this.option.styleStr){
			_styleStr = _this.option.styleStr;
		}else{
			var _styleId = _this.option.style;
			if(_styleId == 1){//QQ登录样式
				_styleStr += '#coverdiv_' + _id_ + ' {background-color:#FFFFFF; border-color:#99C2EE;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_head {background-image:url(http://ossweb-img.qq.com/images/comm/login_headbg_img.gif); background-repeat:repeat-x; height:28px; font-weight:bold; font-size:12px; border-bottom:solid 1px #438ECE;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_head .floater_title {color: #333333; line-height:25px; float:left; width:auto;  font-size: 14px;font-weight: bold;text-indent: 0px;text-align: left; padding-left: 10px;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_head .close { float: right;height: 20px;width: 20px; margin:5px 5px 0px auto; background:url(http://imgcache.qq.com/ptlogin/v4/style/0/images/icons.gif) no-repeat 0 -284px; cursor: pointer; text-indent:-99999px; overflow:hidden;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_content {margin:8px; font-size:10pt; background:none;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_content li.button button {text-align:center; margin-left:5px; border:0; background:url(http://imgcache.qq.com/ptlogin/v4/style/0/images/icons.gif) no-repeat -102px -130px; color: #2473A2; width:103px; height:28px; cursor:pointer; font-weight:bold; font-size:14px;}';
				_styleStr += '#coverdiv_' + _id_ + ' input.button  {text-align:center; margin-left:5px; border:0; background:url(http://imgcache.qq.com/ptlogin/v4/style/0/images/icons.gif) no-repeat -102px -130px; color: #2473A2; width:103px; height:28px; cursor:pointer; font-weight:bold; font-size:14px;}';
			}else if(_styleId == 2){//无head，并且背景边框都无，类似loading
				_styleStr += '#coverdiv_' + _id_ + ' {padding:0px;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_content {margin:0px; text-align:center;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_content input.button { padding:2px 5px;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_content button.button { padding:2px 5px;}';
			}else{//默认样式
				_styleStr += '#coverdiv_' + _id_ + ' {background-color:#FFFFFF; border-color:#B0CDEA;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_head {background-color:#e6f5ff; height:25px; width:100%;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_head .floater_title {float:left; font-weight:700; line-height:25px; padding-left:8px; font-size:14px; color: #333333;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_head .close {color:#8CC0E7; float: right;height: 25px;width: 30px; margin-right:8px; text-align:right; cursor: pointer; line-height:25px; font-weight:bold; font-size:12px;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_content {margin:8px;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_content input.button { padding:2px 5px;}';
				_styleStr += '#coverdiv_' + _id_ + ' .floater_content button.button { padding:2px 5px;}';
			}
		}
		
		if(!document.getElementById('floaterStyleContent_'+_id_)){
			var styleDom = document.createElement('style');
			styleDom.setAttribute('id', 'floaterStyleContent_'+_id_);
			styleDom.setAttribute('type', 'text/css');
			styleDom.setAttribute('media', 'screen');
			var bodyDom = document.getElementsByTagName('body');
			if(!bodyDom || bodyDom.length == 0){
				alert('未找到页面body元素');
				return;
			}
			bodyDom = bodyDom[0];
			if(!bodyDom.hasChildNodes()){
				bodyDom.appendChild(styleDom);
			}else{
				bodyDom.insertBefore(styleDom, bodyDom.firstChild);
			}
		}
		var styleDom = document.getElementById('floaterStyleContent_'+_id_);
		if(styleDom.styleSheet){ //ie
			styleDom.styleSheet.cssText = _styleStr;
		}else if(document.getBoxObjectFor){
			styleDom.innerHTML = _styleStr;
		}else{
			styleDom.appendChild(document.createTextNode(_styleStr));
		}	
	
		{//设置content高度，防止数据过大，造成头部不显示。
			var domDiv = _this._getHTMLElement();
			var classDom = domDiv.getElementsByTagName('*');
			var headDom = null;
			var contentDom = null;
			for(var i = 0; i < classDom.length; i++){
				if(!headDom && classDom[i].className == 'floater_head'){
					headDom = classDom[i];
				}
				if(!contentDom && classDom[i].className == 'floater_content'){
					contentDom = classDom[i];
				}
			}
			if(_this.option.height > 0){
				var _head = parseInt((FloaterManager._tool.getStyle(headDom, 'height') || '0'), 10);
				var _margin = parseInt((FloaterManager._tool.getStyle(contentDom, 'margin') || '0'), 10)*2;
				if(!_head || isNaN(_head)){
					_head = 0;
				}
				if(!_margin || isNaN(_margin)){
					_margin = 0;
				}
	
				var _contentH = _this.option.height - _head - _margin - _this.option.border*2;
				if(!FloaterManager._cover.isIE()){
					_contentH -= 17;
				}
				
				if(_contentH <= 0){
					_contentH = 0;
				}
				try{
					FloaterManager._cover._setStyle(contentDom, {'height' : _contentH + 'px'});
				}catch(e){
					FloaterManager._cover._setStyle(contentDom, {'height' : 'auto'});
				}
			}
			
			if(_this.option.width > 0){
				var _margin = parseInt((FloaterManager._tool.getStyle(contentDom, 'margin') || '0'), 10)*2;
				if(!_margin || isNaN(_margin)){
					_margin = 0;
				}
				var _contentW = _this.option.width - _margin - _this.option.border*2;
				if(!FloaterManager._cover.isIE()){
					_contentW -= 17;
				}
				if(_contentW <= 0){
					_contentW = 0;
				}
				try{
					FloaterManager._cover._setStyle(contentDom, {'width' : _contentW + 'px'});
				}catch(e){
					FloaterManager._cover._setStyle(contentDom, {'width' : 'auto'});
				}
			}
		}
	};

}



/**
 * 静态方法
 * tiantian
 */
FloaterManager._isOnlyoneFloater = true; //是否只有一个Floater对象，这个参数主要是用来外部传入用的。
FloaterManager.init = function(opt, isOnlyoneFloater){
	FloaterManager._isOnlyoneFloater = typeof(isOnlyoneFloater) != 'undefined' ? isOnlyoneFloater : true;
	if(FloaterManager._isOnlyoneFloater && FloaterManager._instance._getFloaterNum() > 0){
		FloaterManager.close();
	}
	return new FloaterManager(opt);
};

//该方法是关闭页面上打开的所有层，用来关闭无法获得的元素的值。
FloaterManager.close = function(callback){
	var allFloater = FloaterManager._instance._getAllFloater();
	for(var i = 0; i < allFloater.length; i++){
		var _floater = allFloater[i].instance;
		if(_floater instanceof FloaterManager){
			_floater.close(callback);
		}
	}
};


//设置该层可移动的对象。
FloaterManager._setMoveEvent = function(mouseobj, floaterHander){
	var floaterId = floaterHander.config.id;

	var contentobj = document.getElementById("coverdiv_" + floaterId);

	if(floaterHander.option.type == 'dom'){
		if(!mouseobj){
			mouseobj = (typeof(floaterHander.option.title) == 'object') ? floaterHander.option.title : document.getElementById(floaterHander.option.title);
		}
		if(!mouseobj){
			return;
		}
		contentobj = floaterHander.config.domobj;
	}
	
	if(typeof(FloaterManager._eventObject) == 'undefined'){
		FloaterManager._eventObject = [];
	}
	
	var _oneobj = null;
	for(var i = 0; i < FloaterManager._eventObject.length; i++){
		var oneObj = FloaterManager._eventObject[i];
		if(!oneObj){
			continue;
		}
		if(oneObj.dom == mouseobj){
			_oneobj = FloaterManager._eventObject[i];
			FloaterManager._eventObject[i] = null;
			break;
		}
	}

	if(_oneobj){
		FloaterManager._tool.unbind(mouseobj, 'mousedown', _oneobj.mousedown);
		FloaterManager._tool.unbind(mouseobj, 'mouseup', _oneobj.mouseup);
		FloaterManager._tool.unbind(mouseobj, 'mousemove', _oneobj.mousemove);
	}

	_oneobj = {};
	_oneobj.dom = mouseobj;
	FloaterManager.__dragData = {
		'mouseX' : 0, //鼠标的坐标
		'mouseY' : 0,
		'contentX' : 0, //背景层的坐标
		'contentY' : 0,
		'ralativeX' : 0, //鼠标点击和背景层的相对坐标
		'ralativeY' : 0,
		'canMove' : false //是否可拖动
	};
	
	//如果点击的有onclick事件和href的时候，则选择不移动。
	var __isCanMove = function(e){
		var srcobj = e.srcElement || e.target;
		var tagNames = srcobj.tagName.toLowerCase();
		
		if(srcobj.onclick){
			return false;
		}
		
		if(tagNames == 'a' && srcobj.href){
			return false;
		}
		
		if(tagNames == 'input' || tagNames == 'select' || tagNames == 'textarea'){
			return false;
		}
		
		return true;
	};

	_oneobj.mousedown = function(e){
		e = e || window.event;
		
		if(!__isCanMove(e)){
			return;
		}
		
		
		{//看是否是最上层的
			mouseobj.style.cursor = 'move';
			FloaterManager._instance.setFloaterTopById(floaterId);
		}

		var contentobj = document.getElementById("coverdiv_" + floaterId);
		
		var currentFloater = FloaterManager._instance._getFloaterById(floaterId);
		if(currentFloater.option.type == 'dom'){
			contentobj = (typeof(currentFloater.option.content) == 'object') ? currentFloater.option.content : document.getElementById(currentFloater.option.content);
		}
		
		
		var _top = parseInt(FloaterManager._tool.getStyle(contentobj, 'top'), 10);
		var _left = parseInt(FloaterManager._tool.getStyle(contentobj, 'left'), 10);
		
		FloaterManager.__dragData = {
			'mouseX' : e.clientX,
			'mouseY' : e.clientY,
			'contentX' : _left,
			'contentY' : _top,
			'ralativeX' : e.clientX - _left,
			'ralativeY' : e.clientY - _top,
			'canMove' : true
		};
		mouseobj.setCapture ? mouseobj.setCapture() : null;
	};
	
	_oneobj.mouseup = function(e){
		mouseobj.style.cursor = '';
		FloaterManager.__dragData = {
			'mouseX' : 0,
			'mouseY' : 0,
			'contentX' : 0,
			'contentY' : 0,
			'ralativeX' : 0,
			'ralativeY' : 0,
			'canMove' : false
		};
		mouseobj.releaseCapture ? mouseobj.releaseCapture() : function(){};
	};
	
	_oneobj.mousemove = function(e){
		if(!FloaterManager.__dragData.canMove){
			return;
		}
		
		e = e || window.event;
		var iLeft = e.clientX - FloaterManager.__dragData.ralativeX;
		var iTop = e.clientY - FloaterManager.__dragData.ralativeY;
		
		var contentobj = document.getElementById("coverdiv_" + floaterId);
		
		var currentFloater = FloaterManager._instance._getFloaterById(floaterId);
		if(currentFloater.option.type == 'dom'){
			contentobj = (typeof(currentFloater.option.content) == 'object') ? currentFloater.option.content : document.getElementById(currentFloater.option.content);
		}
		
		{//判断值范围。
			{
				var iRight = document.body.clientWidth - parseInt(FloaterManager._tool.getStyle(contentobj, 'width'), 10);
				if(!FloaterManager._cover.isIE()){
					var border_width = FloaterManager._tool.getStyle(contentobj, 'border-width');
					if(border_width && !isNaN(border_width)){
						iRight -= 2 * parseInt(FloaterManager._tool.getStyle(contentobj, 'border-width'), 10);
					}
				}

				if(iRight > 0){
					iLeft = iLeft > iRight ? iRight : iLeft;
					iLeft = iLeft < 0 ? 0 : iLeft;
				}else{
					iLeft = 0;
				}
			}
			{//规定高度显示
				var vp = FloaterManager._cover._getViewPort();
				var pageHeight = FloaterManager._cover._getPageHeight();
				if(vp.h < pageHeight){
					vp.h = pageHeight;
				}
				var _h = parseInt(FloaterManager._tool.getStyle(contentobj, 'height'), 10);
				if(isNaN(_h)){
					_h = contentobj.clientHeight;
				}
				var iBottom = vp.h - 2 - _h - 17;
		
				if(!FloaterManager._cover.isIE()){
					var border_width = FloaterManager._tool.getStyle(contentobj, 'border-width');
					if(border_width && !isNaN(border_width)){
						iBottom -= 2 * parseInt(FloaterManager._tool.getStyle(contentobj, 'border-width'), 10);
					}
				}
				
				if(iBottom > 0){
					iTop = iTop > iBottom ? iBottom : iTop;
					iTop = iTop < 0 ? 0 : iTop;
				}else{
					iTop = 0;
				}
			}
		}

		contentobj.style.left = iLeft + "px";
		contentobj.style.top = iTop + "px";
		
		FloaterManager.__dragData.mouseX = e.clientX;
		FloaterManager.__dragData.mouseY = e.clientY;
		FloaterManager.__dragData.contentX = iLeft;
		FloaterManager.__dragData.contentY = iTop;
		return false;
	};
	
	FloaterManager._eventObject.push(_oneobj);

	FloaterManager._tool.bind(mouseobj, 'mousedown', _oneobj.mousedown);
	FloaterManager._tool.bind(mouseobj, 'mouseup', _oneobj.mouseup);
	FloaterManager._tool.bind(mouseobj, 'mousemove', _oneobj.mousemove);
};




















/**
 * 工具方法
 * tiantian
 */
FloaterManager._tool = {};
//合并
FloaterManager._tool.extend = function(option, opt){
	if(typeof(opt) == 'object'){
		for(var i in opt){
			option[i] = opt[i];
		}
	}
	return option;
};
//在IE6下将改层的selector显示出来
FloaterManager._tool._showSelectorInIE6 = function(_domobj){
	var isIE6 = FloaterManager._cover.isIE6();
	if(!isIE6){
		return;
	}
	if(!_domobj){
		return;
	}
	var allSelectList = _domobj.getElementsByTagName('select');
	if(allSelectList.length == 0){
		return;
	}
	
	var allSelectDisplayList = FloaterManager._cover.getAllSelector();
	for(var i = 0; i < allSelectList.length; i++){
		for(var k = 0; k < allSelectDisplayList.length; k++){
			var temp = allSelectDisplayList[k];
			if(temp.dom == allSelectList[i]){
				allSelectList[i].style.display = temp.display;
			}
		}
	}
};
//判断是否含有纵向滚动条
FloaterManager._tool._hasHeightScroll = function(_obj){
	_obj = _obj || document.documentElement || document.body;
	if(_obj.scrollHeight > _obj.clientHeight || _obj.offsetHeight > _obj.clientHeight){
		return true;
	}
	return false;
};


//设置自动改变高度。
FloaterManager._tool._autoHeight = function(_obj){
	if(!_obj){return;}
	FloaterManager._cover._setStyle(_obj,{
		'height' : 'auto'
	});
};

FloaterManager._tool.bind = function(oTarget, sEventType, fnHandler){
	if(typeof(fnHandler) != 'function'){
		return;
	}
	//IE和FF的兼容性处理 
	if(oTarget.addEventListener){//如果是FF
		oTarget.addEventListener(sEventType,fnHandler,false);
	}else if(oTarget.attachEvent){//如果是IE
		oTarget.attachEvent('on'+sEventType,fnHandler);
	} else{
		oTarget['on'+sEventType] = fnHandler;
	}
};
FloaterManager._tool.unbind = function(oTarget, sEventType, fnHandler){
	if(typeof(fnHandler) != 'function'){
		return;
	}
	if(oTarget.removeEventListener) {//如果是FF
		oTarget.removeEventListener(sEventType, fnHandler, false);
	}else if(oTarget.detachEvent) {//如果是IE
		oTarget.detachEvent('on' + sEventType, fnHandler);
	}else{
		oTarget['on'+sEventType] = null;
	}
};



//绑定屏幕的自动缩放功能
FloaterManager._tool._bindWindowResize = function(){
	var allFloterList = FloaterManager._instance._getAllFloater();
	var num = 0;
	for(var i = 0; i < allFloterList.length; i++){
		var tmp = allFloterList[i].instance;
		if(tmp.option.isAlignCenter && tmp.config.domobj){
			if(++num >= 2){
				return; //如果有居中的，说明已经绑定了事件。
			}
		}
	}
	
	windowResize____ = function(){
		var allFloterList = FloaterManager._instance._getAllFloater();
		var hasFloater = false;
		for(var i = 0; i < allFloterList.length; i++){
			var tmp = allFloterList[i].instance;
			if(tmp.option.isAlignCenter && tmp.config.domobj){
				FloaterManager._tool.setAlignCenter(tmp.config.domobj);
				hasFloater = true;
			}
		}
		if(!hasFloater || FloaterManager._instance._getFloaterNum() <= 0){
			FloaterManager._tool.unbind(window, 'resize', windowResize____);
			FloaterManager._tool.unbind(window, 'scroll', windowResize____);
		}
	};
	
	FloaterManager._tool.bind(window, 'resize', windowResize____);
	FloaterManager._tool.bind(window, 'scroll', windowResize____);
	windowResize____();
};

FloaterManager._tool.getStyle = function(element, styleName){
	var _camelize = function(str){
		if(str == 'float'){
			return typeof(element.style.styleFloat) != 'undefined' ? 'styleFloat' : 'cssFloat';
		}
		return str.replace(/\-(\w)/ig, function(B, A){
			return A.toUpperCase();
		});
	};

	var value = element.style[_camelize(styleName)];
	if (!value) {   
		if(document.defaultView && document.defaultView.getComputedStyle){   
			var css = document.defaultView.getComputedStyle(element, null);   
			value = css ? css.getPropertyValue(styleName) : null;   
		} else if (element.currentStyle) {   
			value = element.currentStyle[_camelize(styleName)];   
		}   
	}
	return value;
};

FloaterManager._tool.closeAll = function(floater){
	if(FloaterManager._instance._getFloaterNum() <= 0){
		FloaterManager._cover.hide(function(){
			floater.option.onAllCloseEvent();
		});
	}
};

FloaterManager._tool.getY = function(e){
	var t=e.offsetTop;
	while(e=e.offsetParent)t+=e.offsetTop;
	return t;
};

FloaterManager._tool.getMaxHeight = function(){
	var _getPageHeight = function(){
		var h = null;
		if(window.innerHeight && window.scrollMaxY){
			h = window.innerHeight + window.scrollMaxY;
		}else if(document.body.scrollHeight > document.body.offsetHeight){
			h = document.body.scrollHeight;
		}else{
			h = document.body.offsetHeight;
		}return h;
	};
	var _getWinHeight = function(){
		return (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
	};
	return (_getPageHeight() > _getWinHeight() ? (_getPageHeight()) : (_getWinHeight()*1-4));
};

FloaterManager._tool.setAlignCenter = function(_obj){
	if(!_obj){return;}
	var _getWinWidth = function(){
		return (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
	};
	var _getWinHeight = function(){
		return (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
	};
	
	_obj.style.margin = '0px';
	_obj.style.left = (_getWinWidth() / 2-_obj.clientWidth / 2) + "px";
	var iScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	var __top = _getWinHeight() / 2 + iScrollTop - _obj.clientHeight / 2;
	
	var _parentScrollTop = 0;
	try{
		if(iScrollTop == 0 && window.parent && window.parent != window.self){
		//表示是iframe页面，并且页面里没有滚动条情况
			var _getWinHeight2 = function(){
				return (window.parent.innerHeight) ? window.parent.innerHeight : (window.parent.document.documentElement && window.parent.document.documentElement.clientHeight) ? window.parent.document.documentElement.clientHeight : window.parent.document.body.offsetHeight;
			};
			var iScrollTop2 = window.parent.document.body.scrollTop || window.parent.document.documentElement.scrollTop;
			var _pTop = _getWinHeight2() / 2 + iScrollTop2 - _obj.clientHeight / 2;
			
			//设置变量让父窗口知道当前窗口的位置
			var _url = window.location.href;
			var doms = window.parent.document.getElementsByTagName('iframe');
			var _dom_ = null;
			if(doms && doms.length > 0){
				for(var i = 0; i < doms.length; i++){
					if(doms[i].src && _url.indexOf(doms[i].src) >= 0){
						_dom_ = doms[i];
						break;
					}
				}
			}
			var p_top = 0;
			if(_dom_){
				p_top = FloaterManager._tool.getY(_dom_);
			}
			if(_pTop > p_top){
				__top = _pTop - p_top;
			}else{
				__top = 0;
			}
		}
	}catch(e){}

	if(__top > (FloaterManager._tool.getMaxHeight() - _obj.clientHeight)){
		__top = FloaterManager._tool.getMaxHeight() - _obj.clientHeight - 10;
	}
	if(__top <= 0){
		__top = 0;
	}
	
	_obj.style.top = __top + 'px';
};


















/**
 * FloaterManager 所有实例管理
 * tiantian
 */
{//命名空间
	if(typeof(FloaterManager) == 'undefined'){
		FloaterManager = {};
	}
	if(typeof(FloaterManager._instance) == 'undefined'){
		FloaterManager._instance = {};
	}
}
FloaterManager._instance.option = {
	'ALL_FLOATER' : [],
	'maxId' : 0
};

//取得唯一的一个页面标识符
FloaterManager._instance._getAutoId = function(){
	return ++FloaterManager._instance.option.maxId;
};

//页面显示一个浮层
FloaterManager._instance.addFloater = function(floater){
	if(floater instanceof FloaterManager){
		FloaterManager._instance.option.ALL_FLOATER.push({
			'autoId' : floater._getAutoId(),
			'instance' : floater
		});
		return true;
	}
	return false;
};

//页面隐藏一个浮层
FloaterManager._instance.deleteFloaterById = function(id){
	var isDelete = false;
	var _all = FloaterManager._instance._getAllFloater();
	
	for(var i = 0; i < _all.length; i++){
		var tmp_id = _all[i].autoId;
		if(tmp_id == id){
			FloaterManager._instance.option.ALL_FLOATER[i] = null;
			isDelete = true;
			break;
		}
	}
	if(isDelete){
		var _tempArr = [];
		for(var i = 0; i < FloaterManager._instance.option.ALL_FLOATER.length; i++){
			var tmp = FloaterManager._instance.option.ALL_FLOATER[i];
			if(tmp){
				_tempArr.push(tmp);
			}
		}
		FloaterManager._instance.option.ALL_FLOATER = _tempArr;
		return true;
	}
	return false;
};

//取得所有层的实例信息
FloaterManager._instance._getAllFloater = function(){
	return FloaterManager._instance.option.ALL_FLOATER;
};

//取得单个实例信息
FloaterManager._instance._getFloaterById = function(id){
	var _all = FloaterManager._instance._getAllFloater();
	for(var i = 0; i < _all.length; i++){
		var tmp_id = _all[i].autoId;
		if(tmp_id == id){
			return _all[i].instance;
		}
	}
	return null;
};

//取得单个实例数量
FloaterManager._instance._getFloaterNum = function(){
	var _all = FloaterManager._instance._getAllFloater();
	return _all.length;
};

FloaterManager._instance.close = function(id){
	var _floater = FloaterManager._instance._getFloaterById(id);
	if(!_floater){
		return;
	}
	_floater.close();
};

//设置层最上层显示
FloaterManager._instance.setFloaterTopById = function(id){
	var _maxTopIndex = 10000; //大于10000中最大的置顶数字
	var _minTopIndex = 1000; //普通中最大的置顶数字
	
	var _all = FloaterManager._instance._getAllFloater();
	{//设置最顶z-index大小。
		for(var i = 0; i < _all.length; i++){
			var _tFloater = _all[i].instance;
			var tmp_id = _all[i].autoId;
			var tmp_index = 0;
			
			var _tDom = null;
			if(_tFloater.option.type == 'dom'){
				if(typeof(_tFloater.option.content) == 'object'){
					_tDom = _tFloater.option.content;
				}else if(typeof(_tFloater.option.content) == 'string'){
					_tDom = document.getElementById(_tFloater.option.content);
				}
				tmp_index = FloaterManager._tool.getStyle(_tDom, 'z-index');
			}else{
				_tDom = document.getElementById("coverdiv_" + tmp_id);
				tmp_index = FloaterManager._tool.getStyle(_tDom, 'z-index');
			}

			if(!tmp_index || isNaN(tmp_index)){
				tmp_index = 0;
			}
			if(tmp_index*1 > 10000){
				if(tmp_index*1 > _maxTopIndex){
					_maxTopIndex = tmp_index*1;
				}
			}else{
				if(tmp_index*1 > _minTopIndex){
					_minTopIndex = tmp_index*1;
				}
			}
		}
	}
	
	{//设置当前的z-index
		var curr_index = 0;
		var _tFloater = FloaterManager._instance._getFloaterById(id);
		var _currentDom = null;
		
		if(_tFloater.option.type == 'dom'){
			var _tDom = null;
			if(typeof(_tFloater.option.content) == 'object'){
				_currentDom = _tFloater.option.content;
			}else if(typeof(_tFloater.option.content) == 'string'){
				_currentDom = document.getElementById(_tFloater.option.content);
			}
			curr_index = FloaterManager._tool.getStyle(_currentDom, 'z-index');
		}else{
			_currentDom = document.getElementById("coverdiv_" + id);
			curr_index = FloaterManager._tool.getStyle(_currentDom, 'z-index');
		}
		
		if(!curr_index || isNaN(curr_index)){
			curr_index = 0;
		}
		
		var _current_max_index = curr_index*1;
		if(_tFloater.option.isAlignTop){//如果是置顶的设置，则在此基础上多加10000，表示置顶设置。
			if(curr_index*1 < 10000){
				_current_max_index = FloaterManager._instance._getAutoId() + 10000;
			}
		}else{
			if(curr_index*1 < 1000){
				_current_max_index = FloaterManager._instance._getAutoId() + 1000;
			}
		}

		if(_current_max_index > 10000){//表示在置顶中再置顶显示
			if(_current_max_index*1 < _maxTopIndex){
				_current_max_index = _maxTopIndex;
			}
		}else{//表示在普通中置顶显示
			if(_current_max_index*1 < _minTopIndex){
				_current_max_index = _minTopIndex;
			}
		}
		var _setIndex = FloaterManager._tool.getStyle(_currentDom, 'z-index') || '0';
		_setIndex = parseInt(_setIndex);

		if(_setIndex*1 != _current_max_index){
			FloaterManager._cover._setStyle(_currentDom, {'z-index' : _current_max_index*1 + 1});
		}
	}
};




























/**
 * 背景层的显示功能
 * tiantian
 */
{//命名空间
	if(typeof(FloaterManager) == 'undefined'){
		FloaterManager = {};
	}
	if(typeof(FloaterManager._cover) == 'undefined'){
		FloaterManager._cover = {};
	}
}

{//基本方法
	FloaterManager._cover.isOpera = function(){
		return window.opera && window.opera.buildNumber;
	};
	
	FloaterManager._cover.isWebKit = function(){
		return /WebKit/.test(navigator.userAgent);
	};
	
	FloaterManager._cover.isIE = function(){
		var _isnotWebKit = !FloaterManager._cover.isWebKit();
		var _isnotOpera = !FloaterManager._cover.isOpera();
		var _isIE = (/MSIE/gi).test(navigator.userAgent);
		var _explorer = (/Explorer/gi).test(navigator.appName);
		return _isnotWebKit && _isnotOpera && _isIE && _explorer;
	};
	
	FloaterManager._cover.isIE6 = function(){
		var _isIE = FloaterManager._cover.isIE();
		var _isIE6 = (/MSIE [56]/gi).test(navigator.userAgent);
		return _isIE && _isIE6;
	};
	
	FloaterManager._cover.isFireFox = function(){
		var _isFireFox = (/firefox/gi).test(navigator.userAgent);
		return _isFireFox;
	};

	FloaterManager._cover._setStyle = function(element, styleObj){
		var _camelize = function(str){
			return str.replace(/\-(\w)/ig, function(B, A){
				return A.toUpperCase();
			});
		};
		var pixelStyles = /^(top|left|bottom|right|width|height|borderWidth)$/;
		var isIE = FloaterManager._cover.isIE();
		
		var setOneStyle = function(e, na, v){
			na = _camelize(na);
			var s = e.style;
			if(pixelStyles.test(na) && (typeof(v) == 'number' || /^[\-0-9\.]+$/.test(v))){
				v += 'px';
			}
			if(na == 'opacity'){
				if(isIE){
					s.filter = (v === '') ? '' : "alpha(opacity=" + v + ")";
					
					if (!e.currentStyle || !e.currentStyle.hasLayout){
						s.display = 'inline-block';
					}
					return true;
				}
				s['opacity'] = s['-moz-opacity'] = s['-khtml-opacity'] = (v / 100) || '';
				return true;
			}

			if(na == 'float'){
				if(isIE){
					s.styleFloat = v;
				}else{
					s.cssFloat = v;
				}
				return true;
			}
			
			s[na] = v || '';
			return true;
		};

		for(var i in styleObj){
			if(i){
				try{ setOneStyle(element, i, styleObj[i]); }catch(e){}
			}
		}
		return true;
	};
	
	FloaterManager._cover._show = function(element){
		FloaterManager._cover._setStyle(element, {
			'display' : 'block'
		});
	};
	
	FloaterManager._cover._hide = function(element){
		FloaterManager._cover._setStyle(element, {
			'display' : 'none'
		});
	};
	
	FloaterManager._cover._getViewPort = function(w){
		w = w || window;
		var d = w.document;
		var stdMode = d.documentMode >= 8;
		var boxModel = !FloaterManager._cover.isIE() || d.compatMode == "CSS1Compat" || stdMode;
		var b = boxModel ? d.documentElement : d.body;
		
		// Returns viewport size excluding scrollbars
		return {
			x : w.pageXOffset || b.scrollLeft,
			y : w.pageYOffset || b.scrollTop,
			w : w.innerWidth || b.clientWidth,
			h : w.innerHeight || b.clientHeight
		};
	};
	
	FloaterManager._cover._getPageHeight = function(){
		var h = 0;
		if(window.innerHeight && window.scrollMaxY){
			h = window.innerHeight + window.scrollMaxY;
		}else if(document.body.scrollHeight > document.body.offsetHeight){
			h = document.body.scrollHeight;
		}else{
			h = document.body.offsetHeight;
		}
		return h;
	};
}

FloaterManager._cover.option = {
	'opacity' : 50,
	'overflowX' : '',
	'allSelectDisplayList' : [], //页面上所有select框信息
	'timeInterval' : null
};

//创建背景
FloaterManager._cover._createBackground = function(color, opacity){ //颜色和透明度
	var _this = this;
	color = color || '#E6F5FF';
	opacity = opacity || 50;	

	var _body = document.body;
	if(!_body){
		alert('没找到body标签，请放到body之后引用');
		return null;
	}
	var bgobj = document.getElementById('coverbg');
	if(!bgobj){
		bgobj = document.createElement('div');
		bgobj.setAttribute('id','coverbg');
		FloaterManager._cover._setStyle(bgobj, {
			'display' : 'none',
			'z-Index' : '998',
			'width' : '100%',
			'height' : '100%',
			'left' : '0px',
			'top' : '0px'
		});
		var _child = _body.children[0];
		if(_child){
			_body.insertBefore(bgobj, _child);
		}else{
			_body.insertBefore(bgobj);
		}
	}

	var _createIframe = function(){
		var iframebg = bgobj.children[0];
		
		if(iframebg){
			return iframebg;
		}
		try{
			iframebg = document.createElement("iframe");
			iframebg.setAttribute("src","about:blank;");
			iframebg.setAttribute("scrolling","no");
			iframebg.setAttribute("frameborder","0");
			iframebg.setAttribute("allowtransparency","true");
			FloaterManager._cover._setStyle(iframebg, {
				'position' : 'fixed',
				'border': 'none',
				'z-Index':'997',
				'top':'0px',
				'left':'0px',
				'width' : '100%',
				'height' : '100%',
				'opacity' : '0',
				'background-color' : 'transparent'
			});

			var isIE6 = FloaterManager._cover.isIE6();
			if(isIE6){
				FloaterManager._cover._hide(iframebg);
			}
			bgobj.appendChild(iframebg);
			return iframebg;
		}catch(e){}
		return null;
	};
	
	var iframebg = _createIframe();

	FloaterManager._cover._setStyle(bgobj, {
		'position' : 'absolute',
		'backgroundColor' : color,
		'opacity' : opacity,
		'width' : '100%',
		'height' : '100%'
	});
	return bgobj;
};


FloaterManager._cover.getAllSelector = function(){
	if(FloaterManager._cover.option.allSelectDisplayList){
		return FloaterManager._cover.option.allSelectDisplayList;
	}
	return [];
};


FloaterManager._cover.show = function(callback, bgoption){
	var color = '';
	var opacity = 0;
	if(typeof(bgoption) == 'string'){
		color = bgoption;
	}
	if(typeof(bgoption) == 'object'){
		color = bgoption.color || '';
		if(typeof(bgoption.opacity) == 'number'){
			opacity = bgoption.opacity;
		}
	}
	if(opacity == 0){
		opacity = FloaterManager._cover.option.opacity;
	}
	
	var bgobj = FloaterManager._cover._createBackground(color, opacity);
	if(!bgobj){
		return;
	}
	
	var _body = document.body;
	FloaterManager._cover.option.overflowX = _body.style.overflowX;
	
	FloaterManager._cover._setStyle(_body,{
		overflowX : 'hidden'
	});
	
	{//IE6下需要先隐藏所有select框，最后再显示出来即可
		var isIE6 = FloaterManager._cover.isIE6();
		if(isIE6){
			FloaterManager._cover._setStyle(document.getElementsByTagName('html')[0],{
				overflowX : 'hidden'
			});

			var allSelectList = document.getElementsByTagName('select');
			if(allSelectList.length > 0){
				FloaterManager._cover.option.allSelectDisplayList = [];
				for(var i = 0; i < allSelectList.length; i++){
					var _temp = allSelectList[i];
					FloaterManager._cover.option.allSelectDisplayList.push({
						'dom' : _temp,
						'display' : _temp.style.display
					});
					FloaterManager._cover._hide(_temp);
				}
			}
		}
	}

	FloaterManager._cover.option.CURR_BODY_HEIGHT = document.body.scrollHeight;//保存当前的最大body值
	FloaterManager._cover._show(bgobj);
			
	if(typeof(callback) == 'function'){
		callback();
	}

	FloaterManager._cover.option.timeInterval = setInterval(function(){
		FloaterManager._cover._adjust();
	}, 30);
};

FloaterManager._cover.hide = function(callback){
	if(FloaterManager._cover.option.timeInterval){
		clearInterval(FloaterManager._cover.option.timeInterval);
		FloaterManager._cover.option.timeInterval = null;
	}
	var bgobj = document.getElementById('coverbg');
	if(!bgobj){
		return;
	}
	
	var _body = document.body;
	_body.style.overflowX = FloaterManager._cover.option.overflowX;
	
	FloaterManager._cover._hide(bgobj);
	
	{//IE6下需要先隐藏所有select框，最后再显示出来即可
		var isIE6 = FloaterManager._cover.isIE6();
		if(isIE6){
			
			FloaterManager._cover._setStyle(document.getElementsByTagName('html')[0],{
				overflowX : 'auto'
			});

			if(FloaterManager._cover.option.allSelectDisplayList){
				for(var i = 0; i < FloaterManager._cover.option.allSelectDisplayList.length; i++){
					var temp = FloaterManager._cover.option.allSelectDisplayList[i];
					FloaterManager._cover._setStyle(temp.dom,{
						'display' : temp.display
					});
				}
				FloaterManager._cover.option.allSelectDisplayList = null;
			}
		}
	}

	if(typeof(callback) == 'function'){
		callback();
	}
};

//调整高度即可
FloaterManager._cover._adjust = function(){
	var bgobj = document.getElementById('coverbg');
	if(!bgobj){
		return;
	}
	
	var _height = '100%';
	{
		var vp = FloaterManager._cover._getViewPort();
		var _win = vp.h - 2;

		if(_win < FloaterManager._cover.option.CURR_BODY_HEIGHT){
			_height = FloaterManager._cover._getPageHeight();
			FloaterManager._cover.option.CURR_BODY_HEIGHT += 5;
			if(FloaterManager._cover.option.CURR_BODY_HEIGHT > _height){
				FloaterManager._cover.option.CURR_BODY_HEIGHT = _height;
			}
		}
	}

	FloaterManager._cover._setStyle(bgobj, {
		'height' : _height
	});
	var iframebg = bgobj.children[0];
	if(iframebg){
		FloaterManager._cover._setStyle(iframebg, {
			'height' : _height
		});
	}
};


////////////////////////////////////////////////////////

//显示层
//FloaterManager.showCover = FloaterManager._cover.show;
//FloaterManager.hideCover = FloaterManager._cover.hide;







/*  |xGv00|e2ae39e33e701c5f2f899d9a01ca8e2e */