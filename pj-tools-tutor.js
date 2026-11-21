/* ===== Hindi & English Language Tutor: lessons Beginner → Pro, dictionary, practice test, chat tutor ===== */
(function () {
  if (!window.PJ || !PJ.quiz) return;
  PJ.LVN.A = 'Advanced';
  const LNAME = { B: 'Beginner', I: 'Intermediate', A: 'Advanced', P: 'Pro' };
  const SPK = { en: 'en-IN', hi: 'hi-IN' };
  const speak = (t, lang) => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = SPK[lang]; speechSynthesis.speak(u); } catch (e) { toast('Speech not supported on this device'); } };

  /* ---------- lesson data: English (for Hindi speakers: phrase | Hindi meaning | example) and Hindi (Devanagari | Roman | English) ---------- */
  const RAW = `
# en B
## Greetings & introductions
Hello / Hi|नमस्ते / हेलो|Hello! I am Raj.
Good morning / afternoon / evening|सुप्रभात / शुभ दोपहर / शुभ संध्या|Good morning, sir.
How are you?|आप कैसे हैं?|I am fine, thank you. And you?
My name is ...|मेरा नाम ... है|My name is Peeyush.
Nice to meet you.|आपसे मिलकर खुशी हुई।|Nice to meet you too.
Where are you from?|आप कहाँ से हैं?|I am from Jaipur.
See you later. / Goodbye.|फिर मिलते हैं। / अलविदा।|Goodbye, take care.
## Polite words
Please|कृपया|Please sit down.
Thank you / Thanks|धन्यवाद|Thank you very much.
Sorry / Excuse me|माफ़ कीजिए / सुनिए|Excuse me, where is the station?
You are welcome.|आपका स्वागत है।|You are welcome.
Yes / No|हाँ / नहीं|Yes, please. No, thanks.
May I come in?|क्या मैं अंदर आ सकता हूँ?|May I come in, sir?
## Simple sentences (I am, He is, I have)
I am a student.|मैं एक विद्यार्थी हूँ।|I am a student.
He is my friend.|वह मेरा दोस्त है।|He is my friend.
She is a teacher.|वह एक शिक्षिका है।|She is a teacher.
I have a book.|मेरे पास एक किताब है।|I have a book.
I like tea.|मुझे चाय पसंद है।|I like tea.
What is this?|यह क्या है?|This is a pen.
How much is this?|यह कितने का है?|How much is this shirt?
# en I
## Tenses made simple
I go to office every day. (Present)|मैं रोज़ ऑफिस जाता हूँ।|Habit or fact: He works in Delhi.
I am going to office now. (Continuous)|मैं अभी ऑफिस जा रहा हूँ।|She is studying right now.
I went to office yesterday. (Past)|मैं कल ऑफिस गया था।|They visited Agra last year.
I have finished my work. (Present perfect)|मैंने अपना काम खत्म कर लिया है।|Use have/has + 3rd form of verb.
I will go tomorrow. (Future)|मैं कल जाऊँगा।|We will meet at 5.
I was watching TV when he came.|जब वह आया, मैं टीवी देख रहा था।|Past continuous + past simple.
## Office & phone English
Can you help me, please?|क्या आप मेरी मदद कर सकते हैं?|Can you help me with this file?
I will call you back.|मैं आपको वापस कॉल करूँगा।|I am in a meeting, I will call you back.
Could you repeat that, please?|क्या आप दोबारा बोल सकते हैं?|Could you speak a little slowly?
I am running late.|मुझे देर हो रही है।|Sorry, I am running late by 10 minutes.
Please send me the details.|कृपया मुझे विवरण भेजिए।|Please send me the details by email.
I will share the report by evening.|मैं शाम तक रिपोर्ट भेज दूँगा।|Deadline related reply.
## Prepositions & common mistakes
in / on / at (time)|in = month/year, on = day/date, at = clock time|in June, on Monday, at 5 pm
WRONG: I am agree. → RIGHT: I agree.|"am" nahi lagta – agree khud verb hai|I agree with you.
WRONG: He don't know. → RIGHT: He doesn't know.|He/She/It ke saath doesn't|She doesn't like coffee.
WRONG: I did went. → RIGHT: I went.|did ke baad verb ki 1st form|Did you go? / I did not go.
WRONG: discuss about → RIGHT: discuss|discuss ke baad about nahi|Let's discuss the plan.
WRONG: more better → RIGHT: better|better khud comparative hai|This is better than that.
WRONG: I have a doubt → RIGHT: I have a question|doubt = shak; sawal ke liye question|I have a question about the bill.
# en A
## Modals & conditionals
If it rains, I will stay home. (1st)|अगर बारिश हुई तो मैं घर पर रहूँगा।|Real future possibility.
If I were you, I would apply. (2nd)|अगर मैं आपकी जगह होता तो आवेदन करता।|Imaginary / unreal present.
If I had studied, I would have passed. (3rd)|अगर मैंने पढ़ा होता तो पास हो जाता।|Past regret.
You should take rest.|आपको आराम करना चाहिए।|Advice – should / ought to.
You must wear a helmet.|आपको हेलमेट पहनना ज़रूरी है।|Rule / strong necessity.
He might come late.|वह देर से आ सकता है।|Possibility – might / may.
## Phrasal verbs
look after|देखभाल करना|She looks after her parents.
give up|छोड़ देना / हार मानना|Never give up.
put off|टालना|They put off the meeting.
turn down|ठुकराना / आवाज़ कम करना|He turned down the offer.
carry out|अंजाम देना|We carried out the survey.
find out|पता लगाना|Please find out the price.
come across|संयोग से मिलना|I came across an old friend.
## Interview & formal email English
I am writing to apply for the position of ...|मैं ... पद के लिए आवेदन कर रहा हूँ।|Email opening.
I would be grateful if you could ...|यदि आप ... कर सकें तो मैं आभारी रहूँगा।|Polite request.
Please find the attachment.|कृपया संलग्न फ़ाइल देखें।|Please find my resume attached.
I look forward to hearing from you.|मैं आपके उत्तर की प्रतीक्षा करूँगा।|Closing line.
I have X years of experience in ...|मुझे ... में X वर्ष का अनुभव है।|I have 3 years of experience in HVAC.
My strength is ... and I am improving ...|मेरी ताकत ... है और मैं ... सुधार रहा हूँ।|Weakness answer.
# en P
## Business English
Let's touch base next week.|अगले हफ़्ते बात करते हैं।|Short follow-up.
Let's get on the same page.|चलिए एक राय बना लेते हैं।|Align understanding.
Can we take this offline?|क्या हम इसे बाद में अलग से चर्चा करें?|Move discussion out of meeting.
I do not have the bandwidth right now.|अभी मेरे पास समय/क्षमता नहीं है।|Polite no.
Let's circle back on this.|इस पर बाद में लौटते हैं।|Postpone politely.
ballpark figure|मोटा अनुमान|A ballpark figure is Rs 5 lakh.
deliverable|तय किया गया काम/परिणाम|Three deliverables per month.
## Presentation & negotiation phrases
Let me walk you through the plan.|मैं आपको योजना समझाता हूँ।|Opening a section.
As you can see on this slide ...|जैसा आप इस स्लाइड पर देख सकते हैं ...|Pointing to data.
To sum up / In conclusion ...|संक्षेप में / निष्कर्ष में ...|Closing.
I see your point, however ...|मैं आपकी बात समझता हूँ, लेकिन ...|Polite disagreement.
Could we meet halfway?|क्या हम बीच का रास्ता निकाल सकते हैं?|Negotiation.
That is a reasonable proposal.|यह एक उचित प्रस्ताव है।|Acceptance.
## Power vocabulary & idioms
meticulous|बहुत सावधान|A meticulous engineer checks every joint.
pragmatic|व्यावहारिक|Take a pragmatic approach.
resilient|दृढ़ / जल्दी संभलने वाला|A resilient team.
ubiquitous|हर जगह मौजूद|Smartphones are ubiquitous.
a blessing in disguise|छुपा हुआ वरदान|Losing the job was a blessing in disguise.
hit the nail on the head|बिल्कुल सही बात कहना|You hit the nail on the head.
the ball is in your court|अब फैसला आपके हाथ में है|I sent the offer; the ball is in your court.
# hi B
## Greetings (अभिवादन)
नमस्ते|Namaste|Hello / Goodbye (respectful)
आप कैसे हैं?|Aap kaise hain?|How are you?
मैं ठीक हूँ|Main theek hoon|I am fine
आपका नाम क्या है?|Aapka naam kya hai?|What is your name?
मेरा नाम ... है|Mera naam ... hai|My name is ...
धन्यवाद|Dhanyavaad|Thank you
माफ़ कीजिए|Maaf kijiye|Sorry / Excuse me
## Pronouns & basics
मैं|Main|I
तुम / आप|Tum / Aap|You (informal / respectful)
वह|Vah|He / She / That
हम|Hum|We
यह|Yah|This
हाँ / नहीं|Haan / Nahin|Yes / No
कृपया|Kripya|Please
## Numbers 1–10 (गिनती)
एक|Ek|1
दो|Do|2
तीन|Teen|3
चार|Chaar|4
पाँच|Paanch|5
छह|Chhah|6
सात|Saat|7
आठ|Aath|8
नौ|Nau|9
दस|Das|10
# hi I
## Verbs & present tense
मैं खाना खाता हूँ|Main khaana khaata hoon|I eat food (male speaker)
मैं खाना खाती हूँ|Main khaana khaati hoon|I eat food (female speaker)
मैं जा रहा हूँ|Main jaa raha hoon|I am going
वह पढ़ती है|Vah padhti hai|She studies
हम काम करते हैं|Hum kaam karte hain|We work
मुझे पानी चाहिए|Mujhe paani chaahiye|I need water
मुझे हिंदी सीखनी है|Mujhe Hindi seekhni hai|I want to learn Hindi
## Shopping & travel
यह कितने का है?|Yah kitne ka hai?|How much is this?
बहुत महँगा है|Bahut mehenga hai|It is very expensive
थोड़ा कम कीजिए|Thoda kam kijiye|Please reduce a little
स्टेशन कहाँ है?|Station kahaan hai?|Where is the station?
सीधे जाइए|Seedhe jaaiye|Go straight
बाएँ मुड़िए|Baayen mudiye|Turn left
दाएँ मुड़िए|Daayen mudiye|Turn right
## Past & future
मैंने खाना खाया|Maine khaana khaaya|I ate food
वह कल आया था|Vah kal aaya tha|He came yesterday
मैं कल जाऊँगा|Main kal jaaunga|I will go tomorrow
हम आएँगे|Hum aayenge|We will come
क्या हुआ?|Kya hua?|What happened?
हम कब मिलेंगे?|Hum kab milenge?|When shall we meet?
# hi A
## Sentence structure & postpositions
मेज़ पर किताब है|Mez par kitaab hai|There is a book on the table
घर में बच्चे हैं|Ghar mein bachche hain|Children are in the house
मेरा भाई / मेरी बहन / मेरे दोस्त|Mera bhai / Meri behen / Mere dost|my brother / sister / friends (का-की-के agree with the noun)
मैं दिल्ली से आया हूँ|Main Dilli se aaya hoon|I have come from Delhi
उसको पुस्तक दीजिए|Usko pustak dijiye|Give him/her the book
सब कुछ ठीक है|Sab kuch theek hai|Everything is fine
## Formal & honorific Hindi
कृपया प्रतीक्षा कीजिए|Kripya prateeksha kijiye|Please wait
मैं आपकी क्या सहायता कर सकता हूँ?|Main aapki kya sahaayata kar sakta hoon?|How can I help you?
आपका स्वागत है|Aapka swaagat hai|You are welcome
मुझे खेद है|Mujhe khed hai|I regret / I am sorry
मैं आपका आभारी हूँ|Main aapka aabhaari hoon|I am grateful to you
सादर नमस्कार|Saadar namaskaar|Respectful greetings (letters)
## Muhavare (मुहावरे)
आँखों का तारा|Aankhon ka taara|Apple of the eye – a beloved one
नाक में दम करना|Naak mein dam karna|To trouble someone badly
दाँतों तले उँगली दबाना|Daanton tale ungli dabaana|To be amazed
आसमान से बातें करना|Aasmaan se baatein karna|To be very tall / rise high
अंधे की लाठी|Andhe ki laathi|The only support
ऊँट के मुँह में जीरा|Oont ke munh mein jeera|A tiny amount for a big need
# hi P
## शुद्ध हिंदी शब्दावली (Formal vocabulary)
विद्यालय|Vidyaalay|School
चिकित्सालय|Chikitsaalay|Hospital
पुस्तकालय|Pustakaalay|Library
अनुशासन|Anushaasan|Discipline
प्रतिदिन|Pratidin|Every day
परिश्रम|Parishram|Hard work
उत्तरदायित्व|Uttardaayitva|Responsibility
## Business Hindi (व्यावसायिक हिंदी)
बैठक|Baithak|Meeting
प्रस्ताव|Prastaav|Proposal
अनुबंध|Anubandh|Contract
निविदा|Nivida|Tender
लेखा-जोखा|Lekha-jokha|Accounts
लाभ / हानि|Laabh / Haani|Profit / Loss
ग्राहक|Graahak|Customer
## कहावतें (Proverbs)
जैसा बोओगे वैसा काटोगे|Jaisa boge vaisa kaatoge|As you sow, so shall you reap
जहाँ चाह वहाँ राह|Jahaan chaah vahaan raah|Where there is a will there is a way
एक और एक ग्यारह|Ek aur ek gyaarah|Unity is strength
नाच न जाने आँगन टेढ़ा|Naach na jaane aangan tedha|A bad workman blames his tools
अब पछताए होत क्या जब चिड़िया चुग गई खेत|Ab pachhtaaye hot kya jab chidiya chug gayi khet|No use crying over spilt milk
कर भला तो हो भला|Kar bhala to ho bhala|Do good and good will come to you
`;
  const LESSONS = { en: { B: [], I: [], A: [], P: [] }, hi: { B: [], I: [], A: [], P: [] } };
  (() => { let lang, lv, unit; RAW.trim().split('\n').forEach(l => { l = l.trim(); if (!l) return; if (l.startsWith('# ')) { [lang, lv] = l.slice(2).split(' '); } else if (l.startsWith('## ')) { unit = { t: l.slice(3), items: [] }; LESSONS[lang][lv].push(unit); } else unit.items.push(l.split('|')); }); })();

  const DICT = PJ.rows(`
पानी|paani|water
खाना|khaana|food / to eat
घर|ghar|house / home
किताब|kitaab|book
दोस्त|dost|friend
माँ|maa|mother
पिता|pitaa|father
भाई|bhaai|brother
बहन|behen|sister
दिन|din|day
रात|raat|night
आज|aaj|today
कल|kal|tomorrow / yesterday
समय|samay|time
काम|kaam|work
पैसा|paisa|money
स्कूल|school|school
शिक्षक|shikshak|teacher
बाज़ार|baazaar|market
सड़क|sadak|road
गाड़ी|gaadi|vehicle / car
बड़ा|bada|big
छोटा|chhota|small
अच्छा|achchha|good
बुरा|bura|bad
गरम|garam|hot
ठंडा|thanda|cold
नया|naya|new
पुराना|puraana|old
तेज़|tez|fast
धीमा|dheema|slow
खुश|khush|happy
उदास|udaas|sad
सुंदर|sundar|beautiful
मदद|madad|help
आना|aana|to come
जाना|jaana|to go
खाना (क्रिया)|khaana|to eat
पीना|peena|to drink
सोना|sona|to sleep
पढ़ना|padhna|to read / study
लिखना|likhna|to write
बोलना|bolna|to speak
सुनना|sunna|to listen
देखना|dekhna|to see / watch
जानना|jaanna|to know
समझना|samajhna|to understand
सीखना|seekhna|to learn
काम करना|kaam karna|to work
बैठना|baithna|to sit
खड़ा होना|khada hona|to stand
खरीदना|khareedna|to buy
बेचना|bechna|to sell
देना|dena|to give
लेना|lena|to take
रुकना|rukna|to stop / wait
चलना|chalna|to walk / move
हँसना|hansna|to laugh
रोना|rona|to cry
कार्यालय|kaaryaalay|office
कंपनी|kampani|company
नौकरी|naukri|job
वेतन|vetan|salary
साक्षात्कार|saakshaatkaar|interview
अनुभव|anubhav|experience
शिक्षा|shiksha|education
परिवार|parivaar|family
स्वास्थ्य|svaasthya|health
सफलता|safalta|success
कठिन|kathin|difficult
आसान|aasaan|easy
सच|sach|truth
झूठ|jhooth|lie
प्यार|pyaar|love
सम्मान|sammaan|respect
`);

  /* ---------- practice tests ---------- */
  const QS = {
    en: PJ.qs(`
B|Choose the correct sentence.|I am agree.|I agree.|I agreeing.|I agreed am.|2|"Agree" is a verb – we do not use "am" before it.
B|Which greeting is used in the morning?|Good night|Good evening|Good morning|Good bye|3|Good morning is used until noon.
B|Fill in the blank: She ___ a teacher.|am|is|are|be|2|She/He/It + is.
B|What is the meaning of "Please"?|धन्यवाद|कृपया|माफ़ कीजिए|अलविदा|2|Please = कृपया.
B|Choose the correct plural of "book".|bookes|books|bookies|booken|2|Add -s to most nouns.
I|He ___ not know the answer.|do|does|did to|is|2|He/She/It + does not.
I|Choose the correct sentence.|I did went to market.|I did go to market.|I go did market.|I did gone market.|2|After did use the base form.
I|"I have finished my work" is:|Present perfect|Past simple|Future|Present continuous|1|have/has + V3.
I|We meet ___ Monday.|in|at|on|by|3|on + day, in + month, at + time.
I|Which is correct?|discuss about it|discuss it|discussing about|discuss on it|2|discuss takes a direct object.
A|If I ___ you, I would apply for the job.|am|was|were|be|3|Second conditional uses "were" for all subjects.
A|The phrasal verb "give up" means:|Donate|Stop trying|Start|Increase|2|give up = quit / stop trying.
A|Choose the polite request.|Give me file.|I would be grateful if you could send the file.|Send file fast.|You must send file.|2|"I would be grateful if..." is formal and polite.
A|"They ___ the meeting to next week."|put off|put on|put in|put by|1|put off = postpone.
A|Choose the correct sentence.|He suggested me to go.|He suggested that I go.|He suggested to me going.|He suggest me go.|2|suggest + that + subject + base verb.
P|"Let's circle back" means:|Draw a circle|Return to the topic later|End the meeting|Reject the idea|2|A common business phrase meaning revisit later.
P|"A blessing in disguise" means:|A hidden bad thing|A good thing that seemed bad at first|A religious ceremony|A costume|2|It describes a hidden benefit.
P|The word "meticulous" is closest to:|Careless|Very careful|Angry|Lazy|2|meticulous = extremely careful about details.
P|Which sentence is more professional?|I think maybe we can do it.|We can deliver this by Friday.|Probably it will work I guess.|Not sure but try.|2|Be clear and confident in professional English.
P|"Could we meet halfway?" is used when:|Choosing a road|Negotiating a compromise|Ending a call|Asking time|2|It proposes a compromise.
`),
    hi: PJ.qs(`
B|"नमस्ते" means:|Thank you|Hello / Goodbye|Sorry|Please|2|Namaste is a respectful greeting.
B|"धन्यवाद" means:|Sorry|Please|Thank you|Welcome|3|Dhanyavaad = Thank you.
B|"तीन" is the number:|2|3|4|5|2|Teen = 3.
B|How do you say "My name is Raj"?|आपका नाम राज है|मेरा नाम राज है|मैं नाम राज|नाम मेरा है|2|Mera naam Raj hai.
B|"पानी" means:|Food|Water|Milk|Tea|2|Paani = water.
I|"मैं जा रहा हूँ" means:|I went|I am going|I will go|I go daily|2|Jaa raha hoon = present continuous.
I|"यह कितने का है?" is used to ask:|The time|The price|The way|The name|2|Yah kitne ka hai? = How much is this?
I|"मैं कल जाऊँगा" is in:|Past tense|Present tense|Future tense|Imperative|3|-ऊँगा/-ऊँगी endings show the future for मैं.
I|"मैंने खाना खाया" means:|I eat food|I ate food|I will eat|I am eating|2|Maine ... khaaya = past tense.
I|Which means "Turn left"?|सीधे जाइए|बाएँ मुड़िए|दाएँ मुड़िए|रुकिए|2|Baayen mudiye = turn left.
A|"मेरी बहन" – why "मेरी"?|Sister is feminine|Sister is plural|It is past tense|It is formal|1|का/की/के and मेरा/मेरी/मेरे agree with the gender of the noun.
A|The formal way to say "please wait" is:|रुक|कृपया प्रतीक्षा कीजिए|ठहर जा|ज़रा रुक यार|2|कीजिए is the respectful imperative.
A|"आभारी" means:|Angry|Grateful|Late|Different|2|Aabhaari = grateful.
A|The word order of a Hindi sentence is mostly:|SVO|SOV|VSO|OVS|2|Hindi is subject – object – verb.
A|"मुझे खेद है" means:|I am happy|I regret / I am sorry|I am late|I agree|2|Khed = regret.
P|"आँखों का तारा" means:|Star in the sky|A beloved one|A pupil|Eye disease|2|Idiom for a favourite person.
P|"जहाँ चाह वहाँ राह" means:|Where there is a will there is a way|Look before you leap|Time is money|Slow and steady|1|A proverb about determination.
P|"अनुबंध" means:|Contract|Meeting|Tender|Profit|1|Anubandh = contract.
P|"निविदा" in business means:|Salary|Tender|Customer|Loss|2|Nivida = tender.
P|"एक और एक ग्यारह" teaches:|Maths|Unity is strength|Be fast|Save money|2|Together two people become more powerful.
`)
  };

  /* ---------- Tutor chat engine ---------- */
  const UPG = [[/\bgood\b/i, '"good" → excellent / beneficial / effective'], [/\bbad\b/i, '"bad" → poor / harmful / unfavourable'], [/\bvery big\b|\bbig problem\b/i, '"big problem" → major issue / significant challenge'], [/\bI think\b/i, '"I think" → In my opinion / From my perspective'], [/\bget\b/i, '"get" → obtain / receive / achieve (more formal)'], [/\bhelp\b/i, '"help" → assist / support'], [/\bkind of\b|\bsort of\b|\bbasically\b/i, 'Avoid fillers like "kind of / basically" in professional English']];
  const RULES = [
    [/\bi am agree\b/i, 'Say "I agree" – no "am".'],
    [/\b(he|she|it)\s+(don't|do not)\b/i, 'Use "doesn\'t": He/She/It doesn\'t …'],
    [/\b(he|she|it)\s+have\b/i, 'Use "has": He/She/It has …'],
    [/\b(i|you|we|they)\s+(has|is)\b/i, 'Use "have/are" with I/you/we/they: I have, they are.'],
    [/\b(he|she|it)\s+are\b/i, 'Use "is": He/She/It is …'],
    [/\bmore (better|easier|faster|bigger)\b/i, 'Do not use "more" with -er words: say "better", "easier".'],
    [/\bdiscuss about\b/i, 'Say "discuss" (no "about").'],
    [/\b(return|revert|repeat|reply) back\b/i, 'Remove "back/again": "return", "revert", "repeat" already include it.'],
    [/\bcousin (brother|sister)\b/i, 'Say simply "cousin".'],
    [/\bprepone\b/i, 'Use "bring forward" / "reschedule earlier" – "prepone" is not standard English.'],
    [/\bdid\s+\w+\s+(went|came|ate|saw|took|gave|made|did)\b/i, 'After "did" use the base verb: Did you go? (not "did you went").'],
    [/\bI (am|was) knowing\b/i, '"know" is not used in continuous form: I know / I knew.'],
    [/\bI am having (a|an|two|three)\b/i, 'Use "I have" for possession, not "I am having".'],
    [/\bwhat is your good name\b/i, 'Say "What is your name?" – "good name" is not used.'],
    [/\b(a)\s+(?!uni|use|one|eu|ura)[aeiou]\w+/i, 'Use "an" before a vowel sound: an apple, an hour.'],
    [/\b(\w+) \1\b/i, 'A word is repeated – check for a typing mistake.'],
    [/\bI have a doubt\b/i, 'For asking something, say "I have a question" ("doubt" means uncertainty).'],
    [/\bpass(ed)? out from\b/i, '"Pass out" means faint – say "I graduated from …".']
  ];
  const MINW = { B: 3, I: 6, A: 15, P: 30 };
  const SCEN = {
    en: {
      B: [['Introduce yourself', [['What is your name?', 'My name is Raj. / My name is Priya.'], ['Where do you live?', 'I live in Jaipur.'], ['What do you do?', 'I am a student. / I am an engineer.'], ['What do you like to eat?', 'I like tea and samosa.']]]],
      I: [['Office talk', [['How was your day at work?', 'My day was busy, but I finished all my tasks.'], ['What did you do yesterday?', 'Yesterday I went to the market and bought some vegetables.'], ['What will you do this weekend?', 'This weekend I will visit my family and relax.'], ['Ask me one question about my job.', 'What do you do in your job every day?']]]],
      A: [['Opinions & stories', [['Do you think online classes are better than classroom classes? Why?', 'In my opinion, classroom learning is more effective because students interact directly with teachers, although online classes are more flexible.'], ['Describe a challenge you faced and how you solved it.', 'Last year I had a tight deadline at work. I divided the task into small parts, asked my team for help and delivered it on time.'], ['If you could change one thing in your city, what would it be?', 'If I could change one thing, I would improve public transport so that people can travel safely and quickly.']]]],
      P: [['Professional communication', [['Give me a 30-second pitch about yourself for a job interview.', 'I am a mechanical engineer with three years of experience in HVAC project execution. I have successfully delivered projects worth Rs 2 crore and I am keen to contribute to your team.'], ['A project is delayed by one week. Explain it to the client professionally.', 'I would like to update you that the project will be delayed by a week due to material delivery. We have arranged additional manpower and will complete the work by the revised date.'], ['The client asks for a 20% discount. Reply professionally.', 'I understand your concern. While a 20% reduction is not feasible, we can offer 7% along with extended warranty. Would that work for you?']]]]
    },
    hi: {
      B: [['आपका परिचय (Introduction)', [['आपका नाम क्या है? (Aapka naam kya hai?)', /mera naam|मेरा नाम/i, 'मेरा नाम पीयूष है। (Mera naam Peeyush hai.)', 'Start with "मेरा नाम ... है".'], ['आप कैसे हैं? (Aap kaise hain?)', /theek|thik|ठीक|achh?a|अच्छा/i, 'मैं ठीक हूँ, धन्यवाद। (Main theek hoon, dhanyavaad.)', 'Say "मैं ठीक हूँ".'], ['आप कहाँ रहते हैं? (Aap kahaan rehte hain?)', /rah?t[ae]|रहता|रहती|\bmein\b|में/i, 'मैं जयपुर में रहता हूँ। (Main Jaipur mein rehta hoon.)', 'Use "मैं ... में रहता/रहती हूँ".'], ['आपको क्या पसंद है? (Aapko kya pasand hai?)', /pasand|पसंद/i, 'मुझे चाय पसंद है। (Mujhe chai pasand hai.)', 'Use "मुझे ... पसंद है".']]]],
      I: [['रोज़मर्रा की बातें (Daily talk)', [['आज आपने क्या किया? (Aaj aapne kya kiya?) – past tense में बताइए', /maine|मैंने|ya\b|या\b|ye\b|ये\b/i, 'आज मैंने काम किया और खाना खाया। (Aaj maine kaam kiya aur khaana khaaya.)', 'Past tense: "मैंने ... किया/खाया".'], ['कल आप क्या करेंगे? (Kal aap kya karenge?) – future tense में', /ungaa?\b|ूँगा|ूँगी|enge|ेंगे|ega\b|ेगा|egi|ेगी/i, 'कल मैं बाज़ार जाऊँगा। (Kal main baazaar jaaunga.)', 'Future: "जाऊँगा/जाऊँगी".'], ['दुकान पर दाम पूछिए। (Ask the price)', /kitne|कितने|kitna|कितना|daam|दाम/i, 'भैया, यह कितने का है? (Bhaiya, yah kitne ka hai?)', 'Use "यह कितने का है?".']]]],
      A: [['औपचारिक हिंदी (Formal Hindi)', [['किसी से औपचारिक रूप से मदद माँगिए। (Ask for help formally – use कृपया)', /kripya|कृपया/i, 'कृपया मेरी सहायता कीजिए। (Kripya meri sahaayata kijiye.)', 'Use "कृपया ... कीजिए".'], ['अपने परिवार के बारे में दो-तीन वाक्य बोलिए। (3 sentences about family)', /./, 'मेरे परिवार में चार लोग हैं। मेरे पिताजी नौकरी करते हैं। मेरी माँ घर सँभालती हैं। (Mere parivaar mein chaar log hain...)', 'Use मेरा/मेरी/मेरे correctly.'], ['धन्यवाद पत्र की एक पंक्ति लिखिए। (One line thank-you note)', /aabhaar|आभार|dhanyavaad|धन्यवाद/i, 'आपके सहयोग के लिए मैं हृदय से आभारी हूँ। (Aapke sahyog ke liye main hriday se aabhaari hoon.)', 'Use "आभारी" or "धन्यवाद".']]]],
      P: [['व्यावसायिक और साहित्यिक (Business & literary)', [['किसी मुहावरे का प्रयोग करके एक वाक्य बनाइए। (Use an idiom)', /./, 'वह अपने माता-पिता की आँखों का तारा है। (Vah apne maata-pita ki aankhon ka taara hai.)', 'Try: आँखों का तारा, नाक में दम.'], ['बैठक के लिए औपचारिक सूचना लिखिए। (Formal meeting notice)', /baithak|बैठक|sadar|सादर|kripya|कृपया/i, 'सादर सूचित किया जाता है कि कल प्रातः 10 बजे बैठक होगी। कृपया समय पर उपस्थित हों। (Saadar soochit kiya jaata hai...)', 'Use "बैठक", "सादर", "कृपया".'], ['एक कहावत लिखकर उसका अर्थ समझाइए। (Write a proverb and its meaning)', /./, 'जहाँ चाह वहाँ राह – अर्थात् इच्छा हो तो रास्ता निकल आता है। (Jahaan chaah vahaan raah...)', 'Pick from the Pro lessons.']]]]
    }
  };

  const chatTab = pane => {
    const st = PJ.LS.get('tt_pref', { lang: 'en', lv: 'B' });
    pane.innerHTML = `<div class="card"><div class="pj-bar"><label class="fld"><span>I want to learn</span><select id="tl"><option value="en" ${st.lang === 'en' ? 'selected' : ''}>English (अंग्रेज़ी)</option><option value="hi" ${st.lang === 'hi' ? 'selected' : ''}>Hindi (हिंदी)</option></select></label>
      <label class="fld"><span>My level</span><select id="tv">${['B', 'I', 'A', 'P'].map(l => `<option value="${l}" ${st.lv === l ? 'selected' : ''}>${LNAME[l]}</option>`).join('')}</select></label>
      <button class="btn" id="ts">Start / Restart lesson</button></div>
      <div class="chat tt-chat" id="tc"></div>
      <div class="sugg" id="tsg"></div>
      <div class="chatin"><input id="tm" placeholder="Type your answer here…" autocomplete="off"><button class="btn" id="tsd">Send</button></div>
      <p class="note">This is a rule-based practice tutor that works offline (grammar patterns + model answers) – it is not a live AI model. Commands: <code>hint</code>, <code>model</code>, <code>next</code>, <code>help</code>. ${window.PJ_AI_ENDPOINT ? 'Live AI is connected for free questions starting with "ask:".' : ''}</p></div>`;
    const chat = $('#tc', pane); let S = null;
    const post = (txt, who, say) => { const d = document.createElement('div'); d.className = 'msg ' + who; d.textContent = txt; if (say) { const b = document.createElement('button'); b.className = 'tt-spk'; b.textContent = '🔊'; b.style.marginLeft = '8px'; b.onclick = () => speak(say, S ? S.lang : 'en'); d.appendChild(b); } chat.appendChild(d); chat.scrollTop = chat.scrollHeight; return d; };
    const fixBox = (d, t) => { const f = document.createElement('div'); f.className = 'tt-fix'; f.textContent = t; d.appendChild(f); chat.scrollTop = chat.scrollHeight; };
    const sugg = arr => { $('#tsg', pane).innerHTML = arr.map(s => `<button>${s}</button>`).join(''); $$('#tsg button', pane).forEach(b => b.onclick = () => send(b.textContent)); };
    const ask = () => {
      const sc = S.sc, p = sc[1][S.i];
      post(`Q${S.i + 1}/${sc[1].length}: ${p[0]}`, 'b', S.lang === 'en' ? p[0] : null);
      sugg(['hint', 'model', 'next']);
    };
    const begin = () => {
      const lang = $('#tl', pane).value, lv = $('#tv', pane).value; PJ.LS.set('tt_pref', { lang, lv });
      const list = SCEN[lang][lv], sc = list[0];
      S = { lang, lv, sc, i: 0, score: 0, asked: 0 }; chat.innerHTML = '';
      post(lang === 'en'
        ? `Namaste! 👋 Main aapka English tutor hoon. Level: ${LNAME[lv]} – Topic: "${sc[0]}".\nMain sawal poochhunga, aap English me jawab dijiye. Galti hogi to main sahi karke samjhaunga. Shuru karte hain!`
        : `नमस्ते! 👋 मैं आपका Hindi tutor हूँ। Level: ${LNAME[lv]} – Topic: "${sc[0]}".\nI will ask questions. Answer in Hindi (Devanagari or Roman letters both are fine). I will show you the natural way to say it.`, 'b');
      ask();
    };
    const evalEn = txt => {
      const t = txt.trim(), issues = [];
      if (/[ऀ-ॿ]/.test(t)) return { bad: 1, msg: 'Aapne Hindi me likha hai. Try in English – agar atak jaaye to "hint" likhiye.' };
      if (/\bi\b/.test(t)) issues.push('Always write "I" in capital letters.');
      RULES.forEach(r => { if (r[0].test(t)) issues.push(r[1]); });
      if (/^[a-z]/.test(t)) issues.push('Start the sentence with a capital letter.');
      if (!/[.!?]$/.test(t)) issues.push('End the sentence with a full stop (.) or question mark (?).');
      const w = (t.match(/[A-Za-z']+/g) || []).length;
      if (w < MINW[S.lv]) issues.push(`Try a longer answer – at least ${MINW[S.lv]} words at the ${LNAME[S.lv]} level (you wrote ${w}).`);
      const up = (S.lv === 'A' || S.lv === 'P') ? UPG.filter(u => u[0].test(t)).map(u => u[1]) : [];
      return { issues, up, w };
    };
    const next = () => { const sc = S.sc; S.i++; if (S.i >= sc[1].length) { const pct = S.asked ? Math.round(S.score / S.asked * 100) : 0; post(`🎉 Lesson complete! Score: ${S.score}/${S.asked} (${pct}%).\n${S.lang === 'en' ? 'Ab agle level ya doosra topic try kijiye, ya Lessons tab me phrases revise kijiye.' : 'Try the next level or revise the phrases in the Lessons tab.'}`, 'b'); sugg(['Start again']); S.done = 1; return; } ask(); };
    const send = async txt => {
      const q = (txt ?? $('#tm', pane).value).trim(); if (!q) return; $('#tm', pane).value = '';
      if (!S) return toast('Press Start first');
      post(q, 'u');
      const low = q.toLowerCase();
      if (S.done) { if (low === 'start again') begin(); return; }
      const p = S.sc[1][S.i];
      if (window.PJ_AI_ENDPOINT && /^ask:/i.test(q)) { try { const r = await fetch(window.PJ_AI_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: S.lang, level: S.lv, message: q.slice(4).trim() }) }); const j = await r.json(); return post(j.reply || '…', 'b'); } catch (e) { return post('Live AI is not reachable right now.', 'b'); } }
      if (low === 'help') return post('Commands:\nhint – starting words\nmodel – see a sample answer\nnext – skip to next question\nstart again – restart', 'b');
      if (low === 'hint') return post(S.lang === 'en' ? 'Hint: ' + p[1].split(' ').slice(0, 3).join(' ') + ' …' : 'Hint: ' + p[3], 'b');
      if (low === 'model') { post(S.lang === 'en' ? 'Sample answer: ' + p[1] : 'Natural answer: ' + p[2], 'b', S.lang === 'en' ? p[1] : p[2].split('(')[0]); return; }
      if (low === 'next' || low === 'skip') return next();
      if (S.lang === 'en') {
        const r = evalEn(q); S.asked++;
        if (r.bad) { S.asked--; return post(r.msg, 'b'); }
        if (!r.issues.length) { S.score++; const d = post('✅ Excellent! Grammar looks correct and the answer is natural.', 'b'); if (r.up.length) fixBox(d, '💡 Vocabulary upgrade:\n' + r.up.join('\n')); }
        else { const d = post(`📝 Almost! ${r.issues.length} thing${r.issues.length > 1 ? 's' : ''} to improve:`, 'b'); fixBox(d, r.issues.map((x, k) => (k + 1) + '. ' + x).join('\n') + '\n\nSample: ' + p[1]); if (r.up.length) fixBox(d, '💡 Vocabulary upgrade:\n' + r.up.join('\n')); }
        setTimeout(next, 500);
      } else {
        S.asked++;
        const okk = p[1].test(q);
        if (okk) { S.score++; const d = post('✅ बहुत बढ़िया! (Very good!) Aapka jawab sahi hai.', 'b'); fixBox(d, 'Natural way: ' + p[2]); } else { const d = post('📝 Thoda aur try kijiye.', 'b'); fixBox(d, p[3] + '\nModel: ' + p[2]); }
        setTimeout(next, 500);
      }
    };
    $('#ts', pane).onclick = begin; $('#tsd', pane).onclick = () => send(); $('#tm', pane).addEventListener('keydown', e => e.key === 'Enter' && send());
    begin();
  };

  const lessonsTab = pane => {
    const st = PJ.LS.get('tt_pref', { lang: 'en', lv: 'B' });
    pane.innerHTML = `<div class="card"><div class="pj-bar"><label class="fld"><span>Language to learn</span><select id="ll"><option value="en" ${st.lang === 'en' ? 'selected' : ''}>English (for Hindi speakers)</option><option value="hi" ${st.lang === 'hi' ? 'selected' : ''}>हिंदी – Hindi (for English speakers)</option></select></label>
      <div class="tabs" style="margin:0" id="lv">${['B', 'I', 'A', 'P'].map(l => `<button class="tab ${st.lv === l ? 'on' : ''}" data-l="${l}">${LNAME[l]}</button>`).join('')}</div></div><div id="lb"></div></div>`;
    const done = PJ.LS.get('tt_done', {});
    const draw = () => {
      const lang = $('#ll', pane).value, lv = $('.tab.on', pane).dataset.l; PJ.LS.set('tt_pref', { lang, lv });
      $('#lb', pane).innerHTML = LESSONS[lang][lv].map((u, ui) => { const k = lang + lv + ui; return `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h3 style="margin:0">${esc(u.t)}</h3><label style="font-size:.8rem;display:flex;gap:6px;align-items:center"><input type="checkbox" style="width:auto" data-d="${k}" ${done[k] ? 'checked' : ''}> Learned</label></div>
        ${u.items.map(it => `<div class="tt-item"><button class="tt-spk" data-s="${esc(lang === 'en' ? it[0] : it[0])}" title="Listen">🔊</button><div><b class="${lang === 'hi' ? 'hi' : ''}">${esc(it[0])}</b><small class="${lang === 'en' ? 'hi' : ''}">${esc(it[1])}${it[2] ? ' · ' + esc(it[2]) : ''}</small></div></div>`).join('')}</div>`; }).join('');
      $$('[data-s]', pane).forEach(b => b.onclick = () => speak(b.dataset.s.replace(/WRONG:.*→ RIGHT:/, '').replace(/\.\.\./g, ''), lang));
      $$('[data-d]', pane).forEach(c => c.onchange = () => { done[c.dataset.d] = c.checked ? 1 : 0; PJ.LS.set('tt_done', done); });
    };
    $('#ll', pane).onchange = draw; $$('#lv .tab', pane).forEach(b => b.onclick = () => { $$('#lv .tab', pane).forEach(x => x.classList.toggle('on', x === b)); draw(); });
    draw();
  };

  const dictTab = pane => {
    pane.innerHTML = `<div class="card"><label class="fld"><span>Search Hindi (देवनागरी / Roman) or English</span><input id="dq" type="search" placeholder="e.g. water, paani, पानी, work…"></label><div class="note" id="dn"></div><div id="db"></div></div>`;
    const draw = () => { const q = $('#dq', pane).value.toLowerCase().trim(); const l = DICT.filter(r => !q || r.join(' ').toLowerCase().includes(q)); $('#dn', pane).textContent = l.length + ' words'; $('#db', pane).innerHTML = l.map(r => `<div class="tt-item"><button class="tt-spk" data-s="${esc(r[0])}">🔊</button><div><b class="hi">${esc(r[0])}</b> <span class="chip">${esc(r[1])}</span><small>${esc(r[2])}</small></div></div>`).join('') || '<div class="empty">No word found</div>'; $$('[data-s]', pane).forEach(b => b.onclick = () => speak(b.dataset.s, 'hi')); };
    $('#dq', pane).addEventListener('input', draw); draw();
  };

  const testTab = pane => {
    pane.innerHTML = `<div class="card"><label class="fld" style="max-width:320px"><span>Test language</span><select id="tz"><option value="en">English test (for Hindi speakers)</option><option value="hi">हिंदी test (Hindi)</option></select></label></div><div id="tzb"></div>`;
    const go = () => { const lang = $('#tz', pane).value; PJ.cleanup(); PJ.quiz($('#tzb', pane), { id: 'lang_' + lang, title: (lang === 'en' ? 'English' : 'Hindi') + ' Practice Test', qs: QS[lang] }); };
    $('#tz', pane).onchange = go; go();
  };

  const oldChat = TOOLS.find(t => t.id === 'ai-chat'), oldRender = oldChat && oldChat.render;
  if (oldChat) {
    oldChat.name = 'Hindi & English AI Tutor Chat'; oldChat.ico = '🤖';
    oldChat.desc = 'Learn English or Hindi from Beginner to Pro – chat practice, lessons, dictionary, tests & tools helper';
    oldChat.tags = ['Practice test', 'Beginner → Pro'];
    oldChat.render = el => { CLEANUP = PJ.cleanup; el.dataset.k = 'tutor'; PJ.tabs(el, [['💬 Tutor Chat', chatTab], ['📚 Lessons', lessonsTab], ['📖 Dictionary', dictTab], ['📝 Practice Test', testTab], ['🛠 Tools Assistant', p => oldRender(p)]]); };
  }
})();
