import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Registry from './pages/Registry';
import Cadastre from './pages/Cadastre';
import Rights from './pages/Rights';
import Apartments from './pages/Apartments';
import Query from './pages/Query';
import Analytics from './pages/Analytics';
import Delivery from './pages/Delivery';
import Settings from './pages/Settings';
import { AppLayout } from './components/layout/AppLayout';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route element={<AppLayout/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/documents" element={<Documents/>}/>
          <Route path="/rights" element={<Rights/>}/>
          <Route path="/registry" element={<Registry/>}/>
          <Route path="/cadastre" element={<Cadastre/>}/>
          <Route path="/apartments" element={<Apartments/>}/>
          <Route path="/query" element={<Query/>}/>
          <Route path="/analytics" element={<Analytics/>}/>
          <Route path="/delivery" element={<Delivery/>}/>
          <Route path="/settings" element={<Settings/>}/>
        </Route>
        <Route path="*" element={<Navigate to="/login"/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
