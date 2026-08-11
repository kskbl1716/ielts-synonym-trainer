# 雅思同义词训练器 — 项目维护手册（Codex / Kimi Code 通用）

> 本文件由维护会话生成，用于在会话上下文丢失后快速恢复项目状态。
> 任何在此目录下工作的 Codex 或 Kimi Code 会话都会自动加载本文件。阅读顺序：先读本文件 → 再读 DEPLOY.md → 需要时看 work/_archive/ 里的历史脚本。

## 项目路径与使用方式
- 工作目录：`C:\Users\哈哈哈\Documents\Codex\2026-08-04\zu`
- 在 Codex 中把该目录添加为「项目」即可，本手册会自动加载，无需其他配置
- 项目一句话：雅思听力同义替换词训练网站。单文件静态站（无框架、无构建链），词库 + 闪卡 + 听写/选择/配对/听力练习 + 统计 + 生词本 + 邮箱登录云同步 + 意见反馈

## 线上地址（GitHub Pages 为主，Vercel 备用，推送后自动同步）
- 主：https://kskbl1716.github.io/ielts-synonym-trainer/（国内可用）
- 备：https://ielts-trainer-liard.vercel.app/（海外/香港节点，国内网络可能超时属正常）
- 仓库：https://github.com/kskbl1716/ielts-synonym-trainer.git（默认分支 main）
- 当前线上状态：**v10.0 全部完成，已推送上线**（2026-08-08）：词库 **5622 词**（听力 4109 / 书写 1513）；7 本词书全部接入：default 2274 / listening 821 / jianqiao 450 / zhenjing 938 / awl 570（78 新 + 492 标记）/ band9 102（61 新 + 41 标记）/ oxford 1000；功能层（词书系统/背诵模式/哈希路由）M1~M4 已推送上线；M5 词条（+3348）已推送上线
- 下一步：见 `V10-PLAN.md`（状态已更新为「功能与词书全部完成，已推送上线」）；发布/回滚资料见 `V9-RELEASE.md`、`V9-PLAN.md`

## GitHub 令牌与推送机制（重要）
- 令牌在**系统用户级环境变量 GH_TOKEN**（40 位经典 token，owner=kskbl1716）；Codex 全局配置 `~/.codex/config.toml` 里也有备份
- **GitHub 主域被墙**：不要用普通 `git push`/`git pull`（会超时）；一律用 `node work/push-gh.js`，它走 api.github.com
- push-gh.js 机制：读取 `work/.push-filelist.txt` 的文件清单 → 逐文件 base64 上传 blob → 基于远程 HEAD 建新 tree/commit（消息固定 "Add full source: IELTS synonym trainer (work source, outputs, DEPLOY)"）→ 更新 main
- ⚠️ push-gh.js 只会新增/更新清单内文件，**不会删除**远程上清单外的文件；修改清单后重推即可
- ⚠️ 本地 git 历史与远程**不是同一条链**：本地是维护记录，远程是 push-gh.js API 建的独立提交链。内容同步但历史无关，**不要做 git pull/merge**，本地 git 只用来提交和留痕

## 目录结构与职责
- `outputs/index.html`：**构建产物 + v1 基础模板**。v1 的 HTML/JS 只存在于这个文件里（work/ 没有独立的基础 HTML 源码）。改基础页面/基础 JS → 直接改这里，再跑构建。
- `index.html`（仓库根）：部署用的副本，**构建后复制 outputs/index.html 覆盖它**，再提交推送。
- `work/build.js`：构建脚本（幂等）。作用：清理上次注入 → 用 work/app.js + 各词库文件重写 WORDS 数组 → 注入 DICT、features.css、modal.html、features.js、cloud.js。
- `work/app.js`：v1 页面 JS 快照，build.js 只从中提取**原始 173 词**（改 app.js 不影响构建出的词库，只影响词条提取）。
- 词库文件：`work/dict-data.js`（DICT 音标表 + NEW）、`work/v4-words.js`、`work/v5-words.js`（汇总 v5-a~f）、`work/v6-words.js`、`work/v7-words.js`（532 词，已接入 build.js）、`work/v8-words.js`（400 词，已接入 build.js）。
- V10 词书系统：`work/books.js`（BOOKS 词书定义，build.js 注入页面并校验 `b` 字段 id）；词条 `b` 字段 = 词书 id 数组（一词多书、库里只有一条数据；老词 b=['default']，新书词不含 default）。M5 新词批次建议命名为 `work/v10-book-*.js`，接入 build.js 前先跑 validate 脚本。
- V10 专项测试：`work/e2e-v10-m2.js`（词书 UI 18 项）、`work/e2e-v10-m3.js`（背诵模式 15 项）、`work/e2e-v10-m4.js`（哈希路由 14 项）、`work/shot-v10-m2/m3/m4.js`（截图，Node WebSocket 版 CDP，无需 ps1 BOM 坑）。
- 功能注入源：`work/features.js`（详情弹窗/备份/字号/反馈/空状态清除按钮等）、`work/features.css`、`work/modal.html`、`work/cloud.js`（Supabase 登录+云同步）。
- 推送与校验：`work/push-gh.js`、`work/validate-v7.js`（v7 批次校验，已入库）、`work/validate-v8.js`（v8 批次校验，加 v9 词时把其中 V8NEW 换成新批次源）、`work/.push-filelist.txt`（推送清单，被 gitignore）、`work/.existing-words.txt`（当前 2274 词去重基准）。
- 部署：`.github/workflows/pages.yml`（GitHub Pages 部署 workflow，push 到 main 自动部署静态文件，已在推送清单）。⚠️ 2026-08-07 legacy Jekyll 构建服务故障（连旧内容也报 Page build failed），已迁移到 Actions 部署，勿改回 legacy。
- 测试：`work/e2e-*.ps1`（Chrome CDP + 本地服务器 8000 + 调试端口 9223）、`work/shot-*.ps1`（截图验证）、`work/mock-supa.js`（登录 mock）。
- `work/_archive/`：历史一次性脚本/旧版本文件归档处（不参与构建、不在推送清单）。
- `DEPLOY.md`：部署与 Supabase 配置说明。

## 词条数据格式
```js
{t:'主题id', w:'单词', s:['同义词','…'], c:'中文释义', e:'例句', k:'例句中的同义词(需出现在e里)', p:'音标', pos:'词性', d:'英文释义', z:'专区'}
```
- 专区 z：`'l'` = 听力专区，`'w'` = 书写专区。
- 页面 TOPICS 只有 10 个（定义在基础 JS）：core 高频通用 / edu 教育学习 / work 工作职场 / travel 旅行交通 / health 健康运动 / env 环境能源 / living 生活住宿 / academic 学术研究 / shopping 购物消费 / feelings 情感态度。
- ⚠️ **新词 t 必须用上面 10 个 id**。v8.0 已把历史非标准主题词（food/media/money/technology/science/education/environment/family）全部映射到标准主题，主题筛选已全覆盖，不再有"只在全部显示"的词。

## 构建流程
```powershell
cd C:\Users\哈哈哈\Documents\Codex\2026-08-04\zu
node work/build.js
Copy-Item outputs\index.html index.html -Force
```
- build.js 校验：词条字段齐全、无重复词、z 合法；原始词必须正好 173 条（从 app.js 提取），否则报错。
- 新词库接入：先在 build.js 顶部 `require` 并 concat 进 all 数组，再构建。

## 部署流程
1. 构建 + 复制根 index.html（见上）
2. `git add -A && git commit -m "说明"`
3. `node work/push-gh.js`（自动走 api.github.com；若改了 work/ 下文件，先确认它们在新推送清单里）
4. GitHub Pages 由 `.github/workflows/pages.yml`（Actions）自动部署，Vercel 自动同步，约 1~2 分钟更新；线上验证带 `?_t=<时间戳>` 参数穿透 CDN 缓存

## 测试流程
- 本地服务器：`python -m http.server 8000`（在项目根目录）
- 浏览器：Chrome 带 `--remote-debugging-port=9223` 打开 http://localhost:8000/
- 运行：`work/e2e-v7.ps1`（当前主回归，14 项）等脚本通过 CDP（PowerShell WebSocket）驱动页面并断言
- ⚠️ `work/e2e-v2.ps1` 已弃用（引用已移除的 DOM，断言必然失败），勿用；主回归只看 e2e-v7.ps1
- 截图验证：`work/shot-v7.ps1` 等

## Windows 编码注意事项（踩过的坑，务必遵守）
- **PowerShell 管道把中文/emoji 传给 node 会变 `?`**：中文内容一律先写文件（如 `[IO.File]::WriteAllText` UTF-8）再让 node 读文件，不要用管道传中文。
- here-string 内容里若行首出现 `'@` 会提前截断外层 here-string，避免嵌套 here-string。
- 改含中文/emoji 的文件：用 PowerShell `Set-Content -Encoding UTF8` 或 `[IO.File]::WriteAllText(path, text, UTF8)`。
- `apply_patch` 曾在此环境报"拒绝访问"，必要时改用 PowerShell 写文件。
- ps1 脚本务必保留 UTF-8 BOM（e2e-v5/fix 曾因缺 BOM 在 PS5.1 下中文乱码，已补）。
- ⚠️ **HTML/CSS/JS 源码文件绝不能带 BOM**：v9 曾因模板 `outputs/index.html` 的 CSS_MARK 行首混入 U+FEFF，注入的 features.css 第一条规则 `.modal-mask` 选择器被污染成「不存在元素+后代选择器」整条失效，导致详情弹窗失去 fixed 定位/遮罩/居中（手机端卡住、电脑端显示不全）。build.js 已加防御（读取 features.css 时剥掉开头 BOM），但写 `outputs/index.html` 时仍要用无 BOM 的 UTF-8 写入。

## 版本记录
- v10.1 性能修复：**分页渲染**（2026-08-11，**待推送**）：词库列表/词书详情列表首屏只渲染 100 条 + 「加载更多」按钮（查询/筛选变化自动重置分页；用 var 避免 base init 先于 features 声明导致的 let TDZ 崩溃）。实测 renderLearn 961ms→6ms、单键搜索 412ms→9ms、DOM 节点 8.3万→1.5千；e2e-v7 + v10-m2/m3/m4/m5a-i 共 13 套全绿 + 截图。
- v10.0 M5 词条全部接入并推送上线（2026-08-08）：词库 2274→**5622**。listening 821（剑桥 4-20 听力填空答案，无 LICENSE 公开仓库，两批 a/b）；jianqiao 450（chunsi-w/ielts-vocab-cloudflare MIT，最高频段 450）；zhenjing 938（hefengxian/ielts-vocabulary MIT，两批 d/e，含源笔误修正与占位符剔除）；awl 570（VUW 官方 Coxhead 词表，78 新增 + 492 build 期一词多书标记）；band9 102（learning-zone/ielts-materials MIT vocabulary.md，61 新增 + 41 标记）；oxford 1000（OUP Oxford 3000 公开镜像，两批 j/k，剔除 82 功能词，取净增前 1000）。全部批次经 validate-v10-*.js 校验 0 错 + 13 套 e2e 全绿 + 截图。
- v10.0 M1~M4（2026-08-07，已推送）：**词书系统**（`work/books.js` 定义 7 本词书：default/jianqiao/listening/zhenjing/awl/band9/oxford，build.js 注入 BOOKS 并校验词条 `b` 字段；新增「📚 词书」tab：书架页 + 词书详情页（封面/来源许可/可搜索词表/开始背诵/开始练习）；词库/闪卡/练习新增词书筛选（learnBook/flashBook/pBook，设置页「默认词书」联动，持久化 state.settings.book）；统计页新增词书进度面板；详情弹窗词书标签可点击跳词库筛选；设置页新增「词书来源」区（含 OUP 牛津非商用声明））；**背诵模式**（选书→顺序/乱序→认识/不认识→首遍错词入重复队列再背一遍→正确率→「再背错词」重背错词，进度存 `state.recite.books`，recordAnswer 联动统计）；**哈希路由**（`#/learn`、`#/book/jianqiao` 等；tab 写 hash、浏览器前进/后退、分享/收藏链接、程序化跳转 replaceState 同步）。专项 e2e：v10-m2 18 项 / v10-m3 15 项 / v10-m4 14 项，e2e-v7 14 项回归全绿。
- v9.0（2026-08-07，已上线）：首页改造为「学习中心」默认页（hero/目标环/继续学习/词书卡/工具卡/每日一词，每日一词已在 hero 下方置顶）；**配色系统变量化**：浅色 `:root`（`--bg #f6f3ed / --card #fffdf8 / --card-2 #faf5ec` …）与深色 `html[data-theme="dark"]` 变量块（`--bg #0b111c / --card #151e2b / --card-2 #1c2737` …）三级分层，浅色硬编码色值全部变量化；修复深色模式部分文字过暗；主题切换加 `.th-trans` 0.35s 平滑过渡（`features.js applyAppearance` 加类 450ms 后移除）；页面版本号 v8.0→v9.0；v8.0 原版备份到 `backups/v8.0-original-20260807/`；截图验证 7 张（`work/v9-shot-*.png`）；词数仍 2274。发布清单见 `V9-RELEASE.md`，设计过程见 `V9-PLAN.md`。
- v8.0（2026-08-07，已上线）：新增 v8 词库（+400，总量 2274，听力 1210/书写 1064）；**修复云同步合并 bug**（新设备登录不再用本地默认值覆盖云端 goal/settings；同日多设备 streak 取最大、daily 取大）；183 个非标准主题词全部映射到 10 个标准主题；页面版本号 v5.0→v8.0；e2e-v7 的 n8/n9 改为筛选过滤断言（主题修复后已无「专区×主题」空交集组合）；**部署迁移 GitHub Actions**（legacy Jekyll 构建故障，加 .nojekyll + pages.yml workflow）。
- v7.2（2026-08-05，commit aa4f6bf，已上线）：v7 词库接入（+532，总量 1874，听力 1010/书写 864）；修 `#learn-search` 邮箱自动填充 bug（加 autocomplete=off 等 + 邮箱守卫）；空状态区分「搜索无结果 / 专区×主题无交集」并提供清除按钮；e2e-v7.ps1 14/14 通过。
- v7.1：意见反馈表单（FormSubmit → 2012837089@qq.com，激活已完成）。
- v7 前：词库 173→293→477→1005→1342 的历次扩充，功能含详情弹窗/字号三档/备份/登录云同步。

## 常见维护任务
- **加词库**：参照现有词条格式写新词 → `node work/validate-v8.js`（对照 .existing-words.txt 去重；加新批次时把脚本里的 V8NEW 换成新词库源）→ 接入 build.js → 构建 → E2E → 提交推送。新词 t 用 10 个标准主题 id，z 按专区，k 必须逐字出现在 e 里。
- **改功能**：v2+ 功能改 work/features.js/css/modal.html/cloud.js；基础功能改 outputs/index.html 后重新构建。
- **换 Supabase**：改 work/cloud.js 顶部两行（URL + anon key），重新构建推送；表 user_data 需建好并开 RLS（见 DEPLOY.md）。
- **部署验证**：API 查 Pages 构建 `https://api.github.com/repos/kskbl1716/ielts-synonym-trainer/pages/builds/latest`（带 GH_TOKEN）；线上内容穿透缓存抓取对比词数。

## 关键配置速查
- 反馈邮箱：2012837089@qq.com（FormSubmit 已激活）
- Supabase：xetfvqissmpcznxtnpnx.supabase.co，表 user_data，anon key 在 work/cloud.js 顶部
- 本地存储键：localStorage `ielts-syn-trainer-v1`（进度/生词本/设置都在里面）

## 环境备注（Codex 应用配置，与网站无关，仅维护会话备忘）
- 2026-08-07 修复自定义模型上下文窗口被压缩在 258K 的问题：`~/.codex/model-catalog.json`（含 26.730 必填 `base_instructions` 字段；context/max_context_window=1,000,000，auto_compact_token_limit=900,000，effective 95%），`~/.codex/config.toml` 中 `model_catalog_json` 指向该文件
- 教训：26.730 的模型目录 schema 比 codex-rs 主分支更严格（`base_instructions` 必填），缺字段会导致整份配置解析失败、回退默认模型。改配置前先备份（`config.toml.bak-20260807-try2` 等），回滚脚本 `~/.codex/rollback-model-catalog.ps1`
- 若 Codex 更新后目录 schema 变化：按二进制内字段顺序补齐必填字段（upgrade 之后、model_messages 之前的 base_instructions）

- 2026-08-08 VPN 代理不影响 Codex 的修复（新代理是 WireGuard 类 L3 隧道，`NO_PROXY` 环境变量对它无效）：脚本 `C:\Users\哈哈哈\.codex\vpn-bypass\codex-vpn-bypass.ps1`（需管理员运行）把 `api.deepseek.com`(123.125.246.121) / `api.moonshot.cn`(8.147.223.37) 固定进 hosts（marker 块 `# BEGIN/END codex-vpn-bypass`），并加 `/32` 持久路由走物理网关绕过 VPN 隧道；定时任务 `CodexVPNBypass`（SYSTEM，每 10 分钟）自动刷新（改网络/网关也不怕）。换 IP 时改脚本顶部 `$PinEntries` 重跑即可。日志在同目录 codex-vpn-bypass.log。
