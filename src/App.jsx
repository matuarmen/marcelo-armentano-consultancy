import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problems from './components/Problems';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#home');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    const handleHashChange = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);

    // Listen for custom event to open contact modal
    const handleOpenContact = () => setIsContactModalOpen(true);
    window.addEventListener('openContactModal', handleOpenContact);

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('openContactModal', handleOpenContact);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (auth.app.options.apiKey === "YOUR_API_KEY") {
        setUser(null);
      } else {
        await signOut(auth);
      }
      window.location.hash = '#home';
    } catch (error) {
      console.error(error);
    }
  };

  if (authLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>Cargando...</div>;

  // ROUTING LOGIC
  if (currentPath === '#login') {
    if (user) {
      window.location.hash = '#dashboard';
      return null;
    }
    return <Login onLogin={(u) => { setUser(u); window.location.hash = '#dashboard'; }} />;
  }

  if (currentPath === '#dashboard') {
    if (!user) {
      window.location.hash = '#login';
      return null;
    }
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Default Landing Page
  return (
    <div className="app">
      <Navbar onContactClick={() => setIsContactModalOpen(true)} />
      <main>
        <Hero />
        <Problems />
        <Services />
        <HowItWorks />
        <About />
      </main>
      <Footer onContactClick={() => setIsContactModalOpen(true)} />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <a href="#login" style={{ position: 'fixed', bottom: '10px', right: '10px', opacity: 0.2, fontSize: '0.8rem', color: 'var(--color-primary)' }}>Admin</a>
    </div>
  );
}

export default App;
