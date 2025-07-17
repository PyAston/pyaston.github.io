window.AliWorld = window.AliWorld || {};

AliWorld.initBackground = async function () {
  try {
    // 原有背景图加载逻辑
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const config = isMobile
      ? { txtFile: '/assets/img/alithefox/background.pe.txt' }
      : { txtFile: '/assets/img/alithefox/background.pc.txt' };

    const response = await fetch(config.txtFile);
    const text = await response.text();
    const filenames = text.trim().split('\n').map(line => line.trim()).filter(Boolean);
    const chosen = filenames[Math.floor(Math.random() * filenames.length)];
    const img = document.getElementById('bg-image');
    
    img.style.opacity = '0';
    img.onload = () => {
      void img.offsetWidth;
      img.style.opacity = '1';
    };
    img.onerror = () => console.error('背景图加载失败：', chosen);
    img.src = chosen;

    // 新增导航交互逻辑
    this.initNavigation();
    
  } catch (e) {
    console.error('初始化失败：', e);
  }

  // 启动按钮逻辑保持不变
  document.getElementById('enter-button')?.addEventListener('click', () => {
    document.body.classList.add('loaded');
  });

  this.initNavigation(); // 新增此行
};

AliWorld.initNavigation = function() {
  // 默认显示欢迎内容
  document.getElementById('welcome-content').style.display = 'block';
  
  // 为导航按钮添加点击事件
  document.querySelectorAll('header nav a').forEach(navBtn => {
    navBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 隐藏所有内容区域（包括欢迎内容）
      document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
      });
      
      // 显示对应内容
      const targetId = this.getAttribute('href').substring(1) + '-content';
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
      } else {
        // 如果没有对应内容，显示欢迎信息
        document.getElementById('welcome-content').style.display = 'block';
      }
    });
  });
  
  // 为侧边栏按钮也添加类似功能（可选）
  document.querySelectorAll('aside a').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      // 同样的内容切换逻辑...
    });
  });
};