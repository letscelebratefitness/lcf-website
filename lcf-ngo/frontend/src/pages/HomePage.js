import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPage } from '../api';
import {
  AnnouncementBar, HeroSection, StatsSection, InitiativeCard,
  CTASection, MediaSection, CertificatesSection, TestimonialsSection, LoadingSpinner, ImplementationPlan, TheoryOfChange
} from '../components/common';

export default function HomePage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPage('home')
      .then(res => setPageData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!pageData) return null;

  const sorted = [...(pageData.sections || [])].sort((a, b) => a.order - b.order);

  const renderSection = (section) => {
    if (!section?.visible) return null;

    switch (section.type) {
      case 'announcement':
        return (
          <AnnouncementBar
            key={section._id}
            text={section.content?.text}
            direction={section.content?.direction}
            pauseOnHover={section.content?.pauseOnHover}
          />
        );

      case 'hero':
        return <HeroSection key={section._id} content={section.content} />;

      case 'stats':
        return <StatsSection key={section._id} content={section.content} />;

      case 'about_snippet': {
        const c = section.content;
        return (
          <section key={section._id} className="section-padding bg-white">
            <div className="container-max grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="tag mb-4">Our Story</div>
                <h2 className="section-heading mb-5">{c.heading}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{c.text}</p>
                {c.buttonHref && (
                  <Link to={c.buttonHref} className="btn-primary inline-flex">{c.buttonLabel}</Link>
                )}
              </div>
              <div className="relative">
                {c.image
                  ? <img src={c.image} alt="About LCF" className="rounded-2xl w-full shadow-card" />
                  : (
                    <div className="rounded-2xl bg-primary-light h-72 flex items-center justify-center">
                      <div className="text-center text-primary">
                        <div className="text-6xl mb-3">🏃‍♀️</div>
                        <div className="font-display font-bold text-xl">Let's Celebrate Fitness</div>
                        <p className="text-sm text-primary/70 mt-1">TODO: Add image</p>
                      </div>
                    </div>
                  )
                }
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent rounded-2xl opacity-30" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary rounded-xl opacity-20" />
              </div>
            </div>
          </section>
        );
      }

      case 'initiatives_preview': {
        const c = section.content;
        return (
          <section key={section._id} className="section-padding bg-gray-50">
            <div className="container-max">
              <div className="text-center mb-12">
                <div className="tag mb-3">What We Do</div>
                <h2 className="section-heading">{c.heading}</h2>
                {c.subtext && <p className="section-subtext mx-auto text-center mt-3">{c.subtext}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(c.initiatives || []).map((init, i) => (
                  <InitiativeCard key={i} icon={init.icon} title={init.title} text={init.text} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/initiatives" className="btn-primary inline-flex">Explore All Initiatives</Link>
              </div>
            </div>
          </section>
        );
      }

      case 'founder_snippet': {
        const c = section.content;
        return (
          <section key={section._id} className="section-padding bg-white">
            <div className="container-max">
              <div className="bg-primary-light rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
                <div className="order-2 md:order-1">
                  <div className="tag mb-4">Founder's Story</div>
                  <h2 className="section-heading mb-2">{c.heading}</h2>
                  <p className="text-primary font-semibold mb-1">{c.name}</p>
                  <p className="text-sm text-gray-500 mb-5">{c.tagline}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{c.text}</p>
                  {c.buttonHref && (
                    <Link to={c.buttonHref} className="btn-primary inline-flex">{c.buttonLabel}</Link>
                  )}
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  {c.image
                    ? <img src={c.image} alt={c.name} className="w-64 h-full object-cover shadow-hover border-4 border-white" />
                    : (
                      <div className="w-64 h-64 rounded-full bg-primary flex flex-col items-center justify-center shadow-hover border-4 border-white">
                        <div className="text-5xl mb-2">🏅</div>
                        <div className="text-white font-display font-bold text-center px-4">Richa Sameet</div>
                        <div className="text-white/60 text-xs mt-1">TODO: Add photo</div>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </section>
        );
      }

      case 'media':
        return <MediaSection key={section._id} content={section.content} />;

      case 'testimonials':
        return <TestimonialsSection key={section._id} content={section.content} tone="light" />;

      case 'certificates':
        return <CertificatesSection key={section._id} content={section.content} />;

      case 'implementation_plan':
        return <ImplementationPlan key={section._id} content={section.content} />;

      case 'theory_of_change':
        return <TheoryOfChange key={section._id} content={section.content} />;

      case 'cta':
        return <CTASection key={section._id} content={section.content} />;

      default:
        return null;
    }
  };

  return (
    <div>
      {sorted.map(section => renderSection(section))}
    </div>
  );
}
