const gameTranslations = {
    it: {
        // 404
        title: 'Errore: pagina non trovata!',
        quote: 'Sembra che tu sia finito fuori strada. Clicca il bottone per tornare indietro 🔙',
        btn: 'Torna alla Home!',
        // Login
        loginTitle: 'Bentornato!',
        emailLabel: 'Username',
        pwdLabel: 'Password',
        loginBtn: 'Accedi',
        errMsg: 'Username o password errati',
        dev: 'Per lo sviluppo, rimuovere in pubblicazione',
        // Leaderboard
        leaderboardTitle: 'Classifica Globale 🏆',
        thUser: 'Giocatore',
        thDate: 'Data',
        thScore: 'Punteggio',
        noGame: 'Nessuna partita ancora giocata',
        // Game
        gameMap: 'Mappa del gioco',
        tratteTitle: 'Tratte disponibili',
        dropZoneTitle: 'Il tuo percorso',
        dropHere: 'Trascina le tratte qui per costruire il percorso...',
        validate: 'Valida percorso ✓',
        validateFail: '✗ Percorso non valido',
        resetDrop: 'Azzera',
        noAvailableTratte: 'Tutte le tratte sono state usate',
        startGame: 'Inizia una nuova partita 🎮🚈',
        targetLabel: 'Da raggiungere:',
        timeLeft: 'Tempo rimanente:',
        resultTitle: 'Risultato Finale',
        coinsTotal: 'Monete rimanenti:',
        playAgain: 'Gioca ancora',
        invalidPath: 'Il percorso non è valido o è incompleto. Hai perso tutte le monete!',
        eventOccurred: 'Evento:',
        executionTitle: 'Esecuzione del percorso',
        // NavMenu
        navRules: 'Regolamento',
        navHome: 'Home',
        navLeaderboard: 'Classifica',
        navLogout: 'Esci',
        navLogin: 'Accedi',
        langBtn: 'EN',
        // Header
        headerName: 'Ultima corsa',
        headerGreetings: 'Ciao',
        // Rules
        rulesTitle: 'Ultima Corsa — Regolamento',
        rulesSections: [
            {
                id: 'obiettivo',
                heading: '🎯 Obiettivo',
                body: "Raggiungi la stazione di arrivo assegnata partendo dalla stazione di partenza, pianificando il percorso migliore nella rete metropolitana. L'obiettivo è arrivare a destinazione con il maggior numero di monete possibile.",
            },
            {
                id: 'accesso',
                heading: '🔐 Accesso',
                body: 'Gli utenti registrati possono giocare tutte le partite che vogliono e compaiono nella classifica generale. I visitatori anonimi possono consultare solo le istruzioni di gioco. Per accedere al gioco è necessario effettuare il login.',
            },
            {
                id: 'struttura',
                heading: '🗂️ Struttura di una partita',
                intro: 'Ogni partita inizia con 20 monete e si articola in quattro fasi:',
                phases: [
                    { label: 'Fase 1 — Setup', text: 'Il giocatore visualizza la mappa completa della rete metropolitana con tutte le stazioni, le connessioni e le linee. Quando è pronto, avvia la fase di pianificazione.' },
                    { label: 'Fase 2 — Pianificazione', text: 'Il server assegna casualmente una stazione di partenza e una di arrivo, con una distanza minima di 3 tratte tra loro. La mappa mostra solo i nomi delle stazioni, senza le linee. L\'elenco completo delle tratte è disponibile a lato. Il giocatore ha 90 secondi per ricostruire mentalmente la rete e costruire il proprio percorso selezionando le tratte in sequenza. Allo scadere del tempo, il percorso viene inviato automaticamente.' },
                    { label: 'Fase 3 — Esecuzione', text: 'Se il percorso è valido, per ogni tratta si verifica un evento casuale che aggiunge o sottrae monete. Le tappe vengono mostrate una alla volta. Se il percorso non è valido o è incompleto, il giocatore perde tutte le 20 monete (punteggio finale: 0).' },
                    { label: 'Fase 4 — Risultato', text: 'Il punteggio finale corrisponde alle monete rimaste al termine del viaggio. Se il punteggio fosse negativo, viene registrato come 0. Al termine, il giocatore può scegliere se iniziare una nuova partita.' },
                ],
                validity: '✅ Un percorso è valido se inizia e termina nelle stazioni assegnate, ogni tratta è coperta da una linea reale e i cambi di linea avvengono solo nelle stazioni di interscambio.',
            },
            {
                id: 'monete',
                heading: '🪙 Monete ed eventi',
                body: 'Ogni partita inizia con 20 monete. Durante ogni tratta può verificarsi un evento casuale il cui effetto può variare tra -4 e +4 monete. Gli eventi vengono applicati automaticamente dal gioco.',
            },
            {
                id: 'classifica',
                heading: '🏆 Classifica',
                body: 'Per ogni utente registrato viene memorizzato il miglior risultato ottenuto. La classifica generale, disponibile in una pagina dedicata, mostra i punteggi più alti tra tutti i giocatori.',
            },
        ],
        rulesWarning: 'Attenzione: una volta iniziata la fase di pianificazione, il conto alla rovescia di 90 secondi non si interrompe. Pianifica con cura prima di confermare il percorso.',
        rulesHaveFun: 'Buon divertimento!',
    },
    en: {
        // 404
        title: 'Error: page not found!',
        quote: 'Looks like someone got off track. Click the button below to get back 🔙',
        btn: 'Go Home!',
        // Login
        loginTitle: 'Welcome back!',
        emailLabel: 'Username',
        pwdLabel: 'Password',
        loginBtn: 'Login',
        errMsg: 'Incorrect username or password',
        dev: 'For development, remove before publishing',
        // Leaderboard
        leaderboardTitle: 'Global Leaderboard 🏆',
        thUser: 'Player',
        thDate: 'Date',
        thScore: 'Score',
        noGame: 'No one has played a game yet',
        // Game
        gameMap: 'Game map',
        tratteTitle: 'Available routes',
        dropZoneTitle: 'Your route',
        dropHere: 'Drag routes here to build your path...',
        validate: 'Validate route ✓',
        validateFail: '✗ Invalid route',
        resetDrop: 'Reset',
        noAvailableTratte: 'All routes have been used',
        startGame: 'Start a new game 🎮🚈',
        targetLabel: 'Target:',
        timeLeft: 'Time left:',
        resultTitle: 'Final Result',
        coinsTotal: 'Remaining coins:',
        playAgain: 'Play again',
        invalidPath: 'The route is invalid or incomplete. You lost all coins!',
        eventOccurred: 'Event:',
        executionTitle: 'Route Execution',
        // NavMenu
        navRules: 'Rules',
        navHome: 'Home',
        navLeaderboard: 'Leaderboard',
        navLogout: 'Logout',
        navLogin: 'Login',
        langBtn: 'IT',
        // Header
        headerName: 'Last ride',
        headerGreetings: 'Hello',
        // Rules
        rulesTitle: 'Last Ride — Game Rules',
        rulesSections: [
            {
                id: 'objective',
                heading: '🎯 Objective',
                body: 'Travel from your assigned departure station to the destination station by planning the best route through the metro network. The goal is to arrive with as many coins as possible.',
            },
            {
                id: 'access',
                heading: '🔐 Access',
                body: 'Registered users may play as many games as they like and appear on the global leaderboard. Anonymous visitors may only view the game instructions. A login is required to play.',
            },
            {
                id: 'structure',
                heading: '🗂️ Game Structure',
                intro: 'Every game starts with 20 coins and consists of four phases:',
                phases: [
                    { label: 'Phase 1 — Setup', text: 'The player views the full metro network map with all stations, connections, and lines. When ready, they start the planning phase.' },
                    { label: 'Phase 2 — Planning', text: 'The server randomly assigns a departure and an arrival station, at least 3 segments apart. The map shows only station names with no lines. The full list of segments is shown alongside. The player has 90 seconds to mentally reconstruct the network and build a route by selecting segments in order. When time runs out, the route is submitted automatically.' },
                    { label: 'Phase 3 — Execution', text: 'If the route is valid, a random event occurs on each segment, adding or removing coins. Legs are revealed one at a time. If the route is invalid or incomplete, this phase is skipped and the player loses all 20 coins (final score: 0).' },
                    { label: 'Phase 4 — Result', text: 'The final score equals the coins remaining at the end of the journey. If negative, it is recorded as 0. The player may choose to start a new game.' },
                ],
                validity: '✅ A route is valid if it starts and ends at the assigned stations, every segment belongs to a real line, and line changes only occur at interchange stations.',
            },
            {
                id: 'coins',
                heading: '🪙 Coins & Events',
                body: 'Every game starts with 20 coins. A random event occurs on each segment; its effect ranges from -4 to +4 coins. Events are applied automatically by the game.',
            },
            {
                id: 'leaderboard',
                heading: '🏆 Leaderboard',
                body: 'The best score from each registered user is saved. The global leaderboard, available on a dedicated page, ranks the highest scores across all players.',
            },
        ],
        rulesWarning: 'Note: once the planning phase begins, the 90-second countdown does not pause. Plan carefully before submitting your route.',
        rulesHaveFun: 'Have fun!',
    },
};

export default gameTranslations;
