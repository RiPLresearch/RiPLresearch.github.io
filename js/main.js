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
      btn.textContent = expanded ? "Show fewer" : "Show all " + total + " papers";
    }

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") !== "true";
      render(expanded);
      if (!expanded && title) title.scrollIntoView({ block: "start" });
    });

    render(false);
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
