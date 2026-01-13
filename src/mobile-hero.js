/**
 * Mobile Hero Section Interactions
 * Handles animations and interactions for mobile/tablet hero sections
 */

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initMobileHero();
});

function initMobileHero() {
    const mobileHeroSection = document.querySelector('.mobile-hero-section');

    if (!mobileHeroSection) return;

    // Only run on mobile/tablet
    if (window.innerWidth > 1024) {
        mobileHeroSection.style.display = 'none';
        return;
    }

    // Fade in animation
    setTimeout(() => {
        mobileHeroSection.style.opacity = '0';
        mobileHeroSection.style.transform = 'translateY(20px)';
        mobileHeroSection.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';

        requestAnimationFrame(() => {
            mobileHeroSection.style.opacity = '1';
            mobileHeroSection.style.transform = 'translateY(0)';
        });
    }, 100);

    // Animate elements sequentially
    const overline = mobileHeroSection.querySelector('.mobile-hero-overline');
    const title = mobileHeroSection.querySelector('.mobile-hero-title');
    const subtitle = mobileHeroSection.querySelector('.mobile-hero-subtitle');
    const buttons = mobileHeroSection.querySelector('.mobile-hero-buttons');
    const visual = mobileHeroSection.querySelector('.mobile-hero-visual');

    const elements = [overline, title, subtitle, buttons, visual].filter(el => el);

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });

    // Add ripple effect to buttons
    const mobileButtons = mobileHeroSection.querySelectorAll('.btn-primary-mobile, .btn-secondary-mobile');

    mobileButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Parallax effect on scroll (subtle)
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroContent = mobileHeroSection.querySelector('.mobile-hero-content');
                const heroVisual = mobileHeroSection.querySelector('.mobile-hero-visual');

                if (heroContent && scrolled < window.innerHeight) {
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
                }

                if (heroVisual && scrolled < window.innerHeight) {
                    heroVisual.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 - scrolled / window.innerHeight * 0.1})`;
                }

                ticking = false;
            });

            ticking = true;
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            mobileHeroSection.style.display = 'none';
        } else {
            mobileHeroSection.style.display = 'flex';
        }
    });
}

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn-primary-mobile,
    .btn-secondary-mobile {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);