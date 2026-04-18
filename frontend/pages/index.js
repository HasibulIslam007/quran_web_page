import { useState, useCallback, useMemo, useEffect } from "react";
import Header from "../components/header";
import SettingsPanel from "../components/SettingsPanel";
import Footer from "../components/footer";
import { getAllSurahsStatic } from "../lib/quranStaticData";
import { getArabicFontStack, normalizeArabicFont } from "../lib/arabicFont";
import { getLocalizedSurahLabel, rankSurahs } from "../lib/homeSearch";
import HomeSearchControls from "../components/home/HomeSearchControls";
import HomeSearchResults from "../components/home/HomeSearchResults";
import HomeSurahGrid from "../components/home/HomeSurahGrid";

export async function getStaticProps() {
  const surahs = getAllSurahsStatic();
  return { props: { surahs } };
}

export default function Home({ surahs }) {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("eng");
  const [settings, setSettings] = useState({
    arabicFont: "Amiri",
    arabicSize: 24,
    translationSize: 18,
    decorativeCards: true,
    darkMode: false,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load persisted settings
  useEffect(() => {
    const savedArabicFont = localStorage.getItem("arabicFont");
    const savedArabicSize = localStorage.getItem("arabicSize");
    const savedTranslationSize = localStorage.getItem("translationSize");
    const savedDecorativeCards = localStorage.getItem("decorativeCards");
    const savedDarkMode = localStorage.getItem("darkMode");
    setSettings({
      arabicFont: normalizeArabicFont(savedArabicFont || "Amiri"),
      arabicSize: savedArabicSize ? Number(savedArabicSize) : 24,
      translationSize: savedTranslationSize ? Number(savedTranslationSize) : 18,
      decorativeCards: savedDecorativeCards == null ? true : savedDecorativeCards === "true",
      darkMode: savedDarkMode === "true",
    });
  }, []);

  const handleSettingsChange = useCallback((newSettings) => {
    const normalizedArabicFont = normalizeArabicFont(newSettings.arabicFont);
    localStorage.setItem("arabicFont", normalizedArabicFont);
    localStorage.setItem("arabicSize", String(newSettings.arabicSize));
    localStorage.setItem("translationSize", String(newSettings.translationSize));
    localStorage.setItem("decorativeCards", String(Boolean(newSettings.decorativeCards)));
    localStorage.setItem("darkMode", String(Boolean(newSettings.darkMode)));
    document.documentElement.classList.toggle("dark", Boolean(newSettings.darkMode));
    window.dispatchEvent(new Event("quran-theme-change"));

    const normalizedSettings = {
      ...newSettings,
      arabicFont: normalizedArabicFont,
    };

    setSettings((prev) => {
      if (
        prev.arabicFont === normalizedSettings.arabicFont &&
        prev.arabicSize === normalizedSettings.arabicSize &&
        prev.translationSize === normalizedSettings.translationSize &&
        prev.decorativeCards === normalizedSettings.decorativeCards &&
        prev.darkMode === normalizedSettings.darkMode
      ) {
        return prev;
      }

      return normalizedSettings;
    });
  }, []);

  const handleSearch = () => {
    const ranked = rankSurahs(surahs, query, 12);
    setSearchResults(ranked);
  };

  const suggestions = useMemo(() => rankSurahs(surahs, query, 7), [query, surahs]);

  useEffect(() => {
    setSearchResults(suggestions);
  }, [suggestions]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950">
      {/* Header */}
      <Header
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onChange={handleSettingsChange}
        translationLanguage={lang === "ban" ? "ban" : "eng"}
        onTranslationLanguageChange={setLang}
      />

      <HomeSearchControls
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        lang={lang}
        onLangChange={setLang}
      />

      <HomeSearchResults
        results={searchResults}
        lang={lang}
        settings={settings}
        getArabicFontStack={getArabicFontStack}
        getResultLabel={(surah) => getLocalizedSurahLabel(surah, lang)}
      />

      <HomeSurahGrid
        surahs={surahs}
        settings={settings}
        lang={lang}
        getArabicFontStack={getArabicFontStack}
      />

      <Footer />
    </div>
  );
}