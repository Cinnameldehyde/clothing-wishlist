'use client';
import { useState } from 'react';
import type { WishlistItem } from '@/lib/types';
const STATUS_STYLES: Record<string,string> = {
  'Saved':'bg-purple-100 text-purple-700','Need review':'bg-yellow-100 text-yellow-700',
  'Maybe':'bg-sky-100 text-sky-700','Waiting for sale':'bg-orange-100 text-orange-700',
  'Bought':'bg-green-100 text-green-700','Not buying':'bg-neutral-100 text-neutral-500',
};
const PRIORITY_DOT: Record<string,string> = { High:'bg-red-400',Medium:'bg-amber-400',Low:'bg-emerald-400' };
export function WishlistCard({ item, onClick, onUpdate }: { item: WishlistItem; onClick: ()=>void; onUpdate: (u:WishlistItem)=>void }) {
  const [imgErr,setImgErr]=useState(false);
  const img = !imgErr && item.image_urls?.[0];
  const quickUpdate = async (field: string, value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch(`/api/items/${item.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({[field]:value})});
    if(res.ok) onUpdate({...item,[field]:value});
  };
  return (
    <div onClick={onClick} className="break-inside-avoid mb-3 rounded-2xl bg-white shadow-sm border border-neutral-100 overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {img ? (
        <div className="relative overflow-hidden bg-neutral-50">
          <img src={img} alt={item.title} onError={()=>setImgErr(true)} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute top-2 right-2"><span className={`w-2.5 h-2.5 rounded-full block shadow-sm ${PRIORITY_DOT[item.priority]??'bg-neutral-300'}`}/></div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"/>
          <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-1 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button onClick={e=>quickUpdate('status','Bought',e)} className="flex-1 py-1.5 rounded-lg bg-white/90 backdrop-blur text-green-600 text-xs font-medium hover:bg-green-50 transition-colors">✓ Bought</button>
            <button onClick={e=>quickUpdate('status','Not buying',e)} className="flex-1 py-1.5 rounded-lg bg-white/90 backdrop-blur text-neutral-500 text-xs font-medium hover:bg-neutral-100 transition-colors">✕ Skip</button>
            <a href={item.product_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} className="py-1.5 px-2 rounded-lg bg-white/90 backdrop-blur text-purple-600 hover:bg-purple-50 transition-colors text-xs">↗</a>
          </div>
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-4xl">👗</div>
      )}
      <div className="p-3">
        <p className="text-[11px] text-neutral-400 mb-1 capitalize">{item.platform} · {item.category}</p>
        <p className="text-sm font-semibold text-neutral-800 line-clamp-2 leading-snug">{item.title}</p>
        <div className="flex items-center justify-between mt-2">
          {item.price ? <span className="text-sm font-bold text-purple-700">₹{item.price.toLocaleString('en-IN')}</span> : <span/>}
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[item.status]??'bg-neutral-100 text-neutral-500'}`}>{item.status}</span>
        </div>
      </div>
    </div>
  );
}
