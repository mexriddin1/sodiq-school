// Static UI labels (titles, nav, button text, etc.) — kept in code
// since the user said "title-laridan boshqa deyarli barcha narsa o'zgaradi".
// These are the things the admin DOESN'T edit — only the dynamic content does.

import type { Locale } from "./config";

export type Dict = {
  nav: {
    home: string;
    about: string;
    results: string;
    lessons: string;
    blog: string;
    contact: string;
  };
  cta_apply: string;
  cta_back_all: string;
  read_more: string;
  scroll_left: string;
  scroll_right: string;
  open_menu: string;
  see_video: string;
  loading: string;
  blog_search_placeholder: string;

  form: {
    name: string;
    name_placeholder: string;
    phone: string;
    phone_placeholder: string;
    grade: string;
    grade_choose: string;
    grade_options: string[];
    message: string;
    message_placeholder: string;
    submit: string;
    submitted: string;
    success: string;
    privacy: string;
  };

  sections: {
    parents_say_eyebrow: string;
    parents_say_title: string;
    top_students_eyebrow: string;
    top_students_title: string;
    results_eyebrow: string;
    results_title: string;
    universities_eyebrow: string;
    universities_title: string;
    universities_partners: string;
    awards_eyebrow: string;
    awards_title: string;
    advantages_eyebrow: string;
    advantages_title: string;
    faq_eyebrow: string;
    faq_title: string;
    contact_eyebrow: string;
    contact_title: string;
    contact_subtitle: string;
    address_label: string;
    phone_label: string;
    hours_label: string;
    apply_label_phone: string;
    telegram_btn: string;
    crumb_home: string;
    teacher_more: string;
    all_results: string;
    all_articles: string;
    all_teachers: string;
    team_eyebrow: string;
    team_title: string;
    team_lead: string;
    gallery_eyebrow: string;
    gallery_title: string;
    bottom_stat_template: string;
    natijalar_alumni_eyebrow: string;
    natijalar_alumni_title: string;
    natijalar_alumni_sub: string;
    natijalar_practice_eyebrow: string;
    natijalar_uni_question: string;
    mash_grant_dollars: string;
    mash_grant_to: string;
    mash_grant_save: string;
    mash_grant_grads: string;
    mash_grant_offers: string;
    mash_grant_desc: string;
    mash_exam_eyebrow: string;
    mash_exam_title: string;
    mash_exam_lead: string;
    mash_subjects_eyebrow: string;
    mash_subjects_title: string;
    mash_extra_eyebrow: string;
    mash_extra_title: string;
    mash_cta_title: string;
    mash_cta_desc: string;
    admissions_step1_label: string;
    admissions_step1_desc: string;
    admissions_step2_label: string;
    admissions_step2_desc: string;
    admissions_step3_label: string;
    admissions_step3_desc: string;
    admissions_test_eyebrow: string;
    admissions_test_title: string;
    admissions_grades_label: string;
    admissions_grades_value: string;
    admissions_register: string;
    admissions_secondary: string;
  };

  meta: {
    home_title: string;
    home_desc: string;
    about_title: string;
    about_desc: string;
    natijalar_title: string;
    natijalar_desc: string;
    mash_title: string;
    mash_desc: string;
    blog_title: string;
    blog_desc: string;
    aloqa_title: string;
    aloqa_desc: string;
  };
};

const uz: Dict = {
  nav: {
    home: "Bosh sahifa",
    about: "Biz haqimizda",
    results: "Natijalar",
    lessons: "Mashg'ulot",
    blog: "Blog",
    contact: "Aloqa",
  },
  cta_apply: "Ariza Topshirish",
  cta_back_all: "Barcha maqolalar",
  read_more: "O'qish →",
  scroll_left: "Chapga",
  scroll_right: "O'ngga",
  open_menu: "Menyu",
  see_video: "Videoni ko'rish →",
  loading: "Yuklanmoqda...",
  blog_search_placeholder: "Maqolalardan qidiring...",
  form: {
    name: "To'liq ism-sharif",
    name_placeholder: "Ismingiz",
    phone: "Telefon raqami",
    phone_placeholder: "+998 90 123 45 67",
    grade: "Farzandingiz sinfi",
    grade_choose: "Tanlang...",
    grade_options: ["7-sinf", "8-sinf", "9-sinf", "10-sinf", "11-sinf"],
    message: "Savolingiz",
    message_placeholder: "Savolingizni yozing...",
    submit: "Maslahat olaman",
    submitted: "Yuborildi!",
    success: "Rahmat! Arizangiz qabul qilindi. 24 soat ichida bog'lanamiz.",
    privacy: "Ma'lumotlaringiz uchinchi shaxslarga oshkor etilmaydi.",
  },
  sections: {
    parents_say_eyebrow: "Ishonch",
    parents_say_title: "Ota-onalar nima deydi?",
    top_students_eyebrow: "O'quvchilar natijalari",
    top_students_title: "Ular allaqachon TOP universitetlarda",
    results_eyebrow: "Raqamlarda",
    results_title: "Natijalar o'zlari gapiradi",
    universities_eyebrow: "Universitetlar",
    universities_title: "O'quvchilarimiz qaysi universitetlarga kirishdi?",
    universities_partners: "Hamkorlar",
    awards_eyebrow: "Yutuqlar",
    awards_title: "Sovrinlarimiz",
    advantages_eyebrow: "Nima uchun biz?",
    advantages_title: "Sodiq School afzalliklari",
    faq_eyebrow: "FAQ",
    faq_title: "Ko'p beriladigan savollar",
    contact_eyebrow: "Bog'lanish",
    contact_title: "Maslahat olish uchun raqamingizni qoldiring",
    contact_subtitle: "Biz siz bilan 24 soat ichida bog'lanamiz.",
    address_label: "Manzil",
    phone_label: "Telefon",
    hours_label: "Ish vaqti",
    apply_label_phone: "Qabul",
    telegram_btn: "Telegram orqali yozing",
    crumb_home: "Bosh sahifa",
    teacher_more: "Batafsil",
    all_results: "Barcha natijalarni ko'rish →",
    all_articles: "Barcha maqolalar",
    all_teachers: "Barcha ustozlar",
    team_eyebrow: "Bizning jamoa",
    team_title: "Sodiq School jamoasi bilan tanishing",
    team_lead:
      "Darslik mualliflari, xalqaro sertifikatli pedagoglar, Italiya va Buyuk Britaniya universitetlari bitiruvchilari. 8-25 yilgacha tajriba. 7000+ o'quvchi tayyorlagan mutaxassislar.",
    gallery_eyebrow: "Galereya",
    gallery_title: "Maktab hayoti",
    bottom_stat_template:
      "<strong>239</strong> bitiruvchi <strong>500+</strong> TOP universitetdan qabul xati olgan",
    natijalar_alumni_eyebrow: "Muvaffaqiyat hikoyalari",
    natijalar_alumni_title: "Bizning bitiruvchilar",
    natijalar_alumni_sub:
      "Dunyoning nufuzli universitetlarida o'qiyotgan Sodiq School bitiruvchilari.",
    natijalar_practice_eyebrow: "Amaliyot hamkorlari",
    natijalar_uni_question: "Qaysi universitetlarga kirishdi?",
    mash_grant_dollars: "$0",
    mash_grant_to: "dan",
    mash_grant_save: "gacha tejaysiz",
    mash_grant_grads: "bitiruvchi",
    mash_grant_offers: "qabul xati",
    mash_grant_desc:
      "Farzandingiz grant yutib, chet elda o'qishga kirsa — siz shu miqdordagi ta'lim xarajatidan xalos bo'lasiz.",
    mash_exam_eyebrow: "Xalqaro imtihonlar",
    mash_exam_title: "IELTS va SAT tayyorlov",
    mash_exam_lead:
      "Akademik fanlar bilan parallel o'rgatiladigan xalqaro imtihon kurslari",
    mash_subjects_eyebrow: "O'quv dasturi",
    mash_subjects_title: "Akademik va tarbiya fanlari",
    mash_extra_eyebrow: "Qo'shimcha",
    mash_extra_title: "Qo'shimcha faoliyatlar",
    mash_cta_title: "Farzandingizning kelajagini bugundan boshlang",
    mash_cta_desc:
      "Qabul 2026–2027 uchun ochiq. Joylar soni cheklangan — har sinfga atigi <strong>20 ta o'rin</strong>.",
    admissions_step1_label: "Imtihon",
    admissions_step1_desc:
      "Matematika, ingliz tili, tanqidiy fikrlash — 2 soat",
    admissions_step2_label: "Suhbat",
    admissions_step2_desc: "Bola va ota-onalari bilan suhbat",
    admissions_step3_label: "Natija va qabul",
    admissions_step3_desc: "Grant yoki chegirma asosida o'qish",
    admissions_test_eyebrow: "Imtihon",
    admissions_test_title: "Imtihon nimalardan iborat?",
    admissions_grades_label: "Qabul qilinadigan sinflar",
    admissions_grades_value: "7–11 sinf",
    admissions_register: "Ro'yxatdan o'tish",
    admissions_secondary: "Savollaringiz bormi?",
  },
  meta: {
    home_title: "Sodiq School – Toshkentdagi Eng Yaxshi Xususiy Maktab",
    home_desc:
      " Toshkentdagi elita xususiy maktabi. Yunusoboddagi eng yaxshi maktabda zamonaviy taʼlim, kuchli matematika va TOP universitetlarga tayyorlov.",
    about_title:
      "Sodiq School Haqida – Xalqaro Taʼlim Standartlari va Maqsadlar",
    about_desc:
      "Sodiq School xususiy maktabi haqida. Bizning maqsadimiz – oʻquvchilarni xorijda oʻqish va dunyoning eng nufuzli chet el universitetlariga tayyorlashdir.",
    natijalar_title:
      "Sodiq School Natijalari – Yuqori IELTS va SAT Koʻrsatkichlari",
    natijalar_desc:
      "Oʻquvchilarimizning xalqaro imtihonlardagi muvaffaqiyatlari. Maktabimizdagi maktab yoshidagi oʻquvchilar uchun SAT va IELTS natijalari va yutuqlarimiz.",
    mash_title:
      "Sodiq School Mashgʻulotlari – Chuqurlashtirilgan Fanlar va Kurslar",
    mash_desc:
      "Maktabimizdagi darslar va toʻgaraklar. Matematika fanidan imtihonlarga tayyorlov, oʻquvchilar uchun haftalik qiziqarli mashgʻulotlar va til kurslari.",
    blog_title: "Sodiq School Blogi – Taʼlim Yangiliklari va Foydali Maqolalar",
    blog_desc:
      "Sodiq School taʼlim blogi. Maktab yoshidagi bolalar tarbiyasi, xalqaro imtihonlarga tayyorlanish sirlari va xususiy maktab hayotidan eng soʻnggi yangiliklar.",
    aloqa_title:
      "Sodiq School Aloqa – Toshkentdagi Xususiy Maktab Manzili va Telefonlari",
    aloqa_desc:
      "Sodiq School bilan bogʻlanish. Maktabimiz manzili, telefon raqamlari va maktabga bolani yozdirish uchun qabul boʻlimi kontaktlari.",
  },
};

const ru: Dict = {
  nav: {
    home: "Главная",
    about: "О нас",
    results: "Результаты",
    lessons: "Занятия",
    blog: "Блог",
    contact: "Контакты",
  },
  cta_apply: "Подать заявку",
  cta_back_all: "Все статьи",
  read_more: "Читать →",
  scroll_left: "Влево",
  scroll_right: "Вправо",
  open_menu: "Меню",
  see_video: "Смотреть видео →",
  loading: "Загрузка...",
  blog_search_placeholder: "Поиск по статьям...",
  form: {
    name: "ФИО",
    name_placeholder: "Ваше имя",
    phone: "Номер телефона",
    phone_placeholder: "+998 90 123 45 67",
    grade: "Класс ребёнка",
    grade_choose: "Выберите...",
    grade_options: ["7 класс", "8 класс", "9 класс", "10 класс", "11 класс"],
    message: "Ваш вопрос",
    message_placeholder: "Напишите ваш вопрос...",
    submit: "Получить консультацию",
    submitted: "Отправлено!",
    success: "Спасибо! Заявка принята. Свяжемся в течение 24 часов.",
    privacy: "Ваши данные не передаются третьим лицам.",
  },
  sections: {
    parents_say_eyebrow: "Доверие",
    parents_say_title: "Что говорят родители?",
    top_students_eyebrow: "Результаты учеников",
    top_students_title: "Они уже в TOP-университетах",
    results_eyebrow: "В цифрах",
    results_title: "Результаты говорят сами за себя",
    universities_eyebrow: "Университеты",
    universities_title: "В какие университеты поступили наши ученики?",
    universities_partners: "Партнёры",
    awards_eyebrow: "Достижения",
    awards_title: "Наши награды",
    advantages_eyebrow: "Почему мы?",
    advantages_title: "Преимущества Sodiq School",
    faq_eyebrow: "FAQ",
    faq_title: "Часто задаваемые вопросы",
    contact_eyebrow: "Связаться",
    contact_title: "Оставьте номер для консультации",
    contact_subtitle: "Мы свяжемся с вами в течение 24 часов.",
    address_label: "Адрес",
    phone_label: "Телефон",
    hours_label: "Часы работы",
    apply_label_phone: "Приём",
    telegram_btn: "Написать в Telegram",
    crumb_home: "Главная",
    teacher_more: "Подробнее",
    all_results: "Посмотреть все результаты →",
    all_articles: "Все статьи",
    all_teachers: "Все учителя",
    team_eyebrow: "Наша команда",
    team_title: "Познакомьтесь с командой Sodiq School",
    team_lead:
      "Авторы учебников, педагоги с международными сертификатами, выпускники университетов Италии и Великобритании. Опыт 8–25 лет. Подготовлено 7000+ учеников.",
    gallery_eyebrow: "Галерея",
    gallery_title: "Жизнь школы",
    bottom_stat_template:
      "<strong>239</strong> выпускников получили приглашения от <strong>500+</strong> ТОП-университетов",
    natijalar_alumni_eyebrow: "Истории успеха",
    natijalar_alumni_title: "Наши выпускники",
    natijalar_alumni_sub:
      "Выпускники Sodiq School в престижных университетах мира.",
    natijalar_practice_eyebrow: "Партнёры по практике",
    natijalar_uni_question: "В какие университеты поступили?",
    mash_grant_dollars: "$0",
    mash_grant_to: "от",
    mash_grant_save: "до сэкономите",
    mash_grant_grads: "выпускников",
    mash_grant_offers: "офферов",
    mash_grant_desc:
      "Если ребёнок выиграет грант и поступит за рубеж — вы освобождаетесь от расходов на обучение в этом размере.",
    mash_exam_eyebrow: "Международные экзамены",
    mash_exam_title: "Подготовка к IELTS и SAT",
    mash_exam_lead:
      "Курсы международных экзаменов параллельно с академическими предметами",
    mash_subjects_eyebrow: "Учебная программа",
    mash_subjects_title: "Академические и воспитательные предметы",
    mash_extra_eyebrow: "Дополнительно",
    mash_extra_title: "Дополнительные занятия",
    mash_cta_title: "Начните будущее ребёнка уже сегодня",
    mash_cta_desc:
      "Приём 2026–2027 открыт. Места ограничены — всего <strong>20 мест</strong> на класс.",
    admissions_step1_label: "Экзамен",
    admissions_step1_desc:
      "Математика, английский, критическое мышление — 2 часа",
    admissions_step2_label: "Собеседование",
    admissions_step2_desc: "Беседа с ребёнком и родителями",
    admissions_step3_label: "Результат и приём",
    admissions_step3_desc: "Обучение по гранту или со скидкой",
    admissions_test_eyebrow: "Экзамен",
    admissions_test_title: "Из чего состоит экзамен?",
    admissions_grades_label: "Принимаемые классы",
    admissions_grades_value: "7–11 класс",
    admissions_register: "Записаться",
    admissions_secondary: "Есть вопросы?",
  },
  meta: {
    home_title: "Sodiq School – Лучшая Частная Школа в Ташкенте | Цены",
    home_desc:
      "Элитная частная школа в Ташкенте на Юнусабаде. Качественное образование, сильная математика и подготовка в ТОП-100 вузов мира. Узнайте цены!",
    about_title: "О школе Sodiq School – Международное Образование в Ташкенте",
    about_desc:
      "Подробно о частной школе Sodiq School. Наша миссия — качественное обучение за рубежом, поступление в зарубежные вузы и подготовка к топ-университетам.",
    natijalar_title: "Результаты Sodiq School – Высокие Баллы по IELTS и SAT",
    natijalar_desc:
      "Достижения наших учеников. Высокие результаты и подготовка к SAT и IELTS для школьников в Ташкенте. Мы гордимся нашими выпускниками!",
    mash_title: "Занятия в Sodiq School – Учебная Программа и Предметы",
    mash_desc:
      "Уникальная программа занятий в Sodiq School. Продвинутая математика, интенсивные уроки и эффективная подготовка к вступительным экзаменам в школу.",
    blog_title: "Блог Sodiq School – Новости Образования и Полезные Статьи",
    blog_desc:
      "Полезный блог для родителей и школьников в Ташкенте. Статьи о подготовке к SAT и IELTS, советы по поступлению в зарубежные вузы и новости частной школы.",
    aloqa_title:
      "Контакты Sodiq School – Частная Школа в Ташкенте (Адрес и Телефон)",
    aloqa_desc:
      "Контакты частной школы Sodiq School в Ташкенте. Адрес школы, номера телефонов и информация, как записать ребенка в школу и связаться с приемной комиссией.",
  },
};

const en: Dict = {
  nav: {
    home: "Home",
    about: "About us",
    results: "Results",
    lessons: "Lessons",
    blog: "Blog",
    contact: "Contact",
  },
  cta_apply: "Apply now",
  cta_back_all: "All articles",
  read_more: "Read →",
  scroll_left: "Left",
  scroll_right: "Right",
  open_menu: "Menu",
  see_video: "Watch video →",
  loading: "Loading...",
  blog_search_placeholder: "Search articles...",
  form: {
    name: "Full name",
    name_placeholder: "Your name",
    phone: "Phone number",
    phone_placeholder: "+998 90 123 45 67",
    grade: "Child's grade",
    grade_choose: "Choose...",
    grade_options: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"],
    message: "Your question",
    message_placeholder: "Write your question...",
    submit: "Get a consultation",
    submitted: "Submitted!",
    success:
      "Thank you! Your application is received. We will contact you within 24 hours.",
    privacy: "Your information is not shared with third parties.",
  },
  sections: {
    parents_say_eyebrow: "Trust",
    parents_say_title: "What parents say",
    top_students_eyebrow: "Student results",
    top_students_title: "They are already at top universities",
    results_eyebrow: "In numbers",
    results_title: "Results speak for themselves",
    universities_eyebrow: "Universities",
    universities_title: "Which universities did our students get into?",
    universities_partners: "Partners",
    awards_eyebrow: "Achievements",
    awards_title: "Our awards",
    advantages_eyebrow: "Why us?",
    advantages_title: "Sodiq School advantages",
    faq_eyebrow: "FAQ",
    faq_title: "Frequently asked questions",
    contact_eyebrow: "Contact",
    contact_title: "Leave your number for a consultation",
    contact_subtitle: "We'll get back to you within 24 hours.",
    address_label: "Address",
    phone_label: "Phone",
    hours_label: "Hours",
    apply_label_phone: "Admissions",
    telegram_btn: "Message us on Telegram",
    crumb_home: "Home",
    teacher_more: "Read more",
    all_results: "See all results →",
    all_articles: "All articles",
    all_teachers: "All teachers",
    team_eyebrow: "Our team",
    team_title: "Meet the Sodiq School team",
    team_lead:
      "Textbook authors, internationally certified educators, graduates of Italian and British universities. 8–25 years of experience. Specialists who have prepared 7000+ students.",
    gallery_eyebrow: "Gallery",
    gallery_title: "School life",
    bottom_stat_template:
      "<strong>239</strong> graduates have received offers from <strong>500+</strong> top universities",
    natijalar_alumni_eyebrow: "Success stories",
    natijalar_alumni_title: "Our alumni",
    natijalar_alumni_sub:
      "Sodiq School graduates studying at the world's top universities.",
    natijalar_practice_eyebrow: "Internship partners",
    natijalar_uni_question: "Which universities did they get into?",
    mash_grant_dollars: "$0",
    mash_grant_to: "from",
    mash_grant_save: "up to saved",
    mash_grant_grads: "graduates",
    mash_grant_offers: "admission offers",
    mash_grant_desc:
      "If your child wins a grant and gets in abroad, you save this much in tuition.",
    mash_exam_eyebrow: "International exams",
    mash_exam_title: "IELTS and SAT preparation",
    mash_exam_lead:
      "International exam courses taught alongside academic subjects",
    mash_subjects_eyebrow: "Curriculum",
    mash_subjects_title: "Academic and character subjects",
    mash_extra_eyebrow: "Extras",
    mash_extra_title: "Extra activities",
    mash_cta_title: "Start your child's future today",
    mash_cta_desc:
      "Admissions 2026–2027 are open. Limited seats — only <strong>20 spots</strong> per grade.",
    admissions_step1_label: "Exam",
    admissions_step1_desc: "Math, English, critical thinking — 2 hours",
    admissions_step2_label: "Interview",
    admissions_step2_desc: "Conversation with the child and parents",
    admissions_step3_label: "Result & admission",
    admissions_step3_desc: "Study on a grant or with a discount",
    admissions_test_eyebrow: "Exam",
    admissions_test_title: "What is on the exam?",
    admissions_grades_label: "Grades accepted",
    admissions_grades_value: "Grades 7–11",
    admissions_register: "Register",
    admissions_secondary: "Got questions?",
  },
  meta: {
    home_title: "Sodiq School – Top Private School in Tashkent | Fees",
    home_desc:
      "Elite private school in Tashkent, Yunusabad. High-quality secondary education, advanced mathematics, and direct preparation for TOP-100 world universities.",
    about_title:
      "About Sodiq School – Elite International High School Tashkent",
    about_desc:
      "Learn about Sodiq School. Discover our values, high academic standards, and professional preparation for admission to top international universities.",
    natijalar_title: "Sodiq School Results – Outstanding IELTS and SAT Scores",
    natijalar_desc:
      "Academic achievements and student results at Sodiq School. Discover our high high school scores in international SAT and IELTS preparation in Tashkent.",
    mash_title: "Sodiq School Classes – Advanced Curriculum & Activities",
    mash_desc:
      "Discover educational classes and school activities at Sodiq School. Advanced mathematics courses and intensive entry exam preparation for high school.",
    blog_title: "Sodiq School Blog – Educational Insights & School News",
    blog_desc:
      "Sodiq School official blog. Read the latest news on high school education, practical tips for SAT/IELTS preparation, and university admission guides.",
    aloqa_title:
      "Contact Sodiq School – Private School in Tashkent (Address & Phone)",
    aloqa_desc:
      "Contact Sodiq Private School in Tashkent. Find our official address, phone numbers, and admissions office details to enroll your child today.",
  },
};

const dictionaries: Record<Locale, Dict> = { uz, ru, en };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.uz;
}
