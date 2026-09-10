/**
 * Indian Agriculture - Production Startup Script
 * 
 * Automatically detects whether Next.js has been compiled (.next/BUILD_ID).
 * If no build is found, it automatically compiles the application ('next build')
 * before launching the production server ('next start').
 * 
 * Works seamlessly across Windows, Linux (cPanel / MilesWeb / Phusion Passenger).
 */

const path = require('path');
const fs = require('fs');
const { spawnSync, spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const buildIdPath = path.join(rootDir, '.next', 'BUILD_ID');
const nextBin = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');

// 1. Verify node_modules are installed
if (!fs.existsSync(nextBin)) {
  console.error('❌ Error: node_modules/next was not found.');
  console.error('👉 Please run "npm install" or click "Run NPM Install" in cPanel before starting.');
  process.exit(1);
}

// 2. Verify build exists; if not, compile automatically
if (!fs.existsSync(buildIdPath)) {
  console.log('===========================================================');
  console.log('📦 Next.js build not found in .next directory.');
  console.log('⚡ Automatically running "next build" to generate production files...');
  console.log('===========================================================');

  const buildResult = spawnSync(process.execPath, [nextBin, 'build'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
  });

  if (buildResult.status !== 0) {
    console.error('\n❌ Build failed with exit code:', buildResult.status);
    console.error('👉 Check the error log above.');
    process.exit(buildResult.status || 1);
  }

  console.log('===========================================================');
  console.log('✅ Build completed successfully!');
  console.log('===========================================================');
}

// 3. Start production server
const port = process.env.PORT || '3000';
const host = process.env.HOST || '0.0.0.0';

console.log(`🚀 Starting Next.js production server on http://${host}:${port} ...`);

const startProcess = spawn(process.execPath, [nextBin, 'start', '-H', host, '-p', port], {
  cwd: rootDir,
  stdio: 'inherit',
  env: process.env,
});

startProcess.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code || 0);
  }
});

// Clean shutdown on system signals
process.on('SIGINT', () => startProcess.kill('SIGINT'));
process.on('SIGTERM', () => startProcess.kill('SIGTERM'));
