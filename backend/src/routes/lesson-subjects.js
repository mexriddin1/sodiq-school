import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'lesson_subjects',
  tTable: 'lesson_subject_translations',
  fkColumn: 'lesson_subject_id',
  parentColumns: ['group_key', 'icon_key', 'sort_order', 'is_published'],
  translationColumns: ['title', 'tags_json'],
  publicColumns: ['id', 'group_key', 'icon_key', 'sort_order'],
  transformRow: (r) => {
    if (typeof r.tags_json === 'string') {
      try { r.tags = JSON.parse(r.tags_json); } catch { r.tags = []; }
    } else {
      r.tags = r.tags_json || [];
    }
    delete r.tags_json;
    return r;
  },
});
