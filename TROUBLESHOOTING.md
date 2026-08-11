# 故障恢复速查表（TROUBLESHOOTING）

> 出问题先查这张表。都是本机/站点真实踩过的坑，按「症状 → 原因 → 处理」找。
> 维护纪律：**能不动就不动，动前先备份，改完三同步，恢复先查表**（详见 AGENTS.md）。

## 一、Claude Code / DeepSeek 链路

| 症状 | 根因 | 处理 |
|---|---|---|
| Claude Code 连不上 DeepSeek | WireGuard 全局隧道把 relay 请求吸走（美国出口连不上国内 API） | hosts 固定 `api.deepseek.com→123.125.246.121`、`api.moonshot.cn→8.147.223.37` + 两条 /32 路由走物理网关（`codex-vpn-bypass.ps1`，定时任务 CodexVPNBypass 每 10 分钟刷）。**这套是 codex 之前配好的，勿删** |
| WebFetch 报「域名不安全」/ curl 境外全 HTTP 000 | 本机系统代理 `127.0.0.1:10808` 只对浏览器生效，curl/Claude Code 进程不读系统代理 | `curl -x http://127.0.0.1:10808 <url>` 可通；Claude Code 的 `http_proxy/https_proxy` 已配在 `~/.claude/settings.json` env（重启会话生效） |
| 修改本机网络配置（VPN/路由/hosts/DNS）后 Claude Code 挂了 | 动了 relay→DeepSeek 的链路 | 动手前先想会不会影响 `api.deepseek.com` 连通；改完验证 |

## 二、VPN / 分流（WireGuard + v2rayN + Karing）

| 症状 | 根因 | 处理 |
|---|---|---|
| 开 VPN 后国内网站全挂 | WireGuard 全局隧道 + **kill-switch 开着**拦截非隧道流量 | 关掉 WG 编辑界面「Block untracked traffic (kill-switch)」开关 |
| 国内域名解析失败 | 隧道 DNS 劫持 | laptop.conf 的 DNS 用 `223.5.5.5,1.1.1.1,1.0.0.1`（国内在前） |
| 加路由/换网关后分流失效 | 路由过期 | `china-split.ps1` 注册的 SYSTEM 定时任务 ChinaSplitRoutes 每 10 分钟自动重刷；桌面用 .lnk 快捷方式（.bat 会因中文编码报错） |
| speedtest 报「套接字错误」 | Reality 节点兼容性问题 | 忽略，实际网速正常 |
| 需要换节点/客户端 | — | 电脑 v2rayN，手机 Karing，共用 VPS（WireGuard 58443 / Xray 37323） |

## 三、Claude 桌面版（3P Gateway + 汉化）

| 症状 | 根因 | 处理 |
|---|---|---|
| 桌面版网页抓取报 `Host is not on the network allowlist (cowork-egress-blocked)` | 3P 模式出口白名单只有 api.deepseek.com | `%LOCALAPPDATA%\Claude-3p\configLibrary\<id>.json` 加 `"coworkEgressAllowedHosts": ["*"]`（**必须保留原格式、无 BOM**，用 `UTF8Encoding($false)` 写回，改错会回退原生模式） |
| 桌面版连不上模型 / 校验失败 | Model discovery 开着 / 模型名不对 | 关 Model discovery；Model list 手动填 `claude-sonnet-5` + Tier Sonnet |
| 桌面版升级/重装后配置失效 | 3P 配置不随升级保留 | 按 `claude-desktop-3p-deepseek-gateway` 记忆重配 |
| 汉化失效 | winget 独立版自动更新覆盖补丁 | 重跑 `C:\Users\Public\claude-zh-install.ps1`（先确认 `dist\zh-CN.json` 在脚本目录）；Store 版不可汉化（ACL 无写权），别浪费时间 |

## 四、MCP / agent 配置

| 症状 | 根因 | 处理 |
|---|---|---|
| npx 拉 MCP 包永远卡 `concurrency.lock` | 本机 pacote 解析不稳 | 用 `npm install -g` 后直接引用二进制名，别用 npx（playwright 已进缓存可继续用 npx） |
| luma 识图报错 / 401 | key 换过没同步 / 端点错 | 三个 config（`~/.codex/config.toml`、`~/.claude.json`、`~/.kimi-code/mcp.json`）的 `CUSTOM_API_KEY` 同步；端点用 `https://api.kimi.com/coding/v1`（`sk-kimi-` 前缀 key 必须这个）；图片路径须在项目工作目录内 |
| 改 MCP / env 不生效 | 配置只在会话启动时加载 | 改完重启对应 agent |
| 配置文件改完应用回退原生模式 | 带 BOM 或格式被重写 | 从 `.bak` 读原文 + 字符串插入 + `UTF8Encoding($false)` 无 BOM 写回 |

## 五、站点发布 / 线上

| 症状 | 根因 | 处理 |
|---|---|---|
| push-gh.js 推送失败 | GH_TOKEN 失效 / 清单缺文件 | 只判断 GH_TOKEN 是否存在（**别打印值**）；确认文件在 `work/.push-filelist.txt`；GitHub 主域被墙勿用 git push/pull |
| push-gh.js 报 ECONNRESET / 直连 api.github.com 超时 | 直连路由不通（VPN/分流变了），但代理 127.0.0.1:10808 可能可用 | 用代理推：`GH_PROXY=http://127.0.0.1:10808 node work/push-gh.js`（push-gh.js 已支持可选 CONNECT 隧道，不设 GH_PROXY 时走直连，机制不变）；若代理也时通时断，说明 VPN 节点在抖，换节点或稍后再试 |
| 推送成功但线上没更新 | Pages Actions 部署中 / CDN 缓存 | 等 1~2 分钟；验证带 `?_t=<时间戳>` 穿缓存；Pages 状态查 `api.github.com/repos/kskbl1716/ielts-synonym-trainer/pages/builds/latest` |
| Pages 构建报错 | 勿改回 legacy Jekyll（已故障） | 用 `.github/workflows/pages.yml`（Actions）部署 |
| 线上打不开 / 很慢（8s+） | github.io 国内访问不稳 | 主站加 `?_t` 强刷；持久方案=自定义域名+国内可访问托管 |
| 百度不收录 / 统计未生效 | github.io 被百度限主域 + 爬虫抓不到 | **平台限制，改不了**；真冲国内排名需自定义域名 + 国内托管 + ICP 备案 |
| 线上健康检查 | — | `node work/check-site.js` 一键体检（可达性/词数/关键标记/robots/sitemap/Pages 构建） |

## 六、构建 / 词条 / 测试

| 症状 | 根因 | 处理 |
|---|---|---|
| `node work/build.js` 报错 | 词条字段缺失 / 重复词 / 书 id 不对 / 原始词≠173 | 按报错改词条文件；新词 t 用 10 个标准主题 id、z 按 l/w、k 必须逐字在 e 里、一次 ≤500 条 |
| ps1 中文乱码 | ps1 缺 BOM | ps1 保留 UTF-8 BOM；**HTML/CSS/JS 源码绝不能带 BOM**（会污染 CSS 首条规则等） |
| e2e 跑不了 | 没起 server / 浏览器调试端口 | `python -m http.server 8000` + Chrome/Edge `--remote-debugging-port=9223` 打开 localhost:8000 |
| 发布整套步骤繁琐 | — | 一键发布：`node work/release.js "提交信息" [额外新文件...] [--e2e]`（build→copy→commit→push→验证） |
| 编码坑：中文/emoji 传 node 变 ? | PowerShell 管道 | 中文先写文件（UTF-8）再让 node 读，别用管道传 |

## 关键地址速查
- 主站：`https://kskbl1716.github.io/ielts-synonym-trainer/`（备：`https://ielts-trainer-liard.vercel.app/`）
- 本地服务器：`http://localhost:8000/`（python -m http.server 8000）
- 代理：系统代理 `127.0.0.1:10808`（v2rayN）；Claude Code 走它需 env http_proxy
- DeepSeek relay：`127.0.0.1:57321`（codex）
