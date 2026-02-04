import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { initDatabase, run, get, all } from './database.js';
import { generateBriefing, formatBriefingText } from './briefing.js';
import './scheduler.js';
import { initAnalytics, getMetrics, trackEvent } from './analytics.js';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database and analytics
await initDatabase();
await initAnalytics();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'briefly', timestamp: new Date().toISOString() });
});

// Create checkout session
app.post('/api/checkout', async (req, res) => {
  try {
    const { email, plan } = req.body;
    
    const prices = {
      basic: 'price_1Sx0rhQv7zhQy1TbGbEcjflP',
      pro: 'price_1Sx0rhQv7zhQy1Tb4Zeg6Bl7',
      team: 'price_1Sx0riQv7zhQy1TbQY9GlUVm'
    };

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [{
        price: prices[plan] || prices.pro,
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for Stripe events
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await run(
        `INSERT INTO users (email, stripe_customer_id, stripe_subscription_id, plan, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [session.customer_email, session.customer, session.subscription, 'pro', 'active']
      );
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Get user preferences
app.get('/api/preferences/:userId', async (req, res) => {
  try {
    const prefs = await all('SELECT * FROM preferences WHERE user_id = ?', [req.params.userId]);
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update preferences
app.post('/api/preferences', async (req, res) => {
  try {
    const { user_id, topic, delivery_method, delivery_time, voice_enabled } = req.body;
    await run(
      `INSERT INTO preferences (user_id, topic, delivery_method, delivery_time, voice_enabled)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, topic, delivery_method, delivery_time, voice_enabled ? 1 : 0]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate a test briefing
app.post('/api/briefing', async (req, res) => {
  try {
    const { topic } = req.body;
    const briefing = await generateBriefing(topic);
    const text = formatBriefingText(briefing);
    
    res.json({ briefing, text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent briefings
app.get('/api/briefings/:userId', async (req, res) => {
  try {
    const briefings = await all(
      'SELECT * FROM briefings WHERE user_id = ? ORDER BY date DESC LIMIT 30',
      [req.params.userId]
    );
    res.json(briefings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get business metrics
app.get('/api/metrics', async (req, res) => {
  try {
    const metrics = await getMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Waitlist signup (for beta users before Stripe is configured)
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email, topic, interests } = req.body;
    
    // Check if already exists
    const existing = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.json({ success: true, message: 'Already on waitlist', alreadyExists: true });
    }
    
    // Add to waitlist as inactive user
    await run(
      `INSERT INTO users (email, plan, status, created_at) 
       VALUES (?, ?, ?, ?)`,
      [email, 'waitlist', 'waitlist', new Date().toISOString()]
    );
    
    // Track analytics
    await trackEvent('waitlist_signup', { email, topic, interests });
    
    // Send welcome email (don't block response on this)
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('placeholder')) {
      import('./email.js').then(({ sendWelcomeEmail }) => {
        sendWelcomeEmail(email).catch(err => console.error('Welcome email failed:', err));
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Added to waitlist',
      betaAccess: 'Coming soon - you\'ll be notified when we launch'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get waitlist count (public)
app.get('/api/waitlist/count', async (req, res) => {
  try {
    const result = await get('SELECT COUNT(*) as count FROM users WHERE status = ?', ['waitlist']);
    res.json({ count: result.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demo briefing (no auth required)
app.post('/api/demo', async (req, res) => {
  try {
    const { topic } = req.body;
    const briefing = await generateBriefing(topic || 'tech');
    const text = formatBriefingText(briefing);
    
    await trackEvent('demo_generated', { topic });
    
    res.json({ 
      briefing, 
      text,
      note: 'This is a demo. Sign up for personalized daily briefings.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate audio for a briefing (demo/Pro feature)
app.post('/api/audio', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Check if ElevenLabs is configured
    if (!process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY.includes('placeholder')) {
      return res.status(503).json({ 
        error: 'Audio generation not configured',
        message: 'ElevenLabs API key not set' 
      });
    }
    
    // Import audio module
    const { generateAudioBriefing } = await import('./audio.js');
    
    // Generate audio (returns stream, we'll return a message for now)
    const audioStream = await generateAudioBriefing(text || 'Hello from Briefly!');
    
    if (!audioStream) {
      return res.status(500).json({ error: 'Failed to generate audio' });
    }
    
    res.json({ 
      success: true,
      message: 'Audio generation endpoint ready',
      note: 'Full audio streaming will be implemented with file storage'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Briefly server running on port ${PORT}`);
});

export default app;
