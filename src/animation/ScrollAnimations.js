import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scene positions (z-axis depth for each scene)
const SCENE_POSITIONS = [
    0,      // Scene 1: Nebula
    -25,    // Scene 2: Crystal
    -50,    // Scene 3: Grid
    -75,    // Scene 4: Void
    -100,   // Scene 5: Aurora
    -125,   // Scene 6: Solar
    -150,   // Scene 7: Quantum
    -175,   // Scene 8: Fractal
    -200,   // Scene 9: Neural
    -225,   // Scene 10: Mirror
    -250,   // Scene 11: Storm
    -275,   // Scene 12: Spiral
    -300,   // Scene 13: Warp
    -325    // Scene 14: Genesis
];

export function createScrollAnimations(camera, sceneGroups, lenis) {
    // Integrate Lenis with ScrollTrigger
    if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
    }

    const totalScenes = sceneGroups.length;

    // Initialize: All scenes visible but faded out except first
    sceneGroups.forEach((group, i) => {
        if (i === 0) {
            group.visible = true;
            setGroupOpacity(group, 1);
        } else {
            group.visible = true;
            setGroupOpacity(group, 0);
        }
    });

    // Track current scene
    let currentSceneIndex = 0;
    let isTransitioning = false;

    // Create ScrollTrigger for each section
    const sections = document.querySelectorAll('section');

    sections.forEach((section, i) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => transitionToScene(i),
            onEnterBack: () => transitionToScene(i)
        });
    });

    function transitionToScene(newIndex) {
        if (newIndex === currentSceneIndex || isTransitioning) return;
        isTransitioning = true;

        const oldScene = sceneGroups[currentSceneIndex];
        const newScene = sceneGroups[newIndex];

        // Ultra-smooth crossfade transition
        const tl = gsap.timeline({
            onComplete: () => {
                isTransitioning = false;
            }
        });

        // Fade out current scene - longer duration for smoothness
        if (oldScene) {
            tl.to({}, {
                duration: 1.2,
                onUpdate: function () {
                    setGroupOpacity(oldScene, 1 - this.progress());
                },
                ease: 'power2.out'
            }, 0);
        }

        // Fade in new scene - overlapping for seamless crossfade
        if (newScene) {
            tl.to({}, {
                duration: 1.2,
                onUpdate: function () {
                    setGroupOpacity(newScene, this.progress());
                },
                ease: 'power2.in'
            }, 0.4); // Greater overlap for smoother blend
        }

        // Smooth camera movement - matches Lenis timing
        tl.to(camera.position, {
            z: SCENE_POSITIONS[newIndex] + 10,
            duration: 1.6,
            ease: 'power4.inOut' // Ultra smooth ease
        }, 0);

        currentSceneIndex = newIndex;
    }

    // Content visibility animations
    sections.forEach((section, i) => {
        const content = section.querySelector('.content');

        ScrollTrigger.create({
            trigger: section,
            start: 'top 70%',
            end: 'bottom 30%',
            onEnter: () => content?.classList.add('visible'),
            onLeave: () => content?.classList.remove('visible'),
            onEnterBack: () => content?.classList.add('visible'),
            onLeaveBack: () => content?.classList.remove('visible')
        });
    });

    // Scene indicator dots
    const dots = document.querySelectorAll('.scene-dot');
    sections.forEach((section, i) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => updateActiveDot(dots, i),
            onEnterBack: () => updateActiveDot(dots, i)
        });
    });

    // Progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        gsap.to(progressBar, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5
            }
        });
    }

    // Hide scroll cue after first scroll
    const scrollCue = document.querySelector('.scroll-cue');
    if (scrollCue) {
        ScrollTrigger.create({
            trigger: 'body',
            start: 'top+=100 top',
            onEnter: () => gsap.to(scrollCue, { opacity: 0, duration: 0.5 })
        });
    }
}

// Helper: Set opacity for all materials in a group
function setGroupOpacity(group, opacity) {
    group.traverse((child) => {
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    mat.transparent = true;
                    mat.opacity = mat.userData?.baseOpacity !== undefined
                        ? mat.userData.baseOpacity * opacity
                        : opacity;
                });
            } else {
                child.material.transparent = true;
                child.material.opacity = child.material.userData?.baseOpacity !== undefined
                    ? child.material.userData.baseOpacity * opacity
                    : opacity;
            }
        }
    });
}

function updateActiveDot(dots, activeIndex) {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
    });
}

// Click navigation on dots
export function setupDotNavigation() {
    const dots = document.querySelectorAll('.scene-dot');
    const sections = document.querySelectorAll('section');

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            sections[i]?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}
