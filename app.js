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
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.template = parseInt(card.dataset.template);
            updatePreview();
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
        uploadArea.style.background = '#f0f3ff';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = 'white';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = 'white';
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

// 处理上传的文件
function handleFiles(files) {
    const preview = document.getElementById('videoPreview');
    preview.innerHTML = '<p style="color:#666;">图片加载中...</p>';
    
    state.images = [];
    let loadedCount = 0;
    
    Array.from(files).slice(0, 5).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                state.images.push(e.target.result);
                loadedCount++;
                
                if (loadedCount === Math.min(files.length, 5)) {
                    renderPreview();
                }
            };
            reader.readAsDataURL(file);
        }
    });
    
    if (state.images.length === 0 && files.length > 0) {
        preview.innerHTML = '<p style="color:#f56c6c;">请上传图片文件（jpg、png、gif等）</p>';
    }
}

// 渲染预览效果
function renderPreview() {
    const preview = document.getElementById('videoPreview');
    preview.innerHTML = '';
    
    if (state.images.length === 0) {
        preview.innerHTML = '<p>请先上传图片</p>';
        return;
    }
    
    // 创建图片展示
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;justify-content:center;';
    
    state.images.forEach((imgData, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.style.cssText = 'position:relative;';
        
        const img = document.createElement('img');
        img.src = imgData;
        img.style.cssText = 'width:80px;height:80px;object-fit:cover;border-radius:8px;border:2px solid #ddd;';
        
        imgWrapper.appendChild(img);
        imgContainer.appendChild(imgWrapper);
    });
    
    preview.appendChild(imgContainer);
    
    // 显示文字信息
    if (state.shopName || state.slogan) {
        const textDiv = document.createElement('div');
        textDiv.style.cssText = 'margin-top:15px;text-align:center;';
        textDiv.innerHTML = `
            <div style="font-size:1.2rem;font-weight:bold;color:#333;">${state.shopName || '店铺名称'}</div>
            <div style="font-size:0.9rem;color:#666;margin-top:5px;">${state.slogan || '品牌口号'}</div>
        `;
        preview.appendChild(textDiv);
    }
}

// 更新预览
function updatePreview() {
    state.shopName = document.getElementById('shopName').value;
    state.slogan = document.getElementById('slogan').value;
    
    if (state.images.length > 0) {
        renderPreview();
    }
}

// 跳转到指定步骤
function goToStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
    document.getElementById('step' + step).classList.remove('hidden');
    
    if (step === 2 && state.images.length > 0) {
        renderPreview();
    }
}

// 生成视频
function generateVideo() {
    const btn = document.getElementById('generateBtn');
    const result = document.getElementById('videoResult');
    
    if (state.images.length === 0) {
        alert('请先上传至少一张图片！');
        goToStep(2);
        return;
    }
    
    btn.textContent = '生成中...';
    btn.disabled = true;
    result.innerHTML = '<p style="color:#666;">正在生成视频，请稍候...</p>';
    
    // 模拟视频生成过程
    setTimeout(() => {
        result.innerHTML = `
            <div style="text-align:center;padding:20px;">
                <div style="font-size:4rem;">🎉</div>
                <p style="font-size:1.2rem;color:#333;margin-top:15px;">视频生成成功！</p>
                <p style="color:#666;margin-top:10px;">
                    模板：${['经典展示', '产品特写', '活动宣传'][state.template - 1]}<br>
                    店铺：${state.shopName || '未填写'}<br>
                    图片：${state.images.length} 张
                </p>
                <button class="btn-primary" style="margin-top:20px;" onclick="alert('下载功能即将上线！')">下载视频</button>
            </div>
        `;
        btn.textContent = '生成视频';
        btn.disabled = false;
    }, 3000);
}
