(function () {
    const toggle = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
    let activeSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === activeSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === activeSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5600);
    }

    const filterWrap = document.querySelector("[data-filter-wrap]");

    if (filterWrap) {
        const input = filterWrap.querySelector("[data-filter-input]");
        const button = filterWrap.querySelector("[data-filter-button]");
        const cards = Array.from(document.querySelectorAll("[data-search]"));
        const emptyState = document.querySelector("[data-empty-state]");

        function applyFilter() {
            const query = input ? input.value.trim().toLowerCase() : "";
            let visibleCount = 0;
            cards.forEach(function (card) {
                const blob = (card.getAttribute("data-search") || "").toLowerCase();
                const visible = !query || blob.indexOf(query) !== -1;
                card.style.display = visible ? "" : "none";
                if (visible) {
                    visibleCount += 1;
                }
            });
            if (emptyState) {
                emptyState.classList.toggle("is-visible", visibleCount === 0);
            }
        }

        if (input) {
            const params = new URLSearchParams(window.location.search);
            const query = params.get("q");
            if (query) {
                input.value = query;
            }
            input.addEventListener("input", applyFilter);
            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    applyFilter();
                }
            });
        }
        if (button) {
            button.addEventListener("click", applyFilter);
        }
        applyFilter();
    }
})();
