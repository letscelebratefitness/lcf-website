import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPage } from '../api';
import { PageHero, LoadingSpinner } from '../components/common';

export default function GetInvolvedPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPage('get-involved').then(r => setPageData(r.data.data)).catch(console.error).finally(() => setLoading(false));
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
      case 'involvement_options':
        return (
          <section key={section._id} className="section-padding bg-white">
            <div className="container-max">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(c.options || []).map((opt, i) => (
                  <div key={i} className="card p-8 group hover:-translate-y-1 border-l-4 border-l-primary">
                    <div className="text-5xl mb-5">{opt.icon}</div>
                    <h3 className="text-xl font-display font-bold text-primary-dark mb-3">{opt.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-5">{opt.description}</p>
                    <Link to={opt.href || '/contact'} className="btn-primary inline-flex text-sm py-2 px-5">
                      {opt.cta} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      default: return null;
    }
  };

  return <div>{sorted.map(s => renderSection(s))}</div>;
}
