#!/bin/bash

echo "======================================"
echo "bolt2api v1 API 测试脚本"
echo "======================================"
echo ""

API_URL="${1:-http://localhost:8080}"
API_KEY="${API_KEY:-}"

echo "测试 URL: $API_URL"
echo ""

# 测试 1: Health Check
echo "📋 测试 1: Health Check"
echo "GET $API_URL/health"
curl -s "$API_URL/health" | jq '.' || curl -s "$API_URL/health"
echo ""
echo ""

# 测试 2: 模型列表
echo "📋 测试 2: 模型列表"
echo "GET $API_URL/v1/models"
curl -s "$API_URL/v1/models" | jq '.' || curl -s "$API_URL/v1/models"
echo ""
echo ""

# 测试 3: API 信息
echo "📋 测试 3: API 信息"
echo "GET $API_URL/v1"
curl -s "$API_URL/v1" | jq '.' || curl -s "$API_URL/v1"
echo ""
echo ""

# 测试 4: Chat Completions (需要 API_KEY)
echo "📋 测试 4: Chat Completions"
if [ -n "$API_KEY" ]; then
    echo "POST $API_URL/v1/chat/completions (with API Key)"
    curl -s "$API_URL/v1/chat/completions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $API_KEY" \
        -d '{
            "model": "claude-sonnet",
            "messages": [
                {"role": "user", "content": "Say hello in one word"}
            ],
            "stream": false
        }' | jq '.' || echo "请求失败，查看服务器日志"
else
    echo "跳过 (请设置 API_KEY 环境变量)"
    echo "示例: API_KEY=your-key ./test-api.sh"
fi
echo ""
echo ""

echo "======================================"
echo "测试完成"
echo "======================================"
