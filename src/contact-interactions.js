/**
 * Contact Page Interactions
 * Handles map controls and other interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
    initMapControls();
    initInfoCardAnimations();
    initFormFocusEffects();
});

function initMapControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const streetViewBtn = document.getElementById('street-view');
    const mapFrame = document.querySelector('#map-frame iframe');

    if (!mapFrame) return;

    // Note: These are visual controls only as iframe doesn't allow direct manipulation
    // In a production environment, you'd use Google Maps JavaScript API

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            showNotification('Zoom in - Use map controls inside the map', 'info');
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            showNotification('Zoom out - Use map controls inside the map', 'info');
        });
    }

    if (streetViewBtn) {
        streetViewBtn.addEventListener('click', () => {
            // Open in new tab with street view
            const coords = '22.350177557105674,73.17200429744994';
            window.open(`https://www.google.com/maps/@${coords},3a,75y,90t/data=!3m6!1e1`, '_blank');
        });
    }
}

function initInfoCardAnimations() {
    const infoCards = document.querySelectorAll('.info-card');

    infoCards.forEach(card => {
        // Magnetic effect on hover (desktop only)
        if (window.innerWidth > 768) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;

                card.style.transform = `
                    perspective(1000px)
                    rotateY(${deltaX * 5}deg)
                    rotateX(${-deltaY * 5}deg)
                    translateY(-5px)
                    scale(1.02)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        }

        // Click animation for mobile
        card.addEventListener('click', function () {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

function initFormFocusEffects() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');

        if (!input || !label) return;

        // Float label on focus/fill
        const checkFloat = () => {
            if (input.value || input === document.activeElement) {
                label.style.transform = 'translateY(-150%) scale(0.85)';
                label.style.color = 'var(--color-primary)';
            } else {
                label.style.transform = '';
                label.style.color = '';
            }
        };

        input.addEventListener('focus', checkFloat);
        input.addEventListener('blur', checkFloat);
        input.addEventListener('input', checkFloat);

        // Initial check
        checkFloat();
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const bgColor = type === 'success' ? '#4caf50' : type === 'error' ? '#d32f2f' : '#2196f3';

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}