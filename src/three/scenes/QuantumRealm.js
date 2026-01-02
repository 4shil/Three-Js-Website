import * as THREE from 'three';

// Scene 7: Quantum Realm
export function createQuantumRealm() {
    const group = new THREE.Group();
    group.position.set(0, 0, -150);

    // Quantum particles that "teleport"
    const qGeo = new THREE.BufferGeometry();
    const qCount = 1000;
    const qPos = new Float32Array(qCount * 3);
    const qColors = new Float32Array(qCount * 3);
    const originalQPos = new Float32Array(qCount * 3);

    for (let i = 0; i < qCount * 3; i += 3) {
        qPos[i] = (Math.random() - 0.5) * 20;
        qPos[i + 1] = (Math.random() - 0.5) * 20;
        qPos[i + 2] = (Math.random() - 0.5) * 20;

        originalQPos[i] = qPos[i];
        originalQPos[i + 1] = qPos[i + 1];
        originalQPos[i + 2] = qPos[i + 2];

        // Cyan-teal colors
        qColors[i] = 0;
        qColors[i + 1] = 0.9 + Math.random() * 0.1;
        qColors[i + 2] = 0.8 + Math.random() * 0.2;
    }

    qGeo.setAttribute('position', new THREE.BufferAttribute(qPos, 3));
    qGeo.setAttribute('color', new THREE.BufferAttribute(qColors, 3));

    const qMat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const quantumParticles = new THREE.Points(qGeo, qMat);
    group.add(quantumParticles);

    // Probability wave rings
    const waves = [];
    for (let w = 0; w < 5; w++) {
        const waveGeo = new THREE.TorusGeometry(3 + w * 2, 0.05, 8, 64);
        const waveMat = new THREE.MeshBasicMaterial({
            color: 0x00ffd5,
            transparent: true,
            opacity: 0.3 - w * 0.05,
            wireframe: true
        });
        const wave = new THREE.Mesh(waveGeo, waveMat);
        wave.userData.baseRadius = 3 + w * 2;
        waves.push(wave);
        group.add(wave);
    }

    // Central nucleus
    const nucleusGeo = new THREE.OctahedronGeometry(1.5, 0);
    const nucleusMat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        wireframe: true
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    group.add(nucleus);

    return { group, quantumParticles, originalQPos, qCount, waves, nucleus };
}

export function updateQuantumRealm(data, mouse, time) {
    const { quantumParticles, originalQPos, qCount, waves, nucleus } = data;

    // Quantum "teleportation" effect
    const positions = quantumParticles.geometry.attributes.position.array;

    for (let i = 0; i < qCount; i++) {
        const i3 = i * 3;

        // React to mouse proximity
        const dx = positions[i3] - mouse.x * 10;
        const dy = positions[i3 + 1] - mouse.y * 10;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Occasionally "teleport" or jitter near mouse
        if (Math.random() < 0.002 || (dist < 4 && Math.random() < 0.05)) {
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
        } else {
            // Subtle vibration
            positions[i3] += (Math.random() - 0.5) * 0.02;
            positions[i3 + 1] += (Math.random() - 0.5) * 0.02;
            positions[i3 + 2] += (Math.random() - 0.5) * 0.02;
        }
    }

    quantumParticles.geometry.attributes.position.needsUpdate = true;
    quantumParticles.rotation.y = time * 0.05 + mouse.x * 0.2;
    quantumParticles.rotation.x = -mouse.y * 0.2;

    // Animate probability waves
    waves.forEach((wave, i) => {
        wave.rotation.x = time * 0.2 + i * 0.5 + mouse.y * 0.3;
        wave.rotation.y = time * 0.15 + i * 0.3 + mouse.x * 0.3;
        wave.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
    });

    // Animate nucleus
    nucleus.rotation.x = time * 0.5 + mouse.y;
    nucleus.rotation.y = time * 0.3 + mouse.x;
    nucleus.scale.setScalar(1 + Math.sin(time * 4) * 0.1);
    nucleus.position.x = mouse.x;
    nucleus.position.y = mouse.y;
}
