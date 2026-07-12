'use client';
import { useState } from 'react';
import type { WishlistItem } from '@/lib/types';
import { DndContext, closestCenter, DragEndEvent, useDraggable, useDroppable, DragOverlay, DragStartEvent } from '@dnd-kit/core';

const COL: Record<string,{border:string;bg:string;badge:string}> = {
  'Saved':{border:'border-purple-200',bg:'bg-purple-50/60',badge:'bg-purple-100 text-purple-700'},
  'Need review':{border:'border-yellow-200',bg:'bg-yellow-50/60',badge:'bg-yellow-100 text-yellow-700'},
  'Maybe':{border:'border-sky-200',bg:'bg-sky-50/60',badge:'bg-sky-100 text-sky-700'},
  'Waiting for sale':{border:'border-orange-200',bg:'bg-orange-50/60',badge:'bg-orange-100 text-orange-700'},
  'Bought':{border:'border-green-200',bg:'bg-green-50/60',badge:'bg-green-100 text-green-700'},
  'Not buying':{border:'border-neutral-200',bg:'bg-neutral-50/60',badge:'bg-neutral-100 text-neutral-500'},
};

function DragCard({ item }: { item: WishlistItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  const style = transform ? { transform:`translate(${transform.x}px,${transform.y}px)` } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className={`bg-white rounded-xl p-3 shadow-sm border border-neutral-100 cursor-grab active:cursor-grabbing select-none ${isDragging?'opacity-30':'hover:shadow-md'} transition-all`}
    >
      {item.image_urls?.[0]&&<img src={item.image_urls[0]} alt="" className="w-full h-24 object-cover rounded-lg mb-2"/>}
      <p className="text-[11px] text-neutral-400 capitalize">{item.platform}</p>
      <p className="text-sm font-semibold text-neutral-800 line-clamp-2 mt-0.5">{item.title}</p>
      {item.price&&<p className="text-sm font-bold text-purple-700 mt-1">₹{item.price.toLocaleString('en-IN')}</p>}
    </div>
  );
}

function Column({ status, items }: { status: string; items: WishlistItem[] }) {
  const s = COL[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef}
      className={`rounded-2xl border-2 min-h-[300px] p-3 flex-1 min-w-[200px] transition-all ${s?.border??'border-neutral-200'} ${s?.bg??'bg-neutral-50/60'} ${isOver?'ring-2 ring-purple-400 scale-[1.01]':''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-700">{status}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s?.badge??''}`}>{items.length}</span>
      </div>
      <div className="flex flex-col gap-2">{items.map(item=><DragCard key={item.id} item={item}/>)}</div>
    </div>
  );
}

export function KanbanBoard({ initialGrouped, statuses }: { initialGrouped: Record<string,WishlistItem[]>; statuses: string[] }) {
  const [grouped, setGrouped] = useState(initialGrouped);
  const [activeId, setActiveId] = useState<string|null>(null);
  const activeItem = activeId ? Object.values(grouped).flat().find(i=>i.id===activeId) : null;

  const onDragStart = ({ active }: DragStartEvent) => setActiveId(active.id as string);
  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if(!over) return;
    const newStatus = over.id as string;
    const itemId = active.id as string;
    const fromStatus = statuses.find(s=>grouped[s]?.some(i=>i.id===itemId));
    if(!fromStatus||fromStatus===newStatus) return;
    setGrouped(prev=>{
      const item = prev[fromStatus].find(i=>i.id===itemId)!;
      return {...prev,[fromStatus]:prev[fromStatus].filter(i=>i.id!==itemId),[newStatus]:[{...item,status:newStatus},...(prev[newStatus]??[])]};
    });
    await fetch(`/api/items/${itemId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:newStatus})});
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto p-6 items-start pb-10">
        {statuses.map(s=><Column key={s} status={s} items={grouped[s]??[]}/>)}
      </div>
      <DragOverlay>
        {activeItem&&(
          <div className="bg-white rounded-xl p-3 shadow-2xl border border-neutral-200 w-48 rotate-2">
            {activeItem.image_urls?.[0]&&<img src={activeItem.image_urls[0]} alt="" className="w-full h-20 object-cover rounded-lg mb-2"/>}
            <p className="text-sm font-semibold line-clamp-1">{activeItem.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
