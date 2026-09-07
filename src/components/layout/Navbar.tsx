import Link from "next/link";

/**
 * Server Component:
 * Bütün səhifələrdə birbaşa görünən naviqasiya zolağı.
 */
export default function Navbar() {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 font-bold text-lg text-slate-900 hover:text-blue-600 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
            P
          </span>
          <span className="tracking-tight">Peyman<span className="text-blue-600">.dev</span></span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-slate-600 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors py-1">
            Yazılar
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors py-1">
            Haqqımda
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <span>GitHub</span>
            <span className="text-slate-400">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
