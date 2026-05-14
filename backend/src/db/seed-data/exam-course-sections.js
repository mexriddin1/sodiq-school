import { query } from '../pool.js';

// IELTS sections (3 blocks on /mashgulot-ielts page)
const ieltsSections = [
  {
    image_key: 'carousel-telegram-cloud-photo-size-2-5472380547129613304-y', is_reverse: 0, sort: 1,
    tr: {
      uz: {
        title: 'IELTS fakultativi',
        body: '<p>Yuqori sinflar — bu kelajakka tayyorgarlikning eng muhim bosqichi. Aynan shu davrda karyera asosi quriladi, ko\'nikmalar shakllanadi. Bitiruvchilar dunyoning TOP universitetlariga kirishi, xalqaro kompaniyalarda ishlashi yoki chet elda ta\'limni davom ettirishi — bularning barchasi IELTS natijasiga bog\'liq.</p><p>Sodiq School\'da biz o\'zbek maktab o\'quvchilari va talabalariga ko\'p yillardan beri yordam beramiz. Biz shunchaki "imtihon topshirish"ga emas, balki <strong>maqsadli natijaga — 7.0, 7.5, 8.0 va undan yuqoriga</strong> erishishga tayyorlaymiz.</p>',
      },
      ru: {
        title: 'Факультатив IELTS',
        body: '<p>Старшие классы — самый важный этап подготовки к будущему. Здесь формируется основа карьеры. Поступление в топ-университеты, работа в международных компаниях или продолжение учёбы за рубежом — всё это зависит от результата IELTS.</p><p>В Sodiq School мы много лет помогаем узбекским школьникам и студентам. Мы готовим не просто к сдаче экзамена, а к <strong>целевому результату — 7.0, 7.5, 8.0 и выше</strong>.</p>',
      },
      en: {
        title: 'IELTS programme',
        body: '<p>High-school years are the most important stage of preparation for the future. This is when the foundation of a career is built. Admission to top universities, working at international companies, or studying abroad — all of this depends on your IELTS score.</p><p>At Sodiq School we have been helping Uzbek students for years. We don\'t just teach to "pass the exam" — we prepare students to reach <strong>target scores of 7.0, 7.5, 8.0 and above</strong>.</p>',
      },
    },
  },
  {
    image_key: 'carousel-telegram-cloud-photo-size-2-5472380547129613301-y', is_reverse: 1, sort: 2,
    tr: {
      uz: {
        title: "Nima o'rgatiladi?",
        body: '<p>IELTS imtihonining barcha 4 bo\'limi bo\'yicha chuqur tayyorgarlik:</p><ul><li><strong>Listening</strong> — turli aksentlarni tushunish, note completion, matching texnikalari</li><li><strong>Reading</strong> — akademik matnlarni tez va aniq tushunish, skimming va scanning strategiyalari</li><li><strong>Writing</strong> — Task 1 (grafik tahlil) va Task 2 (essay) yozish, struktura va grammatika</li><li><strong>Speaking</strong> — barcha 3 part bo\'yicha mashq, fluency va pronunciation ustida ishlash</li></ul>',
      },
      ru: {
        title: 'Чему учим?',
        body: '<p>Глубокая подготовка по всем 4 секциям IELTS:</p><ul><li><strong>Listening</strong> — понимание акцентов, note completion, matching</li><li><strong>Reading</strong> — академические тексты, skimming и scanning</li><li><strong>Writing</strong> — Task 1 и Task 2, структура и грамматика</li><li><strong>Speaking</strong> — все 3 части, fluency и произношение</li></ul>',
      },
      en: {
        title: 'What we teach',
        body: '<p>Deep preparation in all 4 IELTS sections:</p><ul><li><strong>Listening</strong> — understanding accents, note completion, matching</li><li><strong>Reading</strong> — academic texts, skimming and scanning</li><li><strong>Writing</strong> — Task 1 and Task 2, structure and grammar</li><li><strong>Speaking</strong> — all 3 parts, fluency and pronunciation</li></ul>',
      },
    },
  },
  {
    image_key: 'carousel-telegram-cloud-photo-size-2-5472380547129613305-y', is_reverse: 0, sort: 3,
    tr: {
      uz: {
        title: 'Nima uchun Sodiq School?',
        body: '<ul><li>Maktab dasturi bilan parallel — <strong>alohida kurs izlash shart emas</strong></li><li>Tajribali IELTS ustozlari — <strong>8.0+ ball olgan mutaxassislar</strong></li><li>Har hafta <strong>mock exam</strong> — haqiqiy imtihon sharoitida mashq</li><li>Individual yondashuv — har bir o\'quvchining kuchsiz tomonlari bilan alohida ishlanadi</li><li>O\'rtacha natija <strong>7.5</strong> — bu O\'zbekistondagi eng yuqori ko\'rsatkichlardan biri</li></ul>',
      },
      ru: {
        title: 'Почему Sodiq School?',
        body: '<ul><li>Параллельно со школьной программой — <strong>отдельные курсы не нужны</strong></li><li>Опытные преподаватели IELTS — <strong>с баллом 8.0+</strong></li><li>Еженедельные <strong>mock exam</strong></li><li>Индивидуальный подход к каждому ученику</li><li>Средний балл <strong>7.5</strong> — один из лучших в Узбекистане</li></ul>',
      },
      en: {
        title: 'Why Sodiq School?',
        body: '<ul><li>Runs alongside the regular school program — <strong>no separate course needed</strong></li><li>Experienced IELTS teachers — <strong>scoring 8.0+ themselves</strong></li><li>Weekly <strong>mock exams</strong> in real exam conditions</li><li>Individual attention to each student\'s weak spots</li><li>Average score of <strong>7.5</strong> — among the highest in Uzbekistan</li></ul>',
      },
    },
  },
];

const satSections = [
  {
    image_key: 'carousel-telegram-cloud-photo-size-2-5472380547129613306-y', is_reverse: 0, sort: 1,
    tr: {
      uz: {
        title: 'SAT nima uchun kerak?',
        body: '<p>SAT — bu Amerika Qo\'shma Shtatlaridagi universitetlarga kirish uchun talab qilinadigan standartlashtirilgan imtihon. <strong>Bowdoin, Carnegie Mellon, University of Toronto, University of Chicago</strong> kabi nufuzli universitetlar SAT natijasiga qarab qabul qiladi.</p><p>SAT natijasi yuqori bo\'lsa, <strong>grant va stipendiya</strong> olish imkoniyati ham ortadi. Bizning o\'quvchilarimiz SAT orqali <strong>$20M+ grant</strong> yutishgan.</p>',
      },
      ru: {
        title: 'Зачем нужен SAT?',
        body: '<p>SAT — стандартизированный экзамен, необходимый для поступления в университеты США. <strong>Bowdoin, Carnegie Mellon, University of Toronto, University of Chicago</strong> и другие топ-вузы принимают по результатам SAT.</p><p>Высокий балл SAT увеличивает шансы на <strong>гранты и стипендии</strong>. Наши ученики через SAT выиграли <strong>гранты на $20M+</strong>.</p>',
      },
      en: {
        title: 'Why SAT?',
        body: '<p>The SAT is a standardized exam required for US university admissions. <strong>Bowdoin, Carnegie Mellon, University of Toronto, University of Chicago</strong> and others use SAT scores for admissions.</p><p>A high SAT score also increases chances of <strong>grants and scholarships</strong>. Our students have won <strong>$20M+ in grants</strong> through SAT.</p>',
      },
    },
  },
  {
    image_key: 'carousel-telegram-cloud-photo-size-2-5472380547129613303-y', is_reverse: 1, sort: 2,
    tr: {
      uz: {
        title: "Nima o'rgatiladi?",
        body: '<p>SAT imtihonining asosiy 2 bo\'limi bo\'yicha chuqur tayyorgarlik:</p><ul><li><strong>Reading & Writing</strong> — matnni tushunish, grammatika, so\'z boyligi, evidence-based savollar</li><li><strong>Math</strong> — algebra, geometriya, statistika, problem solving</li><li><strong>Digital SAT</strong> — yangi format bo\'yicha to\'liq tayyorgarlik</li><li><strong>Test strategiyalari</strong> — vaqtni boshqarish, xato tanlovlarni bartaraf etish</li></ul>',
      },
      ru: {
        title: 'Чему учим?',
        body: '<p>Глубокая подготовка по 2 основным секциям SAT:</p><ul><li><strong>Reading & Writing</strong> — понимание текста, грамматика, лексика, evidence-based</li><li><strong>Math</strong> — алгебра, геометрия, статистика, problem solving</li><li><strong>Digital SAT</strong> — полная подготовка к новому формату</li><li><strong>Стратегии теста</strong> — управление временем, исключение неверных ответов</li></ul>',
      },
      en: {
        title: 'What we teach',
        body: '<p>Deep preparation in the 2 main SAT sections:</p><ul><li><strong>Reading & Writing</strong> — text comprehension, grammar, vocabulary, evidence-based questions</li><li><strong>Math</strong> — algebra, geometry, statistics, problem solving</li><li><strong>Digital SAT</strong> — full prep for the new format</li><li><strong>Test strategies</strong> — time management, eliminating wrong answers</li></ul>',
      },
    },
  },
  {
    image_key: 'carousel-telegram-cloud-photo-size-2-5472380547129613305-y', is_reverse: 0, sort: 3,
    tr: {
      uz: {
        title: 'Nima uchun Sodiq School?',
        body: '<ul><li>Maktab dasturi bilan parallel — <strong>alohida kurs izlash shart emas</strong></li><li><strong>1400+ ball</strong> olgan tajribali ustozlar</li><li>Har hafta <strong>practice test</strong> — haqiqiy imtihon sharoitida</li><li><strong>Khan Academy</strong> va <strong>College Board</strong> materiallaridan foydalanish</li><li>O\'rtacha natija <strong>1400</strong> — O\'zbekistondagi eng yuqori ko\'rsatkichlardan</li></ul>',
      },
      ru: {
        title: 'Почему Sodiq School?',
        body: '<ul><li>Параллельно со школьной программой</li><li>Опытные преподаватели с баллом <strong>1400+</strong></li><li>Еженедельные <strong>practice tests</strong></li><li>Используем материалы <strong>Khan Academy</strong> и <strong>College Board</strong></li><li>Средний балл <strong>1400</strong> — один из лучших в Узбекистане</li></ul>',
      },
      en: {
        title: 'Why Sodiq School?',
        body: '<ul><li>Runs alongside the school program</li><li>Experienced teachers scoring <strong>1400+</strong></li><li>Weekly <strong>practice tests</strong></li><li>Uses <strong>Khan Academy</strong> and <strong>College Board</strong> materials</li><li>Average score of <strong>1400</strong> — among the highest in Uzbekistan</li></ul>',
      },
    },
  },
];

async function findExamCourseId(badge) {
  const rows = await query(`SELECT id FROM exam_courses WHERE badge = ? LIMIT 1`, [badge]);
  return rows[0]?.id;
}

export async function seedExamCourseSections(mediaMap = {}) {
  console.log('[seed] exam course sections...');
  const ieltsId = await findExamCourseId('IELTS');
  const satId = await findExamCourseId('SAT');

  for (const list of [
    { id: ieltsId, items: ieltsSections },
    { id: satId, items: satSections },
  ]) {
    if (!list.id) continue;
    for (const s of list.items) {
      const imageId = mediaMap[s.image_key] ?? null;
      const r = await query(
        `INSERT INTO exam_course_sections (exam_course_id, image_id, is_reverse, sort_order, is_published)
         VALUES (?, ?, ?, ?, 1)`,
        [list.id, imageId, s.is_reverse, s.sort],
      );
      const id = r.insertId;
      for (const [locale, tr] of Object.entries(s.tr)) {
        await query(
          `INSERT INTO exam_course_section_translations (exam_course_section_id, locale, title, body)
           VALUES (?, ?, ?, ?)`,
          [id, locale, tr.title, tr.body],
        );
      }
    }
  }
}
