// functions/api/projects.js - Cloudflare Pages D1 Projects handler

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
    const { request, env } = context;
    const method = request.method;

    if (method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    if (!env.DB) {
        return new Response(
            JSON.stringify({ error: "D1 Database binding 'DB' is missing from the Environment." }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }

    if (method === "GET") {
        return handleGet(request, env.DB);
    } else if (method === "POST") {
        return handlePost(request, env.DB);
    } else if (method === "DELETE") {
        return handleDelete(request, env.DB);
    } else {
        return new Response(
            JSON.stringify({ error: `Method ${method} not allowed.` }),
            {
                status: 405,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
}

async function handleGet(request, db) {
    try {
        const url = new URL(request.url);
        const categorySlug = url.searchParams.get("category_slug") || url.searchParams.get("category");

        let results;
        if (categorySlug && categorySlug !== "全部" && categorySlug !== "all") {
            const stmt = db.prepare(`
                SELECT p.*, c.name AS category_name, c.badge AS category_badge 
                FROM projects p 
                LEFT JOIN categories c ON p.category_slug = c.slug 
                WHERE p.category_slug = ? OR c.name = ?
                ORDER BY p.sequence_id ASC
            `);
            const dbResult = await stmt.bind(categorySlug, categorySlug).all();
            results = dbResult.results;
        } else {
            const stmt = db.prepare(`
                SELECT p.*, c.name AS category_name, c.badge AS category_badge 
                FROM projects p 
                LEFT JOIN categories c ON p.category_slug = c.slug 
                ORDER BY p.sequence_id ASC
            `);
            const dbResult = await stmt.all();
            results = dbResult.results;
        }

        const projects = results.map(row => ({
            id: row.id,
            sequence_id: row.sequence_id,
            title: row.title,
            description: row.description,
            categorySlug: row.category_slug,
            category: row.category_name || "未分类",
            badge: row.category_badge || "",
            mediaType: row.media_type,
            mediaUrl: row.media_url,
            detailUrl: row.detail_url || "#"
        }));

        return new Response(JSON.stringify(projects), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json;charset=UTF-8"
            }
        });
    } catch (err) {
        console.error("GET Projects error:", err);
        return new Response(
            JSON.stringify({ error: "Database read error", message: err.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
}

async function handlePost(request, db) {
    try {
        const body = await request.json();
        const { sequence_id, title, description, categorySlug, mediaType, mediaUrl, detailUrl } = body;

        if (!title || !categorySlug || !mediaType || !mediaUrl) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: 'title', 'categorySlug', 'mediaType', and 'mediaUrl' are required." }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        // Verify that the category_slug actually exists in the categories table
        const catStmt = db.prepare("SELECT slug FROM categories WHERE slug = ?");
        const categoryExists = await catStmt.bind(categorySlug).first();
        if (!categoryExists) {
            return new Response(
                JSON.stringify({ error: `Category slug '${categorySlug}' does not exist. Create the category first.` }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        // Determine sequence ID (if not provided, increment by finding max sequence_id or using timestamp)
        let seqId = parseInt(sequence_id, 10);
        if (isNaN(seqId)) {
            try {
                const maxStmt = db.prepare("SELECT MAX(sequence_id) as maxSeq FROM projects");
                const maxResult = await maxStmt.first();
                seqId = maxResult && maxResult.maxSeq ? maxResult.maxSeq + 1 : 1;
            } catch (seqErr) {
                console.warn("Failed to automatically get max sequence_id, defaulting to timestamp:", seqErr);
                seqId = Math.floor(Date.now() / 1000);
            }
        }

        const stmt = db.prepare(`
            INSERT INTO projects (sequence_id, title, description, category_slug, media_type, media_url, detail_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const dbResult = await stmt.bind(
            seqId,
            title,
            description || "",
            categorySlug,
            mediaType,
            mediaUrl,
            detailUrl || "#"
        ).run();

        return new Response(
            JSON.stringify({ 
                success: true, 
                message: "Project successfully created in D1 database.", 
                insertedId: dbResult.meta.last_row_id || null 
            }),
            {
                status: 201,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    } catch (err) {
        console.error("POST Project error:", err);
        return new Response(
            JSON.stringify({ error: "Database write error", message: err.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
}

async function handleDelete(request, db) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return new Response(
                JSON.stringify({ error: "Missing required query parameter 'id'." }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        const stmt = db.prepare("DELETE FROM projects WHERE id = ?");
        await stmt.bind(parseInt(id, 10)).run();

        return new Response(
            JSON.stringify({ success: true, message: `Project ID ${id} deleted successfully.` }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    } catch (err) {
        console.error("DELETE Project error:", err);
        return new Response(
            JSON.stringify({ error: "Database delete error", message: err.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
}
