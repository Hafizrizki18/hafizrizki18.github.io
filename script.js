/* =========================================
   PORTOFOLIO - Hafizh Rizki Oktavian
   Interactive JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initParticles();
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initCounterAnimations();
    initProjectFilters();
    initBackToTop();
    initSmoothScroll();
});

/* =========================================
   PRELOADER
   ========================================= */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Trigger hero animations after preloader
            document.querySelectorAll('.hero-section .animate-on-scroll').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 150);
            });
        }, 800);
    });

    // Fallback: hide preloader after 3 seconds max
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);
}

/* =========================================
   PARTICLES BACKGROUND
   ========================================= */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.fadeDirection = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Pulse opacity
            this.opacity += this.fadeSpeed * this.fadeDirection;
            if (this.opacity >= 0.5) this.fadeDirection = -1;
            if (this.opacity <= 0.05) this.fadeDirection = 1;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(Math.floor(canvas.width * canvas.height / 15000), 80);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(201, 168, 76, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

/* =========================================
   NAVIGATION
   ========================================= */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;

        // Update active nav link
        updateActiveLink();
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');

        // Toggle overlay
        let overlay = document.querySelector('.nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.classList.add('nav-overlay');
            document.body.appendChild(overlay);
            overlay.addEventListener('click', closeNav);
        }
        overlay.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    function closeNav() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close on link click
    links.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Update active link based on scroll position
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* =========================================
   TYPING EFFECT
   ========================================= */
function initTypingEffect() {
    const roles = [
        'Business Analyst',
        'System Analyst',
        'Quality Assurance'
    ];

    const element = document.getElementById('typedRole');
    if (!element) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentRole = roles[roleIndex];

        if (isPaused) {
            setTimeout(type, 1500);
            isPaused = false;
            isDeleting = true;
            return;
        }

        if (isDeleting) {
            element.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, 300);
                return;
            }

            setTimeout(type, 30);
        } else {
            element.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                isPaused = true;
                setTimeout(type, 100);
                return;
            }

            setTimeout(type, 80);
        }
    }

    // Start typing after a delay
    setTimeout(type, 1200);
}

/* =========================================
   SCROLL ANIMATIONS
   ========================================= */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    // Skip hero elements - they are handled by preloader
    const nonHeroElements = Array.from(elements).filter(
        el => !el.closest('.hero-section')
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    nonHeroElements.forEach(el => observer.observe(el));
}

/* =========================================
   COUNTER ANIMATIONS
   ========================================= */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }
}

/* =========================================
   PROJECT FILTERS
   ========================================= */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* =========================================
   BACK TO TOP
   ========================================= */
function initBackToTop() {
    const btn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* =========================================
   SMOOTH SCROLLING
   ========================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* =========================================
   FADE IN UP ANIMATION (for filter)
   ========================================= */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
