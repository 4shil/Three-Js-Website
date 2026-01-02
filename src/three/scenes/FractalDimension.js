import * as THREE from 'three';

// SCENE 8: FRACTAL DIMENSION - Nested Geometry
// Awwwards-style: Clean nested cubes with subtle animation

export function createFractalDimension() {
    const group = new THREE.Group();
    group.position.z = -175;

    // Nested cubes
    const cubes = [];
    for (let i = 0; i < 6; i++) {
        const size = 6 - i;
        const cubeGeo = new THREE.BoxGeometry(size, size, size);
        const cubeMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xff3c00 : 0xffffff,
            transparent: true,
            opacity: 0.15 + i * 0.02,
            wireframe: true
        });
        cubeMat.userData = { baseOpacity: 0.15 + i * 0.02 };
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        group.add(cube);
        cubes.push(cube);
    }

    // Spiral particles
    const spiralCount = 500;
    const spiralPositions = new Float32Array(spiralCount * 3);

    for (let i = 0; i < spiralCount; i++) {
        const t = i / spiralCount;
        const angle = t * Math.PI * 8;
        const radius = 3 + t * 8;
        spiralPositions[i * 3] = Math.cos(angle) * radius;
        spiralPositions[i * 3 + 1] = (t - 0.5) * 15;
        spiralPositions[i * 3 + 2] = Math.sin(angle) * radius - 5;
    }

    const spiralGeo = new THREE.BufferGeometry();
    spiralGeo.setAttribute('position', new THREE.BufferAttribute(spiralPositions, 3));

    const spiralMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00ff88,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    spiralMat.userData = { baseOpacity: 0.6 };
    const fractalParticles = new THREE.Points(spiralGeo, spiralMat);
    group.add(fractalParticles);

    return { group, cubes, fractalParticles };
}

export function updateFractalDimension(data, mouse, time) {
    const { cubes, fractalParticles } = data;

    cubes.forEach((cube, i) => {
        cube.rotation.x = time * 0.2 * (1 + i * 0.1) + mouse.y * 0.3;
        cube.rotation.y = time * 0.15 * (1 - i * 0.05) + mouse.x * 0.3;
        cube.rotation.z = time * 0.1 * (i % 2 ? 1 : -1);
    });

    fractalParticles.rotation.y = time * 0.05 + mouse.x * 0.1;
    fractalParticles.rotation.z = time * 0.03;
}
