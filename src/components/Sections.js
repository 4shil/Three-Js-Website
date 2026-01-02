// Scene definitions for 14 unique cosmic scenes - BRUTALIST EDITION
export const SCENES = [
    {
        id: 'nebula',
        title: 'NEBULA<br>GENESIS',
        description: 'ORIGIN POINT. REACTIVE STARDUST FIELD. CURSOR INTERACTION ENABLED.',
        button: 'ENTER_SYSTEM',
        layout: 'left'
    },
    {
        id: 'crystal',
        title: 'CRYSTAL<br>ARTIFACT',
        description: 'GEOMETRIC STRUCTURE DETECTED. ENERGY SIGNATURE: UNKNOWN. SCANNING.',
        button: 'SCAN_OBJECT',
        layout: 'right'
    },
    {
        id: 'grid',
        title: 'DIGITAL<br>TERRAIN',
        description: 'SYNTHETIC LANDSCAPE. GROUND MATRIX UNSTABLE. PROCEED WITH CAUTION.',
        button: 'ANALYZE',
        layout: 'left'
    },
    {
        id: 'void',
        title: 'EVENT<br>HORIZON',
        description: 'SIMULATION BOUNDARY REACHED. DATA BEYOND THIS POINT: NULL.',
        button: 'CONTINUE',
        layout: 'right'
    },
    {
        id: 'aurora',
        title: 'AURORA<br>VEIL',
        description: 'ELECTROMAGNETIC ANOMALY. ANCIENT STELLAR RADIATION DETECTED.',
        button: 'ABSORB_LIGHT',
        layout: 'left'
    },
    {
        id: 'solar',
        title: 'SOLAR<br>FORGE',
        description: 'DYING STAR CORE. SOLAR FLARE ACTIVITY: CRITICAL. ENERGY HARVESTABLE.',
        button: 'HARVEST',
        layout: 'right'
    },
    {
        id: 'quantum',
        title: 'QUANTUM<br>REALM',
        description: 'REALITY FRAGMENTED. PARTICLES IN SUPERPOSITION. OBSERVATION ALTERS STATE.',
        button: 'OBSERVE',
        layout: 'left'
    },
    {
        id: 'fractal',
        title: 'FRACTAL<br>DIMENSION',
        description: 'INFINITE RECURSION. PATTERNS WITHIN PATTERNS. ZOOM DEPTH: UNLIMITED.',
        button: 'ZOOM',
        layout: 'right'
    },
    {
        id: 'pulse',
        title: 'NEURAL<br>PULSE',
        description: 'COSMIC CONSCIOUSNESS NETWORK. SYNAPTIC CONNECTIONS: 10^82.',
        button: 'CONNECT',
        layout: 'left'
    },
    {
        id: 'mirror',
        title: 'MIRROR<br>REALM',
        description: 'DIMENSIONAL REFLECTION. REAL/SIMULATED BOUNDARY: INDETERMINATE.',
        button: 'STEP_THROUGH',
        layout: 'right'
    },
    {
        id: 'storm',
        title: 'COSMIC<br>STORM',
        description: 'ELECTROMAGNETIC CHAOS. INTERDIMENSIONAL LIGHTNING. DANGER: EXTREME.',
        button: 'WEATHER',
        layout: 'left'
    },
    {
        id: 'constellation',
        title: 'STELLAR<br>CONSTELLATION',
        description: 'STAR MAP INITIALIZED. NODES CONNECTED. ANCIENT NAVIGATION CHART.',
        button: 'TRACE',
        layout: 'right'
    },
    {
        id: 'warp',
        title: 'WARP<br>TUNNEL',
        description: 'FTL TRANSIT INITIATED. DIMENSIONAL PIERCE IN PROGRESS. HOLD.',
        button: 'ENGAGE',
        layout: 'left'
    },
    {
        id: 'genesis',
        title: 'GENESIS<br>CORE',
        description: 'ORIGIN. TERMINUS. ALL VOYAGES CONVERGE HERE. RESTART AVAILABLE.',
        button: 'RESTART',
        layout: 'right'
    }
];

export function createSections() {
    return SCENES.map((scene, index) => `
        <section id="scene-${index + 1}" class="layout-${scene.layout}" data-scene="${scene.id}">
            <div class="content ${scene.layout === 'right' ? 'right' : ''}">
                <span class="scene-number">SCENE_${String(index + 1).padStart(2, '0')} // ${scene.id.toUpperCase()}</span>
                <h1>${scene.title}</h1>
                <p>${scene.description}</p>
                <div class="accent-line"></div>
            </div>
        </section>
    `).join('');
}

export function createSceneIndicator() {
    return `
        <div class="scene-indicator">
            ${SCENES.map((scene, i) => `<div class="scene-dot" data-index="${i}" data-scene="${scene.id.toUpperCase()}"></div>`).join('')}
        </div>
    `;
}
