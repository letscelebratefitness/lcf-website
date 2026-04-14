import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/initiatives', label: 'Initiatives' },
  { to: '/events', label: 'Events' },
  { to: '/impact', label: 'Impact' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/get-involved', label: 'Get Involved' },
  { to: '/contact', label: 'Contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-card py-2' : 'bg-white/95 backdrop-blur-sm py-4'
      }`}>
      <div className="container-max px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-soft group-hover:shadow-hover transition-shadow">
            <img src='/lcf-logo.png'></img>
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-primary text-base leading-tight">Let's Celebrate</div>
            <div className="text-xs text-gray-500 font-medium tracking-wider uppercase">Fitness</div>
          </div>
          <div className="hidden md:flex flex-col border-l border-gray-200 pl-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Call Us</span>
            <p
              href="tel:+919967813533"
              className="text-sm font-semibold text-primary-dark hover:text-primary transition-colors"
            >
              +91 9967813533
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                  ? 'text-primary bg-primary-light'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <Link to="/get-involved" className="hidden md:inline-flex btn-primary text-sm py-2 px-5">
            Get Involved
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 shadow-card">
          <nav className="flex flex-col gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-primary bg-primary-light' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container-max px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg"><img src='/lcf-logo.png'></img></div>
              <div>
                <div className="font-display font-bold text-lg">Let's Celebrate Fitness</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Non-Profit Organization</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Fitness that creates social impact. Together we run farther, give more, and celebrate life.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.slice(0, 5).map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 hover:text-accent text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">Get Involved</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/get-involved" className="hover:text-accent transition-colors">Volunteer With Us</Link></li>
              <li><Link to="/get-involved" className="hover:text-accent transition-colors">Make a Donation</Link></li>
              <li><Link to="/events" className="hover:text-accent transition-colors">Upcoming Events</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Let's Celebrate Fitness. All rights reserved.
          </p>
          <Link to="/admin/login" className="text-white/30 hover:text-white/60 text-xs transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
