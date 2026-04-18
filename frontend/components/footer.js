import Link from "next/link";
import { Heart, MoonStar } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-300">
        <div className="space-y-1">
          <p className="font-medium text-slate-800 dark:text-slate-100">Quran Web App</p>
          <p className="flex items-center gap-1">
            Built with care
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            for focused Quran reading.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/" className="transition hover:text-blue-700 dark:hover:text-emerald-300">
            Home
          </Link>
          <Link href="/search" className="transition hover:text-blue-700 dark:hover:text-emerald-300">
            Search
          </Link>
          <Link href="/about" className="transition hover:text-blue-700 dark:hover:text-emerald-300">
            About
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <MoonStar className="h-3.5 w-3.5" />
            Dark Mode Ready
          </span>
        </nav>

        <p className="text-xs text-slate-500 dark:text-slate-400">© {year} Quran Web App</p>
      </div>
    </footer>
  );
}
