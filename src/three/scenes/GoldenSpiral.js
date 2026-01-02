import * as THREE from 'three';

// Scene 12: Golden Spiral
export function createGoldenSpiral() {
    const group = new THREE.Group();
    group.position.set(0, 0, -275);

    // Golden spiral curve
    const spiralPoints = [];
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

    for (let t = 0; t < 20; t += 0.05) {
        const r = Math.pow(phi, t / (2 * Math.PI)) * 0.5;
        spiralPoints.push(new THREE.Vector3(
            Math.cos(t) * r,
            Math.sin(t) * r,
            t * 0.1 - 1
        ));
    }

    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
    const spiralGeo = new THREE.TubeGeometry(spiralCurve, 200, 0.1, 8, false);
    const spiralMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });

    const spiral = new THREE.Mesh(spiralGeo, spiralMat);
    group.add(spiral);

    // Fibonacci squares
    const squares = [];
    const fibNums = [1, 1, 2, 3, 5, 8, 13];
    let posX = 0, posY = 0;

    fibNums.forEach((num, i) => {
        const squareGeo = new THREE.PlaneGeometry(num * 0.5, num * 0.5);
        const squareMat = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.15 - i * 0.015,
            side: THREE.DoubleSide,
            wireframe: true
        });

        const square = new THREE.Mesh(squareGeo, squareMat);
        square.position.set(posX, posY, -1);
        square.userData.index = i;
        squares.push(square);
        group.add(square);

        // Update position for next square
        const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        const dir = directions[i % 4];
        posX += dir[0] * num * 0.25;
        posY += dir[1] * num * 0.25;
    });

    // Golden particles
    const goldenGeo = new THREE.BufferGeometry();
    const goldenCount = 1200;
    const goldenPos = new Float32Array(goldenCount * 3);

    for (let i = 0; i < goldenCount; i++) {
        const t = (i / goldenCount) * 20;
        const r = Math.pow(phi, t / (2 * Math.PI)) * 0.5;
        const offset = (Math.random() - 0.5) * 2;

        goldenPos[i * 3] = Math.cos(t) * r + offset;
        goldenPos[i * 3 + 1] = Math.sin(t) * r + offset;
        goldenPos[i * 3 + 2] = t * 0.1 - 1 + (Math.random() - 0.5);
    }

    goldenGeo.setAttribute('position', new THREE.BufferAttribute(goldenPos, 3));

    const goldenMat = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xffd700,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const goldenParticles = new THREE.Points(goldenGeo, goldenMat);
    group.add(goldenParticles);

    return { group, spiral, squares, goldenParticles };
}

export function updateGoldenSpiral(data, mouse, time) {
    const { spiral, squares, goldenParticles } = data;

    spiral.rotation.z = time * 0.1 + mouse.x * 0.5;
    spiral.rotation.x = mouse.y * 0.3;

    squares.forEach((square) => {
        square.rotation.z = time * 0.05 * (square.userData.index % 2 ? 1 : -1) + mouse.x * 0.2;
        square.material.opacity = 0.1 + Math.sin(time + square.userData.index) * 0.05;

        // React to mouse
        const scale = 1 + mouse.y * 0.1 * (square.userData.index % 3 - 1);
        square.scale.setScalar(scale);
    });

    goldenParticles.rotation.z = time * 0.08 - mouse.x * 0.2;
    goldenParticles.rotation.y = mouse.y * 0.2;
}
