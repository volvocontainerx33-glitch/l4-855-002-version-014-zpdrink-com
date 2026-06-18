(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  ready(function () {
    var video = document.getElementById("movie-video");
    var trigger = document.querySelector("[data-player-start]");
    if (!video || !trigger) {
      return;
    }

    var source = trigger.getAttribute("data-video-url");
    var cover = document.querySelector(".player-cover");
    var hlsInstance = null;

    function attachSource() {
      if (!source || video.getAttribute("data-ready") === "1") {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
      video.setAttribute("data-ready", "1");
    }

    function start() {
      attachSource();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(function () {});
      }
    }

    trigger.addEventListener("click", start);
    Array.prototype.slice.call(document.querySelectorAll("[data-player-jump]")).forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        if (window.location.hash !== "#play") {
          window.location.hash = "play";
        }
        start();
      });
    });
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
