import * as THREE from 'three';

// Scene 3: Digital Grid Terrain
export function createGridTerrain() {
    const group = new THREE.Group();
    group.position.set(0, -3, -50);

    // Main grid
    const gridHelper = new THREE.GridHelper(80, 80, 0x00ff00, 0x0a2a0a);
    gridHelper.position.y = 0;
    group.add(gridHelper);

    // Secondary grid (finer)
    const gridHelper2 = new THREE.GridHelper(80, 160, 0x00ff00, 0x051505);
    gridHelper2.position.y = 0.01;
    gridHelper2.material.opacity = 0.3;
    gridHelper2.material.transparent = true;
    group.add(gridHelper2);

    // Mountains
    const mountains = [];
    const mtnGeo = new THREE.ConeGeometry(1, 4, 4);
    const mtnMat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    for (let i = 0; i < 30; i++) {
        const mtn = new THREE.Mesh(mtnGeo, mtnMat.clone());
        mtn.position.set(
            (Math.random() - 0.5) * 60,
            2,
            (Math.random() - 0.5) * 60
        );
        mtn.scale.setScalar(Math.random() * 2.5 + 1);
        mtn.userData.offset = Math.random() * Math.PI * 2;
        mountains.push(mtn);
        group.add(mtn);
    }

    // Floating data cubes
    const cubes = [];
    const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cubeMat = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        wireframe: true
    });

    for (let i = 0; i < 50; i++) {
        const cube = new THREE.Mesh(cubeGeo, cubeMat.clone());
        cube.position.set(
            (Math.random() - 0.5) * 50,
            Math.random() * 8 + 2,
            (Math.random() - 0.5) * 50
        );
        cube.userData.offset = Math.random() * Math.PI * 2;
        cube.userData.speed = Math.random() * 0.5 + 0.5;
        cubes.push(cube);
        group.add(cube);
    }

    return { group, gridHelper, mountains, cubes };
}

export function updateGridTerrain(data, mouse, time) {
    const { gridHelper, mountains, cubes } = data;

    // Moving grid effect
    gridHelper.position.z = (time * 3) % 2;
    gridHelper.rotation.x = mouse.y * 0.1;
    gridHelper.rotation.z = -mouse.x * 0.1;

    // Animate mountains
    mountains.forEach((mtn) => {
        mtn.rotation.y += 0.008;
        mtn.position.y = 2 + Math.sin(time + mtn.userData.offset) * 0.6;
        // Subtle paralax
        mtn.rotation.z = -mouse.x * 0.05;
    });

    // Animate cubes
    cubes.forEach((cube) => {
        cube.rotation.x += 0.02 * cube.userData.speed;
        cube.rotation.y += 0.01 * cube.userData.speed;
        cube.position.y = cube.position.y + Math.sin(time * cube.userData.speed + cube.userData.offset) * 0.01;

        // Repel from mouse slightly
        cube.position.x += mouse.x * 0.01 * cube.userData.speed;
    });
}
