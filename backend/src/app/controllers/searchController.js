/* global require, module */
/* eslint-disable @typescript-eslint/no-require-imports */
const { quranEng, quranBangla, quranArabic } = require("../utils/quranData");
const { normalizeText, tokenize, computeScore } = require("../utils/searchUtils");

// Fully merged search endpoint
const searchAyahs = (req, res) => {
  const rawQuery = req.query.q;
  const lang = req.query.lang || "eng"; // default English
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);

  if (!rawQuery) return res.status(400).json({ error: "Query missing" });

  const query = normalizeText(rawQuery, lang);
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return res.status(400).json({ error: "Query missing" });

  // Merge all three languages for results
  const results = quranEng.map((engAyah, idx) => {
    const arabicAyah = quranArabic[idx];
    const banglaAyah = quranBangla[idx];

    // Choose text for scoring based on selected lang
    let textForScore;
    if (lang === "eng") textForScore = engAyah.text;
    else if (lang === "ban") textForScore = banglaAyah.text;
    else textForScore = arabicAyah.ayat;

    const normalizedText = normalizeText(textForScore, lang);
    const score = computeScore(normalizedText, query, queryTokens);

    return {
      surah: Number(engAyah.sura),
      aya: lang === "arb" ? arabicAyah.VerseIDAr : engAyah.aya,
      textEnglish: engAyah.text,
      textBangla: banglaAyah.text,
      textArabic: arabicAyah.ayat,
      score,
    };
  })
  .filter(a => a.score > 0)
  .sort((a, b) => b.score - a.score || a.surah - b.surah || a.aya - b.aya)
  .slice(0, limit)
  .map(({ surah, aya, textEnglish, textBangla, textArabic }) => ({
    surah,
    aya,
    textEnglish,
    textBangla,
    textArabic
  }));

  res.json(results);
};

module.exports = { searchAyahs };