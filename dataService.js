
// dataService.js — XiaoXi Studio 核心数据分流层
// 本地 localStorage 闭环 / 线上 fetch() 真实请求
// 自动通过 location.hostname 智能切流

// ============================================================
// 固化全站保底 MOCK 资产（确保冷启动不卡死）
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
  { id: 1, slug: 'creative', name: '创意视频', badge: 'AI' },
  { id: 2, slug: 'tvc', name: '商业广告', badge: 'TVC' },
  { id: 3, slug: 'mg', name: '动态图形', badge: 'MG' },
  { id: 4, slug: 'tiktok', name: '跨境流媒体', badge: 'TikTok' }
];

const MOCK_PROJECTS = [
  { id: 1, sequenceId: 1, title: 'Cybernetic Echoes', description: 'AI-driven concept visualization for an upcoming tech apparel brand.', categorySlug: 'creative', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&amp;fit=crop&amp;w=800&amp;q=80', detailUrl: '#' },
  { id: 2, sequenceId: 2, title: 'Flow State Motion', description: 'Abstract motion design campaign exploring fluidity and rhythm in digital spaces.', categorySlug: 'mg', mediaType: 'video', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32124-large.mp4', detailUrl: '#' },
  { id: 3, sequenceId: 3, title: 'Dreamscape TVC', description: 'Full production commercial spot blending live-action footage with stylized 3D environments.', categorySlug: 'tvc', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&amp;fit=crop&amp;w=800&amp;q=80', detailUrl: '#' },
  { id: 4, sequenceId: 4, title: 'Viral Kinetics', description: 'High-retention social media content series optimized for vertical formats.', categorySlug: 'tiktok', mediaType: 'video', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-neon-light-patterns-42340-large.mp4', detailUrl: '#' },
  { id: 5, sequenceId: 5, title: 'Chrono-Shift Showcase', description: 'A conceptual commercial depicting time manipulation.', categorySlug: 'creative', mediaType: 'video', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-spheres-and-lines-32545-large.mp4', detailUrl: '#' },
  { id: 6, sequenceId: 6, title: 'Neo-Retro Aesthetic', description: 'Styleframes and kinetic animation loops inspired by 80s synthwave.', categorySlug: 'mg', mediaType: 'image', mediaUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&amp;fit=crop&amp;w=800&amp;q=80', detailUrl: '#' }
];

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
  contact_studio_wechat: 'XiaoXi_Design',
  contact_studio_wechat_qrcode: '',
  legal_privacy_content: '# 隐私政策\n\n最后更新日期：2024 年 12 月 01 日\n\nXiaoXi Studio 极度重视您的数字隐私与数据安全。',
  legal_terms_content: '# 服务条款\n\n最后更新日期：2024 年 12 月 01 日\n\n欢迎访问 XiaoXi Studio 官方网站。'
};

// ============================================================
// 智能环境判定
// ============================================================

const isLocal = typeof window !== 'undefined' &amp;&amp; (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '' ||
  window.location.protocol === 'file:'
);

// ============================================================
// LocalStorage 数据持久化助手
// ============================================================

const getLocalData = (key, fallback) =&gt; {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const saveLocalData = (key, data) =&gt; {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage 写入失败:', e);
  }
};

// ============================================================
// 核心数据服务对象导出
// ============================================================

export const dataService = {
  isLocal() {
    return isLocal;
  },

  // ============================================================
  // 1. 接通全站 CMS 配置流
  // ============================================================

  async getSiteConfigs(page) {
    if (isLocal) {
      const localConfigs = getLocalData(`xiaoxi_site_config`, MOCK_SITE_CONFIGS);
      // 过滤出对应页面的配置
      const pagePrefix = page + '_';
      const result = {};
      for (const [key, value] of Object.entries(localConfigs)) {
        if (key.startsWith(pagePrefix) || page === 'all') {
          result[key] = value;
        }
      }
      return result;
    }

    try {
      const res = await fetch(`/api/configs?page=${encodeURIComponent(page)}`);
      if (!res.ok) throw new Error('D1 Configs Fetch Failed');
      return await res.json();
    } catch (err) {
      console.warn('读取云端配置失败，回退本地：', err);
      const localConfigs = getLocalData(`xiaoxi_site_config`, MOCK_SITE_CONFIGS);
      const pagePrefix = page + '_';
      const result = {};
      for (const [key, value] of Object.entries(localConfigs)) {
        if (key.startsWith(pagePrefix)) {
          result[key] = value;
        }
      }
      return result;
    }
  },

  async updateSiteConfig(key, value) {
    if (isLocal) {
      const configs = getLocalData('xiaoxi_site_config', MOCK_SITE_CONFIGS);
      configs[key] = value;
      saveLocalData('xiaoxi_site_config', configs);
      return { success: true, key, message: '本地配置已更新' };
    }

    try {
      const res = await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      if (!res.ok) throw new Error('写入云端配置失败');
      return await res.json();
    } catch (err) {
      console.error('updateSiteConfig 失败:', err);
      throw err;
    }
  },

  async batchUpdateSiteConfigs(configsArray) {
    if (isLocal) {
      const configs = getLocalData('xiaoxi_site_config', MOCK_SITE_CONFIGS);
      for (const { key, value } of configsArray) {
        configs[key] = value;
      }
      saveLocalData('xiaoxi_site_config', configs);
      return { success: true, updated: configsArray.length };
    }

    try {
      const res = await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs: configsArray })
      });
      if (!res.ok) throw new Error('批量写入云端配置失败');
      return await res.json();
    } catch (err) {
      console.error('batchUpdateSiteConfigs 失败:', err);
      throw err;
    }
  },

  // ============================================================
  // 2. 接通分类管理流
  // ============================================================

  async getCategories() {
    if (isLocal) {
      return getLocalData('xiaoxi_categories', MOCK_CATEGORIES);
    }

    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Categories Fetch Failed');
      const data = await res.json();
      return Array.isArray(data) &amp;&amp; data.length &gt; 0 ? data : MOCK_CATEGORIES;
    } catch (err) {
      console.warn('读取云端分类失败，回退本地：', err);
      return getLocalData('xiaoxi_categories', MOCK_CATEGORIES);
    }
  },

  async addCategory(categoryData) {
    if (isLocal) {
      const categories = getLocalData('xiaoxi_categories', MOCK_CATEGORIES);
      const newId = categories.length &gt; 0 ? Math.max(...categories.map(c =&gt; c.id)) + 1 : 1;
      const newCategory = {
        id: newId,
        slug: categoryData.slug,
        name: categoryData.name,
        badge: categoryData.badge || ''
      };
      categories.push(newCategory);
      saveLocalData('xiaoxi_categories', categories);
      return { success: true, insertedId: newId };
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });
      if (!res.ok) throw new Error('添加分类失败');
      return await res.json();
    } catch (err) {
      console.error('addCategory 失败:', err);
      throw err;
    }
  },

  async deleteCategory(id) {
    if (isLocal) {
      const categories = getLocalData('xiaoxi_categories', MOCK_CATEGORIES);
      const filtered = categories.filter(c =&gt; c.id !== id);
      saveLocalData('xiaoxi_categories', filtered);
      return { success: true };
    }

    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('删除分类失败');
      return await res.json();
    } catch (err) {
      console.error('deleteCategory 失败:', err);
      throw err;
    }
  },

  // ============================================================
  // 3. 接通作品流（带蛇形转驼峰映射机制）
  // ============================================================

  async getProjects(categorySlug = 'all') {
    if (isLocal) {
      const localProjs = getLocalData('xiaoxi_projects', MOCK_PROJECTS);
      return categorySlug === 'all' ? localProjs : localProjs.filter(p =&gt; p.categorySlug === categorySlug);
    }

    try {
      const url = categorySlug === 'all' ? '/api/projects' : `/api/projects?category=${encodeURIComponent(categorySlug)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Projects Fetch Failed');
      const dbData = await res.json();

      // 核心：将云端 D1 的蛇形命名无缝转为前端渲染期待的驼峰命名
      return dbData.map(p =&gt; ({
        id: p.id,
        sequenceId: p.sequence_id,
        title: p.title,
        description: p.description,
        categorySlug: p.category_slug,
        mediaType: p.media_type,
        mediaUrl: p.media_url,
        detailUrl: p.detail_url || '#'
      }));
    } catch (err) {
      console.warn('读取云端作品失败，回退本地：', err);
      return getLocalData('xiaoxi_projects', MOCK_PROJECTS);
    }
  },

  async addProject(projectData) {
    if (isLocal) {
      const projects = getLocalData('xiaoxi_projects', MOCK_PROJECTS);
      const newId = projects.length &gt; 0 ? Math.max(...projects.map(p =&gt; p.id)) + 1 : 1;
      const newProject = {
        id: newId,
        sequenceId: parseInt(projectData.sequenceId || newId),
        title: projectData.title,
        description: projectData.description || '',
        categorySlug: projectData.categorySlug,
        mediaType: projectData.mediaType,
        mediaUrl: projectData.mediaUrl,
        detailUrl: projectData.detailUrl || '#'
      };
      projects.push(newProject);
      saveLocalData('xiaoxi_projects', projects);
      return { success: true, insertedId: newId };
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (!res.ok) throw new Error('添加作品失败');
      return await res.json();
    } catch (err) {
      console.error('addProject 失败:', err);
      throw err;
    }
  },

  async deleteProject(id) {
    if (isLocal) {
      const projects = getLocalData('xiaoxi_projects', MOCK_PROJECTS);
      const filtered = projects.filter(p =&gt; p.id !== id);
      saveLocalData('xiaoxi_projects', filtered);
      return { success: true };
    }

    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('删除作品失败');
      return await res.json();
    } catch (err) {
      console.error('deleteProject 失败:', err);
      throw err;
    }
  },

  // ============================================================
  // 4. R2 文件上传流
  // ============================================================

  async uploadFile(file, category, onProgress) {
    if (isLocal) {
      // 本地模拟上传进度
      for (let i = 0; i &lt;= 100; i += 10) {
        if (onProgress) onProgress({ loaded: i, total: 100 });
        await new Promise(r =&gt; setTimeout(r, 50));
      }
      return { success: true, mediaUrl: URL.createObjectURL(file), filename: file.name };
    }

    return new Promise((resolve, reject) =&gt; {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/api/upload?category=${encodeURIComponent(category)}`);

      if (onProgress &amp;&amp; xhr.upload) {
        xhr.upload.addEventListener('progress', e =&gt; {
          if (e.lengthComputable) onProgress({ loaded: e.loaded, total: e.total });
        });
      }

      xhr.onload = () =&gt; {
        if (xhr.status &gt;= 200 &amp;&amp; xhr.status &lt; 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error('服务器返回解析失败'));
          }
        } else {
          reject(new Error(`上传失败: ${xhr.status}`));
        }
      };

      xhr.onerror = () =&gt; reject(new Error('网络错误'));
      const fd = new FormData();
      fd.append('file', file);
      xhr.send(fd);
    });
  },

  // ============================================================
  // 5. 遗留配置接口兼容
  // ============================================================

  async getConfig() {
    if (isLocal) return MOCK_CONFIG;
    try {
      const res = await fetch('/api/config');
      if (!res.ok) throw new Error('Config Fetch Failed');
      return await res.json();
    } catch (err) {
      console.warn('读取遗留配置失败，回退本地：', err);
      return MOCK_CONFIG;
    }
  }
};

