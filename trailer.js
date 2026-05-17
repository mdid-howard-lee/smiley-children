/* =============================================
   TRAILER PAGE — video player interactions
   ============================================= */

(() => {
    'use strict';

    // Play-button overlay → start video, fade poster out
    const poster = document.getElementById('playerPoster');
    const video = document.getElementById('trailerVideo');

    if (poster && video) {
        poster.addEventListener('click', () => {
            poster.classList.add('is-hidden');
            video.play().catch(err => {
                console.warn('Trailer play failed:', err);
                poster.classList.remove('is-hidden');
            });
        });

        // If the video reaches the end, bring the poster back so it's
        // obvious the trailer is replayable
        video.addEventListener('ended', () => {
            poster.classList.remove('is-hidden');
        });
    }
})();
