import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import InitiativesPage from './pages/InitiativesPage';
import EventsPage from './pages/EventsPage';
import ImpactPage from './pages/ImpactPage';
import GalleryPage from './pages/GalleryPage';
import GetInvolvedPage from './pages/GetInvolvedPage';
import ContactPage from './pages/ContactPage';

// Admin pages
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import HomeEditor from './admin/pages/HomeEditor';
import AboutEditor from './admin/pages/AboutEditor';
import InitiativesEditor from './admin/pages/InitiativesEditor';
import EventsManager from './admin/pages/EventsManager';
import GalleryManager from './admin/pages/GalleryManager';
import ImpactEditor from './admin/pages/ImpactEditor';
import GetInvolvedEditor from './admin/pages/GetInvolvedEditor';
import ContactEditor from './admin/pages/ContactEditor';
import MessagesInbox from './admin/pages/MessagesInbox';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light">
      <div className="text-primary text-lg font-display">Loading...</div>
    </div>
  );
  return admin ? children : <Navigate to="/admin/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="initiatives" element={<InitiativesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="get-involved" element={<GetInvolvedPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={
        <PrivateRoute><AdminLayout /></PrivateRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="home" element={<HomeEditor />} />
        <Route path="about" element={<AboutEditor />} />
        <Route path="initiatives" element={<InitiativesEditor />} />
        <Route path="events" element={<EventsManager />} />
        <Route path="impact" element={<ImpactEditor />} />
        <Route path="get-involved" element={<GetInvolvedEditor />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="contact" element={<ContactEditor />} />
        <Route path="messages" element={<MessagesInbox />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
          toastStyle={{ fontFamily: 'DM Sans, sans-serif' }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
