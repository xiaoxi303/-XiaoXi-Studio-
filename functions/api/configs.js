
// functions/api/configs.js - Cloudflare Pages Functions
// 真正承接前端请求，操作控制台一键绑定的 D1
// GET /api/configs?page=home
// POST /api/configs (带 Basic Auth)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status);
}

function checkBasicAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  const expectedPassword = env.ADMIN_PASSWORD || 'admin123';

  if (!authHeader) {
    return false;
  }

  try {
    const decoded = atob(authHeader.slice(6));
    const colonIdx = decoded.indexOf(':');
    if (colonIdx === -1) return false;
    const user = decoded.slice(0, colonIdx);
    const pass = decoded.slice(colonIdx + 1);
    return user === 'xiaoxi' && pass === expectedPassword;
  } catch {
    return false;
  }
}

// ============================================================
// OPTIONS 请求处理
// ============================================================

export async function onRequestOptions(context) {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// ============================================================
// GET /api/configs?page=home - 从一键绑定的 D1 数据库读取平铺配置
// ============================================================

export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const page = searchParams.get('page') || 'home';
  const keysParam = searchParams.get('keys');
  const db = context.env.DB;

  if (!db) {
    return errorResponse('D1 Database binding "DB" is missing', 500);
  }

  try {
    let results;

    if (keysParam) {
      const keyList = keysParam.split(',').map(k => k.trim()).filter(Boolean);
      if (keyList.length === 0) {
        return jsonResponse({});
      }
      const placeholders = keyList.map(() => '?').join(', ');
      const stmt = db.prepare(`SELECT config_key, config_value FROM site_configs WHERE config_key IN (${placeholders})`);
      const { results: queryResults } = await stmt.bind(...keyList).all();
      results = queryResults;
    } else if (page) {
      const stmt = db.prepare('SELECT config_key, config_value FROM site_configs WHERE page_name = ? ORDER BY id ASC');
      const { results: queryResults } = await stmt.bind(page).all();
      results = queryResults;
    } else {
      const stmt = db.prepare('SELECT page_name, section_id, config_key, config_value FROM site_configs ORDER BY page_name, id ASC');
      const { results: queryResults } = await stmt.all();

      const grouped = {};
      for (const row of queryResults) {
        if (!grouped[row.page_name]) grouped[row.page_name] = {};
        grouped[row.page_name][row.config_key] = row.config_value;
      }
      return jsonResponse(grouped);
    }

    const configMap = {};
    for (const row of results) {
      configMap[row.config_key] = row.config_value;
    }

    return jsonResponse(configMap);
  } catch (err) {
    console.error('[configs GET] Error:', err);
    return errorResponse('Database read error: ' + err.message);
  }
}

// ============================================================
// POST /api/configs - 响应后台 CMS，带 HTTP Basic Auth 密码防御并写入 D1
// ============================================================

export async function onRequestPost(context) {
  const db = context.env.DB;
  const authHeader = context.request.headers.get('Authorization');
  const expectedPassword = context.env.ADMIN_PASSWORD || 'admin123';

  if (!checkBasicAuth(context.request, context.env)) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="XiaoXi CMS"',
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }

  if (!db) {
    return errorResponse('D1 Database binding "DB" is missing', 500);
  }

  try {
    const body = await context.request.json();

    if (Array.isArray(body.configs)) {
      const statements = body.configs.map(item => {
        if (!item.key || item.value === undefined) return null;
        return db.prepare(
          `INSERT OR REPLACE INTO site_configs (page_name, section_id, config_key, config_value, updated_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
        ).bind(
          item.page_name || 'global',
          item.section_id || 'general',
          item.key,
          String(item.value)
        );
      }).filter(Boolean);

      if (statements.length === 0) {
        return errorResponse('No valid config entries in batch', 400);
      }

      await db.batch(statements);
      return jsonResponse({ success: true, updated: statements.length });
    }

    const { key, value, page_name, section_id } = body;

    if (!key || value === undefined) {
      return errorResponse('Missing required fields: "key" and "value" are required', 400);
    }

    await db.prepare(
      `INSERT OR REPLACE INTO site_configs (page_name, section_id, config_key, config_value, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`
    ).bind(
      page_name || 'global',
      section_id || 'general',
      key,
      String(value)
    ).run();

    return jsonResponse({ success: true, key, message: `Config key "${key}" updated successfully" });
  } catch (err) {
    console.error('[configs POST] Error:', err);
    return errorResponse('Database write error: ' + err.message);
  }
}

