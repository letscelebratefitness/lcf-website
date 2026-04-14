import React, { useEffect, useState } from 'react';
import { getPage, updatePage } from '../../api';
import { toast } from 'react-toastify';
import { Field, TextArea, SaveButton, AdminPageHeader, AdminSectionCard, VisibilityToggle, ImageUploader } from '../components/FormComponents';
import { LoadingSpinner } from '../../components/common';

export default function GetInvolvedEditor() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPage('get-involved').then(r => setPageData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getSection = (type) => pageData?.sections?.find(s => s.type === type);
  const updateSection = (type, updater) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(section => section.type === type ? updater(section) : section)
    }));
  };
  const updateContent = (type, field, value) => updateSection(type, section => ({ ...section, content: { ...section.content, [field]: value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage('get-involved', pageData);
      toast.success('Get Involved page saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const hero = getSection('page_hero');
  const options = getSection('involvement_options');

  return (
    <div>
      <AdminPageHeader title="Get Involved Editor" subtitle="Edit the Get Involved page hero and option cards.">
        <SaveButton saving={saving} onClick={handleSave} />
      </AdminPageHeader>

      {hero && (
        <AdminSectionCard title="Page Hero" icon="P">
          <div className="space-y-4">
            <VisibilityToggle visible={hero.visible} onChange={visible => updateSection('page_hero', section => ({ ...section, visible }))} />
            <Field label="Heading" value={hero.content.heading} onChange={e => updateContent('page_hero', 'heading', e.target.value)} />
            <Field label="Subtext" value={hero.content.subtext} onChange={e => updateContent('page_hero', 'subtext', e.target.value)} />
            <ImageUploader label="Hero Image" currentUrl={hero.content.image}
              onUpload={url => updateContent('page_hero', 'image', url)}
              onUrlChange={url => updateContent('page_hero', 'image', url)} />
          </div>
        </AdminSectionCard>
      )}

      {options && (
        <AdminSectionCard title="Involvement Options" icon="O">
          <VisibilityToggle visible={options.visible} onChange={visible => updateSection('involvement_options', section => ({ ...section, visible }))} />
          <div className="space-y-4 mt-4">
            {(options.content.options || []).map((option, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Icon" value={option.icon} onChange={e => {
                    const next = [...options.content.options];
                    next[index] = { ...next[index], icon: e.target.value };
                    updateContent('involvement_options', 'options', next);
                  }} />
                  <Field label="Title" value={option.title} onChange={e => {
                    const next = [...options.content.options];
                    next[index] = { ...next[index], title: e.target.value };
                    updateContent('involvement_options', 'options', next);
                  }} />
                </div>
                <TextArea label="Description" value={option.description} onChange={e => {
                  const next = [...options.content.options];
                  next[index] = { ...next[index], description: e.target.value };
                  updateContent('involvement_options', 'options', next);
                }} rows={2} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="CTA Label" value={option.cta} onChange={e => {
                    const next = [...options.content.options];
                    next[index] = { ...next[index], cta: e.target.value };
                    updateContent('involvement_options', 'options', next);
                  }} />
                  <Field label="CTA Link" value={option.href} onChange={e => {
                    const next = [...options.content.options];
                    next[index] = { ...next[index], href: e.target.value };
                    updateContent('involvement_options', 'options', next);
                  }} />
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      )}

      <div className="sticky bottom-4 flex justify-end">
        <SaveButton saving={saving} onClick={handleSave} />
      </div>
    </div>
  );
}
