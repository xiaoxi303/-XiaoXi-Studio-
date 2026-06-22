// functions/about.js - Serverless function serving the /about page
export async function onRequest(context) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>XiaoXi Studio - 关于我</title>
    <meta name="description" content="XiaoXi Studio 创始人简介、工作流程与成长足迹。影视专业出身，专注动态视觉与 AI 智能化创意工作流。">
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
        /* Timeline dynamic items prose styling */
        #about-timeline-container h3 {
            font-size: 0.95rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.25rem;
        }
        #about-timeline-container p {
            font-size: 0.75rem;
            color: #6b7280;
            line-height: 1.6;
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
                
                <a id="nav-link-about" class="bg-gray-100 text-gray-900 px-3.5 py-1.5 rounded-full font-semibold text-sm transition-all" href="/about">关于</a>
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
                <a class="flex flex-col items-center text-gray-900" href="/about">
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
    <main class="w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 pt-[140px] md:pt-[180px] flex flex-col gap-28">
        
        <!-- About Section Split Layout -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div class="flex flex-col gap-6 text-left">
                <h1 id="about-bio-name" class="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-950 leading-[1.15]">
                    影视专业出身，<br/>爱探索，也爱创新。
                </h1>
                <p id="about-bio-text" class="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                    我相信运动是数字体验的心跳。通过将传统的电影视听语言原则与现代的 <span class="text-gray-950 font-semibold underline decoration-gray-200 underline-offset-4">AI 智能化工作流</span>有机相结合，我致力于创造出不仅能被看见，而且能被深度感知的先锋视觉表现。
                </p>
                <p class="text-sm md:text-base text-gray-500 leading-relaxed">
                    在数字媒体日新月异的今天，动效不仅仅是点缀，更是品牌故事的核心载体。我始终从策略与美学的双重维度出发，拆解每一次的艺术诉求，无论是微交互的平滑过渡，还是商业级大片的高级合成，力求在精准与灵魂之间找到最完美的视觉落脚点。
                </p>
                <p class="text-sm md:text-base text-gray-500 leading-relaxed">
                    每一个项目都是一次对未知边界的探索之旅。从脑暴阶段的风格雏形，到资产建立与后期合成中的像素级微调，我崇尚将逻辑与感性相互融汇，为每一个创意注入独特的生命张力。
                </p>
            </div>
            
            <!-- Metric Summary Grid -->
            <div class="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] grid grid-cols-1 sm:grid-cols-2 gap-8 border border-gray-200/80 shadow-sm text-left">
                <div class="flex flex-col gap-1.5">
                    <span class="font-extrabold text-4xl text-gray-950 tracking-tight">30+</span>
                    <span class="text-[11px] font-bold text-gray-900 uppercase tracking-widest">项目类型</span>
                    <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">横跨品牌 TVC、海外跨境多媒体流、动态 UI、游戏特效等多样形态，积累了丰富的全品类交付经验。</p>
                </div>
                <div class="flex flex-col gap-1.5">
                    <span class="font-extrabold text-4xl text-gray-950 tracking-tight">AE</span>
                    <span class="text-[11px] font-bold text-gray-900 uppercase tracking-widest">核心方向</span>
                    <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">精通高级合成、流体动效、粒子合成与表达式调优，实现平滑自然的动画曲线与极致视觉韵律。</p>
                </div>
                <div class="flex flex-col gap-1.5 sm:col-span-2 border-t border-gray-100 pt-6">
                    <span class="font-extrabold text-4xl text-gray-950 tracking-tight">AI</span>
                    <span class="text-[11px] font-bold text-gray-900 uppercase tracking-widest">新工作流</span>
                    <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">全面接入文生视频、图生视频高阶模型（如即梦、可灵等），重塑美术资产设计，实现 10x 创意产出与视效突破。</p>
                </div>
            </div>
        </section>

        <!-- Workflow Modern Steps Grid -->
        <section class="flex flex-col gap-12">
            <h3 class="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tighter text-center">工作流程</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Step 1 -->
                <div class="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200/80 shadow-sm hover:border-gray-300 hover:shadow-md transition-all flex flex-col gap-5 text-left">
                    <div class="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-950 shadow-inner">
                        <span class="material-symbols-outlined text-[24px]">target</span>
                    </div>
                    <h4 id="about-workflow-01-title" class="text-lg font-bold text-gray-950">01 理解目标</h4>
                    <p id="about-workflow-01-desc" class="text-sm text-gray-600 leading-relaxed font-light">深度剖析品牌的内核与诉求。完成用户画像拆解与视觉风格设定，通过快速分镜脚本预演（Pre-visualization）锁定基调。</p>
                </div>
                <!-- Step 2 -->
                <div class="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200/80 shadow-sm hover:border-gray-300 hover:shadow-md transition-all flex flex-col gap-5 text-left">
                    <div class="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-950 shadow-inner">
                        <span class="material-symbols-outlined text-[24px]">waves</span>
                    </div>
                    <h4 id="about-workflow-02-title" class="text-lg font-bold text-gray-950">02 建立节奏</h4>
                    <p id="about-workflow-02-desc" class="text-sm text-gray-600 leading-relaxed font-light">打磨动态分镜和叙事节奏。精准把握剪辑点卡点、声画同步协调，通过缓动曲线（Graph Editor Optimization）赋予动作以生命力。</p>
                </div>
                <!-- Step 3 -->
                <div class="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200/80 shadow-sm hover:border-gray-300 hover:shadow-md transition-all flex flex-col gap-5 text-left">
                    <div class="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-950 shadow-inner">
                        <span class="material-symbols-outlined text-[24px]">memory</span>
                    </div>
                    <h4 id="about-workflow-03-title" class="text-lg font-bold text-gray-950">03 AI辅助扩展</h4>
                    <p id="about-workflow-03-desc" class="text-sm text-gray-600 leading-relaxed font-light">利用生成式模型快速产出高精度动态贴图、粒子概念设计。为 After Effects 后期高级合成与画面质感提升深度赋能。</p>
                </div>
            </div>
        </section>

        <!-- Module D: Growth & Journey Timeline -->
        <section class="flex flex-col gap-16 mt-8 max-w-4xl mx-auto w-full text-left">
            <div class="text-center">
                <h3 class="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tighter">成长与转型足迹</h3>
                <p class="text-gray-500 text-sm mt-2">Professional Journey &amp; Milestones</p>
            </div>
            
            <!-- Static fallback timeline — hydrated by JS if about_timeline_json is set -->
            <div id="about-timeline-container" class="relative border-l border-gray-200 ml-4 md:ml-32 pl-8 md:pl-12 flex flex-col gap-16">
                <!-- Timeline Line -->
                <div class="absolute left-[-1.5px] top-2 bottom-2 w-[3px] bg-gradient-to-b from-charcoal-900 to-gray-200"></div>
                
                <!-- Timeline Item 1 -->
                <div class="relative group">
                    <!-- Bullet node -->
                    <div class="absolute left-[-41px] md:left-[-61px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-charcoal-900 shadow-sm group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                        <div class="w-1.5 h-1.5 rounded-full bg-charcoal-900"></div>
                    </div>
                    <!-- Date Badge -->
                    <div class="md:absolute md:right-[100%] md:mr-16 md:top-1.5 text-xs font-extrabold text-charcoal-900 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full whitespace-nowrap mb-3 md:mb-0 inline-block">
                        2018 - 2021
                    </div>
                    <!-- Content Card -->
                    <div class="bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-gray-200/80 shadow-sm hover:border-gray-300 transition-all">
                        <h4 class="text-lg font-bold text-gray-950">Richard J. Daley College (Chicago, USA)</h4>
                        <p class="text-xs font-semibold text-gray-500 mt-1">Film and Digital Media Foundation</p>
                        <p class="text-sm text-gray-600 mt-3 font-light leading-relaxed">
                            系统修读电影视听语言、数字媒体设计及剪辑合成。深度研习了经典影视镜头的蒙太奇语法，为日后对动态韵律 and 声画同频的严格把控奠定了极其坚实的美学基础。
                        </p>
                    </div>
                </div>

                <!-- Timeline Item 2 -->
                <div class="relative group">
                    <!-- Bullet node -->
                    <div class="absolute left-[-41px] md:left-[-61px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-charcoal-900 shadow-sm group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                        <div class="w-1.5 h-1.5 rounded-full bg-charcoal-900"></div>
                    </div>
                    <!-- Date Badge -->
                    <div class="md:absolute md:right-[100%] md:mr-16 md:top-1.5 text-xs font-extrabold text-charcoal-900 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full whitespace-nowrap mb-3 md:mb-0 inline-block">
                        2021 - 2023
                    </div>
                    <!-- Content Card -->
                    <div class="bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-gray-200/80 shadow-sm hover:border-gray-300 transition-all">
                        <h4 class="text-lg font-bold text-gray-950">跨境电商 TikTok 动效设计师</h4>
                        <p class="text-xs font-semibold text-gray-500 mt-1">TikTok Ads &amp; Short Videos Dynamic Production</p>
                        <p class="text-sm text-gray-600 mt-3 font-light leading-relaxed">
                            专注海外 TikTok 平台大促及高转化出海广告动效的创意开发。通过持续分析点击转化率，针对性调优广告前三秒的"视觉钩子（Visual Hook）"，精雕文字缓动与分屏动效，成功协助多款爆品达成数百万播放与业务高转化。
                        </p>
                    </div>
                </div>

                <!-- Timeline Item 3 -->
                <div class="relative group">
                    <!-- Bullet node -->
                    <div class="absolute left-[-41px] md:left-[-61px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-charcoal-900 shadow-sm group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                        <div class="w-1.5 h-1.5 rounded-full bg-charcoal-900"></div>
                    </div>
                    <!-- Date Badge -->
                    <div class="md:absolute md:right-[100%] md:mr-16 md:top-1.5 text-xs font-extrabold text-charcoal-900 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full whitespace-nowrap mb-3 md:mb-0 inline-block">
                        2023 - 至今
                    </div>
                    <!-- Content Card -->
                    <div class="bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-gray-200/80 shadow-sm hover:border-gray-300 transition-all">
                        <h4 class="text-lg font-bold text-gray-950">欧洲学院 (Academy Europe) 商业动效证书 &amp; 独立自由设计师</h4>
                        <p class="text-xs font-semibold text-gray-500 mt-1">Dynamic Narrative Design &amp; Generative AI Workflow Exploration</p>
                        <p class="text-sm text-gray-600 mt-3 font-light leading-relaxed">
                            以优异成绩获得欧洲学院商业动态设计认证，专注于现代多媒体动态美学。转型为独立视觉设计师后，全面升级技术流水线，将 AIGC 模型融合至三维与后期合成开发中，为众多国内外知名品牌和小众工作室提供高能效动效设计方案。
                        </p>
                    </div>
                </div>
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
            await hydratePage();
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

        async function hydratePage() {
            try {
                const configs = await dataService.getSiteConfigs('about');

                // Hydrate bio name / headline
                const bioName = document.getElementById('about-bio-name');
                if (bioName && configs.about_bio_name) bioName.textContent = configs.about_bio_name;

                // Hydrate bio text (lead paragraph)
                const bioText = document.getElementById('about-bio-text');
                if (bioText && configs.about_bio_text) bioText.textContent = configs.about_bio_text;

                // Hydrate workflow steps 01-03
                for (let i = 1; i <= 3; i++) {
                    const pad = String(i).padStart(2, '0');
                    const titleEl = document.getElementById(\`about-workflow-\${pad}-title\`);
                    const descEl  = document.getElementById(\`about-workflow-\${pad}-desc\`);
                    if (titleEl && configs[\`about_workflow_0\${i}_title\`]) titleEl.textContent = configs[\`about_workflow_0\${i}_title\`];
                    if (descEl  && configs[\`about_workflow_0\${i}_desc\`])  descEl.textContent  = configs[\`about_workflow_0\${i}_desc\`];
                }

                // Hydrate dynamic timeline (replaces static fallback if JSON is provided)
                const timelineContainer = document.getElementById('about-timeline-container');
                if (timelineContainer && configs.about_timeline_json) {
                    try {
                        const items = JSON.parse(configs.about_timeline_json);
                        if (Array.isArray(items) && items.length > 0) {
                            timelineContainer.innerHTML = \`
                                <div class="absolute left-[-1.5px] top-2 bottom-2 w-[3px] bg-gradient-to-b from-gray-900 to-gray-200 pointer-events-none"></div>
                                \` + items.map((item, idx) => \`
                                <div class="relative group">
                                    <div class="absolute left-[-41px] md:left-[-61px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-gray-900 shadow-sm group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                                        <div class="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
                                    </div>
                                    <div class="md:absolute md:right-[100%] md:mr-16 md:top-1.5 text-xs font-extrabold text-gray-900 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full whitespace-nowrap mb-3 md:mb-0 inline-block">
                                        \${item.year || ''}
                                    </div>
                                    <div class="bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-gray-200/80 shadow-sm hover:border-gray-300 transition-all">
                                        <h4 class="text-lg font-bold text-gray-950">\${item.title || ''}</h4>
                                        \${item.subtitle ? \`<p class="text-xs font-semibold text-gray-500 mt-1">\${item.subtitle}</p>\` : ''}
                                        \${item.desc ? \`<p class="text-sm text-gray-600 mt-3 font-light leading-relaxed">\${item.desc}</p>\` : ''}
                                    </div>
                                </div>
                            \`).join('');
                        }
                    } catch(e) {
                        console.warn('[about] Timeline JSON parse error:', e);
                    }
                }
            } catch(err) {
                console.warn('[about] Config hydration failed, using static content:', err);
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
