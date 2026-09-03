"use client";

import { Button } from "@/components/ui/button";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { logout } from "@/app/login/actions";
import { LoginDialog } from "@/components/auth/login-dialog";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header({
  user,
  dict,
  currentLang,
}: {
  user: any;
  dict: Dictionary;
  currentLang: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLang = currentLang === "th" ? "en" : "th";
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b gap-4">
      <div className="w-full md:w-auto flex flex-col gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{dict.app.title}</h1>
          {user ? (
            <p className="text-sm md:text-base text-muted-foreground">
              {dict.app.welcome},{" "}
              {user.user_metadata?.display_name || user.email}
            </p>
          ) : (
            <p className="text-sm md:text-base text-muted-foreground">
              {dict.app.subtitle}
            </p>
          )}
        </div>

        {user && (
          <nav className="flex items-center gap-4 mt-2">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-emerald-500",
                pathname === "/"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground",
              )}
            >
              {dict.app.navDashboard || "Dashboard"}
            </Link>
            <Link
              href="/transactions"
              className={cn(
                "text-sm font-medium transition-colors hover:text-emerald-500",
                pathname === "/transactions"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground",
              )}
            >
              {dict.app.navTransactions || "Transactions"}
            </Link>
          </nav>
        )}
      </div>
      <div className="flex gap-2 md:gap-4 items-center w-full md:w-auto justify-between md:justify-end">
        <div className="flex gap-2">
          <ThemeToggle />
          <Button variant="ghost" onClick={toggleLanguage}>
            {currentLang === "th" ? "EN" : "TH"}
          </Button>
        </div>
        {user ? (
          <form action={logout}>
            <Button variant="outline" type="submit">
              {dict.app.logout}
            </Button>
          </form>
        ) : (
          <LoginDialog dict={dict} />
        )}
      </div>
    </header>
  );
}
