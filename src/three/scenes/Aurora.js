import * as THREE from 'three';

// SCENE 5: AURORA VEIL - Flowing Light Ribbons
// Awwwards-style: Smooth curves with gradient colors

export function createAurora() {
    const group = new THREE.Group();
    group.position.z = -100;

    // Create flowing ribbon curves
    const ribbons = [];
    const ribbonColors = [0x00ffff, 0x00ff88, 0x8866ff, 0xff3c00];

    for (let i = 0; i < 6; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-15, (i - 3) * 2, 0),
            new THREE.Vector3(-5, (i - 3) * 2 + Math.sin(i) * 2, -3),
            new THREE.Vector3(5, (i - 3) * 2, -6),
            new THREE.Vector3(15, (i - 3) * 2 - Math.sin(i) * 2, -3)
        ]);

        const tubeGeo = new THREE.TubeGeometry(curve, 50, 0.15 + i * 0.02, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: ribbonColors[i % ribbonColors.length],
            transparent: true,
            opacity: 0.25
        });
        tubeMat.userData = { baseOpacity: 0.25 };
        const ribbon = new THREE.Mesh(tubeGeo, tubeMat);
        ribbon.userData = { offset: i * 0.5 };
        group.add(ribbon);
        ribbons.push(ribbon);
    }

    // Ambient particles
    const particleCount = 600;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 35;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;

        // HSL gradient colors
        const hue = 0.4 + Math.random() * 0.3;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    particleMat.userData = { baseOpacity: 0.6 };
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    return { group, ribbons, particles };
}

export function updateAurora(data, mouse, time) {
    const { ribbons, particles } = data;

    ribbons.forEach((ribbon, i) => {
        ribbon.position.y = Math.sin(time * 0.5 + ribbon.userData.offset) * 0.8 + mouse.y * (i * 0.1);
        ribbon.rotation.z = Math.sin(time * 0.3 + ribbon.userData.offset) * 0.08 + mouse.x * 0.05;
        ribbon.material.opacity = ribbon.material.userData.baseOpacity * (0.8 + Math.sin(time + ribbon.userData.offset) * 0.2);
    });

    particles.rotation.y = time * 0.02 + mouse.x * 0.1;
    particles.rotation.x = mouse.y * 0.1;
}
