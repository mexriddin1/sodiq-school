import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'gallery_items',
  tTable: 'gallery_translations',
  fkColumn: 'gallery_id',
  parentColumns: ['image_id', 'size_class', 'sort_order', 'is_published'],
  translationColumns: ['caption'],
  publicColumns: ['id', 'image_id', 'size_class', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = gallery_items.image_id',
});
