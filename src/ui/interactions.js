import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initUI() {
    initTabs();
    initAnimations();
    initCounters();
    initSpotlight();
    initMobileMenu();
    initProductInteractions();
    initTechAnimations();
    initAboutAnimations();
}

function initProductInteractions() {
    // 1. Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card-3d');

    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                const filter = btn.getAttribute('data-filter');

                productCards.forEach(card => {
                    // Reset animation state
                    gsap.killTweensOf(card);

                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                        gsap.fromTo(card,
                            { opacity: 0, y: 30, scale: 0.95 },
                            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out", clearProps: "transform" }
                        );
                    } else {
                        gsap.to(card, {
                            opacity: 0,
                            y: 20,
                            scale: 0.9,
                            duration: 0.3,
                            onComplete: () => { card.style.display = 'none'; }
                        });
                    }
                });
            });
        });
    }

    // 2. 3D Tilt Effect
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 10 degrees)
            const xPct = x / rect.width;
            const yPct = y / rect.height;

            const rotateX = (0.5 - yPct) * 10; // Flipped Y for natural tilt
            const rotateY = (xPct - 0.5) * 10;

            // Apply transform
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.5,
                ease: "power2.out"
            });

            // Move placeholder/hotspots for parallax
            const visual = card.querySelector('.card-image-placeholder');
            if (visual) {
                gsap.to(visual, {
                    x: (xPct - 0.5) * 20,
                    y: (yPct - 0.5) * 20,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });

        // Reset on leave
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)"
            });

            const visual = card.querySelector('.card-image-placeholder');
            if (visual) {
                gsap.to(visual, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
            }
        });
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!hamburger || !mobileMenu) return;

    // Toggle Menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on Link Click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Technology Page Animations
function initTechAnimations() {
    // Animate Process Rows
    const processRows = document.querySelectorAll('.process-row');

    if (processRows.length > 0) {
        processRows.forEach((row, index) => {
            gsap.from(row, {
                scrollTrigger: {
                    trigger: row,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                delay: index * 0.1, // Stagger effect if close together
                ease: "power3.out"
            });
        });
    }

    // Animate Glass Specs Table Rows
    const specRows = document.querySelectorAll('.glass-table tr');
    if (specRows.length > 0) {
        gsap.from(specRows, {
            scrollTrigger: {
                trigger: '.glass-table',
                start: "top 85%"
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
}

// Export initialization function if using modular JS, or call it here
// Make sure to call initTechAnimations() in main.js
export { initMobileMenu, initTechAnimations };

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


// V4: About Page Specific Motion
function initAboutAnimations() {
    // 1. Hero Title Reveal
    const heroTitle = document.querySelector('.hero-v4-title');
    if (heroTitle) {
        gsap.from(heroTitle, {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
            delay: 0.2
        });
    }

    // 2. Values Grid Stagger (Light Theme)
    const valueCards = document.querySelectorAll('.value-card-light');
    if (valueCards.length) {
        gsap.from(valueCards, {
            scrollTrigger: {
                trigger: '.values-grid-light',
                start: "top 80%"
            },
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    // 3. Stats Strip Reveal
    const statStrip = document.querySelector('.stats-counter-strip-light');
    if (statStrip) {
        gsap.from(statStrip, {
            scrollTrigger: {
                trigger: statStrip,
                start: "top 85%"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    }

    // 4. Image card interaction
    const imageCard = document.querySelector('.image-card-premium');
    if (imageCard) {
        imageCard.addEventListener('mousemove', (e) => {
            const rect = imageCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(imageCard.querySelector('img'), {
                x: x * 20,
                y: y * 20,
                scale: 1.1,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        imageCard.addEventListener('mouseleave', () => {
            gsap.to(imageCard.querySelector('img'), {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }
}

function initCounters() {
    // Animating numbers in the Manufacturing section
    // We need to target the Numbers in the stats-list
    // Since they are inside <strong> tags, let's target them.

    // First, let's give them data attributes to count to if they don't have them, or just parse text
    // V4 Update: Target both old stats list and new counter-val
    const statNumbers = document.querySelectorAll('.stats-list strong, .counter-val, .strip-stat');

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
