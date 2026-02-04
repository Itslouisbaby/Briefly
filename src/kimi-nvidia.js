// NVIDIA API Kimi K2.5 Client for Briefly
// Usage: import { kimiChat } from './kimi-nvidia.js';

const API_KEY = process.env.NVIDIA_API_KEY || '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';
const ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';

export async function kimiChat(prompt, options = {}) {
  const {
    stream = true,
    maxTokens = 16384,
    temperature = 1.0,
    topP = 1.0,
    thinking = true
  } = options;

  const payload = {
    model: 'moonshotai/kimi-k2.5',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
    stream,
    chat_template_kwargs: { thinking }
  };

  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': stream ? 'text/event-stream' : 'application/json'
  };

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`NVIDIA API error: ${response.status} ${await response.text()}`);
  }

  if (stream) {
    return response.body; // Return readable stream for SSE processing
  }

  return await response.json();
}

// Example usage for non-streaming
export async function kimiChatSimple(prompt) {
  const result = await kimiChat(prompt, { stream: false });
  return result.choices?.[0]?.message?.content;
}

// Example SSE streaming handler
export async function* kimiChatStream(prompt) {
  const stream = await kimiChat(prompt, { stream: true });
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch (e) {
          // Ignore parse errors for incomplete chunks
        }
      }
    }
  }
}

export default { kimiChat, kimiChatSimple, kimiChatStream };
