# V9 计划：学习中心首页 + 配色系统 + 过渡动画

> 状态：**开发已完成**（本地构建 + 截图验证通过），**尚未推送上线**。上线需用户确认后执行 `node work/push-gh.js`。
> 备份：v8.0 原版已备份到 `backups/v8.0-original-20260807/`（index.html / outputs-index.html / build.js / features.css / features.js / cloud.js / modal.html）。

## 1. 目标
1. 首页改造为「学习中心」：hero + 目标环 + 统计 + 词书卡 + 工具卡 + 每日一词
2. 建立统一配色系统：浅色/深色模式下「背景 → 卡片 → 次级卡片」三级分层，所有颜色相搭
3. 视图切换与主题切换的平滑过渡动画
4. 保留原有全部功能（词库/闪卡/练习/统计/生词本/设置/云同步/反馈/详情弹窗/字号/备份/导出导入）

## 2. 配色系统（已完成）

### 2.1 浅色模式（`:root`，`outputs/index.html` 头部 `<style>`）
| 变量 | 值 | 用途 |
|---|---|---|
| `--bg` | `#f6f3ed` | 页面背景（暖纸色，最浅层） |
| `--card` | `#fffdf8` | 一级卡片（米白，比背景亮一档） |
| `--card-2` | `#faf5ec` | 次级卡片 / 输入底（浅暖色） |
| `--ink` | `#222c38` | 正文文字 |
| `--muted` | `#6b7480` | 次要文字 |
| `--primary` | `#2c4f8f` | 主色（深蓝） |
| `--primary-d` | `#1f3a6d` | 主色加深 |
| `--primary-l` | `#e9eef8` | 主色浅底 |
| `--primary-hi` | `#1f3a6d` | 标题 / 强调文字 |
| `--amber` / `--amber-l` | `#c98a2e` / `#f9efdc` | 琥珀强调 / 浅底 |
| `--green` / `--green-l` | `#1e8a6d` / `#e2f1ea` | 成功绿 / 浅底 |
| `--red` / `--red-l` | `#c6534f` / `#f9e7e5` | 错误红 / 浅底 |
| `--line` / `--line-2` | `#e9e1d2` / `#d9cdb6` | 边框 / 深一级边框 |
| `--radius` | `16px` | 卡片圆角 |
| `--shadow` | `0 10px 28px rgba(44,63,90,.08)` | 卡片阴影 |

设计逻辑：暖纸底 → 米白卡片 → 浅暖次级卡片，三级分层、低对比、整体和谐。

### 2.2 深色模式（`html[data-theme="dark"]`，`work/features.css`）
| 变量 | 值 | 用途 |
|---|---|---|
| `--bg` | `#0b111c` | 页面背景（深蓝黑） |
| `--card` | `#151e2b` | 一级卡片（比背景亮） |
| `--card-2` | `#1c2737` | 次级卡片（再亮一档） |
| `--ink` | `#dbe3ee` | 正文（浅色，保证可读） |
| `--muted` | `#9aaac0` | 次要文字 |
| `--primary` | `#4f7fd8` | 主色（提亮以适配深底） |
| `--primary-d` | `#1f3a6d` | 深主色 |
| `--primary-l` | `#1d2f4d` | 主色浅底 |
| `--primary-hi` | `#a8c4f5` | 标题高亮（浅蓝） |
| `--amber` / `--amber-l` | `#d99c42` / `#33291a` | 琥珀 / 浅底 |
| `--green` / `--green-l` | `#35b391` / `#123a30` | 成功绿 / 浅底 |
| `--red` / `--red-l` | `#e08b87` / `#3d2020` | 错误红 / 浅底 |
| `--line` / `--line-2` | `#2a3750` / `#3d4d6b` | 边框 / 深一级边框 |
| `--shadow` | `0 10px 28px rgba(0,0,0,.38)` | 卡片阴影 |

设计逻辑：深蓝黑底 → 深蓝灰卡片 → 稍亮次级卡片，与浅色模式同构分层；正文用浅色（修复旧版深色下部分文字过暗的 bug）。

### 2.3 改造内容
- 浅色硬编码色值全部变量化：`#faf8f2` / `#f4f1ea` / `#e8e2d4` / `#d9cfba` / `#d8cdb4` / `#f0ede5` / `#f2eee3` / `#f4f0e6` / `#ffffff` → 对应变量
- 标题类统一用 `--primary-hi`：`.wc-word` / `.f-word` / `.q-word` / `.wb-word` / `.wm-w` / `.home-hello` / `.daily-card .d-word` / `.bk-flag.soon` / `mark`
- 深色覆盖补全：`.face.front` / `.f-ex` / `.auth-tabs` / `.auth-tab.active` / `#toast` / `.modal` / `.bk-flag.live` / `.empty` / `.continue-card` / `.cloud-card` 等
- 首页顶部渐变、卡片阴影、分隔线全部跟随变量，深浅模式自动适配

## 3. 过渡动画（已完成）
- `viewIn`：视图切换 0.38s 淡入 + 上移（基础 CSS `.view.active`）
- `modalIn`：详情弹窗 0.22s 弹出
- 主题切换：`work/features.js` 的 `applyAppearance()` 加 `.th-trans` 类 → 450ms 后移除；`work/features.css` 尾部 v9 段对 30+ 元素做 `background-color / color / border-color` 0.35s 平滑过渡

## 4. 首页学习中心（已完成，待上线）
默认 tab 已是「首页」，结构：
1. `home-hero`：问候语 + 日期 + 目标环（conic-gradient 进度）+ 连续打卡 / 今日进度统计
2. `continue-card`：继续上次学习入口
3. 词书卡区（`book-card`）
4. 工具卡区（`tool-card`）：闪卡 / 听写 / 选择 / 配对 / 听力
5. 每日一词卡（`daily-card`）

## 5. 功能保留清单（V9 未删除任何功能）
- 词库：专区 × 主题筛选、搜索、详情弹窗（音标/词性/释义/例句/同义词跳转）、发音
- 练习：听写 / 看词选义 / 听音选义 / 选择题 / 配对题 / 闪卡（翻面）
- 统计：每日目标、打卡日历、连续天数、进度统计
- 生词本：添加 / 移除 / 清空
- 设置：深色 / 浅色 / 自动（跟随系统）、字号三档、每日目标、数据备份 / 导出 / 导入
- 邮箱登录 + Supabase 云同步（进度 / 目标 / 设置 / 生词本）
- 意见反馈（FormSubmit → 2012837089@qq.com）
- 主题色深色补全（`.bk-flag.live` 等）

## 6. 验证结果
- 本地服务器 8000 + Chrome CDP 9223，截图 7 张见 `work/v9-shot-*.png`：
  - `v9-shot-01-home-light.png` 浅色首页（暖纸底 + 米白卡片分层明显）
  - `v9-shot-02-home-dark.png` 深色首页（正文浅色可读）
  - `v9-shot-03-learn.png` 词库页
  - `v9-shot-04-detail.png` 详情弹窗
  - `v9-shot-05-flash.png` / `v9-shot-06-flash-flip.png` 闪卡正反面
  - `v9-shot-07-settings-dark.png` 设置页深色
- 词数保持 2274 不变（听力 1210 / 书写 1064）
- 构建：`node work/build.js` OK，`outputs/index.html` 与根 `index.html` 一致

## 7. 上线步骤（等用户确认）
1. `git add -A` + `git commit -m "v9: 学习中心首页 + 配色系统 + 过渡动画"`
2. `node work/push-gh.js`
3. 线上验证带 `?_t=<时间戳>` 参数穿透 CDN 缓存
4. 上线后回滚预案：`backups/v8.0-original-20260807/` 可一键恢复