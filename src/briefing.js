import Parser from 'rss-parser';

const rssParser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Briefly/1.0'
  }
});

const RSS_FEEDS = {
  tech: [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://arstechnica.com/feed/'
  ],
  markets: [
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://www.marketwatch.com/rss/topstories'
  ],
  ai: [
    'https://blog.google/technology/ai/rss/',
    'https://openai.com/blog/rss.xml'
  ],
  science: [
    'https://www.sciencedaily.com/rss/all.xml',
    'https://phys.org/rss-feed/'
  ],
  world: [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.reuters.com/rssFeed/worldNews'
  ]
};

export async function generateBriefing(topic, userPreferences = {}) {
  console.log(`🔍 Generating briefing for topic: ${topic}`);
  
  try {
    const stories = await fetchStoriesFromRSS(topic);
    
    const briefing = {
      date: new Date().toISOString().split('T')[0],
      topic: topic,
      stories: stories,
      generated_at: new Date().toISOString(),
      estimated_read_time: `${Math.max(2, stories.length * 2)} min`
    };

    return briefing;
  } catch (error) {
    console.error('Error generating briefing:', error);
    // Fallback to sample data if RSS fails
    return generateFallbackBriefing(topic);
  }
}

async function fetchStoriesFromRSS(topic) {
  const feeds = RSS_FEEDS[topic] || RSS_FEEDS.tech;
  const allStories = [];
  
  // Try to fetch from each feed
  for (const feedUrl of feeds) {
    try {
      const feed = await rssParser.parseURL(feedUrl);
      
      // Take top 2 stories from each feed
      const stories = feed.items.slice(0, 2).map(item => ({
        title: item.title,
        summary: item.contentSnippet 
          ? item.contentSnippet.substring(0, 200) + (item.contentSnippet.length > 200 ? '...' : '')
          : item.content 
            ? item.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
            : 'No summary available',
        source: feed.title || new URL(feedUrl).hostname,
        url: item.link,
        published: item.pubDate || item.isoDate
      }));
      
      allStories.push(...stories);
    } catch (error) {
      console.warn(`Failed to fetch ${feedUrl}:`, error.message);
    }
  }
  
  // If we got stories, return them (limited to 5)
  if (allStories.length > 0) {
    return allStories.slice(0, 5);
  }
  
  // Fallback to sample data
  return getSampleStories(topic);
}

function getSampleStories(topic) {
  const sampleStories = {
    tech: [
      {
        title: 'AI Model Breakthrough in Code Generation',
        summary: 'New research shows significant improvements in AI-generated code quality, with error rates dropping by 40% compared to previous models.',
        source: 'Tech Research Daily',
        url: '#'
      },
      {
        title: 'Major Cloud Provider Announces Price Cuts',
        summary: 'Compute costs expected to drop 15-20% as competition heats up in the cloud infrastructure market.',
        source: 'Cloud Weekly',
        url: '#'
      },
      {
        title: 'New Framework Gains Traction Among Developers',
        summary: 'Open-source project reaches 50k GitHub stars as developers embrace its simplicity and performance.',
        source: 'Dev Community',
        url: '#'
      }
    ],
    markets: [
      {
        title: 'Fed Signals Potential Rate Changes',
        summary: 'Markets react to latest Federal Reserve comments suggesting policy shifts in coming months.',
        source: 'Financial Times',
        url: '#'
      },
      {
        title: 'Tech Stocks Rally on Earnings Beat',
        summary: 'Major technology companies exceed quarterly expectations, driving sector-wide gains.',
        source: 'Market Watch',
        url: '#'
      }
    ],
    ai: [
      {
        title: 'Multimodal AI Models Show Promise',
        summary: 'New models that understand text, images, and audio simultaneously demonstrate impressive capabilities.',
        source: 'AI Research Weekly',
        url: '#'
      },
      {
        title: 'AI Regulation Framework Proposed',
        summary: 'International consortium releases draft guidelines for responsible AI development and deployment.',
        source: 'Policy Watch',
        url: '#'
      }
    ],
    science: [
      {
        title: 'New Battery Technology Doubles Energy Density',
        summary: 'Research team claims breakthrough in solid-state batteries with potential commercial applications within 5 years.',
        source: 'Science Daily',
        url: '#'
      }
    ],
    world: [
      {
        title: 'Climate Summit Reaches Agreement',
        summary: 'Nations commit to accelerated emissions targets with new funding mechanisms.',
        source: 'World News Network',
        url: '#'
      }
    ]
  };

  return sampleStories[topic] || sampleStories.tech;
}

function generateFallbackBriefing(topic) {
  return {
    date: new Date().toISOString().split('T')[0],
    topic: topic,
    stories: getSampleStories(topic),
    generated_at: new Date().toISOString(),
    estimated_read_time: '5 min',
    fallback: true
  };
}

export function formatBriefingText(briefing) {
  let text = `📰 BRIEFLY - ${briefing.date}\n`;
  text += `${'='.repeat(50)}\n`;
  text += `Topic: ${briefing.topic.toUpperCase()}\n`;
  text += `Read time: ${briefing.estimated_read_time}\n`;
  if (briefing.fallback) {
    text += `(Using sample content - RSS feeds temporarily unavailable)\n`;
  }
  text += `${'='.repeat(50)}\n\n`;

  briefing.stories.forEach((story, i) => {
    text += `${i + 1}. ${story.title}\n`;
    text += `   ${story.summary}\n`;
    text += `   Source: ${story.source}\n`;
    if (story.url && story.url !== '#') {
      text += `   Link: ${story.url}\n`;
    }
    text += `\n`;
  });

  text += `${'='.repeat(50)}\n`;
  text += `💬 Reply with feedback: thumbs up 👍 or thumbs down 👎\n`;
  text += `🔧 Customize your topics at briefly.ai/preferences\n`;

  return text;
}

export function formatBriefingHTML(briefing) {
  let html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #667eea; margin-bottom: 8px;">📰 Briefly</h2>
      <p style="color: #666; margin-bottom: 24px;">${briefing.date} • ${briefing.topic.toUpperCase()} • ${briefing.estimated_read_time}</p>
      ${briefing.fallback ? '<p style="color: #999; font-size: 12px;">(Using sample content)</p>' : ''}
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  `;

  briefing.stories.forEach((story, i) => {
    html += `
      <div style="margin-bottom: 24px;">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #222;">${i + 1}. ${story.title}</h3>
        <p style="margin: 0 0 8px 0; color: #444; line-height: 1.6;">${story.summary}</p>
        <p style="margin: 0; font-size: 12px; color: #888;">Source: ${story.source}</p>
        ${story.url && story.url !== '#' ? `<a href="${story.url}" style="font-size: 12px; color: #667eea;">Read more →</a>` : ''}
      </div>
    `;
  });

  html += `
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
      <p style="color: #666; font-size: 14px;">
        💬 <a href="mailto:feedback@briefly.ai?subject=Feedback&body=👍" style="color: #667eea;">Reply with feedback</a> • 
        <a href="https://briefly.ai/preferences" style="color: #667eea;">Customize topics</a>
      </p>
    </div>
  `;

  return html;
}
