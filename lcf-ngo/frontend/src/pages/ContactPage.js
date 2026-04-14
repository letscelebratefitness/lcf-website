import React, { useEffect, useState } from 'react';
import { getPage, submitContact } from '../api';
import { PageHero, LoadingSpinner, ContactFlowSection } from '../components/common';
import { toast } from 'react-toastify';

function SocialIcon({ platform }) {
  const icons = {
    facebook: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
        <path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4H16V5.5c-.2 0-.9-.1-1.8-.1-1.8 0-3.1 1.1-3.1 3.2v2.6H9v2.8h2.3v7h2.2Z" />
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
        <path d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3Zm-.2 1.8A2.8 2.8 0 0 0 4.8 7.6v8.8a2.8 2.8 0 0 0 2.8 2.8h8.8a2.8 2.8 0 0 0 2.8-2.8V7.6a2.8 2.8 0 0 0-2.8-2.8H7.6Zm9.9 1.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
      </svg>
    )
  };

  return icons[platform] || <span className="text-sm font-bold">{platform[0]?.toUpperCase()}</span>;
}

export default function ContactPage() {
  const visibleSocialPlatforms = ['facebook', 'instagram'];
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getPage('contact').then(r => setPageData(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContact(form);
      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const hero = pageData?.sections?.find(s => s.type === 'page_hero')?.content || {};
  const contactInfo = pageData?.sections?.find(s => s.type === 'contact_info')?.content || {};
  const contactFlow = pageData?.sections?.find(s => s.type === 'contact_flow');
  const socialLinks = visibleSocialPlatforms
    .map(platform => [platform, contactInfo.socialLinks?.[platform]])
    .filter(([, url]) => Boolean(url));

  return (
    <div>
      <PageHero content={{ heading: hero.heading || 'Contact Us', subtext: hero.subtext || "We'd love to hear from you.", image: hero.image || '' }} />

      <section className="section-padding bg-white">
        <div className="container-max grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <div className="tag mb-4">Get in Touch</div>
            <h2 className="section-heading mb-6">Let's Talk</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Whether you want to volunteer, donate, partner with us, or just know more — we're happy to hear from you.
            </p>

            <div className="space-y-5">
              {[
                { icon: '📧', label: 'Email', value: contactInfo.email },
                { icon: '📞', label: 'Phone', value: contactInfo.phone },
                { icon: '📍', label: 'Address', value: contactInfo.address },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-primary-light">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</div>
                    <div className="text-primary-dark font-medium mt-0.5">{item.value || `TODO: Add ${item.label}`}</div>
                  </div>
                </div>
              ))}
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {socialLinks.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url?.startsWith('http') ? url : '#'}
                      className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center text-sm font-bold hover:bg-primary hover:text-white transition-all capitalize"
                      title={platform}
                      aria-label={platform}
                    >
                      <SocialIcon platform={platform} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="card p-8">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-display font-bold text-primary-dark mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you as soon as possible.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary mt-6 inline-flex">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-display font-bold text-primary-dark mb-6">Send Us a Message</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center flex disabled:opacity-50">
                  {submitting ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {contactFlow?.visible !== false && <ContactFlowSection content={contactFlow?.content} />}
    </div>
  );
}
