import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import Header from "../components/header";
import SettingsPanel from "../components/SettingsPanel";
import { getAllSurahsStatic } from "../lib/quranStaticData";

// shadcn/ui components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  });
  const [searchResults, setSearchResults] = useState([]);

  // Load persisted settings
  useEffect(() => {
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
    localStorage.setItem("arabicFont", newSettings.arabicFont);
    localStorage.setItem("arabicSize", newSettings.arabicSize);
    localStorage.setItem("translationSize", newSettings.translationSize);
    setSettings(newSettings);
  }, []);

  const handleSearch = async () => {
    const ranked = rankSurahs(surahs, query, 12);
    setSearchResults(ranked);
  };

  const getSurahLabel = (s) =>
    lang === "arb" ? s.nameArabic || "(Arabic not available)"
    : lang === "ban" ? s.nameBangla || "(Bangla not available)"
    : s.nameEnglish || "(English not available)";

  const getResultLabel = (r) =>
    lang === "arb" ? r.nameArabic || "(Arabic not available)"
    : lang === "ban" ? r.nameBangla || "(Bangla not available)"
    : r.nameEnglish || "(English not available)";

  const stripArabicDiacritics = (value) =>
    String(value || "")
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
      .replace(/\u0640/g, "");

  const normalize = (value) =>
    stripArabicDiacritics(value)
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()\[\]"'<>?،؛!?|\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const scoreText = (source, queryText, tokens) => {
    if (!source || !queryText) return 0;
    let score = 0;
    if (source === queryText) score += 300;
    if (source.startsWith(queryText)) score += 180;
    if (source.includes(queryText)) score += 120;

    let matched = 0;
    for (const token of tokens) {
      if (source.includes(token)) matched += 1;
    }

    if (tokens.length && matched === tokens.length) score += 80;
    else score += matched * 20;

    return score;
  };

  const rankSurahs = (items, rawQuery, limit = 8) => {
    const queryText = normalize(rawQuery);
    if (!queryText) return [];

    const tokens = queryText.split(" ").filter(Boolean);

    return items
      .map((surah) => {
        const fields = [
          normalize(surah.nameEnglish),
          normalize(surah.nameBangla),
          normalize(surah.nameArabic),
          normalize(`surah ${surah.number}`),
          normalize(String(surah.number)),
        ];

        const score = fields.reduce((maxScore, field) => Math.max(maxScore, scoreText(field, queryText, tokens)), 0);

        return { ...surah, _score: score };
      })
      .filter((surah) => surah._score > 0)
      .sort((a, b) => b._score - a._score || a.number - b.number)
      .slice(0, limit);
  };

  const getSurahLinkLabel = (surah) =>
    lang === "arb" ? surah.nameArabic || "(Arabic not available)"
    : lang === "ban" ? surah.nameArabic || "(Bangla not available)"
    : surah.nameArabic || "(English not available)";

  const suggestions = useMemo(() => rankSurahs(surahs, query, 7), [query, surahs]);

  useEffect(() => {
    setSearchResults(suggestions);
  }, [suggestions]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <Header />

      {/* Page Title */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-[#065F46]">Quran Surahs</h1>
      </div>

      {/* Settings Panel */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <SettingsPanel onChange={handleSettingsChange} />
      </div>

      {/* Search Box */}
      <div className="max-w-3xl mx-auto flex space-x-2 mb-6">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search surah name..."
          className="flex-grow"
        />
        <Button onClick={handleSearch} variant="default">
          Search
        </Button>
      </div>

      {/* Language Toggle */}
      <div className="flex justify-center space-x-3 mb-8">
        {["eng", "ban", "arb"].map((l) => (
          <Button
            key={l}
            onClick={() => setLang(l)}
            variant={lang === l ? "default" : "outline"}
          >
            {l === "eng" ? "English" : l === "ban" ? "Bangla" : "Arabic"}
          </Button>
        ))}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8 space-y-3">
          {searchResults.map((r, idx) => (
            <Card key={idx} className="hover:bg-gray-50 cursor-pointer transition p-4 flex flex-col justify-between">
              <Link href={`/surah/${r.surah}`}>
                <p
                  className={lang === "arb" ? "text-right mb-1" : "text-left mb-1"}
                  style={
                    lang === "arb"
                      ? { fontFamily: settings.arabicFont, fontSize: `${settings.arabicSize}px` }
                      : { fontSize: `${settings.translationSize}px` }
                  }
                >
                  {getResultLabel(r)}
                </p>
                <p className="text-gray-500 text-sm">Surah {r.number}</p>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {/* Surah List */}
      <div className="max-w-6xl mx-auto px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {surahs.map((s) => (
            <li key={s.number}>
              <Card className="hover:bg-gray-50 cursor-pointer transition p-6 flex flex-col justify-between min-h-[160px]">
                <Link href={`/surah/${s.number}`}>
                  {/* Arabic + Surah number */}
                  <p
                    className="text-xl font-semibold text-right mb-2"
                    style={{ fontFamily: settings.arabicFont, fontSize: `${settings.arabicSize}px` }}
                  >
                    Surah {s.number} | {getSurahLinkLabel(s)}
                  </p>

                  {/* Conditional Translation */}
                  {lang === "eng" && <p className="text-center" style={{ fontSize: `${settings.translationSize}px` }}>{s.nameEnglish}</p>}
                  {lang === "ban" && <p className="text-center" style={{ fontSize: `${settings.translationSize}px` }}>{s.nameBangla || "(Bangla not available)"}</p>}
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}