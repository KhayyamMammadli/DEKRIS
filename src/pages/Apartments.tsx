import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card } from '../components/ui/Card';
import { store, useStore } from '../store/appStore';
import type { Property } from '../types';

export default function Apartments(){
  const s = useStore();
  const buildings = s.properties.filter(p=>p.apartmentBuilding);
  const [selected,setSelected] = useState<typeof buildings[number] | null>(null);
  const [showAdd,setShowAdd] = useState(false);

  return <>
    <div className="page-title row-between">
      <div>
        <h2>Çoxmənzilli yaşayış binaları</h2>
        <p>Tikintiyə icazə, MTK üzvləri, üzvlüyə qəbul/çıxarılma, pay haqları və ümumi yığıncaq qərarları</p>
      </div>
      <button className="primary" onClick={()=>setShowAdd(true)}>+ Bina əlavə et</button>
    </div>

    <div className="apartments-grid">
      {buildings.map(p=><Card key={p.id} className="apartment-card">
        <div className="apartment-top">
          <div className="building-icon small-building">🏢</div>
          <div>
            <h3>{p.apartmentBuilding?.cooperative || p.owner}</h3>
            <p>{p.address}</p>
          </div>
        </div>
        <div className="metric-grid">
          <span><small>Üzv</small><b>{p.apartmentBuilding?.members}</b></span>
          <span><small>Pay</small><b>{p.apartmentBuilding?.shares}</b></span>
          <span><small>Qərar</small><b>{p.apartmentBuilding?.decisions}</b></span>
          <span><small>İcazə</small><b>{p.apartmentBuilding?.buildingPermit}</b></span>
        </div>
        <div className="actions">
          <button onClick={()=>setSelected(p)}>Ətraflı</button>
          <button onClick={()=>alert('Üzv qəbul/çıxarılma forması açıldı')}>Üzv əməliyyatı</button>
          <button onClick={()=>alert('Pay ödənişi qeydə alındı')}>Pay ödənişi</button>
        </div>
      </Card>)}
    </div>

    {selected && <div className="modal app-modal" onMouseDown={()=>setSelected(null)}>
      <div className="modal-card wide-modal" onMouseDown={e=>e.stopPropagation()}>
        <div className="row-between"><h2>{selected.apartmentBuilding?.cooperative}</h2><button className="close-btn" onClick={()=>setSelected(null)}>×</button></div>
        <p>{selected.address}</p>
        <div className="grid-3 modal-stats">
          <Card title="MTK üzvləri"><b className="big-number">{selected.apartmentBuilding?.members}</b><button onClick={()=>alert('Üzvlər siyahısı açıldı')}>Siyahıya bax</button></Card>
          <Card title="Pay haqları"><b className="big-number">{selected.apartmentBuilding?.shares}</b><button onClick={()=>alert('Pay haqları hesabatı açıldı')}>Ödənişlər</button></Card>
          <Card title="Ümumi yığıncaq qərarları"><b className="big-number">{selected.apartmentBuilding?.decisions}</b><button onClick={()=>alert('Qərarlar bölməsi açıldı')}>Qərarlar</button></Card>
        </div>
        <div className="actions"><button>Üzv qəbul et</button><button>Üzvlükdən çıxar</button><button className="primary">Yeni qərar əlavə et</button></div>
      </div>
    </div>}

    {showAdd && <AddBuildingModal onClose={()=>setShowAdd(false)} />}
  </>;
}

function AddBuildingModal({onClose}:{onClose:()=>void}){
  const [form,setForm] = useState({cooperative:'',address:'',permit:'',members:'',shares:'',decisions:''});
  const set=(k:string,v:string)=>setForm(x=>({...x,[k]:v}));
  function submit(e:FormEvent){
    e.preventDefault();
    const now = Date.now();
    const p:Property = {
      id:'B-'+now,
      cadastralNo:'77:77:7777:' + String(now).slice(-4),
      address:form.address || 'Bakı şəhəri, yeni bina ünvanı',
      owner:form.cooperative || 'Yeni MTK',
      fin:'0000000000',
      status:'Qeydiyyatda',
      area:0,
      buildingArea:0,
      floor:12,
      value:0,
      category:'Çoxmənzilli yaşayış binası',
      purpose:'Yaşayış',
      useForm:'MTK',
      type:'Çoxmənzilli yaşayış binası',
      rights:[],
      documents:['Tikinti icazəsi.pdf'],
      history:['Bina qeydiyyata alındı'],
      apartmentBuilding:{
        cooperative:form.cooperative || 'Yeni MTK',
        buildingPermit:form.permit || 'İcazə № 00/2024',
        members:Number(form.members)||0,
        shares:Number(form.shares)||0,
        decisions:Number(form.decisions)||0,
      }
    };
    store.addProperty(p);
    onClose();
  }
  return <div className="modal app-modal" onMouseDown={onClose}>
    <form className="modal-card form-modal" onMouseDown={e=>e.stopPropagation()} onSubmit={submit}>
      <div className="row-between"><h2>Yeni çoxmənzilli bina</h2><button type="button" className="close-btn" onClick={onClose}>×</button></div>
      <div className="form-grid">
        <label>MTK adı<input value={form.cooperative} onChange={e=>set('cooperative',e.target.value)} placeholder="Premium MTK"/></label>
        <label>Tikinti icazəsi<input value={form.permit} onChange={e=>set('permit',e.target.value)} placeholder="İcazə № 44/2024"/></label>
        <label>Üzv sayı<input value={form.members} onChange={e=>set('members',e.target.value)} placeholder="128"/></label>
        <label>Pay sayı<input value={form.shares} onChange={e=>set('shares',e.target.value)} placeholder="128"/></label>
        <label>Qərar sayı<input value={form.decisions} onChange={e=>set('decisions',e.target.value)} placeholder="12"/></label>
        <label className="span-2">Ünvan<input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Bakı şəhəri, Nərimanov rayonu..."/></label>
      </div>
      <div className="actions"><button type="button" onClick={onClose}>Bağla</button><button className="primary" type="submit">Bina əlavə et</button></div>
    </form>
  </div>
}
