import { query } from '../pool.js';

const items = [
  {
    amount: '4,500,000', currency: "so'm", is_featured: 0, sort_order: 1,
    tr: {
      uz: {
        label: 'Standard',
        note: 'Boshlang\'ich va o\'rta sinflar uchun',
        includes: [
          'Akademik fanlar (matematika, ingliz, ona tili, tarix, kimyo)',
          'Tarbiya darslari (odobnoma, arab tili, notiqlik)',
          '3 mahal ovqat',
          'Maktab transporti',
          'Klub mashg\'ulotlari',
        ].join('|'),
        cta_label: 'Ariza yuborish',
      },
      ru: {
        label: 'Стандарт',
        note: 'Для младших и средних классов',
        includes: [
          'Академические предметы (математика, английский, родной язык, история, химия)',
          'Воспитательные занятия (этикет, арабский, ораторское искусство)',
          '3-разовое питание',
          'Школьный транспорт',
          'Клубные занятия',
        ].join('|'),
        cta_label: 'Подать заявку',
      },
      en: {
        label: 'Standard',
        note: 'For primary and middle school',
        includes: [
          'Academic subjects (math, English, native language, history, chemistry)',
          'Character classes (ethics, Arabic, public speaking)',
          '3 meals a day',
          'School transport',
          'After-school clubs',
        ].join('|'),
        cta_label: 'Apply',
      },
    },
  },
  {
    amount: '6,500,000', currency: "so'm", is_featured: 1, sort_order: 2,
    tr: {
      uz: {
        label: 'Premium',
        note: '9–11 sinflar uchun — IELTS yoki SAT bilan',
        includes: [
          'Standard tarkibidagi hamma narsa',
          'IELTS yoki SAT kursi (haftada 4 mashg\'ulot)',
          'Mock-test va individual maslahat',
          'Universitetga ariza topshirish bo\'yicha yo\'l-yo\'riq',
          'Motivatsion essay va tavsiyanoma yordami',
        ].join('|'),
        cta_label: 'Ariza yuborish',
      },
      ru: {
        label: 'Премиум',
        note: 'Для 9–11 классов — с IELTS или SAT',
        includes: [
          'Всё из тарифа Стандарт',
          'Курс IELTS или SAT (4 занятия в неделю)',
          'Mock-тесты и индивидуальные консультации',
          'Сопровождение при поступлении в университет',
          'Помощь с эссе и рекомендательными письмами',
        ].join('|'),
        cta_label: 'Подать заявку',
      },
      en: {
        label: 'Premium',
        note: 'For grades 9–11 — includes IELTS or SAT',
        includes: [
          'Everything in Standard',
          'IELTS or SAT course (4 sessions per week)',
          'Mock tests and individual consultations',
          'University application guidance',
          'Help with essays and recommendation letters',
        ].join('|'),
        cta_label: 'Apply',
      },
    },
  },
  {
    amount: '9,500,000', currency: "so'm", is_featured: 0, sort_order: 3,
    tr: {
      uz: {
        label: 'VIP / AP track',
        note: 'AP Calculus, AP Physics va xalqaro qabul',
        includes: [
          'Premium tarkibidagi hamma narsa',
          'AP Calculus va AP Physics',
          'IELTS + SAT (har ikkalasi)',
          'Individual yo\'naltirilgan o\'qituvchi (mentor)',
          'TOP universitetga maxsus tayyorgarlik',
          '\'Common App\' va viza yordami',
        ].join('|'),
        cta_label: 'Ariza yuborish',
      },
      ru: {
        label: 'VIP / AP track',
        note: 'AP Calculus, AP Physics и зарубежные вузы',
        includes: [
          'Всё из тарифа Премиум',
          'AP Calculus и AP Physics',
          'IELTS + SAT (оба)',
          'Индивидуальный ментор',
          'Подготовка к ТОП-университетам',
          'Помощь с Common App и визой',
        ].join('|'),
        cta_label: 'Подать заявку',
      },
      en: {
        label: 'VIP / AP track',
        note: 'AP Calculus, AP Physics and international admissions',
        includes: [
          'Everything in Premium',
          'AP Calculus and AP Physics',
          'IELTS + SAT (both)',
          'Dedicated mentor',
          'Tailored prep for top universities',
          'Common App and visa support',
        ].join('|'),
        cta_label: 'Apply',
      },
    },
  },
];

export async function seedPricingPlans() {
  console.log('[seed] pricing plans...');
  for (const it of items) {
    const r = await query(
      `INSERT INTO pricing_plans (amount, currency, is_featured, sort_order, is_published) VALUES (?, ?, ?, ?, 1)`,
      [it.amount, it.currency, it.is_featured, it.sort_order],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(it.tr)) {
      await query(
        `INSERT INTO pricing_plan_translations (pricing_plan_id, locale, label, note, includes, cta_label) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, locale, tr.label, tr.note, tr.includes, tr.cta_label],
      );
    }
  }
}
