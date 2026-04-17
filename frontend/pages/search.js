import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("eng"); // Default language
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(
          query
        )}&lang=${lang}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
      setError("");
    } catch (err) {
      setError(err.message || "Error fetching search results");
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center">Search Ayahs</h1>

      {/* Search input */}
      <div className="flex justify-center space-x-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded p-2 w-80"
          placeholder="Search ayah text..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Language toggle */}
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

      {/* Error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Results */}
      <div className="space-y-4">
        {results.map((r, idx) => (
          <div key={idx} className="p-4 bg-white rounded shadow">
            <p className="font-semibold">
              Surah {r.surah} | Ayah {r.aya}
            </p>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}