import React, { useEffect, useState } from 'react';
import { getPage, updatePage } from '../../api';
import { toast } from 'react-toastify';
import {
  Field, TextArea, VisibilityToggle, ImageUploader,
  SaveButton, AdminSectionCard, AdminPageHeader
} from '../components/FormComponents';
import { LoadingSpinner } from '../../components/common';

export default function AboutEditor() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPage('about').then(r => setPageData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getSection = (type) => pageData?.sections?.find(s => s.type === type);

  const updateContent = (type, field, value) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.type === type ? { ...s, content: { ...s.content, [field]: value } } : s
      )
    }));
  };

  const updateVisibility = (type, visible) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.type === type ? { ...s, visible } : s)
    }));
  };

  const getFounderParagraphs = () => {
    if (founder?.content?.paragraphs?.length) return founder.content.paragraphs;
    if (founder?.content?.bio) return [founder.content.bio];
    return [];
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage('about', pageData);
      toast.success('About page saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const hero = getSection('page_hero');
  const story = getSection('about_story');
  const founder = getSection('founder_full');
  const mv = getSection('mission_vision');
  const media = getSection('media_coverage');

  return (
    <div>
      <AdminPageHeader title="About Page Editor" subtitle="Edit the About page content.">
        <SaveButton saving={saving} onClick={handleSave} />
      </AdminPageHeader>

      {/* Page Hero */}
      {hero && (
        <AdminSectionCard title="Page Hero" icon="🎯">
          <div className="flex justify-between items-center mb-4">
            <VisibilityToggle visible={hero.visible} onChange={v => updateVisibility('page_hero', v)} />
          </div>
          <div className="space-y-4">
            <Field label="Heading" value={hero.content.heading} onChange={e => updateContent('page_hero', 'heading', e.target.value)} />
            <Field label="Subtext" value={hero.content.subtext} onChange={e => updateContent('page_hero', 'subtext', e.target.value)} />
            <ImageUploader label="Background Image" currentUrl={hero.content.image}
              onUpload={url => updateContent('page_hero', 'image', url)}
              onUrlChange={url => updateContent('page_hero', 'image', url)} />
          </div>
        </AdminSectionCard>
      )}

      {/* Story */}
      {story && (
        <AdminSectionCard title="Our Story" icon="📖">
          <VisibilityToggle visible={story.visible} onChange={v => updateVisibility('about_story', v)} label="Section" />
          <div className="space-y-4 mt-4">
            <Field label="Heading" value={story.content.heading} onChange={e => updateContent('about_story', 'heading', e.target.value)} />
            {(story.content.paragraphs || []).map((p, i) => (
              <div key={i} className="flex gap-2">
                <TextArea
                  label={`Paragraph ${i + 1}`}
                  value={p}
                  onChange={e => {
                    const paragraphs = [...story.content.paragraphs];
                    paragraphs[i] = e.target.value;
                    updateContent('about_story', 'paragraphs', paragraphs);
                  }}
                  rows={2}
                  className="flex-1"
                />
                <button
                  onClick={() => updateContent('about_story', 'paragraphs', story.content.paragraphs.filter((_, idx) => idx !== i))}
                  className="mt-6 text-red-400 hover:text-red-600 self-start"
                >✕</button>
              </div>
            ))}
            <button
              onClick={() => updateContent('about_story', 'paragraphs', [...(story.content.paragraphs || []), ''])}
              className="text-sm text-primary font-medium"
            >+ Add Paragraph</button>
            <ImageUploader label="Story Image" currentUrl={story.content.image}
              onUpload={url => updateContent('about_story', 'image', url)}
              onUrlChange={url => updateContent('about_story', 'image', url)} />
          </div>
        </AdminSectionCard>
      )}

      {/* Founder Full */}
      {founder && (
        <AdminSectionCard title="Founder Section" icon="👩">
          <VisibilityToggle visible={founder.visible} onChange={v => updateVisibility('founder_full', v)} label="Section" />
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Section Heading" value={founder.content.heading} onChange={e => updateContent('founder_full', 'heading', e.target.value)} />
              <Field label="Founder Name" value={founder.content.name} onChange={e => updateContent('founder_full', 'name', e.target.value)} />
            </div>
            <div>
              {getFounderParagraphs().map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <TextArea
                    label={`Paragraph ${i + 1}`}
                    value={p}
                    onChange={e => {
                      const paragraphs = [...getFounderParagraphs()];
                      paragraphs[i] = e.target.value;
                      updateContent('founder_full', 'paragraphs', paragraphs);
                      updateContent('founder_full', 'bio', paragraphs.filter(Boolean).join('\n\n'));
                    }}
                    rows={2}
                    className="flex-1"
                  />
                  <button
                    onClick={() => {
                      const paragraphs = getFounderParagraphs().filter((_, idx) => idx !== i);
                      updateContent('founder_full', 'paragraphs', paragraphs);
                      updateContent('founder_full', 'bio', paragraphs.filter(Boolean).join('\n\n'));
                    }}
                    className="mt-6 text-red-400 hover:text-red-600 self-start"
                  >x</button>
                </div>
              ))}
              <button
                onClick={() => {
                  const paragraphs = [...getFounderParagraphs(), ''];
                  updateContent('founder_full', 'paragraphs', paragraphs);
                  updateContent('founder_full', 'bio', paragraphs.filter(Boolean).join('\n\n'));
                }}
                className="text-sm text-primary font-medium"
              >+ Add Paragraph</button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Key Highlights</p>
              {(founder.content.highlights || []).map((h, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={h}
                    onChange={e => {
                      const highlights = [...founder.content.highlights];
                      highlights[i] = e.target.value;
                      updateContent('founder_full', 'highlights', highlights);
                    }}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <button onClick={() => updateContent('founder_full', 'highlights', founder.content.highlights.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600">✕</button>
                </div>
              ))}
              <button onClick={() => updateContent('founder_full', 'highlights', [...(founder.content.highlights || []), ''])}
                className="text-sm text-primary font-medium">+ Add Highlight</button>
            </div>
            <ImageUploader label="Founder Photo" currentUrl={founder.content.image}
              onUpload={url => updateContent('founder_full', 'image', url)}
              onUrlChange={url => updateContent('founder_full', 'image', url)} />
          </div>
        </AdminSectionCard>
      )}

      {/* Mission & Vision */}
      {mv && (
        <AdminSectionCard title="Mission & Vision" icon="🔭">
          <VisibilityToggle visible={mv.visible} onChange={v => updateVisibility('mission_vision', v)} label="Section" />
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {['mission', 'vision'].map(key => (
              <div key={key} className="p-4 bg-primary-light rounded-xl space-y-3">
                <Field label={`${key.charAt(0).toUpperCase() + key.slice(1)} Heading`}
                  value={mv.content[key]?.heading}
                  onChange={e => updateContent('mission_vision', key, { ...mv.content[key], heading: e.target.value })} />
                <TextArea label="Text"
                  value={mv.content[key]?.text}
                  onChange={e => updateContent('mission_vision', key, { ...mv.content[key], text: e.target.value })} rows={3} />
              </div>
            ))}
          </div>
        </AdminSectionCard>
      )}

      {/* Media Coverage */}
      {media && (
        <AdminSectionCard title="Media Coverage" icon="📰">
          <VisibilityToggle visible={media.visible} onChange={v => updateVisibility('media_coverage', v)} label="Section" />
          <div className="space-y-3 mt-4">
            <Field label="Section Heading" value={media.content.heading} onChange={e => updateContent('media_coverage', 'heading', e.target.value)} />
            <Field label="Subtext" value={media.content.subtext} onChange={e => updateContent('media_coverage', 'subtext', e.target.value)} />
            {(media.content.outlets || []).map((outlet, i) => (
              <div key={i} className="flex gap-2">
                <input value={outlet}
                  onChange={e => {
                    const outlets = [...media.content.outlets];
                    outlets[i] = e.target.value;
                    updateContent('media_coverage', 'outlets', outlets);
                  }}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
                <button onClick={() => updateContent('media_coverage', 'outlets', media.content.outlets.filter((_, idx) => idx !== i))}
                  className="text-red-400 hover:text-red-600">✕</button>
              </div>
            ))}
            <button onClick={() => updateContent('media_coverage', 'outlets', [...(media.content.outlets || []), ''])}
              className="text-sm text-primary font-medium">+ Add Outlet</button>
          </div>
        </AdminSectionCard>
      )}

      <div className="sticky bottom-4 flex justify-end">
        <SaveButton saving={saving} onClick={handleSave} />
      </div>
    </div>
  );
}
