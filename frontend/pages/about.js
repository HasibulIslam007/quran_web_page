import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BookOpen, Globe, HeartHandshake, Search, Sparkles } from "lucide-react";

import Header from "../components/header";
import SettingsPanel from "../components/SettingsPanel";
import Footer from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const DEFAULT_SETTINGS = {
  arabicFont: "Amiri",
  arabicSize: 24,
  translationSize: 18,
  decorativeCards: true,
  darkMode: false,
};

export default function AboutPage() {
  const [lang, setLang] = useState("eng");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const normalizeArabicFont = (fontValue) => {
    const raw = String(fontValue || "").toLowerCase();
    if (raw.includes("scheherazade")) return "Scheherazade New";
    return "Amiri";
  };

  const getArabicFontStack = (fontValue) => {
    const normalized = normalizeArabicFont(fontValue);
    if (normalized === "Scheherazade New") {
      return "var(--font-arabic-scheherazade), var(--font-arabic-amiri), serif";
    }

    return "var(--font-arabic-amiri), serif";
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedArabicFont = localStorage.getItem("arabicFont");
    const savedArabicSize = localStorage.getItem("arabicSize");
    const savedTranslationSize = localStorage.getItem("translationSize");
    const savedDecorativeCards = localStorage.getItem("decorativeCards");
    const savedDarkMode = localStorage.getItem("darkMode");

    setSettings({
      arabicFont: normalizeArabicFont(savedArabicFont || DEFAULT_SETTINGS.arabicFont),
      arabicSize: savedArabicSize ? Number(savedArabicSize) : DEFAULT_SETTINGS.arabicSize,
      translationSize: savedTranslationSize ? Number(savedTranslationSize) : DEFAULT_SETTINGS.translationSize,
      decorativeCards:
        savedDecorativeCards == null
          ? DEFAULT_SETTINGS.decorativeCards
          : savedDecorativeCards === "true",
      darkMode: savedDarkMode === "true",
    });
  }, []);

  const handleSettingsChange = useCallback((next) => {
    if (typeof window !== "undefined") {
      const normalizedArabicFont = normalizeArabicFont(next.arabicFont);
      localStorage.setItem("arabicFont", normalizedArabicFont);
      localStorage.setItem("arabicSize", String(next.arabicSize));
      localStorage.setItem("translationSize", String(next.translationSize));
      localStorage.setItem("decorativeCards", String(Boolean(next.decorativeCards)));
      localStorage.setItem("darkMode", String(Boolean(next.darkMode)));
      document.documentElement.classList.toggle("dark", Boolean(next.darkMode));
      window.dispatchEvent(new Event("quran-theme-change"));

      setSettings({ ...next, arabicFont: normalizedArabicFont });
      return;
    }

    setSettings(next);
  }, []);

  const sectionCardClass = settings.decorativeCards
    ? "border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    : "border border-slate-200 bg-white";

  const pillars = [
    {
      title: "Easy Navigation",
      description: "Move from Surah list to detailed Ayah reading with a clean and simple structure.",
      icon: BookOpen,
    },
    {
      title: "Multilingual Reading",
      description: "Read with Arabic text and switch translation language between English and Bangla.",
      icon: Globe,
    },
    {
      title: "Meaningful Search",
      description: "Find Ayahs quickly using fast search and jump directly to the matching Surah.",
      icon: Search,
    },
    {
      title: "Personalized Experience",
      description: "Adjust Arabic font, text sizes, and appearance settings to match your reading comfort.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <Header
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onChange={handleSettingsChange}
        translationLanguage={lang}
        onTranslationLanguageChange={setLang}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 shadow-sm dark:border-emerald-200 dark:from-white dark:via-white dark:to-slate-50">
          <div className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl" />

          <div className="relative z-10">
            <p className="mb-3 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              About This Project
            </p>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Quran Web App for Calm, Focused Reading
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg">
              This web application is built to make Quran reading simple, beautiful, and accessible.
              It combines clear Surah navigation, multilingual support, and personalized settings so
              every reader can study with comfort and consistency.
            </p>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className={sectionCardClass}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-900">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-800">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className={sectionCardClass + " lg:col-span-2"}>
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-900">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-700 dark:text-slate-800">
                We aim to provide a focused Quran reading platform that respects both traditional
                reading habits and modern web usability. The app is intentionally lightweight and
                content-first, so users spend less time navigating and more time reflecting.
              </p>
              <p className="text-slate-700 dark:text-slate-800">
                From font and size controls to language toggles and dark mode, every feature is
                designed to support long reading sessions with comfort.
              </p>
            </CardContent>
          </Card>

          <Card className={sectionCardClass}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-900">
                <HeartHandshake className="h-5 w-5 text-rose-500" />
                Core Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-slate-700 dark:text-slate-800">
                <li>Clarity over clutter</li>
                <li>Accessibility for all readers</li>
                <li>Respect for Arabic text readability</li>
                <li>Simple and fast user experience</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-300 dark:bg-white">
          <p
            className="text-right text-slate-900"
            dir="rtl"
            style={{
              fontFamily: getArabicFontStack(settings.arabicFont),
              fontSize: `${settings.arabicSize}px`,
              lineHeight: 1.9,
            }}
          >
            وَقُل رَّبِّ زِدْنِي عِلْمًا
          </p>
          <p className="mt-2 text-slate-700 dark:text-slate-800" style={{ fontSize: `${settings.translationSize}px` }}>
            “My Lord, increase me in knowledge.” (Quran 20:114)
          </p>
        </section>

        <section className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center dark:border-slate-300 dark:bg-white">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-900">Start Exploring the Quran</h2>
            <p className="text-slate-700 dark:text-slate-800">
              Browse surahs, search ayahs, and personalize your reading experience.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="rounded-xl">
              <Link href="/">Go to Home</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/search">Open Search</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
