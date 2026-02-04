import cron from 'node-cron';
import { all, run } from './database.js';
import { generateBriefing, formatBriefingText } from './briefing.js';

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
  
  // Save to database
  const result = await run(
    `INSERT INTO briefings (user_id, date, content, status) VALUES (?, ?, ?, ?)`,
    [user.id, briefing.date, JSON.stringify(briefing), 'pending']
  );
  
  const briefingId = result.lastID;
  
  // For MVP, just log the briefing
  // In production, this would send email/Slack/audio
  console.log('═══════════════════════════════════════');
  console.log(text);
  console.log('═══════════════════════════════════════');
  
  // Mark as sent
  await run(
    `UPDATE briefings SET status = 'sent', sent_at = ? WHERE id = ?`,
    [new Date().toISOString(), briefingId]
  );
  
  console.log(`✅ Briefing generated for ${user.email}`);
}

console.log('⏰ Briefing scheduler initialized');
console.log('   Briefings will be generated every hour based on user preferences');
