// --- VARIABLEN ---
let activeItem = null; 
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
    "Wille": { allies: ["Schaffen", "Freiheit", "Materie", "Macht", "Kraft", "Stärke"], enemies: ["Zufall", "Chaos"] },
    "Geist": { allies: ["Alles", "Freiheit", "Zahl", "Form", "Weisheit"], enemies: ["Chaos", "Zufall"] },
    "Chaos": { allies: ["Zufall", "Auflösung"], enemies: ["Geist", "Wille", "Ordnung"] },
    "Materie": { allies: ["Werk", "Form", "Nähe"], enemies: ["Auflösung", "Chaos"] },
    "Macht": { allies: ["Wille", "Fokus"], enemies: ["Ohnmacht"] },
    "Kraft": { allies: ["Wille", "Schaffen"], enemies: ["Schwäche"] },
    "Stärke": { allies: ["Wille", "Liebe"], enemies: ["Zweifel"] }
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
    { text: "Wille = Macht + Kraft + Stärke", color: "#ffcc00", size: 20, weight: 2 }
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
    let rawName = nameInput.value.trim();
    currentPlayer = rawName === "" ? "Du" : rawName;
    
    nameModal.classList.remove('active');
    playerDisplay.innerText = `Spieler: ${currentPlayer}`;
    
    loadDatabase(); 
    coherenceScore = 50;
    updateScore(0);
    stopAll(); 
    
    kiText.innerText = `Willkommen, ${currentPlayer}. Jede deiner Bewertungen verbindet sich mit den Meinungen der Entitäten im Raum. Jede Meinung wird ein Teil unserer Wahrheit.`;
    kiPanel.classList.add('active');
    setTimeout(() => { kiPanel.classList.remove('active'); }, 7000);
}

function switchPlayer() {
    nameInput.value = "";
    document.getElementById('name-modal-title').innerText = "Nächster Spieler?";
    nameModal.classList.add('active');
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

function updateScore(change) {
    coherenceScore += change;
    if (coherenceScore < 0) coherenceScore = 0;
    if (coherenceScore > 100) coherenceScore = 100;
    
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
        let scoreChange = (state === 0) ? 10 : ((state === 1) ? -10 : 0);
        updateScore(scoreChange);
        
        if (scoreChange > 0) kiText.innerText = `Kohärenz gestärkt (+${scoreChange}). Der Raum akzeptiert deine Wahrheit.`;
        else if (scoreChange < 0) kiText.innerText = `Kohärenz geschwächt (${scoreChange}). Du widersprichst dem Anschauungsraum.`;
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
    activeItem.isSelected = false; 

    history.push({ oldId, newId, state, dbEntry, wasChallenge });
    redoStack = [];
    selectItem(null); 
}

function kiReaction(item) {
    if (history.length % 2 === 0 && history.length > 0 && !currentChallengeItem) { 
        let comment = "Bewertung notiert. Derp Anschauungsraum verändert sich.";
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
        
        kiText.innerText = comment;
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
    if (lastAction.wasChallenge) updateScore(-10); 
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
    if (action.wasChallenge) updateScore(10);
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
        uiText.innerText = activeItem.text;
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
        
        // Karte ganz nach vorne holen (vor das UI)
        item.z = -900; 
        
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
        if (item === activeItem || !item.isActive) return;
        const dx = item.x - activeItem.x;
        const dy = item.baseY - activeItem.baseY;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 0) {
            const angle = Math.atan2(dy, dx);
            let isAlly = activeNode.allies.some(a => item.text.includes(a));
            let isEnemy = activeNode.enemies.some(e => item.text.includes(e));

            if (isAlly) {
                const force = (300 / dist) * 0.5; 
                item.physicsVx -= Math.cos(angle) * force;
                item.physicsVy -= Math.sin(angle) * force;
                if (Math.random() < 0.1) createColorBlob(item.x, item.baseY, item.color, 15);
            } else if (isEnemy) {
                const force = (300 / dist) * 1.5; 
                item.physicsVx += Math.cos(angle) * force;
                item.physicsVy += Math.sin(angle) * force;
                if (Math.random() < 0.2) createColorBlob(item.x, item.baseY, "#ff4d4d", 25);
            }
        }
    });
}

function updateEntities() {
    entities.forEach(e => {
        let closestItem = null;
        let minDist = Infinity;
        
        items.forEach(item => {
            if (item.isActive && item.opacity > 0.5) {
                const dist = Math.hypot(item.x - e.x, item.baseY - e.y);
                if (dist < minDist) { minDist = dist; closestItem = item; }
            }
        });

        if (closestItem && !activeItem) { 
            const dx = closestItem.x - e.x;
            const dy = closestItem.baseY - e.y;
            const angle = Math.atan2(dy, dx);
            e.vx += Math.cos(angle) * 0.1; 
            e.vy += Math.sin(angle) * 0.1;
        } else if (activeItem) {
            e.vx += (Math.random() - 0.5) * 0.5;
            e.vy += (Math.random() - 0.5) * 0.5;
        }

        e.vx *= 0.95; e.vy *= 0.95;
        e.x += e.vx; e.y += e.vy;
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.alpha -= p.decay; p.radius += 0.5;
        if (p.alpha <= 0) particles.splice(i, 1);
    }
}

function drawParticles() {
    particles.forEach(p => {
        ctx.beginPath();
        let gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = p.alpha;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;
}

function drawEntities() {
    entities.forEach(e => {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = e.color;
        ctx.fill();
        ctx.restore();
    });
}

function getAdjustedCoords(clientX, clientY) {
    centerX = width / 2; centerY = height / 2;
    return { x: (clientX - centerX) / zoomLevel + centerX, y: (clientY - centerY) / zoomLevel + centerY };
}

window.addEventListener('wheel', (e) => {
    e.preventDefault(); zoomLevel -= e.deltaY * 0.001; zoomLevel = Math.max(0.3, Math.min(4.0, zoomLevel));
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialPinchDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        activeItem = null; 
    } else if (e.touches.length === 1) {
        const coords = getAdjustedCoords(e.touches[0].clientX, e.touches[0].clientY);
        handlePointerDown(coords.x, coords.y);
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialPinchDistance) {
        e.preventDefault(); 
        const currentDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        zoomLevel = Math.max(0.3, Math.min(4.0, zoomLevel * (currentDistance / initialPinchDistance)));
        initialPinchDistance = currentDistance;
    } else if (e.touches.length === 1) {
        const coords = getAdjustedCoords(e.touches[0].clientX, e.touches[0].clientY);
        handlePointerMove(coords.x, coords.y);
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) initialPinchDistance = null;
    if (e.touches.length === 0) handlePointerUp();
});

canvas.addEventListener('mousedown', (e) => {
    const coords = getAdjustedCoords(e.clientX, e.clientY); handlePointerDown(coords.x, coords.y);
});
canvas.addEventListener('mousemove', (e) => {
    const coords = getAdjustedCoords(e.clientX, e.clientY); handlePointerMove(coords.x, coords.y);
});
canvas.addEventListener('mouseup', () => { handlePointerUp(); });

function handlePointerDown(x, y) {
    let clickedOnItem = false;
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (item.isActive && item.opacity > 0.5 && item.screenWidth > 0) { 
            const distToTextCenter = Math.hypot(x - item.screenX, y - item.screenY);
            if (distToTextCenter < (item.screenWidth / 2) + 40) {
                activeItem = item;
                isDragging = false;
                dragStartX = x; dragStartY = y;
                if (!item.isSelected) { selectItem(item); }
                clickedOnItem = true;
                break; 
            }
        }
    }
    if (!clickedOnItem) {
        if (activeItem && !activeItem.isSelected) {
            const scale = (focalLength / (focalLength + activeItem.z));
            activeItem.targetX = (x - centerX) / scale;
            activeItem.targetY = (y - centerY) / scale;
            activeItem.isMovingToTarget = true;
        } else { selectItem(null); }
    }
}

function handlePointerMove(x, y) {
    if (activeItem && !isDragging) {
        const distMoved = Math.hypot(x - dragStartX, y - dragStartY);
        if (distMoved > 8) { isDragging = true; activeItem.isMovingToTarget = false; }
    }
    if (isDragging && activeItem) {
        const scale = (focalLength / (focalLength + activeItem.z));
        activeItem.x += (x - dragStartX) / scale;
        activeItem.baseY += (y - dragStartY) / scale;
        dragStartX = x; dragStartY = y;
    }
}

function handlePointerUp() { isDragging = false; }

function triggerEndgame() {
    document.getElementById('endgame-text').innerText = `Du hast alle ${statements.length} Aussagen bewertet, ${currentPlayer}. Dein Kohärenz-Score liegt bei ${coherenceScore} Punkten. Aus deinen Entscheidungen und den Meinungen der Entitäten ist ein einzigartiger Anschauungsraum entstanden. Jede Meinung wurde ein Teil deiner Wahrheit.`;
    document.getElementById('endgame-modal').classList.add('active');
}

function restartGame() {
    document.getElementById('endgame-modal').classList.remove('active');
    coherenceScore = 50;
    updateScore(0);
    stopAll();
    kiText.innerText = `Ein neuer Raum entsteht, ${currentPlayer}. Zeig mir noch einmal, was du für wahr hältst...`;
    kiPanel.classList.add('active');
    setTimeout(() => { kiPanel.classList.remove('active'); }, 5000);
}

function draw() {
    if (!width || !height) { requestAnimationFrame(draw); return; } 
    
    ctx.clearRect(0, 0, width, height);
    centerX = width / 2; centerY = height / 2;
    
    items.sort((a, b) => b.z - a.z);
    
    if (!isPaused) { 
        time += 0.02; 
        updatePhysics(); 
        updateParticles(); 
        updateEntities();
    }

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-centerX, -centerY);

    drawParticles();
    drawEntities();

    items.forEach(item => {
        if (item.isActive && item.opacity < 1) item.opacity += 0.05;
        else if (!item.isActive && item.opacity > 0) item.opacity -= 0.05;

        if (item.opacity <= 0.01) { item.screenWidth = 0; return; }

        if (!item.isSelected && item.isActive && !item.isMovingToTarget) {
            item.x += item.physicsVx;
            item.baseY += item.physicsVy;
            item.physicsVx *= 0.95; item.physicsVy *= 0.95;
        }

        if (item.isMovingToTarget && !isPaused) {
            item.x += (item.targetX - item.x) * 0.1;
            item.baseY += (item.targetY - item.baseY) * 0.1;
            if (Math.hypot(item.targetX - item.x, item.targetY - item.baseY) < 1) {
                item.x = item.targetX; item.baseY = item.targetY;
                item.isMovingToTarget = false;
            }
        } 
        else if (!item.isSelected && !isPaused && item !== currentChallengeItem) {
            item.x += baseWindSpeed;
            const maxX = width * 1.2;
            if (item.x > maxX) {
                item.x = -maxX;
                item.baseY = (Math.random() - 0.5) * (height * 0.8); 
            }
        }

        const waveOffset = item.isSelected || isPaused ? 0 : Math.sin(item.x * item.waveFrequency + time * item.waveSpeed + item.phaseShift) * item.waveAmplitude;
        const currentY = item.baseY + waveOffset;
        const currentRotation = item.isSelected || isPaused ? 0 : item.rotationBase + Math.sin(time * item.waveSpeed + item.phaseShift) * 0.1;

        const scale = focalLength / (focalLength + item.z);
        const screenX = centerX + item.x * scale;
        const screenY = centerY + currentY * scale;

        let globalDim = (activeItem && !item.isSelected) ? 0.2 : 1.0;

        if (screenX > -400 && screenX < width + 400 && screenY > -400 && screenY < height + 400) {
            drawSpruchband(item, screenX, screenY, scale, currentRotation, globalDim);
        } else { item.screenWidth = 0; }
    });

    ctx.restore();
    requestAnimationFrame(draw);
}

function drawSpruchband(item, x, y, scale, rotation, dimFactor) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    const finalScale = scale * zoomLevel;
    let fontSize = Math.max(1, item.size * (isLandscape ? 1.1 : 1.3) * finalScale);
    
    const depthAlpha = Math.max(0.3, Math.min(1, item.z > 800 ? 1 - ((item.z - 800) / 200) : (item.z < -200 ? 1 + ((item.z + 200) / 200) : 1)));
    ctx.globalAlpha = depthAlpha * dimFactor * item.opacity;

    ctx.font = "bold " + fontSize + "px 'Courier New', monospace";
    let textWidth = ctx.measureText(item.text).width;

    if (item.isSelected) {
        const maxAllowedWidth = (width * 0.85) / zoomLevel; 
        if (textWidth > maxAllowedWidth) {
            const scaleFactor = maxAllowedWidth / textWidth; 
            fontSize *= scaleFactor;
            ctx.font = "bold " + fontSize + "px 'Courier New', monospace";
            textWidth = ctx.measureText(item.text).width; 
        }
    }

    item.screenX = x; item.screenY = y; item.screenWidth = textWidth * scale; 

    if (item.isSelected) {
        ctx.fillStyle = "rgba(15, 25, 45, 0.95)";
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2; ctx.shadowBlur = 20; ctx.shadowColor = item.color;
        const paddingX = 20; const paddingY = 15;
        ctx.beginPath();
        ctx.roundRect(-textWidth/2 - paddingX, -fontSize/2 - paddingY, textWidth + paddingX*2, fontSize + paddingY*2, 10);
        ctx.fill(); ctx.stroke();
    }

    ctx.fillStyle = item.isSelected ? "#ffffff" : item.color;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowBlur = 10 * finalScale * item.weight; ctx.shadowColor = item.color;
    ctx.fillText(item.text, 0, 0);
    ctx.restore();
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2; if (h < 2 * r) r = h / 2;
        this.beginPath(); this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r);
        this.closePath(); return this;
    };
}

window.addEventListener('DOMContentLoaded', () => {
    resize();
    initGame();
    loadDatabase();
    draw();
});