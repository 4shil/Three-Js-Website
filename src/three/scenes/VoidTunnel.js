import * as THREE from 'three';

// Scene 4: Void Tunnel (Event Horizon)
export function createVoidTunnel() {
    const group = new THREE.Group();
    group.position.set(0, 0, -75);

    // Main particle tunnel
    const geometry = new THREE.BufferGeometry();
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 10;

        positions[i] = Math.cos(angle) * radius;
        positions[i + 1] = Math.sin(angle) * radius;
        positions[i + 2] = (Math.random() - 0.5) * 40;

        // White to gray gradient
        const brightness = 0.5 + Math.random() * 0.5;
        colors[i] = brightness;
        colors[i + 1] = brightness;
        colors[i + 2] = brightness;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const tunnel = new THREE.Points(geometry, material);
    group.add(tunnel);

    // Central void sphere
    const voidGeo = new THREE.SphereGeometry(2, 32, 32);
    const voidMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.95
    });
    const voidSphere = new THREE.Mesh(voidGeo, voidMat);
    group.add(voidSphere);

    // Event horizon ring
    const ringGeo = new THREE.TorusGeometry(3, 0.1, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    return { group, tunnel, voidSphere, ring };
}

export function updateVoidTunnel(data, mouse, time) {
    const { tunnel, voidSphere, ring } = data;

    tunnel.rotation.z = time * 0.08 + mouse.x * 0.2;
    tunnel.rotation.y = mouse.x * 0.1;
    tunnel.rotation.x = -mouse.y * 0.1;

    tunnel.scale.x = 1 + Math.sin(time * 1.5) * 0.08 - mouse.y * 0.2;
    tunnel.scale.y = 1 + Math.cos(time * 1.5) * 0.08 + mouse.x * 0.2;

    voidSphere.scale.setScalar(1 + Math.sin(time * 3) * 0.05);
    voidSphere.position.x = -mouse.x * 0.5;
    voidSphere.position.y = mouse.y * 0.5;

    ring.rotation.z = time * 0.5;
    ring.rotation.x = Math.PI / 2 + mouse.y * 0.3;
    ring.rotation.y = -mouse.x * 0.3;
    ring.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
}
