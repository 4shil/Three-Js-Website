import { gsap } from 'gsap';

// Scene positions - precomputed constant
const SCENE_POSITIONS = [0, -25, -50, -75, -100, -125, -150, -175, -200, -225, -250, -275, -300, -325];
const TOTAL_SCENES = 14;

// Cached DOM references
let sections = null;
let progressBar = null;
let dots = null;
let scrollCue = null;

export function createScrollAnimations(camera, sceneGroups, lenis) {
    let currentScene = 0;
    let isTransitioning = false;

    // Cache DOM queries once
    sections = document.querySelectorAll('section');
    progressBar = document.querySelector('.progress-bar');
    dots = document.querySelectorAll('.scene-dot');
    scrollCue = document.querySelector('.scroll-cue');

    // Initialize scenes - only first visible
    for (let i = 0; i < sceneGroups.length; i++) {
        sceneGroups[i].visible = i === 0;
        if (i === 0) setOpacity(sceneGroups[i], 1);
    }

    // Show first card immediately
    const firstContent = sections[0]?.querySelector('.content');
    if (firstContent) firstContent.classList.add('visible');
    setActiveDot(0);

    // Disable Lenis
    if (lenis) lenis.stop();

    // FAST TRANSITIONS
    function goToScene(idx) {
        if (idx === currentScene || isTransitioning || idx < 0 || idx >= TOTAL_SCENES) return;
        isTransitioning = true;

        const oldScene = sceneGroups[currentScene];
        const newScene = sceneGroups[idx];
        const oldCard = sections[currentScene]?.querySelector('.content');
        const newCard = sections[idx]?.querySelector('.content');

        // Quick fade out old card
        if (oldCard) {
            gsap.to(oldCard, {
                opacity: 0, y: -20,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: () => oldCard.classList.remove('visible')
            });
        }

        // Quick scene crossfade
        if (oldScene) {
            gsap.to({ v: 1 }, {
                v: 0, duration: 0.4,
                onUpdate: function () { setOpacity(oldScene, this.targets()[0].v); },
                onComplete: () => { oldScene.visible = false; }
            });
        }

        // Camera move
        gsap.to(camera.position, {
            z: SCENE_POSITIONS[idx] + 10,
            duration: 0.6,
            ease: 'power3.inOut'
        });

        // Show new scene
        if (newScene) {
            newScene.visible = true;
            gsap.fromTo({ v: 0 }, { v: 0 }, {
                v: 1, duration: 0.4, delay: 0.15,
                onUpdate: function () { setOpacity(newScene, this.targets()[0].v); }
            });
        }

        // Quick fade in new card
        if (newCard) {
            newCard.classList.add('visible');
            gsap.fromTo(newCard,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 0.35, delay: 0.2, ease: 'power2.out',
                    onComplete: () => { isTransitioning = false; }
                }
            );
        } else {
            setTimeout(() => { isTransitioning = false; }, 500);
        }

        // DOM scroll
        sections[idx]?.scrollIntoView({ behavior: 'instant' });

        setActiveDot(idx);
        setProgress(idx);
        currentScene = idx;
    }

    // Wheel handler - throttled
    let lastWheel = 0;
    function onWheel(e) {
        const now = performance.now();
        if (isTransitioning || now - lastWheel < 600) { e.preventDefault(); return; }

        const dir = e.deltaY > 0 ? 1 : -1;
        const next = currentScene + dir;

        if (next >= 0 && next < TOTAL_SCENES) {
            e.preventDefault();
            lastWheel = now;
            goToScene(next);
        }
    }

    // Touch handler
    let touchY = 0;
    function onTouchStart(e) { touchY = e.touches[0].clientY; }
    function onTouchEnd(e) {
        if (isTransitioning) return;
        const diff = touchY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 60) goToScene(currentScene + (diff > 0 ? 1 : -1));
    }

    // Keyboard handler
    function onKey(e) {
        if (isTransitioning) return;
        const keyMap = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 };
        if (keyMap[e.key] !== undefined) {
            e.preventDefault();
            goToScene(currentScene + keyMap[e.key]);
        } else if (e.key === 'Home') { e.preventDefault(); goToScene(0); }
        else if (e.key === 'End') { e.preventDefault(); goToScene(TOTAL_SCENES - 1); }
    }

    // Event listeners
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);

    // Hide scroll cue on first interaction
    if (scrollCue) {
        window.addEventListener('wheel', () => {
            gsap.to(scrollCue, { opacity: 0, duration: 0.3 });
        }, { once: true });
    }

    // Expose for dots
    window.voyageGoToScene = goToScene;
}

// Optimized opacity setter - minimal traversal
function setOpacity(group, opacity) {
    const children = group.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            for (let j = 0; j < mats.length; j++) {
                mats[j].transparent = true;
                mats[j].opacity = (mats[j].userData?.baseOpacity ?? 1) * opacity;
            }
        }
        if (child.children?.length) setOpacity(child, opacity);
    }
}

// DOM updates - cached references
function setActiveDot(idx) {
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === idx);
    }
}

function setProgress(idx) {
    if (progressBar) {
        gsap.to(progressBar, { scaleX: idx / (TOTAL_SCENES - 1), duration: 0.4 });
    }
}

// Dot navigation
export function setupDotNavigation() {
    const allDots = document.querySelectorAll('.scene-dot');
    for (let i = 0; i < allDots.length; i++) {
        allDots[i].addEventListener('click', () => {
            if (window.voyageGoToScene) window.voyageGoToScene(i);
        });
    }
}
