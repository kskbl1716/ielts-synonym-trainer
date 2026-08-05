# 部署到公网 + 邮箱登录 完整指南

> 网站代码已完成：邮箱登录、云端同步进度（换设备不丢）、未配置时自动降级为本地使用。
> 全部使用免费额度，个人学习网站 0 元。

## 一、需要注册的两个东西（都是免费）

| 服务 | 作用 | 网址 |
| --- | --- | --- |
| Supabase | 邮箱登录 + 云端保存进度（数据库） | https://supabase.com |
| GitHub 或 Vercel | 把网页免费托管到公网，所有人可访问 | https://github.com / https://vercel.com |

## 二、架构（为什么需要注册两个）

```
你的网站页面（纯静态 HTML）
   ├── 托管在 GitHub Pages / Vercel → 公网网址，谁都能打开
   └── 邮箱登录 + 进度云存储 → Supabase（免费后端）
```

## 三、第一步：注册 Supabase，创建项目（约 5 分钟）

1. 打开 https://supabase.com ，点 **Start your project**。
   - 推荐直接用 GitHub 账号登录（正好第四步也要注册 GitHub）。
2. 登录后点 **New project**：
   - Name：填 `ielts-synonym-trainer`
   - Database Password：自己设一个并记下来
   - Region：选 **Singapore**（国内访问更快）
   - 点 **Create new project**，等 1~3 分钟。
3. 左边菜单 **SQL Editor → New query**，粘贴下面 SQL，点 **Run**：

```sql
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.user_data enable row level security;

drop policy if exists "own_select" on public.user_data;
create policy "own_select" on public.user_data
  for select using (auth.uid() = user_id);

drop policy if exists "own_insert" on public.user_data;
create policy "own_insert" on public.user_data
  for insert with check (auth.uid() = user_id);

drop policy if exists "own_update" on public.user_data;
create policy "own_update" on public.user_data
  for update using (auth.uid() = user_id);
```

4. 确认邮箱验证开启（默认已开）：
   **Authentication → Providers → Email**，Enabled 保持打开。
   这样用户注册后会收到验证邮件。

## 四、第二步：拿到两个配置值

1. 左边菜单最下面 **Project Settings → API**。
2. 复制两个值（发给 Codex 帮你填，或自己填）：
   - **Project URL**：形如 `https://xxxx.supabase.co`
   - **anon public key**：形如 `eyJhbGciOi...`
3. 自己填的话，打开 `work/cloud.js`，顶部两行：

```js
var SUPABASE_URL = '';       // ← 填 Project URL
var SUPABASE_ANON_KEY = '';  // ← 填 anon public key
```

然后重新构建（在项目根目录运行）：

```
node work/build.js
```

## 五、第三步：把网站部署到公网（二选一）

### 方式 A：GitHub Pages（推荐）

1. 打开 https://github.com 注册（免费），右上角 **+ → New repository**。
   - Repository name：`ielts-synonym-trainer`
   - 选 **Public**，点 **Create repository**。
2. 仓库页 → **Add file → Upload files** → 把 `outputs/index.html` 拖进去 → **Commit changes**。
3. 仓库 **Settings → Pages**：
   - Source：**Deploy from a branch**
   - Branch：`main`，文件夹：`/ (root)`
   - **Save**。
4. 等 1~2 分钟，出现网址：
   `https://你的用户名.github.io/ielts-synonym-trainer/`
   → 把这个网址发给任何人即可访问。

### 方式 B：Vercel（不用学 git，拖拽上传）

1. 打开 https://vercel.com ，用 GitHub 账号登录。
2. **Add New → Project → 拖拽上传**：把 `outputs` 文件夹拖进去。
3. 点 **Deploy**，约半分钟后得到 `https://xxx.vercel.app`。

### 方式 C：临时公网链接（应急，不注册也能用）

下载 Cloudflare 的 `cloudflared`，在网站运行目录执行：

```
cloudflared tunnel --url http://localhost:8000
```

会得到一个 `https://xxx.trycloudflare.com` 链接，2 小时内有效，适合临时分享；正式用请走方式 A/B。

## 六、第四步：验收

1. 打开公网网址 → 右上角「👤 登录 / 注册」→ 切到「注册」→ 填邮箱和密码。
2. 去邮箱点验证链接（Supabase 发送）→ 回网站登录。
3. 做几道题、改每日目标 → 退出 → 重新登录 → 进度还在。
4. 用手机打开同一网址登录 → 数据自动同步。

## 七、常见问题

- **验证邮件收不到？** 看垃圾箱；确认 Authentication → Email 已开启。
- **国内打开慢/打不开？** GitHub Pages / Vercel 在国内偶尔不稳定，需能访问这些域名；若主要给国内用户用，可考虑国内托管（需备案）或用 Cloudflare Tunnel 应急。
- **费用？** 以上全部免费额度内 0 元（Supabase 免费版：5 万月活用户 / 500MB 数据库）。
- **没配 Supabase 时网站还能用吗？** 能，自动降级为“数据存本机”，所有功能照常。
- **数据安全？** 每个用户只能读写自己的数据（SQL 里已开行级安全 RLS）。