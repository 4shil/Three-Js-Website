import * as THREE from 'three';

// SCENE 6: SOLAR FORGE - Central Star
// Awwwards-style: Glowing core with radial energy

export function createSolarForge() {
    const group = new THREE.Group();
    group.position.z = -125;

    // Central sun core
    const sunGeo = new THREE.IcosahedronGeometry(3, 3);
    const sunMat = new THREE.MeshBasicMaterial({
        color: 0xff3c00,
        transparent: true,
        opacity: 0.9
    });
    sunMat.userData = { baseOpacity: 0.9 };
    const sun = new THREE.Mesh(sunGeo, sunMat);
    group.add(sun);

    // Corona glow layers
    const coronaLayers = [];
    for (let i = 0; i < 3; i++) {
        const coronaGeo = new THREE.SphereGeometry(4 + i * 1.5, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
            color: i === 0 ? 0xff6600 : (i === 1 ? 0xff9900 : 0xffcc00),
            transparent: true,
            opacity: 0.1 - i * 0.02,
            side: THREE.BackSide
        });
        coronaMat.userData = { baseOpacity: 0.1 - i * 0.02 };
        const corona = new THREE.Mesh(coronaGeo, coronaMat);
        group.add(corona);
        coronaLayers.push(corona);
    }

    // Radial flare lines
    const flares = [];
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const flareGeo = new THREE.BoxGeometry(0.05, 8, 0.05);
        const flareMat = new THREE.MeshBasicMaterial({
            color: 0xffcc00,
            transparent: true,
            opacity: 0.4
        });
        flareMat.userData = { baseOpacity: 0.4 };
        const flare = new THREE.Mesh(flareGeo, flareMat);
        flare.position.set(Math.cos(angle) * 5, Math.sin(angle) * 5, 0);
        flare.rotation.z = angle;
        flare.userData = { angle };
        group.add(flare);
        flares.push(flare);
    }

    // Orbiting embers
    const emberCount = 300;
    const emberPositions = new Float32Array(emberCount * 3);

    for (let i = 0; i < emberCount; i++) {
        const radius = 6 + Math.random() * 10;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 8;
        emberPositions[i * 3] = Math.cos(angle) * radius;
        emberPositions[i * 3 + 1] = height;
        emberPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));

    const emberMat = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xff6600,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    emberMat.userData = { baseOpacity: 0.7 };
    const embers = new THREE.Points(emberGeo, emberMat);
    group.add(embers);

    return { group, sun, coronaLayers, flares, embers };
}

export function updateSolarForge(data, mouse, time) {
    const { sun, coronaLayers, flares, embers } = data;

    // Pulsing sun
    sun.rotation.y = time * 0.1;
    sun.scale.setScalar(1 + Math.sin(time * 3) * 0.05);

    // Animate corona
    coronaLayers.forEach((corona, i) => {
        corona.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
        corona.rotation.y = time * 0.05 * (i + 1);
    });

    // Animate flares
    flares.forEach((flare, i) => {
        flare.scale.y = 1 + Math.sin(time * 2 + i) * 0.3;
        flare.material.opacity = flare.material.userData.baseOpacity * (0.6 + Math.sin(time * 3 + i) * 0.4);
    });

    // Rotate embers
    embers.rotation.y = time * 0.1 + mouse.x * 0.1;
    embers.rotation.x = mouse.y * 0.1;
}
