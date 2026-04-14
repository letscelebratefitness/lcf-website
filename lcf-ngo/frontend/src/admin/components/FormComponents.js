import React, { useState } from 'react';
import { uploadImage } from '../../api';
import { toast } from 'react-toastify';

export function Field({ label, name, value, onChange, type = 'text', required, placeholder, className = '', disabled = false }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
      />
    </div>
  );
}

export function TextArea({ label, name, value, onChange, rows = 4, placeholder, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none bg-white"
      />
    </div>
  );
}

export function VisibilityToggle({ visible, onChange, label = 'Visible' }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={visible} onChange={e => onChange(e.target.checked)} />
        <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${visible ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${visible ? 'left-6' : 'left-1'}`} />
      </div>
      <span className="text-sm font-medium text-gray-600">{visible ? `${label} (Visible)` : `${label} (Hidden)`}</span>
    </label>
  );
}

export function ImageUploader({
  label = 'Image',
  currentUrl,
  onUpload,
  onUrlChange
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const isPdfPreview = (url = '') => /\.pdf($|[?#])/i.test(url);

  React.useEffect(() => {
    setPreview(currentUrl || '');
  }, [currentUrl]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf';

    const localPreview =isPdf ? '/pdf-icon.png' : URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadImage(fd);
      onUpload(res.data.url, res.data.publicId);
      setPreview(isPdf ? '/pdf-icon.png' : res.data.url);
      toast.success(`${isPdf ? 'PDF' : 'Image'} uploaded!`);
    } catch (err) {
      toast.error('Upload failed. Check Cloudinary config.');
      setPreview(currentUrl || '');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleUrlChange = (e) => {
    setPreview(e.target.value);
    onUrlChange && onUrlChange(e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-3">
        {preview && (
          <div className="relative h-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
            {isPdfPreview(preview) ? (
              <a
                href={preview}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-full text-blue-600 underline"
              >
                View PDF
              </a>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setPreview('')}
              />
            )}
          </div>
        )}
        <div className="flex gap-2">
          <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-3 px-4 cursor-pointer hover:border-primary hover:bg-primary-light/30 transition-all text-sm text-gray-500 hover:text-primary">
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*,application/pdf" onChange={handleFile} className="hidden" disabled={uploading} />
          </label>
        </div>
        {onUrlChange && (
          <input
            type="url"
            value={currentUrl || ''}
            onChange={handleUrlChange}
            placeholder="Or paste image URL..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        )}
      </div>
    </div>
  );
}

export function SaveButton({ saving, onClick, label = 'Save Changes' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {saving ? (
        <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
      ) : (
        <><span>Save</span> {label}</>
      )}
    </button>
  );
}

export function AdminSectionCard({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-gray-100">{children}</div>}
    </div>
  );
}

export function AdminPageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-primary-dark">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
