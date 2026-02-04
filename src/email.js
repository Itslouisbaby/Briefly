import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'briefly@briefly.ai'; // Will need to verify this domain
const FROM_NAME = 'Briefly';

export async function sendEmail({ to, subject, text, html, attachments = [] }) {
  try {
    console.log(`📧 Sending email to ${to}...`);
    
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <onboarding@resend.dev>`, // Use Resend's default until domain verified
      to: [to],
      subject,
      text,
      html,
      attachments
    });

    if (error) {
      console.error('❌ Email failed:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Email sent: ${data.id}`);
    return data;
  } catch (err) {
    console.error('❌ Email error:', err.message);
    throw err;
  }
}

export async function sendBriefingEmail(email, text, html, audioUrl = null) {
  const subject = `📰 Your Daily Briefing - ${new Date().toLocaleDateString()}`;
  
  // Add audio link if available
  let enhancedHtml = html;
  if (audioUrl) {
    enhancedHtml += `
      <div style="margin-top: 20px; padding: 15px; background: #f0f4f8; border-radius: 8px;">
        <p style="margin: 0; color: #667eea; font-weight: bold;">🎙️ Listen to your briefing</p>
        <a href="${audioUrl}" style="color: #667eea;">Click here to play audio version</a>
      </div>
    `;
  }
  
  return sendEmail({
    to: email,
    subject,
    text: audioUrl ? `${text}\n\n🎙️ Audio version: ${audioUrl}` : text,
    html: enhancedHtml
  });
}

export async function sendWelcomeEmail(email) {
  const subject = 'Welcome to Briefly! 🎉';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #667eea;">Welcome to Briefly!</h2>
      <p>Thanks for joining the waitlist. You'll be the first to know when we launch.</p>
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>We'll notify you when Briefly goes live</li>
        <li>Early access members get 50% off the first 3 months</li>
        <li>Your first briefing will be ready within 24 hours of signup</li>
      </ul>
      <p>Questions? Just reply to this email.</p>
      <p>— Lucas, Founder of Briefly</p>
    </div>
  `;
  
  const text = `Welcome to Briefly!

Thanks for joining the waitlist. You'll be the first to know when we launch.

What happens next?
- We'll notify you when Briefly goes live
- Early access members get 50% off the first 3 months  
- Your first briefing will be ready within 24 hours of signup

Questions? Just reply to this email.

— Lucas, Founder of Briefly`;

  return sendEmail({ to: email, subject, text, html });
}

export async function sendPaymentConfirmation(email, plan) {
  const subject = 'Welcome to Briefly Pro! 🚀';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #667eea;">You're all set!</h2>
      <p>Thanks for subscribing to Briefly ${plan}.</p>
      <p><strong>Your plan includes:</strong></p>
      <ul>
        <li>Daily briefings on your chosen topics</li>
        <li>Email delivery at your preferred time</li>
        <li>Full access to briefing archives</li>
      </ul>
      <p>Your first briefing will arrive tomorrow. Set your preferences at <a href="https://briefly.ai/preferences">briefly.ai/preferences</a></p>
      <p>— Lucas</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html, text: html.replace(/<[^>]*>/g, '') });
}
