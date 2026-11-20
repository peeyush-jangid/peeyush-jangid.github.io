/* Video Editor tool – runs 100% in the browser (nothing is uploaded).
   Trim, speed, rotate, resize, colour filters, mute, save a frame as PNG, export to a new video file.
   Load AFTER pj-tools-pdf.js and BEFORE pj-tools-app.js. */
(function () {
  if (typeof TOOLS === 'undefined' || !Array.isArray(TOOLS)) return;
  if (TOOLS.some(function (t) { return t.id === 'video-editor'; })) return;

  var NAME = 'Video Editor';
  var DESC = 'Trim, speed up or slow down, rotate, resize, add filters and export your video – free, in your browser.';
  var ICON = '🎬';

  /* Build the tool entry by mirroring the fields an existing tool already has,
     so it fits whatever structure the hub's core file uses. */
  var tpl = TOOLS.find(function (t) { return t.id === 'excel-formulas'; }) || TOOLS[0] || {};
  var tool = { id: 'video-editor', name: NAME, title: NAME, desc: DESC, icon: ICON };
  Object.keys(tpl).forEach(function (k) {
    var v = tpl[k];
    if (k === 'id' || k === 'render') return;
    if (typeof v === 'string') {
      if (/^(name|title|label)$/i.test(k)) tool[k] = NAME;
      else if (/desc|sub|summary/i.test(k)) tool[k] = DESC;
      else if (/ico|emoji/i.test(k)) tool[k] = ICON;
      else if (/tag|keyword|search/i.test(k)) tool[k] = 'video editor trim cut speed rotate resize filter mute mp4 webm frame ' + v;
      else tool[k] = v;
    } else if (Array.isArray(v) && v.every(function (x) { return typeof x === 'string'; })) {
      tool[k] = /tag|keyword|search/i.test(k) ? ['video', 'editor', 'trim', 'cut', 'speed', 'rotate', 'resize', 'filter', 'mp4', 'webm'] : v.slice();
    } else if (v !== undefined && typeof v !== 'function' && typeof v !== 'object') {
      tool[k] = v;
    }
  });

  var audioCtx = null, audioSrc = null, audioDest = null, busy = false;

  function fmt(sec) {
    sec = Math.max(0, sec || 0);
    var m = Math.floor(sec / 60), s = (sec % 60).toFixed(1);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function say(msg) { if (typeof toast === 'function') toast(msg); }

  tool.render = function (el) {
    el.innerHTML =
      '<div class="card">' +
      '<p style="margin:0 0 10px">Choose a video from your device. Everything is processed on your device – nothing is uploaded.</p>' +
      '<input id="ve-file" type="file" accept="video/*">' +
      '</div>' +
      '<div class="card" id="ve-work" hidden>' +
      '<video id="ve-vid" controls playsinline style="width:100%;max-height:420px;background:#000;border-radius:10px"></video>' +
      '<div id="ve-info" style="margin:8px 0;font-size:13px;opacity:.8"></div>' +

      '<h3 style="margin:14px 0 8px">✂ Trim</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;align-items:end">' +
      '<label>Start (sec)<br><input id="ve-s" type="number" min="0" step="0.1" value="0" style="width:100%"></label>' +
      '<label>End (sec)<br><input id="ve-e" type="number" min="0" step="0.1" value="0" style="width:100%"></label>' +
      '<button class="btn ghost" id="ve-ss" type="button">Start = current time</button>' +
      '<button class="btn ghost" id="ve-se" type="button">End = current time</button>' +
      '</div>' +

      '<h3 style="margin:16px 0 8px">⚙ Adjust</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">' +
      '<label>Speed<br><select id="ve-spd" style="width:100%"><option value="0.5">0.5x (slow)</option><option value="0.75">0.75x</option><option value="1" selected>1x (normal)</option><option value="1.5">1.5x</option><option value="2">2x</option><option value="3">3x</option><option value="4">4x (fast)</option></select></label>' +
      '<label>Rotate<br><select id="ve-rot" style="width:100%"><option value="0">0°</option><option value="90">90° right</option><option value="180">180°</option><option value="270">90° left</option></select></label>' +
      '<label>Output size<br><select id="ve-res" style="width:100%"><option value="0">Original</option><option value="1080">1080p</option><option value="720">720p</option><option value="480">480p</option><option value="360">360p</option></select></label>' +
      '<label style="display:flex;align-items:center;gap:8px"><input id="ve-mute" type="checkbox"> Mute audio</label>' +
      '</div>' +

      '<h3 style="margin:16px 0 8px">🎨 Filters</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">' +
      '<label>Brightness<br><input id="ve-br" type="range" min="50" max="150" value="100" style="width:100%"></label>' +
      '<label>Contrast<br><input id="ve-co" type="range" min="50" max="150" value="100" style="width:100%"></label>' +
      '<label>Saturation<br><input id="ve-sa" type="range" min="0" max="200" value="100" style="width:100%"></label>' +
      '<label style="display:flex;align-items:center;gap:8px"><input id="ve-bw" type="checkbox"> Black &amp; white</label>' +
      '</div>' +

      '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px">' +
      '<button class="btn" id="ve-go" type="button">▶ Export video</button>' +
      '<button class="btn ghost" id="ve-png" type="button">📷 Save current frame (PNG)</button>' +
      '<button class="btn ghost" id="ve-reset" type="button">↺ Reset</button>' +
      '</div>' +
      '<div id="ve-msg" style="margin-top:12px;font-size:13px"></div>' +
      '<div id="ve-out" style="margin-top:12px"></div>' +
      '<p style="font-size:12px;opacity:.7;margin:12px 0 0">Note: export runs in real time (a 1-minute clip takes about 1 minute at 1x), so keep this tab open and visible until it finishes. Filters work in Chrome, Edge and Firefox.</p>' +
      '</div>';

    var $ = function (id) { return el.querySelector('#' + id); };
    var v = $('ve-vid'), work = $('ve-work'), msg = $('ve-msg'), out = $('ve-out'), goBtn = $('ve-go');
    var curUrl = null, outUrl = null;

    function dur() { return isFinite(v.duration) ? v.duration : 0; }
    function range() {
      var s = Math.max(0, parseFloat($('ve-s').value) || 0);
      var e = parseFloat($('ve-e').value) || dur();
      e = Math.min(e, dur());
      if (e <= s) { e = dur(); }
      return { s: s, e: e };
    }
    function filterStr() {
      return 'brightness(' + $('ve-br').value + '%) contrast(' + $('ve-co').value + '%) saturate(' + $('ve-sa').value + '%)' + ($('ve-bw').checked ? ' grayscale(1)' : '');
    }
    function liveFilter() { v.style.filter = filterStr(); }
    function size() {
      var rot = parseInt($('ve-rot').value, 10), tall = parseInt($('ve-res').value, 10);
      var w0 = rot % 180 ? v.videoHeight : v.videoWidth, h0 = rot % 180 ? v.videoWidth : v.videoHeight, k = 1;
      if (tall && h0 > tall) k = tall / h0;
      return { rot: rot, W: Math.max(2, Math.round(w0 * k / 2) * 2), H: Math.max(2, Math.round(h0 * k / 2) * 2) };
    }
    function paint(ctx, z) {
      ctx.filter = filterStr();
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, z.W, z.H);
      ctx.save(); ctx.translate(z.W / 2, z.H / 2); ctx.rotate(z.rot * Math.PI / 180);
      var dw = z.rot % 180 ? z.H : z.W, dh = z.rot % 180 ? z.W : z.H;
      ctx.drawImage(v, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    }
    function seek(t) {
      return new Promise(function (ok) {
        var f = function () { v.removeEventListener('seeked', f); ok(); };
        v.addEventListener('seeked', f); v.currentTime = t;
      });
    }
    function clearOut() { if (outUrl) { URL.revokeObjectURL(outUrl); outUrl = null; } out.innerHTML = ''; }

    $('ve-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      if (curUrl) URL.revokeObjectURL(curUrl);
      clearOut(); msg.textContent = '';
      curUrl = URL.createObjectURL(f);
      v.src = curUrl;
      v.onloadedmetadata = function () {
        work.removeAttribute('hidden');
        $('ve-s').value = 0; $('ve-e').value = dur().toFixed(1);
        $('ve-info').textContent = f.name + ' · ' + v.videoWidth + '×' + v.videoHeight + ' · ' + fmt(dur());
      };
      v.onerror = function () { say('This video format cannot be opened in your browser'); };
    });

    $('ve-ss').addEventListener('click', function () { $('ve-s').value = v.currentTime.toFixed(1); });
    $('ve-se').addEventListener('click', function () { $('ve-e').value = v.currentTime.toFixed(1); });
    ['ve-br', 've-co', 've-sa', 've-bw'].forEach(function (id) { $(id).addEventListener('input', liveFilter); });
    $('ve-rot').addEventListener('change', function () { v.style.transform = ''; });

    $('ve-reset').addEventListener('click', function () {
      if (busy) return;
      $('ve-s').value = 0; $('ve-e').value = dur().toFixed(1);
      $('ve-spd').value = '1'; $('ve-rot').value = '0'; $('ve-res').value = '0';
      $('ve-br').value = 100; $('ve-co').value = 100; $('ve-sa').value = 100;
      $('ve-bw').checked = false; $('ve-mute').checked = false;
      liveFilter(); clearOut(); msg.textContent = '';
    });

    $('ve-png').addEventListener('click', function () {
      if (!v.videoWidth) return;
      var z = size(), c = document.createElement('canvas'); c.width = z.W; c.height = z.H;
      paint(c.getContext('2d'), z);
      c.toBlob(function (b) {
        var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'frame-' + fmt(v.currentTime).replace(':', 'm') + '.png';
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        say('Frame saved ✓');
      }, 'image/png');
    });

    goBtn.addEventListener('click', async function () {
      if (busy || !v.videoWidth) return;
      if (typeof MediaRecorder === 'undefined') { say('Your browser does not support video export. Please use Chrome, Edge or Firefox.'); return; }
      busy = true; goBtn.disabled = true; clearOut();
      var r = range(), z = size(), speed = parseFloat($('ve-spd').value) || 1, mute = $('ve-mute').checked;
      var canvas = document.createElement('canvas'); canvas.width = z.W; canvas.height = z.H;
      var ctx = canvas.getContext('2d');
      var stream = canvas.captureStream(30);

      try {
        if (!mute) {
          audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') await audioCtx.resume();
          if (!audioSrc || audioSrc.mediaElement !== v) { audioSrc = audioCtx.createMediaElementSource(v); audioDest = audioCtx.createMediaStreamDestination(); }
          audioSrc.disconnect(); audioSrc.connect(audioDest);
          audioDest.stream.getAudioTracks().forEach(function (t) { stream.addTrack(t); });
        } else if (audioSrc) { audioSrc.disconnect(); }
      } catch (err) { /* continue without audio */ }

      var types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'], mime = '';
      for (var i = 0; i < types.length; i++) { if (MediaRecorder.isTypeSupported(types[i])) { mime = types[i]; break; } }
      var rec, chunks = [];
      try { rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 5000000 } : undefined); }
      catch (err) { say('Could not start the recorder in this browser'); busy = false; goBtn.disabled = false; return; }
      var ext = /mp4/.test(rec.mimeType || mime) ? 'mp4' : 'webm';
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };

      var done = new Promise(function (ok) { rec.onstop = ok; });
      v.pause(); await seek(r.s);
      v.playbackRate = speed; v.muted = false;
      rec.start(250);
      try { await v.play(); } catch (err) { rec.stop(); await done; say('Browser blocked playback – click Export again'); busy = false; goBtn.disabled = false; return; }

      var stopped = false;
      function finish() { if (stopped) return; stopped = true; v.pause(); v.playbackRate = 1; if (rec.state !== 'inactive') rec.stop(); }
      v.onended = finish;
      (function loop() {
        if (stopped) return;
        paint(ctx, z);
        var pct = Math.min(100, Math.round((v.currentTime - r.s) / (r.e - r.s) * 100));
        msg.textContent = '⏳ Exporting… ' + pct + '% (keep this tab open)';
        if (v.currentTime >= r.e) { finish(); return; }
        requestAnimationFrame(loop);
      })();

      await done;
      v.onended = null;
      var blob = new Blob(chunks, { type: (rec.mimeType || mime || 'video/webm').split(';')[0] });
      outUrl = URL.createObjectURL(blob);
      var name = 'edited-video.' + ext;
      out.innerHTML = '<video controls playsinline style="width:100%;max-height:360px;background:#000;border-radius:10px"></video>' +
        '<div style="margin-top:10px"><a class="btn" download="' + name + '" href="' + outUrl + '">⬇ Download ' + name + ' (' + (blob.size / 1048576).toFixed(1) + ' MB)</a></div>';
      out.querySelector('video').src = outUrl;
      msg.textContent = '✓ Done';
      say('Video ready ✓');
      v.pause(); await seek(r.s);
      busy = false; goBtn.disabled = false;
    });
  };

  TOOLS.push(tool);
})();
