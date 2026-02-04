import cron from 'node-cron';
import { all, run } from './database.js';
import { generateBriefing, formatBriefingText, formatBriefingHTML } from './briefing.js';
import { generateAudioFromBriefing } from './audio.js';

// Schedule briefing generation every hour
// Users get briefings based on their preferred time
cron.schedule('0 * * * *', async () => {
  console.log('🕐 Running briefing scheduler...');
  
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0') + ':00';
  
  try {
    // Get all users whose preferred delivery time is now
    const users = await all(`
      SELECT u.*, p.topic, p.delivery_method, p.voice_enabled
      FROM users u
      JOIN preferences p ON u.id = p.user_id
      WHERE p.delivery_time = ? AND u.status = 'active'
    `, [currentHour]);
    
    console.log(`📧 Generating briefings for ${users.length} users`);
    
    for (const user of users) {
      try {
        await generateAndDeliverBriefing(user);
      } catch (error) {
        console.error(`❌ Failed to deliver to user ${user.id}:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Scheduler error:', error);
  }
});

async function generateAndDeliverBriefing(user) {
  console.log(`📝 Generating briefing for ${user.email} - Topic: ${user.topic}`);
  
  // Generate briefing
  const briefing = await generateBriefing(user.topic);
  const text = formatBriefingText(briefing);
  const html = formatBriefingHTML(briefing);
  
  // Save to database
  const result = await run(
    `INSERT INTO briefings (user_id, date, content, status) VALUES (?, ?, ?, ?)`,
    [user.id, briefing.date, JSON.stringify(briefing), 'pending']
  );
  
  const briefingId = result.lastID;
  
  // Generate audio for Pro/Team users who want it
  let audioUrl = null;
  if (user.voice_enabled && (user.plan === 'pro' || user.plan === 'team')) {
    console.log(`🎙️ Generating audio for ${user.email}...`);
    try {
      // In production, this would upload to S3/CDN and get a URL
      // For now, we log that audio would be generated
      console.log(`   Audio generation would happen here`);
      audioUrl = '[audio-url-placeholder]';
    } catch (error) {
      console.error(`   Failed to generate audio:`, error.message);
    }
  }
  
  // Deliver based on preference
  try {
    if (user.delivery_method === 'email' || user.delivery_method === 'both') {
      await sendEmailBriefing(user.email, text, html, audioUrl);
    }
    
    if (user.delivery_method === 'slack' || user.delivery_method === 'both') {
      await sendSlackBriefing(user.slack_webhook, text);
    }
    
    // Mark as sent
    await run(
      `UPDATE briefings SET status = 'sent', sent_at = ? WHERE id = ?`,
      [new Date().toISOString(), briefingId]
    );
    
    console.log(`✅ Briefing delivered to ${user.email}`);
  } catch (error) {
    console.error(`❌ Failed to deliver briefing to ${user.email}:`, error);
    await run(
      `UPDATE briefings SET status = 'failed', error = ? WHERE id = ?`,
      [error.message, briefingId]
    );
  }
}

async function sendEmailBriefing(email, text, html, audioUrl) {
  // TODO: Implement with Resend
  // For MVP, log the briefing
  console.log('═══════════════════════════════════════');
  console.log(`📧 EMAIL TO: ${email}`);
  console.log('═══════════════════════════════════════');
  console.log(text);
  if (audioUrl) {
    console.log(`🎙️ Audio: ${audioUrl}`);
  }
  console.log('═══════════════════════════════════════');
}

async function sendSlackBriefing(webhook, text) {
  // TODO: Implement Slack webhook
  console.log(`💬 SLACK WEBHOOK: ${webhook || 'not configured'}`);
  console.log(text.substring(0, 500) + '...');
}

console.log('⏰ Briefing scheduler initialized');
console.log('   Briefings will be generated every hour based on user preferences');
