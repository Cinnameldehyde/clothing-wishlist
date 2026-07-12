'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const TABS = [
  { href: '/gallery', label: '🖼️ Gallery' },
  { href: '/board', label: '📌 Board' },
  { href: '/list', label: '📄 List' },
];

export function Navbar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const signOut = async () => { await supabase.auth.signOut(); router.push('/login'); };
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-base font-bold mr-3 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">👗 Wishlist</span>
          {TABS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === href ? 'bg-purple-100 text-purple-700' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
            >{label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 hidden md:block truncate max-w-[160px]">{userEmail}</span>
          <button onClick={signOut} className="text-xs text-neutral-500 hover:text-red-500 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors">Sign out</button>
        </div>
      </div>
    </header>
  );
}
