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




    // ----- 4. 留言板功能 -----
    // 留言数据存储（页面刷新会丢失）
    let messages = [];

    function renderMessages() {
        messageList.innerHTML = '';
        messages.forEach((msg, index) => {
            const li = document.createElement('li');
            li.classList.add('message-item');
            li.innerHTML = `
        <span class="nickname">${escapeHTML(msg.nickname)}:</span>
        <span class="content">${escapeHTML(msg.content)}</span>
        <button class="delete-btn" data-index="${index}" title="删除留言">✖</button>
      `;
            messageList.appendChild(li);
        });
    }

    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        const nicknameInput = document.getElementById('nickname');
        const messageInput = document.getElementById('message');
        const nickname = nicknameInput.value.trim();
        const content = messageInput.value.trim();

        if (!nickname || !content) return;

        messages.push({ nickname, content });
        renderMessages();

        // 清空输入框
        nicknameInput.value = '';
        messageInput.value = '';
    });

    // 删除留言事件委托
    messageList.addEventListener('click', e => {
        if (e.target.classList.contains('delete-btn')) {
            const index = Number(e.target.dataset.index);
            if (!isNaN(index)) {
                messages.splice(index, 1);
                renderMessages();
            }
        }
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
