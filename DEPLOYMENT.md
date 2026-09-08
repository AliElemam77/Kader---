# 🚀 دليل رفع وتشغيل كادر — Kader ATS على الإنترنت (Production Deployment Guide)

تم تجهيز المشروع بالكامل للرفع المجاني والسريع عبر التوليفة القياسية العالمية:
* **الواجهة (Frontend)**: على **Vercel** (سريعة جداً، Edge CDN عالمي، متصلة بـ GitHub تلقائياً).
* **الباك إند (Backend API)**: على **Render Web Service** (خدمة Node.js مجانية تدعم تشغيل دائم).
* **قاعدة البيانات (Database)**: **PostgreSQL** مجانية مدارة على **Render** (أو Neon).

---

## 📋 الخطوة الأولى: إنشاء قاعدة بيانات PostgreSQL على Render (دقيقة واحدة)

1. ادخل على حسابك في [Render.com](https://dashboard.render.com).
2. اضغط على زر **`New +`** في أعلى اليمين واختر **`PostgreSQL`**.
3. املأ البيانات كالتالي:
   * **Name**: `kader-db`
   * **Database**: `kader_ats_db`
   * **User**: `kader_admin`
   * **Region**: اختر الأقرب لك (مثل Frankfurt أو Oregon).
   * **Instance Type**: اختر **Free**.
4. اضغط **Create Database**.
5. بعد ثوانٍ، انزل لأسفل الصفحة تحت قسم **Connections**:
   * انسخ رابط الاتصال: **`Internal Database URL`** (أو **`External Database URL`**).

---

## ⚙️ الخطوة الثانية: رفع الباك إند (Backend API) على Render (دقيقتان)

1. من لوحة تحكم Render، اضغط **`New +`** واختر **`Web Service`**.
2. اربط مستودع GitHub الخاص بك: **`AliElemam77/Kader---`**.
3. اضبط الإعدادات كالتالي:
   * **Name**: `kader-api`
   * **Region**: نفس منطقة قاعدة البيانات.
   * **Branch**: `main`
   * **Root Directory**: اكتب: `server`
   * **Runtime**: `Node`
   * **Build Command**:
     ```bash
     npm install && npm run prisma:generate && npm run build
     ```
   * **Start Command**:
     ```bash
     npm run prisma:deploy && npm run start
     ```
   * **Instance Type**: **Free**

4. انزل لقسم **Environment Variables** وأضف المتغيرات التالية:

| اسم المتغير (Key) | القيمة (Value) | ملاحظات |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | وضع الإنتاج |
| `PORT` | `5000` | منفذ السيرفر |
| `DATABASE_URL` | *(الصق رابط قاعدة البيانات من الخطوة 1)* | رابط اتصال PostgreSQL |
| `JWT_SECRET` | `kader_secure_prod_jwt_secret_2026_x` | مفتاح تشفير الجلسات |
| `SMTP_SERVICE` | `gmail` | خادم البريد |
| `SMTP_HOST` | `smtp.gmail.com` | خادم جوجل |
| `SMTP_PORT` | `465` | منفذ SSL |
| `SMTP_SECURE` | `true` | اتصال مشفر |
| `SMTP_USER` | `ali.elemam888@gmail.com` | بريدك في Gmail |
| `SMTP_PASS` | `cpps gniw geib kzsm` | كود التطبيقات App Password |
| `EMAIL_FROM` | `Kader ATS <ali.elemam888@gmail.com>` | اسم الراسل |
| `CLIENT_URL` | `https://kader.vercel.app` | *(سنحدثه برابط Vercel الحقيقي في الخطوة 4)* |

5. اضغط **Deploy Web Service**.
6. انتظر دقيقتين حتى يكتمل البناء وتظهر علامة **`Live`** باللون الأخضر.
7. **انسخ رابط السيرفر العام** الظاهر أعلى الصفحة (مثال: `https://kader-api.onrender.com`).

---

## 🎨 الخطوة الثالثة: رفع الواجهة (Frontend) على Vercel (دقيقة واحدة)

1. ادخل على [Vercel.com](https://vercel.com) وسجل دخول بحساب GitHub.
2. اضغط **`Add New...`** ثم اختر **`Project`**.
3. اختر مستودعك: **`AliElemam77/Kader---`** واضغط **Import**.
4. في صفحة إعداد المشروع:
   * **Framework Preset**: سيظهر تلقائياً **Vite**.
   * **Root Directory**: اضغط على **Edit** واختر مجلد: **`client`** ثم اضغط **Continue**.
   * افتح قسم **Environment Variables** وأضف متغيراً واحداً:
     * **Key**: `VITE_API_URL`
     * **Value**: *(الصق رابط الـ Render API مع /api)*
       * مثال: `https://kader-api.onrender.com/api`
5. اضغط **Deploy**.
6. في أقل من دقيقة، سيكتمل البناء ويظهر لك شاشة الاحتفال والرابط الحي لموقعك (مثال: `https://kader.vercel.app` أو اسم مخصص تختاره).

---

## 🔄 الخطوة الرابعة والأخيرة: مزامنة رابط الموقع مع السيرفر

1. انسخ رابط موقعك النهائي من Vercel (مثال: `https://kader.vercel.app`).
2. ارجع إلى صفحة السيرفر في Render (`kader-api`) -> ثم اضغط على **Environment**.
3. قم بتعديل قيمة المتغير `CLIENT_URL` لتصبح رابط موقعك الجديد:
   * `CLIENT_URL` = `https://kader.vercel.app`
4. اضغط **Save Changes** (سيعيد السيرفر التشغيل في 10 ثوانٍ تلقائياً).

---

## ✅ مبروك! نظام كادر للتوظيف (Kader ATS) يعمل أونلاين الآن 🌐

* **رابط بوابة التوظيف العامة**: متاح للجمهور والباحثين عن عمل للتقديم على الوظائف.
* **رابط بوابة الـ HR**: محمي بنظام التحقق الثنائي (OTP) عبر الإيميل الحقيقي.
* **التحديثات المستقبلية**: بمجرد أن تعمل `git push origin main`، سيقوم Vercel و Render بالتحديث التلقائي خلال ثوانٍ معدودة!
