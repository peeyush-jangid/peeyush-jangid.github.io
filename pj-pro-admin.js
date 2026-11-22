/* ===== PJ Pro – Admin-editable content =====
   Lets the Owner Admin (Tools Manager) add / edit / delete:
   • Word & PowerPoint commands  (overrides.tables['word-commands' | 'ppt-commands'] = [[command, what it does, level], …])
   • Questions & Answers for Word, PowerPoint, Excel and AutoCAD  (overrides.qa[toolId] = [[question, answer], …])
   Hooks used by pj-tools-app.js:  PJ_PRO_ADMIN.baseTables() / baseQA() / apply(overrides)  */
(function () {
  const D = window.PJD; if (!D) return;
  const LVN = { B: 'Beginner', I: 'Intermediate', P: 'Pro' };
  const lvCode = s => /^\s*i/i.test(s) ? 'I' : /^\s*(p|a)/i.test(s) ? 'P' : 'B';
  const CMD = { 'word-commands': D.word.cmds, 'ppt-commands': D.ppt.cmds };

  /* default Questions & Answers (Word / PowerPoint come from the data files) */
  const QA = {
    'word-commands': D.word.qa, 'ppt-commands': D.ppt.qa,
    'excel-formulas': [
      ['Difference between VLOOKUP and XLOOKUP?', 'VLOOKUP searches only the first column and returns to the right. XLOOKUP can look left or right, defaults to exact match and can return many columns.'],
      ['Relative vs absolute cell reference?', 'Relative (A1) changes when copied. Absolute ($A$1) stays fixed. Press F4 to toggle. Mixed ($A1 / A$1) locks only the column or row.'],
      ['What is a Pivot Table?', 'A tool to summarise big data quickly by dragging fields into Rows, Columns, Values and Filters (Insert → PivotTable).'],
      ['COUNTIF vs COUNTIFS?', 'COUNTIF counts cells that match one condition; COUNTIFS counts rows matching many conditions together. Same idea for SUMIF / SUMIFS.'],
      ['How do you find and remove duplicates?', 'Data → Remove Duplicates, or Conditional Formatting → Highlight Cells Rules → Duplicate Values to see them first.'],
      ['What is INDEX-MATCH and why use it?', 'INDEX returns a value by position, MATCH finds the position. Together they replace VLOOKUP and can look left and survive column insertions.'],
      ['How do you handle #N/A or #DIV/0! errors?', 'Wrap the formula: =IFERROR(your_formula, "") or use IFNA for only #N/A.'],
      ['What is Data Validation?', 'Rules that control what can be typed in a cell, e.g. a drop-down list (Data → Data Validation → List).'],
      ['How do you lock formulas but allow input?', 'Unlock the input cells (Format Cells → Protection), then Review → Protect Sheet.'],
      ['What are Freeze Panes?', 'View → Freeze Panes keeps header rows/columns visible while scrolling.']
    ],
    autocad: [
      ['Model space vs Paper space?', 'Model space is where you draw at full size (1:1). Paper space (layouts) is for sheet setup: title block, viewports at a scale, and plotting.'],
      ['What are Layers and why use them?', 'Layers organise objects by type (walls, duct, text, dimensions) with their own colour, linetype and lineweight; they can be turned off, frozen or locked.'],
      ['Block vs Wblock?', 'BLOCK saves a reusable object inside the current drawing. WBLOCK writes it to a separate .dwg file that can be used in other drawings.'],
      ['What is Object Snap (OSNAP)?', 'It snaps the cursor to exact points such as endpoint, midpoint, centre, intersection (toggle with F3).'],
      ['OFFSET vs COPY?', 'OFFSET creates a parallel copy at a set distance (for lines, polylines, circles). COPY duplicates an object to any point.'],
      ['What is an XREF?', 'An external reference attaches another drawing without merging it; updates in the source appear in all files that reference it.'],
      ['Line vs Polyline?', 'Each LINE is a separate object. A POLYLINE is one connected object that can have width, arcs and a single area/length.'],
      ['How do you set plot scale and lineweights?', 'Use a layout viewport set to a scale (e.g. 1:100) and plot with a CTB/STB style so colours map to lineweights.'],
      ['What does PURGE do?', 'Removes unused layers, blocks, linetypes and styles to reduce file size.'],
      ['What is a drawing template (.dwt)?', 'A saved starting file with units, layers, text/dimension styles and title block so every drawing follows company standards.']
    ]
  };
  const BASE_CMD = Object.fromEntries(Object.entries(CMD).map(([k, v]) => [k, v.map(r => [r[1], r[2], LVN[r[0]]])]));
  const BASE_QA = JSON.parse(JSON.stringify(QA));

  window.PJ_PRO_ADMIN = {
    baseTables: () => JSON.parse(JSON.stringify(BASE_CMD)),
    baseQA: () => JSON.parse(JSON.stringify(BASE_QA)),
    apply(ov) {
      if (!ov || typeof ov !== 'object') return;
      Object.keys(CMD).forEach(id => {
        const rows = (ov.tables || {})[id]; if (!Array.isArray(rows)) return;
        const clean = rows.filter(r => Array.isArray(r) && (r[0] || r[1])).map(r => [lvCode(String(r[2] || '')), String(r[0] || ''), String(r[1] || '')]);
        if (!clean.length) return;
        CMD[id].splice(0, CMD[id].length, ...clean);
        const t = TOOLS.find(x => x.id === id); if (t) t.desc = t.desc.replace(/^\d+\+/, clean.length + '+');
      });
      Object.keys(QA).forEach(id => {
        const q = (ov.qa || {})[id]; if (!Array.isArray(q)) return;
        const clean = q.filter(x => Array.isArray(x) && x[0] && x[1]).map(x => [String(x[0]), String(x[1])]);
        QA[id].splice(0, QA[id].length, ...clean);
      });
    }
  };

  /* Q&A card for Excel & AutoCAD (Word / PowerPoint already show theirs inside their tool) */
  ['excel-formulas', 'autocad'].forEach(id => {
    const t = TOOLS.find(x => x.id === id); if (!t) return;
    const orig = t.render;
    t.render = el => {
      orig(el);
      const list = QA[id]; if (!list || !list.length) return;
      const card = document.createElement('div'); card.className = 'card';
      card.innerHTML = `<h3 style="margin-top:0">🎤 Questions &amp; Answers (${list.length})</h3><input type="search" placeholder="Search questions…" id="qaq">` +
        list.map(x => `<details data-s="${esc((x[0] + ' ' + x[1]).toLowerCase())}"><summary><b>${esc(x[0])}</b></summary><p style="white-space:pre-wrap">${esc(x[1])}</p></details>`).join('');
      const pb = el.querySelector('.pp-wrap'); el.insertBefore(card, pb || null);
      card.querySelector('#qaq').oninput = e => { const v = e.target.value.trim().toLowerCase(); card.querySelectorAll('details').forEach(d => d.hidden = !!v && !d.dataset.s.includes(v)); };
    };
  });
})();
