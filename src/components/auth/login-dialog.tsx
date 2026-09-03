'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, signup } from '@/app/login/actions'
import { Dictionary } from '@/lib/i18n/dictionaries'

export function LoginDialog({ dict, trigger }: { dict: Dictionary, trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger render={<div id="login-dialog-trigger" className="w-full" />}>
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button id="login-dialog-trigger" variant="outline" />}>
          {dict.app.login}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dict.auth.title}</DialogTitle>
          <DialogDescription>{dict.auth.desc}</DialogDescription>
        </DialogHeader>
        
        <form className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">{dict.auth.email}</Label>
            <Input id="email" name="email" type="email" required placeholder="m@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{dict.auth.password}</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <Button type="submit" formAction={login} className="w-full">
              {dict.auth.loginBtn}
            </Button>
            <Button type="submit" formAction={signup} variant="outline" className="w-full">
              {dict.auth.signupBtn}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
