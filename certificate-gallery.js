// Public certificates gallery: lists files from the /certificates folder of the GitHub repo.
// Empty until the owner uploads something from admin.html.
(function () {
  var OWNER = 'peeyush-jangid', REPO = 'peeyush-jangid.github.io', BRANCH = 'main';
  var grid = document.getElementById('cert-grid');
  if (!grid) return;
  var IMG = /\.(jpe?g|png|webp)$/i, PDF = /\.pdf$/i;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function title(name) { return name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function empty() { grid.innerHTML = '<div class="cert-empty">No certificates added yet.</div>'; }

  var url = 'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/certificates?ref=' + encodeURIComponent(BRANCH);
  fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) { return r.ok ? r.json() : []; })   // 404 = folder not created yet = no certificates
    .catch(function () { return []; })
    .then(function (list) {
      var files = (Array.isArray(list) ? list : []).filter(function (f) { return f.type === 'file' && (IMG.test(f.name) || PDF.test(f.name)); });
      if (!files.length) return empty();
      grid.innerHTML = files.map(function (f) {
        var href = 'certificates/' + encodeURIComponent(f.name);
        var thumb = IMG.test(f.name)
          ? '<img src="' + href + '" alt="' + esc(title(f.name)) + '" loading="lazy">'
          : '<div class="cert-pdf"><b>PDF</b><span>CERTIFICATE</span></div>';
        return '<a class="cert-card" href="' + href + '" target="_blank" rel="noopener"><div class="cert-thumb">' + thumb + '</div>' +
          '<div class="cert-meta"><strong>' + esc(title(f.name)) + '</strong><span>' + (IMG.test(f.name) ? 'VIEW ↗' : 'OPEN PDF ↗') + '</span></div></a>';
      }).join('');
    });
})();
