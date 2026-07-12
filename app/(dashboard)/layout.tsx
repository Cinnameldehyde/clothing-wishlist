export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { Navbar } from '@/components/Navbar';
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/login');
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userEmail={user!.email ?? ''} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
