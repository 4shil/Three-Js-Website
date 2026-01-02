import * as THREE from 'three';

// Scene 8: Fractal Dimension
export function createFractalDimension() {
    const group = new THREE.Group();
    group.position.set(0, 0, -175);

    // Nested cubes (fractal-like)
    const cubes = [];
    const baseMat = new THREE.MeshBasicMaterial({
        color: 0xff1493,
        wireframe: true,
        transparent: true
    });

    for (let i = 0; i < 8; i++) {
        const size = 8 - i * 0.8;
        const cubeGeo = new THREE.BoxGeometry(size, size, size);
        const cubeMat = baseMat.clone();
        cubeMat.opacity = 0.6 - i * 0.05;

        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.userData.index = i;
        cubes.push(cube);
        group.add(cube);
    }

    // Fractal particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 1500;
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
        // Create pattern
        const t = i / 3 / pCount;
        const angle = t * Math.PI * 20;
        const radius = t * 15;

        pPos[i] = Math.cos(angle) * radius * Math.sin(t * 10);
        pPos[i + 1] = Math.sin(angle) * radius * Math.cos(t * 10);
        pPos[i + 2] = (Math.random() - 0.5) * 10;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xff69b4,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const fractalParticles = new THREE.Points(pGeo, pMat);
    group.add(fractalParticles);

    return { group, cubes, fractalParticles };
}

export function updateFractalDimension(data, mouse, time) {
    const { cubes, fractalParticles } = data;

    cubes.forEach((cube, i) => {
        cube.rotation.x = time * 0.2 * (1 + i * 0.1) + mouse.y * 0.5;
        cube.rotation.y = time * 0.15 * (1 - i * 0.05) + mouse.x * 0.5;
        cube.rotation.z = time * 0.1 * (i % 2 ? 1 : -1);

        // Expand on mouse move
        const expansion = Math.max(Math.abs(mouse.x), Math.abs(mouse.y)) * 0.2;
        cube.scale.setScalar(1 + expansion * (i * 0.1));
    });

    fractalParticles.rotation.z = time * 0.05 + mouse.x * 0.2;
    fractalParticles.rotation.y = time * 0.03 + mouse.y * 0.2;
}
