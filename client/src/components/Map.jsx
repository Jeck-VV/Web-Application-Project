import { useContext } from 'react';
import LanguageContext from './LanguageContext.jsx';
import ThemeContext from './ThemeContext.jsx';
import { Spinner } from 'react-bootstrap';

const t = {
    it: {
        error: 'Errore nella visualizzazione, ricarica il sito',
    },
    en: {
        error: 'Display error, please refresh the page',
    },
};

const lineColors = {
    "Linea Verde": "#22c55e",
    "Linea Blu": "#3b82f6",
    "Linea Gialla": "#eab308",
    "Linea Rossa": "#ef4444",
    "Linea Viola": "#a855f7"
};

function Map(props) {
    const { language } = useContext(LanguageContext);
    const tx = t[language];

    const { theme } = useContext(ThemeContext);

    if (props.stazioni === "errore" || props.tratte === "errore" || props.linee === "errore") {
        return <h1>{tx.error}</h1>;
    }

    if (!props.stazioni || !props.tratte || !props.linee) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-3">Caricamento mappa in corso...</span>
            </div>
        );
    }

    const getLineColor = (lid) => {
        const line = props.linee.find(l => l.lid === lid);
        return line ? lineColors[line.nomeLinea] : "#888";
    };

    // Funzione helper per capire il colore di una stazione normale (non di interscambio)
    const getStationColor = (sid) => {
        const tratta = props.tratte.find(t => t.sidStart === sid || t.sidEnd === sid);
        if (tratta) {
            return getLineColor(tratta.lid);
        }
        return "#888";
    };

    const styleStart = { width: '100%', height: 'auto' };
    const styleNoStart = {maxWidth: '840px', height: 'auto', margin: 'auto'};

    return (
        <div>
            <svg width="100%" viewBox="100 100 900 600" style={props.isGameStarted ? styleStart : styleNoStart}>

                {/* TRATTE */}
                {props.showLines !== false && props.tratte.map(tratta => {
                    const sStart = props.stazioni.find(s => s.sid === tratta.sidStart);
                    const sEnd = props.stazioni.find(s => s.sid === tratta.sidEnd);
                    if (!sStart || !sEnd) return null;

                    return (
                        <line
                            key={`tratta-${tratta.tid}`}
                            x1={sStart.xCoordCircle}
                            y1={sStart.yCoordCircle}
                            x2={sEnd.xCoordCircle}
                            y2={sEnd.yCoordCircle}
                            stroke={getLineColor(tratta.lid)}
                            strokeWidth="4"
                        />
                    );
                })}

                {/* PALLINE STAZIONI */}
                {props.stazioni.map(stazione => {
                    const isInterchange = stazione.Interscambio === 1;

                    let r = 9;
                    let color = "#888";

                    if (props.showLines !== false) {
                        if (isInterchange) {
                            r = 11;
                            color = "#888";
                        } else {
                            r = 9;
                            color = getStationColor(stazione.sid);
                        }
                    }

                    return (
                        <circle
                            key={`circle-${stazione.sid}`}
                            cx={stazione.xCoordCircle}
                            cy={stazione.yCoordCircle}
                            r={r}
                            fill="white"
                            stroke={color}
                            strokeWidth="3"
                        />
                    );
                })}

                {/* ETICHETTE TESTUALI */}
                {props.stazioni.map(stazione => (
                    <text
                        key={`text-${stazione.sid}`}
                        x={stazione.xCoordName}
                        y={stazione.yCoordName}
                        fontSize="11"
                        fill={theme === 'dark' ? "white" : "#333"}
                        fontFamily="sans-serif"
                    >
                        {stazione.nomeStazione}
                    </text>
                ))}
            </svg>
        </div>
    );
}

export default Map;