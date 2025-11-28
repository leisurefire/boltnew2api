const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
require('dotenv').config();

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

function generateRequestId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function parseBoltCookies(cookieString) {
  const cookies = {};
  let organizationId = null;
  let accountType = 'individual';

  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = value;
        if (name === 'activeOrganizationId') {
          organizationId = value;
          accountType = 'team';
        }
      }
    });
  }

  return { cookies, organizationId, accountType };
}

function createBoltHeaders(session, projectId) {
  const headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/json',
    'Origin': 'https://bolt.new',
    'Priority': 'u=1, i',
    'Referer': `https://bolt.new/~/sb1-${projectId}`,
    'Sec-Ch-Ua': '"Google Chrome";v="137", "Not/A)Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    'X-Bolt-Client-Revision': 'd65f6d0',
    'X-Bolt-Project-Id': projectId,
    'Cookie': Object.entries(session.cookies).map(([k, v]) => `${k}=${v}`).join('; ')
  };

  if (session.accountType === 'team' && session.organizationId) {
    headers['X-Organization-Id'] = session.organizationId;
  }

  return headers;
}

function convertMessagesToBoltFormat(messages) {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

app.get('/v1', (req, res) => {
  res.json({
    success: true,
    message: 'bolt2api v1 - OpenAI Compatible API',
    version: '1.0.0',
    endpoints: {
      chat: '/v1/chat/completions',
      models: '/v1/models'
    }
  });
});

app.get('/v1/models', (req, res) => {
  res.json({
    object: 'list',
    data: [
      {
        id: 'claude-sonnet',
        object: 'model',
        created: Date.now(),
        owned_by: 'bolt.new'
      },
      {
        id: 'claude-3.5-sonnet',
        object: 'model',
        created: Date.now(),
        owned_by: 'bolt.new'
      }
    ]
  });
});

app.post('/v1/chat/completions', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const apiKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const expectedApiKey = process.env.API_KEY;

    if (expectedApiKey && apiKey !== expectedApiKey) {
      return res.status(401).json({
        error: {
          message: 'Invalid API key',
          type: 'authentication_error',
          code: 'invalid_api_key'
        }
      });
    }

    const cookiesFromEnv = process.env.BOLT_COOKIES;

    if (!cookiesFromEnv) {
      return res.status(500).json({
        error: {
          message: 'Server configuration error: BOLT_COOKIES not set',
          type: 'server_error',
          code: 'missing_cookies'
        }
      });
    }

    const session = parseBoltCookies(cookiesFromEnv);
    const { messages, stream = false, model = 'claude-sonnet' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: {
          message: 'Invalid request: messages array required',
          type: 'invalid_request_error',
          code: 'invalid_messages'
        }
      });
    }

    const userMessage = messages[messages.length - 1].content;
    const projectId = process.env.BOLT_PROJECT_ID || '49956303';

    const chatRequest = {
      id: generateRequestId(),
      errorReasoning: null,
      featurePreviews: { diffs: false, reasoning: false },
      framework: 'DEFAULT_TO_DEV',
      isFirstPrompt: false,
      messages: convertMessagesToBoltFormat(messages),
      metrics: { importFilesLength: 0, fileChangesLength: 0 },
      projectId: projectId,
      promptMode: 'discussion',
      stripeStatus: 'not-configured',
      supportIntegrations: true,
      usesInspectedElement: false
    };

    const headers = createBoltHeaders(session, projectId);

    console.log('📤 Sending request to bolt.new:', {
      projectId,
      messageCount: messages.length,
      accountType: session.accountType
    });

    const response = await fetch('https://bolt.new/api/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify(chatRequest)
    });

    console.log('📥 Bolt.new response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Bolt API error:', errorText);
      return res.status(response.status).json({
        error: {
          message: `Bolt API error: ${response.statusText}`,
          type: 'api_error',
          code: 'bolt_api_error',
          details: errorText.substring(0, 200)
        }
      });
    }

    const responseText = await response.text();
    console.log('✅ Response received, length:', responseText.length);

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const id = `chatcmpl-${generateRequestId()}`;
      const created = Math.floor(Date.now() / 1000);

      res.write(`data: ${JSON.stringify({
        id,
        object: 'chat.completion.chunk',
        created,
        model,
        choices: [{
          index: 0,
          delta: { role: 'assistant', content: responseText },
          finish_reason: null
        }]
      })}\n\n`);

      res.write(`data: ${JSON.stringify({
        id,
        object: 'chat.completion.chunk',
        created,
        model,
        choices: [{
          index: 0,
          delta: {},
          finish_reason: 'stop'
        }]
      })}\n\n`);

      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      res.json({
        id: `chatcmpl-${generateRequestId()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: responseText
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      });
    }

  } catch (error) {
    console.error('❌ Chat completion error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: {
        message: error.message || 'Internal server error',
        type: 'internal_error',
        code: 'processing_error',
        details: error.toString()
      }
    });
  }
});

app.get('/health', (req, res) => {
  const hasValidConfig = !!process.env.BOLT_COOKIES;
  res.json({
    success: true,
    status: hasValidConfig ? 'ready' : 'configuration_required',
    message: hasValidConfig ? 'Service is running' : 'BOLT_COOKIES environment variable required',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Not found',
      type: 'invalid_request_error',
      code: 'not_found'
    },
    available_endpoints: [
      '/v1/chat/completions',
      '/v1/models',
      '/health'
    ]
  });
});

app.listen(port, () => {
  console.log(`🚀 bolt2api v1 server running on port ${port}`);
  console.log(`📍 OpenAI Compatible endpoint: http://localhost:${port}/v1/chat/completions`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
  console.log(`⚙️  Cookies configured: ${!!process.env.BOLT_COOKIES}`);
});

module.exports = app;
