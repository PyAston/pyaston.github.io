(function hitokoto() {
    // 获取 hitokoto.json 文件
    fetch('/alithefox/iieii-new/data/hitokoto.json')
        .then(response => response.json())  // 解析 JSON 数据
        .then(hitokotoList => {
            // 随机选择一条句子
            var randomHitokoto = hitokotoList[Math.floor(Math.random() * hitokotoList.length)];
            
            // 获取所有 #hitokoto 的 DOM 元素并更新其内容
            var domList = document.querySelectorAll('#hitokoto');
            domList.forEach(dom => dom.innerText = randomHitokoto);
        })
        .catch(error => console.error('读取 hitokoto.json 文件失败:', error));
})();
