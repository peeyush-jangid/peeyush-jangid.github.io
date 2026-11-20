/* "Download PDF" for Excel – Formulas & Questions. Exports the tab that is open (formulas table or Q&A).
   It copies what is on screen, so when the page is in Hindi the PDF is in Hindi too.
   Load AFTER pj-tools-extra.js and BEFORE pj-tools-app.js. */
(function () {
  var xt = TOOLS.find(function (t) { return t.id === 'excel-formulas'; });
  if (!xt) return;
  var inner = xt.render, LIB = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
  var CSS = '<style>.pdfdoc .card{border:0!important;box-shadow:none!important;padding:0!important;margin:0 0 12px!important;background:none!important}' +
    '.pdfdoc table{width:100%;border-collapse:collapse;font-size:11px}.pdfdoc th,.pdfdoc td{padding:6px 8px;border-bottom:1px solid #e2e8f0;text-align:left;vertical-align:top;overflow-wrap:anywhere}' +
    '.pdfdoc th{background:#f1f5f9}.pdfdoc tr{page-break-inside:avoid}.pdfdoc code{background:#eef2ff;padding:1px 5px;border-radius:4px;font-size:10.5px}' +
    '.pdfdoc h3{font-size:14px;margin:14px 0 8px;color:#1d4ed8}.pdfdoc details{border:1px solid #e2e8f0;border-radius:8px;padding:2px 12px;margin:0 0 8px;page-break-inside:avoid}' +
    '.pdfdoc summary{list-style:none;font-weight:600;padding:8px 0}.pdfdoc summary::-webkit-details-marker{display:none}.pdfdoc p{margin:0 0 8px}</style>';

  function loadLib() {
    return window.html2pdf ? Promise.resolve() : new Promise(function (ok, no) {
      var s = document.createElement('script'); s.src = LIB; s.onload = ok; s.onerror = function () { no(new Error('lib')); }; document.head.appendChild(s);
    });
  }
  function build(main, kind) {
    var hi = window.PJ_LANG === 'hi';
    var title = kind === 'f' ? (hi ? 'Excel फ़ॉर्मूले और शॉर्टकट' : 'Excel Formulas & Shortcuts') : (hi ? 'Excel प्रश्न और उत्तर' : 'Excel Questions & Answers');
    var root = main.querySelector(kind === 'f' ? '#xl-f' : '#xl-q').cloneNode(true);
    root.removeAttribute('id'); root.removeAttribute('hidden');
    root.querySelectorAll('[hidden]').forEach(function (e) { e.removeAttribute('hidden'); });
    root.querySelectorAll('input').forEach(function (i) { var c = i.closest('.card'); if (c && !c.querySelector('table')) c.remove(); else i.remove(); });
    root.querySelectorAll('button').forEach(function (b) { b.remove(); });
    root.querySelectorAll('tr').forEach(function (r) { if (r.lastElementChild && !r.lastElementChild.textContent.trim()) r.lastElementChild.remove(); });
    root.querySelectorAll('details').forEach(function (d) { d.setAttribute('open', ''); });
    var doc = document.createElement('div');
    doc.className = 'pdfdoc';
    doc.style.cssText = 'width:760px;padding:8px 10px;background:#fff;color:#111;font:12px/1.55 Poppins,"Nirmala UI","Noto Sans Devanagari",system-ui,sans-serif';
    doc.innerHTML = CSS + '<div style="border-bottom:3px solid #2563eb;padding-bottom:10px;margin-bottom:14px"><div style="font-size:20px;font-weight:700;color:#1d4ed8">' + title + '</div><div style="color:#64748b;font-size:11px">Peeyush Tools Hub · peeyush-jangid.github.io · ' + new Date().toLocaleDateString('en-IN') + '</div></div>';
    doc.appendChild(root);
    return { doc: doc, title: title, file: (kind === 'f' ? 'Excel-Formulas' : 'Excel-Questions-Answers') + (hi ? '-Hindi' : '') + '.pdf' };
  }
  function printFallback(o) {
    var f = document.createElement('iframe'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'; document.body.appendChild(f);
    var d = f.contentWindow.document; d.open();
    d.write('<!doctype html><meta charset="utf-8"><title>' + o.file.replace('.pdf', '') + '</title><style>@page{margin:12mm}body{margin:0}</style>' + o.doc.outerHTML.replace('width:760px', 'width:auto')); d.close();
    setTimeout(function () { f.contentWindow.focus(); f.contentWindow.print(); setTimeout(function () { f.remove(); }, 3000); }, 400);
  }

  xt.render = function (el) {
    el.innerHTML = '<div class="noprint" style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="btn" id="xl-pdf" type="button">⬇ Download PDF</button></div><div id="xl-main"></div>';
    var main = el.querySelector('#xl-main'), btn = el.querySelector('#xl-pdf');
    inner(main);
    btn.addEventListener('click', function () {
      var tab = main.querySelector('.tab.on'), o = build(main, tab && tab.dataset.t === 'q' ? 'q' : 'f'), label = btn.textContent;
      btn.disabled = true; btn.textContent = '⏳ Preparing PDF…';
      loadLib().then(function () {
        return html2pdf().set({
          margin: [10, 8, 12, 8], filename: o.file, image: { type: 'jpeg', quality: .95 },
          html2canvas: { scale: 1.5, useCORS: true, backgroundColor: '#ffffff', windowWidth: 800 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', 'details', 'h3'] }
        }).from(o.doc).save();
      }).then(function () { toast('PDF downloaded ✓'); })
        .catch(function () { toast('Opening print dialog – choose "Save as PDF"'); printFallback(o); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  };
})();
