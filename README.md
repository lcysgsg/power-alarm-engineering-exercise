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
