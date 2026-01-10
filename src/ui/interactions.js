import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initUI() {
    initTabs();
    initAnimations();
    initCounters();
    initSpotlight();
}

function initSpotlight() {
    const cards = document.querySelectorAll('.card, .product-item, .step-card, .visual-box');

    document.addEventListener('mousemove', (e) => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Also update 3D Parallax CSS variable if needed or handle in ThreeJS
        // Dispatch custom event for 3D scene
        window.dispatchEvent(new CustomEvent('mousemove-3d', { detail: { x: e.clientX, y: e.clientY } }));
    });
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId)?.classList.add('active');
        });
    });
}

function initAnimations() {
    // Fade Up Animation for sections
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const title = section.querySelector('.section-title');
        const content = section.querySelectorAll('p, .grid-2, .split-layout, .product-showcase, .comparison-table-wrapper');

        if (title) {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        }

        if (content.length) {
            gsap.from(content, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.2
            });
        }
    });

    // Vision Cards Stagger
    gsap.from('.card', {
        scrollTrigger: {
            trigger: '.cards-grid',
            start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
    });

    // Advantages Grid Stagger
    const advantageCards = document.querySelectorAll('.advantage-card');
    if (advantageCards.length) {
        // Use fromTo to ensure starting state is forced and ending state is clean
        gsap.set(advantageCards, { opacity: 0, y: 60 }); // Set initial state immediately
        gsap.to(advantageCards, {
            scrollTrigger: {
                trigger: '.advantages-grid',
                start: "top 85%", // Trigger slightly earlier
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform" // Optional: clear transform after valid animation to avoid blur
        });
    }

    // Scenarios Grid Animation
    const scenarioCards = document.querySelectorAll('.scenario-card');
    if (scenarioCards.length) {
        gsap.set(scenarioCards, { opacity: 0, y: 30 });
        gsap.to(scenarioCards, {
            scrollTrigger: {
                trigger: '.scenarios-grid',
                start: "top 85%",
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        });
    }
}

function initCounters() {
    // Animating numbers in the Manufacturing section
    // We need to target the Numbers in the stats-list
    // Since they are inside <strong> tags, let's target them.

    // First, let's give them data attributes to count to if they don't have them, or just parse text
    const statNumbers = document.querySelectorAll('.stats-list strong');

    statNumbers.forEach(stat => {
        const originalText = stat.innerText; // e.g., "$285M", "50 GW"
        const numericValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
        const prefix = originalText.startsWith('$') ? '$' : '';
        const suffix = originalText.replace(/[^a-zA-Z%]/g, ''); // "M", "GW", etc.

        if (!isNaN(numericValue)) {
            // Set to 0 initially

            // Create a proxy object for GSAP to animate
            let proxy = { val: 0 };

            ScrollTrigger.create({
                trigger: stat,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    gsap.to(proxy, {
                        val: numericValue,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: () => {
                            // Format number just in case
                            stat.innerText = prefix + Math.floor(proxy.val) + " " + suffix;
                        }
                    });
                }
            });
        }
    });
}
