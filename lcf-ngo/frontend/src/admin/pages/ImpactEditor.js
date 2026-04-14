import React, { useEffect, useState } from 'react';
import { getPage, updatePage } from '../../api';
import { toast } from 'react-toastify';
import { Field, TextArea, SaveButton, AdminPageHeader, AdminSectionCard, VisibilityToggle, ImageUploader } from '../components/FormComponents';
import { LoadingSpinner } from '../../components/common';

export default function ImpactEditor() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPage('impact').then(r => setPageData(r.data.data)).catch(console.error).finally(() => setLoading(false));
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
      await updatePage('impact', pageData);
      toast.success('Impact page saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const hero = getSection('page_hero');
  const stats = getSection('impact_stats');
  const eventsImpact = getSection('events_impact');
  const testimonials = getSection('testimonials');

  return (
    <div>
      <AdminPageHeader title="Impact Editor" subtitle="Edit the Impact page hero, stats, and event highlights.">
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

      {stats && (
        <AdminSectionCard title="Impact Stats" icon="S">
          <VisibilityToggle visible={stats.visible} onChange={visible => updateSection('impact_stats', section => ({ ...section, visible }))} />
          <div className="space-y-4 mt-4">
            {(stats.content.stats || []).map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Value" value={stat.value} onChange={e => {
                    const next = [...stats.content.stats];
                    next[index] = { ...next[index], value: e.target.value };
                    updateContent('impact_stats', 'stats', next);
                  }} />
                  <Field label="Label" value={stat.label} onChange={e => {
                    const next = [...stats.content.stats];
                    next[index] = { ...next[index], label: e.target.value };
                    updateContent('impact_stats', 'stats', next);
                  }} />
                </div>
                <TextArea label="Description" value={stat.description} onChange={e => {
                  const next = [...stats.content.stats];
                  next[index] = { ...next[index], description: e.target.value };
                  updateContent('impact_stats', 'stats', next);
                }} rows={2} />
              </div>
            ))}
          </div>
        </AdminSectionCard>
      )}

      {eventsImpact && (
        <AdminSectionCard title="Events by the Numbers" icon="E">
          <VisibilityToggle visible={eventsImpact.visible} onChange={visible => updateSection('events_impact', section => ({ ...section, visible }))} />
          <div className="space-y-4 mt-4">
            <Field label="Section Heading" value={eventsImpact.content.heading} onChange={e => updateContent('events_impact', 'heading', e.target.value)} />
            {(eventsImpact.content.events || []).map((event, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <Field label="Event Name" value={event.name} onChange={e => {
                  const next = [...eventsImpact.content.events];
                  next[index] = { ...next[index], name: e.target.value };
                  updateContent('events_impact', 'events', next);
                }} />
                <Field label="Participants" value={event.participants} onChange={e => {
                  const next = [...eventsImpact.content.events];
                  next[index] = { ...next[index], participants: e.target.value };
                  updateContent('events_impact', 'events', next);
                }} />
              </div>
            ))}
          </div>
        </AdminSectionCard>
      )}

      {testimonials && (
        <AdminSectionCard title="Testimonials" icon="T">
          <VisibilityToggle visible={testimonials.visible} onChange={visible => updateSection('testimonials', section => ({ ...section, visible }))} />
          <div className="space-y-4 mt-4">
            <Field label="Section Heading" value={testimonials.content.heading} onChange={e => updateContent('testimonials', 'heading', e.target.value)} />
            <TextArea label="Subtext" value={testimonials.content.subtext} onChange={e => updateContent('testimonials', 'subtext', e.target.value)} rows={2} />
            {(testimonials.content.testimonials || []).map((testimonial, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                <TextArea label="Quote" value={testimonial.quote} onChange={e => {
                  const next = [...testimonials.content.testimonials];
                  next[index] = { ...next[index], quote: e.target.value };
                  updateContent('testimonials', 'testimonials', next);
                }} rows={3} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Name" value={testimonial.name} onChange={e => {
                    const next = [...testimonials.content.testimonials];
                    next[index] = { ...next[index], name: e.target.value };
                    updateContent('testimonials', 'testimonials', next);
                  }} />
                  <Field label="Role" value={testimonial.role} onChange={e => {
                    const next = [...testimonials.content.testimonials];
                    next[index] = { ...next[index], role: e.target.value };
                    updateContent('testimonials', 'testimonials', next);
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
