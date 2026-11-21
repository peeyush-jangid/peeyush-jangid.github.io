/* ===== Resume Checker & Improver (Pro) =====
   Upload PDF / DOCX / TXT (or paste) → choose target field + level → get errors, score, one-click fixes,
   field keywords, a sample summary and 6 downloadable templates. 100 % in the browser – nothing is uploaded. */
(function () {
  if (!window.PJ) return;
  const T = TOOLS.find(t => t.id === 'resume-improvement'); if (!T) return;

  /* ---------- fields ---------- */
  const FIELDS = {
    'Software / IT': { role: 'Software Developer', kw: ['javascript', 'python', 'java', 'sql', 'git', 'api', 'html', 'css', 'react', 'node', 'database', 'testing', 'debugging', 'agile', 'linux', 'cloud'], tip: 'Add GitHub / portfolio link, list tech stack per project and mention users, performance or time saved.' },
    'Data / Analytics': { role: 'Data Analyst', kw: ['excel', 'sql', 'python', 'power bi', 'tableau', 'dashboard', 'pivot', 'statistics', 'data cleaning', 'visualization', 'reporting', 'kpi', 'analysis', 'etl'], tip: 'Show the business impact of each analysis (cost saved, revenue, accuracy) and list tools clearly.' },
    'HVAC / Mechanical': { role: 'HVAC Engineer', kw: ['hvac', 'autocad', 'vrf', 'vrv', 'chiller', 'ahu', 'fcu', 'duct', 'cfm', 'tr', 'pre-commissioning', 'site supervision', 'boq', 'psychrometric', 'installation', 'drawing', 'piping', 'testing'], tip: 'Mention project names, capacity (TR / CFM), value and team size you supervised.' },
    'Civil / Construction': { role: 'Civil Engineer', kw: ['autocad', 'site supervision', 'quantity', 'estimation', 'boq', 'rcc', 'concrete', 'survey', 'billing', 'quality', 'safety', 'drawing', 'staad', 'project planning', 'ms project'], tip: 'Give project size (sq ft, value in crore), quantities handled and safety / quality record.' },
    'Electrical / Electronics': { role: 'Electrical Engineer', kw: ['plc', 'scada', 'autocad', 'wiring', 'panel', 'motor', 'transformer', 'testing', 'maintenance', 'power factor', 'circuit', 'safety', 'inspection', 'commissioning'], tip: 'List voltage levels, panels / machines handled and downtime reduced.' },
    'Banking / Finance': { role: 'Banking Professional', kw: ['kyc', 'loan', 'credit', 'customer service', 'sales', 'target', 'compliance', 'aml', 'accounts', 'cross-selling', 'portfolio', 'risk', 'reconciliation', 'banking'], tip: 'Show targets vs achievement (%), portfolio size and customer count.' },
    'Accounts / Tally / GST': { role: 'Accounts Executive', kw: ['tally', 'gst', 'tds', 'invoice', 'bank reconciliation', 'ledger', 'balance sheet', 'payroll', 'accounts payable', 'accounts receivable', 'excel', 'audit', 'billing', 'return filing'], tip: 'Mention software (Tally Prime / Busy), volume of vouchers and returns filed on time.' },
    'Sales / Business Development': { role: 'Sales Executive', kw: ['sales', 'lead generation', 'client', 'target', 'negotiation', 'crm', 'b2b', 'revenue', 'pipeline', 'cold calling', 'closing', 'territory', 'presentation'], tip: 'Use numbers: revenue generated, % target achieved, number of clients acquired.' },
    'Digital Marketing': { role: 'Digital Marketing Executive', kw: ['seo', 'sem', 'google ads', 'social media', 'content', 'analytics', 'email marketing', 'facebook ads', 'campaign', 'ctr', 'roas', 'keyword', 'canva', 'wordpress'], tip: 'Add campaign results – traffic growth %, leads, CPC, ROAS.' },
    'HR / Admin': { role: 'HR Executive', kw: ['recruitment', 'onboarding', 'payroll', 'attendance', 'employee engagement', 'ms excel', 'hrms', 'screening', 'interview', 'compliance', 'pf', 'esi', 'documentation', 'vendor'], tip: 'State number of hires, time-to-hire and employees handled.' },
    'BPO / Customer Support': { role: 'Customer Support Executive', kw: ['customer service', 'communication', 'crm', 'chat support', 'voice process', 'complaint', 'csat', 'aht', 'typing', 'english', 'escalation', 'kyc', 'ticket'], tip: 'Mention typing speed, CSAT / quality score, calls or chats handled per day.' },
    'Teaching / Education': { role: 'Teacher', kw: ['lesson plan', 'classroom management', 'curriculum', 'assessment', 'ms powerpoint', 'student', 'mentoring', 'b.ed', 'ctet', 'smart class', 'parent', 'evaluation', 'subject'], tip: 'Add subjects, classes taught, result improvement % and teaching certifications (B.Ed, CTET).' },
    'Healthcare / Nursing': { role: 'Nurse', kw: ['patient care', 'vital signs', 'iv', 'medication', 'icu', 'infection control', 'documentation', 'emergency', 'bls', 'ward', 'registered nurse', 'ot', 'first aid'], tip: 'List registration number, department, bed strength and certifications (BLS / ACLS).' },
    'Operations / Logistics': { role: 'Operations Executive', kw: ['inventory', 'warehouse', 'supply chain', 'dispatch', 'grn', 'erp', 'sap', 'e-way bill', 'vendor', 'logistics', 'fifo', 'stock', 'procurement', 'coordination'], tip: 'Show volumes handled, accuracy %, cost saved and delivery timelines met.' },
    'Office / Data Entry': { role: 'Office Executive', kw: ['ms word', 'ms excel', 'powerpoint', 'typing', 'data entry', 'email', 'filing', 'documentation', 'reporting', 'vlookup', 'pivot', 'coordination', 'record keeping'], tip: 'State typing speed (WPM), accuracy % and Excel functions you use.' },
    'Design (Graphic / UI)': { role: 'Graphic Designer', kw: ['photoshop', 'illustrator', 'figma', 'canva', 'coreldraw', 'branding', 'logo', 'layout', 'typography', 'ui', 'ux', 'wireframe', 'portfolio', 'adobe'], tip: 'Add a portfolio link (Behance / Drive) and name brands or projects.' },
    'General / Other': { role: 'Professional', kw: [], tip: 'Tailor the summary and skills to the exact job description you are applying for.' }
  };

  const MISSPELL = { experiance: 'experience', experince: 'experience', exprience: 'experience', managment: 'management', mangement: 'management', recieve: 'receive', responsibilty: 'responsibility', responsibilites: 'responsibilities', reponsible: 'responsible', resposibility: 'responsibility', excellant: 'excellent', knowlege: 'knowledge', comunication: 'communication', communiction: 'communication', enviroment: 'environment', enviornment: 'environment', sucessful: 'successful', succesful: 'successful', profesional: 'professional', proffesional: 'professional', adress: 'address', seperate: 'separate', definately: 'definitely', occured: 'occurred', acheive: 'achieve', achivement: 'achievement', acheivements: 'achievements', lenght: 'length', langauge: 'language', refered: 'referred', guidlines: 'guidelines', wich: 'which', teh: 'the', becuase: 'because', attendence: 'attendance', sincerly: 'sincerely', accomodate: 'accommodate', carrer: 'career', quallification: 'qualification', qualfication: 'qualification', hobbis: 'hobbies', developement: 'development', enginner: 'engineer', enginering: 'engineering', supervisior: 'supervisor', cordination: 'coordination', projet: 'project', computor: 'computer', maintainance: 'maintenance', maintenence: 'maintenance', mainatain: 'maintain', installtion: 'installation', schedual: 'schedule', recomend: 'recommend', beleive: 'believe', buisness: 'business', bussiness: 'business', commited: 'committed', comitted: 'committed', effecient: 'efficient', efficent: 'efficient', familar: 'familiar', grammer: 'grammar', independant: 'independent', intrested: 'interested', liason: 'liaison', orgnization: 'organization', proficeint: 'proficient', profficient: 'proficient', sallary: 'salary', strenght: 'strength', strenghts: 'strengths', tecnical: 'technical', technicial: 'technical', writting: 'writing', yeras: 'years', sucess: 'success', managament: 'management', objecive: 'objective', summery: 'summary', declration: 'declaration', certficate: 'certificate', certifcate: 'certificate', awsome: 'awesome', thier: 'their', alot: 'a lot' };
  const WEAK = [[/^(responsible for)\s+/i, 'Managed '], [/^(duties (?:included|include)|duty was)\s*:?\s*/i, ''], [/^(worked on)\s+/i, 'Contributed to '], [/^(helped (?:in|with|to)|helping)\s+/i, 'Supported '], [/^(involved in)\s+/i, 'Participated in '], [/^(tasked with|in charge of|looking after)\s+/i, 'Managed ']];
  const ING = { managing: 'managed', handling: 'handled', preparing: 'prepared', coordinating: 'coordinated', supervising: 'supervised', maintaining: 'maintained', developing: 'developed', designing: 'designed', ensuring: 'ensured', monitoring: 'monitored', conducting: 'conducted', executing: 'executed', reviewing: 'reviewed', creating: 'created', implementing: 'implemented', installing: 'installed', testing: 'tested', training: 'trained', planning: 'planned', organizing: 'organized', organising: 'organised', performing: 'performed', providing: 'provided', generating: 'generated', processing: 'processed', resolving: 'resolved', supporting: 'supported', assisting: 'assisted', checking: 'checked', verifying: 'verified', updating: 'updated', drafting: 'drafted', leading: 'led', running: 'ran', making: 'made', building: 'built', writing: 'wrote', selling: 'sold', preparing_: 'prepared', analysing: 'analysed', analyzing: 'analyzed', negotiating: 'negotiated', maintaining_: 'maintained', calculating: 'calculated', inspecting: 'inspected', overseeing: 'oversaw', handling_: 'handled', completing: 'completed', delivering: 'delivered', following: 'followed', attending: 'attended', answering: 'answered', receiving: 'received', recording: 'recorded', reporting: 'reported', billing: 'billed' };
  const CLICHE = ['hard working', 'hardworking', 'team player', 'go-getter', 'result oriented', 'result-oriented', 'self motivated', 'self-motivated', 'dynamic personality', 'synergy', 'think out of the box', 'detail oriented', 'detail-oriented', 'quick learner', 'passionate', 'challenging environment', 'best of my knowledge'];
  const STRONG = new Set('led managed built ran drove wrote won saved cut grew improved increased reduced developed designed implemented delivered created executed optimized optimised coordinated launched analyzed analysed negotiated trained streamlined supervised installed commissioned maintained prepared handled achieved generated resolved organized organised planned tested monitored conducted reviewed audited processed verified supported initiated established automated mentored presented secured exceeded earned completed inspected calculated drafted updated'.split(' '));
  const HEAD = /^(professional |career |work |technical |key |core )?(summary|profile|objective|about me|experience|employment|work history|education|academics?( qualifications?)?|qualifications?|skills?|competencies|projects?|academic projects?|internships?|training|certifications?|courses|achievements?|awards?|accomplishments?|languages?|languages known|hobbies|interests|personal (details|information|profile)|declaration|references?|contact|strengths|responsibilities)\s*:?$/i;
  const BUL = /^\s*(?:[•●▪■◦➢►✓✔▶·]\s*|[-*–—]\s+)/;
  const SAMPLE = `RAHUL SHARMA\nrahul_cool_boy99@gmail.com | 9876543210 | Jaipur\n\nCareer Objective\nTo work in a challenging environment where i can use my skills and grow with the organisation.\n\nExperiance\nSite Engineer, ABC Aircon Pvt Ltd (Jan 2023 - Present)\n- Responsible for managing HVAC installation at site\n- worked on VRF drawings and coordination with client\n* Helped in preparing billing and reports\n• Handled team of workers  and  daily  site  reports\n\nEducation\nB.Tech Mechanical, Rajasthan Technical University, 2022\n\nSkills\nAutoCAD, MS Office, Communication,  Team player, hard working\n\nPersonal Details\nDate of Birth: 12 March 1999\nMarital Status: Single\n\nDeclaration\nI hereby declare that the above information is true.`;

  /* ---------- file reading ---------- */
  const loadScript = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('Could not load PDF reader – check internet or paste the text.')); document.head.appendChild(s); });
  async function pdfText(file) {
    if (!window.pdfjsLib) { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'); pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }
    const doc = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise; let out = '';
    for (let p = 1; p <= doc.numPages; p++) { const c = await (await doc.getPage(p)).getTextContent(); let line = '', y = null; c.items.forEach(it => { const ny = it.transform[5]; if (y !== null && Math.abs(ny - y) > 3) { out += line.trimEnd() + '\n'; line = ''; } line += it.str; y = ny; }); out += line.trimEnd() + '\n\n'; }
    return out.trim();
  }
  async function docxText(file) {
    const buf = await file.arrayBuffer(), u8 = new Uint8Array(buf), dv = new DataView(buf), dec = new TextDecoder();
    let e = u8.length - 22; while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--; if (e < 0) throw new Error('Not a valid .docx file');
    const cnt = dv.getUint16(e + 10, true); let p = dv.getUint32(e + 16, true), xml = '';
    for (let i = 0; i < cnt; i++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break;
      const method = dv.getUint16(p + 10, true), cs = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lho = dv.getUint32(p + 42, true), name = dec.decode(u8.slice(p + 46, p + 46 + nl));
      if (name === 'word/document.xml') { const st = lho + 30 + dv.getUint16(lho + 26, true) + dv.getUint16(lho + 28, true), data = u8.slice(st, st + cs); xml = method === 0 ? dec.decode(data) : await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text(); break; }
      p += 46 + nl + xl + cl;
    }
    if (!xml) throw new Error('Could not read text inside the .docx');
    return xml.replace(/<w:tab\/>/g, '\t').replace(/<w:br\/>/g, '\n').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/\n{3,}/g, '\n\n').trim();
  }

  /* ---------- parsing & analysis ---------- */
  const isHead = l => { const t = l.trim(); if (!t || t.length > 40) return false; if (HEAD.test(t)) return true; return /^[A-Z][A-Z &/]{3,28}:?$/.test(t) && !/\d/.test(t) && t.split(' ').length <= 4; };
  const secName = h => { const t = h.toLowerCase(); if (/summary|profile|objective|about/.test(t)) return 'summary'; if (/experience|employment|work history/.test(t)) return 'experience'; if (/education|academic|qualification/.test(t)) return 'education'; if (/skill|competenc|strength/.test(t)) return 'skills'; if (/project/.test(t)) return 'projects'; if (/intern|training/.test(t)) return 'internship'; if (/certif|course/.test(t)) return 'certs'; if (/achiev|award|accomplish/.test(t)) return 'achievements'; return 'other'; };
  function parse(text) {
    const lines = text.split('\n'), secs = [], head = []; let cur = null;
    lines.forEach((raw, i) => { const t = raw.trim(); if (!t) { if (cur) cur.lines.push({ t: '', i }); return; } if (isHead(t)) { cur = { title: t.replace(/:$/, ''), key: secName(t), lines: [], i }; secs.push(cur); } else if (cur) cur.lines.push({ t, i }); else head.push({ t, i }); });
    return { lines, head, secs };
  }
  const exLine = (n, t) => `L${n + 1}: ${t.trim().slice(0, 90)}`;
  function analyze(text, field, level) {
    const F = FIELDS[field] || FIELDS['General / Other'], P = parse(text), low = text.toLowerCase(), words = (text.match(/\S+/g) || []).length, fresher = level === 'F';
    const issues = [], good = [];
    const add = (g, sev, id, title, detail, ex, fix) => issues.push({ g, sev, id, title, detail, ex: ex || [], fix });
    const ok = s => good.push(s);
    const sec = k => P.secs.filter(s => s.key === k);
    const body = k => sec(k).flatMap(s => s.lines.filter(l => l.t));
    // contact
    const em = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    if (!em) add('format', 'high', 'email', 'No email address found', 'Recruiters must be able to contact you. Add a professional email at the top, e.g. firstname.lastname@gmail.com.'); else if (/(cool|boy|girl|king|queen|rockstar|lover|sweet|hot|baby|dude|angel|sexy|handsome|\d{4,})/i.test(em[0].split('@')[0])) add('format', 'med', 'email2', 'Email address looks unprofessional', `"${em[0]}" – use a simple name-based address such as firstname.lastname@gmail.com.`); else ok('Professional email found');
    if (!/(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|\b\d{3}[\s-]\d{3}[\s-]\d{4}\b/.test(text)) add('format', 'high', 'phone', 'No phone number found', 'Add a 10-digit mobile number (with +91) near your name.'); else ok('Phone number found');
    const f1 = (P.head[0] || P.secs[0] && { t: '' } || { t: '' }).t || '';
    if (!P.head.length || /^(resume|curriculum vitae|cv|biodata|bio-data)$/i.test(f1) || f1.split(/\s+/).length > 5 || /\d/.test(f1)) add('format', 'med', 'name', 'Your name is not clear at the top', 'The first line should be only your full name (not "Resume" / "Curriculum Vitae"). Put it in a larger font.'); else ok('Name at the top');
    if (field === 'Software / IT' || field === 'Design (Graphic / UI)' || field === 'Data / Analytics') { if (!/github\.com|behance|portfolio|gitlab|kaggle/.test(low)) add('content', 'med', 'portfolio', 'No GitHub / portfolio link', 'For this field add a GitHub, Kaggle or Behance link – it is the first thing many recruiters open.'); else ok('Portfolio / GitHub link present'); }
    else if (!fresher && !/linkedin\.com/.test(low)) add('format', 'low', 'linkedin', 'No LinkedIn profile link', 'Experienced candidates should add a LinkedIn URL.'); else if (/linkedin\.com/.test(low)) ok('LinkedIn link present');
    // sections
    const sm = sec('summary');
    if (!sm.length) add('format', 'med', 'summary', fresher ? 'Add a Career Objective / Summary' : 'Add a Professional Summary', fresher ? '2–3 lines: your degree, skills and the role you want. See the sample below.' : '3–4 lines: years of experience, key skills, biggest achievement. See the sample below.'); else { ok('Summary section present'); const sw = body('summary').map(l => l.t).join(' ').split(/\s+/).length; if (sw > 70) add('content', 'med', 'sumlong', 'Summary is too long (' + sw + ' words)', 'Keep it to 40–60 words – 3 or 4 short lines.'); if (sw < 15) add('content', 'low', 'sumshort', 'Summary is very short', 'Add your skills and target role in 2–3 lines.'); }
    if (!sec('education').length) add('format', 'high', 'edu', 'No Education section', 'Add degree, college/university, year of passing and percentage/CGPA.'); else ok('Education section present');
    if (!sec('skills').length) add('format', 'high', 'skills', 'No Skills section', 'Add a Skills section with the tools and technologies of your field (see keywords below).'); else ok('Skills section present');
    const hasExp = sec('experience').length, hasAlt = sec('projects').length || sec('internship').length;
    if (!fresher && !hasExp) add('format', 'high', 'exp', 'No Work Experience section', 'Add Work Experience with company, role, dates and 3–5 bullet points each.');
    else if (fresher && !hasExp && !hasAlt) add('format', 'high', 'proj', 'Add Projects / Internship / Training', 'Freshers should show practical work – college projects, internship, training or live site visits.');
    else ok(hasExp ? 'Experience section present' : 'Projects / internship section present');
    if (fresher && !sec('projects').length && !sec('internship').length && hasExp) add('content', 'low', 'proj2', 'Add academic projects', 'Projects show practical skills even if you have little experience.');
    if (!sec('certs').length) add('content', 'low', 'cert', 'No Certifications / Courses', 'Add relevant courses or certificates (even online ones) to strengthen your profile.');
    // length
    const lim = fresher ? [150, 600] : [250, 950];
    if (words < lim[0]) add('format', 'high', 'short', `Resume is too short (${words} words)`, 'Add more detail: skills, projects/experience bullets and achievements.'); else if (words > lim[1]) add('format', 'med', 'long', `Resume is too long (${words} words)`, fresher ? 'Freshers should fit on one page (about 350–550 words).' : 'Keep to 2 pages maximum. Remove old or irrelevant points.'); else ok(`Good length (${words} words)`);
    // bullets
    let cl = [...body('experience'), ...body('projects'), ...body('internship')].filter(l => BUL.test(l.t) || l.t.split(/\s+/).length >= 6);
    const bl = P.lines.map((t, i) => ({ t, i })).filter(l => BUL.test(l.t));
    if (bl.length < 4) add('format', 'med', 'nobul', 'Use bullet points', 'Write responsibilities and achievements as short bullet points (each starts with an action verb).'); else ok(`Uses bullet points (${bl.length})`);
    const bs = [...new Set(P.lines.filter(l => BUL.test(l)).map(l => l.trim().match(BUL)[0].trim()))];
    if (bs.length > 1) add('language', 'low', 'bulmix', 'Mixed bullet styles (' + bs.join(' ') + ')', 'Use one bullet style across the whole resume.', P.lines.map((t, i) => [t, i]).filter(x => BUL.test(x[0])).slice(0, 3).map(x => exLine(x[1], x[0])), 'bullets');
    const cleanB = t => t.replace(BUL, '').trim();
    const long = cl.filter(l => cleanB(l.t).split(/\s+/).length > 30); if (long.length) add('content', 'low', 'longb', `${long.length} point(s) are too long`, 'Keep each bullet to one or two lines (under 25 words).', long.slice(0, 3).map(l => exLine(l.i, l.t)));
    const weak = cl.filter(l => WEAK.some(w => w[0].test(cleanB(l.t))));
    if (weak.length) add('content', 'med', 'weak', `${weak.length} weak phrase(s) like "Responsible for / Worked on"`, 'Start with a strong action verb: Managed, Led, Designed, Installed, Reduced…', weak.slice(0, 3).map(l => exLine(l.i, l.t)), 'weak'); else if (cl.length) ok('No weak opening phrases');
    const fp = cl.filter(l => /\b(I|my|me)\b/.test(cleanB(l.t))); if (fp.length) add('content', 'low', 'first', 'First-person words (I / my / me)', 'Write in implied first person: "Managed a team of 10" instead of "I managed my team".', fp.slice(0, 3).map(l => exLine(l.i, l.t)));
    const act = cl.filter(l => { const w = cleanB(l.t).split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, ''); return STRONG.has(w) || /ed$/.test(w); });
    if (cl.length >= 3) { if (act.length / cl.length < .5) add('content', 'med', 'verbs', 'Few bullets start with action verbs (' + act.length + ' of ' + cl.length + ')', 'Begin each point with a past-tense verb such as Managed, Installed, Coordinated, Prepared, Reduced.'); else ok('Strong action verbs used'); }
    const num = cl.filter(l => /\d/.test(l.t)); if (cl.length >= 3) { if (num.length / cl.length < .25) add('content', fresher ? 'med' : 'high', 'nums', 'Add measurable results (numbers)', 'Add numbers – %, ₹ amount, TR / CFM, number of people, days saved. Example: "Reduced site delay by 15%".'); else ok('Includes measurable results'); }
    if (!fresher && sm.length && !/\d+\+?\s*(years?|yrs?)/i.test(body('summary').map(l => l.t).join(' '))) add('content', 'low', 'yrs', 'Mention total years of experience in the summary', 'Example: "HVAC Engineer with 3+ years of experience in VRF and chiller projects".');
    if (fresher && sec('education').length && !/(\d{2}(\.\d+)?\s*%|cgpa|gpa|percentage|\d\.\d{1,2}\s*\/\s*10)/i.test(body('education').map(l => l.t).join(' '))) add('content', 'low', 'cgpa', 'Add marks / CGPA in Education', 'Freshers should show percentage or CGPA for each qualification.');
    // dates
    if (hasExp) { const ed = body('experience').map(l => l.t).join(' '); const styles = new Set(); if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*,?\s*\d{4}/i.test(ed)) styles.add('Mon YYYY'); if (/\b\d{1,2}[\/-]\d{4}\b/.test(ed)) styles.add('MM/YYYY'); if (/\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/.test(ed)) styles.add('DD/MM/YYYY'); if (!/(19|20)\d{2}|present|current/i.test(ed)) add('format', 'med', 'dates', 'Experience has no dates', 'Add start and end dates (Jan 2023 – Present) for every job.'); else if (styles.size > 1) add('format', 'low', 'datefmt', 'Mixed date formats', 'Use one format everywhere, e.g. "Jan 2023 – Dec 2024".'); }
    // clichés, personal info, references
    const cc = CLICHE.filter(c => low.includes(c)); if (cc.length) add('content', 'low', 'cliche', 'Overused buzzwords: ' + cc.slice(0, 4).join(', '), 'Replace with proof – an achievement or example – instead of adjectives.', P.lines.map((t, i) => [t, i]).filter(x => cc.some(c => x[0].toLowerCase().includes(c))).slice(0, 3).map(x => exLine(x[1], x[0])));
    const pers = P.lines.map((t, i) => [t, i]).filter(x => /^\s*(date of birth|dob|d\.o\.b|marital status|father'?s? name|mother'?s? name|religion|nationality|gender|sex|passport\s*(no|number)?)\s*[:\-–]/i.test(x[0]));
    if (pers.length) add('format', 'low', 'personal', `${pers.length} personal detail line(s) can be removed`, 'Date of birth, marital status, religion and father\'s name are not needed and can cause bias or ATS problems.', pers.slice(0, 3).map(x => exLine(x[1], x[0])), 'personal');
    const decl = P.lines.map((t, i) => [t, i]).filter(x => /^\s*(declaration\s*:?|i hereby declare.*|references?\s*(are\s*)?(available|on request).*)$/i.test(x[0]));
    if (decl.length) add('format', 'low', 'decl', 'Declaration / "References available" is outdated', 'These lines waste space. Remove them.', decl.slice(0, 3).map(x => exLine(x[1], x[0])), 'decl');
    // language
    const ms = []; P.lines.forEach((l, i) => { (l.match(/[A-Za-z]+/g) || []).forEach(w => { if (MISSPELL[w.toLowerCase()]) ms.push([w, i, l]); }); });
    if (ms.length) add('language', 'high', 'spell', `${new Set(ms.map(m => m[0].toLowerCase())).size} spelling mistake(s)`, 'Spelling errors are the top reason for rejection. Fix: ' + [...new Set(ms.map(m => `${m[0]} → ${MISSPELL[m[0].toLowerCase()]}`))].slice(0, 6).join(', '), ms.slice(0, 3).map(m => exLine(m[1], m[2])), 'spell'); else ok('No common spelling mistakes');
    const sp = P.lines.map((t, i) => [t, i]).filter(x => /\S {2,}\S/.test(x[0]) || /\s+[,.;:]/.test(x[0]) || /,\S/.test(x[0].replace(/\d,\d/g, '')) || /[ \t]+$/.test(x[0])); if (sp.length) add('language', 'low', 'spaces', `${sp.length} line(s) with spacing problems`, 'Double spaces, space before commas or missing space after a comma.', sp.slice(0, 3).map(x => exLine(x[1], x[0])), 'spaces');
    const lc = P.lines.map((t, i) => [t, i]).filter(x => (BUL.test(x[0]) && /^[a-z]/.test(cleanB(x[0]))) || /\bi\b(?!\.)/.test(x[0].replace(/\b(i\.e\.|b\.?tech)/gi, '')) && !/[A-Z]/.test((x[0].match(/\bi\b/) || [''])[0])); if (lc.length) add('language', 'med', 'caps', `${lc.length} line(s) with capitalisation errors`, 'Start every bullet with a capital letter and always write "I" in capitals.', lc.slice(0, 3).map(x => exLine(x[1], x[0])), 'caps');
    const rep = P.lines.map((t, i) => [t, i]).filter(x => /\b(\w{3,})\s+\1\b/i.test(x[0])); if (rep.length) add('language', 'low', 'repeat', 'Repeated words', 'A word appears twice in a row.', rep.slice(0, 3).map(x => exLine(x[1], x[0])));
    // keywords
    const found = F.kw.filter(k => low.includes(k)), miss = F.kw.filter(k => !low.includes(k)), cov = F.kw.length ? found.length / F.kw.length : 1;
    if (F.kw.length) { if (cov < .3) add('content', 'high', 'kw', 'Very few keywords for ' + field, `Only ${found.length} of ${F.kw.length} common keywords found. Add the ones you genuinely know: ${miss.slice(0, 8).join(', ')}.`); else if (cov < .6) add('content', 'med', 'kw', 'Add more field keywords', `${found.length} of ${F.kw.length} found. Missing: ${miss.slice(0, 8).join(', ')}.`); else ok(`Good keyword match (${found.length}/${F.kw.length})`); }
    const pen = g => Math.max(0, 100 - issues.filter(i => i.g === g).reduce((a, i) => a + (i.sev === 'high' ? 20 : i.sev === 'med' ? 11 : 4), 0));
    const sub = { Format: pen('format'), Content: pen('content'), Keywords: Math.round(cov * 100), Language: pen('language') };
    const score = Math.max(5, Math.round(sub.Format * .3 + sub.Content * .3 + sub.Keywords * .25 + sub.Language * .15));
    const o = { high: 0, med: 1, low: 2 }; issues.sort((a, b) => o[a.sev] - o[b.sev]);
    return { score, sub, issues, good, found, miss, words, P };
  }

  /* ---------- fixers ---------- */
  const mc = (o, r) => o[0] === o[0].toUpperCase() && o[0] !== o[0].toLowerCase() ? r[0].toUpperCase() + r.slice(1) : r;
  const FIX = {
    spell: t => t.replace(/[A-Za-z]+/g, w => MISSPELL[w.toLowerCase()] ? mc(w, MISSPELL[w.toLowerCase()]) : w),
    spaces: t => t.split('\n').map(l => { const ind = l.match(/^\s*/)[0]; let b = l.slice(ind.length).replace(/[ \t]{2,}/g, ' ').replace(/\s+([,.;:])/g, '$1').replace(/,(?=[^\s\d])/g, ', ').replace(/[ \t]+$/, ''); return ind + b; }).join('\n'),
    bullets: t => t.split('\n').map(l => BUL.test(l) ? l.replace(BUL, '• ') : l).join('\n'),
    weak: t => t.split('\n').map(l => { const m = l.match(BUL), pre = m ? '• ' : '', b = l.replace(BUL, ''); for (const w of WEAK) { if (w[0].test(b)) { let rest = b.replace(w[0], ''), nw = rest.split(/\s+/)[0] || ''; if (ING[nw.toLowerCase()]) { rest = rest.replace(nw, ''); return pre + (ING[nw.toLowerCase()][0].toUpperCase() + ING[nw.toLowerCase()].slice(1)) + ' ' + rest.trimStart(); } if (/ing$/i.test(nw) && !w[1]) return l; if (/ing$/i.test(nw)) return l; return pre + w[1] + rest; } } return l; }).join('\n'),
    caps: t => t.split('\n').map(l => { let r = l.replace(/\bi\b(?!\.)/g, 'I'); const m = r.match(BUL); if (m) { const b = r.slice(m[0].length); r = m[0] + b.charAt(0).toUpperCase() + b.slice(1); } return r; }).join('\n'),
    personal: t => t.split('\n').filter(l => !/^\s*(date of birth|dob|d\.o\.b|marital status|father'?s? name|mother'?s? name|religion|nationality|gender|sex|passport\s*(no|number)?)\s*[:\-–]/i.test(l)).join('\n').replace(/\n(?:Personal (?:Details|Information|Profile)\s*:?\s*)\n+(?=[A-Z][^\n]{0,30}\n|$)/gi, '\n'),
    decl: t => t.split('\n').filter(l => !/^\s*(declaration\s*:?|i hereby declare.*|references?\s*(are\s*)?(available|on request).*)$/i.test(l)).join('\n')
  };
  const cleanup = t => t.replace(/\n{3,}/g, '\n\n').replace(/^\s*(personal (details|information|profile))\s*:?\s*$(?=\s*(\n\s*)*$)/gim, '').trim();
  const fixAll = t => cleanup(['spell', 'spaces', 'weak', 'bullets', 'caps', 'personal', 'decl'].reduce((x, k) => FIX[k](x), t));

  /* ---------- templates ---------- */
  const TPL = [['classic', 'Classic'], ['modern', 'Modern band'], ['side', 'Left sidebar'], ['min', 'Minimal'], ['exec', 'Executive'], ['compact', 'Compact 1-page']];
  const PAPER_CSS = '.rp-paper{background:#fff;color:#111;padding:34px;font-size:12.5px;line-height:1.5}.rp-paper h1{margin:0;font-size:26px}.rp-paper h2{font-size:12.5px;text-transform:uppercase;letter-spacing:1.3px;margin:15px 0 6px;color:var(--rc);border-bottom:2px solid var(--rc);padding-bottom:3px}.rp-paper ul{margin:3px 0 6px;padding-left:18px}.rp-paper p{margin:3px 0}.rp-paper .ct{color:#444;font-size:11.5px}.rp-t-modern .hd{background:var(--rc);color:#fff;margin:-34px -34px 14px;padding:24px 34px}.rp-t-modern .hd .ct{color:#fff}.rp-t-modern h2{border:0}.rp-t-min h1{font-weight:300;letter-spacing:2px}.rp-t-min h2{border:0;color:#111;letter-spacing:2px}.rp-t-exec{font-family:Georgia,serif}.rp-t-exec h1,.rp-t-exec .ct{text-align:center;text-transform:uppercase;letter-spacing:3px}.rp-t-exec h2{text-align:center;border-top:1px solid #111;border-bottom:1px solid #111;color:#111}.rp-t-compact{font-size:11.5px}.rp-t-compact h2{margin:9px 0 4px}table.sd{width:100%;border-collapse:collapse}table.sd td{vertical-align:top;padding:0}table.sd td.l{width:32%;background:var(--rc);color:#fff;padding:26px 16px}table.sd td.l h2{color:#fff;border-color:#fff}table.sd td.l .ct{color:#fff}table.sd td.r{padding:26px 22px}';
  function secHTML(s) { let h = '<h2>' + esc(s.title) + '</h2>', ul = []; const flush = () => { if (ul.length) { h += '<ul>' + ul.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>'; ul = []; } }; s.lines.forEach(l => { if (!l.t) return; if (BUL.test(l.t)) ul.push(l.t.replace(BUL, '')); else { flush(); h += '<p>' + (/,/.test(l.t) && s.key === 'skills' ? esc(l.t) : esc(l.t)) + '</p>'; } }); flush(); return h; }
  function buildResume(text, tpl, color, font) {
    const P = parse(text); const name = (P.head[0] || { t: 'Your Name' }).t, ct = P.head.slice(1).map(l => l.t).filter(l => l.length < 120), long = P.head.slice(1).map(l => l.t).filter(l => l.length >= 120);
    const secs = P.secs.slice(); if (long.length) secs.unshift({ title: 'Summary', key: 'summary', lines: long.map(t => ({ t })) });
    const ctH = ct.length ? `<div class="ct">${ct.map(esc).join(' &nbsp;|&nbsp; ')}</div>` : '';
    const style = `--rc:${color};font-family:${font}`;
    if (tpl === 'side') { const L = secs.filter(s => /skills|languages?|education|certif|hobbies|interests|strengths/.test(s.key + ' ' + s.title.toLowerCase()) && s.key !== 'summary'), R = secs.filter(s => !L.includes(s)); return `<div class="rp-paper rp-t-side" style="${style};padding:0"><table class="sd"><tr><td class="l"><h1 style="font-size:20px;color:#fff;margin-bottom:6px">${esc(name)}</h1>${ct.map(c => `<div class="ct">${esc(c)}</div>`).join('')}${L.map(secHTML).join('')}</td><td class="r">${R.map(secHTML).join('')}</td></tr></table></div>`; }
    const cls = { classic: '', modern: 'rp-t-modern', min: 'rp-t-min', exec: 'rp-t-exec', compact: 'rp-t-compact' }[tpl];
    const head = tpl === 'modern' ? `<div class="hd"><h1>${esc(name)}</h1>${ctH}</div>` : `<h1>${esc(name)}</h1>${ctH}`;
    return `<div class="rp-paper ${cls}" style="${style}">${head}${secs.map(secHTML).join('')}</div>`;
  }

  /* ---------- UI ---------- */
  T.name = 'Resume Checker & Improver'; T.ico = '🚀';
  T.desc = 'Upload your resume (PDF / Word / TXT), pick your field – get errors, one-click fixes, keywords and 6 templates';
  T.tags = ['Upload', 'Auto-fix', 'Templates'];
  T.render = el => {
    CLEANUP = PJ.cleanup;
    const pref = PJ.LS.get('rp_pref', { f: 'HVAC / Mechanical', l: 'F' });
    let firstScore = null, tpl = 'classic', color = '#2563eb', font = 'Calibri,Arial,sans-serif';
    el.innerHTML = `<div class="card"><h3>1️⃣ Upload or paste your resume</h3>
      <div class="form"><label class="fld wide"><span>📎 Upload resume (PDF, Word .docx or .txt) – processed only in your browser</span><input type="file" id="rf" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"><small id="rm"></small></label>
      <label class="fld"><span>Which field / job are you applying for?</span><select id="rfield">${Object.keys(FIELDS).map(f => `<option ${f === pref.f ? 'selected' : ''}>${esc(f)}</option>`).join('')}</select></label>
      <label class="fld"><span>I am a</span><select id="rlv"><option value="F" ${pref.l === 'F' ? 'selected' : ''}>Fresher (0–1 year)</option><option value="E" ${pref.l === 'E' ? 'selected' : ''}>Experienced</option></select></label>
      <label class="fld wide"><span>Your resume text (you can edit it here – fixes are applied here)</span><textarea id="rt" rows="13" placeholder="Paste your full resume text here or upload a file above…"></textarea></label></div>
      <div class="row"><button class="btn" id="ran">🔍 Check my resume</button><button class="btn ghost" id="rsm">Load sample (with mistakes)</button><button class="btn ghost" id="rcl">Clear</button></div></div><div id="rres"></div>`;
    const ta = $('#rt', el), res_ = $('#rres', el);
    const read = async f => { const m = $('#rm', el); m.textContent = 'Reading ' + f.name + '…'; try { let t; if (/\.pdf$/i.test(f.name)) t = await pdfText(f); else if (/\.docx$/i.test(f.name)) t = await docxText(f); else if (/\.txt$/i.test(f.name)) t = await f.text(); else throw new Error('Please upload PDF, .docx or .txt (old .doc: save as .docx or PDF first)'); if (t.length < 40) throw new Error('No readable text found – scanned/image resumes cannot be read. Paste the text instead.'); ta.value = t; m.textContent = '✅ ' + f.name + ' loaded (' + t.split(/\s+/).length + ' words)'; run(true); } catch (e) { m.textContent = '⚠️ ' + (e.message || e); } };
    $('#rf', el).onchange = e => e.target.files[0] && read(e.target.files[0]);
    $('#rsm', el).onclick = () => { ta.value = SAMPLE; run(true); };
    $('#rcl', el).onclick = () => { ta.value = ''; res_.innerHTML = ''; firstScore = null; };
    $('#ran', el).onclick = () => run(true);
    $('#rfield', el).onchange = $('#rlv', el).onchange = () => { PJ.LS.set('rp_pref', { f: $('#rfield', el).value, l: $('#rlv', el).value }); if (ta.value.trim()) run(false); };
    const apply = (fn) => { const before = ta.value; ta.value = fn(before); if (ta.value === before) toast('Nothing to change'); else toast('Fixed ✓'); run(false); };
    function run(reset) {
      const text = ta.value; if (text.trim().length < 60) { res_.innerHTML = `<div class="card">${bad('Please upload or paste your resume (at least a few lines).')}</div>`; return; }
      const field = $('#rfield', el).value, lv = $('#rlv', el).value, r = analyze(text, field, lv), F = FIELDS[field];
      if (reset || firstScore === null) firstScore = r.score;
      PJ.LS.set('rp_pref', { f: field, l: lv });
      const col = r.score >= 80 ? '#16a34a' : r.score >= 60 ? '#f59e0b' : '#dc2626', fixable = [...new Set(r.issues.filter(i => i.fix).map(i => i.fix))];
      const sumTxt = lv === 'F' ? `Motivated ${F.role} with hands-on knowledge of ${(F.kw.slice(0, 3).join(', ') || 'my core skills')}. Eager to apply academic projects and practical training to deliver quality work and grow with a progressive organisation.` : `Results-driven ${F.role} with X+ years of experience in ${(F.kw.slice(0, 3).join(', ') || 'my core skills')}. Proven record of delivering projects on time, improving quality and leading teams. Seeking to contribute my expertise to a growth-oriented company.`;
      const sev = { high: 'h', med: 'm', low: 'l' }, sevL = { high: '🔴 High', med: '🟠 Medium', low: '🔵 Low' };
      res_.innerHTML = `<div class="card"><h3>2️⃣ Your resume report – ${esc(field)} · ${lv === 'F' ? 'Fresher' : 'Experienced'}</h3>
        <div class="rp-score"><div class="rp-ring" style="background:conic-gradient(${col} ${r.score * 3.6}deg,#e2e8f0 0)"><span style="color:${col}">${r.score}</span></div>
        <div class="rp-sub">${Object.entries(r.sub).map(([k, v]) => `<div><span>${k}</span><div class="pj-meter"><i style="width:${v}%"></i></div><b>${v}</b></div>`).join('')}</div></div>
        <p class="note">${firstScore !== r.score ? `Score changed from <b>${firstScore}</b> to <b>${r.score}</b> after your fixes. ` : ''}${r.issues.length} issue(s) · ${r.good.length} checks passed · ${r.words} words. ${r.score >= 80 ? 'Great resume – polish the remaining points.' : r.score >= 60 ? 'Good start – fix the red and orange items.' : 'Needs work – start with the red items.'}</p>
        <div class="row">${fixable.length ? `<button class="btn" id="fall">✨ Auto-fix everything possible (${fixable.length} fix type${fixable.length > 1 ? 's' : ''})</button>` : ''}<button class="btn ghost" id="fcp">Copy corrected text</button></div></div>
        <div class="card"><h3>Errors & how to fix them (${r.issues.length})</h3>${r.issues.map((i, k) => `<div class="rp-is ${sev[i.sev]}"><b>${sevL[i.sev]} · ${esc(i.title)}</b><p>${esc(i.detail)}</p>${i.ex.map(x => `<code>${esc(x)}</code>`).join('')}${i.fix ? `<button class="btn sm" data-fx="${i.fix}">✨ Fix automatically</button>` : ''}</div>`).join('') || '<p>🎉 No issues found!</p>'}
          ${r.good.length ? `<details><summary>✅ What is already good (${r.good.length})</summary>${ul(r.good.map(esc))}</details>` : ''}</div>
        <div class="card"><h3>3️⃣ ${esc(field)} – what recruiters look for</h3><p style="margin:0 0 8px"><b>Keywords you have:</b> ${r.found.map(k => `<span class="chip" style="background:#dcfce7;color:#166534">${esc(k)}</span>`).join('') || '<i>none yet</i>'}</p>
          <p style="margin:0 0 8px"><b>Keywords to add (only if true for you):</b> ${r.miss.map(k => `<span class="chip" style="background:#fee2e2;color:#991b1b">${esc(k)}</span>`).join('') || '<i>all covered 🎉</i>'}</p>
          <p class="note" style="margin:0 0 10px">💡 ${esc(F.tip)}</p><h4>Sample ${lv === 'F' ? 'career objective' : 'professional summary'} (edit the details)</h4><div class="copybox">${esc(sumTxt)}</div>
          <div class="row"><button class="btn sm ghost" id="csum">Copy sample</button>${r.miss.length ? '<button class="btn sm ghost" id="cskl">Copy missing-keywords line</button>' : ''}</div>
          <h4>Bullet formula</h4><p style="margin:0;font-size:.88rem">Action verb + what you did + tool/method + result (number). Example: <i>"Installed 12 VRF indoor units using AutoCAD drawings, completing the floor 3 days before schedule."</i></p></div>
        <div class="card"><h3>4️⃣ Pick a template & download</h3><div class="rp-tpl">${TPL.map(t => `<button data-t="${t[0]}" class="${t[0] === tpl ? 'on' : ''}"><i style="background:linear-gradient(${t[0] === 'side' ? '90deg' : '180deg'},${color} ${t[0] === 'modern' ? '40%' : t[0] === 'side' ? '30%' : '0'},#f1f5f9 0)"></i>${t[1]}</button>`).join('')}</div>
          <div class="pj-bar"><label class="fld sm"><span>Colour</span><input type="color" id="rcol" value="${color}" style="padding:2px;height:40px"></label><label class="fld"><span>Font</span><select id="rfont"><option value="Calibri,Arial,sans-serif">Calibri / Arial</option><option value="Georgia,serif">Georgia (serif)</option><option value="'Times New Roman',serif">Times New Roman</option><option value="Verdana,sans-serif">Verdana</option></select></label>
          <button class="btn" id="rdl">⬇ Download Word</button><button class="btn ghost" id="rpr">🖨 Print / Save as PDF</button></div>
          <p class="note" style="margin:0 0 10px">The template is built from the text above – fix errors first, then choose a design. Headings are detected automatically (Summary, Experience, Education, Skills…).</p><div id="rprev" class="scroll"></div></div>`;
      $$('[data-fx]', res_).forEach(b => b.onclick = () => apply(FIX[b.dataset.fx]));
      const fa = $('#fall', res_); if (fa) fa.onclick = () => apply(fixAll);
      $('#fcp', res_).onclick = () => copy(ta.value);
      const cs = $('#csum', res_); if (cs) cs.onclick = () => copy(sumTxt);
      const ck = $('#cskl', res_); if (ck) ck.onclick = () => copy('Skills: ' + r.miss.join(', '));
      const draw = () => { $('#rprev', res_).innerHTML = buildResume(ta.value, tpl, color, font); };
      $$('.rp-tpl button', res_).forEach(b => b.onclick = () => { tpl = b.dataset.t; $$('.rp-tpl button', res_).forEach(x => x.classList.toggle('on', x === b)); draw(); });
      $('#rcol', res_).oninput = e => { color = e.target.value; $$('.rp-tpl i', res_).forEach(i => i.style.background = i.style.background.replace(/rgb\([^)]*\)|#[0-9a-f]{3,6}/i, color)); draw(); };
      $('#rfont', res_).onchange = e => { font = e.target.value; draw(); };
      const doc = () => `<style>${PAPER_CSS}</style>` + buildResume(ta.value, tpl, color, font);
      $('#rdl', res_).onclick = () => download(new Blob([`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Resume</title>${doc()}</head><body></body></html>`.replace('</head><body></body>', '</head><body>' + buildResume(ta.value, tpl, color, font).replace(/var\(--rc\)/g, color) + '</body>').replace(/var\(--rc\)/g, color)], { type: 'application/msword' }), 'resume.doc');
      $('#rpr', res_).onclick = () => PJ.printHTML('Resume', doc());
      draw();
    }
    if (PJ._rpPending) { ta.value = PJ._rpPending; PJ._rpPending = null; run(true); }
  };
})();
