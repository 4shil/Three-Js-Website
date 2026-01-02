import * as THREE from 'three';

// Scene 5: Aurora Veil
export function createAurora() {
    const group = new THREE.Group();
    group.position.set(0, 0, -100);

    // Aurora ribbons using curved planes
    const ribbons = [];
    const ribbonCount = 8;

    for (let r = 0; r < ribbonCount; r++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-15 + r * 2, -5 + Math.random() * 2, 0),
            new THREE.Vector3(-8 + r, 3 + Math.random() * 3, 2),
            new THREE.Vector3(0, 5 + Math.random() * 2, -1),
            new THREE.Vector3(8 - r, 3 + Math.random() * 3, 1),
            new THREE.Vector3(15 - r * 2, -5 + Math.random() * 2, 0)
        ]);

        const tubeGeo = new THREE.TubeGeometry(curve, 50, 0.3 + Math.random() * 0.3, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.7 + r * 0.03, 0.8, 0.5),
            transparent: true,
            opacity: 0.4 - r * 0.03,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        const ribbon = new THREE.Mesh(tubeGeo, tubeMat);
        ribbon.userData.offset = r * 0.5;
        ribbons.push(ribbon);
        group.add(ribbon);
    }

    // Floating aurora particles
    const particleGeo = new THREE.BufferGeometry();
    const pCount = 1500;
    const pPos = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
        pPos[i] = (Math.random() - 0.5) * 35;
        pPos[i + 1] = (Math.random() - 0.5) * 15;
        pPos[i + 2] = (Math.random() - 0.5) * 15;

        const hue = 0.6 + Math.random() * 0.2;
        const color = new THREE.Color().setHSL(hue, 0.9, 0.6);
        pColors[i] = color.r;
        pColors[i + 1] = color.g;
        pColors[i + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    return { group, ribbons, particles };
}

export function updateAurora(data, mouse, time) {
    const { ribbons, particles } = data;

    ribbons.forEach((ribbon, i) => {
        // Wave based on mouse
        const mouseEffect = Math.sin(time + i + mouse.x * 2) * 0.3;

        ribbon.position.y = Math.sin(time * 0.5 + ribbon.userData.offset) * 0.5 + mouse.y * (i * 0.1);
        ribbon.rotation.z = Math.sin(time * 0.3 + ribbon.userData.offset) * 0.05 + mouse.x * 0.05;
        ribbon.rotation.x = -mouse.y * 0.05;
        ribbon.material.opacity = 0.3 + Math.sin(time + ribbon.userData.offset) * 0.1;
    });

    particles.rotation.y = time * 0.02 + mouse.x * 0.1;
    particles.rotation.x = -mouse.y * 0.1;
    particles.position.y = Math.sin(time * 0.3) * 0.5;
}
