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
    // Loader runs at half-duration on the download page; default everywhere else.
    const loadDuration = document.body.classList.contains('page-download') ? 1300 : 2600;
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

    // ---------- INTERACTIVE SHOWCASE (Try It section) ----------
    const showcaseScene = document.getElementById('showcaseScene');
    const showcaseSuccess = document.getElementById('showcaseSuccess');
    const showcaseWrong = document.getElementById('showcaseWrong');
    const showcaseCoins = document.getElementById('showcaseCoins');
    const showcaseBg = document.getElementById('showcaseBg');
    const showcaseSceneLabel = document.getElementById('showcaseSceneLabel');
    const showcaseSpeaker = document.getElementById('showcaseSpeaker');
    const showcaseLine = document.getElementById('showcaseLine');
    const showcaseChoiceBtns = document.querySelectorAll('#showcaseChoices .showcase__choice');
    const showcaseSuccessHeadline = document.getElementById('showcaseSuccessHeadline');
    const showcaseSuccessBody = document.getElementById('showcaseSuccessBody');
    const showcaseRetryLabel = document.getElementById('showcaseRetryLabel');
    const showcaseRetrySuccess = document.getElementById('showcaseRetrySuccess');
    const showcaseRetryWrong = document.getElementById('showcaseRetryWrong');
    const showcaseProgressDots = document.querySelectorAll('#showcaseProgress .showcase__progress-dot');

    const showcaseScenes = [
        {
            sceneLabel: 'Scene 04 / 17 · The Sketchbook',
            background: 'assets/demo-quest.png',
            speaker: 'Father',
            line: '"Your mother told me about the sketches. You can\'t keep doing this."',
            choices: [
                { letter: 'A', text: "Burn it. I'll do whatever you want.", correct: false },
                { letter: 'B', text: "I'll do it anyway. You can't stop me.", correct: false },
                { letter: 'C', text: "I hear you. Can we talk about it tonight?", correct: true },
            ],
            headline: 'Honest. Brave. Heard.',
            body: "You didn't lie and you didn't run. You bought a sentence — and that's how trust starts.",
        },
        {
            sceneLabel: 'Scene 07 / 17 · The Dinner',
            background: 'assets/location.png',
            speaker: 'Mother',
            line: "\"Sit down. We're eating. Don't look at me like that.\"",
            choices: [
                { letter: 'A', text: "I'm not hungry. I'll be in my room.", correct: false },
                { letter: 'B', text: "Fine. I'll smile and chew.", correct: false },
                { letter: 'C', text: "I'll sit. Can I tell you about my day?", correct: true },
            ],
            headline: 'A meal becomes a conversation.',
            body: "You stayed at the table. You opened a door instead of closing one.",
        },
        {
            sceneLabel: 'Scene 09 / 17 · The Bus Stop',
            background: 'assets/demo-quest.png',
            speaker: 'Jamie',
            line: "\"You're skipping dinner again, aren't you? You can't just disappear from your own life.\"",
            choices: [
                { letter: 'A', text: "I'm fine. Leave it.", correct: false },
                { letter: 'B', text: "It's complicated. You wouldn't get it.", correct: false },
                { letter: 'C', text: "I don't know what to say to them anymore.", correct: true },
            ],
            headline: 'Honesty between friends.',
            body: "Naming the thing you can't name to your parents — that's how you find the words later.",
        },
        {
            sceneLabel: 'Scene 12 / 17 · The Locked Door',
            background: 'assets/location.png',
            speaker: 'Father',
            line: "\"I knocked twice. You didn't answer. I'm coming in.\"",
            choices: [
                { letter: 'A', text: "Then please leave.", correct: false },
                { letter: 'B', text: "Fine, sit down, whatever.", correct: false },
                { letter: 'C', text: "I'm here. I was just listening to something.", correct: true },
            ],
            headline: 'The door, slightly open.',
            body: "You let him in. The room is smaller now, but warmer.",
        },
        {
            sceneLabel: 'Scene 16 / 17 · The Sentence',
            background: 'assets/demo-quest.png',
            speaker: 'Mother',
            line: "\"Whatever you're about to say — say it. We're listening this time.\"",
            choices: [
                { letter: 'A', text: "Forget it. It's nothing.", correct: false },
                { letter: 'B', text: "I think I want to leave home next year.", correct: false },
                { letter: 'C', text: "I want to be an artist. I'm telling you what's true.", correct: true },
            ],
            headline: 'The sentence said.',
            body: "Sixteen scenes of practice. One sentence. They heard you — all the way through.",
            isFinal: true,
        },
    ];

    let currentSceneIdx = 0;
    let coins = 0;

    function renderScene(idx) {
        const s = showcaseScenes[idx];
        if (!s) return;

        if (showcaseBg) showcaseBg.style.backgroundImage = `url('${s.background}')`;
        if (showcaseSceneLabel) showcaseSceneLabel.textContent = s.sceneLabel;
        if (showcaseSpeaker) showcaseSpeaker.textContent = s.speaker;
        if (showcaseLine) showcaseLine.textContent = s.line;

        showcaseChoiceBtns.forEach((btn, i) => {
            const c = s.choices[i];
            if (!c) return;
            const numEl = btn.querySelector('.showcase__choice-num');
            const textEl = btn.querySelector('.showcase__choice-text');
            if (numEl) numEl.textContent = c.letter;
            if (textEl) textEl.textContent = c.text;
            btn.dataset.choice = c.correct ? 'correct' : 'wrong';
        });

        if (showcaseSuccessHeadline) showcaseSuccessHeadline.textContent = s.headline;
        if (showcaseSuccessBody) showcaseSuccessBody.textContent = s.body;
        if (showcaseRetryLabel) showcaseRetryLabel.textContent = s.isFinal ? 'Start over' : 'Next scene';

        showcaseProgressDots.forEach((dot, i) => {
            dot.classList.remove('is-active', 'is-done');
            if (i < idx) dot.classList.add('is-done');
            else if (i === idx) dot.classList.add('is-active');
        });
    }

    function showResult(overlay) {
        if (!overlay) return;
        showcaseScene.classList.add('is-hidden');
        overlay.classList.add('is-active');
        overlay.setAttribute('aria-hidden', 'false');
    }

    function hideOverlays() {
        if (showcaseSuccess) {
            showcaseSuccess.classList.remove('is-active');
            showcaseSuccess.setAttribute('aria-hidden', 'true');
        }
        if (showcaseWrong) {
            showcaseWrong.classList.remove('is-active');
            showcaseWrong.setAttribute('aria-hidden', 'true');
        }
        if (showcaseScene) showcaseScene.classList.remove('is-hidden');
    }

    if (showcaseScene && showcaseSuccess && showcaseWrong) {
        renderScene(currentSceneIdx);

        showcaseChoiceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.choice === 'correct') {
                    coins += 5;
                    if (showcaseCoins) showcaseCoins.textContent = coins;
                    showResult(showcaseSuccess);
                } else {
                    showResult(showcaseWrong);
                }
            });
        });

        if (showcaseRetrySuccess) {
            showcaseRetrySuccess.addEventListener('click', () => {
                currentSceneIdx = (currentSceneIdx + 1) % showcaseScenes.length;
                renderScene(currentSceneIdx);
                hideOverlays();
            });
        }

        if (showcaseRetryWrong) {
            showcaseRetryWrong.addEventListener('click', hideOverlays);
        }
    }

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
