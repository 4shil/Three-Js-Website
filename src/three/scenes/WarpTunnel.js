import * as THREE from 'three';

// Scene 13: Warp Tunnel
export function createWarpTunnel() {
    const group = new THREE.Group();
    group.position.set(0, 0, -300);

    // Tunnel rings
    const rings = [];
    const ringCount = 30;

    for (let i = 0; i < ringCount; i++) {
        const ringGeo = new THREE.TorusGeometry(4 + i * 0.2, 0.05, 8, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xff4500,
            transparent: true,
            opacity: 0.6 - i * 0.015
        });

        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.z = -i * 2;
        ring.rotation.x = Math.PI / 2;
        ring.userData.baseZ = -i * 2;
        rings.push(ring);
        group.add(ring);
    }

    // Speed lines
    const lineCount = 200;
    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(lineCount * 6); // 2 points per line

    for (let i = 0; i < lineCount * 6; i += 6) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 5;
        const z = (Math.random() - 0.5) * 60;

        linePos[i] = Math.cos(angle) * radius;
        linePos[i + 1] = Math.sin(angle) * radius;
        linePos[i + 2] = z;

        linePos[i + 3] = Math.cos(angle) * radius;
        linePos[i + 4] = Math.sin(angle) * radius;
        linePos[i + 5] = z - 3;
    }

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));

    const lineMat = new THREE.LineBasicMaterial({
        color: 0xff6347,
        transparent: true,
        opacity: 0.5
    });

    const speedLines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(speedLines);

    // Central light
    const lightGeo = new THREE.SphereGeometry(1, 16, 16);
    const lightMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const centerLight = new THREE.Mesh(lightGeo, lightMat);
    centerLight.position.z = -60;
    group.add(centerLight);

    // Warp particles
    const warpGeo = new THREE.BufferGeometry();
    const warpCount = 1500;
    const warpPos = new Float32Array(warpCount * 3);

    for (let i = 0; i < warpCount * 3; i += 3) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 6;

        warpPos[i] = Math.cos(angle) * radius;
        warpPos[i + 1] = Math.sin(angle) * radius;
        warpPos[i + 2] = (Math.random() - 0.5) * 60;
    }

    warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPos, 3));

    const warpMat = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xff7f50,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const warpParticles = new THREE.Points(warpGeo, warpMat);
    group.add(warpParticles);

    return { group, rings, speedLines, centerLight, warpParticles };
}

export function updateWarpTunnel(data, mouse, time) {
    const { rings, speedLines, centerLight, warpParticles } = data;

    // Animate rings moving toward viewer
    rings.forEach((ring, i) => {
        ring.position.z = ring.userData.baseZ + (time * 10) % 60;
        if (ring.position.z > 30) {
            ring.position.z -= 60;
        }
        ring.rotation.z = time * 0.5 + i * 0.1 + mouse.x * 0.5;

        // Steer rings
        ring.position.x = mouse.x * 5 * (ring.position.z + 60) / 60;
        ring.position.y = mouse.y * 5 * (ring.position.z + 60) / 60;
    });

    // Animate speed lines
    const positions = speedLines.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 6) {
        positions[i + 2] += 0.5 + mouse.y * 0.2; // Speed up/dwn
        positions[i + 5] += 0.5 + mouse.y * 0.2;

        if (positions[i + 2] > 30) {
            positions[i + 2] -= 60;
            positions[i + 5] -= 60;
        }

        // Shift lines based on mouse
        positions[i] += mouse.x * 0.1;
        positions[i + 3] += mouse.x * 0.1;
    }
    speedLines.geometry.attributes.position.needsUpdate = true;

    // Pulse center light
    centerLight.scale.setScalar(1 + Math.sin(time * 5) * 0.2);
    centerLight.position.x = mouse.x * 2;
    centerLight.position.y = mouse.y * 2;

    // Animate warp particles
    const warpPos = warpParticles.geometry.attributes.position.array;
    for (let i = 0; i < warpPos.length; i += 3) {
        warpPos[i + 2] += 0.3;
        if (warpPos[i + 2] > 30) {
            warpPos[i + 2] -= 60;
        }
    }
    warpParticles.geometry.attributes.position.needsUpdate = true;
    warpParticles.rotation.z = -mouse.x * 0.5;
}
