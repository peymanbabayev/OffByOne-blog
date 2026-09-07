import Link from "next/link";

/**
 * Server Component:
 * Bütün səhifələrdə birbaşa görünən naviqasiya zolağı.
 */
export default function Navbar() {
  return (
    <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-semibold text-lg text-slate-800 hover:text-slate-900 transition-colors"
        >
          Peyman's Blog
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-500 font-medium">
          <Link href="/" className="text-slate-900 hover:text-blue-600 transition-colors">
            Yazılar
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            Haqqımda
          </Link>
        </nav>
      </div>
    </header>
  );
}
