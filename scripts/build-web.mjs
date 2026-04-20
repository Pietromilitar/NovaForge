import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });

execSync('npx tsc -p tsconfig.json', { stdio: 'inherit' });

mkdirSync('dist/styles', { recursive: true });
copyFileSync('styles/ui.css', 'dist/styles/ui.css');

const html = readFileSync('index.html', 'utf8').replace('./dist/app/main.js', './app/main.js');
writeFileSync('dist/index.html', html, 'utf8');
