'use client';
import { useState, useMemo, useCallback } from 'react';
import type { WishlistItem } from '@/lib/types';
import { WishlistCard } from './WishlistCard';
import { FilterBar } from './FilterBar';
import { ItemModal } from './ItemModal';
import { AddItemModal } from './AddItemModal';

export function GalleryClient({ initialItems }: { initialItems: WishlistItem[] }) {
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [selected, setSelected] = useState<WishlistItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [filters, setFilters] = useState({ q: '', platform: '', category: '', status: '' });
  const [sort, setSort] = useState<'created_at' | 'price_asc' | 'price_desc'>('created_at');

  const filtered = useMemo(() => {
    let f = items.filter(item => {
      if (filters.q && !item.title.toLowerCase().includes(filters.q.toLowerCase()) && !(item.brand ?? '').toLowerCase().includes(filters.q.toLowerCase())) return false;
      if (filters.platform && item.platform !== filters.platform) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
    if (sort === 'price_asc') f = [...f].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === 'price_desc') f = [...f].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return f;
  }, [items, filters, sort]);

  const handleUpdate = useCallback((updated: WishlistItem) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    setSelected(null);
  }, []);
  const handleAdd = useCallback((newItem: WishlistItem) => {
    setItems(prev => [newItem, ...prev]);
    setAddOpen(false);
  }, []);
  const handleDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setSelected(null);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Wishlist</h1>
          <p className="text-sm text-neutral-400 mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-purple-200"
        >+ Add item</button>
      </div>
      <FilterBar filters={filters} onChange={setFilters} sort={sort} onSortChange={setSort} />
      {filtered.length === 0 ? (
        <div className="text-center py-32">
          <div className="text-5xl mb-4">👗</div>
          <p className="text-neutral-500 font-medium">No items found</p>
          <p className="text-neutral-400 text-sm mt-1">Add items manually or install the Chrome extension</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 mt-4">
          {filtered.map(item => (
            <WishlistCard key={item.id} item={item} onClick={() => setSelected(item)} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
      {selected && <ItemModal item={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} onDelete={handleDelete} />}
      {addOpen && <AddItemModal onClose={() => setAddOpen(false)} onAdd={handleAdd} />}
    </div>
  );
}
