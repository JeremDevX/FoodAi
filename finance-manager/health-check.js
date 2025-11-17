#!/usr/bin/env node

/**
 * Health Check Script for Finance Manager
 * Run this to verify the application setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏥 Finance Manager Health Check\n');

let checks = [];

// Check 1: Node.js version
function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);
  
  if (major >= 18) {
    checks.push({ name: 'Node.js version', status: '✅', details: version });
    return true;
  } else {
    checks.push({ name: 'Node.js version', status: '❌', details: `${version} (requires 18+)` });
    return false;
  }
}

// Check 2: Package.json
function checkPackageJson() {
  const packagePath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    checks.push({ name: 'package.json', status: '✅', details: `Found ${pkg.name} v${pkg.version}` });
    return true;
  } else {
    checks.push({ name: 'package.json', status: '❌', details: 'Not found' });
    return false;
  }
}

// Check 3: Dependencies
function checkDependencies() {
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  
  if (fs.existsSync(nodeModulesPath)) {
    const nextPath = path.join(nodeModulesPath, 'next');
    const reactPath = path.join(nodeModulesPath, 'react');
    
    if (fs.existsSync(nextPath) && fs.existsSync(reactPath)) {
      checks.push({ name: 'Dependencies', status: '✅', details: 'All dependencies installed' });
      return true;
    } else {
      checks.push({ name: 'Dependencies', status: '⚠️', details: 'Some dependencies missing' });
      return false;
    }
  } else {
    checks.push({ name: 'Dependencies', status: '❌', details: 'node_modules not found' });
    return false;
  }
}

// Check 4: TypeScript
function checkTypeScript() {
  try {
    execSync('npx tsc --version', { stdio: 'pipe' });
    checks.push({ name: 'TypeScript', status: '✅', details: 'Available' });
    return true;
  } catch (error) {
    checks.push({ name: 'TypeScript', status: '❌', details: 'Not available' });
    return false;
  }
}

// Check 5: Project structure
function checkProjectStructure() {
  const requiredPaths = [
    'src/app',
    'src/components',
    'src/lib',
    'src/types',
    'src/hooks'
  ];
  
  const missing = [];
  const existing = [];
  
  requiredPaths.forEach(p => {
    const fullPath = path.join(__dirname, p);
    if (fs.existsSync(fullPath)) {
      existing.push(p);
    } else {
      missing.push(p);
    }
  });
  
  if (missing.length === 0) {
    checks.push({ name: 'Project structure', status: '✅', details: 'All required directories present' });
    return true;
  } else {
    checks.push({ name: 'Project structure', status: '⚠️', details: `Missing: ${missing.join(', ')}` });
    return false;
  }
}

// Check 6: Key files
function checkKeyFiles() {
  const keyFiles = [
    'src/lib/database.ts',
    'src/lib/store.ts',
    'src/types/index.ts',
    'src/app/page.tsx',
    'src/app/layout.tsx',
    'tailwind.config.js',
    'tsconfig.json'
  ];
  
  const missing = [];
  
  keyFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
      missing.push(file);
    }
  });
  
  if (missing.length === 0) {
    checks.push({ name: 'Key files', status: '✅', details: 'All key files present' });
    return true;
  } else {
    checks.push({ name: 'Key files', status: '⚠️', details: `Missing: ${missing.join(', ')}` });
    return false;
  }
}

// Check 7: Build capability
async function checkBuild() {
  try {
    console.log('🔨 Testing build... (this may take a moment)');
    execSync('npm run build:next', { stdio: 'pipe', timeout: 60000 });
    checks.push({ name: 'Build', status: '✅', details: 'Build successful' });
    return true;
  } catch (error) {
    checks.push({ name: 'Build', status: '❌', details: 'Build failed' });
    return false;
  }
}

// Run all checks
async function runChecks() {
  console.log('Running checks...\n');
  
  // Synchronous checks
  checkNodeVersion();
  checkPackageJson();
  checkDependencies();
  checkTypeScript();
  checkProjectStructure();
  checkKeyFiles();
  
  // Asynchronous check
  await checkBuild();
  
  // Display results
  console.log('\n📊 Results:\n');
  
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}: ${check.details}`);
  });
  
  // Summary
  const passed = checks.filter(c => c.status === '✅').length;
  const warnings = checks.filter(c => c.status === '⚠️').length;
  const failed = checks.filter(c => c.status === '❌').length;
  
  console.log(`\n📈 Summary:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All checks passed! The application should work correctly.');
  } else {
    console.log('\n⚠️  Some checks failed. Please address the issues above.');
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  if (!checks.find(c => c.name === 'Dependencies')?.status.includes('✅')) {
    console.log('  - Run: npm install');
  }
  if (!checks.find(c => c.name === 'Build')?.status.includes('✅')) {
    console.log('  - Check TypeScript errors: npx tsc --noEmit');
    console.log('  - Check the build output above for specific errors');
  }
  
  console.log('\n🚀 To start the application:');
  console.log('  npm run dev');
  console.log('\n🧪 To run tests:');
  console.log('  Navigate to http://localhost:3000/test');
}

// Run the health check
runChecks().catch(error => {
  console.error('Health check failed:', error);
  process.exit(1);
});