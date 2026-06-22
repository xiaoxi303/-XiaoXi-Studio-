-- D1 SQLite Schema for XiaoXi Studio — Full-Site CMS (Three-Table Architecture)
-- Run: npx wrangler d1 execute xiaoxi-db --file=./schema.sql --remote

-- ============================================================
-- DROP ORDER: respect FK dependencies (projects → categories)
-- ============================================================
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS site_configs;

-- ============================================================
-- TABLE 1: site_configs — Global CMS content key-value store
-- Stores all page text, media URLs, JSON blobs, legal markdown
-- ============================================================
CREATE TABLE IF NOT EXISTS site_configs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    page_name   TEXT NOT NULL,        -- 'home' | 'about' | 'toolkit' | 'contact' | 'legal'
    section_id  TEXT NOT NULL,        -- logical grouping within the page (e.g. 'hero', 'workflow')
    config_key  TEXT UNIQUE NOT NULL, -- globally unique key used by frontend (e.g. 'home_hero_title')
    config_value TEXT NOT NULL,       -- value: plain text, URL, or JSON string
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_configs_page ON site_configs(page_name);
CREATE INDEX IF NOT EXISTS idx_site_configs_key  ON site_configs(config_key);

-- ============================================================
-- TABLE 2: categories — Dynamic work categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    slug  TEXT UNIQUE NOT NULL,
    name  TEXT NOT NULL,
    badge TEXT
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ============================================================
-- TABLE 3: projects — Portfolio work entries (FK → categories)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    sequence_id INTEGER UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    media_type  TEXT NOT NULL,   -- 'image' | 'video'
    media_url   TEXT NOT NULL,
    detail_url  TEXT,
    FOREIGN KEY (category_slug) REFERENCES categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_projects_category_slug ON projects(category_slug);
CREATE INDEX IF NOT EXISTS idx_projects_sequence      ON projects(sequence_id);

-- ============================================================
-- SEED: site_configs — Homepage (page_name = 'home')
-- ============================================================
INSERT INTO site_configs (page_name, section_id, config_key, config_value) VALUES
('home', 'hero', 'home_hero_title',    '无限进步'),
('home', 'hero', 'home_hero_subtitle', '精细且富有灵魂地打造数字化体验。将创意视觉与前沿 AI 工作流相融合，呈现非凡的视觉叙事。'),
('home', 'hero', 'home_hero_status',   'AE + AI 辅助内容生成'),
('home', 'hero', 'home_hero_fields',   'AI作品 / MG动画 / TVC / 跨境电商'),
('home', 'marquee', 'home_marquee_text', '★ XiaoXi Studio 2026 视觉探索全面启动 ★ 跨境电商 TikTok 投放视频消耗破百万 ★ AI生成式流媒体工作流深度集成 ★ 传统 MG 动效精细化定制，感受帧帧极致打磨 ★ 商业 TVC 全流程执行，从脚本到交付一站直达 ★'),
('home', 'stats', 'home_stat_a_value', '30+'),
('home', 'stats', 'home_stat_a_label', '覆盖行业项目'),
('home', 'stats', 'home_stat_a_desc',  '跨不同数字化领域的丰富实战积累'),
('home', 'stats', 'home_stat_b_value', '10x'),
('home', 'stats', 'home_stat_b_label', 'AI 催化产能提升'),
('home', 'stats', 'home_stat_b_desc',  '深度集成智能神经网络提速创作'),
('home', 'stats', 'home_stat_c_value', '99%'),
('home', 'stats', 'home_stat_c_label', '跨境电商高留存率'),
('home', 'stats', 'home_stat_c_desc',  '打磨金字塔留存节奏与黄金钩子'),
('home', 'stats', 'home_stat_d_value', '24/7'),
('home', 'stats', 'home_stat_d_label', '全球全天候自由流协作'),
('home', 'stats', 'home_stat_d_desc',  '全时区无缝对接，高效无间合作');

-- ============================================================
-- SEED: site_configs — About page (page_name = 'about')
-- ============================================================
INSERT INTO site_configs (page_name, section_id, config_key, config_value) VALUES
('about', 'bio', 'about_bio_name', '小希 · XiaoXi'),
('about', 'bio', 'about_bio_text', '我是一位深耕数字视觉创意领域的自由工作室主理人，专注于以 After Effects 为核心，融合 AI 工具流与商业影像制作。我相信每一帧画面都应该有灵魂，每一个动效都值得被精细打磨。从 TikTok 爆款短视频到高端品牌 TVC，我始终以理性的精确与感性的灵魂，雕琢每一帧数字化体验。'),
('about', 'workflow', 'about_workflow_01_title', '01 · 深度需求解构'),
('about', 'workflow', 'about_workflow_01_desc',  '与客户展开深度对话，解构品牌核心诉求与目标受众的情感触点，建立精准的视觉叙事策略框架。避免一切无效执行，从源头确保创作方向的精准与高效。'),
('about', 'workflow', 'about_workflow_02_title', '02 · 精细制作执行'),
('about', 'workflow', 'about_workflow_02_desc',  '以 After Effects + AI 辅助工作流为引擎，融合数据驱动的动效设计与精细化的画面质感打磨，确保每一帧输出达到商业发布标准。'),
('about', 'workflow', 'about_workflow_03_title', '03 · 快速迭代交付'),
('about', 'workflow', 'about_workflow_03_desc',  '基于实时反馈机制进行敏捷迭代，通过云端协作平台实现即时预览与极速交付，完整保障项目时效与品质双线并行。'),
('about', 'timeline', 'about_timeline_json', '[{"year":"2026","title":"TikTok 跨境投流专家","desc":"负责北美大盘跨境电商品牌全套视觉体系，单账户月度视频消耗破百万，ROI 持续领跑行业平均水平。"},{"year":"2024","title":"XiaoXi Studio 创立","desc":"创立个人数字视觉工作室，专注于 AI 辅助的创意视频制作与商业影像定制，首月即签约 3 个独立品牌合作。"},{"year":"2023","title":"Daley College 深造","desc":"赴美研修数字媒体与视觉传达，系统学习好莱坞级别的动效设计与后期制作工作流，构建全球化视野。"},{"year":"2022","title":"After Effects 深度专精","desc":"全面掌握 AE 表达式、脚本与插件生态，构建自己的高效创作模板矩阵，开始接触 AI 辅助生成工作流。"}]');

-- ============================================================
-- SEED: site_configs — Toolkit page (page_name = 'toolkit')
-- ============================================================
INSERT INTO site_configs (page_name, section_id, config_key, config_value) VALUES
('toolkit', 'skills', 'toolkit_skills_json', '[{"icon":"auto_awesome","name":"After Effects"},{"icon":"psychology","name":"Midjourney"},{"icon":"movie","name":"DaVinci Resolve"},{"icon":"smart_display","name":"Premiere Pro"},{"icon":"brush","name":"Photoshop"},{"icon":"trending_up","name":"TikTok Ads"},{"icon":"grain","name":"Stable Diffusion"},{"icon":"videocam","name":"即梦 AI"},{"icon":"animation","name":"可灵 AI"},{"icon":"tune","name":"EbSynth"},{"icon":"color_lens","name":"Illustrator"},{"icon":"3d_rotation","name":"Cinema 4D"}]');

-- ============================================================
-- SEED: site_configs — Contact info (page_name = 'contact')
-- ============================================================
INSERT INTO site_configs (page_name, section_id, config_key, config_value) VALUES
('contact', 'global_info', 'contact_studio_email',       'hello@xiaoxistudio.com'),
('contact', 'global_info', 'contact_studio_wechat',      'XiaoXi_Design'),
('contact', 'global_info', 'contact_studio_wechat_qrcode', '');

-- ============================================================
-- SEED: site_configs — Legal pages (page_name = 'legal')
-- ============================================================
INSERT INTO site_configs (page_name, section_id, config_key, config_value) VALUES
('legal', 'privacy', 'legal_privacy_content', '# 隐私政策

**最后更新日期：2024 年 12 月 01 日**

XiaoXi Studio（以下简称"我们"或"本工作室"）极度重视您的数字隐私与数据安全。本隐私政策详细阐述了我们在您访问本网站及使用相关服务期间收集、使用和保护信息的方式。

---

## 一、信息收集范围

我们收集的信息类型仅限于以下必要范围：

- **联系表单数据**：当您通过网站联系表单主动提交信息时，我们会收集您提供的姓名、电子邮件地址及留言内容，用于回复您的合作需求。
- **访问日志**：通过 Cloudflare 基础设施自动记录的标准服务器日志，包含 IP 地址（匿名化处理）、访问时间、页面 URL 及浏览器类型。此数据仅用于安全监控与性能优化，不与任何个人身份信息关联。
- **Cookies**：本网站不使用用于追踪或广告目的的第三方 Cookie。

---

## 二、信息使用目的

我们承诺，所有收集到的信息仅用于以下合法目的：

1. **回复您的合作咨询或业务沟通**
2. **维护网站安全性与正常运行**
3. **改善用户体验与网站性能**

我们**绝不**会将您的个人信息出售、出租或以任何方式共享给未经授权的第三方。

---

## 三、数据存储与安全

所有数据托管于 Cloudflare 全球基础设施之上，享有企业级安全防护。静态数据通过 AES-256 加密，传输中的数据通过 TLS 1.3 保护。我们遵循最小权限原则，仅授权必要人员访问生产数据。

---

## 四、您的权利

作为数据主体，您享有以下权利：

- **访问权**：随时查阅我们持有的关于您的数据
- **删除权**：要求我们删除您的所有个人数据
- **更正权**：要求我们更正不准确的个人信息

如需行使上述权利，请通过以下方式联系我们：**hello@xiaoxistudio.com**

---

## 五、政策更新

本隐私政策可能会随业务发展定期更新。重大变更将通过本页面顶部的"最后更新日期"予以告知。建议您定期查阅本政策。

---

*如您对本隐私政策有任何疑问，欢迎通过电子邮件与我们联系。*'),

('legal', 'terms', 'legal_terms_content', '# 服务条款

**最后更新日期：2024 年 12 月 01 日**

欢迎访问 XiaoXi Studio 官方网站。请在使用本网站及相关服务前，仔细阅读以下服务条款。您继续访问或使用本网站即表示您已完全理解并同意受本条款的约束。

---

## 一、服务性质声明

本网站系 XiaoXi Studio（自由职业视觉工作室）的官方作品展示与合作洽谈平台。本网站提供的所有内容，包括但不限于视频作品、图文案例、设计方案，均属于创作展示性质，受版权法律保护。

---

## 二、知识产权

**2.1 工作室原创内容**

本网站展示的所有作品（包括视频、图像、文案、动效设计等）的知识产权归 XiaoXi Studio 独家所有。未经书面授权，严禁以任何形式复制、转载、改编或商业利用。

**2.2 客户委托作品**

针对客户委托创作的项目，版权归属以双方签订的书面合同为准。本网站仅作品展示性质的使用不构成版权侵犯。

---

## 三、合作与委托条款

**3.1 报价与合同**

所有商业合作项目均须在正式开始前签订书面服务协议，确认项目范围、交付物、时间节点及费用条款。口头承诺不构成具有法律效力的合同。

**3.2 付款条款**

标准付款方案为：项目启动前支付 50% 定金，交付验收后支付余款。具体比例可根据项目规模协商调整。

**3.3 修改次数**

标准合同包含 2 轮修改反馈。超出范围的额外修改将按工时计费，具体费率以当时报价为准。

**3.4 交付物所有权**

最终交付物的所有权在客户完成全款支付后转移。在此之前，所有中间文件及最终成品的所有权归 XiaoXi Studio 持有。

---

## 四、免责声明

**4.1** 本网站所展示的案例数据（如播放量、ROI 等）均来源于真实项目，但具体结果可能因品牌、受众、投放策略等变量而有所差异，不构成对未来合作项目结果的任何形式的担保或承诺。

**4.2** 对于因不可抗力（包括但不限于自然灾害、网络故障、平台政策变更等）导致的项目延误或损失，本工作室不承担相应责任。

---

## 五、适用法律

本条款受中华人民共和国法律管辖并依其解释。因本条款引起的任何争议，双方应首先通过友好协商解决；协商不成时，提交至合同签订地有管辖权的人民法院诉讼解决。

---

## 六、条款变更

本工作室保留随时修改本服务条款的权利。修改后的条款一经发布即生效。继续使用本网站即表示您接受更新后的条款。

---

*感谢您信任 XiaoXi Studio。期待与您携手，共创非凡的数字视觉体验。*');

-- ============================================================
-- SEED: categories (same as original)
-- ============================================================
INSERT INTO categories (id, slug, name, badge) VALUES
(1, 'creative', '创意视频', 'AI'),
(2, 'tvc',      '商业广告', 'TVC'),
(3, 'mg',       '动态图形', 'MG'),
(4, 'tiktok',   '跨境流媒体', 'TikTok');

-- ============================================================
-- SEED: projects (same as original)
-- ============================================================
INSERT INTO projects (id, sequence_id, title, description, category_slug, media_type, media_url, detail_url) VALUES
(1, 1, 'Cybernetic Echoes',     'AI-driven concept visualization for an upcoming tech apparel brand. Combining Midjourney assets with advanced AE compositing.',        'creative', 'image', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',  '#'),
(2, 2, 'Flow State Motion',     'Abstract motion design campaign exploring fluidity and rhythm in digital spaces. Created entirely in AE with custom scripts.',         'mg',       'video', 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32124-large.mp4',  '#'),
(3, 3, 'Dreamscape TVC',        'Full production commercial spot blending live-action footage with stylized 3D environments and 2D VFX elements.',                      'tvc',      'image', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',  '#'),
(4, 4, 'Viral Kinetics',        'High-retention social media content series optimized for vertical formats. Heavy use of kinetic typography and seamless transitions.', 'tiktok',   'video', 'https://assets.mixkit.co/videos/preview/mixkit-vertical-neon-light-patterns-42340-large.mp4', '#'),
(5, 5, 'Chrono-Shift Showcase', 'A conceptual commercial depicting time manipulation. Integrated Stable Diffusion generated keyframes with EbSynth styling.',           'creative', 'video', 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-spheres-and-lines-32545-large.mp4', '#'),
(6, 6, 'Neo-Retro Aesthetic',   'Styleframes and kinetic animation loops inspired by 80s synthwave, adapted for high-end luxury retail display installations.',         'mg',       'image', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80', '#');
