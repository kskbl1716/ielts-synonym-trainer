'use strict';
/* V10 词书定义（构建期校验 + 运行时注入页面）
   words 字段 = 计划目标词数（声明值，来自 V10-PLAN.md 第 1 节）；
   构建时与实际 b 计数不一致仅告警。页面显示的实际词数以运行时统计为准。
   zone: 'l' = 听力专区 / 'w' = 书写专区 / 'both' = 两专区通用 */
const BOOKS = [
  {id:'default',   name:'内置词库',     desc:'网站原有全部词',         icon:'📖', zone:'both', source:'自有',                          license:'自有',           words:2274},
  {id:'jianqiao',  name:'真题高频',     desc:'剑桥 4-19 真题高频词',    icon:'📚', zone:'both', source:'chunsi-w/ielts-vocab-cloudflare', license:'MIT',            words:500},
  {id:'listening', name:'听力拼写',     desc:'听力填空高频答案词',      icon:'🎧', zone:'l',    source:'yuqingsong71/IELTS-listening-vocabulary（剑桥 4-20 听力填空答案词）', license:'公开', words:800},
  {id:'zhenjing',  name:'雅思真经',     desc:'雅思真经核心词汇',        icon:'📗', zone:'both', source:'hefengxian/ielts-vocabulary',      license:'MIT',            words:1674},
  {id:'awl',       name:'学术词汇 AWL', desc:'学术词汇表（Coxhead）',   icon:'🎓', zone:'both', source:'Coxhead，惠灵顿维多利亚大学',      license:'开放教育免费使用', words:570},
  {id:'band9',     name:'Band 9 高分表达', desc:'高分替换表达',         icon:'🏅', zone:'both', source:'learning-zone/ielts-materials',    license:'MIT',            words:250},
  {id:'oxford',    name:'牛津基础词',   desc:'牛津 3000 基础词（非商用）', icon:'🇬🇧', zone:'both', source:'OUP Oxford 3000',                 license:'需署名 + 非商用', words:3000}
];
module.exports = { BOOKS };
