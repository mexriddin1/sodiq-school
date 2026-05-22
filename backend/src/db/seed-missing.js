// One-shot seeder for the three tables that were left empty after the
// initial deploy: pricing_plans, advantages, about_stats.
// Run with:  npm run db:seed-missing   (or:  node src/db/seed-missing.js)
//
// Safe to re-run: skips a table if it already has rows.
import { pool, query } from './pool.js';
import { seedPricingPlans } from './seed-data/pricing-plans.js';
import { seedAdvantages } from './seed-data/advantages.js';
import { seedAboutStats } from './seed-data/about-stats.js';

async function isEmpty(table) {
  const rows = await query(`SELECT COUNT(*) AS n FROM \`${table}\``);
  return rows[0].n === 0;
}

async function run() {
  console.log('[seed-missing] starting...');

  if (await isEmpty('pricing_plans')) {
    await seedPricingPlans();
  } else {
    console.log('[seed-missing] pricing_plans already populated, skipping');
  }

  if (await isEmpty('advantages')) {
    await seedAdvantages();
  } else {
    console.log('[seed-missing] advantages already populated, skipping');
  }

  if (await isEmpty('about_stats')) {
    await seedAboutStats();
  } else {
    console.log('[seed-missing] about_stats already populated, skipping');
  }

  console.log('[seed-missing] done');
  await pool.end();
}

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
