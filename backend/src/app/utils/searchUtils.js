const stripArabicDiacritics = (value = "") =>
  String(value)
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/\u0640/g, "");

const normalizeArabicChars = (value = "") =>
  String(value)
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه");

const normalizeWhitespace = (value = "") => String(value).replace(/\s+/g, " ").trim();

const normalizePunctuation = (value = "") =>
  String(value).replace(/[.,/#!$%^&*;:{}=\-_`~()\[\]"'<>?،؛!?|\\]/g, " ");

const normalizeText = (value = "", lang = "eng") => {
  let text = String(value).toLowerCase();

  if (lang === "arb") {
    text = stripArabicDiacritics(text);
    text = normalizeArabicChars(text);
  }

  text = normalizePunctuation(text);
  return normalizeWhitespace(text);
};

const tokenize = (value = "") => normalizeWhitespace(value).split(" ").filter(Boolean);

const computeScore = (source = "", query = "", queryTokens = []) => {
  if (!source || !query) return 0;

  let score = 0;
  if (source === query) score += 300;
  if (source.startsWith(query)) score += 180;
  if (source.includes(query)) score += 120;

  let matchedTokens = 0;
  for (const token of queryTokens) {
    if (source.includes(token)) matchedTokens += 1;
  }

  if (queryTokens.length > 0 && matchedTokens === queryTokens.length) score += 80;
  else score += matchedTokens * 20;

  return score;
};

module.exports = {
  stripArabicDiacritics,
  normalizeArabicChars,
  normalizeWhitespace,
  normalizePunctuation,
  normalizeText,
  tokenize,
  computeScore,
};
