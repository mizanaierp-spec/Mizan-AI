# Mizan AI - منظومة محاسبة ذكية متكاملة

**Intelligent Accounting System | نظام محاسبة ذكي**

## المميزات 🎯

- ✅ إدارة الحسابات والقيود المحاسبية
- ✅ إنشاء القوائم المالية تلقائيًا
- ✅ إدارة الموارد البشرية والرواتب
- ✅ إدارة المخزون والمبيعات
- ✅ إدارة البنك والخزينة
- ✅ نظام تدقيق شامل
- ✅ واجهة عربية متكاملة
- ✅ API RESTful متكامل

## المتطلبات 📋

- Node.js 18+
- PostgreSQL 12+
- Redis (اختياري)
- Docker & Docker Compose (اختياري)

## البدء السريع 🚀

### الخيار الأول: التشغيل المحلي

```bash
# 1. استنساخ المستودع
git clone https://github.com/mizanaierp-spec/Mizan-AI.git
cd Mizan-AI

# 2. نسخ ملف الإعدادات
cp .env.example .env

# 3. تثبيت الحزم
npm install
cd frontend && npm install && cd ..

# 4. تشغيل قاعدة البيانات (اختياري إذا كان لديك PostgreSQL مثبتًا محليًا)
docker-compose -f docker-compose.dev.yml up -d

# 5. تشغيل الهجرات وبيانات البذر
npm run db:migrate
npm run db:seed

# 6. تشغيل الخادم في terminal جديد
npm run dev

# 7. تشغيل الواجهة الأمامية
cd frontend
npm run dev
```

### الخيار الثاني: استخدام Docker

```bash
# 1. بناء وتشغيل جميع الخدمات
docker-compose up -d

# 2. تشغيل الهجرات
docker-compose exec backend npm run db:migrate

# 3. تشغيل البيانات الأولية
docker-compose exec backend npm run db:seed
```

## الوصول إلى التطبيق 🌐

- **الواجهة الأمامية**: http://localhost:3000
- **الخادم الرئيسي**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## بيانات الدخول الافتراضية 🔐

```
البريد الإلكتروني: admin@mizan.local
كلمة المرور: admin123
```

## هيكل المشروع 📁

```
Mizan-AI/
├── backend/                    # الخادم الرئيسي (Node.js + Express)
│   ├── api/                    # مسارات الـ API
│   │   ├── auth/               # المصادقة
│   │   ├── accounting/         # المحاسبة
│   │   ├── payroll/            # الرواتب
│   │   ├── inventory/          # المخزون
│   │   └── ...
│   ├── config/                 # إعدادات قاعدة البيانات
│   ├── middleware/             # البرمجيات الوسيطة
│   └── server.js               # نقطة الدخول
├── frontend/                   # الواجهة الأمامية (React + Vite)
│   ├── src/
│   │   ├── pages/              # الصفحات
│   │   ├── components/         # المكونات
│   │   ├── services/           # خدمات الـ API
│   │   ├── context/            # React Context
│   │   └── App.jsx             # التطبيق الرئيسي
│   └── vite.config.js          # إعدادات Vite
├── db/                         # قاعدة البيانات
│   ├── schema.sql              # الجداول والفهارس
│   ├── migrate.js              # الهجرات
│   ├── seed.js                 # البيانات الأولية
│   └── reset.js                # إعادة تعيين قاعدة البيانات
├── .env.example                # نموذج الإعدادات
├── docker-compose.yml          # Docker Compose للتطوير
└── package.json                # حزم المشروع
```

## الأوامر المتاحة ⚙️

```bash
# Backend
npm run dev              # التشغيل بوضع التطوير
npm start               # التشغيل في بيئة الإنتاج
db:migrate              # تشغيل الهجرات
db:seed                 # إدراج البيانات الأولية
db:reset                # إعادة تعيين قاعدة البيانات
lint                    # فحص الأخطاء
test                    # تشغيل الاختبارات

# Frontend
cd frontend
npm run dev             # التشغيل بوضع التطوير
npm run build           # بناء للإنتاج
npm run preview         # معاينة بناء الإنتاج
```

## المسارات المتاحة 🔗

### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - بيانات المستخدم الحالي

### المحاسبة
- `GET /api/chart-of-accounts` - قائمة الحسابات
- `POST /api/chart-of-accounts` - إضافة حساب
- `GET /api/journal-entries` - القيود اليومية
- `POST /api/journal-entries` - إنشاء قيد
- `GET /api/reports/trial-balance` - ميزان المراجعة

### الموارد البشرية
- `GET /api/payroll` - الرواتب
- `POST /api/payroll` - إضافة راتب

### البنك والخزينة
- `GET /api/bank/accounts` - الحسابات البنكية
- `POST /api/bank/accounts` - إضافة حساب بنكي

### والمزيد...

## المساهمة 🤝

نرحب بالمساهمات! يرجى:
1. Fork المستودع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الترخيص 📄

هذا المشروع مرخص تحت MIT License - انظر ملف LICENSE للتفاصيل.

## الدعم 💬

للمساعدة والدعم، يرجى فتح Issue في المستودع.

## الحالة الحالية 📊

- ✅ المرحلة الأولى: النواة الأساسية
- ✅ المرحلة الثانية: صفحات الواجهة
- ✅ المرحلة الثالثة: وحدات الدفع والموارد البشرية
- ✅ المرحلة الرابعة: المصادقة والـ API
- ✅ المرحلة الخامسة: التكامل والتشغيل
- 🔄 المرحلة السادسة: الاختبارات والنشر

---

**صُنع بـ ❤️ لتحسين إدارة الحسابات في الشركات العربية**
