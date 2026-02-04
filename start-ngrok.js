import { exec } from 'child_process';
import http from 'http';

console.log('🚀 Starting ngrok tunnel...');

// Start ngrok
const ngrok = exec('npx ngrok http 3000', {
  cwd: 'C:\\Users\\louis\\.openclaw\\workspace\\briefly'
});

ngrok.stdout.on('data', (data) => {
  console.log(data.toString());
});

ngrok.stderr.on('data', (data) => {
  console.error(data.toString());
});

// Wait for ngrok to start, then get tunnel URL
setTimeout(() => {
  http.get('http://localhost:4040/api/tunnels', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const tunnels = JSON.parse(data);
        if (tunnels.tunnels && tunnels.tunnels.length > 0) {
          const publicUrl = tunnels.tunnels[0].public_url;
          console.log('\n✅ BRIEFLY IS LIVE!');
          console.log('==============================');
          console.log('🌐 Public URL:', publicUrl);
          console.log('==============================\n');
          console.log('Share this URL to get customers!');
        } else {
          console.log('⏳ Waiting for tunnel...');
        }
      } catch (e) {
        console.log('⏳ Ngrok starting...');
      }
    });
  }).on('error', () => {
    console.log('⏳ Waiting for ngrok API...');
  });
}, 5000);

// Keep checking every 5 seconds
setInterval(() => {
  http.get('http://localhost:4040/api/tunnels', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const tunnels = JSON.parse(data);
        if (tunnels.tunnels && tunnels.tunnels.length > 0) {
          const publicUrl = tunnels.tunnels[0].public_url;
          console.log('\n✅ BRIEFLY IS LIVE!');
          console.log('==============================');
          console.log('🌐 Public URL:', publicUrl);
          console.log('==============================\n');
        }
      } catch (e) {}
    });
  }).on('error', () => {});
}, 5000);

console.log('⏳ Starting tunnel (this takes 10-20 seconds)...');
