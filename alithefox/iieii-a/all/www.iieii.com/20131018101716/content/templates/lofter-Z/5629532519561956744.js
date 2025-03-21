/* @script.js文件 */

$(document).ready(function () {
	// layout 
	if ($.browser.msie && $.browser.version === '10.0') {  // <ul>,<ol>
		$('html').addClass('ie10');
	}
	if ($.browser.msie && $.browser.version === '6.0') {
		mkhover('.m-nav li', 'hover');
	}
	
	// search
	$('#j-lnksch').bind('click', function () {
		$(this).hide();
		$('#j-schform').show().find('.txt').focus();
		return false;
	});
	$('#j-schform .txt').bind('blur', function () {
		$('#j-schform').hide();
		$('#j-lnksch').show();
		return false;
	});
	
	// disable current pager
	$('.m-pager-idx .active').bind('click', function () {
		return false;
	});
});
function mkhover(obj, newclass) {
	$(obj).hover(
		function () {
			$(this).addClass(newclass);
		},
		function () {
			$(this).removeClass(newclass);
		}
	);
}