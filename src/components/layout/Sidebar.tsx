import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineClose,
  AiOutlineAppstore,
  AiOutlineFileText,
  AiOutlineSearch,
  AiOutlineBank,
  AiOutlineTeam,
  AiOutlineEnvironment,
  AiOutlineSafetyCertificate,
  AiOutlineAudit,
  AiOutlineFolderOpen,
} from 'react-icons/ai';

import { modules } from '../../data/mock';
import { store, useStore } from '../../store/appStore';

const getModuleIcon = (key: string): ReactNode => {
  const icons: Record<string, ReactNode> = {
    documents: <AiOutlineFileText />,
    query: <AiOutlineSearch />,
    properties: <AiOutlineBank />,
    rights: <AiOutlineSafetyCertificate />,
    citizens: <AiOutlineTeam />,
    map: <AiOutlineEnvironment />,
    audit: <AiOutlineAudit />,
    folders: <AiOutlineFolderOpen />,
  };

  return icons[key] || <AiOutlineAppstore />;
};

export function Sidebar() {
  const { sidebarCollapsed } = useStore();

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <div className="logo">
          <AiOutlineAppstore />
        </div>

        <div>
          <h1>DEKRIS</h1>
        </div>
      </div>

      <button className="mobile-close" onClick={() => store.toggleSidebar()}>
        <AiOutlineClose />
      </button>

      <nav>
        <NavLink to="/dashboard">
          <AiOutlineHome />
          <span>Ana səhifə</span>
        </NavLink>

        {modules.map((m) => (
          <NavLink key={m.key} to={m.path}>
            {getModuleIcon(m.key)}
            <span>{m.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}