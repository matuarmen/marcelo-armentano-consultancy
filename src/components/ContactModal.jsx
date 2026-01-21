import { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ContactModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if Firebase is configured
            const isSimulation = db.app.options.apiKey === "YOUR_API_KEY";

            if (isSimulation) {
                // Simulate saving
                console.log('Simulated lead saved:', formData);
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                // Save to Firestore
                await addDoc(collection(db, 'leads'), {
                    ...formData,
                    status: 'New',
                    createdAt: serverTimestamp(),
                    source: 'Contact Form'
                });
            }

            setSuccess(true);
            setFormData({ name: '', email: '', company: '', phone: '', message: '' });

            // Close modal after 2 seconds
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2000);

        } catch (err) {
            console.error('Error saving lead:', err);
            setError('Error al enviar. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        fontSize: '1rem',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s',
        outline: 'none'
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)'
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'relative',
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '500px',
                boxShadow: 'var(--shadow-lg)'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'var(--color-bg)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <X size={18} />
                </button>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                            ¡Mensaje Enviado!
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            Nos pondremos en contacto pronto.
                        </p>
                    </div>
                ) : (
                    <>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.75rem',
                            color: 'var(--color-primary)',
                            marginBottom: '0.5rem'
                        }}>
                            Agenda una consulta
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                            Completá el formulario y te contactaremos.
                        </p>

                        {error && (
                            <div style={{
                                background: '#FEE2E2',
                                color: '#DC2626',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1rem',
                                fontSize: '0.9rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Nombre *"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={inputStyle}
                                />
                                <input
                                    type="text"
                                    placeholder="Empresa"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <input
                                type="email"
                                placeholder="Email *"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={inputStyle}
                            />
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                style={inputStyle}
                            />
                            <textarea
                                placeholder="¿En qué podemos ayudarte?"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
