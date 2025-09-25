import { NextResponse } from 'next/server';

/**
 * Soft rate limit: 10 requests per 10 minutes per IP to /api/contact
 * Note: This is best-effort in serverless; for stronger guarantees use a KV/Redis.
 */
const BUCKET = new Map();

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname !== '/api/contact') return NextResponse.next();

  const ip = req.ip || req.headers.get('x-forwarded-for') || 'anon';
  const windowKey = `${ip}:${Math.floor(Date.now() / (10 * 60 * 1000))}`; // 10-min window
  const count = (BUCKET.get(windowKey) ?? 0) + 1;
  BUCKET.set(windowKey, count);

  if (count > 10) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/contact']
};
