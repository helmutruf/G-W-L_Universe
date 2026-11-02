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
                </div>
            </div>
        `;
    }
    modal.classList.toggle('active');
}