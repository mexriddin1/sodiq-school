import { buildCrudRouter } from '../lib/crud.js';

export default buildCrudRouter({
  table: 'exam_courses',
  tTable: 'exam_course_translations',
  fkColumn: 'exam_course_id',
  parentColumns: ['badge', 'theme', 'score_value', 'sort_order', 'is_published'],
  translationColumns: ['score_label', 'body', 'facts_json', 'note', 'cta_label'],
  publicColumns: ['id', 'badge', 'theme', 'score_value', 'sort_order'],
  transformRow: (r) => {
    if (typeof r.facts_json === 'string') {
      try { r.facts = JSON.parse(r.facts_json); } catch { r.facts = []; }
    } else {
      r.facts = r.facts_json || [];
    }
    delete r.facts_json;
    return r;
  },
});
