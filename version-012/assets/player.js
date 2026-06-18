(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var card = document.querySelector('[data-player]');
    if (!card) {
      return;
    }
    var video = card.querySelector('video');
    var button = card.querySelector('[data-play-button]');
    var status = card.querySelector('[data-player-status]');
    if (!video) {
      return;
    }
    var stream = video.getAttribute('data-stream');
    var loaded = false;
    var hls = null;

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function attachStream() {
      if (loaded || !stream) {
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('播放遇到网络波动，请稍后重试。');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        setStatus('此设备暂不支持该高清线路。');
      }
      loaded = true;
    }

    function startPlayback() {
      attachStream();
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          setStatus('请再次点击播放按钮开始观看。');
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        startPlayback();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      card.classList.add('is-playing');
      setStatus('正在播放。');
    });

    video.addEventListener('pause', function () {
      card.classList.remove('is-playing');
      setStatus('已暂停，点击可继续播放。');
    });

    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
