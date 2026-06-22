
// ⚡ 强制激活 Cloudflare 全栈动态特性的验证节点
// 只要这个文件存在，Cloudflare 就不可能误判为纯静态网站！

export async function onRequest(context) {
    const { env } = context;
    
    // 显式引用所有绑定，强制 Cloudflare 编译器识别
    const dbStatus = env.DB ? "D1 数据库已绑定 ✅" : "D1 数据库未绑定 ❌";
    const r2Status = env.MY_R2_BUCKET ? "R2 存储桶已绑定 ✅" : "R2 存储桶未绑定 ❌";
    const adminPass = env.ADMIN_PASSWORD ? "管理员密码已设置 ✅" : "管理员密码未设置 ❌";
    const r2PublicUrl = env.R2_PUBLIC_URL ? `R2 公网地址: ${env.R2_PUBLIC_URL}` : "R2 公网地址未设置";

    const html = `
&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
&lt;head&gt;
    &lt;meta charset="utf-8" /&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
    &lt;title&gt;⚡ 全栈动态验证节点&lt;/title&gt;
    &lt;script src="https://cdn.tailwindcss.com"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body class="bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen flex items-center justify-center p-8"&gt;
    &lt;div class="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 border border-orange-100"&gt;
        &lt;h1 class="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-3"&gt;
            &lt;span class="text-5xl"&gt;⚡&lt;/span&gt;
            全栈动态验证成功！
        &lt;/h1&gt;
        &lt;p class="text-gray-500 mb-8 text-lg"&gt;Cloudflare Pages 已正确识别此项目为全栈 Serverless 应用&lt;/p&gt;
        
        &lt;div class="space-y-4 mb-8"&gt;
            &lt;div class="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center gap-3"&gt;
                &lt;span class="text-2xl"&gt;🗄️&lt;/span&gt;
                &lt;div class="flex-1"&gt;
                    &lt;div class="font-bold text-gray-900"&gt;D1 数据库绑定&lt;/div&gt;
                    &lt;div class="text-gray-600 text-sm"&gt;${dbStatus}&lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
            
            &lt;div class="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3"&gt;
                &lt;span class="text-2xl"&gt;☁️&lt;/span&gt;
                &lt;div class="flex-1"&gt;
                    &lt;div class="font-bold text-gray-900"&gt;R2 存储桶绑定&lt;/div&gt;
                    &lt;div class="text-gray-600 text-sm"&gt;${r2Status}&lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
            
            &lt;div class="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center gap-3"&gt;
                &lt;span class="text-2xl"&gt;🔐&lt;/span&gt;
                &lt;div class="flex-1"&gt;
                    &lt;div class="font-bold text-gray-900"&gt;环境变量配置&lt;/div&gt;
                    &lt;div class="text-gray-600 text-sm"&gt;${adminPass}&lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
            
            &lt;div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-3"&gt;
                &lt;span class="text-2xl"&gt;🌐&lt;/span&gt;
                &lt;div class="flex-1"&gt;
                    &lt;div class="font-bold text-gray-900"&gt;R2 公网访问地址&lt;/div&gt;
                    &lt;div class="text-gray-600 text-sm"&gt;${r2PublicUrl}&lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
        
        &lt;div class="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 border border-orange-200"&gt;
            &lt;h3 class="font-bold text-gray-900 mb-2 text-lg"&gt;🎉 验证方法&lt;/h3&gt;
            &lt;ol class="text-gray-700 space-y-2 text-sm"&gt;
                &lt;li&gt;1. 访问 &lt;code class="bg-white px-2 py-1 rounded font-mono text-orange-600"&gt;/force-dynamic&lt;/code&gt; 看到此页面 = 动态验证通过&lt;/li&gt;
                &lt;li&gt;2. 然后去 Pages 设置 → 绑定，就能看到 D1/R2 绑定选项了！&lt;/li&gt;
                &lt;li&gt;3. 配置好所有绑定后，继续部署完整项目&lt;/li&gt;
            &lt;/ol&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
    `;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html;charset=utf-8"
        }
    });
}

