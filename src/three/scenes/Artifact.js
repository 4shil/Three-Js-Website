import * as THREE from 'three';

// SCENE 2: CRYSTAL ARTIFACT - Elegant Geometric Structure
// Awwwards-style: Minimal wireframe with subtle internal glow

export function createArtifact() {
    const group = new THREE.Group();
    group.position.z = -25;

    // Main crystal - Dodecahedron for elegance
    const crystalGeo = new THREE.DodecahedronGeometry(3, 0);
    const crystalMat = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.15,
        wireframe: true
    });
    crystalMat.userData = { baseOpacity: 0.15 };
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    group.add(crystal);

    // Inner core - solid glow
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xff3c00,
        transparent: true,
        opacity: 0.3
    });
    coreMat.userData = { baseOpacity: 0.3 };
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Outer wireframe cage
    const cageGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const cageMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.08,
        wireframe: true
    });
    cageMat.userData = { baseOpacity: 0.08 };
    const cage = new THREE.Mesh(cageGeo, cageMat);
    group.add(cage);

    // Orbiting particles
    const orbitCount = 200;
    const orbitPositions = new Float32Array(orbitCount * 3);
    const orbitColors = new Float32Array(orbitCount * 3);

    for (let i = 0; i < orbitCount; i++) {
        const angle = (i / orbitCount) * Math.PI * 2;
        const radius = 5 + Math.sin(i * 0.5) * 1;
        const height = (Math.random() - 0.5) * 4;

        orbitPositions[i * 3] = Math.cos(angle) * radius;
        orbitPositions[i * 3 + 1] = height;
        orbitPositions[i * 3 + 2] = Math.sin(angle) * radius;

        // Gradient colors
        const t = i / orbitCount;
        orbitColors[i * 3] = 1;
        orbitColors[i * 3 + 1] = 0.24 + t * 0.5;
        orbitColors[i * 3 + 2] = t;
    }

    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3));
    orbitGeo.setAttribute('color', new THREE.BufferAttribute(orbitColors, 3));

    const orbitMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    orbitMat.userData = { baseOpacity: 0.8 };
    const orbitParticles = new THREE.Points(orbitGeo, orbitMat);
    group.add(orbitParticles);

    return { group, crystal, core, cage, orbitParticles };
}

export function updateArtifact(data, mouse, time) {
    const { crystal, core, cage, orbitParticles } = data;

    // Slow elegant rotation
    crystal.rotation.y = time * 0.15 + mouse.x * 0.3;
    crystal.rotation.x = time * 0.1 + mouse.y * 0.2;

    // Pulsing core
    core.rotation.y = -time * 0.3;
    core.rotation.z = time * 0.2;
    core.scale.setScalar(1 + Math.sin(time * 2) * 0.15);

    // Counter-rotating cage
    cage.rotation.y = -time * 0.08 + mouse.x * 0.1;
    cage.rotation.x = time * 0.05 - mouse.y * 0.1;

    // Orbiting particles
    orbitParticles.rotation.y = time * 0.2 + mouse.x * 0.05;
    orbitParticles.rotation.x = Math.sin(time * 0.5) * 0.1;
}
