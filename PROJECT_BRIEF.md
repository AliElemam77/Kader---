# 🚀 كادر — Kader ATS | Project Brief & Technical Blueprint
### وثيقة المشروع الشاملة والمواصفات الفنية والهوية البصرية الرسمية

---

## 📑 جدول المحتويات / Table of Contents
1. [🇸🇦 النسخة العربية (Arabic Version)](#-النسخة-العربية)
   - [1. نبذة عن الهوية والمشروع](#1-نبذة-عن-الهوية-والمشروع)
   - [2. الهوية البصرية ونظام التصميم (Kader Design System)](#2-الهوية-البصرية-ونظام-التصميم)
   - [3. نبرة الكتابة والتواصل (Voice & Tone)](#3-نبرة-الكتابة-والتواصل)
   - [4. المشاكل التي يعالجها النظام](#4-المشاكل-التي-يعالجها-النظام)
   - [5. المميزات والوحدات الوظيفية الرئيسية](#5-المميزات-والوحدات-الوظيفية-الرئيسية)
   - [6. المعمارية التقنية وحزمة البرمجيات](#6-المعمارية-التقنية-وحزمة-البرمجيات)
   - [7. بنية قاعدة البيانات ونموذج البيانات](#7-بنية-قاعدة-البيانات-ونموذج-البيانات)
   - [8. نظام الإيميلات التلقائي](#8-نظام-الإيميلات-التلقائي)
   - [9. دليل التشغيل والتهيئة المحلية](#9-دليل-التشغيل-والتهيئة-المحلية)
2. [🇬🇧 English Version](#-english-version)
   - [1. Brand Identity & Executive Summary](#1-brand-identity--executive-summary)
   - [2. Visual Identity & Design Tokens](#2-visual-identity--design-tokens)
   - [3. Voice & Tone Guidelines](#3-voice--tone-guidelines)
   - [4. Problems Solved](#4-problems-solved)
   - [5. Core Features & Functional Modules](#5-core-features--functional-modules)
   - [6. Technical Architecture & Tech Stack](#6-technical-architecture--tech-stack)
   - [7. Database Schema & Data Modeling](#7-database-schema--data-modeling)
   - [8. Automated Transactional Email Engine](#8-automated-transactional-email-engine)
   - [9. Setup & Local Development Guide](#9-setup--local-development-guide)

---

# 🇸🇦 النسخة العربية

## 1. نبذة عن الهوية والمشروع
**كادر (Kader ATS)** هو نظام متكامل ومتقدم لإدارة وتتبع المتقدمين للوظائف (Applicant Tracking System)، صُمم وفق هوية بصرية متميزة تعبّر عن جوهر التوظيف:
> **«كادر هو فريق العمل نفسه — الأشخاص الذين تبنيهم الشركة واحداً بعد الآخر. أنت لا تشتري مجرد نظام تتبع، بل تبني كادرك المؤسسي.»**

* **الشعار اللفظي (Slogan):** «من التقديم إلى التعيين، في مسار واحد.»
* **الاسم الإنجليزي:** Kader — ينطق ويكتب بنفس الطريقة بالعربية والإنجليزية ولا يحتاج ترجمة في السوق الخليجي أو العالمي.
* **الهدف:** تحويل عمليات التوظيف المشتتة إلى مسار عمل رقمي ذكي، مرن، ومؤتمت بالكامل، بدءاً من نشر الوظائف ونماذج التقديم الديناميكية، مروراً بمتابعة المرشحين عبر لوحة كانبان تفاعلية، وحتى إرسال العروض الوظيفية أو التغذية الراجعة البناءة.

---

## 2. الهوية البصرية ونظام التصميم
تم تطبيق دليل الهوية البصرية الشامل لـ **كادر**:

### أ) العلامة والشعار (The Mark)
ثلاثة أشخاص على ثلاث درجات صاعدة تعبّر عن مسار المرشحين في لوحة الكانبان والمنتج كله في لمحة واحدة:
1. **العمود الأول (Slate - `#5A6478`):** مرشح جديد في مرحلة الفرز الأولي.
2. **العمود الثاني (Signal Blue - `#4C8DFF`):** مرشح في المقابلات والتقييمات الفنية.
3. **العمود الثالث (Amber Gold - `#F5B23D`):** مرشح وصل للعرض الوظيفي والتعيين النهائي (نقطة الوصول في القصة).

### ب) نظام الألوان والأسطح (Color Tokens)
* `--ink: #070A14`: خلفية التطبيق الليلية الكوزميكية، ولون النص على الخلفيات الفاتحة.
* `--deep: #0E1524`: الأسطح المرفوعة (أعمدة الكانبان، النوافذ المنبثقة، القوائم).
* `--raise: #151E31`: الأسطح الأعلى (كروت المرشحين، الحقول التفاعلية).
* `--line: rgba(255, 255, 255, 0.09)`: الحدود والفواصل الدقيقة.
* `--amber: #F5B23D`: لون العلامة الأساسي وزر الإجراء الرئيسي.
* `--signal: #4C8DFF`: الروابط، المقابلات المجدولة، والتوهج الضوئي.
* `--mint: #35D6A4`: تم التعيين، النجاح، والتأكيد.
* `--rose: #FF7A85`: مستبعد، الحذف، وحالات التنبيه الحرجة.
* `--cloud: #EEF1F7`: النص الأساسي عالي التباين (نسبة تباين 16.2:1).
* `--muted: #8892A6`: النص المساعد والتسميات الثانوية.

### ج) الخطوط والطباعة (Typography)
* **العربية:** `IBM Plex Sans Arabic` (أوزان 400 / 500 / 600 / 700) — خط واجهات متزن وواضح في الأحجام الصغيرة.
* **الإنجليزية:** `Plus Jakarta Sans` (أوزان 400 / 600 / 700 / 800) — متوافق بصرياً مع ارتفاع البلكس العربي.
* **أرقام وبيانات:** `JetBrains Mono` — لأرقام الطلبات، رموز التحقق OTP، وأكواد الألوان فقط.

### د) هرمية الأزرار (Action Hierarchy)
* **زر ذهبي أساسي واحد في الشاشة (`.btn-pri` / Amber):** يمثل الفعل الذي يدفع المرشح أو العملية خطوة للأمام (`#F5B23D` مع نص `#1A1204`).
* **زر ثانوي (`.btn-sec`):** خلفية خافتة `rgba(255, 255, 255, 0.07)` وحدود `--line`.
* **زر حرج (`.btn-danger`):** خلفية وردية خافتة `rgba(255, 122, 133, 0.12)` وحدود وردية.

---

## 3. نبرة الكتابة والتواصل (Voice & Tone)
يعتمد كادر على أسلوب مخاطبة مباشر، محترم، وخالٍ من العبارات الآلية المكررة:
* بدلاً من *"تم إرسال البيانات بنجاح"* ➔ **«وصل طلبك، ورقمه APP-2026-XXXX»**
* بدلاً من *"خطأ في العملية"* ➔ **«هذا البريد قدّم على الوظيفة من قبل. راجع بريدك للاطلاع على حالة طلبك.»**
* بدلاً من *"لا توجد بيانات"* ➔ **«لا مرشحين في هذه المرحلة بعد. انشر الوظيفة لتبدأ الطلبات بالوصول.»**
* بدلاً من *"تم رفض المتقدم"* ➔ **«استُبعد المرشح، وأُرسلت له ملاحظاتك.»**

---

## 4. المشاكل التي يعالجها النظام
* **فوضى استلام السير الذاتية:** تجميع الطلبات عبر الإيميل ومواقع التواصل يسبب ضياع الكفاءات؛ يوفر كادر مساراً موحداً من التقديم للتعيين.
* **جمود استمارات التقديم:** يوفر كادر منشئ نماذج ديناميكي يسمح بتخصيص أسئلة كل وظيفة وترتيبها بالسحب والإفلات.
* **غياب الشفافية والتواصل:** يقوم كادر بإرسال إيميلات رسمية فورية للمرشح عند كل انتقال مرحلي مع إرفاق التكليفات والمقابلات.
* **التكرار العشوائي للتقديم:** فحص فوري يمنع تكرار تقديم نفس البريد لنفس الوظيفة بأمان.
* **الاستبعاد الصامت:** إلزام مسؤولي التوظيف بكتابة أو اختيار تغذية راجعة بناءة تُرسل للمرشح احتراماً لوقته، مع خيار التراجع عن الاستبعاد.

---

## 5. المميزات والوحدات الوظيفية الرئيسية
1. **بوابة الوظائف العامة (Public Careers Portal):** واجهة تقديم أنيقة بالهوية الكوزميكية مع استعراض الوظائف وتصفيتها.
2. **منشئ النماذج الديناميكي (Dynamic Form Builder):** بناء استمارات مخصصة لكل وظيفة (نصوص، أرقام، ملفات، اختيارات).
3. **مسار التوظيف ولوحة الكانبان (Kanban Pipeline):** أعمدة مراحل قابلة لإعادة الترتيب، سحب وإفلات المرشحين، ومؤشرات لونية للمراحل.
4. **جدولة المقابلات والتكليفات (Interviews & Tasks):** ربط مقابلات فيديو أو حضورية وتكليفات فنية مع إشعارات آلية.
5. **صندوق البريد الصادر التفاعلي (Live Outbox Modal):** استعراض حي لكافة الإيميلات المرسلة ومعاينة الـ HTML واختبار الإرسال.
6. **فريق العمل والصلاحيات (Team Management):** دعوة الزملاء بروابط دخول سحرية وإدارة صلاحيات المدراء ومسؤولي التوظيف.
7. **دعم كامل للغتين (العربية والإنجليزية):** تحويل فوري للغة ومحاذاة RTL/LTR بدون إعادة تحميل الصفحة.

---

## 6. المعمارية التقنية وحزمة البرمجيات
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, i18next + react-i18next, Sonner.
* **Backend:** Node.js, Express.js, Prisma ORM, Nodemailer, JWT (JSON Web Tokens).
* **Database:** PostgreSQL (دعم حقول JSONB للنماذج والمراحل المخصصة).

---

## 7. بنية قاعدة البيانات ونموذج البيانات
* `users`: معرّف، البريد الإلكتروني، الاسم، الدور (`HR_MANAGER` / `RECRUITER`)، الحالة.
* `jobs`: العنوان، القسم، الموقع، نوع الدوام، الوصف، الحالة، `formFields` (JSONB)، `pipelineStages` (JSONB).
* `candidates`: معرّف الوظيفة، الاسم، البريد، الهاتف، رابط السيرة الذاتية، `applicantData` (JSONB)، المرحلة الحالية، الحالة، وسبب الاستبعاد.
* `verification_codes`: لتأمين الدخول بروابط الماجيك لينك ورموز OTP السداسية.

---

## 8. نظام الإيميلات التلقائي
تصميم «الكارد الأبيض العائم فوق فضاء كوزميك داكن» متوافق مع كافة برامج البريد (Gmail, Apple Mail, Outlook):
* أيقونة كادر الرسمية (العلامة ثلاثية الأشخاص) في مربع داكن أعلى الكارد.
* عنوان وتفاصيل المرحلة بالإنجليزية الواضحة.
* صندوق تنبيهات كريمي دافئ (`#FEF9EE`) للتوجيهات الهامة.
* شارة معرّف الطلب بخط مونوسبيس (`JetBrains Mono`).
* توهج أزرق ساحر في الأسفل مع روابط التواصل وحقوق المنصة.

---

## 9. دليل التشغيل والتهيئة المحلية
```bash
# تثبيت الاعتماديات
npm install
npm install --prefix client
npm install --prefix server

# تهيئة قاعدة البيانات
npx prisma generate --schema=server/prisma/schema.prisma
npx prisma db push --schema=server/prisma/schema.prisma

# تشغيل التطبيق محلياً
npm run dev
```

---

# 🇬🇧 English Version

## 1. Brand Identity & Executive Summary
**Kader (كادر ATS)** is an advanced, flexible Applicant Tracking System designed for modern hiring teams:
> **"Kader is the workforce itself — the people a company builds one by one. You don't just buy a tracking system, you build your Kader."**

* **Tagline:** *"One track from apply to hire."*
* **Mission:** Unifying chaotic recruitment processes into one intelligent, dynamic, and automated track — from job publishing and dynamic form building to interactive Kanban pipelines and structured feedback.

---

## 2. Visual Identity & Design Tokens
* **The Mark:** Three ascending figures representing candidate progression:
  1. Slate (`#5A6478`): New candidate in initial screening.
  2. Signal Blue (`#4C8DFF`): Candidate in interview and assessment.
  3. Amber Gold (`#F5B23D`): Hired candidate / final job offer.
* **Surface System:** `--ink: #070A14` (Cosmic base), `--deep: #0E1524` (Elevated columns & modals), `--raise: #151E31` (Candidate cards).
* **Typography:** `IBM Plex Sans Arabic` for Arabic interfaces, `Plus Jakarta Sans` for Latin interfaces, and `JetBrains Mono` for codes and application numbers.
* **Action Hierarchy:** A single primary Amber button (`#F5B23D`) per screen driving the primary forward momentum.

---

## 3. Voice & Tone Guidelines
Direct, respectful, and transparent communication:
* Instead of *"Submission successful"* ➔ **"We received your application (APP-2026-XXXX)"**
* Instead of *"An error occurred"* ➔ **"This email has already applied for this position. Check your inbox for updates."**
* Instead of *"No data found"* ➔ **"No candidates in this stage yet. Publish this job to start receiving applications."**
* Instead of *"Candidate rejected"* ➔ **"Candidate has been excluded, and your feedback has been sent."**

---

## 4. Core Features & Functional Modules
1. **Public Careers Portal:** Clean applicant portal with department filtering, search, and dynamic forms.
2. **Dynamic Form Builder:** Fully custom questions per job with real-time preview and drag-to-reorder.
3. **Interactive Kanban Pipeline:** Drag-and-drop candidates, customizable stage types, and color accents.
4. **Interview & Task Scheduling:** In-person / video interview coordination with automated candidate notices.
5. **Live Outbox Simulator:** Real-time visibility into all dispatched transactional emails with full HTML preview.
6. **HR Team Access & Security:** Passwordless magic link and 6-digit OTP authentication.
7. **Bilingual i18n Engine:** Seamless English & Arabic support with automatic RTL/LTR direction switching.

---

## 5. Setup & Local Development Guide
```bash
# 1. Install dependencies
npm install && npm install --prefix client && npm install --prefix server

# 2. Setup PostgreSQL database schema
npx prisma generate --schema=server/prisma/schema.prisma
npx prisma db push --schema=server/prisma/schema.prisma

# 3. Start development servers
npm run dev
```
