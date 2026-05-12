import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { store, useStore } from '../store/appStore';
import type { DocumentItem } from '../types';

const statuses = [
  'Hamısı',
  'Yeni',
  'Yoxlanılacaq',
  'Təsdiq gözləyir',
  'İcrada',
  'Tamamlandı',
  'İmtina',
];

export default function Documents() {
  const s = useStore();
  const [params] = useSearchParams();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Hamısı');
  const [selected, setSelected] = useState(params.get('id') || s.documents[0]?.id);
  const [modal, setModal] = useState(false);
  const [note, setNote] = useState('');

  const docs = useMemo(
    () =>
      s.documents.filter((d) => {
        const okStatus = status === 'Hamısı' || d.status === status;

        const haystack = [d.id, d.applicant, d.topic, d.objectId]
          .join(' ')
          .toLowerCase();

        const okSearch = haystack.includes(search.toLowerCase());

        return okStatus && okSearch;
      }),
    [s.documents, status, search]
  );

  const doc = s.documents.find((d) => d.id === selected) || docs[0];

  const count = (st: string) => {
    if (st === 'Hamısı') {
      return s.documents.length;
    }

    return s.documents.filter((d) => d.status === st).length;
  };

  return (
    <>
      <div className="page-title row-between">
        <div>
          <h2>Sənədlərin elektron dövriyyəsi</h2>
        </div>

        <button className="primary" onClick={() => setModal(true)}>
          + Yeni müraciət
        </button>
      </div>

      <div className="tabs">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setStatus(st)}
            className={status === st ? 'active' : ''}
          >
            {st} <b>{count(st)}</b>
          </button>
        ))}
      </div>

      <div className="documents-layout">
        <Card className="table-card">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>№</th>
                <th>Müraciət nömrəsi</th>
                <th>Müraciətçi</th>
                <th>Mövzu</th>
                <th>Status</th>
                <th>Tarix</th>
              </tr>
            </thead>

            <tbody>
              {docs.map((d, i) => (
                <tr
                  key={d.id}
                  className={doc?.id === d.id ? 'selected' : ''}
                  onClick={() => setSelected(d.id)}
                >
                  <td>
                    <input type="checkbox" checked={doc?.id === d.id} readOnly />
                  </td>

                  <td>{i + 1}</td>

                  <td>
                    <b>{d.id}</b>
                  </td>

                  <td>{d.applicant}</td>
                  <td>{d.topic}</td>

                  <td>
                    <Badge status={d.status} />
                  </td>

                  <td>{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {doc && (
          <div className="detail-col">
            <Card
              title={'Müraciət № ' + doc.id}
              action={
                <button className="link-btn" onClick={() => setSelected('')}>
                  ×
                </button>
              }
            >
              <div className="info-grid">
                <span>Mövzu</span>
                <b>{doc.topic}</b>

                <span>Prioritet</span>
                <Badge status={doc.priority} />

                <span>Status</span>
                <Badge status={doc.status} />

                <span>Hazırki mərhələ</span>
                <b>{doc.currentStep}</b>

                <span>Növbəti addım</span>
                <b>{doc.nextStep}</b>

                <span>Məsul şəxs</span>
                <b>{doc.responsible}</b>

                <span>Qovluq nömrəsi</span>
                <b>{doc.folderNo}</b>
              </div>

              <div className="actions">
                <button onClick={() => store.updateDocStatus(doc.id, 'Yoxlanılacaq')}>
                  ⌕ Yoxla
                </button>

                <button onClick={() => store.updateDocStatus(doc.id, 'İcrada')}>
                  ✍ İmzala
                </button>

                <button
                  className="primary"
                  onClick={() => store.updateDocStatus(doc.id, 'Tamamlandı')}
                >
                  ✓ Təsdiq et
                </button>

                <button
                  className="danger"
                  onClick={() => store.updateDocStatus(doc.id, 'İmtina')}
                >
                  İmtina
                </button>
              </div>
            </Card>
          </div>
        )}

        <div className="right-col">
          {doc && (
            <>
              <Card title="Müraciətçi məlumatları">
                <div className="info-grid mini">
                  <span>Ad, soyad</span>
                  <b>{doc.applicant}</b>

                  <span>VÖEN / FİN</span>
                  <b>{doc.fin}</b>

                  <span>Əlaqə</span>
                  <b>{doc.phone}</b>

                  <span>E-poçt</span>
                  <b>{doc.email}</b>

                  <span>Ünvan</span>
                  <b>{doc.address}</b>
                </div>
              </Card>

              <Card title="Müddətlər">
                <p>
                  Qanuni icra müddəti: <b>5 iş günü</b>
                </p>

                <p>
                  Son tarix: <b className="red">29.05.2024</b>
                </p>

                <p>
                  Qalan müddət: <b className="green">5 gün</b>
                </p>
              </Card>
            </>
          )}
        </div>
      </div>

      {modal && <CreateDocModal onClose={() => setModal(false)} />}
    </>
  );
}

function CreateDocModal({ onClose }: { onClose: () => void }) {
  const [applicant, setApplicant] = useState('');
  const [topic, setTopic] = useState('Mülkiyyət hüququnun dövlət qeydiyyatı');

  function submit(e: FormEvent) {
    e.preventDefault();

    const id = 'M-2024-' + String(Date.now()).slice(-7);

    const doc: DocumentItem = {
      id,
      applicant: applicant || 'Yeni müraciətçi',
      fin: 'AZE000000',
      phone: '+994',
      email: '',
      address: '',
      topic,
      status: 'Yeni',
      date: new Date().toLocaleString('az-AZ'),
      priority: 'Orta',
      currentStep: 'Qəbul edilib',
      nextStep: 'İlkin yoxlama aparın',
      responsible: 'Əliyev Rəşad',
      folderNo: 'Q-' + Date.now(),
      objectId: '29:012:1234:5678',
      files: [],
      notes: [],
    };

    store.addDocument(doc);
    onClose();
  }

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submit}>
        <h3>Yeni müraciət</h3>

        <input
          placeholder="Müraciətçi"
          value={applicant}
          onChange={(e) => setApplicant(e.target.value)}
        />

        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option>Mülkiyyət hüququnun dövlət qeydiyyatı</option>
          <option>İpoteka hüququnun qeydiyyatı</option>
          <option>Daşınmaz əmlakın kadastr uçotu</option>
          <option>Çıxarışın verilməsi</option>
        </select>

        <div className="actions">
          <button type="button" onClick={onClose}>
            Bağla
          </button>

          <button className="primary">Yarat</button>
        </div>
      </form>
    </div>
  );
}