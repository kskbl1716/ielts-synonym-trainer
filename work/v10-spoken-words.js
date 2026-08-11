'use strict';
/* V10 M8 雅思口语话题词汇清单（Part1 生活 / Part2 人·地·物·事 / Part3 观点）
   用途：给站点已有词打 b:['spoken'] 标签（仿 AWL/band9 模式）；缺失词由 v10-spoken-add.js 补齐。
   来源：本工具链按雅思口语高频话题汇编（12 大话题：人物/家庭/地点/住所/工作/爱好/出行/餐饮/健康/科技/环境/消费/情感） */
const SPOKEN_WORDS = [
  /* 人物 / 家庭 */
  'relative','sibling','cousin','nephew','niece','colleague','neighbour','classmate','childhood','upbringing','personality','outgoing','generous','humorous','reliable','patient','easy-going','thoughtful','caring','determined',
  /* 地点 / 家乡 */
  'hometown','countryside','suburb','downtown','landmark','scenery','coastal','historic','peaceful','famous','ancient','modern','beautiful','quiet',
  /* 住所 */
  'apartment','accommodation','balcony','furniture','decoration','tenant','landlord','neighbourhood','spacious','cosy','tidy','comfortable','private','shared',
  /* 工作 / 学习 */
  'internship','part-time','deadline','workload','supervisor','profession','career','qualification','certificate','assignment','timetable','lecture','tutorial','seminar','scholarship','tuition','curriculum','training','employer',
  /* 爱好 / 活动 */
  'hobby','pastime','hiking','cycling','photography','painting','gardening','volunteer','camping','barbecue','swimming','dancing','cooking','drawing','collecting','craft','chess','concert','festival','picnic',
  /* 出行 / 旅行 */
  'itinerary','sightseeing','souvenir','backpack','scenic','excursion','destination','journey','tourist','guide','booking','luggage','passport','transport','commute','traffic','convenient','crowded','delay','ticket',
  /* 餐饮 / 食物 */
  'cuisine','appetiser','dessert','ingredient','spicy','savoury','reservation','dine','takeaway','delicious','tasty','fresh','healthy','snack','drink','breakfast','lunch','dinner','flavour','recipe',
  /* 健康 / 运动 */
  'exercise','fitness','routine','stamina','nutritious','insomnia','stress','recovery','symptom','treatment','diet','gym','muscle','energetic','relaxing','refreshing','sleepy','tired','lifestyle','wellbeing',
  /* 科技 / 通讯 */
  'gadget','smartphone','application','download','socialise','screen','keyboard','update','privacy','addiction','online','internet','browser','message','photo','game','website','digital','portable','wireless',
  /* 环境 / 自然 */
  'recycle','pollution','rubbish','plastic','organic','sustainable','greenhouse','conservation','climate','weather','rainy','sunny','windy','nature','animals','plants','forest','river','mountain','beach',
  /* 消费 / 购物 */
  'bargain','discount','refund','budget','receipt','purchase','brand','essential','luxury','shop','mall','price','expensive','cheap','affordable','quality','customer','service','advertisement','voucher',
  /* 情感 / 经历 */
  'memorable','unforgettable','fascinating','impressive','nervous','embarrassed','proud','relieved','frustrating','excited','disappointed','grateful','wonderful','amazing','enjoyable','boring','difficult','challenging','experience','achievement'
];
module.exports = { SPOKEN_WORDS };
