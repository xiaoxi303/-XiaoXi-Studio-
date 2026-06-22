// functions/api/_middleware.js
// Cloudflare Pages Middleware — HTTP Basic Auth guard for all mutating API calls
// Applies to every request under /api/* (GET is public, POST/DELETE/PUT/PATCH require auth)

function checkBasicAuth(request, env) {
    const authHeader = request.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Basic ')) {
        return false;
    }
    try {
        const decoded = atob(authHeader.slice(6));
        const colonIdx = decoded.indexOf(':');
        if (colonIdx === -1) return false;
        const username = decoded.slice(0, colonIdx);
        const password = decoded.slice(colonIdx + 1);
        // Username is fixed; password comes from env.ADMIN_PASSWORD (or hardcoded fallback for local dev)
        const expectedPassword = (env && env.ADMIN_PASSWORD) ? env.ADMIN_PASSWORD : 'admin123';
        return username === 'xiaoxi' && password === expectedPassword;
    } catch (e) {
        return false;
    }
}

export async function onRequest(context) {
    const { request, env, next } = context;
    const method = request.method;

    // Preflight CORS — always allow
    if (method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    }

    // Mutating methods require authentication
    if (['POST', 'DELETE', 'PUT', 'PATCH'].includes(method)) {
        if (!checkBasicAuth(request, env)) {
            return new Response(JSON.stringify({ error: 'Unauthorized. Valid HTTP Basic Auth credentials required.' }), {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="XiaoXi Studio Admin API"',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }
    }

    // Pass through to the actual API handler
    return next();
}
