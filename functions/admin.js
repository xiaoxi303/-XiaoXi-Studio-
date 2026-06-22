// functions/admin.js — XiaoXi Studio Full-Site CMS Dashboard
// Protected by HTTP Basic Auth: username=xiaoxi, password=env.ADMIN_PASSWORD (fallback: admin123)

function checkBasicAuth(request, env) {
    const auth = request.headers.get('Authorization') || '';
    if (!auth.startsWith('Basic ')) return false;
    try {
        const decoded  = atob(auth.slice(6));
        const colonIdx = decoded.indexOf(':');
        if (colonIdx === -1) return false;
        const user = decoded.slice(0, colonIdx);
        const pass = decoded.slice(colonIdx + 1);
        const expected = (env && env.ADMIN_PASSWORD) ? env.ADMIN_PASSWORD : 'admin123';
        return user === 'xiaoxi' && pass === expected;
    } catch { return false; }
}

export async function onRequest(context) {
    const { request, env } = context;

    if (!checkBasicAuth(request, env)) {
        return new Response('XiaoXi Studio — Admin Access Denied.\nPlease provide valid credentials.', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="XiaoXi Studio Admin"',
                'Content-Type': 'text/plain;charset=utf-8'
            }
        });
    }

    const adminPassword = (env && env.ADMIN_PASSWORD) ? env.ADMIN_PASSWORD : 'admin123';

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>XiaoXi Studio — CMS 超级控制台</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        cream: { 50: '#FDFBF7', 100: '#F7F4EB', 200: '#ECE6D2' },
                        charcoal: { 950: '#0B0F19', 900: '#111827', 800: '#1F2937', 700: '#374151', 600: '#4B5563' }
                    },
                    borderRadius: { 'large-card': '2rem' },
                    fontFamily: { sans: ['Outfit', 'Noto Sans SC', 'sans-serif'] }
                }
            }
        }
    </script>
    <style>
        body { background-color: #FDFBF7; color: #111827; }
        .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(0,0,0,0.015) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(0,0,0,0.015) 1px, transparent 1px);
        }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 99px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.15); }
        .cms-tab-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:12px; font-size:13px; font-weight:500; transition:all 0.2s; color:#6b7280; white-space:nowrap; }
        .cms-tab-btn:hover { color:#111827; }
        .cms-tab-btn.active { background:white; box-shadow:0 1px 4px rgba(0,0,0,0.10); color:#111827; font-weight:700; }
        .cms-panel { display:none; }
        .cms-panel.active { display:block; }
        .cms-card { background:white; border:1px solid #f3f4f6; border-radius:1.25rem; padding:1.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.04); }
        .cms-label { display:block; font-size:10px; font-weight:700; color:#111827; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; }
        .cms-input { width:100%; border:1px solid #e5e7eb; border-radius:12px; font-size:14px; padding:10px 14px; background:#fafafa; transition:border-color 0.2s; outline:none; font-family:inherit; }
        .cms-input:focus { border-color:#111827; }
        .cms-textarea { width:100%; border:1px solid #e5e7eb; border-radius:12px; font-size:14px; padding:10px 14px; background:#fafafa; transition:border-color 0.2s; outline:none; font-family:inherit; resize:vertical; line-height:1.6; }
        .cms-textarea:focus { border-color:#111827; }
        .cms-save-btn { background:black; color:white; border:none; padding:12px 24px; border-radius:14px; font-size:13px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,0.15); }
        .cms-save-btn:hover { background:#1f2937; transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.2); }
        .cms-save-btn:active { transform:scale(0.98); }
        .cms-section-head { font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.1em; padding-bottom:12px; border-bottom:1px solid #f3f4f6; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
        .timeline-row { display:grid; grid-template-columns:80px 1fr 1fr auto; gap:8px; align-items:start; padding:12px; background:#fafafa; border:1px solid #f3f4f6; border-radius:12px; margin-bottom:8px; }
        .skills-pill { display:inline-flex; align-items:center; gap:6px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:99px; padding:6px 12px; font-size:12px; font-weight:600; color:#374151; margin:4px; }
        .upload-zone-sm { border:2px dashed #e5e7eb; border-radius:14px; padding:24px 16px; text-align:center; cursor:pointer; transition:all 0.2s; background:#fafafa; }
        .upload-zone-sm:hover { border-color:#111827; background:#f9fafb; }
    </style>
</head>
<body class="font-sans antialiased min-h-screen bg-grid">

    <!-- Ambient spheres -->
    <div class="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30">
        <div class="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#fcecd7] filter blur-[120px] opacity-60 animate-pulse" style="animation-duration:8s;"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#e8eefc] filter blur-[120px] opacity-55 animate-pulse" style="animation-duration:11s;"></div>
    </div>

    <!-- Floating Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 pointer-events-none">
        <div class="pointer-events-auto bg-white/70 backdrop-blur-xl border border-gray-200/80 shadow-sm rounded-full w-full max-w-7xl flex items-center justify-between px-6 py-3.5 mt-2 transition-all duration-300">
            <a href="/" class="font-bold text-lg text-gray-900 tracking-tighter hover:opacity-80 transition-opacity flex items-center gap-2">
                XiaoXi Studio
                <span class="text-[9px] font-extrabold bg-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider">CMS</span>
            </a>
            <div class="hidden md:flex items-center gap-1">
                <a href="/" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all">首页</a>
                <a href="/about" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all">关于</a>
                <a href="/toolkit" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all">技能</a>
                <a href="/contact" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all">联系</a>
            </div>
            <div class="flex items-center gap-3">
                <span class="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>已认证管理员
                </span>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="w-full max-w-7xl mx-auto px-4 md:px-8 pb-24 pt-[100px]">

        <!-- Page Title -->
        <div class="mb-8">
            <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">全站内容管理控制台</h1>
            <p class="text-sm text-gray-400 mt-1">在此处可视化修改全站任意页面的文字、图片、联系方式与法务条款，无需触碰任何代码。</p>
        </div>

        <!-- Tab Navigation -->
        <div class="flex items-center gap-1 bg-gray-100/80 border border-gray-200/50 p-1.5 rounded-2xl mb-8 overflow-x-auto">
            <button class="cms-tab-btn active" data-tab="projects">
                <span class="material-symbols-outlined text-[16px]">grid_view</span> 作品看板
            </button>
            <button class="cms-tab-btn" data-tab="home">
                <span class="material-symbols-outlined text-[16px]">home</span> 首页配置
            </button>
            <button class="cms-tab-btn" data-tab="about">
                <span class="material-symbols-outlined text-[16px]">person</span> 关于页配置
            </button>
            <button class="cms-tab-btn" data-tab="site">
                <span class="material-symbols-outlined text-[16px]">settings</span> 技能·联系·法务
            </button>
        </div>

        <!-- ================================================================ -->
        <!-- TAB 1: Projects Kanban                                           -->
        <!-- ================================================================ -->
        <div id="panel-projects" class="cms-panel active">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <!-- Left: Form + Category Manager -->
                <section class="lg:col-span-5 flex flex-col gap-6">

                    <!-- Project Form -->
                    <form id="project-form" class="flex flex-col gap-5">
                        <div class="cms-card">
                            <h2 class="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-1">
                                <span class="material-symbols-outlined text-[20px]">add_circle</span> 发布新创作
                            </h2>
                            <p class="text-[11px] text-gray-400">添加新作品至展示画廊，支持直传媒体资源至 R2 并同步写入 D1。</p>
                        </div>

                        <div class="cms-card flex flex-col gap-5">
                            <div>
                                <label class="cms-label">作品标题</label>
                                <input type="text" id="proj-title" required placeholder="例如: Cybernetic Echoes" class="cms-input"/>
                            </div>
                            <div>
                                <label class="cms-label">作品分类</label>
                                <select id="project-category-select" class="cms-input" style="appearance:auto;">
                                    <option value="" disabled selected>正在加载云端分类...</option>
                                </select>
                                <p id="category-error-tip" class="text-[11px] text-red-500 mt-1 hidden">无法加载分类数据，已启用本地兜底</p>
                            </div>
                        </div>

                        <div class="cms-card flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <label class="cms-label" style="margin-bottom:0;">素材类型</label>
                                <div class="flex items-center gap-4">
                                    <label class="inline-flex items-center text-xs text-gray-700 cursor-pointer gap-1.5">
                                        <input type="radio" name="media-type" value="image" checked class="text-black focus:ring-0"/> 静态图片
                                    </label>
                                    <label class="inline-flex items-center text-xs text-gray-700 cursor-pointer gap-1.5">
                                        <input type="radio" name="media-type" value="video" class="text-black focus:ring-0"/> 动态视频
                                    </label>
                                </div>
                            </div>
                            <div class="relative">
                                <div id="upload-zone" class="border-2 border-dashed border-gray-200 hover:border-gray-900 rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] cursor-pointer group relative">
                                    <input type="file" id="proj-file" accept="image/*,video/mp4" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"/>
                                    <div id="upload-progress-container" class="hidden w-full flex flex-col items-center gap-3">
                                        <div class="w-4/5 bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div id="upload-progress-bar" class="bg-black h-full w-0 transition-all duration-200"></div>
                                        </div>
                                        <span id="upload-percentage" class="text-xs font-bold text-gray-900">0%</span>
                                    </div>
                                    <div id="upload-default-label" class="flex flex-col items-center gap-2">
                                        <span class="material-symbols-outlined text-[36px] text-gray-300 group-hover:text-gray-900 transition-colors">cloud_upload</span>
                                        <span class="text-xs font-bold text-gray-600">拖拽文件或点击上传</span>
                                        <span class="text-[10px] text-gray-400">支持 MP4 视频 / 图片</span>
                                    </div>
                                </div>
                                <div id="media-preview-container" class="hidden border border-gray-100 rounded-2xl overflow-hidden aspect-video bg-black relative shadow-inner">
                                    <button type="button" id="clear-media-btn" class="absolute top-3 right-3 bg-black/60 text-white hover:bg-black p-1.5 rounded-full z-30 transition-all">
                                        <span class="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                    <div id="media-preview-viewport" class="w-full h-full flex items-center justify-center"></div>
                                </div>
                            </div>
                            <input type="hidden" id="proj-media-url"/>
                        </div>

                        <div class="cms-card flex flex-col gap-5">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="cms-label">排列序号</label>
                                    <input type="number" id="proj-seq" min="1" placeholder="默认自增" class="cms-input"/>
                                </div>
                                <div>
                                    <label class="cms-label">落地链接</label>
                                    <input type="text" id="proj-detail-url" value="#" class="cms-input"/>
                                </div>
                            </div>
                            <div>
                                <label class="cms-label">项目描述</label>
                                <textarea id="proj-desc" rows="3" placeholder="请输入作品背后的创意和技术细节..." class="cms-textarea"></textarea>
                            </div>
                        </div>

                        <button type="submit" class="cms-save-btn w-full justify-center py-4 rounded-2xl">
                            <span class="material-symbols-outlined text-[18px]">publish</span> 确认发布作品
                        </button>
                    </form>

                    <!-- Category Manager -->
                    <div class="cms-card flex flex-col gap-4">
                        <div class="cms-section-head">
                            <span class="material-symbols-outlined text-[18px]">category</span> 作品分类管理
                        </div>
                        <div id="admin-categories-list" class="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scroll"></div>
                        <div class="border-t border-gray-50 pt-4 flex flex-col gap-3">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">新建分类</span>
                            <div class="grid grid-cols-3 gap-2">
                                <input type="text" id="new-cat-name"  placeholder="名称 (VFX)" class="cms-input text-xs py-2"/>
                                <input type="text" id="new-cat-slug"  placeholder="Slug (vfx)" class="cms-input text-xs py-2"/>
                                <input type="text" id="new-cat-badge" placeholder="Badge (VFX)" class="cms-input text-xs py-2"/>
                            </div>
                            <button type="button" id="add-category-btn" class="cms-save-btn text-xs py-2.5 rounded-xl justify-center">
                                <span class="material-symbols-outlined text-[14px]">add</span> 创建分类
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Right: Kanban Grid -->
                <section class="lg:col-span-7">
                    <div class="cms-card flex flex-col min-h-[680px]" style="border-radius:2rem; padding:2rem;">
                        <div class="flex items-center justify-between border-b border-gray-50 pb-4 mb-6">
                            <div>
                                <h2 class="text-base font-extrabold text-gray-900 flex items-center gap-2">
                                    <span class="material-symbols-outlined">grid_view</span> 作品看板管理
                                </h2>
                                <p class="text-[11px] text-gray-400 mt-0.5">D1 内所有线上发布，视频自动静音循环预览。</p>
                            </div>
                            <span id="project-count" class="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full font-bold">0 作品</span>
                        </div>
                        <div id="admin-cards-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-5 grow overflow-y-auto max-h-[600px] pr-1 custom-scroll"></div>
                        <div id="table-empty-state" class="hidden flex-col items-center justify-center py-24 text-gray-400">
                            <span class="material-symbols-outlined text-[48px] mb-3 text-gray-300">folder_open</span>
                            <span class="text-xs font-bold uppercase tracking-wider">暂无任何线上作品</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <!-- ================================================================ -->
        <!-- TAB 2: Home Config                                               -->
        <!-- ================================================================ -->
        <div id="panel-home" class="cms-panel">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Hero Section Config -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">title</span> Hero 首屏区域
                    </div>
                    <div>
                        <label class="cms-label">大标题（主标语）</label>
                        <input type="text" id="cfg-home-hero-title" class="cms-input" placeholder="无限进步"/>
                    </div>
                    <div>
                        <label class="cms-label">副标题</label>
                        <textarea id="cfg-home-hero-subtitle" rows="3" class="cms-textarea" placeholder="精细且富有灵魂地打造数字化体验..."></textarea>
                    </div>
                    <div>
                        <label class="cms-label">状态标签（右侧胶囊）</label>
                        <input type="text" id="cfg-home-hero-status" class="cms-input" placeholder="AE + AI 辅助内容生成"/>
                    </div>
                    <div>
                        <label class="cms-label">领域标签（下方次要文字）</label>
                        <input type="text" id="cfg-home-hero-fields" class="cms-input" placeholder="AI作品 / MG动画 / TVC / 跨境电商"/>
                    </div>
                </div>

                <!-- Marquee Config -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">campaign</span> 滚动公告走马灯
                    </div>
                    <div>
                        <label class="cms-label">走马灯滚动文字</label>
                        <textarea id="cfg-home-marquee" rows="5" class="cms-textarea" placeholder="★ 公告内容..."></textarea>
                        <p class="text-[10px] text-gray-400 mt-1.5">用 ★ 分隔不同公告，文字会自动无缝循环滚动。</p>
                    </div>
                </div>

                <!-- Stats: A + B -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">bar_chart</span> 数据战绩墙 — A & B
                    </div>
                    <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                        <div class="font-bold text-[10px] text-gray-900 uppercase tracking-widest col-span-2 mb-1">战绩 A</div>
                        <div><label class="cms-label">数值</label><input type="text" id="cfg-home-stat-a-value" class="cms-input" placeholder="30+"/></div>
                        <div><label class="cms-label">标签</label><input type="text" id="cfg-home-stat-a-label" class="cms-input" placeholder="覆盖行业项目"/></div>
                        <div class="col-span-2"><label class="cms-label">描述</label><input type="text" id="cfg-home-stat-a-desc" class="cms-input" placeholder="跨不同数字化领域的丰富实战积累"/></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                        <div class="font-bold text-[10px] text-gray-900 uppercase tracking-widest col-span-2 mb-1">战绩 B</div>
                        <div><label class="cms-label">数值</label><input type="text" id="cfg-home-stat-b-value" class="cms-input" placeholder="10x"/></div>
                        <div><label class="cms-label">标签</label><input type="text" id="cfg-home-stat-b-label" class="cms-input" placeholder="AI 催化产能提升"/></div>
                        <div class="col-span-2"><label class="cms-label">描述</label><input type="text" id="cfg-home-stat-b-desc" class="cms-input" placeholder="深度集成智能神经网络提速创作"/></div>
                    </div>
                </div>

                <!-- Stats: C + D -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">bar_chart</span> 数据战绩墙 — C & D
                    </div>
                    <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                        <div class="font-bold text-[10px] text-gray-900 uppercase tracking-widest col-span-2 mb-1">战绩 C</div>
                        <div><label class="cms-label">数值</label><input type="text" id="cfg-home-stat-c-value" class="cms-input" placeholder="99%"/></div>
                        <div><label class="cms-label">标签</label><input type="text" id="cfg-home-stat-c-label" class="cms-input" placeholder="跨境电商高留存率"/></div>
                        <div class="col-span-2"><label class="cms-label">描述</label><input type="text" id="cfg-home-stat-c-desc" class="cms-input" placeholder="打磨金字塔留存节奏与黄金钩子"/></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-xl">
                        <div class="font-bold text-[10px] text-gray-900 uppercase tracking-widest col-span-2 mb-1">战绩 D</div>
                        <div><label class="cms-label">数值</label><input type="text" id="cfg-home-stat-d-value" class="cms-input" placeholder="24/7"/></div>
                        <div><label class="cms-label">标签</label><input type="text" id="cfg-home-stat-d-label" class="cms-input" placeholder="全球全天候自由流协作"/></div>
                        <div class="col-span-2"><label class="cms-label">描述</label><input type="text" id="cfg-home-stat-d-desc" class="cms-input" placeholder="全时区无缝对接，高效无间合作"/></div>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="lg:col-span-2 flex justify-end">
                    <button id="save-home-btn" class="cms-save-btn">
                        <span class="material-symbols-outlined text-[18px]">save</span> 保存首页配置
                    </button>
                </div>
            </div>
        </div>

        <!-- ================================================================ -->
        <!-- TAB 3: About Config                                              -->
        <!-- ================================================================ -->
        <div id="panel-about" class="cms-panel">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Bio -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">person</span> 个人简介
                    </div>
                    <div>
                        <label class="cms-label">姓名 / 昵称</label>
                        <input type="text" id="cfg-about-bio-name" class="cms-input" placeholder="小希 · XiaoXi"/>
                    </div>
                    <div>
                        <label class="cms-label">个人介绍长文</label>
                        <textarea id="cfg-about-bio-text" rows="7" class="cms-textarea" placeholder="我是一位..."></textarea>
                    </div>
                </div>

                <!-- Workflow Steps -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">account_tree</span> 三步工作流
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl flex flex-col gap-3">
                            <div class="text-[10px] font-extrabold text-gray-900 uppercase tracking-widest">步骤 01</div>
                            <div><label class="cms-label">标题</label><input type="text" id="cfg-about-workflow-01-title" class="cms-input" placeholder="01 · 深度需求解构"/></div>
                            <div><label class="cms-label">描述</label><textarea id="cfg-about-workflow-01-desc" rows="3" class="cms-textarea" placeholder="与客户展开深度对话..."></textarea></div>
                        </div>
                        <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl flex flex-col gap-3">
                            <div class="text-[10px] font-extrabold text-gray-900 uppercase tracking-widest">步骤 02</div>
                            <div><label class="cms-label">标题</label><input type="text" id="cfg-about-workflow-02-title" class="cms-input" placeholder="02 · 精细制作执行"/></div>
                            <div><label class="cms-label">描述</label><textarea id="cfg-about-workflow-02-desc" rows="3" class="cms-textarea" placeholder="以 After Effects + AI..."></textarea></div>
                        </div>
                        <div class="p-4 bg-gray-50/60 border border-gray-100 rounded-xl flex flex-col gap-3">
                            <div class="text-[10px] font-extrabold text-gray-900 uppercase tracking-widest">步骤 03</div>
                            <div><label class="cms-label">标题</label><input type="text" id="cfg-about-workflow-03-title" class="cms-input" placeholder="03 · 快速迭代交付"/></div>
                            <div><label class="cms-label">描述</label><textarea id="cfg-about-workflow-03-desc" rows="3" class="cms-textarea" placeholder="基于实时反馈机制..."></textarea></div>
                        </div>
                    </div>
                </div>

                <!-- Dynamic Timeline Editor -->
                <div class="cms-card lg:col-span-2 flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">timeline</span> 动态经历时间轴
                        <span class="ml-auto text-[10px] text-gray-400 font-normal normal-case tracking-normal">每条记录包含：年份、标题、描述，可自由增减</span>
                    </div>
                    <div id="timeline-editor-rows" class="flex flex-col gap-2"></div>
                    <button type="button" id="add-timeline-row-btn" class="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-900 rounded-xl px-4 py-2.5 transition-all self-start">
                        <span class="material-symbols-outlined text-[16px]">add</span> 添加时间轴条目
                    </button>
                </div>

                <!-- Save Button -->
                <div class="lg:col-span-2 flex justify-end">
                    <button id="save-about-btn" class="cms-save-btn">
                        <span class="material-symbols-outlined text-[18px]">save</span> 保存关于页配置
                    </button>
                </div>
            </div>
        </div>

        <!-- ================================================================ -->
        <!-- TAB 4: Site Config (Skills / Contact / Legal)                    -->
        <!-- ================================================================ -->
        <div id="panel-site" class="cms-panel">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Skills JSON Editor -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">build</span> 技能标签云（JSON 格式）
                    </div>
                    <div id="skills-preview" class="flex flex-wrap gap-1 min-h-[48px] p-3 bg-gray-50/60 border border-gray-100 rounded-xl"></div>
                    <div>
                        <label class="cms-label">JSON 数据（每项含 icon + name）</label>
                        <textarea id="cfg-skills-json" rows="8" class="cms-textarea" style="font-family:monospace;font-size:12px;" placeholder='[{"icon":"auto_awesome","name":"After Effects"}]'></textarea>
                        <p class="text-[10px] text-gray-400 mt-1.5">icon 字段使用 Material Symbols Outlined 图标名称，如 <code class="bg-gray-100 px-1 rounded">auto_awesome</code>、<code class="bg-gray-100 px-1 rounded">movie</code>。</p>
                    </div>
                    <button type="button" id="preview-skills-btn" class="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-900 rounded-xl px-4 py-2 transition-all self-start">
                        <span class="material-symbols-outlined text-[15px]">visibility</span> 预览技能标签
                    </button>
                </div>

                <!-- Contact Info -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">contact_mail</span> 全站联系通道
                    </div>
                    <div>
                        <label class="cms-label">工作室官方邮箱</label>
                        <input type="email" id="cfg-contact-email" class="cms-input" placeholder="hello@xiaoxistudio.com"/>
                    </div>
                    <div>
                        <label class="cms-label">微信 ID</label>
                        <input type="text" id="cfg-contact-wechat" class="cms-input" placeholder="XiaoXi_Design"/>
                    </div>
                    <div>
                        <label class="cms-label">微信二维码图片（R2 URL）</label>
                        <input type="text" id="cfg-contact-wechat-qrcode" class="cms-input" placeholder="https://media.xiaoxistudio.com/qrcode.jpg"/>
                        <div class="upload-zone-sm mt-2 relative" id="qr-upload-zone">
                            <input type="file" id="qr-file-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                            <div id="qr-upload-label">
                                <span class="material-symbols-outlined text-[28px] text-gray-300 block mb-1">qr_code</span>
                                <span class="text-xs font-bold text-gray-500">拖拽或点击上传二维码图片</span>
                            </div>
                            <div id="qr-upload-progress" class="hidden">
                                <div class="w-3/4 bg-gray-100 h-1.5 rounded-full mx-auto mb-2">
                                    <div id="qr-progress-bar" class="bg-black h-full w-0 rounded-full transition-all duration-200"></div>
                                </div>
                                <span id="qr-progress-pct" class="text-xs font-bold text-gray-900">0%</span>
                            </div>
                        </div>
                        <div id="qr-preview-wrap" class="hidden mt-2">
                            <img id="qr-preview-img" src="" alt="QR Code" class="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"/>
                        </div>
                    </div>
                </div>

                <!-- Privacy Policy -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">shield</span> 隐私政策内容
                        <span class="ml-auto text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">支持 Markdown</span>
                    </div>
                    <div>
                        <label class="cms-label">隐私政策（Markdown 格式）</label>
                        <p class="text-[10px] text-gray-400 mb-2">支持 <code class="bg-gray-100 px-1 rounded">**粗体**</code>、<code class="bg-gray-100 px-1 rounded">## 标题</code>、<code class="bg-gray-100 px-1 rounded">- 列表</code>、<code class="bg-gray-100 px-1 rounded">---</code> 分割线。</p>
                        <textarea id="cfg-privacy-content" rows="14" class="cms-textarea" style="font-family:monospace;font-size:12px;line-height:1.7;" placeholder="# 隐私政策&#10;&#10;**最后更新日期：...**&#10;&#10;## 一、信息收集范围..."></textarea>
                    </div>
                </div>

                <!-- Terms of Service -->
                <div class="cms-card flex flex-col gap-5">
                    <div class="cms-section-head">
                        <span class="material-symbols-outlined text-[18px]">gavel</span> 服务条款内容
                        <span class="ml-auto text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">支持 Markdown</span>
                    </div>
                    <div>
                        <label class="cms-label">服务条款（Markdown 格式）</label>
                        <p class="text-[10px] text-gray-400 mb-2">支持 Markdown 格式，保存后前台隐私页与条款页自动实时刷新。</p>
                        <textarea id="cfg-terms-content" rows="14" class="cms-textarea" style="font-family:monospace;font-size:12px;line-height:1.7;" placeholder="# 服务条款&#10;&#10;**最后更新日期：...**&#10;&#10;## 一、服务性质声明..."></textarea>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="lg:col-span-2 flex justify-end">
                    <button id="save-site-btn" class="cms-save-btn">
                        <span class="material-symbols-outlined text-[18px]">save</span> 保存技能·联系·法务配置
                    </button>
                </div>
            </div>
        </div>

    </main>

    <!-- Toast -->
    <div id="toast" class="fixed bottom-8 right-8 z-50 bg-black/95 text-white text-xs font-semibold px-5 py-3.5 rounded-2xl shadow-xl opacity-0 pointer-events-none transition-all duration-300 flex items-center gap-2 border border-gray-800">
        <span id="toast-icon" class="material-symbols-outlined text-[16px] text-green-400">check_circle</span>
        <span id="toast-msg">操作成功</span>
    </div>

    <!-- Script -->
    <script type="module">
        import { dataService } from '/dataService.js';

        // Admin password injected from server (Basic Auth already verified)
        const ADMIN_PWD = '${adminPassword}';

        // ── Tab Switching ──────────────────────────────────────────────────────
        const tabLoaded = {};
        document.querySelectorAll('.cms-tab-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const tab = btn.dataset.tab;
                document.querySelectorAll('.cms-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.cms-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(\`panel-\${tab}\`).classList.add('active');
                // Lazy-load tab content on first activation
                if (!tabLoaded[tab]) {
                    tabLoaded[tab] = true;
                    if (tab === 'home')  await loadHomeConfigs();
                    if (tab === 'about') await loadAboutConfigs();
                    if (tab === 'site')  await loadSiteConfigs();
                }
            });
        });

        // ── TAB 1: Project Kanban ──────────────────────────────────────────────
        window.addEventListener('DOMContentLoaded', async () => {
            tabLoaded['projects'] = true;
            await refreshCategories();
            await fetchKanbanList();
            setupFormListeners();
            setupCategoryManager();
        });

        async function initAdminForm() {
            const selectEl  = document.getElementById('project-category-select');
            const errorTip  = document.getElementById('category-error-tip');
            try {
                const categories = await dataService.getCategories();
                if (!categories || categories.length === 0) throw new Error('empty');
                selectEl.innerHTML = categories.map(cat =>
                    \`<option value="\${cat.slug}">\${cat.name} (\${cat.badge || '无'})</option>\`
                ).join('');
                errorTip.classList.add('hidden');
            } catch {
                selectEl.innerHTML = '<option value="creative">创意视频 (AI)</option><option value="tvc">商业广告 (TVC)</option>';
                errorTip.classList.remove('hidden');
            }
        }

        async function fetchKanbanList() {
            const grid       = document.getElementById('admin-cards-grid');
            const emptyState = document.getElementById('table-empty-state');
            const countLabel = document.getElementById('project-count');
            grid.innerHTML = \`<div class="col-span-full flex flex-col items-center justify-center py-28 text-gray-400 gap-3">
                <span class="animate-spin material-symbols-outlined text-[28px] text-gray-900">progress_activity</span>
                <span class="text-xs font-bold uppercase tracking-wider">Syncing D1 database...</span></div>\`;
            try {
                const listData = await dataService.getProjects();
                countLabel.textContent = \`\${listData.length} 作品\`;
                if (listData.length === 0) {
                    grid.innerHTML = '';
                    emptyState.classList.remove('hidden'); emptyState.classList.add('flex'); return;
                }
                emptyState.classList.remove('flex'); emptyState.classList.add('hidden');
                grid.innerHTML = '';
                listData.forEach(project => {
                    const card = document.createElement('div');
                    card.className = 'group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[280px] hover:shadow-md hover:border-gray-200 transition-all duration-300';
                    const mediaHtml = project.mediaType === 'video'
                        ? \`<div class="h-3/5 w-full bg-black overflow-hidden"><video class="w-full h-full object-cover" muted autoplay loop playsinline preload="metadata"><source src="\${project.mediaUrl}" type="video/mp4"></video></div>\`
                        : \`<div class="h-3/5 w-full overflow-hidden bg-gray-50"><img src="\${project.mediaUrl}" class="w-full h-full object-cover" alt=""/></div>\`;
                    const serial = String(project.sequence_id).padStart(2, '0');
                    card.innerHTML = \`
                        <button data-id="\${project.id}" class="delete-btn absolute top-3 right-3 bg-white/95 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white border border-gray-100 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all z-10">
                            <span class="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                        \${mediaHtml}
                        <div class="p-4 flex flex-col justify-between grow bg-white">
                            <div>
                                <h3 class="text-xs font-bold text-gray-900 truncate">\${project.title}</h3>
                                <p class="text-[10px] text-gray-400 mt-1 line-clamp-2">\${project.description || '无描述'}</p>
                            </div>
                            <div class="flex items-center justify-between border-t border-gray-50 pt-2">
                                <span class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[8px] font-bold uppercase">\${project.category}</span>
                                <span class="text-[9px] font-bold text-gray-400">Seq \${serial}</span>
                            </div>
                        </div>\`;
                    grid.appendChild(card);
                });
                grid.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', async e => {
                        const id = e.currentTarget.getAttribute('data-id');
                        if (confirm('确定要删除此作品吗？D1 记录将同步抹除。')) {
                            try {
                                await dataService.deleteProject(id, ADMIN_PWD);
                                showToast('项目已物理抹除。', 'check_circle', 'text-green-400');
                                await fetchKanbanList();
                            } catch (err) { showToast(err.message || '删除失败', 'error', 'text-red-500'); }
                        }
                    });
                });
            } catch (err) {
                grid.innerHTML = \`<div class="col-span-full text-center py-20 text-red-500 font-bold text-xs uppercase tracking-wider">无法连接 D1，请检查 Cloudflare 绑定配置。</div>\`;
            }
        }

        function setupFormListeners() {
            const form      = document.getElementById('project-form');
            const fileInput = document.getElementById('proj-file');
            const clearBtn  = document.getElementById('clear-media-btn');
            const uploadZone = document.getElementById('upload-zone');

            ['dragenter','dragover'].forEach(ev => uploadZone.addEventListener(ev, e => { e.preventDefault(); uploadZone.style.borderColor='#111827'; }));
            ['dragleave','drop'].forEach(ev => uploadZone.addEventListener(ev, e => { e.preventDefault(); uploadZone.style.borderColor=''; }));
            uploadZone.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) { fileInput.files = e.dataTransfer.files; handleFileUpload(f); } });
            fileInput.addEventListener('change', e => { if (e.target.files[0]) handleFileUpload(e.target.files[0]); });

            async function handleFileUpload(file) {
                const prog = document.getElementById('upload-progress-container');
                const bar  = document.getElementById('upload-progress-bar');
                const pct  = document.getElementById('upload-percentage');
                const lbl  = document.getElementById('upload-default-label');
                lbl.classList.add('hidden'); prog.classList.remove('hidden');
                const cat = document.getElementById('project-category-select').value;
                if (!cat) { showToast('请先选择作品分类！', 'warning', 'text-yellow-500'); prog.classList.add('hidden'); lbl.classList.remove('hidden'); return; }
                const mediaType = [...document.getElementsByName('media-type')].find(r => r.checked)?.value || 'image';
                try {
                    const result = await dataService.uploadFile(file, cat, p => {
                        const v = Math.round((p.loaded / p.total) * 100);
                        bar.style.width = \`\${v}%\`; pct.textContent = \`\${v}%\`;
                    });
                    if (result.success) {
                        document.getElementById('proj-media-url').value = result.mediaUrl;
                        uploadZone.classList.add('hidden');
                        const previewCon = document.getElementById('media-preview-container');
                        const previewVP  = document.getElementById('media-preview-viewport');
                        previewCon.classList.remove('hidden');
                        previewVP.innerHTML = mediaType === 'video'
                            ? \`<video class="w-full h-full object-cover" controls autoplay loop playsinline><source src="\${result.mediaUrl}" type="video/mp4"></video>\`
                            : \`<img src="\${result.mediaUrl}" class="w-full h-full object-cover"/>\`;
                        showToast('素材上传成功！', 'check_circle', 'text-green-400');
                    }
                } catch (err) {
                    showToast('上传失败，请检查 R2 绑定。', 'error', 'text-red-500');
                    prog.classList.add('hidden'); lbl.classList.remove('hidden'); bar.style.width='0%'; pct.textContent='0%';
                }
            }

            clearBtn.addEventListener('click', () => {
                document.getElementById('media-preview-viewport').innerHTML = '';
                document.getElementById('proj-media-url').value = '';
                fileInput.value = '';
                document.getElementById('media-preview-container').classList.add('hidden');
                uploadZone.classList.remove('hidden');
                document.getElementById('upload-progress-container').classList.add('hidden');
                document.getElementById('upload-default-label').classList.remove('hidden');
                document.getElementById('upload-progress-bar').style.width = '0%';
                document.getElementById('upload-percentage').textContent = '0%';
            });

            form.addEventListener('submit', async e => {
                e.preventDefault();
                const cat = document.getElementById('project-category-select').value;
                if (!cat) { showToast('请选择作品分类！', 'warning', 'text-yellow-500'); return; }
                const mediaUrl = document.getElementById('proj-media-url').value;
                if (!mediaUrl) { showToast('请先上传作品媒体文件！', 'warning', 'text-yellow-500'); return; }
                const mediaType = [...document.getElementsByName('media-type')].find(r => r.checked)?.value || 'image';
                const payload = {
                    sequence_id: document.getElementById('proj-seq').value ? parseInt(document.getElementById('proj-seq').value, 10) : undefined,
                    title:       document.getElementById('proj-title').value,
                    description: document.getElementById('proj-desc').value,
                    categorySlug: cat, mediaType, mediaUrl,
                    detailUrl: document.getElementById('proj-detail-url').value || '#'
                };
                try {
                    const res = await dataService.addProject(payload, ADMIN_PWD);
                    if (res.success) {
                        showToast('作品发布入库成功！', 'check_circle', 'text-green-400');
                        form.reset(); clearBtn.click(); await fetchKanbanList();
                    }
                } catch (err) { showToast(err.message || '发布失败', 'error', 'text-red-500'); }
            });
        }

        function setupCategoryManager() {
            document.getElementById('add-category-btn').addEventListener('click', async () => {
                const name  = document.getElementById('new-cat-name').value.trim();
                const slug  = document.getElementById('new-cat-slug').value.trim();
                const badge = document.getElementById('new-cat-badge').value.trim();
                if (!name || !slug) { showToast('分类名称和 Slug 为必填项！', 'warning', 'text-yellow-500'); return; }
                try {
                    const res = await dataService.addCategory({ name, slug, badge }, ADMIN_PWD);
                    if (res.success) {
                        showToast('新分类创建成功！', 'check_circle', 'text-green-400');
                        document.getElementById('new-cat-name').value = '';
                        document.getElementById('new-cat-slug').value = '';
                        document.getElementById('new-cat-badge').value = '';
                        await refreshCategories();
                    }
                } catch (err) { showToast(err.message || '创建失败', 'error', 'text-red-500'); }
            });
        }

        async function renderCategoriesList() {
            const listContainer = document.getElementById('admin-categories-list');
            try {
                let cats = await dataService.getCategories();
                if (!Array.isArray(cats) || cats.length === 0) throw new Error('empty');
                listContainer.innerHTML = cats.map(cat => \`
                    <div class="flex items-center justify-between bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-xs">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-gray-900">\${cat.name}</span>
                            <span class="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-extrabold uppercase">\${cat.badge || cat.slug}</span>
                        </div>
                        <button type="button" data-id="\${cat.id}" class="delete-cat-btn text-red-400 hover:text-red-600 transition-colors p-1">
                            <span class="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                    </div>\`).join('');
                listContainer.querySelectorAll('.delete-cat-btn').forEach(btn => {
                    btn.addEventListener('click', async e => {
                        const id = e.currentTarget.getAttribute('data-id');
                        if (confirm('确定删除此分类？')) {
                            try {
                                await dataService.deleteCategory(id, ADMIN_PWD);
                                showToast('分类已删除！', 'check_circle', 'text-green-400');
                                await refreshCategories();
                            } catch (err) { showToast(err.message || '删除失败', 'error', 'text-red-500'); }
                        }
                    });
                });
            } catch { listContainer.innerHTML = '<span class="text-xs text-red-400">无法加载分类列表</span>'; }
        }

        async function initNavDropdown() { /* nav dropdown not needed in admin */ }

        async function refreshCategories() {
            await initAdminForm(); await renderCategoriesList();
        }

        // ── TAB 2: Home Config ─────────────────────────────────────────────────
        async function loadHomeConfigs() {
            try {
                const configs = await dataService.getSiteConfigs('home');
                const set = (id, key) => { const el = document.getElementById(id); if (el && configs[key] !== undefined) el.value = configs[key]; };
                set('cfg-home-hero-title',    'home_hero_title');
                set('cfg-home-hero-subtitle', 'home_hero_subtitle');
                set('cfg-home-hero-status',   'home_hero_status');
                set('cfg-home-hero-fields',   'home_hero_fields');
                set('cfg-home-marquee',       'home_marquee_text');
                ['a','b','c','d'].forEach(s => {
                    set(\`cfg-home-stat-\${s}-value\`, \`home_stat_\${s}_value\`);
                    set(\`cfg-home-stat-\${s}-label\`, \`home_stat_\${s}_label\`);
                    set(\`cfg-home-stat-\${s}-desc\`,  \`home_stat_\${s}_desc\`);
                });
            } catch (err) { console.warn('loadHomeConfigs error:', err); }
        }

        document.getElementById('save-home-btn').addEventListener('click', async () => {
            const configs = [
                { key: 'home_hero_title',    value: document.getElementById('cfg-home-hero-title').value },
                { key: 'home_hero_subtitle', value: document.getElementById('cfg-home-hero-subtitle').value },
                { key: 'home_hero_status',   value: document.getElementById('cfg-home-hero-status').value },
                { key: 'home_hero_fields',   value: document.getElementById('cfg-home-hero-fields').value },
                { key: 'home_marquee_text',  value: document.getElementById('cfg-home-marquee').value },
                ...['a','b','c','d'].flatMap(s => [
                    { key: \`home_stat_\${s}_value\`, value: document.getElementById(\`cfg-home-stat-\${s}-value\`).value },
                    { key: \`home_stat_\${s}_label\`, value: document.getElementById(\`cfg-home-stat-\${s}-label\`).value },
                    { key: \`home_stat_\${s}_desc\`,  value: document.getElementById(\`cfg-home-stat-\${s}-desc\`).value },
                ])
            ];
            try {
                await dataService.batchUpdateSiteConfigs(configs, ADMIN_PWD);
                showToast('首页配置已保存！前台将实时刷新。', 'check_circle', 'text-green-400');
            } catch (err) { showToast(err.message || '保存失败', 'error', 'text-red-500'); }
        });

        // ── TAB 3: About Config ────────────────────────────────────────────────
        async function loadAboutConfigs() {
            try {
                const configs = await dataService.getSiteConfigs('about');
                const set = (id, key) => { const el = document.getElementById(id); if (el && configs[key] !== undefined) el.value = configs[key]; };
                set('cfg-about-bio-name', 'about_bio_name');
                set('cfg-about-bio-text', 'about_bio_text');
                for (let i = 1; i <= 3; i++) {
                    const pad = String(i).padStart(2,'0');
                    set(\`cfg-about-workflow-\${pad}-title\`, \`about_workflow_0\${i}_title\`);
                    set(\`cfg-about-workflow-\${pad}-desc\`,  \`about_workflow_0\${i}_desc\`);
                }
                // Render timeline editor
                if (configs.about_timeline_json) {
                    try {
                        const items = JSON.parse(configs.about_timeline_json);
                        const container = document.getElementById('timeline-editor-rows');
                        container.innerHTML = '';
                        items.forEach(item => addTimelineRow(item.year, item.title, item.desc));
                    } catch {}
                }
            } catch (err) { console.warn('loadAboutConfigs error:', err); }
        }

        function addTimelineRow(year = '', title = '', desc = '') {
            const container = document.getElementById('timeline-editor-rows');
            const row = document.createElement('div');
            row.className = 'timeline-row';
            row.innerHTML = \`
                <div>
                    <label class="cms-label" style="font-size:9px;">年份</label>
                    <input type="text" class="cms-input tl-year" style="font-size:12px;padding:6px 10px;" value="\${year}" placeholder="2026"/>
                </div>
                <div>
                    <label class="cms-label" style="font-size:9px;">标题</label>
                    <input type="text" class="cms-input tl-title" style="font-size:12px;padding:6px 10px;" value="\${title}" placeholder="TikTok 投流专家"/>
                </div>
                <div>
                    <label class="cms-label" style="font-size:9px;">描述</label>
                    <textarea class="cms-textarea tl-desc" rows="2" style="font-size:12px;padding:6px 10px;">\${desc}</textarea>
                </div>
                <div class="flex items-start pt-5">
                    <button type="button" class="remove-timeline-row text-red-400 hover:text-red-600 p-1 transition-colors">
                        <span class="material-symbols-outlined text-[18px]">remove_circle</span>
                    </button>
                </div>\`;
            row.querySelector('.remove-timeline-row').addEventListener('click', () => row.remove());
            container.appendChild(row);
        }

        document.getElementById('add-timeline-row-btn').addEventListener('click', () => addTimelineRow());

        document.getElementById('save-about-btn').addEventListener('click', async () => {
            // Collect timeline rows
            const rows = [...document.querySelectorAll('#timeline-editor-rows .timeline-row')];
            const timelineData = rows.map(row => ({
                year:  row.querySelector('.tl-year').value.trim(),
                title: row.querySelector('.tl-title').value.trim(),
                desc:  row.querySelector('.tl-desc').value.trim()
            })).filter(item => item.year || item.title);

            const configs = [
                { key: 'about_bio_name',        value: document.getElementById('cfg-about-bio-name').value },
                { key: 'about_bio_text',         value: document.getElementById('cfg-about-bio-text').value },
                { key: 'about_workflow_01_title', value: document.getElementById('cfg-about-workflow-01-title').value },
                { key: 'about_workflow_01_desc',  value: document.getElementById('cfg-about-workflow-01-desc').value },
                { key: 'about_workflow_02_title', value: document.getElementById('cfg-about-workflow-02-title').value },
                { key: 'about_workflow_02_desc',  value: document.getElementById('cfg-about-workflow-02-desc').value },
                { key: 'about_workflow_03_title', value: document.getElementById('cfg-about-workflow-03-title').value },
                { key: 'about_workflow_03_desc',  value: document.getElementById('cfg-about-workflow-03-desc').value },
                { key: 'about_timeline_json',     value: JSON.stringify(timelineData) }
            ];
            try {
                await dataService.batchUpdateSiteConfigs(configs, ADMIN_PWD);
                showToast('关于页配置已保存！', 'check_circle', 'text-green-400');
            } catch (err) { showToast(err.message || '保存失败', 'error', 'text-red-500'); }
        });

        // ── TAB 4: Site Config ─────────────────────────────────────────────────
        async function loadSiteConfigs() {
            try {
                const [contact, legal, toolkit] = await Promise.all([
                    dataService.getSiteConfigs('contact'),
                    dataService.getSiteConfigs('legal'),
                    dataService.getSiteConfigs('toolkit')
                ]);
                const set = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = v; };
                set('cfg-contact-email',         contact.contact_studio_email);
                set('cfg-contact-wechat',        contact.contact_studio_wechat);
                set('cfg-contact-wechat-qrcode', contact.contact_studio_wechat_qrcode);
                if (contact.contact_studio_wechat_qrcode && contact.contact_studio_wechat_qrcode.trim()) {
                    document.getElementById('qr-preview-img').src = contact.contact_studio_wechat_qrcode;
                    document.getElementById('qr-preview-wrap').classList.remove('hidden');
                }
                set('cfg-privacy-content', legal.legal_privacy_content);
                set('cfg-terms-content',   legal.legal_terms_content);
                if (toolkit.toolkit_skills_json) {
                    set('cfg-skills-json', toolkit.toolkit_skills_json);
                    renderSkillsPreview(toolkit.toolkit_skills_json);
                }
            } catch (err) { console.warn('loadSiteConfigs error:', err); }
        }

        function renderSkillsPreview(jsonStr) {
            const preview = document.getElementById('skills-preview');
            try {
                const skills = JSON.parse(jsonStr);
                preview.innerHTML = skills.map(s =>
                    \`<span class="skills-pill"><span class="material-symbols-outlined text-[16px] text-gray-500">\${s.icon || 'stars'}</span>\${s.name}</span>\`
                ).join('');
            } catch { preview.innerHTML = '<span class="text-xs text-red-400">JSON 格式错误，请检查</span>'; }
        }

        document.getElementById('preview-skills-btn').addEventListener('click', () => {
            renderSkillsPreview(document.getElementById('cfg-skills-json').value);
        });

        // QR Code Upload
        const qrZone = document.getElementById('qr-upload-zone');
        const qrInput = document.getElementById('qr-file-input');
        ['dragenter','dragover'].forEach(ev => qrZone.addEventListener(ev, e => { e.preventDefault(); qrZone.style.borderColor='#111827'; }));
        ['dragleave','drop'].forEach(ev => qrZone.addEventListener(ev, e => { e.preventDefault(); qrZone.style.borderColor=''; }));
        qrZone.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) { qrInput.files = e.dataTransfer.files; handleQrUpload(f); } });
        qrInput.addEventListener('change', e => { if (e.target.files[0]) handleQrUpload(e.target.files[0]); });

        async function handleQrUpload(file) {
            const prog    = document.getElementById('qr-upload-progress');
            const bar     = document.getElementById('qr-progress-bar');
            const pct     = document.getElementById('qr-progress-pct');
            const lbl     = document.getElementById('qr-upload-label');
            lbl.classList.add('hidden'); prog.classList.remove('hidden');
            try {
                const result = await dataService.uploadFile(file, 'media', p => {
                    const v = Math.round((p.loaded / p.total) * 100);
                    bar.style.width = \`\${v}%\`; pct.textContent = \`\${v}%\`;
                });
                if (result.success) {
                    document.getElementById('cfg-contact-wechat-qrcode').value = result.mediaUrl;
                    const previewImg = document.getElementById('qr-preview-img');
                    previewImg.src = result.mediaUrl;
                    document.getElementById('qr-preview-wrap').classList.remove('hidden');
                    showToast('二维码上传成功！', 'check_circle', 'text-green-400');
                }
            } catch (err) { showToast('上传失败: ' + err.message, 'error', 'text-red-500'); }
            finally { prog.classList.add('hidden'); lbl.classList.remove('hidden'); bar.style.width='0%'; pct.textContent='0%'; }
        }

        document.getElementById('save-site-btn').addEventListener('click', async () => {
            const configs = [
                { key: 'contact_studio_email',        value: document.getElementById('cfg-contact-email').value },
                { key: 'contact_studio_wechat',       value: document.getElementById('cfg-contact-wechat').value },
                { key: 'contact_studio_wechat_qrcode', value: document.getElementById('cfg-contact-wechat-qrcode').value },
                { key: 'toolkit_skills_json',          value: document.getElementById('cfg-skills-json').value },
                { key: 'legal_privacy_content',        value: document.getElementById('cfg-privacy-content').value },
                { key: 'legal_terms_content',          value: document.getElementById('cfg-terms-content').value }
            ];
            try {
                await dataService.batchUpdateSiteConfigs(configs, ADMIN_PWD);
                showToast('技能·联系·法务配置已保存！', 'check_circle', 'text-green-400');
            } catch (err) { showToast(err.message || '保存失败', 'error', 'text-red-500'); }
        });

        // ── Toast ──────────────────────────────────────────────────────────────
        function showToast(msg, iconSymbol = 'check_circle', iconColorClass = 'text-green-400') {
            const toast    = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-msg');
            const toastIcon = document.getElementById('toast-icon');
            toastMsg.textContent  = msg;
            toastIcon.textContent = iconSymbol;
            toastIcon.className   = \`material-symbols-outlined text-[16px] \${iconColorClass}\`;
            toast.classList.remove('opacity-0', 'pointer-events-none');
            toast.classList.add('opacity-100');
            setTimeout(() => {
                toast.classList.remove('opacity-100');
                toast.classList.add('opacity-0', 'pointer-events-none');
            }, 3500);
        }
    </script>
</body>
</html>`;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
