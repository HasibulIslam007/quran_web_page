const { quranEng, quranBangla, quranArabic } = require("../utils/quranData");

// Static mapping of surah names in all three languages
const surahNames = [
  { number: 1, nameArabic: "الفاتحة", nameEnglish: "Al-Fatihah", nameBangla: "আল-ফাতিহা" },

];

// Helper: Merge ayahs by surah number
const getAyahsBySurah = (surahNumber) => {
  const ayEng = quranEng.filter(a => Number(a.sura) === surahNumber);
  const ayBan = quranBangla.filter(a => Number(a.sura) === surahNumber);
  const ayAr = quranArabic.filter(a => Number(a.sura) === surahNumber);

  return ayEng.map((a, idx) => ({
    aya: a.aya,
    textEnglish: a.text,
    textBangla: ayBan[idx]?.text || "",
    textArabic: ayAr[idx]?.text || "",
  }));
};

// Controller: return all surahs summary
const getAllSurahs = (req, res) => {
  // Count ayahs from English dataset
  const grouped = {};
  quranEng.forEach(a => { grouped[a.sura] = (grouped[a.sura] || 0) + 1; });

  const surahs = surahNames.map(s => ({
    number: s.number,
    nameArabic: s.nameArabic,
    nameEnglish: s.nameEnglish,
    nameBangla: s.nameBangla,
    ayahCount: grouped[s.number] || 0
  }));

  res.json(surahs);
};

// Controller: return all ayahs of a surah in 3 languages
const getSurahById = (req, res) => {
  const surahId = Number(req.params.id);
  const ayahs = getAyahsBySurah(surahId);

  if (!ayahs.length) return res.status(404).json({ error: "Surah not found" });

  const info = surahNames.find(s => s.number === surahId) || {};
  res.json({
    number: surahId,
    nameArabic: info.nameArabic,
    nameEnglish: info.nameEnglish,
    nameBangla: info.nameBangla,
    ayahs
  });
};

module.exports = { getAllSurahs, getSurahById };