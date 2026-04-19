(function () {
  var CARD_WIDTH = 400;
  var CARD_HEIGHT = 500;
  var CARD_GAP = 16;
  var MOBILE_BREAKPOINT = 768;

  var card = null;
  var currentHref = null;

  function isMobile() {
    return window.innerWidth < MOBILE_BREAKPOINT;
  }

  function removeCard() {
    if (card) {
      card.remove();
      card = null;
      currentHref = null;
    }
  }

  function positionCard(el, anchorRect) {
    var left = anchorRect.right + CARD_GAP;
    var top = anchorRect.top;

    if (left + CARD_WIDTH > window.innerWidth) {
      left = anchorRect.left - CARD_WIDTH - CARD_GAP;
    }
    if (top + CARD_HEIGHT > window.innerHeight) {
      top = window.innerHeight - CARD_HEIGHT - CARD_GAP;
    }
    if (top < CARD_GAP) { top = CARD_GAP; }
    if (left < CARD_GAP) { left = CARD_GAP; }

    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  function buildCard(anchorRect) {
    var el = document.createElement('div');
    el.id = 'link-preview-card';

    var header = document.createElement('div');
    header.className = 'preview-card-header';

    var titleLink = document.createElement('a');
    titleLink.className = 'preview-card-title';
    header.appendChild(titleLink);

    var body = document.createElement('div');
    body.className = 'preview-card-body';
    body.innerHTML = '<p class="preview-card-loading">Loading\u2026</p>';

    el.appendChild(header);
    el.appendChild(body);
    document.body.appendChild(el);

    positionCard(el, anchorRect);

    return { el: el, titleLink: titleLink, body: body };
  }

  async function showPreview(href, anchorRect) {
    removeCard();
    currentHref = href;

    var refs = buildCard(anchorRect);
    card = refs.el;

    try {
      var response = await fetch(href);
      if (!response.ok) { throw new Error('fetch failed'); }

      var html = await response.text();
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var baseUrl = response.url;

			refs.titleLink.textContent = "Continue To Page >>>";
      refs.titleLink.href = href;
			refs.titleLink.addEventListener('click', removeCard);

      var title = doc.querySelector('h1');
      var main = doc.querySelector('main');
      if (!main) { throw new Error('no main element'); }

      main.querySelectorAll('a[href]').forEach(function (a) {
        var rel = a.getAttribute('href');
        if (rel && rel.charAt(0) !== '#') {
          try { a.href = new URL(rel, baseUrl).href; } catch (e) {}
        }
      });
      main.querySelectorAll('img[src]').forEach(function (img) {
        var src = img.getAttribute('src');
        if (src) {
          try { img.src = new URL(src, baseUrl).href; } catch (e) {}
        }
      });

			refs.body.innerHTML = `<h1>${title.innerHTML}</h1>` + main.innerHTML;
    } catch (e) {
      refs.body.innerHTML = '<p>Could not load preview.</p>';
    }
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('.preview-link');

    if (link) {
      if (isMobile()) { return; }
      e.preventDefault();
      var href = link.getAttribute('href');
      if (!href) { return; }
      var absHref = new URL(href, document.baseURI).href;
      if (absHref === currentHref) {
        removeCard();
        return;
      }
      showPreview(absHref, link.getBoundingClientRect());
      return;
    }

    if (card && !card.contains(e.target)) {
      removeCard();
    }
  });
})();
