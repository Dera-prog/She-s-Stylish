import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const desktopDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteDir = path.resolve(desktopDir, '..');
const distDir = path.join(siteDir, 'dist');
const appDir = path.join(desktopDir, 'app');
const buildDir = path.join(desktopDir, 'build');

const apiUrl = process.env.DESKTOP_API_URL ?? 'https://shes-stylish-api.vercel.app/api';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const build = spawnSync(npm, ['run', 'build'], {
  cwd: siteDir,
  stdio: 'inherit',
  env: { ...process.env, VITE_API_URL: apiUrl },
  shell: true,
});
if (build.status !== 0) process.exit(build.status ?? 1);

if (!existsSync(path.join(distDir, 'index.html'))) {
  console.error('site build produced no dist/index.html');
  process.exit(1);
}

rmSync(appDir, { recursive: true, force: true });
mkdirSync(appDir, { recursive: true });
cpSync(distDir, appDir, { recursive: true });

mkdirSync(buildDir, { recursive: true });
cpSync(path.join(siteDir, 'public', 'assets', 'icon-512.png'), path.join(buildDir, 'icon.png'));

console.log(`desktop bundle ready: ${appDir}`);
console.log(`api baked in: ${apiUrl}`);
