/* =============================================
   BETWEEN EXPECTATIONS — interactions
   ============================================= */

(() => {
    'use strict';

    // LOADING SCREEN
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    const loaderStatus = document.getElementById('loaderStatus');
    const loaderPercent = document.getElementById('loaderPercent');

    const statusFrames = [
        { p: 0,  text: 'Preparing the story' },
        { p: 40, text: 'Lighting the hallway' },
        { p: 75, text: 'Tuning the silence' },
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

    // CUSTOM CURSOR
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

    document.querySelectorAll('[data-cursor="hover"], a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add('is-hover');
            cursorDot.classList.add('is-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('is-hover');
            cursorDot.classList.remove('is-hover');
        });
    });

    // NAV SCROLL
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');

        // Parallax on hero bg
        const heroBg = document.querySelector('.hero__bg-image');
        if (heroBg) {
            heroBg.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0)`;
        }
    }, { passive: true });

    // REVEAL ON SCROLL
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();
