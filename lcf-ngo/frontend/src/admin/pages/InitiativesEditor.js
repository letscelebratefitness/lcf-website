import React, { useEffect, useState } from 'react';
import { getPage, updatePage } from '../../api';
import { toast } from 'react-toastify';
import {
  Field, TextArea, ImageUploader, SaveButton, AdminPageHeader,
  AdminSectionCard, VisibilityToggle
} from '../components/FormComponents';
import { LoadingSpinner } from '../../components/common';

export default function InitiativesEditor() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPage('initiatives').then(r => setPageData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getSection = (type) => pageData?.sections?.find(s => s.type === type);
  const getInitiatives = () => getSection('initiatives_grid')?.content?.initiatives || [];

  const updateSection = (type, updater) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(section => section.type === type ? updater(section) : section)
    }));
  };

  const updateHero = (field, value) => {
    updateSection('page_hero', section => ({
      ...section,
      content: { ...section.content, [field]: value }
    }));
  };

  const updateInitiative = (idx, field, value) => {
    updateSection('initiatives_grid', section => {
      const initiatives = [...section.content.initiatives];
      initiatives[idx] = { ...initiatives[idx], [field]: value };
      return { ...section, content: { ...section.content, initiatives } };
    });
  };

  const addInitiative = () => {
    updateSection('initiatives_grid', section => ({
      ...section,
      content: {
        ...section.content,
        initiatives: [...section.content.initiatives, { icon: '*', title: 'New Initiative', description: '', image: '' }]
      }
    }));
  };

  const removeInitiative = (idx) => {
    updateSection('initiatives_grid', section => ({
      ...section,
      content: {
        ...section.content,
        initiatives: section.content.initiatives.filter((_, i) => i !== idx)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage('initiatives', pageData);
      toast.success('Initiatives saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const hero = getSection('page_hero');

  return (
    <div>
      <AdminPageHeader title="Initiatives Editor" subtitle="Manage the initiatives page content and hero image.">
        <div className="flex gap-3">
          <button onClick={addInitiative} className="btn-outline text-sm py-2 px-4 flex items-center gap-2">+ Add Initiative</button>
          <SaveButton saving={saving} onClick={handleSave} />
        </div>
      </AdminPageHeader>

      {hero && (
        <AdminSectionCard title="Page Hero" icon="P">
          <div className="space-y-4">
            <VisibilityToggle
              visible={hero.visible}
              onChange={visible => updateSection('page_hero', section => ({ ...section, visible }))}
            />
            <Field label="Heading" value={hero.content.heading} onChange={e => updateHero('heading', e.target.value)} />
            <Field label="Subtext" value={hero.content.subtext} onChange={e => updateHero('subtext', e.target.value)} />
            <ImageUploader label="Hero Image" currentUrl={hero.content.image}
              onUpload={url => updateHero('image', url)}
              onUrlChange={url => updateHero('image', url)} />
          </div>
        </AdminSectionCard>
      )}

      <div className="space-y-5">
        {getInitiatives().map((init, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{init.icon}</span>
                <span className="font-semibold text-gray-800">{init.title || `Initiative ${i + 1}`}</span>
              </div>
              <button onClick={() => removeInitiative(i)} className="text-red-400 hover:text-red-600 text-sm px-3 py-1 rounded-lg hover:bg-red-50">
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Field label="Icon (emoji)" value={init.icon} onChange={e => updateInitiative(i, 'icon', e.target.value)} />
              <Field label="Title" value={init.title} onChange={e => updateInitiative(i, 'title', e.target.value)} className="md:col-span-2" />
            </div>
            <TextArea label="Description" value={init.description} onChange={e => updateInitiative(i, 'description', e.target.value)} rows={3} className="mb-4" />
            <ImageUploader label="Initiative Image (optional)" currentUrl={init.image}
              onUpload={url => updateInitiative(i, 'image', url)}
              onUrlChange={url => updateInitiative(i, 'image', url)} />
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 flex justify-end mt-6">
        <SaveButton saving={saving} onClick={handleSave} />
      </div>
    </div>
  );
}
