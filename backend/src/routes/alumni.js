import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'alumni',
  tTable: 'alumni_translations',
  fkColumn: 'alumni_id',
  parentColumns: ['image_id', 'ielts_label', 'sort_order', 'is_published'],
  translationColumns: ['name', 'university', 'major'],
  publicColumns: ['id', 'image_id', 'ielts_label', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = alumni.image_id',
});
