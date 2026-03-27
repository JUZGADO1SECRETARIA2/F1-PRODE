// Logic for F1 Prode - Firebase Realtime Database version
import { db, ref, set, get, onValue, update } from './firebase-config.js';

// --- Rules ---
const NORMAL_RULES = {
    exact_1_11: 25, exact_2_12: 18, exact_3_13: 15, pole: 5, last: 10
};
const SPRINT_RULES = {
    exact_1_11: 8, exact_2_12: 7, exact_3_13: 6, pole: 2, last: 3
};

// --- Calendar ---
const CALENDAR = [
    { id: 'aus', name: "Australia", limit: "2026-03-07T01:50:00", isSprint: false, round: 1 },
    { id: 'chn_s', name: "China Sprint", limit: "2026-03-13T04:20:00", isSprint: true, round: 2 },
    { id: 'chn', name: "China", limit: "2026-03-14T03:50:00", isSprint: false, round: 2 },
    { id: 'r1', name: "Japón", limit: "2026-03-28T02:50:00", isSprint: false, round: 3 },
    { id: 'r4_s', name: "Miami Sprint", limit: "2026-05-01T17:20:00", isSprint: true, round: 4 },
    { id: 'r4', name: "Miami", limit: "2026-05-02T16:50:00", isSprint: false, round: 4 },
    { id: 'r5_s', name: "Canadá Sprint", limit: "2026-05-22T17:20:00", isSprint: true, round: 5 },
    { id: 'r5', name: "Canadá", limit: "2026-05-23T16:50:00", isSprint: false, round: 5 },
    { id: 'r6', name: "Mónaco", limit: "2026-06-06T10:50:00", isSprint: false, round: 6 },
    { id: 'r7', name: "España (Bcn)", limit: "2026-06-13T10:50:00", isSprint: false, round: 7 },
    { id: 'r8', name: "Austria", limit: "2026-06-27T10:50:00", isSprint: false, round: 8 },
    { id: 'r9_s', name: "Gran Bretaña Sprint", limit: "2026-07-03T14:20:00", isSprint: true, round: 9 },
    { id: 'r9', name: "Gran Bretaña", limit: "2026-07-04T10:50:00", isSprint: false, round: 9 },
    { id: 'r10', name: "Bélgica", limit: "2026-07-18T10:50:00", isSprint: false, round: 10 },
    { id: 'r11', name: "Hungría", limit: "2026-07-25T10:50:00", isSprint: false, round: 11 },
    { id: 'r12_s', name: "Países Bajos Sprint", limit: "2026-08-21T14:20:00", isSprint: true, round: 12 },
    { id: 'r12', name: "Países Bajos", limit: "2026-08-22T10:50:00", isSprint: false, round: 12 },
    { id: 'r13', name: "Italia", limit: "2026-09-05T10:50:00", isSprint: false, round: 13 },
    { id: 'r14', name: "Madrid", limit: "2026-09-12T10:50:00", isSprint: false, round: 14 },
    { id: 'r15', name: "Azerbaiyán", limit: "2026-09-25T10:50:00", isSprint: false, round: 15 },
    { id: 'r16_s', name: "Singapur Sprint", limit: "2026-10-09T14:20:00", isSprint: true, round: 16 },
    { id: 'r16', name: "Singapur", limit: "2026-10-10T10:50:00", isSprint: false, round: 16 },
    { id: 'r17', name: "Estados Unidos", limit: "2026-10-24T18:50:00", isSprint: false, round: 17 },
    { id: 'r18', name: "México", limit: "2026-10-31T17:50:00", isSprint: false, round: 18 },
    { id: 'r19', name: "Brasil", limit: "2026-11-07T14:50:00", isSprint: false, round: 19 },
    { id: 'r20', name: "Las Vegas", limit: "2026-11-20T22:50:00", isSprint: false, round: 20 },
    { id: 'r21', name: "Qatar", limit: "2026-11-28T14:50:00", isSprint: false, round: 21 },
    { id: 'r22', name: "Abu Dhabi", limit: "2026-12-05T14:50:00", isSprint: false, round: 22 }
];

// --- Default players (used only on first-ever run to seed the DB) ---
const DEFAULT_PLAYERS = [
    { id: 'p1', name: 'Tomi', totalPts: 16, basePts: 16 },
    { id: 'p2', name: 'Juan', totalPts: 44, basePts: 44 },
    { id: 'p3', name: 'Bati', totalPts: 32, basePts: 32 },
    { id: 'p4', name: 'Capde', totalPts: 28, basePts: 28 },
    { id: 'p5', name: 'Jota', totalPts: 28, basePts: 28 }
];

// --- In-memory state (always synced from Firebase) ---
let players = DEFAULT_PLAYERS.map(p => ({ ...p }));
let predictionsDb = {};
let currentPlayerId = localStorage.getItem('f1_currentPlayer') || 'p1';

// -------------------------------------------------------
// Firebase helpers
// -------------------------------------------------------

function isFirebaseReady() {
    return !!db;
}

async function initFromFirebase() {
    if (!isFirebaseReady()) {
        // Fallback: use localStorage if Firebase not configured
        players = JSON.parse(localStorage.getItem('f1_players')) || DEFAULT_PLAYERS.map(p => ({ ...p }));
        predictionsDb = JSON.parse(localStorage.getItem('f1_predictions')) || {};
        updateLeaderboardUI();
        return;
    }

    // Seed players if they don't exist yet in the DB
    const playersSnap = await get(ref(db, 'players'));
    if (!playersSnap.exists()) {
        const initialPlayers = {};
        DEFAULT_PLAYERS.forEach(p => { initialPlayers[p.id] = p; });
        await set(ref(db, 'players'), initialPlayers);
    }

    // Listen for real-time updates on the entire game state
    onValue(ref(db, '/'), (snapshot) => {
        const data = snapshot.val() || {};
        players = data.players ? Object.values(data.players) : DEFAULT_PLAYERS.map(p => ({ ...p }));
        predictionsDb = data.predictions || {};
        updateLeaderboardUI();
    });
}

async function savePrediction(raceId, predictionData) {
    if (!isFirebaseReady()) {
        // Fallback localStorage
        if (!predictionsDb[raceId]) predictionsDb[raceId] = {};
        predictionsDb[raceId][currentPlayerId] = predictionData;
        localStorage.setItem('f1_predictions', JSON.stringify(predictionsDb));
        localStorage.setItem('f1_players', JSON.stringify(players));
        updateLeaderboardUI();
        return;
    }
    await set(ref(db, `predictions/${raceId}/${currentPlayerId}`), predictionData);
}

function calculatePoints(prediction, results, isSprint) {
    let pts = 0;
    if (!prediction || !results) return pts;
    const rules = isSprint ? SPRINT_RULES : NORMAL_RULES;
    if (prediction.pole === results.pole) pts += rules.pole;
    if (prediction.pos1 === results.pos1) pts += rules.exact_1_11;
    if (prediction.pos2 === results.pos2) pts += rules.exact_2_12;
    if (prediction.pos3 === results.pos3) pts += rules.exact_3_13;
    if (prediction.pos11 === results.pos11) pts += rules.exact_1_11;
    if (prediction.pos12 === results.pos12) pts += rules.exact_2_12;
    if (prediction.pos13 === results.pos13) pts += rules.exact_3_13;
    if (prediction.last === results.last) pts += rules.last;
    return pts;
}

async function processRaceResults(raceId, officialResults) {
    if (isFirebaseReady()) {
        // Save official results to Firebase
        await set(ref(db, `results/${raceId}`), officialResults);

        // Read all data fresh
        const snap = await get(ref(db, '/'));
        const data = snap.val() || {};
        const allPredictions = data.predictions || {};
        const allResults = data.results || {};
        const currentPlayers = data.players ? Object.values(data.players) : players;

        // Recalculate total points for every player from all races
        const updatedPlayers = {};
        currentPlayers.forEach(p => {
            let total = p.basePts || 0;
            Object.keys(allResults).forEach(rid => {
                const raceMeta = CALENDAR.find(r => r.id === rid);
                const isSprint = raceMeta ? raceMeta.isSprint : false;
                const pred = allPredictions[rid] && allPredictions[rid][p.id];
                if (pred) total += calculatePoints(pred, allResults[rid], isSprint);
            });
            updatedPlayers[p.id] = { ...p, totalPts: total };
        });

        await update(ref(db, 'players'), updatedPlayers);
    } else {
        // localStorage fallback
        const raceMeta = CALENDAR.find(r => r.id === raceId);
        const isSprint = raceMeta ? raceMeta.isSprint : false;
        const racePredictions = predictionsDb[raceId] || {};
        players.forEach(p => {
            p.totalPts = p.basePts || 0;
            if (racePredictions[p.id]) {
                p.totalPts += calculatePoints(racePredictions[p.id], officialResults, isSprint);
            }
        });
        localStorage.setItem('f1_players', JSON.stringify(players));
        updateLeaderboardUI();
    }
}

function updateLeaderboardUI() {
    const container = document.querySelector('.leaderboard-container');
    if (!container) return;
    container.innerHTML = '';

    const sorted = [...players].sort((a, b) => b.totalPts - a.totalPts);
    const nextRace = CALENDAR.find(r => new Date(r.limit) > new Date()) || CALENDAR[0];

    sorted.forEach((player, index) => {
        const pos = index + 1;
        const card = document.createElement('div');
        card.className = `leaderboard-card pos-${pos}`;

        const hasVoted = predictionsDb[nextRace.id] && predictionsDb[nextRace.id][player.id];

        card.innerHTML = `
            <div class="pos-badge shadow-lg">${pos}</div>
            <div class="player-info">
                <div>
                    <h3 class="font-headline font-bold text-lg text-on-surface">${player.name}</h3>
                    <p class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">${hasVoted ? '✓ Voto registrado' : 'PENDIENTE'}</p>
                </div>
                <span class="pts font-headline font-black italic text-2xl text-primary">${player.totalPts} <span class="text-[10px] not-italic text-on-surface-variant">PTS</span></span>
            </div>
        `;
        container.appendChild(card);
    });
}

function loadMyPredictions(raceId) {
    return predictionsDb[raceId] ? predictionsDb[raceId][currentPlayerId] : null;
}

async function resetAllData() {
    if (isFirebaseReady()) {
        const initialPlayers = {};
        DEFAULT_PLAYERS.forEach(p => { initialPlayers[p.id] = { ...p }; });
        await set(ref(db, 'players'), initialPlayers);
        await set(ref(db, 'predictions'), null);
    }
    localStorage.removeItem('f1_players');
    localStorage.removeItem('f1_currentPlayer');
    localStorage.removeItem('f1_predictions');
    window.location.reload();
}

// -------------------------------------------------------
// Public API (same interface as before so app.js works)
// -------------------------------------------------------
window.F1Logic = {
    CALENDAR,
    get players() { return players; },
    calculatePoints,
    savePrediction,
    processRaceResults,
    updateLeaderboardUI,
    loadMyPredictions,
    resetAllData,
    setCurrentPlayer: (id) => {
        currentPlayerId = id;
        localStorage.setItem('f1_currentPlayer', id);
    },
    getCurrentPlayer: () => currentPlayerId
};

// Boot
initFromFirebase();
