// 全局状态
let state = {
    template: 1,
    images: [],
    shopName: '',
    slogan: ''
};

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    initTemplateSelection();
    initUpload();
});

// 初始化模板选择
function initTemplateSelection() {
    const cards = document.querySelectorAll('.template-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // 移除所有选中状态
            cards.forEach(c => c.classList.remove('selected'));
            // 添加选中状态
            card.classList.add('selected');
            // 更新状态
            state.template = parseInt(card.dataset.template);
        });
    });
}

// 初始化上传功能
function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

// 处理上传的文件
function handleFiles(files) {
    const preview = document.getElementById('videoPreview');
    preview.innerHTML = '';
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '200px';
                img.style.objectFit = 'contain';
                preview.appendChild(img);
                
                // 保存到状态
                state.images.push(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}

// 更新预览
function updatePreview() {
    const shopName = document.getElementById('shopName').value;
    const slogan = document.getElementById('slogan').value;
    state.shopName = shopName;
    state.slogan = slogan;
}

// 跳转到指定步骤
function goToStep(step) {
    // 隐藏所有步骤
    document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
    // 显示目标步骤
    document.getElementById(`step${step}`).classList.remove('hidden');
}

// 生成视频
function generateVideo() {
    const btn = document.getElementById('generateBtn');
    const result = document.getElementById('videoResult');
    
    btn.textContent = '生成中...';
    btn.disabled = true;

    // 模拟视频生成过程
    setTimeout(() => {
        result.innerHTML = `
            <div style="text-align:center;">
                <p style="font-size:1.2rem;color:#333;">🎉 视频生成成功！</p>
                <p style="color:#666;margin-top:10px;">店铺：${state.shopName || '未填写'}</p>
                <button class="btn-primary" style="margin-top:20px;" onclick="downloadVideo()">下载视频</button>
            </div>
        `;
        btn.textContent = '生成视频';
        btn.disabled = false;
    }, 2000);
}

// 下载视频（占位，后续实现真正下载）
function downloadVideo() {
    alert('视频下载功能即将实现！\n\n目前你需要先体验完整流程。');
    console.log('当前状态：', state);
}
