'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, GripVertical, Edit2, Trash2, X } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageUploader from '@/components/admin/ImageUploader';
import type { TeamMember, TeamCategory } from '@/lib/types';

function SortableTeamRow({ member, onEdit, onDelete }: { member: TeamMember; onEdit: (m: TeamMember) => void; onDelete: (id: string, pubId?: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(242,240,235,0.06)',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    gap: '1rem',
    opacity: member.is_visible ? 1 : 0.5,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button {...attributes} {...listeners} style={{ background: 'none', border: 'none', color: 'var(--dust-gray)', cursor: 'grab' }}>
        <GripVertical size={18} />
      </button>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {member.photo_url ? (
          <img src={member.photo_url} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} />
        ) : (
          <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        )}
        <div>
          <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--concrete-white)' }}>
            {member.name} {!member.is_visible && <span style={{ color: 'var(--rebar-red)', fontSize: '0.65rem', marginLeft: '0.5rem' }}>(Hidden)</span>}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)' }}>
            {member.title}
          </p>
        </div>
      </div>

      <button onClick={() => onEdit(member)} style={{ background: 'none', border: 'none', color: 'var(--dust-gray)', cursor: 'pointer', padding: '0.5rem' }}>
        <Edit2 size={16} />
      </button>
      <button onClick={() => onDelete(member.id, member.cloudinary_id || undefined)} style={{ background: 'none', border: 'none', color: 'var(--rebar-red)', cursor: 'pointer', padding: '0.5rem' }}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}

const CATEGORIES: { label: string; value: TeamCategory }[] = [
  { label: 'Board of Directors', value: 'board' },
  { label: 'Key Technical Team', value: 'technical' },
  { label: 'Architecture Team', value: 'architecture' },
];

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);

  const supabase = createClient();

  useEffect(() => { fetchTeam(); }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const { data } = await supabase.from('team').select('*').order('display_order');
    if (data) setTeam(data as TeamMember[]);
    setLoading(false);
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = team.findIndex(m => m.id === active.id);
      const newIndex = team.findIndex(m => m.id === over.id);
      
      const newOrder = arrayMove(team, oldIndex, newIndex);
      setTeam(newOrder);

      const updates = newOrder.map((m, index) => ({ id: m.id, display_order: index }));
      await supabase.from('team').upsert(updates);
    }
  };

  const handleDelete = async (id: string, cloudinaryId?: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    if (cloudinaryId) {
      await fetch('/api/delete-image', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicId: cloudinaryId }),
      });
    }
    await supabase.from('team').delete().eq('id', id);
    setTeam(team.filter(m => m.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingMember?.id;
    
    if (isNew) {
      const maxOrder = team.length > 0 ? Math.max(...team.map(m => m.display_order)) : -1;
      const { data } = await supabase.from('team').insert([{ ...editingMember, display_order: maxOrder + 1 }]).select().single();
      if (data) setTeam([...team, data]);
    } else {
      const { data } = await supabase.from('team').update(editingMember).eq('id', editingMember.id).select().single();
      if (data) setTeam(team.map(m => m.id === data.id ? data : m));
    }
    
    setModalOpen(false);
    setEditingMember(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber-glow)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>LEADERSHIP</p>
          <h1 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--concrete-white)' }}>Team Members</h1>
        </div>
        <button
          onClick={() => { setEditingMember({ category: 'board', is_visible: true }); setModalOpen(true); }}
          style={{
            background: 'var(--amber-glow)', color: 'var(--iron-dark)', border: 'none', padding: '0.6rem 1.2rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)', cursor: 'pointer'
          }}
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)' }}>Loading...</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {CATEGORIES.map(cat => {
            const catMembers = team.filter(m => m.category === cat.value);
            return (
              <div key={cat.value} style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--amber-glow)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid rgba(212,130,10,0.3)', paddingBottom: '0.5rem' }}>
                  {cat.label}
                </h2>
                <SortableContext items={catMembers.map(m => m.id)} strategy={verticalListSortingStrategy}>
                  <div>
                    {catMembers.map(member => (
                      <SortableTeamRow key={member.id} member={member} onEdit={m => { setEditingMember(m); setModalOpen(true); }} onDelete={handleDelete} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </DndContext>
      )}

      {/* Modal */}
      {modalOpen && editingMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#0D0F12', border: '1px solid var(--amber-glow)', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-barlow)', fontSize: '1.5rem', color: 'var(--concrete-white)', textTransform: 'uppercase' }}>
                {editingMember.id ? 'Edit Member' : 'New Member'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--dust-gray)' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <ImageUploader
                  currentUrl={editingMember.photo_url}
                  currentPublicId={editingMember.cloudinary_id}
                  folder="nagar-nirmata/team"
                  circular
                  onUploadSuccess={(url, pubId) => setEditingMember({ ...editingMember, photo_url: url, cloudinary_id: pubId })}
                  onDeleteSuccess={() => setEditingMember({ ...editingMember, photo_url: null, cloudinary_id: null })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Name *</label>
                  <input required value={editingMember.name || ''} onChange={e => setEditingMember({ ...editingMember, name: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Title *</label>
                  <input required value={editingMember.title || ''} onChange={e => setEditingMember({ ...editingMember, title: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Qualifications</label>
                <input value={editingMember.qualifications || ''} onChange={e => setEditingMember({ ...editingMember, qualifications: e.target.value })} className="admin-input" style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Category</label>
                  <select value={editingMember.category} onChange={e => setEditingMember({ ...editingMember, category: e.target.value as TeamCategory })} className="admin-input" style={{ width: '100%' }}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--concrete-white)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editingMember.is_visible !== false} onChange={e => setEditingMember({ ...editingMember, is_visible: e.target.checked })} style={{ accentColor: 'var(--amber-glow)', width: 16, height: 16 }} />
                    Visible on website
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'transparent', color: 'var(--dust-gray)', border: '1px solid var(--dust-gray)', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                  CANCEL
                </button>
                <button type="submit" style={{ background: 'var(--amber-glow)', color: 'var(--iron-dark)', border: 'none', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700 }}>
                  SAVE MEMBER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
