// functions/api/configs.js — Cloudflare Pages D1 Site Configs REST handler
// GET  /api/configs?page=home        → { key: value, ... } flat object for the page
// GET  /api/configs?keys=k1,k2,...   → { key: value, ... } for specific keys
// POST /api/configs { key, value }   → INSERT OR REPLACE (upsert) a single config key
// POST /api/configs { configs: [{key,value},...] } → batch upsert

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json;charset=UTF-8' }
    });
}

function errorResponse(message, status = 500) {
    return jsonResponse({ error: message }, status);
}

export async function onRequest(context) {
    const { request, env } = context;
    const method = request.method;

    if (method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!env.DB) {
        return errorResponse("D1 Database binding 'DB' is missing from the environment.");
    }

    if (method === 'GET') {
        return handleGet(request, env.DB);
    } else if (method === 'POST') {
        return handlePost(request, env.DB);
    } else {
        return errorResponse(`Method ${method} not allowed.`, 405);
    }
}

// GET handler: query by page_name or by specific keys
async function handleGet(request, db) {
    try {
        const url = new URL(request.url);
        const page = url.searchParams.get('page');
        const keysParam = url.searchParams.get('keys');

        let rows;

        if (keysParam) {
            // Batch fetch by explicit keys: /api/configs?keys=k1,k2,k3
            const keyList = keysParam.split(',').map(k => k.trim()).filter(Boolean);
            if (keyList.length === 0) {
                return jsonResponse({});
            }
            // Build parameterized query for IN clause
            const placeholders = keyList.map(() => '?').join(', ');
            const stmt = db.prepare(`SELECT config_key, config_value FROM site_configs WHERE config_key IN (${placeholders})`);
            const result = await stmt.bind(...keyList).all();
            rows = result.results;
        } else if (page) {
            // Fetch all configs for a page: /api/configs?page=home
            const stmt = db.prepare('SELECT config_key, config_value FROM site_configs WHERE page_name = ? ORDER BY id ASC');
            const result = await stmt.bind(page).all();
            rows = result.results;
        } else {
            // No filter — return all configs (admin use)
            const stmt = db.prepare('SELECT page_name, section_id, config_key, config_value, updated_at FROM site_configs ORDER BY page_name, id ASC');
            const result = await stmt.all();
            // Group by page_name for admin overview
            const grouped = {};
            for (const row of result.results) {
                if (!grouped[row.page_name]) grouped[row.page_name] = {};
                grouped[row.page_name][row.config_key] = row.config_value;
            }
            return jsonResponse(grouped);
        }

        // Flatten to { key: value } object
        const flat = {};
        for (const row of rows) {
            flat[row.config_key] = row.config_value;
        }
        return jsonResponse(flat);

    } catch (err) {
        console.error('[configs GET] Error:', err);
        return errorResponse(`Database read error: ${err.message}`);
    }
}

// POST handler: upsert one or many config values
async function handlePost(request, db) {
    try {
        const body = await request.json();

        // Batch mode: { configs: [{ key, value, page_name?, section_id? }, ...] }
        if (Array.isArray(body.configs)) {
            const statements = body.configs.map(item => {
                if (!item.key || item.value === undefined) return null;
                return db.prepare(
                    `INSERT INTO site_configs (page_name, section_id, config_key, config_value, updated_at)
                     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                     ON CONFLICT(config_key) DO UPDATE SET
                         config_value = excluded.config_value,
                         updated_at   = CURRENT_TIMESTAMP`
                ).bind(
                    item.page_name  || 'global',
                    item.section_id || 'general',
                    item.key,
                    String(item.value)
                );
            }).filter(Boolean);

            if (statements.length === 0) {
                return errorResponse('No valid config entries in batch.', 400);
            }

            // Execute as a batch
            await db.batch(statements);
            return jsonResponse({ success: true, updated: statements.length });
        }

        // Single mode: { key, value, page_name?, section_id? }
        const { key, value, page_name, section_id } = body;

        if (!key || value === undefined) {
            return errorResponse("Missing required fields: 'key' and 'value' are required.", 400);
        }

        await db.prepare(
            `INSERT INTO site_configs (page_name, section_id, config_key, config_value, updated_at)
             VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(config_key) DO UPDATE SET
                 config_value = excluded.config_value,
                 updated_at   = CURRENT_TIMESTAMP`
        ).bind(
            page_name  || 'global',
            section_id || 'general',
            key,
            String(value)
        ).run();

        return jsonResponse({ success: true, key, message: `Config key '${key}' updated successfully.` });

    } catch (err) {
        console.error('[configs POST] Error:', err);
        return errorResponse(`Database write error: ${err.message}`);
    }
}
