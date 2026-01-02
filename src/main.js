// VOYAGE - Interactive Cosmic Journey
// Main Entry Point

// Styles
import './styles/index.css';
import './styles/navigation.css';
import './styles/loader.css';
import './styles/sections.css';
import './styles/utilities.css';

// Three.js core
import { createScene, createRenderer, createCamera, handleResize } from './three/SceneManager.js';
import { AmbientLight } from 'three';
import Lenis from 'lenis'; // Smooth Scroll

// Scene modules
import { createParticleField, updateParticleField } from './three/scenes/ParticleField.js';
import { createArtifact, updateArtifact } from './three/scenes/Artifact.js';
import { createGridTerrain, updateGridTerrain } from './three/scenes/GridTerrain.js';
import { createVoidTunnel, updateVoidTunnel } from './three/scenes/VoidTunnel.js';
import { createAurora, updateAurora } from './three/scenes/Aurora.js';
import { createSolarForge, updateSolarForge } from './three/scenes/SolarForge.js';
import { createQuantumRealm, updateQuantumRealm } from './three/scenes/QuantumRealm.js';
import { createFractalDimension, updateFractalDimension } from './three/scenes/FractalDimension.js';
import { createNeuralPulse, updateNeuralPulse } from './three/scenes/NeuralPulse.js';
import { createMirrorRealm, updateMirrorRealm } from './three/scenes/MirrorRealm.js';
import { createCosmicStorm, updateCosmicStorm } from './three/scenes/CosmicStorm.js';
import { createGoldenSpiral, updateGoldenSpiral } from './three/scenes/GoldenSpiral.js';
import { createWarpTunnel, updateWarpTunnel } from './three/scenes/WarpTunnel.js';
import { createGenesisCore, updateGenesisCore } from './three/scenes/GenesisCore.js';

// Components
import { createSections, createSceneIndicator } from './components/Sections.js';
import { hideLoader } from './components/Loader.js';

// Animation & Interaction
import { createScrollAnimations, setupDotNavigation } from './animation/ScrollAnimations.js';
import { createAnimationLoop } from './animation/AnimationLoop.js';
import { createMouseHandler } from './interaction/MouseHandler.js';

// Initialize application
function init() {
  // Get canvas
  const canvas = document.querySelector('#webgl');
  if (!canvas) {
    console.error('Canvas not found!');
    return;
  }

  // Initialize Lenis Smooth Scroll - Ultra Smooth Configuration
  const lenis = new Lenis({
    duration: 1.8, // Longer duration = smoother feel
    easing: (t) => 1 - Math.pow(1 - t, 4), // Quartic ease-out for cinematic feel
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8, // Slower wheel = more controlled
    touchMultiplier: 1.5,
    infinite: false,
    autoResize: true
  });

  // Create Three.js fundamentals
  const scene = createScene();
  const renderer = createRenderer(canvas);
  const camera = createCamera();
  scene.add(camera);

  // Handle window resize
  handleResize(camera, renderer);

  // Create mouse handler
  const mouse = createMouseHandler();

  // Create all 14 scenes
  const scene1 = createParticleField(); // Interactive by default
  const scene2 = createArtifact();
  const scene3 = createGridTerrain();
  const scene4 = createVoidTunnel();
  const scene5 = createAurora();
  const scene6 = createSolarForge();
  const scene7 = createQuantumRealm();
  const scene8 = createFractalDimension();
  const scene9 = createNeuralPulse();
  const scene10 = createMirrorRealm();
  const scene11 = createCosmicStorm();
  const scene12 = createGoldenSpiral();
  const scene13 = createWarpTunnel();
  const scene14 = createGenesisCore();

  // Add all scene groups to main scene
  const sceneGroups = [
    scene1.group, scene2.group, scene3.group, scene4.group,
    scene5.group, scene6.group, scene7.group, scene8.group,
    scene9.group, scene10.group, scene11.group, scene12.group,
    scene13.group, scene14.group
  ];

  sceneGroups.forEach(group => scene.add(group));

  // Add ambient light for physical materials
  const ambientLight = new AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Setup HTML content
  const app = document.querySelector('#app');
  if (app) {
    app.innerHTML = createSections() + createSceneIndicator() +
      '<div class="progress-bar"></div>' +
      '<div class="scroll-cue"><span>Scroll to Explore</span></div>';
  }

  // Setup scroll animations (Pass Lenis if needed for syncing)
  createScrollAnimations(camera, sceneGroups, lenis);
  setupDotNavigation();

  // Create update functions for animation loop
  // Ensure ALL scenes receive 'mouse' for interaction
  const updateFunctions = [
    (time) => {
      lenis.raf(time * 1000); // Update Lenis
      updateParticleField(scene1, mouse, time);
    },
    (time) => updateArtifact(scene2, mouse, time),
    (time) => updateGridTerrain(scene3, mouse, time),
    (time) => updateVoidTunnel(scene4, mouse, time),
    (time) => updateAurora(scene5, mouse, time),
    (time) => updateSolarForge(scene6, mouse, time),
    (time) => updateQuantumRealm(scene7, mouse, time),
    (time) => updateFractalDimension(scene8, mouse, time),
    (time) => updateNeuralPulse(scene9, mouse, time),
    (time) => updateMirrorRealm(scene10, mouse, time),
    (time) => updateCosmicStorm(scene11, mouse, time),
    (time) => updateGoldenSpiral(scene12, mouse, time),
    (time) => updateWarpTunnel(scene13, mouse, time),
    (time) => updateGenesisCore(scene14, mouse, time)
  ];

  // Start animation loop
  const animate = createAnimationLoop(renderer, scene, camera, updateFunctions);
  animate();

  // Hide loader when ready
  hideLoader();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
