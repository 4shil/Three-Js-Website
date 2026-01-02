import * as THREE from 'three';

// SCENE 4: VOID TUNNEL - Abstract Depth
// Awwwards-style: Minimal rings receding into infinity

export function createVoidTunnel() {
    const group = new THREE.Group();
    group.position.z = -75;

    // Concentric rings
    const rings = [];
    for (let i = 0; i < 15; i++) {
        const radius = 3 + i * 0.8;
        const ringGeo = new THREE.RingGeometry(radius, radius + 0.05, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: i % 4 === 0 ? 0xff3c00 : 0xffffff,
            transparent: true,
            opacity: 0.3 - i * 0.015,
            side: THREE.DoubleSide
        });
        ringMat.userData = { baseOpacity: 0.3 - i * 0.015 };
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.z = -i * 2;
        ring.userData = { baseZ: -i * 2, index: i };
        group.add(ring);
        rings.push(ring);
    }

    // Central void sphere
    const voidGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const voidMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 1
    });
    voidMat.userData = { baseOpacity: 1 };
    const voidSphere = new THREE.Mesh(voidGeo, voidMat);
    voidSphere.position.z = -30;
    group.add(voidSphere);

    // Particle stream flowing toward void
    const streamCount = 400;
    const streamPositions = new Float32Array(streamCount * 3);
    const streamVelocities = [];

    for (let i = 0; i < streamCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 10;
        streamPositions[i * 3] = Math.cos(angle) * radius;
        streamPositions[i * 3 + 1] = Math.sin(angle) * radius;
        streamPositions[i * 3 + 2] = Math.random() * -30;
        streamVelocities.push(0.05 + Math.random() * 0.1);
    }

    const streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));

    const streamMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x8866ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    streamMat.userData = { baseOpacity: 0.6 };
    const stream = new THREE.Points(streamGeo, streamMat);
    stream.userData = { velocities: streamVelocities };
    group.add(stream);

    return { group, rings, voidSphere, stream };
}

export function updateVoidTunnel(data, mouse, time) {
    const { rings, voidSphere, stream } = data;

    // Animate rings
    rings.forEach((ring, i) => {
        ring.rotation.z = time * 0.1 * (i % 2 ? 1 : -1);
        ring.scale.setScalar(1 + Math.sin(time + i * 0.3) * 0.05);
    });

    // Pulsing void
    voidSphere.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    voidSphere.position.x = mouse.x * 0.5;
    voidSphere.position.y = mouse.y * 0.5;

    // Animate particle stream toward void
    const positions = stream.geometry.attributes.position.array;
    const velocities = stream.userData.velocities;

    for (let i = 0; i < velocities.length; i++) {
        positions[i * 3 + 2] -= velocities[i];
        if (positions[i * 3 + 2] < -35) {
            positions[i * 3 + 2] = 5;
        }
    }
    stream.geometry.attributes.position.needsUpdate = true;
    stream.rotation.z = time * 0.05 + mouse.x * 0.1;
}
