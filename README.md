# Sodiq School — Next.js + Node.js + MySQL

Toshkentdagi xususiy Sodiq School maktabi sayti — endi to'liq professional `Next.js` + `Node.js` + `MySQL` stack ustida. 3 til (uz / ru / en), to'liq CRUD admin paneli, va asosiy sayt.

## Loyiha tuzilishi

```
sodiq school/
├── backend/          ← Node.js + Express + MySQL API server (port 4000)
├── client-site/      ← Next.js — sodiqschool.uz (asosiy sayt, port 3000)
├── admin-site/       ← Next.js — admin.sodiqschool.uz (admin panel, port 3001)
└── sodiq-school/     ← Eski static HTML versiya (reference uchun saqlangan)
```

Har uchchala loyiha mustaqil — alohida `npm install` va `npm run dev` qilinadi.

---

## Tezkor boshlash (3 daqiqa)

### 1. MySQL serverni ishga tushiring

Windows: XAMPP yoki MySQL Workbench bilan local MySQL ishga tushiring (default port 3306).

Yoki Docker bilan:
```bash
docker run --name sodiq-mysql -e MYSQL_ROOT_PASSWORD= -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -p 3306:3306 -d mysql:8
```

### 2. Backend

```bash
cd backend
npm install
# .env faylini sozlang (DB_PASSWORD va h.k.)
npm run db:reset   # database yaratadi + schema + seed (default admin)
npm run dev        # http://localhost:4000
```

### 3. Client site

```bash
cd client-site
npm install
npm run dev        # http://localhost:3000
```

### 4. Admin site

```bash
cd admin-site
npm install
npm run dev        # http://localhost:3001
```

Brauzerdan `http://localhost:3001/login`ga kiring va default credentialslar bilan loginlang:

```
Email:    developer@gmail.com
Password: developer$123
```

---

## Backend (Node.js + Express + MySQL)

### Texnik stek
- **Express 4** — HTTP server
- **mysql2/promise** — DB driver
- **JWT** — admin auth (Bearer token, 7 kun amal qilish muddati)
- **bcryptjs** — parol hash
- **multer** — fayl yuklash (rasmlar `/uploads/`ga saqlanadi)
- **zod** — input validation

### .env

```env
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000
ADMIN_ORIGIN=http://localhost:3001

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=sodiq_school

JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=7d

SEED_ADMIN_EMAIL=developer@gmail.com
SEED_ADMIN_PASSWORD=developer$123
SEED_ADMIN_NAME=Developer

UPLOAD_DIR=uploads
PUBLIC_BASE_URL=http://localhost:4000
```

### Skriptlar
| Skript | Tavsif |
| --- | --- |
| `npm run dev` | nodemon bilan ishga tushirish |
| `npm start` | production rejimda ishga tushirish |
| `npm run db:migrate` | Database va jadvallarni yaratadi (DROP qiladi) |
| `npm run db:seed` | Boshlang'ich kontent + default admin |
| `npm run db:reset` | migrate + seed (toza qayta yuklash) |

### Database sxemasi

Har bir tarjima qilinadigan obyekt 2 jadvalda saqlanadi:
- **Asosiy jadval** (mas. `teachers`) — tilga bog'liq bo'lmagan ma'lumot (rasm, tartib, slug)
- **Translations jadvali** (mas. `teacher_translations`) — har bir locale (`uz/ru/en`) uchun matnlar

Jadvallar:
- `users` — admin foydalanuvchilar
- `media` — yuklangan rasmlar
- `settings` — sayt-uchun key/value matnlar (3 ta tilda + raw)
- `teachers` + `teacher_translations`
- `top_students`, `alumni`, `exam_results`, `awards`, `universities`, `blog_posts`,
  `exam_courses`, `lesson_subjects`, `lesson_extras`, `gallery_items`, `faqs` — har biri o'zining `*_translations` bilan
- `testimonial_videos` — videolar (oddiy URL, tarjima yo'q)
- `application_submissions` — saytdan kelgan formalar

### API endpointlar (umumiy ko'rinish)

**Auth (admin):**
- `POST /api/auth/login` — email + parol → JWT
- `GET /api/auth/me` — joriy foydalanuvchi
- `POST /api/auth/change-password`

**Foydalanuvchilar (faqat superadmin):**
- `GET /api/users`
- `POST /api/users` (admin yaratish)
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

**Media:**
- `POST /api/upload` — `multipart/form-data` `file` → `{ id, url }`
- `GET  /api/media`
- `DELETE /api/media/:id`

**Sayt sozlamalari:**
- `GET  /api/settings?lang=uz` — bir til uchun key/value mapping (public)
- `GET  /api/settings/all` — barcha tillar (admin)
- `PUT  /api/settings/:key`

**Har bir resurs uchun (teachers, top-students, alumni, awards, blog, faqs, va h.k.):**
- `GET    /api/<resource>?lang=uz` — public list (1 til)
- `GET    /api/<resource>/:id?lang=uz` — public detail
- `GET    /api/<resource>/:id/admin` — admin detail (3 til)
- `POST   /api/<resource>` — admin create
- `PUT    /api/<resource>/:id` — admin update
- `DELETE /api/<resource>/:id` — admin delete

**Maxsus:**
- `GET /api/blog/by-slug/:slug?lang=uz`
- `GET /api/exam-results/by-type/:type?lang=uz` — `ielts` yoki `sat`
- `GET /api/faqs/by-page/:page?lang=uz` — `index`, `aloqa`, yoki `both`
- `GET /api/public-site?lang=uz` — **MEGA endpoint**: butun saytning bir locale'dagi kontentini bir so'rovda qaytaradi (frontend buni ishlatadi, tezroq SSR uchun)

**Arizalar (form submissions):**
- `POST /api/applications` — public
- `GET /api/applications` — admin inbox
- `PUT /api/applications/:id` — status yangilash
- `DELETE /api/applications/:id`

---

## Client Site (Next.js 14 — sodiqschool.uz)

`http://localhost:3000` — public sayt.

### Texnik stek
- **Next.js 14 App Router** + TypeScript
- **`[locale]` segment** — `/uz`, `/ru`, `/en`
- **next.middleware** — root URL'larni avtomatik default tilga redirect qiladi
- **next.cookies** — tanlangan til `NEXT_LOCALE` cookie'ga saqlanadi
- **Server Components + revalidate: 30** — sahifalar SSR + 30 sekund cache

### Sahifalar
| URL | Faylda |
| --- | --- |
| `/uz` | `src/app/[locale]/page.tsx` (asosiy sahifa) |
| `/uz/about` | `src/app/[locale]/about/page.tsx` |
| `/uz/natijalar` | `src/app/[locale]/natijalar/page.tsx` |
| `/uz/mashgulotlar` | `src/app/[locale]/mashgulotlar/page.tsx` |
| `/uz/blog` | `src/app/[locale]/blog/page.tsx` |
| `/uz/blog/[slug]` | `src/app/[locale]/blog/[slug]/page.tsx` |
| `/uz/ustoz/[slug]` | `src/app/[locale]/ustoz/[slug]/page.tsx` |
| `/uz/aloqa` | `src/app/[locale]/aloqa/page.tsx` |

### Dizayn

**`styles.css` o'zgartirilmadi** — eski HTML versiyadagi 2305 qatorlik CSS aynan `client-site/src/app/globals.css`ga ko'chirilgan. Ya'ni yangi sayt eski sayt bilan **piksel-pikselgacha** bir xil ko'rinadi. Faqat til-almashtirgich qo'shildi (header'da `UZ / RU / EN` tugmalari).

### Til almashtirish ishlash usuli
1. Foydalanuvchi til tugmasini bosadi → cookie yoziladi → URL'dagi locale o'zgaradi
2. `middleware.ts` URL'ni tekshirib, locale prefiksi yo'q bo'lsa cookie'dan/Accept-Language'dan default tilga redirect qiladi
3. Har bir sahifa `params.locale`ga qarab `fetchSiteBundle(locale)` orqali API'dan kontentni oladi

### `/uploads/...` rasmlar

Backend rasmlarni `http://localhost:4000/uploads/...` orqali serve qiladi. Frontend `resolveMediaUrl()` helper bilan to'liq URL ga aylantiradi. Production'da `NEXT_PUBLIC_API_BASE_URL`ni o'zgartiring.

---

## Admin Site (Next.js 14 — admin.sodiqschool.uz)

`http://localhost:3001` — admin panel.

### Default kirish

```
Email:    developer@gmail.com
Password: developer$123
```

Bu ma'lumot `backend/.env`dagi `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` orqali sozlanadi. Birinchi loginindan keyin parolni o'zgartirish tavsiya etiladi.

### Texnik stek
- **Next.js 14** + TypeScript
- **JWT token** — `localStorage`da saqlanadi (`sodiq_admin_token`)
- **`AdminGate`** — har bir sahifani himoyalaydi, login bo'lmasa `/login`ga yuboradi
- **Brand stilida sidebar** (navy + orange) — asosiy sayt dizayni bilan uyg'un

### Sahifalar
| URL | Tavsif |
| --- | --- |
| `/login` | Login forma |
| `/dashboard` | Statistika va tezkor amallar |
| `/applications` | Saytdan kelgan arizalar (status: new / contacted / closed) |
| `/settings` | Sayt matnlari (hero, mission, contact va h.k.) — guruh bo'yicha + til tabs |
| `/users` | Admin foydalanuvchilar (faqat superadmin yangi qo'sha oladi) |
| `/teachers` `/top-students` `/awards` ... | Har bir resurs uchun list / new / edit |

### Yangi tarjima qo'shish jarayoni (admin uchun)

1. Admin sahifasiga kiring (mas. `/teachers/123`)
2. **Pastki bo'limda** "Tilga oid maydonlar" qismida `O'zbek / Русский / English` tabs ko'rinadi
3. Har bir tabga matnni alohida kiriting
4. **Saqlash** tugmasini bosing — bir vaqtda 3 til ham yangilanadi

### Yangi admin foydalanuvchi qo'shish

1. **Faqat superadmin**: `/users` → `+ Yangi admin`
2. Email, ism, parol, va rolni kiriting
3. Yangi foydalanuvchi darhol kira oladi

Rollar:
- `superadmin` — barcha imkoniyatlar (foydalanuvchi yaratish, o'chirish)
- `admin` — kontent CRUD (default)
- `editor` — hozircha admin bilan teng huquqli (kelajakda kontent-only qilish mumkin)

### Rasm yuklash

Admin formalari ichida `Rasm tanlash` tugmasi orqali. Rasm `backend/uploads/` ichiga saqlanadi va `media` jadvalida `id` oladi. Frontend bu `id` orqali rasm URL'ini `media.url` JOIN qilib oladi.

---

## Production deploy bo'yicha eslatma

### Backend
- `JWT_SECRET`ni alohida `openssl rand -hex 32` orqali yangilang
- MySQL'ni alohida managed service'da ishlating (PlanetScale, AWS RDS, va h.k.)
- `uploads/` papkasini volume sifatida mount qiling
- Production'da `NODE_ENV=production` o'rnating
- Process manager: PM2 yoki systemd

### Client / Admin
- `NEXT_PUBLIC_API_BASE_URL` env var'ini production backend URL'iga moslang
- `npm run build && npm start` (yoki Vercel'ga deploy)

### Subdomain konfiguratsiyasi (Nginx misoli)
```nginx
# sodiqschool.uz → client-site (port 3000)
server {
  server_name sodiqschool.uz www.sodiqschool.uz;
  location / { proxy_pass http://localhost:3000; }
}

# admin.sodiqschool.uz → admin-site (port 3001)
server {
  server_name admin.sodiqschool.uz;
  location / { proxy_pass http://localhost:3001; }
}

# api.sodiqschool.uz → backend (port 4000)
server {
  server_name api.sodiqschool.uz;
  location / { proxy_pass http://localhost:4000; }
  client_max_body_size 10M;
}
```

So'ng `.env.production`larda mos URL'larni o'rnating.

---

## Tez-tez beriladigan savollar

**Q: Eski `sodiq-school/` papkasi nima?**
A: Eski static HTML versiya. Reference uchun saqlangan. O'chirish mumkin yoki ko'rib chiqish uchun qoldirish.

**Q: Rasmlar qayerda saqlanadi?**
A: `backend/uploads/`. Seed paytida eski `sodiq-school/img` va `sodiq-school/images/blog`dan `backend/uploads/seed/`ga avtomatik nusxa olinadi.

**Q: Saytda yangi til qo'shish mumkinmi (mas. `kr` koreys tili)?**
A: Ha. 3 joyda o'zgartiring:
1. `backend/src/config/env.js` → `locales: ['uz', 'ru', 'en', 'kr']`
2. `client-site/src/i18n/config.ts` va `dictionaries.ts`
3. `admin-site/src/components/LocaleTabs.tsx`

Database'da hech narsa o'zgartirish kerak emas — translations jadvallari `locale` ustuni avtomatik yangi qiymatni qo'llab-quvvatlaydi.

**Q: Title'lar nega faqat dictionaryda?**
A: Foydalanuvchi qoidasi: "title-lardan boshqa deyarli barcha narsa o'zgaradi". Statik UI matnlar (nav, button labels, fixed section sarlavhalari) `dictionaries.ts`da kod ichida. Lekin har bir kontent (hero, blog, ustozlar va h.k.) admin'dan tahrir qilinadi.

---

## Litsenziya

Loyiha private — Sodiq School uchun.
#   s o d i q - s c h o o l  
 