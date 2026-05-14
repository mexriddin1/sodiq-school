import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'top_students',
  tTable: 'top_student_translations',
  fkColumn: 'top_student_id',
  parentColumns: ['image_id', 'grant_label', 'sort_order', 'is_published'],
  translationColumns: ['university', 'name', 'description'],
  publicColumns: ['id', 'image_id', 'grant_label', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = top_students.image_id',
});
