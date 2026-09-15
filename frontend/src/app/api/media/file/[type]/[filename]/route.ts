import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const allowedTypes = new Set(['images', 'audio', 'video', 'documents']);
const safeFilename = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

/** Same-origin media proxy. The backend's same-origin CORP header is valid for
 * api.bestkids.es but blocks image embedding when its response is rewritten
 * through bestkids.es. Only forward content headers, not backend CSP/CORP.
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ type: string; filename: string }> }
) {
    const { type, filename } = await params;
    if (!allowedTypes.has(type) || !safeFilename.test(filename) || filename.includes('..')) {
        return new Response('Archivo no válido', { status: 400 });
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBase) return new Response('API no configurada', { status: 503 });

    try {
        const upstream = await fetch(`${apiBase}/media/file/${type}/${filename}`, { cache: 'no-store' });
        if (!upstream.ok || !upstream.body) {
            return new Response('Archivo no disponible', { status: upstream.status === 404 ? 404 : 502 });
        }

        const headers = new Headers();
        headers.set('Content-Type', upstream.headers.get('Content-Type') || 'application/octet-stream');
        headers.set('Cache-Control', 'public, max-age=3600');
        const length = upstream.headers.get('Content-Length');
        if (length) headers.set('Content-Length', length);
        return new Response(upstream.body, { status: 200, headers });
    } catch {
        return new Response('Error al obtener el archivo', { status: 502 });
    }
}
