#!/usr/bin/env node

/**
 * Generate Secure JWT Secrets
 * 
 * Run: node generateSecrets.js
 */

import crypto from 'crypto';

console.log('\n🔐 Generating Secure JWT Secrets...\n');

const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

console.log('Add these to your .env file:\n');
console.log('# JWT Configuration');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
console.log('\n✅ Secrets generated successfully!');
console.log('⚠️  Keep these secret and never commit to version control!\n');
