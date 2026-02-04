# Briefly Deployment Guide

## Quick Deploy to Railway

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```
This will open a browser window to authenticate.

### 3. Initialize Project
```bash
railway init
```
Select "Create New Project" and name it "briefly"

### 4. Deploy
```bash
railway up
```

### 5. Add Environment Variables
In Railway dashboard, add these variables:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` 
- `RESEND_API_KEY`
- `ELEVENLABS_API_KEY`
- `NODE_ENV=production`

### 6. Get Domain
Railway will provide a domain like `briefly.up.railway.app`

## Alternative: Deploy to Render

1. Push code to GitHub
2. Connect GitHub repo to Render
3. Use `render.yaml` for automatic configuration

## Getting API Keys

### Stripe
1. Go to https://dashboard.stripe.com/register
2. Create account
3. Get test keys from Developers > API Keys
4. For production, activate account

### Resend (Email)
1. Go to https://resend.com
2. Sign up
3. Get API key
4. Verify domain

### ElevenLabs (Voice)
1. Go to https://elevenlabs.io
2. Sign up
3. Get API key
4. Free tier: 10k characters/month

## Testing Payment Flow

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future date, any CVC
3. Check dashboard for successful payment

## Launch Checklist

- [ ] Deploy to Railway
- [ ] Configure Stripe
- [ ] Test payment flow
- [ ] Add custom domain (optional)
- [ ] Post on IndieHackers
- [ ] Share with 5 beta users
- [ ] Collect feedback
- [ ] Iterate

## Revenue Targets

- Week 1: 5 users = $100 MRR
- Month 1: 20 users = $400 MRR
- Month 3: 50 users = $1,450 MRR
- Month 6: 200 users = $5,800 MRR
