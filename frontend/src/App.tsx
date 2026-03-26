import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateProfile from './pages/CreateProfile';
import ProfileDetail from './pages/ProfileDetail';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/:id" element={<ProfileDetail />} />
      <Route path="/create-profile" element={
        <ProtectedRoute><CreateProfile /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
    </Routes>
    <Footer />
  </BrowserRouter>
);

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
