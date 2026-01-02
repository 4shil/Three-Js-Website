import * as THREE from 'three';

// SCENE 11: COSMIC STORM - Atmospheric Turbulence
// Awwwards-style: Subtle lightning and flowing particles

export function createCosmicStorm() {
    const group = new THREE.Group();
    group.position.z = -250;

    // Storm clouds (abstract spheres)
    const clouds = [];
    for (let i = 0; i < 8; i++) {
        const cloudGeo = new THREE.SphereGeometry(2 + Math.random() * 2, 16, 16);
        const cloudMat = new THREE.MeshBasicMaterial({
            color: 0x222233,
            transparent: true,
            opacity: 0.3
        });
        cloudMat.userData = { baseOpacity: 0.3 };
        const cloud = new THREE.Mesh(cloudGeo, cloudMat);
        cloud.position.set(
            (Math.random() - 0.5) * 20,
            5 + Math.random() * 5,
            (Math.random() - 0.5) * 15 - 5
        );
        cloud.userData = { offset: Math.random() * Math.PI * 2 };
        group.add(cloud);
        clouds.push(cloud);
    }

    // Lightning bolts (simple lines)
    const lightnings = [];
    for (let i = 0; i < 5; i++) {
        const points = [];
        const startX = (Math.random() - 0.5) * 15;
        let y = 10;
        points.push(new THREE.Vector3(startX, y, -5));
        for (let j = 0; j < 5; j++) {
            y -= 2 + Math.random() * 2;
            points.push(new THREE.Vector3(startX + (Math.random() - 0.5) * 3, y, -5 + (Math.random() - 0.5) * 2));
        }

        const lightningGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lightningMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0
        });
        lightningMat.userData = { baseOpacity: 0.9 };
        const lightning = new THREE.Line(lightningGeo, lightningMat);
        lightning.userData = { flashTime: i * 2 };
        group.add(lightning);
        lightnings.push(lightning);
    }

    // Storm particles
    const stormCount = 600;
    const stormPositions = new Float32Array(stormCount * 3);
    const velocities = [];

    for (let i = 0; i < stormCount; i++) {
        stormPositions[i * 3] = (Math.random() - 0.5) * 30;
        stormPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        stormPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
        velocities.push(0.02 + Math.random() * 0.05);
    }

    const stormGeo = new THREE.BufferGeometry();
    stormGeo.setAttribute('position', new THREE.BufferAttribute(stormPositions, 3));

    const stormMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x8888ff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    stormMat.userData = { baseOpacity: 0.5 };
    const stormParticles = new THREE.Points(stormGeo, stormMat);
    stormParticles.userData = { velocities };
    group.add(stormParticles);

    return { group, clouds, lightnings, stormParticles };
}

export function updateCosmicStorm(data, mouse, time) {
    const { clouds, lightnings, stormParticles } = data;

    clouds.forEach((cloud) => {
        cloud.position.x += Math.sin(time + cloud.userData.offset) * 0.01;
        cloud.position.y += Math.cos(time * 0.5 + cloud.userData.offset) * 0.005;
    });

    // Lightning flashes
    lightnings.forEach((lightning) => {
        const flashCycle = (time * 2) % 10;
        if (Math.abs(flashCycle - lightning.userData.flashTime) < 0.15) {
            lightning.material.opacity = 0.8 + Math.random() * 0.2;
        } else {
            lightning.material.opacity *= 0.85;
        }
    });

    // Animate particles
    const positions = stormParticles.geometry.attributes.position.array;
    const velocities = stormParticles.userData.velocities;

    for (let i = 0; i < velocities.length; i++) {
        positions[i * 3] += velocities[i] * 0.5 + mouse.x * 0.05;
        if (positions[i * 3] > 15) positions[i * 3] = -15;
        if (positions[i * 3] < -15) positions[i * 3] = 15;
    }
    stormParticles.geometry.attributes.position.needsUpdate = true;
}
