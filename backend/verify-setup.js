/**
 * Backend Setup Verification Script
 * Checks if everything is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SocialRva Backend Setup Verification\n');
console.log('========================================\n');

let allChecks = true;

// Check 1: .env file exists
console.log('1️⃣  Checking .env file...');
if (fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('   ✅ .env file found\n');
} else {
  console.log('   ❌ .env file NOT found');
  console.log('   → Run: copy .env.example .env\n');
  allChecks = false;
}

// Check 2: Required files exist
console.log('2️⃣  Checking required files...');
const requiredFiles = [
  'server.js',
  'models/User.js',
  'routes/onboarding.js',
  'routes/auth.js',
  'middleware/auth.js',
  'package.json'
];

let filesOk = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} NOT found`);
    filesOk = false;
    allChecks = false;
  }
});
console.log();

// Check 3: node_modules exists
console.log('3️⃣  Checking dependencies...');
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('   ✅ node_modules found\n');
} else {
  console.log('   ❌ node_modules NOT found');
  console.log('   → Run: npm install\n');
  allChecks = false;
}

// Check 4: Environment variables
console.log('4️⃣  Checking environment variables...');
if (fs.existsSync(path.join(__dirname, '.env'))) {
  require('dotenv').config();
  
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT'
  ];
  
  let envOk = true;
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`   ✅ ${envVar} is set`);
    } else {
      console.log(`   ❌ ${envVar} is NOT set`);
      envOk = false;
      allChecks = false;
    }
  });
  console.log();
} else {
  console.log('   ⚠️  Cannot check (no .env file)\n');
}

// Check 5: MongoDB URI format
console.log('5️⃣  Checking MongoDB URI format...');
if (process.env.MONGODB_URI) {
  if (process.env.MONGODB_URI.startsWith('mongodb://') || 
      process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    console.log('   ✅ MongoDB URI format is valid\n');
  } else {
    console.log('   ❌ MongoDB URI format is invalid');
    console.log('   → Should start with mongodb:// or mongodb+srv://\n');
    allChecks = false;
  }
} else {
  console.log('   ⚠️  Cannot check (MONGODB_URI not set)\n');
}

// Check 6: Port configuration
console.log('6️⃣  Checking port configuration...');
const port = process.env.PORT || 5002;
console.log(`   ✅ Server will run on port ${port}\n`);

// Check 7: Routes registration
console.log('7️⃣  Checking routes registration...');
try {
  const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
  
  if (serverContent.includes('onboardingRoutes')) {
    console.log('   ✅ Onboarding routes imported');
  } else {
    console.log('   ❌ Onboarding routes NOT imported');
    allChecks = false;
  }
  
  if (serverContent.includes('/api/onboarding')) {
    console.log('   ✅ Onboarding routes registered\n');
  } else {
    console.log('   ❌ Onboarding routes NOT registered');
    console.log('   → Add: app.use(\'/api/onboarding\', onboardingRoutes)\n');
    allChecks = false;
  }
} catch (error) {
  console.log('   ❌ Error reading server.js\n');
  allChecks = false;
}

// Final Summary
console.log('========================================\n');
if (allChecks) {
  console.log('✅ ALL CHECKS PASSED!\n');
  console.log('🚀 Your backend is ready to run!\n');
  console.log('Next steps:');
  console.log('1. Run test: node test-onboarding.js');
  console.log('2. Start server: npm run dev');
  console.log('3. Test endpoint: http://localhost:5002/health\n');
} else {
  console.log('❌ SOME CHECKS FAILED!\n');
  console.log('Please fix the issues above before running the backend.\n');
  console.log('Need help? Check ONBOARDING_SETUP.md for detailed instructions.\n');
}

console.log('========================================\n');
