import { useState } from 'react';
import L10Meeting from '../components/L10Meeting';
import CRM from '../components/CRM';
import { db } from '../lib/firebase';

export default function Dashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('l10'); // 'leads', 'l10', 'settings'

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            backgroundColor: '#0f172a', // Dark slate background base
            color: '#f8fafc',
            overflow: 'hidden' // PREVENT GLOBAL SCROLL
        }}>

            {/* Sidebar Navigation */}
            <aside style={{
                width: '260px',
                backgroundColor: '#020617', // Darker sidebar
                borderRight: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                zIndex: 10
            }}>
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(to bottom right, #c0a062, #eab308)', borderRadius: '8px' }}></div>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>MA OS</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <NavButton
                        active={activeTab === 'l10'}
                        onClick={() => setActiveTab('l10')}
                        icon="⏱️"
                        label="L10 Meeting"
                    />
                    <NavButton
                        active={activeTab === 'leads'}
                        onClick={() => setActiveTab('leads')}
                        icon="📫"
                        label="CRM Leads"
                    />
                </nav>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                        {user.email}
                    </div>
                    <button
                        onClick={onLogout}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#c0a062'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >
                        <span>⏻</span> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Immersion Zone */}
            <main style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden', // Each view handles its own scroll
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* Topbar (if needed) or just integrated header. For immersion, minimal topbar is better */}
                <header style={{
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.03)'
                }}>
                    <h1 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                        {activeTab === 'l10' ? 'Seguimiento Semanal' : 'Gestión de Contactos'}
                    </h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>SISTEMA ACTIVO</span>
                    </div>
                </header>

                {/* Content Viewport */}
                <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                    {activeTab === 'l10' && <L10Meeting />}

                    {activeTab === 'leads' && <CRM />}
                </div>
            </main>
        </div>
    );
}

// Sub-components
function NavButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            style={{
                textAlign: 'left',
                padding: '0.875rem 1rem',
                backgroundColor: active ? 'rgba(192, 160, 98, 0.1)' : 'transparent',
                color: active ? '#c0a062' : '#94a3b8',
                border: active ? '1px solid rgba(192, 160, 98, 0.2)' : '1px solid transparent',
                borderRadius: '8px',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => !active && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
            onMouseOut={(e) => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            {label}
        </button>
    )
}


