#!/usr/bin/env node
/**
 * Test script to verify OTP login flow
 */

async function testLogin() {
  console.log('🧪 Testing DEWA Login with OTP...\n');

  try {
    // Step 1: Login and request OTP
    console.log('Step 1: Sending login request...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ahmed@example.com',
        password: 'password123',
        language: 'en'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login Response:', JSON.stringify(loginData, null, 2));

    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginData.error);
      process.exit(1);
    }

    if (!loginData.requiresMFA) {
      console.error('❌ MFA not required - unexpected!');
      process.exit(1);
    }

    console.log('✅ OTP requested successfully!');
    console.log(`⏰ OTP expires in: ${loginData.expiresIn} minutes`);
    console.log('\n📧 Check backend console for OTP code in demo mode\n');

    // In a real test, we'd need to get the OTP from email/console
    console.log('To complete the test:');
    console.log('1. Check the backend terminal for the OTP code');
    console.log('2. Use this curl command to verify:');
    console.log('\ncurl -X POST http://localhost:3001/api/auth/verify-otp \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"email":"ahmed@example.com","otp":"YOUR_OTP_HERE"}\'');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testLogin();
