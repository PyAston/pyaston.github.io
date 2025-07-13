// 定义一个全局命名空间 AliWorld，如果已经存在则使用原有的
window.AliWorld = window.AliWorld || {};

// 注册一个方法到命名空间
AliWorld.initBackground = async function () {
	try {
		const response = await fetch('background.txt');
		const text = await response.text();
		const lines = text.trim().split('\n');
		const image = lines[Math.floor(Math.random() * lines.length)].trim();

		const img = document.getElementById('bg-image');
		img.style.opacity = '0'; // 设置初始透明

		// 确保加载完成后触发动画
		img.onload = () => {
			// 强制触发 reflow，确保 transition 生效
			void img.offsetWidth;
			img.style.opacity = '1'; // 渐变显示
		};

		img.onerror = () => {
			console.error('背景图加载失败：', image);
		};

		img.src = image;
	} catch (e) {
		console.error('无法加载 background.txt', e);
	}
};
