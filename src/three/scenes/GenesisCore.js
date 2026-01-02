import * as THREE from 'three';

// Scene 14: Genesis Core
export function createGenesisCore() {
    const group = new THREE.Group();
    group.position.set(0, 0, -325);

    // Central genesis sphere
    const coreGeo = new THREE.SphereGeometry(3, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x9400d3,
        transparent: true,
        opacity: 0.7
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Inner energy
    const innerGeo = new THREE.IcosahedronGeometry(2, 1);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0xda70d6,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerCore);

    // Orbital rings
    const orbits = [];
    for (let i = 0; i < 4; i++) {
        const orbitGeo = new THREE.TorusGeometry(5 + i * 1.5, 0.05, 8, 64);
        const orbitMat = new THREE.MeshBasicMaterial({
            color: 0x9370db,
            transparent: true,
            opacity: 0.5 - i * 0.1
        });

        const orbit = new THREE.Mesh(orbitGeo, orbitMat);
        orbit.rotation.x = Math.PI / 2 + i * 0.3;
        orbit.rotation.y = i * 0.5;
        orbit.userData.index = i;
        orbits.push(orbit);
        group.add(orbit);
    }

    // Energy tendrils
    const tendrils = [];
    for (let t = 0; t < 12; t++) {
        const points = [];
        const baseAngle = (t / 12) * Math.PI * 2;

        for (let p = 0; p < 20; p++) {
            const dist = 3 + p * 0.6;
            const wobble = Math.sin(p * 0.5) * 0.5;
            points.push(new THREE.Vector3(
                Math.cos(baseAngle + wobble) * dist,
                Math.sin(baseAngle + wobble) * dist,
                (Math.random() - 0.5) * 2
            ));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const tendrilGeo = new THREE.TubeGeometry(curve, 30, 0.08, 8, false);
        const tendrilMat = new THREE.MeshBasicMaterial({
            color: 0xba55d3,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const tendril = new THREE.Mesh(tendrilGeo, tendrilMat);
        tendril.userData.baseAngle = baseAngle;
        tendrils.push(tendril);
        group.add(tendril);
    }

    // Creation particles
    const createGeo = new THREE.BufferGeometry();
    const createCount = 2500;
    const createPos = new Float32Array(createCount * 3);
    const createColors = new Float32Array(createCount * 3);

    for (let i = 0; i < createCount * 3; i += 3) {
        const angle = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 5 + Math.random() * 12;

        createPos[i] = Math.sin(phi) * Math.cos(angle) * radius;
        createPos[i + 1] = Math.sin(phi) * Math.sin(angle) * radius;
        createPos[i + 2] = Math.cos(phi) * radius;

        // Purple gradient
        const hue = 0.75 + Math.random() * 0.1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        createColors[i] = color.r;
        createColors[i + 1] = color.g;
        createColors[i + 2] = color.b;
    }

    createGeo.setAttribute('position', new THREE.BufferAttribute(createPos, 3));
    createGeo.setAttribute('color', new THREE.BufferAttribute(createColors, 3));

    const createMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const creationParticles = new THREE.Points(createGeo, createMat);
    group.add(creationParticles);

    return { group, core, innerCore, orbits, tendrils, creationParticles };
}

export function updateGenesisCore(data, mouse, time) {
    const { core, innerCore, orbits, tendrils, creationParticles } = data;

    // Pulse core
    core.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    core.material.opacity = 0.6 + Math.sin(time * 3) * 0.1;
    core.rotation.y = mouse.x * 0.5;
    core.rotation.x = -mouse.y * 0.5;

    // Spin inner core
    innerCore.rotation.x = time * 0.5 + mouse.y;
    innerCore.rotation.y = time * 0.3 + mouse.x;
    innerCore.rotation.z = time * 0.4;

    // Animate orbits
    orbits.forEach((orbit) => {
        orbit.rotation.z = time * 0.2 * (orbit.userData.index + 1) + mouse.x * 0.2;
        orbit.rotation.x = Math.PI / 2 + orbit.userData.index * 0.3 + mouse.y * 0.2;
    });

    // Animate tendrils
    tendrils.forEach((tendril, i) => {
        tendril.rotation.z = time * 0.1 + tendril.userData.baseAngle + mouse.x * 0.1;
        tendril.rotation.x = -mouse.y * 0.1;
        tendril.material.opacity = 0.4 + Math.sin(time * 2 + i) * 0.1;
    });

    // Rotate creation particles
    creationParticles.rotation.y = time * 0.05 + mouse.x * 0.2;
    creationParticles.rotation.x = Math.sin(time * 0.2) * 0.1 - mouse.y * 0.2;
}
