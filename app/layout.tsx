import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Clothing Wishlist ✨',
  description: 'Your aesthetic, smart clothing wishlist.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
