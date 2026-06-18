(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
            showSlide(dotIndex);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(current + 1);
        }, 5600);
    }

    var filterRoot = document.querySelector('[data-filter-root]');

    if (filterRoot) {
        var searchInput = filterRoot.querySelector('[data-filter-search]');
        var yearSelect = filterRoot.querySelector('[data-filter-year]');
        var typeSelect = filterRoot.querySelector('[data-filter-type]');
        var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('.movie-card'));

        function applyFilters() {
            var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var year = yearSelect ? yearSelect.value : '';
            var type = typeSelect ? typeSelect.value : '';

            cards.forEach(function (card) {
                var title = (card.getAttribute('data-title') || '').toLowerCase();
                var region = (card.getAttribute('data-region') || '').toLowerCase();
                var cardYear = card.getAttribute('data-year') || '';
                var cardType = card.getAttribute('data-type') || '';
                var matchQuery = !q || title.indexOf(q) !== -1 || region.indexOf(q) !== -1;
                var matchYear = !year || cardYear === year;
                var matchType = !type || cardType === type;

                card.classList.toggle('hidden-card', !(matchQuery && matchYear && matchType));
            });
        }

        [searchInput, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });
    }

    var searchPage = document.querySelector('[data-search-page]');

    if (searchPage && window.SEARCH_INDEX) {
        var params = new URLSearchParams(window.location.search);
        var queryInput = searchPage.querySelector('[data-search-input]');
        var results = searchPage.querySelector('[data-search-results]');
        var status = searchPage.querySelector('[data-search-status]');
        var initialQuery = params.get('q') || '';

        if (queryInput) {
            queryInput.value = initialQuery;
        }

        function renderSearch() {
            var q = queryInput ? queryInput.value.trim().toLowerCase() : '';
            var list = window.SEARCH_INDEX.filter(function (item) {
                if (!q) {
                    return true;
                }

                return item.title.toLowerCase().indexOf(q) !== -1 ||
                    item.region.toLowerCase().indexOf(q) !== -1 ||
                    item.genre.toLowerCase().indexOf(q) !== -1 ||
                    item.tags.toLowerCase().indexOf(q) !== -1;
            }).slice(0, 96);

            if (status) {
                status.textContent = q ? '相关剧集' : '热门剧集';
            }

            if (results) {
                results.innerHTML = list.map(function (item) {
                    return '<article class="movie-card">' +
                        '<a class="poster-wrap" href="' + item.file + '">' +
                        '<img src="' + item.poster + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
                        '<span class="play-dot">▶</span>' +
                        '</a>' +
                        '<div class="movie-card-body">' +
                        '<div class="tag-row"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.year) + '</span></div>' +
                        '<h3><a href="' + item.file + '">' + escapeHtml(item.title) + '</a></h3>' +
                        '<p class="line-clamp-2">' + escapeHtml(item.oneLine) + '</p>' +
                        '<div class="movie-meta"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.genre) + '</span></div>' +
                        '</div>' +
                        '</article>';
                }).join('');
            }
        }

        function escapeHtml(value) {
            return String(value || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        if (queryInput) {
            queryInput.addEventListener('input', renderSearch);
        }

        renderSearch();
    }
})();
