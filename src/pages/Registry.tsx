import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { store, useStore } from '../store/appStore';
import { downloadText, fmt } from '../utils/helpers';
import type { Property } from '../types';

function newPropertyId(){ return 'P-' + Date.now(); }

export default function Registry(){
  const s = useStore();
  const [q,setQ] = useState('');
  const [selected,setSelected] = useState(s.properties[0]?.id || '');
  const [tab,setTab] = useState('Ümumi məlumat');
  const [showAdd,setShowAdd] = useState(false);
  const p = s.properties.find(x=>x.id===selected) || s.properties[0];
  const list = s.properties.filter(p=>[p.cadastralNo,p.address,p.owner].join(' ').toLowerCase().includes(q.toLowerCase()));

  return <>
    <div className="page-title row-between">
      <div>
        <h2>Daşınmaz əmlakın dövlət reyestri</h2>
        <p>Mülkiyyət, yüklülük, keçid, xitam, çıxarış və əmlak kartı</p>
      </div>
      <button className="primary" onClick={()=>setShowAdd(true)}>+ Əmlak əlavə et</button>
    </div>

    <div className="registry-layout">
      <Card title="Əmlak axtarışı">
        <div className="property-list">
          {list.map(item=><button key={item.id} onClick={()=>setSelected(item.id)} className={p?.id===item.id?'active':''}>
            <b>{item.cadastralNo}</b><span>{item.address}</span><small>{item.owner}</small>
          </button>)}
        </div>
      </Card>

      {p && <div className="property-main">
        <Card className="property-summary-card">
          <div className="property-summary clean-summary">
            <div className="building-icon">🏢</div>
            <div><small>Kadastr nömrəsi</small><h2>{p.cadastralNo}</h2></div>
            <div><small>Ünvan</small><b>{p.address}</b></div>
            <div><small>Status</small><Badge status={p.status}/></div>
            <div><small>Mülkiyyətçi</small><b>{p.owner}</b><span>{p.fin}</span></div>
            <div><small>Sahə</small><b>{p.area} kv.m</b></div>
          </div>
          <div className="actions">
            <button onClick={()=>downloadText('emlak-karti.txt',JSON.stringify(p,null,2))}>PDF ixrac et</button>
            <button onClick={()=>window.print()}>Çap et</button>
            <button onClick={()=>alert('Əməliyyatlar: hüquq əlavə et, yüklülük əlavə et, xitam ver, çıxarış yarat')}>Əməliyyatlar</button>
          </div>
        </Card>

        <div className="tabs">{['Ümumi məlumat','Sənədlər','Kadastr xəritəsi','Tarixçə'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>

        {tab==='Ümumi məlumat'&&<div className="grid-3 registry-cards">
          <Card title="Daşınmaz əmlakın məlumatları"><div className="info-grid"><span>Əmlakın növü</span><b>{p.type}</b><span>Təyinatı</span><b>{p.purpose}</b><span>İstifadə forması</span><b>{p.useForm}</b><span>Kateqoriya</span><b>{p.category}</b><span>Sahə</span><b>{p.area}</b><span>Tikili sahəsi</span><b>{p.buildingArea}</b><span>Mərtəbə sayı</span><b>{p.floor}</b><span>Kadastr dəyəri</span><b>{fmt(p.value)} AZN</b></div></Card>
        </div>}
        {tab==='Hüquqlar'&&<Card title="Hüquq sahibləri və yüklülüklər" className="table-card"><div className="table-scroll"><table><thead><tr><th>Hüquq növü</th><th>Hüquq sahibi / Yüklülük</th><th>Pay</th><th>Tarix</th><th>Status</th></tr></thead><tbody>{p.rights.map((r,i)=><tr key={i}><td>{r.kind}</td><td>{r.holder}</td><td>{r.share}</td><td>{r.date}</td><td><Badge status={r.status}/></td></tr>)}</tbody></table></div><div className="actions"><button onClick={()=>alert('Yeni hüquq / yüklülük əlavə edildi')}>+ Hüquq əlavə et</button></div></Card>}
        {tab==='Sənədlər'&&<Card title="Sənədlərin verilməsi"><p>Bu bölmədə çıxarış, texniki pasport, kadastr planı və arayışlar hazırlanır.</p>{p.documents.map(d=><button key={d} className="file">📄 {d}</button>)}<button className="primary" onClick={()=>alert('Yeni çıxarış yaradıldı')}>Çıxarış yarat</button></Card>}
        {tab==='Kadastr xəritəsi'&&<Card title="Tam kadastr xəritəsi"><Map cadastral={p.cadastralNo}/><div className="actions"><button>Layer dəyiş</button><button>Ölçmə aləti</button><button>Tam ekran</button></div></Card>}
        {tab==='Tarixçə'&&<Card title="Əməliyyat tarixçəsi"><ul className="timeline">{p.history.map((h,i)=><li key={i}><b>{h}</b></li>)}</ul></Card>}
      </div>}
    </div>
    {showAdd && <AddPropertyModal onClose={()=>setShowAdd(false)} onCreated={(id)=>{setSelected(id); setShowAdd(false)}} />}
  </>;
}

function AddPropertyModal({onClose,onCreated}:{onClose:()=>void; onCreated:(id:string)=>void}){
  const [form,setForm] = useState({cadastralNo:'', address:'', owner:'', fin:'', area:'', type:'Mənzil'});
  const set = (key:string,value:string)=>setForm(x=>({...x,[key]:value}));
  function submit(e:FormEvent){
    e.preventDefault();
    const id = newPropertyId();
    const p:Property = {
      id,
      cadastralNo: form.cadastralNo || '99:99:9999:' + Math.floor(Math.random()*9000+1000),
      address: form.address || 'Bakı şəhəri, yeni ünvan',
      owner: form.owner || 'Yeni mülkiyyətçi',
      fin: form.fin || '0000000000',
      status:'Qeydiyyatda',
      area:Number(form.area) || 100,
      buildingArea:Number(form.area) || 100,
      floor:1,
      value:120000,
      category: form.type,
      purpose:'Yaşayış',
      useForm:'Şəxsi mülkiyyət',
      type: form.type,
      rights:[{kind:'Mülkiyyət', holder:form.owner || 'Yeni mülkiyyətçi', share:'Tam', date:new Date().toLocaleDateString('az-AZ'), status:'Aktiv'}],
      documents:['Çıxarış.pdf'],
      history:['Əmlak reyestrə əlavə edildi']
    };
    store.addProperty(p); onCreated(id);
  }
  return <div className="modal app-modal" onMouseDown={onClose}>
    <form className="modal-card form-modal" onMouseDown={e=>e.stopPropagation()} onSubmit={submit}>
      <div className="row-between"><h2>Yeni əmlak əlavə et</h2><button type="button" className="close-btn" onClick={onClose}>×</button></div>
      <div className="form-grid">
        <label>Kadastr nömrəsi<input value={form.cadastralNo} onChange={e=>set('cadastralNo',e.target.value)} placeholder="29:012:1234:5678"/></label>
        <label>Mülkiyyətçi<input value={form.owner} onChange={e=>set('owner',e.target.value)} placeholder="Mülkiyyətçi adı"/></label>
        <label>VÖEN / FİN<input value={form.fin} onChange={e=>set('fin',e.target.value)} placeholder="1401234561"/></label>
        <label>Sahə<input value={form.area} onChange={e=>set('area',e.target.value)} placeholder="1250"/></label>
        <label>Əmlak növü<select value={form.type} onChange={e=>set('type',e.target.value)}><option>Mənzil</option><option>Torpaq sahəsi və üzərində tikili</option><option>Qeyri-yaşayış sahəsi</option></select></label>
        <label className="span-2">Ünvan<input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Bakı şəhəri, Nərimanov rayonu..."/></label>
      </div>
      <div className="actions"><button type="button" onClick={onClose}>Bağla</button><button className="primary" type="submit">Yadda saxla</button></div>
    </form>
  </div>
}

function Map({cadastral}:{cadastral:string}){return <div className="fake-map"><button>+</button><button>-</button><div className="parcel"><b>{cadastral}</b></div><span>Miqyas 1:500</span></div>}
