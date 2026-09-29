import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage.js';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InterestSetupPage from './pages/InterestSetupPage';
import HomePage from './pages/HomePage.js';
import DiscoverPage from './pages/DiscoverPage.js';
import CommunitiesPage from './pages/CommunitiesPage.js';
import CommunityDetailPage from './pages/CommunityDetailPage';
import CreatePage from './pages/CreatePage';
import CreatePostPage from './pages/CreatePostPage';
import CollaborationsPage from './pages/CollaborationsPage';
import CollaborationDetailPage from './pages/CollaborationDetailPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import PrivacySettingsPage from './pages/PrivacySettingsPage';
import SafetyCenterPage from './pages/SafetyCenterPage';
import AppealPage from './pages/AppealPage';
import ReportPage from './pages/ReportPage';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminPosts from './admin/AdminPosts';
import AdminReports from './admin/AdminReports';
import AdminModeration from './admin/AdminModeration';
import AdminFakeAccounts from './admin/AdminFakeAccounts';
import AdminEngagement from './admin/AdminEngagement';
import AdminCollaborations from './admin/AdminCollaborations';
import AdminAppeals from './admin/AdminAppeals';
import AdminSafety from './admin/AdminSafety';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './admin/AdminLayout';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const { auth } = useAuth();

  if (auth.loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              auth.token ? <Navigate to="/home" replace /> : <LoginPage />
            } />
            <Route path="/register" element={
              auth.token ? <Navigate to="/home" replace /> : <RegisterPage />
            } />
            <Route path="/admin/login" element={
              auth.user?.role === 'admin' ? <Navigate to="/admin" replace /> : <LoginPage admin />
            } />
            <Route path="/forgot-password" element={<Navigate to="/login" replace />} />
            <Route path="/interests/setup" element={<InterestSetupPage />} />
            
            {/* Protected Routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <MainLayout>
                  <HomePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/discover" element={
              <ProtectedRoute>
                <MainLayout>
                  <DiscoverPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/communities" element={
              <ProtectedRoute>
                <MainLayout>
                  <CommunitiesPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/community/:id" element={
              <ProtectedRoute>
                <MainLayout>
                  <CommunityDetailPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <MainLayout>
                  <CreatePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/create/post" element={
              <ProtectedRoute>
                <MainLayout>
                  <CreatePostPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/collaborations" element={
              <ProtectedRoute>
                <MainLayout>
                  <CollaborationsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/collaborations/:id" element={
              <ProtectedRoute>
                <MainLayout>
                  <CollaborationDetailPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings/privacy" element={
              <ProtectedRoute>
                <MainLayout>
                  <PrivacySettingsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/safety" element={
              <ProtectedRoute>
                <MainLayout>
                  <SafetyCenterPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/appeal/:postId" element={
              <ProtectedRoute>
                <MainLayout>
                  <AppealPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <MainLayout>
                  <ReportPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/posts" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminPosts />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/reports" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminReports />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/moderation" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminModeration />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/fake-accounts" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminFakeAccounts />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/engagement" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminEngagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/collaborations" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminCollaborations />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/appeals" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminAppeals />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/safety" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminSafety />
                </AdminLayout>
              </AdminRoute>
            } />
            
            {/* Redirect to home if authenticated */}
          
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;