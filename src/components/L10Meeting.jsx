import { useState, useEffect } from 'react';

const AGENDA_STEPS = [
    { id: 'checkin', title: 'Seguimiento / Good News', duration: 5 },
    { id: 'scorecard', title: 'Scorecard Review', duration: 5 },
    { id: 'okrs', title: 'Review OKRs', duration: 5 },
    { id: 'headlines', title: 'Headlines', duration: 5 },
    { id: 'todos', title: 'To-Do List (Review)', duration: 5 },
    { id: 'ids', title: 'IDS (Issues Solving)', duration: 60 },
    { id: 'conclude', title: 'Conclude', duration: 5 },
];

export default function L10Meeting() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // State for content
    const [issues, setIssues] = useState([{ id: 1, text: 'Definir Presupuesto Marketing Q1', completed: false }]);
    const [todos, setTodos] = useState([{ id: 1, text: 'Enviar reporte mensual a Cliente A', completed: false }]);
    const [newEntry, setNewEntry] = useState('');

    const currentStep = AGENDA_STEPS[currentStepIndex];

    // Global Timer Effect
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleNextStep = () => {
        if (currentStepIndex < AGENDA_STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            // Optional: Reset section timer if we had one
        }
    };

    const handlePrevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const addEntry = (e) => {
        e.preventDefault();
        if (!newEntry.trim()) return;

        if (currentStep.id === 'ids') {
            setIssues([...issues, { id: Date.now(), text: newEntry, completed: false }]);
        } else if (currentStep.id === 'todos') {
            setTodos([...todos, { id: Date.now(), text: newEntry, completed: false }]);
        }
        setNewEntry('');
    };

    const toggleItem = (list, setList, id) => {
        setList(list.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#f8fafc' }}>

            {/* Immersive Header / Timer Bar */}
            <div style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(to right, rgba(255,255,255,0.01), transparent)'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                        {currentStep.title}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {AGENDA_STEPS.map((step, idx) => (
                            <div
                                key={step.id}
                                style={{
                                    width: '40px',
                                    height: '4px',
                                    borderRadius: '2px',
                                    backgroundColor: idx === currentStepIndex ? '#c0a062' : (idx < currentStepIndex ? '#22c55e' : 'rgba(255,255,255,0.1)')
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tiempo Total</div>
                        <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 700, color: isTimerRunning ? '#f8fafc' : '#64748b' }}>
                            {formatTime(elapsedSeconds)}
                        </div>
                    </div>

                    <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: isTimerRunning ? '#ef4444' : '#22c55e',
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 15px rgba(0,0,0,0.5)'
                        }}
                    >
                        {isTimerRunning ? '⏸' : '▶'}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>

                {/* Dynamic Content based on Step */}
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {(currentStep.id === 'checkin' || currentStep.id === 'headlines' || currentStep.id === 'conclude') && (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                            <h3>Momento de conversación</h3>
                            <p>Compartan las actualizaciones verbalmente. Tomen notas si es necesario.</p>
                            <textarea
                                placeholder="Notas de la reunión..."
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    marginTop: '2rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    padding: '1rem',
                                    resize: 'none'
                                }}
                            />
                        </div>
                    )}

                    {currentStep.id === 'scorecard' && (
                        <div>
                            {/* Mock Scorecard */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '1rem' }}>KPI</th>
                                        <th style={{ textAlign: 'left', padding: '1rem' }}>Goal</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>Semana 1</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>Semana 2</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>Semana 3</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { kpi: 'New MRR Added', goal: '$2,500', s1: '$400', s2: '$800', s3: '-' },
                                        { kpi: 'New Customers', goal: '1', s1: '2', s2: '4', s3: '-' },
                                        { kpi: 'Tickets Closed', goal: '50', s1: '10', s2: '33', s3: '-' },
                                    ].map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <td style={{ padding: '1rem' }}>{row.kpi}</td>
                                            <td style={{ padding: '1rem', color: '#c0a062' }}>{row.goal}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>{row.s1}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>{row.s2}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>{row.s3}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(currentStep.id === 'ids' || currentStep.id === 'todos') && (
                        <div>
                            <form onSubmit={addEntry} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                <input
                                    value={newEntry}
                                    onChange={(e) => setNewEntry(e.target.value)}
                                    placeholder={currentStep.id === 'ids' ? "Nuevo Issue a resolver..." : "Nueva Tarea..."}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.03)',
                                        color: 'white',
                                        fontSize: '1.1rem'
                                    }}
                                    autoFocus
                                />
                                <button className="btn btn-primary" style={{ padding: '0 2rem' }}>Agregar</button>
                            </form>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {(currentStep.id === 'ids' ? issues : todos).map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItem(currentStep.id === 'ids' ? issues : todos, currentStep.id === 'ids' ? setIssues : setTodos, item.id)}
                                        style={{
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                            border: '1px solid transparent'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                    >
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            border: '2px solid #525252',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: item.completed ? '#22c55e' : 'transparent',
                                            borderColor: item.completed ? '#22c55e' : '#525252'
                                        }}>
                                            {item.completed && '✓'}
                                        </div>
                                        <span style={{
                                            fontSize: '1.1rem',
                                            textDecoration: item.completed ? 'line-through' : 'none',
                                            color: item.completed ? '#64748b' : '#f8fafc',
                                            flex: 1
                                        }}>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation Controls */}
                    <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            onClick={handlePrevStep}
                            disabled={currentStepIndex === 0}
                            style={{
                                opacity: currentStepIndex === 0 ? 0 : 1,
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            ← Anterior
                        </button>

                        <button
                            onClick={handleNextStep}
                            disabled={currentStepIndex === AGENDA_STEPS.length - 1}
                            className="btn btn-primary"
                            style={{
                                opacity: currentStepIndex === AGENDA_STEPS.length - 1 ? 0.5 : 1,
                                display: currentStepIndex === AGENDA_STEPS.length - 1 ? 'none' : 'block'
                            }}
                        >
                            Siguiente: {AGENDA_STEPS[currentStepIndex + 1]?.title} →
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
