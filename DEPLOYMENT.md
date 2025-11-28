# Zeabur 部署指南

## 部署前准备

### 1. 获取 bolt.new Cookies

1. 打开浏览器访问 https://bolt.new
2. 登录你的账号
3. 按 F12 打开开发者工具
4. 前往 Application → Cookies → https://bolt.new
5. 复制以下 cookies（根据账号类型）：

**个人账号：**
- `_stackblitz_session`
- `sb_session`
- `sb_user_id`

**团队账号：**
- `__session`
- `activeOrganizationId`
- `remember_user_token`
- `bolt_oauth_provider` (如果有)

6. 格式化为：`name1=value1; name2=value2; name3=value3`

### 2. 准备代码仓库

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit for bolt2api v1"

# 推送到 GitHub
git remote add origin https://github.com/your-username/bolt2api.git
git push -u origin main
```

## Zeabur 部署步骤

### 方法 1: Web 界面部署（推荐）

1. **创建账号**
   - 访问 https://zeabur.com
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择区域（推荐：Hong Kong 或 Singapore）
   - 为项目命名

3. **添加服务**
   - 点击 "Add Service"
   - 选择 "Git Repository"
   - 授权 Zeabur 访问你的 GitHub
   - 选择 bolt2api 仓库

4. **配置环境变量**
   - 点击服务卡片
   - 进入 "Variables" 标签
   - 添加以下变量：
     ```
     BOLT_COOKIES=你的完整cookies字符串
     PORT=8080
     NODE_ENV=production
     ```
   - （可选）添加 `BOLT_PROJECT_ID`

5. **部署**
   - Zeabur 会自动检测 Node.js 项目
   - 等待构建和部署完成（约 1-2 分钟）
   - 部署成功后会显示服务 URL

6. **绑定域名**（可选）
   - 在 "Domains" 标签中
   - 可以使用 Zeabur 提供的免费域名
   - 或绑定自己的域名

### 方法 2: CLI 部署

```bash
# 安装 Zeabur CLI
npm install -g @zeabur/cli

# 登录
zeabur auth login

# 部署
zeabur deploy

# 按照提示选择项目和服务
```

## 部署后验证

### 1. 健康检查

```bash
curl https://your-service.zeabur.app/health
```

预期响应：
```json
{
  "success": true,
  "status": "ready",
  "message": "Service is running",
  "timestamp": "2025-11-28T...",
  "version": "1.0.0"
}
```

### 2. 测试 API

```bash
curl -X POST https://your-service.zeabur.app/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3.5-sonnet",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 3. 查看日志

在 Zeabur 控制台：
- 进入服务详情
- 点击 "Logs" 标签
- 查看实时日志输出

## 环境变量管理

### 更新 Cookies

当 cookies 过期时：

1. 在 Zeabur 控制台进入服务
2. 前往 "Variables" 标签
3. 更新 `BOLT_COOKIES` 的值
4. 服务会自动重启

### 环境变量清单

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `BOLT_COOKIES` | ✅ | bolt.new 认证 cookies | `__session=xxx; activeOrganizationId=yyy` |
| `PORT` | ❌ | 服务端口 | `8080` |
| `NODE_ENV` | ❌ | 运行环境 | `production` |
| `BOLT_PROJECT_ID` | ❌ | 默认项目 ID | `49956303` |

## 域名配置

### 使用 Zeabur 免费域名

Zeabur 自动分配：`your-service-xxx.zeabur.app`

### 绑定自定义域名

1. 在 Zeabur 控制台添加域名
2. 获取 CNAME 记录
3. 在域名 DNS 设置中添加 CNAME：
   ```
   api.yourdomain.com  →  xxx.zeabur.app
   ```
4. 等待 DNS 传播（通常 5-10 分钟）

## 性能优化

### 1. 启用 HTTP/2

Zeabur 默认启用，无需配置。

### 2. 设置资源限制

在 Zeabur 控制台：
- Resources 标签
- 根据需求调整 CPU 和内存

推荐配置：
- CPU: 0.5 vCPU
- Memory: 512 MB

### 3. 监控配置

Zeabur 自动提供：
- CPU 使用率
- 内存使用率
- 请求数量
- 响应时间

## 成本估算

Zeabur 定价（参考）：
- 免费套餐：每月 $5 免费额度
- 按量付费：根据实际使用计费

基本使用（每天 100 请求）：
- 预计费用：$0-2/月

## 故障排查

### 问题：服务无法启动

**检查项：**
1. 环境变量是否正确设置
2. 查看 Zeabur 日志中的错误信息
3. 确认 `package.json` 中的 `start` 脚本正确

### 问题：API 返回 500 错误

**检查项：**
1. `BOLT_COOKIES` 是否过期
2. Cookies 格式是否正确
3. bolt.new 服务是否正常

### 问题：请求超时

**检查项：**
1. bolt.new 响应时间是否过长
2. Zeabur 服务区域是否离用户较远
3. 考虑切换到更近的区域

## 安全建议

1. **保护 Cookies**
   - 不要在公开代码中硬编码 cookies
   - 仅在 Zeabur 环境变量中设置
   - 定期更换 cookies

2. **访问控制**
   - 考虑添加 API Key 认证
   - 使用反向代理限制访问
   - 监控异常请求

3. **日志管理**
   - 不要记录敏感信息
   - 定期检查日志
   - 设置日志保留期限

## 更新服务

### 自动部署

Zeabur 支持 Git 自动部署：

1. 推送代码到 GitHub：
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. Zeabur 自动检测并重新部署

### 手动部署

在 Zeabur 控制台：
1. 进入服务详情
2. 点击 "Redeploy" 按钮

## 回滚版本

如果新版本有问题：

1. 在 Zeabur 控制台找到部署历史
2. 选择之前的稳定版本
3. 点击 "Rollback" 回滚

## 监控和告警

建议使用外部监控服务：

### UptimeRobot (免费)
```
监控 URL: https://your-service.zeabur.app/health
检查间隔: 5 分钟
告警方式: 邮件/Telegram
```

### Healthchecks.io
```bash
# 添加到 cron 任务
*/5 * * * * curl https://hc-ping.com/YOUR-UUID && curl https://your-service.zeabur.app/health
```

## 支持的地区

Zeabur 可用区域：
- 🇭🇰 Hong Kong（推荐，中国大陆访问快）
- 🇸🇬 Singapore
- 🇺🇸 United States
- 🇪🇺 Europe

## 迁移到其他平台

如果需要迁移到其他平台（Railway, Render 等）：

1. 确保设置相同的环境变量
2. 使用 `npm start` 作为启动命令
3. 端口使用 `process.env.PORT`
4. 其他配置基本通用

## 获取帮助

- Zeabur 文档：https://zeabur.com/docs
- GitHub Issues：https://github.com/your-username/bolt2api/issues
- Zeabur Discord：https://discord.gg/zeabur
