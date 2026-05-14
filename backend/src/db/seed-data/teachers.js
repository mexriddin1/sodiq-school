import { query } from '../pool.js';

// Existing 6 teachers from ustoz-detail.html.
// Bio is given in UZ; RU/EN are minimally translated (admins can refine).
const teachers = [
  {
    slug: 'mansur',
    image_key: 'ustoz-mansur',
    sort_order: 1,
    translations: {
      uz: {
        name: 'Mansur Siddiqov',
        role: "Ona tili va adabiyot o'qituvchisi",
        bio: [
          "O'zbekiston Milliy universitetining Filologiya fakultetini magistratura darajasida tamomlagan.",
          "<strong>20 yil</strong> davomida <strong>ona tili va adabiyoti</strong>ni o'qitib kelayotgan tajribali pedagog.",
          "Bugungi kunda maktablarda qo'llanilayotgan bir nechta darsliklarning muallifi. 2024-yilda O'zbekiston bo'ylab ilk marotaba o'tkazilgan <strong>\"E VOH\"</strong> olimpiadasida <strong>10 500 o'qituvchi orasidan 1-o'rinni egalladi.</strong>",
        ].map(p => `<p>${p}</p>`).join(''),
        meta: [
          { label: "Ta'lim", value: "O'zbekiston Milliy universiteti, Filologiya fakulteti (magistr)" },
          { label: 'Yutuqlar', value: '5-, 6-, 7-, 9-, 10-sinf "Ona tili" darsliklari muallifi. "E VOH" olimpiadasida 1-o\'rin (10 500 ishtirokchi orasida)' },
          { label: 'Mutaxassislik', value: "O'zbek tili grammatikasi va adabiyot nazariyasi" },
        ],
      },
      ru: {
        name: 'Мансур Сиддиков',
        role: 'Учитель родного языка и литературы',
        bio: '<p>Окончил магистратуру филологического факультета Национального университета Узбекистана.</p><p><strong>20 лет</strong> опыта преподавания <strong>родного языка и литературы</strong>.</p><p>Автор нескольких школьных учебников. В 2024 году занял <strong>1 место среди 10 500 учителей</strong> на олимпиаде "E VOH".</p>',
        meta: [
          { label: 'Образование', value: 'Национальный университет Узбекистана, филологический факультет (магистр)' },
          { label: 'Достижения', value: 'Автор учебников "Родной язык" 5-, 6-, 7-, 9-, 10-х классов. 1 место в олимпиаде "E VOH" (среди 10 500 участников)' },
          { label: 'Специализация', value: 'Грамматика узбекского языка и теория литературы' },
        ],
      },
      en: {
        name: 'Mansur Siddiqov',
        role: 'Native Language and Literature Teacher',
        bio: '<p>Master\'s degree from the Philology Faculty of the National University of Uzbekistan.</p><p>An experienced educator with <strong>20 years</strong> of teaching <strong>native language and literature</strong>.</p><p>Author of several school textbooks currently in use. In 2024 he took <strong>1st place among 10,500 teachers</strong> in the nationwide "E VOH" olympiad.</p>',
        meta: [
          { label: 'Education', value: 'National University of Uzbekistan, Philology Faculty (Master)' },
          { label: 'Achievements', value: 'Author of "Native Language" textbooks for grades 5, 6, 7, 9, 10. 1st place in the "E VOH" olympiad (among 10,500 participants)' },
          { label: 'Specialty', value: 'Uzbek grammar and literary theory' },
        ],
      },
    },
  },
  {
    slug: 'azimjon',
    image_key: 'ustoz-azimjon',
    sort_order: 2,
    translations: {
      uz: {
        name: "A'zimjon Mahmudov",
        role: 'AP Calculus va AP Physics',
        bio: '<p>Toshkent davlat texnika universitetida bakalavr va magistratura bosqichlarini tamomlagan. <strong>25 yildan ortiq</strong> tajribaga ega bo\'lib, shu vaqt davomida minglab o\'quvchilarga matematika fanini o\'rgatgan.</p><p>Davlat test markazida matematika eksperti sifatida faoliyat yuritgan va "Abituriyent" gazetasida ilmiy-uslubiy maqolalar yozgan. O\'zi tuzgan test to\'plamlari bugungi kunda ko\'plab tayyorlov markazlarida qo\'llaniladi.</p><p>Hozirda Sodiq School\'da <strong>AP Calculus va AP Physics</strong> fanlaridan dars beradi, o\'quvchilarni xalqaro imtihonlarga tizimli va chuqur yondashuv asosida tayyorlaydi.</p>',
        meta: [
          { label: "Ta'lim", value: 'Toshkent davlat texnika universiteti, Avtomatlashtirish va boshqaruv fakulteti (bakalavr, magistr)' },
          { label: 'Yutuqlar', value: 'Davlat test markazi matematika eksperti (2009–2013), "Abituriyent testlar to\'plami. Matematika" kitobi muallifi, Sodiq School matematika darsliklari muallifi' },
          { label: 'Mutaxassislik', value: 'AP Calculus, AP Physics, Xalqaro imtihonlarga tayyorlash' },
        ],
      },
      ru: {
        name: 'Азимжон Махмудов',
        role: 'AP Calculus и AP Physics',
        bio: '<p>Окончил Ташкентский государственный технический университет (бакалавр и магистр). Имеет <strong>более 25 лет</strong> опыта преподавания математики тысячам учеников.</p><p>Работал экспертом по математике в Государственном тестовом центре и публиковался в газете "Абитуриент". Его сборники тестов используются во многих учебных центрах.</p><p>Сейчас в Sodiq School преподаёт <strong>AP Calculus и AP Physics</strong>, готовит учеников к международным экзаменам.</p>',
        meta: [
          { label: 'Образование', value: 'Ташкентский гос. технический университет (бакалавр, магистр)' },
          { label: 'Достижения', value: 'Эксперт ГТЦ по математике (2009–2013), автор сборника "Тесты для абитуриентов. Математика", автор учебников Sodiq School' },
          { label: 'Специализация', value: 'AP Calculus, AP Physics, подготовка к международным экзаменам' },
        ],
      },
      en: {
        name: "A'zimjon Mahmudov",
        role: 'AP Calculus and AP Physics teacher',
        bio: '<p>Bachelor\'s and master\'s from Tashkent State Technical University. <strong>25+ years</strong> of teaching mathematics to thousands of students.</p><p>Worked as a math expert at the State Testing Center and published methodological articles in "Abituriyent". His test collections are used by many prep centers.</p><p>At Sodiq School he teaches <strong>AP Calculus and AP Physics</strong>, preparing students for international exams.</p>',
        meta: [
          { label: 'Education', value: 'Tashkent State Technical University (BSc, MSc)' },
          { label: 'Achievements', value: 'Math expert at State Testing Center (2009–2013), author of the "Abituriyent Math Test Collection" and Sodiq School math textbooks' },
          { label: 'Specialty', value: 'AP Calculus, AP Physics, international exam prep' },
        ],
      },
    },
  },
  {
    slug: 'shomirza',
    image_key: 'ustoz-shomirza',
    sort_order: 3,
    translations: {
      uz: {
        name: 'Asqarov Shomirza',
        role: "Matematika bosh o'qituvchi",
        bio: "<p>Sodiq School'da matematika yo'nalishiga rahbarlik qiladi. Darslarida faqat formulalarni o'rgatmaydi, balki o'quvchilarda matematik fikrlashni shakllantirishga e'tibor beradi.</p><p>Har bir o'quvchining qayerda qiynalayotganini aniqlab, aynan shu nuqtadan ishlaydi. Xalqaro imtihonlar va olimpiadalar uchun kuchli nazariy hamda amaliy tayyorgarlik beradi.</p>",
        meta: [{ label: 'Mutaxassislik', value: 'Matematika, xalqaro olimpiadaga tayyorlash' }],
      },
      ru: {
        name: 'Аскаров Шомирза',
        role: 'Главный учитель математики',
        bio: '<p>Возглавляет направление математики в Sodiq School. Учит не только формулам, но и формирует у учеников математическое мышление.</p><p>Определяет, где у ученика проблема, и работает именно с этой точкой. Даёт сильную теоретическую и практическую подготовку к международным экзаменам и олимпиадам.</p>',
        meta: [{ label: 'Специализация', value: 'Математика, подготовка к международным олимпиадам' }],
      },
      en: {
        name: 'Asqarov Shomirza',
        role: 'Lead Mathematics Teacher',
        bio: '<p>Leads the math department at Sodiq School. He doesn\'t just teach formulas — he builds mathematical thinking in students.</p><p>He pinpoints exactly where each student struggles and works from there. Provides strong theoretical and practical preparation for international exams and olympiads.</p>',
        meta: [{ label: 'Specialty', value: 'Mathematics, international olympiad preparation' }],
      },
    },
  },
  {
    slug: 'hafizulloh',
    image_key: 'ustoz-hafizulloh',
    sort_order: 4,
    translations: {
      uz: {
        name: 'Hafizulloh Ahmad',
        role: "SAT va IELTS bosh o'qituvchisi",
        bio: '<p>Sapienza University (Italiya) va London South Bank University (Buyuk Britaniya) bitiruvchisi. IELTS 8.0 va SAT matematikadan 800/800 natijalari bilan yuqori standartni o\'zi belgilagan. <strong>8 yil</strong> davomida <strong>3000 dan ortiq</strong> o\'quvchi bilan ishlagan.</p><p>Sodiq Academy direktori, "Byooks" platformasi asoschisi va City Education\'da IELTS/SAT o\'qituvchisi sifatida faoliyat yuritgan.</p>',
        meta: [
          { label: "Ta'lim", value: 'Sapienza University (Italiya), London South Bank University (Buyuk Britaniya)' },
          { label: 'Natijalar', value: 'IELTS 8.0 | SAT Math 800/800, English 770/800 | 8 yil tajriba | 3000+ o\'quvchi' },
          { label: 'Mutaxassislik', value: 'SAT, IELTS, xalqaro universitetlarga kirish strategiyasi' },
        ],
      },
      ru: {
        name: 'Хафизулло Ахмад',
        role: 'Главный преподаватель SAT и IELTS',
        bio: '<p>Выпускник Sapienza University (Италия) и London South Bank University (Великобритания). IELTS 8.0 и SAT Math 800/800 — он сам задаёт высокий стандарт. За <strong>8 лет</strong> работал с <strong>более чем 3000</strong> учениками.</p><p>Директор Sodiq Academy, основатель платформы "Byooks", преподавал IELTS/SAT в City Education.</p>',
        meta: [
          { label: 'Образование', value: 'Sapienza University (Италия), London South Bank University (Великобритания)' },
          { label: 'Результаты', value: 'IELTS 8.0 | SAT Math 800/800, English 770/800 | 8 лет опыта | 3000+ учеников' },
          { label: 'Специализация', value: 'SAT, IELTS, стратегия поступления в зарубежные университеты' },
        ],
      },
      en: {
        name: 'Hafizulloh Ahmad',
        role: 'Lead SAT and IELTS Teacher',
        bio: '<p>Graduate of Sapienza University (Italy) and London South Bank University (UK). With IELTS 8.0 and SAT Math 800/800, he sets the bar himself. <strong>8 years</strong> of experience working with <strong>3,000+ students</strong>.</p><p>Director of Sodiq Academy, founder of the "Byooks" platform, and former IELTS/SAT teacher at City Education.</p>',
        meta: [
          { label: 'Education', value: 'Sapienza University (Italy), London South Bank University (UK)' },
          { label: 'Results', value: 'IELTS 8.0 | SAT Math 800/800, English 770/800 | 8 yrs experience | 3000+ students' },
          { label: 'Specialty', value: 'SAT, IELTS, international university admissions strategy' },
        ],
      },
    },
  },
  {
    slug: 'shokir',
    image_key: 'ustoz-shokir',
    sort_order: 5,
    translations: {
      uz: {
        name: 'Shokir Tursun',
        role: "Ona tili o'qituvchisi, PhD",
        bio: "<p>Alisher Navoiy nomidagi Toshkent davlat o'zbek tili va adabiyoti universitetida bakalavr, magistr va PhD darajalarini olgan.</p><p>Bir nechta amaldagi darsliklar muallifi, magistratura uchun \"Lingvodidaktika asoslari\" darsligini yozgan. Til o'qitish va baholash bo'yicha <strong>11 ta ilmiy maqola</strong> chop etgan.</p>",
        meta: [
          { label: "Ta'lim", value: 'Alisher Navoiy nomidagi TDOUL (bakalavr, magistr, PhD)' },
          { label: 'Yutuqlar', value: '6-7-sinf "Ona tili" darsliklari muallifi (amaldagi). "Lingvodidaktika asoslari" darsligi muallifi (magistratura). 11 ta ilmiy maqola.' },
          { label: 'Mutaxassislik', value: 'Ona tili, lingvodidaktika, til baholash metodikasi' },
        ],
      },
      ru: {
        name: 'Шокир Турсун',
        role: 'Учитель родного языка, PhD',
        bio: '<p>Бакалавр, магистр и PhD Ташкентского государственного университета узбекского языка и литературы им. Алишера Навои.</p><p>Автор нескольких действующих учебников, написал учебник "Основы лингводидактики" для магистратуры. Опубликовал <strong>11 научных статей</strong> по преподаванию и оценке языка.</p>',
        meta: [
          { label: 'Образование', value: 'ТГУУЯЛ им. А. Навои (бакалавр, магистр, PhD)' },
          { label: 'Достижения', value: 'Автор действующих учебников "Родной язык" для 6–7 классов. Автор учебника "Основы лингводидактики" (магистратура). 11 научных статей.' },
          { label: 'Специализация', value: 'Родной язык, лингводидактика, методика оценки языка' },
        ],
      },
      en: {
        name: 'Shokir Tursun',
        role: 'Native Language Teacher, PhD',
        bio: '<p>BA, MA, and PhD from the Alisher Navoi Tashkent State University of Uzbek Language and Literature.</p><p>Author of several current textbooks, including the master\'s-level textbook "Foundations of Linguodidactics". Published <strong>11 scholarly articles</strong> on language teaching and assessment.</p>',
        meta: [
          { label: 'Education', value: 'Alisher Navoi Tashkent State University of Uzbek Language (BA, MA, PhD)' },
          { label: 'Achievements', value: 'Author of "Native Language" textbooks for grades 6–7 (in use). Author of "Foundations of Linguodidactics" (master\'s level). 11 scholarly articles.' },
          { label: 'Specialty', value: 'Native language, linguodidactics, language assessment methodology' },
        ],
      },
    },
  },
  {
    slug: 'rayxona',
    image_key: 'ustoz-rayxona',
    sort_order: 6,
    translations: {
      uz: {
        name: "Bo'riyeva Rayxona",
        role: "Ingliz tili o'qituvchisi",
        bio: '<p>Toshkent davlat pedagogika universitetida bakalavr va magistratura bosqichlarini tamomlagan. <strong>20 yildan ortiq pedagogik tajribaga ega.</strong> Bu vaqt ichida <strong>4000–5000</strong> ga yaqin o\'quvchiga ingliz tilini o\'rgatgan.</p><p>Bugungi kunda <strong>250 ga yaqin</strong> o\'quvchisi xorijiy davlatlarda tahsil olmoqda. So\'nggi <strong>4 yil davomida 300 dan ortiq</strong> o\'quvchini tayyorlab, ularning 280 nafari B2, 20 nafari esa B1 darajani qo\'lga kiritgan.</p><p><strong>TESOL (Arizona University), TEFL Level 5</strong> va <strong>British Council APTIS</strong> kabi xalqaro sertifikatlarga ega.</p>',
        meta: [{ label: 'Mutaxassislik', value: "Ingliz tili, IELTS tayyorlash, Xalqaro ta'limga yo'naltirish" }],
      },
      ru: {
        name: 'Бориева Райхона',
        role: 'Учитель английского языка',
        bio: '<p>Бакалавр и магистр Ташкентского государственного педагогического университета. <strong>Более 20 лет педагогического опыта.</strong> За это время обучила английскому <strong>4000–5000</strong> учеников.</p><p>Сегодня около <strong>250 её учеников</strong> учатся за рубежом. За последние <strong>4 года подготовила более 300</strong> учеников: 280 — B2, 20 — B1.</p><p>Имеет международные сертификаты <strong>TESOL (Arizona University), TEFL Level 5</strong> и <strong>British Council APTIS</strong>.</p>',
        meta: [{ label: 'Специализация', value: 'Английский язык, подготовка к IELTS, ориентация на международное образование' }],
      },
      en: {
        name: "Bo'riyeva Rayxona",
        role: 'English Teacher',
        bio: '<p>BA and MA from Tashkent State Pedagogical University. <strong>20+ years of teaching experience.</strong> Taught English to about <strong>4,000–5,000 students</strong>.</p><p>Today around <strong>250 of her students</strong> study abroad. In the last <strong>4 years she has prepared 300+</strong> students — 280 reaching B2 and 20 reaching B1 level.</p><p>Holds international certifications including <strong>TESOL (Arizona University), TEFL Level 5</strong> and <strong>British Council APTIS</strong>.</p>',
        meta: [{ label: 'Specialty', value: 'English, IELTS preparation, international education orientation' }],
      },
    },
  },
];

export async function seedTeachers(mediaMap) {
  console.log('[seed] teachers...');
  for (const t of teachers) {
    const r = await query(
      `INSERT INTO teachers (slug, image_id, sort_order, is_published) VALUES (?, ?, ?, 1)`,
      [t.slug, mediaMap[t.image_key] ?? null, t.sort_order],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(t.translations)) {
      await query(
        `INSERT INTO teacher_translations (teacher_id, locale, name, role, bio, meta_json) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, locale, tr.name, tr.role, tr.bio, JSON.stringify(tr.meta || [])],
      );
    }
  }
}
