# 快速开始指南

## 5 分钟部署到 Zeabur

### 步骤 1: 获取 Cookies (2 分钟)

1. 打开浏览器访问 https://bolt.new 并登录
2. 按 `F12` 打开开发者工具
3. 进入 `Application` → `Cookies` → `https://bolt.new`
4. 找到并复制以下 cookies：

**团队账号（推荐）：**
```
__session=xxx
activeOrganizationId=xxx
remember_user_token=xxx
```

**个人账号：**
```
_stackblitz_session=xxx
sb_session=xxx
sb_user_id=xxx
```

5. 格式化为一行：
```
__session=xxx; activeOrganizationId=xxx; remember_user_token=xxx
```

### 步骤 2: 部署到 Zeabur (2 分钟)

1. 访问 https://zeabur.com 并用 GitHub 登录
2. 点击 `New Project`
3. 点击 `Add Service` → `Git Repository`
4. 选择你的仓库（或 Fork 本项目）
5. 在 `Variables` 标签添加环境变量：

```
BOLT_COOKIES=你的cookies字符串
API_KEY=sk-随机生成一个密钥
PORT=8080
```

6. 等待部署完成（约 1-2 分钟）

### 步骤 3: 测试 API (1 分钟)

获取你的域名（例如 `https://your-service.zeabur.app`），然后测试：

```bash
# 健康检查
curl https://your-service.zeabur.app/health

# 测试聊天
curl -X POST https://your-service.zeabur.app/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-你的密钥" \
  -d '{
    "model": "claude-sonnet",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## 配合 OneAPI 使用

在 OneAPI 添加渠道：

```
类型: OpenAI
名称: bolt2api
Base URL: https://your-service.zeabur.app/v1
密钥: sk-你的密钥
模型: claude-sonnet
```

保存后即可使用！

## 常见问题

### Q: 获取 cookies 后能用多久？
A: 通常 24-48 小时，需要定期更新。

### Q: 如何生成 API_KEY？
A: 可以使用任意字符串，推荐格式：`sk-` + 随机字符，例如：
```bash
echo "sk-$(openssl rand -hex 16)"
```

### Q: 部署失败怎么办？
A: 检查 Zeabur 日志，确保：
1. `BOLT_COOKIES` 格式正确
2. 仓库包含 `package.json` 和 `v1-server.js`
3. 环境变量没有多余空格

### Q: 请求返回错误？
A: 检查：
1. Cookies 是否过期
2. API_KEY 是否正确
3. 查看 Zeabur 服务日志获取详细错误

## 本地开发

```bash
# 克隆仓库
git clone <your-repo>
cd bolt2api

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 安装依赖
npm install

# 启动服务
npm start

# 测试
./test-api.sh http://localhost:8080
```

## 安全建议

1. ✅ **务必设置 API_KEY**：保护你的服务不被滥用
2. ✅ **定期更换 Cookies**：提高安全性
3. ✅ **不要公开你的 API_KEY**：不要提交到 Git
4. ✅ **监控使用情况**：定期检查 Zeabur 日志
5. ✅ **限制访问**：如果可能，配置 IP 白名单

## 需要帮助？

- 📖 查看完整文档：[README-V1.md](README-V1.md)
- 🚀 部署指南：[DEPLOYMENT.md](DEPLOYMENT.md)
- 💡 使用示例：[USAGE_EXAMPLE.md](USAGE_EXAMPLE.md)
- 🐛 遇到问题？提交 Issue 到 GitHub
