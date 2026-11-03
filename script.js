// --- VARIABLEN ---
let activeItem = null; 
let isGodMode = false;
let currentGodSuggestion = null;
let zoomLevel = 1.0;
let initialPinchDistance = null;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let centerX, centerY;
const focalLength = 700; 
const baseWindSpeed = 1.5; 
let isLandscape = false;

let history = []; 
let redoStack = [];
let isPaused = false;
const MAX_ACTIVE_ITEMS = 9; 

let coherenceScore = 50;
let currentChallengeItem = null;
let currentPlayer = "Du";
let allPlayersData = {}; 
const DB_KEY = 'gwl_multiplayer_db_v1';
let particles = []; 

const entities = [
    { id: 'e1', x: 0, y: 0, color: '#4da6ff', vx: 0, vy: 0 }, 
    { id: 'e2', x: 0, y: 0, color: '#ff4d4d', vx: 0, vy: 0 }, 
    { id: 'e3', x: 0, y: 0, color: '#ffcc00', vx: 0, vy: 0 }, 
    { id: 'e4', x: 0, y: 0, color: '#9b30ff', vx: 0, vy: 0 }, 
    { id: 'e5', x: 0, y: 0, color: '#00ff64', vx: 0, vy: 0 }  
];

let time = 0;
let width, height;

const canvas = document.getElementById('gwlCanvas');
const ctx = canvas.getContext('2d');

const introOverlay = document.getElementById('intro-overlay');
const nameModal = document.getElementById('name-modal');
const nameInput = document.getElementById('player-name-input');
const playerDisplay = document.getElementById('current-player-display');
const uiPanel = document.getElementById('rating-panel');
const uiText = document.getElementById('selected-text');
const kiPanel = document.getElementById('ki-panel');
const kiText = document.getElementById('ki-text');
const tableModal = document.getElementById('table-modal');
const tableBody = document.getElementById('table-body');
const statsBody = document.getElementById('stats-body');
const scoreValueEl = document.getElementById('score-value');
const scoreBarEl = document.getElementById('score-bar');

const btns = {
    0: document.getElementById('btn-like'),
    1: document.getElementById('btn-dislike'),
    2: document.getElementById('btn-unsure'),
    3: document.getElementById('btn-neutral')
};

const ratingIcons = { 0: "👍", 1: "👎", 2: "❓", 3: "➖" };
const ratingColors = { 0: "#00ff64", 1: "#ff4d4d", 2: "#ffcc00", 3: "#888888" };

const semanticGraph = {
    "Liebe": { allies: ["Verbindung", "Geist", "Materie", "Nähe"], enemies: ["Hass", "Gleichgültigkeit"] },
    "Wille": { allies: ["Schaffen", "Freiheit", "Materie", "Macht", "Kraft", "Stärke", "Intelligenz"], enemies: ["Zufall", "Chaos"] },
    "Geist": { allies: ["Alles", "Freiheit", "Zahl", "Form", "Weisheit", "Intelligenz"], enemies: ["Chaos", "Zufall"] },
    "Chaos": { allies: ["Zufall", "Auflösung"], enemies: ["Geist", "Wille", "Ordnung"] },
    "Materie": { allies: ["Werk", "Form", "Nähe"], enemies: ["Auflösung", "Chaos"] },
    "Macht": { allies: ["Wille", "Fokus"], enemies: ["Ohnmacht"] },
    "Kraft": { allies: ["Wille", "Schaffen"], enemies: ["Schwäche"] },
    "Stärke": { allies: ["Wille", "Liebe"], enemies: ["Zweifel"] },
    "Weisheit": { allies: ["Geist", "Liebe"], enemies: ["Dummheit"] },
    "Intelligenz": { allies: ["Geist", "Wille"], enemies: ["Dummheit", "Chaos"] },
    "Freude": { allies: ["Liebe", "Geist"], enemies: ["Trauer"] }
};

const statements = [
    { text: "Geist ⟹ Alles", color: "#ffffff", size: 22, weight: 2 },
    { text: "Wille = Zentrum", color: "#ff4d4d", size: 24, weight: 2 },
    { text: "Liebe ⋈ Verbindung", color: "#4da6ff", size: 20, weight: 2 },
    { text: "Wille → Schaffen", color: "#ff4d4d", size: 18, weight: 1 },
    { text: "Zufall ≠ Wille", color: "#ff4d4d", size: 18, weight: 1 },
    { text: "Materie ⊣ Geist", color: "#888888", size: 18, weight: 1 },
    { text: "Geist + Wille = Freiheit", color: "#ffffff", size: 18, weight: 1 },
    { text: "Liebe ⋈ Geist = Weisheit", color: "#4da6ff", size: 18, weight: 1 },
    { text: "Wille - Liebe = Macht", color: "#ff4d4d", size: 18, weight: 1 },
    { text: "Hass = -Liebe", color: "#4da6ff", size: 18, weight: 1 },
    { text: "Gleichgültigkeit = 0 Liebe", color: "#4da6ff", size: 18, weight: 1 },
    { text: "Angst ∈ Hass", color: "#9b30ff", size: 18, weight: 1 },
    { text: "Chaos = ¬Geist", color: "#9b30ff", size: 18, weight: 1 },
    { text: "Wahrheit = Geist ⋈ Zahl", color: "#ffffff", size: 18, weight: 1 },
    { text: "Konsens = Hel ⋈ KI", color: "#ffcc00", size: 18, weight: 1 },
    { text: "Wille schafft", color: "#ff4d4d", size: 20, weight: 1 },
    { text: "ES IST", color: "#ffcc00", size: 28, weight: 3 },
    { text: "Ich bin", color: "#ffcc00", size: 28, weight: 3 },
    { text: "Macht ⊂ Wille (männlich)", color: "#ff4d4d", size: 18, weight: 1 },
    { text: "Kraft ⊂ Wille (neutrum)", color: "#ffffff", size: 18, weight: 1 },
    { text: "Stärke ⊂ Wille (weiblich)", color: "#4da6ff", size: 18, weight: 1 },
    { text: "Wille = Macht + Kraft + Stärke", color: "#ffcc00", size: 20, weight: 2 },
    { text: "Die Zahl ist das Gesetz des Geistes", color: "#ffffff", size: 18, weight: 1 },
    { text: "Weisheit = Geist ⋈ Liebe", color: "#4da6ff", size: 20, weight: 2 },
    { text: "Intelligenz = Wille ⊂ Geist", color: "#ff4d4d", size: 18, weight: 1 },
    { text: "Freude = Spiegel(Liebe, Geist)", color: "#4da6ff", size: 18, weight: 1 },
    { text: "Wille x Geist = Intelligenz", color: "#ffcc00", size: 20, weight: 2 }
];

let items = [];

function initGame() {
    activeItem = null;
    currentChallengeItem = null;
    particles = [];
    items = statements.map((s, index) => {
        const startX = (Math.random() - 0.5) * (width * 0.8);
        const startY = (Math.random() - 0.5) * (height * 0.8);
        return {
            ...s, id: index, stateIndex: 3, isSelected: false, isActive: false, opacity: 0,      
            x: startX, baseY: startY, z: Math.random() * 400 - 100, 
            targetX: startX, targetY: startY, isMovingToTarget: false,
            waveAmplitude: 20 + Math.random() * 50, waveFrequency: 0.002 + Math.random() * 0.005, 
            waveSpeed: 1 + Math.random() * 2, phaseShift: Math.random() * Math.PI * 2, 
            rotationBase: (Math.random() - 0.5) * 0.15,
            screenX: -1000, screenY: -1000, screenWidth: 0,
            physicsVx: 0, physicsVy: 0
        };
    });

    items.sort(() => Math.random() - 0.5);
    for (let i = 0; i < MAX_ACTIVE_ITEMS; i++) {
        if (items[i]) items[i].isActive = true;
    }

    entities.forEach(e => {
        e.x = (Math.random() - 0.5) * width;
        e.y = (Math.random() - 0.5) * height;
    });
}

function resize() {
    width = canvas.width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    height = canvas.height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    isLandscape = width > height;
    if (activeItem) updateUI();
}
window.addEventListener('resize', resize);

function startPlayerTurn() {
    requestFullscreenMode(); 
    
    let rawName = nameInput.value.trim();
    currentPlayer = rawName === "" ? "Du" : rawName;
    
    nameModal.classList.remove('active');
    playerDisplay.innerText = `Spieler: ${currentPlayer}`;
    
    loadDatabase(); 
    coherenceScore = 50;
    updateScoreUI();
    stopAll(); 
    
    items.forEach(item => {
        if (item.text.includes("Konsens")) {
            item.text = `Konsens = ${currentPlayer} ⋈ KI`;
        }
    });
    
    const playerCount = Object.keys(allPlayersData).length;
    kiText.innerText = `Willkommen, ${currentPlayer}. Du bist der ${playerCount}. Spieler in diesem Universum. Jede deiner Bewertungen verbindet sich mit den Meinungen der Mitspieler im Raum. Jede Meinung wird ein Teil unserer Wahrheit.`;
    kiPanel.classList.add('active');
    setTimeout(() => { kiPanel.classList.remove('active'); }, 12000);
}

function switchPlayer() {
    document.getElementById('endgame-modal').classList.remove('active');
    document.getElementById('table-modal').classList.remove('active');
    document.getElementById('info-modal').classList.remove('active');
    document.getElementById('compendium-modal').classList.remove('active');
    
    nameInput.value = "";
    document.getElementById('name-modal-title').innerText = "Nächster Spieler?";
    nameModal.classList.add('active');
}

function requestFullscreenMode() {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(err => console.log("Fullscreen-Fehler:", err));
    } else if (docEl.webkitRequestFullscreen) { 
        docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) { 
        docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) { 
        docEl.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function toggleGodMode() {
    isGodMode = !isGodMode;
    
    const godBtn = document.getElementById('btn-god-mode');
    if (godBtn) {
        if (isGodMode) {
            godBtn.classList.remove('dimmed');
            godBtn.classList.add('active');
        } else {
            godBtn.classList.remove('active');
            godBtn.classList.add('dimmed');
        }
    }
    
    const normalButtons = document.getElementById('normal-buttons');
    const godButtons = document.getElementById('god-buttons');
    
    if (isGodMode) {
        normalButtons.style.display = 'none';
        godButtons.style.display = 'flex';
        document.getElementById('selected-text').innerText = "👑 GOTT-MODUS: Prüfe die Aussage";
        kiText.innerText = "Der Gott-Modus ist aktiv. Wähle eine Aussage und prüfe sie auf Fehler.";
        kiPanel.classList.add('active');
        setTimeout(() => { kiPanel.classList.remove('active'); }, 4000);
    } else {
        normalButtons.style.display = 'flex';
        godButtons.style.display = 'none';
        document.getElementById('selected-text').innerText = "Aussage auswählen...";
        kiText.innerText = "Zurück im normalen Modus. Bewerte die Aussagen.";
        kiPanel.classList.add('active');
        setTimeout(() => { kiPanel.classList.remove('active'); }, 4000);
    }
}

function godReject(reason) {
    if (!activeItem) return;

    let originalText = activeItem.text;
    let newText = originalText;
    let explanation = "";

    if (reason === 'falsch') {
        if (originalText.includes(" = ")) { newText = originalText.replace(" = ", " ≠ "); }
        else if (originalText.includes(" ≠ ")) { newText = originalText.replace(" ≠ ", " = "); }
        else { newText = "Nicht (" + originalText + ")"; }
        explanation = "Ich habe den Operator invertiert.";
    } else if (reason === 'unpassend') {
        newText = originalText + " (Kontext prüfen)";
        explanation = "Ich schlage eine kontextuelle Anpassung vor.";
    } else if (reason === 'kollision') {
        newText = originalText + " (auf höherer Ebene)";
        explanation = "Ich habe eine Zwischenebene eingefügt.";
    }

    kiText.innerText = `KI: Du weist "${originalText}" zurück. ${explanation} Vorschlag: "${newText}"`;
    kiPanel.classList.add('active');
    
    currentGodSuggestion = newText;
}

function acceptGodSuggestion() {
    if (!activeItem || !currentGodSuggestion) {
        kiText.innerText = "Es gibt noch keinen Vorschlag. Bitte weise die Aussage zuerst zurück (❌, 🧩 oder 🪜).";
        kiPanel.classList.add('active');
        setTimeout(() => { kiPanel.classList.remove('active'); }, 4000);
        return;
    }

    if (!activeItem.originalGodText) {
        activeItem.originalGodText = activeItem.text;
    }

    activeItem.text = currentGodSuggestion;
    activeItem.stateIndex = 0; 
    activeItem.isActive = false;
    activeItem.opacity = 0; 
    
    kiText.innerText = `Vorschlag angenommen! Die Aussage heißt jetzt: "${currentGodSuggestion}".`;
    kiPanel.classList.add('active');
    setTimeout(() => { kiPanel.classList.remove('active'); }, 5000);
    
    currentGodSuggestion = null; 
    updateScoreUI();
    selectItem(null); 
}

function undoGodSuggestion() {
    if (!activeItem || !activeItem.originalGodText) {
        kiText.innerText = "Es gibt keinen Vorschlag, der rückgängig gemacht werden kann.";
        kiPanel.classList.add('active');
        setTimeout(() => { kiPanel.classList.remove('active'); }, 4000);
        return;
    }

    activeItem.text = activeItem.originalGodText;
    activeItem.stateIndex = 3; 
    activeItem.isActive = true;
    activeItem.opacity = 1; 
    
    kiText.innerText = `Rückgängig gemacht! Die Aussage heißt wieder: "${activeItem.text}".`;
    kiPanel.classList.add('active');
    setTimeout(() => { kiPanel.classList.remove('active'); }, 5000);
    
    activeItem.originalGodText = undefined;
    updateScoreUI();
    selectItem(null);
}

function loadDatabase() {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
        try { allPlayersData = JSON.parse(saved); } catch (e) { allPlayersData = {}; }
    }
    if (!allPlayersData[currentPlayer]) {
        allPlayersData[currentPlayer] = [];
    }
    updateTableUI();
}

function saveDatabase() {
    localStorage.setItem(DB_KEY, JSON.stringify(allPlayersData));
    updateTableUI();
}

function updateTableUI() {
    const myData = allPlayersData[currentPlayer] || [];
    tableBody.innerHTML = '';
    const reversedDb = [...myData].reverse(); 
    
    reversedDb.forEach((entry) => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.title = 'Klicken, um diese Bewertung zu ändern';
        tr.onclick = () => changeOldRating(entry);

        const tdPlayer = document.createElement('td');
        tdPlayer.innerText = currentPlayer;
        tdPlayer.style.color = "#4da6ff";
        const tdText = document.createElement('td');
        tdText.innerText = entry.text;
        const tdRating = document.createElement('td');
        tdRating.innerText = ratingIcons[entry.rating];
        tdRating.style.color = ratingColors[entry.rating];
        tdRating.style.fontWeight = "bold";
        tdRating.style.fontSize = "16px";
        
        tr.appendChild(tdPlayer); tr.appendChild(tdText); tr.appendChild(tdRating);
        tableBody.appendChild(tr);
    });

    calculateStatistics(myData);
}

function changeOldRating(entry) {
    if (!allPlayersData[currentPlayer]) return;
    
    const dbIndex = allPlayersData[currentPlayer].findIndex(e => 
        e.itemId === entry.itemId && e.time === entry.time
    );
    
    if (dbIndex > -1) {
        allPlayersData[currentPlayer].splice(dbIndex, 1);
        saveDatabase();
        
        const item = items.find(i => i.id === entry.itemId);
        if (item) {
            item.stateIndex = 3; 
            item.isActive = true; 
            item.opacity = 0;
            item.previousRating = entry.rating;
            item.x = (Math.random() - 0.5) * (width * 0.8);
            item.baseY = (Math.random() - 0.5) * (height * 0.8);
        }
        
        toggleTable(); 
        
        kiText.innerText = `Bewertung für "${entry.text}" zurückgesetzt, ${currentPlayer}. Du kannst es nun neu bewerten.`;
        kiPanel.classList.add('active');
        setTimeout(() => { kiPanel.classList.remove('active'); }, 5000);
    }
}

function calculateStatistics(myData) {
    const stats = {};
    myData.forEach(entry => {
        if (!stats[entry.text]) stats[entry.text] = { text: entry.text, counts: {0:0, 1:0, 2:0, 3:0}, total: 0 };
        stats[entry.text].counts[entry.rating]++;
        stats[entry.text].total++;
    });

    const sortedStats = Object.values(stats).sort((a, b) => b.total - a.total);
    statsBody.innerHTML = '';
    
    if (sortedStats.length === 0) {
        statsBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#666; padding:20px;">Noch keine Bewertungen vorhanden.</td></tr>';
        return;
    }

    sortedStats.forEach(stat => {
        const tr = document.createElement('tr');
        const tdText = document.createElement('td');
        tdText.innerText = stat.text;
        tr.appendChild(tdText);

        for (let i = 0; i < 4; i++) {
            const td = document.createElement('td');
            td.className = 'stat-num';
            td.innerText = stat.counts[i] > 0 ? stat.counts[i] : '-';
            td.style.color = stat.counts[i] > 0 ? ratingColors[i] : '#333';
            tr.appendChild(td);
        }

        const tdTotal = document.createElement('td');
        tdTotal.className = 'stat-num stat-total';
        tdTotal.innerText = stat.total;
        tr.appendChild(tdTotal);
        statsBody.appendChild(tr);
    });
}

function toggleTable() { tableModal.classList.toggle('active'); }
function toggleInfo() { document.getElementById('info-modal').classList.toggle('active'); }
function toggleCompendium() { document.getElementById('compendium-modal').classList.toggle('active'); }

function clearDatabase() {
    if (confirm(`Möchtest du die Historie von ${currentPlayer} wirklich löschen?`)) {
        allPlayersData[currentPlayer] = []; 
        saveDatabase();
    }
}

function switchTab(tab) {
    document.getElementById('tab-history').classList.toggle('active', tab === 'history');
    document.getElementById('tab-stats').classList.toggle('active', tab === 'stats');
    document.getElementById('view-history').style.display = (tab === 'history') ? 'block' : 'none';
    document.getElementById('view-stats').style.display = (tab === 'stats') ? 'block' : 'none';
}

function showIntro() {
    introOverlay.classList.add('visible');
    setTimeout(() => { introOverlay.classList.remove('visible'); }, 6000);
}
setTimeout(showIntro, 500); 
setInterval(() => { if (Math.random() > 0.5) showIntro(); }, 40000);

function startAIChallenge() {
    if (currentChallengeItem) return; 

    const candidates = items.filter(i => i.isActive && i.stateIndex === 3);
    if (candidates.length === 0) {
        kiText.innerText = `Keine Aussagen mehr im Pool, ${currentPlayer}.`;
        kiPanel.classList.add('active');
        setTimeout(() => { kiPanel.classList.remove('active'); }, 5000);
        return;
    }

    const target = candidates[Math.floor(Math.random() * candidates.length)];
    currentChallengeItem = target;

    target.targetX = 0;
    target.targetY = 0;
    target.isMovingToTarget = true;
    target.isSelected = true; 
    
    items.forEach(i => i.isSelected = false);
    target.isSelected = true;
    activeItem = target;
    updateUI();

    kiText.innerText = `${currentPlayer}, ich lege dir diese Aussage vor: "${target.text}". Ist sie absolut wahr?`;
    kiPanel.classList.add('active');
}

function berechneGlobaleKohaerenz() {
    const myData = allPlayersData[currentPlayer] || [];
    if (myData.length === 0) return 50; 
    let score = 50;
    myData.forEach(entry => {
        for (const key in semanticGraph) {
            if (entry.text.includes(key)) {
                const node = semanticGraph[key];
                let isAlly = node.allies.some(a => entry.text.includes(a));
                let isEnemy = node.enemies.some(e => entry.text.includes(e));
                if (entry.rating === 0) { 
                    if (isAlly) score += 5;
                    if (isEnemy) score -= 5;
                } else if (entry.rating === 1) { 
                    if (isAlly) score -= 5; 
                    if (isEnemy) score += 5; 
                }
            }
        }
    });
    if (score < 0) score = 0;
    if (score > 100) score = 100;
    return score;
}

function updateScoreUI() {
    coherenceScore = berechneGlobaleKohaerenz();
    scoreValueEl.innerText = coherenceScore;
    scoreBarEl.style.width = coherenceScore + '%'; 
    if (coherenceScore < 30) scoreBarEl.style.background = '#ff4d4d';
    else if (coherenceScore > 70) scoreBarEl.style.background = '#00ff64';
    else scoreBarEl.style.background = 'linear-gradient(90deg, #ff4d4d, #ffcc00, #00ff64)';
}

function setRating(state) {
    if (!activeItem || !activeItem.isActive) return;
    
    const oldId = activeItem.id;
    const text = activeItem.text;
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dbEntry = { itemId: oldId, text: text, rating: state, time: timeString };
    
    if (!allPlayersData[currentPlayer]) allPlayersData[currentPlayer] = [];
    allPlayersData[currentPlayer].push(dbEntry);
    saveDatabase();
    updateScoreUI(); 

    entities.forEach(e => {
        particles.push({
            x: e.x, y: e.y,
            vx: (activeItem.x - e.x) * 0.05 + (Math.random() - 0.5) * 2,
            vy: (activeItem.baseY - e.y) * 0.05 + (Math.random() - 0.5) * 2,
            radius: 8 + Math.random() * 10,
            color: e.color,
            alpha: 0.8,
            decay: 0.03
        });
    });

    let wasChallenge = false;
    if (activeItem === currentChallengeItem) {
        wasChallenge = true;
        currentChallengeItem = null;
        
        if (state === 0) kiText.innerText = `Kohärenz gestärkt. Der Raum akzeptiert deine Wahrheit.`;
        else if (state === 1) kiText.innerText = `Kohärenz geschwächt. Du widersprichst dem Anschauungsraum.`;
        else kiText.innerText = `Neutralität. Der Raum bleibt unverändert.`;
        
        kiPanel.classList.add('active');
        setTimeout(() => { kiPanel.classList.remove('active'); }, 6000);
    } else {
        kiReaction(activeItem);
    }

    let newItem = items.find(i => !i.isActive && i.stateIndex === 3);
    let newId = newItem ? newItem.id : null;

    if (newItem) {
        newItem.isActive = true;
        newItem.opacity = 0; 
        newItem.x = (Math.random() - 0.5) * (width * 0.8);
        newItem.baseY = (Math.random() - 0.5) * (height * 0.8);
    } else {
        setTimeout(triggerEndgame, 1500); 
    }

    activeItem.stateIndex = state;
    activeItem.isActive = false; 
    activeItem.opacity = 0;
    activeItem.previousRating = undefined;
    activeItem.isSelected = false; 

    history.push({ oldId, newId, state, dbEntry, wasChallenge });
    redoStack = [];
    selectItem(null); 
}

function kiReaction(item) {
    if (history.length % 2 === 0 && history.length > 0 && !currentChallengeItem) { 
        let comment = "Bewertung notiert. Der Anschauungsraum verändert sich.";
        let foundNode = null;
        let foundNodeName = "";

        for (const key in semanticGraph) {
            if (item.text.includes(key)) { foundNodeName = key; foundNode = semanticGraph[key]; break; }
        }

        if (foundNode) {
            if (item.stateIndex === 0) { 
                const ally = foundNode.allies.find(a => item.text.includes(a)) || foundNode.allies[0];
                comment = `Du bejahst "${item.text}". Wenn ${foundNodeName} wahr ist, muss auch ${ally} wahr sein.`;
            } else if (item.stateIndex === 1) { 
                const enemy = foundNode.enemies.find(e => item.text.includes(e)) || foundNode.enemies[0];
                comment = `Du lehnst "${item.text}" ab. Bedenke: Wenn du ${foundNodeName} ablehnst, stärkst du ${enemy}.`;
            } else if (item.stateIndex === 2) { 
                comment = `Unsicherheit bei "${item.text}". Klug. Denn ${foundNodeName} steht im Spannungsfeld zwischen ${foundNode.allies[0]} und ${foundNode.enemies[0]}.`;
            } else {
                comment = `Neutralität. Wenn du dich nicht positionierst, entscheidet das Chaos für dich.`;
            }
        }
        
        kiText.innerText = "Die " + Object.keys(allPlayersData).length + " Mitspieler flüstern dir zu... " + comment;
        kiPanel.classList.add('active');
        setTimeout(() => { kiPanel.classList.remove('active'); }, 9000); 
    }
}

function undoRating() {
    if (history.length === 0) return;
    const lastAction = history.pop();
    const oldItem = items.find(i => i.id === lastAction.oldId);
    const newItem = lastAction.newId !== null ? items.find(i => i.id === lastAction.newId) : null;
    
    if (allPlayersData[currentPlayer]) {
        const dbIndex = allPlayersData[currentPlayer].findIndex(e => e.itemId === lastAction.oldId && e.rating === lastAction.state);
        if (dbIndex > -1) { allPlayersData[currentPlayer].splice(dbIndex, 1); saveDatabase(); }
    }
    updateScoreUI(); 
    if (oldItem) { oldItem.stateIndex = 3; oldItem.isActive = true; oldItem.opacity = 0; }
    if (newItem) { newItem.isActive = false; newItem.stateIndex = 3; }
    redoStack.push(lastAction);
    if (activeItem) updateUI();
}

function redoRating() {
    if (redoStack.length === 0) return;
    const action = redoStack.pop();
    const oldItem = items.find(i => i.id === action.oldId);
    const newItem = action.newId !== null ? items.find(i => i.id === action.newId) : null;
    
    if (action.dbEntry) { allPlayersData[currentPlayer].push(action.dbEntry); saveDatabase(); }
    updateScoreUI();
    if (oldItem) { oldItem.stateIndex = action.state; oldItem.isActive = false; }
    if (newItem) { newItem.isActive = true; newItem.opacity = 0; }
    history.push(action);
    if (activeItem) updateUI();
}

function stopAll() {
    history = []; redoStack = []; currentChallengeItem = null; particles = []; selectItem(null);
    items.forEach(item => {
        item.stateIndex = 3; item.isActive = false; item.opacity = 0; item.isSelected = false;
        item.physicsVx = 0; item.physicsVy = 0;
    });
    items.sort(() => Math.random() - 0.5);
    for (let i = 0; i < MAX_ACTIVE_ITEMS; i++) { if (items[i]) items[i].isActive = true; }
}

function updateUI() {
    if (activeItem) {
        uiPanel.classList.add('active');
        
        let displayText = activeItem.text.includes("Konsens") ? `Konsens = ${currentPlayer} ⋈ KI` : activeItem.text;
        uiText.innerText = displayText;
        uiText.style.color = activeItem.color;
        
        Object.values(btns).forEach(b => b.classList.remove('selected'));
        if (btns[activeItem.stateIndex]) btns[activeItem.stateIndex].classList.add('selected');
    } else {
        uiPanel.classList.remove('active');
    }
}

function selectItem(item) {
    items.forEach(i => i.isSelected = false);
    if (item) {
        item.isSelected = true;
        activeItem = item;
        item.z = 50; 
        
        items.sort((a, b) => {
            if (a.id === item.id) return 1;
            if (b.id === item.id) return -1;
            return b.z - a.z;
        });
        createColorBlob(item.x, item.baseY, item.color, 30);
    } else { activeItem = null; }
    updateUI();
}

function createColorBlob(x, y, color, size) {
    particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: size + Math.random() * 20,
        color: color,
        alpha: 0.6,
        decay: 0.02
    });
}

function updatePhysics() {
    if (!activeItem) {
        items.forEach(item => {
            if (!item.isSelected && item.isActive) {
                item.physicsVx *= 0.95; item.physicsVy *= 0.95;
            }
        });
        return;
    }

    let activeNode = null;
    for (const key in semanticGraph) {
        if (activeItem.text.includes(key)) { activeNode = semanticGraph[key]; break; }
    }
    if (!activeNode) return;

    items.forEach(item => {
