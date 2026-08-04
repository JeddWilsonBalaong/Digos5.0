/* RBDigos website — behaviour. Plain JS, no dependencies. */
(function () {
  "use strict";

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- Cookie / privacy consent (remembers the choice) ---- */
  var consent = document.getElementById("consent");
  if (consent) {
    var KEY = "rbdigos-consent";
    var seen = false;
    try { seen = localStorage.getItem(KEY) === "1"; } catch (e) { seen = true; }
    if (!seen) consent.hidden = false;
    consent.addEventListener("click", function (e) {
      if (!e.target.closest("[data-consent-accept]")) return;
      try { localStorage.setItem(KEY, "1"); } catch (err) {}
      consent.hidden = true;
    });
  }

  /* ---- Services: Save / Borrow switch ---- */
  var choices = document.querySelectorAll("[data-choice]");
  Array.prototype.forEach.call(choices, function (btn) {
    btn.addEventListener("click", function () {
      var mode = btn.getAttribute("data-choice");
      Array.prototype.forEach.call(choices, function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      Array.prototype.forEach.call(document.querySelectorAll("[data-list]"), function (list) {
        list.hidden = list.getAttribute("data-list") !== mode;
      });
      closeAllRows();
    });
  });

  /* ---- Services: product accordion (one open at a time) ---- */
  function closeAllRows() {
    Array.prototype.forEach.call(document.querySelectorAll(".row"), function (row) {
      row.classList.remove("is-open");
      var head = row.querySelector(".row__head");
      var body = row.querySelector(".row__body");
      if (head) head.setAttribute("aria-expanded", "false");
      if (body) body.hidden = true;
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll(".row__head"), function (head) {
    head.addEventListener("click", function () {
      var row = head.closest(".row");
      var body = row.querySelector(".row__body");
      var wasOpen = row.classList.contains("is-open");
      closeAllRows();
      if (!wasOpen) {
        row.classList.add("is-open");
        head.setAttribute("aria-expanded", "true");
        body.hidden = false;
      }
    });
  });

  /* ---- Branches: filter offices by town or name ---- */
  var search = document.getElementById("office-search");
  if (search) {
    var run = function () {
      var q = search.value.trim().toLowerCase();
      Array.prototype.forEach.call(document.querySelectorAll("[data-offices]"), function (group) {
        var shown = 0;
        Array.prototype.forEach.call(group.querySelectorAll("[data-office]"), function (card) {
          var hit = card.getAttribute("data-office").toLowerCase().indexOf(q) !== -1;
          card.hidden = !hit;
          if (hit) shown++;
        });
        var empty = group.parentNode.querySelector("[data-empty]");
        if (empty) {
          empty.hidden = shown !== 0;
          if (shown === 0) empty.textContent = "No office matches \u201C" + search.value + "\u201D.";
        }
        group.hidden = shown === 0;
      });
    };
    search.addEventListener("input", run);
  }
})();
