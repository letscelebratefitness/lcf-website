import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'D', end: true },
  { to: '/admin/home', label: 'Home Editor', icon: 'H' },
  { to: '/admin/about', label: 'About Editor', icon: 'A' },
  { to: '/admin/initiatives', label: 'Initiatives', icon: 'I' },
  { to: '/admin/events', label: 'Events Manager', icon: 'E' },
  { to: '/admin/impact', label: 'Impact Editor', icon: 'IM' },
  { to: '/admin/get-involved', label: 'Get Involved', icon: 'GI' },
  { to: '/admin/gallery', label: 'Gallery Manager', icon: 'G' },
  { to: '/admin/contact', label: 'Contact Editor', icon: 'C' },
  { to: '/admin/messages', label: 'Messages', icon: 'M' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-100 shadow-soft h-full flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm">LCF</div>
          <div>
            <div className="font-display font-bold text-primary text-sm leading-tight">Let's Celebrate Fitness</div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
            {admin?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-700 truncate">{admin?.name}</div>
            <div className="text-xs text-gray-400 truncate">{admin?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 font-medium transition-colors"
        >
          <span>Out</span> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="hidden md:flex flex-col">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-soft">
          <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
            Menu
          </button>
          <div className="flex-1 md:flex-none">
            <Link to="/" target="_blank" rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
              View Public Site
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
              {admin?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
