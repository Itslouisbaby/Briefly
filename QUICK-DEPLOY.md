# 🚀 Briefly - Quick Deploy Guide

## Option 1: Deploy to Render (Easiest - No CLI needed)

### Step 1: Push to GitHub
1. Go to https://github.com/new
2. Repository name: `briefly`
3. Make it Public
4. Click "Create repository"
5. Follow the instructions to push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/briefly.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://dashboard.render.com
2. Sign up with GitHub
3. Click "New +" → "Blueprint"
4. Connect your GitHub repo
5. Render will automatically use the `render.yaml` file
6. Click "Apply"
7. Your app will be live at `https://briefly-xxx.onrender.com`

### Step 3: Add Environment Variables
In Render dashboard:
1. Go to your service
2. Click "Environment"
3. Add these variables:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
ELEVENLABS_API_KEY=sk_...
NODE_ENV=production
```

---

## Option 2: Deploy to Railway (Requires browser auth)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login (opens browser)
railway login

# Initialize and deploy
cd briefly
railway init --name briefly
railway up
```

---

## Option 3: Deploy to Fly.io

```bash
# Install Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Login
fly auth login

# Deploy
fly launch --name briefly
fly deploy
```

---

## After Deploy: Test Your App

1. Visit your app's URL
2. Check `/api/health` - should return `{"status":"ok"}`
3. Test the landing page loads
4. Test Stripe checkout (use test card: `4242 4242 4242 4242`)

---

## Getting API Keys

### Stripe (Required for payments)
1. https://dashboard.stripe.com/register
2. Get test keys from Developers → API Keys
3. For production, complete account activation

### Resend (Required for email)
1. https://resend.com
2. Sign up, get API key
3. Verify your domain for production

### ElevenLabs (Optional - for voice)
1. https://elevenlabs.io
2. Free tier: 10k characters/month
3. Get API key from settings

---

## 🎯 You're Live! Now What?

1. **Test everything** - Sign up, pay, receive briefing
2. **Post on IndieHackers** (copy in MARKETING.md)
3. **Share on Twitter** (thread in MARKETING.md)
4. **Get 10 beta users** - Friends, family, coworkers
5. **Iterate based on feedback**

**Your first customer = $9/month. Get 10 = $90/month. Get 100 = $900/month.**

Go make it happen.
