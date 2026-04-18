import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomeSearchControls({
  query,
  onQueryChange,
  onSearch,
  lang,
  onLangChange,
}) {
  return (
    <>
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-[#065F46] dark:text-emerald-300">Quran Surahs</h1>
      </div>

      <div className="mx-auto mb-6 w-full max-w-xl px-4">
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <img
            src="/image.png"
            alt="Quran reading and search illustration"
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto flex space-x-2 mb-6">
        <Input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search surah name..."
          className="grow"
        />
        <Button onClick={onSearch} variant="default">
          Search
        </Button>
      </div>

      <div className="flex justify-center space-x-3 mb-8">
        {["eng", "ban"].map((language) => (
          <Button
            key={language}
            onClick={() => onLangChange(language)}
            variant={lang === language ? "default" : "outline"}
          >
            {language === "eng" ? "English" : "Bangla"}
          </Button>
        ))}
      </div>
    </>
  );
}
