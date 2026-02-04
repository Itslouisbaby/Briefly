# Briefly - Launch Marketing Kit

## Elevator Pitch
Briefly is your personal intelligence briefing — AI-curated daily updates on tech, markets, AI, science, and world news. No fluff, no clickbait, just what matters. Text or audio, delivered when you want.

---

## IndieHackers Post

**Title:** Just launched Briefly — AI-powered daily intelligence briefings

**Body:**
Hey IH 👋

I built Briefly because I was tired of:
- Sifting through 50 newsletters every morning
- Twitter/X algorithms deciding what I see
- Missing important stories in the noise

**What it does:**
Daily briefings on topics you care about (tech, markets, AI, science, world news). AI-curated from RSS feeds and quality sources. Delivered as text or audio, on your schedule.

**Current state:**
- ✅ MVP built and deployed
- ✅ Real RSS feed aggregation
- ✅ Demo live at https://briefly-eet0.onrender.com/
- ✅ Waitlist open (Stripe integration coming this week)

**Pricing:** $9/mo Basic, $29/mo Pro, $99/mo Team

**Looking for:**
- Beta testers who want daily briefings
- Feedback on the demo/UX
- Advice on marketing channels that worked for you

Try the demo and join the waitlist if you're interested!

---

## Reddit Posts

### r/SideProject

**Title:** [Showoff Saturday] Built an AI daily briefing service — Briefly

**Body:**
Hey r/SideProject!

I've been working on Briefly — a service that sends you AI-curated daily briefings on topics you care about.

**The problem:** Information overload. We're bombarded with news, newsletters, notifications. It's hard to stay informed without spending hours.

**The solution:** One briefing, once a day, on your schedule. Pick your topics (tech, markets, AI, science, world news), get a curated summary with source links. Text or audio.

**Tech stack:**
- Node.js/Express backend
- SQLite database
- RSS feed aggregation
- ElevenLabs for audio
- Deployed on Render

**Live demo:** https://briefly-eet0.onrender.com/

You can generate a sample briefing right on the landing page. Currently collecting waitlist signups — launching paid plans this week.

What do you think? Any feedback welcome!

---

### r/entrepreneur

**Title:** Built a daily briefing service in 4 hours — what I learned

**Body:**
I challenged myself to build a complete MVP for Briefly (AI daily briefings) in one evening. Here's what happened:

**What I built:**
- Express.js API with 8 endpoints
- SQLite database
- RSS feed aggregation
- Stripe billing (test mode)
- Landing page with waitlist
- Email/Slack delivery architecture

**What worked:**
- Using RSS feeds instead of APIs (no rate limits, free)
- SQLite for MVP (zero config, portable)
- Render for deployment (git push = deploy)

**What didn't:**
- Over-engineering the briefing generator at first
- Trying to integrate too many news sources simultaneously

**Current status:** Demo live, waitlist growing, adding real payments this week.

**Demo:** https://briefly-eet0.onrender.com/

Happy to answer questions about the build process!

---

### r/webdev

**Title:** Showoff: Built a daily briefing service with Node.js + RSS aggregation

**Body:**
Hey webdevs!

Built Briefly — daily AI-curated briefings. Thought some of you might find the technical approach interesting.

**Stack:**
- Backend: Node.js + Express
- Database: SQLite (simple, works great for MVP)
- Feeds: rss-parser library aggregating 15+ feeds
- Audio: ElevenLabs API for voice briefings
- Frontend: Vanilla HTML/CSS (fast, no build step)
- Deploy: Render (auto-deploy from GitHub)

**Cool technical bits:**
- Graceful degradation: if RSS fails, falls back to sample content
- Hourly CRON job generates briefings based on user preferences
- Topic-based feed selection (tech gets tech blogs, markets gets finance feeds)

**Live:** https://briefly-eet0.onrender.com/

You can generate a real briefing on the site — pulls live from RSS feeds.

Code is private for now but happy to share specific implementation details if anyone's curious!

---

## Twitter/X Thread

**Tweet 1:**
Just shipped Briefly 🚀

Your personal intelligence briefing, every morning.

No fluff. No clickbait. Just what matters.

Try it → https://briefly-eet0.onrender.com/

Thread on how I built it in 4 hours 👇

**Tweet 2:**
The problem:

I was spending 45+ mins every morning sifting through newsletters, Twitter, news apps.

Still felt like I was missing important stuff.

And most "AI news" products were just GPT summaries of random articles.

**Tweet 3:**
The solution:

RSS feeds → AI curation → Daily briefing

- 15+ quality sources per topic
- Intelligent selection (not just "latest")
- Delivered when YOU want
- Text or audio

**Tweet 4:**
Tech stack:

• Node.js + Express
• SQLite (MVP simplicity)
• rss-parser for aggregation
• ElevenLabs for voice
• Deployed on Render

No React. No complex build. Just shipped.

**Tweet 5:**
The demo generates real briefings from live RSS feeds.

Try it: https://briefly-eet0.onrender.com/

Currently taking waitlist signups. Launching paid plans this week.

$9/mo Basic, $29/mo Pro

What topics would you want briefings on?

---

## Product Hunt Pre-Launch

**Tagline:** AI daily briefings — stay informed without the noise

**Description:**
Briefly sends you a personalized daily briefing on the topics you care about. We scan quality sources, curate the most important stories, and deliver them as text or audio — on your schedule.

**Topics:** Tech, markets, AI, science, world news

**Features:**
- RSS-based aggregation from 15+ sources per topic
- AI-powered story selection
- Text + audio delivery
- Source transparency on every story
- Customizable delivery schedule

**Pricing:** $9-99/month

---

## Email Outreach Template

**Subject:** Quick question about {Company} news monitoring

**Body:**
Hey {Name},

Quick question — how does your team stay on top of industry news and competitive intel?

I built Briefly (https://briefly-eet0.onrender.com/) to solve this for myself — AI-curated daily briefings from 15+ quality sources, delivered how you want (email, Slack, or audio).

Would something like this be useful for {Company}?

Happy to set up a demo if you're interested.

Best,
Lucas

---

## Hacker News Show HN (Future)

**Title:** Show HN: Briefly – AI daily briefings from RSS feeds

**Body:**
I built Briefly because I wanted a simple way to stay informed without information overload.

It aggregates RSS feeds from quality sources (TechCrunch, BBC, Reuters, etc.), uses AI to curate the most important stories, and delivers a daily briefing via email, Slack, or audio.

Currently in beta with a waitlist. The demo generates real briefings from live feeds.

Tech stack: Node.js, SQLite, rss-parser, ElevenLabs, Render.

Would love your feedback!

https://briefly-eet0.onrender.com/

---

## Launch Metrics to Track

- Waitlist signups
- Demo briefings generated
- Conversion rate (waitlist → paid)
- Churn rate
- NPS score
- Most popular topics

## Next Steps

1. ✅ Deploy waitlist-enabled site
2. Post on IndieHackers
3. Post on relevant subreddits
4. Twitter thread
5. Set up Stripe for payments
6. Email waitlist when payments ready
7. Product Hunt launch (week 2-3)
