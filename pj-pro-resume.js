/* ===== PJ Pro – Resume Improvement v2 =====
   Upload (PDF / DOCX / TXT) or paste → choose target field & level → detailed error report → one-click auto-fix →
   bullet improver → field-wise templates. Runs 100% in the browser (resume never leaves the device). */
(function () {
  const D = window.PJD, PJ = window.PJ, pick = PJ.pick;
  const T = TOOLS.find(t => t.id === 'resume-improvement'); if (!T) return;
  T.desc = 'Upload your resume, pick your field – get errors, fixes, keywords and templates';
  const FIELDS = Object.keys(D.RES);

  /* ---------- file → text ---------- */
  const loadScript = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('Could not load PDF reader (check internet).')); document.head.appendChild(s); });
  async function inflate(bytes) {
    if (!('DecompressionStream' in window)) throw new Error('This browser cannot open .docx – please paste the text instead.');
    const ds = new DecompressionStream('deflate-raw'), w = ds.writable.getWriter(); w.write(bytes); w.close();
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  }
  async function docxText(buf) {
    const u = new Uint8Array(buf), v = new DataView(buf); let e = -1;
    for (let i = u.length - 22; i >= Math.max(0, u.length - 70000); i--) if (v.getUint32(i, true) === 0x06054b50) { e = i; break; }
    if (e < 0) throw new Error('This does not look like a valid .docx file.');
    let p = v.getUint32(e + 16, true); const n = v.getUint16(e + 10, true), dec = new TextDecoder();
    for (let k = 0; k < n; k++) {
      const meth = v.getUint16(p + 10, true), csz = v.getUint32(p + 20, true), nl = v.getUint16(p + 28, true), xl = v.getUint16(p + 30, true), cl = v.getUint16(p + 32, true), off = v.getUint32(p + 42, true), name = dec.decode(u.subarray(p + 46, p + 46 + nl));
      if (name === 'word/document.xml') {
        const lnl = v.getUint16(off + 26, true), lxl = v.getUint16(off + 28, true), start = off + 30 + lnl + lxl; let data = u.subarray(start, start + csz);
        if (meth === 8) data = await inflate(data);
        return dec.decode(data).replace(/<w:tab\/>/g, '\t').replace(/<w:br[^>]*\/>/g, '\n').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
      }
      p += 46 + nl + xl + cl;
    }
    throw new Error('Could not find text inside the .docx file.');
  }
  async function pdfText(buf) {
    if (!window.pdfjsLib) { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'); pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise; let out = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const tc = await (await doc.getPage(i)).getTextContent(), it = tc.items.filter(x => x.str && x.str.trim()).map(x => ({ s: x.str, x: x.transform[4], y: x.transform[5] })).sort((a, b) => b.y - a.y || a.x - b.x), rows = [];
      it.forEach(x => { const r = rows[rows.length - 1]; if (r && Math.abs(r.y - x.y) < 3) r.t += (r.t.endsWith(' ') || x.s.startsWith(' ') ? '' : ' ') + x.s; else rows.push({ y: x.y, t: x.s }); });
      out += rows.map(r => r.t.trim()).join('\n') + '\n\n';
    }
    return out;
  }
  async function fileText(f) {
    const ext = f.name.split('.').pop().toLowerCase(), buf = await f.arrayBuffer();
    if (ext === 'txt' || f.type === 'text/plain') return new TextDecoder().decode(buf);
    if (ext === 'docx') return docxText(buf);
    if (ext === 'pdf') return pdfText(buf);
    throw new Error('Please upload a PDF, DOCX or TXT file (old .doc files: save as DOCX or PDF first).');
  }

  /* ---------- rules ---------- */
  const TYPO = { recieve: 'receive', recieved: 'received', managment: 'management', mangement: 'management', responsibile: 'responsible', responsable: 'responsible', responsibilty: 'responsibility', experiance: 'experience', experiances: 'experiences', sucess: 'success', sucessful: 'successful', succesful: 'successful', definately: 'definitely', seperate: 'separate', occured: 'occurred', adress: 'address', enviroment: 'environment', knowlege: 'knowledge', comunication: 'communication', comunicate: 'communicate', languge: 'language', accomodate: 'accommodate', acheive: 'achieve', acheived: 'achieved', beleive: 'believe', independant: 'independent', buisness: 'business', bussiness: 'business', profesional: 'professional', proffesional: 'professional', graduaton: 'graduation', desgin: 'design', developement: 'development', devloped: 'developed', devloper: 'developer', techincal: 'technical', tecnical: 'technical', projet: 'project', collegue: 'colleague', mircosoft: 'Microsoft', excell: 'Excel', linkdin: 'LinkedIn', javascipt: 'JavaScript', pyhton: 'Python', perfomance: 'performance', oppurtunity: 'opportunity', sallary: 'salary', cerificate: 'certificate', certifcate: 'certificate', sincerly: 'sincerely', strenght: 'strength', strenghts: 'strengths', hardwork: 'hard work' };
  const WEAKS = [[/^(\W*)responsible for\s+/i, 'Managed '], [/^(\W*)worked on\s+/i, 'Developed '], [/^(\W*)worked in\s+/i, 'Contributed to '], [/^(\W*)duties (?:included|include)\s*:?\s*/i, 'Handled '], [/^(\W*)helped\s+/i, 'Supported '], [/^(\W*)involved in\s+/i, 'Contributed to '], [/^(\W*)participated in\s+/i, 'Contributed to '], [/^(\W*)tasked with\s+/i, 'Executed ']];
  const CLICHE = [['hard-?working', 'Show it with an achievement instead of saying it.'], ['team player', 'Give a real teamwork example with a result.'], ['good communication skills?', 'Prove it: "presented to 40+ clients", "trained 12 juniors".'], ['quick learner', 'Show a skill you learnt fast and used (course, certificate, project).'], ['self[- ]motivated', 'Replace with an initiative you took.'], ['result[- ]oriented', 'Show the result with a number.'], ['dynamic', 'Vague word – be specific.'], ['etc\\.?\\b', 'Do not use "etc." – list the actual items.'], ['various', 'Name the exact tools/tasks instead of "various".']];
  const PERSONAL = /^\s*(father'?s?\s*name|mother'?s?\s*name|religion|marital\s*status|nationality|caste|gender|sex|hobbies?)\b.*$/im;
  const BULLET = /^\s*([•●▪■◦·\-–—*]|o\s|\d+[.)])\s*/;
  const SEC = { summary: /^(professional\s+|career\s+)?(summary|profile|objective|about\s*me)/i, experience: /^(work\s+|professional\s+|relevant\s+)?(experience|employment|work\s+history|internships?)/i, education: /^(education|academic|qualifications?)/i, skills: /^(technical\s+|key\s+|core\s+)?(skills|competenc|expertise|technologies)/i, projects: /^(academic\s+|key\s+)?projects?/i, certs: /^(certifications?|courses|training|licen[cs]es?)/i, ach: /^(achievements?|awards|accomplishments)/i, lang: /^languages?/i, decl: /^declaration/i };
  const SECNAME = { summary: 'Summary', experience: 'Experience', education: 'Education', skills: 'Skills', projects: 'Projects', certs: 'Certifications', ach: 'Achievements', lang: 'Languages' };
  const startVerb = l => (l.replace(BULLET, '').trim().split(/\s+/)[0] || '').toLowerCase().replace(/[^a-z]/g, '');
  const isPast = w => /ed$/.test(w) || ['led', 'built', 'made', 'ran', 'wrote', 'won', 'drove', 'taught', 'got', 'set', 'cut', 'grew', 'began', 'held', 'sold', 'spent', 'oversaw'].includes(w);

  /* ---------- analysis ---------- */
  function analyse(text, field, lvl) {
    const t = text.replace(/\r/g, ''), low = t.toLowerCase(), lines = t.split('\n').map(x => x.trim()).filter(Boolean), words = (t.match(/\S+/g) || []).length;
    const F = D.RES[field] || D.RES_GENERIC, fresher = lvl === 'F', issues = [], cats = { Contact: [0, 15], Structure: [0, 20], 'Content strength': [0, 25], 'Keywords match': [0, 20], 'Language': [0, 10], 'Length & format': [0, 10] };
    const add = (sev, cat, title, detail, fix, ex) => issues.push({ sev, cat, title, detail, fix, ex });
    /* sections */
    const found = {}; lines.forEach(l => { const h = l.replace(BULLET, '').replace(/[:|]+$/, '').trim(); if (h.length <= 45) Object.entries(SEC).forEach(([k, r]) => { if (r.test(h)) found[k] = true; }); });
    /* bullets */
    let bl = lines.filter(l => BULLET.test(l) && l.split(/\s+/).length >= 4);
    if (bl.length < 3) bl = lines.filter(l => !BULLET.test(l) && l.split(/\s+/).length >= 7 && l.split(/\s+/).length <= 45 && /[a-z]/.test(l) && !/@/.test(l));
    /* contact */
    const email = (t.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [])[0], phone = /(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|\b\d{10}\b/.test(t), linked = /linkedin\.com|github\.com|behance\.net|portfolio|https?:\/\//i.test(t);
    let c = 0;
    if (email) { c += 5; const lp = email.split('@')[0]; if (/\d{4,}|cute|sexy|hot|king|queen|rocker|lover|baby|boy|girl|dude|cool|star/i.test(lp)) add('w', 'Contact', 'Unprofessional email address', `“${email}” may look informal to recruiters.`, 'Use firstname.lastname@gmail.com (create a new one – it takes 1 minute).', { bad: email, good: 'firstname.lastname@gmail.com' }); else c += 2; }
    else add('c', 'Contact', 'Email address missing', 'Recruiters cannot contact you and ATS marks the profile incomplete.', 'Add a professional email at the top, below your name.');
    if (phone) c += 5; else add('c', 'Contact', 'Phone number missing', 'No phone number found.', 'Add a 10-digit mobile number (with +91) in the header.');
    if (linked) c += 3; else add(/IT|Web|Data/.test(field) ? 'w' : 't', 'Contact', 'No LinkedIn / GitHub / portfolio link', 'Links let recruiters verify your work.', /IT|Web|Data/.test(field) ? 'Add GitHub and LinkedIn URLs (and live project links).' : 'Add your LinkedIn profile URL (linkedin.com/in/yourname).');
    cats.Contact[0] = Math.min(15, c);
    /* structure */
    const need = fresher ? ['summary', 'education', 'skills'] : ['summary', 'experience', 'education', 'skills']; let s = 0;
    need.forEach(k => { if (found[k]) s += 5; else add(k === 'summary' ? 'w' : 'c', 'Structure', `“${SECNAME[k]}” section missing`, `A ${SECNAME[k].toLowerCase()} section is expected by recruiters and ATS for this level.`, k === 'summary' ? 'Add a 2–3 line summary tailored to the job (see template below).' : k === 'skills' ? 'Add a Skills section with the keywords from the job description.' : `Add a clear “${SECNAME[k].toUpperCase()}” heading and list it with dates.`); });
    if (fresher) { if (found.projects || found.experience || found.certs) s += 5; else add('c', 'Structure', 'No projects / internships / training', 'Freshers are selected on projects, internships and practical work.', 'Add at least 2 projects or an internship / training with what you did and the result.'); }
    else { if (found.projects || found.certs || found.ach) s += 5; else add('t', 'Structure', 'No achievements or certifications section', 'Extra proof adds credibility.', 'Add “Certifications” or “Achievements” with 2–3 lines.'); }
    cats.Structure[0] = Math.min(20, s);
    /* content */
    const verbs = bl.filter(l => VERBS.includes(startVerb(l))).length, needV = Math.min(bl.length, fresher ? 4 : 7), nums = bl.filter(l => /\d/.test(l)).length, needN = fresher ? 2 : 5;
    let ct = 0; ct += Math.min(7, needV ? verbs / needV * 7 : 0); ct += Math.min(8, needN ? nums / needN * 8 : 0); ct += bl.length >= 3 && lines.some(l => BULLET.test(l)) ? 3 : 0;
    if (bl.length < 3) add('c', 'Content strength', 'Not enough bullet points', 'Experience / projects should be written as short bullet points.', 'Write 3–5 bullets per job/project, each starting with an action verb.');
    if (bl.length >= 3 && verbs < needV) add('w', 'Content strength', `Only ${verbs} bullets start with a strong action verb`, 'Bullets should start with verbs like Managed, Developed, Reduced, Delivered.', `Rewrite weak starts. Verbs to try: ${VERBS.slice(0, 10).join(', ')}.`, { bad: 'Was responsible for client calls', good: 'Handled 60+ client calls daily with 95% satisfaction' });
    if (bl.length >= 3 && nums < needN) add('c', 'Content strength', 'Too few measurable results', `Only ${nums} bullet(s) contain numbers. Recruiters look for impact (%, ₹, time, quantity).`, 'Add numbers: how many, how much, how fast, how often.', { bad: 'Improved sales', good: 'Increased monthly sales by 18% (₹4.2 lakh) in 6 months' });
    let weakCount = 0; bl.forEach(l => { const w = l.replace(BULLET, ''); if (WEAKS.some(x => x[0].test(w))) weakCount++; });
    if (weakCount) add('w', 'Content strength', `${weakCount} bullet(s) start with weak phrases`, '“Responsible for / Worked on / Helped” describe duties, not achievements.', 'Start with an action verb and add the result.', { bad: 'Responsible for handling customer complaints', good: 'Resolved 40+ customer complaints weekly, raising CSAT from 82% to 91%' });
    ct += Math.max(0, 4 - weakCount);
    const long = bl.filter(l => l.split(/\s+/).length > 32); if (long.length) add('w', 'Content strength', `${long.length} bullet(s) are too long`, 'Bullets longer than 2 lines are skipped by recruiters.', 'Keep each bullet to 1–2 lines (15–25 words). Split or trim it.', { bad: long[0].replace(BULLET, '').slice(0, 90) + '…', good: 'Shorter version: action + task + result.' });
    ct += Math.max(0, 3 - long.length); cats['Content strength'][0] = Math.min(25, Math.round(ct));
    CLICHE.forEach(([r, why]) => { if (new RegExp('\\b' + r, 'i').test(t)) add('t', 'Content strength', `Cliché / vague phrase: “${r.replace(/\\b|\\\.\?|\?|\\\./g, '').replace('-', ' ')}”`, why, 'Replace it with a specific, provable statement.'); });
    /* keywords */
    const kws = F.kw, hit = kws.filter(k => low.includes(k)), miss = kws.filter(k => !low.includes(k)), pct = hit.length / kws.length;
    cats['Keywords match'][0] = Math.round(Math.min(1, pct / .5) * 20);
    if (pct < .35) add('c', 'Keywords match', `Only ${hit.length} of ${kws.length} key terms for “${field || 'this field'}” found`, 'ATS ranks resumes by keyword match with the job description.', `Add the keywords you genuinely know, e.g. ${miss.slice(0, 6).join(', ')}.`);
    else if (pct < .55) add('w', 'Keywords match', 'Keyword match can be better', `Missing terms: ${miss.slice(0, 6).join(', ')}.`, 'Add the ones you really know in Skills and in your bullet points.');
    /* language */
    let lg = 10; const typos = []; Object.keys(TYPO).forEach(k => { const m = low.match(new RegExp('\\b' + k + '\\b')); if (m) typos.push(k); });
    typos.forEach(k => { lg -= 2; add('c', 'Language', `Spelling mistake: “${k}”`, 'Spelling errors are the #1 reason resumes get rejected.', `Write “${TYPO[k]}”.`, { bad: k, good: TYPO[k] }); });
    const rep = t.match(/\b(\w{2,})\s+\1\b/gi) || []; if (rep.length) { lg -= 1; add('w', 'Language', 'Repeated word(s)', `Found: ${[...new Set(rep)].slice(0, 4).map(x => '“' + x + '”').join(', ')}.`, 'Delete the duplicate word.'); }
    if (/\b(I|my|me)\b/.test(t.replace(/I\.T\b/g, '')) && bl.some(l => /\b(I|my)\b/.test(l))) { lg -= 2; add('w', 'Language', 'First-person words (“I”, “my”)', 'Resumes are written without pronouns.', 'Remove I/my and start with the verb.', { bad: 'I managed my team of 5', good: 'Managed a team of 5' }); }
    const pv = bl.map(startVerb).filter(Boolean), past = pv.filter(isPast).length, pres = pv.filter(w => VERBS.includes(w) === false && /^(manage|handle|lead|develop|design|prepare|coordinate|maintain|support|create|build|deliver|ensure|conduct|perform|monitor)$/.test(w)).length;
    if (past >= 3 && pres >= 3) { lg -= 2; add('w', 'Language', 'Mixed tenses in bullet points', 'Past roles should use past tense; only your current job may use present tense.', 'Make all old-job bullets past tense (Managed, Developed, Led).'); }
    cats.Language[0] = Math.max(0, lg);
    /* length & format */
    let lf = 0; const lo = fresher ? 150 : 250, hi = fresher ? 600 : 1000;
    if (words < lo) add('c', 'Length & format', `Resume is too short (${words} words)`, 'There is not enough detail for a recruiter to judge you.', 'Add projects, skills with levels, achievements and bullet points with results.');
    else if (words > hi) add('w', 'Length & format', `Resume is too long (${words} words)`, fresher ? 'Freshers should keep it to 1 page.' : 'Keep it to 2 pages maximum.', 'Remove old/irrelevant details; keep the most relevant 5–6 achievements.');
    else lf += 4;
    const d1 = (t.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}/gi) || []).length, d2 = (t.match(/\b\d{1,2}[\/.-]\d{4}\b/g) || []).length;
    if (d1 && d2) add('t', 'Length & format', 'Mixed date formats', 'Both “Jan 2022” and “01/2022” styles are used.', 'Use one style everywhere, e.g. “Jan 2022 – Mar 2024”.'); else lf += 2;
    if (!fresher && found.experience && (t.match(/\b(19|20)\d{2}\b/g) || []).length < 2) add('w', 'Length & format', 'Dates missing in experience', 'Recruiters need to see duration of each job.', 'Add month-year for every role: “Mar 2021 – Present”.');
    if (PERSONAL.test(t)) add('t', 'Length & format', 'Personal details not needed', 'Religion, marital status, father’s name etc. add no value and can cause bias.', 'Remove them (the auto-fix can do it). Keep only name, phone, email, city, links.'); else lf += 2;
    if (/i hereby declare|declaration/i.test(t)) add('t', 'Length & format', 'Old-style “Declaration” found', 'Modern resumes do not need “I hereby declare…”.', 'Delete it and use the space for achievements.'); else lf += 1;
    if (/(seeking a challenging|to work in a (reputed|challenging)|utilize my skills|career objective)/i.test(t)) add('w', 'Length & format', 'Generic career objective', 'Objective statements are replaced by a short professional summary.', 'Write what you offer: role + skills + one achievement.', { bad: 'To work in a challenging environment where I can utilize my skills.', good: D.RES[field] ? D.RES[field].sum[lvl === 'F' ? 'F' : 'E'].slice(0, 110) + '…' : 'Data analyst skilled in Excel & SQL; built 3 dashboards that cut reporting time 40%.' }); else lf += 1;
    cats['Length & format'][0] = Math.min(10, lf);
    const score = Math.round(Object.values(cats).reduce((a, b) => a + b[0], 0));
    issues.sort((a, b) => 'cwt'.indexOf(a.sev) - 'cwt'.indexOf(b.sev));
    return { score, cats, issues, hit, miss, found, words, bl: bl.length, verbs, nums, F };
  }

  /* ---------- auto-fix ---------- */
  function autofix(text, o) {
    const log = []; let t = text.replace(/\r/g, '');
    let n = 0; Object.keys(TYPO).forEach(k => { t = t.replace(new RegExp('\\b' + k + '\\b', 'gi'), m => { n++; const r = TYPO[k]; return m[0] === m[0].toUpperCase() && r[0] === r[0].toLowerCase() ? r[0].toUpperCase() + r.slice(1) : r; }); }); if (n) log.push(`Fixed ${n} spelling mistake(s)`);
    n = 0; t = t.replace(/\b(\w{2,})\s+\1\b/gi, (m, a) => { n++; return a; }); if (n) log.push(`Removed ${n} repeated word(s)`);
    n = 0; t = t.split('\n').map(l => { let r = l; if (BULLET.test(l) && !/^\s*•\s/.test(l)) { r = l.replace(BULLET, '• '); n++; } return r; }).join('\n'); if (n) log.push(`Standardised ${n} bullet(s) to “•”`);
    n = 0; t = t.split('\n').map(l => { const m = l.match(/^(\s*(?:•\s*)?)(.*)$/); for (const w of WEAKS) { if (w[0].test(m[2])) { n++; return m[1] + m[2].replace(w[0], (x, p) => p + w[1]); } } return l; }).join('\n'); if (n) log.push(`Replaced ${n} weak opening phrase(s) with action verbs (please check the new verb fits)`);
    if (o.personal) { n = 0; t = t.split('\n').filter(l => { if (PERSONAL.test(l) && l.trim().length < 80) { n++; return false; } return true; }).join('\n'); if (n) log.push(`Removed ${n} personal-detail line(s)`); }
    n = 0; t = t.replace(/^.*i hereby declare.*$/gim, () => { n++; return ''; }).replace(/^\s*(place|date)\s*:.*$/gim, () => ''); if (n) log.push('Removed the “Declaration” line');
    t = t.replace(/[ \t]+$/gm, '').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    if (o.sections) {
      const a = analyse(t, o.field, o.lvl), F = a.F, add = [];
      if (!a.found.summary) { t = 'PROFESSIONAL SUMMARY\n' + ((F.sum || {})[o.lvl === 'F' ? 'F' : 'E'] || 'Motivated [role] with [X] years of experience in [skills]. Delivered [achievement with number].') + '\n\n' + t; add.push('Summary'); }
      if (!a.found.skills) { t += '\n\nSKILLS\n' + F.kw.slice(0, 10).map(k => k.replace(/\b\w/g, c => c.toUpperCase())).join(' • ') + '   (keep only the ones you really know)'; add.push('Skills'); }
      if (add.length) log.push('Added missing section(s): ' + add.join(', ') + ' – replace every [bracket] with your real details');
    }
    return { text: t, log };
  }

  /* ---------- templates ---------- */
  const TPLREC = {
    'IT / Software Developer': ['Modern Header', 'Clean skills block + projects; ATS Plain if applying through portals'], 'Web Development': ['Modern Header', 'Space for portfolio links; use Left Sidebar only if you also upload a plain ATS version'],
    'Data Analyst / Excel / SQL': ['Clean Minimal', 'Numbers and tools stand out; ATS Plain for big companies'], 'Accounts / Finance': ['Corporate', 'Conservative, easy to scan'], 'Banking / Insurance': ['Executive', 'Formal look preferred by banks'],
    'Sales / Marketing / Digital Marketing': ['Modern Header', 'Show achievements first; Timeline suits growth stories'], 'BPO / Customer Support / KYC': ['ATS Plain', 'Most BPOs use ATS – simple one-column format'], 'HVAC / Mechanical': ['Classic', 'Technical skills + projects list clearly'],
    'Civil / Construction': ['Classic', 'Project list with value and role'], 'Electrical / Electronics': ['Classic', 'Technical skills and certifications on top'], 'Teaching / Education': ['Classic', 'Qualifications first (B.Ed, CTET)'],
    'Healthcare / Nursing': ['Corporate', 'Registration number and clinical postings clearly'], 'Admin / Office / MS Office': ['Clean Minimal', 'Tidy one-page format'], 'Logistics / Operations / Supply Chain': ['Corporate', 'KPIs and numbers visible']
  };
  function tplText(field, lvl) {
    const F = D.RES[field] || D.RES_GENERIC, f = lvl === 'F', top = (F.kw || []).slice(0, 10).map(k => k.replace(/\b\w/g, c => c.toUpperCase())).join(' • ');
    const sum = (F.sum || {})[f ? 'F' : 'E'] || 'Motivated professional with [skills]. Seeking [role] to deliver [value].';
    return `[YOUR FULL NAME]\n[City, State] | +91 [Phone] | [firstname.lastname@gmail.com] | linkedin.com/in/[yourname]\n\nPROFESSIONAL SUMMARY\n${sum}\n\nSKILLS\n${top}\n\n` +
      (f ? `EDUCATION\n[Degree – Branch], [College / University] – [Year]  |  CGPA / Percentage: [__]\n\nPROJECTS / INTERNSHIP\n[Project title] – [Tools used]  ([Mon YYYY – Mon YYYY])\n${(F.bul || []).map(b => '• ' + b).join('\n')}\n\nCERTIFICATIONS\n• [Course name – Platform, Year]\n` : `PROFESSIONAL EXPERIENCE\n[Job Title] – [Company], [City]   [Mon YYYY – Present]\n${(F.bul || []).map(b => '• ' + b).join('\n')}\n\n[Previous Job Title] – [Company], [City]   [Mon YYYY – Mon YYYY]\n• [Action verb + task + result with number]\n• [Action verb + task + result with number]\n\nEDUCATION\n[Degree – Branch], [College / University] – [Year]\n\nCERTIFICATIONS\n• [Course name – Platform, Year]\n`);
  }
  const dlDoc = (text, name) => { const html = '<html><head><meta charset="utf-8"></head><body style="font-family:Calibri,Arial;font-size:11pt">' + text.split('\n').map(l => /^[A-Z][A-Z &/]{3,}$/.test(l.trim()) ? `<p><b style="font-size:12pt;border-bottom:1px solid #444">${esc(l)}</b></p>` : `<p style="margin:2px 0">${esc(l) || '&nbsp;'}</p>`).join('') + '</body></html>'; download(new Blob(['\ufeff', html], { type: 'application/msword' }), name); };

  /* ---------- UI ---------- */
  T.render = el => {
    el.innerHTML = `<div class="card"><h3 style="margin-top:0">1️⃣ Your target</h3><div class="pp-sel"><label>Which field do you want a job in?<select id="rf">${FIELDS.map(f => `<option>${esc(f)}</option>`).join('')}<option value="">Other / General</option></select></label><label>Your level<select id="rl"><option value="F">🎓 Fresher</option><option value="E">💼 Experienced</option></select></label></div></div>
      <div class="card"><h3 style="margin-top:0">2️⃣ Upload or paste your resume</h3><div class="pp-drop" id="dz"><b>📄 Click to upload</b> or drop your resume here<br><small class="note">PDF · DOCX · TXT — processed on your device, never uploaded</small><input id="fi" type="file" accept=".pdf,.docx,.txt" hidden></div><div id="fs" class="note"></div>
      <label class="fld" style="margin-top:12px"><span>…or paste the full text here</span><textarea id="rt" rows="10" placeholder="Paste your resume text here (name, contact, summary, skills, experience, education…)"></textarea></label>
      <div class="row"><button class="btn" id="an">🔍 Check my resume</button></div></div><div id="ro"></div>`;
    const dz = $('#dz', el), fi = $('#fi', el), rt = $('#rt', el), fs = $('#fs', el);
    const take = async f => { if (!f) return; fs.textContent = '⏳ Reading ' + f.name + '…'; try { const x = (await fileText(f)).trim(); if (x.length < 40) throw new Error('No readable text found. If this is a scanned/photo PDF, paste the text or upload a text-based PDF/DOCX.'); rt.value = x; fs.innerHTML = `✅ Read <b>${esc(f.name)}</b> – ${(x.match(/\S+/g) || []).length} words extracted. Check the text below, then press “Check my resume”.`; } catch (e) { fs.innerHTML = `<span class="err">${esc(e.message || 'Could not read the file')}</span>`; } };
    dz.onclick = () => fi.click(); fi.onchange = () => take(fi.files[0]);
    dz.ondragover = e => { e.preventDefault(); dz.classList.add('on'); }; dz.ondragleave = () => dz.classList.remove('on'); dz.ondrop = e => { e.preventDefault(); dz.classList.remove('on'); take(e.dataTransfer.files[0]); };
    $('#an', el).onclick = () => {
      const text = rt.value.trim(), field = $('#rf', el).value, lvl = $('#rl', el).value; if (text.length < 80) return $('#ro', el).innerHTML = `<div class="card">${bad('Please upload or paste your resume first (at least a few lines).')}</div>`;
      const a = analyse(text, field, lvl), col = a.score >= 80 ? '#059669' : a.score >= 60 ? '#d97706' : '#dc2626', verdict = a.score >= 80 ? 'Strong resume – polish the small points' : a.score >= 60 ? 'Decent – fix the highlighted issues' : 'Needs work – fix the red items first';
      const rec = TPLREC[field] || ['Clean Minimal', 'Simple one-column layouts work for every field'];
      $('#ro', el).innerHTML = `<div class="card"><div class="pp-head"><div><div class="pp-score" style="color:${col}">${a.score}<small style="font-size:1rem;color:var(--mut)"> / 100</small></div><div>${verdict}</div></div><div class="note">${a.words} words · ${a.bl} bullets · ${a.verbs} action-verb starts · ${a.nums} with numbers</div></div>
        <div style="margin-top:12px">${Object.entries(a.cats).map(([k, v]) => `<div class="bar" style="grid-template-columns:140px 1fr 56px"><span>${k}</span><div class="pp-bar" style="margin:0"><i style="width:${Math.round(v[0] / v[1] * 100)}%"></i></div><b>${v[0]}/${v[1]}</b></div>`).join('')}</div></div>
        <div class="card"><h3 style="margin-top:0">❗ Errors &amp; how to fix them (${a.issues.length})</h3>${a.issues.length ? a.issues.map(i => `<div class="pp-issue ${i.sev}"><span class="pp-sev ${i.sev}">${{ c: 'CRITICAL', w: 'IMPROVE', t: 'TIP' }[i.sev]}</span><b>${esc(i.title)}</b><small>${esc(i.detail)}</small><small>✅ <b>Fix:</b> ${esc(i.fix)}</small>${i.ex ? `<small><span class="pp-bad">${esc(i.ex.bad)}</span> → <span class="pp-fix">${esc(i.ex.good)}</span></small>` : ''}</div>`).join('') : '<p>🎉 No major problems found.</p>'}</div>
        <div class="card"><h3 style="margin-top:0">🔑 Keywords for ${esc(field || 'your field')}</h3><div class="pp-kw">${a.hit.map(k => `<span class="y">✓ ${esc(k)}</span>`).join('')}${a.miss.map(k => `<span class="n">✗ ${esc(k)}</span>`).join('')}</div><p class="note">Add the red keywords only if you genuinely have that skill – and copy exact words from the job description.</p></div>
        <div class="card"><h3 style="margin-top:0">🧩 Sections check</h3>${Object.entries(SECNAME).map(([k, v]) => `<span class="chip" style="${a.found[k] ? '' : 'background:#fee2e2;color:#991b1b'}">${a.found[k] ? '✓' : '✗'} ${v}</span>`).join('')}<p class="note">Recommended order: ${esc((a.F.sec || []).join(' → '))}.</p></div>
        <div class="card"><h3 style="margin-top:0">🛠️ Fix it automatically</h3><p class="note" style="margin-top:0">Fixes spelling, repeated words, bullets, weak opening phrases and old-style lines. You can edit the result before copying.</p>
          <div class="row" style="margin-top:6px"><label class="pp-opt"><input type="checkbox" id="x1" checked><span>Remove personal details (religion, marital status…)</span></label><label class="pp-opt"><input type="checkbox" id="x2" checked><span>Add missing Summary / Skills sections</span></label></div>
          <div class="row"><button class="btn" id="fx">✨ Auto-fix my resume</button></div><div id="fo"></div></div>
        <div class="card"><h3 style="margin-top:0">🎨 Which template should I use?</h3><p><b>Recommended in Resume Maker: ${esc(rec[0])}</b> – ${esc(rec[1])}.</p>${ul(['<b>ATS Plain / Classic</b> – safest for online portals and BPO/IT hiring.', '<b>Corporate / Executive</b> – banking, accounts, management, healthcare.', '<b>Modern Header / Clean Minimal</b> – IT, data, marketing, startups.', '<b>Sidebar / Timeline</b> – creative roles; also keep a plain ATS copy.', 'Use one font, 10–12 pt, one column, standard headings, 1 page for freshers, 2 pages max for experienced, PDF or DOCX (not image).'])}<div class="row"><a class="btn sm" href="#/resume-maker">Open Resume Maker →</a></div></div>
        <div class="card"><h3 style="margin-top:0">📄 Ready template for ${esc(field || 'general')} (${lvl === 'F' ? 'Fresher' : 'Experienced'})</h3><div class="pp-tpl"><pre id="tp">${esc(tplText(field, lvl))}</pre><div class="row"><button class="btn sm" id="tc">Copy template</button><button class="btn ghost sm" id="td">⬇ Download as Word</button></div></div></div>
        <div class="card"><h3 style="margin-top:0">💪 Bullet improver</h3><label class="fld"><span>Paste one weak bullet point</span><textarea id="bt" rows="2" placeholder="e.g. Responsible for handling customer complaints"></textarea></label><div class="row"><button class="btn sm" id="bi">Improve</button></div><div id="bo"></div></div>`;
      $('#fx', el).onclick = () => {
        const r = autofix(text, { field, lvl, personal: $('#x1', el).checked, sections: $('#x2', el).checked }), re = analyse(r.text, field, lvl);
        $('#fo', el).innerHTML = `<p style="margin-top:12px"><b>New score: ${re.score}/100</b> (was ${a.score}) ${r.log.length ? ul(r.log) : '<br>No automatic changes were needed – fix the red items manually.'}</p><textarea id="ft" class="pp-textbox">${esc(r.text)}</textarea><div class="row"><button class="btn sm" id="fc">Copy</button><button class="btn ghost sm" id="ft1">⬇ .txt</button><button class="btn ghost sm" id="ft2">⬇ Word (.doc)</button><button class="btn ghost sm" id="fr">↻ Re-check this text</button></div><p class="note">Auto-fix cannot invent your achievements. Replace every [bracket] and add numbers to your bullets, then use Resume Maker to make a final PDF.</p>`;
        $('#fc', el).onclick = () => copy($('#ft', el).value); $('#ft1', el).onclick = () => download(new Blob([$('#ft', el).value], { type: 'text/plain' }), 'improved-resume.txt'); $('#ft2', el).onclick = () => dlDoc($('#ft', el).value, 'improved-resume.doc');
        $('#fr', el).onclick = () => { rt.value = $('#ft', el).value; $('#an', el).click(); window.scrollTo({ top: el.offsetTop, behavior: 'smooth' }); };
      };
      $('#tc', el).onclick = () => copy($('#tp', el).textContent); $('#td', el).onclick = () => dlDoc($('#tp', el).textContent, 'resume-template.doc');
      $('#bi', el).onclick = () => {
        let b = $('#bt', el).value.trim().replace(BULLET, ''); if (!b) return toast('Type a bullet first'); let imp = b;
        for (const w of WEAKS) if (w[0].test(b)) { imp = b.replace(w[0], (x, p) => p + w[1]); break; }
        imp = imp.charAt(0).toUpperCase() + imp.slice(1).replace(/\.$/, ''); if (!/\d/.test(imp)) imp += ', achieving [X]% improvement / saving ₹[X] / serving [N] customers';
        const ex = (a.F.bul || []).slice(0, 3);
        $('#bo', el).innerHTML = `<div class="pp-issue t" style="margin-top:12px"><span class="pp-bad">${esc(b)}</span><br>→ <span class="pp-fix">${esc(imp)}</span><small>Formula: <b>Action verb + what you did + tool/skill + result with a number</b>. Replace the [brackets] with real facts.</small></div><p class="note"><b>Examples for ${esc(field || 'your field')}:</b></p>${ul(ex.map(esc))}`;
      };
    };
  };
})();
