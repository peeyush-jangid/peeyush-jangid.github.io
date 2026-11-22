/* ===== PJ Pro – data: practice MCQ banks per tool + resume fields =====
   MCQ item = [question, [options], correctIndex, explanation] */
window.PJD = window.PJD || {};
PJD.MCQ = {
  'excel-formulas': [
    ['Which function adds numbers that meet a condition?', ['SUM', 'SUMIF', 'COUNT', 'ADDIF'], 1, 'SUMIF(range, criteria, sum_range).'],
    ['Which formula looks up a value and can search left or right?', ['VLOOKUP', 'HLOOKUP', 'XLOOKUP', 'LOOKUPLEFT'], 2, 'XLOOKUP replaces VLOOKUP/HLOOKUP.'],
    ['What does =IF(A1>=40,"Pass","Fail") return when A1 is 35?', ['Pass', 'Fail', '35', 'Error'], 1, '35 is not ≥ 40.'],
    ['Shortcut to make a reference absolute ($A$1)?', ['F2', 'F4', 'F5', 'F9'], 1, 'F4 cycles through absolute/relative references.'],
    ['COUNTA counts…', ['Only numbers', 'Non-empty cells', 'Only text', 'Only blanks'], 1, 'COUNT = numbers; COUNTA = any non-empty.'],
    ['Which function removes extra spaces from text?', ['CLEAN', 'TRIM', 'PROPER', 'LEN'], 1, 'TRIM removes leading, trailing and double spaces.'],
    ['=LEFT("Peeyush",3) returns…', ['Pee', 'yush', 'Pe', 'Peey'], 0, 'First 3 characters.'],
    ['Which shortcut inserts the current date?', ['Ctrl+;', 'Ctrl+:', 'Ctrl+D', 'Alt+D'], 0, 'Ctrl+; = date, Ctrl+Shift+; = time.'],
    ['Pivot Table is used to…', ['Summarise large data', 'Print pages', 'Check spelling', 'Insert pictures'], 0, 'Insert → PivotTable.'],
    ['Which function returns the highest value?', ['TOP', 'MAX', 'HIGH', 'LARGEST1'], 1, 'MAX(range).'],
    ['Which formula gives the number of days between two dates?', ['=B1-A1', '=B1+A1', '=B1*A1', '=B1/A1'], 0, 'Dates are numbers; subtract them (or use DATEDIF).'],
    ['In VLOOKUP, the last argument FALSE (0) means…', ['Approximate match', 'Exact match', 'Sort', 'Ignore case'], 1, 'FALSE = exact match.'],
    ['What does Ctrl+Shift+L do?', ['Toggle filter', 'Lock cells', 'Insert link', 'Left align'], 0, 'It turns AutoFilter on/off.'],
    ['Which function joins text from many cells with a separator?', ['TEXTJOIN', 'MERGE', 'COMBINE', 'ADDTEXT'], 0, 'TEXTJOIN(delimiter, ignore_empty, range).']
  ],
  autocad: [
    ['Command alias for LINE?', ['L', 'LI', 'LN', 'LE'], 0, 'L = LINE.'],
    ['Alias for CIRCLE?', ['C', 'CI', 'CR', 'CL'], 0, 'C = CIRCLE.'],
    ['Alias for TRIM?', ['TR', 'T', 'TM', 'TRM'], 0, 'TR = TRIM (T is MTEXT).'],
    ['Command to create parallel copy of an object?', ['OFFSET (O)', 'COPY', 'ARRAY', 'MIRROR'], 0, 'OFFSET creates parallel lines/curves.'],
    ['Alias for MOVE?', ['M', 'MO', 'MV', 'MOV'], 0, 'M = MOVE.'],
    ['Which command extends lines up to a boundary?', ['EXTEND (EX)', 'STRETCH', 'LENGTHEN', 'FILLET'], 0, 'EX = EXTEND.'],
    ['Alias for DIMLINEAR?', ['DLI', 'DL', 'DIM', 'LD'], 0, 'DLI = linear dimension.'],
    ['F8 toggles…', ['Ortho', 'Osnap', 'Grid', 'Polar'], 0, 'F8 = Ortho, F3 = Osnap, F9 = Snap, F7 = Grid, F10 = Polar.'],
    ['Command to measure distance?', ['DIST (DI)', 'AREA', 'ID', 'LIST'], 0, 'DI gives distance and angle.'],
    ['Alias for HATCH?', ['H', 'HA', 'HT', 'HC'], 0, 'H = HATCH.'],
    ['Which command creates a block?', ['BLOCK (B)', 'GROUP', 'WBLOCK only', 'MAKE'], 0, 'B = BLOCK; WBLOCK saves to a file.'],
    ['Alias for LAYER?', ['LA', 'L', 'LY', 'LR'], 0, 'LA opens the Layer Properties Manager.']
  ],
  hr: [
    ['Best opening for "Tell me about yourself"?', ['Life history from childhood', 'Short present → past → future summary', 'Only hobbies', 'Salary expectation'], 1, 'Keep it professional and under 90 seconds.'],
    ['What does STAR stand for?', ['Skill, Task, Action, Review', 'Situation, Task, Action, Result', 'Start, Think, Act, Repeat', 'Strength, Target, Attitude, Result'], 1, 'Use it for behavioural questions.'],
    ['How should you answer "What is your weakness?"', ['I have none', 'A real weakness with steps to improve', 'I work too hard', 'Blame others'], 1, 'Honest + improvement plan.'],
    ['Why are you leaving your current job? Best answer focuses on…', ['Bad boss', 'Low salary only', 'Growth and new challenges', 'Colleagues'], 2, 'Stay positive.'],
    ['When should you discuss salary?', ['First sentence', 'After value is shown / when asked', 'Never', 'Before the interview'], 1, 'Give a researched range.'],
    ['What to carry to an interview?', ['Only phone', 'Resume copies, ID, certificates, pen', 'Nothing', 'Gifts'], 1, 'Be prepared.'],
    ['Best last question to ask the interviewer?', ['When can I take leave?', 'What does success look like in this role?', 'How much will I earn?', 'None'], 1, 'Shows interest in performance.'],
    ['Body language in interviews: which is best?', ['Crossed arms, no eye contact', 'Straight posture, eye contact, smile', 'Looking at the phone', 'Slouching'], 1, 'Confident and polite.']
  ],
  banking: [
    ['KYC stands for…', ['Know Your Customer', 'Keep Your Cash', 'Know Your Credit', 'Key Your Card'], 0, 'Customer identification process.'],
    ['IMPS works…', ['Only working hours', '24×7 instantly', 'Once a day', 'Only on Sunday'], 1, 'IMPS is instant and available 24×7.'],
    ['Minimum amount for RTGS is…', ['₹1,000', '₹50,000', '₹2 lakh', '₹10 lakh'], 2, 'RTGS is for high-value transfers (₹2 lakh and above).'],
    ['CIBIL score range is…', ['0–100', '300–900', '500–1000', '100–500'], 1, '750+ is generally good.'],
    ['An account with no transactions for long becomes…', ['Joint', 'Dormant/inoperative', 'Closed instantly', 'Premium'], 1, 'Needs KYC re-activation.'],
    ['Repo rate is the rate at which…', ['Banks lend to public', 'RBI lends to banks', 'Banks lend to RBI', 'Govt lends'], 1, 'Repurchase option rate.'],
    ['Which is a negotiable instrument?', ['Cheque', 'Passbook', 'ATM card', 'Pay slip'], 0, 'Cheque, promissory note, bill of exchange.'],
    ['NPA means loan overdue for more than…', ['30 days', '60 days', '90 days', '180 days'], 2, 'Non-Performing Asset after 90 days.'],
    ['CASA stands for…', ['Current and Savings Account', 'Cash and Securities Account', 'Credit and Savings Account', 'Card Account'], 0, 'Low-cost deposits.'],
    ['Which of these is an officially valid KYC document?', ['Aadhaar', 'Gym card', 'Library card', 'Visiting card'], 0, 'Aadhaar, passport, voter ID, driving licence, PAN (for ID).']
  ],
  kyc: [
    ['AHT means…', ['Average Handling Time', 'Always Help Team', 'Annual Hours Total', 'Average Hold Tone'], 0, 'Time to complete a call including after-call work.'],
    ['FCR means…', ['First Call Resolution', 'Fast Customer Reply', 'Final Call Record', 'Free Call Rate'], 0, 'Issue solved on the first contact.'],
    ['The best way to handle an angry customer?', ['Argue', 'Listen, empathise, solve', 'Hang up', 'Transfer quickly'], 1, 'Stay calm and acknowledge.'],
    ['CSAT measures…', ['Customer satisfaction', 'Call sales', 'Cost saved', 'Call speed'], 0, 'Usually a post-call survey score.'],
    ['What do you do if you do not know the answer?', ['Guess', 'Check the knowledge base / escalate', 'Disconnect', 'Promise anything'], 1, 'Never give wrong information.'],
    ['Which is address proof?', ['Electricity bill', 'Pen drive', 'Visiting card', 'Gym card'], 0, 'Utility bills, Aadhaar, rent agreement etc.'],
    ['Active listening includes…', ['Interrupting', 'Paraphrasing and confirming', 'Multitasking', 'Silence only'], 1, 'Repeat key points back.'],
    ['Why is a hold script needed?', ['To confuse customers', 'To ask permission and tell the time you need', 'To end calls', 'No reason'], 1, 'Professional call handling.']
  ],
  resume: [
    ['What is the ideal resume length for a fresher?', ['1 page', '4 pages', '6 pages', 'No limit'], 0, 'Freshers: 1 page. Experienced: 1–2 pages.'],
    ['Which is the best bullet?', ['Responsible for sales', 'Increased monthly sales by 18% (₹4.2L) in 6 months', 'Did many things', 'Hard working'], 1, 'Action verb + task + measurable result.'],
    ['ATS stands for…', ['Applicant Tracking System', 'Automatic Test Score', 'Applied Technical Skill', 'Admin Task System'], 0, 'Software that scans and ranks resumes.'],
    ['Which file format is safest for ATS?', ['PDF (text-based) or DOCX', 'Image JPG', 'PowerPoint', 'Scanned PDF'], 0, 'Text-based files are readable by ATS.'],
    ['Should you include a photo in an Indian corporate resume?', ['Always', 'Optional; not needed for ATS roles', 'Never at all', 'Only selfie'], 1, 'Follow the company/role norm.'],
    ['Which email is most professional?', ['cutegirl123@mail.com', 'firstname.lastname@gmail.com', 'rocker_boy@mail.com', 'xyz@mail.com'], 1, 'Use your name.'],
    ['Where do freshers put education?', ['At the top after summary', 'At the very end', 'Not required', 'Only in cover letter'], 0, 'Freshers lead with education, projects, skills.'],
    ['A resume summary should be…', ['2–3 lines tailored to the job', '1 page', 'Only hobbies', 'Missing'], 0, 'Short and role-specific.']
  ],
  email: [
    ['A professional email should start with…', ['Hey dude', 'Dear Mr./Ms. [Name],', 'Yo', 'No greeting'], 1, 'Formal greeting.'],
    ['The subject line should be…', ['Empty', 'Clear and specific', 'Very long story', 'All capital letters'], 1, 'E.g. "Leave request – 20 Nov".'],
    ['"Yours sincerely" is used when…', ['You know the name of the person', 'You do not know the name', 'In chat', 'Never'], 0, '"Yours faithfully" if you start with Dear Sir/Madam.'],
    ['When should you use CC?', ['To hide people', 'To keep others informed', 'For attachments', 'Never'], 1, 'BCC hides recipients.'],
    ['Before sending an email you should…', ['Proofread and check attachment', 'Send quickly', 'Add emojis', 'Use red font'], 0, 'Avoid errors.'],
    ['Best closing line for a request?', ['Do it now', 'Thank you for your support. Kindly let me know if you need anything else.', 'Reply ASAP!!!', 'Bye'], 1, 'Polite and clear.']
  ],
  hvac: [
    ['1 TR equals…', ['3.517 kW', '1 kW', '12 kW', '0.5 kW'], 0, '1 TR = 12,000 BTU/h = 3.517 kW.'],
    ['Which component raises the pressure of the refrigerant?', ['Evaporator', 'Compressor', 'Condenser', 'Expansion valve'], 1, 'Compressor.'],
    ['Where does the refrigerant absorb heat?', ['Condenser', 'Evaporator', 'Compressor', 'Receiver'], 1, 'In the evaporator.'],
    ['CFM stands for…', ['Cubic Feet per Minute', 'Cooling Flow Meter', 'Cubic Feet per Month', 'Centrifugal Fan Motor'], 0, 'Airflow unit.'],
    ['Typical main supply duct velocity in comfort AC?', ['100 FPM', '1000–1800 FPM', '5000 FPM', '20 FPM'], 1, 'Branch ducts lower (600–1000 FPM).'],
    ['COP is…', ['Cooling output ÷ power input', 'Power ÷ cooling', 'Cost of product', 'Cycle of pressure'], 0, 'Higher COP = more efficient.'],
    ['Refrigerant commonly used in new inverter ACs in India?', ['R-32 / R-410A', 'R-12', 'CFC-11', 'Water only'], 0, 'R-12 and CFCs are phased out.'],
    ['Static pressure is the…', ['Resistance to airflow in the duct system', 'Speed of air', 'Temperature', 'Humidity'], 0, 'Fans must overcome it.']
  ],
  gst: [
    ['For goods sold within the same state GST is split as…', ['CGST + SGST', 'IGST only', 'No GST', 'Cess only'], 0, 'Intra-state: CGST + SGST.'],
    ['For inter-state sales GST charged is…', ['IGST', 'CGST', 'SGST', 'Nil'], 0, 'Integrated GST.'],
    ['A GST invoice must contain…', ['GSTIN, HSN/SAC, tax rate, invoice number', 'Only name', 'Only amount', 'Phone number only'], 0, 'Mandatory fields.'],
    ['GSTIN has how many characters?', ['10', '12', '15', '18'], 2, '15 characters including state code and PAN.'],
    ['ITC means…', ['Input Tax Credit', 'Income Tax Certificate', 'Invoice Tax Cost', 'Internal Tax Code'], 0, 'Credit for tax paid on purchases.']
  ],
  finance: [
    ['Simple interest formula is…', ['P×R×T/100', 'P×(1+R)^T', 'P+R+T', 'P/R×T'], 0, 'SI = P R T / 100.'],
    ['EMI includes…', ['Only interest', 'Principal + interest', 'Only principal', 'Tax only'], 1, 'Each EMI has both parts.'],
    ['In a reducing-balance loan, interest is charged on…', ['Original principal always', 'Outstanding principal', 'Total payable', 'Nothing'], 1, 'Interest reduces as principal reduces.'],
    ['Salary slip: Gross salary =', ['Basic + allowances', 'Net − deductions', 'Only basic', 'CTC − bonus'], 0, 'Net = Gross − deductions.'],
    ['PF (employee) is generally what % of basic?', ['12%', '5%', '25%', '0%'], 0, 'EPF employee contribution is 12% of basic + DA.']
  ]
};
/* tool id → bank key */
PJD.MCQ_MAP = {
  'excel-formulas': 'excel-formulas', 'autocad': 'autocad', 'interview-questions': 'hr', 'banking-interview': 'banking', 'kyc-bpo': 'kyc',
  'resume-builder': 'resume', 'resume-maker': 'resume', 'resume-improvement': 'resume', 'email-templates': 'email', 'email-writing': 'email',
  'tr-to-kw': 'hvac', 'cfm': 'hvac', 'duct-size': 'hvac', 'air-velocity': 'hvac', 'btu': 'hvac', 'boq-templates': 'hvac',
  'invoice': 'gst', 'gst': 'gst', 'salary-slip': 'finance', 'salary': 'finance', 'emi': 'finance', 'loan': 'finance'
};

/* ---------- Resume fields: keywords for ATS match, templates ---------- */
PJD.RES = {
  'IT / Software Developer': { kw: ['java', 'python', 'javascript', 'sql', 'git', 'api', 'oop', 'data structures', 'algorithms', 'testing', 'agile', 'debugging', 'linux', 'cloud', 'aws', 'database', 'github', 'rest'], sec: ['Summary', 'Skills', 'Projects', 'Experience', 'Education', 'Certifications'],
    sum: { F: 'Computer science graduate skilled in Python, JavaScript and SQL with 2 academic projects and strong problem-solving ability. Seeking a Software Developer role to build reliable applications and grow in a team.', E: 'Software Developer with [X] years of experience building and maintaining [web/backend] applications using [stack]. Reduced page load time by [30]% and delivered [10]+ features in agile sprints.' },
    bul: ['Developed [feature] using [tech], serving [N] users and reducing [metric] by [X]%.', 'Optimised SQL queries and added indexes, cutting report time from [A] to [B] seconds.', 'Wrote unit tests (coverage [X]%) and fixed [N] production bugs through root-cause analysis.'] },
  'Web Development': { kw: ['html', 'css', 'javascript', 'react', 'responsive', 'node', 'api', 'git', 'seo', 'accessibility', 'bootstrap', 'typescript', 'performance', 'ui', 'ux', 'figma'], sec: ['Summary', 'Skills', 'Projects (with live links)', 'Experience', 'Education'],
    sum: { F: 'Front-end developer with hands-on projects in HTML, CSS, JavaScript and React. Built responsive websites and a portfolio hosted on GitHub Pages. Looking for a junior web developer role.', E: 'Web Developer with [X] years of experience delivering responsive, high-performance sites in [React/Node]. Improved Lighthouse score from [60] to [95] and reduced bounce rate by [X]%.' },
    bul: ['Built [N] responsive pages with React and REST APIs, improving mobile conversion by [X]%.', 'Improved page speed by [X]% through image optimisation, lazy loading and code splitting.', 'Implemented accessibility fixes (ARIA, contrast) meeting WCAG 2.1 AA.'] },
  'Data Analyst / Excel / SQL': { kw: ['excel', 'sql', 'power bi', 'tableau', 'python', 'pivot', 'dashboard', 'vlookup', 'xlookup', 'data cleaning', 'visualization', 'statistics', 'reporting', 'power query', 'kpi', 'analysis'], sec: ['Summary', 'Skills', 'Projects', 'Experience', 'Education', 'Certifications'],
    sum: { F: 'Analytical graduate skilled in Excel, SQL and Power BI. Completed [2] dashboard projects on real datasets and passionate about turning data into decisions.', E: 'Data Analyst with [X] years of experience in Excel, SQL and Power BI. Built dashboards that cut reporting time by [X]% and supported decisions worth ₹[X] lakh.' },
    bul: ['Built a Power BI dashboard tracking [KPIs], reducing manual reporting by [X] hours per week.', 'Cleaned and analysed [N]+ records with SQL and Excel, identifying [X]% cost saving.', 'Automated monthly MIS using Power Query and macros.'] },
  'Accounts / Finance': { kw: ['tally', 'gst', 'tds', 'excel', 'bank reconciliation', 'accounts payable', 'accounts receivable', 'balance sheet', 'ledger', 'invoicing', 'audit', 'journal', 'mis', 'taxation', 'payroll', 'sap'], sec: ['Summary', 'Skills', 'Experience', 'Education', 'Certifications'],
    sum: { F: 'B.Com graduate with knowledge of Tally Prime, GST and Excel, completed internship in accounts. Seeking an Accounts Executive role.', E: 'Accounts professional with [X] years of experience in GST filing, TDS, reconciliations and month-end closing using Tally/SAP; reduced closing time by [X] days.' },
    bul: ['Prepared monthly GST returns (GSTR-1/3B) with 100% on-time filing.', 'Reconciled [N] bank and vendor accounts, resolving ₹[X] lakh differences.', 'Processed [N] invoices monthly with zero audit observations.'] },
  'Banking / Insurance': { kw: ['kyc', 'customer service', 'sales', 'loans', 'casa', 'cross-selling', 'compliance', 'target', 'relationship', 'insurance', 'credit', 'documentation', 'aml', 'retail banking', 'fintech'], sec: ['Summary', 'Skills', 'Experience', 'Education', 'Certifications'],
    sum: { F: 'Commerce graduate with strong communication and numerical skills, seeking an entry-level banking role to serve customers and learn retail banking operations.', E: 'Banking professional with [X] years in retail banking and sales; achieved [110]% of annual target, sourced ₹[X] crore CASA and maintained zero KYC non-compliance.' },
    bul: ['Achieved [X]% of monthly target by cross-selling loans and insurance to [N] customers.', 'Completed KYC and documentation for [N]+ accounts with zero audit errors.', 'Resolved [N] customer complaints within TAT, raising satisfaction to [X]%.'] },
  'Sales / Marketing / Digital Marketing': { kw: ['lead generation', 'crm', 'seo', 'social media', 'google ads', 'meta ads', 'campaign', 'content', 'analytics', 'conversion', 'b2b', 'negotiation', 'target', 'roi', 'email marketing', 'branding'], sec: ['Summary', 'Skills', 'Experience / Internships', 'Campaigns', 'Education', 'Certifications'],
    sum: { F: 'MBA/BBA graduate with internship experience in social media and lead generation. Strong communicator seeking a marketing or sales trainee role.', E: 'Sales & marketing professional with [X] years of experience, generated ₹[X] lakh revenue and improved conversion from [A]% to [B]% through targeted campaigns.' },
    bul: ['Generated [N] qualified leads per month with Google Ads at CPL of ₹[X] (-[Y]%).', 'Closed ₹[X] lakh in B2B sales, exceeding quarterly target by [X]%.', 'Grew Instagram following from [A] to [B] in [N] months through consistent content.'] },
  'BPO / Customer Support / KYC': { kw: ['customer service', 'communication', 'crm', 'typing speed', 'voice process', 'chat support', 'complaint handling', 'kyc', 'aht', 'csat', 'fcr', 'escalation', 'english', 'data entry', 'ticketing'], sec: ['Summary', 'Skills', 'Experience', 'Education', 'Languages'],
    sum: { F: 'Graduate with excellent English/Hindi communication, 40 WPM typing and basic CRM knowledge. Looking for a customer support role.', E: 'Customer support professional with [X] years in voice/chat process; maintained CSAT [92]%, AHT [X] min and FCR [X]%, recognised as Top Performer [N] times.' },
    bul: ['Handled [N]+ calls/chats daily with CSAT of [X]% and QA score of [X]%.', 'Reduced AHT by [X]% using knowledge-base shortcuts without lowering quality.', 'Completed KYC verification for [N]+ customers with 100% compliance.'] },
  'HVAC / Mechanical': { kw: ['hvac', 'autocad', 'cooling load', 'duct design', 'chiller', 'vrf', 'boq', 'estimation', 'commissioning', 'site execution', 'psychrometrics', 'hap', 'ashrae', 'testing and balancing', 'maintenance', 'ms project'], sec: ['Summary', 'Technical Skills', 'Projects', 'Experience', 'Education', 'Certifications'],
    sum: { F: 'Mechanical engineering graduate with training in HVAC design, AutoCAD and load calculation. Seeking a Junior HVAC Engineer role.', E: 'HVAC Engineer with [X] years of experience in design, estimation and execution of [chilled water/VRF] systems up to [N] TR; prepared BOQs worth ₹[X] crore.' },
    bul: ['Designed duct and piping layouts for [N] sq ft using AutoCAD and cooling load by HAP/E20.', 'Prepared BOQ and estimates worth ₹[X] crore with [X]% accuracy vs actual.', 'Led testing & commissioning of [N] TR chiller plant with [X]% energy saving.'] },
  'Civil / Construction': { kw: ['autocad', 'staad', 'revit', 'estimation', 'quantity surveying', 'site supervision', 'bbs', 'rcc', 'ms project', 'billing', 'quality control', 'safety', 'primavera', 'rate analysis', 'planning'], sec: ['Summary', 'Skills', 'Projects', 'Experience', 'Education'],
    sum: { F: 'Civil engineering graduate with internship in site execution and skills in AutoCAD, STAAD and estimation.', E: 'Civil Engineer with [X] years managing site execution, billing and quality for projects worth ₹[X] crore; delivered [N] projects on time within budget.' },
    bul: ['Supervised RCC work for [N] floors with [X]% quality audit compliance.', 'Prepared RA bills worth ₹[X] crore and reconciled quantities with BOQ.', 'Reduced material wastage by [X]% by weekly reconciliation.'] },
  'Electrical / Electronics': { kw: ['plc', 'scada', 'autocad electrical', 'wiring', 'panel', 'motor', 'vfd', 'testing', 'maintenance', 'earthing', 'transformer', 'power factor', 'troubleshooting', 'safety', 'circuit'], sec: ['Summary', 'Technical Skills', 'Projects', 'Experience', 'Education', 'Certifications'],
    sum: { F: 'Electrical engineering graduate trained in PLC, wiring and testing; completed a final-year project on [topic]. Seeking a trainee engineer role.', E: 'Electrical Engineer with [X] years in installation, maintenance and troubleshooting of motors, panels and PLC systems; reduced breakdown time by [X]%.' },
    bul: ['Maintained [N] motors and panels, reducing downtime by [X]%.', 'Installed and tested [N] kVA electrical systems as per IS standards.', 'Improved power factor to [0.98] with APFC panel, avoiding penalties of ₹[X] lakh.'] },
  'Teaching / Education': { kw: ['lesson planning', 'classroom management', 'curriculum', 'assessment', 'student engagement', 'ict', 'b.ed', 'ctet', 'cbse', 'communication', 'mentoring', 'smart class', 'differentiated', 'parent'], sec: ['Summary', 'Qualifications', 'Experience', 'Skills', 'Achievements'],
    sum: { F: 'B.Ed qualified educator with CTET and teaching practice in [subject]; skilled in activity-based learning and classroom management.', E: 'Teacher with [X] years of experience in [subject] at [board]; improved class average from [A]% to [B]% using activity-based and digital methods.' },
    bul: ['Improved class results from [A]% to [B]% through weekly assessments and remedial classes.', 'Introduced smart-class content and quizzes, raising participation by [X]%.', 'Mentored [N] students for olympiad/competitions with [N] winners.'] },
  'Healthcare / Nursing': { kw: ['patient care', 'vital signs', 'iv', 'infection control', 'documentation', 'icu', 'emergency', 'medication', 'bls', 'nabh', 'ehr', 'triage', 'sterilization', 'ward', 'counselling'], sec: ['Summary', 'Registration & Licence', 'Experience / Clinical Postings', 'Skills', 'Education'],
    sum: { F: 'GNM/B.Sc Nursing graduate with clinical postings in medicine, surgery and ICU; BLS certified and committed to safe patient care.', E: 'Staff Nurse with [X] years in [ICU/ward]; managed [N]-bed unit, followed NABH standards and reduced medication errors to zero in [N] months.' },
    bul: ['Provided care for [N] patients per shift, monitoring vitals and documenting accurately.', 'Followed infection-control protocols, contributing to [X]% reduction in HAIs.', 'Trained [N] junior nurses on [procedure].'] },
  'Admin / Office / MS Office': { kw: ['ms office', 'excel', 'word', 'powerpoint', 'data entry', 'typing', 'scheduling', 'coordination', 'documentation', 'email', 'filing', 'vendor', 'reports', 'communication', 'inventory'], sec: ['Summary', 'Skills', 'Experience', 'Education'],
    sum: { F: 'Graduate with MS Office, 45 WPM typing and good communication. Looking for an admin or office executive role.', E: 'Admin Executive with [X] years of experience in coordination, vendor management and MIS reporting; saved [X] hours monthly through Excel automation.' },
    bul: ['Prepared MIS reports in Excel (Pivot, VLOOKUP) for management every week.', 'Coordinated travel and events for [N] employees within budget.', 'Digitised [N]+ records, cutting retrieval time by [X]%.'] },
  'Logistics / Operations / Supply Chain': { kw: ['inventory', 'warehouse', 'supply chain', 'dispatch', 'erp', 'sap', 'e-way bill', 'procurement', 'vendor', 'fifo', 'kpi', 'transportation', 'excel', 'forecasting', 'otif'], sec: ['Summary', 'Skills', 'Experience', 'Education', 'Certifications'],
    sum: { F: 'Graduate with basic knowledge of inventory, dispatch documents and Excel; seeking a Logistics Executive trainee role.', E: 'Operations professional with [X] years in warehouse and distribution; improved OTIF from [A]% to [B]% and reduced freight cost by [X]%.' },
    bul: ['Managed dispatch of [N] orders daily with [X]% on-time delivery.', 'Reduced inventory variance to [X]% via cycle counts and ABC analysis.', 'Negotiated freight rates saving ₹[X] lakh per year.'] }
};
PJD.RES_GENERIC = { kw: ['communication', 'teamwork', 'problem solving', 'ms office', 'leadership', 'time management', 'english', 'adaptability'], sec: ['Summary', 'Skills', 'Experience', 'Education'] };
