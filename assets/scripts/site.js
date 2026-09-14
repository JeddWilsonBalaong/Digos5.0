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

  /* ---- Home: featured stories carousel ---- */
  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    var cSlides = carousel.querySelectorAll("[data-carousel-slide]");
    var cDots = carousel.querySelectorAll("[data-carousel-dot]");
    var cPrev = carousel.querySelector("[data-carousel-prev]");
    var cNext = carousel.querySelector("[data-carousel-next]");
    var cCurrent = 0;
    var cTimer = null;
    var C_AUTOPLAY_MS = 6000;
    var cReduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var carouselGoTo = function (index) {
      var next = (index + cSlides.length) % cSlides.length;
      Array.prototype.forEach.call(cSlides, function (slide, i) {
        var on = i === next;
        slide.classList.toggle("is-active", on);
        slide.setAttribute("aria-hidden", on ? "false" : "true");
        var cta = slide.querySelector(".btn");
        if (cta) cta.tabIndex = on ? 0 : -1;
      });
      Array.prototype.forEach.call(cDots, function (dot, i) {
        var on = i === next;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-selected", on ? "true" : "false");
      });
      cCurrent = next;
    };

    var carouselStop = function () {
      if (cTimer) { window.clearInterval(cTimer); cTimer = null; }
    };
    var carouselPlay = function () {
      if (cReduceMotion) return;
      carouselStop();
      cTimer = window.setInterval(function () { carouselGoTo(cCurrent + 1); }, C_AUTOPLAY_MS);
    };

    if (cPrev) cPrev.addEventListener("click", function () { carouselGoTo(cCurrent - 1); carouselPlay(); });
    if (cNext) cNext.addEventListener("click", function () { carouselGoTo(cCurrent + 1); carouselPlay(); });
    Array.prototype.forEach.call(cDots, function (dot, i) {
      dot.addEventListener("click", function () { carouselGoTo(i); carouselPlay(); });
    });

    carousel.addEventListener("mouseenter", carouselStop);
    carousel.addEventListener("mouseleave", carouselPlay);
    carousel.addEventListener("focusin", carouselStop);
    carousel.addEventListener("focusout", function (e) {
      if (!carousel.contains(e.relatedTarget)) carouselPlay();
    });

    carouselGoTo(0);
    carouselPlay();
  }

  /* ---- News & advisories: shared article data (see assets/scripts/articles.js) ---- */
  var articles = window.RBD_ARTICLES || [];

  function queryParam(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }
  function findArticle(id) {
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].id === id) return articles[i];
    }
    return null;
  }
  function articleUrl(article) {
    return "article.html?id=" + encodeURIComponent(article.id);
  }
  /* Text always goes in via textContent, so article copy is never parsed as markup. */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function icon(name) {
    var i = document.createElement("i");
    i.className = name;
    i.setAttribute("aria-hidden", "true");
    return i;
  }
  /* Filenames from article data must be bare names, so links stay inside their asset folder. */
  function safeFile(name) {
    if (typeof name !== "string" || !name) return "";
    if (/[\/\\]/.test(name) || name.indexOf("..") !== -1) return "";
    return name;
  }

  /* ---- Newsletter: advisory list ---- */
  var articleList = document.querySelector("[data-article-list]");
  if (articleList) {
    Array.prototype.forEach.call(articles, function (article) {
      var card = el("article", "notice");

      var meta = el("div", "notice__meta");
      meta.appendChild(el("span", "tag " + (article.tagClass || "tag--notice"), article.tag));
      var date = el("time", "notice__date", article.date);
      if (article.iso) date.setAttribute("datetime", article.iso);
      meta.appendChild(date);

      var body = document.createElement("div");
      body.appendChild(el("h3", "notice__title", article.title));
      body.appendChild(el("p", "notice__summary", article.summary));
      var more = el("a", "notice__more", "Read more");
      more.href = articleUrl(article);
      more.appendChild(icon("fa-solid fa-arrow-right"));
      body.appendChild(more);

      card.appendChild(meta);
      card.appendChild(body);
      articleList.appendChild(card);
    });
    var listEmpty = articleList.querySelector("[data-article-empty]");
    if (listEmpty) listEmpty.hidden = articles.length !== 0;
  }

  /* ---- Article detail: renders whichever article.html?id=... was asked for ---- */
  var articleBody = document.querySelector("[data-article-body]");
  if (articleBody) {
    var current = findArticle(queryParam("id"));
    var artHead = document.querySelector("[data-article-head]");
    var artMain = document.querySelector("[data-article-main]");
    var missHead = document.querySelector("[data-article-missing-head]");
    var missMain = document.querySelector("[data-article-missing]");

    if (!current) {
      /* The requested id is only ever compared, never written back into the page. */
      if (missHead) missHead.hidden = false;
      if (missMain) missMain.hidden = false;
      document.title = "Article not found \u2014 Rural Bank of Digos";
    } else {
      var artTag = document.querySelector("[data-article-tag]");
      var artDate = document.querySelector("[data-article-date]");
      var artTitle = document.querySelector("[data-article-title]");
      var artSummary = document.querySelector("[data-article-summary]");

      if (artTag) {
        artTag.className = "tag " + (current.tagClass || "tag--notice");
        artTag.textContent = current.tag;
      }
      if (artDate) {
        artDate.textContent = current.date;
        if (current.iso) artDate.setAttribute("datetime", current.iso);
      }
      if (artTitle) artTitle.textContent = current.title;
      if (artSummary) artSummary.textContent = current.summary;

      var hero = document.querySelector("[data-article-hero]");
      var bannerFile = current.banner && safeFile(current.banner.file);
      if (hero && bannerFile) {
        var bannerSrc = "assets/images/articles/" + encodeURIComponent(bannerFile);
        /* Preload first: a missing image leaves the plain header rather than a half-styled one. */
        var probe = new Image();
        probe.onload = function () {
          hero.style.setProperty("--hero-hw", (probe.naturalHeight / probe.naturalWidth).toFixed(4));
          hero.style.backgroundImage = "url(\"" + bannerSrc + "\")";
          hero.classList.add("article-hero");
        };
        probe.src = bannerSrc;
      }

      Array.prototype.forEach.call(current.body || [], function (block) {
        if (block.type === "p" || block.type === "h2") {
          articleBody.appendChild(el(block.type, "", block.text));
          return;
        }
        if (block.type === "ul") {
          var list = el("ul", "checklist");
          Array.prototype.forEach.call(block.items || [], function (item) {
            var li = document.createElement("li");
            li.appendChild(icon("fa-solid fa-check"));
            li.appendChild(el("span", "", item));
            list.appendChild(li);
          });
          articleBody.appendChild(list);
        }
        /* Unknown block types are skipped rather than thrown on. */
      });

      var downloads = document.querySelector("[data-article-downloads]");
      var downloadList = document.querySelector("[data-article-download-list]");
      if (downloads && downloadList) {
        Array.prototype.forEach.call(current.attachments || [], function (item) {
          var file = item && safeFile(item.file);
          if (!file) return;
          var link = el("a", "dl");
          link.href = "assets/docs/" + encodeURIComponent(file);
          link.setAttribute("download", file);
          var fileIcon = el("span", "dl__icon");
          fileIcon.appendChild(icon(/\.pdf$/i.test(file) ? "fa-solid fa-file-pdf" : "fa-solid fa-file-lines"));
          link.appendChild(fileIcon);
          link.appendChild(el("span", "dl__title", item.label || file));
          var action = el("span", "dl__action");
          action.appendChild(el("span", "", "Download"));
          action.appendChild(icon("fa-solid fa-download"));
          link.appendChild(action);
          downloadList.appendChild(link);
        });
        downloads.hidden = downloadList.children.length === 0;
      }

      if (artHead) artHead.hidden = false;
      if (artMain) artMain.hidden = false;
      document.title = current.title + " \u2014 Rural Bank of Digos";
      var desc = document.querySelector("meta[name=\"description\"]");
      if (desc) desc.setAttribute("content", current.summary || "");
    }
  }
})();
