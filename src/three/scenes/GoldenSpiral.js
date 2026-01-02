import * as THREE from 'three';

// SCENE 12: CONSTELLATION - Beautiful connected star map
// Elegant network of stars with glowing connections

export function createGoldenSpiral() {
    const group = new THREE.Group();
    group.position.z = -275;

    // Star nodes
    const stars = [];
    const starCount = 40;
    const starPositions = [];

    for (let i = 0; i < starCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 5 + Math.random() * 8;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi) * 0.5;

        starPositions.push(new THREE.Vector3(x, y, z));

        // Star sphere
        const starGeo = new THREE.SphereGeometry(0.15 + Math.random() * 0.2, 16, 16);
        const starMat = new THREE.MeshBasicMaterial({
            color: i % 5 === 0 ? 0xff3c00 : (i % 3 === 0 ? 0x00ff88 : 0xffffff),
            transparent: true,
            opacity: 0.9
        });
        starMat.userData = { baseOpacity: 0.9 };
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.set(x, y, z);
        star.userData = { originalPos: new THREE.Vector3(x, y, z), index: i };
        group.add(star);
        stars.push(star);
    }

    // Connecting lines between nearby stars
    const connections = [];
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15
    });
    lineMaterial.userData = { baseOpacity: 0.15 };

    for (let i = 0; i < starPositions.length; i++) {
        for (let j = i + 1; j < starPositions.length; j++) {
            const dist = starPositions[i].distanceTo(starPositions[j]);
            if (dist < 6) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints([
                    starPositions[i],
                    starPositions[j]
                ]);
                const line = new THREE.Line(lineGeo, lineMaterial.clone());
                line.material.opacity = 0.15 * (1 - dist / 6);
                line.material.userData = { baseOpacity: 0.15 * (1 - dist / 6) };
                group.add(line);
                connections.push(line);
            }
        }
    }

    // Ambient stardust particles
    const dustCount = 800;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
        dustPositions[i * 3] = (Math.random() - 0.5) * 30;
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
        dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const brightness = 0.4 + Math.random() * 0.6;
        dustColors[i * 3] = brightness;
        dustColors[i * 3 + 1] = brightness;
        dustColors[i * 3 + 2] = brightness;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    dustMat.userData = { baseOpacity: 0.6 };
    const stardust = new THREE.Points(dustGeo, dustMat);
    group.add(stardust);

    // Central glow
    const glowGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff3c00,
        transparent: true,
        opacity: 0.1
    });
    glowMat.userData = { baseOpacity: 0.1 };
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);

    return { group, stars, connections, stardust, glow };
}

export function updateGoldenSpiral(data, mouse, time) {
    const { stars, stardust, glow } = data;

    // Subtle star pulsing
    stars.forEach((star) => {
        const pulse = 1 + Math.sin(time * 2 + star.userData.index * 0.5) * 0.2;
        star.scale.setScalar(pulse);

        // Gentle floating motion
        const orig = star.userData.originalPos;
        star.position.x = orig.x + Math.sin(time + star.userData.index) * 0.1;
        star.position.y = orig.y + Math.cos(time * 0.7 + star.userData.index) * 0.1;
    });

    // Stardust rotation
    stardust.rotation.y = time * 0.02 + mouse.x * 0.1;
    stardust.rotation.x = mouse.y * 0.05;

    // Glow breathing
    glow.scale.setScalar(1.5 + Math.sin(time) * 0.3);
    glow.rotation.y = time * 0.1;
}
