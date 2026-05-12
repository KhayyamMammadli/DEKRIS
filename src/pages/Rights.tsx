import { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStore } from '../store/appStore';

type RightRow = {
  id: string;
  cadastralNo: string;
  address: string;
  propertyOwner: string;
  kind: string;
  holder: string;
  share: string;
  date: string;
  status: string;
};

export default function Rights() {
  const s = useStore();

  const rows = useMemo<RightRow[]>(
    () =>
      s.properties.flatMap((p) =>
        p.rights.map((r, idx) => ({
          id: `${p.id}-${idx}`,
          cadastralNo: p.cadastralNo,
          address: p.address,
          propertyOwner: p.owner,
          kind: r.kind,
          holder: r.holder,
          share: r.share,
          date: r.date,
          status: r.status,
        }))
      ),
    [s.properties]
  );

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<RightRow | null>(null);
  const [status, setStatus] = useState('Hamısı');

  const filtered = rows.filter((r) => {
    const haystack = Object.values(r).join(' ').toLowerCase();
    const okSearch = haystack.includes(query.toLowerCase());
    const okStatus = status === 'Hamısı' || r.status === status;

    return okSearch && okStatus;
  });

  return (
    <>
      <div className="page-title row-between">
        <div>
          <h2>Hüquqların qeydiyyatı</h2>
        </div>

        <button
          className="primary"
          onClick={() =>
            alert('Yeni hüquq qeydiyyatı üçün elektron ərizə forması açıldı')
          }
        >
          + Yeni hüquq qeydiyyatı
        </button>
      </div>

      <Card
        title={`Qeydiyyat işləri (${filtered.length})`}
        className="table-card rights-card"
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Əmlak</th>
                <th>Ünvan</th>
                <th>Tarix</th>
                <th>Status</th>
                <th>Əməliyyat</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <b>{r.cadastralNo}</b>
                    <small>{r.propertyOwner}</small>
                  </td>

                  <td className="wide-cell">{r.address}</td>

                  <td>{r.date}</td>

                  <td>
                    <Badge status={r.status} />
                  </td>

                  <td>
                    <button onClick={() => setSelected(r)}>Aç</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="modal" onMouseDown={() => setSelected(null)}>
          <div
            className="modal-card wide-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="row-between">
              <div>
                <h2>Hüquq kartı</h2>
                <p>{selected.cadastralNo}</p>
              </div>

              <button onClick={() => setSelected(null)}>×</button>
            </div>

            <div className="grid-2 modal-grid">
              <Card title="Hüquq məlumatları">
                <div className="info-grid">
                  <span>Hüquq növü</span>
                  <b>{selected.kind}</b>

                  <span>Hüquq sahibi</span>
                  <b>{selected.holder}</b>

                  <span>Pay</span>
                  <b>{selected.share}</b>

                  <span>Status</span>
                  <b>
                    <Badge status={selected.status} />
                  </b>

                  <span>Qeydiyyat tarixi</span>
                  <b>{selected.date}</b>
                </div>
              </Card>

              <Card title="Əmlak məlumatları">
                <div className="info-grid">
                  <span>Kadastr nömrəsi</span>
                  <b>{selected.cadastralNo}</b>

                  <span>Ünvan</span>
                  <b>{selected.address}</b>

                  <span>Mülkiyyətçi</span>
                  <b>{selected.propertyOwner}</b>
                </div>
              </Card>
            </div>

            <div className="actions">
              <button onClick={() => alert('Hüquq üzrə sənədlər yoxlanıldı')}>
                Yoxla
              </button>

              <button onClick={() => alert('Hüquq qeydiyyatı imzalandı')}>
                İmzala
              </button>

              <button
                className="primary"
                onClick={() => alert('Qeydiyyat təsdiq edildi')}
              >
                Təsdiq et
              </button>

              <button
                className="danger"
                onClick={() => alert('Hüquqa xitam əməliyyatı başladıldı')}
              >
                Xitam ver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}