import { useNavigate } from 'react-router-dom';
import { modules } from '../data/mock';
import { useStore } from '../store/appStore';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { fmt } from '../utils/helpers';

export default function Dashboard() {
  const s = useStore();
  const nav = useNavigate();

  const completed = s.documents.filter((d) => d.status === 'Tamamlandı').length;

  return (
    <>
      <div className="page-title">
        <h2>Xoş gəlmisiniz, {s.user?.name}!</h2>
      </div>

      <div className="module-grid">
        {modules.map((m) => (
          <button
            className="module-card"
            key={m.key}
            onClick={() => nav(m.path)}
          >
            <i>{m.icon}</i>

            <div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>

            <b>→</b>
          </button>
        ))}
      </div>

      <div className="stats-row">
        <Card>
          <small>Yeni müraciətlər</small>
          <strong>{s.documents.length}</strong>
          <span className="up">↑ 8.7%</span>
        </Card>

        <Card>
          <small>Reyestr obyektləri</small>
          <strong>{fmt(s.properties.length * 78391)}</strong>
          <span className="up">↑ 4.2%</span>
        </Card>

        <Card>
          <small>Tamamlanan</small>
          <strong>{completed}</strong>
          <span className="up">↑ 6.1%</span>
        </Card>

        <Card>
          <small>Aktiv istifadəçi</small>
          <strong>532</strong>
          <span className="up">onlayn</span>
        </Card>
      </div>

      <div className="grid-2">
        <Card
          title="Son müraciətlər / sənədlər"
          action={
            <button
              onClick={() => nav('/documents')}
              className="link-btn"
            >
              Hamısına bax →
            </button>
          }
        >
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Müraciət</th>
                <th>Xidmət</th>
                <th>Status</th>
                <th>Tarix</th>
              </tr>
            </thead>

            <tbody>
              {s.documents.slice(0, 5).map((d, i) => (
                <tr
                  key={d.id}
                  onClick={() => nav('/documents?id=' + d.id)}
                >
                  <td>{i + 1}</td>
                  <td>{d.id}</td>
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

        <div className="stack">
          <Card title="Sistem statusu">
            <div className="status-ok">✓ Sistem normal işləyir</div>

            <div className="chips">
              <span>Elektron imza aktiv</span>
              <span>Reyestr aktiv</span>
              <span>Kadastr aktiv</span>
              <span>Məlumat mübadiləsi aktiv</span>
            </div>
          </Card>

          <Card title="Xəbər və yeniliklər">
            <p>
              <b>22.05.2024</b> — Reyestr və kadastr məlumatlarının inteqrasiyası
              üçün yeni funksionallıq istifadəyə verildi.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}