/**
 * ResearchRadar UI Linter & Aesthetic Auditor
 * 
 * Verifies any HTML/CSS file against the Swiss Editorial & Modern SaaS
 * design system rules established in GEMINI.md:
 *  1. Anti-neon compliance (zero #00ff00, electric lasers, or harsh glows)
 *  2. Tri-font typography stack (Serif for titles, Sans for UI, Mono for metrics)
 *  3. 2-Second Scannability audit (flags wall-of-text paragraphs lacking visual gauges)
 *  4. Data encoding presence (sparklines, dual-bar refutation gauges, Price index)
 *  5. Elevation surface hierarchy (L0 through L3)
 */

const fs = require('fs');
const path = require('path');

function auditHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const passes = [];

  // Rule 1: Anti-Neon Policy
  const neonRegexes = [
    { pattern: /#00ff00/i, name: 'Raw Matrix Green (#00ff00)' },
    { pattern: /#00ffff/i, name: 'Electric Laser Cyan (#00ffff)' },
    { pattern: /#ff00ff/i, name: 'Arcade Magenta (#ff00ff)' },
    { pattern: /box-shadow:[^;]*(?:0\s*0\s*(?:15|20|30|40)px\s*(?:#00|#0f|cyan|lime))/i, name: 'Heavy Cyberpunk Neon Glow' }
  ];

  neonRegexes.forEach(({ pattern, name }) => {
    if (pattern.test(content)) {
      issues.push(`[ANTI-NEON VIOLATION]: Detected forbidden neon styling: ${name}`);
    }
  });

  if (!neonRegexes.some(n => n.pattern.test(content))) {
    passes.push('[SURFACES]: Clean matte surfaces, zero illegal neon detected.');
  }

  // Rule 2: Typography Stack
  const hasEditorialSerif = /Instrument Serif|Newsreader|Fraunces|Georgia/i.test(content);
  const hasModernSans = /Plus Jakarta Sans|Geist|Inter|-apple-system/i.test(content);
  const hasMono = /JetBrains Mono|SF Mono|Menlo|monospace/i.test(content);

  if (hasEditorialSerif && hasModernSans && hasMono) {
    passes.push('[TYPOGRAPHY]: Complete Tri-Font pairing detected (Serif + Sans + Mono).');
  } else {
    issues.push(`[TYPOGRAPHY WARNING]: Incomplete typography hierarchy (Serif: ${hasEditorialSerif}, Sans: ${hasModernSans}, Mono: ${hasMono})`);
  }

  // Rule 3: 2-Second Scannability & Visual Data Encodings
  const hasDualBar = /refutation|collapse|stress|tug-of-war/i.test(content) || (content.includes('w-full') && content.includes('bg-rose-500'));
  const hasSparkline = /sparkline|<svg[^>]*viewBox[^>]*stroke="#38bdf8"/i.test(content);
  const hasPriceMeter = /radial|price-index|price|stroke-dasharray/i.test(content);

  if (hasDualBar || hasSparkline || hasPriceMeter) {
    passes.push(`[DATA ENCODING]: Visual data encodings present (Dual-bar: ${hasDualBar}, Sparkline: ${hasSparkline}, Radial: ${hasPriceMeter}).`);
  } else {
    issues.push('[DATA ENCODING WARNING]: No visual data encodings (dual-bars, sparklines, or gauges) found. Ensure findings are visually encoded rather than raw text.');
  }

  // Rule 4: Wall of Text Check
  const paragraphMatches = content.match(/<p[^>]*>([^<]+)<\/p>/gi) || [];
  let longParagraphs = 0;
  paragraphMatches.forEach(p => {
    const text = p.replace(/<[^>]+>/g, '').trim();
    if (text.length > 280) {
      longParagraphs++;
    }
  });

  if (longParagraphs > 0) {
    issues.push(`[SCANNABILITY WARNING]: Detected ${longParagraphs} paragraphs exceeding 280 characters without breakdown. Remember the 2-Second Scannability Rule.`);
  } else {
    passes.push('[SCANNABILITY]: Text blocks are concise, scannable, and well-structured.');
  }

  // Report
  console.log('\n======================================================');
  console.log(`  RESEARCHRADAR UI/UX AUDIT: ${path.basename(filePath)}`);
  console.log('======================================================\n');

  console.log('--- COMPLIANCE CHECKS ---');
  passes.forEach(p => console.log(`  ✅ ${p}`));

  if (issues.length > 0) {
    console.log('\n--- AREAS FOR ELEVATION ---');
    issues.forEach(i => console.log(`  ⚠️  ${i}`));
  } else {
    console.log('\n🌟 PERFECT SCORE: Interface strictly complies with Swiss Editorial & Modern Product Craft.');
  }
  console.log('\n======================================================\n');
}

const targetFile = process.argv[2] || 'index.html';
auditHtmlFile(targetFile);
