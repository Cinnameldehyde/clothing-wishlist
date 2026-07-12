'use client';
import { CATEGORIES, STATUSES } from '@/lib/types';
const PLATFORMS = ['amazon','myntra','flipkart','meesho','newme','savana','other'];
type Filters = { q: string; platform: string; category: string; status: string };
type SortKey = 'created_at' | 'price_asc' | 'price_desc';
export function FilterBar({ filters, onChange, sort, onSortChange }: {
  filters: Filters; onChange: (f: Filters) => void;
  sort: SortKey; onSortChange: (s: SortKey) => void;
}) {
  const update = (key: keyof Filters, val: string) => onChange({ ...filters, [key]: val });
  const hasActive = Object.values(filters).some(Boolean);
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        className="pl-4 pr-4 py-2 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-purple-300 bg-white w-44"
        placeholder="🔍 Search…" value={filters.q} onChange={e => update('q', e.target.value)}
      />
      {(['platform','category','status'] as (keyof Filters)[]).map(key => (
        <select key={key} value={filters[key]} onChange={e => update(key, e.target.value)}
          className="rounded-xl border border-neutral-200 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-purple-300 capitalize cursor-pointer"
        >
          <option value="">{key.charAt(0).toUpperCase()+key.slice(1)}: All</option>
          {(key==='platform'?PLATFORMS:key==='category'?CATEGORIES:STATUSES).map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ))}
      <select value={sort} onChange={e => onSortChange(e.target.value as SortKey)}
        className="rounded-xl border border-neutral-200 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
      >
        <option value="created_at">Newest first</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
      </select>
      {hasActive && (
        <button onClick={() => onChange({ q:'',platform:'',category:'',status:'' })}
          className="text-sm text-neutral-400 hover:text-neutral-700 px-2 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >× Clear</button>
      )}
    </div>
  );
}
