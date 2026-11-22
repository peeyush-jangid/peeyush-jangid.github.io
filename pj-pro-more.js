/* ===== PJ Pro – more variety for Practice Tests =====
   1) Generators that build fresh MCQs from the live command tables (AutoCAD, Excel, Word, PowerPoint)
   2) Extra static questions for the bank-based tools. Load AFTER pj-pro-learn.js */
(function () {
  const PJ = window.PJ, D = window.PJD, G = PJ.G, GEN = PJ.GEN, shuffle = PJ.shuffle, pick = PJ.pick, rnd = PJ.rnd;
  const four = (ok, pool) => { const s = new Set([ok]); let g = 0; while (s.size < 4 && g++ < 80 && pool.length) s.add(pool[rnd(0, pool.length - 1)]); const o = shuffle([...s]); return o; };
  const mcq = (q, ok, pool, e) => { const o = four(ok, pool); return { t: 'mcq', q, o, a: o.indexOf(ok), e: e || '' }; };
  const clean = s => String(s).trim();

  /* generic table → question (rows: [a, b, c]) */
  function tableQ(rows, kinds) {
    const R = rows.filter(r => r && r[0] && r[1]); if (R.length < 6) return null;
    const r = pick(R), k = pick(kinds), other = f => R.filter(x => x !== r && f(x) !== f(r)).map(f);
    return k(r, other);
  }

  /* ---- AutoCAD (rows: alias, command, what it does) ---- */
  G.autocad = () => tableQ(ACAD, [
    (r, o) => mcq(`AutoCAD: which command starts with the alias “${r[0]}”?`, r[1], o(x => x[1]), `${r[0]} = ${r[1]} – ${r[2]}.`),
    (r, o) => mcq(`What is the shortcut (alias) for the ${r[1]} command?`, r[0], o(x => x[0]), `${r[1]} → ${r[0]}. ${r[2]}.`),
    (r, o) => mcq(`Which AutoCAD command is used to: ${r[2].toLowerCase()}?`, r[1], o(x => x[1]), `${r[1]} (${r[0]}) – ${r[2]}.`),
    (r, o) => mcq(`What does the command alias “${r[0]}” do in AutoCAD?`, r[2], o(x => x[2]), `${r[0]} = ${r[1]}.`)
  ]);

  /* ---- Excel: table-driven + computed ---- */
  const WORDS = ['Peeyush', 'Jaipur', 'Climatech', 'Spreadsheet', 'Engineer', 'Formula', 'Kitchen', 'Database', 'Report', 'Student'];
  const numOpts = v => { const s = new Set([v]); [v + 1, v - 1, v + 10, v * 2, v - 5, v + 3].forEach(x => { if (s.size < 4 && x !== v) s.add(x); }); return shuffle([...s]); };
  G['excel-formulas'] = () => {
    const k = rnd(0, 6);
    if (k <= 2) { const q = tableQ(XL, [
      (r, o) => mcq(`Which Excel function/formula: ${r[2].toLowerCase()}?`, r[0], o(x => x[0]), `${r[0]} – e.g. ${r[1]}`),
      (r, o) => mcq(`What does the formula ${r[1]} do?`, r[2], o(x => x[2]), `${r[0]}: ${r[2]}.`)]); if (q) return q; }
    if (k === 3) { const a = Array.from({ length: 5 }, () => rnd(2, 40)), f = pick(['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT']); let v; if (f === 'SUM') v = a.reduce((x, y) => x + y, 0); else if (f === 'AVERAGE') { v = Math.round(a.reduce((x, y) => x + y, 0) / 5 * 100) / 100; } else if (f === 'MAX') v = Math.max(...a); else if (f === 'MIN') v = Math.min(...a); else v = 5;
      const o = numOpts(v); return { t: 'mcq', q: `Cells A1:A5 contain ${a.join(', ')}. What does =${f}(A1:A5) return?`, o: o.map(String), a: o.indexOf(v), e: `${f} of those 5 numbers = ${v}.` }; }
    if (k === 4) { const w = pick(WORDS), n = rnd(2, 4), f = pick(['LEFT', 'RIGHT', 'LEN', 'UPPER']); let v = f === 'LEFT' ? w.slice(0, n) : f === 'RIGHT' ? w.slice(-n) : f === 'LEN' ? String(w.length) : w.toUpperCase();
      const pool = [w.slice(0, n), w.slice(-n), String(w.length), w.toUpperCase(), w.toLowerCase(), w.slice(1, n + 1), String(w.length + 1)]; const o = four(v, pool);
      return { t: 'mcq', q: `A1 contains “${w}”. What does =${f}(A1${f === 'LEN' || f === 'UPPER' ? '' : ',' + n}) return?`, o, a: o.indexOf(v), e: `${f} applied to “${w}” gives ${v}.` }; }
    if (k === 5) { const th = pick([35, 40, 50, 60]), val = rnd(20, 80), v = val >= th ? 'Pass' : 'Fail'; return { t: 'mcq', q: `A1 = ${val}. What does =IF(A1>=${th},"Pass","Fail") return?`, o: shuffle(['Pass', 'Fail', 'TRUE', 'Error']), a: -1, e: `${val} ${val >= th ? '≥' : '<'} ${th} → ${v}.`, _ok: v }; }
    const arr = Array.from({ length: 6 }, () => rnd(1, 9)), t = pick(arr), c = arr.filter(x => x === t).length, o = numOpts(c);
    return { t: 'mcq', q: `A1:A6 contain ${arr.join(', ')}. What does =COUNTIF(A1:A6,${t}) return?`, o: o.map(String), a: o.indexOf(c), e: `${t} appears ${c} time(s).` };
  };
  /* fix the IF question (answer index needs the shuffled order) */
  const _ex = G['excel-formulas']; G['excel-formulas'] = () => { const q = _ex(); if (q && q.a === -1) { q.a = q.o.indexOf(q._ok); delete q._ok; } return q; };

  /* ---- Word / PowerPoint commands ---- */
  function office(app, cmds) {
    return () => { const R = cmds.map(r => [r[1], r[2]]); const k = rnd(0, 1);
      return tableQ(R, [
        (r, o) => mcq(`${app}: which shortcut/command does this? “${r[1]}”`, r[0], o(x => x[0]), `${r[0]} → ${r[1]}.`),
        (r, o) => mcq(`${app}: what does “${r[0]}” do?`, r[1], o(x => x[1]), `${r[0]} → ${r[1]}.`)
      ].slice(k, k + 1).concat([])); };
  }
  G['word-commands'] = office('MS Word', D.word.cmds); G['ppt-commands'] = office('MS PowerPoint', D.ppt.cmds);

  ['autocad', 'excel-formulas', 'word-commands', 'ppt-commands'].forEach(id => { GEN[id] = [id]; });

  /* ---- extra static questions for bank-based tools ---- */
  const add = (k, arr) => { D.MCQ[k] = (D.MCQ[k] || []).concat(arr); };
  add('hr', [
    ['Which is the best way to answer “Where do you see yourself in 5 years?”', ['I want your job', 'Growing in this field with more responsibility and skills', 'I have no idea', 'Running my own company abroad'], 1, 'Show growth aligned with the role.'],
    ['What should you do if you do not understand an interview question?', ['Guess quickly', 'Ask politely for clarification', 'Stay silent', 'Change the topic'], 1, 'Clarifying shows maturity.'],
    ['Best time to reach the interview venue?', ['After the scheduled time', '10–15 minutes early', '1 hour early', 'Exactly at the time'], 1, 'Early but not too early.'],
    ['Which dress style suits most corporate interviews?', ['Party wear', 'Neat formal / smart business attire', 'Torn jeans', 'Sportswear'], 1, 'First impressions matter.'],
    ['If asked about a gap in your career, you should…', ['Hide it', 'Explain honestly and mention what you learnt or did', 'Blame the market', 'Change the dates'], 1, 'Honesty plus upskilling.'],
    ['“Tell me about a conflict at work.” Which answer is best?', ['Blame the colleague', 'Explain the issue, your calm action and the positive result', 'Say you never had one', 'Say you quit'], 1, 'Use STAR and stay positive.'],
    ['What does a recruiter check first on a call?', ['Your hobbies', 'Communication, availability and basic fit', 'Your photos', 'Your age only'], 1, 'Screening round.'],
    ['After the interview you should…', ['Argue about the result', 'Send a short thank-you message', 'Call 10 times a day', 'Do nothing ever'], 1, 'A polite follow-up leaves a good impression.']
  ]);
  add('banking', [
    ['SLR stands for…', ['Statutory Liquidity Ratio', 'Standard Loan Rate', 'Special Lending Reserve', 'Savings Liquidity Rule'], 0, 'Banks must keep a share of deposits in liquid assets.'],
    ['CRR is maintained with…', ['SEBI', 'RBI', 'IRDAI', 'NABARD'], 1, 'Cash Reserve Ratio is kept with the RBI.'],
    ['Which card is linked directly to your bank balance?', ['Credit card', 'Debit card', 'Store card', 'Gift voucher'], 1, 'Debit card spends your own money.'],
    ['UPI was developed by…', ['NPCI', 'SEBI', 'IRDAI', 'ISRO'], 0, 'National Payments Corporation of India.'],
    ['The maximum IMPS/UPI amount depends on…', ['Only the weather', 'Bank and NPCI limits', 'Nothing', 'Only the branch manager'], 1, 'Limits are set per bank/NPCI rules.'],
    ['“Lien” on a deposit means…', ['A bonus', 'Bank’s right to hold the deposit against dues', 'A new account', 'Free interest'], 1, 'Deposit marked as security.'],
    ['FD stands for…', ['Fixed Deposit', 'Fast Debit', 'Final Draft', 'Fund Draw'], 0, 'Money kept for a fixed term at a fixed rate.'],
    ['Which of these is a KYC red flag?', ['Documents match the person', 'Mismatched name or forged-looking document', 'Valid Aadhaar', 'Recent photo'], 1, 'Mismatch must be escalated.'],
    ['Which insurance gives pure life cover with no maturity benefit?', ['Term plan', 'Endowment', 'ULIP', 'Money-back'], 0, 'Term insurance is pure protection.'],
    ['What does MCLR relate to?', ['Loan interest benchmark', 'Credit card limit', 'Locker rent', 'Cheque clearing time'], 0, 'Marginal Cost of Funds based Lending Rate.']
  ]);
  add('kyc', [
    ['What does CRM stand for?', ['Customer Relationship Management', 'Call Rate Meter', 'Customer Record Menu', 'Central Ring Mode'], 0, 'Software that stores customer interactions.'],
    ['What is a good greeting at the start of a call?', ['Yes?', 'Thank you for calling – how may I help you?', 'Hmm', 'Say fast'], 1, 'Be polite, clear and welcoming.'],
    ['A customer asks for something against policy. You should…', ['Break the policy', 'Explain politely and offer alternatives', 'Disconnect', 'Argue'], 1, 'Stay within policy but be helpful.'],
    ['What is an escalation?', ['Passing an unresolved issue to a senior/team', 'Ending the call', 'A bonus', 'A holiday'], 0, 'Done with full notes.'],
    ['Which is a sign of active listening?', ['Interrupting', 'Summarising the problem back to the customer', 'Typing something else', 'Long silence'], 1, 'Confirms understanding.'],
    ['TAT in customer support means…', ['Turn Around Time', 'Total Account Tax', 'Talk And Type', 'Time After Talk'], 0, 'Time promised to resolve a request.'],
    ['Why must you never share OTP or passwords?', ['It is allowed', 'It protects customers from fraud', 'It is rude', 'No reason'], 1, 'Security and compliance.'],
    ['Which is a good way to calm a frustrated customer?', ['Say calm down', 'Acknowledge feelings and promise a clear next step', 'Transfer immediately', 'Ignore'], 1, 'Empathy first.']
  ]);
  add('resume', [
    ['Which section should come first on a fresher’s resume after the header?', ['Hobbies', 'Summary / Education', 'References', 'Declaration'], 1, 'Lead with the strongest relevant info.'],
    ['How many fonts should a resume use?', ['5 or more', '1–2 simple fonts', 'Only decorative fonts', 'None'], 1, 'Consistency and readability.'],
    ['Which is a strong action verb?', ['Responsible for', 'Led', 'Was in', 'Tried'], 1, 'Start bullets with verbs like Led, Built, Reduced.'],
    ['Should you add “References available on request”?', ['Yes always', 'Not necessary', 'Only in red', 'In every line'], 1, 'It wastes space.'],
    ['Best way to tailor a resume to a job?', ['Send one copy to all', 'Match keywords from the job description honestly', 'Copy someone’s resume', 'Add false skills'], 1, 'Helps ATS and recruiters.'],
    ['Which is a measurable result?', ['Improved performance', 'Cut report time from 4 hours to 1 hour', 'Worked hard', 'Very good'], 1, 'Numbers prove impact.'],
    ['Which date format is best?', ['Mixed formats', 'One consistent format e.g. Jan 2023 – Mar 2024', 'No dates', 'Only years in words'], 1, 'Consistency.'],
    ['File name for your resume should be…', ['final_final2', 'FirstName_LastName_Resume.pdf', 'abc', 'new'], 1, 'Professional and searchable.']
  ]);
  add('email', [
    ['“Reply All” should be used when…', ['Always', 'Everyone needs the information', 'Never', 'You want to annoy people'], 1, 'Avoid inbox clutter.'],
    ['Which tone suits a formal email?', ['Slang', 'Polite, clear and concise', 'ALL CAPS', 'Emojis only'], 1, 'Professional tone.'],
    ['An attachment is mentioned in the mail. You should…', ['Forget to attach', 'Double-check it is attached before sending', 'Send twice', 'Skip'], 1, 'Common mistake.'],
    ['Best subject for a leave request?', ['Hi', 'Leave Request – 25 to 27 Nov', 'URGENT!!!', 'Please read'], 1, 'Specific and short.'],
    ['What is BCC?', ['Hidden copy to recipients', 'Back copy', 'Basic cc', 'Black copy'], 0, 'Other recipients cannot see BCC addresses.'],
    ['How long should a business email be?', ['As short as possible while clear', 'Five pages', 'One word', 'Only a link'], 0, 'Respect the reader’s time.']
  ]);
  add('gst', [
    ['HSN code is used for…', ['Services', 'Classifying goods', 'Employees', 'Loans'], 1, 'SAC is for services.'],
    ['GSTR-3B is…', ['Monthly summary return with tax payment', 'Annual report', 'Salary slip', 'Bank statement'], 0, 'Summary return.'],
    ['E-way bill is needed for…', ['Movement of goods above the limit', 'Salary', 'Bank deposit', 'Software license'], 0, 'Goods transport.'],
    ['Which GST rate slab exists?', ['5%', '7%', '9%', '11%'], 0, 'Common slabs: 0, 5, 12, 18, 28%.'],
    ['Composition scheme is for…', ['Small taxpayers with a simpler return', 'Large exporters only', 'Banks', 'Governments'], 0, 'Pays tax at a fixed % of turnover.']
  ]);
  add('finance', [
    ['Net profit =', ['Revenue − all expenses', 'Revenue + expenses', 'Assets − cash', 'Only sales'], 0, 'After all costs and taxes.'],
    ['A person invests ₹10,000 at 10% simple interest for 2 years. Interest is…', ['₹1,000', '₹2,000', '₹2,100', '₹1,200'], 1, 'SI = PRT/100 = 10000×10×2/100.'],
    ['Which is an asset?', ['Loan taken', 'Cash in bank', 'Salary payable', 'Outstanding rent'], 1, 'Assets are owned resources.'],
    ['Gross salary minus deductions gives…', ['CTC', 'Net (take-home) salary', 'Basic', 'HRA'], 1, 'Take-home pay.'],
    ['Which reduces taxable income in India (old regime)?', ['80C investments like PPF/ELSS', 'Buying a TV', 'Eating out', 'Mobile recharge'], 0, 'Section 80C up to ₹1.5 lakh.']
  ]);
  add('hvac', [
    ['Superheat is…', ['Temperature above saturation at the evaporator outlet', 'Heat in the compressor', 'Room temperature', 'Condenser fan speed'], 0, 'Indicates refrigerant charge/feed.'],
    ['A TXV/expansion device is used to…', ['Reduce refrigerant pressure and control flow', 'Clean air', 'Increase voltage', 'Heat water'], 0, 'Meters refrigerant into the evaporator.'],
    ['Which instrument measures airflow velocity in a duct?', ['Anemometer', 'Megger', 'Thermostat', 'Hygrometer only'], 0, 'Used in testing & balancing.'],
    ['Fresh air requirement is mainly to…', ['Provide oxygen and dilute CO₂/contaminants', 'Heat the room', 'Increase noise', 'Cool the compressor'], 0, 'ASHRAE 62.1 ventilation.'],
    ['Condensate drain slope should be…', ['Uphill', 'Downward in the flow direction', 'Zero', 'Random'], 1, 'Water drains by gravity.'],
    ['Which fits a chilled-water system?', ['AHU/FCU with chiller', 'Only window AC', 'Hand pump', 'Gas stove'], 0, 'Water carries cooling to the coils.'],
    ['The psychrometric chart shows…', ['Air temperature, humidity and enthalpy relationships', 'Duct colours', 'Salary', 'Wind direction'], 0, 'Used in load and coil calculations.'],
    ['Sensible heat changes…', ['Dry-bulb temperature', 'Only humidity', 'Only pressure', 'Colour'], 0, 'Latent heat changes moisture content.']
  ]);
  add('excel-formulas', [
    ['Which function returns today’s date?', ['NOW()', 'TODAY()', 'DATE()', 'DAY()'], 1, 'NOW also gives the time.'],
    ['Which key edits the selected cell?', ['F2', 'F7', 'F9', 'F11'], 0, 'F2 = edit; F11 = chart; F9 = calculate.'],
    ['What does Ctrl+; do?', ['Insert current date', 'Insert time', 'Save', 'Find'], 0, 'Ctrl+Shift+; inserts the time.'],
    ['Which function ignores errors by returning a custom value?', ['IFERROR', 'ISERR', 'ERROR', 'TRYIT'], 0, 'IFERROR(value, value_if_error).']
  ]);
})();
