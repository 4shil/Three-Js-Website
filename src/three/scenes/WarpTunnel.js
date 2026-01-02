import * as THREE from 'three';

// SCENE 13: WARP TUNNEL - Speed Effect
// Awwwards-style: Minimal rings rushing past

export function createWarpTunnel() {
    const group = new THREE.Group();
    group.position.z = -300;

    // Tunnel rings
    const rings = [];
    for (let i = 0; i < 20; i++) {
        const ringGeo = new THREE.RingGeometry(3 + Math.random() * 2, 3.5 + Math.random() * 2, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: i % 4 === 0 ? 0xff3c00 : 0xffffff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        ringMat.userData = { baseOpacity: 0.2 };
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.z = -i * 3 - 5;
        ring.userData = { baseZ: -i * 3 - 5 };
        group.add(ring);
        rings.push(ring);
    }

    // Speed lines
    const lineCount = 100;
    const linePositions = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 6;
        const z = Math.random() * -60;

        linePositions[i * 6] = Math.cos(angle) * radius;
        linePositions[i * 6 + 1] = Math.sin(angle) * radius;
        linePositions[i * 6 + 2] = z;
        linePositions[i * 6 + 3] = Math.cos(angle) * radius;
        linePositions[i * 6 + 4] = Math.sin(angle) * radius;
        linePositions[i * 6 + 5] = z - 3;
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.4
    });
    lineMat.userData = { baseOpacity: 0.4 };
    const speedLines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(speedLines);

    // Central light point
    const lightGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const lightMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
    });
    lightMat.userData = { baseOpacity: 0.9 };
    const centerLight = new THREE.Mesh(lightGeo, lightMat);
    centerLight.position.z = -60;
    group.add(centerLight);

    // Warp particles
    const warpCount = 400;
    const warpPositions = new Float32Array(warpCount * 3);

    for (let i = 0; i < warpCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 1 + Math.random() * 8;
        warpPositions[i * 3] = Math.cos(angle) * radius;
        warpPositions[i * 3 + 1] = Math.sin(angle) * radius;
        warpPositions[i * 3 + 2] = Math.random() * -60;
    }

    const warpGeo = new THREE.BufferGeometry();
    warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPositions, 3));

    const warpMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    warpMat.userData = { baseOpacity: 0.5 };
    const warpParticles = new THREE.Points(warpGeo, warpMat);
    group.add(warpParticles);

    return { group, rings, speedLines, centerLight, warpParticles };
}

export function updateWarpTunnel(data, mouse, time) {
    const { rings, speedLines, centerLight, warpParticles } = data;

    // Rings rushing forward
    rings.forEach((ring, i) => {
        ring.position.z = ring.userData.baseZ + (time * 15) % 60;
        if (ring.position.z > 10) ring.position.z -= 60;
        ring.rotation.z = time * 0.3 + i * 0.1;
    });

    // Speed lines
    const linePos = speedLines.geometry.attributes.position.array;
    for (let i = 0; i < linePos.length; i += 6) {
        linePos[i + 2] += 0.8;
        linePos[i + 5] += 0.8;
        if (linePos[i + 2] > 10) {
            linePos[i + 2] -= 70;
            linePos[i + 5] -= 70;
        }
    }
    speedLines.geometry.attributes.position.needsUpdate = true;

    // Pulsing center
    centerLight.scale.setScalar(1 + Math.sin(time * 5) * 0.3);
    centerLight.position.x = mouse.x * 2;
    centerLight.position.y = mouse.y * 2;

    // Warp particles
    const warpPos = warpParticles.geometry.attributes.position.array;
    for (let i = 0; i < warpPos.length; i += 3) {
        warpPos[i + 2] += 0.5;
        if (warpPos[i + 2] > 10) warpPos[i + 2] -= 70;
    }
    warpParticles.geometry.attributes.position.needsUpdate = true;
}
