'use client';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export function LoginClient() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const signIn = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <div className="relative">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 flex flex-col items-center gap-6 w-full max-w-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">👗</div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">Clothing Wishlist</h1>
            <p className="text-neutral-500 text-sm mt-2 leading-relaxed">Your personal, aesthetic clothing wishlist.<br/>Capture from any store in one click.</p>
          </div>
          <div className="w-full space-y-2 text-xs text-neutral-400">
            {['✦ Smart extraction from Amazon, Myntra & more','✦ Gallery, Board & List views','✦ Track status, size & priority'].map(f => <p key={f}>{f}</p>)}
          </div>
          <button
            onClick={signIn}
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </button>
          <p className="text-xs text-neutral-300">No ads. No tracking. Just your wishlist.</p>
        </div>
      </div>
    </div>
  );
}
