# 雅思同义词训练器 — 部署与维护指南（最终版）

## 当前状态
- 词库：**6533 词**（听力专区 4244 / 书写专区 2289），每条含音标、词性、英文释义、中文翻译、例句与关键词高亮、**难度分级**（基础/进阶/高级）、**掌握度 5 级**（陌生/认识/模糊/掌握/熟练）
- 练习模式：听写模式、看词选义、听音选义、选择题、配对题、闪卡、背诵模式
- 功能：每日目标、打卡系统、生词本、**星标收藏**、错题本、进度统计、数据导出/导入/导出图片/打印PDF、深色模式、字号调节、**手机布局**（自动/手动）、**每日提醒**（浏览器通知）、词书系统（**13 本词书**）、词库分页渲染、单词难度分级筛选、**艾宾浩斯智能复习**（今日待复习队列 + 例句朗读 + 遗忘曲线可视化 + 学习热力图）、**词根词缀记忆**（2036 学术词词根拆解 + 按词根筛词）、**近义词辨析**（高频同义词用法区分）、**错题主题分析**（薄弱主题+推荐词书）、**今日学习报告**（练习/正确率/打卡/复习任务/薄弱主题）、**新手引导**（首次 3 步）
- 当前版本 **v11.6**（2026-08-12）：在 v11.5 基础上新增 **体验完善**——发音设置补全（语音检测+具体语音下拉+试听）、闪卡正面去中文、新手引导、今日学习报告、搜索强化（释义/辨析/记忆/词性）、导出图片/打印PDF、云同步手动按钮+上次同步+切回前台自动拉取；v11.5 星标/提醒/错题主题，v11.4 扩词三词书+近义词辨析，v11.3 手机布局，v11.2 词根词缀，v11.1 遗忘曲线/热力图/复习看板，v11.0 掌握度5级/艾宾浩斯调度/今日待复习/错题本/例句朗读；历史发布清单见 V9-RELEASE.md / V10-PLAN.md
- 邮箱登录 + 云端进度同步（Supabase）

## 网址（两套自动同步）
- **主网址（国内可用）**：https://kskbl1716.github.io/ielts-synonym-trainer/
- **备用网址（海外/香港）**：https://ielts-trainer-liard.vercel.app/

## 源码结构
- 构建产物：outputs/index.html（单文件，含全部功能）
- 词库源码：work/dict-data.js（原始词）、work/v4-words.js、work/v5-words.js、work/v6-words.js、work/v7-words.js、work/v8-words.js（最新批次）
- 功能源码：work/features.js、work/cloud.js（登录+云同步）、work/modal.html、work/features.css
- 构建脚本：work/build.js（node work/build.js 重新生成产物）

## 更新流程（改完直接推 GitHub）
1. 修改 work/ 下源码 → 运行 node work/build.js
2. 复制 outputs/index.html 到仓库根 index.html（Pages 部署的是根目录文件）
3. git add -A && git commit -m "说明"
4. 推送：node work/push-gh.js（需要环境变量 GH_TOKEN，已存入 Codex 全局配置 ~/.codex/config.toml 和系统环境变量）
5. GitHub Pages 由 `.github/workflows/pages.yml`（Actions）自动部署，Vercel 自动同步，约 1~2 分钟更新（2026-08-07 起 legacy Jekyll 构建故障，已迁移 Actions；勿改回）

## Supabase 配置
- 当前项目：xetfvqissmpcznxtnpnx.supabase.co（邮箱验证开启；user_data 表已建并启用 RLS）
- 若重建新项目：把 Project URL 与 anon public key 填入 work/cloud.js 顶部两行，重新构建推送即可

## 常见问题
- 国内打不开备用网址：vercel.app 为海外节点，国内请用主网址（github.io）或 VPN
- 收不到验证邮件：Supabase → Authentication → Providers → Email，检查 Confirm email 开关；垃圾箱也要看
- 令牌失效：在 github.com/settings/tokens 删除令牌后推送会失败，需在 Codex 全局配置重新更新 GH_TOKEN