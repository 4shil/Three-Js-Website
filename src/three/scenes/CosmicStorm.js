import * as THREE from 'three';

// Scene 11: Cosmic Storm
export function createCosmicStorm() {
    const group = new THREE.Group();
    group.position.set(0, 0, -250);

    // Storm clouds (sphere clusters)
    const clouds = [];
    const cloudGeo = new THREE.SphereGeometry(2, 16, 16);
    const cloudMat = new THREE.MeshBasicMaterial({
        color: 0x1a1a3a,
        transparent: true,
        opacity: 0.6
    });

    for (let i = 0; i < 20; i++) {
        const cloud = new THREE.Mesh(cloudGeo, cloudMat.clone());
        cloud.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 20
        );
        cloud.scale.setScalar(0.5 + Math.random() * 1.5);
        cloud.userData.offset = Math.random() * Math.PI * 2;
        clouds.push(cloud);
        group.add(cloud);
    }

    // Lightning bolts (line segments)
    const lightnings = [];

    for (let l = 0; l < 8; l++) {
        const points = [];
        let x = (Math.random() - 0.5) * 20;
        let y = 10;

        for (let p = 0; p < 6; p++) {
            points.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 5));
            x += (Math.random() - 0.5) * 4;
            y -= 3 + Math.random() * 2;
        }

        const lightGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lightMat = new THREE.LineBasicMaterial({
            color: 0x4169e1,
            transparent: true,
            opacity: 0,
            linewidth: 2
        });

        const lightning = new THREE.Line(lightGeo, lightMat);
        lightning.userData.flashTime = Math.random() * 10;
        lightnings.push(lightning);
        group.add(lightning);
    }

    // Storm particles
    const stormGeo = new THREE.BufferGeometry();
    const stormCount = 2000;
    const stormPos = new Float32Array(stormCount * 3);
    const stormVel = new Float32Array(stormCount);

    for (let i = 0; i < stormCount * 3; i += 3) {
        stormPos[i] = (Math.random() - 0.5) * 40;
        stormPos[i + 1] = (Math.random() - 0.5) * 30;
        stormPos[i + 2] = (Math.random() - 0.5) * 30;
        stormVel[i / 3] = 0.05 + Math.random() * 0.1;
    }

    stormGeo.setAttribute('position', new THREE.BufferAttribute(stormPos, 3));

    const stormMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x6495ed,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const stormParticles = new THREE.Points(stormGeo, stormMat);
    stormParticles.userData.velocities = stormVel;
    group.add(stormParticles);

    return { group, clouds, lightnings, stormParticles };
}

export function updateCosmicStorm(data, mouse, time) {
    const { clouds, lightnings, stormParticles } = data;

    // Animate clouds
    clouds.forEach((cloud) => {
        cloud.position.x += Math.sin(time + cloud.userData.offset) * 0.01 + mouse.x * 0.05;
        cloud.position.y += Math.cos(time * 0.5 + cloud.userData.offset) * 0.005 - mouse.y * 0.05;
    });

    // Lightning flashes
    lightnings.forEach((lightning) => {
        const flashCycle = (time * 2) % 10;
        if (Math.abs(flashCycle - lightning.userData.flashTime) < 0.2) {
            lightning.material.opacity = 0.8 + Math.random() * 0.2;
            // Jitter on flash
            lightning.rotation.z = (Math.random() - 0.5) * 0.2;
        } else {
            lightning.material.opacity *= 0.9;
        }

        // Tilt lightning with mouse
        lightning.rotation.x = mouse.y * 0.2;
        lightning.rotation.y = -mouse.x * 0.2;
    });

    // Animate storm particles
    const positions = stormParticles.geometry.attributes.position.array;
    const velocities = stormParticles.userData.velocities;

    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i / 3] * 0.5 + mouse.x * 0.2; // Wind effect
        positions[i + 1] -= velocities[i / 3] * 0.3 + mouse.y * 0.2;

        // Reset particles that go out of bounds
        if (positions[i] > 20) positions[i] = -20;
        if (positions[i] < -20) positions[i] = 20;
        if (positions[i + 1] < -15) positions[i + 1] = 15;
        if (positions[i + 1] > 15) positions[i + 1] = -15;
    }

    stormParticles.geometry.attributes.position.needsUpdate = true;
}
