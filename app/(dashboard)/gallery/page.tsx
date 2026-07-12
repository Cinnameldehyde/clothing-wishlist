export const dynamic = 'force-dynamic';
import { createClient, getUser } from '@/lib/supabase/server';
import { GalleryClient } from '@/components/GalleryClient';
export default async function GalleryPage() {
  const user = await getUser();
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('wishlist_items').select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });
  return <GalleryClient initialItems={items ?? []} />;
}
