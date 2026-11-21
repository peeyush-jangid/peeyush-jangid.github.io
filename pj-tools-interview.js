/* ===== Interview Questions (all fields, Fresher / Experienced) + Interview Practice with custom timer ===== */
(function () {
  if (!window.PJ || !PJ.qaList) return;

  const BANK = {
    'HR / General (all jobs)': `
F|Tell me about yourself.|Use Present – Past – Future in 60–90 seconds: your education/current role, one or two strengths or projects, and why this job fits your goal. Do not read your resume line by line.
F|Why should we hire you?|Match 2–3 skills to the job description and show willingness to learn: "I have X skill, I did Y project, and I will learn quickly on the job."
F|What are your strengths?|Pick 2–3 relevant strengths (learning speed, discipline, communication) with a small example from college, internship or project.
F|What is your weakness?|Name a real but harmless weakness and what you are doing about it – e.g. nervous in public speaking, so I joined presentations and practise daily.
F|Why do you want to join our company?|Mention 2 facts you researched (products, projects, culture) and link them to your career goal.
F|Where do you see yourself in 5 years?|Show growth in the same field: learn the process, take responsibility, become an expert/lead. Avoid saying you will start your own business or leave.
F|Are you willing to relocate or work in shifts?|Answer honestly. If yes, say "Yes, I am flexible and see it as a chance to learn." If limits exist, state them politely.
F|What are your salary expectations as a fresher?|Research the market range. Say: "I expect a fair package as per company norms and my skills – I am more interested in learning and growth."
F|Do you have any questions for us?|Always ask 1–2: training programme, what a successful first 6 months looks like, team structure.
F|Tell me about a time you worked in a team (college project/sports).|STAR: Situation, your Task, Action you took, Result. Highlight cooperation, not just your own credit.
E|Walk me through your career so far.|Summarize in 2 minutes: roles, biggest responsibility, a key achievement with numbers, and why you are ready for the next step.
E|Why are you leaving your current job?|Stay positive: growth, bigger responsibility, new technology, relocation. Never criticise your employer or boss.
E|What is your biggest achievement?|STAR with numbers – cost saved, revenue, time reduced, project delivered early – and your exact role in it.
E|Tell me about a conflict with a colleague or manager and how you solved it.|Show listening, focus on the problem not the person, compromise, and the positive result. Avoid blaming.
E|How do you handle pressure and tight deadlines?|Prioritise tasks, communicate early, break work in parts, ask for help when needed. Give an example of a deadline you met.
E|What is your notice period and expected CTC?|State notice period clearly (and if buy-out/negotiable). Give a range based on market research and say you are flexible for the right role.
E|How do you manage and motivate a team?|Set clear goals, give regular feedback, recognise good work, support learning, lead by example. Mention team size you handled.
E|Tell me about a mistake you made at work.|Own it, explain the fix and the process you added so that it never repeats. Interviewers value honesty and learning.
E|Why is there a gap in your career?|Be honest and brief: reason (study, family, health, upskilling) and what you did to stay updated. Show you are ready now.
E|Why should we hire you over other experienced candidates?|Highlight unique mix of skills, proven results, quick learning, and cultural fit with specific examples relevant to this job.
`,
    'HVAC / Mechanical': `
F|What is 1 Ton of Refrigeration (TR)?|1 TR = 12,000 BTU/h = 3.517 kW – the heat absorbed to melt 1 ton of ice in 24 hours.
F|Explain the vapour compression cycle.|Compressor raises pressure, condenser rejects heat and liquefies refrigerant, expansion valve drops pressure, evaporator absorbs heat from the space.
F|What are the main parts of a split AC?|Indoor unit (evaporator coil, blower, filter) and outdoor unit (compressor, condenser coil, fan) connected by copper pipes and cable.
F|What is the difference between window AC and split AC?|Window AC is one box in the wall; split AC separates noisy compressor outdoors, is quieter and flexible in installation.
F|What is the use of an expansion valve or capillary tube?|It drops the pressure and temperature of liquid refrigerant before it enters the evaporator.
F|Name common refrigerants.|R-22 (old), R-410A, R-32, R-134a, R-407C. R-32 and R-410A are common in new ACs.
E|Difference between chilled water system and VRF/VRV?|Chilled water uses a chiller + water pipes + AHU/FCU – good for large buildings. VRF uses refrigerant directly with variable compressor speed and zone control – flexible and energy efficient for medium buildings.
E|How do you size a duct for 2,000 CFM?|Choose velocity (e.g. 1,000 FPM main). Area = CFM ÷ FPM = 2 sq ft. Select a rectangular or round size from this area, check friction using equal friction method.
E|What checks are done in pre-commissioning?|Piping leak/pressure test, flushing, vacuum test for refrigerant lines, electrical megger test, motor rotation, damper/valve position, filter fitting, drain test, balancing readiness and documentation.
E|What is the difference between AHU, FCU and PAU?|AHU is a large air handling unit with coil and fan serving big areas. FCU is a small unit for one room. PAU (Primary Air Unit) conditions only fresh air.
E|How do you read a VRF drawing and plan piping?|Read outdoor/indoor unit capacity, branch joints, refrigerant pipe sizes (liquid/gas), maximum length/height limits, drain slope and electrical/control wiring from the schematic and legend.
E|How do you do site supervision and manage manpower?|Daily work plan from drawings, check material vs BOQ, assign gangs, quality checks (levels, slope, support spacing), safety (PPE, permit), progress report and measurement for billing.
`,
    'Software / IT': `
F|What is the difference between a compiler and an interpreter?|A compiler converts the whole program to machine code first (C, C++). An interpreter runs code line by line (Python, JavaScript).
F|What is OOP? Name its four pillars.|Object-Oriented Programming organises code into objects: Encapsulation, Abstraction, Inheritance, Polymorphism.
F|Difference between an array and a linked list?|Array has fixed size and fast index access; linked list grows dynamically and is quick to insert/delete but slow to access by index.
F|What is SQL and name basic commands.|Structured Query Language for databases: SELECT, INSERT, UPDATE, DELETE, CREATE, JOIN.
F|What is HTML, CSS and JavaScript?|HTML builds the structure, CSS styles it, JavaScript adds behaviour and interaction.
F|What is Git?|A version control system to track changes and collaborate. Commands: init, add, commit, push, pull, branch, merge.
E|Explain REST API and HTTP methods.|REST uses HTTP URLs to access resources: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Responses commonly in JSON with status codes.
E|What is the difference between SQL and NoSQL?|SQL: structured tables, ACID, joins (MySQL, PostgreSQL). NoSQL: flexible schemas, horizontal scale (MongoDB, Redis). Choose based on data and scale.
E|How do you optimise a slow query or web page?|Add indexes, avoid SELECT *, cache results, paginate, profile with EXPLAIN; for web: compress/minify, lazy load, CDN, reduce requests.
E|What is Agile and Scrum?|Agile is iterative delivery. Scrum has sprints, daily stand-ups, backlog, review and retrospective with roles PO, Scrum Master and team.
E|How do you handle a production bug?|Reproduce, check logs and recent deploys, rollback or hotfix, write root cause and add tests/alerts so it doesn't repeat.
E|Explain a project architecture you built.|Describe problem, tech stack, modules, database design, deployment and your exact contribution with numbers (users, performance, time saved).
`,
    'Data / Analytics': `
F|What is the difference between data and information?|Data is raw facts and numbers. Information is data processed into meaning to support decisions.
F|Name common Excel functions used for analysis.|SUM, AVERAGE, COUNTIF, SUMIFS, VLOOKUP/XLOOKUP, IF, INDEX-MATCH, PivotTable.
F|What is a PivotTable?|A tool to summarise large data by dragging fields into rows, columns and values.
F|What is SQL used for in analytics?|To fetch, filter, join and aggregate data from databases using SELECT, WHERE, GROUP BY and JOIN.
F|What is data cleaning?|Removing duplicates, fixing blanks, wrong formats and outliers so analysis is reliable.
F|Name some chart types and when to use them.|Bar for comparison, line for trend over time, pie for share, scatter for relationship.
E|Explain INNER, LEFT and RIGHT JOIN.|INNER returns matching rows from both tables; LEFT returns all left rows plus matches; RIGHT returns all right rows plus matches.
E|How do you handle missing values?|Check why they are missing; remove, fill with mean/median/mode, forward fill or model-based methods, and document the choice.
E|What is the difference between mean, median and mode?|Mean = average, median = middle value (better with outliers), mode = most frequent value.
E|How do you build a KPI dashboard?|Define business questions and KPIs, clean data, build measures, choose visuals (cards, trends, filters), validate numbers with the owner, automate refresh (Power BI/Tableau/Excel).
E|What is A/B testing?|Comparing two versions (A and B) with a random split of users to see which performs better statistically on a metric such as conversion.
E|Describe an analysis that changed a decision.|STAR: business problem, data used, method, insight, decision taken and measurable impact.
`,
    'Banking / Finance': `
F|What is KYC and why is it important?|Know Your Customer – verifying identity and address with documents (Aadhaar, PAN, etc.) to prevent fraud and money laundering.
F|Difference between savings and current account?|Savings account is for individuals with interest and limited transactions. Current account is for businesses with unlimited transactions and usually no interest.
F|What is the repo rate?|The rate at which RBI lends short-term money to commercial banks. A higher repo rate makes loans costlier.
F|What are CASA and NPA?|CASA = Current Account Savings Account deposits (low-cost funds). NPA = Non-Performing Asset – loan not paid for 90 days.
F|What is NEFT, RTGS and UPI?|NEFT: batch transfers, no minimum. RTGS: real-time for 2 lakh and above. UPI: instant mobile payments 24x7.
F|How will you sell a savings account to a new customer?|Find needs, explain benefits (interest, debit card, mobile banking, insurance), handle objections politely and complete KYC.
E|What is CRR and SLR?|CRR is the share of deposits banks keep with RBI as cash. SLR is the share kept in liquid assets like gold or government securities.
E|How do you assess a loan applicant?|Check KYC, income proof, CIBIL score, existing obligations (FOIR), collateral, purpose and repayment capacity (5 Cs of credit).
E|What is Basel III and why does it matter?|Global norms on capital adequacy, leverage and liquidity to make banks safer against financial stress.
E|How do you achieve monthly targets?|Break target into weekly actions, build a lead pipeline (referrals, walk-ins, existing customers), cross-sell products, and track conversion.
E|Explain AML and red flags.|Anti-Money Laundering monitors suspicious activity such as structuring cash deposits, unusual transfers or mismatched profile – reported via STR to FIU-IND.
E|How do you handle a customer complaint or fraud alert?|Listen, verify details, block card/account if needed, log the ticket, give timeline, escalate per policy and follow up.
`,
    'Accounts / Tally / GST': `
F|What are the golden rules of accounting?|Personal: debit the receiver, credit the giver. Real: debit what comes in, credit what goes out. Nominal: debit expenses/losses, credit incomes/gains.
F|What is the accounting equation?|Assets = Liabilities + Capital (Owner's equity).
F|Difference between debit note and credit note?|Debit note is issued to the supplier for purchase return/short supply. Credit note is issued to the customer for sales return/discount.
F|What is a trial balance?|A list of all ledger balances showing that total debits equal total credits.
F|What is GST and its types?|Goods and Services Tax: CGST + SGST for intra-state sales, IGST for inter-state, and UTGST for union territories.
F|Which vouchers are used in Tally Prime?|Contra (F4), Payment (F5), Receipt (F6), Journal (F7), Sales (F8), Purchase (F9), Debit Note (Ctrl+F9), Credit Note (Ctrl+F8).
E|How do you do bank reconciliation?|Compare the cash book with the bank statement, list cheques issued but not cleared, deposits not credited, bank charges and interest, and prepare the reconciliation statement.
E|Explain input tax credit (ITC).|Tax paid on purchases can be adjusted against output GST payable, subject to valid invoice, receipt of goods/services and supplier filing GSTR-1.
E|Which GST returns do you file?|GSTR-1 (outward supplies), GSTR-3B (summary & payment), GSTR-9 (annual), plus reconciliation with GSTR-2B.
E|What is TDS and the common sections?|Tax Deducted at Source: 192 (salary), 194C (contractors), 194J (professional fees), 194I (rent), 194A (interest). Deposit by 7th of next month and file quarterly returns.
E|How do you close books at year-end?|Pass adjustment entries (depreciation, prepaid/outstanding, provisions), reconcile ledgers, finalise stock, prepare Trial Balance, P&L and Balance Sheet, and audit.
E|What is the difference between fixed and current assets?|Fixed assets are long-term (machinery, building) used for business. Current assets are cash or convertible within a year (stock, debtors).
`,
    'Sales / Marketing': `
F|What is selling and what is marketing?|Marketing creates awareness and demand (research, branding, promotion). Selling converts that demand into orders.
F|What are the 4 Ps of marketing?|Product, Price, Place, Promotion.
F|How would you approach a new customer?|Greet, ask questions to understand needs, present suitable benefits, handle objections, close and follow up.
F|What do you do when a customer says it is too expensive?|Agree with empathy, show value and benefits, compare cost of ownership, offer options or EMI.
F|What is a lead and what is conversion?|A lead is a potential customer. Conversion is when the lead becomes a paying customer.
F|Are you comfortable with field work and targets?|Yes – explain how you plan route, follow up and learn from rejections. Give college/part-time example.
E|How do you build and manage a sales pipeline?|Prospect, qualify, present, negotiate, close; update CRM daily, prioritise high-probability deals and track conversion at each stage.
E|Explain a deal you closed against competition.|STAR: client need, competitor, your differentiator, actions (demo, reference, pricing), outcome in value.
E|How do you handle targets when the market is slow?|Focus on existing accounts, upsell/cross-sell, referrals, new segments, offers; review activity metrics weekly.
E|What is B2B vs B2C sales?|B2B sells to businesses with longer cycles and multiple decision makers. B2C sells to individuals with quicker, emotional decisions.
E|How do you negotiate price?|Understand the budget, sell value first, trade (give something to get something), avoid early discounts, close with a clear agreement.
E|What KPIs do you track?|Calls/meetings, conversion rate, average deal size, sales cycle, revenue vs target, customer retention.
`,
    'Digital Marketing': `
F|What is digital marketing?|Promoting products using online channels: SEO, social media, email, Google Ads and content.
F|What is SEO?|Search Engine Optimisation – improving a website to rank higher on Google organically using keywords, content, speed and links.
F|Difference between SEO and SEM?|SEO is free/organic ranking. SEM includes paid ads such as Google Ads.
F|Name some social media platforms and their use.|Instagram/Facebook for consumers, LinkedIn for B2B, YouTube for video, X for news.
F|What is a keyword?|A word or phrase users type into search engines. Choose keywords with search volume and low competition.
F|What is CTR?|Click Through Rate = Clicks ÷ Impressions × 100.
E|Explain on-page, off-page and technical SEO.|On-page: titles, content, headings. Off-page: backlinks, brand mentions. Technical: speed, mobile, sitemap, indexing and schema.
E|How do you run a Google Ads campaign?|Set goal, research keywords, create ad groups and ads, set budget and bidding, add conversion tracking, monitor CPC/CTR/ROAS and optimise.
E|What are CPC, CPM, CPA and ROAS?|Cost per click, per thousand impressions, per acquisition, and Return on Ad Spend = revenue ÷ ad cost.
E|How do you measure campaign success?|Use Google Analytics and platform insights to track traffic, conversion rate, cost per lead, ROI and retention against targets.
E|How do you plan a content calendar?|Define audience and goals, choose themes and formats, schedule weekly posts, repurpose content and review analytics monthly.
E|Describe a campaign you handled.|Goal, audience, channels, budget, creative idea, results (leads, ROAS) and what you learnt.
`,
    'BPO / Customer Support': `
F|What is BPO and what does a customer care executive do?|Business Process Outsourcing – companies hire BPOs for support. The executive handles customer queries on call, chat or email and resolves them politely.
F|How will you handle an angry customer?|Stay calm, listen without interrupting, apologise, empathise, offer a solution and confirm satisfaction.
F|Are you comfortable with night shifts and rotational shifts?|Answer honestly. If yes: "Yes, I understand the business needs and I am flexible."
F|What does good customer service mean to you?|Listening, empathy, quick and correct solutions, ownership and follow-up.
F|What is the difference between inbound and outbound calls?|Inbound: customers call you for support. Outbound: you call customers for sales, feedback or collections.
F|How is your typing speed and English communication?|State real speed (e.g. 30 WPM) and describe how you practise English daily by reading, listening and speaking.
E|What are AHT, CSAT, FCR and NPS?|AHT: average handle time. CSAT: customer satisfaction score. FCR: first contact resolution. NPS: Net Promoter Score.
E|How do you handle a call that you cannot resolve?|Be honest, take details, escalate to the right team with a ticket, give a timeline and follow up.
E|How do you stay motivated in repetitive work?|Set personal targets, track quality scores, learn product knowledge, take micro-breaks and aim for team lead growth.
E|Describe handling a difficult escalation.|STAR: the issue, steps taken (empathy, escalation, tracking), resolution and customer feedback.
E|How do you reduce handle time without hurting quality?|Know knowledge-base shortcuts, use templates, probe with the right questions, avoid dead air, document while talking.
E|What is KYC in BPO or banking process?|Verification of identity and address documents to authenticate customers and prevent fraud.
`,
    'Civil / Construction': `
F|What are the main ingredients of concrete?|Cement, fine aggregate (sand), coarse aggregate and water. M20 mix ratio is 1:1.5:3.
F|What is the slump test?|A test to measure the workability of fresh concrete by the height it settles after removing the cone.
F|What is curing and for how many days?|Keeping concrete moist after casting for strength gain – usually 7 days (OPC) and up to 14 days in some cases.
F|Name basic survey instruments.|Dumpy level, theodolite, total station, measuring tape and auto level.
F|What is a BOQ?|Bill of Quantities – itemised list of work with quantity, unit and rate for estimating and billing.
F|What is the difference between RCC and PCC?|PCC (plain cement concrete) has no steel and is used for levelling. RCC has reinforcement steel for strength.
E|How do you prepare a bar bending schedule (BBS)?|List each member, bar mark, diameter, shape, cut length, number, total length and weight using drawings and standard bend/hook allowances.
E|How do you check quality at site before concreting?|Verify formwork alignment, cover blocks, reinforcement as per drawing, cleaning, MEP sleeves, mix approval and slump; take cube samples.
E|What is the difference between M20 and M25 grade?|The number is the characteristic compressive strength in N/mm2 after 28 days – M20 = 20 N/mm2, M25 = 25 N/mm2.
E|How do you do measurement and bill certification?|Take joint measurement with contractor as per drawing/BOQ, record in measurement book, prepare running account bill and certify after quality checks.
E|How do you manage site safety?|Toolbox talks, PPE, scaffolding checks, barricading, permit-to-work for height/hot work, incident reporting.
E|How do you recover a delayed project?|Find the cause, prepare a recovery schedule, add manpower/shifts, prioritise critical path, track daily and update the client.
`,
    'Electrical / Electronics': `
F|State Ohm's law.|V = I × R – voltage equals current times resistance.
F|Difference between AC and DC?|AC changes direction periodically (50 Hz in India). DC flows in one direction (batteries).
F|What is the function of a fuse and an MCB?|Both protect circuits from overload and short circuit. A fuse melts and needs replacement; an MCB trips and can be reset.
F|What is earthing and why is it needed?|Connecting metal parts to the ground to carry fault current safely and protect people and equipment from shock.
F|Difference between series and parallel circuits?|Series: same current, voltages add. Parallel: same voltage, currents add.
F|What are basic components in electronics?|Resistor, capacitor, inductor, diode, transistor and IC.
E|Explain star and delta connection.|Star: line voltage = √3 × phase voltage, used for starting and distribution. Delta: line voltage = phase voltage, used for running large motors.
E|What is power factor and how do you improve it?|PF = kW ÷ kVA. Improve using capacitor banks or APFC panels to cut losses and penalties.
E|What are the starting methods of a three-phase induction motor?|DOL, star-delta, auto-transformer and soft starter or VFD depending on motor size.
E|How do you select a cable size?|Based on load current, voltage drop, short-circuit rating, installation method and derating factors.
E|What is the difference between MCB, MCCB, ELCB and RCCB?|MCB: small loads. MCCB: higher current with adjustable trip. ELCB/RCCB: detect earth leakage current and trip for shock protection.
E|What tests do you perform before energising a panel?|Insulation resistance (megger), continuity, polarity, earth resistance, tightness of terminations and protection settings.
`,
    'Teaching / Education': `
F|Why do you want to become a teacher?|Share passion for the subject and helping students grow, with an example of tutoring or mentoring.
F|How do you make a lesson interesting?|Use examples, activities, questions, visuals, group work and real-life connections.
F|How would you handle a weak student?|Identify the reason, give extra practice, simple examples, encouragement and regular feedback with parents' support.
F|How do you maintain classroom discipline?|Set rules on day one, be fair and consistent, engage students, appreciate good behaviour and address issues privately.
F|What is a lesson plan?|A plan with objectives, teaching method, activities, resources and assessment for a period.
F|How do you use technology in teaching?|Smart board, PPT, videos, quizzes (Google Forms), learning apps and online assignments.
E|Explain formative and summative assessment.|Formative checks learning during the course (quizzes, activities). Summative evaluates at the end (exams). Use both.
E|How do you teach mixed-ability classes?|Differentiated tasks, peer learning, flexible grouping, scaffolded questions and extension activities.
E|How do you involve parents?|Regular PTMs, progress reports, calls/WhatsApp updates, and sharing positive feedback along with improvement areas.
E|Describe a lesson/innovation that improved results.|STAR with numbers – marks/attendance improvement after the method used.
E|How do you handle a difficult parent or student?|Listen calmly, stay professional, focus on the child's progress, document and involve the coordinator when needed.
E|What do you know about NEP 2020?|Focus on foundational literacy, flexible multidisciplinary learning, 5+3+3+4 structure, mother-tongue instruction, competency-based assessment and skill education.
`,
    'Healthcare / Nursing': `
F|What are the vital signs?|Temperature, pulse, respiration, blood pressure and oxygen saturation (SpO2).
F|What is the normal range of adult BP and pulse?|BP about 120/80 mmHg; pulse 60–100 beats per minute.
F|Why is hand hygiene important?|It prevents hospital-acquired infections. Use soap or alcohol rub – the WHO 5 moments of hand hygiene.
F|What is the role of a nurse?|Patient care, giving medication, monitoring, documentation, assisting doctors, patient education and emotional support.
F|What are the 5 rights of medication administration?|Right patient, drug, dose, route and time.
F|How will you handle an anxious patient or family?|Stay calm, listen, explain procedure in simple words, show empathy and involve the family.
E|How do you prioritise multiple patients (triage)?|Assess airway–breathing–circulation first; critical patients get priority, then urgent, then stable.
E|Explain infection control and biomedical waste segregation.|Standard precautions, PPE, sterilisation and colour-coded bins: yellow (infectious), red (plastic), blue (glass), white (sharps).
E|What do you do in a cardiac arrest (code blue)?|Call for help, check responsiveness, start CPR (30:2), use AED, give emergency drugs as per protocol, record timing.
E|How do you document and hand over a shift?|Use SBAR (Situation, Background, Assessment, Recommendation) and update charts accurately.
E|How do you handle a medication error?|Ensure patient safety, inform doctor, monitor, report as per hospital policy and review to prevent recurrence.
E|Describe a challenging patient case you managed.|STAR: condition, your assessment and actions, team coordination and the outcome.
`,
    'HR / Admin / Office (MS Office)': `
F|What is the role of an HR executive?|Recruitment, onboarding, attendance and payroll support, employee records and engagement.
F|Which MS Office tools do you know?|Word for letters, Excel for data (formulas, pivot), PowerPoint for presentations, Outlook for email.
F|How do you write a professional email?|Clear subject, greeting, short purpose, details, action needed, polite closing and signature.
F|How do you prioritise multiple tasks?|List, rank by urgency and importance, use calendar/reminders and update seniors on progress.
F|What is data entry accuracy and speed?|State your typing speed (WPM) and accuracy percentage; mention double-checking and shortcuts.
F|What is a joining formality?|Collect documents, offer/appointment letter, ID card, bank details, induction and system access.
E|Explain the recruitment process you handled.|Job description, sourcing (portals, referrals), screening, interviews, offer, background check and onboarding – with hiring numbers and time-to-hire.
E|How do you calculate attendance and salary?|Working days minus leave/LOP, add allowances, deduct PF/ESI/PT/TDS and generate payslips using Excel or payroll software.
E|How do you handle employee grievances?|Listen confidentially, document, investigate fairly, involve the manager, resolve within timelines and follow up.
E|Which Excel functions do you use in HR/Admin?|VLOOKUP/XLOOKUP, COUNTIF, SUMIFS, IF, pivot tables, data validation and conditional formatting.
E|How do you handle vendor and office administration?|Maintain vendor list, compare quotes, issue POs, track AMC and invoices, and control budget.
E|What are PF, ESI and gratuity basics?|PF: retirement fund (12% employee + employer). ESI: health insurance for lower-income staff. Gratuity: payable after 5 years of service.
`,
    'Operations / Logistics': `
F|What is supply chain?|The network of making and moving a product from supplier to manufacturer to customer.
F|What is inventory and why manage it?|Stock of goods. Good management avoids shortage and excess and saves cost.
F|What is a warehouse and its main activities?|Receiving, putaway, storage, picking, packing and dispatch.
F|What is a GRN?|Goods Received Note – record of goods received against a purchase order after checking quantity and quality.
F|What is FIFO?|First In First Out – oldest stock is issued first, essential for expiry items.
F|What documents are used in dispatch?|Invoice, packing list, e-way bill, LR (lorry receipt) and delivery challan.
E|Explain ABC analysis.|Classifies inventory by value: A (high value, tight control), B (medium), C (low value, simple control).
E|What are KPIs in logistics?|On-time delivery, order accuracy, inventory turnover, warehouse utilisation, cost per shipment and damage rate.
E|How do you reduce transportation cost?|Route optimisation, full truck load, consolidation, backhaul, right carrier selection and rate negotiation.
E|What is an e-way bill?|An electronic document required to move goods above Rs 50,000 in value, generated on the GST portal.
E|How do you handle a delayed or damaged shipment?|Track with carrier, inform customer, document the damage, raise a claim and arrange replacement.
E|What is ERP/WMS and how have you used it?|ERP integrates business processes; WMS manages warehouse tasks. Mention SAP, Tally or Zoho modules used for orders, stock and reports.
`
  };

  const FIELDS = Object.keys(BANK);
  const ALL = [];
  FIELDS.forEach(f => PJ.qa(BANK[f]).forEach(x => ALL.push({ g: f, l: x.l, q: x.q, a: x.a })));
  PJ.IV = { FIELDS, ALL };

  /* ---------- Tool 1: Interview Questions (study with answers) ---------- */
  const IQT = TOOLS.find(t => t.id === 'interview-questions');
  if (IQT) {
    IQT.name = 'Interview Questions – All Fields'; IQT.ico = '🎤';
    IQT.desc = `${ALL.length}+ questions with model answers for every field – separate Fresher & Experienced sets`;
    IQT.tags = ['Fresher', 'Experienced'];
    IQT.render = el => { CLEANUP = PJ.cleanup; PJ.qaList(el, { items: ALL, groups: FIELDS, levels: ['F', 'E'], title: 'Interview Questions', name: 'interview-questions' }); };
  }

  /* ---------- Tool 2: Interview Practice (mock interview with custom timer) ---------- */
  const beep = () => { try { const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = .15; o.start(); setTimeout(() => { o.stop(); c.close(); }, 450); } catch (e) { } };
  const IP = TOOLS.find(t => t.id === 'interview-practice');
  if (IP) {
    IP.name = 'Interview Practice – Mock Interview'; IP.ico = '🎯';
    IP.desc = 'Choose your field & level, set your own timer, speak or type answers, rate yourself and track progress';
    IP.tags = ['Custom timer', 'Fresher', 'Experienced'];
    IP.render = el => {
      CLEANUP = PJ.cleanup;
      const pref = PJ.LS.get('iv_pref', { f: FIELDS[0], l: 'F', n: 10, ord: 'rand', m: 2, s: 0, tot: 0, say: 0, auto: 1, hint: 1 });
      const hist = PJ.LS.get('iv_hist', []);
      const setup = () => {
        PJ.cleanup();
        el.innerHTML = `<div class="card"><h3>🎯 Set up your mock interview</h3><div class="form">
          <label class="fld"><span>Field / Job type</span><select id="f">${FIELDS.map(f => `<option ${f === pref.f ? 'selected' : ''}>${esc(f)}</option>`).join('')}</select></label>
          <label class="fld"><span>I am a</span><select id="l"><option value="F" ${pref.l === 'F' ? 'selected' : ''}>Fresher (0–1 year)</option><option value="E" ${pref.l === 'E' ? 'selected' : ''}>Experienced</option></select></label>
          <label class="fld"><span>Number of questions</span><select id="n">${[5, 10, 15, 20, 999].map(n => `<option value="${n}" ${n == pref.n ? 'selected' : ''}>${n === 999 ? 'All' : n}</option>`).join('')}</select></label>
          <label class="fld"><span>Order</span><select id="ord"><option value="rand" ${pref.ord === 'rand' ? 'selected' : ''}>Random</option><option value="seq" ${pref.ord === 'seq' ? 'selected' : ''}>As listed</option></select></label>
          <label class="fld"><span>Add HR / general questions</span><select id="gen"><option value="1" ${pref.gen == 1 ? 'selected' : ''}>Yes – mix in common HR</option><option value="0" ${pref.gen == 1 ? '' : 'selected'}>No – field questions only</option></select></label></div>
          <h4>⏱ Your timer (you decide)</h4>
          <div class="pj-bar"><label class="fld sm"><span>Minutes</span><input id="tm" type="number" min="0" max="60" value="${pref.m}"></label><label class="fld sm"><span>Seconds</span><input id="ts" type="number" min="0" max="59" step="5" value="${pref.s}"></label>
            <div class="sugg" style="margin:0 0 4px">${[['30 s', 0, 30], ['1 min', 1, 0], ['2 min', 2, 0], ['3 min', 3, 0], ['5 min', 5, 0], ['No timer', 0, 0]].map(p => `<button data-m="${p[1]}" data-s="${p[2]}">${p[0]}</button>`).join('')}</div>
            <label class="fld sm"><span>Total interview (min, 0 = none)</span><input id="tot" type="number" min="0" max="180" value="${pref.tot}"></label></div>
          <div class="row" style="margin-top:0"><label style="display:flex;gap:6px;align-items:center;font-size:.85rem"><input type="checkbox" id="say" style="width:auto" ${pref.say ? 'checked' : ''}> 🔊 Read question aloud</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.85rem"><input type="checkbox" id="auto" style="width:auto" ${pref.auto ? 'checked' : ''}> Start timer automatically</label>
          <label style="display:flex;gap:6px;align-items:center;font-size:.85rem"><input type="checkbox" id="hint" style="width:auto" ${pref.hint ? 'checked' : ''}> Show model answer after I answer</label></div>
          <div class="row"><button class="btn" id="go">Start interview →</button></div></div>
          ${hist.length ? `<div class="card"><h3>Your recent practice</h3><div class="scroll"><table><tr><th>Date</th><th>Field</th><th>Level</th><th class="r">Questions</th><th class="r">Avg self-rating</th><th class="r">Avg time</th></tr>${hist.slice(0, 8).map(h => `<tr><td>${esc(h.d)}</td><td>${esc(h.f)}</td><td>${PJ.LVN[h.l]}</td><td class="r">${h.n}</td><td class="r">${h.r || '—'} / 5</td><td class="r">${PJ.mmss(h.t)}</td></tr>`).join('')}</table></div></div>` : ''}`;
        $$('.sugg button', el).forEach(b => b.onclick = e => { e.preventDefault(); $('#tm', el).value = b.dataset.m; $('#ts', el).value = b.dataset.s; });
        $('#go', el).onclick = () => {
          const p = { f: $('#f', el).value, l: $('#l', el).value, n: +$('#n', el).value, ord: $('#ord', el).value, gen: +$('#gen', el).value, m: Math.max(0, +$('#tm', el).value || 0), s: Math.max(0, Math.min(59, +$('#ts', el).value || 0)), tot: Math.max(0, +$('#tot', el).value || 0), say: $('#say', el).checked ? 1 : 0, auto: $('#auto', el).checked ? 1 : 0, hint: $('#hint', el).checked ? 1 : 0 };
          PJ.LS.set('iv_pref', p); run(p);
        };
      };

      const run = (p, only) => {
        let pool = only || ALL.filter(x => x.l === p.l && x.g === p.f);
        if (!only && p.gen && p.f !== FIELDS[0]) pool = pool.concat(shuffleTake(ALL.filter(x => x.l === p.l && x.g === FIELDS[0]), 3));
        pool = p.ord === 'seq' && !only ? pool : PJ.shuffle(pool);
        const qs = pool.slice(0, Math.min(p.n, pool.length));
        const per = p.m * 60 + p.s;
        const rec = qs.map(q => ({ q, ans: '', used: 0, rate: 0, up: 0 }));
        let i = 0, left = per, run1 = null, totLeft = p.tot * 60, totId = null, started = Date.now(), qStart = 0, listening = null;
        const stopQ = () => { if (run1) { PJ.clear(run1); run1 = null; } };
        const say = t => { if (!p.say) return; try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-IN'; speechSynthesis.speak(u); } catch (e) { } };
        const finish = () => {
          stopQ(); if (totId) PJ.clear(totId); try { if (listening) listening.stop(); speechSynthesis.cancel(); } catch (e) { }
          const done = rec.filter(r => r.ans.trim() || r.used > 0), rated = rec.filter(r => r.rate), avgR = rated.length ? +(rated.reduce((a, r) => a + r.rate, 0) / rated.length).toFixed(1) : 0;
          const avgT = done.length ? Math.round(done.reduce((a, r) => a + r.used, 0) / done.length) : 0;
          const h = PJ.LS.get('iv_hist', []); h.unshift({ d: new Date().toLocaleDateString('en-IN'), f: p.f, l: p.l, n: rec.length, r: avgR, t: avgT }); PJ.LS.set('iv_hist', h.slice(0, 15));
          const weak = rec.filter(r => r.rate && r.rate <= 2).map(r => r.q);
          el.innerHTML = `<div class="card"><h3>✅ Interview finished</h3><div class="pj-stat"><div><small>Questions</small><b>${rec.length}</b></div><div><small>Answered</small><b>${done.length}</b></div><div><small>Avg self-rating</small><b>${avgR || '—'} / 5</b></div><div><small>Avg time / answer</small><b>${PJ.mmss(avgT)}</b></div><div><small>Time up on</small><b>${rec.filter(r => r.up).length}</b></div><div><small>Total time</small><b>${PJ.mmss(Math.round((Date.now() - started) / 1000))}</b></div></div>
            <p class="note" style="margin:0">${avgR >= 4 ? 'Great confidence! Now practise with Experienced / another field.' : avgR >= 3 ? 'Good. Revise model answers for the low-rated questions and practise again.' : 'Keep practising – read the model answers, speak them in your own words and try again tomorrow.'}</p>
            <div class="row"><button class="btn" id="again">New interview</button>${weak.length ? `<button class="btn ghost" id="wk">Practise weak questions (${weak.length})</button>` : ''}<button class="btn ghost" id="dn">⬇ Download my notes (Word)</button></div></div>
            <div class="card"><h3>Your answers & model answers</h3>${rec.map((r, k) => `<details><summary>${k + 1}. ${esc(r.q.q)} ${r.rate ? '· ⭐' + r.rate : ''}</summary><p><b>Your answer</b> (${PJ.mmss(r.used)}${r.up ? ', time up' : ''}):<br>${esc(r.ans) || '<i>not written</i>'}</p><p><b>Model answer / key points:</b><br>${esc(r.q.a)}</p></details>`).join('')}</div>`;
          $('#again', el).onclick = setup;
          const wk = $('#wk', el); if (wk) wk.onclick = () => run(Object.assign({}, p, { tot: 0 }), weak);
          $('#dn', el).onclick = () => dlDoc('interview-notes', 'Interview notes', `<h1>Interview practice – ${esc(p.f)} (${PJ.LVN[p.l]})</h1><p>${new Date().toLocaleString()}</p>` + rec.map((r, k) => `<h3>${k + 1}. ${esc(r.q.q)}</h3><p><b>My answer:</b> ${esc(r.ans) || '-'}</p><p><b>Self-rating:</b> ${r.rate || '-'} / 5</p><p><b>Model answer:</b> ${esc(r.q.a)}</p>`).join(''));
        };
        const show = () => {
          stopQ(); const r = rec[i]; left = per; let revealed = false;
          el.innerHTML = `<div class="card"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center"><div><span class="lv ${p.l === 'F' ? 'f' : 'e'}">${PJ.LVN[p.l]}</span> <span class="chip">${esc(r.q.g)}</span></div><div class="note" style="margin:0">Question ${i + 1} of ${rec.length}${p.tot ? ` · Interview time left <b id="tl">${PJ.mmss(totLeft)}</b>` : ''}</div></div>
            <div class="pj-meter" style="margin:10px 0"><i style="width:${i / rec.length * 100}%"></i></div>
            <h3 class="iv-q" style="margin-top:12px">${esc(r.q.q)}</h3>
            <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:10px 0"><span class="iv-clock" id="clk">${per ? PJ.mmss(per) : '∞'}</span>
              ${per ? '<button class="btn" id="st">Start timer</button><button class="btn ghost" id="rs">Reset</button>' : '<span class="note">No timer – answer at your own pace.</span>'}<button class="btn ghost sm" id="rd">🔊 Read aloud</button></div>
            <label class="fld"><span>Your answer – speak it aloud first, then note key points (or use the mic)</span><textarea id="ans" rows="6" placeholder="Type or dictate your answer…">${esc(r.ans)}</textarea></label>
            <div class="note" id="wc" style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><span>0 words</span><span>Ideal: 60–150 words (about 1 minute)</span></div>
            <div class="row"><button class="btn ghost sm" id="mic">🎤 Dictate</button><button class="btn ghost sm" id="hn">💡 Show model answer</button></div>
            <div id="hv"></div>
            <div class="iv-rate" style="margin:12px 0"><span class="note" style="margin-right:8px">Rate your answer:</span>${[1, 2, 3, 4, 5].map(n => `<button data-r="${n}" class="${r.rate === n ? 'on' : ''}">${n}⭐</button>`).join(' ')}</div>
            <div class="row"><button class="btn ghost" id="pv" ${i ? '' : 'disabled'}>← Previous</button><button class="btn" id="nx">${i === rec.length - 1 ? 'Finish ✔' : 'Next question →'}</button><button class="btn red" id="en">End interview</button></div></div>`;
          const ta = $('#ans', el), clk = $('#clk', el);
          const wc = () => { const n = (ta.value.match(/\S+/g) || []).length; $('#wc span', el).textContent = n + ' words'; };
          const save = () => { r.ans = ta.value; r.used = per ? Math.min(per - left, per) + (r.up ? 0 : 0) : r.used; };
          const tick = () => { left--; r.used = per - Math.max(left, 0); clk.textContent = PJ.mmss(Math.max(left, 0)); clk.classList.toggle('low', left <= 15); if (left <= 0) { stopQ(); r.up = 1; beep(); toast('Time up! ⏰'); const s = $('#st', el); if (s) s.textContent = 'Start timer'; } };
          const startT = () => { if (!per || run1) return; if (left <= 0) left = per; run1 = PJ.timer(tick, 1000); const s = $('#st', el); if (s) s.textContent = 'Pause'; };
          if (per) { $('#st', el).onclick = () => { if (run1) { stopQ(); $('#st', el).textContent = 'Resume'; } else startT(); }; $('#rs', el).onclick = () => { stopQ(); left = per; r.up = 0; clk.textContent = PJ.mmss(per); clk.classList.remove('low'); $('#st', el).textContent = 'Start timer'; }; }
          ta.addEventListener('input', () => { wc(); r.ans = ta.value; if (per && !run1 && p.auto && left > 0) startT(); });
          wc();
          $('#rd', el).onclick = () => { const o = p.say; p.say = 1; say(r.q.q); p.say = o; };
          const reveal = () => { $('#hv', el).innerHTML = `<div class="iv-hint"><b>Model answer / key points</b><br>${esc(r.q.a)}</div>`; };
          $('#hn', el).onclick = reveal;
          $$('.iv-rate button', el).forEach(b => b.onclick = () => { r.rate = +b.dataset.r; $$('.iv-rate button', el).forEach(x => x.classList.toggle('on', x === b)); if (p.hint) reveal(); });
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition, mic = $('#mic', el);
          if (!SR) mic.hidden = true; else mic.onclick = () => {
            if (listening) { listening.stop(); return; }
            listening = new SR(); listening.lang = 'en-IN'; listening.continuous = true; listening.interimResults = false;
            listening.onresult = e => { let t = ''; for (let k = e.resultIndex; k < e.results.length; k++) t += e.results[k][0].transcript + ' '; ta.value = (ta.value + ' ' + t).trim(); r.ans = ta.value; wc(); };
            listening.onend = () => { listening = null; mic.textContent = '🎤 Dictate'; }; listening.onerror = () => { }; mic.textContent = '⏹ Stop dictation'; try { listening.start(); } catch (e) { }
          };
          const leave = () => { try { if (listening) listening.stop(); } catch (e) { } stopQ(); r.ans = ta.value; };
          $('#pv', el).onclick = () => { leave(); i--; show(); };
          $('#nx', el).onclick = () => { leave(); if (i === rec.length - 1) finish(); else { i++; show(); } };
          $('#en', el).onclick = () => { leave(); finish(); };
          if (p.say) say(r.q.q);
          if (per && p.auto && !r.up && r.used === 0) startT();
        };
        if (p.tot) totId = PJ.timer(() => { totLeft--; const t = $('#tl', el); if (t) t.textContent = PJ.mmss(Math.max(totLeft, 0)); if (totLeft <= 0) { beep(); toast('Interview time is over'); const ta = $('#ans', el); if (ta) rec[i].ans = ta.value; finish(); } }, 1000);
        if (!qs.length) { toast('No questions for this selection'); return setup(); }
        show();
      };
      const shuffleTake = (a, n) => PJ.shuffle(a).slice(0, n);
      setup();
    };
  }
})();
