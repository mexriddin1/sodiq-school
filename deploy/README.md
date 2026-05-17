# Windows Server deploy

## 1-marta o'rnatish (bir martalik)

1. RDP orqali serverga ulaning:
   - Server: `84.54.83.200:3554`
   - User: `Administrator`
   - Pass: (sizning paroligiz)

2. Serverda **PowerShell**ni **Administrator sifatida** oching.

3. Quyidagi 3 ta buyruqni ketma-ket bajaring:

   ```powershell
   iwr -useb https://raw.githubusercontent.com/mexriddin1/sodiq-school/main/deploy/windows-server-setup.ps1 -OutFile C:\setup.ps1
   Set-ExecutionPolicy -Scope Process Bypass -Force
   C:\setup.ps1
   ```

   Skript sizdan **3 ta parol** so'raydi:
   - Yangi MySQL root paroli (o'zingiz tanlang, kuchli bo'lsin)
   - Admin email (default: `developer@gmail.com`)
   - Admin paroli (admin panelga kirish uchun)

   So'ng 10-15 daqiqada barchasini avtomatik o'rnatadi:
   - Node.js 20, Git, MySQL 8
   - Repo'ni `C:\sodiq-school`ga klonlaydi
   - `.env` fayllarni yaratadi
   - Build qiladi
   - Database yaratadi
   - PM2 bilan startupga qo'shadi
   - Firewall'da portlarni ochadi

4. Skript tugagach, brauzerda ochib ko'ring:
   - **Client:** `http://84.54.83.200:3000`
   - **Admin:**  `http://84.54.83.200:3001/login`

---

## Keyingi yangilashlar (kodda o'zgarish bo'lganda)

Lokal kompyuterda:
```powershell
git add .
git commit -m "update: ..."
git push
```

Serverda (RDP orqali):
```powershell
cd C:\sodiq-school
git pull
cd backend ; npm ci --omit=dev
cd ..\client-site ; npm ci ; npm run build
cd ..\admin-site ; npm ci ; npm run build
pm2 restart all
```

Yoki `deploy\update.ps1` skripti orqali (pastda).

---

## Foydali PM2 buyruqlari

| Buyruq | Tavsif |
|---|---|
| `pm2 status` | 3 ta jarayon holatini ko'rish |
| `pm2 logs` | Real-vaqt loglar |
| `pm2 logs sodiq-backend` | Faqat backend loglari |
| `pm2 restart all` | Hammasini qayta start |
| `pm2 restart sodiq-client` | Faqat client'ni restart |
| `pm2 stop all` | Hammasini to'xtatish |
| `pm2 monit` | Interaktiv monitoring |

---

## Domain ulash (sodiqschool.uz)

DNS panelda quyidagi A-recordlarni qo'shing:

```
sodiqschool.uz          A    84.54.83.200
www.sodiqschool.uz      A    84.54.83.200
admin.sodiqschool.uz    A    84.54.83.200
api.sodiqschool.uz      A    84.54.83.200
```

So'ng serverda IIS + URL Rewrite + ARR moduli o'rnatib, 80/443 portlardan ichki 3000/3001/4000 portlarga reverse proxy qiling. Bu uchun keyinroq alohida skript yozaman.

---

## Xavfsizlik eslatmalari

- `backend\.env` fayli MySQL parolini va JWT secret'ni o'z ichiga oladi — bu faylni hech kim bilan baham ko'rmang
- Birinchi loginindan keyin admin parolini o'zgartiring (`/users` → o'zingizni edit qiling)
- MySQL 3306 portini tashqi tarmoqdan **bekiting** — firewall'da faqat localhost ruxsat etilsin
- Skript ishga tushganda yangi MySQL paroli va admin parolini siz interaktiv kiritasiz — kuchli parollar tanlang
