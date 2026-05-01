# BagSplit Checkout

[English README](README.md)

面向 Bags creator token 的支付链接 Demo，用于数字商品、会员权益、活动门票和粉丝服务购买。

BagSplit Checkout 是一个可运行的黑客松 Demo：创作者创建 checkout link，粉丝打开链接，系统模拟支付并生成收据，创作者可以在 dashboard 查看订单。项目同时接入了 Bags SDK 健康检查、Bags token leaderboard 脱敏快照，以及 Solana devnet transaction proof 验证。

## 黑客松定位

- 赛道：Payments
- 计划项目 token：BagSplit Pay (`BSPAY`)
- 核心想法：让 Bags creator token 不只用于发行和交易，也能进入消费、权益和订单场景
- Demo 状态：checkout / order 已走 API mock 流程，Bags SDK 真实读取生态数据，receipt 支持验证 Solana devnet 交易签名

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Bags SDK
- Solana Web3
- TanStack Query
- Zod
- Vitest 和 Playwright

## 本地启动

```bash
npm install --legacy-peer-deps --ignore-scripts
copy .env.example .env.local
npm run dev
```

打开 http://localhost:3000。

需要配置的环境变量在 `.env.example` 中列出。不要提交 `.env.local`。

## 质量检查

```bash
npm run lint
npm run test
npm run build
npm run check
npm run test:e2e
```

GitHub Actions 会在 push 和 pull request 到 `master` 时运行 `npm run check` 和 Playwright happy path。

## Demo 流程

1. 打开首页，查看 Bags live integration 面板。
2. 创建一个 checkout item。
3. 打开生成的公开 checkout 链接。
4. 通过 orders API 模拟支付。
5. 在 receipt 页面粘贴 Solana devnet transaction signature，验证链上 proof。
6. 在 creator dashboard 查看订单和销售额。

## Bags 与 Solana 集成

- `src/app/api/bags/status/route.ts`：安全的 Bags 集成状态接口
- `src/app/api/bags/auth/route.ts`：server-side Bags auth 连通性探针
- `src/app/api/bags/ecosystem/route.ts`：脱敏后的 Bags token leaderboard 快照
- `src/app/api/solana/proof/route.ts`：Solana devnet 交易签名验证接口

Bags API Key 只在服务端读取，不会返回给浏览器。Bags leaderboard 数据会先脱敏再展示。Receipt 页面可以通过服务端 proof endpoint 验证真实 Solana devnet transaction signature。

## 重要路径

- `src/app/page.tsx`：Demo 首页
- `src/app/create/page.tsx`：创作者 checkout 创建表单
- `src/app/checkout/[id]/page.tsx`：公开 checkout 页面
- `src/app/receipt/[id]/page.tsx`：收据和 devnet proof 页面
- `src/app/dashboard/page.tsx`：创作者订单 dashboard
- `src/app/api/checkouts/route.ts`：checkout item API
- `src/app/api/orders/route.ts`：订单 API
- `src/app/api/demo/reset/route.ts`：Demo 数据重置接口
- `submission/`：公开提交素材和 Demo 脚本

## 部署

仓库包含 `vercel.json`，Vercel 会使用和本地一致的依赖安装参数。

部署平台需要配置这些环境变量：

- `BAGS_API_KEY`
- `BAGS_API_BASE_URL`
- `NEXT_PUBLIC_SOLANA_NETWORK`
- `NEXT_PUBLIC_SOLANA_RPC_URL`
- `NEXT_PUBLIC_APP_NAME`

## 当前限制

- Checkout 和 order 使用内存 mock store，方便快速演示。
- 支付本身是模拟的，但 receipt proof 可以验证真实 Solana devnet 交易签名。
- 正式提交前仍需要在 Bags 上 launch 或 link `BSPAY` token。
