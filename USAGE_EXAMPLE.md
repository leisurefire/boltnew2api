# 使用示例

## 本地测试

### 1. 配置环境变量

```bash
# 创建 .env 文件
cat > .env << 'EOF'
PORT=8080
BOLT_COOKIES=__session=your_session_token_here; activeOrganizationId=your_org_id; remember_user_token=your_token
BOLT_PROJECT_ID=49956303
NODE_ENV=production
EOF
```

### 2. 启动服务

```bash
npm install
npm start
```

### 3. 测试请求

#### 非流式请求

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3.5-sonnet",
    "messages": [
      {
        "role": "user",
        "content": "写一个 Hello World 的 Python 程序"
      }
    ],
    "stream": false
  }'
```

#### 流式请求

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3.5-sonnet",
    "messages": [
      {
        "role": "user",
        "content": "解释什么是递归"
      }
    ],
    "stream": true
  }'
```

#### 查看可用模型

```bash
curl http://localhost:8080/v1/models
```

#### 健康检查

```bash
curl http://localhost:8080/health
```

## Zeabur 部署

### 通过 Web 界面部署

1. 访问 [Zeabur Dashboard](https://dash.zeabur.com)
2. 创建新项目
3. 点击 "Add Service" → "Git Repository"
4. 选择你的 GitHub 仓库
5. Zeabur 会自动检测 Node.js 项目并部署
6. 在 "Variables" 标签页添加环境变量：
   ```
   BOLT_COOKIES=你的cookies
   PORT=8080
   ```
7. 部署完成后，你会得到一个域名，如：`https://your-service.zeabur.app`

### 使用域名

部署完成后，你的 API 地址为：

```
https://your-service.zeabur.app/v1/chat/completions
```

## 配合 OneAPI 使用

### 在 OneAPI 中配置

1. 登录 OneAPI 管理后台
2. 进入 "渠道管理" → "添加渠道"
3. 填写配置：
   ```
   名称: bolt2api
   类型: OpenAI
   Base URL: https://your-service.zeabur.app/v1
   密钥: (留空或随意填写，不会被使用)
   模型: claude-3.5-sonnet
   ```
4. 保存并启用渠道

### 通过 OneAPI 调用

```bash
curl -X POST https://your-oneapi-domain.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ONEAPI_TOKEN" \
  -d '{
    "model": "claude-3.5-sonnet",
    "messages": [
      {
        "role": "user",
        "content": "Hello"
      }
    ]
  }'
```

## Python 调用示例

```python
import requests

url = "http://localhost:8080/v1/chat/completions"

payload = {
    "model": "claude-3.5-sonnet",
    "messages": [
        {"role": "user", "content": "用Python写一个快速排序"}
    ],
    "stream": False
}

response = requests.post(url, json=payload)
result = response.json()

print(result["choices"][0]["message"]["content"])
```

## Node.js 调用示例

```javascript
const fetch = require('node-fetch');

async function chat(message) {
  const response = await fetch('http://localhost:8080/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3.5-sonnet',
      messages: [
        { role: 'user', content: message }
      ],
      stream: false
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

chat('什么是 Docker？').then(console.log);
```

## 使用 OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="dummy"  # 可以是任意值
)

response = client.chat.completions.create(
    model="claude-3.5-sonnet",
    messages=[
        {"role": "user", "content": "介绍一下 Kubernetes"}
    ]
)

print(response.choices[0].message.content)
```

## 故障排查

### 1. "BOLT_COOKIES not set" 错误

确保在 `.env` 文件或 Zeabur 环境变量中正确设置了 `BOLT_COOKIES`。

### 2. 认证失败

- 检查 cookies 是否过期
- 重新登录 bolt.new 并获取新的 cookies
- 确保复制了所有必要的 cookies

### 3. 连接超时

- 检查网络连接
- 确认 bolt.new 服务正常
- 查看服务器日志获取详细错误信息

## 常见问题

### Q: Cookies 多久过期？
A: 通常 24-48 小时，需要定期更新。

### Q: 可以同时配置多个账号吗？
A: 当前版本不支持，只能使用一个账号的 cookies。

### Q: 支持哪些模型？
A: 目前返回的模型是 `claude-3.5-sonnet`，实际调用 bolt.new 的默认模型。

### Q: 流式响应工作正常吗？
A: 支持流式响应，但 bolt.new 原生响应可能不是标准流式格式，服务会进行转换。
