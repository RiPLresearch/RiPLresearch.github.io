document.addEventListener("DOMContentLoaded", function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
  }

  var VISIBLE_PAPERS = 6;
  document.querySelectorAll(".pub-grid[data-collapsible]").forEach(function (grid) {
    var total = grid.querySelectorAll(".pub-card").length;
    if (total <= VISIBLE_PAPERS) return;

    var title = grid.previousElementSibling;
    var row = document.createElement("div");
    row.className = "show-more-row";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost";
    btn.setAttribute("aria-expanded", "false");
    row.appendChild(btn);
    grid.after(row);

    function render(expanded) {
      grid.classList.toggle("is-collapsed", !expanded);
      btn.setAttribute("aria-expanded", expanded);
      btn.textContent = expanded ? "Show fewer" : "Show all";
    }

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") !== "true";
      render(expanded);
      if (!expanded && title) title.scrollIntoView({ block: "start" });
    });

    render(false);
  });

  document.querySelectorAll(".pub-grid[data-scroller]").forEach(function (grid) {
    var title = grid.previousElementSibling;
    if (!title) return;

    var head = document.createElement("div");
    head.className = "group-head";
    title.before(head);
    head.appendChild(title);

    var controls = document.createElement("div");
    controls.className = "scroll-controls";
    function makeBtn(dir) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "scroll-btn";
      b.setAttribute("aria-label", "Scroll " + (dir < 0 ? "back" : "forward"));
      b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7") + '"/></svg>';
      b.addEventListener("click", function () {
        var card = grid.querySelector(".pub-card");
        var step = card ? card.getBoundingClientRect().width + 24 : grid.clientWidth * 0.8;
        grid.scrollBy({ left: dir * step, behavior: "smooth" });
      });
      return b;
    }
    var prev = makeBtn(-1);
    var next = makeBtn(1);
    controls.appendChild(prev);
    controls.appendChild(next);
    head.appendChild(controls);

    grid.classList.add("is-scroller");
    grid.setAttribute("tabindex", "0");
    grid.setAttribute("role", "region");

    function update() {
      var max = grid.scrollWidth - grid.clientWidth;
      controls.hidden = max <= 1;
      prev.disabled = grid.scrollLeft <= 1;
      next.disabled = grid.scrollLeft >= max - 1;
    }
    grid.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  var filterBtns = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".pub-card[data-type]");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-type") === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });
});
