'use client'

import { Button } from '@/components/ui/button'
import { Dictionary } from '@/lib/i18n/dictionaries'
import { logout } from '@/app/login/actions'
import { LoginDialog } from '@/components/auth/login-dialog'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header({ user, dict, currentLang }: { user: any, dict: Dictionary, currentLang: string }) {
  const router = useRouter()

  const toggleLanguage = () => {
    const newLang = currentLang === 'th' ? 'en' : 'th'
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <header className="flex justify-between items-center pb-6 border-b">
      <div>
        <h1 className="text-3xl font-bold">{dict.app.title}</h1>
        {user ? (
          <p className="text-muted-foreground">{dict.app.welcome}, {user.email}</p>
        ) : (
          <p className="text-muted-foreground">{dict.app.subtitle}</p>
        )}
      </div>
      <div className="flex gap-4 items-center">
        <ThemeToggle />
        <Button variant="ghost" onClick={toggleLanguage}>
          {currentLang === 'th' ? 'EN' : 'TH'}
        </Button>
        {user ? (
          <form action={logout}>
            <Button variant="outline" type="submit">{dict.app.logout}</Button>
          </form>
        ) : (
          <LoginDialog dict={dict} />
        )}
      </div>
    </header>
  )
}
