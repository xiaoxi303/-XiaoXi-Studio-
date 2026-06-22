// functions/toolkit.js - Serverless function serving the /toolkit page
export async function onRequest(context) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>XiaoXi Studio - 专业工具箱</title>
    <meta name="description" content="XiaoXi Studio 的专业工具箱：After Effects、Cinema 4D、Midjourney、可灵等前沿行业工具与 AI 创意流水线全览。">
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
        @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 60s linear infinite;
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
                <a id="nav-link-toolkit" class="bg-gray-100 text-gray-900 px-3.5 py-1.5 rounded-full font-semibold text-sm transition-all" href="/toolkit">技能</a>
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
                <a class="flex flex-col items-center text-gray-900" href="/toolkit">
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
    <main class="w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 pt-[140px] md:pt-[180px] flex flex-col items-center text-center gap-16 relative">
        
        <!-- Decorative Dashed Spinning Circle with Glow in the absolute center background -->
        <div class="absolute inset-0 z-[-1] flex items-center justify-center opacity-[0.18] pointer-events-none overflow-hidden">
            <div class="w-[320px] h-[320px] sm:w-[540px] sm:h-[540px] md:w-[820px] md:h-[820px] rounded-full border-[1.5px] border-charcoal-900 border-dashed animate-[spin_60s_linear_infinite] shadow-[0_0_80px_rgba(0,0,0,0.01)_inset] relative">
                <!-- Inner concentric circles -->
                <div class="absolute inset-12 rounded-full border border-charcoal-900/50 border-dotted"></div>
                <div class="absolute inset-28 rounded-full border border-charcoal-900/20"></div>
            </div>
        </div>
        
        <div class="flex flex-col gap-6 max-w-2xl mt-12 md:mt-20">
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-950">
                The Toolkit
            </h1>
            <p class="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                A carefully curated stack of industry-standard software and cutting-edge generative AI tools powering our visual pipelines.
            </p>
            
            <!-- Skills / Tag Cloud pills — hydrated by getSiteConfigs('toolkit') -->
            <div id="skills-container" class="flex flex-wrap justify-center gap-4 mt-8 max-w-4xl mx-auto">
                <!-- Static fallback pills (replaced by hydration if toolkit_skills_json is available) -->
                <span class="bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-xs font-bold text-gray-800 border border-gray-200/80 shadow-sm hover:border-gray-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 select-none cursor-default flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-gray-500">blur_on</span>After Effects
                </span>
                <span class="bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-xs font-bold text-gray-800 border border-gray-200/80 shadow-sm hover:border-gray-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 select-none cursor-default flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-gray-500">movie</span>Premiere Pro
                </span>
                <span class="bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-xs font-bold text-gray-800 border border-gray-200/80 shadow-sm hover:border-gray-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 select-none cursor-default flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-gray-500">deployed_code</span>Cinema 4D
                </span>
                <span class="bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-xs font-bold text-gray-800 border border-gray-200/80 shadow-sm hover:border-gray-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 select-none cursor-default flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-gray-500">palette</span>Midjourney
                </span>
                <span class="bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-xs font-bold text-gray-800 border border-gray-200/80 shadow-sm hover:border-gray-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 select-none cursor-default flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-gray-500">auto_awesome</span>Stable Diffusion
                </span>
                <span class="bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-xs font-bold text-gray-800 border border-gray-200/80 shadow-sm hover:border-gray-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 select-none cursor-default flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-gray-500">draw</span>Figma
                </span>
                <span class="bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-xs font-bold text-gray-800 border border-gray-200/80 shadow-sm hover:border-gray-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 select-none cursor-default flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-gray-500">brain</span>GPT-4
                </span>
                <span class="bg-white/80 backdrop-blur-md px-5 py-3 rounded-full text-xs font-bold text-gray-800 border border-gray-200/80 shadow-sm hover:border-gray-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 select-none cursor-default flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-gray-500">colors</span>DaVinci Resolve
                </span>
            </div>
        </div>

        <!-- Module C: Technology Stack Comparison -->
        <section class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-left">
            <!-- Traditional Stack Card -->
            <div class="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200/80 shadow-sm flex flex-col gap-6 hover:border-gray-300 hover:shadow-md transition-all duration-300">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-charcoal-900 shadow-inner">
                        <span class="material-symbols-outlined text-[20px]">architecture</span>
                    </div>
                    <div>
                        <h4 class="font-extrabold text-gray-950 text-base">传统核心技法</h4>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Traditional Foundation</p>
                    </div>
                </div>
                
                <p class="text-sm text-gray-600 leading-relaxed font-light">
                    立足于经典的运动规律与视觉体系。基于 After Effects 及其表达式（Expressions）生态进行像素级关键帧雕琢，精细调控 Speed Graph 缓动节奏。配合 Premiere 剪辑逻辑与 DaVinci 色彩科学调色，确保每一帧画面在物理合成、光影质感与视听卡点上均达到工业级标准。
                </p>
                
                <ul class="flex flex-col gap-2.5 mt-auto pt-4 border-t border-gray-100 text-xs text-gray-500">
                    <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                        <span>AE 运动缓动控制与表达式参数优化</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                        <span>三维粒子物理场仿真（Particular/Stardust）</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                        <span>达芬奇色彩分级（Color Grading）与镜头匹配</span>
                    </li>
                </ul>
            </div>

            <!-- GenAI Stack Card -->
            <div class="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200/80 shadow-sm flex flex-col gap-6 hover:border-gray-300 hover:shadow-md transition-all duration-300">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-charcoal-900 shadow-inner">
                        <span class="material-symbols-outlined text-[20px]">psychology</span>
                    </div>
                    <div>
                        <h4 class="font-extrabold text-gray-950 text-base">AI 智能催化</h4>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">GenAI Synergy</p>
                    </div>
                </div>
                
                <p class="text-sm text-gray-600 leading-relaxed font-light">
                    前瞻性拥抱生成式 AI 工具链。利用 Midjourney/Stable Diffusion 快速产出极具想象力的高概念分镜概念，利用即梦、可灵等高维时序视频模型进行动态生成与镜头拓展。打破传统软件开发周期限制，以 10 倍效率在前期提案与资产生成阶段赋予视觉设计无限宽广的视界。
                </p>
                
                <ul class="flex flex-col gap-2.5 mt-auto pt-4 border-t border-gray-100 text-xs text-gray-500">
                    <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                        <span>Midjourney 高精度多场景概念设计渲染</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                        <span>即梦/可灵等高维动态镜头生成与扩展</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                        <span>大语言模型赋能动效脚本与交互逻辑梳理</span>
                    </li>
                </ul>
            </div>
        </section>
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

        window.addEventListener('DOMContentLoaded', async () => {
            await initNavDropdown();
            await loadConfig();
            await hydrateSkills();
        });

        async function loadConfig() {
            try {
                const configData = await dataService.getConfig();
                const downloadCvBtn = document.getElementById('download-cv-btn');
                if (downloadCvBtn && configData.DOWNLOAD_CV_URL) {
                    downloadCvBtn.href = configData.DOWNLOAD_CV_URL;
                }
            } catch (err) {
                console.error("Failed to load config:", err);
            }
        }

        async function hydrateSkills() {
            try {
                const configs = await dataService.getSiteConfigs('toolkit');
                const skillsContainer = document.getElementById('skills-container');
                if (skillsContainer && configs.toolkit_skills_json) {
                    const skills = JSON.parse(configs.toolkit_skills_json);
                    if (Array.isArray(skills) && skills.length > 0) {
                        skillsContainer.innerHTML = skills.map(s => \`
                            <div class="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200/80 shadow-sm rounded-full px-5 py-3 hover:border-gray-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 cursor-default group select-none">
                                <span class="material-symbols-outlined text-[15px] text-gray-500 group-hover:text-gray-800 transition-colors">\${s.icon || 'stars'}</span>
                                <span class="text-xs font-bold text-gray-800">\${s.name}</span>
                            </div>
                        \`).join('');
                    }
                }
            } catch(err) {
                console.warn('[toolkit] hydration error:', err);
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
