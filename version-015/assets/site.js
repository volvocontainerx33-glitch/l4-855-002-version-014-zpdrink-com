(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  }

  function setupFilters() {
    var filterInputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    filterInputs.forEach(function (input) {
      var scope = input.closest("[data-filter-scope]") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-chip]"));
      var empty = scope.querySelector("[data-empty-result]");
      var activeValue = "all";

      function run() {
        var query = normalize(input.value);
        var visible = 0;
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-search"));
          var chipMatch = activeValue === "all" || text.indexOf(activeValue) !== -1;
          var textMatch = !query || text.indexOf(query) !== -1;
          var pass = chipMatch && textMatch;
          card.style.display = pass ? "" : "none";
          if (pass) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      }

      input.addEventListener("input", run);
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeValue = normalize(chip.getAttribute("data-filter-value") || "all");
          chips.forEach(function (item) {
            item.classList.toggle("is-active", item === chip);
          });
          run();
        });
      });
      run();
    });
  }

  function setupSearchPage() {
    var form = document.querySelector("[data-site-search-form]");
    var input = document.querySelector("[data-site-search-input]");
    var results = document.querySelector("[data-search-results]");
    if (!form || !input || !results || !window.SEARCH_INDEX) {
      return;
    }

    function getQuery() {
      var params = new URLSearchParams(window.location.search);
      return params.get("q") || input.value || "";
    }

    function render(query) {
      var value = normalize(query);
      input.value = query;
      var entries = window.SEARCH_INDEX.filter(function (item) {
        return !value || normalize(item.title + " " + item.region + " " + item.type + " " + item.genre + " " + item.tags + " " + item.year + " " + item.oneLine).indexOf(value) !== -1;
      }).slice(0, 120);
      results.innerHTML = entries.map(function (item) {
        return [
          '<article class="search-result-card card-hover">',
          '<a href="' + item.href + '"><img src="' + item.poster + '" alt="' + item.title.replace(/"/g, '&quot;') + '"></a>',
          '<div>',
          '<h2><a href="' + item.href + '">' + item.title + '</a></h2>',
          '<div class="movie-meta"><span>' + item.year + '</span><span>·</span><span>' + item.region + '</span><span>·</span><span>' + item.type + '</span></div>',
          '<p>' + item.oneLine + '</p>',
          '<div class="action-row"><a class="btn btn-soft" href="' + item.href + '">查看详情</a></div>',
          '</div>',
          '</article>'
        ].join("");
      }).join("");
      if (!entries.length) {
        results.innerHTML = '<div class="empty-result" style="display:block">没有找到匹配影片</div>';
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = input.value.trim();
      var nextUrl = query ? "./search.html?q=" + encodeURIComponent(query) : "./search.html";
      window.history.replaceState(null, "", nextUrl);
      render(query);
    });

    render(getQuery());
  }

  onReady(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
})();
