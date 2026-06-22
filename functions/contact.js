// functions/contact.js - Serverless function serving the /contact page
export async function onRequest(context) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>XiaoXi Studio - 联系合作</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <script id="tailwind-config">
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                cream: {
                  50: '#FDFBF7',
                  100: '#F7F4EB',
                  200: '#ECE6D2',
                },
                charcoal: {
                  950: '#0B0F19',
                  900: '#111827',
                  800: '#1F2937',
                  700: '#374151',
                  600: '#4B5563',
                }
              },
              borderRadius: {
                'large-card': '2rem',
              },
              fontFamily: {
                sans: ["Outfit", "Noto Sans SC", "sans-serif"],
              }
            },
          },
        }
    </script>
    <style>
        body {
            background-color: #FDFBF7;
            color: #111827;
        }
        .bg-grid {
            background-size: 40px 40px;
            background-image: 
                linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px);
        }
        .text-gradient {
            background: linear-gradient(135deg, #111827 30%, #6b7280 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    </style>
</head>
<body class="font-sans antialiased min-h-screen relative overflow-x-hidden bg-grid">

    <!-- Blurred Ambient Light Spheres -->
    <div class="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-40">
        <div class="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#fcecd7] filter blur-[128px] mix-blend-multiply opacity-60"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#e8eefc] filter blur-[128px] mix-blend-multiply opacity-55"></div>
    </div>

    <!-- 3-Section Floating Capsule Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-8 py-4 pointer-events-none">
        <div class="pointer-events-auto bg-white/70 backdrop-blur-xl border border-gray-200/80 shadow-sm rounded-full w-full max-w-7xl flex items-center justify-between px-6 md:px-8 py-3.5 mt-2 md:mt-4 transition-all duration-300">
            
            <!-- Left Section: Brand -->
            <a href="/" class="font-bold text-lg md:text-xl text-gray-950 tracking-tighter hover:opacity-80 transition-opacity">
                XiaoXi Studio
            </a>
            
            <!-- Middle Section: Menu & Dropdown -->
            <div class="hidden md:flex items-center space-x-1 lg:space-x-2">
                <a id="nav-link-home" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all" href="/">首页</a>
                
                <!-- Works Group with Dropdown -->
                <div class="relative group py-1.5">
                    <button class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-0.5 text-sm">
                        <span>作品</span>
                        <span class="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:rotate-180">keyboard_arrow_down</span>
                    </button>
                    <!-- Dropdown Container -->
                    <div class="absolute left-1/2 -translate-x-1/2 top-full pt-1 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div id="nav-dropdown-container" class="rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-xl p-2 flex flex-col gap-0.5"></div>
                    </div>
                </div>
                
                <a id="nav-link-about" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all" href="/about">关于</a>
                <a id="nav-link-toolkit" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all" href="/toolkit">技能</a>
                <a id="nav-link-contact" class="bg-gray-100 text-gray-900 px-3.5 py-1.5 rounded-full font-semibold text-sm transition-all" href="/contact">联系</a>
            </div>
            
            <!-- Right Section: Action buttons -->
            <div class="flex items-center gap-3">
                <button id="lang-btn" class="hidden md:flex items-center gap-1.5 text-gray-500 hover:text-gray-950 transition-colors text-xs font-semibold px-2 py-1">
                    <span class="material-symbols-outlined text-[16px]">language</span>
                    <span>English</span>
                </button>
                <a id="download-cv-btn" href="#" target="_blank" class="bg-black text-white hover:bg-gray-800 px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all scale-100 active:scale-95 shadow-sm">
                    <span>下载简历</span>
                    <span class="material-symbols-outlined text-[15px]">download</span>
                </a>
            </div>
        </div>
        
        <!-- Mobile Bottom Nav Capsule -->
        <div class="fixed bottom-6 left-0 right-0 z-50 flex md:hidden justify-center w-full px-5 pointer-events-none">
            <div class="pointer-events-auto bg-white/90 backdrop-blur-xl border border-gray-200 shadow-lg rounded-full w-full max-w-sm flex items-center justify-around py-3 px-4">
                <a class="flex flex-col items-center text-gray-500" href="/">
                    <span class="material-symbols-outlined text-[22px]">home</span>
                    <span class="text-[9px] mt-0.5 font-medium">首页</span>
                </a>
                <a class="flex flex-col items-center text-gray-500" href="/#portfolio">
                    <span class="material-symbols-outlined text-[22px]">grid_view</span>
                    <span class="text-[9px] mt-0.5 font-medium">作品</span>
                </a>
                <a class="flex flex-col items-center text-gray-500" href="/about">
                    <span class="material-symbols-outlined text-[22px]">person</span>
                    <span class="text-[9px] mt-0.5 font-medium">关于</span>
                </a>
                <a class="flex flex-col items-center text-gray-500" href="/toolkit">
                    <span class="material-symbols-outlined text-[22px]">build</span>
                    <span class="text-[9px] mt-0.5 font-medium">技能</span>
                </a>
                <a class="flex flex-col items-center text-gray-900" href="/contact">
                    <span class="material-symbols-outlined text-[22px]">mail</span>
                    <span class="text-[9px] mt-0.5 font-medium">联系</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- Main Content Container -->
    <main class="w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 pt-[140px] md:pt-[200px] flex flex-col items-center text-center gap-12">
        
        <h1 class="text-4xl sm:text-6xl md:text-[72px] font-extrabold tracking-tighter text-gray-950 max-w-4xl leading-[1.1] mt-8 md:mt-16">
            一起做一个更会动的<span class="text-gradient">想法。</span>
        </h1>
        <p class="text-gray-500 max-w-xl text-sm md:text-base leading-relaxed">
            承接各类动态视觉、AI创意广告及多媒体合作。期待与您打造非凡之作。
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <!-- Email Copy Pill (Highlight Black) -->
            <button id="email-copy-btn" class="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 w-60 justify-center">
                <span class="material-symbols-outlined text-[18px]">mail</span>
                <span id="email-btn-text">复制合作邮箱</span>
            </button>
            
            <!-- WeChat Copy Pill (White border) -->
            <button id="wechat-copy-btn" class="px-8 py-4 rounded-full text-sm font-semibold tracking-wide border border-gray-300 text-gray-950 hover:border-black hover:bg-white/60 bg-white/40 backdrop-blur-sm shadow-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 w-60 justify-center">
                <span class="material-symbols-outlined text-[18px]">chat</span>
                <span id="wechat-btn-text">微信: XiaoXi_Design</span>
            </button>
        </div>

        <!-- Module C: Enriched Cooperative Request Form -->
        <div class="w-full max-w-lg bg-white/60 backdrop-blur-md border border-gray-200/80 p-8 rounded-[2rem] shadow-sm flex flex-col gap-6 text-left mt-8 relative">
            <h3 class="text-xl font-extrabold text-gray-950 tracking-tight flex items-center gap-2">
                <span class="material-symbols-outlined text-[22px]">edit_note</span>
                <span>提交合作意向</span>
            </h3>
            
            <form id="coop-form" class="flex flex-col gap-5">
                <!-- Name -->
                <div class="flex flex-col gap-1.5">
                    <label for="coop-name" class="text-xs font-bold text-gray-700 tracking-wider">您的姓名 / 称呼</label>
                    <input type="text" id="coop-name" required placeholder="例如：张先生 / 某品牌负责人" class="w-full px-4 py-3 rounded-2xl border border-gray-250 bg-white/80 focus:border-black focus:ring-0 text-sm placeholder:text-gray-400/80 transition-colors" />
                </div>
                
                <!-- Collaboration Type Checkbox pills -->
                <div class="flex flex-col gap-2">
                    <label class="text-xs font-bold text-gray-700 tracking-wider">合作类型 (可多选)</label>
                    <div class="flex flex-wrap gap-2.5 mt-1">
                        <!-- Pill 1 -->
                        <button type="button" data-value="求职机会" class="coop-type-pill px-4 py-2 rounded-full text-xs font-semibold border border-gray-200 bg-white/40 text-gray-600 hover:border-gray-400 select-none transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px] hidden">check</span>
                            <span>求职机会</span>
                        </button>
                        <!-- Pill 2 -->
                        <button type="button" data-value="项目合作" class="coop-type-pill px-4 py-2 rounded-full text-xs font-semibold border border-gray-200 bg-white/40 text-gray-600 hover:border-gray-400 select-none transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px] hidden">check</span>
                            <span>项目合作</span>
                        </button>
                        <!-- Pill 3 -->
                        <button type="button" data-value="交流学习" class="coop-type-pill px-4 py-2 rounded-full text-xs font-semibold border border-gray-200 bg-white/40 text-gray-600 hover:border-gray-400 select-none transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px] hidden">check</span>
                            <span>交流学习</span>
                        </button>
                    </div>
                </div>
                
                <!-- Message -->
                <div class="flex flex-col gap-1.5">
                    <label for="coop-message" class="text-xs font-bold text-gray-700 tracking-wider">需求留言 / 合作详情</label>
                    <textarea id="coop-message" rows="4" required placeholder="请简单描述您的想法或项目需求..." class="w-full px-4 py-3 rounded-2xl border border-gray-250 bg-white/80 focus:border-black focus:ring-0 text-sm placeholder:text-gray-400/80 transition-colors resize-none"></textarea>
                </div>
                
                <!-- Submit -->
                <button type="submit" id="coop-submit-btn" class="w-full bg-black text-white hover:bg-gray-800 py-3.5 rounded-2xl text-xs font-bold tracking-wider hover:-translate-y-0.5 transition-all duration-200 active:scale-95 mt-2 flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-[16px]">send</span>
                    <span>提交合作意向</span>
                </button>
            </form>
            
            <!-- Beautiful Glassmorphism Popup Inside Form Container (Hidden by default) -->
            <div id="coop-success-modal" class="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center text-center p-8 opacity-0 pointer-events-none transition-opacity duration-300 z-10">
                <div class="w-14 h-14 rounded-full bg-green-50 border border-green-100 text-green-600 flex items-center justify-center shadow-inner mb-4 animate-bounce">
                    <span class="material-symbols-outlined text-[32px]">check</span>
                </div>
                <h4 class="text-lg font-bold text-gray-950">提交成功！</h4>
                <p class="text-xs text-gray-500 max-w-[240px] leading-relaxed mt-2">
                    非常感谢您的信任，我会尽快阅读您的留言并与您取得联系。
                </p>
                <button type="button" id="close-success-btn" class="mt-6 px-6 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors active:scale-95">
                    好的
                </button>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="w-full py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-[#FDFBF7] border-t border-gray-200/80 mt-auto">
        <div class="font-extrabold text-xl text-gray-950 tracking-tighter">XiaoXi Studio</div>
        <p class="text-xs text-gray-500 text-center md:text-left max-w-md leading-relaxed">
            © 2024 XiaoXi Studio. 以理性的精确与感性的灵魂，雕琢每一帧数字化体验。
        </p>
        <div class="flex gap-6">
            <a href="/privacy" class="font-label-sm text-label-sm text-gray-500 hover:text-gray-900 transition-colors">隐私政策</a>
            <a href="/terms" class="font-label-sm text-label-sm text-gray-500 hover:text-gray-900 transition-colors">服务条款</a>
        </div>
    </footer>

    <!-- Script Layer Logic -->
    <script type="module">
        import { dataService } from '/dataService.js';

        let configData = {};
        let siteConfigs = {};

        window.addEventListener('DOMContentLoaded', async () => {
            await initNavDropdown();
            await loadConfig();
            await loadSiteConfigs();
            setupInteractiveEvents();
        });

        async function loadConfig() {
            try {
                configData = await dataService.getConfig();
                const downloadCvBtn = document.getElementById('download-cv-btn');
                if (downloadCvBtn && configData.DOWNLOAD_CV_URL) {
                    downloadCvBtn.href = configData.DOWNLOAD_CV_URL;
                }
            } catch (err) {
                console.warn("Failed to load legacy config:", err);
            }
        }

        async function loadSiteConfigs() {
            try {
                siteConfigs = await dataService.getSiteConfigs('contact');
                
                const wechatBtnText = document.getElementById('wechat-btn-text');
                if (wechatBtnText) {
                    const wechatId = siteConfigs.contact_studio_wechat || configData.WECHAT_ID || "XiaoXi_Design";
                    wechatBtnText.textContent = \`微信: \${wechatId}\`;
                }

                const emailBtnText = document.getElementById('email-btn-text');
                if (emailBtnText) {
                    const email = siteConfigs.contact_studio_email || configData.EMAIL || "hello@xiaoxistudio.com";
                    emailBtnText.textContent = email;
                }
            } catch (err) {
                console.warn("Failed to load site configs:", err);
            }
        }

        async function initNavDropdown() {
            const dropdownContainer = document.getElementById('nav-dropdown-container');
            try {
                const categories = await dataService.getCategories();
                if (dropdownContainer) {
                    if (categories.length === 0) {
                        dropdownContainer.innerHTML = '<span class="text-xs text-gray-400 p-2">暂无分类</span>';
                    } else {
                        dropdownContainer.innerHTML = categories.map(cat => 
                            \`<a href="/?filter=\${cat.slug}#portfolio" class="dropdown-filter-btn px-3 py-2 rounded-xl hover:bg-gray-50 text-left text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors flex items-center justify-between" data-filter="\${cat.slug}">
                                <span>\${cat.name}</span>
                                \${cat.badge ? \`<span class="bg-gray-100 text-gray-500 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide border border-gray-150">\${cat.badge}</span>\` : ''}
                            </a>\`
                        ).join('');
                    }
                }
            } catch (err) {
                console.error("Failed to load nav categories:", err);
            }
        }

        function setupInteractiveEvents() {
            const emailBtn = document.getElementById('email-copy-btn');
            const emailText = document.getElementById('email-btn-text');
            const wechatBtn = document.getElementById('wechat-copy-btn');
            const wechatText = document.getElementById('wechat-btn-text');

            emailBtn.addEventListener('click', async () => {
                const emailAddress = siteConfigs.contact_studio_email || configData.EMAIL || "hello@xiaoxistudio.com";
                try {
                    await navigator.clipboard.writeText(emailAddress);
                    emailText.textContent = "已成功复制到剪贴板！";
                    emailBtn.classList.remove('bg-black', 'hover:bg-gray-800');
                    emailBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                    setTimeout(() => {
                        emailText.textContent = emailAddress;
                        emailBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                        emailBtn.classList.add('bg-black', 'hover:bg-gray-800');
                    }, 2500);
                } catch (e) {
                    window.location.href = \`mailto:\${emailAddress}\`;
                }
            });

            wechatBtn.addEventListener('click', async () => {
                const wechatId = siteConfigs.contact_studio_wechat || configData.WECHAT_ID || "XiaoXi_Design";
                try {
                    await navigator.clipboard.writeText(wechatId);
                    wechatText.textContent = "已成功复制到剪贴板！";
                    wechatBtn.classList.remove('text-gray-950', 'border-gray-300');
                    wechatBtn.classList.add('text-green-600', 'border-green-600');
                    setTimeout(() => {
                        wechatText.textContent = \`微信: \${wechatId}\`;
                        wechatBtn.classList.remove('text-green-600', 'border-green-600');
                        wechatBtn.classList.add('text-gray-950', 'border-gray-300');
                    }, 2500);
                } catch (e) {
                    alert(\`WeChat ID: \${wechatId}\`);
                }
            });

            // Cooperative Request Form logic
            const coopForm = document.getElementById('coop-form');
            const pills = document.querySelectorAll('.coop-type-pill');
            const successModal = document.getElementById('coop-success-modal');
            const closeSuccessBtn = document.getElementById('close-success-btn');
            const selectedTypes = new Set();

            pills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const value = pill.getAttribute('data-value');
                    const checkIcon = pill.querySelector('.material-symbols-outlined');
                    if (selectedTypes.has(value)) {
                        selectedTypes.delete(value);
                        pill.classList.remove('border-black', 'bg-black', 'text-white');
                        pill.classList.add('border-gray-200', 'bg-white/40', 'text-gray-600');
                        if (checkIcon) checkIcon.classList.add('hidden');
                    } else {
                        selectedTypes.add(value);
                        pill.classList.add('border-black', 'bg-black', 'text-white');
                        pill.classList.remove('border-gray-200', 'bg-white/40', 'text-gray-600');
                        if (checkIcon) checkIcon.classList.remove('hidden');
                    }
                });
            });

            if (coopForm) {
                coopForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    // Intercept and simulate success
                    successModal.classList.remove('opacity-0', 'pointer-events-none');
                    successModal.classList.add('opacity-100', 'pointer-events-auto');
                });
            }

            if (closeSuccessBtn) {
                closeSuccessBtn.addEventListener('click', () => {
                    successModal.classList.remove('opacity-100', 'pointer-events-auto');
                    successModal.classList.add('opacity-0', 'pointer-events-none');
                    if (coopForm) coopForm.reset();
                    selectedTypes.clear();
                    pills.forEach(pill => {
                        pill.classList.remove('border-black', 'bg-black', 'text-white');
                        pill.classList.add('border-gray-200', 'bg-white/40', 'text-gray-600');
                        const checkIcon = pill.querySelector('.material-symbols-outlined');
                        if (checkIcon) checkIcon.classList.add('hidden');
                    });
                });
            }
        }
    </script>
</body>
</html>`;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        }
    });
}
