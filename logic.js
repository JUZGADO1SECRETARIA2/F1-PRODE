// Logic for F1 Prode points calculation and state management

// --- Rules ---
const RULES = {
    exact_1_11: 25,
    exact_2_12: 18,
    exact_3_13: 15,
    pole: 5,
    last: 10
};

// --- Data persistence LocalStorage Mock ---
let players = JSON.parse(localStorage.getItem('f1_players')) || [
    { id: 'p1', name: 'Tomás', totalPts: 0 },
    { id: 'p2', name: 'Jugador 2', totalPts: 0 },
    { id: 'p3', name: 'Jugador 3', totalPts: 0 },
    { id: 'p4', name: 'Jugador 4', totalPts: 0 },
    { id: 'p5', name: 'Jugador 5', totalPts: 0 }
];

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
function calculatePoints(prediction, results) {
    let pts = 0;
    if (!prediction || !results) return pts;

    // Pole
    if (prediction.pole && prediction.pole === results.pole) pts += RULES.pole;

    // Podiums
    if (prediction.pos1 && prediction.pos1 === results.pos1) pts += RULES.exact_1_11;
    if (prediction.pos2 && prediction.pos2 === results.pos2) pts += RULES.exact_2_12;
    if (prediction.pos3 && prediction.pos3 === results.pos3) pts += RULES.exact_3_13;

    // Mid-pack
    if (prediction.pos11 && prediction.pos11 === results.pos11) pts += RULES.exact_1_11;
    if (prediction.pos12 && prediction.pos12 === results.pos12) pts += RULES.exact_2_12;
    if (prediction.pos13 && prediction.pos13 === results.pos13) pts += RULES.exact_3_13;

    // Last
    if (prediction.last && prediction.last === results.last) pts += RULES.last;

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

    // Reset points before calculating to avoid doubling on repeat taps
    players.forEach(p => p.totalPts = 0);

    // For each player that predicted, calculate and add points
    players.forEach(player => {
        const pPred = racePredictions[player.id];
        if (pPred) {
            const earned = calculatePoints(pPred, officialResults);
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
            <div style="font-size: 10px; color: ${predictionsDb['race_1'] && predictionsDb['race_1'][player.id] ? 'var(--gold)' : '#555'}">
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
    RULES,
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
