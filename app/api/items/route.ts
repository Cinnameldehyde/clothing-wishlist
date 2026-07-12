import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

function makeSupabase(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    }
  );
}

export async function GET(req: NextRequest) {
  const supabase = makeSupabase(req);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sp = req.nextUrl.searchParams;
  let query = supabase.from('wishlist_items').select('*').eq('user_id', user.id);
  if (sp.get('platform')) query = query.eq('platform', sp.get('platform')!);
  if (sp.get('category')) query = query.eq('category', sp.get('category')!);
  if (sp.get('status')) query = query.eq('status', sp.get('status')!);
  if (sp.get('q')) query = query.ilike('title', `%${sp.get('q')}%`);
  const asc = sp.get('dir') === 'asc';
  query = query.order('created_at', { ascending: asc });
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = makeSupabase(req);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { data: existing } = await supabase
    .from('wishlist_items').select('id')
    .eq('user_id', user.id).eq('product_url', body.product_url).maybeSingle();
  if (existing) {
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', existing.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 200 });
  }
  const { data, error } = await supabase
    .from('wishlist_items').insert({ ...body, user_id: user.id }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
