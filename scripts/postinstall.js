#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

console.log('\n🎨 Setting up podalls-form-builder...\n')

// Check for Next.js App Router
const appDir = path.join(process.cwd(), 'app')
const srcAppDir = path.join(process.cwd(), 'src', 'app')
const hasApp = fs.existsSync(appDir)
const hasSrcApp = fs.existsSync(srcAppDir)

if (!hasApp && !hasSrcApp) {
  console.log('⚠️  Warning: No Next.js /app directory found')
  console.log('   This package requires Next.js 13+ with App Router\n')
  process.exit(0)
}

const baseDir = hasSrcApp ? srcAppDir : appDir

// Setup globals.css
const globalsPath = path.join(baseDir, 'globals.css')
const cssVariables = fs.readFileSync(
  path.join(__dirname, '..', 'styles', 'globals.css'),
  'utf-8'
)

if (fs.existsSync(globalsPath)) {
  const existing = fs.readFileSync(globalsPath, 'utf-8')
  if (!existing.includes('podalls-form-builder')) {
    fs.appendFileSync(globalsPath, '\n\n' + cssVariables)
    console.log('✅ Added CSS variables to globals.css')
  } else {
    console.log('✓  CSS variables already present')
  }
} else {
  fs.writeFileSync(globalsPath, cssVariables)
  console.log('✅ Created globals.css')
}

// Instructions for Tailwind
console.log('\n📝 IMPORTANT: Add this to your tailwind.config.ts content array:')
console.log('   "./node_modules/podalls-form-builder/dist/**/*.{js,jsx,ts,tsx}"\n')
console.log('✨ Setup complete! See README.md for usage.\n')
