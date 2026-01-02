import * as THREE from 'three';

// SCENE 3: DIGITAL TERRAIN - Minimal Grid Landscape
// Awwwards-style: Clean lines, subtle animations

export function createGridTerrain() {
    const group = new THREE.Group();
    group.position.z = -50;

    // Primary grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x00ff88, 0x1a1a1a);
    gridHelper.position.y = -3;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.4;
    gridHelper.material.userData = { baseOpacity: 0.4 };
    group.add(gridHelper);

    // Floating line pillars
    const pillars = [];
    for (let i = 0; i < 20; i++) {
        const height = 2 + Math.random() * 6;
        const pillarGeo = new THREE.BoxGeometry(0.1, height, 0.1);
        const pillarMat = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0xff3c00 : 0xffffff,
            transparent: true,
            opacity: 0.6
        });
        pillarMat.userData = { baseOpacity: 0.6 };
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);

        pillar.position.x = (Math.random() - 0.5) * 30;
        pillar.position.y = height / 2 - 3;
        pillar.position.z = (Math.random() - 0.5) * 20 - 5;
        pillar.userData = { baseY: pillar.position.y, speed: 0.5 + Math.random() };

        group.add(pillar);
        pillars.push(pillar);
    }

    // Floating particles
    const particleCount = 500;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 40;
        particlePositions[i * 3 + 1] = Math.random() * 10 - 3;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x00ff88,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    particleMat.userData = { baseOpacity: 0.5 };
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    return { group, gridHelper, pillars, particles };
}

export function updateGridTerrain(data, mouse, time) {
    const { gridHelper, pillars, particles } = data;

    // Subtle grid movement
    gridHelper.rotation.y = mouse.x * 0.05;

    // Animate pillars
    pillars.forEach((pillar, i) => {
        pillar.position.y = pillar.userData.baseY + Math.sin(time * pillar.userData.speed + i) * 0.5;
        pillar.rotation.y = time * 0.2;
    });

    // Float particles
    particles.rotation.y = time * 0.02 + mouse.x * 0.05;
    particles.position.y = Math.sin(time * 0.3) * 0.3;
}
