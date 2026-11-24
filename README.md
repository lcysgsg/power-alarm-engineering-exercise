# Power Alarm Engineering Exercise

电力设备告警管理工程实操。基于模拟厂站与遥信事件的 Java + Vue 小型项目，不连接任何生产系统。

> 参加实操请阅读 [CANDIDATE.md](./CANDIDATE.md)。

## 技术栈

- Java 17、Spring Boot 4.1.1、MyBatis-Plus 3.5.17、H2
- Vue 3、TypeScript、Vite、Axios
- GitHub Actions 基线检查

## 环境要求

- JDK 17+
- Maven 3.6.3+（推荐 3.9+）
- Node.js 20.19+ 或 22.12+（推荐 Node 22）
- npm

## 启动

后端：

```bash
cd backend
mvn spring-boot:run
```

另开终端启动前端：

```bash
cd frontend
npm install
npm run dev
```

打开 http://localhost:5173 。后端健康检查：http://localhost:8080/api/health 。

数据库为 H2 内存模式，重启后端会恢复初始数据。H2 Console：http://localhost:8080/h2-console ，JDBC URL 为 `jdbc:h2:mem:power_alarm`，用户名 `sa`，密码留空。

## 基线功能

- 告警列表及确认状态筛选
- 告警人工确认
- 模拟遥信事件接收
- 示例事件重放
- 统一 API 错误响应
- 后端冒烟测试和前端构建检查

事件重放（Node.js，无额外脚本依赖）：

```bash
node scripts/replay-events.mjs
node scripts/replay-events.mjs --twice
```

也可以在页面点击“发送示例事件”，重复点击会发送相同事件 ID。

## 项目结构

```text
backend/             Spring Boot API / H2 / JUnit
frontend/            Vue 3 / TypeScript
fixtures/            虚构事件数据
scripts/             模拟事件重放
docs/DOMAIN.md       简化业务规则与术语
docs/ARCHITECTURE.md 代码结构、API 与数据模型
CANDIDATE.md         候选人任务说明
AGENTS.md            编码代理工程约束
```

## 验证基线

```bash
cd backend && mvn test
cd frontend && npm run build
```

本项目仅用于技术评估与学习，所有站点、设备、信号和数据均为虚构。

## 异步考察与公开检查

- 先阅读 [CANDIDATE.md](./CANDIDATE.md)，按指定任务完成；[SUBMISSION.md](./SUBMISSION.md) 提供简短交付模板。
- 建议实际投入 45 分钟（含验证及交付说明），环境准备单独估计；允许部分完成，后续约 15 分钟代码交流。
- 从仓库根目录运行以下命令。HTTP 检查需运行本地后端（默认 http://127.0.0.1:8080，可设 API_BASE_URL）；仅用于模拟数据，脚本会写入新的验收记录，不要连接生产环境。

```bash
node scripts/check-env.mjs
node scripts/baseline-http-smoke.mjs
node scripts/check-task.mjs A
```

基线检查检验原有功能（初始仓库应通过），任务检查检验新需求（未修复前预期失败）。每个场景独立生成数据，重复执行无需手工清表；重启 H2 内存后端可清理全部模拟记录。输出 PASS/FAIL 和汇总，退出码 0 为全部通过、1 为存在失败、2 为环境阻塞/调用方式错误。HTTP 结果不等于浏览器验收；前端页面请按题单手工检查。现有 Maven 测试、前端构建和 CI 仍保留。

默认只验收 A；只有另行指定 B 时运行 node scripts/check-task.mjs B，不要求两个任务同时完成。B 检查包含小规模并发重试，不能证明生产级并发可靠性。
