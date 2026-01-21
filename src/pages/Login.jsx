import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (auth.app.options.apiKey === "YOUR_API_KEY") {
                // Simulation for dev without credentials
                if (email === 'admin@marcelo.com' && password === 'admin') {
                    onLogin({ email: 'admin@marcelo.com' }); // Fake user
                    return;
                }
                throw new Error("Firebase not configured. Use admin@marcelo.com / admin");
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            onLogin(userCredential.user);
        } catch (err) {
            setError('Credenciales incorrectas o error de configuración.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                backgroundColor: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>Acceso Privado</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--color-bg)', color: 'white' }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--color-bg)', color: 'white' }}
                            required
                        />
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</p>}

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>
                </form>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <a href="/" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>← Volver a la web</a>
                </div>
            </div>
        </div>
    );
}
