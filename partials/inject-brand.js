/* The Audiobook Guy — shared header/footer + visit counting — v4.0 */
(function () {
  var PARTIAL_URL = '/partials/header-footer.html';
  var CF_TOKEN = 'e507622930b742f38359269efc450644';

  // Cookieless visit counting (Cloudflare Web Analytics).
  // Only runs on the live tools site, never locally or inside another site, and only once per page.
  function loadAnalytics() {
    if (!/theaudiobookguy\.co\.uk$/i.test(location.hostname)) return;
    if (window.top !== window) return;
    if (document.querySelector('script[data-cf-beacon]')) return;
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_TOKEN }));
    document.head.appendChild(s);
  }

  function inject(doc) {
    var headerSlot = document.getElementById('tag-header');
    var footerSlot = document.getElementById('tag-footer');
    if (!headerSlot && !footerSlot) return;

    doc.querySelectorAll('style[data-tag-brand-style], link[data-tag-brand-font]').forEach(function (node) {
      document.head.appendChild(node.cloneNode(true));
    });

    if (headerSlot) {
      var headerTpl = doc.getElementById('tag-brand-header-tpl');
      if (headerTpl) headerSlot.replaceWith(headerTpl.content.cloneNode(true));
    }
    if (footerSlot) {
      var footerTpl = doc.getElementById('tag-brand-footer-tpl');
      if (footerTpl) footerSlot.replaceWith(footerTpl.content.cloneNode(true));
    }
  }

  try { loadAnalytics(); } catch (e) { /* counting must never break a tool */ }

  fetch(PARTIAL_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('Brand partial fetch failed: ' + res.status);
      return res.text();
    })
    .then(function (html) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      inject(doc);
    })
    .catch(function (err) {
      console.error('The Audiobook Guy brand injection failed:', err);
    });
})();
