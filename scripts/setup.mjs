// One-shot setup: installs deps for backend/client/admin, then resets the DB.
// Run with: npm run setup  (from the monorepo root)
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';
const npm = isWin ? 'npm.cmd' : 'npm';

const log = (msg) => console.log(`\n\x1b[36m▶ ${msg}\x1b[0m`);

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, stdio: 'inherit', shell: false });
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`)));
  });
}

async function install(name) {
  const dir = path.join(root, name);
  if (!existsSync(path.join(dir, 'package.json'))) {
    console.warn(`(skipping ${name} — no package.json)`);
    return;
  }
  log(`Installing ${name}...`);
  await run(npm, ['install'], dir);
}

async function copyEnvIfMissing(name) {
  const dir = path.join(root, name);
  const target = path.join(dir, '.env');
  const example = path.join(dir, '.env.example');
  if (existsSync(target) || !existsSync(example)) return;
  const fs = await import('node:fs/promises');
  await fs.copyFile(example, target);
  console.log(`  copied ${name}/.env from .env.example`);
}

(async () => {
  try {
    log('Checking .env files...');
    await copyEnvIfMissing('backend');

    await install('backend');
    await install('client-site');
    await install('admin-site');

    log('Resetting database (migrate + seed)...');
    await run(npm, ['run', 'db:reset'], path.join(root, 'backend'));

    log('Setup complete.');
    console.log('\nEndi `npm run dev` ni ishga tushiring (3 ta servis parallel ishga tushadi).\n');
    console.log('Admin login: developer@gmail.com / developer$123');
  } catch (err) {
    console.error('\n\x1b[31m✗ Setup failed:\x1b[0m', err.message);
    process.exit(1);
  }
})();
