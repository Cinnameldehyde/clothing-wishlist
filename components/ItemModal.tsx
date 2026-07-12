'use client';
import { useState } from 'react';
import type { WishlistItem, Priority } from '@/lib/types';
import { CATEGORIES, STATUSES, PRIORITIES } from '@/lib/types';

const PRIORITY_BADGE: Record<Priority,string> = { High:'bg-red-100 text-red-600',Medium:'bg-amber-100 text-amber-600',Low:'bg-green-100 text-green-600' };
const sel = 'w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-purple-300';

export function ItemModal({ item, onClose, onUpdate, onDelete }: {
  item: WishlistItem; onClose: ()=>void; onUpdate: (u:WishlistItem)=>void; onDelete: (id:string)=>void;
}) {
  const [form, setForm] = useState(item);
  const [imgIdx, setImgIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const f = (field: Partial<WishlistItem>) => setForm(prev=>({...prev,...field}));

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/items/${item.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    if(res.ok) onUpdate(await res.json());
    setSaving(false);
  };
  const del = async () => {
    if(!confirm('Delete this item?')) return;
    await fetch(`/api/items/${item.id}`,{method:'DELETE'});
    onDelete(item.id);
  };

  const imgs = form.image_urls ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-4">
              <p className="text-xs text-neutral-400 capitalize mb-1">{item.platform} · {item.hostname}</p>
              <h2 className="text-base font-bold text-neutral-900 leading-tight line-clamp-2">{item.title}</h2>
              {item.brand&&<p className="text-sm text-neutral-500 mt-0.5">{item.brand}</p>}
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 text-xl leading-none">×</button>
          </div>

          {imgs.length > 0 && (
            <div className="relative mb-4 rounded-2xl overflow-hidden bg-neutral-50 h-52">
              {imgs[imgIdx] && <img src={imgs[imgIdx]} alt="" className="w-full h-full object-contain"/>}
              {imgs.length > 1 && (
                <>
                  <button onClick={()=>setImgIdx(i=>Math.max(0,i-1))} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow text-sm">‹</button>
                  <button onClick={()=>setImgIdx(i=>Math.min(imgs.length-1,i+1))} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow text-sm">›</button>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {imgs.map((_,i)=><button key={i} onClick={()=>setImgIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i===imgIdx?'bg-purple-600 w-3':'bg-neutral-300'}`}/>)}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            {form.price&&<span className="text-lg font-bold text-purple-700">₹{form.price.toLocaleString('en-IN')}</span>}
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ml-auto ${PRIORITY_BADGE[form.priority]}`}>{form.priority} priority</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {([
              ['Category','category',CATEGORIES],
              ['Status','status',STATUSES],
              ['Priority','priority',PRIORITIES],
            ] as [string,string,string[]][]).map(([label,field,opts])=>(
              <div key={field} className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{label}</label>
                <select className={sel} value={(form as Record<string,unknown>)[field] as string}
                  onChange={e=>f({[field]:e.target.value} as Partial<WishlistItem>)}>
                  {opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Size</label>
              {form.available_sizes?.length ? (
                <select className={sel} value={form.size??''} onChange={e=>f({size:e.target.value})}>
                  <option value="">--</option>
                  {form.available_sizes.map(s=><option key={s}>{s}</option>)}
                </select>
              ):(<input className={sel} value={form.size??''} onChange={e=>f({size:e.target.value})} placeholder="e.g. M"/>)}
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Notes</label>
            <textarea className={`${sel} resize-none`} rows={2} value={form.notes??''} onChange={e=>f({notes:e.target.value})} placeholder="Add notes…"/>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={del} className="p-2.5 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">🗑️</button>
            <a href={item.product_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >View ↗</a>
            <button onClick={save} disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >{saving?'Saving…':'Save changes'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
