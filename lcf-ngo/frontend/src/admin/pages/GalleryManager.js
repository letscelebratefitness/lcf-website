import React, { useEffect, useState, useRef } from 'react';
import { getAllGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage, uploadImage, getPage, updatePage } from '../../api';
import { toast } from 'react-toastify';
import { Field, VisibilityToggle, AdminPageHeader, EmptyState, AdminSectionCard, ImageUploader, SaveButton } from '../components/FormComponents';

const CATEGORIES = ['general', 'events', 'food-distribution', 'marathon', 'women-fitness', 'transgender', 'calamity-relief'];
const DEFAULT_GALLERY_PAGE = {
  page: 'gallery',
  title: "Gallery | Let's Celebrate Fitness",
  sections: [
    {
      type: 'page_hero',
      visible: true,
      order: 1,
      content: {
        heading: 'Gallery',
        subtext: 'Moments from our events, drives, and community activities.',
        image: ''
      }
    }
  ]
};

export default function GalleryManager() {
  const [pageData, setPageData] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');
  const [savingHero, setSavingHero] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    Promise.allSettled([getPage('gallery'), getAllGallery()])
      .then(([pageRes, galleryRes]) => {
        setPageData(pageRes.status === 'fulfilled' ? pageRes.value.data.data : DEFAULT_GALLERY_PAGE);
        if (galleryRes.status === 'fulfilled') setImages(galleryRes.value.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hero = pageData?.sections?.find(s => s.type === 'page_hero')?.content || {};

  const updateHero = (field, value) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.type === 'page_hero' ? { ...s, content: { ...s.content, [field]: value } } : s)
    }));
  };

  const saveHero = async () => {
    setSavingHero(true);
    try {
      await updatePage('gallery', pageData);
      toast.success('Gallery page hero saved!');
    } catch {
      toast.error('Failed to save hero.');
    } finally {
      setSavingHero(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    let added = 0;
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append('file', file);
        const uploadRes = await uploadImage(fd);
        const galleryRes = await addGalleryImage({
          url: uploadRes.data.url,
          publicId: uploadRes.data.publicId,
          title: file.name.replace(/\.[^.]+$/, ''),
          category: 'general',
          visible: true
        });
        setImages(prev => [galleryRes.data.data, ...prev]);
        added++;
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    if (added) toast.success(`${added} image(s) uploaded!`);
    setUploading(false);
    fileRef.current.value = '';
  };

  const handleDelete = async (img) => {
    if (!window.confirm('Delete this image permanently?')) return;
    try {
      await deleteGalleryImage(img._id);
      setImages(prev => prev.filter(i => i._id !== img._id));
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const startEdit = (img) => {
    setEditingId(img._id);
    setEditForm({ title: img.title, alt: img.alt, category: img.category, visible: img.visible });
  };

  const saveEdit = async (id) => {
    try {
      const r = await updateGalleryImage(id, editForm);
      setImages(prev => prev.map(i => i._id === id ? r.data.data : i));
      setEditingId(null);
      toast.success('Image updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const toggleVisible = async (img) => {
    try {
      const r = await updateGalleryImage(img._id, { ...img, visible: !img.visible });
      setImages(prev => prev.map(i => i._id === img._id ? r.data.data : i));
    } catch {
      toast.error('Failed to update');
    }
  };

  const allCategories = ['all', ...new Set(images.map(i => i.category).filter(Boolean))];
  const filtered = activeCategory === 'all' ? images : images.filter(i => i.category === activeCategory);

  return (
    <div>
      <AdminPageHeader title="Gallery Manager" subtitle={`${images.length} total images`}>
        <label className={`btn-primary cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-70' : ''}`}>
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </AdminPageHeader>

      {pageData && (
        <AdminSectionCard title="Gallery Page Hero" icon="P">
          <div className="space-y-4">
            <Field label="Heading" value={hero.heading} onChange={e => updateHero('heading', e.target.value)} />
            <Field label="Subtext" value={hero.subtext} onChange={e => updateHero('subtext', e.target.value)} />
            <ImageUploader label="Hero Image" currentUrl={hero.image}
              onUpload={url => updateHero('image', url)}
              onUrlChange={url => updateHero('image', url)} />
            <div className="flex justify-end">
              <SaveButton saving={savingHero} onClick={saveHero} label="Save Hero" />
            </div>
          </div>
        </AdminSectionCard>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium capitalize transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-primary-light hover:text-primary'}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-light border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="G" title="No Images Yet" description="Upload images to populate the gallery."
          action={
            <label className="btn-primary cursor-pointer">
              Upload Images
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            </label>
          } />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(img => (
            <div key={img._id} className={`relative group rounded-xl overflow-hidden shadow-soft border-2 transition-all ${!img.visible ? 'opacity-50 border-gray-200' : 'border-transparent hover:border-primary'}`}>
              <div className="aspect-square">
                <img src={img.url} alt={img.alt || img.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end gap-1">
                  <button onClick={() => startEdit(img)}
                    className="rounded-lg bg-white/20 backdrop-blur hover:bg-white/40 text-white text-xs px-2 py-1">Edit</button>
                  <button onClick={() => handleDelete(img)}
                    className="rounded-lg bg-red-500/60 backdrop-blur hover:bg-red-600 text-white text-xs px-2 py-1">Del</button>
                </div>
                <div>
                  {img.title && <p className="text-white text-xs font-medium truncate">{img.title}</p>}
                  {img.category && <span className="text-white/60 text-xs capitalize">{img.category}</span>}
                </div>
              </div>
              <div className="absolute top-2 left-2">
                <button onClick={() => toggleVisible(img)}
                  className={`w-4 h-4 rounded-full border-2 border-white ${img.visible ? 'bg-green-400' : 'bg-gray-400'}`}
                  title={img.visible ? 'Visible' : 'Hidden'} />
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-hover w-full max-w-md p-6">
            <h3 className="font-display font-bold text-primary-dark text-lg mb-4">Edit Image Details</h3>
            <div className="space-y-4">
              <Field label="Title" value={editForm.title}
                onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
              <Field label="Alt Text (for accessibility)" value={editForm.alt}
                onChange={e => setEditForm(f => ({ ...f, alt: e.target.value }))} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={editForm.category}
                  onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <VisibilityToggle visible={editForm.visible} onChange={v => setEditForm(f => ({ ...f, visible: v }))} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditingId(null)} className="btn-outline flex-1 text-sm py-2">Cancel</button>
              <button onClick={() => saveEdit(editingId)} className="btn-primary flex-1 text-sm py-2">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
