import * as THREE from 'three';

// SCENE 7: QUANTUM REALM - Probability Particles
// Awwwards-style: Flickering particles that teleport

export function createQuantumRealm() {
    const group = new THREE.Group();
    group.position.z = -150;

    // Quantum particles
    const qCount = 800;
    const qPositions = new Float32Array(qCount * 3);
    const qColors = new Float32Array(qCount * 3);

    for (let i = 0; i < qCount; i++) {
        qPositions[i * 3] = (Math.random() - 0.5) * 25;
        qPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        qPositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;

        // Violet/cyan gradient
        const t = Math.random();
        qColors[i * 3] = 0.5 + t * 0.5;
        qColors[i * 3 + 1] = t * 0.4;
        qColors[i * 3 + 2] = 1;
    }

    const qGeo = new THREE.BufferGeometry();
    qGeo.setAttribute('position', new THREE.BufferAttribute(qPositions, 3));
    qGeo.setAttribute('color', new THREE.BufferAttribute(qColors, 3));

    const qMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    qMat.userData = { baseOpacity: 0.8 };
    const quantumParticles = new THREE.Points(qGeo, qMat);
    group.add(quantumParticles);

    // Central nucleus
    const nucleusGeo = new THREE.OctahedronGeometry(2, 0);
    const nucleusMat = new THREE.MeshBasicMaterial({
        color: 0x8866ff,
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    nucleusMat.userData = { baseOpacity: 0.5 };
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    group.add(nucleus);

    // Probability shells
    const shells = [];
    for (let i = 0; i < 4; i++) {
        const shellGeo = new THREE.TorusGeometry(4 + i * 2, 0.02, 8, 64);
        const shellMat = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.2 - i * 0.03
        });
        shellMat.userData = { baseOpacity: 0.2 - i * 0.03 };
        const shell = new THREE.Mesh(shellGeo, shellMat);
        shell.rotation.x = Math.PI / 2 + i * 0.3;
        shell.userData = { index: i };
        group.add(shell);
        shells.push(shell);
    }

    return { group, quantumParticles, nucleus, shells, qCount };
}

export function updateQuantumRealm(data, mouse, time) {
    const { quantumParticles, nucleus, shells, qCount } = data;

    // Quantum teleportation effect
    const positions = quantumParticles.geometry.attributes.position.array;
    for (let i = 0; i < qCount; i++) {
        // Random teleport probability
        if (Math.random() < 0.003) {
            positions[i * 3] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
        }
    }
    quantumParticles.geometry.attributes.position.needsUpdate = true;
    quantumParticles.rotation.y = time * 0.03 + mouse.x * 0.1;

    // Spinning nucleus
    nucleus.rotation.x = time * 0.5 + mouse.y * 0.5;
    nucleus.rotation.y = time * 0.3 + mouse.x * 0.5;
    nucleus.scale.setScalar(1 + Math.sin(time * 4) * 0.1);

    // Animate shells
    shells.forEach((shell, i) => {
        shell.rotation.z = time * 0.2 * (i % 2 ? 1 : -1);
        shell.rotation.x = Math.PI / 2 + i * 0.3 + Math.sin(time + i) * 0.1;
    });
}
