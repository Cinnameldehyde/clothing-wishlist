'use client';
import { useState } from 'react';
import type { WishlistItem, Category, Status, Priority } from '@/lib/types';
import { CATEGORIES, STATUSES, PRIORITIES, suggestCategory } from '@/lib/types';

export function AddItemModal({ onClose, onAdd }: { onClose: ()=>void; onAdd: (item:WishlistItem)=>void }) {
  const [url, setUrl] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');
  const [form, setForm] = useState<Partial<WishlistItem>>({
    platform:'other',category:'Regular top',status:'Saved',priority:'Medium',
    image_urls:[],price:null,brand:null,color:null,size:null,available_sizes:null,notes:null,currency:'INR',
  });
  const [saving, setSaving] = useState(false);
  const f = (field: Partial<WishlistItem>) => setForm(prev=>({...prev,...field}));
  const sel = 'w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-purple-300';

  const extract = async () => {
    if(!url.trim()) return;
    setExtracting(true); setExtractError('');
    try {
      const res = await fetch('/api/extract',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});
      const data = await res.json();
      if(data.success&&data.data) {
        const d = data.data;
        f({title:d.title??'',brand:d.brand,price:d.price,currency:d.currency,color:d.color,
           image_urls:d.imageUrls,platform:d.platform,hostname:d.hostname,product_url:url,
           available_sizes:d.availableSizes,category:d.title?suggestCategory(d.title):'Regular top'});
      } else setExtractError('Could not extract info. Please fill in manually.');
    } catch { setExtractError('Failed to fetch URL.'); }
    setExtracting(false);
  };

  const save = async () => {
    if(!form.title||!form.product_url) return;
    setSaving(true);
    const payload = { ...form, hostname: form.hostname || (form.product_url ? new URL(form.product_url.startsWith('http')?form.product_url:'https://'+form.product_url).hostname.replace(/^www\./,'') : 'unknown') };
    const res = await fetch('/api/items',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(res.ok) onAdd(await res.json());
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Add Item</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 text-xl leading-none">×</button>
          </div>
          <div className="flex gap-2 mb-1">
            <input className={`${sel} flex-1`} placeholder="🔗 Paste product URL…" value={url}
              onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&extract()}/>
            <button onClick={extract} disabled={extracting||!url}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold disabled:opacity-50 min-w-[80px]"
            >{extracting?'⏳ Loading…':'Extract'}</button>
          </div>
          {extractError&&<p className="text-xs text-red-500 mb-3">{extractError}</p>}
          {form.image_urls?.[0]&&(
            <img src={form.image_urls[0]} alt="" className="w-full h-40 object-contain rounded-xl bg-neutral-50 mb-3"/>
          )}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Title *</label>
              <input className={sel} value={form.title??''} onChange={e=>f({title:e.target.value})} placeholder="Product title"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Category</label>
                <select className={sel} value={form.category} onChange={e=>f({category:e.target.value as Category})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Status</label>
                <select className={sel} value={form.status} onChange={e=>f({status:e.target.value as Status})}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Priority</label>
                <select className={sel} value={form.priority} onChange={e=>f({priority:e.target.value as Priority})}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Price (₹)</label>
                <input className={sel} type="number" value={form.price??''} onChange={e=>f({price:parseFloat(e.target.value)||null})} placeholder="0"/>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Product URL *</label>
              <input className={sel} value={form.product_url??''} onChange={e=>{
                const v=e.target.value;
                try { const u=new URL(v.startsWith('http')?v:'https://'+v); f({product_url:v,hostname:u.hostname.replace(/^www\./,'')}); } catch { f({product_url:v}); }
              }} placeholder="https://"/>
            </div>
          </div>
          <button onClick={save} disabled={saving||!form.title||!form.product_url}
            className="w-full mt-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50"
          >{saving?'Saving…':'Add to Wishlist'}</button>
        </div>
      </div>
    </div>
  );
}
