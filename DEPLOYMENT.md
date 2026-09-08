# 🚀 دليل تشغيل كادر (Kader ATS) على Vercel + Supabase (مجاني 100% وبدون Render)

تم إعداد المشروع بالكامل ليعمل على أقوى منصتين سحابيتين عالمياً وبدون أي تكلفة أو بطاقة بنكية:
1. **قاعدة البيانات (Database)**: مرفوعة ومفعلة بالفعل على **Supabase** (PostgreSQL).
2. **الباك إند والواجهة (Backend API + Frontend)**: يعملان معاً على **Vercel** من نفس المشروع بدون مشاكل CORS نهائياً وبأعلى سرعة عالمية.

---

## ⚡ خطوات الرفع على Vercel في 3 دقائق:

### 1. ادخل على Vercel
1. افتح موقع [Vercel.com](https://vercel.com) وسجل الدخول بحساب GitHub الخاص بك.
2. اضغط على زر **`Add New...`** في الأعلى ثم اختر **`Project`**.

---

### 2. استيراد المستودع (Import Repository)
1. ستجد مستودعك **`AliElemam77/Kader---`**، اضغط على زر **`Import`** بجانبه.
2. **إعدادات المشروع (Project Settings)**:
   * **Project Name**: يمكنك تركه كما هو أو تسميته `kader-ats`.
   * **Framework Preset**: اتركه **Vite** أو Other.
   * **Root Directory**: اتركه كما هو `./` (المجلد الرئيسي).

---

### 3. إضافة المتغيرات البيئية (Environment Variables)
افتح قسم **Environment Variables** وأضف المتغيرات التالية (يمكنك نسخها ولصقها مباشرة):

| Key | Value | الوصف |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | وضع الإنتاج |
| `DATABASE_URL` | `postgresql://postgres.xvziprjtvxfxyszqbvvb:KaderATS_2026_Secure!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | اتصال قاعدة بيانات Supabase |
| `DIRECT_URL` | `postgresql://postgres.xvziprjtvxfxyszqbvvb:KaderATS_2026_Secure!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | اتصال مباشر للميجريشن |
| `JWT_SECRET` | `kader_secure_prod_jwt_secret_2026_x` | مفتاح تشفير التوكن |
| `SMTP_SERVICE` | `gmail` | خادم البريد |
| `SMTP_HOST` | `smtp.gmail.com` | خادم جوجل |
| `SMTP_PORT` | `465` | منفذ البريد |
| `SMTP_SECURE` | `true` | اتصال مشفر |
| `SMTP_USER` | `ali.elemam888@gmail.com` | بريدك في Gmail |
| `SMTP_PASS` | `cpps gniw geib kzsm` | كود التطبيقات App Password |
| `EMAIL_FROM` | `Kader ATS <ali.elemam888@gmail.com>` | اسم الراسل |

---

### 4. إطلاق المشروع (Deploy)
1. اضغط على زر **`Deploy`**.
2. انتظر حوالي 60 ثانية حتى يكتمل البناء وتظهر لك شاشة الاحتفال والرابط المباشر لموقعك! (مثال: `https://kader-ats.vercel.app`).

---

## 🔍 الروابط بعد الرفع:
* **فحص صحة الباك إند مع Supabase مباشرة**:
  `https://your-project.vercel.app/api/health`
  (سترجع لك JSON يوضح أن السيرفر شغال والداتابيز `connected`).
* **واجهة النظام ولوحة التحكم**:
  `https://your-project.vercel.app/`
* **بوابة الوظائف العامة للمتقدمين**:
  `https://your-project.vercel.app/jobs`
