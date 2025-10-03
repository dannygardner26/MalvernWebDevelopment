// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.hero-card, .feature-card, .industry-card, .why-card, .portfolio-item');

    // Apply initial styles for animation
    [...sections, ...cards].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const formInputs = contactForm.querySelectorAll('input, select, textarea');

// Form validation
function validateForm() {
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });

    // Email validation
    const emailField = document.getElementById('email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#ef4444';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#d1d5db';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Real-time validation
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            showFieldError(input, 'This field is required');
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            showFieldError(input, 'Please enter a valid email address');
        } else {
            clearFieldError(input);
        }
    });

    input.addEventListener('input', () => {
        clearFieldError(input);
    });
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';

    try {
        // Prepare form data
        const formData = {
            name: document.getElementById('name').value,
            business: document.getElementById('business').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            projectType: document.getElementById('project-type').value,
            message: document.getElementById('message').value
        };

        // Submit to backend API
        const result = await submitFormToAPI(formData);

        // Show success message
        showSuccessMessage(result.message);
        contactForm.reset();

    } catch (error) {
        // Show error message
        showErrorMessage(error.message || 'Something went wrong. Please try again or contact us directly.');
        console.error('Form submission error:', error);
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }
});

// Submit form to backend API
async function submitFormToAPI(formData) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
    }

    return result;
}

function showSuccessMessage(customMessage) {
    const message = createMessage(
        'Thank you for your inquiry!',
        customMessage || 'We\'ll get back to you within 24 hours to discuss your project.',
        'success'
    );
    showMessage(message);
}

function showErrorMessage(text) {
    const message = createMessage(
        'Oops! Something went wrong.',
        text,
        'error'
    );
    showMessage(message);
}

function createMessage(title, text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 320px;
        padding: 1rem 1.25rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        font-family: 'Inter', sans-serif;
        ${type === 'success'
            ? 'background: white; border-left: 4px solid #10b981; color: #374151;'
            : 'background: white; border-left: 4px solid #ef4444; color: #374151;'
        }
    `;

    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="flex-shrink: 0;">
                ${type === 'success'
                    ? '<i class="fas fa-check-circle" style="color: #10b981; font-size: 1.1rem;"></i>'
                    : '<i class="fas fa-exclamation-circle" style="color: #ef4444; font-size: 1.1rem;"></i>'
                }
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 0.25rem 0; font-weight: 600; font-size: 0.9rem; color: #374151;">${title}</h4>
                <p style="margin: 0; font-size: 0.8rem; color: #6b7280; line-height: 1.4;">${text}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()"
                    style="background: none; border: none; color: #9ca3af; font-size: 1rem; cursor: pointer; padding: 0; transition: color 0.2s;"
                    onmouseover="this.style.color='#374151'"
                    onmouseout="this.style.color='#9ca3af'"
                    title="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    return messageDiv;
}

function showMessage(messageDiv) {
    document.body.appendChild(messageDiv);

    // Trigger animation
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const numericTarget = parseInt(target.replace(/\D/g, ''));

        let current = 0;
        const increment = numericTarget / 50; // Animation duration control
        const timer = setInterval(() => {
            current += increment;

            if (current >= numericTarget) {
                counter.textContent = target; // Set final value
                clearInterval(timer);
            } else {
                const displayValue = Math.floor(current);
                counter.textContent = isPercentage ? `${displayValue}%` : displayValue;
            }
        }, 30);
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Portfolio filter functionality (if needed in future)
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Performance optimization: Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger loading
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Testimonials carousel (if added in future)
function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${(i - index) * 100}%)`;
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto-advance carousel
    setInterval(nextSlide, 5000);

    // Initialize
    showSlide(0);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    initTestimonialsCarousel();

    // Add subtle hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .industry-card, .why-card, .portfolio-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add click tracking for analytics (placeholder)
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Analytics tracking would go here
            console.log('CTA clicked:', button.textContent);
        });
    });
});

// Error handling for any unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Could send to error tracking service
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}