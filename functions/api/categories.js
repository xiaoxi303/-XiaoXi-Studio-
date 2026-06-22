// functions/api/categories.js - Cloudflare Pages D1 Categories handler

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
        return handleGet(env.DB);
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

async function handleGet(db) {
    try {
        const stmt = db.prepare("SELECT * FROM categories ORDER BY id ASC");
        const { results } = await stmt.all();

        return new Response(JSON.stringify(results), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json;charset=UTF-8"
            }
        });
    } catch (err) {
        console.error("GET Categories error:", err);
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
        const { slug, name, badge } = body;

        if (!slug || !name) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: 'slug' and 'name' are required." }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        // Validate slug is alphanumeric or has hyphens, and convert to lowercase
        const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
        if (!cleanSlug) {
            return new Response(
                JSON.stringify({ error: "Invalid slug format. Must contain alphanumeric characters, hyphens or underscores." }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        const stmt = db.prepare("INSERT INTO categories (slug, name, badge) VALUES (?, ?, ?)");
        const dbResult = await stmt.bind(cleanSlug, name, badge || "").run();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Category created successfully.",
                insertedId: dbResult.meta.last_row_id || null
            }),
            {
                status: 201,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    } catch (err) {
        console.error("POST Category error:", err);
        if (err.message.includes("UNIQUE constraint failed")) {
            return new Response(
                JSON.stringify({ error: "Category slug already exists. Please choose a unique slug." }),
                {
                    status: 409,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }
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
                JSON.stringify({ error: "Missing required parameter 'id'." }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                }
            );
        }

        // First check if any projects reference this category's slug to avoid SQL constraints crash
        // and return a clear error to the UI
        const catStmt = db.prepare("SELECT slug FROM categories WHERE id = ?");
        const category = await catStmt.bind(parseInt(id, 10)).first();
        
        if (category) {
            const checkStmt = db.prepare("SELECT COUNT(*) as count FROM projects WHERE category_slug = ?");
            const checkRes = await checkStmt.bind(category.slug).first();
            if (checkRes && checkRes.count > 0) {
                return new Response(
                    JSON.stringify({ 
                        error: "Cannot delete category: projects are currently associated with it.",
                        associatedProjects: checkRes.count 
                    }),
                    {
                        status: 409,
                        headers: { ...corsHeaders, "Content-Type": "application/json" }
                    }
                );
            }
        }

        const stmt = db.prepare("DELETE FROM categories WHERE id = ?");
        await stmt.bind(parseInt(id, 10)).run();

        return new Response(
            JSON.stringify({ success: true, message: `Category ID ${id} deleted successfully.` }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    } catch (err) {
        console.error("DELETE Category error:", err);
        return new Response(
            JSON.stringify({ error: "Database delete error", message: err.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
}
