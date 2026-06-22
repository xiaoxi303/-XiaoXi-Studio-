// dataService.js — XiaoXi Studio Environment Decoupling & CMS Data Service
// Provides unified API access for: Categories, Projects, Site Configs (CMS), File Uploads
// Automatically routes: localhost / file:// → localStorage mock  |  production → Cloudflare APIs

// ============================================================
// SECTION 1: STATIC MOCK DATA (used as fallback in all modes)
// ============================================================

const MOCK_CONFIG = {
    SYSTEM_LANG: 'zh-CN',
    ACTIVE_STATUS: 'AE + AI 辅助内容生成',
    ACTIVE_FIELDS: 'AI作品 / MG动画 / TVC / 跨境电商',
    WECHAT_ID: 'XiaoXi_Design',
    EMAIL: 'hello@xiaoxistudio.com',
    DOWNLOAD_CV_URL: '#'
};

const MOCK_CATEGORIES = [
    { id: 1, slug: 'creative', name: '创意视频',   badge: 'AI'     },
    { id: 2, slug: 'tvc',      name: '商业广告',   badge: 'TVC'    },
    { id: 3, slug: 'mg',       name: '动态图形',   badge: 'MG'     },
    { id: 4, slug: 'tiktok',   name: '跨境流媒体', badge: 'TikTok' }
];

const MOCK_PROJECTS = [
    { id: 1, sequence_id: 1, title: 'Cybernetic Echoes',     description: 'AI-driven concept visualization for an upcoming tech apparel brand. Combining Midjourney assets with advanced AE compositing.',        category_slug: 'creative', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',  detail_url: '#' },
    { id: 2, sequence_id: 2, title: 'Flow State Motion',     description: 'Abstract motion design campaign exploring fluidity and rhythm in digital spaces. Created entirely in AE with custom scripts.',         category_slug: 'mg',       media_type: 'video', media_url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32124-large.mp4',  detail_url: '#' },
    { id: 3, sequence_id: 3, title: 'Dreamscape TVC',        description: 'Full production commercial spot blending live-action footage with stylized 3D environments and 2D VFX elements.',                      category_slug: 'tvc',      media_type: 'image', media_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',  detail_url: '#' },
    { id: 4, sequence_id: 4, title: 'Viral Kinetics',        description: 'High-retention social media content series optimized for vertical formats. Heavy use of kinetic typography and seamless transitions.', category_slug: 'tiktok',   media_type: 'video', media_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-neon-light-patterns-42340-large.mp4', detail_url: '#' },
    { id: 5, sequence_id: 5, title: 'Chrono-Shift Showcase', description: 'A conceptual commercial depicting time manipulation. Integrated Stable Diffusion generated keyframes with EbSynth styling.',           category_slug: 'creative', media_type: 'video', media_url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-spheres-and-lines-32545-large.mp4', detail_url: '#' },
    { id: 6, sequence_id: 6, title: 'Neo-Retro Aesthetic',   description: 'Styleframes and kinetic animation loops inspired by 80s synthwave, adapted for high-end luxury retail display installations.',         category_slug: 'mg',       media_type: 'image', media_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80', detail_url: '#' }
];

// Full-site CMS mock: covers every config_key across all pages
// This object is the single source of truth for local dev / offline mode
const MOCK_SITE_CONFIGS = {
    // ── Home page ──────────────────────────────────────────────────────────────
    home_hero_title:    '无限进步',
    home_hero_subtitle: '精细且富有灵魂地打造数字化体验。将创意视觉与前沿 AI 工作流相融合，呈现非凡的视觉叙事。',
    home_hero_status:   'AE + AI 辅助内容生成',
    home_hero_fields:   'AI作品 / MG动画 / TVC / 跨境电商',
    home_marquee_text:  '★ XiaoXi Studio 2026 视觉探索全面启动 ★ 跨境电商 TikTok 投放视频消耗破百万 ★ AI生成式流媒体工作流深度集成 ★ 传统 MG 动效精细化定制，感受帧帧极致打磨 ★ 商业 TVC 全流程执行，从脚本到交付一站直达 ★',
    home_stat_a_value:  '30+',
    home_stat_a_label:  '覆盖行业项目',
    home_stat_a_desc:   '跨不同数字化领域的丰富实战积累',
    home_stat_b_value:  '10x',
    home_stat_b_label:  'AI 催化产能提升',
    home_stat_b_desc:   '深度集成智能神经网络提速创作',
    home_stat_c_value:  '99%',
    home_stat_c_label:  '跨境电商高留存率',
    home_stat_c_desc:   '打磨金字塔留存节奏与黄金钩子',
    home_stat_d_value:  '24/7',
    home_stat_d_label:  '全球全天候自由流协作',
    home_stat_d_desc:   '全时区无缝对接，高效无间合作',

    // ── About page ─────────────────────────────────────────────────────────────
    about_bio_name:          '小希 · XiaoXi',
    about_bio_text:          '我是一位深耕数字视觉创意领域的自由工作室主理人，专注于以 After Effects 为核心，融合 AI 工具流与商业影像制作。我相信每一帧画面都应该有灵魂，每一个动效都值得被精细打磨。从 TikTok 爆款短视频到高端品牌 TVC，我始终以理性的精确与感性的灵魂，雕琢每一帧数字化体验。',
    about_workflow_01_title: '01 · 深度需求解构',
    about_workflow_01_desc:  '与客户展开深度对话，解构品牌核心诉求与目标受众的情感触点，建立精准的视觉叙事策略框架。避免一切无效执行，从源头确保创作方向的精准与高效。',
    about_workflow_02_title: '02 · 精细制作执行',
    about_workflow_02_desc:  '以 After Effects + AI 辅助工作流为引擎，融合数据驱动的动效设计与精细化的画面质感打磨，确保每一帧输出达到商业发布标准。',
    about_workflow_03_title: '03 · 快速迭代交付',
    about_workflow_03_desc:  '基于实时反馈机制进行敏捷迭代，通过云端协作平台实现即时预览与极速交付，完整保障项目时效与品质双线并行。',
    about_timeline_json:     '[{"year":"2026","title":"TikTok 跨境投流专家","desc":"负责北美大盘跨境电商品牌全套视觉体系，单账户月度视频消耗破百万，ROI 持续领跑行业平均水平。"},{"year":"2024","title":"XiaoXi Studio 创立","desc":"创立个人数字视觉工作室，专注于 AI 辅助的创意视频制作与商业影像定制，首月即签约 3 个独立品牌合作。"},{"year":"2023","title":"Daley College 深造","desc":"赴美研修数字媒体与视觉传达，系统学习好莱坞级别的动效设计与后期制作工作流，构建全球化视野。"},{"year":"2022","title":"After Effects 深度专精","desc":"全面掌握 AE 表达式、脚本与插件生态，构建自己的高效创作模板矩阵，开始接触 AI 辅助生成工作流。"}]',

    // ── Toolkit page ───────────────────────────────────────────────────────────
    toolkit_skills_json: '[{"icon":"auto_awesome","name":"After Effects"},{"icon":"psychology","name":"Midjourney"},{"icon":"movie","name":"DaVinci Resolve"},{"icon":"smart_display","name":"Premiere Pro"},{"icon":"brush","name":"Photoshop"},{"icon":"trending_up","name":"TikTok Ads"},{"icon":"grain","name":"Stable Diffusion"},{"icon":"videocam","name":"即梦 AI"},{"icon":"animation","name":"可灵 AI"},{"icon":"tune","name":"EbSynth"},{"icon":"color_lens","name":"Illustrator"},{"icon":"3d_rotation","name":"Cinema 4D"}]',

    // ── Contact info ───────────────────────────────────────────────────────────
    contact_studio_email:        'hello@xiaoxistudio.com',
    contact_studio_wechat:       'XiaoXi_Design',
    contact_studio_wechat_qrcode: '',

    // ── Legal pages ────────────────────────────────────────────────────────────
    legal_privacy_content: '# 隐私政策\n\n**最后更新日期：2024 年 12 月 01 日**\n\nXiaoXi Studio 极度重视您的数字隐私与数据安全。\n\n## 一、信息收集范围\n\n我们收集的信息类型仅限于以下必要范围：联系表单数据、标准访问日志（匿名化处理）。本网站不使用追踪性第三方 Cookie。\n\n## 二、信息使用目的\n\n所有收集到的信息仅用于回复您的合作咨询、维护网站安全性与改善用户体验。我们绝不将您的个人信息出售或共享给未经授权的第三方。\n\n## 三、数据存储与安全\n\n所有数据托管于 Cloudflare 全球基础设施之上，享有企业级安全防护，传输中的数据通过 TLS 1.3 保护。\n\n## 四、您的权利\n\n您享有访问权、删除权和更正权。如需行使，请联系：**hello@xiaoxistudio.com**',
    legal_terms_content:    '# 服务条款\n\n**最后更新日期：2024 年 12 月 01 日**\n\n欢迎访问 XiaoXi Studio 官方网站。使用本网站即表示您同意受本条款约束。\n\n## 一、知识产权\n\n本网站所有展示作品的知识产权归 XiaoXi Studio 独家所有。未经书面授权，严禁复制或商业利用。\n\n## 二、合作条款\n\n所有商业合作项目须在正式开始前签订书面服务协议。标准付款方案为：启动前支付 50% 定金，交付验收后支付余款。\n\n## 三、免责声明\n\n展示的案例数据（如播放量、ROI 等）来源于真实项目，但不构成对未来合作结果的任何形式的担保。\n\n## 四、适用法律\n\n本条款受中华人民共和国法律管辖并依其解释。'
};

// ============================================================
// SECTION 2: ENVIRONMENT DETECTION
// ============================================================

const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '' ||
    window.location.protocol === 'file:'
);

// ============================================================
// SECTION 3: LOCAL STORAGE HELPERS
// ============================================================

const INITIAL_MOCK_CATEGORIES = MOCK_CATEGORIES;
const INITIAL_MOCK_PROJECTS   = MOCK_PROJECTS;

function getLocalCategories() {
    try {
        const stored = localStorage.getItem('xiaoxi_categories');
        if (!stored) { localStorage.setItem('xiaoxi_categories', JSON.stringify(INITIAL_MOCK_CATEGORIES)); return INITIAL_MOCK_CATEGORIES; }
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_CATEGORIES;
    } catch { return INITIAL_MOCK_CATEGORIES; }
}

function saveLocalCategories(categories) {
    try { localStorage.setItem('xiaoxi_categories', JSON.stringify(categories)); } catch {}
}

function getLocalProjects() {
    try {
        const stored = localStorage.getItem('xiaoxi_projects');
        if (!stored) { localStorage.setItem('xiaoxi_projects', JSON.stringify(INITIAL_MOCK_PROJECTS)); return INITIAL_MOCK_PROJECTS; }
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_PROJECTS;
    } catch { return INITIAL_MOCK_PROJECTS; }
}

function saveLocalProjects(projects) {
    try { localStorage.setItem('xiaoxi_projects', JSON.stringify(projects)); } catch {}
}

// Site configs local storage: stores overrides on top of MOCK_SITE_CONFIGS
function getLocalSiteConfigs() {
    try {
        const stored = localStorage.getItem('xiaoxi_site_configs');
        return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
}

function saveLocalSiteConfig(key, value) {
    try {
        const current = getLocalSiteConfigs();
        current[key] = value;
        localStorage.setItem('xiaoxi_site_configs', JSON.stringify(current));
    } catch (e) {
        console.warn('[dataService] localStorage site_configs write failed:', e);
    }
}

// ============================================================
// SECTION 4: FIELD MAPPING HELPER
// ============================================================

function mapProjectFields(p, categoriesList = []) {
    const categorySlug = p.category_slug || p.categorySlug || 'creative';
    const mediaType    = p.media_type    || p.mediaType    || 'image';
    const mediaUrl     = p.media_url     || p.mediaUrl     || '';
    const detailUrl    = p.detail_url    || p.detailUrl    || '#';
    const cat          = categoriesList.find(c => c.slug === categorySlug);
    return {
        id: p.id,
        sequence_id:  p.sequence_id || p.id,
        title:        p.title       || 'Untitled',
        description:  p.description || '',
        categorySlug, category_slug: categorySlug,
        category:     cat ? cat.name  : (p.category || '未分类'),
        badge:        cat ? cat.badge : (p.badge    || ''),
        mediaType,  media_type: mediaType,
        mediaUrl,   media_url:  mediaUrl,
        detailUrl,  detail_url: detailUrl
    };
}

// ============================================================
// SECTION 5: EXPORTED DATA SERVICE
// ============================================================

export const dataService = {

    isLocal() { return isLocal; },

    // ── Site Config CMS ─────────────────────────────────────────────────────

    /**
     * Get all site configs for a given page.
     * Returns a flat { key: value } object.
     * Local mode: merges MOCK_SITE_CONFIGS with localStorage overrides.
     * Production: fetches /api/configs?page=page_name
     */
    async getSiteConfigs(pageName) {
        if (isLocal) {
            // Build merged object: MOCK as base, localStorage overrides on top
            const base     = { ...MOCK_SITE_CONFIGS };
            const overrides = getLocalSiteConfigs();
            // Filter to only keys relevant to this page (by prefix) + any override for any key
            const pagePrefix = pageName + '_';
            const result = {};
            for (const [k, v] of Object.entries(base)) {
                if (k.startsWith(pagePrefix) || pageName === 'all') result[k] = v;
            }
            // Apply localStorage overrides (all keys, so updates in admin propagate instantly)
            for (const [k, v] of Object.entries(overrides)) {
                result[k] = v;
            }
            return result;
        }

        try {
            const res = await fetch(`/api/configs?page=${encodeURIComponent(pageName)}`);
            if (!res.ok) throw new Error(`API returned status ${res.status}`);
            const data = await res.json();
            // Fallback: merge with MOCK for any missing keys
            const fallback = {};
            const prefix   = pageName + '_';
            for (const [k, v] of Object.entries(MOCK_SITE_CONFIGS)) {
                if (k.startsWith(prefix)) fallback[k] = v;
            }
            return { ...fallback, ...data };
        } catch (err) {
            console.warn(`[dataService] getSiteConfigs('${pageName}') failed, using mock:`, err);
            const result = {};
            const prefix = pageName + '_';
            for (const [k, v] of Object.entries(MOCK_SITE_CONFIGS)) {
                if (k.startsWith(prefix)) result[k] = v;
            }
            return result;
        }
    },

    /**
     * Update a single site config key.
     * Local mode: writes to localStorage overlay — instantly visible to getSiteConfigs().
     * Production: POST to /api/configs with Basic Auth credentials.
     * @param {string} key - config_key (e.g. 'home_hero_title')
     * @param {string} value - new value
     * @param {string} [adminPassword='admin123'] - for production Basic Auth
     */
    async updateSiteConfig(key, value, adminPassword = 'admin123') {
        if (isLocal) {
            saveLocalSiteConfig(key, value);
            await new Promise(r => setTimeout(r, 30)); // simulate async
            return { success: true, key, message: 'Local config updated.' };
        }

        try {
            const credentials = btoa(`xiaoxi:${adminPassword}`);
            const res = await fetch('/api/configs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify({ key, value })
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `API returned status ${res.status}`);
            }
            return await res.json();
        } catch (err) {
            console.error('[dataService] updateSiteConfig failed:', err);
            throw err;
        }
    },

    /**
     * Batch update multiple site config keys in a single request.
     * @param {Array<{key: string, value: string}>} configs
     * @param {string} [adminPassword='admin123']
     */
    async batchUpdateSiteConfigs(configs, adminPassword = 'admin123') {
        if (isLocal) {
            for (const { key, value } of configs) {
                saveLocalSiteConfig(key, value);
            }
            await new Promise(r => setTimeout(r, 50));
            return { success: true, updated: configs.length };
        }

        try {
            const credentials = btoa(`xiaoxi:${adminPassword}`);
            const res = await fetch('/api/configs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify({ configs })
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `API returned status ${res.status}`);
            }
            return await res.json();
        } catch (err) {
            console.error('[dataService] batchUpdateSiteConfigs failed:', err);
            throw err;
        }
    },

    // ── Category Management ──────────────────────────────────────────────────

    async getCategories() {
        if (isLocal) return getLocalCategories();
        try {
            const res = await fetch('/api/categories');
            if (!res.ok) throw new Error(`API returned status ${res.status}`);
            const data = await res.json();
            return Array.isArray(data) && data.length > 0 ? data : MOCK_CATEGORIES;
        } catch (err) {
            console.warn('[dataService] getCategories failed, using mock:', err);
            return MOCK_CATEGORIES;
        }
    },

    async addCategory(categoryData, adminPassword = 'admin123') {
        if (isLocal) {
            const categories = getLocalCategories();
            const cleanSlug  = categoryData.slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
            if (categories.some(c => c.slug === cleanSlug)) throw new Error('Category slug already exists.');
            const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
            categories.push({ id: newId, slug: cleanSlug, name: categoryData.name, badge: categoryData.badge || '' });
            saveLocalCategories(categories);
            await new Promise(r => setTimeout(r, 150));
            return { success: true, insertedId: newId };
        }
        try {
            const credentials = btoa(`xiaoxi:${adminPassword}`);
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${credentials}` },
                body: JSON.stringify(categoryData)
            });
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || `Status ${res.status}`); }
            return await res.json();
        } catch (err) { console.error('[dataService] addCategory failed:', err); throw err; }
    },

    async deleteCategory(id, adminPassword = 'admin123') {
        const idInt = parseInt(id, 10);
        if (isLocal) {
            const categories = getLocalCategories();
            const cat = categories.find(c => c.id === idInt);
            if (cat) {
                const projects = getLocalProjects();
                if (projects.some(p => (p.category_slug || p.categorySlug) === cat.slug)) {
                    throw new Error('Cannot delete: projects are associated with this category.');
                }
            }
            saveLocalCategories(categories.filter(c => c.id !== idInt));
            await new Promise(r => setTimeout(r, 150));
            return { success: true };
        }
        try {
            const credentials = btoa(`xiaoxi:${adminPassword}`);
            const res = await fetch(`/api/categories?id=${idInt}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${credentials}` }
            });
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || `Status ${res.status}`); }
            return await res.json();
        } catch (err) { console.error('[dataService] deleteCategory failed:', err); throw err; }
    },

    // ── Project Management ───────────────────────────────────────────────────

    async getProjects(categorySlug = 'all') {
        let categories = MOCK_CATEGORIES;
        try { categories = await this.getCategories(); } catch {}

        if (isLocal) {
            const projects = getLocalProjects();
            const mapped   = projects.map(p => mapProjectFields(p, categories));
            if (categorySlug && categorySlug !== '全部' && categorySlug !== 'all') {
                return mapped.filter(p => p.categorySlug === categorySlug);
            }
            return mapped;
        }

        try {
            let url = '/api/projects';
            if (categorySlug && categorySlug !== '全部' && categorySlug !== 'all') {
                url += `?category_slug=${encodeURIComponent(categorySlug)}`;
            }
            const res  = await fetch(url);
            if (!res.ok) throw new Error(`API returned status ${res.status}`);
            const data = await res.json();
            return (Array.isArray(data) && data.length > 0 ? data : MOCK_PROJECTS).map(p => mapProjectFields(p, categories));
        } catch (err) {
            console.warn('[dataService] getProjects failed, using mock:', err);
            return getLocalProjects().map(p => mapProjectFields(p, categories));
        }
    },

    async addProject(projectData, adminPassword = 'admin123') {
        if (isLocal) {
            const projects = getLocalProjects();
            const newId    = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
            projects.push({
                id:           newId,
                sequence_id:  parseInt(projectData.sequence_id, 10) || newId,
                title:        projectData.title,
                description:  projectData.description || '',
                category_slug: projectData.categorySlug || projectData.category_slug,
                media_type:   projectData.mediaType    || projectData.media_type,
                media_url:    projectData.mediaUrl     || projectData.media_url,
                detail_url:   projectData.detailUrl    || '#'
            });
            saveLocalProjects(projects);
            await new Promise(r => setTimeout(r, 200));
            return { success: true, insertedId: newId };
        }
        try {
            const credentials = btoa(`xiaoxi:${adminPassword}`);
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${credentials}` },
                body: JSON.stringify(projectData)
            });
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || `Status ${res.status}`); }
            return await res.json();
        } catch (err) { console.error('[dataService] addProject failed:', err); throw err; }
    },

    async deleteProject(id, adminPassword = 'admin123') {
        if (isLocal) {
            saveLocalProjects(getLocalProjects().filter(p => p.id !== parseInt(id, 10)));
            await new Promise(r => setTimeout(r, 200));
            return { success: true };
        }
        try {
            const credentials = btoa(`xiaoxi:${adminPassword}`);
            const res = await fetch(`/api/projects?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${credentials}` }
            });
            if (!res.ok) throw new Error(`API returned status ${res.status}`);
            return await res.json();
        } catch (err) { console.error('[dataService] deleteProject failed:', err); throw err; }
    },

    // ── File Upload (R2) ─────────────────────────────────────────────────────

    async uploadFile(file, category, onProgress) {
        if (isLocal) {
            for (let i = 0; i <= 100; i += 20) {
                if (onProgress) onProgress({ loaded: i, total: 100 });
                await new Promise(r => setTimeout(r, 60));
            }
            return { success: true, mediaUrl: URL.createObjectURL(file), filename: file.name };
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `/api/upload?category=${encodeURIComponent(category)}`);
            if (onProgress && xhr.upload) {
                xhr.upload.addEventListener('progress', e => {
                    if (e.lengthComputable) onProgress({ loaded: e.loaded, total: e.total });
                });
            }
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try { resolve(JSON.parse(xhr.responseText)); }
                    catch { reject(new Error('Failed to parse server response.')); }
                } else {
                    reject(new Error(`Upload failed with status: ${xhr.status}`));
                }
            };
            xhr.onerror = () => reject(new Error('Network error during file upload.'));
            const fd = new FormData();
            fd.append('file', file);
            xhr.send(fd);
        });
    },

    // ── Legacy Config (KV-based flags) ──────────────────────────────────────

    async getConfig() {
        if (isLocal) return MOCK_CONFIG;
        try {
            const res = await fetch('/api/config');
            if (!res.ok) throw new Error(`API returned status ${res.status}`);
            return await res.json();
        } catch (err) {
            console.warn('[dataService] getConfig failed, using mock:', err);
            return MOCK_CONFIG;
        }
    }
};
