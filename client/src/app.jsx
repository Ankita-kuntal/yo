import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Home from './pages/home/home';
// 👇 Import CardMaker to use as a full page
import CardMaker from './components/cardform/cardMaker';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AllEntries from './pages/allEntries/allEntries';
import EntryDetails from './pages/entryDetails/entryDetails';
import Analytics from './pages/analytics/analytics';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Dashboard only shows the list now */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* 👇 NEW PAGE: This is where the Wheel & Form live */}
          <Route
            path="/new-memory"
            element={
              <ProtectedRoute>
                <div className="maker-page">
                  <CardMaker />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/all-memories"
            element={
              <ProtectedRoute>
                <AllEntries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memory/:id"
            element={
              <ProtectedRoute>
                <EntryDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics" 
            element={<Analytics />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;