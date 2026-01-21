import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function LeadForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            // Check if config is still placeholder
            if (db.app.options.apiKey === "YOUR_API_KEY") {
                throw new Error("Firebase not configured");
            }

            await addDoc(collection(db, "leads"), {
                ...formData,
                createdAt: serverTimestamp(),
                source: 'landing_page'
            });

            setStatus('success');
            setFormData({ name: '', email: '', company: '', message: '' });
        } catch (error) {
            console.error("Error adding lead: ", error);
            // For demo purposes, if it's the config error, we might want to show a specific message or just success for the UI demo
            if (error.message === "Firebase not configured") {
                alert("Nota: Para guardar los datos realmentes, necesitamos configurar Firebase en src/lib/firebase.js");
                // Simulate success for the user experience prototype
                setTimeout(() => setStatus('success'), 1000);
            } else {
                setStatus('error');
            }
        }
    };

    if (status === 'success') {
        return (
            <div style={{
                padding: '2rem',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <h3 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>¡Mensaje Recibido!</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Me pondré en contacto con vos a la brevedad.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="btn btn-outline"
                    style={{ marginTop: '1rem', fontSize: '0.9rem' }}
                >
                    Enviar otro mensaje
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'var(--color-primary-light)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 600 }}>Solicitar Auditoría</h3>

            <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'var(--color-bg)',
                        color: 'white',
                        outline: 'none'
                    }}
                />
            </div>

            <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'var(--color-bg)',
                        color: 'white',
                        outline: 'none'
                    }}
                />
            </div>

            <div>
                <label htmlFor="company" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Empresa / Pyme</label>
                <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'var(--color-bg)',
                        color: 'white',
                        outline: 'none'
                    }}
                />
            </div>

            <div>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Mensaje (Opcional)</label>
                <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'var(--color-bg)',
                        color: 'white',
                        outline: 'none',
                        resize: 'vertical'
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn btn-primary"
                style={{ marginTop: '1rem', width: '100%' }}
            >
                {status === 'submitting' ? 'Enviando...' : 'Enviar Solicitud'}
            </button>

            {status === 'error' && (
                <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Hubo un error al enviar. Por favor intenta de nuevo.
                </p>
            )}
        </form>
    );
}
