/* ===== PJ Pro – Hindi & English AI Chat upgraded with a Language Tutor (Beginner → Pro) =====
   Works fully offline in the browser (rule-based tutor, no paid AI API). */
(function () {
  const D = window.PJD, PJ = window.PJ, shuffle = PJ.shuffle, pick = PJ.pick;
  const T = TOOLS.find(t => t.id === 'ai-chat'); if (!T) return;
  const origRender = T.render;
  T.desc = 'Smart assistant + learn English or Hindi from Beginner to Pro (lessons, chat practice, quiz, grammar fixer)';
  const LV = D.LV;

  const speak = (txt, lang) => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = lang; u.rate = .9; speechSynthesis.speak(u); } catch (e) { toast('Voice is not supported on this device'); } };
  const norm = s => String(s).toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/aa/g, 'a').replace(/ee|ii/g, 'i').replace(/oo|uu/g, 'u').replace(/w/g, 'v').replace(/(.)\1/g, '$1').replace(/\s+/g, ' ').trim();
  const sim = (a, b) => { const A = new Set(norm(a).split(' ').filter(Boolean)), B = new Set(norm(b).split(' ').filter(Boolean)); if (!A.size || !B.size) return 0; let n = 0; A.forEach(x => B.has(x) && n++); return n / Math.max(A.size, B.size); };
  const items = lv => D.LANG[lv].flatMap(c => c[1].map(p => ({ en: p[0], hi: p[1], ro: p[2], cat: c[0] })));

  /* grammar: detect + auto-fix */
  const FIX = [[/\bI am agree\b/gi, 'I agree'], [/\b(he|she|it) don'?t\b/gi, (m, a) => a + " doesn't"], [/\b(I|you|we|they) doesn'?t\b/gi, (m, a) => a + " don't"], [/\b(he|she|it) have\b/gi, (m, a) => a + ' has'], [/\bI has\b/g, 'I have'],
  [/\bmore better\b/gi, 'better'], [/\bmore easier\b/gi, 'easier'], [/\bdiscuss about\b/gi, 'discuss'], [/\bmarried with\b/gi, 'married to'], [/\bcould of\b/gi, 'could have'], [/\bshould of\b/gi, 'should have'], [/\bwould of\b/gi, 'would have'],
  [/\bI am knowing\b/gi, 'I know'], [/\bmy self\b/gi, 'myself'], [/\binformations\b/gi, 'information'], [/\bdid not went\b/gi, 'did not go'], [/\ba (hour|honest|MBA)\b/gi, 'an $1'], [/\ban (university|European)\b/gi, 'a $1'], [/\bi\b(?!['’])/g, 'I'], [/[ \t]{2,}/g, ' ']];
  function fixText(t) {
    let o = t; FIX.forEach(f => o = o.replace(f[0], f[1]));
    o = o.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean).map(s => { s = s.charAt(0).toUpperCase() + s.slice(1); return /[.!?]$/.test(s) ? s : s + '.'; }).join(' ');
    return o;
  }
  function grammarIssues(t) {
    const out = []; D.GRAM.forEach(g => { const m = t.match(g[0]); if (m) out.push({ bad: m[0], fix: g[1], tip: g[2] }); });
    if (t.trim() && /^[a-z]/.test(t.trim())) out.push({ bad: 'sentence starts with a small letter', fix: 'Capital letter', tip: 'Vaakya hamesha capital letter se shuru hota hai.' });
    if (t.trim() && !/[.!?]\s*$/.test(t.trim())) out.push({ bad: 'no full stop / question mark at the end', fix: 'add . ? or !', tip: 'Vaakya ke ant me . ? ya ! lagayein.' });
    return out;
  }

  T.render = el => {
    let tgt = 'en', lv = 'B', tab = 'learn';
    el.innerHTML = `<div class="card"><div class="pp-sel"><label>I want to learn<select id="tg"><option value="en">English (अंग्रेज़ी सीखें)</option><option value="hi">Hindi (हिंदी सीखें)</option></select></label><label>Level<select id="lv">${Object.entries(LV).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label></div>
      <div class="tabs" style="margin-top:14px" id="lt">${[['learn', '📚 Learn'], ['chat', '🗣️ Chat Practice'], ['quiz', '🧠 Quiz'], ['gram', '✍️ Grammar Fixer'], ['asst', '💬 Assistant']].map((t, i) => `<button class="tab ${i ? '' : 'on'}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div id="lb"></div></div>
      <p class="note">This tutor runs in your browser (rule-based). It checks keywords and common mistakes; it is not a paid online AI model, so use the model answers as your guide.</p>`;
    const lb = $('#lb', el);
    const views = {
      learn() {
        const all = items(lv), wd = all[(new Date().getDate() + 7) % all.length], cats = D.LANG[lv];
        lb.innerHTML = `<div class="pp-mini" style="margin-bottom:12px"><h4>🌟 Word / phrase of the day</h4><p><b>${esc(wd.en)}</b> = ${esc(wd.hi)} <span class="note">(${esc(wd.ro)})</span> <button class="pp-pill" data-s="${esc(tgt === 'en' ? wd.en : wd.hi)}" data-l="${tgt === 'en' ? 'en-IN' : 'hi-IN'}">🔊</button></p></div>
          <div class="row" style="margin:0 0 12px"><button class="btn sm" id="fc">🃏 Flashcards (${all.length} cards)</button></div><div id="fcbox"></div>
          ${tgt === 'en' ? `<h3>Grammar basics – ${LV[lv]}</h3><div class="pp-grid2">${D.RULES[lv].map(r => `<div class="pp-mini"><h4>${esc(r[0])}</h4><p>${esc(r[1])}</p><p style="margin-top:4px;color:#047857">${esc(r[2])}</p><p style="margin-top:4px"><i>${esc(r[3])}</i></p></div>`).join('')}</div>` : (lv === 'B' ? `<details><summary><b>अक्षर – Hindi letters (Vowels &amp; Consonants)</b></summary><p><b>Vowels (स्वर):</b> ${D.HI_LETTERS.vowels.map(x => `<span class="chip">${x[0]} · ${x[1]}</span>`).join('')}</p><p><b>Consonants (व्यंजन):</b> ${D.HI_LETTERS.consonants.map(x => `<span class="chip">${x[0]} · ${x[1]}</span>`).join('')}</p><p class="note">Tip: click on a phrase's 🔊 button to hear the pronunciation.</p></details>` : '')}
          <h3>Phrases &amp; vocabulary – ${LV[lv]}</h3>${cats.map((c, i) => `<details ${i === 0 ? 'open' : ''}><summary><b>${esc(c[0])}</b> <span class="note">(${c[1].length})</span></summary><div style="overflow-x:auto"><table class="pp-tbl"><thead><tr><th>English</th><th>हिंदी</th><th>Hindi (Roman)</th><th></th></tr></thead><tbody>${c[1].map(p => `<tr><td>${esc(p[0])}</td><td>${esc(p[1])}</td><td>${esc(p[2])}</td><td style="white-space:nowrap"><button class="pp-pill" data-s="${esc(p[0])}" data-l="en-IN" title="English">🔊 EN</button> <button class="pp-pill" data-s="${esc(p[1])}" data-l="hi-IN" title="Hindi">🔊 HI</button></td></tr>`).join('')}</tbody></table></div></details>`).join('')}`;
        $$('[data-s]', lb).forEach(b => b.onclick = () => speak(b.dataset.s, b.dataset.l));
        $('#fc', lb).onclick = () => {
          const deck = shuffle(all); let k = 0, flip = false, know = 0; const box = $('#fcbox', lb);
          const draw = () => {
            if (k >= deck.length) { box.innerHTML = `<div class="pp-mini" style="margin-bottom:12px"><h4>Deck finished 🎉</h4><p>You knew ${know} of ${deck.length}. Press Flashcards again to repeat.</p></div>`; return; }
            const c = deck[k], front = tgt === 'en' ? c.hi : c.en, back = tgt === 'en' ? c.en : c.hi + '  (' + c.ro + ')';
            box.innerHTML = `<div class="pp-flash" id="fl"><div><div class="w">${esc(flip ? back : front)}</div><div class="s">${flip ? 'Tap for next action' : 'Tap to see the ' + (tgt === 'en' ? 'English' : 'Hindi') + ' answer'}</div></div></div>
              <div class="row"><span class="note" style="align-self:center">${k + 1} / ${deck.length}</span>${flip ? '<button class="btn sm" id="kn">✓ I knew it</button><button class="btn ghost sm" id="dn">✗ Again later</button>' : ''}<button class="pp-pill" id="sp">🔊 Listen</button></div>`;
            $('#fl', box).onclick = () => { flip = !flip; draw(); };
            $('#sp', box).onclick = () => speak(tgt === 'en' ? c.en : c.hi, tgt === 'en' ? 'en-IN' : 'hi-IN');
            if (flip) { $('#kn', box).onclick = () => { know++; k++; flip = false; draw(); }; $('#dn', box).onclick = () => { deck.push(c); k++; flip = false; draw(); }; }
          };
          draw();
        };
      },
      chat() {
        if (tgt === 'hi') {
          const pool = items(lv); let n = 0, ok = 0, cur = null;
          lb.innerHTML = `<p class="note" style="margin-top:0">Translation chat: the bot gives an English sentence – reply in Hindi using English letters (e.g. <i>Mera naam Rahul hai</i>). Spelling can vary, so we check the main words.</p><div class="chat" id="ch"></div><div class="chatin"><input id="mg" placeholder="Type the Hindi sentence in Roman letters…" autocomplete="off"><button class="btn" id="sd">Send</button></div><div class="row"><button class="btn ghost sm" id="rv">Reveal answer</button><button class="btn ghost sm" id="sk">Skip</button></div>`;
          const ch = $('#ch', lb), post = (t, c) => { const d = document.createElement('div'); d.className = 'msg ' + c; d.textContent = t; ch.appendChild(d); ch.scrollTop = ch.scrollHeight; };
          const ask = () => { cur = pick(pool); post(`How do you say this in Hindi?\n“${cur.en}”`, 'b'); };
          const send = () => { const v = $('#mg', lb).value.trim(); if (!v || !cur) return; $('#mg', lb).value = ''; post(v, 'u'); n++; const s = sim(v, cur.ro); if (s >= .6) { ok++; post(`✅ Very good!\n${cur.hi}\n(${cur.ro})`, 'b'); } else post(`Close – keep trying.\nCorrect: ${cur.hi}\n(${cur.ro})`, 'b'); setTimeout(ask, 500); };
          $('#sd', lb).onclick = send; $('#mg', lb).onkeydown = e => e.key === 'Enter' && send();
          $('#rv', lb).onclick = () => cur && post(`${cur.hi}\n(${cur.ro})`, 'b'); $('#sk', lb).onclick = () => { cur && post('Skipped', 'u'); ask(); };
          post('Namaste! 🙏 Let’s practise Hindi. I will give you English sentences.', 'b'); ask(); return;
        }
        const avail = D.SCEN.filter(s => LV[s.lv] && ['B', 'I', 'P'].indexOf(s.lv) <= ['B', 'I', 'P'].indexOf(lv));
        lb.innerHTML = `<div class="pp-sel"><label>Conversation scenario<select id="sc">${avail.map((s, i) => `<option value="${i}">${esc(s.t)} (${LV[s.lv]})</option>`).join('')}</select></label><button class="btn" id="st">Start conversation</button></div><p class="note">The bot speaks first. Reply in English; you get feedback, a model reply and grammar fixes after every answer.</p><div class="chat" id="ch" style="margin-top:10px"></div><div class="chatin"><input id="mg" placeholder="Type your reply in English…" autocomplete="off"><button class="btn" id="sd">Send</button><button class="btn ghost" id="mic" title="Speak">🎤</button></div>`;
        const ch = $('#ch', lb), post = (t, c) => { const d = document.createElement('div'); d.className = 'msg ' + c; d.textContent = t; ch.appendChild(d); ch.scrollTop = ch.scrollHeight; if (c === 'b') { } };
        let sc, k = 0, good = 0, tries = 0;
        const bot = () => { const t = sc.turns[k]; post(t.bot, 'b'); speak(t.bot, 'en-IN'); };
        $('#st', lb).onclick = () => { sc = avail[+$('#sc', lb).value]; k = 0; good = 0; tries = 0; ch.innerHTML = ''; post('Let’s start: ' + sc.t + ' 🎬', 'b'); bot(); };
        const send = () => {
          if (!sc) return toast('Press “Start conversation” first'); const v = $('#mg', lb).value.trim(); if (!v) return; $('#mg', lb).value = ''; post(v, 'u');
          const t = sc.turns[k], low = v.toLowerCase(), words = (v.match(/\S+/g) || []).length, hit = t.kw.some(x => low.includes(x)), iss = grammarIssues(v);
          const gm = iss.length ? '\n✍️ Grammar: ' + iss.slice(0, 2).map(x => `“${x.bad}” → ${x.fix}`).join('; ') + '\n' + iss[0].tip : '';
          if (hit && words >= 2) { good++; post(`✅ Good answer!${gm}\n💡 Model: ${t.model}`, 'b'); tries = 0; k++; }
          else if (tries < 1) { tries++; post(`🤔 Not quite on topic.\n💡 Tip: ${t.tip}\nTry again.${gm}`, 'b'); return; }
          else { post(`Let’s move on.\n💡 Model: ${t.model}\n${t.tip}`, 'b'); tries = 0; k++; }
          if (k >= sc.turns.length) { setTimeout(() => post(`🎉 Conversation finished! Score: ${good} / ${sc.turns.length}. ${good === sc.turns.length ? 'Excellent English!' : 'Practise again to improve.'}`, 'b'), 400); sc = null; } else setTimeout(bot, 500);
        };
        $('#sd', lb).onclick = send; $('#mg', lb).onkeydown = e => e.key === 'Enter' && send();
        $('#mic', lb).onclick = () => { const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return toast('Voice typing is not supported here'); const r = new SR(); r.lang = 'en-IN'; r.onresult = e => { $('#mg', lb).value = e.results[0][0].transcript; }; r.onerror = () => toast('Could not hear you'); r.start(); toast('Listening… speak now 🎤'); };
      },
      quiz() {
        const all = items(lv); lb.innerHTML = `<p class="note" style="margin-top:0">${tgt === 'en' ? 'Choose the correct English for the Hindi sentence.' : 'Choose the correct Hindi (Roman) for the English sentence.'}</p><div class="pp-sel"><label>Questions<select id="n"><option>5</option><option selected>10</option><option>15</option></select></label><button class="btn" id="go">Start quiz</button></div><div id="qb"></div>`;
        const go = () => {
          const n = Math.min(+$('#n', lb).value, all.length), qs = shuffle(all).slice(0, n).map(c => {
            const ans = tgt === 'en' ? c.en : c.ro, ds = shuffle(all.filter(x => x !== c)).slice(0, 3).map(x => tgt === 'en' ? x.en : x.ro), o = shuffle([ans, ...ds]);
            return { t: 'mcq', q: tgt === 'en' ? `${c.hi}  (${c.ro})` : `“${c.en}”`, o, a: o.indexOf(ans), e: `${c.en} = ${c.hi} (${c.ro})` };
          });
          PJ.renderQuiz($('#qb', lb), qs, { minutes: 0, key: 'test:lang-' + tgt + '-' + lv, title: (tgt === 'en' ? 'English' : 'Hindi') + ' quiz – ' + LV[lv], again: go });
        };
        $('#go', lb).onclick = go;
      },
      gram() {
        if (tgt === 'hi') { lb.innerHTML = '<p>Grammar Fixer checks <b>English</b> sentences. Switch “I want to learn” to English to use it.</p>'; return; }
        lb.innerHTML = `<label class="fld"><span>Write English sentences (Hindi speakers’ common mistakes are checked)</span><textarea id="gt" rows="5" placeholder="e.g. i am agree with you. he don't know more better."></textarea></label><div class="row"><button class="btn" id="gc">Check &amp; fix</button><button class="btn ghost" id="gx">Try example</button></div><div id="go"></div>`;
        $('#gx', lb).onclick = () => $('#gt', lb).value = 'i am agree with you\nhe don\'t know the answer\nwe discuss about the project and it is more better';
        $('#gc', lb).onclick = () => {
          const t = $('#gt', lb).value; if (!t.trim()) return toast('Write something first'); const iss = grammarIssues(t), fx = fixText(t);
          $('#go', lb).innerHTML = `<div class="card" style="margin-top:12px"><h3 style="margin-top:0">Corrected text</h3><div class="copybox">${esc(fx)}</div><div class="row"><button class="btn sm" id="cpy">Copy</button></div></div><div class="card"><h3 style="margin-top:0">${iss.length ? iss.length + ' issue(s) found' : '✅ No common mistakes found'}</h3>${iss.map(x => `<div class="pp-issue w"><span class="pp-bad">${esc(x.bad)}</span> → <span class="pp-fix">${esc(x.fix)}</span><small>${esc(x.tip)}</small></div>`).join('')}<p class="note">This checks common mistakes only. For complex grammar, read your sentence aloud and compare with the model sentences in Learn.</p></div>`;
          $('#cpy', lb).onclick = () => copy(fx);
        };
      },
      asst() { lb.innerHTML = '<div id="orig"></div>'; origRender($('#orig', lb)); }
    };
    const show = t => { tab = t; $$('#lt .tab', el).forEach(b => b.classList.toggle('on', b.dataset.t === t)); views[t](); };
    $$('#lt .tab', el).forEach(b => b.onclick = () => show(b.dataset.t));
    $('#tg', el).onchange = e => { tgt = e.target.value; show(tab); }; $('#lv', el).onchange = e => { lv = e.target.value; show(tab); };
    show('learn');
  };
})();
