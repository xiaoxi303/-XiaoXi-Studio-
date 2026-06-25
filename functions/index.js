// ============================================================
// functions/index.js — XiaoXi Studio 100% SSR Dynamic Homepage
// Replaces static index.html. Fetches D1 data at Cloudflare edge.
// ============================================================

function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const FALLBACK_HOME = {
    home_hero_title:'无限进步', home_hero_subtitle:'精细且富有灵魂地打造数字化体验。将创意视觉与前沿 AI 工作流相融合，呈现非凡的视觉叙事。',
    home_hero_status:'AE + AI 辅助内容生成', home_hero_fields:'AI作品 / MG动画 / TVC / 跨境电商',
    home_marquee_text:'★ XiaoXi Studio 2026 视觉探索全面启动 ★ 跨境电商 TikTok 投放视频消耗破百万 ★ AI生成式流媒体工作流深度集成 ★ 传统 MG 动效精细化定制 ★',
    home_stat_a_value:'30+', home_stat_a_label:'覆盖行业项目', home_stat_a_desc:'跨不同数字化领域的丰富实战积累',
    home_stat_b_value:'10x', home_stat_b_label:'AI 催化产能提升', home_stat_b_desc:'深度集成智能神经网络提速创作',
    home_stat_c_value:'99%', home_stat_c_label:'跨境电商高留存率', home_stat_c_desc:'打磨金字塔留存节奏与黄金钩子',
    home_stat_d_value:'24/7', home_stat_d_label:'全球全天候自由流协作', home_stat_d_desc:'全时区无缝对接，高效无间合作',
};
const FALLBACK_CATEGORIES = [
    {id:1,slug:'creative',name:'创意视频',badge:'AI'},{id:2,slug:'tvc',name:'商业广告',badge:'TVC'},
    {id:3,slug:'mg',name:'动态图形',badge:'MG'},{id:4,slug:'tiktok',name:'跨境流媒体',badge:'TikTok'}
];
const FALLBACK_PROJECTS = [
    {id:1,sequence_id:1,title:'Cybernetic Echoes',description:'AI-driven concept visualization for an upcoming tech apparel brand.',category_slug:'creative',media_type:'image',media_url:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',detail_url:'#'},
    {id:2,sequence_id:2,title:'Flow State Motion',description:'Abstract motion design campaign exploring fluidity and rhythm in digital spaces.',category_slug:'mg',media_type:'video',media_url:'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32124-large.mp4',detail_url:'#'},
    {id:3,sequence_id:3,title:'Dreamscape TVC',description:'Full production commercial spot blending live-action footage with stylized 3D environments.',category_slug:'tvc',media_type:'image',media_url:'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',detail_url:'#'},
    {id:4,sequence_id:4,title:'Viral Kinetics',description:'High-retention social media content series optimized for vertical formats.',category_slug:'tiktok',media_type:'video',media_url:'https://assets.mixkit.co/videos/preview/mixkit-vertical-neon-light-patterns-42340-large.mp4',detail_url:'#'},
    {id:5,sequence_id:5,title:'Chrono-Shift Showcase',description:'A conceptual commercial depicting time manipulation with Stable Diffusion keyframes.',category_slug:'creative',media_type:'video',media_url:'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-spheres-and-lines-32545-large.mp4',detail_url:'#'},
    {id:6,sequence_id:6,title:'Neo-Retro Aesthetic',description:'Styleframes and kinetic animation loops inspired by 80s synthwave aesthetics.',category_slug:'mg',media_type:'image',media_url:'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',detail_url:'#'},
];

function mapProjects(rawProjects, categories) {
    return rawProjects.map(p => {
        const slug = p.category_slug || p.categorySlug || 'creative';
        const cat = categories.find(c => c.slug === slug);
        return {
            id: p.id, sequence_id: p.sequence_id || p.id,
            title: p.title || 'Untitled', description: p.description || '',
            categorySlug: slug, category_slug: slug,
            category: cat ? cat.name : '未分类', badge: cat ? cat.badge : '',
            mediaType: p.media_type || p.mediaType || 'image', media_type: p.media_type || p.mediaType || 'image',
            mediaUrl: p.media_url || p.mediaUrl || '', media_url: p.media_url || p.mediaUrl || '',
            detailUrl: p.detail_url || p.detailUrl || '#', detail_url: p.detail_url || p.detailUrl || '#',
        };
    });
}

function renderCard(p, index) {
    const serial = String(p.sequence_id || index + 1).padStart(2, '0');
    const gridSpan = (index === 0 || index === 3) ? 'col-span-1 md:col-span-2' : 'col-span-1';
    const catName = esc(p.category);
    const title = esc(p.title);
    const desc = esc(p.description);
    let media;
    if (p.mediaType === 'video') {
        media = `<div class="h-2/3 w-full relative overflow-hidden bg-gray-50 border-b border-gray-100/60"><video class="w-full h-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out" muted loop autoplay playsinline preload="metadata"><source src="${esc(p.mediaUrl)}" type="video/mp4"></video><div class="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[9px] font-bold text-white flex items-center gap-1 select-none"><span class="material-symbols-outlined text-[12px] animate-pulse text-red-400">videocam</span>VIDEO preview</div></div>`;
    } else {
        media = `<div class="h-2/3 w-full relative overflow-hidden bg-gray-50 border-b border-gray-100/60"><img src="${esc(p.mediaUrl)}" class="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out" alt="${title}" loading="lazy"></div>`;
    }
    return `<div class="group relative rounded-[2rem] overflow-hidden bg-white border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-500 flex flex-col h-[520px] ${gridSpan}" data-category="${esc(p.categorySlug)}" data-project-id="${p.id}">
        <div class="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 px-3.5 py-1 rounded-full text-[10px] font-bold text-gray-900 shadow-sm">${serial}</div>
        ${media}
        <div class="p-6 md:p-8 h-1/3 flex flex-col justify-between bg-white relative">
            <div>
                <div class="flex items-center gap-2 mb-2"><span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">${catName}</span></div>
                <h3 class="text-xl md:text-2xl font-bold text-gray-950 mb-1 group-hover:text-gray-700 transition-colors">${title}</h3>
                <p class="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2">${desc}</p>
            </div>
            <button class="open-detail-btn inline-flex items-center gap-1.5 text-xs font-bold text-gray-950 hover:text-gray-600 uppercase tracking-widest mt-4 transition-colors" data-id="${p.id}">
                <span>查看详情</span><span class="material-symbols-outlined text-[15px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
        </div>
    </div>`;
}

export async function onRequest(context) {
    const db = context.env.DB;
    let hc = { ...FALLBACK_HOME };
    let categories = [...FALLBACK_CATEGORIES];
    let projects = [];
    let contactEmail = 'hello@xiaoxistudio.com';
    let contactWechat = 'XiaoXi_Design';

    if (db) {
        try {
            const batchResults = await db.batch([
                db.prepare('SELECT config_key, config_value FROM site_configs WHERE page_name = ?').bind('home'),
                db.prepare("SELECT config_key, config_value FROM site_configs WHERE page_name = ?").bind('contact'),
                db.prepare('SELECT id, slug, name, badge FROM categories ORDER BY id ASC'),
                db.prepare('SELECT id, sequence_id, title, description, category_slug, media_type, media_url, detail_url FROM projects ORDER BY sequence_id ASC'),
            ]);
            if (batchResults[0].results) for (const r of batchResults[0].results) hc[r.config_key] = r.config_value;
            if (batchResults[1].results) for (const r of batchResults[1].results) {
                if (r.config_key === 'contact_studio_email') contactEmail = r.config_value;
                if (r.config_key === 'contact_studio_wechat') contactWechat = r.config_value;
            }
            if (batchResults[2].results && batchResults[2].results.length > 0) categories = batchResults[2].results;
            if (batchResults[3].results && batchResults[3].results.length > 0) projects = mapProjects(batchResults[3].results, categories);
        } catch (err) {
            console.error('[index.js SSR] D1 batch error, using fallbacks:', err);
        }
    }

    if (projects.length === 0) projects = mapProjects(FALLBACK_PROJECTS, categories);

    const projectCardsHtml = projects.slice(0, 6).map((p, i) => renderCard(p, i)).join('\n');
    const navDropdownHtml = categories.map(c => `<a href="/?filter=${esc(c.slug)}#portfolio" data-filter="${esc(c.slug)}" class="dropdown-filter-btn w-full text-left px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group/item"><span class="text-xs font-semibold text-gray-700 group-hover/item:text-gray-950">${esc(c.name)}</span><span class="text-[9px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full uppercase">${esc(c.badge || c.slug)}</span></a>`).join('');
    const categoryTabsHtml = `<button data-filter="全部" class="category-tab-btn px-5 py-2.5 rounded-full text-xs font-bold bg-black text-white shadow-sm whitespace-nowrap">全部</button>` + categories.map(c => `<button data-filter="${esc(c.slug)}" class="category-tab-btn px-5 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:text-gray-950 hover:bg-white/80 border border-transparent hover:border-gray-200 whitespace-nowrap">${esc(c.name)}</button>`).join('');
    const marquee = esc(hc.home_marquee_text);
    const ssrJson = JSON.stringify({ categories, projects, homeConfigs: hc, contactEmail, contactWechat }).replace(/</g, '\\u003c');

    const html = `<!DOCTYPE html>
<html lang="zh-CN" class="scroll-smooth">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>XiaoXi Studio - Portfolio</title>
    <meta name="description" content="XiaoXi Studio — 精细且富有灵魂地打造数字化体验。AI作品 / MG动画 / TVC / 跨境电商。"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                cream: { 50:'#FDFBF7', 100:'#F7F4EB', 200:'#ECE6D2' },
                charcoal: { 950:'#0B0F19', 900:'#111827', 800:'#1F2937', 700:'#374151', 600:'#4B5563' }
              },
              borderRadius: { 'large-card':'2rem' },
              spacing: { gutter:'24px', 'container-max':'1280px' },
              fontFamily: { sans:["Outfit","Noto Sans SC","sans-serif"] }
            }
          }
        }
    </script>
    <style>
        body { background-color:#FDFBF7; color:#111827; }
        .bg-grid {
            background-size:40px 40px;
            background-image:linear-gradient(to right,rgba(0,0,0,0.02) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,0.02) 1px,transparent 1px);
        }
        .text-gradient {
            background:linear-gradient(135deg,#111827 30%,#6b7280 100%);
            -webkit-background-clip:text; -webkit-text-fill-color:transparent;
        }
        .hide-scrollbar::-webkit-scrollbar { display:none; }
        .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
        @keyframes marquee { 0%{transform:translateX(0%);} 100%{transform:translateX(-50%);} }
        .animate-marquee { display:flex; width:max-content; animation:marquee 30s linear infinite; }
    </style>
</head>
<body class="font-sans antialiased min-h-screen relative overflow-x-hidden selection:bg-gray-200 selection:text-gray-900">

    <!-- Ambient Grid & Blurred Organic Shapes -->
    <div class="fixed inset-0 pointer-events-none z-[-1] bg-grid"></div>
    <div class="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-40">
        <div class="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#fcecd7] filter blur-[128px] mix-blend-multiply opacity-50"></div>
        <div class="absolute bottom-[20%] right-[-10%] w-[48vw] h-[48vw] rounded-full bg-[#e1e9fb] filter blur-[128px] mix-blend-multiply opacity-60"></div>
        <div class="absolute top-[35%] left-[25%] w-[38vw] h-[38vw] rounded-full bg-[#fdebf0] filter blur-[128px] mix-blend-multiply opacity-40"></div>
    </div>

    <!-- 3-Section Floating Capsule Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-8 py-4 pointer-events-none">
        <div class="pointer-events-auto bg-white/70 backdrop-blur-xl border border-gray-200/80 shadow-sm rounded-full w-full max-w-[1280px] flex items-center justify-between px-6 md:px-8 py-3.5 mt-2 md:mt-4 transition-all duration-300">
            <a href="/" class="font-bold text-lg md:text-xl text-gray-950 tracking-tighter hover:opacity-80 transition-opacity">XiaoXi Studio</a>
            <div class="hidden md:flex items-center space-x-1 lg:space-x-2">
                <a id="nav-link-home" class="bg-gray-100 text-gray-900 px-3.5 py-1.5 rounded-full font-semibold text-sm transition-all" href="/">首页</a>
                <div class="relative group py-1.5">
                    <button id="nav-link-works" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-0.5 text-sm">
                        <span>作品</span><span class="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:rotate-180">keyboard_arrow_down</span>
                    </button>
                    <div class="absolute left-1/2 -translate-x-1/2 top-full pt-1 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div id="nav-dropdown-container" class="rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-xl p-2 flex flex-col gap-0.5">${navDropdownHtml}</div>
                    </div>
                </div>
                <a id="nav-link-about" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all" href="/about">关于</a>
                <a id="nav-link-toolkit" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all" href="/toolkit">技能</a>
                <a id="nav-link-contact" class="text-gray-500 hover:text-gray-900 px-3.5 py-1.5 rounded-full font-medium text-sm transition-all" href="/contact">联系</a>
            </div>
            <div class="flex items-center gap-3">
                <button id="lang-btn" class="hidden md:flex items-center gap-1.5 text-gray-500 hover:text-gray-950 transition-colors text-xs font-semibold px-2 py-1">
                    <span class="material-symbols-outlined text-[16px]">language</span><span>English</span>
                </button>
                <a id="download-cv-btn" href="#" target="_blank" class="bg-black text-white hover:bg-gray-800 px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all scale-100 active:scale-95 shadow-sm">
                    <span>下载简历</span><span class="material-symbols-outlined text-[15px]">download</span>
                </a>
            </div>
        </div>
        <!-- Mobile Bottom Nav -->
        <div class="fixed bottom-6 left-0 right-0 z-50 flex md:hidden justify-center w-full px-5 pointer-events-none">
            <div class="pointer-events-auto bg-white/90 backdrop-blur-xl border border-gray-200 shadow-lg rounded-full w-full max-w-sm flex items-center justify-around py-3 px-4">
                <a class="flex flex-col items-center text-gray-900" href="/"><span class="material-symbols-outlined text-[22px]">home</span><span class="text-[9px] mt-0.5 font-medium">首页</span></a>
                <a class="flex flex-col items-center text-gray-500" href="#portfolio" id="mobile-nav-link-works"><span class="material-symbols-outlined text-[22px]">grid_view</span><span class="text-[9px] mt-0.5 font-medium">作品</span></a>
                <a class="flex flex-col items-center text-gray-500" href="/about"><span class="material-symbols-outlined text-[22px]">person</span><span class="text-[9px] mt-0.5 font-medium">关于</span></a>
                <a class="flex flex-col items-center text-gray-500" href="/toolkit"><span class="material-symbols-outlined text-[22px]">build</span><span class="text-[9px] mt-0.5 font-medium">技能</span></a>
                <a class="flex flex-col items-center text-gray-500" href="/contact"><span class="material-symbols-outlined text-[22px]">mail</span><span class="text-[9px] mt-0.5 font-medium">联系</span></a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="w-full flex flex-col items-center px-4 md:px-8">

        <!-- Section 1: Hero -->
        <section class="w-full max-w-[1280px] min-h-screen flex flex-col justify-center pt-[140px] pb-[80px] md:pt-[180px] md:pb-[120px] relative">
            <div class="flex flex-col items-center text-center z-10 max-w-4xl mx-auto w-full">
                <div class="mb-8 bg-white/70 backdrop-blur-md border border-gray-200/80 rounded-full px-5 py-2.5 flex items-center justify-center gap-3 text-xs text-gray-600 font-semibold shadow-sm w-fit mx-auto">
                    <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                    <span id="active-fields-tag">${esc(hc.home_hero_fields)}</span>
                </div>
                <h1 class="font-extrabold tracking-tighter text-gray-950 mb-8 leading-[1.08]">
                    <span id="hero-title" class="block text-4xl sm:text-6xl md:text-[88px] text-gradient">${esc(hc.home_hero_title)}</span>
                    <span class="block text-3xl sm:text-5xl md:text-[76px] tracking-tight text-gray-400 font-light mt-2">Infinite Progress</span>
                </h1>
                <p id="hero-subtitle" class="text-gray-600 mb-12 max-w-2xl text-base md:text-lg leading-relaxed">${esc(hc.home_hero_subtitle)}</p>
                <div class="flex flex-wrap items-center justify-center gap-4 mb-20">
                    <button id="hero-view-works-btn" class="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2 transition-all shadow-md active:scale-95">查看作品<span class="material-symbols-outlined text-[18px]">arrow_forward</span></button>
                    <a class="px-8 py-4 rounded-full text-sm font-semibold tracking-wide border border-gray-300 text-gray-900 hover:border-black hover:bg-white/40 transition-all flex items-center gap-2 active:scale-95" href="/contact">联系合作<span class="material-symbols-outlined text-[18px]">mail</span></a>
                </div>
                <div class="bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl px-6 py-4 flex items-center gap-3 text-xs text-gray-500 font-semibold shadow-sm w-fit mx-auto">
                    <span class="material-symbols-outlined text-[18px] text-gray-900">auto_awesome</span>
                    <span id="active-status-tag">${esc(hc.home_hero_status)}</span>
                </div>
            </div>
        </section>

        <!-- Section 2: Marquee -->
        <section class="w-full overflow-hidden py-5 border-y border-dashed border-gray-300 bg-white/20 backdrop-blur-sm select-none mb-12 relative flex items-center">
            <div class="animate-marquee whitespace-nowrap flex gap-12 text-xs md:text-sm font-bold text-gray-700 tracking-wider">
                <span>${marquee}</span><span>${marquee}</span><span>${marquee}</span>
            </div>
        </section>

        <!-- Section 3: Portfolio Bento Grid -->
        <section class="w-full max-w-[1280px] py-24 md:py-32 flex flex-col gap-12 border-t border-gray-200/60" id="portfolio">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 w-full">
                <div><h2 class="text-3xl md:text-5xl font-extrabold tracking-tighter text-gray-950" data-i18n="featuredWorks">代表作品</h2></div>
                <div id="portfolio-tabs-container" class="flex overflow-x-auto pb-2 hide-scrollbar gap-3 w-full md:w-auto">${categoryTabsHtml}</div>
            </div>
            <div id="project-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
                ${projectCardsHtml}
            </div>
            <div class="flex justify-center mt-6">
                <button id="load-more-btn" class="px-8 py-4 rounded-full text-xs font-bold tracking-wide border border-gray-300 text-gray-900 bg-white/70 backdrop-blur-md shadow-sm hover:border-black transition-colors" style="display:${projects.length > 6 ? 'block' : 'none'};" data-i18n="loadMore">加载更多作品</button>
            </div>
        </section>

        <!-- Section 4: Bento Service Blueprint -->
        <section class="w-full max-w-[1280px] py-24 md:py-32 flex flex-col gap-12 border-t border-gray-200/60" id="services">
            <div class="max-w-xl">
                <h2 class="text-3xl md:text-5xl font-extrabold tracking-tighter text-gray-950 mb-4" data-i18n="servicesTitle">服务版图</h2>
                <p class="text-gray-500 text-xs md:text-sm leading-relaxed" data-i18n="servicesSubtitle">融合前沿人工神经网络与深厚动效底蕴，全方位赋能商业内容创作。</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 w-full mt-6">
                <div class="md:col-span-8 bg-white border border-gray-200/80 rounded-[2rem] p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px] md:h-[400px]">
                    <div class="flex items-start justify-between"><span class="material-symbols-outlined text-[40px] text-gray-900">psychology</span><span class="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">GEN-AI</span></div>
                    <div><h3 class="text-2xl font-bold text-gray-950 mb-3" data-i18n="serviceATitle">生成式 AI 视觉探索</h3><p class="text-gray-500 text-xs md:text-sm leading-relaxed max-w-2xl" data-i18n="serviceADesc">使用即梦、可灵、Midjourney 等模型进行概念艺术设计与高级扩展镜头生成。打破传统拍摄的物理限制，以十倍产能开发出具有强视觉震撼力的次世代多媒体画卷。</p></div>
                </div>
                <div class="md:col-span-4 bg-white border border-gray-200/80 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px] md:h-[400px]">
                    <div class="flex items-start justify-between"><span class="material-symbols-outlined text-[40px] text-gray-900">animation</span><span class="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">AE MOTION</span></div>
                    <div><h3 class="text-xl font-bold text-gray-950 mb-3" data-i18n="serviceBTitle">精细化 MG 动画</h3><p class="text-gray-500 text-xs md:text-sm leading-relaxed" data-i18n="serviceBDesc">专注于 After Effects 缓动速度曲线的极致调优、三维层级合成与复杂表达式的深度应用。以丝滑、精细的微动效设计，深度赋能移动 UI 与商业动态演示。</p></div>
                </div>
                <div class="md:col-span-4 bg-white border border-gray-200/80 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px] md:h-[400px]">
                    <div class="flex items-start justify-between"><span class="material-symbols-outlined text-[40px] text-gray-900">trending_up</span><span class="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">TIKTOK ADS</span></div>
                    <div><h3 class="text-xl font-bold text-gray-950 mb-3" data-i18n="serviceCTitle">跨境电商信息流</h3><p class="text-gray-500 text-xs md:text-sm leading-relaxed" data-i18n="serviceCDesc">专注海外 TikTok/Meta 投放视频的制作。针对北美与东南亚市场进行高转化、高留存视听节奏设计，打磨前三秒黄金抓眼钩子，全面激活商业转化。</p></div>
                </div>
                <div class="md:col-span-8 bg-white border border-gray-200/80 rounded-[2rem] p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[360px] md:h-[400px]">
                    <div class="flex items-start justify-between"><span class="material-symbols-outlined text-[40px] text-gray-900">palette</span><span class="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">DAVINCI</span></div>
                    <div><h3 class="text-2xl font-bold text-gray-950 mb-3" data-i18n="serviceDTitle">商业广告级别调色与精剪</h3><p class="text-gray-500 text-xs md:text-sm leading-relaxed max-w-2xl" data-i18n="serviceDDesc">提供达芬奇（DaVinci Resolve）全流程色彩科学服务。结合影视级声画对齐卡点节奏，让每一帧色彩传递品牌的情绪，打造具备高级院线质感的数字商业广告片。</p></div>
                </div>
            </div>
        </section>

        <!-- Section 5: Metrics & Trust Wall -->
        <section class="w-full max-w-[1280px] py-24 md:py-32 flex flex-col gap-16 border-t border-gray-200/60" id="trust-wall">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full">
                <div class="flex flex-col gap-2">
                    <span id="stat-a-value" class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-950 text-gradient">${esc(hc.home_stat_a_value)}</span>
                    <span class="text-xs font-bold text-gray-700 uppercase tracking-widest" data-i18n="statATitle">${esc(hc.home_stat_a_label)}</span>
                    <span class="text-[10px] text-gray-400" data-i18n="statADesc">${esc(hc.home_stat_a_desc)}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span id="stat-b-value" class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-950 text-gradient">${esc(hc.home_stat_b_value)}</span>
                    <span class="text-xs font-bold text-gray-700 uppercase tracking-widest" data-i18n="statBTitle">${esc(hc.home_stat_b_label)}</span>
                    <span class="text-[10px] text-gray-400" data-i18n="statBDesc">${esc(hc.home_stat_b_desc)}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span id="stat-c-value" class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-950 text-gradient">${esc(hc.home_stat_c_value)}</span>
                    <span class="text-xs font-bold text-gray-700 uppercase tracking-widest" data-i18n="statCTitle">${esc(hc.home_stat_c_label)}</span>
                    <span class="text-[10px] text-gray-400" data-i18n="statCDesc">${esc(hc.home_stat_c_desc)}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <span id="stat-d-value" class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-950 text-gradient">${esc(hc.home_stat_d_value)}</span>
                    <span class="text-xs font-bold text-gray-700 uppercase tracking-widest" data-i18n="statDTitle">${esc(hc.home_stat_d_label)}</span>
                    <span class="text-[10px] text-gray-400" data-i18n="statDDesc">${esc(hc.home_stat_d_desc)}</span>
                </div>
            </div>
            <div class="border-t border-gray-200/40 pt-12 w-full">
                <div class="flex flex-wrap items-center justify-around gap-6 opacity-30 grayscale select-none pointer-events-none">
                    <span class="font-bold text-sm tracking-widest text-gray-600 uppercase">Brand Agency</span>
                    <span class="font-bold text-sm tracking-widest text-gray-600 uppercase">TikTok Adspower</span>
                    <span class="font-bold text-sm tracking-widest text-gray-600 uppercase">GenAI Lab</span>
                    <span class="font-bold text-sm tracking-widest text-gray-600 uppercase">MG Studio</span>
                    <span class="font-bold text-sm tracking-widest text-gray-600 uppercase">DaVinci Partner</span>
                </div>
            </div>
        </section>

        <!-- Section 6: Contact -->
        <section class="w-full max-w-[1280px] py-24 md:py-32 flex flex-col lg:flex-row justify-between gap-16 border-t border-gray-200/60" id="contact">
            <div class="flex flex-col max-w-xl gap-8">
                <h2 class="text-4xl sm:text-6xl font-extrabold tracking-tighter text-gray-950 leading-[1.1]" data-i18n="contactHeadline">一起做一个更会动的想法。</h2>
                <p class="text-gray-500 text-xs md:text-sm leading-relaxed" data-i18n="contactSubtitle">承接各类动态视觉、AI创意广告及多媒体合作。期待与您打造非凡之作。</p>
                <div class="flex flex-col sm:flex-row gap-4 mt-4">
                    <a id="email-link" href="mailto:${esc(contactEmail)}" class="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 justify-center sm:w-60">
                        <span class="material-symbols-outlined text-[18px]">mail</span><span id="email-text">${esc(contactEmail)}</span>
                    </a>
                    <button id="wechat-btn" class="px-8 py-4 rounded-full text-xs font-semibold border border-gray-300 text-gray-950 hover:border-black hover:bg-white/40 transition-all flex items-center gap-1.5 active:scale-95 bg-white/20 backdrop-blur-sm justify-center sm:w-60">
                        <span class="material-symbols-outlined text-[18px]">chat</span><span id="wechat-text">微信: ${esc(contactWechat)}</span>
                    </button>
                </div>
            </div>
            <div class="w-full lg:max-w-lg bg-white/60 backdrop-blur-md border border-gray-200/80 p-8 rounded-[2rem] shadow-sm flex flex-col gap-6 text-left relative">
                <h3 class="text-xl font-extrabold text-gray-950 tracking-tight flex items-center gap-2"><span class="material-symbols-outlined text-[22px]">edit_note</span><span>提交合作意向</span></h3>
                <form id="coop-form" class="flex flex-col gap-5">
                    <div class="flex flex-col gap-1.5">
                        <label for="coop-name" class="text-xs font-bold text-gray-700 tracking-wider">您的姓名 / 称呼</label>
                        <input type="text" id="coop-name" required placeholder="例如：张先生 / 某品牌负责人" class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:border-black focus:ring-0 text-sm placeholder:text-gray-400 transition-colors"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold text-gray-700 tracking-wider">合作类型 (可多选)</label>
                        <div class="flex flex-wrap gap-2.5 mt-1">
                            <button type="button" data-value="求职机会" class="coop-type-pill px-4 py-2 rounded-full text-xs font-semibold border border-gray-200 bg-white/40 text-gray-600 hover:border-gray-400 select-none transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1"><span class="material-symbols-outlined text-[14px] hidden">check</span><span>求职机会</span></button>
                            <button type="button" data-value="项目合作" class="coop-type-pill px-4 py-2 rounded-full text-xs font-semibold border border-gray-200 bg-white/40 text-gray-600 hover:border-gray-400 select-none transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1"><span class="material-symbols-outlined text-[14px] hidden">check</span><span>项目合作</span></button>
                            <button type="button" data-value="交流学习" class="coop-type-pill px-4 py-2 rounded-full text-xs font-semibold border border-gray-200 bg-white/40 text-gray-600 hover:border-gray-400 select-none transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1"><span class="material-symbols-outlined text-[14px] hidden">check</span><span>交流学习</span></button>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label for="coop-message" class="text-xs font-bold text-gray-700 tracking-wider">需求留言 / 合作详情</label>
                        <textarea id="coop-message" rows="4" required placeholder="请简单描述您的想法或项目需求..." class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:border-black focus:ring-0 text-sm placeholder:text-gray-400 transition-colors resize-none"></textarea>
                    </div>
                    <button type="submit" id="coop-submit-btn" class="w-full bg-black text-white hover:bg-gray-800 py-3.5 rounded-2xl text-xs font-bold tracking-wider hover:-translate-y-0.5 transition-all duration-200 active:scale-95 mt-2 flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[16px]">send</span><span>提交合作意向</span></button>
                </form>
                <div id="coop-success-modal" class="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center text-center p-8 opacity-0 pointer-events-none transition-opacity duration-300 z-10">
                    <div class="w-14 h-14 rounded-full bg-green-50 border border-green-100 text-green-600 flex items-center justify-center shadow-inner mb-4 animate-bounce"><span class="material-symbols-outlined text-[32px]">check</span></div>
                    <h4 class="text-lg font-bold text-gray-950">提交成功！</h4>
                    <p class="text-xs text-gray-500 max-w-[240px] leading-relaxed mt-2">非常感谢您的合作意向。我会尽快阅读您的留言并与您取得联系。</p>
                    <button type="button" id="close-success-btn" class="mt-6 px-6 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors active:scale-95">好的</button>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="w-full py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-[#FDFBF7] border-t border-gray-200/80 mt-auto">
        <div class="font-extrabold text-xl text-gray-950 tracking-tighter">XiaoXi Studio</div>
        <p class="text-xs text-gray-500 text-center md:text-left max-w-md leading-relaxed" data-i18n="footerTagline">© 2024 XiaoXi Studio. 以理性的精确与感性的灵魂，雕琢每一帧数字化体验。</p>
        <div class="flex gap-6">
            <a href="/privacy" class="text-xs text-gray-500 hover:text-gray-900 transition-colors" data-i18n="footerPrivacy">隐私政策</a>
            <a href="/terms" class="text-xs text-gray-500 hover:text-gray-900 transition-colors" data-i18n="footerTerms">服务条款</a>
        </div>
    </footer>

    <!-- Toast -->
    <div id="toast" class="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white text-xs font-semibold px-5 py-3 rounded-full shadow-lg opacity-0 pointer-events-none transition-all duration-300 flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px] text-green-400">check_circle</span><span id="toast-msg">已复制 WeChat ID!</span>
    </div>

    <!-- Video Modal -->
    <div id="video-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/40 backdrop-blur-md transition-opacity duration-300 opacity-0">
        <div class="bg-white rounded-3xl max-w-2xl w-[90%] p-6 relative shadow-2xl transition-all transform scale-95 duration-300 opacity-0" id="modal-content">
            <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-50 flex items-center justify-center p-1 rounded-full bg-gray-100"><span class="material-symbols-outlined">close</span></button>
            <div id="modal-media-container" class="w-full aspect-video rounded-2xl overflow-hidden bg-black mb-4 flex items-center justify-center"></div>
            <h3 id="modal-title" class="text-xl font-bold text-gray-900 mb-2"></h3>
            <p id="modal-description" class="text-sm text-gray-500 leading-relaxed"></p>
        </div>
    </div>

    <!-- SSR Embedded Data for Client-Side Hydration -->
    <script id="ssr-data" type="application/json">${ssrJson}</script>

    <!-- Client-Side Interactive Script -->
    <script type="module">
        import { dataService } from '/dataService.js';

        const TRANSLATIONS = {
            "zh-CN": {
                navHome:"首页",navWorks:"作品",navAbout:"关于",navToolkit:"技能",navContact:"联系",downloadCV:"下载简历",
                heroTitleLine1:"无限进步",heroTitleLine2:"Infinite Progress",heroSubtitle:"精细且富有灵魂地打造数字化体验。将创意视觉与前沿 AI 工作流相融合，呈现非凡的视觉叙事。",
                ctaWorks:"查看作品",ctaContact:"联系合作",featuredWorks:"代表作品",catAll:"全部",loadMore:"加载更多作品",
                contactHeadline:"一起做一个更会动的想法。",contactSubtitle:"承接各类动态视觉、AI创意广告及多媒体合作。期待与您打造非凡之作。",
                footerTagline:"© 2024 XiaoXi Studio. 以理性的精确与感性的灵魂，雕琢每一帧数字化体验。",footerPrivacy:"隐私政策",footerTerms:"服务条款",
                copied:"已复制 WeChat ID!",copyWeChat:"微信: ",
                servicesTitle:"服务版图",servicesSubtitle:"融合前沿人工神经网络与深厚动效底蕴，全方位赋能商业内容创作。",
                serviceATitle:"生成式 AI 视觉探索",serviceADesc:"使用即梦、可灵、Midjourney 等模型进行概念艺术设计与高级扩展镜头生成。打破传统拍摄的物理限制，以十倍产能开发出具有强视觉震撼力的次世代多媒体画卷。",
                serviceBTitle:"精细化 MG 动画",serviceBDesc:"专注于 After Effects 缓动速度曲线的极致调优、三维层级合成与复杂表达式的深度应用。以丝滑、精细的微动效设计，深度赋能移动 UI 与商业动态演示。",
                serviceCTitle:"跨境电商信息流",serviceCDesc:"专注海外 TikTok/Meta 投放视频的制作。针对北美与东南亚市场进行高转化、高留存视听节奏设计，打磨前三秒黄金抓眼钩子，全面激活商业转化。",
                serviceDTitle:"商业广告级别调色与精剪",serviceDDesc:"提供达芬奇（DaVinci Resolve）全流程色彩科学服务。结合影视级声画对齐卡点节奏，让每一帧色彩传递品牌的情绪，打造具备高级院线质感的数字商业广告片。",
                statATitle:"覆盖行业项目",statADesc:"跨不同数字化领域的丰富实战积累",
                statBTitle:"AI 催化产能提升",statBDesc:"深度集成智能神经网络提速创作",
                statCTitle:"跨境电商高留存率",statCDesc:"打磨金字塔留存节奏与黄金钩子",
                statDTitle:"全球全天候自由协作",statDDesc:"全时区无缝对接，高效无间合作"
            },
            "en-US": {
                navHome:"Home",navWorks:"Works",navAbout:"About",navToolkit:"Toolkit",navContact:"Contact",downloadCV:"Download CV",
                heroTitleLine1:"Infinite Progress",heroTitleLine2:"无限进步",heroSubtitle:"Crafting digital experiences with precision and soul. Blending creative vision with cutting-edge AI workflows.",
                ctaWorks:"View Works",ctaContact:"Let's Talk",featuredWorks:"Featured Works",catAll:"All",loadMore:"Load More Projects",
                contactHeadline:"Let's craft motion out of ideas.",contactSubtitle:"Available for freelance opportunities and collaborative projects.",
                footerTagline:"© 2024 XiaoXi Studio. Crafting digital experiences with precision and soul.",footerPrivacy:"Privacy Policy",footerTerms:"Terms of Service",
                copied:"WeChat ID Copied!",copyWeChat:"WeChat ID: ",
                servicesTitle:"Services",servicesSubtitle:"Merging neural networks with core motion design principles to supercharge digital storytelling.",
                serviceATitle:"Generative AI Vision",serviceADesc:"Harnessing Midjourney, Keling, and Jimeng models for rapid concept generation and visual extensions.",
                serviceBTitle:"MG Motion Design",serviceBDesc:"Polishing After Effects keyframe curves, compositing, and dynamic UI animations.",
                serviceCTitle:"E-commerce Stream",serviceCDesc:"Creating highly engaging ads for TikTok and Meta. Hook viewers within the first 3 seconds.",
                serviceDTitle:"Color Grading & Editing",serviceDDesc:"Full-pipeline DaVinci Resolve color correction and commercial styling.",
                statATitle:"Industries Covered",statADesc:"Diverse projects across digital platforms",
                statBTitle:"AI Capacity Uplift",statBDesc:"Deeply integrated smart workflow pipelines",
                statCTitle:"TikTok High Retention",statCDesc:"Optimized pacing structures and hook strategies",
                statDTitle:"24/7 Global Collaboration",statDDesc:"Working across timezones seamlessly"
            }
        };
        const CATEGORY_TRANSLATIONS = {
            "zh-CN":{creative:"创意视频",tvc:"商业广告",mg:"动态图形",tiktok:"跨境流媒体"},
            "en-US":{creative:"Creative Video",tvc:"Commercial TVC",mg:"Motion Graphics",tiktok:"TikTok Stream"}
        };

        function getCategoryDisplayName(cat, lang) { return (CATEGORY_TRANSLATIONS[lang] && CATEGORY_TRANSLATIONS[lang][cat.slug]) || cat.name; }
        function getProjectCategoryName(project, lang) { return (CATEGORY_TRANSLATIONS[lang] && CATEGORY_TRANSLATIONS[lang][project.categorySlug]) || project.category; }

        // Read SSR-embedded data (zero fetch required for initial render)
        const ssrData = JSON.parse(document.getElementById('ssr-data').textContent);
        let categoriesData = ssrData.categories || [];
        let projectsData = ssrData.projects || [];
        let siteConfigs = ssrData.homeConfigs || {};
        let configData = {};
        let activeCategory = "全部";
        let currentLang = "zh-CN";
        let visibleCount = 6;

        window.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const filterParam = urlParams.get('filter');
            if (filterParam) { activeCategory = filterParam; renderCategoriesUI(); renderGrid(); }

            // Load legacy KV config (for download CV link etc.)
            try { configData = await dataService.getConfig(); } catch {}

            setupInteractiveEvents();
            updateLanguageUI();

            if (filterParam) {
                setTimeout(() => {
                    const ps = document.getElementById('portfolio');
                    if (ps) ps.scrollIntoView({ behavior:'smooth' });
                }, 200);
            }
        });

        function renderCategoriesUI() {
            const dropdown = document.getElementById('nav-dropdown-container');
            const tabs = document.getElementById('portfolio-tabs-container');
            if (dropdown) {
                dropdown.innerHTML = categoriesData.map(cat => {
                    const dn = getCategoryDisplayName(cat, currentLang);
                    return \`<a href="/?filter=\${cat.slug}#portfolio" data-filter="\${cat.slug}" class="dropdown-filter-btn w-full text-left px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group/item"><span class="text-xs font-semibold text-gray-700 group-hover/item:text-gray-950">\${dn}</span><span class="text-[9px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full uppercase">\${cat.badge||cat.slug}</span></a>\`;
                }).join('');
            }
            if (tabs) {
                const allText = currentLang==='zh-CN'?'全部':'All';
                tabs.innerHTML = \`<button data-filter="全部" class="category-tab-btn px-5 py-2.5 rounded-full text-xs \${activeCategory==='全部'?'font-bold bg-black text-white shadow-sm':'font-semibold text-gray-500 hover:text-gray-950 hover:bg-white/80 border border-transparent hover:border-gray-200'} whitespace-nowrap">\${allText}</button>\` +
                    categoriesData.map(cat => {
                        const dn = getCategoryDisplayName(cat, currentLang);
                        const isA = activeCategory===cat.slug;
                        return \`<button data-filter="\${cat.slug}" class="category-tab-btn px-5 py-2.5 rounded-full text-xs \${isA?'font-bold bg-black text-white shadow-sm':'font-semibold text-gray-500 hover:text-gray-950 hover:bg-white/80 border border-transparent hover:border-gray-200'} whitespace-nowrap">\${dn}</button>\`;
                    }).join('');
            }
        }

        function renderGrid() {
            const grid = document.getElementById('project-grid');
            grid.innerHTML = "";
            let filtered = projectsData;
            if (activeCategory !== "全部" && activeCategory !== "all") {
                filtered = projectsData.filter(p => p.categorySlug === activeCategory || p.category_slug === activeCategory);
            }
            const visibleItems = filtered.slice(0, visibleCount);
            if (visibleItems.length === 0) {
                grid.innerHTML = \`<div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400"><span class="material-symbols-outlined text-[48px] mb-3">folder_open</span><span class="text-sm font-medium">No projects found in this category.</span></div>\`;
                document.getElementById('load-more-btn').style.display='none'; return;
            }
            visibleItems.forEach((project, index) => {
                const card = document.createElement('div');
                let gc = "group relative rounded-[2rem] overflow-hidden bg-white border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-500 flex flex-col h-[520px] ";
                gc += (index===0||index===3) ? "col-span-1 md:col-span-2" : "col-span-1";
                card.className = gc;
                const sn = String(project.sequence_id || (index+1)).padStart(2,'0');
                let mc;
                if (project.mediaType === 'video') {
                    mc = \`<div class="h-2/3 w-full relative overflow-hidden bg-gray-50 border-b border-gray-100/60"><video class="w-full h-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out" muted loop autoplay playsinline preload="metadata"><source src="\${project.mediaUrl}" type="video/mp4"></video><div class="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[9px] font-bold text-white flex items-center gap-1 select-none"><span class="material-symbols-outlined text-[12px] animate-pulse text-red-400">videocam</span>VIDEO preview</div></div>\`;
                } else {
                    mc = \`<div class="h-2/3 w-full relative overflow-hidden bg-gray-50 border-b border-gray-100/60"><img src="\${project.mediaUrl}" class="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out" alt="\${project.title}" loading="lazy"></div>\`;
                }
                const cdn = getProjectCategoryName(project, currentLang);
                card.innerHTML = \`<div class="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 px-3.5 py-1 rounded-full text-[10px] font-bold text-gray-900 shadow-sm">\${sn}</div>\${mc}<div class="p-6 md:p-8 h-1/3 flex flex-col justify-between bg-white relative"><div><div class="flex items-center gap-2 mb-2"><span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">\${cdn}</span></div><h3 class="text-xl md:text-2xl font-bold text-gray-950 mb-1 group-hover:text-gray-700 transition-colors">\${project.title}</h3><p class="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2">\${project.description}</p></div><button class="open-detail-btn inline-flex items-center gap-1.5 text-xs font-bold text-gray-950 hover:text-gray-600 uppercase tracking-widest mt-4 transition-colors" data-id="\${project.id}"><span>查看详情</span><span class="material-symbols-outlined text-[15px] transform group-hover:translate-x-1 transition-transform">arrow_forward</span></button></div>\`;
                grid.appendChild(card);
            });
            const lmb = document.getElementById('load-more-btn');
            lmb.style.display = filtered.length > visibleCount ? 'block' : 'none';
        }

        function updateLanguageUI() {
            const dict = TRANSLATIONS[currentLang];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) {
                    if (key==='contactHeadline') { el.innerHTML = currentLang==='zh-CN' ? '一起做一个更会动的<span class="text-gradient">想法。</span>' : 'Let\\'s craft motion out of <span class="text-gradient">ideas.</span>'; }
                    else { el.textContent = dict[key]; }
                }
            });
            const lbt = document.querySelector('#lang-btn span:not(.material-symbols-outlined)');
            if (lbt) lbt.textContent = currentLang==="zh-CN"?"English":"中文";
            updateWeChatBtnText();
            renderCategoriesUI();
            renderGrid();
        }

        function updateWeChatBtnText() {
            const wt = document.getElementById('wechat-text');
            if (wt) {
                const prefix = TRANSLATIONS[currentLang].copyWeChat;
                const id = siteConfigs.contact_studio_wechat || ssrData.contactWechat || configData.WECHAT_ID || "XiaoXi_Design";
                wt.textContent = \`\${prefix}\${id}\`;
            }
        }

        function setupInteractiveEvents() {
            document.addEventListener('click', (e) => {
                const closestLink = e.target.closest('a');
                if (closestLink) { const href = closestLink.getAttribute('href'); if (href && href.startsWith('/')) return; }
                const wa = e.target.closest('a[href="#portfolio"]');
                if (wa) { e.preventDefault(); const ts = document.getElementById('portfolio'); if (ts) window.scrollTo({top:ts.offsetTop-100,behavior:'smooth'}); return; }
                const db = e.target.closest('.open-detail-btn') || (closestLink && closestLink.classList.contains('open-detail-btn'));
                if (db) { e.preventDefault(); const pid = db.getAttribute('data-id'); if (pid) openVideoModal(pid); return; }
            });
            const wnb = document.getElementById('nav-link-works');
            if (wnb) wnb.addEventListener('click', e => { e.preventDefault(); const ps = document.getElementById('portfolio'); if (ps) ps.scrollIntoView({behavior:'smooth'}); });
            const hvb = document.getElementById('hero-view-works-btn');
            if (hvb) hvb.addEventListener('click', () => { const ps = document.getElementById('portfolio'); if (ps) ps.scrollIntoView({behavior:'smooth'}); });
            const tc = document.getElementById('portfolio-tabs-container');
            if (tc) tc.addEventListener('click', e => {
                const btn = e.target.closest('.category-tab-btn');
                if (btn) {
                    tc.querySelectorAll('.category-tab-btn').forEach(b => { b.className="category-tab-btn px-5 py-2.5 rounded-full text-xs font-semibold text-gray-500 hover:text-gray-950 hover:bg-white/80 transition-all border border-transparent hover:border-gray-200 whitespace-nowrap"; });
                    btn.className="category-tab-btn px-5 py-2.5 rounded-full text-xs font-bold transition-all bg-black text-white shadow-sm whitespace-nowrap";
                    activeCategory = btn.getAttribute('data-filter'); visibleCount=6; renderGrid();
                }
            });
            const dc = document.getElementById('nav-dropdown-container');
            if (dc) dc.addEventListener('click', e => {
                const btn = e.target.closest('.dropdown-filter-btn');
                if (btn) { e.preventDefault(); const f=btn.getAttribute('data-filter'); const ps=document.getElementById('portfolio'); if(ps) ps.scrollIntoView({behavior:'smooth'}); const tt=document.querySelector(\`.category-tab-btn[data-filter="\${f}"]\`); if(tt) tt.click(); }
            });
            document.getElementById('load-more-btn').addEventListener('click', () => { visibleCount+=3; renderGrid(); });
            document.getElementById('lang-btn').addEventListener('click', () => { currentLang = currentLang==="zh-CN"?"en-US":"zh-CN"; updateLanguageUI(); });
            document.getElementById('wechat-btn').addEventListener('click', async () => {
                const wid = siteConfigs.contact_studio_wechat || ssrData.contactWechat || configData.WECHAT_ID || "XiaoXi_Design";
                try { await navigator.clipboard.writeText(wid); showToast(TRANSLATIONS[currentLang].copied); } catch { showToast("WeChat ID: "+wid); }
            });
            const coopForm = document.getElementById('coop-form');
            const pills = document.querySelectorAll('.coop-type-pill');
            const successModal = document.getElementById('coop-success-modal');
            const closeSuccessBtn = document.getElementById('close-success-btn');
            const selectedTypes = new Set();
            pills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const v = pill.getAttribute('data-value');
                    const ci = pill.querySelector('.material-symbols-outlined');
                    if (selectedTypes.has(v)) { selectedTypes.delete(v); pill.classList.remove('border-black','bg-black','text-white'); pill.classList.add('border-gray-200','bg-white/40','text-gray-600'); if(ci) ci.classList.add('hidden'); }
                    else { selectedTypes.add(v); pill.classList.add('border-black','bg-black','text-white'); pill.classList.remove('border-gray-200','bg-white/40','text-gray-600'); if(ci) ci.classList.remove('hidden'); }
                });
            });
            if (coopForm) coopForm.addEventListener('submit', e => { e.preventDefault(); successModal.classList.remove('opacity-0','pointer-events-none'); successModal.classList.add('opacity-100','pointer-events-auto'); });
            if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', () => {
                successModal.classList.remove('opacity-100','pointer-events-auto'); successModal.classList.add('opacity-0','pointer-events-none');
                if(coopForm) coopForm.reset(); selectedTypes.clear();
                pills.forEach(p => { p.classList.remove('border-black','bg-black','text-white'); p.classList.add('border-gray-200','bg-white/40','text-gray-600'); const ci=p.querySelector('.material-symbols-outlined'); if(ci) ci.classList.add('hidden'); });
            });
            const cmb = document.getElementById('close-modal-btn');
            if (cmb) cmb.addEventListener('click', closeModal);
            const modal = document.getElementById('video-modal');
            if (modal) modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
            window.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });
        }

        function openModal(project) {
            const modal = document.getElementById('video-modal');
            const mc = document.getElementById('modal-content');
            const mmc = document.getElementById('modal-media-container');
            const mt = document.getElementById('modal-title');
            const md = document.getElementById('modal-description');
            if (!modal||!mc||!mmc||!mt||!md) return;
            if (project.mediaType==='video') { mmc.innerHTML=\`<video class="w-full h-full object-cover" controls autoplay playsinline><source src="\${project.mediaUrl}" type="video/mp4"></video>\`; }
            else { mmc.innerHTML=\`<img src="\${project.mediaUrl}" class="w-full h-full object-cover" alt="\${project.title}">\`; }
            mt.textContent=project.title; md.textContent=project.description;
            modal.classList.remove('hidden'); modal.classList.add('flex'); void modal.offsetHeight;
            modal.classList.remove('opacity-0'); modal.classList.add('opacity-100');
            mc.classList.remove('scale-95','opacity-0'); mc.classList.add('scale-100','opacity-100');
        }

        function openVideoModal(pid) { const id=parseInt(pid,10); const p=projectsData.find(x=>x.id===id); if(p) openModal(p); }

        function closeModal() {
            const modal=document.getElementById('video-modal'); const mc=document.getElementById('modal-content'); const mmc=document.getElementById('modal-media-container');
            if(!modal||!mc||!mmc) return;
            modal.classList.remove('opacity-100'); modal.classList.add('opacity-0');
            mc.classList.remove('scale-100','opacity-100'); mc.classList.add('scale-95','opacity-0');
            setTimeout(()=>{ modal.classList.remove('flex'); modal.classList.add('hidden'); mmc.innerHTML=''; },300);
        }

        function showToast(msg) {
            const toast=document.getElementById('toast'); const tm=document.getElementById('toast-msg');
            tm.textContent=msg; toast.classList.remove('opacity-0','pointer-events-none'); toast.classList.add('opacity-100');
            setTimeout(()=>{ toast.classList.remove('opacity-100'); toast.classList.add('opacity-0','pointer-events-none'); },2500);
        }
    </script>
</body>
</html>`;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
