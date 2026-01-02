import * as THREE from 'three';

// SCENE 1: NEBULA GENESIS - Premium Particle Field
// Awwwards-style: Elegant floating particles with soft glow and mouse attraction

export function createParticleField() {
    const group = new THREE.Group();
    group.position.z = 0;

    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = [];

    // Elegant color palette
    const palette = [
        new THREE.Color('#ff3c00'), // Accent orange
        new THREE.Color('#ffffff'), // Pure white
        new THREE.Color('#00ff88'), // Electric green
        new THREE.Color('#8866ff'), // Soft violet
    ];

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Spherical distribution for depth
        const radius = 15 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi) - 5;

        // Random color from palette
        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Variable particle sizes
        sizes[i] = 0.02 + Math.random() * 0.08;

        // Store velocity for animation
        velocities.push({
            x: (Math.random() - 0.5) * 0.002,
            y: (Math.random() - 0.5) * 0.002,
            z: (Math.random() - 0.5) * 0.002,
            baseX: positions[i3],
            baseY: positions[i3 + 1],
            baseZ: positions[i3 + 2]
        });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    material.userData = { baseOpacity: 0.9 };

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    // Central orb glow
    const orbGeometry = new THREE.SphereGeometry(2, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3c00,
        transparent: true,
        opacity: 0.15
    });
    orbMaterial.userData = { baseOpacity: 0.15 };
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    group.add(orb);

    // Outer glow ring
    const ringGeometry = new THREE.RingGeometry(3, 3.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    ringMaterial.userData = { baseOpacity: 0.1 };
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    return { group, particles, velocities, orb, ring };
}

export function updateParticleField(data, mouse, time) {
    const { particles, velocities, orb, ring } = data;
    const positions = particles.geometry.attributes.position.array;

    for (let i = 0; i < velocities.length; i++) {
        const i3 = i * 3;
        const vel = velocities[i];

        // Gentle floating motion
        positions[i3] = vel.baseX + Math.sin(time * 0.5 + i * 0.01) * 0.3;
        positions[i3 + 1] = vel.baseY + Math.cos(time * 0.3 + i * 0.02) * 0.3;
        positions[i3 + 2] = vel.baseZ + Math.sin(time * 0.4 + i * 0.015) * 0.2;

        // Mouse attraction (subtle)
        const dx = mouse.x * 15 - positions[i3];
        const dy = mouse.y * 15 - positions[i3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 8) {
            const force = (8 - dist) / 8 * 0.02;
            positions[i3] += dx * force;
            positions[i3 + 1] += dy * force;
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = time * 0.03;

    // Animate orb
    orb.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    orb.rotation.y = time * 0.1;

    // Animate ring
    ring.rotation.z = time * 0.2;
    ring.scale.setScalar(1 + Math.sin(time) * 0.05);
}
