/**
 * Contact Form Handler
 * Handles form validation and submission
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    // Form validation
    const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit-premium');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';

        // Simulate API call (replace with actual endpoint)
        try {
            await simulateFormSubmission(data);

            // Success
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();

            // Reset form styling
            inputs.forEach(input => {
                input.classList.remove('error', 'success');
            });

        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Remove previous error
    field.classList.remove('error', 'success');
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();

    // Required check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        showFieldError(field, 'This field is required');
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            showFieldError(field, 'Please enter a valid email address');
        }
    }

    // Phone validation (optional but if filled, should be valid)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            showFieldError(field, 'Please enter a valid phone number');
        }
    }

    // Select validation
    if (field.tagName === 'SELECT' && field.hasAttribute('required')) {
        if (!value || value === '') {
            isValid = false;
            showFieldError(field, 'Please select an option');
        }
    }

    // Checkbox validation
    if (field.type === 'checkbox' && field.hasAttribute('required')) {
        if (!field.checked) {
            isValid = false;
            showFieldError(field, 'You must agree to continue');
        }
    }

    if (isValid && value) {
        field.classList.add('success');
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #d32f2f;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        animation: slideDown 0.3s ease;
    `;

    field.parentElement.appendChild(errorDiv);
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
    }, 4000);
}

async function simulateFormSubmission(data) {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve();
        }, 1500);
    });
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #d32f2f !important;
    }
    
    .form-group input.success,
    .form-group textarea.success,
    .form-group select.success {
        border-color: #4caf50 !important;
    }
`;
document.head.appendChild(style);