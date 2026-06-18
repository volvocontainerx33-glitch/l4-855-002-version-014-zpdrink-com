(function () {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  const carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
    const dots = Array.from(carousel.querySelectorAll('.hero-dot'));
    const prev = carousel.querySelector('[data-hero-prev]');
    const next = carousel.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  const filterBox = document.querySelector('[data-filter-box]');

  if (filterBox) {
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const inputs = Array.from(filterBox.querySelectorAll('[data-filter]'));

    function match(card, key, value) {
      if (!value) {
        return true;
      }
      const source = (card.getAttribute('data-' + key) || '').toLowerCase();
      return source.indexOf(value.toLowerCase()) !== -1;
    }

    function applyFilters() {
      const values = {};
      inputs.forEach(function (input) {
        values[input.getAttribute('data-filter')] = input.value.trim();
      });

      cards.forEach(function (card) {
        const visible = match(card, 'title', values.title) &&
          match(card, 'region', values.region) &&
          match(card, 'type', values.type) &&
          match(card, 'year', values.year);
        card.style.display = visible ? '' : 'none';
      });
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', applyFilters);
      input.addEventListener('change', applyFilters);
    });
  }

  const searchRoot = document.querySelector('[data-search-root]');

  if (searchRoot && window.SEARCH_MOVIES) {
    const searchInput = searchRoot.querySelector('[data-search-input]');
    const results = searchRoot.querySelector('[data-search-results]');
    const params = new URLSearchParams(window.location.search);
    const startQuery = params.get('q') || '';

    function render(query) {
      const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const matched = window.SEARCH_MOVIES.filter(function (item) {
        if (!words.length) {
          return item.featured;
        }
        const hay = [item.title, item.region, item.type, item.year, item.genre, item.tags, item.oneLine].join(' ').toLowerCase();
        return words.every(function (word) {
          return hay.indexOf(word) !== -1;
        });
      }).slice(0, 80);

      if (!matched.length) {
        results.innerHTML = '<div class="empty-state">暂未找到匹配影片，可尝试更换关键词。</div>';
        return;
      }

      results.innerHTML = matched.map(function (item) {
        return '<a class="search-result" href="' + item.url + '">' +
          '<img src="' + item.image + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
          '<div><h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.oneLine) + '</p>' +
          '<div class="card-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div></div>' +
          '</a>';
      }).join('');
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"]/g, function (token) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        }[token];
      });
    }

    searchInput.value = startQuery;
    searchInput.addEventListener('input', function () {
      render(searchInput.value);
    });
    render(startQuery);
  }
})();
