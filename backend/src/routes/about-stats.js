import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'about_stats',
  tTable: 'about_stat_translations',
  fkColumn: 'about_stat_id',
  parentColumns: ['prefix', 'value', 'suffix', 'page', 'sort_order', 'is_published'],
  translationColumns: ['label', 'sub'],
  publicColumns: ['id', 'prefix', 'value', 'suffix', 'page', 'sort_order'],
});
