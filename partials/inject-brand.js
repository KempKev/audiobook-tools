(function () {
  var PARTIAL_URL = '/audiobook-tools/partials/header-footer.html';

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
