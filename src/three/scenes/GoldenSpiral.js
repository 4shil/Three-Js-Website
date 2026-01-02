import * as THREE from 'three';

// SCENE 12: GOLDEN SPIRAL - Fibonacci Geometry
// Awwwards-style: Elegant mathematical visualization

export function createGoldenSpiral() {
    const group = new THREE.Group();
    group.position.z = -275;

    // Golden spiral curve
    const spiralPoints = [];
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

    for (let i = 0; i < 200; i++) {
        const angle = i * 0.1;
        const radius = Math.pow(phi, angle / (Math.PI * 2)) * 0.3;
        spiralPoints.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        ));
    }

    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
    const spiralGeo = new THREE.TubeGeometry(spiralCurve, 200, 0.08, 8, false);
    const spiralMat = new THREE.MeshBasicMaterial({
        color: 0xffcc00,
        transparent: true,
        opacity: 0.6
    });
    spiralMat.userData = { baseOpacity: 0.6 };
    const spiral = new THREE.Mesh(spiralGeo, spiralMat);
    group.add(spiral);

    // Fibonacci squares (simplified as rings)
    const squares = [];
    const fibSizes = [1, 1, 2, 3, 5, 8];
    let posX = 0, posY = 0;

    for (let i = 0; i < fibSizes.length; i++) {
        const size = fibSizes[i] * 0.5;
        const squareGeo = new THREE.RingGeometry(size, size + 0.05, 4);
        const squareMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        squareMat.userData = { baseOpacity: 0.15 };
        const square = new THREE.Mesh(squareGeo, squareMat);
        square.rotation.z = Math.PI / 4;
        square.position.set(posX, posY, -i * 0.5);
        square.userData = { index: i };
        group.add(square);
        squares.push(square);

        // Fibonacci positioning
        posX += size * (i % 2 ? 1 : -1);
        posY += size * (i % 2 ? -1 : 1);
    }

    // Golden particles
    const particleCount = 400;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 10;
        const radius = 1 + (i / particleCount) * 12;
        particlePositions[i * 3] = Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xffcc00,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    particleMat.userData = { baseOpacity: 0.6 };
    const goldenParticles = new THREE.Points(particleGeo, particleMat);
    group.add(goldenParticles);

    return { group, spiral, squares, goldenParticles };
}

export function updateGoldenSpiral(data, mouse, time) {
    const { spiral, squares, goldenParticles } = data;

    spiral.rotation.z = time * 0.1 + mouse.x * 0.3;

    squares.forEach((square) => {
        square.rotation.z = Math.PI / 4 + time * 0.05 * (square.userData.index % 2 ? 1 : -1);
    });

    goldenParticles.rotation.z = time * 0.05 + mouse.x * 0.1;
}
