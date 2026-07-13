import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AICopilot from './components/AICopilot';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import Goals from './pages/Goals';
import Risk from './pages/Risk';
import Reports from './pages/Reports';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/*"
          element={
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Header />
                <div className="content-area">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/investments" element={<Investments />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/risk" element={<Risk />} />
                    <Route path="/reports" element={<Reports />} />
                  </Routes>
                </div>
              </div>
              <AICopilot />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
