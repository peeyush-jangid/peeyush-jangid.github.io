/* ===== Career, HVAC resources, Office resources, AI assistant tools ===== */

/* ---------- helpers ---------- */
function qaPage(groups, searchable = true) {
  return el => {
    el.innerHTML = (searchable ? `<div class="card"><input id="qs" type="search" placeholder="Search…"></div>` : '') +
      groups.map(g => `<div class="card grp"><h3>${g.t}</h3>${g.items.map(i => `<details data-s="${esc((i[0] + ' ' + i[1]).toLowerCase())}"><summary>${esc(i[0])}</summary>${i[1].startsWith('<') ? i[1] : `<p>${esc(i[1])}</p>`}</details>`).join('')}</div>`).join('');
    if (searchable) $('#qs', el).addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      $$('details', el).forEach(d => d.hidden = q && !d.dataset.s.includes(q));
      $$('.grp', el).forEach(g => g.hidden = q && !$$('details', g).some(d => !d.hidden));
    });
  };
}
const ul = a => '<ul>' + a.map(x => `<li>${x}</li>`).join('') + '</ul>';
function copyList(items) { // items: [title, text]
  return el => {
    el.innerHTML = items.map((it, i) => `<div class="card"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><h3 style="margin:0">${esc(it[0])}</h3><button class="btn sm" data-i="${i}">Copy</button></div><div class="copybox">${esc(it[1])}</div></div>`).join('');
    $$('button[data-i]', el).forEach(b => b.onclick = () => copy(items[b.dataset.i][1]));
  };
}
function tableTool(head, rows, searchPh) {
  return el => {
    el.innerHTML = `<div class="card"><input id="qs" type="search" placeholder="${searchPh}"><div class="scroll" style="margin-top:14px"><table><tr>${head.map(h => `<th>${h}</th>`).join('')}<th></th></tr>${rows.map((r, i) => `<tr data-s="${esc(r.join(' ').toLowerCase())}">${r.map((c, j) => `<td>${j === 0 || j === 1 ? `<code>${esc(c)}</code>` : esc(c)}</td>`).join('')}<td><button class="btn sm" data-i="${i}">Copy</button></td></tr>`).join('')}</table></div></div>`;
    $$('button[data-i]', el).forEach(b => b.onclick = () => copy(rows[b.dataset.i][head.length === 3 && searchPh.includes('command') ? 1 : 1]));
    $('#qs', el).addEventListener('input', e => { const q = e.target.value.toLowerCase(); $$('tr[data-s]', el).forEach(r => r.hidden = q && !r.dataset.s.includes(q)); });
  };
}
const csv = rows => '﻿' + rows.map(r => r.map(c => /[",\n]/.test(c) ? '"' + String(c).replace(/"/g, '""') + '"' : c).join(',')).join('\r\n');
const dlCsv = (name, rows) => download(new Blob([csv(rows)], { type: 'text/csv;charset=utf-8' }), name + '.csv');
const dlDoc = (name, title, html) => download(new Blob([`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${title}</title></head><body style="font-family:Calibri,Arial;font-size:12pt;line-height:1.5">${html}</body></html>`], { type: 'application/msword' }), name + '.doc');
function downloads(list) {
  return el => {
    el.innerHTML = `<div class="card"><p class="note" style="margin-top:0">Click Download – open the file in Excel / Word / Google Sheets / Docs and edit freely.</p>${list.map((d, i) => `<div class="dl"><div><b>${esc(d.n)}</b><small>${esc(d.d)}</small></div><button class="btn sm" data-i="${i}">⬇ Download ${d.ext}</button></div>`).join('')}</div>`;
    $$('button[data-i]', el).forEach(b => b.onclick = () => list[b.dataset.i].go());
  };
}

/* ======================= CAREER ======================= */
add('career', 'resume-builder', '📋', 'Free Resume Builder', 'Create an ATS-friendly resume in minutes', resumeTool);

add('career', 'interview-questions', '🎤', 'Interview Questions', 'Common HR, behavioural and technical questions with answers', qaPage([
  { t: 'General / HR Questions', items: [
    ['Tell me about yourself.', 'Use the Present–Past–Future formula: current role & strengths (present), 1–2 key achievements or experience (past), and why this role excites you (future). Keep it to 60–90 seconds and stay professional – avoid personal life details.'],
    ['What are your strengths?', 'Pick 2–3 strengths relevant to the job and back each with a real example. E.g. "I am a quick learner – in 3 months I mastered AutoCAD MEP and started preparing drawings independently."'],
    ['What is your weakness?', 'Choose a genuine but non-critical weakness and show how you are improving it. E.g. "I used to hesitate in delegating; now I use task trackers and weekly check-ins."'],
    ['Why should we hire you?', 'Match your skills to the job description: "You need X, I have done X at Company Y with result Z. I can start contributing from day one."'],
    ['Why do you want to leave your current job?', 'Stay positive: growth, learning, bigger responsibility, or relocation. Never criticise your current employer.'],
    ['Where do you see yourself in 5 years?', 'Show ambition aligned with the company: "Growing into a senior role where I lead projects and mentor juniors, while keep upgrading my skills."'],
    ['What are your salary expectations?', 'Research the market range first. Say: "Based on my experience and market standards I expect ₹X–Y, but I am flexible for the right opportunity."'],
    ['Why do you want to join our company?', 'Mention 2 specifics you researched – products, projects, culture – and how your skills help them.'] ] },
  { t: 'Behavioural Questions (use the STAR method)', items: [
    ['Describe a conflict with a colleague and how you solved it.', 'Situation → Task → Action → Result. Focus on listening, finding common ground and the positive outcome – not on blaming.'],
    ['Tell me about a tight deadline you handled.', 'Explain how you prioritised, communicated early, and delivered. Add a measurable result (e.g. "delivered 1 day early").'],
    ['Describe a failure and what you learnt.', 'Own the mistake, explain the fix, and show how you now prevent it. Interviewers value honesty and learning.'],
    ['How do you handle pressure?', 'Break work into priorities, take short breaks, communicate blockers early. Give a concrete example.'] ] },
  { t: 'HVAC / Engineering Technical Questions', items: [
    ['What is 1 Ton of Refrigeration (TR)?', '1 TR = 12,000 BTU/h = 3.517 kW – the heat absorbed when 1 ton of ice melts in 24 hours.'],
    ['Explain the vapour compression refrigeration cycle.', 'Four stages: Compression (low-pressure vapour → high-pressure vapour), Condensation (heat rejected, vapour → liquid), Expansion (pressure drop in expansion valve), Evaporation (liquid absorbs heat, becomes vapour – cooling effect).'],
    ['What is the CFM formula?', 'CFM = Area (sq ft) × Velocity (FPM). For rooms: CFM = Volume (cu ft) × ACH ÷ 60.'],
    ['Methods of duct sizing?', 'Equal friction method, Static regain method and Velocity reduction method. Equal friction is the most common for comfort AC.'],
    ['What is COP / EER?', 'COP = Cooling effect (kW) ÷ Power input (kW). EER = Cooling in BTU/h ÷ Power in Watts. EER ≈ 3.412 × COP.'],
    ['Difference between air-cooled and water-cooled chillers?', 'Air-cooled: lower installation cost, no cooling tower, less efficient, suited to small–medium loads. Water-cooled: higher efficiency, longer life, needs cooling tower & water treatment, used in large buildings.'],
    ['What is a VRF / VRV system?', 'Variable Refrigerant Flow – one outdoor unit serves multiple indoor units with variable compressor speed and refrigerant flow, giving zone control and energy savings.'],
    ['What is a psychrometric chart used for?', 'To read air properties – dry-bulb, wet-bulb, dew point, humidity ratio, enthalpy – and plot processes like cooling, heating, humidification.'] ] }
]));

add('career', 'banking-interview', '🏛️', 'Banking Interview Preparation', 'Important banking questions with simple answers', qaPage([
  { t: 'Banking Basics', items: [
    ['What is KYC?', 'Know Your Customer – the process by which a bank verifies a customer\'s identity and address using documents such as Aadhaar, PAN, passport, voter ID or driving licence, to prevent fraud and money laundering.'],
    ['Difference between savings and current account?', 'Savings: for individuals, pays interest, limited transactions. Current: for businesses, no (or negligible) interest, unlimited transactions, overdraft facility available.'],
    ['What is FD and RD?', 'Fixed Deposit – lump sum deposited for a fixed tenure at a fixed rate. Recurring Deposit – fixed amount deposited every month for a set period.'],
    ['What is a cheque bounce?', 'When a cheque is dishonoured due to insufficient funds, signature mismatch etc. In India, bounce for insufficient funds is an offence under Section 138 of the Negotiable Instruments Act after due notice.'],
    ['What is a CIBIL score?', 'A 3-digit credit score (300–900) showing creditworthiness. 750+ is considered good for loans.'] ] },
  { t: 'RBI & Monetary Policy', items: [
    ['What is Repo Rate?', 'The rate at which RBI lends short-term money to commercial banks. Higher repo → costlier loans, lower inflation.'],
    ['What is CRR?', 'Cash Reserve Ratio – percentage of a bank\'s deposits (NDTL) that must be kept as cash with RBI. Banks earn no interest on it.'],
    ['What is SLR?', 'Statutory Liquidity Ratio – percentage of deposits that banks must maintain with themselves in liquid assets like cash, gold or government securities.'],
    ['What is inflation?', 'A sustained rise in general price levels, reducing the purchasing power of money. In India measured mainly by CPI.'],
    ['What is NPA?', 'Non-Performing Asset – a loan where interest or principal remains overdue for more than 90 days.'] ] },
  { t: 'Payments & Products', items: [
    ['NEFT vs RTGS vs IMPS vs UPI?', 'NEFT – batch settlement, no minimum, 24×7. RTGS – real-time, for large value (minimum ₹2 lakh). IMPS – instant 24×7 transfer. UPI – instant mobile payments using a VPA/UPI ID, 24×7.'],
    ['Types of loans?', 'Home, personal, vehicle, education, gold, business/MSME, loan against property, Mudra loans.'],
    ['What is priority sector lending?', 'RBI requires banks to lend a share of credit to sectors like agriculture, MSME, education, housing and weaker sections.'],
    ['What is a Mutual Fund?', 'A pooled investment managed by a professional fund manager that invests in stocks, bonds or other assets. Investors buy units at NAV.'] ] },
  { t: 'Tips for the Interview', items: [
    ['How to prepare in 7 days', ul(['Day 1–2: Banking basics & products', 'Day 3: RBI, repo/CRR/SLR, current banking news', 'Day 4: Payments, digital banking, KYC/AML', 'Day 5: Sales & customer-service scenarios', 'Day 6: Mock interview + resume revision', 'Day 7: Rest, formal dress, documents ready'])],
    ['Sales-role question: "How will you achieve targets?"', 'Talk about building a customer base through references, understanding customer needs, cross-selling responsibly, follow-ups and tracking daily goals.'] ] }
]));

add('career', 'kyc-bpo', '🎧', 'KYC and BPO Guidance', 'KYC process, documents and BPO interview tips', qaPage([
  { t: 'KYC Guidance', items: [
    ['What documents are accepted for KYC?', ul(['Officially Valid Documents (OVD): Aadhaar, Passport, Driving Licence, Voter ID, NREGA Job Card', 'PAN card (mandatory for most financial accounts)', 'Address proof: utility bill (≤2 months old), bank statement, rent agreement – where OVD lacks current address', 'Recent passport-size photograph'])],
    ['Types of KYC', ul(['Full KYC – in-person or video verification (V-CIP), no limits', 'e-KYC / Aadhaar OTP – quick, with some limits on balance/transactions', 'Min KYC / small accounts – limited balance and transaction caps', 'Re-KYC / periodic update – every 2 / 8 / 10 years depending on customer risk'])],
    ['KYC verification steps', ul(['Collect application form and documents', 'Check originals vs copies (or Aadhaar / DigiLocker authentication)', 'Match name, DOB and photo across documents', 'Screen against sanction / fraud lists', 'Approve, reject or raise a query; record the audit trail'])],
    ['Common reasons for KYC rejection', 'Blurred or expired documents, name/DOB mismatch, address mismatch, unsigned forms, photo not matching, or missing PAN.'],
    ['Why is KYC important?', 'It prevents fraud, identity theft and money laundering, and is required by RBI, SEBI and PMLA regulations.'] ] },
  { t: 'BPO / Call-Centre Guidance', items: [
    ['Voice vs Non-voice process', 'Voice: handle customer calls (inbound/outbound). Non-voice: email, chat, back-office, data entry, KYC and document processing.'],
    ['Important BPO terms', ul(['AHT – Average Handling Time', 'CSAT – Customer Satisfaction score', 'FCR – First Call Resolution', 'QA – Quality Audit score', 'SLA – Service Level Agreement', 'Escalation – passing a case to a senior / specialist team'])],
    ['Common BPO interview questions', ul(['Tell me about yourself', 'Are you comfortable with rotational / night shifts?', 'How will you handle an angry customer?', 'What is your typing speed?', 'Why do you want to work in a BPO?'])],
    ['How to handle an angry customer', 'Listen without interrupting → empathise ("I understand how frustrating this is") → apologise for the inconvenience → confirm the issue → give a solution with a timeline → thank them and close politely.'],
    ['Communication tips', 'Speak slowly and clearly, use positive language ("I can do this" instead of "I can\'t"), avoid slang, repeat key details to confirm, and practise a neutral accent daily by reading aloud.'],
    ['Night-shift survival tips', 'Fix a sleep schedule, use blackout curtains, eat light, stay hydrated, and take short walks during breaks.'] ] }
]));

add('career', 'job-resources', '🧳', 'Job Application Resources', 'Cover letter, checklist, ATS tips and job portals', el => {
  const portals = [['Naukri', 'https://www.naukri.com'], ['LinkedIn Jobs', 'https://www.linkedin.com/jobs'], ['Indeed India', 'https://in.indeed.com'], ['Foundit (Monster)', 'https://www.foundit.in'], ['Shine', 'https://www.shine.com'], ['Apna', 'https://apna.co'], ['Freshersworld', 'https://www.freshersworld.com'], ['National Career Service', 'https://www.ncs.gov.in']];
  const cl = `Dear [Hiring Manager's Name],

I am writing to apply for the position of [Job Title] at [Company Name]. With [X] years of experience in [field], I have developed strong skills in [skill 1], [skill 2] and [skill 3].

In my current role at [Current Company], I [key achievement with a number, e.g. reduced costs by 12%]. I am excited about [Company Name] because [specific reason], and I am confident I can contribute to your team.

I have attached my resume for your review and would welcome an opportunity to discuss my application.

Thank you for your time and consideration.

Sincerely,
[Your Name]
[Phone] | [Email]`;
  el.innerHTML = `<div class="card"><h3>Job portals</h3><div>${portals.map(p => `<a class="btn ghost sm" style="margin:4px" target="_blank" rel="noopener" href="${p[1]}">${p[0]} ↗</a>`).join('')}</div></div>
  <div class="card"><h3>Application checklist</h3>${ul(['Resume tailored to the job description (use the same keywords)', 'Resume saved as PDF – name it Firstname_Lastname_Role.pdf', 'Professional email address and updated phone number', 'LinkedIn profile updated and matching your resume', 'Cover letter customised for each company', 'References / certificates ready in a single folder', 'Follow up after 5–7 working days'])}</div>
  <div class="card"><h3>ATS-friendly resume tips</h3>${ul(['Use simple headings: Summary, Experience, Education, Skills', 'Avoid tables, images, text boxes and fancy columns', 'Include keywords from the job post naturally', 'Start bullets with action verbs and add numbers / results', 'Keep it 1 page (freshers) or 2 pages (experienced)'])}</div>
  <div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">Cover letter template</h3><button class="btn sm" id="cp">Copy</button></div><div class="copybox">${esc(cl)}</div></div>`;
  $('#cp', el).onclick = () => copy(cl);
});

const EMAILS = [
  ['Job application', `Subject: Application for [Job Title] – [Your Name]\n\nDear [Hiring Manager],\n\nI would like to apply for the position of [Job Title] advertised on [Portal]. I have [X] years of experience in [field] and am confident that my skills match your requirements.\n\nPlease find my resume attached. I look forward to discussing how I can contribute to [Company].\n\nThank you,\n[Your Name]\n[Phone]`],
  ['Follow-up after interview', `Subject: Following up – [Job Title] interview\n\nDear [Interviewer],\n\nThank you for interviewing me on [date]. I enjoyed learning more about the role and team. I remain very interested in the position and would be glad to provide any further information.\n\nI look forward to hearing from you.\n\nBest regards,\n[Your Name]`],
  ['Thank-you after interview', `Subject: Thank you – [Job Title] interview\n\nDear [Interviewer],\n\nThank you for taking the time to speak with me today. Our discussion about [topic] made me even more enthusiastic about joining [Company].\n\nSincerely,\n[Your Name]`],
  ['Resignation letter', `Subject: Resignation – [Your Name]\n\nDear [Manager],\n\nPlease accept this letter as formal notice of my resignation from the position of [Designation], effective [last working date] as per my notice period.\n\nThank you for the opportunities and support during my time here. I will ensure a smooth handover of my responsibilities.\n\nSincerely,\n[Your Name]\n[Employee ID]`],
  ['Leave request', `Subject: Leave request – [Date(s)]\n\nDear [Manager],\n\nI would like to request leave from [start date] to [end date] due to [reason]. I will complete my pending work and brief [colleague] before leaving.\n\nKindly approve my request.\n\nThank you,\n[Your Name]`],
  ['Salary hike request', `Subject: Request for salary review\n\nDear [Manager],\n\nI have been working as [Designation] for [duration] and have [key achievements]. Based on my contributions and current market standards, I would like to request a review of my compensation.\n\nI would be happy to discuss this at your convenience.\n\nRegards,\n[Your Name]`],
  ['Meeting reschedule', `Subject: Request to reschedule meeting on [date]\n\nHi [Name],\n\nI am sorry, but I will not be able to attend our meeting scheduled for [date/time] due to [reason]. Could we reschedule to [alternative date/time]?\n\nThank you for understanding.\n\nRegards,\n[Your Name]`],
  ['Payment reminder', `Subject: Payment reminder – Invoice [No.]\n\nDear [Client],\n\nThis is a gentle reminder that invoice [No.] for ₹[amount], due on [date], is still pending. Kindly arrange the payment at the earliest.\n\nPlease ignore this message if already paid.\n\nRegards,\n[Your Name]`],
  ['Reference request', `Subject: Request for a reference\n\nDear [Name],\n\nI am applying for [Job Title] at [Company] and would be grateful if you could act as my reference. Please let me know if you are comfortable with this.\n\nThank you,\n[Your Name]`],
  ['Out-of-office reply', `Subject: Out of office\n\nThank you for your email. I am out of the office from [date] to [date] with limited access to email. For urgent matters please contact [Name] at [email/phone]. I will reply on my return.\n\nRegards,\n[Your Name]`]
];
add('career', 'email-templates', '✉️', 'Professional Email Templates', 'Ready-to-use emails – just copy and edit', copyList(EMAILS));

/* ======================= HVAC resources ======================= */
const BOQ_HEAD = ['Sr No', 'Description', 'Unit', 'Qty', 'Rate (₹)', 'Amount (₹)'];
const boqRows = items => [BOQ_HEAD, ...items.map((it, i) => [i + 1, it[0], it[1], '', '', `=D${i + 2}*E${i + 2}`]), ['', 'TOTAL', '', '', '', `=SUM(F2:F${items.length + 1})`]];
const BOQS = [
  ['Ducting & Air Distribution BOQ', 'GI ducting, insulation, grilles, diffusers, dampers', 'hvac-ducting-boq', [['GI sheet metal ducting 24 G', 'Sq.m'], ['GI sheet metal ducting 22 G', 'Sq.m'], ['Duct insulation – 25 mm nitrile rubber / PUF', 'Sq.m'], ['Supply air diffuser (600×600)', 'Nos'], ['Return air grille', 'Nos'], ['Linear slot diffuser', 'RM'], ['Volume control damper (VCD)', 'Nos'], ['Fire damper', 'Nos'], ['Flexible duct 8"', 'RM'], ['Duct supports, hangers & accessories', 'Kg']]],
  ['Chilled Water System BOQ', 'Chiller, pumps, piping, valves, AHU/FCU', 'hvac-chilled-water-boq', [['Water-cooled / air-cooled chiller', 'TR'], ['Primary chilled water pump', 'Nos'], ['Secondary chilled water pump', 'Nos'], ['Air Handling Unit (AHU)', 'Nos'], ['Fan Coil Unit (FCU)', 'Nos'], ['MS pipe (ERW/seamless) with insulation', 'RM'], ['Butterfly / balancing valves', 'Nos'], ['Strainers', 'Nos'], ['Expansion tank', 'Nos'], ['Pressure / temperature gauges', 'Nos'], ['Testing, commissioning & balancing', 'LS']]],
  ['VRF / Split AC BOQ', 'Outdoor & indoor units, copper piping, drains', 'hvac-vrf-split-boq', [['VRF outdoor unit', 'TR'], ['Indoor unit – cassette / ducted / wall', 'Nos'], ['Copper refrigerant piping with insulation', 'RM'], ['Y-joints / branch kits', 'Nos'], ['Drain piping (PVC / CPVC)', 'RM'], ['Power & control cabling', 'RM'], ['Wired remote controller', 'Nos'], ['Installation, testing & commissioning', 'LS']]]
];
add('hvac', 'boq-templates', '📊', 'HVAC BOQ Templates', 'Downloadable Excel-ready BOQ sheets with auto totals', downloads(BOQS.map(b => ({ n: b[0], d: b[1], ext: 'CSV', go: () => dlCsv(b[2], boqRows(b[3])) }))));

const ACAD = [
  ['L', 'LINE', 'Draw straight lines'], ['PL', 'PLINE', 'Draw a polyline'], ['C', 'CIRCLE', 'Draw a circle'], ['A', 'ARC', 'Draw an arc'], ['REC', 'RECTANG', 'Draw a rectangle'], ['POL', 'POLYGON', 'Draw a polygon'], ['EL', 'ELLIPSE', 'Draw an ellipse'], ['SPL', 'SPLINE', 'Draw a smooth curve'],
  ['M', 'MOVE', 'Move objects'], ['CO', 'COPY', 'Copy objects'], ['RO', 'ROTATE', 'Rotate objects'], ['SC', 'SCALE', 'Scale objects'], ['MI', 'MIRROR', 'Mirror objects'], ['O', 'OFFSET', 'Create parallel copies'], ['AR', 'ARRAY', 'Rectangular / polar / path array'], ['S', 'STRETCH', 'Stretch objects'],
  ['TR', 'TRIM', 'Trim to cutting edges'], ['EX', 'EXTEND', 'Extend to boundary'], ['F', 'FILLET', 'Round a corner'], ['CHA', 'CHAMFER', 'Bevel a corner'], ['E', 'ERASE', 'Delete objects'], ['X', 'EXPLODE', 'Break block/polyline into parts'], ['J', 'JOIN', 'Join objects'], ['BR', 'BREAK', 'Break an object'],
  ['T / MT', 'MTEXT', 'Multiline text'], ['DT', 'TEXT', 'Single-line text'], ['DLI', 'DIMLINEAR', 'Linear dimension'], ['DAL', 'DIMALIGNED', 'Aligned dimension'], ['DRA', 'DIMRADIUS', 'Radius dimension'], ['DDI', 'DIMDIAMETER', 'Diameter dimension'], ['LE', 'QLEADER', 'Leader with text'],
  ['H', 'HATCH', 'Hatch / fill an area'], ['B', 'BLOCK', 'Create a block'], ['I', 'INSERT', 'Insert a block'], ['W', 'WBLOCK', 'Write block to file'], ['LA', 'LAYER', 'Layer manager'], ['MA', 'MATCHPROP', 'Copy properties between objects'], ['PR', 'PROPERTIES', 'Properties palette'],
  ['Z', 'ZOOM', 'Zoom (use E for extents, W for window)'], ['P', 'PAN', 'Pan the view'], ['REGEN / RE', 'REGEN', 'Regenerate drawing'], ['DI', 'DIST', 'Measure distance'], ['AA', 'AREA', 'Measure area'], ['LI', 'LIST', 'List object information'], ['PU', 'PURGE', 'Remove unused items'], ['UNITS', 'UNITS', 'Set drawing units'], ['LTS', 'LTSCALE', 'Set linetype scale'],
  ['F8', 'ORTHO', 'Toggle ortho mode'], ['F3', 'OSNAP', 'Toggle object snap'], ['F9', 'SNAP', 'Toggle snap'], ['Ctrl+Z', 'UNDO', 'Undo last action'], ['Ctrl+S', 'QSAVE', 'Save drawing'], ['PLOT / Ctrl+P', 'PLOT', 'Print / plot to PDF']
];
add('hvac', 'autocad', '📏', 'AutoCAD Resources', 'Command shortcuts cheat-sheet + HVAC drawing tips', el => {
  tableTool(['Shortcut', 'Command', 'What it does'], ACAD, 'Search command or shortcut…')(el);
  el.insertAdjacentHTML('beforeend', `<div class="card"><h3>HVAC drafting tips</h3>${ul(['Create separate layers: DUCT-SUPPLY, DUCT-RETURN, CHW-PIPE, EQUIPMENT, DIMENSION, TEXT', 'Use blocks for diffusers, grilles, AHUs and FCUs to keep file size small', 'Use standard colour code: blue – supply, red – return, green – fresh air', 'Always set units (mm) and a consistent scale before plotting', 'Use PURGE and AUDIT regularly to keep drawings clean', 'Use XREF to overlay architectural plans without editing them'])}</div>`);
});
// copy the command (2nd column) in autocad; adjust tableTool copy target
TOOLS[TOOLS.length - 1].render = (orig => el => { orig(el); $$('button[data-i]', el).forEach(b => b.onclick = () => copy(ACAD[b.dataset.i][1])); })(TOOLS[TOOLS.length - 1].render);

/* ======================= OFFICE resources ======================= */
const XL = [
  ['SUM', '=SUM(A1:A10)', 'Adds numbers in a range'], ['AVERAGE', '=AVERAGE(A1:A10)', 'Average of numbers'], ['COUNT', '=COUNT(A1:A10)', 'Counts numeric cells'], ['COUNTA', '=COUNTA(A1:A10)', 'Counts non-empty cells'], ['MAX / MIN', '=MAX(A1:A10)', 'Largest / smallest value'],
  ['IF', '=IF(A1>=40,"Pass","Fail")', 'Returns a value based on a condition'], ['IFS', '=IFS(A1>=90,"A",A1>=75,"B",TRUE,"C")', 'Multiple conditions without nesting'], ['AND / OR', '=IF(AND(A1>10,B1<5),"Yes","No")', 'Combine conditions'], ['IFERROR', '=IFERROR(A1/B1,0)', 'Replace errors with a value'],
  ['COUNTIF', '=COUNTIF(A1:A10,">50")', 'Count cells matching a condition'], ['COUNTIFS', '=COUNTIFS(A:A,"Jaipur",B:B,">1000")', 'Count with multiple conditions'], ['SUMIF', '=SUMIF(A:A,"Delhi",B:B)', 'Sum values matching a condition'], ['SUMIFS', '=SUMIFS(C:C,A:A,"Delhi",B:B,"Jan")', 'Sum with multiple conditions'],
  ['VLOOKUP', '=VLOOKUP(E2,A:C,3,FALSE)', 'Find a value in the first column and return from another'], ['XLOOKUP', '=XLOOKUP(E2,A:A,C:C,"Not found")', 'Modern lookup (any direction)'], ['INDEX + MATCH', '=INDEX(C:C,MATCH(E2,A:A,0))', 'Flexible lookup'], ['HLOOKUP', '=HLOOKUP(A1,A1:F3,2,FALSE)', 'Horizontal lookup'],
  ['TODAY / NOW', '=TODAY()', 'Current date / date-time'], ['DATEDIF', '=DATEDIF(A1,TODAY(),"Y")', 'Years / months / days between dates (age)'], ['EOMONTH', '=EOMONTH(A1,0)', 'Last day of the month'], ['NETWORKDAYS', '=NETWORKDAYS(A1,B1)', 'Working days between two dates'], ['TEXT', '=TEXT(A1,"dd-mmm-yyyy")', 'Format number/date as text'],
  ['CONCAT / TEXTJOIN', '=TEXTJOIN(", ",TRUE,A1:A5)', 'Join text with a separator'], ['LEFT / RIGHT / MID', '=MID(A1,3,4)', 'Extract part of text'], ['LEN', '=LEN(A1)', 'Length of text'], ['TRIM', '=TRIM(A1)', 'Remove extra spaces'], ['UPPER / LOWER / PROPER', '=PROPER(A1)', 'Change text case'], ['SUBSTITUTE', '=SUBSTITUTE(A1,"-","")', 'Replace text'],
  ['ROUND', '=ROUND(A1,2)', 'Round to decimals (ROUNDUP / ROUNDDOWN too)'], ['LARGE / SMALL', '=LARGE(A1:A10,2)', 'Nth largest / smallest'], ['RANK', '=RANK(A1,$A$1:$A$10)', 'Rank of a value'], ['SUMPRODUCT', '=SUMPRODUCT(A1:A5,B1:B5)', 'Multiply and add arrays (qty × rate)'],
  ['PMT', '=PMT(9%/12,60,-1000000)', 'Loan EMI'], ['FV', '=FV(8%/12,120,-5000)', 'Future value of SIP / investment'], ['UNIQUE', '=UNIQUE(A1:A20)', 'List unique values (365/2021+)'], ['FILTER', '=FILTER(A1:C20,B1:B20>100)', 'Filter rows by condition (365/2021+)'], ['SORT', '=SORT(A1:B20,2,-1)', 'Sort a range (365/2021+)'], ['CHOOSE', '=CHOOSE(2,"A","B","C")', 'Pick a value by position'],
  ['Shortcut: Ctrl+Shift+L', 'Ctrl+Shift+L', 'Toggle filter'], ['Shortcut: Alt+=', 'Alt+=', 'AutoSum'], ['Shortcut: Ctrl+T', 'Ctrl+T', 'Create a table']
];
add('office', 'excel-formulas', '📈', 'Excel Formulas', 'Searchable cheat-sheet of the most-used formulas', tableTool(['Function', 'Example', 'Use'], XL, 'Search formulas, e.g. lookup, date, sum…'));

const TPL = [
  { n: 'Leave Application', d: 'Word letter format', ext: 'DOC', go: () => dlDoc('leave-application', 'Leave Application', `<p>Date: [Date]</p><p>To,<br>The [Manager / HR Manager]<br>[Company Name]</p><p><b>Subject: Application for leave</b></p><p>Respected Sir/Madam,</p><p>I, [Your Name], working as [Designation], request you to grant me leave from [Start Date] to [End Date] ([X] days) due to [reason]. I will ensure my pending work is completed before leaving.</p><p>Kindly grant my leave.</p><p>Thanking you,<br>Yours sincerely,<br>[Your Name]<br>[Employee ID]</p>`) },
  { n: 'Resignation Letter', d: 'Word letter format', ext: 'DOC', go: () => dlDoc('resignation-letter', 'Resignation Letter', `<p>Date: [Date]</p><p>To,<br>[Manager Name]<br>[Company Name]</p><p><b>Subject: Resignation from the post of [Designation]</b></p><p>Dear Sir/Madam,</p><p>I hereby tender my resignation from the position of [Designation], effective [Last Working Day] as per my notice period. I am grateful for the opportunities I received and will help in a smooth handover.</p><p>Yours sincerely,<br>[Your Name]<br>[Employee ID]</p>`) },
  { n: 'Experience Certificate', d: 'Word certificate format', ext: 'DOC', go: () => dlDoc('experience-certificate', 'Experience Certificate', `<h2 style="text-align:center">EXPERIENCE CERTIFICATE</h2><p>Date: [Date]</p><p>To whom it may concern,</p><p>This is to certify that <b>[Employee Name]</b> was employed with <b>[Company Name]</b> as <b>[Designation]</b> from [Joining Date] to [Last Working Date]. During this period, his/her conduct and performance were found satisfactory.</p><p>We wish him/her all the best for the future.</p><p><br>Authorised Signatory<br>[Name & Designation]<br>[Company Name]</p>`) },
  { n: 'Salary Certificate', d: 'Word certificate format', ext: 'DOC', go: () => dlDoc('salary-certificate', 'Salary Certificate', `<h2 style="text-align:center">SALARY CERTIFICATE</h2><p>Date: [Date]</p><p>This is to certify that <b>[Employee Name]</b> (Employee ID: [ID]) is employed with [Company Name] as [Designation] since [Joining Date] and draws a gross monthly salary of ₹[Amount] (Rupees [In words] only).</p><p>This certificate is issued on request for [purpose].</p><p><br>Authorised Signatory<br>[Company Name]</p>`) },
  { n: 'Monthly Expense Tracker', d: 'Excel / Google Sheets – with totals', ext: 'CSV', go: () => dlCsv('expense-tracker', [['Date', 'Category', 'Description', 'Payment Mode', 'Amount (₹)'], ...Array.from({ length: 30 }, () => ['', '', '', '', '']), ['', '', '', 'TOTAL', '=SUM(E2:E31)']]) },
  { n: 'Attendance Sheet', d: 'Monthly attendance register with formulas', ext: 'CSV', go: () => dlCsv('attendance-sheet', [['Employee', ...Array.from({ length: 31 }, (_, i) => i + 1), 'Present', 'Absent'], ...Array.from({ length: 15 }, (_, r) => ['', ...Array(31).fill(''), `=COUNTIF(B${r + 2}:AF${r + 2},"P")`, `=COUNTIF(B${r + 2}:AF${r + 2},"A")`])]) },
  { n: 'Monthly Budget Planner', d: 'Income vs expenses with balance', ext: 'CSV', go: () => dlCsv('budget-planner', [['Item', 'Planned (₹)', 'Actual (₹)', 'Difference'], ['Income – Salary', '', '', '=C2-B2'], ['Rent', '', '', '=B3-C3'], ['Food & Groceries', '', '', '=B4-C4'], ['Transport', '', '', '=B5-C5'], ['Bills & Utilities', '', '', '=B6-C6'], ['EMI / Loans', '', '', '=B7-C7'], ['Savings / SIP', '', '', '=B8-C8'], ['Other', '', '', '=B9-C9'], ['TOTAL EXPENSES', '=SUM(B3:B9)', '=SUM(C3:C9)', '=B10-C10'], ['BALANCE', '=B2-B10', '=C2-C10', '']]) },
  { n: 'Invoice Register', d: 'Track invoices, GST and payments', ext: 'CSV', go: () => dlCsv('invoice-register', [['Invoice No', 'Date', 'Customer', 'Taxable Value', 'GST %', 'GST Amount', 'Total', 'Paid?'], ...Array.from({ length: 20 }, (_, r) => ['', '', '', '', '18', `=D${r + 2}*E${r + 2}/100`, `=D${r + 2}+F${r + 2}`, ''])]) }
];
add('office', 'templates', '🗂️', 'Word and Excel Templates', 'Free downloadable letters, certificates and sheets', downloads(TPL));

/* ======================= AI ASSISTANT ======================= */
const TOOLMAP = ['emi', 'gst', 'age', 'salary', 'loan', 'resume-maker', 'interview-questions', 'pdf-tools', 'tr-to-kw', 'cfm', 'btu', 'duct-size', 'excel-formulas', 'number-to-words'];
const INTENTS = [
  [/(hi|hello|hey|namaste|नमस्ते|हेलो)\b/i, 'Namaste! 👋 Main aapki kaise madad kar sakta hoon? Tools, resume, interview ya HVAC – kuch bhi poochhiye.\nHello! How can I help you today?'],
  [/emi|loan|ब्याज|byaj|interest/i, 'EMI / loan nikalne ke liye EMI Calculator use karein – amount, rate aur tenure daalein.\nUse the EMI or Loan Calculator for monthly payments and total interest.', 'emi'],
  [/gst|जीएसटी|tax invoice/i, 'GST add ya remove karne ke liye GST Calculator kholein.\nUse the GST Calculator to add or remove GST.', 'gst'],
  [/age|umar|उम्र|janmdin|birthday/i, 'Apni exact umar jaanne ke liye Age Calculator use karein.\nFind your exact age with the Age Calculator.', 'age'],
  [/salary|ctc|in.?hand|तनख्वाह|vetan/i, 'CTC se in-hand salary ka andaza Salary Calculator se milega.\nEstimate in-hand pay from CTC with the Salary Calculator.', 'salary'],
  [/resume|cv|बायोडाटा|biodata/i, 'Resume Maker me details bharein aur PDF download karein. Tip: 1 page, action verbs aur numbers use karein.\nBuild a resume and save it as PDF.', 'resume-maker'],
  [/interview|इंटरव्यू/i, 'Interview Questions page par HR aur technical sawal-jawab hain; Interview Practice se mock practice karein.\nPractise with Interview Questions and the mock Interview Practice.', 'interview-questions'],
  [/pdf|merge|compress|split/i, 'PDF Tools se images ko PDF banayein, PDFs merge karein ya pages nikaalein.\nUse PDF Tools to create, merge or split PDFs.', 'pdf-tools'],
  [/\btr\b|ton|kw\b|kilowatt|tonnage/i, '1 TR = 3.517 kW = 12,000 BTU/h. Conversion ke liye TR to KW Calculator use karein.', 'tr-to-kw'],
  [/cfm|airflow/i, 'CFM = Area (sq ft) × Velocity (FPM). CFM Calculator me room ke hisaab se bhi nikaal sakte hain.', 'cfm'],
  [/btu|ac size|ac capacity|room cooling/i, 'Room ke hisaab se AC ka size BTU Calculator se nikaalein. Rough rule: ~20 BTU per sq ft.', 'btu'],
  [/duct/i, 'Duct size = CFM ÷ velocity se area nikalti hai. Duct Size Calculator use karein.', 'duct-size'],
  [/excel|formula|vlookup|xlookup/i, 'Excel Formulas page par popular formulas examples ke saath hain – search karein.', 'excel-formulas'],
  [/words|in words|likh/i, 'Number ko words me badalne ke liye Number to Words tool use karein.', 'number-to-words'],
  [/thank|dhanyawad|shukriya|धन्यवाद/i, 'Aapka swagat hai! 😊 You are welcome!'],
  [/hvac|ac\b|air condition/i, 'HVAC tools: TR to KW, CFM, Duct Size, Air Velocity, BTU, BOQ templates aur AutoCAD resources – kis par kaam karna hai?']
];
add('ai', 'ai-chat', '🤖', 'Hindi and English AI Chat', 'Smart assistant that guides you in Hindi & English', el => {
  el.innerHTML = `<div class="card"><div class="chat" id="chat"></div><div class="sugg">${['EMI kaise nikalein?', 'Resume tips', 'What is 1 TR in kW?', 'Interview ki taiyari', '25*12+300'].map(s => `<button>${s}</button>`).join('')}</div>
    <div class="chatin"><input id="msg" placeholder="Hindi ya English me likhiye…" autocomplete="off"><button class="btn" id="send">Send</button></div>
    <p class="note">This is an offline smart assistant (keyword based) that answers common questions and opens the right tool. It does not use an online AI model. You can also type a calculation like <code>2500*18/100</code>.</p></div>`;
  const chat = $('#chat', el);
  const post = (t, c, tool) => { const d = document.createElement('div'); d.className = 'msg ' + c; d.textContent = t; if (tool) { const t0 = TOOLS.find(x => x.id === tool); d.insertAdjacentHTML('beforeend', `\n`); const a = document.createElement('a'); a.href = '#/' + tool; a.textContent = `Open ${t0.name} →`; d.appendChild(a); } chat.appendChild(d); chat.scrollTop = chat.scrollHeight; };
  const answer = q => {
    if (/^[\d\s+\-*/().%]+$/.test(q) && /\d/.test(q)) { try { const r = Function('"use strict";return (' + q.replace(/%/g, '/100') + ')')(); if (isFinite(r)) return ['= ' + inr(r, 6)]; } catch (e) { } }
    for (const it of INTENTS) if (it[0].test(q)) return [it[1], it[2]];
    return ['Mujhe ye poori tarah samajh nahi aaya. Aap tools ke baare me poochh sakte hain – jaise EMI, GST, resume, interview, TR/CFM/BTU ya Excel formulas.\nI did not fully understand. Try asking about EMI, GST, resume, interview, TR/CFM/BTU or Excel formulas.'];
  };
  const send = txt => { const q = (txt ?? $('#msg', el).value).trim(); if (!q) return; post(q, 'u'); $('#msg', el).value = ''; const a = answer(q); setTimeout(() => post(a[0], 'b', a[1]), 250); };
  post('Namaste! 👋 Main PJ Tools assistant hoon. Hindi ya English me poochhiye.\nHi! Ask me about calculators, resumes, interviews or HVAC.', 'b');
  $('#send', el).onclick = () => send(); $('#msg', el).addEventListener('keydown', e => e.key === 'Enter' && send());
  $$('.sugg button', el).forEach(b => b.onclick = () => send(b.textContent));
});

const VERBS = ['achieved', 'managed', 'led', 'designed', 'developed', 'implemented', 'improved', 'reduced', 'increased', 'delivered', 'created', 'executed', 'optimized', 'coordinated', 'launched', 'analyzed', 'negotiated', 'trained', 'streamlined', 'supervised', 'installed', 'commissioned', 'estimated', 'planned', 'built', 'resolved', 'handled', 'prepared'];
const WEAK = [['responsible for', 'managed / led / handled'], ['worked on', 'developed / executed / built'], ['hard-?working', 'show it with an achievement instead'], ['team player', 'show a real teamwork example'], ['good communication', 'give an example (presented to X, trained Y people)'], ['etc\\b', 'be specific – list the items'], ['various', 'be specific – name them'], ['helped', 'supported / enabled / contributed to (add the result)']];
add('ai', 'resume-improvement', '🚀', 'Resume Improvement', 'Paste your resume text and get a score with suggestions', el => {
  el.innerHTML = `<div class="card"><label class="fld"><span>Paste your resume text here</span><textarea id="rt" rows="12" placeholder="Paste the full text of your resume…"></textarea></label><div class="row"><button class="btn" id="an">Analyse Resume</button></div></div><div id="rout"></div>`;
  $('#an', el).onclick = () => {
    const t = $('#rt', el).value.trim(); if (t.length < 80) return $('#rout', el).innerHTML = `<div class="card">${bad('Please paste your resume (at least a few lines).')}</div>`;
    const low = t.toLowerCase(), words = t.split(/\s+/).length, tips = [], good = []; let score = 100;
    const chk = (c, bd, g, pen) => { if (c) good.push(g); else { tips.push(bd); score -= pen; } };
    chk(/[\w.+-]+@[\w-]+\.[\w.]+/.test(t), 'Add a professional email address.', 'Email found', 8);
    chk(/(\+?\d[\d\s-]{8,})/.test(t), 'Add a phone number.', 'Phone number found', 6);
    chk(/summary|objective|profile/.test(low), 'Add a short Professional Summary at the top.', 'Summary section present', 8);
    chk(/experience|employment|work history/.test(low) || /internship/.test(low), 'Add a Work Experience section (or internships/projects for freshers).', 'Experience section present', 12);
    chk(/education|degree|b\.?tech|diploma|b\.?com|mba|bachelor|master/.test(low), 'Add an Education section.', 'Education section present', 8);
    chk(/skills/.test(low), 'Add a dedicated Skills section with keywords.', 'Skills section present', 8);
    chk(words >= 200 && words <= 800, words < 200 ? `Resume is short (${words} words). Add more detail about achievements.` : `Resume is long (${words} words). Trim to the most relevant 1–2 pages.`, `Good length (${words} words)`, 8);
    const verbs = VERBS.filter(v => low.includes(v)).length; chk(verbs >= 5, `Use more action verbs (found ${verbs}). Try: ${VERBS.slice(0, 8).join(', ')}.`, `Strong action verbs used (${verbs})`, 10);
    const nums = (t.match(/\d+\s?%|₹\s?\d|\$\s?\d|\b\d{2,}\+?\b/g) || []).length; chk(nums >= 4, 'Add measurable results – numbers, percentages, cost saved, projects handled.', 'Contains measurable results', 12);
    chk(/^[\s]*[-•*●▪]/m.test(t), 'Use bullet points for responsibilities and achievements.', 'Uses bullet points', 5);
    chk(!/\bI\b|\bmy\b/i.test(t.replace(/\bI\.T\b/g, '')), 'Avoid first-person words ("I", "my") – write in implied first person.', 'No first-person pronouns', 5);
    const weak = WEAK.filter(w => new RegExp(w[0], 'i').test(t)); weak.forEach(w => { tips.push(`Replace the phrase "${w[0].replace('\\b', '').replace('-?', '-')}" → ${w[1]}.`); score -= 3; });
    score = Math.max(20, Math.min(100, score));
    $('#rout', el).innerHTML = `<div class="card">${res([['Resume Score', score + ' / 100', 1], ['Words', words], ['Action verbs', verbs], ['Numbers / metrics', nums]])}</div>
      <div class="card"><h3>Suggestions to improve</h3>${tips.length ? ul(tips) : '<p>Great job – no major issues found!</p>'}</div><div class="card"><h3>What is already good</h3>${ul(good.length ? good : ['—'])}</div>`;
  };
});

function emailBody(type, tone, lang, v) {
  const F = tone === 'formal';
  const g = F ? `Dear ${v.to || 'Sir/Madam'},` : `Hi ${v.to || 'there'},`, c = F ? 'Yours sincerely,' : 'Thanks & regards,', d = v.det ? v.det : '[details]';
  if (lang === 'hi') {
    const gh = F ? `आदरणीय ${v.to || 'महोदय/महोदया'},` : `नमस्ते ${v.to || ''},`, ch = F ? 'सादर,' : 'धन्यवाद,';
    const H = {
      leave: [`अवकाश हेतु आवेदन`, `मैं अपने कार्य से संबंधित कारण (${d}) के लिए अवकाश लेना चाहता/चाहती हूँ। कृपया मेरा अवकाश स्वीकृत करने का कष्ट करें। मैं अपना लंबित कार्य समय पर पूर्ण कर दूँगा/दूँगी।`],
      resign: [`त्यागपत्र`, `मैं अत्यंत विनम्रता के साथ सूचित करता/करती हूँ कि मैं अपने पद से त्यागपत्र देना चाहता/चाहती हूँ। (${d}). कृपया नोटिस अवधि के अनुसार मेरा त्यागपत्र स्वीकार करें। इस अवसर के लिए मैं आपका आभारी/आभारी हूँ।`],
      thanks: [`धन्यवाद`, `आपके सहयोग और समय के लिए हृदय से धन्यवाद। ${d}`],
      pay: [`भुगतान अनुस्मारक`, `यह एक विनम्र अनुस्मारक है कि हमारा बकाया भुगतान (${d}) अभी लंबित है। कृपया शीघ्र भुगतान करने का कष्ट करें। यदि भुगतान हो चुका है तो कृपया इस संदेश को अनदेखा करें।`],
      meet: [`बैठक का अनुरोध`, `मैं आपसे बैठक करना चाहता/चाहती हूँ। विषय: ${d}. कृपया अपनी सुविधानुसार समय बताएँ।`]
    };
    if (H[type]) return `विषय: ${H[type][0]}\n\n${gh}\n\n${H[type][1]}\n\n${ch}\n${v.from || '[आपका नाम]'}`;
  }
  const B = {
    leave: [`Leave request`, `I would like to request leave for ${d}. I will complete my pending tasks and ensure a smooth handover before I leave. Kindly approve my request.`],
    resign: [`Resignation`, `I am writing to formally resign from my position${d !== '[details]' ? ' (' + d + ')' : ''}. I will serve my notice period and ensure a smooth handover. Thank you for the opportunities and support.`],
    follow: [`Follow-up`, `I am following up regarding ${d}. I would appreciate an update at your earliest convenience. Please let me know if you need anything further from my side.`],
    apply: [`Job application`, `I am writing to apply for ${d}. I have relevant skills and experience and am confident I can add value to your team. Please find my resume attached; I would welcome the chance to discuss further.`],
    meet: [`Meeting request`, `I would like to schedule a meeting to discuss ${d}. Please let me know a convenient date and time.`],
    thanks: [`Thank you`, `Thank you very much for ${d}. I truly appreciate your time and support.`],
    complaint: [`Complaint regarding service`, `I am writing to bring to your attention an issue: ${d}. I request you to look into it and resolve it at the earliest. I look forward to your prompt response.`],
    hike: [`Salary review request`, `I would like to request a review of my compensation, considering ${d}. I am happy to discuss this at your convenience.`],
    pay: [`Payment reminder`, `This is a gentle reminder that the payment of ${d} is still pending. Kindly arrange it at the earliest. Please ignore this if already paid.`]
  };
  const b = B[type];
  return `Subject: ${b[0]}\n\n${g}\n\n${b[1]}\n\n${c}\n${v.from || '[Your Name]'}`;
}
add('ai', 'email-writing', '📧', 'Email Writing', 'Generate a ready-to-send email in English or Hindi', C({
  fields: [
    { id: 'type', label: 'Email type', type: 'select', value: 'leave', options: [['leave', 'Leave request'], ['resign', 'Resignation'], ['follow', 'Follow-up'], ['apply', 'Job application'], ['meet', 'Meeting request'], ['thanks', 'Thank you'], ['complaint', 'Complaint'], ['hike', 'Salary review'], ['pay', 'Payment reminder']] },
    { id: 'tone', label: 'Tone', type: 'select', value: 'formal', options: [['formal', 'Formal'], ['friendly', 'Friendly']] },
    { id: 'lang', label: 'Language', type: 'select', value: 'en', options: [['en', 'English'], ['hi', 'हिंदी (Hindi)']] },
    { id: 'to', label: 'Recipient name', value: '' }, { id: 'from', label: 'Your name', value: '' },
    { id: 'det', label: 'Key details (dates, reason, subject…)', type: 'textarea', rows: 2, wide: 1, value: '2 days (20–21 Nov) due to a family function' }
  ],
  calc: v => {
    const t = emailBody(v.type, v.tone, v.lang, v);
    window._lastEmail = t;
    return `<div class="copybox">${esc(t)}</div><div class="row"><button class="btn sm" onclick="copy(window._lastEmail)">Copy email</button><a class="btn ghost sm" href="mailto:?subject=${encodeURIComponent((t.match(/^(?:Subject|विषय): (.*)/) || [])[1] || '')}&body=${encodeURIComponent(t.replace(/^(?:Subject|विषय): .*\n\n/, ''))}">Open in mail app</a></div>${v.lang === 'hi' && !/^विषय/.test(t) ? '<p class="note">Hindi version is available for leave, resignation, thanks, payment and meeting emails – other types are shown in English.</p>' : ''}`;
  }
}));

function summarize(t, n = 3) {
  const S = t.replace(/\s+/g, ' ').match(/[^.!?।]+[.!?।]*/g) || []; if (S.length <= n) return S.join(' ').trim();
  const stop = new Set('the a an is are was were of to in and or for on with as by at it this that be from has have had not but i you we they he she'.split(' ')), f = {};
  t.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.forEach(w => { if (!stop.has(w) && w.length > 2) f[w] = (f[w] || 0) + 1; });
  const sc = S.map((s, i) => [i, (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).reduce((a, w) => a + (f[w] || 0), 0) / Math.sqrt((s.match(/\S+/g) || [1]).length)]);
  return sc.sort((a, b) => b[1] - a[1]).slice(0, n).map(x => x[0]).sort((a, b) => a - b).map(i => S[i].trim()).join(' ');
}
add('ai', 'document-assistant', '📑', 'Document Assistance', 'Word count, cleanup, case change, summary & keywords', el => {
  el.innerHTML = `<div class="card"><label class="fld"><span>Paste your text</span><textarea id="dt" rows="10" placeholder="Paste or type your document text here…"></textarea></label>
    <div class="row"><button class="btn sm" data-a="clean">Clean extra spaces</button><button class="btn sm" data-a="dedupe">Remove duplicate lines</button><button class="btn sm" data-a="upper">UPPERCASE</button><button class="btn sm" data-a="lower">lowercase</button><button class="btn sm" data-a="title">Title Case</button><button class="btn sm" data-a="sort">Sort lines A–Z</button><button class="btn ghost sm" data-a="copy">Copy text</button></div></div><div id="dout"></div>`;
  const ta = $('#dt', el), out = $('#dout', el);
  const stats = () => {
    const t = ta.value, w = (t.match(/\S+/g) || []), sen = (t.match(/[^.!?।]+[.!?।]+/g) || []).length || (t.trim() ? 1 : 0);
    const f = {}; const stop = new Set('the a an is are was were of to in and or for on with as by at it this that be from has have had not but you we they he she his her their our your its'.split(' '));
    t.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.forEach(x => { if (!stop.has(x) && x.length > 3) f[x] = (f[x] || 0) + 1; });
    const kw = Object.entries(f).sort((a, b) => b[1] - a[1]).slice(0, 10);
    out.innerHTML = `<div class="card">${res([['Words', inr(w.length, 0)], ['Characters', inr(t.length, 0)], ['Sentences', sen], ['Paragraphs', (t.trim() ? t.trim().split(/\n\s*\n/).length : 0)], ['Reading time', Math.max(w.length ? 1 : 0, Math.round(w.length / 200)) + ' min']])}</div>
      ${w.length > 40 ? `<div class="card"><h3>Quick summary</h3><p style="margin:0">${esc(summarize(t))}</p></div>` : ''}
      ${kw.length ? `<div class="card"><h3>Top keywords</h3>${kw.map(k => `<span class="chip">${esc(k[0])} · ${k[1]}</span>`).join('')}</div>` : ''}`;
  };
  ta.addEventListener('input', stats);
  $$('[data-a]', el).forEach(b => b.onclick = () => {
    const a = b.dataset.a, t = ta.value; if (a === 'copy') return copy(t);
    ta.value = { clean: t.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim(), dedupe: [...new Set(t.split('\n'))].join('\n'), upper: t.toUpperCase(), lower: t.toLowerCase(), title: t.toLowerCase().replace(/(^|\s)\S/g, s => s.toUpperCase()), sort: t.split('\n').sort((x, y) => x.localeCompare(y)).join('\n') }[a]; stats();
  });
  stats();
});

const IQ = {
  'HR / General': ['Tell me about yourself.', 'Why should we hire you?', 'What are your strengths and weaknesses?', 'Why do you want to leave your current job?', 'Where do you see yourself in 5 years?', 'What are your salary expectations?', 'Why do you want to work for our company?', 'Do you have any questions for us?'],
  'Behavioural (STAR)': ['Describe a time you handled a conflict at work.', 'Tell me about a time you missed a deadline.', 'Give an example of a goal you achieved and how.', 'Describe a time you showed leadership.', 'How do you handle criticism?'],
  'HVAC / Engineering': ['Explain the refrigeration cycle.', 'How do you size a duct for 2000 CFM?', 'What is the difference between chilled water and VRF systems?', 'How do you calculate cooling load of a room?', 'What is static pressure and why does it matter?', 'What is COP and how do you improve system efficiency?'],
  'Banking / Sales': ['What is KYC and why is it important?', 'How would you sell a savings account to a new customer?', 'What is the difference between repo rate and reverse repo?', 'How will you achieve your monthly target?'],
  'BPO / Customer Service': ['How will you handle an angry customer?', 'Are you comfortable with night shifts?', 'What does good customer service mean to you?', 'How do you handle a call you cannot resolve?']
};
add('ai', 'interview-practice', '🎯', 'Interview Practice', 'Random questions, 2-minute timer and answer notes', el => {
  el.innerHTML = `<div class="card"><div class="form"><label class="fld"><span>Category</span><select id="cat">${Object.keys(IQ).map(k => `<option>${k}</option>`).join('')}</select></label></div>
    <div style="margin:20px 0"><div class="note" style="margin:0">Question</div><h3 id="q" style="font-size:1.25rem;margin:4px 0 0">Press "Next question" to begin</h3></div>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><span class="timer" id="tm">02:00</span><button class="btn" id="nx">Next question</button><button class="btn ghost" id="st">Start timer</button></div>
    <label class="fld" style="margin-top:16px"><span>Type your answer (practice aloud, then write key points)</span><textarea id="ans" rows="6"></textarea></label><div class="note" id="wc">0 words</div></div>
    <div class="card"><h3>Answer framework</h3>${ul(['<b>S</b>ituation – set the context briefly', '<b>T</b>ask – what was your responsibility?', '<b>A</b>ction – what exactly did YOU do?', '<b>R</b>esult – outcome with numbers if possible'])}</div>`;
  let sec = 120, tid = null; const tm = $('#tm', el);
  const show = () => tm.textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  const stop = () => { clearInterval(tid); tid = null; $('#st', el).textContent = 'Start timer'; };
  CLEANUP = stop;
  $('#nx', el).onclick = () => { const l = IQ[$('#cat', el).value]; $('#q', el).textContent = l[Math.floor(Math.random() * l.length)]; stop(); sec = 120; show(); $('#ans', el).value = ''; $('#wc', el).textContent = '0 words'; };
  $('#st', el).onclick = () => { if (tid) return stop(); $('#st', el).textContent = 'Pause'; tid = setInterval(() => { sec--; show(); if (sec <= 0) { stop(); toast('Time up! ⏰'); } }, 1000); };
  $('#ans', el).addEventListener('input', e => $('#wc', el).textContent = (e.target.value.match(/\S+/g) || []).length + ' words');
});
