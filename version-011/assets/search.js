(function () {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }

  function createCard(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return "<a class=\"search-card\" href=\"" + movie.url + "\">" +
      "<img src=\"" + movie.image + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
      "<div>" +
      "<div class=\"movie-tags\">" + tags + "</div>" +
      "<h3>" + escapeHtml(movie.title) + "</h3>" +
      "<p>" + escapeHtml(movie.desc) + "</p>" +
      "<div class=\"movie-meta\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.year) + "</span></div>" +
      "</div>" +
      "</a>";
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>\"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
      }[char];
    });
  }

  function initSearch() {
    var input = document.getElementById("searchInput");
    var typeFilter = document.getElementById("typeFilter");
    var regionFilter = document.getElementById("regionFilter");
    var results = document.getElementById("searchResults");
    if (!input || !typeFilter || !regionFilter || !results || !Array.isArray(MOVIE_LIST)) {
      return;
    }

    input.value = getQuery();

    function render() {
      var query = input.value.trim().toLowerCase();
      var typeValue = typeFilter.value;
      var regionValue = regionFilter.value;
      var filtered = MOVIE_LIST.filter(function (movie) {
        var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags.join(" ")].join(" ").toLowerCase();
        var typeOk = !typeValue || text.indexOf(typeValue.toLowerCase()) !== -1;
        var regionOk = !regionValue || text.indexOf(regionValue.toLowerCase()) !== -1;
        var queryOk = !query || text.indexOf(query) !== -1;
        return typeOk && regionOk && queryOk;
      }).slice(0, 120);

      if (!filtered.length) {
        results.innerHTML = "<div class=\"empty-state\">没有找到匹配内容</div>";
        return;
      }
      results.innerHTML = filtered.map(createCard).join("");
    }

    input.addEventListener("input", render);
    typeFilter.addEventListener("change", render);
    regionFilter.addEventListener("change", render);
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
})();
