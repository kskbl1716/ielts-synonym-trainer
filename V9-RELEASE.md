# V9 发布说明（RELEASE）— 学习中心首页 + 配色系统 + 过渡动画

> 版本：v9.0（已上线）｜ 日期：2026-08-07 ｜ 状态：**已推送上线（GitHub Actions 部署），线上验证通过（2274 词 / 版本 v9.0 / 学习中心首页）**
> 新会话接手请先读本文件 → 再读 AGENTS.md / DEPLOY.md。设计过程稿见 V9-PLAN.md，下一步见 V10-PLAN.md。

## 1. 版本一句话
首页改造为「学习中心」，全站配色统一为「背景 → 卡片 → 次级卡片」三级分层（浅色/深色各一套），深浅色切换加平滑过渡，修复深色模式可读性，**功能零删除、词数不变（2274）**。

## 2. 改动清单

### 2.1 首页学习中心（默认 tab 已是「首页」）
- `home-hero`：问候语 + 日期 + 目标环（conic-gradient 每日进度）+ 连续打卡/今日进度统计
- `continue-card`：继续上次学习入口
- 词书卡区（`book-card`）
- 工具卡区（`tool-card`）：闪卡 / 听写 / 选择 / 配对 / 听力
- 每日一词卡（`daily-card`）

### 2.2 配色系统（变量化）
浅色 `:root`（`outputs/index.html` 头部 `<style>`）：

| 变量 | 值 | 用途 |
|---|---|---|
| `--bg` | `#f6f3ed` | 页面背景（暖纸色） |
| `--card` | `#fffdf8` | 一级卡片（米白） |
| `--card-2` | `#faf5ec` | 次级卡片/输入底 |
| `--ink` / `--muted` | `#222c38` / `#6b7480` | 正文 / 次要文字 |
| `--primary` / `--primary-d` | `#2c4f8f` / `#1f3a6d` | 主色 / 加深 |
| `--primary-l` / `--primary-hi` | `#e9eef8` / `#1f3a6d` | 主色浅底 / 标题高亮 |
| `--amber`/`--green`/`--red` + `-l` | `#c98a2e`/`#1e8a6d`/`#c6534f` | 强调色三组 |
| `--line` / `--line-2` | `#e9e1d2` / `#d9cdb6` | 边框 / 深一级边框 |
| `--radius` / `--shadow` | `16px` / `0 10px 28px rgba(44,63,90,.08)` | 圆角 / 阴影 |

深色 `html[data-theme="dark"]`（`work/features.css`）：

| 变量 | 值 | 用途 |
|---|---|---|
| `--bg` | `#0b111c` | 页面背景（深蓝黑） |
| `--card` / `--card-2` | `#151e2b` / `#1c2737` | 卡片 / 次级卡片 |
| `--ink` / `--muted` | `#dbe3ee` / `#9aaac0` | 正文（浅色）/ 次要 |
| `--primary` / `--primary-hi` | `#4f7fd8` / `#a8c4f5` | 主色 / 标题高亮 |
| `--primary-l` | `#1d2f4d` | 主色浅底 |
| `--amber`/`--green`/`--red` + `-l` | `#d99c42`/`#35b391`/`#e08b87` | 强调色三组 |
| `--line` / `--line-2` | `#2a3750` / `#3d4d6b` | 边框 |
| `--shadow` | `0 10px 28px rgba(0,0,0,.38)` | 阴影 |

### 2.3 深浅色修复
- 浅色硬编码色值全部变量化：`#faf8f2 / #f4f1ea / #e8e2d4 / #d9cfba / #d8cdb4 / #f0ede5 / #f2eee3 / #f4f0e6 / #ffffff` → 对应变量
- 标题类统一 `--primary-hi`：`.wc-word` / `.f-word` / `.q-word` / `.wb-word` / `.wm-w` / `.home-hello` / `.daily-card .d-word` / `.bk-flag.soon` / `mark`
- 深色覆盖补全：`.face.front` / `.f-ex` / `.auth-tabs` / `.auth-tab.active` / `#toast` / `.modal` / `.bk-flag.live` / `.empty` / `.continue-card` / `.cloud-card`
- 修复深色模式部分正文过暗 bug

### 2.4 过渡动画
- `viewIn`：视图切换 0.38s 淡入+上移（基础 CSS，已有）
- `modalIn`：详情弹窗 0.22s
- 主题切换：`features.js applyAppearance()` 加 `.th-trans` 类、450ms 后移除；`features.css` 尾部 v9 段对 30+ 元素做 `background-color/color/border-color` 0.35s 过渡

## 3. 涉及文件
- 改：`outputs/index.html`（基础 CSS 变量化 + 首页结构）、`work/features.css`（深色变量块 + 深色补全 + v9 过渡段）、`work/features.js`（applyAppearance 加 .th-trans）、根 `index.html`（构建产物副本）
- 新增：`V9-PLAN.md`（设计过程）、`V9-RELEASE.md`（本文件）、`V10-PLAN.md`（下一步方案）、`backups/v8.0-original-20260807/`（原版备份）、`work/shot-v9.ps1`、`work/verify-v9.ps1`（验证脚本）、`work/v9-shot-*.png`（截图）
- 归档：`work/_archive/`（diag-*.ps1、_tmp-css-edit.ps1）
- 未动：词库（2274 词）、功能逻辑（详情弹窗/备份/字号/登录云同步/反馈/生词本/统计/全部练习模式）

## 4. 构建与验证
```powershell
cd C:\Users\哈哈哈\Documents\Codex\2026-08-04\zu
node work/build.js
Copy-Item outputs\index.html index.html -Force
```
- 构建输出：build OK，620491 字节；`outputs/index.html` 与根 `index.html` 哈希一致（已确认）
- 词数校验：2274（听力 1210 / 书写 1064）不变
- 截图 7 张：`work/v9-shot-01-home-light.png`（浅色首页）、`v9-shot-02-home-dark.png`（深色首页）、`v9-shot-03-learn.png`（词库）、`v9-shot-04-detail.png`（详情弹窗）、`v9-shot-05/06-flash*.png`（闪卡正反面）、`v9-shot-07-settings-dark.png`（设置深色）
- 主回归：`work/e2e-v7.ps1`（14 项，改 CSS 不影响 DOM，预期通过；上线前可再跑一次）

## 5. 上线步骤（等用户确认）
1. `git add -A && git commit -m "v9: 学习中心首页 + 配色系统 + 过渡动画"`
2. `node work/push-gh.js`（走 api.github.com，勿用普通 git push）
3. GitHub Actions 自动部署，约 1~2 分钟；线上验证加 `?_t=<时间戳>` 穿透 CDN
4. 验证点：首页学习中心、深浅色切换（顶栏按钮 + 跟随系统）、主题切换过渡、词数 2274、登录/云同步、反馈表单

## 6. 回滚预案
- v8.0 原版备份：`backups/v8.0-original-20260807/`（index.html / outputs-index.html / build.js / features.css / features.js / cloud.js / modal.html）
- 回滚 = 用备份覆盖对应文件 → 重新构建复制 → 提交推送

## 7. 环境备注（与网站无关，仅备忘）
- 2026-08-07 已修复 Codex 桌面版自定义模型上下文窗口：`~/.codex/model-catalog.json`（含 26.730 必填的 `base_instructions` 字段，context/max=1,000,000，compact=900,000），`~/.codex/config.toml` 里 `model_catalog_json` 指向它；回滚脚本 `~/.codex/rollback-model-catalog.ps1`
- 若 Codex 自动更新后模型目录 schema 又变，按相同字段顺序补字段即可