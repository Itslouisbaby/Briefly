import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

try {
  const key = process.env.STRIPE_SECRET_KEY;
  console.log('Key prefix:', key.substring(0, 10) + '...');
  
  const stripe = new Stripe(key);
  
  // Test: List products to verify key works
  const products = await stripe.products.list({ limit: 1 });
  console.log('✅ Stripe connection successful');
  console.log('Products found:', products.data.length);
} catch (error) {
  console.error('❌ Stripe error:', error.message);
  process.exit(1);
}
