import React, { useEffect, useState } from 'react';
import { getPage, updatePage } from '../../api';
import { toast } from 'react-toastify';
import {
  Field, TextArea, VisibilityToggle, ImageUploader,
  SaveButton, AdminSectionCard, AdminPageHeader
} from '../components/FormComponents';
import { LoadingSpinner } from '../../components/common';

const defaultCertificatesSection = {
  type: 'certificates',
  visible: true,
  order: 7,
  content: {
    heading: 'Certificates & Recognition',
    subtext: 'Showcase honors, recognitions, and important certificates.',
    certificates: [
      { title: 'New Certificate', image: '', alt: '' }
    ]
  }
};

const defaultTestimonialsSection = {
  type: 'testimonials',
  visible: true,
  order: 8,
  content: {
    heading: 'Voices From The Community',
    subtext: 'Stories that reflect the trust, care, and impact behind every initiative.',
    testimonials: [
      { quote: '', name: '', role: '' }
    ]
  }
};

const defaultAnnouncementSection = {
  type: 'announcement',
  visible: true,
  order: 1,
  content: {
    text: '80G Approved • CSR Registered • Govt Registered Trust (E-12984) • NGO Darpan Verified • 12A Registered',
    direction: 'left',
    pauseOnHover: true
  }
};

const defaultImplementationPlanSection = {
  type: 'implementation_plan',
  visible: true,
  order: 10,
  content: {
    heading: 'Implementation Plan',
    steps: [
      {
        title: 'Planning and Needs Assessment',
        points: [
          'Conduct surveys and community meetings to identify needs related to food security, sports, education, and climate change.',
          'Partner with local experts, NGOs, and government bodies.'
        ]
      },
      {
        title: 'Resource Allocation and Collaboration',
        points: [
          'Allocate budget efficiently.',
          'Collaborate with authorities, educational institutions, and NGOs.'
        ]
      },
      {
        title: 'Execution and Monitoring',
        points: [
          'Roll out programs as per schedule.',
          'Build infrastructure like community kitchens and learning centers.',
          'Monitor progress using KPIs.'
        ]
      },
      {
        title: 'Evaluation and Reporting',
        points: [
          'Analyze impact data.',
          'Prepare reports for stakeholders and CSR compliance.',
          'Gather feedback for improvement.'
        ]
      },
      {
        title: 'Sustainability and Scale-up',
        points: [
          'Ensure long-term sustainability and community ownership.',
          'Expand successful initiatives to other regions.'
        ]
      }
    ]
  }
};

const defaultTheoryOfChangeSection = {
  type: 'theory_of_change',
  visible: true,
  order: 11,
  content: {
    heading: 'LCF | Theory of Change',
    categories: [
      {
        label: 'Food',
        intervention: 'Food distribution for underprivileged groups',
        inputs: 'Daily food distribution to needy and homeless',
        outcomes: 'End of hunger',
        impact: 'Healthy and nutritional communities'
      },
      {
        label: 'Sports',
        intervention: 'Football training for municipal & govt schools',
        inputs: 'Skills training, exposure events, fitness',
        outcomes: 'Students gain skills and career exposure',
        impact: 'Improved employability in sports & other careers'
      },
      {
        label: 'Education',
        intervention: 'Support for financially weaker students',
        inputs: 'School fees and educational equipment',
        outcomes: 'Reduced dropout rates',
        impact: 'Improved employability'
      },
      {
        label: 'Climate Change',
        intervention: 'Tree plantation & cleanliness drives',
        inputs: 'Planting and nurturing trees',
        outcomes: 'Better air quality, water conservation',
        impact: 'Reduced carbon footprint'
      }
    ]
  }
};

export default function HomeEditor() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPage('home')
      .then(r => {
        const page = r.data.data;
        const existingSections = page.sections || [];
        const hasAnnouncement = existingSections.some(section => section.type === 'announcement');
        const hasTestimonials = existingSections.some(section => section.type === 'testimonials');
        const hasCertificates = page?.sections?.some(section => section.type === 'certificates');
        const hasImplementationPlan = page?.sections?.some(section => section.type === 'implementation_plan');
        const hasTheoryOfChange = page?.sections?.some(section => section.type === 'theory_of_change');
        let sections = [...existingSections];

        if (!hasAnnouncement) {
          sections = [
            ...sections.map(section => ({ ...section, order: (section.order || 0) + 1 })),
            { ...defaultAnnouncementSection }
          ];
        }

        if (!hasCertificates) {
          const maxOrder = Math.max(...sections.map(section => section.order || 0), 0);
          sections = [
            ...sections,
            { ...defaultCertificatesSection, order: maxOrder + 1 }
          ];
        }

        if (!hasTestimonials) {
          const maxOrder = Math.max(...sections.map(section => section.order || 0), 0);
          sections = [
            ...sections,
            { ...defaultTestimonialsSection, order: maxOrder + 1 }
          ];
        }

        if (!hasImplementationPlan) {
          const ctaSection = sections.find(section => section.type === 'cta');
          const implementationOrder = ctaSection?.order || (Math.max(...sections.map(section => section.order || 0), 0) + 1);

          sections = sections.map(section => (
            section.order >= implementationOrder
              ? { ...section, order: section.order + 1 }
              : section
          ));

          sections = [
            ...sections,
            { ...defaultImplementationPlanSection, order: implementationOrder }
          ];
        }

        if (!hasTheoryOfChange) {
          const ctaSection = sections.find(section => section.type === 'cta');
          const theoryOrder = ctaSection?.order || (Math.max(...sections.map(section => section.order || 0), 0) + 1);

          sections = sections.map(section => (
            section.order >= theoryOrder
              ? { ...section, order: section.order + 1 }
              : section
          ));

          sections = [
            ...sections,
            { ...defaultTheoryOfChangeSection, order: theoryOrder }
          ];
        }

        setPageData({
          ...page,
          sections
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getSection = (type) => pageData?.sections?.find(s => s.type === type);

  const updateSection = (type, updates) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.type === type ? { ...s, ...updates } : s
      )
    }));
  };

  const updateContent = (type, field, value) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.type === type ? { ...s, content: { ...s.content, [field]: value } } : s
      )
    }));
  };

  const updateStatItem = (idx, field, value) => {
    const stats = [...(getSection('stats')?.content?.stats || [])];
    stats[idx] = { ...stats[idx], [field]: value };
    updateContent('stats', 'stats', stats);
  };

  const updateInitiative = (idx, field, value) => {
    const initiatives = [...(getSection('initiatives_preview')?.content?.initiatives || [])];
    initiatives[idx] = { ...initiatives[idx], [field]: value };
    updateContent('initiatives_preview', 'initiatives', initiatives);
  };

  const updateButton = (sectionType, idx, field, value) => {
    const buttons = [...(getSection(sectionType)?.content?.buttons || [])];
    buttons[idx] = { ...buttons[idx], [field]: value };
    updateContent(sectionType, 'buttons', buttons);
  };

  const updateCertificate = (idx, field, value) => {
    const certificates = [...(getSection('certificates')?.content?.certificates || [])];
    certificates[idx] = { ...certificates[idx], [field]: value };
    updateContent('certificates', 'certificates', certificates);
  };

  const addCertificate = () => {
    const certificates = [...(getSection('certificates')?.content?.certificates || [])];
    updateContent('certificates', 'certificates', [
      ...certificates,
      { title: 'New Certificate', image: '', alt: '' }
    ]);
  };

  const removeCertificate = (idx) => {
    const certificates = (getSection('certificates')?.content?.certificates || []).filter((_, index) => index !== idx);
    updateContent('certificates', 'certificates', certificates);
  };

  const updateTestimonial = (idx, field, value) => {
    const testimonials = [...(getSection('testimonials')?.content?.testimonials || [])];
    testimonials[idx] = { ...testimonials[idx], [field]: value };
    updateContent('testimonials', 'testimonials', testimonials);
  };

  const updateImplementationStep = (idx, field, value) => {
    const steps = [...(getSection('implementation_plan')?.content?.steps || [])];
    steps[idx] = { ...steps[idx], [field]: value };
    updateContent('implementation_plan', 'steps', steps);
  };

  const updateImplementationPoint = (stepIdx, pointIdx, value) => {
    const steps = [...(getSection('implementation_plan')?.content?.steps || [])];
    const points = [...(steps[stepIdx]?.points || [])];
    points[pointIdx] = value;
    steps[stepIdx] = { ...steps[stepIdx], points };
    updateContent('implementation_plan', 'steps', steps);
  };

  const updateTheoryCategory = (idx, field, value) => {
    const categories = [...(getSection('theory_of_change')?.content?.categories || [])];
    categories[idx] = { ...categories[idx], [field]: value };
    updateContent('theory_of_change', 'categories', categories);
  };

  const addTestimonial = () => {
    const testimonials = [...(getSection('testimonials')?.content?.testimonials || [])];
    updateContent('testimonials', 'testimonials', [...testimonials, { quote: '', name: '', role: '' }]);
  };

  const removeTestimonial = (idx) => {
    const testimonials = (getSection('testimonials')?.content?.testimonials || []).filter((_, index) => index !== idx);
    updateContent('testimonials', 'testimonials', testimonials);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePage('home', pageData);
      toast.success('Home page saved!');
    } catch (err) {
      toast.error('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const moveSection = (type, dir) => {
    setPageData(prev => {
      const sections = [...prev.sections].sort((a, b) => a.order - b.order);
      const idx = sections.findIndex(s => s.type === type);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= sections.length) return prev;
      const temp = sections[idx].order;
      sections[idx].order = sections[swapIdx].order;
      sections[swapIdx].order = temp;
      return { ...prev, sections };
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!pageData) return <div className="text-gray-400 p-8">Page data not found. Run the seed script.</div>;

  const sorted = [...pageData.sections].sort((a, b) => a.order - b.order);
  const hero = getSection('hero');
  const announcement = getSection('announcement');
  const stats = getSection('stats');
  const about = getSection('about_snippet');
  const initiatives = getSection('initiatives_preview');
  const founder = getSection('founder_snippet');
  const media = getSection('media');
  const testimonials = getSection('testimonials');
  const certificates = getSection('certificates');
  const implementationPlan = getSection('implementation_plan');
  const theoryOfChange = getSection('theory_of_change');
  const cta = getSection('cta');

  return (
    <div>
      <AdminPageHeader title="Home Page Editor" subtitle="Edit the homepage content, sections, and layout.">
        <SaveButton saving={saving} onClick={handleSave} />
      </AdminPageHeader>

      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Section Order</h3>
        <div className="space-y-2">
          {sorted.map((sec, i) => (
            <div key={sec.type} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="flex-1 text-sm font-medium capitalize text-gray-600">{sec.type.replace(/_/g, ' ')}</div>
              <VisibilityToggle visible={sec.visible} onChange={v => updateSection(sec.type, { visible: v })} label="" />
              <div className="flex gap-1">
                <button
                  onClick={() => moveSection(sec.type, -1)}
                  disabled={i === 0}
                  className="min-w-12 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-xs flex items-center justify-center px-2"
                >
                  Up
                </button>
                <button
                  onClick={() => moveSection(sec.type, 1)}
                  disabled={i === sorted.length - 1}
                  className="min-w-12 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-xs flex items-center justify-center px-2"
                >
                  Down
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {announcement && (
        <AdminSectionCard title="Announcement Bar" icon="AB">
          <div className="space-y-4">
            <TextArea label="Announcement Text" value={announcement.content.text}
              onChange={e => updateContent('announcement', 'text', e.target.value)} rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Scroll Direction</label>
                <select
                  value={announcement.content.direction || 'left'}
                  onChange={e => updateContent('announcement', 'direction', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="flex items-end pb-2">
                <VisibilityToggle
                  visible={announcement.content.pauseOnHover !== false}
                  onChange={value => updateContent('announcement', 'pauseOnHover', value)}
                  label="Pause On Hover"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              The CTA is fixed to “View Certificates →” and scrolls visitors to the certificates section on the homepage.
            </p>
          </div>
        </AdminSectionCard>
      )}

      {hero && (
        <AdminSectionCard title="Hero Section" icon="H">
          <div className="space-y-4">
            <Field label="Heading" value={hero.content.heading}
              onChange={e => updateContent('hero', 'heading', e.target.value)} />
            <TextArea label="Subtext" value={hero.content.subtext}
              onChange={e => updateContent('hero', 'subtext', e.target.value)} rows={3} />
            <ImageUploader label="Hero Background Image" currentUrl={hero.content.image}
              onUpload={url => updateContent('hero', 'image', url)}
              onUrlChange={url => updateContent('hero', 'image', url)} />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Buttons</p>
              {(hero.content.buttons || []).map((btn, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 mb-2">
                  <Field label={`Button ${i + 1} Label`} value={btn.label}
                    onChange={e => updateButton('hero', i, 'label', e.target.value)} />
                  <Field label="Link (href)" value={btn.href}
                    onChange={e => updateButton('hero', i, 'href', e.target.value)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Variant</label>
                    <select value={btn.variant} onChange={e => updateButton('hero', i, 'variant', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminSectionCard>
      )}

      {stats && (
        <AdminSectionCard title="Stats Section" icon="S">
          <Field label="Section Heading" value={stats.content.heading}
            onChange={e => updateContent('stats', 'heading', e.target.value)} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(stats.content.stats || []).map((stat, i) => (
              <div key={i} className="p-4 bg-primary-light rounded-xl space-y-2">
                <Field label="Value" value={stat.value}
                  onChange={e => updateStatItem(i, 'value', e.target.value)} />
                <Field label="Label" value={stat.label}
                  onChange={e => updateStatItem(i, 'label', e.target.value)} />
              </div>
            ))}
          </div>
        </AdminSectionCard>
      )}

      {about && (
        <AdminSectionCard title="About Snippet" icon="A">
          <div className="space-y-4">
            <Field label="Heading" value={about.content.heading}
              onChange={e => updateContent('about_snippet', 'heading', e.target.value)} />
            <TextArea label="Text" value={about.content.text}
              onChange={e => updateContent('about_snippet', 'text', e.target.value)} rows={4} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Button Label" value={about.content.buttonLabel}
                onChange={e => updateContent('about_snippet', 'buttonLabel', e.target.value)} />
              <Field label="Button Link" value={about.content.buttonHref}
                onChange={e => updateContent('about_snippet', 'buttonHref', e.target.value)} />
            </div>
            <ImageUploader label="Section Image" currentUrl={about.content.image}
              onUpload={url => updateContent('about_snippet', 'image', url)}
              onUrlChange={url => updateContent('about_snippet', 'image', url)} />
          </div>
        </AdminSectionCard>
      )}

      {initiatives && (
        <AdminSectionCard title="Initiatives Preview" icon="I">
          <div className="space-y-4 mb-4">
            <Field label="Section Heading" value={initiatives.content.heading}
              onChange={e => updateContent('initiatives_preview', 'heading', e.target.value)} />
            <Field label="Subtext" value={initiatives.content.subtext}
              onChange={e => updateContent('initiatives_preview', 'subtext', e.target.value)} />
          </div>
          <div className="space-y-4">
            {(initiatives.content.initiatives || []).map((init, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Icon (emoji)" value={init.icon}
                  onChange={e => updateInitiative(i, 'icon', e.target.value)} />
                <Field label="Title" value={init.title}
                  onChange={e => updateInitiative(i, 'title', e.target.value)} />
                <Field label="Short Text" value={init.text}
                  onChange={e => updateInitiative(i, 'text', e.target.value)} />
              </div>
            ))}
          </div>
        </AdminSectionCard>
      )}

      {founder && (
        <AdminSectionCard title="Founder Snippet" icon="F">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Heading" value={founder.content.heading}
                onChange={e => updateContent('founder_snippet', 'heading', e.target.value)} />
              <Field label="Name" value={founder.content.name}
                onChange={e => updateContent('founder_snippet', 'name', e.target.value)} />
            </div>
            <Field label="Tagline" value={founder.content.tagline}
              onChange={e => updateContent('founder_snippet', 'tagline', e.target.value)} />
            <TextArea label="Text" value={founder.content.text}
              onChange={e => updateContent('founder_snippet', 'text', e.target.value)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Button Label" value={founder.content.buttonLabel}
                onChange={e => updateContent('founder_snippet', 'buttonLabel', e.target.value)} />
              <Field label="Button Link" value={founder.content.buttonHref}
                onChange={e => updateContent('founder_snippet', 'buttonHref', e.target.value)} />
            </div>
            <ImageUploader label="Founder Photo" currentUrl={founder.content.image}
              onUpload={url => updateContent('founder_snippet', 'image', url)}
              onUrlChange={url => updateContent('founder_snippet', 'image', url)} />
          </div>
        </AdminSectionCard>
      )}

      {media && (
        <AdminSectionCard title="Media Coverage" icon="M">
          <Field label="Section Heading" value={media.content.heading}
            onChange={e => updateContent('media', 'heading', e.target.value)} className="mb-4" />
          <div className="space-y-2">
            {(media.content.outlets || []).map((outlet, i) => (
              <div key={i} className="flex items-center gap-3">
                <input value={outlet}
                  onChange={e => {
                    const outlets = [...media.content.outlets];
                    outlets[i] = e.target.value;
                    updateContent('media', 'outlets', outlets);
                  }}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary" />
                <button
                  onClick={() => {
                    const outlets = media.content.outlets.filter((_, idx) => idx !== i);
                    updateContent('media', 'outlets', outlets);
                  }}
                  className="text-red-400 hover:text-red-600 text-sm px-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => updateContent('media', 'outlets', [...(media.content.outlets || []), 'New Outlet'])}
              className="text-sm text-primary hover:text-primary-dark font-medium">+ Add Outlet</button>
          </div>
        </AdminSectionCard>
      )}

      {testimonials && (
        <AdminSectionCard title="Testimonials Section" icon="T">
          <div className="space-y-4">
            <Field label="Section Heading" value={testimonials.content.heading}
              onChange={e => updateContent('testimonials', 'heading', e.target.value)} />
            <TextArea label="Subtext" value={testimonials.content.subtext}
              onChange={e => updateContent('testimonials', 'subtext', e.target.value)} rows={3} />
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm font-medium text-gray-700">Testimonial Cards</p>
              <button
                type="button"
                onClick={addTestimonial}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                + Add Testimonial
              </button>
            </div>
            <div className="space-y-5">
              {(testimonials.content.testimonials || []).map((testimonial, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-gray-700">{testimonial.name || `Testimonial ${i + 1}`}</p>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(i)}
                      className="text-red-400 hover:text-red-600 text-sm px-2"
                    >
                      Remove
                    </button>
                  </div>
                  <TextArea label="Quote" value={testimonial.quote}
                    onChange={e => updateTestimonial(i, 'quote', e.target.value)} rows={3} className="mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Name" value={testimonial.name}
                      onChange={e => updateTestimonial(i, 'name', e.target.value)} />
                    <Field label="Role" value={testimonial.role}
                      onChange={e => updateTestimonial(i, 'role', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminSectionCard>
      )}

      {certificates && (
        <AdminSectionCard title="Certificates Section" icon="C">
          <div className="space-y-4">
            <Field label="Section Heading" value={certificates.content.heading}
              onChange={e => updateContent('certificates', 'heading', e.target.value)} />
            <TextArea label="Subtext" value={certificates.content.subtext}
              onChange={e => updateContent('certificates', 'subtext', e.target.value)} rows={3} />
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm font-medium text-gray-700">Certificate Cards</p>
              <button
                type="button"
                onClick={addCertificate}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                + Add Certificate
              </button>
            </div>

            <div className="space-y-5">
              {(certificates.content.certificates || []).map((certificate, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-gray-700">
                      {certificate.title || `Certificate ${i + 1}`}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeCertificate(i)}
                      className="text-red-400 hover:text-red-600 text-sm px-2"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Field label="Title" value={certificate.title}
                      onChange={e => updateCertificate(i, 'title', e.target.value)} />
                    <Field label="Alt Text" value={certificate.alt}
                      onChange={e => updateCertificate(i, 'alt', e.target.value)} />
                  </div>
                  <ImageUploader label="Certificate Image" currentUrl={certificate.image}
                    onUpload={url => updateCertificate(i, 'image', url)}
                    onUrlChange={url => updateCertificate(i, 'image', url)} />
                </div>
              ))}
            </div>
          </div>
        </AdminSectionCard>
      )}

      {implementationPlan && (
        <AdminSectionCard title="Implementation Plan" icon="IP">
          <div className="space-y-4">
            <Field
              label="Section Heading"
              value={implementationPlan.content.heading}
              onChange={e => updateContent('implementation_plan', 'heading', e.target.value)}
            />
            <div className="space-y-5">
              {(implementationPlan.content.steps || []).map((step, stepIndex) => (
                <div key={stepIndex} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <Field
                    label={`Step ${stepIndex + 1} Title`}
                    value={step.title}
                    onChange={e => updateImplementationStep(stepIndex, 'title', e.target.value)}
                    className="mb-4"
                  />
                  <div className="grid grid-cols-1 gap-3">
                    {(step.points || []).map((point, pointIndex) => (
                      <TextArea
                        key={pointIndex}
                        label={`Bullet ${pointIndex + 1}`}
                        value={point}
                        onChange={e => updateImplementationPoint(stepIndex, pointIndex, e.target.value)}
                        rows={2}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminSectionCard>
      )}

      {theoryOfChange && (
        <AdminSectionCard title="Theory Of Change" icon="TC">
          <div className="space-y-4">
            <Field
              label="Section Heading"
              value={theoryOfChange.content.heading}
              onChange={e => updateContent('theory_of_change', 'heading', e.target.value)}
            />
            <div className="space-y-5">
              {(theoryOfChange.content.categories || []).map((category, categoryIndex) => (
                <div key={categoryIndex} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <Field
                    label={`Category ${categoryIndex + 1} Label`}
                    value={category.label}
                    onChange={e => updateTheoryCategory(categoryIndex, 'label', e.target.value)}
                    className="mb-4"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextArea
                      label="Intervention"
                      value={category.intervention}
                      onChange={e => updateTheoryCategory(categoryIndex, 'intervention', e.target.value)}
                      rows={3}
                    />
                    <TextArea
                      label="Inputs"
                      value={category.inputs}
                      onChange={e => updateTheoryCategory(categoryIndex, 'inputs', e.target.value)}
                      rows={3}
                    />
                    <TextArea
                      label="Outcomes"
                      value={category.outcomes}
                      onChange={e => updateTheoryCategory(categoryIndex, 'outcomes', e.target.value)}
                      rows={3}
                    />
                    <TextArea
                      label="Impact"
                      value={category.impact}
                      onChange={e => updateTheoryCategory(categoryIndex, 'impact', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminSectionCard>
      )}

      {cta && (
        <AdminSectionCard title="CTA Section" icon="CTA">
          <div className="space-y-4">
            <Field label="Heading" value={cta.content.heading}
              onChange={e => updateContent('cta', 'heading', e.target.value)} />
            <Field label="Subtext" value={cta.content.subtext}
              onChange={e => updateContent('cta', 'subtext', e.target.value)} />
            {(cta.content.buttons || []).map((btn, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <Field label={`Button ${i + 1} Label`} value={btn.label}
                  onChange={e => updateButton('cta', i, 'label', e.target.value)} />
                <Field label="Link" value={btn.href}
                  onChange={e => updateButton('cta', i, 'href', e.target.value)} />
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
