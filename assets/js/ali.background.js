window.AliWorld = window.AliWorld || {};

AliWorld.initBackground = async function () {
  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 根据设备类型选择路径和文件名
    const config = isMobile
      ? {
          txtFile: '/assets/img/alithefox/background.pe.txt',
          imgBase: 'https://gcore.jsdelivr.net/gh/PyAston/pyaston.github.io/assets/img/alithefox/background-pe/',
        }
      : {
          txtFile: '/assets/img/alithefox/background.pc.txt',
          imgBase: 'https://gcore.jsdelivr.net/gh/PyAston/pyaston.github.io/assets/img/alithefox/background-pc/',
        };

    // 加载文本列表
    const response = await fetch(config.txtFile);
    const text = await response.text();
    const filenames = text.trim().split('\n').map(line => line.trim()).filter(Boolean);

    // 随机选择图片
    const chosen = filenames[Math.floor(Math.random() * filenames.length)];
    const fullImageUrl = config.imgBase + chosen;

    // 设置为背景图
    const img = document.getElementById('bg-image');
    img.style.opacity = '0';

    img.onload = () => {
      void img.offsetWidth; // 强制重绘，确保动画生效
      img.style.opacity = '1';
    };

    img.onerror = () => {
      console.error('背景图加载失败：', fullImageUrl);
    };

    img.src = fullImageUrl;
  } catch (e) {
    console.error('读取背景图失败：', e);
  }
};
