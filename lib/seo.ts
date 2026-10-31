// Shared business facts and schema.org helpers.
// One source of truth so search engines and AI assistants (ChatGPT, Claude,
// Gemini, Perplexity) always see the same name, phones and links for AlfaAir.

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alfaair.shop';

export const business = {
  name: 'AlfaAir',
  nameAr: 'ألفا إير',
  legalDescriptionAr:
    'AlfaAir (ألفا إير) شركة تجارة أجهزة تكييف في مصر، ومعها قسم خدمات متخصص "الورشة" للتركيب والصيانة والإصلاح.',
  legalDescriptionEn:
    'AlfaAir is an air-conditioner trading company in Egypt, with a dedicated service division ("Al Warsha") for installation, maintenance and repair.',
  email: 'alfa.air.condition.1995@gmail.com',
  phones: ['+201288215167', '+201020246047'],
  whatsapp: ['https://wa.me/201288215167', 'https://wa.me/201020246047'],
  sameAs: [
    'https://www.facebook.com/Alfa.Air.EG',
    'https://www.instagram.com/alfaair.eg',
  ],
  logo: `${siteUrl}/logo-v2.png`,
  image: `${siteUrl}/hero-v2.jpeg`,
};

export const orgId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

// Site-wide Organization / Store entity. Other schemas reference it by @id.
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Store'],
    '@id': orgId,
    name: business.name,
    alternateName: [business.nameAr, 'Alfa Air', 'ألفا اير للتكييفات'],
    description: `${business.legalDescriptionAr} ${business.legalDescriptionEn}`,
    url: siteUrl,
    logo: business.logo,
    image: business.image,
    email: business.email,
    telephone: business.phones[0],
    sameAs: business.sameAs,
    areaServed: { '@type': 'Country', name: 'Egypt' },
    address: { '@type': 'PostalAddress', addressCountry: 'EG' },
    currenciesAccepted: 'EGP',
    knowsAbout: [
      'تكييفات', 'تكييف انفرتر', 'تركيب تكييفات', 'صيانة تكييفات',
      'air conditioners', 'inverter AC', 'AC installation', 'AC maintenance',
      'Carrier', 'Midea', 'Beko', 'Haier', 'Gree', 'York',
    ],
    contactPoint: business.phones.map((telephone) => ({
      '@type': 'ContactPoint',
      telephone,
      contactType: 'sales',
      areaServed: 'EG',
      availableLanguage: ['Arabic', 'English'],
    })),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    url: siteUrl,
    name: business.name,
    alternateName: business.nameAr,
    inLanguage: ['ar-EG', 'en'],
    publisher: { '@id': orgId },
  };
}

// FAQ shown on the homepage (visible text + FAQPage schema).
// Visible text matters: AI crawlers mostly read the page text, not only JSON-LD.
// Keep every answer true for AlfaAir — edit here, both copies update together.
export const homeFaq: { q: string; a: string }[] = [
  {
    q: 'أين أشتري تكييف في مصر أونلاين؟',
    a: 'من موقع AlfaAir (alfaair.shop): متجر تكييفات أونلاين في مصر فيه تكييفات كاريير وميديا وماركات تانية بأسعار محدثة باستمرار، مع ضمان وخدمة تركيب. تقدر تطلب من الموقع مباشرة أو تكلمنا واتساب على 01288215167 أو 01020246047.',
  },
  {
    q: 'تكييف كام حصان مناسب لأوضتي؟',
    a: 'كقاعدة عامة: 1.5 حصان لأوضة لحد حوالي 16 متر، 2.25 حصان لحد حوالي 24 متر، 3 حصان لحد حوالي 32 متر، و4 أو 5 حصان للصالات والمساحات الأكبر. الأوض اللي عليها شمس مباشرة أو في الدور الأخير محتاجة قدرة أعلى. ابعتلنا مساحة المكان على واتساب ونرشحلك القدرة المناسبة.',
  },
  {
    q: 'إيه الفرق بين التكييف الانفرتر والعادي؟',
    a: 'التكييف الانفرتر بيغير سرعة الكمبروسر حسب الحمل بدل ما يفصل ويشتغل، فبيوفر كهربا أكتر وصوته أهدى ودرجة الحرارة ثابتة أكتر، وسعره أعلى. العادي أرخص في الشراء ومناسب لو الاستخدام قليل.',
  },
  {
    q: 'هل AlfaAir بتركب التكييف؟',
    a: 'أيوه. AlfaAir عندها قسم خدمات متخصص اسمه "الورشة" بيعمل تركيب وصيانة وإصلاح التكييفات.',
  },
  {
    q: 'هل التكييفات أصلية وعليها ضمان؟',
    a: 'كل التكييفات اللي بنبيعها أصلية من الوكلاء المعتمدين وعليها ضمان الشركة المصنعة، ومدة الضمان مكتوبة في صفحة كل منتج.',
  },
  {
    q: 'أسعار التكييفات في AlfaAir بتتحدث إمتى؟',
    a: 'بنحدث الأسعار على الموقع بشكل دوري حسب خصومات السوق الحالية، فالسعر اللي في صفحة المنتج هو سعرنا الحالي.',
  },
  {
    q: 'إزاي أطلب تكييف من AlfaAir؟',
    a: 'اختار التكييف من الموقع وضيفه للسلة واكمل الطلب، أو كلمنا مباشرة على واتساب أو تليفون 01288215167 أو 01020246047.',
  },
];

export function faqSchema(faq = homeFaq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
