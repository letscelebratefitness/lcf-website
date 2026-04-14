import React, { useEffect, useState } from 'react';
import { getPage } from '../api';
import { PageHero, MediaSection, LoadingSpinner } from '../components/common';

export default function AboutPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPage('about').then(r => setPageData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!pageData) return null;

  const sorted = [...(pageData.sections || [])].sort((a, b) => a.order - b.order);
  const getParagraphs = (content) => {
    if (content?.paragraphs?.length) return content.paragraphs;
    if (content?.bio) {
      return content.bio
        .split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean);
    }
    return [];
  };

  const renderSection = (section) => {
    if (!section?.visible) return null;
    const c = section.content;

    switch (section.type) {
      case 'page_hero':
        return <PageHero key={section._id} content={c} />;

      case 'about_story':
        return (
          <section key={section._id} className="section-padding bg-white">
            <div className="container-max grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="tag mb-4">Our Story</div>
                <h2 className="section-heading mb-6">{c.heading}</h2>
                <div className="space-y-4">
                  {(c.paragraphs || []).map((p, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden h-72 bg-primary-light shadow-card flex items-center justify-center">
                {c.image
                  ? <img src={c.image} alt="Our Story" className="w-full h-full object-cover" />
                  : <div className="text-center text-primary"><div className="text-6xl mb-3">🌟</div><p className="text-sm opacity-60">TODO: Add story image</p></div>
                }
              </div>
            </div>
          </section>
        );

      case 'founder_full':
        return (
          <section key={section._id} className="section-padding bg-gray-50">
            <div className="container-max">
              <div className="text-center mb-12">
                <div className="tag mb-3">Founder</div>
                <h2 className="section-heading">{c.heading}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-10 items-start">
                <div className="flex flex-col items-center text-center">
                  {c.image
                    ? <img src={c.image} alt={c.name} className="w-52 h-full object-cover shadow-hover border-4 border-white mb-4" />
                    : (
                      <div className="w-52 h-52 rounded-full bg-primary flex flex-col items-center justify-center shadow-hover border-4 border-white mb-4">
                        <div className="text-5xl">🏅</div>
                        <div className="text-white font-semibold text-sm mt-2 px-4">TODO: Add photo</div>
                      </div>
                    )
                  }
                  <h3 className="text-xl font-display font-bold text-primary-dark">{c.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Founder, Let's Celebrate Fitness</p>
                </div>
                <div className="md:col-span-2">
                  <div className="space-y-4 mb-8">
                    {getParagraphs(c).map((paragraph, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed text-lg">{paragraph}</p>
                    ))}
                  </div>
                  <h4 className="font-semibold text-primary-dark mb-4">Key Achievements</h4>
                  <ul className="space-y-3">
                    {(c.highlights || []).map((h, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-primary-dark font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                        <span className="text-gray-600">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );

      case 'mission_vision':
        return (
          <section key={section._id} className="section-padding bg-primary">
            <div className="container-max grid md:grid-cols-2 gap-8">
              {[c.mission, c.vision].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-4xl mb-4">{i === 0 ? '🎯' : '🔭'}</div>
                  <h3 className="text-xl font-display font-bold text-white mb-4">{item?.heading}</h3>
                  <p className="text-white/80 leading-relaxed">{item?.text}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'media_coverage':
        return (
          <section key={section._id} className="section-padding bg-white">
            <div className="container-max text-center">
              <div className="tag mb-4">Media Coverage</div>
              <h2 className="section-heading mb-3">{c.heading}</h2>
              {c.subtext && <p className="text-gray-500 mb-8">{c.subtext}</p>}
              <div className="flex flex-wrap justify-center gap-4">
                {(c.outlets || []).map((o, i) => (
                  <div key={i} className="px-8 py-4 rounded-xl border-2 border-primary-light bg-primary-light text-primary font-bold text-lg hover:border-primary transition-colors">
                    {o}
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
