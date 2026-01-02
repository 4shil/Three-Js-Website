import * as THREE from 'three';

// SCENE 9: NEURAL PULSE - Connected Network
// Awwwards-style: Elegant nodes with glowing connections

export function createNeuralPulse() {
    const group = new THREE.Group();
    group.position.z = -200;

    // Create nodes
    const nodes = [];
    const nodePositions = [];
    for (let i = 0; i < 25; i++) {
        const nodeGeo = new THREE.SphereGeometry(0.2 + Math.random() * 0.2, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({
            color: i % 4 === 0 ? 0xff3c00 : 0x00ff88,
            transparent: true,
            opacity: 0.8
        });
        nodeMat.userData = { baseOpacity: 0.8 };
        const node = new THREE.Mesh(nodeGeo, nodeMat);

        const pos = new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10 - 5
        );
        node.position.copy(pos);
        node.userData = { pulseOffset: Math.random() * Math.PI * 2 };

        group.add(node);
        nodes.push(node);
        nodePositions.push(pos);
    }

    // Create connections between nearby nodes
    const connections = [];
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15
    });
    lineMaterial.userData = { baseOpacity: 0.15 };

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dist = nodePositions[i].distanceTo(nodePositions[j]);
            if (dist < 8) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints([
                    nodePositions[i], nodePositions[j]
                ]);
                const line = new THREE.Line(lineGeo, lineMaterial.clone());
                group.add(line);
                connections.push(line);
            }
        }
    }

    // Ambient particles
    const particleCount = 400;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 30;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x8866ff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    particleMat.userData = { baseOpacity: 0.4 };
    const pulseParticles = new THREE.Points(particleGeo, particleMat);
    group.add(pulseParticles);

    return { group, nodes, connections, pulseParticles };
}

export function updateNeuralPulse(data, mouse, time) {
    const { nodes, connections, pulseParticles } = data;

    nodes.forEach((node) => {
        const scale = 1 + Math.sin(time * 3 + node.userData.pulseOffset) * 0.3;
        node.scale.setScalar(scale);
    });

    connections.forEach((line, i) => {
        line.material.opacity = line.material.userData.baseOpacity * (0.5 + Math.sin(time * 2 + i * 0.1) * 0.5);
    });

    pulseParticles.rotation.y = time * 0.02 + mouse.x * 0.05;
    data.group.rotation.y = mouse.x * 0.1;
    data.group.rotation.x = mouse.y * 0.1;
}
