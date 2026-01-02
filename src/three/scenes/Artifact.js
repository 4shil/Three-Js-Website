import * as THREE from 'three';

// Scene 2: Crystal Artifact (Icosahedron)
export function createArtifact() {
    const group = new THREE.Group();
    group.position.set(5, 0, -25);

    // Main crystal
    const geometry = new THREE.IcosahedronGeometry(3.5, 1);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xff00aa,
        metalness: 0.95,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        flatShading: true,
        envMapIntensity: 2
    });

    const crystal = new THREE.Mesh(geometry, material);
    group.add(crystal);

    // Inner glow
    const innerGeo = new THREE.IcosahedronGeometry(2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0xff44cc,
        transparent: true,
        opacity: 0.3
    });
    const innerCrystal = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerCrystal);

    // Outer wireframe cage
    const wireGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const wireCage = new THREE.Mesh(wireGeo, wireMat);
    group.add(wireCage);

    // Orbiting particles
    const orbitGeo = new THREE.BufferGeometry();
    const orbitCount = 200;
    const orbitPos = new Float32Array(orbitCount * 3);

    for (let i = 0; i < orbitCount * 3; i += 3) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 2;
        orbitPos[i] = Math.cos(angle) * radius;
        orbitPos[i + 1] = (Math.random() - 0.5) * 4;
        orbitPos[i + 2] = Math.sin(angle) * radius;
    }
    orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));

    const orbitMat = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xff88dd,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const orbitParticles = new THREE.Points(orbitGeo, orbitMat);
    group.add(orbitParticles);

    return { group, crystal, innerCrystal, wireCage, orbitParticles };
}

export function updateArtifact(data, mouse, time) {
    const { crystal, innerCrystal, wireCage, orbitParticles } = data;

    crystal.rotation.y = time * 0.3 + mouse.x * 0.5;
    crystal.rotation.z = Math.sin(time * 0.5) * 0.15 - mouse.y * 0.3;

    innerCrystal.rotation.y = -time * 0.5;
    innerCrystal.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

    wireCage.rotation.x = time * 0.15 + mouse.y * 0.2;
    wireCage.rotation.y = -time * 0.1 + mouse.x * 0.2;

    orbitParticles.rotation.y = time * 0.2 + mouse.x * 0.1;
    orbitParticles.rotation.x = mouse.y * 0.2;
}
