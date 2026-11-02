function toggleCompendium() {
    const modal = document.getElementById('compendium-modal');
    const treeContainer = document.getElementById('compendium-tree');
    
    if (!modal.classList.contains('active') && treeContainer) {
        treeContainer.innerHTML = `
            <div class="tree-node">
                <div class="tree-branch" onclick="this.classList.toggle('open')">
                    <span class="tree-icon">▶</span><span class="tree-title">DAS URPRINZIP</span>
                </div>
                <div class="tree-content">
                    <div class="tree-node">
                        <div class="tree-branch" onclick="this.classList.toggle('open')">
                            <span class="tree-icon">▶</span><span class="tree-title">1. GEIST</span>
                        </div>
                        <div class="tree-content">
                            <div class="tree-leaf">Mathematik</div>
                            <div class="tree-leaf">Zahl</div>
                            <div class="tree-leaf">Form</div>
                        </div>
                    </div>
                    <div class="tree-node">
                        <div class="tree-branch" onclick="this.classList.toggle('open')">
                            <span class="tree-icon">▶</span><span class="tree-title">2. WILLE</span>
                        </div>
                        <div class="tree-content">
                            <div class="tree-leaf">Macht</div>
                            <div class="tree-leaf">Kraft</div>
                        </div>
                    </div>
                    <div class="tree-node">
    <div class="tree-branch" onclick="this.classList.toggle('open')">
        <span class="tree-icon">▶</span><span class="tree-title">7. POLARITÄTEN</span>
    </div>
    <div class="tree-content">
        <div class="tree-node">
            <div class="tree-branch" onclick="this.classList.toggle('open')">
                <span class="tree-icon">▶</span><span class="tree-title">7.1 Raum & Dimension</span>
            </div>
            <div class="tree-content">
                <div class="tree-leaf">Groß – Klein</div>
                <div class="tree-leaf">Hoch – Niedrig</div>
                <div class="tree-leaf">Lang – Kurz</div>
                <div class="tree-leaf">Breit – Schmal</div>
                <div class="tree-leaf">Dick – Dünn</div>
                <div class="tree-leaf">Links – Rechts</div>
                <div class="tree-leaf">Oben – Unten</div>
                <div class="tree-leaf">Vorne – Hinten</div>
                <div class="tree-leaf">Innen – Außen</div>
                <div class="tree-leaf">Eng – Weit</div>
                <div class="tree-leaf">Gerade – Krumm</div>
                <div class="tree-leaf">Rund – Eckig</div>
                <div class="tree-leaf">Symmetrisch – Asymmetrisch</div>
            </div>
        </div>
        <div class="tree-node">
            <div class="tree-branch" onclick="this.classList.toggle('open')">
                <span class="tree-icon">▶</span><span class="tree-title">7.2 Zustände & Eigenschaften</span>
            </div>
            <div class="tree-content">
                <div class="tree-leaf">Hell – Dunkel</div>
                <div class="tree-leaf">Schnell – Langsam</div>
                <div class="tree-leaf">Laut – Leise</div>
                <div class="tree-leaf">Warm – Kalt</div>
                <div class="tree-leaf">Schwer – Leicht</div>
                <div class="tree-leaf">Aktiv – Passiv</div>
                <div class="tree-leaf">Offen – Geschlossen</div>
                <div class="tree-leaf">Einfach – Kompliziert</div>
                <div class="tree-leaf">Ruhig – Aufgeregt</div>
                <div class="tree-leaf">Sauber – Schmutzig</div>
                <div class="tree-leaf">Trocken – Nass</div>
                <div class="tree-leaf">Gesund – Krank</div>
                <div class="tree-leaf">Frei – Gefangen</div>
                <div class="tree-leaf">Wahr – Falsch</div>
                <div class="tree-leaf">Real – Irreal</div>
                <div class="tree-leaf">Natürlich – Künstlich</div>
                <div class="tree-leaf">Flexibel – Starr</div>
                <div class="tree-leaf">Modern – Traditionell</div>
                <div class="tree-leaf">Neu – Alt</div>
                <div class="tree-leaf">Fortschritt – Rückschritt</div>
                <div class="tree-leaf">Aufstieg – Abstieg</div>
                <div class="tree-leaf">Voll – Leer</div>
                <div class="tree-leaf">Beweglich – Unbeweglich</div>
                <div class="tree-leaf">Lebendig – Leblos</div>
                <div class="tree-leaf">Wach – Schlafend</div>
            </div>
        </div>
        <div class="tree-node">
            <div class="tree-branch" onclick="this.classList.toggle('open')">
                <span class="tree-icon">▶</span><span class="tree-title">7.3 Emotionen & Charakter</span>
            </div>
            <div class="tree-content">
                <div class="tree-leaf">Gut – Böse</div>
                <div class="tree-leaf">Schön – Hässlich</div>
                <div class="tree-leaf">Freund – Feind</div>
                <div class="tree-leaf">Liebe – Hass</div>
                <div class="tree-leaf">Freude – Trauer</div>
                <div class="tree-leaf">Erfolg – Misserfolg</div>
                <div class="tree-leaf">Gewinn – Verlust</div>
                <div class="tree-leaf">Mutig – Ängstlich</div>
                <div class="tree-leaf">Optimistisch – Pessimistisch</div>
                <div class="tree-leaf">Extrovertiert – Introvertiert</div>
                <div class="tree-leaf">Großzügig – Geizig</div>
                <div class="tree-leaf">Fleißig – Faul</div>
                <div class="tree-leaf">Ordnung – Chaos</div>
                <div class="tree-leaf">Frieden – Krieg</div>
                <div class="tree-leaf">Sicher – Gefährlich</div>
                <div class="tree-leaf">Vertrauen – Misstrauen</div>
                <div class="tree-leaf">Harmonie – Konflikt</div>
                <div class="tree-leaf">Geben – Nehmen</div>
                <div class="tree-leaf">Erinnern – Vergessen</div>
                <div class="tree-leaf">Gewinnen – Verlieren</div>
            </div>
        </div>
        <div class="tree-node">
            <div class="tree-branch" onclick="this.classList.toggle('open')">
                <span class="tree-icon">▶</span><span class="tree-title">7.4 Stärke & Sinne</span>
            </div>
            <div class="tree-content">
                <div class="tree-leaf">Stark – Schwach</div>
                <div class="tree-leaf">Stark – Zerbrechlich</div>
                <div class="tree-leaf">Stark – Empfindlich</div>
                <div class="tree-leaf">Stark – Sanft</div>
                <div class="tree-leaf">Stark – Zart</div>
                <div class="tree-leaf">Stark – Feinfühlig</div>
                <div class="tree-leaf">Hart – Weich</div>
                <div class="tree-leaf">Süß – Sauer</div>
                <div class="tree-leaf">Bitter – Süß</div>
                <div class="tree-leaf">Scharf – Mild</div>
            </div>
        </div>
        <div class="tree-node">
            <div class="tree-branch" onclick="this.classList.toggle('open')">
                <span class="tree-icon">▶</span><span class="tree-title">7.5 Soziales & Intellekt</span>
            </div>
            <div class="tree-content">
                <div class="tree-leaf">Reich – Arm</div>
                <div class="tree-leaf">Öffentlich – Privat</div>
                <div class="tree-leaf">Sichtbar – Unsichtbar</div>
                <div class="tree-leaf">Bekannt – Unbekannt</div>
                <div class="tree-leaf">Beliebt – Unbeliebt</div>
                <div class="tree-leaf">Erfolgreich – Erfolglos</div>
                <div class="tree-leaf">Konzentriert – Abgelenkt</div>
                <div class="tree-leaf">Geduldig – Ungeduldig</div>
                <div class="tree-leaf">Freundlich – Unfreundlich</div>
                <div class="tree-leaf">Höflich – Unhöflich</div>
                <div class="tree-leaf">Ernst – Fröhlich</div>
                <div class="tree-leaf">Ernsthaft – Leichtsinnig</div>
                <div class="tree-leaf">Verantwortlich – Unverantwortlich</div>
                <div class="tree-leaf">Zuverlässig – Unzuverlässig</div>
                <div class="tree-leaf">Pünktlich – Unpünktlich</div>
                <div class="tree-leaf">Sparsam – Verschwenderisch</div>
                <div class="tree-leaf">Bescheiden – Arrogant</div>
                <div class="tree-leaf">Klug – Dumm</div>
                <div class="tree-leaf">Gebildet – Ungebildet</div>
                <div class="tree-leaf">Erfahrung – Unerfahrenheit</div>
                <div class="tree-leaf">Reif – Unreif</div>
            </div>
        </div>
    </div>
</div>
                </div>
            </div>
        `;
    }
    modal.classList.toggle('active');
}
