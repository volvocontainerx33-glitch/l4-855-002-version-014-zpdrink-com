(function () {
    var menuButton = document.querySelector('[data-mobile-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.addEventListener('error', function (event) {
        var target = event.target;
        if (target && target.tagName === 'IMG') {
            var wrap = target.closest('.poster-wrap');
            if (wrap) {
                wrap.classList.add('image-off');
            }
            target.remove();
        }
    }, true);

    var heroSlides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var heroDots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeHeroIndex = 0;

    function showHero(index) {
        if (!heroSlides.length) {
            return;
        }
        activeHeroIndex = (index + heroSlides.length) % heroSlides.length;
        heroSlides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeHeroIndex);
        });
        heroDots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeHeroIndex);
        });
    }

    heroDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
    });

    if (heroSlides.length > 1) {
        window.setInterval(function () {
            showHero(activeHeroIndex + 1);
        }, 5200);
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var filterCards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-list] .movie-card, [data-filter-list] .rank-row'));
    var emptyState = document.querySelector('[data-empty-state]');

    function applyFilter(value) {
        var query = String(value || '').trim().toLowerCase();
        var visible = 0;
        filterCards.forEach(function (card) {
            var text = String(card.getAttribute('data-search') || card.textContent || '').toLowerCase();
            var matched = !query || text.indexOf(query) !== -1;
            card.classList.toggle('filter-hidden', !matched);
            if (matched) {
                visible += 1;
            }
        });
        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    }

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        if (initialQuery) {
            filterInput.value = initialQuery;
        }
        applyFilter(filterInput.value);
        filterInput.addEventListener('input', function () {
            applyFilter(filterInput.value);
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-site-search]')).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = 'movies.html';
            }
        });
    });
})();
