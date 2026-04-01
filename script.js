// ============================================
// TAMARIND - Galaxy Interactive Effects
// ============================================

// ============================================
// GALAXY CANVAS ANIMATION
// ============================================
const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let shootingStars = [];
let nebulaParticles = [];

// Configuration
const config = {
    starCount: 300,
    shootingStarInterval: 3000,
    nebulaParticleCount: 50,
    starColors: ['#ffffff', '#a78bfa', '#06b6d4', '#f472b6', '#8b5cf6'],
    nebulaColors: [
        { r: 139, g: 92, b: 246 },  // Purple
        { r: 6, g: 182, b: 212 },   // Cyan
        { r: 244, g: 114, b: 182 }, // Pink
        { r: 99, g: 102, b: 241 }   // Indigo
    ]
};

// Resize handler
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// Star class
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.color = config.starColors[Math.floor(Math.random() * config.starColors.length)];
    }

    update() {
        this.twinklePhase += this.twinkleSpeed;
        this.opacity = 0.2 + Math.abs(Math.sin(this.twinklePhase)) * 0.8;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Shooting star class
class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.5;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 8 + 4;
        this.angle = Math.PI / 4 + Math.random() * 0.3;
        this.opacity = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.active = true;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= this.decay;

        if (this.opacity <= 0) {
            this.active = false;
        }
    }

    draw() {
        if (!this.active) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Nebula particle class
class NebulaParticle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 150 + 50;
        this.color = config.nebulaColors[Math.floor(Math.random() * config.nebulaColors.length)];
        this.opacity = Math.random() * 0.03 + 0.01;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
    }

    draw() {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// Initialize galaxy
function initGalaxy() {
    resize();

    // Create stars
    stars = [];
    for (let i = 0; i < config.starCount; i++) {
        stars.push(new Star());
    }

    // Create nebula particles
    nebulaParticles = [];
    for (let i = 0; i < config.nebulaParticleCount; i++) {
        nebulaParticles.push(new NebulaParticle());
    }

    // Start shooting stars
    setInterval(() => {
        shootingStars.push(new ShootingStar());
    }, config.shootingStarInterval);
}

// Animation loop
function animateGalaxy() {
    ctx.clearRect(0, 0, width, height);

    // Draw nebula (background)
    nebulaParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Draw shooting stars
    shootingStars = shootingStars.filter(star => star.active);
    shootingStars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animateGalaxy);
}

// Initialize
window.addEventListener('resize', resize);
initGalaxy();
animateGalaxy();

// ============================================
// NAVIGATION SCROLL EFFECT
// ============================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================
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

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
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

// Observe elements
document.querySelectorAll('.about-card, .team-card, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// MOUSE PARALLAX EFFECT ON HERO
// ============================================
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const heroGlow = document.querySelector('.hero-glow');

hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    heroContent.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    heroGlow.style.transform = `translate(calc(-50% + ${x * 40}px), calc(-50% + ${y * 40}px))`;
});

hero.addEventListener('mouseleave', () => {
    heroContent.style.transform = 'translate(0, 0)';
    heroGlow.style.transform = 'translate(-50%, -50%)';
});

// ============================================
// TEAM CARD TILT EFFECT
// ============================================
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const tiltX = (y - 0.5) * 10;
        const tiltY = (x - 0.5) * -10;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);

        // Simple validation feedback
        const btn = contactForm.querySelector('.btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        // Reset form
        contactForm.reset();

        // Reset button after delay
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 3000);
    });
}

// ============================================
// COUNTER ANIMATION FOR STATS
// ============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current + (element.dataset.suffix || '');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Observe stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                const suffix = text.replace(/[0-9]/g, '');
                stat.dataset.suffix = suffix;
                animateCounter(stat, number);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ============================================
// PAGE LOAD ANIMATION
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = 'var(--primary-light)';
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c🌌 TAMARIND ', 'background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%cYoung Developers Collective - Building the Future', 'color: #a78bfa; font-size: 14px;');
console.log('%cInterested in joining us? Reach out at hello@tamarind.dev', 'color: #71717a; font-size: 12px;');
