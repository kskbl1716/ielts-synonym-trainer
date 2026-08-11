'use strict';
/* V10 M10 写作 Task1 图表词清单（~300，含已在词库的词，用于打 b:['chart'] 标签）
   来源：本工具链按雅思写作 Task1 图表描述语言汇编（上升/下降/波动/占比/幅度/比较） */
const CHART_WORDS = [
  /* 上升 */
  'increase','rise','grow','climb','surge','soar','rocket','jump','escalate','double','triple','quadruple','upswing','upturn','upward','gain','expand','boost','improve','strengthen','widen','pick up','grow steadily','shoot up','skyrocket','improvement','growth','expansion',
  /* 下降 */
  'decrease','decline','fall','drop','reduce','dip','plunge','plummet','slump','slide','sink','shrink','diminish','halve','downtrend','downturn','downward','fall off','taper off','weaken','contract','reduction','fall sharply','level down',
  /* 波动 / 平稳 */
  'fluctuate','fluctuation','vary','volatile','peak','plateau','level off','remain stable','stay constant','stabilize','steady','constant','unchanged','flat','remain steady','even out',
  /* 极值 / 比较 */
  'reach a peak','bottom out','trough','outstrip','exceed','outperform','surpass','surpass','record high','record low',
  /* 占比 / 数据 */
  'proportion','percentage','ratio','fraction','a third','a quarter','half','majority','minority','account for','comprise','constitute','make up','stand at','amount to','roughly','approximately','exactly','one in five','two thirds',
  /* 幅度 / 程度 */
  'significant','substantial','considerable','modest','slight','marginal','marked','notable','dramatic','drastic','sharp','steep','gradual','rapid','slow','dramatically','substantially','slightly','markedly','considerably','gradually','rapidly','steeply','steadily',
  /* 趋势 / 比较 */
  'trend','tendency','overall','generally','upward trend','downward trend','compare','comparison','whereas','in contrast','similarly','likewise','differ','difference','rate','figure','data','graph','chart','bar chart','line graph','pie chart','table','diagram','period','over the period','during the period','annual','quarterly','monthly','yearly','decade','interval','average','median','range','total','peak point','lowest point',
  /* 时间 / 其他 */
  'at the beginning','at the end','throughout','overall trend','upward','downward','slightly','roughly','approximately',
  /* 扩充：更多描述语言 */
  'rise steadily','fall gradually','increase rapidly','decrease sharply','grow steadily','decline gradually','rise sharply','fall steadily','increase gradually','decrease gradually','fluctuate wildly','remain the same','show an upward trend','witness a sharp rise','experience a decline','undergo a change','reach its highest point','reach its lowest point','hit a record high','hit a record low','peak at','bottom out at','stand at around','amount to about','account for roughly','make up about','constitute around','comprise roughly','rise by','fall by','rise to','fall to','double to','triple to','half of','a quarter of','one-third','one-fifth','roughly half','about a third','just under','just over','slightly over','slightly under','nearly','almost','close to','well above','well below','far more','far less','much higher','much lower','significantly higher','significantly lower','comparatively','relatively','proportionally','in terms of','by comparison','on the contrary','conversely','however','nevertheless','despite','although','meanwhile','at the same time','in the first half','in the second half','in the early years','in the later years','over the whole period','throughout the period','for the first time','for the last time','beginning','ending','middle','interval','margin','gap','gap between','wider gap','narrower gap','overtake','edge ahead','lag behind','trail behind','catch up','draw level','close the gap','move ahead','fall behind',
  /* 扩充：更多名词/动词 */
  'upsurge','upswing','downturn','downtrend','uptick','downshift','spike','slump','dive','crash','collapse','surge to','plunge to','recover','rebound','rally','pick up again','take off','accelerate','decelerate','slow down','speed up','level out','stabilise','stabilize','equal','exceed','surpass','outnumber','outweigh','account','proportion of','percentage of','share','slice','segment','portion','chunk','bulk','major part','minor part','large proportion','small proportion','considerable amount','tiny amount','steady rise','sharp drop','gradual increase','marked decrease','modest growth','slight dip','rapid growth','slow decline'
];
module.exports = { CHART_WORDS };
