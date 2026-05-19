// 全局状态
let state = {
    template: 1,
    templateName: '经典展示',
    templateStyle: 'classic',
    images: [],
    shopName: '',
    slogan: '',
    textColor: '#ffffff',
    blurLevel: 5,
    fontSize: 20
};

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    initTemplateSelection();
    initUpload();
    initCustomize();
});

// 初始化模板选择
function initTemplateSelection() {
    const cards = document.querySelectorAll('.template-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.template = parseInt(card.dataset.template);
            state.templateName = card.dataset.name;
            state.templateStyle = card.dataset.style;
            updateTemplatePreview();
        });
    });
}

// 初始化自定义选项
function initCustomize() {
    const textColorInput = document.getElementById('textColor');
    const blurInput = document.getElementById('blurLevel');
    const fontSizeInput = document.getElementById('fontSize');
    
    textColorInput.addEventListener('input', (e) => {
        state.textColor = e.target.value;
        updateLivePreview();
    });
    
    blurInput.addEventListener('input', (e) => {
        state.blurLevel = parseInt(e.target.value);
        document.getElementById('blurValue').textContent = e.target.value;
        updateLivePreview();
    });
    
    fontSizeInput.addEventListener('input', (e) => {
        state.fontSize = parseInt(e.target.value);
        document.getElementById('fontSizeValue').textContent = e.target.value;
        updateLivePreview();
    });
}

// 更新模板预览
function updateTemplatePreview() {
    // 为不同模板设置不同的背景
    const preview = document.querySelector(`.template-card[data-template="${state.template}"] .preview-box`);
    if (preview) {
        // 重置样式
        preview.style.background = '';
        
        switch(state.templateStyle) {
            case 'classic':
                preview.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                break;
            case 'product':
                preview.style.background = 'linear-gradient(135deg, #ff9a9e, #fecfef)';
                break;
            case 'sale':
                preview.style.background = 'linear-gradient(135deg, #ff6b6b, #ffa500)';
                break;
            case 'elegant':
                preview.style.background = 'linear-gradient(135deg, #a8edea, #fed6e3)';
                break;
            case 'trendy':
                preview.style.background = 'linear-gradient(135deg, #f093fb, #f5576c)';
                break;
            case 'discount':
                preview.style.background = 'linear-gradient(135deg, #434343, #000000)';
                break;
        }
    }
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
    state.images = [];
    
    Array.from(files).slice(0, 5).forEach((file) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                state.images.push(e.target.result);
                updateLivePreview();
            };
            reader.readAsDataURL(file);
        }
    });
}

// 更新实时预览
function updateLivePreview() {
    const liveBg = document.querySelector('.live-bg');
    const liveTitle = document.getElementById('liveTitle');
    const liveSlogan = document.getElementById('liveSlogan');
    const liveImages = document.getElementById('liveImages');
    
    // 更新背景样式
    liveBg.style.filter = `blur(${state.blurLevel}px)`;
    
    // 根据模板设置背景
    switch(state.templateStyle) {
        case 'classic':
            liveBg.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            break;
        case 'product':
            liveBg.style.background = 'linear-gradient(135deg, #ff9a9e, #fecfef)';
            break;
        case 'sale':
            liveBg.style.background = 'linear-gradient(135deg, #ff6b6b, #ffa500)';
            break;
        case 'elegant':
            liveBg.style.background = 'linear-gradient(135deg, #a8edea, #fed6e3)';
            break;
        case 'trendy':
            liveBg.style.background = 'linear-gradient(135deg, #f093fb, #f5576c)';
            break;
        case 'discount':
            liveBg.style.background = 'linear-gradient(135deg, #434343, #000000)';
            break;
        default:
            liveBg.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    // 更新文字
    state.shopName = document.getElementById('shopName')?.value || '';
    state.slogan = document.getElementById('slogan')?.value || '';
    
    liveTitle.textContent = state.shopName || '店铺名称';
    liveTitle.style.color = state.textColor;
    liveTitle.style.fontSize = `${state.fontSize}px`;
    
    liveSlogan.textContent = state.slogan || '品牌口号';
    liveSlogan.style.color = state.textColor;
    liveSlogan.style.fontSize = `${state.fontSize * 0.6}px`;
    
    // 更新图片预览
    liveImages.innerHTML = state.images.map(img => 
        `<img src="${img}" alt="预览图片">`
    ).join('');
}

// 跳转到指定步骤
function goToStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
    document.getElementById('step' + step).classList.remove('hidden');
    
    if (step === 2) {
        updateLivePreview();
    }
    
    if (step === 3) {
        updateFinalPreview();
    }
}

// 更新最终预览
function updateFinalPreview() {
    const finalBg = document.querySelector('#videoResult .live-bg');
    const finalTitle = document.getElementById('finalTitle');
    const finalSlogan = document.getElementById('finalSlogan');
    const finalImages = document.getElementById('finalImages');
    
    // 应用模板样式
    switch(state.templateStyle) {
        case 'classic':
            finalBg.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            break;
        case 'product':
            finalBg.style.background = 'linear-gradient(135deg, #ff9a9e, #fecfef)';
            break;
        case 'sale':
            finalBg.style.background = 'linear-gradient(135deg, #ff6b6b, #ffa500)';
            break;
        case 'elegant':
            finalBg.style.background = 'linear-gradient(135deg, #a8edea, #fed6e3)';
            break;
        case 'trendy':
            finalBg.style.background = 'linear-gradient(135deg, #f093fb, #f5576c)';
            break;
        case 'discount':
            finalBg.style.background = 'linear-gradient(135deg, #434343, #000000)';
            break;
    }
    
    finalBg.style.filter = `blur(${state.blurLevel}px)`;
    finalTitle.textContent = state.shopName || '店铺名称';
    finalTitle.style.color = state.textColor;
    finalTitle.style.fontSize = `${state.fontSize}px`;
    finalSlogan.textContent = state.slogan || '品牌口号';
    finalSlogan.style.color = state.textColor;
    finalSlogan.style.fontSize = `${state.fontSize * 0.6}px`;
    
    finalImages.innerHTML = state.images.map(img => 
        `<img src="${img}" alt="预览图片">`
    ).join('');
    
    // 更新汇总信息
    document.getElementById('summaryTemplate').textContent = state.templateName;
    document.getElementById('summaryImages').textContent = state.images.length;
}

// 生成视频
function generateVideo() {
    const btn = document.getElementById('generateBtn');
    
    if (state.images.length === 0) {
        alert('请先上传至少一张图片！');
        goToStep(2);
        return;
    }
    
    btn.textContent = '生成中...';
    btn.disabled = true;
    
    // 模拟视频生成
    setTimeout(() => {
        btn.textContent = '生成完成！';
        btn.style.background = '#52c41a';
        
        setTimeout(() => {
            alert('🎉 视频生成成功！\n\n当前为演示版本，完整视频生成功能正在开发中。\n\n你可以：\n1. 截图保存预览效果\n2. 等待后续功能上线');
            
            btn.textContent = '生成视频';
            btn.disabled = false;
            btn.style.background = '';
        }, 500);
    }, 3000);
}
