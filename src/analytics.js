import { run, get, all } from './database.js';

// Track key business metrics
export async function trackEvent(eventType, userId, metadata = {}) {
  try {
    await run(
      `INSERT INTO analytics (event_type, user_id, metadata, created_at) 
       VALUES (?, ?, ?, ?)`,
      [eventType, userId, JSON.stringify(metadata), new Date().toISOString()]
    );
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

export async function getMetrics() {
  try {
    // MRR (Monthly Recurring Revenue)
    const mrrResult = await get(`
      SELECT 
        SUM(CASE 
          WHEN plan = 'basic' THEN 9 
          WHEN plan = 'pro' THEN 29 
          WHEN plan = 'team' THEN 99 
          ELSE 0 
        END) as mrr
      FROM users 
      WHERE status = 'active'
    `);
    
    // Total users
    const usersResult = await get(`
      SELECT COUNT(*) as total FROM users WHERE status = 'active'
    `);
    
    // New users today
    const newTodayResult = await get(`
      SELECT COUNT(*) as count FROM users 
      WHERE DATE(created_at) = DATE('now')
    `);
    
    // Total briefings sent
    const briefingsResult = await get(`
      SELECT COUNT(*) as total FROM briefings WHERE status = 'sent'
    `);
    
    // Conversion rate (if we tracked free users)
    // For now, just return active user count
    
    return {
      mrr: mrrResult?.mrr || 0,
      totalUsers: usersResult?.total || 0,
      newToday: newTodayResult?.count || 0,
      totalBriefings: briefingsResult?.total || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Metrics error:', error);
    return {
      mrr: 0,
      totalUsers: 0,
      newToday: 0,
      totalBriefings: 0,
      error: error.message
    };
  }
}

export async function initAnalytics() {
  await run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      user_id INTEGER,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Analytics initialized');
}
