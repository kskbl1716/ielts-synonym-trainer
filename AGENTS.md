# 雅思同义词训练器 — 项目维护手册（Codex 专用）

> 本文件由维护会话生成，用于在会话上下文丢失后快速恢复项目状态。
> 任何在此目录下工作的 Codex 会话都会自动加载本文件。阅读顺序：先读本文件 → 再读 DEPLOY.md → 需要时看 work/_archive/ 里的历史脚本。

## 项目路径与使用方式
- 工作目录：`C:\Users\哈哈哈\Documents\Codex\2026-08-04\zu`
- 在 Codex 中把该目录添加为「项目」即可，本手册会自动加载，无需其他配置
- 项目一句话：雅思听力同义替换词训练网站。单文件静态站（无框架、无构建链），词库 + 闪卡 + 听写/选择/配对/听力练习 + 统计 + 生词本 + 邮箱登录云同步 + 意见反馈

## 线上地址（GitHub Pages 为主，Vercel 备用，推送后自动同步）
- 主：https://kskbl1716.github.io/ielts-synonym-trainer/（国内可用）
- 备：https://ielts-trainer-liard.vercel.app/（海外/香港节点，国内网络可能超时属正常）
- 仓库：https://github.com/kskbl1716/ielts-synonym-trainer.git（默认分支 main）
- 当前线上状态：词库 1874 词（听力 1010 / 书写 864），v7.2 已上线

## GitHub 令牌与推送机制（重要）
- 令牌在**系统用户级环境变量 GH_TOKEN**（40 位经典 token，owner=kskbl1716）；Codex 全局配置 `~/.codex/config.toml` 里也有备份
- **GitHub 主域被墙**：不要用普通 `git push`/`git pull`（会超时）；一律用 `node work/push-gh.js`，它走 api.github.com
- push-gh.js 机制：读取 `work/.push-filelist.txt` 的文件清单 → 逐文件 base64 上传 blob → 基于远程 HEAD 建新 tree/commit（消息固定 "Add full source: IELTS synonym trainer (work source, outputs, DEPLOY)"）→ 更新 main
- ⚠️ push-gh.js 只会新增/更新清单内文件，**不会删除**远程上清单外的文件；修改清单后重推即可
- ⚠️ 本地 git 历史与远程**不是同一条链**：本地是维护记录（f9e3400 → aa4f6bf），远程是 push-gh.js API 建的独立提交链。内容同步但历史无关，**不要做 git pull/merge**，本地 git 只用来提交和留痕

## 目录结构与职责
- `outputs/index.html`：**构建产物 + v1 基础模板**。v1 的 HTML/JS 只存在于这个文件里（work/ 没有独立的基础 HTML 源码）。改基础页面/基础 JS → 直接改这里，再跑构建。
- `index.html`（仓库根）：部署用的副本，**构建后复制 outputs/index.html 覆盖它**，再提交推送。
- `work/build.js`：构建脚本（幂等）。作用：清理上次注入 → 用 work/app.js + 各词库文件重写 WORDS 数组 → 注入 DICT、features.css、modal.html、features.js、cloud.js。
- `work/app.js`：v1 页面 JS 快照，build.js 只从中提取**原始 173 词**（改 app.js 不影响构建出的词库，只影响词条提取）。
- 词库文件：`work/dict-data.js`（DICT 音标表 + NEW）、`work/v4-words.js`、`work/v5-words.js`（汇总 v5-a~f）、`work/v6-words.js`、`work/v7-words.js`（532 词，已接入 build.js）。
- 功能注入源：`work/features.js`（详情弹窗/备份/字号/反馈/空状态清除按钮等）、`work/features.css`、`work/modal.html`、`work/cloud.js`（Supabase 登录+云同步）。
- 推送与校验：`work/push-gh.js`、`work/validate-v7.js`、`work/.push-filelist.txt`（推送清单，被 gitignore）、`work/.existing-words.txt`（当前 1874 词去重基准）。
- 测试：`work/e2e-*.ps1`（Chrome CDP + 本地服务器 8000 + 调试端口 9223）、`work/shot-*.ps1`（截图验证）、`work/mock-supa.js`（登录 mock）。
- `work/_archive/`：历史一次性脚本/旧版本文件归档处（不参与构建、不在推送清单）。
- `DEPLOY.md`：部署与 Supabase 配置说明。

## 词条数据格式
```js
{t:'主题id', w:'单词', s:['同义词','…'], c:'中文释义', e:'例句', k:'例句中的同义词(需出现在e里)', p:'音标', pos:'词性', d:'英文释义', z:'专区'}
```
- 专区 z：`'l'` = 听力专区，`'w'` = 书写专区。
- 页面 TOPICS 只有 10 个（定义在基础 JS）：core 高频通用 / edu 教育学习 / work 工作职场 / travel 旅行交通 / health 健康运动 / env 环境能源 / living 生活住宿 / academic 学术研究 / shopping 购物消费 / feelings 情感态度。
- ⚠️ **新词 t 必须用上面 10 个 id**。历史遗留约 161 词用了非标准主题（food/media/money/technology/science/education/environment/family），它们只在"全部"显示、主题筛选看不到——遗留问题，暂未清理。

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
4. GitHub Pages 与 Vercel 约 1~2 分钟自动更新；线上验证带 `?_t=<时间戳>` 参数穿透 CDN 缓存

## 测试流程
- 本地服务器：`python -m http.server 8000`（在项目根目录）
- 浏览器：Chrome 带 `--remote-debugging-port=9223` 打开 http://localhost:8000/
- 运行：`work/e2e-v7.ps1`（当前主回归，14 项）等脚本通过 CDP（PowerShell WebSocket）驱动页面并断言
- 截图验证：`work/shot-v7.ps1` 等

## Windows 编码注意事项（踩过的坑，务必遵守）
- **PowerShell 管道把中文/emoji 传给 node 会变 `?`**：中文内容一律先写文件（如 `[IO.File]::WriteAllText` UTF-8）再让 node 读文件，不要用管道传中文。
- here-string 内容里若行首出现 `'@` 会提前截断外层 here-string，避免嵌套 here-string。
- 改含中文/emoji 的文件：用 PowerShell `Set-Content -Encoding UTF8` 或 `[IO.File]::WriteAllText(path, text, UTF8)`。
- `apply_patch` 曾在此环境报"拒绝访问"，必要时改用 PowerShell 写文件。

## 版本记录
- v7.2（2026-08-05，commit aa4f6bf，已上线）：v7 词库接入（+532，总量 1874，听力 1010/书写 864）；修 `#learn-search` 邮箱自动填充 bug（加 autocomplete=off 等 + 邮箱守卫）；空状态区分「搜索无结果 / 专区×主题无交集」并提供清除按钮；e2e-v7.ps1 14/14 通过。
- v7.1：意见反馈表单（FormSubmit → 2012837089@qq.com，激活已完成）。
- v7 前：词库 173→293→477→1005→1342 的历次扩充，功能含详情弹窗/字号三档/备份/登录云同步。

## 常见维护任务
- **加词库**：参照现有词条格式写新词 → `node work/validate-v7.js`（对照 .existing-words.txt 去重）→ 接入 build.js → 构建 → E2E → 提交推送。新词 t 用 10 个标准主题 id，z 按专区。
- **改功能**：v2+ 功能改 work/features.js/css/modal.html/cloud.js；基础功能改 outputs/index.html 后重新构建。
- **换 Supabase**：改 work/cloud.js 顶部两行（URL + anon key），重新构建推送；表 user_data 需建好并开 RLS（见 DEPLOY.md）。
- **部署验证**：API 查 Pages 构建 `https://api.github.com/repos/kskbl1716/ielts-synonym-trainer/pages/builds/latest`（带 GH_TOKEN）；线上内容穿透缓存抓取对比词数。

## 关键配置速查
- 反馈邮箱：2012837089@qq.com（FormSubmit 已激活）
- Supabase：xetfvqissmpcznxtnpnx.supabase.co，表 user_data，anon key 在 work/cloud.js 顶部
- 本地存储键：localStorage `ielts-syn-trainer-v1`（进度/生词本/设置都在里面）
