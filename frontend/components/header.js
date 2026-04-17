import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo / Title */}
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-700 cursor-pointer">
            Quran Web App
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium">
            Home
          </Link>
          <Link href="/search" className="text-gray-700 hover:text-blue-700 font-medium">
            Search
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-700 font-medium">
            About
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? (
              // Close icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Home</Link>
          <Link href="/search" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Search</Link>
          <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">About</Link>
        </nav>
      )}
    </header>
  );
}