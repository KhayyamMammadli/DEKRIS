import { useNavigate } from 'react-router-dom';
import { store, useStore } from '../../store/appStore';

export function Header() {
  const s = useStore();
  const nav = useNavigate();

  const unread = s.notifications.filter((n) => !n.read).length;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = e.currentTarget.value.trim();

      if (value) {
        nav(`/query?term=${encodeURIComponent(value)}`);
      }
    }
  };

  const handleHelpClick = () => {
    alert(
      'DEKRIS yardım: sol menyudan modulu seçin, axtarış, filtr və əməliyyat düymələrindən istifadə edin.'
    );
  };

  const handleLogout = () => {
    store.logout();
    nav('/login');
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="hamb"
        onClick={() => store.toggleSidebar()}
      >
        ☰
      </button>

      <div className="global-search">
        <input
          placeholder="Axtar"
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      <div className="user">
        <div className="avatar">ƏR</div>

        <div>
          <strong>{s.user?.name || 'Əliyev Rəşad'}</strong>
          <span>{s.user?.role || 'Baş mütəxəssis'}</span>
        </div>
      </div>

      <button
        type="button"
        className="link-btn"
        onClick={handleLogout}
      >
        Çıxış
      </button>
    </header>
  );
}