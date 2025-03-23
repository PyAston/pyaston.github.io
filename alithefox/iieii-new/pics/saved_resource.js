/*
(function hitokoto(){var hitokoto="春色满园关不住，一枝红杏出墙来。";var dom=document.querySelector('#hitokoto');Array.isArray(dom)?dom[0].innerText=hitokoto:dom.innerText=hitokoto;})()
*/
(function hitokoto(){
    var hitokoto = "春色满园关不住，一枝红杏出墙来。";
    var domList = document.querySelectorAll('#hitokoto'); 
    domList.forEach(dom => dom.innerText = hitokoto);
})();
