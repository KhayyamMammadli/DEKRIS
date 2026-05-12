import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useStore } from '../../store/appStore';
export function AppLayout(){ const s=useStore(); if(!s.user) return <Navigate to="/login"/>; return <div className={'app '+(s.sidebarCollapsed?'is-collapsed':'')}><Sidebar/><main className="main"><Header/><section className="page-wrap"><Outlet/></section></main></div> }
