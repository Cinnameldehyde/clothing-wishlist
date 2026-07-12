import { NextRequest, NextResponse } from 'next/server';
import type { Platform } from '@/lib/types';

function detectPlatform(hostname: string): Platform {
  if (hostname.includes('amazon')) return 'amazon';
  if (hostname.includes('myntra')) return 'myntra';
  if (hostname.includes('flipkart')) return 'flipkart';
  if (hostname.includes('meesho')) return 'meesho';
  if (hostname.includes('newme')) return 'newme';
  if (hostname.includes('savana')) return 'savana';
  return 'other';
}

function extractOG(html: string): Record<string, string> {
  const result: Record<string, string> = {};
  const re = /<meta[^>]+(?:property|name)=["']([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) result[m[1]] = m[2];
  return result;
}

function extractJsonLdProduct(html: string): Record<string, unknown> | null {
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      const nodes: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) {
        if (!node || typeof node !== 'object') continue;
        const n = node as Record<string, unknown>;
        const t = n['@type'];
        if (t === 'Product' || (Array.isArray(t) && t.includes('Product'))) return n;
        const graph = n['@graph'];
        if (Array.isArray(graph)) {
          for (const g of graph) {
            if (!g || typeof g !== 'object') continue;
            const gn = g as Record<string, unknown>;
            const gt = gn['@type'];
            if (gt === 'Product' || (Array.isArray(gt) && gt.includes('Product'))) return gn;
          }
        }
      }
    } catch { /* skip */ }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });
  let html = '';
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', Accept: 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(8000),
    });
    html = await res.text();
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch URL' }, { status: 502 });
  }
  const og = extractOG(html);
  const product = extractJsonLdProduct(html);
  const parsed = new URL(url);
  const hostname = parsed.hostname.replace(/^www\./, '');
  const platform = detectPlatform(hostname);
  const title = (product?.name as string | undefined) ?? og['og:title'] ?? null;
  const ogImage = og['og:image'] ?? null;
  const imageUrls = ogImage ? [ogImage] : [];
  let price: number | null = null;
  let currency: string | null = 'INR';
  const offers = product?.offers as Record<string, unknown> | undefined;
  if (offers?.price) { price = parseFloat(String(offers.price)); currency = String(offers.priceCurrency ?? 'INR'); }
  else if (og['product:price:amount']) { price = parseFloat(og['product:price:amount']); currency = og['product:price:currency'] ?? 'INR'; }
  const brand = (product?.brand as { name?: string } | undefined)?.name ?? null;
  return NextResponse.json({
    success: true,
    data: { platform, hostname, productUrl: url, title, brand, price: isNaN(price ?? NaN) ? null : price, currency, imageUrls, color: null, availableSizes: null },
  });
}
