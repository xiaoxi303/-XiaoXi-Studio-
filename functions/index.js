
// ⚡ 动态首页 SSR 渲染引擎 - functions/index.js
// 彻底替代静态 index.html，全站数据驱动

const MOCK_SITE_CONFIGS = {
  home_hero_title: '无限进步',
  home_hero_subtitle: '精细且富有灵魂地打造数字化体验。将创意视觉与前沿 AI 工作流相融合，呈现非凡的视觉叙事。',
  home_hero_status: 'AE + AI 辅助内容生成',
  home_hero_fields: 'AI作品 / MG动画 / TVC / 跨境电商',
  home_marquee_text: '★ XiaoXi Studio 2026 视觉探索全面启动 ★ 跨境电商 TikTok 投放视频消耗破百万 ★ AI生成式流媒体工作流深度集成 ★',
  home_stat_a_value: '30+',
  home_stat_a_label: '覆盖行业项目',
  home_stat_a_desc: '跨不同数字化领域的丰富实战积累',
  home_stat_b_value: '10x',
  home_stat_b_label: 'AI 催化产能提升',
  home_stat_b_desc: '深度集成智能神经网络提速创作',
  home_stat_c_value: '99%',
  home_stat_c_label: '跨境电商高留存率',
  home_stat_c_desc: '打磨金字塔留存节奏与黄金钩子',
  home_stat_d_value: '24/7',
  home_stat_d_label: '全球全天候自由流协作',
  home_stat_d_desc: '全时区无缝对接，高效无间合作',
  contact_studio_email: 'hello@xiaoxistudio.com',
  contact_studio_wechat: 'XiaoXi_Design'
};

const MOCK_CATEGORIES = [
  { id: 1, slug: 'all', name: '全部作品', badge: '★' },
  { id: 2, slug: 'creative', name: '创意视频', badge: 'AI' },
  { id: 3, slug: 'tvc', name: '商业广告', badge: 'TVC' },
  { id: 4, slug: 'mg', name: '动态图形', badge: 'MG' },
  { id: 5, slug: 'tiktok', name: '跨境流媒体', badge: 'TikTok' }
];

const MOCK_PROJECTS = [
  { id: 1, sequenceId: 1, title: 'Cybernetic Echoes', description: 'AI-driven concept visualization for an upcoming tech apparel brand.', categorySlug: 'creative', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&amp;fit=crop&amp;w=800&amp;q=80', detailUrl: '#' },
  { id: 2, sequenceId: 2, title: 'Flow State Motion', description: 'Abstract motion design campaign exploring fluidity and rhythm in digital spaces.', categorySlug: 'mg', mediaType: 'video', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32124-large.mp4', detailUrl: '#' },
  { id: 3, sequenceId: 3, title: 'Dreamscape TVC', description: 'Full production commercial spot blending live-action footage with stylized 3D environments.', categorySlug: 'tvc', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&amp;fit=crop&amp;w=800&amp;q=80', detailUrl: '#' },
  { id: 4, sequenceId: 4, title: 'Viral Kinetics', description: 'High-retention social media content series optimized for vertical formats.', categorySlug: 'tiktok', mediaType: 'video', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-neon-light-patterns-42340-large.mp4', detailUrl: '#' },
  { id: 5, sequenceId: 5, title: 'Chrono-Shift Showcase', description: 'A conceptual commercial depicting time manipulation.', categorySlug: 'creative', mediaType: 'video', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-spheres-and-lines-32545-large.mp4', detailUrl: '#' },
  { id: 6, sequenceId: 6, title: 'Neo-Retro Aesthetic', description: 'Styleframes and kinetic animation loops inspired by 80s synthwave.', categorySlug: 'mg', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&amp;fit=crop&amp;w=800&amp;q=80', detailUrl: '#' }
];

async function fetchDataFromDB(env) {
  try {
    const db = env.DB;
    if (!db) {
      console.log('[SSR] No DB binding, using MOCK');
      return { configs: MOCK_SITE_CONFIGS, categories: MOCK_CATEGORIES, projects: MOCK_PROJECTS };
    }

    const [configsStmt, categoriesStmt, projectsStmt] = [
      db.prepare('SELECT config_key, config_value FROM site_configs WHERE page_name = ? OR page_name = ?'),
      db.prepare('SELECT * FROM categories ORDER BY id ASC'),
      db.prepare('SELECT * FROM projects ORDER BY sequence_id ASC')
    ];
    
    const [configsResult, categoriesResult, projectsResult] = await Promise.allSettled([
      configsStmt.bind('home', 'global').all(),
      categoriesStmt.all(),
      projectsStmt.all()
    ]);

    let configs = { ...MOCK_SITE_CONFIGS };
    if (configsResult.status === 'fulfilled' &amp;&amp; configsResult.value.results) {
      configsResult.value.results.forEach(row =&gt; {
        configs[row.config_key] = row.config_value;
      });
    }

    let categories = MOCK_CATEGORIES;
    if (categoriesResult.status === 'fulfilled' &amp;&amp; categoriesResult.value.results) {
      categories = [{ id: 0, slug: 'all', name: '全部作品', badge: '★' }, ...categoriesResult.value.results];
    }

    let projects = MOCK_PROJECTS;
    if (projectsResult.status === 'fulfilled' &amp;&amp; projectsResult.value.results) {
      projects = projectsResult.value.results.map(p =&gt; ({
        id: p.id,
        sequenceId: p.sequence_id,
        title: p.title,
        description: p.description,
        categorySlug: p.category_slug,
        mediaType: p.media_type,
        mediaUrl: p.media_url,
        detailUrl: p.detail_url || '#'
      }));
    }

    return { configs, categories, projects };
  } catch (err) {
    console.error('[SSR] DB Fetch Error:', err);
    return { configs: MOCK_SITE_CONFIGS, categories: MOCK_CATEGORIES, projects: MOCK_PROJECTS };
  }
}

function renderProjects(projects) {
  return projects.map(p =&gt; {
    const mediaEl = p.mediaType === 'video' 
      ? `&lt;video class="w-full h-full object-cover" src="${p.mediaUrl}" muted loop autoplay playsinline&gt;&lt;/video&gt;`
      : `&lt;img src="${p.mediaUrl}" alt="${p.title}" class="w-full h-full object-cover" /&gt;`;
    
    return `
&lt;article class="group relative aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden cursor-pointer project-card" data-category="${p.categorySlug}" data-type="${p.mediaType}" data-url="${p.mediaUrl}"&gt;
  &lt;div class="absolute inset-0 z-10 bg-gray-900/0 group-hover:bg-gray-900/20 transition-colors duration-300"&gt;&lt;/div&gt;
  ${mediaEl}
  &lt;div class="absolute inset-x-0 bottom-0 p-6 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent translate-y-2 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-300"&gt;
    &lt;div class="flex items-center justify-between mb-1"&gt;
      &lt;h3 class="text-lg font-bold text-white tracking-wide"&gt;${p.title}&lt;/h3&gt;
      ${p.mediaType === 'video' ? '&lt;span class="px-2 py-1 bg-blue-600 text-xs font-bold text-white rounded-full"&gt;Video&lt;/span&gt;' : ''}
    &lt;/div&gt;
    &lt;p class="text-xs text-gray-300 line-clamp-1"&gt;${p.description}&lt;/p&gt;
  &lt;/div&gt;
&lt;/article&gt;`;
  }).join('');
}

function renderCategories(categories) {
  return categories.map((cat, i) =&gt; `
    &lt;button data-filter="${cat.slug}" class="filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${i === 0 ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}"&gt;
      ${cat.badge ? `&lt;span class="mr-2 text-xs opacity-60"&gt;${cat.badge}&lt;/span&gt;` : ''}
      ${cat.name}
    &lt;/button&gt;
  `).join('');
}

export async function onRequestGet(context) {
  const { env } = context;
  
  // 显式引用绑定，强制 Cloudflare 激活动态特性
  const db = env.DB;
  const r2 = env.MY_R2_BUCKET;
  
  const { configs, categories, projects } = await fetchDataFromDB(env);

  const html = `
&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;XiaoXi Studio — Creative Director &amp; Motion Designer&lt;/title&gt;
    &lt;script src="https://cdn.tailwindcss.com"&gt;&lt;/script&gt;
    &lt;link rel="preconnect" href="https://fonts.googleapis.com"&gt;
    &lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin&gt;
    &lt;link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"&gt;
    &lt;style&gt;
        body { font-family: 'Inter', sans-serif; background-color: #FDFBF7; color: #1F1F1F; }
        ::selection { background-color: #FF6B35; color: white; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body class="min-h-screen antialiased"&gt;
    &lt;div class="w-full py-3 overflow-hidden bg-gray-900 text-white"&gt;
        &lt;div class="flex whitespace-nowrap animate-marquee"&gt;
            &lt;span class="mx-8 text-sm tracking-widest uppercase opacity-80"&gt;${configs.home_marquee_text || MOCK_SITE_CONFIGS.home_marquee_text}&lt;/span&gt;
            &lt;span class="mx-8 text-sm tracking-widest uppercase opacity-80"&gt;${configs.home_marquee_text || MOCK_SITE_CONFIGS.home_marquee_text}&lt;/span&gt;
            &lt;span class="mx-8 text-sm tracking-widest uppercase opacity-80"&gt;${configs.home_marquee_text || MOCK_SITE_CONFIGS.home_marquee_text}&lt;/span&gt;
            &lt;span class="mx-8 text-sm tracking-widest uppercase opacity-80"&gt;${configs.home_marquee_text || MOCK_SITE_CONFIGS.home_marquee_text}&lt;/span&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;header class="sticky top-0 z-40 backdrop-blur-xl bg-[#FDFBF7]/80 border-b border-gray-100"&gt;
        &lt;div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"&gt;
            &lt;a href="/" class="text-2xl font-bold tracking-tighter flex items-center gap-2"&gt;
                &lt;span class="h-3 w-3 rounded-full bg-gradient-to-tr from-orange-500 to-red-500"&gt;&lt;/span&gt; XiaoXi Studio
            &lt;/a&gt;
            &lt;nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600"&gt;
                &lt;a href="/about" class="hover:text-black transition-colors"&gt;关于&lt;/a&gt;
                &lt;a href="/toolkit" class="hover:text-black transition-colors"&gt;技能&lt;/a&gt;
                &lt;a href="/contact" class="hover:text-black transition-colors"&gt;合作&lt;/a&gt;
            &lt;/nav&gt;
            &lt;a href="/admin" class="hidden md:block px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"&gt;管理后台&lt;/a&gt;
        &lt;/div&gt;
    &lt;/header&gt;

    &lt;main&gt;
        &lt;section class="max-w-7xl mx-auto px-6 pt-16 pb-24"&gt;
            &lt;div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end"&gt;
                &lt;div class="lg:col-span-8"&gt;
                    &lt;div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6"&gt;
                        &lt;span class="relative flex h-2 w-2"&gt;&lt;span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"&gt;&lt;/span&gt;&lt;span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"&gt;&lt;/span&gt;&lt;/span&gt;
                        &lt;span class="text-xs font-bold uppercase tracking-wider text-gray-500"&gt;${configs.home_hero_status || MOCK_SITE_CONFIGS.home_hero_status}&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"&gt;
                        设计驱动&lt;br&gt;
                        &lt;span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-blue-600"&gt;${configs.home_hero_title || MOCK_SITE_CONFIGS.home_hero_title}&lt;/span&gt;
                    &lt;/h1&gt;
                    &lt;p class="text-xl md:text-2xl text-gray-600 max-w-2xl font-light leading-relaxed mb-10"&gt;${configs.home_hero_subtitle || MOCK_SITE_CONFIGS.home_hero_subtitle}&lt;/p&gt;
                    &lt;div class="flex flex-wrap gap-3 mb-10"&gt;
                        ${(configs.home_hero_fields || MOCK_SITE_CONFIGS.home_hero_fields).split(' / ').map(tag =&gt; `&lt;span class="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm shadow-sm"&gt;${tag}&lt;/span&gt;`).join('')}
                    &lt;/div&gt;
                    &lt;div class="flex items-center gap-6"&gt;
                        &lt;a href="#work" class="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all hover:scale-105"&gt;浏览作品&lt;/a&gt;
                        &lt;a href="/contact" class="px-8 py-4 bg-white border border-gray-300 text-gray-900 rounded-full font-semibold text-lg hover:border-gray-900 transition-colors"&gt;联系我&lt;/a&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/section&gt;

        &lt;section class="py-16 bg-white border-y border-gray-100"&gt;
            &lt;div class="max-w-7xl mx-auto px-6"&gt;
                &lt;div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"&gt;
                    &lt;div class="p-6"&gt;&lt;div class="text-4xl md:text-5xl font-black text-orange-600 mb-2"&gt;${configs.home_stat_a_value || MOCK_SITE_CONFIGS.home_stat_a_value}&lt;/div&gt;&lt;div class="text-sm font-bold uppercase tracking-widest text-gray-400"&gt;${configs.home_stat_a_label || MOCK_SITE_CONFIGS.home_stat_a_label}&lt;/div&gt;&lt;div class="text-xs text-gray-400 mt-1"&gt;${configs.home_stat_a_desc || MOCK_SITE_CONFIGS.home_stat_a_desc}&lt;/div&gt;&lt;/div&gt;
                    &lt;div class="p-6"&gt;&lt;div class="text-4xl md:text-5xl font-black text-blue-600 mb-2"&gt;${configs.home_stat_b_value || MOCK_SITE_CONFIGS.home_stat_b_value}&lt;/div&gt;&lt;div class="text-sm font-bold uppercase tracking-widest text-gray-400"&gt;${configs.home_stat_b_label || MOCK_SITE_CONFIGS.home_stat_b_label}&lt;/div&gt;&lt;div class="text-xs text-gray-400 mt-1"&gt;${configs.home_stat_b_desc || MOCK_SITE_CONFIGS.home_stat_b_desc}&lt;/div&gt;&lt;/div&gt;
                    &lt;div class="p-6"&gt;&lt;div class="text-4xl md:text-5xl font-black text-purple-600 mb-2"&gt;${configs.home_stat_c_value || MOCK_SITE_CONFIGS.home_stat_c_value}&lt;/div&gt;&lt;div class="text-sm font-bold uppercase tracking-widest text-gray-400"&gt;${configs.home_stat_c_label || MOCK_SITE_CONFIGS.home_stat_c_label}&lt;/div&gt;&lt;div class="text-xs text-gray-400 mt-1"&gt;${configs.home_stat_c_desc || MOCK_SITE_CONFIGS.home_stat_c_desc}&lt;/div&gt;&lt;/div&gt;
                    &lt;div class="p-6"&gt;&lt;div class="text-4xl md:text-5xl font-black text-green-600 mb-2"&gt;${configs.home_stat_d_value || MOCK_SITE_CONFIGS.home_stat_d_value}&lt;/div&gt;&lt;div class="text-sm font-bold uppercase tracking-widest text-gray-400"&gt;${configs.home_stat_d_label || MOCK_SITE_CONFIGS.home_stat_d_label}&lt;/div&gt;&lt;div class="text-xs text-gray-400 mt-1"&gt;${configs.home_stat_d_desc || MOCK_SITE_CONFIGS.home_stat_d_desc}&lt;/div&gt;&lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/section&gt;

        &lt;section id="work" class="max-w-7xl mx-auto px-6 py-24"&gt;
            &lt;div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"&gt;
                &lt;div&gt;
                    &lt;span class="text-sm font-bold text-orange-600 tracking-wider uppercase mb-2 block"&gt;Selected Works&lt;/span&gt;
                    &lt;h2 class="text-3xl md:text-4xl font-bold"&gt;精选作品集&lt;/h2&gt;
                &lt;/div&gt;
                &lt;div class="flex flex-wrap gap-2" id="filters-container"&gt;
                    ${renderCategories(categories)}
                &lt;/div&gt;
            &lt;/div&gt;
            &lt;div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
                ${renderProjects(projects)}
            &lt;/div&gt;
        &lt;/section&gt;

        &lt;section class="bg-gray-900 text-white py-24"&gt;
            &lt;div class="max-w-3xl mx-auto px-6 text-center"&gt;
                &lt;h2 class="text-3xl md:text-5xl font-bold mb-6"&gt;准备好开始了吗？&lt;/h2&gt;
                &lt;p class="text-gray-400 text-lg mb-10"&gt;不管是大型的商业活动，还是一个简单的品牌影片，我都期待与你聊聊你的想法。&lt;/p&gt;
                &lt;div class="flex flex-col sm:flex-row items-center justify-center gap-6"&gt;
                    &lt;a href="mailto:${configs.contact_studio_email || MOCK_SITE_CONFIGS.contact_studio_email}" class="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-xl font-semibold"&gt;
                        &lt;svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"&gt;&lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"&gt;&lt;/path&gt;&lt;/svg&gt;
                        ${configs.contact_studio_email || MOCK_SITE_CONFIGS.contact_studio_email}
                    &lt;/a&gt;
                    &lt;a href="https://mp.weixin.qq.com/" class="flex items-center gap-2 text-green-400 hover:text-green-300 text-xl font-semibold"&gt;
                        &lt;svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"&gt;&lt;path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.111.24-.247 0-.06-.024-.12-.039-.178l-.327-1.232a.49.49 0 0 1 .177-.553C23.47 18.613 24.5 16.93 24.5 15.05c0-3.245-3.098-5.937-6.977-6.162v-.03h-.585zm-1.494 3.634c.535 0 .969.44.969.983a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.983.969-.983zm4.844 0c.535 0 .969.44.969.983a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.983.969-.983z"/&gt;&lt;/svg&gt;
                        WeChat: ${configs.contact_studio_wechat || MOCK_SITE_CONFIGS.contact_studio_wechat}
                    &lt;/a&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/section&gt;
    &lt;/main&gt;

    &lt;footer class="border-t border-gray-200 py-12"&gt;
        &lt;div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6"&gt;
            &lt;p class="text-gray-500 text-sm"&gt;© 2026 XiaoXi Studio. All rights reserved.&lt;/p&gt;
            &lt;div class="flex items-center gap-6 text-sm text-gray-400"&gt;
                &lt;a href="/privacy" class="hover:text-gray-600 transition-colors"&gt;隐私政策&lt;/a&gt;
                &lt;a href="/terms" class="hover:text-gray-600 transition-colors"&gt;服务条款&lt;/a&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/footer&gt;

    &lt;div id="video-modal" class="fixed inset-0 z-50 hidden bg-black/90 flex items-center justify-center p-4"&gt;
        &lt;button id="close-modal" class="absolute top-6 right-6 text-white hover:text-gray-300 text-4xl w-12 h-12 flex items-center justify-center"&gt;&amp;times;&lt;/button&gt;
        &lt;div class="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden"&gt;
            &lt;video id="modal-video" class="w-full h-full" controls autoplay&gt;&lt;/video&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;script&gt;
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const modal = document.getElementById('video-modal');
        const modalVideo = document.getElementById('modal-video');
        const closeModalBtn = document.getElementById('close-modal');

        filterBtns.forEach(btn =&gt; {
            btn.addEventListener('click', () =&gt; {
                const filter = btn.getAttribute('data-filter');
                filterBtns.forEach(b =&gt; { b.classList.remove('bg-gray-900', 'text-white', 'shadow-lg'); b.classList.add('bg-white', 'text-gray-600', 'hover:bg-gray-100'); });
                btn.classList.remove('bg-white', 'text-gray-600', 'hover:bg-gray-100');
                btn.classList.add('bg-gray-900', 'text-white', 'shadow-lg');
                projectCards.forEach(card =&gt; {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hidden'); card.style.display = 'block';
                    } else {
                        card.classList.add('hidden'); card.style.display = 'none';
                    }
                });
            });
        });

        projectCards.forEach(card =&gt; {
            card.addEventListener('click', () =&gt; {
                const type = card.getAttribute('data-type');
                const url = card.getAttribute('data-url');
                if (type === 'video') {
                    modalVideo.src = url; modal.classList.remove('hidden');
                }
            });
        });

        closeModalBtn.addEventListener('click', () =&gt; { modal.classList.add('hidden'); modalVideo.pause(); modalVideo.src = ''; });
        modal.addEventListener('click', (e) =&gt; { if (e.target === modal) { modal.classList.add('hidden'); modalVideo.pause(); modalVideo.src = ''; } });
    &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}

