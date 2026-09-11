import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/i18n/dictionaries";
import Link from "@/i18n/navigation";
import SpotlightTrigger from "@/components/blog/SpotlightTrigger";
import BrandLogo from "@/components/ui/BrandLogo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import UserMenu from "./UserMenu";

/**
 * Server Component:
 * Bütün səhifələrdə görünən naviqasiya zolağı. Sessiyanı (JWT) serverdə yoxlayır və
 * istifadəçi vəziyyətinə görə ya `UserMenu`-nu, ya da qonaq düymələrini göstərir.
 */
export default async function Navbar() {
  const [user, dict] = await Promise.all([getCurrentUser(), getDictionary()]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo size="md" href="/" />

        <div className="flex items-center gap-1.5 text-sm sm:gap-3">
          <SpotlightTrigger />

          <nav className="hidden items-center gap-4 font-medium text-slate-600 md:flex dark:text-slate-400">
            <Link href="/" className="py-1 transition-colors hover:text-accent">
              {dict.nav.writings}
            </Link>
            <Link
              href="/about"
              className="py-1 transition-colors hover:text-accent"
            >
              {dict.nav.about}
            </Link>
          </nav>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 sm:gap-1.5 sm:pl-3 dark:border-slate-800">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/new-post"
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover sm:px-3.5 sm:py-2"
              >
                <span aria-hidden>+</span>
                <span>{dict.nav.newPost}</span>
              </Link>
              <div className="pl-1 sm:border-l sm:border-slate-200 sm:pl-3 dark:sm:border-slate-800">
                <UserMenu user={user} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:text-sm dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                {dict.nav.login}
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-hover sm:py-2 sm:text-sm"
              >
                {dict.nav.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
