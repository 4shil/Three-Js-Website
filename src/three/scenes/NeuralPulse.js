import * as THREE from 'three';

// Scene 9: Neural Pulse
export function createNeuralPulse() {
    const group = new THREE.Group();
    group.position.set(0, 0, -200);

    // Neural nodes
    const nodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({
        color: 0x39ff14,
        transparent: true,
        opacity: 0.9
    });

    const nodePositions = [];
    for (let i = 0; i < 40; i++) {
        const node = new THREE.Mesh(nodeGeo, nodeMat.clone());
        node.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        );
        node.userData.pulseOffset = Math.random() * Math.PI * 2;
        nodes.push(node);
        nodePositions.push(node.position.clone());
        group.add(node);
    }

    // Neural connections (lines between nodes)
    const connections = [];
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x39ff14,
        transparent: true,
        opacity: 0.3
    });

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dist = nodes[i].position.distanceTo(nodes[j].position);
            if (dist < 8) {
                const lineGeo = new THREE.BufferGeometry().setFromPoints([
                    nodes[i].position,
                    nodes[j].position
                ]);
                const line = new THREE.Line(lineGeo, lineMat.clone());
                line.userData.nodeA = i;
                line.userData.nodeB = j;
                connections.push(line);
                group.add(line);
            }
        }
    }

    // Pulse particles
    const pulseGeo = new THREE.BufferGeometry();
    const pulseCount = 500;
    const pulsePos = new Float32Array(pulseCount * 3);

    for (let i = 0; i < pulseCount * 3; i += 3) {
        pulsePos[i] = (Math.random() - 0.5) * 30;
        pulsePos[i + 1] = (Math.random() - 0.5) * 20;
        pulsePos[i + 2] = (Math.random() - 0.5) * 20;
    }

    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));

    const pulseMat = new THREE.PointsMaterial({
        size: 0.08,
        color: 0x7fff00,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const pulseParticles = new THREE.Points(pulseGeo, pulseMat);
    group.add(pulseParticles);

    return { group, nodes, connections, pulseParticles };
}

export function updateNeuralPulse(data, mouse, time) {
    const { nodes, connections, pulseParticles } = data;

    // Pulse nodes
    nodes.forEach((node, i) => {
        const scale = 1 + Math.sin(time * 3 + node.userData.pulseOffset) * 0.4;
        node.scale.setScalar(scale);
        node.material.opacity = 0.6 + Math.sin(time * 3 + node.userData.pulseOffset) * 0.3;

        // Drift based on mouse
        node.position.x += Math.sin(time + i) * 0.01 + mouse.x * 0.02;
        node.position.y += Math.cos(time + i) * 0.01 + mouse.y * 0.02;
    });

    // Update connections (re-draw lines if nodes move significantly? 
    // Usually expensive, but here we just rotate the group or rely on visual abstractness)
    // Instead we rotate the whole group slightly
    data.group.rotation.y = mouse.x * 0.2;
    data.group.rotation.x = -mouse.y * 0.2;

    // Animate connection opacity
    connections.forEach((line, i) => {
        line.material.opacity = 0.2 + Math.sin(time * 2 + i * 0.1) * 0.15;
    });

    pulseParticles.rotation.y = time * 0.02 + mouse.x * 0.1;
    pulseParticles.rotation.x = Math.sin(time * 0.5) * 0.1 - mouse.y * 0.1;
}
