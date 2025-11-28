# bolt2api - OpenAI Compatible API for bolt.new

将 bolt.new 转换为标准的 OpenAI 兼容 API，可用于 OneAPI、LobeChat 等各类 AI 应用。

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com)

## ✨ 特性

- 🔌 **OpenAI 兼容** - 标准的 `/v1/chat/completions` 接口
- 🔐 **API Key 认证** - 支持 Bearer Token 身份验证
- 🚀 **一键部署** - 支持 Zeabur、Railway、Render 等平台
- 🔄 **流式响应** - 支持 SSE 流式输出
- 👥 **多账号支持** - 同时支持个人和团队账号
- 📝 **详细日志** - 便于调试和监控
- 🛡️ **安全可靠** - Cookies 存储在环境变量中

## 🚀 快速开始

### 方法 1: 一键部署到 Zeabur（推荐）

1. 点击上方的 "Deploy on Zeabur" 按钮
2. 设置环境变量：
   ```
   BOLT_COOKIES=你的bolt.new cookies
   API_KEY=sk-你的密钥
   ```
3. 部署完成，开始使用！

详细步骤：[快速开始指南](QUICK_START.md)

### 方法 2: 本地运行

```bash
# 克隆仓库
git clone https://github.com/your-username/bolt2api.git
cd bolt2api

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 安装依赖
npm install

# 启动服务
npm start
```

## 📖 文档

- 📘 [快速开始](QUICK_START.md) - 5 分钟快速部署指南
- 📗 [完整文档](README-V1.md) - 详细的功能说明
- 📙 [部署指南](DEPLOYMENT.md) - Zeabur 部署详细步骤
- 📕 [使用示例](USAGE_EXAMPLE.md) - 各种语言的调用示例
- 📓 [更新日志](CHANGELOG.md) - 版本更新记录

## 🔧 环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `BOLT_COOKIES` | ✅ | bolt.new 的 session cookies |
| `API_KEY` | 推荐 | API 密钥，用于认证 |
| `PORT` | ❌ | 服务端口（默认 8080） |
| `BOLT_PROJECT_ID` | ❌ | 默认项目 ID |

## 📡 API 端点

### 主要端点

```
POST /v1/chat/completions  - OpenAI 兼容的聊天接口
GET  /v1/models            - 可用模型列表
GET  /v1                   - API 信息
GET  /health               - 健康检查
```

### 使用示例

```bash
curl -X POST https://your-domain.zeabur.app/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "claude-sonnet",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## 🔗 集成示例

### OneAPI

```
类型: OpenAI
Base URL: https://your-domain.zeabur.app/v1
密钥: your-api-key
模型: claude-sonnet
```

### LobeChat

```javascript
{
  "baseURL": "https://your-domain.zeabur.app/v1",
  "apiKey": "your-api-key",
  "model": "claude-sonnet"
}
```

### Python (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://your-domain.zeabur.app/v1",
    api_key="your-api-key"
)

response = client.chat.completions.create(
    model="claude-sonnet",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## 🛡️ 安全建议

1. ✅ 务必设置 `API_KEY` 保护你的服务
2. ✅ 定期更换 bolt.new cookies
3. ✅ 不要将 API Key 提交到代码仓库
4. ✅ 监控 API 使用情况
5. ✅ 考虑使用 IP 白名单

## 🤝 支持的模型

- `claude-sonnet` (默认)
- `claude-3.5-sonnet`

实际调用 bolt.new 的默认 AI 模型。

## 📝 获取 Cookies

1. 登录 https://bolt.new
2. 打开浏览器开发者工具 (F12)
3. Application → Cookies → https://bolt.new
4. 复制所需 cookies

**团队账号**：
- `__session`
- `activeOrganizationId`
- `remember_user_token`

**个人账号**：
- `_stackblitz_session`
- `sb_session`
- `sb_user_id`

格式：`name1=value1; name2=value2; name3=value3`

## 🐛 故障排查

### 认证错误
- 检查 cookies 是否过期
- 重新登录 bolt.new 获取新 cookies

### API Key 错误
- 确认请求头包含正确的 Authorization
- 验证环境变量 `API_KEY` 已设置

### 连接超时
- 检查网络连接
- 确认 bolt.new 服务正常
- 查看服务日志获取详细信息

详见：[故障排查指南](USAGE_EXAMPLE.md#故障排查)

## 📊 测试

```bash
# 运行测试脚本
./test-api.sh https://your-domain.zeabur.app

# 或本地测试
API_KEY=your-key ./test-api.sh http://localhost:8080
```

## 🌟 特别说明

- 本项目仅供学习和个人使用
- 请遵守 bolt.new 的使用条款
- 不要滥用服务造成负载
- Cookies 会过期，需定期更新

## 📄 许可证

MIT License

## 🙏 致谢

感谢 [bolt.new](https://bolt.new) 提供的优秀服务。

---

**快速链接**

- 🚀 [5分钟快速部署](QUICK_START.md)
- 📖 [完整使用文档](README-V1.md)
- 💬 [提交问题](https://github.com/your-username/bolt2api/issues)
- ⭐ [Star 本项目](https://github.com/your-username/bolt2api)
