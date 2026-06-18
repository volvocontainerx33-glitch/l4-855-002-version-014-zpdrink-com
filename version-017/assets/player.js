(function () {
  window.initPlayer = function (videoId, shellId, source) {
    const video = document.getElementById(videoId);
    const shell = document.getElementById(shellId);

    if (!video || !shell || !source) {
      return;
    }

    const button = shell.querySelector('.player-action');
    let loaded = false;

    function load() {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      load();
      shell.classList.add('is-playing');
      const started = video.play();
      if (started && typeof started.catch === 'function') {
        started.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
  };
})();
