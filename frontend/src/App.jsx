import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Cafes from './pages/Cafes';
import Employees from './pages/Employees';
import API from './api/axios';
import './App.css';

export default function App() {
  const [apiStatus, setApiStatus] = useState({ ok: null, message: '' });

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await API.get('/health');
        if (!mounted) return;
        setApiStatus({ ok: true, message: (res.data && res.data.status) || 'ok' });
      } catch (err) {
        console.error('health check failed', err);
        if (!mounted) return;
        setApiStatus({ ok: false, message: API.getErrorMessage(err) });
      }
    };
    check();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <NavBar />
      <main style={{ padding: 24 }}>
        <div style={{ marginBottom: 12 }}>
          API status:
          {' '}
          {apiStatus.ok ? <span style={{ color: 'green' }}>reachable ({apiStatus.message})</span> : <span style={{ color: 'crimson' }}>unreachable ({apiStatus.message})</span>}
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/cafes" replace />} />
          <Route path="/cafes" element={<Cafes />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </main>
    </div>
  );
}
