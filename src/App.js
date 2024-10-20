import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './Components/Login';
import Profile from './Components/Profile';
import './App.css';

const clientId = '233961795977-hhankdead218f4e3usngm999i4jikvva.apps.googleusercontent.com'; // Replace with your actual client ID

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router basename='/collegeportal'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          {/* Redirect to /collegeportal/login if the route doesn't match */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
