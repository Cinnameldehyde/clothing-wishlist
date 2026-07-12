'use client';
import { useState } from 'react';
import type { WishlistItem } from '@/lib/types';
import { STATUSES, CATEGORIES, PRIORITIES } from '@/lib/types';
export function ItemTable({ initialItems }: { initialItems: WishlistItem[] }) {
  const [items, setItems] = useState(initialItems);
  const update = async (id: string, field: string, value: unknown) => {
    setItems(prev=>prev.map(i=>i.id===id?{...i,[field]:value}:i));
    await fetch(`/api/items/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({[field]:value})});
  };
  const del = async (id: string) => {
    if(!confirm('Delete?')) return;
    setItems(prev=>prev.filter(i=>i.id!==id));
    await fetch(`/api/items/${id}`,{method:'DELETE'});
  };
  const sel = 'rounded-lg border border-neutral-200 px-2 py-1 text-xs bg-white outline-none focus:ring-1 focus:ring-purple-300 cursor-pointer';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">List View</h1>
        <p className="text-sm text-neutral-400">{items.length} items</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-neutral-100 bg-neutral-50">
              {['','Title','Platform','Category','Status','Price','Priority','Size',''].map(h=>(
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {items.map(item=>(
                <tr key={item.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors group">
                  <td className="py-3 px-4">
                    {item.image_urls?.[0]?<img src={item.image_urls[0]} alt="" className="w-10 h-10 rounded-xl object-cover"/>:<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100"/>}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <a href={item.product_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-800 hover:text-purple-700 line-clamp-1">{item.title}</a>
                    {item.brand&&<p className="text-xs text-neutral-400 mt-0.5">{item.brand}</p>}
                  </td>
                  <td className="py-3 px-4"><span className="text-xs capitalize bg-neutral-100 text-neutral-600 px-2 py-1 rounded-lg">{item.platform}</span></td>
                  <td className="py-3 px-4"><select value={item.category} onChange={e=>update(item.id,'category',e.target.value)} className={sel}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></td>
                  <td className="py-3 px-4"><select value={item.status} onChange={e=>update(item.id,'status',e.target.value)} className={sel}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></td>
                  <td className="py-3 px-4 font-bold text-purple-700 whitespace-nowrap">{item.price?`₹${item.price.toLocaleString('en-IN')}`:'-'}</td>
                  <td className="py-3 px-4"><select value={item.priority} onChange={e=>update(item.id,'priority',e.target.value)} className={sel}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select></td>
                  <td className="py-3 px-4 text-neutral-500 text-xs">{item.size??'-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={item.product_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-600 hover:bg-purple-50">↗</a>
                      <button onClick={()=>del(item.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
