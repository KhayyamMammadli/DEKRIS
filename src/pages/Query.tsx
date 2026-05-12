import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStore } from '../store/appStore';

export default function Query() {
  const s = useStore();
  const [params] = useSearchParams();

  const [q, setQ] = useState(params.get('term') || '');
  const [missing, setMissing] = useState('');

  const docs = useMemo(
    () =>
      s.documents.filter((d) =>
        [d.id, d.applicant, d.topic, d.objectId]
          .join(' ')
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [q, s.documents]
  );

  const props = useMemo(
    () =>
      s.properties.filter((p) =>
        [p.cadastralNo, p.address, p.owner, p.fin]
          .join(' ')
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [q, s.properties]
  );

  return (
    <>
      <div className="page-title">
        <h2>Sorğu</h2>

        <p>
          Reyestr, kadastr, müraciət və hüquq subyektləri üzrə vahid axtarış;
          çatışmayan sənədlər üçün tələb göndərilməsi
        </p>
      </div>

      <div className="search-panel">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Obyekt, ünvan, kadastr nömrəsi, müraciət nömrəsi və ya şəxs adı daxil edin..."
        />

        <button className="primary">Axtar</button>
      </div>

      <div className="grid-3">
        <Card title={`Müraciətlər (${docs.length})`}>
          <table>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id}>
                  <td>
                    <b>{d.id}</b>
                    <br />
                    <small>{d.applicant}</small>
                  </td>

                  <td>{d.topic}</td>

                  <td>
                    <Badge status={d.status} />
                  </td>

                  <td>
                    <button onClick={() => alert(d.id + ' üzrə tələb göndərildi')}>
                      Tələb göndər
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card title="Qeydiyyat üçün çatışmayan sənəd tələbi">
        <div className="inline-form">
          <input placeholder="Müraciət nömrəsi" />

          <input
            placeholder="Tələb olunan sənəd"
            value={missing}
            onChange={(e) => setMissing(e.target.value)}
          />

          <button
            onClick={() =>
              alert('DEKRIS iştirakçısına tələb göndərildi: ' + missing)
            }
          >
            Göndər
          </button>
        </div>
      </Card>
    </>
  );
}