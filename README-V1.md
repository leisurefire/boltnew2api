# bolt2api v1 - OpenAI Compatible API

将 bolt.new 转换为标准的 OpenAI 兼容 API，可用于 OneAPI 等转发服务。

## 快速开始

### 1. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，添加你的 bolt.new cookies：

```env
PORT=8080
BOLT_COOKIES=__session=your_session_token; activeOrganizationId=your_org_id; remember_user_token=your_token
API_KEY=your-secret-api-key
BOLT_PROJECT_ID=49956303
```

### 2. 获取 Cookies

1. 登录 https://bolt.new
2. 打开浏览器开发者工具 (F12)
3. 进入 Application/存储 → Cookies → https://bolt.new
4. 复制所有 cookies，格式为：`name1=value1; name2=value2; ...`

个人账号需要的 cookies：
- `_stackblitz_session`
- `sb_session`
- `sb_user_id`

团队账号需要的 cookies：
- `__session`
- `activeOrganizationId`
- `remember_user_token`

### 3. 启动服务

```bash
npm install
npm start
```

服务将在 `http://localhost:8080` 启动。

## API 端点

### OpenAI 兼容端点

```
POST /v1/chat/completions
```

标准的 OpenAI chat completions API 格式：

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-api-key" \
  -d '{
    "model": "claude-sonnet",
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "stream": false
  }'
```

注意：如果环境变量中设置了 `API_KEY`，则必须在请求头中包含正确的 Authorization。

### 其他端点

- `GET /v1` - API 信息
- `GET /v1/models` - 可用模型列表
- `GET /health` - 健康检查

## Zeabur 部署

### 方法 1: 从 GitHub 部署

1. 将代码推送到 GitHub
2. 在 Zeabur 创建新项目
3. 选择你的 GitHub 仓库
4. 添加环境变量：
   - `BOLT_COOKIES`: 你的 bolt.new cookies
   - `BOLT_PROJECT_ID`: (可选) 项目ID
   - `PORT`: (可选) 默认 8080

### 方法 2: 使用 CLI

```bash
# 安装 Zeabur CLI
npm i -g @zeabur/cli

# 登录
zeabur auth login

# 部署
zeabur deploy
```

## 配合 OneAPI 使用

1. 在 OneAPI 添加新渠道
2. 类型选择：OpenAI
3. Base URL 填写：`https://your-domain.zeabur.app/v1`
4. API Key 填写你在环境变量中设置的 `API_KEY`（如果设置了的话）
5. 模型选择：`claude-sonnet` 或 `claude-3.5-sonnet`

## 响应格式

### 非流式响应

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "claude-3.5-sonnet",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "响应内容"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0
  }
}
```

### 流式响应

设置 `"stream": true` 将返回 SSE 格式的流式数据。

## 环境变量

| 变量 | 必需 | 说明 | 默认值 |
|------|------|------|--------|
| `BOLT_COOKIES` | ✅ | bolt.new session cookies | - |
| `API_KEY` | ❌ | API 密钥（推荐设置） | - |
| `PORT` | ❌ | 服务端口 | 8080 |
| `BOLT_PROJECT_ID` | ❌ | 默认项目ID | 49956303 |

## 注意事项

1. **Cookies 安全**：确保妥善保管你的 cookies，不要泄露给他人
2. **Cookies 过期**：bolt.new cookies 会过期，需要定期更新环境变量
3. **请求限制**：遵守 bolt.new 的使用限制和配额
4. **仅用于个人**：此项目仅供个人学习和使用

## 许可

MIT License
