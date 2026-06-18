(function () {
    var video = document.querySelector('[data-player-video]');
    var button = document.querySelector('[data-play-button]');
    var panel = document.querySelector('[data-player-panel]');

    if (!video || !button) {
        return;
    }

    var source = video.getAttribute('data-hls') || '';
    var hls = null;

    function prepareVideo() {
        if (video.getAttribute('data-ready') === '1' || !source) {
            return;
        }
        video.setAttribute('data-ready', '1');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                maxBufferLength: 45,
                enableWorker: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            return;
        }

        video.src = source;
    }

    function playVideo() {
        prepareVideo();
        var result = video.play();
        button.classList.add('is-hidden');
        if (result && typeof result.catch === 'function') {
            result.catch(function () {
                button.classList.remove('is-hidden');
            });
        }
    }

    button.addEventListener('click', playVideo);

    if (panel) {
        panel.addEventListener('click', function (event) {
            if (event.target === video) {
                return;
            }
            if (!button.classList.contains('is-hidden')) {
                playVideo();
            }
        });
    }

    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (!video.ended) {
            button.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hls && typeof hls.destroy === 'function') {
            hls.destroy();
        }
    });
})();
