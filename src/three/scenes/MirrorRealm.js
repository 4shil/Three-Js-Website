import * as THREE from 'three';

// SCENE 10: MIRROR REALM - Reflective Symmetry
// Awwwards-style: Central mirror plane with symmetric objects

export function createMirrorRealm() {
    const group = new THREE.Group();
    group.position.z = -225;

    // Central mirror plane
    const mirrorGeo = new THREE.PlaneGeometry(15, 15);
    const mirrorMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
    });
    mirrorMat.userData = { baseOpacity: 0.08 };
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    group.add(mirror);

    // Mirror frame
    const frameGeo = new THREE.RingGeometry(7, 7.5, 64);
    const frameMat = new THREE.MeshBasicMaterial({
        color: 0xff3c00,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    frameMat.userData = { baseOpacity: 0.3 };
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    // Symmetric floating objects
    const objects = [];
    const shapes = [
        new THREE.TetrahedronGeometry(0.5),
        new THREE.OctahedronGeometry(0.4),
        new THREE.BoxGeometry(0.5, 0.5, 0.5)
    ];

    for (let i = 0; i < 12; i++) {
        const geo = shapes[i % shapes.length];
        const mat = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0x00ff88 : 0xffffff,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        mat.userData = { baseOpacity: 0.6 };

        const obj = new THREE.Mesh(geo, mat);
        const angle = (i / 12) * Math.PI * 2;
        const radius = 4 + (i % 3);
        obj.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 2);
        obj.userData = { offset: i * 0.5, isReflection: false };
        group.add(obj);
        objects.push(obj);

        // Mirror reflection
        const reflection = obj.clone();
        reflection.position.z = -2;
        reflection.userData = { offset: i * 0.5, isReflection: true };
        group.add(reflection);
        objects.push(reflection);
    }

    // Shimmer particles
    const shimmerCount = 400;
    const shimmerPositions = new Float32Array(shimmerCount * 3);

    for (let i = 0; i < shimmerCount; i++) {
        shimmerPositions[i * 3] = (Math.random() - 0.5) * 20;
        shimmerPositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        shimmerPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const shimmerGeo = new THREE.BufferGeometry();
    shimmerGeo.setAttribute('position', new THREE.BufferAttribute(shimmerPositions, 3));

    const shimmerMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    shimmerMat.userData = { baseOpacity: 0.3 };
    const shimmer = new THREE.Points(shimmerGeo, shimmerMat);
    group.add(shimmer);

    return { group, mirror, frame, objects, shimmer };
}

export function updateMirrorRealm(data, mouse, time) {
    const { mirror, frame, objects, shimmer } = data;

    mirror.rotation.y = Math.sin(time * 0.3) * 0.1 + mouse.x * 0.1;
    frame.rotation.z = time * 0.1;

    objects.forEach((obj) => {
        obj.rotation.x = time * 0.5 + obj.userData.offset;
        obj.rotation.y = time * 0.3 + obj.userData.offset;
        if (obj.userData.isReflection) {
            obj.rotation.x = -obj.rotation.x;
        }
    });

    shimmer.rotation.y = time * 0.02 + mouse.x * 0.1;
}
