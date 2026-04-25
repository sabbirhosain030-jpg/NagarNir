'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GripVertical } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SiteSection } from '@/lib/types';

function SortableSectionRow({ section, onToggle }: { section: SiteSection; onToggle: (id: string, isVisible: boolean) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(242,240,235,0.06)',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    gap: '1rem',
    opacity: section.is_visible ? 1 : 0.6,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button {...attributes} {...listeners} style={{ background: 'none', border: 'none', color: 'var(--dust-gray)', cursor: 'grab' }}>
        <GripVertical size={18} />
      </button>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600, fontSize: '1rem', color: 'var(--concrete-white)', textTransform: 'capitalize' }}>
          {section.key} Section
        </p>
        {!section.is_visible && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase',
            padding: '0.2rem 0.6rem', background: 'rgba(192,57,43,0.1)', color: 'var(--rebar-red)', border: '1px solid var(--rebar-red)'
          }}>
            Hidden
          </span>
        )}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
        <input
          type="checkbox"
          checked={section.is_visible}
          onChange={e => onToggle(section.key, e.target.checked)}
          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
        />
        <div style={{
          width: 44, height: 24, background: section.is_visible ? 'var(--amber-glow)' : 'rgba(255,255,255,0.1)',
          borderRadius: 12, position: 'relative', transition: 'background 0.3s'
        }}>
          <div style={{
            width: 18, height: 18, background: section.is_visible ? 'var(--iron-dark)' : 'var(--dust-gray)',
            borderRadius: '50%', position: 'absolute', top: 3, left: section.is_visible ? 23 : 3,
            transition: 'left 0.3s, background 0.3s'
          }} />
        </div>
      </label>
    </div>
  );
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    const { data } = await supabase.from('sections').select('*').order('display_order');
    if (data) setSections(data as SiteSection[]);
    setLoading(false);
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.key === active.id);
      const newIndex = sections.findIndex(s => s.key === over.id);
      
      const newOrder = arrayMove(sections, oldIndex, newIndex);
      setSections(newOrder);

      const updates = newOrder.map((s, index) => ({ key: s.key, display_order: index }));
      await supabase.from('sections').upsert(updates);
    }
  };

  const handleToggle = async (id: string, isVisible: boolean) => {
    setSections(prev => prev.map(s => s.key === id ? { ...s, is_visible: isVisible } : s));
    await supabase.from('sections').update({ is_visible: isVisible }).eq('key', id);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber-glow)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>LAYOUT</p>
        <h1 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--concrete-white)' }}>Section Manager</h1>
        <p style={{ fontFamily: 'var(--font-lora)', fontSize: '0.9rem', color: 'var(--dust-gray)', marginTop: '0.5rem' }}>
          Drag to reorder sections on the homepage. Toggle visibility to show or hide sections instantly.
        </p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)' }}>Loading...</p>
      ) : (
        <div style={{ maxWidth: 800 }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map(s => s.key)} strategy={verticalListSortingStrategy}>
              <div>
                {sections.map(section => (
                  <SortableSectionRow key={section.key} section={section} onToggle={handleToggle} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
