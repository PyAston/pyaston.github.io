(function(){
	var loadJquery = function(_callback) {
		var _url = "http://l.bst.126.net/rsc/js/jquery-1.6.2.min.js";
		var _script = document.createElement('script');
		_script.type = 'text/javascript';
		(navigator.appVersion.indexOf("MSIE") != -1) ? _script.onreadystatechange = _callback
				: _script.onload = _callback;
		if (_url != '') {
			_script.src = _url;
		}
		document.getElementsByTagName('head')[0].appendChild(_script);
	};

	var commonFunc = function() {
		if (!!window.Theme&&!!window.Theme.ImageProtected) {
			$(document).delegate('img', 'contextmenu', function(event){
				if (/^http:\/\/img(lf\d*|size|\d*)\.ph\.126\.net\/.+$/.test($(this).attr('src'))) {
					 $("#context_content").remove();
		             $("<div id='context_content' oncontextmenu='return false;' style='z-index:99999;color:#fff;position:absolute;background:#000;padding:8px;opacity:.8;filter:alpha(opacity=80);border-radius:3px;'>" + window.Theme.ContextValue + "</div>").appendTo("body")
		                .css("left", event.pageX)
		                .css("top", event.pageY)
		                .show().delay(3000).fadeOut('fast');
					event.returnValue=false;
					return false;
				}
			});
			$(document).click(function(event){
				$("#context_content").remove();
			});
			$('img').click(function(event){
				$("#context_content").remove();
			});
		}

		if (!!window.pagewidget) {
			$('input').bind('keydown', function(event){
				event.stopPropagation();
		        return true;
			});
			$(document).bind('keydown', function(event){
				if (!!window['__photo_showing_lock__']) {
					return true;
				}
				if (event.keyCode == 75 || event.keyCode == 39) {
					var nextLink = $('#__next_permalink__').attr('href');
					if (!!nextLink) {
						location.href = nextLink;
					}
					return false;
				}
				if (event.keyCode == 74 || event.keyCode == 37) {
					var prevLink = $('#__prev_permalink__').attr('href');
					if (!!prevLink) {
						location.href = prevLink;
					}
					return false;
				}
			});
		}
	};

	try {
		if(!window.jQuery) {
		   loadJquery(commonFunc);
		} else {
			$(document).ready(commonFunc);
		}
	} catch(e) {

	}

})();