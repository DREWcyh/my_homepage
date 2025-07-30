// 页面加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 变量
    const navLinks = document.querySelectorAll('.nav-link');
    const downloadBtn = document.getElementById('download-cv');
    const messageForm = document.getElementById('message-form');
    const messageList = document.getElementById('message-list');

    // ----- 1. 导航锚点平滑滚动 & 高亮 -----
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElem = document.getElementById(targetId);
            if (targetElem) {
                window.scrollTo({
                    top: targetElem.offsetTop - 50, // 导航高度偏移
                    behavior: 'smooth'
                });
                setActiveNav(link);
            }
        });
    });

    function setActiveNav(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // 页面滚动时根据视口自动更新导航激活状态
    window.addEventListener('scroll', () => {
        let fromTop = window.scrollY + 60;
        navLinks.forEach(link => {
            let section = document.querySelector(link.hash);
            if (
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                setActiveNav(link);
            }
        });
    });

    // 防止XSS的简单转义函数
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, tag => {
            const chars = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return chars[tag] || tag;
        });
    }
});
