import { useEffect, useState } from 'react';
import { baseDocuments, properties } from '../data/mock';
import type { DocumentItem, Notification, Property, Status, User } from '../types';
const KEY = 'DEKRIS_FULL_STATE_V2';
export interface AppState { user: User | null; documents: DocumentItem[]; properties: Property[]; notifications: Notification[]; sidebarCollapsed:boolean; theme:'light'|'compact'; }
const initial: AppState = { user:null, documents:baseDocuments, properties, sidebarCollapsed:false, theme:'light', notifications:[{id:'N-1',text:'Yeni müraciət daxil olub',read:false,date:'22.05.2024'},{id:'N-2',text:'Son tarix yaxınlaşır',read:false,date:'22.05.2024'},{id:'N-3',text:'Kadastr xidməti aktivdir',read:false,date:'21.05.2024'}]};
let state: AppState = load();
let listeners: (()=>void)[] = [];
function load(){ try { const raw=localStorage.getItem(KEY); return raw ? JSON.parse(raw) as AppState : initial; } catch { return initial; } }
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); listeners.forEach(l=>l()); }
export const store = {
 get:()=>state,
 subscribe:(l:()=>void)=>{ listeners.push(l); return ()=>{listeners=listeners.filter(x=>x!==l)};},
 login:(email:string, password:string)=>{ if(!email || !password) throw new Error('Email və şifrə daxil edin'); state={...state,user:{name:'Əliyev Rəşad',role:'Baş mütəxəssis',email}}; save();},
 logout:()=>{ state={...state,user:null}; save();},
 toggleSidebar:()=>{ state={...state, sidebarCollapsed:!state.sidebarCollapsed}; save();},
 updateDocStatus:(id:string,status:Status)=>{ state={...state, documents:state.documents.map(d=>d.id===id?{...d,status,currentStep: status==='Tamamlandı'?'Tamamlandı':status}:d)}; save();},
 addDocument:(doc:DocumentItem)=>{ state={...state, documents:[doc,...state.documents], notifications:[{id:'N-'+Date.now(),text:'Yeni müraciət yaradıldı: '+doc.id,read:false,date:new Date().toLocaleDateString('az-AZ')},...state.notifications]}; save();},
 addNote:(id:string,note:string)=>{ state={...state, documents:state.documents.map(d=>d.id===id?{...d,notes:[note,...d.notes]}:d)}; save();},
 addProperty:(p:Property)=>{ state={...state, properties:[p,...state.properties]}; save();},
 markNotificationsRead:()=>{ state={...state,notifications:state.notifications.map(n=>({...n,read:true}))}; save();},
 updateProfile:(user:User)=>{ state={...state,user}; save();},
 reset:()=>{ state=initial; save();}
};
export function useStore(){ const [,setTick]=useState(0); useEffect(()=>store.subscribe(()=>setTick(x=>x+1)),[]); return store.get(); }
