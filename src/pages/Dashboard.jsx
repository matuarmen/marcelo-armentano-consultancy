import { useState } from 'react';
import L10Meeting from '../components/L10Meeting';
import CRM from '../components/CRM';
import Templates from '../components/Templates';

const TITLES = {
  l10: 'Seguimiento Semanal',
  leads: 'Gestión de Contactos',
  templates: 'Templates de Mensajes',
};

const NAV_ITEMS = [
  { key: 'leads',     icon: '👥', label: 'CRM Leads' },
  { key: 'l10',       icon: '⏱️', label: 'L10 Meeting' },
  { key: 'templates', icon: '💬', label: 'Templates' },
];

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab]       = useState('leads');
  const [expanded, setExpanded]         = useState(true);

  return (
    <div style={{ height: '100vh', display: 'flex', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: expanded ? '220px' : '60px',
        minWidth: expanded ? '220px' : '60px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: expanded ? '1.25rem 0.75rem' : '1rem 0',
        alignItems: expanded ? 'stretch' : 'center',
        zIndex: 10,
        transition: 'width 0.2s ease, min-width 0.2s ease, padding 0.2s ease',
        overflow: 'hidden',
      }}>

        {/* Logo row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          marginBottom: '1.75rem',
          padding: expanded ? '0 0.25rem' : '0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
            <div style={{ width: '32px', height: '32px', minWidth: '32px', background: 'linear-gradient(to bottom right, #c0a062, #eab308)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff' }}>MA</span>
            </div>
            {expanded && (
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                MA OS
              </span>
            )}
          </div>
          {expanded && (
            <button onClick={() => setExpanded(false)} title="Colapsar" style={toggleBtnStyle}>
              ‹
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', flex: 1, alignItems: expanded ? 'stretch' : 'center' }}>
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.key}
              active={activeTab === item.key}
              expanded={expanded}
              icon={item.icon}
              label={item.label}
              onClick={() => setActiveTab(item.key)}
            />
          ))}
        </nav>

        {/* Footer */}
        {expanded ? (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.5rem', marginBottom: '0.25rem' }}>
              <div style={{ width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                {user.email?.[0]?.toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email?.split('@')[0]}
                </p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </p>
              </div>
            </div>
            <button onClick={onLogout} style={logoutBtnExpanded}
              onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
            >
              <span style={{ fontSize: '0.9rem' }}>↪</span> Cerrar Sesión
            </button>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            {/* Expand button */}
            <Tooltip label="Expandir">
              <button onClick={() => setExpanded(true)} style={{ ...iconBtnStyle, color: '#94a3b8' }}>›</button>
            </Tooltip>
            <Tooltip label="Cerrar Sesión">
              <button onClick={onLogout} style={iconBtnStyle}
                onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
              >↪</button>
            </Tooltip>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{
          height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', flexShrink: 0,
        }}>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            {TITLES[activeTab]}
          </h1>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>SISTEMA ACTIVO</span>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'l10'       && <div style={{ flex: 1, overflowY: 'auto' }}><L10Meeting /></div>}
          {activeTab === 'leads'     && <CRM user={user} />}
          {activeTab === 'templates' && <div style={{ flex: 1, overflowY: 'auto' }}><Templates user={user} /></div>}
        </div>
      </main>
    </div>
  );
}

/* ── Nav Item ── */
function NavItem({ active, expanded, icon, label, onClick }) {
  if (expanded) {
    return (
      <button onClick={onClick} style={{
        textAlign: 'left', padding: '0.6rem 0.75rem',
        backgroundColor: active ? '#f1f5f9' : 'transparent',
        color: active ? '#0f172a' : '#64748b',
        border: 'none', borderRadius: '8px',
        fontWeight: active ? 600 : 400, fontSize: '0.875rem',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem',
        transition: 'all 0.1s ease', width: '100%',
      }}
        onMouseOver={e => !active && (e.currentTarget.style.backgroundColor = '#f8fafc')}
        onMouseOut={e => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <span style={{ fontSize: '1rem', opacity: active ? 1 : 0.7 }}>{icon}</span>
        {label}
      </button>
    );
  }
  return (
    <Tooltip label={label}>
      <button onClick={onClick} style={{
        ...iconBtnStyle,
        backgroundColor: active ? '#f1f5f9' : 'transparent',
        color: active ? '#0f172a' : '#94a3b8',
      }}
        onMouseOver={e => !active && (e.currentTarget.style.backgroundColor = '#f8fafc')}
        onMouseOut={e => !active && (e.currentTarget.style.backgroundColor = active ? '#f1f5f9' : 'transparent')}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

/* ── Tooltip wrapper ── */
function Tooltip({ label, children }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute', left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)',
          background: '#0f172a', color: '#fff', fontSize: '0.72rem', fontWeight: 500,
          padding: '0.25rem 0.6rem', borderRadius: '6px', whiteSpace: 'nowrap', zIndex: 50,
          pointerEvents: 'none',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

const iconBtnStyle = {
  width: '36px', height: '36px', borderRadius: '8px',
  border: 'none', background: 'transparent',
  color: '#94a3b8', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '1.05rem', transition: 'all 0.15s ease',
};

const toggleBtnStyle = {
  width: '24px', height: '24px', borderRadius: '6px',
  border: '1px solid #e2e8f0', background: 'transparent',
  color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.15s', flexShrink: 0,
};

const logoutBtnExpanded = {
  width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
  border: 'none', background: 'transparent',
  color: '#64748b', cursor: 'pointer', fontSize: '0.82rem',
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  transition: 'all 0.15s', textAlign: 'left',
};
