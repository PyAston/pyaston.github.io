;(function(){PageSpeed={};PageSpeed.createScript=function(a,b){var c=null;if(document.getElementById(b)){c=document.getElementById(b)}else{c=document.createElement('script');var d=null;if(document.getElementsByTagName){d=document.getElementsByTagName('head')[0]||document.documentElement}else{d=document.documentElement}d.insertBefore(c,d.firstChild)}{c.setAttribute('type','text/html');c.setAttribute('style','display:none;');c.setAttribute('charset','gb2312');c.setAttribute('id',b);c.setAttribute('src',a)}return c};PageSpeed.submitDataForPageSpeed=function(a){var b={'name':'','rate':0};b.name=a.name;b.rate=a.rate;b['1']=a.PAGE_SPEED_TIME[a.PAGE_SPEED_TIME.length-1]-a.PAGE_SPEED_TIME[0];for(var i=1;i<a.PAGE_SPEED_TIME.length-1;i++){b[(i+1)+'']=a.PAGE_SPEED_TIME[i]-a.PAGE_SPEED_TIME[0]}var c='http://pagespeed-ied.qq.com/r.cgi';var d=[];for(var p in b){d.push(p+'='+b[p])}c+='?'+d.join('&');PageSpeed.createScript(c,'submitForPageSpeed')};PageSpeed.defaultSubmit=function(){var a='';try{a=location.host}catch(e){}var b={'name':a,'rate':1,'PAGE_SPEED_TIME':[]};if(!b.name){return}if(!(typeof(PAGE_SPEED_TIME)=='object'&&PAGE_SPEED_TIME instanceof Array)){return}PAGE_SPEED_TIME.push(new Date().getTime());b.PAGE_SPEED_TIME=PAGE_SPEED_TIME;
	
	var aaa='';try{aaaa=location.host}catch(e){}
	var c=Math.floor(Math.random()*10000);
	
	if(aaa =="ktv.qq.com"||aaa =="ttd.qq.com"||aaa =="tian.qq.com" ||aaa =="sura.qq.com" ||aaa =="gw.tnt.qq.com" ||aaa =="007.qq.com")
	{
		c=Math.floor(Math.random()*1000);
	}
	
	if(c<=b.rate*1){PageSpeed.submitDataForPageSpeed(b)}};PageSpeed.submit=function(a){var b=PageSpeed.cdn_page_speed_submitData;var c={};for(var p in b){c[p]=b[p]}c.name=a||c.name;PageSpeed.submitDataForPageSpeed(c)}})();try{setTimeout(function(){PageSpeed.defaultSubmit()},1000)}catch(e){}/*  |xGv00|ca82276cd78ac911d3d4310ba1408236 */