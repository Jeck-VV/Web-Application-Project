import { useContext } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import LanguageContext from './LanguageContext.jsx';
import ThemeContext from './ThemeContext.jsx';
import Map from './Map.jsx';
import { TrattaCard } from './TrattaCard.jsx';
import { useGameState } from './UseGameState.js';
import gameTranslations from './GameTranslations.js';
import './css/MainLayout.css';

export function GamePage(props) {
    const { language } = useContext(LanguageContext);
    const tx = gameTranslations[language];
    const { theme } = useContext(ThemeContext);
    const cardClass = theme === 'dark' ? 'bg-dark text-white border-secondary' : 'bg-white border-light';

    const g = useGameState(props);
    const getStationName = (sid) => props.stazioni?.find(s => s.sid === sid)?.nomeStazione ?? '?';

    const mkCard = (tratta, from, index = null) => (
        <TrattaCard key={`tc-${tratta.tid}-${from}-${index}`}
            tratta={tratta} from={from} index={index}
            gameState={g.gameState} executionEvents={g.executionEvents}
            getStationName={getStationName} eventOccurredLabel={tx.eventOccurred}
            onDragStart={(e) => {
                if (g.gameState !== 'PLANNING') return;
                e.dataTransfer.setData('tid', tratta.tid.toString());
                e.dataTransfer.setData('from', from);
                if (index !== null) e.dataTransfer.setData('index', index.toString());
            }}
        />
    );

    const divider = (
        <div style={{
            width: '2px', alignSelf: 'stretch', margin: '0 12px', flexShrink: 0,
            background: 'linear-gradient(180deg,#d63333,#c75932,#df6f06)', borderRadius: '2px'
        }} />
    );

    return (
        <>
            <Container className="d-flex flex-column">
                {/* HEADER: target, timer, monete */}
                {g.gameState !== 'SETUP' && (
                    <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded"
                        style={{ background: theme === 'dark' ? '#222' : '#f8f9fa' }}>
                        <div>
                            <span className="fw-bold me-2">{tx.targetLabel}</span>
                            <span className="text-primary fw-bold">
                                {getStationName(g.startStation)} ↔ {getStationName(g.endStation)}
                            </span>
                        </div>
                        {g.gameState === 'PLANNING' && (
                            <div className={`fw-bold ${g.timeLeft <= 10 ? 'text-danger' : ''}`}>
                                {tx.timeLeft} {g.timeLeft}s
                            </div>
                        )}
                        <span className="fw-bold" style={{ fontSize: '1rem' }}>🪙 {g.coins}</span>
                    </div>
                )}

                {/* ── EXECUTION / VALID RESULT layout ── */}
                {(g.gameState === 'EXECUTION' || (g.gameState === 'RESULT' && g.pathValid)) && (
                    <Container className="d-flex">
                        {/* Colonna sinistra: eventi rivelati uno alla volta */}
                        <Container className="col-6 me-2">
                            <h2 className="gamemap fw-bold text-center mb-3">{tx.executionTitle}</h2>
                            <div style={{ overflowY: 'auto', maxHeight: '70vh', padding: '4px 6px' }}>
                                {g.droppedTratte.slice(0, g.revealedCount).map((tratta, index) =>
                                    mkCard(tratta, 'dropped', index)
                                )}
                            </div>
                        </Container>

                        {divider}

                        {/* Colonna destra: contatore monete + bottone play again */}
                        <Container className="col-6 d-flex flex-column justify-content-center align-items-center text-center">
                            <h2>{tx.coinsTotal}</h2>
                            <h1 className="fw-bold text-warning mb-4" style={{ fontSize: '3rem' }}>
                                🪙 {g.coins}
                            </h1>
                            {g.gameState === 'RESULT' && (
                                <Button size="lg" className="goHomeButton fw-bold w-auto"
                                    style={{ borderRadius: '12px', padding: '12px 24px' }}
                                    onClick={g.resetGame}>
                                    {tx.playAgain}
                                </Button>
                            )}
                        </Container>
                    </Container>
                )}

                {/* ── Layout standard (SETUP / PLANNING / INVALID RESULT) ── */}
                {(g.gameState === 'SETUP' || g.gameState === 'PLANNING' || (g.gameState === 'RESULT' && !g.pathValid)) && (
                    <Container className="d-flex">
                        {/* COLONNA SINISTRA */}
                        <Container className={`d-flex flex-column ${g.gameState !== 'SETUP' ? 'col-6' : 'col-12'} me-2`}>
                            <h1 className="gamemap fw-bold text-center mb-2">
                                {g.gameState === 'RESULT' ? tx.resultTitle : tx.gameMap}
                            </h1>

                            {/* Mappa (SETUP / PLANNING) */}
                            {(g.gameState === 'SETUP' || g.gameState === 'PLANNING') && (
                                <Container className="d-flex col-12 justify-content-center">
                                    <Card style={{ width: '100%', maxWidth: g.gameState !== 'SETUP' ? '550px' : '900px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.75)' }}
                                        className={`border ${cardClass} col-12`}>
                                        <Map stazioni={props.stazioni} tratte={props.tratte} linee={props.linee} showLines={g.gameState === 'SETUP'} isGameStarted={props.isGameStarted} />
                                    </Card>
                                </Container>
                            )}

                            {/* Drop zone (PLANNING / INVALID RESULT) */}
                            {(g.gameState === 'PLANNING' || (g.gameState === 'RESULT' && !g.pathValid)) && (
                                <Container className="col-12 mt-3 px-0">
                                    <h5 className="gamemap fw-bold text-center mb-2">{tx.dropZoneTitle}</h5>
                                    <div onDragOver={(e) => e.preventDefault()} onDrop={g.handleDropOnDropZone}
                                        style={{ minHeight: '90px', borderRadius: '16px', border: '2px dashed #888', padding: '10px', background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
                                        {g.droppedTratte.length === 0
                                            ? (g.gameState === 'PLANNING' && <p className="text-center text-muted m-0" style={{ lineHeight: '66px', fontSize: '0.85rem' }}>{tx.dropHere}</p>)
                                            : g.droppedTratte.map((tratta, index) => (
                                                <div key={`slot-${index}`}
                                                    onDragOver={(e) => { e.preventDefault(); g.setDragOverIndex(index); }}
                                                    onDragLeave={() => g.setDragOverIndex(null)}>
                                                    {g.dragOverIndex === index && g.gameState === 'PLANNING' && (
                                                        <div style={{ height: '3px', background: 'linear-gradient(90deg,#d63333,#df6f06)', borderRadius: '2px', marginBottom: '4px' }} />
                                                    )}
                                                    {mkCard(tratta, 'dropped', index)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {g.gameState === 'PLANNING' && (
                                        <div className="d-flex justify-content-center mt-3 gap-3">
                                            <Button className="mb-3 fw-bold goHomeButton" style={{ borderRadius: '12px', padding: '10px 24px' }} onClick={g.handleValidation}>
                                                {tx.validate}
                                            </Button>
                                            {g.droppedTratte.length > 0 && (
                                                <Button variant="outline-secondary" className="fw-bold mb-3" style={{ borderRadius: '12px', padding: '10px 20px' }} onClick={g.resetDropped}>
                                                    {tx.resetDrop}
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </Container>
                            )}
                        </Container>

                        {/* DIVISORE (solo non-SETUP) */}
                        {g.gameState !== 'SETUP' && divider}

                        {/* COLONNA DESTRA: lista tratte (PLANNING) */}
                        {g.gameState === 'PLANNING' && (
                            <Container className="col-6" onDragOver={(e) => e.preventDefault()} onDrop={g.handleDropOnAvailable}>
                                <h2 className="gamemap fw-bold text-center mb-3">{tx.tratteTitle}</h2>
                                <div style={{ overflowY: 'auto', maxHeight: '70vh', padding: '4px 6px' }}>
                                    {g.availableTratte.length === 0
                                        ? <p className="text-center text-muted">{tx.noAvailableTratte}</p>
                                        : g.availableTratte.map(t => mkCard(t, 'available'))}
                                </div>
                            </Container>
                        )}

                        {/* COLONNA DESTRA: risultato percorso non valido (RESULT) */}
                        {g.gameState === 'RESULT' && (
                            <Container className="col-6 d-flex flex-column justify-content-center align-items-center text-center">
                                {!g.pathValid && (
                                    <div className="alert alert-danger mb-4">
                                        <h4>{tx.validateFail}</h4>
                                        <p>{tx.invalidPath}</p>
                                    </div>
                                )}
                                <h2>{tx.coinsTotal}</h2>
                                <h1 className="fw-bold text-warning mb-4" style={{ fontSize: '2rem' }}>🪙 {g.coins}</h1>
                                <Button size="lg" className="goHomeButton fw-bold w-auto" style={{ borderRadius: '12px', padding: '12px 24px' }} onClick={g.resetGame}>
                                    {tx.playAgain}
                                </Button>
                            </Container>
                        )}
                    </Container>
                )}

                {/* BOTTONE SETUP */}
                {g.gameState === 'SETUP' && (
                    <Container className="d-flex justify-content-center col-12">
                        <Button variant="primary" className="fw-bold fs-5 mt-4 goHomeButton"
                            style={{ borderRadius: '12px', padding: '12px', width: 'fit-content' }}
                            onClick={() => g.setCounting(3)}>
                            {tx.startGame}
                        </Button>
                    </Container>
                )}
            </Container>

            {/* COUNTDOWN OVERLAY */}
            {g.counting !== null && (
                <div className="countdown-overlay">
                    <span key={g.counting} className="countdown-number">{g.counting}</span>
                </div>
            )}
        </>
    );
}

export default GamePage;
