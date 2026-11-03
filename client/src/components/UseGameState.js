import { useState, useEffect, useRef } from 'react';
import {
    loadSavedGame, persistGame,
} from './GameSaveState.js';
import API from '../API/API.js';


export function useGameState(props) {
    const saved = loadSavedGame(props.user?.id);

    const [gameState, setGameState] = useState(saved?.gameState ?? 'SETUP');
    const [coins, setCoins] = useState(saved?.coins ?? 20);
    const [availableTratte, setAvailableTratte] = useState(saved?.availableTratte ?? []);
    const [droppedTratte, setDroppedTratte] = useState(saved?.droppedTratte ?? []);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [counting, setCounting] = useState(null);
    const [timeLeft, setTimeLeft] = useState(saved?.timeLeft ?? 0);
    const [startStation, setStartStation] = useState(saved?.startStation ?? null);
    const [endStation, setEndStation] = useState(saved?.endStation ?? null);
    const [executionEvents, setExecutionEvents] = useState(saved?.executionEvents ?? []);
    const [pathValid, setPathValid] = useState(saved?.pathValid ?? true);

    // EXECUTION phase state
    const [revealedCount, setRevealedCount] = useState(saved?.revealedCount ?? 0);
    const [executionDone, setExecutionDone] = useState(saved?.executionDone ?? false);

    // Persist su ogni cambio di stato significativo
    useEffect(() => {
        persistGame(props.user?.id, props.isGameStarted, gameState, {
            gameState, coins, availableTratte, droppedTratte,
            timeLeft, startStation, endStation, executionEvents, pathValid,
            revealedCount, executionDone,
        });
    }, [props.user, props.isGameStarted, gameState, coins, availableTratte,
        droppedTratte, timeLeft, startStation, endStation, executionEvents, pathValid,
        revealedCount, executionDone]);

    // Sync con App.jsx
    useEffect(() => {
        const hasSaved = !!loadSavedGame(props.user?.id);
        if (!props.isGameStarted && gameState !== 'SETUP' && !hasSaved) {
            setGameState('SETUP');
        } else if (props.isGameStarted && gameState === 'SETUP' && props.tratte && props.stazioni) {
            startPlanningPhase();
        }
    }, [props.isGameStarted, props.tratte, props.stazioni, gameState, props.user]);

    // Countdown 3-2-1 → avvia planning
    useEffect(() => {
        if (counting === null) return;
        if (counting === 0) {
            setCounting(null);
            props.setIsGameStarted(true);
            startPlanningPhase();
            return;
        }
        const t = setTimeout(() => setCounting(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [counting]);

    // Timer 90 secondi per la fase PLANNING
    useEffect(() => {
        if (gameState !== 'PLANNING') return;
        if (timeLeft <= 0) { handleValidation(); return; }
        const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
        return () => clearTimeout(t);
    }, [gameState, timeLeft]);

    // EXECUTION phase: rivela eventi uno alla volta ogni 1500ms
    useEffect(() => {
        if (gameState !== 'EXECUTION') return;
        if (revealedCount >= droppedTratte.length) {
            setExecutionDone(true);
            setGameState('RESULT');
            return;
        }
        const delay = revealedCount === 0 ? 600 : 1500;
        const timer = setTimeout(() => {
            const ev = executionEvents[revealedCount];
            if (ev) {
                setCoins(c => {
                    const newCoins = c + ev.scoreEvento;
                    if (revealedCount === executionEvents.length - 1) {
                        return Math.max(0, newCoins);
                    }
                    return newCoins;
                });
            }
            setRevealedCount(c => c + 1);
        }, delay);
        return () => clearTimeout(timer);
    }, [gameState, revealedCount, droppedTratte.length, executionEvents]);

    const startingRef = useRef(false);

    const startPlanningPhase = async () => {
        if (startingRef.current) return;
        startingRef.current = true;
        try {
            const { startStation, endStation } = await API.getPartitaStartInfo();
            setCoins(20);
            setTimeLeft(90);
            setAvailableTratte([...props.tratte]);
            setDroppedTratte([]);
            setStartStation(startStation);
            setEndStation(endStation);
            setRevealedCount(0);
            setExecutionDone(false);
            setGameState('PLANNING');
        } catch (err) {
            console.error('Errore nel recupero delle stazioni di partenza:', err);
        } finally {
            startingRef.current = false;
        }
    };

    // Ref per impedire doppio invio (timer + click manuale nello stesso istante)
    const submittingRef = useRef(false);

    const handleValidation = async () => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        const tidList = droppedTratte.map(t => t.tid);
        try {
            const result = await API.putPartitaInfo(tidList, startStation, endStation);
            setPathValid(result.valid);
            if (result.valid) {
                setExecutionEvents(result.events);
                setCoins(20); // verrà aggiornato progressivamente nell'EXECUTION
                setRevealedCount(0);
                setExecutionDone(false);
                setGameState('EXECUTION');
            } else {
                setCoins(0);
                setExecutionEvents([]);
                setGameState('RESULT');
            }
        } catch (err) {
            console.error('Errore nel salvataggio partita:', err);
        } finally {
            submittingRef.current = false;
        }
    };

    const resetDropped = () => {
        setAvailableTratte(prev => [...prev, ...droppedTratte]);
        setDroppedTratte([]);
    };

    const handleDropOnDropZone = (e) => {
        e.preventDefault();
        if (gameState !== 'PLANNING') return;
        const tid = parseInt(e.dataTransfer.getData('tid'));
        const from = e.dataTransfer.getData('from');
        const insertAt = dragOverIndex !== null ? dragOverIndex : droppedTratte.length;

        if (from === 'available') {
            const tratta = availableTratte.find(t => t.tid === tid);
            if (!tratta) return;
            setAvailableTratte(prev => prev.filter(t => t.tid !== tid));
            setDroppedTratte(prev => { const n = [...prev]; n.splice(insertAt, 0, tratta); return n; });
        } else if (from === 'dropped') {
            const fromIdx = parseInt(e.dataTransfer.getData('index'));
            setDroppedTratte(prev => {
                const n = [...prev];
                const [moved] = n.splice(fromIdx, 1);
                n.splice(insertAt > fromIdx ? insertAt - 1 : insertAt, 0, moved);
                return n;
            });
        }
        setDragOverIndex(null);
    };

    const handleDropOnAvailable = (e) => {
        e.preventDefault();
        if (gameState !== 'PLANNING') return;
        const tid = parseInt(e.dataTransfer.getData('tid'));
        if (e.dataTransfer.getData('from') !== 'dropped') return;
        const tratta = droppedTratte.find(t => t.tid === tid);
        if (!tratta) return;
        setDroppedTratte(prev => prev.filter(t => t.tid !== tid));
        setAvailableTratte(prev => [...prev, tratta]);
    };

    const resetGame = () => {
        props.setIsGameStarted(false);
        setGameState('SETUP');
        setRevealedCount(0);
        setExecutionDone(false);
    };

    return {
        gameState, coins: Math.max(0, coins), availableTratte, droppedTratte,
        dragOverIndex, setDragOverIndex,
        counting, setCounting,
        timeLeft, startStation, endStation,
        executionEvents, pathValid,
        revealedCount, executionDone,
        handleValidation, handleDropOnDropZone, handleDropOnAvailable,
        resetDropped, resetGame,
    };
}
