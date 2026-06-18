import { pool, query } from './pool.js';

const settings = [
  ['admissions.eyebrow', 'Qabul 2026–2027', 'Приём 2026–2027', 'Admissions 2026–2027'],
  ['admissions.title', 'Farzandingizni kelajak uchun hozirdan tayyorlang', 'Готовьте ребёнка к будущему уже сегодня', 'Prepare your child for the future today'],
  ['admissions.desc', 'Imtihon asosida saralangan bolalar qatorida farzandingiz tahsil oladi.', 'Ваш ребёнок будет учиться среди детей, отобранных по результатам экзамена.', 'Your child will study among students selected through an entrance exam.'],
  ['admissions.process_title', 'Qabul jarayoni', 'Процесс приёма', 'Admission process'],
  ['admissions.step1_label', 'Imtihon', 'Экзамен', 'Exam'],
  ['admissions.step1_desc', 'Matematika, ingliz tili, tanqidiy fikrlash — 2 soat', 'Математика, английский, критическое мышление — 2 часа', 'Math, English, critical thinking — 2 hours'],
  ['admissions.step2_label', 'Suhbat', 'Собеседование', 'Interview'],
  ['admissions.step2_desc', 'Bola va ota-onalari bilan suhbat', 'Беседа с ребёнком и родителями', 'Conversation with the child and parents'],
  ['admissions.step3_label', 'Natija va qabul', 'Результат и приём', 'Result and admission'],
  ['admissions.step3_desc', "Natijaga ko'ra qabul qilinadi", 'Приём по результатам отбора', 'Admission based on selection results'],
  ['admissions.exams_title', 'Imtihon fanlari', 'Экзаменационные предметы', 'Exam subjects'],
  ['admissions.test1_name', 'Matematika', 'Математика', 'Mathematics'],
  ['admissions.test1_sub', 'Mantiq va hisoblash', 'Логика и счёт', 'Logic and calculation'],
  ['admissions.test2_name', 'Mantiqiy fikrlash', 'Логическое мышление', 'Logical thinking'],
  ['admissions.test2_sub', 'Tahlil va mushohada', 'Анализ и рассуждение', 'Analysis and reasoning'],
  ['admissions.test3_name', 'Ingliz tili', 'Английский язык', 'English'],
  ['admissions.test3_sub', 'Grammar va reading', 'Грамматика и чтение', 'Grammar and reading'],
  ['admissions.info_title', "Ma'lumot", 'Информация', 'Information'],
  ['admissions.info1_label', 'Qabul qilinadigan sinflar', 'Принимаемые классы', 'Grades accepted'],
  ['admissions.info1_value', '7–11 sinf', '7–11 класс', 'Grades 7–11'],
  ['admissions.info2_label', 'Imtihon davomiyligi', 'Продолжительность экзамена', 'Exam duration'],
  ['admissions.info2_value', '2 soat', '2 часа', '2 hours'],
  ['admissions.info3_label', 'Natija', 'Результат', 'Result'],
  ['admissions.info3_value', 'Saralash asosida', 'По результатам отбора', 'Based on selection'],
  ['admissions.register', "Ro'yxatdan o'tish", 'Записаться', 'Register'],
  ['admissions.secondary', 'Savollaringiz bormi?', 'Есть вопросы?', 'Got questions?'],
];

async function run() {
  console.log('[seed] admissions settings...');
  for (const [key, uz, ru, en] of settings) {
    await query(
      `INSERT INTO settings (\`key\`, value_uz, value_ru, value_en, \`group\`)
       VALUES (?, ?, ?, ?, 'admissions')
       ON DUPLICATE KEY UPDATE
         value_uz = VALUES(value_uz),
         value_ru = VALUES(value_ru),
         value_en = VALUES(value_en),
         \`group\` = VALUES(\`group\`)`,
      [key, uz, ru, en],
    );
  }
  await query(`DELETE FROM settings WHERE \`key\` IN ('admissions.info4_label', 'admissions.info4_value')`);
  console.log('[seed] admissions settings done');
  await pool.end();
}

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
