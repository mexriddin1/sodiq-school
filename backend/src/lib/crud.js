// Generic helpers for translatable entities.
//
// Each "entity" config has:
//   - table: parent table name (e.g. "teachers")
//   - tTable: translations table name (e.g. "teacher_translations")
//   - fkColumn: foreign key in translations table (e.g. "teacher_id")
//   - parentColumns: list of parent columns admins can write
//   - translationColumns: list of translation columns admins can write
//   - publicColumns: parent columns to expose to public reads
//
// The router built from this config exposes:
//   GET  /                 — public list (?lang=... picks the locale)
//   GET  /:id              — public detail (single row, picked locale)
//   GET  /:id/admin        — admin detail (all locales)
//   POST /                 — admin create
//   PUT  /:id              — admin update
//   DELETE /:id            — admin delete

import { Router } from 'express';
import { tx, query } from '../db/pool.js';
import { LOCALES, pickLocale } from './i18n.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';

function buildSelectColumns(table, parentColumns) {
  return parentColumns.map(c => `\`${table}\`.\`${c}\``).join(', ');
}

export function buildCrudRouter(cfg) {
  const router = Router();

  const {
    table, tTable, fkColumn,
    parentColumns, translationColumns,
    publicColumns,
    publicWhere = '`is_published` = 1',
    orderBy = '`sort_order` ASC, `id` ASC',
    extraJoins = '',         // e.g. "LEFT JOIN media m ON m.id = teachers.image_id"
    extraSelect = '',        // e.g. ", m.url AS image_url"
    transformRow = null,     // optional (row) => row
    transformPayload = null, // optional (body) => { parent, translations }
  } = cfg;

  // -------- PUBLIC LIST --------
  router.get('/', async (req, res) => {
    const locale = pickLocale(req);
    const sql = `
      SELECT ${buildSelectColumns(table, publicColumns)}
        ${extraSelect ? ', ' + extraSelect : ''},
        ${tTable}.locale, ${translationColumns.map(c => `${tTable}.\`${c}\``).join(', ')}
      FROM \`${table}\`
      LEFT JOIN \`${tTable}\` ON ${tTable}.${fkColumn} = ${table}.id AND ${tTable}.locale = ?
      ${extraJoins}
      WHERE ${publicWhere}
      ORDER BY ${orderBy}
    `;
    const rows = await query(sql, [locale]);
    const out = rows.map(r => transformRow ? transformRow(r, locale) : r);
    res.json({ items: out });
  });

  // -------- PUBLIC DETAIL --------
  router.get('/:id', async (req, res) => {
    const locale = pickLocale(req);
    const id = parseInt(req.params.id, 10);
    const rows = await query(
      `SELECT ${buildSelectColumns(table, publicColumns)}
         ${extraSelect ? ', ' + extraSelect : ''},
         ${tTable}.locale, ${translationColumns.map(c => `${tTable}.\`${c}\``).join(', ')}
       FROM \`${table}\`
       LEFT JOIN \`${tTable}\` ON ${tTable}.${fkColumn} = ${table}.id AND ${tTable}.locale = ?
       ${extraJoins}
       WHERE \`${table}\`.id = ? LIMIT 1`,
      [locale, id],
    );
    if (!rows[0]) throw new HttpError(404, `${table} not found`);
    res.json(transformRow ? transformRow(rows[0], locale) : rows[0]);
  });

  // -------- ADMIN DETAIL (all locales) --------
  router.get('/:id/admin', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const parents = await query(
      `SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`,
      [id],
    );
    if (!parents[0]) throw new HttpError(404, `${table} not found`);
    const trs = await query(
      `SELECT * FROM \`${tTable}\` WHERE ${fkColumn} = ?`,
      [id],
    );
    const translations = {};
    for (const loc of LOCALES) {
      translations[loc] = trs.find(t => t.locale === loc) || null;
    }
    res.json({ ...parents[0], translations });
  });

  function buildPayload(body) {
    if (transformPayload) return transformPayload(body);
    const parent = {};
    for (const c of parentColumns) {
      if (body[c] !== undefined) parent[c] = body[c];
    }
    const translations = body.translations || {};
    return { parent, translations };
  }

  // -------- CREATE --------
  router.post('/', requireAuth, async (req, res) => {
    const { parent, translations } = buildPayload(req.body);
    const cols = Object.keys(parent);
    if (!cols.length) throw new HttpError(400, 'No fields provided');
    const placeholders = cols.map(() => '?').join(', ');
    const sql = `INSERT INTO \`${table}\` (${cols.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;
    const id = await tx(async (conn) => {
      const [r] = await conn.execute(sql, cols.map(c => parent[c] ?? null));
      const insertId = r.insertId;
      for (const loc of LOCALES) {
        const tr = translations[loc] || {};
        const tCols = ['locale', fkColumn, ...translationColumns];
        const tVals = [loc, insertId, ...translationColumns.map(c => tr[c] ?? null)];
        const tPlaceholders = tCols.map(() => '?').join(', ');
        await conn.execute(
          `INSERT INTO \`${tTable}\` (${tCols.map(c => `\`${c}\``).join(', ')}) VALUES (${tPlaceholders})`,
          tVals,
        );
      }
      return insertId;
    });
    res.status(201).json({ id });
  });

  // -------- UPDATE --------
  router.put('/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { parent, translations } = buildPayload(req.body);
    await tx(async (conn) => {
      const cols = Object.keys(parent);
      if (cols.length) {
        const sql = `UPDATE \`${table}\` SET ${cols.map(c => `\`${c}\` = ?`).join(', ')} WHERE id = ?`;
        await conn.execute(sql, [...cols.map(c => parent[c] ?? null), id]);
      }
      for (const loc of LOCALES) {
        const tr = translations[loc];
        if (!tr) continue;
        const tCols = translationColumns;
        const sql = `INSERT INTO \`${tTable}\` (${fkColumn}, locale, ${tCols.map(c => `\`${c}\``).join(', ')})
                     VALUES (?, ?, ${tCols.map(() => '?').join(', ')})
                     ON DUPLICATE KEY UPDATE ${tCols.map(c => `\`${c}\` = VALUES(\`${c}\`)`).join(', ')}`;
        await conn.execute(sql, [id, loc, ...tCols.map(c => tr[c] ?? null)]);
      }
    });
    res.json({ ok: true });
  });

  // -------- DELETE --------
  router.delete('/:id', requireAuth, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await query(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
    res.json({ ok: true });
  });

  return router;
}
