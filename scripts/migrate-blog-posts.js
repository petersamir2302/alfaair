const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vegnmkhjmuxinqgeaqkk.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZ25ta2hqbXV4aW5xZ2VhcWtrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njc3MTE0MywiZXhwIjoyMDgyMzQ3MTQzfQ.sumMJyyegtG-Jr7zUiVEIHu98yR4vnG5Vmtg9fJpK44';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Import blog posts from lib/blog.ts
// Since we can't directly import TypeScript, we'll define them here
const blogPosts = [
  {
    slug: 'best-ac-units-egypt-2024',
    title_ar: 'أفضل وحدات التكييف في مصر لعام 2024',
    title_en: 'Best AC Units in Egypt for 2024',
    excerpt_ar: 'دليل شامل لأفضل وحدات التكييف المناسبة للمناخ المصري، مع نصائح للاختيار الصحيح.',
    excerpt_en: 'Complete guide to the best air conditioning units suitable for Egyptian climate, with tips for making the right choice.',
    author: 'AlfaAir Team',
    publishedAt: '2024-01-15',
    category: 'buying-guide',
    content_ar: `
# أفضل وحدات التكييف في مصر لعام 2024

مع ارتفاع درجات الحرارة في مصر، أصبح التكييف ضرورة لا غنى عنها. في هذا المقال، سنستعرض أفضل وحدات التكييف المناسبة للمناخ المصري.

## العوامل المهمة عند اختيار التكييف في مصر

### 1. القدرة (الحصان)
- **للشقق الصغيرة (حتى 60 متر مربع)**: 1.5 حصان
- **للشقق المتوسطة (60-90 متر مربع)**: 2 حصان
- **للشقق الكبيرة (90-120 متر مربع)**: 2.5-3 حصان
- **للشقق الكبيرة جداً (أكثر من 120 متر مربع)**: 3.5 حصان أو أكثر

### 2. تقنية الانفرتر
التكييفات ذات تقنية الانفرتر توفر:
- توفير في استهلاك الكهرباء بنسبة تصل إلى 40%
- تشغيل أكثر هدوءاً
- تحكم أفضل في درجة الحرارة

### 3. التكييف الذكي
التكييفات الذكية تتيح لك:
- التحكم عن بعد عبر الهاتف
- جدولة التشغيل والإيقاف
- مراقبة استهلاك الطاقة

## أفضل العلامات التجارية في مصر

### 1. Beko
- موثوقة ومتينة
- أسعار معقولة
- ضمان ممتاز

### 2. Carrier
- كفاءة عالية في التبريد
- تكنولوجيا متقدمة
- مناسبة للمناخ الحار

### 3. Gree
- توفير ممتاز في الطاقة
- أداء قوي
- أسعار تنافسية

## نصائح للاختيار الصحيح

1. **قياس المساحة بدقة**: تأكد من قياس المساحة المراد تبريدها بدقة
2. **النوافذ والتهوية**: الأماكن ذات النوافذ الكبيرة تحتاج قدرة أكبر
3. **الطابق**: الطوابق العليا تحتاج قدرة أكبر بسبب التعرض للشمس
4. **الضمان**: اختر وحدات بضمان لا يقل عن 5 سنوات

## الخلاصة

اختيار التكييف المناسب يعتمد على عدة عوامل. استشر خبراء AlfaAir للحصول على أفضل نصيحة تناسب احتياجاتك وميزانيتك.
    `,
    content_en: `
# Best AC Units in Egypt for 2024

With rising temperatures in Egypt, air conditioning has become an essential necessity. In this article, we'll explore the best AC units suitable for the Egyptian climate.

## Important Factors When Choosing AC in Egypt

### 1. Capacity (Horsepower)
- **Small apartments (up to 60 sqm)**: 1.5 HP
- **Medium apartments (60-90 sqm)**: 2 HP
- **Large apartments (90-120 sqm)**: 2.5-3 HP
- **Very large apartments (over 120 sqm)**: 3.5 HP or more

### 2. Inverter Technology
Inverter AC units provide:
- Up to 40% energy savings
- Quieter operation
- Better temperature control

### 3. Smart AC
Smart AC units allow you to:
- Remote control via smartphone
- Schedule on/off times
- Monitor energy consumption

## Best Brands in Egypt

### 1. Beko
- Reliable and durable
- Reasonable prices
- Excellent warranty

### 2. Carrier
- High cooling efficiency
- Advanced technology
- Suitable for hot climate

### 3. Gree
- Excellent energy savings
- Strong performance
- Competitive prices

## Tips for Making the Right Choice

1. **Measure accurately**: Make sure to accurately measure the area to be cooled
2. **Windows and ventilation**: Areas with large windows need more capacity
3. **Floor level**: Upper floors need more capacity due to sun exposure
4. **Warranty**: Choose units with at least 5 years warranty

## Conclusion

Choosing the right AC depends on several factors. Consult AlfaAir experts for the best advice that suits your needs and budget.
    `
  },
  {
    slug: 'ac-maintenance-tips-egypt',
    title_ar: 'نصائح صيانة التكييف في مصر',
    title_en: 'AC Maintenance Tips for Egypt',
    excerpt_ar: 'دليل شامل لصيانة التكييف في المناخ المصري الحار، مع نصائح عملية لتوفير الطاقة وإطالة العمر الافتراضي.',
    excerpt_en: 'Complete guide to AC maintenance in Egypt\'s hot climate, with practical tips for energy savings and extending lifespan.',
    author: 'AlfaAir Team',
    publishedAt: '2024-01-20',
    category: 'maintenance',
    content_ar: `
# نصائح صيانة التكييف في مصر

صيانة التكييف بشكل منتظم ضرورية في المناخ المصري الحار. إليك دليل شامل لصيانة التكييف بشكل صحيح.

## الصيانة الدورية

### كل أسبوعين
- تنظيف الفلتر: إزالة الغبار والأوساخ من الفلتر
- فحص الوحدة الخارجية: التأكد من عدم وجود عوائق

### كل شهر
- تنظيف الملفات: تنظيف ملفات التبريد من الأتربة
- فحص مستوى الفريون: التأكد من عدم وجود تسريب

### كل 3 أشهر
- صيانة شاملة: استدعاء فني متخصص
- تنظيف شامل للوحدة الداخلية والخارجية
- فحص جميع المكونات الكهربائية

## علامات تحتاج إلى صيانة فورية

1. **ضعف التبريد**: إذا لاحظت أن التكييف لا يبرد بشكل كافٍ
2. **ضوضاء غير عادية**: أي صوت غريب من الوحدة
3. **تسريب الماء**: وجود ماء يتسرب من الوحدة الداخلية
4. **رائحة كريهة**: رائحة عفن أو رطوبة
5. **استهلاك كهرباء عالي**: فاتورة كهرباء أعلى من المعتاد

## نصائح لتوفير الطاقة

### 1. درجة الحرارة المثالية
- ضع التكييف على 24-26 درجة مئوية
- كل درجة أقل تزيد الاستهلاك بنسبة 6%

### 2. استخدام المروحة
- استخدام المروحة مع التكييف يوزع الهواء البارد بشكل أفضل
- يسمح برفع درجة الحرارة درجة أو درجتين

### 3. إغلاق النوافذ والأبواب
- تأكد من إغلاق جميع النوافذ والأبواب
- استخدم ستائر عازلة للشمس

### 4. الصيانة المنتظمة
- التكييف النظيف يعمل بكفاءة أعلى
- يوفر ما يصل إلى 30% من استهلاك الطاقة

## تنظيف الفلتر بنفسك

### الخطوات:
1. أطفئ التكييف وفصله عن الكهرباء
2. افتح الوحدة الداخلية
3. أزل الفلتر برفق
4. اغسله بماء فاتر وصابون خفيف
5. اتركه يجف تماماً قبل إعادته
6. أعد الفلتر واغلق الوحدة

## متى تحتاج فني متخصص؟

- تنظيف شامل للوحدة الداخلية والخارجية
- إعادة شحن الفريون
- إصلاح الأعطال الكهربائية
- فحص وصيانة الضاغط

## الخلاصة

الصيانة المنتظمة للتكييف ليست فقط لتوفير الطاقة، بل أيضاً لإطالة العمر الافتراضي للجهاز وضمان جودة الهواء في منزلك.
    `,
    content_en: `
# AC Maintenance Tips for Egypt

Regular AC maintenance is essential in Egypt's hot climate. Here's a comprehensive guide to proper AC maintenance.

## Regular Maintenance Schedule

### Every Two Weeks
- Clean the filter: Remove dust and dirt from the filter
- Check outdoor unit: Ensure there are no obstructions

### Every Month
- Clean coils: Clean cooling coils from dust
- Check refrigerant level: Ensure there are no leaks

### Every 3 Months
- Comprehensive maintenance: Call a specialized technician
- Complete cleaning of indoor and outdoor units
- Check all electrical components

## Signs That Need Immediate Maintenance

1. **Weak cooling**: If you notice the AC isn't cooling adequately
2. **Unusual noise**: Any strange sounds from the unit
3. **Water leakage**: Water leaking from the indoor unit
4. **Bad odor**: Mold or moisture smell
5. **High electricity consumption**: Higher electricity bill than usual

## Energy Saving Tips

### 1. Optimal Temperature
- Set AC to 24-26°C
- Each degree lower increases consumption by 6%

### 2. Use Fan
- Using a fan with AC distributes cool air better
- Allows raising temperature by 1-2 degrees

### 3. Close Windows and Doors
- Ensure all windows and doors are closed
- Use sun-blocking curtains

### 4. Regular Maintenance
- Clean AC works more efficiently
- Saves up to 30% energy consumption

## Cleaning the Filter Yourself

### Steps:
1. Turn off AC and disconnect from power
2. Open indoor unit
3. Remove filter gently
4. Wash with lukewarm water and mild soap
5. Let it dry completely before reinstalling
6. Reinstall filter and close unit

## When Do You Need a Specialist?

- Complete cleaning of indoor and outdoor units
- Refrigerant recharge
- Electrical repairs
- Compressor inspection and maintenance

## Conclusion

Regular AC maintenance is not only for energy savings, but also to extend the device's lifespan and ensure air quality in your home.
    `
  },
  {
    slug: 'energy-saving-tips-ac',
    title_ar: 'نصائح لتوفير استهلاك الكهرباء في التكييف',
    title_en: 'Energy Saving Tips for AC',
    excerpt_ar: 'طرق عملية لتقليل فاتورة الكهرباء مع الحفاظ على الراحة في المناخ المصري الحار.',
    excerpt_en: 'Practical ways to reduce electricity bills while maintaining comfort in Egypt\'s hot climate.',
    author: 'AlfaAir Team',
    publishedAt: '2024-01-25',
    category: 'energy-saving',
    content_ar: `
# نصائح لتوفير استهلاك الكهرباء في التكييف

في مصر، يمثل التكييف جزءاً كبيراً من فاتورة الكهرباء. إليك نصائح عملية لتوفير الطاقة وتقليل التكاليف.

## 1. اختيار التكييف المناسب

### تقنية الانفرتر
- توفر ما يصل إلى 40% من استهلاك الطاقة
- تعمل بشكل مستمر بسرعة منخفضة بدلاً من التشغيل والإيقاف
- أكثر هدوءاً وأطول عمراً

### تصنيف الطاقة
- اختر وحدات بفئة A++ أو A+++
- قد تكون أغلى قليلاً لكنها توفر على المدى الطويل

## 2. الاستخدام الصحيح

### درجة الحرارة المثالية
- **24-26 درجة مئوية**: المثالية للراحة والتوفير
- كل درجة أقل تزيد الاستهلاك بنسبة 6%
- الفرق بين 22 و 26 درجة يمكن أن يضاعف الفاتورة

### وضع التشغيل
- استخدم وضع "Auto" للتحكم التلقائي
- وضع "Cool" فقط عند الحاجة الشديدة
- تجنب وضع "Fan" المستمر

## 3. عزل المنزل

### النوافذ
- استخدم ستائر عازلة للشمس
- أغلق النوافذ أثناء النهار
- استخدم زجاج مزدوج إذا أمكن

### الأبواب
- تأكد من إغلاق الأبواب بإحكام
- استخدم عوازل للأبواب إذا لزم الأمر

### العزل الحراري
- عزل السقف يقلل الحاجة للتبريد بنسبة 30%
- عزل الجدران يوفر طاقة كبيرة

## 4. الصيانة المنتظمة

### تنظيف الفلتر
- تنظيف الفلتر كل أسبوعين يوفر 5-15% من الطاقة
- الفلتر المتسخ يجبر التكييف على العمل بجهد أكبر

### تنظيف الملفات
- الملفات النظيفة تعمل بكفاءة أعلى
- تنظيف سنوي محترف يضمن الأداء الأمثل

## 5. استخدام المروحة مع التكييف

- المروحة توزع الهواء البارد بشكل أفضل
- تسمح برفع درجة الحرارة درجة أو درجتين
- توفر ما يصل إلى 20% من الطاقة

## 6. جدولة التشغيل

### استخدام التايمر
- شغل التكييف قبل وصولك بـ 30 دقيقة
- أوقفه قبل مغادرتك بـ 30 دقيقة
- استخدم التكييف الذكي للجدولة التلقائية

### إغلاق عند عدم الحاجة
- أغلق التكييف عند مغادرة الغرفة
- لا تتركه يعمل في غرف غير مستخدمة

## 7. اختيار الوقت المناسب

### ساعات الذروة
- تجنب استخدام التكييف في ساعات الذروة (6-10 مساءً)
- الكهرباء أغلى في هذه الأوقات

### الليل
- استخدم المروحة في الليل إذا أمكن
- افتح النوافذ للتهوية الطبيعية

## 8. نصائح إضافية

### الأجهزة الإلكترونية
- الأجهزة الإلكترونية تنتج حرارة
- أغلق الأجهزة غير المستخدمة

### الإضاءة
- استخدم إضاءة LED بدلاً من المصابيح المتوهجة
- المصابيح المتوهجة تنتج حرارة كبيرة

### النباتات
- النباتات داخل المنزل تساعد في تنقية الهواء
- بعض النباتات تساعد في خفض درجة الحرارة

## حساب التوفير المتوقع

### مثال عملي:
- **قبل**: تكييف عادي، درجة 22، بدون صيانة = 500 كيلووات/شهر
- **بعد**: تكييف انفرتر، درجة 25، صيانة منتظمة = 300 كيلووات/شهر
- **التوفير**: 200 كيلووات × 1.5 جنيه = 300 جنيه/شهر

## الخلاصة

توفير الطاقة في التكييف ليس صعباً. اتباع هذه النصائح يمكن أن يقلل فاتورة الكهرباء بنسبة تصل إلى 50% مع الحفاظ على الراحة.
    `,
    content_en: `
# Energy Saving Tips for AC

In Egypt, AC represents a large portion of electricity bills. Here are practical tips to save energy and reduce costs.

## 1. Choosing the Right AC

### Inverter Technology
- Saves up to 40% energy consumption
- Operates continuously at low speed instead of on/off
- Quieter and longer-lasting

### Energy Rating
- Choose units with A++ or A+++ rating
- May be slightly more expensive but save long-term

## 2. Proper Usage

### Optimal Temperature
- **24-26°C**: Ideal for comfort and savings
- Each degree lower increases consumption by 6%
- Difference between 22 and 26 degrees can double the bill

### Operation Mode
- Use "Auto" mode for automatic control
- Use "Cool" mode only when extremely needed
- Avoid continuous "Fan" mode

## 3. Home Insulation

### Windows
- Use sun-blocking curtains
- Close windows during the day
- Use double glazing if possible

### Doors
- Ensure doors are tightly closed
- Use door seals if necessary

### Thermal Insulation
- Roof insulation reduces cooling needs by 30%
- Wall insulation saves significant energy

## 4. Regular Maintenance

### Filter Cleaning
- Cleaning filter every two weeks saves 5-15% energy
- Dirty filter forces AC to work harder

### Coil Cleaning
- Clean coils work more efficiently
- Annual professional cleaning ensures optimal performance

## 5. Using Fan with AC

- Fan distributes cool air better
- Allows raising temperature by 1-2 degrees
- Saves up to 20% energy

## 6. Scheduling Operation

### Using Timer
- Turn on AC 30 minutes before arrival
- Turn off 30 minutes before leaving
- Use smart AC for automatic scheduling

### Turn Off When Not Needed
- Turn off AC when leaving room
- Don't leave it running in unused rooms

## 7. Choosing the Right Time

### Peak Hours
- Avoid using AC during peak hours (6-10 PM)
- Electricity is more expensive at these times

### Night
- Use fan at night if possible
- Open windows for natural ventilation

## 8. Additional Tips

### Electronic Devices
- Electronic devices produce heat
- Turn off unused devices

### Lighting
- Use LED lighting instead of incandescent bulbs
- Incandescent bulbs produce significant heat

### Plants
- Indoor plants help purify air
- Some plants help lower temperature

## Expected Savings Calculation

### Practical Example:
- **Before**: Regular AC, 22°C, no maintenance = 500 kWh/month
- **After**: Inverter AC, 25°C, regular maintenance = 300 kWh/month
- **Savings**: 200 kWh × 1.5 EGP = 300 EGP/month

## Conclusion

Saving energy on AC isn't difficult. Following these tips can reduce electricity bills by up to 50% while maintaining comfort.
    `
  },
  {
    slug: 'choosing-right-ac-size',
    title_ar: 'كيف تختار حجم التكييف المناسب لمنزلك',
    title_en: 'How to Choose the Right AC Size for Your Home',
    excerpt_ar: 'دليل شامل لحساب القدرة المطلوبة للتكييف بناءً على مساحة الغرفة والعوامل الأخرى.',
    excerpt_en: 'Complete guide to calculating the required AC capacity based on room area and other factors.',
    author: 'AlfaAir Team',
    publishedAt: '2024-02-01',
    category: 'buying-guide',
    content_ar: `
# كيف تختار حجم التكييف المناسب لمنزلك

اختيار حجم التكييف الصحيح ضروري للراحة والتوفير. التكييف الصغير لن يبرد بشكل كافٍ، والكبير جداً يهدر الطاقة.

## حساب القدرة المطلوبة

### القاعدة الأساسية
لكل متر مربع تحتاج إلى **600-800 وحدة حرارية بريطانية (BTU)**

### مثال:
- غرفة 20 متر مربع = 20 × 600 = 12,000 BTU = 1 حصان
- غرفة 30 متر مربع = 30 × 700 = 21,000 BTU = 1.5 حصان
- غرفة 40 متر مربع = 40 × 700 = 28,000 BTU = 2 حصان

## العوامل المؤثرة

### 1. المساحة
- **صغيرة (حتى 20 متر مربع)**: 1 حصان
- **متوسطة (20-30 متر مربع)**: 1.5 حصان
- **كبيرة (30-45 متر مربع)**: 2 حصان
- **كبيرة جداً (45-60 متر مربع)**: 2.5 حصان

### 2. عدد الأشخاص
- أضف 600 BTU لكل شخص إضافي
- 2 أشخاص = +1,200 BTU
- 4 أشخاص = +2,400 BTU

### 3. التعرض للشمس
- **شمالي (لا شمس مباشرة)**: لا تغيير
- **جنوبي أو شرقي (شمس صباحية)**: أضف 10%
- **غربي (شمس مسائية)**: أضف 20%

### 4. الطابق
- **أرضي أو أول**: لا تغيير
- **ثاني أو ثالث**: أضف 5%
- **رابع أو أعلى**: أضف 10%

### 5. النوافذ
- **نوافذ عادية**: لا تغيير
- **نوافذ كبيرة أو زجاج**: أضف 10%
- **نوافذ بدون عزل**: أضف 15%

### 6. المطبخ
- المطبخ يحتاج قدرة أكبر بنسبة 20%
- بسبب الحرارة الناتجة عن الطهي

## جدول سريع

| المساحة (م²) | الأشخاص | القدرة الموصى بها |
|--------------|---------|-------------------|
| 15-20 | 1-2 | 1 حصان (9,000 BTU) |
| 20-30 | 2-3 | 1.5 حصان (12,000 BTU) |
| 30-45 | 3-4 | 2 حصان (18,000 BTU) |
| 45-60 | 4-5 | 2.5 حصان (24,000 BTU) |
| 60-80 | 5-6 | 3 حصان (30,000 BTU) |
| 80-100 | 6-8 | 3.5 حصان (36,000 BTU) |

## حساب دقيق

### مثال عملي:
**غرفة معيشة:**
- المساحة: 35 متر مربع
- الأشخاص: 4 أشخاص
- التعرض: غربي (شمس مسائية)
- الطابق: ثالث
- النوافذ: كبيرة

**الحساب:**
1. الأساسي: 35 × 700 = 24,500 BTU
2. الأشخاص: 4 × 600 = +2,400 BTU
3. التعرض الغربي: +20% = +4,900 BTU
4. الطابق الثالث: +5% = +1,225 BTU
5. النوافذ الكبيرة: +10% = +2,450 BTU

**الإجمالي**: 35,475 BTU ≈ 3 حصان

## نصائح مهمة

### 1. لا تبالغ
- التكييف الكبير جداً يعمل بشكل متقطع
- لا يزيل الرطوبة بشكل كافٍ
- يهدر الطاقة والمال

### 2. لا تقلل
- التكييف الصغير يعمل باستمرار
- لا يبرد بشكل كافٍ
- يستهلك طاقة أكثر من المطلوب

### 3. استشر خبير
- الحسابات المعقدة تحتاج خبير
- AlfaAir يقدم استشارة مجانية
- نضمن اختيار الحجم المناسب

## أنواع التكييف حسب الحجم

### Split AC (سبليت)
- مناسب للغرف الفردية
- سهل التركيب
- كفاءة عالية

### Multi-Split AC
- مناسب لعدة غرف
- وحدة خارجية واحدة
- توفير في المساحة

### Central AC
- مناسب للمنازل الكبيرة
- تبريد موحد
- يحتاج تخطيط مسبق

## الخلاصة

اختيار حجم التكييف الصحيح يوفر الطاقة والمال ويضمن الراحة. استخدم هذا الدليل أو استشر خبراء AlfaAir للحصول على أفضل نصيحة.
    `,
    content_en: `
# How to Choose the Right AC Size for Your Home

Choosing the right AC size is essential for comfort and savings. Too small won't cool adequately, too large wastes energy.

## Calculating Required Capacity

### Basic Rule
For each square meter you need **600-800 British Thermal Units (BTU)**

### Example:
- 20 sqm room = 20 × 600 = 12,000 BTU = 1 HP
- 30 sqm room = 30 × 700 = 21,000 BTU = 1.5 HP
- 40 sqm room = 40 × 700 = 28,000 BTU = 2 HP

## Influencing Factors

### 1. Area
- **Small (up to 20 sqm)**: 1 HP
- **Medium (20-30 sqm)**: 1.5 HP
- **Large (30-45 sqm)**: 2 HP
- **Very large (45-60 sqm)**: 2.5 HP

### 2. Number of People
- Add 600 BTU per additional person
- 2 people = +1,200 BTU
- 4 people = +2,400 BTU

### 3. Sun Exposure
- **North (no direct sun)**: No change
- **South or East (morning sun)**: Add 10%
- **West (evening sun)**: Add 20%

### 4. Floor Level
- **Ground or first**: No change
- **Second or third**: Add 5%
- **Fourth or higher**: Add 10%

### 5. Windows
- **Normal windows**: No change
- **Large windows or glass**: Add 10%
- **Uninsulated windows**: Add 15%

### 6. Kitchen
- Kitchen needs 20% more capacity
- Due to heat from cooking

## Quick Reference Table

| Area (sqm) | People | Recommended Capacity |
|------------|--------|---------------------|
| 15-20 | 1-2 | 1 HP (9,000 BTU) |
| 20-30 | 2-3 | 1.5 HP (12,000 BTU) |
| 30-45 | 3-4 | 2 HP (18,000 BTU) |
| 45-60 | 4-5 | 2.5 HP (24,000 BTU) |
| 60-80 | 5-6 | 3 HP (30,000 BTU) |
| 80-100 | 6-8 | 3.5 HP (36,000 BTU) |

## Detailed Calculation

### Practical Example:
**Living Room:**
- Area: 35 sqm
- People: 4
- Exposure: West (evening sun)
- Floor: Third
- Windows: Large

**Calculation:**
1. Base: 35 × 700 = 24,500 BTU
2. People: 4 × 600 = +2,400 BTU
3. West exposure: +20% = +4,900 BTU
4. Third floor: +5% = +1,225 BTU
5. Large windows: +10% = +2,450 BTU

**Total**: 35,475 BTU ≈ 3 HP

## Important Tips

### 1. Don't Oversize
- Oversized AC runs intermittently
- Doesn't remove humidity adequately
- Wastes energy and money

### 2. Don't Undersize
- Undersized AC runs continuously
- Doesn't cool adequately
- Consumes more energy than needed

### 3. Consult an Expert
- Complex calculations need an expert
- AlfaAir offers free consultation
- We guarantee the right size selection

## AC Types by Size

### Split AC
- Suitable for individual rooms
- Easy installation
- High efficiency

### Multi-Split AC
- Suitable for multiple rooms
- One outdoor unit
- Space saving

### Central AC
- Suitable for large homes
- Uniform cooling
- Requires prior planning

## Conclusion

Choosing the right AC size saves energy and money and ensures comfort. Use this guide or consult AlfaAir experts for the best advice.
    `
  }
];

async function migratePosts() {
  console.log('🚀 Starting blog posts migration...\n');

  // Check existing posts
  const { data: existingPosts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('slug');

  if (fetchError) {
    console.error('❌ Error fetching existing posts:', fetchError);
    return;
  }

  const existingSlugs = new Set(existingPosts?.map(p => p.slug) || []);
  console.log(`📊 Found ${existingSlugs.size} existing posts in database\n`);

  // Prepare posts for insertion
  const postsToInsert = blogPosts
    .filter(post => !existingSlugs.has(post.slug))
    .map(post => ({
      slug: post.slug,
      title_ar: post.title_ar.trim(),
      title_en: post.title_en.trim(),
      excerpt_ar: post.excerpt_ar.trim(),
      excerpt_en: post.excerpt_en.trim(),
      content_ar: post.content_ar.trim(),
      content_en: post.content_en.trim(),
      author: post.author,
      published_at: post.publishedAt,
      image_url: post.image || null,
      category: post.category
    }));

  if (postsToInsert.length === 0) {
    console.log('✅ All posts already exist in database. No migration needed.');
    return;
  }

  console.log(`📝 Preparing to insert ${postsToInsert.length} posts:\n`);
  postsToInsert.forEach(post => {
    console.log(`  - ${post.slug} (${post.title_en})`);
  });
  console.log('');

  // Insert posts
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(postsToInsert)
    .select();

  if (error) {
    console.error('❌ Error inserting posts:', error);
    return;
  }

  console.log(`✅ Successfully migrated ${data.length} posts to database!\n`);
  console.log('📋 Migrated posts:');
  data.forEach(post => {
    console.log(`  - ${post.slug} (ID: ${post.id})`);
  });
}

migratePosts()
  .then(() => {
    console.log('\n✨ Migration completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });

