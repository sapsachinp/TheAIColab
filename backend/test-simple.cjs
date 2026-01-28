#!/usr/bin/env node

const http = require('http');

const postData = JSON.stringify({
  email: 'ahmed@example.com',
  password: 'password123',
  language: 'en'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing Login Flow...\n');
console.log('Request:', postData, '\n');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Body:', data);
    
    try {
      const json = JSON.parse(data);
      console.log('\n✅ Parsed Response:', JSON.stringify(json, null, 2));
      
      if (json.requiresMFA) {
        console.log('\n📧 Check backend console for OTP code!');
      } else if (json.error) {
        console.log('\n❌ Error:', json.error);
      }
    } catch (e) {
      console.log('Failed to parse JSON:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();
