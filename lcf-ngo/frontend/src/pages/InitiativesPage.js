import React, { useEffect, useState } from 'react';
import { getPage } from '../api';
import { PageHero, InitiativeCard, LoadingSpinner } from '../components/common';

export default function InitiativesPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPage('initiatives').then(r => setPageData(r.data.data)).catch(console.error).finally(() => setLoading(false));
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
      case 'initiatives_grid':
        return (
          <section key={section._id} className="section-padding bg-white">
            <div className="container-max">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(c.initiatives || []).map((init, i) => (
                  <InitiativeCard key={i} {...init} text={init.description} />
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
