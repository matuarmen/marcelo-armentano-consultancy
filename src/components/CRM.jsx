import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function CRM() {
    const [leads, setLeads] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [formData, setFormData] = useState({ name: '', company: '', email: '', status: 'New', notes: '' });

    // Simulation check
    const isSimulation = db.app.options.apiKey === "YOUR_API_KEY";

    useEffect(() => {
        if (isSimulation) {
            setLeads([
                { id: '1', name: 'Juan Perez', company: 'Tech Solutions', email: 'juan@tech.com', status: 'New', notes: 'Interesado en auditoría', createdAt: { seconds: Date.now() / 1000 } },
                { id: '2', name: 'Maria Garcia', company: 'Design Co', email: 'maria@design.com', status: 'Contacted', notes: 'Reunión agendada', createdAt: { seconds: Date.now() / 1000 - 86400 } },
                { id: '3', name: 'Pedro Lopez', company: 'Lopez Hnos', email: 'pedro@lopez.com', status: 'Closed', notes: 'Cliente activo', createdAt: { seconds: Date.now() / 1000 - 172800 } },
            ]);
            return;
        }

        const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLeads(leadsData);
        });
        return () => unsubscribe();
    }, [isSimulation]);

    const handleOpenModal = (lead = null) => {
        if (lead) {
            setEditingLead(lead);
            setFormData({ name: lead.name, company: lead.company, email: lead.email, status: lead.status || 'New', notes: lead.notes || '' });
        } else {
            setEditingLead(null);
            setFormData({ name: '', company: '', email: '', status: 'New', notes: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isSimulation) {
                if (editingLead) {
                    setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...formData } : l));
                } else {
                    setLeads([{ id: Date.now().toString(), ...formData, createdAt: { seconds: Date.now() / 1000 } }, ...leads]);
                }
            } else {
                if (editingLead) {
                    await updateDoc(doc(db, "leads", editingLead.id), { ...formData });
                } else {
                    await addDoc(collection(db, "leads"), { ...formData, createdAt: serverTimestamp() });
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving lead:", error);
            alert("Error al guardar. Revisa la consola.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que querés eliminar este lead?")) return;

        if (isSimulation) {
            setLeads(leads.filter(l => l.id !== id));
        } else {
            await deleteDoc(doc(db, "leads", id));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa' }; // Blue
            case 'Contacted': return { bg: 'rgba(234, 179, 8, 0.1)', text: '#facc15' }; // Yellow
            case 'Proposal': return { bg: 'rgba(168, 85, 247, 0.1)', text: '#c084fc' }; // Purple
            case 'Closed': return { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ade80' }; // Green
            default: return { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8' }; // Gray
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>CRM</h2>
                    <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Gestión de prospectos y clientes.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>+</span> Nuevo Lead
                </button>
            </div>

            <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.1) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                                <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Nombre</th>
                                <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Empresa</th>
                                <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Estado</th>
                                <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Email</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => {
                                const statusStyle = getStatusColor(lead.status);
                                return (
                                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{lead.name}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#cbd5e1' }}>{lead.company}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>{lead.email}</td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button onClick={() => handleOpenModal(lead)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '0.5rem', fontSize: '1.1rem' }}>✏️</button>
                                            <button onClick={() => handleDelete(lead.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>🗑️</button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No hay leads registrados aún.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: '100%', maxWidth: '500px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editingLead ? 'Editar Lead' : 'Nuevo Lead'}</h3>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>Nombre</label>
                                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>Empresa</label>
                                    <input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={inputStyle} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>Estado</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Proposal">Proposal</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>Notas</label>
                                <textarea rows="3" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    outline: 'none'
};
