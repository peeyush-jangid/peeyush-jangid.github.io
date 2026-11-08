// Certificate upload / list / delete for admin.html. Files go to the /certificates folder of the repo.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ALLOWED = ['pdf', 'jpg', 'jpeg', 'png', 'webp'], MAX_MB = 50, DIR = 'certificates';

  function cfg() { return { owner: $('owner').value.trim(), repo: $('repo').value.trim(), branch: $('branch').value.trim() || 'main' }; }
  function tok() { return $('token').value.trim(); }
  function say(m, bad) { var s = $('status'); s.textContent = m; s.style.color = bad ? '#ff9b9b' : '#d9bd7b'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function base() { var c = cfg(); return 'https://api.github.com/repos/' + c.owner + '/' + c.repo + '/contents/'; }
  function ref() { return '?ref=' + encodeURIComponent(cfg().branch); }

  function api(url, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ Authorization: 'Bearer ' + tok(), Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }, opts.headers || {});
    return fetch(url, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(r.status + ' ' + (d.message || 'GitHub API error'));
        return d;
      });
    });
  }
  function readB64(file) {
    return new Promise(function (ok, no) {
      var r = new FileReader();
      r.onload = function () { ok(String(r.result).split(',')[1]); };
      r.onerror = function () { no(new Error('Could not read ' + file.name)); };
      r.readAsDataURL(file);
    });
  }

  function refresh() {
    var box = $('admin-certificates');
    if (!tok()) { box.textContent = 'Paste your GitHub token first.'; return Promise.resolve(); }
    box.textContent = 'Loading…';
    return api(base() + DIR + ref()).then(function (a) {
      var fs = Array.isArray(a) ? a.filter(function (x) { return x.type === 'file'; }) : [];
      box.innerHTML = fs.length ? fs.map(function (f) {
        return '<div class="admin-file"><span>' + esc(f.name) + '</span><a href="' + esc(f.html_url) + '" target="_blank" rel="noopener">Open on GitHub ↗</a>' +
          '<button class="admin-del" data-path="' + esc(f.path) + '" data-sha="' + esc(f.sha) + '">Delete</button></div>';
      }).join('') : 'No certificates uploaded yet.';
    }).catch(function (e) {
      box.textContent = e.message.indexOf('404') === 0 ? 'No certificates yet. Upload your first one to create the folder.' : e.message;
    });
  }

  $('upload-certificates').addEventListener('click', function () {
    var files = Array.prototype.slice.call($('certificates').files), btn = $('upload-certificates');
    if (!tok()) return say('Please paste your GitHub token.', true);
    if (!files.length) return say('Choose at least one certificate file.', true);
    btn.disabled = true;
    var chain = Promise.resolve();
    files.forEach(function (f) {
      chain = chain.then(function () {
        var ext = (f.name.split('.').pop() || '').toLowerCase();
        if (ALLOWED.indexOf(ext) < 0) throw new Error(f.name + ': only PDF, JPG, PNG or WEBP are allowed.');
        if (f.size > MAX_MB * 1024 * 1024) throw new Error(f.name + ': file exceeds ' + MAX_MB + ' MB.');
        say('Uploading ' + f.name + '…');
        var name = f.name.normalize('NFKD').replace(/[^\w.-]+/g, '_'), path = DIR + '/' + name;
        return readB64(f).then(function (content) {
          return api(base() + path + ref()).then(function (d) { return d.sha; }, function (e) { if (e.message.indexOf('404') !== 0) throw e; })
            .then(function (sha) {
              var body = { message: 'Add/update certificate: ' + name, content: content, branch: cfg().branch };
              if (sha) body.sha = sha;
              return api(base() + path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            });
        });
      });
    });
    chain.then(function () {
      say('Certificates uploaded. The website will show them in a minute or two.');
      $('certificates').value = '';
      return refresh();
    }).catch(function (e) { say(e.message, true); }).then(function () { btn.disabled = false; });
  });

  $('refresh-certificates').addEventListener('click', refresh);

  $('admin-certificates').addEventListener('click', function (e) {
    var b = e.target.closest('.admin-del');
    if (!b) return;
    var name = b.dataset.path.split('/').pop();
    if (!confirm('Delete ' + name + '?')) return;
    b.disabled = true;
    api(base() + b.dataset.path, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Delete certificate: ' + name, sha: b.dataset.sha, branch: cfg().branch }) })
      .then(function () { say(name + ' deleted. The website will update in a minute or two.'); return refresh(); })
      .catch(function (err) { say(err.message, true); b.disabled = false; });
  });
})();
