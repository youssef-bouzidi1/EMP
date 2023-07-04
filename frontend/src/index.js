import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Recruteur from './components/Recruteur';
import PostJobForm from './components/postjob';
import Header from './components/rheader'; // Import the Header component
import Getjob from './components/getjob';
import Cheader from './components/cheader';
import Candidat from './components/candidat';
import { Navigate } from 'react-router-dom';

const root = createRoot(document.getElementById('root'));
const isAuthenticated = !!localStorage.getItem('id');

// Higher-order component to protect routes that require authentication
const ProtectedRoute = ({ element, ...props }) => {
  if (isAuthenticated) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/recruteur" /> : <Home />
        }
      />

      <Route
        path="/recruteur"
        element={
          <>
            <Header />
            <ProtectedRoute element={<Recruteur />} />
          </>
        }
      />
      <Route
        path="/recruteur/postjob"
        element={
          <>
            <Header />
            <ProtectedRoute element={<PostJobForm />} />
          </>
        }
      />
      <Route
        path="/recruteur/myjobs"
        element={
          <>
            <Header />
            <ProtectedRoute element={<Getjob />} />
          </>
        }
      />
      <Route
        path="/candidat"
        element={
          <>
            <Cheader />
            <ProtectedRoute element={<Candidat />} />
          </>
        }
      />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();