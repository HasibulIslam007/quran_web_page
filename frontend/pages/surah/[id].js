import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Settings } from "lucide-react";

import SettingsPanel from "../../components/SettingsPanel";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Toggle } from "../../components/ui/toggle";
import { getAllSurahsStatic, getSurahByIdStatic } from "../../lib/quranStaticData";

export async function getStaticPaths() {
  const surahs = getAllSurahsStatic();

  const paths = surahs.map((s) => ({
    params: { id: s.number.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const surah = getSurahByIdStatic(params.id);

  if (!surah) {
    return { notFound: true };
  }

  return { props: { surah } };
}

export default function SurahPage({ surah }) {
  const [lang, setLang] = useState("eng");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [ayahFilter, setAyahFilter] = useState("");
  const [settings, setSettings] = useState({
    arabicFont: "Amiri",
    arabicSize: 24,
    translationSize: 18,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedArabicFont = localStorage.getItem("arabicFont");
    const savedArabicSize = localStorage.getItem("arabicSize");
    const savedTranslationSize = localStorage.getItem("translationSize");

    setSettings({
      arabicFont: savedArabicFont || "Amiri",
      arabicSize: savedArabicSize ? Number(savedArabicSize) : 24,
      translationSize: savedTranslationSize ? Number(savedTranslationSize) : 18,
    });
  }, []);

  const handleSettingsChange = useCallback((newSettings) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("arabicFont", newSettings.arabicFont);
      localStorage.setItem("arabicSize", String(newSettings.arabicSize));
      localStorage.setItem("translationSize", String(newSettings.translationSize));
    }

    setSettings((prev) => {
      if (
        prev.arabicFont === newSettings.arabicFont &&
        prev.arabicSize === newSettings.arabicSize &&
        prev.translationSize === newSettings.translationSize
      ) {
        return prev;
      }

      return newSettings;
    });
  }, []);

  const filteredAyahs = useMemo(() => {
    const needle = ayahFilter.trim().toLowerCase();
    if (!needle) return surah.ayahs;

    return surah.ayahs.filter((ayah) => {
      const aya = String(ayah.aya || "").toLowerCase();
      const ar = String(ayah.textArabic || "").toLowerCase();
      const en = String(ayah.textEnglish || "").toLowerCase();
      const bn = String(ayah.textBangla || "").toLowerCase();
      return aya.includes(needle) || ar.includes(needle) || en.includes(needle) || bn.includes(needle);
    });
  }, [ayahFilter, surah.ayahs]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/" aria-label="Back to homepage">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl" dir="rtl">
              {surah.nameArabic || `سورة ${surah.number}`}
            </h1>
            <p className="text-sm text-slate-600 md:text-base">
              {surah.nameEnglish} | {surah.nameBangla || ""}
            </p>
          </div>

          <Button
            type="button"
            variant={isSettingsOpen ? "default" : "outline"}
            size="icon"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            aria-label="Open settings"
            aria-pressed={isSettingsOpen}
            className="rounded-xl"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
        <Card className="mb-5 border border-slate-200/80 bg-slate-50/80">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Toggle
                  variant="outline"
                  pressed={lang === "eng"}
                  onPressedChange={(pressed) => {
                    if (pressed) setLang("eng");
                  }}
                  aria-label="Show English translation"
                >
                  English
                </Toggle>
                <Toggle
                  variant="outline"
                  pressed={lang === "ban"}
                  onPressedChange={(pressed) => {
                    if (pressed) setLang("ban");
                  }}
                  aria-label="Show Bangla translation"
                >
                  Bangla
                </Toggle>
              </div>

              <div className="w-full sm:w-72">
                <Input
                  value={ayahFilter}
                  onChange={(event) => setAyahFilter(event.target.value)}
                  placeholder="Filter ayahs by number or text..."
                  aria-label="Filter ayah list"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <section className="max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto pr-1">
          <div className="space-y-4">
            {filteredAyahs.map((ayah) => (
              <Card
                key={ayah.aya}
                className={`border border-slate-200 transition-all duration-200 ${
                  settings.decorativeCards
                    ? "bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg"
                    : "bg-white/90 hover:bg-slate-50"
                }`}
              >
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className="flex-1 text-right leading-relaxed text-slate-900"
                      dir="rtl"
                      style={{
                        fontFamily: settings.arabicFont,
                        fontSize: `${settings.arabicSize}px`,
                      }}
                    >
                      {ayah.textArabic || "(Arabic not available)"}
                    </p>
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-700">
                      {ayah.aya}
                    </span>
                  </div>

                  <p
                    className="leading-relaxed text-slate-700"
                    style={{ fontSize: `${settings.translationSize}px` }}
                  >
                    {lang === "eng"
                      ? ayah.textEnglish || "(English not available)"
                      : ayah.textBangla || "(Bangla not available)"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAyahs.length === 0 && (
            <Card className="border border-dashed border-slate-300 bg-white/70">
              <CardContent className="pt-6 text-center text-slate-600">
                No ayah matched your filter.
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onChange={handleSettingsChange}
        translationLanguage={lang}
        onTranslationLanguageChange={setLang}
      />
    </div>
  );
}