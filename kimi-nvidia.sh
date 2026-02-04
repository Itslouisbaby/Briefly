#!/bin/bash
# NVIDIA API Kimi K2.5 Chat Completion Script
# Usage: ./kimi-nvidia.sh "Your prompt here"

API_KEY="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"
ENDPOINT="https://integrate.api.nvidia.com/v1/chat/completions"

# Check if prompt provided
if [ -z "$1" ]; then
    echo "Usage: $0 'Your prompt here'"
    exit 1
fi

PROMPT="$1"
STREAM="${STREAM:-true}"

# Set accept header based on stream mode
if [ "$STREAM" = "true" ]; then
    accept_header='Accept: text/event-stream'
else
    accept_header='Accept: application/json'
fi

# Create payload
cat > payload.json <<EOF
{
  "model": "moonshotai/kimi-k2.5",
  "messages": [{"role":"user","content":"$PROMPT"}],
  "max_tokens": 16384,
  "temperature": 1.00,
  "top_p": 1.00,
  "stream": $STREAM,
  "chat_template_kwargs": {"thinking":true}
}
EOF

# Make the request
echo "Sending request to NVIDIA API..."
curl -s "$ENDPOINT" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "$accept_header" \
  -d @payload.json

# Cleanup
rm -f payload.json
