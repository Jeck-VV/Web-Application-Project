import { useContext } from 'react';
import ThemeContext from './ThemeContext.jsx';

export function TrattaCard({ tratta, from, index, gameState, executionEvents, getStationName, onDragStart, eventOccurredLabel }) {
    const { theme } = useContext(ThemeContext);
    const neutralBorder = theme === 'dark' ? '#555' : '#ccc';
    const neutralLeft = theme === 'dark' ? '#555' : '#bbb';
    const arrowColor = theme === 'dark' ? '#777' : '#999';

    // Mostra evento sia in RESULT (percorso non valido senza eventi) che in EXECUTION
    const eventForCard = ((gameState === 'RESULT' || gameState === 'EXECUTION') && from === 'dropped')
        ? (executionEvents[index] ?? null)
        : null;

    const scoreClass = eventForCard
        ? (eventForCard.scoreEvento > 0 ? 'text-success' : eventForCard.scoreEvento < 0 ? 'text-danger' : 'text-muted')
        : '';

    return (
        <div
            draggable={gameState === 'PLANNING'}
            onDragStart={onDragStart}
            style={{
                borderRadius: '12px',
                padding: '8px 12px',
                marginBottom: '8px',
                border: `2px solid ${eventForCard ? '#3b82f6' : neutralBorder}`,
                borderLeft: `6px solid ${eventForCard ? '#3b82f6' : neutralLeft}`,
                cursor: gameState === 'PLANNING' ? 'grab' : 'default',
                userSelect: 'none',
                fontSize: '0.85rem',
                background: eventForCard
                    ? (theme === 'dark' ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)')
                    : (theme === 'dark' ? '#2a2a2a' : '#fff'),
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
            }}
        >
            {/* Riga principale: stazioni + score */}
            <div className="d-flex align-items-center justify-content-between fw-semibold">
                <div className="d-flex align-items-center gap-1">
                    <span>{getStationName(tratta.sidStart)}</span>
                    <span style={{ color: arrowColor, margin: '0 4px' }}>↔</span>
                    <span>{getStationName(tratta.sidEnd)}</span>
                </div>
                {eventForCard && (
                    <div className={`fw-bold ${scoreClass}`}>
                        {eventForCard.scoreEvento > 0 ? '+' : ''}{eventForCard.scoreEvento}
                    </div>
                )}
            </div>

            {/* Descrizione evento — mostrata inline (sempre visibile, no tooltip) */}
            {eventForCard && (
                <div className="mt-1" style={{ fontSize: '0.78rem', color: theme === 'dark' ? '#aaa' : '#555' }}>
                    {eventForCard.descrizione}
                </div>
            )}
        </div>
    );
}
