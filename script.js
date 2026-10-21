// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                initAnimations();
            }, 600); // Wait for transition to finish
        }, 1500); // Minimum time to show the loading screen
    } else {
        initAnimations();
    }
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Mobile navigation: reliable toggle, smooth section scrolling, and close-on-select
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (mobileBtn && navLinks) {
    const closeMenu = () => {
        navLinks.classList.remove('is-open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.setAttribute('aria-label', 'Open navigation menu');
        mobileBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        document.body.classList.remove('menu-open');
    };
    const openMenu = () => {
        navLinks.classList.add('is-open');
        mobileBtn.setAttribute('aria-expanded', 'true');
        mobileBtn.setAttribute('aria-label', 'Close navigation menu');
        mobileBtn.innerHTML = '<i class="fas fa-xmark" aria-hidden="true"></i>';
        document.body.classList.add('menu-open');
    };
    mobileBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        navLinks.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                event.preventDefault();
                closeMenu();
                history.replaceState(null, '', link.getAttribute('href'));
                target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
            } else {
                closeMenu();
            }
        });
    });
    document.addEventListener('click', event => {
        if (navLinks.classList.contains('is-open') && !navLinks.contains(event.target) && !mobileBtn.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMenu(); });
}

// EmailJS configuration
const EMAILJS_PUBLIC_KEY = 'ZN5kYkhjGYrM5554A';
const EMAILJS_SERVICE_ID = 'Portfolio1';
const EMAILJS_TEMPLATE_ID = 'template_d9428eh';

// Initialize EmailJS after the library is loaded
if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

// Animated delivery confirmation for contact form
function showMailFeedback(type, title, message) {
    const existing = document.querySelector('.mail-feedback-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = `mail-feedback-overlay ${type === 'error' ? 'is-error' : 'is-success'}`;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'mail-feedback-title');

    const art = type === 'error'
        ? `<div class="delivery-art error-art"><span class="error-orbit"></span><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8 57 53H7L32 8Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 24v13M32 44v1" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg></div>`
        : `<div class="delivery-art"><span class="delivery-orbit orbit-one"></span><span class="delivery-orbit orbit-two"></span><span class="delivery-spark spark-one">✦</span><span class="delivery-spark spark-two">✧</span><div class="delivery-envelope"><svg class="envelope-back" viewBox="0 0 100 76" aria-hidden="true"><rect x="5" y="8" width="90" height="62" rx="10" fill="currentColor" opacity=".13"/><path d="M8 17 50 48 92 17" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><svg class="delivery-plane" viewBox="0 0 64 64" aria-hidden="true"><path d="M7 29.5 56 7 38 57 28 37 7 29.5Z" fill="currentColor"/><path d="m28 37 28-30" stroke="#07111e" stroke-width="2.5" stroke-linecap="round"/><path d="m28 37 2 13 8-7" fill="currentColor"/></svg><span class="delivery-check">✓</span></div></div>`;

    overlay.innerHTML = `<div class="delivery-card"><button type="button" class="delivery-x" aria-label="Close">×</button>${art}<div class="delivery-eyebrow">${type === 'error' ? 'DELIVERY ISSUE' : 'MESSAGE DELIVERY'}</div><h3 id="mail-feedback-title"></h3><p class="delivery-copy"></p><div class="delivery-status"><span class="status-dot"></span><span>${type === 'error' ? 'Not delivered yet' : 'Successfully delivered'}</span></div><button type="button" class="delivery-action">${type === 'error' ? 'Try again' : 'Back to portfolio'} <span aria-hidden="true">↗</span></button></div>`;
    overlay.querySelector('h3').textContent = title;
    overlay.querySelector('.delivery-copy').textContent = message;
    const close = () => {
        overlay.classList.remove('is-visible');
        setTimeout(() => overlay.remove(), 400);
    };
    overlay.querySelectorAll('.delivery-x, .delivery-action').forEach(button => button.addEventListener('click', close));
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    const escHandler = event => { if (event.key === 'Escape' && document.body.contains(overlay)) { close(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-visible'));
    if (type !== 'error') setTimeout(() => { if (document.body.contains(overlay)) close(); }, 6000);
}

// Contact Form Submission via EmailJS
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');

if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        if (typeof emailjs === 'undefined') {
            if (formMessage) {
                formMessage.style.display = 'block';
                formMessage.style.color = '#ff5f56';
                formMessage.textContent = 'Email service is unavailable. Please try Direct Email.';
            }
            return;
        }

        const name = document.getElementById('user_name')?.value.trim() || '';
        const email = document.getElementById('user_email')?.value.trim() || '';
        const message = document.getElementById('message')?.value.trim() || '';

        btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;
        if (formMessage) formMessage.style.display = 'none';

        try {
            const templateParams = {
                // Support both the new field names and the older template names.
                user_name: name,
                user_email: email,
                name: name,
                email: email,
                message: message,
                reply_to: email,
                from_name: name
            };

            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            console.log('EmailJS success:', response.status, response.text);

            if (formMessage) formMessage.style.display = 'none';
            showMailFeedback('success', 'Message sent successfully!', 'Thanks for reaching out. Your message is on its way, and I’ll get back to you soon.');
            btn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
            btn.style.backgroundColor = 'rgba(33, 150, 243, 0.2)';
            form.reset();
        } catch (error) {
            console.error('EmailJS error:', error);
            const reason = error?.text || error?.message || (error?.status ? `Error ${error.status}` : 'Unknown EmailJS error');
            if (formMessage) formMessage.style.display = 'none';
            showMailFeedback('error', 'Message not sent', `Something went wrong: ${reason}. Please try again or use Direct Email.`);
            btn.innerHTML = '<span>Try Again</span> <i class="fas fa-redo"></i>';
        } finally {
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 4000);
        }
    });
}

function initAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic',
        });
    }

    // Initialize Typed.js for Hero Title Typing Animation
    if (document.getElementById('typed-roles') && typeof Typed !== 'undefined') {
        new Typed('#typed-roles', {
            strings: ['<i class="fas fa-pen-nib"></i> Logo Branding Designer', '<i class="fas fa-shield-halved"></i> Cybersecurity Student', '<i class="fas fa-code"></i> Frontend Developer'],
            typeSpeed: 50, backSpeed: 30, backDelay: 2000, loop: true, contentType: 'html'
        });
    }

    // Initialize Particles in Hero Section
    if (document.getElementById('tsparticles') && typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            fpsLimit: 60,
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: ["#2196f3", "#64b5f6", "#ffffff"] },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
                move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, outModes: { default: "bounce" }, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
            },
            interactivity: {
                detectsOn: "canvas",
                events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
                modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }

    // Animated Skill Progress Bars
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const progressBars = card.querySelectorAll('.progress');
                const percentTexts = card.querySelectorAll('.progress-percent');

                progressBars.forEach(bar => {
                    const target = bar.getAttribute('data-target');
                    setTimeout(() => {
                        bar.style.width = target + '%';
                        setTimeout(() => bar.classList.add('pulse'), 1500); // add pulse after animation finishes
                    }, 600); // Wait for AOS slide-up
                });

                percentTexts.forEach(text => {
                    const target = parseInt(text.getAttribute('data-target'));
                    let current = 0;
                    const increment = target / 50;
                    setTimeout(() => {
                        const interval = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                text.innerText = target + '%';
                                clearInterval(interval);
                            } else {
                                text.innerText = Math.ceil(current) + '%';
                            }
                        }, 30);
                    }, 600); // Wait for AOS slide-up
                });

                skillObserver.unobserve(card); // Only animate once
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-category').forEach(category => {
        if (category.querySelector('.progress')) {
            skillObserver.observe(category);
        }
    });

    // Certificates Flip Logic
    const certItems = document.querySelectorAll('.cert-item');
    const flipper = document.getElementById('cert-flipper');
    const displayImg = document.getElementById('cert-img-display');

    if (certItems.length > 0 && flipper && displayImg) {
        certItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active from all
                certItems.forEach(c => c.classList.remove('active'));
                // Add active to clicked
                item.classList.add('active');

                // Set image path
                const imgSrc = item.getAttribute('data-img');

                // Flip card logic
                if (!flipper.classList.contains('flipped')) {
                    displayImg.src = imgSrc;
                    flipper.classList.add('flipped');
                } else {
                    // If it's already flipped, quickly hide it, update img, then flip back
                    flipper.classList.remove('flipped');
                    setTimeout(() => {
                        displayImg.src = imgSrc;
                        flipper.classList.add('flipped');
                    }, 400);
                }
            });
        });
    }

}


