
'use strict';

/* ===DATA1=== *//* ================= 词库数据 ================= */
const TOPICS = [
  {id:'core',     name:'高频通用',  icon:'⭐'},
  {id:'edu',      name:'教育学习',  icon:'🎓'},
  {id:'work',     name:'工作职场',  icon:'💼'},
  {id:'travel',   name:'旅行交通',  icon:'✈️'},
  {id:'health',   name:'健康运动',  icon:'💪'},
  {id:'env',      name:'环境能源',  icon:'🌿'},
  {id:'living',   name:'生活住宿',  icon:'🏠'},
  {id:'academic', name:'学术研究',  icon:'🔬'},
  {id:'shopping', name:'购物消费',  icon:'🛒'},
  {id:'feelings', name:'情感态度',  icon:'😊'}
];

// t=主题 w=单词 s=同义词组 c=中文释义 e=例句 k=例句中关键词(同义词)
const WORDS = [
{t:'core',w:'important',s:['crucial','vital','essential','significant'],c:'重要的',e:'It is crucial to book your tickets well in advance.',k:'crucial'},
{t:'core',w:'improve',s:['enhance','boost','upgrade'],c:'改善，提高',e:'The new software will enhance the overall efficiency of the office.',k:'enhance'},
{t:'core',w:'problem',s:['issue','difficulty','challenge'],c:'问题',e:'The main issue is the lack of affordable housing.',k:'issue'},
{t:'core',w:'increase',s:['rise','grow','climb'],c:'增加',e:'The number of international students has continued to rise sharply.',k:'rise'},
{t:'core',w:'decrease',s:['decline','drop','fall','reduce'],c:'减少',e:'Sales are expected to decline by ten percent this year.',k:'decline'},
{t:'core',w:'expensive',s:['costly','pricey'],c:'昂贵的',e:'The accommodation was quite costly for a student.',k:'costly'},
{t:'core',w:'cheap',s:['inexpensive','affordable'],c:'便宜的',e:'The course offers affordable study materials.',k:'affordable'},
{t:'core',w:'big',s:['large','huge','massive','considerable'],c:'大的',e:'A huge number of people attended the opening ceremony.',k:'huge'},
{t:'core',w:'small',s:['tiny','minor','slight'],c:'小的',e:'There was a slight delay at the start of the session.',k:'slight'},
{t:'core',w:'need',s:['require','demand','call for'],c:'需要',e:'This role will require a strong command of English.',k:'require'},
{t:'core',w:'show',s:['demonstrate','indicate','reveal'],c:'显示，表明',e:'The data seems to indicate a clear upward trend.',k:'indicate'},
{t:'core',w:'get',s:['obtain','acquire','receive'],c:'获得',e:'Students can obtain a discount with their university card.',k:'obtain'},
{t:'core',w:'buy',s:['purchase','acquire'],c:'购买',e:'You can purchase tickets at the main entrance.',k:'purchase'},
{t:'core',w:'help',s:['assist','support','aid'],c:'帮助',e:'Staff are available to assist you at any time.',k:'assist'},
{t:'core',w:'start',s:['begin','commence','launch'],c:'开始',e:'The lecture will commence at nine o\'clock sharp.',k:'commence'},
{t:'core',w:'finish',s:['complete','conclude','finalize'],c:'完成',e:'All participants must complete the form before the deadline.',k:'complete'},
{t:'core',w:'choose',s:['select','pick','opt for'],c:'选择',e:'You may select any three modules from the list.',k:'select'},
{t:'core',w:'change',s:['alter','modify','adjust'],c:'改变',e:'We may need to adjust the timetable.',k:'adjust'},
{t:'core',w:'enough',s:['sufficient','adequate'],c:'足够的',e:'Make sure you bring sufficient warm clothing for the trip.',k:'sufficient'},
{t:'core',w:'many',s:['numerous','a large number of'],c:'许多',e:'Numerous studies have confirmed the benefits of exercise.',k:'numerous'},
{t:'core',w:'most',s:['the majority of'],c:'大多数',e:'The majority of respondents agreed with the statement.',k:'majority'},
{t:'core',w:'also',s:['in addition','moreover','furthermore'],c:'此外',e:'In addition, the course includes weekly tutorials.',k:'in addition'},
{t:'core',w:'because',s:['due to','owing to','since'],c:'因为',e:'The event was postponed due to heavy rain.',k:'due to'},
{t:'core',w:'so',s:['therefore','consequently','as a result'],c:'因此',e:'Therefore, we strongly recommend booking early.',k:'therefore'},
{t:'core',w:'but',s:['however','nevertheless','whereas'],c:'但是',e:'However, the price does not include meals.',k:'however'},
{t:'core',w:'maybe',s:['perhaps','possibly','potentially'],c:'也许',e:'Perhaps we could arrange a meeting earlier in the week.',k:'perhaps'},
{t:'core',w:'about',s:['approximately','around','roughly'],c:'大约',e:'The journey takes approximately two hours by train.',k:'approximately'},
{t:'core',w:'very',s:['extremely','particularly','remarkably'],c:'非常',e:'The building is particularly impressive at night.',k:'particularly'},
{t:'core',w:'often',s:['frequently','regularly','commonly'],c:'经常',e:'The buses run frequently during the rush hour.',k:'frequently'},
{t:'core',w:'rarely',s:['seldom','hardly ever'],c:'很少',e:'Such opportunities seldom come along.',k:'seldom'},

{t:'edu',w:'course',s:['programme','module','class'],c:'课程',e:'The programme covers both theory and practical work.',k:'programme'},
{t:'edu',w:'subject',s:['topic','discipline','field'],c:'学科，主题',e:'Her main field of research is marine biology.',k:'field'},
{t:'edu',w:'teacher',s:['instructor','tutor','lecturer'],c:'老师',e:'Each student is assigned a personal tutor.',k:'tutor'},
{t:'edu',w:'student',s:['learner','pupil','trainee'],c:'学生',e:'The centre welcomes learners of all levels.',k:'learner'},
{t:'edu',w:'homework',s:['assignment','coursework'],c:'作业',e:'The assignment must be submitted online by Friday.',k:'assignment'},
{t:'edu',w:'exam',s:['test','assessment','evaluation'],c:'考试',e:'The final assessment counts for fifty percent of the grade.',k:'assessment'},
{t:'edu',w:'score',s:['mark','grade','result'],c:'分数',e:'She received a high mark in the writing test.',k:'mark'},
{t:'edu',w:'degree',s:['qualification','diploma','certificate'],c:'学位，证书',e:'A recognised qualification is essential for the post.',k:'qualification'},
{t:'edu',w:'university',s:['college','institution','campus'],c:'大学',e:'The campus offers excellent sports facilities.',k:'campus'},
{t:'edu',w:'lesson',s:['class','session','tutorial'],c:'课',e:'The first session is a general introduction to the course.',k:'session'},
{t:'edu',w:'learn',s:['study','pick up','master'],c:'学习',e:'You will pick up useful skills during the work placement.',k:'pick up'},
{t:'edu',w:'revise',s:['review','go over','refresh'],c:'复习',e:'Use the weekend to go over your lecture notes.',k:'go over'},
{t:'edu',w:'difficult',s:['hard','challenging','tough'],c:'困难的',e:'The second part of the test is quite challenging.',k:'challenging'},
{t:'edu',w:'easy',s:['simple','straightforward'],c:'容易的',e:'The application form is straightforward to complete.',k:'straightforward'},
{t:'edu',w:'compulsory',s:['mandatory','required','obligatory'],c:'必修的，强制的',e:'Attendance at the laboratory sessions is mandatory.',k:'mandatory'},
{t:'edu',w:'knowledge',s:['understanding','awareness','familiarity'],c:'知识',e:'The course builds a solid understanding of the subject.',k:'understanding'},

{t:'work',w:'job',s:['work','employment','occupation','position'],c:'工作',e:'He found full-time employment in a local law firm.',k:'employment'},
{t:'work',w:'salary',s:['wage','income','pay','earnings'],c:'薪水',e:'The starting pay is above the national average.',k:'pay'},
{t:'work',w:'company',s:['firm','business','enterprise','corporation'],c:'公司',e:'She runs her own small business from home.',k:'business'},
{t:'work',w:'employee',s:['staff','worker','workforce'],c:'员工',e:'All staff must attend the safety briefing.',k:'staff'},
{t:'work',w:'manager',s:['supervisor','director','head'],c:'经理',e:'Please report to your supervisor before noon.',k:'supervisor'},
{t:'work',w:'meeting',s:['conference','session','appointment'],c:'会议',e:'The conference will be held in the main hall.',k:'conference'},
{t:'work',w:'retire',s:['leave work','give up work','stop working'],c:'退休',e:'He plans to give up work when he turns sixty.',k:'give up work'},
{t:'work',w:'hire',s:['recruit','employ','take on'],c:'雇用',e:'The firm hopes to recruit new graduates this summer.',k:'recruit'},
{t:'work',w:'fire',s:['dismiss','sack','lay off'],c:'解雇',e:'The company may have to lay off some workers.',k:'lay off'},
{t:'work',w:'promotion',s:['advancement','career progression','rise'],c:'晋升',e:'The scheme supports career progression within the company.',k:'career progression'},
{t:'work',w:'experience',s:['background','track record','expertise'],c:'经验',e:'Applicants need a strong track record in sales.',k:'track record'},
{t:'work',w:'skill',s:['ability','expertise','competence'],c:'技能',e:'She has the right expertise for the job.',k:'expertise'},
{t:'work',w:'colleague',s:['co-worker','workmate','teammate'],c:'同事',e:'Her co-workers are very supportive.',k:'co-worker'},
{t:'work',w:'office',s:['workplace','premises','site'],c:'办公室',e:'The new premises are close to the railway station.',k:'premises'},

{t:'travel',w:'travel',s:['journey','trip','commute'],c:'旅行',e:'The journey took much longer than we expected.',k:'journey'},
{t:'travel',w:'arrive',s:['reach','get to','turn up'],c:'到达',e:'We expect to reach the hotel before midnight.',k:'reach'},
{t:'travel',w:'leave',s:['depart','set off','go away'],c:'离开',e:'The coach will depart at six in the morning.',k:'depart'},
{t:'travel',w:'return',s:['come back','go back'],c:'返回',e:'We plan to come back from the trip on Sunday.',k:'come back'},
{t:'travel',w:'book',s:['reserve','make a reservation'],c:'预订',e:'You can reserve a seat on the train online.',k:'reserve'},
{t:'travel',w:'ticket',s:['fare','pass','admission'],c:'票',e:'The train fare includes a reserved seat.',k:'fare'},
{t:'travel',w:'near',s:['close to','nearby','adjacent'],c:'附近',e:'The hostel is close to the city centre.',k:'close to'},
{t:'travel',w:'far',s:['distant','remote','out of the way'],c:'远的',e:'The farm is quite remote from the nearest village.',k:'remote'},
{t:'travel',w:'fast',s:['rapid','quick','speedy'],c:'快的',e:'The rapid growth of the city has caused traffic problems.',k:'rapid'},
{t:'travel',w:'slow',s:['gradual','unhurried','leisurely'],c:'慢的',e:'There has been a gradual improvement in the service.',k:'gradual'},
{t:'travel',w:'busy',s:['crowded','congested','packed'],c:'繁忙的',e:'The roads are congested during the rush hour.',k:'congested'},
{t:'travel',w:'free',s:['available','vacant','spare'],c:'空闲的，免费的',e:'Is the doctor available this afternoon?',k:'available'},
{t:'travel',w:'luggage',s:['baggage','bags','belongings'],c:'行李',e:'Passengers must collect their baggage downstairs.',k:'baggage'},
{t:'travel',w:'vehicle',s:['car','transport','means of transport'],c:'交通工具',e:'Cycling is a popular means of transport in the city.',k:'transport'},
{t:'travel',w:'route',s:['way','path','itinerary'],c:'路线',e:'The tour itinerary includes three famous museums.',k:'itinerary'},
{t:'travel',w:'postpone',s:['put off','delay','defer'],c:'推迟',e:'The flight was put off until the next morning.',k:'put off'},

{t:'health',w:'ill',s:['sick','unwell','poorly'],c:'生病的',e:'Several children were off school because they felt unwell.',k:'unwell'},
{t:'health',w:'tired',s:['exhausted','worn out','fatigued'],c:'疲惫的',e:'She felt exhausted after the long flight.',k:'exhausted'},
{t:'health',w:'healthy',s:['fit','in good shape'],c:'健康的',e:'Swimming keeps him fit all year round.',k:'fit'},
{t:'health',w:'exercise',s:['physical activity','workout','training'],c:'锻炼',e:'Regular physical activity can reduce stress.',k:'physical activity'},
{t:'health',w:'diet',s:['eating habits','nutrition'],c:'饮食',e:'Good nutrition is important for young children.',k:'nutrition'},
{t:'health',w:'medicine',s:['medication','drug','treatment'],c:'药物',e:'The doctor prescribed some medication for the cough.',k:'medication'},
{t:'health',w:'injury',s:['wound','damage','harm'],c:'受伤',e:'The fall caused serious damage to his knee.',k:'damage'},
{t:'health',w:'recover',s:['get better','heal','pull through'],c:'康复',e:'It took her several weeks to get better.',k:'get better'},
{t:'health',w:'pain',s:['ache','discomfort','soreness'],c:'疼痛',e:'She complained of a sharp ache in her back.',k:'ache'},
{t:'health',w:'stress',s:['pressure','strain','tension'],c:'压力',e:'Students often feel under pressure during exams.',k:'pressure'},
{t:'health',w:'relax',s:['unwind','take it easy','de-stress'],c:'放松',e:'A hot bath helps me unwind after work.',k:'unwind'},
{t:'health',w:'sleep',s:['rest','doze','nap'],c:'睡觉',e:'Take a short nap during the break.',k:'nap'},
{t:'health',w:'strong',s:['powerful','robust','sturdy'],c:'强壮的',e:'A robust immune system can fight off infections.',k:'robust'},
{t:'health',w:'weak',s:['fragile','feeble','vulnerable'],c:'虚弱的',e:'The patient is still quite fragile after the operation.',k:'fragile'},
{t:'health',w:'cure',s:['treat','heal','remedy'],c:'治疗',e:'Doctors are working to treat the disease.',k:'treat'},
{t:'health',w:'prevent',s:['stop','avoid','guard against'],c:'预防',e:'Regular checks can help stop the disease spreading.',k:'stop'},

/* ===DATA2=== */{t:'env',w:'environment',s:['surroundings','nature'],c:'环境',e:'We should protect the natural surroundings of the area.',k:'surroundings'},
{t:'env',w:'pollution',s:['contamination'],c:'污染',e:'Air contamination is a major concern for residents.',k:'contamination'},
{t:'env',w:'waste',s:['rubbish','garbage','litter'],c:'垃圾',e:'Visitors are asked not to leave litter on the beach.',k:'litter'},
{t:'env',w:'recycle',s:['reuse','reprocess'],c:'回收利用',e:'The bottles can be reused many times.',k:'reuse'},
{t:'env',w:'energy',s:['power','fuel'],c:'能源',e:'The building runs entirely on solar power.',k:'power'},
{t:'env',w:'climate',s:['weather patterns','weather conditions'],c:'气候',e:'The weather patterns have become less predictable.',k:'weather patterns'},
{t:'env',w:'damage',s:['harm','destroy','ruin'],c:'破坏',e:'The flood may destroy several bridges in the region.',k:'destroy'},
{t:'env',w:'protect',s:['preserve','conserve','safeguard'],c:'保护',e:'We must preserve the wetlands for future generations.',k:'preserve'},
{t:'env',w:'reduce',s:['cut down on','lower','decrease'],c:'减少',e:'The scheme aims to cut down on plastic waste.',k:'cut down on'},
{t:'env',w:'plant',s:['vegetation','flora'],c:'植物',e:'The region is rich in native vegetation.',k:'vegetation'},
{t:'env',w:'animal',s:['creature','wildlife','species'],c:'动物',e:'The island is home to many rare species.',k:'species'},
{t:'env',w:'resource',s:['supply','material','reserve'],c:'资源',e:'The country has large coal reserves.',k:'reserve'},
{t:'env',w:'growth',s:['expansion','development'],c:'增长',e:'Rapid urban expansion has affected local wildlife.',k:'expansion'},
{t:'env',w:'shortage',s:['lack','scarcity','deficit'],c:'短缺',e:'The region suffers from a lack of clean water.',k:'lack'},
{t:'env',w:'solve',s:['resolve','tackle','deal with'],c:'解决',e:'New technology may help tackle the problem.',k:'tackle'},
{t:'env',w:'eco-friendly',s:['environmentally friendly','sustainable','green'],c:'环保的',e:'The hotel uses sustainable materials.',k:'sustainable'},

{t:'living',w:'house',s:['home','accommodation','property'],c:'房子',e:'The accommodation includes heating and water bills.',k:'accommodation'},
{t:'living',w:'room',s:['space','studio','chamber'],c:'房间',e:'The studio is furnished and ready to move in.',k:'studio'},
{t:'living',w:'rent',s:['lease','hire','let'],c:'租',e:'The flat is available to lease from September.',k:'lease'},
{t:'living',w:'landlord',s:['owner','property owner'],c:'房东',e:'Contact the owner if the heater breaks down.',k:'owner'},
{t:'living',w:'bill',s:['charge','fee','payment'],c:'账单',e:'The charge covers electricity and water.',k:'charge'},
{t:'living',w:'pay',s:['cover','fund','meet the cost'],c:'支付',e:'The grant will cover your tuition fees.',k:'cover'},
{t:'living',w:'save',s:['economize','cut back'],c:'节省',e:'We need to cut back on heating costs.',k:'cut back'},
{t:'living',w:'quiet',s:['peaceful','calm','tranquil'],c:'安静的',e:'The village is peaceful and safe at night.',k:'peaceful'},
{t:'living',w:'noisy',s:['loud','deafening'],c:'吵闹的',e:'The room faces a loud main road.',k:'loud'},
{t:'living',w:'spacious',s:['roomy','generous','large'],c:'宽敞的',e:'The apartment has generous storage space.',k:'generous'},
{t:'living',w:'cramped',s:['tiny','poky','small'],c:'狭小的',e:'The kitchen is quite poky.',k:'poky'},
{t:'living',w:'comfortable',s:['cosy','snug','pleasant'],c:'舒适的',e:'The beds are cosy and the rooms are warm.',k:'cosy'},
{t:'living',w:'convenient',s:['handy','accessible','practical'],c:'方便的',e:'The shop is handy for daily essentials.',k:'handy'},
{t:'living',w:'remote',s:['isolated','out of the way','secluded'],c:'偏远的',e:'The cottage is isolated but very beautiful.',k:'isolated'},
{t:'living',w:'facilities',s:['amenities','services','equipment'],c:'设施',e:'The gym offers excellent amenities.',k:'amenities'},
{t:'living',w:'repair',s:['fix','mend','restore'],c:'修理',e:'The technician will fix the boiler tomorrow.',k:'fix'},

{t:'academic',w:'research',s:['investigation','study','survey'],c:'研究',e:'The investigation focused on local history.',k:'investigation'},
{t:'academic',w:'data',s:['information','figures','statistics'],c:'数据',e:'The figures suggest a steady rise in demand.',k:'figures'},
{t:'academic',w:'method',s:['approach','technique','way'],c:'方法',e:'The approach proved highly effective.',k:'approach'},
{t:'academic',w:'experiment',s:['test','trial','pilot'],c:'实验',e:'The trial ran for six months.',k:'trial'},
{t:'academic',w:'result',s:['outcome','finding','conclusion'],c:'结果',e:'The findings will be published next month.',k:'finding'},
{t:'academic',w:'cause',s:['lead to','result in','give rise to'],c:'导致',e:'Lack of sleep can lead to poor concentration.',k:'lead to'},
{t:'academic',w:'effect',s:['impact','influence','consequence'],c:'影响',e:'The policy had a significant impact on prices.',k:'impact'},
{t:'academic',w:'example',s:['instance','case','illustration'],c:'例子',e:'For instance, the course includes fieldwork.',k:'instance'},
{t:'academic',w:'reason',s:['factor','explanation','motive'],c:'原因',e:'The main factor was the cost of travel.',k:'factor'},
{t:'academic',w:'suggest',s:['indicate','imply','point to'],c:'表明',e:'The evidence points to a link between diet and health.',k:'point to'},
{t:'academic',w:'prove',s:['demonstrate','confirm','verify'],c:'证明',e:'The results confirm the original hypothesis.',k:'confirm'},
{t:'academic',w:'examine',s:['investigate','analyse','look into'],c:'检查，研究',e:'The team will analyse samples from the river.',k:'analyse'},
{t:'academic',w:'measure',s:['assess','gauge','evaluate'],c:'测量，评估',e:'Researchers will assess the impact on local wildlife.',k:'assess'},
{t:'academic',w:'compare',s:['contrast','weigh up'],c:'比较',e:'The study will contrast urban and rural schools.',k:'contrast'},
{t:'academic',w:'similar',s:['alike','comparable','analogous'],c:'相似的',e:'The two reports are broadly comparable.',k:'comparable'},
{t:'academic',w:'conclusion',s:['summary','outcome','verdict'],c:'结论',e:'In summary, the project was a success.',k:'summary'},

{t:'shopping',w:'price',s:['cost','charge','fee'],c:'价格',e:'The cost includes a three-year warranty.',k:'cost'},
{t:'shopping',w:'discount',s:['reduction','concession','deal'],c:'折扣',e:'Students get a ten percent reduction.',k:'reduction'},
{t:'shopping',w:'refund',s:['reimbursement','money back'],c:'退款',e:'You can get your money back within thirty days.',k:'money back'},
{t:'shopping',w:'receipt',s:['invoice','proof of purchase'],c:'收据',e:'Keep the invoice in case you need to return the item.',k:'invoice'},
{t:'shopping',w:'available',s:['in stock','on sale','obtainable'],c:'有货的',e:'The item is in stock at the main store.',k:'in stock'},
{t:'shopping',w:'unavailable',s:['out of stock','sold out'],c:'缺货的',e:'The larger size is currently sold out.',k:'sold out'},
{t:'shopping',w:'offer',s:['provide','supply','give'],c:'提供',e:'The store will provide free delivery on large orders.',k:'provide'},
{t:'shopping',w:'customer',s:['client','buyer','consumer'],c:'顾客',e:'Regular clients receive a loyalty card.',k:'client'},
{t:'shopping',w:'queue',s:['line','wait','stand in line'],c:'排队',e:'Visitors had to stand in line for tickets.',k:'stand in line'},
{t:'shopping',w:'popular',s:['well-liked','in demand','sought-after'],c:'受欢迎的',e:'The course is highly sought-after.',k:'sought-after'},
{t:'shopping',w:'trendy',s:['fashionable','stylish','modern'],c:'时尚的',e:'The café has a stylish interior.',k:'stylish'},
{t:'shopping',w:'bargain',s:['good value','deal','steal'],c:'便宜货，划算',e:'This jacket was really good value for money.',k:'good value'},
{t:'shopping',w:'delivery',s:['shipping','postage','dispatch'],c:'配送',e:'Shipping is free for orders over thirty pounds.',k:'shipping'},
{t:'shopping',w:'quality',s:['standard','grade','calibre'],c:'质量',e:'The products are of a high standard.',k:'standard'},
{t:'shopping',w:'guarantee',s:['warranty','assurance'],c:'保修',e:'The camera comes with a two-year warranty.',k:'warranty'},
{t:'shopping',w:'afford',s:['pay for','manage','cover the cost'],c:'负担得起',e:'Not all families can pay for private lessons.',k:'pay for'},

{t:'feelings',w:'happy',s:['delighted','pleased','content'],c:'高兴的',e:'She was delighted with the final results.',k:'delighted'},
{t:'feelings',w:'sad',s:['upset','miserable','down'],c:'难过的',e:'He felt miserable about missing the deadline.',k:'miserable'},
{t:'feelings',w:'angry',s:['annoyed','furious','irritated'],c:'生气的',e:'Residents were furious about the noise.',k:'furious'},
{t:'feelings',w:'worried',s:['anxious','concerned','nervous'],c:'担心的',e:'Parents are concerned about the changes.',k:'concerned'},
{t:'feelings',w:'surprised',s:['astonished','amazed','stunned'],c:'惊讶的',e:'I was amazed by the size of the library.',k:'amazed'},
{t:'feelings',w:'confused',s:['puzzled','bewildered','unsure'],c:'困惑的',e:'Tourists were puzzled by the signs.',k:'puzzled'},
{t:'feelings',w:'interested',s:['keen','enthusiastic','fascinated'],c:'感兴趣的',e:'She is keen to learn more about local history.',k:'keen'},
{t:'feelings',w:'bored',s:['uninterested','fed up','tired of'],c:'无聊的',e:'He is fed up with the same routine.',k:'fed up'},
{t:'feelings',w:'excited',s:['thrilled','eager','exhilarated'],c:'兴奋的',e:'The children were thrilled about the trip.',k:'thrilled'},
{t:'feelings',w:'afraid',s:['scared','frightened','terrified'],c:'害怕的',e:'She is frightened of flying.',k:'frightened'},
{t:'feelings',w:'grateful',s:['thankful','appreciative'],c:'感激的',e:'We are thankful for your generous support.',k:'thankful'},
{t:'feelings',w:'confident',s:['sure','certain','self-assured'],c:'自信的',e:'She felt certain about her answer.',k:'certain'},
{t:'feelings',w:'doubtful',s:['uncertain','unsure','sceptical'],c:'怀疑的',e:'Experts are sceptical about the claims.',k:'sceptical'},
{t:'feelings',w:'prefer',s:['favour','would rather','like better'],c:'更喜欢',e:'Most students favour online lectures.',k:'favour'},
{t:'feelings',w:'agree',s:['consent','concur','be in favour of'],c:'同意',e:'The committee is in favour of the proposal.',k:'be in favour of'},
{t:'feelings',w:'disagree',s:['oppose','object to','be against'],c:'反对',e:'Some residents object to the new plan.',k:'object to'},
{t:'feelings',w:'refuse',s:['decline','reject','turn down'],c:'拒绝',e:'She may turn down the offer of a job.',k:'turn down'}
];

/* ===UTIL=== *//* ================= 工具函数 ================= */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const GOAL = 30;
function shuffle(arr){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function todayStr(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function ydayStr(){ const d=new Date(Date.now()-864e5); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function highlight(text, key){
  const t = String(text), k = String(key||'');
  if(!k) return escapeHtml(t);
  const i = t.toLowerCase().indexOf(k.toLowerCase());
  if(i < 0) return escapeHtml(t);
  return escapeHtml(t.slice(0,i)) + '<mark>' + escapeHtml(t.slice(i, i+k.length)) + '</mark>' + escapeHtml(t.slice(i+k.length));
}
let toastTimer = null;
function toast(msg){
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), 2200);
}
function topicName(id){ const t = TOPICS.find(x=>x.id===id); return t ? t.icon+' '+t.name : ''; }

/* 语音合成（浏览器内置，无需网络） */
let voices = [];
if('speechSynthesis' in window){
  const load = ()=>{ voices = speechSynthesis.getVoices(); };
  load();
  speechSynthesis.onvoiceschanged = load;
}
function speak(text, rate){
  if(!('speechSynthesis' in window)){ toast('当前浏览器不支持语音合成，请使用 Chrome / Edge'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = voices.find(x=>x.lang==='en-GB') || voices.find(x=>x.lang && x.lang.startsWith('en'));
  if(v) u.voice = v;
  u.lang = 'en-GB';
  u.rate = rate || 0.85;
  speechSynthesis.speak(u);
}

/* ================= 数据持久化 ================= */
const DB_KEY = 'ielts-syn-trainer-v1';
function defaultState(){ return { stats:{}, daily:{date:'',count:0}, streak:0, lastDate:'', wordbook:[] }; }
function loadState(){ try{ const raw = localStorage.getItem(DB_KEY); return raw ? Object.assign(defaultState(), JSON.parse(raw)) : null; }catch(e){ return null; } }
let state = loadState() || defaultState();
function saveState(){ try{ localStorage.setItem(DB_KEY, JSON.stringify(state)); }catch(e){ toast('保存失败：浏览器存储不可用'); } }
function wordStat(w){ return state.stats[w] || {seen:0, correct:0, wrong:0}; }
function isMastered(w){ const s = wordStat(w); return s.seen >= 4 && s.wrong <= 1; }
function addWordbook(w){ if(!state.wordbook.includes(w)){ state.wordbook.push(w); saveState(); } }
function recordAnswer(w, ok){
  const s = wordStat(w);
  s.seen++; ok ? s.correct++ : s.wrong++;
  state.stats[w] = s;
  const t = todayStr();
  if(state.daily.date !== t){
    if(state.lastDate === ydayStr()) state.streak++;
    else state.streak = 1;
    state.lastDate = t;
    state.daily = {date:t, count:0};
  }
  state.daily.count++;
  saveState();
  renderHeaderStats();
}
function renderHeaderStats(){
  const el = $('#streak-badge');
  el.textContent = '🔥 连续 ' + state.streak + ' 天 · 今日 ' + state.daily.count + '/' + GOAL + ' 词';
}

/* ================= 视图切换 ================= */
function switchView(name){
  $$('.tab').forEach(b=>b.classList.toggle('active', b.dataset.view===name));
  $$('.view').forEach(v=>v.classList.toggle('active', v.id==='view-'+name));
  if('speechSynthesis' in window) speechSynthesis.cancel();
  window.scrollTo({top:0});
  if(name==='learn') renderLearn();
  if(name==='stats') renderStats();
}
$$('.tab').forEach(b=>b.addEventListener('click', ()=>switchView(b.dataset.view)));

/* ================= 词库 ================= */
let learnTopic = 'all';
let learnQuery = '';
function learnPool(){
  return learnTopic==='all' ? WORDS : WORDS.filter(w=>w.t===learnTopic);
}
function renderLearn(){
  const chips = ['<button class="chip '+(learnTopic==='all'?'on':'')+'" data-t="all">📚 全部 <i>'+WORDS.length+'</i></button>']
    .concat(TOPICS.map(t=>'<button class="chip '+(learnTopic===t.id?'on':'')+'" data-t="'+t.id+'">'+t.icon+' '+t.name+' <i>'+WORDS.filter(w=>w.t===t.id).length+'</i></button>'));
  $('#learn-topics').innerHTML = chips.join('');
  $$('#learn-topics .chip').forEach(b=>b.addEventListener('click', ()=>{ learnTopic = b.dataset.t; renderLearn(); }));
  renderLearnList();
}
function renderLearnList(){
  const q = learnQuery.trim().toLowerCase();
  const list = learnPool().filter(w=>{
    if(!q) return true;
    return w.w.toLowerCase().includes(q) || w.c.includes(learnQuery.trim()) ||
      w.s.some(s=>s.toLowerCase().includes(q)) || w.e.toLowerCase().includes(q);
  });
  const box = $('#learn-list');
  if(!list.length){ box.innerHTML = '<div class="empty">没有匹配的单词，换个关键词试试～</div>'; return; }
  box.innerHTML = list.map(w=>{
    const syn = w.s.map(s=>'<button class="syn-chip" data-speak="'+escapeHtml(s)+'">'+escapeHtml(s)+'</button>').join('');
    const m = isMastered(w.w) ? '<span class="done">✅ 已掌握</span>' : '';
    return '<div class="word-card">'+
      '<div class="wc-top"><div><div class="wc-word">'+escapeHtml(w.w)+'</div><div class="wc-cn">'+escapeHtml(w.c)+'</div></div>'+
      '<button class="icon-btn" data-speak="'+escapeHtml(w.w)+'">🔊</button></div>'+
      '<div class="wc-syn">'+syn+'</div>'+
      '<p class="wc-ex">'+highlight(w.e, w.k)+'</p>'+
      '<div class="wc-meta"><span>'+topicName(w.t)+'</span>'+m+'</div>'+
    '</div>';
  }).join('');
}
$('#learn-search').addEventListener('input', e=>{ learnQuery = e.target.value; renderLearnList(); });
$('#learn-list').addEventListener('click', e=>{
  const t = e.target.closest('[data-speak]');
  if(t) speak(t.dataset.speak);
});

/* ================= 闪卡 ================= */
let flashTopic = 'all';
let flashDir = 'forward';
let flash = {list:[], idx:0, known:0, unknown:0};
function renderFlashSetup(){
  const chips = ['<button class="chip '+(flashTopic==='all'?'on':'')+'" data-t="all">📚 全部</button>']
    .concat(TOPICS.map(t=>'<button class="chip '+(flashTopic===t.id?'on':'')+'" data-t="'+t.id+'">'+t.icon+' '+t.name+'</button>'));
  $('#flash-topics').innerHTML = chips.join('');
  $$('#flash-topics .chip').forEach(b=>b.addEventListener('click', ()=>{ flashTopic = b.dataset.t; renderFlashSetup(); }));
}
$$('#flash-dirs .chip').forEach(b=>b.addEventListener('click', ()=>{ flashDir = b.dataset.dir; $$('#flash-dirs .chip').forEach(x=>x.classList.toggle('on', x===b)); }));
$('#flash-start').addEventListener('click', startFlash);
$('#flash-skip-start').addEventListener('click', ()=>{ flashTopic='all'; startFlash(); });
$('#flash-again').addEventListener('click', ()=>{ $('#flash-end').classList.add('hidden'); startFlash(); });
$('#flash-end-back').addEventListener('click', ()=>{ $('#flash-end').classList.add('hidden'); $('#flash-game').classList.add('hidden'); $('#flash-card').classList.remove('flipped'); });
function startFlash(){
  const pool = flashTopic==='all' ? WORDS : WORDS.filter(w=>w.t===flashTopic);
  if(pool.length < 2){ toast('该主题词太少，无法开始'); return; }
  flash = {list:shuffle(pool), idx:0, known:0, unknown:0};
  $('#flash-end').classList.add('hidden');
  $('#flash-game').classList.remove('hidden');
  renderFlashCard();
}
function renderFlashCard(){
  const e = flash.list[flash.idx];
  const fwd = flashDir==='forward';
  const shown = fwd ? e.w : e.s[Math.floor(Math.random()*e.s.length)];
  flash.curKey = shown;
  $('#flash-card').classList.remove('flipped');
  $('#flash-front').innerHTML = '<div class="f-word">'+escapeHtml(shown)+'</div>'+
    (fwd ? '<div class="f-cn">'+escapeHtml(e.c)+'</div>' : '<div class="f-cn">找出与它意思相同的单词</div>')+
    '<div class="f-hint">点击卡片翻转</div>';
  const synChips = e.s.map(s=>'<button class="syn-chip" data-speak="'+escapeHtml(s)+'">'+escapeHtml(s)+'</button>').join('');
  $('#flash-back').innerHTML =
    (fwd ? '<div class="f-word">'+escapeHtml(e.w)+'</div><div class="f-cn">'+escapeHtml(e.c)+'</div>' : '<div class="f-syns">'+synChips+'</div>')+
    (fwd ? '<div class="f-syns">'+synChips+'</div>' : '<div class="f-word">'+escapeHtml(e.w)+'</div><div class="f-cn">'+escapeHtml(e.c)+'</div>')+
    '<div class="f-ex">'+highlight(e.e, e.k)+'</div>';
  $('#flash-pos').textContent = '第 '+(flash.idx+1)+' / '+flash.list.length+' 张';
  $('#flash-count').textContent = '✓ '+flash.known+' · ✗ '+flash.unknown;
}
$('#flash-card').addEventListener('click', ()=>{ if(!$('#flash-game').classList.contains('hidden')) $('#flash-card').classList.toggle('flipped'); });
$('#flash-back').addEventListener('click', e=>{
  const t = e.target.closest('[data-speak]');
  if(t){ e.stopPropagation(); speak(t.dataset.speak); }
});
$('#flash-speak').addEventListener('click', e=>{ e.stopPropagation(); if(flash.idx<flash.list.length) speak(flash.curKey); });
$('#flash-yes').addEventListener('click', e=>{ e.stopPropagation(); if(flash.idx>=flash.list.length) return; recordAnswer(flash.list[flash.idx].w, true); flash.known++; nextFlash(); });
$('#flash-no').addEventListener('click', e=>{ e.stopPropagation(); if(flash.idx>=flash.list.length) return; const w = flash.list[flash.idx]; recordAnswer(w.w, false); addWordbook(w.w); flash.unknown++; nextFlash(); });
function nextFlash(){
  flash.idx++;
  if(flash.idx >= flash.list.length){ endFlash(); return; }
  renderFlashCard();
}
function endFlash(){
  $('#flash-game').classList.add('hidden');
  $('#flash-end').classList.remove('hidden');
  $('#flash-end-msg').textContent = '认识 '+flash.known+' 个，不认识 '+flash.unknown+' 个'+(flash.unknown? '（已自动加入生词本）':'，太棒了！');
}

/* ===PRAC=== *//* ================= 练习 ================= */
let pTopics = new Set();
let pType = 'mcq';
let pDir = 'forward';
let pCount = 10;
let prac = null;

function renderPracticeSetup(){
  const chips = ['<button class="chip '+(pTopics.size===0?'on':'')+'" data-t="all">📚 全部</button>']
    .concat(TOPICS.map(t=>'<button class="chip '+(pTopics.has(t.id)?'on':'')+'" data-t="'+t.id+'">'+t.icon+' '+t.name+'</button>'));
  $('#p-topics').innerHTML = chips.join('');
  $$('#p-topics .chip').forEach(b=>b.addEventListener('click', ()=>{
    const t = b.dataset.t;
    if(t==='all'){ pTopics.clear(); }
    else if(pTopics.has(t)){ pTopics.delete(t); }
    else { pTopics.add(t); }
    renderPracticeSetup();
  }));
}
$$('#p-dirs .chip').forEach(b=>b.addEventListener('click', ()=>{ pDir = b.dataset.dir; $$('#p-dirs .chip').forEach(x=>x.classList.toggle('on', x===b)); }));
$$('#p-counts .chip').forEach(b=>b.addEventListener('click', ()=>{ pCount = +b.dataset.n; $$('#p-counts .chip').forEach(x=>x.classList.toggle('on', x===b)); }));
$$('#p-types .type-card').forEach(c=>c.addEventListener('click', ()=>{ pType = c.querySelector('input').value; $$('#p-types .type-card').forEach(x=>x.classList.toggle('sel', x===c)); }));
function practicePool(){
  if(pTopics.size===0) return WORDS.slice();
  return WORDS.filter(w=>pTopics.has(w.t));
}
function startPractice(reviewOnly){
  let pool = reviewOnly ? WORDS.filter(w=>state.wordbook.includes(w.w)) : practicePool();
  if(pool.length < 4){ toast('可选单词不足 4 个，请扩大范围'); return; }
  if(pType==='match' && pool.length < 6){ toast('配对题需要至少 6 个单词'); return; }
  const count = pType==='match' ? 6 : Math.min(pCount, pool.length);
  prac = { type:pType, dir:pDir, count:count, queue:shuffle(pool).slice(0, count),
           idx:0, score:0, wrongs:[], answered:false };
  $('#practice-setup').classList.add('hidden');
  $('#practice-result').classList.add('hidden');
  $('#practice-game').classList.remove('hidden');
  $('#quiz-score').textContent = '0';
  renderQuizTop();
  renderQuestion();
}
$('#p-start').addEventListener('click', ()=>startPractice(false));
$('#quiz-quit').addEventListener('click', quitPractice);
function quitPractice(){
  if('speechSynthesis' in window) speechSynthesis.cancel();
  $('#practice-game').classList.add('hidden');
  $('#practice-result').classList.add('hidden');
  $('#practice-setup').classList.remove('hidden');
  prac = null;
  renderPracticeSetup();
}
function renderQuizTop(){
  const total = prac.queue.length;
  $('#quiz-pos').textContent = '第 '+(prac.idx+1)+' / '+total+' 题';
  $('#quiz-fill').style.width = (prac.idx/total*100)+'%';
}
function renderQuestion(){
  prac.answered = false;
  renderQuizTop();
  const q = prac.queue[prac.idx];
  if(prac.type==='match'){ renderMatch(); return; }
  if(prac.type==='listen'){ renderListen(q); return; }
  renderMcq(q);
}
/* ---- 选择题 ---- */
function distractorSyns(entry, n){
  const others = shuffle(WORDS.filter(x=>x.w!==entry.w));
  const out = [];
  for(const o of others){
    for(const s of o.s){
      if(!entry.s.includes(s) && !out.includes(s)){ out.push(s); if(out.length>=n) return out; }
    }
  }
  return out;
}
function distractorWords(entry, n){
  return shuffle(WORDS.filter(x=>x.w!==entry.w).map(x=>x.w)).filter((v,i,a)=>a.indexOf(v)===i).slice(0,n);
}
function renderMcq(q){
  const fwd = pDir==='mixed' ? Math.random()<0.5 : pDir==='forward';
  let prompt, correct, opts, shown;
  if(fwd){
    shown = q.w; correct = q.s[Math.floor(Math.random()*q.s.length)];
    opts = shuffle([correct].concat(distractorSyns(q,3)));
    prompt = '选出 “<b>'+escapeHtml(q.w)+'</b>（'+escapeHtml(q.c)+'）” 的同义词';
  }else{
    shown = q.s[Math.floor(Math.random()*q.s.length)]; correct = q.w;
    opts = shuffle([correct].concat(distractorWords(q,3)));
    prompt = '“<b>'+escapeHtml(shown)+'</b>” 与下面哪个词意思相同？';
  }
  prac.q = {type:'mcq', fwd, correct, opts, shown, w:q.w, cn:q.c, e:q.e, k:q.k};
  $('#quiz-body').innerHTML =
    '<div class="q-card">'+
      '<div class="q-word">'+escapeHtml(shown)+' '+(fwd?'<span class="q-cn">'+escapeHtml(q.c)+'</span>':'')+
        '<button class="icon-btn" id="speak-word">🔊</button></div>'+
      '<div class="q-prompt">'+prompt+'</div>'+
      '<div class="options">'+opts.map((o,i)=>'<button class="opt" data-opt="'+escapeHtml(o)+'"><span class="k">'+(i+1)+'</span>'+escapeHtml(o)+'</button>').join('')+'</div>'+
      '<div class="feedback" id="feedback"></div>'+
      '<div class="next-row hidden" id="next-row"><button class="btn btn-primary btn-sm" id="next-btn">下一题 →</button></div>'+
    '</div>';
  $('#speak-word').addEventListener('click', ()=>speak(shown));
  bindOptionClicks();
  $('#next-btn').addEventListener('click', nextQuestion);
}
/* ---- 听力题 ---- */
function renderListen(q){
  const correct = q.s.find(s=>q.e.toLowerCase().includes(s.toLowerCase())) || q.s[0];
  const opts = shuffle([correct].concat(distractorSyns(q,3)));
  prac.q = {type:'listen', correct, opts, w:q.w, cn:q.c, e:q.e, k:q.k};
  $('#quiz-body').innerHTML =
    '<div class="q-card">'+
      '<div class="listen-row">'+
        '<button class="listen-btn" id="play-btn">🔊 播放句子</button>'+
        '<button class="icon-btn" id="replay-btn" title="再听一遍">🔁 再听一遍</button>'+
      '</div>'+
      '<div class="q-prompt">听录音：说话者用哪个词表达了 “<b>'+escapeHtml(q.w)+'</b>（'+escapeHtml(q.c)+'）” 的意思？</div>'+
      '<div class="options">'+opts.map((o,i)=>'<button class="opt" data-opt="'+escapeHtml(o)+'"><span class="k">'+(i+1)+'</span>'+escapeHtml(o)+'</button>').join('')+'</div>'+
      '<div class="feedback" id="feedback"></div>'+
      '<div class="next-row hidden" id="next-row"><button class="btn btn-primary btn-sm" id="next-btn">下一题 →</button></div>'+
    '</div>';
  const play = ()=>{ speak(q.e); const b=$('#play-btn'); b.classList.add('playing'); setTimeout(()=>b.classList.remove('playing'), 2500); };
  $('#play-btn').addEventListener('click', play);
  $('#replay-btn').addEventListener('click', play);
  setTimeout(play, 400);
  bindOptionClicks();
  $('#next-btn').addEventListener('click', nextQuestion);
}
/* ---- 选项点击与作答 ---- */
function bindOptionClicks(){
  $$('#quiz-body .opt').forEach(b=>b.addEventListener('click', ()=>answer(b)));
}
function answer(btn){
  if(prac.answered) return;
  prac.answered = true;
  const q = prac.q;
  const chosen = btn.dataset.opt;
  const ok = chosen === q.correct;
  $$('#quiz-body .opt').forEach(b=>{
    b.disabled = true;
    if(b.dataset.opt===q.correct) b.classList.add('correct');
    else if(b===btn) b.classList.add('wrong');
  });
  if(ok) prac.score++;
  recordAnswer(q.w, ok);
  if(!ok){
    addWordbook(q.w);
    prac.wrongs.push({w:q.w, cn:q.c, s:q.s, e:q.e, k:q.k, your:chosen, correct:q.correct});
  }
  const fb = $('#feedback');
  let html;
  if(ok){
    html = '✅ 正确！<b>'+escapeHtml(q.correct)+'</b> 是 '+escapeHtml(q.w)+'（'+escapeHtml(q.c)+'）的同义词。';
  }else{
    html = '❌ 正确答案是 <b>'+escapeHtml(q.correct)+'</b>（'+escapeHtml(q.correct)+' = '+escapeHtml(q.w)+' '+escapeHtml(q.c)+'）。';
  }
  html += '<div class="transcript">📝 '+(q.type==='listen'?'录音原文':'例句')+'：'+highlight(q.e, q.k)+'</div>';
  fb.innerHTML = html;
  fb.className = 'feedback show '+(ok?'ok':'bad');
  $('#next-row').classList.remove('hidden');
  $('#quiz-score').textContent = prac.score;
}
function nextQuestion(){
  prac.idx++;
  if(prac.idx >= prac.queue.length){ endPractice(); return; }
  renderQuestion();
}
/* ---- 配对题 ---- */
let match = null;
function renderMatch(){
  const entries = prac.queue.slice(0,6);
  match = {entries, left:shuffle(entries.map(e=>({w:e.w, done:false}))), right:shuffle(entries.map(e=>({w:e.s[0], key:e.w, done:false}))),
           selL:null, selR:null, moves:0, matched:0};
  $('#quiz-body').innerHTML =
    '<div class="match-wrap">'+
      '<div class="match-head"><span id="m-progress">已配对 0 / 6</span><span>步数 <b id="m-moves">0</b></span></div>'+
      '<div class="match-grid">'+
        '<div class="match-col"><div class="m-col-title">单词</div>'+match.left.map(c=>'<button class="m-card" data-side="l" data-w="'+escapeHtml(c.w)+'">'+escapeHtml(c.w)+'</button>').join('')+'</div>'+
        '<div class="match-col"><div class="m-col-title">同义词</div>'+match.right.map(c=>'<button class="m-card" data-side="r" data-key="'+escapeHtml(c.key)+'" data-w="'+escapeHtml(c.w)+'">'+escapeHtml(c.w)+'</button>').join('')+'</div>'+
      '</div>'+
      '<div class="next-row hidden" id="next-row"><button class="btn btn-primary btn-sm" id="next-btn">查看结果 →</button></div>'+
    '</div>';
  $$('#quiz-body .m-card').forEach(b=>b.addEventListener('click', ()=>matchClick(b)));
  $('#next-btn').addEventListener('click', ()=>{ prac.wrongs = []; endPractice(); });
}
function matchClick(btn){
  if(btn.classList.contains('done')) return;
  const side = btn.dataset.side;
  const isSel = btn.classList.contains('sel');
  if(side==='l'){ if(match.selL) match.selL.classList.remove('sel'); match.selL = isSel ? null : btn; }
  else { if(match.selR) match.selR.classList.remove('sel'); match.selR = isSel ? null : btn; }
  btn.classList.toggle('sel');
  if(match.selL && match.selR){
    match.moves++;
    $('#m-moves').textContent = match.moves;
    const l = match.selL, r = match.selR;
    match.selL = match.selR = null;
    if(l.dataset.w === r.dataset.key){
      l.classList.remove('sel'); r.classList.remove('sel');
      l.classList.add('done'); r.classList.add('done');
      l.disabled = r.disabled = true;
      match.matched++;
      $('#m-progress').textContent = '已配对 '+match.matched+' / 6';
      if(match.matched===6){
        match.entries.forEach(e=>recordAnswer(e.w, true));
        $('#next-row').classList.remove('hidden');
        toast('🎉 全部配对成功！');
      }
    }else{
      l.classList.remove('sel'); r.classList.remove('sel');
      l.classList.add('wrong'); r.classList.add('wrong');
      setTimeout(()=>{ l.classList.remove('wrong'); r.classList.remove('wrong'); }, 500);
    }
  }
}
/* ---- 结果页 ---- */
function endPractice(){
  if('speechSynthesis' in window) speechSynthesis.cancel();
  if(prac.type==='match') prac.score = 6;
  $('#practice-game').classList.add('hidden');
  const total = prac.type==='match' ? 6 : prac.queue.length;
  const acc = Math.round(prac.score/total*100);
  const emoji = acc===100 ? '🏆' : acc>=80 ? '🎉' : acc>=60 ? '💪' : '📚';
  $('#res-emoji').textContent = emoji;
  $('#res-title').textContent = prac.type==='match' ? '配对完成！' : '练习完成！';
  $('#res-score').textContent = '得分 '+prac.score+' / '+total;
  $('#res-sub').textContent = '正确率 '+acc+'%' + (acc>=80 ? ' · 同义替换掌握得不错！' : ' · 错题已自动加入生词本');
  $('#res-chips').innerHTML = [
    '<div><b>'+prac.score+'</b>答对</div>',
    '<div><b>'+acc+'%</b>正确率</div>',
    '<div><b>'+total+'</b>总题数</div>'
  ].join('');
  const wrongBox = $('#res-wrong');
  if(prac.wrongs.length){
    wrongBox.innerHTML = '<h4>❌ 错题回顾（已加入生词本）</h4>'+prac.wrongs.map(it=>
      '<div class="wrong-item"><div><b>'+escapeHtml(it.w)+'</b> <span class="wc">'+escapeHtml(it.c || '')+'</span></div>'+
      '<div>你选 <span class="wa">'+escapeHtml(it.your || '')+'</span> → 正确 <span class="wb">'+escapeHtml(it.correct)+'</span></div></div>').join('');
  }else{
    wrongBox.innerHTML = '';
  }
  $('#practice-result').classList.remove('hidden');
}
$('#res-again').addEventListener('click', ()=>{ $('#practice-result').classList.add('hidden'); $('#practice-game').classList.remove('hidden'); prac.idx=0; prac.score=0; prac.wrongs=[]; $('#quiz-score').textContent='0'; renderQuizTop(); renderQuestion(); });
$('#res-back').addEventListener('click', quitPractice);

/* 键盘快捷键：1-4 选题，Enter 下一题 */
document.addEventListener('keydown', e=>{
  if(!prac || prac.type==='match' || $('#practice-game').classList.contains('hidden')) return;
  if(e.key>='1' && e.key<='4'){
    const opt = $$('#quiz-body .opt')[+e.key-1];
    if(opt && !opt.disabled){ opt.click(); }
  }else if(e.key==='Enter'){
    const nb = $('#next-btn');
    if(nb && !nb.closest('.hidden')) nb.click();
  }
});

/* ===STATS=== *//* ================= 统计 ================= */
function renderStats(){
  const totalSeen = Object.values(state.stats).reduce((a,s)=>a+s.seen,0);
  const totalOk = Object.values(state.stats).reduce((a,s)=>a+s.correct,0);
  const totalQ = Object.values(state.stats).reduce((a,s)=>a+s.correct+s.wrong,0);
  const acc = totalQ ? Math.round(totalOk/totalQ*100) : 0;
  const mastered = WORDS.filter(w=>isMastered(w.w)).length;
  const today = state.daily.date===todayStr() ? state.daily.count : 0;
  $('#stat-cards').innerHTML = [
    ['🎯','今日练习', today+' / '+GOAL],
    ['📝','累计题目', totalSeen],
    ['🎯','正确率', acc+'%'],
    ['🏆','已掌握', mastered+' 词'],
    ['📌','生词本', state.wordbook.length+' 词'],
    ['🔥','连续天数', state.streak+' 天']
  ].map(x=>'<div class="stat-card"><div class="num">'+x[2]+'</div><div class="lbl">'+x[0]+' '+x[1]+'</div></div>').join('');
  $('#topic-progress').innerHTML = TOPICS.map(t=>{
    const ws = WORDS.filter(w=>w.t===t.id);
    const done = ws.filter(w=>wordStat(w.w).seen>0).length;
    const pct = Math.round(done/ws.length*100);
    return '<div class="topic-bar"><span class="tn">'+t.icon+' '+t.name+'</span>'+
      '<div class="track"><div class="fill" style="width:'+pct+'%"></div></div>'+
      '<span class="pct">'+done+'/'+ws.length+'</span></div>';
  }).join('');
  renderWordbook();
}
function renderWordbook(){
  $('#wb-count').textContent = state.wordbook.length ? '（'+state.wordbook.length+' 个待复习）' : '';
  const box = $('#wordbook-list');
  if(!state.wordbook.length){ box.innerHTML = '<div class="empty">暂无生词。闪卡点“不认识”或练习答错的词会自动加入这里。</div>'; return; }
  box.innerHTML = state.wordbook.map(w=>{
    const e = WORDS.find(x=>x.w===w);
    if(!e) return '';
    return '<div class="wb-item"><span class="wb-word">'+escapeHtml(e.w)+'</span><span class="wb-cn">'+escapeHtml(e.c)+'</span>'+
      '<span class="wb-syn">'+e.s.map(s=>'<span>'+escapeHtml(s)+'</span>').join('')+'</span>'+
      '<button class="rm-btn" data-rm="'+escapeHtml(e.w)+'">移除</button></div>';
  }).join('');
}
$('#wordbook-list').addEventListener('click', e=>{
  const b = e.target.closest('[data-rm]');
  if(b){ state.wordbook = state.wordbook.filter(w=>w!==b.dataset.rm); saveState(); renderStats(); }
});
$('#review-start').addEventListener('click', ()=>{ if(!state.wordbook.length){ toast('生词本是空的'); return; } switchView('practice'); pType='mcq'; startPractice(true); });
$('#wordbook-clear').addEventListener('click', ()=>{ state.wordbook = []; saveState(); renderStats(); toast('生词本已清空'); });
$('#reset-all').addEventListener('click', ()=>{
  if(confirm('确定要清空所有学习数据吗？此操作不可恢复。')){ state = defaultState(); saveState(); renderHeaderStats(); renderStats(); toast('已重置全部数据'); }
});

/* ================= 初始化 ================= */
function init(){
  renderHeaderStats();
  renderLearn();
  renderFlashSetup();
  renderPracticeSetup();
}
init();
