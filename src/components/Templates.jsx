import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const DEFAULT_TEMPLATES = {
  'marcelorarmentano@gmail.com': `Buenas tardes firstname! Cómo estás? Te habla Marcelo Armentano de Armentano & Asoc. Fui CFO de Bodegas Bianchi y de varias empresas grandes del país, y hoy estamos trabajando con PyMEs ayudándolas a encontrar dónde están perdiendo plata: costos, impuestos, capital de trabajo. Siempre hay ahorro escondido. Nos encantaría charlar 15 min con vos para ver si hay oportunidad!`,
  'matias@wearlyapp.com': `Buenos días firstname! Cómo estás? Te escribo de parte de Armentano & Asoc. Trabajo con Marcelo Armentano, ex CFO de Bodegas Bianchi y de varias empresas grandes del país. Hoy estamos ayudando a PyMEs a encontrar dónde están perdiendo plata: costos, impuestos, capital de trabajo. Siempre hay ahorro escondido y más en este momento. Nos encantaria conversar con vos!`,
};

const FALLBACK = `Buenas firstname! Cómo estás? Te habla de parte de Armentano & Asoc. Nos encantaría charlar unos minutos con vos!`;

export function getDefaultTemplate(email) {
  return DEFAULT_TEMPLATES[email] || FALLBACK;
}

export default function Templates({ user }) {
  const [template, setTemplate]   = useState('');
  const [saved, setSaved]         = useState(false);
  const [loading, setLoading]     = useState(true);

  const isSimulation = db.app.options.apiKey === 'YOUR_API_KEY';
  const docId = user.email;

  useEffect(() => {
    const load = async () => {
      if (isSimulation) {
        setTemplate(getDefaultTemplate(user.email));
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'templates', docId));
        setTemplate(snap.exists() ? snap.data().text : getDefaultTemplate(user.email));
      } catch {
        setTemplate(getDefaultTemplate(user.email));
      }
      setLoading(false);
    };
    load();
  }, [docId]);

  const handleSave = async () => {
    if (!isSimulation) await setDoc(doc(db, 'templates', docId), { text: template, updatedAt: new Date() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const preview = template.replace(/firstname/gi, 'Juan');

  if (loading) return <div style={{ padding: '2rem', color: '#94a3b8' }}>Cargando...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '720px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Template de Mensaje</h2>
        <p style={{ color: '#94a3b8', marginTop: '0.3rem', fontSize: '0.85rem' }}>
          Mensaje que se envía por WhatsApp al hacer click en "Enviar". Usá <code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', color: '#2563eb', fontSize: '0.82rem' }}>firstname</code> para el nombre del contacto.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
        {/* User tag */}
        <div style={{ padding: '0.875rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{user.email}</p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Tu template activo</p>
          </div>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <textarea
            value={template}
            onChange={e => setTemplate(e.target.value)}
            rows={6}
            style={{
              width: '100%', padding: '0.875rem', borderRadius: '8px',
              border: '1px solid #e2e8f0', background: '#f8fafc',
              color: '#0f172a', fontSize: '0.9rem', lineHeight: 1.6,
              resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button onClick={handleSave} style={{
              padding: '0.6rem 1.5rem', borderRadius: '8px', background: '#0f172a',
              color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              {saved ? '✓ Guardado' : 'Guardar template'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '0.875rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview — como lo recibe el contacto</p>
        </div>
        <div style={{ padding: '1.25rem' }}>
          {/* WhatsApp bubble */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              maxWidth: '80%', background: '#dcf8c6', borderRadius: '12px 12px 2px 12px',
              padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#111', lineHeight: 1.55,
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}>
              {preview}
              <div style={{ fontSize: '0.65rem', color: '#667', textAlign: 'right', marginTop: '0.3rem' }}>
                {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reference: other templates */}
      <div style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Templates del equipo</p>
        {Object.entries(DEFAULT_TEMPLATES).map(([email, text]) => (
          <div key={email} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1rem 1.25rem', marginBottom: '0.75rem', opacity: email === user.email ? 1 : 0.6 }}>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>{email}</p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
