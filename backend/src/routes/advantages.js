import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'advantages',
  tTable: 'advantage_translations',
  fkColumn: 'advantage_id',
  parentColumns: ['icon_key', 'accent_num', 'sort_order', 'is_published'],
  translationColumns: ['title', 'description'],
  publicColumns: ['id', 'icon_key', 'accent_num', 'sort_order'],
});
