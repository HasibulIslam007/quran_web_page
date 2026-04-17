import { useCallback, useState } from "react";
import Link from "next/link";
import SettingsPanel from "../components/SettingsPanel";
import { getAllSurahsStatic } from "../lib/quranStaticData";

export async function getStaticProps() {
  try {
    const surahs = getAllSurahsStatic();
    return {
      props: { surahs },
    };
  } catch {
    return {
      props: { surahs: [] },
    };
  }
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

  const handleSettingsChange = useCallback((newSettings) => {
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

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}&lang=${lang}`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  };

  const getSurahLabel = (surah) => {
    if (lang === "arb") return surah.nameArabic || "(Arabic not available)";
    if (lang === "ban") return surah.nameBangla || "(Bangla not available)";
    return surah.nameEnglish || "(English not available)";
  };

  const getResultLabel = (result) => {
    if (lang === "arb") return result.textArabic || result.text || "(Arabic not available)";
    if (lang === "ban") return result.textBangla || result.text || "(Bangla not available)";
    return result.textEnglish || result.text || "(English not available)";
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Quran Surahs</h1>

      {/* Settings Panel */}
      <SettingsPanel onChange={handleSettingsChange} />

      {/* Search Box */}
      <div className="flex justify-center space-x-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ayah text..."
          className="border rounded p-2 w-80"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Language Toggle */}
      <div className="flex justify-center space-x-2 mb-6">
        <button
          onClick={() => setLang("eng")}
          className={`px-4 py-2 rounded ${lang === "eng" ? "bg-blue-500 text-white" : "bg-white border"}`}
        >
          English
        </button>
        <button
          onClick={() => setLang("ban")}
          className={`px-4 py-2 rounded ${lang === "ban" ? "bg-blue-500 text-white" : "bg-white border"}`}
        >
          Bangla
        </button>
        <button
          onClick={() => setLang("arb")}
          className={`px-4 py-2 rounded ${lang === "arb" ? "bg-blue-500 text-white" : "bg-white border"}`}
        >
          Arabic
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6 space-y-2">
          {searchResults.map((r, idx) => (
            <Link
              key={idx}
              href={`/surah/${r.surah}`}
              className="block p-2 bg-white rounded shadow hover:bg-blue-50"
            >
              <p
                className={lang === "arb" ? "text-right" : "text-left"}
                style={
                  lang === "arb"
                    ? { fontFamily: settings.arabicFont, fontSize: `${settings.arabicSize}px` }
                    : { fontSize: `${settings.translationSize}px` }
                }
              >
                {getResultLabel(r)}
              </p>
              <p className="text-gray-500 text-sm">Surah {r.surah} | Ayah {r.aya}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Surah List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {surahs.map((s) => (
          <li key={s.number} className="bg-white p-4 rounded shadow hover:bg-blue-50 transition">
            <Link href={`/surah/${s.number}`} className="block text-center">
              <p
                className={`text-xl font-semibold ${lang === "arb" ? "text-right" : "text-center"}`}
                style={
                  lang === "arb"
                    ? { fontFamily: settings.arabicFont, fontSize: `${settings.arabicSize}px` }
                    : { fontSize: `${settings.translationSize}px` }
                }
              >
                Surah {s.number} | {getSurahLabel(s)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}