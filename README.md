# 魔力宝贝 CrossGate 用户中心

基于 Next.js 14 构建的魔力宝贝游戏用户网站，提供用户登录、密码修改和角色资料查看功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **数据库**: MySQL/MariaDB (GBK编码)
- **运行环境**: Node.js 18+

## 功能特性

- 用户登录（使用游戏账号）
- 密码修改
- 角色资料查看
- Q版可爱UI风格
- 响应式设计

## 开发环境设置

### 1. 安装依赖

```bash
cd cgweb-v2
npm install
```

### 2. 配置环境变量

编辑 `.env.local` 文件：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cgmsv
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 生产部署 (IIS)

### 1. 构建项目

```bash
npm run build
```

### 2. 安装 Node.js 和 iisnode

在服务器上安装：
- Node.js (LTS版本)
- iisnode (用于IIS运行Node.js)

### 3. 配置 IIS

1. 在IIS中创建新网站
2. 指向项目的 `.next` 目录
3. 确保 `web.config` 文件存在
4. 配置 HTTPS 证书

### 4. 启动服务器

```bash
npm start
```

或使用 PM2 管理进程：

```bash
npm install -g pm2
pm2 start npm --name "cgweb" -- start
pm2 save
pm2 startup
```

## 项目结构

```
cgweb-v2/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── login/             # 登录页面
│   ├── profile/           # 用户中心
│   └── globals.css        # 全局样式
├── api/                   # API路由
│   ├── auth/             # 认证相关
│   └── user/             # 用户相关
├── lib/                   # 工具函数
│   ├── db.ts             # 数据库连接
│   ├── session.ts        # 会话管理
│   └── cn.ts             # 通用工具
├── public/               # 静态资源
├── .env.local           # 环境变量
├── next.config.js       # Next.js配置
├── tailwind.config.ts   # Tailwind配置
└── web.config           # IIS配置
```

## 数据库说明

项目使用现有的 `cgmsv` 数据库：

- `tbl_user`: 用户表（GBK编码，明文密码）
- `tbl_character`: 角色表
- `tbl_guild`: 公会表

**重要**: 由于游戏使用GBK编码和明文密码存储，网站保持兼容。

## 安全说明

- 密码采用明文存储是为了兼容游戏客户端
- 生产环境建议配置HTTPS
- 建议配置防火墙限制数据库访问
- 会话使用HttpOnly Cookie

## 配色方案

- 主色: #6c5ce7 (魔法紫色)
- 辅助色: #fdcb6e (阳光黄)
- 背景色: #fff9f0 (暖白)

## 许可证

基于爱好开发，仅供学习交流使用。
