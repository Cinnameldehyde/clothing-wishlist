export const dynamic = 'force-dynamic';
import { createClient, getUser } from '@/lib/supabase/server';
import { KanbanBoard } from '@/components/KanbanBoard';
import { STATUSES } from '@/lib/types';
export default async function BoardPage() {
  const user = await getUser();
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('wishlist_items').select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });
  const grouped = Object.fromEntries(
    STATUSES.map(s => [s, (items ?? []).filter((i: { status: string }) => i.status === s)])
  );
  return <KanbanBoard initialGrouped={grouped} statuses={STATUSES} />;
}
