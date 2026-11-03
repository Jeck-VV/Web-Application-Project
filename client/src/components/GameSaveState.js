// Carica lo stato di gioco salvato per l'utente dal localStorage.
export function loadSavedGame(userId) {
    if (!userId) return null;
    try {
        const raw = localStorage.getItem(`gameData_${userId}`);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

// Salva (o rimuove) lo stato di gioco nel localStorage.
// Salva se il gioco è in uno stato attivo (PLANNING/RESULT).
export function persistGame(userId, isGameStarted, gameState, data) {
    if (!userId) return;
    if (gameState !== 'SETUP') {
        localStorage.setItem(`gameData_${userId}`, JSON.stringify(data));
    } else if (!isGameStarted) {
        localStorage.removeItem(`gameData_${userId}`);
    }
}
