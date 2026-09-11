import Link from "@/i18n/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Footer() {
  const dict = await getDictionary();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 text-xs text-slate-500 sm:flex-row sm:px-6 sm:text-sm lg:px-8 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" href="/" />
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 dark:text-slate-400">{dict.footer.tagline}</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
            {dict.footer.writings}
          </Link>
          <Link href="/about" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
            {dict.footer.about}
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            {dict.footer.github}
          </a>
        </div>

        <p className="text-slate-400 dark:text-slate-500">
          © {currentYear} {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
