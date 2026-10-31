import { homeFaq } from '@/lib/seo';

// Server-rendered FAQ: plain HTML text that search engines and AI crawlers
// (which usually don't run JavaScript) can read and quote directly.
export function FaqSection() {
  return (
    <section id="faq" className="mb-8 md:mb-16 py-6 md:py-12" dir="rtl" lang="ar">
      <div className="text-center mb-6 md:mb-10">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">أسئلة شائعة عن شراء التكييفات</h2>
        <p className="text-gray-400">إجابات سريعة من فريق AlfaAir</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {homeFaq.map(({ q, a }) => (
          <details key={q} className="group bg-slate-800 rounded-lg p-4 md:p-5">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-bold text-white">
              <h3 className="text-base md:text-lg">{q}</h3>
              <span className="text-gray-400 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <p className="mt-3 text-gray-300 leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
