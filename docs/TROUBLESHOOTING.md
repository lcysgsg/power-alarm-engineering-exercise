# 启动与调试

## 端口

- 后端：8080（`/api/health`）
- 前端：5173（Vite）
- H2 控制台：8080/h2-console（JDBC `jdbc:h2:mem:power_alarm`；用户 `sa`；密码为空）

如果端口占用，可以先退出占用服务再启动。前端可用 `npm run dev -- --port 5174` 更换端口。

## 环境

```bash
java -version
mvn -version
node -v
npm -v
```

## API 连接失败

先检查后端是否启动，以及 `http://localhost:8080/api/health` 是否返回 UP；再检查浏览器 Network 的 `/api` 请求和 Vite 代理。

## 数据消失

H2 为内存数据库，重启后端会重置示例数据；刷新浏览器不会重置。

## 数据重复复现

```bash
node scripts/replay-events.mjs --twice
```

需要还原最初状态时重启后端。
