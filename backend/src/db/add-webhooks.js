// Idempotent migration: adds webhooks + webhook_deliveries tables
// Run:  node src/db/add-webhooks.js
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS webhooks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    method ENUM('POST','PUT','PATCH') NOT NULL DEFAULT 'POST',
    secret VARCHAR(255),
    event_types_json JSON,
    selected_fields_json JSON,
    custom_headers_json JSON,
    payload_template MEDIUMTEXT,
    include_metadata TINYINT(1) NOT NULL DEFAULT 1,
    retry_count TINYINT UNSIGNED NOT NULL DEFAULT 3,
    timeout_ms INT UNSIGNED NOT NULL DEFAULT 10000,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    is_archived TINYINT(1) NOT NULL DEFAULT 0,
    archived_at DATETIME NULL,
    last_success_at DATETIME NULL,
    last_error_at DATETIME NULL,
    last_error TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_webhooks_active (is_active, is_archived)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    webhook_id INT UNSIGNED NOT NULL,
    event_type VARCHAR(80) NOT NULL,
    target_url VARCHAR(1000) NOT NULL,
    request_body MEDIUMTEXT,
    response_status INT,
    response_body MEDIUMTEXT,
    error TEXT,
    attempts TINYINT UNSIGNED NOT NULL DEFAULT 1,
    duration_ms INT UNSIGNED,
    success TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wd_webhook (webhook_id, created_at),
    FOREIGN KEY (webhook_id) REFERENCES webhooks(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

async function run() {
  const conn = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
  });
  for (const s of STATEMENTS) {
    await conn.query(s);
  }
  await conn.end();
  console.log('[add-webhooks] done');
}

run().catch((err) => { console.error(err); process.exit(1); });
