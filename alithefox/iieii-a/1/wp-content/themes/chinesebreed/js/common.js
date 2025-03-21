var mouseover_tid = [];
var mouseout_tid = [];

$(document).ready(function(){
	$('.subnav > li').each(function(index){
		$(this).hover(
			function(){
				var _self = this;
				clearTimeout(mouseout_tid[index]);
				mouseover_tid[index] = setTimeout(function() {
					jQuery(_self).find('ul:eq(0)').fadeIn(200);
				}, 400);
			},
			function(){
				var _self = this;
				clearTimeout(mouseover_tid[index]);
				mouseout_tid[index] = setTimeout(function() {
					jQuery(_self).find('ul:eq(0)').fadeOut(200);
				}, 400);
			}
		);
	});
});

jQuery(document).ready(function(){
	$(".tab_head span:first").addClass("current");
	$(".tab_body ul:not(:first)").hide();
	//$(".tab_head span").click(function(){
	$(".tab_head span").mouseover(function(){
		$(".tab_head span").removeClass("current");
		$(this).addClass("current");
		$(".tab_body ul").hide();
		$("."+$(this).attr("id")).fadeIn("slow");
	});
});