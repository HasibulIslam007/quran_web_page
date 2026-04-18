import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Header from "../components/header";
import SettingsPanel from "../components/SettingsPanel";
import Footer from "../components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Toggle } from "../components/ui/toggle";

const DEFAULT_SETTINGS = {
	arabicFont: "Amiri",
	arabicSize: 24,
	translationSize: 18,
	decorativeCards: true,
	darkMode: false,
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function SearchPage() {
	const [query, setQuery] = useState("");
	const [lang, setLang] = useState("eng");
	const [settings, setSettings] = useState(DEFAULT_SETTINGS);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (typeof window === "undefined") return;

		const savedArabicFont = localStorage.getItem("arabicFont");
		const savedArabicSize = localStorage.getItem("arabicSize");
		const savedTranslationSize = localStorage.getItem("translationSize");
		const savedDecorativeCards = localStorage.getItem("decorativeCards");
		const savedDarkMode = localStorage.getItem("darkMode");

		setSettings({
			arabicFont: savedArabicFont || DEFAULT_SETTINGS.arabicFont,
			arabicSize: savedArabicSize ? Number(savedArabicSize) : DEFAULT_SETTINGS.arabicSize,
			translationSize: savedTranslationSize ? Number(savedTranslationSize) : DEFAULT_SETTINGS.translationSize,
			decorativeCards:
				savedDecorativeCards == null
					? DEFAULT_SETTINGS.decorativeCards
					: savedDecorativeCards === "true",
			darkMode: savedDarkMode === "true",
		});
	}, []);

	const handleSettingsChange = useCallback((next) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("arabicFont", next.arabicFont);
			localStorage.setItem("arabicSize", String(next.arabicSize));
			localStorage.setItem("translationSize", String(next.translationSize));
			localStorage.setItem("decorativeCards", String(Boolean(next.decorativeCards)));
			localStorage.setItem("darkMode", String(Boolean(next.darkMode)));
			document.documentElement.classList.toggle("dark", Boolean(next.darkMode));
			window.dispatchEvent(new Event("quran-theme-change"));
		}

		setSettings((prev) => {
			if (
				prev.arabicFont === next.arabicFont
				&& prev.arabicSize === next.arabicSize
				&& prev.translationSize === next.translationSize
				&& prev.decorativeCards === next.decorativeCards
				&& prev.darkMode === next.darkMode
			) {
				return prev;
			}

			return next;
		});
	}, []);

	const runSearch = useCallback(async () => {
		const trimmed = query.trim();
		if (!trimmed) {
			setResults([]);
			setError("");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const params = new URLSearchParams({ q: trimmed, lang, limit: "100" });
			const response = await fetch(`${API_BASE}/api/search?${params.toString()}`);

			if (!response.ok) {
				throw new Error("Failed to search ayahs");
			}

			const data = await response.json();
			setResults(Array.isArray(data) ? data : []);
		} catch (searchError) {
			setResults([]);
			if (searchError instanceof TypeError) {
				setError("Failed to fetch. Please make sure backend is running on http://localhost:3001.");
			} else {
				setError(searchError.message || "Search failed. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	}, [query, lang]);

	useEffect(() => {
		const trimmed = query.trim();
		if (!trimmed) {
			setResults([]);
			setError("");
			return;
		}

		const timerId = setTimeout(() => {
			runSearch();
		}, 250);

		return () => clearTimeout(timerId);
	}, [query, lang, runSearch]);

	const resultCountLabel = useMemo(() => {
		if (isLoading) return "Searching...";
		if (error) return "Search unavailable";
		if (!query.trim()) return "Type to search by ayah text";
		return `${results.length} result${results.length === 1 ? "" : "s"}`;
	}, [isLoading, error, query, results.length]);

	return (
		<div className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-950">
			<Header
				isSettingsOpen={isSettingsOpen}
				onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
			/>

			<SettingsPanel
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				settings={settings}
				onChange={handleSettingsChange}
				translationLanguage={lang}
				onTranslationLanguageChange={setLang}
			/>

			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
				<Card className="mb-6 border border-slate-200 bg-white shadow-sm dark:border-slate-300 dark:bg-white">
					<CardHeader className="pb-2">
						<CardTitle className="text-2xl text-slate-800 dark:text-slate-900">Search Ayahs</CardTitle>
						<p className="text-sm text-slate-600 dark:text-slate-700">
							Search in Arabic, English, or Bangla text and open the Surah directly.
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-col gap-3 sm:flex-row">
							<Input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search ayah text..."
								aria-label="Search ayah text"
							/>
							<Button type="button" onClick={runSearch} disabled={isLoading}>
								{isLoading ? "Searching" : "Search"}
							</Button>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<Toggle
								variant="outline"
								pressed={lang === "eng"}
								onPressedChange={(pressed) => {
									if (pressed) setLang("eng");
								}}
								aria-label="Search English translation"
							>
								English
							</Toggle>
							<Toggle
								variant="outline"
								pressed={lang === "ban"}
								onPressedChange={(pressed) => {
									if (pressed) setLang("ban");
								}}
								aria-label="Search Bangla translation"
							>
								Bangla
							</Toggle>
							<Toggle
								variant="outline"
								pressed={lang === "arb"}
								onPressedChange={(pressed) => {
									if (pressed) setLang("arb");
								}}
								aria-label="Search Arabic text"
							>
								Arabic
							</Toggle>
							<span className="ml-auto text-sm text-slate-500 dark:text-slate-700">{resultCountLabel}</span>
						</div>
					</CardContent>
				</Card>

				{error && (
					<Card className="mb-4 border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60">
						<CardContent className="pt-6 text-sm text-red-700 dark:text-red-200">{error}</CardContent>
					</Card>
				)}

				<div className="space-y-4">
					{results.map((ayah) => (
						<Card
							key={`${ayah.surah}-${ayah.aya}`}
							className={`border border-slate-200 transition-all duration-200 ${
								settings.decorativeCards
									? "bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md"
									: "bg-white/90 hover:bg-slate-50"
							}`}
						>
							<CardContent className="space-y-3 pt-6">
								<div className="flex items-start justify-between gap-3">
									<p
										className="flex-1 text-right leading-relaxed text-slate-900 dark:text-slate-900"
										dir="rtl"
										style={{
											fontFamily: settings.arabicFont,
											fontSize: `${settings.arabicSize}px`,
										}}
									>
										{ayah.textArabic || "(Arabic not available)"}
									</p>
									<span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-200 dark:text-slate-900">
										{ayah.surah}:{ayah.aya}
									</span>
								</div>

								<p className="leading-relaxed text-slate-700 dark:text-slate-800" style={{ fontSize: `${settings.translationSize}px` }}>
									{lang === "ban"
										? ayah.textBangla || "(Bangla not available)"
										: ayah.textEnglish || "(English not available)"}
								</p>

								<div className="flex items-center justify-end">
									<Button asChild size="sm" variant="outline" className="rounded-xl">
										<Link href={`/surah/${ayah.surah}`}>Open Surah</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					))}

					{!isLoading && !error && query.trim() && results.length === 0 && (
						<Card className="border border-dashed border-slate-300 bg-white/80 dark:border-slate-300 dark:bg-white">
							<CardContent className="pt-6 text-center text-slate-600 dark:text-slate-800">
								No ayah found for this search.
							</CardContent>
						</Card>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
