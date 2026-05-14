import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'awards',
  tTable: 'award_translations',
  fkColumn: 'award_id',
  parentColumns: ['icon_key', 'image_id', 'gold_count', 'silver_count', 'bronze_count', 'total_label_value', 'sort_order', 'is_published'],
  translationColumns: ['title', 'description', 'gold_label', 'silver_label', 'bronze_label', 'total_label'],
  publicColumns: ['id', 'icon_key', 'image_id', 'gold_count', 'silver_count', 'bronze_count', 'total_label_value', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = awards.image_id',
});
