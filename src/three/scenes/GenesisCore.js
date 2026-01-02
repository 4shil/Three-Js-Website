import * as THREE from 'three';

// SCENE 14: GENESIS CORE - Origin Point
// Awwwards-style: Pulsing central sphere with orbital energy

export function createGenesisCore() {
    const group = new THREE.Group();
    group.position.z = -325;

    // Central core
    const coreGeo = new THREE.SphereGeometry(3, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xff3c00,
        transparent: true,
        opacity: 0.7
    });
    coreMat.userData = { baseOpacity: 0.7 };
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Inner nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const nucleusMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    nucleusMat.userData = { baseOpacity: 0.9 };
    const innerCore = new THREE.Mesh(nucleusGeo, nucleusMat);
    group.add(innerCore);

    // Orbital rings
    const orbits = [];
    for (let i = 0; i < 4; i++) {
        const orbitGeo = new THREE.TorusGeometry(5 + i * 2, 0.03, 8, 64);
        const orbitMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x00ff88 : 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        orbitMat.userData = { baseOpacity: 0.3 };
        const orbit = new THREE.Mesh(orbitGeo, orbitMat);
        orbit.rotation.x = Math.PI / 2 + i * 0.3;
        orbit.rotation.y = i * 0.5;
        orbit.userData = { index: i };
        group.add(orbit);
        orbits.push(orbit);
    }

    // Energy tendrils
    const tendrils = [];
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.cos(angle) * 4, Math.sin(angle) * 4, 2),
            new THREE.Vector3(Math.cos(angle) * 8, Math.sin(angle) * 8, 0),
            new THREE.Vector3(Math.cos(angle) * 12, Math.sin(angle) * 12, -2)
        ]);

        const tendrilGeo = new THREE.TubeGeometry(curve, 30, 0.05, 8, false);
        const tendrilMat = new THREE.MeshBasicMaterial({
            color: 0xff3c00,
            transparent: true,
            opacity: 0.4
        });
        tendrilMat.userData = { baseOpacity: 0.4 };
        const tendril = new THREE.Mesh(tendrilGeo, tendrilMat);
        tendril.userData = { baseAngle: angle };
        group.add(tendril);
        tendrils.push(tendril);
    }

    // Creation particles
    const particleCount = 600;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const radius = 5 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);

        // Gradient from orange to white
        const t = Math.random();
        particleColors[i * 3] = 1;
        particleColors[i * 3 + 1] = 0.24 + t * 0.76;
        particleColors[i * 3 + 2] = t;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    particleMat.userData = { baseOpacity: 0.7 };
    const creationParticles = new THREE.Points(particleGeo, particleMat);
    group.add(creationParticles);

    return { group, core, innerCore, orbits, tendrils, creationParticles };
}

export function updateGenesisCore(data, mouse, time) {
    const { core, innerCore, orbits, tendrils, creationParticles } = data;

    // Pulsing core
    core.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    core.rotation.y = time * 0.1 + mouse.x * 0.3;

    // Spinning inner nucleus
    innerCore.rotation.x = time * 0.5 + mouse.y * 0.5;
    innerCore.rotation.y = time * 0.3 + mouse.x * 0.5;
    innerCore.rotation.z = time * 0.4;

    // Animate orbits
    orbits.forEach((orbit) => {
        orbit.rotation.z = time * 0.2 * (orbit.userData.index + 1);
    });

    // Animate tendrils
    tendrils.forEach((tendril, i) => {
        tendril.rotation.z = time * 0.1 + tendril.userData.baseAngle;
        tendril.material.opacity = tendril.material.userData.baseOpacity * (0.6 + Math.sin(time * 2 + i) * 0.4);
    });

    // Rotate particles
    creationParticles.rotation.y = time * 0.03 + mouse.x * 0.1;
    creationParticles.rotation.x = Math.sin(time * 0.2) * 0.1;
}
