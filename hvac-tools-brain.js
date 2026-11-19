/* HVAC tools brain for Peeyush's AI assistant.
   1) window.HVAC_TOOLS_KB      : text describing every tool (paste into the assistant's knowledge / system prompt).
   2) window.hvacToolsAnswer(q) : returns a ready answer string (with calculation) or null if the question is not about a tool. */
(function () {
  var SITE = 'https://peeyush-jangid.github.io/';

  var KB = [
    'FREE HVAC TOOLS on Peeyush Kumar Jangid\'s website and app (menu: Our Services > tools; app: Tools tab). Free, no sign-in.',
    'BASIC TOOLS (' + SITE + 'tools.html):',
    '- AC tonnage (#t1): room size, room type, people, top floor and sun give the AC ton needed. Rule: about 100 BTU/hr per sq ft bedroom, 110 hall/office, 140 kitchen, 150 shop; 12,000 BTU/hr = 1 ton.',
    '- BTU / kW / TR converter (#t2): 1 TR = 12,000 BTU/hr = 3.517 kW.',
    '- Duct size (#t3): area = CFM / velocity (FPM); round diameter from area; rectangular size for a fixed height.',
    '- Electrical details (#t4): from kW or HP, phase, power factor, cable length gives full-load current, MCB rating, cable size (Cu or Al), voltage drop, earth wire.',
    'PRO TOOLKIT (' + SITE + 'pro.html):',
    '- Cooling load (#p1): walls, roof, glass, people, lights, equipment, fresh air; gives TR, kW, supply air L/s and CFM, with print to PDF.',
    '- Psychrometrics (#p2): dry bulb and RH give wet bulb, dew point, humidity ratio, enthalpy, density.',
    '- Chilled water pipe and pump (#p3): TR and delta T give flow, pipe DN, velocity, friction, pump head and kW.',
    '- AC cost comparison (#p4): two ACs, 10-year total cost and payback.',
    'MORE TOOLS (' + SITE + 'tools2.html):',
    '- Duct static pressure (#x1): airflow and friction rate give duct size, velocity and total static pressure including fittings and filter.',
    '- EER / COP / kW per TR (#x2): COP = cooling kW / input kW; EER = COP x 3.412; kW/TR = 3.517 / COP.',
    '- Fan and pump VFD savings (#x3): power with VFD ~ flow^3 / 0.97; compares with damper control and gives payback.',
    '- BOQ / quotation maker (#x4): add items, qty, rate, discount, GST; amount in words; print or save as PDF.',
    'All results are estimates. Final design needs a site survey and a qualified engineer.'
  ].join('\n');

  var f1 = function (n, d) { return (+n).toLocaleString('en-IN', { maximumFractionDigits: d == null ? 1 : d }); };
  var N = '(\\d+(?:\\.\\d+)?)';
  var get = function (t, re) { var m = t.match(re); return m ? parseFloat(m[1]) : null; };
  var has = function (t, words) { return words.some(function (w) { return t.indexOf(w) > -1; }); };
  var link = function (p, name) { return '\n\nTool kholo: ' + name + ' → ' + SITE + p; };

  function tonnage(t) {
    var area = null, m = t.match(new RegExp(N + '\\s*(?:x|×|\\*|by)\\s*' + N));
    var metric = has(t, ['meter', 'metre', 'mtr']);
    if (m) area = parseFloat(m[1]) * parseFloat(m[2]);
    else { var a = get(t, new RegExp(N + '\\s*(?:sq\\.?\\s*ft|sqft|square feet|sq ft|sq\\.?\\s*m|sqm)')); if (a) { area = a; if (/sq\.?\s*m|sqm/.test(t)) metric = true; } }
    if (!area) return null;
    if (metric) area *= 10.764;
    var f = 100, type = 'bedroom';
    if (has(t, ['hall', 'living', 'drawing'])) { f = 110; type = 'hall / living room'; }
    else if (has(t, ['office', 'cabin'])) { f = 110; type = 'office'; }
    else if (has(t, ['shop', 'showroom', 'store'])) { f = 150; type = 'shop'; }
    else if (has(t, ['kitchen', 'restaurant', 'hotel'])) { f = 140; type = 'kitchen / restaurant'; }
    var k = 1; if (has(t, ['top floor', 'terrace', 'chhat', 'roof'])) k *= 1.1; if (has(t, ['sun', 'dhoop', 'west', 'garmi'])) k *= 1.1;
    var btu = area * f * k, tr = btu / 12000, sizes = [0.75, 1, 1.5, 2, 2.5, 3, 4, 5];
    var pick = sizes.filter(function (s) { return s >= tr - 0.05; })[0] || Math.ceil(tr * 2) / 2;
    return 'Room ~' + f1(area, 0) + ' sq ft (' + type + ') ke liye lagbhag ' + f1(btu, 0) + ' BTU/hr yaani ' + f1(tr, 2) + ' TR chahiye. Isliye **' + pick + ' ton AC** theek rahega.' +
      (k > 1 ? ' (Top floor / dhoop ka extra load joda gaya hai.)' : '') + ' Ye andaza hai, 400 sq ft se bade ya khaas rooms me engineer se check karao.' + link('tools.html#t1', 'AC tonnage');
  }

  function convert(t) {
    var m = t.match(new RegExp(N + '\\s*(btu|tr|ton|kw)'));
    if (!m) return null;
    var v = parseFloat(m[1]), u = m[2], tr = u === 'btu' ? v / 12000 : u === 'kw' ? v / 3.517 : v;
    return v + ' ' + u.toUpperCase() + ' = ' + f1(tr, 3) + ' TR = ' + f1(tr * 12000, 0) + ' BTU/hr = ' + f1(tr * 3.517, 3) + ' kW (cooling).' + link('tools.html#t2', 'BTU / kW / TR converter');
  }

  function duct(t) {
    var cfm = get(t, new RegExp(N + '\\s*cfm')); if (!cfm) return null;
    var v = get(t, new RegExp(N + '\\s*fpm')) || 900, A = cfm / v, d = Math.sqrt(4 * A / Math.PI) * 12;
    var h = get(t, new RegExp(N + '\\s*(?:inch|in|")\\s*(?:height|high)')) || 10;
    return cfm + ' CFM, ' + v + ' FPM velocity par duct area = ' + f1(A * 144, 0) + ' sq inch. Round duct ~**' + Math.ceil(d) + ' inch** dia. Rectangular (height ' + h + ' inch) ke liye width ~**' + Math.ceil(A * 144 / h) + ' inch**.' + link('tools.html#t3', 'Duct size');
  }

  function electrical(t) {
    var kw = get(t, new RegExp(N + '\\s*kw')), hp = get(t, new RegExp(N + '\\s*hp'));
    if (!kw && !hp) return null;
    var single = /single|1 phase|1-phase|1ph|1 ph/.test(t), ph = single ? 1 : 3, V = single ? 230 : 415;
    var eff = (get(t, new RegExp('efficiency\\s*' + N)) || 90) / 100, pf = get(t, new RegExp('(?:pf|power factor)\\s*' + N)) || 0.85;
    var P = kw || hp * 0.746 / eff, k = ph === 3 ? Math.sqrt(3) : 1, I = P * 1000 / (k * V * pf), Id = I * 1.25;
    var br = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800];
    var mcb = br.filter(function (x) { return x >= Id; })[0], need = mcb || Id;
    var al = has(t, ['alumin']), L = get(t, new RegExp(N + '\\s*(?:m|mtr|meter|metre)\\b')) || 30;
    var sz = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300], am = [18, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269, 309, 353, 415, 480];
    var rho = al ? 0.0368 : 0.0225, lim = 0.03 * V, c = -1, m2 = ph === 3 ? Math.sqrt(3) : 2;
    for (var i = 0; i < sz.length; i++) { if (al && sz[i] < 16) continue; if (am[i] * (al ? 0.78 : 1) >= need && m2 * I * L * rho / sz[i] <= lim) { c = i; break; } }
    return (kw ? kw + ' kW' : hp + ' HP motor (~' + f1(P, 2) + ' kW input)') + ', ' + ph + '-phase ' + V + ' V, PF ' + pf + ':\n' +
      '• Full-load current: **' + f1(I, 1) + ' A** (design 125% = ' + f1(Id, 1) + ' A)\n• MCB: **' + (mcb || 'custom') + ' A**\n• Cable (' + (al ? 'Al' : 'Cu') + ', ' + L + ' m, 3% drop): ' + (c >= 0 ? '**' + sz[c] + ' mm²**' : 'bahut bada, parallel run lagega') +
      '\n• DOL start current ~' + f1(I * 6, 0) + ' A\nCompressor ke liye motor-rated breaker aur starter lagta hai. Final selection licensed electrician se confirm karo.' + link('tools.html#t4', 'Electrical details');
  }

  function eer(t) {
    var tr = get(t, new RegExp(N + '\\s*tr\\b')), kws = (t.match(new RegExp(N + '\\s*kw', 'g')) || []).map(parseFloat), cap, p;
    if (tr && kws.length) { cap = tr * 3.517; p = kws[kws.length - 1]; }
    else if (kws.length >= 2) { cap = kws[0]; p = kws[1]; } else return null;
    var cop = cap / p, kwtr = p / (cap / 3.517);
    var lab = kwtr < 0.6 ? 'Excellent' : kwtr < 0.8 ? 'Very good' : kwtr < 1 ? 'Good' : kwtr < 1.3 ? 'Average (air-cooled level)' : 'Poor, system check karo';
    return 'Cooling ' + f1(cap, 1) + ' kW, input ' + f1(p, 1) + ' kW: **COP ' + f1(cop, 2) + '**, **EER ' + f1(cop * 3.412, 2) + '**, **' + f1(kwtr, 2) + ' kW/TR** → ' + lab + '.' + link('tools2.html#x2', 'EER / COP / kW per TR');
  }

  function chilled(t) {
    var tr = get(t, new RegExp(N + '\\s*tr\\b')); if (!tr) return null;
    var dt = get(t, new RegExp('(?:delta ?t|dt|Δt)\\s*' + N)) || 5.5, v = get(t, new RegExp(N + '\\s*m/s')) || 2;
    var Q = tr * 3.517 / (4.186 * dt) / 1000, d = Math.sqrt(4 * Q / (Math.PI * v)) * 1000, dn = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500];
    var D = dn.filter(function (x) { return x >= d; })[0] || 500, va = Q / (Math.PI / 4 * D * D / 1e6);
    return tr + ' TR, ΔT ' + dt + ' K par chilled water flow = **' + f1(Q * 1000, 1) + ' L/s** (' + f1(Q * 3600, 1) + ' m³/h, ' + f1(Q * 15850.3, 0) + ' USGPM). Pipe **DN ' + D + '** (velocity ~' + f1(va, 2) + ' m/s).' + link('pro.html#p3', 'Chilled water pipe & pump');
  }

  function psy(t) {
    var T = get(t, new RegExp(N + '\\s*(?:°|deg|degree)?\\s*c\\b')) || get(t, new RegExp(N + '\\s*(?:db|dry bulb)')), rh = get(t, new RegExp(N + '\\s*%'));
    if (T == null || rh == null) return null;
    var P = 101.325 * Math.pow(1 - 2.25577e-5 * 431, 5.2559), ps = function (x) { return 0.61094 * Math.exp(17.625 * x / (x + 243.04)); };
    var pw = rh / 100 * ps(T), w = 0.622 * pw / (P - pw), gam = Math.log(rh / 100) + 17.625 * T / (243.04 + T), Td = 243.04 * gam / (17.625 - gam);
    var wT = function (x) { var s = 0.622 * ps(x) / (P - ps(x)); return ((2501 - 2.326 * x) * s - 1.006 * (T - x)) / (2501 + 1.86 * T - 4.186 * x); };
    var lo = Td, hi = T; for (var i = 0; i < 50; i++) { var m = (lo + hi) / 2; if (wT(m) > w) hi = m; else lo = m; }
    return T + '°C, ' + rh + '% RH (Jaipur altitude): wet bulb **' + f1((lo + hi) / 2, 1) + '°C**, dew point ' + f1(Td, 1) + '°C, humidity ratio ' + f1(w * 1000, 2) + ' g/kg, enthalpy ' + f1(1.006 * T + w * (2501 + 1.86 * T), 1) + ' kJ/kg.' + link('pro.html#p2', 'Psychrometrics');
  }

  function vfd(t) {
    var kw = get(t, new RegExp(N + '\\s*kw')), hrs = get(t, new RegExp(N + '\\s*(?:hours|hrs|hr|ghante)')), flow = get(t, new RegExp(N + '\\s*%'));
    if (!kw || !flow) return null;
    hrs = hrs || 4000; var x = flow / 100, fixed = 0.5 + 0.5 * x, v = Math.pow(x, 3) / 0.97, saved = kw * hrs * (fixed - v), rate = get(t, new RegExp('(?:rs|₹)\\s*' + N)) || 8;
    return kw + ' kW motor, ' + flow + '% flow par (damper ke mukable VFD) bachat ~**' + f1(saved, 0) + ' units/saal** = ~₹' + f1(saved * rate, 0) + ' (₹' + rate + '/unit, ' + hrs + ' hrs/saal). Pumps me static head zyada ho to bachat kam hoti hai.' + link('tools-center.html', 'Fan & pump VFD savings');
  }

  var INFO = [
    [['static pressure'], 'Duct static pressure tool me airflow aur friction rate daalo; wo duct size, velocity aur total static pressure (fittings, filter, coil ke saath) batata hai.', 'tools2.html#x1', 'Duct static pressure'],
    [['boq', 'quotation'], 'BOQ / quotation maker me items, qty, rate, discount aur GST bharo. Total words me aata hai aur Print / save as PDF se client ko bhej sakte ho.', 'tools2.html#x4', 'BOQ / quotation maker'],
    [['cooling load', 'heat load', 'load calculation'], 'Cooling load tool deewar, roof, glass, logon, lights, equipment aur fresh air ka alag heat gain nikaal kar TR, kW aur supply air batata hai.', 'pro.html#p1', 'Cooling load'],
    [['cost comparison', 'compare ac', 'lifetime cost', 'payback'], 'AC cost comparison do ACs ka 10 saal ka total kharcha aur payback dikhata hai.', 'pro.html#p4', 'AC cost comparison'],
    [['vfd'], 'VFD savings tool load profile se saal ki bachat (units aur ₹) aur payback batata hai.', 'tools-center.html', 'Fan & pump VFD savings'],
    [['tool', 'calculator'], 'Site par free HVAC tools hain: AC tonnage, BTU/kW/TR, duct size, electrical details, cooling load, psychrometrics, chilled water pipe, AC cost comparison, duct static pressure, EER/COP, VFD savings aur BOQ maker. Sab Our Services menu (app me Tools tab) me hain. Kisi bhi tool ke numbers yahin bata do, main direct nikaal dunga.', 'tools.html', 'Basic tools']
  ];

  function answer(q) {
    if (!q) return null;
    var t = String(q).toLowerCase().replace(/,/g, '');
    var tries = [];
    if (has(t, ['cable', 'mcb', 'breaker', 'ampere', ' amp', 'current', 'wire size', 'electrical'])) tries.push(electrical);
    if (has(t, ['wet bulb', 'dew point', 'psychro', 'enthalpy', ' rh'])) tries.push(psy);
    if (has(t, ['cop', 'eer', 'kw/tr', 'kw per tr', 'efficiency'])) tries.push(eer);
    if (has(t, ['vfd', 'inverter drive', 'speed drive'])) tries.push(vfd);
    if (has(t, ['chilled', 'pipe', 'piping', 'pump'])) tries.push(chilled);
    if (has(t, ['duct']) && !has(t, ['static'])) tries.push(duct);
    if (has(t, ['ton', 'tonnage', 'ac size', 'ac lagana', 'kitne ton', 'room', 'bedroom', 'hall', 'sq ft', 'sqft'])) tries.push(tonnage);
    if (has(t, ['btu', ' to kw', 'convert', 'kw to', ' tr ']) ) tries.push(convert);
    for (var i = 0; i < tries.length; i++) { var r = tries[i](t); if (r) return r; }
    for (var j = 0; j < INFO.length; j++) if (has(t, INFO[j][0])) return INFO[j][1] + link(INFO[j][2], INFO[j][3]);
    return null;
  }

  window.HVAC_TOOLS_KB = KB;
  window.hvacToolsAnswer = answer;
})();
