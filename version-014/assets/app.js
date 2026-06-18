(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function initSearchForms() {
        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                if (query) {
                    event.preventDefault();
                    window.location.href = "./search.html?q=" + encodeURIComponent(query);
                }
            });
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle("active", idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle("active", idx === current);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }
        dots.forEach(function (dot, idx) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                show(idx);
                start();
            });
        });
        start();
    }

    function normalize(value) {
        return String(value || "").toLowerCase();
    }

    function initCatalogTools() {
        document.querySelectorAll(".catalog-section").forEach(function (section) {
            var keywordInput = section.querySelector("[data-filter-keyword]");
            var yearSelect = section.querySelector("[data-filter-year]");
            var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card"));
            if (!cards.length) {
                return;
            }
            function apply() {
                var keyword = normalize(keywordInput && keywordInput.value).trim();
                var year = yearSelect ? yearSelect.value : "";
                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags")
                    ].map(normalize).join(" ");
                    var yearOk = !year || card.getAttribute("data-year") === year;
                    var keywordOk = !keyword || text.indexOf(keyword) !== -1;
                    card.classList.toggle("is-hidden", !(yearOk && keywordOk));
                });
            }
            if (keywordInput) {
                keywordInput.addEventListener("input", apply);
            }
            if (yearSelect) {
                yearSelect.addEventListener("change", apply);
            }
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");
            if (q && keywordInput) {
                keywordInput.value = q;
                apply();
            }
        });
    }

    function initPlayer(config) {
        var video = document.getElementById(config.videoId);
        var overlay = document.getElementById(config.overlayId);
        var source = config.source;
        var hlsInstance = null;
        var attached = false;
        if (!video || !source) {
            return;
        }
        function attach() {
            if (attached) {
                return Promise.resolve();
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return Promise.resolve();
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                return new Promise(function (resolve) {
                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        resolve();
                    });
                });
            }
            video.src = source;
            return Promise.resolve();
        }
        function play() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            attach().then(function () {
                var attempt = video.play();
                if (attempt && typeof attempt.catch === "function") {
                    attempt.catch(function () {});
                }
            });
        }
        if (overlay) {
            overlay.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance && typeof hlsInstance.destroy === "function") {
                hlsInstance.destroy();
            }
        });
    }

    ready(function () {
        initMenu();
        initSearchForms();
        initHero();
        initCatalogTools();
    });

    window.VideoHub = {
        initPlayer: initPlayer
    };
})();
