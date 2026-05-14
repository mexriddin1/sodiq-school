import { query } from '../pool.js';

// Mix of FAQs from index.html and aloqa.html. page='both' shows on both.
const items = [
  // Index page
  { page: 'index', sort: 1, tr: {
    uz: { q: "Qabul imtihoni qanday o'tadi?",
          a: "Matematika, ingliz tili va tanqidiy fikrlash — 2 soat. Imtihon natijalariga qarab <strong>grant</strong> ajratilishi ham mumkin." },
    ru: { q: 'Как проходит вступительный экзамен?',
          a: 'Математика, английский и критическое мышление — 2 часа. По результатам экзамена может предоставляться <strong>грант</strong>.' },
    en: { q: 'How does the entrance exam work?',
          a: 'Math, English and critical thinking — 2 hours. Based on the results, a <strong>grant</strong> may be awarded.' },
  }},
  { page: 'index', sort: 2, tr: {
    uz: { q: 'Qaysi sinflar uchun qabul bor?', a: "7–11 sinf o'quvchilari uchun." },
    ru: { q: 'Для каких классов набор?', a: 'Для учеников 7–11 классов.' },
    en: { q: 'Which grades can apply?', a: 'For students in grades 7–11.' },
  }},
  { page: 'index', sort: 3, tr: {
    uz: { q: 'IELTS va SAT nima uchun kerak?',
          a: "Harvard, NYU, Oxford kabi universitetlarga kirish uchun asosiy talab. Biz bu imtihonlarni fanlar bilan parallel ravishda o'tkazamiz." },
    ru: { q: 'Зачем нужны IELTS и SAT?',
          a: 'Это основное требование для поступления в Harvard, NYU, Oxford. Мы преподаём их параллельно с предметами.' },
    en: { q: 'Why are IELTS and SAT needed?',
          a: 'They are the main requirement for admission to Harvard, NYU, Oxford. We teach them alongside academic subjects.' },
  }},
  { page: 'index', sort: 4, tr: {
    uz: { q: 'Hujjatlarni qanday topshiraman?',
          a: 'Saytimiz orqali masofadan yoki maktabga kelib topshirishingiz mumkin. Bu 1 daqiqa oladi.' },
    ru: { q: 'Как подать документы?', a: 'Через сайт удалённо или лично в школе. Это занимает 1 минуту.' },
    en: { q: 'How do I submit documents?', a: 'Online via our website or in person at the school. Takes 1 minute.' },
  }},
  { page: 'index', sort: 5, tr: {
    uz: { q: 'Farzandimning baholarini qanday bilaman?',
          a: "Bizning <strong>Sodiq School</strong> mobil ilovamiz orqali farzandingizning davomati, baholari va o'zlashtirishini kuzatib borishingiz mumkin. O'zbek, rus va ingliz tillarida ishlaydi." },
    ru: { q: 'Как узнать оценки моего ребёнка?',
          a: 'Через наше мобильное приложение <strong>Sodiq School</strong> вы можете отслеживать посещаемость и оценки. Доступно на узбекском, русском и английском.' },
    en: { q: "How can I see my child's grades?",
          a: 'Through our <strong>Sodiq School</strong> mobile app you can track attendance and grades. Available in Uzbek, Russian and English.' },
  }},
  { page: 'index', sort: 6, tr: {
    uz: { q: 'Chegirma yoki grant bormi?',
          a: "Ha. Imtihondan yuqori natija olgan o'quvchilarga ichki grant ajratiladi. Ikkinchi farzand uchun <strong>5%</strong>, tibbiyot xodimlari va pedagoglar farzandlari uchun <strong>10%</strong> chegirma." },
    ru: { q: 'Есть ли скидки или гранты?',
          a: 'Да. Ученикам с высокими результатами предоставляется внутренний грант. Для второго ребёнка — <strong>5%</strong>, для детей врачей и педагогов — <strong>10%</strong>.' },
    en: { q: 'Are there discounts or grants?',
          a: 'Yes. Students with high entrance exam scores receive an internal grant. <strong>5%</strong> off for a second child, <strong>10%</strong> off for children of medical staff and teachers.' },
  }},

  // Aloqa-only
  { page: 'aloqa', sort: 1, tr: {
    uz: { q: 'Qabul qaysi sinflardan boshlanadi?',
          a: "Sodiq Schoolga 7-sinfdan 11-sinfgacha qabul olib boriladi. Har bir sinf uchun cheklangan o'rinlar mavjud — odatda har sinfda 20 nafargacha o'quvchi." },
    ru: { q: 'С каких классов начинается приём?',
          a: 'Приём ведётся с 7 по 11 класс. Места ограничены — обычно до 20 учеников в классе.' },
    en: { q: 'Which grades can apply?',
          a: 'Admissions are open from grade 7 to 11. Seats are limited — usually up to 20 students per class.' },
  }},
  { page: 'aloqa', sort: 2, tr: {
    uz: { q: "Imtihon qachon bo'lib o'tadi?",
          a: "Kirish imtihonlari aprel–iyun oylarida bir necha bosqichda o'tkaziladi. Aniq sanalar haqida ariza topshirgandan keyin SMS va email orqali xabar beriladi." },
    ru: { q: 'Когда проходит экзамен?',
          a: 'Вступительные экзамены проходят в апреле–июне в несколько этапов. Точные даты сообщаем по SMS и e-mail после подачи заявки.' },
    en: { q: 'When are the exams held?',
          a: 'Entrance exams are held in April–June in several rounds. Exact dates are sent by SMS and email after application.' },
  }},
  { page: 'aloqa', sort: 3, tr: {
    uz: { q: "O'qish narxi qancha?",
          a: "O'qish narxi sinfga va tanlangan dasturga qarab farqlanadi. Aniq narxlar va to'lov sxemasi qabul rahbari bilan suhbatdan keyin taqdim etiladi. Iqtidorli o'quvchilar uchun chegirmalar va grantlar mavjud." },
    ru: { q: 'Сколько стоит обучение?',
          a: 'Стоимость зависит от класса и программы. Точные цены и условия оплаты — после собеседования с приёмной комиссией. Есть скидки и гранты для одарённых учеников.' },
    en: { q: 'How much does tuition cost?',
          a: 'Tuition depends on the grade and program. Exact prices and payment plans are shared after the admissions interview. Discounts and grants are available for talented students.' },
  }},
  { page: 'aloqa', sort: 4, tr: {
    uz: { q: "IELTS va SAT darslar qo'shimcha to'lanadimi?",
          a: "IELTS va SAT tayyorgarligi asosiy o'quv dasturiga kiritilgan va alohida to'lov talab qilinmaydi. Faqat imtihonning rasmiy to'lovi (test markazi tomonidan) ota-ona zimmasiga tushadi." },
    ru: { q: 'IELTS и SAT оплачиваются отдельно?',
          a: 'Подготовка к IELTS и SAT включена в основную программу. Отдельная плата не требуется. Только официальный сбор за сам экзамен — за счёт родителей.' },
    en: { q: 'Are IELTS and SAT classes paid separately?',
          a: 'IELTS and SAT preparation is included in the main program — no extra fee. Only the official exam fee (paid to the test center) is on the parents.' },
  }},
  { page: 'aloqa', sort: 5, tr: {
    uz: { q: "Maktabda necha o'quvchi o'qiydi?",
          a: "Hozirda Sodiq Schoolda 450 dan ortiq o'quvchi ta'lim olmoqda. Har bir sinfda 18–20 nafargacha o'quvchi — bu individual yondashuv uchun optimal son." },
    ru: { q: 'Сколько учеников в школе?',
          a: 'Сейчас в Sodiq School учатся более 450 учеников. В каждом классе 18–20 учеников — оптимально для индивидуального подхода.' },
    en: { q: 'How many students are in the school?',
          a: 'Currently 450+ students study at Sodiq School. Each class has 18–20 students — ideal for individual attention.' },
  }},
  { page: 'aloqa', sort: 6, tr: {
    uz: { q: 'Natijalar kafolatlanadimi?',
          a: "Biz natijani 100% kafolatlay olmaymiz — chunki bu o'quvchining mehnatiga ham bog'liq. Lekin biz tayyorgarlikda eng yuqori standartlarni taqdim etamiz va statistikamiz o'zi gapiradi: o'rtacha IELTS 7.5+, SAT 1400+." },
    ru: { q: 'Гарантируете ли вы результат?',
          a: 'Мы не можем гарантировать 100% результат — он зависит и от ученика. Но мы даём подготовку высочайшего уровня, и наша статистика говорит сама за себя: средний IELTS 7.5+, SAT 1400+.' },
    en: { q: 'Are results guaranteed?',
          a: 'We can\'t guarantee 100% — that depends on the student too. But we provide top-quality preparation, and our stats speak for themselves: average IELTS 7.5+, SAT 1400+.' },
  }},
];

export async function seedFaqs() {
  console.log('[seed] faqs...');
  for (const it of items) {
    const r = await query(
      `INSERT INTO faqs (page, sort_order, is_published) VALUES (?, ?, 1)`,
      [it.page, it.sort],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(it.tr)) {
      await query(
        `INSERT INTO faq_translations (faq_id, locale, question, answer) VALUES (?,?,?,?)`,
        [id, locale, tr.q, tr.a],
      );
    }
  }
}
