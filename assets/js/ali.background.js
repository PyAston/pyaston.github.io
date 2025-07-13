window.AliWorld = window.AliWorld || {};

AliWorld.initBackground = async function () {
  try {
    // 1. 判断是否为手机设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 2. 根据设备类型选择不同的背景文件
    const backgroundFile = isMobile ? 'background.phone.txt' : 'background.pc.txt';

    // 3. 加载背景链接列表
    const response = await fetch(backgroundFile);
    const text = await response.text();
    const lines = text.trim().split('\n');
    const image = lines[Math.floor(Math.random() * lines.length)].trim();

    const img = document.getElementById('bg-image');
    img.style.opacity = '0';

    // 4. 等加载完成再渐变显示
    img.onload = () => {
      void img.offsetWidth; // 触发重绘以确保过渡动画生效
      img.style.opacity = '1';
    };

    img.onerror = () => {
      console.error('背景图加载失败：', image);
    };

    img.src = image;
  } catch (e) {
    console.error('无法加载背景图片：', e);
  }
};
