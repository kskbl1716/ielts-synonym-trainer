# 雅思同义词训练器 — 项目维护手册（Codex 专用）

> 本文件由维护会话生成，用于在会话上下文丢失后快速恢复项目状态。
> 任何在此目录下工作的 Codex 会话都会自动加载本文件。

## 项目一句话
雅思听力同义替换词训练网站：单文件静态站（无框架、无构建链），词库 + 闪卡 + 听写/选择/配对/听力练习 + 统计 + 生词本 + 邮箱登录云同步 + 意见反馈。

## 线上地址（GitHub Pages 为主，Vercel 备用，改动推送后自动同步）
- 主：https://kskbl1716.github.io/ielts-synonym-trainer/
- 备：https://ielts-trainer-liard.vercel.app/
- 仓库：https://github.com/kskbl1716/ielts-synonym-trainer.git（分支 main，仅 3 个提交）

## 目录结构与职责（重要）
- `outputs/index.html`：**构建产物 + v1 基础模板**。v1 的 HTML/JS 只存在于这个文件里（work/ 里没有独立的基础 HTML 源码）。改基础页面/基础 JS → 直接改这里，再跑构建。
- `index.html`（仓库根）：部署用的副本，**构建后复制 outputs/index.html 覆盖它**，再提交推送。
- `work/build.js`：构建脚本（幂等）。作用：清理上次注入 → 用 work/app.js + 各词库文件重写 WORDS 数组 → 注入 DICT、features.css、modal.html、features.js、cloud.js。
- `work/app.js`：v1 页面 JS 快照，build.js 只从中提取**原始 173 词**（app.js 改动不影响构建出的词库，只影响词条提取）。
- 词库文件：`work/dict-data.js`（DICT 音标表 + NEW）、`work/v4-words.js`、`work/v5-words.js`（汇总 v5-a~f）、`work/v6-words.js`、`work/v7-words.js`（532 词，已接入 build.js）。
- 功能注入源：`work/features.js`（详情弹窗/备份/字号/反馈等）、`work/features.css`、`work/modal.html`、`work/cloud.js`（Supabase 登录+云同步）。
- `work/validate-v7.js`：校验 v7 词库（去重/字段/例句关键词），输出 `work/.v7-final.txt`。
- `work/.existing-words.txt`：当前线上 1874 词清单，新增词去重对照表（validate-v7.js 使用）。
- `work/push-gh.js`：用 GitHub API 推送提交（需要环境变量 GH_TOKEN）。
- `work/e2e-*.ps1`：E2E 测试脚本（Chrome CDP + 本地服务器 8000 + 调试端口 9223）。
- `DEPLOY.md`：部署与 Supabase 配置说明。

## 词条数据格式
```js
{t:'主题id', w:'单词', s:['同义词','…'], c:'中文释义', e:'例句', k:'例句中的同义词(需出现在e里)', p:'音标', pos:'词性', d:'英文释义', z:'专区'}
```
- 专区 z：`'l'` = 听力专区，`'w'` = 书写专区。
- 页面 TOPICS（10 个，定义在基础 JS 里）：core 高频通用 / edu 教育学习 / work 工作职场 / travel 旅行交通 / health 健康运动 / env 环境能源 / living 生活住宿 / academic 学术研究 / shopping 购物消费 / feelings 情感态度。
- ⚠️ **主题 id 必须与上述 TOPICS 完全一致**，否则词条只在"全部"里显示、主题筛选看不到。当前线上产物里已存在不一致主题（food/media/money/technology/science/education/environment/family 等共 161 词），历史遗留，未清理。

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
3. `node work/push-gh.js`（依赖 GH_TOKEN，已配置在系统环境变量与 Codex 全局配置）
4. GitHub Pages 与 Vercel 约 1~2 分钟自动更新

## 测试流程
- 本地服务器：`python -m http.server 8000`（在项目根目录）
- 浏览器：Chrome 带 `--remote-debugging-port=9223` 打开 http://localhost:8000/
- 运行：`work/e2e-v6.ps1` 等脚本通过 CDP（PowerShell WebSocket）驱动页面并断言
- 截图验证：`work/shot-*.ps1`

## Windows 编码注意事项（踩过的坑，务必遵守）
- **PowerShell 管道把中文/emoji 传给 node 会变 `?`**：中文内容一律先写文件（如 `[IO.File]::WriteAllText` UTF-8）再让 node 读文件，不要用管道传中文。
- here-string 内容里若行首出现 `'@` 会提前截断外层 here-string，避免嵌套 here-string。
- 改含中文/emoji 的文件：用 PowerShell 原生 `Set-Content -Encoding UTF8` 或 `[IO.File]::WriteAllText(path, text, UTF8)`，注意用 UTF-8 无 BOM（Node 读取无碍）。
- `apply_patch` 曾在此环境报"拒绝访问"，必要时改用 PowerShell 写文件。

## 已完成（v7.2，2026-08-05）
1. **v7 词库已接入**：build.js require V7NEW，产物 1874 词（听力 1010 / 书写 864），e2e-v7.ps1 14/14 通过。
2. **搜索框自动填充 bug 已修**：`#learn-search` 加 `autocomplete="off"` 等属性；`features.js` 空状态区分「搜索无结果 / 专区×主题无交集」并提供清除按钮；基础 HTML 监听器加邮箱守卫（`window.__CURRENT_USER_EMAIL__` 命中则清空不搜索），cloud.js onAuth 登录后自动清污染搜索框。
3. 已提交推送（GitHub API 方式，owner=kskbl1716 / ielts-synonym-trainer）。
4. 下次加词库去重基准：`work/.existing-words.txt`（1874 词）。

## 关键配置速查
- 反馈邮箱：2012837089@qq.com（FormSubmit 激活已完成）
- Supabase：xetfvqissmpcznxtnpnx.supabase.co，表 user_data，anon key 在 work/cloud.js 顶部
- 本地存储键：localStorage `ielts-syn-trainer-v1`（进度/生词本/设置都在里面）
