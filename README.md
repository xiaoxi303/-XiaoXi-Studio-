
# 🌌 XiaoXi Studio — Full-Site CMS Control Center

<div align="center">

![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&amp;logo=cloudflarepages&amp;logoColor=white)
![Cloudflare D1](https://img.shields.io/badge/Cloudflare%20D1-F38020?style=for-the-badge&amp;logo=sqlite&amp;logoColor=white)
![Cloudflare R2](https://img.shields.io/badge/Cloudflare%20R2-F38020?style=for-the-badge&amp;logo=cloudflare&amp;logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&amp;logo=tailwind-css&amp;logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla%20JavaScript-F7DF1E?style=for-the-badge&amp;logo=javascript&amp;logoColor=black)
![Markdown Ready](https://img.shields.io/badge/Markdown%20Ready-000000?style=for-the-badge&amp;logo=markdown&amp;logoColor=white)
![License MIT](https://img.shields.io/badge/License-MIT-00618A?style=for-the-badge)

</div>

---

## 📖 项目简介 / Project Overview

**专为独立创作者 / 影视工作室定制的全站无后缀路径、全动态内容驱动的高保真多页面全栈系统。**

A fully dynamic, headless CMS-driven portfolio system tailored for creative professionals and motion graphics studios, featuring clean URL routing, Cloudflare-native serverless architecture, and 100% configurable content.

---

## ✨ 系统亮点矩阵 / System Highlights

| 亮点维度 | 普通静态作品集 | XiaoXi Studio 全栈系统 |
| :--- | :--- | :--- |
| **全站可配置 (100% Headless CMS)** | ❌ 硬编码 HTML，改文字需重新部署 | ✅ 6 大模块（Hero、走马灯、蓝图、战绩、联系、时间轴、法务）全量纳入 D1 数据库，后台可视化编辑 |
| **混合媒体流管理** | ❌ 静态图片托管，视频需第三方服务 | ✅ R2 直传图片/原生 `.mp4`，实时进度条，云端预播放预览 |
| **边缘安全门禁** | ❌ 无认证，或需第三方插件 | ✅ HTTP Basic Auth 中间件，密码锁死云端环境变量，秒级拦截 |
| **URL 纯净度** | ❌ `/about.html` 丑陋后缀 | ✅ `/about` 无后缀文件级路由，专业感拉满 |
| **本地开发体验** | ❌ 需要完整云端环境 | ✅ 内置 `isLocal` 分流层 + localStorage 混合模拟，完美断网闭环测试 |

---

## 🛠️ 保姆级本地开发指南 / Local Development Workflow

### 前置准备
确保已安装 Node.js 18+ 和 `wrangler` CLI：

```bash
npm install -g wrangler
```

### 启动本地服务器

```bash
cd d:\Git\CC
npx wrangler pages dev .
```

访问 `http://localhost:8788` 即可预览项目。

### 本地模拟特性

由于 `dataService.js` 内置智能分流与 localStorage 混合 overlay 机制，本地运行时：

✅ **完全断网、无云端依赖**也可完美运行  
✅ 分类、作品的增删改查完美在浏览器中持久化  
✅ 联系方式修改即时生效，完美模拟线上体验  
✅ 后台 `/admin` 直接可访问（用户名 `xiaoxi`，密码 `admin123`）

---

## 🚀 终极 Cloudflare 生产部署教学 / Production Deployment Masterclass

### 🔹 步骤一：创建并初始化 D1 关系型数据库

```bash
# 创建数据库
npx wrangler d1 create xiaoxi-db

# 执行建表脚本 &amp; 种子数据
npx wrangler d1 execute xiaoxi-db --remote --file=./schema.sql
```

### 🔹 步骤二：创建 R2 多媒体分布式存储桶

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/) → 进入 **R2**
2. 点击 **Create Bucket**，命名为 `xiaoxi-media`
3. **关键步骤**：进入 Bucket 设置 → 点击 **Make Public** 或绑定自定义域名
4. 记录下你的 R2 公网访问地址（形如 `https://pub-xxx.r2.dev`）

### 🔹 步骤三：创建 Pages 项目与全栈配置

前往 **Workers &amp; Pages** → **Create Application** → **Pages**，选择 **Upload assets**（或连接 Git 仓库）。

在项目设置页面，完整填写以下配置：

| 资源类别 | 绑定名称 / 变量 Key | 期望填入的值 / 映射对象 | 作用说明 |
| :--- | :--- | :--- | :--- |
| **D1 数据库绑定** | `DB` | 映射到 `xiaoxi-db` | 接管全站作品、分类、全局文本配置的数据流 |
| **R2 存储桶绑定** | `MY_R2_BUCKET` | 映射到 `xiaoxi-media` | 负责接收后台直传的视频/图片二进制流大对象 |
| **环境变量 (Variable)** | `ADMIN_PASSWORD` | 你的自定义超级密码 | 锁死 `/admin` 后台及 `/api` 写入接口的安全大闸 |
| **环境变量 (Variable)** | `R2_PUBLIC_URL` | 例如 `https://pub-xxx.r2.dev` | 用于在上传成功后，拼接出可供前台直接播放的真多媒体 URL |

### 🔹 步骤四：部署发布

Git 连接方式：提交代码后自动触发部署  
手动上传方式：将 `d:\Git\CC` 下的文件拖入上传框

---

## 📂 项目结构 / Project Architecture

```
XiaoXi Studio/
├── index.html                 # 首页（作品展示、Hero、服务蓝图）
├── dataService.js            # 统一数据层（本地/生产自动切换）
├── schema.sql                # D1 数据库表结构 &amp; 种子数据
├── functions/
│   ├── about.js              # 关于页路由
│   ├── toolkit.js            # 技能工具箱页路由
│   ├── contact.js            # 联系页路由
│   ├── privacy.js            # 隐私政策页路由
│   ├── terms.js              # 服务条款页路由
│   ├── admin.js              # 四 Tab CMS 超级后台
│   └── api/
│       ├── _middleware.js    # API 安全认证中间件
│       ├── config.js         # 旧版 KV 配置接口（兼容）
│       ├── configs.js        # 全新 site_configs CMS 接口
│       ├── categories.js     # 分类增删改查接口
│       ├── projects.js       # 作品增删改查接口
│       └── upload.js         # R2 多媒体上传接口
└── .wrangler/                # Wrangler 本地缓存（自动生成）
```

---

## 🔐 后台访问凭据 / Admin Credentials

| 项目 | 默认值 | 说明 |
| :--- | :--- | :--- |
| **后台路径** | `/admin` | 访问 CMS 控制台 |
| **用户名** | `xiaoxi` | 固定用户名 |
| **密码** | `admin123` | 可通过环境变量 `ADMIN_PASSWORD` 覆盖 |

---

## 📝 配置项清单 / Site Configs Reference

### 首页配置 (page: home)
| config_key | 说明 |
| :--- | :--- |
| `home_hero_title` | Hero 大标题 |
| `home_hero_subtitle` | Hero 副标题 |
| `home_hero_status` | Hero 状态标签 |
| `home_hero_fields` | Hero 领域标签 |
| `home_marquee_text` | 滚动公告栏文字 |
| `home_stat_a_value`/`label`/`desc` | 数据墙第 1 项 |
| `home_stat_b_value`/`label`/`desc` | 数据墙第 2 项 |
| `home_stat_c_value`/`label`/`desc` | 数据墙第 3 项 |
| `home_stat_d_value`/`label`/`desc` | 数据墙第 4 项 |

### 全局联系配置 (page: contact)
| config_key | 说明 |
| :--- | :--- |
| `contact_studio_email` | 合作邮箱 |
| `contact_studio_wechat` | 微信 ID |
| `contact_studio_wechat_qrcode` | 微信二维码 R2 URL |

---

## 📄 许可证 / License

MIT License — 详见项目根目录。

---

<div align="center">
<p style="color: #6b7280; font-size: 14px;">
Built with 💜 by XiaoXi Studio • © 2024
</p>
</div>
