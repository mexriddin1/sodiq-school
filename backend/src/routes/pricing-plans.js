import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'pricing_plans',
  tTable: 'pricing_plan_translations',
  fkColumn: 'pricing_plan_id',
  parentColumns: ['amount', 'currency', 'is_featured', 'sort_order', 'is_published'],
  translationColumns: ['label', 'note', 'includes', 'cta_label'],
  publicColumns: ['id', 'amount', 'currency', 'is_featured', 'sort_order'],
});
