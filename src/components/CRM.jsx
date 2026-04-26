import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp, writeBatch, getDoc,
} from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { getDefaultTemplate } from './Templates';

const STATUSES = [
  { value: 'No contactado',       bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  { value: 'Contactado',          bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  { value: 'Conversation started',bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  { value: 'Meeting Set',         bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
  { value: 'Proposal',            bg: '#faf5ff', color: '#7c3aed', border: '#e9d5ff' },
  { value: 'Won',                 bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  { value: 'Lost',                bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
];

const STAGE_ORDER = ['No contactado','Contactado','Conversation started','Meeting Set','Proposal','Won'];

const IMPORT_FIELDS = [
  { key: '',            label: '— Ignorar —' },
  { key: 'company',     label: 'Empresa' },
  { key: 'whatsapp',   label: 'WhatsApp' },
  { key: 'contactName',label: 'Contacto' },
  { key: 'role',        label: 'Cargo / Título' },
  { key: 'lugar',       label: 'Lugar' },
  { key: 'product',     label: 'Producto / Descripción' },
  { key: 'email',       label: 'Email' },
  { key: 'status',      label: 'Estado' },
  { key: 'notes',       label: 'Notas' },
  { key: 'value',       label: 'Valor ($)' },
  { key: 'owner',       label: 'Propietario' },
];

const EMPTY_FORM = {
  company: '', contactName: '', role: '', lugar: '', whatsapp: '',
  email: '', status: 'No contactado', notes: '', value: '', owner: '',
};

function StatusBadge({ status, small }) {
  const s = STATUSES.find(x => x.value === status) || STATUSES[0];
  return (
    <span style={{
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius: '99px',
      fontSize: small ? '0.68rem' : '0.72rem',
      fontWeight: 600,
      backgroundColor: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {status || '—'}
    </span>
  );
}

function Field({ label, value, onChange, type = 'text', required = false, placeholder = '' }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input required={required} type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

function buildWaUrl(whatsapp, contactName, template) {
  const number = whatsapp.replace(/https?:\/\//i, '').replace(/wa\.me\//i, '').replace('+', '');
  const firstname = (contactName || '').trim().split(/\s+/)[0] || 'amigo';
  const message = (template || '').replace(/firstname/gi, firstname);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export default function CRM({ user }) {
  const [leads, setLeads]               = useState([]);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected]         = useState(new Set());
  const [detailLead, setDetailLead]     = useState(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingLead, setEditingLead]   = useState(null);
  const [formData, setFormData]         = useState(EMPTY_FORM);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importRows, setImportRows]     = useState([]);
  const [columnMapping, setColumnMapping] = useState([]);
  const [hasHeader, setHasHeader]       = useState(false);
  const [importing, setImporting]       = useState(false);
  const [importError, setImportError]   = useState('');
  const [waTemplate, setWaTemplate]     = useState('');
  const [leadNotes, setLeadNotes]       = useState([]);
  const [newNote, setNewNote]           = useState('');
  const [addingNote, setAddingNote]     = useState(false);
  const notesUnsubRef                   = useRef(null);
  const fileInputRef                    = useRef(null);
  const notesEndRef                     = useRef(null);

  const isSimulation = db.app.options.apiKey === 'YOUR_API_KEY';

  useEffect(() => {
    if (isSimulation) {
      setLeads([
        { id:'1', company:'LA MADRID ESTATE', contactName:'Eduardo Ríos', role:'General Manager', whatsapp:'wa.me/+5492616701010', email:'', status:'Contactado', notes:'', lugar:'Mendoza' },
        { id:'2', company:'ANTIGAL WINERY', contactName:'VALENTIN Kuschnaroff', role:'', whatsapp:'wa.me/+5492615524999', email:'', status:'Conversation started', notes:'Pidio reunion.', lugar:'Mendoza' },
        { id:'3', company:'bodega rubino', contactName:'agustin rubino', role:'manager', whatsapp:'wa.me/+5493816410697', email:'', status:'Contactado', notes:'', lugar:'' },
        { id:'4', company:'SILOS ARENEROS', contactName:'jorge arosa', role:'executive', whatsapp:'wa.me/+5511970745812', email:'', status:'No contactado', notes:'no esta en wapp', lugar:'' },
        { id:'5', company:'Bodega Malma', contactName:'Pedro', role:'', whatsapp:'wa.me/+5491150027968', email:'', status:'Meeting Set', notes:'Dijo de hacer reunion.', lugar:'Mendoza' },
      ]);
      return;
    }
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [isSimulation]);

  useEffect(() => {
    const load = async () => {
      const fallback = getDefaultTemplate(user?.email || '');
      if (isSimulation || !user?.email) { setWaTemplate(fallback); return; }
      try {
        const snap = await getDoc(doc(db, 'templates', user.email));
        setWaTemplate(snap.exists() ? snap.data().text : fallback);
      } catch { setWaTemplate(fallback); }
    };
    load();
  }, [user?.email, isSimulation]);

  const filtered = leads.filter(l => {
    const term = search.toLowerCase();
    const matchSearch = !term ||
      (l.company||'').toLowerCase().includes(term) ||
      (l.contactName||l.name||'').toLowerCase().includes(term) ||
      (l.role||'').toLowerCase().includes(term) ||
      (l.lugar||'').toLowerCase().includes(term) ||
      (l.email||'').toLowerCase().includes(term) ||
      (l.notes||'').toLowerCase().includes(term);
    return matchSearch && (!filterStatus || l.status === filterStatus);
  });

  const openModal = (lead = null) => {
    setEditingLead(lead);
    setFormData(lead ? {
      company: lead.company||'', contactName: lead.contactName||lead.name||'',
      role: lead.role||'', lugar: lead.lugar||'', whatsapp: lead.whatsapp||'',
      email: lead.email||'', status: lead.status||'No contactado',
      notes: lead.notes||'', value: lead.value||'', owner: lead.owner||'',
    } : EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (isSimulation) {
      if (editingLead) setLeads(prev => prev.map(l => l.id === editingLead.id ? { ...l, ...data } : l));
      else setLeads(prev => [{ id: Date.now().toString(), ...data, createdAt: { seconds: Date.now()/1000 } }, ...prev]);
    } else {
      if (editingLead) await updateDoc(doc(db,'leads',editingLead.id), data);
      else await addDoc(collection(db,'leads'), { ...data, createdAt: serverTimestamp() });
    }
    setIsModalOpen(false);
    if (editingLead && detailLead?.id === editingLead.id) setDetailLead(prev => ({ ...prev, ...data }));
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este contacto?')) return;
    if (isSimulation) setLeads(prev => prev.filter(l => l.id !== id));
    else await deleteDoc(doc(db,'leads',id));
    setSelected(prev => { const s = new Set(prev); s.delete(id); return s; });
    if (detailLead?.id === id) setDetailLead(null);
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`¿Eliminar ${selected.size} contacto${selected.size>1?'s':''}?`)) return;
    const ids = [...selected];
    if (isSimulation) setLeads(prev => prev.filter(l => !ids.includes(l.id)));
    else { const b = writeBatch(db); ids.forEach(id => b.delete(doc(db,'leads',id))); await b.commit(); }
    setSelected(new Set());
    if (ids.includes(detailLead?.id)) setDetailLead(null);
  };

  const handleStatusChange = async (lead, newStatus) => {
    if (isSimulation) setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
    else await updateDoc(doc(db,'leads',lead.id), { status: newStatus });
    if (detailLead?.id === lead.id) setDetailLead(prev => ({ ...prev, status: newStatus }));
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const toggleSelectAll = () => {
    setSelected(filtered.length > 0 && selected.size === filtered.length ? new Set() : new Set(filtered.map(l => l.id)));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const wb = XLSX.read(new Uint8Array(event.target.result), { type: 'array' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' });
      const nonEmpty = rows.filter(r => r.some(c => c !== ''));
      setImportRows(nonEmpty);
      setImportError('');
      const defaults = ['company','whatsapp','contactName','role','product','email','status','notes'];
      setColumnMapping((nonEmpty[0]||[]).map((_,i) => defaults[i]||''));
      const first = nonEmpty[0]||[];
      setHasHeader(first.every(c => typeof c==='string' && !String(c).includes('wa.me') && !String(c).match(/^\+?\d{10,}/)));
      setImportModalOpen(true);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleImport = async () => {
    const startRow = hasHeader ? 1 : 0;
    const toImport = importRows.slice(startRow).map(row => {
      const obj = {};
      columnMapping.forEach((field, i) => { if (field && row[i]!==undefined && row[i]!=='') obj[field] = String(row[i]).trim(); });
      return obj;
    }).filter(obj => obj.company || obj.contactName);

    if (!toImport.length) { setImportError('No se encontraron filas válidas. Revisá el mapeo y la opción de encabezado.'); return; }
    setImporting(true); setImportError('');
    try {
      if (isSimulation) {
        setLeads(prev => [...toImport.map((obj,i) => ({ id:(Date.now()+i).toString(), ...obj, createdAt:{seconds:Date.now()/1000} })), ...prev]);
      } else {
        for (let i = 0; i < toImport.length; i += 500) {
          const batch = writeBatch(db);
          toImport.slice(i, i+500).forEach(obj => batch.set(doc(collection(db,'leads')), { ...obj, createdAt: serverTimestamp() }));
          await Promise.race([batch.commit(), new Promise((_,r) => setTimeout(() => r(new Error('Timeout: revisá las reglas de Firestore.')), 15000))]);
        }
      }
      setImportModalOpen(false); setImportRows([]);
    } catch (err) {
      setImportError(err.message || 'Error al importar.');
    } finally {
      setImporting(false);
    }
  };

  const statusCounts = STATUSES.map(s => ({ ...s, count: leads.filter(l => l.status===s.value).length })).filter(s => s.count>0);

  // keep detailLead in sync with leads
  useEffect(() => {
    if (detailLead) {
      const updated = leads.find(l => l.id === detailLead.id);
      if (updated) setDetailLead(updated);
    }
  }, [leads]);

  // subscribe to notes subcollection when panel opens
  useEffect(() => {
    if (notesUnsubRef.current) { notesUnsubRef.current(); notesUnsubRef.current = null; }
    if (!detailLead) { setLeadNotes([]); return; }
    if (isSimulation) return;
    const q = query(collection(db, 'leads', detailLead.id, 'notes'), orderBy('createdAt', 'asc'));
    notesUnsubRef.current = onSnapshot(q, snap => {
      setLeadNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => notesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });
    return () => { if (notesUnsubRef.current) notesUnsubRef.current(); };
  }, [detailLead?.id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    const noteData = { text: newNote.trim(), author: user?.email || 'anon', createdAt: serverTimestamp() };
    if (isSimulation) {
      setLeadNotes(prev => [...prev, { id: Date.now().toString(), ...noteData, createdAt: { seconds: Date.now()/1000 } }]);
    } else {
      await addDoc(collection(db, 'leads', detailLead.id, 'notes'), noteData);
    }
    setNewNote('');
    setAddingNote(false);
    setTimeout(() => notesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  return (
    <div style={{ display:'flex', height:'100%', background:'#f1f5f9', overflow:'hidden' }}>

      {/* ── Main Panel ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', transition:'all 0.2s' }}>

        {/* Header */}
        <div style={{ padding:'1.5rem 2rem 0', background:'#f1f5f9' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <div>
              <h2 style={{ fontSize:'1.5rem', fontWeight:700, margin:0, color:'#0f172a' }}>Contactos</h2>
              <p style={{ color:'#94a3b8', marginTop:'0.2rem', fontSize:'0.82rem' }}>{leads.length} registros</p>
            </div>
            <div style={{ display:'flex', gap:'0.6rem', alignItems:'center' }}>
              {selected.size > 0 && (
                <button onClick={handleDeleteSelected} style={dangerBtn}>
                  🗑 Eliminar {selected.size}
                </button>
              )}
              <button onClick={() => fileInputRef.current?.click()} style={outlineBtn}>↑ Importar</button>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} style={{ display:'none' }} />
              <button onClick={() => openModal()} style={primaryBtn}>+ Nuevo</button>
            </div>
          </div>

          {/* Filter pills */}
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1rem' }}>
            <PillBtn active={!filterStatus} onClick={() => setFilterStatus('')} color="#475569">
              Todos ({leads.length})
            </PillBtn>
            {statusCounts.map(s => (
              <PillBtn key={s.value} active={filterStatus===s.value} color={s.color} bg={s.bg} border={s.border}
                onClick={() => setFilterStatus(prev => prev===s.value ? '' : s.value)}>
                {s.value} ({s.count})
              </PillBtn>
            ))}
          </div>

          {/* Search */}
          <div style={{ position:'relative', maxWidth:'340px', marginBottom:'1rem' }}>
            <span style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', fontSize:'0.9rem' }}>🔍</span>
            <input placeholder="Buscar empresa, contacto, lugar..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft:'2.25rem', background:'#fff', border:'1px solid #e2e8f0', color:'#0f172a' }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ flex:1, overflow:'auto', margin:'0 2rem 1.5rem', borderRadius:'12px', boxShadow:'0 1px 3px rgba(0,0,0,0.08)', border:'1px solid #e2e8f0', background:'#fff' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.855rem' }}>
            <thead>
              <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                <th style={th}>
                  <input type="checkbox"
                    checked={filtered.length>0 && selected.size===filtered.length}
                    ref={el => { if(el) el.indeterminate = selected.size>0 && selected.size<filtered.length; }}
                    onChange={toggleSelectAll}
                    style={{ cursor:'pointer', accentColor:'#2563eb' }} />
                </th>
                {['EMPRESA','CONTACTO','CARGO','LUGAR','WHATSAPP','ESTADO','NOTAS',''].map((h,i) => (
                  <th key={i} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id}
                  onClick={() => setDetailLead(detailLead?.id===lead.id ? null : lead)}
                  style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', background: selected.has(lead.id) ? '#eff6ff' : detailLead?.id===lead.id ? '#f8fafc' : '#fff', transition:'background 0.1s' }}
                  onMouseEnter={e => { if(!selected.has(lead.id) && detailLead?.id!==lead.id) e.currentTarget.style.background='#f8fafc'; }}
                  onMouseLeave={e => { if(!selected.has(lead.id) && detailLead?.id!==lead.id) e.currentTarget.style.background='#fff'; }}
                >
                  <td style={td} onClick={e => toggleSelect(lead.id, e)}>
                    <input type="checkbox" checked={selected.has(lead.id)} onChange={() => {}}
                      style={{ cursor:'pointer', accentColor:'#2563eb' }} />
                  </td>
                  <td style={{ ...td, fontWeight:600, color:'#0f172a', maxWidth:'180px' }}>
                    <span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.company||'—'}</span>
                  </td>
                  <td style={{ ...td, color:'#475569' }}>{lead.contactName||lead.name||'—'}</td>
                  <td style={{ ...td, color:'#94a3b8', fontSize:'0.8rem' }}>{lead.role||'—'}</td>
                  <td style={{ ...td, color:'#94a3b8', fontSize:'0.8rem' }}>{lead.lugar||'—'}</td>
                  <td style={td} onClick={e => e.stopPropagation()}>
                    {lead.whatsapp ? (
                      <a href={buildWaUrl(lead.whatsapp, lead.contactName||lead.name, waTemplate)}
                        target="_blank" rel="noopener noreferrer"
                        style={{ color:'#16a34a', textDecoration:'none', fontSize:'0.8rem', fontWeight:500 }}>
                        💬 Enviar
                      </a>
                    ) : <span style={{ color:'#cbd5e1' }}>—</span>}
                  </td>
                  <td style={td} onClick={e => e.stopPropagation()}>
                    <StatusSelect lead={lead} onChange={handleStatusChange} />
                  </td>
                  <td style={{ ...td, color:'#94a3b8', fontSize:'0.8rem', maxWidth:'180px' }}>
                    <span title={lead.notes} style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {lead.notes||'—'}
                    </span>
                  </td>
                  <td style={{ ...td, whiteSpace:'nowrap' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => openModal(lead)} style={iconBtn} title="Editar">✏️</button>
                    <button onClick={() => handleDelete(lead.id)} style={iconBtn} title="Eliminar">🗑️</button>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan="9" style={{ padding:'4rem', textAlign:'center', color:'#cbd5e1' }}>
                  {search||filterStatus ? 'Sin resultados.' : 'No hay contactos aún.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Panel ── */}
      {detailLead && (
        <div style={{
          width:'400px', minWidth:'400px', background:'#fff', borderLeft:'1px solid #e2e8f0',
          display:'flex', flexDirection:'column', overflow:'hidden',
          animation:'slideIn 0.18s ease-out',
        }}>
          <style>{`@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

          {/* Panel header */}
          <div style={{ padding:'1.5rem 1.5rem 1rem', borderBottom:'1px solid #f1f5f9' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <h3 style={{ fontSize:'1.15rem', fontWeight:700, color:'#0f172a', margin:0, lineHeight:1.3 }}>
                  {detailLead.company||'Sin empresa'}
                </h3>
                <p style={{ color:'#94a3b8', fontSize:'0.82rem', margin:'0.3rem 0 0' }}>
                  {detailLead.contactName||detailLead.name||'Sin contacto'}
                  {detailLead.role ? ` · ${detailLead.role}` : ''}
                </p>
              </div>
              <button onClick={() => setDetailLead(null)}
                style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:'1.2rem', padding:'0', marginLeft:'1rem', lineHeight:1 }}>
                ✕
              </button>
            </div>

            {/* WhatsApp button */}
            {detailLead.whatsapp && (
              <a href={buildWaUrl(detailLead.whatsapp, detailLead.contactName||detailLead.name, waTemplate)}
                target="_blank" rel="noopener noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', marginTop:'0.75rem', padding:'0.5rem 1rem', borderRadius:'8px', background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0', textDecoration:'none', fontSize:'0.82rem', fontWeight:600 }}>
                💬 Enviar WhatsApp
              </a>
            )}
          </div>

          {/* Stage progress */}
          <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid #f1f5f9' }}>
            <p style={{ fontSize:'0.7rem', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.6rem' }}>Estado</p>
            <div style={{ display:'flex', gap:'0.3rem', flexWrap:'wrap' }}>
              {STAGE_ORDER.map((stage, i) => {
                const s = STATUSES.find(x => x.value===stage);
                const isActive = detailLead.status===stage;
                const isPast = STAGE_ORDER.indexOf(detailLead.status) > i;
                return (
                  <button key={stage} onClick={() => handleStatusChange(detailLead, stage)}
                    style={{
                      padding:'0.3rem 0.6rem', borderRadius:'6px', fontSize:'0.72rem', fontWeight:600, cursor:'pointer', border:'none',
                      background: isActive ? s.bg : isPast ? '#f1f5f9' : '#f8fafc',
                      color: isActive ? s.color : isPast ? '#94a3b8' : '#cbd5e1',
                      outline: isActive ? `2px solid ${s.border}` : 'none',
                      transition:'all 0.15s',
                    }}>
                    {stage}
                  </button>
                );
              })}
              {['Won','Lost'].map(stage => {
                const s = STATUSES.find(x => x.value===stage);
                const isActive = detailLead.status===stage;
                return (
                  <button key={stage} onClick={() => handleStatusChange(detailLead, stage)}
                    style={{
                      padding:'0.3rem 0.6rem', borderRadius:'6px', fontSize:'0.72rem', fontWeight:600, cursor:'pointer', border:'none',
                      background: isActive ? s.bg : '#f8fafc',
                      color: isActive ? s.color : '#cbd5e1',
                      outline: isActive ? `2px solid ${s.border}` : 'none',
                      transition:'all 0.15s',
                    }}>
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Properties */}
          <div style={{ overflow:'auto', padding:'1rem 1.5rem', borderBottom:'1px solid #f1f5f9' }}>
            <p style={{ fontSize:'0.7rem', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.75rem' }}>Propiedades</p>
            {[
              { label:'Empresa',     value: detailLead.company },
              { label:'Contacto',    value: detailLead.contactName||detailLead.name },
              { label:'Cargo',       value: detailLead.role },
              { label:'Lugar',       value: detailLead.lugar },
              { label:'Email',       value: detailLead.email },
              { label:'Valor',       value: detailLead.value ? `$${detailLead.value}` : null },
              { label:'Propietario', value: detailLead.owner },
              { label:'Creado',      value: detailLead.createdAt ? new Date(detailLead.createdAt.seconds*1000).toLocaleDateString('es-AR') : null },
            ].map(({ label, value }) => (
              <div key={label} style={{ display:'flex', padding:'0.5rem 0', borderBottom:'1px solid #f8fafc' }}>
                <span style={{ width:'100px', minWidth:'100px', fontSize:'0.78rem', color:'#94a3b8', fontWeight:500 }}>{label}</span>
                <span style={{ fontSize:'0.82rem', color: value ? '#0f172a' : '#cbd5e1' }}>{value||'—'}</span>
              </div>
            ))}
          </div>

          {/* Comments */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
            <div style={{ padding:'0.875rem 1.5rem 0.5rem', borderBottom:'1px solid #f8fafc' }}>
              <p style={{ fontSize:'0.7rem', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', margin:0 }}>
                Notas {leadNotes.length > 0 && <span style={{ color:'#cbd5e1', fontWeight:400 }}>({leadNotes.length})</span>}
              </p>
            </div>

            {/* Notes list */}
            <div style={{ flex:1, overflow:'auto', padding:'0.75rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {leadNotes.length === 0 && (
                <p style={{ color:'#cbd5e1', fontSize:'0.82rem', textAlign:'center', margin:'1rem 0' }}>Sin notas aún. Agregá la primera.</p>
              )}
              {leadNotes.map(note => {
                const authorName = (note.author||'').split('@')[0];
                const initial = authorName.charAt(0).toUpperCase();
                const dateStr = note.createdAt?.seconds
                  ? new Date(note.createdAt.seconds*1000).toLocaleString('es-AR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
                  : '';
                return (
                  <div key={note.id} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
                    <div style={{ width:'26px', height:'26px', minWidth:'26px', borderRadius:'50%', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, color:'#fff', marginTop:'1px' }}>
                      {initial}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'0.4rem', marginBottom:'0.2rem' }}>
                        <span style={{ fontSize:'0.75rem', fontWeight:600, color:'#475569' }}>{authorName}</span>
                        <span style={{ fontSize:'0.68rem', color:'#cbd5e1' }}>{dateStr}</span>
                      </div>
                      <p style={{ margin:0, fontSize:'0.83rem', color:'#0f172a', lineHeight:1.5, background:'#f8fafc', padding:'0.5rem 0.75rem', borderRadius:'0 8px 8px 8px', border:'1px solid #f1f5f9' }}>
                        {note.text}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={notesEndRef} />
            </div>

            {/* Note input */}
            <div style={{ padding:'0.75rem 1.5rem', borderTop:'1px solid #f1f5f9', display:'flex', gap:'0.5rem', alignItems:'flex-end' }}>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleAddNote(); } }}
                placeholder="Agregar nota... (Enter para enviar)"
                rows={2}
                style={{ flex:1, padding:'0.6rem 0.75rem', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc', color:'#0f172a', fontSize:'0.82rem', resize:'none', outline:'none', fontFamily:'inherit', lineHeight:1.4 }}
              />
              <button onClick={handleAddNote} disabled={addingNote || !newNote.trim()}
                style={{ padding:'0.6rem 0.75rem', borderRadius:'8px', background: newNote.trim() ? '#0f172a' : '#f1f5f9', color: newNote.trim() ? '#fff' : '#cbd5e1', border:'none', cursor: newNote.trim() ? 'pointer' : 'default', fontSize:'1rem', transition:'all 0.15s', lineHeight:1 }}>
                ↑
              </button>
            </div>
          </div>

          {/* Panel actions */}
          <div style={{ padding:'0.875rem 1.5rem', borderTop:'1px solid #e2e8f0', display:'flex', gap:'0.6rem' }}>
            <button onClick={() => openModal(detailLead)} style={{ flex:1, ...outlineBtn, color:'#475569' }}>✏️ Editar</button>
            <button onClick={() => handleDelete(detailLead.id)} style={{ ...outlineBtn, color:'#dc2626', borderColor:'#fecaca' }}>🗑</button>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, background:'#fff' }}>
            <h3 style={{ fontSize:'1.15rem', marginBottom:'1.5rem', fontWeight:700, color:'#0f172a' }}>
              {editingLead ? 'Editar Contacto' : 'Nuevo Contacto'}
            </h3>
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={grid2}>
                <Field label="Empresa *" value={formData.company} onChange={v => setFormData(f=>({...f,company:v}))} required />
                <Field label="Contacto" value={formData.contactName} onChange={v => setFormData(f=>({...f,contactName:v}))} />
              </div>
              <div style={grid2}>
                <Field label="Cargo / Título" value={formData.role} onChange={v => setFormData(f=>({...f,role:v}))} />
                <Field label="Lugar" value={formData.lugar} onChange={v => setFormData(f=>({...f,lugar:v}))} placeholder="Mendoza, CABA..." />
              </div>
              <div style={grid2}>
                <Field label="WhatsApp" value={formData.whatsapp} onChange={v => setFormData(f=>({...f,whatsapp:v}))} placeholder="wa.me/+549..." />
                <Field label="Email" value={formData.email} onChange={v => setFormData(f=>({...f,email:v}))} type="email" />
              </div>
              <div>
                <label style={labelStyle}>Estado</label>
                <select value={formData.status} onChange={e => setFormData(f=>({...f,status:e.target.value}))} style={inputStyle}>
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Notas</label>
                <textarea rows={3} value={formData.notes} onChange={e => setFormData(f=>({...f,notes:e.target.value}))} style={{ ...inputStyle, resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex:1, ...outlineBtn }}>Cancelar</button>
                <button type="submit" style={{ flex:1, ...primaryBtn }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Import Modal ── */}
      {importModalOpen && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth:'min(92vw,1000px)', width:'1000px', background:'#fff' }}>
            <h3 style={{ fontSize:'1.15rem', marginBottom:'0.4rem', fontWeight:700, color:'#0f172a' }}>Importar desde Excel</h3>
            <p style={{ color:'#94a3b8', fontSize:'0.82rem', marginBottom:'1.25rem' }}>
              Asigná cada columna a un campo del CRM. {importRows.length} filas en total.
            </p>
            <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem', fontSize:'0.82rem', color:'#475569', cursor:'pointer' }}>
              <input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} style={{ accentColor:'#2563eb' }} />
              La primera fila es un encabezado (ignorarla)
            </label>
            <div style={{ overflowX:'auto', marginBottom:'1.5rem', borderRadius:'8px', border:'1px solid #e2e8f0' }}>
              <table style={{ borderCollapse:'collapse', fontSize:'0.78rem', width:'100%' }}>
                <thead>
                  <tr style={{ background:'#f8fafc' }}>
                    {(importRows[0]||[]).map((_,i) => (
                      <th key={i} style={{ padding:'0.5rem 0.6rem', minWidth:'130px', verticalAlign:'top' }}>
                        <select value={columnMapping[i]||''} onChange={e => { const m=[...columnMapping]; m[i]=e.target.value; setColumnMapping(m); }}
                          style={{ ...inputStyle, fontSize:'0.72rem', padding:'0.35rem 0.5rem', width:'100%', background:'#fff', color:'#0f172a', border:'1px solid #e2e8f0' }}>
                          {IMPORT_FIELDS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
                        </select>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importRows.slice(0,5).map((row,ri) => (
                    <tr key={ri} style={{ borderTop:'1px solid #f1f5f9', background: ri===0&&hasHeader ? '#fafafa' : '#fff' }}>
                      {(importRows[0]||[]).map((_,ci) => (
                        <td key={ci} style={{ padding:'0.5rem 0.6rem', color: ri===0&&hasHeader ? '#94a3b8' : '#475569', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {String(row[ci]??'—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {importRows.length>5 && <p style={{ color:'#94a3b8', fontSize:'0.75rem', marginBottom:'1rem', marginTop:'-0.75rem' }}>+ {importRows.length-5} filas más...</p>}
            {importError && (
              <p style={{ color:'#dc2626', fontSize:'0.82rem', marginBottom:'1rem', padding:'0.75rem', background:'#fef2f2', borderRadius:'8px', border:'1px solid #fecaca' }}>
                {importError}
              </p>
            )}
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={() => { setImportModalOpen(false); setImportError(''); }} style={{ flex:1, ...outlineBtn }}>Cancelar</button>
              <button onClick={handleImport} disabled={importing} style={{ flex:1, ...primaryBtn, opacity:importing?0.7:1 }}>
                {importing ? 'Importando...' : `Importar ${hasHeader ? importRows.length-1 : importRows.length} contactos`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusSelect({ lead, onChange }) {
  const [open, setOpen] = useState(false);
  const s = STATUSES.find(x => x.value===lead.status) || STATUSES[0];
  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ padding:'3px 10px', borderRadius:'99px', fontSize:'0.72rem', fontWeight:600, cursor:'pointer', background:s.bg, color:s.color, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', gap:'0.3rem' }}>
        {lead.status||'—'} <span style={{ fontSize:'0.6rem' }}>▾</span>
      </button>
      {open && (
        <>
          <div style={{ position:'fixed', inset:0, zIndex:10 }} onClick={() => setOpen(false)} />
          <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, zIndex:20, background:'#fff', border:'1px solid #e2e8f0', borderRadius:'10px', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', padding:'0.4rem', minWidth:'180px' }}>
            {STATUSES.map(st => (
              <button key={st.value} onClick={() => { onChange(lead, st.value); setOpen(false); }}
                style={{ display:'block', width:'100%', textAlign:'left', padding:'0.45rem 0.7rem', borderRadius:'6px', border:'none', cursor:'pointer', background: lead.status===st.value ? st.bg : 'transparent', color: lead.status===st.value ? st.color : '#475569', fontSize:'0.82rem', fontWeight: lead.status===st.value ? 600 : 400 }}>
                {st.value}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PillBtn({ children, active, onClick, color, bg, border }) {
  return (
    <button onClick={onClick} style={{
      padding:'0.3rem 0.8rem', borderRadius:'99px', fontSize:'0.72rem', fontWeight:500,
      border: `1px solid ${active ? (border||'#e2e8f0') : '#e2e8f0'}`,
      background: active ? (bg||'#f1f5f9') : '#fff',
      color: active ? (color||'#475569') : '#94a3b8',
      cursor:'pointer', transition:'all 0.15s',
    }}>
      {children}
    </button>
  );
}

const inputStyle = {
  width:'100%', padding:'0.6rem 0.75rem', borderRadius:'8px',
  background:'#f8fafc', border:'1px solid #e2e8f0',
  color:'#0f172a', outline:'none', boxSizing:'border-box', fontSize:'0.875rem',
};
const labelStyle  = { display:'block', marginBottom:'0.4rem', fontSize:'0.78rem', color:'#64748b', fontWeight:500 };
const primaryBtn  = { padding:'0.6rem 1.2rem', borderRadius:'8px', background:'#0f172a', color:'#fff', fontWeight:600, border:'none', cursor:'pointer', fontSize:'0.85rem' };
const outlineBtn  = { padding:'0.6rem 1.2rem', borderRadius:'8px', background:'#fff', color:'#475569', fontWeight:500, border:'1px solid #e2e8f0', cursor:'pointer', fontSize:'0.85rem' };
const dangerBtn   = { padding:'0.6rem 1.2rem', borderRadius:'8px', background:'#fef2f2', color:'#dc2626', fontWeight:600, border:'1px solid #fecaca', cursor:'pointer', fontSize:'0.85rem' };
const iconBtn     = { background:'none', border:'none', cursor:'pointer', fontSize:'0.95rem', padding:'0.2rem 0.3rem', opacity:0.5 };
const overlayStyle = { position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)' };
const modalStyle  = { padding:'2rem', borderRadius:'16px', border:'1px solid #e2e8f0', width:'100%', maxWidth:'560px', boxShadow:'0 20px 40px rgba(0,0,0,0.12)', maxHeight:'90vh', overflowY:'auto' };
const th = { padding:'0.7rem 1rem', color:'#94a3b8', fontWeight:600, fontSize:'0.68rem', textTransform:'uppercase', letterSpacing:'0.06em', textAlign:'left', whiteSpace:'nowrap' };
const td = { padding:'0.75rem 1rem' };
const grid2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' };
