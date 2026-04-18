const { quranEng, quranBangla, quranArabic } = require("../utils/quranData");

const stripArabicDiacritics = (value) =>
  value
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/\u0640/g, "");

const normalizeArabicChars = (value) =>
  value
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه");

const normalizeWhitespace = (value) => value.replace(/\s+/g, " ").trim();

const normalizePunctuation = (value) =>
  value.replace(/[\u200F\u200E]/g, " ").replace(/[.,/#!$%^&*;:{}=\-_`~()\[\]"'<>?،؛!?|\\]/g, " ");

const normalizeText = (value, lang) => {
  const base = String(value || "").trim();
  if (!base) return "";

  if (lang === "arb") {
    return normalizeWhitespace(normalizePunctuation(normalizeArabicChars(stripArabicDiacritics(base))));
  }

  return normalizeWhitespace(normalizePunctuation(base.toLowerCase()));
};

const tokenize = (value) => value.split(" ").filter(Boolean);

const computeScore = (normalizedText, normalizedQuery, queryTokens) => {
  if (!normalizedText || !normalizedQuery) return 0;

  const textTokens = tokenize(normalizedText);
  const textTokenSet = new Set(textTokens);

  let score = 0;

  if (normalizedText === normalizedQuery) score += 300;
  if (normalizedText.startsWith(normalizedQuery)) score += 140;
  if (normalizedText.includes(normalizedQuery)) score += 100;

  for (const token of queryTokens) {
    if (textTokenSet.has(token)) {
      score += 45;
      continue;
    }

    if (normalizedText.includes(token)) {
      score += 20;
      continue;
    }

    return 0;
  }

  const firstPos = normalizedText.indexOf(normalizedQuery);
  if (firstPos >= 0) {
    score += Math.max(0, 25 - Math.floor(firstPos / 8));
  }

  return score;
};

const searchAyahs = (req, res) => {
  const rawQuery = req.query.q;
  const lang = req.query.lang || "eng"; // Default English
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);

  if (!rawQuery) return res.status(400).json({ error: "Query missing" });

  // Select dataset based on language
  let dataset;
  let textField;
  let ayaField;

  if (lang === "eng") dataset = quranEng;
  else if (lang === "ban") dataset = quranBangla;
  else if (lang === "arb") dataset = quranArabic;
  else return res.status(400).json({ error: "Invalid language" });

  if (lang === "arb") {
    textField = "ayat";
    ayaField = "VerseIDAr";
  } else {
    textField = "text";
    ayaField = "aya";
  }

  const query = normalizeText(rawQuery, lang);
  const queryTokens = tokenize(query);

  if (!queryTokens.length) {
    return res.status(400).json({ error: "Query missing" });
  }

  // Filter ayahs with ranked relevance
  const results = dataset
    .map((a) => {
      const text = String(a[textField] || "");
      const normalizedText = normalizeText(text, lang);
      const score = computeScore(normalizedText, query, queryTokens);

      return {
        surah: Number(a.sura),
        aya: Number(a[ayaField]),
        text,
        score,
      };
    })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score || a.surah - b.surah || a.aya - b.aya)
    .slice(0, limit)
    .map(({ surah, aya, text }) => ({ surah, aya, text }));

  res.json(results);
};

module.exports = { searchAyahs };