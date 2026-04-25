'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, GripVertical, Edit2, Trash2, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageUploader from '@/components/admin/ImageUploader';
import type { Project, ProjectType } from '@/lib/types';

function SortableProjectRow({ project, onEdit, onDelete }: { project: Project; onEdit: (p: Project) => void; onDelete: (id: string, pubId?: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id });

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
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button {...attributes} {...listeners} style={{ background: 'none', border: 'none', color: 'var(--dust-gray)', cursor: 'grab' }}>
        <GripVertical size={18} />
      </button>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {project.image_url ? (
          <img src={project.image_url} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 2 }} />
        ) : (
          <div style={{ width: 48, height: 36, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
        )}
        <div>
          <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--concrete-white)' }}>
            {project.title}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)' }}>
            {project.client || 'No Client'} • ৳{project.value_crore || 0}Cr
          </p>
        </div>
      </div>

      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase',
        padding: '0.2rem 0.6rem', border: '1px solid var(--amber-glow)', color: 'var(--amber-glow)',
      }}>
        {project.type}
      </span>

      <button onClick={() => onEdit(project)} style={{ background: 'none', border: 'none', color: 'var(--dust-gray)', cursor: 'pointer', padding: '0.5rem' }}>
        <Edit2 size={16} />
      </button>
      <button onClick={() => onDelete(project.id, project.cloudinary_id || undefined)} style={{ background: 'none', border: 'none', color: 'var(--rebar-red)', cursor: 'pointer', padding: '0.5rem' }}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<ProjectType | 'all'>('all');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('display_order');
    if (data) setProjects(data as Project[]);
    setLoading(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);
      
      const newOrder = arrayMove(projects, oldIndex, newIndex);
      setProjects(newOrder);

      // Save order
      const updates = newOrder.map((p, index) => ({ id: p.id, display_order: index }));
      await supabase.from('projects').upsert(updates);
    }
  };

  const handleDelete = async (id: string, cloudinaryId?: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    // Delete image if exists
    if (cloudinaryId) {
      await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: cloudinaryId }),
      });
    }

    await supabase.from('projects').delete().eq('id', id);
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingProject?.id;
    
    if (isNew) {
      // get max order
      const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.display_order)) : -1;
      const { data, error } = await supabase.from('projects').insert([{ ...editingProject, display_order: maxOrder + 1 }]).select().single();
      if (data) setProjects([...projects, data]);
    } else {
      const { data } = await supabase.from('projects').update(editingProject).eq('id', editingProject.id).select().single();
      if (data) setProjects(projects.map(p => p.id === data.id ? data : p));
    }
    
    setModalOpen(false);
    setEditingProject(null);
  };

  const filteredProjects = filterType === 'all' ? projects : projects.filter(p => p.type === filterType);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber-glow)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>PORTFOLIO</p>
          <h1 style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--concrete-white)' }}>Projects</h1>
        </div>
        <button
          onClick={() => { setEditingProject({ type: 'rcc' }); setModalOpen(true); }}
          style={{
            background: 'var(--amber-glow)', color: 'var(--iron-dark)', border: 'none', padding: '0.6rem 1.2rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)', cursor: 'pointer'
          }}
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {['all', 'rcc', 'steel', 'consultancy', 'infra', 'upcoming'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t as any)}
            style={{
              background: filterType === t ? 'var(--amber-glow)' : 'transparent',
              color: filterType === t ? 'var(--iron-dark)' : 'var(--dust-gray)',
              border: filterType === t ? 'none' : '1px solid rgba(242,240,235,0.1)',
              padding: '0.4rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)' }}>Loading...</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div>
              {filteredProjects.map(project => (
                <SortableProjectRow key={project.id} project={project} onEdit={p => { setEditingProject(p); setModalOpen(true); }} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal */}
      {modalOpen && editingProject && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#0D0F12', border: '1px solid var(--amber-glow)', width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-barlow)', fontSize: '1.5rem', color: 'var(--concrete-white)', textTransform: 'uppercase' }}>
                {editingProject.id ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--dust-gray)' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Image</label>
                <ImageUploader
                  currentUrl={editingProject.image_url}
                  currentPublicId={editingProject.cloudinary_id}
                  folder="nagar-nirmata/projects"
                  onUploadSuccess={(url, pubId) => setEditingProject({ ...editingProject, image_url: url, cloudinary_id: pubId })}
                  onDeleteSuccess={() => setEditingProject({ ...editingProject, image_url: null, cloudinary_id: null })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Title *</label>
                  <input required value={editingProject.title || ''} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Type</label>
                  <select value={editingProject.type} onChange={e => setEditingProject({ ...editingProject, type: e.target.value as ProjectType })} className="admin-input" style={{ width: '100%' }}>
                    <option value="rcc">RCC</option>
                    <option value="steel">Steel</option>
                    <option value="consultancy">Consultancy</option>
                    <option value="infra">Infrastructure</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Client</label>
                  <input value={editingProject.client || ''} onChange={e => setEditingProject({ ...editingProject, client: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Location</label>
                  <input value={editingProject.location || ''} onChange={e => setEditingProject({ ...editingProject, location: e.target.value })} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--dust-gray)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Value (Crore)</label>
                  <input type="number" step="0.01" value={editingProject.value_crore || ''} onChange={e => setEditingProject({ ...editingProject, value_crore: parseFloat(e.target.value) || 0 })} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'transparent', color: 'var(--dust-gray)', border: '1px solid var(--dust-gray)', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                  CANCEL
                </button>
                <button type="submit" style={{ background: 'var(--amber-glow)', color: 'var(--iron-dark)', border: 'none', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700 }}>
                  SAVE PROJECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
