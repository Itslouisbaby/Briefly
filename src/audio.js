import { ElevenLabsClient } from 'elevenlabs';
import fs from 'fs';
import path from 'path';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Rachel - warm, natural voice

export async function generateAudioBriefing(text, outputPath = null) {
  try {
    console.log('🎙️ Generating audio briefing...');
    
    // Truncate text if too long (ElevenLabs has limits)
    const truncatedText = text.length > 5000 
      ? text.substring(0, 5000) + '... End of briefing.'
      : text;
    
    const audioStream = await client.generate({
      voice: VOICE_ID,
      text: truncatedText,
      model_id: 'eleven_turbo_v2'
    });
    
    // If output path provided, save to file
    if (outputPath) {
      const writeStream = fs.createWriteStream(outputPath);
      audioStream.pipe(writeStream);
      
      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          console.log(`✅ Audio saved to ${outputPath}`);
          resolve(outputPath);
        });
        writeStream.on('error', reject);
      });
    }
    
    // Otherwise return stream for further processing
    return audioStream;
  } catch (error) {
    console.error('❌ Error generating audio:', error.message);
    return null;
  }
}

export async function generateAudioFromBriefing(briefing) {
  // Format briefing for audio (more conversational)
  const intro = `Good morning! Here's your Briefly for ${briefing.date}. Today's topic: ${briefing.topic}.`;
  
  let stories = '';
  briefing.stories.forEach((story, i) => {
    stories += `Story ${i + 1}: ${story.title}. ${story.summary} `;
  });
  
  const outro = `That's your briefing for today. Have a great day!`;
  
  const audioText = `${intro} ${stories} ${outro}`;
  
  return generateAudioBriefing(audioText);
}

export async function getAvailableVoices() {
  try {
    const voices = await client.voices.getAll();
    return voices.map(v => ({
      id: v.voice_id,
      name: v.name,
      preview: v.preview_url
    }));
  } catch (error) {
    console.error('Error fetching voices:', error.message);
    return [];
  }
}
