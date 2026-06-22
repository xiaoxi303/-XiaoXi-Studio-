
# 🌌 XiaoXi Studio — Full-Site CMS Control Center

&lt;div align="center"&gt;

![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&amp;logo=cloudflarepages&amp;logoColor=white)
![Cloudflare D1](https://img.shields.io/badge/Cloudflare%20D1-F38020?style=for-the-badge&amp;logo=sqlite&amp;logoColor=white)
![Cloudflare R2](https://img.shields.io/badge/Cloudflare%20R2-F38020?style=for-the-badge&amp;logo=cloudflare&amp;logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&amp;logo=tailwind-css&amp;logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla%20JavaScript-F7DF1E?style=for-the-badge&amp;logo=javascript&amp;logoColor=black)
![Markdown Ready](https://img.shields.io/badge/Markdown%20Ready-000000?style=for-the-badge&amp;logo=markdown&amp;logoColor=white)
![License MIT](https://img.shields.io/badge/License-MIT-00618A?style=for-the-badge)

&lt;/div&gt;

---

## ✨ 核心优势矩阵 / System Highlights

| 功能特性 | 传统静态作品集 | XiaoXi Studio 全站 CMS |
| :--- | :--- | :--- |
| **全站可配置** | ❌ 硬编码，改字需重新部署 | ✅ 6 大模块（Hero、走马灯、数据墙、时间轴、法务条款）全量纳入后台 `/admin` 可视化一键修改 |
| **混合媒体管理** | ❌ 静态托管，需第三方服务 | ✅ R2 直传图片/原生 `.mp4`，实时进度条，云端预播放预览 |
| **云端部署** | ❌ 复杂命令行配置 | ✅ **100% 网页控制台可视化操作，零命令行门槛** |
| **本地开发** | ❌ 需要完整云端环境 | ✅ `isLocal` 机制 + localStorage 完美断网闭环测试 |
| **安全认证** | ❌ 无防护 | ✅ HTTP Basic Auth 边缘中间件，密码锁死环境变量 |

---

## 📖 项目简介 / Project Overview

**专为独立创作者、影视工作室定制的零门槛全栈数字展示系统。无需任何命令行经验，通过 Cloudflare 网页控制台就能完成全流程部署。**

A zero-config, full-stack portfolio system tailored for creative professionals. 100% visual deployment through Cloudflare Dashboard—no command line required.

---

## 🚀 纯网页可视化：Cloudflare 云端保姆级部署教学

### 🔹 第一步：网页创建 D1 数据库与 R2 存储桶

1. **打开 Cloudflare 控制台**，登录你的账户
2. **创建 D1 数据库**：
   - 在左侧菜单点击 **「Workers &amp; Pages」** → **「D1 数据库」**
   - 点击右上角蓝色大按钮 **「创建数据库」**
   - 数据库名称（Database name）**严格填写为**：`xiaoxi-db`
   - 点击 **「创建」** 按钮完成
3. **创建 R2 存储桶**：
   - 在左侧菜单点击 **「R2 存储桶」**
   - 点击右上角蓝色大按钮 **「创建存储桶」**
   - 存储桶名称（Bucket name）**严格填写为**：`xiaoxi-media`
   - 点击 **「创建存储桶」** 按钮
4. **开启 R2 公开访问**（关键步骤）：
   - 进入刚创建的 `xiaoxi-media` 存储桶
   - 点击顶部的 **「设置」** 标签
   - 找到 **「公开访问」** 区域，点击 **「允许公开访问」**
   - 复制并记录生成的公网访问地址（形如 `https://pub-xxx.r2.dev`）

### 🔹 第二步：一键执行数据库建表与种子数据导入

1. 进入刚创建的 `xiaoxi-db` 数据库控制台
2. 点击顶部的 **「控制台/Console」** 标签页
3. 在你的本地电脑上，打开项目根目录下的 `schema.sql` 文件
4. **全选复制 `schema.sql` 中的所有内容**（从第一行到最后一行）
5. 将复制的内容**粘贴进 D1 网页控制台的输入框**中
6. 点击蓝色的 **「执行」** 按钮
7. 看到执行成功提示后，数据库初始化完成！

### 🔹 第三步：前台 Pages 项目与云端资源的【一键连接绑定】

1. 前往 **「Workers &amp; Pages」** → **「Create Application」** → **「Pages」**
2. 选择 **「上传资产」**（Upload assets）
3. **项目名称**：填写为 `xiaoxistudio`（或你喜欢的名字）
4. **创建项目**后，进入该 Pages 项目的后台
5. 点击顶部的 **「设置」** → **「绑定」** 标签页
6. **绑定 D1 数据库**：
   - 点击右上角蓝色大按钮 **「添加绑定 +」**
   - 在弹出的浮窗左侧列表中选择 **「D1 数据库」**
   - **变量名称（Variable name）**：**严格填写为大写** → `DB`
   - **D1 数据库**：在下拉菜单中**一键选中**你刚刚创建的 `xiaoxi-db`
   - 点击 **「保存」** 按钮
7. **绑定 R2 存储桶**：
   - 再次点击 **「添加绑定 +」** 大按钮
   - 在左侧列表中选择 **「R2 存储桶」**
   - **变量名称（Variable name）**：**严格填写为大写** → `MY_R2_BUCKET`
   - **R2 存储桶**：在下拉菜单中**一键选中**刚刚创建的 `xiaoxi-media`
   - 点击 **「保存」** 按钮

### 🔹 第四步：环境变量一键填装

1. 在同一 **「设置」** 页面，点击左侧的 **「环境变量」** 标签
2. 点击 **「添加变量」** 按钮，依次添加以下 2 个变量：

| 变量 Key (Variable Name) | 填入的内容值示例 | 作用与安全防线说明 |
| :--- | :--- | :--- |
| `ADMIN_PASSWORD` | `你自定义的后台超级管理密码`（例如：`MySuperSecret123`） | 锁死边缘中间件 HTTP Basic Auth，防范 `/admin` 越权修改全站内容 |
| `R2_PUBLIC_URL` | `https://pub-xxxx.r2.dev`（第一步中复制的 R2 公网访问地址） | 后端上传成功后，用于自动拼接前台可直接流畅播放的真多媒体 URL |

3. 添加完成后，点击底部的 **「保存并部署」** 按钮

### 🔹 第五步：上传代码文件并上线

1. 在 Pages 项目后台，点击 **「部署」** 标签
2. 点击 **「创建新部署」** 按钮
3. 将本地电脑项目文件夹 `d:\Git\CC` 中的所有文件（除了 `.wrangler` 文件夹）全选
4. **拖入**上传框或点击 **「选择文件」** 上传
5. 点击 **「保存并部署」** 按钮
6. 等待 1-2 分钟，部署成功后访问提供的 `*.pages.dev` 域名即可！

---

## 🛠️ 本地闭环调试流程 / Local Zero-Dependency Check

### 前置准备
确保已安装 Node.js 18+

### 启动本地服务器

```bash
cd d:\Git\CC
npx wrangler pages dev .
```

访问 `http://localhost:8788` 即可预览项目。

### 本地模拟特性

在本地运行时，系统会自动检测到本地协议并智能回退：

✅ **完全断网、无云端依赖**也可完美运行  
✅ 所有修改（分类、作品、联系方式）都会自动保存在浏览器 localStorage 中  
✅ 刷新页面数据不丢失，完美模拟线上体验  
✅ 后台 `/admin` 直接可访问（用户名：`xiaoxi`，默认密码：`admin123`）

---

## 🔐 后台访问凭据 / Admin Credentials

| 项目 | 默认值 | 说明 |
| :--- | :--- | :--- |
| **后台路径** | `/admin` | 访问 CMS 可视化控制台 |
| **用户名** | `xiaoxi` | 固定用户名 |
| **密码** | `admin123`（本地）或环境变量 `ADMIN_PASSWORD`（云端） | 线上环境密码由环境变量完全控制 |

---

## 📝 配置项速查表 / Site Configs Reference

### 首页配置 (Home)
| 配置项 | 作用 |
| :--- | :--- |
| `home_hero_title` | Hero 区域大标题 |
| `home_hero_subtitle` | Hero 副标题 |
| `home_hero_status` | Hero 状态标签 |
| `home_hero_fields` | Hero 领域标签 |
| `home_marquee_text` | 顶部滚动公告栏文字 |
| `home_stat_a_value`/`label`/`desc` | 数据墙第 1 项 |
| `home_stat_b_value`/`label`/`desc` | 数据墙第 2 项 |
| `home_stat_c_value`/`label`/`desc` | 数据墙第 3 项 |
| `home_stat_d_value`/`label`/`desc` | 数据墙第 4 项 |

### 全局联系配置
| 配置项 | 作用 |
| :--- | :--- |
| `contact_studio_email` | 合作邮箱 |
| `contact_studio_wechat` | 微信 ID |
| `contact_studio_wechat_qrcode` | 微信二维码 R2 链接 |

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
│       ├── configs.js        # 全新 site_configs CMS 接口
│       ├── categories.js     # 分类增删改查接口
│       ├── projects.js       # 作品增删改查接口
│       └── upload.js         # R2 多媒体上传接口
└── .gitignore                # Git 忽略文件配置
```

---

## 📄 许可证 / License

MIT License — 详见项目根目录。

---

&lt;div align="center"&gt;
&lt;p style="color: #6b7280; font-size: 14px;"&gt;
Built with 💜 by XiaoXi Studio • © 2024
&lt;/p&gt;
&lt;/div&gt;
