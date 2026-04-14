import React, { useEffect, useState } from 'react';
import { getPage } from '../api';
import { PageHero, TestimonialsSection, LoadingSpinner } from '../components/common';

export default function ImpactPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPage('impact').then(r => setPageData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!pageData) return null;
  const sorted = [...(pageData.sections || [])].sort((a, b) => a.order - b.order);

  const renderSection = (section) => {
    if (!section?.visible) return null;
    const c = section.content;
    switch (section.type) {
      case 'page_hero':
        return <PageHero key={section._id} content={c} />;

      case 'impact_stats':
        return (
          <section key={section._id} className="section-padding bg-white">
            <div className="container-max">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(c.stats || []).map((stat, i) => (
                  <div key={i} className="card p-8 flex gap-6 items-start group hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-display font-bold text-primary">{['🍱','🏃','👩','🏅'][i] || '⭐'}</span>
                    </div>
                    <div>
                      <div className="text-4xl font-display font-bold text-primary group-hover:text-accent transition-colors">{stat.value}</div>
                      <div className="text-lg font-semibold text-primary-dark mt-1">{stat.label}</div>
                      {stat.description && <p className="text-gray-500 text-sm mt-2 leading-relaxed">{stat.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'events_impact':
        return (
          <section key={section._id} className="section-padding bg-primary-light">
            <div className="container-max">
              <div className="text-center mb-10">
                <h2 className="section-heading">{c.heading}</h2>
                <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
              </div>
              <div className="max-w-2xl mx-auto space-y-4">
                {(c.events || []).map((evt, i) => (
                  <div key={i} className="card p-5 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-primary-dark">{evt.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold text-primary">{evt.participants}</div>
                      <div className="text-xs text-gray-400">participants</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        return <TestimonialsSection key={section._id} content={c} tone="tinted" />;

      default: return null;
    }
  };

  return <div>{sorted.map(s => renderSection(s))}</div>;
}
