import * as THREE from 'three';

// Scene 10: Mirror Realm
export function createMirrorRealm() {
    const group = new THREE.Group();
    group.position.set(0, 0, -225);

    // Central mirror
    const mirrorGeo = new THREE.PlaneGeometry(12, 12);
    const mirrorMat = new THREE.MeshBasicMaterial({
        color: 0xc0c0c0,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    group.add(mirror);

    // Mirror frame
    const frameGeo = new THREE.TorusGeometry(8, 0.2, 8, 64);
    const frameMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    // Reflected objects (symmetric pairs)
    const objects = [];
    const objGeo = new THREE.TetrahedronGeometry(0.8, 0);
    const objMat = new THREE.MeshBasicMaterial({
        color: 0xc0c0c0,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    for (let i = 0; i < 15; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = 2 + Math.random() * 5;

        // Original
        const obj1 = new THREE.Mesh(objGeo, objMat.clone());
        obj1.position.set(x, y, z);
        obj1.userData.offset = Math.random() * Math.PI * 2;
        objects.push(obj1);
        group.add(obj1);

        // Reflection
        const obj2 = new THREE.Mesh(objGeo, objMat.clone());
        obj2.position.set(x, y, -z);
        obj2.userData.offset = obj1.userData.offset;
        obj2.userData.isReflection = true;
        objects.push(obj2);
        group.add(obj2);
    }

    // Shimmer particles
    const shimmerGeo = new THREE.BufferGeometry();
    const shimmerCount = 1000;
    const shimmerPos = new Float32Array(shimmerCount * 3);

    for (let i = 0; i < shimmerCount * 3; i += 3) {
        shimmerPos[i] = (Math.random() - 0.5) * 20;
        shimmerPos[i + 1] = (Math.random() - 0.5) * 15;
        shimmerPos[i + 2] = (Math.random() - 0.5) * 15;
    }

    shimmerGeo.setAttribute('position', new THREE.BufferAttribute(shimmerPos, 3));

    const shimmerMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const shimmer = new THREE.Points(shimmerGeo, shimmerMat);
    group.add(shimmer);

    return { group, mirror, frame, objects, shimmer };
}

export function updateMirrorRealm(data, mouse, time) {
    const { mirror, frame, objects, shimmer } = data;

    mirror.rotation.y = Math.sin(time * 0.3) * 0.1 - mouse.x * 0.2;
    mirror.rotation.x = mouse.y * 0.1;
    mirror.material.opacity = 0.25 + Math.sin(time * 2) * 0.1;

    frame.rotation.z = time * 0.1;
    frame.rotation.y = -mouse.x * 0.1;
    frame.rotation.x = mouse.y * 0.1;

    objects.forEach((obj) => {
        obj.rotation.x = time * 0.5 + obj.userData.offset + mouse.y * 0.5;
        obj.rotation.y = time * 0.3 + obj.userData.offset + mouse.x * 0.5;

        // Mirror reflection effect
        if (obj.userData.isReflection) {
            obj.rotation.x = -obj.rotation.x;
        }
    });

    shimmer.rotation.y = time * 0.02 + mouse.x * 0.2;
    shimmer.rotation.x = -mouse.y * 0.2;
}
