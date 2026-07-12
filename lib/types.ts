export type Platform = 'amazon' | 'myntra' | 'flipkart' | 'meesho' | 'newme' | 'savana' | 'other';
export type Category =
  | 'Regular top' | 'Crop top' | 'Skirt' | 'Shorts'
  | 'Mid dress' | 'Long dress' | 'T-shirt' | 'Shirt'
  | 'Jeans / Trousers' | 'Co-ord set' | 'Ethnic'
  | 'Outerwear' | 'Footwear' | 'Accessories';
export type Status =
  | 'Saved' | 'Need review' | 'Maybe'
  | 'Waiting for sale' | 'Bought' | 'Not buying';
export type Priority = 'Low' | 'Medium' | 'High';

export type WishlistItem = {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  category: string;
  status: string;
  product_url: string;
  hostname: string;
  price: number | null;
  currency: string | null;
  image_urls: string[];
  brand: string | null;
  color: string | null;
  size: string | null;
  available_sizes: string[] | null;
  priority: Priority;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const CATEGORIES: Category[] = [
  'Regular top','Crop top','Skirt','Shorts','Mid dress','Long dress',
  'T-shirt','Shirt','Jeans / Trousers','Co-ord set','Ethnic','Outerwear','Footwear','Accessories',
];
export const STATUSES: Status[] = [
  'Saved','Need review','Maybe','Waiting for sale','Bought','Not buying',
];
export const PRIORITIES: Priority[] = ['Low','Medium','High'];

export function suggestCategory(title: string): Category {
  const t = title.toLowerCase();
  if (t.includes('crop')) return 'Crop top';
  if (t.includes('skirt')) return 'Skirt';
  if (t.includes('shorts')) return 'Shorts';
  if (t.includes('t-shirt') || t.includes('tee') || t.includes('tshirt')) return 'T-shirt';
  if (t.includes('kurta') || t.includes('saree') || t.includes('lehenga') || t.includes('salwar')) return 'Ethnic';
  if (t.includes('co-ord') || t.includes('coord')) return 'Co-ord set';
  if (t.includes('maxi') || t.includes('gown')) return 'Long dress';
  if (t.includes('midi')) return 'Mid dress';
  if (t.includes('dress')) return 'Mid dress';
  if (t.includes('jacket') || t.includes('coat') || t.includes('hoodie') || t.includes('blazer')) return 'Outerwear';
  if (t.includes('heels') || t.includes('sneakers') || t.includes('shoes') || t.includes('sandals') || t.includes('boots')) return 'Footwear';
  if (t.includes('bag') || t.includes('belt') || t.includes('earring') || t.includes('necklace') || t.includes('watch')) return 'Accessories';
  if (t.includes('jeans') || t.includes('trouser') || t.includes('pants')) return 'Jeans / Trousers';
  if (t.includes('shirt')) return 'Shirt';
  return 'Regular top';
}
