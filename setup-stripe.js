import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupProducts() {
  try {
    // Create Basic plan product
    const basicProduct = await stripe.products.create({
      name: 'Briefly Basic',
      description: '1 topic briefing daily • Text delivery • Email delivery • 7-day archive'
    });
    console.log('✅ Basic product created:', basicProduct.id);

    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 900, // $9.00
      currency: 'usd',
      recurring: { interval: 'month' }
    });
    console.log('✅ Basic price created:', basicPrice.id);

    // Create Pro plan product
    const proProduct = await stripe.products.create({
      name: 'Briefly Pro',
      description: '3 topic briefings daily • Text + Audio • Email + Slack • Weekend deep dives • 30-day archive'
    });
    console.log('✅ Pro product created:', proProduct.id);

    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 2900, // $29.00
      currency: 'usd',
      recurring: { interval: 'month' }
    });
    console.log('✅ Pro price created:', proPrice.id);

    // Create Team plan product
    const teamProduct = await stripe.products.create({
      name: 'Briefly Team',
      description: 'Everything in Pro • 5 team members • Custom topics • API access • Unlimited archive'
    });
    console.log('✅ Team product created:', teamProduct.id);

    const teamPrice = await stripe.prices.create({
      product: teamProduct.id,
      unit_amount: 9900, // $99.00
      currency: 'usd',
      recurring: { interval: 'month' }
    });
    console.log('✅ Team price created:', teamPrice.id);

    console.log('\n📋 PRICE IDs (save these):');
    console.log('BASIC:', basicPrice.id);
    console.log('PRO:', proPrice.id);
    console.log('TEAM:', teamPrice.id);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupProducts();
