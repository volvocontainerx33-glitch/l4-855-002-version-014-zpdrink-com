(function () {
    function initMoviePlayer(options) {
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        var button = document.getElementById(options.buttonId);
        var attached = false;
        var hlsInstance = null;

        if (!video || !overlay || !button || !options.source) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = options.source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hlsInstance.loadSource(options.source);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = options.source;
        }

        function start() {
            attach();
            overlay.classList.add('is-hidden');
            video.controls = true;
            var playAction = video.play();

            if (playAction && typeof playAction.catch === 'function') {
                playAction.catch(function () {});
            }
        }

        button.addEventListener('click', start);
        overlay.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (!attached) {
                start();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
