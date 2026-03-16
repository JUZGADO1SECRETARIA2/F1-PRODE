// Logic for F1 Prode points calculation and state management

// --- Rules ---
const NORMAL_RULES = {
    exact_1_11: 25,
    exact_2_12: 18,
    exact_3_13: 15,
    pole: 5,
    last: 10
};

const SPRINT_RULES = {
    exact_1_11: 8,
    exact_2_12: 7,
    exact_3_13: 6,
    pole: 2,
    last: 3
};

// --- Calendar ---
const CALENDAR = [
    { id: 'aus', name: "Australia", limit: "2026-03-07T01:50:00", isSprint: false },
    { id: 'chn_s', name: "China Sprint", limit: "2026-03-13T04:20:00", isSprint: true },
    { id: 'chn', name: "China", limit: "2026-03-14T03:50:00", isSprint: false },
    { id: 'r1', name: "Japón", limit: "2026-03-28T02:50:00", isSprint: false },
    { id: 'r2', name: "Bahréin", limit: "2026-04-11T12:50:00", isSprint: false },
    { id: 'r3', name: "Arabia Saudita", limit: "2026-04-18T13:50:00", isSprint: false },
    { id: 'r4', name: "Miami Sprint", limit: "2026-05-01T17:20:00", isSprint: true },
    { id: 'r5', name: "Miami", limit: "2026-05-02T16:50:00", isSprint: false },
    { id: 'r6', name: "Canadá Sprint", limit: "2026-05-22T17:20:00", isSprint: true },
    { id: 'r7', name: "Canadá", limit: "2026-05-23T16:50:00", isSprint: false },
    { id: 'r8', name: "Mónaco", limit: "2026-06-06T10:50:00", isSprint: false },
    { id: 'r9', name: "Barcelona", limit: "2026-06-13T10:50:00", isSprint: false },
    { id: 'r10', name: "Austria", limit: "2026-06-27T10:50:00", isSprint: false },
    { id: 'r11', name: "Silverstone Sprint", limit: "2026-07-03T12:20:00", isSprint: true },
    { id: 'r12', name: "Silverstone", limit: "2026-07-04T11:50:00", isSprint: false },
    { id: 'r13', name: "Spa", limit: "2026-07-18T10:50:00", isSprint: false },
    { id: 'r14', name: "Hungría", limit: "2026-07-25T10:50:00", isSprint: false },
    { id: 'r15', name: "Holanda Sprint", limit: "2026-08-21T11:20:00", isSprint: true },
    { id: 'r16', name: "Holanda", limit: "2026-08-22T10:50:00", isSprint: false },
    { id: 'r17', name: "Monza", limit: "2026-09-05T10:50:00", isSprint: false },
    { id: 'r18', name: "Madrid", limit: "2026-09-12T10:50:00", isSprint: false },
    { id: 'r19', name: "Baku", limit: "2026-09-25T08:50:00", isSprint: false },
    { id: 'r20', name: "Singapur Sprint", limit: "2026-10-09T09:20:00", isSprint: true },
    { id: 'r21', name: "Singapur", limit: "2026-10-10T09:50:00", isSprint: false },
    { id: 'r22', name: "Austin", limit: "2026-10-24T17:50:00", isSprint: false },
    { id: 'r23', name: "México", limit: "2026-10-31T17:50:00", isSprint: false },
    { id: 'r24', name: "Brasil", limit: "2026-11-07T14:50:00", isSprint: false },
    { id: 'r25', name: "Las Vegas", limit: "2026-11-21T00:50:00", isSprint: false },
    { id: 'r26', name: "Catar", limit: "2026-11-28T14:50:00", isSprint: false },
    { id: 'r27', name: "Abu Dhabi", limit: "2026-12-05T10:50:00", isSprint: false }
];

// --- Data persistence LocalStorage Mock ---
// Si hay datos locales, los usamos. Sino, arrancamos con los puntos base de la imagen.
let players = JSON.parse(localStorage.getItem('f1_players')) || [
    { id: 'p1', name: 'Tomi', totalPts: 16, basePts: 16 },
    { id: 'p2', name: 'Juan', totalPts: 44, basePts: 44 },
    { id: 'p3', name: 'Bati', totalPts: 32, basePts: 32 },
    { id: 'p4', name: 'Capde', totalPts: 28, basePts: 28 },
    { id: 'p5', name: 'Jota', totalPts: 28, basePts: 28 }
];

// Asegurarnos de que tengan basePts incluso si cargaron del localStorage antes
players.forEach(p => {
    if (p.basePts === undefined) {
        if (p.id === 'p1') p.basePts = 16;
        if (p.id === 'p2') p.basePts = 44;
        if (p.id === 'p3') p.basePts = 32;
        if (p.id === 'p4') p.basePts = 28;
        if (p.id === 'p5') p.basePts = 28;
        // Initialize total pts just in case
        if (!p.totalPts) p.totalPts = p.basePts;
    }
});

let currentPlayerId = localStorage.getItem('f1_currentPlayer') || 'p1';

let predictionsDb = JSON.parse(localStorage.getItem('f1_predictions')) || {
    'race_1': {} // Bahréin
};

/**
 * Saves state to local storage to persist between reloads
 */
function saveState() {
    localStorage.setItem('f1_players', JSON.stringify(players));
    localStorage.setItem('f1_currentPlayer', currentPlayerId);
    localStorage.setItem('f1_predictions', JSON.stringify(predictionsDb));
}

/**
 * Calculates raw points for a single player's prediction against official results
 */
function calculatePoints(prediction, results, isSprint) {
    let pts = 0;
    if (!prediction || !results) return pts;

    const rules = isSprint ? SPRINT_RULES : NORMAL_RULES;

    // Pole
    if (prediction.pole && prediction.pole === results.pole) pts += rules.pole;

    // Podiums
    if (prediction.pos1 && prediction.pos1 === results.pos1) pts += rules.exact_1_11;
    if (prediction.pos2 && prediction.pos2 === results.pos2) pts += rules.exact_2_12;
    if (prediction.pos3 && prediction.pos3 === results.pos3) pts += rules.exact_3_13;

    // Mid-pack
    if (prediction.pos11 && prediction.pos11 === results.pos11) pts += rules.exact_1_11;
    if (prediction.pos12 && prediction.pos12 === results.pos12) pts += rules.exact_2_12;
    if (prediction.pos13 && prediction.pos13 === results.pos13) pts += rules.exact_3_13;

    // Last
    if (prediction.last && prediction.last === results.last) pts += rules.last;

    return pts;
}

/**
 * Simulates saving a prediction for the current player
 */
function savePrediction(raceId, predictionData) {
    if (!predictionsDb[raceId]) predictionsDb[raceId] = {};
    predictionsDb[raceId][currentPlayerId] = predictionData;
    saveState();
    console.log("Predicción guardada:", predictionData);
}

/**
 * Triggers the end of race exact calculation for all players
 */
function processRaceResults(raceId, officialResults) {
    const racePredictions = predictionsDb[raceId];
    if (!racePredictions) return;

    const raceMeta = CALENDAR.find(r => r.id === raceId);
    const isSprint = raceMeta ? raceMeta.isSprint : false;

    // Initialize points if missing
    players.forEach(p => { if (typeof p.totalPts !== 'number') p.totalPts = 0; });

    // Reset back to base points
    players.forEach(p => p.totalPts = p.basePts || 0);

    // Sum points for the given race
    Object.keys(racePredictions).forEach(playerId => {
        const player = players.find(p => p.id === playerId);
        if (player) {
            const pPred = racePredictions[playerId];
            const earned = calculatePoints(pPred, officialResults, isSprint);
            player.totalPts += earned;
        }
    });

    saveState();
    updateLeaderboardUI();
}

/**
 * Updates DOM to show sorted leaderboard
 */
function updateLeaderboardUI() {
    const container = document.querySelector('.leaderboard-container');
    if (!container) return;
    container.innerHTML = '';

    // Sort by points descending
    const sorted = [...players].sort((a, b) => b.totalPts - a.totalPts);

    sorted.forEach((player, index) => {
        const pos = index + 1;
        const card = document.createElement('div');
        card.className = `leaderboard-card pos-${pos}`;

        // Add highlighted badge for top 3
        let badgeClass = pos <= 3 ? `pos-badge` : 'pos-badge';

        card.innerHTML = `
            <div class="${badgeClass}">${pos}</div>
            <div class="player-info">
                <h3>${player.name}</h3>
                <span class="pts">${player.totalPts} pts</span>
            </div>
            <!-- Indicator if they voted -->
            <div style="font-size: 10px; color: ${(predictionsDb['r1'] && predictionsDb['r1'][player.id]) ? 'var(--gold)' : '#555'}" title="Voto registrado o no para Próxima Carrera">
                <i class="fa-solid fa-check"></i>
            </div>
        `;
        container.appendChild(card);
    });
}

function resetAllData() {
    localStorage.removeItem('f1_players');
    localStorage.removeItem('f1_currentPlayer');
    localStorage.removeItem('f1_predictions');
    window.location.reload();
}

function loadMyPredictions(raceId) {
    const p = predictionsDb[raceId] ? predictionsDb[raceId][currentPlayerId] : null;
    return p;
}

// Export functions to window if modules are not used
window.F1Logic = {
    NORMAL_RULES,
    SPRINT_RULES,
    CALENDAR,
    players,
    calculatePoints,
    savePrediction,
    processRaceResults,
    updateLeaderboardUI,
    loadMyPredictions,
    resetAllData,
    setCurrentPlayer: (id) => {
        currentPlayerId = id;
        saveState();
    },
    getCurrentPlayer: () => currentPlayerId
};
