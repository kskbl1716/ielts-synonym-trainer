
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
{t:'core',w:'important',s:['crucial','vital','essential','significant'],c:'重要的',e:'It is crucial to book your tickets well in advance.',k:'crucial',p:'ɪmˈpɔːtnt',pos:'adj.',d:'having great value or influence',z:'l'},
{t:'core',w:'improve',s:['enhance','boost','upgrade'],c:'改善，提高',e:'The new software will enhance the overall efficiency of the office.',k:'enhance',p:'ɪmˈpruːv',pos:'v.',d:'to make something better',z:'l'},
{t:'core',w:'problem',s:['issue','difficulty','challenge'],c:'问题',e:'The main issue is the lack of affordable housing.',k:'issue',p:'ˈprɒbləm',pos:'n.',d:'a difficulty that needs to be solved',z:'l'},
{t:'core',w:'increase',s:['rise','grow','climb'],c:'增加',e:'The number of international students has continued to rise sharply.',k:'rise',p:'ˈɪnkriːs',pos:'n.',d:'a rise in amount or number',z:'l'},
{t:'core',w:'decrease',s:['decline','drop','fall','reduce'],c:'减少',e:'Sales are expected to decline by ten percent this year.',k:'decline',p:'ˈdiːkriːs',pos:'n.',d:'a reduction in amount or number',z:'l'},
{t:'core',w:'expensive',s:['costly','pricey'],c:'昂贵的',e:'The accommodation was quite costly for a student.',k:'costly',p:'ɪkˈspensɪv',pos:'adj.',d:'costing a lot of money',z:'l'},
{t:'core',w:'cheap',s:['inexpensive','affordable'],c:'便宜的',e:'The course offers affordable study materials.',k:'affordable',p:'tʃiːp',pos:'adj.',d:'costing little money',z:'l'},
{t:'core',w:'big',s:['large','huge','massive','considerable'],c:'大的',e:'A huge number of people attended the opening ceremony.',k:'huge',p:'bɪɡ',pos:'adj.',d:'large in size or amount',z:'l'},
{t:'core',w:'small',s:['tiny','minor','slight'],c:'小的',e:'There was a slight delay at the start of the session.',k:'slight',p:'smɔːl',pos:'adj.',d:'little in size or amount',z:'l'},
{t:'core',w:'need',s:['require','demand','call for'],c:'需要',e:'This role will require a strong command of English.',k:'require',p:'niːd',pos:'v.',d:'to require something',z:'l'},
{t:'core',w:'show',s:['demonstrate','indicate','reveal'],c:'显示，表明',e:'The data seems to indicate a clear upward trend.',k:'indicate',p:'ʃəʊ',pos:'v.',d:'to make something clear or visible',z:'l'},
{t:'core',w:'get',s:['obtain','acquire','receive'],c:'获得',e:'Students can obtain a discount with their university card.',k:'obtain',p:'ɡet',pos:'v.',d:'to obtain or receive something',z:'l'},
{t:'core',w:'buy',s:['purchase','acquire'],c:'购买',e:'You can purchase tickets at the main entrance.',k:'purchase',p:'baɪ',pos:'v.',d:'to get something by paying money',z:'l'},
{t:'core',w:'help',s:['assist','support','aid'],c:'帮助',e:'Staff are available to assist you at any time.',k:'assist',p:'help',pos:'v.',d:'to make it easier for someone to do something',z:'l'},
{t:'core',w:'start',s:['begin','commence','launch'],c:'开始',e:'The lecture will commence at nine o\'clock sharp.',k:'commence',p:'stɑːt',pos:'v.',d:'to begin',z:'l'},
{t:'core',w:'finish',s:['complete','conclude','finalize'],c:'完成',e:'All participants must complete the form before the deadline.',k:'complete',p:'ˈfɪnɪʃ',pos:'v.',d:'to complete something',z:'l'},
{t:'core',w:'choose',s:['select','pick','opt for'],c:'选择',e:'You may select any three modules from the list.',k:'select',p:'tʃuːz',pos:'v.',d:'to pick one thing from a group',z:'l'},
{t:'core',w:'change',s:['alter','modify','adjust'],c:'改变',e:'We may need to adjust the timetable.',k:'adjust',p:'tʃeɪndʒ',pos:'v.',d:'to make or become different',z:'l'},
{t:'core',w:'enough',s:['sufficient','adequate'],c:'足够的',e:'Make sure you bring sufficient warm clothing for the trip.',k:'sufficient',p:'ɪˈnʌf',pos:'adj.',d:'as much as is needed',z:'l'},
{t:'core',w:'many',s:['numerous','a large number of'],c:'许多',e:'Numerous studies have confirmed the benefits of exercise.',k:'numerous',p:'ˈmeni',pos:'adj.',d:'a large number of',z:'l'},
{t:'core',w:'most',s:['the majority of'],c:'大多数',e:'The majority of respondents agreed with the statement.',k:'majority',p:'məʊst',pos:'adj.',d:'the majority of',z:'l'},
{t:'core',w:'also',s:['in addition','moreover','furthermore'],c:'此外',e:'In addition, the course includes weekly tutorials.',k:'in addition',p:'ˈɔːlsəʊ',pos:'adv.',d:'in addition',z:'l'},
{t:'core',w:'because',s:['due to','owing to','since'],c:'因为',e:'The event was postponed due to heavy rain.',k:'due to',p:'bɪˈkɒz',pos:'conj.',d:'for the reason that',z:'l'},
{t:'core',w:'so',s:['therefore','consequently','as a result'],c:'因此',e:'Therefore, we strongly recommend booking early.',k:'therefore',p:'səʊ',pos:'conj.',d:'therefore',z:'l'},
{t:'core',w:'but',s:['however','nevertheless','whereas'],c:'但是',e:'However, the price does not include meals.',k:'however',p:'bʌt',pos:'conj.',d:'however',z:'l'},
{t:'core',w:'maybe',s:['perhaps','possibly','potentially'],c:'也许',e:'Perhaps we could arrange a meeting earlier in the week.',k:'perhaps',p:'ˈmeɪbi',pos:'adv.',d:'perhaps',z:'l'},
{t:'core',w:'about',s:['approximately','around','roughly'],c:'大约',e:'The journey takes approximately two hours by train.',k:'approximately',p:'əˈbaʊt',pos:'adv.',d:'approximately',z:'l'},
{t:'core',w:'very',s:['extremely','particularly','remarkably'],c:'非常',e:'The building is particularly impressive at night.',k:'particularly',p:'ˈveri',pos:'adv.',d:'to a high degree',z:'l'},
{t:'core',w:'often',s:['frequently','regularly','commonly'],c:'经常',e:'The buses run frequently during the rush hour.',k:'frequently',p:'ˈɒfn',pos:'adv.',d:'frequently',z:'l'},
{t:'core',w:'rarely',s:['seldom','hardly ever'],c:'很少',e:'Such opportunities seldom come along.',k:'seldom',p:'ˈreəli',pos:'adv.',d:'not often',z:'l'},
{t:'edu',w:'course',s:['programme','module','class'],c:'课程',e:'The programme covers both theory and practical work.',k:'programme',p:'kɔːs',pos:'n.',d:'a series of lessons',z:'l'},
{t:'edu',w:'subject',s:['topic','discipline','field'],c:'学科，主题',e:'Her main field of research is marine biology.',k:'field',p:'ˈsʌbdʒɪkt',pos:'n.',d:'an area of study',z:'l'},
{t:'edu',w:'teacher',s:['instructor','tutor','lecturer'],c:'老师',e:'Each student is assigned a personal tutor.',k:'tutor',p:'ˈtiːtʃə',pos:'n.',d:'a person who teaches',z:'l'},
{t:'edu',w:'student',s:['learner','pupil','trainee'],c:'学生',e:'The centre welcomes learners of all levels.',k:'learner',p:'ˈstjuːdnt',pos:'n.',d:'a person who studies',z:'l'},
{t:'edu',w:'homework',s:['assignment','coursework'],c:'作业',e:'The assignment must be submitted online by Friday.',k:'assignment',p:'ˈhəʊmwɜːk',pos:'n.',d:'school work done at home',z:'l'},
{t:'edu',w:'exam',s:['test','assessment','evaluation'],c:'考试',e:'The final assessment counts for fifty percent of the grade.',k:'assessment',p:'ɪɡˈzæm',pos:'n.',d:'a formal test',z:'l'},
{t:'edu',w:'score',s:['mark','grade','result'],c:'分数',e:'She received a high mark in the writing test.',k:'mark',p:'skɔː',pos:'n.',d:'the number of points in a test',z:'l'},
{t:'edu',w:'degree',s:['qualification','diploma','certificate'],c:'学位，证书',e:'A recognised qualification is essential for the post.',k:'qualification',p:'dɪˈɡriː',pos:'n.',d:'a qualification from a university',z:'l'},
{t:'edu',w:'university',s:['college','institution','campus'],c:'大学',e:'The campus offers excellent sports facilities.',k:'campus',p:'ˌjuːnɪˈvɜːsəti',pos:'n.',d:'a place of higher education',z:'l'},
{t:'edu',w:'lesson',s:['class','session','tutorial'],c:'课',e:'The first session is a general introduction to the course.',k:'session',p:'ˈlesn',pos:'n.',d:'a period of teaching',z:'l'},
{t:'edu',w:'learn',s:['study','pick up','master'],c:'学习',e:'You will pick up useful skills during the work placement.',k:'pick up',p:'lɜːn',pos:'v.',d:'to gain knowledge or skill',z:'l'},
{t:'edu',w:'revise',s:['review','go over','refresh'],c:'复习',e:'Use the weekend to go over your lecture notes.',k:'go over',p:'rɪˈvaɪz',pos:'v.',d:'to review work for an exam',z:'l'},
{t:'edu',w:'difficult',s:['hard','challenging','tough'],c:'困难的',e:'The second part of the test is quite challenging.',k:'challenging',p:'ˈdɪfɪkəlt',pos:'adj.',d:'hard to do',z:'l'},
{t:'edu',w:'easy',s:['simple','straightforward'],c:'容易的',e:'The application form is straightforward to complete.',k:'straightforward',p:'ˈiːzi',pos:'adj.',d:'not difficult',z:'l'},
{t:'edu',w:'compulsory',s:['mandatory','required','obligatory'],c:'必修的，强制的',e:'Attendance at the laboratory sessions is mandatory.',k:'mandatory',p:'kəmˈpʌlsəri',pos:'adj.',d:'required by rule',z:'l'},
{t:'edu',w:'knowledge',s:['understanding','awareness','familiarity'],c:'知识',e:'The course builds a solid understanding of the subject.',k:'understanding',p:'ˈnɒlɪdʒ',pos:'n.',d:'information and understanding',z:'l'},
{t:'work',w:'job',s:['work','employment','occupation','position'],c:'工作',e:'He found full-time employment in a local law firm.',k:'employment',p:'dʒɒb',pos:'n.',d:'paid work',z:'l'},
{t:'work',w:'salary',s:['wage','income','pay','earnings'],c:'薪水',e:'The starting pay is above the national average.',k:'pay',p:'ˈsæləri',pos:'n.',d:'regular pay for work',z:'l'},
{t:'work',w:'company',s:['firm','business','enterprise','corporation'],c:'公司',e:'She runs her own small business from home.',k:'business',p:'ˈkʌmpəni',pos:'n.',d:'a business organization',z:'l'},
{t:'work',w:'employee',s:['staff','worker','workforce'],c:'员工',e:'All staff must attend the safety briefing.',k:'staff',p:'ɪmˈplɔɪiː',pos:'n.',d:'a person who works for a company',z:'l'},
{t:'work',w:'manager',s:['supervisor','director','head'],c:'经理',e:'Please report to your supervisor before noon.',k:'supervisor',p:'ˈmænɪdʒə',pos:'n.',d:'a person in charge of a team',z:'l'},
{t:'work',w:'meeting',s:['conference','session','appointment'],c:'会议',e:'The conference will be held in the main hall.',k:'conference',p:'ˈmiːtɪŋ',pos:'n.',d:'a planned discussion',z:'l'},
{t:'work',w:'retire',s:['leave work','give up work','stop working'],c:'退休',e:'He plans to give up work when he turns sixty.',k:'give up work',p:'rɪˈtaɪə',pos:'v.',d:'to stop working, usually at an older age',z:'l'},
{t:'work',w:'hire',s:['recruit','employ','take on'],c:'雇用',e:'The firm hopes to recruit new graduates this summer.',k:'recruit',p:'haɪə',pos:'v.',d:'to give someone a job',z:'l'},
{t:'work',w:'fire',s:['dismiss','sack','lay off'],c:'解雇',e:'The company may have to lay off some workers.',k:'lay off',p:'faɪə',pos:'v.',d:'to dismiss someone from a job',z:'l'},
{t:'work',w:'promotion',s:['advancement','career progression','rise'],c:'晋升',e:'The scheme supports career progression within the company.',k:'career progression',p:'prəˈməʊʃn',pos:'n.',d:'movement to a higher position',z:'l'},
{t:'work',w:'experience',s:['background','track record','expertise'],c:'经验',e:'Applicants need a strong track record in sales.',k:'track record',p:'ɪkˈspɪəriəns',pos:'n.',d:'knowledge gained from doing something',z:'l'},
{t:'work',w:'skill',s:['ability','expertise','competence'],c:'技能',e:'She has the right expertise for the job.',k:'expertise',p:'skɪl',pos:'n.',d:'an ability to do something well',z:'l'},
{t:'work',w:'colleague',s:['co-worker','workmate','teammate'],c:'同事',e:'Her co-workers are very supportive.',k:'co-worker',p:'ˈkɒliːɡ',pos:'n.',d:'a person you work with',z:'l'},
{t:'work',w:'office',s:['workplace','premises','site'],c:'办公室',e:'The new premises are close to the railway station.',k:'premises',p:'ˈɒfɪs',pos:'n.',d:'a place where people work',z:'l'},
{t:'travel',w:'travel',s:['journey','trip','commute'],c:'旅行',e:'The journey took much longer than we expected.',k:'journey',p:'ˈtrævl',pos:'v.',d:'to go from one place to another',z:'l'},
{t:'travel',w:'arrive',s:['reach','get to','turn up'],c:'到达',e:'We expect to reach the hotel before midnight.',k:'reach',p:'əˈraɪv',pos:'v.',d:'to reach a place',z:'l'},
{t:'travel',w:'leave',s:['depart','set off','go away'],c:'离开',e:'The coach will depart at six in the morning.',k:'depart',p:'liːv',pos:'v.',d:'to go away from a place',z:'l'},
{t:'travel',w:'return',s:['come back','go back'],c:'返回',e:'We plan to come back from the trip on Sunday.',k:'come back',p:'rɪˈtɜːn',pos:'v.',d:'to come or go back',z:'l'},
{t:'travel',w:'book',s:['reserve','make a reservation'],c:'预订',e:'You can reserve a seat on the train online.',k:'reserve',p:'bʊk',pos:'v.',d:'to reserve in advance',z:'l'},
{t:'travel',w:'ticket',s:['fare','pass','admission'],c:'票',e:'The train fare includes a reserved seat.',k:'fare',p:'ˈtɪkɪt',pos:'n.',d:'a document that allows travel or entry',z:'l'},
{t:'travel',w:'near',s:['close to','nearby','adjacent'],c:'附近',e:'The hostel is close to the city centre.',k:'close to',p:'nɪə',pos:'adj.',d:'close in distance',z:'l'},
{t:'travel',w:'far',s:['distant','remote','out of the way'],c:'远的',e:'The farm is quite remote from the nearest village.',k:'remote',p:'fɑː',pos:'adj.',d:'a long distance away',z:'l'},
{t:'travel',w:'fast',s:['rapid','quick','speedy'],c:'快的',e:'The rapid growth of the city has caused traffic problems.',k:'rapid',p:'fɑːst',pos:'adj.',d:'quick',z:'l'},
{t:'travel',w:'slow',s:['gradual','unhurried','leisurely'],c:'慢的',e:'There has been a gradual improvement in the service.',k:'gradual',p:'sləʊ',pos:'adj.',d:'not quick',z:'l'},
{t:'travel',w:'busy',s:['crowded','congested','packed'],c:'繁忙的',e:'The roads are congested during the rush hour.',k:'congested',p:'ˈbɪzi',pos:'adj.',d:'full of people or activity',z:'l'},
{t:'travel',w:'free',s:['available','vacant','spare'],c:'空闲的，免费的',e:'Is the doctor available this afternoon?',k:'available',p:'friː',pos:'adj.',d:'available or costing nothing',z:'l'},
{t:'travel',w:'luggage',s:['baggage','bags','belongings'],c:'行李',e:'Passengers must collect their baggage downstairs.',k:'baggage',p:'ˈlʌɡɪdʒ',pos:'n.',d:'bags carried when travelling',z:'l'},
{t:'travel',w:'vehicle',s:['car','transport','means of transport'],c:'交通工具',e:'Cycling is a popular means of transport in the city.',k:'transport',p:'ˈviːəkl',pos:'n.',d:'a machine used for transport',z:'l'},
{t:'travel',w:'route',s:['way','path','itinerary'],c:'路线',e:'The tour itinerary includes three famous museums.',k:'itinerary',p:'ruːt',pos:'n.',d:'the way from one place to another',z:'l'},
{t:'travel',w:'postpone',s:['put off','delay','defer'],c:'推迟',e:'The flight was put off until the next morning.',k:'put off',p:'pəˈspəʊn',pos:'v.',d:'to delay to a later time',z:'l'},
{t:'health',w:'ill',s:['sick','unwell','poorly'],c:'生病的',e:'Several children were off school because they felt unwell.',k:'unwell',p:'ɪl',pos:'adj.',d:'not well',z:'l'},
{t:'health',w:'tired',s:['exhausted','worn out','fatigued'],c:'疲惫的',e:'She felt exhausted after the long flight.',k:'exhausted',p:'ˈtaɪəd',pos:'adj.',d:'needing rest',z:'l'},
{t:'health',w:'healthy',s:['fit','in good shape'],c:'健康的',e:'Swimming keeps him fit all year round.',k:'fit',p:'ˈhelθi',pos:'adj.',d:'in good condition of body and mind',z:'l'},
{t:'health',w:'exercise',s:['physical activity','workout','training'],c:'锻炼',e:'Regular physical activity can reduce stress.',k:'physical activity',p:'ˈeksəsaɪz',pos:'n.',d:'physical activity for fitness',z:'l'},
{t:'health',w:'diet',s:['eating habits','nutrition'],c:'饮食',e:'Good nutrition is important for young children.',k:'nutrition',p:'ˈdaɪət',pos:'n.',d:'the food a person eats',z:'l'},
{t:'health',w:'medicine',s:['medication','drug','treatment'],c:'药物',e:'The doctor prescribed some medication for the cough.',k:'medication',p:'ˈmedsn',pos:'n.',d:'a substance used to treat illness',z:'l'},
{t:'health',w:'injury',s:['wound','damage','harm'],c:'受伤',e:'The fall caused serious damage to his knee.',k:'damage',p:'ˈɪndʒəri',pos:'n.',d:'physical damage to the body',z:'l'},
{t:'health',w:'recover',s:['get better','heal','pull through'],c:'康复',e:'It took her several weeks to get better.',k:'get better',p:'rɪˈkʌvə',pos:'v.',d:'to get better after illness',z:'l'},
{t:'health',w:'pain',s:['ache','discomfort','soreness'],c:'疼痛',e:'She complained of a sharp ache in her back.',k:'ache',p:'peɪn',pos:'n.',d:'a feeling of hurt',z:'l'},
{t:'health',w:'stress',s:['pressure','strain','tension'],c:'压力',e:'Students often feel under pressure during exams.',k:'pressure',p:'stres',pos:'n.',d:'pressure that causes worry',z:'l'},
{t:'health',w:'relax',s:['unwind','take it easy','de-stress'],c:'放松',e:'A hot bath helps me unwind after work.',k:'unwind',p:'rɪˈlæks',pos:'v.',d:'to rest and become calm',z:'l'},
{t:'health',w:'sleep',s:['rest','doze','nap'],c:'睡觉',e:'Take a short nap during the break.',k:'nap',p:'sliːp',pos:'n.',d:'rest with eyes closed',z:'l'},
{t:'health',w:'strong',s:['powerful','robust','sturdy'],c:'强壮的',e:'A robust immune system can fight off infections.',k:'robust',p:'strɒŋ',pos:'adj.',d:'having great physical power',z:'l'},
{t:'health',w:'weak',s:['fragile','feeble','vulnerable'],c:'虚弱的',e:'The patient is still quite fragile after the operation.',k:'fragile',p:'wiːk',pos:'adj.',d:'lacking strength',z:'l'},
{t:'health',w:'cure',s:['treat','heal','remedy'],c:'治疗',e:'Doctors are working to treat the disease.',k:'treat',p:'kjʊə',pos:'v.',d:'to make an illness go away',z:'l'},
{t:'health',w:'prevent',s:['stop','avoid','guard against'],c:'预防',e:'Regular checks can help stop the disease spreading.',k:'stop',p:'prɪˈvent',pos:'v.',d:'to stop something from happening',z:'l'},
{t:'env',w:'environment',s:['surroundings','nature'],c:'环境',e:'We should protect the natural surroundings of the area.',k:'surroundings',p:'ɪnˈvaɪrənmənt',pos:'n.',d:'the natural world around us',z:'l'},
{t:'env',w:'pollution',s:['contamination'],c:'污染',e:'Air contamination is a major concern for residents.',k:'contamination',p:'pəˈluːʃn',pos:'n.',d:'dirt or waste that harms the environment',z:'l'},
{t:'env',w:'waste',s:['rubbish','garbage','litter'],c:'垃圾',e:'Visitors are asked not to leave litter on the beach.',k:'litter',p:'weɪst',pos:'n.',d:'unwanted materials or rubbish',z:'l'},
{t:'env',w:'recycle',s:['reuse','reprocess'],c:'回收利用',e:'The bottles can be reused many times.',k:'reuse',p:'ˌriːˈsaɪkl',pos:'v.',d:'to treat used materials so they can be used again',z:'l'},
{t:'env',w:'energy',s:['power','fuel'],c:'能源',e:'The building runs entirely on solar power.',k:'power',p:'ˈenədʒi',pos:'n.',d:'power from sources such as electricity or fuel',z:'l'},
{t:'env',w:'climate',s:['weather patterns','weather conditions'],c:'气候',e:'The weather patterns have become less predictable.',k:'weather patterns',p:'ˈklaɪmət',pos:'n.',d:'the usual weather of a place',z:'l'},
{t:'env',w:'damage',s:['harm','destroy','ruin'],c:'破坏',e:'The flood may destroy several bridges in the region.',k:'destroy',p:'ˈdæmɪdʒ',pos:'n.',d:'harm caused to something',z:'l'},
{t:'env',w:'protect',s:['preserve','conserve','safeguard'],c:'保护',e:'We must preserve the wetlands for future generations.',k:'preserve',p:'prəˈtekt',pos:'v.',d:'to keep something safe',z:'l'},
{t:'env',w:'reduce',s:['cut down on','lower','decrease'],c:'减少',e:'The scheme aims to cut down on plastic waste.',k:'cut down on',p:'rɪˈdjuːs',pos:'v.',d:'to make smaller or less',z:'l'},
{t:'env',w:'plant',s:['vegetation','flora'],c:'植物',e:'The region is rich in native vegetation.',k:'vegetation',p:'plɑːnt',pos:'n.',d:'a living thing that grows in the ground',z:'l'},
{t:'env',w:'animal',s:['creature','wildlife','species'],c:'动物',e:'The island is home to many rare species.',k:'species',p:'ˈænɪml',pos:'n.',d:'a living creature that is not a plant',z:'l'},
{t:'env',w:'resource',s:['supply','material','reserve'],c:'资源',e:'The country has large coal reserves.',k:'reserve',p:'rɪˈsɔːs',pos:'n.',d:'a supply of something useful',z:'l'},
{t:'env',w:'growth',s:['expansion','development'],c:'增长',e:'Rapid urban expansion has affected local wildlife.',k:'expansion',p:'ɡrəʊθ',pos:'n.',d:'an increase in size or amount',z:'l'},
{t:'env',w:'shortage',s:['lack','scarcity','deficit'],c:'短缺',e:'The region suffers from a lack of clean water.',k:'lack',p:'ˈʃɔːtɪdʒ',pos:'n.',d:'a lack of something needed',z:'l'},
{t:'env',w:'solve',s:['resolve','tackle','deal with'],c:'解决',e:'New technology may help tackle the problem.',k:'tackle',p:'sɒlv',pos:'v.',d:'to find an answer to a problem',z:'l'},
{t:'env',w:'eco-friendly',s:['environmentally friendly','sustainable','green'],c:'环保的',e:'The hotel uses sustainable materials.',k:'sustainable',p:'ˈiːkəʊ ˌfrendli',pos:'adj.',d:'not harmful to the environment',z:'l'},
{t:'living',w:'house',s:['home','accommodation','property'],c:'房子',e:'The accommodation includes heating and water bills.',k:'accommodation',p:'haʊs',pos:'n.',d:'a building for people to live in',z:'l'},
{t:'living',w:'room',s:['space','studio','chamber'],c:'房间',e:'The studio is furnished and ready to move in.',k:'studio',p:'ruːm',pos:'n.',d:'a space inside a building',z:'l'},
{t:'living',w:'rent',s:['lease','hire','let'],c:'租',e:'The flat is available to lease from September.',k:'lease',p:'rent',pos:'v.',d:'to pay to use a property',z:'l'},
{t:'living',w:'landlord',s:['owner','property owner'],c:'房东',e:'Contact the owner if the heater breaks down.',k:'owner',p:'ˈlændlɔːd',pos:'n.',d:'a person who rents out property',z:'l'},
{t:'living',w:'bill',s:['charge','fee','payment'],c:'账单',e:'The charge covers electricity and water.',k:'charge',p:'bɪl',pos:'n.',d:'an amount of money owed',z:'l'},
{t:'living',w:'pay',s:['cover','fund','meet the cost'],c:'支付',e:'The grant will cover your tuition fees.',k:'cover',p:'peɪ',pos:'v.',d:'to give money for something',z:'l'},
{t:'living',w:'save',s:['economize','cut back'],c:'节省',e:'We need to cut back on heating costs.',k:'cut back',p:'seɪv',pos:'v.',d:'to keep money or use less',z:'l'},
{t:'living',w:'quiet',s:['peaceful','calm','tranquil'],c:'安静的',e:'The village is peaceful and safe at night.',k:'peaceful',p:'ˈkwaɪət',pos:'adj.',d:'making little noise',z:'l'},
{t:'living',w:'noisy',s:['loud','deafening'],c:'吵闹的',e:'The room faces a loud main road.',k:'loud',p:'ˈnɔɪzi',pos:'adj.',d:'making a lot of noise',z:'l'},
{t:'living',w:'spacious',s:['roomy','generous','large'],c:'宽敞的',e:'The apartment has generous storage space.',k:'generous',p:'ˈspeɪʃəs',pos:'adj.',d:'large with plenty of space',z:'l'},
{t:'living',w:'cramped',s:['tiny','poky','small'],c:'狭小的',e:'The kitchen is quite poky.',k:'poky',p:'kræmpt',pos:'adj.',d:'too small and crowded',z:'l'},
{t:'living',w:'comfortable',s:['cosy','snug','pleasant'],c:'舒适的',e:'The beds are cosy and the rooms are warm.',k:'cosy',p:'ˈkʌmftəbl',pos:'adj.',d:'pleasant and relaxing',z:'l'},
{t:'living',w:'convenient',s:['handy','accessible','practical'],c:'方便的',e:'The shop is handy for daily essentials.',k:'handy',p:'kənˈviːniənt',pos:'adj.',d:'easy and suitable',z:'l'},
{t:'living',w:'remote',s:['isolated','out of the way','secluded'],c:'偏远的',e:'The cottage is isolated but very beautiful.',k:'isolated',p:'rɪˈməʊt',pos:'adj.',d:'far away from towns',z:'l'},
{t:'living',w:'facilities',s:['amenities','services','equipment'],c:'设施',e:'The gym offers excellent amenities.',k:'amenities',p:'fəˈsɪlətiz',pos:'n.',d:'buildings and equipment for a purpose',z:'l'},
{t:'living',w:'repair',s:['fix','mend','restore'],c:'修理',e:'The technician will fix the boiler tomorrow.',k:'fix',p:'rɪˈpeə',pos:'v.',d:'to fix something broken',z:'l'},
{t:'academic',w:'research',s:['investigation','study','survey'],c:'研究',e:'The investigation focused on local history.',k:'investigation',p:'rɪˈsɜːtʃ',pos:'n.',d:'careful study to find new information',z:'l'},
{t:'academic',w:'data',s:['information','figures','statistics'],c:'数据',e:'The figures suggest a steady rise in demand.',k:'figures',p:'ˈdeɪtə',pos:'n.',d:'facts and figures',z:'l'},
{t:'academic',w:'method',s:['approach','technique','way'],c:'方法',e:'The approach proved highly effective.',k:'approach',p:'ˈmeθəd',pos:'n.',d:'a way of doing something',z:'l'},
{t:'academic',w:'experiment',s:['test','trial','pilot'],c:'实验',e:'The trial ran for six months.',k:'trial',p:'ɪkˈsperɪmənt',pos:'n.',d:'a scientific test',z:'l'},
{t:'academic',w:'result',s:['outcome','finding','conclusion'],c:'结果',e:'The findings will be published next month.',k:'finding',p:'rɪˈzʌlt',pos:'n.',d:'what happens at the end',z:'l'},
{t:'academic',w:'cause',s:['lead to','result in','give rise to'],c:'导致',e:'Lack of sleep can lead to poor concentration.',k:'lead to',p:'kɔːz',pos:'v.',d:'to make something happen',z:'l'},
{t:'academic',w:'effect',s:['impact','influence','consequence'],c:'影响',e:'The policy had a significant impact on prices.',k:'impact',p:'ɪˈfekt',pos:'n.',d:'a change caused by something',z:'l'},
{t:'academic',w:'example',s:['instance','case','illustration'],c:'例子',e:'For instance, the course includes fieldwork.',k:'instance',p:'ɪɡˈzɑːmpl',pos:'n.',d:'one item that shows a type',z:'l'},
{t:'academic',w:'reason',s:['factor','explanation','motive'],c:'原因',e:'The main factor was the cost of travel.',k:'factor',p:'ˈriːzn',pos:'n.',d:'why something happens',z:'l'},
{t:'academic',w:'suggest',s:['indicate','imply','point to'],c:'表明',e:'The evidence points to a link between diet and health.',k:'points to',p:'səˈdʒest',pos:'v.',d:'to show or imply',z:'l'},
{t:'academic',w:'prove',s:['demonstrate','confirm','verify'],c:'证明',e:'The results confirm the original hypothesis.',k:'confirm',p:'pruːv',pos:'v.',d:'to show that something is true',z:'l'},
{t:'academic',w:'examine',s:['investigate','analyse','look into'],c:'检查，研究',e:'The team will analyse samples from the river.',k:'analyse',p:'ɪɡˈzæmɪn',pos:'v.',d:'to look at something carefully',z:'l'},
{t:'academic',w:'measure',s:['assess','gauge','evaluate'],c:'测量，评估',e:'Researchers will assess the impact on local wildlife.',k:'assess',p:'ˈmeʒə',pos:'v.',d:'to find the size or amount',z:'l'},
{t:'academic',w:'compare',s:['contrast','weigh up'],c:'比较',e:'The study will contrast urban and rural schools.',k:'contrast',p:'kəmˈpeə',pos:'v.',d:'to look at how things are alike or different',z:'l'},
{t:'academic',w:'similar',s:['alike','comparable','analogous'],c:'相似的',e:'The two reports are broadly comparable.',k:'comparable',p:'ˈsɪmələ',pos:'adj.',d:'alike in some way',z:'l'},
{t:'academic',w:'conclusion',s:['summary','outcome','verdict'],c:'结论',e:'In summary, the project was a success.',k:'summary',p:'kənˈkluːʒn',pos:'n.',d:'a final decision or opinion',z:'l'},
{t:'shopping',w:'price',s:['cost','charge','fee'],c:'价格',e:'The cost includes a three-year warranty.',k:'cost',p:'praɪs',pos:'n.',d:'the amount of money needed to buy something',z:'l'},
{t:'shopping',w:'discount',s:['reduction','concession','deal'],c:'折扣',e:'Students get a ten percent reduction.',k:'reduction',p:'ˈdɪskaʊnt',pos:'n.',d:'a reduction in price',z:'l'},
{t:'shopping',w:'refund',s:['reimbursement','money back'],c:'退款',e:'You can get your money back within thirty days.',k:'money back',p:'ˈriːfʌnd',pos:'n.',d:'money given back',z:'l'},
{t:'shopping',w:'receipt',s:['invoice','proof of purchase'],c:'收据',e:'Keep the invoice in case you need to return the item.',k:'invoice',p:'rɪˈsiːt',pos:'n.',d:'a document showing payment',z:'l'},
{t:'shopping',w:'available',s:['in stock','on sale','obtainable'],c:'有货的',e:'The item is in stock at the main store.',k:'in stock',p:'əˈveɪləbl',pos:'adj.',d:'able to be obtained',z:'l'},
{t:'shopping',w:'unavailable',s:['out of stock','sold out'],c:'缺货的',e:'The larger size is currently sold out.',k:'sold out',p:'ˌʌnəˈveɪləbl',pos:'adj.',d:'not able to be obtained',z:'l'},
{t:'shopping',w:'offer',s:['provide','supply','give'],c:'提供',e:'The store will provide free delivery on large orders.',k:'provide',p:'ˈɒfə',pos:'v.',d:'to provide something',z:'l'},
{t:'shopping',w:'customer',s:['client','buyer','consumer'],c:'顾客',e:'Regular clients receive a loyalty card.',k:'client',p:'ˈkʌstəmə',pos:'n.',d:'a person who buys something',z:'l'},
{t:'shopping',w:'queue',s:['line','wait','stand in line'],c:'排队',e:'Visitors had to stand in line for tickets.',k:'stand in line',p:'kjuː',pos:'n.',d:'a line of people waiting',z:'l'},
{t:'shopping',w:'popular',s:['well-liked','in demand','sought-after'],c:'受欢迎的',e:'The course is highly sought-after.',k:'sought-after',p:'ˈpɒpjələ',pos:'adj.',d:'liked by many people',z:'l'},
{t:'shopping',w:'trendy',s:['fashionable','stylish','modern'],c:'时尚的',e:'The café has a stylish interior.',k:'stylish',p:'ˈtrendi',pos:'adj.',d:'fashionable and modern',z:'l'},
{t:'shopping',w:'bargain',s:['good value','deal','steal'],c:'便宜货，划算',e:'This jacket was really good value for money.',k:'good value',p:'ˈbɑːɡɪn',pos:'n.',d:'something bought at a good price',z:'l'},
{t:'shopping',w:'delivery',s:['shipping','postage','dispatch'],c:'配送',e:'Shipping is free for orders over thirty pounds.',k:'shipping',p:'dɪˈlɪvəri',pos:'n.',d:'the bringing of goods',z:'l'},
{t:'shopping',w:'quality',s:['standard','grade','calibre'],c:'质量',e:'The products are of a high standard.',k:'standard',p:'ˈkwɒləti',pos:'n.',d:'how good something is',z:'l'},
{t:'shopping',w:'guarantee',s:['warranty','assurance'],c:'保修',e:'The camera comes with a two-year warranty.',k:'warranty',p:'ˌɡærənˈtiː',pos:'n.',d:'a promise to repair or replace',z:'l'},
{t:'shopping',w:'afford',s:['pay for','manage','cover the cost'],c:'负担得起',e:'Not all families can pay for private lessons.',k:'pay for',p:'əˈfɔːd',pos:'v.',d:'to have enough money for',z:'l'},
{t:'feelings',w:'happy',s:['delighted','pleased','content'],c:'高兴的',e:'She was delighted with the final results.',k:'delighted',p:'ˈhæpi',pos:'adj.',d:'feeling pleasure',z:'l'},
{t:'feelings',w:'sad',s:['upset','miserable','down'],c:'难过的',e:'He felt miserable about missing the deadline.',k:'miserable',p:'sæd',pos:'adj.',d:'feeling unhappiness',z:'l'},
{t:'feelings',w:'angry',s:['annoyed','furious','irritated'],c:'生气的',e:'Residents were furious about the noise.',k:'furious',p:'ˈæŋɡri',pos:'adj.',d:'feeling strong displeasure',z:'l'},
{t:'feelings',w:'worried',s:['anxious','concerned','nervous'],c:'担心的',e:'Parents are concerned about the changes.',k:'concerned',p:'ˈwʌrid',pos:'adj.',d:'feeling anxious',z:'l'},
{t:'feelings',w:'surprised',s:['astonished','amazed','stunned'],c:'惊讶的',e:'I was amazed by the size of the library.',k:'amazed',p:'səˈpraɪzd',pos:'adj.',d:'feeling sudden wonder',z:'l'},
{t:'feelings',w:'confused',s:['puzzled','bewildered','unsure'],c:'困惑的',e:'Tourists were puzzled by the signs.',k:'puzzled',p:'kənˈfjuːzd',pos:'adj.',d:'unable to understand clearly',z:'l'},
{t:'feelings',w:'interested',s:['keen','enthusiastic','fascinated'],c:'感兴趣的',e:'She is keen to learn more about local history.',k:'keen',p:'ˈɪntrəstɪd',pos:'adj.',d:'wanting to know or learn',z:'l'},
{t:'feelings',w:'bored',s:['uninterested','fed up','tired of'],c:'无聊的',e:'He is fed up with the same routine.',k:'fed up',p:'bɔːd',pos:'adj.',d:'feeling uninterested',z:'l'},
{t:'feelings',w:'excited',s:['thrilled','eager','exhilarated'],c:'兴奋的',e:'The children were thrilled about the trip.',k:'thrilled',p:'ɪkˈsaɪtɪd',pos:'adj.',d:'feeling very keen and happy',z:'l'},
{t:'feelings',w:'afraid',s:['scared','frightened','terrified'],c:'害怕的',e:'She is frightened of flying.',k:'frightened',p:'əˈfreɪd',pos:'adj.',d:'feeling fear',z:'l'},
{t:'feelings',w:'grateful',s:['thankful','appreciative'],c:'感激的',e:'We are thankful for your generous support.',k:'thankful',p:'ˈɡreɪtfl',pos:'adj.',d:'feeling thanks',z:'l'},
{t:'feelings',w:'confident',s:['sure','certain','self-assured'],c:'自信的',e:'She felt certain about her answer.',k:'certain',p:'ˈkɒnfɪdənt',pos:'adj.',d:'feeling sure of oneself',z:'l'},
{t:'feelings',w:'doubtful',s:['uncertain','unsure','sceptical'],c:'怀疑的',e:'Experts are sceptical about the claims.',k:'sceptical',p:'ˈdaʊtfl',pos:'adj.',d:'not sure',z:'l'},
{t:'feelings',w:'prefer',s:['favour','would rather','like better'],c:'更喜欢',e:'Most students favour online lectures.',k:'favour',p:'prɪˈfɜː',pos:'v.',d:'to like one thing more than another',z:'l'},
{t:'feelings',w:'agree',s:['consent','concur','be in favour of'],c:'同意',e:'The committee is in favour of the proposal.',k:'in favour of',p:'əˈɡriː',pos:'v.',d:'to have the same opinion',z:'l'},
{t:'feelings',w:'disagree',s:['oppose','object to','be against'],c:'反对',e:'Some residents object to the new plan.',k:'object to',p:'ˌdɪsəˈɡriː',pos:'v.',d:'to have a different opinion',z:'l'},
{t:'feelings',w:'refuse',s:['decline','reject','turn down'],c:'拒绝',e:'She may turn down the offer of a job.',k:'turn down',p:'rɪˈfjuːz',pos:'v.',d:'to say no to something',z:'l'},
{t:'core',w:'benefit',s:['gain','profit','advantage'],c:'好处，益处',e:'Students gain a real benefit from early revision.',k:'gain',p:'ˈbenɪfɪt',pos:'n.',d:'an advantage or helpful result',z:'l'},
{t:'core',w:'disadvantage',s:['drawback','downside','shortcoming'],c:'缺点，不利之处',e:'One drawback is the lack of parking space.',k:'drawback',p:'ˌdɪsədˈvɑːntɪdʒ',pos:'n.',d:'a bad or unwanted feature',z:'l'},
{t:'core',w:'limit',s:['restrict','cap','control'],c:'限制',e:'The number of tickets is restricted to two per person.',k:'restrict',p:'ˈlɪmɪt',pos:'v.',d:'to stop something from going beyond a certain point',z:'l'},
{t:'core',w:'allow',s:['permit','enable','let'],c:'允许',e:'The library does not permit food inside.',k:'permit',p:'əˈlaʊ',pos:'v.',d:'to give permission for something',z:'l'},
{t:'core',w:'contain',s:['include','comprise','involve'],c:'包含',e:'The fee includes all materials.',k:'include',p:'kənˈteɪn',pos:'v.',d:'to have something inside or as a part',z:'l'},
{t:'core',w:'lack',s:['be short of','be without','miss'],c:'缺乏',e:'The region is short of clean water.',k:'short of',p:'læk',pos:'v.',d:'to not have enough of something',z:'l'},
{t:'core',w:'consider',s:['take into account','think about','weigh up'],c:'考虑',e:'We need to take into account the extra cost.',k:'take into account',p:'kənˈsɪdə',pos:'v.',d:'to think about something carefully',z:'l'},
{t:'core',w:'decide',s:['make up one\'s mind','determine','settle on'],c:'决定',e:'She could not settle on a topic for her essay.',k:'settle on',p:'dɪˈsaɪd',pos:'v.',d:'to make a choice',z:'l'},
{t:'core',w:'explain',s:['clarify','account for','spell out'],c:'解释',e:'The tutor asked him to clarify his point.',k:'clarify',p:'ɪkˈspleɪn',pos:'v.',d:'to make something clear and easy to understand',z:'l'},
{t:'core',w:'mention',s:['refer to','bring up','touch on'],c:'提及',e:'The speaker will refer to the survey results.',k:'refer to',p:'ˈmenʃn',pos:'v.',d:'to speak about something briefly',z:'l'},
{t:'core',w:'main',s:['principal','primary','chief'],c:'主要的',e:'The principal reason for the delay was the weather.',k:'principal',p:'meɪn',pos:'adj.',d:'most important',z:'l'},
{t:'core',w:'possible',s:['feasible','viable','workable'],c:'可能的',e:'The plan is not feasible within the budget.',k:'feasible',p:'ˈpɒsəbl',pos:'adj.',d:'able to happen or be done',z:'l'},
{t:'edu',w:'lecture',s:['talk','presentation','seminar'],c:'讲座',e:'The talk will be held in Lecture Hall B.',k:'talk',p:'ˈlektʃə',pos:'n.',d:'a formal talk given to students',z:'l'},
{t:'edu',w:'deadline',s:['closing date','cut-off date','due date'],c:'截止日期',e:'The closing date for applications is 30 June.',k:'closing date',p:'ˈdedlaɪn',pos:'n.',d:'the latest time by which something must be done',z:'l'},
{t:'edu',w:'syllabus',s:['curriculum','course outline','programme of study'],c:'教学大纲',e:'The curriculum includes two field trips.',k:'curriculum',p:'ˈsɪləbəs',pos:'n.',d:'the list of topics covered in a course',z:'l'},
{t:'edu',w:'library',s:['resource centre','learning centre'],c:'图书馆',e:'The resource centre opens until ten.',k:'resource centre',p:'ˈlaɪbrəri',pos:'n.',d:'a place where books and materials are kept for reading',z:'l'},
{t:'edu',w:'attendance',s:['presence','turnout'],c:'出勤',e:'Regular presence at tutorials is expected.',k:'presence',p:'əˈtendəns',pos:'n.',d:'the act of being present at a class or event',z:'l'},
{t:'edu',w:'fail',s:['not pass','flunk'],c:'不及格',e:'He may not pass the oral test.',k:'not pass',p:'feɪl',pos:'v.',d:'to not succeed in a test or exam',z:'l'},
{t:'edu',w:'pass',s:['get through','succeed in'],c:'通过',e:'She is sure to get through the interview.',k:'get through',p:'pɑːs',pos:'v.',d:'to succeed in a test or exam',z:'l'},
{t:'edu',w:'essay',s:['paper','composition','assignment'],c:'文章，论文',e:'The paper should be about 1,500 words.',k:'paper',p:'ˈeseɪ',pos:'n.',d:'a piece of writing on a particular topic',z:'l'},
{t:'edu',w:'scholarship',s:['grant','bursary','funding'],c:'奖学金',e:'She applied for a grant to cover her fees.',k:'grant',p:'ˈskɒləʃɪp',pos:'n.',d:'money given to help pay for study',z:'l'},
{t:'edu',w:'tutorial',s:['seminar group','small class'],c:'辅导课',e:'The seminar group meets every Friday.',k:'seminar group',p:'tjuːˈtɔːriəl',pos:'n.',d:'a small teaching group with discussion',z:'l'},
{t:'edu',w:'canteen',s:['cafeteria','dining hall','refectory'],c:'食堂',e:'The cafeteria serves hot meals until two.',k:'cafeteria',p:'kænˈtiːn',pos:'n.',d:'a place where food is served at a school or workplace',z:'l'},
{t:'edu',w:'dormitory',s:['hall of residence','student accommodation'],c:'宿舍',e:'First-year students get a place in a hall of residence.',k:'hall of residence',p:'ˈdɔːmətri',pos:'n.',d:'a building where students live',z:'l'},
{t:'work',w:'apply',s:['put in an application','submit an application'],c:'申请',e:'You should submit an application before Friday.',k:'submit an application',p:'əˈplaɪ',pos:'v.',d:'to make a formal request, usually for a job',z:'l'},
{t:'work',w:'interview',s:['selection meeting','job talk'],c:'面试',e:'The selection meeting will take about an hour.',k:'selection meeting',p:'ˈɪntəvjuː',pos:'n.',d:'a formal meeting to assess a candidate',z:'l'},
{t:'work',w:'resume',s:['CV','curriculum vitae'],c:'简历',e:'Please email your CV to the HR department.',k:'CV',p:'ˈrezjumeɪ',pos:'n.',d:'a summary of a person\'s work experience',z:'l'},
{t:'work',w:'part-time',s:['casual','temporary','on a flexible basis'],c:'兼职的',e:'She works on a flexible basis during term time.',k:'flexible basis',p:'ˌpɑːt ˈtaɪm',pos:'adj.',d:'working fewer hours than a full-time job',z:'l'},
{t:'work',w:'full-time',s:['permanent','regular'],c:'全职的',e:'The role is permanent with good benefits.',k:'permanent',p:'ˌfʊl ˈtaɪm',pos:'adj.',d:'working the normal number of hours',z:'l'},
{t:'work',w:'workload',s:['amount of work','tasks','duties'],c:'工作量',e:'The amount of work increases during busy seasons.',k:'amount of work',p:'ˈwɜːkləʊd',pos:'n.',d:'the amount of work a person has to do',z:'l'},
{t:'work',w:'training',s:['development','coaching','induction'],c:'培训',e:'New staff receive a week of induction.',k:'induction',p:'ˈtreɪnɪŋ',pos:'n.',d:'teaching that develops job skills',z:'l'},
{t:'work',w:'qualification',s:['credential','certificate','licence'],c:'资质，资格证书',e:'The job requires a recognised certificate.',k:'certificate',p:'ˌkwɒlɪfɪˈkeɪʃn',pos:'n.',d:'an official proof of a person\'s skill or education',z:'l'},
{t:'work',w:'shift',s:['period of work','rota'],c:'轮班',e:'She prefers the early period of work.',k:'period of work',p:'ʃɪft',pos:'n.',d:'a fixed period of time working in a day',z:'l'},
{t:'work',w:'vacancy',s:['opening','position','post'],c:'职位空缺',e:'There is an opening in the marketing team.',k:'opening',p:'ˈveɪkənsi',pos:'n.',d:'an available job position',z:'l'},
{t:'work',w:'negotiate',s:['bargain','discuss terms'],c:'协商',e:'Staff can discuss terms for flexible hours.',k:'discuss terms',p:'nɪˈɡəʊʃieɪt',pos:'v.',d:'to discuss with someone to reach an agreement',z:'l'},
{t:'work',w:'overtime',s:['extra hours','additional time'],c:'加班',e:'She often works extra hours before a deadline.',k:'extra hours',p:'ˈəʊvətaɪm',pos:'n.',d:'extra time worked beyond normal hours',z:'l'},
{t:'travel',w:'destination',s:['target','endpoint','place you are going to'],c:'目的地',e:'What is your target on the walking tour?',k:'target',p:'ˌdestɪˈneɪʃn',pos:'n.',d:'the place that someone is going to',z:'l'},
{t:'travel',w:'accommodation',s:['lodging','housing','place to stay'],c:'住宿',e:'Lodging is included in the package price.',k:'lodging',p:'əˌkɒməˈdeɪʃn',pos:'n.',d:'a place where someone can stay',z:'l'},
{t:'travel',w:'flight',s:['journey by air','plane trip'],c:'航班',e:'The journey by air takes two hours.',k:'journey by air',p:'flaɪt',pos:'n.',d:'a journey made by plane',z:'l'},
{t:'travel',w:'station',s:['terminus','stop','depot'],c:'车站',e:'The bus stop is outside the museum.',k:'stop',p:'ˈsteɪʃn',pos:'n.',d:'a place where trains or buses stop',z:'l'},
{t:'travel',w:'departure',s:['leaving','take-off','set-off'],c:'出发',e:'The take-off is delayed by an hour.',k:'take-off',p:'dɪˈpɑːtʃə',pos:'n.',d:'the act of leaving a place',z:'l'},
{t:'travel',w:'delay',s:['hold-up','setback'],c:'延误',e:'There was a hold-up on the motorway.',k:'hold-up',p:'dɪˈleɪ',pos:'n.',d:'a situation in which something happens later than planned',z:'l'},
{t:'travel',w:'sightseeing',s:['touring','visiting sights','exploring'],c:'观光',e:'The afternoon is free for visiting sights.',k:'visiting sights',p:'ˈsaɪtsiːɪŋ',pos:'n.',d:'the activity of visiting interesting places as a tourist',z:'l'},
{t:'travel',w:'guide',s:['tour guide','escort','leader'],c:'导游',e:'The tour guide will meet you at the entrance.',k:'tour guide',p:'ɡaɪd',pos:'n.',d:'a person who shows tourists around a place',z:'l'},
{t:'travel',w:'passport',s:['travel document','ID'],c:'护照',e:'Please carry your travel document at all times.',k:'travel document',p:'ˈpɑːspɔːt',pos:'n.',d:'an official document that allows travel between countries',z:'l'},
{t:'travel',w:'visa',s:['entry permit'],c:'签证',e:'You need an entry permit for the country.',k:'entry permit',p:'ˈviːzə',pos:'n.',d:'an official permission to enter a country',z:'l'},
{t:'travel',w:'journey',s:['trip','commute','excursion'],c:'旅程',e:'The trip to the coast takes an hour.',k:'trip',p:'ˈdʒɜːni',pos:'n.',d:'an act of travelling from one place to another',z:'l'},
{t:'travel',w:'transfer',s:['change','connection'],c:'转乘',e:'You will need a change at the central station.',k:'change',p:'ˈtrænsfɜː',pos:'n.',d:'a change of transport during a journey',z:'l'},
{t:'health',w:'symptom',s:['sign','indication'],c:'症状',e:'A persistent cough is a common sign of the infection.',k:'sign',p:'ˈsɪmptəm',pos:'n.',d:'a sign that shows an illness is present',z:'l'},
{t:'health',w:'treatment',s:['therapy','care','remedy'],c:'治疗',e:'She is receiving therapy for her knee.',k:'therapy',p:'ˈtriːtmənt',pos:'n.',d:'medical care given to make someone well',z:'l'},
{t:'health',w:'appointment',s:['booking','consultation','session'],c:'预约',e:'Your consultation is at half past three.',k:'consultation',p:'əˈpɔɪntmənt',pos:'n.',d:'a time arranged to see a doctor or specialist',z:'l'},
{t:'health',w:'patient',s:['person being treated','case'],c:'病人',e:'Each case is reviewed by a specialist.',k:'case',p:'ˈpeɪʃnt',pos:'n.',d:'a person receiving medical care',z:'l'},
{t:'health',w:'doctor',s:['GP','physician','practitioner'],c:'医生',e:'Your GP can refer you to a specialist.',k:'GP',p:'ˈdɒktə',pos:'n.',d:'a person trained to treat illness',z:'l'},
{t:'health',w:'hospital',s:['clinic','medical centre','infirmary'],c:'医院',e:'The clinic is open every day.',k:'clinic',p:'ˈhɒspɪtl',pos:'n.',d:'a place where sick or injured people are treated',z:'l'},
{t:'health',w:'pharmacy',s:['chemist','drugstore','dispensary'],c:'药房',e:'The chemist\'s is next to the bank.',k:'chemist',p:'ˈfɑːməsi',pos:'n.',d:'a shop that sells medicines',z:'l'},
{t:'health',w:'vaccine',s:['immunization','injection','jab'],c:'疫苗',e:'The immunization is free for students.',k:'immunization',p:'ˈvæksiːn',pos:'n.',d:'a substance that protects the body against disease',z:'l'},
{t:'health',w:'infection',s:['disease','illness','virus'],c:'感染',e:'The virus spreads quickly in winter.',k:'virus',p:'ɪnˈfekʃn',pos:'n.',d:'an illness caused by germs entering the body',z:'l'},
{t:'health',w:'overweight',s:['obese','too heavy'],c:'超重的',e:'Regular exercise helps people who are too heavy.',k:'too heavy',p:'ˌəʊvəˈweɪt',pos:'adj.',d:'heavier than is healthy',z:'l'},
{t:'health',w:'blood pressure',s:['BP','hypertension'],c:'血压',e:'Your BP reading is normal.',k:'BP',p:'ˈblʌd ˌpreʃə',pos:'n.',d:'the force with which blood pushes against artery walls',z:'l'},
{t:'health',w:'check-up',s:['examination','health screening'],c:'体检',e:'The health screening is recommended yearly.',k:'health screening',p:'ˈtʃek ʌp',pos:'n.',d:'a medical examination to check health',z:'l'},
{t:'env',w:'renewable',s:['sustainable','clean','green'],c:'可再生的',e:'The town runs on sustainable energy sources.',k:'sustainable',p:'rɪˈnjuːəbl',pos:'adj.',d:'able to be replaced by natural processes',z:'l'},
{t:'env',w:'emission',s:['discharge','release','output'],c:'排放',e:'The plant will cut its carbon release by half.',k:'release',p:'ɪˈmɪʃn',pos:'n.',d:'gas or waste sent out into the air',z:'l'},
{t:'env',w:'conservation',s:['preservation','protection','safeguarding'],c:'资源保护',e:'The park focuses on preservation of rare birds.',k:'preservation',p:'ˌkɒnsəˈveɪʃn',pos:'n.',d:'the careful protection of nature and resources',z:'l'},
{t:'env',w:'biodiversity',s:['variety of life','ecosystems'],c:'生物多样性',e:'The region is rich in variety of life.',k:'variety of life',p:'ˌbaɪəʊdaɪˈvɜːsəti',pos:'n.',d:'the variety of living things in an area',z:'l'},
{t:'env',w:'drought',s:['dry spell','water shortage'],c:'干旱',e:'The dry spell lasted three months.',k:'dry spell',p:'draʊt',pos:'n.',d:'a long period without rain',z:'l'},
{t:'env',w:'flood',s:['inundation','deluge'],c:'洪水',e:'The inundation damaged many homes.',k:'inundation',p:'flʌd',pos:'n.',d:'an overflow of water onto dry land',z:'l'},
{t:'env',w:'temperature',s:['heat level','degrees'],c:'温度',e:'The heat level rises during summer.',k:'heat level',p:'ˈtemprətʃə',pos:'n.',d:'how hot or cold something is',z:'l'},
{t:'env',w:'rainfall',s:['precipitation','rain levels'],c:'降雨量',e:'Precipitation is highest in March.',k:'precipitation',p:'ˈreɪnfɔːl',pos:'n.',d:'the amount of rain that falls',z:'l'},
{t:'env',w:'habitat',s:['natural home','environment'],c:'栖息地',e:'Wetlands are the natural home of many birds.',k:'natural home',p:'ˈhæbɪtæt',pos:'n.',d:'the natural home of an animal or plant',z:'l'},
{t:'env',w:'deforestation',s:['clearing forests','tree loss'],c:'森林砍伐',e:'Clearing forests speeds up soil erosion.',k:'clearing forests',p:'ˌdiːfɒrɪˈsteɪʃn',pos:'n.',d:'the cutting down of forests',z:'l'},
{t:'env',w:'landfill',s:['rubbish dump','tip','disposal site'],c:'垃圾填埋场',e:'The rubbish dump will close next year.',k:'rubbish dump',p:'ˈlændfɪl',pos:'n.',d:'a place where rubbish is buried in the ground',z:'l'},
{t:'env',w:'organic',s:['natural','chemical-free'],c:'有机的',e:'The market sells chemical-free vegetables.',k:'chemical-free',p:'ɔːˈɡænɪk',pos:'adj.',d:'grown or produced without artificial chemicals',z:'l'},
{t:'living',w:'suburb',s:['outskirts','residential area','commuter belt'],c:'郊区',e:'She lives in a quiet residential area.',k:'residential area',p:'ˈsʌbɜːb',pos:'n.',d:'an area outside the centre of a city',z:'l'},
{t:'living',w:'neighbourhood',s:['area','district','community'],c:'街区，社区',e:'The district has excellent schools.',k:'district',p:'ˈneɪbəhʊd',pos:'n.',d:'the area around where a person lives',z:'l'},
{t:'living',w:'furniture',s:['furnishings','fittings'],c:'家具',e:'The flat comes with basic furnishings.',k:'furnishings',p:'ˈfɜːnɪtʃə',pos:'n.',d:'items such as tables, chairs and beds',z:'l'},
{t:'living',w:'deposit',s:['down payment','advance payment'],c:'押金',e:'A down payment covers the first month.',k:'down payment',p:'dɪˈpɒzɪt',pos:'n.',d:'money paid in advance as a guarantee',z:'l'},
{t:'living',w:'utilities',s:['services','bills','supplies'],c:'公用事业费',e:'Bills for water and power are separate.',k:'bills',p:'juːˈtɪlətiz',pos:'n.',d:'services such as water, gas and electricity',z:'l'},
{t:'living',w:'laundry',s:['washing','ironing'],c:'洗衣',e:'There is a washing machine in the basement.',k:'washing',p:'ˈlɔːndri',pos:'n.',d:'clothes that need to be washed',z:'l'},
{t:'living',w:'garden',s:['yard','backyard','grounds'],c:'花园',e:'The yard is shared by all residents.',k:'yard',p:'ˈɡɑːdn',pos:'n.',d:'an area of ground with plants next to a house',z:'l'},
{t:'living',w:'neighbour',s:['resident','nearby household'],c:'邻居',e:'A nearby household reported the noise.',k:'nearby household',p:'ˈneɪbə',pos:'n.',d:'a person who lives near you',z:'l'},
{t:'living',w:'move',s:['relocate','transfer','shift'],c:'搬家',e:'The family will relocate to the north.',k:'relocate',p:'muːv',pos:'v.',d:'to change the place where you live',z:'l'},
{t:'living',w:'decorate',s:['redecorate','renovate','spruce up'],c:'装修',e:'They plan to renovate the kitchen.',k:'renovate',p:'ˈdekəreɪt',pos:'v.',d:'to make a room look more attractive',z:'l'},
{t:'living',w:'furnish',s:['equip','fit out'],c:'配备家具',e:'The studio is equipped with a sofa bed.',k:'equip',p:'ˈfɜːnɪʃ',pos:'v.',d:'to put furniture in a room',z:'l'},
{t:'living',w:'air conditioning',s:['cooling system','AC'],c:'空调',e:'The cooling system breaks down in summer.',k:'cooling system',p:'ˈeə kənˌdɪʃənɪŋ',pos:'n.',d:'a system that cools the air in a building',z:'l'},
{t:'academic',w:'hypothesis',s:['theory','assumption','proposition'],c:'假设',e:'The theory was tested in a new study.',k:'theory',p:'haɪˈpɒθəsɪs',pos:'n.',d:'an idea that can be tested by research',z:'l'},
{t:'academic',w:'evidence',s:['proof','grounds','support'],c:'证据',e:'The findings provide clear proof of the link.',k:'proof',p:'ˈevɪdəns',pos:'n.',d:'facts that show something is true',z:'l'},
{t:'academic',w:'analyse',s:['break down','study in detail'],c:'分析',e:'The team will break down the results by age.',k:'break down',p:'ˈænəlaɪz',pos:'v.',d:'to examine something in detail',z:'l'},
{t:'academic',w:'publication',s:['paper','article','journal article'],c:'出版物',e:'Her article appears in a leading journal.',k:'article',p:'ˌpʌblɪˈkeɪʃn',pos:'n.',d:'a published piece of writing',z:'l'},
{t:'academic',w:'citation',s:['reference','quote','source'],c:'引用',e:'Include a full reference for each source.',k:'reference',p:'saɪˈteɪʃn',pos:'n.',d:'a reference to a book or article',z:'l'},
{t:'academic',w:'peer review',s:['refereeing','evaluation by experts'],c:'同行评审',e:'The paper is under evaluation by experts.',k:'evaluation by experts',p:'ˌpɪə rɪˈvjuː',pos:'n.',d:'assessment of research by other experts',z:'l'},
{t:'academic',w:'abstract',s:['summary','overview','synopsis'],c:'摘要',e:'The synopsis should be under 200 words.',k:'synopsis',p:'ˈæbstrækt',pos:'n.',d:'a short summary of a paper or talk',z:'l'},
{t:'academic',w:'bibliography',s:['reference list','sources'],c:'参考书目',e:'The reference list must follow the style guide.',k:'reference list',p:'ˌbɪbliˈɒɡrəfi',pos:'n.',d:'a list of the sources used in a piece of writing',z:'l'},
{t:'academic',w:'thesis',s:['dissertation','research project'],c:'学位论文',e:'Her dissertation examines urban transport.',k:'dissertation',p:'ˈθiːsɪs',pos:'n.',d:'a long piece of research writing for a degree',z:'l'},
{t:'academic',w:'sample',s:['specimen','subset'],c:'样本',e:'The subset includes 200 households.',k:'subset',p:'ˈsɑːmpl',pos:'n.',d:'a small group chosen to represent a larger group',z:'l'},
{t:'academic',w:'survey',s:['questionnaire','poll','study'],c:'调查',e:'The questionnaire was sent to all students.',k:'questionnaire',p:'ˈsɜːveɪ',pos:'n.',d:'a study that collects information from people',z:'l'},
{t:'academic',w:'trend',s:['tendency','pattern','direction'],c:'趋势',e:'The data shows a clear tendency upward.',k:'tendency',p:'trend',pos:'n.',d:'a general direction in which something is changing',z:'l'},
{t:'shopping',w:'purchase',s:['buy','acquire','get'],c:'购买',e:'You may buy tickets at the door.',k:'buy',p:'ˈpɜːtʃəs',pos:'v.',d:'to buy something',z:'l'},
{t:'shopping',w:'checkout',s:['till','register','cash desk'],c:'收银台',e:'Please pay at the cash desk.',k:'cash desk',p:'ˈtʃekaʊt',pos:'n.',d:'the place in a shop where you pay',z:'l'},
{t:'shopping',w:'cashier',s:['checkout operator','till worker'],c:'收银员',e:'The checkout operator scanned my card.',k:'checkout operator',p:'kæˈʃɪə',pos:'n.',d:'a person who takes payment in a shop',z:'l'},
{t:'shopping',w:'aisle',s:['passage','walkway'],c:'过道',e:'The walkway leads to the bakery section.',k:'walkway',p:'aɪl',pos:'n.',d:'a passage between rows of shelves',z:'l'},
{t:'shopping',w:'shelf',s:['shelving','rack'],c:'货架',e:'The item is on the top rack.',k:'rack',p:'ʃelf',pos:'n.',d:'a flat board used for storing goods',z:'l'},
{t:'shopping',w:'trolley',s:['cart','shopping cart'],c:'购物车',e:'Take a cart from the entrance.',k:'cart',p:'ˈtrɒli',pos:'n.',d:'a wheeled container used when shopping',z:'l'},
{t:'shopping',w:'label',s:['tag','sticker','price tag'],c:'标签',e:'The price tag shows the old price.',k:'price tag',p:'ˈleɪbl',pos:'n.',d:'a small piece of paper giving information about a product',z:'l'},
{t:'shopping',w:'exchange',s:['swap','switch','replace'],c:'换货',e:'You can swap it within 30 days.',k:'swap',p:'ɪksˈtʃeɪndʒ',pos:'v.',d:'to give one thing back and receive another',z:'l'},
{t:'shopping',w:'free sample',s:['tester','trial product'],c:'免费试用装',e:'There is a tester of the new perfume.',k:'tester',p:'ˌfriː ˈsɑːmpl',pos:'n.',d:'a small free product given so customers can try it',z:'l'},
{t:'shopping',w:'loyalty card',s:['reward card','membership card','points card'],c:'会员卡',e:'Use your reward card to collect points.',k:'reward card',p:'ˈlɔɪəlti kɑːd',pos:'n.',d:'a card that gives rewards for regular shopping',z:'l'},
{t:'shopping',w:'advertise',s:['promote','market','publicize'],c:'打广告',e:'The store will promote the sale online.',k:'promote',p:'ˈædvətaɪz',pos:'v.',d:'to tell people about a product to encourage buying',z:'l'},
{t:'shopping',w:'fitting room',s:['changing room','dressing room'],c:'试衣间',e:'The changing room is at the back.',k:'changing room',p:'ˈfɪtɪŋ ruːm',pos:'n.',d:'a room where customers try on clothes',z:'l'},
{t:'feelings',w:'disappointed',s:['let down','disheartened','dissatisfied'],c:'失望的',e:'She felt let down by the result.',k:'let down',p:'ˌdɪsəˈpɔɪntɪd',pos:'adj.',d:'unhappy because hopes were not met',z:'l'},
{t:'feelings',w:'relieved',s:['reassured','comforted'],c:'如释重负的',e:'He was reassured by the good news.',k:'reassured',p:'rɪˈliːvd',pos:'adj.',d:'glad that something unpleasant is over',z:'l'},
{t:'feelings',w:'proud',s:['pleased with oneself','honoured'],c:'自豪的',e:'She felt honoured to receive the award.',k:'honoured',p:'praʊd',pos:'adj.',d:'feeling pleased about an achievement',z:'l'},
{t:'feelings',w:'embarrassed',s:['ashamed','self-conscious','awkward'],c:'尴尬的',e:'He felt awkward about the mistake.',k:'awkward',p:'ɪmˈbærəst',pos:'adj.',d:'feeling uncomfortable or ashamed in front of others',z:'l'},
{t:'feelings',w:'lonely',s:['isolated','alone','lonesome'],c:'孤独的',e:'New students can feel isolated at first.',k:'isolated',p:'ˈləʊnli',pos:'adj.',d:'sad because you are alone',z:'l'},
{t:'feelings',w:'jealous',s:['envious','resentful'],c:'嫉妒的',e:'She was envious of his success.',k:'envious',p:'ˈdʒeləs',pos:'adj.',d:'wanting what another person has',z:'l'},
{t:'feelings',w:'optimistic',s:['hopeful','positive','upbeat'],c:'乐观的',e:'The manager is hopeful about sales.',k:'hopeful',p:'ˌɒptɪˈmɪstɪk',pos:'adj.',d:'expecting good things to happen',z:'l'},
{t:'feelings',w:'pessimistic',s:['negative','gloomy','doubtful'],c:'悲观的',e:'He gave a gloomy forecast for the season.',k:'gloomy',p:'ˌpesɪˈmɪstɪk',pos:'adj.',d:'expecting bad things to happen',z:'l'},
{t:'feelings',w:'calm',s:['composed','relaxed','unruffled'],c:'冷静的',e:'She stayed composed during the test.',k:'composed',p:'kɑːm',pos:'adj.',d:'peaceful and not worried',z:'l'},
{t:'feelings',w:'nervous',s:['tense','anxious','on edge'],c:'紧张的',e:'Candidates often feel tense before interviews.',k:'tense',p:'ˈnɜːvəs',pos:'adj.',d:'worried and unable to relax',z:'l'},
{t:'feelings',w:'enthusiastic',s:['keen','passionate','eager'],c:'热情的',e:'The students are eager to join the club.',k:'eager',p:'ɪnˌθjuːziˈæstɪk',pos:'adj.',d:'showing strong interest and excitement',z:'l'},
{t:'feelings',w:'regret',s:['feel sorry about','rue','wish you hadn\'t'],c:'后悔',e:'She felt sorry about missing the lecture.',k:'sorry about',p:'rɪˈɡret',pos:'v.',d:'to feel sorry about something you did or did not do',z:'l'},
{t:'academic',w:'argument',s:['point','case','reasoning'],c:'论点，论据',e:'Her main point is that education should be free.',k:'point',p:'ˈɑːɡjumənt',pos:'n.',d:'a set of reasons supporting an idea',z:'w'},
{t:'academic',w:'claim',s:['assert','maintain','state'],c:'声称，主张',e:'Critics assert that the policy has failed.',k:'assert',p:'kleɪm',pos:'v.',d:'to state that something is true',z:'w'},
{t:'academic',w:'opinion',s:['view','viewpoint','perspective'],c:'观点',e:'From my perspective, the benefits outweigh the costs.',k:'perspective',p:'əˈpɪnjən',pos:'n.',d:'a belief or judgement about something',z:'w'},
{t:'academic',w:'support',s:['back up','endorse','reinforce'],c:'支持',e:'The evidence backs up this claim.',k:'backs up',p:'səˈpɔːt',pos:'v.',d:'to agree with and help something',z:'w'},
{t:'academic',w:'illustrate',s:['demonstrate','exemplify','show'],c:'说明，举例说明',e:'The chart demonstrates the sharp rise in prices.',k:'demonstrates',p:'ˈɪləstreɪt',pos:'v.',d:'to explain something with examples',z:'w'},
{t:'academic',w:'emphasise',s:['stress','highlight','underline'],c:'强调',e:'The report highlights the need for reform.',k:'highlights',p:'ˈemfəsaɪz',pos:'v.',d:'to give special importance to something',z:'w'},
{t:'academic',w:'consequence',s:['outcome','result','ramification'],c:'后果',e:'One outcome of the change is higher costs.',k:'outcome',p:'ˈkɒnsɪkwəns',pos:'n.',d:'a result of an action',z:'w'},
{t:'academic',w:'contribute',s:['play a part','lead to','add to'],c:'促成，贡献',e:'Several factors play a part in obesity.',k:'play a part',p:'kənˈtrɪbjuːt',pos:'v.',d:'to help cause something',z:'w'},
{t:'academic',w:'factor',s:['element','variable','aspect'],c:'因素',e:'Cost is a key element in the decision.',k:'element',p:'ˈfæktə',pos:'n.',d:'something that influences a result',z:'w'},
{t:'academic',w:'significant',s:['considerable','substantial','marked'],c:'显著的',e:'There was a substantial increase in sales.',k:'substantial',p:'sɪɡˈnɪfɪkənt',pos:'adj.',d:'large or important enough to notice',z:'w'},
{t:'academic',w:'marginal',s:['slight','minimal','small'],c:'微小的，边缘的',e:'The figures show only a minimal improvement.',k:'minimal',p:'ˈmɑːdʒɪnl',pos:'adj.',d:'very small in amount or degree',z:'w'},
{t:'academic',w:'gradual',s:['steady','slow','progressive'],c:'逐渐的',e:'There was a steady fall in unemployment.',k:'steady',p:'ˈɡrædʒuəl',pos:'adj.',d:'happening slowly over time',z:'w'},
{t:'academic',w:'sharp',s:['dramatic','rapid','steep'],c:'急剧的',e:'The graph shows a dramatic drop in profits.',k:'dramatic',p:'ʃɑːp',pos:'adj.',d:'sudden and large',z:'w'},
{t:'academic',w:'fluctuate',s:['vary','change repeatedly','oscillate'],c:'波动',e:'Prices varied between January and March.',k:'varied',p:'ˈflʌktʃueɪt',pos:'v.',d:'to change often from one level to another',z:'w'},
{t:'academic',w:'peak',s:['reach the highest point','culminate'],c:'达到顶峰',e:'Demand reaches its highest point in summer.',k:'reaches its highest point',p:'piːk',pos:'v.',d:'to reach the top level',z:'w'},
{t:'academic',w:'plateau',s:['level off','stabilise','flatten out'],c:'趋于平稳',e:'The number of users levelled off in 2023.',k:'levelled off',p:'ˈplætəʊ',pos:'v.',d:'to stay at a steady level',z:'w'},
{t:'academic',w:'proportion',s:['percentage','share','ratio'],c:'比例',e:'A large share of income goes on housing.',k:'share',p:'prəˈpɔːʃn',pos:'n.',d:'the amount of something compared to the whole',z:'w'},
{t:'academic',w:'figure',s:['number','statistic','data'],c:'数字',e:'The statistics show a clear upward trend.',k:'statistics',p:'ˈfɪɡə',pos:'n.',d:'a number or amount',z:'w'},
{t:'academic',w:'estimate',s:['rough calculation','approximation','assessment'],c:'估计',e:'A rough calculation puts the cost at five million.',k:'rough calculation',p:'ˈestɪmət',pos:'n.',d:'an approximate judgement of an amount',z:'w'},
{t:'academic',w:'double',s:['multiply by two','twice as much'],c:'翻倍',e:'The population multiplied by two in ten years.',k:'multiplied by two',p:'ˈdʌbl',pos:'v.',d:'to become twice as much',z:'w'},
{t:'academic',w:'whereas',s:['while','in contrast','whilst'],c:'然而，而',e:'In contrast, the rural population shrank.',k:'in contrast',p:'weərˈæz',pos:'conj.',d:'used to compare two different facts',z:'w'},
{t:'academic',w:'similarly',s:['likewise','in the same way','equally'],c:'类似地',e:'Likewise, sales in Europe increased.',k:'likewise',p:'ˈsɪmələli',pos:'adv.',d:'in a similar way',z:'w'},
{t:'academic',w:'differ',s:['vary','be different','contrast'],c:'不同',e:'The results vary between regions.',k:'vary',p:'ˈdɪfə',pos:'v.',d:'to be different from something else',z:'w'},
{t:'academic',w:'distinct',s:['separate','different','clear'],c:'明显不同的',e:'The two groups have separate needs.',k:'separate',p:'dɪˈstɪŋkt',pos:'adj.',d:'clearly different or separate',z:'w'},
{t:'academic',w:'justify',s:['give reasons for','defend','validate'],c:'证明……有理',e:'The company must give reasons for the increase.',k:'give reasons for',p:'ˈdʒʌstɪfaɪ',pos:'v.',d:'to show that something is right or reasonable',z:'w'},
{t:'academic',w:'summarise',s:['outline','give a summary of','recap'],c:'总结',e:'To outline, the policy has three main aims.',k:'outline',p:'ˈsʌməraɪz',pos:'v.',d:'to state the main points of something',z:'w'},
{t:'academic',w:'overall',s:['in general','on the whole','all in all'],c:'总的来说',e:'On the whole, the results were positive.',k:'on the whole',p:'ˌəʊvərˈɔːl',pos:'adv.',d:'considering everything together',z:'w'},
{t:'academic',w:'notably',s:['particularly','especially','in particular'],c:'尤其，显著地',e:'Particularly, spending on health rose.',k:'particularly',p:'ˈnəʊtəbli',pos:'adv.',d:'especially or in a noticeable way',z:'w'},
{t:'academic',w:'graph',s:['chart','diagram','figure'],c:'图表',e:'The chart compares two sets of data.',k:'chart',p:'ɡrɑːf',pos:'n.',d:'a diagram showing information',z:'w'},
{t:'academic',w:'comparison',s:['contrast','juxtaposition','parallel'],c:'比较',e:'The contrast between the years is clear.',k:'contrast',p:'kəmˈpærɪsn',pos:'n.',d:'the act of comparing things',z:'w'},
{t:'academic',w:'percentage',s:['proportion','share','rate'],c:'百分比',e:'A large proportion of students agree.',k:'proportion',p:'pəˈsentɪdʒ',pos:'n.',d:'an amount expressed as part of a hundred',z:'w'},
{t:'core',w:'advantage',s:['benefit','merit','strength'],c:'优势',e:'One merit of the scheme is its low cost.',k:'merit',p:'ədˈvɑːntɪdʒ',pos:'n.',d:'a good or useful feature',z:'w'},
{t:'core',w:'drawback',s:['disadvantage','downside','weakness'],c:'缺点',e:'The main downside is the time required.',k:'downside',p:'ˈdrɔːbæk',pos:'n.',d:'an unpleasant part of something',z:'w'},
{t:'core',w:'solution',s:['answer','remedy','resolution'],c:'解决办法',e:'A possible remedy is to improve public transport.',k:'remedy',p:'səˈluːʃn',pos:'n.',d:'a way of solving a problem',z:'w'},
{t:'core',w:'encourage',s:['promote','foster','stimulate'],c:'鼓励，促进',e:'The scheme fosters innovation in schools.',k:'fosters',p:'ɪnˈkʌrɪdʒ',pos:'v.',d:'to give support or confidence to something',z:'w'},
{t:'core',w:'raise',s:['increase','boost','lift'],c:'提高',e:'The firm will boost wages next year.',k:'boost',p:'reɪz',pos:'v.',d:'to make something higher or greater',z:'w'},
{t:'core',w:'lower',s:['reduce','cut','bring down'],c:'降低',e:'The plan aims to cut carbon emissions.',k:'cut',p:'ˈləʊə',pos:'v.',d:'to make something less in amount',z:'w'},
{t:'core',w:'achieve',s:['accomplish','attain','reach'],c:'实现，达到',e:'The team accomplished all its goals.',k:'accomplished',p:'əˈtʃiːv',pos:'v.',d:'to succeed in doing something',z:'w'},
{t:'core',w:'aim',s:['goal','objective','target'],c:'目标',e:'The main objective is to cut waste.',k:'objective',p:'eɪm',pos:'n.',d:'what someone hopes to achieve',z:'w'},
{t:'core',w:'policy',s:['strategy','approach','plan'],c:'政策',e:'The new strategy targets young drivers.',k:'strategy',p:'ˈpɒləsi',pos:'n.',d:'an official plan of action',z:'w'},
{t:'core',w:'regulation',s:['rule','law','requirement'],c:'规定',e:'New rules will apply to all factories.',k:'rules',p:'ˌreɡjuˈleɪʃn',pos:'n.',d:'an official rule that controls something',z:'w'},
{t:'core',w:'government',s:['authorities','state','administration'],c:'政府',e:'The authorities have banned the practice.',k:'authorities',p:'ˈɡʌvənmənt',pos:'n.',d:'the group that governs a country',z:'w'},
{t:'core',w:'individual',s:['person','citizen','someone'],c:'个人',e:'Each person must take responsibility.',k:'person',p:'ˌɪndɪˈvɪdʒuəl',pos:'n.',d:'a single person',z:'w'},
{t:'core',w:'society',s:['community','the public','population'],c:'社会',e:'The whole community benefits from the project.',k:'community',p:'səˈsaɪəti',pos:'n.',d:'people living together in a country',z:'w'},
{t:'core',w:'population',s:['inhabitants','people','residents'],c:'人口',e:'The number of residents is growing.',k:'residents',p:'ˌpɒpjuˈleɪʃn',pos:'n.',d:'all the people living in a place',z:'w'},
{t:'core',w:'wealth',s:['riches','resources','affluence'],c:'财富',e:'The region\'s affluence attracts workers.',k:'affluence',p:'welθ',pos:'n.',d:'a large amount of money or property',z:'w'},
{t:'core',w:'poverty',s:['hardship','destitution','need'],c:'贫困',e:'Many families face hardship in winter.',k:'hardship',p:'ˈpɒvəti',pos:'n.',d:'the state of being poor',z:'w'},
{t:'core',w:'inequality',s:['disparity','gap','imbalance'],c:'不平等',e:'The gap between rich and poor is widening.',k:'gap',p:'ˌɪnɪˈkwɒləti',pos:'n.',d:'unfair differences between groups of people',z:'w'},
{t:'core',w:'unemployment',s:['joblessness','being out of work'],c:'失业',e:'Joblessness among young people is high.',k:'joblessness',p:'ˌʌnɪmˈplɔɪmənt',pos:'n.',d:'the state of having no job',z:'w'},
{t:'core',w:'income',s:['earnings','wages','pay'],c:'收入',e:'Average earnings rose last year.',k:'earnings',p:'ˈɪnkʌm',pos:'n.',d:'money received for work',z:'w'},
{t:'core',w:'spending',s:['expenditure','outlay','costs'],c:'支出',e:'Government expenditure on health increased.',k:'expenditure',p:'ˈspendɪŋ',pos:'n.',d:'the money that is spent',z:'w'},
{t:'core',w:'tax',s:['duty','levy','charge'],c:'税收',e:'The government introduced a new levy on fuel.',k:'levy',p:'tæks',pos:'n.',d:'money paid to the government',z:'w'},
{t:'core',w:'budget',s:['funds','allocation','resources'],c:'预算',e:'Funds for the project were cut.',k:'funds',p:'ˈbʌdʒɪt',pos:'n.',d:'the money available for a purpose',z:'w'},
{t:'core',w:'funding',s:['finance','backing','money'],c:'资金',e:'The scheme needs extra finance.',k:'finance',p:'ˈfʌndɪŋ',pos:'n.',d:'money provided for something',z:'w'},
{t:'core',w:'investment',s:['capital','funding','outlay'],c:'投资',e:'More capital is flowing into renewable energy.',k:'capital',p:'ɪnˈvestmənt',pos:'n.',d:'money put into something to make a profit',z:'w'},
{t:'core',w:'profit',s:['gain','return','earnings'],c:'利润',e:'The company reported strong gains.',k:'gains',p:'ˈprɒfɪt',pos:'n.',d:'money made in business',z:'w'},
{t:'core',w:'demand',s:['need','requirement','desire'],c:'需求',e:'The need for housing is growing.',k:'need',p:'dɪˈmɑːnd',pos:'n.',d:'the amount of something people want',z:'w'},
{t:'core',w:'supply',s:['provision','source','stock'],c:'供应',e:'The provision of clean water is essential.',k:'provision',p:'səˈplaɪ',pos:'n.',d:'the amount of something available',z:'w'},
{t:'core',w:'surplus',s:['excess','oversupply','extra'],c:'过剩',e:'An excess of oil pushed prices down.',k:'excess',p:'ˈsɜːpləs',pos:'n.',d:'more of something than is needed',z:'w'},
{t:'core',w:'efficient',s:['effective','productive','well-organised'],c:'高效的',e:'The new system is highly effective.',k:'effective',p:'ɪˈfɪʃnt',pos:'adj.',d:'working well without wasting time or money',z:'w'},
{t:'core',w:'effective',s:['successful','productive','efficient'],c:'有效的',e:'The campaign was highly successful.',k:'successful',p:'ɪˈfektɪv',pos:'adj.',d:'producing the result that is wanted',z:'w'},
{t:'core',w:'sustainable',s:['environmentally friendly','viable','long-term'],c:'可持续的',e:'The scheme is environmentally friendly.',k:'environmentally friendly',p:'səˈsteɪnəbl',pos:'adj.',d:'able to continue without harming the environment',z:'w'},
{t:'core',w:'obesity',s:['being overweight','excess weight'],c:'肥胖',e:'Being overweight raises health risks.',k:'being overweight',p:'əʊˈbiːsəti',pos:'n.',d:'the condition of being very overweight',z:'w'},
{t:'core',w:'healthcare',s:['medical care','treatment','care'],c:'医疗保健',e:'Medical care has improved greatly.',k:'medical care',p:'ˈhelθkeə',pos:'n.',d:'the treatment of illness and injury',z:'w'},
{t:'core',w:'sedentary',s:['inactive','sitting down a lot'],c:'久坐的',e:'Inactive lifestyles are common in cities.',k:'inactive',p:'ˈsedntri',pos:'adj.',d:'involving little physical activity',z:'w'},
{t:'core',w:'mental',s:['psychological','emotional','cognitive'],c:'心理的',e:'Psychological health is often ignored.',k:'psychological',p:'ˈmentl',pos:'adj.',d:'relating to the mind',z:'w'},
{t:'core',w:'wellbeing',s:['health','welfare','quality of life'],c:'幸福感，健康',e:'Exercise improves overall welfare.',k:'welfare',p:'ˌwelˈbiːɪŋ',pos:'n.',d:'the state of being healthy and happy',z:'w'},
{t:'core',w:'disease',s:['illness','sickness','condition'],c:'疾病',e:'The illness spread quickly.',k:'illness',p:'dɪˈziːz',pos:'n.',d:'a serious illness affecting the body',z:'w'},
{t:'core',w:'prevention',s:['avoidance','stopping','protection'],c:'预防',e:'Avoidance is better than cure.',k:'avoidance',p:'prɪˈvenʃn',pos:'n.',d:'stopping something before it happens',z:'w'},
{t:'core',w:'technology',s:['innovation','digital tools','equipment'],c:'技术',e:'Digital tools have changed education.',k:'digital tools',p:'tekˈnɒlədʒi',pos:'n.',d:'scientific knowledge applied in practical ways',z:'w'},
{t:'core',w:'automation',s:['machine use','robotics','computerisation'],c:'自动化',e:'Machine use has replaced some jobs.',k:'machine use',p:'ˌɔːtəˈmeɪʃn',pos:'n.',d:'using machines to do work',z:'w'},
{t:'core',w:'innovation',s:['invention','new idea','advance'],c:'创新',e:'The invention transformed travel.',k:'invention',p:'ˌɪnəˈveɪʃn',pos:'n.',d:'a new idea or method',z:'w'},
{t:'core',w:'advancement',s:['progress','development','improvement'],c:'进步',e:'Progress in medicine has been rapid.',k:'progress',p:'ədˈvɑːnsmənt',pos:'n.',d:'forward movement or improvement',z:'w'},
{t:'core',w:'device',s:['gadget','machine','appliance'],c:'设备',e:'People carry several gadgets.',k:'gadgets',p:'dɪˈvaɪs',pos:'n.',d:'a piece of electronic equipment',z:'w'},
{t:'core',w:'artificial',s:['man-made','synthetic','manufactured'],c:'人造的',e:'Man-made intelligence is advancing.',k:'man-made',p:'ˌɑːtɪˈfɪʃl',pos:'adj.',d:'made by people rather than nature',z:'w'},
{t:'core',w:'online',s:['digital','virtual','on the internet'],c:'在线的',e:'Virtual lessons are now common.',k:'virtual',p:'ˌɒnˈlaɪn',pos:'adj.',d:'connected to the internet',z:'w'},
{t:'core',w:'curriculum',s:['syllabus','course of study','programme'],c:'课程体系',e:'The syllabus includes more science.',k:'syllabus',p:'kəˈrɪkjələm',pos:'n.',d:'the subjects taught in a school or course',z:'w'},
{t:'core',w:'literacy',s:['reading and writing','basic skills'],c:'读写能力',e:'Reading and writing rates have improved.',k:'reading and writing',p:'ˈlɪtərəsi',pos:'n.',d:'the ability to read and write',z:'w'},
{t:'core',w:'tuition',s:['fees','teaching','instruction'],c:'学费，教学',e:'University fees have doubled.',k:'fees',p:'tjuˈɪʃn',pos:'n.',d:'money paid for teaching',z:'w'},
{t:'core',w:'vocational',s:['practical','work-related','career-based'],c:'职业的',e:'Work-related training is valued.',k:'work-related',p:'vəʊˈkeɪʃənl',pos:'adj.',d:'relating to skills needed for a job',z:'w'},
{t:'core',w:'productivity',s:['output','efficiency','yield'],c:'生产力',e:'Output rose by ten percent.',k:'output',p:'ˌprɒdʌkˈtɪvəti',pos:'n.',d:'the amount of work produced',z:'w'},
{t:'core',w:'workforce',s:['staff','employees','labour force'],c:'劳动力',e:'The labour force is shrinking.',k:'labour force',p:'ˈwɜːkfɔːs',pos:'n.',d:'all the people who work in a place',z:'w'},
{t:'core',w:'opportunity',s:['chance','prospect','opening'],c:'机会',e:'The scheme offers new chances.',k:'chances',p:'ˌɒpəˈtjuːnəti',pos:'n.',d:'a chance to do something',z:'w'},
{t:'core',w:'career',s:['profession','occupation','working life'],c:'职业',e:'She chose a career in medicine.',k:'career',p:'kəˈrɪə',pos:'n.',d:'the job you do during your working life',z:'w'},
{t:'core',w:'flexible',s:['adaptable','adjustable','versatile'],c:'灵活的',e:'The company offers adaptable hours.',k:'adaptable',p:'ˈfleksəbl',pos:'adj.',d:'able to change easily',z:'w'},
{t:'core',w:'congestion',s:['traffic jams','gridlock','crowding'],c:'拥堵',e:'Traffic jams are worse in the morning.',k:'traffic jams',p:'kənˈdʒestʃən',pos:'n.',d:'too much traffic blocking roads',z:'w'},
{t:'core',w:'commute',s:['travel to work','daily journey','round trip'],c:'通勤',e:'Her daily journey takes an hour.',k:'daily journey',p:'kəˈmjuːt',pos:'n.',d:'the journey to and from work',z:'w'},
{t:'core',w:'infrastructure',s:['roads and systems','facilities','networks'],c:'基础设施',e:'Better roads and systems are needed.',k:'roads and systems',p:'ˈɪnfrəstrʌktʃə',pos:'n.',d:'basic systems such as roads and power',z:'w'},
{t:'core',w:'housing',s:['homes','accommodation','shelter'],c:'住房',e:'Affordable homes are scarce.',k:'homes',p:'ˈhaʊzɪŋ',pos:'n.',d:'houses available for people to live in',z:'w'},
{t:'core',w:'urban',s:['city','metropolitan','town'],c:'城市的',e:'City life is becoming costly.',k:'city',p:'ˈɜːbən',pos:'adj.',d:'relating to towns or cities',z:'w'},
{t:'core',w:'rural',s:['countryside','country','agricultural'],c:'乡村的',e:'Countryside services are limited.',k:'countryside',p:'ˈrʊərəl',pos:'adj.',d:'relating to the countryside',z:'w'},
{t:'core',w:'consumer',s:['buyer','customer','shopper'],c:'消费者',e:'Buyers want lower prices.',k:'buyers',p:'kənˈsjuːmə',pos:'n.',d:'a person who buys goods',z:'w'},
{t:'core',w:'manufacture',s:['produce','make','fabricate'],c:'制造',e:'The goods are produced locally.',k:'produced',p:'ˌmænjuˈfæktʃə',pos:'v.',d:'to make goods in large numbers',z:'w'},
{t:'core',w:'brand',s:['label','trademark','name'],c:'品牌',e:'The label is known worldwide.',k:'label',p:'brænd',pos:'n.',d:'a product name made by a company',z:'w'},
{t:'core',w:'luxury',s:['premium','high-end','expensive'],c:'奢侈品',e:'Premium goods sell well.',k:'premium',p:'ˈlʌkʃəri',pos:'n.',d:'something expensive but not necessary',z:'w'},
{t:'core',w:'concern',s:['worry','issue','anxiety'],c:'担忧，关切',e:'The main worry is safety.',k:'worry',p:'kənˈsɜːn',pos:'n.',d:'a feeling of worry about something',z:'w'},
{t:'core',w:'positive',s:['favourable','good','optimistic'],c:'积极的',e:'The response was favourable.',k:'favourable',p:'ˈpɒzətɪv',pos:'adj.',d:'good or hopeful',z:'w'},
{t:'core',w:'negative',s:['unfavourable','harmful','adverse'],c:'消极的',e:'There were adverse effects on health.',k:'adverse',p:'ˈneɡətɪv',pos:'adj.',d:'bad or harmful',z:'w'},
{t:'core',w:'balance',s:['equilibrium','stability','proportion'],c:'平衡',e:'A good balance between work and rest is key.',k:'balance',p:'ˈbæləns',pos:'n.',d:'a state where things are equal',z:'w'},
{t:'core',w:'contrast',s:['difference','distinction','comparison'],c:'对比，差异',e:'The distinction between the two is clear.',k:'distinction',p:'ˈkɒntrɑːst',pos:'n.',d:'a clear difference between things',z:'w'},
{t:'core',w:'similarity',s:['resemblance','likeness','parallel'],c:'相似之处',e:'There is a clear resemblance between the charts.',k:'resemblance',p:'ˌsɪməˈlærəti',pos:'n.',d:'the state of being similar',z:'w'},
{t:'core',w:'difference',s:['distinction','gap','variation'],c:'差异',e:'The variation is small but real.',k:'variation',p:'ˈdɪfrəns',pos:'n.',d:'the way things are not the same',z:'w'},
{t:'core',w:'transform',s:['change completely','revolutionise','alter'],c:'彻底改变',e:'The internet revolutionised communication.',k:'revolutionised',p:'trænsˈfɔːm',pos:'v.',d:'to change something completely',z:'w'},
{t:'core',w:'develop',s:['expand','grow','build up'],c:'发展',e:'The company expanded rapidly.',k:'expanded',p:'dɪˈveləp',pos:'v.',d:'to grow or improve',z:'w'},
{t:'core',w:'address',s:['tackle','deal with','solve'],c:'解决（问题）',e:'The plan tackles the housing crisis.',k:'tackles',p:'əˈdres',pos:'v.',d:'to deal with a problem',z:'w'},
{t:'core',w:'tackle',s:['deal with','address','solve'],c:'处理',e:'The council dealt with the issue quickly.',k:'dealt with',p:'ˈtækl',pos:'v.',d:'to make an effort to deal with something',z:'w'},
{t:'core',w:'implement',s:['carry out','put into practice','introduce'],c:'实施',e:'The policy will be carried out next year.',k:'carried out',p:'ˈɪmplɪment',pos:'v.',d:'to put a plan into action',z:'w'},
{t:'core',w:'evaluate',s:['assess','appraise','judge'],c:'评估',e:'The programme will be assessed annually.',k:'assessed',p:'ɪˈvæljueɪt',pos:'v.',d:'to judge the value or quality of something',z:'w'},
{t:'core',w:'recommend',s:['suggest','advise','propose'],c:'建议',e:'Experts advise against the ban.',k:'advise',p:'ˌrekəˈmend',pos:'v.',d:'to suggest something as good',z:'w'},
{t:'core',w:'propose',s:['suggest','put forward','recommend'],c:'提议',e:'The council put forward a new plan.',k:'put forward',p:'prəˈpəʊz',pos:'v.',d:'to suggest a plan or idea',z:'w'},
{t:'core',w:'debate',s:['discussion','argument','controversy'],c:'辩论，讨论',e:'The discussion focused on education.',k:'discussion',p:'dɪˈbeɪt',pos:'n.',d:'a formal discussion of a topic',z:'w'},
{t:'core',w:'influence',s:['shape','affect','determine'],c:'影响',e:'The media shape public opinion.',k:'shape',p:'ˈɪnfluəns',pos:'v.',d:'to change or affect something',z:'w'},
{t:'core',w:'shape',s:['influence','form','determine'],c:'塑造',e:'Family values determine our choices.',k:'determine',p:'ʃeɪp',pos:'v.',d:'to influence how something develops',z:'w'},
{t:'core',w:'fundamental',s:['basic','essential','core'],c:'根本的',e:'Basic rights must be protected.',k:'basic',p:'ˌfʌndəˈmentl',pos:'adj.',d:'forming the base of something',z:'w'},
{t:'core',w:'relate to',s:['connect with','be linked to','concern'],c:'与……相关',e:'The results connect with earlier findings.',k:'connect with',p:'rɪˈleɪt tuː',pos:'v.',d:'to be connected with something',z:'w'},
{t:'core',w:'connection',s:['link','relationship','tie'],c:'联系',e:'The link between diet and health is strong.',k:'link',p:'kəˈnekʃn',pos:'n.',d:'a relationship between things',z:'w'},
{t:'core',w:'dependent',s:['reliant','depending','conditional'],c:'依赖的',e:'The region is reliant on tourism.',k:'reliant',p:'dɪˈpendənt',pos:'adj.',d:'needing something or someone',z:'w'},
{t:'core',w:'equal',s:['the same','identical','even'],c:'平等的，相等的',e:'Both groups received the same pay.',k:'the same',p:'ˈiːkwəl',pos:'adj.',d:'the same in amount or level',z:'w'},
{t:'core',w:'major',s:['main','principal','chief'],c:'主要的',e:'The principal cause is overuse.',k:'principal',p:'ˈmeɪdʒə',pos:'adj.',d:'very important or large',z:'w'},
{t:'core',w:'minor',s:['small','less important','secondary'],c:'次要的',e:'A secondary issue was ignored.',k:'secondary',p:'ˈmaɪnə',pos:'adj.',d:'small or not important',z:'w'},
{t:'core',w:'rapid',s:['fast','quick','swift'],c:'快速的',e:'The city is expanding at a swift pace.',k:'swift',p:'ˈræpɪd',pos:'adj.',d:'happening very quickly',z:'w'},
{t:'core',w:'steadily',s:['gradually','consistently','evenly'],c:'稳定地',e:'Prices have risen consistently.',k:'consistently',p:'ˈstedɪli',pos:'adv.',d:'in a regular and continuous way',z:'w'},
{t:'core',w:'widespread',s:['common','prevalent','general'],c:'普遍的',e:'Smartphone use is prevalent.',k:'prevalent',p:'ˈwaɪdspred',pos:'adj.',d:'existing in many places',z:'w'},
{t:'core',w:'rare',s:['uncommon','scarce','infrequent'],c:'罕见的',e:'Such skills are uncommon.',k:'uncommon',p:'reə',pos:'adj.',d:'not common or frequent',z:'w'},
{t:'core',w:'current',s:['present','existing','now'],c:'当前的',e:'The present system is outdated.',k:'present',p:'ˈkʌrənt',pos:'adj.',d:'happening or existing now',z:'w'},
{t:'core',w:'previous',s:['earlier','past','former'],c:'之前的',e:'Earlier studies found the same.',k:'earlier',p:'ˈpriːviəs',pos:'adj.',d:'happening or existing before',z:'w'},
{t:'core',w:'likely',s:['probable','possible','expected'],c:'可能的',e:'A further rise is probable.',k:'probable',p:'ˈlaɪkli',pos:'adj.',d:'probably going to happen',z:'w'},
{t:'core',w:'unlikely',s:['improbable','doubtful','unexpected'],c:'不太可能的',e:'Change is doubtful in the short term.',k:'doubtful',p:'ʌnˈlaɪkli',pos:'adj.',d:'not likely to happen',z:'w'},
{t:'core',w:'despite',s:['in spite of','regardless of','even with'],c:'尽管',e:'In spite of the cost, the plan went ahead.',k:'in spite of',p:'dɪˈspaɪt',pos:'prep.',d:'without being affected by something',z:'w'},
{t:'core',w:'although',s:['even though','though','while'],c:'虽然',e:'Even though it rained, we continued.',k:'even though',p:'ɔːlˈðəʊ',pos:'conj.',d:'in spite of the fact that',z:'w'},
{t:'core',w:'consequently',s:['as a result','therefore','thus'],c:'因此',e:'As a result, prices fell.',k:'as a result',p:'ˈkɒnsɪkwəntli',pos:'adv.',d:'because of that',z:'w'},
{t:'edu',w:'achievement',s:['accomplishment','success','attainment'],c:'成就',e:'The school celebrates every accomplishment.',k:'accomplishment',p:'əˈtʃiːvmənt',pos:'n.',d:'something good that you succeed in doing',z:'w'},
{t:'feelings',w:'attitude',s:['view','stance','approach'],c:'态度',e:'Her stance on the issue is clear.',k:'stance',p:'ˈætɪtjuːd',pos:'n.',d:'the way you think or feel about something',z:'w'},
{t:'travel',w:'junction',s:['crossing','intersection','corner'],c:'路口',e:'Turn left at the next intersection.',k:'intersection',p:'ˈdʒʌŋkʃn',pos:'n.',d:'a place where roads meet',z:'l'},
{t:'travel',w:'roundabout',s:['traffic circle','rotary'],c:'环岛',e:'Take the second exit at the traffic circle.',k:'traffic circle',p:'ˈraʊndəbaʊt',pos:'n.',d:'a circular road junction',z:'l'},
{t:'travel',w:'pedestrian',s:['walker','person on foot'],c:'行人',e:'The walker used the crossing.',k:'walker',p:'pəˈdestriən',pos:'n.',d:'a person walking rather than driving',z:'l'},
{t:'travel',w:'crossing',s:['zebra crossing','pedestrian crossing'],c:'人行横道',e:'Use the zebra crossing to reach the bank.',k:'zebra crossing',p:'ˈkrɒsɪŋ',pos:'n.',d:'a place where people cross the road',z:'l'},
{t:'travel',w:'platform',s:['track','bay','stand'],c:'站台',e:'The train leaves from track three.',k:'track',p:'ˈplætfɔːm',pos:'n.',d:'the place where you get on a train',z:'l'},
{t:'travel',w:'arrival',s:['landing','coming in','arrive'],c:'到达',e:'Landing is scheduled for noon.',k:'landing',p:'əˈraɪvl',pos:'n.',d:'the act of arriving',z:'l'},
{t:'travel',w:'cancel',s:['call off','scrap','abort'],c:'取消',e:'The flight was called off.',k:'called off',p:'ˈkænsl',pos:'v.',d:'to decide that something will not happen',z:'l'},
{t:'travel',w:'terminal',s:['station','depot','gate'],c:'航站楼，终点站',e:'Meet me at the bus station.',k:'station',p:'ˈtɜːmɪnl',pos:'n.',d:'a building where journeys begin or end',z:'l'},
{t:'travel',w:'hostel',s:['budget accommodation','youth hostel'],c:'青年旅舍',e:'The youth hostel is near the station.',k:'youth hostel',p:'ˈhɒstl',pos:'n.',d:'cheap accommodation for travellers',z:'l'},
{t:'travel',w:'cancellation',s:['calling off','withdrawal','cancelling'],c:'取消',e:'Calling off the trip costs nothing.',k:'calling off',p:'ˌkænsəˈleɪʃn',pos:'n.',d:'the act of cancelling something',z:'l'},
{t:'travel',w:'insurance',s:['cover','protection','policy'],c:'保险',e:'Travel cover is included in the price.',k:'cover',p:'ɪnˈʃʊərəns',pos:'n.',d:'protection against loss or damage',z:'l'},
{t:'travel',w:'customs',s:['border control','immigration'],c:'海关',e:'Border control took twenty minutes.',k:'border control',p:'ˈkʌstəmz',pos:'n.',d:'the place where goods are checked',z:'l'},
{t:'travel',w:'boarding',s:['getting on','embarkation'],c:'登机',e:'Getting on begins at gate twelve.',k:'getting on',p:'ˈbɔːdɪŋ',pos:'n.',d:'the act of getting on a plane or ship',z:'l'},
{t:'travel',w:'timetable',s:['schedule','programme'],c:'时刻表',e:'The schedule changed last week.',k:'schedule',p:'ˈtaɪmteɪbl',pos:'n.',d:'a list of times when things happen',z:'l'},
{t:'living',w:'tenant',s:['renter','occupant','lodger'],c:'房客',e:'The renter pays the rent monthly.',k:'renter',p:'ˈtenənt',pos:'n.',d:'a person who rents a property',z:'l'},
{t:'living',w:'furnished',s:['equipped','with furniture'],c:'带家具的',e:'The flat is equipped with furniture.',k:'equipped',p:'ˈfɜːnɪʃt',pos:'adj.',d:'containing furniture',z:'l'},
{t:'living',w:'unfurnished',s:['empty','without furniture'],c:'不带家具的',e:'The room is empty of furniture.',k:'empty',p:'ʌnˈfɜːnɪʃt',pos:'adj.',d:'without furniture',z:'l'},
{t:'edu',w:'enrol',s:['register','sign up','join'],c:'报名，注册',e:'Register online before Friday.',k:'register',p:'ɪnˈrəʊl',pos:'v.',d:'to officially join a course',z:'l'},
{t:'edu',w:'registration',s:['enrolment','sign-up','joining'],c:'注册',e:'Enrolment opens in September.',k:'enrolment',p:'ˌredʒɪˈstreɪʃn',pos:'n.',d:'the process of registering',z:'l'},
{t:'edu',w:'laboratory',s:['lab','workshop','science room'],c:'实验室',e:'The lab is on the third floor.',k:'lab',p:'ləˈbɒrətri',pos:'n.',d:'a room used for scientific work',z:'l'},
{t:'edu',w:'auditorium',s:['hall','lecture hall','theatre'],c:'礼堂',e:'The lecture hall seats two hundred.',k:'lecture hall',p:'ˌɔːdɪˈtɔːriəm',pos:'n.',d:'a large room for audiences',z:'l'},
{t:'edu',w:'reception',s:['front desk','enquiry desk','office'],c:'前台，接待处',e:'Ask at the front desk.',k:'front desk',p:'rɪˈsepʃn',pos:'n.',d:'the place where visitors report',z:'l'},
{t:'edu',w:'extension',s:['extra time','postponement','more time'],c:'延期',e:'Ask for extra time if needed.',k:'extra time',p:'ɪkˈstenʃn',pos:'n.',d:'more time allowed for something',z:'l'},
{t:'edu',w:'reference',s:['recommendation','testimonial'],c:'推荐信',e:'Provide a recommendation from a tutor.',k:'recommendation',p:'ˈrefrəns',pos:'n.',d:'a statement about someone\'s qualities',z:'l'},
{t:'edu',w:'draft',s:['first version','rough copy','outline'],c:'草稿',e:'Submit a first version by Monday.',k:'first version',p:'drɑːft',pos:'n.',d:'an early version of a piece of writing',z:'l'},
{t:'edu',w:'plagiarism',s:['copying','cheating','stealing work'],c:'抄袭',e:'Copying will lead to failure.',k:'copying',p:'ˈpleɪdʒərɪzəm',pos:'n.',d:'using other people\'s work as your own',z:'l'},
{t:'health',w:'surgery',s:['clinic','doctor\'s office','practice'],c:'诊所，手术',e:'The clinic opens at nine.',k:'clinic',p:'ˈsɜːdʒəri',pos:'n.',d:'a place where doctors treat patients',z:'l'},
{t:'health',w:'prescription',s:['medicine order','medical note'],c:'处方',e:'Take the medical note to the chemist.',k:'medical note',p:'prɪˈskrɪpʃn',pos:'n.',d:'a doctor\'s order for medicine',z:'l'},
{t:'health',w:'vaccination',s:['injection','jab','immunisation'],c:'接种疫苗',e:'The jab is free for students.',k:'jab',p:'ˌvæksɪˈneɪʃn',pos:'n.',d:'a medical injection against disease',z:'l'},
{t:'shopping',w:'special offer',s:['deal','promotion','reduction'],c:'特价优惠',e:'There is a deal on this week.',k:'deal',p:'ˈspeʃl ˈɒfə',pos:'n.',d:'a temporary price reduction',z:'l'},
{t:'shopping',w:'voucher',s:['coupon','token','credit note'],c:'代金券',e:'Use the coupon at checkout.',k:'coupon',p:'ˈvaʊtʃə',pos:'n.',d:'a ticket that gives a discount',z:'l'},
{t:'shopping',w:'outlet',s:['store','shop','branch'],c:'专卖店，折扣店',e:'The store is in the mall.',k:'store',p:'ˈaʊtlet',pos:'n.',d:'a shop that sells goods',z:'l'},
{t:'shopping',w:'counter',s:['desk','till','stand'],c:'柜台',e:'Pay at the till.',k:'till',p:'ˈkaʊntə',pos:'n.',d:'the place where you pay in a shop',z:'l'},
{t:'shopping',w:'grocery',s:['food shopping','supermarket goods','groceries'],c:'食品杂货',e:'The supermarket sells groceries.',k:'groceries',p:'ˈɡrəʊsəri',pos:'n.',d:'food and household goods',z:'l'},
{t:'work',w:'resign',s:['quit','leave','step down'],c:'辞职',e:'She decided to quit her job.',k:'quit',p:'rɪˈzaɪn',pos:'v.',d:'to leave a job officially',z:'l'},
{t:'work',w:'application',s:['form','request','submission'],c:'申请表',e:'The form is available online.',k:'form',p:'ˌæplɪˈkeɪʃn',pos:'n.',d:'a formal request for a job or course',z:'l'},
{t:'env',w:'wildlife',s:['animals','nature','fauna'],c:'野生动物',e:'Local animals are protected.',k:'animals',p:'ˈwaɪldlaɪf',pos:'n.',d:'wild animals and plants',z:'l'},
{t:'env',w:'species',s:['type','kind','variety'],c:'物种',e:'Many types of bird live here.',k:'types',p:'ˈspiːʃiːz',pos:'n.',d:'a group of animals or plants',z:'l'},
{t:'core',w:'description',s:['account','details','overview'],c:'描述',e:'Give an account of the process.',k:'account',p:'dɪˈskrɪpʃn',pos:'n.',d:'a spoken or written explanation',z:'l'},
{t:'core',w:'location',s:['position','site','place'],c:'位置',e:'The site is near the park.',k:'site',p:'ləʊˈkeɪʃn',pos:'n.',d:'a place where something is',z:'l'},
{t:'core',w:'opposite',s:['across from','facing','opposite to'],c:'在……对面',e:'The bank is across from the library.',k:'across from',p:'ˈɒpəzɪt',pos:'prep.',d:'facing something on the other side',z:'l'},
{t:'core',w:'adjacent',s:['next to','beside','nearby'],c:'相邻的',e:'The cafe is next to the bookshop.',k:'next to',p:'əˈdʒeɪsnt',pos:'adj.',d:'very close or next to something',z:'l'},
{t:'core',w:'directions',s:['instructions','guidance','way'],c:'方向指示',e:'Follow the instructions to the hall.',k:'instructions',p:'dəˈrekʃnz',pos:'n.',d:'guidance on how to get somewhere',z:'l'},
{t:'core',w:'entrance',s:['way in','door','gate'],c:'入口',e:'The way in is on the left.',k:'way in',p:'ˈentrəns',pos:'n.',d:'the place where you go in',z:'l'},
{t:'core',w:'exit',s:['way out','door','gate'],c:'出口',e:'The way out is at the back.',k:'way out',p:'ˈeksɪt',pos:'n.',d:'the place where you go out',z:'l'},
{t:'core',w:'noticeboard',s:['bulletin board','message board','board'],c:'公告栏',e:'Check the bulletin board daily.',k:'bulletin board',p:'ˈnəʊtɪsbɔːd',pos:'n.',d:'a board for public notices',z:'l'},
{t:'core',w:'newsletter',s:['bulletin','update','mailing'],c:'简报',e:'The bulletin comes monthly.',k:'bulletin',p:'ˈnjuːzletə',pos:'n.',d:'a regular update sent to members',z:'l'},
{t:'core',w:'enquiry',s:['question','inquiry','request for information'],c:'询问',e:'Send your questions to the office.',k:'questions',p:'ɪnˈkwaɪəri',pos:'n.',d:'a question about something',z:'l'},
{t:'core',w:'brochure',s:['leaflet','pamphlet','booklet'],c:'宣传册',e:'The leaflet explains the course.',k:'leaflet',p:'ˈbrəʊʃə',pos:'n.',d:'a small book with information',z:'l'},
{t:'core',w:'details',s:['information','particulars','specifics'],c:'详细信息',e:'Write your particulars below.',k:'particulars',p:'ˈdiːteɪlz',pos:'n.',d:'facts or information about something',z:'l'},
{t:'core',w:'confirmation',s:['verification','approval','receipt'],c:'确认',e:'You will receive verification by email.',k:'verification',p:'ˌkɒnfəˈmeɪʃn',pos:'n.',d:'a statement that something is true or arranged',z:'l'}
];

















const DICT = {
  'important':['ɪmˈpɔːtnt','adj.','having great value or influence'],
  'improve':['ɪmˈpruːv','v.','to make something better'],
  'problem':['ˈprɒbləm','n.','a difficulty that needs to be solved'],
  'increase':['ˈɪnkriːs','n.','a rise in amount or number'],
  'decrease':['ˈdiːkriːs','n.','a reduction in amount or number'],
  'expensive':['ɪkˈspensɪv','adj.','costing a lot of money'],
  'cheap':['tʃiːp','adj.','costing little money'],
  'big':['bɪɡ','adj.','large in size or amount'],
  'small':['smɔːl','adj.','little in size or amount'],
  'need':['niːd','v.','to require something'],
  'show':['ʃəʊ','v.','to make something clear or visible'],
  'get':['ɡet','v.','to obtain or receive something'],
  'buy':['baɪ','v.','to get something by paying money'],
  'help':['help','v.','to make it easier for someone to do something'],
  'start':['stɑːt','v.','to begin'],
  'finish':['ˈfɪnɪʃ','v.','to complete something'],
  'choose':['tʃuːz','v.','to pick one thing from a group'],
  'change':['tʃeɪndʒ','v.','to make or become different'],
  'enough':['ɪˈnʌf','adj.','as much as is needed'],
  'many':['ˈmeni','adj.','a large number of'],
  'most':['məʊst','adj.','the majority of'],
  'also':['ˈɔːlsəʊ','adv.','in addition'],
  'because':['bɪˈkɒz','conj.','for the reason that'],
  'so':['səʊ','conj.','therefore'],
  'but':['bʌt','conj.','however'],
  'maybe':['ˈmeɪbi','adv.','perhaps'],
  'about':['əˈbaʊt','adv.','approximately'],
  'very':['ˈveri','adv.','to a high degree'],
  'often':['ˈɒfn','adv.','frequently'],
  'rarely':['ˈreəli','adv.','not often'],
  'course':['kɔːs','n.','a series of lessons'],
  'subject':['ˈsʌbdʒɪkt','n.','an area of study'],
  'teacher':['ˈtiːtʃə','n.','a person who teaches'],
  'student':['ˈstjuːdnt','n.','a person who studies'],
  'homework':['ˈhəʊmwɜːk','n.','school work done at home'],
  'exam':['ɪɡˈzæm','n.','a formal test'],
  'score':['skɔː','n.','the number of points in a test'],
  'degree':['dɪˈɡriː','n.','a qualification from a university'],
  'university':['ˌjuːnɪˈvɜːsəti','n.','a place of higher education'],
  'lesson':['ˈlesn','n.','a period of teaching'],
  'learn':['lɜːn','v.','to gain knowledge or skill'],
  'revise':['rɪˈvaɪz','v.','to review work for an exam'],
  'difficult':['ˈdɪfɪkəlt','adj.','hard to do'],
  'easy':['ˈiːzi','adj.','not difficult'],
  'compulsory':['kəmˈpʌlsəri','adj.','required by rule'],
  'knowledge':['ˈnɒlɪdʒ','n.','information and understanding'],
  'job':['dʒɒb','n.','paid work'],
  'salary':['ˈsæləri','n.','regular pay for work'],
  'company':['ˈkʌmpəni','n.','a business organization'],
  'employee':['ɪmˈplɔɪiː','n.','a person who works for a company'],
  'manager':['ˈmænɪdʒə','n.','a person in charge of a team'],
  'meeting':['ˈmiːtɪŋ','n.','a planned discussion'],
  'retire':['rɪˈtaɪə','v.','to stop working, usually at an older age'],
  'hire':['haɪə','v.','to give someone a job'],
  'fire':['faɪə','v.','to dismiss someone from a job'],
  'promotion':['prəˈməʊʃn','n.','movement to a higher position'],
  'experience':['ɪkˈspɪəriəns','n.','knowledge gained from doing something'],
  'skill':['skɪl','n.','an ability to do something well'],
  'colleague':['ˈkɒliːɡ','n.','a person you work with'],
  'office':['ˈɒfɪs','n.','a place where people work'],
  'travel':['ˈtrævl','v.','to go from one place to another'],
  'arrive':['əˈraɪv','v.','to reach a place'],
  'leave':['liːv','v.','to go away from a place'],
  'return':['rɪˈtɜːn','v.','to come or go back'],
  'book':['bʊk','v.','to reserve in advance'],
  'ticket':['ˈtɪkɪt','n.','a document that allows travel or entry'],
  'near':['nɪə','adj.','close in distance'],
  'far':['fɑː','adj.','a long distance away'],
  'fast':['fɑːst','adj.','quick'],
  'slow':['sləʊ','adj.','not quick'],
  'busy':['ˈbɪzi','adj.','full of people or activity'],
  'free':['friː','adj.','available or costing nothing'],
  'luggage':['ˈlʌɡɪdʒ','n.','bags carried when travelling'],
  'vehicle':['ˈviːəkl','n.','a machine used for transport'],
  'route':['ruːt','n.','the way from one place to another'],
  'postpone':['pəˈspəʊn','v.','to delay to a later time'],
  'ill':['ɪl','adj.','not well'],
  'tired':['ˈtaɪəd','adj.','needing rest'],
  'healthy':['ˈhelθi','adj.','in good condition of body and mind'],
  'exercise':['ˈeksəsaɪz','n.','physical activity for fitness'],
  'diet':['ˈdaɪət','n.','the food a person eats'],
  'medicine':['ˈmedsn','n.','a substance used to treat illness'],
  'injury':['ˈɪndʒəri','n.','physical damage to the body'],
  'recover':['rɪˈkʌvə','v.','to get better after illness'],
  'pain':['peɪn','n.','a feeling of hurt'],
  'stress':['stres','n.','pressure that causes worry'],
  'relax':['rɪˈlæks','v.','to rest and become calm'],
  'sleep':['sliːp','n.','rest with eyes closed'],
  'strong':['strɒŋ','adj.','having great physical power'],
  'weak':['wiːk','adj.','lacking strength'],
  'cure':['kjʊə','v.','to make an illness go away'],
  'prevent':['prɪˈvent','v.','to stop something from happening'],
  'environment':['ɪnˈvaɪrənmənt','n.','the natural world around us'],
  'pollution':['pəˈluːʃn','n.','dirt or waste that harms the environment'],
  'waste':['weɪst','n.','unwanted materials or rubbish'],
  'recycle':['ˌriːˈsaɪkl','v.','to treat used materials so they can be used again'],
  'energy':['ˈenədʒi','n.','power from sources such as electricity or fuel'],
  'climate':['ˈklaɪmət','n.','the usual weather of a place'],
  'damage':['ˈdæmɪdʒ','n.','harm caused to something'],
  'protect':['prəˈtekt','v.','to keep something safe'],
  'reduce':['rɪˈdjuːs','v.','to make smaller or less'],
  'plant':['plɑːnt','n.','a living thing that grows in the ground'],
  'animal':['ˈænɪml','n.','a living creature that is not a plant'],
  'resource':['rɪˈsɔːs','n.','a supply of something useful'],
  'growth':['ɡrəʊθ','n.','an increase in size or amount'],
  'shortage':['ˈʃɔːtɪdʒ','n.','a lack of something needed'],
  'solve':['sɒlv','v.','to find an answer to a problem'],
  'eco-friendly':['ˈiːkəʊ ˌfrendli','adj.','not harmful to the environment'],
  'house':['haʊs','n.','a building for people to live in'],
  'room':['ruːm','n.','a space inside a building'],
  'rent':['rent','v.','to pay to use a property'],
  'landlord':['ˈlændlɔːd','n.','a person who rents out property'],
  'bill':['bɪl','n.','an amount of money owed'],
  'pay':['peɪ','v.','to give money for something'],
  'save':['seɪv','v.','to keep money or use less'],
  'quiet':['ˈkwaɪət','adj.','making little noise'],
  'noisy':['ˈnɔɪzi','adj.','making a lot of noise'],
  'spacious':['ˈspeɪʃəs','adj.','large with plenty of space'],
  'cramped':['kræmpt','adj.','too small and crowded'],
  'comfortable':['ˈkʌmftəbl','adj.','pleasant and relaxing'],
  'convenient':['kənˈviːniənt','adj.','easy and suitable'],
  'remote':['rɪˈməʊt','adj.','far away from towns'],
  'facilities':['fəˈsɪlətiz','n.','buildings and equipment for a purpose'],
  'repair':['rɪˈpeə','v.','to fix something broken'],
  'research':['rɪˈsɜːtʃ','n.','careful study to find new information'],
  'data':['ˈdeɪtə','n.','facts and figures'],
  'method':['ˈmeθəd','n.','a way of doing something'],
  'experiment':['ɪkˈsperɪmənt','n.','a scientific test'],
  'result':['rɪˈzʌlt','n.','what happens at the end'],
  'cause':['kɔːz','v.','to make something happen'],
  'effect':['ɪˈfekt','n.','a change caused by something'],
  'example':['ɪɡˈzɑːmpl','n.','one item that shows a type'],
  'reason':['ˈriːzn','n.','why something happens'],
  'suggest':['səˈdʒest','v.','to show or imply'],
  'prove':['pruːv','v.','to show that something is true'],
  'examine':['ɪɡˈzæmɪn','v.','to look at something carefully'],
  'measure':['ˈmeʒə','v.','to find the size or amount'],
  'compare':['kəmˈpeə','v.','to look at how things are alike or different'],
  'similar':['ˈsɪmələ','adj.','alike in some way'],
  'conclusion':['kənˈkluːʒn','n.','a final decision or opinion'],
  'price':['praɪs','n.','the amount of money needed to buy something'],
  'discount':['ˈdɪskaʊnt','n.','a reduction in price'],
  'refund':['ˈriːfʌnd','n.','money given back'],
  'receipt':['rɪˈsiːt','n.','a document showing payment'],
  'available':['əˈveɪləbl','adj.','able to be obtained'],
  'unavailable':['ˌʌnəˈveɪləbl','adj.','not able to be obtained'],
  'offer':['ˈɒfə','v.','to provide something'],
  'customer':['ˈkʌstəmə','n.','a person who buys something'],
  'queue':['kjuː','n.','a line of people waiting'],
  'popular':['ˈpɒpjələ','adj.','liked by many people'],
  'trendy':['ˈtrendi','adj.','fashionable and modern'],
  'bargain':['ˈbɑːɡɪn','n.','something bought at a good price'],
  'delivery':['dɪˈlɪvəri','n.','the bringing of goods'],
  'quality':['ˈkwɒləti','n.','how good something is'],
  'guarantee':['ˌɡærənˈtiː','n.','a promise to repair or replace'],
  'afford':['əˈfɔːd','v.','to have enough money for'],
  'happy':['ˈhæpi','adj.','feeling pleasure'],
  'sad':['sæd','adj.','feeling unhappiness'],
  'angry':['ˈæŋɡri','adj.','feeling strong displeasure'],
  'worried':['ˈwʌrid','adj.','feeling anxious'],
  'surprised':['səˈpraɪzd','adj.','feeling sudden wonder'],
  'confused':['kənˈfjuːzd','adj.','unable to understand clearly'],
  'interested':['ˈɪntrəstɪd','adj.','wanting to know or learn'],
  'bored':['bɔːd','adj.','feeling uninterested'],
  'excited':['ɪkˈsaɪtɪd','adj.','feeling very keen and happy'],
  'afraid':['əˈfreɪd','adj.','feeling fear'],
  'grateful':['ˈɡreɪtfl','adj.','feeling thanks'],
  'confident':['ˈkɒnfɪdənt','adj.','feeling sure of oneself'],
  'doubtful':['ˈdaʊtfl','adj.','not sure'],
  'prefer':['prɪˈfɜː','v.','to like one thing more than another'],
  'agree':['əˈɡriː','v.','to have the same opinion'],
  'disagree':['ˌdɪsəˈɡriː','v.','to have a different opinion'],
  'refuse':['rɪˈfjuːz','v.','to say no to something']
};

/* ===UTIL=== *//* ================= 工具函数 ================= */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const DEFAULT_GOAL = 30;
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
function defaultState(){ return { stats:{}, daily:{date:'',count:0}, streak:0, lastDate:'', wordbook:[], goal:DEFAULT_GOAL, checkins:[], settings:defaultSettings() }; }
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
  el.textContent = '🔥 连续打卡 ' + checkinStreak() + ' 天 · 今日 ' + state.daily.count + '/' + (state.goal||DEFAULT_GOAL) + ' 词';
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
$('#flash-back').addEventListener('click', ()=>{ $('#flash-end').classList.add('hidden'); $('#flash-game').classList.add('hidden'); $('#flash-card').classList.remove('flipped'); });
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
    prac.wrongs.push({w:q.w, c:q.cn, s:q.s, e:q.e, k:q.k, your:chosen, correct:q.correct});
  }
  const fb = $('#feedback');
  let html;
  if(ok){
    html = '✅ 正确！<b>'+escapeHtml(q.correct)+'</b> 是 '+escapeHtml(q.w)+'（'+escapeHtml(q.cn)+'）的同义词。';
  }else{
    html = '❌ 正确答案是 <b>'+escapeHtml(q.correct)+'</b>（'+escapeHtml(q.correct)+' = '+escapeHtml(q.w)+' '+escapeHtml(q.cn)+'）。';
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
      '<div class="wrong-item"><div><b>'+escapeHtml(it.w)+'</b> <span class="wc">'+escapeHtml(it.c)+'</span></div>'+
      '<div>你选 <span class="wa">'+escapeHtml(it.your)+'</span> → 正确 <span class="wb">'+escapeHtml(it.correct)+'</span></div></div>').join('');
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
  const goal = state.goal || DEFAULT_GOAL;
  $('#stat-cards').innerHTML = [
    ['🎯','今日练习', today+' / '+goal],
    ['📝','累计题目', totalSeen],
    ['✅','正确率', acc+'%'],
    ['🏅','已掌握', mastered+' 词'],
    ['📚','生词本', state.wordbook.length+' 词'],
    ['🗓️','累计打卡', (state.checkins||[]).length+' 天'],
    ['🔥','连续打卡', checkinStreak()+' 天']
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








/* ================= v2: 单词详情弹窗 ================= */
function dictOf(w){ return Object.prototype.hasOwnProperty.call(DICT, w) ? DICT[w] : null; }
function openWordDetail(word){
  const entry = WORDS.find(x=>x.w===word) || null;
  const d = dictOf(word);
  const w = word;
  const ipa = (d && d[0]) || (entry && entry.p) || '';
  const pos = (d && d[1]) || (entry && entry.pos) || '';
  const def = (d && d[2]) || (entry && entry.d) || '';
  const cn = entry ? entry.c : (d && d[3] ? d[3] : '');
  $('#wm-word-head').innerHTML =
    '<div class="wm-w">'+escapeHtml(w)+'</div>'+
    (ipa?'<span class="wm-ipa">'+escapeHtml(ipa)+'</span>':'')+
    (pos?'<span class="wm-pos">'+escapeHtml(pos)+'</span>':'')+
    '<button class="icon-btn wm-speak" data-speak="'+escapeHtml(w)+'">🔊 发音</button>';
  let synChips = '';
  if(entry){
    synChips = entry.s.map(s=>{
      const has = !!dictOf(s);
      return '<button class="syn-chip'+(has?' linkable':'')+'" data-w="'+escapeHtml(s)+'" data-speak="'+escapeHtml(s)+'">'+escapeHtml(s)+(has?' 📖':'')+'</button>';
    }).join('');
  }
  let html = '';
  if(cn) html += '<div class="wm-sec"><div class="wm-sec-t">中文释义</div><div class="wm-cn">'+escapeHtml(cn)+'</div></div>';
  if(def) html += '<div class="wm-sec"><div class="wm-sec-t">英文释义</div><div class="wm-def">'+escapeHtml(def)+'</div></div>';
  if(entry && entry.s.length) html += '<div class="wm-sec"><div class="wm-sec-t">同义替换（点击发音 · 📖 可看详情）</div><div class="wm-syns">'+synChips+'</div></div>';
  if(entry) html += '<div class="wm-sec"><div class="wm-sec-t">例句（听力语境）</div><p class="wc-ex">'+highlight(entry.e, entry.k)+'</p></div>';
  if(entry) html += '<div class="wm-meta">'+topicName(entry.t)+'</div>';
  $('#wm-body').innerHTML = html;
  const wbBtn = $('#wm-wb');
  wbBtn.dataset.w = w;
  wbBtn.textContent = state.wordbook.includes(w) ? '★ 已在生词本' : '☆ 加入生词本';
  $('#word-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeWordDetail(){ $('#word-modal').classList.add('hidden'); document.body.style.overflow = ''; }
$('#wm-close').addEventListener('click', closeWordDetail);
$('#wm-ok').addEventListener('click', closeWordDetail);
$('#word-modal').addEventListener('click', e=>{ if(e.target.id==='word-modal') closeWordDetail(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeWordDetail(); });
$('#wm-word-head').addEventListener('click', e=>{ const t=e.target.closest('[data-speak]'); if(t) speak(t.dataset.speak); });
$('#wm-body').addEventListener('click', e=>{
  const chip = e.target.closest('[data-w]');
  if(chip){ const cw=chip.dataset.w; if(dictOf(cw)){ openWordDetail(cw); } else { speak(cw); } return; }
  const t = e.target.closest('[data-speak]');
  if(t) speak(t.dataset.speak);
});
$('#wm-wb').addEventListener('click', ()=>{
  const w = $('#wm-wb').dataset.w; if(!w) return;
  if(state.wordbook.includes(w)){ state.wordbook = state.wordbook.filter(x=>x!==w); toast('已从生词本移除'); }
  else { state.wordbook.push(w); toast('已加入生词本'); }
  saveState(); renderStats();
  $('#wm-wb').textContent = state.wordbook.includes(w) ? '★ 已在生词本' : '☆ 加入生词本';
});

/* ================= v2: 词库卡片整卡可点 ================= */
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
    const syn = w.s.map(s=>'<button class="syn-chip'+(dictOf(s)?' linkable':'')+'" data-w="'+escapeHtml(s)+'" data-speak="'+escapeHtml(s)+'">'+escapeHtml(s)+(dictOf(s)?' 📖':'')+'</button>').join('');
    const m = isMastered(w.w) ? '<span class="done">✅ 已掌握</span>' : '';
    return '<div class="word-card clickable" data-w="'+escapeHtml(w.w)+'">'+
      '<div class="wc-top"><div><div class="wc-word">'+escapeHtml(w.w)+'</div><div class="wc-cn">'+escapeHtml(w.c)+'</div></div>'+
      '<button class="icon-btn" data-speak="'+escapeHtml(w.w)+'">🔊</button></div>'+
      '<div class="wc-syn">'+syn+'</div>'+
      '<p class="wc-ex">'+highlight(w.e, w.k)+'</p>'+
      '<div class="wc-meta"><span>'+topicName(w.t)+'</span>'+m+'<span class="wc-detail-hint">📖 点击卡片查看详情</span></div>'+
    '</div>';
  }).join('');
}
$('#learn-list').addEventListener('click', e=>{
  const chip = e.target.closest('.syn-chip[data-w]');
  if(chip){ const cw=chip.dataset.w; if(dictOf(cw)){ openWordDetail(cw); } else { speak(cw); } return; }
  const sp = e.target.closest('[data-speak]');
  if(sp) return;
  const card = e.target.closest('.word-card[data-w]');
  if(card) openWordDetail(card.dataset.w);
});

/* ================= v2: 生词本列表可点开详情 ================= */
$('#wordbook-list').addEventListener('click', e=>{
  if(e.target.closest('[data-rm]')) return;
  const item = e.target.closest('.wb-item');
  if(item){ const wd = item.querySelector('.wb-word'); if(wd) openWordDetail(wd.textContent.trim()); }
});

/* ================= v2: 闪卡背面加详情按钮 ================= */
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
    '<div class="f-ex">'+highlight(e.e, e.k)+'</div>'+
    '<button class="btn btn-ghost btn-sm f-detail" data-fw="'+escapeHtml(e.w)+'">📖 查看详情</button>';
  $('#flash-pos').textContent = '第 '+(flash.idx+1)+' / '+flash.list.length+' 张';
  $('#flash-count').textContent = '✓ '+flash.known+' · ✗ '+flash.unknown;
}
$('#flash-back').addEventListener('click', e=>{
  const d = e.target.closest('[data-fw]');
  if(d){ e.stopPropagation(); openWordDetail(d.dataset.fw); return; }
});

/* ================= v2: 进度备份（导出/导入） ================= */
function exportProgress(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  const d = new Date(), pad = n=>String(n).padStart(2,'0');
  a.href = URL.createObjectURL(blob);
  a.download = 'ielts-syn-backup-'+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 3000);
  toast('已导出进度备份 ✅');
}
function importProgress(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const obj = JSON.parse(reader.result);
      if(!obj || typeof obj!=='object' || !Array.isArray(obj.wordbook)) throw new Error('文件格式不正确');
      const s = defaultState();
      Object.keys(s).forEach(k=>{ if(obj[k]!==undefined) s[k]=obj[k]; });
      if(typeof s.daily!=='object' || s.daily===null) s.daily={date:'',count:0};
      if(typeof s.stats!=='object' || s.stats===null) s.stats={};
      state = s; saveState(); renderHeaderStats(); renderStats();
      toast('导入成功 ✅');
    }catch(err){ toast('导入失败：'+err.message); }
  };
  reader.readAsText(file);
}
(function(){
  const dz = document.querySelector('.danger-zone');
  if(!dz) return;
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px';
  wrap.innerHTML = '<button class="btn btn-ghost btn-sm" id="export-data">📤 导出进度备份</button>'+
    '<button class="btn btn-ghost btn-sm" id="import-data">📥 导入进度备份</button>'+
    '<input type="file" id="import-file" accept=".json,application/json" style="display:none">'+
    '<span style="font-size:12px;color:var(--muted)">换设备 / 清缓存前先导出，换好后导入即可恢复进度</span>';
  dz.prepend(wrap);
  $('#export-data').addEventListener('click', exportProgress);
  $('#import-data').addEventListener('click', ()=>$('#import-file').click());
  $('#import-file').addEventListener('change', e=>{ if(e.target.files && e.target.files[0]) importProgress(e.target.files[0]); e.target.value=''; });
})();

/* ================= v3: 每日目标 + 打卡系统 ================= */
function fmtDate(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function checkinStreak(){
  if(!Array.isArray(state.checkins)) state.checkins = [];
  const set = new Set(state.checkins);
  let d = new Date();
  if(!set.has(fmtDate(d))) d = new Date(Date.now()-864e5);
  let n = 0;
  while(set.has(fmtDate(d))){ n++; d = new Date(d.getTime()-864e5); }
  return n;
}
const CAL = { y:0, m:0 };
function setGoal(n){
  state.goal = n; saveState();
  renderCheckinPanel(); renderHeaderStats();
  toast('每日目标已设为 '+n+' 词');
}
function renderCheckinPanel(){
  if(!Array.isArray(state.checkins)) state.checkins = [];
  const goal = state.goal>0 ? state.goal : DEFAULT_GOAL;
  const today = state.daily.date===todayStr() ? state.daily.count : 0;
  const checked = state.checkins.includes(todayStr());
  const pct = Math.min(100, Math.round(today/goal*100));
  const pt = $('#goal-presets');
  if(pt) [...pt.children].forEach(b=>b.classList.toggle('active', parseInt(b.dataset.goal,10)===goal));
  const tEl = $('#checkin-today'); if(tEl) tEl.textContent = '今日进度：'+today+' / '+goal+' 词';
  const fEl = $('#goal-fill'); if(fEl) fEl.style.width = pct+'%';
  const mEl = $('#checkin-msg');
  if(mEl){
    if(checked) mEl.innerHTML = '✅ 今天已打卡';
    else if(today>=goal) mEl.innerHTML = '🎉 已达成今日目标，点击下方按钮打卡！';
    else mEl.innerHTML = '💪 还差 '+(goal-today)+' 词达成今日目标';
  }
  const bEl = $('#checkin-btn');
  if(bEl){ bEl.disabled = checked; bEl.textContent = checked ? '✅ 今日已打卡' : '✅ 今日打卡'; }
  renderCalendar(); renderCalFoot();
}
function renderCalFoot(){
  if(!Array.isArray(state.checkins)) state.checkins = [];
  const list = state.checkins;
  const ym = CAL.y+'-'+String(CAL.m+1).padStart(2,'0');
  const monthCount = list.filter(d=>d.indexOf(ym)===0).length;
  const el = $('#cal-foot');
  if(el) el.textContent = '本月打卡 '+monthCount+' 天 · 累计 '+list.length+' 天 · 连续 '+checkinStreak()+' 天';
}
function renderCalendar(){
  const grid = $('#cal-grid');
  const title = $('#cal-title');
  if(!grid || !title) return;
  title.textContent = CAL.y+'年'+(CAL.m+1)+'月';
  const first = new Date(CAL.y, CAL.m, 1);
  const daysInMonth = new Date(CAL.y, CAL.m+1, 0).getDate();
  const lead = (first.getDay()+6)%7;
  const set = new Set(state.checkins||[]);
  const today = todayStr();
  let cells = '<div class="cal-dow">一</div><div class="cal-dow">二</div><div class="cal-dow">三</div><div class="cal-dow">四</div><div class="cal-dow">五</div><div class="cal-dow">六</div><div class="cal-dow">日</div>';
  for(let i=0;i<lead;i++) cells += '<div class="cal-cell empty"></div>';
  for(let d=1;d<=daysInMonth;d++){
    const ds = CAL.y+'-'+String(CAL.m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const cls = ['cal-cell'];
    if(set.has(ds)) cls.push('checked');
    if(ds===today) cls.push('today');
    if(ds>today) cls.push('future');
    cells += '<div class="'+cls.join(' ')+'" data-day="'+ds+'">'+d+'</div>';
  }
  grid.innerHTML = cells;
}
(function initCheckin(){
  const view = $('#view-stats');
  if(!view) return;
  const now = new Date();
  CAL.y = now.getFullYear(); CAL.m = now.getMonth();
  const panel = document.createElement('div');
  panel.className = 'panel checkin-panel';
  panel.id = 'checkin-panel';
  panel.innerHTML =
    '<h3>🗓️ 每日打卡 <span style="font-weight:400;color:var(--muted)">完成今日目标后打卡，坚持就是胜利</span></h3>'+
    '<div class="checkin-top">'+
      '<div class="goal-box">'+
        '<div class="goal-label">每日目标</div>'+
        '<div class="goal-presets" id="goal-presets">'+
          [10,20,30,50].map(n=>'<button class="btn btn-ghost btn-sm" data-goal="'+n+'">'+n+' 词</button>').join('')+
        '</div>'+
        '<div class="goal-custom"><input id="goal-input" type="number" min="1" max="500" placeholder="自定义">'+
        '<button class="btn btn-primary btn-sm" id="goal-save">保存</button></div>'+
      '</div>'+
      '<div class="checkin-now">'+
        '<div class="checkin-today" id="checkin-today"></div>'+
        '<div class="goal-bar"><div class="fill" id="goal-fill"></div></div>'+
        '<div class="checkin-msg" id="checkin-msg"></div>'+
        '<button class="btn btn-primary" id="checkin-btn">✅ 今日打卡</button>'+
      '</div>'+
    '</div>'+
    '<div class="calendar">'+
      '<div class="cal-head"><button class="btn btn-ghost btn-sm" id="cal-prev">‹ 上月</button>'+
      '<span class="cal-title" id="cal-title"></span>'+
      '<button class="btn btn-ghost btn-sm" id="cal-next">下月 ›</button></div>'+
      '<div class="cal-grid" id="cal-grid"></div>'+
      '<div class="cal-foot" id="cal-foot"></div>'+
    '</div>';
  view.insertBefore(panel, view.firstChild);
  $('#goal-presets').addEventListener('click', e=>{
    const b = e.target.closest('[data-goal]');
    if(b) setGoal(parseInt(b.dataset.goal,10));
  });
  $('#goal-save').addEventListener('click', ()=>{
    const v = parseInt($('#goal-input').value,10);
    if(!v || isNaN(v)){ toast('请输入 1~500 之间的数字'); return; }
    setGoal(Math.max(1, Math.min(500, v)));
    $('#goal-input').value = '';
  });
  $('#goal-input').addEventListener('keydown', e=>{ if(e.key==='Enter') $('#goal-save').click(); });
  $('#checkin-btn').addEventListener('click', ()=>{
    if(!Array.isArray(state.checkins)) state.checkins = [];
    if(state.checkins.includes(todayStr())) return;
    state.checkins.push(todayStr());
    saveState(); renderCheckinPanel(); renderHeaderStats();
    toast('🎉 打卡成功！连续 '+checkinStreak()+' 天');
  });
  $('#cal-prev').addEventListener('click', ()=>{ CAL.m--; if(CAL.m<0){ CAL.m=11; CAL.y--; } renderCalendar(); renderCalFoot(); });
  $('#cal-next').addEventListener('click', ()=>{ CAL.m++; if(CAL.m>11){ CAL.m=0; CAL.y++; } renderCalendar(); renderCalFoot(); });
  renderCheckinPanel();
})();
const _rsV3 = renderStats;
renderStats = function(){ _rsV3(); renderCheckinPanel(); };


/* ================= v4: 设置 + 专区 + 新模式 ================= */
function defaultSettings(){ return { voice:'auto', rate:0.85, theme:'light', font:'m', pCount:10, pDir:'forward' }; }
function sett(){ if(!state.settings || typeof state.settings!=='object') state.settings = defaultSettings(); return state.settings; }
function saveSett(patch){ state.settings = Object.assign(sett(), patch||{}); saveState(); applyAppearance(); renderSettings(); }
function applyAppearance(){
  const s = sett();
  const root = document.documentElement;
  const apply = ()=>{ root.dataset.theme = (s.theme==='auto') ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : s.theme; };
  apply();
  if(s.theme==='auto'){
    if(!applyAppearance._mq){ applyAppearance._mq = window.matchMedia('(prefers-color-scheme: dark)'); applyAppearance._mq.addEventListener('change', apply); }
  }
  root.dataset.font = s.font || 'm';
}
function renderSettings(){
  const s = sett();
  const gp = $('#set-goal-presets');
  if(gp) gp.innerHTML = [10,20,30,50].map(n=>'<button class="btn btn-ghost btn-sm'+(state.goal===n?' active':'')+'" data-goal="'+n+'">'+n+' 词</button>').join('');
  const vr = $('#set-voice');
  if(vr) vr.innerHTML = [['auto','自动（英音优先）'],['uk','🇬🇧 英音'],['us','🇺🇸 美音']].map(o=>'<button class="chip'+(s.voice===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const rt = $('#set-rate');
  if(rt) rt.innerHTML = [['0.7','🐢 慢速'],['0.85','🙂 正常'],['1.0','🚀 快速']].map(o=>'<button class="chip'+(String(s.rate)===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const pc = $('#set-pcount');
  if(pc) pc.innerHTML = [5,10,15,20].map(n=>'<button class="chip'+(s.pCount===n?' on':'')+'" data-v="'+n+'">'+n+' 题</button>').join('');
  const pd = $('#set-pdir');
  if(pd) pd.innerHTML = [['forward','正向'],['reverse','反向'],['mixed','混合']].map(o=>'<button class="chip'+(s.pDir===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const th = $('#set-theme');
  if(th) th.innerHTML = [['light','☀️ 浅色'],['dark','🌙 深色'],['auto','🔄 跟随系统']].map(o=>'<button class="chip'+(s.theme===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const ft = $('#set-font');
  if(ft) ft.innerHTML = [['s','小号'],['m','中号'],['l','大号']].map(o=>'<button class="chip'+(s.font===o[0]?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('');
  const ab = $('#set-about');
  if(ab){
    const zl = WORDS.filter(w=>w.z==='l').length, zw = WORDS.filter(w=>w.z==='w').length;
    ab.innerHTML = '📚 词库共 <b>'+WORDS.length+'</b> 词（🎧 听力 '+zl+' · ✍️ 书写 '+zw+'）· 版本 v4.0<br>🎧 听力专区：听录音抓同义替换、听写拼写、听音选义，对应雅思听力场景。<br>✍️ 书写专区：写作 Task 1 图表词汇与 Task 2 论证词汇，对应雅思写作高频表达。<br>💾 数据只存本机浏览器，导出备份文件可迁移到其他设备。';
  }
}
function applyPracticePrefs(){
  const s = sett();
  pCount = s.pCount || 10;
  pDir = s.pDir || 'forward';
  $$('#p-counts .chip').forEach(b=>b.classList.toggle('on', +b.dataset.n===pCount));
  $$('#p-dirs .chip').forEach(b=>b.classList.toggle('on', b.dataset.dir===pDir));
}
function bindSettingsEvents(){
  const on = (sel, fn)=>{ const el = $(sel); if(el) el.addEventListener('click', fn); };
  on('#set-goal-presets', e=>{ const b=e.target.closest('[data-goal]'); if(b){ setGoal(parseInt(b.dataset.goal,10)); renderSettings(); } });
  on('#set-goal-save', ()=>{ const v=parseInt($('#set-goal-input').value,10); if(!v||isNaN(v)){ toast('请输入 1~500 之间的数字'); return; } setGoal(Math.max(1,Math.min(500,v))); $('#set-goal-input').value=''; renderSettings(); });
  const gi = $('#set-goal-input'); if(gi) gi.addEventListener('keydown', e=>{ if(e.key==='Enter') $('#set-goal-save').click(); });
  on('#set-voice', e=>{ const b=e.target.closest('[data-v]'); if(b) saveSett({voice:b.dataset.v}); });
  on('#set-rate', e=>{ const b=e.target.closest('[data-v]'); if(b) saveSett({rate:parseFloat(b.dataset.v)}); });
  on('#set-pcount', e=>{ const b=e.target.closest('[data-v]'); if(b){ saveSett({pCount:parseInt(b.dataset.v,10)}); applyPracticePrefs(); } });
  on('#set-pdir', e=>{ const b=e.target.closest('[data-v]'); if(b){ saveSett({pDir:b.dataset.v}); applyPracticePrefs(); } });
  on('#set-theme', e=>{ const b=e.target.closest('[data-v]'); if(b) saveSett({theme:b.dataset.v}); });
  on('#set-font', e=>{ const b=e.target.closest('[data-v]'); if(b) saveSett({font:b.dataset.v}); });
  on('#set-export', ()=>{ if(typeof exportProgress==='function') exportProgress(); });
  on('#set-import-btn', ()=>{ const f=$('#set-import-file'); if(f) f.click(); });
  const imp = $('#set-import-file');
  if(imp) imp.addEventListener('change', e=>{ if(e.target.files && e.target.files[0] && typeof importProgress==='function') importProgress(e.target.files[0]); e.target.value=''; });
  on('#set-reset', ()=>{ if(confirm('确定要清空所有学习数据和设置吗？此操作不可恢复。')){ state = defaultState(); saveState(); renderHeaderStats(); renderStats(); renderSettings(); applyAppearance(); applyPracticePrefs(); toast('已重置全部数据'); } });
}
/* ---- 语音设置：口音 + 语速 ---- */
speak = function(text, rate){
  const s = sett();
  const acc = s.voice || 'auto';
  const r = (typeof rate==='number') ? rate : (s.rate || 0.85);
  if(!('speechSynthesis' in window)){ toast('当前浏览器不支持语音合成，请使用 Chrome / Edge'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  let v = null;
  if(acc==='us') v = voices.find(x=>x.lang==='en-US') || voices.find(x=>x.lang && x.lang.startsWith('en'));
  else v = voices.find(x=>x.lang==='en-GB') || voices.find(x=>x.lang && x.lang.startsWith('en'));
  if(v) u.voice = v;
  u.lang = (v && v.lang) || (acc==='us' ? 'en-US' : 'en-GB');
  u.rate = r;
  speechSynthesis.speak(u);
};/* ---- 专区过滤：听力 / 书写 ---- */
let learnZone='all', flashZone='all', pZone='all';
function zoneChips(active){
  const cnt = z => z==='all' ? WORDS.length : WORDS.filter(w=>w.z===z).length;
  return [['all','📚 全部',cnt('all')],['l','🎧 听力词汇',cnt('l')],['w','✍️ 书写词汇',cnt('w')]].map(x=>
    '<button class="chip'+(active===x[0]?' on':'')+'" data-z="'+x[0]+'">'+x[1]+' <i>'+x[2]+'</i></button>').join('');
}
const _v4lp = learnPool;
learnPool = function(){
  let list = _v4lp();
  if(learnZone!=='all') list = list.filter(w=>w.z===learnZone);
  return list;
};
const _v4rl = renderLearn;
renderLearn = function(){
  _v4rl();
  const el = $('#learn-zones'); if(!el) return;
  el.innerHTML = zoneChips(learnZone);
  el.onclick = e=>{ const b=e.target.closest('[data-z]'); if(b){ learnZone=b.dataset.z; renderLearn(); } };
};
const _v4rfs = renderFlashSetup;
renderFlashSetup = function(){
  _v4rfs();
  const el = $('#flash-zones'); if(!el) return;
  el.innerHTML = zoneChips(flashZone);
  el.onclick = e=>{ const b=e.target.closest('[data-z]'); if(b){ flashZone=b.dataset.z; renderFlashSetup(); } };
};
const _v4sf = startFlash;
startFlash = function(){
  let pool = flashTopic==='all' ? WORDS : WORDS.filter(w=>w.t===flashTopic);
  if(flashZone!=='all') pool = pool.filter(w=>w.z===flashZone);
  if(pool.length < 2){ toast('该范围词太少，无法开始'); return; }
  flash = {list:shuffle(pool), idx:0, known:0, unknown:0};
  $('#flash-end').classList.add('hidden');
  $('#flash-game').classList.remove('hidden');
  renderFlashCard();
};
const _v4rps = renderPracticeSetup;
renderPracticeSetup = function(){
  _v4rps();
  const el = $('#p-zones'); if(!el) return;
  el.innerHTML = zoneChips(pZone);
  el.onclick = e=>{ const b=e.target.closest('[data-z]'); if(b){ pZone=b.dataset.z; renderPracticeSetup(); } };
};
const _v4pp = practicePool;
practicePool = function(){
  let list = _v4pp();
  if(pZone!=='all') list = list.filter(w=>w.z===pZone);
  return list;
};
/* ---- 新练习模式：听写 / 看词选义 / 听音选义 ---- */
const _v4rq = renderQuestion;
renderQuestion = function(){
  prac.answered = false;
  renderQuizTop();
  const q = prac.queue[prac.idx];
  if(prac.type==='dict'){ renderDict(q); return; }
  if(prac.type==='word2cn'){ renderW2C(q); return; }
  if(prac.type==='l2cn'){ renderL2C(q); return; }
  _v4rq();
};
function distractorCn(entry, n){
  const others = shuffle(WORDS.filter(x=>x.w!==entry.w));
  const out = [];
  for(const o of others){ if(!out.includes(o.c)){ out.push(o.c); if(out.length>=n) return out; } }
  return out;
}
function renderDict(q){
  prac.q = {type:'dict', w:q.w, cn:q.c, e:q.e, k:q.k, correct:q.w};
  $('#quiz-body').innerHTML =
    '<div class="q-card">'+
      '<div class="listen-row"><button class="listen-btn" id="play-btn">🔊 播放单词</button>'+
      '<button class="icon-btn" id="replay-btn" title="再听一遍">🔁 再听一遍</button></div>'+
      '<div class="q-prompt">听发音，在下方输入你听到的单词（可反复重听）</div>'+
      '<div class="dict-row"><input id="dict-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="输入单词…">'+
      '<button class="btn btn-primary" id="dict-check">✓ 检查</button></div>'+
      '<div class="feedback" id="feedback"></div>'+
      '<div class="next-row hidden" id="next-row"><button class="btn btn-primary btn-sm" id="next-btn">下一题 →</button></div>'+
    '</div>';
  const play = ()=>{ speak(q.w); const b=$('#play-btn'); if(b){ b.classList.add('playing'); setTimeout(()=>b.classList.remove('playing'), 1600); } };
  $('#play-btn').addEventListener('click', play);
  $('#replay-btn').addEventListener('click', play);
  setTimeout(play, 400);
  $('#dict-check').addEventListener('click', checkDict);
  $('#dict-input').addEventListener('keydown', e=>{ if(e.key==='Enter') checkDict(); });
  const inp = $('#dict-input'); if(inp) inp.focus();
  $('#next-btn').addEventListener('click', nextQuestion);
}
function checkDict(){
  if(prac.answered) return;
  prac.answered = true;
  const q = prac.q;
  const typed = ($('#dict-input').value || '').trim().toLowerCase().replace(/[^a-z'-]/g,'');
  const ok = typed === q.w.toLowerCase();
  if(ok) prac.score++;
  recordAnswer(q.w, ok);
  if(!ok){
    addWordbook(q.w);
    prac.wrongs.push({w:q.w, c:q.c, s:q.s, e:q.e, k:q.k, your:typed||'（未输入）', correct:q.w});
  }
  const fb = $('#feedback');
  fb.innerHTML = ok ? '✅ 拼写正确！' : '❌ 正确答案是 <b>'+escapeHtml(q.w)+'</b>（'+escapeHtml(q.c)+'）';
  fb.className = 'feedback show '+(ok?'ok':'bad');
  const inp = $('#dict-input'); if(inp) inp.disabled = true;
  const cb = $('#dict-check'); if(cb) cb.disabled = true;
  $('#next-row').classList.remove('hidden');
  $('#quiz-score').textContent = prac.score;
}
function renderW2C(q){
  const opts = shuffle([q.c].concat(distractorCn(q,3)));
  prac.q = {type:'w2c', correct:q.c, opts, w:q.w, cn:q.c, e:q.e, k:q.k};
  $('#quiz-body').innerHTML =
    '<div class="q-card">'+
      '<div class="q-word">'+escapeHtml(q.w)+' <button class="icon-btn" id="speak-word">🔊</button></div>'+
      '<div class="q-prompt">看单词，选出正确的中文释义</div>'+
      '<div class="options">'+opts.map((o,i)=>'<button class="opt" data-opt="'+escapeHtml(o)+'"><span class="k">'+(i+1)+'</span>'+escapeHtml(o)+'</button>').join('')+'</div>'+
      '<div class="feedback" id="feedback"></div>'+
      '<div class="next-row hidden" id="next-row"><button class="btn btn-primary btn-sm" id="next-btn">下一题 →</button></div>'+
    '</div>';
  $('#speak-word').addEventListener('click', ()=>speak(q.w));
  bindOptionClicks();
  $('#next-btn').addEventListener('click', nextQuestion);
}
function renderL2C(q){
  const opts = shuffle([q.c].concat(distractorCn(q,3)));
  prac.q = {type:'l2cn', correct:q.c, opts, w:q.w, cn:q.c, e:q.e, k:q.k};
  $('#quiz-body').innerHTML =
    '<div class="q-card">'+
      '<div class="listen-row"><button class="listen-btn" id="play-btn">🔊 播放单词</button>'+
      '<button class="icon-btn" id="replay-btn" title="再听一遍">🔁 再听一遍</button></div>'+
      '<div class="q-prompt">听发音（不显示拼写），选出正确的中文释义</div>'+
      '<div class="options">'+opts.map((o,i)=>'<button class="opt" data-opt="'+escapeHtml(o)+'"><span class="k">'+(i+1)+'</span>'+escapeHtml(o)+'</button>').join('')+'</div>'+
      '<div class="feedback" id="feedback"></div>'+
      '<div class="next-row hidden" id="next-row"><button class="btn btn-primary btn-sm" id="next-btn">下一题 →</button></div>'+
    '</div>';
  const play = ()=>{ speak(q.w); const b=$('#play-btn'); if(b){ b.classList.add('playing'); setTimeout(()=>b.classList.remove('playing'), 1600); } };
  $('#play-btn').addEventListener('click', play);
  $('#replay-btn').addEventListener('click', play);
  setTimeout(play, 400);
  bindOptionClicks();
  $('#next-btn').addEventListener('click', nextQuestion);
}
const _v4ans = answer;
answer = function(btn){
  if(prac.type==='dict') return;
  if(prac.type==='w2c' || prac.type==='l2cn'){ v4AnswerCn(btn); return; }
  _v4ans(btn);
};
function v4AnswerCn(btn){
  if(prac.answered) return;
  prac.answered = true;
  const q = prac.q;
  const chosen = btn.dataset.opt;
  const ok = chosen === q.correct;
  $$('#quiz-body .opt').forEach(b=>{ b.disabled = true; if(b.dataset.opt===q.correct) b.classList.add('correct'); else if(b===btn) b.classList.add('wrong'); });
  if(ok) prac.score++;
  recordAnswer(q.w, ok);
  if(!ok){ addWordbook(q.w); prac.wrongs.push({w:q.w,c:q.c,s:q.s,e:q.e,k:q.k,your:chosen,correct:q.correct}); }
  const fb = $('#feedback');
  fb.innerHTML = ok ? '✅ 正确！<b>'+escapeHtml(q.correct)+'</b>' : '❌ 正确答案：<b>'+escapeHtml(q.correct)+'</b>（<b>'+escapeHtml(q.w)+'</b>）';
  fb.className = 'feedback show '+(ok?'ok':'bad');
  $('#next-row').classList.remove('hidden');
  $('#quiz-score').textContent = prac.score;
}
/* ---- v4 初始化 ---- */
const _v4sv = switchView;
switchView = function(name){
  _v4sv(name);
  if(name==='settings') renderSettings();
  if(name==='practice') applyPracticePrefs();
};
(function initV4(){
  const fsBtn = $('#flash-start');
  if(fsBtn){ const cl = fsBtn.cloneNode(true); fsBtn.parentNode.replaceChild(cl, fsBtn); cl.addEventListener('click', startFlash); }
  bindSettingsEvents();
  applyAppearance();
  renderSettings();
  applyPracticePrefs();
  renderLearn();
  renderFlashSetup();
  renderPracticeSetup();
  renderHeaderStats();
})();
