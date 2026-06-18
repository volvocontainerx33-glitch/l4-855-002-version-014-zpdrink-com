(function () {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 6500);
    }
  }

  function normalizeText(value) {
    return String(value || '').toLowerCase().trim();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setupLocalFilter() {
    var grid = document.querySelector('[data-card-grid]');
    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var searchInput = document.querySelector('[data-card-search]');
    var regionFilter = document.querySelector('[data-filter="region"]');
    var typeFilter = document.querySelector('[data-filter="type"]');
    var yearFilter = document.querySelector('[data-filter="year"]');
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var presetQuery = params.get('q');

    if (searchInput && presetQuery) {
      searchInput.value = presetQuery;
    }

    function applyFilter() {
      var query = normalizeText(searchInput && searchInput.value);
      var region = normalizeText(regionFilter && regionFilter.value);
      var type = normalizeText(typeFilter && typeFilter.value);
      var year = normalizeText(yearFilter && yearFilter.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalizeText([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        var match = true;

        if (query && haystack.indexOf(query) === -1) {
          match = false;
        }
        if (region && normalizeText(card.getAttribute('data-region')) !== region) {
          match = false;
        }
        if (type && normalizeText(card.getAttribute('data-type')) !== type) {
          match = false;
        }
        if (year && normalizeText(card.getAttribute('data-year')) !== year) {
          match = false;
        }

        card.style.display = match ? '' : 'none';
        if (match) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    [searchInput, regionFilter, typeFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }

  function setupSiteSearch() {
    var data = Array.isArray(window.SearchMovies) ? window.SearchMovies : [];
    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-site-search]'));

    inputs.forEach(function (input) {
      var form = input.closest('form');
      var panel = form ? form.querySelector('[data-search-panel]') : null;

      function closePanel() {
        if (panel) {
          panel.classList.remove('open');
          panel.innerHTML = '';
        }
      }

      function renderResults() {
        if (!panel) {
          return;
        }

        var query = normalizeText(input.value);
        if (!query) {
          closePanel();
          return;
        }

        var results = data.filter(function (item) {
          return normalizeText(item.text).indexOf(query) !== -1;
        }).slice(0, 8);

        if (results.length === 0) {
          panel.innerHTML = '<div class="empty-state show">没有匹配内容</div>';
          panel.classList.add('open');
          return;
        }

        panel.innerHTML = results.map(function (item) {
          var safeTitle = escapeHtml(item.title);
          var safeMeta = escapeHtml(item.meta);
          var safeImage = escapeHtml(item.image);
          var safeUrl = escapeHtml(item.url);
          return '<a class="search-result" href="' + safeUrl + '">' +
            '<img src="' + safeImage + '" alt="' + safeTitle + '">' +
            '<span><strong>' + safeTitle + '</strong><span>' + safeMeta + '</span></span>' +
            '</a>';
        }).join('');
        panel.classList.add('open');
      }

      input.addEventListener('input', renderResults);
      input.addEventListener('focus', renderResults);

      if (form) {
        form.addEventListener('submit', function (event) {
          var query = normalizeText(input.value);
          if (!query) {
            event.preventDefault();
            return;
          }

          var first = data.find(function (item) {
            return normalizeText(item.text).indexOf(query) !== -1;
          });
          if (first) {
            event.preventDefault();
            window.location.href = first.url;
          }
        });
      }

      document.addEventListener('click', function (event) {
        if (form && !form.contains(event.target)) {
          closePanel();
        }
      });
    });
  }

  setupLocalFilter();
  setupSiteSearch();
})();
