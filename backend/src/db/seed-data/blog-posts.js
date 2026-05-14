import { query } from '../pool.js';

// Note: only UZ content is the original verbatim copy from blog-detail.html.
// RU/EN are short auto-translations as a starting point — admin can refine.
const posts = [
  {
    slug: 'islom-grant', img: 'islom-grant', sort: 1,
    tr: {
      uz: {
        badge: 'Grant', date_label: '2026',
        title: "O'quvchimiz maktabni bitirmasdan talaba — Islom Barotaliyev, $252,000 grant sohibi",
        excerpt: "Islom Barotaliyev — $252,000 grant sohibi. Maktabni hali tamomlamadi, lekin ikki TOP universitetdan grant olgan.",
        content: '<p>Bu o\'quvchimiz <strong>Islom Barotaliyev</strong> — <strong>$252,000</strong> grant sohibi. O\'zbek so\'mida qancha bo\'ladi bilasizmi? Taxminan <strong>3 milliard 150 million so\'m</strong>.</p><p>Maktabni hali tamomlamadi, lekin ko\'rib turganingizdek TOP universitetlarga qabul qilindi. Qoyil-e! Bir emas, <strong>ikki universitetdan grant!</strong></p><h2>Islom haqida</h2><ul><li>2024-yildan buyon Sodiq Schoolda tahsil oladi</li><li>Akademik ko\'rsatkichlari: <strong>IELTS 7.5</strong> va <strong>SAT 1410</strong></li><li>Ikki TOP universitetdan grant olgan</li><li>Grant summasi: <strong>$252,000</strong></li></ul><p>Sodiq School — biz ilmga sodiqmiz, biz sizga sodiqmiz!</p>',
      },
      ru: {
        badge: 'Грант', date_label: '2026',
        title: 'Наш ученик стал студентом ещё в школе — Ислом Бароталиев, обладатель гранта $252,000',
        excerpt: 'Ислом Бароталиев получил грант $252,000 от двух TOP-университетов ещё до окончания школы.',
        content: '<p>Наш ученик <strong>Ислом Бароталиев</strong> — обладатель гранта в <strong>$252,000</strong> (около <strong>3 млрд 150 млн сумов</strong>).</p><p>Он ещё не окончил школу, но уже принят в TOP-университеты. И не в один, а сразу <strong>в два — оба с грантом!</strong></p><h2>Об Исломе</h2><ul><li>Учится в Sodiq School с 2024 года</li><li>IELTS 7.5, SAT 1410</li><li>Грант от двух TOP-университетов</li><li>Сумма гранта: <strong>$252,000</strong></li></ul><p>Sodiq School — мы преданы знаниям, мы преданы вам!</p>',
      },
      en: {
        badge: 'Grant', date_label: '2026',
        title: 'Our student became a university student before graduating — Islom Barotaliyev, $252,000 grant winner',
        excerpt: 'Islom Barotaliyev received a $252,000 grant from two top universities while still in school.',
        content: '<p>Our student <strong>Islom Barotaliyev</strong> won a <strong>$252,000</strong> grant — about <strong>3.15 billion soum</strong>.</p><p>He hasn\'t finished school yet, but he\'s already been admitted to top universities. And not just one — he got grants from <strong>two universities!</strong></p><h2>About Islom</h2><ul><li>Has been studying at Sodiq School since 2024</li><li>IELTS 7.5, SAT 1410</li><li>Grants from two top universities</li><li>Grant amount: <strong>$252,000</strong></li></ul><p>Sodiq School — devoted to knowledge, devoted to you!</p>',
      },
    },
  },
  {
    slug: 'ielts-8', img: 'ielts-exam', sort: 2,
    tr: {
      uz: {
        badge: 'IELTS', date_label: '12 Aprel, 2026',
        title: 'IELTS 8.0 ga qanday tayyorlanish kerak: 7 amaliy maslahat',
        excerpt: "Harvard, Oxford, NYU kabi universitetlarga kirish uchun zarur bo'lgan IELTS 8.0 ga tayyorgarlik bo'yicha 7 amaliy maslahat.",
        content: '<p>IELTS — bu xalqaro ingliz tili imtihoni bo\'lib, <strong>Harvard, Oxford, NYU</strong> kabi universitetlarga kirish uchun asosiy talab hisoblanadi. TOP universitetlar odatda <strong>7.0 va undan yuqori</strong> ball talab qiladi.</p><h2>1. Har kuni ingliz tilida o\'qing</h2><p>Akademik maqolalar, gazetalar va ilmiy jurnallarni o\'qish — Reading bo\'limiga eng yaxshi tayyorgarlik. Har kuni kamida 30 daqiqa ajrating.</p><h2>2. Writing uchun struktura o\'rganing</h2><p>Task 1 va Task 2 uchun aniq struktura mavjud. Kirish, asosiy qism va xulosa — har birining o\'z formulasi bor.</p><h2>3. Listening — aktiv tinglash</h2><p>Podcast va TED Talks tinglang.</p><h2>4. Speaking — har kuni gapiring</h2><p>O\'zingiz bilan gapiring, yozib oling va qayta tinglang.</p><h2>5. Mock testlarni muntazam ishlang</h2><p>Har hafta kamida bitta to\'liq mock test ishlang.</p><h2>6. Lug\'at boyligingizni oshiring</h2><p>Har kuni 10 ta yangi so\'z o\'rganing.</p><h2>7. Sodiq School ustozlari bilan ishlang</h2><p>Bizning o\'rtacha natijamiz <strong>7.5</strong>, eng yuqori natijamiz esa <strong>8.5</strong>.</p>',
      },
      ru: {
        badge: 'IELTS', date_label: '12 апреля 2026',
        title: 'Как подготовиться к IELTS 8.0: 7 практических советов',
        excerpt: '7 практических советов по подготовке к IELTS 8.0 — балл, нужный для поступления в Harvard, Oxford, NYU.',
        content: '<p>IELTS — международный экзамен по английскому, обязательный для поступления в <strong>Harvard, Oxford, NYU</strong>. ТОП-университеты обычно требуют <strong>7.0 и выше</strong>.</p><h2>1. Читайте на английском каждый день</h2><h2>2. Изучите структуру Writing</h2><h2>3. Listening — активное слушание</h2><h2>4. Говорите каждый день</h2><h2>5. Регулярно проходите mock-тесты</h2><h2>6. Расширяйте словарный запас</h2><h2>7. Занимайтесь с преподавателями Sodiq School</h2><p>Наш средний балл — <strong>7.5</strong>, максимальный — <strong>8.5</strong>.</p>',
      },
      en: {
        badge: 'IELTS', date_label: 'April 12, 2026',
        title: 'How to prepare for IELTS 8.0: 7 practical tips',
        excerpt: '7 practical tips for preparing for IELTS 8.0 — the score needed for Harvard, Oxford, NYU.',
        content: '<p>IELTS is the international English exam required by <strong>Harvard, Oxford, NYU</strong> and others. Top universities typically require <strong>7.0 or higher</strong>.</p><h2>1. Read English every day</h2><h2>2. Learn Writing structure</h2><h2>3. Listening — active listening</h2><h2>4. Speak every day</h2><h2>5. Take regular mock tests</h2><h2>6. Build vocabulary</h2><h2>7. Work with Sodiq School teachers</h2><p>Our average score is <strong>7.5</strong>, our highest is <strong>8.5</strong>.</p>',
      },
    },
  },
  {
    slug: 'aqsh-ariza', img: 'students-group', sort: 3,
    tr: {
      uz: { badge: 'Qabul', date_label: '28 Mart, 2026',
        title: "AQSh universitetlariga ariza topshirish: bosqichma-bosqich qo'llanma",
        excerpt: "Common App, SAT, motivatsion essay va tavsiyanomalar — to'liq qo'llanma.",
        content: '<p>Amerika universitetlariga ariza topshirish murakkab jarayon bo\'lib tuyulishi mumkin, ammo to\'g\'ri rejalashtirish bilan bu ancha osonlashadi.</p><h2>1-bosqich: Universitetlarni tanlang</h2><p>Kamida 8-12 ta universitet tanlang.</p><h2>2-bosqich: Standardlashtirilgan testlar</h2><p><strong>SAT yoki ACT</strong> imtihonini topshiring. Ko\'pgina universitetlar <strong>1400+</strong> SAT ball talab qiladi.</p><h2>3-bosqich: Common Application</h2><p>Ko\'pgina universitetlar Common App orqali ariza qabul qiladi.</p><h2>4-bosqich: Essay yozing</h2><p>Personal Statement — bu eng muhim qism.</p><h2>5-bosqich: Tavsiya xatlari</h2><p>Kamida 2 ta o\'qituvchidan tavsiya xati oling.</p><h2>6-bosqich: Moliyaviy yordam</h2><p>FAFSA va CSS Profile to\'ldiring.</p>',
      },
      ru: { badge: 'Поступление', date_label: '28 марта 2026',
        title: 'Подача документов в университеты США: пошаговое руководство',
        excerpt: 'Common App, SAT, мотивационное эссе и рекомендации — полное руководство.',
        content: '<p>Подача документов в американские университеты — пошаговое руководство.</p><h2>Шаг 1: Выберите университеты</h2><p>8–12 университетов разных уровней.</p><h2>Шаг 2: Стандартизированные тесты</h2><p>SAT или ACT — обычно нужен балл 1400+.</p><h2>Шаг 3: Common Application</h2><h2>Шаг 4: Эссе</h2><h2>Шаг 5: Рекомендательные письма</h2><h2>Шаг 6: Финансовая помощь</h2>',
      },
      en: { badge: 'Admissions', date_label: 'March 28, 2026',
        title: 'Applying to US universities: a step-by-step guide',
        excerpt: 'Common App, SAT, motivation essay and recommendation letters — a complete guide.',
        content: '<p>A complete step-by-step guide to applying to US universities.</p><h2>Step 1: Choose universities</h2><h2>Step 2: Standardized tests</h2><h2>Step 3: Common Application</h2><h2>Step 4: Write your essay</h2><h2>Step 5: Recommendation letters</h2><h2>Step 6: Financial aid</h2>',
      },
    },
  },
  {
    slug: 'nyu-abu-dhabi', img: 'olympiad', sort: 4,
    tr: {
      uz: { badge: 'Universitet', date_label: '18 Fevral, 2026',
        title: "NYU Abu Dhabi: o'zbekistonlik talabalar uchun imkoniyatlar",
        excerpt: "Dunyodagi eng selektiv universitetlardan biri — atigi 2-3% qabul qiladi, lekin to'liq grant beradi.",
        content: '<p><strong>NYU Abu Dhabi</strong> — dunyodagi eng selektiv universitetlardan biri. Qabul darajasi atigi <strong>2-3%</strong>.</p>',
      },
      ru: { badge: 'Университет', date_label: '18 февраля 2026',
        title: 'NYU Abu Dhabi: возможности для студентов из Узбекистана',
        excerpt: 'Один из самых селективных университетов мира — приём 2–3%, но полный грант.',
        content: '<p><strong>NYU Abu Dhabi</strong> — один из самых селективных университетов мира. Уровень приёма <strong>2–3%</strong>.</p>',
      },
      en: { badge: 'University', date_label: 'February 18, 2026',
        title: 'NYU Abu Dhabi: opportunities for Uzbek students',
        excerpt: 'One of the most selective universities in the world — 2-3% admission rate, full grants.',
        content: '<p><strong>NYU Abu Dhabi</strong> — one of the most selective universities in the world. Admission rate of just <strong>2-3%</strong>.</p>',
      },
    },
  },
  {
    slug: 'stem-kasblar', img: 'stem-lab', sort: 5,
    tr: {
      uz: { badge: 'Karyera', date_label: '5 Fevral, 2026',
        title: "STEM yo'nalishlari: kelajakda eng talab qilinadigan kasblar",
        excerpt: 'Sun\'iy intellekt, ma\'lumotlar tahlili, biotexnologiya — kelajak kasblari.',
        content: '<p>STEM — Science, Technology, Engineering, Mathematics. Kelajakning eng talab qilinadigan sohalari.</p>',
      },
      ru: { badge: 'Карьера', date_label: '5 февраля 2026',
        title: 'Направления STEM: самые востребованные профессии будущего',
        excerpt: 'ИИ, анализ данных, биотехнологии — профессии будущего.',
        content: '<p>STEM — Science, Technology, Engineering, Mathematics. Самые востребованные направления будущего.</p>',
      },
      en: { badge: 'Career', date_label: 'February 5, 2026',
        title: 'STEM fields: the most in-demand careers of the future',
        excerpt: 'AI, data science, biotech — the careers of the future.',
        content: '<p>STEM — Science, Technology, Engineering, Mathematics. The most in-demand careers of the future.</p>',
      },
    },
  },
  {
    slug: 'harvard-tajriba', img: 'trophy', sort: 6,
    tr: {
      uz: { badge: 'Tavsiya', date_label: '22 Yanvar, 2026',
        title: "Bitiruvchilar tarixi: Harvard'ga qanday kirdim?",
        excerpt: "Jasurbek Umarov $394,000 grant bilan Harvard'ga kirgan. Uning tarixi.",
        content: '<p>Jasurbek Umarov — Sodiq School bitiruvchisi, <strong>$394,000</strong> grant bilan Harvard ga qabul qilingan.</p>',
      },
      ru: { badge: 'Совет', date_label: '22 января 2026',
        title: 'История выпускника: как я поступил в Harvard?',
        excerpt: 'Жасурбек Умаров поступил в Harvard с грантом $394,000. Его история.',
        content: '<p>Жасурбек Умаров — выпускник Sodiq School, поступил в Harvard с грантом <strong>$394,000</strong>.</p>',
      },
      en: { badge: 'Advice', date_label: 'January 22, 2026',
        title: 'Alumni story: how I got into Harvard',
        excerpt: 'Jasurbek Umarov got into Harvard with a $394,000 grant. His story.',
        content: '<p>Jasurbek Umarov — a Sodiq School graduate, admitted to Harvard with a <strong>$394,000</strong> grant.</p>',
      },
    },
  },
  {
    slug: 'motivatsiya', img: 'school-kids', sort: 7,
    tr: {
      uz: { badge: 'Ota-onalarga', date_label: '10 Yanvar, 2026',
        title: 'Farzandingiz akademik motivatsiyasini qanday qo\'llab-quvvatlash kerak',
        excerpt: 'Farzandingizning akademik muvaffaqiyati uchun oiladagi muhitning ahamiyati.',
        content: '<p>Farzandingizning akademik muvaffaqiyati faqat maktabga emas, balki <strong>oiladagi muhitga</strong> ham bog\'liq.</p>',
      },
      ru: { badge: 'Родителям', date_label: '10 января 2026',
        title: 'Как поддерживать академическую мотивацию ребёнка',
        excerpt: 'Важность семейной атмосферы для академического успеха ребёнка.',
        content: '<p>Академический успех ребёнка зависит не только от школы, но и от <strong>атмосферы в семье</strong>.</p>',
      },
      en: { badge: 'For parents', date_label: 'January 10, 2026',
        title: "How to support your child's academic motivation",
        excerpt: "The importance of family environment for your child's academic success.",
        content: '<p>Your child\'s academic success depends not only on school but also on the <strong>family environment</strong>.</p>',
      },
    },
  },
];

export async function seedBlogPosts(mediaMap) {
  console.log('[seed] blog posts...');
  for (const p of posts) {
    const r = await query(
      `INSERT INTO blog_posts (slug, image_id, is_published, published_at, sort_order)
       VALUES (?, ?, 1, NOW(), ?)`,
      [p.slug, mediaMap[p.img] ?? null, p.sort],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(p.tr)) {
      await query(
        `INSERT INTO blog_post_translations (blog_post_id, locale, badge, date_label, title, excerpt, content)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, locale, tr.badge, tr.date_label, tr.title, tr.excerpt, tr.content],
      );
    }
  }
}
