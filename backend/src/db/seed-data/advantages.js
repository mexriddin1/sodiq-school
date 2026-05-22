import { query } from '../pool.js';

const items = [
  {
    icon_key: 'graduation', accent_num: 1, sort_order: 1,
    tr: {
      uz: { title: 'Xalqaro standartdagi ta\'lim', description: "AP Calculus, AP Physics, IELTS va SAT kurslari — chet el universitetlariga to'g'ridan-to'g'ri kirish uchun puxta tayyorgarlik." },
      ru: { title: 'Образование международного уровня', description: 'AP Calculus, AP Physics, IELTS и SAT — глубокая подготовка для поступления напрямую в зарубежные вузы.' },
      en: { title: 'World-class education',   description: 'AP Calculus, AP Physics, IELTS and SAT courses — solid prep for direct admission to international universities.' },
    },
  },
  {
    icon_key: 'users', accent_num: 2, sort_order: 2,
    tr: {
      uz: { title: 'Tajribali ustozlar', description: "20+ yillik tajribaga ega, xalqaro sertifikatga ega o'qituvchilar. Har bir o'quvchi ustozining e'tiborida." },
      ru: { title: 'Опытные преподаватели', description: 'Учителя с опытом более 20 лет и международными сертификатами. Индивидуальное внимание каждому ученику.' },
      en: { title: 'Experienced teachers',   description: '20+ years of teaching experience and international certifications. Every student gets individual attention.' },
    },
  },
  {
    icon_key: 'trophy', accent_num: 3, sort_order: 3,
    tr: {
      uz: { title: 'Yutuq va grantlar', description: "Bitiruvchilarimiz Harvard, NYU Abu Dhabi, Chicago kabi universitetlardan $15M+ grant olishgan." },
      ru: { title: 'Достижения и гранты', description: 'Наши выпускники получили более $15 млн грантов в Harvard, NYU Abu Dhabi, Chicago и других вузах.' },
      en: { title: 'Awards and grants',  description: 'Our graduates have received over $15M in grants from Harvard, NYU Abu Dhabi, Chicago and others.' },
    },
  },
  {
    icon_key: 'book', accent_num: 4, sort_order: 4,
    tr: {
      uz: { title: 'Tarbiya va ma\'naviyat', description: "Akademik fanlar bilan birga odobnoma, notiqlik san'ati, arab tili va ruhiy tarbiya kunlik dasturda." },
      ru: { title: 'Воспитание и духовность', description: 'Помимо академических предметов — этикет, ораторское искусство, арабский язык и духовное воспитание в ежедневной программе.' },
      en: { title: 'Character and ethics',    description: 'Alongside academic subjects: ethics, public speaking, Arabic and spiritual upbringing — daily.' },
    },
  },
  {
    icon_key: 'sparkles', accent_num: 5, sort_order: 5,
    tr: {
      uz: { title: 'Faol klub hayoti', description: "Zakovat, Mutolaa, robototexnika, sport va munozara klublari — o'quvchilarning qiziqishini har tomonlama rivojlantiradi." },
      ru: { title: 'Активная клубная жизнь', description: 'Заковат, проект чтения, робототехника, спорт и дискуссионные клубы — всестороннее развитие интересов учеников.' },
      en: { title: 'Vibrant club life',      description: 'Zakovat, the reading project, robotics, sports and debate clubs — well-rounded growth of every interest.' },
    },
  },
  {
    icon_key: 'shield', accent_num: 6, sort_order: 6,
    tr: {
      uz: { title: 'Xavfsiz va qulay muhit', description: "Zamonaviy sinflar, STEM laboratoriyalari va xavfsizlik kameralari bilan jihozlangan binoda 24/7 nazorat." },
      ru: { title: 'Безопасная и комфортная среда', description: 'Современные классы, STEM-лаборатории и круглосуточный контроль безопасности в полностью оснащённом здании.' },
      en: { title: 'Safe, comfortable campus',     description: 'Modern classrooms, STEM labs and 24/7 monitored facilities — purpose-built for learning.' },
    },
  },
];

export async function seedAdvantages() {
  console.log('[seed] advantages...');
  for (const it of items) {
    const r = await query(
      `INSERT INTO advantages (icon_key, accent_num, sort_order, is_published) VALUES (?, ?, ?, 1)`,
      [it.icon_key, it.accent_num, it.sort_order],
    );
    const id = r.insertId;
    for (const [locale, tr] of Object.entries(it.tr)) {
      await query(
        `INSERT INTO advantage_translations (advantage_id, locale, title, description) VALUES (?, ?, ?, ?)`,
        [id, locale, tr.title, tr.description],
      );
    }
  }
}
