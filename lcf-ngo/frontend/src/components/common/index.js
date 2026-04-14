import React from 'react';
import { Link } from 'react-router-dom';
import ImplementationPlan from './ImplementationPlan';
import TheoryOfChange from './TheoryOfChange';

function scrollToCertificates() {
  const certificatesSection = document.getElementById('certificates-section');
  if (certificatesSection) {
    certificatesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function AnnouncementBar({ text, direction = 'left', pauseOnHover = true }) {
  const announcementText = text?.trim() || '80G Approved • CSR Registered • Govt Registered Trust (E-12984) • NGO Darpan Verified • 12A Registered';
  const marqueeClass = direction === 'right' ? 'marquee-track-right' : 'marquee-track-left';
  const trackItems = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className="flex items-center gap-4 pr-4 md:pr-8 shrink-0">
      
      <span className="text-sm md:text-[15px] font-medium tracking-[0.02em] text-white/90 whitespace-nowrap">
        {announcementText}
      </span>
      <button
        type="button"
        onClick={scrollToCertificates}
        className="shrink-0 rounded-full bg-accent/15 px-0.5 py-0.5 text-sm font-semibold text-accent transition-all duration-200 hover:bg-accent hover:text-primary-dark"
      >
        View Certificates →
      </button>
    </div>
  ));

  return (
    <section className={`relative overflow-hidden border-b border-white/10 bg-[linear-gradient(90deg,#261029_0%,#3E1240_35%,#154A59_100%)] shadow-[0_12px_30px_rgba(20,12,23,0.18)] ${pauseOnHover ? 'marquee-pause' : ''}`}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0) 18%, rgba(255,255,255,0.08) 36%)', backgroundSize: '280px 100%' }} />
      <div className="relative overflow-hidden">
        <div className={`marquee-track ${marqueeClass} py-3 md:py-3.5`}>
          {trackItems}
          {trackItems}
        </div>
      </div>
    </section>
  );
}

// ── Hero Section ───────────────────────────────────────
export function HeroSection({ content }) {
  const { heading, subtext, image, buttons = [] } = content;
  return (
    <section
      className="relative min-h-[90vh] flex items-center"
      style={{
        background: image
          ? `linear-gradient(135deg, rgba(62,18,64,0.88) 0%, rgba(90,30,92,0.75) 100%), url(${image}) center/cover no-repeat`
          : 'linear-gradient(135deg, #3E1240 0%, #5A1E5C 50%, #7d3080 100%)'
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="container-max px-4 md:px-8 py-20 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Let's Celebrate Fitness</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
            {heading}
          </h1>
          {subtext && (
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
              {subtext}
            </p>
          )}
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {buttons.map((btn, i) => (
                <Link
                  key={i}
                  to={btn.href || '/'}
                  className={i === 0 ? 'btn-accent' : 'border-2 border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-primary transition-all duration-200'}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 60 720 0 0 40L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

// ── Page Hero (inner pages) ────────────────────────────
export function PageHero({ content }) {
  const { heading, subtext, image } = content;
  return (
    <section
      className="relative  min-h-[60vh] md:min-h-[70vh] flex items-center justify-center"
      style={{
        background: image
          ? `linear-gradient(135deg, rgba(62,18,64,0.75) 0%, rgba(90,30,92,0.65) 100%), url(${image}) center/cover no-repeat`
          : 'linear-gradient(135deg, #3E1240 0%, #5A1E5C 100%)'
      }}
    >
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(#F2C94C 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="container-max px-4 md:px-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{heading}</h1>
        {subtext && <p className="text-white/80 text-xl max-w-2xl mx-auto">{subtext}</p>}
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40L1440 40L1440 10C1200 40 720 0 0 20L0 40Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

// ── Stats Grid ─────────────────────────────────────────
export function StatsSection({ content }) {
  const { heading, stats = [] } = content;
  return (
    <section className="section-padding bg-primary-light">
      <div className="container-max">
        {heading && (
          <div className="text-center mb-12">
            <h2 className="section-heading">{heading}</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="card p-6 md:p-8 text-center group hover:-translate-y-1">
              <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
              {stat.description && (
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{stat.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Initiative Card ────────────────────────────────────
export function InitiativeCard({ icon, title, text, image }) {
  const paragraphs = text
    ? text
      .split(/\n\s*\n/)
      .map(paragraph => paragraph.trim())
      .filter(Boolean)
    : [];

  return (
    <div className="card p-6 group hover:-translate-y-1">
      {image && (
        <div className="h-50 -mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-display font-bold text-primary-dark mb-2">{title}</h3>
      {paragraphs.length > 0 && (
        <div className="space-y-3">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-600 text-sm leading-relaxed">{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Event Card ─────────────────────────────────────────
export function EventCard({ event }) {
  const { title, description, date, location, participants, image, category, status, link } = event;
  return (
    <div className="card group hover:-translate-y-1">
      <div className="h-48 bg-primary-light overflow-hidden">
        {image
          ? <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🏃</div>
        }
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          {category && <span className="tag">{category}</span>}
          {status && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {status === 'upcoming' ? '🟢 Upcoming' : 'Past'}
            </span>
          )}
        </div>
        <h3 className="text-lg font-display font-bold text-primary-dark mb-2">{title}</h3>
        {description && <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
          {date && <span>📅 {new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
          {location && <span>📍 {location}</span>}
          {participants && <span>👥 {participants.toLocaleString()}+ participants</span>}
        </div>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm py-2 px-4 inline-block w-full text-center"
          >
            Register Now
          </a>
        )}
      </div>
    </div>
  );
}

// ── CTA Section ────────────────────────────────────────
export function CTASection({ content }) {
  const { heading, subtext, buttons = [] } = content;
  return (
    <section className="section-padding bg-primary">
      <div className="container-max text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{heading}</h2>
        {subtext && <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{subtext}</p>}
        {buttons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {buttons.map((btn, i) => (
              <Link
                key={i}
                to={btn.href || '/'}
                className={i === 0
                  ? 'btn-accent'
                  : 'border-2 border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-primary transition-all duration-200'
                }
              >
                {btn.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Media Badges ───────────────────────────────────────
export function MediaSection({ content }) {
  const { heading, outlets = [] } = content;
  return (
    <section className="section-padding bg-white border-t border-gray-100">
      <div className="container-max text-center">
        {heading && <p className="text-sm text-gray-400 uppercase tracking-widest font-medium mb-8">{heading}</p>}
        <div className="flex flex-wrap justify-center gap-4">
          {outlets.map((outlet, i) => (
            <div key={i} className="px-6 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-semibold text-sm hover:border-primary hover:text-primary hover:bg-primary-light transition-all duration-200">
              {outlet}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Loading Spinner ────────────────────────────────────
export function ContactFlowSection({ content }) {
  const {
    heading = 'What Happens Next?',
    subtext = "Here's what to expect after you get in touch with us.",
    responseNote = 'We typically respond within 24-48 hours.',
    donationNote = 'Our team will guide you through the donation process after you get in touch.',
    volunteerSteps = [],
    donationSteps = []
  } = content || {};
  const [activeTab, setActiveTab] = React.useState('volunteer');

  const tabs = [
    { id: 'volunteer', label: 'Volunteer', steps: volunteerSteps },
    { id: 'donate', label: 'Donate', steps: donationSteps }
  ];
  const activeSteps = tabs.find(tab => tab.id === activeTab)?.steps || [];

  return (
    <section className="section-padding bg-gray-50 border-t border-gray-100">
      <div className="container-max">
        <div className="text-center mb-10">
          <div className="tag mb-3">Contact Journey</div>
          <h2 className="section-heading">{heading}</h2>
          <p className="section-subtext mx-auto text-center mt-3">{subtext}</p>
        </div>

        <div className="card p-6 md:p-8 lg:p-10 shadow-soft">
          <div className="inline-flex rounded-2xl bg-primary-light p-1.5 mb-8">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive ? 'bg-primary text-white shadow-md' : 'text-primary hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white/80 p-5 md:p-6 transition-all duration-300">
            <div key={activeTab} className="space-y-5 transition-all duration-300">
              {activeSteps.map((step, index) => (
                <div key={`${activeTab}-${index}`} className="group relative pl-16">
                  {index < activeSteps.length - 1 && (
                    <div className="absolute left-[1.4rem] top-12 h-[calc(100%+0.75rem)] w-px bg-gradient-to-b from-primary/40 to-primary/10" />
                  )}
                  <div className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                    {index + 1}
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                    <h3 className="text-base font-display font-bold text-primary-dark">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {activeTab === 'donate' && (
              <p className="mt-8 rounded-2xl bg-primary-light px-4 py-3 text-sm font-medium text-primary-dark">
                {donationNote}
              </p>
            )}

            <p className="mt-4 text-sm text-gray-500">{responseNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CertificatesSection({ content }) {
  const { heading, subtext, certificates = [] } = content;
  const visibleCertificates = certificates.filter(certificate => certificate?.title || certificate?.image);
  const getCertificateUrl = (certificate = {}) => (certificate.image || '').trim();
  const isPdfCertificate = (certificate = {}) => {
    const url = getCertificateUrl(certificate);
    return /\.pdf($|[?#])/i.test(url);
  };

  if (visibleCertificates.length === 0) return null;

  return (
    <section id="certificates-section" className="section-padding bg-gray-50 border-t border-gray-100">
      <div className="container-max">
        <div className="text-center mb-12">
          <div className="tag mb-3">Recognition</div>
          {heading && <h2 className="section-heading">{heading}</h2>}
          {subtext && <p className="section-subtext mx-auto text-center mt-3">{subtext}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCertificates.map((certificate, index) => (
            <article key={`${certificate.title || 'certificate'}-${index}`} className="card overflow-hidden group hover:-translate-y-1">
              <div className="aspect-[4/3] bg-primary-light overflow-hidden flex items-center justify-center">
                {getCertificateUrl(certificate) && !isPdfCertificate(certificate) ? (
                  <img
                    src={getCertificateUrl(certificate)}
                    alt={certificate.alt || certificate.title || 'Certificate'}
                    className="w-full h-full object-contain bg-white p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : getCertificateUrl(certificate) ? (
                  <iframe
                    src={`${getCertificateUrl(certificate)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    title={certificate.title || `Certificate ${index + 1}`}
                    className="w-full h-full bg-white"
                  />
                ) : (
                  <div className="text-center text-primary px-6">
                    <div className="text-5xl mb-3">Certificate</div>
                    <p className="text-sm text-primary/70">Add certificate image</p>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-display font-bold text-primary-dark">
                  {certificate.title || `Certificate ${index + 1}`}
                </h3>
                {getCertificateUrl(certificate) && (
                  <a
                    href={getCertificateUrl(certificate)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex mt-4 text-sm font-semibold text-primary hover:text-primary-dark"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ content, tone = 'light' }) {
  const { heading, subtext, testimonials = [] } = content;
  if (!testimonials.length) return null;

  const sectionClass = tone === 'tinted' ? 'section-padding bg-primary-light' : 'section-padding bg-white';

  return (
    <section className={sectionClass}>
      <div className="container-max">
        <div className="text-center mb-12">
          <div className="tag mb-3">Testimonials</div>
          {heading && <h2 className="section-heading">{heading}</h2>}
          {subtext && <p className="section-subtext mx-auto text-center mt-3">{subtext}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <article key={`${testimonial.name || 'testimonial'}-${index}`} className="card p-7 md:p-8 border border-gray-100">
              <p className="text-primary text-4xl font-display leading-none mb-4">"</p>
              <p className="text-gray-600 leading-relaxed mb-6">{testimonial.quote}</p>
              <div className="pt-4 border-t border-gray-100">
                <div className="font-semibold text-primary-dark">{testimonial.name}</div>
                {testimonial.role && <div className="text-sm text-gray-500 mt-1">{testimonial.role}</div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

// ── Section Wrapper (handles visibility) ──────────────
export function SectionWrapper({ section, children }) {
  if (!section?.visible) return null;
  return <>{children}</>;
}

export { ImplementationPlan };
export { TheoryOfChange };
