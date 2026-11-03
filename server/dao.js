import sqlite from "sqlite3";
import crypto from "crypto";
import Stazione from "./Stazione.js";
import Tratta from "./Tratta.js";
import Linea from "./Linea.js";

const db = new sqlite.Database("UltimaCorsa.db", (err) => {
    if (err) throw err;
});

export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * from Utenti WHERE username = ?";
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = { id: row.uid, username: row.username };

                crypto.scrypt(password, row.salt, 16, function (err, hashedPassword) {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, "hex"), hashedPassword))
                        resolve(false);
                    else
                        resolve(user);
                });
            }
        });
    });
}

export const getStazioni = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * from Stazioni";
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const stazioni = rows.map(row => new Stazione(row.sid, row.nomeStazione, row.xCoordCircle, row.yCoordCircle, row.xCoordName, row.yCoordName, row.Interscambio));
                resolve(stazioni);
            }
        });
    });
}

export const getTratte = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * from Tratte";
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const tratte = rows.map(row => new Tratta(row.tid, row.sidStart, row.sidEnd, row.lid));
                resolve(tratte);
            }
        });
    });
}

export const getLinee = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * from Linee";
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const linee = rows.map(row => new Linea(row.lid, row.nomeLinea));
                resolve(linee);
            }
        });
    });
}

export const getClassifica = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT U.uid, U.username, MAX(P.score) AS max_score FROM Utenti U INNER JOIN Partite P ON U.uid = P.uid GROUP BY U.uid ORDER BY max_score DESC";
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const classifica = rows.map(row => row);
                resolve(classifica);
            }
        });
    });
}

// Valida il percorso server-side
export const submitPartita = (uid, tidList, startStation, endStation) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT tid, sidStart, sidEnd, lid FROM Tratte", (err, tratteRows) => {
            if (err) { reject(err); return; }
            db.all("SELECT sid, Interscambio FROM Stazioni", (err, stazioniRows) => {
                if (err) { reject(err); return; }
                db.all("SELECT * FROM Eventi", (err, eventiRows) => {
                    if (err) { reject(err); return; }

                    const tratteMap = {};
                    tratteRows.forEach(t => { tratteMap[t.tid] = t; });
                    const stazioniMap = {};
                    stazioniRows.forEach(s => { stazioniMap[s.sid] = s; });

                    const droppedTratte = tidList.map(tid => tratteMap[Number(tid)]).filter(Boolean);

                    const valid = serverValidatePath(droppedTratte, startStation, endStation, stazioniMap);

                    let finalScore = 0;
                    let events = [];

                    if (valid && droppedTratte.length > 0) {
                        let runningCoins = 20;
                        events = droppedTratte.map(() => {
                            const ev = eventiRows[Math.floor(Math.random() * eventiRows.length)];
                            runningCoins = runningCoins + ev.scoreEvento;
                            return ev;
                        });
                        finalScore = Math.max(0, runningCoins);
                    }

                    db.run("INSERT INTO Partite(uid, score) VALUES (?, ?)", [uid, finalScore], function (err) {
                        if (err) { reject(err); return; }
                        resolve({ valid, events, score: finalScore, pid: this.lastID });
                    });
                });
            });
        });
    });
};

function serverValidatePath(droppedTratte, startStation, endStation, stazioniMap) {
    if (!droppedTratte || droppedTratte.length === 0) return false;
    const tidSet = new Set(droppedTratte.map(t => t.tid));
    if (tidSet.size !== droppedTratte.length) return false;
    
    const first = droppedTratte[0];
    if (first.sidStart !== startStation && first.sidEnd !== startStation) return false;

    let currentSid = startStation;
    for (let i = 0; i < droppedTratte.length; i++) {
        const t = droppedTratte[i];
        let nextSid = null;
        if (t.sidStart === currentSid) nextSid = t.sidEnd;
        else if (t.sidEnd === currentSid) nextSid = t.sidStart;

        if (nextSid === null) return false;

        if (i < droppedTratte.length - 1) {
            const nextT = droppedTratte[i + 1];
            if (t.lid !== nextT.lid) {
                const junction = stazioniMap[nextSid];
                if (!junction || junction.Interscambio !== 1) return false;
            }
        }
        currentSid = nextSid;
    }
    return currentSid === endStation;
}

// Genera casualmente le stazioni di partenza e di arrivo (distanza minima 3 tratte)
export const getPartitaStart = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT tid, sidStart, sidEnd, lid FROM Tratte";
        db.all(sql, (err, tratteRows) => {
            if (err) { reject(err); return; }
            db.all("SELECT sid, Interscambio FROM Stazioni", (err, stazioniRows) => {
                if (err) { reject(err); return; }

                const stazioniMap = {};
                stazioniRows.forEach(s => { stazioniMap[s.sid] = s; });

                const adj = {};
                tratteRows.forEach(t => {
                    if (!adj[t.sidStart]) adj[t.sidStart] = [];
                    if (!adj[t.sidEnd]) adj[t.sidEnd] = [];
                    adj[t.sidStart].push({ nextSid: t.sidEnd, lid: t.lid, tid: t.tid });
                    adj[t.sidEnd].push({ nextSid: t.sidStart, lid: t.lid, tid: t.tid });
                });

                const stationIds = Object.keys(adj).map(Number);
                const MAX_ATTEMPTS = 50;

                for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
                    const startSid = stationIds[Math.floor(Math.random() * stationIds.length)];
                    const queue = [];
                    const dist = {}; 
                    
                    const startLines = [...new Set(adj[startSid].map(e => e.lid))];
                    for (const lid of startLines) {
                        const stateKey = `${startSid}-${lid}`;
                        queue.push({ sid: startSid, lid: lid, d: 0 });
                        dist[stateKey] = 0;
                    }
                    
                    const minDistanceToStation = {};
                    minDistanceToStation[startSid] = 0;
                    
                    let head = 0;
                    while (head < queue.length) {
                        const curr = queue[head++];
                        
                        const edges = adj[curr.sid] || [];
                        for (const edge of edges) {
                            const nextSid = edge.nextSid;
                            const nextLid = edge.lid;
                            
                            if (curr.lid !== nextLid) {
                                const station = stazioniMap[curr.sid];
                                if (!station || station.Interscambio !== 1) continue;
                            }
                            
                            const nextDist = curr.d + 1;
                            const nextStateKey = `${nextSid}-${nextLid}`;
                            
                            if (dist[nextStateKey] === undefined || nextDist < dist[nextStateKey]) {
                                dist[nextStateKey] = nextDist;
                                queue.push({ sid: nextSid, lid: nextLid, d: nextDist });
                                
                                if (minDistanceToStation[nextSid] === undefined || nextDist < minDistanceToStation[nextSid]) {
                                    minDistanceToStation[nextSid] = nextDist;
                                }
                            }
                        }
                    }
                    
                    const validEndSids = Object.keys(minDistanceToStation)
                        .map(Number)
                        .filter(sid => minDistanceToStation[sid] >= 3);
                        
                    if (validEndSids.length > 0) {
                        const endSid = validEndSids[Math.floor(Math.random() * validEndSids.length)];
                        resolve({
                            startStation: startSid,
                            endStation: endSid,
                        });
                        return;
                    }
                }

                reject(new Error("Impossibile trovare una coppia di stazioni valida con distanza minima 3 tratte."));
            });
        });
    });
}