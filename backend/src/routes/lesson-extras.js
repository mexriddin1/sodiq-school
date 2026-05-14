import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'lesson_extras',
  tTable: 'lesson_extra_translations',
  fkColumn: 'lesson_extra_id',
  parentColumns: ['image_id', 'link_url', 'icon_key', 'sort_order', 'is_published'],
  translationColumns: ['title', 'description', 'link_label'],
  publicColumns: ['id', 'image_id', 'link_url', 'icon_key', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = lesson_extras.image_id',
});
