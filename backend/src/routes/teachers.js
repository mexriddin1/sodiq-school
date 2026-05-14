import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'teachers',
  tTable: 'teacher_translations',
  fkColumn: 'teacher_id',
  parentColumns: ['slug', 'image_id', 'sort_order', 'is_published'],
  translationColumns: ['name', 'role', 'bio', 'meta_json'],
  publicColumns: ['id', 'slug', 'image_id', 'sort_order'],
  extraSelect: 'media.url AS image_url',
  extraJoins: 'LEFT JOIN media ON media.id = teachers.image_id',
  transformRow: (r) => {
    if (typeof r.meta_json === 'string') {
      try { r.meta = JSON.parse(r.meta_json); } catch { r.meta = []; }
    } else {
      r.meta = r.meta_json || [];
    }
    delete r.meta_json;
    return r;
  },
});
