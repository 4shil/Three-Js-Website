import * as THREE from 'three';

// Scene 6: Solar Forge
export function createSolarForge() {
    const group = new THREE.Group();
    group.position.set(0, 0, -125);

    // Central sun
    const sunGeo = new THREE.SphereGeometry(4, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        transparent: true,
        opacity: 0.9
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    group.add(sun);

    // Corona glow
    const coronaGeo = new THREE.SphereGeometry(5, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xff8c00,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    group.add(corona);

    // Solar flares
    const flares = [];
    const flareCount = 12;

    for (let i = 0; i < flareCount; i++) {
        const angle = (i / flareCount) * Math.PI * 2;
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(Math.cos(angle) * 4, Math.sin(angle) * 4, 0),
            new THREE.Vector3(Math.cos(angle) * 10, Math.sin(angle) * 10, (Math.random() - 0.5) * 5),
            new THREE.Vector3(Math.cos(angle + 0.3) * 6, Math.sin(angle + 0.3) * 6, 0)
        );

        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.15, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: 0xff4500,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const flare = new THREE.Mesh(tubeGeo, tubeMat);
        flare.userData.angle = angle;
        flares.push(flare);
        group.add(flare);
    }

    // Particle eruptions
    const eruptGeo = new THREE.BufferGeometry();
    const eCount = 2000;
    const ePos = new Float32Array(eCount * 3);
    const eColors = new Float32Array(eCount * 3);

    for (let i = 0; i < eCount * 3; i += 3) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 4 + Math.random() * 12;

        ePos[i] = Math.cos(angle) * dist;
        ePos[i + 1] = Math.sin(angle) * dist;
        ePos[i + 2] = (Math.random() - 0.5) * 10;

        const brightness = 0.8 + Math.random() * 0.2;
        eColors[i] = brightness;
        eColors[i + 1] = brightness * 0.5;
        eColors[i + 2] = 0;
    }

    eruptGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
    eruptGeo.setAttribute('color', new THREE.BufferAttribute(eColors, 3));

    const eruptMat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const eruptions = new THREE.Points(eruptGeo, eruptMat);
    group.add(eruptions);

    return { group, sun, corona, flares, eruptions };
}

export function updateSolarForge(data, mouse, time) {
    const { sun, corona, flares, eruptions } = data;

    sun.rotation.y = time * 0.1 + mouse.x * 0.2;
    sun.rotation.x = mouse.y * 0.2;
    sun.scale.setScalar(1 + Math.sin(time * 3) * 0.02);

    corona.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    corona.rotation.z = time * 0.05 - mouse.x * 0.1;

    flares.forEach((flare, i) => {
        flare.rotation.z = time * 0.1 + flare.userData.angle + mouse.y * 0.3;
        flare.rotation.x = mouse.x * 0.2;
        flare.material.opacity = 0.4 + Math.sin(time * 2 + i) * 0.2;
    });

    eruptions.rotation.z = time * 0.03 + mouse.x * 0.1;
    eruptions.rotation.y = time * 0.02 + mouse.y * 0.1;
    eruptions.position.x = -mouse.x * 2;
}
