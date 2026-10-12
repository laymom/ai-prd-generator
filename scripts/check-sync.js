#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = ['commands/pm.md', 'skills/ai-prd-generator/SKILL.md'];

function body(rel) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
  const match = text.match(/^---\n[\s\S]*?\n---\n/);
  if (!match) {
    console.error(`No frontmatter found in ${rel}`);
    process.exit(1);
  }
  return text.slice(match[0].length).trim();
}

const [a, b] = files.map(body);
if (a !== b) {
  const la = a.split('\n');
  const lb = b.split('\n');
  const i = la.findIndex((line, n) => line !== lb[n]);
  const at = i === -1 ? Math.min(la.length, lb.length) : i;
  console.error(`Out of sync: ${files[0]} and ${files[1]} differ at body line ${at + 1}`);
  console.error(`  ${files[0]}: ${JSON.stringify(la[at])}`);
  console.error(`  ${files[1]}: ${JSON.stringify(lb[at])}`);
  process.exit(1);
}
console.log(`In sync: ${files.join(' == ')}`);
