/* =============================================
   SMILEY CHILDREN — interactions
   ============================================= */

(() => {
    'use strict';

    // ---------- LOADING SCREEN ----------
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    const loaderStatus = document.getElementById('loaderStatus');
    const loaderPercent = document.getElementById('loaderPercent');

    const statusFrames = [
        { p: 0,  text: 'Opening the front door' },
        { p: 18, text: 'Lighting the dining room' },
        { p: 38, text: 'Tuning the family' },
        { p: 58, text: 'Polishing the Smiley Coins' },
        { p: 78, text: 'Setting the table for four' },
        { p: 95, text: 'Almost home' },
    ];

    let progress = 0;
    const loadDuration = 2600;
    const startTime = performance.now();

    function tickLoader(now) {
        const elapsed = now - startTime;
        progress = Math.min(100, (elapsed / loadDuration) * 100);

        loaderBar.style.width = progress + '%';
        loaderPercent.textContent = Math.floor(progress) + '%';

        const current = [...statusFrames].reverse().find(f => progress >= f.p);
        if (current && loaderStatus.textContent !== current.text) {
            loaderStatus.textContent = current.text;
        }

        if (progress < 100) {
            requestAnimationFrame(tickLoader);
        } else {
            setTimeout(() => {
                loader.classList.add('is-hidden');
                document.body.classList.add('is-loaded');
            }, 400);
        }
    }
    requestAnimationFrame(tickLoader);

    // ---------- CUSTOM CURSOR ----------
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll('[data-cursor="hover"], a, button, .feature, .character, .pick, .demo__shot');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add('is-hover');
            cursorDot.classList.add('is-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('is-hover');
            cursorDot.classList.remove('is-hover');
        });
    });

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '';
        cursorRing.style.opacity = '';
    });

    // Primary button radial highlight follow
    document.querySelectorAll('.btn--primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            btn.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
            btn.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
        });
    });

    // ---------- NAV SCROLL ----------
    const nav = document.getElementById('nav');
    const onScroll = () => {
        if (window.scrollY > 60) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
        applyParallax();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---------- PARALLAX ----------
    const parallaxTargets = [
        { el: document.querySelector('.location__bg'), speed: 0.2 },
    ].filter(t => t.el);

    function applyParallax() {
        parallaxTargets.forEach(({ el, speed }) => {
            const rect = el.parentElement.getBoundingClientRect();
            const inView = rect.bottom > 0 && rect.top < window.innerHeight;
            if (inView) {
                const offset = (rect.top * speed) * -1;
                el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.05)`;
            }
        });
    }

    // ---------- REVEAL ON SCROLL ----------
    const revealEls = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach(el => io.observe(el));

    // ---------- INLINE TRAILER (main page) ----------
    const mainPoster = document.getElementById('mainTrailerPoster');
    const mainVideo = document.getElementById('mainTrailerVideo');

    if (mainPoster && mainVideo) {
        mainPoster.addEventListener('click', () => {
            mainPoster.classList.add('is-hidden');
            mainVideo.play().catch(err => {
                console.warn('Trailer play failed:', err);
                mainPoster.classList.remove('is-hidden');
            });
        });
        mainVideo.addEventListener('ended', () => {
            mainPoster.classList.remove('is-hidden');
        });
    }

    // Playback speed buttons
    const speedBtns = document.querySelectorAll('.speed-btn');
    speedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rate = parseFloat(btn.dataset.speed);
            if (!mainVideo || isNaN(rate)) return;
            mainVideo.playbackRate = rate;
            speedBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
        });
    });

    // ---------- BACK TO TOP ----------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const updateVisibility = () => {
            if (window.scrollY > 400) backToTop.classList.add('is-visible');
            else backToTop.classList.remove('is-visible');
        };
        window.addEventListener('scroll', updateVisibility, { passive: true });
        updateVisibility();

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- SMOOTH SCROLL ----------
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    window.addEventListener('load', () => {
        applyParallax();
    });
})();
