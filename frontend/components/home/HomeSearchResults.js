import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function HomeSearchResults({
  results,
  lang,
  settings,
  getArabicFontStack,
  getResultLabel,
}) {
  if (!results.length) return null;

  return (
    <div className="max-w-4xl mx-auto mb-8 space-y-3">
      {results.map((result) => (
        <Card
          key={result.number}
          className={`cursor-pointer p-4 transition flex flex-col justify-between ${
            settings.decorativeCards
              ? "bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md"
              : "bg-white/80 hover:bg-gray-50"
          }`}
        >
          <Link href={`/surah/${result.number}`}>
            <p
              className={
                lang === "arb"
                  ? "text-right mb-1 text-slate-900 dark:text-slate-900"
                  : "text-left mb-1 text-slate-900 dark:text-slate-900"
              }
              style={
                lang === "arb"
                  ? {
                      fontFamily: getArabicFontStack(settings.arabicFont),
                      fontSize: `${settings.arabicSize}px`,
                    }
                  : { fontSize: `${settings.translationSize}px` }
              }
            >
              {getResultLabel(result)}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-700">Surah {result.number}</p>
          </Link>
        </Card>
      ))}
    </div>
  );
}
