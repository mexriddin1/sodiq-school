import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ensureDatabase() {
  const conn = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await conn.end();
}

function splitSqlStatements(sql) {
  const stripped = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  return stripped
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function run() {
  console.log('[migrate] ensuring database exists...');
  await ensureDatabase();

  const sqlPath = path.join(__dirname, 'schema.sql');
  const sql = await fs.readFile(sqlPath, 'utf8');
  const statements = splitSqlStatements(sql);

  const conn = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    multipleStatements: false,
  });
  console.log(`[migrate] running ${statements.length} statements...`);
  for (const s of statements) {
    try {
      await conn.query(s);
    } catch (err) {
      console.error('[migrate] error in statement:', s.slice(0, 80), '...');
      throw err;
    }
  }
  await conn.end();
  console.log('[migrate] done');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
