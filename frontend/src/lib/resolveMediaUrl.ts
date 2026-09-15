/** Serve uploaded media through the frontend's same-origin /api/media/file route.
 * The API sends Cross-Origin-Resource-Policy: same-origin, so an absolute
 * api.bestkids.es URL cannot be embedded from bestkids.es even when it is 200.
 */
export function resolveMediaUrl(url?: string | null): string {
    if (!url) return '';
    if (url.startsWith('/api/media/file/')) return url;

    try {
        const parsed = new URL(url);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl && parsed.origin === new URL(apiUrl).origin && parsed.pathname.startsWith('/api/media/file/')) {
            return `${parsed.pathname}${parsed.search}`;
        }
    } catch {
        // Relative non-media paths and data URLs are already browser-resolvable.
    }

    return url;
}
