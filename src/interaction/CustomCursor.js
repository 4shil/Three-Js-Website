// Optimized Custom Cursor - reduced DOM manipulation, RAF batching

// Cursor state
let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
let cursorDot = null, cursorRing = null;
let rafId = null;

export function initCustomCursor() {
    // Create cursor elements once
    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.append(cursorDot, cursorRing);

    // Initialize position
    mouseX = dotX = ringX = window.innerWidth / 2;
    mouseY = dotY = ringY = window.innerHeight / 2;

    // Batched mouse tracking
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mousedown', onMouseDown, { passive: true });
    document.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    // Start animation loop
    rafId = requestAnimationFrame(animate);

    // Event delegation for hover states
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    // Magnetic dots only (no buttons anymore)
    initMagneticDots();
}

function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function onMouseDown() {
    cursorRing.classList.add('click');
    cursorDot.style.transform = 'scale(0.8)';
}

function onMouseUp() {
    cursorRing.classList.remove('click');
    cursorDot.style.transform = 'scale(1)';
}

function onMouseLeave() {
    cursorRing.classList.add('hidden');
    cursorDot.style.opacity = '0';
}

function onMouseEnter() {
    cursorRing.classList.remove('hidden');
    cursorDot.style.opacity = '1';
}

// Event delegation for hovers
function onMouseOver(e) {
    if (e.target.matches('.scene-dot, [data-hover]')) {
        cursorRing.classList.add('hover');
        cursorDot.style.transform = 'scale(1.5)';
    }
}

function onMouseOut(e) {
    if (e.target.matches('.scene-dot, [data-hover]')) {
        cursorRing.classList.remove('hover');
        cursorDot.style.transform = 'scale(1)';
    }
}

// Optimized animation loop - single RAF
function animate() {
    // Smoother interpolation with frame-independent lerp
    dotX += (mouseX - dotX) * 0.4;
    dotY += (mouseY - dotY) * 0.4;
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    // Use transform instead of left/top for GPU acceleration
    cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
    cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

    rafId = requestAnimationFrame(animate);
}

// Magnetic effect for dots only
function initMagneticDots() {
    const dots = document.querySelectorAll('.scene-dot');

    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let rect = null;

        dot.addEventListener('mouseenter', () => {
            rect = dot.getBoundingClientRect();
        }, { passive: true });

        dot.addEventListener('mousemove', (e) => {
            if (!rect) return;
            const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
            dot.style.transform = `translate(${x}px, ${y}px)`;
        }, { passive: true });

        dot.addEventListener('mouseleave', () => {
            dot.style.transform = '';
            rect = null;
        }, { passive: true });
    }
}

// Lightweight text scramble - no GSAP
export function initTextScramble() {
    const chars = '!<>-_/[]{}=+*^?#';
    const elements = document.querySelectorAll('.scene-number');

    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const original = el.textContent;
        let animating = false;

        el.addEventListener('mouseenter', () => {
            if (animating) return;
            animating = true;
            let iter = 0;

            const id = setInterval(() => {
                let result = '';
                for (let j = 0; j < original.length; j++) {
                    result += j < iter ? original[j] : chars[Math.random() * chars.length | 0];
                }
                el.textContent = result;
                iter += 0.8;

                if (iter >= original.length) {
                    clearInterval(id);
                    el.textContent = original;
                    animating = false;
                }
            }, 25);
        }, { passive: true });
    }
}

// Lightweight tilt - CSS transitions only
export function initTiltEffect() {
    const cards = document.querySelectorAll('.content');

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.style.transition = 'transform 0.2s ease-out';

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -4;
            card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`;
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        }, { passive: true });
    }
}

// Cleanup function
export function destroyCursor() {
    if (rafId) cancelAnimationFrame(rafId);
    cursorDot?.remove();
    cursorRing?.remove();
}
