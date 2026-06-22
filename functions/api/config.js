// functions/api/config.js - Cloudflare Pages Function for KV config flags

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
    const { request, env } = context;

    // OPTIONS preflight
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    try {
        const config = {
            SYSTEM_LANG: "zh-CN",
            ACTIVE_STATUS: "AE + AI 辅助内容生成",
            WECHAT_ID: "XiaoXi_Design",
            EMAIL: "hello@xiaoxistudio.com",
            DOWNLOAD_CV_URL: "#"
        };

        // If KV is configured, fetch keys to override defaults
        if (env.CONFIG_KV) {
            const [lang, status, wechat, email, cvUrl] = await Promise.all([
                env.CONFIG_KV.get("SYSTEM_LANG"),
                env.CONFIG_KV.get("ACTIVE_STATUS"),
                env.CONFIG_KV.get("WECHAT_ID"),
                env.CONFIG_KV.get("EMAIL"),
                env.CONFIG_KV.get("DOWNLOAD_CV_URL")
            ]);

            if (lang) config.SYSTEM_LANG = lang;
            if (status) config.ACTIVE_STATUS = status;
            if (wechat) config.WECHAT_ID = wechat;
            if (email) config.EMAIL = email;
            if (cvUrl) config.DOWNLOAD_CV_URL = cvUrl;
        } else {
            console.log("KV binding CONFIG_KV not detected. Serving default config.");
        }

        return new Response(JSON.stringify(config), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json;charset=UTF-8",
                "Cache-Control": "public, max-age=300" // Cache for 5 minutes
            }
        });
    } catch (err) {
        console.error("KV fetch failed:", err);
        return new Response(
            JSON.stringify({ error: "KV store error", message: err.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
}
