import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { initDatabase, run, get, all } from './database.js';
import { generateBriefing, formatBriefingText } from './briefing.js';
import './scheduler.js';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database
await initDatabase();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'briefly', timestamp: new Date().toISOString() });
});

// Create checkout session
app.post('/api/checkout', async (req, res) => {
  try {
    const { email, plan } = req.body;
    
    const prices = {
      basic: 'price_basic_placeholder',
      pro: 'price_pro_placeholder'
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Briefly server running on port ${PORT}`);
});

export default app;
