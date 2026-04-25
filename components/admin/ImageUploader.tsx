'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { CldImage } from 'next-cloudinary';

interface ImageUploaderProps {
  currentUrl?: string | null;
  currentPublicId?: string | null;
  folder: 'nagar-nirmata/projects' | 'nagar-nirmata/team';
  onUploadSuccess: (url: string, publicId: string) => void;
  onDeleteSuccess: () => void;
  circular?: boolean;
}

export default function ImageUploader({
  currentUrl,
  currentPublicId,
  folder,
  onUploadSuccess,
  onDeleteSuccess,
  circular = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64data, folder }),
        });

        if (!res.ok) throw new Error('Upload failed');
        
        const data = await res.json();
        onUploadSuccess(data.url, data.public_id);
      };
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!currentPublicId) {
      onDeleteSuccess();
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const res = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: currentPublicId }),
      });

      if (!res.ok) throw new Error('Delete failed');
      
      onDeleteSuccess();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {currentUrl ? (
        <div style={{ position: 'relative', width: circular ? 120 : 240, height: circular ? 120 : 180, borderRadius: circular ? '50%' : 4, overflow: 'hidden', border: '1px solid rgba(242,240,235,0.1)' }}>
          <CldImage
            src={currentPublicId || currentUrl}
            alt="Preview"
            fill
            style={{ objectFit: 'cover' }}
            crop="fill"
            gravity={circular ? "face" : "auto"}
          />
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: circular ? 'auto' : '0.5rem',
              left: circular ? '50%' : 'auto',
              transform: circular ? 'translateX(-50%)' : 'none',
              background: 'rgba(192,57,43,0.9)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: deleting ? 'not-allowed' : 'pointer',
            }}
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: circular ? 120 : 240,
            height: circular ? 120 : 180,
            borderRadius: circular ? '50%' : 4,
            border: '1px dashed rgba(242,240,235,0.2)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            if (!uploading) {
              e.currentTarget.style.borderColor = 'var(--amber-glow)';
              e.currentTarget.style.background = 'rgba(212,130,10,0.05)';
            }
          }}
          onMouseLeave={e => {
            if (!uploading) {
              e.currentTarget.style.borderColor = 'rgba(242,240,235,0.2)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            }
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-amber" style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)' }}>UPLOADING...</span>
            </>
          ) : (
            <>
              <Upload size={24} style={{ color: 'var(--dust-gray)', marginBottom: '0.5rem' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--dust-gray)', letterSpacing: '0.1em' }}>
                CLICK TO UPLOAD
              </span>
            </>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {error && (
        <p style={{ color: 'var(--rebar-red)', fontSize: '0.7rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
