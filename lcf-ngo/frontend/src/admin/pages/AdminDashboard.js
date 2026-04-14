import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents, getAllGallery, getContacts } from '../../api';
import { useAuth } from '../../context/AuthContext';

const QuickCard = ({ to, icon, title, count, description, color }) => (
  <Link to={to} className={`card p-6 hover:-translate-y-1 border-t-4 ${color}`}>
    <div className="flex items-start justify-between mb-3">
      <div className="text-3xl">{icon}</div>
      {count !== undefined && (
        <span className="text-2xl font-display font-bold text-primary">{count}</span>
      )}
    </div>
    <h3 className="font-semibold text-gray-800">{title}</h3>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </Link>
);

export default function AdminDashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({ events: 0, gallery: 0, messages: 0, unread: 0 });

  useEffect(() => {
    Promise.allSettled([getAllEvents(), getAllGallery(), getContacts()])
      .then(([events, gallery, contacts]) => {
        setStats({
          events: events.value?.data?.data?.length || 0,
          gallery: gallery.value?.data?.data?.length || 0,
          messages: contacts.value?.data?.data?.length || 0,
          unread: contacts.value?.data?.data?.filter(c => !c.read)?.length || 0,
        });
      });
  }, []);

  const pages = [
    { to: '/admin/home', icon: 'H', title: 'Home Editor', desc: 'Hero, stats, initiatives preview', color: 'border-purple-400' },
    { to: '/admin/about', icon: 'A', title: 'About Editor', desc: 'Story, founder, mission & vision', color: 'border-blue-400' },
    { to: '/admin/initiatives', icon: 'I', title: 'Initiatives Editor', desc: 'Hero and initiative cards', color: 'border-green-400' },
    { to: '/admin/events', icon: 'E', title: 'Events Manager', desc: `${stats.events} events + hero`, color: 'border-yellow-400' },
    { to: '/admin/impact', icon: 'IM', title: 'Impact Editor', desc: 'Hero, stats, event highlights', color: 'border-emerald-400' },
    { to: '/admin/get-involved', icon: 'GI', title: 'Get Involved Editor', desc: 'Hero and option cards', color: 'border-cyan-400' },
    { to: '/admin/gallery', icon: 'G', title: 'Gallery Manager', desc: `${stats.gallery} images + hero`, color: 'border-pink-400' },
    { to: '/admin/contact', icon: 'C', title: 'Contact Editor', desc: 'Hero, email, phone, address, social', color: 'border-orange-400' },
    { to: '/admin/messages', icon: 'M', title: 'Messages Inbox', desc: `${stats.unread} unread of ${stats.messages}`, color: 'border-red-400' },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 mb-6 text-white">
        <h1 className="text-2xl font-display font-bold mb-1">
          Welcome back, {admin?.name || 'Admin'}
        </h1>
        <p className="text-white/70 text-sm">Manage your NGO website content from here.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Events', value: stats.events, icon: 'E' },
          { label: 'Gallery Images', value: stats.gallery, icon: 'G' },
          { label: 'Total Messages', value: stats.messages, icon: 'M' },
          { label: 'Unread', value: stats.unread, icon: 'U' },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-3xl font-display font-bold text-primary">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-display font-bold text-primary-dark mb-4">Content Editors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(p => (
          <QuickCard key={p.to} to={p.to} icon={p.icon} title={p.title} description={p.desc} color={p.color} />
        ))}
      </div>
    </div>
  );
}
