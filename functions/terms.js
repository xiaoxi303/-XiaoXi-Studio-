// functions/terms.js - Serverless function serving the /terms page
export async function onRequest(context) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>XiaoXi Studio - 服务条款</title>
    <meta name="description" content="XiaoXi Studio 服务条款：知识产权声明、商业委托规范与 AI 辅助创作边界说明。">
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked@9/marked.min.js"></script>
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
                linear-gradient(to right, rgba(0,0,0,0.015) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.015) 1px, transparent 1px);
        }
        .text-gradient {
            background: linear-gradient(135deg, #111827 30%, #6b7280 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        /* Prose styling for dynamic markdown content */
        #terms-content-area h1,
        #terms-content-area h2,
        #terms-content-area h3 {
            font-weight: 700;
            color: #111827;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            line-height: 1.3;
        }
        #terms-content-area h1 { font-size: 1.5rem; }
        #terms-content-area h2 { font-size: 1.2rem; }
        #terms-content-area h3 { font-size: 1rem; }
        #terms-content-area p {
            font-size: 0.875rem;
            color: #4b5563;
            line-height: 1.75;
            margin-bottom: 1rem;
        }
        #terms-content-area ul,
        #terms-content-area ol {
            padding-left: 1.5rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            color: #4b5563;
            line-height: 1.75;
        }
        #terms-content-area li { margin-bottom: 0.25rem; }
        #terms-content-area strong { color: #111827; font-weight: 600; }
        #terms-content-area a { color: #111827; text-decoration: underline; }
        #terms-content-area hr { border-color: #e5e7eb; margin: 1.5rem 0; }
        #terms-content-area blockquote {
            border-left: 3px solid #d1d5db;
            padding-left: 1rem;
            color: #6b7280;
            font-style: italic;
            margin: 1rem 0;
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
                <a id="nav-link-contact" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all" href="/contact">联系</a>
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
                <a class="flex flex-col items-center text-gray-500" href="/contact">
                    <span class="material-symbols-outlined text-[22px]">mail</span>
                    <span class="text-[9px] mt-0.5 font-medium">联系</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- Main Content Container -->
    <main class="w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 pt-[140px] md:pt-[200px] flex flex-col items-center text-center gap-12">
        
        <h1 class="text-4xl sm:text-6xl md:text-[72px] font-extrabold tracking-tighter text-gray-950 max-w-4xl leading-[1.1] mt-8 md:mt-16">
            服务条款<span class="text-gradient">。</span>
        </h1>
        <p class="text-gray-500 max-w-xl text-sm md:text-base leading-relaxed">
            欢迎来到 XiaoXi Studio。浏览本站、点击媒体流或提交表单，即代表您同意本工作室的版权与合作边界契约。
        </p>

        <!-- Dynamic Markdown content area (hydrated from legal_terms_content) -->
        <!-- Falls back to static bento grid below if no CMS content is available -->
        <div id="terms-content-area" class="w-full max-w-5xl text-left mt-2">

            <!-- Static fallback bento grid (shown when no CMS content is fetched) -->
            <div id="terms-static-grid" class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
                
                <!-- Box 01 -->
                <div class="bg-white border border-gray-200/80 rounded-large-card p-8 shadow-sm flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-950 text-[28px]">copyright</span>
                        <h3 class="text-lg font-bold text-gray-950">条款 01：知识产权与防盗链声明</h3>
                    </div>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        本作品集中公开展示的精选多媒体卡片（如 Cybernetic Echoes, Flow State Motion 等）其独立著作权均属于 XiaoXi Studio 或关联商业客户。严禁任何人未经书面许可，对本站 R2 存储桶中的真实视频/图片源文件进行恶意盗链、二次剪辑分发或作为生成式 AI 模型的未授权训练语料喂养。
                    </p>
                </div>

                <!-- Box 02 -->
                <div class="bg-white border border-gray-200/80 rounded-large-card p-8 shadow-sm flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-950 text-[28px]">handshake</span>
                        <h3 class="text-lg font-bold text-gray-950">条款 02：商业委托与要约效力</h3>
                    </div>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        本站所有页面中的合作意向表单、微信/邮箱联系胶囊仅用于建立初步沟通通道。任何实质性的自由职业求职、商务项目承接、影视动效制作，必须以双方签署的正式书面合同（符合合同法保护规定）为准。
                    </p>
                </div>

                <!-- Box 03 -->
                <div class="bg-white border border-gray-200/80 rounded-large-card p-8 shadow-sm flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-950 text-[28px]">smart_toy</span>
                        <h3 class="text-lg font-bold text-gray-950">条款 03：生成式 AI 辅助创作声明</h3>
                    </div>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        本工作室深度集成了生成式 AI（GenAI）混合工作流。对于作品集中明示的 AI 辅助内容，其底层素材的版权与生成边界严格遵循对应平台（如 OpenAI、Stable Diffusion、可灵）的商业服务条款执行。
                    </p>
                </div>

                <!-- Box 04 -->
                <div class="bg-white border border-gray-200/80 rounded-large-card p-8 shadow-sm flex flex-col gap-4">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-gray-950 text-[28px]">gavel</span>
                        <h3 class="text-lg font-bold text-gray-950">条款 04：服务终止与争议管辖</h3>
                    </div>
                    <p class="text-gray-500 text-sm leading-relaxed">
                        本工作室保留随时修改、下架、替换本站所陈列任何艺术或商业作品卡片的权利。本条款解释与争议处理均受本工作室所在地法律及仲裁规范管辖。
                    </p>
                </div>
                
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

        window.addEventListener('DOMContentLoaded', async () => {
            await initNavDropdown();
            await loadConfig();
            await hydratePage();
        });

        async function loadConfig() {
            try {
                configData = await dataService.getConfig();
                const downloadCvBtn = document.getElementById('download-cv-btn');
                if (downloadCvBtn && configData.DOWNLOAD_CV_URL) {
                    downloadCvBtn.href = configData.DOWNLOAD_CV_URL;
                }
            } catch (err) {
                console.error("Failed to load config:", err);
            }
        }

        async function hydratePage() {
            const contentArea = document.getElementById('terms-content-area');
            const staticGrid  = document.getElementById('terms-static-grid');
            try {
                const configs = await dataService.getSiteConfigs('legal');
                if (configs.legal_terms_content && contentArea) {
                    // Hide static fallback grid and replace with rendered markdown
                    if (staticGrid) staticGrid.remove();
                    if (window.marked) {
                        contentArea.innerHTML = marked.parse(configs.legal_terms_content);
                    } else {
                        contentArea.innerHTML = configs.legal_terms_content.replace(/\n/g, '<br>');
                    }
                }
            } catch(err) {
                console.warn('[terms] hydration error:', err);
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
    </script>
</body>
</html>`;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        }
    });
}
