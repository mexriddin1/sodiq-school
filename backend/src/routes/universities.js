import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'universities',
  tTable: 'university_translations',
  fkColumn: 'university_id',
  parentColumns: ['name', 'image_id', 'group', 'track', 'page', 'sort_order', 'is_published'],
  translationColumns: ['name'],
  publicColumns: ['id', 'name', 'image_id', 'group', 'track', 'page', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = universities.image_id',
});
