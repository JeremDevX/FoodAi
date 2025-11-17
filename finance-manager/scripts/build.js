const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Finance Manager...');

// Clean previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
}

// Build the application
console.log('🔨 Building Next.js application...');
try {
  execSync('next build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('🎉 Build process completed!');
console.log('📁 Build files are available in the .next directory');
console.log('🌐 To run in production: npm start');