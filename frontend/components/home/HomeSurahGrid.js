import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function HomeSurahGrid({
  surahs,
  settings,
  lang,
  getArabicFontStack,
}) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {surahs.map((surah) => (
          <li key={surah.number}>
            <Card
              className={`group relative overflow-hidden border border-slate-200 p-5 transition duration-200 min-h-47 ${
                settings.decorativeCards
                  ? "bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg"
                  : "bg-white/90 hover:bg-slate-50"
              }`}
            >
              {settings.decorativeCards && (
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/70 blur-xl" />
              )}

              <Link href={`/surah/${surah.number}`}>
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Surah {surah.number}
                      </span>
                      <span className="text-xs text-slate-500">#{surah.number}</span>
                    </div>

                    <p
                      className="mb-2 text-right leading-relaxed text-slate-900 dark:text-slate-900"
                      style={{
                        fontFamily: getArabicFontStack(settings.arabicFont),
                        fontSize: `${settings.arabicSize}px`,
                      }}
                    >
                      {surah.nameArabic || "(Arabic not available)"}
                    </p>

                    {lang === "eng" && (
                      <p
                        className="text-left font-medium text-slate-700 dark:text-slate-800"
                        style={{ fontSize: `${settings.translationSize}px` }}
                      >
                        {surah.nameEnglish}
                      </p>
                    )}
                    {lang === "ban" && (
                      <p
                        className="text-left font-medium text-slate-700 dark:text-slate-800"
                        style={{ fontSize: `${settings.translationSize}px` }}
                      >
                        {surah.nameBangla || "(Bangla not available)"}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end text-sm font-medium text-emerald-700 transition group-hover:text-emerald-800">
                    Open Surah
                  </div>
                </div>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
