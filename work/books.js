'use strict';
/* V10 词书定义（构建期校验 + 运行时注入页面）
   words 字段 = 该书当前实际词数（M5 接入后校准；oxford 3000 为目标值，接入后校准）；
   构建时与实际 b 计数不一致仅告警。页面显示的实际词数以运行时统计为准。
   zone: 'l' = 听力专区 / 'w' = 书写专区 / 'both' = 两专区通用 */
const BOOKS = [
  {id:'default',   name:'内置词库',     desc:'网站原有全部词',         icon:'📖', zone:'both', source:'自有',                          license:'自有',           words:2274},
  {id:'jianqiao',  name:'真题高频',     desc:'剑桥 4-19 真题高频词',    icon:'📚', zone:'both', source:'chunsi-w/ielts-vocab-cloudflare', license:'MIT',            words:450},
  {id:'listening', name:'听力拼写',     desc:'听力填空高频答案词',      icon:'🎧', zone:'l',    source:'yuqingsong71/IELTS-listening-vocabulary（剑桥 4-20 听力填空答案词）', license:'公开仓库（无 LICENSE）· 事实性词表 + 本站原创加工', words:821},
  {id:'zhenjing',  name:'雅思真经',     desc:'雅思真经核心词汇',        icon:'📗', zone:'both', source:'hefengxian/ielts-vocabulary',      license:'MIT',            words:938},
  {id:'awl',       name:'学术词汇 AWL', desc:'学术词汇表（Coxhead）',   icon:'🎓', zone:'both', source:'Coxhead，惠灵顿维多利亚大学',      license:'开放教育免费使用', words:570},
  {id:'band9',     name:'Band 9 高分表达', desc:'高分替换表达',         icon:'🏅', zone:'both', source:'learning-zone/ielts-materials',    license:'MIT',            words:102},
  {id:'oxford',    name:'牛津基础词',   desc:'牛津 3000 基础词（非商用）', icon:'🇬🇧', zone:'both', source:'OUP Oxford 3000',                 license:'需署名 + 非商用', words:1000},
  {id:'nawl',      name:'NAWL 学术新词', desc:'非 AWL 的高频学术词',        icon:'🔬', zone:'both', source:'NAWL（Browne, Culligan & Phillips, newgeneralservicelist.org）', license:'开放学术词表（需署名）', words:950},
  {id:'spoken',    name:'口语话题词',     desc:'雅思口语 Part1-3 话题词汇',  icon:'🗣️', zone:'l',    source:'本工具链按雅思口语高频话题汇编',   license:'自有',           words:227},
  {id:'camb',      name:'剑桥18-20话题词', desc:'剑桥 18-20 真题高频话题词',  icon:'📕', zone:'both', source:'本工具链按剑桥 18-20 高频话题汇编（非抓取原文）', license:'自有', words:200}
];
module.exports = { BOOKS };
