import fs from "node:fs";
import path from "node:path";
import chaptersEn from "quran-json";
import chaptersBn from "quran-json/dist/chapters/bn/index.json";

const dataDir = path.resolve(process.cwd(), "../backend/data");

const readJson = (fileName) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, fileName), "utf8"));

const quranEng = readJson("ayats_en.json");
const quranBangla = readJson("ayats_bn.json");
const quranArabic = readJson("ayats_ar.json");

const surahNameMap = new Map(
  chaptersEn.map((chapter, idx) => [
    Number(chapter.id),
    {
      number: Number(chapter.id),
      nameArabic: chapter.name || "",
      nameEnglish: chapter.transliteration || `Surah ${chapter.id}`,
      nameBangla: chaptersBn[idx]?.translation || chapter.transliteration || `Surah ${chapter.id}`,
    },
  ]),
);

const getVerseNo = (item) => Number(item?.aya ?? item?.VerseIDAr ?? 0);

export function getAllSurahsStatic() {
  const grouped = {};
  quranEng.forEach((a) => {
    grouped[a.sura] = (grouped[a.sura] || 0) + 1;
  });

  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)
    .map((number) => {
      const known = surahNameMap.get(number) || {};
      return {
        number,
        nameArabic: known.nameArabic || "",
        nameEnglish: known.nameEnglish || `Surah ${number}`,
        nameBangla: known.nameBangla || "",
        ayahCount: grouped[number] || 0,
      };
    });
}

export function getSurahByIdStatic(surahId) {
  const id = Number(surahId);

  const ayEng = quranEng.filter((a) => Number(a.sura) === id);
  const ayBan = quranBangla.filter((a) => Number(a.sura) === id);
  const ayAr = quranArabic.filter((a) => Number(a.sura) === id);

  const banglaByVerse = new Map(ayBan.map((a) => [getVerseNo(a), a]));
  const arabicByVerse = new Map(ayAr.map((a) => [getVerseNo(a), a]));

  const ayahs = ayEng.map((a) => {
    const verseNo = getVerseNo(a);
    const bangla = banglaByVerse.get(verseNo);
    const arabic = arabicByVerse.get(verseNo);

    return {
      aya: a.aya,
      textEnglish: a.text,
      textBangla: bangla?.text || "",
      textArabic: arabic?.ayat || "",
    };
  });

  if (!ayahs.length) return null;

  const info = surahNameMap.get(id) || {};
  return {
    number: id,
    nameArabic: info.nameArabic || "",
    nameEnglish: info.nameEnglish || `Surah ${id}`,
    nameBangla: info.nameBangla || "",
    ayahs,
  };
}
