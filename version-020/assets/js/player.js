function initMoviePlayer(videoId, streamUrl) {
  var video = document.getElementById(videoId);
  if (!video || !streamUrl) {
    return;
  }

  var shell = video.closest('.player-shell');
  var startButton = shell ? shell.querySelector('[data-player-start]') : null;
  var hlsInstance = null;
  var loaded = false;

  function attachStream() {
    if (loaded) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    loaded = true;
  }

  function startPlayback() {
    attachStream();
    if (startButton) {
      startButton.classList.add('hidden');
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (startButton) {
    startButton.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    if (startButton) {
      startButton.classList.add('hidden');
    }
  });

  video.addEventListener('error', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
      loaded = false;
    }
  });
}
