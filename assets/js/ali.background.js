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

AliWorld.initNavigation = function () {
  const welcome = document.getElementById('welcome-content');
  const allSidebarLinks = document.querySelectorAll('aside a.fade-move');
  const contentSections = document.querySelectorAll('.content-section');

  // 初始化：隐藏所有按钮，仅欢迎语显示
  allSidebarLinks.forEach(a => a.classList.remove('show'));
  welcome.classList.add('show');

  // 点击导航栏按钮
  document.querySelectorAll('header nav a').forEach(navBtn => {
    navBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const group = this.dataset.target;

      // 隐藏欢迎语
      welcome.classList.remove('show');

      // 隐藏全部按钮
      allSidebarLinks.forEach(a => a.classList.remove('show'));

      // 显示目标组按钮
      document.querySelectorAll(`aside a[data-group="${group}"]`).forEach(a => {
        a.classList.add('show');
      });

      // 隐藏所有内容区
      contentSections.forEach(section => section.classList.remove('show'));

      // 显示目标内容区
      const targetMain = document.getElementById(`${group}-content`);
      if (targetMain) {
        targetMain.classList.add('show');
      }
    });
  });

  // 点击侧边按钮显示内容
  allSidebarLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href').substring(1) + '-content';

      contentSections.forEach(section => section.classList.remove('show'));
      const target = document.getElementById(id);
      if (target) {
        target.classList.add('show');
      }
    });
  });
};
