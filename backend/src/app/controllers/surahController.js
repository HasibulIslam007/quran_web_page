const { quranEng, quranBangla, quranArabic } = require("../utils/quranData");
const quranChaptersEn = require("quran-json");
const quranChaptersBn = require("quran-json/dist/chapters/bn/index.json");

const surahNames = quranChaptersEn.map((chapter, index) => ({
  number: Number(chapter.id),
  nameArabic: chapter.name || "",
  nameEnglish: chapter.transliteration || `Surah ${chapter.id}`,
  // quran-json bn index provides Bengali translation labels for chapter names.
  nameBangla: quranChaptersBn[index]?.translation || chapter.transliteration || `Surah ${chapter.id}`,
}));

const surahNameMap = new Map(surahNames.map((s) => [s.number, s]));

const getVerseNumber = (record) =>
  Number(record?.aya ?? record?.VerseIDAr ?? record?.verse ?? 0);



// Helper: Merge ayahs by surah number
const getAyahsBySurah = (surahNumber) => {
  const ayEng = quranEng.filter(a => Number(a.sura) === surahNumber);
  const ayBan = quranBangla.filter(a => Number(a.sura) === surahNumber);
  const ayAr = quranArabic.filter(a => Number(a.sura) === surahNumber);

  const banglaByVerse = new Map(ayBan.map((a) => [getVerseNumber(a), a]));
  const arabicByVerse = new Map(ayAr.map((a) => [getVerseNumber(a), a]));

  return ayEng.map((a) => {
    const verseNo = getVerseNumber(a);
    const ban = banglaByVerse.get(verseNo);
    const ar = arabicByVerse.get(verseNo);

    return {
    aya: a.aya,
    textEnglish: a.text,
    textBangla: ban?.text || "",
    textArabic: ar?.ayat || ar?.text || "",
  };
  });
};

// Controller: return all surahs summary
const getAllSurahs = (req, res) => {
  const grouped = {};
  quranEng.forEach(a => { grouped[a.sura] = (grouped[a.sura] || 0) + 1; });

  const surahNumbers = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  const surahs = surahNumbers.map((number) => {
    const known = surahNameMap.get(number) || {};

    return {
      number,
      nameArabic: known.nameArabic || "",
      nameEnglish: known.nameEnglish || `Surah ${number}`,
      nameBangla: known.nameBangla || "",
      ayahCount: grouped[number] || 0,
    };
  });

  res.json(surahs);
};

// Controller: return all ayahs of a surah in 3 languages
const getSurahById = (req, res) => {
  const surahId = Number(req.params.id);
  const ayahs = getAyahsBySurah(surahId);

  if (!ayahs.length) return res.status(404).json({ error: "Surah not found" });

  const info = surahNameMap.get(surahId) || {};
  res.json({
    number: surahId,
    nameArabic: info.nameArabic || "",
    nameEnglish: info.nameEnglish || `Surah ${surahId}`,
    nameBangla: info.nameBangla || "",
    ayahs
  });
};

module.exports = { getAllSurahs, getSurahById };