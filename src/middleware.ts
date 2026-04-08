import { defineMiddleware } from 'astro:middleware';

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg', 'ico']);
const STATIC_EXTS = new Set(['js', 'css', 'woff', 'woff2', 'ttf', 'otf']);

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const url = new URL(context.request.url);
  const ext = url.pathname.split('.').pop()?.toLowerCase() ?? '';

  if (IMAGE_EXTS.has(ext)) {
    // Images — 1 year + Vary for dynamic format negotiation (jpg/webp/avif)
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('Vary', 'Accept');

  } else if (STATIC_EXTS.has(ext)) {
    // JS, CSS, fonts — 1 year, no Vary needed
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  } else {
    // HTML — browser revalidates every time, Cloudflare edge caches 7 days
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate, s-maxage=604800');
  }

  return response;
});