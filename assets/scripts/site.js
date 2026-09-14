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

  /* ---- Shared helpers for data-driven pages (articles.js, properties.js) ---- */
  function queryParam(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }
  function findById(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }
  /* Text always goes in via textContent, so data-file copy is never parsed as markup. */
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
  /* Filenames from data files must be bare names, so links stay inside their asset folder. */
  function safeFile(name) {
    if (typeof name !== "string" || !name) return "";
    if (/[\/\\]/.test(name) || name.indexOf("..") !== -1) return "";
    return name;
  }
  /* Body blocks: { type: "p" | "h2", text } and { type: "ul", items }. */
  function renderBlocks(container, blocks) {
    Array.prototype.forEach.call(blocks || [], function (block) {
      if (block.type === "p" || block.type === "h2") {
        container.appendChild(el(block.type, "", block.text));
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
        container.appendChild(list);
      }
      /* Unknown block types are skipped rather than thrown on. */
    });
  }
  /* Download rows for files in assets/docs/; the panel stays hidden when nothing valid is listed. */
  function renderAttachments(section, list, items) {
    if (!section || !list) return;
    Array.prototype.forEach.call(items || [], function (item) {
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
      list.appendChild(link);
    });
    section.hidden = list.children.length === 0;
  }

  /* ---- News & advisories: shared article data (see assets/scripts/articles.js) ---- */
  var articles = window.RBD_ARTICLES || [];

  function articleUrl(article) {
    return "article.html?id=" + encodeURIComponent(article.id);
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
    var current = findById(articles, queryParam("id"));
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

      renderBlocks(articleBody, current.body);
      renderAttachments(
        document.querySelector("[data-article-downloads]"),
        document.querySelector("[data-article-download-list]"),
        current.attachments
      );

      if (artHead) artHead.hidden = false;
      if (artMain) artMain.hidden = false;
      document.title = current.title + " \u2014 Rural Bank of Digos";
      var desc = document.querySelector("meta[name=\"description\"]");
      if (desc) desc.setAttribute("content", current.summary || "");
    }
  }

  /* ---- Foreclosed assets: shared property data (see assets/scripts/properties.js) ---- */
  var properties = window.RBD_PROPERTIES || [];
  var HEAD_OFFICE = { office: "Head Office", phone: "+082 553-4641", email: "rbdigos@rbap.org" };

  function propertyUrl(property) {
    return "property.html?id=" + encodeURIComponent(property.id);
  }
  function isAmount(n) {
    return typeof n === "number" && isFinite(n) && n > 0;
  }
  function formatPrice(price) {
    if (!isAmount(price)) return "Price upon inquiry";
    /* Whole pesos show no decimals; anything with centavos always shows two (890,000.50). */
    var digits = price % 1 === 0 ? 0 : 2;
    return "\u20B1" + price.toLocaleString("en-PH", { minimumFractionDigits: digits, maximumFractionDigits: 2 });
  }
  function formatArea(sqm) {
    return sqm.toLocaleString("en-PH") + " sq m";
  }
  /* Valid photos only, as { src, alt }; entries with a path or no file are dropped. */
  function propertyPhotos(property) {
    var photos = [];
    Array.prototype.forEach.call(property.photos || [], function (photo) {
      var file = photo && safeFile(photo.file);
      if (!file) return;
      photos.push({ src: "assets/images/properties/" + encodeURIComponent(file), alt: photo.alt || property.title || "" });
    });
    return photos;
  }
  function propertyLine(container, iconName, text) {
    if (!text) return;
    var line = el("span", "property__line");
    line.appendChild(icon(iconName));
    line.appendChild(el("span", "", text));
    container.appendChild(line);
  }
  function areaSummary(property) {
    var parts = [];
    if (isAmount(property.lotArea)) parts.push("Lot " + formatArea(property.lotArea));
    if (isAmount(property.floorArea)) parts.push("Floor " + formatArea(property.floorArea));
    return parts.join(" \u00B7 ");
  }

  /* Decides whether a listing card stays visible for the current filters.
     query  search box text, already trimmed and lower-cased ("" when the box is empty).
     type   selected property type, exactly as written in properties.js ("" means all types). */
  function propertyMatches(property, query, type) {
    // TODO(human): return true only when the property fits both the type filter and the search text.
    return true;
  }

  /* ---- Foreclosed assets: listing cards + search / type filter ---- */
  var propertyList = document.querySelector("[data-property-list]");
  if (propertyList) {
    var propFilters = document.querySelector("[data-property-filters]");
    var propSearch = document.querySelector("[data-property-search]");
    var propType = document.querySelector("[data-property-type]");
    var propEmpty = document.querySelector("[data-property-empty]");
    var propCards = [];
    var propTypes = [];

    Array.prototype.forEach.call(properties, function (property) {
      var card = el("article", "property");

      /* The photo repeats the title link, so it is kept out of the tab order and screen reader output. */
      var photoLink = el("a", "property__photo");
      photoLink.href = propertyUrl(property);
      photoLink.tabIndex = -1;
      photoLink.setAttribute("aria-hidden", "true");
      var cover = propertyPhotos(property)[0];
      if (cover) {
        var img = el("img");
        img.src = cover.src;
        img.alt = "";
        img.loading = "lazy";
        photoLink.appendChild(img);
      } else {
        photoLink.classList.add("property__photo--empty");
        photoLink.appendChild(icon("fa-solid fa-house"));
      }
      card.appendChild(photoLink);

      var body = el("div", "property__body");
      if (property.type) body.appendChild(el("span", "tag tag--rates", property.type));
      var title = el("h3", "property__title");
      var titleLink = el("a", "", property.title);
      titleLink.href = propertyUrl(property);
      title.appendChild(titleLink);
      body.appendChild(title);
      if (property.summary) body.appendChild(el("p", "property__summary", property.summary));

      var lines = el("div", "property__lines");
      propertyLine(lines, "fa-solid fa-location-dot", property.location);
      propertyLine(lines, "fa-solid fa-ruler-combined", areaSummary(property));
      if (lines.children.length) body.appendChild(lines);

      var foot = el("div", "property__foot");
      foot.appendChild(el("span", "property__price" + (isAmount(property.price) ? "" : " property__price--ask"), formatPrice(property.price)));
      var more = el("a", "property__more", "View details");
      more.href = propertyUrl(property);
      more.appendChild(icon("fa-solid fa-arrow-right"));
      foot.appendChild(more);
      body.appendChild(foot);

      card.appendChild(body);
      propertyList.appendChild(card);
      propCards.push({ node: card, property: property });

      if (property.type && propTypes.indexOf(property.type) === -1) propTypes.push(property.type);
    });

    if (propType) {
      propTypes.sort().forEach(function (type) {
        var option = el("option", "", type);
        option.value = type;
        propType.appendChild(option);
      });
    }
    /* Nothing to filter when nothing is listed. */
    if (propFilters) propFilters.hidden = properties.length === 0;

    var applyPropertyFilter = function () {
      var q = propSearch ? propSearch.value.trim().toLowerCase() : "";
      var t = propType ? propType.value : "";
      var shown = 0;
      propCards.forEach(function (entry) {
        var hit = propertyMatches(entry.property, q, t);
        entry.node.hidden = !hit;
        if (hit) shown++;
      });
      if (propEmpty) {
        propEmpty.hidden = shown !== 0;
        propEmpty.textContent = properties.length === 0
          ? "No properties are listed for sale at the moment."
          : "No property matches your search. Try another town or property type.";
      }
    };
    if (propSearch) propSearch.addEventListener("input", applyPropertyFilter);
    if (propType) propType.addEventListener("change", applyPropertyFilter);
    applyPropertyFilter();
  }

  /* ---- Property detail: renders whichever property.html?id=... was asked for ---- */
  var propertyBody = document.querySelector("[data-property-body]");
  if (propertyBody) {
    var prop = findById(properties, queryParam("id"));
    var propHead = document.querySelector("[data-property-head]");
    var propMain = document.querySelector("[data-property-main]");
    var propMissHead = document.querySelector("[data-property-missing-head]");
    var propMiss = document.querySelector("[data-property-missing]");
    var fill = function (selector, text) {
      var node = document.querySelector(selector);
      if (node) node.textContent = text || "";
      return node;
    };

    if (!prop) {
      /* Sold properties are deleted from the data file, so old links land here. */
      if (propMissHead) propMissHead.hidden = false;
      if (propMiss) propMiss.hidden = false;
      document.title = "Property not found \u2014 Rural Bank of Digos";
    } else {
      var typeTag = fill("[data-property-type-tag]", prop.type);
      if (typeTag) typeTag.hidden = !prop.type;
      fill("[data-property-location]", prop.location);
      fill("[data-property-title]", prop.title);
      var summaryNode = fill("[data-property-summary]", prop.summary);
      if (summaryNode) summaryNode.hidden = !prop.summary;
      var priceNode = fill("[data-property-price]", formatPrice(prop.price));
      if (priceNode) priceNode.classList.toggle("property__price--ask", !isAmount(prop.price));

      var specs = document.querySelector("[data-property-specs]");
      if (specs) {
        var addSpec = function (label, value) {
          if (!value) return;
          var row = el("div", "specs__row");
          row.appendChild(el("dt", "", label));
          row.appendChild(el("dd", "", value));
          specs.appendChild(row);
        };
        addSpec("Property type", prop.type);
        addSpec("Location", prop.location);
        if (isAmount(prop.lotArea)) addSpec("Lot area", formatArea(prop.lotArea));
        if (isAmount(prop.floorArea)) addSpec("Floor area", formatArea(prop.floorArea));
      }

      var gallery = document.querySelector("[data-property-gallery]");
      var mainPhoto = document.querySelector("[data-property-photo]");
      var thumbs = document.querySelector("[data-property-thumbs]");
      var photos = propertyPhotos(prop);
      if (gallery && mainPhoto && photos.length) {
        var showPhoto = function (index) {
          mainPhoto.src = photos[index].src;
          mainPhoto.alt = photos[index].alt;
          if (!thumbs) return;
          Array.prototype.forEach.call(thumbs.children, function (thumb, i) {
            thumb.setAttribute("aria-pressed", i === index ? "true" : "false");
          });
        };
        if (thumbs && photos.length > 1) {
          photos.forEach(function (photo, i) {
            var thumb = el("button", "gallery__thumb");
            thumb.type = "button";
            thumb.setAttribute("aria-label", "Show photo " + (i + 1) + " of " + photos.length);
            var thumbImg = el("img");
            thumbImg.src = photo.src;
            thumbImg.alt = "";
            thumbImg.loading = "lazy";
            thumb.appendChild(thumbImg);
            thumb.addEventListener("click", function () { showPhoto(i); });
            thumbs.appendChild(thumb);
          });
        } else if (thumbs) {
          thumbs.hidden = true;
        }
        showPhoto(0);
        gallery.hidden = false;
      }

      renderBlocks(propertyBody, prop.body);
      propertyBody.hidden = propertyBody.children.length === 0;

      /* Accepts the <iframe> code from Google Maps (Share > Embed a map) or just its src link.
         Anything that is not a https://www.google.com/maps/embed link comes back empty. */
      var mapEmbedSrc = function (value) {
        if (typeof value !== "string") return "";
        var raw = value.trim();
        var tag = /<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i.exec(raw);
        if (tag) raw = tag[1];
        else if (raw.indexOf("<") !== -1) return "";
        raw = raw.replace(/&amp;/g, "&");
        try {
          var url = new URL(raw);
          if (url.protocol === "https:" && url.hostname === "www.google.com" && url.pathname.indexOf("/maps/embed") === 0) {
            return url.href;
          }
        } catch (err) {}
        return "";
      };
      var mapPanel = document.querySelector("[data-property-map]");
      var mapFrame = document.querySelector("[data-property-map-frame]");
      var mapSrc = mapEmbedSrc(prop.mapEmbed);
      if (mapPanel && mapFrame && mapSrc) {
        var frame = el("iframe");
        frame.src = mapSrc;
        frame.title = "Map showing " + (prop.title || "the property");
        frame.loading = "lazy";
        frame.referrerPolicy = "no-referrer-when-downgrade";
        frame.allowFullscreen = true;
        mapFrame.appendChild(frame);
        /* The embed link does not open well as a page of its own, so the button searches the address instead. */
        var mapLink = document.querySelector("[data-property-map-link]");
        if (mapLink) {
          if (prop.location) mapLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(prop.location);
          else mapLink.parentNode.hidden = true;
        }
        mapPanel.hidden = false;
      }

      /* Each contact field falls back to the head office on its own. */
      var contact = prop.contact || {};
      var phone = contact.phone || HEAD_OFFICE.phone;
      var email = contact.email || HEAD_OFFICE.email;
      fill("[data-property-office]", contact.office || HEAD_OFFICE.office);
      var phoneLink = fill("[data-property-phone]", phone);
      if (phoneLink) phoneLink.href = "tel:" + phone.replace(/[^\d+]/g, "");
      var emailLink = fill("[data-property-email]", email);
      if (emailLink) emailLink.href = "mailto:" + email;

      if (propHead) propHead.hidden = false;
      if (propMain) propMain.hidden = false;
      document.title = prop.title + " \u2014 Properties for Sale \u2014 Rural Bank of Digos";
      var propDesc = document.querySelector("meta[name=\"description\"]");
      if (propDesc) propDesc.setAttribute("content", prop.summary || "");
    }
  }
})();
