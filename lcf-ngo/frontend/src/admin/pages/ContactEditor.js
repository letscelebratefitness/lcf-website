import React, { useEffect, useState } from 'react';
import { getPage, updatePage } from '../../api';
import { toast } from 'react-toastify';
import { Field, SaveButton, AdminSectionCard, AdminPageHeader, ImageUploader } from '../components/FormComponents';
import { LoadingSpinner } from '../../components/common';

const defaultContactFlowSection = {
  type: 'contact_flow',
  visible: true,
  order: 3,
  content: {
    heading: 'What Happens Next?',
    subtext: "Here's what to expect after you get in touch with us.",
    donationNote: 'Our team will guide you through the donation process after you get in touch.',
    responseNote: 'We typically respond within 24-48 hours.',
    volunteerSteps: [
      { title: 'Submit your interest', description: 'Share a few details about how you would like to support our work.' },
      { title: 'Our team reviews your details', description: 'We look at your message and identify the best fit based on your interests.' },
      { title: 'We contact you within 2-3 days', description: 'A team member reaches out with the next steps and answers your questions.' },
      { title: 'Attend a short orientation', description: 'You get a quick introduction to our mission, programs, and volunteering guidelines.' },
      { title: 'Start volunteering in programs', description: 'You begin contributing to the initiative that matches your availability and interest.' }
    ],
    donationSteps: [
      { title: 'Get in touch with us', description: 'Send us your donation interest through the contact form or other listed channels.' },
      { title: 'Our team connects with you', description: 'We reach out personally to understand your intent and preferred giving method.' },
      { title: 'We share donation details and options', description: 'You receive the available contribution modes and any required documentation details.' },
      { title: 'You complete the contribution', description: 'You finalize the donation using the method that works best for you.' },
      { title: 'Receive confirmation and 80G receipt (if applicable)', description: 'We confirm the contribution and share the acknowledgement and tax receipt when eligible.' }
    ]
  }
};

export default function ContactEditor() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPage('contact')
      .then(r => {
        const page = r.data.data;
        const sections = [...(page.sections || [])];
        const hasContactFlow = sections.some(section => section.type === 'contact_flow');

        if (!hasContactFlow) {
          sections.push({ ...defaultContactFlowSection });
        }

        setPageData({
          ...page,
          sections
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getInfo = () => pageData?.sections?.find(s => s.type === 'contact_info')?.content || {};
  const getFlow = () => pageData?.sections?.find(s => s.type === 'contact_flow')?.content || defaultContactFlowSection.content;

  const updateInfo = (field, value) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.type === 'contact_info' ? { ...s, content: { ...s.content, [field]: value } } : s
      )
    }));
  };

  const updateFlow = (field, value) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.type === 'contact_flow' ? { ...s, content: { ...s.content, [field]: value } } : s
      )
    }));
  };

  const updateFlowStep = (flowType, stepIndex, field, value) => {
    const flow = [...(getFlow()?.[flowType] || [])];
    flow[stepIndex] = { ...flow[stepIndex], [field]: value };
    updateFlow(flowType, flow);
  };

  const updateSocial = (platform, value) => {
    const info = getInfo();
    updateInfo('socialLinks', { ...(info.socialLinks || {}), [platform]: value });
  };

  const updateHero = (field, value) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.type === 'page_hero' ? { ...s, content: { ...s.content, [field]: value } } : s
      )
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage('contact', pageData);
      toast.success('Contact info saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const info = getInfo();
  const hero = pageData?.sections?.find(s => s.type === 'page_hero')?.content || {};
  const flow = getFlow();

  return (
    <div>
      <AdminPageHeader title="Contact Editor" subtitle="Edit contact information, social links, and hero image.">
        <SaveButton saving={saving} onClick={handleSave} />
      </AdminPageHeader>

      <AdminSectionCard title="Page Header" icon="P">
        <div className="space-y-4">
          <Field label="Heading" value={hero.heading} onChange={e => updateHero('heading', e.target.value)} />
          <Field label="Subtext" value={hero.subtext} onChange={e => updateHero('subtext', e.target.value)} />
          <ImageUploader label="Hero Image" currentUrl={hero.image}
            onUpload={url => updateHero('image', url)}
            onUrlChange={url => updateHero('image', url)} />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Contact Details" icon="C">
        <div className="space-y-4">
          <Field label="Email Address" value={info.email} onChange={e => updateInfo('email', e.target.value)}
            placeholder="contact@letscelebratefitness.org" type="email" />
          <Field label="Phone Number" value={info.phone} onChange={e => updateInfo('phone', e.target.value)}
            placeholder="+91 XXXXX XXXXX" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <textarea value={info.address || ''} onChange={e => updateInfo('address', e.target.value)} rows={3}
              placeholder="Full mailing address..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Social Media Links" icon="S">
        <div className="space-y-4">
          {['facebook', 'instagram'].map(platform => (
            <Field
              key={platform}
              label={platform.charAt(0).toUpperCase() + platform.slice(1) + ' URL'}
              value={info.socialLinks?.[platform] || ''}
              onChange={e => updateSocial(platform, e.target.value)}
              placeholder={`https://${platform}.com/letscelebratefitness`}
              type="url"
            />
          ))}
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Contact Flow Section" icon="F">
        <div className="space-y-6">
          <div className="space-y-4">
            <Field
              label="Section Heading"
              value={flow.heading}
              onChange={e => updateFlow('heading', e.target.value)}
            />
            <Field
              label="Subtext"
              value={flow.subtext}
              onChange={e => updateFlow('subtext', e.target.value)}
            />
            <Field
              label="Response Note"
              value={flow.responseNote}
              onChange={e => updateFlow('responseNote', e.target.value)}
            />
            <Field
              label="Donation Helper Note"
              value={flow.donationNote}
              onChange={e => updateFlow('donationNote', e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Volunteer Flow</h3>
            {(flow.volunteerSteps || []).map((step, index) => (
              <div key={`volunteer-${index}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <div className="text-sm font-medium text-primary-dark">Step {index + 1}</div>
                <Field
                  label="Title"
                  value={step.title}
                  onChange={e => updateFlowStep('volunteerSteps', index, 'title', e.target.value)}
                />
                <Field
                  label="Description"
                  value={step.description}
                  onChange={e => updateFlowStep('volunteerSteps', index, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Donation Flow</h3>
            {(flow.donationSteps || []).map((step, index) => (
              <div key={`donation-${index}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <div className="text-sm font-medium text-primary-dark">Step {index + 1}</div>
                <Field
                  label="Title"
                  value={step.title}
                  onChange={e => updateFlowStep('donationSteps', index, 'title', e.target.value)}
                />
                <Field
                  label="Description"
                  value={step.description}
                  onChange={e => updateFlowStep('donationSteps', index, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </AdminSectionCard>

      <div className="sticky bottom-4 flex justify-end">
        <SaveButton saving={saving} onClick={handleSave} />
      </div>
    </div>
  );
}
