# Briefly 🎯

Your personal AI-powered daily intelligence briefing service.

## What It Does

Briefly delivers personalized daily briefings on the topics you care about:
- **AI** - Latest in artificial intelligence and machine learning
- **Tech** - Technology news and product announcements  
- **Markets** - Financial markets, stocks, and economic updates
- **Science** - Research breakthroughs and discoveries
- **World** - International news and geopolitical developments

## Features

✅ **AI-Curated Content** - No fluff, just what matters  
✅ **Audio + Text** - Listen on your commute or read over coffee  
✅ **Multiple Delivery** - Email, Slack, or webhook  
✅ **Source Transparency** - Every story attributed  
✅ **Smart Learning** - Improves based on your feedback  

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Basic | $9/mo | 1 topic, text, email |
| Pro | $29/mo | 3 topics, audio, Slack, weekend deep dives |
| Team | $99/mo | 5 seats, custom topics, API access |

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (production: PostgreSQL)
- **Payments**: Stripe
- **Voice**: ElevenLabs
- **Email**: Resend
- **Slack**: Slack API

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Initialize database
npm run db:init

# Start development server
npm run dev
```

## Deployment

### Railway (Recommended)
```bash
railway login
railway init
railway up
```

### Render
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Fly.io
```bash
fly launch
fly deploy
```

## Environment Variables

```
PORT=3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PRO=price_...
RESEND_API_KEY=re_...
ELEVENLABS_API_KEY=sk_...
SLACK_BOT_TOKEN=xoxb-...
```

## API Endpoints

- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhook` - Stripe webhook handler
- `GET /api/preferences/:userId` - Get user preferences
- `POST /api/preferences` - Update preferences
- `POST /api/briefing` - Generate test briefing
- `GET /api/briefings/:userId` - Get briefing history

## Roadmap

- [ ] Vector embeddings for semantic search
- [ ] iOS/Android apps
- [ ] Browser extension
- [ ] Custom topic creation
- [ ] Team collaboration features

## License

MIT - Built with 💜 by Lucas
