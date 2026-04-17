import { useState } from "react";
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
  const [lang, setLang] = useState("eng"); // Default language

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {/* Surah Header */}
      <h1 className="text-3xl font-bold mb-4 text-center">
        {surah.nameArabic || `Surah ${surah.number}`} | {surah.nameEnglish} | {surah.nameBangla || ""}
      </h1>

      {/* Language toggle */}
      <div className="flex justify-center mb-6 space-x-4">
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

      {/* Ayahs */}
      <div className="space-y-6">
        {surah.ayahs.map((ayah) => (
          <div key={ayah.aya} className="p-4 bg-white rounded shadow">
            {/* Arabic text */}
            {lang === "arb" && (
              <p className="text-right text-2xl font-serif mb-2">
                {ayah.textArabic || "(Arabic not available)"}
              </p>
            )}
            {/* English or Bangla text */}
            {lang === "eng" && <p className="text-lg">{ayah.textEnglish || "(English not available)"}</p>}
            {lang === "ban" && <p className="text-lg">{ayah.textBangla || "(Bangla not available)"}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}