// functions/api/upload.js - Cloudflare Pages Function for R2 uploads
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

    if (request.method !== "POST") {
        return new Response(
            JSON.stringify({ error: "Only POST requests are allowed on this upload endpoint." }),
            {
                status: 405,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }

    try {
        if (!env.MY_R2_BUCKET) {
            return new Response(
                JSON.stringify({ error: "R2 bucket binding 'MY_R2_BUCKET' is missing." }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return new Response(
                JSON.stringify({ error: "No file was uploaded or file type is invalid." }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        // Get category query parameter to form a standard filename
        const url = new URL(request.url);
        const categoryParam = url.searchParams.get("category") || "media";
        
        // Map categories to concise slugs for filenames
        const categoryMap = {
            "创意视频": "creative",
            "TVC": "tvc",
            "MG动画": "mg",
            "TikTok": "tiktok",
            "creative": "creative",
            "tvc": "tvc",
            "mg": "mg",
            "tiktok": "tiktok"
        };
        const catSlug = categoryMap[categoryParam] || "media";
        const timestamp = Date.now();
        const extension = file.name.split('.').pop() || "bin";
        const filename = `xiaoxi_${catSlug}_${timestamp}.${extension}`;
        const mimeType = file.type || "application/octet-stream";

        const fileBuffer = await file.arrayBuffer();

        // Put into R2 bucket
        await env.MY_R2_BUCKET.put(filename, fileBuffer, {
            httpMetadata: {
                contentType: mimeType,
                cacheControl: "public, max-age=31536000, immutable",
            }
        });

        const r2Host = env.R2_PUBLIC_DOMAIN || `https://media.xiaoxistudio.com`;
        const fileUrl = `${r2Host.replace(/\/$/, "")}/${filename}`;

        return new Response(
            JSON.stringify({ 
                success: true, 
                filename, 
                mediaUrl: fileUrl 
            }),
            {
                status: 200,
                headers: { 
                    ...corsHeaders, 
                    "Content-Type": "application/json" 
                }
            }
        );
    } catch (err) {
        console.error("R2 upload error:", err);
        return new Response(
            JSON.stringify({ error: "R2 media upload execution error", message: err.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
}
