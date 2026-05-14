// Frees ports used by the 3 services before starting dev.
// Cross-platform (Windows / macOS / Linux).
//
// Usage: node scripts/kill-ports.mjs            # default ports 3000, 3001, 4000
//        node scripts/kill-ports.mjs 3000 8080  # custom ports

import { execSync } from 'node:child_process';

const PORTS = process.argv.slice(2).length
  ? process.argv.slice(2).map((n) => parseInt(n, 10)).filter(Boolean)
  : [3000, 3001, 4000];

const isWin = process.platform === 'win32';

function pidsForPort(port) {
  try {
    if (isWin) {
      // netstat lines look like:
      //   TCP    0.0.0.0:3000   0.0.0.0:0   LISTENING   12345
      const out = execSync(`netstat -ano -p tcp | findstr ":${port} "`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      const pids = new Set();
      for (const line of out.split(/\r?\n/)) {
        const m = line.trim().match(/\s(\d+)$/);
        if (m && line.toLowerCase().includes('listening')) pids.add(m[1]);
      }
      return Array.from(pids);
    } else {
      const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      return out.split(/\s+/).filter(Boolean);
    }
  } catch {
    // no process — that's fine
    return [];
  }
}

function killPid(pid) {
  try {
    if (isWin) {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
    } else {
      execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
    }
    return true;
  } catch {
    return false;
  }
}

let totalKilled = 0;
for (const port of PORTS) {
  const pids = pidsForPort(port);
  if (!pids.length) {
    console.log(`  port ${port}: bo'sh`);
    continue;
  }
  for (const pid of pids) {
    const ok = killPid(pid);
    console.log(`  port ${port}: PID ${pid} ${ok ? '✓ to\'xtatildi' : '✗ o\'chirib bo\'lmadi'}`);
    if (ok) totalKilled++;
  }
}

if (totalKilled > 0) {
  console.log(`\nJami ${totalKilled} ta jarayon to'xtatildi.\n`);
} else {
  console.log('\nBarcha portlar bo\'sh edi.\n');
}
