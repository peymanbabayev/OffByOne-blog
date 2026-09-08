import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" href="/" />
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Mühəndislik və Sistemlər Jurnalı</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Yazılar
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">
            Haqqımda
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            GitHub
          </a>
        </div>

        <p className="text-slate-400">
          © {currentYear} Bütün hüquqlar qorunur.
        </p>
      </div>
    </footer>
  );
}
