/* ===== PJ Pro – data: Interview bank (field × Fresher / Experienced), each item = [question, answer hint] ===== */
window.PJD = window.PJD || {};
PJD.IB = {
  'HR / General (all fields)': {
    F: [
      ['Tell me about yourself.', 'Present → past → future in 60 sec: name, education, 1–2 strengths/projects, why this role.'],
      ['Why should we hire you?', 'Match 2–3 job requirements to your skills; show eagerness to learn; give one proof (project/internship).'],
      ['What are your strengths and weaknesses?', 'Strength with example; weakness that is real but being improved (e.g. public speaking → joined a club).'],
      ['Where do you see yourself in 5 years?', 'Growth in the same field, more responsibility; avoid saying "your chair" or "abroad".'],
      ['Why do you want to join our company?', 'Mention product/values/culture you researched; link to your goals.'],
      ['What are your hobbies and how do they help at work?', 'Pick one hobby; connect it to discipline, teamwork or creativity.'],
      ['Are you willing to relocate or work in shifts?', 'Answer honestly; show flexibility within your real limits.'],
      ['Do you have any questions for us?', 'Ask about training, team, first-90-day goals – not about salary first.']
    ],
    E: [
      ['Walk me through your career so far.', 'Chronological, 2 minutes, highlight growth, biggest achievements with numbers.'],
      ['Why are you leaving your current job?', 'Positive reasons: growth, learning, bigger scope. Never blame the manager or company.'],
      ['Describe your biggest achievement.', 'STAR format with a measurable result (₹, %, time saved).'],
      ['Tell me about a conflict with a colleague or manager.', 'Show listening, facts, compromise, and the outcome; no blame.'],
      ['How do you handle pressure and tight deadlines?', 'Prioritise, communicate early, break into steps – give a real example.'],
      ['What is your expected salary and notice period?', 'Give a researched range linked to market and responsibility; state notice and flexibility honestly.'],
      ['How have you led or mentored others?', 'Example of training juniors or leading a project; outcome and what you learnt.'],
      ['What would you do in your first 90 days here?', 'Learn → understand processes → quick win → plan; shows maturity.']
    ]
  },
  'IT / Software Developer': {
    F: [
      ['What is the difference between a list and an array (or tuple)?', 'Mutable vs fixed; in Python list is dynamic and tuple immutable; arrays store same type in contiguous memory.'],
      ['Explain OOP concepts.', 'Encapsulation, Abstraction, Inheritance, Polymorphism with one simple real-life example each.'],
      ['What is the difference between stack and queue?', 'Stack LIFO (undo, call stack); Queue FIFO (printer, tickets).'],
      ['What is a primary key and a foreign key?', 'PK uniquely identifies a row, not null; FK references PK of another table to link data.'],
      ['Write logic to reverse a string / check palindrome.', 'Two-pointer or slicing; explain time O(n).'],
      ['What is Git and why do we use it?', 'Version control; commit, branch, merge, pull request – teamwork without overwriting.'],
      ['Tell me about your final-year project.', 'Problem, your role, technologies, challenges, result.']
    ],
    E: [
      ['Explain how you would design a REST API for an e-commerce cart.', 'Resources, HTTP verbs, status codes, auth (JWT), validation, pagination, idempotency, versioning.'],
      ['Explain time complexity and how you optimised a slow query/function.', 'Profile first, indexes, caching, better algorithm; give measured before/after.'],
      ['SQL: difference between INNER, LEFT JOIN, and when to use indexes?', 'Rows returned by each join; indexes speed reads, slow writes, use on filter/join columns.'],
      ['How do you handle code reviews and technical debt?', 'Small PRs, tests, coding standards; schedule refactoring; explain trade-offs.'],
      ['What is the difference between monolith and microservices?', 'Single deploy vs independent services; scaling vs complexity, network and data consistency.'],
      ['How do you debug a production issue?', 'Reproduce, logs/metrics, isolate recent changes, rollback/fix, root-cause analysis, prevent.'],
      ['Explain a design pattern you have used.', 'Singleton/Factory/Observer/MVC – where, why, and the problem it solved.']
    ]
  },
  'Web Development': {
    F: [
      ['What is the difference between HTML, CSS and JavaScript?', 'Structure, style, behaviour.'],
      ['Explain the CSS box model.', 'Content + padding + border + margin; box-sizing: border-box.'],
      ['What is the difference between == and === in JavaScript?', '== converts types; === compares type and value – prefer ===.'],
      ['What is responsive design?', 'Layout adapts to screen size using flexbox/grid, relative units and media queries.'],
      ['What is the DOM?', 'Tree representation of the page that JS can read and change.'],
      ['Difference between let, const and var?', 'Block scope vs function scope; const cannot be reassigned.'],
      ['What are semantic HTML tags?', 'header, nav, main, article, footer – improve SEO and accessibility.']
    ],
    E: [
      ['Explain closures, hoisting and the event loop.', 'Function remembers outer scope; declarations moved up; call stack + task queue + microtasks.'],
      ['How do you improve website performance?', 'Lazy-load images, compress, minify, caching/CDN, code-splitting, Core Web Vitals.'],
      ['Explain state management in React (or your framework).', 'useState/Context/Redux; lift state up; avoid prop drilling.'],
      ['How do you secure a web app?', 'HTTPS, input validation, XSS/CSRF/SQL-injection protection, auth, CORS, secrets in env.'],
      ['Explain REST vs GraphQL.', 'Multiple endpoints vs single query endpoint – over/under-fetching trade-offs.'],
      ['How do you make a site accessible?', 'Semantic tags, alt text, keyboard navigation, contrast, ARIA labels.'],
      ['Describe your CI/CD or deployment process.', 'Git → tests → build → deploy (GitHub Actions/Netlify) → monitor/rollback.']
    ]
  },
  'Data Analyst / Excel / SQL': {
    F: [
      ['Difference between VLOOKUP and XLOOKUP?', 'XLOOKUP looks left or right, exact match default, returns arrays; VLOOKUP only right.'],
      ['What is a Pivot Table?', 'Summarises large data by drag-and-drop – totals, counts, averages by categories.'],
      ['How do you clean messy data?', 'Remove duplicates, fix blanks, TRIM/PROPER, consistent dates, validate ranges.'],
      ['SQL: write a query to find the 2nd highest salary.', 'Use subquery MAX < MAX, or DENSE_RANK() = 2.'],
      ['What is the difference between mean, median and mode?', 'Average, middle value, most frequent; median is resistant to outliers.'],
      ['Which chart would you use for trend vs comparison vs share?', 'Line for trend, bar for comparison, pie only for few shares.'],
      ['What is the difference between WHERE and HAVING?', 'WHERE filters rows before grouping; HAVING filters groups after aggregation.']
    ],
    E: [
      ['Explain a project where your analysis changed a business decision.', 'Problem → data → method → insight → action → measurable impact.'],
      ['Window functions: when would you use ROW_NUMBER, RANK, LAG?', 'Ranking, de-duplication, running totals, comparing with previous period.'],
      ['How do you handle outliers and missing values?', 'Understand cause; impute/remove/cap; document the assumption.'],
      ['How do you validate a dashboard before sharing?', 'Reconcile totals with source, test filters, edge cases, peer review.'],
      ['Explain A/B testing basics.', 'Control vs variant, random split, sample size, p-value/confidence, practical significance.'],
      ['How do you automate repeated reporting?', 'Power Query, SQL views, macros/Python scripts, scheduled refresh.'],
      ['Power BI/Tableau: what is a measure vs calculated column?', 'Measure computed at query time with filters; column computed per row and stored.']
    ]
  },
  'Accounts / Finance': {
    F: [
      ['What are the golden rules of accounting?', 'Personal: debit receiver, credit giver. Real: debit what comes in, credit what goes out. Nominal: debit expenses/losses, credit incomes/gains.'],
      ['What is GST and its types?', 'Indirect tax: CGST + SGST for intra-state, IGST for inter-state, UTGST for UTs.'],
      ['What is a balance sheet?', 'Statement of assets, liabilities and equity at a date: Assets = Liabilities + Equity.'],
      ['What is the difference between a debit note and a credit note?', 'Debit note increases amount payable (purchase return); credit note reduces amount receivable (sales return).'],
      ['What is depreciation?', 'Allocation of an asset’s cost over its useful life – SLM and WDV methods.'],
      ['What are the basic Tally/Excel functions you know?', 'Vouchers, ledgers, SUMIF, VLOOKUP, pivot, bank reconciliation.'],
      ['What is TDS?', 'Tax deducted at source on payments like salary, rent, professional fees; deposited with the government by the deductor.']
    ],
    E: [
      ['Explain the month-end closing process you follow.', 'Accruals, provisions, reconciliations, depreciation, trial balance, review, MIS.'],
      ['How do you do bank reconciliation and handle differences?', 'Match cash book with bank statement; list cheques issued-not-presented, deposits-in-transit, charges.'],
      ['How do you ensure GST compliance?', 'Monthly GSTR-1/3B, ITC reconciliation with GSTR-2B, e-invoicing, timely payment.'],
      ['Explain working capital management.', 'Receivables, payables, inventory cycles; improve through collection, terms, stock control.'],
      ['How would you find and correct an error in the trial balance?', 'Check totals, transposition (difference divisible by 9), postings, suspense account.'],
      ['What financial ratios do you track?', 'Current ratio, quick ratio, debt/equity, gross & net margin, DSO.'],
      ['How do you prepare for an audit?', 'Documents indexed, reconciliations done, schedules ready, queries answered with evidence.']
    ]
  },
  'Banking / Insurance': {
    F: [
      ['What is KYC and why is it needed?', 'Know Your Customer – verifies identity/address to prevent fraud and money laundering.'],
      ['Difference between savings and current account?', 'Savings: interest, limited transactions for individuals; current: businesses, high transactions, no interest.'],
      ['What is repo rate and reverse repo rate?', 'Repo: RBI lends to banks; reverse repo: RBI borrows from banks.'],
      ['What is NEFT, RTGS and IMPS?', 'NEFT batch transfers; RTGS real-time high value (₹2 lakh+); IMPS instant 24×7.'],
      ['How would you sell a product to a new customer?', 'Understand need → explain benefit → handle objections → close politely.'],
      ['What is CIBIL score?', 'Credit score 300–900; above 750 is considered good for loans.'],
      ['What is an NPA?', 'Loan overdue for more than 90 days.']
    ],
    E: [
      ['How do you achieve monthly targets?', 'Pipeline, referrals, follow-ups, cross-selling; share your numbers.'],
      ['Explain how you handled a high-value customer complaint.', 'Listen, apologise, fix, follow-up, retention result.'],
      ['How do you detect and prevent fraud?', 'Verification, transaction patterns, alerts, escalation as per policy.'],
      ['Explain the loan appraisal process.', 'Application, KYC, income & CIBIL check, collateral valuation, risk rating, sanction, disbursal.'],
      ['What is CASA and why does it matter?', 'Current + Savings accounts – low-cost deposits improve margin.'],
      ['How do you handle compliance vs sales pressure?', 'Compliance first; explain long-term risk; find compliant alternatives.'],
      ['Difference between term, endowment and ULIP plans?', 'Pure protection vs protection + savings vs market-linked investment.']
    ]
  },
  'Sales / Marketing / Digital Marketing': {
    F: [
      ['What is the difference between sales and marketing?', 'Marketing creates awareness and leads; sales converts leads to customers.'],
      ['Explain the 4 Ps of marketing.', 'Product, Price, Place, Promotion.'],
      ['How would you handle rejection?', 'Treat as learning, ask feedback, follow-up after some time.'],
      ['What is SEO and SEM?', 'SEO – free/organic ranking; SEM – paid search ads.'],
      ['Which social media platform would you use to promote a B2B product?', 'LinkedIn – professional audience; explain with reasoning.'],
      ['What is a USP?', 'Unique Selling Proposition – why customers pick you over competitors.'],
      ['What do CTR, CPC and CPL stand for?', 'Click-through rate, cost per click, cost per lead.']
    ],
    E: [
      ['Explain your sales funnel and conversion rates.', 'Lead → qualified → proposal → close; share % at each stage and how you improved.'],
      ['How do you plan a digital campaign budget?', 'Goal, audience, channel split, test small, scale winners, track ROAS/CAC.'],
      ['Describe a deal you lost and what you learned.', 'Honest reason, what you changed afterwards.'],
      ['How do you build and manage key accounts?', 'Regular reviews, understand business, upsell/cross-sell, trust.'],
      ['How do you measure marketing ROI?', 'Attribution, CAC vs LTV, revenue per channel, cohort analysis.'],
      ['How do you handle price negotiation?', 'Sell value first; trade concessions for commitments; know your walk-away point.'],
      ['What tools do you use (CRM, GA4, Meta Ads, Google Ads)?', 'Name tools + one result you obtained with them.']
    ]
  },
  'BPO / Customer Support / KYC': {
    F: [
      ['How will you handle an angry customer?', 'Listen, empathise, apologise, solve or escalate, confirm satisfaction (LAST method).'],
      ['Are you comfortable with night shifts and rotational off days?', 'Be honest; mention you have family support and can adjust.'],
      ['What does good customer service mean to you?', 'Quick, polite, accurate resolution and respect for the customer’s time.'],
      ['What is AHT and FCR?', 'Average Handling Time and First Call Resolution.'],
      ['How do you speak clearly on calls?', 'Slow pace, simple words, positive tone, avoid slang, active listening.'],
      ['What is KYC and which documents are accepted?', 'Identity proof (Aadhaar, PAN, passport) + address proof; verify originals.'],
      ['Typing speed and computer skills?', 'State your WPM; MS Office and CRM basics.']
    ],
    E: [
      ['How do you reduce AHT without hurting quality?', 'Use knowledge base, standard flows, probing questions and notes while talking.'],
      ['How do you coach a low-performing team member?', 'Call listening, feedback with data, role-play, follow-up plan.'],
      ['Describe a time you turned an unhappy customer into a loyal one.', 'STAR with specifics and result (CSAT/NPS).'],
      ['How do you handle a call you cannot resolve?', 'Warm transfer or escalation with full notes; callback timeline.'],
      ['What are your KPIs and how did you perform?', 'CSAT, QA score, AHT, attendance – with numbers.'],
      ['What is the process if KYC documents do not match?', 'Reject politely, explain reason, request correct documents, follow compliance policy.'],
      ['How do you deal with burnout in high-volume queues?', 'Breaks, peer support, positive focus, escalate workload issues.']
    ]
  },
  'HVAC / Mechanical': {
    F: [
      ['Explain the refrigeration cycle.', 'Compressor → condenser → expansion valve → evaporator; heat absorbed in evaporator, rejected in condenser.'],
      ['What is 1 TR in kW and BTU/h?', '1 TR = 3.517 kW = 12,000 BTU/h.'],
      ['What is the difference between a split AC and a VRF system?', 'Split: one outdoor to one/few indoor units; VRF: one outdoor to many indoor units with variable refrigerant flow.'],
      ['What is CFM and how is duct velocity related?', 'CFM = Area (sq ft) × Velocity (FPM).'],
      ['Name common refrigerants.', 'R-22 (phasing out), R-410A, R-32, R-134a; mention ozone/GWP.'],
      ['What is the purpose of a filter drier?', 'Removes moisture and particles from refrigerant.'],
      ['Which AutoCAD commands do you use daily?', 'L, PL, TR, O, M, CO, DIM, LAYER, BLOCK, HATCH.']
    ],
    E: [
      ['How do you calculate cooling load of a building?', 'Sensible + latent: envelope, people, lighting, equipment, ventilation; use HAP/Carrier/ASHRAE method.'],
      ['How do you size a duct for 2000 CFM?', 'Choose velocity (e.g. 1000–1200 FPM) → area = CFM/velocity → size by equal friction/static regain.'],
      ['Chilled water system vs VRF – when do you choose which?', 'Large centralised loads and part-load efficiency vs flexible zoning, smaller buildings.'],
      ['What is COP/EER/IPLV and how do you improve efficiency?', 'Cooling output ÷ power input; VFDs, proper balancing, maintenance, economizers.'],
      ['How do you do air balancing at site?', 'Measure with anemometer/hood, adjust dampers, TAB report.'],
      ['Explain static pressure and its importance.', 'Resistance to airflow; affects fan selection, noise, and delivered CFM.'],
      ['Describe a commissioning or troubleshooting case.', 'Symptom, checks, root cause, fix, result.']
    ]
  },
  'Civil / Construction': {
    F: [
      ['What are the main ingredients of concrete?', 'Cement, fine aggregate (sand), coarse aggregate, water; admixtures optional.'],
      ['What is the meaning of M20 concrete?', 'Characteristic compressive strength 20 N/mm² at 28 days; mix ratio 1:1.5:3.'],
      ['What is the difference between RCC and PCC?', 'RCC has steel reinforcement; PCC has none.'],
      ['What is curing and why is it important?', 'Keeping concrete moist for strength and crack control – minimum 7 days.'],
      ['What are the types of foundations?', 'Isolated, combined, raft, pile.'],
      ['What is BBS?', 'Bar Bending Schedule – cut length and quantity of reinforcement bars.'],
      ['Which software do you know?', 'AutoCAD, STAAD, Revit, MS Project, Excel – with what you used it for.']
    ],
    E: [
      ['How do you prepare and track a project schedule?', 'WBS, critical path, resources, weekly look-ahead, progress vs plan.'],
      ['How do you control cost overruns on site?', 'Measure quantities, compare BOQ vs actual, reduce wastage, variation orders.'],
      ['How do you ensure quality and safety?', 'ITP, material tests, cube tests, toolbox talks, PPE, permits.'],
      ['Explain how you prepare a bill (RA bill) and measure work.', 'Joint measurement, rate analysis, deductions, certification.'],
      ['What would you do if a drawing and site conditions do not match?', 'Stop, document, raise RFI to the consultant, wait for approval.'],
      ['How do you manage subcontractors?', 'Clear scope, milestones, payment linked to progress, daily coordination.'],
      ['Explain a challenging project and your contribution.', 'Scope, constraint, your action, result.']
    ]
  },
  'Electrical / Electronics': {
    F: [
      ['State Ohm’s law.', 'V = I × R.'],
      ['What is the difference between AC and DC?', 'AC alternates direction (50 Hz in India); DC flows one way.'],
      ['What is the use of an MCB, MCCB and ELCB/RCCB?', 'Overload/short-circuit protection; higher current ratings; earth-leakage protection.'],
      ['Difference between series and parallel circuits?', 'Same current vs same voltage; effect on resistance and failure.'],
      ['What is earthing and why is it required?', 'Safe path for fault current to protect people and equipment.'],
      ['Explain a transformer’s working.', 'Mutual induction; turns ratio decides voltage ratio.'],
      ['Which instruments do you know?', 'Multimeter, clamp meter, megger, oscilloscope.']
    ],
    E: [
      ['How do you size a cable and a breaker for a load?', 'Load current, derating, voltage drop, short-circuit rating, installation method.'],
      ['Explain star-delta starting and VFD.', 'Reduces starting current vs variable speed control and energy saving.'],
      ['How do you troubleshoot a motor that trips repeatedly?', 'Check supply, insulation (megger), overload settings, bearings, load.'],
      ['What is power factor and how do you improve it?', 'cos φ; install capacitor banks or APFC panel to reduce penalties.'],
      ['Explain PLC/SCADA experience.', 'Hardware, ladder logic, I/O, HMI and a real fault you fixed.'],
      ['What safety procedures do you follow?', 'LOTO, permit to work, PPE, testing before touching.'],
      ['Explain a preventive maintenance plan.', 'Schedule, thermography, tightening, logs, spare management.']
    ]
  },
  'Teaching / Education': {
    F: [
      ['Why do you want to become a teacher?', 'Passion for learning, impact on students, an inspiring teacher you had.'],
      ['How will you handle a weak student?', 'Identify the reason, extra practice, patience, simple examples, parent communication.'],
      ['How do you plan a lesson?', 'Objective, introduction, activity, assessment, homework.'],
      ['How will you maintain discipline in class?', 'Rules together, positive reinforcement, engaging activities, calm tone.'],
      ['What is the role of technology in teaching?', 'Videos, quizzes, smart boards – to support, not replace, teaching.'],
      ['What is the NEP 2020?', 'India’s National Education Policy – 5+3+3+4 structure, mother tongue, skills, flexible learning.'],
      ['Give a demo of a 2-minute topic.', 'Simple language, example, ask a question, summarise.']
    ],
    E: [
      ['How do you make learning outcomes measurable?', 'Rubrics, formative and summative tests, tracking progress.'],
      ['How do you teach a mixed-ability class?', 'Differentiated tasks, peer learning, groups, extension activities.'],
      ['Describe a time you improved your class results.', 'Strategy, data (from X% to Y%), what you changed.'],
      ['How do you deal with a difficult parent?', 'Listen, show data, solution-focused, document.'],
      ['How do you integrate activity-based or digital learning?', 'Projects, flipped class, tools like Kahoot/Google Classroom.'],
      ['How do you handle bullying?', 'Immediate action, counselling, parents, school policy, prevention.'],
      ['How do you keep updated professionally?', 'Workshops, MOOCs, NCERT/board updates, peer observations.']
    ]
  },
  'Healthcare / Nursing': {
    F: [
      ['Why did you choose nursing / healthcare?', 'Genuine care for people, exposure during clinical postings.'],
      ['What are the vital signs and their normal ranges?', 'BP ~120/80 mmHg, pulse 60–100/min, respiration 12–20/min, temp ~98.6°F, SpO₂ ≥95%.'],
      ['How do you prevent hospital infection?', 'Hand hygiene (5 moments), PPE, sterilisation, biomedical waste segregation.'],
      ['What is the 5 rights of medication?', 'Right patient, drug, dose, route, time (and documentation).'],
      ['How do you handle a patient who refuses treatment?', 'Explain risks calmly, involve doctor/family, respect rights, document.'],
      ['What is CPR?', 'Chest compressions 100–120/min with rescue breaths – 30:2 for adults.'],
      ['How do you manage stress during long shifts?', 'Teamwork, breaks, prioritising, healthy habits.']
    ],
    E: [
      ['Describe a critical situation you handled.', 'Assessment, action, communication, outcome.'],
      ['How do you prioritise patients (triage)?', 'Airway, Breathing, Circulation; severity and urgency.'],
      ['How do you ensure patient safety and reduce errors?', 'Checklists, double-check, clear handover (SBAR), reporting culture.'],
      ['How do you supervise junior staff?', 'Delegation, teaching, supportive supervision.'],
      ['Explain documentation and legal aspects.', 'Accurate timely notes, consent, confidentiality.'],
      ['How do you deal with emotionally difficult cases?', 'Empathy, debrief, support system, professional boundaries.'],
      ['What quality standards (NABH) do you know?', 'Patient safety goals, infection control, documentation, audits.']
    ]
  },
  'Admin / Office / MS Office': {
    F: [
      ['Which MS Office tools can you use?', 'Word, Excel, PowerPoint, Outlook – give tasks you can do in each.'],
      ['Name 5 Excel formulas you know.', 'SUM, IF, VLOOKUP/XLOOKUP, COUNTIF, SUMIF, TEXT, CONCAT.'],
      ['How do you manage your daily tasks?', 'To-do list, priorities, calendar reminders, review at the end of the day.'],
      ['How do you write a professional email?', 'Clear subject, greeting, short body, action, closing, proofread.'],
      ['What is the use of Mail Merge?', 'Create personalised letters/labels from a list.'],
      ['What is your typing speed?', 'State WPM and accuracy.'],
      ['How do you handle confidential information?', 'Need-to-know, passwords, locked files, no sharing.']
    ],
    E: [
      ['How have you improved an office process?', 'Template, automation, checklist – time saved.'],
      ['How do you manage multiple executives’ requests?', 'Priorities, clarify deadlines, communicate trade-offs.'],
      ['Explain advanced Excel you use (Pivot, Power Query, macros).', 'Tasks automated and hours saved.'],
      ['How do you plan an event or travel?', 'Budget, vendors, checklist, contingency.'],
      ['How do you handle vendor negotiation and purchase approvals?', 'Quotations comparison, policy, approvals.'],
      ['How do you maintain records and compliance?', 'Naming, folder structure, versioning, audit trail.'],
      ['Describe a time you handled an urgent request.', 'Situation, steps, result.']
    ]
  },
  'Logistics / Operations / Supply Chain': {
    F: [
      ['What is supply chain management?', 'Planning and managing flow of goods from supplier to customer.'],
      ['What are Incoterms?', 'Standard trade terms (EXW, FOB, CIF) deciding who pays freight/insurance and risk.'],
      ['What is FIFO and LIFO?', 'First in first out; last in first out – inventory issue methods.'],
      ['What is a GRN?', 'Goods Receipt Note – proof of goods received.'],
      ['What documents are used in dispatch?', 'Invoice, e-way bill, LR/BL, packing list.'],
      ['What is a warehouse KPI?', 'Order accuracy, pick rate, inventory turnover, on-time dispatch.'],
      ['Which tools do you know?', 'Excel, ERP/SAP basics, barcode/WMS.']
    ],
    E: [
      ['How do you reduce transportation cost?', 'Route optimisation, load consolidation, carrier negotiation.'],
      ['Explain how you manage inventory levels.', 'ABC analysis, safety stock, reorder point, demand forecasting.'],
      ['How do you handle supplier delay?', 'Early warning, alternate source, expedite, communicate to customer.'],
      ['What KPIs do you track and how have you improved them?', 'OTIF, cost/shipment, stock accuracy – with numbers.'],
      ['How do you manage a warehouse team?', 'Shift planning, SOPs, safety, performance reviews.'],
      ['Explain e-way bill and GST compliance in logistics.', 'Required for goods movement above the limit; validity and documentation.'],
      ['How do you handle damaged or lost shipment claims?', 'Photos, survey, insurance claim, root cause.']
    ]
  }
};
PJD.IB_FIELDS = Object.keys(PJD.IB);
